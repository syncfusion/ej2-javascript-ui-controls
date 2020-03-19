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
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Line');
        }, 5000);
    });
   it('Spline type series', () => {
        browser.load('/#/material/chart/spline');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_1_Point_1_Symbol'));
            browser.actions().mouseMove(tooltip).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Spline');
        }, 5000);
    });
    it('Stepline type series', () => {
        browser.load('/#/material/chart/step-line');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_1_Point_1_Symbol'));
            browser.actions().mouseMove(tooltip).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_StepLine');
        }, 5000);
    });
    it('Dashed-line type series', () => {
        browser.load('/#/material/chart/dashed-line');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_1_Point_1_Symbol'));
            browser.actions().mouseMove(tooltip).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_dashed-line');
        }, 5000);
    });
    it('Spline-inversed type series', () => {
        browser.load('/#/material/chart/spline-inversed');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_1_Point_1_Symbol'));
            browser.actions().mouseMove(tooltip).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_spline-inversed');
        }, 5000);
    });
    it('Line-segments type series', () => {
        browser.load('/#/material/chart/line-segments');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_1_Point_1_Symbol'));
            browser.actions().mouseMove(tooltip).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_line-segments');
        }, 5000);
    });
    it('Line-Multicolor type series', () => {
        browser.load('/#/material/chart/line-multi-color');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_1_Point_1_Symbol'));
            browser.actions().mouseMove(tooltip).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_line-multi-color');
        }, 5000);
    });
});
describe('Area Series ', () => {
    let legendClick: ElementFinder;
    it('Area series', () => {
        browser.load('/#/material/chart/area');
        browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Area');
         browser.wait(() => {
            legendClick=element(by.id('container_chart_legend_shape_0'));
            legendClick.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Area_legend_click');
        }, 5000);
    });

    it('Spline Area type series', () => {
        browser.load('/#/material/chart/spline-area');
        browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Spline_Area');
        browser.wait(() => {
            legendClick=element(by.id('container_chart_legend_shape_1'));
            legendClick.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Spline_Area_legend_click');
        }, 5000);
    });
    it('Step-Area type series', () => {
        browser.load('/#/material/chart/step-area');
        browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Step_Area');
        browser.wait(() => {
            legendClick=element(by.id('container_chart_legend_shape_1'));
            legendClick.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Step_Area_legend_click');
        }, 5000);
    });
    it('Range_Area type series', () => {
        browser.load('/#/material/chart/range-area');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_range-area');
        }, 5000);
    });
    it('Stacked-area type series', () => {
        browser.load('/#/material/chart/stacked-area');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_stacked-area');
        }, 5000);
    });
    it('Stacked-area-100.html type series', () => {
        browser.load('/#/material/chart/stacked-area-100');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_stacked-area-100');
        }, 5000);
    });
    it('Area-empty type series', () => {
        browser.load('/#/material/chart/area-empty');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_area-empty');
        }, 5000);
    });
    it('Area-segments type series', () => {
        browser.load('/#/material/chart/area-segments');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_area-segments');
        }, 5000);
    });
});
describe('Bar Series ', () => {
    let tool: ElementFinder;
    it('Column series', () => {
        browser.load('/#/material/chart/column');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Column');
        }, 5000);
    });
    it('Rounded-column Area type series', () => {
        browser.load('/#/material/chart/rounded-column');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_rounded-column');
        }, 5000);
    });
    it('Column-placement type series', () => {
        browser.load('/#/material/chart/column-placement');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_column-placement');
        }, 5000);
    });
    it('Range-column type series', () => {
        browser.load('/#/material/chart/range-column');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_range-column');
        }, 5000);
    });
    it('Range-bar type series', () => {
        browser.load('/#/material/chart/range-bar');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_range-bar');
        }, 5000);
    });
    it('Bar type series', () => {
        browser.load('/#/material/chart/bar');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_bar');
        }, 5000);
    });
    it('Stacked-column type series', () => {
        browser.load('/#/material/chart/stacked-column');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_stacked_column');
        }, 5000);
    });
    it('Stacked-column-100 type series', () => {
        browser.load('/#/material/chart/stacked-column-100');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_stacked-column-100');
        }, 5000);
    });
    it('Stacked-bar type series', () => {
        browser.load('/#/material/chart/stacked-bar');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Stacked-bar');
        }, 5000);
    });
    it('Stacked-bar-100 type series', () => {
        browser.load('/#/material/chart/stacked-bar-100');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_stacked-bar-100');
        }, 5000);
    });
    it('Negative Stack series', () => {
        browser.load('/#/material/chart/tornado');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Negative_Stack');
        }, 5000);
    });
});
describe('Scatter & Bubble Series ', () => {
    let scatterTool: ElementFinder;
    it('Scatter series', () => {
        browser.load('/#/material/chart/scatter-plot');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_scatter');
        }, 5000);
    });

    it('Bubble series', () => {
        browser.load('/#/material/chart/bubble');
        browser.wait(function() {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Bubble');
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
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Waterfall');
        }, 5000);
    });
    it('Histogram series', () => {
        browser.load('/#/material/chart/histogram');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_histogram');
        }, 5000);
    });
    it('Box-and-whisker type series', () => {
        browser.load('/#/material/chart/box-and-whisker');
        browser.actions().mouseMove(mean).perform(); 
            browser.wait(() => {
                box = element(by.id('selmode'));
                box.all(by.tagName('option'))
                    .then((options: any) => {
                        options[0].click();
                    });
                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_box-and-whisker_Normal');
                box.all(by.tagName('option'))
                    .then((options: any) => {
                        options[1].click();
                    });
                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_box-and-whisker_Exclusive');
                box.all(by.tagName('option'))
                    .then((options: any) => {
                        options[2].click();
                    });
                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_box-and-whisker_Inclusive');
                mean = element(by.id('mean'));
                mean.click();
                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_box-and-whisker_mean_false');
                mean.click();
        }, 5000);
    });
    it('Error-bar type series', () => {
        browser.load('/#/material/chart/error-bar');
        browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_error-Bar_fixed');
        browser.wait(() => {
            errormode = element(by.id('drawmode'));
            errormode.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_error-Bar_both_mode');
            errormode.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
           browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_error-Bar_horizontal');
            errorBarType = element(by.id('errorBarType'));
            errorBarType.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_error-Bar_percentage');
            errorBarType.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_error-Bar_SD');
            errorBarType.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_error-Bar_SE');
            errorBarType.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_error-Bar_Custom');
            direction = element(by.id('direction'));
            direction.all(by.tagName('option'))
            .then((options: any) => {
                options[0].click();
            });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_error-Bar_Both_Direction');
            direction.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_error-Bar_Minus');
            direction.all(by.tagName('option'))
            .then((options: any) => {
                options[2].click();
            });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_error-Bar_Plus');
        }, 7000);
    });
    it('Trend-lines type series', () => {
        browser.load('/#/material/chart/trend-lines');
        browser.wait(() => {
            trendType = element(by.id('trendLineType'));
            trendType.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_trend-line_Linear');
            trendType.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_trend-line_Exponential');
            trendType.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_trend-line_Power');
            trendType.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_trend-line_Log');
            trendType.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_trend-line_Polynomial');
            trendType.all(by.tagName('option'))
                .then((options: any) => {
                    options[5].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_trend-line_MovingAverage');
        }, 6000);
    });
    it('Combination-series type series', () => {
        browser.load('/#/material/chart/multi-series-chart');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_combination-series');
        }, 5000);
    });
    it('pareto series', () => {
        browser.load('/#/material/chart/pareto');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_pareto');
        }, 5000);
    });
});
describe('Financial ', () => {
    let load: ElementFinder;
    let tooltip: ElementFinder;
    it('Hilo series', () => {
        browser.load('/#/material/chart/hilo');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_hilo');
            browser.compareScreen(element(By.id('selector')), 'chart/SB_Angular_Selector');
        }, 5000);
    });
    it('Hilo-open-close series', () => {
        browser.load('/#/material/chart/hilo-open-close');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Hilo-open-close');
            browser.compareScreen(element(By.id('selector')), 'chart/SB_Angular_Selector');
        }, 5000);
    });
    it('Candle series', () => {
        browser.load('/#/material/chart/candle-stick');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Candle');
        }, 5000);
    });
    it('Performance', () => {
        browser.load('/#/material/chart/chart-performance');
        browser.wait(() => {
            load = element(by.id('load'));
            load.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Performance');
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
        browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_default-pie');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_default-pie_explode_Index');
        }, 3000);
    });
    it('Doughnut', () => {
        browser.load('/#/material/chart/donut');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Doughnut');
        }, 5000);
    });
    it('Pyramid', () => {
        browser.load('/#/material/chart/pyramid');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_pyramid');
        }, 5000);
    });
    it('Funnel', () => {
        browser.load('/#/material/chart/funnel');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Funnel');
        }, 5000);
    });
    it('Default-doughnut', () => {
        browser.load('/#/material/chart/default-doughnut');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Default-doughnut');
        }, 5000);
    });
    it('Semi-pie', () => {
        browser.load('/#/material/chart/semi-pie');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Semi-pie');
        }, 5000);
    });
    it('Smart-labels', () => {
        browser.load('/#/material/chart/smart-labels');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Smart-labels');
        }, 5000);
    });
    it('Drill-down-pie', () => {
        browser.load('/#/material/chart/drill-down-pie.html');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_drill-down-pie');
        }, 5000);
    });
    it('Grouping', () => {
        browser.load('/#/material/chart/grouping');
        browser.wait(() => {
            grouping = element(by.id('mode'));
            grouping.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Grouping_Point');
               grouping.all(by.tagName('option'))
                   .then((options: any) => {
                       options[1].click();
                   });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Grouping_Value');
        }, 5000);
    });
    it('Pie-empty-point', () => {
        browser.load('/#/material/chart/pie-empty-point');
        browser.wait(() => {
            emptypointmode = element(by.id('selectmode'));
            emptypointmode.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_pie-empty-point_Drop');
            emptypointmode.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_pie-empty-point_Average');
            emptypointmode.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_pie-empty-point_Zero');
        }, 5000);
    });
});
// describe('Polar & Radar', () => {
//     let SelectSeriesType: ElementFinder;
//     it('Polar-line', () => {
//         browser.load('/#/material/chart/polar-line');
//         browser.wait(() => {
//             browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Polar-line');

