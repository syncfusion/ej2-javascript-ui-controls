import { defineExtension } from '../define-extension';
import { NodeSelection, PMPlugin, PMSelection, TextSelection, PMEditorView, PMNode, PMNodeType, PMResolvedPos, PMTransaction } from '../../pm/pm-guard';
import type { NodeDefinition } from '../../schema/types/node-definition';
import type { AttributeDefinition } from '../../schema/types/attribute-definition';
import { NodeContent } from '../../schema/types/content-expression';
import type { Command } from '../../commands/types';
import type { ExtensionDefinition, NodeDOMDescriptor, DOMOutputDescriptor, ExtensionDOMSpecs, ExtensionScope, NodeViewConstructor } from '../types';
import { insertImageCommand, removeImageCommand, updateImageCommand, setImageAlignCommand, setImageWrapCommand, setImageDisplayCommand, setImageDimensionCommand, addCaptionCommand, removeCaptionCommand, toggleCaptionCommand } from '../../commands/builtins/image';
import { ResizableNodeView } from '../../nodeviews/resizable-node-view';
import type { ResizableNodeViewBehaviorOptions, ResizableNodeViewDirection } from '../../nodeviews/resizable-node-view.types';
import type { UploadState, UploadStatus, UploadStateRegistry } from '../../services/upload-state-registry';
import type { HeadlessEditor } from '../../headless-editor/headless-editor';
import { indentAttribute } from './common/indent-attributes';
import { mergeIndentStyle } from './common/indent-attributes';

/**
 * Image display modes supported by image nodes.
 * - `block`:  image occupies its own line, like a standalone figure
 * - `inline`: image flows with surrounding text
 */
export type ImageDisplayMode = 'block' | 'inline';

/**
 * Horizontal alignment for block images. `none` honors the editor's default
 * text-align (typically left).
 */
export type ImageAlign = 'left' | 'center' | 'right' | 'none';

/**
 * Text wrapping behavior. Wrapped images float so surrounding text flows
 * around them; `none` keeps the image on its own line.
 */
export type ImageWrap = 'left' | 'right' | 'none';

/**
 * Persistence format used when the editor saves an image reference.
 * - `blob`:   store as a Blob URL (recommended; survives serialization)
 * - `base64`: inline as `data:image/...;base64,...` (portable but heavy)
 */
export type SaveFormatType = 'blob' | 'base64';

/**
 * Top-level configuration options consumed by the Image extension.
 */
export interface ImageOptions {
    /** Allow pasted/dropped images to keep their base64 payload as `src`. */
    allowBase64?: boolean;
    /** Static HTML attributes merged onto every inserted `<img>` element. */
    htmlAttributes?: Record<string, string>;
    /** How inserted images should be persisted. */
    saveFormat?: SaveFormatType;
    /** Default display mode for newly inserted images. */
    display?: ImageDisplayMode;
    /** Default horizontal alignment for newly inserted images. */
    align?: ImageAlign;
    /** Default text wrapping for newly inserted images. */
    wrap?: ImageWrap;
    /**
     * Resize configuration. Default `false` (resize disabled).
     *
     * When `{ enabled: true, ... }` is supplied, both `image` (block) and
     * `imageInline` (inline) node views render drag-to-resize handles that
     * persist dimensions through `editor.commands.updateImage({ width, height })`.
     */
    resize?: ImageResizeOptions | false;
    /**
     * Optional custom NodeView UI factory for rendering product-supplied
     * status UI around block image nodes (upload progress, badges, etc.).
     *
     * Invoked once per editor mount (never per-node remount — same factory
     * discipline as the CodeBlock `addNodeView`). The returned record is
     * keyed by node type name; only the `image` (block) entry is consumed.
     * The extension continues to own the `<img>` structure, composition,
     * and lifecycle — the product contributes only its UI subtree.
     */
    addNodeView?: () => Record<string, ImageUINodeViewFactory>;
}

/**
 * Resizable behavior configuration supplied to the image extension.
 *
 * Lets consumers configure which directions are resizable, the lower size
 * bound, and whether the image's aspect ratio should always be preserved.
 */
export interface ImageResizeOptions {
    /**
     * Master switch. When `false`, the resizable engine never mounts handles
     * on image node views (no-op for that view).
     */
    enabled: boolean;
    /**
     * Whitelist of resize directions to render handles for. When omitted,
     * the engine default (`top-left`, `top-right`, `bottom-left`,
     * `bottom-right`) is used.
     */
    directions?: ResizableNodeViewDirection[];
    /**
     * Minimum allowed width in pixels during a resize drag.
     * Falls back to the engine default (8 px) when `undefined`.
     */
    minWidth?: number;
    /**
     * Minimum allowed height in pixels during a resize drag.
     * Falls back to the engine default (8 px) when `undefined`.
     */
    minHeight?: number;
    /**
     * When `true`, the engine preserves the image's aspect ratio on every
     * resize handle. When `false`, holding `Shift` toggles aspect lock
     * interactively.
     */
    alwaysPreserveAspectRatio?: boolean;
}

