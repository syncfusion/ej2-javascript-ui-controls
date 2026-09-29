/**
 * spec/commands/registry.spec.ts
 *
 * Unit tests for Tasks 2.3–2.6: CommandRegistry behaviour.
 */
import { CommandRegistry, CommandRegistration } from '../../src/commands/registry';
import { Command, CommandContext, UnknownCommandError, DuplicateCommandError } from '../../src/commands/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeCommand(name: string, category?: string): Command<void> {
    return {
        name,
        meta: category ? { category } : undefined,
        execute(_ctx: CommandContext, _payload: void): boolean {
            return false;
        }
    };
}

// ── Task 2.3 — DuplicateCommandError on re-registration ───────────────────────

describe('CommandRegistry.register()', () => {
    it('throws DuplicateCommandError when registering the same name twice', () => {
        const registry = new CommandRegistry();
        const cmd = makeCommand('toggleBold', 'formatting');
        registry.register(cmd, 'builtin');
        expect(() => registry.register(cmd, 'builtin')).toThrowError(DuplicateCommandError);
    });

    it('allows registering commands with different names', () => {
        const registry = new CommandRegistry();
        registry.register(makeCommand('toggleBold'), 'builtin');
        registry.register(makeCommand('toggleItalic'), 'builtin');
        expect(registry.getAll().length).toBe(2);
    });
});

// ── Task 2.4 — get() throws; has() returns false ──────────────────────────────

describe('CommandRegistry.get() and has()', () => {
    it('get("unknown") throws UnknownCommandError', () => {
        const registry = new CommandRegistry();
        expect(() => registry.get('unknown')).toThrowError(UnknownCommandError);
    });

    it('has("unknown") returns false without throwing', () => {
        const registry = new CommandRegistry();
        expect(() => registry.has('unknown')).not.toThrow();
        expect(registry.has('unknown')).toBe(false);
    });

    it('get() returns the registration after it has been registered', () => {
        const registry = new CommandRegistry();
        const cmd = makeCommand('insertText', 'content');
        registry.register(cmd, 'builtin');
        const reg: CommandRegistration = registry.get('insertText');
        expect(reg.command.name).toBe('insertText');
        expect(reg.source).toBe('builtin');
    });

    it('has() returns true after registration', () => {
        const registry = new CommandRegistry();
        registry.register(makeCommand('selectAll'), 'builtin');
        expect(registry.has('selectAll')).toBe(true);
    });
});

// ── Task 2.5 — getByCategory() ────────────────────────────────────────────────

describe('CommandRegistry.getByCategory()', () => {
    it('returns only registrations whose command.meta.category matches', () => {
        const registry = new CommandRegistry();
        registry.register(makeCommand('toggleBold', 'formatting'), 'builtin');
        registry.register(makeCommand('toggleItalic', 'formatting'), 'builtin');
        registry.register(makeCommand('insertTable', 'table'), 'builtin');
        registry.register(makeCommand('noMeta'), 'builtin');

        const formatting: CommandRegistration[] = registry.getByCategory('formatting');
        expect(formatting.length).toBe(2);
        expect(formatting.every((r) => r.command.meta?.category === 'formatting')).toBe(true);
    });

    it('returns empty array when no commands match the category', () => {
        const registry = new CommandRegistry();
        registry.register(makeCommand('toggleBold', 'formatting'), 'builtin');
        expect(registry.getByCategory('history').length).toBe(0);
    });
});

// ── Task 2.6 — getByExtension() ───────────────────────────────────────────────

describe('CommandRegistry.getByExtension()', () => {
    it('returns only registrations with matching extensionName', () => {
        const registry = new CommandRegistry();
        registry.register(makeCommand('builtinCmd'), 'builtin');
        registry.register(makeCommand('extCmd1'), 'extension', 'my-ext');
        registry.register(makeCommand('extCmd2'), 'extension', 'my-ext');
        registry.register(makeCommand('otherExtCmd'), 'extension', 'other-ext');

        const results: CommandRegistration[] = registry.getByExtension('my-ext');
        expect(results.length).toBe(2);
        expect(results.every((r) => r.extensionName === 'my-ext')).toBe(true);
    });

    it('returns empty array when no commands match the extensionName', () => {
        const registry = new CommandRegistry();
        registry.register(makeCommand('cmd'), 'builtin');
        expect(registry.getByExtension('missing-ext').length).toBe(0);
    });
});

// ── getAll() ──────────────────────────────────────────────────────────────────

describe('CommandRegistry.getAll()', () => {
    it('returns all registered commands', () => {
        const registry = new CommandRegistry();
        registry.register(makeCommand('a'), 'builtin');
        registry.register(makeCommand('b'), 'builtin');
        registry.register(makeCommand('c'), 'extension', 'ext');
        expect(registry.getAll().length).toBe(3);
    });

    it('returns empty array when nothing is registered', () => {
        const registry = new CommandRegistry();
        expect(registry.getAll().length).toBe(0);
    });
});
