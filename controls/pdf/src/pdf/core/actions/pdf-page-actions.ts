import { PdfAction } from '../pdf-action';
import { PdfPage } from '../pdf-page';
import { _PdfDictionary } from '../pdf-primitives';
/**
 * Represents actions associated with page events in a PDF document.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a JavaScript action
 * let action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert("Page opened");');
 * // Assign the action to the page open event
 * page.actions.open = action;
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfPageActions {
    /**
     * Stores the page associated with the action collection.
     *
     * @private
     */
    private _page: PdfPage;
    /**
     * Stores the action executed when the page is opened.
     *
     * @private
     */
    private _open: PdfAction;
    /**
     * Stores the action executed when the page is closed.
     *
     * @private
     */
    private _close: PdfAction;
    /**
     * Initializes actions for the specified page.
     *
     * @private
     * @param {PdfPage} page The page associated with the action collection.
     */
    constructor(page: PdfPage) {
        this._page = page;
    }
    /**
     * Gets the action executed when the page is opened.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0);
     * // Get the action assigned to the page open event
     * let action: PdfAction = page.actions.open;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfAction} The action executed when the page is opened.
     */
    public get open(): PdfAction {
        if (!this._open) {
            this._open = this._getAction('O');
        }
        return this._open;
    }
    /**
     * Sets the action executed when the page is opened.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create a JavaScript action
     * let action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert("Page opened");');
     * // Assign the action to the page open event
     * page.actions.open = action;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfAction} value The action to execute when the page is opened.
     */
    public set open(value: PdfAction) {
        this._open = value;
        this._setAction('O', value);
    }
    /**
     * Gets the action executed when the page is closed.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first page
     * let page: PdfPage = document.getPage(0);
     * // Get the action assigned to the page close event
     * let action: PdfAction = page.actions.close;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfAction} The action executed when the page is closed.
     */
    public get close(): PdfAction {
        if (!this._close) {
            this._close = this._getAction('C');
        }
        return this._close;
    }
    /**
     * Sets the action executed when the page is closed.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create a JavaScript action
     * let action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert("Page closed");');
     * // Assign the action to the page close event
     * page.actions.close = action;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfAction} value The action to execute when the page is closed.
     */
    public set close(value: PdfAction) {
        this._close = value;
        this._setAction('C', value);
    }
    /**
     * Gets the action associated with the specified page event.
     *
     * @private
     * @param {string} key The event key used to retrieve the action.
     * @returns {PdfAction} The resolved action, or `undefined` when no action is assigned.
     */
    private _getAction(key: string): PdfAction {
        let actionDictionary: _PdfDictionary;
        const aa: _PdfDictionary = this._page._pageDictionary.get('AA');
        if (aa instanceof _PdfDictionary) {
            actionDictionary = aa.get(key);
            if (actionDictionary instanceof _PdfDictionary) {
                const dictionary: _PdfDictionary & { _parentDictionary?: _PdfDictionary } = actionDictionary;
                dictionary._parentDictionary = this._page._pageDictionary;
                if (!actionDictionary._crossReference && this._page._crossReference) {
                    actionDictionary._crossReference = this._page._crossReference;
                }
            }
        }
        if (!(actionDictionary instanceof _PdfDictionary)) {
            return undefined;
        }
        return PdfAction._createActionFromDictionary(actionDictionary);
    }
    /**
     * Sets or removes the action associated with the specified page event.
     *
     * @private
     * @param {string} key The event key used to associate the action.
     * @param {PdfAction} action The action to assign, or `undefined` to remove the existing action.
     * @returns {void} Nothing.
     */
    private _setAction(key: string, action: PdfAction): void {
        let aa: _PdfDictionary = this._page._pageDictionary.get('AA');
        if (!(aa instanceof _PdfDictionary)) {
            aa = new _PdfDictionary();
            this._page._pageDictionary.update('AA', aa);
        }
        if (action) {
            (action as PdfAction & { _page?: PdfPage })._page = this._page;
            if (action._dictionary && !action._dictionary._crossReference && this._page._crossReference) {
                action._dictionary._crossReference = this._page._crossReference;
            }
            aa.update(key, action._dictionary);
        } else {
            delete aa._map[<string>key];
            aa._updated = true;
            this._page._pageDictionary._updated = true;
        }
    }
}
