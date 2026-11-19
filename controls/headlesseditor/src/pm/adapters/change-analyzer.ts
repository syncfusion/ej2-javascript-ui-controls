/**
 * change-analyzer.ts — Transaction-driven change action classification and affected node detection.
 *
 * Analyzes PM transactions using step-aware range extraction, PM-based node resolution,
 * and post-transaction PM ranges to classify semantic changes and identify affected nodes.
 *
 * Architecture:
 * ────────────────────────────────────────────────────────────────
 * Step → Step-aware range extraction
 *   ↓
 * Old/new ranges (from step.from/to or StepMap)
 *   ↓
 * PM.nodesBetween() to resolve PM nodes in ranges
 *   ↓
 * Convert changed PM nodes directly to identifier-free AffectedNodes
 *   ↓
 * Aggregate nodes across all steps
 *   ↓
 * Return post-transaction AffectedNodes
 * ────────────────────────────────────────────────────────────────
 *
 * Key design decisions:
 * 1. Range extraction uses step-specific properties (AddMarkStep.from/to, ReplaceStep ranges, etc.)
 * 2. Structural changes use StepMap via proper range iteration, not position guessing
 * 3. PM is source of truth for node resolution (PM.nodesBetween)
 * 4. Affected nodes are collected directly from PM ranges.
 * 5. affectedNodes represents logical nodes from afterDoc
 * 6. Multi-step transactions aggregate into a single semantic action
 */

import { type PMNode, type PMTransaction, type PMStep, type Mapping, AddMarkStep, RemoveMarkStep, ReplaceStep, ReplaceAroundStep, AttrStep } from '../pm-guard';
import { NodeMapper } from './node-mapper';
import type { DocumentChangeAction } from '../../core/events/public-events/document-events';
import { EditorNode } from '../../headless-editor';

/**
 * Structural typing shapes for PM internals — avoids `any` while remaining
 * implementation-agnostic.
 */
interface StepMapShape {
    map: (pos: number) => number;
    forEach: (
        cb: (oldFrom: number, oldTo: number, newFrom: number, newTo: number) => void
    ) => void;
}
interface MarkStepShape { from: number; to: number; }
interface AttrStepShape { pos: number; }
interface ReplaceStepShape { from: number; to: number; slice: { content: { size: number } }; }

/**
 * ChangeAnalyzer — detects semantic document change actions and affected nodes using transaction steps.
 *
 * @internal
 */
export class ChangeAnalyzer {
    /**
     * Analyzes a transaction and returns the semantic action and affected nodes.
     *
     * Preferred API: receives transaction for step-driven analysis.
     * Fallback: if transaction unavailable, performs snapshot-based analysis (less reliable).
     *
     * @param {Object} input Analysis input.
     * @param {PMTransaction} [input.transaction] Transaction used for step-driven analysis.
     * @param {PMNode} input.beforeDoc Document state before the change.
     * @param {PMNode} input.afterDoc Document state after the change.
     * @returns {{ action: string, affectedNodes: object[] }} An object containing the semantic action and affected nodes.
     * @hidden
     */
    public static analyzeChange(
        input: { transaction?: PMTransaction; beforeDoc: PMNode; afterDoc: PMNode }
    ): { action: DocumentChangeAction; affectedNodes: EditorNode[] } {
        // Prefer transaction-driven analysis
        if (input.transaction) {
            return ChangeAnalyzer._analyzeViaTransaction(input.transaction, input.beforeDoc, input.afterDoc);
        }

        // Fallback: snapshot-based analysis (less reliable)
        return ChangeAnalyzer._analyzeViaSnapshot(input.beforeDoc, input.afterDoc);
    }

