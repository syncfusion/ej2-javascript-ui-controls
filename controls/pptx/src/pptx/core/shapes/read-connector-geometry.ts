/**
 * Read connector ends and geometry kind from live shape DOM (preserve path).
 *
 * @remarks
 * Classification only — does not mutate markup, invent `@id`/`@idx`, or rewrite
 * `custGeom` ↔ `prstGeom`. Citation: Transitional `dml-main.xsd`
 * `CT_NonVisualConnectorProperties`, `CT_Connection`, `EG_Geometry`; `pml.xsd`
 * `CT_Connector` / `CT_ConnectorNonVisual`.
 *
 * @internal
 */
import { PML_NS } from '../presentation/constants';
import { arrayAt } from '../util/es5-compat';
import { OoxmlElement, OoxmlText } from '../xml/index';
import {
    ConnectorConnection, ConnectorEnds, CustomGeometryCommand, CustomGeometryConnectionSite,
    CustomGeometryPath, CustomGeometryPoint, DirectGeometry, GeometryGuide, GeometryKind
} from './connector-geometry-types';
import { DML_NS } from './constants';
import { findChild, getAttr } from './dom-utils';
import { findShapeSpPr } from './read-fill-line';
/**
 * Locates `p:nvCxnSpPr` under a connector element.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @returns {OoxmlElement | undefined} The result.
 */
function findNvCxnSpPr(shapeElement: OoxmlElement): OoxmlElement | undefined {
    let el: OoxmlElement | undefined = findChild(shapeElement, PML_NS, 'nvCxnSpPr');
    if (el === undefined) {
        el = findChild(shapeElement, DML_NS, 'nvCxnSpPr');
    }
    return el;
}
/**
 * Locates `p:cNvCxnSpPr` / `a:cNvCxnSpPr` under non-visual connector props.
 *
 * @internal
 * @param {OoxmlElement} nvCxnSpPr - The nvCxnSpPr value.
 * @returns {OoxmlElement | undefined} The result.
 */
function findCNvCxnSpPr(nvCxnSpPr: OoxmlElement): OoxmlElement | undefined {
    return (findChild(nvCxnSpPr, PML_NS, 'cNvCxnSpPr') !== null &&
        findChild(nvCxnSpPr, PML_NS, 'cNvCxnSpPr') !== undefined ? findChild(nvCxnSpPr, PML_NS, 'cNvCxnSpPr') : findChild(nvCxnSpPr, DML_NS, 'cNvCxnSpPr'));
}
/**
 * Parses one `CT_Connection` element; returns `undefined` when required attrs incomplete.
 *
 * @internal
 * @param {OoxmlElement | undefined} el - The el value.
 * @returns {ConnectorConnection | undefined} The result.
 */
function readConnection(el: OoxmlElement | undefined): ConnectorConnection | undefined {
    if (el === undefined) {
        return undefined;
    }
    const id: string = getAttr(el, '', 'id');
    const idxRaw: string = getAttr(el, '', 'idx');
    if (id === undefined || id === '' || idxRaw === undefined || idxRaw === '') {
        return undefined;
    }
    // xsd:unsignedInt — reject non-decimal / negative / non-integer strings.
    if (!/^\d+$/.test(idxRaw)) {
        return undefined;
    }
    const siteIndex: number = Number(idxRaw);
    if (!Number.isSafeInteger(siteIndex)) {
        return undefined;
    }
    return { drawingElementId: id, siteIndex };
}
/**
 * Reads optional `a:stCxn` / `a:endCxn` from a connector shape element.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - Live `p:cxnSp` (or kind-checked caller).
 * @param {boolean} isConnector - When false, returns empty ends without walking markup.
 * @returns {ConnectorEnds} Start/end when complete; omits incomplete or missing ends.
 */
