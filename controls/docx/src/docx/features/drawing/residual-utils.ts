/**
 * Residual DOM utilities for DrawingML / VML detection and clone helpers.
 *
 * @private
 */
import { BlockContent, Paragraph } from '../document/paragraph';
import { isWml } from '../document/wml';
import { OpenXmlElement } from '../../core/xml/index';
import { MARKUP_COMPATIBILITY_NAMESPACE } from '../../core/mc/index';
import { A_NS, attributeValue, findFirstElement, preferredDrawingElement, R_NS, VML_NS, WPC_NS, WPG_NS, WPS_NS } from './host-codec';
import { DrawingVariant } from './types';
import { OpenXmlChild, OpenXmlAttribute, NamespaceDeclaration } from '../../core/xml/model';
export function elementChildren(el: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return el.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
export function isElement(el: OpenXmlElement, namespaceUri: string, localName: string): boolean {
    return el.namespaceUri === namespaceUri && el.localName === localName;
}
export function emptyTxbxParagraphBlocks(): BlockContent[] {
    return [{ type: 'paragraph', paragraph: new Paragraph(undefined) }];
}
/**
 *  Deep-clone a residual element for txbxContent patching (no shared state).
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function cloneResidualElement(el: OpenXmlElement): OpenXmlElement {
    return {
        kind: 'element',
        namespaceUri: el.namespaceUri,
        localName: el.localName,
        prefix: el.prefix,
        attributes: el.attributes.map((a: OpenXmlAttribute) => ({ ...a })),
        namespaceDeclarations: el.namespaceDeclarations.map((n: NamespaceDeclaration) => ({ ...n })),
        children: el.children.map((c: OpenXmlChild): OpenXmlChild => {
            if (c.kind === 'element') {
                return cloneResidualElement(c);
            }
            return { kind: 'text', value: c.value };
        })
    };
}
/**
 * Locate the nested-child host element for a group (`wpg:wgp` / nested
 * `wpg:grpSp`) or canvas (`wpc:wpc`) residual tree.
 *
 * Accepts top-level `w:drawing` / MC dual-AC roots, bare nested group residuals,
 * or an already-resolved container. Returns undefined for leaf shapes.
 *
 * @param {OpenXmlElement} root - The root.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function findNestedDrawingContainer(root: OpenXmlElement): OpenXmlElement | undefined {
    let ts330: any; let ts331: any; let ts332: any; let ts333: any;
    if (root.namespaceUri === WPG_NS && (root.localName === 'wgp' || root.localName === 'grpSp')) {
        return root;
    }
    if (root.namespaceUri === WPC_NS && root.localName === 'wpc') {
        return root;
    }
    const drawing: OpenXmlElement = ((ts330 = preferredDrawingElement(root)), ts330 != null ? ts330 : (isWml(root, 'drawing') ? root : undefined));
    if (drawing === undefined) {
        // Residual may already be graphicData or an intermediate tree fragment.
        const directWgp: OpenXmlElement = ((ts331 = findFirstElement(root, WPG_NS, 'wgp')), ts331 != null ? ts331 : findFirstElement(root, WPG_NS, 'grpSp'));
        if (directWgp !== undefined) {
            return directWgp;
        }
        return findFirstElement(root, WPC_NS, 'wpc');
    }
    const graphicData: OpenXmlElement = findFirstElement(drawing, A_NS, 'graphicData');
    if (graphicData !== undefined) {
        for (const child of elementChildren(graphicData)) {
            if ((child.namespaceUri === WPG_NS && (child.localName === 'wgp' || child.localName === 'grpSp')) ||
                (child.namespaceUri === WPC_NS && child.localName === 'wpc')) {
                return child;
            }
        }
    }
    return (((ts333 = ((ts332 = findFirstElement(drawing, WPG_NS, 'wgp')), ts332 != null ? ts332 : findFirstElement(drawing, WPG_NS, 'grpSp'))), ts333 != null ? ts333 : findFirstElement(drawing, WPC_NS, 'wpc')));
}
/**
 * Detect the variant of a DML drawing (`w:drawing` element).
 *
 * Strategy: locate `a:graphic/a:graphicData` and inspect the `@uri` attribute.
 * - WPS_NS → `wps:wsp` present → 'textBox' if `wps:txbx` child exists, else 'shape'
 * - WPG_NS → 'group'  ([MS-ODRAWXML] §2.2.7.4, §2.16)
 * - WPC_NS → 'canvas' ([MS-ODRAWXML] §2.2.7.5, §2.17)
 * - anything else → 'unknown'
 *
 * @param {OpenXmlElement} drawingEl - The drawing el.
 * @returns {DrawingVariant} The result.
 * @private
 */
export function detectDmlVariant(drawingEl: OpenXmlElement): DrawingVariant {
    const graphicData: OpenXmlElement = findFirstElement(drawingEl, A_NS, 'graphicData');
    if (graphicData === undefined) {
        return DrawingVariant.Unknown;
    }
    const uri: string = attributeValue(graphicData, '', 'uri');
    if (uri === WPS_NS) {
        const wsp: OpenXmlElement = findFirstElement(graphicData, WPS_NS, 'wsp');
        if (wsp !== undefined) {
            const hasTxbx: boolean = elementChildren(wsp).some((c: OpenXmlElement) => isElement(c, WPS_NS, 'txbx')) ||
                elementChildren(wsp).some((c: OpenXmlElement) => isElement(c, WPS_NS, 'linkedTxbx'));
            return hasTxbx ? DrawingVariant.TextBox : DrawingVariant.Shape;
        }
        return DrawingVariant.Unknown;
    }
    if (uri === WPG_NS) {
        return DrawingVariant.Group;
    }
    if (uri === WPC_NS) {
        return DrawingVariant.Canvas;
    }
    return DrawingVariant.Unknown;
}
/**
 * True when residual is (or contains) MC AlternateContent with a Fallback
 * branch that carries `w:pict` (Policy B dual AC VML Fallback).
 * Does not execute or interpret VML children.
 *
 * @param {OpenXmlElement} root - The root.
 * @returns {boolean} The result.
 * @private
 */
export function residualHasVmlFallback(root: OpenXmlElement): boolean {
    if (root.namespaceUri === MARKUP_COMPATIBILITY_NAMESPACE &&
        root.localName === 'AlternateContent') {
        for (const child of elementChildren(root)) {
            if (child.namespaceUri !== MARKUP_COMPATIBILITY_NAMESPACE ||
                child.localName !== 'Fallback') {
                continue;
            }
            for (const nested of elementChildren(child)) {
                if (isWml(nested, 'pict')) {
                    return true;
                }
            }
        }
        return false;
    }
    // Authored dual AC is the residual root; residual may also nest AC under
    // rare fixtures — shallow scan only (no deep walk of every descendant).
    for (const child of elementChildren(root)) {
        if (residualHasVmlFallback(child)) {
            return true;
        }
    }
    return false;
}
/**
 * Detect drawing variant from a VML `w:pict` subtree.
 *
 * Source: ECMA-376-4 §14.3 VML elements; [MS-OI29500] Part 4.
 *
 * @param {OpenXmlElement} pictEl - The pict el.
 * @returns {DrawingVariant} The result.
 * @private
 */
export function detectVmlVariant(pictEl: OpenXmlElement): DrawingVariant {
    for (const child of elementChildren(pictEl)) {
        if (child.namespaceUri !== VML_NS) {
            continue;
        }
        if (child.localName === 'group') {
            return DrawingVariant.Group;
        }
        const isVmlShapeContainer: boolean = child.localName === 'shape' ||
            child.localName === 'rect' ||
            child.localName === 'oval' ||
            child.localName === 'roundrect';
        if (isVmlShapeContainer) {
            const hasTextbox: boolean = elementChildren(child).some((c: OpenXmlElement) => isElement(c, VML_NS, 'textbox'));
            return hasTextbox ? DrawingVariant.TextBox : DrawingVariant.Shape;
        }
    }
    return DrawingVariant.Unknown;
}
export function collectRelationshipIds(root: OpenXmlElement): ReadonlyArray<string> {
    const found: Set<string> = new Set<string>();
    collectRelationshipIdsRecursive(root, found);
    return [...found];
}
export function collectRelationshipIdsRecursive(element: OpenXmlElement, found: Set<string>): void {
    for (const attribute of element.attributes) {
        if (attribute.namespaceUri === R_NS &&
            (attribute.localName === 'embed' || attribute.localName === 'link') &&
            attribute.value.length > 0) {
            found.add(attribute.value);
        }
    }
    for (const child of elementChildren(element)) {
        collectRelationshipIdsRecursive(child, found);
    }
}
