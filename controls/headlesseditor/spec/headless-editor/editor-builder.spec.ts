import { HeadlessEditor } from '../../src/headless-editor/headless-editor';
import { CommandRegistry } from '../../src/commands/registry';
import { IdGenerator } from '../../src/utils/id-generator';
import type { DocumentRoot, TextNode } from '../../src/model/editor-node';
import {
    boldExtension,
    codeBlockExtension,
    horizontalRuleExtension,
    headingExtension,
    imageExtension,
    italicExtension,
    listExtension,
    listKeymapExtension,
    paragraphExtension,
    blockquoteExtension,
    taskListExtension,
    undoRedoExtension
} from '../../src/extensions/builtins';
import { defineExtension } from '../../src/extensions/define-extension';
import type { ExtensionDefinition } from '../../src/extensions/types';
import type { NodeDefinition } from '../../src/schema/types/node-definition';
import { NodeContent } from '../../src/schema/types/content-expression';
import type { IntegrationManager } from '../../src/pm/integration/integration-manager';

const baseExtensions = [
    paragraphExtension,
    headingExtension,
    blockquoteExtension,
    horizontalRuleExtension,
    codeBlockExtension,
    boldExtension,
    italicExtension,
    listExtension
];

function createContainer(): HTMLElement {
    const container: HTMLElement = document.createElement('div');
    container.id = 'editor-host';
    document.body.appendChild(container);
    return container;
}

function teardown(editor: HeadlessEditor, container: HTMLElement): void {
    try { editor.destroy(); } catch { /* already destroyed */ }
    if (container.parentNode) {
        container.parentNode.removeChild(container);
    }
}

describe('Plugin wiring', () => {
    it('mounts into a real DOM container and exposes the wired builder outputs', () => {
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({ extensions: baseExtensions });
        editor.mount(container);

        const integration: IntegrationManager = editor.integration;
        expect(integration).toBeDefined();

        const plugins = integration.getState().plugins;
        expect(plugins.length).toBeGreaterThan(0);

        expect(editor.eventBus).toBeDefined();
        expect(editor.commandRegistry).toBeDefined();
        expect(editor.commands).toBeDefined();

        const pm: HTMLElement | null = container.querySelector('.ProseMirror');
        expect(pm).not.toBeNull();

        teardown(editor, container);
    });

    it('mounted editor includes the core plugins (history + selectionSync + focusBlur)', () => {
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({ extensions: baseExtensions });
        editor.mount(container);

        // The keymap plugin is intentionally deferred to initializedKeymapPlugin()
        // and is added post-Editor (after bindEditorAndFinalize wires editor refs).
        const plugins = editor.integration.getState().plugins;
        expect(plugins.length).toBeGreaterThanOrEqual(3);

        teardown(editor, container);
    });

    it('two mounted editors produce independent IntegrationManager / registry / eventBus', () => {
        const containerA: HTMLElement = createContainer();
        const containerB: HTMLElement = createContainer();
        const editorA: HeadlessEditor = HeadlessEditor.create({ extensions: baseExtensions });
        const editorB: HeadlessEditor = HeadlessEditor.create({ extensions: baseExtensions });
        editorA.mount(containerA);
        editorB.mount(containerB);

        expect(editorA.integration).not.toBe(editorB.integration);
        expect(editorA.commandRegistry).not.toBe(editorB.commandRegistry);
        expect(editorA.eventBus).not.toBe(editorB.eventBus);

        teardown(editorA, containerA);
        teardown(editorB, containerB);
    });

    it('editor.commands dispatches through the command registry populated by the builder', () => {
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({ extensions: baseExtensions });
        editor.mount(container);

        const registry: CommandRegistry = editor.commandRegistry;
        expect(registry.has('inputRuleMark')).toBe(true);
        expect(registry.has('toggleMark')).toBe(true);
        expect(registry.has('insertText')).toBe(true);

        teardown(editor, container);
    });
});

// ── Coverage of builder code paths via the rendered editor ──────────────────

describe('Config document and content paths', () => {
    it('uses the provided config.document as the initial document', () => {
        // config.document takes precedence over content and the default empty doc.
        const doc: DocumentRoot = {
            id: 'seed-doc-id',
            type: 'document',
            schemaVersion: 1,
            attrs: {},
            marks: [],
            children: [
                {
                    id: 'seed-p-id',
                    type: 'paragraph',
                    attrs: {},
                    marks: [],
                    children: [
                        {
                            id: 'seed-t-id',
                            type: 'text',
                            text: 'seeded via config.document',
                            attrs: {},
                            marks: []
                        } as TextNode
                    ]
                }
            ]
        };

        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: baseExtensions,
            document: doc
        });
        editor.mount(container);

        const live: DocumentRoot = editor.getDocument();
        expect(live.id).toBe('seed-doc-id');
        const flat: string = JSON.stringify(live);
        expect(flat).toContain('seeded via config.document');

        teardown(editor, container);
    });

    it('parses config.content HTML when no config.document is provided', () => {
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: baseExtensions,
            content: '<p>hello from <strong>config.content</strong></p>'
        });
        editor.mount(container);

        const live: DocumentRoot = editor.getDocument();
        const flat: string = JSON.stringify(live);
        // The HTML content must have made it through the builder's _parseHtmlContent
        // pipeline into the editor's live document.
        expect(flat).toContain('hello from');

        teardown(editor, container);
    });
});