    /**
     * Analyzes change using transaction steps (preferred approach).
     *
     * @param {PMTransaction} transaction - The PM transaction.
     * @param {PMNode} beforeDoc - Document before the change.
     * @param {PMNode} afterDoc - Document after the change.
     * @returns {Object} An object with `action` and `affectedNodes`.
     * @hidden
     */
    private static _analyzeViaTransaction(
        transaction: PMTransaction,
        beforeDoc: PMNode,
        afterDoc: PMNode
    ): { action: DocumentChangeAction; affectedNodes: EditorNode[] } {
        // Classify action from steps
        const action: DocumentChangeAction = ChangeAnalyzer._classifyActionFromSteps(transaction, beforeDoc, afterDoc);

        // Find affected nodes using changed ranges
        const { affectedNodes } = ChangeAnalyzer._findAffectedNodesViaSteps(
            transaction,
            beforeDoc,
            afterDoc
        );

        return { action, affectedNodes };
    }

    /**
     * Analyzes change using document snapshots (fallback).
     *
     * @param {PMNode} beforeDoc - Document before the change.
     * @param {PMNode} afterDoc - Document after the change.
     * @returns {Object} An object with `action` and `affectedNodes`.
     * @hidden
     */
    private static _analyzeViaSnapshot(
        beforeDoc: PMNode,
        afterDoc: PMNode
    ): { action: DocumentChangeAction; affectedNodes: EditorNode[] } {
        // Fallback: use size and structure heuristics
        const action: DocumentChangeAction = ChangeAnalyzer._classifyActionFromSnapshot(beforeDoc, afterDoc);

        // Find affected nodes
        const { affectedNodes } = ChangeAnalyzer._findAffectedNodesViaSnapshot(beforeDoc, afterDoc);

        return { action, affectedNodes };
    }

    /**
     * Classifies action from transaction steps (primary method).
     *
     * Examines step types and metadata to determine semantic change:
     * - AddMarkStep / RemoveMarkStep → Formatting
     * - AttrStep → Update
     * - ReplaceAroundStep → Replaced (structural transformation)
     * - ReplaceStep → Insertion / Deletion / Replaced based on actual step ranges
     * - Multiple step aggregation for complex transactions
     *
     * @param {PMTransaction} transaction - The PM transaction.
     * @param {PMNode} beforeDoc - Document before the change.
     * @param {PMNode} afterDoc - Document after the change.
     * @returns {DocumentChangeAction} Semantic classification of the change.
     * @hidden
     */
    private static _classifyActionFromSteps(
        transaction: PMTransaction,
        beforeDoc: PMNode,
        afterDoc: PMNode
    ): DocumentChangeAction {
        const steps: PMStep[] = transaction.steps;

        if (!steps || steps.length === 0) {
            return 'Unknown';
        }

        // Aggregate step types in this transaction
        let hasMarkChange: boolean = false;
        let hasAttrChange: boolean = false;
        let hasReplaceAroundStep: boolean = false;
        let hasReplaceStep: boolean = false;
        let totalDeletedSize: number = 0;
        let totalInsertedSize: number = 0;

        for (let i: number = 0; i < steps.length; i++) {
            const step: PMStep = steps[i as number];

            // Mark changes: AddMarkStep, RemoveMarkStep
            if (step instanceof AddMarkStep || step instanceof RemoveMarkStep) {
                hasMarkChange = true;
            }
            // Attribute changes: AttrStep
            else if (step instanceof AttrStep) {
                hasAttrChange = true;
            }
            // Structural transformation: ReplaceAroundStep (wrapping, lifting, blockquote, list toggle, etc.)
            else if (step instanceof ReplaceAroundStep) {
                hasReplaceAroundStep = true;
            }
            // Content replacement: ReplaceStep
            else if (step instanceof ReplaceStep) {
                hasReplaceStep = true;
                // Calculate actual deleted and inserted sizes from this step
                const replaceStep: ReplaceStepShape = step as unknown as ReplaceStepShape;
                const deletedRange: number = Math.max(0, replaceStep.to - replaceStep.from);
                const insertedSize: number = replaceStep.slice.content.size;
                totalDeletedSize += deletedRange;
                totalInsertedSize += insertedSize;
            }
        }

        // Classification priority: most specific → least specific

        // 1. Mark-only changes → Formatting
        if (hasMarkChange && !hasReplaceStep && !hasReplaceAroundStep && !hasAttrChange) {
            return 'Formatting';
        }

        // 2. Attribute-only changes → Update
        if (hasAttrChange && !hasReplaceStep && !hasReplaceAroundStep && !hasMarkChange) {
            return 'Update';
        }

        // 3. Structural transformations (wrapping, lifting, etc.) → Replaced
        if (hasReplaceAroundStep) {
            return 'Replaced';
        }

        // 4. Content replacement: classify based on actual step semantics
        if (hasReplaceStep) {
            // Deleting all content is normalized by ProseMirror to an empty
            // paragraph. That structural paragraph is inserted by the schema,
            // not by the user, so the semantic action is still Deletion.
            if (beforeDoc.textContent.length > 0 && afterDoc.textContent.length === 0) {
                return 'Deletion';
            }
            // Determine classification based on what the ReplaceStep actually does
            if (totalDeletedSize === 0 && totalInsertedSize > 0) {
                // Only insertion (no deletion)
                return 'Insertion';
            } else if (totalDeletedSize > 0 && totalInsertedSize === 0) {
                // Only deletion (no insertion)
                return 'Deletion';
            } else if (totalDeletedSize > 0 && totalInsertedSize > 0) {
                // Both deletion and insertion in same range
                return 'Replaced';
            }
        }

        // Fallback: check document size only if no transaction steps provided meaningful signal
        const beforeSize: number = beforeDoc.content.size;
        const afterSize: number = afterDoc.content.size;

        if (afterSize > beforeSize) {
            return 'Insertion';
        } else if (afterSize < beforeSize) {
            return 'Deletion';
        }

        // Cannot determine from steps or snapshot
        return 'Unknown';
    }

