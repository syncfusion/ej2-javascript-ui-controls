/**
 * TreeMap e2e testing
 */
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 200);
}

describe('TreeMap component test spec', () => {
    it('TreeMap Trim label mode', () => {
        browser.get(browser.basePath + '/demo/label.html');
        browser.compareScreen(element(By.id('container')), 'labelmode');
    });
});
describe('TreeMap component test spec', () => {
    it('TreeMap Hide label mode', () => {
        browser.get(browser.basePath + '/demo/labelmode2.html');
        browser.compareScreen(element(By.id('container')), 'labelmode_hide');
    });
});
describe('TreeMap component test spec', () => {
    it('TreeMap Wrap label mode', () => {
        browser.get(browser.basePath + '/demo/labelmode3.html');
        browser.compareScreen(element(By.id('container')), 'labelmode_Wrap');
    });
});
describe('TreeMap component test spec', () => {
    it('TreeMap WrapByWord label mode', () => {
        browser.get(browser.basePath + '/demo/labelmode4.html');
        browser.compareScreen(element(By.id('container')), 'labelmode_WrapByWord');
    });
});
describe('Hierarchical datalabel', () => {
    let property;
    it('TreeMap data label Trim', () => {
        browser.get(browser.basePath + '/demo/hier_datalabel.html');
        browser.compareScreen(element(By.id('container')), 'label_trim');
    });
    it(' Hierarchical datalabel hide', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "label_hide");
        done();
    });
    it('Hierarchical datalabel wrap', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "label_wrap");
        done();
    });
    it('Hierarchical datalabel word', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "label_word");
        done();
    });
});
describe('Flat datalabel', () => {
    let property;
    it(' data label Trim', () => {
        browser.get(browser.basePath + '/demo/flat_datalabel.html');
        browser.compareScreen(element(By.id('container')), 'hier_label_trim');
    });
    it('datalabel hide', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_label_hide");
        done();
    });
    it('datalabel wrap', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_label_wrap");
        done();
    });
    it('datalabel word', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "hier_label_word");
        done();
    });
});
describe('TreeMap showlabel', () => {
    it('TreeMap label hide', () => {
        browser.get(browser.basePath + '/demo/flat_datalabelhide.html');
        browser.compareScreen(element(By.id('container')), 'flat_hide');
    });
});
describe('Hierarchical TreeMap showlabel', () => {
    it('Hierarchical label hide', () => {
        browser.get(browser.basePath + '/demo/hier_labelhide.html');
        browser.compareScreen(element(By.id('container')), 'hier_labelhide');
    });
});
