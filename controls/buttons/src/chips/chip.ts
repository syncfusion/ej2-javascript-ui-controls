/**
 * Represents ChipList `Chip` model class.
 */
export class Chip {
    /**
     * Specifies the text content for the chip.
     * @default ''
     */
    public text: string;

    /**
     * Specifies the customized text value for the avatar in the chip.
     * @default ''
     */
    public avatarText: string;

    /**
     * Specifies the icon CSS class for the avatar in the chip.
     * @default ''
     */
    public avatarIconCss: string;

    /**
     * Specifies the leading icon CSS class for the chip.
     * @default ''
     */
    public leadingIconCss: string;

    /**
     * Specifies the trailing icon CSS class for the chip.
     * @default ''
     */
    public trailingIconCss: string;

    /**
     * Specifies the custom classes to be added to the chip element used to customize the ChipList component.
     * @default ''
     */
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the chip component is enabled or not.
     * @default true
     * @blazorDefaultValue null
     * @blazorType bool?
     */
    public enabled: boolean;

    /**
     * Defines the value of the chip.
     * @default ''
     */
    public value: string | number;
}


export interface ChipModel {
    /**
     * Specifies the text content for the chip.
     * @default ''
     */
    text?: string;
    /**
     * Defines the value of the chip.
     * @default ''
     */
    value?: string | number;

    /**
     * Specifies the customized text value for the avatar in the chip.
     * @default ''
     */
    avatarText?: string;

    /**
     * Specifies the icon CSS class for the avatar in the chip.
     * @default ''
     */
    avatarIconCss?: string;

    /**
     * Specifies the leading icon CSS class for the chip.
     * @default ''
     */
    leadingIconCss?: string;

    /**
     * Specifies the trailing icon CSS class for the chip.
     * @default ''
     */
    trailingIconCss?: string;

    /**
     * Specifies the custom classes to be added to the chip element used to customize the ChipList component.
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the chip component is enabled or not.
     * @default true
     * @blazorDefaultValue null
     * @blazorType bool?
     */
    enabled?: boolean;

    /**
     * Specifies the leading icon url for the chip.
     * @default ''
     */
    leadingIconUrl?: string;

    /**
     * Specifies the trailing icon url for the chip.
     * @default ''
     */
    trailingIconUrl?: string;
}
