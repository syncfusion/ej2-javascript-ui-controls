import { browser, element, By, by, protractor } from "@syncfusion/ej2-base/e2e/index";
import { Helper } from "./Helper/CalendarHelper";
import { Property, queryParams } from "@syncfusion/ej2-base";

var helper: Helper = new Helper();
describe('Calendar', function () {
    var calendarElement = element(By.id('calendar')).all(By.tagName('td'));
    it('Navigation prev and next in Calendar control', function () {
        browser.load('/demos/calendar/default.html');
        browser.compareScreen(element(By.className('content-wrapper')), 'Calendar_Navigate_Default');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("June");
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Navigate_NextMonth');
        element(helper.prevDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("May");
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Navigate_PreviousMonth');
   });

    it('Navigation through title in Calendar control', function () {
        browser.load('/demos/calendar/default.html');
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Navigate_MonthTitle');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Navigate_MonthTitle_Next');
        element(helper.prevDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Navigate_MonthTitle_Previous');
    });

    it('Navigation through Year title in Calendar control', function () {
        browser.load('/demos/calendar/default.html');
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Navigate_YearTitle');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Navigate_YearTitle_Next');
        element(helper.prevDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Navigate_YearTitle_Previous');
    });

    it('Navigation through Year Title and Month in Calendar control', function () {
        browser.load('/demos/calendar/default.html');
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        calendarElement.get(6).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Navigate_Year');
        calendarElement.get(7).click();
        helper.waitForNavigation_NextPrev("Aug");
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Navigate_Month');
    });

    it('Themes in Calendar control', function () {
        browser.load('/demos/calendar/default.html');
        browser.actions().mouseMove(calendarElement.get(2)).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Hover_NextDate');
        calendarElement.get(2).click();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Selected_Date');
        browser.actions().mouseMove(element(helper.title_ClassName)).perform();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Hover_MonthTitle');
        browser.actions().mouseMove(element(helper.nextDateIcon_ClassName)).perform();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Hover_NextMonth');
        browser.actions().mouseMove(element(helper.prevDateIcon_ClassName)).perform();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Hover_PreviousMonth');
        element(helper.title_ClassName).click();
        browser.actions().mouseMove(element(helper.title_ClassName)).perform();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Hover_YearTitle');
        browser.actions().mouseMove(calendarElement.get(5)).perform();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Hover_YearTitle_NextYear');
        element(helper.title_ClassName).click();
        browser.actions().mouseMove(element(helper.title_ClassName)).perform();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Hover_DecadeTitle');
        browser.actions().mouseMove(calendarElement.get(6)).perform();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Hover_DecadeTitle_NextDecade');
    });

    it('Disabled dates in Calendar control', function () {
        browser.load('/demos/calendar/disabled.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Disable');
    });

    it('Calendar-RTL Navigation prev and next in Calendar control', function () {
        browser.load('/demos/calendar/rtl.html');
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_Default');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("June");
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_NextMonth');
        element(helper.prevDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("May");
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_PreviousMonth');
    });

    it('Calendar-RTL Navigation through title in Calendar control', function () {
        browser.load('/demos/calendar/rtl.html');
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_MonthTitle');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_MonthTitle_Next');
        element(helper.prevDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_MonthTitle_Previous');
    });

    it('Calendar-RTL Navigation through Year title in Calendar control', function () {
        browser.load('/demos/calendar/rtl.html');
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_YearTitle');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_YearTitle_Next');
        element(helper.prevDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_YearTitle_Previous');
    });

    it('Calendar-RTL Navigation through Year Title and Month in Calendar control', function () {
        browser.load('/demos/calendar/rtl.html');
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        calendarElement.get(6).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_Year');
        calendarElement.get(7).click();
        helper.waitForNavigation_NextPrev("Aug");
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_Month');
    });

    it('Setting week number and first day of week with RTL mode in Calendar control', function () {
        browser.load('/demos/calendar/rtl_weekNumber.html');
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_WeekNumber_Default');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("June");
        browser.compareScreen(element(By.id('calendar')), 'Calendar_RTL_WeekNumber_NextMonth');
    });

    it('Displaying first day of week in Calendar control', function () {
        browser.load('/demos/calendar/firstDayOfWeek.html');
        helper.waitForNavigation_NextPrev("May");
        browser.compareScreen(element(By.id('calendar')), 'Calendar_FirstDay_Default');
    });

	
    it('Displaying week number in Calendar control', function () {
        browser.load('/demos/calendar/weekNumber.html');
        browser.compareScreen(element(By.id('calendar')), 'Calendar_weekNumber_Default');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("June");
        browser.compareScreen(element(By.id('calendar')), 'Calendar_weekNumber_NextMonth');
    });
    it('Setting miniumum and maximum value in Calendar control', function () {
        browser.load('/demos/calendar/range.html');
        browser.executeScript(function(){
            let inputs = document.getElementsByClassName('e-start');
            (<HTMLElement>inputs[0]).click();
            (<HTMLElement>inputs[1]).click();
        }).then(function(){
            browser.compareScreen(element(by.id('range')), 'Calendar_MinMax_value_left');
        });
        browser.compareScreen(element(By.id('startday')), 'Calendar_MinMax_Default_left');
        browser.compareScreen(element(By.id('endday')), 'Calendar_MinMax_Default_right');
        element.all(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.id('startday')), 'Calendar_MinMax_Month_left');
        browser.compareScreen(element(By.id('endday')), 'Calendar_MinMax_Month_right');      
    });

    it('Localization in Calendar control', function () {
        browser.load('/demos/calendar/internationalization.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Locale_germann');
        element(helper.nextDateIcon_ClassName).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Locale_NextMonth');
        element(helper.prevDateIcon_ClassName).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Locale_PreviousMonth');
        element(helper.title_ClassName).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Locale_MonthTitle');
        element(helper.title_ClassName).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Locale_YearTitle');
        browser.sleep(2000);
        var property = element(by.id('cultures'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[0].click();
        });
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Locale_Default');
        browser.sleep(2000);
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id('calendar')), 'Calendar_Locale_chinese');
    });

    it('Clear button for Calendar component', function(){
        browser.load('/demos/calendar/clearButton.html');
        element(helper.footer_ClassName).click();
        expect(element(By.xpath("//*[contains(@class,'e-today')]/span")).getText()).toContain(browser.executeScript("a=new Date();"+"return a.getDate();"));
        browser.compareScreen(element(By.className('content-wrapper')), 'Calendar_today');
        browser.sleep(2000);
        browser.actions().click(element(By.className('e-clear'))).perform()
        browser.compareScreen(element(By.className('content-wrapper')), 'Calendar_clear');
    });
})