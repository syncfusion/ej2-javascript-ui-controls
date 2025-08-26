import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Interface for a class User
 */
export interface UserModel {

    /**
     * Specifies the unique identifier for the user.
     * This property is used to uniquely identify each user in the editor.
     *
     * @default ''
     */
    id?: string;

    /**
     * Specifies the name of the user.
     * This property stores the name of the user associated with the block.
     *
     * @default 'Default'
     */
    user?: string;

    /**
     * Specifies the URL of the user's avatar image.
     * This property holds the URL that points to the user's avatar image.
     *
     * @default ''
     */
    avatarUrl?: string;

    /**
     * Specifies the background color of the user's avatar.
     * This property defines the background color for the avatar and can also be used as the cursor color in collaborative editing.
     *
     * @default ''
     */
    avatarBgColor?: string;

    /**
     * Specifies the CSS class applied to the user block.
     * Allows custom styling by associating one or more CSS class names with the user.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the range of selected text or block for the user.
     * This property defines the start and end positions of the user's selection
     *
     * @default null
     */
    selectionRange?: [number, number];

}