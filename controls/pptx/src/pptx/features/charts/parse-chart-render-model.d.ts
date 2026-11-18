import { ChartRenderModel } from './chart-render-model';
/**
 * Parses chart part XML into a render model.
 *
 * @public
 * @param {string} xml - UTF-8 decoded `c:chartSpace` part.
 * @returns {ChartRenderModel | undefined} Model, or `undefined` when `xml` is not a chartSpace.
 */
export declare function parseChartRenderModel(xml: string): ChartRenderModel | undefined;
