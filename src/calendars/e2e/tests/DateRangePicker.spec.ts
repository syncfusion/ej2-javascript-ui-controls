import { browser, element, By } from "@syncfusion/ej2-base/e2e/index";
import { Helper } from "./Helper/DateRangePickerHelper";

var helper: Helper = new Helper();
var loocator: any = require('./Helper/DateRangePickerHelper');



describe('DateRangePicker', function () {

    beforeEach(function () {
        browser.load('/demos/daterangepicker/default.html');
        browser.manage().timeouts().implicitlyWait(10000);
    });

    it('Check DateRangePicker Popup', function () {
        helper.inputRange(helper.inputBox_Id, "1/1/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.waitUntillClickable(helper.cancelButton_Xpath); //check for cancel buttton is present and then proceed to take screenshot
        browser.compareScreen(element(By.id('daterangepicker_popup')), 'DateRange_PopUp');
    });

     it('Check DateRangePicker Popup is closed by clicking on dateRange Icon', function () {
        helper.inputRange(helper.inputBox_Id, "1/1/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.waitUntillClickable(helper.cancelButton_Xpath); //check for cancel buttton is present and then proceed to take screenshot
        element(helper.dateRangeIcon_ClassName).click();
        helper.waitUntillinvisibilityOf(helper.dateRangePopup_Id);  
        browser.compareScreen(element(By.className('content-wrapper')), 'DateRange_PopUpclosed');
    });

    it('Check Cancel Button Works', function () {
        helper.inputRange(helper.inputBox_Id, "1/1/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.waitUntillClickable(helper.cancelButton_Xpath); //check for cancel buttton is present and then proceed to click
        element(helper.cancelButton_Xpath).click();
        browser.compareScreen(element(By.className('content-wrapper')), 'DateRange_Cancel');
    });

    it('Check for Apply Button is enabled after a Date been given as input in a picker', function () {
        helper.inputRange(helper.inputBox_Id, "1/1/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.waitUntillClickable(helper.applyButton_Xpath); //wait for apply buttton is present and then proceed to validate
        expect(element(helper.applyButton_Xpath).isDisplayed()).toBeTruthy();
    });

    it('Check for right nav icon on left container is disabled after a Date been given as input in a picker', function () {

        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.waitUntillClickable(helper.applyButton_Xpath); //wait for apply buttton is present 
        expect(element(helper.startDateNexticon_Xpath).getAttribute("aria-disabled")).toContain("true");
        browser.compareScreen(element(By.className('e-left-calendar')), 'DateRange_LeftCalender');
    });

    it('Check for prev nav icon on left container is enabled after a Date been given as input in a picker', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup       
        expect(element(helper.startDatePrevicon_Xpath).getAttribute("aria-disabled")).toContain("false");
    });

    it('Check for prev nav icon on right container is disabled after a Date been given as input in a picker', function () {
        helper.inputRange(helper.inputBox_Id, "1/7/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.waitUntillClickable(helper.applyButton_Xpath); //wait for apply buttton is present 
        expect(element(helper.endDatePrevicon_Xpath).getAttribute("aria-disabled")).toContain("true");
        browser.compareScreen(element(By.className('e-right-calendar')), 'DateRange_RightCalender');
    });

    it('Check for next nav icon on right container is enabled after a Date been given as input in a picker', function () {
        helper.inputRange(helper.inputBox_Id, "1/7/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup        
        expect(element(helper.endDateNexticon_Xpath).getAttribute("aria-disabled")).toContain("false");
    });

    it('click on prev icon of left container calender and verify it is working properly', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup  
        helper.waitUntillClickable(helper.startDatePrevicon_Xpath); //wait for prev buttton is clickable
        element(helper.startDatePrevicon_Xpath).click();
        element(helper.startDatePrevicon_Xpath).click();
        element(helper.startDatePrevicon_Xpath).click(); // Navigate 3 times from Jan 2017 Oct 2016     
        expect(element(helper.startDateHeader_Xpath).getText()).toContain("October 2016");
        browser.compareScreen(element(By.id('daterangepicker_popup')), 'Check_TitileAfterPrevNav');
    });

    it('click on next icon of left container calender and verify it is working properly', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup  
        helper.waitUntillClickable(helper.startDatePrevicon_Xpath); //wait for prev buttton is clickable
        element(helper.startDatePrevicon_Xpath).click();
        element(helper.startDatePrevicon_Xpath).click();
        element(helper.startDatePrevicon_Xpath).click();
        element(helper.startDateNexticon_Xpath).click(); // Navigate 3 times left and 1 time right from Jan 2017 Nov 2016     
        expect(element(helper.startDateHeader_Xpath).getText()).toContain("November 2016");
        browser.compareScreen(element(By.id('daterangepicker_popup')), 'Check_TitileAfterNextNav');
    });

    it('click on prev icon of Right container calender and verify it is working properly', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup  
        helper.waitUntillClickable(helper.endDatePrevicon_Xpath); //wait for prev nav buttton is clickable
        element(helper.endDateNexticon_Xpath).click();
        element(helper.endDateNexticon_Xpath).click();
        element(helper.endDateNexticon_Xpath).click();
        element(helper.endDatePrevicon_Xpath).click(); // Navigate 3 times left and 1 time right from Jan 2017 Nov 2016         
        expect(element(helper.endDateHeader_Xpath).getText()).toContain("April 2017");
        browser.compareScreen(element(By.id('daterangepicker_popup')), 'Check_TitileAfterPrevNav_EndDate');
    });

    it('click on next icon of Right container calender and verify it is working properly', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup  
        helper.waitUntillClickable(helper.endDatePrevicon_Xpath); //wait for next nav buttton is clickable
        element(helper.endDateNexticon_Xpath).click();          // Navigate 2 times from Jan 2017 Oct 2016 
        expect(element(helper.endDateHeader_Xpath).getText()).toContain("March 2017");
        browser.compareScreen(element(By.id('daterangepicker_popup')), 'Check_TitileAfterNextNav_EndDate');
    });

    it('Select range inside popup', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.selectRange("Wednesday, January 11, 2017", "Sunday, January 15, 2017"); //set a date in visible range in popup
        helper.waitUntillClickable(helper.applyButton_Xpath);
        element(helper.applyButton_Xpath).click();
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.waitUntillClickable(helper.cancelButton_Xpath); //check for cancel buttton is present and then proceed to take screenshot
        browser.compareScreen(element(By.id('daterangepicker_popup')), 'setRange_InsidePopup');
    });

    it('Select startDate and Navigate months on EndDate calender and Select inside popup', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.selectStartRange("Wednesday, January 11, 2017");
        element(helper.endDateNexticon_Xpath).click();
        element(helper.endDateNexticon_Xpath).click(); //Navigate to April 
        helper.selectEndRange("Saturday, April 1, 2017"); //set a date in visible range in popup
        helper.waitUntillClickable(helper.applyButton_Xpath);
        element(helper.applyButton_Xpath).click();
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.waitUntillClickable(helper.cancelButton_Xpath); //check for cancel buttton is present and then proceed to take screenshot
        browser.compareScreen(element(By.id('daterangepicker_popup')), 'setRangebyNav_InsidePopup');
    });

    it('Check inBetween ranges are selected from start to endate', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.selectStartRange("Wednesday, January 11, 2017");
        element(helper.endDateNexticon_Xpath).click();
        element(helper.endDateNexticon_Xpath).click(); //Navigate to April 
        helper.selectEndRange("Saturday, April 1, 2017"); //set a date in visible range in popup
        element(helper.endDatePrevicon_Xpath).click();
        helper.waitUntillClickable(helper.applyButton_Xpath);
        browser.compareScreen(element(By.id('daterangepicker_popup')), 'BetweenRangebyNav_1');
        element(helper.endDatePrevicon_Xpath).click();
        helper.waitUntillClickable(helper.applyButton_Xpath);
        browser.compareScreen(element(By.id('daterangepicker_popup')), 'BetweenRangebyNav_2');
    });

    it('Check Start Date Next Nav is Enabled after selecting endate and navigate next in EndDate Picker', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.selectRange("Wednesday, January 11, 2017", "Sunday, January 15, 2017"); //set a date in visible range in popup
        element(helper.endDateNexticon_Xpath).click();
        expect(element(helper.startDateNexticon_Xpath).getAttribute("aria-disabled")).toContain("false");
        helper.waitUntillClickable(helper.applyButton_Xpath);
        browser.compareScreen(element(By.id('daterangepicker_popup')), 'Check_Nextnav_Onranges');
    });

    it('Select Range in Popup and Cancel:Then Validate previous set range is maintained in popup', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.selectRange("Wednesday, January 11, 2017", "Sunday, January 15, 2017"); //set a date in visible range in popup
        helper.waitUntillClickable(helper.cancelButton_Xpath); //check for cancel buttton is present and then proceed to click
        element(helper.cancelButton_Xpath).click();
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.waitUntillClickable(helper.applyButton_Xpath);
        browser.compareScreen(element(By.id('daterangepicker_popup')), 'CancelDateRange_afterselection');
    });

    it('Select startDate and validate startdate label for correct date selection', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.selectStartRange("Wednesday, January 11, 2017");
        expect(element(helper.startDateLabel_ClassName).getText()).toContain("Jan 11, 2017");
        browser.compareScreen(element(By.className('e-range-header')), 'Startdate_Label');
    });

    it('Select startDate and validate enddate label for correct date selection', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.selectStartRange("Wednesday, January 11, 2017");
        expect(element(helper.endDateLabel_ClassName).getText()).toContain("End Date");
    });

    it('Select endDate and validate enddate label for correct date selection', function () {
        helper.inputRange(helper.inputBox_Id, "1/5/2017 - 2/8/2017"); //set a range in input box since current date been maintained 
        helper.openPopUp(); // Opens the daterange picekr popup
        helper.selectRange("Wednesday, January 11, 2017", "Sunday, January 15, 2017"); //set a date in visible range in popup
        expect(element(helper.endDateLabel_ClassName).getText()).toContain("Jan 15, 2017");
        browser.compareScreen(element(By.className('e-range-header')), 'StartEnddate_Label');
    });
});