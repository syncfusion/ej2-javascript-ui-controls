/**
 * Section 14 — Exit Gate Integration Tests
 * Verifies all exit criteria for EPIC 2A are met.
 *
 * Exit gate conditions:
 * (a) PM view mounts in JSDOM <div> without error
 * (b) document round-trip passes for 3 fixture documents
 * (c) transaction pipeline test passes (insert text → getDocument has that text)
 * (d) zero PM type leaks from src/index.ts (structural check only here)
 */
import { HeadlessEditor } from '../../src/headless-editor/headless-editor';
import { DocumentRoot } from '../../src/model/editor-node';
import { emptyDoc, singleParagraphDoc, nestedListDoc } from '../fixtures/sample-documents';
import { DocumentMapper } from '../../src/pm/adapters/document-mapper';
import { IntegrationManager } from '../../src/pm/integration/integration-manager';
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

// ── (a) PM view mounts in JSDOM <div> without error ─────────────────────────

describe('Exit Gate (a) — PM view mounts in JSDOM div', () => {
    it('Editor.create() + editor.mount(div) succeeds without error', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = HeadlessEditor.create({ extensions: testExtensions });
        expect(() => editor.mount(container)).not.toThrow();

        editor.destroy();
        document.body.removeChild(container);
    });
});

// ── (b) Document round-trip for all 3 fixtures ───────────────────────────────

describe('Exit Gate (b) — document round-trip for emptyDoc', () => {
    it('emptyDoc round-trips with matching id, type, schemaVersion, and children', () => {
        const editor = HeadlessEditor.create({
            extensions: testExtensions,
            document: emptyDoc
        });

        const container = document.createElement('div');
        document.body.appendChild(container);
        editor.mount(container);

        const result = editor.getDocument();

        expect(result.id).toEqual(emptyDoc.id);
        expect(result.type).toEqual(emptyDoc.type);
        expect(result.schemaVersion).toEqual(emptyDoc.schemaVersion);
        expect(result.children.length).toEqual(emptyDoc.children.length);
        expect(result.children[0].id).toEqual(emptyDoc.children[0].id);
        expect(result.children[0].type).toEqual(emptyDoc.children[0].type);

        editor.destroy();
        document.body.removeChild(container);
    });
});
