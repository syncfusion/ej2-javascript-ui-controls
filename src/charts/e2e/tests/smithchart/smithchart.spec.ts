/**
 * Smithchart e2e testing
 */
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('Smithchart Impedence', () => {
    it('Smithchart Radius sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_radius.html');
        browser.compareScreen(element(By.id('container')), 'imp_radius');
    });
});
describe('Smithchart Admittance ', () => {
    it('Smithchart Radius sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_radius.html');
        browser.compareScreen(element(By.id('container')), 'adm_radius');
    });
});
describe('Smithchart Impedence', () => {
    it('Smithchart datalabel sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_datalabel.html');
        browser.compareScreen(element(By.id('container')), 'imp_datalabel');
    });
});
describe('Smithchart Admittance ', () => {
    it('Smithchart datalabel sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_datalabel.html');
        browser.compareScreen(element(By.id('container')), 'adm_datalabel');
    });
});
describe('Smithchart component test spec', () => {
    it('Smithchart Default sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/default.html');
        browser.compareScreen(element(By.id('container')), 'default_smithchart');
    });
});
describe('Smithchart component test spec', () => {
    it('Smithchart Axis sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_radialaxis.html');
        browser.compareScreen(element(By.id('container')), 'imp_radial');
    });
});
describe('Smithchart component test spec', () => {
    it('Smithchart Axis sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_radialaxis.html');
        browser.compareScreen(element(By.id('container')), 'adm_radial');
    });
});
describe('Smith chart Impedence label intersectaction', () => {
    let property;
    it('Smith chart label intersectaction', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_label_intersect.html');
        browser.compareScreen(element(By.id('container')), 'imp_Hide');
    });
    it('Smith chartlabel intersectaction Trim', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_Trim");
        done();
    });
});
describe('Smith chart Admittance label intersectaction', () => {
    let property;
    it('Smith chart label intersectaction', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_label_intersect.html');
        browser.compareScreen(element(By.id('container')), 'adm_Hide');
    });
    it('Smith chartlabel intersectaction Trim', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_Trim");
        done();
    });
});
describe('Smith chart Impedence label Position', () => {
    let property;
    it('Smith chart label Position Ouside', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_label_intersect.html');
        browser.compareScreen(element(By.id('container')), 'imp_label_outside');
    });
    it('Smith chartlabel Position Inside', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_label_inside");
        done();
    });
});
describe('Smith chart Admittance label Position', () => {
    let property;
    it('Smith chart label Position Ouside', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_label_intersect.html');
        browser.compareScreen(element(By.id('container')), 'adm_label_outside');
    });
    it('Smith chartlabel Position Inside', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_label_inside");
        done();
    });
});