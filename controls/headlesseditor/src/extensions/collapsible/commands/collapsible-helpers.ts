/**
 * collapsible-helpers.ts — Shared utility functions for collapsible keyboard behavior.
 *
 * Extracts common patterns used across multiple collapsible-related commands:
 * - Finding collapsible ancestors
 * - Checking cursor position relative to collapsible structure
 * - Checking collapsible state (empty/collapsed/expanded)
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */

import { PMEditorState, PMNode, PMResolvedPos } from '../../../pm/pm-guard';

/**
 * Finds the document position of the nearest collapsible ancestor node,
 * or -1 if none is found. Starts from the selection's $from position.
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @returns {number} Position of the collapsible ancestor, or -1.
 *
 * @hidden
 */
export function findCollapsibleAncestorPos(pmState: PMEditorState): number {
    const { $from } = pmState.selection;
    for (let d: number = $from.depth; d >= 0; d--) {
        if ($from.node(d).type.name === 'collapsible') {
            return $from.before(d);
        }
    }
    return -1;
}

/**
 * Finds the nearest collapsibleHeader ancestor node from the current selection.
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @returns {number} Position of the collapsibleHeader ancestor, or -1.
 *
 * @hidden
 */
export function findCollapsibleHeaderAncestorPos(pmState: PMEditorState): number {
    const { $from } = pmState.selection;
    for (let d: number = $from.depth; d >= 0; d--) {
        if ($from.node(d).type.name === 'collapsibleHeader') {
            return $from.before(d);
        }
    }
    return -1;
}

/**
 * Finds the nearest collapsibleBody ancestor node from the current selection.
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @returns {number} Position of the collapsibleBody ancestor, or -1.
 *
 * @hidden
 */
export function findCollapsibleBodyAncestorPos(pmState: PMEditorState): number {
    const { $from } = pmState.selection;
    for (let d: number = $from.depth; d >= 0; d--) {
        if ($from.node(d).type.name === 'collapsibleBody') {
            return $from.before(d);
        }
    }
    return -1;
}

/**
 * Checks if a collapsible node is currently in the collapsed state.
 *
 * @param {PMNode} collapsibleNode - The collapsible node to check.
 * @returns {boolean} True if collapsed, false otherwise.
 *
 * @hidden
 */
export function isCollapsibleCollapsed(collapsibleNode: PMNode): boolean {
    return collapsibleNode.attrs['collapsed'] === true;
}

/**
 * Checks if a collapsible node is currently in the expanded state.
 *
 * @param {PMNode} collapsibleNode - The collapsible node to check.
 * @returns {boolean} True if expanded, false otherwise.
 *
 * @hidden
 */
export function isCollapsibleExpanded(collapsibleNode: PMNode): boolean {
    return collapsibleNode.attrs['collapsed'] !== true;
}

/**
 * Returns the total text content length of a collapsible header.
 * Useful for detecting empty headers.
 *
 * @param {PMNode} collapsibleNode - The collapsible node containing the header.
 * @returns {number} Length of trimmed text content, or 0 if header doesn't exist.
 *
 * @hidden
 */
export function getHeaderTextLength(collapsibleNode: PMNode): number {
    if (collapsibleNode.childCount === 0) { return 0; }
    const headerNode: PMNode = collapsibleNode.child(0);
    return headerNode.textContent.trim().length;
}

/**
 * Returns the total text content length of a collapsible body.
 * Useful for detecting empty bodies.
 *
 * @param {PMNode} collapsibleNode - The collapsible node containing the body.
 * @returns {number} Length of trimmed text content, or 0 if body doesn't exist.
 *
 * @hidden
 */
export function getBodyTextLength(collapsibleNode: PMNode): number {
    if (collapsibleNode.childCount < 2) { return 0; }
    const bodyNode: PMNode = collapsibleNode.child(1);
    return bodyNode.textContent.trim().length;
}

/**
 * Checks if a collapsible header and body are both empty (no meaningful text).
 *
 * @param {PMNode} collapsibleNode - The collapsible node to check.
 * @returns {boolean} True if both header and body are empty.
 *
 * @hidden
 */
export function isCollapsibleEmpty(collapsibleNode: PMNode): boolean {
    return getHeaderTextLength(collapsibleNode) === 0 && getBodyTextLength(collapsibleNode) === 0;
}

/**
 * Checks if the cursor is inside a collapsible header (at any position).
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @returns {boolean} True if cursor is inside a collapsibleHeader.
 *
 * @hidden
 */
export function isInsideHeader(pmState: PMEditorState): boolean {
    return findCollapsibleHeaderAncestorPos(pmState) !== -1;
}

/**
 * Checks if the cursor is inside a collapsible body (at any position).
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @returns {boolean} True if cursor is inside a collapsibleBody.
 *
 * @hidden
 */
export function isInsideBody(pmState: PMEditorState): boolean {
    return findCollapsibleBodyAncestorPos(pmState) !== -1;
}

/**
 * Gets the collapsible header node from a collapsible node.
 *
 * @param {PMNode} collapsibleNode - The collapsible node.
 * @returns {PMNode | null} The header node, or null if not found.
 *
 * @hidden
 */
export function getHeaderNode(collapsibleNode: PMNode): PMNode | null {
    if (collapsibleNode.childCount === 0) { return null; }
    const headerNode: PMNode = collapsibleNode.child(0);
    return headerNode.type.name === 'collapsibleHeader' ? headerNode : null;
}

/**
 * Gets the collapsible body node from a collapsible node.
 *
 * @param {PMNode} collapsibleNode - The collapsible node.
 * @returns {PMNode | null} The body node, or null if not found.
 *
 * @hidden
 */
export function getBodyNode(collapsibleNode: PMNode): PMNode | null {
    if (collapsibleNode.childCount < 2) { return null; }
    const bodyNode: PMNode = collapsibleNode.child(1);
    return bodyNode.type.name === 'collapsibleBody' ? bodyNode : null;
}

