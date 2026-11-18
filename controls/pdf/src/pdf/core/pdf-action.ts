import { PdfWidgetAnnotation } from './annotations/annotation';
import { PdfDestinationMode } from './enumerator';
import { PdfField } from './form/field';
import { _PdfDestinationHelper, PdfDestination, PdfPage } from './pdf-page';
import { _PdfDictionary, _PdfName } from './pdf-primitives';
/**
 * Represents base class for all action types.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access button field
 * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
 * // Access the second page
 * let secondPage: PdfPage = document.getPage(2);
 * // Create a PdfDestination for the specified page
 * let destination: PdfDestination = new PdfDestination(secondPage)
 * // Create a new PdfGoToAction with the specified destination
 * let gotoAction: PdfGoToAction = new PdfGoToAction(destination);
 * // Get the GoTo action to the mouse enter property of the button field
 * let pdfAction: PdfAction = field.actions.mouseEnter;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 */
export class PdfAction {
    /**
     * Holds the underlying PDF dictionary for the action.
     *
     * @private
     */
    _dictionary: _PdfDictionary;
    /**
     * Holds the page associated with the action (used for destinations).
     *
     * @private
     */
    _page: PdfPage;
    /**
     * Reference to the next action to be executed.
     *
     * @private
     */
    _next: PdfAction;
    /**
     * Factory registry for action types.
     * Maps action type names (from PDF 'S' key) to action classes.
     *
     * @private
     */
    private static _actionFactoryRegistry: { [key: string]: new () => PdfAction } = {};
    /**
     * Initializes the internal action dictionary and type.
     *
     * @private
     * @returns {void} nothing.
     */
    _initialize(): void {
        this._dictionary = new _PdfDictionary();
        this._dictionary._currentObj = this;
        this._dictionary.update('Type', new _PdfName('Action'));
    }
    /**
     * Get the next action to be performed after the action represented by this instance.
     *
     * @returns {PdfAction} The next action to be executed.
     *
     * Represents an action which goes to a destination in the current document.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Access the page1
     * let Page1: PdfPage = document.getPage(1);
     * // Create a PdfGoToAction for navigating to the specified page.
     * let action: PdfGoToAction = new PdfGoToAction(page1);
     * // Set the destination page for the action
     * action.destination = new PdfDestination(secondPage);
     * // Set the GoTo action to the mouse enter property of the button field
     * field1.actions.mouseEnter = action1;
     * // Access the page
     * let page: PdfPage = document.getPage(2);
     * // Access button field
     * let field1: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Create a new GoTo action with the specified page
     * let gotoAction: PdfGoToAction = new PdfGoToAction(page);
     * // Set the next property
     * gotoAction.next = action;
     * // Set the GoTo action to the mouse enter property of the button field
     * field1.actions.mouseEnter = gotoAction;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     */
    get next(): PdfAction {
        if (!this._next && this._dictionary && this._dictionary.has('Next')) {
            const dictionary: _PdfDictionary = this._dictionary.get('Next') as _PdfDictionary;
            if (dictionary instanceof _PdfDictionary) {
                this._next = PdfAction._createActionFromDictionary(dictionary) as PdfAction;
            }
        }
        return this._next;
    }
    /**
     * Set the next action to be performed after the action represented by this instance.
     *
     * @param {PdfAction} value The next action to be executed.
     *
     * Represents an action which goes to a destination in the current document.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Access the page1
     * let Page1: PdfPage = document.getPage(1);
     * let action: PdfGoToAction = new PdfGoToAction(page1);
     * // Set the destination page for the action
     * action.destination = new PdfDestination(secondPage);
     * // Set the GoTo action to the mouse enter property of the button field
     * field1.actions.mouseEnter = action1;
     * // Access the third page
     * let page: PdfPage = document.getPage(2);
     * // Access button field
     * let field1: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Create a new GoTo action with the specified page
     * let gotoAction: PdfGoToAction = new PdfGoToAction(page);
     * // Set the next property
     * gotoAction.next = action;
     * // Set the GoTo action to the mouse enter property of the button field
     * field1.actions.mouseEnter = gotoAction;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     */
    set next(value: PdfAction) {
        this._next = value;
        if (value && value._dictionary) {
            this._dictionary.update('Next', value._dictionary);
            this._dictionary._updated = true;
        }
    }
    /**
     * Called before serialization to allow validation.
     * Subclasses can override to implement custom validation logic.
     *
     * @private
     * @returns {void} nothing.
     */
    _beginSave(): void {
        const self: { _validate?: () => void } = this as unknown as { _validate?: () => void };
        if (typeof self._validate === 'function') {
            self._validate();
        }
    }
    /**
     * Registers an action class in the factory registry.
     * Called by each action subclass to enable polymorphic deserialization.
     *
     * @private
     * @param {string} typeName The PDF action type name (e.g., 'URI', 'GoTo', 'Named')
     * @param {any} actionClass The action class constructor
     * @returns {void}
     */
    static _registerActionClass(typeName: string, actionClass: any): void { // eslint-disable-line
        PdfAction._actionFactoryRegistry[<string>typeName] = actionClass;
    }
    /**
     * Reconstructs an action instance from a dictionary by inspecting the action type.
     *
     * @private
     * @param {_PdfDictionary} dictionary The action dictionary
     * @returns {PdfAction} The reconstructed action of the appropriate type, or undefined if invalid
     */
    static _createActionFromDictionary(dictionary: _PdfDictionary): PdfAction {
        if (!(dictionary instanceof _PdfDictionary) || !dictionary.has('S')) {
            return undefined;
        }
        const actionType: _PdfName = dictionary.get('S') as _PdfName;
        if (!(actionType instanceof _PdfName) || !actionType.name) {
            return undefined;
        }
        const ActionClass: new () => PdfAction = PdfAction._actionFactoryRegistry[actionType.name];
        let action: PdfAction;
        if (ActionClass) {
            action = Object.create(ActionClass.prototype) as PdfAction;
        } else {
            action = Object.create(PdfAction.prototype) as PdfAction;
        }
        action._dictionary = dictionary;
        dictionary._currentObj = action;
        return action;
    }
}
/**
 * Represents an action that executes JavaScript in a PDF document.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a JavaScript action
 * let action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert("Button clicked");');
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'JavaScript', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Execute script';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfJavaScriptAction extends PdfAction {
    /**
     * Stores the JavaScript code associated with the action.
     *
     * @private
     */
    _script: string;
    /**
     * Initializes a new instance of the `PdfJavaScriptAction` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create a JavaScript action
     * let action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert("Button clicked");');
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'JavaScript', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.text = 'Execute script';
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} script The JavaScript code to execute.
     */
    constructor(script: string) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('JavaScript'));
        this.script = script;
    }
    /**
     * Gets the JavaScript code executed by the action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the JavaScript action
     * let action: PdfJavaScriptAction = field.actions.mouseUp as PdfJavaScriptAction;
     * // Get the JavaScript code
     * let script: string = action.script;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The JavaScript code executed by the action.
     */
    get script(): string {
        if (this._dictionary && this._dictionary.has('JS')) {
            return this._dictionary.get('JS') as string;
        }
        return undefined;
    }
    /**
     * Sets the JavaScript code executed by the action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the JavaScript action
     * let action: PdfJavaScriptAction = field.actions.mouseUp as PdfJavaScriptAction;
     * // Set the JavaScript code
     * action.script = 'app.alert("Updated script");';
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The JavaScript code to execute.
     */
    set script(value: string) {
        this._script = value;
        if (this._dictionary) {
            this._dictionary.update('JS', value);
            this._dictionary._updated = true;
        }
    }
    /**
     * Validates the JavaScript action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        const script: string = this.script;
        if (!script || script.trim() === '') {
            throw new Error(
                'PdfJavaScriptAction.script expected non-empty JavaScript code. Actual value: empty string.'
            );
        }
    }
}
PdfAction._registerActionClass('JavaScript', PdfJavaScriptAction);
/**
 * Represents an action that navigates to a destination in the current PDF document.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let firstPage: PdfPage = document.addPage();
 * let secondPage: PdfPage = document.addPage();
 * // Create a destination and GoTo action
 * let destination: PdfDestination = new PdfDestination(secondPage);
 * let action: PdfGoToAction = new PdfGoToAction(destination);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     firstPage, 'GoTo', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Go to page';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfGoToAction extends PdfAction {
    /**
     * Stores the destination to navigate to when the action is executed.
     *
     * @private
     */
    _destination: PdfDestination;
    /**
     * Initializes a new instance of the `PdfGoToAction` class with the specified destination.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let firstPage: PdfPage = document.addPage();
     * let secondPage: PdfPage = document.addPage();
     * // Create a destination and GoTo action
     * let destination: PdfDestination = new PdfDestination(secondPage);
     * let action: PdfGoToAction = new PdfGoToAction(destination);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     firstPage, 'GoTo', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfDestination} destination The destination to navigate to.
     */
    public constructor(destination: PdfDestination)
    /**
     * Initializes a new instance of the `PdfGoToAction` class with the specified page.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let firstPage: PdfPage = document.addPage();
     * let secondPage: PdfPage = document.addPage();
     * // Create a GoTo action for the second page
     * let action: PdfGoToAction = new PdfGoToAction(secondPage);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     firstPage, 'GoTo', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfPage} page The page to navigate to.
     */
    public constructor(page: PdfPage)
    public constructor(arg: PdfDestination | PdfPage) {
        super();
        this._initialize();
        if (arg instanceof PdfDestination) {
            this._destination = arg;
            this._page = arg.page;
        } else {
            this._page = arg;
            this._destination = new PdfDestination(arg, { x: 0, y: 0 });
        }
        this._dictionary.update('S', new _PdfName('GoTo'));
    }
    /**
     * Gets the destination to navigate to.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the GoTo action and destination
     * let action: PdfGoToAction = field.actions.mouseUp as PdfGoToAction;
     * let destination: PdfDestination = action.destination;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfDestination} The destination to navigate to.
     */
    get destination(): PdfDestination {
        if (!this._destination && this._dictionary && this._dictionary.has('D')) {
            const destinationHelper: _PdfDestinationHelper = new _PdfDestinationHelper(this._dictionary, 'D');
            this._destination = destinationHelper._obtainDestination();
            if (this._destination && this._destination.page) {
                this._page = this._destination.page;
            }
        }
        return this._destination;
    }
    /**
     * Sets the destination to navigate to.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let page: PdfPage = document.getPage(1);
     * // Get the button field and GoTo action
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * let action: PdfGoToAction = field.actions.mouseUp as PdfGoToAction;
     * // Set the destination
     * action.destination = new PdfDestination(page, { x: 0, y: 100 });
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfDestination} value The destination to navigate to.
     */
    set destination(value: PdfDestination) {
        this._destination = value;
        if (value && value.page) {
            this._page = value.page;
        }
    }
    /**
     * Writes the destination before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _beginSave(): void {
        this._writeDestination();
    }
    /**
     * Writes the destination array to the action dictionary.
     *
     * @private
     * @returns {void} Nothing.
     */
    _writeDestination(): void {
        if (!this._dictionary || !this._destination) {
            return;
        }
        const mode: PdfDestinationMode = this._destination.mode;
        if (mode !== PdfDestinationMode.location && mode !== PdfDestinationMode.fitToPage &&
            mode !== PdfDestinationMode.fitR && mode !== PdfDestinationMode.fitH) {
            return;
        }
        this._destination._initializePrimitive();
        if (this._destination._array.length > 1) {
            this._dictionary.update('D', this._destination._array);
        }
    }
}
PdfAction._registerActionClass('GoTo', PdfGoToAction);
/**
 * Represents actions to be performed as response to field events.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access button field
 * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
 * // Access the second page
 * let secondPage: PdfPage = document.getPage(2);
 * // Create a PdfDestination for the specified page
 * let destination: PdfDestination = new PdfDestination(secondPage)
 * // Create a new PdfGoToAction with the specified destination
 * let gotoAction: PdfGoToAction = new PdfGoToAction(destination);
 * // Get the pdf field actions
 * let fieldActions: PdfFieldActions = field.actions;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 */
