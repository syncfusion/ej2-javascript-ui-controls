import { PdfAction } from '../pdf-action';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
import { PdfFileSpecification } from './pdf-file-specification';
import { PdfWindowsLaunchParameters } from './pdf-windows-launch-parameters';
/**
 * Represents an action that launches an external file or application.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a file specification
 * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('input.pdf');
 * // Create a launch action
 * let action: PdfLaunchAction = new PdfLaunchAction(fileSpecification, true);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'Launch', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Open file';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfLaunchAction extends PdfAction {
    /**
     * Stores the file specification associated with the action.
     *
     * @private
     */
    private _fileSpecification: PdfFileSpecification;
    /**
     * Stores the Windows-specific launch parameters.
     *
     * @private
     */
    private _windowsParameter: PdfWindowsLaunchParameters;
    /**
     * Initializes a new instance of the `PdfLaunchAction` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create a file specification
     * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('input.pdf');
     * // Create Windows-specific launch parameters
     * let windowsParameter: PdfWindowsLaunchParameters = new PdfWindowsLaunchParameters();
     * windowsParameter.fileName = 'input.pdf';
     * windowsParameter.operation = 'open';
     * // Create a launch action
     * let action: PdfLaunchAction = new PdfLaunchAction(fileSpecification, true, windowsParameter);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'Launch', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.text = 'Open file';
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfFileSpecification} fileSpecification The optional file specification associated with the action.
     * @param {boolean | PdfWindowsLaunchParameters} arg1 The new-window setting or Windows-specific launch parameters.
     * @param {PdfWindowsLaunchParameters} arg2 The optional Windows-specific launch parameters.
     */
    public constructor(fileSpecification?: PdfFileSpecification, arg1?: boolean | PdfWindowsLaunchParameters,
                       arg2?: PdfWindowsLaunchParameters) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('Launch'));
        if (fileSpecification) {
            this.fileSpecification = fileSpecification;
        }
        if (typeof arg1 === 'boolean') {
            this.isNewWindow = arg1;
            this.windowsParameter = arg2;
        } else if (arg1 instanceof PdfWindowsLaunchParameters) {
            this.windowsParameter = arg1;
        }
    }
    /**
     * Gets the file specification associated with the action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the launch action
     * let action: PdfLaunchAction = field.actions.mouseUp as PdfLaunchAction;
     * // Get the file specification
     * let fileSpecification: PdfFileSpecification = action.fileSpecification;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfFileSpecification} The file specification associated with the action.
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
     * Sets the file specification associated with the action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the launch action
     * let action: PdfLaunchAction = field.actions.mouseUp as PdfLaunchAction;
     * // Create and set a file specification
     * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('updated.pdf');
     * action.fileSpecification = fileSpecification;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfFileSpecification} value The file specification to associate with the action.
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
     * Gets whether the external file or application opens in a new window.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the launch action
     * let action: PdfLaunchAction = field.actions.mouseUp as PdfLaunchAction;
     * // Get the new-window setting
     * let isNewWindow: boolean = action.isNewWindow;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if the target opens in a new window; otherwise, `false`.
     */
    public get isNewWindow(): boolean {
        return this._dictionary.get('NewWindow') || false;
    }
    /**
     * Sets whether the external file or application opens in a new window.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the launch action
     * let action: PdfLaunchAction = field.actions.mouseUp as PdfLaunchAction;
     * // Open the target in a new window
     * action.isNewWindow = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to open the target in a new window; otherwise, `false`.
     */
    public set isNewWindow(value: boolean) {
        this._dictionary.update('NewWindow', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the Windows-specific launch parameters.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the launch action
     * let action: PdfLaunchAction = field.actions.mouseUp as PdfLaunchAction;
     * // Get the Windows-specific launch parameters
     * let windowsParameter: PdfWindowsLaunchParameters = action.windowsParameter;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfWindowsLaunchParameters} The Windows-specific launch parameters.
     */
    public get windowsParameter(): PdfWindowsLaunchParameters {
        if (!this._windowsParameter) {
            const dictionary: _PdfDictionary = this._dictionary.get('Win');
            if (dictionary instanceof _PdfDictionary) {
                const parameters: PdfWindowsLaunchParameters = new PdfWindowsLaunchParameters();
                if (dictionary.has('F')) {
                    parameters.fileName = dictionary.get('F');
                }
                if (dictionary.has('D')) {
                    parameters.directory = dictionary.get('D');
                }
                if (dictionary.has('O')) {
                    parameters.operation = dictionary.get('O');
                }
                if (dictionary.has('P')) {
                    parameters.parameters = dictionary.get('P');
                }
                this._windowsParameter = parameters;
            }
        }
        return this._windowsParameter;
    }
    /**
     * Sets the Windows-specific launch parameters.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the launch action
     * let action: PdfLaunchAction = field.actions.mouseUp as PdfLaunchAction;
     * // Create and set Windows-specific launch parameters
     * let windowsParameter: PdfWindowsLaunchParameters = new PdfWindowsLaunchParameters();
     * windowsParameter.fileName = 'updated.pdf';
     * windowsParameter.operation = 'open';
     * action.windowsParameter = windowsParameter;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfWindowsLaunchParameters} value The Windows-specific launch parameters.
     */
    public set windowsParameter(value: PdfWindowsLaunchParameters) {
        this._windowsParameter = value;
        if (value) {
            const dictionary: _PdfDictionary = new _PdfDictionary();
            if (value.fileName !== undefined) {
                dictionary.update('F', value.fileName);
            }
            if (value.directory !== undefined) {
                dictionary.update('D', value.directory);
            }
            if (value.operation !== undefined) {
                dictionary.update('O', value.operation);
            }
            if (value.parameters !== undefined) {
                dictionary.update('P', value.parameters);
            }
            this._dictionary.update('Win', dictionary);
        } else {
            delete this._dictionary._map.Win;
        }
        this._dictionary._updated = true;
    }
    /**
     * Validates the launch action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!this.fileSpecification) {
            throw new Error(
                'PdfLaunchAction.fileSpecification expected valid PdfFileSpecification.'
            );
        }
        this.fileSpecification._validate();
    }
}
PdfAction._registerActionClass('Launch', PdfLaunchAction);
