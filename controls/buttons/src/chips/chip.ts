/**
 * A chip component is a small block of essential information, mostly used on contacts or filter tags.
 * ```html
 * <div id="chip"></div>
 * ```
 * ```typescript
 * <script>
 * var chipObj = new ChipList();
 * chipObj.appendTo("#chip");
 * </script>
 * ```
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
