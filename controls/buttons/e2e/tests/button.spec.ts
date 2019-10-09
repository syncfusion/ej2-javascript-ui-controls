import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('Button', function () {
    it('Basic', function () {
        browser.load('/demos/button/basic-button/default.html');
        browser.driver.sleep(1000);
        browser.compareScreen(element(By.id('basic-button')), 'Btn_basic');
    });

    let themeName: string[] = ['fabric', 'bootstrap', 'highcontrast'];

    for (let i: number = 0; i < themeName.length; i++) {
        let theme: string = themeName[i];
        it('Theme Switching - ' + theme, () => {
            browser.executeScript('document.getElementById("' + theme + '").click()');
            browser.driver.sleep(1000);
            browser.compareScreen(element(By.id('basic-button')), 'Btn_' + theme);
        });
    }

    it('Hover and Click', function () {
        browser.executeScript('document.getElementById("material").click()');
        browser.driver.sleep(1000);
        //Button Hover
        let btnElem = browser.element({ id: 'normal1' });
        browser.actions().mouseMove(btnElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element(By.id('normal1')), 'Btn_hover');
        });

        //Button Click
        browser.actions().click(btnElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element(By.id('normal1')), 'Btn_click');
        });
    });

    it('Toggle', function () {
        // Toggle Button active
        browser.element({ id: 'toggle2' }).click().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element(By.id('toggle2')), 'Btn_toggle_active');
        });

        // Toggle Button focus
        browser.element({ id: 'toggle2' }).click().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element(By.id('toggle2')), 'Btn_toggle_focus');
        });

        // Flat toggle button active
        browser.element({ id: 'toggle3' }).click().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element(By.id('toggle3')), 'Btn_flat_toggle_active');
        });

        // Flat toggle button focus
        browser.element({ id: 'toggle3' }).click().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element(By.id('toggle3')), 'Btn_flat_toggle_focus');
        })
    });

    it('Primary Hover and Click', function () {
        // Outline primary button hover
        let btnElem = browser.element({ id: 'outline3' });
        browser.actions().mouseMove(btnElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element(By.id('outline3')), 'Btn_outline_hover');
        });

        //Outline primary button click
        browser.actions().click(btnElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element(By.id('outline3')), 'Btn_outline_click');
        });
    });

    it('Icon', function () {
        browser.load('/demos/button/icon-button/default.html');
        browser.driver.sleep(500);
        browser.compareScreen(element(By.id('icon-button')), 'Btn_icon');
    });

    it('Type', function () {
        browser.load('/demos/button/type/type.html');
        browser.driver.sleep(500);
        browser.compareScreen(element(By.id('type')), 'Btn_type');
    });

    it('Size', function () {
        browser.load('/demos/button/size/size.html');
        browser.driver.sleep(500);
        browser.compareScreen(element(By.id('size')), 'Btn_size');
        //Bigger button click
        browser.element({ id: 'button3' }).click().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element(By.id('button3')), 'Btn_bigger_click');
        });
    });

    it('Style', function () {
        browser.load('/demos/button/style/style.html');
        browser.driver.sleep(500);
        browser.compareScreen(element(By.id('style')), 'Btn_style');
        //Primary Button
        browser.element({ id: 'button1' }).click().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element(By.id('button1')), 'Btn_primary_click');
        });
    });
});
