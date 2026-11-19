/**
 * Parse Diagram Layout Definition part (`dgm:layoutDef` / `CT_DiagramDefinition`).
 *
 * @remarks
 * Citations: Transitional `dml-diagram.xsd` (`CT_DiagramDefinition`);
 * ECMA-376 Part 1 §14.2.5. v1: optional `uniqueId` + opaque root preserve.
 * Layout parts are not shared across diagrams (Part 1 §14.2.5).
 * @public
 */

import { cloneElement, getAttribute, parseDiagramXml, DiagramXmlElement } from './diagram-xml';
import { DiagramPartError } from './errors';
import { DIAGRAM_NAMESPACE } from './namespaces';
import { DiagramLayoutPart } from './types';

/**
 * Parses a Diagram Layout Definition part XML document into a {@link DiagramLayoutPart}.
 *
 * @param {string} xml - UTF-8 XML for a single `dgm:layoutDef` root.
 * @returns {DiagramLayoutPart} The result.
 * @throws {DiagramPartError} Malformed XML or wrong root element.
 * @public
 */
export function parseDiagramLayout(xml: string): DiagramLayoutPart {
    const root: DiagramXmlElement = parseDiagramXml(xml);
    if (root.localName !== 'layoutDef' || root.namespaceUri !== DIAGRAM_NAMESPACE) {
        throw new DiagramPartError(
            `Expected dgm:layoutDef root, got ${root.qName} in ns "${root.namespaceUri}"`
        );
    }
    const uniqueId: string = getAttribute(root, 'uniqueId');
    return {
        kind: 'diagramLayout',
        ...(uniqueId !== undefined ? { uniqueId } : {}),
        root: cloneElement(root)
    };
}
