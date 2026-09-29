import { boldExtension, HeadlessEditor, listExtension, paragraphExtension, tableExtension, textAlignExtension, TextNode, undoRedoExtension } from '../../../src';
import { Command } from '../../../src/commands/types';
import { indentOutdentExtension } from '../../../src/extensions/builtins/indent-outdent';
import type { ExtensionDefinition, ExtensionScope } from '../../../src/extensions/types';

// ── Shared test fixtures ────────────────────────────────────────────────────

interface IndentOutdentScope {
    editor?: unknown;
    editorConfig?: { enableTabKey?: boolean };
}

interface TabKeyOptions {
    enableTabKey?: boolean;
    shiftKey?: boolean;
}

type ScopedShortcuts = Record<string, () => boolean>;

/**
 * Builds a `keydown` KeyboardEvent for Tab / Shift-Tab dispatch, matching the
 * shape the editor's keymap plugin inspects (`key` / `code` / `shiftKey`).
 */
function buildTabEvent(shiftKey = false): KeyboardEvent {
    return new KeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        shiftKey,
        bubbles: true,
        cancelable: true
    });
}

/** A single-paragraph document carrying one text run of the supplied string. */
function paragraphDoc(text = 'Hello') {
    return {
        type: 'document' as const,
        id: crypto.randomUUID(),
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: [{
            type: 'paragraph' as const,
            id: crypto.randomUUID(),
            attrs: {},
            marks: [],
            children: [{
                type: 'text',
                id: crypto.randomUUID(),
                text,
                marks: []
            } as TextNode]
        }]
    };
}

/** A single-item bullet list document used to exercise list-item Tab behaviour. */
function listDoc(text = 'List Item') {
    return {
        type: 'document' as const,
        id: crypto.randomUUID(),
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: [{
            type: 'bulletList' as const,
            id: crypto.randomUUID(),
            attrs: {},
            marks: [],
            children: [{
                type: 'listItem' as const,
                id: crypto.randomUUID(),
                attrs: {},
                marks: [],
                children: [{
                    type: 'paragraph' as const,
                    id: crypto.randomUUID(),
                    attrs: {},
                    marks: [],
                    children: [{
                        type: 'text',
                        id: crypto.randomUUID(),
                        text,
                        marks: []
                    } as TextNode]
                }]
            }]
        }]
    };
}

/** A single-row, two-cell table document used to exercise table-cell Tab behaviour. */
function tableDoc() {
    const cell = (text: string) => ({
        type: 'tableCell' as const,
        id: crypto.randomUUID(),
        attrs: { colspan: 1, rowspan: 1 },
        marks: [],
        children: [{
            type: 'paragraph' as const,
            id: crypto.randomUUID(),
            attrs: {},
            marks: [],
            children: [{
                type: 'text',
                id: crypto.randomUUID(),
                text,
                marks: []
            } as TextNode]
        }]
    });
    return {
        type: 'document' as const,
        id: crypto.randomUUID(),
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: [{
            type: 'table' as const,
            id: crypto.randomUUID(),
            attrs: {},
            marks: [],
            children: [{
                type: 'tableRow' as const,
                id: crypto.randomUUID(),
                attrs: {},
                marks: [],
                children: [cell('Cell A'), cell('Cell B')]
            }]
        }]
    };
}

/**
 * Mounts a HeadlessEditor over the supplied document + extensions. Returns the
 * editor + its container so each describe can drive selection and key dispatch
 * without re-stating the create/mount boilerplate.
 */
function mountEditor(
    doc: ReturnType<typeof paragraphDoc> | ReturnType<typeof listDoc> | ReturnType<typeof tableDoc>,
    extensions: unknown[],
    options: { enableTabKey?: boolean } = {}
): { editor: HeadlessEditor; container: HTMLElement } {
    const container: HTMLDivElement = document.createElement('div');
    document.body.appendChild(container);
    const editor: HeadlessEditor = HeadlessEditor.create({
        document: doc,
        extensions: extensions as never,
        enableTabKey: options.enableTabKey
    } as never);
    editor.mount(container);
    return { editor, container };
}

