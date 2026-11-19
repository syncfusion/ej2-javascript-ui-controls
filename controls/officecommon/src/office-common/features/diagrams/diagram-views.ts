/**
 * Opaque / structured views for layout, quick style, colors, and MS drawing parts.
 *
 * Layout/style/colors: preserve full element trees for lossless round-trip.
 * Drawing: MS cached drawing ([MS-ODRAWXML]); preserve tree + optional bytes.
 *
 * Citations: dml-diagram.xsd CT_DiagramDefinition, CT_StyleDefinition,
 * CT_ColorTransform; [MS-ODRAWXML] diagramDrawing.
 */

import { Literal } from '../../core/literal-type';
import { ElementNode } from './element-tree';
import { cloneElement } from './element-tree';

const LAYOUT_BRAND: unique symbol = Symbol.for('@syncfusion/ej2-office-common.DiagramLayout');
const STYLE_BRAND: unique symbol = Symbol.for('@syncfusion/ej2-office-common.DiagramQuickStyle');
const COLORS_BRAND: unique symbol = Symbol.for('@syncfusion/ej2-office-common.DiagramColors');
const DRAWING_BRAND: unique symbol = Symbol.for('@syncfusion/ej2-office-common.DiagramDrawing');

abstract class DiagramPartViewBase {
    protected _root: ElementNode;
    protected _dirty: boolean = false;
    protected _originalBytes: Uint8Array | null = null;

    constructor(root: ElementNode) {
        this._root = cloneElement(root);
    }

    get root(): ElementNode {
        return this._root;
    }

    /**
     * Replace root tree (marks dirty).
     *
     * @param {ElementNode} root - The root.
     * @returns {void} Nothing is returned.
     */
    setRoot(root: ElementNode): void {
        this._root = cloneElement(root);
        this.markDirty();
    }

    get dirty(): boolean {
        return this._dirty;
    }

    markDirty(): void {
        this._dirty = true;
        this._originalBytes = null;
    }

    clearDirty(originalBytes?: Uint8Array | null): void {
        this._dirty = false;
        this._originalBytes = (originalBytes != null ? originalBytes : null);
    }

    get originalBytes(): Uint8Array | null {
        return this._originalBytes;
    }

    setOriginalBytes(bytes: Uint8Array | null): void {
        this._originalBytes = bytes;
    }

    /** Unique name / uniqueId attribute when present on root. */
    get uniqueId(): string | undefined {
        for (const a of this._root.attributes) {
            if (a.name === 'uniqueId') {return a.value; }
        }
        return undefined;
    }

    get minVer(): string | undefined {
        for (const a of this._root.attributes) {
            if (a.name === 'minVer') {return a.value; }
        }
        return undefined;
    }

    protected cloneBase(ctor: new (root: ElementNode) => DiagramPartViewBase): DiagramPartViewBase {
        const v: DiagramPartViewBase = new ctor(this._root);
        if (this._dirty) {
            v.markDirty();
        } else if (this._originalBytes) {
            v.clearDirty(this._originalBytes);
        }
        return v;
    }
}

/** CT_DiagramDefinition view (layout part). */
export class DiagramLayout extends DiagramPartViewBase {
    readonly [LAYOUT_BRAND]: Literal<true> = true;

    clone(): DiagramLayout {
        return this.cloneBase(DiagramLayout) as DiagramLayout;
    }
}

/** CT_StyleDefinition view (quick style part). */
export class DiagramQuickStyle extends DiagramPartViewBase {
    readonly [STYLE_BRAND]: Literal<true> = true;

    clone(): DiagramQuickStyle {
        return this.cloneBase(DiagramQuickStyle) as DiagramQuickStyle;
    }
}

/** CT_ColorTransform view (colors part). */
export class DiagramColors extends DiagramPartViewBase {
    readonly [COLORS_BRAND]: Literal<true> = true;

    clone(): DiagramColors {
        return this.cloneBase(DiagramColors) as DiagramColors;
    }
}

/**
 * Microsoft diagram drawing (`dsp:drawing`) cached layout art.
 * [MS-ODRAWXML] §2.1.3.
 */
export class DiagramDrawing extends DiagramPartViewBase {
    readonly [DRAWING_BRAND]: Literal<true> = true;

    clone(): DiagramDrawing {
        return this.cloneBase(DiagramDrawing) as DiagramDrawing;
    }
}

/**
 * The is diagram layout.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 */
export function isDiagramLayout(value: unknown): value is DiagramLayout {
    return value instanceof DiagramLayout;
}

/**
 * The is diagram quick style.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 */
export function isDiagramQuickStyle(value: unknown): value is DiagramQuickStyle {
    return value instanceof DiagramQuickStyle;
}

/**
 * The is diagram colors.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 */
export function isDiagramColors(value: unknown): value is DiagramColors {
    return value instanceof DiagramColors;
}

/**
 * The is diagram drawing.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 */
export function isDiagramDrawing(value: unknown): value is DiagramDrawing {
    return value instanceof DiagramDrawing;
}
