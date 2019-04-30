import { browser, element, By } from "@syncfusion/ej2-base/e2e/index";
let EC = browser.ExpectedConditions;
export class Helper {

    public load(url: string) {
        browser.load(url);
    }
    public xpath(xpath: string): any {
        return element(By.xpath(xpath));
    }
    public buttonClick(xpath: string): any {
        return element(By.xpath(xpath)).click();
    }

    public waitUntilPresent(ele: any, time: number = 3000) {
        browser.wait(
            EC.presenceOf(element(ele)), time
        );
    }

    public navigation(selector: string, action: any) {
        browser.element(By.className(selector)).sendKeys(action);
    }

    public sleep(waitTime: number) {
        browser.driver.sleep(waitTime);
    }

}