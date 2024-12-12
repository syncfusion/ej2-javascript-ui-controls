import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Defines the ribbon backstage back button.
 */
export class BackstageBackButton extends ChildProperty<BackstageBackButton>  {

    /**
     * Specifies the text for backstage back button.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies the icon css class for backstage back button.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies whether to show the backstage back button or not.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;
}
