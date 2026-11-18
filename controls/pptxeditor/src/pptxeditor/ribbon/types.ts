/**
 * Ribbon public types and stable built-in IDs for the EJ2 PowerPoint Editor.
 *
 * @module @syncfusion/ej2-pptxeditor/ribbon
 */

import { SelectionFontState } from '../semantic/semantic-clipboard';

/**
 * Public ribbon layout mode.
 * Maps to EJ2 `RibbonLayout.Classic` | `RibbonLayout.Simplified`.
 * Editor default is {@link RibbonLayoutMode.Simplified}.
 */
export type RibbonLayoutMode = 'Classic' | 'Simplified';

/**
 * Built-in ribbon tab identifiers (stable for customization APIs).
 */
export const RibbonTabId: { Home: string; SlideShow: string; View: string; } = {
    Home: 'pptx-ribbon-tab-home',
    SlideShow: 'pptx-ribbon-tab-slideshow',
    View: 'pptx-ribbon-tab-view'
};

/**
 * Built-in Home, Slideshow and View tab group identifiers.
 */
interface RibbonGroupIds {
    Clipboard: string;
    StartSlideShow: string;
    Zoom: string;
    Show: string;
    Font: string;
    Presenter: string;
}

/** Stable built-in ribbon group identifiers for customization APIs. */
export const RibbonGroupId: RibbonGroupIds = {
    Clipboard: 'pptx-ribbon-group-clipboard',
    StartSlideShow: 'pptx-ribbon-group-start-slide-show',
    Zoom: 'pptx-ribbon-group-zoom',
    Show: 'pptx-ribbon-group-show',
    Font: 'pptx-ribbon-group-font',
    Presenter: 'pptx-ribbon-group-presenter'
};

/**
 * Built-in File menu, Home, Slideshow and View item identifiers.
 */
interface RibbonItemIds {
    OpenDevice: string;
    Download: string;
    PrintAll: string;
    Copy: string;
    StartFromBeginning: string;
    StartFromCurrent: string;
    PresenterView: string;
    FitWindow: string;
    ShowThumbnails: string;
    ShowNotes: string;
    ZoomDropdown: string;
    FontFamily: string;
    FontSize: string;
    FontBold: string;
    FontItalic: string;
    FontUnderline: string;
    FontStrikethrough: string;
    FontReadOnly: string;
}

/** Stable built-in ribbon item identifiers for customization APIs. */
export const RibbonItemId: RibbonItemIds = {
    OpenDevice: 'pptx-ribbon-open-device',
    Download: 'pptx-ribbon-download',
    PrintAll: 'pptx-ribbon-print-all',
    Copy: 'pptx-ribbon-copy',
    StartFromBeginning: 'pptx-ribbon-start-from-beginning',
    StartFromCurrent: 'pptx-ribbon-start-from-current',
    PresenterView: 'pptx-ribbon-presenter-view',
    FitWindow: 'pptx-ribbon-fit-window',
    ShowThumbnails: 'pptx-ribbon-show-thumbnails',
    ShowNotes: 'pptx-ribbon-show-notes',
    ZoomDropdown: 'pptx-ribbon-zoom-dropdown',
    FontFamily: 'pptx-ribbon-font-family',
    FontSize: 'pptx-ribbon-font-size',
    FontBold: 'pptx-ribbon-font-bold',
    FontItalic: 'pptx-ribbon-font-italic',
    FontUnderline: 'pptx-ribbon-font-underline',
    FontStrikethrough: 'pptx-ribbon-font-strikethrough',
    FontReadOnly: 'pptx-ribbon-font-read-only'
};

/**
 * Integrator-facing ribbon item descriptor (Document Editor–style naming).
 * Used by public customization methods; not an EJ2 ChildProperty class.
 */
export interface RibbonItemInfo {
    /** Unique item id. */
    id: string;
    /** Visible label text. */
    text?: string;
    /** Icon CSS class list. */
    iconCss?: string;
    /** When true, item starts disabled. */
    disabled?: boolean;
    /** When false, item is hidden after add (optional). */
    visible?: boolean;
    /** Tooltip content. */
    tooltip?: string;
    /** Click handler for button items. */
    clicked?: () => void;
}

/**
 * Integrator-facing ribbon group descriptor.
 */
export interface RibbonGroupInfo {
    /** Unique group id. */
    id: string;
    /** Group header text. */
    header?: string;
    /** Items in the primary collection. */
    items?: RibbonItemInfo[];
    /** When false, group is hidden after add (optional). */
    visible?: boolean;
}

/**
 * Integrator-facing ribbon tab descriptor.
 */
export interface RibbonTabInfo {
    /** Unique tab id. */
    id: string;
    /** Tab header text. */
    header?: string;
    /** Groups on the tab. */
    groups?: RibbonGroupInfo[];
    /** When false, tab is hidden after add (optional). */
    visible?: boolean;
}

/**
 * Host contract implemented by {@link PptxEditor}.
 * Keeps File/Home actions on the editor so the ribbon and other chrome share one path.
 */
