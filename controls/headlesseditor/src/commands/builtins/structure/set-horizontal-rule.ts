/**
 * set-horizontal-rule.ts — Public facade: insert a horizontal rule
 * at the current selection.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { DefaultIdGenerator } from '../../../utils/id-generator';
import { PMEditorState, PMNode, PMNodeType, PMTransaction } from '../../../pm/pm-guard';

const idGen: DefaultIdGenerator = new DefaultIdGenerator();

export const setHorizontalRuleCommand: PMCommandInternal<void> = {
    name: 'setHorizontalRule',
    meta: { label: 'Horizontal Rule', category: 'structure' },

    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        return pmState.schema.nodes['horizontalRule'] !== undefined;
    },

    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const horizontalRuleType: PMNodeType | undefined = pmState.schema.nodes['horizontalRule'];
        if (!horizontalRuleType) { return; }

        const { from } = pmState.selection;
        const horizontalRuleNode: PMNode = horizontalRuleType.create({ id: idGen.generate() });
        const tr: PMTransaction = pmState.tr.insert(from, horizontalRuleNode);
        ctx.dispatch(wrapTransaction(tr));
    }
};
