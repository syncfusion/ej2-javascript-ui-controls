import { Chart, Logarithmic } from '@syncfusion/ej2-charts';
import { ChartComponent } from '@syncfusion/ej2-office-chart';
import { OfficeChartComponentFactory, OfficeChartComponentLike } from './office-chart-renderer';

let loaded: boolean = false;

/**
 * Returns a factory for ej2-office-chart converters and injects the ej2-charts modules it does not inject itself
 * but that PowerPoint charts need (logarithmic value axes).
 *
 * The packages are imported statically because the editor compiles to AMD/ES5, where dynamic `import()` is not
 * available; the chart code only runs when a slide contains a chart.
 * @returns {Promise<OfficeChartComponentFactory>} Factory creating one converter per chart.
 *
 * @internal
 */
export function loadOfficeChartFactory(): Promise<OfficeChartComponentFactory> {
    if (!loaded) {
        Chart.Inject(Logarithmic);
        loaded = true;
    }
    return Promise.resolve((): OfficeChartComponentLike => new ChartComponent() as unknown as OfficeChartComponentLike);
}
