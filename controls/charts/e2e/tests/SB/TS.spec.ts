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
        browser.load('/#/material/chart/line.html');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_0_Point_2_Symbol'));
            browser.actions().mouseMove(tooltip).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Line');
        }, 8000);
    });

    it('Spline type series', () => {
        browser.load('/#/material/chart/spline.html');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_1_Point_1_Symbol'));
            browser.actions().mouseMove(tooltip).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Spline');
        }, 8000);
    });
    it('Stepline type series', () => {
        browser.load('/#/material/chart/step-line.html');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_1_Point_2_Symbol'));
            browser.actions().mouseMove(tooltip).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_StepLine');
        }, 8000);
    });
    it('Dashed-line type series', () => {
        browser.load('/#/material/chart/dashed-line.html');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_0_Point_2_Symbol'));
            browser.actions().mouseMove(tooltip).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_dashed-line');
        }, 8000);
    });
    it('Spline-inversed type series', () => {
        browser.load('/#/material/chart/spline-inversed.html');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_0_Point_2_Symbol'));
            browser.actions().mouseMove(tooltip).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_spline-inversed');
        }, 8000);
    });
    it('Line-segments type series', () => {
        browser.load('/#/material/chart/line-segments.html');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_0_Segment_1'));
            browser.actions().mouseMove(tooltip).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_line-segments');
        }, 8000);
    });
    it('Line-Multicolor type series', () => {
        browser.load('/#/material/chart/line-multi-color.html');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_0_Point_143'));
            browser.actions().mouseMove(tooltip).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_line-multi-color');
        }, 8000);
    });
});
describe('Area Series ', () => {
    let legendClick: ElementFinder;
    it('Area series', () => {
        browser.load('/#/material/chart/area.html');
        browser.compareScreen(element(By.id('container')), 'chart/SB_Area');
        browser.wait(() => {
            legendClick=element(by.id('container_chart_legend_shape_0'));
            legendClick.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Area_legend_click');
        }, 8000);
    });

    it('Spline Area type series', () => {
        browser.load('/#/material/chart/spline-area.html');
        browser.compareScreen(element(By.id('container')), 'chart/SB_Spline_Area');
        browser.wait(() => {
            legendClick=element(by.id('container_chart_legend_shape_1'));
            legendClick.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Spline_Area_legend_click');
        }, 8000);
    });
    it('Step-Area type series', () => {
        browser.load('/#/material/chart/step-area.html');
        browser.compareScreen(element(By.id('container')), 'chart/SB_Step_Area');
        browser.wait(() => {
            legendClick=element(by.id('container_chart_legend_shape_1'));
            legendClick.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Step_Area_legend_click');
        }, 5000);
    });
    it('Range_Area type series', () => {
        browser.load('/#/material/chart/range-area.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_range-area');
        }, 5000);
    });
    it('Stacked-area type series', () => {
        browser.load('/#/material/chart/stacked-area.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_stacked-area');
        }, 5000);
    });
    it('Stacked-area-100.html type series', () => {
        browser.load('/#/material/chart/stacked-area-100.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_stacked-area-100');
        }, 5000);
    });
    it('Area-empty type series', () => {
        browser.load('/#/material/chart/area-empty.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_area-empty');
        }, 5000);
    });
    it('Area-segments type series', () => {
        browser.load('/#/material/chart/area-segments.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_area-segments');
        }, 5000);
    });

});
describe('Bar Series ', () => {
    let tool: ElementFinder;
    it('Column series', () => {
        browser.load('/#/material/chart/column.html');
        browser.wait(() => {
            tool = element(by.id('container_Series_1_Point_1'));
            browser.actions().mouseMove(tool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Column');
        }, 5000);
    });
    it('Rounded-column Area type series', () => {
        browser.load('/#/material/chart/rounded-column.html');
        browser.wait(() => {
            tool = element(by.id('container_Series_0_Point_2'));
            browser.actions().mouseMove(tool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_rounded-column');
        }, 5000);
    });
    it('Column-placement type series', () => {
        browser.load('/#/material/chart/column-placement.html');
        browser.wait(() => {
            tool = element(by.id('container_Series_2_Point_1'));
            browser.actions().mouseMove(tool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_column-placement');
        }, 5000);
    });
    it('Range-column type series', () => {
        browser.load('/#/material/chart/range-column.html');
        browser.wait(() => {
            tool = element(by.id('container_Series_1_Point_2'));
            browser.actions().mouseMove(tool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_range-column');
        }, 5000);
    });
    it('Range-bar type series', () => {
        browser.load('/#/material/chart/range-bar.html');
        browser.wait(() => {
            tool = element(by.id('container_Series_0_Point_2'));
            browser.actions().mouseMove(tool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_range-bar');
        }, 5000);
    });
    it('Bar type series', () => {
        browser.load('/#/material/chart/bar.html');
        browser.wait(() => {
            tool = element(by.id('container_Series_0_Point_1'));
            browser.actions().mouseMove(tool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_bar');
        }, 5000);
    });
    it('Stacked-column type series', () => {
        browser.load('/#/material/chart/stacked-column.html');
        browser.wait(() => {
            tool = element(by.id('container_Series_1_Point_1'));
            browser.actions().mouseMove(tool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_stacked_column');
        }, 5000);
    });
    it('Stacked-column-100 type series', () => {
        browser.load('/#/material/chart/stacked-column-100.html');
        browser.wait(() => {
            tool = element(by.id('container_Series_0_Point_1'));
            browser.actions().mouseMove(tool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_stacked-column-100');
        }, 5000);
    });
    it('Stacked-bar type series', () => {
        browser.load('/#/material/chart/stacked-bar.html');
        browser.wait(() => {
            tool = element(by.id('container_Series_1_Point_3'));
            browser.actions().mouseMove(tool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Stacked-bar');
        }, 5000);
    });
    it('Stacked-bar-100 type series', () => {
        browser.load('/#/material/chart/stacked-bar-100.html');
        browser.wait(() => {
            tool = element(by.id('container_Series_1_Point_3'));
            browser.actions().mouseMove(tool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_stacked-bar-100');
        }, 5000);
    });
    it('Negative Stack series', () => {
        browser.load('/#/material/chart/tornado.html');
        browser.wait(() => {
            tool = element(by.id('container_Series_1_Point_3'));
            browser.actions().mouseMove(tool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Negative_Stack');
        }, 5000);
    });
});
describe('Scatter & Bubble Series ', () => {
    let scatterTool: ElementFinder;
    it('Scatter series', () => {
        browser.load('/#/material/chart/scatter-plot.html');
        browser.wait(() => {
            scatterTool = element(by.id('container_Series_1_Point_88'));
            browser.actions().mouseMove(scatterTool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_scatter');
        }, 5000);
    });

    it('Bubble series', () => {
        browser.load('/#/material/chart/bubble.html');
        browser.wait(function() {
            scatterTool = element(by.id('container_Series_0_Point_14'));
            browser.actions().mouseMove(scatterTool).perform();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Bubble');
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
        browser.load('/#/material/chart/waterfall.html');
        browser.wait(() => {
            mean = element(by.id('container_Series_0_Point_3'));
            browser.actions().mouseMove(mean).perform(); 
            browser.compareScreen(element(By.id('container')), 'chart/SB_Waterfall');
        }, 5000);
    });
    it('Histogram series', () => {
        browser.load('/#/material/chart/histogram.html');
        browser.wait(() => {
            mean = element(by.id('container_Series_0_Point_1'));
            browser.actions().mouseMove(mean).perform(); 
            browser.compareScreen(element(By.id('container')), 'chart/SB_histogram');
        }, 5000);
    });
    it('Box-and-whisker type series', () => {
        browser.load('/#/material/chart/box-and-whisker.html');
        mean = element(by.id('container_Series_0_Point_4'));
        browser.actions().mouseMove(mean).perform(); 
        browser.wait(() => {
            box = element(by.id('mode'));
            box.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_box-and-whisker_Normal');
            box.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_box-and-whisker_Exclusive');
            box.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_box-and-whisker_Inclusive');
            mean = element(by.id('mean'));
            mean.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_box-and-whisker_mean_false');
            mean.click();
        }, 2000);
    });
    it('Error-bar type series', () => {
        browser.load('/#/material/chart/error-bar.html');
        browser.compareScreen(element(By.id('container')), 'chart/SB_error-Bar_fixed');
        browser.wait(() => {
            errormode = element(by.id('drawmode'));
            errormode.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_error-Bar_both_mode');
            errormode.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
           browser.compareScreen(element(By.id('container')), 'chart/SB_error-Bar_horizontal');
            errorBarType = element(by.id('selmode'));
            errorBarType.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_error-Bar_percentage');
            errorBarType.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_error-Bar_SD');
            errorBarType.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_error-Bar_SE');
            errorBarType.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_error-Bar_Custom');
            direction = element(by.id('direction'));
            direction.all(by.tagName('option'))
            .then((options: any) => {
                options[0].click();
            });
            browser.compareScreen(element(By.id('container')), 'chart/SB_error-Bar_Both_Direction');
            direction.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
            browser.compareScreen(element(By.id('container')), 'chart/SB_error-Bar_Minus');
            direction.all(by.tagName('option'))
            .then((options: any) => {
                options[2].click();
            });
            browser.compareScreen(element(By.id('container')), 'chart/SB_error-Bar_Plus');
        }, 7000);
    });
    it('Trend-lines type series', () => {
        browser.load('/#/material/chart/trend-lines.html');
        browser.wait(() => {
            trendType = element(by.id('trendLineType'));
            trendType.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_trend-line_Linear');
            trendType.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_trend-line_Exponential');
            trendType.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_trend-line_Power');
            trendType.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_trend-line_Log');
            trendType.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_trend-line_Polynomial');
            trendType.all(by.tagName('option'))
                .then((options: any) => {
                    options[5].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_trend-line_MovingAverage');
        }, 6000);
    });
    it('Combination-series type series', () => {
        browser.load('/#/material/chart/multi-series-chart.html');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_combination-series');
        }, 5000);
    });
    it('pareto series', () => {
        browser.load('/#/material/chart/pareto.html');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_pareto');
        }, 5000);
    });
});
describe('Financial ', () => {
    let load: ElementFinder;
    let tooltip: ElementFinder;
    it('Hilo series', () => {
        browser.load('/#/material/chart/hilo.html');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_0_Point_259'));
            browser.actions().mouseMove(tooltip).perform(); 
            browser.compareScreen(element(By.id('container')), 'chart/SB_hilo');
            browser.compareScreen(element(By.id('selector')), 'chart/SB_Selector');
        }, 5000);
    });
    it('Hilo-open-close series', () => {
        browser.load('/#/material/chart/hilo-open-close.html');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_0_Point_37'));
            browser.actions().mouseMove(tooltip).perform(); 
            browser.compareScreen(element(By.id('container')), 'chart/SB_Hilo-open-close');
            browser.compareScreen(element(By.id('selector')), 'chart/SB_Selector');
        }, 5000);
    });
    it('Candle series', () => {
        browser.load('/#/material/chart/candle-stick.html');
        browser.wait(() => {
            tooltip = element(by.id('container_Series_1_Point_52'));
            browser.actions().mouseMove(tooltip).perform(); 
            browser.compareScreen(element(By.id('container')), 'chart/SB_Candle');
        }, 5000);
    });
    it('Performance', () => {
        browser.load('/#/material/chart/chart-performance.html');
        browser.wait(() => {
            load = element(by.id('load'));
            load.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Performance');
        }, 8000);
    });
});

describe('Accumulation Chart', () => {
    let drill: ElementFinder;
    let emptypointmode: ElementFinder;
    let grouping: ElementFinder;
    let radius: ElementFinder;
    it('Pie', () => {
        browser.load('/#/material/chart/default-pie.html');
        browser.compareScreen(element(By.id('container')), 'chart/SB_default-pie');
        browser.wait(() => {
            drill = element(by.id('pieangle'));
            browser.actions().mouseDown(drill).perform();
            browser.actions().mouseMove(drill).perform();
            browser.actions().mouseUp(drill).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_default-pie_Angle');
            radius = element(by.id('pieradius'));
            browser.actions().mouseDown(radius).perform();
            browser.actions().mouseMove(radius).perform();
            browser.actions().mouseUp(radius).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_default-pie_Radius');
            radius = element(by.id('pieexploderadius'));
            browser.actions().mouseDown(radius).perform();
            browser.actions().mouseMove(radius).perform();
            browser.actions().mouseUp(radius).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_default-pie_explode_Radius');
            radius = element(by.id('pieexplodeindex'));
            browser.actions().mouseDown(radius).perform();
            browser.actions().mouseMove(radius).perform();
            browser.actions().mouseUp(radius).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_default-pie_explode_Index');
        }, 3000);
    });
    it('Doughnut', () => {
        browser.load('/#/material/chart/donut.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Doughnut');
        }, 5000);
    });
    it('Pyramid', () => {
        browser.load('/#/material/chart/pyramid.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_pyramid');
        }, 5000);
    });
    it('Funnel', () => {
        browser.load('/#/material/chart/funnel.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Funnel');
        }, 5000);
    });
    it('Default-doughnut', () => {
        browser.load('/#/material/chart/default-doughnut.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Default-doughnut');
        }, 5000);
    });
    it('Semi-pie', () => {
        browser.load('/#/material/chart/semi-pie.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Semi-pie');
        }, 5000);
    });
    it('Smart-labels', () => {
        browser.load('/#/material/chart/smart-labels.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Smart-labels');
        }, 5000);
    });
    it('Drill-down-pie', () => {
        browser.load('/#/material/chart/drill-down-pie.html');
        browser.wait(() => {
            drill = element(by.id('container_Series_0_Point_0'));
            drill.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_drill-down-pie');
        }, 5000);
    });
    it('Grouping', () => {
        browser.load('/#/material/chart/grouping.html');
        grouping = element(by.id('container_Series_0_Point_9'));
        grouping.click();
        browser.compareScreen(element(By.id('container')), 'chart/SB_Grouping_Slices');
        browser.wait(() => {
            grouping = element(by.id('mode'));
            grouping.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
               browser.compareScreen(element(By.id('container')), 'chart/SB_Grouping_Point');
               grouping.all(by.tagName('option'))
                   .then((options: any) => {
                       options[1].click();
                   });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Grouping_Value');
        }, 5000);
    });
    it('Pie-empty-point', () => {
        browser.load('/#/material/chart/pie-empty-point.html');
        browser.wait(() => {
            emptypointmode = element(by.id('emptypointmode'));
            emptypointmode.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_pie-empty-point_Drop');
            emptypointmode.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_pie-empty-point_Average');
            emptypointmode.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_pie-empty-point_Zero');
        }, 5000);
    });
});
describe('Polar & Radar', () => {
    let SelectSeriesType: ElementFinder;
    it('Polar-line', () => {
        browser.load('/#/material/chart/polar-line.html');
        browser.wait(() => {
            SelectSeriesType = element(by.id('SelectSeriesType'));
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Polar-line');
            SelectSeriesType = element(by.id('SelectSeriesType'));
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Radar-line');

        }, 5000);
    });
    it('Polar-spline', () => {
        browser.load('/#/material/chart/polar-spline.html');
        browser.wait(() => {
            SelectSeriesType = element(by.id('SelectSeriesType'));
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Polar-spline');
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Radar-spline');
        }, 5000);
    });
    it('Polar-area', () => {
        browser.load('/#/material/chart/polar-area.html');
        browser.wait(() => {
            SelectSeriesType = element(by.id('SelectSeriesType'));
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Polar-area');
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Radar-area');
        }, 5000);
    });
    it('Polar-stacking-area', () => {
        browser.load('/#/material/chart/polar-stacking-area.html');
        browser.wait(() => {
            SelectSeriesType = element(by.id('SelectSeriesType'));
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_polar-stacking-area');
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Radar-stacking-area');
        }, 5000);
    });
    it('polar-scatter', () => {
        browser.load('/#/material/chart/Polar-scatter.html');
        browser.wait(() => {
            SelectSeriesType = element(by.id('SelectSeriesType'));
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Polar-scatter');
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Radar-scatter');
        }, 5000);
    });
    it('polar-column', () => {
        browser.load('/#/material/chart/polar-column.html');
        browser.wait(() => {
            SelectSeriesType = element(by.id('SelectSeriesType'));
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Polar-column');
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Radar-column');
        }, 5000);
    });
    it('Polar-stacking-column', () => {
        browser.load('/#/material/chart/polar-stacking-column.html');
        browser.wait(() => {
            SelectSeriesType = element(by.id('SelectSeriesType'));
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Polar-stacking-column');
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Radar-stacking-column');
        }, 5000);
    });
    it('Polar-range-column', () => {
        browser.load('/#/material/chart/polar-range-column.html');
        browser.wait(() => {
            SelectSeriesType = element(by.id('SelectSeriesType'));
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_polar-range-column');
            SelectSeriesType.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Radar-range-column');
        }, 5000);
    });
});
describe('Data Binding', () => {
    it('Local-data', () => {
        browser.load('/#/material/chart/local-data.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_local-data');
        }, 5000);
    });

});
describe('Axis', () => {
    let point: ElementFinder;
    let strip: ElementFinder;
    let isIndex: ElementFinder;
    let axes: ElementFinder;
    it('Pie', () => {
        browser.load('/#/material/chart/numeric.html');
        browser.compareScreen(element(By.id('container')), 'chart/SB_Numeric');
        browser.wait(() => {
               point = element(by.id('container_chart_legend_shape_0'));
               point.click();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Numeric_legend_click');
        }, 3000);
    });
    it('Date-time', () => {
        browser.load('/#/material/chart/date-time.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Date-time');
               point = element(by.id('container_chart_legend_shape_0'));
               point.click();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Date-time_legend_click');
        }, 5000);
    });
    it('Date-time-category', () => {
        browser.load('/#/material/chart/date-time-category.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Date-time-category');
        }, 5000);
    });
    it('Category', () => {
        browser.load('/#/material/chart/category.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_category');
        }, 5000);
    });
    it('indexed-axis', () => {
        browser.load('/#/material/chart/indexed-axis.html');
        point = element(by.id('container_Series_0_Point_2'));
        browser.actions().mouseMove(point).perform();
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_indexed-axis');
            isIndex = element(by.id('isIndexed'));
            isIndex.click()
            browser.compareScreen(element(By.id('container')), 'chart/SB_indexed-axis_false');
        }, 2000);
    });
    it('logarithmic', () => {
        browser.load('/#/material/chart/logarithmic-scale.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Logarithmic');
        }, 5000);
    });
    it('Multiple-axes', () => {
        browser.load('/#/material/chart/multiple-axis.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Multiple-axes');
        }, 5000);
    });
    it('inversed', () => {
        browser.load('/#/material/chart/inversed.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Inversed');
        }, 5000);
    });
    it('Strip-line', () => {
        browser.load('/#/material/chart/strip-line.html');
        browser.wait(() => {
            strip = element(by.id('selmode'));
            strip.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Strip-line_Vertical');
            strip.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
               browser.compareScreen(element(By.id('container')), 'chart/SB_Strip-line_Horizontal');
               strip.all(by.tagName('option'))
               .then((options: any) => {
                   options[2].click();
               });
              browser.compareScreen(element(By.id('container')), 'chart/SB_Strip-line_Segment');
        }, 4000);
    });
    it('smart-axis-labels', () => {
        browser.load('/#/material/chart/smart-axis-labels.html');
        browser.wait(() => {
        strip = element(by.id('selmode'));
        strip.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
        browser.compareScreen(element(By.id('container')), 'chart/SB_Smart-axis-labels_Hide');
        strip.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
        browser.compareScreen(element(By.id('container')), 'chart/SB_Smart-axis-labels_Trim');
        strip.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
        browser.compareScreen(element(By.id('container')), 'chart/SB_Smart-axis-labels_Wrap');
        strip.all(by.tagName('option'))
                .then((options: any) => {
                    options[3].click();
                });
        browser.compareScreen(element(By.id('container')), 'chart/SB_Smart-axis-labels_Multi');
        strip.all(by.tagName('option'))
                .then((options: any) => {
                    options[4].click();
                });
        browser.compareScreen(element(By.id('container')), 'chart/SB_Smart-axis-labels_Rot45');
        strip.all(by.tagName('option'))
                .then((options: any) => {
                    options[5].click();
                });
        browser.compareScreen(element(By.id('container')), 'chart/SB_Smart-axis-labels_Rot90');
        point = element(by.id('Trim'));
        point.click();
        browser.actions().mouseMove(element(by.id('container0_AxisLabel_6'))).perform();
        browser.compareScreen(element(By.id('container')), 'chart/SB_Smart-axis-labels_Trim');
        }, 6000);
    });
    it('Multi-level-label', () => {
        browser.load('/#/material/chart/multi-level-label.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Multi-level-label');
        }, 5000);
    });
    it('Axes-crossing', () => {
        browser.load('/#/material/chart/axes-crossing.html');
        browser.wait(() => {
            axes = element(by.id('selectAxis'));
            axes.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            point = element(by.id('crossingValue'));
            point.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Axes-crossing');
            point = element(by.id('container_chart_legend_shape_0'));
            point.click();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Axes-crossing_legend_click');
        }, 5000);
    });
});
describe('Chart Customization', () => {
    let print: ElementFinder;
    let sort: ElementFinder;
    let empty: ElementFinder;
    it('Sorting', () => {
        browser.load('/#/material/chart/sorting.html');
        browser.wait(() => {
            sort = element(by.id('sortMode'));
            sort.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
               browser.compareScreen(element(By.id('container')), 'chart/SB_Sorting_X');
               sort.all(by.tagName('option'))
               .then((options: any) => {
                   options[2].click();
               });
              browser.compareScreen(element(By.id('container')), 'chart/SB_Sorting_Y');
        }, 2000);
    });
    it('Symbols', () => {
        browser.load('/#/material/chart/marker-chart.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Symbols');
        }, 5000);
    });
    it('Pie-annotation', () => {
        browser.load('/#/material/chart/pie-annotation.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Pie-annotation');
        }, 5000);
    });
    it('data-label-template', () => {
        browser.load('/#/material/chart/data-label-template.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Data-label-template');
               sort = element(by.id('container_chart_legend_shape_1'));
               sort.click();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Data-label-template_legend_click');
        }, 5000);
    });
    it('Empty-point', () => {
        browser.load('/#/material/chart/empty-point.html');
        browser.wait(() => {
            empty = element(by.id('emptypointmode'));
            empty.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Empty-point_Gap');
            empty.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Empty-point_Drop');
            empty.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Empty-point_Average');
            empty.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
               browser.compareScreen(element(By.id('container')), 'chart/SB_Empty-point_Zero');
        }, 6000);
    });
    it('Print', () => {
        browser.load('/#/material/chart/print.html');
        browser.wait(() => {
            //    print = element(by.id('togglebtn'));
            //    print.click();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Print');
        }, 5000);
    });
    it('Export', () => {
        browser.load('/#/material/chart/export.html');
        browser.wait(() => {
            //    print = element(by.id('togglebtn'));
            //    print.click();
               browser.compareScreen(element(By.id('container')), 'chart/SB_Export');
        }, 5000);
    });
});
describe('User Interaction', () => {
    let select: ElementFinder;
    let point1: ElementFinder;
    let mode: ElementFinder;
    it('selection', () => {
        browser.load('/#/material/chart/selection.html');
        browser.wait(() => {
            select = element(by.id('container_Series_1_Point_1'));
            select.click();
            mode = element(by.id('selmode'));
            mode.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Selection_Point');
            mode = element(by.id('selmode'));
            mode.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Selection_Series');
            mode = element(by.id('selmode'));
            mode.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            browser.compareScreen(element(By.id('container')), 'chart/SB_Selection_Cluster');
        }, 3000);
    });
    it('Range-selection', () => {
        browser.load('/#/material/chart/range-selection.html');
        browser.wait(() => {
            mode = element(by.id('selmode'));
            mode.all(by.tagName('option'))
                .then((options: any) => {
                    options[0].click();
                });
            point1 = element(by.id('container_Series_0_Point_7'));
            browser.actions().dragAndDrop(point1, element(by.id('container_Series_0_Point_35'))).perform();
            browser.actions().click(point1).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Range-selection_Dragxy');
            mode.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            point1 = element(by.id('container_Series_0_Point_7'));
            browser.actions().dragAndDrop(point1, element(by.id('container_Series_1_Point_37'))).perform();
            browser.actions().click(point1).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Range-selection_Dragx');
            mode.all(by.tagName('option'))
                .then((options: any) => {
                    options[2].click();
                });
            point1 = element(by.id('container_Series_1_Point_13'));
            browser.actions().dragAndDrop(point1, element(by.id('container_Series_1_Point_21'))).perform();
            browser.actions().click(point1).perform();
            browser.compareScreen(element(By.id('container')), 'chart/SB_Range-selection_Dragy');
        }, 6000);
    });
    it('cross-hair', () => {
        browser.load('/#/material/chart/cross-hair.html');
        browser.wait(() => {
            browser.actions().mouseMove(element(by.id('container_Series_0'))).perform().then(function () {
                browser.compareScreen(element(By.id('container')), 'chart/SB_Cross-hair');
            });
        }, 5000);
    });
    it('Trackball', () => {
        browser.load('/#/material/chart/trackball.html');
        browser.wait(() => {
            browser.actions().mouseMove(element(by.id('container_Series_1'))).perform().then(function () {
                browser.compareScreen(element(By.id('container')), 'chart/SB_trackball');
            });
        }, 5000);
    });
    it('zooming', () => {
        browser.load('/#/material/chart/zooming.html');
        browser.wait(() => {
            browser.compareScreen(element(By.id('container')), 'chart/SB_Zooming');
        }, 5000);
    });
});

