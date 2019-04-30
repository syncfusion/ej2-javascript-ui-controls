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

}