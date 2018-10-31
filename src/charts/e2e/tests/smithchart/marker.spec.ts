import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 1200);
}

describe('Smithchart Impedence component test spec', () => {
    it('Smithchart Marker sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_marker.html');
        browser.compareScreen(element(By.id('container')), 'imp_marker');
    });
});
describe('Smithchart Admittance component test spec', () => {
    it('Smithchart Marker sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_marker.html');
        browser.compareScreen(element(By.id('container')), 'adm_marker');
    });
});
describe('Smithchart Impedance marker shape ', () => {
    let property;
    it('marker shape Circle', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_markertype.html');
        browser.compareScreen(element(By.id('container')), 'imp_marker_Circle');
    });
    it('marker shape Rectangle', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_marker_Rectangle");
        done();
    });
    it('marker shape Triangle', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_marker_Triangle");
        done();
    });
    it('marker shape Diamond', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_marker_Diamond");
        done();
    });
    it('marker shape Pentagon', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[4].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_marker_Pentagon");
        done();
    });
});
describe('Smithchart Admittance marker position ', () => {
    let property;
    it('marker shape Circle', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_markertype.html');
        browser.compareScreen(element(By.id('container')), 'adm_marker_circle');
    });
    it('marker shape Rectangle', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_marker_Rectangle");
        done();
    });
    it('marker shape Triangle', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_marker_Triangle");
        done();
    });
    it('marker shape Diamond', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_marker_Diamond");
        done();
    });
    it('marker shape Pentagon', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_marker_Pentagon");
        done();
    });
});