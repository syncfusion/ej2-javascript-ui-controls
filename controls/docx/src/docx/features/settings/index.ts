export * from './attached-template';
export * from './compat-settings';
export * from './document-background';
export * from './document-protection';
export * from './document-settings-facades';
export * from './document-settings-values';
export * from './footnote-properties';
export * from './settings-children';
export * from './web-settings';
export * from './zoom';
/**
 * WordDocument Settings feature (`word/settings.xml`).
 *
 * Load builds a typed child graph (`SettingsPart` → modeled/opaque nodes);
 * dirty serialize emits only from that graph (not a flat element bag dump).
 *
 * @public
 */
import { arrayItem } from '../../core/compat/array-compat';
import { DocxError } from '../../core/errors/docx-error';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeaturePackagePart } from '../document/feature-package-part';
import { elementChildren, isWml, wmlElement } from '../document/wml';
import { partName, resolveInternalTarget, PartName } from '../../core/opc/part-name';
import { officeDocumentPartName, relationshipsForPart, OpcPackage, PackagePart } from '../../core/opc/package';
import { TargetMode } from '../../core/opc/relationships';
import { featureId, registerFeature, registerFeaturePartHandler, registerFeatureMaterializeHandler } from '../../core/registry/index';
import { FeaturePartLoadContext } from '../../core/registry/part-handlers';
import { parseXml, serializeXml, WML_TRANSITIONAL_NAMESPACE, OpenXmlAttribute, NamespaceDeclaration } from '../../core/xml/index';
import { AttachedTemplate } from './attached-template';
import { CompatSettings } from './compat-settings';
import { DocumentProtection, DocumentProtectionFlags } from './document-protection';
import { createBackground, Background } from './document-background';
import { EndnoteProperties, FootnoteProperties } from './footnote-properties';
import { MathSettings, mathSettingsToOpenXml, parseMathSettings } from '@syncfusion/ej2-office-common';
import { findChildIndex, parseSettingsChild, replaceOrInsertChild, serializeSettingsChildren, SettingsAttachedTemplateChild, SettingsCompatChild, SettingsDefaultTabStopChild, SettingsDocumentProtectionChild, SettingsCharacterSpacingControlChild, SettingsEndnotePrChild, SettingsFootnotePrChild, SettingsOnOffChild, SettingsOpaqueChild, SettingsViewChild, SettingsZoomChild, SettingsChild, DocumentViewType } from './settings-children';
import { registerWebSettingsFeature, resetWebSettingsFeatureForTests } from './web-settings';
import { ZoomSettings } from './zoom';
import { CharacterSpacingControl } from './document-settings-values';
import { CompatibilityMode } from './compat-settings';
/**
 * @private
 */
/**
 * @private
 */
/**
 * @private
 */
/**
 * @private
 */
import { bindDocumentSettingsFacades, registerDocumentSettingsFacades } from './document-settings-facades';
import { FeatureId } from '../../core/registry/feature-registry';
import { OpenXmlElement } from '../../core/xml/model';
const SETTINGS: FeatureId = featureId('settings');
/**
 * @private
 * Transitional settings relationship (ECMA-376-4 §9.2.3). */
export const SETTINGS_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings';
/**
 * @private
 * Strict settings relationship (ECMA-376-1 §11.3.3). */
export const STRICT_SETTINGS_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/settings';
/**
 * @private
 * ECMA-376-1 §11.3.3 WordDocument Settings content type. */
export const SETTINGS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml';
/**
 * @private
 * Transitional attached-template relationship (ECMA-376-4 §14.12.22). */
export const ATTACHED_TEMPLATE_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/attachedTemplate';
/**
 * @private
 * Strict attached-template relationship (ECMA-376-1 §11.4). */
export const STRICT_ATTACHED_TEMPLATE_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/attachedTemplate';
const ATTACHED_TEMPLATE_RELATIONSHIP_TYPES: string[] = [
    ATTACHED_TEMPLATE_RELATIONSHIP_TYPE,
    STRICT_ATTACHED_TEMPLATE_RELATIONSHIP_TYPE
];
/**
 * @private
 */
