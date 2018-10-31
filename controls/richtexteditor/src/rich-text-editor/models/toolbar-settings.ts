import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { ToolbarType, ActionOnScroll } from '../base/enum';
import { IToolbarItems, IDropDownItemModel, ColorModeType } from '../base/interface';
import { TableStyleItems } from '../models/items';

export const predefinedItems: string[] = ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments',
    'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', 'Undo', 'Redo'];

export const fontFamily: IDropDownItemModel[] = [
    { text: 'Segoe UI', value: 'Segoe UI', class: 'e-segoe-ui' },
    { text: 'Arial', value: 'Arial,Helvetica,sans-serif', class: 'e-arial' },
    { text: 'Georgia', value: 'Georgia,serif', class: 'e-georgia' },
    { text: 'Impact', value: 'Impact,Charcoal,sans-serif', class: 'e-impact' },
    { text: 'Tahoma', value: 'Tahoma,Geneva,sans-serif', class: 'e-tahoma' },
    { text: 'Times New Roman', value: 'Times New Roman,Times,serif', class: 'e-times-new-roman' },
    { text: 'Verdana', value: 'Verdana,Geneva,sans-serif', class: 'e-verdana' }
];

export const fontSize: IDropDownItemModel[] = [
    { text: '8 pt', value: '8pt' },
    { text: '10 pt', value: '10pt' },
    { text: '12 pt', value: '12pt' },
    { text: '14 pt', value: '14pt' },
    { text: '18 pt', value: '18pt' },
    { text: '24 pt', value: '24pt' },
    { text: '36 pt', value: '36pt' }
];

export const formatItems: IDropDownItemModel[] = [
    { text: 'Paragraph', value: 'P', class: 'e-paragraph' },
    { text: 'Code', value: 'Pre', class: 'e-code' },
    { text: 'Quotation', value: 'BlockQuote', class: 'e-quote' },
    { text: 'Heading 1', value: 'H1', class: 'e-h1' },
    { text: 'Heading 2', value: 'H2', class: 'e-h2' },
    { text: 'Heading 3', value: 'H3', class: 'e-h3' },
    { text: 'Heading 4', value: 'H4', class: 'e-h4' }
];

export const fontColor: { [key: string]: string[] } = {
    'Custom': [
        '', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#70ad47', '#ff0000',
        '#f2f2f2', '#808080', '#cfcdcd', '#d5dce4', '#d9e2f3', '#fbe4d5', '#ededed', '#fff2cc', '#e2efd9', '#ffcccc',
        '#d9d9d9', '#595959', '#aeaaaa', '#acb9ca', '#b4c6e7', '#f7caac', '#dbdbdb', '#ffe599', '#c5e0b3', '#ff8080',
        '#bfbfbf', '#404040', '#747070', '#8496b0', '#8eaadb', '#f4b083', '#c9c9c9', '#ffd966', '#a8d08d', '#ff3333',
        '#a6a6a6', '#262626', '#3b3838', '#323e4f', '#2f5496', '#c45911', '#7b7b7b', '#bf8f00', '#538135', '#b30000',
        '#7f7f7f', '#0d0d0d', '#161616', '#212934', '#1f3763', '#823b0b', '#525252', '#7f5f00', '#375623', '#660000']
};

export const backgroundColor: { [key: string]: string[] } = {
    'Custom': [
        '', '#000000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff0000', '#000080', '#800080', '#996633',
        '#f2f2f2', '#808080', '#ffffcc', '#b3ffb3', '#ccffff', '#ccccff', '#ffcccc', '#ccccff', '#ff80ff', '#f2e6d9',
        '#d9d9d9', '#595959', '#ffff80', '#80ff80', '#b3ffff', '#8080ff', '#ff8080', '#8080ff', '#ff00ff', '#dfbf9f',
        '#bfbfbf', '#404040', '#ffff33', '#33ff33', '#33ffff', '#3333ff', '#ff3333', '#0000b3', '#b300b3', '#c68c53',
        '#a6a6a6', '#262626', '#e6e600', '#00b300', '#009999', '#000099', '#b30000', '#000066', '#660066', '#86592d',
        '#7f7f7f', '#0d0d0d', '#999900', '#006600', '#006666', '#000066', '#660000', '#00004d', '#4d004d', '#734d26',
    ]
};

