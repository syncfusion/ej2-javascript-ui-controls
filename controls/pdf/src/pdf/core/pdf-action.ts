import { PdfWidgetAnnotation } from './annotations/annotation';
import { PdfDestinationMode } from './enumerator';
import { PdfField } from './form/field';
import { _PdfDestinationHelper, PdfDestination, PdfPage } from './pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from './pdf-primitives';
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
     * Initializes the internal action dictionary and type.
     *
     * @private
     * @returns {void} nothing.
     */
    _initialize(): void {
        this._dictionary = new _PdfDictionary();
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
        const reference: _PdfReference = this._page._crossReference._getNextReference();
        this._page._crossReference._cacheMap.set(reference, value._dictionary);
        value._dictionary.objId = reference.toString();
        this._dictionary.update('Next', reference);
    }
}
/**
 * Represents a JavaScript action in PDF document.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access text box field
 * let field: PdfTextBoxField = document.form.fieldAt(0) as PdfTextBoxField;
 * // Create a new `PdfJavaScriptAction` for adding the action
 * field.actions.keyPressed = new PdfJavaScriptAction('AFDate_KeystrokeEx("m/d/yy")');
 * field.actions.format = new PdfJavaScriptAction('AFDate_FormatEx("m/d/yy")');
 * field.actions.validate = new PdfJavaScriptAction('AFDate_Validate("m/d/yy")');
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 */
export class PdfJavaScriptAction extends PdfAction {
    /**
     * Stores the JavaScript source associated with the action.
     *
     * @private
     */
    _script: string;
    /**
     * Initializes a new instance of the `PdfJavaScriptAction` class with JavaScript code.
     *
     * @param {string} script - A string value representing valid JavaScript code to be executed.
     */
    constructor(script: string) {
        super();
        this._initialize();
        this._script = script;
        this._dictionary.update('S', new _PdfName('JavaScript'));
    }
    /**
     * Gets the JavaScript code to be executed when this action is executed.
     *
     * @returns {string} A string value representing valid JavaScript code to be executed.
     */
    get script(): string {
        return this._script;
    }
    /**
     * Sets the JavaScript code to be executed when this action is executed.
     *
     * @param {string} value A string value representing valid JavaScript code to be executed.
     */
    set script(value: string) {
        this._script = value;
    }
}
/**
 * Represents an action which goes to a destination in the current document.
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
 * // Set the goto action to the button
 * field.actions.mouseEnter = gotoAction;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 */
