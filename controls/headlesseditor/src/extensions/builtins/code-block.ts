/**
 * Code Block Extension
 *
 * Provides code block node for displaying code snippets.
 */

import { defineExtension } from '../define-extension';
import { HeadlessEditor } from '../../headless-editor/index';
import type { NodeDefinition } from '../../schema/types/node-definition';
import type { AttributeDefinition } from '../../schema/types/attribute-definition';
import { NodeContent } from '../../schema/types/content-expression';
import type { Command } from '../../commands/types';
import {
    DOMOutputDescriptor,
    ExtensionDefinition,
    ExtensionDOMSpecs,
    ExtensionScope,
    InputRuleDefinition,
    NodeViewConstructor,
    NodeViewDescriptor
} from '../types';
import { setCodeBlockCommand } from '../../commands/builtins/structure/set-code-block';
import { toggleCodeBlockCommand } from '../../commands/builtins/structure/toggle-code-block';
import { setCodeBlockLanguageCommand } from '../../commands/builtins/code-block/set-code-block-language';
import { indentCodeBlockCommand } from '../../commands/builtins/code-block/indent-code-block';
import { outdentCodeBlockCommand } from '../../commands/builtins/code-block/outdent-code-block';
import { clearCodeBlockCommand } from '../../commands/builtins/code-block/clear-code-block';
import { exitCodeCommand } from '../../commands/builtins/code-block/exit-code';
import { PMEditorState, PMResolvedPos } from '../../pm/pm-guard';
import { createNodeRule } from '../inputrules/insert-input-rule';

/**
 * Re-exported so consumers can type their `setCodeBlock` payload.
 */
export interface SetCodeBlockPayload {
    language?: string;
}

/**
 * Configuration object for the code block extension.
 */
export interface CodeBlockOptions {
    /**
     * Prefix prepended to the language identifier when rendering the
     * `<code>` class attribute (e.g. `'language-'`).
     * Set to `null` to disable language class emission entirely.
     */
    languageClassPrefix?: string | null;

    /**
     * Default language applied when a code block has no language set.
     * Always defined; defaults to `'plaintext'`.
     */
    defaultLanguage?: string;

    /**
     * Whether Tab / Shift-Tab indent the current line. Default `false`.
     */
    enableTabIndentation?: boolean;

    /**
     * Number of spaces a single Tab keypress inserts / Shift-Tab removes.
     */
    tabSize?: number;

    /**
     * Whether triple-Enter exits the code block. Default `true`.
     */
    exitOnTripleEnter?: boolean;

    /**
     * Whether ArrowUp at the first line exits upward. Default `true`.
     */
    exitOnArrowUp?: boolean;

    /**
     * Whether ArrowDown at the last line exits downward. Default `true`.
     */
    exitOnArrowDown?: boolean;

    /**
     * HTML attributes merged onto the outer `<pre>` element.
     */
    htmlAttributes?: Readonly<Record<string, string>>;

    /**
     * Optional custom NodeView factory for rendering code block headers.
     * Receives PM attrs and returns a `Record<string, NodeViewConstructor>`
     * keyed by node type name (same signature as the `nodeViews` capability).
     */
    addNodeView?: () => Record<string, NodeViewConstructor>;
}

/**
 * Code block built-in extension.
 *
 * The `CodeBlockOptions` interface is fully exposed so consumers can
 * call `codeBlockExtension.configure({ ... })` with type safety.
 */
