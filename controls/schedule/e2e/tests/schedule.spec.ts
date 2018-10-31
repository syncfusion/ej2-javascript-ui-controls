import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';
import { Helper } from './Helper/helper.spec';
let helper = new Helper();


/**
 * E2E Spec for Schedule
 */

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1100, 700);

}
describe('Default', () => {
    it('schedule', () => {
        helper.loadAndWait('/demos/schedule/default.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'default-schedule');
    });
    it('day view', () => {
        helper.loadAndWait('/demos/schedule/default.html', helper.day, 3000);
        browser.actions().click(element(helper.day)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'day-view');
        });
    });
    it('week view', () => {
        helper.loadAndWait('/demos/schedule/default.html', helper.week);
        browser.actions().click(element(helper.week)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'week-view');
        });
    });
    it('work-week view', () => {
        helper.loadAndWait('/demos/schedule/default.html', helper.workweek);
        browser.actions().click(element(helper.workweek)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'work-week-view');
        });
    });
    it('month view', () => {
        helper.loadAndWait('/demos/schedule/default.html', helper.month);
        browser.actions().click(element(helper.month)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'month-view');
        });
    });
    it('agenda view', () => {
        helper.loadAndWait('/demos/schedule/default.html', helper.agenda);
        browser.actions().click(element(helper.agenda)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'agenda-view');
        });
    });
    it('month-agenda view', () => {
        helper.loadAndWait('/demos/schedule/default.html', helper.monthAgenda);
        browser.actions().click(element(helper.monthAgenda)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'month-agenda-view');
        });
    });
});

describe('RTL ', () => {
    it('rtl view', () => {
        helper.loadAndWait('/demos/schedule/rtl.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'rtl-view');
    });
    it('day view', () => {
        helper.loadAndWait('/demos/schedule/rtl.html', helper.day);
        browser.actions().click(element(helper.day)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'rtl-day');
        });
    });
    it('week view', () => {
        helper.loadAndWait('/demos/schedule/rtl.html', helper.week);
        browser.actions().click(element(helper.week)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'rtl-week');
        });
    });
    it('work-week view', () => {
        helper.loadAndWait('/demos/schedule/rtl.html', helper.workweek);
        browser.actions().click(element(helper.workweek)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'rtl-work-week');
        });
    });
    it('month view', () => {
        helper.loadAndWait('/demos/schedule/rtl.html', helper.month);
        browser.actions().click(element(helper.month)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'rtl-month');
        });
    });
    it('agenda view', () => {
        helper.loadAndWait('/demos/schedule/rtl.html', helper.agenda);
        browser.actions().click(element(helper.agenda)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'rtl-agenda');
        });
    });
});

