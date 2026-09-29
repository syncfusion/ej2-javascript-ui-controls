import { IntegrationManager } from '../../src/pm/integration/integration-manager';
import { PMSchemaAdapter } from '../../src/pm/adapters/pm-schema-adapter';
import { DefaultDOMSpecRegistry } from '../../src/pm/dom/dom-spec-registry';
import { DocumentMapper } from '../../src/pm/adapters/document-mapper';
import { EditorLifecycleError } from '../../src/errors/editor-lifecycle-error';
import { builtInNodeDefs } from '../fixtures/built-in-nodedefs';
import { builtInMarkDefs } from '../fixtures/built-in-markdefs';
import { emptyDoc } from '../fixtures/sample-documents';
import { DiagnosticsService } from '../../src/diagnostics/index';
const domRegistry = DefaultDOMSpecRegistry.createDefault();
const diagnostics = new DiagnosticsService();
const adapter = new PMSchemaAdapter(domRegistry, diagnostics);
const pmSchema = adapter.compile({ nodes: builtInNodeDefs, marks: builtInMarkDefs });
const pmDoc = DocumentMapper.toPMDoc(emptyDoc, pmSchema);

describe('IntegrationManager — create and dispatch (no DOM)', () => {
    let im: IntegrationManager;

    beforeEach(() => {
        im = new IntegrationManager();
        im.create({ schema: pmSchema, doc: pmDoc });
    });

    afterEach(() => {
        if (!im.isDestroyed) { im.destroy(); }
    });

    it('creates state successfully', () => {
        expect(() => im.getState()).not.toThrow();
        expect(im.getState().doc).toBeDefined();
    });
});

describe('IntegrationManager — destroy lifecycle', () => {
    it('destroy then dispatch throws EditorLifecycleError', () => {
        const im = new IntegrationManager();
        im.create({ schema: pmSchema, doc: pmDoc });

        const tr = im.getState().tr.insertText('X', 1);
        im.destroy();

        expect(() => im.dispatch(tr)).toThrowError(EditorLifecycleError);
        try {
            im.dispatch(tr);
        } catch (e) {
            expect(e instanceof EditorLifecycleError).toBe(true);
            expect((e as EditorLifecycleError).message).toBe('Editor has been destroyed');
        }
    });

    it('destroy twice is a no-op', () => {
        const im = new IntegrationManager();
        im.create({ schema: pmSchema, doc: pmDoc });
        im.destroy();
        expect(() => im.destroy()).not.toThrow();
    });

    it('getState after destroy throws EditorLifecycleError', () => {
        const im = new IntegrationManager();
        im.create({ schema: pmSchema, doc: pmDoc });
        im.destroy();
        expect(() => im.getState()).toThrowError(EditorLifecycleError);
    });
});