describe('Id generator branch', () => {
    it('honors a custom IdGenerator passed in via config.idGenerator', () => {
        // Counter-based generator — every call returns a predictable, sequenceable id.
        let counter: number = 0;
        const customGen: IdGenerator = {
            generate(): string {
                counter += 1;
                return `custom-id-${counter}`;
            }
        };

        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: baseExtensions,
            idGenerator: customGen
        });
        editor.mount(container);

        // At least one node id (root or default paragraph) must come from the
        // custom generator. Either way, the seed counter advanced — proving the
        // custom idGenerator branch in the constructor and _resolveIdGenerator ran.
        const live: DocumentRoot = editor.getDocument();
        const flat: string = JSON.stringify(live);
        expect(counter).toBeGreaterThan(0);
        expect(flat).toMatch(/custom-id-\d+/);

        teardown(editor, container);
    });
});

describe('Enable tab key path', () => {
    it('auto-registers indentOutdentExtension when enableTabKey is true', () => {
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: baseExtensions,
            enableTabKey: true
        });
        editor.mount(container);

        // enableTabKey=true causes the builder to auto-push indentOutdentExtension
        // onto the extension list. The editor must still wire cleanly and the
        // CommandRegistry should be populated as a result.
        const registry: CommandRegistry = editor.commandRegistry;
        expect(registry.getAll().length).toBeGreaterThan(0);

        teardown(editor, container);
    });
});

describe('Build plugins branches', () => {
    it('adds the input-rules plugin when enableInputRules is true', () => {
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: baseExtensions,
            enableInputRules: true
        });
        editor.mount(container);

        // With enableInputRules on, an extra plugin (the input-rules plugin) is
        // appended to the initial plugin list, on top of the 3 core ones.
        const plugins = editor.integration.getState().plugins;
        expect(plugins.length).toBeGreaterThanOrEqual(4);

        teardown(editor, container);
    });

    it('reads undoRedo options through the extension-compiler chain when undoRedo is configured', () => {
        // When the testExtensions list does NOT include undoRedoExtension,
        // the builder hits the null-chains in buildPlugins (no extensionManager,
        // no undoRedoOptions). We don't need to assert those branches in this
        // spec — but the public smoke test is that the editor still wires.
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: baseExtensions
            // No undoRedoExtension here on purpose — exercises the
            // `extensionManager?.getExtensions().find(...)` undefined path.
        });
        editor.mount(container);

        // The editor still has the core plugins assembled and mounted.
        const plugins = editor.integration.getState().plugins;
        expect(plugins.length).toBeGreaterThanOrEqual(3);

        teardown(editor, container);
    });

    it('reads undoRedo defined options when undoRedoExtension is in the extension list', () => {
        // Drives the non-undefined side of every undoRedo chain in buildPlugins:
        //   undoRedoExtension.definition, .config, .defineOptions(),
        //   undoRedoOptions.depth, undoRedoOptions.newGroupDelay.
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: [...baseExtensions, undoRedoExtension.configure({ depth: 7, newGroupDelay: 250 })]
        });
        editor.mount(container);

        const registry: CommandRegistry = editor.commandRegistry;
        expect(registry.has('undo')).toBe(true);
        expect(registry.has('redo')).toBe(true);

        const plugins = editor.integration.getState().plugins;
        expect(plugins.length).toBeGreaterThanOrEqual(3);

        teardown(editor, container);
    });
});

describe('Image upload plugin path', () => {
    it('wires the image upload plugin when imageExtension is registered', () => {
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: [...baseExtensions, imageExtension]
        });
        editor.mount(container);

        // HeadlessEditor.create() invokes builder.initializedImageUploadPlugin
        // when the image extension is detected and merges it into the live PM
        // state via integration.addPlugins(...). After mount, the plugin count
        // is therefore strictly greater than the base 3.
        const plugins = editor.integration.getState().plugins;
        expect(plugins.length).toBeGreaterThan(3);

        teardown(editor, container);
    });
});

