/**
 * Shared slide-level find orchestration (document + future Slide APIs).
 *
 * @remarks
 * Spec 035 / ADR 2026-09-16. Walks flat shape tree (groups expanded), then
 * paragraphs via haystack engine. Does not walk notes/masters. Package is not
 * mutated. Shared by Presentation.find* (TASK-1053) and Slide
 * methods (TASK-1054).
 *
 * @internal
 */
import { Slide } from '../../slideimplementation/slide';
import { findAllRegExpInHaystack, findAllStringInHaystack, findRegExpInHaystack, findStringInHaystack } from './find-in-haystack';
import { buildHaystack } from './haystack';
import { AnchoredMatch, ParagraphHaystack } from './types';
import { TextSelection } from './text-selection';
import { TextFindMatch } from './text-find-match';
import { iterTextBodiesOnShape, TextBodySurface } from './walk-text-bodies';
import { arrayAt } from '../../util/es5-compat';
import { ParagraphCollection } from '../paragraph-collection';
import { Paragraph } from '../paragraph';
/**
 * Collects all string matches on one slide in walk order.
 *
 * @internal
 * @param {Slide} slide - The slide value.
 * @param {number} slideIndex - The slideIndex value.
 * @param {string} needle - The needle value.
 * @param {boolean} caseSensitive - The caseSensitive value.
 * @param {boolean} wholeWord - The wholeWord value.
 * @returns {TextFindMatch[]} The result.
 */
export function findAllStringOnSlide(slide: Slide, slideIndex: number, needle: string, caseSensitive: boolean,
                                     wholeWord: boolean, publicSlide?: Slide): TextFindMatch[] {
    const out: TextFindMatch[] = [];
    const iterSlideSurfacesResult: any[] = Array.from(iterSlideSurfaces(slide));// eslint-disable-line
    for (let i: number = 0; i < iterSlideSurfacesResult.length; i++) {
        const surface: any = arrayAt(iterSlideSurfacesResult, i);// eslint-disable-line
        const paragraphs: ParagraphCollection = surface.textBody.paragraphs;
        for (let p: number = 0; p < paragraphs.length; p++) {
            const paragraph: Paragraph = arrayAt(paragraphs, p);
            if (paragraph === undefined) {
                continue;
            }
            const haystack: ParagraphHaystack = buildHaystack(paragraph, p);
            const hits: ReadonlyArray<AnchoredMatch> = findAllStringInHaystack(haystack, needle, caseSensitive, wholeWord);
            for (let k: number = 0; k < hits.length; k++) {
                const hit: AnchoredMatch = arrayAt(hits, k);
                out.push(toMatch(hit, publicSlide === undefined ? slide : publicSlide, slideIndex, surface, p));

            }
        }

    }
    return out;
}
/**
 * First string match on one slide, or `undefined`.
 *
 * @internal
 * @param {Slide} slide - The slide value.
 * @param {number} slideIndex - The slideIndex value.
 * @param {string} needle - The needle value.
 * @param {boolean} caseSensitive - The caseSensitive value.
 * @param {boolean} wholeWord - The wholeWord value.
 * @returns {TextFindMatch | undefined} The result.
 */
export function findStringOnSlide(slide: Slide, slideIndex: number, needle: string, caseSensitive: boolean,
                                  wholeWord: boolean, publicSlide?: Slide): TextFindMatch | undefined {
    const iterSlideSurfacesResult: any[] = Array.from(iterSlideSurfaces(slide));// eslint-disable-line
    for (let i: number = 0; i < iterSlideSurfacesResult.length; i++) {
        const surface: any = arrayAt(iterSlideSurfacesResult, i);// eslint-disable-line
        const paragraphs: ParagraphCollection = surface.textBody.paragraphs;
        for (let p: number = 0; p < paragraphs.length; p++) {
            const paragraph: Paragraph = arrayAt(paragraphs, p);
            if (paragraph === undefined) {
                continue;
            }
            const haystack: ParagraphHaystack = buildHaystack(paragraph, p);
            const hit: AnchoredMatch = findStringInHaystack(haystack, needle, caseSensitive, wholeWord);
            if (hit !== undefined) {
                return toMatch(hit, publicSlide === undefined ? slide : publicSlide, slideIndex, surface, p);
            }
        }

    }
    return undefined;
}
/**
 * Collects all regex matches on one slide in walk order.
 *
 * @internal
 * @param {Slide} slide - The slide value.
 * @param {number} slideIndex - The slideIndex value.
 * @param {RegExp} regex - The regex value.
 * @returns {TextFindMatch[]} The result.
 */
export function findAllRegExpOnSlide(slide: Slide, slideIndex: number, regex: RegExp, publicSlide?: Slide): TextFindMatch[] {
    const out: TextFindMatch[] = [];
    const iterSlideSurfacesResult: any[] = Array.from(iterSlideSurfaces(slide));// eslint-disable-line
    for (let i: number = 0; i < iterSlideSurfacesResult.length; i++) {
        const surface: any = arrayAt(iterSlideSurfacesResult, i);// eslint-disable-line
        const paragraphs: ParagraphCollection = surface.textBody.paragraphs;
        for (let p: number = 0; p < paragraphs.length; p++) {
            const paragraph: Paragraph = arrayAt(paragraphs, p);
            if (paragraph === undefined) {
                continue;
            }
            const haystack: ParagraphHaystack = buildHaystack(paragraph, p);
            const hits: ReadonlyArray<AnchoredMatch> = findAllRegExpInHaystack(haystack, regex);
            for (let k: number = 0; k < hits.length; k++) {
                const hit: any = arrayAt(hits, k);// eslint-disable-line
                out.push(toMatch(hit, publicSlide === undefined ? slide : publicSlide, slideIndex, surface, p));

            }
        }

    }
    return out;
}
/**
 * First regex match on one slide, or `undefined`.
 *
 * @internal
 * @param {Slide} slide - The slide value.
 * @param {number} slideIndex - The slideIndex value.
 * @param {RegExp} regex - The regex value.
 * @returns {TextFindMatch | undefined} The result.
 */
