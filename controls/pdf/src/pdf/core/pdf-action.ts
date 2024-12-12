import { PdfWidgetAnnotation } from './annotations/annotation';
import { PdfDestinationMode } from './enumerator';
import { PdfField } from './form';
import { PdfDestination, PdfPage } from './pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from './pdf-primitives';
import { _obtainDestination } from './utils';
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
    _dictionary: _PdfDictionary;
    _page: PdfPage;
    _next: PdfAction;
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
    constructor(destination: PdfDestination)
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
    constructor(page: PdfPage)
    constructor(arg: PdfDestination | PdfPage) {
        super();
        if (arg instanceof PdfDestination) {
            this._destination = arg;
            this._page = arg.page;
        } else {
            this._page = arg;
            this._destination = new PdfDestination(arg, [0, 0]);
        }
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('Type', new _PdfName('Action'));
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
     * gotoAction.Destination = new PdfDestination(secondPage, [0, 100]);
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
    _mouseEnter: PdfAction;
    _mouseLeave: PdfAction;
    _mouseUp: PdfAction;
    _mouseDown: PdfAction;
    _gotFocus: PdfAction;
    _lostFocus: PdfAction;
    _field: PdfField;
    _actions : PdfFieldActions;
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
    constructor(field: PdfField) {
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
     * gotoAction.Destination = new PdfDestination(secondPage, [0, 100]);
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
     * gotoAction.Destination = new PdfDestination(secondPage, [0, 100]);
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
     * gotoAction.Destination = new PdfDestination(secondPage, [0, 100]);
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
     * Get the action to be performed when the mouse button is pressed inside the field’s area.
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
     * Set the action to be performed when the mouse button is pressed inside the field’s area.
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
     * gotoAction.Destination = new PdfDestination(secondPage, [0, 100]);
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
     * gotoAction.Destination = new PdfDestination(secondPage, [0, 100]);
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
     * gotoAction.Destination = new PdfDestination(secondPage, [0, 100]);
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
    _updateAction(action: PdfAction, key: string): void {
        let widget: PdfWidgetAnnotation;
        if (this._field._kidsCount > 0) {
            widget = this._field.itemAt(0);
            if (widget && widget._dictionary && action instanceof PdfGoToAction) {
                const dictionary: _PdfDictionary = new _PdfDictionary();
                const page: PdfPage = action._page;
                const destination: PdfDestination = action.destination;
                if (destination._destinationMode === PdfDestinationMode.location) {
                    action._dictionary.update('D', [page._ref, new _PdfName('XYZ'), destination.location[0], page.size[1], destination.zoom]);
                } else if (destination._destinationMode === PdfDestinationMode.fitR) {
                    action._dictionary.update('D', [page._ref, new _PdfName('FitR'), 0, 0, 0, 0]);
                } else if (destination._destinationMode === PdfDestinationMode.fitH) {
                    action._dictionary.update('D', [page._ref, new _PdfName('FitH'), page.size[1]]);
                } else if (destination._destinationMode === PdfDestinationMode.fitToPage) {
                    action._dictionary.update('D', [page._ref, new _PdfName('Fit')]);
                }
                dictionary.set(key, action._dictionary);
                dictionary._updated = true;
                widget._dictionary.update('AA', dictionary);
            }
        }
    }
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
                        result = new PdfGoToAction(_obtainDestination(dictionary, 'D'));
                    }
                }
            }
        }
        return result;
    }
}
