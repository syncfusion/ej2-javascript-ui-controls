import { PdfAction } from '../pdf-action';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
import { PdfRemoteDestination } from './pdf-remote-destination';
/**
 * Represents an action that navigates to a destination in a remote PDF document.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a remote destination
 * let destination: PdfRemoteDestination = new PdfRemoteDestination();
 * destination.pageNumber = 2;
 * destination.mode = PdfDestinationMode.fitToPage;
 * // Create a remote GoTo action
 * let action: PdfRemoteGoToAction = new PdfRemoteGoToAction('input.pdf', destination);
 * action.isNewWindow = true;
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'RemoteGoTo', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Open remote PDF';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfRemoteGoToAction extends PdfAction {
    /**
     * Stores the destination in the remote PDF document.
     *
     * @private
     */
    private _remoteDestination: PdfRemoteDestination;
    /**
     * Initializes a new instance of the `PdfRemoteGoToAction` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create a remote destination
     * let destination: PdfRemoteDestination = new PdfRemoteDestination();
     * destination.pageNumber = 2;
     * destination.mode = PdfDestinationMode.fitToPage;
     * // Create a remote GoTo action
     * let action: PdfRemoteGoToAction = new PdfRemoteGoToAction('input.pdf', destination);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'RemoteGoTo', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.text = 'Open remote PDF';
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} filePath The path of the remote PDF document.
     * @param {PdfRemoteDestination} remoteDestination The destination in the remote PDF document.
     */
    public constructor(filePath?: string, remoteDestination?: PdfRemoteDestination) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('GoToR'));
        if (filePath) {
            this.filePath = filePath;
        }
        if (remoteDestination) {
            this.remoteDestination = remoteDestination;
        }
    }
    /**
     * Gets the path of the remote PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the remote GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the remote GoTo action
     * let action: PdfRemoteGoToAction = field.actions.mouseUp as PdfRemoteGoToAction;
     * // Get the remote PDF file path
     * let filePath: string = action.filePath;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The path of the remote PDF document.
     */
    public get filePath(): string {
        return this._dictionary.get('F');
    }
    /**
     * Sets the path of the remote PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the remote GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the remote GoTo action
     * let action: PdfRemoteGoToAction = field.actions.mouseUp as PdfRemoteGoToAction;
     * // Set the remote PDF file path
     * action.filePath = 'updated.pdf';
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The path of the remote PDF document.
     */
    public set filePath(value: string) {
        this._dictionary.update('F', value);
        this._dictionary._updated = true;
    }
    /**
     * Gets the destination in the remote PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the remote GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the remote GoTo action
     * let action: PdfRemoteGoToAction = field.actions.mouseUp as PdfRemoteGoToAction;
     * // Get the remote destination
     * let destination: PdfRemoteDestination = action.remoteDestination;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {PdfRemoteDestination} The destination in the remote PDF document.
     */
    public get remoteDestination(): PdfRemoteDestination {
        if (!this._remoteDestination) {
            const value: any[] = this._dictionary.get('D'); // eslint-disable-line
            if (Array.isArray(value)) {
                this._remoteDestination = PdfRemoteDestination._load(value);
            }
        }
        return this._remoteDestination;
    }
    /**
     * Sets the destination in the remote PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the remote GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the remote GoTo action
     * let action: PdfRemoteGoToAction = field.actions.mouseUp as PdfRemoteGoToAction;
     * // Create and set a remote destination
     * let destination: PdfRemoteDestination = new PdfRemoteDestination();
     * destination.pageNumber = 1;
     * destination.mode = PdfDestinationMode.fitToPage;
     * action.remoteDestination = destination;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfRemoteDestination} value The destination in the remote PDF document.
     */
    public set remoteDestination(value: PdfRemoteDestination) {
        this._remoteDestination = value;
        if (value) {
            this._dictionary.update('D', value._toArray());
        } else {
            delete this._dictionary._map.D;
        }
        this._dictionary._updated = true;
    }
    /**
     * Gets whether the remote PDF document opens in a new window.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the remote GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the remote GoTo action
     * let action: PdfRemoteGoToAction = field.actions.mouseUp as PdfRemoteGoToAction;
     * // Get the new-window setting
     * let isNewWindow: boolean = action.isNewWindow;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if the remote PDF opens in a new window; otherwise, `false`.
     */
    public get isNewWindow(): boolean {
        return this._dictionary.get('NewWindow') || false;
    }
    /**
     * Sets whether the remote PDF document opens in a new window.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the remote GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the remote GoTo action
     * let action: PdfRemoteGoToAction = field.actions.mouseUp as PdfRemoteGoToAction;
     * // Open the remote PDF in a new window
     * action.isNewWindow = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to open the remote PDF in a new window; otherwise, `false`.
     */
    public set isNewWindow(value: boolean) {
        this._dictionary.update('NewWindow', value);
        this._dictionary._updated = true;
    }
    /**
     * Validates the remote GoTo action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!this.filePath || this.filePath.trim() === '') {
            throw new Error(
                `PdfRemoteGoToAction.filePath expected non-empty value. Actual value: "${this.filePath}"`
            );
        }
        if (!this.remoteDestination) {
            throw new Error(
                'PdfRemoteGoToAction.remoteDestination expected valid PdfRemoteDestination. Actual value: undefined'
            );
        }
        this.remoteDestination._validate();
    }
    /**
     * Creates a remote GoTo action from an existing dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The action dictionary to load.
     * @returns {PdfRemoteGoToAction} The loaded remote GoTo action.
     */
    static _load(dictionary: _PdfDictionary): PdfRemoteGoToAction {
        const destination: PdfRemoteDestination = PdfRemoteDestination._load(
            dictionary.get('D') as any[] // eslint-disable-line
        );
        const action: PdfRemoteGoToAction = new PdfRemoteGoToAction(dictionary.get('F'), destination);
        action._dictionary = dictionary;
        return action;
    }
}
PdfAction._registerActionClass('GoToR', PdfRemoteGoToAction);
