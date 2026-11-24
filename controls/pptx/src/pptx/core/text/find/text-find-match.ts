/**
 * Public find match handle.
 *
 * @remarks
 * Spec 035 / ADR 2026-09-16. Matches are {@link TextSelection} instances so
 * callers can collapse a hit with {@link TextSelection.getAsOneTextPart} and
 * then use existing {@link TextPart} replace and highlight setters. This module
 * does not add replace or highlight methods of its own.
 */
export { TextSelection as TextFindMatch } from './text-selection';
