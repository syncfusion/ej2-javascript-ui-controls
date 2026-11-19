/**
 * Array-like shape list with collection `add*` methods (API-RULES R1.1).
 */
import { Shape } from './shape';
import { AddTextBoxOptions, ShapeBounds } from './add-text-box';
import { AddShapeOptions } from './add-shape';
import { AutoShapeTypeValue } from './auto-shape-type';
import { AddPictureOptions } from '../pictures/add-picture';
import { Picture } from '../pictures/picture';
/**
 * Ordered shapes from a slide `p:spTree` walk with append API.
 *
 * @remarks
 * Supports index access (`shapes[0]`), `length`, iteration,
 * {@link ShapeCollection.addTextBox}, {@link ShapeCollection.addShape},
 * {@link ShapeCollection.addPicture}, {@link ShapeCollection.removePicture}, and
 * {@link ShapeCollection.remove}.
 * Enumeration order is document (z-order) walk order over the slide `p:spTree`.
 *
 * Adding a shape allocates a new `cNvPr/@id` and **never** renumbers existing ids.
 * Picture insert creates a new media part per call (no dedupe) and never fetches
 * `r:link` targets. Remove never renumbers remaining ids.
 */
import { arrayIncludes, arrayAt } from '../util/es5-compat';
export type ShapeCollection = ReadonlyArray<Shape> & {
    /**
     * Returns the first shape whose authored `cNvPr/@id` equals `id`, including nested
     * group descendants; `undefined` when not found.
     *
     * @param id - Drawing element id decimal string (`ST_DrawingElementId`).
     * @returns Matching {@link Shape}, or `undefined`.
     *
     * @remarks
     * Search order matches the flat depth-first `p:spTree` walk (document / z-order).
     * Does not throw on miss (contrast {@link Slide.getShapeById}). Never renumbers ids.
     * Depth / cycle / shape-count limits are enforced by the underlying walk when the
     * collection is materialized.
     *
     * Citation: `docs/specs/017-group-navigate-depth.md`.
     */
    getById(id: string): Shape | undefined;
    /**
     * Appends a text box (`p:sp` with `txBody`) under this slide's `p:spTree`.
     *
     * @param options - Optional text, name, and point-unit transform.
     * @returns The created {@link Shape}.
     *
     * @throws {Error} When `shapesPerSlide` would be exceeded.
     * @throws {Error} When the slide has no `p:spTree`.
     */
    addTextBox(options?: AddTextBoxOptions): Shape;
    /**
     * Appends a predefined auto-shape (`p:sp` + `a:prstGeom`) under this slide's
     * `p:spTree`.
     *
     * @param type - Public auto-shape kind ({@link AutoShapeType}).
     * @param bounds - Position and size in **points** (`a:off` / `a:ext` after EMU conversion).
     * @param options - Optional `cNvPr/@name` override.
     * @returns The created {@link Shape}.
     *
     * @throws {Error} When `shapesPerSlide` would be exceeded.
     * @throws {Error} When the slide has no `p:spTree` or `type`
     *   is not a known {@link AutoShapeType} kind.
     *
     * @remarks
     * Signature is **two positionals** (`type`, `bounds`) per API-RULES R2.2 / R2.4
     * R8.1 — not raw EMU numbers. Circle maps to wire `prst="ellipse"` (no
     * `circle` token in `ST_ShapeType`); pass equal width and height for a visual
     * circle. Line uses `p:sp` + `prst="line"`, not `p:cxnSp`.
     *
     * Does not set `cNvSpPr/@txBox` and does not emit `txBody`.
     *
     * Citation: Transitional `dml-main.xsd` `ST_ShapeType` / `CT_PresetGeometry2D`;
     * `docs/ooxml-mapping/add-auto-shape.md`.
     *
     * @example
     * ```ts
     * import { AutoShapeType, Presentation } from '@syncfusion/ej2-pptx';
     *
     * const doc = Presentation.create();
     * doc.slides.add();
     * const slide = doc.slides[0];
     * if (slide !== undefined) {
     *   slide.shapes.addShape(AutoShapeType.Rectangle, {
     *     x: 0,
     *     y: 0,
     *     width: 144,
     *     height: 72,
     *   });
     * }
     * ```
     */
    addShape(type: AutoShapeTypeValue, bounds: ShapeBounds, options?: AddShapeOptions): Shape;
    /**
     * Appends an embedded picture (`p:pic` + media part + image relationship).
     *
     * @param options - Image bytes, MIME type, optional name and point-unit transform.
     * @returns The created {@link Picture} bound to the new `p:pic`.
     *
     * @throws {Error} When shapes/media/part/rel limits would be exceeded.
     * @throws {Error} When MIME is disallowed or `p:spTree` is missing.
     *
     * @remarks
     * Allowed content types: `image/png`, `image/jpeg`, `image/gif`. Always adds a
     * **new** part under `/ppt/media/`. Emits Internal `r:embed` only — never
     * `r:link` and never fetches network targets.
     *
     * Citation: `docs/specs/012-pictures.md`; Transitional `pml.xsd` `CT_Picture`.
     */
    addPicture(options: AddPictureOptions): Picture;
    /**
     * Removes a picture from this slide’s shape tree and GCs unused image media.
     *
     * @param picture - Handle from {@link ShapeCollection.addPicture} or
     *   {@link Shape.asPicture} on this slide.
     *
     * @throws {Error} When the handle is detached, not on this
     *   slide, write access is missing, or master/layout rejects mutation.
     *
     * @remarks
     * Detaches the live `p:pic` only. Does **not** renumber remaining `cNvPr/@id`
     * values. Drops unused slide image relationships; deletes the media part and
     * its content-type Override when no package relationship still targets the
     * part name. Leaves image content-type Defaults. Link-only pictures may be
     * removed (External rel dropped when unused). Timing references to the
     * removed id are left as-is.
     *
     * Citation: `docs/specs/039-picture-remove-retarget.md`; TASK-1089 lock.
     */
    removePicture(picture: Picture): void;
    /**
     * Removes a supported drawing-tree child from this slide’s shape tree.
     *
     * @param shape - Handle from this collection (or nested group walk on this slide).
     *
     * @throws {Error} When the handle is foreign/detached, a
     *   placeholder, an unsupported kind (contentPart, OLE/unknown/chart/diagram
     *   graphicFrame), or picture GC write access is missing.
     * @throws {Error} When any id in the detach set is cited by
     *   `p:timing` / `p:spTgt/@spid` (refuse; tree unchanged).
     *
     * @remarks
     * **Kind matrix (req/spec 040 / TASK-1093):**
     * - `p:sp` / `p:cxnSp` — detach only; connector ends may dangle.
     * - `p:pic` — same media/rel GC as {@link ShapeCollection.removePicture}.
     * - `p:grpSp` — cascade whole subtree; nested pics GC’d; if **any** subtree id
     *   is animation-targeted, refuse the entire operation (no partial delete).
     * - Table `graphicFrame` — detach inline frame only (no `tableStyles` GC).
     * - Chart/diagram/OLE/unknown graphicFrame / `contentPart` / `p:ph` — refuse.
     *
     * Never renumbers remaining `cNvPr/@id`. Never rewrites timing markup.
     * `removePicture` remains a public typed alias for pictures.
     *
     * Citation: `docs/specs/040-generic-shape-remove.md`; TASK-1093 lock.
     */
    remove(shape: Shape): void;
};
/**
 * Implementations bound into a {@link ShapeCollection} proxy.
 *
 * @internal
 */
