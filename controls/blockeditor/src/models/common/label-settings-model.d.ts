import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';import { LabelItem } from './label-item';import { LabelItemModel } from './index';

/**
 * Interface for a class LabelSettings
 */
export interface LabelSettingsModel {

    /**
     * Specifies the label items for the label popup.
     * This property is an array of LabelItemModel instances defining label-related options.
     * By default, predefined labels are provided.
     *
     * @default []
     */
    items?: LabelItemModel[];

    /**
     * Specifies the trigger character for labels.
     * This property defines the character that triggers the label popup to open.
     * By default, the trigger character is set to $
     *
     * @default '$'
     */
    triggerChar?: string;

}