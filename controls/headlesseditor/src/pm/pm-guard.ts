/**
 * pm-guard.ts — Single ProseMirror import gate.
 *
 * This is the ONLY file in the codebase that may import directly from
 * prosemirror-* packages. All other files inside src/pm/ import from this file.
 * Nothing outside src/pm/ may import from this file or any prosemirror-* package.
 */

import { Decoration } from 'prosemirror-view';

export { Schema as PMSchema } from 'prosemirror-model';
export { Node as PMNode } from 'prosemirror-model';
export { Fragment as PMFragment } from 'prosemirror-model';
export { Slice as PMSlice } from 'prosemirror-model';
export { Mark as PMMark } from 'prosemirror-model';
export { MarkType as PMMarkType } from 'prosemirror-model';
export { NodeType as PMNodeType } from 'prosemirror-model';
export { NodeRange as PMNodeRange, ResolvedPos as PMResolvedPos } from 'prosemirror-model';
export { DOMParser as PMDOMParser } from 'prosemirror-model';
export { DOMSerializer as PMDOMSerializer } from 'prosemirror-model';
export type { NodeSpec, MarkSpec, AttributeSpec, SchemaSpec, DOMOutputSpec, ResolvedPos, Fragment } from 'prosemirror-model';

export { EditorState as PMEditorState } from 'prosemirror-state';
export type { Command as PMCommand } from 'prosemirror-state';
export { Transaction as PMTransaction } from 'prosemirror-state';
export { Plugin as PMPlugin } from 'prosemirror-state';
export { Selection as PMSelection } from 'prosemirror-state';
export { TextSelection } from 'prosemirror-state';
export { NodeSelection } from 'prosemirror-state';
export { AllSelection } from 'prosemirror-state';
export { Mapping } from 'prosemirror-transform';
export { Step as PMStep } from 'prosemirror-transform';
export { MapResult as PMMapResult } from 'prosemirror-transform';
export { findWrapping, canJoin } from 'prosemirror-transform';
export { AddMarkStep, RemoveMarkStep, AddNodeMarkStep, RemoveNodeMarkStep, ReplaceStep, ReplaceAroundStep, AttrStep } from 'prosemirror-transform';
export { InputRule as PMInputRule, inputRules } from 'prosemirror-inputrules';
export { EditorView as PMEditorView } from 'prosemirror-view';
export type { DirectEditorProps, NodeView as PMNodeView } from 'prosemirror-view';
export { Decoration as PMDecoration, DecorationSet as PMDecorationSet } from 'prosemirror-view';
export { PluginKey as PMPluginKey } from 'prosemirror-state';
export { keymap } from 'prosemirror-keymap';
export { history, undo as pmUndo, redo as pmRedo, undoDepth, redoDepth } from 'prosemirror-history';
export {
    toggleMark as pmToggleMark,
    setBlockType as pmSetBlockType,
    wrapIn as pmWrapIn,
    lift as pmLift,
    splitBlock as pmSplitBlock,
    splitBlockKeepMarks as pmSplitBlockKeepMarks,
    chainCommands as pmChainCommands,
    newlineInCode as pmNewlineInCode,
    createParagraphNear as pmCreateParagraphNear,
    liftEmptyBlock as pmLiftEmptyBlock
} from 'prosemirror-commands';
export { wrapInList as pmWrapInList, liftListItem as pmLiftListItem, sinkListItem as pmSinkListItem, splitListItem as pmSplitListItem } from 'prosemirror-schema-list';

// ── prosemirror-tables ────────────────────────────────────────────────────────
export { CellSelection as PMCellSelection } from 'prosemirror-tables';
export { TableMap as PMTableMap } from 'prosemirror-tables';
export {
    tableEditing,
    columnResizing,
    addColumnBefore as pmAddColumnBefore,
    addColumnAfter as pmAddColumnAfter,
    deleteColumn as pmDeleteColumn,
    addRowBefore as pmAddRowBefore,
    addRowAfter as pmAddRowAfter,
    deleteRow as pmDeleteRow,
    deleteTable as pmDeleteTable,
    goToNextCell as pmGoToNextCell,
    toggleHeaderRow as pmToggleHeaderRow,
    toggleHeaderColumn as pmToggleHeaderColumn,
    setCellAttr as pmSetCellAttr,
    tableNodeTypes as pmTableNodeTypes
} from 'prosemirror-tables';
export { baseKeymap } from 'prosemirror-commands';
