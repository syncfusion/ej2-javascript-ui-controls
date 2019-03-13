import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Specifies the Ajax settings of the File Manager.
 */
export class AjaxSettings extends ChildProperty<AjaxSettings> {
    /**
     * @hidden
     * Specifies URL to download the files from server.
     * @default null
     */
    @Property(null)
    public downloadUrl: string;

    /**
     * Specifies URL to get the images from server.
     * @default null
     */
    @Property(null)
    public getImageUrl: string;

    /**
     * @hidden
     * Specifies URL to upload the files to server.
     * @default null
     */
    @Property(null)
    public uploadUrl: string;

    /**
     * Specifies URL to read the files from server.
     * @default null
     */
    @Property(null)
    public url: string;
}

