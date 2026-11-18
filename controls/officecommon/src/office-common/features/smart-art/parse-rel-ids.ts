/**
 * Parse `dgm:relIds` (`CT_RelIds`) from host graphic-data XML.
 *
 * @remarks
 * Citations: `dml-diagram.xsd` `CT_RelIds` (required `r:dm`/`r:lo`/`r:qs`/`r:cs`);
 * [MS-ODRAWXML] §3.7.1 sample; [MS-OE376] GraphicData URI → `relIds`.
 *
 * Explicit parse APIs throw {@link DiagramPartError} when any required attribute
 * is missing or empty. Package enumerate (preserve-on-load) skips incomplete
 * hooks without throwing — see {@link findDiagramRelIds}.
 * @public
 */

import {
    elementChildren,
    findChild,
    getAttribute,
    parseDiagramXml,
    DiagramXmlElement
} from './diagram-xml';
import { DiagramPartError } from './errors';
import {
    DIAGRAM_GRAPHIC_DATA_URI,
    DIAGRAM_NAMESPACE,
    DRAWINGML_MAIN_NAMESPACE,
    OFFICE_DOCUMENT_RELATIONSHIPS_NAMESPACE
} from './namespaces';
import { DiagramRelIds } from './types';

/**
 * The read rel id attr.
 *
 * @param {DiagramXmlElement} el - The el.
 * @param {string} localName - The local name.
 * @returns {string | undefined} The result.
 */
