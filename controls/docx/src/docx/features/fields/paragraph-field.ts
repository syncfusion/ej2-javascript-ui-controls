/**
 * @fileoverview
 *
 * New ParagraphItem-based field model (Phase 1 of field DOM refactor).
 *
 * This module provides the refactored Field and FieldMark classes that extend
 * ParagraphItem directly and appear in Paragraph.items without feature wrappers.
 *
 * The old facade Field (currently in the owning module) wraps SimpleField/ComplexField.
 * The new Field (this module) represents a begin marker in the paragraph item stream.
 *
 * Migration path:
 * 1. Add these new classes alongside existing Field facade
 * 2. New code uses ParagraphItem-based classes directly from paragraph.items
 * 3. Eventually deprecate and remove old facade in Phase 2+
 *
 * @private
 */

import { DocxError } from '../../core/errors/docx-error';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { ParagraphItem, ParagraphItemOwner } from '../document/paragraph-item';
import { TextRange, WireRunGroup, WireRunMember } from '../document/text-range';
import { CharacterFormat } from '../document/character-format';
import { wmlAttr, wmlElement, xmlSpacePreserve, isWml } from '../document/wml';
import { EntityType } from '../document/entity-type';
import { objectEntries } from '../../core/compat/object-compat';
import { CaptionNumberingFormat, CAPTION_FORMAT_SWITCH } from '../images/caption-enums';

// ============================================================================
// FieldMarkType and FieldMark
// ============================================================================

/**
 * Marker type for field boundaries.
 *
 * @private
 */
export enum FieldMarkType {
    Begin = 'begin',
    Separator = 'separate',
    End = 'end'
}



/** DOCPROPERTY built-in names (lower-case) mapped to BuiltinDocumentProperties members. */
const BUILTIN_DOCPROPERTY_MEMBERS: { [name: string]: string } = {
    'title': 'title', 'subject': 'subject', 'author': 'author', 'keywords': 'keywords',
    'comments': 'comments', 'template': 'template', 'lastsavedby': 'lastAuthor', 'lastauthor': 'lastAuthor',
    'revisionnumber': 'revisionNumber', 'totaleditingtime': 'totalEditingTime',
    'lastprinted': 'lastPrinted', 'createdate': 'createDate', 'savedate': 'lastSaveDate', 'lastsavedate': 'lastSaveDate',
    'pages': 'pageCount', 'words': 'wordCount', 'characters': 'charCount', 'application': 'applicationName',
    'security': 'docSecurity', 'category': 'category', 'bytes': 'bytesCount', 'lines': 'linesCount',
    'paragraphs': 'paragraphCount', 'slides': 'slideCount', 'notes': 'noteCount', 'hiddenslides': 'hiddenCount',
    'manager': 'manager', 'company': 'company'
};

/**
 * Resolve a DOCPROPERTY name: custom properties first (Word lets them shadow nothing built-in,
 * but names are distinct), then built-in properties. Returns undefined when not found.
 *
 * @param {any} document - The owning document.
 * @param {string} name - The property name.
 * @returns {string | number | boolean | Date | undefined} The value.
 * @private
 */
function resolveDocumentPropertyValue(document: any, name: string): string | number | boolean | Date | undefined {
    const custom: any = document.customDocumentProperties;
    if (custom !== undefined && custom !== null && typeof custom.get === 'function') {
        const prop: any = custom.get(name);
        if (prop !== undefined && prop !== null) {
            return prop.value;
        }
    }
    const member: string | undefined = BUILTIN_DOCPROPERTY_MEMBERS[name.toLowerCase()];
    const builtin: any = document.builtinDocumentProperties;
    if (member === undefined || builtin === undefined || builtin === null) {
        return undefined;
    }
    // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
    const value: any = builtin[member];
    if (value instanceof Date) {
        // Unset dates are reported as year 1.
        return value.getFullYear() <= 1 ? undefined : value;
    }
    return value === undefined || value === null ? undefined : value;
}

/**
 * Field boundary marker (separator or end position).
 *
 * Represents `w:fldChar` with `fldCharType="separate"` or `"end"`.
 * The begin marker is represented by the Field class itself.
 *
 * @private
 */
export class FieldMark extends ParagraphItem implements WireRunMember {
    private readonly typeValue: FieldMarkType;
    private readonly fldLockValue: boolean | undefined;
    private readonly dirtyValue: boolean | undefined;
    private readonly extrasValue: ReadonlyArray<OpenXmlElement>;
    private readonly wireGroupValue: WireRunGroup;
    private formFieldValue: FormField | undefined;

    /**
     * Create a field mark (separator or end).
     *
     * @param {FieldMarkType} type - The type.
     * @param {boolean | undefined} fldLock - The fld lock.
     * @param {boolean | undefined} dirty - The dirty.
     * @param {ReadonlyArray<OpenXmlElement>} extras - The extras.
     * @param {WireRunGroup} wireGroup - The wire group.
     * @private
     */
    constructor(
        type: FieldMarkType,
        fldLock: boolean | undefined,
        dirty: boolean | undefined,
        extras: ReadonlyArray<OpenXmlElement>,
        wireGroup?: WireRunGroup
    ) {
        super();
        this.typeValue = type;
        this.fldLockValue = fldLock;
        this.dirtyValue = dirty;
        this.extrasValue = extras;
        this.wireGroupValue = wireGroup != null ? wireGroup : new WireRunGroup();
        this.formFieldValue = undefined;
    }

    /**
     * Set the form field associated with this begin mark (for dynamic FFData generation).
     *
     * @param {FormField | undefined} field - The form field.
     * @returns {void}
     * @internal
     */
    setFormField(field: FormField | undefined): void {
        this.formFieldValue = field;
    }

    /**
     *  Shared `w:r` identity so fldChar serializes under `w:r`.
     *
     * @returns {WireRunGroup} The wire group.
     * @private
     */
    get wireGroup(): WireRunGroup {
        return this.wireGroupValue;
    }

    /**
     * The marker type (Separator or End).
     */
    get fieldMarkType(): FieldMarkType {
        return this.typeValue;
    }

    /**
     * Unmodeled child elements (includes w:ffData, etc).
     *
     * @returns {ReadonlyArray<OpenXmlElement>} The result.
     * @private
     */
    childElements(): ReadonlyArray<OpenXmlElement> {
        return this.extrasValue;
    }

    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [
            wmlAttr('fldCharType', this.typeValue)
        ];
        if (this.fldLockValue !== undefined) {
            attributes.push(wmlAttr('fldLock', this.fldLockValue ? '1' : '0'));
        }
        if (this.dirtyValue !== undefined) {
            attributes.push(wmlAttr('dirty', this.dirtyValue ? '1' : '0'));
        }

        // Note: FieldMark should only be used for Separator and End markers.
        // Begin markers are now represented by Field or FormField directly.
        // The formFieldValue is no longer used.
        const children: OpenXmlElement[] = [...this.extrasValue];

        return wmlElement('fldChar', {
            attributes,
            children
        });
    }

    /**
     * Create an independent copy of this field mark.
     * All properties and extras are cloned; the wire group is independent.
     *
     * @returns {FieldMark} Cloned field mark.
     * @public
     */
    clone(): FieldMark {
        const clonedExtras: OpenXmlElement[] = [];
        for (const element of this.extrasValue) {
            clonedExtras.push(element);
        }
        return new FieldMark(this.typeValue, this.fldLockValue, this.dirtyValue, clonedExtras, new WireRunGroup());
    }
}

// ============================================================================
// Field (new ParagraphItem-based begin marker)
// ============================================================================

/**
 * Customer-facing Word field types.
 *
 * @public
 */
export enum FieldType {
    /** `PAGE` — current page number. */
    Page = 'PAGE',
    /** `NUMPAGES` — total number of pages. */
    NumPages = 'NUMPAGES',
    /** `IF` — conditional field. */
    If = 'IF',
    /** `MERGEFIELD` — mail-merge field. */
    MergeField = 'MERGEFIELD',
    /** `HYPERLINK` — hyperlink field. */
    Hyperlink = 'HYPERLINK',
    /** `ADDIN` — add-in field. */
    FieldAddin = 'ADDIN',
    /** `ADVANCE` — advance field. */
    FieldAdvance = 'ADVANCE',
    /** `ASK` — ask field. */
    FieldAsk = 'ASK',
    /** `AUTHOR` — document author field. */
    FieldAuthor = 'AUTHOR',
    /** `AUTONUM` — auto-number field. */
    FieldAutoNum = 'AUTONUM',
    /** `AUTONUMLGL` — auto-number legal field. */
    FieldAutoNumLegal = 'AUTONUMLGL',
    /** `AUTONUMOUT` — auto-number outline field. */
    FieldAutoNumOutline = 'AUTONUMOUT',
    /** `AUTOTEXT` — auto-text field. */
    FieldAutoText = 'AUTOTEXT',
    /** `AUTOTEXTLIST` — auto-text list field. */
    FieldAutoTextList = 'AUTOTEXTLIST',
    /** `BARCODE` — barcode field. */
    FieldBarCode = 'BARCODE',
    /** `DOCPROPERTY` — document property field (built-in or custom property by name). */
    FieldDocProperty = 'DOCPROPERTY',
    /** `COMMENTS` — comments field. */
    FieldComments = 'COMMENTS',
    /** `COMPARE` — compare field. */
    FieldCompare = 'COMPARE',
    /** `CREATEDATE` — creation date field. */
    FieldCreateDate = 'CREATEDATE',
    /** `DATA` — data field. */
    FieldData = 'DATA',
    /** `DATABASE` — database field. */
    FieldDatabase = 'DATABASE',
    /** `DATE` — date field. */
    FieldDate = 'DATE',
    /** `DDE` — DDE field. */
    FieldDDE = 'DDE',
    /** `DDEAUTO` — DDE auto field. */
    FieldDDEAuto = 'DDEAUTO',
    /** `EDITTIME` — edit time field. */
    FieldEditTime = 'EDITTIME',
    /** `EXPRESSION` — expression field. */
    FieldExpression = '=',
    /** `FILENAME` — file name field. */
    FieldFileName = 'FILENAME',
    /** `FILESIZE` — file size field. */
    FieldFileSize = 'FILESIZE',
    /** `FILLIN` — fill-in field. */
    FieldFillIn = 'FILLIN',
    /** `FOOTNOTEREF` — footnote reference field. */
    FieldFootnoteRef = 'FOOTNOTEREF',
    /** `FORMULA` — formula field. */
    FieldFormula = '=',
    /** `GLOSSARY` — glossary field. */
    FieldGlossary = 'GLOSSARY',
    /** `GOTOBUTTON` — go-to button field. */
    FieldGoToButton = 'GOTOBUTTON',
    /** `HTMLCONTROL` — HTML ActiveX control field. */
    FieldHTMLActiveX = 'HTMLCONTROL',
    /** `IMPORT` — import field. */
    FieldImport = 'IMPORT',
    /** `INCLUDE` — include field. */
    FieldInclude = 'INCLUDE',
    /** `INCLUDEPICTURE` — include picture field. */
    FieldIncludePicture = 'INCLUDEPICTURE',
    /** `INCLUDETEXT` — include text field. */
    FieldIncludeText = 'INCLUDETEXT',
    /** `INDEX` — index field. */
    FieldIndex = 'INDEX',
    /** `XE` — index entry field. */
    FieldIndexEntry = 'XE',
    /** `INFO` — document info field. */
    FieldInfo = 'INFO',
    /** `KEYWORDS` — keywords field. */
    FieldKeyWord = 'KEYWORDS',
    /** `LASTSAVEDBY` — last saved by field. */
    FieldLastSavedBy = 'LASTSAVEDBY',
    /** `LINK` — link field. */
    FieldLink = 'LINK',
    /** `LISTNUM` — list number field. */
    FieldListNum = 'LISTNUM',
    /** `MACROBUTTON` — macro button field. */
    FieldMacroButton = 'MACROBUTTON',
    /** `MERGEREC` — merge record field. */
    FieldMergeRec = 'MERGEREC',
    /** `MERGESEQ` — merge sequence field. */
    FieldMergeSeq = 'MERGESEQ',
    /** `NEXT` — next field. */
    FieldNext = 'NEXT',
    /** `NEXTIF` — next if field. */
    FieldNextIf = 'NEXTIF',
    /** `NOTEREF` — note reference field. */
    FieldNoteRef = 'NOTEREF',
    /** `NUMCHARS` — number of characters field. */
    FieldNumChars = 'NUMCHARS',
    /** `NUMWORDS` — number of words field. */
    FieldNumWords = 'NUMWORDS',
    /** `CONTROL` — OCX control field. */
    FieldOCX = 'CONTROL',
    /** `PAGEREF` — page reference field. */
    FieldPageRef = 'PAGEREF',
    /** `PRINT` — print field. */
    FieldPrint = 'PRINT',
    /** `PRINTDATE` — print date field. */
    FieldPrintDate = 'PRINTDATE',
    /** `PRIVATE` — private field. */
    FieldPrivate = 'PRIVATE',
    /** `QUOTE` — quote field. */
    FieldQuote = 'QUOTE',
    /** `REF` — reference field. */
    FieldRef = 'REF',
    /** `RD` — reference document field. */
    FieldRefDoc = 'RD',
    /** `REVNUM` — revision number field. */
    FieldRevisionNum = 'REVNUM',
    /** `SAVEDATE` — save date field. */
    FieldSaveDate = 'SAVEDATE',
    /** `SECTION` — section field. */
    FieldSection = 'SECTION',
    /** `SECTIONPAGES` — section pages field. */
    FieldSectionPages = 'SECTIONPAGES',
    /** `SET` — set field. */
    FieldSet = 'SET',
    /** `SKIPIF` — skip if field. */
    FieldSkipIf = 'SKIPIF',
    /** `STYLEREF` — style reference field. */
    FieldStyleRef = 'STYLEREF',
    /** `SUBJECT` — document subject field. */
    FieldSubject = 'SUBJECT',
    /** `SUBSCRIBER` — subscriber field. */
    FieldSubscriber = 'SUBSCRIBER',
    /** `SYMBOL` — symbol field. */
    FieldSymbol = 'SYMBOL',
    /** `TEMPLATE` — template field. */
    FieldTemplate = 'TEMPLATE',
    /** `TIME` — time field. */
    FieldTime = 'TIME',
    /** `TITLE` — document title field. */
    FieldTitle = 'TITLE',
    /** `USERADDRESS` — user address field. */
    FieldUserAddress = 'USERADDRESS',
    /** `USERINITIALS` — user initials field. */
    FieldUserInitials = 'USERINITIALS',
    /** `USERNAME` — user name field. */
    FieldUserName = 'USERNAME',
    /** `SHAPE` — shape field. */
    FieldShape = 'SHAPE',
    /** `BIDIOUTLINE` — bidirectional outline field. */
    FieldBidiOutline = 'BIDIOUTLINE',
    /** `ADDRESSBLOCK` — address block field. */
    FieldAddressBlock = 'ADDRESSBLOCK',
    /** `SEQ` — sequence field. */
    FieldSequence = 'SEQ',
    /** Checkbox form field. */
    CheckBox = 'checkBox',
    /** Dropdown form field. */
    DropDown = 'dropDown',
    /** Text form field. */
    TextInput = 'textInput'
}

/**
 * Field begin marker (TextRange-based).
 *
 * Represents `w:fldChar` with `fldCharType="begin"` and acts as a
 * paragraph item itself, providing public field APIs.
 *
 * Inherits from TextRange to gain direct access to character formatting
 * infrastructure via the inherited characterFormat property from WireRunParagraphItem.
 * This eliminates the need for a separate characterFormat exposure.
 *
 * Structural model:
 * - Field (begin) → instruction TextRange(s) → FieldMark(separate) → result → FieldMark(end)
 *
 * @private
 */
