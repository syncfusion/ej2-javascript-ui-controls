import { browser, element, By, protractor } from "@syncfusion/ej2-base/e2e/index";



export class Helper {

  public pickerIcon_Classname: object=By.className('e-input-group-icon');
  public nextDateIcon_ClassName: object = By.className('e-date-icon-next');
  public prevDateIcon_ClassName: object = By.className('e-date-icon-prev');
  public title_ClassName: object = By.className('e-title');
  public footer_ClassName: object = By.className('e-footer');
  

  public waitUntillClickable(elm: any) {
    var EC = protractor.ExpectedConditions;
    var elmToClick = element(elm);
    browser.wait(EC.elementToBeClickable(elmToClick), 2000);
  }

  public waitForNavigation_NextPrev(month: string) {
    var EC = protractor.ExpectedConditions;
    var elmToClick = element(By.xpath("(//*[contains(@class,'e-weekend')]/span[contains(@title,'" + month + "')])[last()]"));
    browser.wait(EC.elementToBeClickable(elmToClick), 2000);
  }


  public waitForNavigation_MonatandYear() {
    var EC = protractor.ExpectedConditions;
    var elmToClick = element(By.xpath("(//*[@class='e-day'])[last()]"));
    browser.wait(EC.elementToBeClickable(elmToClick), 2000);
  }


  public waitUntillPresent(elm: any) {
    var EC = protractor.ExpectedConditions;
    var elmt = element(elm);
    browser.wait(EC.presenceOf(elmt), 2000);
  }

  public waitUntillinvisibilityOf(elm: any) {
    var EC = protractor.ExpectedConditions;
    var elmt = element(elm);
    browser.wait(EC.invisibilityOf(elmt), 3000);
  }

  public inputRange(elm: any, value: string) {
    this.waitUntillPresent(elm);
    element(elm).clear();
    element(elm).sendKeys(value, protractor.Key.ENTER);

  }



}