export interface ShapeCollectionMutators {
    readonly addTextBox: (options?: AddTextBoxOptions) => Shape;
    readonly addShape: (type: AutoShapeTypeValue, bounds: ShapeBounds, options?: AddShapeOptions) => Shape;
    readonly addPicture: (options: AddPictureOptions) => Picture;
    readonly removePicture: (picture: Picture) => void;
    readonly remove: (shape: Shape) => void;
}
/**
 * Binds a live {@link ShapeCollection} over a shape walk + add implementations.
 *
 * @internal
 * @param {*} getShapes - Returns the current walk result (re-evaluated on access).
 * @param {ShapeCollectionMutators} mutators - Host-provided add/remove implementations.
 * @returns {ShapeCollection} Array-like proxy exposing shapes plus collection methods.
 */
export function bindShapeCollection(getShapes: () => ReadonlyArray<Shape>, mutators: ShapeCollectionMutators): ShapeCollection {
    // Eager walk so accessing `slide.shapes` enforces shapesPerSlide / groupNestingDepth
    // (same semantics as the previous `ReadonlyArray<Shape>` getter).
    getShapes();
    const getById: (id: string) => Shape | undefined = (id: string): Shape | undefined => {
        const getShapesResult: any = getShapes(); // eslint-disable-line
        for (let i: number = 0; i < getShapesResult.length; i++) {
            const shape: any = arrayAt(getShapesResult, i);// eslint-disable-line
            if (shape.id === id) {
                return shape;
            }

        }
        return undefined;
    };
    const addTextBox: (options?: AddTextBoxOptions) => Shape = (options?: AddTextBoxOptions): Shape => mutators.addTextBox(options);
    const addShape: (
        type: AutoShapeTypeValue,
        bounds: ShapeBounds,
        options?: AddShapeOptions
    ) => Shape = (
        type: AutoShapeTypeValue,
        bounds: ShapeBounds,
        options?: AddShapeOptions
    ): Shape => mutators.addShape(type, bounds, options);
    const addPicture: (options: AddPictureOptions) => Picture = (options: AddPictureOptions): Picture => mutators.addPicture(options);
    const removePicture: (picture: Picture) => void = (picture: Picture): void => mutators.removePicture(picture);
    const remove: (shape: Shape) => void = (shape: Shape): void => mutators.remove(shape);
    return new Proxy({} as ShapeCollection, {
        /**
         *
         * @param {ShapeCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @returns {*} The result.
         */
        get(_target: ShapeCollection, prop: string | symbol): unknown {
            if (prop === 'getById') {
                return getById;
            }
            if (prop === 'addTextBox') {
                return addTextBox;
            }
            if (prop === 'addShape') {
                return addShape;
            }
            if (prop === 'addPicture') {
                return addPicture;
            }
            if (prop === 'removePicture') {
                return removePicture;
            }
            if (prop === 'remove') {
                return remove;
            }
            const shapes: ReadonlyArray<Shape> = getShapes();
            const value: unknown = Reflect.get(shapes, prop, shapes);
            if (typeof value === 'function') {
                return (value as (...args: unknown[]) => unknown).bind(shapes);
            }
            return value;
        },
        /**
         *
         * @param {ShapeCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @param {*} value - The value value.
         * @returns {boolean} The result.
         */
        set(_target: ShapeCollection, prop: string | symbol, value: unknown): boolean {
            const shapes: Array<Shape> = getShapes() as Shape[];
            return Reflect.set(shapes, prop, value, shapes);
        },
        /**
         *
         * @param {ShapeCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @returns {boolean} The result.
         */
        has(_target: ShapeCollection, prop: string | symbol): boolean {
            if (prop === 'getById' ||
                prop === 'addTextBox' ||
                prop === 'addShape' ||
                prop === 'addPicture' ||
                prop === 'removePicture' ||
                prop === 'remove') {
                return true;
            }
            return Reflect.has(getShapes(), prop);
        },
        /**
         *
         * @param {ShapeCollection} _target - The _target value.
         * @returns {*} The result.
         */
        ownKeys(_target: ShapeCollection): Array<string | symbol> {
            void _target;
            const keys: Array<string | symbol> = Reflect.ownKeys(getShapes()).filter(
                (k: string | symbol): k is string | symbol => typeof k === 'string' || typeof k === 'symbol'
            );
            const extra: Array<string | symbol> = [];
            if (!arrayIncludes(keys, 'getById')) {
                extra.push('getById');
            }
            if (!arrayIncludes(keys, 'addTextBox')) {
                extra.push('addTextBox');
            }
            if (!arrayIncludes(keys, 'addShape')) {
                extra.push('addShape');
            }
            if (!arrayIncludes(keys, 'addPicture')) {
                extra.push('addPicture');
            }
            if (!arrayIncludes(keys, 'removePicture')) {
                extra.push('removePicture');
            }
            if (!arrayIncludes(keys, 'remove')) {
                extra.push('remove');
            }
            return extra.length === 0 ? keys : keys.concat(extra);
        },
        /**
         *
         * @param {ShapeCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @returns {TypedPropertyDescriptor<any>} The result.
         */
        getOwnPropertyDescriptor(_target: ShapeCollection, prop: string | symbol): PropertyDescriptor | undefined {
            if (prop === 'getById') {
                return {
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: getById
                };
            }
            if (prop === 'addTextBox') {
                return {
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: addTextBox
                };
            }
            if (prop === 'addShape') {
                return {
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: addShape
                };
            }
            if (prop === 'addPicture') {
                return {
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: addPicture
                };
            }
            if (prop === 'removePicture') {
                return {
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: removePicture
                };
            }
            if (prop === 'remove') {
                return {
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: remove
                };
            }
            return Reflect.getOwnPropertyDescriptor(getShapes(), prop);
        },
        /**
         *
         * @returns {*} The result.
         */
        getPrototypeOf(): object | null {
            return Object.getPrototypeOf(getShapes());
        }
    });
}
