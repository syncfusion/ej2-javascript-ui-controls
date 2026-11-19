/**
 * Parsers: ElementTree → diagram models/views.
 * NEVER invent markup; preserve unknown children under body/extLst.
 *
 * Citations: dml-diagram.xsd CT_DataModel/CT_Pt/CT_Cxn/CT_RelIds,
 * CT_DiagramDefinition, CT_StyleDefinition, CT_ColorTransform;
 * [MS-ODRAWXML] drawing root.
 */

import { isANamespace, isDgmNamespace, MAX_DIAGRAM_CONNECTIONS, MAX_DIAGRAM_POINTS } from './constants';
import { DiagramDataModel, DiagramConnectionProps, DiagramConnectionType, DiagramPointProps, DiagramPointType } from './diagram-data-model';
import { DiagramColors, DiagramDrawing, DiagramLayout, DiagramQuickStyle } from './diagram-views';
import { ElementNode, ElementChild } from './element-tree';
import { cloneElement, findChild, findChildren, getAttr } from './element-tree';
import { DiagramParseError } from './errors';
const PT_TYPES: Set<string> = new Set<string>(['node', 'asst', 'doc', 'pres', 'parTrans', 'sibTrans']);
const CXN_TYPES: Set<string> = new Set<string>(['parOf', 'presOf', 'presParOf', 'unknownRelationship']);
/**
 * The require dgm root.
 *
 * @param {ElementNode} tree - The tree.
 * @param {string} localName - The local name.
 * @returns {void} Nothing is returned.
 */
function requireDgmRoot(tree: ElementNode, localName: string): void {
    if (!isDgmNamespace(tree.namespaceUri) || tree.localName !== localName) {
        throw new DiagramParseError('invalid_root', `Expected dgm:${localName} root, got {${tree.namespaceUri != null ? tree.namespaceUri : 'null'}}${tree.localName}.`);
    }
}
/**
 * The parse point type.
 *
 * @param {string | undefined} raw - The raw.
 * @returns {DiagramPointType} The result.
 */
function parsePointType(raw: string | undefined): DiagramPointType {
    if (raw == null || raw === '') {return 'node'; }
    if (!PT_TYPES.has(raw)) {
    // Preserve unknown as node with body? Prefer strict enum — map unknown to node
    // but keep attribute via body is not needed; XSD enumeration — accept known only.
        return 'node';
    }
    return raw as DiagramPointType;
}
/**
 * The parse cxn type.
 *
 * @param {string | undefined} raw - The raw.
 * @returns {DiagramConnectionType} The result.
 */
function parseCxnType(raw: string | undefined): DiagramConnectionType {
    // XSD default parOf
    if (raw == null || raw === '') {return 'parOf'; }
    if (!CXN_TYPES.has(raw)) {return 'parOf'; }
    return raw as DiagramConnectionType;
}
/**
 * The parse ord.
 *
 * @param {string | undefined} raw - The raw.
 * @param {string} attrName - The attr name.
 * @returns {number} The result.
 */
function parseOrd(raw: string | undefined, attrName: string): number {
    if (raw == null || raw === '') {
        throw new DiagramParseError('missing_required', `Connection missing required attribute ${attrName}.`);
    }
    const n: number = Number(raw);
    if (!Number.isFinite(n)) {
        throw new DiagramParseError('invalid_attribute', `Connection ${attrName} is not a number: ${raw}`);
    }
    return n;
}

/**
 * Wrap remaining element children as a synthetic body root when multiple,
 * or single child as body, so round-trip can re-emit them under pt/cxn.
 *
 * @param {ReadonlyArray<ElementNode>} children - The children.
 * @returns {ElementNode | null} The result.
 */
function bodyFromRemainder(children: ReadonlyArray<ElementNode>): ElementNode | null {
    if (children.length === 0) {return null; }
    const first: ElementNode = children[0];
    if (children.length === 1 && first !== undefined) {return cloneElement(first); }
    return { kind: 'element',
        localName: '_body',
        namespaceUri: null,
        attributes: [],
        children: children.map((c: ElementNode) => cloneElement(c))
    };
}
/**
 * The parse pt.
 *
 * @param {ElementNode} el - The el.
 * @returns {DiagramPointProps} The result.
 */
function parsePt(el: ElementNode): DiagramPointProps {
    const modelId: string = getAttr(el, 'modelId');
    if (modelId == null || modelId === '') {
        throw new DiagramParseError('missing_required', 'dgm:pt missing required modelId.');
    }
    const type: DiagramPointType = parsePointType(getAttr(el, 'type'));
    const cxnId: string = function (): string {
        const _nc: string = getAttr(el, 'cxnId');
        return _nc != null ? _nc : '0';
    }();
    // Known child names kept under body as full subtrees (prSet, spPr, t, extLst, unknown).
    const kids: ElementNode[] = el.children.filter((c: ElementChild): c is ElementNode => c.kind === 'element');
    return {
        modelId,
        type,
        cxnId,
        body: bodyFromRemainder(kids)
    };
}
/**
 * The parse cxn.
 *
 * @param {ElementNode} el - The el.
 * @returns {DiagramConnectionProps} The result.
 */
