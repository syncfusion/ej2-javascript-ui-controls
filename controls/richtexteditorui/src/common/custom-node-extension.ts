import {
    defineExtension,
    DOMOutputDescriptor,
    ExtensionDefinition,
    NodeContent
} from '@syncfusion/ej2-headless-editor';
import {
    CustomBlockNodeMap,
    CustomInlineNodeMap,
    CustomMarkMap
} from '../richtexteditor-ui/types/editor-document';

/* ------------------------------------------------------------------ *
 * Spec-aligned public types
 *
 * The `CustomNodeDefinition` / `CustomMarkDefinition` types below are
 * constrained against the compile-time registration surfaces defined in
 * `src/rich-text-editor/types/editor-document.ts`:
 *
 *   - CustomBlockNodeMap  : members of this map form the `name` union
 *                          accepted by `CustomNodeDefinition` (block).
 *   - CustomInlineNodeMap : members of this map form the `name` union
 *                          accepted by `CustomNodeDefinition` (inline).
 *   - CustomMarkMap       : members of this map form the `name` union
 *                          accepted by `CustomMarkDefinition`.
 *
 * Consumers can extend the maps via TypeScript module augmentation
 * (see `docs/spec/04.editor-document.md`):
 *
 *   declare module '../rich-text-editor/types/editor-document' {
 *     interface CustomBlockNodeMap { callout: CalloutNode; }
 *   }
 *
 * After augmentation, the new `name` becomes part of the typed
 * registry below, and the `attrs` shape flows into the `render`
 * callback.
 * ------------------------------------------------------------------ */

/* Extract the registry keys, hiding the internal `__custom*` marker. */
type CustomBlockNodeName =
    Exclude<keyof CustomBlockNodeMap, '__customBlockNodeRegistry'>;

type CustomInlineNodeName =
    Exclude<keyof CustomInlineNodeMap, '__customInlineNodeRegistry'>;

type CustomMarkName =
    Exclude<keyof CustomMarkMap, '__customMarkRegistry'>;

/* The set of all custom node `name` values across the block and
 * inline maps. */
export type CustomNodeName =
    | CustomBlockNodeName
    | CustomInlineNodeName;

/* Look up the registered custom node shape (or mark shape) by name.
 * Falls back to a permissive `Record<string, unknown>` when the
 * registry is empty (i.e. no augmentation has been performed), so
 * callers can still define ad-hoc custom nodes. */
type LookupBlockNode<TName extends string> =
    TName extends CustomBlockNodeName
        ? CustomBlockNodeMap[TName]
        : Record<string, unknown>;

type LookupInlineNode<TName extends string> =
    TName extends CustomInlineNodeName
        ? CustomInlineNodeMap[TName]
        : Record<string, unknown>;

type LookupMark<TName extends string> =
    TName extends CustomMarkName
        ? CustomMarkMap[TName]
        : Record<string, unknown>;

/**
 * Coarse content cardinality for the runtime schema. The spec uses
 * typed arrays (`content: BlockNode[]`) at the model level; the
 * runtime maps those to ProseMirror-style cardinality rules.
 */
export type CustomNodeGroup = 'block' | 'inline';
export type CustomNodeContent = 'block' | 'inline' | 'text' | 'none';
export type CustomNodeAttributeType = 'string' | 'number' | 'boolean' | 'enum';

export interface CustomNodeAttribute {
    name: string;
    type: CustomNodeAttributeType;
    default?: unknown;
    required?: boolean;
    values?: string[];
}

export interface CustomNodeRender {
    tag: string;
    attributes?: { [key: string]: string };
    content?: boolean;
    text?: string;
}

export interface CustomMarkRender {
    tag: string;
    attributes?: { [key: string]: string };
}

/**
 * Runtime definition for a custom node.
 *
 * The generic parameter `TName` captures the literal `name` so the
 * `attrs` argument to `render` is typed against the registered
 * `attrs` interface for that node (or `Record<string, unknown>` when
 * no augmentation exists for the given name).
 *
 * The second generic `TGroup` controls the cardinality shorthand
 * (`block`/`inline`/`text`/`none`) used to derive the headless
 * schema's `content` rule.
 */
