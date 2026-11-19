import { OpenXmlElement } from '../../core/xml/index';
/**
 * Serializable run inner content provided by an optional feature module.
 *
 * @public
 */
export interface FeatureRunLeaf {
    toOpenXml(): OpenXmlElement;
}
