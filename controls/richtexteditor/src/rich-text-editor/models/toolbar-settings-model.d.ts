import { Property, ChildProperty, Complex, Event, EmitType } from '@syncfusion/ej2-base';import { AjaxSettings, AjaxSettingsModel, ContextMenuSettings, ContextMenuSettingsModel, BeforeSendEventArgs } from '@syncfusion/ej2-filemanager';import { DetailsViewSettings, DetailsViewSettingsModel, NavigationPaneSettings } from '@syncfusion/ej2-filemanager';import { NavigationPaneSettingsModel, SearchSettings, SearchSettingsModel, SortOrder } from '@syncfusion/ej2-filemanager';import { ToolbarSettingsModel as FileToolbarSettingsModel, ToolbarSettings as FileToolbarSettings } from '@syncfusion/ej2-filemanager';import { UploadSettings, UploadSettingsModel, ViewType } from '@syncfusion/ej2-filemanager';import { SaveFormat, DisplayLayoutOptions } from '../../common';import { ToolbarType, ActionOnScroll, ToolbarItems, ToolbarConfigItems } from '../base/enum';import { IToolbarItems, IDropDownItemModel, ColorModeType, IToolsItemConfigs, IListDropDownModel, EmojiIconsSet } from '../base/interface';import { backgroundColor, fontColor, fontFamily, fontSize, formatItems, predefinedItems, TableStyleItems, numberFormatList, bulletFormatList, defaultEmojiIcons } from './items';

/**
 * Interface for a class ToolbarSettings
 */
export interface ToolbarSettingsModel {

    /**
     * Specifies whether to render toolbar in RichTextEditor.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * Specifies whether to enable/disable floating toolbar.
     *
     * @default true
     */
    enableFloating?: boolean;

    /**
     * Specifies the Toolbar display types.
     * The possible types are:
     * - Expand: Toolbar items placed within the available space and rest of the items are placed to the extended menu section.
     * - MultiRow: Toolbar which placed at top of Rich Text Editor editing area.
     * - Scrollable: All the toolbar items are displayed in a single line with horizontal scrolling enabled.
     *
     * @default Expand
     */
    type?: ToolbarType;

    /**
     * An array of string or object that is used to configure items.
     *
     * @default ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'Blockquote' 'OrderedList',
     * 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo']
     */
    items?: (string |ToolbarConfigItems | IToolbarItems)[];

    /**
     * Using this property, Modify the default toolbar item configuration like icon class.
     *
     * @default {}
     */
    itemConfigs?: { [key in ToolbarItems]?: IToolsItemConfigs };

}

/**
 * Interface for a class ImageSettings
 */
export interface ImageSettingsModel {

    /**
     * Specifies whether to allowType based file select.
     *
     * @default ['.jpeg', '.jpg', '.png']
     */
    allowedTypes?: string[];

    /**
     * Specifies whether insert image inline or break.
     *
     * @default 'inline'
     */
    display?: string;

    /**
     * Specifies whether the inserted image is saved as blob or base64.
     *
     * @default 'Blob'
     */
    saveFormat?: SaveFormat;

    /**
     * Specifies whether image width.
     *
     * @default 'auto'
     */
    width?: string;

    /**
     * Specifies whether image height.
     *
     * @default 'auto'
     */
    height?: string;

    /**
     * Specifies the URL of save action that will receive the upload files and save in the server.
     *
     * @default 'null'
     */
    saveUrl?: string;

    /**
     * Specifies the path of the location to store the images and refer it to display the images.
     *
     * @default 'null'
     */
    path?: string;

    /**
     * To enable resizing for image element.
     *
     * @default 'true'
     */
    resize?: boolean;

    /**
     * Specifies the URL of remove action that receives the file information and handle the remove operation in server.
     *
     * @default 'null'
     */
    removeUrl?: string;

    /**
     * Defines the minimum Width of the image.
     *
     * @default '0'
     */
    minWidth?: string | number;

