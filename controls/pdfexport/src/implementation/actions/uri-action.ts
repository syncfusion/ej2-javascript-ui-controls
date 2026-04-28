import { PdfAction } from './action';
import { PdfString } from './../primitives/pdf-string';
import { PdfName } from './../primitives/pdf-name';
/**
 * `PdfUriAction` class for initialize the uri related internals.
 * @private
 */
export class PdfUriAction extends PdfAction {
    // Fields
    /**
     * Specifies the `uri` string.
     * @default ''.
     * @private
     */
    private uniformResourceIdentifier : string = '';

    // Constructors
    /**
     * Initialize instance of `PdfUriAction` class.
     * @private
     */
    public constructor()
    /**
     * Initialize instance of `PdfUriAction` class.
     * @private
     */
    public constructor(uri : string)
    public constructor(uri ?: string) {
        super();
    }
    // Properties
    /**
     * Gets and Sets the value of `Uri`.
     * @private
     */
    public get uri() : string {
        return this.uniformResourceIdentifier;
    }
    public set uri(value : string) {
        this.uniformResourceIdentifier = value;
        this.dictionary.items.setValue(this.dictionaryProperties.uri, new PdfString(this.uniformResourceIdentifier));
    }
    // Implementation
    /**
     * `Initialize` the internals.
     * @private
     */
    protected initialize() : void {
        super.initialize();
        this.dictionary.items.setValue(this.dictionaryProperties.s, new PdfName(this.dictionaryProperties.uri));
    }
}