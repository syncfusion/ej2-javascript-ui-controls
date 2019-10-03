/**
 * Represents ChipList `Chip` model class.
 */
export class Chip {
    /**
     * This text property helps to render ChipList component.

     */
    public text: string;

    /**
     * This avatarText property helps to customize avatar content.

     */
    public avatarText: string;

    /**
     * This avatarIconCss property helps to customize avatar element.

     */
    public avatarIconCss: string;

    /**
     * This leadingIconCss property helps to customize leading icon element.

     */
    public leadingIconCss: string;

    /**
     * This trailingIconCss property helps to customize trailing icon element.

     */
    public trailingIconCss: string;

    /**
     * This cssClass property helps to customize ChipList component.

     */
    public cssClass: string;

    /**
     * This enabled property helps to enable/disable ChipList component.

     */
    public enabled: boolean;
}


export interface ChipModel {
    /**
     * This text property helps to render ChipList component.

     */
    text?: string;

    /**
     * This avatarText property helps to customize avatar content.

     */
    avatarText?: string;

    /**
     * This avatarIconCss property helps to customize avatar element.

     */
    avatarIconCss?: string;

    /**
     * This leadingIconCss property helps to customize leading icon element.

     */
    leadingIconCss?: string;

    /**
     * This trailingIconCss property helps to customize trailing icon element.

     */
    trailingIconCss?: string;

    /**
     * This cssClass property helps to customize ChipList component.

     */
    cssClass?: string;

    /**
     * This enabled property helps to enable/disable ChipList component.

     */
    enabled?: boolean;
}