export function readConnectorEndsFromElement(shapeElement: OoxmlElement, isConnector: boolean): ConnectorEnds {
    if (!isConnector) {
        return {};
    }
    const nv: OoxmlElement = findNvCxnSpPr(shapeElement);
    if (nv === undefined) {
        return {};
    }
    const cNv: OoxmlElement = findCNvCxnSpPr(nv);
    if (cNv === undefined) {
        return {};
    }
    let startEl: OoxmlElement | undefined = findChild(cNv, DML_NS, 'stCxn');
    if (startEl === undefined) {
        startEl = findChild(cNv, PML_NS, 'stCxn');
    }
    let endEl: OoxmlElement | undefined = findChild(cNv, DML_NS, 'endCxn');
    if (endEl === undefined) {
        endEl = findChild(cNv, PML_NS, 'endCxn');
    }
    const start: ConnectorConnection | undefined = readConnection(startEl);
    const end: ConnectorConnection | undefined = readConnection(endEl);
    const ends: {
        start?: ConnectorConnection;
        end?: ConnectorConnection;
    } = {};
    if (start !== undefined) {
        ends.start = start;
    }
    if (end !== undefined) {
        ends.end = end;
    }
    return ends;
}
/**
 * Classifies `EG_Geometry` under shape `spPr`.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @returns {GeometryKind} The result.
 */
export function readGeometryKindFromElement(shapeElement: OoxmlElement): GeometryKind {
    const spPr: OoxmlElement = findShapeSpPr(shapeElement);
    if (spPr === undefined) {
        return 'none';
    }
    if (findChild(spPr, DML_NS, 'custGeom') !== undefined || findChild(spPr, PML_NS, 'custGeom') !== undefined) {
        return 'custom';
    }
    if (findChild(spPr, DML_NS, 'prstGeom') !== undefined || findChild(spPr, PML_NS, 'prstGeom') !== undefined) {
        return 'preset';
    }
    return 'none';
}

/**
 * Reads the direct geometry choice and authored preset adjustment guides.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - Live shape element.
 * @returns {DirectGeometry} Direct geometry without resolving or rewriting it.
 */
export function readDirectGeometryFromElement(shapeElement: OoxmlElement): DirectGeometry {
    const spPr: OoxmlElement = findShapeSpPr(shapeElement);
    if (spPr === undefined) {
        return { kind: 'none' };
    }
    let cust: OoxmlElement | undefined = findChild(spPr, DML_NS, 'custGeom');
    if (cust === undefined) {
        cust = findChild(spPr, PML_NS, 'custGeom');
    }
    if (cust !== undefined) {
        return {
            kind: 'custom',
            adjustments: readGuideList(findChild(cust, DML_NS, 'avLst')),
            guides: readGuideList(findChild(cust, DML_NS, 'gdLst')),
            connectionSites: readConnectionSites(findChild(cust, DML_NS, 'cxnLst')),
            paths: readCustomPaths(findChild(cust, DML_NS, 'pathLst'))
        };
    }
    let prst: OoxmlElement | undefined = findChild(spPr, DML_NS, 'prstGeom');
    if (prst === undefined) {
        prst = findChild(spPr, PML_NS, 'prstGeom');
    }
    if (prst !== undefined) {
        const preset: string = getAttr(prst, '', 'prst');
        if (preset === undefined || preset.length === 0) {
            return { kind: 'none' };
        }
        return { kind: 'preset', preset, adjustments: readGuideList(findChild(prst, DML_NS, 'avLst')) };
    }
    return { kind: 'none' };
}

/** Reads authored guide rows in document order.
 * @param {OoxmlElement | undefined} list - Optional guide-list element.
 * @returns {GeometryGuide[]} Authored guide names and formula strings.
 */
function readGuideList(list: OoxmlElement | undefined): GeometryGuide[] {
    const result: GeometryGuide[] = [];
    for (const child of elementChildren(list)) {
        if (child.localName !== 'gd') {continue; }
        const name: string = getAttr(child, '', 'name');
        const formula: string = getAttr(child, '', 'fmla');
        if (name !== undefined && formula !== undefined) {result.push({ name, formula }); }
    }
    return result;
}

/** Reads custom-geometry connection sites without resolving formulae.
 * @param {OoxmlElement | undefined} list - Optional connection-site list.
 * @returns {CustomGeometryConnectionSite[]} Authored sites in document order.
 */
function readConnectionSites(list: OoxmlElement | undefined): CustomGeometryConnectionSite[] {
    const result: CustomGeometryConnectionSite[] = [];
    for (const child of elementChildren(list)) {
        if (child.localName !== 'cxn') {continue; }
        const angle: string = getAttr(child, '', 'ang');
        const point: CustomGeometryPoint | undefined = readPoint(findChild(child, DML_NS, 'pos'));
        if (angle !== undefined && point !== undefined) {result.push({ angle, point }); }
    }
    return result;
}