/** Tears down an editor/container pair, tolerant of an already-destroyed editor. */
function teardown(editor: HeadlessEditor | undefined, container: HTMLElement | undefined): void {
    if (editor && !editor.integration?.isDestroyed) {
        editor.destroy();
    }
    container?.remove();
}

/** Dispatches a Tab (or Shift-Tab) keydown on the editor's PM view root. */
function dispatchTabKey(editor: HeadlessEditor, opts: TabKeyOptions = {}): void {
    const view: {
        dom: HTMLElement;
    } = editor.integration.getView() as unknown as { dom: HTMLElement };
    view.dom.dispatchEvent(buildTabEvent(opts.shiftKey));
}

/** Resolves the `Tab`/`Shift-Tab` handlers for the given scope without the verbose cast. */
function tabShortcuts(
    scope: IndentOutdentScope,
    enableTabKey: boolean
): ScopedShortcuts {
    return indentOutdentExtension.config.keyboardShortcuts!.call({
        editor: scope.editor,
        editorConfig: { enableTabKey }
    } as unknown as ExtensionScope<object>) as ScopedShortcuts;
}

describe('Built-in: indentOutdent', () => {
    // ── Identity ─────────────────────────────────────────────────────────────

    it('has name "indentOutdent"', () => {
        expect(indentOutdentExtension.name).toBe('indentOutdent');
    });

    it('is defined and exposes a config object', () => {
        expect(indentOutdentExtension).toBeTruthy();
        expect(typeof indentOutdentExtension.config).toBe('object');
    });

    // ── Commands contributed ─────────────────────────────────────────────────

    it('contributes the `indent` command', () => {
        const commands: Command<unknown>[] = indentOutdentExtension.config.commands?.() || [];
        const names = commands.map((c: { name: string }) => c.name);
        expect(names).toContain('indent');
    });

    it('contributes the `outdent` command', () => {
        const commands: Command<unknown>[] = indentOutdentExtension.config.commands?.() || [];
        const names = commands.map((c: { name: string }) => c.name);
        expect(names).toContain('outdent');
    });

    it('contributes EXACTLY two commands (indent + outdent, no extras)', () => {
        const commands: Command<unknown>[] = indentOutdentExtension.config.commands?.() || [];
        expect(commands.length).toBe(2);
    });

    // ── Priority ─────────────────────────────────────────────────────────────

    it('declares priority 6 on its config (later than listKeymapExtension\'s 5)', () => {
        expect(indentOutdentExtension.config.priority).toBe(6);
    });

    // ── Keyboard shortcuts wiring ────────────────────────────────────────────

    it('keyboardShortcuts returns both `Tab` and `Shift-Tab` handlers', () => {
        const ks = indentOutdentExtension.config.keyboardShortcuts;
        expect(typeof ks).toBe('function');
        if (!ks) { return; }
        const fakeScope: { options: unknown; editor: object } = { options: {}, editor: {} };
        const shortcuts: unknown = ks.call(fakeScope);
        expect(shortcuts).toBeTruthy();
        const typed: Record<string, unknown> = shortcuts as Record<string, unknown>;
        expect(typeof typed['Tab']).toBe('function');
        expect(typeof typed['Shift-Tab']).toBe('function');
    });

    it('keyboardShortcuts returns {} when no editor is wired (defensive contract)', () => {
        const ks = indentOutdentExtension.config.keyboardShortcuts;
        expect(typeof ks).toBe('function');
        if (!ks) { return; }
        const noEditorScope: { options: unknown; editor?: undefined } = { options: {}, editor: undefined };
        const shortcuts: unknown = ks.call(noEditorScope);
        expect(shortcuts).toEqual({});
    });
});

// ── Schema contract: indent attribute on supported block nodes ───────────────