//         }, 5000);
//     });
//     it('Polar-spline', () => {
//         browser.load('/#/material/chart/polar-spline');
//         browser.wait(() => {
//             browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Polar-spline');
//         }, 5000);
//     });
//     it('Polar-area', () => {
//         browser.load('/#/material/chart/polar-area');
//         browser.wait(() => {
//             browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Polar-area');
//         }, 5000);
//     });
//     it('Polar-stacking-area', () => {
//         browser.load('/#/material/chart/polar-stacking-area');
//         browser.wait(() => {
//             browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_polar-stacking-area');
//         }, 5000);
//     });
//     it('polar-scatter', () => {
//         browser.load('/#/material/chart/Polar-scatter');
//         browser.wait(() => {
//             browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Polar-scatter');
//         }, 5000);
//     });
//     it('polar-column', () => {
//         browser.load('/#/material/chart/polar-column');
//         browser.wait(() => {
//             browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Polar-column');
//         }, 5000);
//     });
//     it('Polar-stacking-column', () => {
//         browser.load('/#/material/chart/polar-stacking-column');
//         browser.wait(() => {
//             browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Polar-stacking-column');
//         }, 5000);
//     });
//     it('Polar-range-column', () => {
//         browser.load('/#/material/chart/polar-range-column');
//         browser.wait(() => {
//             browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_polar-range-column');
//         }, 5000);
//     });
// });
// describe('Data Binding', () => {
//     it('Local-data', () => {
//         browser.load('/#/material/chart/local-data');
//         browser.wait(() => {
//                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_local-data');
//         }, 5000);
//     });

