/**
 * Smithchart e2e testing
 */
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('Smithchart Impedance Legend position ', () => {
    let property;
    it('Legend postion Bottom', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_legend_position.html');
        browser.compareScreen(element(By.id('container')), 'imp_legend_bottom');
    });
    it('legend position Top', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_legend_Top");
        done();
    });
    it('legend position Right', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_legend_right");
        done();
    });
    it('legend position Left', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_legend_left");
        done();
    });
});
describe('Smithchart Admittance Legend position ', () => {
    let property;
    it('Legend postion Bottom', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_legend_position.html');
        browser.compareScreen(element(By.id('container')), 'adm_legend_bottom');
    });
    it('legend position Top', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_legend_Top");
        done();
    });
    it('legend position Right', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_legend_right");
        done();
    });
    it('legend position Left', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_legend_left");
        done();
    });
});
describe('Smithchart Impedance Legend shape ', () => {
    let property;
    it('Legend shape Circle', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_legend.html');
        browser.compareScreen(element(By.id('container')), 'imp_legend_circle');
    });
    it('legend shape Rectangle', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_legend_Rectangle");
        done();
    });
    it('legend shape Triangle', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_legend_Triangle");
        done();
    });
    it('legend shape Diamond', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_legend_Diamond");
        done();
    });
    it('legend shape Pentagon', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[4].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_legend_Pentagon");
        done();
    });
});
describe('Smithchart Admittance Legend position ', () => {
    let property;
    it('Legend shape Circle', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_legend.html');
        browser.compareScreen(element(By.id('container')), 'adm_legend_circle');
    });
    it('legend shape Rectangle', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_legend_Rectangle");
        done();
    });
    it('legend shape Triangle', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_legend_Triangle");
        done();
    });
    it('legend shape Diamond', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_legend_Diamond");
        done();
    });
    it('legend shape Pentagon', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_legend_Pentagon");
        done();
    });
});
describe('Smith chart  Impedence Legend alignment ', () => {
    let property;
    it('Legend alignment Center', () => {
        browser.get(browser.basePath + '/demos/smithchart/imp_legend_alignment.html');
        browser.compareScreen(element(By.id('container')), 'imp_legend_align');
    });
    it('Legend alignment Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_legend_align2");
        done();
    });
    it('Legend alignment Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "imp_legend_align3");
        done();
    });
});
describe('Smith chart Admittance Legend alignment ', () => {
    let property;
    it('Legend alignment Center', () => {
        browser.get(browser.basePath + '/demos/smithchart/adm_legend_alignment.html');
        browser.compareScreen(element(By.id('container')), 'adm_legend_align');
    });
    it('Legend alignment Far', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_legend_align2");
        done();
    });
    it('Legend alignment Near', (done: Function) => {
        property = element(by.id('labels'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "adm_legend_align3");
        done();
    });
});