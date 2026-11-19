/**
 * @fileoverview
 *
 * New ParagraphItem-based field model (Phase 1 of field DOM refactor).
 *
 * This module provides the refactored Field and FieldMark classes that extend
 * ParagraphItem directly and appear in Paragraph.items without feature wrappers.
 *
 * The old facade Field (currently in index.ts) wraps SimpleField/ComplexField.
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

// ============================================================================
// FieldMarkType and FieldMark
// ============================================================================

/**
 * Marker type for field boundaries.
 * @private
 */
export enum FieldMarkType {
    Begin = 'begin',
    Separator = 'separate',
    End = 'end'
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
     * @param {FormField | undefined} field - The form field.
     * @internal
     */
    setFormField(field: FormField | undefined): void {
        this.formFieldValue = field;
    }

    /**
     *  Shared `w:r` identity so fldChar serializes under `w:r`.
     *
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
}

// ============================================================================
// Field (new ParagraphItem-based begin marker)
// ============================================================================

/**
 * Customer-facing Word field types (ECMA-376-1 §17.16 instruction keywords).
 *
 * Only PAGE, NUMPAGES, IF, MERGEFIELD, and HYPERLINK are public in this phase.
 * Other instructions load as opaque content and are excluded from {@link fieldsInParagraph}.
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
    /** Checkbox form field. */
    CheckBox = 'checkBox',
    /** Dropdown form field. */
    DropDown = 'dropDown',
    /** Text form field. */
    TextInput = 'textInput'
}

/**
 * Field begin marker (ParagraphItem-based).
 *
 * Represents `w:fldChar` with `fldCharType="begin"` and acts as a
 * paragraph item itself, providing public field APIs.
 *
 * Structural model:
 * - Field (begin) → instruction TextRange(s) → FieldMark(separate) → result → FieldMark(end)
 *
 * @private
 */
export class Field extends ParagraphItem implements WireRunMember {
    private readonly typeValue: FieldType;
    private readonly fldLockValue: boolean | undefined;
    private readonly dirtyValue: boolean | undefined;
    private readonly extrasValue: ReadonlyArray<OpenXmlElement>;
    private readonly wireGroupValue: WireRunGroup;
    private readonly initialInstrText: string | undefined;

    /**
     * Create a field begin marker.
     *
     * @param {FieldType} type - The type.
     * @param {boolean | undefined} fldLock - The fld lock.
     * @param {boolean | undefined} dirty - The dirty.
     * @param {ReadonlyArray<OpenXmlElement>} extras - The extras.
     * @param {WireRunGroup} wireGroup - The wire group.
     * @param {string} instrText - The instr text.
     * @private
     */
    constructor(
        type: FieldType,
        fldLock: boolean | undefined,
        dirty: boolean | undefined,
        extras: ReadonlyArray<OpenXmlElement>,
        wireGroup?: WireRunGroup,
        instrText?: string
    ) {
        super();
        this.typeValue = type;
        this.fldLockValue = fldLock;
        this.dirtyValue = dirty;
        this.extrasValue = extras;
        this.wireGroupValue = wireGroup != null ? wireGroup : new WireRunGroup();
        this.initialInstrText = instrText;
    }

