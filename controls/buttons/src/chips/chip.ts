/**
 * Represents ChipList `Chip` model class.
 */
export class Chip {
    /**
     * This text property helps to render ChipList component.
     * @default ''
     */
    public text: string;

    /**
     * This avatarText property helps to customize avatar content.
     * @default ''
     */
    public avatarText: string;

    /**
     * This avatarIconCss property helps to customize avatar element.
     * @default ''
     */
    public avatarIconCss: string;

    /**
     * This leadingIconCss property helps to customize leading icon element.
     * @default ''
     */
    public leadingIconCss: string;

    /**
     * This trailingIconCss property helps to customize trailing icon element.
     * @default ''
     */
    public trailingIconCss: string;

    /**
     * This cssClass property helps to customize ChipList component.
     * @default ''
     */
    public cssClass: string;

    /**
     * This enabled property helps to enable/disable ChipList component.
     * @default true
     * @blazorDefaultValue null
     * @blazorType bool?
     */
    public enabled: boolean;
}


export interface ChipModel {
    /**
     * This text property helps to render ChipList component.
     * @default ''
     */
    text?: string;

    /**
     * This avatarText property helps to customize avatar content.
     * @default ''
     */
    avatarText?: string;

    /**
     * This avatarIconCss property helps to customize avatar element.
     * @default ''
     */
    avatarIconCss?: string;

    /**
     * This leadingIconCss property helps to customize leading icon element.
     * @default ''
     */
    leadingIconCss?: string;

    /**
     * This trailingIconCss property helps to customize trailing icon element.
     * @default ''
     */
    trailingIconCss?: string;

    /**
     * This cssClass property helps to customize ChipList component.
     * @default ''
     */
    cssClass?: string;

    /**
     * This enabled property helps to enable/disable ChipList component.
     * @default true
     * @blazorDefaultValue null
     * @blazorType bool?
     */
    enabled?: boolean;
}
