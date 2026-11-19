import { registerAlwaysOnBodyFeatureBootstrap } from '../document/body-always-on';
import { parseBodyBlocks, serializeBodyBlocks } from '../document/body-blocks';
import { DetachedObjectError } from '../../core/errors/docx-error';
import { WordDocument, Body } from '../document/document';
import { FeatureBlock } from '../document/feature-block';
import { FeatureInline } from '../document/feature-inline';
import { Paragraph, BlockContent, ParagraphOwner } from '../document/paragraph';
import { BodyItem, BlockContentControlBodyItem } from '../document/body-item';
import { projectBlockToBodyItem, registerBodyItemAdapter, FeatureBodyBlock } from '../document/body-item-adapters';
import { registerTypedCollectionHooks } from '../document/typed-body-collections';
import {
    CharacterFormat,
    CharacterFormatHost,
    parseCharacterFormat, CharacterFormatSnapshot
} from '../document/character-format';
import { Color, colorFromWire, colorToHexWire } from '../document/color';
import { EntityType } from '../document/entity-type';
import { LocaleIDs, localeIdFromBcp47, localeIdToBcp47 } from '../document/locale-ids';
import { ParagraphItemCollection, ParagraphItemCollectionHost } from '../document/paragraph-item-collection';
import { ParagraphItem, ParagraphItemOwner } from '../document/paragraph-item';
import {
    ConcreteParagraphItem,
    FeatureInlineParagraphItem,
    FeatureRunParagraphItem,
    OpaqueParagraphItem,
    RunOwner,
    serializeRun,
    serializeParagraphItems,
    TextRange,
    parseTextRangeGroup,
    WireRunGroup
} from '../document/text-range';
import { FeatureRunLeaf } from '../document/feature-run-leaf';
import { FeatureInlineContent } from '../../core/registry/inline-handlers';
import { elementChildren, isWml, isWmlNamespace, wmlAttr, wmlElement } from '../document/wml';
import {
    featureId,
    registerFeature,
    registerFeatureBlockHandler,
    registerFeatureBlockParagraphWalker,
    registerFeatureInlineHandler,
    visitBlocksInDocumentOrder,
    FeatureId
} from '../../core/registry/index';
import { BodyBlockParseContext, detachedBodyBlockParseContext } from '../../core/registry/block-handlers';
import { serializeFeatureInline, tryParseFeatureInline } from '../../core/registry/inline-handlers';
import { NamespaceDeclaration, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { enumValues } from '../../core/compat/object-compat';
const CONTENT_CONTROLS: FeatureId = featureId('content-controls');
/**
 * @private
 * [MS-DOCX] WordprocessingML 2010 extension namespace
 * (`http://schemas.microsoft.com/office/word/2010/wordml`) — checkbox / `w14`.
 */
export const WORDML_2010_NAMESPACE: string = 'http://schemas.microsoft.com/office/word/2010/wordml';
/**
 * @private
 * [MS-DOCX] WordprocessingML 2012 extension namespace
 * (`http://schemas.microsoft.com/office/word/2012/wordml`) — appearance / color.
 */
export const WORDML_2012_NAMESPACE: string = 'http://schemas.microsoft.com/office/word/2012/wordml';
const W14_PREFIX: string = 'w14';
const W15_PREFIX: string = 'w15';
const DEFAULT_CHECKBOX_FONT: string = 'Segoe UI Symbol';
const DEFAULT_CHECKED_SYMBOL: string = '2612';
const DEFAULT_UNCHECKED_SYMBOL: string = '2610';
const DEFAULT_CHECKED_SYMBOL_TEXT: string = '\u2612';
const DEFAULT_UNCHECKED_SYMBOL_TEXT: string = '\u2610';
/**
 * Internal SDT lock wire values (`ST_Lock`).
 *
 * @private
 */
type LockWireValue = 'sdtLocked' | 'contentLocked' | 'unlocked' | 'sdtContentLocked';
/**
 * Authorable content-control kinds (customer public surface).
 *
 * Non-authorable kinds from load (equation, group, …) are preserved via residual XML.
 *
 * @public
 */
export enum ContentControlType {
    RichText = 'richText',
    Text = 'plainText',
    Picture = 'picture',
    ComboBox = 'comboBox',
    DropDownList = 'dropDownList',
    Date = 'date',
    CheckBox = 'checkbox'
}
/**
 * [MS-DOCX] `ST_SdtAppearance` — `w15:appearance/@w15:val`.
 * @public
 */
export enum ContentControlAppearance {
    BoundingBox = 'boundingBox',
    Tags = 'tags',
    Hidden = 'hidden'
}
/**
 * Calendar systems for date content controls (`w:calendar/@w:val`).
 * @public
 */
export enum CalendarType {
    Gregorian = 'gregorian',
    Hijri = 'hijri',
    Hebrew = 'hebrew',
    Taiwan = 'taiwan',
    Japan = 'japan',
    Thai = 'thai',
    Korea = 'korea',
    Saka = 'saka',
    GregorianArabic = 'gregorianArabic',
    GregorianMiddleEastFrench = 'gregorianMiddleEastFrench',
    GregorianTransliteratedEnglish = 'gregorianTransliteratedEnglish',
    GregorianTransliteratedFrench = 'gregorianTransliteratedFrench',
    GregorianUsLocale = 'gregorianUsLocale'
}
/**
 * How mapped date data is stored (`ST_SdtDateMappingType`).
 * @public
 */
export enum ContentControlDateStorageFormat {
    DateStorageDate = 'date',
    DateStorageDateTime = 'dateTime',
    DateStorageText = 'text'
}
/**
 * Checkbox symbol (`w14:checkedState` / `w14:uncheckedState`) — mutable stable identity.
 * @public
 */
export class ContentControlCheckBoxState {
    private fontValue: string | undefined;
    private valueValue: string | undefined;
    private onChange: (() => void) | undefined;
    /**
     *  @private
     *
     * @param {Object} init - The init.
     */
    constructor(init?: { readonly font?: string; readonly value?: string }) {
        this.fontValue = init != null ? init.font : undefined;
        this.valueValue = init != null ? init.value : undefined;
        this.onChange = undefined;
    }
    /**
     *  @private
     *
     * @param {Function} onChange - The on change.
     * @returns {void} Nothing is returned.
     */
    bind(onChange: () => void): void {
        this.onChange = onChange;
    }
    private dirty(): void {
        if (this.onChange !== undefined) {
            this.onChange();
        }
    }
    /** Font name for the checkbox glyph. @public */
    get font(): string | undefined {
        return this.fontValue;
    }
    set font(value: string | undefined) {
        this.fontValue = value;
        this.dirty();
    }
    /** Glyph code point / short-hex value. @public */
    get value(): string | undefined {
        return this.valueValue;
    }
    set value(value: string | undefined) {
        this.valueValue = value;
        this.dirty();
    }
}
/**
 * Combo-box or drop-down list entry.
 * @public
 */
export class ContentControlListItem {
    private displayTextValue: string | undefined;
    private valueValue: string | undefined;
    private onChange: (() => void) | undefined;
    /** @public */
    constructor() {
        this.displayTextValue = undefined;
        this.valueValue = undefined;
        this.onChange = undefined;
    }
    /**
     *  @private
     *
     * @param {Function} onChange - The on change.
     * @returns {void} Nothing is returned.
     */
    bind(onChange: () => void): void {
        this.onChange = onChange;
    }
    private dirty(): void {
        if (this.onChange !== undefined) {
            this.onChange();
        }
    }
    /** Display label. @public */
    get displayText(): string | undefined {
        return this.displayTextValue;
    }
    set displayText(value: string | undefined) {
        this.displayTextValue = value;
        this.dirty();
    }
    /** Stored value. @public */
    get value(): string | undefined {
        return this.valueValue;
    }
    set value(value: string | undefined) {
        this.valueValue = value;
        this.dirty();
    }
}
/**
 * Mutable list of {@link ContentControlListItem} with stable identity.
 * @public
 */
export class ContentControlListItemCollection {
    private readonly items: ContentControlListItem[];
    private onChange: (() => void) | undefined;
    /**
     *  @private
     *
     * @param {ReadonlyArray<ContentControlListItem>} items - The items.
     */
    constructor(items?: ReadonlyArray<ContentControlListItem>) {
        this.items = items != null ? items.slice() : [];
        this.onChange = undefined;
    }
    /**
     *  @private
     *
     * @param {Function} onChange - The on change.
     * @returns {void} Nothing is returned.
     */
    bind(onChange: () => void): void {
        this.onChange = onChange;
        for (const item of this.items) {
            item.bind(onChange);
        }
    }
    private dirty(): void {
        if (this.onChange !== undefined) {
            this.onChange();
        }
    }
    /** Number of list items. @public */
    get count(): number {
        return this.items.length;
    }
    /**
     *  Item at zero-based index. @public
     *
     * @param {number} index - The index.
     * @returns {ContentControlListItem} The result.
     */
    getItem(index: number): ContentControlListItem {
        if (index < 0 || index >= this.items.length) {
            throw new RangeError('List item index out of range');
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return this.items[index];
    }
    /**
     *  Snapshot array (copy). @public
     *
     * @returns {ContentControlListItem[]} The result.
     */
    toArray(): ContentControlListItem[] {
        return this.items.slice();
    }
    /**
     *  Add a list item. @public
     *
     * @param {ContentControlListItem} item - The item.
     * @returns {void} Nothing is returned.
     */
    add(item: ContentControlListItem): void {
        if (this.onChange !== undefined) {
            item.bind(this.onChange);
        }
        this.items.push(item);
        this.dirty();
    }
    /**
     *  Remove all items. @public
     *
     * @returns {void} Nothing is returned.
     */
    clear(): void {
        this.items.length = 0;
        this.dirty();
    }
    /**
     *  @private
     *
     * @returns {ReadonlyArray<ContentControlListItem>} The result.
     */
    asReadonly(): ReadonlyArray<ContentControlListItem> {
        return this.items;
    }
}
/**
 * Custom XML data binding metadata from `w:sdtPr/w:dataBinding`.
 *
 * @private
 */
export interface ContentControlDataBinding {
    readonly prefixMappings: string | undefined;
    readonly xpath: string;
    readonly storeItemID: string;
}
/**
 * @private
 */
interface ContentControlPropertiesOwner {
    markSdtPrDirty(): void;
    synchronizeCheckboxContent(): void;
}
function locksFromWire(lock: LockWireValue | undefined): {
    lockContentControl: boolean;
    lockContents: boolean;
} {
    if (lock === 'sdtLocked') {
        return { lockContentControl: true, lockContents: false };
    }
    if (lock === 'contentLocked') {
        return { lockContentControl: false, lockContents: true };
    }
    if (lock === 'sdtContentLocked') {
        return { lockContentControl: true, lockContents: true };
    }
    return { lockContentControl: false, lockContents: false };
}
function locksToWire(
    lockContentControl: boolean,
    lockContents: boolean
): LockWireValue | undefined {
    if (lockContentControl && lockContents) {
        return 'sdtContentLocked';
    }
    if (lockContentControl) {
        return 'sdtLocked';
    }
    if (lockContents) {
        return 'contentLocked';
    }
    return undefined;
}
/**
 * Structured document tag properties (`w:sdtPr`).
 *
 * @public
 */
export class ContentControlProperties {
    private tagValue: string | undefined;
    private titleValue: string | undefined;
    /**
     * @private
     */
    private idValue: number | undefined;
    private lockContentControlValue: boolean;
    private lockContentsValue: boolean;
    /**
     * @private
     */
    private placeholderDocPartValue: string | undefined;
    /**
     * @private
     */
    private dataBindingValue: ContentControlDataBinding | undefined;
    private typeValue: ContentControlType | undefined;
    private temporaryValue: boolean;
    private appearanceValue: ContentControlAppearance | undefined;
    private colorValue: Color | undefined;
    private themeColorValue: string | undefined;
    private themeTintValue: string | undefined;
    private themeShadeValue: string | undefined;
    private isCheckedValue: boolean;
    private readonly checkedStateValue: ContentControlCheckBoxState;
    private readonly uncheckedStateValue: ContentControlCheckBoxState;
    private fullDateValue: string | undefined;
    private dateDisplayFormatValue: string | undefined;
    private dateDisplayLocaleValue: LocaleIDs | undefined;
    private dateStorageFormatValue: ContentControlDateStorageFormat | undefined;
    private dateCalendarTypeValue: CalendarType | undefined;
    private readonly contentControlListItemsValue: ContentControlListItemCollection;
    private lastValueValue: string | undefined;
    private multilineValue: boolean | undefined;
    /**
     * @private
     */
    private residualChildrenValue: ReadonlyArray<OpenXmlElement>;
    private leftoverAttributesValue: ReadonlyArray<OpenXmlAttribute>;
    private namespaceDeclarationsValue: ReadonlyArray<NamespaceDeclaration>;
    private owner: ContentControlPropertiesOwner | undefined;
    /**
     * @param {Object} init - The init.
     * @private
     */
    constructor(init?: {
        readonly tag?: string;
        readonly title?: string;
        readonly id?: number;
        readonly lock?: LockWireValue;
        readonly lockContentControl?: boolean;
        readonly lockContents?: boolean;
        readonly placeholderDocPart?: string;
        readonly dataBinding?: ContentControlDataBinding;
        readonly type?: ContentControlType;
        readonly temporary?: boolean;
        readonly appearance?: ContentControlAppearance;
        readonly color?: Color;
        readonly themeColor?: string;
        readonly themeTint?: string;
        readonly themeShade?: string;
        readonly isChecked?: boolean;
        readonly checkedState?: ContentControlCheckBoxState;
        readonly uncheckedState?: ContentControlCheckBoxState;
        readonly fullDate?: string;
        readonly dateDisplayFormat?: string;
        readonly dateDisplayLocale?: LocaleIDs;
        readonly dateStorageFormat?: ContentControlDateStorageFormat;
        readonly dateCalendarType?: CalendarType;
        readonly listItems?: ReadonlyArray<ContentControlListItem>;
        readonly lastValue?: string;
        readonly multiline?: boolean;
        readonly residualChildren?: ReadonlyArray<OpenXmlElement>;
        readonly leftoverAttributes?: ReadonlyArray<OpenXmlAttribute>;
        readonly namespaceDeclarations?: ReadonlyArray<NamespaceDeclaration>;
    }) {
        const src: {
            readonly tag?: string;
            readonly title?: string;
            readonly id?: number;
            readonly lock?: LockWireValue;
            readonly lockContentControl?: boolean;
            readonly lockContents?: boolean;
            readonly placeholderDocPart?: string;
            readonly dataBinding?: ContentControlDataBinding;
            readonly type?: ContentControlType;
            readonly temporary?: boolean;
            readonly appearance?: ContentControlAppearance;
            readonly color?: Color;
            readonly themeColor?: string;
            readonly themeTint?: string;
            readonly themeShade?: string;
            readonly isChecked?: boolean;
            readonly checkedState?: ContentControlCheckBoxState;
            readonly uncheckedState?: ContentControlCheckBoxState;
            readonly fullDate?: string;
            readonly dateDisplayFormat?: string;
            readonly dateDisplayLocale?: LocaleIDs;
            readonly dateStorageFormat?: ContentControlDateStorageFormat;
            readonly dateCalendarType?: CalendarType;
            readonly listItems?: ReadonlyArray<ContentControlListItem>;
            readonly lastValue?: string;
            readonly multiline?: boolean;
            readonly residualChildren?: ReadonlyArray<OpenXmlElement>;
            readonly leftoverAttributes?: ReadonlyArray<OpenXmlAttribute>;
            readonly namespaceDeclarations?: ReadonlyArray<NamespaceDeclaration>;
        } = init != null ? init : {};
        this.tagValue = src.tag;
        this.titleValue = src.title;
        this.idValue = src.id;
        const fromLock: { lockContentControl: boolean; lockContents: boolean; } =
            src.lock !== undefined
                ? locksFromWire(src.lock)
                : {
                    lockContentControl: src.lockContentControl === true,
                    lockContents: src.lockContents === true
                };
        this.lockContentControlValue = fromLock.lockContentControl;
        this.lockContentsValue = fromLock.lockContents;
        this.placeholderDocPartValue = src.placeholderDocPart;
        this.dataBindingValue = src.dataBinding;
        this.typeValue = src.type;
        this.temporaryValue = src.temporary === true;
        this.appearanceValue = src.appearance;
        this.colorValue = src.color;
        this.themeColorValue = src.themeColor;
        this.themeTintValue = src.themeTint;
        this.themeShadeValue = src.themeShade;
        this.isCheckedValue = src.isChecked === true;
        this.checkedStateValue =
            src.checkedState != null
                ? src.checkedState
                : new ContentControlCheckBoxState(
                    src.type === 'checkbox'
                        ? { font: DEFAULT_CHECKBOX_FONT, value: DEFAULT_CHECKED_SYMBOL }
                        : undefined
                );
        this.uncheckedStateValue =
            src.uncheckedState != null
                ? src.uncheckedState
                : new ContentControlCheckBoxState(
                    src.type === 'checkbox'
                        ? { font: DEFAULT_CHECKBOX_FONT, value: DEFAULT_UNCHECKED_SYMBOL }
                        : undefined
                );
        this.fullDateValue = src.fullDate;
        this.dateDisplayFormatValue = src.dateDisplayFormat;
        this.dateDisplayLocaleValue = src.dateDisplayLocale;
        this.dateStorageFormatValue = src.dateStorageFormat;
        this.dateCalendarTypeValue = src.dateCalendarType;
        this.contentControlListItemsValue = new ContentControlListItemCollection(src.listItems);
        this.lastValueValue = src.lastValue;
        this.multilineValue = src.multiline;
        this.residualChildrenValue = src.residualChildren != null ? src.residualChildren : [];
        this.leftoverAttributesValue =
            src.leftoverAttributes != null ? src.leftoverAttributes : [];
        this.namespaceDeclarationsValue =
            src.namespaceDeclarations != null ? src.namespaceDeclarations : [];
        this.owner = undefined;
        const mark: () => void = (): void => {
            this.markDirty();
        };
        this.checkedStateValue.bind(mark);
        this.uncheckedStateValue.bind(mark);
        this.contentControlListItemsValue.bind(mark);
    }
    /**
     * @param {ContentControlPropertiesOwner} owner - The owner.
     * @returns {void} Nothing is returned.
     * @private
     * Bind owning control so property sets rebuild `sdtPr` on save.
     */
    bindOwner(owner: ContentControlPropertiesOwner): void {
        this.owner = owner;
    }
    private markDirty(): void {
        if (this.owner !== undefined) {
            this.owner.markSdtPrDirty();
        }
    }
    /**
     * Drop type-specific payloads that do not belong to `type`.
     *
     * @param {ContentControlType | undefined} type - The type.
     * @returns {void} Nothing is returned.
     */
    private clearPayloadsForType(type: ContentControlType | undefined): void {
        if (type !== 'checkbox') {
            this.isCheckedValue = false;
            this.checkedStateValue.font = undefined;
            this.checkedStateValue.value = undefined;
            this.uncheckedStateValue.font = undefined;
            this.uncheckedStateValue.value = undefined;
        }
        if (type !== 'date') {
            this.fullDateValue = undefined;
            this.dateDisplayFormatValue = undefined;
            this.dateDisplayLocaleValue = undefined;
            this.dateStorageFormatValue = undefined;
            this.dateCalendarTypeValue = undefined;
        }
        if (type !== 'comboBox' && type !== 'dropDownList') {
            this.contentControlListItemsValue.clear();
            this.lastValueValue = undefined;
        }
        if (type !== 'plainText') {
            this.multilineValue = undefined;
        }
    }
    /**
     * Gets or sets the programmatic tag used to identify this content control in code.
     *
     * If undefined, no tag is explicitly specified.
     *
     * @public
     */
    get tag(): string | undefined {
        return this.tagValue;
    }
    set tag(value: string | undefined) {
        this.tagValue = value;
        this.markDirty();
    }
    /**
     * Gets or sets the friendly display name shown as the content-control title in Word.
     *
     * If undefined, no title is explicitly specified.
     *
     * @public
     */
    get title(): string | undefined {
        return this.titleValue;
    }
    set title(value: string | undefined) {
        this.titleValue = value;
        this.markDirty();
    }
    /**
     * @private
     * Numeric id (`w:sdtPr/w:id/@w:val`). Preserve-only identity from load or
     * author options — not a general post-create editing knob.
     */
    get id(): number | undefined {
        return this.idValue;
    }
    /**
     * Gets or sets whether the content-control definition is locked.
     * @public
     */
    get lockContentControl(): boolean {
        return this.lockContentControlValue;
    }
    set lockContentControl(value: boolean) {
        this.lockContentControlValue = value === true;
        if (this.lockContentControlValue) {
            this.temporaryValue = false;
        }
        this.markDirty();
    }
    /**
     * Gets or sets whether the content inside the control is locked.
     * @public
     */
    get lockContents(): boolean {
        return this.lockContentsValue;
    }
    set lockContents(value: boolean) {
        this.lockContentsValue = value === true;
        this.markDirty();
    }
    /**
     * @private
     * Combined ST_Lock wire value for serialize.
     */
    get lockWire(): LockWireValue | undefined {
        return locksToWire(this.lockContentControlValue, this.lockContentsValue);
    }
    /**
     * @private
     * Placeholder document-part name
     * (`w:sdtPr/w:placeholder/w:docPart/@w:val`).
     */
    get placeholderDocPart(): string | undefined {
        return this.placeholderDocPartValue;
    }
    set placeholderDocPart(value: string | undefined) {
        this.placeholderDocPartValue = value;
        this.markDirty();
    }
    /**
     * @private
     * Custom XML data binding metadata. Detect/preserve only — never resolved
     * against a store or network; no public setter.
     */
    get dataBinding(): ContentControlDataBinding | undefined {
        return this.dataBindingValue;
    }
    /**
     * Gets or sets the content-control kind.
     * @public
     */
    get type(): ContentControlType | undefined {
        return this.typeValue;
    }
    set type(value: ContentControlType | undefined) {
        requireAuthorableType(value);
        this.typeValue = value;
        this.clearPayloadsForType(value);
        this.markDirty();
    }
    /**
     * Gets or sets whether the control is removed after contents are edited once (`w:temporary`).
     * @public
     */
    get isTemporary(): boolean {
        return this.temporaryValue;
    }
    set isTemporary(value: boolean) {
        this.temporaryValue = value === true;
        if (this.temporaryValue) {
            this.lockContentControlValue = false;
        }
        this.markDirty();
    }
    /**
     *  Compatibility alias for load/serialize paths that used `temporary`.
     *
     * @private
     */
    get temporary(): boolean {
        return this.temporaryValue;
    }
    set temporary(value: boolean | undefined) {
        this.isTemporary = value === true;
    }
    /**
     * Gets or sets how the control chrome is shown.
     * @public
     */
    get appearance(): ContentControlAppearance | undefined {
        return this.appearanceValue;
    }
    set appearance(value: ContentControlAppearance | undefined) {
        this.appearanceValue = value;
        this.markDirty();
    }
    /**
     * Gets or sets the border/chrome color (`Color` API).
     * @public
     */
    get color(): Color | undefined {
        return this.colorValue;
    }
    set color(value: Color | undefined) {
        this.colorValue = value;
        this.markDirty();
    }
    /**
     * @private
     */
    get themeColor(): string | undefined {
        return this.themeColorValue;
    }
    /**
     * @private
     */
    get themeTint(): string | undefined {
        return this.themeTintValue;
    }
    /**
     * @private
     */
    get themeShade(): string | undefined {
        return this.themeShadeValue;
    }
    /**
     * Gets or sets whether a checkbox control is checked.
     * @public
     */
    get isChecked(): boolean {
        return this.isCheckedValue;
    }
    set isChecked(value: boolean) {
        this.isCheckedValue = value === true;
        if (this.typeValue !== ContentControlType.CheckBox) {
            this.typeValue = ContentControlType.CheckBox;
            this.clearPayloadsForType(ContentControlType.CheckBox);
            this.isCheckedValue = value === true;
        }
        this.markDirty();
        if (this.owner !== undefined) {
            this.owner.synchronizeCheckboxContent();
        }
    }
    /**
     * Checked-state symbol (stable identity).
     * @public
     */
    get checkedState(): ContentControlCheckBoxState {
        return this.checkedStateValue;
    }
    /**
     * Unchecked-state symbol (stable identity).
     * @public
     */
    get uncheckedState(): ContentControlCheckBoxState {
        return this.uncheckedStateValue;
    }
    /**
     * Full date/time stored value.
     * @public
     */
    get fullDate(): string | undefined {
        return this.fullDateValue;
    }
    set fullDate(value: string | undefined) {
        this.fullDateValue = value;
        if (value !== undefined && this.typeValue !== ContentControlType.Date) {
            this.typeValue = ContentControlType.Date;
            this.clearPayloadsForType(ContentControlType.Date);
            this.fullDateValue = value;
        }
        this.markDirty();
    }
    /**
     * Display format pattern for the date.
     * @public
     */
    get dateDisplayFormat(): string | undefined {
        return this.dateDisplayFormatValue;
    }
    set dateDisplayFormat(value: string | undefined) {
        this.dateDisplayFormatValue = value;
        if (value !== undefined && this.typeValue !== ContentControlType.Date) {
            this.typeValue = ContentControlType.Date;
            this.clearPayloadsForType(ContentControlType.Date);
            this.dateDisplayFormatValue = value;
        }
        this.markDirty();
    }
    /**
     * Locale used for date display.
     * @public
     */
    get dateDisplayLocale(): LocaleIDs | undefined {
        return this.dateDisplayLocaleValue;
    }
    set dateDisplayLocale(value: LocaleIDs | undefined) {
        this.dateDisplayLocaleValue = value;
        if (value !== undefined && this.typeValue !== ContentControlType.Date) {
            this.typeValue = ContentControlType.Date;
            this.clearPayloadsForType(ContentControlType.Date);
            this.dateDisplayLocaleValue = value;
        }
        this.markDirty();
    }
    /**
     * How mapped date data is stored.
     * @public
     */
    get dateStorageFormat(): ContentControlDateStorageFormat | undefined {
        return this.dateStorageFormatValue;
    }
    set dateStorageFormat(value: ContentControlDateStorageFormat | undefined) {
        this.dateStorageFormatValue = value;
        if (value !== undefined && this.typeValue !== ContentControlType.Date) {
            this.typeValue = ContentControlType.Date;
            this.clearPayloadsForType(ContentControlType.Date);
            this.dateStorageFormatValue = value;
        }
        this.markDirty();
    }
    /**
     * Calendar system for the date control.
     * @public
     */
    get dateCalendarType(): CalendarType | undefined {
        return this.dateCalendarTypeValue;
    }
    set dateCalendarType(value: CalendarType | undefined) {
        this.dateCalendarTypeValue = value;
        if (value !== undefined && this.typeValue !== ContentControlType.Date) {
            this.typeValue = ContentControlType.Date;
            this.clearPayloadsForType(ContentControlType.Date);
            this.dateCalendarTypeValue = value;
        }
        this.markDirty();
    }
    /**
     * Combo-box / drop-down list items (stable identity).
     * @public
     */
    get contentControlListItems(): ContentControlListItemCollection {
        return this.contentControlListItemsValue;
    }
    /**
     * Last selected list value.
     * @public
     */
    get lastValue(): string | undefined {
        return this.lastValueValue;
    }
    set lastValue(value: string | undefined) {
        this.lastValueValue = value;
        if (value !== undefined) {
            if (this.typeValue !== ContentControlType.ComboBox && this.typeValue !== ContentControlType.DropDownList) {
                this.typeValue = ContentControlType.DropDownList;
                this.clearPayloadsForType(this.typeValue);
                this.lastValueValue = value;
            }
        }
        this.markDirty();
    }
    /**
     * Whether a plain-text control accepts multiple lines (`w:text/@w:multiLine`).
     * @public
     */
    get multiline(): boolean | undefined {
        return this.multilineValue;
    }
    set multiline(value: boolean | undefined) {
        this.multilineValue = value;
        if (value !== undefined) {
            this.typeValue = ContentControlType.Text;
            this.clearPayloadsForType(ContentControlType.Text);
            this.multilineValue = value;
        }
        this.markDirty();
    }
    /**
     * @private
     * Unmodeled `sdtPr` children (including extra kind markers). */
    get residualChildren(): ReadonlyArray<OpenXmlElement> {
        return this.residualChildrenValue;
    }
    /**
     * @private
     * Leftover attributes on `sdtPr` itself. */
    get leftoverAttributes(): ReadonlyArray<OpenXmlAttribute> {
        return this.leftoverAttributesValue;
    }
    /**
     * @private
     * Namespace declarations on `sdtPr`. */
    get namespaceDeclarations(): ReadonlyArray<NamespaceDeclaration> {
        return this.namespaceDeclarationsValue;
    }
}
// ── XML helpers ─────────────────────────────────────────────────────────────
function isWordMl2010(el: OpenXmlElement, localName: string): boolean {
    return el.namespaceUri === WORDML_2010_NAMESPACE && el.localName === localName;
}
function isWordMl2012(el: OpenXmlElement, localName: string): boolean {
    return el.namespaceUri === WORDML_2012_NAMESPACE && el.localName === localName;
}
function attributeByLocalName(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName)), ts330 == null ? undefined : ts330.value);
}
function wmlAttribute(el: OpenXmlElement, localName: string): string | undefined {
    let ts331: any;
    return ((ts331 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName &&
        (a.namespaceUri === '' || isWmlNamespace(a.namespaceUri) || a.prefix === 'w'))), ts331 == null ? undefined : ts331.value);
}
function wValAttribute(el: OpenXmlElement): string | undefined {
    return wmlAttribute(el, 'val');
}
function anyValAttribute(el: OpenXmlElement): string | undefined {
    return attributeByLocalName(el, 'val');
}
function parseStOnOff(raw: string | undefined): boolean | undefined {
    if (raw === undefined || raw.length === 0) {
        return true;
    }
    const normalized: string = raw.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'on') {
        return true;
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'off') {
        return false;
    }
    return undefined;
}
function parseDecimalId(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10);
}
function parseLockWire(raw: string | undefined): LockWireValue | undefined {
    if (raw === 'sdtLocked' ||
        raw === 'contentLocked' ||
        raw === 'unlocked' ||
        raw === 'sdtContentLocked') {
        return raw;
    }
    return undefined;
}
function parseAppearance(raw: string | undefined): ContentControlAppearance | undefined {
    return enumValues<ContentControlAppearance>(ContentControlAppearance).find((v: ContentControlAppearance) => v === raw);
}
function parseDateStorageFormat(raw: string | undefined): ContentControlDateStorageFormat | undefined {
    return enumValues<ContentControlDateStorageFormat>(ContentControlDateStorageFormat)
        .find((v: ContentControlDateStorageFormat) => v === raw);
}
function parseCalendarType(raw: string | undefined): CalendarType | undefined {
    return enumValues<CalendarType>(CalendarType).find((v: CalendarType) => v === raw);
}
function unqualifiedAttribute(el: OpenXmlElement, localName: string): string | undefined {
    let ts332: any;
    return ((ts332 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName &&
        (a.namespaceUri === '' ||
            a.prefix === 'w' ||
            a.namespaceUri.includes('wordprocessingml') ||
            a.namespaceUri === WORDML_2010_NAMESPACE ||
            a.namespaceUri === WORDML_2012_NAMESPACE))), ts332 == null ? undefined : ts332.value);
}
function parseDataBinding(element: OpenXmlElement): ContentControlDataBinding | undefined {
    if (!isWml(element, 'dataBinding')) {
        return undefined;
    }
    const xpath: string = unqualifiedAttribute(element, 'xpath');
    const storeItemID: string = unqualifiedAttribute(element, 'storeItemID');
    if (xpath === undefined || xpath.length === 0 || storeItemID === undefined || storeItemID.length === 0) {
        return undefined;
    }
    const prefixMappings: string = unqualifiedAttribute(element, 'prefixMappings');
    return { prefixMappings, xpath, storeItemID };
}
function nsAttr(namespaceUri: string, prefix: string, localName: string, value: string): OpenXmlAttribute {
    return { namespaceUri, localName, prefix, value };
}
function nsElement(namespaceUri: string, prefix: string, localName: string, options?: {
    readonly attributes?: ReadonlyArray<OpenXmlAttribute>;
    readonly children?: ReadonlyArray<OpenXmlChild>;
    readonly namespaceDeclarations?: ReadonlyArray<NamespaceDeclaration>;
}): OpenXmlElement {
    let ts333: any; let ts334: any; let ts335: any;
    return {
        kind: 'element',
        namespaceUri,
        localName,
        prefix,
        attributes: ((ts333 = options == null ? undefined : options.attributes), ts333 != null ? ts333 : []),
        namespaceDeclarations: ((ts334 = options == null ? undefined : options.namespaceDeclarations), ts334 != null ? ts334 : []),
        children: ((ts335 = options == null ? undefined : options.children), ts335 != null ? ts335 : [])
    };
}
function serializeOnOffWml(localName: string, value: boolean): OpenXmlElement {
    if (value) {
        return wmlElement(localName);
    }
    return wmlElement(localName, { attributes: [wmlAttr('val', 'false')] });
}
function serializeOnOffNs(namespaceUri: string, prefix: string, localName: string, value: boolean): OpenXmlElement {
    if (value) {
        return nsElement(namespaceUri, prefix, localName);
    }
    return nsElement(namespaceUri, prefix, localName, {
        attributes: [nsAttr(namespaceUri, prefix, 'val', '0')]
    });
}
// ── Kind local-name maps ────────────────────────────────────────────────────
/** Authorable kinds only — public ContentControlType. */
const WML_TYPE_LOCAL_TO_TYPE: ReadonlyMap<string, ContentControlType> = new Map<string, ContentControlType>([
    ['comboBox', ContentControlType.ComboBox],
    ['date', ContentControlType.Date],
    ['dropDownList', ContentControlType.DropDownList],
    ['picture', ContentControlType.Picture],
    ['richText', ContentControlType.RichText],
    ['text', ContentControlType.Text]
]);
const TYPE_TO_WML_LOCAL: ReadonlyMap<ContentControlType, string> = new Map<ContentControlType, string>([
    [ContentControlType.ComboBox, 'comboBox'],
    [ContentControlType.Date, 'date'],
    [ContentControlType.DropDownList, 'dropDownList'],
    [ContentControlType.Picture, 'picture'],
    [ContentControlType.RichText, 'richText'],
    [ContentControlType.Text, 'text'],
    [ContentControlType.CheckBox, 'checkbox']
]);
/** Non-authorable WML kind local names preserved as residual. */
const NON_AUTHORABLE_KIND_LOCALS: Set<string> = new Set<string>([
    'equation',
    'docPartObj',
    'docPartList',
    'citation',
    'group',
    'bibliography'
]);
const AUTHORABLE_TYPES: Set<ContentControlType> = new Set<ContentControlType>([
    ContentControlType.ComboBox,
    ContentControlType.Date,
    ContentControlType.DropDownList,
    ContentControlType.Picture,
    ContentControlType.RichText,
    ContentControlType.Text,
    ContentControlType.CheckBox
]);
function isWmlTypeLocalName(localName: string): boolean {
    return WML_TYPE_LOCAL_TO_TYPE.has(localName) || NON_AUTHORABLE_KIND_LOCALS.has(localName);
}
function requireAuthorableType(value: ContentControlType | undefined): void {
    if (value === undefined) {
        return;
    }
    if (!AUTHORABLE_TYPES.has(value)) {
        throw new Error(`Content control type '${value}' is not authorable.`);
    }
}
// ── Kind-specific parsers ───────────────────────────────────────────────────
function parseListItems(kindEl: OpenXmlElement): {
    readonly items: ContentControlListItem[];
    readonly lastValue: string | undefined;
} {
    const items: ContentControlListItem[] = [];
    for (const child of elementChildren(kindEl)) {
        if (!isWml(child, 'listItem')) {
            continue;
        }
        const item: ContentControlListItem = new ContentControlListItem();
        item.displayText = unqualifiedAttribute(child, 'displayText');
        item.value = unqualifiedAttribute(child, 'value');
        items.push(item);
    }
    return {
        items,
        lastValue: unqualifiedAttribute(kindEl, 'lastValue')
    };
}
function parseDateFields(kindEl: OpenXmlElement): {
    readonly fullDate: string | undefined;
    readonly dateDisplayFormat: string | undefined;
    readonly dateDisplayLocale: LocaleIDs | undefined;
    readonly dateStorageFormat: ContentControlDateStorageFormat | undefined;
    readonly dateCalendarType: CalendarType | undefined;
} {
    let dateDisplayFormat: string | undefined;
    let dateDisplayLocale: LocaleIDs | undefined;
    let dateStorageFormat: ContentControlDateStorageFormat | undefined;
    let dateCalendarType: CalendarType | undefined;
    for (const child of elementChildren(kindEl)) {
        if (isWml(child, 'dateFormat')) {
            dateDisplayFormat = wValAttribute(child);
            continue;
        }
        if (isWml(child, 'lid')) {
            const lid: string = wValAttribute(child);
            if (lid !== undefined) {
                dateDisplayLocale = localeIdFromBcp47(lid);
            }
            continue;
        }
        if (isWml(child, 'storeMappedDataAs')) {
            dateStorageFormat = parseDateStorageFormat(wValAttribute(child));
            continue;
        }
        if (isWml(child, 'calendar')) {
            dateCalendarType = parseCalendarType(wValAttribute(child));
        }
    }
    return {
        fullDate: unqualifiedAttribute(kindEl, 'fullDate'),
        dateDisplayFormat,
        dateDisplayLocale,
        dateStorageFormat,
        dateCalendarType
    };
}
function parseCheckboxState(el: OpenXmlElement): ContentControlCheckBoxState {
    return new ContentControlCheckBoxState({
        font: attributeByLocalName(el, 'font'),
        value: attributeByLocalName(el, 'val')
    });
}
function parseCheckboxFields(kindEl: OpenXmlElement): {
    readonly isChecked: boolean;
    readonly checkedState: ContentControlCheckBoxState;
    readonly uncheckedState: ContentControlCheckBoxState;
} {
    let isChecked: boolean = false;
    let checkedState: ContentControlCheckBoxState = new ContentControlCheckBoxState();
    let uncheckedState: ContentControlCheckBoxState = new ContentControlCheckBoxState();
    for (const child of elementChildren(kindEl)) {
        if (isWordMl2010(child, 'checked')) {
            const parsed: boolean = parseStOnOff(anyValAttribute(child));
            isChecked = parsed != null ? parsed : true;
            continue;
        }
        if (isWordMl2010(child, 'checkedState')) {
            checkedState = parseCheckboxState(child);
            continue;
        }
        if (isWordMl2010(child, 'uncheckedState')) {
            uncheckedState = parseCheckboxState(child);
        }
    }
    return { isChecked, checkedState, uncheckedState };
}
function parseColorFields(el: OpenXmlElement): {
    readonly color: Color | undefined;
    readonly themeColor: string | undefined;
    readonly themeTint: string | undefined;
    readonly themeShade: string | undefined;
} {
    const val: string = attributeByLocalName(el, 'val');
    return {
        color: val !== undefined && val.length > 0 ? colorFromWire(val) : undefined,
        themeColor: attributeByLocalName(el, 'themeColor'),
        themeTint: attributeByLocalName(el, 'themeTint'),
        themeShade: attributeByLocalName(el, 'themeShade')
    };
}
function parseContentControlProperties(sdtPr: OpenXmlElement | undefined): ContentControlProperties | undefined {
    if (sdtPr === undefined || !isWml(sdtPr, 'sdtPr')) {
        return undefined;
    }
    let tag: string | undefined;
    let title: string | undefined;
    let id: number | undefined;
    let lock: LockWireValue | undefined;
    let placeholderDocPart: string | undefined;
    let dataBinding: ContentControlDataBinding | undefined;
    let type: ContentControlType | undefined;
    let temporary: boolean | undefined;
    let appearance: ContentControlAppearance | undefined;
    let color: Color | undefined;
    let themeColor: string | undefined;
    let themeTint: string | undefined;
    let themeShade: string | undefined;
    let isChecked: boolean | undefined;
    let checkedState: ContentControlCheckBoxState | undefined;
    let uncheckedState: ContentControlCheckBoxState | undefined;
    let fullDate: string | undefined;
    let dateDisplayFormat: string | undefined;
    let dateDisplayLocale: LocaleIDs | undefined;
    let dateStorageFormat: ContentControlDateStorageFormat | undefined;
    let dateCalendarType: CalendarType | undefined;
    let listItems: ReadonlyArray<ContentControlListItem> | undefined;
    let lastValue: string | undefined;
    let multiline: boolean | undefined;
    const residualChildren: OpenXmlElement[] = [];
    let sawAlias: boolean = false;
    let sawTag: boolean = false;
    let sawId: boolean = false;
    let sawLock: boolean = false;
    let sawPlaceholder: boolean = false;
    let sawTemporary: boolean = false;
    let sawDataBinding: boolean = false;
    let sawAppearance: boolean = false;
    let sawColor: boolean = false;
    let sawKind: boolean = false;
    for (const child of elementChildren(sdtPr)) {
        if (isWml(child, 'alias') && !sawAlias) {
            sawAlias = true;
            title = wValAttribute(child);
            continue;
        }
        if (isWml(child, 'tag') && !sawTag) {
            sawTag = true;
            tag = wValAttribute(child);
            continue;
        }
        if (isWml(child, 'id') && !sawId) {
            sawId = true;
            id = parseDecimalId(wValAttribute(child));
            continue;
        }
        if (isWml(child, 'lock') && !sawLock) {
            sawLock = true;
            lock = parseLockWire(wValAttribute(child));
            continue;
        }
        if (isWml(child, 'placeholder') && !sawPlaceholder) {
            sawPlaceholder = true;
            for (const placeholderChild of elementChildren(child)) {
                if (isWml(placeholderChild, 'docPart')) {
                    placeholderDocPart = wValAttribute(placeholderChild);
                }
            }
            continue;
        }
        if (isWml(child, 'temporary') && !sawTemporary) {
            sawTemporary = true;
            const parsed: boolean = parseStOnOff(wValAttribute(child));
            temporary = parsed != null ? parsed : true;
            continue;
        }
        if (isWml(child, 'dataBinding') && !sawDataBinding) {
            sawDataBinding = true;
            const binding: ContentControlDataBinding = parseDataBinding(child);
            if (binding !== undefined) {
                dataBinding = binding;
                continue;
            }
            residualChildren.push(child);
            continue;
        }
        if (isWordMl2012(child, 'appearance') && !sawAppearance) {
            sawAppearance = true;
            const parsed: ContentControlAppearance = parseAppearance(anyValAttribute(child));
            if (parsed !== undefined) {
                appearance = parsed;
                continue;
            }
            residualChildren.push(child);
            continue;
        }
        if (isWordMl2012(child, 'color') && !sawColor) {
            sawColor = true;
            const parsed: { readonly color: Color; readonly themeColor: string; readonly themeTint: string; readonly themeShade: string } =
                parseColorFields(child);
            if (parsed.color !== undefined ||
                parsed.themeColor !== undefined ||
                parsed.themeTint !== undefined ||
                parsed.themeShade !== undefined) {
                color = parsed.color;
                themeColor = parsed.themeColor;
                themeTint = parsed.themeTint;
                themeShade = parsed.themeShade;
                continue;
            }
            residualChildren.push(child);
            continue;
        }
        if (isWordMl2010(child, 'checkbox')) {
            if (!sawKind) {
                sawKind = true;
                type = ContentControlType.CheckBox;
                const cb: {
                    readonly isChecked: boolean;
                    readonly checkedState: ContentControlCheckBoxState;
                    readonly uncheckedState: ContentControlCheckBoxState;
                } = parseCheckboxFields(child);
                isChecked = cb.isChecked;
                checkedState = cb.checkedState;
                uncheckedState = cb.uncheckedState;
                continue;
            }
            residualChildren.push(child);
            continue;
        }
        if (isWmlNamespace(child.namespaceUri) && isWmlTypeLocalName(child.localName)) {
            if (!sawKind) {
                sawKind = true;
                if (NON_AUTHORABLE_KIND_LOCALS.has(child.localName)) {
                    residualChildren.push(child);
                    continue;
                }
                const mapped: ContentControlType = WML_TYPE_LOCAL_TO_TYPE.get(child.localName);
                if (mapped === undefined) {
                    residualChildren.push(child);
                    continue;
                }
                type = mapped;
                if (mapped === 'plainText') {
                    multiline = parseStOnOff(wmlAttribute(child, 'multiLine'));
                }
                else if (mapped === 'date') {
                    const d: {
                        readonly fullDate: string;
                        readonly dateDisplayFormat: string;
                        readonly dateDisplayLocale: LocaleIDs;
                        readonly dateStorageFormat: ContentControlDateStorageFormat;
                        readonly dateCalendarType: CalendarType;
                    } = parseDateFields(child);
                    fullDate = d.fullDate;
                    dateDisplayFormat = d.dateDisplayFormat;
                    dateDisplayLocale = d.dateDisplayLocale;
                    dateStorageFormat = d.dateStorageFormat;
                    dateCalendarType = d.dateCalendarType;
                }
                else if (mapped === 'comboBox' || mapped === 'dropDownList') {
                    const list: { readonly items: ContentControlListItem[]; readonly lastValue: string; } = parseListItems(child);
                    listItems = list.items;
                    lastValue = list.lastValue;
                }
                continue;
            }
            residualChildren.push(child);
            continue;
        }
        residualChildren.push(child);
    }
    return new ContentControlProperties({
        tag,
        title,
        id,
        lock,
        placeholderDocPart,
        dataBinding,
        type,
        temporary,
        appearance,
        color,
        themeColor,
        themeTint,
        themeShade,
        isChecked,
        checkedState,
        uncheckedState,
        fullDate,
        dateDisplayFormat,
        dateDisplayLocale,
        dateStorageFormat,
        dateCalendarType,
        listItems,
        lastValue,
        multiline,
        residualChildren,
        leftoverAttributes: [...sdtPr.attributes],
        namespaceDeclarations: sdtPr.namespaceDeclarations
    });
}
// ── Serialize modeled sdtPr ─────────────────────────────────────────────────
function serializeListItem(item: ContentControlListItem): OpenXmlElement {
    const attributes: OpenXmlAttribute[] = [];
    if (item.displayText !== undefined) {
        attributes.push(wmlAttr('displayText', item.displayText));
    }
    if (item.value !== undefined) {
        attributes.push(wmlAttr('value', item.value));
    }
    return wmlElement('listItem', { attributes });
}
function serializeDateElement(properties: ContentControlProperties): OpenXmlElement {
    const children: OpenXmlElement[] = [];
    if (properties.dateDisplayFormat !== undefined) {
        children.push(wmlElement('dateFormat', { attributes: [wmlAttr('val', properties.dateDisplayFormat)] }));
    }
    if (properties.dateDisplayLocale !== undefined) {
        const bcp47: string = localeIdToBcp47(properties.dateDisplayLocale);
        if (bcp47 !== undefined) {
            children.push(wmlElement('lid', { attributes: [wmlAttr('val', bcp47)] }));
        }
    }
    if (properties.dateStorageFormat !== undefined) {
        children.push(wmlElement('storeMappedDataAs', {
            attributes: [wmlAttr('val', properties.dateStorageFormat)]
        }));
    }
    if (properties.dateCalendarType !== undefined) {
        children.push(wmlElement('calendar', { attributes: [wmlAttr('val', properties.dateCalendarType)] }));
    }
    const attributes: OpenXmlAttribute[] = [];
    if (properties.fullDate !== undefined) {
        attributes.push(wmlAttr('fullDate', properties.fullDate));
    }
    return wmlElement('date', { attributes, children });
}
function serializeCheckboxStateElement(localName: string, state: ContentControlCheckBoxState): OpenXmlElement {
    const attrs: OpenXmlAttribute[] = [];
    if (state.font !== undefined) {
        attrs.push(nsAttr(WORDML_2010_NAMESPACE, W14_PREFIX, 'font', state.font));
    }
    if (state.value !== undefined) {
        attrs.push(nsAttr(WORDML_2010_NAMESPACE, W14_PREFIX, 'val', state.value));
    }
    return nsElement(WORDML_2010_NAMESPACE, W14_PREFIX, localName, { attributes: attrs });
}
function serializeCheckboxElement(properties: ContentControlProperties): OpenXmlElement {
    const children: OpenXmlElement[] = [
        nsElement(WORDML_2010_NAMESPACE, W14_PREFIX, 'checked', {
            attributes: [
                nsAttr(WORDML_2010_NAMESPACE, W14_PREFIX, 'val', properties.isChecked ? '1' : '0')
            ]
        }),
        serializeCheckboxStateElement('checkedState', properties.checkedState),
        serializeCheckboxStateElement('uncheckedState', properties.uncheckedState)
    ];
    return nsElement(WORDML_2010_NAMESPACE, W14_PREFIX, 'checkbox', { children });
}
function serializeTypeElement(properties: ContentControlProperties): OpenXmlElement | undefined {
    const type: ContentControlType = properties.type;
    if (type === undefined) {
        return undefined;
    }
    if (type === 'checkbox') {
        return serializeCheckboxElement(properties);
    }
    if (type === 'date') {
        return serializeDateElement(properties);
    }
    if (type === 'comboBox' || type === 'dropDownList') {
        const localName: string = type === 'comboBox' ? 'comboBox' : 'dropDownList';
        const children: OpenXmlElement[] = properties.contentControlListItems.asReadonly().map(serializeListItem);
        const attributes: OpenXmlAttribute[] = [];
        if (properties.lastValue !== undefined) {
            attributes.push(wmlAttr('lastValue', properties.lastValue));
        }
        return wmlElement(localName, { attributes, children });
    }
    if (type === 'plainText') {
        const attributes: OpenXmlAttribute[] = [];
        if (properties.multiline !== undefined) {
            attributes.push(wmlAttr('multiLine', properties.multiline ? '1' : '0'));
        }
        return wmlElement('text', { attributes });
    }
    const localName: string = TYPE_TO_WML_LOCAL.get(type);
    if (localName === undefined) {
        return undefined;
    }
    return wmlElement(localName);
}
function serializeDataBinding(binding: ContentControlDataBinding): OpenXmlElement {
    const attributes: OpenXmlAttribute[] = [];
    if (binding.prefixMappings !== undefined) {
        attributes.push(wmlAttr('prefixMappings', binding.prefixMappings));
    }
    attributes.push(wmlAttr('xpath', binding.xpath));
    attributes.push(wmlAttr('storeItemID', binding.storeItemID));
    return wmlElement('dataBinding', { attributes });
}
function serializeAppearance(appearance: ContentControlAppearance): OpenXmlElement {
    return nsElement(WORDML_2012_NAMESPACE, W15_PREFIX, 'appearance', {
        attributes: [nsAttr(WORDML_2012_NAMESPACE, W15_PREFIX, 'val', appearance)]
    });
}
function serializeColor(properties: ContentControlProperties): OpenXmlElement | undefined {
    const hex: string = properties.color !== undefined ? colorToHexWire(properties.color) : undefined;
    const themeColor: string = properties.themeColor;
    const themeTint: string = properties.themeTint;
    const themeShade: string = properties.themeShade;
    if (hex === undefined && themeColor === undefined && themeTint === undefined && themeShade === undefined) {
        return undefined;
    }
    const attributes: OpenXmlAttribute[] = [];
    if (hex !== undefined) {
        attributes.push(wmlAttr('val', hex));
    }
    if (themeColor !== undefined) {
        attributes.push(nsAttr(WORDML_2012_NAMESPACE, W15_PREFIX, 'themeColor', themeColor));
    }
    if (themeTint !== undefined) {
        attributes.push(nsAttr(WORDML_2012_NAMESPACE, W15_PREFIX, 'themeTint', themeTint));
    }
    if (themeShade !== undefined) {
        attributes.push(nsAttr(WORDML_2012_NAMESPACE, W15_PREFIX, 'themeShade', themeShade));
    }
    return nsElement(WORDML_2012_NAMESPACE, W15_PREFIX, 'color', { attributes });
}
/**
 * Build `w:sdtPr` from modeled properties + residual.
 *
 * Child order follows Transitional `CT_SdtPr` sequence for WML members, with
 * MS `appearance`/`color` after `temporary` and the kind choice last among
 * modeled members, then residual unknowns.
 *
 * @param {ContentControlProperties} properties - The properties.
 * @returns {OpenXmlElement} The result.
 */
