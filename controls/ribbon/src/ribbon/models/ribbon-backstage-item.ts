import { ChildProperty, Property, Event, EmitType, BaseEventArgs } from '@syncfusion/ej2-base';
import { BackstageItemModel } from './ribbon-backstage-item-model';

/**
 * Defines the ribbon backstage back button.
 */
export class BackstageItem extends ChildProperty<BackstageItem>  {

    /**
     * Specifies the text for backstage item.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Defines a unique identifier for the backstage item.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies the backstage item’s content as selector.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public content: string | Function;

    /**
     * Specifies the icon css class for backstage back button.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies the separator between the backstage items.
     *
     * @default false
     */
    @Property(false)
    public separator: boolean;

    /**
     * Specifies whether the item is placed in Footer section of backstage.
     *
     * @default false
     */
    @Property(false)
    public isFooter: boolean;

    /**
     * Event triggers when backstage item is clicked.
     *
     * @event backStageItemClick
     */
    @Event()
    public backStageItemClick: EmitType<BackstageItemClickArgs>;
}

/**
 * Event triggers when backstage item is clicked.
 */
export interface BackstageItemClickArgs extends BaseEventArgs {

    /**
     * Set to true when the event has to be canceled, else false.
     */
    cancel: boolean;

    /**
     * Provides the backstage menu item object.
     */
    item?: BackstageItemModel;

    /**
     *  Provides the HTML element of the backstage menu item clicked.
     */
    target: HTMLElement;

    /**
     * Returns true when back button item is clicked.
     */
    isBackButton: boolean;
}
  