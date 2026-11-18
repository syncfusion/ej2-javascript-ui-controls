import { TextCharacterFills } from '../text/character-fills';
import { EffectiveTextCharacterFills } from '../resolve/resolve-text-fills';
import { ColorValue } from '../theme/color-value';
import { ThemeColorTransform } from '../theme/theme-render-model';
import { ShapeStyleRefs } from '../shapes/fill-line-types';
import { DirectTransform } from '../resolve/read-xfrm';
import { TextBulletSnapshot, TextMasterStyleSnapshot, TextStyleLevelSnapshot } from '../../worker/text-style-inheritance';
/** Clone-safe theme font slots consumed by text layout. @private */
export interface LayoutFontCollection {
    readonly latin: string;
    readonly eastAsian: string;
    readonly complexScript: string;
    readonly supplementalFonts?: ReadonlyArray<{
        readonly script: string;
        readonly typeface: string;
    }>;
}
/** Clone-safe theme data consumed by text layout. @private */
export interface LayoutThemeSnapshot {
    readonly colors: Readonly<Partial<Record<string, ColorValue>>>;
    readonly colorMap: Readonly<Partial<Record<string, string>>>;
    readonly fonts?: {
        readonly major: LayoutFontCollection;
        readonly minor: LayoutFontCollection;
    };
}
/** Presentation-level layout context. @private */
export interface LayoutPresentationInfo {
    readonly slideWidthPt: number;
    readonly slideHeightPt: number;
    readonly theme?: LayoutThemeSnapshot;
}
/** Direct body properties required by the layout port. @private */
export interface LayoutTextBodyPropertiesSnapshot {
    /** Authored DrawingML preset text warp retained for renderer fallback reporting. */
    readonly presetTextWarp?: string;
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
/** Direct character formatting consumed by the layout port. @private */
export interface LayoutTextCharacterSnapshot {
    readonly characterFills?: TextCharacterFills;
    readonly effectiveCharacterFills?: EffectiveTextCharacterFills;
    readonly fontFamily?: string;
    readonly eastAsianFontFamily?: string;
    readonly complexScriptFontFamily?: string;
    /** Authored legacy symbol face from `a:sym`. */
    readonly symbolFontFamily?: string;
    readonly fontSizePt?: number;
    readonly bold?: boolean;
    readonly italic?: boolean;
    readonly underline?: string;
    readonly strike?: string;
    readonly caps?: string;
    readonly baselinePercent?: number;
    readonly characterSpacingPt?: number;
    readonly language?: string;
    readonly color?: LayoutTextColorSnapshot;
    readonly highlight?: LayoutTextColorSnapshot;
    readonly hyperlink?: {
        readonly relationshipId?: string;
        readonly target?: string;
        readonly tooltip?: string;
        readonly action?: string;
    };
}
/** Direct run snapshot consumed by layout. @private */
export interface LayoutTextRunSnapshot extends LayoutTextCharacterSnapshot {
    readonly kind?: 'run';
    readonly text: string;
}
/** Authored run, break, or field sequence. @private */
export declare type LayoutTextContentSnapshot = LayoutTextRunSnapshot | (LayoutTextCharacterSnapshot & {
    readonly kind: 'break';
    readonly text: '';
}) | (LayoutTextCharacterSnapshot & {
    readonly kind: 'field';
    readonly text: string;
    readonly fieldId?: string;
    readonly fieldType?: string;
});
/** Direct text colour and transforms. @private */
export interface LayoutTextColorSnapshot {
    readonly value: ColorValue;
    readonly transforms: ReadonlyArray<ThemeColorTransform>;
}
/** Direct paragraph snapshot consumed by layout. @private */
export interface LayoutTextParagraphSnapshot {
    readonly defaultCharacterFills?: TextCharacterFills;
    readonly effectiveEndCharacterFills?: EffectiveTextCharacterFills;
    readonly effectiveCharacterFills?: EffectiveTextCharacterFills;
    readonly level?: number;
    readonly alignment?: string;
    readonly leftMarginPt?: number;
    readonly indentPt?: number;
    readonly lineSpacing?: {
        readonly type: 'points' | 'percent';
        readonly value: number;
    };
    readonly spaceBefore?: {
        readonly type: 'points' | 'percent';
        readonly value: number;
    };
    readonly spaceAfter?: {
        readonly type: 'points' | 'percent';
        readonly value: number;
    };
    readonly defaultFontFamily?: string;
    readonly defaultEastAsianFontFamily?: string;
    readonly defaultComplexScriptFontFamily?: string;
    readonly defaultFontSizePt?: number;
    readonly defaultBold?: boolean;
    readonly defaultItalic?: boolean;
    readonly defaultCaps?: string;
    readonly defaultColor?: LayoutTextColorSnapshot;
    readonly tabs?: ReadonlyArray<{
        readonly positionPt: number;
        readonly alignment?: string;
    }>;
    readonly bullet?: TextBulletSnapshot;
    readonly rightToLeft?: boolean;
    readonly eastAsianLineBreak?: boolean;
    readonly latinLineBreak?: boolean;
    readonly hangingPunctuation?: boolean;
    readonly runs: ReadonlyArray<LayoutTextRunSnapshot>;
    readonly content?: ReadonlyArray<LayoutTextContentSnapshot>;
    readonly endParagraphProperties?: LayoutTextCharacterSnapshot;
}
/** Direct text body consumed by layout. @private */
export interface LayoutTextBodySnapshot {
    readonly properties: LayoutTextBodyPropertiesSnapshot;
    readonly listStyle?: ReadonlyArray<TextStyleLevelSnapshot>;
    readonly paragraphs: ReadonlyArray<LayoutTextParagraphSnapshot>;
}
/** Minimal shape surface required by placeholder and text resolution. @private */
export interface LayoutShapeSnapshot {
    readonly fontReferenceFills?: TextCharacterFills;
    readonly id: string;
    readonly name: string;
    readonly placeholder?: {
        readonly type?: string;
        readonly index?: string | number;
    };
    readonly styleRefs?: ShapeStyleRefs;
    readonly transform?: DirectTransform;
    readonly textBody?: LayoutTextBodySnapshot;
    readonly children?: ReadonlyArray<LayoutShapeSnapshot>;
}
/** Master, layout, and slide levels required by text inheritance. @private */
export interface LayoutShapeLevels {
    readonly master: ReadonlyArray<LayoutShapeSnapshot>;
    readonly layout: ReadonlyArray<LayoutShapeSnapshot>;
    readonly slide: ReadonlyArray<LayoutShapeSnapshot>;
    readonly masterTextStyles?: TextMasterStyleSnapshot;
    readonly presentationDefaultTextStyle?: ReadonlyArray<TextStyleLevelSnapshot>;
}
