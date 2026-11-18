/**
 * EJ2 PowerPoint Editor Type Definitions
 *
 * @module @syncfusion/ej2-pptxeditor
 */

import { FontResolutionMode, FontSubstitutionMap } from '../render/text/font-provider';
import { PictureRenderSnapshot } from '@syncfusion/ej2-pptx';

/**
 * Bounds of one chart frame in slide points.
 *
 * @internal
 */
export interface ChartFrameBounds {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

/**
 * Phase 1 metadata passed to an optional host chart renderer.
 *
 * @internal
 */
export interface ChartFrameInfo {
    readonly shapeId: string;
    readonly shapeName: string;
    readonly relationshipId?: string;
    readonly chartPartName?: string;
    readonly bounds: ChartFrameBounds;
    readonly rotationDegrees: number;
    readonly altText: string;
    readonly fallbackImage?: PictureRenderSnapshot;
    /** Opaque id for requesting the chart part XML from the package session (worker sessions). */
    readonly chartRequestId?: string;
}

/**
 * Cleanup returned by a host chart renderer.
 *
 * @internal
 */
export interface ChartRendererDisposable {
    dispose(): void;
}

/**
 * Optional Phase 2 extension seam. Phase 1 supplies metadata and a frame host only.
 *
 * @internal
 */
export type ChartRenderer = (
    frame: ChartFrameInfo,
    host: HTMLElement
) => void | ChartRendererDisposable;

/**
 * Editor state enumeration
 *
 * @type {string}
 */
export type EditorState =
    /** Component not yet initialized */
    | 'Uninitialized'
    /** Component initialization in progress */
    | 'Initializing'
    /** Document loading in progress */
    | 'Loading'
    /** Component ready for interaction */
    | 'Ready'
    /** Error occurred during initialization or loading */
    | 'Error'
    /** Component is being destroyed */
    | 'Destroying';

/**
 * Editor error codes
 *
 * @type {string}
 */
export type EditorError =
    /** Target element not found in DOM */
    | 'ElementNotFound'
    /** Invalid property value provided */
    | 'InvalidPropertyValue'
    /** Component not yet initialized */
    | 'NotInitialized'
    /** Component already initialized */
    | 'AlreadyInitialized'
    /** PPTX document load failed */
    | 'DocumentLoadFailed'
    /** Invalid PPTX format or structure */
    | 'InvalidDocument';

/**
 * Supported theme variants
 *
 * @type {string}
 */
export type ThemeVariant =
    /** Material Design 2 (default) */
    | 'Material'
    /** Google Material Design 3 */
    | 'Material3'
    /** Generic Bootstrap */
    | 'Bootstrap'
    /** Bootstrap 4 */
    | 'Bootstrap4'
    /** Bootstrap 5 */
    | 'Bootstrap5'
    /** Microsoft Fabric */
    | 'Fabric'
    /** Microsoft Fluent */
    | 'Fluent'
    /** Tailwind CSS */
    | 'Tailwind'
    /** High Contrast (WCAG AAA) */
    | 'HighContrast';

/**
 * PowerPoint Editor component properties
 *
 * @interface IEditorProperties
 */
export interface IEditorProperties {
    /** EJ2 locale used for editor strings. */
    locale?: string;

    /** Application font substitutions; entries override shipped defaults. */
    fontSubstitutions?: FontSubstitutionMap;

    /** Font candidate ordering. Authored installed fonts are preferred by default. */
    fontResolution?: FontResolutionMode;

    /** HTTPS-only opt-in policy for externally linked PPTX pictures. Default denies all. */
    externalImagePolicy?: ExternalImagePolicy;

    /**
     * Optional host chart renderer; omitted by default so charts remain accessible placeholders.
     *
     * @private
     */
    chartRenderer?: ChartRenderer;

    /**
     * Enables the injectable ThumbnailView feature at runtime.
     * The thumbnail panel renders only when the `ThumbnailView` module is injected
     * (via `PptxEditor.Inject(ThumbnailView)`) AND this property is true.
     *
     * @type {boolean}
     * @default true
     */
    enableThumbnail?: boolean;