function buildSdtPrFromProperties(properties: ContentControlProperties): OpenXmlElement {
    const children: OpenXmlElement[] = [];
    if (properties.title !== undefined) {
        children.push(wmlElement('alias', { attributes: [wmlAttr('val', properties.title)] }));
    }
    if (properties.tag !== undefined) {
        children.push(wmlElement('tag', { attributes: [wmlAttr('val', properties.tag)] }));
    }
    if (properties.id !== undefined) {
        children.push(wmlElement('id', { attributes: [wmlAttr('val', String(properties.id))] }));
    }
    const lockWire: LockWireValue = properties.lockWire;
    if (lockWire !== undefined) {
        children.push(wmlElement('lock', { attributes: [wmlAttr('val', lockWire)] }));
    }
    if (properties.placeholderDocPart !== undefined) {
        children.push(wmlElement('placeholder', {
            children: [
                wmlElement('docPart', {
                    attributes: [wmlAttr('val', properties.placeholderDocPart)]
                })
            ]
        }));
    }
    if (properties.isTemporary) {
        children.push(serializeOnOffWml('temporary', true));
    }
    if (properties.appearance !== undefined) {
        children.push(serializeAppearance(properties.appearance));
    }
    const colorEl: OpenXmlElement = serializeColor(properties);
    if (colorEl !== undefined) {
        children.push(colorEl);
    }
    if (properties.dataBinding !== undefined) {
        children.push(serializeDataBinding(properties.dataBinding));
    }
    const kindEl: OpenXmlElement = serializeTypeElement(properties);
    if (kindEl !== undefined) {
        children.push(kindEl);
    }
    for (const residual of properties.residualChildren) {
        children.push(residual);
    }
    const namespaceDeclarations: NamespaceDeclaration[] = [...properties.namespaceDeclarations];
    const needW14: boolean = properties.type === 'checkbox' ||
        namespaceDeclarations.some((d: NamespaceDeclaration) => d.namespaceUri === WORDML_2010_NAMESPACE);
    const needW15: boolean = properties.appearance !== undefined ||
        properties.color !== undefined ||
        properties.themeColor !== undefined ||
        namespaceDeclarations.some((d: NamespaceDeclaration) => d.namespaceUri === WORDML_2012_NAMESPACE);
    if (needW14 && !namespaceDeclarations.some((d: NamespaceDeclaration) => d.namespaceUri === WORDML_2010_NAMESPACE)) {
        namespaceDeclarations.push({ prefix: W14_PREFIX, namespaceUri: WORDML_2010_NAMESPACE });
    }
    if (needW15 && !namespaceDeclarations.some((d: NamespaceDeclaration) => d.namespaceUri === WORDML_2012_NAMESPACE)) {
        namespaceDeclarations.push({ prefix: W15_PREFIX, namespaceUri: WORDML_2012_NAMESPACE });
    }
    return wmlElement('sdtPr', {
        attributes: properties.leftoverAttributes,
        namespaceDeclarations,
        children
    });
}
// ── Inline content helpers ──────────────────────────────────────────────────
type ContentControlInlineItem =
    | { readonly type: 'item'; readonly item: ConcreteParagraphItem }
    | { readonly type: 'opaque'; readonly xml: OpenXmlElement }
    | FeatureInlineContent;
