import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Represents LinkSettings in the block editor component.
 */
export class LinkSettings extends ChildProperty<LinkSettings>{
    /**
     * Specifies the URL of the link.
     * This is the destination where the link will navigate to when clicked.
     *
     * @default ''
     */
    @Property('')
    public url: string;

    /**
     * Specifies whether the link should open in a new window/tab.
     * If set to true, the link will open in a new window/tab, otherwise it will open in the same window.
     *
     * @default true
     */
    @Property(true)
    public openInNewWindow: boolean;
}
