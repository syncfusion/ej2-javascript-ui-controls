/**
 * Link Extension
 *
 * Provides semantic link formatting (`<a>`) with:
 * - setLink command (add or update links, optionally with display text)
 * - unsetLink command (remove links)
 * - Query APIs (isActive, getAttributes)
 * - URL validation (protocol whitelist)
 * - Stored marks for empty selection so the next typed character inherits
 *   the link when no range is selected
 */

import { defineExtension } from '../define-extension';
import type { MarkDefinition } from '../../core/schema/types/mark-definition';
import type { AttributeDefinition } from '../../core/schema/types/attribute-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { setLinkCommand } from './commands/set-link';
import { unsetLinkCommand } from './commands/unset-link';
import type { Command } from '../../core/commands/types';
import { PMEditorView, PMPlugin } from '../../pm/pm-guard';
import { createLinkRule } from '../inputrules/link-input-rule';

export interface LinkExtensionOptions extends ExtensionOptions {
    /**
     * Determines whether links open when clicked in the editor.
     *
     * When enabled, clicking a link navigates to its target URL in a new browser
     * tab. When disabled, clicking places the cursor inside the link for editing.
     *
     * @default true
     */
    openOnClick?: boolean;
}

/**
 * Link extension for the Syncfusion Headless Editor.
 *
 * Adds hyperlink support to the editor through the shared `link` mark. Enables users
 * to create, update, and remove hyperlinks through the setLink and unsetLink commands.
 * Includes URL validation with a protocol whitelist (http, https, mailto) and stored
 * marks for empty selections so the next typed character inherits the link.
 *
 * **Contributes:**
 * - `link` mark type with href, title, target, and rel attributes
 * - `setLink` command (add or update links, optionally with display text)
 * - `unsetLink` command (remove links)
 * - Query APIs (isActive, getAttributes)
 * - URL validation (protocol whitelist)
 * - Input rules for Markdown-style link syntax
 *
 * **Stored mark behavior:**
 * When no range is selected, setLink stores the mark so the next typed
 * character inherits the link automatically.
 *
 * @type {ExtensionDefinition<LinkExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with link extension
 * const editor = HeadlessEditor.create({
 *   extensions: [basicExtensions, linkExtension],
 *   // openOnClick defaults to true
 * });
 *
 * // Add link to current selection
 * editor.commands.setLink({ href: 'https://example.com' });
 *
 * // Add link with display text
 * editor.commands.setLink({
 *   href: 'https://example.com',
 *   text: 'Visit Example'
 * });
 *
 * // Check active state
 * const isActive: boolean = editor.isActive('link');
 *
 * // Remove link
 * editor.commands.unsetLink();
 * ```
 *
 * @see LinkExtensionOptions for configuration options
 * @see setLinkCommand for direct command usage
 */
