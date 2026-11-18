import { FontDesignUnit, TextPoint } from './text-units';

/** One clone-safe text measurement request. @private */
export interface TextMeasureRequest {
    readonly id: string;
    readonly text: string;
    readonly family: string;
    readonly fontCandidates?: ReadonlyArray<string>;
    readonly sizePt: TextPoint;
    readonly bold: boolean;
    readonly italic: boolean;
    readonly letterSpacingPt?: TextPoint;
}

/** Width and line metrics returned by an injected measurer. @private */
export interface TextMeasureResult {
    readonly id: string;
    readonly family: string;
    readonly fontCandidates?: ReadonlyArray<string>;
    readonly widthPt: TextPoint;
    readonly actualAscentPt: TextPoint;
    readonly actualDescentPt: TextPoint;
    readonly ascentPt: TextPoint;
    readonly descentPt: TextPoint;
    readonly lineSpacingPt: TextPoint;
    readonly emHeightPt: TextPoint;
    readonly emHeightUnits: FontDesignUnit;
}

/** Optional future shaped-run result. Browser layout does not require it. @private */
export interface TextShapeResult {
    readonly text: string;
    readonly widthPt: TextPoint;
}

/** Browser-independent measurement boundary injected by the viewer. @private */
export interface TextMeasurer {
    readonly mode: 'worker' | 'main-thread';
    measure(requests: ReadonlyArray<TextMeasureRequest>): Promise<ReadonlyArray<TextMeasureResult>>;
    shape?(request: TextMeasureRequest): Promise<TextShapeResult>;
    close(): void;
}
