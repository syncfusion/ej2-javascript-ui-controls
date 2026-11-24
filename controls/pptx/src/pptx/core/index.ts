/**
 * Core barrel for package-root re-exports (`core.ts` → `./src/pptx/core/index`).
 *
 * Mirrors the public surface re-exported from {@link ../index} core paths.
 *
 * @packageDocumentation
 */
export {
    AnimationTargetError,
    PresentationError,
    PresentationErrorCode
} from './errors';
export {
    DEFAULT_SECURITY_LIMITS,
    EncryptedPackageError,
    InvalidPackageError,
    InvalidPasswordError,
    PackageLimitError,
    resolveLimits,
    UnsupportedEncryptionError,
    XmlLimitError
} from './security/index';
export {
    SecurityErrorOptions,
    SecurityLimits
} from './security/index';
export {
    MarkupCompatibilityError,
    MarkupCompatibilityErrorCode
} from './xml/index';
export {
    Presentation,
    COMMENT_AUTHORS_CONTENT_TYPE,
    COMMENT_AUTHORS_REL_TYPE,
    COMMENTS_CONTENT_TYPE,
    COMMENTS_REL_TYPE,
    CONTENT_TYPES_PART_NAME,
    DIGITAL_SIGNATURE_CONTENT_TYPE,
    DIGITAL_SIGNATURE_ORIGIN_CONTENT_TYPE,
    DIGITAL_SIGNATURE_ORIGIN_PART_NAME,
    DIGITAL_SIGNATURE_ORIGIN_REL_TYPE,
    DIGITAL_SIGNATURE_REL_TYPE,
    IMAGE_GIF_CONTENT_TYPE,
    IMAGE_JPEG_CONTENT_TYPE,
    IMAGE_PNG_CONTENT_TYPE,
    IMAGE_REL_TYPE,
    NOTES_MASTER_CONTENT_TYPE,
    NOTES_MASTER_REL_TYPE,
    NOTES_SLIDE_CONTENT_TYPE,
    NOTES_SLIDE_REL_TYPE,
    OFFICE_DOCUMENT_REL_TYPE,
    PACKAGE_RELS_PART_NAME,
    PRESENTATION_MAIN_CONTENT_TYPES,
    SLIDE_CONTENT_TYPE,
    SLIDE_LAYOUT_CONTENT_TYPE,
    SLIDE_LAYOUT_REL_TYPE,
    SLIDE_MASTER_CONTENT_TYPE,
    SLIDE_MASTER_REL_TYPE,
    SLIDE_REL_TYPE,
    THEME_CONTENT_TYPE,
    THEME_REL_TYPE,
    VBA_PROJECT_CONTENT_TYPE,
    VBA_PROJECT_REL_TYPE,
    DEFAULT_SLIDE_LAYOUT_TYPE,
    SlideLayoutType,
    isSlideLayoutType,
    AddSlideOptions,
    CreatePresentationOptions,
    HostPartRelationshipAccess,
    OpenPresentationInput,
    OpenPresentationOptions,
    PackagePart,
    PackagePartAccess,
    PackageRelationship,
    RelationshipTargetMode,
    SlideCollection,
    SlideLayoutTypeValue
} from './package/index';
export {
    DEFAULT_PICTURE_NAME,
    DEFAULT_PICTURE_BOUNDS,
    PICTURE_INSERT_CONTENT_TYPES,
    Picture,
    AddPictureOptions,
    PictureBounds,
    PictureDataInput,
    ReplaceImageDataOptions
} from './pictures/index';
export {
    LayoutSlide,
    MasterSlide,
    Slide,
    OFFICE_REL_ATTR_NS,
    PML_NS,
    ShapeType,
    ST_SLIDE_ID_MAX_EXCLUSIVE,
    ST_SLIDE_ID_MIN
} from './presentation/index';
export {
    AutoShapeType,
    DML_NS,
    DEFAULT_AUTO_SHAPE_BOUNDS,
    DEFAULT_TEXT_BOX_BOUNDS,
    DEFAULT_TEXT_BOX_NAME,
    ST_DRAWING_ELEMENT_ID_MAX,
    Shape,
    ShapeNotFoundError,
    ShapeTextError,
    ShapeTreeCycleError,
    isAutoShapeType,
    ShapeCollection,
    AddShapeOptions,
    AddTextOptions,
    AddTextBoxOptions,
    AutoShapeTypeValue,
    BlipFill,
    ConnectorConnection,
    ConnectorEnds,
    CustomGeometry,
    DirectGeometry,
    DirectFill,
    DirectLine,
    DirectLineFill,
    DirectTransform,
    EmuPoint,
    EmuSize,
    GeometryKind,
    GeometryGuide,
    GradientFill,
    GroupChildSpace,
    GroupFill,
    LineEnd,
    LineJoin,
    MissingFill,
    NoFill,
    PatternFill,
    PresetGeometry,
    ResolvedDirectFill,
    ResolvedFill,
    ResolvedMissingFill,
    ResolvedStyleRefFill,
    ShapeElementKind,
    ShapeStyleRefs,
    SolidFill,
    StyleMatrixReference,
    ShapeBounds,
    TextBoxBounds
} from './shapes/index';
export {
    DEFAULT_PLACEHOLDER_IDX,
    DEFAULT_PLACEHOLDER_TYPE,
    PLACEHOLDER_TYPES,
    isPlaceholderType,
    PlaceholderInfo,
    PlaceholderMatch,
    PlaceholderType
} from './placeholders/index';
export {
    ResolvedTextStyle,
    ResolvedTransform,
    StyleInheritanceSource
} from './resolve/index';
export {
    COLOR_MAP_KEYS,
    COLOR_SCHEME_SLOTS,
    ColorMapping,
    ColorScheme,
    SCHEME_COLOR_VALS,
    ThemePart,
    effectiveColorMap,
    isColorMapKey,
    isColorSchemeIndex,
    resolveColor,
    resolveSchemeColor,
    ColorMapKey,
    ColorSchemeIndex,
    ColorValue,
    EffectiveColorContext,
    HslColorValue,
    PrstColorValue,
    ResolvedColor,
    ResolvedDirectColor,
    ResolvedSrgbColor,
    SchemeColorVal,
    SchemeColorValue,
    ScrgbColorValue,
    SrgbColorValue,
    SysColorValue,
    UnresolvedColor,
    UnresolvedColorReason
} from './theme/index';
export {
    TextBody,
    Paragraph,
    TextPart,
    Font,
    TextUnderlineType,
    TextStrikeType,
    TextCapsType,
    isTextUnderlineType,
    isTextStrikeType,
    isTextCapsType,
    HorizontalAlignmentType,
    isHorizontalAlignmentType,
    TextSpacingType,
    isTextSpacingType,
    TextFindMatch,
    TextSelection,
    TextUnderlineTypeValue,
    TextStrikeTypeValue,
    TextCapsTypeValue,
    HorizontalAlignmentTypeValue,
    TextSpacingTypeValue,
    TextSpacingValue,
    ParagraphCollection,
    TextPartCollection
} from './text/index';
export {
    ensureFeature,
    isFeatureRegistered,
    listRegisteredFeatures,
    registerFeature,
    FeatureId,
    FeatureModule
} from './registry/index';

