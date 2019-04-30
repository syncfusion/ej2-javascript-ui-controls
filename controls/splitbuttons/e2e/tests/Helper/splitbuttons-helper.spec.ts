import { browser, element, By, protractor } from "@syncfusion/ej2-base/e2e/index";
let EC = browser.ExpectedConditions;
export class Helper {

    public default_dropdownbtn: object = By.id('basic-drop-down-btn');
    public dropdownbtn_icon: object = By.id('icon');
    public last_dropdownbtn: object = By.id('hide-popup');
    public dropdownbtn_popup: object = By.id('icon-popup');
    public default_splitbtn: object = By.className('frame');
    public splitbtn_icon: object = By.id('icontextbtn');
    public splitbtn_popup: object = By.id('icontextbtn_dropdownbtn-popup');
    public last_splitbtn: object = By.id('icontextbtn_dropdownbtn');
    public btngroup: object = By.className('frame');
    public roundedcorner: object = By.id('groupbutton4');
    public table: Object = By.className('grpbtn');

    public loadAndWait(url: string, ele: any, time: number = 2000) {
        browser.load(url);
        this.waitUntilPresent(ele, time);
    }

    public waitUntilPresent(ele: any, time: number = 3000) {
        browser.wait(
            EC.presenceOf(element(ele)), time
        );
    }

    public clickByXPath(xpath: string) {
        element(By.xpath(xpath)).click();
    }

    public sleep(waitTime: number) {
        browser.driver.sleep(waitTime);
    }

}