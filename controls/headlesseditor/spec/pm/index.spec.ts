import * as adapters from '../../src/pm/adapters/index';
import * as tableAdapters from '../../src/pm/adapters/table/index';
import * as plugins from '../../src/pm/plugins/index';

describe('PM adapters barrel', () => {
	it('exports all PM adapters', () => {
		expect(adapters.PositionAdapter).toBeDefined();
		expect(adapters.SelectionAdapter).toBeDefined();
		expect(adapters.NodeMapper).toBeDefined();
		expect(adapters.DocumentMapper).toBeDefined();
		expect(adapters.ContentExpressionCompiler).toBeDefined();
		expect(adapters.NodeSpecBuilder).toBeDefined();
		expect(adapters.MarkSpecBuilder).toBeDefined();
		expect(adapters.PMSchemaAdapter).toBeDefined();
	});
});

describe('PM table adapters barrel', () => {
	it('exports all PM table adapters', () => {
		expect(tableAdapters.createTableEditingPlugin).toBeDefined();
		expect(tableAdapters.insertTable).toBeDefined();
		expect(tableAdapters.insertRowBefore).toBeDefined();
		expect(tableAdapters.insertRowAfter).toBeDefined();
		expect(tableAdapters.deleteRow).toBeDefined();
		expect(tableAdapters.insertColumnBefore).toBeDefined();
		expect(tableAdapters.insertColumnAfter).toBeDefined();
		expect(tableAdapters.deleteColumn).toBeDefined();
		expect(tableAdapters.deleteTablePM).toBeDefined();
		expect(tableAdapters.toggleHeaderRowPM).toBeDefined();
		expect(tableAdapters.toggleHeaderColumnPM).toBeDefined();
		expect(tableAdapters.setCellAttribute).toBeDefined();
		expect(tableAdapters.moveToNextCell).toBeDefined();
		expect(tableAdapters.moveToPreviousCell).toBeDefined();
		expect(tableAdapters.getTableMap).toBeDefined();
		expect(tableAdapters.isCursorInTable).toBeDefined();
		expect(tableAdapters.insertParagraphInCell).toBeDefined();
		expect(tableAdapters.toPMCellSelection).toBeDefined();
		expect(tableAdapters.fromPMCellSelection).toBeDefined();
		expect(tableAdapters.remapCellSelection).toBeDefined();
	});
});

describe('PM plugins barrel', () => {
	it('exports all PM plugins', () => {
		expect(plugins.createHistoryPlugin).toBeDefined();
		expect(plugins.historyPlugin).toBeDefined();
		expect(plugins.selectionSyncPlugin).toBeDefined();
		expect(plugins.focusBlurPlugin).toBeDefined();
		expect(plugins.buildKeymapPlugin).toBeDefined();
		expect(plugins.createPlaceholderPlugin).toBeDefined();
	});
});