export const codeBlockExtension: ExtensionDefinition<CodeBlockOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'codeBlock',

    /**
     * Returns the default options exposed by this extension. Every
     * option has a default; consumers only supply overrides.
     *
     * @returns {CodeBlockOptions} Default option values.
     */
    defineOptions(): CodeBlockOptions {
        return {
            languageClassPrefix: 'language-',
            defaultLanguage: 'plaintext',
            enableTabIndentation: false,
            tabSize: 4,
            exitOnTripleEnter: true,
            exitOnArrowUp: true,
            exitOnArrowDown: true,
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `codeBlock` node type.
     *
     * The schema-level `defining: true` / `marks: ''` / `code: true`
     * flags are contributed by `src/pm/adapters/node-pm-metadata.ts`.
     *
     * @returns {NodeDefinition[]} Array containing the codeBlock node definition.
     */
    nodes(): NodeDefinition[] {
        const codeBlockNode: NodeDefinition = {
            name: 'codeBlock',
            group: 'block',
            content: NodeContent.text().zeroOrMore(),
            attrs: [
                {
                    name: 'language',
                    type: 'string',
                    default: 'plaintext'
                } as AttributeDefinition
            ]
        };
        return [codeBlockNode];
    },

    /**
     * Contributes the public commands for code block manipulation.
     *
     * @returns {Command[]} Array of code-block command descriptors.
     */
    commands(): Command[] {
        return [
            setCodeBlockCommand as unknown as Command,
            toggleCodeBlockCommand as unknown as Command,
            setCodeBlockLanguageCommand as unknown as Command,
            indentCodeBlockCommand as unknown as Command,
            outdentCodeBlockCommand as unknown as Command,
            clearCodeBlockCommand as unknown as Command,
            exitCodeCommand as unknown as Command
        ];
    },

    /**
     * Renders code blocks as `<pre><code>` and emits the language class
     * when a language is set and `languageClassPrefix` is non-null.
     *
     * Symmetry: this `toDOM` is also what PM's DOMParser uses as the
     * round-trip target. A pasted
     * `<pre><code class="language-js">…</code></pre>` resolves back to
     * a `codeBlock` node with `language="js"`.
     *
     * @param {ExtensionScope<CodeBlockOptions>} this Extension scope.
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
     */
    domSpecs(this: ExtensionScope<CodeBlockOptions>): ExtensionDOMSpecs {
        const options: CodeBlockOptions = this.options ?? {};
        const baseAttrs: Readonly<Record<string, string>> =
            options.htmlAttributes ?? {};
        const prefix: string | null =
            options.languageClassPrefix === undefined
                ? 'language-'
                : options.languageClassPrefix;
        const defaultLanguage: string = options.defaultLanguage ?? 'plaintext';

        return {
            nodes: {
                codeBlock: {
                    toDOM: (attrs: Record<string, unknown>): DOMOutputDescriptor => {
                        const rawLanguage: unknown = attrs['language'];
                        const language: string =
                            typeof rawLanguage === 'string' && rawLanguage.length > 0
                                ? rawLanguage
                                : defaultLanguage;
                        const codeAttrs: Record<string, string> = {};
                        if (prefix && language) {
                            codeAttrs['class'] = `${prefix}${language}`;
                        }
                        return ['pre', { ...baseAttrs }, ['code', codeAttrs, 0]];
                    },
                    parseDOM: [
                        { tag: 'pre', preserveWhitespace: 'full' as const }
                    ]
                }
            }
        };
    },

    /**
     * Contributes fenced-code input rules.
     *
     * Patterns capture the language identifier (group 1), which is
     * normalized to lowercase and forwarded to the new code block's
     * `language` attribute. The regex pattern matches
     * ` ```js `, ` ```c++ `, ` ```html+erb `, ` ```objective-c `, etc.
     *
     * @returns {Array} Array of fenced-code input rules.
     */
    inputRules(): readonly InputRuleDefinition[] {
        const languagePattern: RegExp = /^```([a-z0-9+\-#.]*)[\s\n]$/;
        const tildePattern: RegExp = /^~~~([a-z0-9+\-#.]*)[\s\n]$/;

        return [
            createNodeRule({
                id: 'codeblock:triple-backtick',
                pattern: languagePattern,
                target: 'codeBlock',
                attributeProvider: (match: RegExpMatchArray): Record<string, unknown> => {
                    const raw: string | undefined = match[1];
                    const normalized: string = (raw ?? '').toLowerCase();
                    return { language: normalized };
                }
            }),
            createNodeRule({
                id: 'codeblock:triple-tilde',
                pattern: tildePattern,
                target: 'codeBlock',
                attributeProvider: (match: RegExpMatchArray): Record<string, unknown> => {
                    const raw: string | undefined = match[1];
                    const normalized: string = (raw ?? '').toLowerCase();
                    return { language: normalized };
                }
            })
        ];
    },

    /**
     * Registers the code-block keyboard shortcuts.
     *
     * Behavior parity with `@tiptap/extension-code-block`:
     *   - `Mod-Alt-c`     → toggle
     *   - `Tab`           → indent (gated by `enableTabIndentation`)
     *   - `Shift-Tab`     → outdent (gated by `enableTabIndentation`)
     *   - `Enter`         → exit on triple-enter (gated by `exitOnTripleEnter`)
     *   - `ArrowUp`       → exit at doc start (gated by `exitOnArrowUp`)
     *   - `ArrowDown`     → exit at last line / cursor to next node (gated by `exitOnArrowDown`)
     *   - `Backspace`     → empty-block deletion at empty content at start
     *
     * Mirrors `list-keymap.ts` exactly:
     *   - Arrow-function handlers dispatch through `this.editor.commands.*`.
     *   - The command's own `canExecute` gates the dispatch — no
     *     precheck via `editor.can()` (which adds routing indirection
     *     inside the keymap chain).
     *   - Each handler is a single command-method call (matching the
     *     `onTab` shape). All state checks (cursor position, content
     *     shape, sibling presence) live inside the command's own
     *     `canExecute`, so a handler reading like
     *     `() => this.editor.commands.<x>()` is the canonical form.
     *   - Returns `true` to consume the key, `false` to fall through
     *     to the base keymap (or the next extension in the chain).
     *
     * @param {ExtensionScope<CodeBlockOptions>} this Extension scope.
     * @returns {Object} Keyboard shortcut entries.
     */
    keyboardShortcuts(this: ExtensionScope<CodeBlockOptions>): Record<string, () => boolean> {
        const options: CodeBlockOptions = (this.options ?? {}) as CodeBlockOptions;
        const tabSize: number = options.tabSize ?? 4;
        const enableTabIndentation: boolean = options.enableTabIndentation ?? false;
        const exitOnTripleEnter: boolean = options.exitOnTripleEnter ?? true;
        const exitOnArrowUp: boolean = options.exitOnArrowUp ?? true;
        const exitOnArrowDown: boolean = options.exitOnArrowDown ?? true;

        const getCodeBlockPosition: () => PMResolvedPos | undefined = (): PMResolvedPos | undefined => {
            const editor: HeadlessEditor = this.editor;
            if (!editor) { return undefined; }
            const pmState: PMEditorState = editor.integration.getState();
            const $from: PMResolvedPos = pmState.selection.$from;
            return $from.parent.type.name === 'codeBlock' ? $from : undefined;
        };

        // ── Handlers ──────────────────────────────────────────────────────
        //
        // Each handler is a single command-method call. The command
        // does all the state checking in its `canExecute`, so the
        // handlers stay one-liners like `onTab` / `onShiftTab`.

        const onTab: () => boolean = (): boolean => {
            if (!enableTabIndentation) { return false; }
            return this.editor.commands.indentCodeBlock({ tabSize });
        };

        const onShiftTab: () => boolean = (): boolean => {
            if (!enableTabIndentation) { return false; }
            return this.editor.commands.outdentCodeBlock({ tabSize });
        };

        const onEnter: () => boolean = (): boolean => {
            if (!exitOnTripleEnter) { return false; }
            const $from: PMResolvedPos | undefined = getCodeBlockPosition();
            if (!$from || !$from.parent.textContent.endsWith('\n\n')) { return false; }
            return this.editor.commands.exitCode();
        };

        const onArrowUp: () => boolean = (): boolean => {
            if (!exitOnArrowUp) { return false; }
            const $from: PMResolvedPos | undefined = getCodeBlockPosition();
            if (!$from || $from.parentOffset !== 0 || $from.pos !== 1) { return false; }
            return this.editor.commands.exitCode();
        };

        const onArrowDown: () => boolean = (): boolean => {
            if (!exitOnArrowDown) { return false; }
            const $from: PMResolvedPos | undefined = getCodeBlockPosition();
            if (!$from || $from.parentOffset !== $from.parent.nodeSize - 2) { return false; }
            return this.editor.commands.exitCode();
        };

        const onBackspace: () => boolean = (): boolean => {
            return this.editor.commands.clearCodeBlock();
        };

        return {
            'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
            'Tab': onTab,
            'Shift-Tab': onShiftTab,
            'Enter': onEnter,
            'ArrowUp': onArrowUp,
            'ArrowDown': onArrowDown,
            'Backspace': onBackspace
        };
    },

    /**
     * Optionally provides a custom NodeView for rendering code block headers.
     *
     * If `addNodeView` is configured, the extension calls it to obtain a
     * `Record<string, NodeViewConstructor>` (same shape as the `nodeViews`
     * capability contributor). The extension then wraps each consumer
     * NodeView with the standard `<pre><code>` structure so consumers can
     * focus on the header/template only.
     *
     * If `addNodeView` is not configured, this returns `{}` and the
     * extension's `domSpecs()` is used (basic `<pre><code>` rendering).
     *
     * @param {ExtensionScope<CodeBlockOptions>} this Extension scope.
     * @returns {Record<string, NodeViewConstructor>} Node-view constructors.
     */
    nodeViews(this: ExtensionScope<CodeBlockOptions>): Record<string, NodeViewConstructor> {
        const addNodeView: (() => Record<string, NodeViewConstructor>) | undefined = this.options?.addNodeView;

        // No custom rendering - fall back to domSpecs
        if (!addNodeView) {
            return {};
        }

        // ── Invoke addNodeView ONCE here (not inside the per-node constructor) ──
        // Calling it inside the NodeViewConstructor would re-run the consumer's
        // factory on every PM mount/remount, re-scheduling any deferred side-effects
        // (e.g. Syncfusion appendTo) and causing an infinite remount loop.
        const consumerConstructors: Record<string, NodeViewConstructor> =
            addNodeView.call(this as unknown as ExtensionScope<CodeBlockOptions>);
        const consumerCodeBlockCtor: NodeViewConstructor | undefined =
            consumerConstructors['codeBlock'];

        if (!consumerCodeBlockCtor) {
            return {};
        }

        const options: CodeBlockOptions = this.options ?? {};
        const prefix: string | null =
            options.languageClassPrefix === undefined
                ? 'language-'
                : options.languageClassPrefix;
        const defaultLanguage: string = options.defaultLanguage ?? 'plaintext';

        // Container constructor returned by addNodeView
        const nodeViewConstructor: NodeViewConstructor = (
            attrs: Record<string, unknown>,
            _view: unknown,
            _getPos: () => number | undefined
        ): NodeViewDescriptor => {
            // Extract language from attrs
            const rawLanguage: unknown = attrs['language'];
            const language: string =
                typeof rawLanguage === 'string' && rawLanguage.length > 0
                    ? rawLanguage
                    : defaultLanguage;

            // ── Outer wrapper (extension-owned) ──
            const outer: HTMLDivElement = document.createElement('div');
            outer.classList.add('e-code-block');

            // ── ContentDOM where PM will render code text (extension-owned) ──
            const code: HTMLElement = document.createElement('code');
            if (prefix && language) {
                code.setAttribute('class', `${prefix}${language}`);
            }
            const pre: HTMLElement = document.createElement('pre');
            pre.appendChild(code);

            // ── Get the user's header DOM via the cached per-node constructor ──
            const wrapped: HTMLElement = consumerCodeBlockCtor(attrs, _view, _getPos)['dom'];

            // Header subtree is non-editable UI chrome — mark it so the consumer's
            // widgets (Syncfusion Button, DropDownList, etc.) can mutate freely
            // without ProseMirror interpreting mutations as content changes.
            wrapped.setAttribute('contenteditable', 'false');

            // Append user template first (header), then extension's <pre><code>
            outer.appendChild(wrapped);
            outer.appendChild(pre);

            // Keep command-based header actions scoped to this code block.
            // Header controls are outside the editable content, so focus the
            // block before a language control emits its change command.
            wrapped.addEventListener('mousedown', (): void => {
                const pos: number | undefined = _getPos();
                const editor: HeadlessEditor = this.editor;
                if (pos !== undefined && editor) {
                    editor.commands.setSelection({ from: pos + 1, to: pos + 1 });
                }
            });

            // ── ignoreMutation bridge ──
            // For any DOM mutation whose target lives inside the *header* subtree
            // (NOT inside the content hole), tell ProseMirror to skip it
            // completely. This is the proper way to host third-party widgets
            // (Syncfusion, Bootstrap, etc.) that wrap/replace DOM nodes on init:
            //   - Syncfusion `Button.appendTo(host)` swaps `host` for a wrapper.
            //   - Without `ignoreMutation`, PM sees the structural change and
            //     tries to remount the NodeView → re-runs the consumer factory →
            //     schedules another widget init → infinite loop.
            // Returning `true` here silences PM, the constructor runs once, and
            // the widget initialization completes cleanly.
            const ignoreMutation: (mutation: unknown) => boolean = (mutation: unknown): boolean => {
                const m: any = mutation;
                const target: Node | null = m && typeof m === 'object' && 'target' in m
                    ? (m as { target: Node }).target
                    : null;
                if (!target) {
                    return false;
                }
                // Mutations inside the header subtree are widget noise — ignore them.
                if (wrapped.contains(target)) {
                    return true;
                }
                // Mutations inside the content hole (`<code>`) are real content
                // changes — let PM process them normally.
                return false;
            };

            return {
                dom: outer,
                contentDOM: code,
                update: (newAttrs: Record<string, unknown>) => {
                    const newLanguage: string = typeof newAttrs['language'] === 'string'
                        ? newAttrs['language']
                        : defaultLanguage;
                    const newClass: string = prefix ? `${prefix}${newLanguage}` : '';
                    if (newClass) {
                        code.setAttribute('class', newClass);
                    } else {
                        code.removeAttribute('class');
                    }
                    return true;
                },
                ignoreMutation: ignoreMutation
            };
        };

        return {
            codeBlock: nodeViewConstructor
        };
    }

});

export default codeBlockExtension;