/**
 * Placement of the product UI slot relative to the image.
 * Applied by the extension via a stable CSS class on the UI slot element.
 */
export type ImageUIPlacement =
    'top-left' | 'top-center' | 'top-right'
    | 'center-left' | 'center' | 'center-right'
    | 'bottom-left' | 'bottom-center' | 'bottom-right';

/**
 * Upload state delivered to product image UI.
 * Image-specific re-export of the generic runtime `UploadState` — the
 * registry itself stays image-agnostic.
 */
export type ImageUploadState = UploadState;

/**
 * Upload status lifecycle delivered to product image UI.
 */
export type ImageUploadStatus = UploadStatus;

/**
 * UI contribution returned by the product's per-node factory.
 * The extension composes this into the final NodeView; the product never
 * owns or recreates the image structure itself.
 */
export interface ImageUIContribution {
    /** Product-owned UI element (progress bar, status badge, controls, etc.). */
    dom: HTMLElement;
    /** Slot placement relative to the image. Default `'top-right'`. */
    placement?: ImageUIPlacement;
    /**
     * Push callback invoked on every upload-state change for this image.
     * Receives an immediate snapshot at NodeView construction and every
     * subsequent runtime update. Progress updates never touch the document.
     */
    onUploadState?(state: ImageUploadState): void;
    /** Called when the NodeView is destroyed so the product can clean up widgets. */
    destroy?(): void;
}

/**
 * Per-node factory supplied through `ImageOptions.addNodeView`.
 * Same shape as the extension NodeView constructor contract.
 */
export type ImageUINodeViewFactory = (
    attrs: Record<string, unknown>,
    view: unknown,
    getPos: () => number | undefined
) => ImageUIContribution;

/**
 * Returns the configured default save format for images.
 *
 * @param {ExtensionDefinition<ImageOptions>} extension Image extension configuration.
 * @returns {SaveFormatType} Configured image save format.
 */
export function getDefaultSaveFormat(extension: ExtensionDefinition<ImageOptions>): SaveFormatType {
    // Get the image extension options.
    const imageOptions: ImageOptions = extension?.config?.defineOptions?.() ?? {};
    // Return the configured save format.
    return imageOptions.saveFormat ?? 'blob';
}

/**
 * Returns the configured default display mode for images.
 *
 * @param {ExtensionDefinition<ImageOptions>} extension Image extension configuration.
 * @returns {ImageDisplayMode} Configured image display mode.
 */
export function getDefaultDisplay(extension: ExtensionDefinition<ImageOptions>): ImageDisplayMode {
    // Get the image extension options.
    const imageOptions: ImageOptions = extension?.config?.defineOptions?.() ?? {};
    // Return the configured display mode.
    return imageOptions.display ?? 'block';
}

/**
 * Data used when inserting a new image.
 */
export interface InsertImagePayload {
    // Image source URL.
    src: string;
    // Alternative text for Image.
    alt?: string;
    // Image title text.
    title?: string;
    // Image width in pixels.
    width?: number;
    // Image height in pixels.
    height?: number;
    // Image display mode.
    display?: ImageDisplayMode;
    // Image alignment.
    align?: ImageAlign;
    // Image text wrapping mode.
    wrap?: ImageWrap;
    // Image Caption
    caption?: string;
    // Custom HTML attributes applied to the image element.
    attributes?: Record<string, string>;
}

/**
 * Data used when updating an existing image.
 */
export interface UpdateImagePayload {
    // Updated image source URL.
    src?: string;
    // Updated alternative text.
    alt?: string;
    // Updated image title text.
    title?: string;
    // Updated custom HTML attributes.
    attributes?: Record<string, string>;
    // Updated image width.
    width?: number;
    // Updated image height.
    height?: number;
}

/**
 * Creates the schema attributes shared by block and inline image nodes.
 *
 * @returns {AttributeDefinition[]} Image node attribute definitions.
 */
function makeImageAttrs(): AttributeDefinition[] {
    return [
        { name: 'id', type: 'string', default: '' },
        { name: 'src', type: 'string', default: '' },
        { name: 'alt', type: 'string', default: '' },
        { name: 'title', type: 'string', default: '' },
        { name: 'width', type: 'number', default: null },
        { name: 'height', type: 'number', default: null },
        { name: 'display', type: 'string', default: 'block' },
        { name: 'align', type: 'string', default: 'none' },
        { name: 'wrap', type: 'string', default: 'none' },
        { name: 'caption', type: 'boolean', default: false },
        { name: 'attributes', type: 'string', default: '' },
        indentAttribute
    ];
}

