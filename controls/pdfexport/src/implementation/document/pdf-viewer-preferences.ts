import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
import { PdfCatalog } from './pdf-catalog';
import { PdfDictionary } from './../primitives/pdf-dictionary';
import { PdfBoolean } from './../primitives/pdf-boolean';
import { PdfName } from './../primitives/pdf-name';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
/**
 * Defines the way the document is to be presented on the screen or in print.
 * ```typescript
 * // Create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * // Gets viewer preferences
 * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfViewerPreferences implements IPdfWrapper {
    /**
     * Initialize a new instance of `PdfViewerPreferences` class.
     *
     * @private
     * ```
    */
    constructor(catalog: PdfCatalog) {
        this._catalog = catalog;
    }
    _dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    _catalog: PdfCatalog;
    _centerWindow: boolean = false;
    _fitWindow: boolean = false;
    _displayTitle: boolean = false;
    _splitWindow: boolean = false;
    _hideMenuBar: boolean = false;
    _hideToolBar: boolean = false;
    _hideWindowUI: boolean = false;
    _pageMode: PdfPageMode = PdfPageMode.UseNone;
    _pageLayout: PdfPageLayout = PdfPageLayout.SinglePage;
    _dictionary: PdfDictionary = new PdfDictionary();
    _pageScaling: PageScalingMode;
    _duplex: DuplexMode = DuplexMode.None;
    /**
     * A flag specifying whether to position the document’s window in the center of the screen.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Gets the center window
     * let centerWindow : boolean = viewerPreferences.centerWindow;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get centerWindow(): boolean {
        return this._centerWindow;
    }
    /**
     * A flag specifying whether to position the document’s window in the center of the screen.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Sets the center window
     * viewerPreferences.centerWindow = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set centerWindow(value: boolean) {
        this._centerWindow = value;
        this._dictionary.items.setValue(this._dictionaryProperties.centerWindow, new PdfBoolean(this._centerWindow));
    }
    /**
     * A flag specifying whether the window’s title bar should display the document title taken 
     * from the Title entry of the document information dictionary. If false, the title bar 
     * should instead display the name of the PDF file containing the document.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Gets the display title
     * let displayTitle : boolean = viewerPreferences.displayTitle;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get displayTitle(): boolean {
        return this._displayTitle;
    }
    /**
     * A flag specifying whether the window’s title bar should display the document title taken 
     * from the Title entry of the document information dictionary. If false, the title bar 
     * should instead display the name of the PDF file containing the document.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Sets the display title
     * viewerPreferences.displayTitle = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set displayTitle(value: boolean) {
        this._displayTitle = value;
        this._dictionary.items.setValue(this._dictionaryProperties.displayTitle, new PdfBoolean(this._displayTitle));
    }
    /**
     * A flag specifying whether to resize the document’s window to fit the size of the first 
     * displayed page.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Gets the fit window
     * let fitWindow : boolean = viewerPreferences.fitWindow;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fitWindow(): boolean {
        return this._fitWindow;
    }
    /**
     * A flag specifying whether to resize the document’s window to fit the size of the first 
     * displayed page.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Sets the fit window
     * viewerPreferences.fitWindow = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set fitWindow(value: boolean) {
        this._fitWindow = value;
        this._dictionary.items.setValue(this._dictionaryProperties.fitWindow, new PdfBoolean(this._fitWindow));
    }
    /**
     * A flag specifying whether to hide the viewer application’s menu bar when the 
     * document is active.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Gets the hide menu bar
     * let hideMenuBar: boolean = viewerPreferences.hideMenuBar;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get hideMenuBar(): boolean {
        return this._hideMenuBar;
    }
    /**
     * A flag specifying whether to hide the viewer application’s menu bar when the 
     * document is active.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Sets the hide menu bar
     * viewerPreferences.hideMenuBar = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set hideMenuBar(value: boolean) {
        this._hideMenuBar = value;
        this._dictionary.items.setValue(this._dictionaryProperties.hideMenuBar, new PdfBoolean(this._hideMenuBar));
    }
    /**
     * A flag specifying whether to hide the viewer application’s tool bar when the 
     * document is active.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Gets the hide tool bar
     * let hideToolBar: boolean = viewerPreferences.hideToolBar;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get hideToolBar(): boolean {
        return this._hideToolBar;
    }
    /**
     * A flag specifying whether to hide the viewer application’s tool bar when the 
     * document is active.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Sets the hide tool bar
     * viewerPreferences.hideToolbar = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set hideToolBar(value: boolean) {
        this._hideToolBar = value;
        this._dictionary.items.setValue(this._dictionaryProperties.hideToolBar, new PdfBoolean(this._hideToolBar));
    }
    /**
     * A flag specifying whether to hide user interface elements in the document’s window 
     * (such as scroll bars and navigation controls), leaving only the document’s contents displayed.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Gets the hide window UI
     * let hideWindowUI: boolean = viewerPreferences.hideWindowUI;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get hideWindowUI(): boolean {
        return this._hideWindowUI;
    }
    /**
     * A flag specifying whether to hide user interface elements in the document’s window 
     * (such as scroll bars and navigation controls), leaving only the document’s contents displayed.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Sets the hide window UI
     * viewerPreferences.hideWindowUI = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set hideWindowUI(value: boolean) {
        this._hideWindowUI = value;
        this._dictionary.items.setValue(this._dictionaryProperties.hideWindowUI, new PdfBoolean(this._hideWindowUI));
    }
    /**
     * A name object specifying how the document should be displayed when opened.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Gets the page mode
     * let pageMode: PdfPageMode = viewerPreferences.pageMode;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get pageMode(): PdfPageMode {
        return this._pageMode;
    }
    /**
     * A name object specifying how the document should be displayed when opened.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Sets the page mode
     * viewerPreferences.pageMode = PdfPageMode.UseOutlines;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set pageMode(value: PdfPageMode) {
        this._pageMode = value;
        this._catalog.items.setValue(this._dictionaryProperties.pageMode, new PdfName(this._mapPageMode(this._pageMode)));
    }
    /**
     * Gets print duplex mode handling option to use when printing the file from the print dialog.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Gets the duplex
     * let duplex : DuplexMode = viewerPreferences.duplex;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get duplex(): DuplexMode {
        return this._duplex;
    }
    /**
     * Sets print duplex mode handling option to use when printing the file from the print dialog.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Sets the duplex
     * viewerPreferences.duplex = DuplexMode.DuplexFlipLongEdge;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set duplex(value: DuplexMode) {
        this._duplex = value;
        this._catalog.items.setValue(this._dictionaryProperties.duplex, new PdfName(this._mapDuplexMode(this._duplex)));
    }
    /**
     * A name object specifying the page layout to be used when the document is opened.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Gets the page layout
     * let pageLayout : PdfPageLayout = viewerPreferences.pageLayout;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get pageLayout(): PdfPageLayout {
        return this._pageLayout;
    }
    /**
     * A name object specifying the page layout to be used when the document is opened.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Sets the page layout
     * viewerPreferences.pageLayout = PdfPageLayout.TwoColumnLeft;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set pageLayout(value: PdfPageLayout) {
        this._pageLayout = value;
        this._catalog.items.setValue(this._dictionaryProperties.pageLayout, new PdfName(this._mapPageLayout(this._pageLayout)));
    }
    /**
     * Gets the page scaling option to be selected 
     * when a print dialog is displayed for this document.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Gets the page scaling
     * let pageScaling : PageScalingMode = viewerPreferences.pageScaling;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get pageScaling(): PageScalingMode {
        return this._pageScaling;
    }
    /**
     * Sets the page scaling option to be selected 
     * when a print dialog is displayed for this document.
     * ```typescript
     * // Create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // Gets the viewer preferences of the document
     * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
     * // Sets the page scaling
     * viewerPreferences.pageScaling = PageScalingMode.None;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set pageScaling(value: PageScalingMode) {
        this._pageScaling = value;
        if (this._pageScaling === PageScalingMode.AppDefault && this._dictionary.items.containsKey(this._dictionaryProperties.printScaling)) {
            this._dictionary.items.remove(this._dictionaryProperties.printScaling);
        } else if (this._pageScaling === PageScalingMode.None) {
            this._dictionary.items.setValue(this._dictionaryProperties.printScaling, new PdfName('None'));
        }
    }
    /**
     * Primivie element
     *
     * @private
     */
    get element(): IPdfPrimitive {
        return this._dictionary;
    }
    _mapDuplexMode(mode: DuplexMode): string {
        switch (mode) {
        case DuplexMode.Simplex:
            return 'Simplex';
        case DuplexMode.DuplexFlipShortEdge:
            return 'DuplexFlipShortEdge';
        case DuplexMode.DuplexFlipLongEdge:
            return 'DuplexFlipLongEdge';
        case DuplexMode.None:
            return 'None';
        }
    }
    _mapPageMode(mode: PdfPageMode): string {
        switch (mode) {
        case PdfPageMode.UseNone:
            return 'UseNone';
        case PdfPageMode.UseOutlines:
            return 'UseOutlines';
        case PdfPageMode.UseThumbs:
            return 'UseThumbs';
        case PdfPageMode.FullScreen:
            return 'FullScreen';
        case PdfPageMode.UseOC:
            return 'UseOC';
        case PdfPageMode.UseAttachments:
            return 'UseAttachments';
        }
    }
    _mapPageLayout(layout: PdfPageLayout): string {
        switch (layout) {
        case PdfPageLayout.SinglePage:
            return 'SinglePage';
        case PdfPageLayout.OneColumn:
            return 'OneColumn';
        case PdfPageLayout.TwoColumnLeft:
            return 'TwoColumnLeft';
        case PdfPageLayout.TwoColumnRight:
            return 'TwoColumnRight';
        case PdfPageLayout.TwoPageLeft:
            return 'TwoPageLeft';
        case PdfPageLayout.TwoPageRight:
            return 'TwoPageRight';
        }
    }
}
/**
 * Represents mode of document displaying.
 * ```typescript
 * // Create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * // Gets the viewer preferences of the document
 * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
 * // Sets the page mode
 * viewerPreferences.pageMode = PdfPageMode.UseOutlines;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfPageMode {
    /**
     * Default value. Neither document outline nor thumbnail images visible.
     */
    UseNone,
    /**
     * Document outline visible.
     */
    UseOutlines,
    /**
     * Thumbnail images visible.
     */
    UseThumbs,
    /**
     * Full-screen mode, with no menu bar, window controls, or any other window visible.
     */
    FullScreen,
    /**
     * Optional content group panel visible.
     */
    UseOC,
    /**
     * Attachments are visible.
     */
    UseAttachments
}
/**
 * A name object specifying the page layout to be used when the document is opened.
 * ```typescript
 * // Create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * // Gets the viewer preferences of the document
 * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
 * // Sets the page layout
 * viewerPreferences.pageLayout = PdfPageLayout.TwoColumnLeft;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PdfPageLayout {
    /**
     * Default Value. Display one page at a time.
     */
    SinglePage,
    /**
     * Display the pages in one column.
     */
    OneColumn,
    /**
     * Display the pages in two columns, with odd numbered
     * pages on the left.
     */
    TwoColumnLeft,
    /**
     * Display the pages in two columns, with odd numbered
     * pages on the right.
     */
    TwoColumnRight,
    /**
     * Display the pages two at a time, with odd-numbered pages on the left.
     */
    TwoPageLeft,
    /**
     * Display the pages two at a time, with odd-numbered pages on the right.
     */
    TwoPageRight
}
/**
 * The paper handling option to use when printing the file from the print dialog.
 * ```typescript
 * // Create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * // Gets the viewer preferences of the document
 * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
 * // Sets the duplex
 * viewerPreferences.duplex = DuplexMode.DuplexFlipLongEdge;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum DuplexMode {
    /**
     * Print single-sided.
     */
    Simplex,
    /**
     * Duplex and flip on the short edge of the sheet.
     */
    DuplexFlipShortEdge,
    /**
     * Duplex and flip on the long edge of the sheet.
     */
    DuplexFlipLongEdge,
    /**
     * Default value.
     */
    None
}
/**
 * Specifies the different page scaling option that shall be selected
 * when a print dialog is displayed for this document.
 * ```typescript
 * // Create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * // Gets the viewer preferences of the document
 * let viewerPreferences : PdfViewerPreferences = document.viewerPreferences;
 * // Sets the page scaling
 * viewerPreferences.pageScaling = PageScalingMode.None;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export enum PageScalingMode {
    /**
     * Indicates the conforming reader’s default print scaling.
     */
    AppDefault,
    /**
     * Indicates no page scaling.
     */
    None
}
