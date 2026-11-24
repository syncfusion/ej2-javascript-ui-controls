/**
 * `w:documentProtection` DOM (`CT_DocProtect`, Transitional `wml.xsd`).
 *
 * Modeled flags: `edit` / `formatting` / `enforcement`. Password and hash attributes
 * (`AG_Password` / `AG_TransitionalPassword`) are preserved on flag-only updates and
 * dropped only when the element is removed.
 *
 * @private
 */
import { WML_TRANSITIONAL_NAMESPACE, NamespaceDeclaration, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { wmlAttr, wmlElement } from '../document/wml';
/**
 * `ST_DocProtect` (Transitional `wml.xsd`). *
 *
 * @private
 */
export type DocumentProtectionEdit = 'none' | 'readOnly' | 'comments' | 'trackedChanges' | 'forms';
/**
 * Modeled `w:documentProtection` flags. Password/hash attributes are not included.
 *
 * @private
 */
export type DocumentProtectionFlags = {
    readonly edit?: DocumentProtectionEdit;
    readonly formatting?: boolean;
    readonly enforcement?: boolean;
};
const MODELED_PROTECTION_ATTRS: Set<string> = new Set(['edit', 'formatting', 'enforcement']);
function wmlAttribute(element: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === localName &&
        (attribute.namespaceUri === WML_TRANSITIONAL_NAMESPACE || attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
function parseOnOffAttribute(raw: string | undefined): boolean | undefined {
    if (raw === undefined || raw.length === 0) {
        return undefined;
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
function onOffAttribute(localName: string, value: boolean): OpenXmlAttribute {
    return wmlAttr(localName, value ? 'true' : 'false');
}
function parseProtectionEdit(raw: string | undefined): DocumentProtectionEdit | undefined {
    if (raw === undefined) {
        return undefined;
    }
    switch (raw) {
    case 'none':
    case 'readOnly':
    case 'comments':
    case 'trackedChanges':
    case 'forms':
        return raw;
    default:
        return undefined;
    }
}
/**
 * First-class `w:documentProtection` node.
 *
 * Kept public because {@link SettingsPart.documentProtectionNode} returns it (R7.3).
 *
 * @private
 */
export class DocumentProtection {
    private edit: DocumentProtectionEdit | undefined;
    private formatting: boolean | undefined;
    private enforcement: boolean | undefined;
    private leftoverAttributes: OpenXmlAttribute[];
    private readonly elementChildren: OpenXmlChild[];
    private readonly namespaceDeclarations: ReadonlyArray<NamespaceDeclaration>;
    private constructor(
        edit: DocumentProtectionEdit | undefined,
        formatting: boolean | undefined,
        enforcement: boolean | undefined,
        leftoverAttributes: OpenXmlAttribute[],
        elementChildren: OpenXmlChild[],
        namespaceDeclarations: ReadonlyArray<NamespaceDeclaration>
    ) {
        this.edit = edit;
        this.formatting = formatting;
        this.enforcement = enforcement;
        this.leftoverAttributes = leftoverAttributes;
        this.elementChildren = elementChildren;
        this.namespaceDeclarations = namespaceDeclarations;
    }
    /**
     * @param {OpenXmlElement} element - The element.
     * @returns {DocumentProtection} The result.
     * @private
     * Parse from a `w:documentProtection` element.
     */
    static fromElement(element: OpenXmlElement): DocumentProtection {
        const leftover: OpenXmlAttribute[] = element.attributes.filter(
            (attribute: OpenXmlAttribute) => !MODELED_PROTECTION_ATTRS.has(attribute.localName)
        );
        return new DocumentProtection(parseProtectionEdit(wmlAttribute(element, 'edit')), parseOnOffAttribute(wmlAttribute(element, 'formatting')), parseOnOffAttribute(wmlAttribute(element, 'enforcement')), leftover, [...element.children], element.namespaceDeclarations);
    }
    /**
     * @param {DocumentProtectionFlags} flags - The flags.
     * @returns {DocumentProtection} The result.
     * @private
     * Build from modeled flags only (create path).
     */
    static fromFlags(flags: DocumentProtectionFlags): DocumentProtection {
        return new DocumentProtection(flags.edit, flags.formatting, flags.enforcement, [], [], []);
    }
    /**
     * Snapshot of modeled flags (password/hash attrs omitted).
     *
     * @returns {DocumentProtectionFlags} The result.
     * @public
     */
    flags(): DocumentProtectionFlags {
        const out: {
            edit?: DocumentProtectionEdit;
            formatting?: boolean;
            enforcement?: boolean;
        } = {};
        if (this.edit !== undefined) {
            out.edit = this.edit;
        }
        if (this.formatting !== undefined) {
            out.formatting = this.formatting;
        }
        if (this.enforcement !== undefined) {
            out.enforcement = this.enforcement;
        }
        return out;
    }
    /**
     * Replace modeled flags; leftover password/hash attributes are kept.
     *
     * @param {DocumentProtectionFlags} flags - The flags.
     * @returns {void} Nothing is returned.
     * @private
     */
    applyFlags(flags: DocumentProtectionFlags): void {
        this.edit = flags.edit;
        this.formatting = flags.formatting;
        this.enforcement = flags.enforcement;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        const modeled: OpenXmlAttribute[] = [];
        if (this.edit !== undefined) {
            modeled.push(wmlAttr('edit', this.edit));
        }
        if (this.formatting !== undefined) {
            modeled.push(onOffAttribute('formatting', this.formatting));
        }
        if (this.enforcement !== undefined) {
            modeled.push(onOffAttribute('enforcement', this.enforcement));
        }
        return wmlElement('documentProtection', {
            attributes: [...modeled, ...this.leftoverAttributes],
            children: this.elementChildren,
            ...(this.namespaceDeclarations.length > 0
                ? { namespaceDeclarations: this.namespaceDeclarations }
                : {})
        });
    }
}
