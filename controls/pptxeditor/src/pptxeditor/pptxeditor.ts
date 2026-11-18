import {} from './dom-compat';

/**
 * EJ2 PowerPoint Editor Component
 *
 * @module @syncfusion/ej2-pptxeditor
 *
 * A read-only presentation editor component extending EJ2's Component<HTMLElement> base class.
 * Provides lifecycle management, property binding, event system, and accessibility support.
 *
 * @example
 * ```typescript
 * const editor = new PptxEditor({
 *   theme: 'material3',
 *   zoom: 100,
 *   ariaLabel: 'My Presentation Editor'
 * }, '#editor-container');
 * ```
 */

import { Component, EmitType, Event, Property, createElement, formatUnit, INotifyPropertyChanged, NotifyPropertyChanges } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { IEditorProperties, IEditorEvents, EditorState, EditorError, ThemeVariant, PropertyModel, _IEditorInternalState, CreatedEventArgs, DestroyedEventArgs, LoadProgressEventArgs, DocumentLoadEventArgs, LoadFailedEventArgs, UnsupportedElementEventArgs, ExternalImagePolicy, ChartRenderer, HyperlinkClickEventArgs, SlideChangedEventArgs, ZoomChangedEventArgs } from './base/types';
import { acquirePresentationSource, AcquiredPresentation, PresentationLoadError, PresentationLoadErrorCode, PresentationLoadProgress, PresentationSource, PresentationSession, SlideRenderSnapshot, openPresentationSession, DEFAULT_PRESENTATION_SECURITY_LIMITS, LoadUi } from './load';
import { summarizeSlideContent } from './render/slide-content-status';
import { DEFAULT_PRESENTATION_TITLE, resolvePresentationTitle } from './title-bar';
import { RibbonGroupInfo, RibbonItemInfo, RibbonLayoutMode, RibbonTabInfo } from './ribbon';
import { Toolbar } from './ribbon/toolbar';
import { Navigation } from './navigation/navigation';
import { Magnification } from './magnification/magnification';
import { ZoomDialog } from './magnification/zoom-dialog';
import { SlideShow } from './slideshow/slideshow';
import { SlideShowStartedEventArgs, SlideShowEndedEventArgs, SlideShowSlideChangedEventArgs, PresenterViewEventArgs } from './slideshow/slideshow-events';
import { Print } from './print/print';
import { DEFAULT_SLIDE_HEIGHT_PT, DEFAULT_SLIDE_WIDTH_PT, MainSlideArea, SlideFrameEmitter, ptToPx } from './main-slide';
import { createTextMeasurer, renderSlide, TextMeasurer } from './render';
import { localize } from './localization/localization';
import { FontProvider, FontResolutionMode, FontResolutionNotice, FontSubstitution, FontSubstitutionMap, createFontProvider } from './render/text/font-provider';
import { DEFAULT_PANEL_WIDTH_PX, clampPanelWidth } from './thumbnail-panel';
import { ThumbnailView } from './thumbnail-panel/thumbnail-view';
import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { DEFAULT_VIEW_MODE_LABEL, StatusBar } from './status-bar';
import { NotesPane, NotesPaneModule } from './notes/notes-pane';
import { NotesSnapshot } from './notes/notes-model';
import { CurrentSlideChangedEventArgs, CurrentSlideNotesChangedEventArgs, NotesEventName, NotesPaneEventArgs } from './notes/notes-events';
import { ClipboardPayload, SelectionFontState, clipboardPayloadForSelection, fontStateForSelection } from './semantic/semantic-clipboard';

/**
 * OOXML Presentation content type used for blob downloads.
 */
const PPTX_CONTENT_TYPE: string =
  'application/vnd.openxmlformats-officedocument.presentationml.presentation';

type ClipboardItemLike = object;

interface ClipboardItemConstructorLike {
    new (data: { [mimeType: string]: Blob }): ClipboardItemLike;
}

interface RichClipboard extends Clipboard {
    write(items: ReadonlyArray<ClipboardItemLike>): Promise<void>;
}

/**
 * Fallback download file name when no presentation title is available.
 */
const DEFAULT_DOWNLOAD_FILE_NAME: string = 'presentation.pptx';

/**
 * Editor package version shown in the About dialog.
 * Kept in sync with `package.json` `"version"`.
 */
export const EDITOR_VERSION: string = '0.0.0';

/**
 * License notice from package metadata (no remote license fetch).
 */
const EDITOR_LICENSE_NOTICE: string = 'SEE LICENSE IN license';

/**
 * PowerPoint Editor Component
 *
 * A comprehensive PPTX editor component that extends EJ2's Component<HTMLElement>.
 * Provides property binding, event system, lifecycle management, and accessibility support.
 *
 * @constructor
 * @extends Component
 *
 * @example
 * ```typescript
 * const editor = new PptxEditor({}, '#container');
 * ```
 */