export interface CustomNodeDefinition<
    TName extends string = string,
    TGroup extends CustomNodeGroup = CustomNodeGroup
> {
    name: TName;
    group: TGroup;
    content?: CustomNodeContent;
    attrs?: CustomNodeAttribute[];
    render: (
        attrs: TGroup extends 'inline'
            ? (TName extends CustomInlineNodeName
                ? (CustomInlineNodeMap[TName] extends { attrs: infer A }
                    ? A & Record<string, unknown>
                    : Record<string, unknown>)
                : Record<string, unknown>)
            : (TName extends CustomBlockNodeName
                ? (CustomBlockNodeMap[TName] extends { attrs: infer A }
                    ? A & Record<string, unknown>
                    : Record<string, unknown>)
                : Record<string, unknown>)
    ) => CustomNodeRender;
}

/**
 * Runtime definition for a custom mark.
 *
 * The `attrs` argument to `render` is typed against the registered
 * `attrs` interface for the given mark name (or
 * `Record<string, unknown>` when no augmentation exists).
 */
export interface CustomMarkDefinition<TName extends string = string> {
    name: TName;
    attrs?: CustomNodeAttribute[];
    render: (
        attrs: TName extends CustomMarkName
            ? (CustomMarkMap[TName] extends { attrs: infer A }
                ? A & Record<string, unknown>
                : Record<string, unknown>)
            : Record<string, unknown>
    ) => CustomMarkRender;
}

const registeredCustomNodes: CustomNodeDefinition[] = [];
const registeredCustomMarks: CustomMarkDefinition[] = [];

/**
 * Registry of pre-built headless `ExtensionDefinition` values contributed by
 * feature modules.
 *
 * Unlike the custom-node registry (which feeds one synthetic
 * `custom-nodes` extension via `getRegisteredCustomExtensions()`), this
 * registry holds the *raw* extension objects contributed by each feature
 * module — typically the built-in extensions published from
 * `@syncfusion/ej2-headless-editor` (e.g. `imageExtension`, …). They all
 * flow back out of `getRegisteredCustomExtensions()` so
 * {@link RichTextEditorUI.getEditorExtensions} can compose them uniformly.
 *
 * Idempotent on `(name)` so re-instantiating a module does not double-register
 * the same extension.
 *
 * Modules that want to register their dependency on a headless extension
 * should call {@link registerCustomExtension} from the module constructor
 * rather than hard-coding the extension into the editor's extension list.
 */
const registeredCustomExtensions: ExtensionDefinition[] = [];

/**
 * Registers one or more pre-built headless `ExtensionDefinition` values.
 *
 * Each entry's `name` (when present) is used as the dedup key. Re-registering
 * an extension with the same `name` is a no-op so the editor remains stable
 * when a feature module is re-instantiated (e.g. across `setProperties`).
 *
 * @param {...ExtensionDefinition[]} extensions - Extensions to register.
 * @returns {void}
 */
export function registerCustomExtension(...extensions: ExtensionDefinition[]): void {
    extensions.forEach((extension: ExtensionDefinition): void => {
        if (!extension ||
            typeof (extension as { name?: string }).name !== 'string') {
            return;
        }
        const candidateName: string = (extension as { name: string }).name;
        const existingIndex: number = registeredCustomExtensions.findIndex(
            (registered: ExtensionDefinition): boolean => {
                const nameField: unknown = (registered as { name?: string }).name;
                return typeof nameField === 'string' && nameField === candidateName;
            }
        );
        if (existingIndex === -1) {
            registeredCustomExtensions.push(extension);
        }
    });
}

/**
 * Unregisters one or more headless `ExtensionDefinition` values by `name`.
 * Safe to call with names that were never registered.
 *
 * @param {...string[]} names - Extension names to drop from the registry.
 * @returns {void}
 */