    /**
     * Defines the maximum Width of the image.
     *
     * @default null
     */
    maxWidth?: string | number;

    /**
     * Defines the minimum Height of the image.
     *
     * @default '0'
     */
    minHeight?: string | number;

    /**
     * Defines the maximum Height of the image.
     *
     * @default null
     */
    maxHeight?: string | number;

    /**
     * image resizing should be done by percentage calculation.
     *
     * @default false
     */
    resizeByPercent?: boolean;

}

/**
 * Interface for a class AudioSettings
 */
export interface AudioSettingsModel {

    /**
     * Specifies whether to allowType based file select.
     *
     * @default ['.wav', '.mp3', '.m4a','.wma']
     */
    allowedTypes?: string[];

    /**
     * Specifies whether insert audio inline or break.
     *
     * @default 'Inline'
     */
    layoutOption?: DisplayLayoutOptions;

    /**
     * Specifies whether the inserted audio is saved as blob or base64.
     *
     * @default 'Blob'
     */
    saveFormat?: SaveFormat;

    /**
     * Specifies the URL of save action that will receive the upload files and save in the server.
     *
     * @default 'null'
     */
    saveUrl?: string;

    /**
     * Specifies the URL of remove action that receives the file information and handle the remove operation in server.
     *
     * @default 'null'
     */
    removeUrl?: string;

    /**
     * Specifies the path of the location to store the audio and refer it to display the audio.
     *
     * @default 'null'
     */
    path?: string;

}

/**
 * Interface for a class VideoSettings
 */
export interface VideoSettingsModel {

    /**
     * Specifies whether to allowType based file select.
     *
     * @default ['.mp4', '.mov', '.wmv','.avi']
     */
    allowedTypes?: string[];

    /**
     * Specifies whether insert video inline or break.
     *
     * @default 'Inline'
     */
    layoutOption?: DisplayLayoutOptions;

    /**
     * Specifies whether the inserted video is saved as blob or base64.
     *
     * @default 'Blob'
     */
    saveFormat?: SaveFormat;

    /**
     * Specifies whether video width.
     *
     * @default 'auto'
     */
    width?: string;

    /**
     * Specifies whether video height.
     *
     * @default 'auto'
     */
    height?: string;

    /**
     * Specifies the URL of save action that will receive the upload files and save in the server.
     *
     * @default 'null'
     */
    saveUrl?: string;

    /**
     * Specifies the path of the location to store the images and refer it to display the images.
     *
     * @default 'null'
     */
    path?: string;

    /**
     * To enable resizing for video element.
     *
     * @default 'true'
     */
    resize?: boolean;

    /**
     * Specifies the URL of remove action that receives the file information and handle the remove operation in server.
     *
     * @default 'null'
     */
    removeUrl?: string;

    /**
     * Defines the minimum Width of the video.
     *
     * @default '0'
     */
    minWidth?: string | number;

    /**
     * Defines the maximum Width of the video.
     *
     * @default null
     */
    maxWidth?: string | number;

    /**
     * Defines the minimum Height of the video.
     *
     * @default '0'
     */
    minHeight?: string | number;

    /**
     * Defines the maximum Height of the video.
     *
     * @default null
     */
    maxHeight?: string | number;

    /**
     * Video resizing should be done by percentage calculation.
     *
     * @default false
     */
    resizeByPercent?: boolean;

}

/**
 * Interface for a class FileManagerSettings
 */
export interface FileManagerSettingsModel {

    /**
     * Event triggers before sending the AJAX request to the server.
     * Set the cancel argument to true to cancel the request.
     *
     * @event 'beforeSend'
     */

    beforeSend?: EmitType<BeforeSendEventArgs>;

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
    ajaxSettings?: AjaxSettingsModel;

    /**
     * Enables or disables drag-and-drop of files.
     *
     * @default false
     */
    allowDragAndDrop?: boolean;

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
    contextMenuSettings?: ContextMenuSettingsModel;

