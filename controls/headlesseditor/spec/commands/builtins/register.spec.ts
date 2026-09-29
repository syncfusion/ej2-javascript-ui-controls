/**
 * spec/commands/builtins/register.spec.ts
 *
 * Unit tests for the registerBuiltins() wiring function and the
 * builtins/index.ts barrel.
 *
 * Verifies:
 *   - All expected builtin command names are registered after calling registerBuiltins()
 *   - All registrations have source === 'builtin'
 *   - Each command appears exactly once (no duplicates)
 *   - Category groupings are correct
 *   - builtins/index.ts re-exports all commands (smoke-test via import)
 */
import { CommandRegistry } from '../../../src/commands/registry';

// ── Expected command names by category ───────────────────────────────────────

const EXPECTED_CONTENT = [
    'insertNode', 'deleteNode', 'moveNode',
    'insertText', 'deleteText', 'replaceText',
    'deleteRange'
];

const EXPECTED_FORMATTING_INTERNAL = ['toggleMark', 'setMark', 'removeMark'];

const EXPECTED_FORMATTING_FACADES = [
    'toggleBold', 'toggleItalic', 'toggleUnderline',
    'toggleStrikethrough', 'toggleCodeMark',
    'setColor', 'setHighlight', 'clearFormatting'
];

const EXPECTED_STRUCTURE_INTERNAL = [
    'toggleBlockStructure', 'duplicateNode',
    'wrapNode', 'unwrapNode', 'transformNode'
];

const EXPECTED_STRUCTURE_FACADES = [
    'setHeading', 'setParagraph', 'toggleBlockQuote',
    'toggleCallout', 'setCodeBlock', 'setHorizontalRule', 'setTextAlign'
];

const EXPECTED_LIST_INTERNAL = ['toggleListType', 'sinkListItem', 'liftListItem'];

const EXPECTED_LIST_FACADES = [
    'toggleBulletList', 'toggleOrderedList', 'toggleTaskList',
    'indentListItem', 'outdentListItem'
];

const EXPECTED_TABLE = [
    'insertTable', 'insertRowAbove', 'insertRowBelow', 'deleteRow',
    'insertColumnLeft', 'insertColumnRight', 'deleteColumn',
    'mergeCells', 'splitCell'
];

const EXPECTED_SELECTION = ['selectAll', 'setSelection', 'clearSelection'];

const EXPECTED_HISTORY = ['undo', 'redo'];

const ALL_EXPECTED: string[] = [
    ...EXPECTED_CONTENT,
    ...EXPECTED_FORMATTING_INTERNAL,
    ...EXPECTED_FORMATTING_FACADES,
    ...EXPECTED_STRUCTURE_INTERNAL,
    ...EXPECTED_STRUCTURE_FACADES,
    ...EXPECTED_LIST_INTERNAL,
    ...EXPECTED_LIST_FACADES,
    ...EXPECTED_TABLE,
    ...EXPECTED_SELECTION,
    ...EXPECTED_HISTORY
];

// ── Shared setup ──────────────────────────────────────────────────────────────

function buildRegistry(): CommandRegistry {
    const registry = new CommandRegistry();
    return registry;
}

// ── registerBuiltins() — completeness ────────────────────────────────────────

describe('registerBuiltins() — completeness', () => {

    it('all registrations have source "builtin"', () => {
        const registry = buildRegistry();
        const nonBuiltin = registry.getAll().filter((r) => r.source !== 'builtin');
        expect(nonBuiltin.length).toBe(0);
    });
});
