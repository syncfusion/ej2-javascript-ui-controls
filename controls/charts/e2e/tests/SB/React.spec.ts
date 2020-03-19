/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';
import { protractor } from "protractor/built/ptor";
browser.basePath = 'http://localhost:3000';
let baseURL :String = 'http://localhost:3000';
describe('Line Series ', () => {
    let tooltip: ElementFinder;
    it('Line series', () => {
        browser.load('/#/material/chart/line');
        browser.wait(() => {
             tooltip = element(by.id('container_Series_0_Point_2_Symbol'));
            browser.actions().mouseMove(tooltip).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Line');
        }, 5000);
    });
   it('Spline type series', () => {
        browser.load('/#/material/chart/spline');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Spline');
        }, 5000);
    });
    it('Stepline type series', () => {
        browser.load('/#/material/chart/step-line');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_StepLine');
        }, 5000);
    });
    it('Dashed-line type series', () => {
        browser.load('/#/material/chart/dashed-line');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_dashed-line');
        }, 5000);
    });
    it('Spline-inversed type series', () => {
        browser.load('/#/material/chart/spline-inversed');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_spline-inversed');
        }, 5000);
    });
    it('Line-segments type series', () => {
        browser.load('/#/material/chart/line-segments');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_line-segments');
        }, 5000);
    });
    it('Line-Multicolor type series', () => {
        browser.load('/#/material/chart/line-multi-color');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_line-multi-color');
        }, 5000);
    });
});
describe('Area Series ', () => {
    it('Area series', () => {
        browser.load('/#/material/chart/area');
         browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Area');
        }, 5000);
    });

    it('Spline Area type series', () => {
        browser.load('/#/material/chart/spline-area');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Spline_Area');
        }, 5000);
    });
    it('Step-Area type series', () => {
        browser.load('/#/material/chart/step-area');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Step_Area');
        }, 5000);
    });
    it('Range_Area type series', () => {
        browser.load('/#/material/chart/range-area');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_range-area');
        }, 5000);
    });
    it('Stacked-area type series', () => {
        browser.load('/#/material/chart/stacked-area');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_stacked-area');
        }, 5000);
    });
    it('Stacked-area-100.html type series', () => {
        browser.load('/#/material/chart/stacked-area-100');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_stacked-area-100');
        }, 5000);
    });
    it('Area-empty type series', () => {
        browser.load('/#/material/chart/area-empty');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_area-empty');
        }, 5000);
    });
    it('Area-segments type series', () => {
        browser.load('/#/material/chart/area-segments');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_area-segments');
        }, 5000);
    });
});
describe('Bar Series ', () => {
    let tool: ElementFinder;
    it('Column series', () => {
        browser.load('/#/material/chart/column');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Column');
        }, 5000);
    });
    it('Rounded-column Area type series', () => {
        browser.load('/#/material/chart/rounded-column');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_rounded-column');
        }, 5000);
    });
    it('Column-placement type series', () => {
        browser.load('/#/material/chart/column-placement');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_column-placement');
        }, 5000);
    });
    it('Range-column type series', () => {
        browser.load('/#/material/chart/range-column');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_range-column');
        }, 5000);
    });
    it('Range-bar type series', () => {
        browser.load('/#/material/chart/range-bar');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_range-bar');
        }, 5000);
    });
    it('Bar type series', () => {
        browser.load('/#/material/chart/bar');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_bar');
        }, 5000);
    });
    it('Stacked-column type series', () => {
        browser.load('/#/material/chart/stacked-column');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_stacked_column');
        }, 5000);
    });
    it('Stacked-column-100 type series', () => {
        browser.load('/#/material/chart/stacked-column-100');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_stacked-column-100');
        }, 5000);
    });
    it('Stacked-bar type series', () => {
        browser.load('/#/material/chart/stacked-bar');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Stacked-bar');
        }, 5000);
    });
    it('Stacked-bar-100 type series', () => {
        browser.load('/#/material/chart/stacked-bar-100');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_stacked-bar-100');
        }, 5000);
    });
    it('Negative Stack series', () => {
        browser.load('/#/material/chart/tornado');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Negative_Stack');
        }, 5000);
    });
});
describe('Scatter & Bubble Series ', () => {
    let scatterTool: ElementFinder;
    it('Scatter series', () => {
        browser.load('/#/material/chart/scatter-plot');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_scatter');
        }, 5000);
    });

    it('Bubble series', () => {
        browser.load('/#/material/chart/bubble');
        browser.wait(function() {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Bubble');
        }, 5000);
    });
});
describe('Other Types ', () => {
    let errorBarType: ElementFinder;
    let errormode: ElementFinder;
    let mean: ElementFinder;
    let trendType: ElementFinder;
    let box: ElementFinder;
    let direction: ElementFinder;
    it('Waterfall series', () => {
        browser.load('/#/material/chart/waterfall');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Waterfall');
        }, 5000);
    });
    it('Histogram series', () => {
        browser.load('/#/material/chart/histogram');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_histogram');
        }, 5000);
    });
    it('Box-and-whisker type series', () => {
        browser.load('/#/material/chart/box-and-whisker');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_box-and-whisker');
        }, 5000);
    });
    it('Error-bar type series', () => {
        browser.load('/#/material/chart/error-bar');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_error-Bar');
        }, 5000);
    });
    it('Trend-lines type series', () => {
        browser.load('/#/material/chart/trend-lines');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_trend-line');
        }, 5000);
    });
    it('Combination-series type series', () => {
        browser.load('/#/material/chart/multi-series-chart');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_combination-series');
        }, 5000);
    });
    it('pareto series', () => {
        browser.load('/#/material/chart/pareto');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_pareto');
        }, 5000);
    });
});
describe('Financial ', () => {
    let load: ElementFinder;
    let tooltip: ElementFinder;
    it('Hilo series', () => {
        browser.load('/#/material/chart/hilo');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_hilo');
            browser.compareScreen(element(By.id('selector')), 'chart/SB_React_Selector');
        }, 5000);
    });
    it('Hilo-open-close series', () => {
        browser.load('/#/material/chart/hilo-open-close');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Hilo-open-close');
            browser.compareScreen(element(By.id('selector')), 'chart/SB_React_Selector');
        }, 5000);
    });
    it('Candle series', () => {
        browser.load('/#/material/chart/candle-stick');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Candle');
        }, 5000);
    });
    it('Performance', () => {
        browser.load('/#/material/chart/chart-performance');
        browser.wait(() => {
            load = element(by.id('load'));
            load.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Performance');
        }, 8000);
    });
});