describe('month agenda rtl  ', () => {
    it('month-agenda view', () => {
        helper.loadAndWait('/demos/schedule/month-agenda-rtl.html', helper.monthAgenda);
        browser.compareScreen(element(helper.schedule), 'rtl-month-agenda');
    });
});
describe('Customization', () => {
    it('hide weekend', () => {
        helper.loadAndWait('/demos/schedule/hide-weekend.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'hide-weekend');
    });
    it('work days', () => {
        helper.loadAndWait('/demos/schedule/work-days.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'work-days');
    });
    it('day of week view', () => {
        helper.loadAndWait('/demos/schedule/dayofweek.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'day-of-week');
    });
    it('header customization view', () => {
        helper.loadAndWait('/demos/schedule/header-customization.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'header-customization');
    });
    it('start end hour view', () => {
        helper.loadAndWait('/demos/schedule/startend-hours.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'start-end-hour');
    });
    it('work hours view', () => {
        helper.loadAndWait('/demos/schedule/work-hours.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'work-hours');
    });
    it('cell template view', () => {
        helper.loadAndWait('/demos/schedule/cells-template.html', helper.schedule);
        browser.compareScreen(element(By.tagName('BODY')), 'cell-template');
    });
});
describe('Locale', () => {
    it('week', () => {
        helper.loadAndWait('/demos/schedule/locale.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'locale-week');
    });
    it('month', () => {
        helper.loadAndWait('/demos/schedule/locale.html', helper.schedule);
        browser.actions().click(element(helper.month)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'locale-month');
        });
    });
    it('agenda', () => {
        helper.loadAndWait('/demos/schedule/locale.html', helper.schedule);
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element(helper.agenda)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'locale-agenda');
            });
        });
    });
    it('month agenda', () => {
        helper.loadAndWait('/demos/schedule/locale.html', helper.schedule);
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element(helper.monthAgenda)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'locale-month-agenda');
            });
        });
    });
    it('timeline month', () => {
        helper.loadAndWait('/demos/schedule/locale.html', helper.schedule);
        browser.actions().click(element(helper.tMonth)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'locale-timeline-month');
        });
    });
    it('timeline month', () => {
        helper.loadAndWait('/demos/schedule/locale.html', helper.schedule);
        browser.actions().click(element(helper.tWeek)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'locale-timeline-week');
        });
    });
});
describe('popups', () => {
    beforeEach(() => {
        browser.load('/demos/schedule/default.html');
    });
    it('quick popup  view', () => {
        browser.actions().click(element(By.className('e-work-cells'))).perform().then(() => {
            browser.compareScreen(element(By.id('schedule')), 'popup-view');
        });
    });
    //TimeOut spec Core team issue. 
    // it('more popup window ', (done: Function) => {
    //     browser.actions().click(element(By.className('e-work-cells'))).perform().then(() => {
    //         browser.actions().click(element(By.css('.e-quick-popup-wrapper .e-event-details'))).perform().then(() => {
    //             browser.sleep(500);
    //             browser.compareScreen(element(By.id('schedule')), 'popup-more-view');
    //             browser.actions().click(element(By.className('e-event-cancel')));
    //         });
    //     });
    // });
    // it('event window ', (done: Function) => {
    //     browser.actions().click(element(By.className('e-appointment'))).perform().then(() => {
    //         helper.waitUntilPresent(helper.content, 4500);
    //         browser.compareScreen(element(By.id('schedule')), 'popup-event-view');
    //         browser.actions().click(element(By.className('e-tooltip-close')))
    //     });
    // });
    // it('event edit window ', (done: Function) => {
    //     browser.actions().click(element(By.className('e-appointment'))).perform().then(() => {
    //         browser.actions().click(element(By.className('e-event-edit'))).perform().then(() => {
    //             browser.sleep(500);
    //             browser.compareScreen(element(By.id('schedule')), 'popup-edit-view');
    //             browser.actions().click(element(By.className('e-event-cancel')));
    //         });
    //     });
    // });
    // it('delete window ', (done: Function) => {
    //     browser.actions().click(element(By.className('e-appointment'))).perform().then(() => {
    //         browser.actions().click(element(By.css('.e-quick-popup-wrapper .e-event-delete'))).perform().then(() => {
    //             browser.compareScreen(element(By.id('schedule')), 'popup-delete-view');
    //             browser.actions().click(element(By.className('e-quick-dialog-cancel')));
    //         });
    //     });
    // });
});
describe('Timescale', () => {
    it('timescale feature', () => {
        helper.loadAndWait('/demos/schedule/time-scale.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'timescale');
    });
});
describe('Multiple Resources', () => {
    it('day', () => {
        helper.loadAndWait('/demos/schedule/resources/group.html', helper.schedule);
        browser.actions().click(element(helper.day)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'resource-day');
        });
    });
    it('week', () => {
        helper.loadAndWait('/demos/schedule/resources/group.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'resource-week');
    });
    it('workWeek', () => {
        helper.loadAndWait('/demos/schedule/resources/group.html', helper.schedule);
        browser.actions().click(element(helper.workweek)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'resource-work-week');
        });
    });
    it('month', () => {
        helper.loadAndWait('/demos/schedule/resources/group.html', helper.schedule);
        browser.actions().click(element(helper.month)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'resource-month');
        });
    });
    it('agenda', () => {
        helper.loadAndWait('/demos/schedule/resources/group.html', helper.schedule);
        browser.actions().click(element(helper.agenda)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'resource-agenda');
        });
    });
});

