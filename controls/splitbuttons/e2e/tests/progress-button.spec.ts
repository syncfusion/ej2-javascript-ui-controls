import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

/**
 * ProgressButton E2E
 */

describe('Progress Button', function () {
    it('Spin Button', () => {
        browser.load('/demos/progress-button/spinner/index.html');
        browser.compareScreen(element(By.className('frame')), 'spin_button');
    });

    it('Progress Button', () => {
        browser.load('/demos/progress-button/progress/index.html');
        browser.compareScreen(element(By.className('frame')), 'progress_button');
    });
});