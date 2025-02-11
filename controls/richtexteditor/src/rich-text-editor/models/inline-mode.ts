import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Configures the inlineMode settings for the Rich Text Editor (RTE).
 */
export class InlineMode extends ChildProperty<InlineMode> {
    /**
     * Determines whether the inline toolbar in the RTE is enabled or disabled.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Specifies whether the inline toolbar should be rendered based on the presence of a selection.
     * When set to true, the toolbar will be displayed only when text or content is selected.
     * When set to false, the toolbar will be rendered regardless of the selection state.
     *
     * @default true
     */
    @Property(true)
    public onSelection: boolean;
}
