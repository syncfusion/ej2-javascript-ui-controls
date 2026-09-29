/**
 * Collapsible Extension
 * Provides collapsible content nodes for expandable sections.
 * Contributes 'collapsibleParagraph' and 'collapsibleHeading' nodes
 * with isExpanded attribute and 'toggleCollapsible' command.
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
    NodeViewDescriptor
} from '../types';

import { toggleCollapsibleCommand } from '../../commands/builtins/structure/toggle-collapsible';
import { collapseCommand } from '../../commands/builtins/structure/collapse';
import { expandCommand } from '../../commands/builtins/structure/expand';
import { HeadlessEditor } from '../../headless-editor/index';
import { getSvgIcon } from '../../utils/common';


/**
 * Options accepted by the Collapsible extension.
 */
export interface CollapsibleExtensionOptions extends ExtensionOptions {
    /**
     * HTML attributes applied to the outer collapsible `<div>` container.
     * Merged with the required `data-type` and `data-collapsed` attributes.
     */
    readonly htmlAttributes?: Readonly<Record<string, string>>;
}


/**
 * Collapsible built-in extension.
 *
 * Supports both heading-triggered and paragraph-triggered collapsible sections.
 * The first child of the collapsible node is always the visible trigger; all
 * subsequent block children form the collapsible body.
 *
 * The `collapsed` boolean attribute on the node drives the `data-collapsed`
 * attribute on the rendered DOM element. UI layers should toggle body
 * visibility by reading this attribute.
 */
