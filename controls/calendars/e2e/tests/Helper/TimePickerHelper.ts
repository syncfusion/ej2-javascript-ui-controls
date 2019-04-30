import { browser, element, By, protractor } from "@syncfusion/ej2-base/e2e/index";

//let dateRangeIcon_ClassName:object = By.className('e-range-icon');
let cancelButton_Xpath = By.xpath("//button[contains(text(),'Cancel')]");

export class Helper {

  public timePickerIcon_ClassName: object = By.className('e-input-group-icon');
  public timePickerPopupOpen_Xpath: object = By.xpath("//*[contains(@class,'e-popup-open')]");
  public timePickerInputBox_ClassName: object = By.className('e-input-group');
  public timePickerInput_Id: object = By.id("timepicker");
  



  public openPopUp() {
    this.waitUntillClickable(this.timePickerIcon_ClassName);
    element(this.timePickerIcon_ClassName).click();
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

  public inputTime(elm: any, value: string) {
    this.waitUntillPresent(elm);
    element(elm).clear();
    element(elm).sendKeys(value, protractor.Key.ENTER);

  }

  public selectTime_FromPopup(popupId: string, value: string) {
   
    this.waitUntillClickable(By.xpath("//*[@id='"+popupId+"']//*[@data-value='"+value+"']"));
    element(By.xpath("//*[@id='"+popupId+"']//*[@data-value='"+value+"']")).click();
    this.waitUntillinvisibilityOf(By.xpath("//*[@id='"+popupId+"']//*[@data-value='"+value+"']"));
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