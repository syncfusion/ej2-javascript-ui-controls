/**
 * Ordered `CT_Settings` child graph helpers.
 *
 * Known modeled nodes are first-class; every other child is an opaque shell that
 * round-trips its `OpenXmlElement`. Insert order follows Transitional `wml.xsd`
 * `CT_Settings` sequence (`SETTINGS_CHILD_ORDER`).
 *
 * @private
 */
import { parseOnOff, serializeOnOff } from '../document/on-off';
import { isWml } from '../document/wml';
import { OpenXmlElement } from '../../core/xml/index';
import { AttachedTemplate } from './attached-template';
import { CompatSettings } from './compat-settings';
import { DocumentProtection } from './document-protection';
import { parseDefaultTabStop, serializeDefaultTabStop, parseCharacterSpacingControl, serializeCharacterSpacingControl, CharacterSpacingControl } from './document-settings-values';
import { EndnoteProperties, FootnoteProperties } from './footnote-properties';
import { ZoomSettings } from './zoom';
import { WML_TRANSITIONAL_NAMESPACE } from '../../core/xml/index';
import { wmlAttr, wmlElement } from '../document/wml';
/**
 * `ST_View` wire tokens for `w:view/@w:val` (Transitional `wml.xsd`).
 *
 * @private
 */
export enum DocumentViewType {
    /** No special view preference. */
    None = 'none',
    /** Print layout view. */
    PrintLayout = 'print',
    /** Outline view. */
    Outline = 'outline',
    /** Master pages view. */
    MasterPages = 'masterPages',
    /** Normal / draft view. */
    Normal = 'normal',
    /** Web layout view. */
    Web = 'web',
}
/**
 * Known `ST_View` wire tokens.
 *
 * @private
 */
export type DocumentViewTypeWire = 'none' | 'print' | 'outline' | 'masterPages' | 'normal' | 'web';
function isDocumentViewTypeWire(value: string): value is DocumentViewTypeWire {
    return (value === 'none' ||
        value === 'print' ||
        value === 'outline' ||
        value === 'masterPages' ||
        value === 'normal' ||
        value === 'web');
}
/**
 * @private
 * `CT_Settings` sequence local names (Transitional `wml.xsd`).
 * Used only for insert order when a child is absent.
 */
export const SETTINGS_CHILD_ORDER: ReadonlyArray<string> = [
    'writeProtection',
    'view',
    'zoom',
    'removePersonalInformation',
    'removeDateAndTime',
    'doNotDisplayPageBoundaries',
    'displayBackgroundShape',
    'printPostScriptOverText',
    'printFractionalCharacterWidth',
    'printFormsData',
    'embedTrueTypeFonts',
    'embedSystemFonts',
    'saveSubsetFonts',
    'saveFormsData',
    'mirrorMargins',
    'alignBordersAndEdges',
    'bordersDoNotSurroundHeader',
    'bordersDoNotSurroundFooter',
    'gutterAtTop',
    'hideSpellingErrors',
    'hideGrammaticalErrors',
    'activeWritingStyle',
    'proofState',
    'formsDesign',
    'attachedTemplate',
    'linkStyles',
    'stylePaneFormatFilter',
    'stylePaneSortMethod',
    'documentType',
    'mailMerge',
    'revisionView',
    'trackRevisions',
    'doNotTrackMoves',
    'doNotTrackFormatting',
    'documentProtection',
    'autoFormatOverride',
    'styleLockTheme',
    'styleLockQFSet',
    'defaultTabStop',
    'autoHyphenation',
    'consecutiveHyphenLimit',
    'hyphenationZone',
    'doNotHyphenateCaps',
    'showEnvelope',
    'summaryLength',
    'clickAndTypeStyle',
    'defaultTableStyle',
    'evenAndOddHeaders',
    'bookFoldRevPrinting',
    'bookFoldPrinting',
    'bookFoldPrintingSheets',
    'drawingGridHorizontalSpacing',
    'drawingGridVerticalSpacing',
    'displayHorizontalDrawingGridEvery',
    'displayVerticalDrawingGridEvery',
    'doNotUseMarginsForDrawingGridOrigin',
    'drawingGridHorizontalOrigin',
    'drawingGridVerticalOrigin',
    'doNotShadeFormData',
    'noPunctuationKerning',
    'characterSpacingControl',
    'printTwoOnOne',
    'strictFirstAndLastChars',
    'noLineBreaksAfter',
    'noLineBreaksBefore',
    'savePreviewPicture',
    'doNotValidateAgainstSchema',
    'saveInvalidXml',
    'ignoreMixedContent',
    'alwaysShowPlaceholderText',
    'doNotDemarcateInvalidXml',
    'saveXmlDataOnly',
    'useXSLTWhenSaving',
    'saveThroughXslt',
    'showXMLTags',
    'alwaysMergeEmptyNamespace',
    'updateFields',
    'hdrShapeDefaults',
    'footnotePr',
    'endnotePr',
    'compat',
    'docVars',
    'rsids',
    'mathPr',
    'attachedSchema',
    'themeFontLang',
    'clrSchemeMapping',
    'doNotIncludeSubdocsInStats',
    'doNotAutoCompressPictures',
    'forceUpgrade',
    'captions',
    'readModeInkLockDown',
    'smartTagType',
    'schemaLibrary',
    'shapeDefaults',
    'doNotEmbedSmartTags',
    'decimalSymbol',
    'listSeparator'
];
const MODELED_ON_OFF: Set<string> = new Set(['evenAndOddHeaders', 'trackRevisions', 'displayBackgroundShape']);
/**
 * Modeled `w:view` child (`CT_View`, `w:val` required on wire).
 *
 * Unknown loaded `@w:val` tokens are preserved until an explicit public assignment.
 *
 * @private
 */