@NotifyPropertyChanges
export class PptxEditor extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Width of the editor host element. Accepts a number (pixels) or any CSS
     * length such as `'100%'` or `'800px'`.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Height of the editor host element. Accepts a number (pixels) or any CSS
     * length such as `'100%'` or `'600px'`.
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;

    /**
     * Locale used by EJ2 localization.
     *
     * @default 'en-US'
     */
    @Property('en-US')
    public locale: string;

    /**
     * Application substitutions keyed by authored font family.
     *
     * @private
     */
    @Property({})
    public fontSubstitutions: FontSubstitutionMap;

    /**
     * Candidate ordering used by both text measurement and DOM emission.
     *
     * @aspType string
     * @aspDefaultValue null
     * @aspJsonConverterIgnore
     *
     * @private
     */
    @Property('authored-first')
    public fontResolution: FontResolutionMode;

    /**
     * HTTPS-only external picture policy. External access is denied by default.
     *
     * @private
     */
    @Property({ mode: 'deny', allowedHosts: [], maximumBytes: 10 * 1024 * 1024, timeoutMs: 10000 })
    public externalImagePolicy: ExternalImagePolicy;

    /**
     * Optional host renderer for C21 chart frames. Charts remain placeholders when omitted.
     *
     * @private
     */
    @Property()
    public chartRenderer: ChartRenderer | undefined;

    /**
     * Unique identifier for the component
     *
     * @type {string}
     * @aspType string
     */
    @Property()
    public id: string | undefined;

    /**
     * Additional CSS classes. ASP.NET wrappers use host HTML attributes because
     * ClassName is reserved for the client component constructor name.
     *
     * @type {string}
     * @aspIgnore
     */
    @Property()
    public className: string | undefined;

    /**
     * PPTX document path or URL. Set at construction or changed later, it is fetched and
     * loaded through the same path as {@link load}; failures raise `loadFailed`.
     *
     * @type {string}
     * @aspType string
     */
    @Property()
    public documentPath: string | undefined;

    /**
     * PPTX document binary content (deferred to TASK-1016)
     *
     * @type {ArrayBuffer}
     */
    @Property()
    public documentContent: ArrayBuffer | undefined;

    /**
     * Maximum ZIP entries accepted from one presentation.
     *
     * @default 10000
     *
     * @private
     */
    @Property(DEFAULT_PRESENTATION_SECURITY_LIMITS.entryCount)
    public maxZipEntries: number;

    /**
     * Maximum total declared uncompressed package bytes.
     *
     * @default 1073741824
     *
     * @private
     */
    @Property(DEFAULT_PRESENTATION_SECURITY_LIMITS.totalUncompressedBytes)
    public maxUncompressedBytes: number;

    /**
     * Maximum declared uncompressed bytes for one package part.
     *
     * @default 268435456
     *
     * @private
     */
    @Property(DEFAULT_PRESENTATION_SECURITY_LIMITS.singlePartUncompressedBytes)
    public maxSinglePartBytes: number;

    /**
     * Maximum uncompressed-to-compressed ratio for one package part.
     *
     * @default 200
     *
     * @private
     */
    @Property(DEFAULT_PRESENTATION_SECURITY_LIMITS.compressionRatio)
    public maxCompressionRatio: number;

    /**
     * Presentation file name used for downloads and the ribbon file information.
     * When unset, the title is derived from {@link documentPath}.
     *
     * @type {string}
     * @default undefined
     * @aspType string
     */
    @Property()
    public fileName: string | undefined;

    /**
     * Enables the Download action and {@link download}.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public enableDownload: boolean;

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
    @Property(true)
    public enablePrint: boolean;

    /**
     * Enables the Home tab Copy action and {@link copySelection}.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public enableCopy: boolean;

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
    @Property(true)
    public enableThumbnail: boolean;

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
    @Property(true)
    public enableToolbar: boolean;

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
    @Property(true)
    public enableNavigation: boolean;

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
    @Property(true)
    public enableMagnification: boolean;

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
    @Property(true)
    public enableSlideShow: boolean;

    /**
     * When true, text on the main slide surface may be selected.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public enableTextSelection: boolean;

    /**
     * Optional watermark label drawn over every slide. Empty or whitespace hides it.
     *
     * @type {string}
     * @default ''
     *
     * @private
     */
    @Property('')
    public watermarkText: string;

    /**
     * When true, enables the Slideshow tab start buttons. Default true when a
     * presentation is loaded; false when no presentation or during slideshow.
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public canStartSlideShow: boolean;

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
    @Property('Simplified')
    public ribbonLayout: RibbonLayoutMode | string;

    /**
     * Current slide index (0-based)
     *
     * @type {number}
     * @default 0
     */
    @Property(0)
    public slideIndex: number;

    /**
     * Whether the left thumbnail panel is expanded.
     *
     * Desktop default is visible; mobile collapses via the panel module unless
     * the user overrides visibility (chevron / View → Show).
     *
     * @type {boolean}
     * @default true
     */
    @Property(true)
    public thumbnailPanelVisible: boolean;

    /**
     * Thumbnail panel width in CSS pixels (clamped 120–240 when applied).
     *
     * @type {number}
     * @default 184
     */
    @Property(DEFAULT_PANEL_WIDTH_PX)
    public thumbnailPanelWidth: number;

    /**
     * Zoom level (10-400%)
     *
     * @type {number}
     * @default 100
     */
    @Property(100)
    public zoom: number;

    /**
     * Theme variant
     *
     * @type {ThemeVariant | string}
     * @default ThemeVariant.Material
     * @aspType string
     * @aspDefaultValue 'material'
     * @aspJsonConverterIgnore
     */
    @Property('Tailwind')
    public theme: ThemeVariant | string;

    /**
     * Component loading state (read-only)
     *
     * @type {boolean}
     * @default false
     *
     * @private
     */
    @Property(false)
    public isLoading: boolean;

    /**
     * Component ready state (read-only)
     *
     * @type {boolean}
     * @default false
     *
     * @private
     */
    @Property(false)
    public isReady: boolean;

    /**
     * ARIA label for screen readers
     *
     * @type {string}
     * @aspType string
     */
    @Property()
    public ariaLabel: string | undefined;

    /**
     * Tab index for keyboard navigation
     *
     * @type {number}
     * @default 0
     */
    @Property(0)
    public tabIndex: number;

    /**
     * ARIA role
     *
     * @type {string}
     * @default "application"
     */
    @Property('application')
    public role: string;

    /**
     * Created event emitted after initialization
     *
     * @event created
     * @returns {void} result
     */
    @Event()
    public created: EmitType<CreatedEventArgs>;

    /**
     * Destroyed event emitted after destruction
     *
     * @event destroyed
     * @returns {void} result
     */
    @Event()
    public destroyed: EmitType<DestroyedEventArgs>;

    /**
     * Progress emitted while presentation bytes are acquired.
     * @returns {void} result
     * @event loadProgress
     */
    @Event()
    public loadProgress: EmitType<LoadProgressEventArgs>;

    /**
     * Emitted after source acquisition and early validation succeed.
     * @returns {void} result
     * @event documentLoad
     */
    @Event()
    public documentLoad: EmitType<DocumentLoadEventArgs>;

    /**
     * Emitted when loading fails with a stable error code.
     * @returns {void} result
     * @event loadFailed
     */
    @Event()
    public loadFailed: EmitType<LoadFailedEventArgs>;

    /**
     * Emitted when slide content uses a placeholder or documented fallback.
     * @returns {void} result
     * @event unsupportedElement
     */
    @Event()
    public unsupportedElement: EmitType<UnsupportedElementEventArgs>;

    /**
     * Emitted before a safe slide hyperlink navigates.
     * @returns {void} result
     * @event hyperlinkClick
     *
     * @private
     */
    @Event()
    public hyperlinkClick: EmitType<HyperlinkClickEventArgs>;

    /**
     * Emitted when the active slide index changes.
     *
     * @returns {void} result
     * @event slideChange
     */
    @Event()
    public slideChange: EmitType<SlideChangedEventArgs>;

    /**
     * Emitted after the effective zoom percentage changes.
     * @returns {void} result
     * @event zoomChange
     */
    @Event()
    public zoomChange: EmitType<ZoomChangedEventArgs>;

    /**
     * Emitted after slideshow playback starts.
     * @returns {void} result
     * @event presentationStarted
     */
    @Event()
    public presentationStarted: EmitType<SlideShowStartedEventArgs>;

    /**
     * Emitted after slideshow playback ends.
     * @returns {void} result
     * @event presentationEnded
     */
    @Event()
    public presentationEnded: EmitType<SlideShowEndedEventArgs>;

    /**
     * Emitted when the slideshow's current slide changes.
     * @returns {void} result
     * @event slideChanged
     */
    @Event()
    public slideChanged: EmitType<SlideShowSlideChangedEventArgs>;

    /**
     * Emitted after Presenter View opens.
     * @returns {void} result
     * @event presenterViewOpened
     */
    @Event()
    public presenterViewOpened: EmitType<PresenterViewEventArgs>;

    /**
     * Emitted after Presenter View closes.
     * @returns {void} result
     * @event presenterViewClosed
     */
    @Event()
    public presenterViewClosed: EmitType<PresenterViewEventArgs>;

    /**
     * Emitted after the Notes Pane is shown.
     * @event notesPaneOpened
     * @returns {void} result
     */
    @Event()
    public notesPaneOpened: EmitType<NotesPaneEventArgs>;

    /**
     * Emitted after the Notes Pane is hidden.
     * @event notesPaneClosed
     * @returns {void} result
     */
    @Event()
    public notesPaneClosed: EmitType<NotesPaneEventArgs>;

    /**
     * Emitted when the notes shown for the active slide were (re)loaded.
     * @event currentSlideNotesChanged
     * @returns {void} result
     */
    @Event()
    public currentSlideNotesChanged: EmitType<CurrentSlideNotesChangedEventArgs>;

    /**
     * Emitted when the active slide changes.
     * @event currentSlideChanged
     * @returns {void} result
     */
    @Event()
    public currentSlideChanged: EmitType<CurrentSlideChangedEventArgs>;

    // Internal runtime state. Values set during `super()`/`initialize()` are
    // wiped by TypeScript `useDefineForClassFields` after `super()` returns;
    // `recoverAfterSuper()` restores them in the subclass constructor body.
    private _state: EditorState = 'Uninitialized';
    private _internalState: _IEditorInternalState = {
        state: 'Uninitialized',
        initialized: false,
        destroyed: false
    };

    /** Read-only Notes Pane controller (created lazily, independent of Presenter View). */
    private notesPane: NotesPane | null = null;

    /** Visually hidden polite live region used for status announcements. */
    private liveRegion: HTMLElement | null = null;

    /** Timer that clears the live region after an announcement. */
    private liveRegionTimer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Injected Toolbar feature module (editor ribbon).
     *
     * Present only when the application injects the optional feature via
     * `PptxEditor.Inject(Toolbar)` and {@link enableToolbar} is true.
     * Instantiated and attached by the EJ2 `ModuleLoader` under the member
     * name derived from `requiredModules()` (`toolbar` → `toolbarModule`);
     * typed here so no casts are needed on the hot paths.
     */
    public toolbarModule: Toolbar | undefined;

    /**
     * Injected Navigation feature module (slide navigation).
     *
     * Present only when the application injects the optional feature via
     * `PptxEditor.Inject(Navigation)` and {@link enableNavigation} is true.
     * Instantiated and attached by the EJ2 `ModuleLoader` under the member
     * name derived from `requiredModules()` (`navigation` →
     * `navigationModule`); typed here so no casts are needed on the hot paths.
     */
    public navigationModule: Navigation | undefined;

    /**
     * Injected Magnification feature module (zoom control).
     *
     * Present only when the application injects the optional feature via
     * `PptxEditor.Inject(Magnification)` and {@link enableMagnification} is
     * true. Instantiated and attached by the EJ2 `ModuleLoader` under the
     * member name derived from `requiredModules()` (`magnification` →
     * `magnificationModule`); typed here so no casts are needed on the hot paths.
     */
    public magnificationModule: Magnification | undefined;

    /**
     * Injected SlideShow feature module (slideshow playback).
     *
     * Present only when the application injects the optional feature via
     * `PptxEditor.Inject(SlideShow)` and {@link enableSlideShow} is true.
     * Instantiated and attached by the EJ2 `ModuleLoader` under the member
     * name derived from `requiredModules()` (`slideShow` →
     * `slideShowModule`); typed here so no casts are needed on the hot paths.
     */
    public slideShowModule: SlideShow | undefined;

    /**
     * Slideshow API (`editor.slideShow.startPresentation()`); undefined unless
     * the SlideShow module is injected and enabled.
     *
     * @readonly
     * @returns {SlideShow | undefined} The slideshow module
     */
    public get slideShow(): SlideShow | undefined {
        return this.hasSlideShowModule ? this.slideShowModule : undefined;
    }

    /**
     * Injected Print feature module (browser print workflow).
     *
     * Present only when the application injects the optional feature via
     * `PptxEditor.Inject(Print)` and {@link enablePrint} is true.
     * Instantiated and attached by the EJ2 `ModuleLoader` under the member
     * name derived from `requiredModules()` (`print` → `printModule`);
     * typed here so no casts are needed on the hot paths.
     */
    public printModule: Print | undefined;

    /**
     * Whether the injectable ThumbnailView module is attached and enabled.
     *
     * Ribbon host flag: View → Show → Thumbnails is disabled while false.
     *
     * @readonly
     * @returns {boolean} True while the thumbnail feature can mount
     *
     * @private
     */
    public get hasThumbnailModule(): boolean {
        return this.thumbnailModule !== undefined && this.enableThumbnail;
    }

    /**
     * Notes Pane API (`editor.notes.show()` etc.). Read-only in Phase 1.
     *
     * @readonly
     * @returns {NotesPaneModule} The Notes Pane API
     *
     * @private
     */
    public get notes(): NotesPaneModule {
        return this.ensureNotesPane();
    }

    /**
     * Whether the Notes Pane is currently shown (status-bar host flag).
     *
     * @readonly
     * @returns {boolean} True while the pane is expanded or collapsed
     *
     * @private
     */
    public get notesPaneVisible(): boolean {
        return !!this.notesPane && this.notesPane.isVisible();
    }

    /**
     * Toggles the Notes Pane (status-bar host hook).
     *
     * @returns {void}
     *
     * @private
     */
    public toggleNotesPane(): void {
        this.ensureNotesPane().toggle();
    }

    /**
     * Loads read-only notes for one slide from the active presentation session.
     *
     * @param {number} index - 0-based slide index
     * @returns {Promise<NotesSnapshot | undefined>} Notes, `undefined` when unavailable
     *
     * @private
     */
    public requestSlideNotes(index: number): Promise<NotesSnapshot | undefined> {
        const session: PresentationSession | null = this.presentationSession;
        if (!session || !session.requestNotes) {
            return Promise.resolve(undefined);
        }
        return session.requestNotes(index);
    }

    /**
     * Raises a Notes Pane event.
     *
     * @param {NotesEventName} name - Event name
     * @param {object} args - Event arguments
     * @returns {void}
     *
     * @private
     */
    public raiseNotesEvent(name: NotesEventName, args: object): void {
        this.trigger(name, args);
    }

    /**
     * Refreshes chrome after the Notes Pane state changed.
     *
     * @returns {void}
     *
     * @private
     */
    public onNotesPaneStateChanged(): void {
        if (this.statusBarModule) {
            this.statusBarModule.refreshNotesState();
        }
        if (this.toolbarModule) {
            this.toolbarModule.refreshActionState();
        }
        if (this.mainSlideModule) {
            this.mainSlideModule.refresh();
        }
    }

    /**
     * Returns localized text for a key using the `pptxeditor` L10n resources of
     * the current {@link locale}; falls back to English when a key is missing.
     *
     * @private
     * @param {string} key - Localization key
     * @param {Array<string|number>} args - Placeholder values
     * @returns {string} Localized text
     */
    public getLocalizedText(key: string, ...args: Array<string | number>): string {
        return localize(this.locale, key, ...args);
    }

    /**
     * Re-applies localized text to every mounted chrome module after the
     * {@link locale} property changed.
     *
     * @private
     * @returns {void}
     */
    private refreshLocalizedChrome(): void {
        if (!this.element) {
            return;
        }
        this.applyAccessibilityAttributes();
        if (this.helpDialog) {
            this.destroyHelpDialog();
        }
        if (this.zoomDialog) {
            this.zoomDialog.destroy();
        }
        if (this.toolbarModule) {
            this.toolbarModule.destroy();
            this.ensureRibbonInitialized();
        }
        if (this.mainSlideModule) {
            this.mainSlideModule.refreshLocale();
        }
        if (this.statusBarModule) {
            this.statusBarModule.refreshLocale();
        }
        if (this.notesPane) {
            this.notesPane.refreshLocale();
        }
        if (this.slideShowModule) {
            this.slideShowModule.refreshLocale();
        }
        const content: HTMLElement | null = this.element.querySelector('.ej2-pptx-main-slide__content');
        if (content && this._slideCount > 0) {
            applySlideSemanticContext(this.element, this.slideIndex, this._slideCount, false, this.locale);
        }
    }

    private ensureNotesPane(): NotesPane {
        if (!this.notesPane) {
            this.notesPane = new NotesPane(this);
        }
        return this.notesPane;
    }

    /**
     * Whether the injectable Navigation module is attached and enabled.
     *
     * Status-bar previous/next controls are disabled while false.
     *
     * @readonly
     * @returns {boolean} True while slide navigation is active
     */
    public get hasNavigationModule(): boolean {
        return this.navigationModule !== undefined && this.enableNavigation;
    }

    /**
     * Whether the injectable Magnification module is attached and enabled.
     *
     * Ribbon host flag: View → Fit to Window shows pressed while true.
     *
     * @readonly
     * @returns {boolean} True while the slide is laid out in fit-to-window mode
     *
     * @private
     */
    public get isFitToWindowActive(): boolean {
        return !!this.mainSlideModule && this.mainSlideModule.getZoomMode() === 'fit-to-window';
    }

    /**
     * Ribbon host flag: View → Zoom controls are disabled while false.
     *
     * @readonly
     * @returns {boolean} True while zoom control is active
     *
     * @private
     */
    public get hasMagnificationModule(): boolean {
        return this.magnificationModule !== undefined && this.enableMagnification;
    }

    /**
     * Whether the injectable SlideShow module is attached and enabled.
     *
     * Ribbon host flag: Slide Show start buttons are disabled while false.
     *
     * @readonly
     * @returns {boolean} True while the slideshow feature is active
     *
     * @private
     */
    public get hasSlideShowModule(): boolean {
        return this.slideShowModule !== undefined && this.enableSlideShow;
    }

    /**
     * Whether the injectable Print module is attached and enabled.
     *
     * Ribbon host flag: File → Print controls are disabled while false.
     *
     * @readonly
     * @returns {boolean} True while the print workflow is active
     *
     * @private
     */
    public get hasPrintModule(): boolean {
        return this.printModule !== undefined && this.enablePrint;
    }

    /** Main slide area module (viewport, fit/zoom, watermark, Copy Text). */
    private mainSlideModule: MainSlideArea | null = null;

    /**
     * Injected ThumbnailView feature module (left thumbnail panel).
     *
     * Present only when the application injects the optional feature via
     * `PptxEditor.Inject(ThumbnailView)` and {@link enableThumbnail} is true.
     * Instantiated and attached by the EJ2 `ModuleLoader` under the member
     * name derived from `requiredModules()` (`thumbnail` → `thumbnailModule`);
     * typed here so no casts are needed on the hot paths.
     */
    public thumbnailModule: ThumbnailView | undefined;

    /** Bottom status bar module. */
    private statusBarModule: StatusBar | null = null;

    private touchStart: { x: number; y: number } | null = null;

    // Stable listener identity for editor-scoped keyboard input.
    private readonly onEditorKeyDownBound: (event: KeyboardEvent) => void = (event: KeyboardEvent): void =>
        this.onEditorKeyDown(event);

    // Stable listener identity for document selection changes (Home Copy / Font group sync).
    private readonly onSelectionChangeBound: () => void = (): void => {
        this.onSlideSelectionChanged();
    };

    // Stable listener identity for editor-scoped touch start.
    private readonly onEditorTouchStartBound: (event: TouchEvent) => void = (event: TouchEvent): void =>
        this.onEditorTouchStart(event);

    // Stable listener identity for editor-scoped touch end.
    private readonly onEditorTouchEndBound: (event: TouchEvent) => void = (event: TouchEvent): void =>
        this.onEditorTouchEnd(event);

    /**
     * Intrinsic slide width in points for layout.
     * Default 960 pt (standard 16:9) until document geometry is available.
     */
    private _slideWidthPt: number = DEFAULT_SLIDE_WIDTH_PT;

    /**
     * Intrinsic slide height in points for layout.
     * Default 540 pt (standard 16:9) until document geometry is available.
     */
    private _slideHeightPt: number = DEFAULT_SLIDE_HEIGHT_PT;

    /**
     * Slide count for chrome (thumbnail list / Info). Default 1 until package load.
     */
    private _slideCount: number = 1;

    /**
     * View-mode badge label for the status bar (default Reading View).
     */
    private _viewModeLabel: string = DEFAULT_VIEW_MODE_LABEL;

    /*
 * Bound fullscreenchange handler for cleanup.
 * @returns {void} result
 */
    private onFullscreenChangeBound: () => void = (): void => {
        this.handleFullscreenChange();
    };

    /** Outstanding blob object URL created for download, if any. */
    private pendingDownloadObjectUrl: string | null = null;

    /** Abort controller for the currently active source acquisition. */
    private loadAbortController: AbortController | null = null;

    /** Monotonic id preventing a superseded load from publishing stale state. */
    private loadRequestId: number = 0;

    /** Resolver shared by Worker measurement and HTML text rendering. */
    private fontProvider: FontProvider = createFontProvider();

    /** Current parsed package session (Worker-held by default). */
    private presentationSession: PresentationSession | null = null;
    /** Render resources retained while lazy thumbnail DOM remains mounted. */
    private readonly thumbnailFrameEmitters: Set<SlideFrameEmitter> = new Set();
    private readonly printFrameEmitters: Set<SlideFrameEmitter> = new Set();
    private readonly thumbnailTextMeasurers: Set<TextMeasurer> = new Set();

    /** Unsupported elements reported for the current presentation. */
    private notRenderedElements: UnsupportedElementEventArgs[] = [];

    /** Abort controller for the current lazy per-slide render request. */
    private slideRenderAbortController: AbortController | null = null;

    /** Accessible loading and error overlay. */
    private loadUi: LoadUi | null = null;

    /** Last requested source used by Retry. */
    private lastPresentationSource: PresentationSource | null = null;

    /** Active Zoom dialog, if any. */
    private zoomDialog: ZoomDialog | null = null;

    /** Active Help dialog (Keyboard Shortcuts or About), if any. */
    private helpDialog: Dialog | null = null;

    /**
     * Creates PptxEditor component
     *
     * @param {Partial<IEditorProperties>} [options] - Component options
     * @param {string | HTMLElement} [element] - Target element or selector
     * @throws {Error} If target element not found
     *
     * @example
     * ```typescript
     * const editor = new PptxEditor({
     *   theme: 'material3',
     *   zoom: 120
     * }, '#editor-container');
     * ```
     */
    public constructor(
        options?: Partial<IEditorProperties & IEditorEvents>,
        element?: string | HTMLElement
    ) {
        super(PptxEditor.withoutCreatedHandler(options), element);
        // Framework wrappers (Angular, React, Vue) construct the component
        // before the host element exists and call appendTo() afterwards.
        // Do not throw here. initialize() still rejects a missing element at
        // attach time. recoverAfterSuper restores class fields wiped by super()
        // and only binds host listeners when this.element exists.
        // EJ2 base constructs and renders inside `super()`. Class fields are then
        // defined and reset any instance state assigned during that render path.
        this.recoverAfterSuper();
        // Decorated public properties are affected by the same class-field reset.
        // Restore the caller's explicit values, then notify the live modules so
        // constructor options and later data-bound changes share one code path.
        if (options) {
            this.setProperties(options, true);
            this.onPropertyChanged(options, {});
            if (this.element) {
                if (this.id) {
                    this.element.id = this.id;
                }
                this.render();
            }
        }
        const createdArgs: CreatedEventArgs = {
            sender: this,
            name: 'created',
            timestamp: Date.now(),
            state: this._state
        };
        this.trigger('created', createdArgs);
    }

    /**
     * EJ2 emits its base `created` callback synchronously without editor event
     * arguments while `super()` is running. Defer the public handler until the
     * editor has restored its class fields and can provide the documented context.
     *
     * @private
     * @param {Object} options - Editor constructor options
     * @returns {Object} Options safe to pass into the EJ2 base constructor
     */
    private static withoutCreatedHandler(
        options?: Partial<IEditorProperties & IEditorEvents>
    ): Partial<IEditorProperties & IEditorEvents> | undefined {
        if (!options || typeof options.created !== 'function') {
            return options;
        }
        const baseOptions: Partial<IEditorProperties & IEditorEvents> = {
            ...options
        };
        delete baseOptions.created;
        return baseOptions;
    }

    /**
     * Restores instance state wiped by class-field define semantics after
     * `super()`, and re-binds the fullscreen listener to the live DOM.
     *
     * @private
     * @returns {void}
     */
    private recoverAfterSuper(): void {
        if (!this._internalState || !this._internalState.initialized) {
            this._state = 'Ready';
            this._internalState = {
                state: 'Ready',
                initialized: true,
                destroyed: false
            };
        }
        this.setProperties({ isReady: true }, true);
        if (this.pendingDownloadObjectUrl === undefined) {
            this.pendingDownloadObjectUrl = null;
        }
        this.onFullscreenChangeBound = (): void => {
            this.handleFullscreenChange();
        };
        if (this.helpDialog === undefined) {
            this.helpDialog = null;
        }
        if (this.liveRegion === undefined) {
            this.liveRegion = null;
        }
        if (this.liveRegionTimer === undefined) {
            this.liveRegionTimer = null;
        }
        if (this.mainSlideModule === undefined) {
            this.mainSlideModule = null;
        }
        // `toolbarModule`/`thumbnailModule` keep `undefined` as their only
        // "absent" state — the instance exists only while the application
        // injects the feature.
        // `thumbnailModule` keeps `undefined` as its only "absent" state — the
        // module instance exists only while the application injects the feature.
        if (this.statusBarModule === undefined) {
            this.statusBarModule = null;
        }
        if (this.loadUi === undefined) {
            this.loadUi = null;
        }
        if (this.lastPresentationSource === undefined) {
            this.lastPresentationSource = null;
        }
        if (!this.fontProvider) {
            this.fontProvider = createFontProvider({
                substitutions: this.fontSubstitutions || {}, fontResolution: this.fontResolution
            });
        } else {
            this.fontProvider.setSubstitutions(this.fontSubstitutions || {});
            this.fontProvider.setResolutionMode(this.fontResolution || 'authored-first');
        }
        if (
            typeof this._slideWidthPt !== 'number' ||
      !(this._slideWidthPt > 0)
        ) {
            this._slideWidthPt = DEFAULT_SLIDE_WIDTH_PT;
        }
        if (
            typeof this._slideHeightPt !== 'number' ||
      !(this._slideHeightPt > 0)
        ) {
            this._slideHeightPt = DEFAULT_SLIDE_HEIGHT_PT;
        }
        if (typeof this._slideCount !== 'number' || !(this._slideCount > 0)) {
            this._slideCount = 1;
        }
        if (
            typeof this._viewModeLabel !== 'string' ||
      this._viewModeLabel.trim().length === 0
        ) {
            this._viewModeLabel = DEFAULT_VIEW_MODE_LABEL;
        }

        document.addEventListener('fullscreenchange', this.onFullscreenChangeBound);
        document.addEventListener('selectionchange', this.onSelectionChangeBound);
        // Framework wrappers construct the editor before appendTo() supplies a host.
        if (this.element) {
            this.element.addEventListener('keydown', this.onEditorKeyDownBound);
            this.element.addEventListener('touchstart', this.onEditorTouchStartBound, { passive: true });
            this.element.addEventListener('touchend', this.onEditorTouchEndBound, { passive: true });
        }
        this.ensureRibbonInitialized();
        this.ensureMainSlideInitialized();
        this.ensureThumbnailPanelInitialized();
        this.ensureStatusBarInitialized();
        this.ensureLoadUiInitialized();
    }

    /**
     * Intrinsic slide width in points used by the main slide layout.
     *
     * @returns {number} Width in points
     *
     * @private
     */
    public get slideWidthPt(): number {
        return this._slideWidthPt > 0 ? this._slideWidthPt : DEFAULT_SLIDE_WIDTH_PT;
    }

    /**
     * Intrinsic slide height in points used by the main slide layout.
     *
     * @returns {number} Height in points
     *
     * @private
     */
    public get slideHeightPt(): number {
        return this._slideHeightPt > 0 ? this._slideHeightPt : DEFAULT_SLIDE_HEIGHT_PT;
    }

    /**
     * Status-bar view-mode badge label (default Reading View).
     *
     * @returns {string} View mode label
     *
     * @private
     */
    public get viewModeLabel(): string {
        return this._viewModeLabel && this._viewModeLabel.trim().length > 0
            ? this._viewModeLabel
            : DEFAULT_VIEW_MODE_LABEL;
    }

    /**
     * Sets the status-bar view-mode badge label.
     *
     * @param {string} label - Badge text
     *
     * @private
     */
    public set viewModeLabel(label: string) {
        if (typeof label === 'string' && label.trim().length > 0) {
            this._viewModeLabel = label.trim();
        } else {
            this._viewModeLabel = DEFAULT_VIEW_MODE_LABEL;
        }
    }

    /**
     * Whether a presentation is currently loaded.
     *
     * @returns {boolean} True when a presentation session is active
     *
     * @private
     */
    public get hasLoadedPresentation(): boolean {
        return this.presentationSession !== null;
    }

    /**
     * Number of slides available for navigation chrome (thumbnails, Info).
     *
     * @public
     * @returns {number} Slide count (≥ 1 while chrome is shown)
     */
    public get slideCount(): number {
        return this._slideCount > 0 ? this._slideCount : 1;
    }

    /*
     * Initializes the component
     *
     * Called after element is attached to DOM. Validates element reference,
     * sets up internal state, and prepares for rendering.
     *
     * @protected
     * @throws {Error} If element cannot be resolved
 * @returns {void} result
     */
    protected initialize(): void {
    // Validate element reference
        if (!this.element) {
            throw new Error(
                `[PptxEditor]: ${'ElementNotFound'} - Target element not found or could not be resolved`
            );
        }

        // Set state to initializing
        this._state = 'Initializing';
        this._internalState.state = 'Initializing';

        // Set component ID if provided
        if (this.id) {
            this.element.id = this.id;
        }

        // Call render to build DOM structure
        this.render();

        // Mark as initialized and ready
        this._state = 'Ready';
        this._internalState.state = 'Ready';
        this._internalState.initialized = true;
        this.setProperties({ isReady: true }, true);

        // Emit created event
        const createdArgs: CreatedEventArgs = {
            sender: this,
            name: 'created',
            timestamp: Date.now(),
            state: this._state
        };
        this.trigger('created', createdArgs);
    }

    /*
     * Renders the component DOM structure
     *
     * Creates light DOM elements with proper CSS classes, applies theme,
     * sets accessibility attributes, and handles styling.
     *
     * @protected
 * @returns {void} result
     */
    protected render(): void {
        if (!this.element) {
            return;
        }

        // Apply root class
        if (!this.element.classList.contains('ej2-pptx-editor')) {
            this.element.classList.add('ej2-pptx-editor');
        }

        // Apply custom className if provided
        if (this.className) {
            this.element.classList.add(this.className);
        }

        this.applyDimensions();

        // Apply theme
        this.applyTheme();

        // Apply RTL class (shell only; slide content stays LTR)
        this.applyRtlClass();

        // Apply state classes
        this.applyStateClasses();

        // Set accessibility attributes
        this.applyAccessibilityAttributes();

        // Create DOM structure (if not already present)
        if (!this.element.querySelector('.ej2-pptx-shell')) {
            this.createDOMStructure();
        }

        // Always (re)bind chrome after shell exists. recoverAfterSuper() also calls
        // these after class-field wipe; render must not leave slide-area empty when
        // shell was created here or already present without modules.
        this.ensureRibbonInitialized();
        this.ensureMainSlideInitialized();
        this.ensureThumbnailPanelInitialized();
        this.ensureStatusBarInitialized();
        this.ensureLoadUiInitialized();
        // Framework inputs arrive after construction. Do not load during the
        // base constructor's render, before editor runtime fields are restored.
        if (this._internalState && this._internalState.initialized) {
            this.loadFromDocumentPath(this.documentPath);
        }
    }

    /**
     * Applies `width` and `height` to the host element.
     *
     * @private
     * @returns {void}
     */
    private applyDimensions(): void {
        if (!this.element) {
            return;
        }
        this.element.style.width = this.width === '' || this.width === undefined || this.width === null
            ? '' : formatUnit(this.width);
        this.element.style.height = this.height === '' || this.height === undefined || this.height === null
            ? '' : formatUnit(this.height);
    }

    /**
     * Mirrors `enableRtl` onto the host element as the standard EJ2 `e-rtl`
     * class. Only shell chrome is mirrored; slide content stays LTR.
     *
     * @private
     * @returns {void}
     */
    private applyRtlClass(): void {
        if (this.element) {
            this.element.classList.toggle('e-rtl', !!this.enableRtl);
        }
    }

    /*
     * Handles property changes.
     *
     * EJ2 `Component.dataBind()` passes `changedProperties` as a bag
     * (`{ fileName: 'X.pptx', ... }`), not a single `{ name, value }` model.
     * A legacy single-property shape is still accepted for unit callers.
     *
     * @protected
     * @param {PropertyModel|Record} newProp - EJ2 change bag or single-property model
     * @param {PropertyModel|Record} _oldProp - Previous values bag (unused)
 * @returns {void} result
     */
    public onPropertyChanged(
        newProp: PropertyModel | Record<string, unknown>,
        _oldProp?: PropertyModel | Record<string, unknown>
    ): void {
        if (!newProp || typeof newProp !== 'object') {
            return;
        }

        const changes: Record<string, unknown> = this.normalizePropertyChanges(newProp);
        const keys: string[] = Object.keys(changes);
        if (keys.length === 0) {
            return;
        }

        const visualProperties: string[] = [
            'theme',
            'className',
            'ariaLabel',
            'role',
            'tabIndex'
        ];
        let needsRender: boolean = false;

        for (let i: number = 0; i < keys.length; i++) {
            const name: string = keys[i];
            const value: unknown = changes[name];

            if (visualProperties.indexOf(name) >= 0) {
                needsRender = true;
            }

            switch (name) {
            case 'fontSubstitutions':
                this.fontProvider.setSubstitutions((value || {}) as FontSubstitutionMap);
                if (this.presentationSession) {
                    void this.renderLoadedSlide(this.slideIndex);
                }
                break;

            case 'fontResolution':
                this.fontProvider.setResolutionMode(value === 'substitute-first'
                    ? 'substitute-first' : 'authored-first');
                if (this.presentationSession) {
                    void this.renderLoadedSlide(this.slideIndex);
                }
                break;

            case 'width':
            case 'height':
                this.applyDimensions();
                if (this.mainSlideModule) {
                    this.mainSlideModule.refresh();
                }
                if (this.statusBarModule) {
                    this.statusBarModule.refresh();
                }
                if (this.thumbnailModule) {
                    this.thumbnailModule.onHostResized();
                }
                if (this.toolbarModule) {
                    this.toolbarModule.refreshSize();
                }
                break;

            case 'enableRtl':
                this.applyRtlClass();
                if (this.toolbarModule) {
                    this.toolbarModule.setRtl(!!this.enableRtl);
                }
                if (this.statusBarModule) {
                    this.statusBarModule.refresh();
                }
                break;

            case 'slideIndex':
                if (typeof value === 'number') {
                    this.isValidSlideIndex(value);
                    if (this.thumbnailModule) {
                        this.thumbnailModule.onSlideIndexChanged();
                    }
                    if (this.toolbarModule) {
                        this.toolbarModule.refreshInfo();
                    }
                    if (this.statusBarModule) {
                        this.statusBarModule.refreshSlideCounter();
                    }
                    if (this.notesPane) {
                        this.notesPane.onSlideChanged(value);
                    }
                    void this.renderLoadedSlide(value);
                }
                break;

            case 'thumbnailPanelVisible':
                if (typeof value === 'boolean') {
                    if (this.thumbnailModule) {
                        this.thumbnailModule.applyVisibilityFromHost(value);
                    }
                    if (this.toolbarModule) {
                        this.toolbarModule.refreshActionState();
                    }
                }
                break;

            case 'thumbnailPanelWidth':
                if (typeof value === 'number') {
                    const clamped: number = clampPanelWidth(value);
                    if (clamped !== value) {
                        this.thumbnailPanelWidth = clamped;
                    }
                    if (this.thumbnailModule) {
                        this.thumbnailModule.applyWidthFromHost(clamped);
                    }
                }
                break;

            case 'enableToolbar':
                // Runtime feature toggle: mount/unmount the injected module now
                // so the change applies without a full refresh cycle.
                if (typeof value === 'boolean') {
                    this.ensureRibbonInitialized();
                }
                break;

            case 'enableNavigation':
                // Runtime feature toggle: the gate is read live by the
                // Navigation module and the keyboard handler. The status-bar
                // previous/next controls track availability. Rebind first:
                // enabling the module refreshes the shell and can wipe the
                // status-bar field before this handler runs.
                this.ensureStatusBarInitialized();
                if (this.statusBarModule) {
                    this.statusBarModule.refreshNavigationState();
                }
                break;

            case 'enableMagnification':
                // Runtime feature toggle: the gate is read live by the
                // Magnification module on every zoom request. The status bar
                // zoom controls and ribbon zoom items track availability.
                if (this.statusBarModule) {
                    this.statusBarModule.refreshZoom();
                }
                if (this.toolbarModule) {
                    this.toolbarModule.refreshActionState();
                }
                break;

            case 'enableSlideShow':
                // Runtime feature toggle: the gate is read live by the
                // SlideShow module on every start/exit request. The ribbon
                // start buttons track availability. Disabling the feature ends
                // any running presentation.
                if (!this.enableSlideShow && this.slideShowModule) {
                    this.slideShowModule.stopPresentation();
                }
                if (this.toolbarModule) {
                    this.toolbarModule.refreshActionState();
                }
                break;

            case 'enableThumbnail':
                // Runtime feature toggle: mount/unmount the injected module now
                // so the change applies without a full refresh cycle. The View
                // → Show → Thumbnails ribbon item tracks availability.
                if (typeof value === 'boolean') {
                    this.ensureThumbnailPanelInitialized();
                    if (this.toolbarModule) {
                        this.toolbarModule.refreshActionState();
                    }
                }
                break;

            case 'zoom':
                if (typeof value === 'number') {
                    this.validateZoom(value);
                    if (this.toolbarModule) {
                        this.toolbarModule.refreshActionState();
                    }
                    if (this.mainSlideModule) {
                        this.mainSlideModule.onHostZoomChanged();
                    }
                    if (this.statusBarModule) {
                        this.statusBarModule.refreshZoom();
                    }
                }
                break;

            case 'enableTextSelection':
            case 'watermarkText':
                if (this.mainSlideModule) {
                    this.mainSlideModule.refresh();
                }
                break;

            case 'theme':
                this.validateTheme(value);
                break;

            case 'locale':
                void ((this.loadUi) !== undefined && (this.loadUi) !== null ? (this.loadUi).destroy() : undefined);
                this.loadUi = null;
                this.ensureLoadUiInitialized();
                this.refreshLocalizedChrome();
                break;

            case 'isLoading':
                this.applyStateClasses();
                this.applyAccessibilityAttributes();
                break;

            case 'documentPath':
                this.loadFromDocumentPath(value);
                if (this.toolbarModule) {
                    this.toolbarModule.refreshInfo();
                }
                break;

            case 'fileName':
                if (this.toolbarModule) {
                    this.toolbarModule.refreshInfo();
                }
                break;

            case 'enableDownload':
            case 'enablePrint':
                if (this.toolbarModule) {
                    this.toolbarModule.refreshActionState();
                }
                break;

            case 'enableCopy':
            case 'canUndo':
            case 'canRedo':
            case 'canStartSlideShow':
                if (this.toolbarModule) {
                    this.toolbarModule.refreshActionState();
                }
                break;

            case 'ribbonLayout':
                if (this.toolbarModule) {
                    this.toolbarModule.refreshLayout();
                }
                break;

            default:
                break;
            }
        }

        if (needsRender) {
            this.render();
        }
    }

    /**
     * Normalizes EJ2 change bags and legacy `{ name, value }` models.
     *
     * @private
     * @param {PropertyModel|Record} newProp - Raw property change argument
     * @returns {Record} Flat map of property name → new value
     */
    private normalizePropertyChanges(
        newProp: PropertyModel | Record<string, unknown>
    ): Record<string, unknown> {
        const asModel: PropertyModel = newProp as PropertyModel;
        if (typeof asModel.name === 'string' && asModel.name.length > 0) {
            const single: Record<string, unknown> = {};
            single[asModel.name] = asModel.value;
            return single;
        }
        return newProp as Record<string, unknown>;
    }

    /**
     * Re-lays out and repaints the editor in place.
     *
     * The EJ2 base `refresh()` destroys and re-renders the component, which would close
     * the open presentation session and leave blank slides and thumbnails. Hosts such as
     * the Sample Browser call `refresh()` when a hidden tab becomes visible, so this
     * override keeps the loaded presentation and repaints the chrome, main slide and thumbnails.
     *
     * @private
     * @returns {void}
     */
    public refresh(): void {
        if (!this.element || !this._internalState || this._internalState.destroyed) {
            return;
        }
        this.applyDimensions();
        if (this.toolbarModule) {
            this.toolbarModule.refreshSize();
            this.toolbarModule.refreshLayout();
            this.toolbarModule.refreshInfo();
            this.toolbarModule.refreshActionState();
        }
        if (this.statusBarModule) {
            this.statusBarModule.refresh();
        }
        if (this.mainSlideModule) {
            this.mainSlideModule.refresh();
        }
        if (this.presentationSession) {
            if (this.thumbnailModule) {
                this.thumbnailModule.refresh();
            }
            void this.renderLoadedSlide(this.slideIndex);
        }
    }

    /*
     * Destroys the component
     *
     * Cleans up resources, removes event listeners, clears DOM elements,
     * and prevents memory leaks.
     *
     * @public
 * @returns {void} result
     */
    public destroy(): void {
        if (!this._internalState) {
            this._internalState = {
                state: 'Destroying',
                initialized: false,
                destroyed: false
            };
        }
        if (this._internalState.destroyed) {
            return; // Already destroyed, prevent recursive cleanup
        }

        this._internalState.destroyed = true;
        this._state = 'Destroying';
        // Angular's wrapper can destroy the instance before appendTo() runs.
        // Event maps and DOM listeners do not exist until the host is attached.
        if (!this.element) {
            return;
        }
        this.cancelLoad();
        if (this.presentationSession) {
            this.presentationSession.close();
            this.presentationSession = null;
        }
        this.clearThumbnailRenderers();
        if (this.slideRenderAbortController) {
            this.slideRenderAbortController.abort();
            this.slideRenderAbortController = null;
        }
        if (this.loadUi) {
            this.loadUi.destroy();
            this.loadUi = null;
        }

        // Emit destroyed event
        const destroyedArgs: DestroyedEventArgs = {
            sender: this,
            name: 'destroyed',
            timestamp: Date.now(),
            planned: true
        };
        this.trigger('destroyed', destroyedArgs);

        if (this.toolbarModule) {
            // Idempotent module destroy; the member stays attached so the
            // EJ2 ModuleLoader.clean() (called by Component.destroy) finds it
            // and its own destroy() is a safe second teardown.
            this.toolbarModule.destroy();
        }

        this.destroyHelpDialog();
        if (this.zoomDialog) {
            this.zoomDialog.destroy();
            this.zoomDialog = null;
        }

        document.removeEventListener(
            'fullscreenchange',
            this.onFullscreenChangeBound
        );
        document.removeEventListener('selectionchange', this.onSelectionChangeBound);
        this.element.removeEventListener('keydown', this.onEditorKeyDownBound);
        this.element.removeEventListener('touchstart', this.onEditorTouchStartBound);
        this.element.removeEventListener('touchend', this.onEditorTouchEndBound);

        if (this.mainSlideModule) {
            this.mainSlideModule.destroy();
            this.mainSlideModule = null;
        }

        if (this.thumbnailModule) {
            // Idempotent module destroy; the member stays attached so the
            // EJ2 ModuleLoader.clean() (called by Component.destroy) finds it
            // and its own destroy() is a safe second teardown.
            this.thumbnailModule.destroy();
        }

        if (this.statusBarModule) {
            this.statusBarModule.destroy();
            this.statusBarModule = null;
        }

        if (this.notesPane) {
            this.notesPane.destroy();
            this.notesPane = null;
        }

        this.revokePendingDownloadUrl();

        if (this.liveRegionTimer !== null) {
            clearTimeout(this.liveRegionTimer);
            this.liveRegionTimer = null;
        }
        this.liveRegion = null;

        if (this.element) {
            this.element.classList.remove('ej2-pptx-editor--fullscreen');
        }

        // Remove DOM structure
        if (this.element && this.element.parentElement) {
            const shell: Element = this.element.querySelector('.ej2-pptx-shell');
            if (shell && this.element.contains(shell)) {
                this.element.removeChild(shell);
            }
        }

        // Clear internal state
        this._internalState.state = 'Destroying';
        this._internalState.initialized = false;

        // Call base destroy
        super.destroy();
    }

    /**
     * Downloads the original presentation when {@link enableDownload} is true.
     *
     * Prefers {@link documentContent} as a blob download; otherwise uses
     * {@link documentPath}. No-ops when disabled or when no source is available.
     *
     * @public
     * @returns {void}
     */
    public download(): void {
        if (!this.enableDownload) {
            return;
        }

        const name: string = this.resolveDownloadFileName();
        const content: ArrayBuffer | undefined = this.documentContent;

        if (content instanceof ArrayBuffer) {
            this.triggerBlobDownload(content, name);
            return;
        }

        // Worker mode: rebuild the original bytes from the load source only now,
        // when the user exports (blob / buffer / base64 are already held by the host).
        const source: PresentationSource | null = this.lastPresentationSource;
        if (source) {
            void acquirePresentationSource(source, { maxBytes: this.maxUncompressedBytes }).then(
                (acquired: AcquiredPresentation): void => {
                    this.triggerBlobDownload(acquired.bytes, name);
                },
                (): void => {
                    this.downloadFromDocumentPath(name);
                }
            );
            return;
        }

        this.downloadFromDocumentPath(name);
    }

    private downloadFromDocumentPath(name: string): void {
        if (typeof this.documentPath === 'string' && this.documentPath.trim().length > 0) {
            this.triggerAnchorDownload(this.documentPath.trim(), name);
        }
    }

    /**
     * Opens the browser print workflow.
     *
     * Delegates to the injectable Print module; without the module
     * (`PptxEditor.Inject(Print)`) or while {@link enablePrint} is false
     * this is a no-op.
     *
     * @public
     * @param {Window} printWindow - Optional pre-opened window to print into
     * @returns {void}
     */
    public print(printWindow?: Window): void {
        if (this.printModule) {
            this.printModule.print(printWindow);
        }
    }

    /**
     * Opens a presentation from a local file (device picker / File tab).
     *
     * Sets {@link fileName} and loads binary content into {@link documentContent}.
     * Full package load is deferred to the document pipeline (TASK-1016+).
     *
     * @public
     * @param {File} file - Local PPTX file
     * @returns {void}
     */
    public openFromFile(file: File): Promise<void> {
        if (!file) {
            return Promise.resolve();
        }
        this.fileName = file.name;
        if (this.toolbarModule) {
            this.toolbarModule.refreshInfo();
        }

        return this.load({ kind: 'blob', blob: file, fileName: file.name });
    }

    /**
     * Loads the presentation named by `documentPath` through the shared load path.
     * Relative (local) and absolute `http(s)` paths are fetched. Failures surface
     * through `loadFailed` and the load UI, so the rejection is swallowed here.
     * Skipped when that URL is already the active source.
     *
     * @private
     * @param {unknown} value - New documentPath value
     * @returns {void}
     */
    private loadFromDocumentPath(value: unknown): void {
        if (typeof value !== 'string' || value.trim().length === 0) {
            return;
        }
        const path: string = value.trim();
        const last: PresentationSource | null = this.lastPresentationSource;
        if (last && last.kind === 'url' && last.url === path) {
            return;
        }
        this.load({ kind: 'url', url: path }).catch((): void => undefined);
    }

    /**
     * Opens a presentation from a URL string (File tab Open from URL).
     *
     * Sets {@link documentPath} and loads the presentation from the URL.
     *
     * @public
     * @param {string} url - Presentation URL
     * @returns {void}
     */
    public openFromUrl(url: string): Promise<void> {
        if (typeof url !== 'string') {
            return Promise.resolve();
        }
        const trimmed: string = url.trim();
        if (trimmed.length === 0) {
            return Promise.resolve();
        }
        this.documentPath = trimmed;
        if (this.toolbarModule) {
            this.toolbarModule.refreshInfo();
        }
        return this.load({ kind: 'url', url: trimmed });
    }

    /*
 * Loads a presentation from a Blob.
 * @param {Blob} blob - blob
 * @param {string} fileName - fileName
 * @returns {Promise} result
     *
     * @private
 */
    public openFromBlob(blob: Blob, fileName?: string): Promise<void> {
        return this.load({ kind: 'blob', blob, fileName });
    }

    /*
 * Loads a presentation from an ArrayBuffer or a typed-array view.
 * @param {ArrayBuffer|ArrayBufferView} data - data
 * @param {string} fileName - fileName
 * @returns {Promise} result
     *
     * @private
 */
    public openFromArrayBuffer(
        data: ArrayBuffer | ArrayBufferView,
        fileName?: string
    ): Promise<void> {
        return this.load({ kind: 'buffer', data, fileName });
    }

    /*
 * Loads a presentation from Base64 text or a Base64 data URI.
 * @param {string} data - data
 * @param {string} fileName - fileName
 * @returns {Promise} result
     *
     * @private
 */
    public openFromBase64(data: string, fileName?: string): Promise<void> {
        return this.load({ kind: 'base64', data, fileName });
    }

    /*
     * Acquires one presentation source through the shared browser load path.
     * M1-T3 attaches off-main-thread parsing after this boundary.
 * @param {PresentationSource} source - source
 * @returns {Promise} result
     *
     * @private
     */
    public async load(source: PresentationSource): Promise<void> {
        this.cancelLoad();
        this.notRenderedElements = [];
        this.lastPresentationSource = source;
        const requestId: number = ++this.loadRequestId;
        const controller: AbortController = new AbortController();
        this.loadAbortController = controller;
        this.setLoadState('Loading');
        void ((this.loadUi) !== undefined && (this.loadUi) !== null ? (this.loadUi).showLoading() : undefined);
        let openedSession: PresentationSession | null = null;

        try {
            const acquired: AcquiredPresentation = await acquirePresentationSource(source, {
                signal: controller.signal,
                maxBytes: this.maxUncompressedBytes,
                onProgress: (progress: PresentationLoadProgress): void => {
                    if (requestId !== this.loadRequestId) {
                        return;
                    }
                    this.trigger('loadProgress', {
                        sender: this,
                        name: 'loadProgress',
                        ...progress
                    } as LoadProgressEventArgs);
                    void ((this.loadUi) !== undefined && (this.loadUi) !== null ? (this.loadUi).showLoading(progress) : undefined);
                }
            });
            if (requestId !== this.loadRequestId) {
                return;
            }
            const byteLength: number = acquired.bytes.byteLength;
            const session: PresentationSession = await openPresentationSession(acquired.bytes, {
                limits: {
                    entryCount: this.maxZipEntries,
                    totalUncompressedBytes: this.maxUncompressedBytes,
                    singlePartUncompressedBytes: this.maxSinglePartBytes,
                    compressionRatio: this.maxCompressionRatio
                }
            });
            openedSession = session;
            if (requestId !== this.loadRequestId) {
                session.close();
                return;
            }
            if (this.presentationSession) {
                this.presentationSession.close();
            }
            this.clearThumbnailRenderers();
            this.presentationSession = session;
            // A Worker session owns the transferred buffer. The main-thread fallback
            // can retain it for Download Original. Export otherwise re-acquires the
            // bytes from the load source on demand, so no extra copy is held.
            this.documentContent = session.info.mode === 'main-thread'
                ? acquired.bytes
                : undefined;
            this._slideCount = session.info.slideCount;
            this._slideWidthPt = session.info.slideWidthPt;
            this._slideHeightPt = session.info.slideHeightPt;
            // A newly opened deck always starts at the first slide. Reusing the
            // previous deck's selected index would open the new file mid-deck.
            const initialSlideIndex: number = 0;
            this.slideIndex = initialSlideIndex;
            void ((this.mainSlideModule) !== undefined && (this.mainSlideModule) !== null ? (this.mainSlideModule).refresh() : undefined);
            let initialSlide: SlideRenderSnapshot | undefined;
            if (session.info.slideCount > 0) {
                initialSlide = await session.requestSlide(
                    initialSlideIndex,
                    controller.signal
                );
                if (this.mainSlideModule !== undefined && this.mainSlideModule !== null) {
                    await this.mainSlideModule.renderSlideFrame(
                        renderSlide(session.info, initialSlide, initialSlide.shapes), initialSlide.shapes, {
                            request: (mediaRequestId: string, signal?: AbortSignal) =>
                                session.requestMedia(mediaRequestId, signal),
                            requestExternal: (target: string, signal?: AbortSignal) =>
                                this.requestExternalPicture(target, signal),
                            chartRenderer: this.chartRenderer,
                            requestChart: session.requestChart ? session.requestChart.bind(session) : undefined,
                            activateHyperlink: (activation: import('./render/text/html-text-emitter').TextHyperlinkActivation,
                                                event: MouseEvent) =>
                                this.reportHyperlinkClick(initialSlideIndex, activation, event),
                            reportUnsupported: (issue: import('./main-slide/slide-frame-emitter').UnsupportedRenderIssue) =>
                                this.reportUnsupportedElement(initialSlideIndex, issue)
                        }, controller.signal);
                    applySlideSemanticContext(this.element, initialSlideIndex, session.info.slideCount, false, this.locale);
                }
            }
            if (acquired.sourceUrl) {
                this.documentPath = acquired.sourceUrl;
            }
            if (acquired.fileName) {
                this.fileName = acquired.fileName;
            }
            this.refreshSourceChrome();
            if (this.notesPane) {
                this.notesPane.onDocumentChanged();
            }
            this.setLoadState('Ready');
            void ((this.loadUi) !== undefined && (this.loadUi) !== null ? (this.loadUi).hide() : undefined);
            if (this.thumbnailModule) {
                this.thumbnailModule.refresh();
            }
            if (this.toolbarModule) {
                this.toolbarModule.refreshInfo();
            }
            if (this.statusBarModule) {
                this.statusBarModule.refreshSlideCounter();
            }
            this.trigger('documentLoad', {
                sender: this,
                name: 'documentLoad',
                bytesLoaded: byteLength,
                fileName: acquired.fileName,
                sourceKind: acquired.sourceKind,
                slideCount: session.info.slideCount,
                parseMode: session.info.mode,
                hasMacros: session.info.hasMacros,
                slideContent: initialSlide ? summarizeSlideContent(initialSlide.shapes) : undefined
            } as DocumentLoadEventArgs);
        } catch (error) {
            if (requestId !== this.loadRequestId) {
                void ((openedSession) !== undefined && (openedSession) !== null ? (openedSession).close() : undefined);
                return;
            }
            if (openedSession && this.presentationSession === openedSession) {
                openedSession.close();
                this.presentationSession = null;
                this.documentContent = undefined;
            }
            const loadError: PresentationLoadError = error instanceof PresentationLoadError
                ? error
                : new PresentationLoadError('Corrupt', { cause: error });
            this.setLoadState(
                loadError.code === 'Aborted'
                    ? 'Ready'
                    : 'Error'
            );
            this.trigger('loadFailed', {
                sender: this,
                name: 'loadFailed',
                code: loadError.code,
                messageKey: loadError.messageKey,
                status: loadError.status,
                error: loadError
            } as LoadFailedEventArgs);
            void ((this.loadUi) !== undefined && (this.loadUi) !== null ? (this.loadUi).showError(loadError) : undefined);
            throw loadError;
        } finally {
            if (requestId === this.loadRequestId) {
                this.loadAbortController = null;
            }
        }
    }

    /*
 * Cancels the active source acquisition.
 * @returns {void} result
     *
     * @private
 */
    public cancelLoad(): void {
        if (this.loadAbortController) {
            this.loadAbortController.abort();
            this.loadAbortController = null;
        }
        if (this.slideRenderAbortController) {
            this.slideRenderAbortController.abort();
            this.slideRenderAbortController = null;
        }
    }

    /*
 * Retries the most recently requested presentation source.
 * @returns {Promise} result
     *
     * @private
 */
    public retryLoad(): Promise<void> {
        return this.lastPresentationSource
            ? this.load(this.lastPresentationSource)
            : Promise.resolve();
    }

    /**
     * Shows a ribbon tab by id.
     *
     * @public
     * @param {string} tabId - Tab id
     * @returns {void}
     */
    public showRibbonTab(tabId: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.showTab(tabId);
        }
    }

    /**
     * Hides a ribbon tab by id.
     *
     * @public
     * @param {string} tabId - Tab id
     * @returns {void}
     */
    public hideRibbonTab(tabId: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.hideTab(tabId);
        }
    }

    /**
     * Enables a ribbon tab by id.
     *
     * @public
     * @param {string} tabId - Tab id
     * @returns {void}
     */
    public enableRibbonTab(tabId: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.enableTab(tabId);
        }
    }

    /**
     * Disables a ribbon tab by id.
     *
     * @public
     * @param {string} tabId - Tab id
     * @returns {void}
     */
    public disableRibbonTab(tabId: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.disableTab(tabId);
        }
    }

    /**
     * Adds a ribbon tab from a public descriptor.
     *
     * @public
     * @param {RibbonTabInfo} tab - Tab info
     * @param {string} targetId - Optional existing tab id to insert before
     * @returns {void}
     */
    public addRibbonTab(tab: RibbonTabInfo, targetId?: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.addTab(tab, targetId);
        }
    }

    /**
     * Shows a ribbon group by id.
     *
     * @public
     * @param {string} groupId - Group id
     * @returns {void}
     */
    public showRibbonGroup(groupId: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.showGroup(groupId);
        }
    }

    /**
     * Hides a ribbon group by id.
     *
     * @public
     * @param {string} groupId - Group id
     * @returns {void}
     */
    public hideRibbonGroup(groupId: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.hideGroup(groupId);
        }
    }

    /**
     * Enables a ribbon group by id.
     *
     * @public
     * @param {string} groupId - Group id
     * @returns {void}
     */
    public enableRibbonGroup(groupId: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.enableGroup(groupId);
        }
    }

    /**
     * Disables a ribbon group by id.
     *
     * @public
     * @param {string} groupId - Group id
     * @returns {void}
     */
    public disableRibbonGroup(groupId: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.disableGroup(groupId);
        }
    }

    /**
     * Adds a ribbon group to a tab.
     *
     * @public
     * @param {string} tabId - Target tab id
     * @param {RibbonGroupInfo} group - Group info
     * @param {string} targetId - Optional existing group id to insert before
     * @returns {void}
     */
    public addRibbonGroup(
        tabId: string,
        group: RibbonGroupInfo,
        targetId?: string
    ): void {
        if (this.toolbarModule) {
            this.toolbarModule.addGroup(tabId, group, targetId);
        }
    }

    /**
     * Shows a ribbon item by id.
     *
     * @public
     * @param {string} itemId - Item id
     * @returns {void}
     */
    public showRibbonItem(itemId: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.showItem(itemId);
        }
    }

    /**
     * Hides a ribbon item by id.
     *
     * @public
     * @param {string} itemId - Item id
     * @returns {void}
     */
    public hideRibbonItem(itemId: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.hideItem(itemId);
        }
    }

    /**
     * Enables a ribbon item by id.
     *
     * @public
     * @param {string} itemId - Item id
     * @returns {void}
     */
    public enableRibbonItem(itemId: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.enableItem(itemId);
        }
    }

    /**
     * Disables a ribbon item by id.
     *
     * @public
     * @param {string} itemId - Item id
     * @returns {void}
     */
    public disableRibbonItem(itemId: string): void {
        if (this.toolbarModule) {
            this.toolbarModule.disableItem(itemId);
        }
    }

    /**
     * Adds a ribbon item to a group.
     *
     * @public
     * @param {string} groupId - Target group id
     * @param {RibbonItemInfo} item - Item info
     * @param {string} targetId - Optional existing item id to insert before
     * @returns {void}
     */
    public addRibbonItem(
        groupId: string,
        item: RibbonItemInfo,
        targetId?: string
    ): void {
        if (this.toolbarModule) {
            this.toolbarModule.addItem(groupId, item, targetId);
        }
    }

    /**
     * Announces a status message through the editor's live region.
     *
     * Public so chrome modules (ribbon, thumbnails, status bar) can share one path.
     *
     * @param {string} message - Status text
     * @returns {void}
     *
     * @private
     */
    public announce(message: string): void {
        this.announceStatus(message);
    }

    /**
     * Copies a shareable link to the clipboard and announces the result.
     *
     * Uses an absolute `http(s)` {@link documentPath} when available; otherwise
     * falls back to `location.href`.
     *
     * @returns {void}
     *
     * @private
     */
    public shareLink(): void {
        const shareText: string = this.resolveShareText();
        const clipboard: Clipboard | undefined =
      typeof navigator !== 'undefined' ? navigator.clipboard : undefined;

        if (!clipboard || typeof clipboard.writeText !== 'function') {
            this.announceStatus('Unable to copy link');
            return;
        }

        void clipboard.writeText(shareText).then(
            () => {
                this.announceStatus('Link copied to clipboard');
            },
            () => {
                this.announceStatus('Unable to copy link');
            }
        );
    }

    /**
     * Copies the currently selected slide text to the clipboard.
     *
     * Gated by {@link enableCopy}. Used by the Home tab Copy command. Copies
     * only the selected slide text (never the page URL); with no slide text
     * selected nothing is written, matching PowerPoint where Copy is disabled.
     *
     * @returns {void}
     *
     * @private
     */
    public copySelection(): void {
        this.copySelectedText();
    }

    /**
     * Whether slide text is currently selected (drives Home Copy enablement).
     *
     * @readonly
     * @returns {boolean} True while a registered slide text run is selected
     *
     * @private
     */
    public get hasSlideTextSelection(): boolean {
        return this.getSelectionFontState() !== undefined;
    }

    /**
     * Character formatting of the selected slide text, aggregated like
     * PowerPoint's Font group: font name / size are `undefined` when the
     * selection mixes values; Bold / Italic / Underline / Strikethrough are on
     * only when every selected run has the format.
     *
     * @returns {SelectionFontState|undefined} Formatting state, `undefined` without a text selection
     *
     * @private
     */
    public getSelectionFontState(): SelectionFontState | undefined {
        if (typeof window === 'undefined' || typeof window.getSelection !== 'function' || !this.element) {
            return undefined;
        }
        const root: HTMLElement | null = this.element.querySelector('.ej2-pptx-main-slide__content');
        return root ? fontStateForSelection(root, window.getSelection()) : undefined;
    }

    /**
     * Copies the current text selection only (no share-link fallback).
     *
     * Used by the main slide context menu **Copy Text**. Gated by {@link enableCopy}.
     *
     * @returns {void}
     *
     * @private
     */
    public copySelectedText(): void {
        if (!this.enableCopy || !this.enableTextSelection) {
            return;
        }

        const modelPayload: ClipboardPayload | undefined = this.resolveModelClipboardPayload();
        if (modelPayload) {
            this.writeClipboardPayload(modelPayload);
            return;
        }
        let text: string = '';
        if (typeof window !== 'undefined' && typeof window.getSelection === 'function') {
            const selection: Selection | null = window.getSelection();
            const slideRoot: Element | null = this.element
                ? this.element.querySelector('.ej2-pptx-main-slide__content') : null;
            // Only text selected inside the slide is copied (never ribbon / page text).
            if (selection && slideRoot && selection.anchorNode && slideRoot.contains(selection.anchorNode)) {
                text = selection.toString().trim();
            }
        }
        if (text.length === 0) {
            this.announce(this.getLocalizedText('NothingToCopy'));
            return;
        }

        this.writeClipboardText(text);
    }

    /**
     * When true, enables the Home tab Undo action. Default false until a history
     * stack is available.
     *
     * @type {boolean}
     * @default false
     *
     * @private
     */
    @Property(false)
    public canUndo: boolean;

    /**
     * When true, enables the Home tab Redo action. Default false until a history
     * stack is available.
     *
     * @type {boolean}
     * @default false
     *
     * @private
     */
    @Property(false)
    public canRedo: boolean;

    /**
     * Undoes the last editor history action.
     *
     * MVP: no history stack yet — announces unavailability when {@link canUndo} is false.
     *
     * @returns {void}
     *
     * @private
     */
    public undo(): void {
        if (!this.canUndo) {
            this.announce(this.getLocalizedText('NothingToUndo'));
            return;
        }
        this.announce(this.getLocalizedText('Undo'));
    }

    /**
     * Redoes the last undone editor history action.
     *
     * MVP: no history stack yet — announces unavailability when {@link canRedo} is false.
     *
     * @returns {void}
     *
     * @private
     */
    public redo(): void {
        if (!this.canRedo) {
            this.announce(this.getLocalizedText('NothingToRedo'));
            return;
        }
        this.announce(this.getLocalizedText('Redo'));
    }

    /**
     * Opens the Find entry point (Home tab).
     *
     * MVP uses a prompt; full multi-slide search is deferred to Phase 2.
     *
     * @returns {void}
     *
     * @private
     */
    public openFind(): void {
        if (typeof window === 'undefined' || typeof window.prompt !== 'function') {
            this.announce(this.getLocalizedText('FindNotAvailable'));
            return;
        }
        const raw: string | null = window.prompt(this.getLocalizedText('FindInPresentation'), '');
        if (raw === null) {
            return;
        }
        const query: string = raw.trim();
        if (query.length === 0) {
            return;
        }
        this.announce(this.getLocalizedText('FindNotAvailableYet', query));
    }

    /**
     * Opens the Zoom dialog (View → Zoom → Zoom…): fit options, presets and a
     * custom percentage. No-op without the injectable Magnification module.
     *
     * @returns {void}
     *
     * @private
     */
    public openZoomDialog(): void {
        if (!this.magnificationModule) {
            return;
        }
        if (!this.zoomDialog) {
            this.zoomDialog = new ZoomDialog(this);
        }
        this.zoomDialog.open();
    }

    /**
     * Opens the Keyboard Shortcuts help dialog (Help tab).
     *
     * Content lists chrome shortcuts already shown on ribbon tooltips only.
     *
     * @returns {void}
     *
     * @private
     */
    public openKeyboardShortcuts(): void {
        const content: HTMLElement = this.buildKeyboardShortcutsContent();
        this.showHelpDialog('Keyboard Shortcuts', content);
    }

    /**
     * Opens the About PowerPoint Editor dialog (Help tab).
     *
     * Shows product name, {@link EDITOR_VERSION}, and package license notice.
     *
     * @returns {void}
     *
     * @private
     */
    public openAbout(): void {
        const content: HTMLElement = this.buildAboutContent();
        this.showHelpDialog('About PowerPoint Editor', content);
    }

    /**
     * Starts slideshow playback from slide 1 (Slideshow tab).
     *
     * Delegates to the injectable SlideShow module; without the module
     * (`PptxEditor.Inject(SlideShow)`) or while {@link enableSlideShow} is
     * false this is a no-op.
     *
     * MVP: no-op; full slideshow implementation deferred to TASK-1041+.
     *
     * @public
     * @returns {void}
     */
    public startSlideShowFromBeginning(): void {
        if (this.slideShowModule) {
            this.slideShowModule.startFromBeginning();
        }
    }

    /**
     * Starts slideshow playback from the current slide index (Slideshow tab).
     *
     * Delegates to the injectable SlideShow module; without the module
     * (`PptxEditor.Inject(SlideShow)`) or while {@link enableSlideShow} is
     * false this is a no-op.
     *
     * MVP: no-op; full slideshow implementation deferred to TASK-1041+.
     *
     * @public
     * @returns {void}
     */
    public startSlideShowFromCurrent(): void {
        if (this.slideShowModule) {
            this.slideShowModule.startFromCurrent();
        }
    }

    /**
     * Exits slideshow playback and returns to normal viewing (Slideshow tab).
     *
     * Delegates to the injectable SlideShow module; without the module
     * (`PptxEditor.Inject(SlideShow)`) or while {@link enableSlideShow} is
     * false this is a no-op.
     *
     * MVP: no-op; full slideshow implementation deferred to TASK-1041+.
     *
     * @public
     * @returns {void}
     */
    public exitSlideShow(): void {
        if (this.slideShowModule) {
            this.slideShowModule.exit();
        }
    }

    /**
     * Toggles fullscreen mode on the editor root element.
     *
     * @returns {void}
     *
     * @private
     */
    public toggleFullscreen(): void {
        if (!this.element) {
            return;
        }

        if (this.isFullscreen()) {
            this.exitFullscreen();
            return;
        }

        const root: HTMLElement = this.element;
        if (typeof root.requestFullscreen === 'function') {
            void root.requestFullscreen().catch(() => {
                // API may deny; state is reconciled via fullscreenchange.
            });
        }
    }

    /**
     * Returns whether the editor root is the current fullscreen element.
     *
     * @returns {boolean} True when the editor root is fullscreen
     *
     * @private
     */
    public isFullscreen(): boolean {
        if (!this.element) {
            return false;
        }
        return document.fullscreenElement === this.element;
    }

    /**
     * Exits fullscreen when the editor root is the fullscreen element.
     *
     * @returns {void}
     *
     * @private
     */
    public exitFullscreen(): void {
        if (!this.isFullscreen()) {
            return;
        }
        const doc: Document = document;
        if (typeof doc.exitFullscreen === 'function') {
            void doc.exitFullscreen().catch(() => {
                // API may deny; state is reconciled via fullscreenchange.
            });
        }
    }

    /**
     * Sets zoom percentage, clamping to 10–400 without throwing.
     *
     * Delegates to the injectable Magnification module; without the module
     * (`PptxEditor.Inject(Magnification)`) or while
     * {@link enableMagnification} is false this is a no-op.
     *
     * @public
     * @param {number} percent - Requested zoom percentage
     * @returns {void}
     */
    public setZoom(percent: number): void {
        if (this.magnificationModule) {
            this.magnificationModule.setZoom(percent);
        }
    }

    /**
     * Applies a zoom percentage through the validation/clamp/apply pipeline.
     *
     * Internal seam owned by the injectable Magnification module. Validates
     * the request, clamps to 10–400, projects onto the main slide area
     * (switching it to percent mode) and status chrome, and triggers
     * `zoomChange`.
     *
     * @internal
     * @param {number} percent - Requested zoom percentage
     * @param {string} zoomType - `zoomChange` payload type (`percentage`/`fit`)
     * @returns {void}
     *
     * @private
     */
    public applyZoomScale(percent: number, zoomType: string): void {
        if (typeof percent !== 'number' || !Number.isFinite(percent)) {
            return;
        }
        const clamped: number = Math.min(400, Math.max(10, Math.round(percent)));
        const previous: number = this.zoom;
        if (previous === clamped) {
            return;
        }
        this.zoom = clamped;
        if (this.toolbarModule) {
            this.toolbarModule.refreshActionState();
        }
        if (this.mainSlideModule) {
            this.mainSlideModule.onHostZoomChanged();
        }
        if (this.toolbarModule) {
            this.toolbarModule.refreshActionState();
        }
        if (this.statusBarModule) {
            this.statusBarModule.refreshZoom();
        }
        this.trigger('zoomChange', {
            sender: this, name: 'zoomChange', previousZoom: previous, newZoom: clamped, zoomType: zoomType
        } as ZoomChangedEventArgs);
    }

    /**
     * Syncs a fit-computed zoom percent without forcing percent zoom mode.
     *
     * Internal seam owned by the injectable Magnification module. Unlike
     * {@link applyZoomScale} this does not switch the main slide area zoom
     * mode; it only syncs the zoom value, status chrome, and `zoomChange`
     * payload so the toolbar display matches the fit scale.
     *
     * @internal
     * @param {number} percent - Computed fit zoom percentage
     * @returns {void}
     *
     * @private
     */
    public applyZoomScaleDisplay(percent: number): void {
        if (typeof percent !== 'number' || !Number.isFinite(percent)) {
            return;
        }
        const clamped: number = Math.min(400, Math.max(10, Math.round(percent)));
        if (this.zoom === clamped) {
            return;
        }
        const previous: number = this.zoom;
        this.zoom = clamped;
        if (this.toolbarModule) {
            this.toolbarModule.refreshActionState();
        }
        if (this.statusBarModule) {
            this.statusBarModule.refreshZoom();
        }
        this.trigger('zoomChange', {
            sender: this, name: 'zoomChange', previousZoom: previous, newZoom: clamped, zoomType: 'fit'
        } as ZoomChangedEventArgs);
    }

    /**
     * Applies fit-to-window zoom mode onto the main slide area.
     *
     * Internal seam owned by the injectable Magnification module.
     *
     * @internal
     * @returns {void}
     */
    public applyFitToWindow(): void {
        if (this.mainSlideModule) {
            this.mainSlideModule.setZoomMode('fit-to-window');
            if (this.toolbarModule) {
                this.toolbarModule.refreshActionState();
            }
            return;
        }
        this.announce(this.getLocalizedText('FitToWindowNotAvailable'));
    }

    /**
     * Applies fit-width zoom mode onto the main slide area.
     *
     * Internal seam owned by the injectable Magnification module.
     *
     * @internal
     * @returns {void}
     */
    public applyFitWidth(): void {
        if (this.mainSlideModule) {
            this.mainSlideModule.setZoomMode('fit-width');
            if (this.toolbarModule) {
                this.toolbarModule.refreshActionState();
            }
            return;
        }
        this.announce(this.getLocalizedText('FitToWidthNotAvailable'));
    }

    /*
     * Adds, changes, or removes one application font substitution and re-renders
     * the active slide. Passing `undefined` restores the shipped/default policy.
     *
     * @param {string} originalName - Authored font family in the presentation.
     * @param {FontSubstitution|undefined} substitute - Substitute family or ordered list; `undefined` removes it.
 * @returns {void} result
     *
     * @private
     */
    public setFontSubstitution(originalName: string, substitute: FontSubstitution | undefined): void {
        const next: Record<string, FontSubstitution> = { ...this.fontSubstitutions };
        const normalized: string = originalName.trim();
        const existing: string | undefined = Object.keys(next).find((key: string): boolean =>
            key.toLocaleLowerCase('en-US') === normalized.toLocaleLowerCase('en-US'));
        if (existing) {
            delete next[existing];
        }
        if (substitute !== undefined && normalized) {
            next[normalized] = substitute;
        }
        this.fontSubstitutions = next;
        this.fontProvider.setSubstitutions(next);
        if (this.presentationSession) {
            void this.renderLoadedSlide(this.slideIndex);
        }
    }

    /*
 * Returns fonts substituted or unavailable during this editor session.
 * @returns {Array.<FontResolutionNotice>} result
     *
     * @private
 */
    public getFontResolutionReport(): ReadonlyArray<FontResolutionNotice> {
        return this.fontProvider.getResolutionReport();
    }

    /*
 * Returns clone-safe unsupported-element evidence for the current presentation.
 * @returns {Array.<UnsupportedElementEventArgs>} result
     *
     * @private
 */
    public getNotRenderedElements(): ReadonlyArray<UnsupportedElementEventArgs> {
        return this.notRenderedElements.map((entry: UnsupportedElementEventArgs): UnsupportedElementEventArgs => ({
            ...entry, bounds: { ...entry.bounds }
        }));
    }

    /*
 * @internal Shared resolver for main-slide measurement and DOM emission.
 * @returns {FontProvider} result
     *
     * @private
 */
    public getFontProvider(): FontProvider {
        return this.fontProvider;
    }

    /**
     * Syncs host zoom percent from a fit-mode layout without switching zoom mode.
     *
     * Delegates to the injectable Magnification module; no-op without it.
     *
     * Used by {@link MainSlideArea} so the ribbon ComboBox matches the fit scale.
     *
     * @param {number} percent - Computed fit zoom percentage
     * @returns {void}
     *
     * @private
     */
    public syncZoomDisplay(percent: number): void {
        if (this.magnificationModule) {
            this.magnificationModule.syncZoomDisplay(percent);
        }
    }

    /**
     * Increases zoom by 10 percentage points (clamped).
     *
     * Delegates to the injectable Magnification module; no-op without it.
     *
     * @public
     * @returns {void}
     */
    public zoomIn(): void {
        if (this.magnificationModule) {
            this.magnificationModule.zoomIn();
        }
    }

    /**
     * Decreases zoom by 10 percentage points (clamped).
     *
     * Delegates to the injectable Magnification module; no-op without it.
     *
     * @public
     * @returns {void}
     */
    public zoomOut(): void {
        if (this.magnificationModule) {
            this.magnificationModule.zoomOut();
        }
    }

    /**
     * Sets zoom to 100%.
     *
     * Delegates to the injectable Magnification module; no-op without it.
     *
     * @public
     * @returns {void}
     */
    public zoomTo100(): void {
        if (this.magnificationModule) {
            this.magnificationModule.zoomTo100();
        }
    }

    /**
     * Fits the whole slide in the view area.
     *
     * Delegates to the injectable Magnification module; no-op without it.
     *
     * @public
     * @returns {void}
     */
    public fitToWindow(): void {
        if (this.magnificationModule) {
            this.magnificationModule.fitToWindow();
        }
    }

    /**
     * Fits slide width in the view area (aspect ratio preserved).
     *
     * Delegates to the injectable Magnification module; no-op without it.
     *
     * @public
     * @returns {void}
     */
    public fitWidth(): void {
        if (this.magnificationModule) {
            this.magnificationModule.fitWidth();
        }
    }

    /**
     * Enters default reading / normal view mode (MVP announce).
     *
     * @returns {void}
     *
     * @private
     */
    public setReadingView(): void {
        this.viewModeLabel = DEFAULT_VIEW_MODE_LABEL;
        this.announce(this.getLocalizedText('ReadingViewActive'));
    }

    /**
     * Opens Presenter View (starts the slideshow first when it is not running).
     *
     * @public
     * @returns {void}
     */
    public startPresenterView(): void {
        if (!this.slideShowModule) {
            return;
        }
        // Presenter View runs inside a slide show: start one from the current slide first.
        // When no show was running, End Show must return to the default UI, not to the show.
        const launchedFromDefaultView: boolean = !this.slideShowModule.isPresentationMode();
        if (launchedFromDefaultView) {
            this.slideShowModule.startFromCurrent();
        }
        if (this.slideShowModule.isPresentationMode()) {
            this.slideShowModule.openPresenterView(launchedFromDefaultView);
        }
    }

    // ============== Private Helper Methods ==============

    /*
     * Creates the DOM structure for the editor
     *
     * @private
 * @returns {void} result
     */
    private createDOMStructure(): void {
        if (!this.element) {
            return;
        }

        // Create shell container
        const shell: HTMLDivElement = document.createElement('div');
        shell.className = 'ej2-pptx-shell';

        // Create ribbon
        const ribbon: HTMLDivElement = document.createElement('div');
        ribbon.className = 'ej2-pptx-ribbon';
        shell.appendChild(ribbon);

        // Create main container (split: slide panel + slide area)
        const mainContainer: HTMLDivElement = document.createElement('div');
        mainContainer.className = 'ej2-pptx-container';

        // Create slide panel (left sidebar)
        const slidePanel: HTMLDivElement = document.createElement('div');
        slidePanel.className = 'ej2-pptx-slide-panel';
        mainContainer.appendChild(slidePanel);

        // Create slide area (main content)
        const slideArea: HTMLDivElement = document.createElement('div');
        slideArea.className = 'ej2-pptx-slide-area';
        mainContainer.appendChild(slideArea);

        shell.appendChild(mainContainer);

        // Create status bar
        const statusBar: HTMLDivElement = document.createElement('div');
        statusBar.className = 'ej2-pptx-status-bar';
        shell.appendChild(statusBar);

        // Append shell to element
        this.element.appendChild(shell);

    // Fullscreen listener is attached in recoverAfterSuper()
    // after class fields settle (useDefineForClassFields wipes fields set here).
    }

    /**
     * Ensures the main slide area module is created and mounted into the shell.
     *
     * Safe to call when the empty `.ej2-pptx-slide-area` host already exists.
     *
     * @private
     * @returns {void}
     */
    private ensureMainSlideInitialized(): void {
        if (!this.element) {
            return;
        }

        if (this.mainSlideModule) {
            this.mainSlideModule.refresh();
            return;
        }

        const slideAreaHost: HTMLElement | null = this.element.querySelector(
            '.ej2-pptx-slide-area'
        );
        if (!slideAreaHost) {
            return;
        }

        this.mainSlideModule = new MainSlideArea(this);
        this.mainSlideModule.initialize(slideAreaHost);
    }

    /**
     * Declares the injectable modules required by this editor instance.
     *
     * The `Toolbar` and `ThumbnailView` modules are required only while their
     * `enable*` properties are true; the EJ2 `ModuleLoader` instantiates each
     * (when the application injected it via `PptxEditor.Inject(...)`) and
     * attaches the instance under the derived member name (`toolbar` →
     * {@link toolbarModule}, `thumbnail` → {@link thumbnailModule}). Clearing
     * a declaration makes the loader destroy that module on the next
     * refresh cycle.
     *
     * @protected
     * @returns {ModuleDeclaration[]} Required module declarations
     */
    protected requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.enableToolbar) {
            modules.push({ args: [this], member: 'toolbar' });
        }
        if (this.enableThumbnail) {
            modules.push({ args: [this], member: 'thumbnail' });
        }
        if (this.enableNavigation) {
            modules.push({ args: [this], member: 'navigation' });
        }
        if (this.enableMagnification) {
            modules.push({ args: [this], member: 'magnification' });
        }
        if (this.enableSlideShow) {
            modules.push({ args: [this], member: 'slideShow' });
        }
        if (this.enablePrint) {
            modules.push({ args: [this], member: 'print' });
        }
        return modules;
    }

    /**
     * Ensures the injected ThumbnailView module owns a mounted panel.
     *
     * Safe to call when the empty `.ej2-pptx-slide-panel` host already exists.
     * No-op when the application did not inject the optional feature.
     *
     * @private
     * @returns {void}
     */
    private ensureThumbnailPanelInitialized(): void {
        if (!this.element) {
            return;
        }

        const module: ThumbnailView | undefined = this.thumbnailModule;
        if (!module) {
            return;
        }

        if (!this.enableThumbnail) {
            module.destroy();
            return;
        }

        const panelHost: HTMLElement | null = this.element.querySelector(
            '.ej2-pptx-slide-panel'
        );
        if (!panelHost) {
            return;
        }

        module.initialize(panelHost);
    }

    /**
     * Ensures the status bar module is created and mounted into the shell.
     *
     * Safe to call when the empty `.ej2-pptx-status-bar` host already exists.
     *
     * @private
     * @returns {void}
     */
    private ensureStatusBarInitialized(): void {
        if (!this.element) {
            return;
        }

        if (this.statusBarModule) {
            this.statusBarModule.refresh();
            return;
        }

        const statusHost: HTMLElement | null = this.element.querySelector(
            '.ej2-pptx-status-bar'
        );
        if (!statusHost) {
            return;
        }

        this.statusBarModule = new StatusBar(this);
        this.statusBarModule.initialize(statusHost);
    }

    /*
 * Ensures the accessible loading/error overlay is mounted once.
 * @returns {void} result
 */
    private ensureLoadUiInitialized(): void {
        if (!this.element) {
            return;
        }

        if (this.loadUi) {
            return;
        }
        this.loadUi = new LoadUi(this);
        this.loadUi.initialize(this.element);        
    }

    /**
     * Navigates to a 0-based slide index (thumbnail / nav single source of truth).
     *
     * @public
     * @param {number} index - Target slide index
     * @returns {void}
     */
    public goToSlide(index: number): void {
        const count: number = this.slideCount;
        let next: number = 0;
        if (typeof index === 'number' && Number.isFinite(index)) {
            next = Math.min(count - 1, Math.max(0, Math.floor(index)));
        }
        const previous: number = this.slideIndex;
        if (previous !== next) {
            this.slideIndex = next;
            void this.renderLoadedSlide(next);
            this.trigger('slideChange', {
                sender: this, name: 'slideChange', previousIndex: previous, newIndex: next, slideCount: count
            } as SlideChangedEventArgs);
        }
        if (this.thumbnailModule) {
            this.thumbnailModule.onSlideIndexChanged();
        }
        if (this.toolbarModule) {
            this.toolbarModule.refreshInfo();
        }
        if (this.statusBarModule) {
            this.statusBarModule.refreshSlideCounter();
        }
        if (this.notesPane) {
            this.notesPane.onSlideChanged(next);
        }
        this.announce(this.getLocalizedText('SlideCounter', next + 1, count));
    }

    /**
     * Advances one slide, clamped at the last slide.
     * @returns {void} result
     */
    public nextSlide(): void {
        this.goToSlide(this.slideIndex + 1);
    }

    /**
     * Moves back one slide, clamped at the first slide.
     * @returns {void} result
     */
    public previousSlide(): void {
        this.goToSlide(this.slideIndex - 1);
    }

    /**
     * Navigates to the first slide.
     * @returns {void} result
     *
     * @private
     */
    public firstSlide(): void {
        this.goToSlide(0);
    }

    /**
     * Navigates to the last slide.
     * @returns {void} result
     *
     * @private
     */
    public lastSlide(): void {
        this.goToSlide(this.slideCount - 1);
    }

    /**
     * Refreshes Home Copy enablement and the read-only Font group when the
     * slide text selection changes (cheap no-op when the state is unchanged).
     */
    private onSlideSelectionChanged(): void {
        if (this.toolbarModule) {
            this.toolbarModule.refreshSelectionState();
        }
    }

    private onEditorKeyDown(event: KeyboardEvent): void {
        if (event.key === 'F5' && !event.ctrlKey && !event.altKey && !event.metaKey && this.hasSlideShowModule) {
            event.preventDefault();
            if (event.shiftKey) {
                this.startSlideShowFromCurrent();
            } else {
                this.startSlideShowFromBeginning();
            }
            return;
        }
        const target: HTMLElement | null = event.target as HTMLElement | null;
        if (!target || !this.element.contains(target) || this.isNavigationEditingTarget(target) ||
            target.closest('.ej2-pptx-thumbnail-panel')) {
            return;
        }
        const modifier: boolean = event.ctrlKey || event.metaKey;
        if (modifier && (event.key === '+' || event.key === '=')) {
            this.zoomIn();
        } else if (modifier && event.key === '-') {
            this.zoomOut();
        } else if (modifier && event.key === '0') {
            this.zoomTo100();
        } else if (!modifier && this.navigationModule) {
            // Slide navigation is owned by the injectable Navigation module;
            // without it (or while disabled) the keys fall through untouched.
            if (this.navigationModule.handleNavigationKey(event)) {
                event.preventDefault();
            }
            return;
        } else {
            return;
        }
        event.preventDefault();
    }

    private onEditorTouchStart(event: TouchEvent): void {
        const target: HTMLElement | null = event.target as HTMLElement | null;
        if (event.touches.length !== 1 || !((target) !== undefined && (target) !== null ? (target).closest('.ej2-pptx-main-slide__viewport') : undefined)) {
            this.touchStart = null;
            return;
        }
        this.touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }

    private onEditorTouchEnd(event: TouchEvent): void {
        if (!this.touchStart || event.changedTouches.length !== 1 || event.touches.length !== 0) {
            this.touchStart = null;
            return;
        }
        const deltaX: number = event.changedTouches[0].clientX - this.touchStart.x;
        const deltaY: number = event.changedTouches[0].clientY - this.touchStart.y;
        this.touchStart = null;
        if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.5) {
            return;
        }
        if (deltaX < 0) {
            this.nextSlide();
        } else {
            this.previousSlide();
        }
    }

    private isNavigationEditingTarget(target: HTMLElement): boolean {
        const tag: string = target.tagName.toLocaleLowerCase('en-US');
        return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
    }

    /*
 * Lazily paints one thumbnail through the same HTML/CSS/SVG pipeline.
 * @param {number} index - index
 * @param {HTMLElement} contentHost - contentHost
 * @returns {void} result
     *
     * @private
 */
    public renderThumbnailSlide(index: number, contentHost: HTMLElement): () => void {
        const session: PresentationSession | null = this.presentationSession;
        if (!session) {
            return (): void => undefined;
        }
        const controller: AbortController = new AbortController();
        const surface: HTMLElement = createElement('div', {
            className: 'ej2-pptx-thumbnail-panel__surface',
            attrs: { 'data-slide-surface': 'true', 'aria-hidden': 'true' }
        });
        const widthPx: number = ptToPx(session.info.slideWidthPt);
        const heightPx: number = ptToPx(session.info.slideHeightPt);
        surface.style.width = `${widthPx}px`;
        surface.style.height = `${heightPx}px`;
        surface.style.transformOrigin = 'top left';
        surface.style.transform = `scale(${Math.min(
            (contentHost.clientWidth || 1) / widthPx,
            (contentHost.clientHeight || 1) / heightPx
        )})`;
        contentHost.appendChild(surface);
        const emitter: SlideFrameEmitter = new SlideFrameEmitter(surface);
        const measurer: TextMeasurer = createTextMeasurer({
            fontProvider: this.getFontProvider(), forceMainThread: true
        });
        this.thumbnailFrameEmitters.add(emitter);
        this.thumbnailTextMeasurers.add(measurer);
        void this.paintThumbnail(index, surface, session, controller.signal, emitter, measurer);
        return (): void => {
            controller.abort();
            if (this.thumbnailFrameEmitters.delete(emitter)) {
                emitter.destroy();
            }
            if (this.thumbnailTextMeasurers.delete(measurer)) {
                measurer.close();
            }
        };
    }

    /**
     * Renders one slide at 100% scale into `host` through the HTML/CSS/SVG
     * pipeline (no canvas) and resolves once text and pictures are painted.
     * Used by the Print module. `host` must be connected to the document.
     *
     * @param {number} index - Zero-based slide index
     * @param {HTMLElement} host - Connected container that receives the slide surface
     * @returns {Promise<HTMLElement | null>} The painted surface, or null when no presentation is loaded
     * @private
     */
    public async renderSlideSurface(index: number, host: HTMLElement): Promise<HTMLElement | null> {
        const session: PresentationSession | null = this.presentationSession;
        if (!session) {
            return null;
        }
        const surface: HTMLElement = createElement('div', {
            className: 'ej2-pptx-thumbnail-panel__surface',
            attrs: { 'data-slide-surface': 'true' }
        });
        surface.style.width = `${ptToPx(session.info.slideWidthPt)}px`;
        surface.style.height = `${ptToPx(session.info.slideHeightPt)}px`;
        host.appendChild(surface);
        const emitter: SlideFrameEmitter = new SlideFrameEmitter(surface);
        const measurer: TextMeasurer = createTextMeasurer({
            fontProvider: this.getFontProvider(), forceMainThread: true
        });
        try {
            await this.paintThumbnail(index, surface, session, new AbortController().signal, emitter, measurer);
        } finally {
            measurer.close();
        }
        this.printFrameEmitters.add(emitter);
        return surface;
    }

    /**
     * Releases emitters created by {@link renderSlideSurface}.
     *
     * @returns {void}
     * @private
     */
    public releasePrintSurfaces(): void {
        this.printFrameEmitters.forEach((emitter: SlideFrameEmitter): void => emitter.destroy());
        this.printFrameEmitters.clear();
    }

    private async paintThumbnail(
        index: number,
        surface: HTMLElement,
        session: PresentationSession,
        signal: AbortSignal,
        emitter: SlideFrameEmitter,
        measurer: TextMeasurer
    ): Promise<void> {
        try {
            const slide: SlideRenderSnapshot = await session.requestSlide(index, signal);
            if (signal.aborted || session !== this.presentationSession || !surface.isConnected) {
                return;
            }
            const model: import('./render/index').SlideRenderModel<import('./render/shape-render-model').SlideShapeSnapshot> = renderSlide(session.info, slide, slide.shapes);
            emitter.render(model);
            await emitter.renderPictures(model, {
                request: (requestId: string, requestSignal?: AbortSignal) =>
                    session.requestMedia(requestId, requestSignal),
                requestExternal: (target: string, requestSignal?: AbortSignal) =>
                    this.requestExternalPicture(target, requestSignal),
                chartRenderer: this.chartRenderer,
                requestChart: session.requestChart ? session.requestChart.bind(session) : undefined,
                reportUnsupported: (issue: import('./main-slide/slide-frame-emitter').UnsupportedRenderIssue) => this.reportUnsupportedElement(index, issue)
            }, signal);
            await emitter.renderText(model, slide.shapes, measurer);
        } catch (error) {
            if (!signal.aborted) {
                surface.dataset.thumbnailRenderError = error instanceof Error ? error.name : 'Error';
            }
        }
    }

    private clearThumbnailRenderers(): void {
        this.thumbnailFrameEmitters.forEach((emitter: SlideFrameEmitter): void => emitter.destroy());
        this.thumbnailTextMeasurers.forEach((measurer: TextMeasurer): void => measurer.close());
        this.thumbnailFrameEmitters.clear();
        this.thumbnailTextMeasurers.clear();
    }

    /*
 * Requests and paints one lazy slide snapshot from the active session.
 * @param {number} index - index
 * @returns {Promise} result
 */
    private async renderLoadedSlide(index: number): Promise<void> {
        const session: PresentationSession | null = this.presentationSession;
        if (!session) {
            return;
        }
        if (this.slideRenderAbortController !== undefined && this.slideRenderAbortController !== null) {
            this.slideRenderAbortController.abort();
        }
        const controller: AbortController = new AbortController();
        this.slideRenderAbortController = controller;
        try {
            const slide: SlideRenderSnapshot = await session.requestSlide(index, controller.signal);
            if (controller.signal.aborted || session !== this.presentationSession) {
                return;
            }
            if (this.mainSlideModule !== undefined && this.mainSlideModule !== null) {
                await this.mainSlideModule.renderSlideFrame(
                    renderSlide(session.info, slide, slide.shapes), slide.shapes, {
                        request: (mediaRequestId: string, signal?: AbortSignal) =>
                            session.requestMedia(mediaRequestId, signal),
                        requestExternal: (target: string, signal?: AbortSignal) =>
                            this.requestExternalPicture(target, signal),
                        chartRenderer: this.chartRenderer,
                        requestChart: session.requestChart ? session.requestChart.bind(session) : undefined,
                        activateHyperlink: (activation: import('./render/text/html-text-emitter').TextHyperlinkActivation,
                                            event: MouseEvent) => this.reportHyperlinkClick(index, activation, event),
                        reportUnsupported: (issue: import('./main-slide/slide-frame-emitter').UnsupportedRenderIssue) =>
                            this.reportUnsupportedElement(index, issue)
                    }, controller.signal);
                applySlideSemanticContext(this.element, index, session.info.slideCount, true, this.locale);
            }
        } catch (error) {
            const renderError: PresentationLoadError = error instanceof PresentationLoadError
                ? error
                : new PresentationLoadError('Corrupt', { cause: error });
            if (renderError.code !== 'Aborted') {
                this.trigger('loadFailed', {
                    sender: this,
                    name: 'loadFailed',
                    code: renderError.code,
                    messageKey: renderError.messageKey,
                    status: renderError.status,
                    error: renderError
                } as LoadFailedEventArgs);
            }
        } finally {
            if (this.slideRenderAbortController === controller) {
                this.slideRenderAbortController = null;
            }
        }
    }

    private reportUnsupportedElement(
        slideIndex: number,
        issue: import('./main-slide/slide-frame-emitter').UnsupportedRenderIssue
    ): void {
        const args: UnsupportedElementEventArgs = {
            sender: this, name: 'unsupportedElement', slideIndex,
            shapeId: issue.shapeId, shapeName: issue.shapeName,
            elementType: issue.kind,
            bounds: issue.bounds, reason: issue.reason, fallbackUsed: issue.fallbackUsed
        };
        if (!this.notRenderedElements.some((entry: UnsupportedElementEventArgs): boolean =>
            entry.slideIndex === args.slideIndex && entry.shapeId === args.shapeId &&
            entry.reason === args.reason)) {
            this.notRenderedElements.push(args);
            this.trigger('unsupportedElement', args);
        }
    }

    private reportHyperlinkClick(
        slideIndex: number,
        activation: import('./render/text/html-text-emitter').TextHyperlinkActivation,
        event: MouseEvent
    ): boolean {
        const args: HyperlinkClickEventArgs = {
            sender: this,
            name: 'hyperlinkClick',
            slideIndex,
            shapeId: activation.shapeId,
            target: activation.target,
            tooltip: activation.tooltip,
            action: activation.action,
            cancel: false
        };
        this.trigger('hyperlinkClick', args);
        if (args.cancel) {
            event.preventDefault();
        }
        return !args.cancel;
    }

    private async requestExternalPicture(
        target: string,
        signal?: AbortSignal
    ): Promise<import('@syncfusion/ej2-pptx').PictureMediaResponse | undefined> {
        const policy: ExternalImagePolicy = this.externalImagePolicy;
        if (policy.mode !== 'allow') {
            return undefined;
        }
        let url: URL;
        try {
            url = new URL(target);
        } catch {
            return undefined;
        }
        if (url.protocol !== 'https:' || !policy.allowedHosts.some((host: string): boolean =>
            host.toLocaleLowerCase('en-US') === url.hostname.toLocaleLowerCase('en-US'))) {
            return undefined;
        }
        const maximumBytes: number = Number.isFinite(policy.maximumBytes)
            ? Math.max(0, Math.floor(policy.maximumBytes)) : 0;
        const timeoutMs: number = Number.isFinite(policy.timeoutMs)
            ? Math.max(1, Math.floor(policy.timeoutMs)) : 1;
        const controller: AbortController = new AbortController();
        const onAbort: () => void = (): void => controller.abort();
        void ((signal) !== undefined && (signal) !== null ? (signal).addEventListener('abort', onAbort, { once: true }) : undefined);
        const timeout: ReturnType<typeof setTimeout> = setTimeout((): void => controller.abort(), timeoutMs);
        try {
            const response: Response = await fetch(url.href, {
                signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error'
            });
            if (!response.ok) {
                return undefined;
            }
            const mimeType: string = (response.headers.get('content-type') || '').split(';', 1)[0].trim();
            if (!/^image\/(?:png|jpeg|gif|webp|bmp|svg\+xml)$/u.test(mimeType)) {
                return undefined;
            }
            const declared: number = Number(response.headers.get('content-length') || 0);
            if (declared > maximumBytes) {
                return undefined;
            }
            const data: ArrayBuffer | undefined = await readBoundedResponse(response, maximumBytes);
            if (!data) {
                return undefined;
            }
            return { type: 'media', requestId: '', mediaRequestId: `external:${url.href}`,
                mimeType, data };
        } catch {
            return undefined;
        } finally {
            clearTimeout(timeout);
            void ((signal) !== undefined && (signal) !== null ? (signal).removeEventListener('abort', onAbort) : undefined);
        }
    }

    /**
     * Expands or collapses the thumbnail panel and keeps ribbon state in sync.
     *
     * @param {boolean} visible - True to expand
     * @returns {void}
     *
     * @private
     */
    public setThumbnailPanelVisible(visible: boolean): void {
        const next: boolean = visible === true;
        if (this.thumbnailModule) {
            this.thumbnailModule.markUserVisibilityOverride();
            this.thumbnailModule.applyVisibilityFromHost(next);
        }
        if (this.thumbnailPanelVisible !== next) {
            this.thumbnailPanelVisible = next;
        }
        if (this.toolbarModule) {
            this.toolbarModule.refreshActionState();
        }
    }

    /**
     * Sets thumbnail panel width in CSS px (clamped to 120–240).
     *
     * @param {number} widthPx - Requested width
     * @returns {void}
     *
     * @private
     */
    public setThumbnailPanelWidth(widthPx: number): void {
        const next: number = clampPanelWidth(widthPx);
        if (this.thumbnailPanelWidth !== next) {
            this.thumbnailPanelWidth = next;
        }
        if (this.thumbnailModule) {
            this.thumbnailModule.applyWidthFromHost(next);
        }
    }

    /**
     * Whether the thumbnail panel is currently expanded.
     *
     * @returns {boolean} True when expanded
     *
     * @private
     */
    public isThumbnailPanelVisible(): boolean {
        if (this.thumbnailModule) {
            return this.thumbnailModule.isExpanded();
        }
        return this.thumbnailPanelVisible === true;
    }

    /**
     * Writes text to the clipboard and announces the result.
     *
     * @private
     * @param {string} text - Text to copy
     * @returns {void}
     */
    private writeClipboardText(text: string): void {
        const clipboard: Clipboard | undefined =
      typeof navigator !== 'undefined' ? navigator.clipboard : undefined;

        if (!clipboard || typeof clipboard.writeText !== 'function') {
            this.announce(this.getLocalizedText('UnableToCopy'));
            return;
        }

        void clipboard.writeText(text).then(
            () => {
                this.announce(this.getLocalizedText('CopiedToClipboard'));
            },
            () => {
                this.announce(this.getLocalizedText('UnableToCopy'));
            }
        );
    }

    /** Returns the registered model payload for the current slide selection.
     * @returns {ClipboardPayload|undefined} The clipboard payload for the selection.
     */
    private resolveModelClipboardPayload(): ClipboardPayload | undefined {
        if (typeof window === 'undefined' || typeof window.getSelection !== 'function') {
            return undefined;
        }
        const root: HTMLElement | null = this.element
            ? this.element.querySelector('.ej2-pptx-main-slide__content') : null;
        return root ? clipboardPayloadForSelection(root, window.getSelection()) : undefined;
    }

    /** Writes both model-backed clipboard formats, falling back to plain text where necessary.
     * @param {ClipboardPayload} payload - The clipboard payload to write.
     * @returns {void} Nothing.
     */
    private writeClipboardPayload(payload: ClipboardPayload): void {
        const clipboard: Clipboard | undefined = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;
        const browserWindow: { ClipboardItem?: ClipboardItemConstructorLike } | undefined =
            typeof window !== 'undefined' ? window as unknown as { ClipboardItem?: ClipboardItemConstructorLike } : undefined;
        const ClipboardItemConstructor: ClipboardItemConstructorLike | undefined = browserWindow
            ? browserWindow.ClipboardItem : undefined;
        const richClipboard: RichClipboard | undefined = clipboard as RichClipboard | undefined;
        if (richClipboard && typeof richClipboard.write === 'function' && ClipboardItemConstructor) {
            const item: ClipboardItemLike = new ClipboardItemConstructor({
                'text/plain': new Blob([payload.plain], { type: 'text/plain' }),
                'text/html': new Blob([payload.html], { type: 'text/html' })
            });
            void richClipboard.write([item]).then(
                (): void => this.announce(this.getLocalizedText('CopiedToClipboard')),
                (): void => this.writeClipboardText(payload.plain)
            );
            return;
        }
        this.writeClipboardText(payload.plain);
    }

    /**
     * Ensures the injected Toolbar module owns a mounted ribbon.
     *
     * Safe to call when the empty `.ej2-pptx-ribbon` host already exists.
     * No-op when the application did not inject the optional feature, or
     * while {@link enableToolbar} is false. When class-field define after
     * `super()` wipes `toolbarModule` but leaves EJ2 ribbon DOM,
     * `EditorRibbon.initialize` tears down host chrome first so only one
     * ribbon is mounted.
     *
     * @private
     * @returns {void}
     */
    private ensureRibbonInitialized(): void {
        if (!this.element) {
            return;
        }

        const ribbonHost: HTMLElement | null = this.element.querySelector(
            '.ej2-pptx-ribbon'
        );

        const module: Toolbar | undefined = this.toolbarModule;
        if (!module || !this.enableToolbar) {
            // Without the injected (or enabled) Toolbar feature the empty
            // `.ej2-pptx-ribbon` host is hidden so it does not reserve
            // vertical space in the shell (UI: no phantom ribbon height).
            if (module) {
                module.destroy();
            }
            if (ribbonHost) {
                ribbonHost.style.display = 'none';
            }
            return;
        }

        if (!ribbonHost) {
            return;
        }

        // Feature present: restore the host and mount the ribbon chrome.
        ribbonHost.style.display = '';
        module.initialize(ribbonHost);
    }

    /**
     * Resolves the file name used for downloads.
     *
     * @private
     * @returns {string} Download file name
     */
    private resolveDownloadFileName(): string {
        const title: string = resolvePresentationTitle(
            this.fileName,
            this.documentPath
        );
        if (title === DEFAULT_PRESENTATION_TITLE) {
            return DEFAULT_DOWNLOAD_FILE_NAME;
        }
        if (/\.(pptx|pptm|ppsx|potx)$/i.test(title)) {
            return title;
        }
        return title + '.pptx';
    }

    /**
     * Triggers a blob-based file download and revokes the object URL.
     *
     * @private
     * @param {ArrayBuffer} content - PPTX binary content
     * @param {string} fileName - Download attribute file name
     * @returns {void}
     */
    private triggerBlobDownload(content: ArrayBuffer, fileName: string): void {
        this.revokePendingDownloadUrl();

        const blob: Blob = new Blob([content], { type: PPTX_CONTENT_TYPE });
        const url: string = URL.createObjectURL(blob);
        this.pendingDownloadObjectUrl = url;
        this.triggerAnchorDownload(url, fileName);

        // Revoking immediately can cancel the download in some browsers.
        window.setTimeout(() => {
            this.revokePendingDownloadUrl();
        }, 4000);
    }

    /**
     * Creates a temporary anchor to initiate a browser download.
     *
     * @private
     * @param {string} href - Download href (blob URL or path)
     * @param {string} fileName - Download attribute file name
     * @returns {void}
     */
    private triggerAnchorDownload(href: string, fileName: string): void {
        const anchor: HTMLAnchorElement = document.createElement('a');
        anchor.href = href;
        anchor.download = fileName;
        anchor.rel = 'noopener';
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        if (anchor.parentElement) {
            anchor.parentElement.removeChild(anchor);
        }
    }

    /**
     * Revokes any outstanding download object URL.
     *
     * @private
     * @returns {void}
     */
    private revokePendingDownloadUrl(): void {
        if (this.pendingDownloadObjectUrl) {
            const urlApi: typeof URL = URL;
            if (typeof urlApi.revokeObjectURL === 'function') {
                urlApi.revokeObjectURL(this.pendingDownloadObjectUrl);
            }
            this.pendingDownloadObjectUrl = null;
        }
    }

    /*
 * Updates the state flags and their CSS/ARIA projections atomically.
 * @param {EditorState} state - state
 * @returns {void} result
 */
    private setLoadState(state: EditorState): void {
        this._state = state;
        this._internalState.state = state;
        this.setProperties(
            {
                isLoading: state === 'Loading',
                isReady: state === 'Ready'
            },
            true
        );
        this.applyStateClasses();
        this.applyAccessibilityAttributes();
    }

    /*
 * Refreshes title/ribbon metadata after a source becomes current.
 * @returns {void} result
 */
    private refreshSourceChrome(): void {
        if (this.toolbarModule) {
            this.toolbarModule.refreshInfo();
        }
        if (this.thumbnailModule) {
            this.thumbnailModule.refresh();
        }
        if (this.statusBarModule) {
            this.statusBarModule.refresh();
        }
    }

    /**
     * Builds Keyboard Shortcuts dialog body (documented tooltip shortcuts only).
     *
     * @private
     * @returns {HTMLElement} Dialog content root
     */
    private buildKeyboardShortcutsContent(): HTMLElement {
        const root: HTMLElement = createElement('div', {
            className: 'ej2-pptx-help-dialog ej2-pptx-help-dialog--shortcuts'
        });
        const intro: HTMLElement = createElement('p', {
            className: 'ej2-pptx-help-dialog__intro'
        });
        intro.textContent = 'Keyboard shortcuts available in the editor chrome (as shown on ribbon tooltips):';
        root.appendChild(intro);

        const table: HTMLTableElement = document.createElement('table');
        table.className = 'ej2-pptx-help-dialog__table';
        table.setAttribute('role', 'table');

        const thead: HTMLTableSectionElement = document.createElement('thead');
        const headRow: HTMLTableRowElement = document.createElement('tr');
        const thAction: HTMLTableCellElement = document.createElement('th');
        thAction.scope = 'col';
        thAction.textContent = 'Action';
        const thShortcut: HTMLTableCellElement = document.createElement('th');
        thShortcut.scope = 'col';
        thShortcut.textContent = 'Shortcut';
        headRow.appendChild(thAction);
        headRow.appendChild(thShortcut);
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody: HTMLTableSectionElement = document.createElement('tbody');
        const rows: Array<[string, string]> = [
            ['Next slide', 'Right Arrow / Down Arrow / Page Down'],
            ['Previous slide', 'Left Arrow / Up Arrow / Page Up'],
            ['First / last slide', 'Home / End'],
            ['Zoom in / out / reset', 'Ctrl or Command + / - / 0'],
            ['Start From Beginning', 'F5'],
            ['From Current Slide', 'Shift+F5'],
            ['Exit Slide Show', 'Esc'],
            ['Copy', 'Ctrl+C'],
            ['Undo', 'Ctrl+Z'],
            ['Redo', 'Ctrl+Y'],
            ['Find', 'Ctrl+F']
        ];
        for (const [action, shortcut] of rows) {
            const tr: HTMLTableRowElement = document.createElement('tr');
            const tdAction: HTMLTableCellElement = document.createElement('td');
            tdAction.textContent = action;
            const tdShortcut: HTMLTableCellElement = document.createElement('td');
            tdShortcut.textContent = shortcut;
            tr.appendChild(tdAction);
            tr.appendChild(tdShortcut);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        root.appendChild(table);
        return root;
    }

    /**
     * Builds About dialog body (product, version, license notice).
     *
     * @private
     * @returns {HTMLElement} Dialog content root
     */
    private buildAboutContent(): HTMLElement {
        const root: HTMLElement = createElement('div', {
            className: 'ej2-pptx-help-dialog ej2-pptx-help-dialog--about'
        });

        const title: HTMLElement = createElement('p', {
            className: 'ej2-pptx-help-dialog__product'
        });
        title.textContent = 'PowerPoint Editor';
        root.appendChild(title);

        const version: HTMLElement = createElement('p', {
            className: 'ej2-pptx-help-dialog__version'
        });
        version.textContent = 'Version ' + EDITOR_VERSION;
        root.appendChild(version);

        const license: HTMLElement = createElement('p', {
            className: 'ej2-pptx-help-dialog__license'
        });
        license.textContent =
      EDITOR_LICENSE_NOTICE + '. ' + 'Syncfusion commercial terms apply to this component.';
        root.appendChild(license);

        return root;
    }

    /**
     * Shows a modal Help dialog, replacing any previously open Help dialog.
     *
     * @private
     * @param {string} header - Dialog title
     * @param {HTMLElement} content - Dialog body element
     * @returns {void}
     */
    private showHelpDialog(header: string, content: HTMLElement): void {
        this.destroyHelpDialog();

        const target: HTMLElement =
      this.element ||
      (typeof document !== 'undefined' ? document.body : null) ||
      createElement('div');

        const hostEl: HTMLElement = createElement('div', {
            className: 'ej2-pptx-help-dialog-host'
        });
        target.appendChild(hostEl);

        const dialog: Dialog = new Dialog({
            header,
            content,
            isModal: true,
            showCloseIcon: true,
            closeOnEscape: true,
            width: '420px',
            enableRtl: !!this.enableRtl,
            cssClass: 'ej2-pptx-help-dialog-popup',
            target,
            buttons: [
                {
                    click: (): void => {
                        this.destroyHelpDialog();
                    },
                    buttonModel: {
                        content: 'Close',
                        isPrimary: true
                    }
                }
            ],
            close: (): void => {
                this.destroyHelpDialog();
            }
        });
        dialog.appendTo(hostEl);
        this.helpDialog = dialog;
        dialog.show();
    }

    /**
     * Destroys the active Help dialog and removes its host element.
     *
     * @private
     * @returns {void}
     */
    private destroyHelpDialog(): void {
        if (!this.helpDialog) {
            return;
        }
        const dialog: Dialog = this.helpDialog;
        this.helpDialog = null;
        const hostEl: HTMLElement | null = dialog.element;
        try {
            dialog.hide();
        } catch {
            // Dialog may already be closed.
        }
        try {
            dialog.destroy();
        } catch {
            // Ignore destroy errors during teardown.
        }
        if (hostEl && hostEl.parentElement) {
            hostEl.parentElement.removeChild(hostEl);
        }
    }

    /**
     * Resolves the text copied by {@link shareLink}.
     *
     * @private
     * @returns {string} Shareable absolute URL or current location
     */
    private resolveShareText(): string {
        const path: string | undefined = this.documentPath;
        if (typeof path === 'string') {
            const trimmed: string = path.trim();
            if (
                trimmed.length > 0 &&
        (trimmed.indexOf('http://') === 0 || trimmed.indexOf('https://') === 0)
            ) {
                return trimmed;
            }
        }
        return typeof location !== 'undefined' ? location.href : '';
    }

    /**
     * Announces a status message through the polite, visually hidden live region.
     *
     * @private
     * @param {string} message - Status text
     * @returns {void}
     */
    private announceStatus(message: string): void {
        const shell: Element | null = this.element ? this.element.querySelector('.ej2-pptx-shell') : null;
        if (!shell) {
            return;
        }
        if (!this.liveRegion || !shell.contains(this.liveRegion)) {
            const region: HTMLElement = document.createElement('div');
            region.className = 'ej2-pptx-live-region';
            region.setAttribute('role', 'status');
            region.setAttribute('aria-live', 'polite');
            shell.appendChild(region);
            this.liveRegion = region;
        }
        this.liveRegion.textContent = message;
        if (this.liveRegionTimer !== null) {
            clearTimeout(this.liveRegionTimer);
        }
        this.liveRegionTimer = setTimeout((): void => {
            if (this.liveRegion) {
                this.liveRegion.textContent = '';
            }
            this.liveRegionTimer = null;
        }, 2000);
    }

    /**
     * Syncs the fullscreen CSS class.
     *
     * @private
     * @returns {void}
     */
    private handleFullscreenChange(): void {
        const active: boolean = this.isFullscreen();
        if (this.element) {
            this.element.classList.toggle('ej2-pptx-editor--fullscreen', active);
        }
    }

    /*
     * Applies theme to root element
     *
     * @private
 * @returns {void} result
     */
    private applyTheme(): void {
        if (!this.element) {
            return;
        }

        const theme: string = this.theme || 'Material';
        this.element.setAttribute('data-theme', String(theme));

        // Theme mode classes match the EJ2 base theme convention (`e-dark-mode`,
        // `e-high-contrast`) so shell tokens re-resolve when the theme changes at runtime.
        const lower: string = String(theme).toLowerCase();
        const highContrast: boolean = lower.indexOf('highcontrast') >= 0;
        const dark: boolean = !highContrast && /-dark$/.test(lower);
        this.element.classList.toggle('e-high-contrast', highContrast);
        this.element.classList.toggle('e-dark-mode', dark);
    }

    /*
     * Applies state-based CSS classes
     *
     * @private
 * @returns {void} result
     */
    private applyStateClasses(): void {
        if (!this.element) {
            return;
        }

        // Update state classes
        this.element.classList.toggle(
            'ej2-pptx-loading',
            this._state === 'Loading' || this.isLoading === true
        );
        this.element.classList.toggle('ej2-pptx-error', this._state === 'Error');
        this.element.classList.toggle('ej2-pptx-ready', this._state === 'Ready');
    }

    /*
     * Applies accessibility attributes
     *
     * @private
 * @returns {void} result
     */
    private applyAccessibilityAttributes(): void {
        if (!this.element) {
            return;
        }

        // Set ARIA role
        this.element.setAttribute('role', this.role || 'application');

        // Set ARIA label
        const ariaLabel: string = this.ariaLabel || 'PowerPoint Presentation Editor';
        this.element.setAttribute('aria-label', ariaLabel);

        // Set aria-busy based on loading state (never emit the string "undefined")
        const isBusy: boolean =
      this._state === 'Loading' || this.isLoading === true;
        this.element.setAttribute('aria-busy', isBusy ? 'true' : 'false');

        // Set tabIndex (NaN-safe)
        const tabIndexValue: number =
      typeof this.tabIndex === 'number' && !Number.isNaN(this.tabIndex)
          ? this.tabIndex
          : 0;
        this.element.setAttribute('tabindex', String(tabIndexValue));
    }

    /*
     * Validates zoom level
     *
     * @private
     * @param {number} zoom - Zoom level to validate
     * @throws {Error} If zoom is out of range
 * @returns {void} result
     */
    private validateZoom(zoom: number): void {
        if (zoom < 10 || zoom > 400) {
            throw new Error(
                `[PptxEditor]: ${'InvalidPropertyValue'} - Zoom must be between 10 and 400`
            );
        }
    }

    /**
     * Validates slide index
     *
     * @private
     * @param {number} index - Slide index to validate
     * @returns {boolean} True if valid
     */
    private isValidSlideIndex(index: number): boolean {
        if (index < 0) {
            throw new Error(
                `[PptxEditor]: ${'InvalidPropertyValue'} - Slide index must be >= 0`
            );
        }
        return true;
    }

    /*
     * Validates theme value
     *
     * @private
     * @param {unknown} theme - Theme to validate
 * @returns {void} result
     */
    private validateTheme(theme: unknown): void {
    // Allow any theme string for flexibility with future themes
        if (typeof theme !== 'string') {
            throw new Error(
                `[PptxEditor]: ${'InvalidPropertyValue'} - Theme must be a string`
            );
        }
    }

    /**
     * Gets current editor state
     *
     * @returns {EditorState} Current state
     *
     * @private
     */
    public getState(): EditorState {
        return this._state;
    }

    /**
     * Checks if component is ready
     *
     * @returns {boolean} True if ready
     *
     * @private
     */
    public isComponentReady(): boolean {
        return this._state === 'Ready' && this._internalState.initialized;
    }

    // ============== EJ2 Required Abstract Methods ==============

    /*
     * Pre-render method (EJ2 required)
     *
     * Called before render. Used for pre-processing.
     *
     * @protected
 * @returns {void} result
     */
    protected preRender(): void {
    // Pre-render processing (if needed in future)
    }

    /**
     * Get module name (EJ2 required)
     *
     * Returns the module name for the component.
     *
     * @public
     * @returns {string} Module name
     */
    public getModuleName(): string {
        return 'pptxeditor';
    }

    /**
     * Get persist data (EJ2 required)
     *
     * Returns data to be persisted across sessions.
     *
     * @returns {string} Persist data as JSON string
     *
     * @private
     */
    public getPersistData(): string {
        return JSON.stringify({
            slideIndex: this.slideIndex,
            zoom: this.zoom,
            theme: this.theme
        });
    }
}

