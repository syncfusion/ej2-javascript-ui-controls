import { CharacterFormat } from '../document/character-format';
import { DetachedObjectError, DocxError } from '../../core/errors/docx-error';
import { registerAlwaysOnBodyFeatureBootstrap } from '../document/body-always-on';
import { WordDocument } from '../document/document';
import { FeatureInline } from '../document/feature-inline';
import { FeatureRunLeaf } from '../document/feature-run-leaf';
import { parseOnOff } from '../document/on-off';
import { Paragraph, setParagraphItemsPostProcessor } from '../document/paragraph';
import {
    ParagraphItem,
    FeatureInlineParagraphItem,
    FeatureRunParagraphItem,
    TextRange,
    serializeTextRange
} from '../document/text-range';
import { elementChildren, isWml, isWmlNamespace, textContent, wValAttribute, wmlAttr, wmlElement, xmlSpaceIsPreserve, xmlSpacePreserve } from '../document/wml';
import { featureId, registerFeature, registerFeatureInlineHandler, registerFeatureRunLeafHandler, visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { partName, relationshipsForPart } from '../../core/opc/index';
import {
    FieldMark as ParagraphFieldMark,
    FieldMarkType as ParagraphFieldMarkType,
    FieldType,
    Field,
    IfField,
    MergeField,
    SeqField,
    FormField as NewFormField,
    CheckBoxFormField,
    CheckBoxSizeType,
    DropDownFormField,
    TextFormField,
    TextFormFieldType,
    TextFormat,
    DropDownCollection,
    DropDownItem,
    FormFieldType,
    FormFieldsCollection
} from './paragraph-field';
export {
    Field,
    IfField,
    MergeField,
    SeqField,
    FieldMark,
    FieldMarkType,
    FieldType,
    CheckBoxFormField,
    CheckBoxSizeType,
    DropDownFormField,
    DropDownCollection,
    DropDownItem,
    TextFormField,
    TextFormFieldType,
    TextFormat,
    FormFieldType,
    FormFieldsCollection
} from './paragraph-field';
export { FormField } from './paragraph-field';
import { Picture } from '../images/index';
import { hyperlinksFor, HyperlinksCatalog } from '../hyperlinks/index';
import { FeatureId } from '../../core/registry/feature-registry';
import { PartName } from '../../core/opc/part-name';
const FIELDS: FeatureId = featureId('fields');
const SUPPORTED_FIELD_TYPES: ReadonlyMap<string, FieldType> = new Map([
    [FieldType.Page, FieldType.Page],
    [FieldType.NumPages, FieldType.NumPages],
    [FieldType.If, FieldType.If],
    [FieldType.MergeField, FieldType.MergeField],
    [FieldType.Hyperlink, FieldType.Hyperlink],
    [FieldType.FieldAddin, FieldType.FieldAddin],
    [FieldType.FieldAdvance, FieldType.FieldAdvance],
    [FieldType.FieldAsk, FieldType.FieldAsk],
    [FieldType.FieldAuthor, FieldType.FieldAuthor],
    [FieldType.FieldAutoNum, FieldType.FieldAutoNum],
    [FieldType.FieldAutoNumLegal, FieldType.FieldAutoNumLegal],
    [FieldType.FieldAutoNumOutline, FieldType.FieldAutoNumOutline],
    [FieldType.FieldAutoText, FieldType.FieldAutoText],
    [FieldType.FieldAutoTextList, FieldType.FieldAutoTextList],
    [FieldType.FieldBarCode, FieldType.FieldBarCode],
    [FieldType.FieldComments, FieldType.FieldComments],
    [FieldType.FieldDocProperty, FieldType.FieldDocProperty],
    [FieldType.FieldCompare, FieldType.FieldCompare],
    [FieldType.FieldCreateDate, FieldType.FieldCreateDate],
    [FieldType.FieldData, FieldType.FieldData],
    [FieldType.FieldDatabase, FieldType.FieldDatabase],
    [FieldType.FieldDate, FieldType.FieldDate],
    [FieldType.FieldDDE, FieldType.FieldDDE],
    [FieldType.FieldDDEAuto, FieldType.FieldDDEAuto],
    [FieldType.FieldEditTime, FieldType.FieldEditTime],
    [FieldType.FieldExpression, FieldType.FieldExpression],
    [FieldType.FieldFileName, FieldType.FieldFileName],
    [FieldType.FieldFileSize, FieldType.FieldFileSize],
    [FieldType.FieldFillIn, FieldType.FieldFillIn],
    [FieldType.FieldFootnoteRef, FieldType.FieldFootnoteRef],
    [FieldType.FieldFormula, FieldType.FieldFormula],
    [FieldType.FieldGlossary, FieldType.FieldGlossary],
    [FieldType.FieldGoToButton, FieldType.FieldGoToButton],
    [FieldType.FieldHTMLActiveX, FieldType.FieldHTMLActiveX],
    [FieldType.FieldImport, FieldType.FieldImport],
    [FieldType.FieldInclude, FieldType.FieldInclude],
    [FieldType.FieldIncludePicture, FieldType.FieldIncludePicture],
    [FieldType.FieldIncludeText, FieldType.FieldIncludeText],
    [FieldType.FieldIndex, FieldType.FieldIndex],
    [FieldType.FieldIndexEntry, FieldType.FieldIndexEntry],
    [FieldType.FieldInfo, FieldType.FieldInfo],
    [FieldType.FieldKeyWord, FieldType.FieldKeyWord],
    [FieldType.FieldLastSavedBy, FieldType.FieldLastSavedBy],
    [FieldType.FieldLink, FieldType.FieldLink],
    [FieldType.FieldListNum, FieldType.FieldListNum],
    [FieldType.FieldMacroButton, FieldType.FieldMacroButton],
    [FieldType.FieldMergeRec, FieldType.FieldMergeRec],
    [FieldType.FieldMergeSeq, FieldType.FieldMergeSeq],
    [FieldType.FieldNext, FieldType.FieldNext],
    [FieldType.FieldNextIf, FieldType.FieldNextIf],
    [FieldType.FieldNoteRef, FieldType.FieldNoteRef],
    [FieldType.FieldNumChars, FieldType.FieldNumChars],
    [FieldType.FieldNumWords, FieldType.FieldNumWords],
    [FieldType.FieldOCX, FieldType.FieldOCX],
    [FieldType.FieldPageRef, FieldType.FieldPageRef],
    [FieldType.FieldPrint, FieldType.FieldPrint],
    [FieldType.FieldPrintDate, FieldType.FieldPrintDate],
    [FieldType.FieldPrivate, FieldType.FieldPrivate],
    [FieldType.FieldQuote, FieldType.FieldQuote],
    [FieldType.FieldRef, FieldType.FieldRef],
    [FieldType.FieldRefDoc, FieldType.FieldRefDoc],
    [FieldType.FieldRevisionNum, FieldType.FieldRevisionNum],
    [FieldType.FieldSaveDate, FieldType.FieldSaveDate],
    [FieldType.FieldSection, FieldType.FieldSection],
    [FieldType.FieldSectionPages, FieldType.FieldSectionPages],
    [FieldType.FieldSet, FieldType.FieldSet],
    [FieldType.FieldSkipIf, FieldType.FieldSkipIf],
    [FieldType.FieldStyleRef, FieldType.FieldStyleRef],
    [FieldType.FieldSubject, FieldType.FieldSubject],
    [FieldType.FieldSubscriber, FieldType.FieldSubscriber],
    [FieldType.FieldSymbol, FieldType.FieldSymbol],
    [FieldType.FieldTemplate, FieldType.FieldTemplate],
    [FieldType.FieldTime, FieldType.FieldTime],
    [FieldType.FieldTitle, FieldType.FieldTitle],
    [FieldType.FieldUserAddress, FieldType.FieldUserAddress],
    [FieldType.FieldUserInitials, FieldType.FieldUserInitials],
    [FieldType.FieldUserName, FieldType.FieldUserName],
    [FieldType.FieldShape, FieldType.FieldShape],
    [FieldType.FieldBidiOutline, FieldType.FieldBidiOutline],
    [FieldType.FieldAddressBlock, FieldType.FieldAddressBlock],
    [FieldType.FieldSequence, FieldType.FieldSequence]
]);
/**
 * Hyperlink classification for field-based ({@link Hyperlink}) authoring.
 *
 * @public
 */
export enum HyperlinkType {
    /** Specifies the web link type. */
    WebLink = 'WebLink',
    /** Specifies the email link type. */
    EmailLink = 'EmailLink',
    /** Specifies the file link type. */
    FileLink = 'FileLink',
    /** Specifies the bookmark type. */
    Bookmark = 'Bookmark'
}
/**
 * Field mark types on `w:fldChar/@w:fldCharType` (`ST_FldCharType`).
 *
 * @private
 */
type FieldMarkType = 'begin' | 'separate' | 'end';
function wmlAttribute(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName && (a.namespaceUri === '' || a.prefix === 'w'))), ts330 == null ? undefined : ts330.value);
}
function parseFieldMarkType(raw: string | undefined): FieldMarkType | undefined {
    if (raw === 'begin' || raw === 'separate' || raw === 'end') {
        return raw;
    }
    return undefined;
}
class SimpleFieldRunOwner {
    private runs: TextRange[] = [];
    assertAttachedItem(target: ParagraphItem): void {
        if (!(target instanceof TextRange) || this.runs.indexOf(target) < 0) {
            throw new DetachedObjectError('This run is no longer in its field');
        }
    }
    appendRun(): TextRange {
        const run: TextRange = new TextRange(this);
        this.runs = [...this.runs, run];
        return run;
    }
    listRuns(): ReadonlyArray<TextRange> {
        return this.runs;
    }
    detachRuns(): void {
        for (const run of this.runs) {
            run.detach();
        }
        this.runs = [];
    }
    hydrateRuns(runs: TextRange[]): void {
        this.runs = runs;
        for (const run of runs) {
            run.attach(this);
        }
    }
}
type SimpleFieldInlineItem = {
    readonly type: 'textRange';
    readonly run: TextRange;
} | {
    readonly type: 'opaque';
    readonly xml: OpenXmlElement;
};
/**
 * Simple field storage (`w:fldSimple`).
 *
 * @private
 */