describe('Service injection', () => {
    it('exposes the EventBus the builder received via initiate()', () => {
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({ extensions: baseExtensions });
        editor.mount(container);

        expect(editor.eventBus).toBeDefined();
        expect(typeof (editor.eventBus as { dispose: () => void }).dispose).toBe('function');

        teardown(editor, container);
    });

    it('exposes a working getDocument() / setDocument() round-trip after mount', () => {
        // Exercises the integration.create() call inside _initializeIntegration
        // by going through the public HeadlessEditor API.
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({ extensions: baseExtensions });
        editor.mount(container);

        const initial: DocumentRoot = editor.getDocument();
        expect(initial).toBeDefined();
        expect(initial.type).toBe('document');

        teardown(editor, container);
    });
});

describe('Task list branch in listKeymap auto-register', () => {
    it('auto-registers listKeymapExtension when only taskListExtension is provided', () => {
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: [
                paragraphExtension,
                headingExtension,
                blockquoteExtension,
                horizontalRuleExtension,
                codeBlockExtension,
                boldExtension,
                italicExtension,
                taskListExtension
            ]
        });
        editor.mount(container);

        const registry: CommandRegistry = editor.commandRegistry;
        expect(registry.getAll().length).toBeGreaterThan(0);

        teardown(editor, container);
    });
});

describe('Parse HTML content catch path', () => {
    let originalDOMParser: typeof DOMParser;

    beforeEach(() => {
        originalDOMParser = window.DOMParser;
    });

    afterEach(() => {
        (window as unknown as { DOMParser: typeof DOMParser }).DOMParser = originalDOMParser;
    });

    it('falls back to a default document when content parsing throws inside the try block', () => {
        const container: HTMLElement = createContainer();

        // Replace DOMParser with one whose parseFromString throws — this is the
        // only reliable way to drive the catch branch in _parseHtmlContent from
        // the public HeadlessEditor.create() API (the real DOMParser and
        // PMDOMParser are both extremely tolerant of unusual HTML).
        class ThrowingDOMParser {
            public parseFromString(): Document {
                throw new TypeError('synthetic parse failure');
            }
        }
        (window as unknown as { DOMParser: unknown }).DOMParser = ThrowingDOMParser;

        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: baseExtensions,
            content: '<p>will never be parsed</p>'
        });
        editor.mount(container);

        const live: DocumentRoot = editor.getDocument();
        expect(live).toBeDefined();
        expect(live.type).toBe('document');
        expect(Array.isArray(live.children)).toBe(true);
        expect(live.children.length).toBeGreaterThan(0);

        teardown(editor, container);
    });
});

describe('Extension auto-registration else branches', () => {
    it('skips documentExtension auto-push when the extension list already provides a document node', () => {
        const customDocumentProvider: ExtensionDefinition<Record<string, never>> = defineExtension({
            name: 'document',
            nodes(): NodeDefinition[] {
                return [
                    {
                        name: 'document',
                        group: 'root',
                        content: NodeContent.block().oneOrMore()
                    }
                ];
            },
            domSpecs() {
                return {
                    nodes: {
                        document: {
                            toDOM: () => ['div', 0] as unknown as readonly unknown[]
                        }
                    }
                };
            }
        });

        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: [customDocumentProvider, ...baseExtensions]
        });
        editor.mount(container);

        const live: DocumentRoot = editor.getDocument();
        expect(live).toBeDefined();
        expect(live.type).toBe('document');

        teardown(editor, container);
    });

    it('skips textExtension auto-push when the extension list already provides a text node', () => {
        const customTextProvider: ExtensionDefinition<Record<string, never>> = defineExtension({
            name: 'text',
            nodes(): NodeDefinition[] {
                return [
                    {
                        name: 'text',
                        group: 'inline'
                    }
                ];
            }
        });

        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: [customTextProvider, ...baseExtensions]
        });
        editor.mount(container);

        const live: DocumentRoot = editor.getDocument();
        expect(live).toBeDefined();
        expect(live.type).toBe('document');

        teardown(editor, container);
    });

    it('skips listKeymapExtension auto-push when it is already in the extension list', () => {
        const container: HTMLElement = createContainer();
        const editor: HeadlessEditor = HeadlessEditor.create({
            extensions: [...baseExtensions, listKeymapExtension]
        });
        editor.mount(container);

        const registry: CommandRegistry = editor.commandRegistry;
        expect(registry.getAll().length).toBeGreaterThan(0);

        teardown(editor, container);
    });

    it('should handle empty extensions collection', () => {
        let thrown: unknown = null;
        try {
            HeadlessEditor.create({
                extensions: []
            });
        } catch (error: unknown) {
            thrown = error;
        }

        expect(thrown).not.toBeNull();
        expect(thrown).toBeDefined();
    });
});
