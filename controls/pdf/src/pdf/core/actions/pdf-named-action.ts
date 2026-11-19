import { PdfActionDestination } from '../enumerator';
import { PdfAction } from '../pdf-action';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
/**
 * Represents an action that performs a predefined navigation operation in a PDF viewer.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * document.addPage();
 * // Create a named navigation action
 * let action: PdfNamedAction = new PdfNamedAction(PdfActionDestination.LastPage);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'NamedAction', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Last page';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfNamedAction extends PdfAction {
    /**
     * Initializes a new instance of the `PdfNamedAction` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * document.addPage();
     * // Create a named navigation action
     * let action: PdfNamedAction = new PdfNamedAction(PdfActionDestination.LastPage);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'NamedAction', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.text = 'Last page';
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfActionDestination} destination The optional predefined navigation destination.
     */
    public constructor(destination?: PdfActionDestination) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('Named'));
        if (destination !== undefined) {
            this.destination = destination;
        }
    }
    /**
     * Gets the predefined navigation destination.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the named action
     * let action: PdfNamedAction = field.actions.mouseUp as PdfNamedAction;
     * // Get the predefined navigation destination
     * let destination: PdfActionDestination = action.destination;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfActionDestination} The predefined navigation destination.
     */
    public get destination(): PdfActionDestination {
        const value: string = PdfNamedAction._nameValue(this._dictionary.get('N'));
        switch (value) {
        case 'FirstPage':
            return PdfActionDestination.FirstPage;
        case 'LastPage':
            return PdfActionDestination.LastPage;
        case 'NextPage':
            return PdfActionDestination.NextPage;
        case 'PrevPage':
            return PdfActionDestination.PrevPage;
        default:
            return PdfActionDestination.FirstPage;
        }
    }
    /**
     * Sets the predefined navigation destination.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the named action
     * let action: PdfNamedAction = field.actions.mouseUp as PdfNamedAction;
     * // Set the predefined navigation destination
     * action.destination = PdfActionDestination.FirstPage;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfActionDestination} value The predefined navigation destination.
     */
    public set destination(value: PdfActionDestination) {
        let destination: string;
        switch (value) {
        case PdfActionDestination.FirstPage:
            destination = 'FirstPage';
            break;
        case PdfActionDestination.LastPage:
            destination = 'LastPage';
            break;
        case PdfActionDestination.NextPage:
            destination = 'NextPage';
            break;
        case PdfActionDestination.PrevPage:
            destination = 'PrevPage';
            break;
        default:
            throw new Error(
                `PdfNamedAction.destination expected a valid PdfActionDestination. Actual value: ${value}`
            );
        }
        this._dictionary.update('N', new _PdfName(destination));
        this._dictionary._updated = true;
    }
    /**
     * Gets the string value from the specified PDF name or string.
     *
     * @private
     * @param {any} value The PDF name or string value.
     * @returns {string} The resolved string value.
     */
    private static _nameValue(value: any): string { // eslint-disable-line
        if (value instanceof _PdfName) {
            return value.name;
        }
        return typeof value === 'string' ? value : '';
    }
    /**
     * Validates the named action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        const value: string = PdfNamedAction._nameValue(this._dictionary.get('N'));
        if (
            value !== 'FirstPage' &&
            value !== 'LastPage' &&
            value !== 'NextPage' &&
            value !== 'PrevPage'
        ) {
            throw new Error(
                `PdfNamedAction.destination expected a valid named action. Actual value: ${value}`
            );
        }
    }
    /**
     * Creates a named action from an existing dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The action dictionary to load.
     * @returns {PdfNamedAction} The loaded named action.
     */
    static _load(dictionary: _PdfDictionary): PdfNamedAction {
        const action: PdfNamedAction = new PdfNamedAction(PdfActionDestination.FirstPage);
        action._dictionary = dictionary;
        return action;
    }
}
PdfAction._registerActionClass('Named', PdfNamedAction);
