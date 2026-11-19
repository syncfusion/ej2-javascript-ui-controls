/**
 * Public property facades over SettingsPart: {@link ViewSetup} and
 * {@link DocumentSettings}. Stable per-{@link WordDocument} identity via WeakMap.
 *
 * Linked from `settings/index.ts` after {@link settingsFor} is defined (avoids cycle).
 *
 * @private
 */
import { InvalidArgumentError } from '../../core/errors/docx-error';
import { WordDocument } from '../document/document';
import { AttachedTemplate } from './attached-template';
import { CompatibilityMode } from './compat-settings';
import { DocumentViewType } from './settings-children';
import { ZoomSettings, ZoomType, ZoomTypeWire } from './zoom';

/** Minimal SettingsPart surface used by public facades. */
export interface SettingsPartFacadeHost {
    trackRevisions(): boolean | undefined;
    setTrackRevisions(value: boolean | undefined): void;
    defaultTabStop(): number | undefined;
    setDefaultTabStop(value: number | undefined): void;
    view(): { asDocumentViewType(): DocumentViewType | undefined } | undefined;
    setView(value: DocumentViewType | string | undefined): void;
    zoom(): ZoomSettings | undefined;
    setZoom(value: ZoomSettings | undefined): void;
    compatibilityMode(): string | undefined;
    setCompatibilityMode(value: CompatibilityMode | string): void;
    displayBackgroundShape(): boolean | undefined;
    setDisplayBackgroundShape(value: boolean | undefined): void;
    attachedTemplate(): AttachedTemplate | undefined;
}

/** Default `w:view` when the element is absent (Word print layout). */
const DEFAULT_DOCUMENT_VIEW: DocumentViewType.PrintLayout = DocumentViewType.PrintLayout;
/** Default zoom percent when `w:zoom` is absent (matches createDefault). */
const DEFAULT_ZOOM_PERCENT: number = 100;
/** Default tab stop in points when `w:defaultTabStop` is absent (0.5 in). */
const DEFAULT_TAB_STOP_POINTS: number = 36;

function requireFiniteNonNegative(name: string, value: number): void {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        throw new InvalidArgumentError(`${name} must be a finite non-negative number`);
    }
}

function zoomTypeFromWire(wire: ZoomTypeWire | undefined): ZoomType {
    if (wire === undefined) {
        return ZoomType.None;
    }
    switch (wire) {
    case 'none':
        return ZoomType.None;
    case 'fullPage':
        return ZoomType.FullPage;
    case 'bestFit':
        return ZoomType.BestFit;
    case 'textFit':
        return ZoomType.TextFit;
    default:
        return ZoomType.None;
    }
}

function compatibilityModeFromWire(wire: string | undefined): CompatibilityMode {
    if (wire === CompatibilityMode.Word2007) {
        return CompatibilityMode.Word2007;
    }
    if (wire === CompatibilityMode.Word2010) {
        return CompatibilityMode.Word2010;
    }
    if (wire === CompatibilityMode.Word2013) {
        return CompatibilityMode.Word2013;
    }
    // Absent or unknown → Word 2013 (createDefault / modern Word default).
    return CompatibilityMode.Word2013;
}

let settingsForRef: ((document: WordDocument) => SettingsPartFacadeHost) | undefined;
let registerSettingsFeatureRef: (() => void) | undefined;
let attachedTemplateTargetRef: ((document: WordDocument) => string | undefined) | undefined;

/**
 * Bind SettingsPart accessors from the settings feature entry (call once after
 * `settingsFor` is defined).
 *
 * @param {Function} deps - The deps.
 * @returns {void} Nothing is returned.
 * @private
 */
export function bindDocumentSettingsFacades(deps: {
    settingsFor: (document: WordDocument) => SettingsPartFacadeHost;
    registerSettingsFeature: () => void;
    attachedTemplateTarget: (document: WordDocument) => string | undefined;
}): void {
    settingsForRef = deps.settingsFor;
    registerSettingsFeatureRef = deps.registerSettingsFeature;
    attachedTemplateTargetRef = deps.attachedTemplateTarget;
}

function settingsFor(document: WordDocument): SettingsPartFacadeHost {
    if (settingsForRef === undefined) {
        throw new InvalidArgumentError('Document settings facades are not bound; load @syncfusion/ej2-docx settings feature first');
    }
    return settingsForRef(document);
}

/**
 * Document view and zoom configuration (`w:view`, `w:zoom`).
 *
 * @public
 */
export class ViewSetup {
    private readonly document: WordDocument;

    /**
     * @param {WordDocument} document - The document.
     * @private
     */
    constructor(document: WordDocument) {
        this.document = document;
    }

    /**
     * Gets or sets the view used when the document is opened in Microsoft Word.
     *
     * @public
     */
    get documentViewType(): DocumentViewType {
        const view: { asDocumentViewType(): DocumentViewType; } = settingsFor(this.document).view();
        if (view === undefined) {
            return DEFAULT_DOCUMENT_VIEW;
        }
        const known: DocumentViewType = view.asDocumentViewType();
        return known === undefined ? DEFAULT_DOCUMENT_VIEW : known;
    }

    set documentViewType(value: DocumentViewType) {
        settingsFor(this.document).setView(value);
    }

    /**
     * Gets or sets how the document view is fitted in the application window.
     *
     * @public
     */
    get zoomType(): ZoomType {
        const zoom: ZoomSettings = settingsFor(this.document).zoom();
        return zoomTypeFromWire(zoom === undefined ? undefined : zoom.type());
    }

    set zoomType(value: ZoomType) {
        const part: SettingsPartFacadeHost = settingsFor(this.document);
        const existing: ZoomSettings = part.zoom();
        if (existing === undefined) {
            part.setZoom(ZoomSettings.create(DEFAULT_ZOOM_PERCENT, value));
            return;
        }
        existing.setType(value);
        part.setZoom(existing);
    }

