
import { browser, element, By, protractor } from "@syncfusion/ej2-base/e2e/index";
import { Helper } from "./Helper/TimePickerHelper";

var helper: Helper = new Helper();
describe('TimePicker', function () {

	it('Rtl in TimePicker control', function () {
		browser.load('/demos/timepicker/rtl.html');
		browser.compareScreen(element(helper.timePickerInputBox_ClassName), 'timepicker-withplaceholder');
		helper.waitUntillClickable(helper.timePickerIcon_ClassName);
		element(helper.timePickerIcon_ClassName).click();
		helper.waitUntillPresent(helper.timePickerPopupOpen_Xpath);
		browser.compareScreen(element(helper.timePickerPopupOpen_Xpath), 'timepicker-rtl');
	});
	
	it('TimePicker control default ', function () {
		browser.load('/demos/timepicker/default.html');
		helper.waitUntillClickable(helper.timePickerIcon_ClassName);
		element(helper.timePickerIcon_ClassName).click();
		browser.sleep(500);
		browser.compareScreen(element(By.className('container')), 'timepicker-normal');
	});

	it('TimePicker control default input time and validate in popup ', function () {
		browser.load('/demos/timepicker/default.html');
		helper.inputTime(helper.timePickerInput_Id,"5:00 AM");
		helper.waitUntillClickable(helper.timePickerIcon_ClassName);
		element(helper.timePickerIcon_ClassName).click();
		helper.waitUntillPresent(helper.timePickerPopupOpen_Xpath);
		browser.compareScreen(element(By.className('container')), 'timepicker-inputTime');
	});

	it('TimePicker control default select time from popup ', function () {
		browser.load('/demos/timepicker/default.html');
		helper.waitUntillClickable(helper.timePickerIcon_ClassName);
		element(helper.timePickerIcon_ClassName).click();
		helper.selectTime_FromPopup("timepicker_popup","2:00 AM");		
		browser.compareScreen(element(By.className('container')), 'timepicker-inputTimePopup');
	});

    //Since mosue and keyboard actions are not working in firfox the below three Test Cases been commented

	// it('TimePicker control default select time from popup using down arrow ', function () {
	// 	browser.load('/demos/timepicker/default.html');	
	// 	helper.waitUntillClickable(helper.timePickerIcon_ClassName);
	// 	element(helper.timePickerIcon_ClassName).click();
	// 	helper.waitUntillPresent(helper.timePickerPopupOpen_Xpath);
	// 	browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();		
	// 	browser.sleep(5000);	
	// 	browser.compareScreen(element(By.className('container')), 'timepicker-arrowdown');
	// });

	// it('TimePicker control default select time from popup using up arrow ', function () {
	// 	browser.load('/demos/timepicker/default.html');	
	// 	helper.waitUntillClickable(helper.timePickerIcon_ClassName);
	// 	element(helper.timePickerIcon_ClassName).click();
	// 	helper.waitUntillPresent(helper.timePickerPopupOpen_Xpath);
	// 	browser.actions().sendKeys(protractor.Key.ARROW_DOWN,protractor.Key.ARROW_DOWN,protractor.Key.ARROW_DOWN,protractor.Key.ARROW_DOWN,protractor.Key.ARROW_UP).perform();		
	// 	browser.sleep(5000);	
	// 	browser.compareScreen(element(By.className('container')), 'timepicker-arrowup');
	// });

	// it('TimePicker control default select time from popup using arrow key with enter ', function () {
	// 	browser.load('/demos/timepicker/default.html');		
	// 	helper.waitUntillClickable(helper.timePickerIcon_ClassName);
	// 	element(helper.timePickerIcon_ClassName).click();
	// 	helper.waitUntillPresent(helper.timePickerPopupOpen_Xpath);
	// 	browser.actions().sendKeys(protractor.Key.ARROW_DOWN,protractor.Key.ARROW_DOWN,protractor.Key.ARROW_DOWN,protractor.Key.ENTER).perform();		
	// 	browser.sleep(5000);	
	// 	browser.compareScreen(element(By.className('container')), 'timepicker-arrowWithenter');
	// });
    
	it('Value in TimePicker control', function () { 
		browser.load('/demos/timepicker/value.html');
		browser.compareScreen(element(By.className('container')), 'timepicker-withvalue');
		browser.sleep(500);
		browser.actions().mouseDown(element(By.id('timepicker'))).perform();
		browser.sleep(500);
		browser.compareScreen(element(By.className('container')), 'timepicker_with-value-focus');
		browser.sleep(500);
		element(By.className('e-input-group-icon')).click();
		browser.sleep(500);
		browser.compareScreen(element(By.className('container')), 'timepicker-with-value-selection');
	});

	it('Minumum and maximum value in TimePicker control', function () {
		browser.load('/demos/timepicker/min_max.html');
		element(By.className('e-input-group-icon')).click();
		browser.sleep(500);
		browser.compareScreen(element(By.className('content-wrapper')), 'timepicker-minmaxvalue');
	});

	it('Step ranges in TimePicker control', function () {
		browser.load('/demos/timepicker/stepranges.html');
		helper.waitUntillClickable(helper.timePickerIcon_ClassName);
		element(helper.timePickerIcon_ClassName).click();
		helper.waitUntillPresent(helper.timePickerPopupOpen_Xpath);
		browser.sleep(500);
		browser.compareScreen(element(By.className('container')), 'timepicker-stepranges');
	});

	it('Strictmode in TimePicker control', function () {
		browser.load('/demos/timepicker/strictmode.html');
		element(By.className('e-input-group-icon')).click();
		browser.sleep(500);
		browser.compareScreen(element(By.className('container')), 'timepicker_strictmode');
	});

	it('Disabled in TimePikcer control', function () {
		browser.load('/demos/timepicker/disabled.html');
		browser.compareScreen(element(By.className('container')), 'timepicker_Disabled');
	});

	it('Format in TimePicker control', function () {
		browser.load('/demos/timepicker/format.html');		
		helper.waitUntillClickable(helper.timePickerIcon_ClassName);
	 	element(helper.timePickerIcon_ClassName).click();
	 	helper.waitUntillPresent(helper.timePickerPopupOpen_Xpath);
		browser.compareScreen(element(By.className('container')), 'timepicker_format');
	});
})