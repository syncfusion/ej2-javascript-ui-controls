/**
 * spec/commands/builtins/formatting.spec.ts
 *
 * Unit tests for all formatting builtin commands:
 *   toggleMark (internal), setMark (internal), removeMark (internal),
 *   toggleBold, toggleItalic, toggleUnderline, toggleStrikethrough,
 *   toggleCodeMark, setColor, setHighlight, clearFormatting
 */
import { buildIM, buildCtx } from './helpers';
import { toggleMarkCommand } from '../../../src/commands/builtins/formatting/toggle-mark';
import { setMarkCommand } from '../../../src/commands/builtins/formatting/set-mark';
import { removeMarkCommand } from '../../../src/commands/builtins/formatting/remove-mark';
import { toggleBoldCommand } from '../../../src/commands/builtins/formatting/toggle-bold';
import { toggleItalicCommand } from '../../../src/commands/builtins/formatting/toggle-italic';
import { toggleUnderlineCommand } from '../../../src/commands/builtins/formatting/toggle-underline';
import { toggleStrikethroughCommand } from '../../../src/commands/builtins/formatting/toggle-strikethrough';
import { toggleCodeMarkCommand } from '../../../src/commands/builtins/formatting/toggle-code-mark';
import { setColorCommand } from '../../../src/commands/builtins/formatting/set-color';
import { setHighlightCommand } from '../../../src/commands/builtins/formatting/set-highlight';
import { clearFormattingCommand } from '../../../src/commands/builtins/formatting/clear-formatting';
import { TextSelection } from '../../../src/pm/pm-guard';
import clearFormattingExtension from '../../../src/extensions/builtins/clear-formatting';

// ── Helper: select the text range inside the paragraph ───────────────────────

function selectAllText(im: ReturnType<typeof buildIM>): void {
    const state = im.getState();
    // Select from pos 1 to end of first paragraph content
    const docSize = state.doc.content.size;
    const sel = TextSelection.create(state.doc, 1, docSize - 1 < 1 ? 1 : docSize - 1);
    im.dispatch(state.tr.setSelection(sel));
}

// ── toggleMark (internal) ─────────────────────────────────────────────────────

describe('toggleMarkCommand (internal)', () => {
    it('has name "toggleMark" and category "formatting"', () => {
        expect(toggleMarkCommand.name).toBe('toggleMark');
        expect(toggleMarkCommand.meta?.category).toBe('formatting');
    });

    it('canExecute returns false for unknown mark type', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(toggleMarkCommand.canExecute!(ctx, { markType: 'nonExistentMark' })).toBe(false);
    });

    it('canExecute returns true for known mark type "bold"', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(toggleMarkCommand.canExecute!(ctx, { markType: 'bold' })).toBe(true);
    });

    it('execute dispatches a transaction', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        toggleMarkCommand.execute(ctx, { markType: 'bold' });
        expect(dispatched.length).toBe(1);
    });
});

// ── setMark (internal) ────────────────────────────────────────────────────────

describe('setMarkCommand (internal)', () => {
    it('has name "setMark" and category "formatting"', () => {
        expect(setMarkCommand.name).toBe('setMark');
        expect(setMarkCommand.meta?.category).toBe('formatting');
    });

    it('canExecute returns false for unknown mark type', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(setMarkCommand.canExecute!(ctx, { markType: 'nonExistentMark', attrs: {} })).toBe(false);
    });

    it('execute dispatches for a valid mark type with attrs', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        setMarkCommand.execute(ctx, { markType: 'color', attrs: { color: '#ff0000' } });
        expect(dispatched.length).toBe(1);
    });
});

// ── removeMark (internal) ─────────────────────────────────────────────────────

describe('removeMarkCommand (internal)', () => {
    it('has name "removeMark" and category "formatting"', () => {
        expect(removeMarkCommand.name).toBe('removeMark');
        expect(removeMarkCommand.meta?.category).toBe('formatting');
    });

    it('execute dispatches a transaction', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        removeMarkCommand.execute(ctx, { markType: 'bold' });
        expect(dispatched.length).toBe(1);
    });
});

// ── toggleBold ────────────────────────────────────────────────────────────────

