/**
 * Parse Diagram Colors part (`dgm:colorsDef` / `CT_ColorTransform`).
 *
 * @remarks
 * Citations: Transitional `dml-diagram.xsd` (`CT_ColorTransform`);
 * ECMA-376 Part 1 §14.2.3. v1: optional `uniqueId` + opaque root preserve.
 * @public
 */

import { cloneElement, getAttribute, parseDiagramXml, DiagramXmlElement } from './diagram-xml';
import { DiagramPartError } from './errors';
import { DIAGRAM_NAMESPACE } from './namespaces';
import { DiagramColorsPart } from './types';

/**
 * Parses a Diagram Colors part XML document into a {@link DiagramColorsPart}.
 *
 * @param {string} xml - UTF-8 XML for a single `dgm:colorsDef` root.
 * @returns {DiagramColorsPart} The result.
 * @throws {DiagramPartError} Malformed XML or wrong root element.
 * @public
 */
export function parseDiagramColors(xml: string): DiagramColorsPart {
    const root: DiagramXmlElement = parseDiagramXml(xml);
    if (root.localName !== 'colorsDef' || root.namespaceUri !== DIAGRAM_NAMESPACE) {
        throw new DiagramPartError(
            `Expected dgm:colorsDef root, got ${root.qName} in ns "${root.namespaceUri}"`
        );
    }
    const uniqueId: string = getAttribute(root, 'uniqueId');
    return {
        kind: 'diagramColors',
        ...(uniqueId !== undefined ? { uniqueId } : {}),
        root: cloneElement(root)
    };
}