const detachedRunOwner: RunOwner = {
    assertAttachedItem(): void {
        return;
    }
};
function parseInlineContent(children: ReadonlyArray<OpenXmlChild>, owner: RunOwner): ContentControlInlineItem[] {
    const inlines: ContentControlInlineItem[] = [];
    for (const child of children) {
        if (child.kind !== 'element') {
            continue;
        }
        const element: OpenXmlElement = child;
        if (isWml(element, 'r')) {
            // Parse the w:r element using parseTextRangeGroup to extract all paragraph items,
            // including feature run leaves like Pictures, breaks, symbols, etc.
            // The owner is undefined here; it will be set when items are attached to the
            // inline content control's collection.
            const groupItems: ConcreteParagraphItem[] = parseTextRangeGroup(element, undefined);
            for (const item of groupItems) {
                inlines.push({ type: 'item', item });
            }
            continue;
        }
        const feature: FeatureInlineContent = tryParseFeatureInline(element);
        if (feature !== undefined) {
            inlines.push(feature);
            continue;
        }
        inlines.push({ type: 'opaque', xml: element });
    }
    return inlines;
}
function serializeInlineContent(inlines: ReadonlyArray<ContentControlInlineItem>): OpenXmlElement[] {
    const out: OpenXmlElement[] = [];
    for (const inline of inlines) {
        if (inline.type === 'item') {
            // Serialize the concrete paragraph item
            const serialized: OpenXmlElement[] = serializeParagraphItems([inline.item]);
            out.push(...serialized);
        }
        else if (inline.type === 'feature') {
            out.push(serializeFeatureInline(inline));
        }
        else {
            out.push(inline.xml);
        }
    }
    return out;
}
function releaseBlockContent(blocks: ReadonlyArray<BlockContent>): void {
    for (const content of blocks) {
        if (content.type === 'feature' && content.value instanceof ContentControl) {
            content.value.releaseContent();
        }
    }
}
function releaseInlineContent(inlines: ReadonlyArray<ContentControlInlineItem>): void {
    for (const inline of inlines) {
        if (inline.type === 'feature' && inline.value instanceof ContentControl) {
            inline.value.releaseContent();
        }
    }
}
// ── ContentControl ───────────────────────────────────────────────────
/**
 * Structured document tag (`w:sdt`) base — shared properties, facades, and
 * serialize hooks for block and inline content controls.
 *
 * Prefer {@link BlockContentControl} / {@link InlineContentControl} for new
 * code. This class remains the shared base and legacy facade surface.
 *
 * @public
 */
