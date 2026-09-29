import { PMSchemaAdapter } from '../../src/pm/adapters/pm-schema-adapter';
import { DefaultDOMSpecRegistry } from '../../src/pm/dom/dom-spec-registry';
import { builtInNodeDefs } from '../fixtures/built-in-nodedefs';
import { builtInMarkDefs } from '../fixtures/built-in-markdefs';
import { SchemaDefinition } from '../../src/schema/types/schema-definition';
import { DiagnosticsService } from '../../src/diagnostics/index';

const fullSchema: SchemaDefinition = {
    nodes: builtInNodeDefs,
    marks: builtInMarkDefs
};

describe('PMSchemaAdapter — compile built-in types', () => {
    let adapter: PMSchemaAdapter;
    let svc: DiagnosticsService;
    beforeEach(() => {
        svc = new DiagnosticsService();
        const domRegistry = DefaultDOMSpecRegistry.createDefault();
        adapter = new PMSchemaAdapter(domRegistry, svc);
    });
    afterEach(() => { try { svc.dispose(); } catch { /* already disposed */ } });
    it('compiles all 18 built-in node types without error', () => {
        expect(() => adapter.compile(fullSchema)).not.toThrow();
    });

    it('injects id attr with default null into every node', () => {
        const pmSchema = adapter.compile(fullSchema);
        for (const nodeName of Object.keys(pmSchema.nodes)) {
            const nodeType = pmSchema.nodes[nodeName];
            if (!nodeType.spec || !nodeType.spec.attrs) { continue; }
            expect((nodeType.spec.attrs as any)['id'])
                .toBeDefined(`Node "${nodeName}" should have an injected id attr`);
            expect((nodeType.spec.attrs as any)['id'].default)
                .toBeNull(`Node "${nodeName}" id attr default should be null`);
        }
    });

    it('preserves number attribute default (level → 1)', () => {
        const pmSchema = adapter.compile(fullSchema);
        const spec = pmSchema.nodes['heading'].spec;
        expect((spec.attrs as any)['level'].default).toBe(1);
    });

    it('preserves enum attribute default (callout variant → "info")', () => {
        const pmSchema = adapter.compile(fullSchema);
        const spec = pmSchema.nodes['callout'].spec;
        expect((spec.attrs as any)['variant'].default).toBe('info');
    });

    it('maps mark inclusive to PM MarkSpec', () => {
        const pmSchema = adapter.compile(fullSchema);
        expect(pmSchema.marks['bold'].spec.inclusive).toBe(true);
        expect(pmSchema.marks['code'].spec.inclusive).toBe(false);
    });
});

describe('PMSchemaAdapter — validates a minimal PM document', () => {
    it('compiled schema can validate a minimal doc/paragraph/text structure', () => {
        const domRegistry = DefaultDOMSpecRegistry.createDefault();
        const diagnostics = new DiagnosticsService();
        const adapter = new PMSchemaAdapter(domRegistry, diagnostics);
        const pmSchema = adapter.compile(fullSchema);

        // Build a minimal PM document using the compiled schema
        const textNode = pmSchema.text('hello');
        const para = pmSchema.nodes['paragraph'].create(
            { id: 'test-id-1' },
            [textNode]
        );
        const doc = pmSchema.nodes['document'].create(
            { id: 'test-id-0' },
            [para]
        );

        expect(doc).toBeDefined();
        expect(doc.type.name).toBe('document');
        expect(doc.childCount).toBe(1);
        expect(doc.child(0).type.name).toBe('paragraph');
        expect(doc.child(0).textContent).toBe('hello');
    });
});
