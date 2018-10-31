/**
 * spec
 */
import { browser, element, By, ElementFinder, by } from '@syncfusion/ej2-base/e2e/index';

describe('Polar and Radar', () => {
    let seriesDrawType: ElementFinder;
   it('checking with default polar series', () => {
        browser.load('/demos/chart/series/polarRadarSeries/polar.html');
        browser.compareScreen(element(By.id('container')), 'chart/polar_line');
    });
    it('checking polar scatter series', () => {
        browser.load('/demos/chart/series/polarRadarSeries/polar.html');
        seriesDrawType = element(by.id('SelectSeriesDrawType'));
        seriesDrawType.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/polar_scatter');
    });
    it('checking polar Area series', () => {
        browser.load('/demos/chart/series/polarRadarSeries/polar.html');
        seriesDrawType = element(by.id('SelectSeriesDrawType'));
        seriesDrawType.all(by.tagName('option'))
            .then((options: any) => {
                options[2].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/polar_area');
    });
    it('checking polar stacked area series', () => {
        browser.load('/demos/chart/series/polarRadarSeries/polar.html');
        seriesDrawType = element(by.id('SelectSeriesDrawType'));
        seriesDrawType.all(by.tagName('option'))
            .then((options: any) => {
                options[3].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/polar_stacked_area');
    });
    it('checking polar spline series', () => {
        browser.load('/demos/chart/series/polarRadarSeries/polar.html');
        seriesDrawType = element(by.id('SelectSeriesDrawType'));
        seriesDrawType.all(by.tagName('option'))
            .then((options: any) => {
                options[4].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/polar_spline');
    });
    it('checking polar range column series', () => {
        browser.load('/demos/chart/series/polarRadarSeries/polar.html');
        seriesDrawType = element(by.id('SelectSeriesDrawType'));
        seriesDrawType.all(by.tagName('option'))
            .then((options: any) => {
                options[5].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/polar_range_column');
    });
    it('checking polar column series', () => {
        browser.load('/demos/chart/series/polarRadarSeries/polar.html');
        seriesDrawType = element(by.id('SelectSeriesDrawType'));
        seriesDrawType.all(by.tagName('option'))
            .then((options: any) => {
                options[6].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/polar_column');
    });
    it('checking radar series', () => {
        let SelectSeriesType: ElementFinder = element(by.id('SelectSeriesType'));
        SelectSeriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/radar_series');
    });
    it('checking polar stacking column series', () => {
        browser.load('/demos/chart/series-types/polarRadarSeries/polar.html');
        seriesDrawType = element(by.id('SelectSeriesDrawType'));
        seriesDrawType.all(by.tagName('option'))
            .then((options: any) => {
                options[7].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/polar_stacking_column');
    });
});
describe('Polar and Radar', () => {
    it('checking x-axis inversed', () => {
        browser.load('/demos/chart/series/polarRadarSeries/polar.html');
        let SelectSeriesType: ElementFinder = element(by.id('SelectSeriesType'));
        SelectSeriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[0].click();
            });
        let xInversed: ElementFinder = element(by.id('xaxis'));
        xInversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/polar_x_inversed');
        xInversed.click();
    });
    it('checking y-axis inversed', () => {
        browser.load('/demos/chart/series/polarRadarSeries/polar.html');
        let SelectSeriesType: ElementFinder = element(by.id('SelectSeriesType'));
        SelectSeriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[0].click();
            });
        let yInversed: ElementFinder = element(by.id('yaxis'));
        yInversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/polar_y_inversed');
        yInversed.click();
    });
});