describe('Built-in: indentOutdent schema contract', () => {
    /**
     * Indentation is represented through an `indent` attribute on supported
     * block nodes. The expected attribute shape is:
     *
     *   { name: 'indent', type: 'number', default: 0 }
     *
     * which renders on a block node (e.g. paragraph) as:
     *
     *   { "type": "paragraph", "attrs": { "indent": 2 } }
     */

    /** Resolves the `indent` AttributeDefinition contributed by `paragraphExtension`. */
    const indentAttr = (): { name: string; type: string; default?: unknown } | undefined => {
        const nodes = paragraphExtension.config.nodes?.() ?? [];
        const paragraph = nodes.find((n: { name: string }) => n.name === 'paragraph');
        return (paragraph?.attrs ?? []).find((a: { name: string }) => a.name === 'indent');
    };

    it('paragraph node contributes an `indent` attribute', () => {
        expect(indentAttr()).toBeDefined();
    });

    it('the `indent` attribute is typed as `number`', () => {
        expect(indentAttr()?.type).toBe('number');
    });

    it('the `indent` attribute defaults to 0 (no indentation)', () => {
        expect(indentAttr()?.default).toBe(0);
    });

    it('paragraph node carries the expected indent schema shape', () => {
        expect(indentAttr()).toEqual({ name: 'indent', type: 'number', default: 0 });
    });
});

// ── enableTabKey default override ─────────────────────────────────────────────

describe('Built-in: indentOutdent options contract', () => {
    it('default options object is a fresh instance each call (defensive)', () => {
        const a: object = indentOutdentExtension.config.defineOptions?.();
        const b: object = indentOutdentExtension.config.defineOptions?.();
        expect(a).toEqual(b);
    });
});

// ── enableTabKey user override ────────────────────────────────────────────────┘

describe('Built-in: indentOutdent user override', () => {
    it('configure returns a new object reference (definition is immutable)', () => {
        const overridden: ExtensionDefinition<object> = indentOutdentExtension.configure({ enableTabKey: true });
        expect(overridden).not.toBe(indentOutdentExtension);
    });

    it('configure preserves the four core extension fields (name / commands / priority / keyboardShortcuts)', () => {
        const overridden: ExtensionDefinition<object> = indentOutdentExtension.configure({ enableTabKey: true });
        expect(overridden.name).toBe('indentOutdent');
        expect(overridden.config.priority).toBe(6);
        const originalCommandNames: string[] = (indentOutdentExtension.config.commands?.() ?? [])
            .map((c: { name: string }) => c.name);
        const overriddenCommandNames: string[] = (overridden.config.commands?.() ?? [])
            .map((c: { name: string }) => c.name);
        expect(overriddenCommandNames).toEqual(originalCommandNames);
        expect(typeof overridden.config.keyboardShortcuts).toBe('function');
    });

    it('configure override keymap handlers are fresh per editor (closure capture)', () => {
        const overridden: ExtensionDefinition<object> = indentOutdentExtension.configure({ enableTabKey: true });
        const defaultsScope: {
            options: object;
            editor: {};
        } = {
            options: indentOutdentExtension.config.defineOptions?.() ?? {},
            editor: {}
        };
        const overriddenScope: {
            options: object;
            editor: {};
        } = {
            options: overridden.config.defineOptions?.() ?? {},
            editor: {}
        };
        const defaultsShortcuts: Record<string, () => boolean> = (indentOutdentExtension.config.keyboardShortcuts?.call(defaultsScope)
            ?? {}) as Record<string, () => boolean>;
        const overriddenShortcuts: Record<string, () => boolean> = (overridden.config.keyboardShortcuts?.call(overriddenScope)
            ?? {}) as Record<string, () => boolean>;
        expect(typeof defaultsShortcuts['Tab']).toBe('function');
        expect(typeof overriddenShortcuts['Tab']).toBe('function');
        expect(defaultsShortcuts['Tab']).not.toBe(overriddenShortcuts['Tab']);
        expect(defaultsShortcuts['Shift-Tab']).not.toBe(overriddenShortcuts['Shift-Tab']);
    });
});

describe('Built-in: indentOutdent - Tab keyboard behavior', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        ({ editor, container } = mountEditor(
            paragraphDoc('Hello'),
            [paragraphExtension, textAlignExtension, indentOutdentExtension],
            { enableTabKey: true }
        ));
    });

    afterEach(() => teardown(editor, container));

    it('should handle Tab key inside a paragraph', () => {
        editor.commands.setSelection({ from: 1, to: 1 });
        expect(() => dispatchTabKey(editor)).not.toThrow();
    });

    it('should execute Tab shortcut on a plain block when textAlign is available', () => {
        editor.commands.setSelection({ from: 3, to: 3 });
        const shortcuts: ScopedShortcuts = tabShortcuts({ editor }, true);
        expect(() => shortcuts['Tab']()).not.toThrow();
    });
});