    /**
     * Specifies the root CSS class of the file manager that allows you to customize the appearance by overriding the styles.
     *
     * @default ''
     */
    cssClass?: string;

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
    detailsViewSettings?: DetailsViewSettingsModel;

    /**
     * Specifies whether to enable the file manager in RichTextEditor.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Specifies the navigation pane settings of the file manager.
     *
     * @default { maxWidth: '650px', minWidth: '240px', visible: true }
     */
    navigationPaneSettings?: NavigationPaneSettingsModel;

    /**
     * Specifies the current path of the file manager.
     *
     * @default '/'
     */
    path?: string;

    /**
     * Specifies the root folder alias name in file manager
     *
     * @default null
     */
    rootAliasName?: string;

    /**
     * Specifies the search settings of the file manager.
     *
     * @default {
     *  allowSearchOnTyping: true,
     *  filterType: 'contains',
     *  ignoreCase: true
     * }
     */
    searchSettings?: SearchSettingsModel;

    /**
     * Shows or hides the file extension in file manager.
     *
     * @default true
     */
    showFileExtension?: boolean;

    /**
     * Shows or hides the files and folders that are marked as hidden.
     *
     * @default false
     */
    showHiddenItems?: boolean;

    /**
     * Shows or hides the thumbnail images in large icons view.
     *
     * @default true
     */
    showThumbnail?: boolean;

    /**
     * Specifies a value that indicates whether the folders and files are sorted in the ascending or descending order,
     * or they are not sorted at all. The available types of sort orders are,
     * `None` - Indicates that the folders and files are not sorted.
     * `Ascending` - Indicates that the folders and files are sorted in the ascending order.
     * `Descending` - Indicates that the folders and files are sorted in the descending order.
     *
     * @default 'Ascending'
     */
    sortOrder?: SortOrder;

    /**
     * Specifies the group of items aligned horizontally in the toolbar.
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
     * With the help of this property, initial view can be changed to details or largeicons view. The available views are:
     * * `LargeIcons`
     * * `Details`
     *
     * @default 'LargeIcons'
     */
    view?: ViewType;

}

/**
 * Interface for a class TableSettings
 */
export interface TableSettingsModel {

    /**
     * To specify the width of table
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Class name should be appended by default in table element.
     * It helps to design the table in specific CSS styles always when inserting in editor.
     *
     * @default TableStyleItems;
     */
    styles?: IDropDownItemModel[];

    /**
     * To enable resizing for table element.
     *
     * @default 'true'
     */
    resize?: boolean;

    /**
     * Defines the minimum Width of the table.
     *
     * @default '0'
     */
    minWidth?: string | number;

    /**
     * Defines the maximum Width of the table.
     *
     * @default null
     */
    maxWidth?: string | number;

}

/**
 * Interface for a class QuickToolbarSettings
 */
export interface QuickToolbarSettingsModel {

    /**
     * Specifies whether to enable quick toolbar in RichTextEditor.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * Specifies whether to opens a quick toolbar on the right click.
     *
     * @default false
     */
    showOnRightClick?: boolean;

    /**
     * Specifies the action that should happen when scroll the target-parent container.
     *
     * @default 'hide'
     */
    actionOnScroll?: ActionOnScroll;

    /**
     * Specifies the items to render in quick toolbar, when link selected.
     *
     * @default ['Open', 'Edit', 'UnLink']
     */
    link?: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when image selected.
     *
     * @default ['Replace', 'Align', 'Caption', 'Remove', '-', 'InsertLink','OpenImageLink', 'EditImageLink', 'RemoveImageLink', 'Display', 'AltText', 'Dimension']
     */
    image?: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when audio selected.
     *
     * @default ['AudioReplace', 'Remove', 'AudioLayoutOption']
     */
    audio?: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when video selected.
     *
     * @default ['VideoReplace', 'VideoAlign', 'VideoRemove', 'VideoLayoutOption', 'VideoDimension']
     */
    video?: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when text selected.
     *
     * @default null
     */
    text?: (string | ToolbarConfigItems | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when table selected.
     *
     * @default ['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles']
     */
    table?: (string | IToolbarItems)[];

}

/**
 * Interface for a class FormatPainterSettings
 */
export interface FormatPainterSettingsModel {

