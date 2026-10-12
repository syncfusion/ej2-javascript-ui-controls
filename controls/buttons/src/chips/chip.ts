/**
 * Represents ChipList `Chip` model class.
 */
export class Chip {
    /**
     * Specifies the text content for the chip.
     *
     * @default ''
     */
    public text: string;

    /**
     * Specifies the customized text value for the avatar in the chip.
     *
     * @default ''
     */
    public avatarText: string;

    /**
     * Specifies the icon CSS class for the avatar in the chip.
     *
     * @default ''
     */
    public avatarIconCss: string;

    /**
     * Specifies the leading icon CSS class for the chip.
     *
     * @default ''
     */
    public leadingIconCss: string;

    /**
     * Specifies the trailing icon CSS class for the chip.
     *
     * @default ''
     */
    public trailingIconCss: string;

    /**
     * Specifies the custom classes to be added to the chip element used to customize the ChipList component.
     *
     * @default ''
     */
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the chip component is enabled or not.
     *
     * @default true
     */
    public enabled: boolean;

    /**
     * Defines the value of the chip.
     *
     * @default ''
     */

    public value: string | number;

    /**
     * Allows additional HTML attributes such as aria labels, title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     *
     * @default {}
     */
    public htmlAttributes: { [key: string]: string };
}


export interface ChipModel {
    /**
     * Specifies the text content for the chip.
     *
     * @default ''
     */
    text?: string;
    /**
     * Defines the value of the chip.
     *
     * @default ''
     */
    value?: string | number;

    /**
     * Specifies the customized text value for the avatar in the chip.
     *
     * @default ''
     */
    avatarText?: string;

    /**
     * Specifies the icon CSS class for the avatar in the chip.
     *
     * @default ''
     */
    avatarIconCss?: string;

    /**
     * Specifies the additional HTML attributes, such as title, styles, class, id, and name, in a key-value pair format
     * and appended to the chip item element of the Chip component. If both the property and equivalent HTML attributes are configured,
     * then the component overrides the property value with the HTML attributes.
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Specifies the leading icon CSS class for the chip.
     *
     * @default ''
     */
    leadingIconCss?: string;

    /**
     * Specifies the trailing icon CSS class for the chip.
     *
     * @default ''
     */
    trailingIconCss?: string;

    /**
     * Specifies the custom classes to be added to the chip element used to customize the ChipList component.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the chip component is enabled or not.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Specifies the leading icon url for the chip.
     *
     * @default ''
     */
    leadingIconUrl?: string;

    /**
     * Specifies the trailing icon url for the chip.
     *
     * @default ''
     */
    trailingIconUrl?: string;

    /**
     * Specifies the template content to be rendered for each individual chip item. This template allows for the rendering of custom HTML elements, such as anchor tags, SVG icons, or other components, within each chip item.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template?: string | Function;
}
