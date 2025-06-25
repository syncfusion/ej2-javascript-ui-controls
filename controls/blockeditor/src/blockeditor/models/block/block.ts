import { ChildProperty, Property, Collection, Complex } from '@syncfusion/ej2-base';
import { BlockType } from '../../base/enums';
import { Content } from '../content/content';
import { BlockModel } from './block-model';
import { ContentModel } from '../content/index';
import { CodeSettings } from './code-settings';
import { ImageSettings } from './image-settings';
import { CodeSettingsModel, ImageSettingsModel } from './index';

/**
 * Defines the properties of block.
 */
export class Block extends ChildProperty<Block>{

    /**
     * Specifies the unique identifier for the block.
     * This property is used to uniquely identify each block.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies the unique identifier of the parent block.
     * This property is used to establish a hierarchical relationship between parent and child blocks.
     *
     * @default ''
     */
    @Property('')
    public parentId: string;

    /**
     * Specifies the type of the block, which can be a string or a predefined BlockType.
     * This property determines the type of content the block holds.
     *
     * @default 'Paragraph'
     */
    @Property('Paragraph')
    public type: string | BlockType;

    /**
     * Specifies placeholder text to display when the block is empty.
     * This property provides a hint to the user about what to write.
     *
     * @default ''
     */
    @Property('')
    public placeholder: string;

    /**
     * Specifies the content of the block, which can vary based on the block type.
     * This property holds the actual content of the block.
     *
     * @default []
     */
    @Collection<ContentModel>([], Content)
    public content: ContentModel[];

    /**
     * Specifies the indent for the block.
     * This property is used to specify indent for each block.
     *
     * @default 0
     */
    @Property(0)
    public indent: number;

    /**
     * Represents the child blocks of the current block.
     * This property contains an array of block models which are considered
     * as children of the current block, allowing for hierarchical structures.
     *
     * @default []
     */
    @Collection<BlockModel>([], Block)
    public children: BlockModel[];

    /**
     * Specifies whether the block is expanded or collapsed.
     * This property controls the visibility of child blocks within a hierarchical structure.
     *
     * @default false
     */
    @Property(false)
    public isExpanded: boolean;

    /**
     * Specifies the checked state for the block.
     * This property is applicable for blocks that support a checked state, such as checklist.
     *
     * @default false
     */
    @Property(false)
    public isChecked: boolean;

    /**
     * Specifies the CSS class applied to the block.
     * Allows custom styling by associating one or more CSS class names with the block.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the template content for the block.
     *
     * @default ''
     * @angularType string | object | HTMLElement
     * @reactType string | function | JSX.Element | HTMLElement
     * @vueType string | function | HTMLElement
     * @aspType string
     */
    @Property('')
    public template: string | HTMLElement | Function;

    /**
     * Specifies the code block configuration associated with this block.
     * This property defines settings such as language, code content, theme, and syntax highlighting preferences.
     *
     * @default {}
     */
    @Complex<CodeSettingsModel>({}, CodeSettings)
    public codeSettings: CodeSettingsModel;

    /**
     * Specifies the image block configuration associated with this block.
     * This property defines settings such as save format, upload URLs, size constraints, display mode, and read-only preferences.
     *
     * @default {}
     */
    @Complex<ImageSettingsModel>({}, ImageSettings)
    public imageSettings: ImageSettingsModel;

    /**
     * @param {Object} prop - Gets the property of block.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }

}