// Shared HTML parsing rules for image elements.
const imageParseRules: readonly unknown[] = [
    {
        tag: 'img',
        // Convert an HTML image element into image node attributes.
        getAttrs: (dom: unknown): Record<string, unknown> | false => {
            // Get the image element.
            const imageElement: HTMLImageElement = dom as HTMLImageElement;
            // Get the CSS classes applied to the image.
            const imageClassNames: string = imageElement.getAttribute('class') ?? '';
            // Resolve the image wrapping mode from the applied CSS classes.
            let imageWrap: ImageWrap = 'none';
            if (imageClassNames.indexOf('e-img-wrap-left') !== -1) {
                imageWrap = 'left';
            } else if (imageClassNames.indexOf('e-img-wrap-right') !== -1) {
                imageWrap = 'right';
            }
            // Resolve the image alignment from the applied CSS classes.
            let imageAlignment: ImageAlign = 'none';
            if (imageClassNames.indexOf('e-img-align-left') !== -1) {
                imageAlignment = 'left';
            } else if (imageClassNames.indexOf('e-img-align-center') !== -1) {
                imageAlignment = 'center';
            } else if (imageClassNames.indexOf('e-img-align-right') !== -1) {
                imageAlignment = 'right';
            }
            return {
                // Image source URL.
                src: imageElement.getAttribute('src') ?? '',
                // Alternative text for accessibility.
                alt: imageElement.getAttribute('alt') ?? '',
                // Image width.
                width: imageElement.getAttribute('width') ? Number(imageElement.getAttribute('width')) : null,
                // Image height.
                height: imageElement.getAttribute('height') ? Number(imageElement.getAttribute('height')) : null,
                // Image title text.
                title: imageElement.getAttribute('title') ?? '',
                // Parsed image display mode.
                display: 'inline',
                // Parsed image alignment.
                align: imageAlignment,
                // Parsed image wrapping mode.
                wrap: imageWrap
            };
        }
    }
];

/**
 * Parses a block image and preserves layout classes from its container.
 *
 * @param {*} container Block image container element.
 * @returns {*} Parsed block image attributes, or false when no image exists.
 */
function parseBlockImageAttributes(container: HTMLElement): Record<string, unknown> | false {
    const images: NodeListOf<HTMLImageElement> = container.querySelectorAll('img');
    if (images.length !== 1) {
        return false;
    }
    const imageElement: HTMLImageElement = images[0];
    const parsedAttrs: Record<string, unknown> | false =
        (imageParseRules[0] as { getAttrs: (value: unknown) => Record<string, unknown> | false })
            .getAttrs(imageElement);
    if (!parsedAttrs) {
        return false;
    }
    const containerClassNames: string = container.getAttribute('class') ?? '';
    let imageAlignment: ImageAlign = parsedAttrs['align'] as ImageAlign;
    if (containerClassNames.indexOf('e-img-align-left') !== -1) {
        imageAlignment = 'left';
    } else if (containerClassNames.indexOf('e-img-align-center') !== -1) {
        imageAlignment = 'center';
    } else if (containerClassNames.indexOf('e-img-align-right') !== -1) {
        imageAlignment = 'right';
    }
    let imageWrap: ImageWrap = parsedAttrs['wrap'] as ImageWrap;
    if (containerClassNames.indexOf('e-img-wrap-left') !== -1) {
        imageWrap = 'left';
    } else if (containerClassNames.indexOf('e-img-wrap-right') !== -1) {
        imageWrap = 'right';
    }
    return {
        ...parsedAttrs,
        display: 'block',
        align: imageAlignment,
        wrap: imageWrap
    };
}

/**
 * DOM serializer and parser for block image nodes.
 *
 * Converts image nodes to their DOM representation and back, preserving
 * `src`, `alt`, `width`, `height`, and alignment/wrap metadata.
 */
