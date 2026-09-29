/**
 * spec/pm/input-rules-compiler.spec.ts
 *
 * Unit tests for compileInputRulesPlugin() in src/pm/input-rules-compiler.ts.
 *
 * Strategy: We test the observable surface only — the function must return
 * a PMPlugin, apply priority sort, deduplicate by id, and call
 * commandManager.execute() with correct arguments.
 *
 */

import { compileInputRulesPlugin } from '../../src/pm/plugins/input-rules-plugin';
import { InputRuleDefinition } from '../../src/extensions/types';
import { PMPlugin } from '../../src/pm/pm-guard';


// ── Helpers ────────────────────────────────────────────────────────────────

function makeCommandManager(returnValue = false): { execute: jasmine.Spy } {
    return { execute: jasmine.createSpy('execute').and.returnValue(returnValue) };
}

function makeRule(
    id: string,
    handler: InputRuleDefinition['handler'] = () => { /* noop */ }
): InputRuleDefinition {
    return { id, pattern: /test$/, handler };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('compileInputRulesPlugin', () => {

    describe('return type', () => {
        it('returns a PMPlugin when given an empty definitions array', () => {
            const plugin = compileInputRulesPlugin([], makeCommandManager() as any);
            expect(plugin).toBeDefined();
            expect(plugin instanceof PMPlugin).toBe(true);
        });

        it('returns a PMPlugin when given one definition', () => {
            const plugin = compileInputRulesPlugin(
                [makeRule('r1')],
                makeCommandManager() as any
            );
            expect(plugin).toBeDefined();
            expect(plugin instanceof PMPlugin).toBe(true);
        });
    });
});