export const SETTINGS_PART_NAME: PartName = partName('/word/settings.xml');
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
const utf8: TextEncoder = new TextEncoder();
function resolveSettingsPartName(pkg: OpcPackage): PartName | undefined {
    const main: PartName = officeDocumentPartName(pkg);
    for (const rel of relationshipsForPart(pkg, main).items) {
        if (rel.type !== SETTINGS_RELATIONSHIP_TYPE &&
            rel.type !== STRICT_SETTINGS_RELATIONSHIP_TYPE) {
            continue;
        }
        return resolveInternalTarget(rel.target, main);
    }
    return undefined;
}
function resolveAttachedTemplateTarget(pkg: OpcPackage, settingsPartName: PartName, relationshipId: string): string | undefined {
    for (const rel of relationshipsForPart(pkg, settingsPartName).items) {
        if (rel.id !== relationshipId) {
            continue;
        }
        if (ATTACHED_TEMPLATE_RELATIONSHIP_TYPES.indexOf(rel.type as (typeof ATTACHED_TEMPLATE_RELATIONSHIP_TYPES)[number]) === -1) {
            return undefined;
        }
        if (rel.targetMode === TargetMode.External) {
            return rel.target;
        }
        return resolveInternalTarget(rel.target, settingsPartName);
    }
    return undefined;
}
/**
 * In-memory WordDocument Settings part (`word/settings.xml`).
 *
 * Children are a typed ordered graph: modeled OnOff / protection / attachedTemplate /
 * compat nodes plus opaque shells for the rest of `CT_Settings`.
 *
 * @private
 */
