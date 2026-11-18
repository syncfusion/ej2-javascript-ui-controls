/**
 * SmartArtDiagram — bound instance of data + layout + style + colors + optional drawing.
 * Host detection via a:graphicData@uri + dgm:relIds (CT_RelIds).
 *
 * Citations:
 * - dml-diagram.xsd CT_RelIds (r:dm, r:lo, r:qs, r:cs all REQUIRED)
 * - Requirement §16.3 host embedding
 * - [MS-ODRAWXML] optional diagramDrawing
 */

import { Literal } from '../../core/literal-type';
import { DIAGRAM_GRAPHIC_DATA_URI, isDiagramGraphicDataUri, isDgmNamespace, isRNamespace, R_NAMESPACE } from './constants';
import { DiagramDataModel } from './diagram-data-model';
import { isDiagramDataModel } from './diagram-data-model';
import { DiagramColors, DiagramDrawing, DiagramLayout, DiagramQuickStyle } from './diagram-views';
import { isDiagramColors, isDiagramDrawing, isDiagramLayout, isDiagramQuickStyle } from './diagram-views';
import { ElementNode } from './element-tree';
import { findChild, findChildren, getAttr, getAttrNS } from './element-tree';
import { DiagramError, DiagramParseError } from './errors';
const SMART_ART_BRAND: unique symbol = Symbol.for('@syncfusion/ej2-office-common.SmartArtDiagram');

/**
 * CT_RelIds relationship id quartet (all required on markup).
 * Values are relationship Ids (e.g. rId1), not target URIs.
 */
export interface DiagramRelIds {
    readonly dm: string;
    readonly lo: string;
    readonly qs: string;
    readonly cs: string;
}
export interface SmartArtDiagramInit {
    readonly relIds: DiagramRelIds;
    readonly data: DiagramDataModel;
    readonly layout: DiagramLayout;
    readonly quickStyle: DiagramQuickStyle;
    readonly colors: DiagramColors;
    readonly drawing?: DiagramDrawing | null;
    /**
     * Optional relationship id of the MS drawing part when present.
     * Source may be dataModel/extLst dsp:dataModelExt/@relId (Word-observed)
     * or another package path — preserve as found.
     */
    readonly drawingRelId?: string | null;
    readonly drawingRelSource?: 'dataModelExt' | 'package' | 'unknown' | null;
}
/**
 * The require rel id.
 *
 * @param {string | undefined} value - The value.
 * @param {string} name - The name.
 * @returns {string} The result.
 */
function requireRelId(value: string | undefined, name: string): string {
    if (value == null || value === '') {
        throw new DiagramParseError('invalid_rel_ids', `dgm:relIds missing required r:${name}.`);
    }
    return value;
}

/**
 * Read CT_RelIds from a `dgm:relIds` element.
 * Attributes are in the relationships namespace: r:dm, r:lo, r:qs, r:cs.
 *
 * @param {ElementNode} el - The el.
 * @returns {DiagramRelIds} The result.
 */
export function parseRelIds(el: ElementNode): DiagramRelIds {
    if (!isDgmNamespace(el.namespaceUri) || el.localName !== 'relIds') {
        throw new DiagramParseError('invalid_root', `Expected dgm:relIds, got {${el.namespaceUri != null ? el.namespaceUri : 'null'}}${el.localName}.`);
    }
    const read: (local: string) => string = (local: string): string => {
    // Prefer r: NS; fall back to unprefixed / any.
        const nsVal: string = function (): string {
            const _nc: string = function (): string {
                const _nc: string = getAttrNS(el, local, R_NAMESPACE);
                return _nc != null ? _nc : (() => {
                    for (const a of el.attributes) {
                        if (a.name === local && isRNamespace(a.namespaceUri != null ? a.namespaceUri : null)) {return a.value; }
                    }
                    return undefined;
                })();
            }();
            return _nc != null ? _nc : getAttr(el, local);
        }();
        return requireRelId(nsVal, local);
    };
    return {
        dm: read('dm'),
        lo: read('lo'),
        qs: read('qs'),
        cs: read('cs')
    };
}

/**
 * Detect whether an a:graphicData (or subtree) hosts a diagram.
 * Returns relIds element when DIAGRAM_GRAPHIC_DATA_URI matches and dgm:relIds present.
 *
 * @param {ElementNode} graphicData - The graphic data.
 * @returns {*} The result.
 */
export function findDiagramRelIdsInGraphicData(graphicData: ElementNode): {
    relIdsEl: ElementNode;
    relIds: DiagramRelIds;
} | undefined {
    const uri: string = getAttr(graphicData, 'uri');
    if (!isDiagramGraphicDataUri(uri)) {return undefined; }
    const relIdsEl: ElementNode = function (): ElementNode {
        const _nc: ElementNode = findChild(graphicData, 'relIds', isDgmNamespace);
        return _nc != null ? _nc : findChildren(graphicData, 'relIds').find((c: ElementNode) => isDgmNamespace(c.namespaceUri));
    }();
    if (!relIdsEl) {return undefined; }
    return {
        relIdsEl,
        relIds: parseRelIds(relIdsEl)
    };
}

/**
 * Walk a host fragment (e.g. w:drawing) looking for diagram graphicData.
 *
 * @param {ElementNode} tree - The tree.
 * @returns {*} The result.
 */
