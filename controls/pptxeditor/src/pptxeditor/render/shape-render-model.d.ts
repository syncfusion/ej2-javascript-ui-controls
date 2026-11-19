import { ColorValue, DirectFill, DirectGeometry, DirectLine, DirectTransform, ConnectorEnds, GroupChildSpace, ShapeElementKind, ShapeStyleRefs, ShapeEffectSnapshot, ShapeType, PictureRenderSnapshot, FallbackFrameRenderSnapshot, TableRenderSnapshot, TextBulletSnapshot, TextMasterStyleSnapshot, TextStyleLevelSnapshot, ThemeColorTransform } from '@syncfusion/ej2-pptx';
/** Plain, clone-safe shape data retained by the worker/main-thread boundary.  @internal */
/**
 * @internal
 */
export interface SlideShapeSnapshot {
    readonly id: string;
    readonly name: string;
    readonly hidden: boolean;
    readonly elementKind: ShapeElementKind;
    /** Semantic content family resolved by the library; distinct from the OOXML element kind. */
    readonly contentKind: ShapeType;
    /** Whether this shape owns a direct text body. Text layout remains an S3 concern. */
    readonly hasTextBody: boolean;
    /** Direct placeholder identity used to match layout/master inheritance. */
    readonly placeholder?: TextPlaceholderSnapshot;
    /** Direct, clone-safe text body. Resolved values are built in the editor. */
    readonly textBody?: TextBodySnapshot;
    readonly groupChildSpace?: GroupChildSpace;
    /** Direct children in authored z-order; present for snapshots produced by the S2-d pipeline. */
    readonly children?: ReadonlyArray<SlideShapeSnapshot>;
    /** Direct connector attachments; absent on snapshots produced before S2-d. */
    readonly connectorEnds?: ConnectorEnds;
    readonly styleRefs?: ShapeStyleRefs;
    /** Direct shape effects. Theme effect references remain separate in `styleRefs`. */
    readonly effects?: ReadonlyArray<ShapeEffectSnapshot>;
    readonly transform?: DirectTransform;
    readonly geometry: DirectGeometry;
    readonly fill: DirectFill;
    readonly line: DirectLine;
    /** L7 picture-only render data. Absent for non-picture elements. */
    readonly picture?: PictureRenderSnapshot;
    /** L7A picture-fill render data for a non-picture shape. */
    readonly pictureFill?: PictureRenderSnapshot;
    /** L8 clone-safe table grid, cell style, merge, and text data. */
    readonly table?: TableRenderSnapshot;
    /** L9 metadata and optional file-owned preview for unsupported native content. */
    readonly fallbackFrame?: FallbackFrameRenderSnapshot;
}
/**
 * @internal
 */
export interface TextPlaceholderSnapshot {
    readonly type?: string;
    readonly index?: string | number;
}
/**
 * @internal
 */
export interface TextBodyPropertiesSnapshot {
    readonly leftInsetPt?: number;
    readonly topInsetPt?: number;
    readonly rightInsetPt?: number;
    readonly bottomInsetPt?: number;
    readonly anchor?: string;
    readonly wrap?: string;
    readonly columnCount?: number;
    readonly columnSpacingPt?: number;
    readonly verticalType?: string;
    readonly autoFit?: {
        readonly type: 'none' | 'normal' | 'shape';
        readonly fontScale?: number;
        readonly lineSpacingReduction?: number;
    };
}
/**
 * @internal
 */
export interface TextSpacingSnapshot {
    readonly type: 'points' | 'percent';
    readonly value: number;
}
/**
 * @internal
 */
export interface TextCharacterSnapshot {
    readonly fontFamily?: string;
    readonly eastAsianFontFamily?: string;
    readonly complexScriptFontFamily?: string;
    readonly fontSizePt?: number;
    readonly bold?: boolean;
    readonly italic?: boolean;
    readonly underline?: string;
    readonly strike?: string;
    readonly caps?: string;
    readonly baselinePercent?: number;
    readonly characterSpacingPt?: number;
    readonly language?: string;
    readonly color?: TextColorSnapshot;
    readonly highlight?: TextColorSnapshot;
    readonly hyperlink?: TextHyperlinkSnapshot;
}
/**
 * @internal
 */
export interface TextRunSnapshot extends TextCharacterSnapshot {
    readonly kind?: 'run';
    readonly text: string;
}
/**
 * @internal
 */
export interface TextColorSnapshot {
    readonly value: ColorValue;
    readonly transforms: ReadonlyArray<ThemeColorTransform>;
}
/**
 * @internal
 */
export interface TextHyperlinkSnapshot {
    readonly relationshipId?: string;
    readonly target?: string;
    readonly tooltip?: string;
    readonly action?: string;
}
/**
 * @internal
 */
export declare type TextContentSnapshot = TextRunSnapshot | (TextCharacterSnapshot & {
    readonly kind: 'break';
    readonly text: '';
}) | (TextCharacterSnapshot & {
    readonly kind: 'field';
    readonly text: string;
    readonly fieldId?: string;
    readonly fieldType?: string;
});
/**
 * @internal
 */
export interface TextParagraphSnapshot {
    readonly level?: number;
    readonly alignment?: string;
    readonly leftMarginPt?: number;
    readonly indentPt?: number;
    readonly lineSpacing?: TextSpacingSnapshot;
    readonly spaceBefore?: TextSpacingSnapshot;
    readonly spaceAfter?: TextSpacingSnapshot;
    readonly defaultFontFamily?: string;
    readonly defaultEastAsianFontFamily?: string;
    readonly defaultComplexScriptFontFamily?: string;
    readonly defaultFontSizePt?: number;
    readonly defaultBold?: boolean;
    readonly defaultItalic?: boolean;
    readonly defaultCaps?: string;
    /** Direct paragraph `a:defRPr` colour, kept separate from resolved runs. */
    readonly defaultColor?: TextColorSnapshot;
    readonly tabs?: ReadonlyArray<{
        readonly positionPt: number;
        readonly alignment?: string;
    }>;
    readonly bullet?: TextBulletSnapshot;
    readonly rightToLeft?: boolean;
    readonly eastAsianLineBreak?: boolean;
    readonly latinLineBreak?: boolean;
    readonly hangingPunctuation?: boolean;
    readonly runs: ReadonlyArray<TextRunSnapshot>;
    /** Authored `a:r` / `a:br` / `a:fld` sequence; absent on older snapshots. */
    readonly content?: ReadonlyArray<TextContentSnapshot>;
    /** Direct `a:endParaRPr`, retained separately for empty/trailing-break metrics. */
    readonly endParagraphProperties?: TextCharacterSnapshot;
}
/**
 * @internal
 */
export interface TextBodySnapshot {
    readonly properties: TextBodyPropertiesSnapshot;
    /** Direct `a:lstStyle` levels; resolution stays outside the parse model. */
    readonly listStyle?: ReadonlyArray<TextStyleLevelSnapshot>;
    readonly paragraphs: ReadonlyArray<TextParagraphSnapshot>;
}
/**
 * @internal
 */
export interface SlideShapeLevels {
    readonly master: ReadonlyArray<SlideShapeSnapshot>;
    readonly layout: ReadonlyArray<SlideShapeSnapshot>;
    readonly slide: ReadonlyArray<SlideShapeSnapshot>;
    /** Direct master `p:txStyles` buckets from the library Worker. */
    readonly masterTextStyles?: TextMasterStyleSnapshot;
    /** Direct presentation `p:defaultTextStyle` levels from the library Worker. */
    readonly presentationDefaultTextStyle?: ReadonlyArray<TextStyleLevelSnapshot>;
}