export class ContentControl implements FeatureInline, FeatureBlock, ContentControlPropertiesOwner, CharacterFormatHost {
    /**
     * Marks this instance as a block-level body content control when present on the body surface.
     * Satisfies {@link BlockContentControlBodyItem} for direct {@link BodyItem} assignability.
     */
    readonly isBlockLevel?: boolean;
    /**
     * Typed `w:sdtPr` view. Always present after construction for authoring;
     * load path may start without modeled properties until ensureProperties.
     */
    private propertiesValue: ContentControlProperties | undefined;
    /** Raw load-path `sdtPr` when present — preferred for lossless rewrite. */
    private readonly sdtPr: OpenXmlElement | undefined;
    private sdtEndPrRaw: OpenXmlElement | undefined;
    private readonly preservedXml: OpenXmlElement | undefined;
    private documentOwner: WordDocument | undefined;
    /** When true, rebuild `sdtPr` from {@link properties} (author / dirty path). */
    private rebuildSdtPr: boolean;
    /** When true, rebuild `sdtEndPr` from {@link breakCharacterFormat}. */
    private rebuildSdtEndPr: boolean;
    private readonly breakCharacterFormatInstance: CharacterFormat;
    private breakFormatDirty: boolean;

    /**
     * @param {ContentControlProperties | undefined} properties - The properties.
     * @param {OpenXmlElement | undefined} sdtPr - The sdt pr.
     * @param {OpenXmlElement | undefined} sdtEndPr - The sdt end pr.
     * @param {OpenXmlElement | undefined} preservedXml - The preserved xml.
     * @param {boolean} rebuildSdtPr - The rebuild sdt pr.
     * @private
     */
    constructor(
        properties: ContentControlProperties | undefined,
        sdtPr: OpenXmlElement | undefined,
        sdtEndPr: OpenXmlElement | undefined,
        preservedXml: OpenXmlElement | undefined,
        rebuildSdtPr: boolean = false
    ) {
        this.propertiesValue = properties;
        this.sdtPr = sdtPr;
        this.sdtEndPrRaw = sdtEndPr;
        this.preservedXml = preservedXml;
        this.documentOwner = undefined;
        this.rebuildSdtPr = rebuildSdtPr;
        this.rebuildSdtEndPr = false;
        this.breakFormatDirty = false;
        this.breakCharacterFormatInstance = new CharacterFormat(this);
        if (sdtEndPr !== undefined) {
            this.hydrateBreakCharacterFormat(sdtEndPr);
        }
        if (this.propertiesValue !== undefined) {
            this.propertiesValue.bindOwner(this);
        }
    }

