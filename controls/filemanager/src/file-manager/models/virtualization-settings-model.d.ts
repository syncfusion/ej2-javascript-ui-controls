import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class VirtualizationSettings
 */
export interface VirtualizationSettingsModel {

    /**
     * If `enable` is set to true, it will increase the FileManager performance, while loading a large number of files/folders.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Defines the number of records to be displayed in the details view.
     *
     * @default 20
     */
    detailsViewItemsCount?: number;

    /**
     * Defines the number of records to be displayed in large icons view.
     *
     * @default 40
     */
    largeIconsViewItemsCount?: number;

}