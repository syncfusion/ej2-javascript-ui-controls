import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class LabelItem
 */
export interface LabelItemModel {

    /**
     * Specifies the unique identifier for the label.
     *
     * @default ''
     */
    id?: string;

    /**
     * Specifies the display text for the label.
     *
     * @default ''
     */
    text?: string;

    /**
     * Specifies the group header for the label.
     * This is used to categorize labels within the editor.
     *
     * @default ''
     */
    groupBy?: string;

    /**
     * Specifies the color of the label.
     * This can be used to visually distinguish labels.
     *
     * @default ''
     */
    labelColor?: string;

    /**
     * Specifies the CSS class for the label's icon.
     * This can be used to define custom label icons which appears near the label text.
     *
     * @default ''
     */
    iconCss?: string;

}