const imageBlockDescriptor: NodeDOMDescriptor = {
    /**
     * Converts a block image node into its DOM representation.
     *
     * @param {*} imageAttributes Image node attributes.
     * @param {boolean} hasContent Whether the image contains caption content.
     * @returns {DOMOutputDescriptor} DOM descriptor for the block image.
     */
    toDOM(imageAttributes: Record<string, unknown>, hasContent: boolean = false): DOMOutputDescriptor {
        // Get the image source.
        const imageSource: string = String(imageAttributes['src'] ?? '');
        // Get the image alternative text.
        const imageAltText: string = String(imageAttributes['alt'] ?? '');
        // Get the image title.
        const imageTitle: string = String(imageAttributes['title'] ?? '');
        // Get the image width.
        const imageWidth: string | null = imageAttributes['width'] ? String(imageAttributes['width']) : null;
        // Get the image height.
        const imageHeight: string | null = imageAttributes['height'] ? String(imageAttributes['height']) : null;
        // Get the image alignment.
        const imageAlignment: string = String(imageAttributes['align'] ?? 'none');
        // Get the image wrapping mode.
        const imageWrap: string = String(imageAttributes['wrap'] ?? 'none');
        // Build figure CSS classes from image layout attributes.
        const figureClassNames: string[] = ['e-img-figure'];
        if (imageWrap !== 'none') {
            figureClassNames.push(`e-img-wrap-${imageWrap}`);
        }
        if (imageAlignment !== 'none') {
            figureClassNames.push(`e-img-align-${imageAlignment}`);
        }
        // Build the image HTML attributes.
        const imageHtmlAttributes: Record<string, string> = {
            class: 'e-img-core-element e-img-block'
        };
        if (imageSource) {
            imageHtmlAttributes['src'] = imageSource;
        }
        if (imageAltText) {
            imageHtmlAttributes['alt'] = imageAltText;
        }
        if (imageTitle) {
            imageHtmlAttributes['title'] = imageTitle;
        }
        if (imageWidth) {
            imageHtmlAttributes['width'] = imageWidth;
        }
        if (imageHeight) {
            imageHtmlAttributes['height'] = imageHeight;
        }
        // Render the image inside a figure element, optionally with a figcaption.
        const figureAttrs: Record<string, unknown> = mergeIndentStyle(
            { class: figureClassNames.join(' ') },
            imageAttributes['indent']
        );
        const figureDescriptor: unknown[] = [
            'figure',
            figureAttrs,
            ['img', imageHtmlAttributes]
        ];
        if (hasContent || imageAttributes['caption'] === true) {
            figureDescriptor.push(['figcaption', { class: 'e-img-figcaption' }, 0]);
        }
        return figureDescriptor as DOMOutputDescriptor;
    },

    parseDOM: [
        {
            tag: 'figure',
            contentElement: 'figcaption',
            getAttrs: (dom: unknown): Record<string, unknown> | false => {
                const figure: HTMLElement = dom as HTMLElement;
                if (!figure.querySelector('figcaption')) {
                    return false;
                }
                const parsedAttrs: Record<string, unknown> | false = parseBlockImageAttributes(figure);
                return parsedAttrs ? { ...parsedAttrs, display: 'block', caption: true } : false;
            }
        },
        {
            tag: 'figure',
            getAttrs: (dom: unknown): Record<string, unknown> | false => {
                const figure: HTMLElement = dom as HTMLElement;
                const images: NodeListOf<HTMLImageElement> = figure.querySelectorAll('img');
                if (images.length !== 1 || figure.querySelector('figcaption')) {
                    return false;
                }
                const parsedAttrs: Record<string, unknown> | false = parseBlockImageAttributes(figure);
                return parsedAttrs ? { ...parsedAttrs, display: 'block' } : false;
            }
        },
        ...imageParseRules
    ]
};

/**
 * DOM serializer and parser for inline image nodes.
 *
 * Inline images are emitted directly as `<img>` elements (no wrapper),
 * relying on CSS classes to apply layout plus wrapping behavior.
 */
