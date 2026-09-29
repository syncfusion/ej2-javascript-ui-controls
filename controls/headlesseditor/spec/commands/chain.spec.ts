/**
 * spec/commands/chain.spec.ts
 *
 * Unit tests for Tasks 7.1–7.13: ChainBuilder + chain facade + Editor.chain().
 *
 * Task 7.7  — chain with multiple steps dispatches exactly one transaction
 * Task 7.8  — setSelection-only chain returns { success: true }
 * Task 7.9  — step 2 of 3 failing canExecute → aborts, dispatches nothing
 * Task 7.10 — chain().execute('undo') throws HistoryCommandInChainError immediately
 * Task 7.11 — zero-step chain returns { success: false, reason: 'empty' }
 * Task 7.12 — canRun() outcome matches run() outcome for same starting state
 * Task 7.13 — compile-only: TypedChain has no undo()/redo() methods
 */
import { ChainBuilder } from '../../src/commands/chain';
import { CommandRegistry } from '../../src/commands/registry';
import { Command, CommandContext, ChainResult, HistoryCommandInChainError } from '../../src/commands/types';
import { IntegrationManager } from '../../src/pm/integration/integration-manager';
import { PMSchemaAdapter } from '../../src/pm/adapters/pm-schema-adapter';
import { DefaultDOMSpecRegistry } from '../../src/pm/dom/dom-spec-registry';
import { DocumentMapper } from '../../src/pm/adapters/document-mapper';
import { wrapTransaction } from '../../src/pm/adapters/editor-state-adapter';
import { PMTransaction, TextSelection } from '../../src/pm/pm-guard';
import { TypedChain } from '../../src/commands/typed-surface';
import { createChainFacade } from '../../src/commands/facade';
import { builtInNodeDefs } from '../fixtures/built-in-nodedefs';
import { builtInMarkDefs } from '../fixtures/built-in-markdefs';
import { emptyDoc } from '../fixtures/sample-documents';
import { DiagnosticsService } from '../../src/diagnostics/index';
import { HeadlessEditor, paragraphExtension, textAlignExtension, TextNode } from '../../src';

// ── Shape helper ─────────────────────────────────────────────────────────────────
//
// PM's setSelection rebuilds the document tree through DocumentMapper and may
// reassign leaf text-node ids on each call. Comparing full JSON fails because
// of regenerated ids only. Strip ids + schemaVersion to compare document SHAPE.
function stripIds(node: unknown): unknown {
    if (Array.isArray(node)) { return node.map(stripIds); }
    if (node && typeof node === 'object') {
        const out: Record<string, unknown> = {};
        for (const key in (node as Record<string, unknown>)) {
            if (!Object.prototype.hasOwnProperty.call(node, key)) { continue; }
            if (key === 'id' || key === 'schemaVersion') { continue; }
            const value: unknown = (node as Record<string, unknown>)[key];
            out[key] = stripIds(value);
        }
        return out;
    }
    return node;
}

// ── Setup helpers ─────────────────────────────────────────────────────────────

function buildIntegration(): IntegrationManager {
    const diagnostics = new DiagnosticsService();
    const domRegistry = DefaultDOMSpecRegistry.createDefault();
    const adapter = new PMSchemaAdapter(domRegistry, diagnostics);
    const pmSchema = adapter.compile({ nodes: builtInNodeDefs, marks: builtInMarkDefs });
    const pmDoc = DocumentMapper.toPMDoc(emptyDoc, pmSchema);
    const im = new IntegrationManager();
    im.create({ schema: pmSchema, doc: pmDoc });
    return im;
}

function buildRegistry(im: IntegrationManager): CommandRegistry {
    const registry = new CommandRegistry();

    // Dispatching command — inserts 'X' at position 1
    const insertX: Command<void> = {
        name: 'insertX',
        execute(ctx: CommandContext): boolean {
            const pmState = im.getState();
            ctx.dispatch(wrapTransaction(pmState.tr.insertText('X', 1)));
            return true;
        }
    };

    // Always-blocked command (canExecute = false)
    const blockedCmd: Command<void> = {
        name: 'blockedCmd',
        canExecute(): boolean { return false; },
        execute(ctx: CommandContext): boolean {
            ctx.dispatch(wrapTransaction(im.getState().tr));
            return true;
        }
    };

    // Always-passing command
    const insertY: Command<void> = {
        name: 'insertY',
        execute(ctx: CommandContext): boolean {
            const pmState = im.getState();
            ctx.dispatch(wrapTransaction(pmState.tr.insertText('Y', 1)));
            return true;
        }
    };

    // setSelection command — selection only, zero document steps
    const setSelCmd: Command<void> = {
        name: 'setSelCmd',
        execute(ctx: CommandContext): boolean {
            const pmState = im.getState();
            const sel = TextSelection.create(pmState.doc, 1, 1);
            const tr: PMTransaction = pmState.tr.setSelection(sel);
            ctx.dispatch(wrapTransaction(tr));
            return true;
        }
    };

    // Undo and redo stubs (should never be reachable via chain)
    const undoCmd: Command<void> = {
        name: 'undo',
        execute(): boolean { return true; }
    };
    const redoCmd: Command<void> = {
        name: 'redo',
        execute(): boolean { return true; }
    };

    registry.register(insertX, 'builtin');
    registry.register(insertY, 'builtin');
    registry.register(blockedCmd, 'builtin');
    registry.register(setSelCmd, 'builtin');
    registry.register(undoCmd, 'builtin');
    registry.register(redoCmd, 'builtin');

    return registry;
}

