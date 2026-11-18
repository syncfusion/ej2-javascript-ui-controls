/**
 * Find engine and document walk helpers (Phase 7).
 *
 * @remarks
 * Haystack = concatenated `a:r` / {@link TextPart} text. Public match type is
 * {@link TextFindMatch}. `Presentation.find` / `findAll` are TASK-1053;
 * Slide methods are TASK-1054. No replace or highlight.
 *
 * @packageDocumentation
 */
export { TextFindMatch } from './text-find-match';
export { AnchoredMatch, HaystackRun, ParagraphHaystack, RawMatch } from './types';
export { buildHaystack, buildHaystackFromRunTexts } from './haystack';
export { isWholeWord, isWordChar, codePointAtIndex } from './whole-word';
export { foldCase, matchString, matchStringFirst } from './match-string';
export { matchRegExp, matchRegExpFirst } from './match-regexp';
export { mapAllRawToAnchors, mapEndOffset, mapRawToAnchors, mapStartOffset } from './map-anchors';
export { findAllRegExpInHaystack, findAllStringInHaystack, findRegExpInHaystack, findStringInHaystack } from './find-in-haystack';
export { findAllRegExpOnDocument, findAllRegExpOnSlide, findAllStringOnDocument, findAllStringOnSlide,
    findRegExpOnDocument, findRegExpOnSlide, findStringOnDocument, findStringOnSlide } from './find-on-slide';
export { iterTextBodiesOnShape, TextBodySurface } from './walk-text-bodies';