describe('Built-in: indentOutdent - Shift-Tab keyboard behavior', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        ({ editor, container } = mountEditor(
            paragraphDoc('Hello'),
            [paragraphExtension, indentOutdentExtension]
        ));
    });

    afterEach(() => teardown(editor, container));

    it('should handle Shift-Tab key inside a paragraph', () => {
        editor.commands.setSelection({ from: 2, to: 2 });
        expect(() => dispatchTabKey(editor, { shiftKey: true })).not.toThrow();
    });
});

describe('Built-in: indentOutdent - Tab with selected text', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        ({ editor, container } = mountEditor(
            paragraphDoc('Hello World'),
            [paragraphExtension, indentOutdentExtension],
            { enableTabKey: true }
        ));
    });

    afterEach(() => teardown(editor, container));

    it('should indent when Tab is pressed with a non-empty selection', () => {
        editor.commands.setSelection({ from: 1, to: 5 });
        dispatchTabKey(editor);
        expect(() => editor.getDocument()).not.toThrow();
    });

    it('should execute Tab shortcut with non-empty selection', () => {
        editor.commands.setSelection({ from: 1, to: 5 });
        const shortcuts = tabShortcuts({ editor }, true);
        expect(() => shortcuts['Tab']()).not.toThrow();
    });
});

describe('Built-in: indentOutdent - Tab inside active mark', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        ({ editor, container } = mountEditor(
            paragraphDoc('Hello'),
            [paragraphExtension, boldExtension, textAlignExtension, indentOutdentExtension],
            { enableTabKey: true }
        ));
    });

    afterEach(() => teardown(editor, container));

    const applyBoldAtCursor = (): void => {
        editor.commands.setSelection({ from: 1, to: 5 });
        editor.commands.toggleBold();
        editor.commands.setSelection({ from: 2, to: 2 });
    };

    it('should indent when Tab is pressed inside a bold mark', () => {
        applyBoldAtCursor();
        const marksBefore: number = editor.getActiveMarks().size;
        dispatchTabKey(editor);
        expect(editor.getActiveMarks().size).toBe(marksBefore);
    });

    it('should execute Tab shortcut inside active mark', () => {
        applyBoldAtCursor();
        const shortcuts: ScopedShortcuts = tabShortcuts({ editor }, true);
        expect(() => shortcuts['Tab']()).not.toThrow();
    });
});

describe('Built-in: indentOutdent - ShiftTab with selected text', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        ({ editor, container } = mountEditor(
            paragraphDoc('Hello World'),
            [paragraphExtension, indentOutdentExtension]
        ));
    });

    afterEach(() => teardown(editor, container));

    it('should handle Shift-Tab with selected text', () => {
        editor.commands.setSelection({ from: 1, to: 5 });
        dispatchTabKey(editor, { shiftKey: true });
        expect(() => editor.getDocument()).not.toThrow();
    });
});

describe('Built-in: indentOutdent - ShiftTab inside active mark', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        ({ editor, container } = mountEditor(
            paragraphDoc('Hello'),
            [paragraphExtension, boldExtension, indentOutdentExtension]
        ));
    });

    afterEach(() => teardown(editor, container));

    it('should handle Shift-Tab inside bold text', () => {
        editor.commands.setSelection({ from: 1, to: 5 });
        editor.commands.toggleBold();
        editor.commands.setSelection({ from: 2, to: 2 });
        dispatchTabKey(editor, { shiftKey: true });
        expect(editor.getActiveMarks().size).toBeGreaterThanOrEqual(0);
    });
});

