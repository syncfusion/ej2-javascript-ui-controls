/**
 * Sparkline e2e testing
 */
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('Sparkline array', () => {
    let property;
    it('Sparkline  Line', () => {
        browser.get(browser.basePath + '/demos/sparkline/array_value.html');
        browser.compareScreen(element(By.id('container')), 'array_line');
    });
    it(' Sparkline array column', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "array_column");
        done();
    });
    it('Sparkline array winloss', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "array_winloss");
        done();
    });
    it('Sparkline array Area', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "array_Area");
        done();
    });
});
describe('Sparkline json', () => {
    let property;
    it('Sparkline  Line', () => {
        browser.get(browser.basePath + '/demos/sparkline/json_value.html');
        browser.compareScreen(element(By.id('container')), 'json_line');
    });
    it(' Sparkline json column', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "json_column");
        done();
    });
    it('Sparkline json winloss', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "json_winloss");
        done();
    });
    it('Sparkline json Area', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "json_Area");
        done();
    });
});
describe('Sparkline numerical', () => {
    let property;
    it('Sparkline  Line', () => {
        browser.get(browser.basePath + '/demos/sparkline/numerical.html');
        browser.compareScreen(element(By.id('container')), 'num_line');
    });
    it(' Sparkline numerical column', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "num_column");
        done();
    });
    it('Sparkline numerical winloss', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "num_winloss");
        done();
    });
    it('Sparkline numerical Area', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "num_Area");
        done();
    });
});
describe('Sparkline String', () => {
    let property;
    it('Sparkline  Line', () => {
        browser.get(browser.basePath + '/demos/sparkline/numerical.html');
        browser.compareScreen(element(By.id('container')), 'string_line');
    });
    it(' Sparkline String column', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "string_column");
        done();
    });
    it('Sparkline String winloss', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "string_winloss");
        done();
    });
    it('Sparkline String Area', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "string_Area");
        done();
    });
});
describe('Sparkline data_time', () => {
    let property;
    it('Sparkline  Line', () => {
        browser.get(browser.basePath + '/demos/sparkline/date_time.html');
        browser.compareScreen(element(By.id('container')), 'date_line');
    });
    it(' Sparkline data_time column', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "date_column");
        done();
    });
    it('Sparkline data_time winloss', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "date_winloss");
        done();
    });
    it('Sparkline data_time Area', (done: Function) => {
        property = element(by.id('label'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "date_Area");
        done();
    });
});


