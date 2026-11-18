import { PdfField } from '../form/field';
import { PdfAction } from '../pdf-action';
/**
 * Represents the base class for PDF form actions.
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
 * button.actions.mouseUp = action;
 * document.form.add(button);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export abstract class PdfFormAction extends PdfAction {
    /**
     * Stores the form fields associated with the action.
     *
     * @private
     */
    private _fields: PdfField[];
    /**
     * Gets whether the specified form fields are included when the action is executed.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the reset button field
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the reset-form action
     * let action: PdfResetFormAction = button.actions.mouseUp as PdfResetFormAction;
     * // Get whether the specified fields are included
     * let include: boolean = action.include;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if the specified fields are included; otherwise, `false`.
     */
    public get include(): boolean {
        const flags: number = this._dictionary.get('Flags') || 0;
        return (flags & 1) !== 0;
    }
    /**
     * Sets whether the specified form fields are included when the action is executed.
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
     * // Create and configure a reset-form action
     * let action: PdfResetFormAction = new PdfResetFormAction();
     * action.fields = [textField];
     * action.include = true;
     * // Create a button and assign the action
     * let button: PdfButtonField = new PdfButtonField(
     *     page, 'ResetForm', { x: 20, y: 70, width: 120, height: 30 }
     * );
     * button.actions.mouseUp = action;
     * document.form.add(button);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to include the specified fields; otherwise, `false`.
     */
    public set include(value: boolean) {
        let flags: number = this._dictionary.get('Flags') || 0;
        if (value) {
            flags |= 1;
        } else {
            flags &= ~1;
        }
        this._dictionary.update('Flags', flags);
        this._dictionary._updated = true;
    }
    /**
     * Gets the form fields associated with the action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the reset button field
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the reset-form action
     * let action: PdfResetFormAction = button.actions.mouseUp as PdfResetFormAction;
     * // Get the fields associated with the action
     * let fields: PdfField[] = action.fields;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfField[]} The form fields associated with the action.
     */
    public get fields(): PdfField[] {
        if (!this._fields) {
            this._fields = [];
            const values: any[] = this._dictionary.get('Fields'); // eslint-disable-line
            if (Array.isArray(values)) {
                this._fields = values.map((value: any): any => { // eslint-disable-line
                    if (typeof value === 'string') {
                        return { name: value };
                    }
                    return value;
                });
            }
        }
        return this._fields;
    }
    /**
     * Sets the form fields associated with the action.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create form fields
     * let nameField: PdfTextBoxField = new PdfTextBoxField(
     *     page, 'Name', { x: 20, y: 20, width: 150, height: 30 }
     * );
     * let cityField: PdfTextBoxField = new PdfTextBoxField(
     *     page, 'City', { x: 20, y: 60, width: 150, height: 30 }
     * );
     * document.form.add(nameField);
     * document.form.add(cityField);
     * // Create a reset-form action and set the target fields
     * let action: PdfResetFormAction = new PdfResetFormAction();
     * action.fields = [nameField, cityField];
     * action.include = true;
     * // Create a button and assign the action
     * let button: PdfButtonField = new PdfButtonField(
     *     page, 'ResetForm', { x: 20, y: 110, width: 120, height: 30 }
     * );
     * button.actions.mouseUp = action;
     * document.form.add(button);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfField[]} value The form fields to associate with the action.
     */
    public set fields(value: PdfField[]) {
        this._fields = value;
        if (value && value.length > 0) {
            const fieldNames: string[] = value
                .filter((field: PdfField) => field !== undefined && field !== null)
                .map((field: PdfField) => field.name)
                .filter((name: string) => name !== undefined && name !== null);
            this._dictionary.update('Fields', fieldNames);
        } else {
            delete this._dictionary._map.Fields;
        }
        this._dictionary._updated = true;
    }
    /**
     * Validates the form action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        const fields: PdfField[] = this.fields;
        if (fields) {
            fields.forEach((field: PdfField): void => {
                if (!field) {
                    throw new Error(
                        'PdfFormAction.fields expected valid PdfField. Actual value: null.'
                    );
                }
            });
        }
    }
}