    /**
     * Gets or sets the document zoom percentage.
     *
     * @public
     */
    get zoomPercent(): number {
        const zoom: ZoomSettings = settingsFor(this.document).zoom();
        if (zoom === undefined) {
            return DEFAULT_ZOOM_PERCENT;
        }
        const percent: number = zoom.percent();
        return percent === undefined ? DEFAULT_ZOOM_PERCENT : percent;
    }

    set zoomPercent(value: number) {
        requireFiniteNonNegative('zoomPercent', value);
        const part: SettingsPartFacadeHost = settingsFor(this.document);
        const existing: ZoomSettings = part.zoom();
        if (existing === undefined) {
            part.setZoom(ZoomSettings.create(value, ZoomType.None));
            return;
        }
        existing.setPercent(value);
        part.setZoom(existing);
    }
}

/**
 * Focused document compatibility and display settings.
 *
 * @public
 */
export class DocumentSettings {
    private readonly document: WordDocument;

    /**
     * @param {WordDocument} document - The document.
     * @private
     */
    constructor(document: WordDocument) {
        this.document = document;
    }

    /**
     * Gets or sets the Word compatibility mode for this document.
     *
     * @public
     */
    get compatibilityMode(): CompatibilityMode {
        return compatibilityModeFromWire(settingsFor(this.document).compatibilityMode());
    }

    set compatibilityMode(value: CompatibilityMode) {
        settingsFor(this.document).setCompatibilityMode(value);
    }

    /**
     * Gets or sets whether document background shapes are displayed
     * (`w:displayBackgroundShape`).
     *
     * @public
     */
    get displayBackgrounds(): boolean {
        const value: boolean = settingsFor(this.document).displayBackgroundShape();
        return value === true;
    }

    set displayBackgrounds(value: boolean) {
        // Omission represents the default (false); remove the element when false.
        settingsFor(this.document).setDisplayBackgroundShape(value ? true : undefined);
    }
}

const viewSetups: WeakMap<WordDocument, ViewSetup> = new WeakMap<WordDocument, ViewSetup>();
const documentSettingsMap: WeakMap<WordDocument, DocumentSettings> = new WeakMap<WordDocument, DocumentSettings>();

/**
 * Stable {@link ViewSetup} for `document`.
 *
 * @param {WordDocument} document - The document.
 * @returns {ViewSetup} The result.
 * @private
 */
export function viewSetupFor(document: WordDocument): ViewSetup {
    if (registerSettingsFeatureRef !== undefined) {
        registerSettingsFeatureRef();
    }
    const cached: ViewSetup = viewSetups.get(document);
    if (cached !== undefined) {
        return cached;
    }
    const setup: ViewSetup = new ViewSetup(document);
    viewSetups.set(document, setup);
    return setup;
}

/**
 * Stable {@link DocumentSettings} for `document`.
 *
 * @param {WordDocument} document - The document.
 * @returns {DocumentSettings} The result.
 * @private
 */
export function documentSettingsFor(document: WordDocument): DocumentSettings {
    if (registerSettingsFeatureRef !== undefined) {
        registerSettingsFeatureRef();
    }
    const cached: DocumentSettings = documentSettingsMap.get(document);
    if (cached !== undefined) {
        return cached;
    }
    const settings: DocumentSettings = new DocumentSettings(document);
    documentSettingsMap.set(document, settings);
    return settings;
}

let facadesRegistered: boolean = false;

/**
 * Install WordDocument property facades for settings-backed members.
 * Idempotent; call from the settings feature entry after binding accessors.
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerDocumentSettingsFacades(): void {
    if (facadesRegistered) {
        return;
    }
    facadesRegistered = true;
    if (registerSettingsFeatureRef !== undefined) {
        registerSettingsFeatureRef();
    }

    Object.defineProperty(WordDocument.prototype, 'viewSetup', {
        configurable: true,
        enumerable: false,
        get(this: WordDocument): ViewSetup {
            return viewSetupFor(this);
        }
    });

    Object.defineProperty(WordDocument.prototype, 'settings', {
        configurable: true,
        enumerable: false,
        get(this: WordDocument): DocumentSettings {
            return documentSettingsFor(this);
        }
    });

    Object.defineProperty(WordDocument.prototype, 'trackRevisions', {
        configurable: true,
        enumerable: false,
        get(this: WordDocument): boolean {
            return settingsFor(this).trackRevisions() === true;
        },
        set(this: WordDocument, value: boolean): void {
            // Omission represents default off.
            settingsFor(this).setTrackRevisions(value ? true : undefined);
        }
    });

    Object.defineProperty(WordDocument.prototype, 'defaultTabStop', {
        configurable: true,
        enumerable: false,
        get(this: WordDocument): number {
            const value: number = settingsFor(this).defaultTabStop();
            return value === undefined ? DEFAULT_TAB_STOP_POINTS : value;
        },
        set(this: WordDocument, value: number): void {
            requireFiniteNonNegative('defaultTabStop', value);
            settingsFor(this).setDefaultTabStop(value);
        }
    });

    Object.defineProperty(WordDocument.prototype, 'attachedTemplate', {
        configurable: true,
        enumerable: false,
        get(this: WordDocument): AttachedTemplate | undefined {
            const template: AttachedTemplate = settingsFor(this).attachedTemplate();
            if (template === undefined) {
                return undefined;
            }
            // Resolve relationship target when available (read-only surface).
            if (attachedTemplateTargetRef !== undefined) {
                void attachedTemplateTargetRef(this);
            }
            return template;
        }
    });
}
