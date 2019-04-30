import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('Checkbox', () => {
    beforeEach(() =>{
        if(browser.isDesktop === true){
            browser.driver.manage().window().setSize(1100, 800);
        }
    })
    it('Basic', () => {
        browser.load('/demos/check-box/default/index.html');
        browser.compareScreen(element(By.id('basic')), 'Checkbox_basic');
    });

    let themeName: string[] = ['fabric', 'bootstrap', 'highcontrast'];

    for (let i: number = 0; i < themeName.length; i++) {
        let theme: string = themeName[i];
        it('Theme Switching - ' + theme, () => {
            browser.executeScript('document.getElementById("' + theme + '").click()');
            browser.driver.sleep(2000);
            browser.compareScreen(element(By.id('basic')), 'Checkbox_' + theme);
        });
    }

    it('Label', () => {
        browser.load('/demos/check-box/label/index.html');
        //Check
        element(By.id('checkbox2')).click().then(() =>{
            browser.compareScreen(element(By.id('label')), 'Checkbox_checked');
        });
        //Uncheck
        element(By.id('checkbox2')).click().then(() =>{
            browser.compareScreen(element(By.id('label')), 'Checkbox_unchecked');
        });
    });

    it('RTL', () => {
        browser.load('/demos/check-box/rtl/index.html');
        element(By.id('checkbox2')).click().then(() =>{
            browser.driver.sleep(1000);
            browser.compareScreen(element(By.id('rtl')), 'Checkbox_rtl');
        });
    });

    it('Size', () => {
        browser.load('/demos/check-box/size/index.html');
        browser.compareScreen(element(By.id('size')), 'CheckBox_size');
    });

    it('State', () => {
        browser.load('/demos/check-box/state/index.html');
        browser.compareScreen(element(By.id('state')), 'Checkbox_state');
    });
});
