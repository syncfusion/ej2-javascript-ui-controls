/**
 * set-cell-attribute.ts — Set an arbitrary attribute on the current table cell(s).
 *
 * PM boundary: allowed inside src/extensions/table/commands/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { setCellAttribute, isCursorInTable } from '../../../pm/adapters/table';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';
import { TABLE_COMMAND_META_KEY } from '../table-constants';

// ── Payload ───────────────────────────────────────────────────────────────────

/**
 * Payload accepted by the setCellAttribute command.
 *
 * @property {string} attribute - The attribute name to set on the cell(s).
 * @property {unknown} value - The attribute value to apply.
 */
export interface SetCellAttributePayload {
    attribute: string;
    value: unknown;
}

// ── Command ───────────────────────────────────────────────────────────────────

/**
 * setCellAttributeCommand — sets an arbitrary attribute on the cell(s) in
 * the current selection. Extensible: any valid cell attribute name is accepted.
 */
export const setCellAttributeCommand: PMCommandInternal<SetCellAttributePayload> = {
    name: 'setCellAttribute',
    meta: { label: 'Set Cell Attribute', category: 'table' },

    canExecute(ctx: PMCommandContext, _payload: SetCellAttributePayload): boolean {
        return isCursorInTable(ctx.pmState);
    },

    execute(ctx: PMCommandContext, payload: SetCellAttributePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const { attribute, value } = payload;

        setCellAttribute(
            attribute,
            value,
            pmState,
            (tr: PMTransaction): void => {
                tr.setMeta(TABLE_COMMAND_META_KEY, 'table-command');
                ctx.dispatch(wrapTransaction(tr));
            }
        );
    }
};