export class PdfGoToAction extends PdfAction {
    /**
     * Destination to navigate to when the action is executed.
     *
     * @private
     */
    _destination: PdfDestination;
    /**
     * Initializes a new instance of the `PdfGoToAction` class.
     *
     * @param {PdfDestination} destination Destination to navigate.
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
     * // Set the GoTo action to the mouse enter property of the button field
     * field.actions.mouseEnter = gotoAction;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     */
    public constructor(destination: PdfDestination)
    /**
     * Initializes a new instance of the `PdfGoToAction` class.
     *
     * @param {PdfPage} page page to navigate.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Access the page
     * let page: PdfPage = document.getPage(2);
     * // Create a new GoTo action with the specified page
     * let gotoAction: PdfGoToAction = new PdfGoToAction(page);
     * // Set the destination for specified page
     * gotoAction.destination = new PdfDestination(page);
     * // Set the goto action to the button
     * field.actions.mouseEnter = gotoAction;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
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
            this._destination = new PdfDestination(arg, {x: 0, y: 0});
        }
        this._dictionary.update('S', new _PdfName('GoTo'));
    }
    /**
     * Get the destination to be navigated.
     *
     * @returns {PdfDestination} The destination to be navigated.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the action value from button field
     * let action: PdfAction = field.actions.mouseEnter.destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get destination(): PdfDestination {
        return this._destination;
    }
    /**
     * Set the destination to be navigated.
     *
     * @param {PdfDestination} value The destination to be navigated.
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
     * // Set the goto action to the button
     * field.actions.mouseEnter = gotoAction;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     */
    set destination(value: PdfDestination) {
        this._destination = value;
    }
}
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
     * Updates the widget annotation with the specified action under the given additional-actions key.
     *
     * @private
     * @param {PdfAction} action Action instance to associate with the widget.
     * @param {string} key Additional action key.
     * @returns {void} nothing.
     */
    _updateAction(action: PdfAction, key: string): void {
        let widget: PdfWidgetAnnotation;
        if (this._field._kidsCount > 0) {
            widget = this._field.itemAt(0);
            if (widget && widget._dictionary && action instanceof PdfGoToAction) {
                const dictionary: _PdfDictionary = new _PdfDictionary();
                const page: PdfPage = action._page;
                const destination: PdfDestination = action.destination;
                if (destination._destinationMode === PdfDestinationMode.location) {
                    action._dictionary.update('D', [page._ref, new _PdfName('XYZ'), destination.location.x, page.size.height, destination.zoom]);
                } else if (destination._destinationMode === PdfDestinationMode.fitR) {
                    action._dictionary.update('D', [page._ref, new _PdfName('FitR'), 0, 0, 0, 0]);
                } else if (destination._destinationMode === PdfDestinationMode.fitH) {
                    action._dictionary.update('D', [page._ref, new _PdfName('FitH'), page.size.height]);
                } else if (destination._destinationMode === PdfDestinationMode.fitToPage) {
                    action._dictionary.update('D', [page._ref, new _PdfName('Fit')]);
                }
                dictionary.set(key, action._dictionary);
                dictionary._updated = true;
                widget._dictionary.update('AA', dictionary);
            }
        }
    }
    /**
     * Retrieves a GoTo action from the widget's additional actions using the specified key.
     *
     * @private
     * @param {string} key Additional action key to look up.
     * @returns {PdfAction} The resolved `PdfGoToAction` if available; otherwise, `undefined`.
     */
    _getPdfAction(key: string): PdfAction {
        let result: PdfGoToAction;
        const widget: PdfWidgetAnnotation = this._field.itemAt(0);
        if (widget && widget._dictionary && widget._dictionary.has('AA')) {
            const action: _PdfDictionary = widget._dictionary.get('AA');
            if (action && action.has(key)) {
                const dictionary: _PdfDictionary = action.get(key);
                if (dictionary && dictionary.has('S')) {
                    const type: _PdfName = dictionary.get('S');
                    if (type && type.name === 'GoTo' && dictionary.has('D')) {
                        if (!dictionary._crossReference) {
                            dictionary._crossReference = widget._crossReference;
                        }
                        const destinationHelper: _PdfDestinationHelper = new _PdfDestinationHelper(dictionary, 'D');
                        result = new PdfGoToAction(destinationHelper._obtainDestination());
                    }
                }
            }
        }
        return result;
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
        if (this._field && this._field._dictionary && action && key) {
            const fieldDictionary: _PdfDictionary = this._field._dictionary;
            let aaDictionary: _PdfDictionary = fieldDictionary.get('AA') as _PdfDictionary;
            if (!aaDictionary || !(aaDictionary instanceof _PdfDictionary)) {
                aaDictionary = new _PdfDictionary();
                fieldDictionary.update('AA', aaDictionary);
            }
            const actionDictionary: _PdfDictionary = action._dictionary;
            const script: string = action._script;
            if (script && script !== '') {
                actionDictionary.update('JS', script);
            }
            aaDictionary.set(key, actionDictionary);
            actionDictionary._updated = true;
            aaDictionary._updated = true;
            fieldDictionary._updated = true;
            fieldDictionary.update('AA', aaDictionary);
        }
    }
    /**
     * Retrieves a JavaScript action from the field's additional actions dictionary using the specified key.
     *
     * @private
     * @param {string} key Additional action key to look up.
     * @returns {PdfJavaScriptAction} The resolved JavaScript action if available; otherwise, `undefined`.
     */
    _getFieldAction(key: string): PdfJavaScriptAction {
        let result: PdfJavaScriptAction;
        if (this._field && this._field._dictionary && key) {
            const fieldDictionary: _PdfDictionary = this._field._dictionary;
            if (fieldDictionary.has('AA')) {
                const aaDictionary: _PdfDictionary = fieldDictionary.get('AA') as _PdfDictionary;
                if (aaDictionary && aaDictionary instanceof _PdfDictionary && aaDictionary.has(key)) {
                    const actionDictionary: _PdfDictionary = aaDictionary.get(key) as _PdfDictionary;
                    if (actionDictionary && actionDictionary instanceof _PdfDictionary && actionDictionary.has('S')) {
                        const s: _PdfName = actionDictionary.get('S') as _PdfName;
                        if (s && s.name === 'JavaScript' && actionDictionary.has('JS')) {
                            const js: string = actionDictionary.get('JS');
                            result = new PdfJavaScriptAction('');
                            result._dictionary = actionDictionary;
                            result._script = js;
                        }
                    }
                }
            }
        }
        return result;
    }
}
