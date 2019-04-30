import { browser, element, By, protractor } from "@syncfusion/ej2-base/e2e/index";
let EC = browser.ExpectedConditions;
export class Helper {

    public default_List: object = By.id('default-list');
    public group_List: object = By.id('grouped-list');
    public remote_List: object = By.id('remote-list');
    public rtl_List: object = By.id('rtl-list');
    public nested_List: object = By.id('nested-list');
    public list_ClassName: object = By.className('e-list-item');
    public active_ClassName: object = By.className('e-active');
    public checked_List: object = By.id('checkbox-list');
    public group_Checkbox: object = By.id('group-checkbox');
    public nested_Checkbox: object = By.id('nested-checkbox');
    public checked_ClassName: object = By.className('e-check');
    public header_template: object = By.id('template-list');
    public virtual_list: object = By.id('virtual-list');
    
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