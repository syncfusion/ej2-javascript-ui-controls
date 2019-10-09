import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('RadioButton', () => {
    beforeEach(() => {
        if (browser.isDesktop) {
            browser.driver.manage().window().maximize();
        }
    })
    it('Basic', () => {
        browser.load('/demos/radio-button/default/index.html');
        browser.compareScreen(element(By.id('radio')), 'Radiobtn_basic');
    });

    let themeName: string[] = ['fabric', 'bootstrap', 'highcontrast'];
    for (let i: number = 0; i < themeName.length; i++) {
        let theme: string = themeName[i];
        it('Theme Switching - ' + theme, () => {
            // skipped due to random failures in IE.
            if (browser.browserName !== 'internet explorer') {
                browser.executeScript('document.getElementById("' + theme + '").click()');
                browser.driver.sleep(2000);
                browser.compareScreen(element(By.id('radio')), 'Radiobtn_' + theme);
            }
        });
    }


    it('Label Click', () => {
        browser.executeScript('document.getElementById("material").click()');
        browser.driver.sleep(1000);
        let lblSelector: string = 'input[id = radio4] + label';
        element(By.css(lblSelector)).click().then(() => {
            browser.compareScreen(element(By.id('radio')), 'Radiobtn_click');
        });
    });

    it('Label', () => {
        browser.load('/demos/radio-button/label/index.html');
        browser.compareScreen(element(By.id('radio-label')), 'Radiobtn_label');
    });

    it('Rtl', () => {
        browser.load('/demos/radio-button/rtl/index.html');
        browser.compareScreen(element(By.id('radio-rtl')), 'Radiobtn_rtl');
    });

    it('Size', () => {
        browser.load('/demos/radio-button/size/index.html');
        browser.compareScreen(element(By.id('radio-size')), 'Radiobtn_size');
    });
});
