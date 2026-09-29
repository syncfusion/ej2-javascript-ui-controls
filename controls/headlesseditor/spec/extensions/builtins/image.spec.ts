/**
 * This spec file contains test cases for:
 * - Image Extension
 */

import {
    DocumentRoot,
    EditorNode,
    HeadlessEditor,
    ImageOptions,
    TextNode,
    ExtensionDOMSpecs,
    ExtensionScope,
    ExtensionDefinition,
    NodeViewConstructor,
    boldExtension,
    indentOutdentExtension,
    listExtension,
    tableExtension,
    getDefaultDisplay,
    getDefaultSaveFormat,
    imageExtension,
    paragraphExtension,
    undoRedoExtension
} from '../../../src/index';
import { addCaptionCommand, setImageDisplayCommand, toggleCaptionCommand, updateImageCommand } from '../../../src/commands/builtins/image';
import { buildEditorState } from '../../../src/pm/adapters/editor-state-adapter';
import type { PMCommandContext } from '../../../src/commands/internal/pm-command-context';
import type { PMEditorState } from '../../../src/pm/pm-guard';
import type { EditorState } from '../../../src/model/editor-state';

interface ImageNode extends EditorNode {
    type: 'image' | 'imageInline';
    children: EditorNode[];
}

interface ImageAttributes {
    src?: string;
    alt?: string;
    title?: string;
    width?: number | null;
    height?: number | null;
    display?: 'block' | 'inline';
    align?: 'left' | 'center' | 'right' | 'none';
    wrap?: 'left' | 'right' | 'none';
    caption?: boolean;
}

interface ViewSurface {
    dom: HTMLElement;
    someProp: (name: string, callback: (handler: Function) => void) => void;
}

interface ImageParseRule {
    getAttrs?: (dom: unknown) => Record<string, unknown> | false;
}

interface ImagePluginSurface {
    props?: {
        handleKeyDown?: (view: unknown, event: KeyboardEvent) => boolean;
    };
}

/**
 * Creates a typed text node for a real editor document.
 *
 * @param {string} text Text content.
 * @returns {TextNode} A text node.
 */
function textNode(text: string): TextNode {
    return {
        type: 'text',
        id: crypto.randomUUID(),
        attrs: {},
        children: [],
        text,
        marks: []
    } as TextNode;
}

/**
 * Creates a typed block or inline image node for a real editor document.
 *
 * @param {ImageAttributes} attributes Image attributes.
 * @param {EditorNode[]} children Optional image caption children.
 * @returns {ImageNode} An image node.
 */
function imageNode(attributes: ImageAttributes = {}, children: EditorNode[] = []): ImageNode {
    return {
        type: attributes.display === 'inline' ? 'imageInline' : 'image',
        id: crypto.randomUUID(),
        attrs: {
            src: 'https://example.com/image.png',
            alt: '',
            title: '',
            width: null,
            height: null,
            display: 'block',
            align: 'none',
            wrap: 'none',
            caption: false,
            ...attributes
        },
        children,
        marks: []
    };
}

/**
 * Creates a paragraph node used to exercise insertion boundaries.
 *
 * @param {string} text Optional paragraph text.
 * @returns {EditorNode} A paragraph node.
 */
function paragraphNode(text: string = ''): EditorNode {
    return {
        type: 'paragraph',
        id: crypto.randomUUID(),
        attrs: {},
        marks: [],
        children: text ? [textNode(text)] : []
    };
}

/**
 * Creates the document root accepted by HeadlessEditor.create.
 *
 * @param {EditorNode[]} children Top-level document nodes.
 * @returns {DocumentRoot} A document root.
 */
function documentRoot(children: EditorNode[]): DocumentRoot {
    return {
        type: 'document',
        id: crypto.randomUUID(),
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children
    };
}

