import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { Helper } from "./Helper/DatePickerHelper";

var helper: Helper = new Helper();
describe('DatePicker', function () {
    var datePickerElement = element(By.className('e-popup-wrapper')).all(By.tagName('td'));

    it('Navigation prev and next in Calendar control', function () {
        browser.load('/demos/datepicker/default.html');
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Default');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Navigate_Default');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("June");
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Navigate_NextMonth');
        element(helper.prevDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("May");
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Navigate_PreviousMonth');
    });

    it('Navigation through title in Calendar control', function () {
        browser.load('/demos/datepicker/default.html');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Navigate_MonthTitle');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Navigate_MonthTitle_Next');
        element(helper.prevDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Navigate_MonthTitle_Previous');
    });

    it('Navigation through Year title in Calendar control', function () {
        browser.load('/demos/datepicker/default.html');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Navigate_YearTitle');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Navigate_YearTitle_Next');
        element(helper.prevDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Navigate_YearTitle_Previous');
    });

    it('Navigation through Year Title and Month in Calendar control', function () {
        browser.load('/demos/datepicker/default.html');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        datePickerElement.get(6).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Navigate_Year');
        datePickerElement.get(7).click();
        helper.waitForNavigation_NextPrev("Aug");
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Navigate_Month');
    });

//     // This Test Case been commented since Mouse and Keybard Actions were not working in Firefox Web Browser

//     it('Themes in DatePicker control', function () {
//         browser.load('/demos/datepicker/placeholder.html');        
//         browser.actions().mouseMove(element(By.className('e-float-line'))).perform();
//         browser.compareScreen(element(By.tagName('body')), 'DatePicker_Hover_FloatLine');        
//         browser.actions().mouseDown(element(By.id('datePicker'))).perform();
//         browser.sleep(5000);
//         browser.compareScreen(element(By.tagName('body')), 'DatePicker_Focus');
//         element(helper.pickerIcon_Classname).click();   
//         browser.sleep(4000);               
//         browser.actions().mouseMove(datePickerElement.get(2)).perform();
//         browser.compareScreen(element(By.tagName('body')), 'DatePicker_Hover_NextDate');
//         element(helper.title_ClassName).click();        
//         browser.actions().mouseMove(datePickerElement.get(5)).perform();
//         browser.compareScreen(element(By.tagName('body')), 'DatePicker_Hover_NextMonth');
//         element(helper.title_ClassName).click();       
//         browser.actions().mouseMove(datePickerElement.get(6)).perform();
//         browser.compareScreen(element(By.tagName('body')), 'DatePicker_Hover_NextYear');
//    });

    it('Place holder in DatePicker control', function () {
        browser.load('/demos/datepicker/placeholder.html');
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_PlaceHolder_Default');  
        browser.actions().mouseDown(element(By.id('datePicker'))).perform();
        browser.sleep(5000);
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_PlaceHolder_Focus');  
    });


    it('Disabled dates in DatePicker control', function () {
        browser.load('/demos/datepicker/disabled.html');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_DisableDate_Default');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("June");
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_DisableDate_NextMonth');
    });

    it('Displaying first day of week in DatePicker control', function () {
        browser.load('/demos/datepicker/firstDayOfWeek.html');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_FirstDay_Default');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("June");
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_FirstDay_NextMonth');
    });

    it('Displaying week number in DatePicker control', function () {
        browser.load('/demos/datepicker/weekNumber.html');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_WeekNumber');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("June");
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_WeekNumber_NextMonth');
    });

    it('Disable DatePicker control', function () {
        browser.load('/demos/datepicker/enabled.html');
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Disable_Default');
    });

    it('Setting Width in DatePicker control', function () {
        browser.load('/demos/datepicker/width.html');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Width_Default');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("June");
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Width_NextMonth');
    });

    it('Setting miniumum and maximum value in DatePicker control', function () {
        browser.load('/demos/datepicker/range.html');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_MinMax_Default');
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_MinMax_Month');
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_MinMax_Year');
    });

    it('Navigation prev and next in DatePicker RTL control', function () {
        browser.load('/demos/datepicker/rtl.html');
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_Default');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_PopUp');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("June");
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_NextMonth');
        element(helper.prevDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("May");
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_PreviousMonth');
    });

    it('Navigation through title in DatePicker RTL control', function () {
        browser.load('/demos/datepicker/rtl.html');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_MonthTitle');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_MonthTitle_Next');
        element(helper.prevDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_MonthTitle_Previous');
    });

    it('Navigation through Year title in DatePicker RTL control', function () {
        browser.load('/demos/datepicker/rtl.html');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_YearTitle');
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_YearTitle_Next');
        element(helper.prevDateIcon_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_YearTitle_Previous');
    });

    it('Navigation through Year Title and Month in DatePicker RTL control', function () {
        browser.load('/demos/datepicker/rtl.html');
        element(helper.pickerIcon_Classname).click();
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        element(helper.title_ClassName).click();
        helper.waitForNavigation_MonatandYear();
        datePickerElement.get(6).click();
        helper.waitForNavigation_MonatandYear();
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_Year');
        datePickerElement.get(7).click();
        helper.waitForNavigation_NextPrev("Aug");
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_Month');
    });

    it('Setting week number and first day of week with RTL mode in DatePicker control', function () {
        browser.load('/demos/datepicker/rtl_weekNumber.html');
        element(helper.pickerIcon_Classname).click();     
         helper.waitUntillClickable(helper.nextDateIcon_ClassName);                        
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_WeekNumber_Default');  
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("June");        
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_RTL_WeekNumber_NextMonth');
    });

    it('Date format change in DatePicker control', function () {
        browser.load('/demos/datepicker/format.html');
        element(helper.pickerIcon_Classname).click();     
         helper.waitUntillClickable(helper.nextDateIcon_ClassName);                       
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Format_Default');  
        datePickerElement.get(2).click();
        helper.waitUntillinvisibilityOf(By.className("e-calendar"));       
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Format_NextDate'); 
    });

     it('Special Dates in DatePicker control', function () {
        browser.load('/demos/datepicker/special.html');
        element(helper.pickerIcon_Classname).click();       
         helper.waitUntillClickable(helper.nextDateIcon_ClassName);                      
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Special_Default');  
        element(helper.nextDateIcon_ClassName).click();
        helper.waitForNavigation_NextPrev("June");        
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Special_NextDate'); 
    });
    
    it('Localization in DatePicker control', function () {
        browser.load('/demos/datepicker/internationalization.html');
        element(helper.pickerIcon_Classname).click();   
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);                  
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_German');
        element(helper.nextDateIcon_ClassName).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_German_NextMonth');
        element(helper.prevDateIcon_ClassName).click();
        browser.sleep(2000);        
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_German_PreviousMonth');
        element(helper.title_ClassName).click();
        browser.sleep(2000);        
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_German_MonthTitle');
        element(helper.title_ClassName).click();
        browser.sleep(2000);        
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_German_YearTitle');
        browser.sleep(2000);
        var property = element(by.id('cultures'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[0].click();
        });
        element(helper.pickerIcon_Classname).click();   
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);                  
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_Default');
        element(helper.nextDateIcon_ClassName).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_NextMonth');
        element(helper.prevDateIcon_ClassName).click();
        browser.sleep(2000);        
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_PreviousMonth');
        element(helper.title_ClassName).click();
        browser.sleep(2000);        
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_MonthTitle');
        element(helper.title_ClassName).click();
        browser.sleep(2000);        
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_YearTitle');
        browser.sleep(2000);
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        element(helper.pickerIcon_Classname).click();   
        helper.waitUntillClickable(helper.nextDateIcon_ClassName);                  
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_Chinese');
        element(helper.nextDateIcon_ClassName).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_Chinese_NextMonth');
        element(helper.prevDateIcon_ClassName).click();
        browser.sleep(2000);        
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_Chinese_PreviousMonth');
        element(helper.title_ClassName).click();
        browser.sleep(2000);        
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_Chinese_MonthTitle');
        element(helper.title_ClassName).click();
        browser.sleep(2000);        
        browser.compareScreen(element(By.className('content-wrapper')), 'DatePicker_Locale_Chinese_YearTitle');
    });
});