export class SettingsViewChild {
    readonly localName: string = 'view';
    /** Known ST_View token, or raw loaded string when unsupported. */
    private value: string;
    constructor(value: string) {
        this.value = value;
    }
    static tryFromElement(element: OpenXmlElement): SettingsViewChild | undefined {
        if (!isWml(element, 'view')) {
            return undefined;
        }
        let val: string | undefined;
        for (const attr of element.attributes) {
            if (attr.localName === 'val' &&
                (attr.namespaceUri === WML_TRANSITIONAL_NAMESPACE || attr.namespaceUri === '')) {
                val = attr.value;
                break;
            }
        }
        // CT_View requires @w:val; absent val is not a modeled view child.
        if (val === undefined) {
            return undefined;
        }
        return new SettingsViewChild(val);
    }
    read(): string {
        return this.value;
    }
    write(value: string): void {
        this.value = value;
    }
    /**
     * Public enum when the stored token is a known ST_View value; otherwise undefined
     * (unsupported token preserved until explicit assignment).
     *
     * @returns {DocumentViewType | undefined} The result.
     */
    asDocumentViewType(): DocumentViewType | undefined {
        if (!isDocumentViewTypeWire(this.value)) {
            return undefined;
        }
        switch (this.value) {
        case 'none':
            return DocumentViewType.None;
        case 'print':
            return DocumentViewType.PrintLayout;
        case 'outline':
            return DocumentViewType.Outline;
        case 'masterPages':
            return DocumentViewType.MasterPages;
        case 'normal':
            return DocumentViewType.Normal;
        case 'web':
            return DocumentViewType.Web;
        default:
            return undefined;
        }
    }
    serialize(): OpenXmlElement {
        return wmlElement('view', { attributes: [wmlAttr('val', this.value)] });
    }
}
/** Modeled `w:zoom` child (`CT_Zoom`). */
export class SettingsZoomChild {
    readonly localName: string = 'zoom';
    private node: ZoomSettings;
    constructor(node: ZoomSettings) {
        this.node = node;
    }
    static tryFromElement(element: OpenXmlElement): SettingsZoomChild | undefined {
        if (!isWml(element, 'zoom'))
        { return undefined; }
        return new SettingsZoomChild(ZoomSettings.fromElement(element));
    }
    zoom(): ZoomSettings {
        return this.node;
    }
    setZoom(node: ZoomSettings): void {
        this.node = node;
    }
    serialize(): OpenXmlElement {
        return this.node.serialize();
    }
}
/** Modeled `w:defaultTabStop` child (`CT_TwipsMeasure` on wire; value stored in plain points). */
export class SettingsDefaultTabStopChild {
    readonly localName: string = 'defaultTabStop';
    /** Plain points (wire unit is twips). */
    private value: number;
    constructor(value: number) {
        this.value = value;
    }
    static tryFromElement(element: OpenXmlElement): SettingsDefaultTabStopChild | undefined {
        if (!isWml(element, 'defaultTabStop'))
        { return undefined; }
        const v: number = parseDefaultTabStop(element);
        if (v === undefined)
        { return undefined; }
        return new SettingsDefaultTabStopChild(v);
    }
    read(): number {
        return this.value;
    }
    write(value: number): void {
        this.value = value;
    }
    serialize(): OpenXmlElement {
        return serializeDefaultTabStop(this.value);
    }
}
/** Modeled `w:characterSpacingControl` child (`ST_CharacterSpacing`). */
export class SettingsCharacterSpacingControlChild {
    readonly localName: string = 'characterSpacingControl';
    private value: CharacterSpacingControl;
    constructor(value: CharacterSpacingControl) {
        this.value = value;
    }
    static tryFromElement(element: OpenXmlElement): SettingsCharacterSpacingControlChild | undefined {
        if (!isWml(element, 'characterSpacingControl'))
        { return undefined; }
        const v: CharacterSpacingControl = parseCharacterSpacingControl(element);
        if (v === undefined)
        { return undefined; }
        return new SettingsCharacterSpacingControlChild(v);
    }
    read(): CharacterSpacingControl {
        return this.value;
    }
    write(value: CharacterSpacingControl): void {
        this.value = value;
    }
    serialize(): OpenXmlElement {
        return serializeCharacterSpacingControl(this.value);
    }
}
/** Opaque-backed shell for unmodeled / unknown `CT_Settings` children. */
export class SettingsOpaqueChild {
    readonly localName: string;
    private readonly element: OpenXmlElement;
    constructor(element: OpenXmlElement) {
        this.localName = element.localName;
        this.element = element;
    }
    serialize(): OpenXmlElement {
        return this.element;
    }
}
/** Modeled `CT_OnOff` settings child (MVP: evenAndOdd / trackRevisions / displayBackgroundShape). */
export class SettingsOnOffChild {
    readonly localName: string;
    private value: boolean;
    constructor(localName: string, value: boolean) {
        this.localName = localName;
        this.value = value;
    }
    static tryFromElement(element: OpenXmlElement): SettingsOnOffChild | undefined {
        if (!MODELED_ON_OFF.has(element.localName) || !isWml(element, element.localName)) {
            return undefined;
        }
        const parsed: boolean = parseOnOff(element);
        if (parsed === undefined) {
            return undefined;
        }
        return new SettingsOnOffChild(element.localName, parsed);
    }
    read(): boolean {
        return this.value;
    }
    write(value: boolean): void {
        this.value = value;
    }
    serialize(): OpenXmlElement {
        return serializeOnOff(this.localName, this.value);
    }
}
/** Modeled documentProtection wrapper in the ordered graph. */
export class SettingsDocumentProtectionChild {
    readonly localName: string = 'documentProtection';
    private node: DocumentProtection;
    constructor(node: DocumentProtection) {
        this.node = node;
    }
    protection(): DocumentProtection {
        return this.node;
    }
    setProtection(node: DocumentProtection): void {
        this.node = node;
    }
    serialize(): OpenXmlElement {
        return this.node.serialize();
    }
}
/** Modeled attachedTemplate wrapper. */
export class SettingsAttachedTemplateChild {
    readonly localName: string = 'attachedTemplate';
    private readonly node: AttachedTemplate;
    constructor(node: AttachedTemplate) {
        this.node = node;
    }
    template(): AttachedTemplate {
        return this.node;
    }
    serialize(): OpenXmlElement {
        return this.node.serialize();
    }
}
/** Modeled compat wrapper. */
export class SettingsCompatChild {
    readonly localName: string = 'compat';
    private readonly node: CompatSettings;
    constructor(node: CompatSettings) {
        this.node = node;
    }
    compat(): CompatSettings {
        return this.node;
    }
    serialize(): OpenXmlElement {
        return this.node.serialize();
    }
}
/** Modeled footnotePr wrapper. */
export class SettingsFootnotePrChild {
    readonly localName: string = 'footnotePr';
    private readonly node: FootnoteProperties;
    constructor(node: FootnoteProperties) {
        this.node = node;
    }
    props(): FootnoteProperties {
        return this.node;
    }
    serialize(): OpenXmlElement {
        return this.node.serialize();
    }
}
/** Modeled endnotePr wrapper. */
export class SettingsEndnotePrChild {
    readonly localName: string = 'endnotePr';
    private readonly node: EndnoteProperties;
    constructor(node: EndnoteProperties) {
        this.node = node;
    }
    props(): EndnoteProperties {
        return this.node;
    }
    serialize(): OpenXmlElement {
        return this.node.serialize();
    }
}
/**
 * @private
 */