describe('HeadlessEditor Image Extension', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;
    let configuredExtensions: ExtensionDefinition[] = [];

    /**
     * Mounts a real editor instance into the current test container.
     *
     * @param {EditorNode[]} children Initial document nodes.
     * @param {ImageOptions} options Image extension options.
     * @returns {void} Nothing.
     */
    function mountEditor(children: EditorNode[], options: ImageOptions = {}): void {
        editor = HeadlessEditor.create({
            document: documentRoot(children),
            extensions: [
                paragraphExtension,
                imageExtension.configure(options),
                undoRedoExtension,
                ...configuredExtensions
            ]
        });
        editor.mount(container);
    }

    /**
     * Returns the first image node from the editor's public document model.
     *
     * @returns {ImageNode} The first image node.
     */
    function selectedImage(): ImageNode {
        const findImage: (nodes: EditorNode[]) => ImageNode | undefined =
            (nodes: EditorNode[]): ImageNode | undefined => {
                for (const node of nodes) {
                    if (node.type === 'image' || node.type === 'imageInline') {
                        return node as ImageNode;
                    }
                    const nestedImage: ImageNode | undefined = findImage(node.children);
                    if (nestedImage) {
                        return nestedImage;
                    }
                }
                return undefined;
            };
        return findImage(editor.getDocument().children) as ImageNode;
    }

    /**
     * Selects the mounted block image through the public editor API.
     *
     * @returns {void} Nothing.
     */
    function selectImage(): void {
        const view: ViewSurface & {
            state: {
                doc: {
                    descendants: (callback: (node: { type: { name: string } }, position: number) => boolean) => void;
                };
            };
        } = editor.integration.getView() as unknown as ViewSurface & {
            state: {
                doc: {
                    descendants: (callback: (node: { type: { name: string } }, position: number) => boolean) => void;
                };
            };
        };
        const imageElement: HTMLImageElement = container.querySelector(
            'img'
        ) as HTMLImageElement;
        const click: MouseEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        });
        Object.defineProperty(click, 'target', { value: imageElement });
        let imagePosition: number | undefined;
        let pmImage: unknown;
        view.state.doc.descendants((node: { type: { name: string } }, position: number): boolean => {
            if (node.type.name === 'image' || node.type.name === 'imageInline') {
                imagePosition = position;
                pmImage = node;
                return false;
            }
            return true;
        });
        if (imagePosition === undefined || !pmImage) {
            throw new Error('The test editor must contain an image node.');
        }
        view.someProp('handleClickOn', (handler: Function): void => {
            handler(view, imagePosition, pmImage, imagePosition, click, true);
        });
    }

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        mountEditor([imageNode()]);
    });

    afterEach(() => {
        if (editor && !editor.isDestroyed) {
            editor.destroy();
        }
        container.remove();
        configuredExtensions = [];
    });

    describe('configuration and schema', () => {
        it('exposes image metadata and independent defaults', () => {
            expect(imageExtension.name).toBe('image');
            const defineOptions: NonNullable<typeof imageExtension.config.defineOptions> =
                imageExtension.config.defineOptions as NonNullable<typeof imageExtension.config.defineOptions>;
            if (!defineOptions) {
                throw new Error('Image extension must define options.');
            }
            const first: ImageOptions = defineOptions();
            const second: ImageOptions = defineOptions();

            expect(first).toEqual({
                allowBase64: true,
                htmlAttributes: {},
                saveFormat: 'blob',
                display: 'block',
                align: 'none',
                wrap: 'none',
                resize: { enabled: true, alwaysPreserveAspectRatio: true }
            });
            expect(first).not.toBe(second);
        });

        it('renders the initially mounted image and applies configured defaults', () => {
            expect(editor.getHtml()).toContain('<figure');
            expect(editor.getHtml()).toContain(
                'src="https://example.com/image.png"'
            );
            expect(editor.getHtml()).toContain(
                'class="e-img-core-element e-img-block"'
            );
            expect(editor.getHtml()).not.toContain('undefined');

            const configured: typeof imageExtension = imageExtension.configure({
                saveFormat: 'base64',
                display: 'inline'
            });
            const configuredOptions: NonNullable<typeof configured.config.defineOptions> =
                configured.config.defineOptions as NonNullable<typeof configured.config.defineOptions>;
            if (!configuredOptions) {
                throw new Error('Configured image extension must define options.');
            }
            expect(configuredOptions()).toEqual({
                allowBase64: true,
                htmlAttributes: {},
                saveFormat: 'base64',
                display: 'inline',
                align: 'none',
                wrap: 'none',
                resize: { enabled: true, alwaysPreserveAspectRatio: true }
            });
            expect(getDefaultSaveFormat(imageExtension)).toBe('blob');
            expect(getDefaultDisplay(imageExtension)).toBe('block');
            expect(getDefaultSaveFormat(configured)).toBe('base64');
            expect(getDefaultDisplay(configured)).toBe('inline');
            expect(getDefaultSaveFormat({} as typeof imageExtension)).toBe('blob');
            expect(getDefaultDisplay({} as typeof imageExtension)).toBe('block');
        });

        it('registers block and inline image nodes and all image commands', () => {
            const nodeFactory: NonNullable<typeof imageExtension.config.nodes> =
                imageExtension.config.nodes as NonNullable<typeof imageExtension.config.nodes>;
            const commandFactory: NonNullable<typeof imageExtension.config.commands> =
                imageExtension.config.commands as NonNullable<typeof imageExtension.config.commands>;
            if (!nodeFactory || !commandFactory) {
                throw new Error('Image extension must register nodes and commands.');
            }
            const scope: ExtensionScope<object> = { options: {} } as ExtensionScope<object>;
            const nodes: ReturnType<typeof nodeFactory> = nodeFactory.call(scope);
            const commands: ReturnType<typeof commandFactory> = commandFactory.call(scope, {} as never);

            expect(
                nodes.map((node: { name: string }): string => node.name)
            ).toEqual(['image', 'imageInline']);
            expect(nodes[0].group).toBe('block');
            expect(nodes[0].content).toBeDefined();
            expect(nodes[1].group).toBe('inline');
            expect(nodes[1].inline).toBe(true);
            expect(
                commands.map(
                    (command: { name: string }): string => command.name
                )
            ).toEqual([
                'insertImage',
                'removeImage',
                'updateImage',
                'setImageAlign',
                'setImageWrap',
                'setImageDisplay',
                'setImageDimension',
                'addCaption',
                'removeCaption',
                'toggleCaption'
            ]);
        });
    });

    describe('insertion and document state', () => {
        it('inserts a block image at the cursor and keeps a trailing paragraph', () => {
            editor.destroy();
            mountEditor([paragraphNode('Before')]);
            editor.commands.setSelection({ from: 7, to: 7 });

            expect(
                editor.commands.insertImage({
                    src: 'blob:image',
                    alt: 'Inserted',
                    title: 'Title',
                    width: 320,
                    height: 180
                })
            ).toBe(true);

            const html: string = editor.getHtml();
            expect(html).toContain('src="blob:image"');
            expect(html).toContain('alt="Inserted"');
            expect(html).toContain('title="Title"');
            expect(html).toContain('width="320"');
            expect(html).toContain('height="180"');
            const documentChildren: EditorNode[] = editor.getDocument().children;
            expect(documentChildren.length).toBe(3);
            expect(documentChildren[0].type).toBe('paragraph');
            expect((documentChildren[0].children[0] as TextNode).text).toBe('Before');
            expect(documentChildren[1].type).toBe('image');
            expect((documentChildren[1] as ImageNode).attrs['src']).toBe('blob:image');
            expect(documentChildren[2].type).toBe('paragraph');
            expect(documentChildren[2].children.length).toBe(0);
        });

        it('inserts a captioned block image and trims caption text', () => {
            editor.commands.setSelection({ from: 1, to: 1 });
            expect(
                editor.commands.insertImage({
                    src: 'https://example.com/caption.png',
                    caption: '  A caption  '
                })
            ).toBe(true);

            expect(editor.getHtml()).toContain(
                '<figcaption class="e-img-figcaption">A caption</figcaption>'
            );
            expect(selectedImage().attrs['caption']).toBe(true);
            expect((selectedImage().children[0] as TextNode).text).toBe(
                'A caption'
            );
        });

        it('inserts a batch of images and an inline image', () => {
            editor.commands.setSelection({ from: 1, to: 1 });
            expect(
                editor.commands.insertImage([
                    { src: 'https://example.com/one.png' },
                    { src: 'https://example.com/two.png', alt: 'Two' }
                ])
            ).toBe(true);
            expect(editor.getHtml()).toContain('https://example.com/one.png');
            expect(editor.getHtml()).toContain('https://example.com/two.png');

            editor.destroy();
            mountEditor([paragraphNode('Inline')]);
            editor.commands.setSelection({ from: 1, to: 1 });
            expect(
                editor.commands.insertImage({
                    src: 'https://example.com/inline.png',
                    display: 'inline',
                    align: 'center',
                    wrap: 'right'
                })
            ).toBe(true);
            expect(editor.getHtml()).toContain('e-img-inline');
            expect(editor.getHtml()).toContain('e-img-align-center');
            expect(editor.getHtml()).toContain('e-img-wrap-right');
        });

        it('rejects empty, whitespace-only, and empty-batch insertion payloads', () => {
            const originalHtml: string = editor.getHtml();
            expect(editor.commands.insertImage({ src: '' })).toBe(false);
            expect(editor.commands.insertImage({ src: '   ' })).toBe(false);
            expect(editor.commands.insertImage([])).toBe(false);
            expect(editor.getHtml()).toBe(originalHtml);
        });
    });

    describe('updates and layout commands', () => {
        it('updates source, text, dimensions, and serialized custom attributes', () => {
            selectImage();
            expect(
                editor.commands.updateImage({
                    src: 'https://example.com/updated.png',
                    alt: 'Updated',
                    title: 'Updated title',
                    width: 640,
                    height: 360,
                    attributes: { loading: 'lazy', 'data-kind': 'hero' }
                })
            ).toBe(true);

            expect(selectedImage().attrs).toEqual(
                jasmine.objectContaining({
                    src: 'https://example.com/updated.png',
                    alt: 'Updated',
                    title: 'Updated title',
                    width: 640,
                    height: 360,
                    attributes: JSON.stringify({
                        loading: 'lazy',
                        'data-kind': 'hero'
                    })
                })
            );
            expect(editor.commands.updateImage({ attributes: {} })).toBe(true);
            expect(selectedImage().attrs['attributes']).toBe('{}');
        });

        it('updates dimensions independently and preserves an omitted dimension', () => {
            selectImage();
            expect(
                editor.commands.setImageDimension({ width: 200, height: 100 })
            ).toBe(true);
            expect(editor.commands.setImageDimension({ width: 240 })).toBe(
                true
            );
            expect(selectedImage().attrs['width']).toBe(240);
            expect(selectedImage().attrs['height']).toBe(100);
            expect(editor.getHtml()).toContain('width="240"');
        });

        it('clears wrapping when alignment is applied and clears alignment when wrapping is applied', () => {
            selectImage();
            expect(editor.commands.setImageWrap({ wrap: 'left' })).toBe(true);
            expect(selectedImage().attrs['wrap']).toBe('left');
            expect(selectedImage().attrs['align']).toBe('none');
            expect(editor.getHtml()).toContain('e-img-wrap-left');

            expect(editor.commands.setImageAlign({ align: 'right' })).toBe(
                true
            );
            expect(selectedImage().attrs['align']).toBe('right');
            expect(selectedImage().attrs['wrap']).toBe('none');
            expect(editor.getHtml()).toContain('e-img-align-right');
            expect(editor.getHtml()).not.toContain('e-img-wrap-left');
        });

        it('applies every supported alignment value through the real command', () => {
            const alignments: Array<'left' | 'center' | 'right' | 'none'> = [
                'left',
                'center',
                'right',
                'none'
            ];

            alignments.forEach((align: 'left' | 'center' | 'right' | 'none'): void => {
                selectImage();
                expect(editor.commands.setImageAlign({ align })).toBe(true);
                expect(selectedImage().attrs['align']).toBe(align);
                expect(selectedImage().attrs['wrap']).toBe('none');
                if (align === 'none') {
                    expect(editor.getHtml()).not.toContain('e-img-align-');
                } else {
                    expect(editor.getHtml()).toContain(`e-img-align-${align}`);
                }
            });
        });

        it('applies every supported wrapping value through the real command', () => {
            const wraps: Array<'left' | 'right' | 'none'> = [
                'left',
                'right',
                'none'
            ];

            wraps.forEach((wrap: 'left' | 'right' | 'none'): void => {
                selectImage();
                expect(editor.commands.setImageWrap({ wrap })).toBe(true);
                expect(selectedImage().attrs['wrap']).toBe(wrap);
                if (wrap === 'none') {
                    expect(editor.getHtml()).not.toContain('e-img-wrap-');
                } else {
                    expect(selectedImage().attrs['align']).toBe('none');
                    expect(editor.getHtml()).toContain(`e-img-wrap-${wrap}`);
                }
            });
        });

        it('rejects image updates when a paragraph is selected', () => {
            editor.destroy();
            mountEditor([paragraphNode('Text')]);
            const originalHtml: string = editor.getHtml();
            editor.commands.setSelection({ from: 1, to: 1 });

            expect(
                editor.commands.updateImage({
                    src: 'https://example.com/nope.png'
                })
            ).toBe(false);
            expect(editor.commands.removeImage()).toBe(false);
            expect(editor.commands.setImageAlign({ align: 'center' })).toBe(
                false
            );
            expect(editor.commands.setImageWrap({ wrap: 'right' })).toBe(false);
            expect(editor.commands.setImageDimension({ width: 1 })).toBe(false);
            expect(editor.getHtml()).toBe(originalHtml);
        });
    });

    describe('display conversion and captions', () => {
        it('converts a selected block image to inline and back while preserving source', () => {
            selectImage();
            expect(editor.commands.setImageDisplay({ mode: 'inline' })).toBe(
                true
            );
            expect(selectedImage().type).toBe('imageInline');
            expect(selectedImage().attrs['display']).toBe('inline');
            expect(editor.getHtml()).toContain('e-img-inline');

            expect(editor.commands.setImageDisplay({ mode: 'block' })).toBe(
                true
            );
            expect(selectedImage().type).toBe('image');
            expect(selectedImage().attrs['display']).toBe('block');
            expect(editor.getHtml()).toContain('e-img-block');
            expect(editor.getHtml()).toContain('https://example.com/image.png');
        });

        it('converts an inline image in a paragraph into a block image and preserves surrounding text', () => {
            editor.destroy();
            mountEditor([
                paragraphNode(),
                {
                    type: 'paragraph',
                    id: crypto.randomUUID(),
                    attrs: {},
                    marks: [],
                    children: [
                        textNode('Before '),
                        imageNode({ display: 'inline' }),
                        textNode(' after')
                    ]
                }
            ]);
            selectImage();

            expect(editor.commands.setImageDisplay({ mode: 'block' })).toBe(true);
            expect(selectedImage().type).toBe('image');
            expect(selectedImage().attrs['display']).toBe('block');
            expect(editor.getHtml()).toContain('Before');
            expect(editor.getHtml()).toContain('after');
            expect(editor.getHtml()).toContain('e-img-block');
        });

        it('converts an inline image selected within a text range using the first matching image', () => {
            editor.destroy();
            mountEditor([{
                type: 'paragraph',
                id: crypto.randomUUID(),
                attrs: {},
                marks: [],
                children: [textNode('Before '), imageNode({ display: 'inline' }), textNode(' after')]
            }]);
            editor.commands.setSelection({ from: 1, to: 10 });

            expect(editor.commands.setImageDisplay({ mode: 'block' })).toBe(true);
            expect(selectedImage().type).toBe('image');
            expect(editor.getHtml()).toContain('Before');
            expect(editor.getHtml()).toContain('after');
        });

        it('converts an inline image that is the only child of its paragraph', () => {
            editor.destroy();
            mountEditor([{
                type: 'paragraph',
                id: crypto.randomUUID(),
                attrs: {},
                marks: [],
                children: [imageNode({ display: 'inline' })]
            }]);
            selectImage();

            expect(editor.commands.setImageDisplay({ mode: 'block' })).toBe(true);
            expect(selectedImage().type).toBe('image');
            expect(editor.getHtml()).toContain('<figure');
        });

        it('appends a converted inline image to a preceding paragraph', () => {
            editor.destroy();
            mountEditor([
                paragraphNode('Before'),
                {
                    type: 'paragraph',
                    id: crypto.randomUUID(),
                    attrs: {},
                    marks: [],
                    children: [imageNode({ display: 'inline' })]
                }
            ]);
            selectImage();

            expect(editor.commands.setImageDisplay({ mode: 'block' })).toBe(true);
            expect(selectedImage().type).toBe('image');
            expect(editor.getHtml()).toContain('Before');
            const documentChildren: EditorNode[] = editor.getDocument().children;
            expect(documentChildren.length).toBe(2);
            expect(documentChildren[0].type).toBe('paragraph');
            expect((documentChildren[0].children[0] as TextNode).text).toBe('Before');
            expect(documentChildren[1].type).toBe('image');
        });

        it('prepends a converted inline image to a following paragraph', () => {
            editor.destroy();
            mountEditor([
                {
                    type: 'paragraph',
                    id: crypto.randomUUID(),
                    attrs: {},
                    marks: [],
                    children: [imageNode({ display: 'inline' })]
                },
                paragraphNode('After')
            ]);
            selectImage();

            expect(editor.commands.setImageDisplay({ mode: 'block' })).toBe(true);
            expect(selectedImage().type).toBe('image');
            expect(editor.getHtml()).toContain('After');
            const documentChildren: EditorNode[] = editor.getDocument().children;
            expect(documentChildren.length).toBe(2);
            expect(documentChildren[0].type).toBe('image');
            expect(documentChildren[1].type).toBe('paragraph');
            expect((documentChildren[1].children[0] as TextNode).text).toBe('After');
        });

        it('wraps a converted block image in a paragraph when no inline sibling exists', () => {
            editor.destroy();
            mountEditor([imageNode()]);
            selectImage();

            expect(editor.commands.setImageDisplay({ mode: 'inline' })).toBe(true);
            expect(selectedImage().type).toBe('imageInline');
            expect(editor.getHtml()).toContain('e-img-inline');
            const documentChildren: EditorNode[] = editor.getDocument().children;
            expect(documentChildren.length).toBe(1);
            expect(documentChildren[0].type).toBe('paragraph');
            expect(documentChildren[0].children.length).toBe(1);
            expect(documentChildren[0].children[0].type).toBe('imageInline');
        });

        it('does not change an image already in block mode', () => {
            const originalHtml: string = editor.getHtml();
            selectImage();
            expect(editor.commands.setImageDisplay({ mode: 'block' })).toBe(false);
            expect(editor.getHtml()).toBe(originalHtml);
            expect(selectedImage().type).toBe('image');
        });

        it('returns false when the selection has no image or when the image already matches the target display', () => {
            editor.destroy();
            mountEditor([paragraphNode('No image here')]);
            editor.commands.setSelection({ from: 1, to: 1 });
            expect(editor.commands.setImageDisplay({ mode: 'inline' })).toBe(false);

            editor.destroy();
            mountEditor([imageNode({ display: 'inline' })]);
            selectImage();
            expect(editor.commands.setImageDisplay({ mode: 'inline' })).toBe(false);
            expect(selectedImage().type).toBe('imageInline');
        });

        it('converts an inline image beside text blocks and exits cleanly when the schema is missing image node types', () => {
            editor.destroy();
            mountEditor([
                paragraphNode('Before'),
                imageNode(),
                paragraphNode('After')
            ]);
            selectImage();
            expect(editor.commands.setImageDisplay({ mode: 'inline' })).toBe(true);
            expect(selectedImage().type).toBe('imageInline');
            const previousTextDocument: EditorNode[] = editor.getDocument().children;
            expect(previousTextDocument.length).toBe(2);
            expect(previousTextDocument[0].type).toBe('paragraph');
            expect((previousTextDocument[0].children[0] as TextNode).text).toBe('Before');
            expect(previousTextDocument[1].type).toBe('paragraph');
            expect((previousTextDocument[1].children[0] as TextNode).text).toBe('After');

            editor.destroy();
            mountEditor([
                imageNode(),
                paragraphNode('After')
            ]);
            selectImage();
            expect(editor.commands.setImageDisplay({ mode: 'inline' })).toBe(true);
            expect(selectedImage().type).toBe('imageInline');
            const nextTextDocument: EditorNode[] = editor.getDocument().children;
            expect(nextTextDocument.length).toBe(1);
            expect(nextTextDocument[0].type).toBe('paragraph');
            expect(nextTextDocument[0].children[0].type).toBe('imageInline');
            expect((nextTextDocument[0].children[1] as TextNode).text).toBe('After');

            editor.destroy();
            mountEditor([{
                type: 'paragraph',
                id: crypto.randomUUID(),
                attrs: {},
                marks: [],
                children: [imageNode({ display: 'block' })]
            }]);
            selectImage();
            expect(editor.commands.setImageDisplay({ mode: 'inline' })).toBe(true);
            expect(selectedImage().type).toBe('imageInline');

            editor.destroy();
            mountEditor([imageNode()]);
            const pmState: PMEditorState = editor.integration.getState();
            const originalImageType: unknown = pmState.schema.nodes['image'];
            const originalInlineType: unknown = pmState.schema.nodes['imageInline'];
            (pmState.schema.nodes as Record<string, unknown>)['image'] = undefined;
            (pmState.schema.nodes as Record<string, unknown>)['imageInline'] = undefined;
            const editorState: EditorState = buildEditorState(pmState, editor.integration.isMounted);
            const commandContext: PMCommandContext = {
                editorState,
                selection: editorState.selection,
                document: editorState.document,
                editor: { commandRegistry: null },
                pmState,
                dispatch: (): void => undefined
            };
            expect(() => setImageDisplayCommand.execute(commandContext, { mode: 'inline' })).not.toThrow();
            (pmState.schema.nodes as Record<string, unknown>)['image'] = originalImageType;
            (pmState.schema.nodes as Record<string, unknown>)['imageInline'] = originalInlineType;
        });

        it('adds a caption, rejects a second add, and toggles it off', () => {
            selectImage();
            expect(editor.commands.addCaption({ caption: '  First caption  ' })).toBe(true);
            expect(editor.getHtml()).toContain('First caption');
            expect(editor.commands.addCaption({ caption: 'Second' })).toBe(false);
            selectImage();
            expect(editor.commands.toggleCaption()).toBe(true);
            expect(editor.getHtml()).not.toContain('First caption');
            expect(editor.getHtml()).not.toContain('figcaption');
            expect(selectedImage().attrs['caption']).toBe(false);
            expect(editor.commands.removeCaption()).toBe(false);
        });

        it('covers default caption text, existing caption content, and no-image command paths', () => {
            selectImage();
            expect(editor.commands.addCaption()).toBe(true);
            expect(editor.getHtml()).toContain('Insert caption');
            expect(editor.getSelection().empty).toBe(true);

            selectImage();
            expect(editor.commands.addCaption()).toBe(false);
            expect(editor.commands.removeCaption()).toBe(true);
            expect(editor.getHtml()).not.toContain('Insert caption');
            expect(editor.getSelection().empty).toBe(false);

            editor.destroy();
            mountEditor([imageNode({ caption: false }, [textNode('Existing content')])]);
            selectImage();
            expect(editor.commands.addCaption()).toBe(false);
            expect(editor.commands.removeCaption()).toBe(true);
            expect(editor.getHtml()).not.toContain('Existing content');

            editor.destroy();
            mountEditor([paragraphNode('No image selected')]);
            editor.commands.setSelection({ from: 1, to: 1 });
            expect(editor.commands.addCaption()).toBe(false);
            expect(editor.commands.removeCaption()).toBe(false);
            expect(editor.commands.toggleCaption()).toBe(false);
            expect(editor.getHtml()).toContain('No image selected');
        });

        it('executes the real toggle add branch and caption early-return branches', () => {
            selectImage();
            expect(editor.commands.toggleCaption({ caption: 'Toggled caption' })).toBe(true);
            expect(editor.getHtml()).toContain('Toggled caption');

            editor.destroy();
            mountEditor([paragraphNode('No image')]);
            const pmState: PMEditorState = editor.integration.getState();
            const editorState: EditorState = buildEditorState(pmState, editor.integration.isMounted);
            const commandContext: PMCommandContext = {
                editorState,
                selection: editorState.selection,
                document: editorState.document,
                editor: { commandRegistry: editor.commandRegistry },
                dispatch: (): void => {
                    throw new Error('Caption early-return path must not dispatch.');
                },
                pmState
            };

            addCaptionCommand.execute(commandContext, {});
            toggleCaptionCommand.execute(commandContext, {});
            expect(editor.getHtml()).toContain('No image');
        });

        it('returns from update execution when the selected node is not an image', () => {
            editor.destroy();
            mountEditor([paragraphNode('No image')]);
            editor.commands.setSelection({ from: 1, to: 1 });
            const originalHtml: string = editor.getHtml();
            const pmState: PMEditorState = editor.integration.getState();
            const editorState: EditorState = buildEditorState(pmState, editor.integration.isMounted);
            let dispatched: boolean = false;
            const commandContext: PMCommandContext = {
                editorState,
                selection: editorState.selection,
                document: editorState.document,
                editor: { commandRegistry: editor.commandRegistry },
                dispatch: (): void => {
                    dispatched = true;
                },
                pmState
            };

            updateImageCommand.execute(commandContext, {
                src: 'https://example.com/should-not-update.png'
            });

            expect(dispatched).toBe(false);
            expect(editor.getHtml()).toBe(originalHtml);
        });

        it('preserves alignment and wrapping on a captioned block image', () => {
            editor.destroy();
            mountEditor([imageNode({ caption: true, align: 'center', wrap: 'none' }, [textNode('Caption')])]);
            expect(editor.getHtml()).toContain('figcaption');
            selectImage();
            expect(editor.commands.setImageAlign({ align: 'left' })).toBe(true);
            expect(editor.commands.setImageWrap({ wrap: 'right' })).toBe(true);
            expect(selectedImage().attrs['align']).toBe('none');
            expect(selectedImage().attrs['wrap']).toBe('right');
            expect(editor.getHtml()).toContain('e-img-wrap-right');
            expect(editor.getHtml()).toContain('Caption');
        });

        it('adds a caption through the command used by a dropdown and places the cursor in it', () => {
            selectImage();
            expect(editor.commands.addCaption({ caption: 'Dropdown caption' })).toBe(true);
            expect(editor.getHtml()).toContain('Dropdown caption');
            expect(editor.getSelection().empty).toBe(true);
            const selection: {
                empty: boolean;
                $from: {
                    parent: { type: { name: string }; textContent: string };
                    parentOffset: number;
                };
            } = editor.integration.getState().selection as unknown as {
                empty: boolean;
                $from: {
                    parent: { type: { name: string }; textContent: string };
                    parentOffset: number;
                };
            };
            expect(selection.$from.parent.type.name).toBe('image');
            expect(selection.$from.parent.textContent).toBe('Dropdown caption');
            expect(selection.$from.parentOffset).toBe('Dropdown caption'.length);

            selectImage();
            expect(editor.commands.toggleCaption()).toBe(true);
            expect(editor.getHtml()).not.toContain('Dropdown caption');
            expect(editor.getHtml()).not.toContain('figcaption');
        });

        it('removes block caption content when converting the image to inline', () => {
            editor.destroy();
            mountEditor([imageNode({ caption: true }, [textNode('Remove on inline')])]);
            selectImage();
            expect(editor.commands.setImageDisplay({ mode: 'inline' })).toBe(true);
            expect(selectedImage().type).toBe('imageInline');
            expect(selectedImage().attrs['caption']).toBe(false);
            expect(selectedImage().children.length).toBe(0);
            expect(editor.getHtml()).toContain('e-img-inline');
            expect(editor.getHtml()).not.toContain('figcaption');
        });

        it('does not expose caption commands for inline images', () => {
            editor.destroy();
            mountEditor([imageNode({ display: 'inline' })]);
            expect(editor.commands.addCaption({ caption: 'No caption' })).toBe(
                false
            );
            expect(editor.commands.removeCaption()).toBe(false);
            expect(
                editor.commands.toggleCaption({ caption: 'No caption' })
            ).toBe(false);
            expect(editor.getHtml()).not.toContain('figcaption');
        });

        it('removes the selected image and keeps the document editable', () => {
            selectImage();
            expect(editor.commands.removeImage()).toBe(true);
            expect(editor.getHtml()).toBe('<p></p>');
            expect(
                editor.commands.insertImage({
                    src: 'https://example.com/after.png'
                })
            ).toBe(true);
            expect(editor.getHtml()).toContain('after.png');
        });

        it('supports undo and redo across image updates', () => {
            selectImage();
            const originalHtml: string = editor.getHtml();
            editor.commands.updateImage({ alt: 'Changed' });
            const changedHtml: string = editor.getHtml();
            expect(editor.commands.undo()).toBe(true);
            expect(editor.getHtml()).toBe(originalHtml);
            expect(editor.commands.redo()).toBe(true);
            expect(editor.getHtml()).toBe(changedHtml);
        });
    });

    describe('DOM handlers and node views', () => {
        it('parses block, captioned, inline, and invalid image DOM shapes', () => {
            const domSpecFactory: NonNullable<typeof imageExtension.config.domSpecs> =
                imageExtension.config.domSpecs as NonNullable<typeof imageExtension.config.domSpecs>;
            const domScope: ExtensionScope<object> = { options: {} } as ExtensionScope<object>;
            const specs: ExtensionDOMSpecs = domSpecFactory.call(domScope);
            const blockRules: ImageParseRule[] = specs.nodes.image.parseDOM as ImageParseRule[];
            const inlineRules: ImageParseRule[] = specs.nodes.imageInline.parseDOM as ImageParseRule[];
            const figure: HTMLElement = document.createElement('figure');
            figure.className = 'e-img-align-center e-img-wrap-right';
            figure.innerHTML = '<img class="e-img-align-left e-img-wrap-left" src="block.png" alt="Block" width="12" height="8"><figcaption>Caption</figcaption>';
            const plainFigure: HTMLElement = document.createElement('figure');
            plainFigure.innerHTML = '<img src="plain.png">';
            const invalidFigure: HTMLElement = document.createElement('figure');
            invalidFigure.innerHTML = '<img src="one.png"><img src="two.png">';
            const emptyFigure: HTMLElement = document.createElement('figure');
            const imageWithoutClasses: HTMLImageElement = document.createElement('img');
            imageWithoutClasses.setAttribute('src', 'defaults.png');
            emptyFigure.appendChild(imageWithoutClasses);
            const inline: HTMLImageElement = document.createElement('img');
            inline.className = 'e-img-inline e-img-align-right e-img-wrap-left';
            inline.setAttribute('src', 'inline.png');
            inline.setAttribute('width', '20');
            inline.setAttribute('height', '10');
            const inlineCenter: HTMLImageElement = document.createElement('img');
            inlineCenter.className = 'e-img-inline e-img-align-center e-img-wrap-right';
            inlineCenter.setAttribute('src', 'inline-center.png');
            const leftFigure: HTMLElement = document.createElement('figure');
            leftFigure.className = 'e-img-align-left e-img-wrap-left';
            leftFigure.innerHTML = '<img src="left.png">';
            const rightFigure: HTMLElement = document.createElement('figure');
            rightFigure.className = 'e-img-align-right e-img-wrap-right';
            rightFigure.innerHTML = '<img src="right.png">';

            expect(blockRules[0].getAttrs?.(figure)).toEqual(jasmine.objectContaining({
                src: 'block.png',
                display: 'block',
                align: 'center',
                wrap: 'right',
                caption: true
            }));
            expect(blockRules[1].getAttrs?.(plainFigure)).toEqual(jasmine.objectContaining({
                src: 'plain.png',
                display: 'block'
            }));
            expect(blockRules[1].getAttrs?.(invalidFigure)).toBe(false);
            expect(blockRules[0].getAttrs?.(emptyFigure)).toBe(false);
            expect(blockRules[1].getAttrs?.(leftFigure)).toEqual(jasmine.objectContaining({
                align: 'left',
                wrap: 'left'
            }));
            expect(blockRules[1].getAttrs?.(rightFigure)).toEqual(jasmine.objectContaining({
                align: 'right',
                wrap: 'right'
            }));
            expect(inlineRules[0].getAttrs?.(imageWithoutClasses)).toEqual(jasmine.objectContaining({
                display: 'inline',
                align: 'none',
                wrap: 'none',
                width: null,
                height: null,
                title: ''
            }));
            expect(inlineRules[0].getAttrs?.(inline)).toEqual(jasmine.objectContaining({
                src: 'inline.png',
                display: 'inline',
                align: 'right',
                wrap: 'left',
                width: 20,
                height: 10
            }));
            expect(inlineRules[0].getAttrs?.(inlineCenter)).toEqual(jasmine.objectContaining({
                src: 'inline-center.png',
                display: 'inline',
                align: 'center',
                wrap: 'right'
            }));
            expect(inlineRules[1].getAttrs?.(inline)).toEqual(jasmine.objectContaining({
                src: 'inline.png',
                display: 'inline'
            }));
        });

        it('serializes block and inline descriptors with layout and caption branches', () => {
            const domSpecFactory: NonNullable<typeof imageExtension.config.domSpecs> =
                imageExtension.config.domSpecs as NonNullable<typeof imageExtension.config.domSpecs>;
            if (!domSpecFactory) {
                throw new Error('Image extension must register DOM specs.');
            }
            const domScope: ExtensionScope<object> = { options: {} } as ExtensionScope<object>;
            const specs: ExtensionDOMSpecs = domSpecFactory.call(domScope);
            const block: ExtensionDOMSpecs['nodes']['image'] = specs.nodes.image;
            const inline: ExtensionDOMSpecs['nodes']['imageInline'] = specs.nodes.imageInline;
            const blockToDOM: (attrs: Record<string, unknown>, hasContent?: boolean) => unknown =
                block.toDOM as (attrs: Record<string, unknown>, hasContent?: boolean) => unknown;

            expect(
                blockToDOM(
                    {
                        src: 'src',
                        alt: 'alt',
                        title: 'title',
                        width: 10,
                        height: 20,
                        align: 'center',
                        wrap: 'left'
                    },
                    true
                )
            ).toEqual([
                'figure',
                { class: 'e-img-figure e-img-wrap-left e-img-align-center' },
                [
                    'img',
                    {
                        class: 'e-img-core-element e-img-block',
                        src: 'src',
                        alt: 'alt',
                        title: 'title',
                        width: '10',
                        height: '20'
                    }
                ],
                ['figcaption', { class: 'e-img-figcaption' }, 0]
            ]);
            expect(
                inline.toDOM({ src: 'src', align: 'right', wrap: 'right' })
            ).toEqual([
                'img',
                {
                    class: 'e-img-inline e-img-core-element e-img-align-right e-img-wrap-right',
                    src: 'src'
                }
            ]);
            expect(
                inline.toDOM({
                    src: 'src',
                    alt: 'Alt text',
                    title: 'Image title',
                    width: 40,
                    height: 30,
                    align: 'left',
                    wrap: 'left'
                })
            ).toEqual([
                'img',
                {
                    class: 'e-img-inline e-img-core-element e-img-align-left e-img-wrap-left',
                    src: 'src',
                    alt: 'Alt text',
                    title: 'Image title',
                    width: '40',
                    height: '30'
                }
            ]);
        });

        it('selects an image on direct click but leaves caption clicks editable', () => {
            const view: ViewSurface & {
                state: { doc: { nodeAt: (position: number) => unknown } };
            } = editor.integration.getView() as unknown as ViewSurface & {
                state: { doc: { nodeAt: (position: number) => unknown } };
            };
            const pmImage: unknown = (view as unknown as {
                state: { doc: { nodeAt: (position: number) => unknown } }
            }).state.doc.nodeAt(0);
            const imageElement: HTMLImageElement = container.querySelector(
                'img'
            ) as HTMLImageElement;
            const click: MouseEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });
            Object.defineProperty(click, 'target', { value: imageElement });
            let handled: boolean = false;
            view.someProp('handleClickOn', (handler: Function): void => {
                handled =
                    handler(view, 0, pmImage, 0, click, true) ||
                    handled;
            });
            expect(handled).toBe(true);

            editor.commands.addCaption({ caption: 'Editable' });
            const caption: HTMLElement = container.querySelector(
                '.e-img-figcaption'
            ) as HTMLElement;
            const captionClick: MouseEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });
            Object.defineProperty(captionClick, 'target', { value: caption });
            let captionHandled: boolean = true;
            view.someProp('handleClickOn', (handler: Function): void => {
                captionHandled = handler(
                    view,
                    0,
                    pmImage,
                    0,
                    captionClick,
                    true
                );
            });
            expect(captionHandled).toBe(false);
        });

        it('ignores modified Enter, non-text selections, and non-caption cursors', () => {
            const view: ViewSurface = editor.integration.getView() as unknown as ViewSurface;
            const pluginScope: ExtensionScope<object> = { options: {} } as ExtensionScope<object>;
            const pluginFactory: NonNullable<typeof imageExtension.config.plugins> =
                imageExtension.config.plugins as NonNullable<typeof imageExtension.config.plugins>;
            if (!pluginFactory) {
                throw new Error('Image extension must register its keyboard plugin.');
            }
            const imagePlugin: ImagePluginSurface = pluginFactory.call(
                pluginScope,
                {} as never
            )[0] as ImagePluginSurface;
            const imageHandleKeyDown: ((view: unknown, event: KeyboardEvent) => boolean) | undefined =
                imagePlugin.props?.handleKeyDown;
            if (!imageHandleKeyDown) {
                throw new Error('Image extension must register handleKeyDown.');
            }
            const modifiedEnter: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                shiftKey: true,
                bubbles: true,
                cancelable: true
            });
            expect(imageHandleKeyDown(view, modifiedEnter)).toBe(false);

            selectImage();
            const nodeEnter: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true
            });
            expect(imageHandleKeyDown(view, nodeEnter)).toBe(false);

            editor.commands.setSelection({ from: 1, to: 1 });
            const paragraphEnter: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true
            });
            expect(imageHandleKeyDown(view, paragraphEnter)).toBe(false);
        });

        it('ignores Enter when the caption image is no longer present', () => {
            selectImage();
            editor.commands.addCaption({ caption: 'Caption' });
            const view: ViewSurface & {
                state: { doc: { nodeAt: (position: number) => unknown } };
            } = editor.integration.getView() as unknown as ViewSurface & {
                state: { doc: { nodeAt: (position: number) => unknown } };
            };
            const pluginScope: ExtensionScope<object> = { options: {} } as ExtensionScope<object>;
            const pluginFactory: NonNullable<typeof imageExtension.config.plugins> =
                imageExtension.config.plugins as NonNullable<typeof imageExtension.config.plugins>;
            const imagePlugin: ImagePluginSurface = pluginFactory.call(
                pluginScope,
                {} as never
            )[0] as ImagePluginSurface;
            const imageHandleKeyDown: ((view: unknown, event: KeyboardEvent) => boolean) | undefined =
                imagePlugin.props?.handleKeyDown;
            if (!imageHandleKeyDown) {
                throw new Error('Image extension must register handleKeyDown.');
            }
            spyOn(view.state.doc, 'nodeAt').and.returnValue(null);
            const enter: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true
            });

            expect(imageHandleKeyDown(view, enter)).toBe(false);
            expect(enter.defaultPrevented).toBe(false);
        });

        it('returns false when a trailing caption cannot create a paragraph', () => {
            selectImage();
            editor.commands.addCaption({ caption: 'Caption' });
            const view: ViewSurface & {
                state: {
                    doc: {
                        type: {
                            schema: {
                                nodes: Record<string, { createAndFill: () => unknown } | undefined>;
                            };
                        };
                    };
                };
            } = editor.integration.getView() as unknown as ViewSurface & {
                state: {
                    doc: {
                        type: {
                            schema: {
                                nodes: Record<string, { createAndFill: () => unknown } | undefined>;
                            };
                        };
                    };
                };
            };
            const pluginScope: ExtensionScope<object> = { options: {} } as ExtensionScope<object>;
            const pluginFactory: NonNullable<typeof imageExtension.config.plugins> =
                imageExtension.config.plugins as NonNullable<typeof imageExtension.config.plugins>;
            const imagePlugin: ImagePluginSurface = pluginFactory.call(
                pluginScope,
                {} as never
            )[0] as ImagePluginSurface;
            const imageHandleKeyDown: ((view: unknown, event: KeyboardEvent) => boolean) | undefined =
                imagePlugin.props?.handleKeyDown;
            if (!imageHandleKeyDown) {
                throw new Error('Image extension must register handleKeyDown.');
            }
            const enter: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true
            });
            const paragraphType: { createAndFill: () => unknown } | undefined =
                view.state.doc.type.schema.nodes['paragraph'];
            if (!paragraphType) {
                throw new Error('Test editor schema must provide a paragraph node.');
            }
            spyOn(paragraphType, 'createAndFill').and.returnValue(null);
            expect(imageHandleKeyDown(view, enter)).toBe(false);
            expect(enter.defaultPrevented).toBe(false);

            view.state.doc.type.schema.nodes['paragraph'] = undefined;
            const missingParagraphEnter: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true
            });
            expect(imageHandleKeyDown(view, missingParagraphEnter)).toBe(false);
            expect(missingParagraphEnter.defaultPrevented).toBe(false);
        });

        it('renders resize wrappers for selected images and remains mounted', () => {
            const view: ViewSurface = editor.integration.getView() as unknown as ViewSurface;
            selectImage();
            expect(
                container.querySelectorAll('[data-resize-handle]').length
            ).toBe(4);
            editor.commands.setImageDimension({ width: 120, height: 80 });
            expect(selectedImage().attrs['width']).toBe(120);
            expect(selectedImage().attrs['height']).toBe(80);
            expect(view.dom.querySelector('.e-resizable-wrapper')).toBeTruthy();
            editor.commands.setImageDisplay({ mode: 'inline' });
            expect(view.dom.querySelector('.e-resizable-wrapper')).toBeTruthy();
            expect(editor.integration.isDestroyed).toBe(false);
        });

        it('removes resize handles when selection moves outside the image', () => {
            editor.destroy();
            mountEditor([imageNode(), paragraphNode('Elsewhere')]);
            selectImage();
            expect(container.querySelector('.e-resizable-wrapper')).toBeTruthy();
            expect(editor.commands.setSelection({ from: 3, to: 4 })).toBe(true);
            expect(container.querySelector('.e-resizable-wrapper')).toBeTruthy();
            expect(container.querySelectorAll('[data-resize-handle]').length).toBe(0);
        });

        it('renders bare image node views when resizing is disabled', () => {
            editor.destroy();
            mountEditor([imageNode()], { resize: false });
            expect(container.querySelector('.e-resizable-wrapper')).toBeNull();
            expect(container.querySelector('img.e-img-block')).toBeTruthy();
            expect(container.querySelectorAll('[data-resize-handle]').length).toBe(0);
        });

        it('renders inline node views without resize wrappers', () => {
            editor.destroy();
            mountEditor([paragraphNode('Inline')], {
                resize: false,
                htmlAttributes: { loading: 'lazy', 'data-role': 'image' }
            });
            editor.commands.setSelection({ from: 1, to: 1 });
            expect(editor.commands.insertImage({
                src: 'inline-view.png',
                display: 'inline',
                attributes: { 'data-extra': 'true', loading: 'lazy' }
            })).toBe(true);
            const imageElement: HTMLImageElement = container.querySelector('img.e-img-inline') as HTMLImageElement;
            expect(imageElement).toBeTruthy();
            expect(imageElement.getAttribute('src')).toBe('inline-view.png');
            expect(container.querySelector('.e-resizable-wrapper')).toBeNull();
        });

        it('covers node-view update, mutation, selection, and destruction lifecycle branches', () => {
            editor.destroy();
            const uiElement: HTMLElement = document.createElement('span');
            const nodeViewOptions: ImageOptions = {
                resize: false,
                addNodeView: () => ({
                    image: () => ({ dom: uiElement })
                })
            };
            mountEditor([imageNode()], nodeViewOptions);
            const nodeViewFactory: NonNullable<typeof imageExtension.config.nodeViews> =
                imageExtension.config.nodeViews as NonNullable<typeof imageExtension.config.nodeViews>;
            const scope: ExtensionScope<ImageOptions> = {
                options: nodeViewOptions,
                editor
            };
            const nodeViews: Record<string, NodeViewConstructor> = nodeViewFactory.call(scope);
            const descriptor: ReturnType<NodeViewConstructor> = nodeViews.image(
                { id: 'image-id', src: 'image.png', alt: '', title: '', attributes: '' },
                {},
                (): number => 0,
                false
            );
            const mutationTarget: HTMLElement = document.createElement('em');
            uiElement.appendChild(mutationTarget);
            expect(descriptor.update?.({ src: 'updated.png' }, false)).toBe(true);
            expect(descriptor.update?.({ src: 'caption-change.png' }, true)).toBe(false);
            expect(descriptor.ignoreMutation?.({ target: mutationTarget })).toBe(true);
            expect(descriptor.ignoreMutation?.({ target: document.createElement('div') })).toBe(false);
            descriptor.selectNode?.();
            expect(descriptor.dom.querySelector('.ProseMirror-selectednode')).toBeTruthy();
            descriptor.deselectNode?.();
            expect(descriptor.dom.querySelector('.ProseMirror-selectednode')).toBeNull();
            descriptor.destroy?.();
        });

        it('delegates mutations to the enabled resize node view', () => {
            const nodeViewFactory: NonNullable<typeof imageExtension.config.nodeViews> =
                imageExtension.config.nodeViews as NonNullable<typeof imageExtension.config.nodeViews>;
            const scope: ExtensionScope<ImageOptions> = {
                options: { resize: { enabled: true } },
                editor
            };
            const nodeViews: Record<string, NodeViewConstructor> = nodeViewFactory.call(scope);
            const descriptor: ReturnType<NodeViewConstructor> = nodeViews.image(
                { src: 'image.png', alt: '', title: '', attributes: '' },
                {},
                (): number => 0,
                false
            );

            expect(descriptor.ignoreMutation?.({ target: document.createElement('div') })).toBe(true);
            descriptor.destroy?.();
        });

        it('keeps focus and a valid selection after block, inline, and captioned insertion', () => {
            editor.destroy();
            mountEditor([paragraphNode('Start')]);
            editor.focusView();
            editor.commands.setSelection({ from: 1, to: 1 });
            expect(editor.commands.insertImage({ src: 'block.png' })).toBe(true);
            expect(editor.integration.getView().hasFocus()).toBe(true);
            expect(editor.getSelection().empty).toBe(false);

            editor.commands.insertImage({ src: 'inline.png', display: 'inline' });
            expect(editor.integration.getView().hasFocus()).toBe(true);
            editor.commands.insertImage({ src: 'caption.png', caption: 'Caption' });
            expect(editor.integration.getView().hasFocus()).toBe(true);
            expect(editor.getHtml()).toContain('Caption');
        });

        it('commits a real resize drag through the default enabled node view', () => {
            selectImage();
            const handle: HTMLElement = container.querySelector(
                '[data-resize-handle="bottom-right"]'
            ) as HTMLElement;
            const start: MouseEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                clientX: 10,
                clientY: 10
            });
            handle.dispatchEvent(start);
            document.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true,
                clientX: 40,
                clientY: 30
            }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            expect(selectedImage().attrs['width']).toBeGreaterThan(0);
            expect(selectedImage().attrs['height']).toBeGreaterThan(0);
        });

        it('applies formatting to text surrounding an inserted image', () => {
            editor.destroy();
            configuredExtensions = [boldExtension];
            mountEditor([paragraphNode('Format me')]);
            editor.commands.setSelection({ from: 1, to: 1 });
            expect(editor.commands.insertImage({ src: 'formatted.png' })).toBe(true);
            expect(editor.getHtml()).toContain('formatted.png');

            editor.commands.setSelection({ from: 2, to: 12 });
            expect(editor.commands.toggleBold()).toBe(true);
            expect(editor.getHtml()).toContain('<strong>Format me</strong>');
        });

        it('inserts images in list and table content using the real schemas', () => {
            editor.destroy();
            configuredExtensions = [listExtension];
            mountEditor([{
                type: 'bulletList',
                id: crypto.randomUUID(),
                attrs: {},
                marks: [],
                children: [{
                    type: 'listItem',
                    id: crypto.randomUUID(),
                    attrs: {},
                    marks: [],
                    children: [paragraphNode('List item')]
                }]
            }]);
            editor.commands.setSelection({ from: 2, to: 2 });
            expect(editor.commands.insertImage({ src: 'list-image.png', display: 'inline' })).toBe(true);
            expect(editor.getHtml()).toContain('<ul');
            expect(editor.getHtml()).toContain('list-image.png');
            const listDocument: EditorNode[] = editor.getDocument().children;
            const listParagraph: EditorNode = listDocument[0].children[0].children[0];
            expect(listDocument[0].type).toBe('bulletList');
            expect(listParagraph.type).toBe('paragraph');
            expect(listParagraph.children.some(
                (node: EditorNode): boolean =>
                    node.type === 'imageInline' && node.attrs['src'] === 'list-image.png'
            )).toBe(true);

            editor.destroy();
            configuredExtensions = [tableExtension];
            mountEditor([{
                type: 'table',
                id: crypto.randomUUID(),
                attrs: {},
                marks: [],
                children: [{
                    type: 'tableRow',
                    id: crypto.randomUUID(),
                    attrs: {},
                    marks: [],
                    children: [{
                        type: 'tableCell',
                        id: crypto.randomUUID(),
                        attrs: { colspan: 1, rowspan: 1 },
                        marks: [],
                        children: [paragraphNode('Cell')]
                    }]
                }]
            }]);
            editor.commands.setSelection({ from: 2, to: 2 });
            expect(editor.commands.insertImage({ src: 'table-image.png', display: 'inline' })).toBe(true);
            expect(editor.getHtml()).toContain('<table');
            expect(editor.getHtml()).toContain('table-image.png');
            const tableDocument: EditorNode[] = editor.getDocument().children;
            const tableParagraph: EditorNode = tableDocument[0].children[0].children[0].children[0];
            expect(tableDocument[0].type).toBe('table');
            expect(tableParagraph.type).toBe('paragraph');
            expect(tableParagraph.children.some(
                (node: EditorNode): boolean =>
                    node.type === 'imageInline' && node.attrs['src'] === 'table-image.png'
            )).toBe(true);
        });

        it('handles Tab, Backspace, and Enter around image nodes', () => {
            editor.destroy();
            configuredExtensions = [indentOutdentExtension];
            mountEditor([imageNode(), paragraphNode('After')]);
            selectImage();
            const view: ViewSurface = editor.integration.getView() as unknown as ViewSurface;
            const tab: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Tab',
                bubbles: true,
                cancelable: true
            });
            view.dom.dispatchEvent(tab);
            expect(editor.getDocument().children[0].attrs['indent']).toBeGreaterThanOrEqual(0);

            selectImage();
            const backspace: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Backspace',
                bubbles: true,
                cancelable: true
            });
            let backspaceHandled: boolean = false;
            view.someProp('handleKeyDown', (handler: Function): void => {
                backspaceHandled = handler(view, backspace) || backspaceHandled;
            });
            expect(backspaceHandled).toBe(true);
            expect(editor.getHtml()).not.toContain('image.png');

            editor.commands.insertImage({ src: 'enter-image.png' });
            const enter: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true
            });
            view.someProp('handleKeyDown', (handler: Function): void => {
                handler(view, enter);
            });
            expect(editor.getHtml()).toContain('<p');
        });

        it('composes product UI, delivers idle upload state, and destroys the contribution', () => {
            const states: string[] = [];
            let destroyed: boolean = false;
            editor.destroy();
            mountEditor([imageNode()], {
                addNodeView: () => ({
                    image: () => ({
                        dom: document.createElement('span'),
                        placement: 'bottom-left',
                        onUploadState: (state: { status: string }): void => {
                            states.push(state.status);
                        },
                        destroy: (): void => {
                            destroyed = true;
                        }
                    })
                })
            });

            const slot: HTMLElement = container.querySelector(
                '.e-img-ui-slot.e-img-ui-bottom-left'
            ) as HTMLElement;
            expect(slot).toBeTruthy();
            expect(
                slot.firstElementChild?.getAttribute('contenteditable')
            ).toBe('false');
            expect(states).toEqual(['idle']);
            editor.destroy();
            expect(destroyed).toBe(true);
        });

        it('moves the cursor after a captioned image on plain Enter', () => {
            selectImage();
            editor.commands.addCaption({ caption: 'Caption' });
            const view: ViewSurface = editor.integration.getView() as unknown as ViewSurface;
            const enter: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true
            });
            let handled: boolean = false;
            view.someProp('handleKeyDown', (handler: Function): void => {
                handled = handler(view, enter) || handled;
            });
            expect(handled).toBe(true);
            expect(enter.defaultPrevented).toBe(true);
            expect(editor.getDocument().children.length).toBeGreaterThan(1);
            expect(
                editor.getDocument().children.slice(1).some(
                    (node: EditorNode): boolean => node.type === 'paragraph'
                )
            ).toBe(true);
        });

        it('does not intercept modified Enter or indirect image clicks', () => {
            const view: ViewSurface = editor.integration.getView() as unknown as ViewSurface;
            const pmImage: unknown = (view as unknown as {
                state: { doc: { nodeAt: (position: number) => unknown } }
            }).state.doc.nodeAt(0);
            const modified: KeyboardEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                ctrlKey: true,
                bubbles: true,
                cancelable: true
            });
            let keyHandled: boolean = true;
            view.someProp('handleKeyDown', (handler: Function): void => {
                keyHandled = handler(view, modified);
            });
            expect(keyHandled).toBe(false);

            const imageElement: HTMLImageElement = container.querySelector(
                'img'
            ) as HTMLImageElement;
            const click: MouseEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });
            Object.defineProperty(click, 'target', { value: imageElement });
            let clickHandled: boolean = true;
            view.someProp('handleClickOn', (handler: Function): void => {
                clickHandled = handler(
                    view,
                    0,
                    pmImage,
                    0,
                    click,
                    false
                );
            });
            expect(clickHandled).toBe(false);
        });
    });
});
