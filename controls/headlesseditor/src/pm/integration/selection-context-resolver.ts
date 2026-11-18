import {
    PMCellSelection,
    PMEditorState,
    PMMark,
    PMNode,
    PMResolvedPos,
    NodeSelection,
    TextSelection,
    PMSelection
} from '../pm-guard';
import { SelectionContext, SelectionMark, SelectionNode } from '../../core/model/selection-context';

/**
 * Node types that are structural implementation details.
 */
const SKIPPED_CONTEXT_NODES: Set<string> = new Set<string>([
    'listItem',
    'taskItem',
    'tableCell',
    'tableRow',
    'collapsibleHeader',
    'collapsibleBody'
]);

interface RangeMarkState {
    markedInlineNodeCount: number;
    allAttributesMatch: boolean;
}

/**
 * Converts the current PM selection into the PM-free context exposed by the editor.
 */
export class SelectionContextResolver {
    /**
     * Resolves marks and relevant nodes for the current selection.
     *
     * @param {PMEditorState} pmState - The current ProseMirror editor state.
     * @returns {SelectionContext} PM-free marks and structural nodes.
     */
    public resolve(pmState: PMEditorState): SelectionContext {
        const selection: PMSelection = pmState.selection;

        if (selection instanceof PMCellSelection) {
            return {
                marks: [],
                nodes: this.resolveCellNodes(selection.$from)
            };
        }

        if (selection instanceof NodeSelection) {
            return {
                marks: [],
                nodes: this.resolveNodeSelection(selection, pmState.doc)
            };
        }

        if (!(selection instanceof TextSelection)) {
            return this.emptyContext();
        }

        return {
            marks: this.resolveMarks(pmState),
            nodes: this.resolveTextNodes(selection, pmState.doc)
        };
    }

    /**
     * Resolves marks that begin at the selection start and determines their range state.
     *
     * @param {PMEditorState} pmState - The current ProseMirror editor state.
     * @returns {SelectionMark[]} Selection-start marks with active or mixed state.
     */
    private resolveMarks(pmState: PMEditorState): SelectionMark[] {
        const selection: PMSelection = pmState.selection;

        const startMarksByType: Map<string, PMMark> = new Map<string, PMMark>();
        if (selection.from === selection.to) {
            selection.$from.marks().forEach((mark: PMMark): void => {
                startMarksByType.set(mark.type.name, mark);
            });

            // Include stored marks because they represent the formatting that will be applied
            // when typing at a cursor position.
            if (pmState.storedMarks) {
                pmState.storedMarks.forEach((mark: PMMark): void => {
                    startMarksByType.set(mark.type.name, mark);
                });
            }
        } else {
            // Resolve range-start marks from the first selected text node rather than
            // $from.marks(), whose result depends on mark inclusivity at boundaries.
            let foundSelectionStartNode: boolean = false;
            pmState.doc.nodesBetween(selection.from, selection.to, (node: PMNode): boolean => {
                if (!node.isInline || (node.isLeaf && !node.isText)) { return true; }
                if (!foundSelectionStartNode) {
                    node.marks.forEach((mark: PMMark): void => {
                        startMarksByType.set(mark.type.name, mark);
                    });
                    foundSelectionStartNode = true;
                }
                return false;
            });
        }
        const startMarks: PMMark[] = Array.from(startMarksByType.values());

        if (startMarks.length === 0) {
            return [];
        }

        // A cursor selection has no range to compare, so all marks at the cursor are active.
        if (selection.from === selection.to) {
            return startMarks.map((mark: PMMark): SelectionMark => this.toSelectionMark(mark, 'active'));
        }

        const rangeMarkStates: Map<string, RangeMarkState> = new Map<string, RangeMarkState>();
        startMarks.forEach((mark: PMMark): void => {
            rangeMarkStates.set(mark.type.name, {
                markedInlineNodeCount: 0,
                allAttributesMatch: true
            });
        });

        let inlineNodeCount: number = 0;

        // Inspect the selected inline content once to determine whether each start mark
        // is applied consistently across the complete selection.
        pmState.doc.nodesBetween(selection.from, selection.to, (node: PMNode): void => {
            // Ignore block nodes and inline atom nodes because they do not represent
            // editable inline text formatting.
            if (!node.isInline || (node.isLeaf && !node.isText)) {
                return;
            }

            inlineNodeCount++;
            // Count how many inline nodes contain each mark and verify their attributes.
            node.marks.forEach((mark: PMMark): void => {
                const state: RangeMarkState | undefined = rangeMarkStates.get(mark.type.name);
                const startMark: PMMark | undefined = startMarksByType.get(mark.type.name);
                if (state && startMark) {
                    state.markedInlineNodeCount++;
                    if (!this.attributesEqual(startMark.attrs, mark.attrs)) {
                        state.allAttributesMatch = false;
                    }
                }
            });
        });

        return startMarks.map((startMark: PMMark): SelectionMark => {
            const state: RangeMarkState = rangeMarkStates.get(startMark.type.name);
            // A mark is mixed when it is missing from part of the selection or when
            // the same mark has different attributes within the selection.
            const isMixed: boolean = inlineNodeCount === 0
                || state.markedInlineNodeCount < inlineNodeCount
                || !state.allAttributesMatch;
            return this.toSelectionMark(startMark, isMixed ? 'mixed' : 'active');
        });
    }

