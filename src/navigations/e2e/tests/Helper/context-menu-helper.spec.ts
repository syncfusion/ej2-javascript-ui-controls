import { browser, element, By, protractor, ProtractorExpectedConditions } from "@syncfusion/ej2-base/e2e/index";

export let EC: ProtractorExpectedConditions = browser.ExpectedConditions;

export class Helper {
    public context_menu: object = By.id('contextmenu');
    public cm_target: object = By.id('editor');
    public snap_area: object = By.tagName('BODY');
    public cm_inst: string = 'document.getElementById("contextmenu").ej2_instances[0]';
    public target: string = 'document.getElementById("editor")';

    public rightClick(browserName: string) {
        if (browserName === 'firefox') {
            browser.executeScript(this.cm_inst + '.open(' + this.target + '.offsetTop,' + this.target + '.offsetLeft)');
        } else {
            browser.actions().click(element(By.id('editor')), protractor.Button.RIGHT).perform();
        }
        browser.wait(EC.visibilityOf(element(this.context_menu)), 2000);
    }

    public hover(selector: string): void {
        browser.actions().mouseMove(element(By.css(selector))).perform();
    }

    public click(selector: string): void {
        browser.actions().click(element(By.css(selector))).perform();
    }

    public waitUntilPresent(ele: any = this.context_menu, time: number = 12000) {
        browser.wait(EC.presenceOf(element(ele)), time);
    }

    public sleep(waitTime: number) {
        browser.driver.sleep(waitTime);
    }
}