const imageInlineDescriptor: NodeDOMDescriptor = {
    /**
     * Converts an inline image node into its DOM representation.
     *
     * @param {*} imageAttributes Image node attributes.
     * @returns {DOMOutputDescriptor} DOM descriptor for the inline image.
     */
    toDOM(imageAttributes: Record<string, unknown>): DOMOutputDescriptor {
        // Get the image source.
        const imageSource: string = String(imageAttributes['src'] ?? '');
        // Get the image alternative text.
        const imageAltText: string = String(imageAttributes['alt'] ?? '');
        // Get the image title.
        const imageTitle: string = String(imageAttributes['title'] ?? '');
        // Get the image width.
        const imageWidth: string | null = imageAttributes['width'] ? String(imageAttributes['width']) : null;
        // Get the image height.
        const imageHeight: string | null = imageAttributes['height'] ? String(imageAttributes['height']) : null;
        // Get the image alignment.
        const imageAlignment: string = String(imageAttributes['align'] ?? 'none');
        // Get the image wrapping mode.
        const imageWrap: string = String(imageAttributes['wrap'] ?? 'none');
        // Build CSS classes for the inline image element.
        const imageClassNames: string[] = [
            'e-img-inline',
            'e-img-core-element'
        ];
        if (imageAlignment !== 'none') {
            imageClassNames.push(`e-img-align-${imageAlignment}`);
        }
        if (imageWrap !== 'none') {
            imageClassNames.push(`e-img-wrap-${imageWrap}`);
        }
        // Build the image HTML attributes.
        const imageHtmlAttributes: Record<string, string> = {
            class: imageClassNames.join(' ')
        };
        if (imageSource) {
            imageHtmlAttributes['src'] = imageSource;
        }
        if (imageAltText) {
            imageHtmlAttributes['alt'] = imageAltText;
        }
        if (imageTitle) {
            imageHtmlAttributes['title'] = imageTitle;
        }
        if (imageWidth) {
            imageHtmlAttributes['width'] = imageWidth;
        }
        if (imageHeight) {
            imageHtmlAttributes['height'] = imageHeight;
        }
        // Render the inline image element.
        return ['img', imageHtmlAttributes];
    },
    parseDOM: [
        {
            tag: 'img.e-img-inline',

            /**
             * Converts an inline image element into image node attributes.
             *
             * @param {*} dom Inline image element.
             * @returns {*} Parsed image attributes.
             */
            getAttrs: (dom: unknown): Record<string, unknown> | false => {
                // Get the image element.
                const imageElement: HTMLElement = dom as HTMLElement;
                // Get the image CSS classes.
                const imageClassNames: string = imageElement.getAttribute('class') ?? '';
                // Resolve the image alignment from CSS classes.
                let imageAlignment: ImageAlign = 'none';
                if (imageClassNames.indexOf('e-img-align-left') !== -1) {
                    imageAlignment = 'left';
                }
                if (imageClassNames.indexOf('e-img-align-center') !== -1) {
                    imageAlignment = 'center';
                }
                if (imageClassNames.indexOf('e-img-align-right') !== -1) {
                    imageAlignment = 'right';
                }
                // Resolve the image wrapping mode from CSS classes.
                let imageWrap: ImageWrap = 'none';
                if (imageClassNames.indexOf('e-img-wrap-left') !== -1) {
                    imageWrap = 'left';
                }
                if (imageClassNames.indexOf('e-img-wrap-right') !== -1) {
                    imageWrap = 'right';
                }
                return {
                    // Image source URL.
                    src: imageElement.getAttribute('src') ?? '',
                    // Alternative text.
                    alt: imageElement.getAttribute('alt') ?? '',
                    // Image width in pixels.
                    width: imageElement.getAttribute('width') ? Number(imageElement.getAttribute('width')) : null,
                    // Image height in pixels.
                    height: imageElement.getAttribute('height') ? Number(imageElement.getAttribute('height')) : null,
                    // Image title text.
                    title: imageElement.getAttribute('title') ?? '',
                    // Parsed image display mode.
                    display: 'inline',
                    // Parsed image alignment.
                    align: imageAlignment,
                    // Parsed image wrapping mode.
                    wrap: imageWrap
                };
            }
        },
        ...imageParseRules
    ]
};

/**
 * Image extension definition. Registers the schema, commands, DOM serializers,
 * and optional NodeView-backed resize behavior for both block and inline images.
 */
