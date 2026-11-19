import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../document-editor';
import { WCharacterFormat } from '../format/character-format';
import { WParagraphFormat } from '../format/paragraph-format';
import { WStyle } from '../format/style';
import { WBorders } from '../format/borders';
import { Selection } from './selection';
import { TextPosition } from './selection-helper';
import { ElementBox, ParagraphWidget, ImageElementBox } from '../viewer/page';
import { internalFormatPainterStateChange } from '../../base/constants';
import { TextAlignment } from '../../base/types';

/**
 * Manages Format Painter state: capture, apply, and cancel of character and paragraph formatting.
 *
 * @private
 */
export class FormatPainter {
    private owner: DocumentEditor;
    private characterFormat: WCharacterFormat = undefined;
    private paragraphFormat: WParagraphFormat = undefined;
    // Paragraph style (Heading 1, Heading 2, …). cloneFormat copies the style
    // reference, but paragraph copyFormat does not apply it. Stored separately
    // so apply can call the style path.
    private paragraphStyle: WStyle = undefined;
    // A partial text selection carries no paragraph formatting: Word transfers
    // paragraph format only when the source covers the paragraph mark (a full
    // paragraph selection or a collapsed caret). Recorded at capture time and
    // consulted by shouldApplyParagraphFormat at apply time.
    private paragraphFormatFromPartialSource: boolean = false;
    private isPersistentInternal: boolean = false;
    private isActiveInternal: boolean = false;
    private applyOnNextSelection: boolean = false;
    // Ctrl+A changes the selection. That change must not paint.
    private skipNextSelectionApply: boolean = false;
    // True only while the ribbon or toolbar button armed the painter.
    // Programmatic copyFormat must not refresh that chrome.
    private toolbarOwned: boolean = false;
    private cancelListenersAttached: boolean = false;
    /**
     * @param {Event} event - Pointer event
     * @returns {void}
     */
    private readonly onDocumentPointerDown = (event: Event): void => {
        this.cancelIfOutside((event as MouseEvent).target as Node);
    };
    /**
     * @param {KeyboardEvent} event - Keydown event
     * @returns {void}
     */
    private readonly onWindowKeyDown = (event: KeyboardEvent): void => {
        if (!this.isActiveInternal) {
            return;
        }
        const key: string = event.key || '';
        const code: string = event.code || '';
        if (key === 'Escape' || key === 'Esc' || code === 'Escape') {
            event.preventDefault();
            this.cancel();
            return;
        }
        // Ctrl+A selects the document. It is not an apply gesture.
        if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey
            && (key === 'a' || key === 'A' || code === 'KeyA')) {
            this.skipNextSelectionApply = true;
        }
    };
    /**
     * @param {KeyboardEvent} event - Keyup event
     * @returns {void}
     */
    private readonly onWindowKeyUp = (event: KeyboardEvent): void => {
        const key: string = event.key || '';
        const code: string = event.code || '';
        if (key === 'a' || key === 'A' || code === 'KeyA' || key === 'Control' || key === 'Meta') {
            this.skipNextSelectionApply = false;
        }
    };
    /**
     * @param {FocusEvent} event - Focus event
     * @returns {void}
     */
    private readonly onWindowFocusIn = (event: FocusEvent): void => {
        this.cancelIfOutside(event.target as Node);
    };

    /**
     * @param {DocumentEditor} owner - Document editor instance
     * @private
     */
    public constructor(owner: DocumentEditor) {
        this.owner = owner;
    }

    /**
     * @returns {boolean} - Whether Format Painter is active
     * @private
     */
    public get isActive(): boolean {
        return this.isActiveInternal;
    }

    /**
     * @returns {boolean} - Whether Format Painter is in persistent multi-apply mode
     * @private
     */
    public get isPersistent(): boolean {
        return this.isPersistentInternal;
    }

    /**
     * @returns {boolean} - Whether a format snapshot is stored
     * @private
     */
    public get hasCopiedFormat(): boolean {
        return !isNullOrUndefined(this.characterFormat) && !isNullOrUndefined(this.paragraphFormat);
    }

    /**
     * Captures character and paragraph formatting from the logical start of the current selection.
     *
     * @param {boolean} isPersistent - When true, remains active for multiple applies
     * @returns {void}
     * @private
     */
    public copyFormat(isPersistent?: boolean): void {
        if (isNullOrUndefined(this.owner) || isNullOrUndefined(this.owner.selection) ||
            this.owner.isReadOnlyMode || !this.owner.isDocumentLoaded) {
            return;
        }
        const selection: Selection = this.owner.selection;
        if (selection.checkContentControlLocked(true)) {
            return;
        }
        this.clearCopiedFormat();
        const start: TextPosition = selection.isForward ? selection.start : selection.end;
        this.captureCharacterFormat(selection, start);
        this.captureParagraphFormat(start);
        this.paragraphFormatFromPartialSource = !selection.isEmpty && !this.selectionIncludesParagraphMark(selection);
        this.isPersistentInternal = isPersistent === true;
        this.isActiveInternal = true;
        // Programmatic copy stores the format and activates the painter only.
        // A later programmatic select() must not paint. Mouse click and drag
        // apply through onPointerSelectionEnd. The ribbon is not notified.
        this.applyOnNextSelection = false;
        this.toolbarOwned = false;
        this.attachCancelListeners();
        this.updateCursor(true);
    }

    /**
     * Arms the toolbar Format Painter so the next selection applies the copied
     * format. Used only by the ribbon and toolbar buttons; the public API
     * workflow stays explicit and waits for applyCopiedFormat.
     *
     * @param {boolean} isPersistent - When true, remains active for multiple applies
     * @returns {void}
     * @private
     */
    public armForSelectionApply(isPersistent?: boolean): void {
        this.copyFormat(isPersistent);
        if (this.isActiveInternal) {
            this.applyOnNextSelection = true;
            this.toolbarOwned = true;
            this.notifyUiState();
        }
    }

    /**
     * Stores the formatting of the current selection as the last copied format
     * without arming the Format Painter. Used by the keyboard shortcut
     * workflow (Ctrl+Alt+C), which is independent of the toolbar painter state:
     * the format is kept for a later Ctrl+Alt+V apply, but the painter button,
     * cursor, and apply-on-selection behavior stay untouched.
     *
     * @returns {void}
     * @private
     */
    public copyFormatSilently(): void {
        if (isNullOrUndefined(this.owner) || isNullOrUndefined(this.owner.selection) ||
            this.owner.isReadOnlyMode || !this.owner.isDocumentLoaded) {
            return;
        }
        const selection: Selection = this.owner.selection;
        if (selection.checkContentControlLocked(true)) {
            return;
        }
        // An active painter keeps its own snapshot; a silent copy replaces the
        // stored format without disturbing an armed painter's pending apply.
        this.clearCopiedFormat();
        const start: TextPosition = selection.isForward ? selection.start : selection.end;
        this.captureCharacterFormat(selection, start);
        this.captureParagraphFormat(start);
        this.paragraphFormatFromPartialSource = !selection.isEmpty && !this.selectionIncludesParagraphMark(selection);
    }

    /**
     * Applies the most recently copied formatting to the current selection
     * without requiring an armed Format Painter. Used by the keyboard shortcut
     * workflow (Ctrl+Alt+V) and the apply API: the stored format is applied
     * directly, and the toolbar painter state is left as it was.
     *
     * @returns {boolean} - True when formatting was applied
     * @private
     */
    public applyStoredFormat(): boolean {
        if (isNullOrUndefined(this.owner) || isNullOrUndefined(this.owner.editor) ||
            this.owner.isReadOnlyMode || !this.owner.isDocumentLoaded || !this.hasCopiedFormat) {
            return false;
        }
        const selection: Selection = this.owner.selection;
        if (isNullOrUndefined(selection) || selection.checkContentControlLocked(true)) {
            return false;
        }
        if (!this.isValidTarget(selection)) {
            return false;
        }
        // The shortcut path must not touch painter state.
        return this.owner.editor.applyFormatPainterFormat(
            this.characterFormat, this.paragraphFormat, this.shouldApplyParagraphFormat(selection), this.paragraphStyle);
    }

    /**
     * Applies the copied formatting to the current selection. This is the
     * public API workflow: it works only while Format Painter is active
     * (copyFormat armed it) and a copied format exists. A non-persistent
     * painter consumes itself on the first apply, so later calls apply
     * nothing until copyFormat is invoked again; a persistent painter keeps
     * applying until cancelled. The keyboard shortcut workflow
     * (applyStoredFormat) is separate and does not consult this state.
     *
     * @returns {boolean} - True when formatting was applied
     * @private
     */
    public applyCopiedFormat(): boolean {
        if (!this.isActiveInternal || !this.hasCopiedFormat || isNullOrUndefined(this.owner) ||
            isNullOrUndefined(this.owner.editor) || this.owner.isReadOnlyMode || !this.owner.isDocumentLoaded) {
            return false;
        }
        const selection: Selection = this.owner.selection;
        if (isNullOrUndefined(selection) || selection.checkContentControlLocked(true)) {
            return false;
        }
        if (!this.isValidTarget(selection)) {
            return false;
        }
        const applied: boolean = this.owner.editor.applyFormatPainterFormat(
            this.characterFormat, this.paragraphFormat, this.shouldApplyParagraphFormat(selection), this.paragraphStyle);
        if (applied) {
            // Word clears the temporary selection highlight once the paint is
            // applied and leaves the caret in the painted text; the highlight
            // must not outlive the apply in any selection or mode.
            if (!selection.isEmpty) {
                const caret: TextPosition = selection.isForward ? selection.start : selection.end;
                selection.selectPosition(caret, caret);
            }
            if (!this.isPersistentInternal) {
                // Non-persistent painter consumed: deactivate and discard the
                // copied format so later API calls apply nothing.
                this.cancel();
            } else if (this.toolbarOwned) {
                // Toolbar persistent mode stays highlighted. A programmatic
                // painter does not own the ribbon, so it does not refresh it.
                this.notifyUiState();
            }
        }
        return applied;
    }

    /**
     * Cancels Format Painter and clears the stored format.
     *
     * @param {boolean} clearFormat - When false, keeps stored format (unused; always clears)
     * @returns {void}
     * @private
     */
    public cancel(clearFormat: boolean = true): void {
        const wasActive: boolean = this.isActiveInternal;
        const notifyToolbar: boolean = this.toolbarOwned;
        this.isActiveInternal = false;
        this.isPersistentInternal = false;
        this.applyOnNextSelection = false;
        this.skipNextSelectionApply = false;
        this.toolbarOwned = false;
        this.detachCancelListeners();
        if (clearFormat !== false) {
            this.clearCopiedFormat();
        }
        this.updateCursor(false);
        if (wasActive && notifyToolbar) {
            this.notifyUiState();
        }
    }

    /**
     * Called when selection changes while Format Painter is active.
     *
     * @param {boolean} isSelectionChanged - Whether the selection range changed
     * @returns {void}
     * @private
     */
    /**
     * The next selection change must not paint. Used by select-all.
     *
     * @returns {void}
     * @private
     */
    public skipSelectionApply(): void {
        this.skipNextSelectionApply = true;
    }

    public onSelectionChanged(isSelectionChanged: boolean): void {
        if (!this.isActiveInternal || !this.applyOnNextSelection || !isSelectionChanged) {
            return;
        }
        // Undo and redo restore the previous selection range through the same
        // selection-change pipeline. The armed painter must not fire on those
        // internal restores: it would paint over the history's own re-applied
        // formatting and leave redo of the paint itself broken (the redo applies
        // the pre-image while the painter paints the copied format back).
        if (this.isHistoryRestoringSelection()) {
            return;
        }
        if (this.skipNextSelectionApply) {
            this.skipNextSelectionApply = false;
            return;
        }
        // Mouse drag and touch selection fire this on every move. Apply only after
        // the gesture ends, not while the selection is still in progress.
        if (this.isPointerSelecting()) {
            return;
        }
        this.applyPendingFormat();
    }

    private isHistoryRestoringSelection(): boolean {
        // editorHistoryModule is read directly (the public getter throws when
        // the module is not injected).
        return !isNullOrUndefined(this.owner) && !isNullOrUndefined((this.owner as any).editorHistoryModule)
            && ((this.owner as any).editorHistoryModule.isUndoing === true
                || (this.owner as any).editorHistoryModule.isRedoing === true);
    }

    /**
     * Applies copied formatting once a pointer selection gesture has ended.
     * Called from mouse-up / touch-up because those clear the in-progress flags
     * before the selection-changed notification runs.
     *
     * @returns {void}
     * @private
     */
    public onPointerSelectionEnd(): void {
        // Mouse click and selection drag end here for both workflows. The ribbon
        // path also applies on the next programmatic selection; the API path does not.
        // Right-click and content drag never reach this method.
        if (!this.isActiveInternal) {
            return;
        }
        if (this.applyOnNextSelection) {
            this.applyPendingFormat();
            return;
        }
        this.applyCopiedFormat();
    }

    private isPointerSelecting(): boolean {
        if (isNullOrUndefined(this.owner) || isNullOrUndefined(this.owner.documentHelper)) {
            return false;
        }
        const helper: any = this.owner.documentHelper;
        return helper.isMouseDown === true || helper.isSelectionChangedOnMouseMoved === true
            || helper.isTouchMoved === true;
    }

    private applyPendingFormat(): void {
        this.applyOnNextSelection = false;
        const applied: boolean = this.applyCopiedFormat();
        if (this.isActiveInternal) {
            // Toolbar persistent mode, or an invalid target: keep painting the
            // next selection. The API path never sets this flag.
            this.applyOnNextSelection = true;
        }
    }

    /**
     * Cancels Format Painter when the user starts typing or editing content (except image insert).
     *
     * @returns {void}
     * @private
     */
    public onContentEdit(): void {
        if (this.isActiveInternal) {
            this.cancel();
        }
    }

    /**
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.cancel();
        this.owner = undefined;
    }


    private attachCancelListeners(): void {
        if (this.cancelListenersAttached || typeof document === 'undefined') {
            return;
        }
        // Capture phase so clicks and keystrokes are seen even when a child stops
        // propagation. Toolbar, ribbon, and dialog targets are excluded below.
        document.addEventListener('mousedown', this.onDocumentPointerDown, true);
        document.addEventListener('touchstart', this.onDocumentPointerDown, true);
        window.addEventListener('keydown', this.onWindowKeyDown, true);
        window.addEventListener('keyup', this.onWindowKeyUp, true);
        document.addEventListener('focusin', this.onWindowFocusIn, true);
        this.cancelListenersAttached = true;
    }

    private detachCancelListeners(): void {
        if (!this.cancelListenersAttached || typeof document === 'undefined') {
            return;
        }
        document.removeEventListener('mousedown', this.onDocumentPointerDown, true);
        document.removeEventListener('touchstart', this.onDocumentPointerDown, true);
        window.removeEventListener('keydown', this.onWindowKeyDown, true);
        window.removeEventListener('keyup', this.onWindowKeyUp, true);
        document.removeEventListener('focusin', this.onWindowFocusIn, true);
        this.cancelListenersAttached = false;
    }

    private cancelIfOutside(target: Node): void {
        // A click or focus change outside the editor does not cancel the painter.
        // Escape, typing, an explicit cancel, and a consumed single-use apply do.
    }

    private isFormatPainterChrome(target: Node): boolean {
        const element: HTMLElement = target instanceof HTMLElement ? target : (target.parentElement as HTMLElement);
        if (isNullOrUndefined(element) || isNullOrUndefined(element.closest)) {
            return false;
        }
        // The context menu is appended outside the editor element. Opening it
        // must not cancel an active painter; only an explicit cancel, Escape,
        // typing, or a click outside the document does.
        return !isNullOrUndefined(element.closest(
            '.e-de-ctnr-toolbar, .e-toolbar, .e-ribbon, .e-de-statusbar, .e-de-ctnr-properties-pane, .e-dialog, .e-popup, .e-dropdown-popup, .e-colorpicker-popup, .e-de-contextmenu-wrapper, .e-contextmenu-wrapper, .e-menu-wrapper'));
    }

    private captureCharacterFormat(selection: Selection, start: TextPosition): void {
        // Prefer the inline at the logical start. Fall back to the paragraph mark,
        // then the resolved selection format (typing format at a collapsed caret).
        let inlineInfo: { element: ElementBox, index: number } =
            !isNullOrUndefined(start.currentWidget) ? start.currentWidget.getInline(start.offset, 0) : undefined;
        // getInline returns the preceding element when the start offset sits on an
        // element boundary (a word selection starting at a text-element start, like
        // a double-click). Advance to the first element the selection actually
        // covers, mirroring the selection module's own boundary handling.
        if (!isNullOrUndefined(inlineInfo) && !isNullOrUndefined(inlineInfo.element)
            && inlineInfo.index === inlineInfo.element.length) {
            // Advance past zero-width marks (bookmarks, field codes) to the first
            // element that actually carries the selection's first character.
            let next: ElementBox = inlineInfo.element.nextNode as ElementBox;
            while (!isNullOrUndefined(next) && next.length === 0) {
                next = next.nextNode as ElementBox;
            }
            if (!isNullOrUndefined(next) && next.length > 0) {
                inlineInfo = { element: next, index: 0 };
            }
        }
        let source: WCharacterFormat = undefined;
        if (!isNullOrUndefined(inlineInfo) && !isNullOrUndefined(inlineInfo.element) &&
            !isNullOrUndefined(inlineInfo.element.characterFormat)) {
            source = inlineInfo.element.characterFormat;
        } else if (!isNullOrUndefined(start.paragraph) && !isNullOrUndefined(start.paragraph.characterFormat)) {
            source = start.paragraph.characterFormat;
        }
        // cloneFormat shares the unique-format record (reference counted). Property
        // copies onto a bare WCharacterFormat never enter the format pool, so
        // WCharacterFormat.copyFormat later ignores them and the selection is unchanged.
        if (!isNullOrUndefined(source)) {
            // cloneFormat keeps only directly set properties. A heading's size and
            // font are inherited, so the snapshot must also record the resolved
            // values the user sees. Otherwise a partial selection never receives them.
            this.characterFormat = this.resolvedCharacterFormat(source);
            return;
        }
        this.characterFormat = this.characterFormatFromSelection(selection);
    }

    private resolvedCharacterFormat(source: WCharacterFormat): WCharacterFormat {
        const snapshot: WCharacterFormat = new WCharacterFormat(undefined);
        // Setters write the unique-format pool. Getters resolve style inheritance,
        // so a heading snapshot carries the size and font the user sees.
        snapshot.bold = source.bold;
        snapshot.italic = source.italic;
        snapshot.fontSize = source.fontSize;
        snapshot.fontFamily = source.fontFamily;
        snapshot.underline = source.underline;
        snapshot.strikethrough = source.strikethrough;
        snapshot.baselineAlignment = source.baselineAlignment;
        snapshot.characterSpacing = source.characterSpacing;
        snapshot.highlightColor = source.highlightColor;
        snapshot.fontColor = source.fontColor;
        snapshot.bidi = source.bidi;
        snapshot.bdo = source.bdo;
        snapshot.allCaps = source.allCaps;
        return snapshot;
    }

    private characterFormatFromSelection(selection: Selection): WCharacterFormat {
        const snapshot: WCharacterFormat = new WCharacterFormat(undefined);
        const sf: any = selection.characterFormat;
        if (isNullOrUndefined(sf)) {
            return snapshot;
        }
        // Setters write the unique-format pool so apply's copyFormat sees the values.
        snapshot.bold = sf.bold;
        snapshot.italic = sf.italic;
        if (!isNullOrUndefined(sf.fontSize) && sf.fontSize !== 0) {
            snapshot.fontSize = sf.fontSize;
        }
        if (!isNullOrUndefined(sf.fontFamily)) {
            snapshot.fontFamily = sf.fontFamily;
        }
        if (!isNullOrUndefined(sf.underline)) {
            snapshot.underline = sf.underline;
        }
        if (!isNullOrUndefined(sf.strikethrough)) {
            snapshot.strikethrough = sf.strikethrough;
        }
        if (!isNullOrUndefined(sf.baselineAlignment)) {
            snapshot.baselineAlignment = sf.baselineAlignment;
        }
        if (!isNullOrUndefined(sf.highlightColor)) {
            snapshot.highlightColor = sf.highlightColor;
        }
        if (!isNullOrUndefined(sf.fontColor)) {
            snapshot.fontColor = sf.fontColor;
        }
        if (!isNullOrUndefined(sf.bidi)) {
            snapshot.bidi = sf.bidi;
        }
        if (!isNullOrUndefined(sf.bdo)) {
            snapshot.bdo = sf.bdo;
        }
        if (!isNullOrUndefined(sf.allCaps)) {
            snapshot.allCaps = sf.allCaps;
        }
        if (!isNullOrUndefined(sf.characterSpacing)) {
            snapshot.characterSpacing = sf.characterSpacing;
        }
        return snapshot;
    }

    private captureParagraphFormat(start: TextPosition): void {
        // Same pool rule as character format: cloneFormat keeps uniqueParagraphFormat
        // so paragraph copyFormat applies alignment, spacing, and indents.
        // Heading styles live on baseStyle, not in the pooled format. A heading
        // paragraph often has no uniqueParagraphFormat, so the style must be kept
        // even when the format clone is skipped.
        if (!isNullOrUndefined(start.paragraph) && !isNullOrUndefined(start.paragraph.paragraphFormat)) {
            const sourceFormat: WParagraphFormat = start.paragraph.paragraphFormat;
            this.paragraphStyle = !isNullOrUndefined(sourceFormat.baseStyle) ? sourceFormat.baseStyle : undefined;
            // Paragraph borders are stored outside the unique-format pool, so a
            // paragraph whose only direct formatting is a border has no
            // uniqueParagraphFormat. cloneFormat copies borders too, so capture
            // whenever either the pool record or any border carries values.
            const hasBorders: boolean = !isNullOrUndefined(sourceFormat.borders) && this.hasBorderValues(sourceFormat.borders);
            if (!isNullOrUndefined(sourceFormat.uniqueParagraphFormat) || hasBorders) {
                // Build a fresh snapshot instead of cloneFormat: the clone shares
                // the source's unique-format record, so writing into it would
                // mutate the source paragraph's own pooled format. A fresh format
                // records the resolved values the user sees - including values
                // that are only the document default (a default-aligned source
                // still paints its alignment onto a differently aligned target),
                // and its setters create their own pool record so the paint can
                // override the target.
                const snapshot: WParagraphFormat = new WParagraphFormat(undefined);
                // The textAlignment getter mirrors Left/Right for bidi paragraphs,
                // so it returns the alignment the user SEES. The engine stores the
                // logical (mirrored) value for bidi paragraphs - the paragraph
                // dialog applies the same convention before building its format -
                // so mirror the display value on capture or a bidi target's getter
                // would flip it again and paint the opposite visual alignment.
                const displayAlignment: TextAlignment = sourceFormat.textAlignment;
                if (sourceFormat.bidi
                    && (displayAlignment === 'Left' || displayAlignment === 'Right')) {
                    snapshot.textAlignment = displayAlignment === 'Left' ? 'Right' : 'Left';
                } else {
                    snapshot.textAlignment = displayAlignment;
                }
                snapshot.leftIndent = sourceFormat.leftIndent;
                snapshot.rightIndent = sourceFormat.rightIndent;
                snapshot.firstLineIndent = sourceFormat.firstLineIndent;
                snapshot.beforeSpacing = sourceFormat.beforeSpacing;
                snapshot.afterSpacing = sourceFormat.afterSpacing;
                snapshot.lineSpacing = sourceFormat.lineSpacing;
                snapshot.lineSpacingType = sourceFormat.lineSpacingType;
                snapshot.spaceBeforeAuto = sourceFormat.spaceBeforeAuto;
                snapshot.spaceAfterAuto = sourceFormat.spaceAfterAuto;
                snapshot.contextualSpacing = sourceFormat.contextualSpacing;
                snapshot.outlineLevel = sourceFormat.outlineLevel;
                snapshot.keepWithNext = sourceFormat.keepWithNext;
                snapshot.keepLinesTogether = sourceFormat.keepLinesTogether;
                snapshot.widowControl = sourceFormat.widowControl;
                snapshot.bidi = sourceFormat.bidi;
                if (!isNullOrUndefined(sourceFormat.borders)) {
                    snapshot.borders = sourceFormat.borders.cloneFormat();
                }
                if (!isNullOrUndefined(sourceFormat.listFormat)) {
                    snapshot.listFormat = sourceFormat.listFormat.cloneListFormat();
                    snapshot.listFormat.ownerBase = snapshot;
                }
                this.paragraphFormat = snapshot;
                return;
            }
        } else {
            this.paragraphStyle = undefined;
        }
        this.paragraphFormat = new WParagraphFormat(undefined);
    }

    private hasBorderValues(borders: WBorders): boolean {
        // Borders live in their own per-side WBorder objects, outside the
        // paragraph unique-format pool: only these sides can carry values.
        return (!isNullOrUndefined(borders.top) && borders.top.hasValues())
            || (!isNullOrUndefined(borders.bottom) && borders.bottom.hasValues())
            || (!isNullOrUndefined(borders.left) && borders.left.hasValues())
            || (!isNullOrUndefined(borders.right) && borders.right.hasValues())
            || (!isNullOrUndefined(borders.horizontal) && borders.horizontal.hasValues())
            || (!isNullOrUndefined(borders.vertical) && borders.vertical.hasValues());
    }

    private clearCopiedFormat(): void {
        // cloneFormat shares the source unique-format record and does not increment
        // its reference count. destroy() would decrement that count and drop the
        // source text's format from the pool, so only drop the local references.
        this.characterFormat = undefined;
        this.paragraphFormat = undefined;
        this.paragraphStyle = undefined;
        this.paragraphFormatFromPartialSource = false;
    }

    private shouldApplyParagraphFormat(selection: Selection): boolean {
        // A partial-selection source transfers character formatting only, even
        // when the target is a caret or a full paragraph: the source carried
        // no paragraph mark, so alignment, indents, and spacing must not move.
        if (this.paragraphFormatFromPartialSource) {
            return false;
        }
        // A partial-text target receives character formatting only as well
        // (FP-004): the user selected text, not the paragraph, so alignment,
        // indents, spacing, borders, and list format must not move. A
        // collapsed caret or a full-paragraph selection covers the paragraph
        // mark, so paragraph formatting paints the containing paragraph.
        if (!selection.isEmpty && !this.selectionIncludesParagraphMark(selection)) {
            return false;
        }
        // The source carried paragraph formatting and the target covers the
        // paragraph mark: paint character + paragraph formatting together,
        // exactly like applying alignment from the ribbon.
        return true;
    }

    private selectionIncludesParagraphMark(selection: Selection): boolean {
        let start: TextPosition = selection.start;
        let end: TextPosition = selection.end;
        if (!selection.isForward) {
            start = selection.end;
            end = selection.start;
        }
        // Multi-paragraph selection always includes paragraph formatting
        if (start.paragraph !== end.paragraph) {
            return true;
        }
        // Same paragraph: paragraph format applies when the paragraph mark is included
        if (end.isAtParagraphEnd) {
            return true;
        }
        const para: ParagraphWidget = end.paragraph;
        if (isNullOrUndefined(para)) {
            return false;
        }
        const paraLength: number = selection.getLineLength(end.currentWidget);
        // offset past last character means paragraph mark is selected
        return end.offset > paraLength || end.offset === paraLength + 1;
    }

    private isValidTarget(selection: Selection): boolean {
        if (isNullOrUndefined(selection.start) || isNullOrUndefined(selection.start.paragraph)) {
            return false;
        }
        // Image-only selection with no text: not a valid format target for character paint of existing text;
        // collapsed caret on image still allows paragraph format + typing format.
        if (!selection.isEmpty) {
            const start: TextPosition = selection.isForward ? selection.start : selection.end;
            const end: TextPosition = selection.isForward ? selection.end : selection.start;
            if (start.paragraph === end.paragraph && start.currentWidget === end.currentWidget) {
                const startInfo: { element: ElementBox, index: number } =
                    start.currentWidget.getInline(start.offset, 0);
                const endInfo: { element: ElementBox, index: number } =
                    end.currentWidget.getInline(end.offset, 0);
                if (!isNullOrUndefined(startInfo) && startInfo.element instanceof ImageElementBox &&
                    !isNullOrUndefined(endInfo) && endInfo.element instanceof ImageElementBox &&
                    startInfo.element === endInfo.element) {
                    return false;
                }
            }
        }
        return true;
    }

    private updateCursor(active: boolean): void {
        // viewer.updateCursor() owns hover changes. Seed the arrow-plus-glyph cursor
        // immediately so the mode is visible before the next mouse move, and restore
        // text on cancel so the next move re-evaluates hyperlink/resize cursors.
        if (!isNullOrUndefined(this.owner) && !isNullOrUndefined(this.owner.documentHelper)) {
            const helper: any = this.owner.documentHelper;
            const container: HTMLElement = !isNullOrUndefined(helper.viewerContainer) ?
                helper.viewerContainer as HTMLElement : undefined;
            if (active && !isNullOrUndefined(helper.applyFormatPainterCursor)) {
                helper.applyFormatPainterCursor(false);
            } else if (!isNullOrUndefined(helper.clearFormatPainterCursor)) {
                helper.clearFormatPainterCursor();
            } else if (!isNullOrUndefined(container)) {
                container.style.cursor = 'text';
            }
        }
        if (!isNullOrUndefined(this.owner) && !isNullOrUndefined(this.owner.element)) {
            if (active) {
                this.owner.element.classList.add('e-de-format-painter-active');
            } else {
                this.owner.element.classList.remove('e-de-format-painter-active');
            }
        }
    }

    private notifyUiState(): void {
        if (isNullOrUndefined(this.owner)) {
            return;
        }
        const args: { isActive: boolean, isPersistent: boolean } = {
            isActive: this.isActiveInternal,
            isPersistent: this.isPersistentInternal
        };
        // Container listens through the editor's internal event, which is
        // available before Component.element is assigned.
        this.owner.notify(internalFormatPainterStateChange, args);
        if (!isNullOrUndefined((this.owner as any).notifyFormatPainterState)) {
            (this.owner as any).notifyFormatPainterState(this.isActiveInternal, this.isPersistentInternal);
        }
    }

    /**
     * Builds the brush-plus-arrow cursor after the document exists.
     * Module load cannot do this: document.body is not available yet.
     *
     * @returns {void}
     * @private
     */
    public ensureCursor(): void {
        if (isNullOrUndefined(this.owner) || isNullOrUndefined(this.owner.documentHelper)) {
            return;
        }
        const helper: any = this.owner.documentHelper;
        helper.formatPainterCursor = this.cursorImage(false);
        helper.formatPainterTextCursor = this.cursorImage(true);
    }

    private cursorImage(text: boolean): string {
        const brush: string = this.brushImage();
        const glyph: string = brush === '' ? '' : '<image x=\'0\' y=\'1\' width=\'16\' height=\'16\' href=\'' + brush + '\'/>';
        const mark: string = text
            ? '<path fill="%23000" stroke="%23fff" stroke-width="1" stroke-linejoin="miter" d="M18.4 1h4.2v1.6H21.2V17h1.4v1.6h-4.2V17h1.4V2.6h-1.4z"/>'
            : '<path fill="%23fff" stroke="%23000" stroke-width="1" stroke-linejoin="miter" d="M16 1v13l3-3 2.2 4.8 2.4-1.1-2.2-4.9h4.2z"/>';
        const svg: string = '<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'36\' height=\'24\'>' + mark + glyph + '</svg>';
        return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") 17 1, ' + (text ? 'text' : 'default');
    }

    private brushImage(): string {
        if (typeof document === 'undefined' || isNullOrUndefined(document.body)) {
            return '';
        }
        const size: number = 16;
        const icon: HTMLElement = createElement('span', {
            className: 'e-icons e-de-ctnr-format-painter',
            styles: 'position:fixed;left:0;top:0;font-size:' + size + 'px;line-height:1;visibility:hidden;'
        }) as HTMLElement;
        document.body.appendChild(icon);
        let family: string = '';
        let content: string = '';
        let color: string = '#111';
        try {
            const computed: CSSStyleDeclaration = getComputedStyle(icon, '::before');
            const own: CSSStyleDeclaration = getComputedStyle(icon);
            family = (computed.fontFamily || own.fontFamily || '').replace(/["']/g, '');
            content = computed.content || '';
            if (own.color && own.color !== 'rgba(0, 0, 0, 0)') {
                color = own.color;
            }
        } catch (e) {
            family = '';
        }
        document.body.removeChild(icon);
        let codePoint: number = this.iconCodePoint(content);
        if (codePoint === 0) {
            codePoint = this.iconCodePoint(this.themeIconContent());
        }
        if (family === '' || codePoint === 0) {
            return '';
        }
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        if (isNullOrUndefined(context)) {
            return '';
        }
        context.font = size + 'px ' + family;
        context.textBaseline = 'top';
        context.textAlign = 'left';
        context.fillStyle = this.isLightColor(color) ? '#111' : color;
        context.fillText(String.fromCharCode(codePoint), 0, 0);
        return canvas.toDataURL('image/png');
    }

    private isLightColor(color: string): boolean {
        const match: RegExpMatchArray = color.match(/rgba?\(([^)]+)\)/);
        if (isNullOrUndefined(match)) {
            return false;
        }
        const parts: string[] = match[1].split(',');
        if (parts.length < 3) {
            return false;
        }
        const alpha: string = parts.length > 3 ? parts[3] : '1';
        if (parseFloat(alpha) < 0.5) {
            return false;
        }
        const red: string = parts[0];
        const green: string = parts[1];
        const blue: string = parts[2];
        const luminance: number =
            (parseInt(red, 10) * 299 + parseInt(green, 10) * 587 + parseInt(blue, 10) * 114) / 1000;
        return luminance > 128;
    }

    private iconCodePoint(content: string): number {
        if (isNullOrUndefined(content) || content === 'none' || content === 'normal') {
            return 0;
        }
        const quoted: RegExpMatchArray = content.match(/["']([^"']+)["']/);
        const raw: string = quoted ? quoted[1] : content;
        if (raw.length === 1) {
            return raw.charCodeAt(0);
        }
        const hex: RegExpMatchArray = raw.match(/\\([0-9a-fA-F]{1,6})/);
        if (hex) {
            return parseInt(hex[1], 16);
        }
        return 0;
    }

    private themeIconContent(): string {
        const sheets: StyleSheetList = document.styleSheets;
        for (let i: number = 0; i < sheets.length; i++) {
            let rules: CSSRuleList = null;
            try {
                rules = (sheets.item(i) as CSSStyleSheet).cssRules;
            } catch (e) {
                rules = null;
            }
            if (isNullOrUndefined(rules)) {
                continue;
            }
            for (let j: number = 0; j < rules.length; j++) {
                const rule: CSSStyleRule = rules.item(j) as CSSStyleRule;
                if (isNullOrUndefined(rule) || isNullOrUndefined(rule.selectorText)
                    || rule.selectorText.indexOf('e-format-painter') === -1) {
                    continue;
                }
                const content: string = rule.style && rule.style.content ? rule.style.content : '';
                if (this.iconCodePoint(content) !== 0) {
                    return content;
                }
            }
        }
        return '';
    }
}
