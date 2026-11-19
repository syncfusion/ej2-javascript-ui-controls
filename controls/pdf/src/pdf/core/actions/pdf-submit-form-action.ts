import { _PdfSubmitFormFlags, HttpMethod, PdfSubmitDataFormat } from '../enumerator';
import { PdfAction } from '../pdf-action';
import { _PdfName } from '../pdf-primitives';
import { PdfFormAction } from './pdf-form-action';
/**
 * Represents an action that submits form data to a specified URL.
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
 * // Create a submit-form action
 * let action: PdfSubmitFormAction = new PdfSubmitFormAction('https://www.example.com/submit');
 * action.fields = [textField];
 * action.include = true;
 * action.httpMethod = HttpMethod.Post;
 * action.dataFormat = PdfSubmitDataFormat.Fdf;
 * // Create a button and assign the action
 * let button: PdfButtonField = new PdfButtonField(
 *     page, 'SubmitForm', { x: 20, y: 70, width: 120, height: 30 }
 * );
 * button.text = 'Submit form';
 * button.actions.mouseUp = action;
 * document.form.add(button);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfSubmitFormAction extends PdfFormAction {
    /**
     * Initializes a new instance of the `PdfSubmitFormAction` class.
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
     * // Create a submit-form action
     * let action: PdfSubmitFormAction = new PdfSubmitFormAction('https://www.example.com/submit');
     * action.fields = [textField];
     * action.include = true;
     * // Create a button and assign the action
     * let button: PdfButtonField = new PdfButtonField(
     *     page, 'SubmitForm', { x: 20, y: 70, width: 120, height: 30 }
     * );
     * button.text = 'Submit form';
     * button.actions.mouseUp = action;
     * document.form.add(button);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} url The optional URL to which the form data is submitted.
     */
    public constructor(url?: string) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('SubmitForm'));
        if (url) {
            this.url = url;
        }
    }

    /**
     * Gets the URL to which the form data is submitted.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the submit-form action and URL
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * let url: string = action.url;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The URL to which the form data is submitted.
     */
    public get url(): string {
        return this._dictionary.get('F');
    }
    /**
     * Sets the URL to which the form data is submitted.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the submit-form action and set the URL
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * action.url = 'https://www.example.com/updated';
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The URL to which the form data is submitted.
     */
    public set url(value: string) {
        this._dictionary.update('F', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the HTTP method used to submit the form data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the submit-form action and HTTP method
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * let httpMethod: HttpMethod = action.httpMethod;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {HttpMethod} The HTTP method used to submit the form data.
     */
    public get httpMethod(): HttpMethod {
        const flags: number = this._getFlags();
        return (flags & _PdfSubmitFormFlags.GetMethod) ? HttpMethod.Get : HttpMethod.Post;
    }
    /**
     * Sets the HTTP method used to submit the form data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the submit-form action and set the HTTP method
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * action.httpMethod = HttpMethod.Post;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {HttpMethod} value The HTTP method used to submit the form data.
     */
    public set httpMethod(value: HttpMethod) {
        let flags: number = this._getFlags();
        if (value === HttpMethod.Get) {
            flags |= _PdfSubmitFormFlags.GetMethod;
        } else {
            flags &= ~_PdfSubmitFormFlags.GetMethod;
        }
        this._setFlags(flags);
    }
    /**
     * Gets whether date and time values are submitted in canonical format.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the canonical date and time format setting
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * let canonicalDateTimeFormat: boolean = action.canonicalDateTimeFormat;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if canonical date and time formatting is enabled; otherwise, `false`.
     */
    public get canonicalDateTimeFormat(): boolean {
        return this._hasFlag(_PdfSubmitFormFlags.CanonicalFormat);
    }
    /**
     * Sets whether date and time values are submitted in canonical format.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Enable canonical date and time formatting
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * action.canonicalDateTimeFormat = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to use canonical formatting; otherwise, `false`.
     */
    public set canonicalDateTimeFormat(value: boolean) {
        this._updateFlag(_PdfSubmitFormFlags.CanonicalFormat, value);
    }
    /**
     * Gets whether mouse coordinates are included in the submitted form data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the coordinate submission setting
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * let submitCoordinates: boolean = action.submitCoordinates;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if mouse coordinates are submitted; otherwise, `false`.
     */
    public get submitCoordinates(): boolean {
        return this._hasFlag(_PdfSubmitFormFlags.SubmitCoordinates);
    }
    /**
     * Sets whether mouse coordinates are included in the submitted form data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Enable coordinate submission
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * action.submitCoordinates = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to submit mouse coordinates; otherwise, `false`.
     */
    public set submitCoordinates(value: boolean) {
        this._updateFlag(_PdfSubmitFormFlags.SubmitCoordinates, value);
    }
    /**
     * Gets whether fields without values are included in the submitted form data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the empty-field inclusion setting
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * let includeNoValueFields: boolean = action.includeNoValueFields;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if fields without values are included; otherwise, `false`.
     */
    public get includeNoValueFields(): boolean {
        return this._hasFlag(_PdfSubmitFormFlags.IncludeNoValueFields);
    }
    /**
     * Sets whether fields without values are included in the submitted form data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Include fields without values
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * action.includeNoValueFields = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to include fields without values; otherwise, `false`.
     */
    public set includeNoValueFields(value: boolean) {
        this._updateFlag(_PdfSubmitFormFlags.IncludeNoValueFields, value);
    }
    /**
     * Gets whether incremental updates are included in the submitted data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the incremental-update inclusion setting
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * let includeIncrementalUpdates: boolean = action.includeIncrementalUpdates;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if incremental updates are included; otherwise, `false`.
     */
    public get includeIncrementalUpdates(): boolean {
        return this._hasFlag(_PdfSubmitFormFlags.IncludeAppendSaves);
    }
    /**
     * Sets whether incremental updates are included in the submitted data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Include incremental updates
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * action.includeIncrementalUpdates = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to include incremental updates; otherwise, `false`.
     */
    public set includeIncrementalUpdates(value: boolean) {
        this._updateFlag(_PdfSubmitFormFlags.IncludeAppendSaves, value);
    }
    /**
     * Gets whether annotations are included in the submitted data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the annotation inclusion setting
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * let includeAnnotations: boolean = action.includeAnnotations;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if annotations are included; otherwise, `false`.
     */
    public get includeAnnotations(): boolean {
        return this._hasFlag(_PdfSubmitFormFlags.IncludeAnnotations);
    }
    /**
     * Sets whether annotations are included in the submitted data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Include annotations
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * action.includeAnnotations = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to include annotations; otherwise, `false`.
     */
    public set includeAnnotations(value: boolean) {
        this._updateFlag(_PdfSubmitFormFlags.IncludeAnnotations, value);
    }
    /**
     * Gets whether non-user annotations are excluded from the submitted data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the non-user annotation exclusion setting
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * let excludeNonUserAnnotations: boolean = action.excludeNonUserAnnotations;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if non-user annotations are excluded; otherwise, `false`.
     */
    public get excludeNonUserAnnotations(): boolean {
        return this._hasFlag(_PdfSubmitFormFlags.ExcludeNonUserAnnotations);
    }
    /**
     * Sets whether non-user annotations are excluded from the submitted data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Exclude non-user annotations
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * action.excludeNonUserAnnotations = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to exclude non-user annotations; otherwise, `false`.
     */
    public set excludeNonUserAnnotations(value: boolean) {
        this._updateFlag(_PdfSubmitFormFlags.ExcludeNonUserAnnotations, value);
    }
    /**
     * Gets whether the form is embedded in the submitted data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the embedded-form setting
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * let embedForm: boolean = action.embedForm;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if the form is embedded; otherwise, `false`.
     */
    public get embedForm(): boolean {
        return this._hasFlag(_PdfSubmitFormFlags.EmbedForm);
    }
    /**
     * Sets whether the form is embedded in the submitted data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Embed the form in the submitted data
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * action.embedForm = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to embed the form; otherwise, `false`.
     */
    public set embedForm(value: boolean) {
        this._updateFlag(_PdfSubmitFormFlags.EmbedForm, value);
    }
    /**
     * Gets the format used to submit the form data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the submitted data format
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * let dataFormat: PdfSubmitDataFormat = action.dataFormat;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfSubmitDataFormat} The format used to submit the form data.
     */
    public get dataFormat(): PdfSubmitDataFormat {
        const flags: number = this._getFlags();
        if ((flags & _PdfSubmitFormFlags.SubmitPdf) !== 0) {
            return PdfSubmitDataFormat.Pdf;
        }
        if ((flags & _PdfSubmitFormFlags.Xfdf) !== 0) {
            return PdfSubmitDataFormat.Xfdf;
        }
        if ((flags & _PdfSubmitFormFlags.ExportFormat) !== 0) {
            return PdfSubmitDataFormat.Html;
        }
        return PdfSubmitDataFormat.Fdf;
    }
    /**
     * Sets the format used to submit the form data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Set the submitted data format
     * let action: PdfSubmitFormAction = button.actions.mouseUp as PdfSubmitFormAction;
     * action.dataFormat = PdfSubmitDataFormat.Xfdf;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfSubmitDataFormat} value The format used to submit the form data.
     */
    public set dataFormat(value: PdfSubmitDataFormat) {
        let flags: number = this._getFlags();
        flags &= ~_PdfSubmitFormFlags.SubmitPdf;
        flags &= ~_PdfSubmitFormFlags.Xfdf;
        flags &= ~_PdfSubmitFormFlags.ExportFormat;
        switch (value) {
        case PdfSubmitDataFormat.Html:
            flags |= _PdfSubmitFormFlags.ExportFormat;
            break;
        case PdfSubmitDataFormat.Pdf:
            flags |= _PdfSubmitFormFlags.SubmitPdf;
            break;
        case PdfSubmitDataFormat.Xfdf:
            flags |= _PdfSubmitFormFlags.Xfdf;
            break;
        case PdfSubmitDataFormat.Fdf:
        default:
            break;
        }
        this._setFlags(flags);
    }
    /**
     * Validates the submit-form action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        super._validate();
        if (!this.url || this.url.trim() === '') {
            throw new Error(
                `PdfSubmitFormAction.url expected non-empty value. Actual value: "${this.url}".`
            );
        }
        const validUriPattern: RegExp = /^(https?:\/\/|mailto:)/i;
        if (!validUriPattern.test(this.url)) {
            throw new Error(
                `PdfSubmitFormAction.url expected valid URL. Actual value: "${this.url}".`
            );
        }
    }
    /**
     * Gets the submit-form flags.
     *
     * @private
     * @returns {number} The submit-form flags.
     */
    private _getFlags(): number {
        return this._dictionary.get('Flags') || 0;
    }
    /**
     * Sets the submit-form flags.
     *
     * @private
     * @param {number} value The submit-form flags.
     * @returns {void} Nothing.
     */
    private _setFlags(value: number): void {
        this._dictionary.update('Flags', value);
        this._dictionary._updated = true;
    }
    /**
     * Checks whether the specified submit-form flag is enabled.
     *
     * @private
     * @param {number} flag The submit-form flag to check.
     * @returns {boolean} `true` if the flag is enabled; otherwise, `false`.
     */
    private _hasFlag(flag: number): boolean {
        return (this._getFlags() & flag) !== 0;
    }
    /**
     * Updates the specified submit-form flag.
     *
     * @private
     * @param {number} flag The submit-form flag to update.
     * @param {boolean} value Whether to enable the flag.
     * @returns {void} Nothing.
     */
    private _updateFlag(flag: number, value: boolean): void {
        let flags: number = this._getFlags();
        if (value) {
            flags |= flag;
        } else {
            flags &= ~flag;
        }
        this._setFlags(flags);
    }
}
PdfAction._registerActionClass('SubmitForm', PdfSubmitFormAction);