function parseCxn(el: ElementNode): DiagramConnectionProps {
    const modelId: string = getAttr(el, 'modelId');
    if (modelId == null || modelId === '') {
        throw new DiagramParseError('missing_required', 'dgm:cxn missing required modelId.');
    }
    const srcId: string = getAttr(el, 'srcId');
    const destId: string = getAttr(el, 'destId');
    if (srcId == null || srcId === '' || destId == null || destId === '') {
        throw new DiagramParseError('missing_required', `dgm:cxn modelId=${modelId} missing srcId/destId.`);
    }
    const kids: ElementNode[] = el.children.filter((c: ElementChild): c is ElementNode => c.kind === 'element');
    return {
        modelId,
        type: parseCxnType(getAttr(el, 'type')),
        srcId,
        destId,
        srcOrd: parseOrd(getAttr(el, 'srcOrd'), 'srcOrd'),
        destOrd: parseOrd(getAttr(el, 'destOrd'), 'destOrd'),
        parTransId: function (): string {
            const _nc: string = getAttr(el, 'parTransId');
            return _nc != null ? _nc : '0';
        }(),
        sibTransId: function (): string {
            const _nc: string = getAttr(el, 'sibTransId');
            return _nc != null ? _nc : '0';
        }(),
        presId: function (): string {
            const _nc: string = getAttr(el, 'presId');
            return _nc != null ? _nc : '';
        }(),
        body: bodyFromRemainder(kids)
    };
}

/**
 * Parse CT_DataModel (`dgm:dataModel`).
 * dml-diagram.xsd CT_DataModel: ptLst, cxnLst, bg, whole, extLst.
 *
 * @param {ElementNode} tree - The tree.
 * @returns {DiagramDataModel} The result.
 */
export function parseDiagramData(tree: ElementNode): DiagramDataModel {
    requireDgmRoot(tree, 'dataModel');
    const ptLst: ElementNode = findChild(tree, 'ptLst', isDgmNamespace);
    const cxnLst: ElementNode = findChild(tree, 'cxnLst', isDgmNamespace);
    const bg: ElementNode = findChild(tree, 'bg', isDgmNamespace);
    const whole: ElementNode = findChild(tree, 'whole', isDgmNamespace);
    // extLst is typically a:extLst under dataModel (DrawingML).
    const extLst: ElementNode = function (): ElementNode {
        const _nc: ElementNode = function (): ElementNode {
            const _nc: ElementNode = findChild(tree, 'extLst', isANamespace);
            return _nc != null ? _nc : findChild(tree, 'extLst', isDgmNamespace);
        }();
        return _nc != null ? _nc : findChild(tree, 'extLst');
    }();
    const ptEls: ElementNode[] = ptLst ? findChildren(ptLst, 'pt', isDgmNamespace) : [];
    const cxnEls: ElementNode[] = cxnLst ? findChildren(cxnLst, 'cxn', isDgmNamespace) : [];
    if (ptEls.length > MAX_DIAGRAM_POINTS) {
        throw new DiagramParseError('limit_exceeded', `Point count ${String(ptEls.length)} exceeds MAX_DIAGRAM_POINTS (${String(MAX_DIAGRAM_POINTS)}).`);
    }
    if (cxnEls.length > MAX_DIAGRAM_CONNECTIONS) {
        throw new DiagramParseError('limit_exceeded', `Connection count ${String(cxnEls.length)} exceeds MAX_DIAGRAM_CONNECTIONS (${String(MAX_DIAGRAM_CONNECTIONS)}).`);
    }
    const points: DiagramPointProps[] = ptEls.map(parsePt);
    const connections: DiagramConnectionProps[] = cxnEls.map(parseCxn);
    return new DiagramDataModel({
        points,
        connections,
        background: bg ? cloneElement(bg) : null,
        whole: whole ? cloneElement(whole) : null,
        extLst: extLst ? cloneElement(extLst) : null
    });
}

/**
 * Parse CT_DiagramDefinition (`dgm:layoutDef`).
 *
 * @param {ElementNode} tree - The tree.
 * @returns {DiagramLayout} The result.
 */
export function parseDiagramLayout(tree: ElementNode): DiagramLayout {
    requireDgmRoot(tree, 'layoutDef');
    return new DiagramLayout(tree);
}

/**
 * Parse CT_StyleDefinition (`dgm:styleDef`).
 *
 * @param {ElementNode} tree - The tree.
 * @returns {DiagramQuickStyle} The result.
 */
export function parseDiagramQuickStyle(tree: ElementNode): DiagramQuickStyle {
    requireDgmRoot(tree, 'styleDef');
    return new DiagramQuickStyle(tree);
}

/**
 * Parse CT_ColorTransform (`dgm:colorsDef`).
 *
 * @param {ElementNode} tree - The tree.
 * @returns {DiagramColors} The result.
 */
export function parseDiagramColors(tree: ElementNode): DiagramColors {
    requireDgmRoot(tree, 'colorsDef');
    return new DiagramColors(tree);
}

/**
 * Parse Microsoft diagram drawing root.
 * Accepts `dsp:drawing` or any element in DSP_NAMESPACE; also tolerates
 * unknown root when namespace matches MS drawing content (preserve tree).
 *
 * @param {ElementNode} tree - The tree.
 * @returns {DiagramDrawing} The result.
 */
export function parseDiagramDrawing(tree: ElementNode): DiagramDrawing {
    // Prefer dsp:drawing; if not, still wrap as opaque drawing view so
    // round-trip of unknown MS roots is possible without inventing markup.
    if (tree.localName === 'drawing' || (tree.namespaceUri != null && tree.namespaceUri.indexOf('drawing/2008/diagram') !== -1)) {
        return new DiagramDrawing(tree);
    }
    // Accept any tree as opaque drawing for catalog load of non-standard caches.
    return new DiagramDrawing(tree);
}