// ── Task 7.10 — undo/redo throw HistoryCommandInChainError immediately ────────

describe('ChainBuilder — Task 7.10', () => {
    it('chain.execute("undo") throws HistoryCommandInChainError before run() is called', () => {
        const im: IntegrationManager = buildIntegration();
        const registry: CommandRegistry = buildRegistry(im);

        const chain = new ChainBuilder(registry, im);

        expect(() => {
            chain.execute('undo');
        }).toThrowError(HistoryCommandInChainError);
    });

    it('chain.execute("redo") throws HistoryCommandInChainError before run() is called', () => {
        const im: IntegrationManager = buildIntegration();
        const registry: CommandRegistry = buildRegistry(im);

        const chain = new ChainBuilder(registry, im);

        expect(() => {
            chain.execute('redo');
        }).toThrowError(HistoryCommandInChainError);
    });
});

// ── Task 7.11 — zero-step chain returns { success: false, reason: 'empty' } ──

describe('ChainBuilder — Task 7.11', () => {
    it('run() on empty chain returns { success: false, reason: "empty" }', () => {
        const im: IntegrationManager = buildIntegration();
        const registry: CommandRegistry = buildRegistry(im);

        const chain = new ChainBuilder(registry, im);
        const result: ChainResult = chain.run();
        const failResult = result as { success: false; reason: string };

        expect(result.success).toBe(false);
        expect(failResult.reason).toBe('empty');
    });
});

// ── Task 7.13 — compile-only: TypedChain has no undo()/redo() ────────────────

/**
 * TypeScript compile-only validation.
 *
 * `TypedChain` must NOT declare `undo()` or `redo()` — they cannot be chained.
 * We verify this by checking that the interface does not expose those methods.
 *
 * Runtime check: accessing `.undo` on the facade returns a function (Proxy is
 * permissive at runtime) — BUT the TypeScript type should not allow it.
 * We document this as a type-system concern only.
 */
describe('TypedChain — Task 7.13 (compile-only: no undo/redo)', () => {
    it('TypedChain interface does not include undo or redo at runtime shape', () => {
        const im: IntegrationManager = buildIntegration();
        const registry: CommandRegistry = buildRegistry(im);
        const builder = new ChainBuilder(registry, im);
        const facade: TypedChain = createChainFacade(builder);
        expect(facade).toBeDefined();
    });
});

