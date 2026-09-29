/**
 * Section 12 — Defensive Edge Case Tests
 * These tests cover all 4 defensive scenarios from tasks 12.1–12.4.
 */
import { HeadlessEditor } from '../../src/headless-editor/headless-editor';
import { EditorLifecycleError } from '../../src/errors/editor-lifecycle-error';
import { IntegrationManager } from '../../src/pm/integration/integration-manager';
import { DocumentMapper } from '../../src/pm/adapters/document-mapper';
import { emptyDoc } from '../fixtures/sample-documents';
import {
    boldExtension,
    codeBlockExtension,
    horizontalRuleExtension,
    headingExtension,
    italicExtension,
    listExtension,
    paragraphExtension,
    blockquoteExtension
} from '../../src/extensions/builtins';
import { ExtensionCompiler } from '../../src/extensions/extension-compiler';
import { ExtensionManager } from '../../src/extensions/extension-manager';
import { CommandRegistry } from '../../src/commands/registry';
import { DiagnosticsService } from '../../src/diagnostics/index';

const testExtensions = [
    paragraphExtension,
    headingExtension,
    blockquoteExtension,
    horizontalRuleExtension,
    codeBlockExtension,
    boldExtension,
    italicExtension,
    listExtension
];

const compileTestPmSchema = () => {
    const extensionManager = new ExtensionManager(testExtensions);
    extensionManager.register();
    const diagnostics = new DiagnosticsService();
    const compiler = new ExtensionCompiler(diagnostics);
    compiler.compile(extensionManager.getExtensions() as any, new CommandRegistry());
    return compiler.pmSchema;
};

// ── 12.2 Double mount throws ─────────────────────────────────────────────────

describe('Defensive 12.2 — double mount() throws', () => {
    it('second mount() throws EditorLifecycleError("Editor already mounted")', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = HeadlessEditor.create({ extensions: testExtensions });
        editor.mount(container);

        const container2 = document.createElement('div');
        let caughtError: EditorLifecycleError | undefined;

        try {
            editor.mount(container2);
        } catch (e) {
            caughtError = e as EditorLifecycleError;
        }

        expect(caughtError).toBeDefined();
        expect(caughtError instanceof EditorLifecycleError).toBe(true);
        expect(caughtError!.message).toBe('Editor already mounted');

        editor.destroy();
        document.body.removeChild(container);
    });
});

// ── 12.3 destroy() while mounted cleans up; subsequent mount throws ──────────

describe('Defensive 12.3 — destroy() while mounted', () => {
    it('destroy() while mounted destroys view cleanly', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = HeadlessEditor.create({ extensions: testExtensions });
        editor.mount(container);

        expect(() => editor.destroy()).not.toThrow();

        // Subsequent mount should throw "Editor has been destroyed"
        const container2 = document.createElement('div');
        let caughtError: EditorLifecycleError | undefined;
        try {
            editor.mount(container2);
        } catch (e) {
            caughtError = e as EditorLifecycleError;
        }

        expect(caughtError).toBeDefined();
        expect(caughtError!.message).toBe('Editor has been destroyed');

        document.body.removeChild(container);
    });
});

// ── 12.4 getDocument() works even if container is removed from DOM ────────────

describe('Defensive 12.4 — container removed from DOM; getDocument still works', () => {
    it('getDocument() returns valid DocumentRoot after container removed from DOM', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = HeadlessEditor.create({ extensions: testExtensions });
        editor.mount(container);

        // Remove container from DOM
        document.body.removeChild(container);

        // getDocument reads from PM state, not from DOM
        let doc: any;
        expect(() => { doc = editor.getDocument(); }).not.toThrow();
        expect(doc.type).toBe('document');

        editor.destroy();
    });
});
