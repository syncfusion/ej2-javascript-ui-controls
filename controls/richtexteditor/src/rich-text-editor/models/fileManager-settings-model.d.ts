import { Property, ChildProperty, Complex, Event, EmitType } from '@syncfusion/ej2-base';import { AjaxSettings, AjaxSettingsModel, ContextMenuSettings, ContextMenuSettingsModel, BeforeSendEventArgs } from '@syncfusion/ej2-filemanager';import { DetailsViewSettings, DetailsViewSettingsModel, NavigationPaneSettings } from '@syncfusion/ej2-filemanager';import { NavigationPaneSettingsModel, SearchSettings, SearchSettingsModel, SortOrder } from '@syncfusion/ej2-filemanager';import { ToolbarSettingsModel as FileToolbarSettingsModel, ToolbarSettings as FileToolbarSettings } from '@syncfusion/ej2-filemanager';import { UploadSettings, UploadSettingsModel, ViewType } from '@syncfusion/ej2-filemanager';

/**
 * Interface for a class FileManagerSettings
 */
export interface FileManagerSettingsModel {

    /**
     * Event triggered before sending an AJAX request to the server.
     * Set the cancel argument to true to prevent the request.
     *
     * @event beforeSend
     */
    beforeSend?: EmitType<BeforeSendEventArgs>;

    /**
     * Specifies the AJAX settings for the file manager.
     *
     * @default {
     *   getImageUrl: null,
     *   url: null,
     *   uploadUrl: null
     * }
     */
    ajaxSettings?: AjaxSettingsModel;

    /**
     * Enables or disables drag-and-drop functionality for files.
     *
     * @default false
     */
    allowDragAndDrop?: boolean;

    /**
     * Specifies the context menu settings for the file manager.
     *
     * @default {
     *   file: ['Open', '|', 'Cut', 'Copy', '|', 'Delete', 'Rename', '|', 'Details'],
     *   folder: ['Open', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', '|', 'Details'],
     *   layout: ['SortBy', 'View', 'Refresh', '|', 'Paste', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll'],
     *   visible: true
     * }
     */
    contextMenuSettings?: ContextMenuSettingsModel;

    /**
     * Specifies the root CSS class of the file manager, allowing customization by overriding styles.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the details view settings for the file manager.
     *
     * @default {
     *   columns: [{
     *     field: 'name', headerText: 'Name', minWidth: 120, template: '<span class="e-fe-text">${name}</span>',
     *     customAttributes: { class: 'e-fe-grid-name'}}, { field: '_fm_modified', headerText: 'DateModified', type: 'dateTime',
     *     format: 'MMMM dd, yyyy HH:mm', minWidth: 120, width: '190' }, { field: 'size', headerText: 'Size', minWidth: 90, width: '110',
     *     template: '<span class="e-fe-size">${size}</span>' }
     *   ]
     * }
     */
    detailsViewSettings?: DetailsViewSettingsModel;

    /**
     * Specifies whether to enable the file manager in the RichTextEditor.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Specifies the navigation pane settings for the file manager.
     *
     * @default { maxWidth: '650px', minWidth: '240px', visible: true }
     */
    navigationPaneSettings?: NavigationPaneSettingsModel;

    /**
     * Specifies the current path in the file manager.
     *
     * @default '/'
     */
    path?: string;

    /**
     * Specifies the alias name for the root folder in the file manager.
     *
     * @default null
     */
    rootAliasName?: string;

    /**
     * Specifies the search settings for the file manager.
     *
     * @default {
     *   allowSearchOnTyping: true,
     *   filterType: 'contains',
     *   ignoreCase: true
     * }
     */
    searchSettings?: SearchSettingsModel;

    /**
     * Determines whether to show or hide file extensions in the file manager.
     *
     * @default true
     */
    showFileExtension?: boolean;

    /**
     * Determines whether to show or hide files and folders marked as hidden.
     *
     * @default false
     */
    showHiddenItems?: boolean;

    /**
     * Determines whether to show or hide thumbnail images in the large icons view.
     *
     * @default true
     */
    showThumbnail?: boolean;

    /**
     * Specifies the sort order for folders and files. Options are:
     * - `None`: Folders and files are not sorted.
     * - `Ascending`: Folders and files are sorted in ascending order.
     * - `Descending`: Folders and files are sorted in descending order.
     *
     * @default 'Ascending'
     */
    sortOrder?: SortOrder;

    /**
     * Specifies groups of items aligned horizontally in the toolbar.
     *
     * @default { visible: true, items: ['NewFolder', 'Upload', 'Cut', 'Copy', 'Paste', 'Delete', 'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'] }
     */
    toolbarSettings?: FileToolbarSettingsModel;

    /**
     * Specifies the upload settings for the file manager.
     *
     * @default { autoUpload: true, minFileSize: 0, maxFileSize: 30000000, allowedExtensions: '', autoClose: false }
     */
    uploadSettings?: UploadSettingsModel;

    /**
     * Specifies the initial view of the file manager.
     *
     * This property allows setting the initial view to either 'Details' or 'LargeIcons'. The available views are:
     * - `LargeIcons`
     * - `Details`
     *
     * @default 'LargeIcons'
     */
    view?: ViewType;

}