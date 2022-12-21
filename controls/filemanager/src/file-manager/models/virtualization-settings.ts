import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Specifies the virtualization settings of the File Manager.
 */
export class VirtualizationSettings extends ChildProperty<VirtualizationSettings> {

    /**
     * If `enable` is set to true, it will increase the FileManager performance, while loading a large number of files/folders.
     *
     * @default false
     */
    @Property(false)
    private enable: boolean;

    /**
     * Defines the number of records to be displayed in the details view.
     *
     * @default 20
     */
    @Property(20)
    private detailsViewItemsCount: number;

    /**
     * Defines the number of records to be displayed in large icons view.
     *
     * @default 40
     */
    @Property(40)
    private largeIconsViewItemsCount: number;
}
