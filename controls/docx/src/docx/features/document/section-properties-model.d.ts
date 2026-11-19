import { OpenXmlElement } from '../../core/xml/index';
/**
 * Duck-typed body-final / paragraph section-break model from the optional sections
 * feature. Core stores the object without importing `PageSetup`.
 *
 * Internal serialization boundary only — never returned as the public type of
 * {@link Section.pageSetup}.
 *
 * @private
 */
export interface SectionPropertiesModel {
    toOpenXml(): OpenXmlElement;
}
