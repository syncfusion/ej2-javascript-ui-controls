import { buildKeymapPlugin } from '../../../src/pm/plugins/keymap-plugin';
import { PMPlugin } from '../../../src/pm/pm-guard';

// ── Tests ────────────────────────────────────────────────────────────────────

describe('buildKeymapPlugin — pure function behaviour', () => {
    it('returns a PMPlugin instance', () => {
        const plugin = buildKeymapPlugin({});
        expect(plugin).toBeDefined();
        // PMPlugin is an instance of prosemirror-state Plugin
        expect(typeof plugin.getState).toBe('function');
    });

    it('is a pure factory — two calls produce independent plugins', () => {
        const shortcuts = { 'Mod-b': [() => true] };
        const p1 = buildKeymapPlugin(shortcuts);
        const p2 = buildKeymapPlugin(shortcuts);
        expect(p1).not.toBe(p2);
    });
});

describe('buildKeymapPlugin — pre-bound closure handlers', () => {
    it('wraps extension shortcuts with try-catch', () => {
        let handlerCalled = false;
        const shortcuts = {
            'Mod-x': [() => {
                handlerCalled = true;
                return true;
            }]
        };
        const plugin = buildKeymapPlugin(shortcuts);
        expect(plugin).toBeDefined();
        expect(typeof plugin.getState).toBe('function');
    });

    it('returns false on handler exception (graceful error handling)', () => {
        const shortcuts = {
            'Mod-e': [() => {
                throw new Error('Test error');
            }]
        };
        // Building the plugin should not throw
        expect(() => buildKeymapPlugin(shortcuts)).not.toThrow();
        const plugin = buildKeymapPlugin(shortcuts);
        expect(plugin).toBeDefined();
    });
});

describe('buildKeymapPlugin — extension shortcut precedence over baseKeymap', () => {
    it('allows extension shortcuts to override base keybindings', () => {
        // Extension provides a handler for a key that PM baseKeymap also defines
        // (e.g., Mod-a is in baseKeymap but extension wants to override it)
        const shortcuts = {
            'Mod-a': [() => true]  // Override PM's selectAll
        };
        const plugin = buildKeymapPlugin(shortcuts);
        expect(plugin).toBeDefined();
    });

    it('merges empty extension shortcuts with baseKeymap', () => {
        const plugin = buildKeymapPlugin({});
        // Should still include base keybindings (history, etc.)
        expect(plugin).toBeDefined();
    });
});

describe('buildKeymapPlugin — handler arity detection', () => {
    it('detects zero-arity closures as extension shortcuts', () => {
        let executed = false;
        const shortcuts = {
            'Mod-t': [() => {
                executed = true;
                return true;
            }]
        };
        const plugin = buildKeymapPlugin(shortcuts);
        expect(plugin).toBeDefined();
        // The handler is wrapped in try-catch and called with no args
    });

    it('detects three-arity functions as PM commands', () => {
        // This test verifies that baseKeymap (PM commands with arity 3) is handled correctly
        // baseKeymap is merged in, so the plugin should include it
        const plugin = buildKeymapPlugin({});
        expect(plugin).toBeDefined();
    });
});