export function unregisterCustomExtension(...names: string[]): void {
    for (const target of names) {
        for (let i: number = registeredCustomExtensions.length - 1; i >= 0; i--) {
            const nameField: unknown =
                (registeredCustomExtensions[i as number] as { name?: string }).name;
            if (typeof nameField === 'string' && nameField === target) {
                registeredCustomExtensions.splice(i, 1);
            }
        }
    }
}

/**
 * @param {...any} nodes - Custom nodes for the registration.
 * @returns {void}
 */
export function registerCustomNodes(...nodes: CustomNodeDefinition[]): void {
    nodes.forEach((node: CustomNodeDefinition) => {
        const existingIndex: number = registeredCustomNodes.findIndex(
            (registeredNode: CustomNodeDefinition) => registeredNode.name === node.name
        );
        if (existingIndex === -1) {
            registeredCustomNodes.push(node);
        } else {
            /* eslint-disable */
            registeredCustomNodes[existingIndex] = node;
        }
    });
}

export function registerCustomMarks(...marks: CustomMarkDefinition[]): void {
    marks.forEach((mark: CustomMarkDefinition) => {
        const existingIndex: number = registeredCustomMarks.findIndex(
            (registeredMark: CustomMarkDefinition) => registeredMark.name === mark.name
        );
        if (existingIndex === -1) {
            registeredCustomMarks.push(mark);
        } else {
            /* eslint-disable */
            registeredCustomMarks[existingIndex] = mark;
        }
    });
}

export function getRegisteredCustomExtensions(): ExtensionDefinition[] {
    const preBuilt: ExtensionDefinition[] = registeredCustomExtensions.slice();
    if (!registeredCustomNodes.length && !registeredCustomMarks.length) {
        return preBuilt;
    }

    preBuilt.push(defineExtension({
        name: 'custom-nodes',
        nodes: () => registeredCustomNodes.map((node: CustomNodeDefinition) => ({
            name: node.name,
            group: node.group,
            inline: node.group === 'inline',
            leaf: node.content === 'none' || node.content === undefined,
            content: toNodeContent(node.content),
            attrs: node.attrs
        })),
        marks: () => registeredCustomMarks.map((mark: CustomMarkDefinition) => ({
            name: mark.name,
            attrs: mark.attrs
        })),
        domSpecs: () => ({
            nodes: registeredCustomNodes.reduce((specs: {
                [key: string]: {
                    toDOM: (attrs: Record<string, unknown>) =>
                    DOMOutputDescriptor
                }
            }, node: CustomNodeDefinition) => {
                specs[node.name] = {
                    toDOM: (attrs: Record<string, unknown>) => {
                        const renderedNode: CustomNodeRender = node.render(attrs);
                        const children: unknown = renderedNode.content ? 0 : renderedNode.text;
                        return [renderedNode.tag, renderedNode.attributes || {}, children] as DOMOutputDescriptor;
                    }
                };
                return specs;
            }, {}),
            marks: registeredCustomMarks.reduce((specs: {
                [key: string]: {
                    toDOM: (attrs: Record<string, unknown>) =>
                    DOMOutputDescriptor
                }
            }, mark: CustomMarkDefinition) => {
                specs[mark.name] = {
                    toDOM: (attrs: Record<string, unknown>) => {
                        const renderedMark: CustomMarkRender = mark.render(attrs);
                        return [renderedMark.tag, renderedMark.attributes || {}, 0] as DOMOutputDescriptor;
                    }
                };
                return specs;
            }, {})
        })
    }));
    return preBuilt;
}

function toNodeContent(content: CustomNodeContent | undefined): NodeContent | undefined {
    switch (content) {
    case 'block':
        return NodeContent.block().oneOrMore();
    case 'inline':
        return NodeContent.inline().zeroOrMore();
    case 'text':
        return NodeContent.text();
    default:
        return undefined;
    }
}