// });
// describe('Axis', () => {
//     let point: ElementFinder;
//     let strip: ElementFinder;
//     let isIndex: ElementFinder;
//     let axes: ElementFinder;
//     it('Numeric', () => {
//         browser.load('/#/material/chart/numeric');
//         browser.wait(() => {
//                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Numeric');
//         }, 3000);
//     });
//     it('Date-time', () => {
//         browser.load('/#/material/chart/date-time');
//         browser.wait(() => {
//                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Date-time');
//         }, 5000);
//     });
//     it('Date-time-category', () => {
//         browser.load('/#/material/chart/date-time-category');
//         browser.wait(() => {
//                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Date-time-category');
//         }, 5000);
//     });
//     it('Category', () => {
//         browser.load('/#/material/chart/category');
//         browser.wait(() => {
//                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_category');
//         }, 5000);
//     });
//     it('indexed-axis', () => {
//         browser.load('/#/material/chart/indexed-axis');
//         browser.wait(() => {
//             browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_indexed-axis');
//         }, 2000);
//     });
//     it('logarithmic', () => {
//         browser.load('/#/material/chart/logarithmic-scale');
//         browser.wait(() => {
//                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Logarithmic');
//         }, 5000);
//     });
//     it('Multiple-axes', () => {
//         browser.load('/#/material/chart/multiple-axis');
//         browser.wait(() => {
//                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Multiple-axes');
//         }, 5000);
//     });
//     it('inversed', () => {
//         browser.load('/#/material/chart/inversed');
//         browser.wait(() => {
//                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Inversed');
//         }, 5000);
//     });
//     it('Strip-line', () => {
//         browser.load('/#/material/chart/strip-line');
//         browser.wait(() => {
//             strip = element(by.id('selmode'));
//             strip.all(by.tagName('option'))
//                 .then((options: any) => {
//                     options[0].click();
//                 });
//             browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Strip-line_Vertical');
//             strip.all(by.tagName('option'))
//                 .then((options: any) => {
//                     options[1].click();
//                 });
//                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Strip-line_Horizontal');
//                strip.all(by.tagName('option'))
//                .then((options: any) => {
//                    options[2].click();
//                });
//               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Strip-line_Segment');
//         }, 4000);
//     });
//     it('smart-axis-labels', () => {
//         browser.load('/#/material/chart/smart-axis-labels.html');
//         browser.wait(() => {
//         strip = element(by.id('intersecttype'));
//         strip.all(by.tagName('option'))
//                 .then((options: any) => {
//                     options[0].click();
//                 });
//         browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Smart-axis-labels_Hide');
//         strip.all(by.tagName('option'))
//                 .then((options: any) => {
//                     options[1].click();
//                 });
//         browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Smart-axis-labels_Trim');
//         strip.all(by.tagName('option'))
//                 .then((options: any) => {
//                     options[2].click();
//                 });
//         browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Smart-axis-labels_Wrap');
//         strip.all(by.tagName('option'))
//                 .then((options: any) => {
//                     options[3].click();
//                 });
//         browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Smart-axis-labels_Multi');
//         strip.all(by.tagName('option'))
//                 .then((options: any) => {
//                     options[4].click();
//                 });
//         browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Smart-axis-labels_Rot45');
//         strip.all(by.tagName('option'))
//                 .then((options: any) => {
//                     options[5].click();
//                 });
//         browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Smart-axis-labels_Rot90');
//         }, 6000);
//     });
//     it('Multi-level-label', () => {
//         browser.load('/#/material/chart/multi-level-label');
//         browser.wait(() => {
//                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Multi-level-label');
//         }, 5000);
//     });
//     it('Axes-crossing', () => {
//         browser.load('/#/material/chart/axes-crossing');
//         browser.wait(() => {
//             browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Axes-crossing');
//         }, 5000);
//     });
// });
describe('Chart Customization', () => {
    let print: ElementFinder;
    let sort: ElementFinder;
    let empty: ElementFinder;
    it('Sorting', () => {
        browser.load('/#/material/chart/sorting');
        browser.wait(() => {
              browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Sorting');
        }, 2000);
    });
    it('Symbols', () => {
        browser.load('/#/material/chart/marker-chart');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Symbols');
        }, 5000);
    });
    it('Pie-annotation', () => {
        browser.load('/#/material/chart/pie-annotation');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Pie-annotation');
        }, 5000);
    });
    it('data-label-template', () => {
        browser.load('/#/material/chart/data-label-template');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Data-label-template');
        }, 5000);
    });
    it('Empty-point', () => {
        browser.load('/#/material/chart/empty-point');
        browser.wait(() => {
            empty = element(by.id('emptyPointMode'));
            empty.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Empty-point_Gap');
            empty.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Empty-point_Drop');
            empty.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Empty-point_Average');
            empty.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Empty-point_Zero');
        }, 6000);
    });
    it('Print', () => {
        browser.load('/#/material/chart/print');
        browser.wait(() => {
            //    print = element(by.id('togglebtn'));
            //    print.click();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Print');
        }, 5000);
    });
    it('Export', () => {
        browser.load('/#/material/chart/export');
        browser.wait(() => {
            //    print = element(by.id('togglebtn'));
            //    print.click();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Export');
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
            select = element(by.id('container_Series_1_Point_1'));
            select.click();
            mode = element(by.id('selmode'));
            mode.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Selection_Point');
            mode = element(by.id('selmode'));
            mode.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Selection_Series');
            mode = element(by.id('selmode'));
            mode.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Selection_Cluster');
        }, 6000);
    });
    it('Range-selection', () => {
        browser.load('/#/material/chart/range-selection');
        browser.wait(() => {
            mode = element(by.id('selmode'));
            mode.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            point1 = element(by.id('container_Series_0_Point_7'));
            browser.actions().dragAndDrop(point1, element(by.id('container_Series_0_Point_35'))).perform();
            browser.actions().click(point1).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Range-selection_Dragxy');
            mode.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            point1 = element(by.id('container_Series_0_Point_7'));
            browser.actions().dragAndDrop(point1, element(by.id('container_Series_1_Point_37'))).perform();
            browser.actions().click(point1).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Range-selection_Dragx');
            mode.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            point1 = element(by.id('container_Series_1_Point_13'));
            browser.actions().dragAndDrop(point1, element(by.id('container_Series_1_Point_21'))).perform();
            browser.actions().click(point1).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Range-selection_Dragy');
        }, 5000);
    });
    it('cross-hair', () => {
        browser.load('/#/material/chart/cross-hair');
        browser.wait(() => {
            browser.actions().mouseMove(element(by.id('container_Series_0'))).perform().then(function () {
                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Cross-hair');
            });
        }, 5000);
    });
    it('Trackball', () => {
        browser.load('/#/material/chart/trackball');
        browser.wait(() => {
            browser.actions().mouseMove(element(by.id('container_Series_1'))).perform().then(function () {
                browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_trackball');
            });
        }, 5000);
    });
    it('zooming', () => {
        browser.load('/#/material/chart/zooming');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Zooming');
        }, 5000);
    });
});
describe('Technical Indicators', () => {
    it('Accumulation-distribution-indicator', () => {
        browser.load('/#/material/chart/accumulation-distribution-indicator');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_accumulation-distribution-indicator');
        }, 5000);
    });
    it('Average-true-range-indicator', () => {
        browser.load('/#/material/chart/average-true-range-indicator');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Average-true-range-indicator');
        }, 5000);
    });
    it('Bollinger', () => {
        browser.load('/#/material/chart/bollinger');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_bollinger');
        }, 5000);
    });
    it('Exponential-moving-average-indicator', () => {
        browser.load('/#/material/chart/exponential-moving-average-indicator');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_EMA');
        }, 5000);
    });
    it('Moving-average-convergence-divergence-indicator', () => {
        browser.load('/#/material/chart/moving-average-convergence-divergence-indicator.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Moving-average-convergence-divergence-indicator');
        }, 5000);
    });
    it('momentum', () => {
        browser.load('/#/material/chart/momentum');
        browser.wait(function() {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_momentum');
        }, 5000);
    });
    it('Relative-strength-index-indicator', () => {
        browser.load('/#/material/chart/relative-strength-index-indicator');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Relative-strength-index-indicator');
        }, 5000);
    });
    it('simple-moving-average-indicator', () => {
        browser.load('/#/material/chart/simple-moving-average-indicator');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_simple-moving-average-indicator');
        }, 5000);
    });
    it('stochastic', () => {
        browser.load('/#/material/chart/stochastic.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_stochastic');
        }, 5000);
    });
    it('triangular-moving-average-indicator', () => {
        browser.load('/#/material/chart/triangular-moving-average-indicator');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Angular_Triangular-moving-average-indicator');
        }, 5000);
    });
});