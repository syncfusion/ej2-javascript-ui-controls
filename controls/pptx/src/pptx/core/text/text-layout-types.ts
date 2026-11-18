/** Direct `a:bodyPr` vertical anchoring token. */
export type TextVerticalAnchor = 't' | 'ctr' | 'b' | 'just' | 'dist';

/** Direct `a:bodyPr` wrapping token. */
export type TextWrapping = 'none' | 'square';

/** Direct DrawingML text-flow token. */
export type TextVerticalType = 'horz' | 'vert' | 'vert270' | 'wordArtVert' |
'eaVert' | 'mongolianVert' | 'wordArtVertRtl';

/** Direct autofit choice under `a:bodyPr`. */
export interface TextAutoFit {
    readonly type: 'none' | 'normal' | 'shape';
    /** Direct `fontScale` as a percentage; normal autofit only. */
    readonly fontScale?: number;
    /** Direct `lnSpcReduction` as a percentage; normal autofit only. */
    readonly lineSpacingReduction?: number;
}

/** Direct, unresolved text-body layout values. */
export interface TextBodyProperties {
    readonly leftInset?: number;
    readonly topInset?: number;
    readonly rightInset?: number;
    readonly bottomInset?: number;
    readonly anchor?: TextVerticalAnchor;
    readonly wrap?: TextWrapping;
    readonly columnCount?: number;
    readonly columnSpacing?: number;
    readonly verticalType?: TextVerticalType;
    readonly autoFit?: TextAutoFit;
}

/** One direct paragraph tab stop. */
export interface TextTabStop {
    readonly position: number;
    readonly alignment?: 'l' | 'ctr' | 'r' | 'dec';
}
