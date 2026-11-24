import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class HighlightSettings
 */
export interface HighlightSettingsModel {

    /**
     * Defines how long, in milliseconds, the highlight stays at full color before it starts to fade.
     *
     * @default 500
     * @blazorType int
     */
    flashDuration?: number;

    /**
     * Defines how long, in milliseconds, the highlight takes to fade out after the flash duration.
     *
     * @default 1000
     * @blazorType int
     */
    fadeDuration?: number;

    /**
     * Defines the highlight color. Any valid CSS color is accepted, such as '#00FF00', 'rgba(0, 255, 0, 0.3)',
     * 'hsl(120, 100%, 50%)' or a color name. The color is applied as is, so use an alpha color such as rgba
     * to control its opacity. When empty, the highlight color of the applied theme is used.
     *
     * @default ''
     */
    color?: string;

}