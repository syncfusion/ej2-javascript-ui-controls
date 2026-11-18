export interface ShapeTextBounds {
    readonly leftPt: number;
    readonly topPt: number;
    readonly widthPt: number;
    readonly heightPt: number;
}

/**
 * ports `Shape.GetBoundsToLayoutShapeTextBody` for the Stage-1 preset rules
 * needed by the S3 corpus. The returned rectangle is relative to the shape.
 * @param {string} preset - preset
 * @param {number} widthPt - widthPt
 * @param {number} heightPt - heightPt
 * @param {Object} adjustments - adjustments
 * @returns {ShapeTextBounds|undefined} result
 */
export function resolvePresetTextBounds(
    preset: string,
    widthPt: number,
    heightPt: number,
    adjustments: Readonly<Record<string, number>> = {}
): ShapeTextBounds | undefined {
    // ports `Shape.GetBoundsToLayoutShapeTextBody(Explosion1)` and the fixed
    // `FormulaValues.ParseShapeFormula` guide ratios for `irregularSeal1`.
    if (preset === 'irregularSeal1') {
        return rectangle(widthPt * 4627 / 21600, heightPt * 6320 / 21600,
                         widthPt * 16702 / 21600, heightPt * 13937 / 21600);
    }
    // ports `Shape.GetBoundsToLayoutShapeTextBody(Pentagon)` and the Skia
    // FormulaValues guide sequence used by OOXML `homePlate`.
    if (preset === 'homePlate') {
        const shortestSide: number = Math.min(widthPt, heightPt);
        const maximum: number = shortestSide <= 0 ? 0 : 100000 * widthPt / shortestSide;
        const adjustment: number = Math.max(0, Math.min(maximum, nullishValue(adjustments.adj, () => 50000)));
        const x1: number = widthPt - shortestSide * adjustment / 100000;
        return rectangle(0, 0, (x1 + widthPt) / 2, heightPt);
    }
    // ports the fixed `il`, `it`, `ir`, and `ib` guides consumed by
    // `Shape.GetBoundsToLayoutShapeTextBody(CloudCallout)`.
    if (preset === 'cloudCallout') {
        return rectangle(widthPt * 2977 / 21600, heightPt * 3262 / 21600,
                         widthPt * 17087 / 21600, heightPt * 17337 / 21600);
    }
    // ports `Shape.GetBoundsToLayoutShapeTextBody(RightArrow)` and the Skia
    // FormulaValues guide sequence (a1/a2, x1/x2, y1/y2).
    if (preset === 'rightArrow') {
        const shortestSide: number = Math.min(widthPt, heightPt);
        if (shortestSide <= 0) {
            return { leftPt: 0, topPt: 0, widthPt, heightPt };
        }
        const maximumAdj2: number = 100000 * widthPt / shortestSide;
        const a1: number = Math.max(0, Math.min(100000, nullishValue(adjustments.adj1, () => 50000)));
        const a2: number = Math.max(0, Math.min(maximumAdj2, nullishValue(adjustments.adj2, () => 50000)));
        const dx1: number = shortestSide * a2 / 100000;
        const x1: number = widthPt - dx1;
        const dy1: number = heightPt * a1 / 200000;
        const y1: number = heightPt / 2 - dy1;
        const y2: number = heightPt / 2 + dy1;
        const dx2: number = heightPt / 2 === 0 ? 0 : y1 * dx1 / (heightPt / 2);
        const x2: number = x1 + dx2;
        return rectangle(0, y1, x2, y2);
    }
    // ports `FormulaValues.ParseShapeFormula(Oval)` and the Oval /
    // FlowChartConnector branch of `Shape.GetBoundsToLayoutShapeTextBody`.
    if (preset === 'ellipse' || preset === 'flowChartConnector' ||
    preset === 'flowChartSequentialAccessStorage') {
        const horizontalInset: number = widthPt * (1 - Math.SQRT1_2) / 2;
        const verticalInset: number = heightPt * (1 - Math.SQRT1_2) / 2;
        return rectangle(horizontalInset, verticalInset,
                         widthPt - horizontalInset, heightPt - verticalInset);
    }
    // ports the fixed guides used by `Shape.GetBoundsToLayoutShapeTextBody`
    // for the flowchart controls exercised by the assembled-slide proof.
    if (preset === 'flowChartTerminator') {
        return rectangle(widthPt * 1018 / 21600, heightPt * 3163 / 21600,
                         widthPt * 20582 / 21600, heightPt * 18437 / 21600);
    }
    if (preset === 'flowChartDecision') {
        // The Skia path constrains wrapping to the diamond's middle half but
        // retains the full shape height for vertical anchoring/overflow.
        return rectangle(widthPt / 4, 0, widthPt * 3 / 4, heightPt);
    }
    if (preset === 'flowChartDelay') {
        const verticalInset: number = heightPt * (1 - Math.SQRT1_2) / 2;
        return rectangle(0, verticalInset, widthPt * (1 + Math.SQRT1_2) / 2,
                         heightPt - verticalInset);
    }
    if (preset !== 'chevron') {
        return undefined;
    }
    const shortestSide: number = Math.min(widthPt, heightPt);
    if (shortestSide <= 0) {
        return { leftPt: 0, topPt: 0, widthPt, heightPt };
    }
    const maximum: number = 100000 * widthPt / shortestSide;
    const authored: number = nullishValue(adjustments.adj, () => 50000);
    const adjustment: number = Math.max(0, Math.min(maximum, authored));
    const x1: number = shortestSide * adjustment / 100000;
    const x2: number = widthPt - x1;
    const useInset: boolean = x2 - x1 !== 0;
    const leftPt: number = useInset ? x1 : 0;
    const rightPt: number = useInset ? x2 : widthPt;
    return { leftPt, topPt: 0, widthPt: Math.max(0, rightPt - leftPt), heightPt };
}

function rectangle(leftPt: number, topPt: number, rightPt: number, bottomPt: number): ShapeTextBounds {
    return {
        leftPt,
        topPt,
        widthPt: Math.max(0, rightPt - leftPt),
        heightPt: Math.max(0, bottomPt - topPt)
    };
}

/** Returns a value unless it is nullish.
 * @param {*} value - Preferred value.
 * @param {Function} fallback - Lazy fallback.
 * @returns {*} Preferred value or fallback.
 */
function nullishValue<T, U>(value: T | null | undefined, fallback: () => U): T | U {
    return value !== undefined && value !== null ? value : fallback();
}