    /**
     * Defines the tag name selectors for obtaining the formats from the elements.
     *
     * @default 'b; em; font; sub; sup; kbd; i; s; u; code; strong; span; p; div; h1; h2; h3; h4; h5; h6; blockquote; ol; ul; li; pre;'
     */
    allowedFormats?: string;

    /**
     * Defines selectors for the elements from which fetching formats is expressly prohibited.
     *
     * @default null
     */
    deniedFormats?: string;

}

/**
 * Interface for a class EmojiSettings
 */
export interface EmojiSettingsModel {

    /**
     * Specify an array of items representing emoji icons.
     *
     * @default [{
        name: 'Smilies & People', code: '1F600', iconCss: 'e-emoji', icons: [{ code: '1F600', desc: 'Grinning face' },
        { code: '1F603', desc: 'Grinning face with big eyes' },
        { code: '1F604', desc: 'Grinning face with smiling eyes' },
        { code: '1F606', desc: 'Grinning squinting face' },
        { code: '1F605', desc: 'Grinning face with sweat' },
        { code: '1F602', desc: 'Face with tears of joy' },
        { code: '1F923', desc: 'Rolling on the floor laughing' },
        { code: '1F60A', desc: 'Smiling face with smiling eyes' },
        { code: '1F607', desc: 'Smiling face with halo' },
        { code: '1F642', desc: 'Slightly smiling face' },
        { code: '1F643', desc: 'Upside-down face' },
        { code: '1F60D', desc: 'Smiling face with heart-eyes' },
        { code: '1F618', desc: 'Face blowing a kiss' },
        { code: '1F61B', desc: 'Face with tongue' },
        { code: '1F61C', desc: 'Winking face with tongue' },
        { code: '1F604', desc: 'Grinning face with smiling eyes' },
        { code: '1F469', desc: 'Woman' },
        { code: '1F468', desc: 'Man' },
        { code: '1F467', desc: 'Girl' },
        { code: '1F466', desc: 'Boy' },
        { code: '1F476', desc: 'Baby' },
        { code: '1F475', desc: 'Old woman' },
        { code: '1F474', desc: 'Old man' },
        { code: '1F46E', desc: 'Police officer' },
        { code: '1F477', desc: 'Construction worker' },
        { code: '1F482', desc: 'Guard' },
        { code: '1F575', desc: 'Detective' },
        { code: '1F9D1', desc: 'Cook' }]
    }, {
        name: 'Animals & Nature', code: '1F435', iconCss: 'e-animals', icons: [{ code: '1F436', desc: 'Dog face' },
        { code: '1F431', desc: 'Cat face' },
        { code: '1F42D', desc: 'Mouse face' },
        { code: '1F439', desc: 'Hamster face' },
        { code: '1F430', desc: 'Rabbit face' },
        { code: '1F98A', desc: 'Fox face' },
        { code: '1F43B', desc: 'Bear face' },
        { code: '1F43C', desc: 'Panda face' },
        { code: '1F428', desc: 'Koala' },
        { code: '1F42F', desc: 'Tiger face' },
        { code: '1F981', desc: 'Lion face' },
        { code: '1F42E', desc: 'Cow face' },
        { code: '1F437', desc: 'Pig face' },
        { code: '1F43D', desc: 'Pig nose' },
        { code: '1F438', desc: 'Frog face' },
        { code: '1F435', desc: 'Monkey face' },
        { code: '1F649', desc: 'Hear-no-evil monkey' },
        { code: '1F64A', desc: 'Speak-no-evil monkey' },
        { code: '1F412', desc: 'Monkey' },
        { code: '1F414', desc: 'Chicken' },
        { code: '1F427', desc: 'Penguin' },
        { code: '1F426', desc: 'Bird' },
        { code: '1F424', desc: 'Baby chick' },
        { code: '1F986', desc: 'Duck' },
        { code: '1F985', desc: 'Eagle' }]
    }, {
        name: 'Food & Drink', code: '1F347', iconCss: 'e-food-and-drinks', icons: [{ code: '1F34E', desc: 'Red apple' },
        { code: '1F34C', desc: 'Banana' },
        { code: '1F347', desc: 'Grapes' },
        { code: '1F353', desc: 'Strawberry' },
        { code: '1F35E', desc: 'Bread' },
        { code: '1F950', desc: 'Croissant' },
        { code: '1F955', desc: 'Carrot' },
        { code: '1F354', desc: 'Hamburger' },
        { code: '1F355', desc: 'Pizza' },
        { code: '1F32D', desc: 'Hot dog' },
        { code: '1F35F', desc: 'French fries' },
        { code: '1F37F', desc: 'Popcorn' },
        { code: '1F366', desc: 'Soft ice cream' },
        { code: '1F367', desc: 'Shaved ice' },
        { code: '1F36A', desc: 'Cookie' },
        { code: '1F382', desc: 'Birthday cake' },
        { code: '1F370', desc: 'Shortcake' },
        { code: '1F36B', desc: 'Chocolate bar' },
        { code: '1F369', desc: 'Donut' },
        { code: '1F36E', desc: 'Custard' },
        { code: '1F36D', desc: 'Lollipop' },
        { code: '1F36C', desc: 'Candy' },
        { code: '1F377', desc: 'Wine glass' },
        { code: '1F37A', desc: 'Beer mug' },
        { code: '1F37E', desc: 'Bottle with popping cork' }]
    }, {
        name: 'Activities', code: '1F383', iconCss: 'e-activities', icons: [{ code: '26BD', desc: 'Soccer ball' },
        { code: '1F3C0', desc: 'Basketball' },
        { code: '1F3C8', desc: 'American football' },
        { code: '26BE', desc: 'Baseball' },
        { code: '1F3BE', desc: 'Tennis' },
        { code: '1F3D0', desc: 'Volleyball' },
        { code: '1F3C9', desc: 'Rugby football' },
        { code: '1F3B1', desc: 'Pool 8 ball' },
        { code: '1F3D3', desc: 'Ping pong' },
        { code: '1F3F8', desc: 'Badminton' },
        { code: '1F94A', desc: 'Boxing glove' },
        { code: '1F3CA', desc: 'Swimmer' },
        { code: '1F3CB', desc: 'Weightlifter' },
        { code: '1F6B4', desc: 'Bicyclist' },
        { code: '1F6F9', desc: 'Skateboard' },
        { code: '1F3AE', desc: 'Video game' },
        { code: '1F579', desc: 'Joystick' },
        { code: '1F3CF', desc: 'Cricket' },
        { code: '1F3C7', desc: 'Horse racing' },
        { code: '1F3AF', desc: 'Direct hit' },
        { code: '1F3D1', desc: 'Field hockey' },
        { code: '1F3B0', desc: 'Slot machine' },
        { code: '1F3B3', desc: 'Bowling' },
        { code: '1F3B2', desc: 'Game die' },
        { code: '265F', desc: 'Chess pawn' }]
    }, {
        name: 'Travel & Places', code: '1F30D', iconCss: 'e-travel-and-places', icons: [{ code: '2708', desc: 'Airplane' },
        { code: '1F697', desc: 'Automobile' },
        { code: '1F695', desc: 'Taxi' },
        { code: '1F6B2', desc: 'Bicycle' },
        { code: '1F68C', desc: 'Bus' },
        { code: '1F682', desc: 'Locomotive' },
        { code: '1F6F3', desc: 'Passenger ship' },
        { code: '1F680', desc: 'Rocket' },
        { code: '1F681', desc: 'Helicopter' },
        { code: '1F6A2', desc: 'Ship' },
        { code: '1F3DF', desc: 'Stadium' },
        { code: '1F54C', desc: 'Mosque' },
        { code: '26EA', desc: 'Church' },
        { code: '1F6D5', desc: 'Hindu Temple' },
        { code: '1F3D4', desc: 'Snow-capped mountain' },
        { code: '1F3EB', desc: 'School' },
        { code: '1F30B', desc: 'Volcano' },
        { code: '1F3D6', desc: 'Beach with umbrella' },
        { code: '1F3DD', desc: 'Desert island' },
        { code: '1F3DE', desc: 'National park' },
        { code: '1F3F0', desc: 'Castle' },
        { code: '1F5FC', desc: 'Tokyo tower' },
        { code: '1F5FD', desc: 'Statue of liberty' },
        { code: '26E9', desc: 'Shinto shrine' },
        { code: '1F3EF', desc: 'Japanese castle' },
        { code: '1F3A2', desc: 'Roller coaster' }]
    }, {
        name: 'Objects', code: '1F507', iconCss: 'e-objects', icons: [{ code: '1F4A1', desc: 'Light bulb' },
        { code: '1F526', desc: 'Flashlight' },
        { code: '1F4BB', desc: 'Laptop computer' },
        { code: '1F5A5', desc: 'Desktop computer' },
        { code: '1F5A8', desc: 'Printer' },
        { code: '1F4F7', desc: 'Camera' },
        { code: '1F4F8', desc: 'Camera with flash' },
        { code: '1F4FD', desc: 'Film projector' },
        { code: '1F3A5', desc: 'Movie camera' },
        { code: '1F4FA', desc: 'Television' },
        { code: '1F4FB', desc: 'Radio' },
        { code: '1F50B', desc: 'Battery' },
        { code: '231A', desc: 'Watch' },
        { code: '1F4F1', desc: 'Mobile phone' },
        { code: '260E', desc: 'Telephone' },
        { code: '1F4BE', desc: 'Floppy disk' },
        { code: '1F4BF', desc: 'Optical disk' },
        { code: '1F4C0', desc: 'Digital versatile disc' },
        { code: '1F4BD', desc: 'Computer disk' },
        { code: '1F3A7', desc: 'Headphone' },
        { code: '1F3A4', desc: 'Microphone' },
        { code: '1F3B6', desc: 'Multiple musical notes' },
        { code: '1F4DA', desc: 'Books' }]
    }, {
        name: 'Symbols', code: '1F3E7', iconCss: 'e-symbols', icons: [{ code: '274C', desc: 'Cross mark' },
        { code: '2714', desc: 'Check mark' },
        { code: '26A0', desc: 'Warning sign' },
        { code: '1F6AB', desc: 'Prohibited' },
        { code: '2139', desc: 'Information' },
        { code: '267B', desc: 'Recycling symbol' },
        { code: '1F6AD', desc: 'No smoking' },
        { code: '1F4F5', desc: 'No mobile phones' },
        { code: '1F6AF', desc: 'No littering' },
        { code: '1F6B3', desc: 'No bicycles' },
        { code: '1F6B7', desc: 'No pedestrians' },
        { code: '2795', desc: 'Plus' },
        { code: '2796', desc: 'Minus' },
        { code: '2797', desc: 'Divide' },
        { code: '2716', desc: 'Multiplication' },
        { code: '1F4B2', desc: 'Dollar banknote' },
        { code: '1F4AC', desc: 'Speech balloon' },
        { code: '2755', desc: 'White exclamation mark' },
        { code: '2754', desc: 'White question mark' },
        { code: '2764', desc: 'Red heart' }]
    }]
     *
     */
    iconsSet?: EmojiIconsSet[];

