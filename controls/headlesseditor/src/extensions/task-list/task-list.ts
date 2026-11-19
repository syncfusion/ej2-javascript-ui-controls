/**
 * Task List Extension
 *
 * Provides built-in support for task lists with checkable items.
 * Contributes two node types:
 * - `taskList` — dedicated task list container rendered as `<ul data-type="taskList">`
 * - `taskItem` — task list item rendered as `<li>` with a `<label>/<input>` checkbox
 */

import { defineExtension } from '../define-extension';
import type { NodeDefinition } from '../../core/schema/types/node-definition';
import type { AttributeDefinition } from '../../core/schema/types/attribute-definition';
import { NodeContent } from '../../core/schema/types/content-expression';
import type { Command } from '../../core/commands/types';
import {
    DOMOutputDescriptor,
    ExtensionDefinition,
    ExtensionDOMSpecs,
    ExtensionOptions,
    ExtensionScope,
    NodeViewConstructor,
    NodeViewDescriptor,
    InputRuleDefinition
} from '../types';

// ── Constants ─────────────────────────────────────────────────────────────────

/**
 * Default `data-type` attribute value for the `taskList` container element.
 * Applied when `htmlAttributes` does not provide an explicit `data-type`.
 */
export const DEFAULT_TASK_LIST_DATA_TYPE: string = 'taskList';

/**
 * Default `data-type` attribute value for `taskItem` elements.
 * Applied when `itemHtmlAttributes` does not provide an explicit `data-type`.
 */
export const DEFAULT_TASK_ITEM_DATA_TYPE: string = 'taskItem';

/**
 * Resolve the effective `data-type` attribute value for a task list element
 * from the extension's configured HTML attributes, falling back to the
 * default when not explicitly configured.
 *
 * @param {Readonly<Record<string, string>>} htmlAttributes - Configured container HTML attributes.
 * @param {string} fallback - Default value used when `data-type` is absent.
 * @returns {string} The effective `data-type` value.
 */
function resolveTaskListDataType(
    htmlAttributes: Readonly<Record<string, string>> | undefined,
    fallback: string
): string {
    const configured: string | undefined = htmlAttributes?.['data-type'];
    return typeof configured === 'string' && configured.length > 0 ? configured : fallback;
}

/**
 * Fallback toDOM for taskItem — \ for schema
 * registration and HTML serialization\.
 * The NodeView overrides actual DOM rendering at runtime.
 *
 * @param {Record<string, unknown>} attrs - Node attribute bag.
 * @param {string} dataType - Effective `data-type` attribute value, resolved
 * from `itemHtmlAttributes` with a `taskItem` default.
 * @returns {DOMOutputDescriptor} DOM output spec for the task item.
 */
function taskItemToDOM(attrs: Record<string, unknown>, dataType: string): DOMOutputDescriptor {
    const isChecked: boolean = attrs['checked'] === true;
    const labelSpec: DOMOutputDescriptor = [
        'label',
        { contenteditable: 'false' },
        ['input', { type: 'checkbox', ...(isChecked ? { checked: 'checked' } : {}) }],
        ['span']
    ];
    const liAttrs: Record<string, string> = {
        'data-type': dataType,
        'data-checked': String(isChecked)
    };
    // Serialize inline style rules safely for the backend parser storage
    const align: string = attrs['align'] as string;
    if (isTextAlign(align)) {
        liAttrs['style'] = `text-align: ${align}`;
    }
    return ['li', liAttrs, labelSpec, ['div', 0]];
}
import { toggleTaskListCommand } from '../task-list/commands/toggle-task-list';
import { toggleTaskCheckedCommand } from '../task-list/commands/toggle-task-checked';
import { createWrappingRule } from '../inputrules/wrap-input-rule';
import { HeadlessEditor } from '../../headless-editor/index';
import { isTextAlign, textAlignAttribute } from '../common/text-align-attributes';
import { parseBlockFormat, BlockFormatDefault } from '../common/block-format-attributes';