    /**
     * Always-defined typed property bag (created on first access when missing).
     *
     * @public
     */
    get contentControlProperties(): ContentControlProperties {
        return this.ensureProperties();
    }

    /**
     * Gets the typed property bag for this content control.
     *
     * @public
     */
    get properties(): ContentControlProperties | undefined {
        return this.propertiesValue;
    }

    /**
     * Character formatting for the SDT end mark (`w:sdtEndPr/w:rPr`).
     *
     * @public
     */
    get breakCharacterFormat(): CharacterFormat {
        return this.breakCharacterFormatInstance;
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    notifyCharacterFormatMutation(): void {
        this.breakFormatDirty = true;
        this.rebuildSdtEndPr = true;
    }

    private hydrateBreakCharacterFormat(sdtEndPr: OpenXmlElement): void {
        for (const child of elementChildren(sdtEndPr)) {
            if (isWml(child, 'rPr')) {
                const snap: CharacterFormatSnapshot = parseCharacterFormat(child);
                this.breakCharacterFormatInstance.hydrate(snap);
                this.breakFormatDirty = false;
                this.rebuildSdtEndPr = false;
                return;
            }
        }
    }

    private serializeSdtEndPr(): OpenXmlElement | undefined {
        if (this.rebuildSdtEndPr || this.breakFormatDirty) {
            const rPrChildren: OpenXmlElement[] = this.breakCharacterFormatInstance.buildRPrChildren();
            if (rPrChildren.length === 0 && this.sdtEndPrRaw === undefined) {
                return undefined;
            }
            return wmlElement('sdtEndPr', {
                children: [wmlElement('rPr', { children: rPrChildren })]
            });
        }
        return this.sdtEndPrRaw;
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     * Prefer modeled rebuild after any user-facing property write.
     */
    markSdtPrDirty(): void {
        this.rebuildSdtPr = true;
    }

    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    synchronizeCheckboxContent(): void {
        return;
    }

    /**
     * Ensure a properties bag exists so facade setters can write fields on
     * controls that loaded without a complete `sdtPr` model.
     *
     * @returns {ContentControlProperties} The result.
     */
    protected ensureProperties(): ContentControlProperties {
        if (this.propertiesValue === undefined) {
            this.propertiesValue = new ContentControlProperties({});
            this.propertiesValue.bindOwner(this);
        }
        return this.propertiesValue;
    }

    /**
     * Gets or sets the friendly display name shown as the content-control title in Word.
     *
     * @public
     */
    get title(): string | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.title;
    }
    set title(value: string | undefined) {
        this.ensureProperties().title = value;
    }

    /**
     * Gets or sets the programmatic tag used to identify this content control in code.
     *
     * @public
     */
    get tag(): string | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.tag;
    }
    set tag(value: string | undefined) {
        this.ensureProperties().tag = value;
    }