    /**
     * Enables or disables the search box in an emoji picker.
     *
     * @default true
     */
    showSearchBox?: boolean;

}

/**
 * Interface for a class PasteCleanupSettings
 */
export interface PasteCleanupSettingsModel {

    /**
     * Specifies whether to enable the prompt for paste in RichTextEditor.
     *
     * @default false
     */
    prompt?: boolean;

    /**
     * Specifies the attributes to restrict when pasting in RichTextEditor.
     *
     * @default null
     */
    deniedAttrs?: string[];

    /**
     * Specifies the allowed style properties when pasting in RichTextEditor.
     *
     * @default ['background', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-style', 'border-top', 'border-width', 'clear', 'color', 'cursor', 'direction', 'display', 'float', 'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'height', 'left', 'line-height', 'list-style-type', 'margin', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'max-height', 'max-width', 'min-height', 'min-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'position', 'right', 'table-layout', 'text-align', 'text-decoration', 'text-transform', 'text-indent', 'top', 'vertical-align', 'visibility', 'white-space', 'width']
     */
    allowedStyleProps?: string[];

    /**
     * Specifies the tags to restrict when pasting in RichTextEditor.
     *
     * @default null
     */
    deniedTags?: string[];

    /**
     * Specifies whether to keep or remove the format when pasting in RichTextEditor.
     *
     * @default true
     */
    keepFormat?: boolean;