    /**
     * Enables the injectable Toolbar feature at runtime.
     * The editor ribbon renders only when the `Toolbar` module is injected
     * (via `PptxEditor.Inject(Toolbar)`) AND this property is true.
     *
     * @type {boolean}
     * @default true
     */
    enableToolbar?: boolean;

    /**
     * Enables the injectable Navigation feature at runtime.
     * Slide navigation (keyboard nav keys and the navigation APIs) is active
     * only when the `Navigation` module is injected (via
     * `PptxEditor.Inject(Navigation)`) AND this property is true.
     *
     * @type {boolean}
     * @default true
     */
    enableNavigation?: boolean;

    /**
     * Enables the injectable Magnification feature at runtime.
     * Zoom control (setZoom, zoomIn, zoomOut, zoomTo100, fitToWindow,
     * fitWidth, fit-scale sync) is active only when the `Magnification`
     * module is injected (via `PptxEditor.Inject(Magnification)`) AND this
     * property is true.
     *
     * @type {boolean}
     * @default true
     */
    enableMagnification?: boolean;

    /**
     * Enables the injectable SlideShow feature at runtime.
     * Slideshow start/exit APIs are active only when the `SlideShow` module
     * is injected (via `PptxEditor.Inject(SlideShow)`) AND this property is
     * true.
     *
     * @type {boolean}
     * @default true
     */
    enableSlideShow?: boolean;
    /**
     * Unique identifier for the component
     *
     * @type {string}
     * @default undefined
     */
    id?: string;

    /**
     * Additional CSS classes to apply to root element
     *
     * @type {string}
     * @default undefined
     */
    className?: string;

    /**
     * Path to PPTX file (for future use in TASK-1016)
     *
     * @type {string}
     * @default undefined
     */
    documentPath?: string;

    /**
     * Binary content of PPTX file (for future use in TASK-1016)
     *
     * @type {ArrayBuffer}
     * @default undefined
     */
    documentContent?: ArrayBuffer;

    /** Maximum ZIP entries accepted from one presentation. */
    maxZipEntries?: number;

    /** Maximum sum of declared uncompressed ZIP entry bytes. */
    maxUncompressedBytes?: number;

    /** Maximum declared uncompressed bytes for one ZIP entry. */
    maxSinglePartBytes?: number;

    /** Maximum inflated-to-compressed ratio for one ZIP entry. */
    maxCompressionRatio?: number;

    /**
     * Presentation file name used for downloads and the ribbon file information.
     * When unset, the title is derived from {@link documentPath}.
     *
     * @type {string}
     * @default undefined
     */
    fileName?: string;

    /**
     * Enables the Download action.
     *
     * @type {boolean}
     * @default true
     */
    enableDownload?: boolean;

    /**
     * Enables the Print action.
     *
     * The browser print workflow itself is active only when the `Print`
     * module is injected (via `PptxEditor.Inject(Print)`) AND this property
     * is true.
     *
     * @type {boolean}
     * @default true
     */
    enablePrint?: boolean;

    /**
     * Enables the Home tab Copy action.
     *
     * @type {boolean}
     * @default true
     */
    enableCopy?: boolean;

    /**
     * When true, text on the main slide surface may be selected.
     *
     * @type {boolean}
     * @default true
     */
    enableTextSelection?: boolean;

    /**
     * Optional watermark label drawn over every slide. Empty hides it.
     *
     * @type {string}
     * @default ''
     */
    watermarkText?: string;

    /**
     * When true, enables the Home tab Undo action.
     *
     * @type {boolean}
     * @default false
     */
    canUndo?: boolean;

    /**
     * When true, enables the Home tab Redo action.
     *
     * @type {boolean}
     * @default false
     */
    canRedo?: boolean;

    /**
     * Ribbon layout mode (`Classic` | `Simplified`).
     * Editor default is Simplified (product requirement; EJ2 package default is Classic).
     *
     * @type {'Classic' | 'Simplified'}
     * @default 'Simplified'
     */
    ribbonLayout?: 'Classic' | 'Simplified';