export type SettingsChild =
    | SettingsOnOffChild
    | SettingsViewChild
    | SettingsZoomChild
    | SettingsDefaultTabStopChild
    | SettingsCharacterSpacingControlChild
    | SettingsDocumentProtectionChild
    | SettingsAttachedTemplateChild
    | SettingsCompatChild
    | SettingsFootnotePrChild
    | SettingsEndnotePrChild
    | SettingsOpaqueChild;
export function parseSettingsChild(element: OpenXmlElement): SettingsChild {
    if (isWml(element, 'documentProtection')) {
        return new SettingsDocumentProtectionChild(DocumentProtection.fromElement(element));
    }
    if (isWml(element, 'attachedTemplate')) {
        return new SettingsAttachedTemplateChild(AttachedTemplate.fromElement(element));
    }
    if (isWml(element, 'compat')) {
        return new SettingsCompatChild(CompatSettings.fromElement(element));
    }
    if (isWml(element, 'footnotePr')) {
        return new SettingsFootnotePrChild(FootnoteProperties.fromElement(element));
    }
    if (isWml(element, 'endnotePr')) {
        return new SettingsEndnotePrChild(EndnoteProperties.fromElement(element));
    }
    const view: SettingsViewChild = SettingsViewChild.tryFromElement(element);
    if (view !== undefined) {
        return view;
    }
    const zoom: SettingsZoomChild = SettingsZoomChild.tryFromElement(element);
    if (zoom !== undefined)
    { return zoom; }
    const tabStop: SettingsDefaultTabStopChild = SettingsDefaultTabStopChild.tryFromElement(element);
    if (tabStop !== undefined)
    { return tabStop; }
    const csc: SettingsCharacterSpacingControlChild = SettingsCharacterSpacingControlChild.tryFromElement(element);
    if (csc !== undefined)
    { return csc; }
    const onOff: SettingsOnOffChild = SettingsOnOffChild.tryFromElement(element);
    if (onOff !== undefined) {
        return onOff;
    }
    return new SettingsOpaqueChild(element);
}
export function childLocalName(child: SettingsChild): string {
    return child.localName;
}
export function findChildIndex(children: ReadonlyArray<SettingsChild>, localName: string): number {
    return children.findIndex((child: SettingsChild) => child.localName === localName);
}
export function replaceOrInsertChild(children: SettingsChild[], localName: string, next: SettingsChild | undefined): void {
    const existing: number = findChildIndex(children, localName);
    if (next === undefined) {
        if (existing >= 0) {
            children.splice(existing, 1);
        }
        return;
    }
    if (existing >= 0) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        children[existing] = next;
        return;
    }
    const orderIndex: number = SETTINGS_CHILD_ORDER.indexOf(localName);
    let insertAt: number = children.length;
    for (const [index, child] of children.entries()) {
        if (child === undefined) {
            continue;
        }
        const other: number = SETTINGS_CHILD_ORDER.indexOf(child.localName);
        if (other >= 0 && (orderIndex < 0 || other > orderIndex)) {
            insertAt = index;
            break;
        }
    }
    children.splice(insertAt, 0, next);
}
export function serializeSettingsChildren(children: ReadonlyArray<SettingsChild>): OpenXmlElement[] {
    return children.map((child: SettingsChild) => child.serialize());
}
