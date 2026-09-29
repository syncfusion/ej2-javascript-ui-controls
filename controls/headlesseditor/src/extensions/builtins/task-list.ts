/**
 * Task List Extension
 *
 * Provides built-in support for task lists with checkable items.
 * Contributes two node types:
 * - `taskList` — dedicated task list container rendered as `<ul data-type="taskList">`
 * - `taskItem` — task list item rendered as `<li>` with a `<label>/<input>` checkbox
 */

import { defineExtension } from '../define-extension';
import type { NodeDefinition } from '../../schema/types/node-definition';
import type { AttributeDefinition } from '../../schema/types/attribute-definition';
import { NodeContent } from '../../schema/types/content-expression';
import type { Command } from '../../commands/types';
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
 * Fallback toDOM for taskItem — \ for schema
 * registration and HTML serialization\.
 * The NodeView overrides actual DOM rendering at runtime.
 *
 * @param {Record<string, unknown>} attrs - Node attribute bag.
 * @returns {DOMOutputDescriptor} DOM output spec for the task item.
 */
function taskItemToDOM(attrs: Record<string, unknown>): DOMOutputDescriptor {
    const isChecked: boolean = attrs['checked'] === true;
    const labelSpec: DOMOutputDescriptor = [
        'label',
        { contenteditable: 'false' },
        ['input', { type: 'checkbox', ...(isChecked ? { checked: 'checked' } : {}) }],
        ['span']
    ];
    const liAttrs: Record<string, string> = {
        'data-type': 'taskItem',
        'data-checked': String(isChecked)
    };
    // Serialize inline style rules safely for the backend parser storage
    const align: string = attrs['align'] as string;
    if (isTextAlign(align)) {
        liAttrs['style'] = `text-align: ${align}`;
    }
    return ['li', liAttrs, labelSpec, ['div', 0]];
}
import { toggleTaskListCommand } from '../../commands/builtins/list/toggle-task-list';
import { toggleTaskCheckedCommand } from '../../commands/builtins/list/toggle-task-checked';
import { createWrappingRule } from '../inputrules/wrap-input-rule';
import { HeadlessEditor } from '../../headless-editor/index';
import { isTextAlign, textAlignAttribute } from './common/text-align-attributes';
import { parseBlockFormat, BlockFormatDefault } from './common/block-format-attributes';

/**
 * Schema defaults for the block-format attributes carried by `taskItem`.
 * `taskItem` only carries `align` (no `indent`), so the defaults list
 * contains a single entry.
 */
const taskItemParseDefaults: readonly BlockFormatDefault[] = [
    { name: 'align', value: textAlignAttribute.default }
];

/**
 * Options accepted by the Task List extension.
 */
export interface TaskListExtensionOptions extends ExtensionOptions {
    /** HTML attributes applied to the `<ul data-type="taskList">` container element. */
    readonly htmlAttributes?: Readonly<Record<string, string>>;
    /** HTML attributes applied to task item `<li>` elements. */
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
 * Task List built-in extension.
 *
 * Contributes:
 * - `taskList` node — dedicated task list container (`<ul data-type="taskList">`)
 * - `taskItem` node — task list item (`<li>`) with `<label>/<input>` checkbox structure,
 *   carrying a `checked` boolean attribute
 * - `toggleTaskList`    command — wraps selection in a taskList
 * - `toggleTaskChecked` command — toggles the checked state of the current taskItem
 * - Extension keymaps for task list shortcuts
 */
export const taskListExtension: ExtensionDefinition<TaskListExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'task-list',

    /**
     * Tier 3 — recursive containers. `taskList` holds `taskItem+`; `taskItem`
     * has `paragraph block*` content. Both must be registered after Tier 1
     * primary fillers to avoid `fillBefore` recursion.
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
     * - When `nested: true` (default): content is `paragraph block*` — a required
     *   leading paragraph followed by optional block content (enables nested lists)
     * - When `nested: false`: content is `paragraph+` — only paragraphs allowed
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
            content: isNested
                ? NodeContent.sequence(NodeContent.node('paragraph'), NodeContent.block().zeroOrMore())
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

        return {
            nodes: {
                taskList: {
                    toDOM: (): DOMOutputDescriptor =>
                        ['ul', { ...listAttrs, 'data-type': 'taskList' }, 0],
                    parseDOM: [
                        { tag: 'ul[data-type="taskList"]' }
                    ]
                },
                // taskItem toDOM is required by PMSchemaAdapter for schema registration
                // and HTML serialization. The NodeView (nodeViews()) overrides actual
                // rendering at runtime inside the editor view.
                taskItem: {
                    toDOM: (attrs: Record<string, unknown>): DOMOutputDescriptor =>
                        taskItemToDOM(attrs),
                    parseDOM: [
                        {
                            tag: 'li[data-type="taskItem"]',
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

        return {
            taskItem: (attrs: Record<string, unknown>, _view: unknown, getPos: () => number | undefined): NodeViewDescriptor => {
                const isChecked: boolean = attrs['checked'] === true;

                // Outer <li>
                const li: HTMLElement = document.createElement('li');
                li.setAttribute('data-type', 'taskItem');
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