/**
 * Schema defaults for the block-format attributes carried by `taskItem`.
 * `taskItem` only carries `align` (no `indent`), so the defaults list
 * contains a single entry.
 */
const taskItemParseDefaults: readonly BlockFormatDefault[] = [
    { name: 'align', value: textAlignAttribute.default }
];

/**
 * Options for the task list extension.
 *
 * Defines the HTML attributes applied to task list container and item elements,
 * along with the nested content policy for task items.
 *
 * @interface TaskListExtensionOptions
 */
export interface TaskListExtensionOptions extends ExtensionOptions {
    /**
     * HTML attributes applied to the `<ul data-type="taskList">` container element.
     *
     * @default {}
     * @type {Readonly<Record<string, string>>}
     */
    readonly htmlAttributes?: Readonly<Record<string, string>>;
    /**
     * HTML attributes applied to task item `<li>` elements.
     *
     * @default {}
     * @type {Readonly<Record<string, string>>}
     */
    readonly itemHtmlAttributes?: Readonly<Record<string, string>>;
    /**
     * When true, task items allow nested block content (lists, blockquotes, etc.)
     * after the leading paragraph. When false, content is restricted to `paragraph+`.
     *
     * @default true
     */
    readonly nested?: boolean;
}

/**
 * Task list extension for the Syncfusion Headless Editor.
 *
 * Provides built-in support for task lists with checkable items. Contributes two
 * node types: the `taskList` container rendered as `<ul data-type="taskList">` and
 * the `taskItem` element rendered as `<li>` with a `<label>/<input>` checkbox
 * carrying a `checked` boolean attribute.
 *
 * **Contributes:**
 * - `taskList` node — dedicated task list container (`<ul data-type="taskList">`)
 * - `taskItem` node — task list item (`<li>`) with `<label>/<input>` checkbox structure,
 *   carrying a `checked` boolean attribute
 * - `toggleTaskList` command — wraps selection in a taskList
 * - `toggleTaskChecked` command — toggles the checked state of the current taskItem
 * - Extension keymaps for task list shortcuts
 * - Input rules for Markdown-style `[ ]` and `[x]` checkbox syntax
 *
 * **DOM structure:**
 * ```html
 * <ul data-type="taskList">
 *   <li data-item-type="taskItem">
 *     <label><input type="checkbox" checked />Task text</label>
 *   </li>
 * </ul>
 * ```
 *
 * @type {ExtensionDefinition<TaskListExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with task list extension
 * const editor = HeadlessEditor.create({
 *   extensions: [basicExtensions, taskListExtension]
 * });
 *
 * // Toggle task list on current selection
 * editor.commands.toggleTaskList();
 *
 * // Toggle checked state of cursor task item
 * editor.commands.toggleTaskChecked();
 *
 * // Type "[ ] task" or "[x] done task" for auto-conversion
 * ```
 *
 * @see TaskListExtensionOptions for configuration options
 * @see toggleTaskListCommand for direct command usage
 */
