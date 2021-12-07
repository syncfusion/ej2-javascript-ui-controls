/**
 * PdfDictionary.ts class for EJ2-PDF
 */
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
import { Dictionary } from './../collections/dictionary';
import { PdfName } from './pdf-name';
import { ObjectStatus } from './../input-output/enum';
import { PdfCrossTable } from './../input-output/pdf-cross-table';
import { Operators } from './../input-output/pdf-operators';
import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
import { PdfSectionCollection } from './../pages/pdf-section-collection';
import { PdfAnnotation } from './../annotations/annotation';
import { PdfSection, PageSettingsState } from './../pages/pdf-section';
import { PdfPage } from './../pages/pdf-page';
import { UnicodeTrueTypeFont } from './../graphics/fonts/unicode-true-type-font';
/**
 * `PdfDictionary` class is used to perform primitive operations.
 * @private
 */
export class PdfDictionary implements IPdfPrimitive {
    /**
     * Indicates if the object was `changed`.
     * @private
     */
    private bChanged : boolean;
    /**
     * Internal variable to store the `position`.
     * @default -1
     * @private
     */
    private position7 : number = -1;
    /**
     * Flag is dictionary need to `encrypt`.
     * @private
     */
    private encrypt : boolean;
    /**
     * The `IPdfSavable` with the specified key.
     * @private
     */
    private primitiveItems : Dictionary<string, IPdfPrimitive> = new Dictionary<string, IPdfPrimitive>();
    /**
     * `Start marker` for dictionary.
     * @private
     */
    private readonly prefix : string = '<<';
    /**
     * `End marker` for dictionary.
     * @private
     */
    private readonly suffix : string = '>>';
    /**
     * @hidden
     * @private
     */
    private resources : Object[] = [];
    /**
     * Shows the type of object `status` whether it is object registered or other status.
     * @private
     */
    private status7 : ObjectStatus;
    /**
     * Indicates if the object `is currently in saving state` or not.
     * @private
     */
    private isSaving7 : boolean;
    /**
     * Holds the `index` number of the object.
     * @private
     */
    private index7 : number;
    /**
     * Internal variable to hold `cloned object`.
     * @default null
     * @private
     */
    private readonly object : IPdfPrimitive = null;
    /**
     * Flag for PDF file formar 1.5 is dictionary `archiving` needed.
     * @default true
     * @private
     */
    private archive : boolean = true;
    /**
     * @hidden
     * @private
     */
    private tempPageCount : number;
    /**
     * @hidden
     * @private
     */
    protected dictionaryProperties : DictionaryProperties;
    //events
    /**
     * Event. Raise before the object saves.
     * @public
     */
    public pageBeginDrawTemplate : SaveTemplateEventHandler;
    /**
     * Event. Raise `before the object saves`.
     * @private
     */
    public beginSave : SaveSectionCollectionEventHandler;
    /**
     * Event. Raise `after the object saved`.
     * @private
     */
    public endSave : SaveSectionCollectionEventHandler;
    /**
     * @hidden
     * @private
     */
    public sectionBeginSave : SaveSectionEventHandler;
    /**
     * @hidden
     * @private
     */
    public annotationBeginSave : SaveAnnotationEventHandler;
    /**
     * @hidden
     * @private
     */
    public annotationEndSave : SaveAnnotationEventHandler;
    /**
     * Event. Raise `before the object saves`.
     * @private
     */
    public descendantFontBeginSave : SaveDescendantFontEventHandler;
    /**
     * Event. Raise `before the object saves`.
     * @private
     */
    public fontDictionaryBeginSave : SaveFontDictionaryEventHandler;
    /**
     * Represents the Font dictionary.
     * @hidden
     * @private
     */
    public isFont : boolean = false;
    //Properties
    /**
     * Gets or sets the `IPdfSavable` with the specified key.
     * @private
     */
    public get items() : Dictionary<string, IPdfPrimitive> {
        return this.primitiveItems;
    }
    /**
     * Gets or sets the `Status` of the specified object.
     * @private
     */
    public get status() : ObjectStatus {
        return this.status7;
    }
    public set status(value : ObjectStatus) {
        this.status7 = value;
    }
    /**
     * Gets or sets a value indicating whether this document `is saving` or not.
     * @private
     */
    public get isSaving() : boolean {
        return this.isSaving7;
    }
    public set isSaving(value : boolean) {
        this.isSaving7 = value;
    }
    /**
     * Gets or sets the `index` value of the specified object.
     * @private
     */
    public get objectCollectionIndex() : number {
        return this.index7;
    }
    public set objectCollectionIndex(value : number) {
        this.index7 = value;
    }
    /**
     * Returns `cloned object`.
     * @private
     */
    public get clonedObject() : IPdfPrimitive {
        return this.object;
    }
    /**
     * Gets or sets the `position` of the object.
     * @private
     */
    public get position() : number {
        return this.position7;
    }
    public set position(value : number) {
        this.position7 = value;
    }
    /**
     * Gets the `count`.
     * @private
     */
    public get Count() : number {
        return this.primitiveItems.size();
    }
    /**
     * Collection of `items` in the object.
     * @private
     */
    public get Dictionary() : PdfDictionary {
        return this;
    }
    /**
     * Get flag if need to `archive` dictionary.
     * @private
     */
    public getArchive() : boolean {
        return this.archive;
    }
    /**
     * Set flag if need to `archive` dictionary.
     * @private
     */
    public setArchive(value : boolean) : void {
        this.archive = value;
    }
    /**
     * Sets flag if `encryption` is needed.
     * @private
     */
    public setEncrypt(value : boolean) : void {
        this.encrypt = value;
        this.modify();
    }
    /**
     * Gets flag if `encryption` is needed.
     * @private
     */
    public getEncrypt() : boolean {
        return this.encrypt;
    }
    //constructor
    /**
     * Initializes a new empty instance of the `PdfDictionary` class.
     * @private
     */
    constructor()
    /**
     * Initializes a new empty instance of the `PdfDictionary` class.
     * @private
     */
    constructor(dictionary : PdfDictionary)
    constructor(dictionary? : PdfDictionary) {
        if (typeof dictionary === 'undefined') {
            this.primitiveItems = new Dictionary<string, IPdfPrimitive>();
            this.encrypt = true;
            this.dictionaryProperties = new DictionaryProperties();
        } else {
            this.primitiveItems = new Dictionary<string, IPdfPrimitive>();
            let keys : string[] = dictionary.items.keys();
            let values : IPdfPrimitive[] = dictionary.items.values();
            for (let index : number = 0; index < dictionary.items.size(); index++) {
                this.primitiveItems.setValue(keys[index], values[index]);
            }
            this.status = dictionary.status;
            this.freezeChanges(this);
            this.encrypt = true;
            this.dictionaryProperties = new DictionaryProperties();
        }
    }
    /**
     * `Freezes` the changes.
     * @private
     */
    public freezeChanges(freezer : Object) : void {
        this.bChanged = false;
    }
    /**
     * Creates a `copy of PdfDictionary`.
     * @private
     */
    public clone(crossTable : PdfCrossTable) : IPdfPrimitive {
        //Need to add more codings
        let newDict : PdfDictionary = new PdfDictionary();
        return newDict;
    }
    /**
     * `Mark` this instance modified.
     * @private
     */
    public modify() : void {
        this.bChanged = true;
    }
    /**
     * `Removes` the specified key.
     * @private
     */
    public remove(key : PdfName|string) : void {
        if (typeof key !== 'string') {
            this.primitiveItems.remove(key.value);
            this.modify();
        } else {
            this.remove(new PdfName(key));
        }
    }
    /**
     * `Determines` whether the dictionary contains the key.
     * @private
     */
    public containsKey(key : string|PdfName) : boolean {
        let returnValue : boolean = false;
        returnValue = this.primitiveItems.containsKey(key.toString());
        return returnValue;
    }
    /**
     * Raises event `BeginSave`.
     * @private
     */
    protected onBeginSave() : void {
        (this.beginSave as SaveSectionCollectionEventHandler).sender.beginSave();
    }
    /**
     * Raises event `Font Dictionary BeginSave`.
     * @private
     */
    protected onFontDictionaryBeginSave() : void {
        (this.fontDictionaryBeginSave as SaveFontDictionaryEventHandler).sender.fontDictionaryBeginSave();
    }
    /**
     * Raises event `Descendant Font BeginSave`.
     * @private
     */
    protected onDescendantFontBeginSave() : void {
        (this.descendantFontBeginSave as SaveDescendantFontEventHandler).sender.descendantFontBeginSave();
    }
    /**
     * Raises event 'BeginSave'.
     * @private
     */
    protected onTemplateBeginSave() : void {
        (this.pageBeginDrawTemplate as SaveTemplateEventHandler).sender.pageBeginSave();
    }
    /**
     * Raises event `BeginSave`.
     * @private
     */
    protected onBeginAnnotationSave() : void {
        (this.annotationBeginSave as SaveAnnotationEventHandler).sender.beginSave();
    }
    /**
     * Raises event `BeginSave`.
     * @private
     */
    protected onSectionBeginSave(writer : IPdfWriter) : void {
        let saveEvent : SaveSectionEventHandler = this.sectionBeginSave as SaveSectionEventHandler;
        saveEvent.sender.beginSave(saveEvent.state, writer);
    }
    //IPdfSavableMembers
    /**
     * `Saves` the object using the specified writer.
     * @private
     */
    public save(writer : IPdfWriter) : void
    /**
     * `Saves` the object using the specified writer.
     * @private
     */
    public save(writer : IPdfWriter, bRaiseEvent : boolean) : void
    public save(writer : IPdfWriter, bRaiseEvent? : boolean) : void {
        if (typeof bRaiseEvent === 'undefined') {
            this.save(writer, true);
        } else {
            writer.write(this.prefix);
            if (typeof this.beginSave !== 'undefined') {
                this.onBeginSave();
            }
            if (typeof this.descendantFontBeginSave !== 'undefined') {
                this.onDescendantFontBeginSave();
            }
            if (typeof this.fontDictionaryBeginSave !== 'undefined') {
                this.onFontDictionaryBeginSave();
            }
            if (typeof this.annotationBeginSave !== 'undefined') {
                this.onBeginAnnotationSave();
            }
            if (typeof this.sectionBeginSave !== 'undefined') {
                this.onSectionBeginSave(writer);
            }
            if (typeof this.pageBeginDrawTemplate !== 'undefined') {
                this.onTemplateBeginSave();
            }
            // }
            if (this.Count > 0) {
                this.saveItems(writer);
            }
            writer.write(this.suffix);
            writer.write(Operators.newLine);
        }
    }
    /**
     * `Save dictionary items`.
     * @private
     */
    private saveItems(writer : IPdfWriter) : void {
        writer.write(Operators.newLine);
        let keys : string[] = this.primitiveItems.keys();
        let values : IPdfPrimitive[] = this.primitiveItems.values();
        for (let index : number = 0; index < keys.length; index++) {
            let key : string = keys[index];
            let name : PdfName = new PdfName(key);
            name.save(writer);
            writer.write(Operators.whiteSpace);
            let resources : IPdfPrimitive = values[index];
            resources.save(writer);
            writer.write(Operators.newLine);
        }
    }
}
export class SaveSectionCollectionEventHandler {
    /**
     * @hidden
     * @private
     */
    public sender : PdfSectionCollection;
    /**
     * New instance for `save section collection event handler` class.
     * @private
     */
    public constructor(sender : PdfSectionCollection) {
        this.sender = sender;
    }
}
export class SaveDescendantFontEventHandler {
    /**
     * @hidden
     * @private
     */
    public sender : UnicodeTrueTypeFont;
    /**
     * New instance for `save section collection event handler` class.
     * @private
     */
    public constructor(sender : UnicodeTrueTypeFont) {
        this.sender = sender;
    }
}
export class SaveFontDictionaryEventHandler {
    /**
     * @hidden
     * @private
     */
    public sender : UnicodeTrueTypeFont;
    /**
     * New instance for `save section collection event handler` class.
     * @private
     */
    public constructor(sender : UnicodeTrueTypeFont) {
        this.sender = sender;
    }
}
export class SaveAnnotationEventHandler {
    /**
     * @hidden
     * @private
     */
    public sender : PdfAnnotation;
    /**
     * New instance for `save annotation event handler` class.
     * @private
     */
    public constructor(sender : PdfAnnotation) {
        this.sender = sender;
    }
}
export class SaveSectionEventHandler {
    // Fields
    /**
     * @hidden
     * @private
     */
    public sender : PdfSection;
    /**
     * @hidden
     * @private
     */
    public state : PageSettingsState;
    // constructors
    /**
     * New instance for `save section event handler` class.
     * @private
     */
    public constructor(sender : PdfSection, state : PageSettingsState) {
        this.sender = sender;
        this.state = state;
    }
}
/**
 * SaveTemplateEventHandler class used to store information about template elements.
 * @private
 * @hidden
 */
export class SaveTemplateEventHandler {
    /**
     * @public
     * @hidden
     */
    public sender : PdfPage;
    /**
     * New instance for save section collection event handler class.
     * @public
     */
    public constructor(sender : PdfPage) {
        this.sender = sender;
    }
}