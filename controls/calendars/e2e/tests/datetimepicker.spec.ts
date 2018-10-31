import { browser, element, By,  protractor } from "@syncfusion/ej2-base/e2e/index";
import { Helper } from "./Helper/DateTimePickerHelper";
import { classList } from "@syncfusion/ej2-base";

let helper: Helper = new Helper();

describe('DateTimePicker', function () {

    it('Check Today Button Works', function () {
        browser.load('/demos/datetimepicker/default.html');
        browser.manage().timeouts().implicitlyWait(10000);
        helper.inputVal(helper.inputBox_Id, "1/1/2017 12:00 PM"); 
        element(helper.dateIcon_ClassName).click();
        helper.waitUntillClickable(helper.datePickerPopupOpen_Xpath);
        expect(element(helper.todayButton_Xpath).getAttribute("class")).toContain('e-today');
    });

    it('Check value is updated in popup list', function () {
        browser.load('/demos/datetimepicker/default.html');
        browser.manage().timeouts().implicitlyWait(10000);
        helper.inputVal(helper.inputBox_Id, "1/1/2019 2:30 PM"); 
        element(helper.timeIcon_ClassName).click();
        helper.waitUntillClickable(helper.timePickerPopupOpen_Xpath);
        expect(element(By.xpath("//*[contains(@class,'e-list-item e-active')]")).getAttribute("data-value")).toContain('2:30 PM');
        browser.compareScreen(element(helper.timePickerPopupOpen_Xpath), 'datetimepicker-value-selected');
    });

    it('format change in DateTimePicker control', function () {
        browser.load('/demos/datepicker/format.html');
        browser.manage().timeouts().implicitlyWait(10000);
        element(helper.dateIcon_ClassName).click();
        browser.compareScreen(element(By.className('content-wrapper')), 'DateTimePicker_Format_Default'); 
        let dateTimePickerElement = element(By.className('e-popup-wrapper')).all(By.tagName('td')); 
        dateTimePickerElement.get(2).click();
        helper.waitUntillinvisibilityOf(By.className("e-calendar"));  
        element(By.tagName('h4')).click();   
        browser.compareScreen(element(By.className('content-wrapper')), 'DateTimePicker_Format_NextDate'); 
    });

    it('Check value disabled cells in the popup calendar', function () {
        browser.load('/demos/datetimepicker/disabled.html');
        browser.manage().timeouts().implicitlyWait(10000);
        helper.inputVal(helper.inputBox_Id, "1/2/2017 2:30 PM");
        element(helper.dateIcon_ClassName).click();
        helper.waitUntillClickable(helper.datePickerPopupOpen_Xpath);
        browser.compareScreen(element(helper.timePickerPopupOpen_Xpath), 'datetimepicker-values-disabled');
    });

    it('Check error class behaviour in the input', function () {
        browser.load('/demos/datetimepicker/disabled.html');
        browser.manage().timeouts().implicitlyWait(10000);
        helper.inputVal(helper.inputBox_Id, "1/1/2017 2:30 PM");  
        element(By.tagName('h4')).click(); 
        browser.compareScreen(element(By.className('content-wrapper')), 'datetimepicker-values-error');
        expect(element(By.xpath("//*[contains(@class,'e-datetime-wrapper')]")).getAttribute("class")).toContain('e-error'); 
    });

    it('Check DateTimePicker Popup is closed by clicking on date Icon', function () {
        browser.load('/demos/datetimepicker/default.html');
        helper.inputVal(helper.inputBox_Id, "1/1/2017 2:00 AM");
        element(helper.timeIcon_ClassName).click(); 
        helper.waitUntillClickable(helper.timePickerPopupOpen_Xpath);  
        expect(element(By.xpath("//*[contains(@class,'e-input-group-icon e-time-icon e-icons')]")).getCssValue("e-active")).toBeTruthy;
        element(helper.dateIcon_ClassName).click();
        helper.waitUntillClickable(helper.datePickerPopupOpen_Xpath); 
        expect(element(By.xpath("//*[contains(@class,'e-input-group-icon e-time-icon e-icons')]")).getCssValue("e-active")).toBeFalsy;
        browser.compareScreen(element(helper.datePickerPopupOpen_Xpath), 'DateTimePicker_input_PopUpclosed');
    });

    it('Inspect DateTimePicker popup control', function () {
        browser.load('/demos/datetimepicker/default.html');
        browser.manage().timeouts().implicitlyWait(10000);
        helper.inputVal(helper.inputBox_Id, "1/1/2017 1:30 PM");
        browser.sleep(50);
        element(By.xpath("//*[contains(@class,'content-wrapper')]")).click();
        browser.compareScreen(element(By.className("e-datetime-wrapper")), 'DateTimePicker_DateNavigation_Default');  
    });

    it('Disabled dates in DateTimePicker control', function () {
        browser.load('/demos/datetimepicker/disabled.html');
        browser.manage().timeouts().implicitlyWait(10000);
        element(helper.dateIcon_ClassName).click();
        helper.waitUntillClickable(helper.datePickerPopupOpen_Xpath);
        browser.compareScreen(element(By.xpath("//*[contains(@class,'e-datetimepopup-wrapper')]")), 'DateTimePicker_DisableDate_Default');
        element(helper.Nexticon_Xpath).click();
        helper.waitForNavigation_NextPrev("June");
        browser.compareScreen(element(By.xpath("//*[contains(@class,'e-datetimepopup-wrapper')]")), 'DateTimePicker_DisableDate_NextMonth');
    });

    it('Setting miniumum and maximum value in DateTimePicker control', function () {
        browser.load('/demos/datetimepicker/range.html');
        browser.manage().timeouts().implicitlyWait(10000);
        element(helper.dateIcon_ClassName).click();
        helper.waitUntillClickable(helper.datePickerPopupOpen_Xpath);
        browser.sleep(500);
        browser.compareScreen(element(helper.datePickerPopupOpen_Xpath), 'DateTimePicker_MinMax_Default');
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.sleep(500);
        browser.compareScreen(element(helper.datePickerPopupOpen_Xpath), 'DateTimePicker_MinMax_Month');
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.sleep(500);
        browser.compareScreen(element(helper.datePickerPopupOpen_Xpath), 'DateTimePicker_MinMax_Year');
    });

    it('Check strict mode behaviour in DateTimePicker control', function () {
        browser.load('/demos/datetimepicker/strictMode.html');
        // with strict mode property
        helper.inputVal(helper.inputBox_Id, "");
        element(By.xpath("//*[contains(@id,'datetimepicker')]")).click();
        browser.compareScreen(element(By.className("e-datetime-wrapper")), "DateTimepicker_null");
        helper.inputVal(helper.inputBox_Id, "12/49/2018 12:00 CM");
        element(By.tagName('h4')).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.className("e-datetime-wrapper")), "DateTimepicker_Strict_Mode");
    });

    it('Check week number behaviour in DateTimePicker control', function () {
        browser.load('/demos/datetimepicker/weekNumber.html');
        browser.manage().timeouts().implicitlyWait(10000);
        // with week number property
        helper.inputVal(helper.inputBox_Id, "12/04/2018 12:00 PM");
        element(By.xpath("//*[contains(@id,'datetimepicker')]")).click();
        element(helper.dateIcon_ClassName).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.xpath("//*[contains(@class,'e-datetimepopup-wrapper')]")), "DateTimepicker_weeknumber");
    });

    it('Check first day behaviour in DateTimePicker control', function () {
        browser.load('/demos/datetimepicker/firstDayOfWeek.html');
        browser.manage().timeouts().implicitlyWait(10000);
        // with week number property
        helper.inputVal(helper.inputBox_Id, "12/04/2018 12:00 PM");
        element(By.xpath("//*[contains(@id,'datetimepicker')]")).click();
        element(helper.dateIcon_ClassName).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.xpath("//*[contains(@class,'e-datetimepopup-wrapper')]")), "DateTimepicker_firstday");
    });

    it('Check RTL behaviour in DateTimePicker control', function () {
        browser.load('/demos/datetimepicker/rtl.html');
        browser.manage().timeouts().implicitlyWait(10000);
        // with week number property
        helper.inputVal(helper.inputBox_Id, "12/04/2018 12:00 PM");
        element(By.xpath("//*[contains(@id,'datetimepicker')]")).click();
        element(helper.dateIcon_ClassName).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.xpath("//*[contains(@class,'e-datetimepopup-wrapper')]")), "DateTimepicker_rtl");
    });

    it('Check clear button behaviour in DateTimePicker control', function () {
        browser.load('/demos/datetimepicker/default.html');
        browser.manage().timeouts().implicitlyWait(10000);
        // with clear button property
        helper.inputVal(helper.inputBox_Id, "12/49/2018 12:00 CM");
        element(By.xpath("//*[contains(@id,'datetimepicker')]")).click();
        element(By.xpath("//*[contains(@class,'e-clear-icon')]")).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.className("e-datetime-wrapper")), "DateTimepicker_Clear_button");
    });
    
    it('Check fabric behaviour in DateTimePicker control', function () {
        browser.load('/demos/fabric/default.html');
        // with fabric theme
        helper.inputVal(helper.inputBox_Id, "12/04/2018 12:00 PM");
        element(By.xpath("//*[contains(@id,'datetimepicker')]")).click();
        browser.sleep(500);
        browser.compareScreen(element(By.className("e-datetime-wrapper")), "DateTimepicker_fabric");
        element(By.xpath("//*[contains(@id,'datetimepicker')]")).click();
        element(By.xpath("//*[contains(@class,'e-datetime-wrapper')]/span[contains(@class,'e-time-icon')]")).click();
        helper.waitUntillClickable(helper.datePickerPopupOpen_Xpath);
        browser.compareScreen(element(helper.datePickerPopupOpen_Xpath), "DateTimepicker_Date_Popup_fabric");
    });
});
