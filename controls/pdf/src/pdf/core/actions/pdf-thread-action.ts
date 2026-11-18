import { PdfAction } from '../pdf-action';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
/**
 * Represents an action that navigates to a bead in an existing article thread.
 *
 * ```typescript
 * // Load an existing PDF document containing an article thread
 * let document: PdfDocument = new PdfDocument(data, password);
 * let page: PdfPage = document.getPage(0);
 * // Create a thread action
 * let action: PdfThreadAction = new PdfThreadAction('Article1', 0);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'OpenThread', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Open thread';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfThreadAction extends PdfAction {
    /**
     * Initializes a new instance of the `PdfThreadAction` class.
     *
     * ```typescript
     * // Load an existing PDF document containing an article thread
     * let document: PdfDocument = new PdfDocument(data, password);
     * let page: PdfPage = document.getPage(0);
     * // Create a thread action
     * let action: PdfThreadAction = new PdfThreadAction('Article1', 0);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'OpenThread', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.text = 'Open thread';
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} threadId The title of the destination article thread.
     * @param {number} beadIndex The zero-based index of the destination bead.
     */
    public constructor(threadId?: string, beadIndex?: number) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('Thread'));
        if (threadId !== undefined) {
            this.threadId = threadId;
        }
        if (beadIndex !== undefined) {
            this.beadIndex = beadIndex;
        }
    }
    /**
     * Gets the title of the destination article thread.
     *
     * ```typescript
     * // Load an existing PDF document containing a thread action
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the thread button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the thread action and thread title
     * let action: PdfThreadAction = field.actions.mouseUp as PdfThreadAction;
     * let threadId: string = action.threadId;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The title of the destination article thread.
     */
    public get threadId(): string {
        const value: unknown = this._dictionary.get('D');
        return value === undefined || value === null ? undefined : String(value);
    }
    /**
     * Sets the title of the destination article thread.
     *
     * ```typescript
     * // Load an existing PDF document containing article threads
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the thread button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the thread action and set the thread title
     * let action: PdfThreadAction = field.actions.mouseUp as PdfThreadAction;
     * action.threadId = 'Article2';
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The title of the destination article thread.
     */
    public set threadId(value: string) {
        if (typeof value !== 'string' || value.length === 0) {
            throw new Error(
                `PdfThreadAction.threadId expected a non-empty string. Actual value: ${value}`
            );
        }
        this._dictionary.update('D', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the zero-based index of the destination bead.
     *
     * ```typescript
     * // Load an existing PDF document containing a thread action
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the thread button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the thread action and bead index
     * let action: PdfThreadAction = field.actions.mouseUp as PdfThreadAction;
     * let beadIndex: number = action.beadIndex;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {number} The zero-based index of the destination bead.
     */
    public get beadIndex(): number {
        const value: unknown = this._dictionary.get('B');
        return typeof value === 'number' ? value : 0;
    }
    /**
     * Sets the zero-based index of the destination bead.
     *
     * ```typescript
     * // Load an existing PDF document containing an article thread
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the thread button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the thread action and set the bead index
     * let action: PdfThreadAction = field.actions.mouseUp as PdfThreadAction;
     * action.beadIndex = 1;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {number} value The zero-based index of the destination bead.
     */
    public set beadIndex(value: number) {
        if (typeof value !== 'number' || !isFinite(value) || Math.floor(value) !== value || value < 0) {
            throw new Error(
                `PdfThreadAction.beadIndex expected a non-negative integer. Actual value: ${value}`
            );
        }
        this._dictionary.update('B', value);
        this._dictionary._updated = true;
    }
    /**
     * Validates the thread action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        const value: unknown = this._dictionary.get('D');
        if (value === undefined || value === null || value === '') {
            throw new Error(
                'PdfThreadAction.threadId expected a valid thread identifier. Actual value: undefined.'
            );
        }
    }
    /**
     * Creates a thread action from an existing dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The action dictionary to load.
     * @returns {PdfThreadAction} The loaded thread action.
     */
    static _load(dictionary: _PdfDictionary): PdfThreadAction {
        const action: PdfThreadAction = new PdfThreadAction();
        action._dictionary = dictionary;
        return action;
    }
}
PdfAction._registerActionClass('Thread', PdfThreadAction);