export class SettingsPart implements FeaturePackagePart {
    private readonly rootAttributes: ReadonlyArray<OpenXmlAttribute>;
    private readonly rootNamespaceDeclarations: ReadonlyArray<NamespaceDeclaration>;
    private readonly children: SettingsChild[];
    private dirty: boolean;
    /**
     * @param {ReadonlyArray<OpenXmlAttribute>} rootAttributes - The root attributes.
     * @param {ReadonlyArray<NamespaceDeclaration>} rootNamespaceDeclarations - The root namespace declarations.
     * @param {SettingsChild[]} children - The children.
     * @param {boolean} dirty - The dirty.
     * @private
     */
    constructor(
        rootAttributes: ReadonlyArray<OpenXmlAttribute>,
        rootNamespaceDeclarations: ReadonlyArray<NamespaceDeclaration>,
        children: SettingsChild[],
        dirty: boolean
    ) {
        this.rootAttributes = rootAttributes;
        this.rootNamespaceDeclarations = rootNamespaceDeclarations;
        this.children = children;
        this.dirty = dirty;
    }
    private findOnOff(localName: string): SettingsOnOffChild | undefined {
        const index: number = findChildIndex(this.children, localName);
        if (index < 0) {
            return undefined;
        }
        const child: SettingsChild = arrayItem(this.children, index);
        return child instanceof SettingsOnOffChild ? child : undefined;
    }
    private setOnOff(localName: string, value: boolean | undefined): void {
        replaceOrInsertChild(this.children, localName, value === undefined ? undefined : new SettingsOnOffChild(localName, value));
        this.dirty = true;
    }
    /**
     * `w:evenAndOddHeaders` as a boolean, or `undefined` when the element is absent.
     *
     * @returns {boolean | undefined} The result.
     * @public
     */
    evenAndOddHeaders(): boolean | undefined {
        const child: SettingsOnOffChild = this.findOnOff('evenAndOddHeaders');
        return child === undefined ? undefined : child.read();
    }
    /**
     * Set or clear `w:evenAndOddHeaders`. `undefined` removes the element.
     *
     * @param {boolean | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @public
     */
    setEvenAndOddHeaders(value: boolean | undefined): void {
        this.setOnOff('evenAndOddHeaders', value);
    }
    /**
     * `w:trackRevisions` as a boolean, or `undefined` when the element is absent.
     *
     * @returns {boolean | undefined} The result.
     * @public
     */
    trackRevisions(): boolean | undefined {
        const child: SettingsOnOffChild = this.findOnOff('trackRevisions');
        return child === undefined ? undefined : child.read();
    }
    /**
     * Set or clear `w:trackRevisions`. `undefined` removes the element.
     *
     * @param {boolean | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @public
     */
    setTrackRevisions(value: boolean | undefined): void {
        this.setOnOff('trackRevisions', value);
    }
    /**
     * Modeled `w:documentProtection` flags snapshot. Password/hash attributes are omitted.
     *
     * Prefer {@link documentProtectionNode} when the typed class is needed.
     *
     * @returns {DocumentProtectionFlags | undefined} The result.
     * @public
     */
    documentProtection(): DocumentProtectionFlags | undefined {
        const node: DocumentProtection = this.documentProtectionNode();
        return node === undefined ? undefined : node.flags();
    }
    /**
     * First-class `w:documentProtection` node, or `undefined` when absent.
     *
     * @returns {DocumentProtection | undefined} The result.
     * @public
     */
    documentProtectionNode(): DocumentProtection | undefined {
        const index: number = findChildIndex(this.children, 'documentProtection');
        if (index < 0) {
            return undefined;
        }
        const child: SettingsChild = arrayItem(this.children, index);
        return child instanceof SettingsDocumentProtectionChild ? child.protection() : undefined;
    }
    /**
     * Replace or remove `w:documentProtection`. Clearing the element also drops preserved
     * password/hash attributes. Flag-only updates keep leftover attributes on the existing node.
     *
     * @param {DocumentProtectionFlags | undefined} flags - The flags.
     * @returns {void} Nothing is returned.
     * @public
     */
    setDocumentProtection(flags: DocumentProtectionFlags | undefined): void {
        if (flags === undefined) {
            replaceOrInsertChild(this.children, 'documentProtection', undefined);
            this.dirty = true;
            return;
        }
        const existing: DocumentProtection = this.documentProtectionNode();
        if (existing !== undefined) {
            existing.applyFlags(flags);
            this.dirty = true;
            return;
        }
        replaceOrInsertChild(this.children, 'documentProtection', new SettingsDocumentProtectionChild(DocumentProtection.fromFlags(flags)));
        this.dirty = true;
    }
    /**
     * Whether `w:attachedTemplate` is present in settings.
     *
     * @returns {boolean} The result.
     * @public
     */
    hasAttachedTemplate(): boolean {
        return this.attachedTemplate() !== undefined;
    }
    /**
     * First-class `w:attachedTemplate` node, or `undefined` when absent.
     *
     * @returns {AttachedTemplate | undefined} The result.
     * @public
     */
    attachedTemplate(): AttachedTemplate | undefined {
        const index: number = findChildIndex(this.children, 'attachedTemplate');
        if (index < 0) {
            return undefined;
        }
        const child: SettingsChild = arrayItem(this.children, index);
        return child instanceof SettingsAttachedTemplateChild ? child.template() : undefined;
    }
    /**
     * `r:id` on `w:attachedTemplate`, or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    attachedTemplateRelationshipId(): string | undefined {
        const template: AttachedTemplate = this.attachedTemplate();
        return template === undefined ? undefined : template.id();
    }
    /**
     * First-class `w:compat` node, or `undefined` when absent.
     *
     * Mutations on the returned node (for example {@link CompatSettings.setNoColumnBalance})
     * mark the settings part dirty.
     *
     * @returns {CompatSettings | undefined} The result.
     * @public
     */
    compat(): CompatSettings | undefined {
        const index: number = findChildIndex(this.children, 'compat');
        if (index < 0) {
            return undefined;
        }
        const child: SettingsChild = arrayItem(this.children, index);
        if (!(child instanceof SettingsCompatChild)) {
            return undefined;
        }
        const compat: CompatSettings = child.compat();
        compat.bindDirty(() => {
            this.dirty = true;
        });
        return compat;
    }
    /**
     * Ensure a `w:compat` node exists and return it.
     *
     * @returns {CompatSettings} The result.
     * @private
     */
    ensureCompat(): CompatSettings {
        const existing: CompatSettings = this.compat();
        if (existing !== undefined) {
            return existing;
        }
        const created: CompatSettings = CompatSettings.createEmpty(() => {
            this.dirty = true;
        });
        replaceOrInsertChild(this.children, 'compat', new SettingsCompatChild(created));
        this.dirty = true;
        return created;
    }
    /**
     * Names from `w:compat/w:compatSetting/@w:name`, in document order.
     *
     * @returns {ReadonlyArray<string>} The result.
     * @public
     */
    compatSettingNames(): ReadonlyArray<string> {
        const compat: CompatSettings = this.compat();
        return compat === undefined ? [] : compat.settingNames();
    }
    /**
     * Count of `w:compatSetting` children under `w:compat`.
     *
     * @returns {number} The result.
     * @public
     */
    compatSettingCount(): number {
        const compat: CompatSettings = this.compat();
        return compat === undefined ? 0 : compat.settingCount();
    }
    /**
     * `w:displayBackgroundShape` as a boolean, or `undefined` when the element is absent.
     *
     * @returns {boolean | undefined} The result.
     * @public
     */
    displayBackgroundShape(): boolean | undefined {
        const child: SettingsOnOffChild = this.findOnOff('displayBackgroundShape');
        return child === undefined ? undefined : child.read();
    }
    /**
     * Set or clear `w:displayBackgroundShape`. `undefined` removes the element.
     *
     * @param {boolean | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setDisplayBackgroundShape(value: boolean | undefined): void {
        this.setOnOff('displayBackgroundShape', value);
    }
    // ── View ────────────────────────────────────────────────────────────────────
    /**
     * First-class `w:view` child, or `undefined` when absent.
     *
     * @returns {SettingsViewChild | undefined} The result.
     * @private
     */
    view(): SettingsViewChild | undefined {
        const index: number = findChildIndex(this.children, 'view');
        if (index < 0) {
            return undefined;
        }
        const child: SettingsChild = arrayItem(this.children, index);
        return child instanceof SettingsViewChild ? child : undefined;
    }
    /**
     * Set or clear `w:view`. `undefined` removes the element.
     *
     * Accepts a known {@link DocumentViewType}, wire string, or modeled child.
     *
     * @param {DocumentViewType | string | SettingsViewChild | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setView(value: DocumentViewType | string | SettingsViewChild | undefined): void {
        if (value === undefined) {
            replaceOrInsertChild(this.children, 'view', undefined);
            this.dirty = true;
            return;
        }
        if (value instanceof SettingsViewChild) {
            replaceOrInsertChild(this.children, 'view', value);
            this.dirty = true;
            return;
        }
        const wire: string = typeof value === 'string' ? value : value;
        replaceOrInsertChild(this.children, 'view', new SettingsViewChild(wire));
        this.dirty = true;
    }
    // ── Zoom ────────────────────────────────────────────────────────────────────
    /**
     * First-class `w:zoom` node, or `undefined` when absent.
     *
     * @returns {ZoomSettings | undefined} The result.
     * @public
     */
    zoom(): ZoomSettings | undefined {
        const index: number = findChildIndex(this.children, 'zoom');
        if (index < 0)
        { return undefined; }
        const child: SettingsChild = arrayItem(this.children, index);
        return child instanceof SettingsZoomChild ? child.zoom() : undefined;
    }
    /**
     * Set `w:zoom` from a {@link ZoomSettings} instance, or remove it when `undefined`.
     *
     * @param {ZoomSettings | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @public
     */
    setZoom(value: ZoomSettings | undefined): void {
        replaceOrInsertChild(this.children, 'zoom', value === undefined ? undefined : new SettingsZoomChild(value));
        this.dirty = true;
    }
    // ── Footnote / endnote properties (document-level) ──────────────────────────
    /**
     * First-class `w:footnotePr` node, or `undefined` when absent.
     *
     * Mutations on the returned node mark the settings part dirty.
     *
     * @returns {FootnoteProperties | undefined} The result.
     * @public
     */
    footnoteProperties(): FootnoteProperties | undefined {
        const index: number = findChildIndex(this.children, 'footnotePr');
        if (index < 0) {
            return undefined;
        }
        const child: SettingsChild = arrayItem(this.children, index);
        if (!(child instanceof SettingsFootnotePrChild)) {
            return undefined;
        }
        const props: FootnoteProperties = child.props();
        props.bindDirty(() => {
            this.dirty = true;
        });
        return props;
    }
    /**
     * Ensure a `w:footnotePr` node exists and return it.
     *
     * @returns {FootnoteProperties} The result.
     * @public
     */
    ensureFootnoteProperties(): FootnoteProperties {
        const existing: FootnoteProperties = this.footnoteProperties();
        if (existing !== undefined) {
            return existing;
        }
        const props: FootnoteProperties = FootnoteProperties.create();
        props.bindDirty(() => {
            this.dirty = true;
        });
        replaceOrInsertChild(this.children, 'footnotePr', new SettingsFootnotePrChild(props));
        this.dirty = true;
        return props;
    }
    /**
     * Replace or clear `w:footnotePr`. `undefined` removes the element.
     *
     * @param {FootnoteProperties | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @public
     */
    setFootnoteProperties(value: FootnoteProperties | undefined): void {
        if (value === undefined) {
            replaceOrInsertChild(this.children, 'footnotePr', undefined);
            this.dirty = true;
            return;
        }
        value.bindDirty(() => {
            this.dirty = true;
        });
        replaceOrInsertChild(this.children, 'footnotePr', new SettingsFootnotePrChild(value));
        this.dirty = true;
    }
    /**
     * First-class `w:endnotePr` node, or `undefined` when absent.
     *
     * Mutations on the returned node mark the settings part dirty.
     *
     * @returns {EndnoteProperties | undefined} The result.
     * @public
     */
    endnoteProperties(): EndnoteProperties | undefined {
        const index: number = findChildIndex(this.children, 'endnotePr');
        if (index < 0) {
            return undefined;
        }
        const child: SettingsChild = arrayItem(this.children, index);
        if (!(child instanceof SettingsEndnotePrChild)) {
            return undefined;
        }
        const props: EndnoteProperties = child.props();
        props.bindDirty(() => {
            this.dirty = true;
        });
        return props;
    }
    /**
     * Ensure a `w:endnotePr` node exists and return it.
     *
     * @returns {EndnoteProperties} The result.
     * @public
     */
    ensureEndnoteProperties(): EndnoteProperties {
        const existing: EndnoteProperties = this.endnoteProperties();
        if (existing !== undefined) {
            return existing;
        }
        const props: EndnoteProperties = EndnoteProperties.create();
        props.bindDirty(() => {
            this.dirty = true;
        });
        replaceOrInsertChild(this.children, 'endnotePr', new SettingsEndnotePrChild(props));
        this.dirty = true;
        return props;
    }
    /**
     * Replace or clear `w:endnotePr`. `undefined` removes the element.
     *
     * @param {EndnoteProperties | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @public
     */
    setEndnoteProperties(value: EndnoteProperties | undefined): void {
        if (value === undefined) {
            replaceOrInsertChild(this.children, 'endnotePr', undefined);
            this.dirty = true;
            return;
        }
        value.bindDirty(() => {
            this.dirty = true;
        });
        replaceOrInsertChild(this.children, 'endnotePr', new SettingsEndnotePrChild(value));
        this.dirty = true;
    }
    // ── Default tab stop ────────────────────────────────────────────────────────
    /**
     * `w:defaultTabStop/@w:val` in plain points, or `undefined` when the element is absent.
     * Wire unit is twips (`ST_TwipsMeasure`); conversion is at the parse/serialize boundary.
     *
     * The default value in Word is half an inch (`720` twips → `36` points).
     *
     * @returns {number | undefined} The result.
     * @public
     */
    defaultTabStop(): number | undefined {
        const index: number = findChildIndex(this.children, 'defaultTabStop');
        if (index < 0)
        { return undefined; }
        const child: SettingsChild = arrayItem(this.children, index);
        return child instanceof SettingsDefaultTabStopChild ? child.read() : undefined;
    }
    /**
     * Set or clear `w:defaultTabStop`. `undefined` removes the element.
     *
     * @param {number | undefined} value - Plain points (e.g. `36` = 0.5 inch). Serialized as twips on the wire.
     *
     * @returns {void} Nothing is returned.
     * @public
     */
    setDefaultTabStop(value: number | undefined): void {
        replaceOrInsertChild(this.children, 'defaultTabStop', value === undefined ? undefined : new SettingsDefaultTabStopChild(value));
        this.dirty = true;
    }
    // ── Character spacing control ───────────────────────────────────────────────
    /**
     * `w:characterSpacingControl/@w:val`, or `undefined` when the element is absent.
     *
     * @returns {CharacterSpacingControl | undefined} The result.
     * @public
     */
    characterSpacingControl(): CharacterSpacingControl | undefined {
        const index: number = findChildIndex(this.children, 'characterSpacingControl');
        if (index < 0)
        { return undefined; }
        const child: SettingsChild = arrayItem(this.children, index);
        return child instanceof SettingsCharacterSpacingControlChild ? child.read() : undefined;
    }
    /**
     * Set or clear `w:characterSpacingControl`. `undefined` removes the element.
     *
     * @param {CharacterSpacingControl | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @public
     */
    setCharacterSpacingControl(value: CharacterSpacingControl | undefined): void {
        replaceOrInsertChild(this.children, 'characterSpacingControl', value === undefined ? undefined : new SettingsCharacterSpacingControlChild(value));
        this.dirty = true;
    }
    // ── compat convenience ──────────────────────────────────────────────────────
    /**
     * `compatibilityMode` from `w:compat/w:compatSetting[@w:name='compatibilityMode']/@w:val`.
     *
     * Common values: `"15"` = Word 2013+, `"14"` = Word 2010, `"12"` = Word 2007.
     * Returns `undefined` when the `w:compat` element or the named setting is absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    compatibilityMode(): string | undefined {
        const compat: CompatSettings = this.compat();
        return compat === undefined ? undefined : compat.compatibilityMode();
    }
    /**
     * Set Word `compatibilityMode` on `w:compat`, creating the compat block when needed.
     *
     * @param {string | CompatibilityMode} value - Wire token or {@link CompatibilityMode}.
     * @returns {void} Nothing is returned.
     * @private
     */
    setCompatibilityMode(value: string | CompatibilityMode): void {
        this.ensureCompat().setCompatibilityMode(value);
        this.dirty = true;
    }
    /**
     * `w:compat/w:noColumnBalance` (`CT_OnOff`) — do not balance multi-column section
     * content. See {@link CompatSettings.noColumnBalance}.
     *
     * Returns `undefined` when `w:compat` or the element is absent (Word default:
     * balance columns). Layout engines are out of scope for this library.
     *
     * @returns {boolean | undefined} The result.
     * @private
     */
    noColumnBalance(): boolean | undefined {
        const compat: CompatSettings = this.compat();
        return compat === undefined ? undefined : compat.noColumnBalance();
    }
    /**
     * Set or clear `w:compat/w:noColumnBalance`. Creates `w:compat` when needed.
     * Pass `undefined` to remove the element. Marks the settings part dirty.
     *
     * @param {boolean | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setNoColumnBalance(value: boolean | undefined): void {
        if (value === undefined) {
            const compat: CompatSettings = this.compat();
            if (compat === undefined) {
                return;
            }
            compat.setNoColumnBalance(undefined);
            this.dirty = true;
            return;
        }
        this.ensureCompat().setNoColumnBalance(value);
        this.dirty = true;
    }
    /**
     * Document-level math settings (`m:mathPr`), or `undefined` when absent.
     * Parsing is delegated to `@syncfusion/ej2-office-common`.
     *
     * @returns {MathSettings | undefined} The result.
     * @public
     */
    mathSettings(): MathSettings | undefined {
        const index: number = findChildIndex(this.children, 'mathPr');
        const child: SettingsChild = index < 0 ? undefined : arrayItem(this.children, index);
        return child instanceof SettingsOpaqueChild ? parseMathSettings(child.serialize()) : undefined;
    }
    /**
     * Sets or removes (`undefined`) the document-level math settings (`m:mathPr`).
     *
     * @param {MathSettings | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @public
     */
    setMathSettings(value: MathSettings | undefined): void {
        replaceOrInsertChild(this.children, 'mathPr', value === undefined ? undefined : new SettingsOpaqueChild(mathSettingsToOpenXml(value)));
        this.dirty = true;
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        return this.dirty;
    }
    /**
     * @returns {Uint8Array} The result.
     * @private
     */
    serialize(): Uint8Array {
        const root: OpenXmlElement = wmlElement('settings', {
            attributes: this.rootAttributes,
            namespaceDeclarations: this.rootNamespaceDeclarations.length > 0
                ? this.rootNamespaceDeclarations
                : [{ prefix: 'w', namespaceUri: WML_TRANSITIONAL_NAMESPACE }],
            children: serializeSettingsChildren(this.children)
        });
        return utf8.encode(serializeXml(root));
    }
}
function loadSettingsPart(part: PackagePart | undefined): SettingsPart {
    if (part === undefined) {
        // Absent settings part (WordDocument.create scaffold, or package without
        // settings.xml): attach Word-2013 defaults and mark dirty so the next save
        // always emits settings.xml (settings-preserve-basic).
        return createDefaultSettingsPart();
    }
    const root: OpenXmlElement = parseXml(utf8Decoder.decode(part.data));
    if (!isWml(root, 'settings')) {
        return new SettingsPart([], [], [], false);
    }
    const children: SettingsChild[] = elementChildren(root).map((child: OpenXmlElement) => parseSettingsChild(child));
    return new SettingsPart(root.attributes, root.namespaceDeclarations, children, false);
}
/**
 * Build the canonical default `CT_Settings` children that Microsoft Word emits
 * for a new document containing only a "Hello World" paragraph.
 *
 * - `w:zoom val="none" percent="100"`
 * - `w:defaultTabStop val="720"` (0.5 inch / 36 points; stored as points, wire twips)
 * - `w:characterSpacingControl val="doNotCompress"`
 * - `w:compat` with five Word-2013 compat settings
 * - `w:clrSchemeMapping` (empty element)
 *
 * @returns {SettingsChild[]} The result.
 */