export const collapsibleExtension: ExtensionDefinition<CollapsibleExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'collapsible',

    /**
     * Tier 3 — `collapsibleHeading` has `block+` content, making it a recursive
     * container. Must be registered after Tier 1 primary fillers.
     */
    priority: 10,

    /**
     * Defines configurable options for the Collapsible extension.
     *
     * @returns {CollapsibleExtensionOptions} Default option values.
     */
    defineOptions(): CollapsibleExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers three node types: `collapsible`, `collapsibleHeader`, and
     * `collapsibleBody`.
     *
     * Document structure:
     *
     *   collapsible
     *   ├── collapsibleHeader   ← exactly one heading or paragraph
     *   └── collapsibleBody     ← block*
     *
     * The `collapsed` attribute on `collapsible` controls the visibility state
     * of the body and is preserved across serialization. It is typed as
     * `boolean` with a default of `false` (expanded).
     *
     * @returns {NodeDefinition[]} Array containing all three node definitions.
     */
    nodes(): NodeDefinition[] {
        const collapsibleAttrs: AttributeDefinition[] = [
            {
                name: 'collapsed',
                type: 'boolean',
                default: false
            } as AttributeDefinition
        ];

        // Outer wrapper — owns the collapsed state
        const collapsibleNode: NodeDefinition = {
            name: 'collapsible',
            group: 'block',
            content: NodeContent.sequence(
                NodeContent.node('collapsibleHeader'),
                NodeContent.node('collapsibleBody')
            ),
            attrs: collapsibleAttrs
        };

        // Header slot — accepts exactly one heading or paragraph.
        // choice() without a quantifier already means "exactly one of these
        // alternatives" — quantifiers cannot be applied to combinators.
        const collapsibleHeaderNode: NodeDefinition = {
            name: 'collapsibleHeader',
            group: 'block',
            content: NodeContent.choice(
                NodeContent.node('heading'),
                NodeContent.node('paragraph')
            )
        };

        // Body slot — holds all collapsible content blocks
        const collapsibleBodyNode: NodeDefinition = {
            name: 'collapsibleBody',
            group: 'block',
            content: NodeContent.block().zeroOrMore()
        };

        return [collapsibleNode, collapsibleHeaderNode, collapsibleBodyNode];
    },

    /**
     * Registers the collapsible commands:
     *
     * - `toggleCollapsible` — wrap the current block in a collapsible, or
     *   unwrap/dissolve the collapsible if already inside one.
     * - `collapse` — set `collapsed = true` on the nearest collapsible ancestor.
     * - `expand`   — set `collapsed = false` on the nearest collapsible ancestor.
     *
     * @returns {Command[]} Array of collapsible commands.
     */
    commands(): Command[] {
        return [
            toggleCollapsibleCommand,
            collapseCommand,
            expandCommand
        ] as Command[];
    },

    /**
     * Fallback DOM specs for `collapsible`, `collapsibleHeader`, and
     * `collapsibleBody` — for schema registration
     * and HTML serialization. NodeViews override rendering at runtime.
     *
     * Serialization shape:
     *   collapsible      → <div data-type="collapsible" data-collapsed="...">
     *   collapsibleHeader → <div data-role="collapsible-header">
     *   collapsibleBody  → <div data-role="collapsible-body-content">
     *
     * @param {ExtensionScope<CollapsibleExtensionOptions>} this - Extension scope.
     * @returns {ExtensionDOMSpecs} Minimal DOM specs for schema registration.
     */
    domSpecs(this: ExtensionScope<CollapsibleExtensionOptions>): ExtensionDOMSpecs {
        const extraAttrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        return {
            nodes: {
                collapsible: {
                    toDOM: (attrs: Record<string, unknown>): DOMOutputDescriptor => {
                        const isCollapsed: boolean = attrs['collapsed'] === true;
                        return [
                            'div',
                            { ...extraAttrs, 'data-type': 'collapsible', 'data-collapsed': String(isCollapsed) },
                            0
                        ];
                    }
                },
                collapsibleHeader: {
                    toDOM: (): DOMOutputDescriptor => ['div', { 'data-role': 'collapsible-header' }, 0]
                },
                collapsibleBody: {
                    toDOM: (): DOMOutputDescriptor => ['div', { 'data-role': 'collapsible-body-content' }, 0]
                }
            }
        };
    },

    /**
     * Provides NodeViews for `collapsible`, `collapsibleHeader`, and
     * `collapsibleBody` to produce the required runtime DOM structure:
     *
     * @param {ExtensionScope<CollapsibleExtensionOptions>} this - Extension scope.
     * @returns {Record<string, NodeViewConstructor>} NodeView constructors keyed by node name.
     */
    nodeViews(this: ExtensionScope<CollapsibleExtensionOptions>): Record<string, NodeViewConstructor> {
        const editor: HeadlessEditor = this.editor;
        const extraAttrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};

        return {
            /**
             * Outer collapsible NodeView.
             *
             * @param {Record<string, unknown>} attrs - Node attribute bag.
             * @param {Object} _view - Opaque PM editor view reference (unused).
             * @param {Function} getPos - Resolves the node's current document position.
             * @returns {NodeViewDescriptor} DOM descriptor for the collapsible node view.
             */
            collapsible: (attrs: Record<string, unknown>, _view: unknown, getPos: () => number | undefined): NodeViewDescriptor => {
                const isCollapsed: boolean = attrs['collapsed'] === true;

                // Outer wrapper
                const outer: HTMLElement = document.createElement('div');
                outer.setAttribute('data-type', 'collapsible');
                outer.setAttribute('data-collapsed', String(isCollapsed));
                outer.dispatchEvent(
                    new CustomEvent('collapsible-state-changed', {
                        bubbles: false
                    })
                );
                for (const key of Object.keys(extraAttrs)) {
                    if (Object.prototype.hasOwnProperty.call(extraAttrs, key)) {
                        const value: string = extraAttrs[`${key}`] as string;
                        outer.setAttribute(key, value);
                    }
                }
                // contentDOM — PM renders collapsibleHeader and collapsibleBody
                // child NodeViews into this container.
                const contentContainer: HTMLElement = document.createElement('div');
                contentContainer.setAttribute('data-role', 'collapsible-content');

                outer.appendChild(contentContainer);

                // Finds the collapsibleBody DOM node rendered by PM inside contentDOM.
                // PM puts each child NodeView's `dom` as a direct child of contentDOM.
                const findBodyDOM: () => HTMLElement | null = (): HTMLElement | null =>
                    contentContainer.querySelector('[data-role="collapsible-body-content"]');

                return {
                    dom: outer,
                    // contentDOM is required so PM can instantiate child NodeViews
                    // (collapsibleHeader, collapsibleBody) and render them here.
                    contentDOM: contentContainer,
                    update: (updatedAttrs: Record<string, unknown>): boolean => {
                        const collapsed: boolean = updatedAttrs['collapsed'] === true;
                        outer.setAttribute('data-collapsed', String(collapsed));

                        // Update body visibility
                        const bodyDOM: HTMLElement | null = findBodyDOM();
                        if (bodyDOM !== null) {
                            bodyDOM.style.display = collapsed ? 'none' : '';
                        }

                        // Sync button classes — the button sits in the collapsibleHeader child,
                        // so we reach in and update it when the parent's collapsed state changes.
                        // This ensures the button stays in sync even if the PM state updates
                        // happen out-of-order relative to the click handler.
                        const buttonDOM: HTMLElement | null = outer.querySelector('.e-toggle-btn');
                        if (buttonDOM !== null) {
                            buttonDOM.innerHTML = getSvgIcon(collapsed ? 'collapse' : 'expand');
                        }

                        return true;
                    }
                };
            },

            /**
             * collapsibleHeader NodeView.
             *
             * @param {Record<string, unknown>} _attrs - Node attribute bag (unused).
             * @param {Object} view - Opaque PM editor view reference.
             * @param {Function} getPos - Resolves the node's current document position.
             * @returns {NodeViewDescriptor} DOM descriptor for the collapsible header node view.
             */
            collapsibleHeader: (_attrs: Record<string, unknown>, view: any, getPos: () => number | undefined): NodeViewDescriptor => {
                const wrapper: HTMLDivElement = document.createElement('div');
                wrapper.setAttribute(
                    'data-role',
                    'collapsible-header'
                );
                const button: HTMLButtonElement = document.createElement('button');
                button.setAttribute(
                    'contenteditable',
                    'false'
                );

                // Determine initial button class by walking document tree to find parent collapsible
                let isParentCollapsed: boolean = false;
                const pos: number | undefined = getPos();
                if (pos !== undefined && view?.state?.doc) {
                    const resolvedPos: { depth: number; node: (d: number) => { type: { name: string }; attrs: Record<string, unknown> } } =
                        view.state.doc.resolve(pos);
                    for (let depth: number = resolvedPos.depth; depth > 0; depth--) {
                        const ancestor: { type: { name: string }; attrs: Record<string, unknown> } = resolvedPos.node(depth);
                        if (ancestor.type.name === 'collapsible') {
                            isParentCollapsed = ancestor.attrs['collapsed'] === true;
                            break;
                        }
                    }
                }
                button.className = 'e-toggle-btn';
                button.innerHTML = getSvgIcon(isParentCollapsed ? 'collapse' : 'expand');
                const content: HTMLDivElement = document.createElement('div');
                content.className = 'e-collapsible-header-content';
                wrapper.appendChild(button);
                wrapper.appendChild(content);

                const onClick: () => void = (): void => {
                    const collapsed: boolean =
                        wrapper.closest('[data-type="collapsible"]')
                            ?.getAttribute('data-collapsed') === 'true';
                    const pos: number = getPos();
                    if (collapsed) {
                        editor.commands.expand({
                            pos
                        });
                    } else {
                        editor.commands.collapse({
                            pos
                        });
                    }
                };
                button.addEventListener(
                    'click',
                    onClick
                );
                return {
                    dom: wrapper,
                    contentDOM: content,
                    update(): boolean {
                        return true;
                    },
                    destroy(): void {
                        button.removeEventListener(
                            'click',
                            onClick
                        );
                    }
                };
            },

            /**
             * collapsibleBody NodeView.
             *
             * @param {Record<string, unknown>} _attrs - Node attribute bag (unused).
             * @param {Object} _view - Opaque PM editor view reference (unused).
             * @param {Function} _getPos - Resolves the node's current document position (unused).
             * @returns {NodeViewDescriptor} DOM descriptor for the collapsible body node view.
             */
            collapsibleBody: (_attrs: Record<string, unknown>, _view: unknown, _getPos: () => number | undefined): NodeViewDescriptor => {
                const bodyDiv: HTMLElement = document.createElement('div');
                bodyDiv.setAttribute('data-role', 'collapsible-body-content');
                bodyDiv.className = 'e-collapsible-body-content';

                return {
                    dom: bodyDiv,
                    contentDOM: bodyDiv
                };
            }
        };
    },

    /**
     * Registers keyboard shortcuts for collapsible operations.
     *
     * - `Mod-Alt-[`  → toggleCollapsible with a paragraph trigger
     *                   (convenience default; consumers can override via configure())
     * - `Mod-Alt-,`  → collapse the nearest collapsible ancestor
     * - `Mod-Alt-.`  → expand the nearest collapsible ancestor
     *
     * To create a heading-triggered collapsible via keyboard, call
     * `toggleCollapsible({ triggerType: 'heading', level: N })` programmatically.
     *
     * @returns {Object} Keymap entries mapping shortcuts to command names.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-Alt-[': () => this.editor.commands.toggleCollapsible({ triggerType: 'paragraph' }),
            'Mod-Alt-,': () => this.editor.commands.collapse(),
            'Mod-Alt-.': () => this.editor.commands.expand()
        };
    }
});

export default collapsibleExtension;
