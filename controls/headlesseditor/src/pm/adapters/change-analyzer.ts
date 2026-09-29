/**
 * change-analyzer.ts — Transaction-driven change action classification and affected node detection.
 *
 * Analyzes PM transactions using step-aware range extraction, PM-based node resolution,
 * and stable Syncfusion node IDs to reliably classify semantic changes and identify affected nodes.
 *
 * Architecture:
 * ────────────────────────────────────────────────────────────────
 * Step → Step-aware range extraction
 *   ↓
 * Old/new ranges (from step.from/to or StepMap)
 *   ↓
 * PM.nodesBetween() to resolve PM nodes in ranges
 *   ↓
 * Extract stable attrs.id from PM nodes
 *   ↓
 * Build ID → EditorNode lookup maps (before & after)
 *   ↓
 * Aggregate IDs across all steps
 *   ↓
 * Return EditorNodes from both snapshots
 * ────────────────────────────────────────────────────────────────
 *
 * Key design decisions:
 * 1. Range extraction uses step-specific properties (AddMarkStep.from/to, ReplaceStep ranges, etc.)
 * 2. Structural changes use StepMap via proper range iteration, not position guessing
 * 3. PM is source of truth for node resolution (PM.nodesBetween)
 * 4. Stable node IDs drive affected-node identity (not positions)
 * 5. affectedNodes includes deleted nodes from beforeDoc, inserted/updated from afterDoc
 * 6. Multi-step transactions aggregate into single semantic action
 */

import { type PMNode, type PMTransaction, type PMStep, AddMarkStep, RemoveMarkStep, ReplaceStep, ReplaceAroundStep, AttrStep } from '../pm-guard';
import { EditorNode, DocumentRoot } from '../../model/editor-node';
import { DocumentMapper } from './document-mapper';
import type { IdGenerator } from '../../utils/id-generator';
import type { DocumentChangeAction } from '../../events/public-events/document-events';

/**
 * ChangeAnalyzer — detects semantic document change actions and affected nodes using transaction steps.
 *
 * @internal
 */
export class ChangeAnalyzer {
    /**
     * Analyzes a transaction and returns the semantic action + affected nodes.
     *
     * Preferred API: receives transaction for step-driven analysis.
     * Fallback: if transaction unavailable, performs snapshot-based analysis (less reliable).
     *
     * @param {Object} input - Analysis input with optional transaction, beforeDoc, afterDoc.
     * @param {IdGenerator} idGen - ID generator for node tracking.
     * @returns {Object} An object with `action`, `affectedNodes`, and `affectedNodeIds`.
     * @hidden
     */
    public static analyzeChange(
        input: { transaction?: PMTransaction; beforeDoc: PMNode; afterDoc: PMNode },
        idGen: IdGenerator
    ): { action: DocumentChangeAction; affectedNodes: EditorNode[]; affectedNodeIds: string[] } {
        // Prefer transaction-driven analysis
        if (input.transaction) {
            return ChangeAnalyzer._analyzeViaTransaction(input.transaction, input.beforeDoc, input.afterDoc, idGen);
        }

        // Fallback: snapshot-based analysis (less reliable)
        return ChangeAnalyzer._analyzeViaSnapshot(input.beforeDoc, input.afterDoc, idGen);
    }

    /**
     * Analyzes change using transaction steps (preferred approach).
     *
     * @param {PMTransaction} transaction - The PM transaction.
     * @param {PMNode} beforeDoc - Document before the change.
     * @param {PMNode} afterDoc - Document after the change.
     * @param {IdGenerator} idGen - ID generator for node tracking.
     * @returns {Object} An object with `action`, `affectedNodes`, and `affectedNodeIds`.
     * @hidden
     */
    private static _analyzeViaTransaction(
        transaction: PMTransaction,
        beforeDoc: PMNode,
        afterDoc: PMNode,
        idGen: IdGenerator
    ): { action: DocumentChangeAction; affectedNodes: EditorNode[]; affectedNodeIds: string[] } {
        // Classify action from steps
        const action: DocumentChangeAction = ChangeAnalyzer._classifyActionFromSteps(transaction, beforeDoc, afterDoc);

        // Find affected nodes using changed ranges
        const { affectedNodes, affectedNodeIds } = ChangeAnalyzer._findAffectedNodesViaSteps(
            transaction,
            beforeDoc,
            afterDoc,
            action,
            idGen
        );

        return { action, affectedNodes, affectedNodeIds };
    }