export class Field extends TextRange {
    private readonly typeValue: FieldType;
    private readonly fldLockValue: boolean | undefined;
    private readonly dirtyValue: boolean | undefined;
    private readonly extrasValue: ReadonlyArray<OpenXmlElement>;
    private initialInstrText: string | undefined;
    /**
     * Flag indicating if this Field was originally a SimpleField (w:fldSimple).
     * Used during serialization to emit the correct XML format.
     *
     * @private
     */
    public readonly isSimpleFieldSource: boolean;
    /**
     * Internal flag tracking whether this field has been updated in the current pass.
     * Used during document-level field updates.
     *
     * @private
     */
    public isUpdated: boolean = false;

    /**
     * Create a field begin marker.
     *
     * @param {FieldType} type - The type.
     * @param {boolean | undefined} fldLock - The fld lock.
     * @param {boolean | undefined} dirty - The dirty.
     * @param {ReadonlyArray<OpenXmlElement>} extras - The extras.
     * @param {WireRunGroup} wireGroup - The wire group.
     * @param {string} instrText - The instr text.
     * @param {boolean} isSimpleFieldSource - Whether this was converted from a SimpleField.
     * @private
     */
    constructor(
        type: FieldType,
        fldLock: boolean | undefined,
        dirty: boolean | undefined,
        extras: ReadonlyArray<OpenXmlElement>,
        wireGroup?: WireRunGroup,
        instrText?: string,
        isSimpleFieldSource: boolean = false
    ) {
        super(undefined, wireGroup);
        this.typeValue = type;
        this.fldLockValue = fldLock;
        this.dirtyValue = dirty;
        this.extrasValue = extras;
        this.initialInstrText = instrText;
        this.isSimpleFieldSource = isSimpleFieldSource;
    }

    /**
     * The field type (PAGE, NUMPAGES, IF, MERGEFIELD, HYPERLINK).
     */
    get fieldType(): FieldType {
        return this.typeValue;
    }

    /**
     * Complete field instruction (e.g., " PAGE ", " MERGEFIELD Name ").
     *
     * Getter: Concatenates all directly owned instruction TextRanges.
     * Setter: Updates first instruction TextRange, clears others.
     */
    get fieldCode(): string {
        // Try initial instruction text first (set during field reconstruction)
        if (this.initialInstrText !== undefined) {
            return this.initialInstrText;
        }
        // Fall back to collecting from paragraph
        const paragraph: any = this.findParagraph();
        if (paragraph === undefined) {
            return '';
        }
        const ranges: ReadonlyArray<TextRange> = collectFieldInstructionRanges(paragraph, this);
        return concatenateTextRanges(ranges);
    }
    set fieldCode(value: string) {
        if (value.trim().length === 0) {
            throw new DocxError(
                'content/invalid-field',
                'Field instruction must not be empty'
            );
        }
        const keyword: string = value.trim().charAt(0) === '=' ? '=' : (/^\s*(\S+)/.exec(value) || ['', ''])[1]!.toUpperCase();
        if (keyword !== this.typeValue) {
            throw new DocxError(
                'content/invalid-field',
                'Field instruction keyword must match fieldType ' + this.typeValue
            );
        }

        const paragraph: any = this.findParagraph();
        if (paragraph === undefined) {
            throw new DocxError(
                'content/invalid-field',
                'Field is not attached to a paragraph'
            );
        }

        const ranges: ReadonlyArray<TextRange> = collectFieldInstructionRanges(paragraph, this);
        if (ranges.length > 0) {
            const first: TextRange = ranges[0];
            if (first !== undefined) {
                const trimmed: string = value.trim();
                const padded: string = ' ' + trimmed + ' ';
                first.text = padded;
                // The cached load-time instruction must follow the new code, or the getter returns stale text.
                if (this.initialInstrText !== undefined) {
                    this.initialInstrText = padded;
                }

                // Clear remaining ranges
                for (const r of ranges.slice(1)) {
                    if (r !== undefined) {
                        r.text = '';
                    }
                }
            }
        }
    }

    /**
     * Expression following the COMPARE keyword (for example `1=1`). Empty for other field types.
     */
    get compareExpression(): string {
        if (this.typeValue !== 'COMPARE') {
            return '';
        }
        return splitCompareSwitches(this.fieldCode.trim().replace(/^COMPARE\b\s*/i, '')).expression
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    }

    set compareExpression(value: string) {
        if (this.typeValue !== 'COMPARE') {
            throw new DocxError('content/invalid-field', 'compareExpression applies only to COMPARE fields');
        }
        const switches: string = splitCompareSwitches(this.fieldCode.trim().replace(/^COMPARE\b\s*/i, '')).switches;
        this.fieldCode = ' COMPARE ' + String(value).trim() + (switches.length > 0 ? ' ' + switches : '') + ' ';
    }

    /**
     * Cached field result text (read-only).
     */
    get fieldValue(): string {
        return this.text;
    }

    /**
     * Visible field result text.
     */
    get text(): string {
        const paragraph: any = this.findParagraph();
        if (paragraph === undefined) {
            return '';
        }
        const ranges: ReadonlyArray<TextRange> = collectFieldResultTextRanges(paragraph, this);
        return concatenateTextRanges(ranges);
    }

    set text(value: string) {
        const paragraph: any = this.findParagraph();
        if (paragraph === undefined) {
            throw new DocxError(
                'content/invalid-field',
                'Field is not attached to a paragraph'
            );
        }

        const ranges: ReadonlyArray<TextRange> = collectFieldResultTextRanges(paragraph, this);
        if (ranges.length === 0) {
            throw new DocxError(
                'content/invalid-field',
                'Field has no text result'
            );
        }

        const first: TextRange = ranges[0];
        if (first !== undefined) {
            first.text = value;
            for (const r of ranges.slice(1)) {
                if (r !== undefined) {
                    r.text = '';
                }
            }
        }
    }

