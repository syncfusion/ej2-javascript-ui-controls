/**
 * Parse Diagram Data part (`dgm:dataModel` / `CT_DataModel`).
 *
 * @remarks
 * Citations: Transitional `dml-diagram.xsd` (`CT_DataModel`, `CT_Pt`, `ST_PtType`,
 * `CT_Cxn`); ECMA-376 Part 1 §14.2.4. Required `ptLst`; optional `cxnLst` /
 * `bg` / `whole` / `extLst` preserved on the root element.
 * @public
 */

import { ownValue } from '../../core/own-value';
import {
    cloneElement,
    findChild,
    findChildren,
    getAttribute,
    parseDiagramXml,
    DiagramXmlElement
} from './diagram-xml';
import { DiagramPartError } from './errors';
import { DIAGRAM_NAMESPACE } from './namespaces';
import {
    DiagramPointType,
    DiagramConnection,
    DiagramDataPart,
    DiagramPoint
} from './types';

const POINT_TYPES: Set<string> = new Set<string>(
    (function(_o: { [key: string]: string }): string[] {
        return Object.keys(_o).map(function(k: string): string {
            return ownValue<string>(_o, k) as string;
        });
    })(DiagramPointType)
);

/**
 * The parse point.
 *
 * @param {DiagramXmlElement} el - The el.
 * @returns {DiagramPoint} The result.
 */
function parsePoint(el: DiagramXmlElement): DiagramPoint {
    const modelId: string = getAttribute(el, 'modelId');
    if (modelId === undefined || modelId.length === 0) {
        throw new DiagramPartError('dgm:pt requires modelId');
    }

    const typeRaw: string = getAttribute(el, 'type');
    const typeAttributePresent: boolean = typeRaw !== undefined;
    let type: DiagramPointType = DiagramPointType.Node;
    if (typeRaw !== undefined) {
        if (!POINT_TYPES.has(typeRaw)) {
            throw new DiagramPartError(`dgm:pt has unsupported type "${typeRaw}"`);
        }
        type = typeRaw as DiagramPointType;
    }

    const connectionId: string = getAttribute(el, 'cxnId');
    const textBody: DiagramXmlElement = findChild(el, 't', DIAGRAM_NAMESPACE);

    const point: DiagramPoint = {
        modelId,
        type,
        typeAttributePresent,
        ...(connectionId !== undefined ? { connectionId } : {}),
        ...(textBody !== undefined ? { textBody: cloneElement(textBody) } : {}),
        element: cloneElement(el)
    };
    return point;
}

/**
 * The parse connection.
 *
 * @param {DiagramXmlElement} el - The el.
 * @returns {DiagramConnection} The result.
 */
function parseConnection(el: DiagramXmlElement): DiagramConnection {
    const modelId: string = getAttribute(el, 'modelId');
    const sourceId: string = getAttribute(el, 'srcId');
    const destinationId: string = getAttribute(el, 'destId');
    if (modelId === undefined || modelId.length === 0) {
        throw new DiagramPartError('dgm:cxn requires modelId');
    }
    if (sourceId === undefined || sourceId.length === 0) {
        throw new DiagramPartError('dgm:cxn requires srcId');
    }
    if (destinationId === undefined || destinationId.length === 0) {
        throw new DiagramPartError('dgm:cxn requires destId');
    }
    return {
        modelId,
        sourceId,
        destinationId,
        element: cloneElement(el)
    };
}

/**
 * Parses a Diagram Data part XML document into a {@link DiagramDataPart}.
 *
 * @param {string} xml - UTF-8 XML for a single `dgm:dataModel` root.
 * @returns {DiagramDataPart} Modeled points/connections plus full root for preserve serialize.
 * @throws {DiagramPartError} Malformed XML, wrong root, or missing `ptLst`.
 * @public
 */
export function parseDiagramData(xml: string): DiagramDataPart {
    const root: DiagramXmlElement = parseDiagramXml(xml);
    if (root.localName !== 'dataModel' || root.namespaceUri !== DIAGRAM_NAMESPACE) {
        throw new DiagramPartError(
            `Expected dgm:dataModel root, got ${root.qName} in ns "${root.namespaceUri}"`
        );
    }

    const ptLst: DiagramXmlElement = findChild(root, 'ptLst', DIAGRAM_NAMESPACE);
    if (ptLst === undefined) {
        throw new DiagramPartError('dgm:dataModel requires dgm:ptLst');
    }

    const points: DiagramPoint[] = findChildren(ptLst, 'pt', DIAGRAM_NAMESPACE).map(parsePoint);

    const connections: DiagramConnection[] = [];
    const cxnLst: DiagramXmlElement = findChild(root, 'cxnLst', DIAGRAM_NAMESPACE);
    if (cxnLst !== undefined) {
        for (const cxn of findChildren(cxnLst, 'cxn', DIAGRAM_NAMESPACE)) {
            connections.push(parseConnection(cxn));
        }
    }

    return {
        kind: 'diagramData',
        points,
        connections,
        root: cloneElement(root)
    };
}
