import { validateDocument, validateNodeDefinition } from '../../src/schema/validation';
import { SchemaManager } from '../../src/schema/schema-manager';
import { NodeContent } from '../../src/schema/types/content-expression';
import { DocumentRoot } from '../../src/model/editor-node';
import * as migration from '../../src/schema/migration/index';
import * as serialization from '../../src/schema/serialization/index';
import * as schemaTypes from '../../src/schema/types/index';

describe('schema validation exports', () => {
	it('re-exports validateNodeDefinition', () => {
		const result = validateNodeDefinition({ name: 'document', group: 'root' });

		expect(result.valid).toBe(true);
		expect(result.errors).toEqual([]);
	});

	it('re-exports validateDocument', () => {
		const schema = new SchemaManager();
		schema.registerNode({ name: 'document', group: 'root', content: NodeContent.block().zeroOrMore() });
		const root: DocumentRoot = {
			id: 'document-1',
			type: 'document',
			attrs: {},
			children: [],
			marks: [],
			schemaVersion: 1
		};

		const result = validateDocument(root, schema);

		expect(result.valid).toBe(true);
		expect(result.errors).toEqual([]);
	});
});

describe('Schema migration barrel', () => {
	it('exports MigrationEngine', () => {
		expect(migration.MigrationEngine).toBeDefined();
	});
});

describe('Schema serialization barrel', () => {
	it('exports DocumentSerializer', () => {
		expect(serialization.DocumentSerializer).toBeDefined();
	});
});

describe('Schema types barrel', () => {
	it('exports schema type helpers', () => {
		expect(schemaTypes.validateAttributeDefinition).toBeDefined();
		expect(schemaTypes.NodeContent).toBeDefined();
	});
});
