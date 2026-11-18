/**
 * Array-like slide list with collection `add` / `remove` (API-RULES R1.1, R5.5).
 */
import { Slide } from '../slideimplementation/slide';
import { AddSlideOptions } from './add-slide';
/**
 * Ordered slides from `p:sldIdLst` with append + remove APIs.
 *
 * @remarks
 * Supports index access (`slides[0]`), `length`, iteration, {@link SlideCollection.add},
 * and {@link SlideCollection.remove}. Enumeration order is **only** model
 * `sldIdLst` order — never part-name sort.
 */
import { arrayIncludes } from '../util/es5-compat';
export type SlideCollection = ReadonlyArray<Slide> & {
    /**
     * Appends a slide at the end of the presentation.
     *
     * @param options - Optional {@link AddSlideOptions.layout} (`SlideLayoutType` token).
     *   When omitted, uses title (`DEFAULT_SLIDE_LAYOUT_TYPE`).
     * @returns The created {@link Slide}.
     *
     * @throws {Error} When `slideCount` would be exceeded.
     * @throws {TypeError} When `options.layout` is not a public layout token.
     *
     * @example
     * ```ts
     * doc.slides.add({ layout: SlideLayoutType.TitleOnly });
     * // TitleOnly adds a title placeholder; Blank adds none.
     * ```
     */
    add(options?: AddSlideOptions): Slide;
    /**
     * Removes a slide by instance from the presentation and tears down its
     * package part, the presentation→slide relationship, and its
     * `[Content_Types].xml` override.
     *
     * @param slide - Slide instance that must currently be in `presentation.slides`.
     *
     * @throws {Error} When `slide` is not a member of `presentation.slides`.
     *
     * @remarks
     * - Slide parts are **never renamed**: survivor part URIs stay exactly as
     *   authored; future `slides.add` continues scanning for the next free
     *   `slideN.xml` and is unaffected by freed names.
     * - Survivor `ST_SlideId` (`p:sldId/@id`) values are stable; enumeration order
     *   follows the new `p:sldIdLst`. The freed `ST_SlideId` of the removed slide
     *   is **not** reused by a subsequent `slides.add`.
     * - `slideNumber` (1-based; API-RULES R5.6) of survivors is recomputed by
     *   enumeration position automatically after removal.
     * - Side-effect teardown of parts only reachable from the removed slide
     *   (notes slides, embedded media, comments parts) is **not** performed
     *   by `remove`; such cleanup is tracked by a follow-up task.
     *
     * **API-RULES R5.6**: `slideNumber` (1-based) is updated by `remove()` and
     * `removeAt()`.
     *
     * **Capability note:** the only resource-release path for a presentation is
     * `Presentation.close()`. There is no `IDisposable`; `remove` releases the
     * slide's package surface but does not dispose the document.
     *
     * Citation: `pml.xsd` `CT_SlideIdList` / `CT_SlideIdListEntry`; requirement 003 §3;
     * API-RULES R5.6; TASK-1077.
     *
     * @example
     * ```ts
     * const slide = doc.slides[0];
     * doc.slides.remove(slide);
     * ```
     */
    remove(slide: Slide): void;
    /**
     * Removes the slide at the given 0-based index, delegating to the same
     * shared teardown as {@link SlideCollection.remove}.
     *
     * @param index - 0-based position in enumeration order (the same order as
     *   `slides[i]` and `for...of`). `0` is the first slide; negative indices
     *   are not wrap-around and throw `model/out-of-range`.
     *
     * @throws {Error} With code `model/out-of-range` when
     *   `index` is not a valid slide position (`index < 0` or
     *   `index >= slides.length`).
     *
     * @remarks
     * Invariants and side effects are identical to {@link SlideCollection.remove}:
     * survivor part URIs are unchanged; survivor `ST_SlideId` values are stable;
     * the freed `ST_SlideId` is not reused by a subsequent `slides.add`;
     * `slideNumber` (1-based; API-RULES R5.6) of survivors is recomputed by
     * enumeration position automatically after removal.
     *
     * **API-RULES R5.6**: `slideNumber` (1-based) is updated by `remove()` and
     * `removeAt()`.
     *
     * Citation: `pml.xsd` `CT_SlideIdList` / `CT_SlideIdListEntry`; requirement 003 §3;
     * API-RULES R3.1 (indexed access), R5.5 (collection mutations), R5.6, R7.2
     * (`model/out-of-range`); TASK-1078.
     *
     * @example
     * ```ts
     * doc.slides.removeAt(0);   // removes the first slide
     * ```
     */
    removeAt(index: number): void;
};
/**
 * Binds a live {@link SlideCollection} over the presentation model slide array.
 *
 * @param {*} getSlides - Returns the current mutable model slides array.
 * @param {*} addImpl - Implements append (limit checks, package mutation).
 * @param {*} removeImpl - Implements remove-by-instance teardown.
 * @param {*} removeAtImpl - Implements remove-by-index teardown (bounds validation
 * @returns {SlideCollection} The result.
 */
