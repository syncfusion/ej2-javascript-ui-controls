import { PdfAction } from '../pdf-action';
import { _PdfDictionary, _PdfName } from '../pdf-primitives';
/**
 * Represents an action that opens a URI.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * let page: PdfPage = document.addPage();
 * // Create a URI action
 * let action: PdfUriAction = new PdfUriAction('https://www.example.com');
 * // Create a button and assign the action
 * let field: PdfButtonField = new PdfButtonField(
 *     page, 'OpenUri', { x: 20, y: 20, width: 120, height: 30 }
 * );
 * field.text = 'Open website';
 * field.actions.mouseUp = action;
 * document.form.add(field);
 * // Save and destroy the document
 * document.save('output.pdf');
 * document.destroy();
 * ```
 */
export class PdfUriAction extends PdfAction {
    /**
     * Initializes a new instance of the `PdfUriAction` class.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * let page: PdfPage = document.addPage();
     * // Create a URI action
     * let action: PdfUriAction = new PdfUriAction('https://www.example.com');
     * // Create a button and assign the action
     * let field: PdfButtonField = new PdfButtonField(
     *     page, 'OpenUri', { x: 20, y: 20, width: 120, height: 30 }
     * );
     * field.text = 'Open website';
     * field.actions.mouseUp = action;
     * document.form.add(field);
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} uri The optional URI to open.
     */
    public constructor(uri?: string) {
        super();
        this._initialize();
        this._dictionary.update('S', new _PdfName('URI'));
        if (uri) {
            this.uri = uri;
        }
    }
    /**
     * Gets the URI opened by the action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the URI button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the URI action and URI
     * let action: PdfUriAction = field.actions.mouseUp as PdfUriAction;
     * let uri: string = action.uri;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {string} The URI opened by the action.
     */
    public get uri(): string {
        return this._dictionary.get('URI');
    }
    /**
     * Sets the URI opened by the action.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the URI button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the URI action and set the URI
     * let action: PdfUriAction = field.actions.mouseUp as PdfUriAction;
     * action.uri = 'https://www.example.com/updated';
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {string} value The URI to open.
     */
    public set uri(value: string) {
        if (value !== undefined && value !== null) {
            this._dictionary.update('URI', value);
        } else {
            delete this._dictionary._map.URI;
        }
        this._dictionary._updated = true;
    }
    /**
     * Gets whether the URI is interpreted as an image map.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the URI button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the URI action and image-map setting
     * let action: PdfUriAction = field.actions.mouseUp as PdfUriAction;
     * let isMap: boolean = action.isMap;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if the URI is interpreted as an image map; otherwise, `false`.
     */
    public get isMap(): boolean {
        return this._dictionary.get('IsMap') || false;
    }
    /**
     * Sets whether the URI is interpreted as an image map.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the URI button
     * let field: PdfButtonField = document.form.fieldAt(0) as PdfButtonField;
     * // Get the URI action and enable the image-map setting
     * let action: PdfUriAction = field.actions.mouseUp as PdfUriAction;
     * action.isMap = true;
     * // Save and destroy the document
     * document.save('output.pdf');
     * document.destroy();
     * ```
     *
     * @param {boolean} value `true` to interpret the URI as an image map; otherwise, `false`.
     */
    public set isMap(value: boolean) {
        if (value) {
            this._dictionary.update('IsMap', value);
        } else {
            delete this._dictionary._map.IsMap;
        }
        this._dictionary._updated = true;
    }
    /**
     * Validates the URI action before serialization.
     *
     * @private
     * @returns {void} Nothing.
     */
    _validate(): void {
        const uri: string = this.uri;
        if (!uri || uri.trim() === '') {
            throw new Error(
                `PdfUriAction.uri expected a non-empty URI value. Actual value: "${uri}".`
            );
        }
        const validUriPattern: RegExp = /^(https?:\/\/|mailto:|ftp:\/\/)/i;
        if (!validUriPattern.test(uri)) {
            throw new Error(
                `PdfUriAction.uri expected a valid URI. Actual value: "${uri}".`
            );
        }
    }
    /**
     * Creates a URI action from an existing dictionary.
     *
     * @private
     * @param {_PdfDictionary} dictionary The action dictionary to load.
     * @returns {PdfUriAction} The loaded URI action.
     */
    static _load(dictionary: _PdfDictionary): PdfUriAction {
        const action: PdfUriAction = new PdfUriAction(dictionary.get('URI'));
        action._dictionary = dictionary;
        return action;
    }
}
PdfAction._registerActionClass('URI', PdfUriAction);