    /**
     * Current slide index (0-based)
     *
     * @type {number}
     * @default 0
     */
    slideIndex?: number;

    /**
     * Whether the left thumbnail panel is expanded.
     *
     * @type {boolean}
     * @default true
     */
    thumbnailPanelVisible?: boolean;

    /**
     * Thumbnail panel width in CSS pixels (clamped 120–240; default ~184).
     *
     * @type {number}
     * @default 184
     */
    thumbnailPanelWidth?: number;

    /**
     * Zoom level in percentage (10-400)
     *
     * @type {number}
     * @default 100
     */
    zoom?: number;

    /**
     * Theme variant to apply
     *
     * @type {ThemeVariant | string}
     * @default ThemeVariant.Material
     */
    theme?: ThemeVariant | string;

    /**
     * Loading state (read-only)
     *
     * @type {boolean}
     * @default false
     */
    isLoading?: boolean;

    /**
     * Component ready state (read-only)
     *
     * @type {boolean}
     * @default false
     */
    isReady?: boolean;

    /**
     * ARIA label for screen readers
     *
     * @type {string}
     * @default "PowerPoint Presentation Editor"
     */
    ariaLabel?: string;

    /**
     * Tab index for keyboard navigation
     *
     * @type {number}
     * @default 0
     */
    tabIndex?: number;

    /**
     * ARIA role for accessibility
     *
     * @type {string}
     * @default "application"
     */
    role?: string;
}

/** Host-controlled limits for externally linked PPTX pictures. */
export interface ExternalImagePolicy {
    readonly mode: 'deny' | 'allow';
    readonly allowedHosts: ReadonlyArray<string>;
    readonly maximumBytes: number;
    readonly timeoutMs: number;
}

/**
 * Event arguments for created event
 *
 * @interface CreatedEventArgs
 */
export interface CreatedEventArgs {
    /** Component instance */
    sender?: object;
    /** Event name */
    name?: string;
    /** Timestamp of event */
    timestamp?: number;
    /** Editor state at event time */
    state?: EditorState;
}

/**
 * Event arguments for destroyed event
 *
 * @interface DestroyedEventArgs
 */
export interface DestroyedEventArgs {
    /** Component instance */
    sender?: object;
    /** Event name */
    name?: string;
    /** Timestamp of event */
    timestamp?: number;
    /** Indicates if destroy is planned or due to error */
    planned?: boolean;
}

/**
 * Event arguments for slide changed event
 *
 * @interface SlideChangedEventArgs
 */
export interface SlideChangedEventArgs {
    /** Component instance */
    sender?: object;
    /** Event name */
    name?: string;
    /** Previous slide index */
    previousIndex?: number;
    /** New slide index */
    newIndex?: number;
    /** Total slide count */
    slideCount?: number;
}

/**
 * Event arguments for slide load failed event
 *
 * @interface SlideLoadFailedEventArgs
 */
export interface SlideLoadFailedEventArgs {
    /** Component instance */
    sender?: object;
    /** Event name */
    name?: string;
    /** Error message */
    message?: string;
    /** Error type */
    errorCode?: EditorError;
}

/**
 * Event arguments for zoom changed event
 *
 * @interface ZoomChangedEventArgs
 */
export interface ZoomChangedEventArgs {
    /** Component instance */
    sender?: object;
    /** Event name */
    name?: string;
    /** Previous zoom level */
    previousZoom?: number;
    /** New zoom level */
    newZoom?: number;
    /** Zoom type (percentage, fitPage, fitWidth, etc.) */
    zoomType?: string;
}

/** Event arguments emitted while source bytes are acquired. */
export interface LoadProgressEventArgs {
    sender?: object;
    name?: string;
    loaded: number;
    total?: number;
    lengthComputable: boolean;
    percent?: number;
    sourceKind: 'url' | 'blob' | 'buffer' | 'base64';
}

/** Event arguments emitted after source validation and document acquisition. */
export interface DocumentLoadEventArgs {
    sender?: object;
    name?: string;
    bytesLoaded: number;
    fileName?: string;
    sourceKind: 'url' | 'blob' | 'buffer' | 'base64';
    slideCount?: number;
    parseMode?: 'worker' | 'main-thread';
    /** True when inert VBA packaging was detected. VBA is never executed. */
    hasMacros?: boolean;
    /** Complete implementation-status rows for direct content on the opened slide. */
    slideContent?: ReadonlyArray<import('../render/slide-content-status').SlideContentSummary>;
}

/** Event arguments emitted when source acquisition or document parsing fails. */
export interface LoadFailedEventArgs {
    sender?: object;
    name?: string;
    code: import('../load').PresentationLoadErrorCode;
    messageKey: string;
    status?: number;
    error: import('../load').PresentationLoadError;
}

/** One slide element that could not be rendered natively. */
export interface UnsupportedElementEventArgs {
    sender?: object;
    name?: string;
    slideIndex: number;
    shapeId: string;
    shapeName: string;
    elementType: 'smartArt' | 'ole' | 'media' | 'chart' | 'wordArt' |
    'ink' | 'metafile' | 'linkedPicture' | 'picture' | 'other';
    bounds: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
    reason: string;
    fallbackUsed: boolean;
}

/** Event arguments raised before a safe slide hyperlink navigates. */
export interface HyperlinkClickEventArgs {
    sender?: object;
    name?: string;
    slideIndex: number;
    shapeId: string;
    target?: string;
    tooltip?: string;
    action?: string;
    /** Set true in a handler to prevent the browser's default navigation. */
    cancel: boolean;
}

/**
 * PowerPoint Editor component events
 *
 * @interface IEditorEvents
 */
export interface IEditorEvents {
    /**
     * Triggered after component initialization completes
     *
     * @event created
     */
    created?: (args?: CreatedEventArgs) => void;

