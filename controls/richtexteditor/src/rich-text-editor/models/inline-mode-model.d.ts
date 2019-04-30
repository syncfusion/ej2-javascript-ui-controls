import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class InlineMode
 */
export interface InlineModeModel {

    /**
     * Specifies whether enable/disable inline toolbar in RTE.
     * @default false
     */
    enable?: boolean;

    /**
     * Specifies the inline toolbar render based on with or without selection.
     * @default true
     */
    onSelection?: boolean;

}