    /**
     * Specifies whether to paste as plain text or not in RichTextEditor.
     *
     * @default false
     */
    plainText?: boolean;

}

/**
 * Interface for a class FontFamily
 */
export interface FontFamilyModel {

    /**
     * Specifies default font family selection
     *
     * @default 'null'
     */
    default?: string;

    /**
     * Specifies content width
     *
     * @default '72px'
     */
    width?: string;

    /**
     * Specifies default font family items
     *
     * @default fontFamily
     */
    items?: IDropDownItemModel[];

}

/**
 * Interface for a class FontSize
 */
export interface FontSizeModel {

    /**
     * Specifies default font size selection
     *
     * @default 'null'
     */
    default?: string;

    /**
     * Specifies content width
     *
     * @default '60px'
     */
    width?: string;

    /**
     * Specifies default font size items
     *
     * @default fontSize
     */
    items?: IDropDownItemModel[];

}

/**
 * Interface for a class Format
 */
export interface FormatModel {

    /**
     * Specifies default format
     *
     * @default 'null'
     */
    default?: string;

    /**
     * Specifies content width
     *
     * @default '65px'
     */
    width?: string;

    /**
     * Specifies default font size items
     *
     * @default formatItems
     */
    types?: IDropDownItemModel[];

}

/**
 * Interface for a class FontColor
 */
export interface FontColorModel {