    /**
     * Triggered after component destruction
     *
     * @event destroyed
     */
    destroyed?: (args?: DestroyedEventArgs) => void;

    /**
     * Triggered when slide fails to load (deferred to TASK-1016)
     *
     * @event slideLoadFailed
     */
    slideLoadFailed?: (args?: SlideLoadFailedEventArgs) => void;

    /**
     * Triggered when slide changes (deferred to TASK-1030)
     *
     * @event slideChanged
     */
    slideChanged?: (args?: SlideChangedEventArgs) => void;

    /** Triggered after the effective zoom changes. */
    zoomChange?: (args?: ZoomChangedEventArgs) => void;

    /** Triggered after the active slide changes. */
    slideChange?: (args?: SlideChangedEventArgs) => void;

    /** Triggered as source bytes arrive. */
    loadProgress?: (args?: LoadProgressEventArgs) => void;

    /** Triggered after a presentation source is acquired and validated. */
    documentLoad?: (args?: DocumentLoadEventArgs) => void;

    /** Triggered when loading fails with a stable, localizable error. */
    loadFailed?: (args?: LoadFailedEventArgs) => void;

    /** Triggered once for every unsupported element or safe fallback. */
    unsupportedElement?: (args?: UnsupportedElementEventArgs) => void;

    /** Triggered before an http, https, or mailto slide hyperlink navigates. */
    hyperlinkClick?: (args?: HyperlinkClickEventArgs) => void;
}

/**
 * Internal editor state
 *
 * @interface _IEditorInternalState
 * @internal
 */
export interface _IEditorInternalState {
    /** Current editor state */
    state: EditorState;
    /** Whether component has been initialized */
    initialized: boolean;
    /** Whether component has been destroyed */
    destroyed: boolean;
    /** Current element reference */
    element?: HTMLElement;
    /** Previous properties for change detection */
    previousProperties?: Partial<IEditorProperties>;
    /** Event subscriptions map */
    eventSubscriptions?: Map<string, ((args?: unknown) => void)[]>;
}

/**
 * Property change model for onPropertyChanged
 *
 * @interface PropertyModel
 */
export interface PropertyModel {
    /** Property name */
    name?: string;
    /** New property value */
    value?: unknown;
    /** Old property value */
    oldValue?: unknown;
    /** Parent object containing property */
    parent?: object;
}
