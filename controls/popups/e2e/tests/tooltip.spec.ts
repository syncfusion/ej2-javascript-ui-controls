
import { browser, element, By, protractor } from "@syncfusion/ej2-base/e2e/index";
import { Helper } from './Helper/helper.spec';
let helper = new Helper();

describe('Default sample', function () {
    it('Position Combinations', function () {
        helper.loadAndWait('/demos/tooltip/default.html', helper.tooltip_ID);
        let posNames = ['TopLeft', 'TopCenter', 'TopRight', 'BottomLeft', 'BottomCenter', 'BottomRight', 'LeftTop', 'LeftCenter', 'LeftBottom', 'RightTop', 'RightCenter', 'RightBottom'];
        helper.clickByXPath("//*[@id='tooltip']");
        for (var x = 0; x < posNames.length; x++) {
            helper.clickByXPath("//option[@value='" + posNames[x] + "']");
            helper.waitUntilPresent(helper.tooltip_ID, 4000);
            browser.compareScreen(element(helper.position_ClassName), 'tooltip_position_' + posNames[x]);
        }
    });
});

describe('Default sample', function () {
    it('Tip Positions', function () {
        helper.loadAndWait('/demos/tooltip/tipPositions.html', helper.tip_ID);
        let tipPosNames = ['Auto', 'Start', 'Middle', 'End'];
        helper.clickByXPath("//*[@id='tooltip']");
        for (var x = 0; x < tipPosNames.length; x++) {
            helper.clickByXPath("//option[@value='" + tipPosNames[x] + "']");
            helper.waitUntilPresent(helper.tooltip_ID);
            browser.compareScreen(element(helper.position_ClassName), 'tooltip_tip_position_' + tipPosNames[x]);
        }
    });
});

describe('Tooltip theme', function () {
    for (var x = 0; x < 3; x++) {
        themeChange(x);
    }
    function themeChange(x: any) {
        let theme_name = ['material', 'fabric', 'bootstrap'];
        it('template content', function () {
            helper.loadAndWait('/demos/tooltip/theme.html', helper.theme_ClassName);
            helper.clickByXPath("//*[@value='" + x + "']");
            helper.waitUntilPresent(helper.template_ID, 4000);
            helper.clickByXPath("//*[@id='staticlink']");
            helper.waitUntilPresent(helper.template_ID);
            browser.compareScreen(element(helper.template_ClassName), 'tooltip_template_' + theme_name[x]);
        });
        it('disable tip pointer', function () {
            helper.clickByXPath("//*[@id='tooltip2']");
            helper.waitUntilPresent(helper.disable_ID);
            browser.compareScreen(element(helper.disable_ClassName), 'tooltip_tip_pointer_' + theme_name[x]);
        });
        it('sticky mode', function () {
            helper.clickByXPath("//*[@id='tooltip3']");
            helper.waitUntilPresent(helper.sticky_ID);
            browser.compareScreen(element(helper.sticky_ClassName), 'tooltip_sticky_' + theme_name[x]);
        });
    }
});

describe('Tooltip custom css', function () {
    it('custom style', function () {
        helper.loadAndWait('/demos/tooltip/customstyle.html', helper.customTip_ID);
        helper.clickByXPath("//*[@id='customTip']");
        helper.waitUntilPresent(helper.customTip_ID);
        browser.compareScreen(element(helper.position_ClassName), 'tooltip_custom_style');
    });
    it('custom theme', function () {
        helper.loadAndWait('/demos/tooltip/customtheme.html', helper.customTheme_ID);
        helper.clickByXPath("//*[@id='customTheme']");
        helper.waitUntilPresent(helper.customTheme_ID);
        browser.compareScreen(element(helper.position_ClassName), 'tooltip_custom_theme');
    });
});