import { OpenXmlElement } from '../../core/xml/index';
/**
 * Serializable paragraph inline content provided by an optional feature module.
 *
 * @public
 */
export interface FeatureInline {
    toOpenXml(): OpenXmlElement;
    /**
     * @private
     * Release nested modeled content when the parent paragraph detaches. */
    releaseContent?(): void;
}
