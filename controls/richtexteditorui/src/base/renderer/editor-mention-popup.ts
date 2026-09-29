import { EventHandler, detach, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { Mention, MentionModel, MentionChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { SelectEventArgs, PopupEventArgs, FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { RichTextEditorUI } from '../../richtexteditor-ui';

/**
 * Data shape expected by the suggestion list. The default `MentionModel.fields`
 * mapping (`text` / `value`) is applied automatically, but each item is kept as
 * a free-form record so a caller can supply e.g. `{ Name, Email, avatar }` and
 * point `fields.text` at `'Name'` via the `model`.
 */
export type MentionDataItem = { [key: string]: string | number | boolean | null };

/**
 * Options used to configure an `EditorMentionPopup`. This is the `model`
 * argument on the `EditorMentionPopup` constructor.
 *
 * It is a strict subset of `MentionModel` — the sub component owns the
 * `target` (always the editor's editable element) and the lifecycle, so
 * callers configure only the mention-specific bits: the trigger character,
 * the data source, templates, popup sizing and event callbacks.
 */
export interface EditorMentionPopupModel {
    /** Single character that triggers the suggestion list (e.g. `'@'`, `'#'`). */
    mentionChar: string;
    /** Items shown in the suggestion list. */
    dataSource: MentionDataItem[] | string[];
    /** Field mapping for the data source. Defaults to `{ text: 'text', value: 'value' }`. */
    fields?: { text?: string; value?: string; iconCss?: string; groupBy?: string };
    /** Whether a space is required before the mention character to trigger. */
    requireLeadingSpace?: boolean;
    /** Whether spaces are allowed in the middle of a mention while searching. */
    allowSpaces?: boolean;
    /** Whether to show the configured `mentionChar` with the inserted text. */
    showMentionChar?: boolean;
    /** Custom suffix appended after the inserted mention (e.g. `' '`). */
    suffixText?: string;
    /** Template for each item in the suggestion list. */
    itemTemplate?: string;
    /** Template for the inserted mention text. */
    displayTemplate?: string;
    /** Template shown when no item matches. */
    noRecordsTemplate?: string;
    /** Width of the suggestion popup. */
    popupWidth?: string | number;
    /** Height of the suggestion popup. */
    popupHeight?: string | number;
    /** Minimum typed characters before search starts. */
    minLength?: number;
    /** Number of items shown in the list. */
    suggestionCount?: number;
    /** Whether the search is case sensitive. */
    ignoreCase?: boolean;
    /** Filter type used to match items against the typed text. */
    filterType?: 'Contains' | 'StartsWith' | 'EndsWith';
    /** Whether to highlight the matched characters in the list. */
    highlight?: boolean;
    /** Additional CSS class to apply to the mention popup. */
    cssClass?: string;
    /** Raised when the mention component is created. */
    created?: () => void;
    /** Raised when the user selects an item. */
    select?: (args: SelectEventArgs) => void;
    /** Raised when the selected value is inserted into the editor. */
    change?: (args: MentionChangeEventArgs) => void;
    /** Raised before the suggestion popup opens. */
    beforePopupOpen?: (args: PopupEventArgs) => void;
    /** Raised after the suggestion popup opens. */
    opened?: (args: PopupEventArgs) => void;
    /** Raised while the user types (filtering). */
    filtering?: (args: FilteringEventArgs) => void;
}

/**
 * EditorMentionPopup — a mention sub component owned by the editor.
 *
 * Follows the sub-component convention documented in `docs/convention/sub-components.md`:
 *  - Named `Editor<Thing>`, no `Renderer` suffix.
 *  - Constructor takes `(editor, id, target, model)`.
 *  - Public surface is `show()`, `hide()`, `destroy()`.
 *  - Calls `saveRange` before opening and `restoreRange` after closing the
 *    suggestion popup, using the shared `editor-selection-utils`
 *    (no base-class inheritance).
 *
 * Wraps the Syncfusion `Mention` component so an editor can expose
 * suggestion-list triggers for one `mentionChar` (e.g. `@`).
 * To support multiple trigger characters (e.g. `@`, `#`, `$`, `%`) create
 * one `EditorMentionPopup` per character, all sharing the same `target`
 * editor — see the demo in `demos/default.ts`.
 */
export class EditorMentionPopup {
    /** The editor instance the mention belongs to. */
    protected parent: RichTextEditorUI;
    /** Element the mention host is appended to. */
    protected target: HTMLElement;
    /** Caller-supplied mention options. */
    protected model: EditorMentionPopupModel;
    /** Unique id of the rendered mention host element. */
    public id: string;
    /** The underlying `Mention` instance. */
    public mention: Mention;
    /** Destroyed guard. */
    private isDestroyed: boolean = false;
    /** Bound beforePopupOpen handler so it can be removed on destroy. */
    private beforeOpenHandler: (args: PopupEventArgs) => void;
    /** Bound select handler so it can be removed on destroy. */
    private selectHandler: (args: SelectEventArgs) => void;
    private saveSelection: any;

    constructor(editor: RichTextEditorUI, id: string, target: HTMLElement, model: EditorMentionPopupModel) {
        this.parent = editor;
        this.target = target;
        this.id = id;
        this.model = model;
        this.render();
    }

    /**
     * Builds the mention host element and the underlying `Mention` instance,
     * wiring `beforeOpen` to save the editor selection before the suggestion
     * popup opens and `select` to restore it after an item is selected.
     *
     * The host element is appended to the supplied `target` (typically the
     * editor's editable surface); the `Mention`'s own `target` is the live
     * editable element of the editor so keystrokes are picked up.
     *
     * @returns {void}
     */
    private render(): void {
        const mentionHost: HTMLElement = this.parent.createElement('div', {
            id: this.id,
            className: 'e-editor-mention-root'
        });
        this.target.appendChild(mentionHost);
        this.beforeOpenHandler = (args: PopupEventArgs): void => {
            if (this.parent && this.parent.baseEditorCore) {
                this.saveSelection = this.parent.baseEditorCore.saveSelection();
            }
            if (typeof this.model.beforePopupOpen === 'function') {
                this.model.beforePopupOpen(args);
            }
        };
        this.selectHandler = (args: SelectEventArgs): void => {
            if (this.parent && this.parent.baseEditorCore) {
                this.parent.baseEditorCore.restoreSelection(this.saveSelection);
            }
            if (typeof this.model.select === 'function') {
                this.model.select(args);
            }
        };
        const mentionModel: MentionModel = {
            target: this.parent.inputElement,
            mentionChar: this.model.mentionChar,
            dataSource: this.model.dataSource as { [key: string]: Object; }[],
            fields: (this.model.fields || { text: 'text', value: 'value' }) as MentionModel['fields'],
            requireLeadingSpace: this.model.requireLeadingSpace,
            allowSpaces: this.model.allowSpaces,
            showMentionChar: this.model.showMentionChar,
            suffixText: this.model.suffixText,
            itemTemplate: this.model.itemTemplate,
            displayTemplate: this.model.displayTemplate,
            noRecordsTemplate: this.model.noRecordsTemplate,
            popupWidth: this.model.popupWidth,
            popupHeight: this.model.popupHeight,
            minLength: this.model.minLength,
            suggestionCount: this.model.suggestionCount,
            ignoreCase: this.model.ignoreCase,
            filterType: this.model.filterType,
            highlight: this.model.highlight,
            cssClass: this.model.cssClass,
            enableRtl: this.parent.enableRtl,
            created: this.model.created,
            select: this.selectHandler,
            change: this.model.change,
            beforeOpen: this.beforeOpenHandler,
            opened: this.model.opened,
            filtering: this.model.filtering
        } as MentionModel;
        this.mention = new Mention(mentionModel, mentionHost);
    }

    /**
     * Shows the suggestion popup. For a mention, the popup is normally
     * triggered by typing the `mentionChar` in the editor, so `show()` is a
     * programmatic hook (used mostly for testing / accessibility) that focuses
     * the mention target without forcing a popup open. The selection is saved
     * at this point so a later close restores it correctly.
     *
     * @returns {void}
     */
    public show(): void {
        if (this.parent && this.parent.baseEditorCore) {
            this.saveSelection = this.parent.baseEditorCore.saveSelection();
        }
    }

    /**
     * Hides the suggestion popup if it is currently open and restores the
     * editor selection.
     *
     * @returns {void}
     */
    public hide(): void {
        if (!isNOU(this.mention)) {
            this.mention.hidePopup();
        }
    }

    /**
     * Updates the data source of an already-rendered mention popup in-place.
     * Forwards to the underlying `Mention.dataSource` settable property so the
     * suggestion list refreshes without re-mounting the host element. No-op
     * when the popup has been destroyed or never rendered.
     *
     * @param {MentionDataItem[] | string[]} dataSource - the new data source.
     * @returns {void}
     */
    public setDataSource(dataSource: MentionDataItem[] | string[]): void {
        if (this.isDestroyed || isNOU(this.mention)) {
            return;
        }
        this.model.dataSource = dataSource;
        this.mention.dataSource = dataSource as { [key: string]: Object; }[];
    }

    /**
     * Updates the popup width of an already-rendered mention popup in-place.
     * Forwards to the underlying `Mention.popupWidth` settable property. No-op
     * when the popup has been destroyed or never rendered.
     *
     * @param {string | number} popupWidth - the new popup width.
     * @returns {void}
     */
    public setPopupWidth(popupWidth: string | number): void {
        if (this.isDestroyed || isNOU(this.mention)) {
            return;
        }
        this.model.popupWidth = popupWidth;
        this.mention.popupWidth = popupWidth;
    }

    /**
     * Updates the popup height of an already-rendered mention popup in-place.
     * Forwards to the underlying `Mention.popupHeight` settable property. No-op
     * when the popup has been destroyed or never rendered.
     *
     * @param {string | number} popupHeight - the new popup height.
     * @returns {void}
     */
    public setPopupHeight(popupHeight: string | number): void {
        if (this.isDestroyed || isNOU(this.mention)) {
            return;
        }
        this.model.popupHeight = popupHeight;
        this.mention.popupHeight = popupHeight;
    }

    /**
     * Destroys the mention component, removes the host element and frees
     * references. Idempotent.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        if (this.mention && !this.isDestroyed) {
            this.mention.destroy();
        }
        if (!isNOU(this.beforeOpenHandler)) {
            EventHandler.remove(this.target, 'beforeOpen', this.beforeOpenHandler);
            this.beforeOpenHandler = null;
        }
        if (!isNOU(this.selectHandler)) {
            EventHandler.remove(this.target, 'select', this.selectHandler);
            this.selectHandler = null;
        }
        const host: HTMLElement = this.parent.element.querySelector('#' + this.id) as HTMLElement;
        if (host && host.parentNode) {
            detach(host);
        }
        this.mention = null;
        this.parent = null;
        this.target = null;
        this.model = null;
        this.isDestroyed = true;
    }
}
