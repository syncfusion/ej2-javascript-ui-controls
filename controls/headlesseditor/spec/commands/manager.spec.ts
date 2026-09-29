/**
 * spec/commands/manager.spec.ts
 *
 * Unit tests for Tasks 4.4–4.7: CommandManager behaviour.
 * Uses a real IntegrationManager (no DOM — headless only).
 */
import { CommandManager } from '../../src/commands/manager';
import { CommandRegistry } from '../../src/commands/registry';
import { Command, CommandContext, UnknownCommandError } from '../../src/commands/types';
import { IntegrationManager } from '../../src/pm/integration/integration-manager';
import { PMSchemaAdapter } from '../../src/pm/adapters/pm-schema-adapter';
import { DefaultDOMSpecRegistry } from '../../src/pm/dom/dom-spec-registry';
import { DocumentMapper } from '../../src/pm/adapters/document-mapper';
import { wrapTransaction } from '../../src/pm/adapters/editor-state-adapter';
import { builtInNodeDefs } from '../fixtures/built-in-nodedefs';
import { builtInMarkDefs } from '../fixtures/built-in-markdefs';
import { emptyDoc } from '../fixtures/sample-documents';
import { DiagnosticsService } from '../../src/diagnostics/index';
// ── Test setup ────────────────────────────────────────────────────────────────

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

function makeDispatchingCommand(name: string): Command<void> {
    return {
        name,
        meta: { category: 'formatting' },
        execute(ctx: CommandContext, _payload: void): boolean {
            // Build a simple insert-text transaction via the editorState reference.
            // We reach into im.getState() via the test-scope closure to build a
            // real PM transaction, then wrap it.
            const pmState = im.getState();
            const tr = pmState.tr.insertText('x', 1);
            ctx.dispatch(wrapTransaction(tr));
            return true;
        }
    };
}

let im: IntegrationManager;
let registry: CommandRegistry;
let manager: CommandManager;

beforeEach(() => {
    im = buildIntegration();
    registry = new CommandRegistry();
    manager = new CommandManager(registry, im);
});

afterEach(() => {
    if (!im.isDestroyed) { im.destroy(); }
});

// ── Task 4.4 — execute('unknownCommand') throws ───────────────────────────────

describe('CommandManager.execute()', () => {
    it('throws UnknownCommandError for an unregistered command', () => {
        expect(() => manager.execute('unknownCommand')).toThrowError(UnknownCommandError);
    });
});

// ── Task 4.5 — canExecute('unknownCommand') returns false without throwing ────

describe('CommandManager.canExecute()', () => {
    it('returns false (no throw) for an unregistered command', () => {
        expect(() => manager.canExecute('unknownCommand')).not.toThrow();
        expect(manager.canExecute('unknownCommand')).toBe(false);
    });
});

// ── Task 4.7 — canExecute never calls IntegrationManager.dispatch() ──────────

describe('CommandManager.canExecute() — no dispatch', () => {
    it('never calls IntegrationManager.dispatch() regardless of result', () => {
        const dispatchSpy = spyOn(im, 'dispatch').and.callThrough();

        const cmd = makeDispatchingCommand('neverDispatchOnDryRun');
        registry.register(cmd, 'builtin');
        manager.canExecute('neverDispatchOnDryRun');

        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('returns false when canExecute guard returns false', () => {
        const blockedCmd: Command<void> = {
            name: 'blocked',
            canExecute(): boolean { return false; },
            execute(_ctx: CommandContext, _payload: void): boolean { return false; }
        };
        registry.register(blockedCmd, 'builtin');
        expect(manager.canExecute('blocked')).toBe(false);
    });

    it('returns true when command would dispatch (dry-run dispatch is tracked but not applied)', () => {
        const cmd = makeDispatchingCommand('wouldDispatch');
        registry.register(cmd, 'builtin');
        // In dry-run: the context dispatch is a no-op but still tracked.
        // The executor detects that dispatch() was called → returns true.
        // IntegrationManager.dispatch() is never called (verified by spy above).
        expect(manager.canExecute('wouldDispatch')).toBe(true);
    });
});