class SimpleField implements FeatureInline {
    private readonly runOwner: SimpleFieldRunOwner;
    private readonly extras: OpenXmlElement[];
    private readonly items: SimpleFieldInlineItem[];
    private instructionValue: string;
    readonly fldLock: boolean | undefined;
    readonly dirty: boolean | undefined;
    /**
     * @param {SimpleFieldRunOwner} runOwner - The run owner.
     * @param {OpenXmlElement[]} extras - The extras.
     * @param {SimpleFieldInlineItem[]} items - The items.
     * @param {string} instruction - The instruction.
     * @param {boolean | undefined} fldLock - The fld lock.
     * @param {boolean | undefined} dirty - The dirty.
     * @private
     */
    constructor(
        runOwner: SimpleFieldRunOwner,
        extras: OpenXmlElement[],
        items: SimpleFieldInlineItem[],
        instruction: string,
        fldLock: boolean | undefined,
        dirty: boolean | undefined
    ) {
        this.runOwner = runOwner;
        this.extras = extras;
        this.items = items;
        this.instructionValue = instruction;
        this.fldLock = fldLock;
        this.dirty = dirty;
    }
    /**
     * Field instruction (`w:fldSimple/@w:instr`).
     *
     * @private
     */
    get instruction(): string {
        return this.instructionValue;
    }
    /**
     * @param {string} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setInstruction(value: string): void {
        this.instructionValue = value;
    }
    /**
     * Result text ranges inside the simple field.
     *
     * @private
     */
    get runs(): ReadonlyArray<TextRange> {
        return this.runOwner.listRuns();
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    releaseContent(): void {
        this.runOwner.detachRuns();
    }
    toOpenXml(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [wmlAttr('instr', this.instructionValue)];
        if (this.fldLock !== undefined) {
            attributes.push(wmlAttr('fldLock', this.fldLock ? '1' : '0'));
        }
        if (this.dirty !== undefined) {
            attributes.push(wmlAttr('dirty', this.dirty ? '1' : '0'));
        }
        const children: OpenXmlElement[] = [...this.extras];
        for (const item of this.items) {
            if (item.type === 'textRange') {
                children.push(serializeTextRange(item.run));
            }
            else {
                children.push(item.xml);
            }
        }
        return wmlElement('fldSimple', { attributes, children });
    }
}
/**
 * Complex field character marker (`w:fldChar`).
 *
 * Children such as `w:ffData` and `w:fldData` are retained and re-emitted
 * unchanged. Typed form-field access is via {@link FormField}.
 *
 * @private
 */
class FieldMark implements FeatureRunLeaf {
    readonly fldCharType: FieldMarkType;
    readonly fldLock: boolean | undefined;
    readonly dirty: boolean | undefined;
    private readonly extras: OpenXmlElement[];
    /**
     * @param {FieldMarkType} fldCharType - The fld char type.
     * @param {boolean | undefined} fldLock - The fld lock.
     * @param {boolean | undefined} dirty - The dirty.
     * @param {OpenXmlElement[]} extras - The extras.
     * @private
     */
    constructor(fldCharType: FieldMarkType, fldLock: boolean | undefined, dirty: boolean | undefined, extras: OpenXmlElement[]) {
        this.fldCharType = fldCharType;
        this.fldLock = fldLock;
        this.dirty = dirty;
        this.extras = extras;
    }
    /**
     * Unmodeled / pass-through children of `w:fldChar` (includes `w:ffData`).
     *
     * @returns {ReadonlyArray<OpenXmlElement>} The result.
     * @private
     */
    childElements(): ReadonlyArray<OpenXmlElement> {
        return this.extras;
    }
    toOpenXml(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [wmlAttr('fldCharType', this.fldCharType)];
        if (this.fldLock !== undefined) {
            attributes.push(wmlAttr('fldLock', this.fldLock ? '1' : '0'));
        }
        if (this.dirty !== undefined) {
            attributes.push(wmlAttr('dirty', this.dirty ? '1' : '0'));
        }
        const children: OpenXmlElement[] = [...this.extras];
        return wmlElement('fldChar', { attributes, children });
    }
}
/**
 * Field instruction text (`w:instrText`).
 *
 * @private
 */
class InstrText implements FeatureRunLeaf {
    private textValue: string;
    readonly xmlSpacePreserve: boolean;
    /**
     * @param {string} text - The text.
     * @param {boolean} xmlSpacePreserve - The xml space preserve.
     * @private
     */
    constructor(text: string, xmlSpacePreserve: boolean) {
        this.textValue = text;
        this.xmlSpacePreserve = xmlSpacePreserve;
    }
    /**
     * Instruction text content.
     *
     * @private
     */
    get text(): string {
        return this.textValue;
    }
    /**
     * @param {string} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setText(value: string): void {
        this.textValue = value;
    }
    toOpenXml(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = this.xmlSpacePreserve ? [xmlSpacePreserve()] : [];
        return wmlElement('instrText', {
            attributes,
            children: [{ kind: 'text', value: this.textValue }]
        });
    }
}
/**
 * A complex field span within one paragraph (begin → instr → separate → result → end).
 *
 * Markers and instruction text are elevated {@link FeatureRunParagraphItem} values on the
 * paragraph; result content is plain {@link TextRange} siblings between separate and end.
 *
 * @private
 */
class ComplexField {
    private instructionValue: string;
    readonly resultRuns: ReadonlyArray<TextRange>;
    private readonly markerValues: ReadonlyArray<FeatureRunLeaf>;
    private readonly instructionTexts: ReadonlyArray<InstrText>;
    /**
     * @param {string} instruction - The instruction.
     * @param {ReadonlyArray<TextRange>} resultRuns - The result runs.
     * @param {ReadonlyArray<FeatureRunLeaf>} markerValues - The marker values.
     * @param {ReadonlyArray<InstrText>} instructionTexts - The instruction texts.
     * @private
     */
    constructor(
        instruction: string,
        resultRuns: ReadonlyArray<TextRange>,
        markerValues: ReadonlyArray<FeatureRunLeaf>,
        instructionTexts: ReadonlyArray<InstrText> = []
    ) {
        this.instructionValue = instruction;
        this.resultRuns = resultRuns;
        this.markerValues = markerValues;
        this.instructionTexts = instructionTexts;
    }
    /**
     * Instruction snapshot / live value.
     *
     * @private
     */
    get instruction(): string {
        return this.instructionValue;
    }
    /**
     * @param {string} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setInstruction(value: string): void {
        this.instructionValue = value;
        const trimmed: string = value.trim();
        const padded: string = trimmed.length === 0 ? ' ' : ` ${trimmed} `;
        let wrote: boolean = false;
        for (const instr of this.instructionTexts) {
            if (!wrote) {
                instr.setText(padded);
                wrote = true;
            }
            else {
                instr.setText('');
            }
        }
    }
    /**
     * All feature-run marker/instr values plus result text ranges, used for removal.
     *
     * @returns {ReadonlyArray<FeatureRunLeaf>} The result.
     * @private
     */
    allFeatureValues(): ReadonlyArray<FeatureRunLeaf> {
        return this.markerValues;
    }
}
/**
 * Read-only view of a legacy Word form field (`w:ffData` on begin `w:fldChar`).
 *
 * Form fields are complex-field spans whose begin marker carries form-field
 * data (ECMA-376-1 §17.16.17 `ffData`; Transitional `wml.xsd` `CT_FFData`).
 * This helper does **not** implement `FeatureInline` / `FeatureRunLeaf` and is
 * never serialized on its own — the begin `w:fldChar` re-emits the stored
 * `w:ffData` element (no double-emit). Internal field markers and complex-field
 * spans are not part of the public surface.
 *
 * Kind-specific members apply only when {@link type} matches; otherwise they
 * are `undefined` / empty. Mutation of `ffData` is out of scope for this MVP.
 *
/**
 * Customer-facing Word field (PAGE / NUMPAGES base; subclasses for IF / MERGEFIELD).
 *
 * Wraps either a simple field or a complex field span
 *. Does **not** recalculate Word field results.
 *
 * @public
 */
export class LegacyField {
    private readonly kind: 'simple' | 'complex';
    private readonly simple: SimpleField | undefined;
    private readonly complex: ComplexField | undefined;
    private readonly host: Paragraph | undefined;
    private readonly lockedType: FieldType;
    /**
     * @param {string | string} kind - The kind.
     * @param {SimpleField | undefined} simple - The simple.
     * @param {ComplexField | undefined} complex - The complex.
     * @param {Paragraph | undefined} host - The host.
     * @param {FieldType} lockedType - The locked type.
     * @private
     */
    constructor(kind: 'simple' | 'complex', simple: SimpleField | undefined, complex: ComplexField | undefined, host: Paragraph | undefined, lockedType: FieldType) {
        this.kind = kind;
        this.simple = simple;
        this.complex = complex;
        this.host = host;
        this.lockedType = lockedType;
    }
    /**
     * Gets or sets the field code.
     *
     * The instruction keyword must remain this field’s {@link fieldType}.
     */
    get fieldCode(): string {
        if (this.kind === 'simple' && this.simple !== undefined) {
            return this.simple.instruction;
        }
        if (this.complex !== undefined) {
            return this.complex.instruction;
        }
        return '';
    }
    set fieldCode(value: string) {
        if (value.trim().length === 0) {
            throw new DocxError('content/invalid-field', 'Field instruction must not be empty');
        }
        const nextType: FieldType = trySupportedFieldTypeFromInstruction(value);
        if (nextType === undefined || nextType !== this.lockedType) {
            throw new DocxError('content/invalid-field', 'Field instruction keyword must match fieldType ' + this.lockedType);
        }
        if (this.kind === 'simple' && this.simple !== undefined) {
            this.simple.setInstruction(value);
            return;
        }
        if (this.complex !== undefined) {
            this.complex.setInstruction(value);
        }
    }
    /**
     * Gets the supported field type for this instance (fixed at construction).
     */
    get fieldType(): FieldType {
        return this.lockedType;
    }
    /**
     * Gets the cached field-result text (read-only).
     */
    get fieldValue(): string {
        return this.readResultText();
    }
    /**
     * Gets or sets the cached visible field-result text.
     */
    get text(): string {
        return this.readResultText();
    }
    set text(value: string) {
        this.writeResultText(value);
    }
    /**
     * Gets the character format.
     */
    get characterFormat(): CharacterFormat {
        const run: TextRange = this.firstResultRun();
        if (run === undefined) {
            throw new DocxError('content/invalid-field', 'Field has no result run for characterFormat');
        }
        return run.characterFormat;
    }
    private readResultText(): string {
        if (this.kind === 'simple' && this.simple !== undefined) {
            return concatenateRunText(this.simple.runs);
        }
        if (this.complex !== undefined) {
            return concatenateRunText(this.complex.resultRuns);
        }
        return '';
    }
    private writeResultText(value: string): void {
        const runs: ReadonlyArray<TextRange> = this.resultRuns();
        if (runs.length === 0) {
            throw new DocxError('content/invalid-field', 'Field has no result run');
        }
        const first: TextRange = runs[0];
        if (first === undefined) {
            throw new DocxError('content/invalid-field', 'Field has no result run');
        }
        first.text = value;
        for (const range of runs.slice(1)) {
            range.text = '';
        }
    }
    private resultRuns(): ReadonlyArray<TextRange> {
        if (this.kind === 'simple' && this.simple !== undefined) {
            return this.simple.runs;
        }
        if (this.complex !== undefined) {
            return this.complex.resultRuns;
        }
        return [];
    }
    private firstResultRun(): TextRange | undefined {
        const runs: ReadonlyArray<TextRange> = this.resultRuns();
        return runs.length > 0 ? runs[0] : undefined;
    }
}
/**
 * Conditional `IF` field. Expression lives entirely in {@link Field.fieldCode}.
 *
 * @public
 */
export class LegacyIfField extends LegacyField {
}
/**
 * Mail-merge `MERGEFIELD` with typed switch accessors.
 *
 * @public
 */
export class LegacyMergeField extends LegacyField {
    /**
     * Gets the name of the data field referenced by the merge field.
     */
    get fieldName(): string {
        return parseMergeFieldInstruction(this.fieldCode).fieldName;
    }
    set fieldName(value: string) {
        const name: string = value.trim();
        if (name.length === 0) {
            throw new DocxError('content/invalid-field', 'MergeField fieldName must not be empty');
        }
        const parsed: MergeFieldParsed = parseMergeFieldInstruction(this.fieldCode);
        parsed.fieldName = name;
        this.fieldCode = formatMergeFieldInstruction(parsed);
    }
    /**
     * Gets the text that is displayed before the merged value when the field is not empty.
     */
    get textBefore(): string {
        return parseMergeFieldInstruction(this.fieldCode).textBefore;
    }
    set textBefore(value: string) {
        const parsed: MergeFieldParsed = parseMergeFieldInstruction(this.fieldCode);
        parsed.textBefore = value;
        this.fieldCode = formatMergeFieldInstruction(parsed);
    }
    /**
     * Gets the text that is displayed after the merged value when the field is not empty.
     */
    get textAfter(): string {
        return parseMergeFieldInstruction(this.fieldCode).textAfter;
    }
    set textAfter(value: string) {
        const parsed: MergeFieldParsed = parseMergeFieldInstruction(this.fieldCode);
        parsed.textAfter = value;
        this.fieldCode = formatMergeFieldInstruction(parsed);
    }
    /**
     * Gets the date format switch applied to the merged value.
     */
    get dateFormat(): string {
        return parseMergeFieldInstruction(this.fieldCode).dateFormat;
    }
    /**
     * Gets the numeric format switch applied to the merged value.
     */
    get numberFormat(): string {
        return parseMergeFieldInstruction(this.fieldCode).numberFormat;
    }
    /**
     * Gets the text that is displayed before the merged value. It mirrors {@link LegacyMergeField.textBefore} when present.
     */
    get prefix(): string {
        // prefix mirrors text-before (`\b`) when present.
        return this.textBefore;
    }
}
/**
 * Hyperlink facade over either a HYPERLINK field or a picture DrawingML link.
 *
 * Distinct from the `w:hyperlink` inline model in `features/hyperlinks`.
 * The all-in entry exports this type as {@link Hyperlink}; the inline
 * relationship hyperlink is available from `@syncfusion/ej2-docx/hyperlinks`.
 *
 * @public
 */
export class Hyperlink {
    private readonly fieldValue: Field | LegacyField | undefined;
    private readonly pictureValue: Picture | undefined;
    private pictureTypeValue: HyperlinkType;
    private pictureUriValue: string;
    /**
     * @private
     */
    constructor(field: Field | LegacyField);
    /**
     * @private
     */
    constructor(picture: Picture, uri: string, type: HyperlinkType);
    constructor(fieldOrPicture: Field | LegacyField | Picture, uri?: string, type?: HyperlinkType) {
        if (fieldOrPicture instanceof Picture) {
            this.fieldValue = undefined;
            this.pictureValue = fieldOrPicture;
            this.pictureUriValue = uri != null ? uri : '';
            this.pictureTypeValue = type != null ? type : HyperlinkType.WebLink;
        }
        else {
            this.fieldValue = fieldOrPicture;
            this.pictureValue = undefined;
            this.pictureUriValue = '';
            this.pictureTypeValue = HyperlinkType.WebLink;
        }
    }
    /**
     * Underlying field when this hyperlink is field-backed.
     */
    get field(): Field | LegacyField | undefined {
        return this.fieldValue;
    }
    /**
     * Field type when field-backed (used by structure tests).
     */
    get fieldType(): FieldType | undefined {
        if (this.fieldValue === undefined) {
            return undefined;
        }
        return this.fieldValue.fieldType;
    }
    get bookmarkName(): string {
        if (this.fieldValue === undefined) {
            return this.pictureTypeValue === HyperlinkType.Bookmark ? this.pictureUriValue : '';
        }
        return parseHyperlinkInstruction(this.fieldValue.fieldCode).bookmarkName;
    }
    set bookmarkName(value: string) {
        if (this.fieldValue === undefined) {
            this.pictureUriValue = value;
            this.pictureTypeValue = HyperlinkType.Bookmark;
            return;
        }
        const parsed: HyperlinkParsed = parseHyperlinkInstruction(this.fieldValue.fieldCode);
        parsed.bookmarkName = value;
        if (value.trim().length > 0) {
            parsed.type = HyperlinkType.Bookmark;
        }
        this.fieldValue.fieldCode = formatHyperlinkInstruction(parsed);
    }
    get filePath(): string {
        if (this.fieldValue === undefined) {
            return this.pictureTypeValue === HyperlinkType.FileLink ? this.pictureUriValue : '';
        }
        const parsed: HyperlinkParsed = parseHyperlinkInstruction(this.fieldValue.fieldCode);
        return parsed.type === HyperlinkType.FileLink ? parsed.target : '';
    }
    set filePath(value: string) {
        if (this.fieldValue === undefined) {
            this.pictureUriValue = value;
            this.pictureTypeValue = HyperlinkType.FileLink;
            return;
        }
        const parsed: HyperlinkParsed = parseHyperlinkInstruction(this.fieldValue.fieldCode);
        parsed.target = value;
        parsed.type = HyperlinkType.FileLink;
        this.fieldValue.fieldCode = formatHyperlinkInstruction(parsed);
    }
    get localReference(): string {
        return this.bookmarkName;
    }
    set localReference(value: string) {
        this.bookmarkName = value;
    }
    get pictureToDisplay(): Picture | undefined {
        return this.pictureValue;
    }
    set pictureToDisplay(value: Picture | undefined) {
        if (this.pictureValue === undefined) {
            throw new DocxError('content/invalid-field', 'pictureToDisplay is only supported on picture-backed hyperlinks');
        }
        if (value === undefined) {
            throw new DocxError('content/invalid-field', 'pictureToDisplay cannot be cleared on a picture-backed hyperlink');
        }
        // Identity is fixed at construction for this phase.
        if (value !== this.pictureValue) {
            throw new DocxError('content/invalid-field', 'pictureToDisplay cannot replace the linked picture in this phase');
        }
    }
    get textToDisplay(): string {
        if (this.fieldValue === undefined) {
            return '';
        }
        return this.fieldValue.text;
    }
    set textToDisplay(value: string) {
        if (this.fieldValue === undefined) {
            throw new DocxError('content/invalid-field', 'textToDisplay is not supported on picture-backed hyperlinks');
        }
        this.fieldValue.text = value;
    }
    get type(): HyperlinkType {
        if (this.fieldValue === undefined) {
            return this.pictureTypeValue;
        }
        return parseHyperlinkInstruction(this.fieldValue.fieldCode).type;
    }
    set type(value: HyperlinkType) {
        if (this.fieldValue === undefined) {
            this.pictureTypeValue = value;
            return;
        }
        const parsed: HyperlinkParsed = parseHyperlinkInstruction(this.fieldValue.fieldCode);
        parsed.type = value;
        this.fieldValue.fieldCode = formatHyperlinkInstruction(parsed);
    }
    get uri(): string {
        if (this.fieldValue === undefined) {
            if (this.pictureTypeValue === HyperlinkType.Bookmark) {
                return '';
            }
            return this.pictureUriValue;
        }
        const parsed: HyperlinkParsed = parseHyperlinkInstruction(this.fieldValue.fieldCode);
        if (parsed.type === HyperlinkType.Bookmark) {
            return '';
        }
        return parsed.target;
    }
    set uri(value: string) {
        if (this.fieldValue === undefined) {
            this.pictureUriValue = value;
            if (/^mailto:/i.test(value.trim())) {
                this.pictureTypeValue = HyperlinkType.EmailLink;
            }
            else if (this.pictureTypeValue === HyperlinkType.Bookmark) {
                this.pictureTypeValue = HyperlinkType.WebLink;
            }
            if (this.pictureValue !== undefined) {
                this.pictureValue.hyperlinkTarget = value;
            }
            return;
        }
        const parsed: HyperlinkParsed = parseHyperlinkInstruction(this.fieldValue.fieldCode);
        parsed.target = value;
        if (/^mailto:/i.test(value.trim())) {
            parsed.type = HyperlinkType.EmailLink;
        }
        else if (parsed.type === HyperlinkType.Bookmark) {
            parsed.type = HyperlinkType.WebLink;
        }
        this.fieldValue.fieldCode = formatHyperlinkInstruction(parsed);
    }
}
function concatenateRunText(runs: ReadonlyArray<TextRange>): string {
    let text: string = '';
    for (const run of runs) {
        text += run.text;
    }
    return text;
}
/**
 * Field keyword of an instruction: `=` for formula fields (Word writes `=10+20` or `= 10+20`
 * without a separating space), otherwise the first whitespace-delimited word, upper-cased.
 *
 * @param {string} instruction - The field instruction.
 * @returns {string} The keyword, or an empty string.
 * @private
 */
export function instructionKeyword(instruction: string): string {
    const trimmed: string = instruction.trim();
    if (trimmed.charAt(0) === '=') {
        return '=';
    }
    const match: RegExpExecArray | null = /^[^\s"]+/.exec(trimmed);
    return match === null ? '' : match[0].toUpperCase();
}
/**
 * Supported field type for an instruction, or undefined when the keyword is not supported.
 *
 * @param {string} instruction - The field instruction.
 * @returns {FieldType | undefined} The type.
 * @private
 */
function trySupportedFieldTypeFromInstruction(instruction: string): FieldType | undefined {
    const keyword: string = instructionKeyword(instruction);
    return keyword.length === 0 ? undefined : SUPPORTED_FIELD_TYPES.get(keyword);
}
function wrapSupportedField(kind: 'simple' | 'complex', simple: SimpleField | undefined, complex: ComplexField | undefined, host: Paragraph, instruction: string): LegacyField | undefined {
    const type: FieldType = trySupportedFieldTypeFromInstruction(instruction);
    if (type === undefined) {
        return undefined;
    }
    if (type === FieldType.If) {
        return new LegacyIfField(kind, simple, complex, host, type);
    }
    if (type === FieldType.MergeField) {
        return new LegacyMergeField(kind, simple, complex, host, type);
    }
    return new LegacyField(kind, simple, complex, host, type);
}
interface MergeFieldParsed {
    fieldName: string;
    textBefore: string;
    textAfter: string;
    dateFormat: string;
    numberFormat: string;
    otherSwitches: Array<{ flag: string; value: string | undefined }>;
}
function parseMergeFieldInstruction(instruction: string): MergeFieldParsed {
    const tokens: string[] = tokenizeFieldInstruction(instruction);
    const result: MergeFieldParsed = {
        fieldName: '',
        textBefore: '',
        textAfter: '',
        dateFormat: '',
        numberFormat: '',
        otherSwitches: []
    };
    let index: number = 1;
    if (tokens.length > 1) {
        const first: string = tokens[1];
        if (first !== undefined && !first.startsWith('\\')) {
            result.fieldName = first;
            index = 2;
        }
    }
    while (index < tokens.length) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const fieldToken: string = tokens[index];
        if (fieldToken === undefined) {
            break;
        }
        if (!fieldToken.startsWith('\\')) {
            index += 1;
            continue;
        }
        const next: string = tokens[index + 1];
        const hasValue: boolean = next !== undefined && !next.startsWith('\\');
        const value: string = hasValue ? next : undefined;
        const flag: string = fieldToken.toLowerCase();
        if (flag === '\\b') {
            result.textBefore = value != null ? value : '';
        }
        else if (flag === '\\f') {
            result.textAfter = value != null ? value : '';
        }
        else if (flag === '\\@') {
            result.dateFormat = value != null ? value : '';
        }
        else if (flag === '\\#') {
            result.numberFormat = value != null ? value : '';
        }
        else {
            result.otherSwitches.push({ flag: fieldToken, value });
        }
        index += hasValue ? 2 : 1;
    }
    return result;
}
function quoteFieldOperand(value: string): string {
    if (value.length === 0) {
        return '""';
    }
    if (/[\s"]/.test(value)) {
        return '"' + value.replace(/"/g, '') + '"';
    }
    return value;
}
function unquoteFieldOperand(value: string): string {
    if (value.length >= 2 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        return value.substring(1, value.length - 1);
    }
    return value;
}
function formatMergeFieldInstruction(parsed: MergeFieldParsed): string {
    let code: string = ' MERGEFIELD ' + parsed.fieldName;
    if (parsed.textBefore.length > 0) {
        code += ' \\b ' + quoteFieldOperand(parsed.textBefore);
    }
    if (parsed.textAfter.length > 0) {
        code += ' \\f ' + quoteFieldOperand(parsed.textAfter);
    }
    if (parsed.dateFormat.length > 0) {
        code += ' \\@ ' + quoteFieldOperand(parsed.dateFormat);
    }
    if (parsed.numberFormat.length > 0) {
        code += ' \\# ' + quoteFieldOperand(parsed.numberFormat);
    }
    for (const sw of parsed.otherSwitches) {
        code += ' ' + sw.flag;
        if (sw.value !== undefined) {
            code += ' ' + quoteFieldOperand(sw.value);
        }
    }
    return code + ' ';
}

interface HyperlinkParsed {
    type: HyperlinkType;
    target: string;
    bookmarkName: string;
    otherSwitches: Array<{ flag: string; value: string | undefined }>;
}
function detectHyperlinkType(target: string, bookmarkName: string): HyperlinkType {
    if (bookmarkName.trim().length > 0 && target.trim().length === 0) {
        return HyperlinkType.Bookmark;
    }
    const t: string = target.trim();
    if (/^mailto:/i.test(t)) {
        return HyperlinkType.EmailLink;
    }
    if (/^[a-zA-Z]:[\\/]/.test(t) || t.indexOf('\\') >= 0 || /^file:/i.test(t)) {
        return HyperlinkType.FileLink;
    }
    if (bookmarkName.trim().length > 0) {
        return HyperlinkType.Bookmark;
    }
    return HyperlinkType.WebLink;
}
function parseHyperlinkInstruction(instruction: string): HyperlinkParsed {
    const tokens: string[] = tokenizeFieldInstruction(instruction);
    const result: HyperlinkParsed = {
        type: HyperlinkType.WebLink,
        target: '',
        bookmarkName: '',
        otherSwitches: []
    };
    let index: number = 1;
    if (tokens.length > 1) {
        const first: string = tokens[1];
        if (first !== undefined && !first.startsWith('\\')) {
            result.target = first;
            index = 2;
        }
    }
    while (index < tokens.length) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const fieldToken: string = tokens[index];
        if (fieldToken === undefined) {
            break;
        }
        if (!fieldToken.startsWith('\\')) {
            index += 1;
            continue;
        }
        const next: string = tokens[index + 1];
        const hasValue: boolean = next !== undefined && !next.startsWith('\\');
        const value: string = hasValue ? next : undefined;
        const flag: string = fieldToken.toLowerCase();
        if (flag === '\\l') {
            result.bookmarkName = value != null ? value : '';
        }
        else {
            result.otherSwitches.push({ flag: fieldToken, value });
        }
        index += hasValue ? 2 : 1;
    }
    result.type = detectHyperlinkType(result.target, result.bookmarkName);
    return result;
}
function formatHyperlinkInstruction(parsed: HyperlinkParsed): string {
    let code: string = ' HYPERLINK';
    if (parsed.type === HyperlinkType.Bookmark) {
        if (parsed.target.trim().length > 0) {
            code += ' ' + quoteFieldOperand(parsed.target);
        }
        if (parsed.bookmarkName.trim().length > 0) {
            code += ' \\l ' + quoteFieldOperand(parsed.bookmarkName);
        }
    }
    else {
        if (parsed.target.trim().length > 0) {
            code += ' ' + quoteFieldOperand(parsed.target);
        }
        if (parsed.bookmarkName.trim().length > 0) {
            code += ' \\l ' + quoteFieldOperand(parsed.bookmarkName);
        }
    }
    for (const sw of parsed.otherSwitches) {
        code += ' ' + sw.flag;
        if (sw.value !== undefined) {
            code += ' ' + quoteFieldOperand(sw.value);
        }
    }
    return code + ' ';
}

function firstWmlChild(parent: OpenXmlElement, localName: string): OpenXmlElement | undefined {
    for (const child of elementChildren(parent)) {
        if (isWml(child, localName)) {
            return child;
        }
    }
    return undefined;
}
function firstChildVal(parent: OpenXmlElement, localName: string): string | undefined {
    const child: OpenXmlElement = firstWmlChild(parent, localName);
    return child === undefined ? undefined : wValAttribute(child);
}
function firstChildOnOff(parent: OpenXmlElement, localName: string): boolean | undefined {
    const child: OpenXmlElement = firstWmlChild(parent, localName);
    return child === undefined ? undefined : parseOnOff(child);
}
function firstChildDecimal(parent: OpenXmlElement, localName: string): number | undefined {
    const raw: string = firstChildVal(parent, localName);
    return parseDecimalNumber(raw);
}
function nestedChildVal(parent: OpenXmlElement, nestLocalName: string, childLocalName: string): string | undefined {
    const nest: OpenXmlElement = firstWmlChild(parent, nestLocalName);
    return nest === undefined ? undefined : firstChildVal(nest, childLocalName);
}
function nestedChildOnOff(parent: OpenXmlElement, nestLocalName: string, childLocalName: string): boolean | undefined {
    const nest: OpenXmlElement = firstWmlChild(parent, nestLocalName);
    return nest === undefined ? undefined : firstChildOnOff(nest, childLocalName);
}
function nestedChildDecimal(parent: OpenXmlElement, nestLocalName: string, childLocalName: string): number | undefined {
    const nest: OpenXmlElement = firstWmlChild(parent, nestLocalName);
    return nest === undefined ? undefined : firstChildDecimal(nest, childLocalName);
}
function parseDecimalNumber(raw: string | undefined): number | undefined {
    if (raw === undefined || raw.length === 0) {
        return undefined;
    }
    if (!/^-?\d+$/.test(raw.trim())) {
        return undefined;
    }
    const value: number = Number(raw.trim());
    return Number.isSafeInteger(value) ? value : undefined;
}
function formFieldKindFromFfData(data: OpenXmlElement): FormFieldType | undefined {
    // CT_FFData ends with a choice of one of checkBox | ddList | textInput.
    // Prefer the first exclusive child found in document order.
    for (const child of elementChildren(data)) {
        if (isWml(child, 'textInput')) {
            return FormFieldType.TextInput;
        }
        if (isWml(child, 'checkBox')) {
            return FormFieldType.CheckBox;
        }
        if (isWml(child, 'ddList')) {
            return FormFieldType.DropDown;
        }
    }
    return undefined;
}
function ffDataFromFieldMark(fieldMark: FieldMark): OpenXmlElement | undefined {
    for (const child of fieldMark.childElements()) {
        if (isWml(child, 'ffData')) {
            return child;
        }
    }
    return undefined;
}
function parseSimpleField(element: OpenXmlElement): SimpleField | undefined {
    if (!isWml(element, 'fldSimple')) {
        return undefined;
    }
    const instruction: string = wmlAttribute(element, 'instr');
    if (instruction === undefined || instruction.length === 0) {
        return undefined;
    }
    const runOwner: SimpleFieldRunOwner = new SimpleFieldRunOwner();
    const extras: OpenXmlElement[] = [];
    const items: SimpleFieldInlineItem[] = [];
    const parsedRuns: TextRange[] = [];
    for (const child of elementChildren(element)) {
        if (isWml(child, 'fldData')) {
            extras.push(child);
            continue;
        }
        if (isWml(child, 'r')) {
            const run: TextRange = TextRange.fromXml(child, runOwner);
            parsedRuns.push(run);
            items.push({ type: 'textRange', run });
            continue;
        }
        extras.push(child);
        items.push({ type: 'opaque', xml: child });
    }
    runOwner.hydrateRuns(parsedRuns);
    return new SimpleField(runOwner, extras, items, instruction, parseOnOffAttribute(wmlAttribute(element, 'fldLock')), parseOnOffAttribute(wmlAttribute(element, 'dirty')));
}
function parseFieldMark(element: OpenXmlElement): FieldMark | undefined {
    if (!isWml(element, 'fldChar')) {
        return undefined;
    }
    const fldCharType: FieldMarkType = parseFieldMarkType(wmlAttribute(element, 'fldCharType'));
    if (fldCharType === undefined) {
        return undefined;
    }
    const extras: OpenXmlElement[] = [];
    for (const child of elementChildren(element)) {
        extras.push(child);
    }
    return new FieldMark(fldCharType, parseOnOffAttribute(wmlAttribute(element, 'fldLock')), parseOnOffAttribute(wmlAttribute(element, 'dirty')), extras);
}
function parseOnOffAttribute(raw: string | undefined): boolean | undefined {
    if (raw === undefined || raw === '0' || raw === 'false') {
        return raw === undefined ? undefined : false;
    }
    return true;
}
function parseInstrText(element: OpenXmlElement): InstrText | undefined {
    if (!isWml(element, 'instrText')) {
        return undefined;
    }
    return new InstrText(textContent(element), xmlSpaceIsPreserve(element));
}
/**
 * Flattened paragraph item used while pairing complex fields. Feature marks and
 * instruction text are elevated `featureRun` items; result text is {@link TextRange}.
 */
interface FlatFieldItem {
    readonly item: ParagraphItem;
}
function flattenFieldItems(paragraph: Paragraph): FlatFieldItem[] {
    const flat: FlatFieldItem[] = [];
    for (const item of paragraph.items) {
        if (item instanceof TextRange) {
            flat.push({ item });
            continue;
        }
        if (item instanceof FeatureRunParagraphItem &&
            item.featureId === FIELDS &&
            (item.value instanceof FieldMark || item.value instanceof InstrText)) {
            flat.push({ item });
            continue;
        }
        // Other paragraph content (tabs/breaks/images/featureInline) is skipped for pairing.
    }
    return flat;
}
function instructionFromItems(items: ReadonlyArray<FlatFieldItem>, start: number, end: number): string {
    let instruction: string = '';
    for (let index: number = start; index < end; index += 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const entry: FlatFieldItem = items[index];
        if (entry === undefined) {
            continue;
        }
        const item: ParagraphItem = entry.item;
        if (item instanceof FeatureRunParagraphItem && item.value instanceof InstrText) {
            instruction += item.value.text;
        }
    }
    return instruction.trim();
}
function pairComplexField(flat: ReadonlyArray<FlatFieldItem>, beginIndex: number): ComplexField | undefined {
    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
    const begin: FlatFieldItem = flat[beginIndex];
    if (begin === undefined ||
        !(begin.item instanceof FeatureRunParagraphItem) ||
        !(begin.item.value instanceof FieldMark) ||
        begin.item.value.fldCharType !== 'begin') {
        return undefined;
    }
    const markerValues: FeatureRunLeaf[] = [begin.item.value];
    const instructionTexts: InstrText[] = [];
    let separateIndex: number = -1;
    let depth: number = 1;
    for (let index: number = beginIndex + 1; index < flat.length; index += 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const entry: FlatFieldItem = flat[index];
        if (entry === undefined) {
            return undefined;
        }
        const item: ParagraphItem = entry.item;
        if (item instanceof FeatureRunParagraphItem && item.value instanceof FieldMark) {
            const mark: FieldMark = item.value;
            if (mark.fldCharType === 'begin') {
                depth += 1;
                markerValues.push(mark);
                continue;
            }
            if (mark.fldCharType === 'end') {
                depth -= 1;
                if (depth === 0) {
                    // End before separate — incomplete outer field.
                    return undefined;
                }
                markerValues.push(mark);
                continue;
            }
            if (mark.fldCharType === 'separate' && depth === 1) {
                separateIndex = index;
                markerValues.push(mark);
                break;
            }
            markerValues.push(mark);
            continue;
        }
        if (depth === 1 && item instanceof FeatureRunParagraphItem && item.value instanceof InstrText) {
            instructionTexts.push(item.value);
            markerValues.push(item.value);
        }
        else if (item instanceof FeatureRunParagraphItem && item.value instanceof InstrText) {
            markerValues.push(item.value);
        }
    }
    if (separateIndex < 0) {
        return undefined;
    }
    const instruction: string = instructionFromItems(flat, beginIndex + 1, separateIndex);
    // Nested spans may leave empty outer instruction text; still require non-empty for ComplexField views.
    if (instruction.length === 0) {
        return undefined;
    }
    const resultRuns: TextRange[] = [];
    let endIndex: number = -1;
    depth = 1;
    for (let index: number = separateIndex + 1; index < flat.length; index += 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const entry: FlatFieldItem = flat[index];
        if (entry === undefined) {
            return undefined;
        }
        const item: ParagraphItem = entry.item;
        if (item instanceof FeatureRunParagraphItem && item.value instanceof FieldMark) {
            const mark: FieldMark = item.value;
            if (mark.fldCharType === 'begin') {
                depth += 1;
                markerValues.push(mark);
                continue;
            }
            if (mark.fldCharType === 'end') {
                depth -= 1;
                if (depth === 0) {
                    endIndex = index;
                    markerValues.push(mark);
                    break;
                }
                markerValues.push(mark);
                continue;
            }
            markerValues.push(mark);
            continue;
        }
        if (depth === 1 && item instanceof TextRange) {
            resultRuns.push(item);
        }
    }
    if (endIndex < 0 || resultRuns.length === 0) {
        return undefined;
    }
    return new ComplexField(instruction, resultRuns, markerValues, instructionTexts);
}
let registered: boolean = false;

/**
 * @param {ParagraphItem[]} items - The items.
 * @returns {void} Nothing is returned.
 * @private
 * Post-process a paragraph to expose field markers as proper ParagraphItems.
 *
 * Called by paragraph parsing after all items have been collected but before hydration.
 * The function converts FeatureRunParagraphItem wrappers to proper ParagraphItems:
 * - FeatureRunParagraphItem(FieldMark with fldCharType='begin') → ParagraphItem Field
 * - FeatureRunParagraphItem(FieldMark with fldCharType='separate') → ParagraphItem FieldMark
 * - FeatureRunParagraphItem(FieldMark with fldCharType='end') → ParagraphItem FieldMark
 * - FeatureRunParagraphItem(InstrText) → TextRange (instruction code)
 *
 * Each field marker remains as a separate ParagraphItem in the array, maintaining
 * the complete DOM structure: Field (begin) → TextRange (code) → FieldMark (separate)
 * → TextRange (result) → FieldMark (end)
 */
function reconstructFieldStructure(items: ParagraphItem[]): void {
    // First pass: collect field information (begin markers and instruction text)
    const fieldBeginsByIndex: Map<number, { beginIdx: number; instrText: string }> =
        new Map<number, { beginIdx: number; instrText: string | undefined }>();
    // Stack of open fields so nested fields keep their own (concatenated) instruction text.
    const open: Array<{ beginIdx: number; inInstruction: boolean }> = [];

    for (const [i, item] of items.entries()) {

        if (!(item instanceof FeatureRunParagraphItem) || item.featureId !== FIELDS) {
            continue;
        }

        const value: FeatureRunLeaf = item.value;

        if (value instanceof FieldMark) {
            if (value.fldCharType === 'begin') {
                open.push({ beginIdx: i, inInstruction: true });
                fieldBeginsByIndex.set(i, { beginIdx: i, instrText: undefined });
            } else if (value.fldCharType === 'separate' && open.length > 0) {
                open[open.length - 1]!.inInstruction = false;
            } else if (value.fldCharType === 'end') {
                open.pop();
            }
        } else if (value instanceof InstrText && open.length > 0) {
            const top: { beginIdx: number; inInstruction: boolean } = open[open.length - 1]!;
            const fieldInfo: { beginIdx: number; instrText: string; } = fieldBeginsByIndex.get(top.beginIdx);
            if (top.inInstruction && fieldInfo !== undefined) {
                fieldInfo.instrText = (fieldInfo.instrText === undefined ? '' : fieldInfo.instrText) + value.text;
            }
        }
    }

    // Second pass: convert items in-place (complex and simple fields).
    // Walk in reverse: expanding a w:fldSimple inserts items and would shift any
    // later fldChar begin marker to a new index, breaking the index-keyed
    // fieldBeginsByIndex lookups collected above. Processing from the end means
    // every begin marker is converted at its original index before any
    // lower-index expansion can shift it.
    for (let i: number = items.length - 1; i >= 0; i -= 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const item: ParagraphItem = items[i];

        // Handle FeatureRunParagraphItem (complex fields)
        if (item instanceof FeatureRunParagraphItem && item.featureId === FIELDS) {
            const value: FeatureRunLeaf = item.value;

            // Convert FieldMark to ParagraphItem Field or FieldMark
            if (value instanceof FieldMark) {
                const fieldInfo: { beginIdx: number; instrText: string; } = fieldBeginsByIndex.get(i);
                const converted: Field | ParagraphFieldMark = convertFieldMarkToFieldMark(
                    value,
                    item,
                    fieldInfo === undefined ? undefined : fieldInfo.instrText
                );
                if (converted !== undefined) {
                    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                    items[i] = converted;
                }
            }
            // Convert InstrText to TextRange
            else if (value instanceof InstrText) {
                const textRange: TextRange = new TextRange(undefined, item.wireGroup);
                textRange.setTextFromParse(value.text, value.xmlSpacePreserve);
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                items[i] = textRange;
            }
            continue;
        }

        // Handle FeatureInlineParagraphItem (simple fields)
        if (item instanceof FeatureInlineParagraphItem && item.featureId === FIELDS) {
            const value: FeatureInline = item.value;

            // Convert SimpleField to complex field structure (multiple ParagraphItems)
            // This expands w:fldSimple into: Field + TextRange (instr) + FieldMark (sep) + TextRange (result) + FieldMark (end)
            if (value instanceof SimpleField) {
                // Get result text ranges from the simple field
                const resultRanges: ReadonlyArray<TextRange> = value.runs;

                // Create the complex field structure
                const field: Field = convertSimpleFieldToField(value);

                // Create instruction text range
                const instrRange: TextRange = new TextRange();
                instrRange.setTextFromParse(value.instruction, false);

                // Create separator mark (using ParagraphFieldMark alias)
                const sepMark: ParagraphFieldMark = new ParagraphFieldMark(
                    ParagraphFieldMarkType.Separator,
                    value.fldLock,
                    value.dirty,
                    []
                );

                // Create end mark
                const endMark: ParagraphFieldMark = new ParagraphFieldMark(
                    ParagraphFieldMarkType.End,
                    value.fldLock,
                    value.dirty,
                    []
                );

                // Build the expanded structure: Field + instr + sep + result(s) + end
                // The index i will be replaced with the Field, then we insert the rest after
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                items[i] = field;

                // Insert instruction, separator, result ranges, and end mark after the field
                let insertIndex: number = i + 1;

                // Insert instruction TextRange
                items.splice(insertIndex, 0, instrRange);
                insertIndex += 1;

                // Insert separator FieldMark
                items.splice(insertIndex, 0, sepMark);
                insertIndex += 1;

                // Insert result TextRanges (preserve original formatting and content)
                for (const resultRange of resultRanges) {
                    items.splice(insertIndex, 0, resultRange);
                    insertIndex += 1;
                }

                // Insert end FieldMark
                items.splice(insertIndex, 0, endMark);
            }
        }
    }
}

/**
 * Reconstruct a FormField from w:ffData element.
 *
 * @param {OpenXmlElement} ffDataElement - The ffData element.
 * @param {FieldMark} leafMark - The leaf mark.
 * @param {FeatureRunParagraphItem} wrapper - The wrapper.
 * @returns {NewFormField | undefined} The reconstructed form field or undefined.
 * @private
 */
function reconstructFormFieldFromFFData(
    ffDataElement: OpenXmlElement,
    leafMark: FieldMark,
    wrapper: FeatureRunParagraphItem
): NewFormField | undefined {
    // Detect the form field type by examining children of w:ffData
    let formField: NewFormField | undefined;
    let nameValue: string = '';
    let enabledValue: boolean = true;
    let helpTextValue: string = '';
    let helpTextTypeValue: string = 'text'; // default to 'text'
    let statusBarHelpValue: string = '';
    let statusTextTypeValue: string = 'text'; // default to 'text'
    let calculateOnExitValue: boolean = false;

    for (const child of elementChildren(ffDataElement)) {
        if (isWml(child, 'name')) {
            nameValue = wValAttribute(child) || '';
        } else if (isWml(child, 'enabled')) {
            // ST_OnOff: a bare element or a true-like value means enabled; off values disable it.
            const rawEnabled: string = (wValAttribute(child) || '').toLowerCase();
            enabledValue = !(rawEnabled === '0' || rawEnabled === 'false' || rawEnabled === 'off');
        } else if (isWml(child, 'helpText')) {
            helpTextValue = wValAttribute(child) || '';
            // Also capture the type attribute
            const typeAttrFound: OpenXmlAttribute | undefined = child.attributes.find((a: OpenXmlAttribute) =>
                a.localName === 'type' && (isWmlNamespace(a.namespaceUri) || a.namespaceUri === '')
            );
            if (typeAttrFound !== undefined) {
                helpTextTypeValue = typeAttrFound.value || 'text';
            }
        } else if (isWml(child, 'statusText')) {
            statusBarHelpValue = wValAttribute(child) || '';
            // Also capture the type attribute
            const typeAttrFound: OpenXmlAttribute | undefined = child.attributes.find((a: OpenXmlAttribute) =>
                a.localName === 'type' && (isWmlNamespace(a.namespaceUri) || a.namespaceUri === '')
            );
            if (typeAttrFound !== undefined) {
                statusTextTypeValue = typeAttrFound.value || 'text';
            }
        } else if (isWml(child, 'calcOnExit')) {
            calculateOnExitValue = true;
        } else if (isWml(child, 'checkBox')) {
            // Create checkbox form field
            // Don't pass leafMark.childElements() as extras - they may contain w:ffData which will be duplicated
            formField = new CheckBoxFormField(leafMark.fldLock, leafMark.dirty, [], wrapper.wireGroup);
            parseCheckBoxFFDataChildren(child, formField as CheckBoxFormField);
        } else if (isWml(child, 'ddList')) {
            // Create dropdown form field
            // Don't pass leafMark.childElements() as extras - they may contain w:ffData which will be duplicated
            formField = new DropDownFormField(leafMark.fldLock, leafMark.dirty, [], wrapper.wireGroup);
            parseDropDownFFDataChildren(child, formField as DropDownFormField);
        } else if (isWml(child, 'textInput')) {
            // Create text form field
            // Don't pass leafMark.childElements() as extras - they may contain w:ffData which will be duplicated
            formField = new TextFormField(leafMark.fldLock, leafMark.dirty, [], wrapper.wireGroup);
            parseTextFormFieldFFDataChildren(child, formField as TextFormField);
        }
    }

    // Apply common properties to the form field
    if (formField !== undefined) {
        formField.name = nameValue;
        formField.enabled = enabledValue;
        formField.help = helpTextValue;
        // Apply help text type if it's not the default
        if (helpTextTypeValue !== 'text' && (formField as any).helpTextTypeValue !== undefined) {
            (formField as any).helpTextTypeValue = helpTextTypeValue;
        }
        formField.statusBarHelp = statusBarHelpValue;
        // Apply status text type if it's not the default
        if (statusTextTypeValue !== 'text' && (formField as any).statusTextTypeValue !== undefined) {
            (formField as any).statusTextTypeValue = statusTextTypeValue;
        }
        formField.calculateOnExit = calculateOnExitValue;
    }

    return formField;
}

/**
 * Parse checkbox-specific FFData children.
 *
 * @param {OpenXmlElement} checkBoxElement - The check box element.
 * @param {CheckBoxFormField} field - The field.
 * @returns {void}
 * @private
 */
function parseCheckBoxFFDataChildren(checkBoxElement: OpenXmlElement, field: CheckBoxFormField): void {
    let hasExplicitSize: boolean = false;

    for (const child of elementChildren(checkBoxElement)) {
        if (isWml(child, 'checked')) {
            // w:checked element - indicates checkbox is checked
            // w:val attribute is optional; presence means true, absence/false means false
            const valAttr: string = wValAttribute(child);
            field.checked = valAttr !== '0' && valAttr !== 'false';
        } else if (isWml(child, 'default')) {
            // w:default element - default checkbox state
            // w:val attribute is optional; presence/true means checked, absence/false means unchecked
            const valAttr: string = wValAttribute(child);
            field.defaultCheckBoxValue = valAttr !== '0' && valAttr !== 'false';
        } else if (isWml(child, 'size')) {
            // w:size element - explicit size in half-points
            const sizeStr: string = wValAttribute(child);
            if (sizeStr !== undefined) {
                const size: number = parseInt(sizeStr, 10);
                if (!isNaN(size) && size > 0) {
                    field.checkBoxSize = size;
                    field.sizeType = CheckBoxSizeType.Exactly;
                    hasExplicitSize = true;
                }
            }
        } else if (isWml(child, 'sizeAuto')) {
            // w:sizeAuto element - automatic size
            field.sizeType = CheckBoxSizeType.Auto;
            hasExplicitSize = true;
        }
    }

    // If no explicit size element was found, keep default Auto
    // Checkboxes without explicit size use w:sizeAuto for Word's automatic sizing
    if (!hasExplicitSize) {
        field.checkBoxSize = 20;
        field.sizeType = CheckBoxSizeType.Auto;
    }
}

/**
 * Parse dropdown-specific FFData children.
 *
 * @param {OpenXmlElement} ddListElement - The dd list element.
 * @param {DropDownFormField} field - The field.
 * @returns {void}
 * @private
 */
function parseDropDownFFDataChildren(ddListElement: OpenXmlElement, field: DropDownFormField): void {
    let selectedIndex: number = 0;

    for (const child of elementChildren(ddListElement)) {
        if (isWml(child, 'result')) {
            const resultStr: string = wValAttribute(child);
            if (resultStr !== undefined) {
                const idx: number = parseInt(resultStr, 10);
                if (!isNaN(idx)) {
                    selectedIndex = idx;
                }
            }
        } else if (isWml(child, 'listEntry')) {
            const text: string = wValAttribute(child);
            if (text !== undefined) {
                field.dropDownItems.add(text);
            }
        }
    }

    // Set the selected index if items exist
    if (field.dropDownItems.count > 0 && selectedIndex >= 0 && selectedIndex < field.dropDownItems.count) {
        field.selectedIndex = selectedIndex;
    }
}

/**
 * Parse text-input-specific FFData children.
 *
 * @param {OpenXmlElement} textInputElement - The text input element.
 * @param {TextFormField} field - The field.
 * @returns {void}
 * @private
 */
function parseTextFormFieldFFDataChildren(textInputElement: OpenXmlElement, field: TextFormField): void {
    for (const child of elementChildren(textInputElement)) {
        if (isWml(child, 'default')) {
            const defaultText: string = wValAttribute(child);
            if (defaultText !== undefined) {
                field.defaultText = defaultText;
            }
        } else if (isWml(child, 'maxLength')) {
            const maxStr: string = wValAttribute(child);
            if (maxStr !== undefined) {
                const max: number = parseInt(maxStr, 10);
                if (!isNaN(max)) {
                    field.maximumLength = max;
                }
            }
        } else if (isWml(child, 'type')) {
            const typeStr: string = wValAttribute(child);
            if (typeStr !== undefined) {
                // Map type string to TextFormFieldType
                let type: TextFormFieldType = TextFormFieldType.RegularText;
                if (typeStr === 'number') {
                    type = TextFormFieldType.NumberText;
                } else if (typeStr === 'date') {
                    type = TextFormFieldType.DateText;
                } else if (typeStr === 'currentDate') {
                    type = TextFormFieldType.CurrentDateText;
                } else if (typeStr === 'currentTime') {
                    type = TextFormFieldType.CurrentTimeText;
                } else if (typeStr === 'calculated') {
                    type = TextFormFieldType.Calculation;
                }
                field.type = type;
            }
        } else if (isWml(child, 'format')) {
            const formatStr: string = wValAttribute(child);
            if (formatStr !== undefined) {
                field.stringFormat = formatStr;
            }
        } else if (isWml(child, 'textFormat')) {
            const formatStr: string = wValAttribute(child);
            if (formatStr !== undefined) {
                // Map format string to TextFormat
                let format: TextFormat = TextFormat.None;
                if (formatStr === 'uppercase') {
                    format = TextFormat.Uppercase;
                } else if (formatStr === 'lowercase') {
                    format = TextFormat.Lowercase;
                } else if (formatStr === 'capitalize') {
                    format = TextFormat.FirstCapital;
                } else if (formatStr === 'titlecase') {
                    format = TextFormat.Titlecase;
                }
                field.textFormat = format;
            }
        }
    }
}

/**
 * @param {FieldMark} leafMark - The leaf mark.
 * @param {FeatureRunParagraphItem} wrapper - The wrapper.
 * @param {string | undefined} instrText - The instr text.
 * @returns {Field | ParagraphFieldMark | NewFormField | undefined} The result.
 * @private
 * Convert a feature-run-leaf FieldMark to a paragraph-item Field, FormField, or FieldMark.
 *
 * The feature-run-leaf FieldMark is embedded in runs as markers within the OOXML.
 * The paragraph-item Field/FormField/FieldMark appears as a top-level ParagraphItem.
 *
 * For 'begin' markers: Creates a FormField if w:ffData is present, otherwise a Field
 * For 'separate'/'end' markers: Creates a FieldMark ParagraphItem
 */
function convertFieldMarkToFieldMark(
    leafMark: FieldMark,
    wrapper: FeatureRunParagraphItem,
    instrText: string | undefined = undefined
): Field | ParagraphFieldMark | NewFormField | undefined {
    const markType: FieldMarkType = leafMark.fldCharType;

    if (markType === 'begin') {
        // Check if this is a form field (has w:ffData child)
        const ffDataElement: OpenXmlElement | undefined = ffDataFromFieldMark(leafMark);
        if (ffDataElement !== undefined) {
            // Try to reconstruct a form field from FFData
            const formField: NewFormField | undefined = reconstructFormFieldFromFFData(ffDataElement, leafMark, wrapper);
            if (formField !== undefined) {
                return formField;
            }
        }

        // Extract field type from instruction text for regular fields
        let fieldType: FieldType = FieldType.Page; // Default
        if (instrText !== undefined) {
            const resolved: FieldType | undefined = trySupportedFieldTypeFromInstruction(instrText);
            if (resolved !== undefined) {
                fieldType = resolved;
            }
        }

        // Convert begin marker to Field ParagraphItem
        const FieldCtor: typeof Field = fieldType === FieldType.FieldSequence ? SeqField : Field;
        const field: Field = new FieldCtor(
            fieldType as any,
            leafMark.fldLock,
            leafMark.dirty,
            leafMark.childElements(),
            wrapper.wireGroup,
            instrText  // Pass instruction text to Field constructor
        );
        return field;
    }

    // Convert 'separate' or 'end' markers to ParagraphItem FieldMark
    const fieldMarkType: ParagraphFieldMarkType | undefined =
        markType === 'separate' ? ParagraphFieldMarkType.Separator : markType === 'end' ? ParagraphFieldMarkType.End : undefined;

    if (fieldMarkType === undefined) {
        return undefined;
    }

    return new ParagraphFieldMark(
        fieldMarkType,
        leafMark.fldLock,
        leafMark.dirty,
        leafMark.childElements(),
        wrapper.wireGroup
    );
}

/**
 * Convert a SimpleField (w:fldSimple) to a Field ParagraphItem.
 *
 * Simple fields have a flat structure with instruction text and result runs.
 * Convert them to Field objects so they're registered in the field collection
 * and available for updateDocumentFields().
 *
 * The converted Field will serialize as a complex field (w:fldChar begin/separate/end)
 * which is functionally equivalent to the simple field format.
 *
 * @param {SimpleField} simpleField - The simple field to convert.
 * @returns {Field} A new Field ParagraphItem representing the simple field.
 * @private
 */
function convertSimpleFieldToField(simpleField: SimpleField): Field {
    // Extract field type from instruction
    const instruction: string = simpleField.instruction.trim();
    const resolvedType: FieldType | undefined = trySupportedFieldTypeFromInstruction(instruction);
    const fieldType: FieldType = resolvedType !== undefined ? resolvedType : FieldType.Page; // Default

    // Create a specialized Field subclass based on field type
    // This ensures the proper update() handlers are called
    let field: Field;
    switch (fieldType) {
    case FieldType.If:
        field = new IfField(
            fieldType,
            simpleField.fldLock,
            simpleField.dirty,
            [],
            undefined,
            instruction,
            true
        );
        break;

    case FieldType.MergeField:
        field = new MergeField(
            fieldType,
            simpleField.fldLock,
            simpleField.dirty,
            [],
            undefined,
            instruction,
            true
        );
        break;

    case FieldType.FieldSequence:
        field = new SeqField(
            fieldType,
            simpleField.fldLock,
            simpleField.dirty,
            [],
            undefined,
            instruction,
            true
        );
        break;

    default:
        // For all other field types, use the base Field class
        field = new Field(
            fieldType as any,
            simpleField.fldLock,
            simpleField.dirty,
            [],  // No extra XML elements from simple field extras
            undefined,  // No wireGroup for new fields
            instruction,  // Pass the full instruction text
            true  // Mark as converted from simple field
        );
        break;
    }

    return field;
}

/**
 * @private
 * Attempt to match a complete field structure starting from a begin marker at index `beginIndex`.
 * Returns a reconstructed Field if successful, undefined otherwise.
 */
interface ReconstructedField {
    field: ParagraphItem;
    itemsConsumed: number;
}

function matchAndReconstructField(
    items: ParagraphItem[],
    beginIndex: number
): ReconstructedField | undefined {
    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
    const beginItem: ParagraphItem = items[beginIndex];
    if (!(beginItem instanceof FeatureRunParagraphItem) ||
        !(beginItem.value instanceof FieldMark) ||
        beginItem.value.fldCharType !== 'begin') {
        return undefined;
    }

    const beginMark: FieldMark = beginItem.value;
    let separatorIndex: number = -1;
    let endIndex: number = -1;
    let depth: number = 1;

    // Scan forward to find matching separate and end markers
    for (let i: number = beginIndex + 1; i < items.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const item: ParagraphItem = items[i];

        if (!(item instanceof FeatureRunParagraphItem) ||
            item.featureId !== FIELDS ||
            !(item.value instanceof FieldMark)) {
            continue;
        }

        const mark: FieldMark = item.value;
        if (mark.fldCharType === 'begin') {
            depth += 1;
        } else if (mark.fldCharType === 'separate' && depth === 1 && separatorIndex === -1) {
            separatorIndex = i;
        } else if (mark.fldCharType === 'end') {
            depth -= 1;
            if (depth === 0) {
                endIndex = i;
                break;
            }
        }
    }

    // We need at least: begin, separate, end
    if (endIndex === -1 || separatorIndex === -1) {
        return undefined;
    }

    // Determine the field type from instruction text
    let fieldType: string = 'PAGE'; // Default
    for (let i: number = beginIndex + 1; i < separatorIndex; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const item: ParagraphItem = items[i];
        if (item instanceof FeatureRunParagraphItem &&
            item.featureId === FIELDS &&
            item.value instanceof InstrText) {
            const instr: string = item.value.text.trim();
            if (instr.length > 0) {
                const keyword: string = instructionKeyword(instr);
                if (keyword.length > 0) {
                    fieldType = keyword;
                }
                break;
            }
        }
    }

    // Create a Field ParagraphItem with the determined type
    const field: Field = new (fieldType === FieldType.FieldSequence ? SeqField : Field)(
        fieldType as any, // Type determined from instruction text
        beginMark.fldLock,
        beginMark.dirty,
        beginMark.childElements(),
        beginItem.wireGroup
    );

    return {
        field,
        itemsConsumed: endIndex - beginIndex + 1
    };
}

/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetFieldsFeatureForTests(): void {
    registered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register field inline and run-leaf handlers. Idempotent.
 */
export function registerFieldsFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: FIELDS });
    registerFeatureInlineHandler({
        featureId: FIELDS,
        wmlLocalName: 'fldSimple',
        tryParse(element: OpenXmlElement): SimpleField | undefined {
            return parseSimpleField(element);
        }
    });
    registerFeatureRunLeafHandler({
        featureId: FIELDS,
        wmlLocalName: 'fldChar',
        tryParse(element: OpenXmlElement): FieldMark | undefined {
            return parseFieldMark(element);
        }
    });
    registerFeatureRunLeafHandler({
        featureId: FIELDS,
        wmlLocalName: 'instrText',
        tryParse(element: OpenXmlElement): InstrText | undefined {
            return parseInstrText(element);
        }
    });

