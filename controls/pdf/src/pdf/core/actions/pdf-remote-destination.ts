import { PdfDestinationMode } from '../enumerator';
import { PdfDestination } from '../pdf-page';
import { _PdfName } from '../pdf-primitives';
/**
 * Represents a destination in a remote or embedded PDF document.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a remote destination
 * let destination: PdfRemoteDestination = new PdfRemoteDestination();
 * destination.pageNumber = 1;
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
 */
export class PdfRemoteDestination extends PdfDestination {
    /**
     * Stores the zero-based page number in the target PDF document.
     *
     * @private
     */
    private _pageNumber: number = 0;
    /**
     * Initializes a new instance of the `PdfRemoteDestination` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create a remote destination
     * let destination: PdfRemoteDestination = new PdfRemoteDestination();
     * destination.pageNumber = 1;
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
     */
    public constructor() {
        super();
    }
    /**
     * Gets the zero-based page number in the target PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the remote GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the remote GoTo action
     * let action: PdfRemoteGoToAction = field.actions.mouseUp as PdfRemoteGoToAction;
     * // Get the remote destination page number
     * let pageNumber: number = action.remoteDestination.pageNumber;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {number} The zero-based page number in the target PDF document.
     */
    public get pageNumber(): number {
        return this._pageNumber;
    }
    /**
     * Sets the zero-based page number in the target PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the remote GoTo button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the remote GoTo action
     * let action: PdfRemoteGoToAction = field.actions.mouseUp as PdfRemoteGoToAction;
     * // Set the remote destination page number
     * action.remoteDestination.pageNumber = 2;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {number} value The zero-based page number in the target PDF document.
     */
    public set pageNumber(value: number) {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error(
                `PdfRemoteDestination.pageNumber expected a non-negative integer. Actual value: ${value}`
            );
        }
        this._pageNumber = value;
    }
    /**
     * Validates the remote destination before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        if (!Number.isInteger(this._pageNumber) || this._pageNumber < 0) {
            throw new Error(
                `PdfRemoteDestination.pageNumber expected a non-negative integer. Actual value: ${this._pageNumber}`
            );
        }
    }
    /**
     * Creates the remote destination array.
     *
     * @private
     * @returns {any[]} The remote destination array.
     */
    _toArray(): any[] { // eslint-disable-line
        const result: any[] = [this._pageNumber]; // eslint-disable-line
        switch (this.mode) {
        case PdfDestinationMode.location:
            result.push(new _PdfName('XYZ'));
            result.push(this.location.x);
            result.push(this.location.y);
            result.push(this.zoom);
            break;
        case PdfDestinationMode.fitToPage:
            result.push(new _PdfName('Fit'));
            break;
        case PdfDestinationMode.fitR:
            result.push(new _PdfName('FitR'));
            result.push(this.destinationBounds.x);
            result.push(this.destinationBounds.y);
            result.push(this.destinationBounds.width);
            result.push(this.destinationBounds.height);
            break;
        case PdfDestinationMode.fitH:
            result.push(new _PdfName('FitH'));
            result.push(this.location.x);
            break;
        }
        return result;
    }
    /**
     * Creates a remote destination from an existing destination array.
     *
     * @private
     * @param {any[]} value The remote destination array to load.
     * @returns {PdfRemoteDestination} The loaded remote destination.
     */
    static _load(value: any[]): PdfRemoteDestination { // eslint-disable-line
        const destination: PdfRemoteDestination = new PdfRemoteDestination();
        if (!Array.isArray(value) || value.length < 2) {
            return destination;
        }
        destination.pageNumber = Number(value[0]);
        const mode: unknown = value[1];
        if (!(mode instanceof _PdfName)) {
            return destination;
        }
        switch (mode.name) {
        case 'XYZ':
            destination.location = {
                x: typeof value[2] === 'number' ? value[2] : 0,
                y: typeof value[3] === 'number' ? value[3] : 0
            };
            destination.zoom = typeof value[4] === 'number' ? value[4] : 0;
            destination.mode = PdfDestinationMode.location;
            break;
        case 'Fit':
            destination.mode = PdfDestinationMode.fitToPage;
            break;
        case 'FitR':
            destination.destinationBounds = {
                x: typeof value[2] === 'number' ? value[2] : 0,
                y: typeof value[3] === 'number' ? value[3] : 0,
                width: typeof value[4] === 'number' ? value[4] : 0,
                height: typeof value[5] === 'number' ? value[5] : 0
            };
            destination.mode = PdfDestinationMode.fitR;
            break;
        case 'FitH':
            destination.location = {
                x: typeof value[2] === 'number' ? value[2] : 0,
                y: 0
            };
            destination.mode = PdfDestinationMode.fitH;
            break;
        }
        return destination;
    }
}