export interface RibbonHost {
    /** Whether the shell is rendered right-to-left. */
    readonly enableRtl?: boolean;
    /** Editor root element. */
    readonly element: HTMLElement;
    /** Current EJ2 locale used for ribbon text. */
    readonly locale?: string;
    /** Explicit presentation file name, if set. */
    fileName: string | undefined;
    /** Document path or URL. */
    documentPath: string | undefined;
    /** In-memory PPTX content, if set. */
    documentContent: ArrayBuffer | undefined;
    /** When false, download controls are disabled. */
    enableDownload: boolean;
    /** When false, print controls are disabled. */
    enablePrint: boolean;
    /** When false, Home Copy is disabled. Default true. */
    enableCopy: boolean;
    /** When true, Home Undo is enabled. Default false until history exists. */
    canUndo: boolean;
    /** When true, Home Redo is enabled. Default false until history exists. */
    canRedo: boolean;
    /** Current zoom percentage (10–400). */
    zoom: number;
    /** Public ribbon layout property. */
    ribbonLayout: RibbonLayoutMode | string;
    /** Downloads the original PPTX. */
    download(): void;
    /** Opens the print workflow. */
    print(): void;
    /** Opens a presentation from a local File (device picker). */
    openFromFile(file: File): void;
    /** Opens a presentation from a URL string. */
    openFromUrl(url: string): void;
    /** Copies the selected slide text to the clipboard (no-op without a selection). */
    copySelection(): void;
    /**
     * Whether slide text is currently selected. Optional; when absent Home Copy
     * stays enabled. When `false`, Home Copy is disabled (PowerPoint behaviour).
     */
    hasSlideTextSelection?: boolean;
    /**
     * Character formatting of the selected slide text, aggregated like PowerPoint's
     * Font group, or `undefined` when no text is selected. Optional.
     */
    getSelectionFontState?(): SelectionFontState | undefined;
    /** Undo last editor history action (MVP may announce unavailable). */
    undo(): void;
    /** Redo last undone editor history action. */
    redo(): void;
    /** Opens Find entry (MVP prompt; full search deferred). */
    openFind(): void;
    /** When true, slideshow start buttons are enabled. Default true when presentation loaded. */
    canStartSlideShow?: boolean;
    /** Starts slideshow playback from slide 1. */
    startSlideShowFromBeginning(): void;
    /** Starts slideshow playback from current slide index. */
    startSlideShowFromCurrent(): void;
    /** Exits slideshow playback and returns to normal viewing. */
    exitSlideShow(): void;
    /** Sets zoom percentage (clamped to 10–400). */
    setZoom(percent: number): void;
    /** Increases zoom by one step. */
    zoomIn(): void;
    /** Decreases zoom by one step. */
    zoomOut(): void;
    /** Fit whole slide in the view area (MVP entry; layout deferred). */
    fitToWindow(): void;
    /** Fit slide width in the view area (MVP entry; layout deferred). */
    fitWidth(): void;
    /** Sets zoom to 100%. */
    zoomTo100(): void;
    /** Enters default reading / normal view mode. */
    setReadingView(): void;
    /** Opens presenter view entry (MVP deferred). */
    startPresenterView(): void;
    /** Toggles fullscreen on the editor root. */
    toggleFullscreen(): void;
    /** Returns whether the editor root is fullscreen. */
    isFullscreen(): boolean;
    /** Exits fullscreen when the editor is the fullscreen element. */
    exitFullscreen(): void;
    /** Opens the Keyboard Shortcuts help dialog. */
    openKeyboardShortcuts(): void;
    /** Opens the About PowerPoint Editor dialog (version and license). */
    openAbout(): void;
    /** Opens the Zoom dialog (fit options, presets and a custom percentage). */
    openZoomDialog?(): void;
    /** Whether the Notes Pane is currently shown. */
    notesPaneVisible?: boolean;
    /** Toggles the Notes Pane. */
    toggleNotesPane?(): void;
    /**
     * Whether the left thumbnail panel is expanded.
     * Optional until thumbnail chrome is mounted; View Show uses this when present.
     */
    isThumbnailPanelVisible?(): boolean;
    /**
     * Expands or collapses the left thumbnail panel (chevron / View → Show).
     * Optional until thumbnail chrome is mounted.
     */
    setThumbnailPanelVisible?(visible: boolean): void;
    /** Optional status announce via the editor live region. */
    announce?(message: string): void;
    /**
     * Whether the injectable ThumbnailView module is attached.
     * Optional; assumed `true` when absent (non-editor hosts). When `false`,
     * View → Show → Thumbnails is disabled because the feature cannot mount.
     */
    hasThumbnailModule?: boolean;
    /**
     * Whether the injectable Magnification module is attached.
     * Optional; assumed `true` when absent (non-editor hosts). When `false`,
     * View → Zoom controls are disabled because zoom is inert.
     */
    hasMagnificationModule?: boolean;
    /** Whether the slide is currently in fit-to-window mode (optional; defaults to true). */
    isFitToWindowActive?: boolean;
    /**
     * Whether the injectable SlideShow module is attached.
     * Optional; assumed `true` when absent (non-editor hosts). When `false`,
     * Slide Show tab start buttons are disabled.
     */
    hasSlideShowModule?: boolean;
    /**
     * Whether the injectable Print module is attached.
     * Optional; assumed `true` when absent (non-editor hosts). When `false`,
     * File → Print controls are disabled because the workflow is inert.
     */
    hasPrintModule?: boolean;
}

/**
 * Placeholder text for Info fields not yet wired to OOXML metadata.
 */
export const RIBBON_INFO_PLACEHOLDER: string = '—';
