import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Represents LabelItem in the block editor component.
 */
export class LabelItem extends ChildProperty<LabelItem> {

    /**
     * Specifies the unique identifier for the label.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies the display text for the label.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies the group header for the label.
     * This is used to categorize labels within the editor.
     *
     * @default ''
     */
    @Property('')
    public groupBy: string;

    /**
     * Specifies the color of the label.
     * This can be used to visually distinguish labels.
     *
     * @default ''
     */
    @Property('')
    public labelColor: string;

    /**
     * Specifies the CSS class for the label's icon.
     * This can be used to define custom label icons which appears near the label text.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;
}
