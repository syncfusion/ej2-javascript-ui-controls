import {} from './dom-compat';import { Component, EmitType, Event, Property, createElement, formatUnit, INotifyPropertyChanged, NotifyPropertyChanges } from '@syncfusion/ej2-base';import { Dialog } from '@syncfusion/ej2-popups';import { IEditorProperties, IEditorEvents, EditorState, EditorError, ThemeVariant, PropertyModel, _IEditorInternalState, CreatedEventArgs, DestroyedEventArgs, LoadProgressEventArgs, DocumentLoadEventArgs, LoadFailedEventArgs, UnsupportedElementEventArgs, ExternalImagePolicy, ChartRenderer, HyperlinkClickEventArgs, SlideChangedEventArgs, ZoomChangedEventArgs } from './base/types';import { acquirePresentationSource, AcquiredPresentation, PresentationLoadError, PresentationLoadErrorCode, PresentationLoadProgress, PresentationSource, PresentationSession, SlideRenderSnapshot, openPresentationSession, DEFAULT_PRESENTATION_SECURITY_LIMITS, LoadUi } from './load';import { summarizeSlideContent } from './render/slide-content-status';import { DEFAULT_PRESENTATION_TITLE, resolvePresentationTitle } from './title-bar';import { RibbonGroupInfo, RibbonItemInfo, RibbonLayoutMode, RibbonTabInfo } from './ribbon';import { Toolbar } from './ribbon/toolbar';import { Navigation } from './navigation/navigation';import { Magnification } from './magnification/magnification';import { ZoomDialog } from './magnification/zoom-dialog';import { SlideShow } from './slideshow/slideshow';import { SlideShowStartedEventArgs, SlideShowEndedEventArgs, SlideShowSlideChangedEventArgs, PresenterViewEventArgs } from './slideshow/slideshow-events';import { Print } from './print/print';import { DEFAULT_SLIDE_HEIGHT_PT, DEFAULT_SLIDE_WIDTH_PT, MainSlideArea, SlideFrameEmitter, ptToPx } from './main-slide';import { createTextMeasurer, renderSlide, TextMeasurer } from './render';import { localize } from './localization/localization';import { FontProvider, FontResolutionMode, FontResolutionNotice, FontSubstitution, FontSubstitutionMap, createFontProvider } from './render/text/font-provider';import { DEFAULT_PANEL_WIDTH_PX, clampPanelWidth } from './thumbnail-panel';import { ThumbnailView } from './thumbnail-panel/thumbnail-view';import { ModuleDeclaration } from '@syncfusion/ej2-base';import { DEFAULT_VIEW_MODE_LABEL, StatusBar } from './status-bar';import { NotesPane, NotesPaneModule } from './notes/notes-pane';import { NotesSnapshot } from './notes/notes-model';import { CurrentSlideChangedEventArgs, CurrentSlideNotesChangedEventArgs, NotesEventName, NotesPaneEventArgs } from './notes/notes-events';import { ClipboardPayload, SelectionFontState, clipboardPayloadForSelection, fontStateForSelection } from './semantic/semantic-clipboard';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class PptxEditor
 */
export interface PptxEditorModel extends ComponentModel{

    /**
     * Width of the editor host element. Accepts a number (pixels) or any CSS
     * length such as `'100%'` or `'800px'`.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Height of the editor host element. Accepts a number (pixels) or any CSS
     * length such as `'100%'` or `'600px'`.
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * Locale used by EJ2 localization.
     *
     * @default 'en-US'
     */
    locale?: string;

    /**
     * Application substitutions keyed by authored font family.
     *
     * @private
     */
    fontSubstitutions?: FontSubstitutionMap;

    /**
     * Candidate ordering used by both text measurement and DOM emission.
     *
     * @aspType string
     * @aspDefaultValue null
     * @aspJsonConverterIgnore
     *
     * @private
     */
    fontResolution?: FontResolutionMode;

    /**
     * HTTPS-only external picture policy. External access is denied by default.
     *
     * @private
     */
    externalImagePolicy?: ExternalImagePolicy;

    /**
     * Optional host renderer for C21 chart frames. Charts remain placeholders when omitted.
     *
     * @private
     */
    chartRenderer?: ChartRenderer | undefined;

    /**
     * Unique identifier for the component
     *
     * @type {string}
     * @aspType string
     */
    id?: string | undefined;

    /**
     * Additional CSS classes. ASP.NET wrappers use host HTML attributes because
     * ClassName is reserved for the client component constructor name.
     *
     * @type {string}
     * @aspIgnore
     */
    className?: string | undefined;

    /**
     * PPTX document path or URL. Set at construction or changed later, it is fetched and
     * loaded through the same path as {@link load}; failures raise `loadFailed`.
     *
     * @type {string}
     * @aspType string
     */
    documentPath?: string | undefined;

    /**
     * PPTX document binary content (deferred to TASK-1016)
     *
     * @type {ArrayBuffer}
     */
    documentContent?: ArrayBuffer | undefined;

