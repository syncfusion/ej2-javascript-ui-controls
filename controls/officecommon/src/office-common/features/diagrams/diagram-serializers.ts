/**
 * Serializers: diagram models/views → ElementTree (Transitional write).
 * Never invent optional markup beyond model state; emit XSD defaults only
 * when the model holds non-default values or required attributes.
 *
 * Citations: dml-diagram.xsd; ECMA-376 Transitional namespaces.
 */

import {
    A_NAMESPACE,
    DGM_NAMESPACE,
    DSP_NAMESPACE
} from './constants';
import { DiagramDataModel, DiagramConnection, DiagramPoint } from './diagram-data-model';
import {
    DiagramColors,
    DiagramDrawing,
    DiagramLayout,
    DiagramQuickStyle
} from './diagram-views';
import { attr, el, ElementChild, ElementNode, ElementAttr } from './element-tree';
import { cloneElement } from './element-tree';

/**
 * The point attrs.
 *
 * @param {DiagramPoint} p - The p.
 * @returns {*} The result.
 */
function pointAttrs(p: DiagramPoint): ReturnType<typeof attr>[] {
    const attrs: ElementAttr[] = [attr('modelId', p.modelId)];
    if (p.type !== 'node') {attrs.push(attr('type', p.type)); }
    if (p.cxnId !== '0') {attrs.push(attr('cxnId', p.cxnId)); }
    return attrs;
}

/**
 * The connection attrs.
 *
 * @param {DiagramConnection} c - The c.
 * @returns {*} The result.
 */
function connectionAttrs(c: DiagramConnection): ReturnType<typeof attr>[] {
    const attrs: ElementAttr[] = [
        attr('modelId', c.modelId),
        attr('srcId', c.srcId),
        attr('destId', c.destId),
        attr('srcOrd', String(c.srcOrd)),
        attr('destOrd', String(c.destOrd))
    ];
    if (c.type !== 'parOf') {attrs.push(attr('type', c.type)); }
    if (c.parTransId !== '0') {attrs.push(attr('parTransId', c.parTransId)); }
    if (c.sibTransId !== '0') {attrs.push(attr('sibTransId', c.sibTransId)); }
    if (c.presId !== '') {attrs.push(attr('presId', c.presId)); }
    return attrs;
}

/**
 * The body children.
 *
 * @param {ElementNode | null} body - The body.
 * @returns {ElementChild[]} The result.
 */
function bodyChildren(body: ElementNode | null): ElementChild[] {
    if (!body) {return []; }
    // Synthetic multi-child wrapper from parser.
    if (body.localName === '_body' && body.namespaceUri == null) {
        return body.children.map((c: ElementChild) =>
            c.kind === 'text' ? c : cloneElement(c)
        );
    }
    return [cloneElement(body)];
}

/**
 * The serialize point.
 *
 * @param {DiagramPoint} p - The p.
 * @returns {ElementNode} The result.
 */
function serializePoint(p: DiagramPoint): ElementNode {
    return el('pt', DGM_NAMESPACE, pointAttrs(p), bodyChildren(p.body), 'dgm');
}

/**
 * The serialize connection.
 *
 * @param {DiagramConnection} c - The c.
 * @returns {ElementNode} The result.
 */
function serializeConnection(c: DiagramConnection): ElementNode {
    return el('cxn', DGM_NAMESPACE, connectionAttrs(c), bodyChildren(c.body), 'dgm');
}

/**
 * Serialize CT_DataModel as `dgm:dataModel` (Transitional NS).
 *
 * @param {DiagramDataModel} model - The model.
 * @returns {ElementNode} The result.
 */
export function serializeDiagramData(model: DiagramDataModel): ElementNode {
    const children: ElementChild[] = [];

    children.push(
        el(
            'ptLst',
            DGM_NAMESPACE,
            [],
            model.points.map(serializePoint),
            'dgm'
        )
    );

    children.push(
        el(
            'cxnLst',
            DGM_NAMESPACE,
            [],
            model.connections.map(serializeConnection),
            'dgm'
        )
    );

    if (model.background) {
        const bg: ElementNode = cloneElement(model.background);
        children.push({
            ...bg,
            namespaceUri: (bg.namespaceUri != null ? bg.namespaceUri : DGM_NAMESPACE),
            localName: bg.localName || 'bg'
        });
    }
    if (model.whole) {
        const w: ElementNode = cloneElement(model.whole);
        children.push({
            ...w,
            namespaceUri: (w.namespaceUri != null ? w.namespaceUri : DGM_NAMESPACE),
            localName: w.localName || 'whole'
        });
    }
    if (model.extLst) {
        children.push(cloneElement(model.extLst));
    }

    return el('dataModel', DGM_NAMESPACE, [], children, 'dgm');
}

/**
 * The serialize diagram layout.
 *
 * @param {DiagramLayout} view - The view.
 * @returns {ElementNode} The result.
 */
export function serializeDiagramLayout(view: DiagramLayout): ElementNode {
    const root: ElementNode = cloneElement(view.root);
    // Force Transitional dgm NS on write.
    return {
        ...root,
        namespaceUri: DGM_NAMESPACE,
        localName: 'layoutDef',
        prefix: (root.prefix != null ? root.prefix : 'dgm')
    };
}

/**
 * The serialize diagram quick style.
 *
 * @param {DiagramQuickStyle} view - The view.
 * @returns {ElementNode} The result.
 */
export function serializeDiagramQuickStyle(view: DiagramQuickStyle): ElementNode {
    const root: ElementNode = cloneElement(view.root);
    return {
        ...root,
        namespaceUri: DGM_NAMESPACE,
        localName: 'styleDef',
        prefix: (root.prefix != null ? root.prefix : 'dgm')
    };
}

/**
 * The serialize diagram colors.
 *
 * @param {DiagramColors} view - The view.
 * @returns {ElementNode} The result.
 */
export function serializeDiagramColors(view: DiagramColors): ElementNode {
    const root: ElementNode = cloneElement(view.root);
    return {
        ...root,
        namespaceUri: DGM_NAMESPACE,
        localName: 'colorsDef',
        prefix: (root.prefix != null ? root.prefix : 'dgm')
    };
}

/**
 * The serialize diagram drawing.
 *
 * @param {DiagramDrawing} view - The view.
 * @returns {ElementNode} The result.
 */
export function serializeDiagramDrawing(view: DiagramDrawing): ElementNode {
    const root: ElementNode = cloneElement(view.root);
    // Prefer dsp NS if root was drawing.
    if (root.localName === 'drawing') {
        return {
            ...root,
            namespaceUri: (root.namespaceUri != null ? root.namespaceUri : DSP_NAMESPACE),
            prefix: (root.prefix != null ? root.prefix : 'dsp')
        };
    }
    return root;
}

/**
 * Helper: emit a minimal a:extLst shell (for tests / extensions).
 *
 * @param {ElementNode[]} children - The children.
 * @returns {ElementNode} The result.
 */
export function extLst(children: ElementNode[] = []): ElementNode {
    return el('extLst', A_NAMESPACE, [], children, 'a');
}
