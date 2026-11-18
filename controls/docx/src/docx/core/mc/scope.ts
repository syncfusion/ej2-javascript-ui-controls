import { OpenXmlElement } from '../xml/index';
import { XML_NAMESPACE, XMLNS_NAMESPACE } from '../xml/model';
/**
 * In-scope prefix → namespace URI, including the default namespace as `""`.
 * Built-in `xml` / `xmlns` prefixes are always present.
 *
 * @param {ReadonlyArray<OpenXmlElement>} chain - The chain.
 * @returns {ReadonlyMap<string, string>} The result.
 * @private
 */
export function inScopeNamespaces(chain: ReadonlyArray<OpenXmlElement>): ReadonlyMap<string, string> {
    const map: Map<string, string> = new Map<string, string>();
    map.set('xml', XML_NAMESPACE);
    map.set('xmlns', XMLNS_NAMESPACE);
    for (const element of chain) {
        for (const decl of element.namespaceDeclarations) {
            map.set(decl.prefix, decl.namespaceUri);
        }
    }
    return map;
}