    /**
     * Maximum ZIP entries accepted from one presentation.
     *
     * @default 10000
     *
     * @private
     */
    maxZipEntries?: number;

    /**
     * Maximum total declared uncompressed package bytes.
     *
     * @default 1073741824
     *
     * @private
     */
    maxUncompressedBytes?: number;

    /**
     * Maximum declared uncompressed bytes for one package part.
     *
     * @default 268435456
     *
     * @private
     */
    maxSinglePartBytes?: number;

    /**
     * Maximum uncompressed-to-compressed ratio for one package part.
     *
     * @default 200
     *
     * @private
     */
    maxCompressionRatio?: number;

    /**
     * Presentation file name used for downloads and the ribbon file information.
     * When unset, the title is derived from {@link documentPath}.
     *
     * @type {string}
     * @default undefined
     * @aspType string
     */
    fileName?: string | undefined;

    /**
     * Enables the Download action and {@link download}.
     *
     * @type {boolean}
     * @default true
     */
    enableDownload?: boolean;

    /**
     * Enables the Print action and {@link print}.
     *
     * The browser print workflow itself is active only when the `Print`
     * module is injected (`PptxEditor.Inject(Print)`) **and** this property
     * is `true`.
     *
     * @type {boolean}
     * @default true
     */
    enablePrint?: boolean;

    /**
     * Enables the Home tab Copy action and {@link copySelection}.
     *
     * @type {boolean}
     * @default true
     */
    enableCopy?: boolean;

    /**
     * Enables the injectable ThumbnailView feature at runtime.
     *
     * The left thumbnail panel renders only when the `ThumbnailView` module
     * is injected (`PptxEditor.Inject(ThumbnailView)`) **and** this property
     * is `true`. Toggling it re-creates or removes the panel on the next
     * refresh.
     *
     * @type {boolean}
     * @default true
     */
    enableThumbnail?: boolean;

    /**
     * Enables the injectable Toolbar feature at runtime.
     *
     * The editor ribbon renders only when the `Toolbar` module is injected
     * (`PptxEditor.Inject(Toolbar)`) **and** this property is `true`. Toggling
     * it re-creates or removes the ribbon on the next refresh.
     *
     * @type {boolean}
     * @default true
     */
    enableToolbar?: boolean;

    /**
     * Enables the injectable Navigation feature at runtime.
     *
     * Slide navigation (keyboard Arrow / PageUp / PageDown / Home / End,
     * the status-bar previous/next controls, and the navigation APIs) is
     * active only when the `Navigation` module is injected
     * (`PptxEditor.Inject(Navigation)`) **and** this property is `true`.
     * Toggling it enables or disables navigation immediately. The status-bar
     * controls stay visible but disabled while the feature is off.
     *
     * @type {boolean}
     * @default true
     */
    enableNavigation?: boolean;

    /**
     * Enables the injectable Magnification feature at runtime.
     *
     * Zoom control (`setZoom`, `zoomIn`, `zoomOut`, `zoomTo100`,
     * `fitToWindow`, `fitWidth`, and fit-scale display sync) is active only
     * when the `Magnification` module is injected
     * (`PptxEditor.Inject(Magnification)`) **and** this property is `true`.
     *
     * @type {boolean}
     * @default true
     */
    enableMagnification?: boolean;

    /**
     * Enables the injectable SlideShow feature at runtime.
     *
     * Slideshow start/exit APIs are active only when the `SlideShow` module
     * is injected (`PptxEditor.Inject(SlideShow)`) **and** this property is
     * `true`. Toggling it enables or disables the feature immediately.
     *
     * @type {boolean}
     * @default true
     */
    enableSlideShow?: boolean;

    /**
     * When true, text on the main slide surface may be selected.
     *
     * @type {boolean}
     * @default true
     */
    enableTextSelection?: boolean;

    /**
     * Optional watermark label drawn over every slide. Empty or whitespace hides it.
     *
     * @type {string}
     * @default ''
     *
     * @private
     */
    watermarkText?: string;

    /**
     * When true, enables the Slideshow tab start buttons. Default true when a
     * presentation is loaded; false when no presentation or during slideshow.
     *
     * @type {boolean}
     * @default true
     */
    canStartSlideShow?: boolean;

    /**
     * Ribbon layout mode.
     *
     * Product default is Simplified. Maps to EJ2 Ribbon `activeLayout`.
     *
     * @type {RibbonLayoutMode | string}
     * @default 'Simplified'
     * @aspType string
     * @aspDefaultValue 'Simplified'
     * @aspJsonConverterIgnore
     */
    ribbonLayout?: RibbonLayoutMode | string;

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
     * Desktop default is visible; mobile collapses via the panel module unless
     * the user overrides visibility (chevron / View → Show).
     *
     * @type {boolean}
     * @default true
     */
    thumbnailPanelVisible?: boolean;

    /**
     * Thumbnail panel width in CSS pixels (clamped 120–240 when applied).
     *
     * @type {number}
     * @default 184
     */
    thumbnailPanelWidth?: number;