export function bindSlideCollection(getSlides: () => ReadonlyArray<Slide>, addImpl: (options?: AddSlideOptions) => Slide,
                                    removeImpl: (slide: Slide) => void, removeAtImpl: (index: number) => void): SlideCollection {
    const add: (options?: AddSlideOptions) => Slide = (options?: AddSlideOptions): Slide => addImpl(options);
    const remove: (slide: Slide) => void = (slide: Slide): void => removeImpl(slide);
    const removeAt: (index: number) => void = (index: number): void => removeAtImpl(index);
    return new Proxy({} as SlideCollection, {
        /**
         *
         * @param {SlideCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @returns {*} The result.
         */
        get(_target: SlideCollection, prop: string | symbol): unknown {
            if (prop === 'add') {
                return add;
            }
            if (prop === 'remove') {
                return remove;
            }
            if (prop === 'removeAt') {
                return removeAt;
            }
            const slides: ReadonlyArray<Slide> = getSlides();
            const value: unknown = Reflect.get(slides, prop, slides);
            if (typeof value === 'function') {
                return (value as (...args: unknown[]) => unknown).bind(slides);
            }
            return value;
        },
        /**
         *
         * @param {SlideCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @param {*} value - The value value.
         * @returns {boolean} The result.
         */
        set(_target: SlideCollection, prop: string | symbol, value: unknown): boolean {
            const slides: Array<Slide> = getSlides() as Slide[];
            return Reflect.set(slides, prop, value, slides);
        },
        /**
         *
         * @param {SlideCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @returns {boolean} The result.
         */
        has(_target: SlideCollection, prop: string | symbol): boolean {
            if (prop === 'add' || prop === 'remove' || prop === 'removeAt') {
                return true;
            }
            return Reflect.has(getSlides(), prop);
        },
        /**
         *
         * @returns {*} The result.
         */
        ownKeys() : Array<string | symbol> {
            const keys: Array<string | symbol> = Reflect.ownKeys(getSlides()).filter(
                (key: string | number | symbol): key is string | symbol => typeof key !== 'number'
            );
            const extra: Array<string | symbol> = [];
            if (!arrayIncludes(keys, 'add')) {
                extra.push('add');
            }
            if (!arrayIncludes(keys, 'remove')) {
                extra.push('remove');
            }
            if (!arrayIncludes(keys, 'removeAt')) {
                extra.push('removeAt');
            }
            return [...keys, ...extra];
        },
        /**
         *
         * @param {SlideCollection} _target - The _target value.
         * @param {string | symbol} prop - The prop value.
         * @returns {TypedPropertyDescriptor<any>} The result.
         */
        getOwnPropertyDescriptor(_target: SlideCollection, prop: string | symbol): PropertyDescriptor | undefined {
            if (prop === 'add') {
                return {
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: add
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
            if (prop === 'removeAt') {
                return {
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: removeAt
                };
            }
            return Reflect.getOwnPropertyDescriptor(getSlides(), prop);
        },
        /**
         *
         * @returns {*} The result.
         */
        getPrototypeOf(): object | null {
            return Object.getPrototypeOf(getSlides());
        }
    });
}
