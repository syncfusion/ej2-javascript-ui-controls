import { Command } from '../types';
import { insertNodeCommand, deleteNodeCommand, moveNodeCommand, insertTextCommand, deleteTextCommand, replaceTextCommand, deleteRangeCommand } from './content/index';

import { inputRuleMarkCommand, removeMarkCommand, toggleMarkCommand, setMarkCommand } from './formatting/index';
import { liftListItemCommand, sinkListItemCommand } from './list';
import { clearSelectionCommand, selectAllCommand, setSelectionCommand } from './selection';
import { inputRuleTransformCommand, inputRuleWrapCommand, inputRuleInsertCommand, duplicateNodeCommand, toggleBlockStructureCommand, wrapNodeCommand, unwrapNodeCommand, transformNodeCommand, splitBlockCommand, clearNodesCommand } from './structure/index';

export const defaultInjectableCommands: readonly Command[] = [
    inputRuleMarkCommand,
    inputRuleTransformCommand,
    inputRuleWrapCommand,
    inputRuleInsertCommand,
    deleteNodeCommand,
    deleteTextCommand,
    duplicateNodeCommand,
    insertNodeCommand,
    insertTextCommand,
    moveNodeCommand,
    replaceTextCommand,
    deleteRangeCommand,
    toggleMarkCommand,
    setMarkCommand,
    removeMarkCommand,
    toggleBlockStructureCommand,
    wrapNodeCommand,
    unwrapNodeCommand,
    transformNodeCommand,
    sinkListItemCommand,
    liftListItemCommand,
    selectAllCommand,
    setSelectionCommand,
    clearSelectionCommand,
    splitBlockCommand,
    clearNodesCommand
];
