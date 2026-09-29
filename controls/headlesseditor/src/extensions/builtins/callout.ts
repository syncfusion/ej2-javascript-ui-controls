/**
 * Callout Extension
 *
 * Provides the callout block node for highlighted content such as
 * informational messages, warnings, errors, and success notices.
 *
 * Contributes:
 * - 'callout' node
 * - 'toggleCallout' command
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
import { createWrappingRule } from '../inputrules/wrap-input-rule';

import { toggleCalloutCommand } from '../../commands/builtins/structure/toggle-callout';
import { getSvgIcon } from '../../utils/common';

/**
 * The six predefined Callout variants provided by the built-in
 * extension.
 *
 * This union represents only the variants the built-in Callout knows
 * how to render. The `variant` attribute on the callout node itself
 * remains a plain `string` at the schema level — a customer who
 * extends the Callout extension can store a custom variant name there
 * and render it through their own `nodeViews()` implementation.
 */
export type CalloutVariant =
    | 'info'
    | 'warning'
    | 'note'
    | 'success'
    | 'error'
    | 'tip';

export interface CalloutExtensionOptions extends ExtensionOptions {
    /**
     * HTML attributes applied to the outer callout element.
     */
    readonly htmlAttributes?: Readonly<Record<string, string>>;

    /**
     * Default variant used when no variant is specified.
     */
    readonly defaultVariant?: string;
}

/**
 * Callout built-in extension.
 */
export const calloutExtension: ExtensionDefinition<CalloutExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'callout',

    /**
     * Tier 3 — recursive container (content: block+). Must be registered after
     * Tier 1 primary fillers to prevent `fillBefore` infinite recursion.
     */
    priority: 10,

    /**
     * Defines configurable options for the callout extension.
     *
     * @returns {CalloutExtensionOptions} Default option values.
     */
    defineOptions(): CalloutExtensionOptions {
        return {
            htmlAttributes: {},
            defaultVariant: 'info'
        };
    },

    /**
     * Registers the callout node type
     * @returns {NodeDefinition[]} Array containing the callout node definitions.
     */
    nodes(): NodeDefinition[] {
        const calloutNode: NodeDefinition = {
            name: 'callout',
            group: 'block',
            content: NodeContent.block().oneOrMore(),
            attrs: [
                {
                    name: 'variant',
                    type: 'string',
                    default: 'info'
                } as AttributeDefinition
            ]
        };

        return [calloutNode];
    },

    /**
     * Registers the callout commands:
     *
     * @returns {Command[]} Array of collapsible commands.
     */
    commands(): Command[] {
        return [
            toggleCalloutCommand
        ];
    },

    /**
     * Fallback DOM spec for `callout` — required by PMSchemaAdapter for
     * schema registration and HTML serialization. NodeView overrides rendering
     * at runtime inside the editor view.
     *
     * @returns {ExtensionDOMSpecs} Minimal DOM spec for schema registration.
     */
    domSpecs(): ExtensionDOMSpecs {
        const extraAttrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        return {
            nodes: {
                callout: {
                    toDOM: (attrs: Record<string, unknown>): DOMOutputDescriptor => {
                        const variant: string =
                            typeof attrs['variant'] === 'string'
                                ? attrs['variant']
                                : this.options?.defaultVariant ?? 'info';
                        return ['div', { ...extraAttrs, 'data-type': 'callout', 'data-variant': variant }, 0];
                    }
                }
            }
        };
    },

    /**
     * Provides a NodeView for `callout`
     *
     * `update(attrs)` syncs `data-variant` and the button icon whenever the
     * variant changes (e.g. via a command or undo/redo).
     *
     * @param {ExtensionScope<CalloutExtensionOptions>} this - Extension scope.
     * @returns {Record<string, NodeViewConstructor>} NodeView constructors keyed by node name.
     */
    nodeViews(this: ExtensionScope<CalloutExtensionOptions>): Record<string, NodeViewConstructor> {
        const defaultVariant: string =
            this.options?.defaultVariant ?? 'info';
        return {
            callout: (attrs: Record<string, unknown>): NodeViewDescriptor => {
                const variant: string =
                typeof attrs['variant'] === 'string'
                    ? attrs['variant']
                    : defaultVariant;
                // Outer wrapper
                const outer: HTMLElement = document.createElement('div');
                outer.setAttribute('data-type', 'callout');
                outer.setAttribute('data-variant', variant);

                // Icon button — outside contentDOM, not editable text.
                // The icon is rendered from a predefined library SVG
                const iconBtn: HTMLElement = document.createElement('div');
                iconBtn.setAttribute('contenteditable', 'false');
                iconBtn.className = 'e-callout-icon';
                iconBtn.innerHTML = getSvgIcon(variant);

                // contentDOM — holds all PM block content
                const contentDiv: HTMLElement = document.createElement('div');
                contentDiv.className = 'e-callout-content';

                outer.appendChild(iconBtn);
                outer.appendChild(contentDiv);
                return {
                    dom: outer,
                    contentDOM: contentDiv,
                    update: (updatedAttrs: Record<string, unknown>): boolean => {
                        const newVariant: string =
                        typeof updatedAttrs['variant'] === 'string'
                            ? updatedAttrs['variant']
                            : defaultVariant;
                        outer.setAttribute('data-variant', newVariant);
                        iconBtn.className = 'e-callout-icon';
                        iconBtn.innerHTML = getSvgIcon(newVariant);
                        return true;
                    }
                };
            }
        };
    },

    /**
     * Contributes input rules.
     *
     * @returns {InputRuleDefinition[]} Wrapping input rules for the callout block.
     */
    inputRules(): readonly InputRuleDefinition[] {
        return [
            createWrappingRule({
                id: 'callout:exclaim',
                pattern: /^!!! $/,
                target: 'callout',
                attributeProvider: () => ({
                    variant: 'info'
                })
            }),
            createWrappingRule({
                id: 'callout:colon',
                pattern: /^::: $/,
                target: 'callout',
                attributeProvider: {
                    variant: 'note'
                }
            })
        ];
    },

    /**
     * Registers keyboard shortcuts for Callout operations.
     *
     * @returns {Object} Keyboard shortcut entry for Mod-Shift-c.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-Shift-c': () => this.editor.commands.toggleCallout()
        };
    }
});

export default calloutExtension;
