/**
 * Helper Spec 
 */
import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

export class Helper {
    public schedule: object = By.id('schedule');
    public button: object = By.id('radio2');
    public content: object = By.className('e-tip-content');
    public day: object = By.className('e-day');
    public month: object = By.className('e-month');
    public week: object = By.className('e-week');
    public workweek: object = By.className('e-work-week');
    public agenda: object = By.className('e-agenda');
    public monthAgenda: object = By.className('e-month-agenda');
    public tDay: object = By.className('e-timeline-day');
    public tWeek: object = By.className('e-timeline-week');
    public tWorkWeek: object = By.className('e-timeline-work-week');
    public tMonth: object = By.className('e-timeline-month');

    public loadAndWait(url: string, ele: any, time: number = 2000) {
        browser.load(url);
        this.waitUntilPresent(ele, time);
    }

    public waitUntilPresent(ele: any, time: number = 2000) {
        browser.wait(
            browser.ExpectedConditions.presenceOf(element(ele)), time
        );
    }
}
