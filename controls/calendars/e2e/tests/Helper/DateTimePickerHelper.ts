import { browser, element, By, protractor } from "@syncfusion/ej2-base/e2e/index";

export class Helper {

    public dateIcon_ClassName: object = By.className('e-date-icon');
    public timeIcon_ClassName: object = By.className('e-time-icon');
    public inputBox_Id: object = By.id("datetimepicker");
    public todayButton_Xpath: object = By.xpath("//button[contains(@class,'e-today')]");
    public Previcon_Xpath: object = By.xpath("//div[contains(@class,'e-calendar')]//*[contains(@class,'e-prev')]");
    public Nexticon_Xpath: object = By.xpath("//div[contains(@class,'e-calendar')]//*[contains(@class,'e-next')]");
    public DateTitle_Xpath: object = By.xpath("//div[contains(@class,'e-calendar')]//*[contains(@class,'e-title')]");
    public timePickerPopupOpen_Xpath: object = By.xpath("//*[contains(@class,'e-popup-open')]");
    public datePickerPopupOpen_Xpath: object = By.xpath("//*[contains(@class,'e-popup-open')]");
    public title_ClassName: object = By.className('e-title');
    


    public waitUntillClickable(elm: any) {
        var EC = protractor.ExpectedConditions;
        var elmToClick = element(elm);
        browser.wait(EC.elementToBeClickable(elmToClick), 2000);
      }

      public inputVal(elm: any, value: string) {
        this.waitUntillPresent(elm);
        element(elm).clear();
        element(elm).sendKeys(value, protractor.Key.ENTER);
    
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

      public waitForNavigation_MonatandYear() {
        var EC = protractor.ExpectedConditions;
        var elmToClick = element(By.xpath("(//*[@class='e-day'])[last()]"));
        browser.wait(EC.elementToBeClickable(elmToClick), 2000);
      }
      
      public waitForNavigation_NextPrev(month: string) {
        var EC = protractor.ExpectedConditions;
        var elmToClick = element(By.xpath("(//*[contains(@class,'e-weekend')]/span[contains(@title,'" + month + "')])[last()]"));
        browser.wait(EC.elementToBeClickable(elmToClick), 2000);
      }
}