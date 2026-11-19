/**
 * Parse Diagram Style part (`dgm:styleDef` / `CT_StyleDefinition`).
 *
 * @remarks
 * Citations: Transitional `dml-diagram.xsd` (`CT_StyleDefinition`);
 * ECMA-376 Part 1 §14.2.6. v1: optional `uniqueId` + opaque root preserve.
 * @public
 */

import { cloneElement, getAttribute, parseDiagramXml, DiagramXmlElement } from './diagram-xml';
import { DiagramPartError } from './errors';
import { DIAGRAM_NAMESPACE } from './namespaces';
import { DiagramStylePart } from './types';

/**
 * Parses a Diagram Style part XML document into a {@link DiagramStylePart}.
 *
 * @param {string} xml - UTF-8 XML for a single `dgm:styleDef` root.
 * @returns {DiagramStylePart} The result.
 * @throws {DiagramPartError} Malformed XML or wrong root element.
 * @public
 */
export function parseDiagramStyle(xml: string): DiagramStylePart {
    const root: DiagramXmlElement = parseDiagramXml(xml);
    if (root.localName !== 'styleDef' || root.namespaceUri !== DIAGRAM_NAMESPACE) {
        throw new DiagramPartError(
            `Expected dgm:styleDef root, got ${root.qName} in ns "${root.namespaceUri}"`
        );
    }
    const uniqueId: string = getAttribute(root, 'uniqueId');
    return {
        kind: 'diagramStyle',
        ...(uniqueId !== undefined ? { uniqueId } : {}),
        root: cloneElement(root)
    };
}
