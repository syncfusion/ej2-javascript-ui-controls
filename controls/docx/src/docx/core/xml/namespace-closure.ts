import { NamespaceDeclaration, OpenXmlAttribute, OpenXmlChild } from './model';
import { XML_NAMESPACE, WML_TRANSITIONAL_NAMESPACE } from './model';

/**
 * Prefixes Word binds on package XML roots and lists in `mc:Ignorable`.
 * ECMA-376-3 §7.2: an Ignorable prefix must be declared in scope.
 * PackageExplorer reports "w14 is an undeclared prefix" when styles.xml (or
 * numbering.xml) is rewritten with only `xmlns:w`.
 */
const PART_PREFIX_NAMESPACE: Readonly<Record<string, string>> = {
    mc: 'http://schemas.openxmlformats.org/markup-compatibility/2006',
    r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    w14: 'http://schemas.microsoft.com/office/word/2010/wordml',
    w15: 'http://schemas.microsoft.com/office/word/2012/wordml',
    w16se: 'http://schemas.microsoft.com/office/word/2015/wordml/symex',
    w16cid: 'http://schemas.microsoft.com/office/word/2016/wordml/cid',
    w16: 'http://schemas.microsoft.com/office/word/2018/wordml',
    w16cex: 'http://schemas.microsoft.com/office/word/2018/wordml/cex',
    w16sdtdh: 'http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash',
    w16sdtfl: 'http://schemas.microsoft.com/office/word/2024/wordml/sdtformatlock',
    w16du: 'http://schemas.microsoft.com/office/word/2023/wordml/word16du'
};

const MC_NAMESPACE: string = 'http://schemas.openxmlformats.org/markup-compatibility/2006';

function collectUsedPrefixes(node: OpenXmlChild, into: Set<string>): void {
    if (node.kind !== 'element') {
        return;
    }
    if (node.prefix !== '') {
        into.add(node.prefix);
    }
    for (const attr of node.attributes) {
        if (attr.prefix !== '' && attr.namespaceUri !== XML_NAMESPACE) {
            into.add(attr.prefix);
        }
    }
    for (const child of node.children) {
        collectUsedPrefixes(child, into);
    }
}

function ignorablePrefixes(attributes: ReadonlyArray<OpenXmlAttribute>): string[] {
    const ignorable: OpenXmlAttribute | undefined = attributes.find((attr: OpenXmlAttribute) =>
        attr.localName === 'Ignorable' && attr.namespaceUri === MC_NAMESPACE);
    if (ignorable === undefined) {
        return [];
    }
    return ignorable.value.split(/\s+/).filter((token: string) => token.length > 0);
}

/**
 * Keep loaded root xmlns bindings and declare any prefix the rewritten tree
 * (or `mc:Ignorable`) still uses.
 *
 * @param {ReadonlyArray<NamespaceDeclaration>} loaded - Declarations from the loaded root.
 * @param {ReadonlyArray<OpenXmlChild>} children - Serialized children.
 * @param {ReadonlyArray<OpenXmlAttribute>} rootAttributes - Root attributes, including `mc:Ignorable`.
 * @returns {NamespaceDeclaration[]} Declarations to emit on the part root.
 */
export function closePartNamespaces(
    loaded: ReadonlyArray<NamespaceDeclaration>,
    children: ReadonlyArray<OpenXmlChild>,
    rootAttributes: ReadonlyArray<OpenXmlAttribute>
): NamespaceDeclaration[] {
    const decls: NamespaceDeclaration[] = [];
    const seen: Set<string> = new Set<string>();
    for (const decl of loaded) {
        if (seen.has(decl.prefix)) {
            continue;
        }
        seen.add(decl.prefix);
        decls.push(decl);
    }
    if (!seen.has('w')) {
        decls.push({ prefix: 'w', namespaceUri: WML_TRANSITIONAL_NAMESPACE });
        seen.add('w');
    }
    const used: Set<string> = new Set<string>();
    for (const child of children) {
        collectUsedPrefixes(child, used);
    }
    for (const prefix of ignorablePrefixes(rootAttributes)) {
        used.add(prefix);
    }
    if (rootAttributes.some((attr: OpenXmlAttribute) => attr.prefix === 'mc')) {
        used.add('mc');
    }
    const unbound: string[] = [];
    used.forEach((prefix: string) => {
        if (!seen.has(prefix)) {
            unbound.push(prefix);
        }
    });
    unbound.sort();
    for (const prefix of unbound) {
        // eslint-disable-next-line security/detect-object-injection -- key/index is internal (bounded loop index or fixed lookup table), not user-controlled property path
        const uri: string | undefined = PART_PREFIX_NAMESPACE[prefix];
        if (uri === undefined) {
            continue;
        }
        decls.push({ prefix, namespaceUri: uri });
    }
    return decls;
}
