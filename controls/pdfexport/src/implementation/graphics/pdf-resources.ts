/**
 * PdfResources.ts class for EJ2-PDF
 */
import { PdfDictionary } from './../primitives/pdf-dictionary';
import { Dictionary } from './../collections/dictionary';
import { TemporaryDictionary } from './../collections/object-object-pair/dictionary';
import { PdfName } from './../primitives/pdf-name';
import { PdfArray } from './../primitives/pdf-array';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
import { PdfDocument } from './../document/pdf-document';
import { PdfReferenceHolder } from './../primitives/pdf-reference';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
import { PdfFont } from './fonts/pdf-font';
import { PdfTemplate } from './figures/pdf-template';
import { PdfBrush } from './brushes/pdf-brush';
import { PdfTransparency } from './pdf-transparency';
import { PdfBitmap } from './../graphics/images/pdf-bitmap';
import { PdfImage } from './../graphics/images/pdf-image';
import { PdfStream } from './../primitives/pdf-stream';
import { PdfGradientBrush } from './brushes/pdf-gradient-brush';
import { PdfTilingBrush } from './brushes/pdf-tiling-brush';
/**
 * `PdfResources` class used to set resource contents like font, image.
 * @private
 */
export class PdfResources extends PdfDictionary {
    //Fields
    /**
     * Dictionary for the `objects names`.
     * @private
     */
    private pdfNames : TemporaryDictionary<IPdfPrimitive, PdfName>;
    /**
     * Dictionary for the `properties names`.
     * @private
     */
    private properties : PdfDictionary = new PdfDictionary();
    /**
     * `Font name`.
     * @private
     */
    private fontName : string;
    /**
     * Stores instance of `parent document`.
     * @private
     */
    private pdfDocument : PdfDocument;
    //Constructors
    /**
     * Initializes a new instance of the `PdfResources` class.
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfResources` class.
     * @private
     */
    public constructor(baseDictionary : PdfDictionary)
    public constructor(baseDictionary ?: PdfDictionary) {
        super(baseDictionary);
    }
    //Properties
    /**
     * Gets the `font names`.
     * @private
     */
    private get names() : TemporaryDictionary<IPdfPrimitive, PdfName> {
        return this.getNames();
    }
    /**
     * Get or set the `page document`.
     * @private
     */
    public get document() : PdfDocument {
        return this.pdfDocument;
    }
    public set document(value : PdfDocument) {
        this.pdfDocument = value;
    }
    //Public Methods
    /**
     * `Generates name` for the object and adds to the resource if the object is new.
     * @private
     */
    public getName(obj : IPdfWrapper) : PdfName {
        let primitive : IPdfPrimitive = obj.element;
        let name : PdfName = null;
        if (this.names.containsKey(primitive)) {
                name = this.names.getValue(primitive);
        }
        // Object is new.
        if (name == null) {
            let sName : string = this.generateName();
            name = new PdfName(sName);
            this.names.setValue(primitive, name);
            if (obj instanceof PdfFont) {
                this.add(obj, name);
            } else if (obj instanceof PdfTemplate) {
                this.add(obj, name);
            } else if (obj instanceof PdfGradientBrush || obj instanceof PdfTilingBrush) {
                this.add(obj, name);
            } else if (obj instanceof PdfTransparency) {
                this.add(obj, name);
            } else if (obj instanceof PdfImage || obj instanceof PdfBitmap) {
                this.add(obj, name);
            }
        }
        return name;
    }
    /**
     * Gets `resource names` to font dictionaries.
     * @private
     */
    public getNames() : TemporaryDictionary<IPdfPrimitive, PdfName> {
        if (this.pdfNames == null) {
            this.pdfNames = new TemporaryDictionary<IPdfPrimitive, PdfName>();
        }
        let fonts : IPdfPrimitive = this.items.getValue(this.dictionaryProperties.font);
        if (fonts != null) {
            let reference : PdfReferenceHolder = fonts as PdfReferenceHolder;
            let dictionary : PdfDictionary = fonts as PdfDictionary;
            dictionary = PdfCrossTable.dereference(fonts) as PdfDictionary;
        }
        return this.pdfNames;
    }
    /**
     * Add `RequireProcedureSet` into procset array.
     * @private
     */
    public requireProcedureSet(procedureSetName : string) : void {
        if (procedureSetName == null) {
            throw new Error('ArgumentNullException:procedureSetName');
        }
        let procSets : PdfArray = this.items.getValue(this.dictionaryProperties.procset) as PdfArray;
        if (procSets == null) {
            procSets = new PdfArray();
            this.items.setValue(this.dictionaryProperties.procset, procSets);
        }
        let name : PdfName = new PdfName(procedureSetName);
        if (!procSets.contains(name)) {
            procSets.add(name);
        }
    }
    //Helper Methods
    /**
     * `Remove font` from array.
     * @private
     */
    public removeFont(name : string) : void {
        let key : IPdfPrimitive = null;
        let keys : IPdfPrimitive[] = this.pdfNames.keys();
        for (let index : number = 0; index < this.pdfNames.size(); index++) {
            if (this.pdfNames.getValue(keys[index]) === new PdfName(name)) {
                key = keys[index];
                break;
            }
        }
        if (key != null) {
            this.pdfNames.remove(key);
        }
    }
    /**
     * Generates `Unique string name`.
     * @private
     */
    private generateName() : string {
        let name : string = Guid.getNewGuidString();
        return name;
    }
    /**
     * `Adds object` to the resources.
     * @private
     */
    public add(font : PdfFont, name : PdfName) : void
    /**
     * `Adds object` to the resources.
     * @private
     */
    public add(template : PdfTemplate, name : PdfName) : void
    /**
     * `Adds object` to the resources.
     * @private
     */
    public add(brush : PdfBrush, name : PdfName) : void
    /**
     * `Adds object` to the resources.
     * @private
     */
    public add(transparency : PdfTransparency, name : PdfName) : void
    /**
     * `Adds object` to the resources.
     * @private
     */
    public add(image : PdfImage|PdfBitmap, name : PdfName) : void
    public add(arg1 : PdfFont|PdfTemplate|PdfTransparency|PdfBrush|PdfImage|PdfBitmap, arg2 : PdfName) : void {
        if (arg1 instanceof PdfFont) {
            let dictionary : PdfDictionary = null;
            let fonts : IPdfPrimitive = this.items.getValue(this.dictionaryProperties.font);
            if (fonts != null) {
                let reference : PdfReferenceHolder = fonts as PdfReferenceHolder;
                dictionary = fonts as PdfDictionary;
                dictionary = fonts as PdfDictionary;
            } else {
                dictionary = new PdfDictionary();
                this.items.setValue(this.dictionaryProperties.font, dictionary);
            }
            dictionary.items.setValue(arg2.value,  new PdfReferenceHolder((<IPdfWrapper>arg1).element));
        } else if (arg1 instanceof PdfTemplate) {
            let xobjects : PdfDictionary;
            xobjects = this.items.getValue(this.dictionaryProperties.xObject) as PdfDictionary;
            // Create fonts dictionary.
            if (xobjects == null) {
                xobjects = new PdfDictionary();
                this.items.setValue(this.dictionaryProperties.xObject, xobjects);
            }
            xobjects.items.setValue(arg2.value, new PdfReferenceHolder((<IPdfWrapper>arg1).element));
        } else if (arg1 instanceof PdfBrush) {
            if (arg1 instanceof PdfGradientBrush || arg1 instanceof PdfTilingBrush) {
                let savable : IPdfPrimitive = (arg1 as IPdfWrapper).element;
                if (savable != null) {
                    let pattern : PdfDictionary = this.items.getValue(this.dictionaryProperties.pattern) as PdfDictionary;
                    // Create a new pattern dictionary.
                    if (pattern == null) {
                        pattern = new PdfDictionary();
                        this.items.setValue(this.dictionaryProperties.pattern, pattern);
                    }
                    pattern.items.setValue(arg2.value, new PdfReferenceHolder(savable));
                }
            }
        } else if (arg1 instanceof PdfTransparency) {
            let savable : IPdfPrimitive = (arg1 as IPdfWrapper).element;
            let transDic : PdfDictionary = null;
            transDic = this.items.getValue(this.dictionaryProperties.extGState) as PdfDictionary;
            // Create a new pattern dictionary.
            if (transDic == null) {
                transDic = new PdfDictionary();
                this.items.setValue(this.dictionaryProperties.extGState, transDic);
            }
            transDic.items.setValue(arg2.value, new PdfReferenceHolder(savable));
        } else {
            /* tslint:disable */
            let xobjects : PdfDictionary = this.Dictionary.items.getValue(this.dictionaryProperties.xObject) as PdfDictionary;
            let parentXObjects : PdfDictionary;
            if (typeof this.pdfDocument !== 'undefined') {
                parentXObjects = ((this.pdfDocument.sections.element as PdfDictionary).items.getValue(this.dictionaryProperties.resources) as PdfDictionary).items.getValue(this.dictionaryProperties.xObject) as PdfDictionary;
            }
            let values : IPdfPrimitive[] = this.Dictionary.items.values();
            let hasSameImageStream : boolean = false;
            let oldReference : PdfReferenceHolder;
            if ( typeof this.pdfDocument !== 'undefined' && (typeof parentXObjects === undefined || parentXObjects == null)) {
                parentXObjects = new PdfDictionary();
                ((this.pdfDocument.sections.element as PdfDictionary).items.getValue(this.dictionaryProperties.resources) as PdfDictionary).items.setValue(this.dictionaryProperties.xObject, parentXObjects);
            } else if (typeof this.pdfDocument !== 'undefined') {
                let values : IPdfPrimitive[] = parentXObjects.items.values();
                for (let i : number = 0; i < values.length; i++) {
                    if (typeof (values[i] as PdfReferenceHolder) !== 'undefined' && typeof ((values[i] as PdfReferenceHolder).element as PdfStream) !== 'undefined') {
                        if (((values[i] as PdfReferenceHolder).element as PdfStream).data[0] === (arg1.element as PdfStream).data[0]) {
                            oldReference = values[i] as PdfReferenceHolder;
                            hasSameImageStream = true;
                        }
                    }
                }
            }
            if (xobjects == null) {
                xobjects = new PdfDictionary();
                this.Dictionary.items.setValue(this.dictionaryProperties.xObject, xobjects);
            }
            if (hasSameImageStream && typeof oldReference !== 'undefined') {
                xobjects.items.setValue(arg2.value, oldReference);
            } else {
                let reference : PdfReferenceHolder = new PdfReferenceHolder((arg1 as IPdfWrapper).element);
                xobjects.items.setValue(arg2.value, reference);
                if ( typeof this.pdfDocument !== 'undefined' ) {
                    parentXObjects.items.setValue(arg2.value, reference);
                }
            }
            /* tslint:enable */
        }
    }
}
/* tslint:disable */
/**
 * Used to create new guid for resources.
 * @private
 */
export class Guid {
    /**
     * Generate `new GUID`.
     * @private
     */
    public static getNewGuidString() : string {
        return 'aaaaaaaa-aaaa-4aaa-baaa-aaaaaaaaaaaa'.replace(/[ab]/g, (c : string) => {
            let random : number = Math.random() * 16 | 0;
            let result : number = c === 'a' ? random : (random & 0x3 | 0x8);
            return result.toString(16);
          });
    }
}
/* tslint:enable */