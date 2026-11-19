/**
 * @internal
 */
export interface PresetPointExpression { readonly x: string; readonly y: string; }

/**
 * @internal
 */
export type PresetPathCommand =
  | { readonly type: 'move' | 'line' | 'quad' | 'cubic'; readonly points: ReadonlyArray<PresetPointExpression> }
  | { readonly type: 'arc'; readonly widthRadius: string; readonly heightRadius: string;
      readonly startAngle: string; readonly sweepAngle: string }
  | { readonly type: 'close' };

/**
 * @internal
 */
export interface PresetPathDefinition {
    readonly width?: string;
    readonly height?: string;
    readonly fill: string;
    readonly stroke: boolean;
    readonly commands: ReadonlyArray<PresetPathCommand>;
}

/**
 * @internal
 */
export interface PresetDefinition {
    readonly family: 'arrows' | 'stars' | 'banners' | 'callouts' | 'flowcharts' | 'math' | 'other';
    readonly defaults: Readonly<Record<string, number>>;
    readonly guides: ReadonlyArray<[string, string]>;
    readonly paths: ReadonlyArray<PresetPathDefinition>;
    readonly mirrorY?: boolean;
}

/**
 * @internal
 */
export type PresetDefinitionMap = Readonly<Record<string, PresetDefinition>>;
