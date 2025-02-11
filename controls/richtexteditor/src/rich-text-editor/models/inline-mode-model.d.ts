import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class InlineMode
 */
export interface InlineModeModel {

    /**
     * Determines whether the inline toolbar in the RTE is enabled or disabled.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Specifies whether the inline toolbar should be rendered based on the presence of a selection.
     * When set to true, the toolbar will be displayed only when text or content is selected.
     * When set to false, the toolbar will be rendered regardless of the selection state.
     *
     * @default true
     */
    onSelection?: boolean;

}