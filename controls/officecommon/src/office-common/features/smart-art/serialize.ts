/**
 * Serialize DrawingML diagram parts from preserved root elements.
 *
 * @remarks
 * v1 serialize is root-identity: write the cloned `root` captured at parse time
 * so unknown children, attributes, and MC content round-trip. Citations:
 * ECMA-376 Part 1 §14.2.3–14.2.6; preserve policy in `docs/ooxml-mapping/smart-art.md`.
 * @public
 */

import { serializeDiagramXml } from './diagram-xml';
import {
    DiagramColorsPart,
    DiagramDataPart,
    DiagramLayoutPart,
    DiagramStylePart
} from './types';

/**
 * Serializes a {@link DiagramDataPart} to a Diagram Data part XML document.
 *
 * @param {DiagramDataPart} part - The part.
 * @returns {string} The result.
 * @remarks
 * Root-identity serialize of the cloned `root` captured at parse time. Kind is
 * enforced by the TypeScript parameter type; runtime kind mismatch checks live
 * on content-type handlers in `register.ts`.
 * @public
 */
export function serializeDiagramData(part: DiagramDataPart): string {
    return serializeDiagramXml(part.root);
}

/**
 * Serializes a {@link DiagramColorsPart} to a Diagram Colors part XML document.
 *
 * @param {DiagramColorsPart} part - The part.
 * @returns {string} The result.
 * @public
 */
export function serializeDiagramColors(part: DiagramColorsPart): string {
    return serializeDiagramXml(part.root);
}

/**
 * Serializes a {@link DiagramLayoutPart} to a Diagram Layout Definition part XML document.
 *
 * @param {DiagramLayoutPart} part - The part.
 * @returns {string} The result.
 * @public
 */
export function serializeDiagramLayout(part: DiagramLayoutPart): string {
    return serializeDiagramXml(part.root);
}

/**
 * Serializes a {@link DiagramStylePart} to a Diagram Style part XML document.
 *
 * @param {DiagramStylePart} part - The part.
 * @returns {string} The result.
 * @public
 */
export function serializeDiagramStyle(part: DiagramStylePart): string {
    return serializeDiagramXml(part.root);
}