export { GradientHostResult, GradientHostDiagnostic, GradientGroupOwner } from './resolve/gradient-hosts';
export { EffectiveGradientFill, EffectiveGradientShade, EffectiveGradientRectangle, EffectiveGradientStop,
    EffectiveGradientValue, GradientValueSource } from './resolve/gradient-resolution-types';
export { GradientColorResult, GradientColorFailure } from './layout/gradient-color-resolution';
export { AuthoredFillMatrixReference } from './theme/read-fill-reference';
export { GradientLexical } from './theme/gradient-values';
export { GradientReadDiagnostic } from './theme/gradient-types';

export { GradientFillOptions, GradientStopOptions, GradientShadeOptions, GradientRectangleOptions, GradientColorOperation } from './shapes/gradient-fill-options';
export { GradientFillError } from './shapes/write-gradient-fill';

export { GradientStopEditor, GradientEditableStop } from './shapes/gradient-stop-editor';

export { TextCharacterFills, TextFillSnapshot, TextLineFillSnapshot, TextUnderlineFillSnapshot, TextUnderlineLineSnapshot } from './text/character-fills';

export { EffectiveTextCharacterFills, EffectiveTextFill, EffectiveTextDecorationFill, TextFillInheritanceSource } from './resolve/resolve-text-fills';
export { TextFillTarget } from './resolve/text-fill-host';

export { TextGradientDecoration } from './shapes/mutate-decoration-fill';

export { GradientGeometryPatch, GradientShadePatch, GradientRectanglePatch } from './shapes/gradient-geometry';

export { GradientBackgroundCopy } from './presentation/gradient-background-copy';

export { TextLineStyleSnapshot } from './text/text-line-style';
