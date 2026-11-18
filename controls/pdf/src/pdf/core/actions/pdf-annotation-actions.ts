import { PdfAnnotation } from '../annotations/annotation';
import { PdfAction } from '../pdf-action';
import { _PdfDictionary } from '../pdf-primitives';
/**
 * Represents actions associated with annotation events in a PDF document.
 *
 * ```typescript
 * // Create a new PDF document
 * const document: PdfDocument = new PdfDocument();
 * // Add a page to the document
 * const page: PdfPage = document.addPage();
 * // Create a rectangle annotation
 * const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 20, y: 20, width: 150, height: 60 });
 * // Create a JavaScript action
 * const action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert('Pointer entered the annotation');');
 * // Assign the action to the annotation mouse-enter event
 * annotation.actions.mouseEnter = action;
 * // Add the annotation to the page
 * page.annotations.add(annotation);
 * // Save the PDF document
 * document.save('output.pdf');
 * // Destroy the PDF document
 * document.destroy();
 * ```
 */
export class PdfAnnotationActions {
    /**
     * Stores the annotation associated with this action collection.
     *
     * @private
     */
    private _annotation: PdfAnnotation;
    /**
     * Stores the action executed when the pointer enters the annotation.
     *
     * @private
     */
    private _mouseEnter: PdfAction;
    /**
     * Stores the action executed when the pointer leaves the annotation.
     *
     * @private
     */
    private _mouseLeave: PdfAction;
    /**
     * Stores the action executed when the mouse button is released.
     *
     * @private
     */
    private _mouseUp: PdfAction;
    /**
     * Stores the action executed when the mouse button is pressed.
     *
     * @private
     */
    private _mouseDown: PdfAction;
    /**
     * Stores the action executed when the annotation receives focus.
     *
     * @private
     */
    private _gotFocus: PdfAction;
    /**
     * Stores the action executed when the annotation loses focus.
     *
     * @private
     */
    private _lostFocus: PdfAction;
    /**
     * Initializes actions for the specified annotation.
     *
     * @private
     * @param {PdfAnnotation} annotation The annotation associated with the action collection.
     */
    constructor(annotation: PdfAnnotation) {
        this._annotation = annotation;
    }
    /**
     * Gets the action performed when the cursor enters the annotation.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * const page: PdfPage = document.addPage();
     * // Create a rectangle annotation
     * const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 20, y: 20, width: 150, height: 60 });
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert('Pointer entered the annotation');');
     * // Assign the action to the annotation mouse-enter event
     * annotation.actions.mouseEnter = action;
     * // Add the annotation to the page
     * page.annotations.add(annotation);
     * // Get the action assigned to the mouse-enter event
     * const mouseEnterAction: PdfAction = annotation.actions.mouseEnter;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @returns {PdfAction} The action performed when the cursor enters the annotation.
     */
    public get mouseEnter(): PdfAction {
        if (!this._mouseEnter) {
            this._mouseEnter = this._getAction('E');
        }
        return this._mouseEnter;
    }
    /**
     * Sets the action performed when the cursor enters the annotation.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * const page: PdfPage = document.addPage();
     * // Create a rectangle annotation
     * const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 20, y: 20, width: 150, height: 60 });
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert('Pointer entered the annotation');');
     * // Assign the action to the annotation mouse-enter event
     * annotation.actions.mouseEnter = action;
     * // Add the annotation to the page
     * page.annotations.add(annotation);
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @param {PdfAction} value The action to perform when the cursor enters the annotation.
     */
    public set mouseEnter(value: PdfAction) {
        this._mouseEnter = value;
        this._setAction('E', value);
    }
    /**
     * Gets the action performed when the cursor leaves the annotation.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * const page: PdfPage = document.addPage();
     * // Create a rectangle annotation
     * const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 20, y: 20, width: 150, height: 60 });
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert('Pointer left the annotation');');
     * // Assign the action to the annotation mouse-leave event
     * annotation.actions.mouseLeave = action;
     * // Add the annotation to the page
     * page.annotations.add(annotation);
     * // Get the action assigned to the mouse-leave event
     * const mouseLeaveAction: PdfAction = annotation.actions.mouseLeave;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @returns {PdfAction} The action performed when the cursor leaves the annotation.
     */
    public get mouseLeave(): PdfAction {
        if (!this._mouseLeave) {
            this._mouseLeave = this._getAction('X');
        }
        return this._mouseLeave;
    }
    /**
     * Sets the action performed when the cursor leaves the annotation.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * const page: PdfPage = document.addPage();
     * // Create a rectangle annotation
     * const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 20, y: 20, width: 150, height: 60 });
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert('Pointer left the annotation');');
     * // Assign the action to the annotation mouse-leave event
     * annotation.actions.mouseLeave = action;
     * // Add the annotation to the page
     * page.annotations.add(annotation);
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @param {PdfAction} value The action to perform when the cursor leaves the annotation.
     */
    public set mouseLeave(value: PdfAction) {
        this._mouseLeave = value;
        this._setAction('X', value);
    }
    /**
     * Gets the action performed when the mouse button is released within the annotation.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * const page: PdfPage = document.addPage();
     * // Create a rectangle annotation
     * const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 20, y: 20, width: 150, height: 60 });
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert('Mouse button released');');
     * // Assign the action to the annotation mouse-up event
     * annotation.actions.mouseUp = action;
     * // Add the annotation to the page
     * page.annotations.add(annotation);
     * // Get the action assigned to the mouse-up event
     * const mouseUpAction: PdfAction = annotation.actions.mouseUp;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @returns {PdfAction} The action performed when the mouse button is released.
     */
    public get mouseUp(): PdfAction {
        if (!this._mouseUp) {
            this._mouseUp = this._getAction('U');
        }
        return this._mouseUp;
    }
    /**
     * Sets the action performed when the mouse button is released within the annotation.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * const page: PdfPage = document.addPage();
     * // Create a rectangle annotation
     * const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 20, y: 20, width: 150, height: 60 });
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert('Mouse button released');');
     * // Assign the action to the annotation mouse-up event
     * annotation.actions.mouseUp = action;
     * // Add the annotation to the page
     * page.annotations.add(annotation);
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @param {PdfAction} value The action to perform when the mouse button is released.
     */
    public set mouseUp(value: PdfAction) {
        this._mouseUp = value;
        this._setAction('U', value);
    }
    /**
     * Gets the action performed when the mouse button is pressed within the annotation.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * const page: PdfPage = document.addPage();
     * // Create a rectangle annotation
     * const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 20, y: 20, width: 150, height: 60 });
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert("Mouse button pressed");');
     * // Assign the action to the annotation mouse-down event
     * annotation.actions.mouseDown = action;
     * // Add the annotation to the page
     * page.annotations.add(annotation);
     * // Get the action assigned to the mouse-down event
     * const mouseDownAction: PdfAction = annotation.actions.mouseDown;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @returns {PdfAction} The action performed when the mouse button is pressed.
     */
    public get mouseDown(): PdfAction {
        if (!this._mouseDown) {
            this._mouseDown = this._getAction('D');
        }
        return this._mouseDown;
    }
    /**
     * Sets the action performed when the mouse button is pressed within the annotation.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * const page: PdfPage = document.addPage();
     * // Create a rectangle annotation
     * const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 20, y: 20, width: 150, height: 60 });
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert("Mouse button pressed");');
     * // Assign the action to the annotation mouse-down event
     * annotation.actions.mouseDown = action;
     * // Add the annotation to the page
     * page.annotations.add(annotation);
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @param {PdfAction} value The action to perform when the mouse button is pressed.
     */
    public set mouseDown(value: PdfAction) {
        this._mouseDown = value;
        this._setAction('D', value);
    }
    /**
     * Gets the action performed when the annotation receives focus.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * const page: PdfPage = document.addPage();
     * // Create a rectangle annotation
     * const annotation: PdfRectangleAnnotation = new PdfRectangleAnnotation({ x: 20, y: 20, width: 150, height: 60 });
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction = new PdfJavaScriptAction('app.alert('Annotation received focus');');
     * // Assign the action to the annotation focus event
     * annotation.actions.gotFocus = action;
     * // Add the annotation to the page
     * page.annotations.add(annotation);
     * // Get the action assigned to the focus event
     * const gotFocusAction: PdfAction = annotation.actions.gotFocus;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @returns {PdfAction} The action performed when the annotation receives focus.
     */
    public get gotFocus(): PdfAction {
        if (!this._gotFocus) {
            this._gotFocus = this._getAction('Fo');
        }
        return this._gotFocus;
    }
    /**
     * Sets the action performed when the annotation receives focus.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * const page: PdfPage = document.addPage();
     * // Create a rectangle annotation
     * const annotation: PdfRectangleAnnotation =
     *     new PdfRectangleAnnotation({ x: 20, y: 20, width: 150, height: 60 });
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction('app.alert("Annotation received focus");');
     * // Assign the action to the annotation focus event
     * annotation.actions.gotFocus = action;
     * // Add the annotation to the page
     * page.annotations.add(annotation);
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @param {PdfAction} value The action to perform when the annotation receives focus.
     */
    public set gotFocus(value: PdfAction) {
        this._gotFocus = value;
        this._setAction('Fo', value);
    }
    /**
     * Gets the action performed when the annotation loses focus.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * const page: PdfPage = document.addPage();
     * // Create a rectangle annotation
     * const annotation: PdfRectangleAnnotation =
     *     new PdfRectangleAnnotation(
     *         { x: 20, y: 20, width: 150, height: 60 }
     *     );
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction(
     *         'app.alert('Annotation lost focus');'
     *     );
     * // Assign the action to the annotation focus-out event
     * annotation.actions.lostFocus = action;
     * // Add the annotation to the page
     * page.annotations.add(annotation);
     * // Get the action assigned to the focus-out event
     * const lostFocusAction: PdfAction =
     *     annotation.actions.lostFocus;
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @returns {PdfAction} The action performed when the annotation loses focus.
     */
    public get lostFocus(): PdfAction {
        if (!this._lostFocus) {
            this._lostFocus = this._getAction('Bl');
        }
        return this._lostFocus;
    }
    /**
     * Sets the action performed when the annotation loses focus.
     *
     * ```typescript
     * // Create a new PDF document
     * const document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * const page: PdfPage = document.addPage();
     * // Create a rectangle annotation
     * const annotation: PdfRectangleAnnotation =
     *     new PdfRectangleAnnotation(
     *         { x: 20, y: 20, width: 150, height: 60 }
     *     );
     * // Create a JavaScript action
     * const action: PdfJavaScriptAction =
     *     new PdfJavaScriptAction(
     *         'app.alert('Annotation lost focus');'
     *     );
     * // Assign the action to the annotation focus-out event
     * annotation.actions.lostFocus = action;
     * // Add the annotation to the page
     * page.annotations.add(annotation);
     * // Save the PDF document
     * document.save('output.pdf');
     * // Destroy the PDF document
     * document.destroy();
     * ```
     *
     * @param {PdfAction} value The action to perform when the annotation loses focus.
     */
    public set lostFocus(value: PdfAction) {
        this._lostFocus = value;
        this._setAction('Bl', value);
    }
    /**
     * Gets the action associated with the specified annotation event.
     *
     * @private
     * @param {string} key The PDF event key used to retrieve the action.
     * @returns {PdfAction} The resolved action, or `undefined` when no action is assigned.
     */
    private _getAction(key: string): PdfAction {
        let actionDictionary: _PdfDictionary;
        const aa: _PdfDictionary = this._annotation._dictionary.get('AA');
        if (aa) {
            actionDictionary = aa.get(key);
            if (actionDictionary) {
                (actionDictionary as any)._parentDictionary = this._annotation._dictionary; // eslint-disable-line
            }
        }
        if (!actionDictionary) {
            return undefined;
        }
        return PdfAction._createActionFromDictionary(
            actionDictionary
        );
    }
    /**
     * Sets or removes the action associated with the specified annotation event.
     *
     * @private
     * @param {string} key The PDF event key used to associate the action.
     * @param {PdfAction} action The action to assign, or `undefined` to remove the existing action.
     * @returns {void} Nothing.
     */
    private _setAction(key: string, action: PdfAction): void {
        let aa: _PdfDictionary = this._annotation._dictionary.get('AA');
        if (!aa) {
            aa = new _PdfDictionary();
            this._annotation._dictionary.update('AA', aa);
        }
        if (action) {
            aa.update(key, action._dictionary);
        } else {
            delete aa._map[<string>key];
            aa._updated = true;
            this._annotation._dictionary._updated = true;
        }
    }
}
