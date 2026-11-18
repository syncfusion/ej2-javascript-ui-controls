/**
 * clear-code-block.ts — Internal command: when the cursor sits at
 * the start of an empty codeBlock, convert it to a paragraph by
 * delegating to `setParagraph`. Outside of a codeBlock / at-non-start
 * / non-empty context, the command no-ops so a stray call from a
 * toolbar does not silently rewrite unrelated blocks.
 *
 * Mirrors the Backspace branch of the
 * `@tiptap/extension-code-block` Backspace handler. All state
 * checks live inside `canExecute` so the keymap handler can
 * dispatch in one line:
 *
 *     () => this.editor.commands.clearCodeBlock()
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { setParagraphCommand } from '../../paragraph/commands/set-paragraph';
import { PMEditorState, PMResolvedPos } from '../../../pm/pm-guard';

export const clearCodeBlockCommand: PMCommandInternal<void> = {
    name: 'clearCodeBlock',
    meta: { label: 'Clear Code Block', category: 'structure' },

    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const $from: PMResolvedPos = pmState.selection.$from;
        // Must be inside a codeBlock …
        if ($from.parent.type.name !== 'codeBlock') { return false; }
        // … sitting at the very start …
        if ($from.parentOffset !== 0) { return false; }
        // … of an empty block, or of a block with nothing before it
        // (PM's joinBackward has no target there, so convert to a paragraph).
        if ($from.parent.textContent.length === 0) { return true; }
        for (let depth: number = $from.depth - 1; depth >= 0; depth--) {
            if ($from.index(depth) !== 0) { return false; }
        }
        return true;
    },

    execute(ctx: PMCommandContext): void {
        setParagraphCommand.execute(ctx);
    }
};