    /**
     * Gets or sets whether the content-control definition is locked.
     *
     * @public
     */
    get lockContentControl(): boolean {
        return this.ensureProperties().lockContentControl;
    }
    set lockContentControl(value: boolean) {
        this.ensureProperties().lockContentControl = value;
    }

    /**
     * Gets or sets whether the content inside the control is locked.
     *
     * @public
     */
    get lockContents(): boolean {
        return this.ensureProperties().lockContents;
    }
    set lockContents(value: boolean) {
        this.ensureProperties().lockContents = value;
    }

    /**
     * Gets or sets the placeholder document-part name used when the control shows placeholder content.
     *
     * @public
     */
    get placeholderText(): string | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.placeholderDocPart;
    }
    set placeholderText(value: string | undefined) {
        this.ensureProperties().placeholderDocPart = value;
    }

    /**
     * Gets or sets the content-control kind.
     *
     * @public
     */
    get type(): ContentControlType | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.type;
    }
    set type(value: ContentControlType | undefined) {
        this.ensureProperties().type = value;
    }

    /**
     * Gets or sets whether the control is removed after its contents are edited once.
     *
     * @public
     */
    get isTemporary(): boolean {
        return this.ensureProperties().isTemporary;
    }
    set isTemporary(value: boolean) {
        this.ensureProperties().isTemporary = value;
    }

    /**
     * Gets or sets how the control chrome is shown.
     *
     * @public
     */
    get appearance(): ContentControlAppearance | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.appearance;
    }
    set appearance(value: ContentControlAppearance | undefined) {
        this.ensureProperties().appearance = value;
    }

    /**
     * Gets or sets the border/chrome color for the content control.
     *
     * @public
     */
    get color(): Color | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.color;
    }
    set color(value: Color | undefined) {
        this.ensureProperties().color = value;
    }

    /**
     * Gets or sets whether a checkbox control is checked.
     *
     * @public
     */
    get isChecked(): boolean {
        return this.ensureProperties().isChecked;
    }
    set isChecked(value: boolean) {
        this.ensureProperties().isChecked = value;
    }

    /**
     * Checked-state symbol (stable identity).
     *
     * @public
     */
    get checkedState(): ContentControlCheckBoxState {
        return this.ensureProperties().checkedState;
    }

    /**
     * Unchecked-state symbol (stable identity).
     *
     * @public
     */
    get uncheckedState(): ContentControlCheckBoxState {
        return this.ensureProperties().uncheckedState;
    }

    /**
     * Full date/time stored value.
     *
     * @public
     */
    get fullDate(): string | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.fullDate;
    }
    set fullDate(value: string | undefined) {
        this.ensureProperties().fullDate = value;
    }

    /**
     * Display format pattern for the date.
     *
     * @public
     */
    get dateDisplayFormat(): string | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.dateDisplayFormat;
    }
    set dateDisplayFormat(value: string | undefined) {
        this.ensureProperties().dateDisplayFormat = value;
    }

    /**
     * Locale used for date display.
     *
     * @public
     */
    get dateDisplayLocale(): LocaleIDs | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.dateDisplayLocale;
    }
    set dateDisplayLocale(value: LocaleIDs | undefined) {
        this.ensureProperties().dateDisplayLocale = value;
    }

    /**
     * How mapped date data is stored.
     *
     * @public
     */
    get dateStorageFormat(): ContentControlDateStorageFormat | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.dateStorageFormat;
    }
    set dateStorageFormat(value: ContentControlDateStorageFormat | undefined) {
        this.ensureProperties().dateStorageFormat = value;
    }

    /**
     * Calendar system for the date control.
     *
     * @public
     */
    get dateCalendarType(): CalendarType | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.dateCalendarType;
    }
    set dateCalendarType(value: CalendarType | undefined) {
        this.ensureProperties().dateCalendarType = value;
    }

    /**
     * Combo-box / drop-down list items (stable identity).
     *
     * @public
     */
    get contentControlListItems(): ContentControlListItemCollection {
        return this.ensureProperties().contentControlListItems;
    }

    /**
     * Gets or sets the last selected value for a combo-box or drop-down list control.
     *
     * @public
     */
    get lastValue(): string | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.lastValue;
    }
    set lastValue(value: string | undefined) {
        this.ensureProperties().lastValue = value;
    }

    /**
     * Gets or sets whether a plain-text content control accepts multiple lines of text.
     *
     * @public
     */
    get multiline(): boolean | undefined {
        return this.propertiesValue == null ? undefined : this.propertiesValue.multiline;
    }
    set multiline(value: boolean | undefined) {
        this.ensureProperties().multiline = value;
    }

    /**
     * Compatibility: block children projected as BodyItem[] (block controls only).
     *
     * @public
     */
    get blockContentControl(): ReadonlyArray<BodyItem> | undefined {
        return undefined;
    }

    /**
     * Compatibility: inline bag children (inline controls only).
     *
     * @public
     */
    get inlineContentControl(): ReadonlyArray<ContentControlInlineItem> | undefined {
        return undefined;
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    releaseContent(): void {
        return;
    }

    /**
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     * Bind owning document so nested content can mutate.
     */
    bindDocument(document: WordDocument): void {
        this.documentOwner = document;
    }

    /**
     * @returns {WordDocument} The result.
     * @private
     */
    owningDocument(): WordDocument {
        if (this.documentOwner === undefined) {
            throw new DetachedObjectError('This content control is not bound to a document');
        }
        return this.documentOwner;
    }

    /**
     * @param {OpenXmlElement[]} contentChildren - The content children.
     * @returns {OpenXmlElement} The result.
     * @private
     */
    protected buildSdtShell(contentChildren: OpenXmlElement[]): OpenXmlElement {
        if (this.preservedXml !== undefined) {
            return this.preservedXml;
        }
        const children: OpenXmlElement[] = [];
        if (this.rebuildSdtPr && this.propertiesValue !== undefined) {
            children.push(buildSdtPrFromProperties(this.propertiesValue));
        }
        else if (this.sdtPr !== undefined) {
            children.push(this.sdtPr);
        }
        else if (this.propertiesValue !== undefined) {
            children.push(buildSdtPrFromProperties(this.propertiesValue));
        }
        const endPr: OpenXmlElement = this.serializeSdtEndPr();
        if (endPr !== undefined) {
            children.push(endPr);
        }
        children.push(wmlElement('sdtContent', { children: contentChildren }));
        return wmlElement('sdt', { children });
    }

    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        return this.buildSdtShell([]);
    }
}