export const taskListExtension: ExtensionDefinition<TaskListExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'task-list',

    /**
     * Tier 3 — recursive containers. `taskList` holds `taskItem+`; `taskItem`
     * has `(paragraph | heading) block*` content. Both must be registered after
     * Tier 1 primary fillers to avoid `fillBefore` recursion.
     */
    priority: 10,

    /**
     * Defines configurable options for the Task List extension.
     *
     * @returns {TaskListExtensionOptions} Default option values.
     */
    defineOptions(): TaskListExtensionOptions {
        return {
            htmlAttributes: {},
            itemHtmlAttributes: {},
            nested: true
        };
    },

    /**
     * Registers `taskList` and `taskItem` node types.
     *
     * `taskList`:
     * - A dedicated block container rendered as `<ul data-type="taskList">`
     * - Distinct from `bulletList` — no ambiguity in the document model
     * - Contains one or more `taskItem` nodes
     *
     * `taskItem`:
     * - Lives inside a `taskList` container
     * - When `nested: true` (default): content is `(paragraph | heading) block*` — a
     *   required leading paragraph or heading followed by optional block content
     *   (enables nested lists)
     * - When `nested: false`: content is `paragraph+` — only paragraphs allowed
     *   This mode intentionally provides a simple checklist structure with
     *   predictable rendering and no nested block content.
     * - Carries a boolean `checked` attribute (default: false)
     * @param {ExtensionScope<TaskListExtensionOptions>} this - Extension scope containing configuration options.
     * @returns {NodeDefinition[]} Array of task list node definitions.
     */
    nodes(this: ExtensionScope<TaskListExtensionOptions>): NodeDefinition[] {
        const isNested: boolean = this.options?.nested !== false;

        // taskList — dedicated container, unambiguous in the document model
        const taskListNode: NodeDefinition = {
            name: 'taskList',
            group: 'block list',
            content: NodeContent.node('taskItem').oneOrMore()
        };

        // taskItem — paragraph first, then optional blocks (when nested is enabled)
        const taskItemAttrs: AttributeDefinition[] = [
            {
                name: 'checked',
                type: 'boolean',
                default: false
            } as AttributeDefinition,
            textAlignAttribute
        ];

        const taskItemNode: NodeDefinition = {
            name: 'taskItem',
            group: 'list',
            // Non-nested mode intentionally supports only paragraphs to provide
            // a simple checklist structure with predictable rendering.
            content: isNested
                ? NodeContent.sequence(NodeContent.choice(
                    NodeContent.node('paragraph'),
                    NodeContent.node('heading')),
                                       NodeContent.block().zeroOrMore()
                )
                : NodeContent.node('paragraph').oneOrMore(),
            attrs: taskItemAttrs
        };

        return [taskListNode, taskItemNode];
    },

    /**
     * Contributes task-specific commands.
     *
     * - `toggleTaskList`    — wrap the selection in a task list (taskList with taskItem children)
     * - `toggleTaskChecked` — toggle the `checked` attribute of the current taskItem
     *
     * @returns {Command[]} Array of task list commands.
     */
    commands(): Command[] {
        return [
            toggleTaskListCommand,
            toggleTaskCheckedCommand
        ] as Command[];
    },

    /**
     * Renders task list nodes as HTML elements.
     *
     *
     * @param {ExtensionScope<TaskListExtensionOptions>} this Extension scope.
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
     */
    domSpecs(this: ExtensionScope<TaskListExtensionOptions>): ExtensionDOMSpecs {
        const listAttrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        const itemAttrs: Readonly<Record<string, string>> = this.options?.itemHtmlAttributes ?? {};
        const listDataType: string = resolveTaskListDataType(listAttrs, DEFAULT_TASK_LIST_DATA_TYPE);
        const itemDataType: string = resolveTaskListDataType(itemAttrs, DEFAULT_TASK_ITEM_DATA_TYPE);

        return {
            nodes: {
                taskList: {
                    toDOM: (): DOMOutputDescriptor =>
                        ['ul', { ...listAttrs, 'data-type': listDataType }, 0],
                    parseDOM: [
                        { tag: `ul[data-type="${listDataType}"]`, priority: 60 }
                    ]
                },
                // taskItem toDOM is required by PMSchemaAdapter for schema registration
                // and HTML serialization. The NodeView (nodeViews()) overrides actual
                // rendering at runtime inside the editor view.
                taskItem: {
                    toDOM: (attrs: Record<string, unknown>): DOMOutputDescriptor =>
                        taskItemToDOM(attrs, itemDataType),
                    parseDOM: [
                        {
                            tag: `li[data-type="${itemDataType}"]`,
                            priority: 60,
                            getAttrs: (dom: unknown) => ({
                                checked: (dom as HTMLElement).getAttribute('data-checked') === 'true',
                                ...parseBlockFormat(dom, taskItemParseDefaults)
                            })
                        }
                    ]
                }
            }
        };
    },

    inputRules(): readonly InputRuleDefinition[] {
        return [
            createWrappingRule({
                id: 'list:task-checked',
                pattern: /^-\[x\] $/,
                target: 'taskList',
                attributeProvider: () => ({
                    checked: true
                })
            }),

            createWrappingRule({
                id: 'list:task-unchecked',
                pattern: /^-\[ \] $/,
                target: 'taskList'
            })
        ];
    },

    /**
     * Registers keyboard shortcuts for task list operations.
     *
     * List-related keyboard shortcuts (`Tab`, `Shift-Tab`, `Backspace`,
     * `Enter`, `Delete`) are owned by the dedicated `listKeymapExtension`
     * Register `listKeymapExtension` in your `extensions` array (after
     * `taskListExtension`).
     *
     * @returns {Object} Keymap entries mapping shortcuts to command names.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-Shift-7': () => this.editor.commands.toggleTaskList(),
            'Mod-Enter': () => this.editor.commands.toggleTaskChecked()
        };
    },

    /**
     * Provides a NodeView for `taskItem` so checkbox interaction works
     * automatically without consumer wiring.
     *
     * @param {ExtensionScope<TaskListExtensionOptions>} this - Extension scope.
     * @returns {Record<string, NodeViewConstructor>} NodeView constructors keyed by node name.
     */
    nodeViews(this: ExtensionScope<TaskListExtensionOptions>): Record<string, NodeViewConstructor> {
        const editor: HeadlessEditor = this.editor;
        const itemAttrs: Readonly<Record<string, string>> = this.options?.itemHtmlAttributes ?? {};
        const itemDataType: string = resolveTaskListDataType(itemAttrs, DEFAULT_TASK_ITEM_DATA_TYPE);

        return {
            taskItem: (attrs: Record<string, unknown>, _view: unknown, getPos: () => number | undefined): NodeViewDescriptor => {
                const isChecked: boolean = attrs['checked'] === true;

                // Outer <li>
                const li: HTMLElement = document.createElement('li');
                li.setAttribute('data-type', itemDataType);
                li.setAttribute('data-checked', String(isChecked));
                const attrKeys: string[] = Object.keys(itemAttrs);
                for (let i: number = 0; i < attrKeys.length; i++) {
                    li.setAttribute(attrKeys[parseInt((i).toString(), 10)], itemAttrs[attrKeys[parseInt((i).toString(), 10)]]);
                }

                // <label contenteditable="false"> — non-editable checkbox area
                const label: HTMLElement = document.createElement('label');
                label.setAttribute('contenteditable', 'false');

                const input: HTMLInputElement = document.createElement('input');
                input.type = 'checkbox';
                input.checked = isChecked;

                const span: HTMLElement = document.createElement('span');

                label.appendChild(input);
                label.appendChild(span);

                // contentDOM — editor-editable content hole
                const contentDiv: HTMLElement = document.createElement('div');

                li.appendChild(label);
                li.appendChild(contentDiv);

                // Wire checkbox change → toggleTaskChecked with explicit pos so
                // the command finds the node even when the cursor is elsewhere
                // (clicking contenteditable="false" does not move the PM cursor).
                const onChange: () => void = (): void => {
                    const pos: number | undefined = getPos();
                    editor.commands.toggleTaskChecked(typeof pos === 'number' ? { pos } : undefined);
                };
                input.addEventListener('change', onChange);

                return {
                    dom: li,
                    contentDOM: contentDiv,
                    update: (updatedAttrs: Record<string, unknown>): boolean => {
                        const checked: boolean = updatedAttrs['checked'] === true;
                        input.checked = checked;
                        li.setAttribute('data-checked', String(checked));
                        return true;
                    },
                    destroy: (): void => {
                        input.removeEventListener('change', onChange);
                    }
                };
            }
        };
    }
});

export default taskListExtension;
