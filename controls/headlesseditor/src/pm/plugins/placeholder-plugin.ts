import { PMPlugin, PMPluginKey, PMEditorState, PMTransaction, PMNode, PMDecoration, PMDecorationSet } from '../pm-guard';
import { PlaceholderContext } from '../../extensions/types';
export interface PlaceholderPluginOptions {
    placeholder: string | ((context: PlaceholderContext) => string);
    emptyNodeClass: string | ((context: PlaceholderContext) => string);
    emptyEditorClass: string;
    dataAttribute: string;
    showOnlyCurrent: boolean;
    showOnlyWhenEditable: boolean;
    includeChildren?: boolean;
    readOnly?: boolean;
    showOnlyWhenEditorEmpty?: boolean;
}
const PLACEHOLDER_PLUGIN_KEY: PMPluginKey = new PMPluginKey('placeholder');
function isEditorEmpty(state: PMEditorState): boolean {
    return (
        state.doc.childCount === 1 &&
        state.doc.firstChild?.type.name === 'paragraph' &&
        state.doc.firstChild.content.size === 0
    );
}
function isNestedNode(state: PMEditorState, pos: number): boolean {
    return state.doc.resolve(pos).depth > 1;
}
function buildDecorations(state: PMEditorState, options: PlaceholderPluginOptions): PMDecorationSet {
    if (options.showOnlyWhenEditable && options.readOnly) {
        return PMDecorationSet.create(state.doc, []);
    }
    const editorIsEmpty: boolean = isEditorEmpty(state);
    if (options.showOnlyWhenEditorEmpty && !editorIsEmpty) {
        return PMDecorationSet.create(state.doc, []);
    }
    const decorations: PMDecoration[] = [];
    const anchor: number = state.selection.from;
    state.doc.descendants(
        (node: PMNode, pos: number): void => {
            // Placeholder only applies to text blocks.
            if (!node.isTextblock) {
                return;
            }
            // Only first node gets placeholder
            if (options.showOnlyWhenEditorEmpty && pos !== 0) {
                return;
            }
            if (!options.includeChildren && isNestedNode(state, pos)) {
                return;
            }
            // Skip non-empty nodes.
            if (node.textContent.length > 0) {
                return;
            }
            // Only show placeholder on the current node.
            if (options.showOnlyCurrent) {
                const nodeStart: number = pos;
                const nodeEnd: number = pos + node.nodeSize - 1;
                const isCurrentNode: boolean = anchor >= nodeStart && anchor <= nodeEnd;
                if (!isCurrentNode) {
                    return;
                }
            }
            const placeholderText: string = typeof options.placeholder === 'function' ? options.placeholder({ nodeType: node.type.name }) : options.placeholder;
            if (!placeholderText) {
                return;
            }
            const emptyNodeClass: string =
                typeof options.emptyNodeClass === 'function'
                    ? options.emptyNodeClass({
                        nodeType: node.type.name
                    })
                    : options.emptyNodeClass;
            const editorIsEmpty: boolean = isEditorEmpty(state);
            const classes: string[] = [emptyNodeClass];
            if (editorIsEmpty) {
                classes.push(options.emptyEditorClass);
            }
            decorations.push(
                PMDecoration.node(
                    pos,
                    pos + node.nodeSize,
                    {
                        class: classes.join(' '),
                        [options.dataAttribute]: placeholderText
                    }
                )
            );

        }
    );
    return PMDecorationSet.create(state.doc, decorations);
}
export function createPlaceholderPlugin(options: PlaceholderPluginOptions): PMPlugin {
    return new PMPlugin({
        key: PLACEHOLDER_PLUGIN_KEY,
        state: {
            init(
                _: unknown,
                state: PMEditorState
            ): PMDecorationSet {
                return buildDecorations(state, options);
            },
            apply(
                tr: PMTransaction,
                current: PMDecorationSet,
                _oldState: PMEditorState,
                newState: PMEditorState
            ): PMDecorationSet {
                // MVP:
                // Only rebuild when document content changes.
                const shouldRebuild: boolean = tr.docChanged || (options.showOnlyCurrent && tr.selectionSet);
                if (!shouldRebuild) {
                    return current;
                }
                return buildDecorations(newState, options);
            }
        },
        props: {
            decorations(state: PMEditorState): PMDecorationSet {
                return (PLACEHOLDER_PLUGIN_KEY.getState(state) as PMDecorationSet);
            }
        }
    });
}
