import { PackageError } from '../errors/docx-error';
import { WML_STRICT_NAMESPACE, WML_TRANSITIONAL_NAMESPACE, OpenXmlElement } from '../xml/index';
import { OpenXmlChild } from '../xml/model';
/**
 * Unmodeled body child (EG_ContentBlockContent and anything else). Phase 1
 * tables module is absent, so `w:tbl` is opaque.
 */
export interface OpaqueBlock {
    readonly type: 'opaque';
    readonly xml: OpenXmlElement;
}
function childElements(element: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return element.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
function isWmlNamespace(namespaceUri: string): boolean {
    return namespaceUri === WML_TRANSITIONAL_NAMESPACE || namespaceUri === WML_STRICT_NAMESPACE;
}
export function isWmlElement(element: OpenXmlElement, localName: string): boolean {
    return isWmlNamespace(element.namespaceUri) && element.localName === localName;
}
export function documentBody(root: OpenXmlElement): OpenXmlElement {
    if (!isWmlElement(root, 'document')) {
        throw new PackageError('package/invalid-document-part', `Expected w:document in ${WML_TRANSITIONAL_NAMESPACE} or ${WML_STRICT_NAMESPACE}, found {${root.namespaceUri}}${root.localName}`);
    }
    const body: OpenXmlElement = childElements(root).find((c: OpenXmlElement) => isWmlElement(c, 'body'));
    if (body === undefined) {
        throw new PackageError('package/invalid-document-part', 'w:document is missing w:body');
    }
    return body;
}
/**
 * Every body child element is opaque until a feature claims it (for `w:p`).
 *
 * @param {OpenXmlElement} body - The body.
 * @returns {ReadonlyArray<OpaqueBlock>} The result.
 * @private
 */
export function opaqueBlocksFromBody(body: OpenXmlElement): ReadonlyArray<OpaqueBlock> {
    return childElements(body).map((xml: OpenXmlElement): OpaqueBlock => ({ type: 'opaque', xml }));
}
export function withOpaqueBody(root: OpenXmlElement, blocks: ReadonlyArray<OpaqueBlock>): OpenXmlElement {
    const body: OpenXmlElement = documentBody(root);
    const keptNonElements: OpenXmlChild[] = body.children.filter((c: OpenXmlChild) => c.kind !== 'element');
    const newBody: OpenXmlElement = {
        ...body,
        children: [...blocks.map((b: OpaqueBlock) => b.xml), ...keptNonElements]
    };
    return {
        ...root,
        children: root.children.map((child: OpenXmlChild) => {
            if (child.kind === 'element' && isWmlElement(child, 'body')) {
                return newBody;
            }
            return child;
        })
    };
}
