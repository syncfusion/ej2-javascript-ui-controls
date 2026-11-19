/**
 * SmartArt feature registration — in-module content-type handler table.
 *
 * @remarks
 * This encryption-base tree has no shared FeatureRegistry. Handlers for the four
 * Transitional diagram content types live in a module-local map installed by
 * {@link registerSmartArtFeature}. Safe to call multiple times (idempotent).
 *
 * Citations: ECMA-376 Part 1 §14.2.3–14.2.6 content types.
 * @public
 */

import { DiagramPartError } from './errors';
import {
    DIAGRAM_COLORS_CONTENT_TYPE,
    DIAGRAM_DATA_CONTENT_TYPE,
    DIAGRAM_LAYOUT_CONTENT_TYPE,
    DIAGRAM_STYLE_CONTENT_TYPE
} from './namespaces';
import { parseDiagramColors } from './parse-colors';
import { parseDiagramData } from './parse-data';
import { parseDiagramLayout } from './parse-layout';
import { parseDiagramStyle } from './parse-style';
import {
    serializeDiagramColors,
    serializeDiagramData,
    serializeDiagramLayout,
    serializeDiagramStyle
} from './serialize';
import {
    DiagramColorsPart,
    DiagramDataPart,
    DiagramLayoutPart,
    DiagramPartHandler,
    DiagramStylePart
} from './types';

type AnyDiagramPart = DiagramDataPart | DiagramColorsPart | DiagramLayoutPart | DiagramStylePart;

const handlers: Map<string, DiagramPartHandler> = new Map<string, DiagramPartHandler>();

let installed: boolean = false;

/**
 * The install handlers.
 *
 * @returns {void} Nothing is returned.
 */
function installHandlers(): void {
    if (installed) {
        return;
    }

    const dataHandler: DiagramPartHandler = {
        contentType: DIAGRAM_DATA_CONTENT_TYPE,
        parse: (xml: string): AnyDiagramPart => parseDiagramData(xml),
        serialize: (part: AnyDiagramPart): string => {
            if (part.kind !== 'diagramData') {
                throw new DiagramPartError('Handler serialize kind mismatch for diagramData');
            }
            return serializeDiagramData(part);
        }
    };

    const colorsHandler: DiagramPartHandler = {
        contentType: DIAGRAM_COLORS_CONTENT_TYPE,
        parse: (xml: string): AnyDiagramPart => parseDiagramColors(xml),
        serialize: (part: AnyDiagramPart): string => {
            if (part.kind !== 'diagramColors') {
                throw new DiagramPartError('Handler serialize kind mismatch for diagramColors');
            }
            return serializeDiagramColors(part);
        }
    };

    const layoutHandler: DiagramPartHandler = {
        contentType: DIAGRAM_LAYOUT_CONTENT_TYPE,
        parse: (xml: string): AnyDiagramPart => parseDiagramLayout(xml),
        serialize: (part: AnyDiagramPart): string => {
            if (part.kind !== 'diagramLayout') {
                throw new DiagramPartError('Handler serialize kind mismatch for diagramLayout');
            }
            return serializeDiagramLayout(part);
        }
    };

    const styleHandler: DiagramPartHandler = {
        contentType: DIAGRAM_STYLE_CONTENT_TYPE,
        parse: (xml: string): AnyDiagramPart => parseDiagramStyle(xml),
        serialize: (part: AnyDiagramPart): string => {
            if (part.kind !== 'diagramStyle') {
                throw new DiagramPartError('Handler serialize kind mismatch for diagramStyle');
            }
            return serializeDiagramStyle(part);
        }
    };

    handlers.set(DIAGRAM_DATA_CONTENT_TYPE, dataHandler);
    handlers.set(DIAGRAM_COLORS_CONTENT_TYPE, colorsHandler);
    handlers.set(DIAGRAM_LAYOUT_CONTENT_TYPE, layoutHandler);
    handlers.set(DIAGRAM_STYLE_CONTENT_TYPE, styleHandler);
    installed = true;
}

/**
 * Registers SmartArt (DrawingML diagram) parse/serialize handlers for the four
 * Transitional diagram content types.
 *
 * @returns {void} Nothing is returned.
 * @remarks
 * Idempotent: subsequent calls leave the installed table unchanged.
 * Does not accept or return PowerPoint, Word, or Excel product types.
 * @public
 */
export function registerSmartArtFeature(): void {
    installHandlers();
}

/**
 * Looks up a registered diagram part handler by content type.
 *
 * @param {string} contentType - One of the four Transitional diagram content types.
 * @returns {DiagramPartHandler | undefined} The handler, or `undefined` if registration has not run or the type is unknown.
 * @public
 */
export function getDiagramPartHandler(contentType: string): DiagramPartHandler | undefined {
    return handlers.get(contentType);
}
