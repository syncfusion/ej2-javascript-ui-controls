/**
 * connector spec
 */
import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';
describe('Diagram Control', () => {
    describe('Padding Top - Left', () => {
        it('Rendering', () => {
            browser.load('/demos/scroll-padding/padding-top-left');
        });
        it('Interaction -(default connector)', () => {
            browser.load('/demos/scroll-padding/padding-top-left.html');
            browser.compareScreen(element(By.id('diagram')), 'padding-top-left');
        });
    });
    describe('Padding Right - Bottom', () => {
        it('Rendering', () => {
            browser.load('/demos/scroll-padding/padding-right-bottom');
        });
        it('Interaction -(default connector)', () => {
            browser.load('/demos/scroll-padding/padding-right-bottom.html');
            browser.compareScreen(element(By.id('diagram')), 'padding-right-bottom');
        });
    });
});