describe('Technical Indicators', () => {
    it('Accumulation-distribution-indicator', () => {
        browser.load('/#/material/chart/accumulation-distribution-indicator.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_accumulation-distribution-indicator');
        }, 5000);
    });
    it('Average-true-range-indicator', () => {
        browser.load('/#/material/chart/average-true-range-indicator.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Average-true-range-indicator');
        }, 5000);
    });
    it('Bollinger', () => {
        browser.load('/#/material/chart/bollinger.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_bollinger');
        }, 5000);
    });
    it('Exponential-moving-average-indicator', () => {
        browser.load('/#/material/chart/exponential-moving-average-indicator.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_EMA');
        }, 5000);
    });
    it('Moving-average-convergence-divergence-indicator', () => {
        browser.load('/#/material/chart/moving-average-convergence-divergence-indicator.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Moving-average-convergence-divergence-indicator');
        }, 5000);
    });
    it('momentum', () => {
        browser.load('/#/material/chart/momentum.html');
        browser.wait(function() {
               browser.compareScreen(element(By.id('container')), 'chart/SB_momentum');
        }, 5000);
    });
    it('Relative-strength-index-indicator', () => {
        browser.load('/#/material/chart/relative-strength-index-indicator.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Relative-strength-index-indicator');
        }, 5000);
    });
    it('simple-moving-average-indicator', () => {
        browser.load('/#/material/chart/simple-moving-average-indicator.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_simple-moving-average-indicator');
        }, 5000);
    });
    it('stochastic', () => {
        browser.load('/#/material/chart/stochastic.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_stochastic');
        }, 5000);
    });
    it('triangular-moving-average-indicator', () => {
        browser.load('/#/material/chart/triangular-moving-average-indicator.html');
        browser.wait(() => {
               browser.compareScreen(element(By.id('container')), 'chart/SB_Triangular-moving-average-indicator');
        }, 5000);
    });
});