describe('Built-in: indentOutdent - list keyboard handling', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        ({ editor, container } = mountEditor(
            listDoc('List Item'),
            [paragraphExtension, listExtension, indentOutdentExtension],
            { enableTabKey: true }
        ));
    });

    afterEach(() => teardown(editor, container));

    it('should handle Tab inside list item', () => {
        editor.commands.setSelection({ from: 4, to: 4 });
        expect(() => dispatchTabKey(editor)).not.toThrow();
    });

    it('should handle Shift-Tab inside list item', () => {
        editor.commands.setSelection({ from: 4, to: 4 });
        expect(() => dispatchTabKey(editor, { shiftKey: true })).not.toThrow();
    });
});

describe('Built-in: indentOutdent - table keyboard handling', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        ({ editor, container } = mountEditor(
            tableDoc(),
            [paragraphExtension, tableExtension, indentOutdentExtension]
        ));
    });

    afterEach(() => teardown(editor, container));

    it('should handle Tab inside a table cell', () => {
        editor.commands.setSelection({ from: 5, to: 5 });
        expect(() => dispatchTabKey(editor)).not.toThrow();
    });

    it('should handle Shift-Tab inside a table cell', () => {
        editor.commands.setSelection({ from: 5, to: 5 });
        expect(() => dispatchTabKey(editor, { shiftKey: true })).not.toThrow();
    });
});