/** Reads custom paths while retaining their authored coordinate spaces.
 * @param {OoxmlElement | undefined} list - Optional custom path list.
 * @returns {CustomGeometryPath[]} Authored paths in document order.
 */
function readCustomPaths(list: OoxmlElement | undefined): CustomGeometryPath[] {
    const result: CustomGeometryPath[] = [];
    for (const path of elementChildren(list)) {
        if (path.localName !== 'path') {continue; }
        const strokeRaw: string = getAttr(path, '', 'stroke');
        result.push({
            width: getAttr(path, '', 'w'),
            height: getAttr(path, '', 'h'),
            fill: getAttr(path, '', 'fill'),
            stroke: parseOptionalBoolean(strokeRaw),
            commands: readPathCommands(path)
        });
    }
    return result;
}

/** Reads one custom path's supported DrawingML commands.
 * @param {OoxmlElement} path - The `a:path` element.
 * @returns {CustomGeometryCommand[]} Authored commands in document order.
 */
function readPathCommands(path: OoxmlElement): CustomGeometryCommand[] {
    const result: CustomGeometryCommand[] = [];
    for (const command of elementChildren(path)) {
        if (command.localName === 'close') {
            result.push({ kind: 'close' });
            continue;
        }
        if (command.localName === 'arcTo') {
            const widthRadius: string = getAttr(command, '', 'wR');
            const heightRadius: string = getAttr(command, '', 'hR');
            const startAngle: string = getAttr(command, '', 'stAng');
            const sweepAngle: string = getAttr(command, '', 'swAng');
            if (widthRadius !== undefined && heightRadius !== undefined &&
                startAngle !== undefined && sweepAngle !== undefined) {
                result.push({ kind: 'arc', widthRadius, heightRadius, startAngle, sweepAngle });
            }
            continue;
        }
        const points: CustomGeometryPoint[] = elementChildren(command)
            .filter((child: OoxmlElement): boolean => child.localName === 'pt')
            .map(readPoint)
            .filter((point: CustomGeometryPoint | undefined): point is CustomGeometryPoint => point !== undefined);
        if (command.localName === 'moveTo' && points[0] !== undefined) {result.push({ kind: 'move', point: points[0] }); }
        else if (command.localName === 'lnTo' && points[0] !== undefined) {result.push({ kind: 'line', point: points[0] }); }
        else if (command.localName === 'quadBezTo' && points.length >= 2) {result.push({ kind: 'quadratic', points }); }
        else if (command.localName === 'cubicBezTo' && points.length >= 3) {result.push({ kind: 'cubic', points }); }
    }
    return result;
}

/** Reads one formula-backed point.
 * @param {OoxmlElement | undefined} element - Optional point element.
 * @returns {CustomGeometryPoint | undefined} Authored point expressions.
 */
function readPoint(element: OoxmlElement | undefined): CustomGeometryPoint | undefined {
    if (element === undefined) {return undefined; }
    const x: string = getAttr(element, '', 'x');
    const y: string = getAttr(element, '', 'y');
    return x === undefined || y === undefined ? undefined : { x, y };
}

/** Lists direct DrawingML element children.
 * @param {OoxmlElement | undefined} parent - Optional parent element.
 * @returns {OoxmlElement[]} Direct DrawingML children.
 */
function elementChildren(parent: OoxmlElement | undefined): OoxmlElement[] {
    const result: OoxmlElement[] = [];
    if (parent === undefined) {return result; }
    for (let index: number = 0; index < parent.children.length; index++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, index);
        if (child.kind === 'element' && child.namespaceUri === DML_NS) {result.push(child); }
    }
    return result;
}

/** Parses an optional OOXML boolean token.
 * @param {string | undefined} value - Authored boolean token.
 * @returns {boolean | undefined} Parsed value, or undefined for invalid/missing input.
 */
function parseOptionalBoolean(value: string | undefined): boolean | undefined {
    if (value === undefined) {return undefined; }
    if (value === '1' || value.toLowerCase() === 'true') {return true; }
    if (value === '0' || value.toLowerCase() === 'false') {return false; }
    return undefined;
}
