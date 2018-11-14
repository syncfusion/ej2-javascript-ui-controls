import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';
import { Helper } from './Helper/splitbuttons-helper.spec';
import { ActionSequence } from 'protractor';

/**
 * ButtonGroup Spec document
 */

let helper: Helper = new Helper();

describe('ButtonGroup', function () {
    it ('Default ButtonGroup', () => {
        browser.load('/demos/button-group/default.html');
        browser.compareScreen(element(helper.btngroup), 'btn_group_default');
    });

    let themeName: string[] = ['fabric', 'bootstrap', 'highcontrast'];

    for (let i: number = 0; i < 3; i++) {
        theme_change(themeName[i], element(helper.btngroup) , 'default');
    }

    function theme_change(theme: string, selector: Object, name: string): void {
        it('Theme Switching - ' + theme, () => {
            browser.executeScript('document.getElementById("' + theme + '").click()');
            browser.driver.sleep(1000);
            browser.compareScreen(selector, 'Btn_group_'+ name +'_'+ theme);
        });
    }

    it ('Outline ButtonGroup', () => {
        browser.load('/demos/button-group/outline.html');
        browser.compareScreen(element(helper.btngroup), 'btn_group_outline');
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change(themeName[i], element(helper.btngroup), 'outline');
    }

    it ('Vertical ButtonGroup', () => {
        browser.load('/demos/button-group/vertical.html');
        browser.compareScreen(element(helper.btngroup), 'btn_group_vertical');
    });
    for (let i: number = 0; i < 3; i++) {
        theme_change(themeName[i], element(helper.btngroup), 'vertical');
    }
   it ('Vertical Outline ButtonGroup', () => {
        browser.load('/demos/button-group/vertical-outline.html');
        browser.compareScreen(element(helper.btngroup), 'btn_group_vertical-outline');
    });
    for (let i: number = 0; i < 3; i++) {
        theme_change(themeName[i], element(helper.btngroup),  'vertical_outline');
    }

    it ('Disable a ButtonGroup', () => {
        browser.load('/demos/button-group/util/util.html');
        browser.compareScreen(element.all(helper.table).get(2), 'btn_group_disable');
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change(themeName[i], element.all(helper.table).get(2),  'disable');
    }

    it ('Rounded Corner ButtonGroup', () => {
        browser.load('/demos/button-group/util.html');
        browser.compareScreen(element.all(helper.table).get(4), 'btn_group_round_corner');
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change(themeName[i], element.all(helper.table).get(4), 'round_corner');
    }

    it('Outline ButtonGroup - Click', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(0);
        browser.actions().click(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(0), 'Btn_group_click_default');
        });
    });

    function theme_change_states(theme: string, selector: Object, index: number, name: string): void { 
        it('Theme Switching - ' + theme, () => {
            browser.executeScript('document.getElementById("' + theme + '").click()');
            let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(index);
            browser.actions().click(btnGroupElem).perform().then(() => {
                browser.driver.sleep(1000);
                browser.compareScreen(selector, 'Btn_group_click_'+ name +'_'+ theme);
            });
        });
    }

    for (let i: number = 0; i < 3; i++) {
        theme_change_states(themeName[i], element.all(helper.table).get(0), 0, 'default');
    }

    it('Outline ButtonGroup Primary - Click', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(3);
        browser.actions().click(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(3), 'Btn_group_click_primary');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_states(themeName[i], element.all(helper.table).get(3), 3, 'primary');
    }

    it('Outline ButtonGroup Success - Click', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(6);
        browser.actions().click(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(6), 'Btn_group_click_success');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_states(themeName[i], element.all(helper.table).get(6), 6, 'success');
    }

    it('Outline ButtonGroup Info - Click', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(9);
        browser.actions().click(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(9), 'Btn_group_click_info');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_states(themeName[i], element.all(helper.table).get(9), 9, 'info');
    }

    it('Outline ButtonGroup Warning - Click', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(12);
        browser.actions().click(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(12), 'Btn_group_click_warning');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_states(themeName[i], element.all(helper.table).get(12), 12, 'warning');
    }

    it('Outline ButtonGroup Danger - Click', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(15);
        browser.actions().click(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(15), 'Btn_group_click_danger');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_states(themeName[i], element.all(helper.table).get(15), 15, 'danger');
    }

    it('Outline ButtonGroup - Hover', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(0);
        browser.actions().mouseMove(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(0), 'Btn_group_hover_default');
        });
    });

    function theme_change_hover(theme: string, selector: Object, index: number, name: string): void { 
        it('Theme Switching - ' + theme, () => {
            browser.executeScript('document.getElementById("' + theme + '").click()');
            browser.driver.sleep(1000);
            let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(index);
            browser.actions().mouseMove(btnGroupElem).perform().then(() => {
                browser.driver.sleep(1000);
                browser.compareScreen(selector, 'Btn_group_hover_'+ name +'_'+ theme);
            });
        });
    }

    for (let i: number = 0; i < 3; i++) {
        theme_change_hover(themeName[i], element.all(helper.table).get(0), 0, 'default');
    }

    it('Outline ButtonGroup Primary - Hover', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(3);
        browser.actions().mouseMove(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(3), 'Btn_group_hover_primary');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_hover(themeName[i], element.all(helper.table).get(3), 3, 'primary');
    }

    it('Outline ButtonGroup Success - Hover', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(6);
        browser.actions().mouseMove(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(6), 'Btn_group_hover_success');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_hover(themeName[i], element.all(helper.table).get(6), 6, 'success');
    }

    it('Outline ButtonGroup Info - Hover', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(9);
        browser.actions().mouseMove(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(9), 'Btn_group_hover_info');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_hover(themeName[i], element.all(helper.table).get(9), 9, 'info');
    }

    it('Outline ButtonGroup Warning - Hover', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(12);
        browser.actions().mouseMove(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(12), 'Btn_group_hover_warning');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_hover(themeName[i], element.all(helper.table).get(12), 12, 'warning');
    }

    it('Outline ButtonGroup Danger - Hover', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(15);
        browser.actions().mouseMove(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(15), 'Btn_group_hover_danger');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_hover(themeName[i], element.all(helper.table).get(15), 15, 'danger');
    }

    it('Normal ButtonGroup - Click', function () {
        browser.load('/demos/button-group/default.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(0);
        browser.actions().click(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(0), 'Btn_group_click_normal_default');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_states(themeName[i], element.all(helper.table).get(0), 0, 'normal_default');
    }

    it('Normal ButtonGroup Primary - Click', function () {
        browser.load('/demos/button-group/default.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(3);
        browser.actions().click(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(3), 'Btn_group_click_normal_primary');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_states(themeName[i], element.all(helper.table).get(3), 3, 'normal_primary');
    }

    it('Normal ButtonGroup Success - Click', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(6);
        browser.actions().click(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(6), 'Btn_group_click_normal_success');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_states(themeName[i], element.all(helper.table).get(6), 6, 'normal_success');
    }

    it('Normal ButtonGroup Info - Click', function () {
        browser.load('/demos/button-group/default.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(9);
        browser.actions().click(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(9), 'Btn_group_click_normal_info');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_states(themeName[i], element.all(helper.table).get(9), 9, 'normal_info');
    }

    it('Normal ButtonGroup Warning - Click', function () {
        browser.load('/demos/button-group/default.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(12);
        browser.actions().click(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(12), 'Btn_group_click_normal_warning');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_states(themeName[i], element.all(helper.table).get(12), 12, 'normal_warning');
    }

    it('Normal ButtonGroup Danger - Click', function () {
        browser.load('/demos/button-group/default.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(15);
        browser.actions().click(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(15), 'Btn_group_click_normal_danger');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_states(themeName[i], element.all(helper.table).get(15), 15, 'normal_danger');
    }

    it('Normal ButtonGroup - Hover', function () {
        browser.load('/demos/button-group/default.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(0);
        browser.actions().mouseMove(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(0), 'Btn_group_hover_normal_default');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_hover(themeName[i], element.all(helper.table).get(0), 0, 'default');
    }

    it('Normal ButtonGroup Primary - Hover', function () {
        browser.load('/demos/button-group/default.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(3);
        browser.actions().mouseMove(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(3), 'Btn_group_hover_normal_primary');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_hover(themeName[i], element.all(helper.table).get(3), 3, 'normal_primary');
    }

    it('Normal ButtonGroup Success - Hover', function () {
        browser.load('/demos/button-group/default.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(6);
        browser.actions().mouseMove(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(6), 'Btn_group_hover_normal_success');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_hover(themeName[i], element.all(helper.table).get(6), 6, 'normal_success');
    }

    it('Normal ButtonGroup Info - Hover', function () {
        browser.load('/demos/button-group/default.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(9);
        browser.actions().mouseMove(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(9), 'Btn_group_hover_normal_info');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_hover(themeName[i], element.all(helper.table).get(9), 9, 'normal_info');
    }

    it('Normal ButtonGroup Warning - Hover', function () {
        browser.load('/demos/button-group/default.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(12);
        browser.actions().mouseMove(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(12), 'Btn_group_hover_normal_warning');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_hover(themeName[i], element.all(helper.table).get(12), 12, 'normal_warning');
    }

    it('Normal ButtonGroup Danger - Hover', function () {
        browser.load('/demos/button-group/outline.html');
        let btnGroupElem = browser.element.all({ className: 'e-btn-group' }).get(15);
        browser.actions().mouseMove(btnGroupElem).perform().then(() => {
            browser.driver.sleep(1000);
            browser.compareScreen(element.all(helper.table).get(15), 'Btn_group_hover_normal_danger');
        });
    });

    for (let i: number = 0; i < 3; i++) {
        theme_change_hover(themeName[i], element.all(helper.table).get(15), 15, 'normal_danger');
    }
});