    /**
     * Resolves direct content and common structural ancestors for a text selection.
     *
     * @param {TextSelection} selection - The current text selection.
     * @param {PMNode} doc - The current ProseMirror document.
     * @returns {SelectionNode[]} Direct content and relevant common ancestors.
     */
    private resolveTextNodes(selection: TextSelection, doc: PMNode): SelectionNode[] {
        const start: PMResolvedPos = doc.resolve(selection.from);
        const end: PMResolvedPos = doc.resolve(selection.to);
        const nodes: SelectionNode[] = [];

        // For a cursor or selection within the same block, return the containing block
        // and its relevant structural ancestors.
        if (selection.from === selection.to || start.node(start.depth) === end.node(end.depth)) {
            nodes.push(this.toSelectionNode(start.parent));
            this.appendRelevantAncestors(nodes, start, start.depth - 1);
            return nodes;
        }

        // For a multi-block selection, find the deepest ancestor shared by both positions
        // so only the common structural context is returned.
        const commonDepth: number = start.sharedDepth(selection.to);
        this.appendRelevantAncestors(nodes, start, commonDepth);
        return nodes;
    }

    /**
     * Resolves the selected atom and its relevant structural ancestors.
     *
     * @param {NodeSelection} selection - The current node selection.
     * @param {PMNode} doc - The current ProseMirror document.
     * @returns {SelectionNode[]} The selected node followed by relevant ancestors.
     */
    private resolveNodeSelection(selection: NodeSelection, doc: PMNode): SelectionNode[] {
        // Get the actual node selected by the node selection position.
        const selectedNode: PMNode | null = doc.nodeAt(selection.from);
        if (!selectedNode) {
            return [];
        }

        // Include relevant structural ancestors so the context contains both the
        // selected node and its surrounding block structure.
        const nodes: SelectionNode[] = [this.toSelectionNode(selectedNode)];
        const resolved: PMResolvedPos = doc.resolve(selection.from);
        this.appendRelevantAncestors(nodes, resolved, resolved.depth);
        return nodes;
    }

    /**
     * Resolves the containing table for a cell selection.
     *
     * @param {PMResolvedPos} resolved - The resolved anchor position.
     * @returns {SelectionNode[]} The containing table, or an empty array.
     */
    private resolveCellNodes(resolved: PMResolvedPos): SelectionNode[] {
        const nodes: SelectionNode[] = [];
        // Walk upward from the selected cell to find its containing table.
        for (let depth: number = resolved.depth; depth > 0; depth--) {
            const node: PMNode = resolved.node(depth);
            if (node.type.name === 'table') {
                nodes.push(this.toSelectionNode(node));
                break;
            }
        }
        return nodes;
    }

    /**
     * Appends relevant block-group ancestors to an already resolved node list.
     *
     * @param {SelectionNode[]} nodes - The output node list.
     * @param {PMResolvedPos} resolved - The resolved selection position.
     * @param {number} fromDepth - The first ancestor depth to inspect.
     * @returns {void}
     */
    private appendRelevantAncestors(nodes: SelectionNode[], resolved: PMResolvedPos, fromDepth: number): void {
        // Walk from the current position toward the document root and collect only
        // ancestors that represent meaningful block-level editor context.
        for (let depth: number = fromDepth; depth > 0; depth--) {
            const node: PMNode = resolved.node(depth);
            if (this.isRelevantAncestor(node)) {
                nodes.push(this.toSelectionNode(node));
            }
        }
    }

    /**
     * Determines whether a node represents a meaningful structural context.
     *
     * @param {PMNode} node - The candidate ancestor node.
     * @returns {boolean} `true` when the node belongs to the block group.
     */
    private isRelevantAncestor(node: PMNode): boolean {
        // Skip internal wrapper nodes because they are implementation details and
        if (SKIPPED_CONTEXT_NODES.has(node.type.name)) {
            return false;
        }
        // Only expose nodes that belong to the block group as structural contexts.
        const group: string = (node.type.spec as { group?: string }).group ?? '';
        return group.split(' ').indexOf('block') !== -1;
    }

    /**
     * Converts a ProseMirror mark into the public mark context shape.
     *
     * @param {PMMark} mark - The ProseMirror mark.
     * @param {'active' | 'mixed'} state - The resolved toolbar state.
     * @returns {SelectionMark} A PM-free mark context.
     */
    private toSelectionMark(mark: PMMark, state: 'active' | 'mixed'): SelectionMark {
        return {
            type: mark.type.name,
            attrs: { ...mark.attrs },
            state
        };
    }

    /**
     * Converts a ProseMirror node into the public node context shape.
     *
     * @param {PMNode} node - The ProseMirror node.
     * @returns {SelectionNode} A PM-free node context.
     */
    private toSelectionNode(node: PMNode): SelectionNode {
        return {
            type: node.type.name,
            attrs: { ...node.attrs }
        };
    }

    /**
     * Compares mark attributes using shallow normalized attribute values.
     *
     * @param {Record<string, unknown>} first - The first attribute object.
     * @param {Record<string, unknown>} second - The second attribute object.
     * @returns {boolean} `true` when both attribute objects are equivalent.
     */
    private attributesEqual(first: Record<string, unknown>, second: Record<string, unknown>): boolean {
        const firstKeys: string[] = Object.keys(first);
        const secondKeys: string[] = Object.keys(second);
        if (firstKeys.length !== secondKeys.length) {
            return false;
        }
        return firstKeys.every((key: string): boolean => first[`${key}`] === second[`${key}`]);
    }

    /**
     * Creates the standard empty result for unsupported or invalid selections.
     *
     * @returns {SelectionContext} An empty selection context.
     */
    private emptyContext(): SelectionContext {
        return { marks: [], nodes: [] };
    }
}