export function detectSmartArtInTree(tree: ElementNode): {
    graphicData: ElementNode;
    relIds: DiagramRelIds;
} | undefined {
    const stack: ElementNode[] = [tree];
    while (stack.length > 0) {
        const n: ElementNode = stack.pop();
        if (n === undefined) {break; }
        if (n.localName === 'graphicData') {
            const hit: { relIdsEl: ElementNode; relIds: DiagramRelIds; } = findDiagramRelIdsInGraphicData(n);
            if (hit) {return {
                graphicData: n,
                relIds: hit.relIds
            }; }
        }
        for (const c of n.children) {
            if (c.kind === 'element') {stack.push(c); }
        }
    }
    return undefined;
}
/**
 * The is smart art graphic data uri.
 *
 * @param {string | null | undefined} uri - The uri.
 * @returns {boolean} The result.
 */
export function isSmartArtGraphicDataUri(uri: string | null | undefined): boolean {
    return isDiagramGraphicDataUri(uri);
}

/**
 * Bound SmartArt instance. `data()` returns DiagramDataModel (instanceof).
 */
export class SmartArtDiagram {
    readonly [SMART_ART_BRAND]: Literal<true> = true;
    private _relIds: DiagramRelIds;
    private _data: DiagramDataModel;
    private _layout: DiagramLayout;
    private _quickStyle: DiagramQuickStyle;
    private _colors: DiagramColors;
    private _drawing: DiagramDrawing | null;
    private _drawingRelId: string | null;
    private _drawingRelSource: 'dataModelExt' | 'package' | 'unknown' | null;
    constructor(init: SmartArtDiagramInit) {
        if (!isDiagramDataModel(init.data)) {
            throw new DiagramError('catalog_error', 'SmartArtDiagram.data must be DiagramDataModel.');
        }
        if (!isDiagramLayout(init.layout)) {
            throw new DiagramError('catalog_error', 'SmartArtDiagram.layout must be DiagramLayout.');
        }
        if (!isDiagramQuickStyle(init.quickStyle)) {
            throw new DiagramError('catalog_error', 'SmartArtDiagram.quickStyle must be DiagramQuickStyle.');
        }
        if (!isDiagramColors(init.colors)) {
            throw new DiagramError('catalog_error', 'SmartArtDiagram.colors must be DiagramColors.');
        }
        if (init.drawing != null && !isDiagramDrawing(init.drawing)) {
            throw new DiagramError('catalog_error', 'SmartArtDiagram.drawing must be DiagramDrawing or null.');
        }
        this._relIds = {
            ...init.relIds
        };
        this._data = init.data;
        this._layout = init.layout;
        this._quickStyle = init.quickStyle;
        this._colors = init.colors;
        this._drawing = init.drawing != null ? init.drawing : null;
        this._drawingRelId = init.drawingRelId != null ? init.drawingRelId : null;
        this._drawingRelSource = init.drawingRelSource != null ? init.drawingRelSource : null;
    }
    get relIds(): DiagramRelIds {
        return this._relIds;
    }

    /**
     * Requirement contract: data() instanceof DiagramDataModel.
     *
     * @returns {DiagramDataModel} The result.
     */
    data(): DiagramDataModel {
        return this._data;
    }
    layout(): DiagramLayout {
        return this._layout;
    }
    quickStyle(): DiagramQuickStyle {
        return this._quickStyle;
    }
    colors(): DiagramColors {
        return this._colors;
    }
    drawing(): DiagramDrawing | null {
        return this._drawing;
    }
    get drawingRelId(): string | null {
        return this._drawingRelId;
    }
    get drawingRelSource(): 'dataModelExt' | 'package' | 'unknown' | null {
        return this._drawingRelSource;
    }
    setDrawing(drawing: DiagramDrawing | null, relId?: string | null): void {
        this._drawing = drawing;
        if (relId !== undefined) {this._drawingRelId = relId; }
    }

    /**
     * True when any bound part is dirty (needs serialize on apply).
     *
     * @returns {boolean} The result.
     */
    isDirty(): boolean {
        if (this._data.dirty) {return true; }
        if (this._layout.dirty) {return true; }
        if (this._quickStyle.dirty) {return true; }
        if (this._colors.dirty) {return true; }
        if (this._drawing == null ? void 0 : this._drawing.dirty) {return true; }
        return false;
    }
    clone(): SmartArtDiagram {
        const drawingClone: DiagramDrawing = this._drawing != null ? this._drawing.clone() : null;
        return new SmartArtDiagram({
            relIds: {
                ...this._relIds
            },
            data: this._data.clone({
                copyDirty: true
            }),
            layout: this._layout.clone(),
            quickStyle: this._quickStyle.clone(),
            colors: this._colors.clone(),
            drawing: drawingClone,
            drawingRelId: this._drawingRelId,
            drawingRelSource: this._drawingRelSource
        });
    }
}

/**
 * The is smart art diagram.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 * @private
 */
export function isSmartArtDiagram(value: unknown): value is SmartArtDiagram {
    return value instanceof SmartArtDiagram;
}

/** Public constant re-export convenience for hosts. */
export { DIAGRAM_GRAPHIC_DATA_URI };
