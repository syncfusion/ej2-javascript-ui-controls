import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { AjaxSettings, AjaxSettingsModel, ContextMenuSettings, ContextMenuSettingsModel } from '@syncfusion/ej2-filemanager';
import { DetailsViewSettings, DetailsViewSettingsModel, NavigationPaneSettings } from '@syncfusion/ej2-filemanager';
import { NavigationPaneSettingsModel, SearchSettings, SearchSettingsModel, SortOrder } from '@syncfusion/ej2-filemanager';
import { ToolbarSettingsModel as FileToolbarSettingsModel, ToolbarSettings as FileToolbarSettings } from '@syncfusion/ej2-filemanager';
import { UploadSettings, UploadSettingsModel, ViewType } from '@syncfusion/ej2-filemanager';
import { SaveFormat } from '../../common';
import { ToolbarType, ActionOnScroll, ToolbarItems } from '../base/enum';
import { IToolbarItems, IDropDownItemModel, ColorModeType, IToolsItemConfigs, IListDropDownModel } from '../base/interface';
import { backgroundColor, fontColor, fontFamily, fontSize,  formatItems, predefinedItems, TableStyleItems, numberFormatList, bulletFormatList  } from './items';

/**
 * Configures the toolbar settings of the RichTextEditor.
 */
export class ToolbarSettings extends ChildProperty<ToolbarSettings> {
    /**
     * Specifies whether to render toolbar in RichTextEditor.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Specifies whether to enable/disable floating toolbar.
     *
     * @default true
     */
    @Property(true)
    public enableFloating: boolean;

    /**
     * Specifies the Toolbar display types.
     * The possible types are:
     * - Expand: Toolbar items placed within the available space and rest of the items are placed to the extended menu section.
     * - MultiRow: Toolbar which placed at top of Rich Text Editor editing area.
     * - Scrollable: All the toolbar items are displayed in a single line with horizontal scrolling enabled.
     *
     * @default Expand
     */
    @Property(ToolbarType.Expand)
    public type: ToolbarType;

    /**
     * An array of string or object that is used to configure items.
     *
     * @default ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'OrderedList',
     * 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo']
     */
    @Property(predefinedItems)
    public items: (string | IToolbarItems)[];

    /**
     * Using this property, Modify the default toolbar item configuration like icon class.
     *
     * @default {}
     */
    @Property({})
    public itemConfigs: { [key in ToolbarItems]?: IToolsItemConfigs };
}

/**
 * Configures the image settings of the RichTextEditor.
 */

export class ImageSettings extends ChildProperty<ImageSettings> {
    /**
     * Specifies whether to allowType based file select.
     *
     * @default ['.jpeg', '.jpg', '.png']
     */
    @Property(['.jpeg', '.jpg', '.png'])
    public allowedTypes: string[];
    /**
     * Specifies whether insert image inline or break.
     *
     * @default 'inline'
     */
    @Property('inline')
    public display: string;
    /**
     * Specifies whether the inserted image is saved as blob or base64.
     *
     * @default 'Blob'
     */
    @Property('Blob')
    public saveFormat: SaveFormat;
    /**
     * Specifies whether image width.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string;
    /**
     * Specifies whether image height.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string;
    /**
     * Specifies the URL of save action that will receive the upload files and save in the server.
     *
     * @default 'null'
     */
    @Property(null)
    public saveUrl: string;
    /**
     * Specifies the path of the location to store the images and refer it to display the images.
     *
     * @default 'null'
     */
    @Property(null)
    public path: string;
    /**
     * To enable resizing for image element.
     *
     * @default 'true'
     */
    @Property(true)
    public resize: boolean;
    /**
     * Specifies the URL of remove action that receives the file information and handle the remove operation in server.
     *
     * @default 'null'
     */
    @Property(null)
    public removeUrl: string;
    /**
     * Defines the minimum Width of the image.
     *
     * @default '0'
     */
    @Property(0)
    public minWidth: string | number;
    /**
     * Defines the maximum Width of the image.
     *
     * @default null
     */
    @Property(null)
    public maxWidth: string | number;
    /**
     * Defines the minimum Height of the image.
     *
     * @default '0'
     */
    @Property(0)
    public minHeight: string | number;
    /**
     * Defines the maximum Height of the image.
     *
     * @default null
     */
    @Property(null)
    public maxHeight: string | number;
    /**
     * image resizing should be done by percentage calculation.
     *
     * @default false
     */
    @Property(false)
    public resizeByPercent: boolean;
}

/**
 * Configures the file manager settings of the RichTextEditor.
 */