export const linkExtension: ExtensionDefinition<LinkExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'link',

    /**
     * Orders link before lower-priority marks for proper nested serialization.
     */
    priority: 1000,

    /**
     * Adds options to the Link extension.
     *
     * @returns {LinkExtensionOptions} The options added to this extension.
     */
    defineOptions(): LinkExtensionOptions {
        return {
            htmlAttributes: {},
            openOnClick: true
        };
    },

    /**
     * Registers the `link` mark type with configurable behavior.
     *
     * @returns {MarkDefinition[]} Array containing the link mark definition.
     */
    marks(): MarkDefinition[] {
        const linkAttributes: AttributeDefinition[] = [
            {
                name: 'href',
                type: 'string',
                default: ''
            },
            {
                name: 'title',
                type: 'string',
                default: null
            },
            {
                name: 'target',
                type: 'string',
                default: null
            },
            {
                name: 'rel',
                type: 'string',
                default: null
            }
        ];
        return [
            {
                name: 'link',
                attrs: linkAttributes,
                inclusive: false
            }
        ];
    },

    /**
     * Contributes the link commands.
     * - setLink: apply or update link (with optional display text)
     * - unsetLink: remove link
     *
     * @returns {Command[]} Array containing link commands.
     */
    commands(): Command[] {
        return [
            setLinkCommand,
            unsetLinkCommand
        ];
    },

    /**
     * Renders link mark as semantic `<a>` tag with:
     * - href, title, target, rel attributes
     * - User-supplied HTML attributes (from options)
     * - Proper event handling based on openOnClick config
     *
     * @param {ExtensionScope<LinkExtensionOptions>} this Extension scope
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
     */
    domSpecs(this: ExtensionScope<LinkExtensionOptions>): ExtensionDOMSpecs {
        const userAttributes: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        return {
            marks: {
                link: {
                    /**
                     * Renders link mark to DOM.
                     * Outputs: <a href="..." title="..." target="..." rel="..." [custom-attrs]>content</a>
                     *
                     * @param {*} mark - The link mark with attributes
                     * @returns {*} DOM descriptor [tag, attrs, hole] for ProseMirror rendering
                     */
                    toDOM: (mark: Record<string, unknown>): DOMOutputDescriptor => {
                        const linkAttrs: Record<string, unknown> = {
                            ...userAttributes,
                            href: (mark.href as string) || ''
                        };
                        // Add optional attributes only if they have values
                        if (mark.title) {
                            linkAttrs.title = mark.title;
                        }
                        if (mark.target) {
                            linkAttrs.target = mark.target;
                        }
                        if (mark.rel) {
                            linkAttrs.rel = mark.rel;
                        }

                        return ['a', linkAttrs, 0]; // 0 = content hole (text goes here)
                    },
                    parseDOM: [
                        {
                            tag: 'a[href]',
                            getAttrs: (dom: any) => ({
                                href: (dom as HTMLAnchorElement).getAttribute('href') ?? '',
                                title: (dom as HTMLAnchorElement).getAttribute('title') || null,
                                target: (dom as HTMLAnchorElement).getAttribute('target') || null,
                                rel: (dom as HTMLAnchorElement).getAttribute('rel') || null
                            })
                        }
                    ]
                }
            }
        };
    },
    inputRules(): readonly InputRuleDefinition[] {
        return [
            createLinkRule({
                id: 'link:markdown',
                pattern: /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/
            }),
            createLinkRule({
                id: 'link:url',
                pattern: /(https?:\/\/[^\s]+)$/
            }),
            createLinkRule({
                id: 'link:www',
                pattern: /(www\.[^\s]+\.[a-z]{2,})$/i
            }),
            createLinkRule({
                id: 'link:email',
                pattern: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
            })
        ];
    },

    /**
     * Contributes keyboard shortcuts for link commands.
     * Maps Mod-k to setLink command.
     *
     * @returns {Object} Keyboard shortcut entries.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-k': () => this.editor.commands.setLink({ href: '' })
        };
    },

    /**
     * Contributes the link click handler plugin.
     *
     * Only left-clicks on a link are intercepted. When the editor is
     * read-only the click is ignored and the browser navigates natively.
     * When `openOnClick` is true the URL is opened via `window.open` and
     * the click is claimed; otherwise the click falls through so the
     * cursor is placed inside the link for in-place editing.
     *
     * @param {ExtensionScope<LinkExtensionOptions>} this Extension scope
     * @returns {PMPlugin[]} Array containing the link click plugin.
     */
    plugins(this: ExtensionScope<LinkExtensionOptions>): readonly PMPlugin[] {
        const openOnClick: boolean = this.options?.openOnClick ?? false;

        return [new PMPlugin({
            props: {
                handleClick(view: PMEditorView, _pos: number, event: MouseEvent): boolean {
                    // Only respond to left-clicks.
                    if (event.button !== 0) {
                        return false;
                    }

                    // When editor is read-only, let the browser navigate natively.
                    if (!view.editable) {
                        return false;
                    }

                    // Locate the closest <a> ancestor, scoped to the editor root.
                    const target: HTMLElement | null = event.target as HTMLElement | null;
                    if (!target) {
                        return false;
                    }
                    const link: HTMLAnchorElement | null = target.closest('a');
                    if (!link || !view.dom.contains(link)) {
                        return false;
                    }

                    // No-op if openOnClick is disabled: PM will place the cursor inside the link.
                    if (!openOnClick) {
                        return false;
                    }

                    const href: string | null = link.getAttribute('href');
                    if (!href) {
                        return false;
                    }

                    // Honor target attribute, default to new tab to keep the editor mounted.
                    const targetAttr: string = link.getAttribute('target') || '_blank';
                    window.open(href, targetAttr, 'noopener,noreferrer');
                    event.preventDefault();
                    return true;
                }
            }
        })];
    }
});

export default linkExtension;
