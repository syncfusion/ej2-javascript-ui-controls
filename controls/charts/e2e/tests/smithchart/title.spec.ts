import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart titles sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_title.html');
        browser.compareScreen(element(By.id('container')), 'imp_title1');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart titles sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_title.html');
        browser.compareScreen(element(By.id('container')), 'adm_subtitle1');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart subtitles sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_subtitle.html');
        browser.compareScreen(element(By.id('container')), 'imp_subtitle_sample');
    });
});
describe('Smithchart Impedence component test spec', () => {
    it('Smithchart subtitles sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_subtitle.html');
        browser.compareScreen(element(By.id('container')), 'adm_subtitle_sample');
    });
});
describe('Smith chart Impedence title alignment ', () => {
    let property;
    it('Smith chart title Center', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_titlealign.html');
        browser.compareScreen(element(By.id('container')), 'imp_title_center');
    });
    it('Smith chart title Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_title_far");
        done();
    });
    it('Smith chart title Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_title_near");
        done();
    });
});
describe('Smith chart Admittance title alignment ', () => {
    let property;
    it('Smith chart title Center', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_titlealign.html');
        browser.compareScreen(element(By.id('container')), 'adm_title_center');
    });
    it('Smith chart title Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_title_far");
        done();
    });
    it('Smith chart title Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_title_near");
        done();
    });
});
describe('Smith chart Admittance subtitle alignment ', () => {
    let property;
    it(' subtitle Center', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_subtitlealign.html');
        browser.compareScreen(element(By.id('container')), 'adm_subtitle_center');
    });
    it(' subtitle Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_subtitle_far");
        done();
    });
    it(' subtitle Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_subtitle_near");
        done();
    });
});
describe('Smith chart Impedence subtitle alignment Center', () => {
    let property;
    it('Smith chart subtitle Center', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_subtitlealign.html');
        browser.compareScreen(element(By.id('container')), 'imp_subtitle');
    });
    it('Smith chart subtitle Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_subtitle2");
        done();
    });
    it('Smith chart subtitle Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_subtitle3");
        done();
    });
});