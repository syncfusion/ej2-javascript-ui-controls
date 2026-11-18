import { PMPlugin, PMPluginKey, PMEditorState, PMTransaction, PMNode, PMDecoration, PMDecorationSet, PMResolvedPos } from '../../../pm/pm-guard';

export interface PlaceholderContext {
    nodeType: string;
}

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
            // Resolve the actual node type from the current node and its ancestors.
            // Precedence: nearest supported container ancestor wins over the
            // current textblock type. For heading nodes outside a supported
            // container, expand `heading` to `heading1..heading6` based on the
            // level attribute.
            let resolvedNodeType: string = node.type.name;
            const $pos: PMResolvedPos = state.doc.resolve(pos);
            // Resolve the nearest relevant ancestor.
            for (let d: number = $pos.depth; d > 0; d--) {
                const ancestor: PMNode = $pos.node(d);
                const ancestorName: string = ancestor.type.name;
                const ancestorSpec: { enablePlaceholderContainer?: unknown } =
                    (ancestor.type.spec as { enablePlaceholderContainer?: unknown }) || {};
                // Special case: listItem maps to its parent's list type
                // (bulletList or orderedList) so the consumer can distinguish
                // bullet vs. ordered lists. This must run before the generic
                // container predicate because listItem is a block that would
                // otherwise match on its own.
                if (ancestorName === 'listItem') {
                    const parent: PMNode = d > 0 ? $pos.node(d - 1) : null;
                    const parentName: string | undefined = parent?.type.name;
                    if (parentName === 'bulletList' || parentName === 'orderedList') {
                        resolvedNodeType = parentName;
                    } else {
                        resolvedNodeType = ancestorName;
                    }
                    break;
                }
                // Explicit opt-out: a node whose NodeSpec sets
                // `enablePlaceholderContainer: false` is never selected as a
                // placeholder container. Ancestor traversal continues past
                // it so the nearest eligible outer ancestor can still match.
                if (ancestorSpec.enablePlaceholderContainer === false) {
                    continue;
                }
                // Explicit opt-in: a node whose NodeSpec sets
                // `enablePlaceholderContainer: true` is selected regardless of
                // whether it would qualify under the generic predicate
                // below (e.g. a textblock that should still influence
                // child placeholder resolution).
                if (ancestorSpec.enablePlaceholderContainer === true) {
                    resolvedNodeType = ancestorName;
                    break;
                }
                // Default predicate: a block node that is not a textblock
                // and is not the document root is a placeholder container.
                // This covers all built-in containers (blockquote, callout,
                // collapsibleHeader, collapsibleBody, tableCell,
                // tableHeader, taskItem) as well as any custom extension
                // that follows the same pattern (block group, block+
                // content). Structural nodes such as `table` and
                // `tableRow` are never direct ancestors of textblocks in
                // the schema, so they are never reached by this walk. The
                // `document` root is excluded by name. Nodes that are
                // textblocks (paragraph, heading, codeBlock) are excluded
                // by the !isTextblock check.
                if (
                    ancestor.type.isBlock &&
                    !ancestor.isTextblock &&
                    ancestorName !== 'document'
                ) {
                    resolvedNodeType = ancestorName;
                    break;
                }
            }
            if (resolvedNodeType === 'heading') {
                const levelAttr: unknown = node.attrs['level'];
                const level: number = typeof levelAttr === 'number' ? levelAttr : parseInt(String(levelAttr), 10);
                if (Number.isInteger(level) && level >= 1 && level <= 6) {
                    resolvedNodeType = `heading${level}`;
                }
            }
            const placeholderText: string = typeof options.placeholder === 'function' ? options.placeholder({ nodeType: resolvedNodeType }) : options.placeholder;
            if (!placeholderText) {
                return;
            }
            const emptyNodeClass: string =
                typeof options.emptyNodeClass === 'function'
                    ? options.emptyNodeClass({
                        nodeType: resolvedNodeType
                    })
                    : options.emptyNodeClass;
            const editorIsEmpty: boolean = isEditorEmpty(state);
            const classes: string[] = [emptyNodeClass];
            if (editorIsEmpty) {
                classes.push(options.emptyEditorClass);
            }
            // For nodes whose NodeView wraps a non-editable header or whose
            // contentDOM is a descendant of the outer wrapper (codeBlock,
            // image), a node-level decoration on the outer wrapper would place
            // the placeholder above the header or over the image. Instead,
            // insert a widget decoration at the start of the content area
            // (pos + 1) so the placeholder appears inside the editable region.
            if (node.type.name === 'codeBlock' || node.type.name === 'image') {
                const widget: HTMLElement = document.createElement('span');
                widget.className = 'e-placeholder-widget ' + classes.join(' ');
                widget.setAttribute(options.dataAttribute, placeholderText);
                widget.setAttribute('contenteditable', 'false');
                decorations.push(
                    PMDecoration.widget(pos + 1, widget, {
                        side: -1,
                        key: `placeholder-${resolvedNodeType}-${pos}`
                    })
                );
            } else {
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
