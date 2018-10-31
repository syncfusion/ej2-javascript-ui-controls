import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Configures the inlineMode property of the RTE.
 */
export class InlineMode extends ChildProperty<InlineMode> {
    /**
     * Specifies whether enable/disable inline toolbar in RTE.
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Specifies the inline toolbar render based on with or without selection.
     * @default true
     */
    @Property(true)
    public onSelection: boolean;
}