    /**
     *  Shared `w:r` identity so begin fldChar serializes under `w:r`.
     *
     * @private
     */
    get wireGroup(): WireRunGroup {
        return this.wireGroupValue;
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
        const keywordMatch: RegExpExecArray = /^\s*(\S+)/.exec(value);
        const keyword: string = keywordMatch !== null ? keywordMatch[1]!.toUpperCase() : '';
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
        
        // If no result text exists and this is a form field, we need to create result text
        // For form fields without explicit result runs, we insert an empty TextRange
        if (range === undefined && this instanceof FormField) {
            // Find insertion point (before the end marker)
            const items = paragraph.items.snapshot();
            let endMarkerIndex = -1;
            for (let i = items.length - 1; i >= 0; i--) {
                const item = items[i];
                // Find the end marker for this field
                if (item instanceof FieldMark && item.fieldMarkType === FieldMarkType.End) {
                    endMarkerIndex = i;
                    break;
                }
            }
            
            if (endMarkerIndex > -1) {
                // Create a new TextRange (unattached) and insert it before the end marker
                // Pass undefined as paragraph - insert() will attach it
                const newRange = new TextRange(undefined, new WireRunGroup());
                paragraph.items.insert(newRange, endMarkerIndex);
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
     * Begin marker: `w:fldChar` with `w:fldCharType="begin"` (ECMA-376-1 §17.16.18).
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
}

/**
 * IF field (conditional).
 * @private
 */
export class IfField extends Field {
    // No additional members - expression lives in fieldCode
}

/**
 * MERGEFIELD (mail merge).
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
// Field Traversal Helpers
// ============================================================================

/**
 * @private
 * Field region state for depth-aware traversal.
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
 * Depth-aware: collect result TextRanges owned directly by `field`.
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
 * Depth-aware: collect direct result paragraph items for `field`.
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
 * Concatenate text from TextRanges.
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
 * Parsed MERGEFIELD instruction.
 */
interface MergeFieldParsed {
    fieldName: string;
}

/**
 * @param {string} instruction - The instruction.
 * @returns {*} The result.
 * @private
 * Parse MERGEFIELD instruction to extract field name.
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
 * Format MERGEFIELD instruction from parsed state.
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
 * Tokenize field instruction into whitespace- and quote-delimited tokens.
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
// Form-Field Enums
// ============================================================================

/**
 * Checkbox size type.
 *
 * @public
 */
export enum CheckBoxSizeType {
    /** Automatic size. */
    Auto = 'auto',
    /** Exact size specified. */
    Exactly = 'exactly'
}

/**
 * Text form field type.
 *
 * @public
 */
export enum TextFormFieldType {
    /** Regular text. */
    RegularText = 'regular',
    /** Number text. */
    NumberText = 'number',
    /** Date text. */
    DateText = 'date',
    /** Current date. */
    CurrentDateText = 'currentDate',
    /** Current time. */
    CurrentTimeText = 'currentTime',
    /** Calculated field. */
    Calculation = 'calculated'
}

/**
 * Text format type.
 *
 * @public
 */
export enum TextFormat {
    /** No format. */
    None = 'none',
    /** Uppercase. */
    Uppercase = 'uppercase',
    /** Lowercase. */
    Lowercase = 'lowercase',
    /** First capital. */
    FirstCapital = 'firstCapital',
    /** Title case. */
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
     * Form-field name.
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
     * Whether the form field is enabled.
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
     * Help text for the form field.
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
     * Status bar help text.
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
     * Macro executed on field entry.
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
     * Macro executed on field exit.
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
     * Whether to calculate on exit.
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
     * Form field type.
     *
     * @public
     */
    public abstract get formFieldType(): FormFieldType;

    /**
     * Clone the form field.
     *
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
        const ffDataChildren = this.buildFFDataChildren();
        
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

        // Add enabled element (inverted logic: only add if disabled)
        if (!this.enabledValue) {
            ffDataChildren.push(wmlElement('enabled'));
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

        const ffDataElement = wmlElement('ffData', {
            children: ffDataChildren
        });

        return [ffDataElement];
    }

    /**
     * Build type-specific FFData child elements.
     *
     * @returns {OpenXmlElement[]} The child elements.
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
    public checkedValue: boolean = false;
    public defaultCheckedValue: boolean = false;
    public checkBoxSizeValue: number = 20;
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
     * Whether the checkbox is currently checked.
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
     * Default checkbox state.
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
     * Checkbox size in points.
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
     * Checkbox size type.
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
     * Form field type.
     *
     * @public
     */
    public get formFieldType(): FormFieldType {
        return FormFieldType.CheckBox;
    }

    /**
     * Clone the checkbox form field.
     *
     * @public
     */
    public clone(): CheckBoxFormField {
        const cloned = new CheckBoxFormField();
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
     * @returns {OpenXmlElement[]} The checkbox FFData children.
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

        const checkBoxElement = wmlElement('checkBox', {
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
    public textValue: string = '';

    /**
     * Item text.
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
     * Number of items.
     *
     * @public
     */
    public get count(): number {
        return this.items.length;
    }

    /**
     * Item at index.
     *
     * @public
     */
    public itemAt(index: number): DropDownItem | undefined {
        if (!Number.isInteger(index) || index < 0 || index >= this.items.length) {
            return undefined;
        }
        return this.items[index];
    }

    /**
     * Add an item.
     *
     * @public
     */
    public add(text: string): DropDownItem {
        if (this.items.length >= 25) {
            throw new DocxError(
                'argument/invalid',
                'You can have no more than 25 items in your drop-down list box'
            );
        }
        const item = new DropDownItem();
        item.text = text;
        this.items.push(item);
        return item;
    }

    /**
     * Remove item at index.
     *
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
     * Clear all items.
     *
     * @public
     */
    public clear(): void {
        this.items = [];
    }

    /**
     * Iterate over items.
     *
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
    public dropDownItemsCollection: DropDownCollection = new DropDownCollection();
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
     * Dropdown items collection.
     *
     * @public
     */
    public get dropDownItems(): DropDownCollection {
        return this.dropDownItemsCollection;
    }

    /**
     * Selected item index.
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
     * Form field type.
     *
     * @public
     */
    public get formFieldType(): FormFieldType {
        return FormFieldType.DropDown;
    }

    /**
     * Clone the dropdown form field.
     *
     * @public
     */
    public clone(): DropDownFormField {
        const cloned = new DropDownFormField();
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
     * @returns {OpenXmlElement[]} The dropdown FFData children.
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
            const listEntryElement = wmlElement('listEntry', {
                attributes: [wmlAttr('val', item.text)]
            });
            ddListChildren.push(listEntryElement);
        }

        const ddListElement = wmlElement('ddList', {
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
     * Text input type.
     *
     * @public
     */
    public get type(): TextFormFieldType {
        return this.textTypeValue;
    }

    public set type(value: TextFormFieldType) {
        this.textTypeValue = value;
    }

    /**
     * Default text.
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
     * Maximum text length (0 = unlimited).
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
     * String format (for number, date, etc.).
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
     * Text format (for regular text).
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
     * Text range in the field result.
     *
     * @public
     */
    public get textRange(): TextRange {
        const paragraph = this.findParagraph();
        if (paragraph === undefined) {
            throw new DocxError('content/invalid-field', 'Form field is not attached to a paragraph');
        }
        const ranges = collectFieldResultTextRanges(paragraph, this as any);
        if (ranges.length === 0) {
            throw new DocxError('content/invalid-field', 'Form field has no result range');
        }
        return ranges[0]!;
    }

    /**
     * Current text value.
     *
     * @public
     */
    public get text(): string {
        const paragraph = this.findParagraph();
        if (paragraph === undefined) {
            return '';
        }
        const ranges = collectFieldResultTextRanges(paragraph, this as any);
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
        const paragraph = this.findParagraph();
        if (paragraph === undefined) {
            throw new DocxError('content/invalid-field', 'Form field is not attached to a paragraph');
        }
        const ranges = collectFieldResultTextRanges(paragraph, this as any);
        if (ranges.length === 0) {
            throw new DocxError('content/invalid-field', 'Form field has no result range');
        }
        ranges[0]!.text = value;
    }

    /**
     * Form field type.
     *
     * @public
     */
    public get formFieldType(): FormFieldType {
        return FormFieldType.TextInput;
    }

    /**
     * Clone the text form field.
     *
     * @public
     */
    public clone(): TextFormField {
        const cloned = new TextFormField();
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
     * @returns {OpenXmlElement[]} The text input FFData children.
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

        const textInputElement = wmlElement('textInput', {
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
     * Number of form fields.
     *
     * @public
     */
    public get count(): number {
        this.ensurePopulated();
        return this.fields!.length;
    }

    /**
     * Get form field by index.
     *
     * @public
     */
    public get(index: number): FormField {
        this.ensurePopulated();
        if (!Number.isInteger(index) || index < 0 || index >= this.fields!.length) {
            throw new DocxError('argument/invalid', `Index out of range: ${index}`);
        }
        return this.fields![index]!;
    }

    /**
     * Find form field by name.
     *
     * @public
     */
    public findByName(name: string): FormField | undefined {
        this.ensurePopulated();
        return this.nameMap!.get(name);
    }

    /**
     * Check if a name exists.
     *
     * @public
     */
    public containsName(name: string): boolean {
        this.ensurePopulated();
        return this.nameMap!.has(name);
    }

    /**
     * Iterate over form fields.
     *
     * @public
     */
    public [Symbol.iterator](): Iterator<FormField> {
        this.ensurePopulated();
        return this.fields![Symbol.iterator]();
    }

    /**
     * Invalidate the cache.
     *
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
            const paragraphs = this.textBody.paragraphs;
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