export class PdfFieldActions {
    /**
     * Cached action invoked when the mouse enters the field.
     *
     * @private
     */
    _mouseEnter: PdfAction;
    /**
     * Cached action invoked when the mouse leaves the field.
     *
     * @private
     */
    _mouseLeave: PdfAction;
    /**
     * Cached action invoked on mouse button release within the field.
     *
     * @private
     */
    _mouseUp: PdfAction;
    /**
     * Cached action invoked on mouse button press within the field.
     *
     * @private
     */
    _mouseDown: PdfAction;
    /**
     * Cached action invoked when the field receives focus.
     *
     * @private
     */
    _gotFocus: PdfAction;
    /**
     * Cached action invoked when the field loses focus.
     *
     * @private
     */
    _lostFocus: PdfAction;
    /**
     * Back-reference to the owning actions collection.
     *
     * @private
     */
    _field: PdfField;
    /**
     * Cached JavaScript action for per-keystroke validation.
     *
     * @private
     */
    _actions: PdfFieldActions;
    /**
     * Cached JavaScript action for field formatting.
     *
     * @private
     */
    _keyPressed: PdfJavaScriptAction;
    /**
     * Cached JavaScript action for field formatting.
     *
     * @private
     */
    _format: PdfJavaScriptAction;
    /**
     * Cached JavaScript action for field value validation.
     *
     * @private
     */
    _validate: PdfJavaScriptAction;
    /**
     * Cached JavaScript action executed when a page is opened.
     *
     * @private
     */
    _pageOpen: PdfJavaScriptAction;
    /**
     * Cached JavaScript action executed when a page is closed.
     *
     * @private
     */
    _pageClose: PdfJavaScriptAction;
    /**
     * Cached JavaScript action executed when a page becomes visible.
     *
     * @private
     */
    _pageVisible: PdfJavaScriptAction;
    /**
     * Cached JavaScript action executed when a page becomes invisible.
     *
     * @private
     */
    _pageInvisible: PdfJavaScriptAction;
    /**
     * Cached JavaScript action executed for field calculation.
     *
     * @private
     */
    _calculate: PdfJavaScriptAction;
    /**
     * Initializes a new instance of the `PdfFieldActions` class.
     *
     * @private
     * @param {PdfField} field field items.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Access the second page
     * let secondPage: PdfPage = document.getPage(2);
     * // Create a PdfDestination for the specified page
     * let destination: PdfDestination = new PdfDestination(secondPage)
     * // Creates a new PdfGoToAction with the specified destination
     * let gotoAction: PdfGoToAction = new PdfGoToAction(destination);
     * // Set the goto action to the button
     * field.actions.mouseEnter = gotoAction;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     */
    public constructor(field: PdfField) {
        this._field = field;
    }
    /**
     * Get the action to be performed when the mouse cursor enters the field area.
     *
     * @returns {PdfAction} The action to be executed when the mouse enters the field area.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the action to be executed when the mouse enters the field area
     * let action: PdfAction = field.actions.mouseEnter;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get mouseEnter(): PdfAction {
        if (!this._mouseEnter) {
            this._mouseEnter = this._getPdfAction('E');
        }
        return this._mouseEnter;
    }
    /**
     * Set the action to be performed when the mouse cursor enters the field area.
     *
     * @param {PdfAction} value The action to be executed when the mouse enters the field area.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Access the second page
     * let secondPage: PdfPage = document.getPage(2);
     * // Create a new GoTo action with the specified page
     * let gotoAction: PdfGoToAction = new PdfGoToAction(secondPage);
     * // Set the destination location within the specified page for the PdfGoToAction
     * gotoAction.Destination = new PdfDestination(secondPage, {x: 0, y: 100});
     * // Set the GoTo action to the mouse enter property of the button field
     * field.actions.mouseEnter = gotoAction;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     */
    set mouseEnter(value: PdfAction) {
        if (value) {
            this._mouseEnter = value;
            this._updateAction(this._mouseEnter, 'E');
        }
    }
    /**
     * Get the action to be performed when the cursor exits the fields area.
     *
     * @returns {PdfAction} The action to be executed when the mouse exists the field area.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the action to be executed when the mouse leave the field area.
     * let action: PdfAction = field.actions.mouseLeave;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get mouseLeave(): PdfAction {
        if (!this._mouseLeave) {
            this._mouseLeave = this._getPdfAction('X');
        }
        return this._mouseLeave;
    }
    /**
     * Set the action to be performed when the cursor exits the fields area.
     *
     * @param {PdfAction} value The action to be executed when the mouse exists the field area.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Access the second page
     * let secondPage: PdfPage = document.getPage(2);
     * // Create a new GoTo action with the specified page
     * let gotoAction: PdfGoToAction = new PdfGoToAction(secondPage);
     * // Set the destination location within the specified page for the PdfGoToAction
     * gotoAction.Destination = new PdfDestination(secondPage, {x: 0, y: 100});
     * // Set the GoTo action to the mouse leave property of the button field
     * field.actions.mouseLeave = gotoAction;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     */
    set mouseLeave(value: PdfAction) {
        if (value) {
            this._mouseLeave = value;
            this._updateAction(this._mouseLeave, 'X');
        }
    }
    /**
     * Get the action to be performed when the mouse button is released inside the field area.
     *
     * @returns {PdfAction} The action to be executed when the mouse released inside the field area.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the action to be executed when the mouse up the field area.
     * let action: PdfAction = field.actions.mouseUp;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get mouseUp(): PdfAction {
        if (!this._mouseUp) {
            this._mouseUp = this._getPdfAction('U');
        }
        return this._mouseUp;
    }
    /**
     * Set the action to be performed when the mouse button is released inside the field area.
     *
     * @param {PdfAction} value The action to be executed when the mouse released inside the field area.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Access the second page
     * let secondPage: PdfPage = document.getPage(2);
     * // Create a new GoTo action with the specified page
     * let gotoAction: PdfGoToAction = new PdfGoToAction(secondPage);
     * // Set the destination location within the specified page for the PdfGoToAction
     * gotoAction.Destination = new PdfDestination(secondPage, {x: 0, y: 100});
     * // Set the GoTo action to the mouse up property of the button field
     * field.actions.mouseUp = gotoAction;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     */
    set mouseUp(value: PdfAction) {
        if (value) {
            this._mouseUp = value;
            this._updateAction(this._mouseUp, 'U');
        }
    }
    /**
     * Get the action to be performed when the mouse button is pressed inside the field's area.
     *
     * @returns {PdfAction} The action to be executed when the mouse button is pressed inside the field area.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the action to be executed when the mouse down the field area.
     * let action: PdfAction = field.actions.mouseDown;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get mouseDown(): PdfAction {
        if (!this._mouseDown) {
            this._mouseDown = this._getPdfAction('D');
        }
        return this._mouseDown;
    }
    /**
     * Set the action to be performed when the mouse button is pressed inside the field's area.
     *
     * @param {PdfAction} value The action to be executed when the mouse button is pressed inside the field area.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Access the second page
     * let secondPage: PdfPage = document.getPage(2);
     * // Create a new GoTo action with the specified page
     * let gotoAction: PdfGoToAction = new PdfGoToAction(secondPage);
     * // Set the destination location within the specified page for the PdfGoToAction
     * gotoAction.Destination = new PdfDestination(secondPage, {x: 0, y: 100});
     * // Set the GoTo action to the mouse down property of the button field
     * field.actions.mouseDown = gotoAction;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     */
    set mouseDown(value: PdfAction) {
        if (value) {
            this._mouseDown = value;
            this._updateAction(this._mouseDown, 'D');
        }
    }
    /**
     * Get the action to be performed when the field receives the input focus.
     *
     * @returns {PdfAction} The action to be executed when the field receives the input focus.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the action to be executed when the got focus the field area.
     * let action: PdfAction = field.actions.gotFocus;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get gotFocus(): PdfAction {
        if (!this._gotFocus) {
            this._gotFocus = this._getPdfAction('Fo');
        }
        return this._gotFocus;
    }
    /**
     * Set the action to be performed when the field receives the input focus.
     *
     * @param {PdfAction} value The action to be executed when the field receives the input focus.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Access the second page
     * let secondPage: PdfPage = document.getPage(2);
     * // Create a new GoTo action with the specified page
     * let gotoAction: PdfGoToAction = new PdfGoToAction(secondPage);
     * // Set the destination location within the specified page for the PdfGoToAction
     * gotoAction.Destination = new PdfDestination(secondPage, {x: 0, y: 100});
     * // Set the GoTo action to the got focus property of the button field
     * field.actions.gotFocus = gotoAction;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     */
    set gotFocus(value: PdfAction) {
        if (value) {
            this._gotFocus = value;
            this._updateAction(this._gotFocus, 'Fo');
        }
    }
    /**
     * Get the action to be performed when the field loses the input focus.
     *
     * @returns {PdfAction} The action to be executed when the field loses the input focus.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the action to be executed when the lost focus the field area.
     * let action: PdfAction = field.actions.lostFocus;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get lostFocus(): PdfAction {
        if (!this._lostFocus) {
            this._lostFocus = this._getPdfAction('Bl');
        }
        return this._lostFocus;
    }
    /**
     * Set the action to be performed when the field loses the input focus.
     *
     * @param {PdfAction} value The action to be executed when the field loses the input focus.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Access the second page
     * let secondPage: PdfPage = document.getPage(2);
     * // Create a new GoTo action with the specified page
     * let gotoAction: PdfGoToAction = new PdfGoToAction(secondPage);
     * // Set the destination location within the specified page for the PdfGoToAction
     * gotoAction.Destination = new PdfDestination(secondPage, {x: 0, y: 100});
     * // Set the GoTo action to the lost focus property of the button field
     * field.actions.lostFocus = gotoAction;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     */
    set lostFocus(value: PdfAction) {
        if (value) {
            this._lostFocus = value;
            this._updateAction(this._lostFocus, 'Bl');
        }
    }
    /**
     * Gets the JavaScript action run on each keystroke in a text field to validate or modify it.
     *
     * @returns {PdfJavaScriptAction} A `PdfJavaScriptAction` object specifying the action to be executed when the user types a keystroke.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Retrieve the JavaScript action associated with the key-press event of the field.
     * let action: PdfJavaScriptAction = field.actions.keyPressed;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get keyPressed(): PdfJavaScriptAction {
        if (!this._keyPressed) {
            this._keyPressed = this._getFieldAction('K');
        }
        return this._keyPressed;
    }
    /**
     *Sets the JavaScript action run on each keystroke in a text field to validate or modify it.
     *
     *@param {PdfJavaScriptAction} value A `PdfJavaScriptAction` object specifying the action to be executed when the user types a keystroke.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Assign a JavaScript action to validate the date format ('dd/mm/yyyy') during key-press.
     * field.actions.keyPressed = new PdfJavaScriptAction("AFDate_KeystrokeEx('dd/mm/yyyy')");
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set keyPressed(value: PdfJavaScriptAction) {
        if (value) {
            this._keyPressed = value;
            this._updateFieldAction(this._keyPressed, 'K');
        }
    }
    /**
     * Gets the JavaScript action executed before the field value is formatted.
     *
     * @returns {PdfJavaScriptAction} A `PdfJavaScriptAction` object specifying the action to be executed before the field value is formatted.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Retrieve the JavaScript action that is assigned to the field's format event.
     * let action: PdfJavaScriptAction = field.actions.format;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get format(): PdfJavaScriptAction {
        if (!this._format) {
            this._format = this._getFieldAction('F');
        }
        return this._format;
    }
    /**
     * Sets the JavaScript action executed before the field value is formatted.
     *
     * @param {PdfJavaScriptAction} value A `PdfJavaScriptAction` object specifying the action to be executed before the field value is formatted.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Assign a JavaScript format action to apply the 'dd/mm/yyyy' date formatting to the field.
     * field.actions.format = new PdfJavaScriptAction("AFDate_FormatEx('dd/mm/yyyy')");
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set format(value: PdfJavaScriptAction) {
        if (value) {
            this._format = value;
            this._updateFieldAction(this._format, 'F');
        }
    }
    /**
     * Gets the JavaScript action triggered when the field value changes for validation.
     *
     * @returns {PdfJavaScriptAction} A `PdfJavaScriptAction` object specifying the action to be executed when the field value changes for validation.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Retrieve the JavaScript action assigned to the field's validate event.
     * let action: PdfJavaScriptAction = field.actions.validate;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get validate(): PdfJavaScriptAction {
        if (!this._validate) {
            this._validate = this._getFieldAction('V');
        }
        return this._validate;
    }
    /**
     * set the Java script action to the field for keyPressed.
     *
     * @param {PdfJavaScriptAction} value The action to be executed when the field is KeyPressed.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Set the JavaScript action that validates the field value using the 'dd/mm/yyyy' date format.
     * field.actions.validate = new PdfJavaScriptAction("AFDate_ValidateEx('dd/mm/yyyy')");
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set validate(value: PdfJavaScriptAction) {
        if (value) {
            this._validate = value;
            this._updateFieldAction(this._validate, 'V');
        }
    }
    /**
     * Gets the JavaScript action executed when the field value is calculated.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Get the JavaScript action assigned to the calculate event
     * let action: PdfJavaScriptAction = field.actions.calculate;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfJavaScriptAction} The JavaScript action executed when the field value is calculated.
     */
    get calculate(): PdfJavaScriptAction {
        if (!this._calculate) {
            this._calculate = this._getFieldAction('C');
        }
        return this._calculate;
    }
    /**
     * Sets the JavaScript action executed when the field value is calculated.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the text box field
     * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
     * // Assign a JavaScript action to the calculate event
     * field.actions.calculate = new PdfJavaScriptAction('event.value = 10 + 20;');
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfJavaScriptAction} value The JavaScript action to execute when the field value is calculated.
     */
    set calculate(value: PdfJavaScriptAction) {
        if (value) {
            this._calculate = value;
            this._updateFieldAction(this._calculate, 'C');
        }
    }
    /**
     * Updates the field or widget with the specified action.
     *
     * @private
     * @param {PdfAction} action Action to associate with the field event.
     * @param {string} key Additional-action dictionary key.
     * @returns {void} nothing.
     */
    _updateAction(action: PdfAction, key: string): void {
        if (this._field && this._field._dictionary && action && key) {
            const fieldDictionary: _PdfDictionary = this._field._dictionary;
            let targetDictionary: _PdfDictionary = fieldDictionary;
            if (this._field._kidsCount && this._field._kidsCount > 0) {
                const widget: PdfWidgetAnnotation = this._field.itemAt(0);
                if (widget && widget._dictionary instanceof _PdfDictionary) {
                    targetDictionary = widget._dictionary;
                }
            }
            let aaDictionary: _PdfDictionary = targetDictionary.get('AA') as _PdfDictionary;
            if (!(aaDictionary instanceof _PdfDictionary)) {
                aaDictionary = new _PdfDictionary();
                targetDictionary.update('AA', aaDictionary);
            }
            if (action instanceof PdfGoToAction && action._page &&
                action._dictionary) {
                action._writeDestination();
            }
            if (action._dictionary && !action._dictionary._crossReference) {
                action._dictionary._crossReference = targetDictionary._crossReference;
            }
            aaDictionary.update(key, action._dictionary);
            aaDictionary._updated = true;
            targetDictionary._updated = true;
        }
    }
    /**
     * Gets an action from the widget or field additional-actions dictionary.
     *
     * @private
     * @param {string} key Additional-action key.
     * @returns {PdfAction} The resolved action.
     */
    _getPdfAction(key: string): PdfAction {
        if (!this._field) {
            return undefined;
        }
        let targetDictionary: _PdfDictionary = this._field._dictionary;
        let aaDictionary: _PdfDictionary;
        if (this._field._kidsCount && this._field._kidsCount > 0) {
            const widget: PdfWidgetAnnotation = this._field.itemAt(0);
            if (widget && widget._dictionary instanceof _PdfDictionary &&
                widget._dictionary.has('AA')) {
                targetDictionary = widget._dictionary;
                aaDictionary = widget._dictionary.get('AA') as _PdfDictionary;
            }
        }
        if (!aaDictionary && this._field._dictionary && this._field._dictionary.has('AA')) {
            targetDictionary = this._field._dictionary;
            aaDictionary = this._field._dictionary.get('AA') as _PdfDictionary;
        }
        if (!(aaDictionary instanceof _PdfDictionary)) {
            return undefined;
        }
        const dictionary: _PdfDictionary = aaDictionary.get(key) as _PdfDictionary;
        if (!(dictionary instanceof _PdfDictionary) || !dictionary.has('S')) {
            return undefined;
        }
        const actionType: _PdfName = dictionary.get('S') as _PdfName;
        if (actionType instanceof _PdfName && actionType.name === 'GoTo' && !dictionary.has('D')) {
            return undefined;
        }
        (dictionary as any)._parentDictionary = targetDictionary;  // eslint-disable-line
        dictionary.assignXref( targetDictionary._crossReference);
        if (!dictionary._crossReference &&
            this._field.itemAt) {
            const widget: PdfWidgetAnnotation = this._field.itemAt(0);
            if (widget) {
                dictionary._crossReference = widget._crossReference;
            }
        }
        return PdfAction._createActionFromDictionary(dictionary);
    }
    /**
     * Creates or updates the field's additional actions dictionary with the JavaScript action for the given key.
     *
     * @private
     * @param {PdfJavaScriptAction} action JavaScript action to associate with the field.
     * @param {string} key Additional action key to set.
     * @returns {void} nothing.
     */
    _updateFieldAction(action: PdfJavaScriptAction, key: string): void {
        if (this._field && this._field._dictionary && action && key && action._dictionary !== undefined) {
            const fieldDictionary: _PdfDictionary = this._field._dictionary;
            let aaDictionary: any = fieldDictionary.get('AA') as _PdfDictionary; // eslint-disable-line
            if (!aaDictionary || !(aaDictionary instanceof _PdfDictionary)) {
                aaDictionary = new _PdfDictionary();
                fieldDictionary.update('AA', aaDictionary);
            }
            const actionDictionary: _PdfDictionary = action._dictionary;
            const script: string = action._script;
            if (script) {
                actionDictionary.update('JS', script);
            }
            aaDictionary.update(key, actionDictionary);
            (aaDictionary as any)[key] = actionDictionary; // eslint-disable-line
            actionDictionary._updated = true;
            aaDictionary._updated = true;
            fieldDictionary._updated = true;
            fieldDictionary.update('AA', aaDictionary);
        }
    }
    /**
     * Clears a JavaScript action from the field's additional actions dictionary.
     *
     * @private
     * @param {string} key Additional action key to clear.
     * @returns {void} nothing.
     */
    _clearFieldAction(key: string): void {
        if (this._field && this._field._dictionary && key) {
            const fieldDictionary: _PdfDictionary = this._field._dictionary;
            if (fieldDictionary.has('AA')) {
                const aaDictionary: _PdfDictionary = fieldDictionary.get('AA') as _PdfDictionary;
                if (aaDictionary && aaDictionary instanceof _PdfDictionary && aaDictionary.has(key)) {
                    delete aaDictionary._map[<string>key];
                    aaDictionary._updated = true;
                    fieldDictionary._updated = true;
                }
            }
        }
    }
    /**
     * Gets a JavaScript action from the field additional-actions dictionary.
     *
     * @private
     * @param {string} key The additional-action key.
     * @returns {PdfJavaScriptAction} The resolved JavaScript action, or `undefined` when unavailable.
     */
    _getFieldAction(key: string): PdfJavaScriptAction {
        let result: PdfJavaScriptAction;
        if (this._field && this._field._dictionary && key) {
            const fieldDictionary: _PdfDictionary = this._field._dictionary;
            if (fieldDictionary.has('AA')) {
                const aaDictionary: _PdfDictionary = fieldDictionary.get('AA') as _PdfDictionary;
                if (aaDictionary instanceof _PdfDictionary && aaDictionary.has(key)) {
                    const actionDictionary: _PdfDictionary = aaDictionary.get(key) as _PdfDictionary;
                    if (actionDictionary instanceof _PdfDictionary && actionDictionary.has('S') &&
                        actionDictionary.has('JS')) {
                        const action: PdfAction = PdfAction._createActionFromDictionary(actionDictionary);
                        if (action instanceof PdfJavaScriptAction) {
                            (actionDictionary as any)._parentDictionary = fieldDictionary; // eslint-disable-line
                            result = action;
                        }
                    }
                }
            }
        }
        return result;
    }
}
