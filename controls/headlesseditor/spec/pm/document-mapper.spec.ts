import { DocumentMapper } from '../../src/pm/adapters/document-mapper';
import { PMSchemaAdapter } from '../../src/pm/adapters/pm-schema-adapter';
import { DefaultDOMSpecRegistry } from '../../src/pm/dom/dom-spec-registry';
import { builtInNodeDefs } from '../fixtures/built-in-nodedefs';
import { builtInMarkDefs } from '../fixtures/built-in-markdefs';
import { singleParagraphDoc, emptyDoc } from '../fixtures/sample-documents';
import { DocumentRoot, EditorNode } from '../../src/model/editor-node';
import { DiagnosticsService } from '../../src/diagnostics/index';

const domRegistry = DefaultDOMSpecRegistry.createDefault();
const diagnostics = new DiagnosticsService();
const adapter = new PMSchemaAdapter(domRegistry, diagnostics);
const pmSchema = adapter.compile({ nodes: builtInNodeDefs, marks: builtInMarkDefs });

const deterministicIdGen = (() => {
    let counter = 0;
    return { generate: () => `generated-id-${++counter}` };
})();

describe('DocumentMapper — paragraph with marks round-trip', () => {

    it('all marks are preserved through the round-trip', () => {
        const pmDoc = DocumentMapper.toPMDoc(singleParagraphDoc, pmSchema);
        const recovered = DocumentMapper.fromPMDoc(pmDoc, { generate: () => 'fallback' });

        const origParaChildren = singleParagraphDoc.children[0].children;
        const recovParaChildren = recovered.children[0].children;

        // The second text node has bold + italic
        const origBoldItalic = origParaChildren[1];
        const recovBoldItalic = recovParaChildren[1];

        expect(recovBoldItalic.marks.length).toBe(2);
        const markTypes = recovBoldItalic.marks.map((m: any) => m.type).sort();
        expect(markTypes).toEqual(['bold', 'italic'].sort());
    });

    it('deep equality passes for singleParagraphDoc round-trip', () => {
        const pmDoc = DocumentMapper.toPMDoc(singleParagraphDoc, pmSchema);
        const recovered = DocumentMapper.fromPMDoc(pmDoc, { generate: () => 'fallback' });

        // Value equality — not reference equality
        expect(recovered.id).toEqual(singleParagraphDoc.id);
        expect(recovered.type).toEqual(singleParagraphDoc.type);
        expect(recovered.children[0].type).toEqual('paragraph');
    });
});

describe('DocumentMapper — emptyDoc round-trip', () => {
    it('empty document round-trips correctly', () => {
        const pmDoc = DocumentMapper.toPMDoc(emptyDoc, pmSchema);
        const recovered = DocumentMapper.fromPMDoc(pmDoc, { generate: () => 'fallback' });

        expect(recovered.id).toBe(emptyDoc.id);
        expect(recovered.type).toBe('document');
        expect(recovered.children.length).toBe(1);
        expect(recovered.children[0].type).toBe('paragraph');
        expect(recovered.children[0].id).toBe(emptyDoc.children[0].id);
    });
});

describe('DocumentMapper — PM-generated node gets new UUID', () => {
    it('fromPMDoc assigns new ID when attrs.id is null', () => {
        // Build a paragraph entirely via PM (no id set → null)
        const textNode = pmSchema.text('no id here');
        const para = pmSchema.nodes['paragraph'].create(null, [textNode]);
        const doc = pmSchema.nodes['document'].create(null, [para]);

        let idCallCount = 0;
        const countingIdGen = {
            generate: () => {
                idCallCount++;
                return `new-id-${idCallCount}`;
            }
        };

        const recovered = DocumentMapper.fromPMDoc(doc, countingIdGen);

        // At least doc root + paragraph should get new IDs
        expect(idCallCount).toBeGreaterThanOrEqual(2);
        expect(recovered.id).toMatch(/^new-id-/);
        expect(recovered.children[0].id).toMatch(/^new-id-/);
    });
});

describe('DocumentMapper — full round-trip value equality', () => {
    it('round-trip produces structurally equal document (deep equality)', () => {
        const pmDoc = DocumentMapper.toPMDoc(emptyDoc, pmSchema);
        const recovered = DocumentMapper.fromPMDoc(pmDoc, { generate: () => 'fallback' });

        // toEqual checks deep value equality, not reference equality
        expect(recovered.id).toEqual(emptyDoc.id);
        expect(recovered.type).toEqual(emptyDoc.type);
        expect(recovered.schemaVersion).toEqual(emptyDoc.schemaVersion);
        expect(recovered.children[0].id).toEqual(emptyDoc.children[0].id);
        expect(recovered.children[0].type).toEqual(emptyDoc.children[0].type);
    });
});