function buildDefaultSettingsChildren(): SettingsChild[] {
    return [
        new SettingsZoomChild(ZoomSettings.create(100, 'none')),
        new SettingsDefaultTabStopChild(36),
        new SettingsCharacterSpacingControlChild('doNotCompress'),
        new SettingsCompatChild(CompatSettings.createDefault()),
        // w:clrSchemeMapping — empty element, last in Word's default output.
        // We parse it as an opaque child from a minimal XML fragment.
        ...elementChildren(parseXml('<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:clrSchemeMapping/></w:settings>')).map((child: OpenXmlElement) => parseSettingsChild(child))
    ];
}
/**
 * Creates a new {@link SettingsPart} pre-populated with the canonical Word-2013
 * default settings and marked **dirty** so `WordDocument.saveSync` always writes
 * `settings.xml` — even when no further mutation is made.
 *
 * Emitted children (matching Microsoft Word for a minimal new document):
 * - `w:zoom val="none" percent="100"`
 * - `w:defaultTabStop val="720"` (wire twips; DOM value is `36` points)
 * - `w:characterSpacingControl val="doNotCompress"`
 * - `w:compat` with five Word-2013 compat settings
 * - `w:clrSchemeMapping`
 *
 * @returns {SettingsPart} The result.
 * @private
 */