export function findRegExpOnSlide(slide: Slide, slideIndex: number, regex: RegExp, publicSlide?: Slide): TextFindMatch | undefined {
    const iterSlideSurfacesResult: any[] = Array.from(iterSlideSurfaces(slide));// eslint-disable-line
    for (let i: number = 0; i < iterSlideSurfacesResult.length; i++) {
        const surface: any = arrayAt(iterSlideSurfacesResult, i);// eslint-disable-line
        const paragraphs: ParagraphCollection = surface.textBody.paragraphs;
        for (let p: number = 0; p < paragraphs.length; p++) {
            const paragraph: Paragraph = arrayAt(paragraphs, p);
            if (paragraph === undefined) {
                continue;
            }
            const haystack: ParagraphHaystack = buildHaystack(paragraph, p);
            const hit: AnchoredMatch = findRegExpInHaystack(haystack, regex);
            if (hit !== undefined) {
                return toMatch(hit, publicSlide === undefined ? slide : publicSlide, slideIndex, surface, p);
            }
        }

    }
    return undefined;
}
/**
 * Document-level collect: all slides in sldIdLst order.
 *
 * @internal
 * @param {*} slides - The slides value.
 * @param {string} needle - The needle value.
 * @param {boolean} caseSensitive - The caseSensitive value.
 * @param {boolean} wholeWord - The wholeWord value.
 * @returns {*} The result.
 */
export function findAllStringOnDocument(slides: ReadonlyArray<Slide>, needle: string, caseSensitive: boolean,
                                        wholeWord: boolean): ReadonlyArray<TextFindMatch> {
    const out: TextFindMatch[] = [];
    for (let i: number = 0; i < slides.length; i++) {
        const slide: Slide = arrayAt(slides, i);
        if (slide === undefined) {
            continue;
        }
        out.push(...findAllStringOnSlide(slide, i, needle, caseSensitive, wholeWord));
    }
    return out;
}
/**
 * Document-level first string match.
 *
 * @internal
 * @param {*} slides - The slides value.
 * @param {string} needle - The needle value.
 * @param {boolean} caseSensitive - The caseSensitive value.
 * @param {boolean} wholeWord - The wholeWord value.
 * @returns {TextFindMatch | undefined} The result.
 */
export function findStringOnDocument(slides: ReadonlyArray<Slide>, needle: string, caseSensitive: boolean,
                                     wholeWord: boolean): TextFindMatch | undefined {
    for (let i: number = 0; i < slides.length; i++) {
        const slide: Slide = arrayAt(slides, i);
        if (slide === undefined) {
            continue;
        }
        const hit: TextFindMatch = findStringOnSlide(slide, i, needle, caseSensitive, wholeWord);
        if (hit !== undefined) {
            return hit;
        }
    }
    return undefined;
}
/**
 * Document-level collect: all regex matches.
 *
 * @internal
 * @param {*} slides - The slides value.
 * @param {RegExp} regex - The regex value.
 * @returns {*} The result.
 */
export function findAllRegExpOnDocument(slides: ReadonlyArray<Slide>, regex: RegExp): ReadonlyArray<TextFindMatch> {
    const out: TextFindMatch[] = [];
    for (let i: number = 0; i < slides.length; i++) {
        const slide: Slide = arrayAt(slides, i);
        if (slide === undefined) {
            continue;
        }
        out.push(...findAllRegExpOnSlide(slide, i, regex));
    }
    return out;
}
/**
 * Document-level first regex match.
 *
 * @internal
 * @param {*} slides - The slides value.
 * @param {RegExp} regex - The regex value.
 * @returns {TextFindMatch | undefined} The result.
 */
export function findRegExpOnDocument(slides: ReadonlyArray<Slide>, regex: RegExp): TextFindMatch | undefined {
    for (let i: number = 0; i < slides.length; i++) {
        const slide: Slide = arrayAt(slides, i);
        if (slide === undefined) {
            continue;
        }
        const hit: TextFindMatch = findRegExpOnSlide(slide, i, regex);
        if (hit !== undefined) {
            return hit;
        }
    }
    return undefined;
}
// eslint-disable-next-line jsdoc/require-returns-check -- generator yields; no return expression
/**
 *
 * @param {Slide} slide - The slide value.
 * @returns {IterableIterator} Surfaces on the slide.
 */
function* iterSlideSurfaces(slide: Slide): IterableIterator<TextBodySurface> {
    for (let i: number = 0; i < slide.shapes.length; i++) {
        const shape: any = arrayAt(slide.shapes, i);// eslint-disable-line
        yield* iterTextBodiesOnShape(shape);

    }
}
/**
 *
 * @param {AnchoredMatch} hit - The hit value.
 * @param {Slide} slide - The slide value.
 * @param {number} slideIndex - The slideIndex value.
 * @param {TextBodySurface} surface - The surface value.
 * @param {number} paragraphIndex - The paragraphIndex value.
 * @returns {TextFindMatch} The result.
 */
function toMatch(hit: AnchoredMatch, slide: Slide, slideIndex: number, surface: TextBodySurface, paragraphIndex: number): TextFindMatch {
    return new TextSelection(
        hit.text,
        slideIndex,
        slide,
        surface,
        paragraphIndex,
        hit.start,
        hit.end,
        hit.startTextPartIndex,
        hit.startTextPartOffset,
        hit.endTextPartIndex,
        hit.endTextPartOffset
    );
}