describe('Multiple Resource ByDate', () => {
    it('day', () => {
        helper.loadAndWait('/demos/schedule/resources/group-bydate.html', helper.schedule);
        browser.actions().click(element(helper.day)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'by-date-day');
        });
    });
    it('week', () => {
        helper.loadAndWait('/demos/schedule/resources/group-bydate.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'by-date-week');
    });
    it('workWeek', () => {
        helper.loadAndWait('/demos/schedule/resources/group-bydate.html', helper.schedule);
        browser.actions().click(element(helper.workweek)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'by-date-work-week');
        });
    });
    it('month', () => {
        helper.loadAndWait('/demos/schedule/resources/group-bydate.html', helper.schedule);
        browser.actions().click(element(helper.month)).perform().then(() => {
            browser.sleep(600);
            browser.compareScreen(element(helper.schedule), 'by-date-month');
        });
    });
    it('agenda', () => {
        helper.loadAndWait('/demos/schedule/resources/group-bydate.html', helper.schedule);
        browser.actions().click(element(helper.agenda)).perform().then(() => {
            browser.sleep(600);
            browser.compareScreen(element(helper.schedule), 'by-date-agenda');
        });
    });
});

describe('Multiple Custom Resources', () => {
    it('custom grouping month', () => {
        helper.loadAndWait('/demos/schedule/resources/group-custom-work-days.html', helper.schedule);
        browser.actions().click(element(helper.month)).perform().then(() => {
            browser.sleep(600);
            browser.compareScreen(element(helper.schedule), 'custom-resources-month');
        });
    });
});
describe('Multiple Resources ByChild', () => {
    it('day', () => {
        helper.loadAndWait('/demos/schedule/resources/group-bychild.html', helper.schedule);
        browser.actions().click(element(helper.day)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'by-child-day');
        });
    });
    it('week', () => {
        helper.loadAndWait('/demos/schedule/resources/group-bychild.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'by-child-week');
    });
    it('workWeek', () => {
        helper.loadAndWait('/demos/schedule/resources/group-bychild.html', helper.schedule);
        browser.actions().click(element(helper.workweek)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'by-child-work-week');
        });
    });
    it('month', () => {
        helper.loadAndWait('/demos/schedule/resources/group-bychild.html', helper.schedule);
        browser.actions().click(element(helper.month)).perform().then(() => {
            browser.sleep(600);
            browser.compareScreen(element(helper.schedule), 'by-child-month');
        });
    });
    it('agenda', () => {
        helper.loadAndWait('/demos/schedule/resources/group-bychild.html', helper.schedule);
        browser.actions().click(element(helper.agenda)).perform().then(() => {
            browser.sleep(600);
            browser.compareScreen(element(helper.schedule), 'by-child-agenda');
        });
    });
});

describe('resource room color', () => {
    it('room', () => {
        helper.loadAndWait('/demos/schedule/resources/resources.html', helper.schedule);
        browser.compareScreen(element(helper.schedule), 'resources-room-color');
    });
});
describe('resource owner color', () => {
    it('owner', () => {
        helper.loadAndWait('/demos/schedule/resources/resources.html', helper.schedule);
        browser.actions().click(element(helper.button)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'resource-owner-color');
        });
    });
});
describe('Timeline View ', () => {
    it('day', () => {
        browser.load('/demos/schedule/timeline.html');
        browser.actions().click(element(helper.tDay)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-day');
        });
    });
    it('week view', () => {
        browser.load('/demos/schedule/timeline.html');
        browser.actions().click(element(helper.tWeek)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-week');
        });
    });
    it('week view 2 Weeks', () => {
        browser.load('/demos/schedule/timeline.html');
        browser.actions().click(element.all(By.className('e-timeline-week')).get(1)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-two-weeks');
        });
    });
    it('workweek view', () => {
        browser.load('/demos/schedule/timeline.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element(helper.tWorkWeek)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'timeline-work-week');
            });
        });
    });
    it('month view', () => {
        browser.load('/demos/schedule/timeline.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element(helper.tMonth)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'timeline-month');
            });
        });
    });
    it('2 month view', () => {
        browser.load('/demos/schedule/timeline.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element.all(By.className('e-timeline-month')).get(1)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'timeline-two-month');
            });
        });
    });
    it('timeline agenda view', () => {
        browser.load('/demos/schedule/timeline.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element(helper.agenda)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'timeline-agenda');
            });
        });
    });
});