export class FileManagerSettings extends ChildProperty<FileManagerSettings> {
    /**
     * Specifies the AJAX settings of the file manager.
     *
     * @default {
     * getImageUrl: null;
     * url: null;
     * uploadUrl: null;
     * downloadUrl: null;
     * }
     */
    @Complex<AjaxSettingsModel>({ getImageUrl: null, url: null, uploadUrl: null }, AjaxSettings)
    public ajaxSettings: AjaxSettingsModel;
    /**
     * Enables or disables drag-and-drop of files.
     *
     * @default false
     */
    @Property(false)
    public allowDragAndDrop: boolean;
    /**
     * Specifies the context menu settings of the file manager.
     *
     * @default {
     *  file: ['Open', '|', 'Cut', 'Copy', '|', 'Delete', 'Rename', '|', 'Details'],
     *  folder: ['Open', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', '|', 'Details'],
     *  layout: ['SortBy', 'View', 'Refresh', '|', 'Paste', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll'],
     *  visible: true
     * }
     */
    @Complex<ContextMenuSettingsModel>({ visible: true, file: ['Open', '|', 'Cut', 'Copy', '|', 'Delete', 'Rename', '|', 'Details'], folder: ['Open', '|', 'Cut', 'Copy', 'Paste', '|', 'Delete', 'Rename', '|', 'Details'], layout: ['SortBy', 'View', 'Refresh', '|', 'Paste', '|', 'NewFolder', 'Upload', '|', 'Details', '|', 'SelectAll'] }, ContextMenuSettings)
    public contextMenuSettings: ContextMenuSettingsModel;
    /**
     * Specifies the root CSS class of the file manager that allows you to customize the appearance by overriding the styles.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Specifies the details view settings of the file manager.
     *
     * @default {
     *  columns: [{
     *    field: 'name', headerText: 'Name', minWidth: 120, template: '<span class="e-fe-text">${name}</span>',
     *    customAttributes: { class: 'e-fe-grid-name'}}, { field: '_fm_modified', headerText: 'DateModified', type: 'dateTime',
     *    format: 'MMMM dd, yyyy HH:mm', minWidth: 120, width: '190' }, { field: 'size', headerText: 'Size', minWidth: 90, width: '110',
     *    template: '<span class="e-fe-size">${size}</span>'
     *  }]
     * }
     */
    @Complex<DetailsViewSettingsModel>({}, DetailsViewSettings)
    public detailsViewSettings: DetailsViewSettingsModel;
    /**
     * Specifies whether to enable the file manager in RichTextEditor.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * Specifies the navigation pane settings of the file manager.
     *
     * @default { maxWidth: '650px', minWidth: '240px', visible: true }
     */
    @Complex<NavigationPaneSettingsModel>({ maxWidth: '650px', minWidth: '240px', visible: true }, NavigationPaneSettings)
    public navigationPaneSettings: NavigationPaneSettingsModel;
    /**
     * Specifies the current path of the file manager.
     *
     * @default '/'
     */
    @Property('/')
    public path: string;
    /**
     * Specifies the root folder alias name in file manager
     *
     * @default null
     */
    @Property(null)
    public rootAliasName: string;
    /**
     * Specifies the search settings of the file manager.
     *
     * @default {
     *  allowSearchOnTyping: true,
     *  filterType: 'contains',
     *  ignoreCase: true
     * }
     */
    @Complex<SearchSettingsModel>({}, SearchSettings)
    public searchSettings: SearchSettingsModel;
    /**
     * Shows or hides the file extension in file manager.
     *
     * @default true
     */
    @Property(true)
    public showFileExtension: boolean;
    /**
     * Shows or hides the files and folders that are marked as hidden.
     *
     * @default false
     */
    @Property(false)
    public showHiddenItems: boolean;
    /**
     * Shows or hides the thumbnail images in large icons view.
     *
     * @default true
     */
    @Property(true)
    public showThumbnail: boolean;
    /**
     * Specifies a value that indicates whether the folders and files are sorted in the ascending or descending order,
     * or they are not sorted at all. The available types of sort orders are,
     * `None` - Indicates that the folders and files are not sorted.
     * `Ascending` - Indicates that the folders and files are sorted in the ascending order.
     * `Descending` - Indicates that the folders and files are sorted in the descending order.
     *
     * @default 'Ascending'
     */
    @Property('Ascending')
    public sortOrder: SortOrder;
    /**
     * Specifies the group of items aligned horizontally in the toolbar.
     *
     * @default { visible: true, items: ['NewFolder', 'Upload', 'Cut', 'Copy', 'Paste', 'Delete', 'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'] }
     */
    @Complex<FileToolbarSettingsModel>({ visible: true, items: ['NewFolder', 'Upload', 'Cut', 'Copy', 'Paste', 'Delete', 'Download', 'Rename', 'SortBy', 'Refresh', 'Selection', 'View', 'Details'] }, FileToolbarSettings)
    public toolbarSettings: FileToolbarSettingsModel;
    /**
     * Specifies the upload settings for the file manager.
     *
     * @default { autoUpload: true, minFileSize: 0, maxFileSize: 30000000, allowedExtensions: '', autoClose: false }
     */
    @Complex<UploadSettingsModel>({ autoUpload: true, minFileSize: 0, maxFileSize: 30000000, allowedExtensions: '', autoClose: false }, UploadSettings)
    public uploadSettings: UploadSettingsModel;
    /**
     * Specifies the initial view of the file manager.
     *
     * With the help of this property, initial view can be changed to details or largeicons view. The available views are:
     * * `LargeIcons`
     * * `Details`
     *
     * @default 'LargeIcons'
     */
    @Property('LargeIcons')
    public view: ViewType;
}