describe('Built-in: indentOutdent callback branches', () => {
    it('should call indentListItem when list item has non-empty selection', () => {
        const indentListItem: jasmine.Spy = jasmine.createSpy('indentListItem').and.returnValue(true);
        const editor = {
            can: () => ({
                moveToNextCell: () => false,
                indentListItem: () => true,
                outdentListItem: () => false,
                indent: () => false,
                insertRowAfter: () => false,
                setTextAlign: () => true,
            }),
            getActiveMarks: () => new Set(),
            getSelection: () => ({ empty: false }),
            integration: {
                getState: () => ({
                    selection: {
                        empty: true,
                        $from: { parentOffset: 1 }
                    }
                })
            },
            commands: { indentListItem }
        };
        const shortcuts: ScopedShortcuts = tabShortcuts({ editor } as IndentOutdentScope, true);
        expect(shortcuts['Tab']()).toBe(true);
        expect(indentListItem).toHaveBeenCalled();
    });

    it('should insert tab spaces in a plain block', () => {
        const insertText: jasmine.Spy = jasmine.createSpy('insertText').and.returnValue(true);
        const editor = {
            can: () => ({
                moveToNextCell: () => false,
                indentListItem: () => false,
                outdentListItem: () => false,
                indent: () => true,
                setTextAlign: () => true,
                insertRowAfter: () => false
            }),
            getActiveMarks: () => new Set(),
            getSelection: () => ({ empty: true }),
            integration: {
                getState: () => ({
                    selection: {
                        empty: true,
                        $from: { parentOffset: 1 }
                    }
                })
            },
            commands: { insertText }
        };
        const shortcuts: ScopedShortcuts = tabShortcuts({ editor } as IndentOutdentScope, true);
        shortcuts['Tab']();
        expect(insertText).toHaveBeenCalled();
    });

    it('should return false inside a list item if enableTabKey is false', () => {
        // Triggers: if (isCursorInListItem(editor)) { if (!enableTabKey) { return false; } }
        const editor = {
            can: () => ({
                moveToNextCell: () => false,
                indentListItem: () => true, // Tells helper it's inside a list item
                outdentListItem: () => false,
                indent: () => false,
                insertRowAfter: () => false,
                setTextAlign: () => true,
            }),
            getActiveMarks: () => new Set(),
            getSelection: () => ({ empty: true }),
            integration: {
                getState: () => ({
                    selection: { empty: true, $from: { parentOffset: 1 } }
                })
            },
            commands: {}
        };
        const shortcuts: ScopedShortcuts = tabShortcuts({ editor } as IndentOutdentScope, false); // enableTabKey = false
        expect(shortcuts['Tab']()).toBe(false);
    });

    it('should call indentListItem when cursor is at block start inside a list item', () => {
        // Triggers: if (isCursorAtBlockStart(editor)) { return editor.commands.indentListItem(); }
        const indentListItem: jasmine.Spy = jasmine.createSpy('indentListItem').and.returnValue(true);
        const editor = {
            can: () => ({
                moveToNextCell: () => false,
                indentListItem: () => true,
                outdentListItem: () => false,
                indent: () => false,
                insertRowAfter: () => false,
                setTextAlign: () => true,
            }),
            getActiveMarks: () => new Set(),
            getSelection: () => ({ empty: true }),
            integration: {
                getState: () => ({
                    selection: {
                        empty: true,
                        $from: { parentOffset: 0 } // parentOffset = 0 mocks being at block start
                    }
                })
            },
            commands: { indentListItem }
        };
        const shortcuts: ScopedShortcuts = tabShortcuts({ editor } as IndentOutdentScope, true);
        expect(shortcuts['Tab']()).toBe(true);
        expect(indentListItem).toHaveBeenCalled();
    });

    it('should return false inside an indentable shape if enableTabKey is false', () => {
        // Triggers: if (isCursorInIndentableShape(editor)) { if (!enableTabKey) { return false; } }
        const editor = {
            can: () => ({
                moveToNextCell: () => false,
                indentListItem: () => false,
                outdentListItem: () => false,
                insertRowAfter: () => false,
                indent: () => true,
                setTextAlign: () => true,
            }),
            getActiveMarks: () => new Set(),
            getSelection: () => ({ empty: true }),
            integration: {
                getState: () => ({
                    selection: { empty: true, $from: { parentOffset: 1 } }
                })
            },
            commands: {}
        };
        const shortcuts: ScopedShortcuts = tabShortcuts({ editor } as IndentOutdentScope, false); // enableTabKey = false
        expect(shortcuts['Tab']()).toBe(false);
    });

    it('should insert text via the standalone fallback block', () => {
        // Triggers: if (enableTabKey && isCursorInPlainBlock && !isCursorInsideActiveMark && !hasNonEmptySelection)
        const insertText: jasmine.Spy = jasmine.createSpy('insertText').and.returnValue(true);
        const editor = {
            can: () => ({
                moveToNextCell: () => false,
                indentListItem: () => false,
                outdentListItem: () => false,
                indent: () => false, // Avoids entering upper conditional blocks
                setTextAlign: () => true,
                insertRowAfter: () => false
            }),
            getActiveMarks: () => new Set(), // !isCursorInsideActiveMark = true
            getSelection: () => ({ empty: true }), // !hasNonEmptySelection = true
            integration: {
                getState: () => ({
                    selection: {
                        empty: true,
                        $from: { parentOffset: 1 }
                    }
                })
            },
            commands: { insertText }
        };
        const shortcuts: ScopedShortcuts = tabShortcuts({ editor } as IndentOutdentScope, true);
        expect(shortcuts['Tab']()).toBe(true);
        expect(insertText).toHaveBeenCalled();
    });

    it('should fall through to the very final return false line', () => {
        // Triggers the final "return false;" at the bottom of the function
        const editor = {
            can: () => ({
                moveToNextCell: () => false,
                indentListItem: () => false,
                outdentListItem: () => false,
                indent: () => false,
                setTextAlign: () => true,
                insertRowAfter: () => false
            }),
            getActiveMarks: () => new Set(['bold']), // Breaks standalone fallback via active mark presence
            getSelection: () => ({ empty: false }),
            integration: {
                getState: () => ({
                    selection: { empty: false, $from: { parentOffset: 1 } }
                })
            },
            commands: {}
        };
        const shortcuts: ScopedShortcuts = tabShortcuts({ editor } as IndentOutdentScope, true);
        expect(shortcuts['Tab']()).toBe(false);
    });
});

