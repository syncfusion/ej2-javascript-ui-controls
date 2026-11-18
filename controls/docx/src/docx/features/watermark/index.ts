
export {
    PICTURE_WATERMARK_ID_PREFIX,
    PICTURE_WATERMARK_TYPE,
    PICTURE_WATERMARK_TYPE_DOUBLE_HASH,
    TEXT_WATERMARK_ID_PREFIX,
    TEXT_WATERMARK_TYPE,
    hasWatermarkPositionPattern,
    isAcceptedPictureWatermarkType,
    isVml,
    parseVmlStyle,
    vmlAttribute
} from './detect';
export * from './logical-store';
export * from './model';
export * from './parse';
export * from './serialize';
/**
 * Optional watermark feature module (text and picture).
 *
 * Public construction (TASK-8060), lazy header VML parse (TASK-8061), and
 * dirty header rewrite on save (TASK-8062). Logical state is held in a module
 * WeakMap so clean parse never mutates package parts.
 *
 * OOXML ownership: docs/ooxml-mapping/watermark.md. Requirement:
 * docs/requirements/watermark-basic.md. Spec: docs/specs/watermark-basic.md.
 *
 * @packageDocumentation
 */
import { WordDocument } from '../document/document';
import { OpcPackage } from '../../core/opc/index';
import { featureId, registerFeature, registerFeatureMaterializeHandler, registerFeaturePackagePartHandler } from '../../core/registry/index';
import { isPictureWatermarkShape, isTextWatermarkShape } from './detect';
import { clearLogicalWatermark, logicalWatermarkOf, setLogicalWatermark } from './logical-store';
import { ImageType, PictureWatermark, TextWatermark, Watermark, WatermarkLayout, WatermarkType, PictureWatermarkOptions, SemitransparentState, TextWatermarkOptions, WatermarkShapeResidual } from './model';
import { ensureParsedAndLogical, markWatermarkParseCompleted, resetWatermarkParseStateForTests } from './parse';
import { loadWatermarkPackageParts, markWatermarkDirty, materializeWatermarks, resetWatermarkSerializeStateForTests, WatermarkPackageParts } from './serialize';
import { MaterializableDocument } from '../../core/registry/materialize-handlers';
import { FeatureId } from '../../core/registry/feature-registry';
export {
    ImageType,
    PictureWatermark,
    TextWatermark,
    Watermark,
    WatermarkLayout,
    WatermarkType,
    isPictureWatermarkShape,
    isTextWatermarkShape,
    clearLogicalWatermark,
    logicalWatermarkOf
};
export { PictureWatermarkOptions, SemitransparentState, TextWatermarkOptions, WatermarkShapeResidual };
const WATERMARK: FeatureId = featureId('watermark');
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetWatermarkFeatureForTests(): void {
    registered = false;
    resetWatermarkParseStateForTests();
    resetWatermarkSerializeStateForTests();
}
/**
 * Register the watermark feature. Idempotent.
 *
 * Lazy header VML parse runs on first {@link WordDocument.watermark} get
 * (TASK-8061). Dirty assignment marks the document so save materializes
 * canonical watermark VML into scratch headers (TASK-8062). Remove/replace
 * strips recognized watermark leaves, GCs unused header image relationships
 * and unreferenced media, and never deletes header parts (TASK-8063). Picture
 * media is applied via a package-level feature part after header multi-part
 * writes.
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerWatermarkFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: WATERMARK });
    registerFeatureMaterializeHandler({
        featureId: WATERMARK,
        materialize(document: MaterializableDocument): void {
            materializeWatermarks(document as WordDocument);
        }
    });
    registerFeaturePackagePartHandler({
        featureId: WATERMARK,
        loadParts(pkg: OpcPackage): WatermarkPackageParts {
            return loadWatermarkPackageParts(pkg);
        }
    });
}
Object.defineProperty(WordDocument.prototype, 'watermark', {
    configurable: true,
    enumerable: false,
    get(this: WordDocument): Watermark | undefined {
        ensureParsedAndLogical(this, () => logicalWatermarkOf(this), (value: Watermark) => {
            setLogicalWatermark(this, value);
        });
        return logicalWatermarkOf(this);
    },
    set(this: WordDocument, value: Watermark | undefined): void {
        // Author assignment wins over a later lazy parse ensure.
        // Assigning `undefined` clears the logical watermark (replaces removeWatermark()).
        markWatermarkParseCompleted(this);
        if (value === undefined) {
            clearLogicalWatermark(this);
        }
        else {
            setLogicalWatermark(this, value);
        }
        markWatermarkDirty(this);
    }
});
registerWatermarkFeature();