/**
 * Block-level structured document tag (`w:sdt` / `CT_SdtBlock`).
 *
 * Owns a nested {@link Body} whose {@link Body.items} are the live DOM for
 * `w:sdtContent` children. Public identity is this instance (BodyItem).
 *
 * @public
 */
export class BlockContentControl extends ContentControl implements BlockContentControlBodyItem, ParagraphOwner {
    readonly isBlockLevel: boolean = true;
    private readonly bodyInstance: Body;

    /**
     * @param {ContentControlProperties | undefined} properties - The properties.
     * @param {OpenXmlElement | undefined} sdtPr - The sdt pr.
     * @param {OpenXmlElement | undefined} sdtEndPr - The sdt end pr.
     * @param {BlockContent[] | undefined} blocks - The blocks.
     * @param {OpenXmlElement | undefined} preservedXml - The preserved xml.
     * @param {boolean} rebuildSdtPr - The rebuild sdt pr.
     * @param {WordDocument} document - The document.
     * @private
     */
    constructor(
        properties: ContentControlProperties | undefined,
        sdtPr: OpenXmlElement | undefined,
        sdtEndPr: OpenXmlElement | undefined,
        blocks: BlockContent[] | undefined,
        preservedXml: OpenXmlElement | undefined,
        rebuildSdtPr: boolean = false,
        document?: WordDocument
    ) {
        super(properties, sdtPr, sdtEndPr, preservedXml, rebuildSdtPr);
        this.bodyInstance = new Body(document, blocks != null ? blocks : []);
        // Nested body paragraphs attach via Body constructor; re-bind CC as owner for assertAttached.
        for (const block of this.bodyInstance.rawBlocks()) {
            if (block.type === 'paragraph') {
                block.paragraph.attach(this);
            }
        }
    }

    /**
     * Nested body for block content-control children (`w:sdtContent`).
     *
     * @public
     */
    get body(): Body {
        return this.bodyInstance;
    }

    /**
     * Projected public children (compat with prior APIs).
     *
     * @public
     */
    get blockContentControl(): ReadonlyArray<BodyItem> {
        const out: BodyItem[] = [];
        for (const block of this.bodyInstance.rawBlocks()) {
            const item: BodyItem = projectBlockToBodyItem(block);
            if (item !== undefined) {
                out.push(item);
            }
        }
        return out;
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    releaseContent(): void {
        releaseBlockContent(this.bodyInstance.rawBlocks());
    }

    /**
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     */
    bindDocument(document: WordDocument): void {
        super.bindDocument(document);
        this.bodyInstance.setOwningDocument(document);
        for (const block of this.bodyInstance.rawBlocks()) {
            if (block.type === 'paragraph') {
                block.paragraph.attach(this);
            }
            if (block.type === 'feature' && block.value instanceof ContentControl) {
                block.value.bindDocument(document);
            }
        }
    }

    /**
     * @param {Paragraph} target - The target.
     * @returns {void} Nothing is returned.
     * @private
     */
    assertAttachedParagraph(target: Paragraph): void {
        let found: boolean = false;
        for (const block of this.bodyInstance.rawBlocks()) {
            if (block.type === 'paragraph' && block.paragraph === target) {
                found = true;
                break;
            }
        }
        if (!found) {
            throw new DetachedObjectError('Paragraph is not in this content control');
        }
    }

    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        return this.buildSdtShell(serializeBodyBlocks(this.bodyInstance.rawBlocks()));
    }
}

/**
 * Inline (run-level) structured document tag (`w:sdt` / `CT_SdtRun`).
 *
 * Owns a {@link ParagraphItemCollection} for `w:sdtContent` children.
 * Projected as a public paragraph item via EntityType unwrap.
 *
 * @public
 */
export class InlineContentControl extends ContentControl implements FeatureInline, ParagraphItemOwner, ParagraphItemCollectionHost {
    /**
     * Discriminator for paragraph-item projection (`projectPublicItem`).
     *
     * @public
     */
    readonly entityType: EntityType.InlineContentControl = EntityType.InlineContentControl;
    private readonly paragraphItemsInstance: ParagraphItemCollection;
    private itemOwner: ParagraphItemOwner | undefined;

    /**
     * @param {ContentControlProperties | undefined} properties - The properties.
     * @param {OpenXmlElement | undefined} sdtPr - The sdt pr.
     * @param {OpenXmlElement | undefined} sdtEndPr - The sdt end pr.
     * @param {ReadonlyArray<ConcreteParagraphItem> | undefined} initialItems - The initial items.
     * @param {OpenXmlElement | undefined} preservedXml - The preserved xml.
     * @param {boolean} rebuildSdtPr - The rebuild sdt pr.
     * @private
     */
    constructor(
        properties: ContentControlProperties | undefined,
        sdtPr: OpenXmlElement | undefined,
        sdtEndPr: OpenXmlElement | undefined,
        initialItems: ReadonlyArray<ConcreteParagraphItem> | undefined,
        preservedXml: OpenXmlElement | undefined,
        rebuildSdtPr: boolean = false
    ) {
        super(properties, sdtPr, sdtEndPr, preservedXml, rebuildSdtPr);
        this.paragraphItemsInstance = new ParagraphItemCollection(this);
        this.itemOwner = undefined;
        if (initialItems !== undefined && initialItems.length > 0) {
            this.paragraphItemsInstance.hydrate(initialItems);
        }
    }

    /**
     * Live paragraph items inside this inline content control.
     *
     * @public
     */
    get paragraphItems(): ParagraphItemCollection {
        return this.paragraphItemsInstance;
    }

    /**
     * Adds a feature-owned run-level item (for example an image/picture) to this inline content control.
     *
     * Feature items like {@link Picture}, {@link FootnoteReference}, {@link EndnoteReference},
     * and {@link OleObject} are wrapped as {@link FeatureRunParagraphItem} for storage in the
     * paragraph items collection.
     *
     * @param {FeatureId} featureId - The feature identifier for this item.
     * @param {FeatureRunLeaf} value - The feature run leaf value (e.g., Picture, FootnoteReference, etc.).
     * @returns {FeatureRunParagraphItem} The feature run paragraph item that was added.
     *
     * @example
     * ```ts
     * const richTextControl = paragraph.appendInlineContentControl(ContentControlType.Picture);
     * const picture = new Picture(document);
     * picture.loadImage(imageBytes);
     * richTextControl.appendFeatureRunItem('images', picture);
     * ```
     *
     * @private
     */
    appendFeatureRunItem(featureId: FeatureId, value: FeatureRunLeaf): FeatureRunParagraphItem {
        const item: FeatureRunParagraphItem = new FeatureRunParagraphItem(featureId, value, new WireRunGroup());
        this.paragraphItemsInstance.add(item);
        return item;
    }

    /**
     * Compatibility bags for legacy tests. Now wraps all items generically.
     *  Internal legacy compatibility; prefer `paragraphItems` instead.
     * @public
     * @private
     */
    get inlineContentControl(): ReadonlyArray<ContentControlInlineItem> {
        const out: ContentControlInlineItem[] = [];
        for (const item of this.paragraphItemsInstance) {
            if (item instanceof TextRange) {
                out.push({ type: 'item', item });
            }
            else if (item instanceof FeatureInlineParagraphItem) {
                out.push({
                    type: 'feature',
                    featureId: item.featureId,
                    value: item.value
                });
            }
            else if (item instanceof OpaqueParagraphItem) {
                out.push({ type: 'opaque', xml: item.xml });
            }
            else if (item instanceof FeatureRunParagraphItem) {
                out.push({
                    type: 'feature',
                    featureId: item.featureId,
                    value: item.value
                });
            }
            else if (typeof (item as { toOpenXml?: () => OpenXmlElement }).toOpenXml === 'function') {
                out.push({ type: 'opaque', xml: (item as unknown as { toOpenXml: () => OpenXmlElement }).toOpenXml() });
            }
        }
        return out;
    }

    /**
     * @private
     */
    get owner(): ParagraphItemOwner | undefined {
        return this.itemOwner;
    }