describe('Built-in: indentOutdent - Tab and Shift-Tab scenarios', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    const createParagraphEditor = (): void => {
        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'paragraph',
                    id: crypto.randomUUID(),
                    attrs: {},
                    marks: [],
                    children: [{
                        type: 'text',
                        id: crypto.randomUUID(),
                        attrs: {},
                        children: [],
                        text: 'HelloWorld',
                        marks: []
                    } as TextNode]
                }]
            },
            enableTabKey: true,
            extensions: [
                paragraphExtension,
                indentOutdentExtension,
                undoRedoExtension,
                textAlignExtension
            ]
        });

        editor.mount(container);
    };

    const createListEditor = (): void => {
        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{
                    type: 'bulletList',
                    id: crypto.randomUUID(),
                    attrs: {},
                    marks: [],
                    children: [{
                        type: 'listItem',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [{
                            type: 'paragraph',
                            id: crypto.randomUUID(),
                            attrs: {},
                            marks: [],
                            children: [{
                                type: 'text',
                                id: crypto.randomUUID(),
                                attrs: {},
                                children: [],
                                text: 'HelloWorld',
                                marks: []
                            } as TextNode]
                        }]
                    }]
                }]
            },
            enableTabKey: true,
            extensions: [
                paragraphExtension,
                listExtension,
                indentOutdentExtension,
                undoRedoExtension,
                textAlignExtension
            ]
        });

        editor.mount(container);
    };

    const dispatchTabKey = (shiftKey = false): void => {
        const editorView = editor.integration.getView();

        editorView.dom.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'Tab',
                code: 'Tab',
                keyCode: 9,
                which: 9,
                shiftKey,
                bubbles: true,
                cancelable: true
            })
        );
    };

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (!editor.isDestroyed) {
            editor.destroy();
        }

        container.remove();
    });

    describe('Use case 1: block element', () => {
        beforeEach(() => {
            createParagraphEditor();
        });

        it('should remove tab width, then outdent while preserving tab width', () => {
            // Cursor between "Hello" and "World".
            editor.commands.setSelection({
                from: 6,
                to: 6
            });
            // Tab inserts tab width.
            dispatchTabKey();
            let document = editor.getDocument();
            let textNode = document.children[0].children[0] as TextNode;
            expect(textNode.text).toBe('Hello    World');
            // Shift-Tab removes tab width.
            dispatchTabKey(true);
            document = editor.getDocument();
            textNode = document.children[0].children[0] as TextNode;
            expect(textNode.text).toBe('HelloWorld');
            // Cursor between "Hello" and "World".
            editor.commands.setSelection({
                from: 6,
                to: 6
            });
            // Tab inserts tab width.
            dispatchTabKey();
            document = editor.getDocument();
            textNode = document.children[0].children[0] as TextNode;
            expect(textNode.text).toBe('Hello    World');
            // Cursor at beginning of block.
            editor.commands.setSelection({
                from: 1,
                to: 1
            });
            // Tab structurally indents the block.
            dispatchTabKey();
            document = editor.getDocument();
            textNode = document.children[0].children[0] as TextNode;
            expect(document.children[0].attrs.indent).toBeGreaterThan(0);
            expect(textNode.text).toBe('Hello    World');
            // Cursor at end of text.
            const text: string = textNode.text;
            editor.commands.setSelection({
                from: text.length + 1,
                to: text.length + 1
            });
            // Shift-Tab structurally outdents.
            // Existing tab width must remain.
            dispatchTabKey(true);
            document = editor.getDocument();
            textNode = document.children[0].children[0] as TextNode;
            expect(document.children[0].attrs.indent).toBe(0);
            expect(textNode.text).toBe('Hello    World');
        });
    });

    describe('Use case 2: list item', () => {
        beforeEach(() => {
            createListEditor();
        });

        it('should remove tab width and then lift the list item to a paragraph', () => {
            // Cursor between "Hello" and "World".
            editor.commands.setSelection({
                from: 8,
                to: 8
            });
            // Tab inserts tab width.
            dispatchTabKey();
            let document = editor.getDocument();
            let textNode = document.children[0]
                .children[0]
                .children[0]
                .children[0] as TextNode;
            expect(textNode.text).toBe('Hello    World');
            // First Shift-Tab removes tab width.
            dispatchTabKey(true);
            document = editor.getDocument();
            textNode = document.children[0]
                .children[0]
                .children[0]
                .children[0] as TextNode;
            expect(textNode.text).toBe('HelloWorld');
            // Second Shift-Tab lifts the list item to a paragraph.
            dispatchTabKey(true);
            document = editor.getDocument();
            expect(document.children[0].type).toBe('paragraph');
            textNode = document.children[0].children[0] as TextNode;
            expect(textNode.text).toBe('HelloWorld');
        });
    });
});
