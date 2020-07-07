import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';import { Side } from '../enum/enum';import { HorizontalAlignment, VerticalAlignment } from '../enum/enum';import { MarginModel } from '../core/appearance-model';import { Margin } from '../core/appearance';

/**
 * Interface for a class UserHandle
 */
export interface UserHandleModel {

    /**
     * Defines the name of user Handle
     * @default ''
     */
    name?: string;

    /**
     * Defines the path data of user Handle 
     * @default ''
     */
    pathData?: string;

    /**
     * Defines the custom content of the user handle
     * @default ''
     */
    content?: string;

    /**
     * Defines the image source of the user handle
     * @default ''
     */
    source?: string;

    /**
     * Defines the background color of user Handle 
     * @default 'black'
     */
    backgroundColor?: string;

    /**
     * Defines the position of user Handle
     *  * Top - Aligns the user handles at the top of an object
     *  * Bottom - Aligns the user handles at the bottom of an object
     *  * Left - Aligns the user handles at the left of an object
     *  * Right - Aligns the user handles at the right of an object
     * @default 'Top'
     */
    side?: Side;

    /**
     * Defines the borderColor of user Handle 
     * @default ''
     */
    borderColor?: string;

    /**
     * Defines the borderWidth of user Handle 
     * @default 0.5
     */
    borderWidth?: number;

    /**
     * Defines the size of user Handle 
     * @default 25
     */
    size?: number;

    /**
     * Defines the path color of user Handle 
     * @default 'white'
     */
    pathColor?: string;

    /**
     * Defines the displacement of user Handle 
     * @default 10
     */
    displacement?: number;

    /**
     * Defines the visible of user Handle 
     * @default true
     */
    visible?: boolean;

    /**
     * Defines the offset of user Handle 
     * @default 0
     * @isBlazorNullableType true
     */
    offset?: number;

    /**
     * Defines the margin of the user handle
     * @default new Margin(0,0,0,0)
     */
    margin?: MarginModel;

    /**
     * Defines the horizontal alignment of the user handle
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Left - Aligns the diagram element at the left of its immediate parent
     * * Right - Aligns the diagram element at the right of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Center'
     */
    horizontalAlignment?: HorizontalAlignment;

    /**
     * Defines the vertical alignment of the user handle
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Top - Aligns the diagram element at the top of its immediate parent
     * * Bottom - Aligns the diagram element at the bottom of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Center'
     */
    verticalAlignment?: VerticalAlignment;

    /**
     * Defines the visible of user Handle 
     * @default false
     */
    disableNodes?: boolean;

    /**
     * Defines the visible of user Handle 
     * @default false
     */
    disableConnectors?: boolean;

    /**
     * defines geometry of the html element
     * @private
     * @default ''
     */
    template?: HTMLElement;

}