    /**
     * @param {ParagraphItemOwner} owner - The owner.
     * @returns {void} Nothing is returned.
     * @private
     */
    attach(owner: ParagraphItemOwner): void {
        this.itemOwner = owner;
        this.paragraphItemsInstance.reattachAll();
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    detach(): void {
        this.paragraphItemsInstance.detachAll();
        this.itemOwner = undefined;
    }

    /**
     * @param {ParagraphItem} target - The target.
     * @returns {void} Nothing is returned.
     * @private
     */
    assertAttachedItem(target: ParagraphItem): void {
        if (!this.paragraphItemsInstance.containsIdentity(target as ConcreteParagraphItem)) {
            throw new DetachedObjectError('Paragraph item is not in this content control');
        }
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    assertMutable(): void {
        return;
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    releaseContent(): void {
        for (const item of this.paragraphItemsInstance) {
            if (item instanceof InlineContentControl) {
                item.releaseContent();
            }
            else if (item instanceof FeatureInlineParagraphItem && item.value instanceof ContentControl) {
                item.value.releaseContent();
            }
        }
    }

    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    synchronizeCheckboxContent(): void {
        const properties: ContentControlProperties = this.properties;
        if (properties === undefined || properties.type !== 'checkbox') {
            return;
        }
        const state: ContentControlCheckBoxState = properties.isChecked ? properties.checkedState : properties.uncheckedState;
        const fallback: string = properties.isChecked
            ? DEFAULT_CHECKED_SYMBOL_TEXT
            : DEFAULT_UNCHECKED_SYMBOL_TEXT;
        let symbol: string = fallback;
        if (state.value !== undefined && /^[0-9A-Fa-f]{1,6}$/.test(state.value)) {
            const codePoint: number = Number.parseInt(state.value, 16);
            if (codePoint <= 0x10FFFF) {
                symbol = String.fromCodePoint(codePoint);
            }
        }
        const items: ConcreteParagraphItem[] = [...this.paragraphItemsInstance];
        const first: ConcreteParagraphItem = items.length === 1 ? items[0] : undefined;
        if (first instanceof TextRange) {
            first.text = symbol;
            return;
        }
        if (items.length !== 0) {
            return;
        }
        try {
            const run: TextRange = new TextRange(this.owningDocument());
            run.text = symbol;
            this.paragraphItemsInstance.add(run);
        }
        catch {
            // Initialize later when the detached control is bound to a document.
        }
    }

    /**
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     */
    bindDocument(document: WordDocument): void {
        super.bindDocument(document);
        for (const item of this.paragraphItemsInstance) {
            if (item instanceof ContentControl) {
                item.bindDocument(document);
            }
            else if (item instanceof FeatureInlineParagraphItem && item.value instanceof ContentControl) {
                item.value.bindDocument(document);
            }
        }
        this.synchronizeCheckboxContent();
    }

    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        return this.buildSdtShell(serializeParagraphItems(this.paragraphItemsInstance.snapshot()));
    }
}

function bagsToParagraphItems(inlines: ReadonlyArray<ContentControlInlineItem>): ConcreteParagraphItem[] {
    const items: ConcreteParagraphItem[] = [];
    for (const inline of inlines) {
        if (inline.type === 'item') {
            items.push(inline.item);
            continue;
        }
        if (inline.type === 'feature') {
            items.push(new FeatureInlineParagraphItem(inline.featureId, inline.value));
            continue;
        }
        items.push(new OpaqueParagraphItem(inline.xml));
    }
    return items;
}
function splitSdtChildren(element: OpenXmlElement): {
    readonly sdtPr: OpenXmlElement | undefined;
    readonly sdtEndPr: OpenXmlElement | undefined;
    readonly sdtContent: OpenXmlElement | undefined;
} {
    let sdtPr: OpenXmlElement | undefined;
    let sdtEndPr: OpenXmlElement | undefined;
    let sdtContent: OpenXmlElement | undefined;
    for (const child of elementChildren(element)) {
        if (isWml(child, 'sdtPr')) {
            sdtPr = child;
        }
        else if (isWml(child, 'sdtEndPr')) {
            sdtEndPr = child;
        }
        else if (isWml(child, 'sdtContent')) {
            sdtContent = child;
        }
    }
    return { sdtPr, sdtEndPr, sdtContent };
}
function parseContentControl(element: OpenXmlElement, mode: 'block' | 'inline', ctx: BodyBlockParseContext): ContentControl | undefined {
    if (!isWml(element, 'sdt')) {
        return undefined;
    }
    const { sdtPr, sdtEndPr, sdtContent } = splitSdtChildren(element);
    const properties: ContentControlProperties = parseContentControlProperties(sdtPr);
    if (sdtContent === undefined && sdtPr === undefined && sdtEndPr === undefined) {
        if (mode === 'block') {
            return new BlockContentControl(undefined, undefined, undefined, [], element);
        }
        return new InlineContentControl(undefined, undefined, undefined, [], element);
    }
    if (mode === 'block') {
        const blocks: BlockContent[] = sdtContent !== undefined ? parseBodyBlocks(sdtContent.children, ctx) : [];
        return new BlockContentControl(properties, sdtPr, sdtEndPr, blocks, undefined);
    }
    const inlines: ContentControlInlineItem[] = sdtContent !== undefined ? parseInlineContent(sdtContent.children, detachedRunOwner) : [];
    return new InlineContentControl(properties, sdtPr, sdtEndPr, bagsToParagraphItems(inlines), undefined);
}
function contentControlsFromBlocks(blocks: ReadonlyArray<BlockContent | BodyItem>): ContentControl[] {
    const found: ContentControl[] = [];
    for (const block of blocks) {
        if (block instanceof ContentControl) {
            found.push(block);
            continue;
        }
        if (typeof block === 'object' && block !== null && 'type' in block) {
            const candidate: { type?: unknown; value?: unknown; } = block as { type?: unknown; value?: unknown };
            if (candidate.type === 'feature' && candidate.value instanceof ContentControl) {
                found.push(candidate.value);
            }
        }
    }
    return found;
}
function contentControlsFromInlines(inlines: ReadonlyArray<ParagraphItem>): ContentControl[] {
    const found: ContentControl[] = [];
    for (const inline of inlines) {
        if (inline instanceof InlineContentControl) {
            found.push(inline);
            continue;
        }
        if (inline instanceof FeatureInlineParagraphItem && inline.value instanceof ContentControl) {
            found.push(inline.value);
        }
    }
    return found;
}
// ── Authoring ───────────────────────────────────────────────────────────────
/**
 * Create a detached block-level content control (`w:sdt`) ready for append.
 *
 * @param {ContentControlType} type - The type.
 * @returns {BlockContentControl} The result.
 * @private
 */
export function createBlockContentControl(type?: ContentControlType): BlockContentControl {
    requireAuthorableType(type);
    const properties: ContentControlProperties =
        type !== undefined ? new ContentControlProperties({ type }) : undefined;
    const sdtPr: OpenXmlElement = properties !== undefined ? buildSdtPrFromProperties(properties) : undefined;
    const paragraph: Paragraph = new Paragraph(undefined);
    const sdt: BlockContentControl = new BlockContentControl(
        properties,
        sdtPr,
        undefined,
        [{ type: 'paragraph', paragraph }],
        undefined,
        true
    );
    paragraph.attach(sdt);
    return sdt;
}
/**
 * Create a detached run-level content control (`w:sdt`) ready for append.
 *
 * @param {ContentControlType} type - The type.
 * @returns {InlineContentControl} The result.
 * @private
 */
export function createInlineContentControl(type?: ContentControlType): InlineContentControl {
    requireAuthorableType(type);
    const properties: ContentControlProperties =
        type !== undefined ? new ContentControlProperties({ type }) : undefined;
    const sdtPr: OpenXmlElement = properties !== undefined ? buildSdtPrFromProperties(properties) : undefined;
    return new InlineContentControl(properties, sdtPr, undefined, [], undefined, true);
}
Object.defineProperty(Body.prototype, 'addBlockContentControl', {
    value(this: Body, type: ContentControlType): BlockContentControl {
        const sdt: BlockContentControl = createBlockContentControl(type);
        this.appendRawBlock({ type: 'feature', featureId: CONTENT_CONTROLS, value: sdt });
        sdt.bindDocument(this.owningDocument());
        return sdt;
    },
    writable: true,
    configurable: true
});
Object.defineProperty(WordDocument.prototype, 'addBlockContentControl', {
    value(this: WordDocument, type: ContentControlType): BlockContentControl {
        const body: Body & { addBlockContentControl(type: ContentControlType): BlockContentControl; } = this.firstSectionBody() as Body & {
            addBlockContentControl(type: ContentControlType): BlockContentControl;
        };
        return body.addBlockContentControl(type);
    },
    writable: true,
    configurable: true
});
Object.defineProperty(Paragraph.prototype, 'appendInlineContentControl', {
    value(this: Paragraph, type: ContentControlType): InlineContentControl {
        const sdt: InlineContentControl = createInlineContentControl(type);
        this.appendFeatureInline(CONTENT_CONTROLS, sdt);
        try {
            sdt.bindDocument(this.owningDocument());
        }
        catch {
            // Detached paragraph — bind later when the paragraph attaches.
        }
        return sdt;
    },
    writable: true,
    configurable: true
});
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetContentControlsFeatureForTests(): void {
    registered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register structured document tag handlers. Idempotent.
 */
export function registerContentControlsFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: CONTENT_CONTROLS });
    registerFeatureInlineHandler({
        featureId: CONTENT_CONTROLS,
        wmlLocalName: 'sdt',
        tryParse(element: OpenXmlElement): ContentControl | undefined {
            return parseContentControl(element, 'inline', detachedBodyBlockParseContext());
        }
    });
    registerFeatureBlockHandler({
        featureId: CONTENT_CONTROLS,
        wmlLocalName: 'sdt',
        tryParse(element: OpenXmlElement, ctx: BodyBlockParseContext): ContentControl | undefined {
            return parseContentControl(element, 'block', ctx);
        }
    });
    registerFeatureBlockParagraphWalker({
        featureId: CONTENT_CONTROLS,
        visitParagraphs(block: FeatureBlock, visit: (paragraph: Paragraph) => void): void {
            if (block instanceof BlockContentControl) {
                visitBlocksInDocumentOrder(block.body.rawBlocks(), visit);
            }
        }
    });
    registerBodyItemAdapter({
        project(block: FeatureBodyBlock): BodyItem {
            if (block.featureId === CONTENT_CONTROLS && block.value instanceof ContentControl) {
                return block.value as BodyItem;
            }
            return undefined;
        },
        toBlock(item: BodyItem): { type: 'feature'; featureId: FeatureId; value: ContentControl; } {
            if (item instanceof ContentControl) {
                return { type: 'feature', featureId: CONTENT_CONTROLS, value: item };
            }
            return undefined;
        },
        isInstance(item: unknown): item is BodyItem {
            return item instanceof BlockContentControl || item instanceof ContentControl;
        }
    });
    registerTypedCollectionHooks({
        isBlockContentControl(item: BodyItem): boolean {
            return item instanceof BlockContentControl || (item instanceof ContentControl && item.isBlockLevel === true);
        },
        createBlockContentControl(): BodyItem {
            return createBlockContentControl() as BodyItem;
        }
    });
}

/**
 * Block-level SDTs in a block list, in document order.
 *
 * @param {ReadonlyArray<BlockContent | BodyItem>} blocks - The blocks.
 * @returns {ReadonlyArray<ContentControl>} The result.
 * @private
 */
export function structuredDocumentTagsInBlocks(blocks: ReadonlyArray<BlockContent | BodyItem>): ReadonlyArray<ContentControl> {
    return contentControlsFromBlocks(blocks);
}
/**
 * Run-level SDTs in a paragraph, in document order.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<ContentControl>} The result.
 * @private
 */
export function structuredDocumentTagsInParagraph(paragraph: Paragraph): ReadonlyArray<ContentControl> {
    return contentControlsFromInlines(paragraph.items.toArray());
}
/**
 * Whether inline content is a modeled SDT from this module.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
export function isStructuredDocumentTagInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: ContentControl } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === CONTENT_CONTROLS &&
        inline.value instanceof ContentControl
    );
}
/**
 * Feature id constant for the content-controls module (used by host features
 * that embed SDT blocks, e.g. text box bodies in the drawing module).
 *
 * @private
 */
export const CONTENT_CONTROLS_FEATURE_ID: FeatureId = CONTENT_CONTROLS;
/**
 * Whether a body block is a modeled block-level SDT (`w:sdt`) from this module.
 *
 * Prefer with {@link elementTypeOf} when branching on body children:
 * `elementTypeOf(item) === 'blockContentControl'` then narrow with this guard.
 *
 * @param {BodyItem | BlockContent | unknown} block - Body child to test.
 * @returns {Object} `true` when `block` is a modeled block {@link ContentControl}.
 *
 * @private
 */
export function isBlockContentControl(block: BodyItem | BlockContent | unknown): block is {
    readonly type: 'feature';
    readonly featureId: typeof CONTENT_CONTROLS;
    readonly value: ContentControl;
} {
    if (block instanceof BlockContentControl) {
        return true;
    }
    if (block instanceof ContentControl && block.isBlockLevel === true) {
        return true;
    }
    if (typeof block !== 'object' || block === null) {
        return false;
    }
    const candidate: { type?: unknown; featureId?: unknown; value?: unknown } = block as {
        type?: unknown;
        featureId?: unknown;
        value?: unknown;
    };
    return (candidate.type === 'feature' &&
        candidate.featureId === CONTENT_CONTROLS &&
        candidate.value instanceof ContentControl &&
        (candidate.value instanceof BlockContentControl || candidate.value.isBlockLevel === true));
}

/**
 *  True when `value` is a public block ContentControl body item.
 *
 * @param {unknown} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isBlockContentControlBodyItem(value: unknown): value is ContentControl {
    return value instanceof BlockContentControl || (value instanceof ContentControl && value.isBlockLevel === true);
}
registerAlwaysOnBodyFeatureBootstrap(() => {
    registerContentControlsFeature();
});
registerContentControlsFeature();