export function createDefaultSettingsPart(): SettingsPart {
    return new SettingsPart([], [], buildDefaultSettingsChildren(), true);
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetSettingsFeatureForTests(): void {
    registered = false;
    resetWebSettingsFeatureForTests();
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the document-settings package-part handler. Idempotent.
 */
export function registerSettingsFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerWebSettingsFeature();
    registerFeature({ id: SETTINGS });
    registerFeaturePartHandler({
        featureId: SETTINGS,
        relationshipTypes: [SETTINGS_RELATIONSHIP_TYPE, STRICT_SETTINGS_RELATIONSHIP_TYPE],
        defaultRelativeTarget: 'settings.xml',
        partName: SETTINGS_PART_NAME,
        contentType: SETTINGS_CONTENT_TYPE,
        loadPart(part: PackagePart | undefined, ctx: FeaturePartLoadContext): SettingsPart {
            void ctx;
            return loadSettingsPart(part);
        }
    });
    // Materialize handler: ensure a default settings part is attached before every
    // save — even when the caller never explicitly invoked `settingsFor()`.
    // This guarantees settings.xml is always emitted (OOXML conformance requirement).
    registerFeatureMaterializeHandler({
        featureId: SETTINGS,
        materialize(document: WordDocument): void {
            const existing: FeaturePartState = document.featurePart(SETTINGS);
            // Attach Word-2013 defaults only when no settings part is present.
            // A loaded empty `<w:settings/>` is a real part and must not be replaced.
            if (!(existing instanceof SettingsPart)) {
                document.setFeaturePart(SETTINGS, createDefaultSettingsPart());
            }
        }
    });
}
/**
 * Settings catalog for a document. Requires {@link registerSettingsFeature}.
 *
 * On {@link WordDocument.create} (and any document that has no settings state yet), the first
 * access attaches a default {@link SettingsPart} pre-populated with canonical Word-2013
 * settings (zoom, defaultTabStop, characterSpacingControl, compat, clrSchemeMapping) and
 * marked dirty so that `WordDocument.saveSync` **always** materializes `/word/settings.xml`,
 * its content-type override, and its Main Document relationship — even when no further
 * mutation is made. This matches the OOXML conformance requirement that a DOCX file
 * contains a settings part by default.
 *
 * @param {WordDocument} document - The document.
 * @returns {SettingsPart} The result.
 * @throws DocxError `UNKNOWN_FEATURE` when the module was not registered.
 *
 * @private
 */
export function settingsFor(document: WordDocument): SettingsPart {
    const existing: FeaturePartState = document.featurePart(SETTINGS);
    if (existing instanceof SettingsPart) {
        return existing;
    }
    if (!registered) {
        throw new DocxError('feature/not-registered', 'Settings part was not loaded; call registerSettingsFeature() before WordDocument.open or WordDocument.create');
    }
    // Absent part only: attach Word-2013 defaults so save always emits settings.xml.
    // WordDocument.create loads via loadSettingsPart(undefined), which already attaches defaults.
    const part: SettingsPart = createDefaultSettingsPart();
    document.setFeaturePart(SETTINGS, part);
    return part;
}
/**
 * Attached template relationship target from the settings part, without fetching.
 *
 * @param {WordDocument} document - The document.
 * @returns {string | undefined} The result.
 * @private
 */
export function attachedTemplateTarget(document: WordDocument): string | undefined {
    const settings: SettingsPart = settingsFor(document);
    const id: string = settings.attachedTemplateRelationshipId();
    if (id === undefined) {
        return undefined;
    }
    const settingsPart: PartName = resolveSettingsPartName(document.opcPackage());
    if (settingsPart === undefined) {
        return undefined;
    }
    return resolveAttachedTemplateTarget(document.opcPackage(), settingsPart, id);
}
/**
 * Main Document page background metadata. Requires {@link registerSettingsFeature}.
 *
 * @param {WordDocument} document - The document.
 * @returns {Background} The result.
 * @private
 */
export function backgroundFor(document: WordDocument): Background {
    return createBackground(document, settingsFor(document).displayBackgroundShape());
}
registerSettingsFeature();
bindDocumentSettingsFacades({
    settingsFor,
    registerSettingsFeature,
    attachedTemplateTarget
});
registerDocumentSettingsFacades();
