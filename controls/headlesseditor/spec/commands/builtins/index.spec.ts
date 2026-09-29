import * as builtInCommands from '../../../src/commands/builtins/index';
import * as builtInListCommands from '../../../src/commands/builtins/list/index';

describe('Built-in commands barrel', () => {
	it('exports all built-in commands', () => {
		expect(builtInCommands.toggleMarkCommand).toBeDefined();
		expect(builtInCommands.setMarkCommand).toBeDefined();
		expect(builtInCommands.removeMarkCommand).toBeDefined();
		expect(builtInCommands.toggleBoldCommand).toBeDefined();
		expect(builtInCommands.toggleItalicCommand).toBeDefined();
		expect(builtInCommands.toggleUnderlineCommand).toBeDefined();
		expect(builtInCommands.toggleStrikethroughCommand).toBeDefined();
		expect(builtInCommands.toggleCodeMarkCommand).toBeDefined();
		expect(builtInCommands.setLinkCommand).toBeDefined();
		expect(builtInCommands.unsetLinkCommand).toBeDefined();
		expect(builtInCommands.toggleSuperscriptCommand).toBeDefined();
		expect(builtInCommands.toggleSubscriptCommand).toBeDefined();
		expect(builtInCommands.toUpperCaseCommand).toBeDefined();
		expect(builtInCommands.toLowerCaseCommand).toBeDefined();
		expect(builtInCommands.setColorCommand).toBeDefined();
		expect(builtInCommands.unsetColorCommand).toBeDefined();
		expect(builtInCommands.setHighlightCommand).toBeDefined();
		expect(builtInCommands.unsetHighlightCommand).toBeDefined();
		expect(builtInCommands.setFontSizeCommand).toBeDefined();
		expect(builtInCommands.unsetFontSizeCommand).toBeDefined();
		expect(builtInCommands.setFontFamilyCommand).toBeDefined();
		expect(builtInCommands.unsetFontFamilyCommand).toBeDefined();
		expect(builtInCommands.clearFormattingCommand).toBeDefined();
		expect(builtInCommands.inputRuleMarkCommand).toBeDefined();
	});
});

describe('Built-in list commands barrel', () => {
	it('exports all built-in list commands', () => {
		expect(builtInListCommands.toggleListTypeCommand).toBeDefined();
		expect(builtInListCommands.sinkListItemCommand).toBeDefined();
		expect(builtInListCommands.liftListItemCommand).toBeDefined();
		expect(builtInListCommands.splitListItemCommand).toBeDefined();
		expect(builtInListCommands.joinListBackwardCommand).toBeDefined();
		expect(builtInListCommands.deleteListItemCommand).toBeDefined();
		expect(builtInListCommands.toggleBulletListCommand).toBeDefined();
		expect(builtInListCommands.toggleOrderedListCommand).toBeDefined();
		expect(builtInListCommands.toggleTaskListCommand).toBeDefined();
		expect(builtInListCommands.indentListItemCommand).toBeDefined();
		expect(builtInListCommands.outdentListItemCommand).toBeDefined();
		expect(builtInListCommands.toggleTaskCheckedCommand).toBeDefined();
		expect(builtInListCommands.setOrderedListTypeCommand).toBeDefined();
		expect(builtInListCommands.setBulletListTypeCommand).toBeDefined();
	});
});