/**
 * Configures the toolbar settings of the RTE.
 */
export class ToolbarSettings extends ChildProperty<ToolbarSettings> {
    /**
     * Specifies whether to render toolbar in RTE.
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Specifies whether to enable/disable floating toolbar.
     * @default true
     */
    @Property(true)
    public enableFloating: boolean;

    /**
     * Specifies the Toolbar display types.
     * The possible types are:
     * - Expand: Toolbar items placed within the available space and rest of the items are placed to the extended menu section.
     * - MultiRow: Toolbar which placed at top of RTE editing area.
     * @default Expand
     */
    @Property(ToolbarType.Expand)
    public type: ToolbarType;

    /**
     * An array of string or object that is used to configure items.
     * @default predefinedItems
     */
    @Property(predefinedItems)
    public items: (string | IToolbarItems)[];
}

/**
 * Configures the image settings of the RTE.
 */

export class ImageSettings extends ChildProperty<ImageSettings> {
    /**
     * Specifies whether to allowType based file select
     * @default ['.jpeg', '.jpg', '.png']
     */
    @Property(['.jpeg', '.jpg', '.png'])
    public allowedTypes: string[];
    /**
     * Specifies whether insert image inline or break
     * @default 'inline'
     */
    @Property('inline')
    public display: string;
    /**
     * Specifies whether image width
     * @default 'auto'
     */
    @Property('auto')
    public width: string;
    /**
     * Specifies whether image height
     * @default 'auto'
     */
    @Property('auto')
    public height: string;
    /**
     * Specifies the URL of save action that will receive the upload files and save in the server.
     * @default 'null'
     */
    @Property(null)
    public saveUrl: string;
    /**
     * Specifies the URL of save action that will receive the upload files and save in the server.
     * @default 'null'
     */
    @Property(null)
    public path: string;
    /**
     * To enable resizing for image element.
     * @default 'true'
     */
    @Property(true)
    public resize: boolean;
    /**    
     * Defines the minimum Width of the image.
     * @default 0
     */
    @Property(0)
    public minWidth: string | number;
    /**
     * Defines the maximum Width of the image.
     * @default null
     */
    @Property(null)
    public maxWidth: string | number;
    /**    
     * Defines the minimum Height of the image.
     * @default 0
     */
    @Property(0)
    public minHeight: string | number;
    /**
     * Defines the maximum Height of the image.
     * @default null
     */
    @Property(null)
    public maxHeight: string | number;
    /**
     * image resizing should be done by percentage calculation.
     * @default false
     */
    @Property(false)
    public resizeByPercent: boolean;
}

export class TableSettings extends ChildProperty<TableSettings> {
    /**
     * To specify the width of table
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;
    /**
     * Class name should be appended by default in table element.
     * It helps to design the table in specific CSS styles always when inserting in editor.
     * @default TableStyleItems;
     */
    @Property(TableStyleItems)
    public styles: IDropDownItemModel[];
    /**
     * To enable resizing for table element.
     * @default 'true'
     */
    @Property(true)
    public resize: boolean;
    /**    
     * Defines the minimum Width of the table.
     * @default 0
     */
    @Property(0)
    public minWidth: string | number;
    /**
     * Defines the maximum Width of the table.
     * @default null
     */
    @Property(null)
    public maxWidth: string | number;
}
/**
 * Configures the quick toolbar settings of the RTE.
 */
export class QuickToolbarSettings extends ChildProperty<QuickToolbarSettings> {
    /**
     * Specifies whether to enable quick toolbar in RTE.
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * specifies the action that should happen when scroll the target-parent container.
     * @default 'hide'
     */
    @Property('hide')
    public actionOnScroll: ActionOnScroll;