    // Register the post-processor for field structure reconstruction.
    // the owning module does not import this module, so a static import introduces no cycle.
    setParagraphItemsPostProcessor(reconstructFieldStructure);
}
/**
 * Simple fields in a paragraph, in document order.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<SimpleField>} The result.
 * @private
 */
function simpleFieldsInParagraph(paragraph: Paragraph): ReadonlyArray<SimpleField> {
    const found: SimpleField[] = [];
    for (const inline of paragraph.items) {
        if (isSimpleFieldInline(inline)) {
            found.push(inline.value);
        }
    }
    return found;
}
/**
 * Complex fields in a paragraph, in document order.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<ComplexField>} The result.
 * @private
 */
function complexFieldsInParagraph(paragraph: Paragraph): ReadonlyArray<ComplexField> {
    const found: ComplexField[] = [];
    const flat: FlatFieldItem[] = flattenFieldItems(paragraph);
    for (const [index, itemItem] of flat.entries()) {
        if (itemItem === undefined ||
            !(itemItem.item instanceof FeatureRunParagraphItem) ||
            !(itemItem.item.value instanceof FieldMark) ||
            itemItem.item.value.fldCharType !== 'begin') {
            continue;
        }
        const field: ComplexField = pairComplexField(flat, index);
        if (field !== undefined) {
            found.push(field);
        }
    }
    return found;
}
/**
 * Parsed view of a WordprocessingML field instruction string.
 *
 * Prefer {@link Field.fieldType} / {@link Field.fieldCode} for document fields.
 * This helper remains for internal callers that only have an instruction string.
 *
 * @private
 */
/**
 * Tokenize a field instruction into whitespace- and quote-delimited tokens.
 * Double-quoted spans become a single token with the quotes removed.
 *
 * @param {string} instruction - Specifies the instruction.
 * @returns {string[]} Returns the result.
 */
function tokenizeFieldInstruction(instruction: string): string[] {
    const tokens: string[] = [];
    const source: string = instruction.trim();
    let index: number = 0;
    while (index < source.length) {
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
/**
 * Fields in a paragraph, in document order.
 *
 * Simple fields (`w:fldSimple`) and complex field spans (`w:fldChar` /
 * `w:instrText`) are interleaved by paragraph content order. Cached results are
 * not recalculated.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<Field | LegacyField>} The result.
 * @private
 */
export function fieldsInParagraph(paragraph: Paragraph): ReadonlyArray<Field | LegacyField> {
    const found: Array<Field | LegacyField> = [];
    const flat: FlatFieldItem[] = flattenFieldItems(paragraph);
    let flatIndex: number = 0;
    for (const inline of paragraph.items) {
        if (inline instanceof Field) {
            found.push(inline);
            continue;
        }
        if (isSimpleFieldInline(inline)) {
            const wrapped: LegacyField = wrapSupportedField('simple', inline.value, undefined, paragraph, inline.value.instruction);
            if (wrapped !== undefined) {
                found.push(wrapped);
            }
            continue;
        }
        // Only field-relevant items advance the flatten cursor (TextRange + FIELDS featureRun).
        const isFieldFlatItem: boolean = inline instanceof TextRange ||
            (inline instanceof FeatureRunParagraphItem &&
                inline.featureId === FIELDS &&
                (inline.value instanceof FieldMark || inline.value instanceof InstrText));
        if (!isFieldFlatItem) {
            continue;
        }
        const beginIndex: number = flatIndex;
        flatIndex += 1;
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const entry: FlatFieldItem = flat[beginIndex];
        if (entry === undefined ||
            !(entry.item instanceof FeatureRunParagraphItem) ||
            !(entry.item.value instanceof FieldMark) ||
            entry.item.value.fldCharType !== 'begin') {
            continue;
        }
        const field: ComplexField = pairComplexField(flat, beginIndex);
        if (field !== undefined) {
            const wrapped: LegacyField = wrapSupportedField('complex', undefined, field, paragraph, field.instruction);
            if (wrapped !== undefined) {
                found.push(wrapped);
            }
        }
    }
    return found;
}
/**
 * Fields across the document, in document order.
 *
 * Walks paragraphs via {@link visitParagraphsInDocumentOrder} (main body and
 * nested paragraph hosts the registry visitor covers). Does not recalculate
 * field results.
 *
 * @param {WordDocument} document - The document.
 * @returns {ReadonlyArray<Field | LegacyField>} The result.
 * @private
 */
export function fieldsInDocument(document: WordDocument): ReadonlyArray<Field | LegacyField> {
    const found: Array<Field | LegacyField> = [];
    visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
        found.push(...fieldsInParagraph(paragraph));
    });
    return found;
}
/**
 * Remove a simple field from its paragraph.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @param {SimpleField} field - The field.
 * @returns {void} Nothing is returned.
 * @private
 */
function removeSimpleField(paragraph: Paragraph, field: SimpleField): void {
    paragraph.removeFeatureInline(field);
}
/**
 * Remove a complex field from its paragraph.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @param {ComplexField} field - The field.
 * @returns {void} Nothing is returned.
 * @private
 */
function removeComplexField(paragraph: Paragraph, field: ComplexField): void {
    for (const value of field.allFeatureValues()) {
        paragraph.removeFeatureRunItem(value);
    }
    for (const run of field.resultRuns) {
        paragraph.removeTextRange(run);
    }
}
/**
 * Remove a {@link Field} from the given paragraph.
 *
 * Prefer {@link Field.remove} when the field was listed or appended with a host
 * paragraph.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @param {LegacyField} field - The field.
 * @returns {void} Nothing is returned.
 * @private
 */
function removeField(paragraph: Paragraph, field: LegacyField): void {
    const simple: SimpleField = (field as any).simple as SimpleField | undefined;
    if (simple !== undefined) {
        removeSimpleField(paragraph, simple);
        return;
    }
    const complex: ComplexField = (field as any).complex as ComplexField | undefined;
    if (complex !== undefined) {
        removeComplexField(paragraph, complex);
    }
}
/**
 * Whether a paragraph item is a simple field from this module.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
function isSimpleFieldInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: SimpleField } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === FIELDS &&
        inline.value instanceof SimpleField
    );
}
/**
 * Whether a paragraph item is a modeled field mark from this module.
 *
 * @param {ParagraphItem | ParagraphItem} item - The item.
 * @returns {Object} The result.
 * @private
 */
function isFieldMarkLeaf(item: ParagraphItem | ParagraphItem): item is FeatureRunParagraphItem & { value: FieldMark } {
    return item instanceof FeatureRunParagraphItem && item.featureId === FIELDS && item.value instanceof FieldMark;
}
/**
 * Whether a paragraph item is modeled instruction text from this module.
 *
 * @param {ParagraphItem | ParagraphItem} item - The item.
 * @returns {Object} The result.
 * @private
 */
function isInstrTextLeaf(item: ParagraphItem | ParagraphItem): item is FeatureRunParagraphItem & { value: InstrText } {
    return item instanceof FeatureRunParagraphItem && item.featureId === FIELDS && item.value instanceof InstrText;
}
/**
 * Switch text for DATE/TIME appendField: the caller may pass switches such as `\\@ "MM/dd/yyyy"`.
 *
 * @param {string} fieldName - The field name argument.
 * @returns {string} Switches followed by a space, or an empty string.
 * @private
 */
function dateTimeSwitches(fieldName: string): string {
    const text: string = fieldName.trim().replace(/^(DATE|TIME|CREATEDATE|SAVEDATE|PRINTDATE|EDITTIME)\s+/i, '');
    if (text.length === 0) {
        return '';
    }
    return text;
}
/**
 * Instruction text for fields that always carry `\* MERGEFORMAT` (AUTHOR, TITLE, DATE, etc.).
 * When the shared parameter is empty, the field name is omitted and only `\* MERGEFORMAT`
 * remains. When it already contains `\* MERGEFORMAT`, it is not duplicated.
 *
 * @param {string} keyword - The field keyword (e.g. `AUTHOR`).
 * @param {string} fieldName - The shared parameter passed to `appendField`.
 * @returns {string} Instruction text padded with leading and trailing spaces.
 * @private
 */
function formatMergeformatField(keyword: string, fieldName: string): string {
    if (fieldName.length === 0) {
        return ' ' + keyword + ' \\* MERGEFORMAT ';
    }
    if (/\\\*\s*MERGEFORMAT/i.test(fieldName)) {
        return ' ' + keyword + ' ' + fieldName + ' ';
    }
    return ' ' + keyword + ' ' + fieldName + ' \\* MERGEFORMAT ';
}
/**
 * DATE/TIME/CREATEDATE/SAVEDATE/PRINTDATE/EDITTIME instruction text. The shared
 * parameter (or a `@` picture switch) is placed between the keyword and
 * `\* MERGEFORMAT`. If the parameter already carries `\* MERGEFORMAT`, it is
 * left alone.
 *
 * @param {string} keyword - The field keyword (e.g. `DATE`).
 * @param {string} fieldName - The shared parameter passed to `appendField`.
 * @returns {string} Instruction text padded with leading and trailing spaces.
 * @private
 */
function dateTimeInstruction(keyword: string, fieldName: string): string {
    const text: string = dateTimeSwitches(fieldName);
    if (text.length === 0) {
        return ' ' + keyword + ' \\* MERGEFORMAT ';
    }
    return /\\\*\s*MERGEFORMAT/i.test(text)
        ? ' ' + keyword + ' ' + text + ' '
        : ' ' + keyword + ' ' + text + ' \\* MERGEFORMAT ';
}

function isSupportedFieldType(value: string): value is FieldType {
    return SUPPORTED_FIELD_TYPES.has(value);
}

/**
 * Restore field-switch backslashes lost to JavaScript string escapes: `'\\* Upper'` arrives as
 * `* Upper`, and `'\\n'` / `'\\r'` arrive as control characters. Formula-like fields are untouched
 * because `*` is multiplication there.
 *
 * @param {string} text - The field argument text.
 * @param {FieldType} type - The field type.
 * @returns {string} The text with switch backslashes restored.
 * @private
 */
function restoreSwitchBackslashes(text: string, type: FieldType): string {
    if (String(type) === '=') {
        return text;
    }
    return text
        .replace(/(^|\s)([*#@])(?=\s)/g, '$1\\$2')
        .replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\f/g, '\\f').replace(/\v/g, '\\v');
}
function defaultInstructionForAppend(fieldName: string, type: FieldType): string {
    const name: string = fieldName ? fieldName.trim() : '';
    switch (type) {
    case FieldType.Page:
        return name.length > 0 ? ' PAGE ' + name + ' ' : ' PAGE ';
    case FieldType.NumPages:
        return name.length > 0 ? ' NUMPAGES ' + name + ' ' : ' NUMPAGES ';
    case FieldType.If:
        return ' IF ';
    case FieldType.MergeField: {
        const cleanName: string = name.replace(/^[«"]+|[»"]+$/g, '');
        return ' MERGEFIELD ' + (cleanName.length > 0 ? cleanName : name) + ' ';
    }
    case FieldType.Hyperlink:
        // Logical name only; prefer appendHyperlink for target + display text.
        return ' HYPERLINK ' + (name.length > 0 ? name + ' ' : '');
    // Metadata fields that require MERGEFORMAT
    case FieldType.FieldAuthor:
        return formatMergeformatField('AUTHOR', name);
    case FieldType.FieldTitle:
        return formatMergeformatField('TITLE', name);
    case FieldType.FieldSubject:
        return formatMergeformatField('SUBJECT', name);
    case FieldType.FieldComments:
        return formatMergeformatField('COMMENTS', name);
    case FieldType.FieldDocProperty: {
        let propName: string = name;
        if (/^DOCPROPERTY\s+/i.test(propName)) {
            propName = propName.replace(/^DOCPROPERTY\s+/i, '').trim();
        }
        if (propName.length > 0 && /\s/.test(propName) && !(/^".*"$/.test(propName))) {
            propName = '"' + propName + '"';
        }
        return formatMergeformatField('DOCPROPERTY', propName);
    }
    case FieldType.FieldKeyWord:
        return formatMergeformatField('KEYWORDS', name);
    case FieldType.FieldLastSavedBy:
        return formatMergeformatField('LASTSAVEDBY', name);
    case FieldType.FieldTemplate:
        return formatMergeformatField('TEMPLATE', name);
    // Date/time fields that require MERGEFORMAT
    case FieldType.FieldDate:
        return dateTimeInstruction('DATE', name);
    case FieldType.FieldTime:
        return dateTimeInstruction('TIME', name);
    case FieldType.FieldCreateDate:
        return dateTimeInstruction('CREATEDATE', name);
    case FieldType.FieldSaveDate:
        return dateTimeInstruction('SAVEDATE', name);
    case FieldType.FieldPrintDate:
        return dateTimeInstruction('PRINTDATE', name);
    case FieldType.FieldEditTime:
        return dateTimeInstruction('EDITTIME', name);
    // Reference fields
    case FieldType.FieldRef:
        return name.length > 0 ? ' REF ' + name + ' ' : ' REF ';
    case FieldType.FieldPageRef:
        return name.length > 0 ? ' PAGEREF ' + name + ' ' : ' PAGEREF ';
    case FieldType.FieldNoteRef:
        return name.length > 0 ? ' NOTEREF ' + name + ' ' : ' NOTEREF ';
    case FieldType.FieldFootnoteRef:
        return name.length > 0 ? ' FOOTNOTEREF ' + name + ' ' : ' FOOTNOTEREF ';
    case FieldType.FieldStyleRef:
        return name.length > 0 ? ' STYLEREF ' + name + ' ' : ' STYLEREF ';
    // Count fields
    case FieldType.FieldNumWords:
        return formatMergeformatField('NUMWORDS', name);
    case FieldType.FieldNumChars:
        return formatMergeformatField('NUMCHARS', name);
    case FieldType.FieldRevisionNum:
        return formatMergeformatField('REVNUM', name);
    // Filename/path fields
    case FieldType.FieldFileName:
        return formatMergeformatField('FILENAME', name);
    case FieldType.FieldFileSize:
        return formatMergeformatField('FILESIZE', name);
    // User information fields
    case FieldType.FieldUserName:
        return formatMergeformatField('USERNAME', name);
    case FieldType.FieldUserInitials:
        return formatMergeformatField('USERINITIALS', name);
    case FieldType.FieldUserAddress:
        return formatMergeformatField('USERADDRESS', name);
    // Section fields
    case FieldType.FieldSection:
        return formatMergeformatField('SECTION', name);
    case FieldType.FieldSectionPages:
        return formatMergeformatField('SECTIONPAGES', name);
    // Index/TOC/TOA fields
    case FieldType.FieldIndex:
        return formatMergeformatField('INDEX', name);
    case FieldType.FieldIndexEntry:
        return name.length > 0 ? ' XE ' + name + ' ' : ' XE ';
    // Fields that take arguments
    case FieldType.FieldAddin:
        return name.length > 0 ? ' ADDIN ' + name + ' ' : ' ADDIN ';
    case FieldType.FieldAdvance:
        return name.length > 0 ? ' ADVANCE ' + name + ' ' : ' ADVANCE ';
    case FieldType.FieldAsk:
        return name.length > 0 ? ' ASK ' + name + ' ' : ' ASK ';
    case FieldType.FieldAutoNum:
        return name.length > 0 ? ' AUTONUM ' + name + ' ' : ' AUTONUM ';
    case FieldType.FieldAutoNumLegal:
        return name.length > 0 ? ' AUTONUMLGL ' + name + ' ' : ' AUTONUMLGL ';
    case FieldType.FieldAutoNumOutline:
        return name.length > 0 ? ' AUTONUMOUT ' + name + ' ' : ' AUTONUMOUT ';
    case FieldType.FieldAutoText:
        return name.length > 0 ? ' AUTOTEXT ' + name + ' ' : ' AUTOTEXT ';
    case FieldType.FieldAutoTextList:
        return name.length > 0 ? ' AUTOTEXTLIST ' + name + ' ' : ' AUTOTEXTLIST ';
    case FieldType.FieldBarCode:
        return name.length > 0 ? ' BARCODE ' + name + ' ' : ' BARCODE ';
    case FieldType.FieldCompare:
        return name.length > 0 ? ' COMPARE ' + name + ' ' : ' COMPARE ';
    case FieldType.FieldData:
        return name.length > 0 ? ' DATA ' + name + ' ' : ' DATA ';
    case FieldType.FieldDatabase:
        return name.length > 0 ? ' DATABASE ' + name + ' ' : ' DATABASE ';
    case FieldType.FieldDDE:
        return name.length > 0 ? ' DDE ' + name + ' ' : ' DDE ';
    case FieldType.FieldDDEAuto:
        return name.length > 0 ? ' DDEAUTO ' + name + ' ' : ' DDEAUTO ';
    case FieldType.FieldExpression:
        return name.length > 0 ? ' = ' + name + ' ' : ' = ';
    case FieldType.FieldFillIn:
        return name.length > 0 ? ' FILLIN ' + name + ' ' : ' FILLIN ';
    case FieldType.FieldFormula:
        return name.length > 0 ? ' = ' + name + ' ' : ' = ';
    case FieldType.FieldGlossary:
        return name.length > 0 ? ' GLOSSARY ' + name + ' ' : ' GLOSSARY ';
    case FieldType.FieldGoToButton:
        return name.length > 0 ? ' GOTOBUTTON ' + name + ' ' : ' GOTOBUTTON ';
    case FieldType.FieldHTMLActiveX:
        return name.length > 0 ? ' HTMLCONTROL ' + name + ' ' : ' HTMLCONTROL ';
    case FieldType.FieldImport:
        return name.length > 0 ? ' IMPORT ' + name + ' ' : ' IMPORT ';
    case FieldType.FieldInclude:
        return name.length > 0 ? ' INCLUDE ' + name + ' ' : ' INCLUDE ';
    case FieldType.FieldIncludePicture:
        return name.length > 0 ? ' INCLUDEPICTURE ' + name + ' ' : ' INCLUDEPICTURE ';
    case FieldType.FieldIncludeText:
        return name.length > 0 ? ' INCLUDETEXT ' + name + ' ' : ' INCLUDETEXT ';
    case FieldType.FieldInfo:
        return formatMergeformatField('INFO', name);
    case FieldType.FieldLink:
        return name.length > 0 ? ' LINK ' + name + ' ' : ' LINK ';
    case FieldType.FieldListNum:
        return name.length > 0 ? ' LISTNUM ' + name + ' ' : ' LISTNUM ';
    case FieldType.FieldMacroButton:
        return name.length > 0 ? ' MACROBUTTON ' + name + ' ' : ' MACROBUTTON ';
    case FieldType.FieldMergeRec:
        return name.length > 0 ? ' MERGEREC ' + name + ' ' : ' MERGEREC ';
    case FieldType.FieldMergeSeq:
        return name.length > 0 ? ' MERGESEQ ' + name + ' ' : ' MERGESEQ ';
    case FieldType.FieldNext:
        return name.length > 0 ? ' NEXT ' + name + ' ' : ' NEXT ';
    case FieldType.FieldNextIf:
        return name.length > 0 ? ' NEXTIF ' + name + ' ' : ' NEXTIF ';
    case FieldType.FieldOCX:
        return name.length > 0 ? ' CONTROL ' + name + ' ' : ' CONTROL ';
    case FieldType.FieldPrint:
        return name.length > 0 ? ' PRINT ' + name + ' ' : ' PRINT ';
    case FieldType.FieldPrivate:
        return name.length > 0 ? ' PRIVATE ' + name + ' ' : ' PRIVATE ';
    case FieldType.FieldQuote:
        return name.length > 0 ? ' QUOTE ' + name + ' ' : ' QUOTE ';
    case FieldType.FieldRefDoc:
        return name.length > 0 ? ' RD ' + name + ' ' : ' RD ';
    case FieldType.FieldSet:
        return name.length > 0 ? ' SET ' + name + ' ' : ' SET ';
    case FieldType.FieldSkipIf:
        return name.length > 0 ? ' SKIPIF ' + name + ' ' : ' SKIPIF ';
    case FieldType.FieldSubscriber:
        return name.length > 0 ? ' SUBSCRIBER ' + name + ' ' : ' SUBSCRIBER ';
    case FieldType.FieldSymbol:
        return name.length > 0 ? ' SYMBOL ' + name + ' ' : ' SYMBOL ';
    case FieldType.FieldShape:
        return name.length > 0 ? ' SHAPE ' + name + ' ' : ' SHAPE ';
    case FieldType.FieldBidiOutline:
        return name.length > 0 ? ' BIDIOUTLINE ' + name + ' ' : ' BIDIOUTLINE ';
    case FieldType.FieldAddressBlock:
        return name.length > 0 ? ' ADDRESSBLOCK ' + name + ' ' : ' ADDRESSBLOCK ';
    case FieldType.FieldSequence:
        return name.length > 0 ? ' SEQ ' + name + ' ' : ' SEQ ';
    case FieldType.CheckBox:
    case FieldType.DropDown:
    case FieldType.TextInput:
        // Form fields are handled separately through complex field markers
        return '';
    default: {
        const _exhaustive: never = type;
        return _exhaustive;
    }
    }
}
function defaultCachedResultForAppend(fieldName: string, type: FieldType): string {
    switch (type) {
    case FieldType.MergeField:
        return fieldName.length > 0 ? '«' + fieldName + '»' : '';
    case FieldType.Page:
    case FieldType.NumPages:
    case FieldType.FieldSection:
    case FieldType.FieldSectionPages:
    case FieldType.FieldRevisionNum:
    case FieldType.FieldNumChars:
    case FieldType.FieldNumWords:
    case FieldType.FieldEditTime:
        return '1';
    case FieldType.If:
    case FieldType.Hyperlink:
    case FieldType.FieldAdvance:
    case FieldType.FieldAsk:
    case FieldType.FieldAutoNum:
    case FieldType.FieldAutoNumLegal:
    case FieldType.FieldAutoNumOutline:
    case FieldType.FieldAutoText:
    case FieldType.FieldAutoTextList:
    case FieldType.FieldBarCode:
    case FieldType.FieldCompare:
    case FieldType.FieldData:
    case FieldType.FieldDatabase:
    case FieldType.FieldDDE:
    case FieldType.FieldDDEAuto:
    case FieldType.FieldExpression:
    case FieldType.FieldFillIn:
    case FieldType.FieldFormula:
    case FieldType.FieldGlossary:
    case FieldType.FieldGoToButton:
    case FieldType.FieldHTMLActiveX:
    case FieldType.FieldImport:
    case FieldType.FieldInclude:
    case FieldType.FieldIncludePicture:
    case FieldType.FieldIncludeText:
    case FieldType.FieldIndexEntry:
    case FieldType.FieldLink:
    case FieldType.FieldListNum:
    case FieldType.FieldMacroButton:
    case FieldType.FieldMergeRec:
    case FieldType.FieldMergeSeq:
    case FieldType.FieldNext:
    case FieldType.FieldNextIf:
    case FieldType.FieldOCX:
    case FieldType.FieldPrint:
    case FieldType.FieldPrivate:
    case FieldType.FieldQuote:
    case FieldType.FieldRefDoc:
    case FieldType.FieldSet:
    case FieldType.FieldSkipIf:
    case FieldType.FieldSubscriber:
    case FieldType.FieldSymbol:
    case FieldType.FieldShape:
    case FieldType.FieldBidiOutline:
    case FieldType.FieldAddressBlock:
        return '';
    case FieldType.FieldAuthor:
    case FieldType.FieldTitle:
    case FieldType.FieldSubject:
    case FieldType.FieldComments:
    case FieldType.FieldDocProperty:
    case FieldType.FieldKeyWord:
    case FieldType.FieldLastSavedBy:
    case FieldType.FieldTemplate:
    case FieldType.FieldUserName:
    case FieldType.FieldUserInitials:
    case FieldType.FieldUserAddress:
    case FieldType.FieldInfo:
    case FieldType.FieldDate:
    case FieldType.FieldTime:
    case FieldType.FieldCreateDate:
    case FieldType.FieldSaveDate:
    case FieldType.FieldPrintDate:
    case FieldType.FieldRef:
    case FieldType.FieldPageRef:
    case FieldType.FieldNoteRef:
    case FieldType.FieldFootnoteRef:
    case FieldType.FieldStyleRef:
    case FieldType.FieldFileName:
    case FieldType.FieldFileSize:
    case FieldType.FieldIndex:
    case FieldType.FieldAddin:
    case FieldType.FieldSequence:
        return fieldName;
    case FieldType.CheckBox:
    case FieldType.DropDown:
    case FieldType.TextInput:
        // Form fields typically don't have a cached result
        return '';
    default: {
        const _exhaustive: never = type;
        return _exhaustive;
    }
    }
}
function wrapFieldFromStorage(kind: 'simple' | 'complex', simple: SimpleField | undefined, complex: ComplexField | undefined, host: Paragraph, instruction: string): LegacyField {
    const wrapped: LegacyField = wrapSupportedField(kind, simple, complex, host, instruction);
    if (wrapped === undefined) {
        // Private helpers (SEQ/captions) may build non-customer field types — still need a Field shell for internal use.
        // Use Page lock only if instruction matches; otherwise treat as opaque-supported failure.
        const forced: FieldType = trySupportedFieldTypeFromInstruction(instruction);
        if (forced !== undefined) {
            return new LegacyField(kind, simple, complex, host, forced);
        }
        throw new DocxError('content/invalid-field', 'Unsupported field instruction for public Field wrapper');
    }
    return wrapped;
}
function appendSimpleFieldImpl(paragraph: Paragraph, instruction: string, result: string): LegacyField {
    if (instruction.trim().length === 0) {
        throw new DocxError('content/invalid-field', 'Field instruction must not be empty');
    }
    const runOwner: SimpleFieldRunOwner = new SimpleFieldRunOwner();
    const run: TextRange = runOwner.appendRun();
    run.text = result;
    const simple: SimpleField = new SimpleField(runOwner, [], [{ type: 'textRange', run }], instruction, undefined, undefined);
    paragraph.appendFeatureInline(FIELDS, simple);
    return wrapFieldFromStorage('simple', simple, undefined, paragraph, instruction);
}
function appendComplexFieldImpl(paragraph: Paragraph, instruction: string, result: string): LegacyField {
    const trimmed: string = instruction.trim();
    if (trimmed.length === 0) {
        throw new DocxError('content/invalid-field', 'Field instruction must not be empty');
    }
    const beginMark: FieldMark = new FieldMark('begin', undefined, undefined, []);
    paragraph.appendFeatureRunItem(FIELDS, beginMark);
    const instrText: InstrText = new InstrText(` ${trimmed} `, true);
    paragraph.appendFeatureRunItem(FIELDS, instrText);
    const separateMark: FieldMark = new FieldMark('separate', undefined, undefined, []);
    paragraph.appendFeatureRunItem(FIELDS, separateMark);
    const resultRun: TextRange = paragraph.appendText(result);
    const endMark: FieldMark = new FieldMark('end', undefined, undefined, []);
    paragraph.appendFeatureRunItem(FIELDS, endMark);
    const complex: ComplexField = new ComplexField(trimmed, [resultRun], [beginMark, instrText, separateMark, endMark], [instrText]);
    return wrapFieldFromStorage('complex', undefined, complex, paragraph, trimmed);
}
/**
 * Append an opaque complex field (any instruction, including SEQ for captions).
 * Not part of the public customer Field API.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @param {string} instruction - The instruction.
 * @param {Object} options - The options.
 * @returns {LegacyField} The result.
 * @private
 */
export function appendOpaqueComplexField(paragraph: Paragraph, instruction: string, options: {
    result: string;
}): LegacyField {
    return appendComplexFieldImplPrivate(paragraph, instruction, options.result);
}
/**
 * Opaque complex-field instructions in a paragraph (any keyword, including SEQ).
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<string>} The result.
 * @private
 */
export function opaqueComplexFieldInstructionsInParagraph(paragraph: Paragraph): ReadonlyArray<string> {
    return complexFieldsInParagraph(paragraph).map(function (field: ComplexField): string { return field.instruction; });
}
/**
 * First instruction keyword (e.g. SEQ, PAGE) for opaque complex fields.
 *
 * @param {string} instruction - The instruction.
 * @returns {string} The result.
 * @private
 */
export function fieldInstructionKeyword(instruction: string): string {
    return instructionKeyword(instruction);
}
/**
 * Internal Field for any instruction (SEQ captions etc.).
 *
 * @private
 */
class InternalField extends LegacyField {
    constructor(kind: 'simple' | 'complex', simple: SimpleField | undefined, complex: ComplexField | undefined, host: Paragraph | undefined) {
        // lockedType unused for internal-only; Page is a placeholder the public getters still expose if misused.
        super(kind, simple, complex, host, FieldType.Page);
    }
}
function appendSimpleFieldImplPrivate(paragraph: Paragraph, instruction: string, result: string): LegacyField {
    if (instruction.trim().length === 0) {
        throw new DocxError('content/invalid-field', 'Field instruction must not be empty');
    }
    const runOwner: SimpleFieldRunOwner = new SimpleFieldRunOwner();
    const run: TextRange = runOwner.appendRun();
    run.text = result;
    const simple: SimpleField = new SimpleField(runOwner, [], [{ type: 'textRange', run }], instruction, undefined, undefined);
    paragraph.appendFeatureInline(FIELDS, simple);
    const supported: LegacyField = wrapSupportedField('simple', simple, undefined, paragraph, instruction);
    if (supported !== undefined) {
        return supported;
    }
    return new InternalField('simple', simple, undefined, paragraph);
}
function appendComplexFieldImplPrivate(paragraph: Paragraph, instruction: string, result: string): LegacyField {
    const trimmed: string = instruction.trim();
    if (trimmed.length === 0) {
        throw new DocxError('content/invalid-field', 'Field instruction must not be empty');
    }
    const beginMark: FieldMark = new FieldMark('begin', undefined, undefined, []);
    paragraph.appendFeatureRunItem(FIELDS, beginMark);
    const instrText: InstrText = new InstrText(` ${trimmed} `, true);
    paragraph.appendFeatureRunItem(FIELDS, instrText);
    const separateMark: FieldMark = new FieldMark('separate', undefined, undefined, []);
    paragraph.appendFeatureRunItem(FIELDS, separateMark);
    const resultRun: TextRange = paragraph.appendText(result);
    const endMark: FieldMark = new FieldMark('end', undefined, undefined, []);
    paragraph.appendFeatureRunItem(FIELDS, endMark);
    const complex: ComplexField = new ComplexField(trimmed, [resultRun], [beginMark, instrText, separateMark, endMark], [instrText]);
    const supported: LegacyField = wrapSupportedField('complex', undefined, complex, paragraph, trimmed);
    if (supported !== undefined) {
        return supported;
    }
    return new InternalField('complex', undefined, complex, paragraph);
}
/**
 * Append a supported field as direct ParagraphItem field DOM
 * (Field begin → instruction TextRange → separator → result → end).
 *
 * @param {Paragraph} this - The this.
 * The instruction is built from the field keyword and the shared parameter; set `fieldCode` on
 * the returned field to replace arguments and switches.
 *
 * @param {string} fieldResult - The shared parameter (field name, bookmark, formula, picture
 * switch, ...) and the initial (cached) field result text. An empty value uses the type's default.
 * @param {FieldType} fieldType - The field type.
 * @returns {Field} The result.
 * @public
 */
Paragraph.prototype.appendField = function (this: Paragraph, fieldResult: string, fieldType: FieldType): Field {
    const resultText: string = fieldResult == null ? '' : String(fieldResult);
    if (fieldType === FieldType.TextInput) {
        return this.appendTextFormField(resultText, resultText);
    }
    if (fieldType === FieldType.CheckBox) {
        return this.appendCheckBoxFormField(resultText, false);
    }
    if (fieldType === FieldType.DropDown) {
        return this.appendDropDownFormField(resultText);
    }
    if (!isSupportedFieldType(fieldType)) {
        throw new DocxError('content/invalid-field', 'Unsupported fieldType');
    }
    this.assertMutable();
    let field: Field;
    if (fieldType === FieldType.If) {
        field = new IfField(FieldType.If, undefined, undefined, []);
    }
    else if (fieldType === FieldType.MergeField) {
        field = new MergeField(FieldType.MergeField, undefined, undefined, []);
    }
    else if (fieldType === FieldType.FieldSequence) {
        field = new SeqField(FieldType.FieldSequence, undefined, undefined, []);
    }
    else {
        field = new Field(fieldType, undefined, undefined, []);
    }
    this.items.add(field);
    const instructionRange: TextRange = new TextRange();
    this.items.add(instructionRange);
    instructionRange.text = ' ' + defaultInstructionForAppend(resultText, fieldType).trim() + ' ';
    const separator: ParagraphFieldMark = new ParagraphFieldMark(ParagraphFieldMarkType.Separator, undefined, undefined, []);
    this.items.add(separator);
    const resultRange: TextRange = new TextRange();
    this.items.add(resultRange);
    resultRange.text = resultText.length > 0 ? resultText : defaultCachedResultForAppend(resultText, fieldType);
    const endMark: ParagraphFieldMark = new ParagraphFieldMark(ParagraphFieldMarkType.End, undefined, undefined, []);
    this.items.add(endMark);

    // Register field in document's field collection
    const document: WordDocument = this.owningDocument();
    if (document != null && typeof document.registerField === 'function') {
        document.registerField(field);
    }

    return field;
};
/**
 * Author a field-based or picture-based hyperlink.
 * Overloads the paragraph method also used by `w:hyperlink` authoring when the
 * second argument is an options object.
 *
 * Picture path uses DrawingML `a:hlinkClick` (no HYPERLINK field markers).
 *
 * Append a hyperlink.
 * - (url, displayText, type) authors a HYPERLINK field
 * - (url, picture, type) sets DrawingML a:hlinkClick on the picture
 *
 * @param {Paragraph} this - Specifies the this.
 * @param {string} target - Specifies the target.
 * @param {string | Picture} textOrPicture - Specifies the text or picture.
 * @param {HyperlinkType} type - Specifies the type.
 * @returns {Hyperlink} Returns the result.
 * @public
 */
Paragraph.prototype.appendHyperlink = function (
    this: Paragraph,
    target: string,
    textOrPicture: string | Picture,
    type: HyperlinkType
): Hyperlink {
    const linkType: HyperlinkType = type != null ? type : HyperlinkType.WebLink;
    if (textOrPicture instanceof Picture) {
        let resolvedTarget: string = target;
        if (linkType === HyperlinkType.EmailLink && !/^mailto:/i.test(target)) {
            resolvedTarget = 'mailto:' + target;
        }
        this.assertMutable();
        const document: WordDocument = this.owningDocument();
        const catalog: HyperlinksCatalog = hyperlinksFor(document);
        const main: PartName = partName('/word/document.xml');
        const used: Set<string> = new Set<string>();
        for (const rel of relationshipsForPart(document.opcPackage(), main).items) {
            used.add(rel.id);
        }
        for (const id of catalog.relationshipIds()) {
            used.add(id);
        }
        const relationshipId: string = catalog.allocateExternalTarget(resolvedTarget, used);
        textOrPicture.hyperlinkRelationshipId = relationshipId;
        textOrPicture.hyperlinkTarget = resolvedTarget;
        const imagesFeatureId: FeatureId = featureId('images');
        this.appendFeatureRunItem(imagesFeatureId, textOrPicture);
        return new Hyperlink(textOrPicture, resolvedTarget, linkType);
    }
    const display: string = typeof textOrPicture === 'string' ? textOrPicture : '';
    let instruction: string = ' HYPERLINK ';
    if (linkType === HyperlinkType.Bookmark) {
        instruction = ' HYPERLINK \\l ' + quoteFieldOperand(target) + ' ';
    }
    else if (linkType === HyperlinkType.EmailLink) {
        const mail: string = /^mailto:/i.test(target) ? target : 'mailto:' + target;
        instruction = ' HYPERLINK ' + quoteFieldOperand(mail) + ' ';
    }
    else {
        instruction = ' HYPERLINK ' + quoteFieldOperand(target) + ' ';
    }
    this.assertMutable();
    const field: Field = new Field(FieldType.Hyperlink, undefined, undefined, []);
    this.items.add(field);
    const instructionRange: TextRange = new TextRange();
    this.items.add(instructionRange);
    instructionRange.text = instruction;
    const separator: ParagraphFieldMark = new ParagraphFieldMark(ParagraphFieldMarkType.Separator, undefined, undefined, []);
    this.items.add(separator);
    const resultRange: TextRange = new TextRange();
    this.items.add(resultRange);
    resultRange.text = display;
    // Apply Hyperlink character style to result range for proper formatting
    resultRange.characterFormat.characterStyle = 'Hyperlink';
    const endMark: ParagraphFieldMark = new ParagraphFieldMark(ParagraphFieldMarkType.End, undefined, undefined, []);
    this.items.add(endMark);
    return new Hyperlink(field);
};



registerAlwaysOnBodyFeatureBootstrap(() => {
    registerFieldsFeature();
});
registerFieldsFeature();
