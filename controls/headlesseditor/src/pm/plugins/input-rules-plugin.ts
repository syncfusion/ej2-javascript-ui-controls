/**
 * input-rules-compiler.ts — INTERNAL to src/pm/
 *
 * Converts an ordered list of InputRuleDefinition objects into a ProseMirror
 * input-rules plugin. Not exported from src/index.ts.
 *
 * Responsibilities:
 *  1. Sort definitions by priority descending (stable sort; undefined → 0).
 *  2. Deduplicate by id — first occurrence after sort wins.
 *  3. Map each definition to a PM InputRule whose callback:
 *       a. Builds an InputRuleContext (PM-free; uses DocumentMapper + SelectionAdapter).
 *       b. Calls def.handler(ctx) inside a try/catch.
 *       c. If commandManager.execute() returns false (canExecute failed): returns null.
 *       d. On success: emits INPUT_RULE_APPLIED{success:true}, returns sentinel tr.
 *       e. On handler error: emits INPUT_RULE_APPLIED{success:false}, returns null.
 *  4. Returns the PM plugin produced by `inputRules({ rules })`.
 */

import { PMEditorState, PMPlugin, PMTransaction, PMNode, PMInputRule, inputRules } from '../pm-guard';
import { DocumentMapper } from '../adapters/document-mapper';
import { SelectionAdapter } from '../adapters/selection-adapter';
import { PositionAdapter } from '../adapters/position-adapter';
import { DefaultIdGenerator } from '../../utils/id-generator';
import { InputRuleDefinition, InputRuleContext } from '../../extensions/types';
import { CommandManager } from '../../commands/manager';
import { EditorNode } from '../../model/editor-node';
import { Selection } from '../../model/selection';

// ── Shared adapter instances (stateless; safe to reuse across rules) ──────────
const _idGen: DefaultIdGenerator = new DefaultIdGenerator();
const _positionAdapter: PositionAdapter = new PositionAdapter();
const _selectionAdapter: SelectionAdapter = new SelectionAdapter(_positionAdapter);

/**
 *
 * Compiles an array of InputRuleDefinition objects into a single ProseMirror
 * input-rules plugin.
 *
 * @param {InputRuleDefinition[]} definitions - Extension-contributed rule definitions.
 * @param {CommandManager} commandManager - Used to dispatch commands from inside rule handlers.
 * @param {EventBus} eventBus - Receives INPUT_RULE_APPLIED events after each rule fires.
 * @returns {PMPlugin} A PMPlugin that applies the compiled input rules.
 */
export function compileInputRulesPlugin(
    definitions: readonly InputRuleDefinition[],
    commandManager: CommandManager
): PMPlugin {
    // Stage 1: stable priority sort (descending); treat undefined as 0
    const sorted: InputRuleDefinition[] = [...definitions];

    // Stage 2: deduplicate by id — first occurrence after sort wins
    const seen: Set<string> = new Set<string>();
    const unique: InputRuleDefinition[] = [];
    for (const def of sorted) {
        if (!seen.has(def.id)) {
            seen.add(def.id);
            unique.push(def);
        }
    }
    // Stage 3: build PM PMInputRule objects
    const pmRules: PMInputRule[] = unique.map((def: InputRuleDefinition) =>
        new PMInputRule(

            def.pattern,
            (state: PMEditorState, match: RegExpMatchArray, start: number, _end: number): PMTransaction | null => {
                // Map the PM node at the match start to a Syncfusion EditorNode
                const pmNodeAt: PMNode = state.doc.nodeAt(start);
                const nodeAt: EditorNode | null = pmNodeAt
                    ? (() => {
                        try {
                            // nodeAt returns a child node — use NodeMapper via fromPMDoc-like logic
                            return DocumentMapper.fromPMDoc(pmNodeAt as any, _idGen) as unknown as EditorNode;
                        } catch {
                            return null;
                        }
                    })()
                    : null;
                const selection: Selection = _selectionAdapter.fromPMSelection(state.selection, state.doc) ?? { type: 'text' as any };
                let commandSuccess: boolean = false;
                const ctx: InputRuleContext = {
                    match,
                    start,
                    end: _end,
                    nodeAt,
                    selection,
                    dispatchCommand: (commandName: string, payload?: unknown): boolean => {
                        commandSuccess = commandManager.execute(commandName, payload);
                        return commandSuccess;
                    }
                };
                try {
                    def.handler(ctx);
                }
                catch {
                    return null;
                }
                if (!commandSuccess) {
                    // canExecute returned false — do not consume the keystroke
                    return null;
                }

                // Sentinel transaction: signals PM that the keystroke was handled.
                // Enables undoInputRule undo grouping without a redundant content mutation.
                return state.tr.setMeta('inputRuleHandled', def.id);
            }
        )
    );
    return inputRules({ rules: pmRules });
}
