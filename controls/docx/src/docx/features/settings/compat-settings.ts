/**
 * `w:compat` / `w:compatSetting` DOM (`CT_Compat` / `CT_CompatSetting`, Transitional `wml.xsd`).
 *
 * MVP: detect/list `compatSetting` name/uri/val; model selected nested OnOff flags
 * (`noColumnBalance`); preserve remaining nested OnOff flags and unknown children in
 * document order. Compatibility *engine* / layout behavior is out of scope.
 *
 * @public
 */
import { arrayItem } from '../../core/compat/array-compat';
import { WML_TRANSITIONAL_NAMESPACE, NamespaceDeclaration, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { parseOnOff, serializeOnOff } from '../document/on-off';
import { elementChildren, isWml, wmlElement } from '../document/wml';
function wmlAttribute(element: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName &&
        (attribute.namespaceUri === WML_TRANSITIONAL_NAMESPACE || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
/** Modeled CT_OnOff local names under `w:compat` (ECMA-376-4 transitional). */
const MODELED_COMPAT_ON_OFF: Set<string> = new Set(['noColumnBalance']);
/** Word `compatibilityMode` setting URI (Microsoft Office Word). */
const WORD_COMPAT_URI: string = 'http://schemas.microsoft.com/office/word';
/**
 * Specifies the Word compatibility mode of a document.
 *
 * @public
 */
export enum CompatibilityMode {
    /** Word 2007 compatibility (`"12"`). */
    Word2007 = '12',
    /** Word 2010 compatibility (`"14"`). */
    Word2010 = '14',
    /** Word 2013 and later compatibility (`"15"`). */
    Word2013 = '15',
}
/**
 * One `w:compatSetting` entry (`CT_CompatSetting`).
 * Preserve-only infrastructure; not part of the supported public surface.
 *
 * @private
 */
export class CompatSetting {
    private readonly settingName: string | undefined;
    private readonly settingUri: string | undefined;
    private readonly settingVal: string | undefined;
    private readonly attributes: ReadonlyArray<OpenXmlAttribute>;
    private readonly elementChildren: ReadonlyArray<OpenXmlChild>;
    private readonly namespaceDeclarations: ReadonlyArray<NamespaceDeclaration>;
    private constructor(
        settingName: string | undefined,
        settingUri: string | undefined,
        settingVal: string | undefined,
        attributes: ReadonlyArray<OpenXmlAttribute>,
        elementChildren: ReadonlyArray<OpenXmlChild>,
        namespaceDeclarations: ReadonlyArray<NamespaceDeclaration>
    ) {
        this.settingName = settingName;
        this.settingUri = settingUri;
        this.settingVal = settingVal;
        this.attributes = attributes;
        this.elementChildren = elementChildren;
        this.namespaceDeclarations = namespaceDeclarations;
    }
    /**
     * @param {OpenXmlElement} element - The element.
     * @returns {CompatSetting} The result.
     * @private
     */
    static fromElement(element: OpenXmlElement): CompatSetting {
        return new CompatSetting(wmlAttribute(element, 'name'), wmlAttribute(element, 'uri'), wmlAttribute(element, 'val'), element.attributes, [...element.children], element.namespaceDeclarations);
    }
    /**
     * Build a `w:compatSetting` with standard `name` / `uri` / `val` attributes.
     *
     * @param {string} name - The name.
     * @param {string} uri - The uri.
     * @param {string} val - The val.
     * @returns {CompatSetting} The result.
     * @private
     */
    static create(name: string, uri: string, val: string): CompatSetting {
        return CompatSetting.fromElement(wmlElement('compatSetting', {
            attributes: [
                { namespaceUri: WML_TRANSITIONAL_NAMESPACE, localName: 'name', prefix: 'w', value: name },
                { namespaceUri: WML_TRANSITIONAL_NAMESPACE, localName: 'uri', prefix: 'w', value: uri },
                { namespaceUri: WML_TRANSITIONAL_NAMESPACE, localName: 'val', prefix: 'w', value: val }
            ]
        }));
    }
    /**
     * `w:name` value, if present.
     *
     * @returns {string | undefined} The result.
     * @private
     */
    name(): string | undefined {
        return this.settingName;
    }
    /**
     * `w:uri` value, if present.
     *
     * @returns {string | undefined} The result.
     * @private
     */
    uri(): string | undefined {
        return this.settingUri;
    }
    /**
     * `w:val` value, if present.
     *
     * @returns {string | undefined} The result.
     * @private
     */
    val(): string | undefined {
        return this.settingVal;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        return wmlElement('compatSetting', {
            attributes: this.attributes,
            children: this.elementChildren,
            ...(this.namespaceDeclarations.length > 0
                ? { namespaceDeclarations: this.namespaceDeclarations }
                : {})
        });
    }
}
/**
 * Opaque nested child under `w:compat` (legacy OnOff flags, unknown markup).
 *
 * @private
 */
class CompatOpaqueChild {
    private readonly element: OpenXmlElement;
    constructor(element: OpenXmlElement) {
        this.element = element;
    }
    serialize(): OpenXmlElement {
        return this.element;
    }
}
/**
 * Modeled `CT_OnOff` child under `w:compat` (currently `w:noColumnBalance`).
 *
 * @private
 */
class CompatOnOffChild {
    readonly localName: string;
    private value: boolean;
    constructor(localName: string, value: boolean) {
        this.localName = localName;
        this.value = value;
    }
    static tryFromElement(element: OpenXmlElement): CompatOnOffChild | undefined {
        if (!MODELED_COMPAT_ON_OFF.has(element.localName) || !isWml(element, element.localName)) {
            return undefined;
        }
        const parsed: boolean = parseOnOff(element);
        if (parsed === undefined) {
            return undefined;
        }
        return new CompatOnOffChild(element.localName, parsed);
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
type CompatChild = CompatSetting | CompatOnOffChild | CompatOpaqueChild;
/**
 * Represents the compatibility settings of a document.
 *
 * @public
 */
export class CompatSettings {
    private readonly children: CompatChild[];
    private readonly attributes: ReadonlyArray<OpenXmlAttribute>;
    private readonly namespaceDeclarations: ReadonlyArray<NamespaceDeclaration>;
    private onDirty: (() => void) | undefined;
    private constructor(
        children: CompatChild[],
        attributes: ReadonlyArray<OpenXmlAttribute>,
        namespaceDeclarations: ReadonlyArray<NamespaceDeclaration>,
        onDirty?: (() => void) | undefined
    ) {
        this.children = children;
        this.attributes = attributes;
        this.namespaceDeclarations = namespaceDeclarations;
        this.onDirty = onDirty;
    }
    /**
     * @param {OpenXmlElement} element - The element.
     * @returns {CompatSettings} The result.
     * @private
     */
    static fromElement(element: OpenXmlElement): CompatSettings {
        const children: CompatChild[] = [];
        for (const child of elementChildren(element)) {
            if (isWml(child, 'compatSetting')) {
                children.push(CompatSetting.fromElement(child));
                continue;
            }
            const onOff: CompatOnOffChild = CompatOnOffChild.tryFromElement(child);
            if (onOff !== undefined) {
                children.push(onOff);
                continue;
            }
            children.push(new CompatOpaqueChild(child));
        }
        return new CompatSettings(children, element.attributes, element.namespaceDeclarations);
    }
    /**
     * @param {Function} onDirty - The on dirty.
     * @returns {CompatSettings} The result.
     * @private
     * Empty `w:compat` shell used when authors need a first-class OnOff under compat.
     */
    static createEmpty(onDirty?: () => void): CompatSettings {
        return new CompatSettings([], [], [], onDirty);
    }
    /**
     * @param {Function} onDirty - The on dirty.
     * @returns {void} Nothing is returned.
     * @private
     * Bind dirty callback after SettingsPart wraps the node.
     */
    bindDirty(onDirty: () => void): void {
        this.onDirty = onDirty;
    }
    private markDirty(): void {
        if (this.onDirty !== undefined) {
            this.onDirty();
        }
    }
    private findOnOff(localName: string): CompatOnOffChild | undefined {
        for (const child of this.children) {
            if (child instanceof CompatOnOffChild && child.localName === localName) {
                return child;
            }
        }
        return undefined;
    }
    private setOnOff(localName: string, value: boolean | undefined): void {
        const existingIndex: number = this.children.findIndex(
            (child: CompatChild) => child instanceof CompatOnOffChild && child.localName === localName
        );
        if (value === undefined) {
            if (existingIndex >= 0) {
                this.children.splice(existingIndex, 1);
                this.markDirty();
            }
            return;
        }
        if (existingIndex >= 0) {
            const existing: CompatChild = arrayItem(this.children, existingIndex);
            if (existing instanceof CompatOnOffChild) {
                existing.write(value);
                this.markDirty();
            }
            return;
        }
        // Schema order places legacy OnOff flags before `compatSetting` list.
        let insertAt: number = this.children.length;
        for (const [index, child] of this.children.entries()) {
            if (child instanceof CompatSetting) {
                insertAt = index;
                break;
            }
        }
        this.children.splice(insertAt, 0, new CompatOnOffChild(localName, value));
        this.markDirty();
    }
    /**
     * `w:compatSetting` entries in document order.
     *
     * @returns {ReadonlyArray<CompatSetting>} The result.
     * @private
     */
    settings(): ReadonlyArray<CompatSetting> {
        const out: CompatSetting[] = [];
        for (const child of this.children) {
            if (child instanceof CompatSetting) {
                out.push(child);
            }
        }
        return out;
    }
    /**
     * Names from `w:compatSetting/@w:name`, in document order (empty names skipped).
     *
     * @returns {ReadonlyArray<string>} The result.
     * @private
     */
    settingNames(): ReadonlyArray<string> {
        const names: string[] = [];
        for (const setting of this.settings()) {
            const name: string = setting.name();
            if (name !== undefined && name.length > 0) {
                names.push(name);
            }
        }
        return names;
    }
    /**
     * Count of `w:compatSetting` children.
     *
     * @returns {number} The result.
     * @private
     */
    settingCount(): number {
        return this.settings().length;
    }
    /**
     * Returns the `w:val` of the first `w:compatSetting` matching `name`, or
     * `undefined` when not found.
     *
     * @param {string} name - The name.
     * @returns {string | undefined} The result.
     * @private
     */
    setting(name: string): string | undefined {
        for (const s of this.settings()) {
            if (s.name() === name)
            { return s.val(); }
        }
        return undefined;
    }
    /**
     * Gets or sets the Word compatibility mode of the document.
     *
     * Common values are "15" for Word 2013 and later, "14" for Word 2010, and "12" for Word 2007. Returns undefined when the mode is not set.
     *
     * @returns {string | undefined} - Returns the compatibility mode string, or `undefined` if not set.
     * @example
     * ```ts
     * const settings = settingsFor(document);
     * const mode = settings.compat()?.compatibilityMode();
     * // "15" for typical Word 2013+ documents
     * ```
     * @public
     */
    compatibilityMode(): string | undefined {
        return this.setting('compatibilityMode');
    }
    /**
     * Set or replace the first `w:compatSetting[@w:name='compatibilityMode']`.
     *
     * Uses Microsoft Office Word URI and preserves other compat settings / order.
     * Creates a new entry at the end of the settings list when absent.
     *
     * @param {string | CompatibilityMode} value - Wire token (`"12"` | `"14"` | `"15"`) or {@link CompatibilityMode}.
     * @returns {void} Nothing is returned.
     * @private
     */
    setCompatibilityMode(value: string | CompatibilityMode): void {
        const wire: string = typeof value === 'string' ? value : value;
        const existingIndex: number = this.children.findIndex((child: CompatChild) => child instanceof CompatSetting && child.name() === 'compatibilityMode');
        const entry: CompatSetting = CompatSetting.create('compatibilityMode', WORD_COMPAT_URI, wire);
        if (existingIndex >= 0) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            this.children[existingIndex] = entry;
        }
        else {
            this.children.push(entry);
        }
        this.markDirty();
    }
    /**
     * Whether multi-column section content should **not** be balanced across columns
     * (`w:compat/w:noColumnBalance`, `CT_OnOff`, ECMA-376 Part 4 transitional
     * migration features).
     *
     * When the element is present and on (`true`, including bare element with no
     * `w:val`), consumers should fill columns top-to-bottom sequentially instead of
     * balancing line heights across columns. When absent, Word’s default is to
     * **balance** multi-column content (this method returns `undefined`).
     *
     * This library stores and round-trips the flag only; it does not implement a
     * layout engine. Column geometry remains on section properties
     * (`SectionProperties.textColumns` / `equalWidthColumns`).
     *
     * @returns {boolean | undefined} `true`/`false` when the element is present; `undefined` when absent.
     *
     * @example
     * ```ts
     * const compat = settingsFor(document).compat();
     * if (compat?.noColumnBalance() === true) {
     *   // sequential column fill requested
     * }
     * ```
     *
     * @private
     */
    noColumnBalance(): boolean | undefined {
        const child: CompatOnOffChild = this.findOnOff('noColumnBalance');
        return child === undefined ? undefined : child.read();
    }
    /**
     * Set or clear `w:compat/w:noColumnBalance`.
     *
     * - `true` — emit bare `w:noColumnBalance` (OnOff true)
     * - `false` — emit `w:noColumnBalance w:val="0"` / false form via serializeOnOff
     * - `undefined` — remove the element
     *
     * Marks the owning settings part dirty when a dirty callback is bound.
     *
     * @param {boolean | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setNoColumnBalance(value: boolean | undefined): void {
        this.setOnOff('noColumnBalance', value);
    }
    /**
     * Creates the default Word-2013 compat settings block.
     *
     * Matches the `w:compat` element emitted by Microsoft Word for new documents:
     * `compatibilityMode=15`, `overrideTableStyleFontSizeAndJustification=1`,
     * `enableOpenTypeFeatures=1`, `doNotFlipMirrorIndents=1`,
     * `differentiateMultirowTableHeaders=1`.
     *
     * @returns {CompatSettings} The result.
     * @private
     */
    static createDefault(): CompatSettings {
        const children: CompatChild[] = [
            CompatSetting.create('compatibilityMode', WORD_COMPAT_URI, CompatibilityMode.Word2013),
            CompatSetting.create('overrideTableStyleFontSizeAndJustification', WORD_COMPAT_URI, '1'),
            CompatSetting.create('enableOpenTypeFeatures', WORD_COMPAT_URI, '1'),
            CompatSetting.create('doNotFlipMirrorIndents', WORD_COMPAT_URI, '1'),
            CompatSetting.create('differentiateMultirowTableHeaders', WORD_COMPAT_URI, '1')
        ];
        return new CompatSettings(children, [], []);
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        return wmlElement('compat', {
            attributes: this.attributes,
            children: this.children.map((child: CompatChild) => child.serialize()),
            ...(this.namespaceDeclarations.length > 0
                ? { namespaceDeclarations: this.namespaceDeclarations }
                : {})
        });
    }
}