    /**
     * Specifies default font color
     *
     * @default '#ff0000'
     */
    default?: string;

    /**
     * Specifies mode
     *
     * @default 'Palette'
     */
    mode?: ColorModeType;

    /**
     * Specifies columns
     *
     * @default 10
     */
    columns?: number;

    /**
     * Specifies color code customization
     *
     * @default fontColor
     */
    colorCode?: { [key: string]: string[] };

    /**
     * Specifies modeSwitcher button
     *
     * @default false
     */
    modeSwitcher?: boolean;

}

/**
 * Interface for a class BackgroundColor
 */
export interface BackgroundColorModel {

    /**
     * Specifies default font color
     *
     * @default '#ffff00'
     */
    default?: string;

    /**
     * Specifies mode
     *
     * @default 'Palette'
     */
    mode?: ColorModeType;

    /**
     * Specifies columns
     *
     * @default 10
     */
    columns?: number;

    /**
     * Specifies color code customization
     *
     * @default backgroundColor
     */
    colorCode?: { [key: string]: string[] };

    /**
     * Specifies a modeSwitcher button
     *
     * @default false
     */
    modeSwitcher?: boolean;

}

/**
 * Interface for a class NumberFormatList
 */
export interface NumberFormatListModel {

    /**
     * Specifies default numberFormatList items
     *
     * @default numberFormatList
     */
    types?: IListDropDownModel[];

}

/**
 * Interface for a class BulletFormatList
 */
export interface BulletFormatListModel {

    /**
     * Specifies default numberFormatList items
     *
     * @default bulletFormatList
     */
    types?: IListDropDownModel[];

}