    /**
     * Analyzes change using document snapshots (fallback).
     *
     * @param {PMNode} beforeDoc - Document before the change.
     * @param {PMNode} afterDoc - Document after the change.
     * @param {IdGenerator} idGen - ID generator for node tracking.
     * @returns {Object} An object with `action`, `affectedNodes`, and `affectedNodeIds`.
     * @hidden
     */
    private static _analyzeViaSnapshot(
        beforeDoc: PMNode,
        afterDoc: PMNode,
        idGen: IdGenerator
    ): { action: DocumentChangeAction; affectedNodes: EditorNode[]; affectedNodeIds: string[] } {
        // Fallback: use size and structure heuristics
        const action: DocumentChangeAction = ChangeAnalyzer._classifyActionFromSnapshot(beforeDoc, afterDoc);

        // Find affected nodes
        const { affectedNodes, affectedNodeIds } = ChangeAnalyzer._findAffectedNodesViaSnapshot(
            beforeDoc,
            afterDoc,
            action,
            idGen
        );

        return { action, affectedNodes, affectedNodeIds };
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
                const replaceStep: any = step;
                const deletedRange: number = Math.max(0, replaceStep.to - replaceStep.from);
                const insertedSize: number = replaceStep.slice?.content.size ?? 0;
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
     * Collects Syncfusion node IDs that overlap with given PM ranges.
     *
     * Helper for step-driven affected node detection.
     *
     * @param {EditorNode} node - Current node being inspected.
     * @param {Array} ranges - PM ranges to match.
     * @param {Set<string>} affectedIds - Set accumulating matched node IDs.
     * @param {number} [currentPos] - Starting position for the current node.
     * @returns {number} Position after walking the node subtree.
     * @hidden
     */
    private static _collectNodesByRange(
        node: EditorNode,
        ranges: Array<{ from: number; to: number }>,
        affectedIds: Set<string>,
        currentPos: number = 0
    ): number {
        let pos: number = currentPos;

        // Check if this node overlaps with any range
        for (let i: number = 0; i < ranges.length; i++) {
            const range: { from: number; to: number } = ranges[i as number];
            if (pos >= range.from && pos <= range.to) {
                affectedIds.add(node.id);
                break;
            }
        }

        // Walk children
        if (node.children) {
            for (let i: number = 0; i < node.children.length; i++) {
                pos = ChangeAnalyzer._collectNodesByRange(node.children[i as number], ranges, affectedIds, pos);
            }
        }

        return pos;
    }

    /**
     * Collects EditorNode instances by their IDs from a document.
     *
     * Helper for building final affected nodes list.
     *
     * @param {EditorNode} node - Root node to walk.
     * @param {Set<string>} ids - Set of node IDs to collect.
     * @returns {EditorNode[]} Nodes matching the provided IDs.
     * @hidden
     */
    private static _collectNodesByIds(
        node: EditorNode,
        ids: Set<string>
    ): EditorNode[] {
        const result: EditorNode[] = [];

        ChangeAnalyzer._walkDocumentNodes(node, (n: EditorNode): void => {
            if (ids.has(n.id)) {
                result.push(n);
            }
        });

        return result;
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
     * Uses StepMap to identify changed ranges, then maps to Syncfusion node IDs.
     *
     * @param {PMTransaction} transaction - The PM transaction.
     * @param {PMNode} beforeDoc - Document before the change.
     * @param {PMNode} afterDoc - Document after the change.
     * @param {DocumentChangeAction} action - Semantic action classification.
     * @param {IdGenerator} idGen - ID generator for node tracking.
     * @returns {Object} An object with `affectedNodes` and `affectedNodeIds`.
     * @hidden
     */
    private static _findAffectedNodesViaSteps(
        transaction: PMTransaction,
        beforeDoc: PMNode,
        afterDoc: PMNode,
        action: DocumentChangeAction,
        idGen: IdGenerator
    ): { affectedNodes: EditorNode[]; affectedNodeIds: string[] } {
        // Collect affected node IDs using step-aware range extraction
        const affectedNodeIds: Set<string> = new Set();

        // Extract step-aware ranges from each step
        const stepRanges: Array<{ oldFrom: number; oldTo: number; newFrom: number; newTo: number }> = [];
        ChangeAnalyzer._extractStepRanges(transaction, beforeDoc, afterDoc, stepRanges);

        // Resolve PM nodes in those ranges and collect their stable IDs
        ChangeAnalyzer._collectAffectedNodeIdsFromRanges(
            transaction,
            beforeDoc,
            afterDoc,
            stepRanges,
            affectedNodeIds,
            action
        );

        // Build before and after DocumentRoot snapshots once
        const beforeModel: DocumentRoot = DocumentMapper.fromPMDoc(beforeDoc, idGen);
        const afterModel: DocumentRoot = DocumentMapper.fromPMDoc(afterDoc, idGen);

        // Build ID lookup maps for O(1) access
        const beforeNodeMap: Map<string, EditorNode> = ChangeAnalyzer._buildNodeIdMap(beforeModel);
        const afterNodeMap: Map<string, EditorNode> = ChangeAnalyzer._buildNodeIdMap(afterModel);

        // Collect affected EditorNodes from both snapshots
        // - Deleted nodes come from beforeModel
        // - Inserted/updated nodes come from afterModel
        const affectedNodes: EditorNode[] = ChangeAnalyzer._collectAffectedEditorNodes(
            affectedNodeIds,
            action,
            beforeNodeMap,
            afterNodeMap
        );

        return {
            affectedNodes,
            affectedNodeIds: Array.from(affectedNodeIds)
        };
    }

    /**
     * Finds affected nodes using document snapshots (fallback).
     *
     * Fallback strategy when transaction is unavailable:
     * - Walk both documents to find node ID differences
     * - Use ID comparison to determine inserted/deleted/updated nodes
     * - Less precise than transaction-driven analysis
     *
     * @param {PMNode} beforeDoc - Document before the change.
     * @param {PMNode} afterDoc - Document after the change.
     * @param {DocumentChangeAction} action - Semantic action classification.
     * @param {IdGenerator} idGen - ID generator for node tracking.
     * @returns {Object} An object with `affectedNodes` and `affectedNodeIds`.
     * @hidden
     */
    private static _findAffectedNodesViaSnapshot(
        beforeDoc: PMNode,
        afterDoc: PMNode,
        action: DocumentChangeAction,
        idGen: IdGenerator
    ): { affectedNodes: EditorNode[]; affectedNodeIds: string[] } {
        // Build before/after models once
        const beforeModel: DocumentRoot = DocumentMapper.fromPMDoc(beforeDoc, idGen);
        const afterModel: DocumentRoot = DocumentMapper.fromPMDoc(afterDoc, idGen);

        // Build ID lookup maps
        const beforeNodeMap: Map<string, EditorNode> = ChangeAnalyzer._buildNodeIdMap(beforeModel);
        const afterNodeMap: Map<string, EditorNode> = ChangeAnalyzer._buildNodeIdMap(afterModel);

        const affectedNodeIds: Set<string> = new Set();
        const beforeIds: Set<string> = new Set(beforeNodeMap.keys());
        const afterIds: Set<string> = new Set(afterNodeMap.keys());

        if (action === 'Insertion') {
            // Collect newly inserted IDs (in after but not before)
            afterIds.forEach((id: string): void => {
                if (!beforeIds.has(id)) {
                    affectedNodeIds.add(id);
                }
            });
        } else if (action === 'Deletion') {
            // Collect deleted IDs (in before but not after)
            beforeIds.forEach((id: string): void => {
                if (!afterIds.has(id)) {
                    affectedNodeIds.add(id);
                }
            });
        } else {
            // For other actions (Update, Formatting, Replaced), collect all IDs from both
            // This is less precise but safer as a fallback
            afterIds.forEach((id: string): void => {
                affectedNodeIds.add(id);
            });
            beforeIds.forEach((id: string): void => {
                affectedNodeIds.add(id);
            });
        }

        // Collect EditorNodes from both snapshots
        const affectedNodes: EditorNode[] = ChangeAnalyzer._collectAffectedEditorNodes(
            affectedNodeIds,
            action,
            beforeNodeMap,
            afterNodeMap
        );

        return {
            affectedNodes,
            affectedNodeIds: Array.from(affectedNodeIds)
        };
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
            const stepMap: any = transaction.mapping.maps[i as number];

            let oldFrom: number;
            let oldTo: number;
            let newFrom: number;
            let newTo: number;

            // Determine ranges based on step type using instanceof checks
            if (step instanceof AddMarkStep || step instanceof RemoveMarkStep) {
                // AddMarkStep / RemoveMarkStep: from/to are the affected range
                const markStep: any = step;
                oldFrom = markStep.from;
                oldTo = markStep.to;
                newFrom = stepMap.map(oldFrom);
                newTo = stepMap.map(oldTo);
            } else if (step instanceof AttrStep) {
                // AttrStep: affects single node position
                const attrStep: any = step;
                oldFrom = attrStep.pos;
                oldTo = attrStep.pos + 1;
                newFrom = stepMap.map(oldFrom);
                newTo = stepMap.map(oldTo);
            } else if (step instanceof ReplaceStep) {
                // ReplaceStep: from/to + slice give old/new sizes
                const replaceStep: any = step;
                oldFrom = replaceStep.from;
                oldTo = replaceStep.to;
                const sliceSize: number = replaceStep.slice?.content.size ?? 0;
                newFrom = stepMap.map(oldFrom);
                newTo = newFrom + sliceSize;
            } else if (step instanceof ReplaceAroundStep) {
                // ReplaceAroundStep: structural wrapping/lifting/transformation
                const replaceAroundStep: any = step;
                oldFrom = replaceAroundStep.from;
                oldTo = replaceAroundStep.to;
                // For ReplaceAroundStep, the gapFrom/gapTo define the affected region
                const gapFrom: number = replaceAroundStep.gapFrom ?? replaceAroundStep.from;
                const gapTo: number = replaceAroundStep.gapTo ?? replaceAroundStep.to;
                const gapSize: number = gapTo - gapFrom;
                const sliceSize: number = replaceAroundStep.slice?.content.size ?? 0;
                newFrom = stepMap.map(oldFrom);
                newTo = newFrom + sliceSize + gapSize;
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
     * Collects affected node IDs by resolving PM nodes in changed ranges.
     *
     * Uses PM.nodesBetween to resolve actual PM nodes within affected ranges,
     * then extracts their stable attrs.id for identity tracking.
     *
     * @param {PMTransaction} transaction - The PM transaction.
     * @param {PMNode} beforeDoc - Document before the change.
     * @param {PMNode} afterDoc - Document after the change.
     * @param {Array} stepRanges - Extracted step ranges.
     * @param {Set<string>} affectedNodeIds - Set accumulating matched node IDs.
     * @param {DocumentChangeAction} action - Semantic action classification.
     * @returns {void}
     * @hidden
     */
    private static _collectAffectedNodeIdsFromRanges(
        transaction: PMTransaction,
        beforeDoc: PMNode,
        afterDoc: PMNode,
        stepRanges: Array<{ oldFrom: number; oldTo: number; newFrom: number; newTo: number }>,
        affectedNodeIds: Set<string>,
        action: DocumentChangeAction
    ): void {
        const collectFromBefore: boolean = action === 'Deletion' || action === 'Replaced';
        const collectFromAfter: boolean = action !== 'Deletion';

        // Collect IDs from before document (for deleted ranges)
        if (collectFromBefore) {
            for (let i: number = 0; i < stepRanges.length; i++) {
                const range: { oldFrom: number; oldTo: number; newFrom: number; newTo: number } = stepRanges[i as number];
                const from: number = Math.max(0, range.oldFrom);
                const to: number = Math.min(beforeDoc.content.size, range.oldTo);

                if (from < to) {
                    beforeDoc.nodesBetween(from, to, (pmNode: PMNode): void => {
                        const id: string | undefined = pmNode.attrs?.id;
                        if (id) {
                            affectedNodeIds.add(id);
                        }
                    });
                }
            }
        }

        // Collect IDs from after document (for inserted/updated ranges)
        if (collectFromAfter) {
            for (let i: number = 0; i < stepRanges.length; i++) {
                const range: { oldFrom: number; oldTo: number; newFrom: number; newTo: number } = stepRanges[i as number];
                const from: number = Math.max(0, range.newFrom);
                const to: number = Math.min(afterDoc.content.size, range.newTo);

                if (from < to) {
                    afterDoc.nodesBetween(from, to, (pmNode: PMNode): void => {
                        const id: string | undefined = pmNode.attrs?.id;
                        if (id) {
                            affectedNodeIds.add(id);
                        }
                    });
                }
            }
        }
    }

    /**
     * Builds a Map<nodeId, EditorNode> for O(1) lookup across entire document tree.
     *
     * @param {EditorNode} root - Root of the document tree to walk.
     * @returns {Map<string, EditorNode>} Map keyed by node ID.
     * @hidden
     */
    private static _buildNodeIdMap(root: EditorNode): Map<string, EditorNode> {
        const map: Map<string, EditorNode> = new Map();

        ChangeAnalyzer._walkDocumentNodes(root, (node: EditorNode): void => {
            map.set(node.id, node);
        });

        return map;
    }

    /**
     * Collects EditorNodes corresponding to affected IDs from both before and after snapshots.
     *
     * - Deleted nodes: collected from beforeNodeMap
     * - Inserted/Updated nodes: collected from afterNodeMap
     *
     * This ensures affectedNodes and affectedNodeIds are always consistent.
     *
     * @param {Set<string>} affectedNodeIds - IDs of affected nodes.
     * @param {DocumentChangeAction} action - Semantic action classification.
     * @param {Map<string, EditorNode>} beforeNodeMap - Before snapshot ID lookup.
     * @param {Map<string, EditorNode>} afterNodeMap - After snapshot ID lookup.
     * @returns {EditorNode[]} Affected EditorNode instances.
     * @hidden
     */
    private static _collectAffectedEditorNodes(
        affectedNodeIds: Set<string>,
        action: DocumentChangeAction,
        beforeNodeMap: Map<string, EditorNode>,
        afterNodeMap: Map<string, EditorNode>
    ): EditorNode[] {
        const result: EditorNode[] = [];
        const seen: Set<string> = new Set();

        affectedNodeIds.forEach((id: string): void => {
            if (seen.has(id)) {
                return;
            }
            seen.add(id);

            // For deletions, prefer deleted node from beforeNodeMap
            if (action === 'Deletion') {
                const deletedNode: EditorNode | undefined = beforeNodeMap.get(id);
                if (deletedNode) {
                    result.push(deletedNode);
                    return;
                }
            }

            // Otherwise, use node from afterNodeMap (inserted or updated)
            const node: EditorNode | undefined = afterNodeMap.get(id);
            if (node) {
                result.push(node);
            }
        });

        return result;
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

    /**
     * Recursively walks a DocumentRoot and invokes a callback for each node.
     *
     * @param {EditorNode} node - Current node.
     * @param {Function} callback - Callback invoked for each node.
     * @returns {void}
     * @hidden
     */
    private static _walkDocumentNodes(node: EditorNode, callback: (node: EditorNode) => void): void {
        callback(node);
        if (node.children && node.children.length > 0) {
            for (let i: number = 0; i < node.children.length; i++) {
                ChangeAnalyzer._walkDocumentNodes(node.children[i as number], callback);
            }
        }
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
