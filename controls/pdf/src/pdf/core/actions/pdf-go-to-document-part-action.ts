import { PdfAction } from '../pdf-action';
import { PdfDestination, _PdfDestinationHelper } from '../pdf-page';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
/**
 * Represents an action that navigates to a document-part destination in a PDF document.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let firstPage: PdfPage = document.addPage();
 * let secondPage: PdfPage = document.addPage();
 * // Create a destination on the second page
 * let destination: PdfDestination = new PdfDestination(secondPage);
 * destination.mode = PdfDestinationMode.fitToPage;
 * // Create a document-part navigation action
 * let action: PdfGoToDocumentPartAction = new PdfGoToDocumentPartAction(destination);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     firstPage, 'GoToDocumentPart', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Open document part';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfGoToDocumentPartAction extends PdfAction {
    /**
     * Stores the destination associated with the document part.
     *
     * @private
     */
    private _destination: PdfDestination;
    /**
     * Initializes a new instance of the `PdfGoToDocumentPartAction` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let firstPage: PdfPage = document.addPage();
     * let secondPage: PdfPage = document.addPage();
     * // Create a destination on the second page
     * let destination: PdfDestination = new PdfDestination(secondPage);
     * destination.mode = PdfDestinationMode.fitToPage;
     * // Create a document-part navigation action
     * let action: PdfGoToDocumentPartAction = new PdfGoToDocumentPartAction(destination);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     firstPage, 'GoToDocumentPart', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.text = 'Open document part';
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfDestination} destination The destination associated with the document part.
     */
    public constructor(destination?: PdfDestination) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('GoToDPart'));
        if (destination) {
            this.destination = destination;
        }
    }
    /**
     * Gets the destination associated with the document part.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the document-part navigation action
     * let action: PdfGoToDocumentPartAction = field.actions.mouseUp as PdfGoToDocumentPartAction;
     * // Get the document-part destination
     * let destination: PdfDestination = action.destination;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfDestination} The destination associated with the document part.
     */
    public get destination(): PdfDestination {
        if (!this._destination && this._dictionary.has('D')) {
            this._destination = new _PdfDestinationHelper(this._dictionary, 'D')._obtainDestination();
        }
        return this._destination;
    }
    /**
     * Sets the destination associated with the document part.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let page: PdfPage = document.getPage(1);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the document-part navigation action
     * let action: PdfGoToDocumentPartAction = field.actions.mouseUp as PdfGoToDocumentPartAction;
     * // Create and set the document-part destination
     * let destination: PdfDestination = new PdfDestination(page);
     * destination.mode = PdfDestinationMode.fitToPage;
     * action.destination = destination;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfDestination} value The destination to associate with the document part.
     */
    public set destination(value: PdfDestination) {
        this._destination = value;
        if (value) {
            value._initializePrimitive();
            if (value._array.length === 1) {
                value._array.push(_PdfName.get('Fit'));
            }
            if (value._array.length > 1) {
                this._dictionary.update('D', value._array);
            }
        } else {
            delete this._dictionary._map.D;
        }
        this._dictionary._updated = true;
    }
    /**
     * Validates the document-part navigation action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!this.destination) {
            throw new Error(
                'PdfGoToDocumentPartAction.destination expected valid PdfDestination.'
            );
        }
    }
    /**
     * Creates a document-part navigation action from an existing dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The action dictionary to load.
     * @returns {PdfGoToDocumentPartAction} The loaded document-part navigation action.
     */
    static _load(dictionary: _PdfDictionary): PdfGoToDocumentPartAction {
        let destination: PdfDestination;
        if (dictionary && dictionary.has('D')) {
            const destinationHelper: _PdfDestinationHelper = new _PdfDestinationHelper(dictionary, 'D');
            destination = destinationHelper._obtainDestination();
        }
        const action: PdfGoToDocumentPartAction = new PdfGoToDocumentPartAction(destination);
        action._dictionary = dictionary;
        return action;
    }
}
PdfAction._registerActionClass('GoToDPart', PdfGoToDocumentPartAction);
