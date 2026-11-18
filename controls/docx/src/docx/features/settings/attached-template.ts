/**
 * `w:attachedTemplate` DOM (`CT_Rel`, Transitional `wml.xsd`).
 *
 * Holds the relationship id (`r:id`) and preserves other attributes/children.
 * Target resolution stays on the package relationships (no network fetch).
 *
 * @public
 */
import { NamespaceDeclaration, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { wmlElement } from '../document/wml';
const OFFICE_RELATIONSHIPS_NAMESPACE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
function relationshipIdAttribute(element: OpenXmlElement): string | undefined {
    const found: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => attribute.localName === 'id' &&
        (attribute.namespaceUri === OFFICE_RELATIONSHIPS_NAMESPACE ||
            attribute.prefix === 'r' ||
            attribute.namespaceUri === ''));
    return found == null ? undefined : found.value;
}
/**
 * First-class `w:attachedTemplate` node.
 *
 * @private
 */
export class AttachedTemplate {
    private relationshipId: string | undefined;
    private readonly otherAttributes: OpenXmlAttribute[];
    private readonly elementChildren: OpenXmlChild[];
    private readonly namespaceDeclarations: ReadonlyArray<NamespaceDeclaration>;
    private constructor(
        relationshipId: string | undefined,
        otherAttributes: OpenXmlAttribute[],
        elementChildren: OpenXmlChild[],
        namespaceDeclarations: ReadonlyArray<NamespaceDeclaration>
    ) {
        this.relationshipId = relationshipId;
        this.otherAttributes = otherAttributes;
        this.elementChildren = elementChildren;
        this.namespaceDeclarations = namespaceDeclarations;
    }
    /**
     * @param {OpenXmlElement} element - The element.
     * @returns {AttachedTemplate} The result.
     * @private
     */
    static fromElement(element: OpenXmlElement): AttachedTemplate {
        const id: string = relationshipIdAttribute(element);
        const other: OpenXmlAttribute[] = element.attributes.filter((attribute: OpenXmlAttribute) => {
            if (attribute.localName !== 'id') {
                return true;
            }
            return !(attribute.namespaceUri === OFFICE_RELATIONSHIPS_NAMESPACE ||
                attribute.prefix === 'r' ||
                attribute.namespaceUri === '');
        });
        const idAttr: OpenXmlAttribute = element.attributes.find((attribute: OpenXmlAttribute) => {
            if (attribute.localName !== 'id') {
                return false;
            }
            return (attribute.namespaceUri === OFFICE_RELATIONSHIPS_NAMESPACE ||
                attribute.prefix === 'r' ||
                attribute.namespaceUri === '');
        });
        const attrs: OpenXmlAttribute[] = [...other];
        if (idAttr !== undefined) {
            attrs.unshift(idAttr);
        }
        return new AttachedTemplate(id, attrs, [...element.children], element.namespaceDeclarations);
    }
    /**
     * Relationship id (`r:id`), or `undefined` when absent.
     *
     * @returns {string | undefined} The result.
     * @public
     */
    id(): string | undefined {
        return this.relationshipId;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        return wmlElement('attachedTemplate', {
            attributes: this.otherAttributes,
            children: this.elementChildren,
            ...(this.namespaceDeclarations.length > 0
                ? { namespaceDeclarations: this.namespaceDeclarations }
                : {})
        });
    }
}