    /**
     * Classifies action from document snapshots (fallback).
     *
     * @param {PMNode} beforeDoc - Document before the change.
     * @param {PMNode} afterDoc - Document after the change.
     * @returns {DocumentChangeAction} Semantic classification of the change.
     * @hidden
     */
    private static _classifyActionFromSnapshot(beforeDoc: PMNode, afterDoc: PMNode): DocumentChangeAction {
        const beforeSize: number = beforeDoc.content.size;
        const afterSize: number = afterDoc.content.size;

        // Size increased: insertion
        if (afterSize > beforeSize) {
            return 'Insertion';
        }

        // Size decreased: deletion
        if (afterSize < beforeSize) {
            return 'Deletion';
        }

        // Size unchanged: check for structural changes or attribute updates
        if (ChangeAnalyzer._hasStructuralChange(beforeDoc, afterDoc)) {
            return 'Moved';
        }

        if (ChangeAnalyzer._hasReplacementPattern(beforeDoc, afterDoc)) {
            return 'Replaced';
        }

        if (ChangeAnalyzer._hasAttributeChange(beforeDoc, afterDoc)) {
            return 'Update';
        }

        // Cannot categorize
        return 'Unknown';
    }

    /**
     * Detects whether document structure changed (nodes moved, reordered, etc.)
     * while size remained the same.
     *
     * Heuristic: walk both docs in parallel and check if child count or type order differs.
     *
     * @param {PMNode} beforeDoc - Document before
     * @param {PMNode} afterDoc - Document after
     * @returns {boolean} True if structural changes detected
     * @hidden
     */
    private static _hasStructuralChange(beforeDoc: PMNode, afterDoc: PMNode): boolean {
        // Quick check: child count difference
        if (beforeDoc.childCount !== afterDoc.childCount) {
            return true;
        }

        // Walk children and check if types or order changed
        for (let i: number = 0; i < beforeDoc.childCount; i++) {
            const beforeChild: PMNode = beforeDoc.child(i);
            const afterChild: PMNode = afterDoc.child(i);

            if (beforeChild.type.name !== afterChild.type.name) {
                return true;
            }
        }

        return false;
    }