export const imageExtension: ExtensionDefinition = defineExtension({
    /**
     * Unique extension identifier used by the registry/dependency graph.
     */
    name: 'image',
    /** Extension execution priority. Higher values run first. */
    priority: 100,
    /**
     * Provides default {@link ImageOptions} when the host doesn't supply them.
     *
     * @returns {ImageOptions} Default image extension options.
     */
    defineOptions(): ImageOptions {
        return {
            allowBase64: true,
            htmlAttributes: {},
            saveFormat: 'blob',
            display: 'block',
            align: 'none',
            wrap: 'none',
            resize: {
                enabled: true,
                alwaysPreserveAspectRatio: true
            }
        };
    },

    /**
     * Registers block (`image`) and inline (`imageInline`) image node definitions.
     *
     * @returns {NodeDefinition[]} Array of node definitions registered by this extension.
     */
    nodes(): NodeDefinition[] {
        // Create the shared image node attributes.
        const imageAttributes: AttributeDefinition[] = makeImageAttrs();
        // Block Image Schema Node Definition
        const blockImageNode: NodeDefinition = {
            name: 'image',
            group: 'block',
            content: NodeContent.inline().zeroOrMore(),
            attrs: imageAttributes
        };
        // Inline Image Schema Node Definition
        const inlineImageNode: NodeDefinition = {
            name: 'imageInline',
            group: 'inline',
            inline: true,
            attrs: imageAttributes
        };
        // Return both node definitions.
        return [
            blockImageNode,
            inlineImageNode
        ];
    },

    /**
     * Returns the commands provided by this extension: insert, remove, update,
     * align, and wrap. Used by the toolbar to wire image-related actions.
     *
     * @returns {Command[]} Command list registered by the image extension.
     */
    commands(): Command[] {
        return [
            insertImageCommand,
            removeImageCommand,
            updateImageCommand,
            setImageAlignCommand,
            setImageWrapCommand,
            setImageDisplayCommand,
            setImageDimensionCommand,
            addCaptionCommand,
            removeCaptionCommand,
            toggleCaptionCommand
        ];
    },

    plugins(): readonly PMPlugin[] {
        // Register ProseMirror event handlers for image and caption interaction.
        return [new PMPlugin({
            props: {
                // Move the cursor out of an image caption when Enter is pressed.
                handleKeyDown(view: PMEditorView, event: KeyboardEvent): boolean {
                    // Continue only for plain Enter; leave modified Enter shortcuts to the editor.
                    if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) {
                        return false;
                    }
                    // Read the current editor selection.
                    const selection: PMSelection = view.state.selection;
                    // Caption navigation applies only to an empty text cursor selection.
                    if (!(selection instanceof TextSelection) || !selection.empty) {
                        return false;
                    }
                    // Start from the cursor position and search upward for a captioned image.
                    const $from: PMResolvedPos = selection.$from;
                    // Store the depth of the nearest captioned image ancestor.
                    let imageDepth: number = -1;
                    // Walk from the cursor's deepest ancestor toward the document root.
                    for (let depth: number = $from.depth; depth >= 0; depth--) {
                        // Read the node at the current ancestor depth.
                        const ancestor: PMNode = $from.node(depth);
                        // Stop when the ancestor is a block image with captions enabled.
                        if (ancestor.type.name === 'image' && ancestor.attrs['caption'] === true) {
                            imageDepth = depth;
                            break;
                        }
                    }
                    // If the cursor is not inside a captioned image, do nothing.
                    if (imageDepth === -1) {
                        return false;
                    }
                    // Resolve the document position immediately before the image node.
                    const imagePosition: number = $from.before(imageDepth);
                    // Read the image node at that position.
                    const imageNode: PMNode | null = view.state.doc.nodeAt(imagePosition);
                    // Abort if the document no longer contains the expected image node.
                    if (!imageNode) {
                        return false;
                    }
                    // Calculate the position immediately after the image node.
                    const afterImage: number = imagePosition + imageNode.nodeSize;
                    // Begin a transaction that will move the cursor after the image.
                    let transaction: PMTransaction = view.state.tr;
                    // If content already follows the image, inspect the next block.
                    if (afterImage < transaction.doc.content.size) {
                        // Read the node immediately after the image.
                        const nextBlock: PMNode | null = transaction.doc.nodeAt(afterImage);
                        // Place the cursor at the start of the next text block when possible.
                        if (nextBlock && nextBlock.isTextblock) {
                            transaction.setSelection(TextSelection.create(transaction.doc, afterImage + 1));
                        } else {
                            // Otherwise find the nearest valid selection position after the image.
                            transaction.setSelection(PMSelection.near(transaction.doc.resolve(afterImage), 1));
                        }
                    } else {
                        // No node follows the image, so create a paragraph for continued editing.
                        const paragraphType: PMNodeType | undefined = transaction.doc.type.schema.nodes['paragraph'];
                        // The schema must provide a paragraph node to continue after the image.
                        if (!paragraphType) {
                            return false;
                        }
                        // Create an empty valid paragraph node.
                        const paragraph: PMNode | null = paragraphType.createAndFill();
                        // Abort if the schema cannot create a valid paragraph.
                        if (!paragraph) {
                            return false;
                        }
                        // Insert the paragraph immediately after the image.
                        transaction = transaction.insert(afterImage, paragraph);
                        // Place the cursor inside the newly inserted paragraph.
                        transaction.setSelection(PMSelection.near(transaction.doc.resolve(afterImage + 1), 1));
                    }
                    // Apply the cursor movement to the editor.
                    view.dispatch(transaction);
                    // Prevent the browser from inserting a line break inside the caption.
                    event.preventDefault();
                    // Report that this key event was handled by the plugin.
                    return true;
                },
                // Select the complete image node when the user clicks its image element.
                handleClickOn(
                    // Current editor view used to dispatch the node selection.
                    view: PMEditorView,
                    // Position supplied by ProseMirror for the clicked descendant.
                    _pos: number,
                    // Node that was clicked.
                    node: PMNode,
                    // Document position of the clicked node.
                    nodePos: number,
                    // Browser mouse event that triggered the click.
                    event: MouseEvent,
                    // Whether the click directly targeted the image node.
                    direct: boolean
                ): boolean {
                    // Handle only direct clicks on block or inline image nodes.
                    if (!direct || (node.type.name !== 'image' && node.type.name !== 'imageInline')) {
                        return false;
                    }
                    // Read the original click target so caption clicks can remain editable.
                    const target: EventTarget | null = event.target;
                    // Do not replace the text cursor when the user clicks inside a caption.
                    if (target instanceof Element && target.closest('.e-img-figcaption')) {
                        return false;
                    }
                    // Select the entire image node in ProseMirror.
                    view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));
                    // Report that this click event was handled.
                    return true;
                }
            }
        })];
    },

    /**
     * Registers DOM serializers and parsers for image nodes.
     *
     * @returns {ExtensionDOMSpecs} DOM specs to merge into the editor's DOM handling.
     */
    domSpecs(): ExtensionDOMSpecs {
        return {
            nodes: {
                image: imageBlockDescriptor,
                imageInline: imageInlineDescriptor
            }
        };
    },

    /**
     * Registers custom node views.
     *
     * @param {ExtensionScope<ImageOptions>} this - Extension scope carrying the editor instance.
     * @returns {Record<string, NodeViewConstructor>} Node view constructors keyed by node
     * type name.
     */
    nodeViews(this: ExtensionScope<ImageOptions>): Record<string, NodeViewConstructor> {
        const resize: ImageResizeOptions | false | undefined = this.options?.resize;
        const uiFactories: Record<string, ImageUINodeViewFactory> | null = this.options?.addNodeView?.call(this) ?? null;
        const blockUiFactory: ImageUINodeViewFactory | null = (uiFactories && uiFactories['image']) || null;
        const hasResize: boolean = !!(resize && resize.enabled);
        if (!hasResize && !blockUiFactory) {
            return {};
        }
        const readOnlyRef: () => boolean = (): boolean => {
            try {
                return !!(this as unknown as { editor: { config: { readOnly?: boolean } } }).editor.config?.readOnly;
            } catch {
                return false;
            }
        };
        type EditorSurface = {
            config: { readOnly?: boolean };
            commands: { updateImage: (payload: { width: number; height: number }) => boolean };
        };
        const editor: EditorSurface = (this as unknown as { editor: EditorSurface }).editor;
        const buildCtor: (nodeType: string) => NodeViewConstructor = (nodeType: string): NodeViewConstructor => {
            return (attrs: Record<string, unknown>, _view: unknown, _getPos: () => number | undefined, hasContent: boolean = false) => {
                hasContent = hasContent || attrs['caption'] === true;
                const isReadOnly: boolean = readOnlyRef();
                const img: HTMLImageElement = document.createElement('img');
                if (nodeType === 'imageInline') {
                    img.classList.add('e-img-inline', 'e-img-core-element');
                } else {
                    img.classList.add('e-img-core-element', 'e-img-block');
                }
                img.draggable = false;

                // Helper to sync standard image attributes (src, alt, title, width, height).
                const syncImageAttrs: (attrSet: Record<string, unknown>) => void = (attrSet: Record<string, unknown>): void => {
                    if (typeof attrSet['src'] === 'string') {
                        img.setAttribute('src', attrSet['src']);
                    }
                    if (typeof attrSet['alt'] === 'string') {
                        img.setAttribute('alt', attrSet['alt']);
                    }
                    if (typeof attrSet['title'] === 'string') {
                        img.setAttribute('title', attrSet['title']);
                    }

                    const imageWidth: number | null | undefined = attrSet['width'] as number | null | undefined;
                    const imageHeight: number | null | undefined = attrSet['height'] as number | null | undefined;
                    if (typeof imageWidth === 'number' && imageWidth > 0) {
                        img.style.width = `${imageWidth}px`;
                    }
                    if (typeof imageHeight === 'number' && imageHeight > 0) {
                        img.style.height = `${imageHeight}px`;
                    }
                };

                const htmlAttrs: Record<string, unknown> = (attrs['attributes'] as Record<string, unknown> | undefined) ?? {};
                for (const key of Object.keys(htmlAttrs)) {
                    const value: unknown = htmlAttrs[key as string];
                    if (value !== null && value !== undefined) {
                        img.setAttribute(key, String(value));
                    }
                }

                syncImageAttrs(attrs);

                // ── Product UI contribution (block images only) ──
                let contribution: ImageUIContribution | null = null;
                let unsubscribe: (() => void) | null = null;
                if (nodeType === 'image' && blockUiFactory) {
                    contribution = blockUiFactory(attrs, _view, _getPos);
                    const uiElement: HTMLElement = contribution.dom;
                    // Non-editable UI chrome so interactions never reach PM.
                    uiElement.setAttribute('contenteditable', 'false');
                }

                // ── Image host element: resize engine DOM or the bare <img> ──
                let imageHost: HTMLElement;
                let resizable: ResizableNodeView | null = null;
                if (hasResize) {
                    const behavior: ResizableNodeViewBehaviorOptions = {
                        directions: (resize as ImageResizeOptions).directions,
                        min: {
                            width: (resize as ImageResizeOptions).minWidth,
                            height: (resize as ImageResizeOptions).minHeight
                        },
                        preserveAspectRatio: (resize as ImageResizeOptions).alwaysPreserveAspectRatio
                    };
                    resizable = new ResizableNodeView({
                        element: img,
                        options: behavior,
                        onCommit: (width: number, height: number): void => {
                            try {
                                editor.commands.updateImage({
                                    width: Math.round(width),
                                    height: Math.round(height)
                                });
                            } catch {
                                // editor destroyed or command unavailable; tolerate.
                            }
                        },
                        onUpdate: (newAttrs: Record<string, unknown>): void => {
                            syncImageAttrs(newAttrs);
                            (resizable as ResizableNodeView).setEnabled(!readOnlyRef());
                        }
                    });
                    imageHost = resizable.dom;
                } else {
                    imageHost = img;
                }

                // ── Upload state bridge (runtime registry → product callback)
                if (contribution && contribution.onUploadState) {
                    const registry: UploadStateRegistry | undefined =
                        (this.editor as HeadlessEditor | undefined)?.uploadStateRegistry;
                    if (registry) {
                        const nodeId: string = typeof attrs['id'] === 'string' ? attrs['id'] : '';
                        const callback: (state: ImageUploadState) => void =
                            contribution.onUploadState.bind(contribution);
                        unsubscribe = registry.subscribe(nodeId, callback);
                        const snapshot: ImageUploadState | undefined = registry.getState(nodeId);
                        callback(snapshot ?? { status: 'idle' });
                    }
                }

                // ── Composition: block figure > [resizable|img] + caption + UI slot ──
                const uiSlot: HTMLElement | null = contribution
                    ? (() => {
                        const slot: HTMLElement = document.createElement('div');
                        slot.className = `e-img-ui-slot e-img-ui-${contribution.placement ?? 'top-right'}`;
                        slot.appendChild(contribution.dom);
                        return slot;
                    })()
                    : null;

                let nodeDom: HTMLElement;
                let captionElement: HTMLElement | null = null;
                if (nodeType === 'image') {
                    const figure: HTMLElement = document.createElement('figure');
                    figure.className = 'e-img-figure';
                    figure.appendChild(imageHost);
                    if (hasContent) {
                        captionElement = document.createElement('figcaption');
                        captionElement.className = 'e-img-figcaption';
                        figure.appendChild(captionElement);
                    }
                    if (uiSlot) {
                        figure.appendChild(uiSlot);
                    }
                    nodeDom = figure;
                } else {
                    nodeDom = imageHost;
                }

                /*
                 * Updates alignment and text-wrapping classes on the element
                 * owned by this NodeView.
                 */
                const updateLayoutClasses: (newAttrs: Record<string, unknown>) => void = (newAttrs: Record<string, unknown>): void => {
                    const layoutElements: HTMLElement[] = resizable ? [resizable.dom] : [img];
                    for (const layoutElement of layoutElements) {
                        layoutElement.classList.remove('e-img-align-left', 'e-img-align-center', 'e-img-align-right', 'e-img-wrap-left', 'e-img-wrap-right');
                    }
                    const align: string = String(newAttrs['align'] ?? 'none');
                    const wrap: string = String(newAttrs['wrap'] ?? 'none');
                    for (const layoutElement of layoutElements) {
                        if (align !== 'none') {
                            layoutElement.classList.add(`e-img-align-${align}`);
                        }
                        if (wrap !== 'none') {
                            layoutElement.classList.add(`e-img-wrap-${wrap}`);
                        }
                    }
                };
                updateLayoutClasses(attrs);
                // Initial read-only state.
                if (resizable) {
                    resizable.setEnabled(!isReadOnly);
                }

                return {
                    dom: nodeDom,
                    contentDOM: captionElement,
                    update: (newAttrs: Record<string, unknown>, nextHasContent: boolean = hasContent): boolean => {
                        if (nextHasContent !== hasContent) {
                            return false;
                        }
                        updateLayoutClasses(newAttrs);
                        syncImageAttrs(newAttrs);
                        if (resizable) {
                            resizable.update(newAttrs);
                        }
                        return true;
                    },

                    destroy: (): void => {
                        // Release the registry subscription immediately — never
                        // deferred to editor destruction.
                        if (unsubscribe) {
                            unsubscribe();
                            unsubscribe = null;
                        }
                        if (contribution && contribution.destroy) {
                            contribution.destroy();
                        }
                        if (resizable) {
                            resizable.destroy();
                        }
                    },
                    ignoreMutation: (mutation: unknown): boolean => {
                        // Product UI subtree mutations are widget noise — silence
                        // them (same bridge as the CodeBlock header pattern).
                        if (contribution) {
                            const mutationRecord: { target?: Node } = mutation as { target?: Node };
                            const target: Node | undefined = mutationRecord && mutationRecord.target;
                            if (target && contribution.dom.contains(target)) {
                                return true;
                            }
                        }
                        if (resizable) {
                            return resizable.ignoreMutation(mutation);
                        }
                        return false;
                    },
                    selectNode: (): void => {
                        imageHost.classList.add('ProseMirror-selectednode');
                        if (resizable) {
                            resizable.selectNode();
                        }
                    },
                    deselectNode: (): void => {
                        imageHost.classList.remove('ProseMirror-selectednode');
                        if (resizable) {
                            resizable.deselectNode();
                        }
                    }
                };
            };
        };
        return {
            image: buildCtor('image'),
            imageInline: buildCtor('imageInline')
        };
    }
});
