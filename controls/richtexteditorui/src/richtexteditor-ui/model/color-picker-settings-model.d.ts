import { ChildProperty, Property } from '@syncfusion/ej2-base';import { ColorModeType, DEFAULT_BGCOLOR_PRESETS, DEFAULT_FONTCOLOR_PRESETS } from './color-picker.types';

/**
 * Interface for a class FontColor
 */
export interface FontColorModel {

    /**
     * Specifies the default font color.
     *
     * @default '#DC2626'
     */
    default?: string;

    /**
     * Specifies the color mode.
     *
     * @default 'Palette'
     */
    mode?: ColorModeType;

    /**
     * Specifies the number of columns in the color palette.
     *
     * @default 5
     */
    columns?: number;

    /**
     * Specifies custom color codes keyed by group label.
     *
     * @default { Custom: ['#000000', '#FFFFFF', '#DC2626', '#B8590D', '#8C7000', '#5B21B6', '#4D700F', '#1F7333', '#146B52', '#0D6666', '#0A6185', '#1A5499', '#2640A6', '#383399', '#612E9E', '#732494', '#941F6B', '#9E2447', '#992938', '#704724', '#7A612E', '#5C611F', '#404C61', '#4D4D4D', '#242947'] }
     */
    preset?: { [key: string]: string[] };

    /**
     * Enables or disables the mode switcher button.
     *
     * @default false
     */
    modeSwitcher?: boolean;

    /**
     * Indicates whether the recent colors section is shown in the picker.
     *
     * @default true
     */
    showRecentColors?: boolean;

}

/**
 * Interface for a class BackgroundColor
 */
export interface BackgroundColorModel {

    /**
     * Specifies the default background color.
     *
     * @default '#FFF7C7'
     */
    default?: string;

    /**
     * Specifies the color mode.
     *
     * @default 'Palette'
     */
    mode?: ColorModeType;

    /**
     * Specifies the number of columns in the color palette.
     *
     * @default 5
     */
    columns?: number;

    /**
     * Specifies custom color codes keyed by group label.
     *
     * @default { Custom: ['#000000', '#FFFFFF', '#FCE3E0', '#FFEDD4', '#EBF7D1', '#FFF7C7','#DBF5E0', '#D6F5EB', '#D4F2F2', '#D4F0FA', '#DBEBFC', '#E0E5FC','#E5E3FC', '#EDE0FC', '#F2E0FC', '#FAE0F2', '#FCE0E8', '#FCE0E3','#F5EBDE', '#F7F2E0', '#F0F2DB', '#E5EBF0', '#EDEDED', '#E0E0E5','#DEE0EB'] }
     */
    preset?: { [key: string]: string[] };

    /**
     * Enables or disables the mode switcher button.
     *
     * @default false
     */
    modeSwitcher?: boolean;

    /**
     * Indicates whether the recent colors section is shown in the picker.
     *
     * @default true
     */
    showRecentColors?: boolean;

}