    /**
     * Detects replacement patterns (e.g., Find & Replace, content transformation).
     *
     * Heuristic: similar size, but majority of nodes differ.
     *
     * @param {PMNode} beforeDoc - Document before
     * @param {PMNode} afterDoc - Document after
     * @returns {boolean} True if replacement pattern detected
     * @hidden
     */
    private static _hasReplacementPattern(beforeDoc: PMNode, afterDoc: PMNode): boolean {
        // Simple heuristic: if more than 50% of children are different, it's a replacement
        const minCount: number = Math.min(beforeDoc.childCount, afterDoc.childCount);
        if (minCount === 0) {
            return false; // Empty doc or one side empty
        }

        let differentCount: number = 0;

        for (let i: number = 0; i < minCount; i++) {
            const beforeChild: PMNode = beforeDoc.child(i);
            const afterChild: PMNode = afterDoc.child(i);

            if (beforeChild.type.name !== afterChild.type.name) {
                differentCount++;
            }
        }

        const percentDifferent: number = (differentCount / minCount) * 100;
        return percentDifferent > 50;
    }

    /**
     * Detects attribute-only changes (no structural or content changes).
     *
     * Heuristic: same structure and content, but attrs differ on some nodes.
     *
     * @param {PMNode} beforeDoc - Document before
     * @param {PMNode} afterDoc - Document after
     * @returns {boolean} True if attribute changes detected
     * @hidden
     */
    private static _hasAttributeChange(beforeDoc: PMNode, afterDoc: PMNode): boolean {
        // Walk both docs and check if any attrs differ
        let foundAttrChange: boolean = false;

        beforeDoc.nodesBetween(0, beforeDoc.content.size, (node: PMNode, pos: number): boolean => {
            const afterNode: PMNode | null = afterDoc.nodeAt(pos);
            if (!afterNode || node.type !== afterNode.type) {
                return false; // Type mismatch, not attr-only
            }

            // Compare attributes
            if (!_attrObjectsEqual(node.attrs, afterNode.attrs)) {
                foundAttrChange = true;
                return false; // Stop walking
            }

            return true;
        });

        return foundAttrChange;
    }

    /**
     * Finds affected nodes using transaction step mapping (preferred).
     *
     * Uses StepMap to identify changed ranges, then converts PM nodes directly.
     *
     * @param {PMTransaction} transaction - The PM transaction.
     * @param {PMNode} beforeDoc - Document before the change.
     * @param {PMNode} afterDoc - Document after the change.
     * @returns {Object} An object with `affectedNodes`.
     * @hidden
     */
    private static _findAffectedNodesViaSteps(
        transaction: PMTransaction,
        beforeDoc: PMNode,
        afterDoc: PMNode
    ): { affectedNodes: EditorNode[] } {
        // Extract step-aware ranges from each step
        const stepRanges: Array<{ oldFrom: number; oldTo: number; newFrom: number; newTo: number }> = [];
        ChangeAnalyzer._extractStepRanges(transaction, beforeDoc, afterDoc, stepRanges);

        // Resolve PM nodes in those ranges and convert them directly. PM text
        // nodes and newly-created nodes do not always carry attrs.id, so an
        // ID-only intermediate set can lose the affected node entirely.
        const affectedNodes: EditorNode[] = [];
        ChangeAnalyzer._collectAffectedNodesFromRanges(afterDoc, stepRanges, affectedNodes);

        return { affectedNodes };
    }

    /**
     * Finds affected nodes using document snapshots (fallback).
     *
     * Fallback strategy when transaction is unavailable:
     * - Convert the relevant before/after PM snapshots directly
     * - Less precise than transaction-driven analysis
     *
     * @param {PMNode} beforeDoc - Document before the change.
     * @param {PMNode} afterDoc - Document after the change.
     * @returns {Object} An object with `affectedNodes`.
     * @hidden
     */
    private static _findAffectedNodesViaSnapshot(
        beforeDoc: PMNode,
        afterDoc: PMNode
    ): { affectedNodes: EditorNode[] } {
        // Without a transaction there is no reliable changed range. Do not
        // label the whole post-change document as affected; return an empty
        // best-effort result rather than misleading analytics consumers.
        void beforeDoc;
        void afterDoc;
        return { affectedNodes: [] };
    }