export class TableSettings extends ChildProperty<TableSettings> {
    /**
     * To specify the width of table
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;
    /**
     * Class name should be appended by default in table element.
     * It helps to design the table in specific CSS styles always when inserting in editor.
     *
     * @default TableStyleItems;
     */
    @Property(TableStyleItems)
    public styles: IDropDownItemModel[];
    /**
     * To enable resizing for table element.
     *
     * @default 'true'
     */
    @Property(true)
    public resize: boolean;
    /**
     * Defines the minimum Width of the table.
     *
     * @default '0'
     */
    @Property(0)
    public minWidth: string | number;
    /**
     * Defines the maximum Width of the table.
     *
     * @default null
     */
    @Property(null)
    public maxWidth: string | number;
}
/**
 * Configures the quick toolbar settings of the RichTextEditor.
 */
export class QuickToolbarSettings extends ChildProperty<QuickToolbarSettings> {
    /**
     * Specifies whether to enable quick toolbar in RichTextEditor.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Specifies whether to opens a quick toolbar on the right click.
     *
     * @default false
     */
    @Property(false)
    public showOnRightClick: boolean;

    /**
     * Specifies the action that should happen when scroll the target-parent container.
     *
     * @default 'hide'
     */
    @Property('hide')
    public actionOnScroll: ActionOnScroll;

    /**
     * Specifies the items to render in quick toolbar, when link selected.
     *
     * @default ['Open', 'Edit', 'UnLink']
     */
    @Property(['Open', 'Edit', 'UnLink'])
    public link: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when image selected.
     *
     * @default ['Replace', 'Align', 'Caption', 'Remove', '-', 'InsertLink','OpenImageLink', 'EditImageLink', 'RemoveImageLink', 'Display', 'AltText', 'Dimension']
     */
    @Property(['Replace', 'Align', 'Caption', 'Remove', '-', 'InsertLink', 'OpenImageLink', 'EditImageLink', 'RemoveImageLink', 'Display', 'AltText', 'Dimension'])
    public image: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when text selected.
     *
     * @default ['Cut', 'Copy', 'Paste']
     * @deprecated
     */
    @Property(['Cut', 'Copy', 'Paste'])
    public text: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when table selected.
     *
     * @default ['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles']
     */
    @Property(['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles'])
    public table: (string | IToolbarItems)[];
}

/**
 * Configures the Paste Cleanup settings of the RichTextEditor.
 */
export class PasteCleanupSettings extends ChildProperty<PasteCleanupSettings> {
    /**
     * Specifies whether to enable the prompt for paste in RichTextEditor.
     *
     * @default false
     */
    @Property(false)
    public prompt: boolean;

    /**
     * Specifies the attributes to restrict when pasting in RichTextEditor.
     *
     * @default null
     */
    @Property(null)
    public deniedAttrs: string[];