    /**
     * Character formatting of the first result TextRange.
     */
    get characterFormat(): CharacterFormat {
        const paragraph: any = this.findParagraph();
        if (paragraph === undefined) {
            throw new DocxError(
                'content/invalid-field',
                'Field is not attached to a paragraph'
            );
        }
        let range: TextRange | undefined = this.firstResultTextRange(paragraph);

        // A field without result runs (e.g. `separate` immediately followed by `end`) gets an empty
        // TextRange inserted before its end marker so the field itself is preserved.
        if (range === undefined) {
            // Find this field's own end marker (skipping nested fields).
            const items: any = paragraph.items.snapshot();
            let endMarkerIndex : number = -1;
            let depth: number = 0;
            let seen: boolean = false;
            for (let i: number = 0; i < items.length; i++) {
                // eslint-disable-next-line security/detect-object-injection
                const item: any = items[i];
                if (item === this) {
                    seen = true;
                    continue;
                }
                if (!seen) {
                    continue;
                }
                if (item instanceof Field) {
                    depth += 1;
                } else if (item instanceof FieldMark && item.fieldMarkType === FieldMarkType.End) {
                    if (depth === 0) {
                        endMarkerIndex = i;
                        break;
                    }
                    depth -= 1;
                }
            }

            if (endMarkerIndex > -1) {
                const newRange: TextRange = new TextRange(undefined, new WireRunGroup());
                paragraph.items.insert(endMarkerIndex, newRange);
                range = newRange;
            }
        }

        if (range === undefined) {
            throw new DocxError(
                'content/invalid-field',
                'Field does not contain a text result'
            );
        }
        return range.characterFormat;
    }

    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [
            wmlAttr('fldCharType', 'begin')
        ];
        if (this.fldLockValue !== undefined) {
            attributes.push(wmlAttr('fldLock', this.fldLockValue ? '1' : '0'));
        }
        if (this.dirtyValue !== undefined) {
            attributes.push(wmlAttr('dirty', this.dirtyValue ? '1' : '0'));
        }
        return wmlElement('fldChar', {
            attributes: attributes,
            children: [...this.extrasValue]
        });
    }

    /**
     * Create an independent copy of this field.
     * All properties and extras are cloned; the wire group is independent.
     * The field begin marker is cloned with initial instruction text preserved.
     *
     * @returns {Field} Cloned field.
     * @public
     */
    clone(): Field {
        const clonedExtras: OpenXmlElement[] = [];
        for (const element of this.extrasValue) {
            clonedExtras.push(element);
        }
        return new Field(this.typeValue, this.fldLockValue, this.dirtyValue, clonedExtras, new WireRunGroup(), this.initialInstrText);
    }

    // Private helpers

    protected findParagraph(): any {
        const owner: ParagraphItemOwner = this.owner;
        // Check if owner is a Paragraph by duck-typing
        if (owner === undefined || typeof owner !== 'object') {
            return undefined;
        }
        // If it has items (ParagraphItemCollection), it's likely a Paragraph
        if ('items' in owner) {
            return owner;
        }
        return undefined;
    }

    protected firstResultTextRange(paragraph: any): TextRange | undefined {
        const ranges: ReadonlyArray<TextRange> = collectFieldResultTextRanges(paragraph, this);
        return ranges.length > 0 ? ranges[0] : undefined;
    }

    /**
     * Replace the field result text while preserving character formatting.
     * Used by all field evaluators to atomically update results.
     *
     * @param {string} newResult - The new result text.
     * @returns {void} Nothing is returned.
     * @private
     */
    private updateFieldResult(newResult: string): void {
        const paragraph: any = this.findParagraph();
        if (paragraph === undefined) {
            return;
        }

        try {
            // Collect current result ranges and capture formatting
            let ranges: ReadonlyArray<TextRange> = collectFieldResultTextRanges(paragraph, this);
            if (ranges.length === 0) {
                // Field has no result runs yet: create one so the new result can be stored.
                void this.characterFormat;
                ranges = collectFieldResultTextRanges(paragraph, this);
                if (ranges.length === 0) {
                    return;
                }
            }

            // Capture formatting from first range (snapshot)
            const firstRange: TextRange = ranges[0]!;
            const oldFormatSnapshot: any = firstRange.characterFormat.snapshot();

            // Clear old result text
            for (const r of ranges) {
                r.text = '';
            }

            // Insert new result in first range
            firstRange.text = newResult;

            // Reapply formatting using hydrate
            firstRange.characterFormat.hydrate(oldFormatSnapshot);
        } catch (e) {
            // Preserve old result on failure - do not throw
        }
    }

    /**
     * Updates the current field result when the field type is supported.
     * Unsupported and excluded field types retain their existing results.
     *
     * When called as part of document.updateDocumentFields(), the document's
     * sequence cache and update context are available. When called directly on
     * a SEQ field, a temporary sequence context is created.
     *
     * @returns {void} Nothing is returned.
     * @public
     */
    public update(): void {
        // Guard: field is not attached
        const paragraph: any = this.findParagraph();
        if (paragraph === undefined) {
            return;
        }

        // Mark as updated
        this.isUpdated = true;

        // Delegate to specialized update handler based on field type
        switch (this.fieldType) {
        case 'DATE':
        case 'TIME':
            this.updateDateOrTimeField();
            break;

        case 'CREATEDATE':
            this.updateCreateDateField();
            break;

        case '=':
            this.updateFormulaField();
            break;

        case 'COMPARE':
            this.updateCompareField();
            break;

        case 'IF':
            this.updateIfField();
            break;

        case 'DOCPROPERTY':
            this.updateDocumentPropertyField();
            break;

        case 'SECTION':
            this.updateSectionField();
            break;

        case 'REF':
            this.updateReferenceField();
            break;

        case 'TITLE':
            this.updateBuiltInDocumentProperty('Title');
            break;

        case 'SUBJECT':
            this.updateBuiltInDocumentProperty('Subject');
            break;

        case 'AUTHOR':
            this.updateBuiltInDocumentProperty('Author');
            break;

        case 'COMMENTS':
            this.updateBuiltInDocumentProperty('Comments');
            break;

        case 'SET':
            this.updateSetField();
            break;

        case 'SEQ':
            this.updateSequenceField();
            break;

            // Explicitly preserve these fields without recalculation
        case 'PAGE':
        case 'NUMPAGES':
        case 'SECTIONPAGES':
        case 'PAGEREF':
            // Preserve-only: do not update
            break;

        default:
            // Preserve unsupported field result
            break;
        }
    }

    /**
     * Update an IF field by evaluating its condition and displaying the appropriate result.
     *
     * @returns {void} Nothing is returned.
     * @public
     */
    private updateIfField(): void {
        try {
            const result: string | undefined = evaluateIfInstruction(this.instructionWithNestedResults());
            if (result !== undefined) {
                this.updateFieldResult(result);
            }
        } catch (e) {
            // Preserve old result on failure
        }
    }

    /**
     * Returns the instruction text with real nested fields (separate begin/end spans in the
     * instruction area) updated and replaced by their results. Original field codes are not modified.
     *
     * @returns {string} The instruction text.
     * @private
     */
    private instructionWithNestedResults(): string {
        const paragraph: any = this.findParagraph();
        if (paragraph === undefined) {
            return this.fieldCode;
        }
        const items: ReadonlyArray<any> = paragraph.items.snapshot();
        let text: string = '';
        let depth: number = 0;
        let active: boolean = false;
        let sawNested: boolean = false;
        for (const item of items) {
            if (item === this) {
                active = true;
                continue;
            }
            if (!active) {
                continue;
            }
            if (item instanceof Field) {
                if (depth === 0 && !(item instanceof FormField)) {
                    sawNested = true;
                    item.update();
                    const nestedText: string = concatenateTextRanges(collectFieldResultTextRanges(paragraph, item));
                    const inQuote: boolean = (text.match(/"/g) || []).length % 2 === 1;
                    text += inQuote ? nestedText : '"' + nestedText + '"';
                }
                depth += 1;
                continue;
            }
            if (item instanceof FieldMark) {
                if (item.fieldMarkType === FieldMarkType.Separator && depth === 0) {
                    break;
                }
                if (item.fieldMarkType === FieldMarkType.End) {
                    if (depth === 0) {
                        break;
                    }
                    depth -= 1;
                }
                continue;
            }
            if (depth === 0 && item instanceof TextRange) {
                text += item.text;
            }
        }
        return sawNested ? text : this.fieldCode;
    }

    /**
     * Update a DATE or TIME field.
     *
     * Uses the current date/time and formats according to field switches.
     * Respects document disable-date-time-update settings when available.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private updateDateOrTimeField(): void {
        try {
            const isTime: boolean = this.fieldType === 'TIME';
            const now: Date = new Date();

            // Extract format string from field code (@ switch)
            const formatString: string | undefined = extractFormatSwitch(this.fieldCode, '@');

            let result: string;
            if (formatString) {
                // Apply custom format
                result = formatDateTime(now, formatString, isTime);
            } else {
                // Apply default format
                result = isTime
                    ? now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    : now.toLocaleDateString('en-US');
            }

            this.updateFieldResult(result);
        } catch (e) {
            // Preserve old result on failure
        }
    }

    /**
     * Update a CREATEDATE field.
     *
     * Reads the document creation date from core properties.
     * If unavailable, preserves the current result.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private updateCreateDateField(): void {
        try {
            const paragraph: any = this.findParagraph();
            if (paragraph === undefined) {
                return;
            }

            const document: any = paragraph.owningDocument();
            if (document === undefined) {
                return;
            }

            const raw: string | number | boolean | Date | undefined = resolveDocumentPropertyValue(document, 'CreateDate');
            let createdDate: Date | undefined = raw instanceof Date ? raw : undefined;

            if (createdDate === undefined) {
                // A document built from scratch has no creation date yet: stamp it now (as Word does
                // for a new document) so the value is stable across later updates and saves.
                const builtin: any = document.builtinDocumentProperties;
                if (builtin === undefined || builtin === null) {
                    return;
                }
                createdDate = new Date();
                builtin.createDate = createdDate;
            }

            // Extract format string from field code (@ switch)
            const formatString: string | undefined = extractFormatSwitch(this.fieldCode, '@');

            let result: string;
            if (formatString) {
                result = formatDateTime(createdDate, formatString, false);
            } else {
                result = createdDate.toLocaleDateString('en-US');
            }

            this.updateFieldResult(result);
        } catch (e) {
            // Preserve old result on failure
        }
    }

    /**
     * Update a FORMULA or EXPRESSION field.
     *
     * Evaluates supported formulas using safe expression evaluation.
     * Does not use JavaScript eval(). Preserves result for unsupported formulas.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private updateFormulaField(): void {
        try {
            // Extract formula from field code
            const instruction: string = this.fieldCode.trim();
            let formula: string = '';

            // Word stores a formula field as "= expression [switches]"; stop at the first switch.
            // eslint-disable-next-line security/detect-unsafe-regex -- pattern runs on short, bounded field-instruction text
            const match: RegExpExecArray | null = /^\s*=\s*(.+?)\s*(?:\\[#@*].*)?$/.exec(instruction);
            if (match !== null && match[1] != null) {
                formula = match[1];
            } else {
                return;
            }

            formula = formula.trim();
            if (formula.length === 0) {
                return;
            }

            // Evaluate using safe evaluator
            let result: number | undefined;
            try {
                result = evaluateSafeExpression(formula);
            } catch (e) {
                // Unsupported formula - preserve old result
                return;
            }

            if (result === undefined) {
                // Could not evaluate - preserve old result
                return;
            }

            // Format result
            const numberFormat: string | undefined = extractFormatSwitch(this.fieldCode, '#');
            const resultStr: string = numberFormat
                ? formatNumber(result, numberFormat)
                : formatFormulaResult(result);

            this.updateFieldResult(resultStr);
        } catch (e) {
            // Preserve old result on failure
        }
    }

    /**
     * Update a COMPARE field.
     *
     * Compares two operands and returns true or false based on operator.
     * Numeric comparison when both operands are numeric, otherwise text comparison.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private updateCompareField(): void {
        try {
            const expression: string = this.compareExpression;
            const match: RegExpExecArray | null = /^\s*("[^"]*"|[^\s<>=!"]+)\s*(<>|<=|>=|==|!=|=|<|>)\s*("[^"]*"|\S+)\s*$/.exec(expression);
            if (match === null) {
                return;
            }
            const operand1Str: string = unquoteOperand(match[1]!);
            const operator: string = match[2]!;
            const operand2Str: string = unquoteOperand(match[3]!);

            // Try numeric comparison first
            const num1: number = parseFloat(operand1Str);
            const num2: number = parseFloat(operand2Str);
            const isNumeric: boolean = !isNaN(num1) && !isNaN(num2);

            let comparisonResult: boolean = false;
            if (isNumeric) {
                switch (operator) {
                case '=':
                case '==':
                    comparisonResult = num1 === num2;
                    break;
                case '<>':
                case '!=':
                    comparisonResult = num1 !== num2;
                    break;
                case '<':
                    comparisonResult = num1 < num2;
                    break;
                case '<=':
                    comparisonResult = num1 <= num2;
                    break;
                case '>':
                    comparisonResult = num1 > num2;
                    break;
                case '>=':
                    comparisonResult = num1 >= num2;
                    break;
                }
            } else {
                // Text comparison
                switch (operator) {
                case '=':
                case '==':
                    comparisonResult = operand1Str === operand2Str;
                    break;
                case '<>':
                case '!=':
                    comparisonResult = operand1Str !== operand2Str;
                    break;
                case '<':
                    comparisonResult = operand1Str < operand2Str;
                    break;
                case '<=':
                    comparisonResult = operand1Str <= operand2Str;
                    break;
                case '>':
                    comparisonResult = operand1Str > operand2Str;
                    break;
                case '>=':
                    comparisonResult = operand1Str >= operand2Str;
                    break;
                }
            }

            // Update result to true or false representation
            const result: string = comparisonResult ? '1' : '0';
            this.updateFieldResult(result);
        } catch (e) {
            // Preserve old result on failure
        }
    }

    /**
     * Update a DOCPROPERTY field.
     *
     * Resolves custom or built-in document properties.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private updateDocumentPropertyField(): void {
        try {
            const match: RegExpExecArray | null = /^\s*DOCPROPERTY\s+(?:"([^"]+)"|(\S+))/i.exec(this.fieldCode);
            if (match === null) {
                return;
            }
            const propertyName: string = match[1] !== undefined ? match[1] : match[2];
            if (propertyName === undefined || propertyName.length === 0) {
                return;
            }

            const paragraph: any = this.findParagraph();
            if (paragraph === undefined) {
                return;
            }
            const document: any = paragraph.owningDocument();
            if (document === undefined) {
                return;
            }

            const rawValue: string | number | boolean | Date | undefined = resolveDocumentPropertyValue(document, propertyName);
            if (rawValue === undefined) {
                // Property not found - preserve old result
                return;
            }

            const numberFormat: string | undefined = extractFormatSwitch(this.fieldCode, '#');
            const dateFormat: string | undefined = extractFormatSwitch(this.fieldCode, '@');

            let result: string;
            if (rawValue instanceof Date) {
                result = formatDateTime(rawValue, dateFormat ? dateFormat : 'M/d/yyyy', false);
            } else if (typeof rawValue === 'boolean') {
                result = rawValue ? 'Yes' : 'No';
            } else if (numberFormat && !isNaN(parseFloat(String(rawValue)))) {
                result = formatNumber(parseFloat(String(rawValue)), numberFormat);
            } else if (dateFormat && !isNaN(new Date(String(rawValue)).getTime())) {
                result = formatDateTime(new Date(String(rawValue)), dateFormat, false);
            } else {
                result = String(rawValue);
            }

            this.updateFieldResult(result);
        } catch (e) {
            // Preserve old result on failure
        }
    }

    /**
     * Update a built-in document property field (TITLE, SUBJECT, AUTHOR, COMMENTS).
     *
     * @param {string} propertyName - The property name.
     * @returns {void} Nothing is returned.
     * @private
     */
    protected updateBuiltInDocumentProperty(propertyName: string): void {
        try {
            const paragraph: any = this.findParagraph();
            if (paragraph === undefined) {
                return;
            }

            const document: any = paragraph.owningDocument();
            if (document === undefined) {
                return;
            }

            const value: string | number | boolean | Date | undefined = resolveDocumentPropertyValue(document, propertyName);
            if (value === undefined || value instanceof Date) {
                // Property not found - preserve old result
                return;
            }
            const propertyValue: string = String(value);

            this.updateFieldResult(propertyValue);
        } catch (e) {
            // Preserve old result on failure
        }
    }

    /**
     * Update a SECTION field.
     *
     * Resolves the one-based section index of the owning section.
     * Does not require page layout.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private updateSectionField(): void {
        try {
            const paragraph: any = this.findParagraph();
            if (paragraph === undefined) {
                return;
            }

            // Get the document
            const document: any = paragraph.owningDocument();
            if (document === undefined || typeof document.sections !== 'object') {
                return;
            }

            // Find the section containing this paragraph
            let sectionIndex: number = 1;
            let index: number = 0;
            for (const section of document.sections as Iterable<any>) {
                index += 1;
                if (section != null && section.body != null && this.isInBody(paragraph, section.body)) {
                    sectionIndex = index;
                    break;
                }
            }

            // Update result
            this.updateFieldResult(formatSectionNumber(sectionIndex, this.fieldCode));
        } catch (e) {
            // Preserve old result on failure
        }
    }

    /**
     * Check if a paragraph is contained in a body.
     *
     * @param {any} paragraph - The paragraph.
     * @param {any} body - The body.
     * @returns {boolean} True if paragraph is in body.
     * @private
     */
    private isInBody(paragraph: any, body: any): boolean {
        if (body == null || body.items == null || typeof body.items[Symbol.iterator] !== 'function') {
            return false;
        }
        for (const item of body.items as Iterable<any>) {
            if (item === paragraph || (item != null && item.paragraph === paragraph)) {
                return true;
            }
            const table: any = item != null && item.table != null ? item.table : item;
            if (table != null && table.rows != null && this.isInTable(paragraph, table)) {
                return true;
            }
            if (item != null && item.body != null && this.isInBody(paragraph, item.body)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if a paragraph is in a table.
     *
     * @param {any} paragraph - The paragraph.
     * @param {any} table - The table.
     * @returns {boolean} True if paragraph is in table.
     * @private
     */
    private isInTable(paragraph: any, table: any): boolean {
        if (table == null || table.rows == null || typeof table.rows[Symbol.iterator] !== 'function') {
            return false;
        }
        for (const row of table.rows as Iterable<any>) {
            if (row == null || row.cells == null) {
                continue;
            }
            for (const cell of row.cells as Iterable<any>) {
                if (this.isInBody(paragraph, cell)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Update a REF field.
     *
     * Resolves the bookmark content and displays it.
     * Updated in the second pass after non-REF fields have been updated.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private updateReferenceField(): void {
        try {
            const instruction: string = this.fieldCode.trim();
            const tokens: string[] = tokenizeFieldInstruction(instruction);
            const bookmarkName: string = tokens.length > 1 ? tokens[1]! : '';
            if (bookmarkName.length === 0 || bookmarkName.charAt(0) === '\\') {
                this.updateFieldResult('Error! Bookmark not found.');
                return;
            }
            const paragraph: any = this.findParagraph();
            if (paragraph === undefined) {
                return;
            }
            const document: any = paragraph.owningDocument();
            let content: string | undefined;
            if (document != null && document.bookmarks != null && typeof document.bookmarks.getContent === 'function') {
                content = document.bookmarks.getContent(bookmarkName);
            }
            if (content === undefined) {
                this.updateFieldResult('Error! Bookmark not found.');
                return;
            }
            for (let i: number = 2; i < tokens.length; i += 1) {
                // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
                if (tokens[i] === '\\*' && i + 1 < tokens.length) {
                    content = applyTextCaseSwitch(content, tokens[i + 1]!);
                }
            }
            this.updateFieldResult(content);
        } catch (e) {
            // Preserve old result on failure
        }
    }

    /**
     * Update a SET field.
     *
     * Parses the assignment (variable name and value), stores it in the document's
     * variable collection, and updates the result.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private updateSetField(): void {
        try {
            // Parse SET instruction: SET varname value
            const instruction: string = this.fieldCode.trim();
            const tokens: string[] = tokenizeFieldInstruction(instruction);

            if (tokens.length < 3) {
                return;
            }

            // Skip SET keyword
            let idx: number = 0;
            // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
            while (idx < tokens.length && tokens[idx]!.toUpperCase() === 'SET') {
                idx += 1;
            }

            if (idx + 1 >= tokens.length) {
                return;
            }

            // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
            const variableName: string = unquoteOperand(tokens[idx]!);
            const variableValue: string = unquoteOperand(tokens[idx + 1]!);

            if (variableName.length === 0) {
                return;
            }

            const paragraph: any = this.findParagraph();
            if (paragraph === undefined) {
                return;
            }

            const document: any = paragraph.owningDocument();
            if (document === undefined) {
                return;
            }

            // Store the value in document variables
            if (document.variables != null && typeof document.variables === 'object') {
                if (typeof document.variables.setValue === 'function') {
                    try {
                        document.variables.setValue(variableName, variableValue);
                    } catch (e) {
                        // Failed to set variable
                    }
                }
            }

            // SET field result typically shows the value
            this.updateFieldResult(variableValue);
        } catch (e) {
            // Preserve old result on failure
        }
    }

    /**
     * Update a SEQ (sequence) field (private implementation).
     *
     * This method retrieves the pre-calculated sequence value for THIS SPECIFIC FIELD
     * from the document's sequenceFieldValues WeakMap, which was populated during the
     * document-order traversal in updateDocumentFields().
     *
     * Each field gets its own value (not the global final state), ensuring correct
     * numbering even when fields are processed out of order.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private doUpdateSequenceField(): void {
        try {
            const paragraph: any = this.findParagraph();
            if (paragraph === undefined) {
                return;
            }

            const document: any = paragraph.owningDocument();
            if (document === undefined) {
                return;
            }

            const seqBookmark: string = parseSeqInstruction(this.fieldCode).bookmarkName;
            if (seqBookmark.length > 0 && document.bookmarks != null &&
                document.bookmarks.findByName(seqBookmark) === undefined) {
                this.updateFieldResult('Error! Bookmark not defined.');
                return;
            }

            // Get this field's pre-calculated value from WeakMap
            // Each field has its own value, not the global cache state
            const sequenceFieldValues: any = (document as any).sequenceFieldValues;
            if (sequenceFieldValues === undefined || typeof sequenceFieldValues !== 'object') {
                // This field is being updated outside of updateDocumentFields() context
                // (no pre-processing, no WeakMap populated)
                // Calculate sequence value directly using a temporary cache
                this.calculateSeqFieldValueDirectly();
                return;
            }

            // We're in updateDocumentFields() context, retrieve pre-calculated value
            let nextValue: number = 0;
            try {
                const fieldValue: number | undefined = sequenceFieldValues.get(this);
                nextValue = (fieldValue !== undefined && fieldValue !== null) ? fieldValue : 0;
            } catch (e) {
                // WeakMap.get() might fail for non-objects, calculate directly
                this.calculateSeqFieldValueDirectly();
                return;
            }

            // If still no value (field not pre-processed for some reason), calculate directly
            if (nextValue === 0) {
                this.calculateSeqFieldValueDirectly();
                return;
            }

            // Format the result based on switches
            let result: string = String(nextValue);

            // Check for formatting switches
            const numberFormatSwitch: string | undefined = extractSeqSwitchValue(this.fieldCode, '*');
            const formattingString: string | undefined = extractSeqSwitchValue(this.fieldCode, '#');

            if (formattingString) {
                // Use formatting string from \# switch
                result = formatSeqNumbering(nextValue, formattingString);
            } else if (numberFormatSwitch) {
                // Try to find matching CaptionNumberingFormat
                let numberFormat: CaptionNumberingFormat = CaptionNumberingFormat.Arabic;
                for (const [format, switchText] of objectEntries(CAPTION_FORMAT_SWITCH)) {
                    if (switchText === numberFormatSwitch) {
                        numberFormat = format as CaptionNumberingFormat;
                        break;
                    }
                }
                // Use number format from \* switch
                result = formatNumberingFormat(nextValue, numberFormat);
            }

            this.updateFieldResult(hasSeqSwitch(this.fieldCode, 'H') ? '' : result);
        } catch (e) {
            // Preserve old result on failure
        }
    }

    /**
     * Calculate SEQ field value directly (fallback when called outside updateDocumentFields).
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private calculateSeqFieldValueDirectly(): void {
        try {
            const paragraph: any = this.findParagraph();
            if (paragraph === undefined) {
                return;
            }

            const document: any = paragraph.owningDocument();
            if (document === undefined) {
                return;
            }

            // Parse SEQ instruction to get caption name
            const parsed: any = parseSeqInstruction(this.fieldCode);
            const captionName: string = ((parsed.captionName || 'Sequence') +
                (parsed.bookmarkName ? '|' + parsed.bookmarkName : '')).toLowerCase();

            // Get or create sequence cache (temporary, not from document update context)
            let sequenceCache: any = (document as any).sequenceFieldResultsTemporary;
            if (sequenceCache === undefined) {
                sequenceCache = new Map<string, number>();
                (document as any).sequenceFieldResultsTemporary = sequenceCache;
            }

            // Get current sequence value
            let sequenceValue: number = 0;
            if (sequenceCache instanceof Map) {
                const mapValue: number | undefined = sequenceCache.get(captionName);
                sequenceValue = (mapValue !== undefined && mapValue !== null) ? mapValue : 0;
            } else if (typeof sequenceCache === 'object') {
                // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
                const objValue: any = sequenceCache[captionName];
                sequenceValue = (objValue !== undefined && objValue !== null) ? objValue : 0;
            }

            // Check for special switches
            let nextValue: number = sequenceValue;

            // \r switch: reset number to specified value
            const resetSwitch: string | undefined = extractSeqSwitchValue(this.fieldCode, 'r');
            if (resetSwitch) {
                try {
                    nextValue = parseInt(resetSwitch, 10);
                    if (isNaN(nextValue)) {
                        nextValue = sequenceValue + 1;
                    }
                } catch (e) {
                    nextValue = sequenceValue + 1;
                }
            } else if (hasSeqSwitch(this.fieldCode, 'n')) {
                // \n switch: insert next number (increment)
                nextValue = sequenceValue + 1;
            } else if (hasSeqSwitch(this.fieldCode, 'c')) {
                // \c switch: repeat current number (don't increment)
                nextValue = sequenceValue;
            } else {
                // Default: increment
                nextValue = sequenceValue + 1;
            }

            // Update cache
            if (sequenceCache instanceof Map) {
                sequenceCache.set(captionName, nextValue);
            } else {
                // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
                sequenceCache[captionName] = nextValue;
            }

            // Store cache back in document
            (document as any).sequenceFieldResultsTemporary = sequenceCache;

            // Format and update result
            let result: string = String(nextValue);

            const numberFormatSwitch: string | undefined = extractSeqSwitchValue(this.fieldCode, '*');
            const formattingString: string | undefined = extractSeqSwitchValue(this.fieldCode, '#');

            if (formattingString) {
                result = formatSeqNumbering(nextValue, formattingString);
            } else if (numberFormatSwitch) {
                let numberFormat: CaptionNumberingFormat = CaptionNumberingFormat.Arabic;
                for (const [format, switchText] of objectEntries(CAPTION_FORMAT_SWITCH)) {
                    if (switchText === numberFormatSwitch) {
                        numberFormat = format as CaptionNumberingFormat;
                        break;
                    }
                }
                result = formatNumberingFormat(nextValue, numberFormat);
            }

            this.updateFieldResult(hasSeqSwitch(this.fieldCode, 'H') ? '' : result);
        } catch (e) {
            // Preserve old result on failure
        }
    }

    /**
     * Update a SEQ (sequence) field.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    private updateSequenceField(): void {
        this.doUpdateSequenceField();
    }
}

/**
 * IF field (conditional).
 *
 * @private
 */
export class IfField extends Field {
    // No additional members - expression lives in fieldCode

}

/**
 * MERGEFIELD (mail merge).
 *
 * @private
 */
export class MergeField extends Field {
    /**
     * Field name (first operand of MERGEFIELD instruction).
     */
    get fieldName(): string {
        const parsed: any = parseMergeFieldInstruction(this.fieldCode);
        return parsed.fieldName;
    }

    set fieldName(value: string) {
        const name: string = value.trim();
        if (name.length === 0) {
            throw new DocxError(
                'content/invalid-field',
                'MergeField fieldName must not be empty'
            );
        }
        const parsed: any = parseMergeFieldInstruction(this.fieldCode);
        parsed.fieldName = name;
        this.fieldCode = formatMergeFieldInstruction(parsed);
    }
}

// ============================================================================
// SeqField Helper Functions
// ============================================================================

/**
 * Parse SEQ field instruction into structured components.
 * Format: SEQ Identifier [Bookmark] [Switches]
 *
 * @param {string} instruction - The field instruction.
 * @returns {Object} Parsed components.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- internal parsing result type
function parseSeqInstruction(instruction: string): any {
    const tokens: string[] = tokenizeFieldInstruction(instruction);
    const result: any = {
        captionName: '',
        bookmarkName: '',
        switches: new Map<string, string | boolean>()
    };

    let operandIndex: number = 0;
    let i: number = 0;

    // Skip SEQ keyword
    // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
    while (i < tokens.length && tokens[i].toUpperCase() === 'SEQ') {
        i += 1;
    }

    // Parse operands and switches
    while (i < tokens.length) {
        // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
        const token: string = tokens[i];

        if (token.charAt(0) === '\\') {
            // It's a switch
            const switchChar: string = token.substring(1).toUpperCase();
            if (switchChar === 'N' || switchChar === 'C' || switchChar === 'H') {
                result.switches.set(switchChar, true);
                i += 1;
            } else if (switchChar === '#' || switchChar === 'R' || switchChar === 'S') {
                if (i + 1 < tokens.length) {
                    result.switches.set(switchChar, unquoteOperand(tokens[i + 1]));
                    i += 2;
                } else {
                    i += 1;
                }
            } else if (switchChar === '*') {
                // A field can carry several general-formatting switches, e.g.
                // "SEQ Image \* MERGEFORMAT \* roman \* MERGEFORMAT" (ECMA-376-1
                // §17.16.4.3: MERGEFORMAT only preserves result formatting; it is
                // not a number format). Keep the last recognized number-format
                // argument (ECMA-376-1 §17.16.4.3.1) so it is not clobbered by a
                // later MERGEFORMAT; fall back to the last unrecognized argument
                // so unknown switches survive a parse/rebuild round-trip.
                if (i + 1 < tokens.length) {
                    const starArgument: string = unquoteOperand(tokens[i + 1]);
                    let canonicalFormat: string | undefined;
                    for (const [, switchText] of objectEntries(CAPTION_FORMAT_SWITCH)) {
                        const exact: boolean = switchText === starArgument;
                        const loose: boolean = canonicalFormat === undefined &&
                            switchText.toLowerCase() === starArgument.toLowerCase();
                        if (exact || loose) {
                            canonicalFormat = switchText;
                            if (exact) {
                                break;
                            }
                        }
                    }
                    if (canonicalFormat !== undefined || !result.switches.has('*')) {
                        result.switches.set('*', canonicalFormat !== undefined ? canonicalFormat : starArgument);
                    }
                    i += 2;
                } else {
                    i += 1;
                }
            } else {
                i += 1;
            }
        } else {
            // It's an operand
            const operand: string = unquoteOperand(token);
            if (operandIndex === 0) {
                result.captionName = operand;
            } else if (operandIndex === 1) {
                result.bookmarkName = operand;
            }
            operandIndex += 1;
            i += 1;
        }
    }

    return result;
}

/**
 * Rebuild SEQ field instruction from parsed components.
 * Format: SEQ Identifier [Bookmark] [Switches]
 *
 * @param {Object} parsed - Parsed components.
 * @returns {string} The rebuilt instruction.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- internal parsing result type
function buildSeqInstruction(parsed: any): string {
    let code: string = ' SEQ';

    // Add caption name (required)
    if (parsed.captionName.length > 0) {
        code += ' ' + quoteFieldOperand(parsed.captionName);
    }

    // Add bookmark name if present
    if (parsed.bookmarkName.length > 0) {
        code += ' ' + quoteFieldOperand(parsed.bookmarkName);
    }

    // Add switches in proper order
    if (parsed.switches.has('#')) {
        const val: string = parsed.switches.get('#');
        code += ' \\# ' + quoteFieldOperand(val);
    }
    if (parsed.switches.has('*')) {
        const val: string = parsed.switches.get('*');
        code += ' \\* ' + val;
    }
    if (parsed.switches.has('N')) {
        code += ' \\n';
    }
    if (parsed.switches.has('C')) {
        code += ' \\c';
    }
    if (parsed.switches.has('H')) {
        code += ' \\h';
    }
    if (parsed.switches.has('R')) {
        const val: string = parsed.switches.get('R');
        code += ' \\r ' + val;
    }
    if (parsed.switches.has('S')) {
        const val: string = parsed.switches.get('S');
        code += ' \\s ' + val;
    }

    return code + ' ';
}

/**
 * Extract the value of a switch from a field instruction.
 *
 * @param {string} instruction - The field instruction.
 * @param {string} switchChar - The switch character (e.g., '*' for `\*`).
 * @returns {string | undefined} The switch value, or undefined if not found.
 * @private
 */
function extractSeqSwitchValue(instruction: string, switchChar: string): string | undefined {
    const parsed: any = parseSeqInstruction(instruction);
    const val: string | boolean | undefined = parsed.switches.get(switchChar.toUpperCase());
    if (typeof val === 'string') {
        return val;
    }
    return undefined;
}

/**
 * Update or add a switch value in a field instruction.
 *
 * @param {string} instruction - The field instruction.
 * @param {string} switchChar - The switch character.
 * @param {string | boolean} value - The new value.
 * @returns {string} The updated instruction.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- internal parsing result type
function updateSeqSwitch(instruction: string, switchChar: string, value: string | boolean): string {
    const parsed: any = parseSeqInstruction(instruction);
    const switchKey: string = switchChar.toUpperCase();

    if (value === false || value === '') {
        parsed.switches.delete(switchKey);
    } else {
        parsed.switches.set(switchKey, value);
    }

    return buildSeqInstruction(parsed);
}

/**
 * Update caption and bookmark names in field instruction.
 *
 * @param {string} instruction - The field instruction.
 * @param {string} captionName - The caption name.
 * @param {string} bookmarkName - The bookmark name.
 * @returns {string} The updated instruction.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- internal parsing result type
function updateSeqOperands(instruction: string, captionName: string, bookmarkName: string): string {
    const parsed: any = parseSeqInstruction(instruction);
    parsed.captionName = captionName;
    parsed.bookmarkName = bookmarkName;
    return buildSeqInstruction(parsed);
}

/**
 * Check if a switch is present in the field instruction.
 *
 * @param {string} instruction - The field instruction.
 * @param {string} switchChar - The switch character.
 * @returns {boolean} True if the switch is present.
 * @private
 */
function hasSeqSwitch(instruction: string, switchChar: string): boolean {
    const parsed: any = parseSeqInstruction(instruction);
    return parsed.switches.has(switchChar.toUpperCase());
}

interface IfToken { text: string; quoted: boolean }

function tokenizeIfBody(body: string): IfToken[] {
    const tokens: IfToken[] = [];
    let i: number = 0;
    const skipBraces: (start: number) => number = (start: number): number => {
        // returns index just after the balanced brace group beginning at start
        let d: number = 0;
        let j: number = start;
        while (j < body.length) {
            const c: string = body.charAt(j);
            if (c === '{') { d++; } else if (c === '}') { d--; if (d === 0) { return j + 1; } }
            j++;
        }
        return body.length;
    };
    while (i < body.length) {
        const ch: string = body.charAt(i);
        if (/\s/.test(ch)) { i++; continue; }
        if (ch === '"') {
            let j: number = i + 1;
            while (j < body.length && body.charAt(j) !== '"') {
                j = body.charAt(j) === '{' ? skipBraces(j) : j + 1;
            }
            tokens.push({ text: body.substring(i + 1, j), quoted: true });
            i = j + 1;
            continue;
        }
        const op: RegExpExecArray | null = /^(<>|<=|>=|=|<|>)/.exec(body.substring(i));
        if (op !== null) { tokens.push({ text: op[1]!, quoted: false }); i += op[1]!.length; continue; }
        let j: number = i;
        while (j < body.length && !/[\s"<>=]/.test(body.charAt(j))) {
            j = body.charAt(j) === '{' ? skipBraces(j) : j + 1;
        }
        if (j === i) { j = i + 1; }
        tokens.push({ text: body.substring(i, j), quoted: false });
        i = j;
    }
    return tokens;
}

/**
 * Replace every top-level `{ ... }` group with its evaluated value (IF groups are evaluated recursively).
 *
 * @param {string} text - The text containing nested brace groups.
 * @returns {string} The text with the groups resolved.
 * @private
 */
function resolveNestedBraces(text: string): string {
    let out: string = '';
    let i: number = 0;
    while (i < text.length) {
        if (text.charAt(i) !== '{') { out += text.charAt(i); i++; continue; }
        let d: number = 0;
        let j: number = i;
        while (j < text.length) {
            if (text.charAt(j) === '{') { d++; } else if (text.charAt(j) === '}') { d--; if (d === 0) { break; } }
            j++;
        }
        if (d !== 0) { out += text.substring(i); break; }
        const inner: string = text.substring(i + 1, j).trim();
        const value: string | undefined = /^IF\b/i.test(inner) ? evaluateIfInstruction(inner) : undefined;
        out += value !== undefined ? value : text.substring(i, j + 1);
        i = j + 1;
    }
    return out;
}

/**
 * Evaluates an IF instruction. Nested `{ IF ... }` groups in the operands are resolved first;
 * only the selected branch is then resolved. Returns undefined when the instruction is malformed.
 *
 * @param {string} instruction - The IF instruction text.
 * @returns {string | undefined} The evaluated value, or undefined when malformed.
 * @private
 */
function evaluateIfInstruction(instruction: string): string | undefined {
    const body: string = splitCompareSwitches(instruction.trim().replace(/^IF\b\s*/i, '')).expression
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const tokens: IfToken[] = tokenizeIfBody(body);
    if (tokens.length < 5 || tokens[1]!.quoted || !/^(<>|<=|>=|=|<|>)$/.test(tokens[1]!.text)) {
        return undefined;
    }
    const left: string = resolveNestedBraces(tokens[0]!.text).trim();
    const right: string = resolveNestedBraces(tokens[2]!.text).trim();
    const outcome: boolean = evaluateFieldComparison(left, tokens[1]!.text, right);
    return resolveNestedBraces(outcome ? tokens[3]!.text : tokens[4]!.text);
}

/**
 * Compare two operands: numerically when both are numbers, otherwise as strings.
 *
 * @param {string} left - Left operand.
 * @param {string} operator - One of `=`, `<>`, `<`, `<=`, `>`, `>=`.
 * @param {string} right - Right operand.
 * @returns {boolean} The comparison outcome.
 * @private
 */
function evaluateFieldComparison(left: string, operator: string, right: string): boolean {
    const n1: number = left.trim() === '' ? NaN : Number(left);
    const n2: number = right.trim() === '' ? NaN : Number(right);
    const numeric: boolean = !isNaN(n1) && !isNaN(n2);
    const a: number | string = numeric ? n1 : left;
    const b: number | string = numeric ? n2 : right;
    switch (operator) {
    case '=': return a === b;
    case '<>': return a !== b;
    case '<': return a < b;
    case '<=': return a <= b;
    case '>': return a > b;
    default: return a >= b;
    }
}

/**
 * Split COMPARE body into expression and trailing backslash switches (outside quotes).
 *
 * @param {string} body - Text after COMPARE.
 * @returns {Object} The parts (expression and switches).
 * @private
 */
function splitCompareSwitches(body: string): { expression: string; switches: string } {
    let inQuotes: boolean = false;
    for (let i: number = 0; i < body.length; i++) {
        const ch: string = body.charAt(i);
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === '\\' && !inQuotes) {
            return { expression: body.substring(0, i).trim(), switches: body.substring(i).trim() };
        }
    }
    return { expression: body.trim(), switches: '' };
}

/**
 * Remove quotes from a field operand if present.
 *
 * @param {string} operand - The operand.
 * @returns {string} The unquoted operand.
 * @private
 */
function unquoteOperand(operand: string): string {
    if (operand.length >= 2 && operand.charAt(0) === '"' && operand.charAt(operand.length - 1) === '"') {
        return operand.substring(1, operand.length - 1);
    }
    return operand;
}

/**
 * Quote a field operand if it contains spaces or quotes.
 *
 * @param {string} value - The operand value.
 * @returns {string} The quoted operand.
 * @private
 */
function quoteFieldOperand(value: string): string {
    if (value.length === 0) {
        return '""';
    }
    // eslint-disable-next-line security/detect-unsafe-regex -- safe regex for field operand validation
    if (/[\s"]/.test(value)) {
        return '"' + value.replace(/"/g, '') + '"';
    }
    return value;
}

/**
 * Represents a SEQ (sequence) field.
 *
 * Extends the common `Field` class with properties specific to sequence fields,
 * including caption name, number format, and sequence-control switches.
 *
 * @public
 */
// eslint-disable-next-line max-lines-per-function -- Complex field type with many properties
// @see https://github.com/EslintJS/eslint/issues/14326 -- array access with bounded indices
export class SeqField extends Field {
    /**
     * @private
     */
    private _numberFormat: CaptionNumberingFormat = CaptionNumberingFormat.Arabic;

    /**
     * Gets the formatting string from the `\#` switch.
     *
     * @returns {string} The formatting string, or empty string if not present.
     */
    public get formattingString(): string {
        return extractSeqSwitchValue(this.fieldCode, '#') || '';
    }

    /**
     * Gets or sets the number format (represented by `\*` switch).
     *
     * @returns {CaptionNumberingFormat} The current number format.
     */
    public get numberFormat(): CaptionNumberingFormat {
        const switchValue: string | undefined = extractSeqSwitchValue(this.fieldCode, '*');
        if (switchValue) {
            // Try to find matching CaptionNumberingFormat
            for (const [format, switchText] of objectEntries(CAPTION_FORMAT_SWITCH)) {
                if (switchText === switchValue) {
                    return format as CaptionNumberingFormat;
                }
            }
        }
        return this._numberFormat;
    }

    public set numberFormat(value: CaptionNumberingFormat) {
        if (value == null) {
            throw new DocxError(
                'content/invalid-field',
                'SeqField numberFormat must not be null'
            );
        }
        this._numberFormat = value;
        // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
        const switchText: string = CAPTION_FORMAT_SWITCH[value];
        this.fieldCode = updateSeqSwitch(this.fieldCode, '*', switchText);
    }

    /**
     * Gets or sets the sequence caption name (first operand).
     *
     * @returns {string} The caption name.
     */
    public get captionName(): string {
        return parseSeqInstruction(this.fieldCode).captionName;
    }

    public set captionName(value: string) {
        if (value == null) {
            throw new DocxError(
                'content/invalid-field',
                'SeqField captionName must not be null'
            );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- internal parsing result type
        const parsed: any = parseSeqInstruction(this.fieldCode);
        this.fieldCode = updateSeqOperands(this.fieldCode, String(value), parsed.bookmarkName);
    }

    /**
     * Gets or sets the bookmark name operand.
     *
     * @returns {string} The bookmark name, or empty string if not present.
     */
    public get bookmarkName(): string {
        return parseSeqInstruction(this.fieldCode).bookmarkName;
    }

    public set bookmarkName(value: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- internal parsing result type
        const parsed: any = parseSeqInstruction(this.fieldCode);
        this.fieldCode = updateSeqOperands(this.fieldCode, parsed.captionName, String(value || ''));
    }

    /**
     * Gets or sets whether to insert the next sequence number (`\n` switch).
     * Default is `false` (no `\n` switch in the instruction; Word still increments).
     *
     * @returns {boolean} Whether the `\n` switch is present.
     */
    public get insertNextNumber(): boolean {
        return hasSeqSwitch(this.fieldCode, 'N');
    }

    public set insertNextNumber(value: boolean) {
        this.fieldCode = updateSeqSwitch(this.fieldCode, 'N', value);
    }

    /**
     * Gets or sets whether to repeat the nearest sequence number (`\c` switch).
     * Default is `false`.
     *
     * @returns {boolean} Whether to repeat the nearest number.
     */
    public get repeatNearestNumber(): boolean {
        return hasSeqSwitch(this.fieldCode, 'C');
    }

    public set repeatNearestNumber(value: boolean) {
        this.fieldCode = updateSeqSwitch(this.fieldCode, 'C', value);
    }

    /**
     * Gets or sets whether to hide the result (`\h` switch).
     * Default is `false`.
     *
     * @returns {boolean} Whether the result is hidden.
     */
    public get hideResult(): boolean {
        return hasSeqSwitch(this.fieldCode, 'H');
    }

    public set hideResult(value: boolean) {
        this.fieldCode = updateSeqSwitch(this.fieldCode, 'H', value);
    }

    /**
     * Gets or sets the reset number (`\r` switch).
     * `-1` indicates the reset number is not set.
     *
     * @returns {number} The reset number, or `-1` if not set.
     */
    public get resetNumber(): number {
        const value: string | undefined = extractSeqSwitchValue(this.fieldCode, 'R');
        if (value !== undefined) {
            const num: number = parseInt(value, 10);
            if (!isNaN(num)) {
                return num;
            }
        }
        return -1;
    }

    public set resetNumber(value: number) {
        this.fieldCode = updateSeqSwitch(this.fieldCode, 'R', value >= 0 ? String(value) : '');
    }

    /**
     * Gets or sets the reset heading level (`\s` switch).
     * `-1` indicates the reset heading level is not set.
     *
     * @returns {number} The reset heading level, or `-1` if not set.
     */
    public get resetHeadingLevel(): number {
        const value: string | undefined = extractSeqSwitchValue(this.fieldCode, 'S');
        if (value !== undefined) {
            const num: number = parseInt(value, 10);
            if (!isNaN(num)) {
                return num;
            }
        }
        return -1;
    }

    public set resetHeadingLevel(value: number) {
        this.fieldCode = updateSeqSwitch(this.fieldCode, 'S', value >= 0 ? String(value) : '');
    }

}

// ============================================================================
// Field Traversal Helpers
// ============================================================================

/**
 * @private
 */
interface FieldRegionState {
    readonly field: Field;
    phase: 'instruction' | 'result';
}

/**
 * @param {any} paragraph - The paragraph.
 * @param {TextRange} target - The target.
 * @returns {boolean} The result.
 * @private
 * Determine if a TextRange is in field instruction region.
 * FormFields are excluded since they don't have instruction text regions.
 */
export function isFieldInstructionTextRange(
    paragraph: any,
    target: TextRange
): boolean {
    const stack: FieldRegionState[] = [];
    const items: any = paragraph.items.snapshot();

    for (let index: number = 0; index < items.length; index += 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const item: any = items[index];

        if (item instanceof Field && !(item instanceof FormField)) {
            stack.push({
                field: item,
                phase: 'instruction'
            });
            continue;
        }

        if (item instanceof FieldMark) {
            if (item.fieldMarkType === FieldMarkType.Separator) {
                const current: FieldRegionState = stack.length > 0
                    ? stack[stack.length - 1]
                    : undefined;
                if (current !== undefined) {
                    current.phase = 'result';
                }
                continue;
            }

            if (item.fieldMarkType === FieldMarkType.End) {
                if (stack.length > 0) {
                    stack.pop();
                }
                continue;
            }
        }

        if (item === target) {
            if (!(item instanceof TextRange)) {
                return false;
            }
            if (stack.length === 0) {
                return false;
            }
            return stack[stack.length - 1].phase === 'instruction';
        }
    }

    return false;
}

/**
 * @param {Object} paragraph - The paragraph.
 * @param {Field} field - The field.
 * @returns {ReadonlyArray<TextRange>} The result.
 * @private
 * Depth-aware: collect instruction TextRanges owned directly by `field`
 * (nested fields' instruction/result ranges are excluded).
 * FormFields do not have instruction text regions.
 */
export function collectFieldInstructionRanges(
    paragraph: { items: { snapshot(): ReadonlyArray<ParagraphItem> } },
    field: Field
): ReadonlyArray<TextRange> {
    // FormFields do not have instruction text ranges
    if (field instanceof FormField) {
        return [];
    }

    const ranges: TextRange[] = [];
    const items: ReadonlyArray<ParagraphItem> = paragraph.items.snapshot();
    let depth: number = 0;
    let active: boolean = false;
    let phase: string = 'instruction';

    for (const item of items) {
        if (item === field) {
            active = true;
            depth = 0;
            phase = 'instruction';
            continue;
        }
        if (!active) {
            continue;
        }
        if (item instanceof Field && !(item instanceof FormField)) {
            depth += 1;
            continue;
        }
        if (item instanceof FieldMark) {
            if (item.fieldMarkType === FieldMarkType.Separator) {
                if (depth === 0) {
                    phase = 'result';
                }
                continue;
            }
            if (item.fieldMarkType === FieldMarkType.End) {
                if (depth === 0) {
                    phase = 'done';
                    break;
                }
                depth -= 1;
                continue;
            }
        }
        if (phase === 'instruction' && depth === 0 && item instanceof TextRange) {
            ranges.push(item);
        }
    }
    return ranges;
}

/**
 * @param {Object} paragraph - The paragraph.
 * @param {Field} field - The field.
 * @returns {ReadonlyArray<TextRange>} The result.
 * @private
 */
export function collectFieldResultTextRanges(
    paragraph: { items: { snapshot(): ReadonlyArray<ParagraphItem> } },
    field: Field
): ReadonlyArray<TextRange> {
    const ranges: TextRange[] = [];
    const items: ReadonlyArray<ParagraphItem> = paragraph.items.snapshot();
    let depth: number = 0;
    let active: boolean = false;
    let phase: string = 'instruction';

    for (const item of items) {
        if (item === field) {
            active = true;
            depth = 0;
            phase = 'instruction';
            continue;
        }
        if (!active) {
            continue;
        }
        if (item instanceof Field) {
            depth += 1;
            continue;
        }
        if (item instanceof FieldMark) {
            if (item.fieldMarkType === FieldMarkType.Separator) {
                if (depth === 0) {
                    phase = 'result';
                }
                continue;
            }
            if (item.fieldMarkType === FieldMarkType.End) {
                if (depth === 0) {
                    phase = 'done';
                    break;
                }
                depth -= 1;
                continue;
            }
        }
        if (phase === 'result' && depth === 0 && item instanceof TextRange) {
            ranges.push(item);
        }
    }
    return ranges;
}

/**
 * @param {Object} paragraph - The paragraph.
 * @param {Field} field - The field.
 * @returns {ReadonlyArray<ParagraphItem>} The result.
 * @private
 */
export function collectFieldResultItems(
    paragraph: { items: { snapshot(): ReadonlyArray<ParagraphItem> } },
    field: Field
): ReadonlyArray<ParagraphItem> {
    const result: ParagraphItem[] = [];
    const allItems: ReadonlyArray<ParagraphItem> = paragraph.items.snapshot();
    let depth: number = 0;
    let active: boolean = false;
    let phase: string = 'instruction';

    for (const item of allItems) {
        if (item === field) {
            active = true;
            depth = 0;
            phase = 'instruction';
            continue;
        }
        if (!active) {
            continue;
        }
        if (item instanceof Field) {
            if (phase === 'result' && depth === 0) {
                result.push(item);
            }
            depth += 1;
            continue;
        }
        if (item instanceof FieldMark) {
            if (item.fieldMarkType === FieldMarkType.Separator) {
                if (depth === 0) {
                    phase = 'result';
                }
                continue;
            }
            if (item.fieldMarkType === FieldMarkType.End) {
                if (depth === 0) {
                    phase = 'done';
                    break;
                }
                depth -= 1;
                continue;
            }
        }
        if (phase === 'result' && depth === 0) {
            result.push(item);
        }
    }
    return result;
}

// ============================================================================
// Serialization Helpers
// ============================================================================

/**
 * @param {ReadonlyArray<TextRange>} ranges - The ranges.
 * @returns {string} The result.
 * @private
 */
export function concatenateTextRanges(ranges: ReadonlyArray<TextRange>): string {
    let result: string = '';
    for (const range of ranges) {
        result += range.text;
    }
    return result;
}

// ============================================================================
// MERGEFIELD Parsing Helpers
// ============================================================================

/**
 * @private
 */
interface MergeFieldParsed {
    fieldName: string;
}

/**
 * @param {string} instruction - The instruction.
 * @returns {*} The result.
 * @private
 */
function parseMergeFieldInstruction(instruction: string): MergeFieldParsed & any {
    const tokens: string[] = tokenizeFieldInstruction(instruction);
    const keyword: string = tokens[0];
    const fieldName: string = tokens[1] || '';

    return {
        fieldName,
        tokens,
        keyword
    };
}

/**
 * @param {*} parsed - The parsed.
 * @returns {string} The result.
 * @private
 */
function formatMergeFieldInstruction(parsed: MergeFieldParsed & any): string {
    const tokens: any[] = [...(parsed.tokens || [])];
    if (tokens.length > 0) {
        tokens[0] = 'MERGEFIELD';
    } else {
        tokens.push('MERGEFIELD');
    }
    if (tokens.length > 1) {
        tokens[1] = parsed.fieldName;
    } else {
        tokens.push(parsed.fieldName);
    }

    // Reconstruct instruction with proper spacing
    return ` ${tokens.join(' ')} `;
}

/**
 * @param {string} instruction - The instruction.
 * @returns {string[]} The result.
 * @private
 */
function tokenizeFieldInstruction(instruction: string): string[] {
    const tokens: string[] = [];
    const source: string = instruction.trim();
    let index: number = 0;

    while (index < source.length) {
        // Skip whitespace
        while (index < source.length) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const ch: string = source[index];
            if (ch === undefined || !/\s/.test(ch)) {
                break;
            }
            index += 1;
        }

        if (index >= source.length) {
            break;
        }

        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const startChar: string = source[index];
        if (startChar === '"') {
            // Quoted token
            index += 1;
            let value: string = '';
            while (index < source.length) {
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const ch: string = source[index];
                if (ch === undefined || ch === '"') {
                    break;
                }
                value += ch;
                index += 1;
            }
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            if (index < source.length && source[index] === '"') {
                index += 1;
            }
            tokens.push(value);
            continue;
        }

        // Unquoted token
        let token: string = '';
        while (index < source.length) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const ch: string = source[index];
            if (ch === undefined || /\s/.test(ch) || ch === '"') {
                break;
            }
            token += ch;
            index += 1;
        }

        if (token.length > 0) {
            tokens.push(token);
        }
    }

    return tokens;
}

// ============================================================================
// Field Evaluator Helpers
// ============================================================================

// ============================================================================
// Form-Field Enums
// ============================================================================

/**
 * Extract a format switch value from a field instruction.
 *
 * @param {string} instruction - The field instruction.
 * @param {string} switchChar - The switch character (@ for date/time, # for number, etc.).
 * @returns {string | undefined} The format string or undefined if not present.
 * @private
 */
function extractFormatSwitch(instruction: string, switchChar: string): string | undefined {
    const pattern: string = '\\' + switchChar;
    const tokens: string[] = tokenizeFieldInstruction(instruction);

    for (let i: number = 0; i < tokens.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
        if (tokens[i] === pattern && i + 1 < tokens.length) {
            return tokens[i + 1];
        }
    }
    return undefined;
}

/**
 * Format a date/time value according to a format string.
 *
 * Supports basic date/time formatting patterns.
 * Falls back to locale-specific formatting if pattern is not recognized.
 *
 * @param {Date} date - The date value.
 * @param {string} format - The format string.
 * @param {boolean} timeOnly - If true, format as time only.
 * @returns {string} The formatted date/time.
 * @private
 */
function formatDateTime(date: Date, format: string, timeOnly: boolean): string {
    if (!format) {
        return timeOnly
            ? date.toLocaleTimeString('en-US')
            : date.toLocaleDateString('en-US');
    }

    const fmt: string = format.replace(/^["']|["']$/g, '');
    const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];
    const days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const pad: (n: number) => string = (n: number): string => (n < 10 ? '0' : '') + String(n);
    const hours: number = date.getHours();
    const hours12: number = hours % 12 || 12;
    const isPm: boolean = hours >= 12;

    // Single left-to-right pass so replaced text is never re-scanned (Word date-time picture).
    return fmt.replace(
        /'([^']*)'|(am\/pm|AM\/PM|a\/p|A\/P)|(y{1,4}|M{1,4}|d{1,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2})/g,
        (token: string, literal: string | undefined, meridiem: string | undefined, unit: string | undefined): string => {
            if (literal !== undefined) {
                return literal;
            }
            if (meridiem !== undefined) {
                const short: boolean = meridiem.length === 3;
                const text: string = short ? (isPm ? 'p' : 'a') : (isPm ? 'pm' : 'am');
                // Word renders am/pm in upper case regardless of the picture's case; a/p keeps its case.
                return short && meridiem === 'a/p' ? text : text.toUpperCase();
            }
            switch (unit) {
            case 'yyyy': case 'yyy': return String(date.getFullYear());
            case 'yy': case 'y': return pad(date.getFullYear() % 100);
            case 'MMMM': return months[date.getMonth()]!;
            case 'MMM': return months[date.getMonth()]!.slice(0, 3);
            case 'MM': return pad(date.getMonth() + 1);
            case 'M': return String(date.getMonth() + 1);
            case 'dddd': return days[date.getDay()]!;
            case 'ddd': return days[date.getDay()]!.slice(0, 3);
            case 'dd': return pad(date.getDate());
            case 'd': return String(date.getDate());
            case 'HH': return pad(hours);
            case 'H': return String(hours);
            case 'hh': return pad(hours12);
            case 'h': return String(hours12);
            case 'mm': return pad(date.getMinutes());
            case 'm': return String(date.getMinutes());
            case 'ss': return pad(date.getSeconds());
            case 's': return String(date.getSeconds());
            default: return token;
            }
        });
}

/**
 * Format a number according to a format string.
 *
 * Supports basic number formatting patterns.
 *
 * @param {number} value - The number value.
 * @param {string} format - The format string.
 * @returns {string} The formatted number.
 * @private
 */
const SMALL_WORDS: string[] = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS_WORDS: string[] = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const ORDINAL_WORDS: { [key: string]: string } = { one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth' };

function cardinalWords(n: number): string {
    if (n < 20) {
        // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
        return SMALL_WORDS[n]!;
    }
    if (n < 100) {
        return TENS_WORDS[Math.floor(n / 10)]! + (n % 10 > 0 ? '-' + SMALL_WORDS[n % 10]! : '');
    }
    if (n < 1000) {
        return SMALL_WORDS[Math.floor(n / 100)]! + ' hundred' + (n % 100 > 0 ? ' ' + cardinalWords(n % 100) : '');
    }
    return cardinalWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 > 0 ? ' ' + cardinalWords(n % 1000) : '');
}

function ordinalWords(n: number): string {
    const words: string = cardinalWords(n);
    const m: RegExpExecArray = /^(.*?)([a-z]+)$/.exec(words)!;
    const last: string = m[2]!;
    // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
    const ord: string = ORDINAL_WORDS[last] !== undefined ? ORDINAL_WORDS[last]! :
        (last.charAt(last.length - 1) === 'y' ? last.substring(0, last.length - 1) + 'ieth' : last + 'th');
    return m[1]! + ord;
}

function capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.substring(1);
}

/**
 * Format a section number using the field's `\*` and `\#` switches.
 *
 * @param {number} value - Section number (1-based).
 * @param {string} instruction - The field instruction.
 * @returns {string} The formatted result.
 * @private
 */
function formatSectionNumber(value: number, instruction: string): string {
    const tokens: string[] = tokenizeFieldInstruction(instruction);
    for (let i: number = 0; i + 1 < tokens.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
        if (tokens[i] !== '\\*') {
            continue;
        }
        const name: string = tokens[i + 1]!;
        switch (name.toLowerCase()) {
        case 'roman':
            return name === 'roman' ? arabicToRoman(value).toLowerCase() : arabicToRoman(value).toUpperCase();
        case 'alphabetic':
            return name === 'alphabetic' ? arabicToLetter(value).toLowerCase() : arabicToLetter(value).toUpperCase();
        case 'ordinal': {
            const mod100: number = value % 100;
            const mod10: number = value % 10;
            const suffix: string = mod100 >= 11 && mod100 <= 13 ? 'th' : (mod10 === 1 ? 'st' : mod10 === 2 ? 'nd' : mod10 === 3 ? 'rd' : 'th');
            return value + suffix;
        }
        case 'ordtext':
            return capitalizeFirst(ordinalWords(value));
        case 'cardtext':
            return cardinalWords(value).toUpperCase();
        case 'dollartext':
            return cardinalWords(value).toUpperCase() + ' AND 00/100';
        case 'hex':
            return value.toString(16).toUpperCase();
        default:
            break;
        }
    }
    const picture: string | undefined = extractFormatSwitch(instruction, '#');
    return picture !== undefined ? formatNumber(value, picture) : String(value);
}

function applyTextCaseSwitch(text: string, kind: string): string {
    switch (kind.toLowerCase()) {
    case 'upper':
        return text.toUpperCase();
    case 'lower':
        return text.toLowerCase();
    case 'firstcap':
        return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
    case 'caps':
        return text.toLowerCase().replace(/(^|\s)(\S)/g, (_m: string, sp: string, c: string) => sp + c.toUpperCase());
    default:
        return text;
    }
}

function formatNumber(value: number, format: string): string {
    if (!format) {
        return String(value);
    }
    const sections: string[] = format.replace(/^["']|["']$/g, '').split(';');
    const negative: boolean = value < 0 && sections.length > 1;
    const picture: string = negative ? sections[1]! : sections[0]!;
    const start: number = picture.search(/[#0]/);
    if (start < 0) {
        return String(value);
    }
    // eslint-disable-next-line security/detect-unsafe-regex -- pattern runs on short, bounded field-instruction text
    const body: string = /^[#0,]*(?:\.[#0]*)?/.exec(picture.substring(start))![0];
    const prefix: string = picture.substring(0, start).replace(/'/g, '');
    const suffix: string = picture.substring(start + body.length).replace(/'/g, '');
    const hasPercent: boolean = (prefix + suffix).indexOf('%') >= 0;
    const amount: number = Math.abs(value) * (hasPercent ? 100 : 1);
    const dot: number = body.indexOf('.');
    const intPart: string = dot >= 0 ? body.substring(0, dot) : body;
    const fracPart: string = dot >= 0 ? body.substring(dot + 1) : '';
    const maxFrac: number = fracPart.length;
    const minFrac: number = (fracPart.match(/0/g) || []).length;
    const minInt: number = (intPart.match(/0/g) || []).length;
    let text: string = amount.toFixed(maxFrac);
    let [whole, frac]: string[] = text.split('.');
    frac = frac || '';
    while (frac.length > minFrac && frac.charAt(frac.length - 1) === '0') {
        frac = frac.substring(0, frac.length - 1);
    }
    while (whole!.length < minInt) {
        whole = '0' + whole;
    }
    if (intPart.indexOf(',') >= 0) {
        // eslint-disable-next-line security/detect-unsafe-regex -- pattern runs on short, bounded field-instruction text
        whole = whole!.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    text = whole + (frac.length > 0 ? '.' + frac : '');
    const sign: string = value < 0 && !negative && Number(text.replace(/[,.]/g, '')) !== 0 ? '-' : '';
    return sign + prefix + text + suffix;
}

/**
 * Apply a formula function (ROUND, ABS, MAX, MIN) to evaluated arguments.
 *
 * @param {string} name - Upper-case function name.
 * @param {number[]} args - Evaluated arguments.
 * @returns {number} The result; throws for unknown functions or wrong argument counts.
 * @private
 */
function applyFormulaFunction(name: string, args: number[]): number {
    switch (name) {
    case 'ABS':
        if (args.length === 1) {
            return Math.abs(args[0]!);
        }
        break;
    case 'ROUND':
        if (args.length === 2 && Number.isInteger(args[1]!) && Math.abs(args[1]!) <= 15) {
            const digits: number = args[1]!;
            const scaled: number = Math.round(Number(Math.abs(args[0]!) + 'e' + digits));
            return (args[0]! < 0 ? -1 : 1) * Number(scaled + 'e' + (-digits));
        }
        break;
    case 'MAX':
        return Math.max(...args);
    case 'MIN':
        return Math.min(...args);
    default:
        break;
    }
    throw new Error('Unsupported function or argument count: ' + name);
}
/**
 * Display text for a formula result: float noise removed and no trailing zeros.
 *
 * @param {number} value - The calculated value.
 * @returns {string} The display text.
 * @private
 */
function formatFormulaResult(value: number): string {
    return String(Number(value.toPrecision(12)));
}
/**
 * Safely evaluate a mathematical expression without using eval().
 *
 * Supports basic arithmetic: +, -, *, /, (), etc.
 * Does not support function calls or variable references.
 *
 * @param {string} expression - The expression to evaluate.
 * @returns {number | undefined} The result or undefined if evaluation fails.
 * @private
 */
function evaluateSafeExpression(expression: string): number | undefined {
    const expr: string = expression.replace(/\s+/g, '');
    if (expr.length === 0 || !/^[\d+\-*/^().%,A-Za-z]+$/.test(expr)) {
        return undefined;
    }
    let pos: number = 0;
    // Recursive descent: expr := term (('+'|'-') term)*, term := power (('*'|'/') power)*,
    // power := unary ('^' power)?, unary := ('+'|'-') unary | atom '%'?, atom := number | '(' expr ')' | NAME '(' expr (',' expr)* ')'
    const parseExpr: () => number = (): number => {
        let value: number = parseTerm();
        while (expr.charAt(pos) === '+' || expr.charAt(pos) === '-') {
            const op: string = expr.charAt(pos++);
            const rhs: number = parseTerm();
            value = op === '+' ? value + rhs : value - rhs;
        }
        return value;
    };
    const parseTerm: () => number = (): number => {
        let value: number = parsePower();
        while (expr.charAt(pos) === '*' || expr.charAt(pos) === '/') {
            const op: string = expr.charAt(pos++);
            const rhs: number = parsePower();
            value = op === '*' ? value * rhs : value / rhs;
        }
        return value;
    };
    const parsePower: () => number = (): number => {
        const base: number = parseUnary();
        if (expr.charAt(pos) === '^') {
            pos++;
            return Math.pow(base, parsePower());
        }
        return base;
    };
    const parseUnary: () => number = (): number => {
        const ch: string = expr.charAt(pos);
        if (ch === '-' || ch === '+') {
            pos++;
            const operand: number = parseUnary();
            return ch === '-' ? -operand : operand;
        }
        let value: number;
        const fn: RegExpExecArray | null = /^[A-Za-z]+(?=\()/.exec(expr.substring(pos));
        if (fn !== null) {
            pos += fn[0].length + 1;
            const args: number[] = [parseExpr()];
            while (expr.charAt(pos) === ',') {
                pos++;
                args.push(parseExpr());
            }
            if (expr.charAt(pos) !== ')') {
                throw new Error('Unbalanced parentheses');
            }
            pos++;
            value = applyFormulaFunction(fn[0].toUpperCase(), args);
        } else if (ch === '(') {
            pos++;
            value = parseExpr();
            if (expr.charAt(pos) !== ')') {
                throw new Error('Unbalanced parentheses');
            }
            pos++;
        } else {
            // eslint-disable-next-line security/detect-unsafe-regex -- pattern runs on short, bounded field-instruction text
            const num: RegExpExecArray | null = /^\d+(?:\.\d+)?|^\.\d+/.exec(expr.substring(pos));
            if (num === null) {
                throw new Error('Number expected');
            }
            pos += num[0].length;
            value = parseFloat(num[0]);
        }
        while (expr.charAt(pos) === '%') {
            pos++;
            value /= 100;
        }
        return value;
    };
    try {
        const result: number = parseExpr();
        return pos === expr.length && isFinite(result) ? result : undefined;
    } catch (e) {
        return undefined;
    }
}

// Form-Field Enums
// ============================================================================

/**
 * Checkbox size type.
 *
 * @public
 */
export enum CheckBoxSizeType {
    /** Specifies that the size of the check box is determined automatically from the text size. */
    Auto = 'auto',
    /** Specifies that the size of the check box is the exact size that is specified. */
    Exactly = 'exactly'
}

/**
 * Text form field type.
 *
 * @public
 */
export enum TextFormFieldType {
    /** Specifies a field that accepts any text. */
    RegularText = 'regular',
    /** Specifies a field that accepts a number. */
    NumberText = 'number',
    /** Specifies a field that accepts a date. */
    DateText = 'date',
    /** Specifies a field that displays the current date. */
    CurrentDateText = 'currentDate',
    /** Specifies a field that displays the current time. */
    CurrentTimeText = 'currentTime',
    /** Specifies a field whose value is calculated from an expression. */
    Calculation = 'calculated'
}

/**
 * Text format type.
 *
 * @public
 */
export enum TextFormat {
    /** Specifies that no format is applied to the text. */
    None = 'none',
    /** Specifies that the text is converted to uppercase. */
    Uppercase = 'uppercase',
    /** Specifies that the text is converted to lowercase. */
    Lowercase = 'lowercase',
    /** Specifies that the first letter of the text is capitalized. */
    FirstCapital = 'firstCapital',
    /** Specifies that the first letter of each word is capitalized. */
    Titlecase = 'titleCase'
}

/**
 * Form field type discriminant.
 *
 * @public
 */
export enum FormFieldType {
    /** Checkbox form field. */
    CheckBox = 'checkBox',
    /** Dropdown form field. */
    DropDown = 'dropDown',
    /** Text form field. */
    TextInput = 'textInput'
}

// ============================================================================
// Base FormField Class
// ============================================================================

/**
 * Legacy Word form field (CheckBox, Dropdown, Text Input).
 *
 * Extends Field, providing writable properties for name, enabled state,
 * help text, macros, and character formatting. Supports FFData XML serialization.
 *
 * @public
 */
export abstract class FormField extends Field {
    protected nameValue: string = '';
    protected enabledValue: boolean = true;
    protected helpTextValue: string = '';
    protected helpTextTypeValue: string = 'text'; // 'text' or 'autoText'
    protected statusBarHelpValue: string = '';
    protected statusTextTypeValue: string = 'text'; // 'text' or 'autoText'
    protected macroOnStartValue: string = '';
    protected macroOnEndValue: string = '';
    protected calculateOnExitValue: boolean = false;

    /**
     * Create a form field begin marker.
     *
     * @param {FieldType} type - The form field type (CheckBox, DropDown, or TextInput).
     * @param {boolean | undefined} fldLock - The fld lock.
     * @param {boolean | undefined} dirty - The dirty.
     * @param {ReadonlyArray<OpenXmlElement>} extras - The extras.
     * @param {WireRunGroup} wireGroup - The wire group.
     * @internal
     */
    constructor(
        type: FieldType,
        fldLock?: boolean | undefined,
        dirty?: boolean | undefined,
        extras?: ReadonlyArray<OpenXmlElement>,
        wireGroup?: WireRunGroup
    ) {
        super(type, fldLock, dirty, extras !== undefined ? extras : [], wireGroup);
    }

    /**
     * Gets or sets the form-field name.
     *
     * @public
     */
    public get name(): string {
        return this.nameValue;
    }

    public set name(value: string) {
        this.nameValue = value !== undefined && value !== null ? String(value) : '';
    }

    /**
     * Gets or sets a value indicating whether the form field is enabled.
     *
     * @public
     */
    public get enabled(): boolean {
        return this.enabledValue;
    }

    public set enabled(value: boolean) {
        this.enabledValue = Boolean(value);
    }

    /**
     * Gets or sets the help text for the form field.
     *
     * @public
     */
    public get help(): string {
        return this.helpTextValue;
    }

    public set help(value: string) {
        this.helpTextValue = value !== undefined && value !== null ? String(value) : '';
    }

    /**
     * Gets or sets the status bar help text.
     *
     * @public
     */
    public get statusBarHelp(): string {
        return this.statusBarHelpValue;
    }

    public set statusBarHelp(value: string) {
        this.statusBarHelpValue = value !== undefined && value !== null ? String(value) : '';
    }

    /**
     * Gets or sets the macro executed on field entry.
     *
     * @public
     */
    public get macroOnStart(): string {
        return this.macroOnStartValue;
    }

    public set macroOnStart(value: string) {
        this.macroOnStartValue = value !== undefined && value !== null ? String(value) : '';
    }

    /**
     * Gets or sets the macro executed on field exit.
     *
     * @public
     */
    public get macroOnEnd(): string {
        return this.macroOnEndValue;
    }

    public set macroOnEnd(value: string) {
        this.macroOnEndValue = value !== undefined && value !== null ? String(value) : '';
    }

    /**
     * Gets or sets a value indicating whether to calculate on exit.
     *
     * @public
     */
    public get calculateOnExit(): boolean {
        return this.calculateOnExitValue;
    }

    public set calculateOnExit(value: boolean) {
        this.calculateOnExitValue = Boolean(value);
    }

    /**
     * Gets the type of the form field.
     *
     * @public
     */
    public abstract get formFieldType(): FormFieldType;

    /**
     * Creates a copy of the form field.
     *
     * @returns {FormField} - Returns the copy of the form field.
     * @public
     */
    public abstract clone(): FormField;

    /**
     * Serialize the form field as a begin marker with FFData.
     *
     * Emits `w:fldChar` with `fldCharType="begin"` and includes the `w:ffData` element
     * with all form-field-specific properties.
     *
     * @returns {OpenXmlElement} The serialized begin marker element.
     * @internal
     */
    public toOpenXml(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [
            wmlAttr('fldCharType', 'begin')
        ];
        if ((this as any).fldLockValue !== undefined) {
            attributes.push(wmlAttr('fldLock', (this as any).fldLockValue ? '1' : '0'));
        }
        if ((this as any).dirtyValue !== undefined) {
            attributes.push(wmlAttr('dirty', (this as any).dirtyValue ? '1' : '0'));
        }

        // Build FFData children
        const ffDataChildren: OpenXmlElement[] = this.buildFFDataChildren();

        return wmlElement('fldChar', {
            attributes: attributes,
            children: ffDataChildren.concat([...(this as any).extrasValue])
        });
    }

    /**
     * Build FFData XML for this form field.
     *
     * Builds elements in a canonical order compatible with ECMA-376:
     * w:name, w:enabled, w:helpText, w:statusText, w:calcOnExit, then type-specific elements.
     *
     * @returns {OpenXmlElement[]} The FFData element(s).
     * @internal
     */
    buildFFDataChildren(): OpenXmlElement[] {
        const ffDataChildren: OpenXmlElement[] = [];

        // Add name element if set
        if (this.nameValue && this.nameValue.length > 0) {
            ffDataChildren.push(wmlElement('name', {
                attributes: [wmlAttr('val', this.nameValue)]
            }));
        }

        // w:enabled is an ST_OnOff toggle that defaults to true when omitted (ECMA-376 17.16.12);
        // a disabled field must therefore write an explicit off value.
        if (!this.enabledValue) {
            ffDataChildren.push(wmlElement('enabled', {
                attributes: [wmlAttr('val', '0')]
            }));
        }

        // Add helpText element if set
        if (this.helpTextValue && this.helpTextValue.length > 0) {
            const helpTextAttrs: OpenXmlAttribute[] = [];
            // Add type attribute (defaults to 'text')
            if (this.helpTextTypeValue !== undefined && this.helpTextTypeValue.length > 0) {
                helpTextAttrs.push(wmlAttr('type', this.helpTextTypeValue));
            }
            // Add val attribute
            helpTextAttrs.push(wmlAttr('val', this.helpTextValue));
            ffDataChildren.push(wmlElement('helpText', {
                attributes: helpTextAttrs
            }));
        }

        // Add statusText element if set
        if (this.statusBarHelpValue && this.statusBarHelpValue.length > 0) {
            const statusTextAttrs: OpenXmlAttribute[] = [];
            // Add type attribute (defaults to 'text')
            if (this.statusTextTypeValue !== undefined && this.statusTextTypeValue.length > 0) {
                statusTextAttrs.push(wmlAttr('type', this.statusTextTypeValue));
            }
            // Add val attribute
            statusTextAttrs.push(wmlAttr('val', this.statusBarHelpValue));
            ffDataChildren.push(wmlElement('statusText', {
                attributes: statusTextAttrs
            }));
        }

        // Add calcOnExit element if enabled
        if (this.calculateOnExitValue) {
            ffDataChildren.push(wmlElement('calcOnExit'));
        }

        // Add type-specific content (checkBox, ddList, textInput, etc.)
        const typeSpecificChildren: OpenXmlElement[] = this.buildFFDataTypeElements();
        ffDataChildren.push(...typeSpecificChildren);

        const ffDataElement: OpenXmlElement = wmlElement('ffData', {
            children: ffDataChildren
        });

        return [ffDataElement];
    }

    /**
     * Build type-specific FFData child elements.
     *
     * @returns {OpenXmlElement[]} Returns the child elements.
     * @protected
     */
    protected buildFFDataTypeElements(): OpenXmlElement[] {
        // Subclasses override this
        return [];
    }
}

// ============================================================================
// CheckBoxFormField
// ============================================================================

/**
 * Checkbox form field.
 *
 * @public
 */
export class CheckBoxFormField extends FormField {
    /**
     * Gets or sets a value indicating whether the check box is currently checked.
     */
    public checkedValue: boolean = false;
    /**
     * Gets or sets a value indicating whether the check box is checked by default.
     */
    public defaultCheckedValue: boolean = false;
    /**
     * Gets or sets the size of the check box, in points, when the size type is exact.
     */
    public checkBoxSizeValue: number = 20;
    /**
     * Gets or sets how the size of the check box is determined (automatic or exact).
     */
    public sizeTypeValue: CheckBoxSizeType = CheckBoxSizeType.Auto;

    /**
     * Create a checkbox form field.
     *
     * @param {boolean | undefined} fldLock - The fld lock.
     * @param {boolean | undefined} dirty - The dirty.
     * @param {ReadonlyArray<OpenXmlElement>} extras - The extras.
     * @param {WireRunGroup} wireGroup - The wire group.
     * @public
     */
    constructor(
        fldLock?: boolean | undefined,
        dirty?: boolean | undefined,
        extras?: ReadonlyArray<OpenXmlElement>,
        wireGroup?: WireRunGroup
    ) {
        super(FieldType.CheckBox, fldLock, dirty, extras, wireGroup);
    }

    /**
     * Gets or sets a value indicating whether the checkbox is currently checked.
     *
     * @public
     */
    public get checked(): boolean {
        return this.checkedValue;
    }

    public set checked(value: boolean) {
        this.checkedValue = Boolean(value);
    }

    /**
     * Gets or sets a value indicating whether the default check box value option is enabled.
     *
     * @public
     */
    public get defaultCheckBoxValue(): boolean {
        return this.defaultCheckedValue;
    }

    public set defaultCheckBoxValue(value: boolean) {
        this.defaultCheckedValue = Boolean(value);
    }

    /**
     * Gets or sets the checkbox size in points.
     *
     * @public
     */
    public get checkBoxSize(): number {
        return this.checkBoxSizeValue;
    }

    public set checkBoxSize(value: number) {
        if (!Number.isFinite(value) || !Number.isInteger(value)) {
            throw new DocxError('argument/invalid', 'checkBoxSize must be an integer');
        }
        if (value < 1 || value > 1584) {
            throw new DocxError(
                'argument/invalid',
                `checkBoxSize must be between 1 and 1584, got ${value}`
            );
        }
        this.checkBoxSizeValue = value;
    }

    /**
     * Gets or sets the checkbox size type.
     *
     * @public
     */
    public get sizeType(): CheckBoxSizeType {
        return this.sizeTypeValue;
    }

    public set sizeType(value: CheckBoxSizeType) {
        if (value !== CheckBoxSizeType.Auto && value !== CheckBoxSizeType.Exactly) {
            throw new DocxError('argument/invalid', 'Invalid CheckBoxSizeType');
        }
        this.sizeTypeValue = value;
    }

    /**
     * Gets the form field type.
     *
     * @public
     */
    public get formFieldType(): FormFieldType {
        return FormFieldType.CheckBox;
    }

    /**
     * Creates a copy of the check box form field.
     *
     * @returns {CheckBoxFormField} The result of the operation.
     * @public
     */
    public clone(): CheckBoxFormField {
        const cloned: CheckBoxFormField = new CheckBoxFormField();
        cloned.nameValue = this.nameValue;
        cloned.enabledValue = this.enabledValue;
        cloned.helpTextValue = this.helpTextValue;
        cloned.statusBarHelpValue = this.statusBarHelpValue;
        cloned.macroOnStartValue = this.macroOnStartValue;
        cloned.macroOnEndValue = this.macroOnEndValue;
        cloned.calculateOnExitValue = this.calculateOnExitValue;
        cloned.checkedValue = this.checkedValue;
        cloned.defaultCheckedValue = this.defaultCheckedValue;
        cloned.checkBoxSizeValue = this.checkBoxSizeValue;
        cloned.sizeTypeValue = this.sizeTypeValue;
        return cloned;
    }

    /**
     * Build type-specific FFData children for checkbox.
     *
     * @returns {OpenXmlElement[]} Returns the checkbox FFData children.
     * @protected
     */
    protected buildFFDataTypeElements(): OpenXmlElement[] {
        const children: OpenXmlElement[] = [];

        // w:checkBox element with child elements in correct order per ECMA-376:
        // 1. Size element (w:size or w:sizeAuto) - REQUIRED
        // 2. Default element (w:default) - OPTIONAL
        // 3. Checked element (w:checked) - OPTIONAL
        const checkBoxChildren: OpenXmlElement[] = [];

        // 1. Add size element (REQUIRED - either w:size or w:sizeAuto)
        if (this.sizeTypeValue === CheckBoxSizeType.Exactly) {
            checkBoxChildren.push(wmlElement('size', {
                attributes: [wmlAttr('val', String(this.checkBoxSizeValue))]
            }));
        } else {
            // CheckBoxSizeType.Auto
            checkBoxChildren.push(wmlElement('sizeAuto'));
        }

        // 2. Add default element if default is checked (with w:val attribute)
        if (this.defaultCheckedValue) {
            checkBoxChildren.push(wmlElement('default', {
                attributes: [wmlAttr('val', 'true')]
            }));
        }

        // 3. Add checked element (with w:val attribute)
        // Note: w:val is optional but we include it for clarity
        // 0 = unchecked, 1 = checked
        checkBoxChildren.push(wmlElement('checked', {
            attributes: [wmlAttr('val', this.checkedValue ? '1' : '0')]
        }));

        const checkBoxElement: OpenXmlElement = wmlElement('checkBox', {
            children: checkBoxChildren
        });
        children.push(checkBoxElement);

        return children;
    }
}

// ============================================================================
// DropDownItem
// ============================================================================

/**
 * Item in a dropdown collection.
 *
 * @public
 */
export class DropDownItem {
    /**
     * Gets or sets the text of the drop-down item.
     */
    public textValue: string = '';

    /**
     * Gets or sets the item text.
     *
     * @public
     */
    public get text(): string {
        return this.textValue;
    }

    public set text(value: string) {
        this.textValue = value !== undefined && value !== null ? String(value) : '';
    }
}

// ============================================================================
// DropDownCollection
// ============================================================================

/**
 * Collection of dropdown items.
 *
 * @public
 */
export class DropDownCollection implements Iterable<DropDownItem> {
    private items: DropDownItem[] = [];

    /**
     * Gets the number of items.
     *
     * @public
     */
    public get count(): number {
        return this.items.length;
    }

    /**
     * Gets the item at the specified index.
     *
     * @param {number} index - The index.
     * @returns {DropDownItem | undefined} The result of the operation.
     * @public
     */
    public itemAt(index: number): DropDownItem | undefined {
        if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
            return undefined;
        }
        // eslint-disable-next-line security/detect-object-injection
        return this.items[index];
    }

    /**
     * Adds an item to the drop-down list.
     *
     * @param {string} text - Specifies the text of the item.
     * @returns {DropDownItem} - Returns the newly added item.
     * @public
     */
    public add(text: string): DropDownItem {
        if (this.items.length >= 25) {
            throw new DocxError(
                'argument/invalid',
                'You can have no more than 25 items in your drop-down list box'
            );
        }
        const item: DropDownItem = new DropDownItem();
        item.text = text;
        this.items.push(item);
        return item;
    }

    /**
     * Remove item at index.
     *
     * @param {number} index - Specifies the index.
     * @returns {void}
     * @public
     */
    public removeAt(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
            throw new DocxError(
                'argument/invalid',
                `Index out of range: ${index}`
            );
        }
        this.items.splice(index, 1);
    }

    /**
     * Removes all the items from the collection.
     *
     * @returns {void}
     * @public
     */
    public clear(): void {
        this.items = [];
    }

    /**
     * Returns an iterator over the items in the drop-down list.
     *
     * @returns {Iterator<DropDownItem>} - Returns an iterator over the items.
     * @public
     */
    public [Symbol.iterator](): Iterator<DropDownItem> {
        return this.items[Symbol.iterator]();
    }
}

// ============================================================================
// DropDownFormField
// ============================================================================

/**
 * Dropdown form field.
 *
 * @public
 */
export class DropDownFormField extends FormField {
    /**
     * Gets or sets the collection of items displayed in the drop-down form field.
     */
    public dropDownItemsCollection: DropDownCollection = new DropDownCollection();
    /**
     * Gets or sets the zero-based index of the selected drop-down item.
     */
    public selectedIndexValue: number = 0;

    /**
     * Create a dropdown form field.
     *
     * @param {boolean | undefined} fldLock - The fld lock.
     * @param {boolean | undefined} dirty - The dirty.
     * @param {ReadonlyArray<OpenXmlElement>} extras - The extras.
     * @param {WireRunGroup} wireGroup - The wire group.
     * @public
     */
    constructor(
        fldLock?: boolean | undefined,
        dirty?: boolean | undefined,
        extras?: ReadonlyArray<OpenXmlElement>,
        wireGroup?: WireRunGroup
    ) {
        super(FieldType.DropDown, fldLock, dirty, extras, wireGroup);
    }

    /**
     * Gets the dropdown items collection.
     *
     * @public
     */
    public get dropDownItems(): DropDownCollection {
        return this.dropDownItemsCollection;
    }

    /**
     * Gets or sets the selected item index.
     *
     * @public
     */
    public get selectedIndex(): number {
        return this.selectedIndexValue;
    }

    public set selectedIndex(value: number) {
        if (!Number.isInteger(value) || value < 0 || value >= this.dropDownItemsCollection.count) {
            if (this.dropDownItemsCollection.count === 0) {
                throw new DocxError(
                    'argument/invalid',
                    'No items in dropdown list'
                );
            }
            throw new DocxError(
                'argument/invalid',
                `Selected index out of range: ${value}`
            );
        }
        this.selectedIndexValue = value;
    }

    /**
     * Gets the form field type.
     *
     * @public
     */
    public get formFieldType(): FormFieldType {
        return FormFieldType.DropDown;
    }

    /**
     * Creates a copy of the drop-down form field.
     *
     * @returns {DropDownFormField} - Returns the copy of the drop-down form field.
     * @public
     */
    public clone(): DropDownFormField {
        const cloned: DropDownFormField = new DropDownFormField();
        cloned.nameValue = this.nameValue;
        cloned.enabledValue = this.enabledValue;
        cloned.helpTextValue = this.helpTextValue;
        cloned.statusBarHelpValue = this.statusBarHelpValue;
        cloned.macroOnStartValue = this.macroOnStartValue;
        cloned.macroOnEndValue = this.macroOnEndValue;
        cloned.calculateOnExitValue = this.calculateOnExitValue;
        cloned.selectedIndexValue = this.selectedIndexValue;
        for (const item of this.dropDownItemsCollection) {
            cloned.dropDownItemsCollection.add(item.text);
        }
        return cloned;
    }

    /**
     * Build type-specific FFData children for dropdown.
     *
     * @returns {OpenXmlElement[]} Returns the dropdown FFData children.
     * @protected
     */
    protected buildFFDataTypeElements(): OpenXmlElement[] {
        const children: OpenXmlElement[] = [];

        const ddListChildren: OpenXmlElement[] = [];

        // Add result element (currently selected index)
        ddListChildren.push(wmlElement('result', {
            attributes: [wmlAttr('val', String(this.selectedIndexValue))]
        }));

        // Add default element (always 0 for first item as default)
        ddListChildren.push(wmlElement('default', {
            attributes: [wmlAttr('val', '0')]
        }));

        // Add listEntry elements for each item
        for (const item of this.dropDownItemsCollection) {
            const listEntryElement: OpenXmlElement = wmlElement('listEntry', {
                attributes: [wmlAttr('val', item.text)]
            });
            ddListChildren.push(listEntryElement);
        }

        const ddListElement: OpenXmlElement = wmlElement('ddList', {
            children: ddListChildren
        });
        children.push(ddListElement);

        return children;
    }
}

// ============================================================================
// TextFormField
// ============================================================================

/**
 * Text input form field.
 *
 * @public
 */
export class TextFormField extends FormField {
    protected textTypeValue: TextFormFieldType = TextFormFieldType.RegularText;
    protected defaultTextValue: string = '';
    protected maximumLengthValue: number = 0;
    protected stringFormatValue: string = '';
    protected textFormatValue: TextFormat = TextFormat.None;

    /**
     * Create a text input form field.
     *
     * @param {boolean | undefined} fldLock - The fld lock.
     * @param {boolean | undefined} dirty - The dirty.
     * @param {ReadonlyArray<OpenXmlElement>} extras - The extras.
     * @param {WireRunGroup} wireGroup - The wire group.
     * @public
     */
    constructor(
        fldLock?: boolean | undefined,
        dirty?: boolean | undefined,
        extras?: ReadonlyArray<OpenXmlElement>,
        wireGroup?: WireRunGroup
    ) {
        super(FieldType.TextInput, fldLock, dirty, extras, wireGroup);
    }

    /**
     * Gets or sets the text input type.
     *
     * @public
     */
    public get type(): TextFormFieldType | EntityType.TextRange | EntityType.Field {
        return this.textTypeValue;
    }

    public set type(value: TextFormFieldType | EntityType.TextRange | EntityType.Field) {
        this.textTypeValue = value as TextFormFieldType;
    }

    /**
     * Gets or sets the default text.
     *
     * @public
     */
    public get defaultText(): string {
        return this.defaultTextValue;
    }

    public set defaultText(value: string) {
        this.defaultTextValue = value !== undefined && value !== null ? String(value) : '';
    }

    /**
     * Gets or sets the maximum text length (0 = unlimited).
     *
     * @public
     */
    public get maximumLength(): number {
        return this.maximumLengthValue;
    }

    public set maximumLength(value: number) {
        if (!Number.isInteger(value) || value < 0) {
            throw new DocxError('argument/invalid', 'Maximum length must be a non-negative integer');
        }
        this.maximumLengthValue = value;
    }

    /**
     * Gets or sets the string format (for number, date, etc.).
     *
     * @public
     */
    public get stringFormat(): string {
        return this.stringFormatValue;
    }

    public set stringFormat(value: string) {
        this.stringFormatValue = value !== undefined && value !== null ? String(value) : '';
    }

    /**
     * Gets or sets the text format (for regular text).
     *
     * @public
     */
    public get textFormat(): TextFormat {
        return this.textFormatValue;
    }

    public set textFormat(value: TextFormat) {
        this.textFormatValue = value;
    }

    /**
     * Gets the text range in the field result.
     *
     * @public
     */
    public get textRange(): TextRange {
        const paragraph: any = this.findParagraph();
        if (paragraph === undefined) {
            throw new DocxError('content/invalid-field', 'Form field is not attached to a paragraph');
        }
        const ranges: ReadonlyArray<TextRange> = collectFieldResultTextRanges(paragraph, this as any);
        if (ranges.length === 0) {
            throw new DocxError('content/invalid-field', 'Form field has no result range');
        }
        return ranges[0]!;
    }

    /**
     * Gets or sets the current text value.
     *
     * @public
     */
    public get text(): string {
        const paragraph: any = this.findParagraph();
        if (paragraph === undefined) {
            return '';
        }
        const ranges: ReadonlyArray<TextRange> = collectFieldResultTextRanges(paragraph, this as any);
        if (ranges.length === 0) {
            return '';
        }
        return ranges[0]!.text;
    }

    public set text(value: string) {
        if (this.maximumLengthValue > 0 && value.length > this.maximumLengthValue) {
            throw new DocxError(
                'argument/invalid',
                `Text length exceeds maximum length of ${this.maximumLengthValue}`
            );
        }
        const paragraph: any = this.findParagraph();
        if (paragraph === undefined) {
            throw new DocxError('content/invalid-field', 'Form field is not attached to a paragraph');
        }
        const ranges: ReadonlyArray<TextRange> = collectFieldResultTextRanges(paragraph, this as any);
        if (ranges.length === 0) {
            throw new DocxError('content/invalid-field', 'Form field has no result range');
        }
        ranges[0]!.text = value;
    }

    /**
     * Gets the form field type.
     *
     * @public
     */
    public get formFieldType(): FormFieldType {
        return FormFieldType.TextInput;
    }

    /**
     * Creates a copy of the text form field.
     *
     * @returns {FormField} - Returns the copy of the text form field.
     * @public
     */
    public clone(): FormField {
        const cloned: TextFormField = new TextFormField();
        cloned.nameValue = this.nameValue;
        cloned.enabledValue = this.enabledValue;
        cloned.helpTextValue = this.helpTextValue;
        cloned.statusBarHelpValue = this.statusBarHelpValue;
        cloned.macroOnStartValue = this.macroOnStartValue;
        cloned.macroOnEndValue = this.macroOnEndValue;
        cloned.calculateOnExitValue = this.calculateOnExitValue;
        cloned.textTypeValue = this.textTypeValue;
        cloned.defaultTextValue = this.defaultTextValue;
        cloned.maximumLengthValue = this.maximumLengthValue;
        cloned.stringFormatValue = this.stringFormatValue;
        cloned.textFormatValue = this.textFormatValue;
        return cloned;
    }

    /**
     * Build type-specific FFData children for text input.
     *
     * @returns {OpenXmlElement[]} Returns the text input FFData children.
     * @protected
     */
    protected buildFFDataTypeElements(): OpenXmlElement[] {
        const children: OpenXmlElement[] = [];

        // w:textInput element with child elements
        const textInputChildren: OpenXmlElement[] = [];

        // Add default element if set
        if (this.defaultTextValue && this.defaultTextValue.length > 0) {
            textInputChildren.push(wmlElement('default', {
                attributes: [wmlAttr('val', String(this.defaultTextValue))]
            }));
        }

        // Add maxLength element if set
        if (this.maximumLengthValue > 0) {
            textInputChildren.push(wmlElement('maxLength', {
                attributes: [wmlAttr('val', String(this.maximumLengthValue))]
            }));
        }

        // Add type element
        let typeValue: string = 'regular';
        if (this.textTypeValue === TextFormFieldType.NumberText) {
            typeValue = 'number';
        } else if (this.textTypeValue === TextFormFieldType.DateText) {
            typeValue = 'date';
        } else if (this.textTypeValue === TextFormFieldType.CurrentDateText) {
            typeValue = 'currentDate';
        } else if (this.textTypeValue === TextFormFieldType.CurrentTimeText) {
            typeValue = 'currentTime';
        } else if (this.textTypeValue === TextFormFieldType.Calculation) {
            typeValue = 'calculated';
        }

        textInputChildren.push(wmlElement('type', {
            attributes: [wmlAttr('val', typeValue)]
        }));

        // Add format element for date/number formatting if applicable
        if (this.stringFormatValue && this.stringFormatValue.length > 0 && this.textTypeValue !== TextFormFieldType.RegularText) {
            textInputChildren.push(wmlElement('format', {
                attributes: [wmlAttr('val', String(this.stringFormatValue))]
            }));
        }

        // Add textFormat element for text case formatting
        if (this.textFormatValue !== TextFormat.None) {
            let formatVal: string = 'none';
            if (this.textFormatValue === TextFormat.Uppercase) {
                formatVal = 'uppercase';
            } else if (this.textFormatValue === TextFormat.Lowercase) {
                formatVal = 'lowercase';
            } else if (this.textFormatValue === TextFormat.FirstCapital) {
                formatVal = 'capitalize';
            } else if (this.textFormatValue === TextFormat.Titlecase) {
                formatVal = 'titlecase';
            }

            if (formatVal !== 'none') {
                textInputChildren.push(wmlElement('textFormat', {
                    attributes: [wmlAttr('val', formatVal)]
                }));
            }
        }

        const textInputElement: OpenXmlElement = wmlElement('textInput', {
            children: textInputChildren
        });
        children.push(textInputElement);

        return children;
    }

    protected findParagraph(): any {
        const owner: ParagraphItemOwner = this.owner;
        if (owner === undefined || typeof owner !== 'object') {
            return undefined;
        }
        if ('items' in owner) {
            return owner;
        }
        return undefined;
    }
}

/**
 * Format a sequence number according to CaptionNumberingFormat.
 *
 * @param {number} value - The sequence number.
 * @param {CaptionNumberingFormat} format - The formatting.
 * @returns {string} The formatted number.
 * @private
 */
function formatNumberingFormat(value: number, format: CaptionNumberingFormat): string {
    switch (format) {
    case CaptionNumberingFormat.Arabic:
        return String(value);
    case CaptionNumberingFormat.UpperCaseRoman:
        return arabicToRoman(value).toUpperCase();
    case CaptionNumberingFormat.LowerCaseRoman:
        return arabicToRoman(value).toLowerCase();
    case CaptionNumberingFormat.UpperCaseLetter:
        return arabicToLetter(value).toUpperCase();
    case CaptionNumberingFormat.LowerCaseLetter:
        return arabicToLetter(value).toLowerCase();
    default:
        return String(value);
    }
}

/**
 * Convert Arabic numeral to Roman numeral.
 *
 * @param {number} num - The Arabic number (1-3999).
 * @returns {string} The Roman numeral representation.
 * @private
 */
function arabicToRoman(num: number): string {
    if (num <= 0 || num >= 4000 || !Number.isInteger(num)) {
        return String(num);
    }

    const romanMap: Array<[number, string]> = [
        [1000, 'M'],
        [900, 'CM'],
        [500, 'D'],
        [400, 'CD'],
        [100, 'C'],
        [90, 'XC'],
        [50, 'L'],
        [40, 'XL'],
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I']
    ];

    let result: string = '';
    let value: number = num;

    for (const [v, r] of romanMap) {
        while (value >= v) {
            result += r;
            value -= v;
        }
    }

    return result;
}

/**
 * Convert Arabic numeral to letter (A-Z, AA-ZZ, etc.).
 *
 * @param {number} num - The Arabic number (1+).
 * @returns {string} The letter representation.
 * @private
 */
function arabicToLetter(num: number): string {
    if (num <= 0 || !Number.isInteger(num)) {
        return String(num);
    }

    let result: string = '';
    let value: number = num;

    while (value > 0) {
        value -= 1;
        result = String.fromCharCode(65 + (value % 26)) + result;
        value = Math.floor(value / 26);
    }

    return result;
}

/**
 * Format a sequence number using a custom formatting string.
 *
 * @param {number} value - The sequence number.
 * @param {string} format - The format string (e.g., "0", "00").
 * @returns {string} The formatted number.
 * @private
 */
function formatSeqNumbering(value: number, format: string): string {
    if (!format) {
        return String(value);
    }

    // Count zeros in format to determine padding
    const zeroMatch: RegExpExecArray | null = /0+/.exec(format);
    const zeroCount: number = zeroMatch !== null ? zeroMatch[0]!.length : 1;

    return zeroCount <= 1 ? String(value) : ('000000000000' + String(value)).slice(-zeroCount);
}

// ============================================================================
// FormFieldsCollection
// ============================================================================

/**
 * Collection of form fields in a text body.
 *
 * @public
 */
export class FormFieldsCollection implements Iterable<FormField> {
    private fields: FormField[] | undefined;
    private nameMap: Map<string, FormField> | undefined;
    private textBody: any;

    /**
     * @param {any} textBody - The text body.
     * @internal
     */
    constructor(textBody: any) {
        this.textBody = textBody;
    }

    /**
     * Gets the number of form fields.
     *
     * @public
     */
    public get count(): number {
        this.ensurePopulated();
        return this.fields!.length;
    }

    /**
     * Gets the form field at the specified index.
     *
     * @param {number} index - Specifies the zero-based index of the form field.
     * @returns {FormField} - Returns the form field at the specified index.
     * @public
     */
    public get(index: number): FormField {
        this.ensurePopulated();
        if (!Number.isInteger(index) || index < 0 || index >= this.fields!.length) {
            throw new DocxError('argument/invalid', `Index out of range: ${index}`);
        }
        // eslint-disable-next-line security/detect-object-injection
        return this.fields![index]!;
    }

    /**
     * Finds a form field by its name.
     *
     * @param {string} name - Specifies the name of the form field.
     * @returns {FormField | undefined} - Returns the form field, or undefined if no form field has the specified name.
     * @public
     */
    public findByName(name: string): FormField | undefined {
        this.ensurePopulated();
        return this.nameMap!.get(name);
    }

    /**
     * Determines whether a form field with the specified name exists.
     *
     * @param {string} name - Specifies the name of the form field.
     * @returns {boolean} - Returns true if a form field with the specified name exists; otherwise, false.
     * @public
     */
    public containsName(name: string): boolean {
        this.ensurePopulated();
        return this.nameMap!.has(name);
    }

    /**
     * Returns an iterator over the form fields in the collection.
     *
     * @returns {Iterator<FormField>} - Returns an iterator over the form fields.
     * @public
     */
    public [Symbol.iterator](): Iterator<FormField> {
        this.ensurePopulated();
        return this.fields![Symbol.iterator]();
    }

    /**
     * Invalidate the cache.
     *
     * @returns {void}
     * @internal
     */
    public invalidate(): void {
        this.fields = undefined;
        this.nameMap = undefined;
    }

    private ensurePopulated(): void {
        if (this.fields !== undefined) {
            return;
        }

        this.fields = [];
        this.nameMap = new Map();

        // Scan paragraphs in the text body for form fields
        if (this.textBody && typeof this.textBody === 'object' && 'paragraphs' in this.textBody) {
            const paragraphs: any = this.textBody.paragraphs;
            if (paragraphs && typeof paragraphs === 'object' && Symbol.iterator in paragraphs) {
                for (const paragraph of paragraphs as Iterable<any>) {
                    if (paragraph && typeof paragraph === 'object' && 'items' in paragraph) {
                        // Scan paragraph items directly for form fields
                        for (const item of paragraph.items as Iterable<any>) {
                            if (item instanceof FormField) {
                                this.fields.push(item);
                                if (item.name && item.name.length > 0) {
                                    this.nameMap.set(item.name, item);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