    /**
     * Extracts step-aware old/new ranges from transaction steps.
     *
     * For each step, determines which document positions were affected using:
     * - Step-specific properties: AddMarkStep.from/to, RemoveMarkStep.from/to, AttrStep.pos
     * - StepMap for structural changes: ReplaceStep, ReplaceAroundStep
     *
     * @param {PMTransaction} transaction - The PM transaction.
     * @param {PMNode} beforeDoc - Document before the change.
     * @param {PMNode} afterDoc - Document after the change.
     * @param {Array} stepRanges - Accumulator for extracted ranges.
     * @returns {void}
     * @hidden
     */
    private static _extractStepRanges(
        transaction: PMTransaction,
        beforeDoc: PMNode,
        afterDoc: PMNode,
        stepRanges: Array<{ oldFrom: number; oldTo: number; newFrom: number; newTo: number }>
    ): void {
        for (let i: number = 0; i < transaction.steps.length; i++) {
            const step: PMStep = transaction.steps[i as number];
            const stepMap: StepMapShape = transaction.mapping.maps[i as number] as unknown as StepMapShape;
            const remainingMapping: Mapping = transaction.mapping.slice(i + 1);

            let oldFrom: number;
            let oldTo: number;
            let newFrom: number;
            let newTo: number;

            // Determine ranges based on step type using instanceof checks
            if (step instanceof AddMarkStep || step instanceof RemoveMarkStep) {
                // AddMarkStep / RemoveMarkStep: from/to are the affected range
                const markStep: MarkStepShape = step as unknown as MarkStepShape;
                oldFrom = markStep.from;
                oldTo = markStep.to;
                newFrom = remainingMapping.map(stepMap.map(oldFrom));
                newTo = remainingMapping.map(stepMap.map(oldTo));
            } else if (step instanceof AttrStep) {
                // AttrStep: affects single node position
                const attrStep: AttrStepShape = step as unknown as AttrStepShape;
                oldFrom = attrStep.pos;
                oldTo = attrStep.pos + 1;
                newFrom = remainingMapping.map(stepMap.map(oldFrom));
                newTo = remainingMapping.map(stepMap.map(oldTo));
            } else if (step instanceof ReplaceStep) {
                // ReplaceStep ranges are already available as old/new pairs in
                // the step map. Mapping the step boundaries first moves an
                // insertion range past its inserted content and can make the
                // range empty.
                stepMap.forEach((mapOldFrom: number, mapOldTo: number, mapNewFrom: number, mapNewTo: number): void => {
                    stepRanges.push({
                        oldFrom: mapOldFrom,
                        oldTo: mapOldTo,
                        newFrom: remainingMapping.map(mapNewFrom),
                        newTo: remainingMapping.map(mapNewTo)
                    });
                });
                continue;
            } else if (step instanceof ReplaceAroundStep) {
                // ReplaceAroundStep can produce multiple changed ranges; use
                // the step map's old/new coordinates rather than reconstructing
                // them from the slice and gap sizes.
                stepMap.forEach((mapOldFrom: number, mapOldTo: number, mapNewFrom: number, mapNewTo: number): void => {
                    stepRanges.push({
                        oldFrom: mapOldFrom,
                        oldTo: mapOldTo,
                        newFrom: remainingMapping.map(mapNewFrom),
                        newTo: remainingMapping.map(mapNewTo)
                    });
                });
                continue;
            } else {
                // Fallback: use entire document
                oldFrom = 0;
                oldTo = beforeDoc.content.size;
                newFrom = 0;
                newTo = afterDoc.content.size;
            }

            stepRanges.push({ oldFrom, oldTo, newFrom, newTo });
        }
    }