describe('Accumulation Chart', () => {
    let drill: ElementFinder;
    let emptypointmode: ElementFinder;
    let grouping: ElementFinder;
    let radius: ElementFinder;
    it('Pie', () => {
        browser.load('/#/material/chart/default-pie');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_default-pie');
        }, 5000);
    });
    it('Doughnut', () => {
        browser.load('/#/material/chart/donut');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Doughnut');
        }, 5000);
    });
    it('Pyramid', () => {
        browser.load('/#/material/chart/pyramid');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_pyramid');
        }, 5000);
    });
    it('Funnel', () => {
        browser.load('/#/material/chart/funnel');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Funnel');
        }, 5000);
    });
    it('Default-doughnut', () => {
        browser.load('/#/material/chart/default-doughnut');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Default-doughnut');
        }, 5000);
    });
    it('Semi-pie', () => {
        browser.load('/#/material/chart/semi-pie');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Semi-pie');
        }, 5000);
    });
    it('Smart-labels', () => {
        browser.load('/#/material/chart/smart-labels');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Smart-labels');
        }, 5000);
    });
    it('Drill-down-pie', () => {
        browser.load('/#/material/chart/drill-down-pie.html');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_drill-down-pie');
        }, 5000);
    });
    it('Grouping', () => {
        browser.load('/#/material/chart/grouping');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Grouping_Value');
        }, 5000);
    });
    it('Pie-empty-point', () => {
        browser.load('/#/material/chart/pie-empty-point');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_pie-empty-point');
        }, 5000);
    });
});
describe('Polar & Radar', () => {
    let SelectSeriesType: ElementFinder;
    it('Polar-line', () => {
        browser.load('/#/material/chart/polar-line');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Polar-line');

        }, 5000);
    });
    it('Polar-spline', () => {
        browser.load('/#/material/chart/polar-spline');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Polar-spline');
        }, 5000);
    });
    it('Polar-area', () => {
        browser.load('/#/material/chart/polar-area');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Polar-area');
        }, 5000);
    });
    it('Polar-stacking-area', () => {
        browser.load('/#/material/chart/polar-stacking-area');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_polar-stacking-area');
        }, 5000);
    });
    it('polar-scatter', () => {
        browser.load('/#/material/chart/Polar-scatter');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Polar-scatter');
        }, 5000);
    });
    it('polar-column', () => {
        browser.load('/#/material/chart/polar-column');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Polar-column');
        }, 5000);
    });
    it('Polar-stacking-column', () => {
        browser.load('/#/material/chart/polar-stacking-column');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Polar-stacking-column');
        }, 5000);
    });
    it('Polar-range-column', () => {
        browser.load('/#/material/chart/polar-range-column');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_polar-range-column');
        }, 5000);
    });
});
describe('Data Binding', () => {
    it('Local-data', () => {
        browser.load('/#/material/chart/local-data');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_local-data');
        }, 5000);
    });

});
describe('Axis', () => {
    let point: ElementFinder;
    let strip: ElementFinder;
    let isIndex: ElementFinder;
    let axes: ElementFinder;
    it('Pie', () => {
        browser.load('/#/material/chart/numeric');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Numeric');
        }, 3000);
    });
    it('Date-time', () => {
        browser.load('/#/material/chart/date-time');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Date-time');
        }, 5000);
    });
    it('Date-time-category', () => {
        browser.load('/#/material/chart/date-time-category');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Date-time-category');
        }, 5000);
    });
    it('Category', () => {
        browser.load('/#/material/chart/category');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_category');
        }, 5000);
    });
    it('indexed-axis', () => {
        browser.load('/#/material/chart/indexed-axis');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_indexed-axis');
        }, 2000);
    });
    it('logarithmic', () => {
        browser.load('/#/material/chart/logarithmic-scale');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Logarithmic');
        }, 5000);
    });
    it('Multiple-axes', () => {
        browser.load('/#/material/chart/multiple-axis');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Multiple-axes');
        }, 5000);
    });
    it('inversed', () => {
        browser.load('/#/material/chart/inversed');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Inversed');
        }, 5000);
    });
    it('Strip-line', () => {
        browser.load('/#/material/chart/strip-line');
        browser.wait(() => {
              browser.compareScreen(element(By.id('container')), 'chart/SB_React_Strip-line');
        }, 4000);
    });
    it('smart-axis-labels', () => {
        browser.load('/#/material/chart/smart-axis-labels');
        browser.wait(() => {
        browser.compareScreen(element(By.id('container')), 'chart/SB_React_Smart-axis-labels');
        }, 6000);
    });
    it('Multi-level-label', () => {
        browser.load('/#/material/chart/multi-level-label');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Multi-level-label');
        }, 5000);
    });
    it('Axes-crossing', () => {
        browser.load('/#/material/chart/axes-crossing');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Axes-crossing');
        }, 5000);
    });
});
describe('Chart Customization', () => {
    let print: ElementFinder;
    let sort: ElementFinder;
    let empty: ElementFinder;
    it('Sorting', () => {
        browser.load('/#/material/chart/sorting');
        browser.wait(() => {
              browser.compareScreen(element(By.id('container')), 'chart/SB_React_Sorting');
        }, 2000);
    });
    it('Symbols', () => {
        browser.load('/#/material/chart/marker-chart');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Symbols');
        }, 5000);
    });
    it('Pie-annotation', () => {
        browser.load('/#/material/chart/pie-annotation');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Pie-annotation');
        }, 5000);
    });
    it('data-label-template', () => {
        browser.load('/#/material/chart/data-label-template');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Data-label-template');
        }, 5000);
    });
    it('Empty-point', () => {
        browser.load('/#/material/chart/empty-point');
        browser.wait(() => {
        browser.compareScreen(element(By.id('container')), 'chart/SB_React_Empty-point');
        }, 6000);
    });
    it('Print', () => {
        browser.load('/#/material/chart/print');
        browser.wait(() => {
            //    print = element(by.id('togglebtn'));
            //    print.click();
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Print');
        }, 5000);
    });
    it('Export', () => {
        browser.load('/#/material/chart/export');
        browser.wait(() => {
            //    print = element(by.id('togglebtn'));
            //    print.click();
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Export');
        }, 5000);
    });
});
describe('User Interaction', () => {
    let select: ElementFinder;
    let point1: ElementFinder;
    let mode: ElementFinder;
    it('selection', () => {
        browser.load('/#/material/chart/selection');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Selection');
        }, 3000);
    });
    it('Range-selection', () => {
        browser.load('/#/material/chart/range-selection');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Range-selection');
        }, 6000);
    });
    it('cross-hair', () => {
        browser.load('/#/material/chart/cross-hair');
        browser.wait(() => {
            browser.actions().mouseMove(element(by.id('container_Series_0'))).perform().then(function () {
                browser.compareScreen(element(By.id('container')), 'chart/SB_React_Cross-hair');
            });
        }, 5000);
    });
    it('Trackball', () => {
        browser.load('/#/material/chart/trackball');
        browser.wait(() => {
            browser.actions().mouseMove(element(by.id('container_Series_1'))).perform().then(function () {
                browser.compareScreen(element(By.id('container')), 'chart/SB_React_trackball');
            });
        }, 5000);
    });
    it('zooming', () => {
        browser.load('/#/material/chart/zooming');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_React_Zooming');
        }, 5000);
    });
});
describe('Technical Indicators', () => {
    it('Accumulation-distribution-indicator', () => {
        browser.load('/#/material/chart/accumulation-distribution-indicator');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_accumulation-distribution-indicator');
        }, 5000);
    });
    it('Average-true-range-indicator', () => {
        browser.load('/#/material/chart/average-true-range-indicator');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Average-true-range-indicator');
        }, 5000);
    });
    it('Bollinger', () => {
        browser.load('/#/material/chart/bollinger');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_bollinger');
        }, 5000);
    });
    it('Exponential-moving-average-indicator', () => {
        browser.load('/#/material/chart/exponential-moving-average-indicator');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_EMA');
        }, 5000);
    });
    it('Moving-average-convergence-divergence-indicator', () => {
        browser.load('/#/material/chart/moving-average-convergence-divergence-indicator.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Moving-average-convergence-divergence-indicator');
        }, 5000);
    });
    it('momentum', () => {
        browser.load('/#/material/chart/momentum');
        browser.wait(function() {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_momentum');
        }, 5000);
    });
    it('Relative-strength-index-indicator', () => {
        browser.load('/#/material/chart/relative-strength-index-indicator');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Relative-strength-index-indicator');
        }, 5000);
    });
    it('simple-moving-average-indicator', () => {
        browser.load('/#/material/chart/simple-moving-average-indicator');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_simple-moving-average-indicator');
        }, 5000);
    });
    it('stochastic', () => {
        browser.load('/#/material/chart/stochastic.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_stochastic');
        }, 5000);
    });
    it('triangular-moving-average-indicator', () => {
        browser.load('/#/material/chart/triangular-moving-average-indicator');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_React_Triangular-moving-average-indicator');
        }, 5000);
    });
});