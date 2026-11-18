import { PdfAction } from '../pdf-action';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
import { PdfFileSpecification } from './pdf-file-specification';
import { PdfRemoteDestination } from './pdf-remote-destination';
import { PdfTargetDictionary } from './pdf-target-dictionary';
/**
 * Represents an action that navigates to a destination in an embedded PDF document.
 *
 * ```typescript
 * // Create an embedded PDF document
 * let embeddedDocument: PdfDocument = new PdfDocument();
 * embeddedDocument.addPage();
 * let embeddedData: Uint8Array = embeddedDocument.save();
 * embeddedDocument.destroy();
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Add the embedded PDF to the document
 * document.attachments.add(new PdfAttachment(embeddedData, 'embedded.pdf'));
 * // Create the embedded PDF destination
 * let destination: PdfRemoteDestination = new PdfRemoteDestination();
 * destination.pageNumber = 0;
 * destination.mode = PdfDestinationMode.fitToPage;
 * // Create the embedded PDF target
 * let target: PdfTargetDictionary = new PdfTargetDictionary(PdfTargetRelation.Child, 'embedded.pdf');
 * // Create the embedded GoTo action
 * let action: PdfEmbeddedGoToAction = new PdfEmbeddedGoToAction(destination, undefined, target);
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(page, 'EmbeddedGoTo', { x: 20, y: 20, width: 120, height: 30 });
 * field.text = 'Open embedded PDF';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfEmbeddedGoToAction extends PdfAction {
    /**
     * Stores the destination in the embedded PDF document.
     *
     * @private
     */
    private _destination: PdfRemoteDestination;
    /**
     * Stores the file specification containing the embedded target.
     *
     * @private
     */
    private _fileSpecification: PdfFileSpecification;
    /**
     * Stores the target dictionary used to locate the embedded PDF document.
     *
     * @private
     */
    private _target: PdfTargetDictionary;
    /**
     * Initializes a new instance of the `PdfEmbeddedGoToAction` class.
     *
     * ```typescript
     * // Create an embedded PDF document
     * let embeddedDocument: PdfDocument = new PdfDocument();
     * embeddedDocument.addPage();
     * let embeddedData: Uint8Array = embeddedDocument.save();
     * embeddedDocument.destroy();
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Add the embedded PDF to the document
     * document.attachments.add(new PdfAttachment(embeddedData, 'embedded.pdf'));
     * // Create the embedded PDF destination
     * let destination: PdfRemoteDestination = new PdfRemoteDestination();
     * destination.pageNumber = 0;
     * destination.mode = PdfDestinationMode.fitToPage;
     * // Create the embedded PDF target
     * let target: PdfTargetDictionary = new PdfTargetDictionary(PdfTargetRelation.Child, 'embedded.pdf');
     * // Create the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = new PdfEmbeddedGoToAction(destination, undefined, target);
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'EmbeddedGoTo', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {PdfRemoteDestination} destination The destination in the embedded PDF document.
     * @param {PdfFileSpecification} fileSpecification The optional file specification containing the target document.
     * @param {PdfTargetDictionary} target The optional target used to locate the embedded PDF document.
     */
    public constructor(destination?: PdfRemoteDestination, fileSpecification?: PdfFileSpecification, target?: PdfTargetDictionary) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('GoToE'));
        if (destination) {
            this.destination = destination;
        }
        if (fileSpecification) {
            this.fileSpecification = fileSpecification;
        }
        if (target) {
            this.target = target;
        }
    }
    /**
     * Gets the destination in the embedded PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Get the destination in the embedded PDF
     * let destination: PdfRemoteDestination = action.destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {PdfRemoteDestination} The destination in the embedded PDF document.
     */
    public get destination(): PdfRemoteDestination {
        if (!this._destination && this._dictionary.has('D')) {
            const value: any[] = this._dictionary.get('D') as any[]; // eslint-disable-line
            if (Array.isArray(value)) {
                this._destination = PdfRemoteDestination._load(value);
            }
        }
        return this._destination;
    }
    /**
     * Sets the destination in the embedded PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Create a new destination in the embedded PDF
     * let destination: PdfRemoteDestination = new PdfRemoteDestination();
     * destination.pageNumber = 1;
     * destination.mode = PdfDestinationMode.fitToPage;
     * // Set the destination
     * action.destination = destination;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfRemoteDestination} value The destination in the embedded PDF document.
     */
    public set destination(value: PdfRemoteDestination) {
        this._destination = value;
        if (value) {
            this._dictionary.update('D', value._toArray());
        } else {
            delete this._dictionary._map.D;
        }
        this._dictionary._updated = true;
    }
    /**
     * Gets the file specification associated with the action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Get the file specification
     * let fileSpecification: PdfFileSpecification = action.fileSpecification;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
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
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Create a file specification
     * let fileSpecification: PdfFileSpecification = new PdfFileSpecification('embedded.pdf');
     * // Set the file specification
     * action.fileSpecification = fileSpecification;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
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
     * Gets the target dictionary used to locate the embedded PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Get the embedded target
     * let target: PdfTargetDictionary = action.target;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {PdfTargetDictionary} The target dictionary used to locate the embedded PDF document.
     */
    public get target(): PdfTargetDictionary {
        if (!this._target &&
            this._dictionary.has('T')) {
            const dictionary: _PdfDictionary = this._dictionary.get('T') as _PdfDictionary;
            if (dictionary instanceof _PdfDictionary) {
                this._target = PdfTargetDictionary._createFromDictionary(dictionary);
            }
        }
        return this._target;
    }
    /**
     * Sets the target dictionary used to locate the embedded PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Create a child target for the embedded PDF
     * let target: PdfTargetDictionary = new PdfTargetDictionary(PdfTargetRelation.Child, 'embedded.pdf');
     * // Set the target dictionary
     * action.target = target;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfTargetDictionary} value The target dictionary to associate with the action.
     */
    public set target(value: PdfTargetDictionary) {
        this._target = value;
        if (value) {
            this._dictionary.update('T', value._dictionary);
        } else {
            delete this._dictionary._map.T;
        }
        this._dictionary._updated = true;
    }
    /**
     * Gets a value indicating whether the embedded PDF opens in a new window.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Get the new-window setting
     * let isNewWindow: boolean = action.isNewWindow;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if the embedded PDF opens in a new window; otherwise, `false`.
     */
    public get isNewWindow(): boolean {
        return this._dictionary.get('NewWindow') ||
            false;
    }
    /**
     * Sets whether the embedded PDF opens in a new window.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the first button field
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the embedded GoTo action
     * let action: PdfEmbeddedGoToAction = field.actions.mouseUp as PdfEmbeddedGoToAction;
     * // Open the embedded PDF in a new window
     * action.isNewWindow = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to open the embedded PDF in a new window; otherwise, `false`.
     */
    public set isNewWindow(value: boolean) {
        this._dictionary.update('NewWindow', value);
        this._dictionary._updated = true;
    }
    /**
     * Validates the embedded GoTo action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!this.destination) {
            throw new Error(
                'PdfEmbeddedGoToAction.destination expected valid PdfRemoteDestination.Actual value: undefined.');
        }
        this.destination._validate();
        if (this.fileSpecification) {
            this.fileSpecification._validate();
        }
        if (!this.fileSpecification && !this.target) {
            throw new Error('PdfEmbeddedGoToAction expected fileSpecification or target. Actual value: undefined.');
        }
        if (this.target) {
            this.target._validate();
        }
    }
    /**
     * Creates an embedded GoTo action from an existing action dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The action dictionary to load.
     * @returns {PdfEmbeddedGoToAction} The loaded embedded GoTo action.
     */
    static _load(dictionary: _PdfDictionary): PdfEmbeddedGoToAction {
        const fileDictionary: _PdfDictionary = dictionary.get('F');
        let fileSpecification: PdfFileSpecification;
        if (fileDictionary instanceof _PdfDictionary) {
            fileSpecification = PdfFileSpecification._createFromDictionary(fileDictionary);
        }
        const targetDictionary: _PdfDictionary = dictionary.get('T');
        let target: PdfTargetDictionary;
        if (targetDictionary instanceof _PdfDictionary) {
            target = PdfTargetDictionary._createFromDictionary(targetDictionary);
        }
        const action: PdfEmbeddedGoToAction = new PdfEmbeddedGoToAction(undefined, fileSpecification, target);
        action._dictionary = dictionary;
        return action;
    }
}
PdfAction._registerActionClass('GoToE', PdfEmbeddedGoToAction);