    /**
     * Collects logical affected nodes by resolving PM nodes in changed ranges.
     *
     * Uses PM.nodesBetween to resolve actual PM nodes within affected ranges,
     * then converts them directly to EditorNode instances.
     *
     * @param {PMNode} afterDoc - Document after the change.
     * @param {Array} stepRanges - Extracted step ranges.
     * @param {EditorNode[]} affectedNodes - Array accumulating converted nodes.
     * @returns {void}
     * @hidden
     */
    private static _collectAffectedNodesFromRanges(
        afterDoc: PMNode,
        stepRanges: Array<{ oldFrom: number; oldTo: number; newFrom: number; newTo: number }>,
        affectedNodes: EditorNode[]
    ): void {
        const seenNodes: Set<PMNode> = new Set();

        const collectNodes: (doc: PMNode, from: number, to: number) => void = (doc: PMNode, from: number, to: number): void => {
            if (from >= to) {
                return;
            }
            doc.nodesBetween(from, to, (pmNode: PMNode): void => {
                // Text nodes are represented by their containing logical node
                // in the public event. Returning both a paragraph and its text
                // child would expose PM implementation details as duplicates.
                if (pmNode.isText) {
                    return;
                }
                if (seenNodes.has(pmNode)) {
                    return;
                }
                seenNodes.add(pmNode);
                affectedNodes.push(NodeMapper.fromPMNode(pmNode));
            });
        };

        // Always expose the post-transaction snapshot. For a partial deletion,
        // this returns the containing node without the deleted content. When a
        // whole node is deleted, no corresponding node exists in afterDoc.
        for (let i: number = 0; i < stepRanges.length; i++) {
            const range: { oldFrom: number; oldTo: number; newFrom: number; newTo: number } = stepRanges[i as number];
            let from: number = Math.max(0, range.newFrom);
            let to: number = Math.min(afterDoc.content.size, range.newTo);
            if (from >= to && afterDoc.content.size > 0) {
                // A pure deletion maps to a zero-width new range. Expand it by
                // one document position so the surviving containing block is
                // still reported without consulting beforeDoc.
                from = Math.max(0, Math.min(afterDoc.content.size - 1, from - 1));
                to = Math.min(afterDoc.content.size, from + 1);
            }
            collectNodes(afterDoc, from, to);
        }
    }

    /**
     * Type checks for PM steps using instanceof.
     *
     * @param {PMStep} step - The PM step to test.
     * @returns {boolean} True when the step is an AddMarkStep.
     * @hidden
     */
    private static _isAddMarkStep(step: PMStep): boolean {
        return step instanceof AddMarkStep;
    }

    /**
     * @param {PMStep} step - The PM step to test.
     * @returns {boolean} True when the step is a RemoveMarkStep.
     * @hidden
     */
    private static _isRemoveMarkStep(step: PMStep): boolean {
        return step instanceof RemoveMarkStep;
    }

    /**
     * @param {PMStep} step - The PM step to test.
     * @returns {boolean} True when the step is an AttrStep.
     * @hidden
     */
    private static _isAttrStep(step: PMStep): boolean {
        return step instanceof AttrStep;
    }

    /**
     * @param {PMStep} step - The PM step to test.
     * @returns {boolean} True when the step is a ReplaceStep.
     * @hidden
     */
    private static _isReplaceStep(step: PMStep): boolean {
        return step instanceof ReplaceStep;
    }

}

/**
 * Compares two attribute objects for equality.
 *
 * @param {Object} attrs1 - First attrs object (or undefined).
 * @param {Object} attrs2 - Second attrs object (or undefined).
 * @returns {boolean} True if attrs are equal.
 * @hidden
 */
function _attrObjectsEqual(
    attrs1: Record<string, unknown> | undefined,
    attrs2: Record<string, unknown> | undefined
): boolean {
    if (attrs1 === attrs2) {
        return true;
    }
    if (!attrs1 || !attrs2) {
        return false;
    }

    const keys1: string[] = Object.keys(attrs1);
    const keys2: string[] = Object.keys(attrs2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let i: number = 0; i < keys1.length; i++) {
        const key: string = keys1[i as number];
        // attrs1/attrs2 are plain attribute records; dynamic key access is safe here.
        // eslint-disable-next-line security/detect-object-injection
        if (attrs1[key] !== attrs2[key]) {
            return false;
        }
    }

    return true;
}
