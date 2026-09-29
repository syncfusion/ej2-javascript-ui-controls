import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Configures interaction behaviors of the RichTextEditor.
 *
 * Grouped under a child property so that interaction-specific flags
 * do not pollute the root editor API.
 */
export class InteractionSettings extends ChildProperty<InteractionSettings> {
    /**
     * Specifies whether Markdown-style auto formatting is enabled while typing.
     *
     * When `true`, supported Markdown-style syntax entered at the
     * beginning of a block is converted into the corresponding editor
     * structure (for example `# `, `## `, `> `, `- `, `1. `, ``` ``` ```).
     *
     * @default true
     */
    @Property(true)
    public enableAutoFormat: boolean;

    /**
     * Specifies whether the `Tab` and `Shift+Tab` keys can be used
     * to indent and outdent supported blocks.
     *
     * When `true`, `Tab` indents the current supported block and
     * `Shift+Tab` outdents it. The command is executed only when the
     * current selection supports block indentation; otherwise normal
     * browser focus navigation is preserved.
     *
     * When `false`, `Tab` must not trigger editor block indentation.
     *
     * @default true
     */
    @Property(true)
    public enableTabKeyIndent: boolean;
}