function applySlideSemanticContext(root: HTMLElement, index: number, count: number, announce: boolean, locale?: string): void {
    const region: HTMLElement | null = root.querySelector('.ej2-pptx-main-slide');
    const content: HTMLElement | null = root.querySelector('.ej2-pptx-main-slide__content');
    if (!region || !content) { return; }
    const title: HTMLElement | null = content.querySelector('h1.ej2-pptx-text-paragraph');
    const titleText: string = title ? (title.textContent || '').trim() : '';
    const label: string = localize(locale, 'SlideCounter', index + 1, count) + (titleText ? `: ${titleText}` : '');
    region.setAttribute('aria-label', label);
    const boxes: HTMLElement[] = Array.from(content.querySelectorAll('.ej2-pptx-text-box'));
    boxes.forEach((box: HTMLElement, boxIndex: number): void => {
        if (!box.id) { box.id = `ej2-pptx-reading-${index}-${boxIndex}`; }
    });
    const ordered: HTMLElement[] = boxes.slice().sort((left: HTMLElement, right: HTMLElement): number => {
        const leftTitle: boolean = /^Title\b/iu.test(left.dataset.shapeName || '');
        const rightTitle: boolean = /^Title\b/iu.test(right.dataset.shapeName || '');
        return leftTitle === rightTitle ? 0 : leftTitle ? -1 : 1;
    });
    if (ordered.length > 0) { region.setAttribute('aria-owns', ordered.map((box: HTMLElement): string => box.id).join(' ')); }
    const live: HTMLElement | null = region.querySelector('.ej2-pptx-semantic-live-region');
    if (announce && live) { live.textContent = label; }
}

/**
 * Reads an external image without buffering beyond the host-configured limit.
 * @param {Response} response - response
 * @param {number} maximumBytes - maximumBytes
 * @returns {Promise} result
 */
async function readBoundedResponse(response: Response, maximumBytes: number): Promise<ArrayBuffer | undefined> {
    if (!response.body) {
        const data: ArrayBuffer = await response.arrayBuffer();
        return data.byteLength <= maximumBytes ? data : undefined;
    }
    const reader: ReadableStreamDefaultReader<Uint8Array> = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let length: number = 0;
    try {
        for (;;) {
            const result: ReadableStreamReadResult<Uint8Array> = await reader.read();
            if (result.done) {
                break;
            }
            length += result.value.byteLength;
            if (length > maximumBytes) {
                await reader.cancel();
                return undefined;
            }
            chunks.push(result.value);
        }
    } finally {
        reader.releaseLock();
    }
    const combined: Uint8Array = new Uint8Array(length);
    let offset: number = 0;
    chunks.forEach((chunk: Uint8Array): void => {
        combined.set(chunk, offset);
        offset += chunk.byteLength;
    });
    return combined.buffer;
}
