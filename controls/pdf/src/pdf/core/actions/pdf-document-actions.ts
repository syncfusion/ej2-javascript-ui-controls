import { PdfAction, PdfJavaScriptAction } from '../pdf-action';
import { _PdfCatalog } from '../pdf-catalog';
import { _PdfDictionary } from '../pdf-primitives';
/**
 * Represents actions associated with document-level events in a PDF document.
 *
 * ```typescript
 * // Create a new PDF document
 * const document: PdfDocument = new PdfDocument();
 * // Add two pages to the document
 * document.addPage();
 * document.addPage();
 * // Create a named action that navigates to the last page
 * const action: PdfNamedAction =
 *     new PdfNamedAction(
 *         PdfActionDestination.LastPage
 *     );
 * // Assign the action to the document open event
 * document.actions.afterOpen = action;
 * // Save the PDF document
 * document.save('output.pdf');
 * // Destroy the PDF document
 * document.destroy();
 * ```
 */
export class PdfDocumentActions {
    /**
     * Stores the document catalog associated with this action collection.
     *
     * @private
     */
    private _catalog: _PdfCatalog;
    /**
     * Stores the action executed when the document is opened.
     *
     * @private
     */
    private _afterOpen: PdfAction;
    /**
     * Stores the action executed before the document is closed.
     *
     * @private
     */
    private _beforeClose: PdfAction;
    /**
     * Stores the action executed before the document is printed.
     *
     * @private
     */
    private _beforePrint: PdfAction;
    /**
     * Stores the action executed after the document is printed.
     *
     * @private
     */
    private _afterPrint: PdfAction;
    /**
     * Stores the action executed before the document is saved.
     *
     * @private
     */
    private _beforeSave: PdfAction;
    /**
     * Stores the action executed after the document is saved.
     *
     * @private
     */
    private _afterSave: PdfAction;
    /**
     * Initializes document-level actions for the specified document catalog.
     *
     * @private
     * @param {_PdfCatalog} catalog The document catalog associated with the action
     */
    constructor(catalog: _PdfCatalog) {
        this._catalog = catalog;
    }
    /**
     * Gets the action executed when the document is opened.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add two pages to the document
     * document.addPage();
     * document.addPage();
     * // Create a named action that navigates to the last page
     * const action: PdfNamedAction =
     *     new PdfNamedAction(
     *         PdfActionDestination.LastPage
     *     );
     * // Assign the action to the document open event
     * document.actions.afterOpen = action;
     * // Get the action assigned to the document open event
     * const afterOpenAction: PdfAction =
     *     document.actions.afterOpen;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @returns {PdfAction} The action executed when the document is opened.
     */
    public get afterOpen(): PdfAction {
        if (!this._afterOpen) {
            this._afterOpen = this._getAction('OpenAction');
        }
        return this._afterOpen;
    }
    /**
     * Sets the action executed when the document is opened.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add two pages to the document
     * document.addPage();
     * document.addPage();
     * // Create a named action that navigates to the last page
     * const action: PdfNamedAction =
     *     new PdfNamedAction(
     *         PdfActionDestination.LastPage
     *     );
     * // Assign the action to the document open event
     * document.actions.afterOpen = action;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @param {PdfAction} value The action to execute when the document is opened.
     */
    public set afterOpen(value: PdfAction) {
        this._afterOpen = value;
        const dictionary: _PdfDictionary = this._catalog._catalogDictionary;
        if (value) {
            dictionary.update('OpenAction', value._dictionary);
        } else {
            delete dictionary._map.OpenAction;
            dictionary._updated = true;
        }
        dictionary._crossReference._allowCatalog = true;
    }
    /**
     * Gets the JavaScript action executed before the document is closed.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * document.addPage();
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction(
     *         'app.alert('The document is closing');'
     *     );
     * // Assign the action to the document before-close event
     * document.actions.beforeClose = action;
     * // Get the action assigned to the before-close event
     * const beforeCloseAction: PdfJavaScriptAction = document.actions.beforeClose;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @returns {PdfJavaScriptAction} The JavaScript action executed before the document is closed.
     */
    public get beforeClose(): PdfJavaScriptAction {
        if (!this._beforeClose) {
            this._beforeClose = this._getAdditionalAction('WC');
        }
        return this._beforeClose as PdfJavaScriptAction;
    }
    /**
     * Sets the JavaScript action executed before the document is closed.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * document.addPage();
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction(
     *         'app.alert('The document is closing');'
     *     );
     * // Assign the action to the document before-close event
     * document.actions.beforeClose = action;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @param {PdfJavaScriptAction} value The JavaScript action to execute before the document is closed.
     */
    public set beforeClose(value: PdfJavaScriptAction) {
        this._beforeClose = value;
        this._setAdditionalAction('WC', value);
    }
    /**
     * Gets the JavaScript action executed before the document is printed.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * document.addPage();
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction(
     *         'app.alert('The document will be printed');'
     *     );
     * // Assign the action to the document before-print event
     * document.actions.beforePrint = action;
     * // Get the action assigned to the before-print event
     * const beforePrintAction: PdfJavaScriptAction =
     *     document.actions.beforePrint;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @returns {PdfJavaScriptAction} The JavaScript action executed before the document is printed.
     */
    public get beforePrint(): PdfJavaScriptAction {
        if (!this._beforePrint) {
            this._beforePrint =
                this._getAdditionalAction('WP');
        }
        return this._beforePrint as PdfJavaScriptAction;
    }
    /**
     * Sets the JavaScript action executed before the document is printed.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * document.addPage();
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction(
     *         'app.alert('The document will be printed');'
     *     );
     * // Assign the action to the document before-print event
     * document.actions.beforePrint = action;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @param {PdfJavaScriptAction} value The JavaScript action to execute before the document is printed.
     */
    public set beforePrint(value: PdfJavaScriptAction) {
        this._beforePrint = value;
        this._setAdditionalAction('WP', value);
    }
    /**
     * Gets the JavaScript action executed after the document is printed.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * document.addPage();
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction(
     *         'app.alert('The document has been printed');'
     *     );
     * // Assign the action to the document after-print event
     * document.actions.afterPrint = action;
     * // Get the action assigned to the after-print event
     * const afterPrintAction: PdfJavaScriptAction =
     *     document.actions.afterPrint;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @returns {PdfJavaScriptAction} The JavaScript action executed after the document is printed.
     */
    public get afterPrint(): PdfJavaScriptAction {
        if (!this._afterPrint) {
            this._afterPrint = this._getAdditionalAction('DP');
        }
        return this._afterPrint as PdfJavaScriptAction;
    }
    /**
     * Sets the JavaScript action executed after the document is printed.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * document.addPage();
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction(
     *         'app.alert('The document has been printed');'
     *     );
     * // Assign the action to the document after-print event
     * document.actions.afterPrint = action;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @param {PdfJavaScriptAction} value The JavaScript action to execute after the document is printed.
     */
    public set afterPrint(value: PdfJavaScriptAction) {
        this._afterPrint = value;
        this._setAdditionalAction('DP', value);
    }
    /**
     * Gets the JavaScript action executed before the document is saved.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * document.addPage();
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction(
     *         'app.alert('The document will be saved');'
     *     );
     * // Assign the action to the document before-save event
     * document.actions.beforeSave = action;
     * // Get the action assigned to the before-save event
     * const beforeSaveAction: PdfJavaScriptAction =
     *     document.actions.beforeSave;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @returns {PdfJavaScriptAction} The JavaScript action executed before the document is saved.
     */
    public get beforeSave(): PdfJavaScriptAction {
        if (!this._beforeSave) {
            this._beforeSave = this._getAdditionalAction('WS');
        }
        return this._beforeSave as PdfJavaScriptAction;
    }
    /**
     * Sets the JavaScript action executed before the document is saved.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * document.addPage();
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction(
     *         'app.alert('The document will be saved');'
     *     );
     * // Assign the action to the document before-save event
     * document.actions.beforeSave = action;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @param {PdfJavaScriptAction} value The JavaScript action to execute before the document is saved.
     */
    public set beforeSave(value: PdfJavaScriptAction) {
        this._beforeSave = value;
        this._setAdditionalAction('WS', value);
    }
    /**
     * Gets the JavaScript action executed after the document is saved.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * document.addPage();
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction(
     *         'app.alert('The document has been saved');'
     *     );
     * // Assign the action to the document after-save event
     * document.actions.afterSave = action;
     * // Get the action assigned to the after-save event
     * const afterSaveAction: PdfJavaScriptAction =
     *     document.actions.afterSave;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @returns {PdfJavaScriptAction} The JavaScript action executed after the document is saved.
     */
    public get afterSave(): PdfJavaScriptAction {
        if (!this._afterSave) {
            this._afterSave = this._getAdditionalAction('DS');
        }
        return this._afterSave as PdfJavaScriptAction;
    }
    /**
     * Sets the JavaScript action executed after the document is saved.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * document.addPage();
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction(
     *         'app.alert('The document has been saved');'
     *     );
     * // Assign the action to the document after-save event
     * document.actions.afterSave = action;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @param {PdfJavaScriptAction} value The JavaScript action to execute after the document is saved.
     */
    public set afterSave(value: PdfJavaScriptAction) {
        this._afterSave = value;
        this._setAdditionalAction('DS', value);
    }
    /**
     * Gets a document-level action.
     *
     * @private
     * @param {string} key Document action key.
     * @returns {PdfAction} Loaded document action.
     */
    private _getAction(key: string): PdfAction {
        const catalogDictionary: _PdfDictionary = this._catalog._catalogDictionary;
        let actionDictionary: _PdfDictionary;
        if (key === 'OpenAction') {
            actionDictionary = catalogDictionary.get('OpenAction') as _PdfDictionary;
        } else {
            const aa: _PdfDictionary = catalogDictionary.get('AA') as _PdfDictionary;
            if (aa instanceof _PdfDictionary) {
                actionDictionary = aa.get(key) as _PdfDictionary;
            }
        }
        if (!(actionDictionary instanceof _PdfDictionary)) {
            return undefined;
        }
        (actionDictionary as any)._parentDictionary = catalogDictionary; // eslint-disable-line
        catalogDictionary._crossReference._allowCatalog = true;
        return PdfAction._createActionFromDictionary(actionDictionary);
    }
    /**
     * Gets a document additional action.
     *
     * @private
     * @param {string} key Additional-action key.
     * @returns {PdfAction} Loaded document action.
     */
    private _getAdditionalAction(key: string): PdfAction {
        const catalogDictionary: _PdfDictionary = this._catalog._catalogDictionary;
        const aa: _PdfDictionary = catalogDictionary.get('AA') as _PdfDictionary;
        if (!(aa instanceof _PdfDictionary)) {
            return undefined;
        }
        const actionDictionary: _PdfDictionary = aa.get(key) as _PdfDictionary;
        if (!(actionDictionary instanceof _PdfDictionary)) {
            return undefined;
        }
        (actionDictionary as any)._parentDictionary = catalogDictionary; // eslint-disable-line
        catalogDictionary._crossReference._allowCatalog = true;
        return PdfAction._createActionFromDictionary(
            actionDictionary
        );
    }
    /**
     * Sets a document additional action.
     *
     * @private
     * @param {string} key Additional-action key.
     * @param {PdfAction} action Action to assign.
     * @returns {void} nothing.
     */
    private _setAdditionalAction(key: string, action: PdfAction): void {
        const catalogDictionary: _PdfDictionary = this._catalog._catalogDictionary;
        let aa: _PdfDictionary = catalogDictionary.get('AA') as _PdfDictionary;
        if (!(aa instanceof _PdfDictionary)) {
            aa = new _PdfDictionary();
            catalogDictionary.update('AA', aa);
        }
        if (action) {
            aa.update(key, action._dictionary);
        } else {
            delete aa._map[<string>key];
            aa._updated = true;
            catalogDictionary._updated = true;
        }
        catalogDictionary._crossReference._allowCatalog = true;
    }
}
