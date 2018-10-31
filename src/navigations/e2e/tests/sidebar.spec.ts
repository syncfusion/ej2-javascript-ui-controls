
import { browser, element, By, protractor } from '@syncfusion/ej2-base/e2e/index';

describe('Sidebar', () => {
    it(' open test case', () => {
        browser.load('/demos/sidebar/api.html');
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_open');
    });
    
    it(' open test case', () => {
        browser.load('/demos/sidebar/api.html');
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.actions().click(element(By.id('close'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_close');
    });

    it('auto type test case', () => {
        browser.load('/demos/sidebar/api.html');
        var allOptions = element.all(By.options('c'));
        var firstOption = allOptions.last().click();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_auto');
        browser.actions().click(element(By.id('close'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_auto_close');
    });

    it('over type test case', () => {
        browser.load('/demos/sidebar/api.html');
        var allOptions = element.all(By.options('c'));
        var firstOption = allOptions.get(2).click();
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_over');
        browser.actions().click(element(By.id('close'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_over_close');
    });

    it('slide type test case', () => {
        browser.load('/demos/sidebar/api.html');
        var allOptions = element.all(By.options('c'));
        var firstOption = allOptions.get(1).click();
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_slide');
        browser.actions().click(element(By.id('close'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_slide_close');
    });

    it(' right  position test case', () => {
        browser.load('/demos/sidebar/api.html');
        var allOptions = element.all(By.options('pos'));
        var firstOption = allOptions.get(1).click();
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_right');
        browser.actions().click(element(By.id('close'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_right_close');
    });

    it(' left  position test case', () => {
        browser.load('/demos/sidebar/api.html');
        var allOptions = element.all(By.options('pos'));
        var firstOption = allOptions.get(0).click();
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_left');
        browser.actions().click(element(By.id('close'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_left_close');
    });

    it('showbackdrop true test case', () => {
        browser.load('/demos/sidebar/api.html');
        browser.actions().click(element(By.id('backdrop'))).perform();
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_enable_backdrop');
        browser.actions().click(element(By.id('close'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_enable_backdrop_close');
        browser.actions().click(element(By.id('backdrop'))).perform();
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_disable_backdrop');
        browser.actions().click(element(By.id('close'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_disable_backdrop_close');
    });

    it('width test case', () => {
        browser.load('/demos/sidebar/api.html');
        element(By.id('width')).clear();
        element(By.id('width')).sendKeys("100px");
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_width_open');
        browser.actions().click(element(By.id('close'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_width_close');
    });

    it('target test case', () => {
        browser.load('/demos/sidebar/target.html');
        browser.actions().click(element(By.id('toggle'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_target_close');
        browser.actions().click(element(By.id('closebtn'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_target_open');
    });

    it('dock with default enabled test case', () => {
        browser.load('/demos/sidebar/dock-default.html');
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_dock_state')
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_normal_state');
        browser.actions().click(element(By.id('hidebtn'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_close_state');
    });

    it('dock with ondemand test case', () => {
        browser.load('/demos/sidebar/dock-ondemand.html');
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_dockondemand_state')
        browser.actions().click(element(By.id('hidebtn'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_dockondemand_dock_state');
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_dockondemand_normal_state');
    });

    it('enableRtl true test case', () => {
        browser.load('/demos/sidebar/api.html');
        browser.actions().click(element(By.id('rtl'))).perform();
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_enable_rtl');
        browser.actions().click(element(By.id('close'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_enable_rtl_close');
        browser.actions().click(element(By.id('rtl'))).perform();
        browser.actions().click(element(By.id('show'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_disable_rtl');
        browser.actions().click(element(By.id('close'))).perform();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), 'sidebar_disable_rtl_close');
    });
});