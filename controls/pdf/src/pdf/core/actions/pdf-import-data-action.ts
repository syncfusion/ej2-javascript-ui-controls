import { PdfAction } from '../pdf-action';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
import { PdfFileSpecification } from './pdf-file-specification';
/**
 * Represents an action that imports form data from an FDF or XFDF file.
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
 * // Create an import-data action
 * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('data.fdf');
 * let action: PdfImportDataAction = new PdfImportDataAction(fileSpecification);
 * // Create a button and assign the action
 * let button: PdfButtonField = new PdfButtonField(
 *     page, 'ImportData', { x: 20, y: 70, width: 120, height: 30 }
 * );
 * button.text = 'Import data';
 * button.actions.mouseUp = action;
 * document.form.add(button);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfImportDataAction extends PdfAction {
    /**
     * Stores the file specification containing the form data.
     *
     * @private
     */
    private _fileSpecification: PdfFileSpecification;
    /**
     * Initializes a new instance of the `PdfImportDataAction` class.
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
     * // Create an import-data action
     * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('data.fdf');
     * let action: PdfImportDataAction = new PdfImportDataAction(fileSpecification);
     * // Create a button and assign the action
     * let button: PdfButtonField = new PdfButtonField(
     *     page, 'ImportData', { x: 20, y: 70, width: 120, height: 30 }
     * );
     * button.text = 'Import data';
     * button.actions.mouseUp = action;
     * document.form.add(button);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfFileSpecification} fileSpecification The optional file specification containing the form data.
     */
    public constructor(fileSpecification?: PdfFileSpecification) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('ImportData'));
        if (fileSpecification) {
            this.fileSpecification = fileSpecification;
        }
    }
    /**
     * Gets the file specification containing the form data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the import-data button
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the import-data action
     * let action: PdfImportDataAction = button.actions.mouseUp as PdfImportDataAction;
     * // Get the file specification
     * let fileSpecification: PdfFileSpecification = action.fileSpecification;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfFileSpecification} The file specification containing the form data.
     */
    public get fileSpecification(): PdfFileSpecification {
        if (!this._fileSpecification) {
            const dictionary: _PdfDictionary = this._dictionary.get('F');
            if (dictionary instanceof _PdfDictionary) {
                this._fileSpecification = PdfFileSpecification._createFromDictionary(dictionary);
            }
        }
        return this._fileSpecification;
    }
    /**
     * Sets the file specification containing the form data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the import-data button
     * let button: PdfButtonField = document.form.fieldAt(1) as PdfButtonField;
     * // Get the import-data action
     * let action: PdfImportDataAction = button.actions.mouseUp as PdfImportDataAction;
     * // Create and set the file specification
     * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('updated.fdf');
     * action.fileSpecification = fileSpecification;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfFileSpecification} value The file specification containing the form data.
     */
    public set fileSpecification(value: PdfFileSpecification) {
        this._fileSpecification = value;
        if (value) {
            this._dictionary.update('F', value._dictionary);
        } else {
            delete this._dictionary._map.F;
        }
        this._dictionary._updated = true;
    }
    /**
     * Validates the import-data action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        const fileSpecification: PdfFileSpecification = this.fileSpecification;
        if (!fileSpecification) {
            throw new Error(
                'PdfImportDataAction.fileSpecification expected valid PdfFileSpecification. Actual value: undefined.'
            );
        }
        fileSpecification._validate();
    }
    /**
     * Creates an import-data action from an existing dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The action dictionary to load.
     * @returns {PdfImportDataAction} The loaded import-data action.
     */
    static _load(dictionary: _PdfDictionary): PdfImportDataAction {
        const action: PdfImportDataAction = new PdfImportDataAction();
        action._dictionary = dictionary;
        return action;
    }
}
PdfAction._registerActionClass('ImportData', PdfImportDataAction);