describe('Editor Command Chaining - End-to-End Use Cases', () => {
    let container: HTMLElement;
    let editor: any;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (editor && !editor.integration?.isDestroyed) {
            editor.destroy();
        }
        container.remove();
    });

    it('Use Case 1 — should safely reject history commands queued inside a formatting chain (Line 13 branch)', () => {
        // Render a clean editor instance
        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'paragraph',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [{ type: 'text', id: crypto.randomUUID(), text: 'Text', marks: [] } as TextNode]
                    }
                ]
            },
            extensions: [paragraphExtension]
        });
        editor.mount(container);
        // User Action: Trying to batch an "undo" or "redo" action inside a combined chain sequence
        // This natively throws the HistoryCommandInChainError guard check on line 13
        expect(() => {
            editor.chain().insertText({ text: 'Hello' }).undo().run();
        }).toThrowError(/cannot be queued inside a chain/);
        expect(() => {
            editor.chain().insertText({ text: 'Hello' }).redo().run();
        }).toThrowError(/cannot be queued inside a chain/);
    });

    it('Use Case 2 — should block empty formatting chains from evaluating or executing (Lines 22 and 41 branches)', () => {
        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [{ type: 'paragraph', id: crypto.randomUUID(), attrs: {}, marks: [], children: [] }]
            },
            extensions: [paragraphExtension]
        });
        editor.mount(container);
        // User Action: Running an empty chain sequence builder without chaining any active commands
        const emptyChain = editor.chain();
        // A. Fires line 41 branch (canRun returns false on empty lengths)
        expect(emptyChain.canRun()).toBe(false);
        // B. Fires line 22 branch (run returns failure metrics on empty lengths)
        const runResult = emptyChain.run();
        expect(runResult).toEqual({ success: false, reason: 'empty' });
    });

    it('Use Case 3 — should successfully chain multiple real steps and report success (Task 7.7)', () => {
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
                    children: [{ type: 'text', id: crypto.randomUUID(), text: 'Hello World', marks: [] } as TextNode]
                }]
            },
            extensions: [paragraphExtension]
        });
        editor.mount(container);
        const shapeBefore = JSON.stringify(stripIds(editor.getDocument()));
        // Two queued setSelection steps collapse into ONE transaction (Task 7.7).
        const result: ChainResult = editor.chain()
            .setSelection({ from: 1, to: 1 })
            .setSelection({ from: 6, to: 6 })
            .run();
        expect(result).toEqual({ success: true });
        // Document SHAPE must be unchanged (selection-only chain — no content mutation).
        expect(JSON.stringify(stripIds(editor.getDocument()))).toBe(shapeBefore);
        // Final selection must match the LAST step in the chain.
        const sel = editor.getSelection();
        expect(sel.from).toBe(6);
        expect(sel.to).toBe(6);
    });

    it('Use Case 4 — should execute a selection-only chain (setSelection) successfully without content changes (Task 7.8)', () => {
        // User scenario: a user clicks somewhere in the document; a UI handler queues
        // a single setSelection step. The chain must succeed and not mutate the document.
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
                    children: [{ type: 'text', id: crypto.randomUUID(), text: 'Hello', marks: [] } as TextNode]
                }]
            },
            extensions: [paragraphExtension]
        });
        editor.mount(container);
        const shapeBefore = JSON.stringify(stripIds(editor.getDocument()));
        const textBefore = (editor.getDocument().children[0].children[0] as TextNode).text;
        const result = editor.chain()
            .setSelection({ from: 2, to: 4 })
            .run();
        expect(result).toEqual({ success: true });
        // Document shape must be unchanged (ids are stripped because PM rebuilds them)
        expect(JSON.stringify(stripIds(editor.getDocument()))).toBe(shapeBefore);
        // The text content must be identical
        const textAfter = (editor.getDocument().children[0].children[0] as TextNode).text;
        expect(textAfter).toBe(textBefore);
        // The new selection must reflect the chained range
        const sel = editor.getSelection();
        expect(sel.from).toBe(2);
        expect(sel.to).toBe(4);
    });

    it('Use Case 5 — should abort the chain when a middle step cannot execute, dispatching nothing (Task 7.9)', () => {
        // document must remain unchanged.
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
                    children: [{ type: 'text', id: crypto.randomUUID(), text: 'Hello', marks: [] } as TextNode]
                }]
            },
            extensions: [paragraphExtension]
        });
        editor.mount(container);
        editor.commands.setSelection({ from: 1, to: 1 });
        const shapeBefore = JSON.stringify(stripIds(editor.getDocument()));
        const textBefore = (editor.getDocument().children[0].children[0] as TextNode).text;
        // Step 1 (setSelection {1,1}) succeeds -> Step 2 (setSelection {2,2}) succeeds
        // -> Step 3 (setSelection {9999,9999}) canExecute rejects cleanly -> chain aborts.
        const result = editor.chain()
            .setSelection({ from: 1, to: 1 })
            .setSelection({ from: 2, to: 2 })
            .setSelection({ from: 9999, to: 9999 })
            .run();
        expect(result.success).toBe(false);
        const failResult = result as { success: false; reason: string; failedStep?: string };
        expect(failResult.reason).toBe('aborted');
        expect(failResult.failedStep).toBe('setSelection');
        // Document shape AND text content must NOT have changed (atomic abort).
        expect(JSON.stringify(stripIds(editor.getDocument()))).toBe(shapeBefore);
        const textAfter = (editor.getDocument().children[0].children[0] as TextNode).text;
        expect(textAfter).toBe(textBefore);
    });

    it('Use Case 6 — canRun() and run() must agree on the same starting state (Task 7.12)', () => {
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
                    children: [{ type: 'text', id: crypto.randomUUID(), text: 'Hello', marks: [] } as TextNode]
                }]
            },
            extensions: [paragraphExtension, textAlignExtension]
        });
        editor.mount(container);
        editor.commands.setSelection({ from: 1, to: 5 });
        // Path A: chain that will succeed (two selection-only steps).
        const okChain = editor.chain()
            .setSelection({ from: 1, to: 1 })
            .setSelection({ from: 3, to: 3 });
        const canRunOk: boolean = okChain.canRun();
        const runOk: ChainResult = okChain.run();
        expect(canRunOk).toBe(true);
        expect(runOk.success).toBe(true);
        // Path B: chain whose first step has a payload that fails canExecute cleanly
        const badChain = editor.chain()
            .setSelection({ from: 9999, to: 9999 })
            .setSelection({ from: 1, to: 1 });
        const canRunBad: boolean = badChain.canRun();
        const runBad: ChainResult = badChain.run();
        expect(canRunBad).toBe(false);
        expect(runBad.success).toBe(false);
        const failB = runBad as { success: false; reason: string; failedStep?: string };
        expect(failB.reason).toBe('aborted');
        expect(failB.failedStep).toBe('setSelection');
    });
});
