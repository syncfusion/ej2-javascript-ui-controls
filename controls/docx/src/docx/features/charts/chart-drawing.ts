/**
 * Inline DrawingML run for a chart (`w:r/w:drawing/wp:inline/a:graphic/a:graphicData/c:chart`).
 * ECMA-376-1 §20.4.2.8 (wp:inline), §21.2.2.27 (c:chart).
 *
 * @private
 */
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { pointToEmus } from '../document/length';
import { wmlElement } from '../document/wml';

const WP_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing';
const A_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/main';
const C_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/chart';
const R_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

function el(ns: string, prefix: string, local: string, attributes: OpenXmlAttribute[] = [], children: OpenXmlChild[] = [],
            decls: Array<{ prefix: string; namespaceUri: string }> = []): OpenXmlElement {
    return { kind: 'element', namespaceUri: ns, localName: local, prefix, attributes, namespaceDeclarations: decls, children };
}

function at(local: string, value: string, ns: string = '', prefix: string = ''): OpenXmlAttribute {
    return { namespaceUri: ns, localName: local, prefix, value };
}

/**
 * Build the `w:r` that hosts an inline chart.
 *
 * @param {string} relationshipId - The relationship id.
 * @param {number} widthPt - The width pt.
 * @param {number} heightPt - The height pt.
 * @param {number} docPrId - The doc pr id.
 * @param {string} name - The name.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function buildChartRun(relationshipId: string, widthPt: number, heightPt: number, docPrId: number, name: string): OpenXmlElement {
    const chartRef: OpenXmlElement = el(C_NS, 'c', 'chart', [at('id', relationshipId, R_NS, 'r')], [], [
        { prefix: 'c', namespaceUri: C_NS },
        { prefix: 'r', namespaceUri: R_NS }
    ]);
    const graphicData: OpenXmlElement = el(A_NS, 'a', 'graphicData', [at('uri', C_NS)], [chartRef]);
    const graphic: OpenXmlElement = el(A_NS, 'a', 'graphic', [], [graphicData], [{ prefix: 'a', namespaceUri: A_NS }]);
    const inline: OpenXmlElement = el(WP_NS, 'wp', 'inline', [at('distT', '0'), at('distB', '0'), at('distL', '0'), at('distR', '0')], [
        el(WP_NS, 'wp', 'extent', [at('cx', String(pointToEmus(widthPt))), at('cy', String(pointToEmus(heightPt)))]),
        el(WP_NS, 'wp', 'effectExtent', [at('l', '0'), at('t', '0'), at('r', '0'), at('b', '0')]),
        el(WP_NS, 'wp', 'docPr', [at('id', String(docPrId)), at('name', name)]),
        el(WP_NS, 'wp', 'cNvGraphicFramePr'),
        graphic
    ], [{ prefix: 'wp', namespaceUri: WP_NS }]);
    return wmlElement('r', { children: [wmlElement('drawing', { children: [inline] })] });
}
