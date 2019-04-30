import { browser, element, By, protractor } from "@syncfusion/ej2-base/e2e/index";

//let dateRangeIcon_ClassName:object = By.className('e-range-icon');
let cancelButton_Xpath = By.xpath("//button[contains(text(),'Cancel')]");

export class Helper {

  public dateRangeIcon_ClassName: object = By.className('e-range-icon');
  public dateRangePopup_Id:object=By.id("daterangepicker_popup");
  public applyButton_Xpath: object = By.xpath("//button[contains(text(),'Apply')]");
  public cancelButton_Xpath: object = By.xpath("//button[contains(text(),'Cancel')]");
  public inputBox_Id: object = By.id("daterangepicker");
  public startDatePrevicon_Xpath: object = By.xpath("//div[@class='e-left-container']//*[contains(@class,'e-prev')]");
  public startDateNexticon_Xpath: object = By.xpath("//div[@class='e-left-container']//*[contains(@class,'e-next')]");
  public endDatePrevicon_Xpath: object = By.xpath("//div[@class='e-right-container']//*[contains(@class,'e-prev')]");
  public endDateNexticon_Xpath: object = By.xpath("//div[@class='e-right-container']//*[contains(@class,'e-next')]");
  public startDateHeader_Xpath: object = By.xpath("//div[@class='e-left-container']//*[contains(@class,'e-title')]");
  public endDateHeader_Xpath: object = By.xpath("//div[@class='e-right-container']//*[contains(@class,'e-title')]");
  public startDateLabel_ClassName:Object=By.className("e-start-label");
  public endDateLabel_ClassName:Object=By.className("e-end-label");



  public openPopUp() {
    this.waitUntillClickable(this.dateRangeIcon_ClassName);
    element(this.dateRangeIcon_ClassName).click();
  }

  public waitUntillClickable(elm: any) {
    var EC = protractor.ExpectedConditions;
    var elmToClick = element(elm);
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

  public selectRange(startRange: string, endRange: string) {
    this.waitUntillClickable(By.xpath("//*[@title='" + startRange + "']"));
    element(By.xpath("//*[@title='" + startRange + "']")).click();
    this.waitUntillClickable(By.xpath("//*[@title='" + endRange + "']"));
    element(By.xpath("//*[@title='" + endRange + "']")).click();
  }

  public selectStartRange(startRange: string) {
    this.waitUntillClickable(By.xpath("//*[@title='" + startRange + "']"));
    element(By.xpath("//*[@title='" + startRange + "']")).click();


  }
  public selectEndRange(endRange: string) {

    this.waitUntillClickable(By.xpath("//*[@title='" + endRange + "']"));
    element(By.xpath("//*[@title='" + endRange + "']")).click();

  }






}