describe('toggleBoldCommand', () => {
    it('has name "toggleBold", label "Bold", shortcut "Mod-b"', () => {
        expect(toggleBoldCommand.name).toBe('toggleBold');
        expect(toggleBoldCommand.meta?.label).toBe('Bold');
        expect(toggleBoldCommand.meta?.shortcut).toBe('Mod-b');
    });

    it('canExecute delegates to toggleMark canExecute', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(toggleBoldCommand.canExecute!(ctx, undefined as any)).toBe(true);
    });

    it('execute dispatches a transaction', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        toggleBoldCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(1);
    });
});

// ── toggleItalic ──────────────────────────────────────────────────────────────

describe('toggleItalicCommand', () => {
    it('has name "toggleItalic" and label "Italic"', () => {
        expect(toggleItalicCommand.name).toBe('toggleItalic');
        expect(toggleItalicCommand.meta?.label).toBe('Italic');
    });

    it('execute dispatches a transaction', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        toggleItalicCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(1);
    });
});

// ── toggleUnderline ───────────────────────────────────────────────────────────

describe('toggleUnderlineCommand', () => {
    it('has name "toggleUnderline"', () => {
        expect(toggleUnderlineCommand.name).toBe('toggleUnderline');
    });

    it('execute dispatches a transaction', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        toggleUnderlineCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(1);
    });
});

// ── toggleStrikethrough ───────────────────────────────────────────────────────

describe('toggleStrikethroughCommand', () => {
    it('has name "toggleStrikethrough"', () => {
        expect(toggleStrikethroughCommand.name).toBe('toggleStrikethrough');
    });

    it('execute dispatches a transaction', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        toggleStrikethroughCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(1);
    });
});

// ── toggleCodeMark ────────────────────────────────────────────────────────────

describe('toggleCodeMarkCommand', () => {
    it('has name "toggleCodeMark"', () => {
        expect(toggleCodeMarkCommand.name).toBe('toggleCodeMark');
    });

    it('execute dispatches a transaction', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        toggleCodeMarkCommand.execute(ctx, undefined as any);
        expect(dispatched.length).toBe(1);
    });
});

// ── setColor ──────────────────────────────────────────────────────────────────

describe('setColorCommand', () => {
    it('has name "setColor" and category "formatting"', () => {
        expect(setColorCommand.name).toBe('setColor');
        expect(setColorCommand.meta?.category).toBe('formatting');
    });

    it('canExecute returns false when color attr is missing', () => {
        const im = buildIM();
        const { ctx } = buildCtx(im);
        expect(setColorCommand.canExecute!(ctx, { color: '' })).toBe(false);
    });

    it('execute dispatches a transaction for a valid color', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        setColorCommand.execute(ctx, { color: '#ff0000' });
        expect(dispatched.length).toBe(1);
    });
});

// ── setHighlight ──────────────────────────────────────────────────────────────

describe('setHighlightCommand', () => {
    it('has name "setHighlight" and category "formatting"', () => {
        expect(setHighlightCommand.name).toBe('setHighlight');
        expect(setHighlightCommand.meta?.category).toBe('formatting');
    });

    it('execute dispatches a transaction for a valid color', () => {
        const im = buildIM();
        const { ctx, dispatched } = buildCtx(im);
        setHighlightCommand.execute(ctx, { color: '#ffff00' });
        expect(dispatched.length).toBe(1);
    });
});

// ── clearFormatting ───────────────────────────────────────────────────────────

describe('clearFormattingCommand', () => {
    it('has name "clearFormatting" and category "formatting"', () => {
        expect(clearFormattingCommand.name).toBe('clearFormatting');
        expect(clearFormattingCommand.meta?.category).toBe('formatting');
    });

    it('should contribute clearFormatting command', () => {
        const commands = clearFormattingExtension.config.commands!();
        expect(commands.length).toBe(1);
        expect(commands[0]).toBe(clearFormattingCommand);
    });

    it('should execute Mod-\\ keyboard shortcut callback', () => {
        const clearFormattingSpy =
            jasmine.createSpy('clearFormatting')
                .and.returnValue(true);
        const shortcuts =
            clearFormattingExtension.config.keyboardShortcuts!.call({
                editor: {
                    commands: {
                        clearFormatting: clearFormattingSpy
                    }
                }
            } as any);
        const result = shortcuts['Mod-\\']();
        expect(result).toBe(true);
        expect(clearFormattingSpy).toHaveBeenCalledTimes(1);
    });
});
