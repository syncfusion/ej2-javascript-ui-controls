import { ChildProperty, Property, Collection } from '@syncfusion/ej2-base';
import { BlockType } from '../../base/enums';
import { Content } from '../content/content';
import { ContentModel } from '../content/index';
import { BlockProperties } from './block-props';

/**
 * Defines the properties of block.
 */
export class Block extends ChildProperty<Block> {

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
     * @isenumeration true
     * @default BlockType.Paragraph
     * @asptype BlockType
     */
    @Property(BlockType.Paragraph)
    public type: BlockType | string;

    /**
     * Specifies the indent for the block.
     * This property is used to specify indentation for each block.
     *
     * @default 0
     * @aspType int
     */
    @Property(0)
    public indent: number;

    /**
     * Specifies the content of the block, which can vary based on the block type.
     * This property holds the actual content of the block.
     *
     * @default []
     */
    @Collection<ContentModel>([], Content)
    public content: ContentModel[];

    /**
     * Specifies the type specific properties for the block.
     *
     * @default null
     * @asptype object
     */
    @Property(null)
    public props: BlockProperties | object;

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
     * @param {Object} prop - Gets the property of block.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }

}