    /**
     * Specifies the allowed style properties when pasting in RichTextEditor.
     *
     * @default ['background', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-style', 'border-top', 'border-width', 'clear', 'color', 'cursor', 'direction', 'display', 'float', 'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'height', 'left', 'line-height', 'list-style-type', 'margin', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'max-height', 'max-width', 'min-height', 'min-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'position', 'right', 'table-layout', 'text-align', 'text-decoration', 'text-indent', 'top', 'vertical-align', 'visibility', 'white-space', 'width']
     */
    @Property(['background', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-style', 'border-top', 'border-width', 'clear', 'color', 'cursor', 'direction', 'display', 'float', 'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'height', 'left', 'line-height', 'list-style-type', 'margin', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'max-height', 'max-width', 'min-height', 'min-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'position', 'right', 'table-layout', 'text-align', 'text-decoration', 'text-indent', 'top', 'vertical-align', 'visibility', 'white-space', 'width'])
    public allowedStyleProps: string[];

    /**
     * Specifies the tags to restrict when pasting in RichTextEditor.
     *
     * @default null
     */
    @Property(null)
    public deniedTags: string[];

    /**
     * Specifies whether to keep or remove the format when pasting in RichTextEditor.
     *
     * @default true
     */
    @Property(true)
    public keepFormat: boolean;

    /**
     * Specifies whether to paste as plain text or not in RichTextEditor.
     *
     * @default false
     */
    @Property(false)
    public plainText: boolean;
}

/**
 * Configures the font family settings of the RichTextEditor.
 */

export class FontFamily extends ChildProperty<FontFamily> {
    /**
     * Specifies default font family selection
     *
     * @default 'null'
     */
    @Property(null)
    public default: string;
    /**
     * Specifies content width
     *
     * @default '65px'
     */
    @Property('65px')
    public width: string;
    /**
     * Specifies default font family items
     *
     * @default fontFamily
     */
    @Property(fontFamily)
    public items: IDropDownItemModel[];
}

/**
 * Configures the font size settings of the RichTextEditor.
 */

export class FontSize extends ChildProperty<FontSize> {
    /**
     * Specifies default font size selection
     *
     * @default 'null'
     */
    @Property(null)
    public default: string;
    /**
     * Specifies content width
     *
     * @default '35px'
     */
    @Property('35px')
    public width: string;
    /**
     * Specifies default font size items
     *
     * @default fontSize
     */
    @Property(fontSize)
    public items: IDropDownItemModel[];
}

/**
 * Configures the format settings of the RichTextEditor.
 */

export class Format extends ChildProperty<Format> {
    /**
     * Specifies default format
     *
     * @default 'null'
     */
    @Property(null)
    public default: string;
    /**
     * Specifies content width
     *
     * @default '65px'
     */
    @Property('65px')
    public width: string;
    /**
     * Specifies default font size items
     *
     * @default formatItems
     */
    @Property(formatItems)
    public types: IDropDownItemModel[];
}

/**
 * Configures the font Color settings of the RichTextEditor.
 */

export class FontColor extends ChildProperty<FontColor> {
    /**
     * Specifies default font color
     *
     * @default '#ff0000'
     */
    @Property('#ff0000')
    public default: string;
    /**
     * Specifies mode
     *
     * @default 'Palette'
     */
    @Property('Palette')
    public mode: ColorModeType;
    /**
     * Specifies columns
     *
     * @default 10
     */
    @Property(10)
    public columns: number;
    /**
     * Specifies color code customization
     *
     * @default fontColor
     */
    @Property(fontColor)
    public colorCode: { [key: string]: string[] };
    /**
     * Specifies modeSwitcher button
     *
     * @default false
     */
    @Property(false)
    public modeSwitcher: boolean;
}

/**
 * Configures the background Color settings of the RichTextEditor.
 */

export class BackgroundColor extends ChildProperty<BackgroundColor> {
    /**
     * Specifies default font color
     *
     * @default '#ffff00'
     */
    @Property('#ffff00')
    public default: string;
    /**
     * Specifies mode
     *
     * @default 'Palette'
     */
    @Property('Palette')
    public mode: ColorModeType;
    /**
     * Specifies columns
     *
     * @default 10
     */
    @Property(10)
    public columns: number;
    /**
     * Specifies color code customization
     *
     * @default backgroundColor
     */
    @Property(backgroundColor)
    public colorCode: { [key: string]: string[] };
    /**
     * Specifies a modeSwitcher button
     *
     * @default false
     */
    @Property(false)
    public modeSwitcher: boolean;
}
/**
 * Configures the numberFormatList settings of the RichTextEditor.
 */
export class NumberFormatList extends ChildProperty<NumberFormatList> {
    /**
     * Specifies default numberFormatList items
     *
     * @default numberFormatList
     */
    @Property(numberFormatList)
    public types: IListDropDownModel[];
}

/**
 * Configures the bulletFormatList settings of the RichTextEditor.
 */
export class BulletFormatList extends ChildProperty<BulletFormatList> {
    /**
     * Specifies default numberFormatList items
     *
     * @default bulletFormatList
     */
    @Property(bulletFormatList)
    public types: IListDropDownModel[];
}