    /**
     * Specifies the items to render in quick toolbar, when link selected.
     * @default ['Open', 'Edit', 'UnLink']
     */
    @Property(['Open', 'Edit', 'UnLink'])
    public link: (string | IToolbarItems)[];

    // tslint:disable
    /**
     * Specifies the items to render in quick toolbar, when image selected.
     * @default ['Replace', 'Align', 'Caption', 'Remove', '-', 'InsertLink','OpenImageLink', 'EditImageLink', 'RemoveImageLink', 'Display', 'AltText', 'Dimension']
     */
    // tslint:disable
    @Property(['Replace', 'Align', 'Caption', 'Remove', '-', 'InsertLink', 'OpenImageLink', 'EditImageLink', 'RemoveImageLink', 'Display', 'AltText', 'Dimension'])
    public image: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when text selected.
     * @default ['Cut', 'Copy', 'Paste']
     */
    @Property(['Cut', 'Copy', 'Paste'])
    public text: (string | IToolbarItems)[];

    /**
     * Specifies the items to render in quick toolbar, when table selected.
     * @default ['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles']
     */
    @Property(['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles'])
    public table: (string | IToolbarItems)[];
}

/**
 * Configures the font family settings of the RTE.
 */

export class FontFamily extends ChildProperty<FontFamily> {
    /**
     * Specifies default font family selection
     * @default 0
     */
    @Property('Segoe UI')
    public default: string;
    /**
     * Specifies content width
     * @default '65px'
     */
    @Property('65px')
    public width: string;
    /**
     * Specifies default font family items
     * @default fontFamily
     */
    @Property(fontFamily)
    public items: IDropDownItemModel[];
}

/**
 * Configures the font size settings of the RTE.
 */

export class FontSize extends ChildProperty<FontSize> {
    /**
     * Specifies default font size selection
     * @default 0
     */
    @Property('10 pt')
    public default: string;
    /**
     * Specifies content width
     * @default '35px'
     */
    @Property('35px')
    public width: string;
    /**
     * Specifies default font size items
     * @default fontSize
     */
    @Property(fontSize)
    public items: IDropDownItemModel[];
}

/**
 * Configures the format settings of the RTE.
 */

export class Format extends ChildProperty<Format> {
    /**
     * Specifies default format
     * @default 'Paragraph'
     */
    @Property('Paragraph')
    public default: string;
    /**
     * Specifies content width
     * @default '65px'
     */
    @Property('65px')
    public width: string;
    /**
     * Specifies default font size items
     * @default formatItems
     */
    @Property(formatItems)
    public types: IDropDownItemModel[];
}

/**
 * Configures the font Color settings of the RTE.
 */

export class FontColor extends ChildProperty<FontColor> {
    /**
     * Specifies default font color
     * @default '#ff0000'
     */
    @Property('#ff0000')
    public default: string;
    /**
     * Specifies mode
     * @default 'Palette'
     */
    @Property('Palette')
    public mode: ColorModeType;
    /**
     * Specifies columns
     * @default 10
     */
    @Property(10)
    public columns: number;
    /**
     * Specifies color code customization
     * @default fontColor
     */
    @Property(fontColor)
    public colorCode: { [key: string]: string[] };
    /**
     * Specifies modeSwitcher button
     * @default false
     */
    @Property(false)
    public modeSwitcher: boolean;
}

/**
 * Configures the background Color settings of the RTE.
 */

export class BackgroundColor extends ChildProperty<BackgroundColor> {
    /**
     * Specifies default font color
     * @default '#ffff00'
     */
    @Property('#ffff00')
    public default: string;
    /**
     * Specifies mode
     * @default 'Palette'
     */
    @Property('Palette')
    public mode: ColorModeType;
    /**
     * Specifies columns
     * @default 10
     */
    @Property(10)
    public columns: number;
    /**
     * Specifies color code customization
     * @default backgroundColor
     */
    @Property(backgroundColor)
    public colorCode: { [key: string]: string[] };
    /**
     * Specifies a modeSwitcher button
     * @default false
     */
    @Property(false)
    public modeSwitcher: boolean;
}