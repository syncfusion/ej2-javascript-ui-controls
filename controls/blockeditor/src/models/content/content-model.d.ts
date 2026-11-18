import { ContentType } from '../enums';
import { ContentProperties } from './content-props';
/**
 * Interface for a class Content
 */
export interface ContentModel {
    /**
     * Defines the type of content for the block.
     * It can be text, link, code, mention, or label.
     *
     * @isenumeration true
     * @default ContentType.Text
     * @asptype ContentType
     */
    contentType?: ContentType | string;
    /**
     * Specifies the actual content of the block.
     *
     * @default ''
     */
    content?: string;
    /**
     * Specifies the type specific properties for the content.
     *
     * @default null
     * @asptype object
     * @aspDefaultValueIgnore
     */
    properties?: ContentProperties;
}
