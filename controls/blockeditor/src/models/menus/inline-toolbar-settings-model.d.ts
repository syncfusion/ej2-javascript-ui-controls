import { ChildProperty, EmitType, Event, Property } from '@syncfusion/ej2-base';import { ToolbarItemClickEventArgs } from '../eventargs';import { IToolbarItemModel } from '../interface';import { ToolbarCommandName } from '../types';

/**
 * Interface for a class InlineToolbarSettings
 */
export interface InlineToolbarSettingsModel {

    /**
     * Specifies the width of the popup.
     * Defaults value is 100%.
     *
     * @default '100%'
     */
    popupWidth?: string | number;

    /**
     * Specifies whether to enable the inline toolbar.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * Specifies the individual items within a toolbar setup, specifying properties like commands, icons, and labels.
     *
     * @default ['Bold', 'Italic', 'Underline', 'Strikethrough', 'Color', 'BackgroundColor']
     */
    items?: (string | ToolbarCommandName | IToolbarItemModel)[];

    /**
     * Triggers when the item is clicked in the toolbar.
     *
     * @event itemClick
     */
    itemClick?: EmitType<ToolbarItemClickEventArgs>;

}