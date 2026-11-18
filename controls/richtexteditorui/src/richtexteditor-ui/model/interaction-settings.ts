import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Configures the Intereactions settings of the RichTextEditor.
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
     * Specifies whether the `Tab` and `Shift+Tab` keys can be used for indentation.
     *
     * When `true`:
     * - `Tab` at the beginning of a supported block indents the block.
     * - `Shift+Tab` at the beginning of a supported block outdents the block.
     * - `Tab` in the middle of a block inserts tab spacing at the cursor position.
     *
     * If the current selection does not support indentation or tab spacing,
     * normal browser focus navigation is preserved.
     *
     * When `false`, `Tab` and `Shift+Tab` do not trigger editor indentation.
     *
     * @default true
     */
    @Property(true)
    public enableTabKeyIndent: boolean;
}
