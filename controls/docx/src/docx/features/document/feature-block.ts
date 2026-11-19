import { OpenXmlElement } from '../../core/xml/index';
/**
 * Serializable body block provided by an optional feature module.
 *
 * Required on the public surface: feature body items and
 * {@link AltChunkAnchor} implement this type under `stripInternal`.
 *
 * @private
 */
export interface FeatureBlock {
    toOpenXml(): OpenXmlElement;
    /**
     * @private
     * Release nested modeled content when the parent body detaches the block. */
    releaseContent?(): void;
}
