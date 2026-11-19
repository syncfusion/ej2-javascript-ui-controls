/**
 * Placeholder detect and type+idx match (core).
 *
 * @packageDocumentation
 */
export { DEFAULT_PLACEHOLDER_IDX, DEFAULT_PLACEHOLDER_TYPE, PLACEHOLDER_TYPES, isPlaceholderType, PlaceholderType } from './constants';
export { PlaceholderInfo, PlaceholderMatch } from './placeholder-info';
export { buildPlaceholderIndex, matchPlaceholderShape, placeholderMatchKey, PlaceholderIndex } from './match';
export { readPlaceholderInfo, shapeElementIsPlaceholder } from './parse-ph';