    /**
     * Zoom level (10-400%)
     *
     * @type {number}
     * @default 100
     */
    zoom?: number;

    /**
     * Theme variant
     *
     * @type {ThemeVariant | string}
     * @default ThemeVariant.Material
     * @aspType string
     * @aspDefaultValue 'material'
     * @aspJsonConverterIgnore
     */
    theme?: ThemeVariant | string;

    /**
     * Component loading state (read-only)
     *
     * @type {boolean}
     * @default false
     *
     * @private
     */
    isLoading?: boolean;

    /**
     * Component ready state (read-only)
     *
     * @type {boolean}
     * @default false
     *
     * @private
     */
    isReady?: boolean;

    /**
     * ARIA label for screen readers
     *
     * @type {string}
     * @aspType string
     */
    ariaLabel?: string | undefined;

    /**
     * Tab index for keyboard navigation
     *
     * @type {number}
     * @default 0
     */
    tabIndex?: number;

    /**
     * ARIA role
     *
     * @type {string}
     * @default "application"
     */
    role?: string;

    /**
     * Created event emitted after initialization
     *
     * @event created
     * @returns {void} result
     */
    created?: EmitType<CreatedEventArgs>;

    /**
     * Destroyed event emitted after destruction
     *
     * @event destroyed
     * @returns {void} result
     */
    destroyed?: EmitType<DestroyedEventArgs>;

    /**
     * Progress emitted while presentation bytes are acquired.
     * @returns {void} result
     * @event loadProgress
     */
    loadProgress?: EmitType<LoadProgressEventArgs>;

    /**
     * Emitted after source acquisition and early validation succeed.
     * @returns {void} result
     * @event documentLoad
     */
    documentLoad?: EmitType<DocumentLoadEventArgs>;

    /**
     * Emitted when loading fails with a stable error code.
     * @returns {void} result
     * @event loadFailed
     */
    loadFailed?: EmitType<LoadFailedEventArgs>;

    /**
     * Emitted when slide content uses a placeholder or documented fallback.
     * @returns {void} result
     * @event unsupportedElement
     */
    unsupportedElement?: EmitType<UnsupportedElementEventArgs>;

    /**
     * Emitted before a safe slide hyperlink navigates.
     * @returns {void} result
     * @event hyperlinkClick
     *
     * @private
     */
    hyperlinkClick?: EmitType<HyperlinkClickEventArgs>;

    /**
     * Emitted when the active slide index changes.
     *
     * @returns {void} result
     * @event slideChange
     */
    slideChange?: EmitType<SlideChangedEventArgs>;

    /**
     * Emitted after the effective zoom percentage changes.
     * @returns {void} result
     * @event zoomChange
     */
    zoomChange?: EmitType<ZoomChangedEventArgs>;

    /**
     * Emitted after slideshow playback starts.
     * @returns {void} result
     * @event presentationStarted
     */
    presentationStarted?: EmitType<SlideShowStartedEventArgs>;

    /**
     * Emitted after slideshow playback ends.
     * @returns {void} result
     * @event presentationEnded
     */
    presentationEnded?: EmitType<SlideShowEndedEventArgs>;

    /**
     * Emitted when the slideshow's current slide changes.
     * @returns {void} result
     * @event slideChanged
     */
    slideChanged?: EmitType<SlideShowSlideChangedEventArgs>;

    /**
     * Emitted after Presenter View opens.
     * @returns {void} result
     * @event presenterViewOpened
     */
    presenterViewOpened?: EmitType<PresenterViewEventArgs>;

    /**
     * Emitted after Presenter View closes.
     * @returns {void} result
     * @event presenterViewClosed
     */
    presenterViewClosed?: EmitType<PresenterViewEventArgs>;

    /**
     * Emitted after the Notes Pane is shown.
     * @event notesPaneOpened
     * @returns {void} result
     */
    notesPaneOpened?: EmitType<NotesPaneEventArgs>;

    /**
     * Emitted after the Notes Pane is hidden.
     * @event notesPaneClosed
     * @returns {void} result
     */
    notesPaneClosed?: EmitType<NotesPaneEventArgs>;

    /**
     * Emitted when the notes shown for the active slide were (re)loaded.
     * @event currentSlideNotesChanged
     * @returns {void} result
     */
    currentSlideNotesChanged?: EmitType<CurrentSlideNotesChangedEventArgs>;

    /**
     * Emitted when the active slide changes.
     * @event currentSlideChanged
     * @returns {void} result
     */
    currentSlideChanged?: EmitType<CurrentSlideChangedEventArgs>;

    /**
     * When true, enables the Home tab Undo action. Default false until a history
     * stack is available.
     *
     * @type {boolean}
     * @default false
     *
     * @private
     */
    canUndo?: boolean;

    /**
     * When true, enables the Home tab Redo action. Default false until a history
     * stack is available.
     *
     * @type {boolean}
     * @default false
     *
     * @private
     */
    canRedo?: boolean;

}