/**
 * Represents Windows-specific parameters used by a launch action.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create Windows-specific launch parameters
 * let windowsParameter: PdfWindowsLaunchParameters = new PdfWindowsLaunchParameters();
 * windowsParameter.fileName = 'input.pdf';
 * windowsParameter.directory = 'C:\\Documents';
 * windowsParameter.operation = 'open';
 * windowsParameter.parameters = '';
 * // Create a launch action
 * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('input.pdf');
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
 */
export class PdfWindowsLaunchParameters {
    /**
     * Stores the name of the file to launch.
     *
     * @private
     */
    private _fileName: string;
    /**
     * Stores the default directory of the application or file.
     *
     * @private
     */
    private _directory: string;
    /**
     * Stores the operation performed on the file.
     *
     * @private
     */
    private _operation: string;
    /**
     * Stores the parameters passed to the application.
     *
     * @private
     */
    private _parameters: string;
    /**
     * Gets the name of the file to launch.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the launch button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the launch action and file name
     * let action: PdfLaunchAction = field.actions.mouseUp as PdfLaunchAction;
     * let fileName: string = action.windowsParameter.fileName;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The name of the file to launch.
     */
    public get fileName(): string {
        return this._fileName;
    }
    /**
     * Sets the name of the file to launch.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create Windows-specific launch parameters
     * let windowsParameter: PdfWindowsLaunchParameters = new PdfWindowsLaunchParameters();
     * windowsParameter.fileName = 'input.pdf';
     * // Create a launch action
     * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('input.pdf');
     * let action: PdfLaunchAction = new PdfLaunchAction(fileSpecification, windowsParameter);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'Launch', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The name of the file to launch.
     */
    public set fileName(value: string) {
        this._fileName = value;
    }
    /**
     * Gets the default directory of the application or file.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the launch button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the launch action and default directory
     * let action: PdfLaunchAction = field.actions.mouseUp as PdfLaunchAction;
     * let directory: string = action.windowsParameter.directory;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The default directory of the application or file.
     */
    public get directory(): string {
        return this._directory;
    }
    /**
     * Sets the default directory of the application or file.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create Windows-specific launch parameters
     * let windowsParameter: PdfWindowsLaunchParameters = new PdfWindowsLaunchParameters();
     * windowsParameter.fileName = 'input.pdf';
     * windowsParameter.directory = 'C:\\Documents';
     * // Create a launch action
     * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('input.pdf');
     * let action: PdfLaunchAction = new PdfLaunchAction(fileSpecification, windowsParameter);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'Launch', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The default directory of the application or file.
     */
    public set directory(value: string) {
        this._directory = value;
    }
    /**
     * Gets the operation performed on the file.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the launch button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the launch action and operation
     * let action: PdfLaunchAction = field.actions.mouseUp as PdfLaunchAction;
     * let operation: string = action.windowsParameter.operation;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The operation performed on the file.
     */
    public get operation(): string {
        return this._operation;
    }
    /**
     * Sets the operation performed on the file.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create Windows-specific launch parameters
     * let windowsParameter: PdfWindowsLaunchParameters = new PdfWindowsLaunchParameters();
     * windowsParameter.fileName = 'input.pdf';
     * windowsParameter.operation = 'open';
     * // Create a launch action
     * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('input.pdf');
     * let action: PdfLaunchAction = new PdfLaunchAction(fileSpecification, windowsParameter);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'Launch', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The operation to perform on the file.
     */
    public set operation(value: string) {
        this._operation = value;
    }
    /**
     * Gets the parameters passed to the application.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the launch button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the launch action and application parameters
     * let action: PdfLaunchAction = field.actions.mouseUp as PdfLaunchAction;
     * let parameters: string = action.windowsParameter.parameters;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The parameters passed to the application.
     */
    public get parameters(): string {
        return this._parameters;
    }
    /**
     * Sets the parameters passed to the application.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create Windows-specific launch parameters
     * let windowsParameter: PdfWindowsLaunchParameters = new PdfWindowsLaunchParameters();
     * windowsParameter.fileName = 'input.pdf';
     * windowsParameter.operation = 'open';
     * windowsParameter.parameters = '/A';
     * // Create a launch action
     * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('input.pdf');
     * let action: PdfLaunchAction = new PdfLaunchAction(fileSpecification, windowsParameter);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'Launch', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The parameters to pass to the application.
     */
    public set parameters(value: string) {
        this._parameters = value;
    }
}