function readRelIdAttr(el: DiagramXmlElement, localName: string): string | undefined {
    const value: string = getAttribute(el, localName, OFFICE_DOCUMENT_RELATIONSHIPS_NAMESPACE);
    if (value === undefined) {
        return undefined;
    }
    const trimmed: string = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Reads the four required `CT_RelIds` attributes from a `dgm:relIds` element.
 *
 * @param {DiagramXmlElement} el - The el.
 * @returns {DiagramRelIds | undefined} The ids, or `undefined` when any required attribute is missing/empty
(preserve path for package open).
 * @private
 */
export function tryReadDiagramRelIds(el: DiagramXmlElement): DiagramRelIds | undefined {
    if (el.localName !== 'relIds' || el.namespaceUri !== DIAGRAM_NAMESPACE) {
        return undefined;
    }
    const dm: string = readRelIdAttr(el, 'dm');
    const lo: string = readRelIdAttr(el, 'lo');
    const qs: string = readRelIdAttr(el, 'qs');
    const cs: string = readRelIdAttr(el, 'cs');
    if (dm === undefined || lo === undefined || qs === undefined || cs === undefined) {
        return undefined;
    }
    return { dm, lo, qs, cs };
}

/**
 * Requires a complete `CT_RelIds` on the element or throws.
 *
 * @param {DiagramXmlElement} el - The el.
 * @returns {DiagramRelIds} The result.
 * @private
 */
export function requireDiagramRelIds(el: DiagramXmlElement): DiagramRelIds {
    const ids: DiagramRelIds = tryReadDiagramRelIds(el);
    if (ids === undefined) {
        throw new DiagramPartError(
            'dgm:relIds requires non-empty r:dm, r:lo, r:qs, and r:cs (CT_RelIds)'
        );
    }
    return ids;
}

/**
 * The collect rel ids elements.
 *
 * @param {DiagramXmlElement} root - The root.
 * @param {DiagramXmlElement[]} out - The out.
 * @returns {void} Nothing is returned.
 */
function collectRelIdsElements(
    root: DiagramXmlElement,
    out: DiagramXmlElement[]
): void {
    if (root.localName === 'relIds' && root.namespaceUri === DIAGRAM_NAMESPACE) {
        out.push(root);
    }
    for (const child of elementChildren(root)) {
        collectRelIdsElements(child, out);
    }
}

/**
 * True when `el` is `a:graphicData` with the diagram GraphicData URI.
 *
 * @param {DiagramXmlElement} el - The el.
 * @returns {boolean} The result.
 * @private
 */
export function isDiagramGraphicData(el: DiagramXmlElement): boolean {
    if (el.localName !== 'graphicData' || el.namespaceUri !== DRAWINGML_MAIN_NAMESPACE) {
        return false;
    }
    const uri: string = getAttribute(el, 'uri', '');
    return uri === DIAGRAM_GRAPHIC_DATA_URI;
}

/**
 * The find path.
 *
 * @param {DiagramXmlElement} node - The node.
 * @param {DiagramXmlElement} target - The target.
 * @param {DiagramXmlElement[]} path - The path.
 * @returns {boolean} The result.
 */
function findPath(
    node: DiagramXmlElement,
    target: DiagramXmlElement,
    path: DiagramXmlElement[]
): boolean {
    path.push(node);
    if (node === target) {
        return true;
    }
    for (const child of elementChildren(node)) {
        if (findPath(child, target, path)) {
            return true;
        }
    }
    path.pop();
    return false;
}

/**
 * The find owning graphic data.
 *
 * @param {DiagramXmlElement} root - The root.
 * @param {DiagramXmlElement} target - The target.
 * @returns {DiagramXmlElement | undefined} The result.
 */
function findOwningGraphicData(
    root: DiagramXmlElement,
    target: DiagramXmlElement
): DiagramXmlElement | undefined {
    const path: DiagramXmlElement[] = [];
    if (!findPath(root, target, path)) {
        return undefined;
    }
    for (const node of path.slice().reverse()) {
        if (
            node !== undefined &&
      node.localName === 'graphicData' &&
      node.namespaceUri === DRAWINGML_MAIN_NAMESPACE
        ) {
            return node;
        }
    }
    return undefined;
}

/**
 * Finds complete `dgm:relIds` payloads under diagram `a:graphicData` hooks.
 *
 * @param {string} xml - Host part or fragment XML that may contain `a:graphicData` /
`dgm:relIds`.
 * @returns {ReadonlyArray<DiagramRelIds>} Zero or more complete {@link DiagramRelIds} values in document order.
 * @remarks
 * Incomplete `CT_RelIds` (missing/empty required attributes) are skipped — the
 * preserve-on-load policy for package open. Use {@link parseDiagramRelIds} when
 * the caller explicitly requires a complete hook.
 *
 * When a `relIds` element is nested under `a:graphicData`, only diagram URI
 * hooks are accepted. A bare `dgm:relIds` document root is always accepted when
 * complete.
 * @public
 */
export function findDiagramRelIds(xml: string): ReadonlyArray<DiagramRelIds> {
    const root: DiagramXmlElement = parseDiagramXml(xml);
    const elements: DiagramXmlElement[] = [];
    collectRelIdsElements(root, elements);

    const accepted: DiagramRelIds[] = [];
    for (const el of elements) {
        const ids: DiagramRelIds = tryReadDiagramRelIds(el);
        if (ids === undefined) {
            continue;
        }
        if (el === root) {
            accepted.push(ids);
            continue;
        }
        const owner: DiagramXmlElement = findOwningGraphicData(root, el);
        if (owner === undefined || isDiagramGraphicData(owner)) {
            accepted.push(ids);
        }
    }
    return accepted;
}

/**
 * Parses a complete `dgm:relIds` (`CT_RelIds`) from XML.
 *
 * @param {string} xml - XML text.
 * @returns {DiagramRelIds} The four relationship id strings.
 * @remarks
 * Accepts a document whose root is `dgm:relIds`, or a larger tree containing
 * exactly one complete diagram `relIds` hook (as returned by
 * {@link findDiagramRelIds}). Throws when none or multiple complete hooks are
 * present, or when the only hook is incomplete.
 * @throws {DiagramPartError} Incomplete or ambiguous `relIds`.
 * @public
 */
export function parseDiagramRelIds(xml: string): DiagramRelIds {
    const root: DiagramXmlElement = parseDiagramXml(xml);

    if (root.localName === 'relIds' && root.namespaceUri === DIAGRAM_NAMESPACE) {
        return requireDiagramRelIds(root);
    }

    // Single graphicData → relIds convenience (MS-ODRAWXML sample shape).
    if (isDiagramGraphicData(root)) {
        const child: DiagramXmlElement = findChild(root, 'relIds', DIAGRAM_NAMESPACE);
        if (child === undefined) {
            throw new DiagramPartError('a:graphicData (diagram) is missing dgm:relIds');
        }
        return requireDiagramRelIds(child);
    }

    const found: ReadonlyArray<DiagramRelIds> = findDiagramRelIds(xml);
    if (found.length === 0) {
        const elements: DiagramXmlElement[] = [];
        collectRelIdsElements(root, elements);
        if (elements.length > 0) {
            throw new DiagramPartError(
                'dgm:relIds requires non-empty r:dm, r:lo, r:qs, and r:cs (CT_RelIds)'
            );
        }
        throw new DiagramPartError('No dgm:relIds element found');
    }
    if (found.length > 1) {
        throw new DiagramPartError('parseDiagramRelIds expects exactly one dgm:relIds hook');
    }
    const only: DiagramRelIds = found[0];
    if (only === undefined) {
        throw new DiagramPartError('No dgm:relIds element found');
    }
    return only;
}
