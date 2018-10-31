import { browser, element, By, protractor } from "@syncfusion/ej2-base/e2e/index";
let EC = browser.ExpectedConditions;
export class Helper {
    public tip_ID: object = By.id('tippositions');
    public tooltip_ID: object = By.id('tooltip');
    public position_ClassName: object = By.className('position');
    public template_ClassName: object = By.className('message');
    public disable_ClassName: object = By.className('tippointer');
    public sticky_ClassName: object = By.className('stickymode');
    public template_ID: object = By.id('staticlink');
    public disable_ID: object = By.id('tooltip2');
    public sticky_ID: object = By.id('tooltip3');
    public customTip_ID: object = By.id('customTip');
    public customTheme_ID: object = By.id('customTheme');
    public theme_ClassName: object = By.className('theme_change');

    public loadAndWait(url: string, ele: any, time: number = 2000) {
        browser.load(url);
        this.waitUntilPresent(ele, time);
    }

    public waitUntilPresent(ele: any, time: number = 2000) {
        browser.wait(
            EC.presenceOf(element(ele)), time
        );
    }

    public clickByXPath(xpath: string) {
        element(By.xpath(xpath)).click();
    }
}