import { PdfField } from '../form/field';
import { PdfAction } from '../pdf-action';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
import { PdfFormAction } from './pdf-form-action';
/**
 * Represents an action that resets form fields to their default values.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a text box field
 * let textField: PdfTextBoxField = new PdfTextBoxField(
 *     page, 'Name', { x: 20, y: 20, width: 150, height: 30 }
 * );
 * document.form.add(textField);
 * // Create a reset-form action
 * let action: PdfResetFormAction = new PdfResetFormAction();
 * action.fields = [textField];
 * action.include = true;
 * // Create a button and assign the action
 * let button: PdfButtonField = new PdfButtonField(
 *     page, 'ResetForm', { x: 20, y: 70, width: 120, height: 30 }
 * );
 * button.text = 'Reset form';
 * button.actions.mouseUp = action;
 * document.form.add(button);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfResetFormAction extends PdfFormAction {
    /**
     * Initializes a new instance of the `PdfResetFormAction` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create a text box field
     * let textField: PdfTextBoxField = new PdfTextBoxField(
     *     page, 'Name', { x: 20, y: 20, width: 150, height: 30 }
     * );
     * document.form.add(textField);
     * // Create a reset-form action
     * let action: PdfResetFormAction = new PdfResetFormAction();
     * action.fields = [textField];
     * action.include = true;
     * // Create a button and assign the action
     * let button: PdfButtonField = new PdfButtonField(
     *     page, 'ResetForm', { x: 20, y: 70, width: 120, height: 30 }
     * );
     * button.text = 'Reset form';
     * button.actions.mouseUp = action;
     * document.form.add(button);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     */
    public constructor() {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('ResetForm'));
    }
    /**
     * Validates the reset-form action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        super._validate();
        const fields: PdfField[] = this.fields;
        if (fields) {
            fields.forEach((field: PdfField): void => {
                if (!field) {
                    throw new Error(
                        'PdfResetFormAction.fields expected valid PdfField. Actual value: null.'
                    );
                }
            });
        }
    }
    /**
     * Creates a reset-form action from an existing dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The action dictionary to load.
     * @returns {PdfResetFormAction} The loaded reset-form action.
     */
    static _load(dictionary: _PdfDictionary): PdfResetFormAction {
        const action: PdfResetFormAction = new PdfResetFormAction();
        action._dictionary = dictionary;
        return action;
    }
}
PdfAction._registerActionClass('ResetForm', PdfResetFormAction);
