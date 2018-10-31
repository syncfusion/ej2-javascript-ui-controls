/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';

describe('Title and Sub-title Placements', () => {
    let seriesType: ElementFinder;
    let point1: ElementFinder;
    let point2: ElementFinder;
    let point3: ElementFinder;
    it('Title Placement Centre', () => {
        browser.load('/demos/chart/title-placement/title.html');
        seriesType = element(by.id('titletext'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[0].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/title_centre');
    });
    it('Title Placement Near', () => {
        seriesType = element(by.id('titletext'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/title_near');
    });
    it('Title Placement Far', () => {
        seriesType = element(by.id('titletext'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[2].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/title_far');
    });
    it('Sub-title Placement Centre', () => {
        browser.load('/demos/chart/title-placement/title.html');
        seriesType = element(by.id('subtitlealign'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[0].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/sub_title_centre');
    });
    it('Sub-title Placement Near', () => {
        seriesType = element(by.id('subtitlealign'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/sub_title_near');
    });
    it('Sub-title Placement Far', () => {
        seriesType = element(by.id('subtitlealign'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[2].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/sub_title_far');
    });
});