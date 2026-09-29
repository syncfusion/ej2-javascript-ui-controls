/**
 * NodeView infrastructure
 *
 * bridges PM-free constructors → real PM NodeView factories
 */
import { PMNode, PMEditorView, PMNodeView } from '../pm-guard';
import { NodeViewConstructor, NodeViewDescriptor } from '../../extensions/types';

/** PM NodeViewConstructor signature*/
type PMNodeViewFactory = (
    node: PMNode,
    view: PMEditorView,
    getPos: () => number | undefined,
    decorations: readonly unknown[],
    innerDecorations: unknown
) => PMNodeView;

/**
 * Adapts a map of PM-free NodeViewConstructors (from extensions) into
 * the `nodeViews` map expected by ProseMirror's DirectEditorProps.
 *
 * Extensions receive:
 *   - `node.attrs` (plain Record) instead of a PMNode
 *   - `view` typed as `unknown` so they cannot import PMEditorView
 *   - `getPos` unchanged
 *
 * @param {Record<string, NodeViewConstructor>} constructors - Record of node name → PM-free NodeViewConstructor
 * @returns {Record<string, PMNodeViewFactory>} Record suitable for passing to `new PMEditorView(el, { nodeViews })`
 */
export function adaptNodeViews(
    constructors: Record<string, NodeViewConstructor>
): Record<string, PMNodeViewFactory> {
    const adapted: Record<string, PMNodeViewFactory> = {};
    const names: string[] = Object.keys(constructors);
    for (let i: number = 0; i < names.length; i++) {
        const name: string = names[parseInt((i).toString(), 10)];
        const ctor: NodeViewConstructor = constructors[`${name}`];
        const factory: PMNodeViewFactory = (
            pmNode: PMNode,
            pmView: PMEditorView,
            getPos: () => number | undefined,
            _decorations: readonly unknown[],
            _innerDecorations: unknown
        ): PMNodeView => {
            void _decorations;
            void _innerDecorations;
            // Pass attrs (plain bag) and view as unknown — keeps extensions PM-free
            const result: NodeViewDescriptor = ctor(
                pmNode.attrs as Record<string, unknown>,
                pmView as unknown,
                getPos,
                pmNode.content.size > 0
            );

            // Bridge the PM-free update(attrs) back to PM's update(node, decorations, innerDecorations)
            const pmNodeView: PMNodeView = {
                dom: result.dom,
                contentDOM: result.contentDOM
            };
            if (result.update) {
                const extensionUpdate: NodeViewDescriptor['update'] = result.update;
                pmNodeView.update = (updatedNode: PMNode): boolean => {
                    return extensionUpdate(
                        updatedNode.attrs as Record<string, unknown>,
                        updatedNode.content.size > 0
                    );
                };
            }
            if (result.ignoreMutation) {
                const extensionIgnoreMutation: NodeViewDescriptor['ignoreMutation'] = result.ignoreMutation;
                // Bridge PM-free ignoreMutation(unknown) to PM's NodeView.ignoreMutation(MutationRecord)
                // by passing the raw record through. PM expects a boolean return:
                //   true  → ignore this mutation entirely (it is UI noise, no remount)
                //   false → process normally
                pmNodeView.ignoreMutation = (mutation: unknown): boolean => {
                    return extensionIgnoreMutation(mutation);
                };
            }
            if (result.destroy) {
                const destroy: () => void = result.destroy;
                pmNodeView.destroy = (): void => {
                    destroy();
                };
            }
            if (result.selectNode) {
                pmNodeView.selectNode = result.selectNode;
            }
            if (result.deselectNode) {
                pmNodeView.deselectNode = result.deselectNode;
            }
            return pmNodeView;
        };
        adapted[`${name}`] = factory;
    }
    return adapted;
}