describe('Timeline View Resources', () => {
    it('day', () => {
        browser.load('/demos/schedule/resources/timeline-grouping.html');
        browser.actions().click(element(helper.tDay)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-resource-day');
        });
    });
    it('week ', () => {
        browser.load('/demos/schedule/resources/timeline-grouping.html');
        browser.actions().click(element(helper.tWeek)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-resource-week');
        });
    });
    it('2 Week', () => {
        browser.load('/demos/schedule/resources/timeline-grouping.html');
        browser.actions().click(element.all(By.className('e-timeline-week')).get(1)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-resource-two-week');
        });
    });
    it('work-week ', () => {
        browser.load('/demos/schedule/resources/timeline-grouping.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element(helper.tWorkWeek)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'timeline-resource-work-week');
            });
        });
    });
    it('month view', () => {
        browser.load('/demos/schedule/resources/timeline-grouping.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element(helper.tMonth)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'timeline-resource-month');
            });
        });
    });
    it('2 Months', () => {
        browser.load('/demos/schedule/resources/timeline-grouping.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element.all(By.className('e-timeline-month')).get(1)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'timeline-resource-two-month');
            });
        });
    });
});
describe('Timeline View Resources group by child', () => {
    it('day', () => {
        browser.load('/demos/schedule/resources/timeline-group-bychild.html');
        browser.actions().click(element(helper.tDay)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-bychild-day');
        });
    });
    it('week', () => {
        browser.load('/demos/schedule/resources/timeline-group-bychild.html');
        browser.actions().click(element(helper.tWeek)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-bychild-week');
        });
    });
    it('2Weeks', () => {
        browser.load('/demos/schedule/resources/timeline-group-bychild.html');
        browser.actions().click(element.all(By.className('e-timeline-week')).get(1)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-bychild-two-week');
        });
    });
    it('work-week', () => {
        browser.load('/demos/schedule/resources/timeline-group-bychild.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element(helper.tWorkWeek)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'timeline-bychild-work-week');
            });
        });
    });
    it('month', () => {
        browser.load('/demos/schedule/resources/timeline-group-bychild.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element(helper.tMonth)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'timeline-bychild-month');
            });
        });
    });
    it('2 Months', () => {
        browser.load('/demos/schedule/resources/timeline-group-bychild.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element.all(By.className('e-timeline-month')).get(1)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'timeline-bychild-two-month');
            });
        });
    });
});
describe('Timeline View Resources custom-work-days ', () => {
    it('day', () => {
        browser.load('/demos/schedule/resources/timeline-group-custom-work-days.html');
        browser.actions().click(element(helper.tDay)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-custom-day');
        });
    });
    it('week', () => {
        browser.load('/demos/schedule/resources/timeline-group-custom-work-days.html');
        browser.actions().click(element(helper.tWeek)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-custom-week');
        });
    });
    it('work-week', () => {
        browser.load('/demos/schedule/resources/timeline-group-custom-work-days.html');
        browser.actions().click(element(helper.tWorkWeek)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-custom-work-week');
        });
    });
    it('month', () => {
        browser.load('/demos/schedule/resources/timeline-group-custom-work-days.html');
        browser.actions().click(element(helper.tMonth)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'timeline-custom-month');
        });
    });
});
describe('Timeline View Resources group-editing ', () => {
    it('day', () => {
        browser.load('/demos/schedule/resources/timeline-group-editing.html');
        browser.actions().click(element(helper.tDay)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'group-editing-day');
        });
    });
    it('week', () => {
        browser.load('/demos/schedule/resources/timeline-group-editing.html');
        browser.actions().click(element(helper.tWeek)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'group-editing-week');
        });
    });
    it('2 Weeks', () => {
        browser.load('/demos/schedule/resources/timeline-group-editing.html');
        browser.actions().click(element.all(By.className('e-timeline-week')).get(1)).perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(helper.schedule), 'group-editing-two-week');
        });
    });
    it('work-week', () => {
        browser.load('/demos/schedule/resources/timeline-group-editing.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element(helper.tWorkWeek)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'group-editing-work-week');
            });
        });
    });
    it('month', () => {
        browser.load('/demos/schedule/resources/timeline-group-editing.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element(helper.tMonth)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'group-editing-month');
            });
        });
    });
    it('2 months', () => {
        browser.load('/demos/schedule/resources/timeline-group-editing.html');
        browser.actions().click(element(By.className('e-hor-nav'))).perform().then(() => {
            browser.sleep(500);
            browser.actions().click(element.all(By.className('e-timeline-month')).get(1)).perform().then(() => {
                browser.sleep(500);
                browser.compareScreen(element(helper.schedule), 'group-editing-two-month');
            });
        });
    });
});