import { browser, element, Key, WebElement, ElementArrayFinder, By } from "@syncfusion/ej2-base/e2e/index";
import { ElementFinder } from "protractor/built/element";
let EC = browser.ExpectedConditions;

function load_delay(waitTime: number, type: string, element?: WebElement) {
    switch(type) {
        case 'presence':
            browser.wait( EC.presenceOf(<ElementFinder>element), waitTime );
            break;
        case 'visible':
            browser.wait( EC.visibilityOf(<ElementFinder>element), waitTime );
            break;
        case 'sleep':
            browser.driver.sleep(waitTime);
            break;
    }
}

function defaultTabInteraction(theme: String) {
    if (browser.browserName !== 'firefox') {
         defaultTabFocusInteraction(theme);
         if (theme !== 'Fabric') {
         defaultTabHoverActiveInteraction(theme);
        }
    }
}

function fillTabInteraction(theme: String) {
    if (browser.browserName !== 'firefox') {
         fillTabFocusInteraction(theme);
         if (theme !== 'Fabric') {
         fillTabHoverActiveInteraction(theme);
        }
    }
}

function backgroundTabInteraction(theme: String) {
    if (browser.browserName !== 'firefox') {
         backgroundTabFocusInteraction(theme);
         if (theme !== 'Fabric') {
         backgroundTabHoverActiveInteraction(theme);
        }
    }
}

function accentTabInteraction(theme: String) {
    if (browser.browserName !== 'firefox') {
         accentTabFocusInteraction(theme);
         if (theme !== 'Fabric') {
         accentTabHoverActiveInteraction(theme);
        }
    }
}

function defaultTabFocusInteraction(theme: String) {
    let navEle: ElementArrayFinder = element.all(By.css('.e-tab .e-tab-header .e-toolbar-items .e-toolbar-item .e-tab-wrap'));
    if (browser.browserName === 'MicrosoftEdge') { load_delay(300, 'sleep') }
    browser.compareScreen(element(By.id('defaultTab')), 'default_tab_1stitem_active_' + theme);
    browser.actions().mouseDown(navEle.get(0)).mouseUp(navEle.get(0)).perform();
    element(By.tagName('body')).click();
    navEle.get(0).sendKeys(Key.RIGHT);
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('defaultTab')), 'default_tab_item_focus_2ndItem' + theme);
    navEle.get(1).sendKeys(Key.ENTER);
    if (browser.browserName != 'MicrosoftEdge') { load_delay(400, 'sleep') }
    else { load_delay(700, 'sleep') }
    browser.compareScreen(element(By.id('defaultTab')), 'default_tab_2nditem_active_' + theme);
}

function defaultTabHoverActiveInteraction(theme: String) {
    let navEle: ElementArrayFinder = element.all(By.css('.e-tab .e-tab-header .e-toolbar-items .e-toolbar-item .e-tab-wrap'));
    element(By.tagName('body')).click();
    browser.actions().mouseMove(navEle.get(2)).perform();
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('defaultTab')), 'default_tab_item_hover_3rdtItem_' + theme);   
    browser.actions().mouseMove(navEle.get(3)).perform();
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('defaultTab')), 'default_tab_item_hover_4thItem_' + theme);  
}

function fillTabFocusInteraction(theme: String) {
    let navEle: ElementArrayFinder = element.all(By.css('.e-fill .e-tab-header .e-toolbar-items .e-toolbar-item .e-tab-wrap'));
    if (browser.browserName === 'MicrosoftEdge') { load_delay(300, 'sleep') }
    browser.compareScreen(element(By.id('fillTab')), 'fill_tab_1stitem_active_' + theme);
    browser.actions().mouseDown(navEle.get(0)).mouseUp(navEle.get(0)).perform();
    element(By.tagName('body')).click();
    navEle.get(0).sendKeys(Key.RIGHT);
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('fillTab')), 'fill_tab_item_focus_2ndItem' + theme);
}

function fillTabHoverActiveInteraction(theme: String) {
    let navEle: ElementArrayFinder = element.all(By.css('.e-fill .e-tab-header .e-toolbar-items .e-toolbar-item .e-tab-wrap'));
    element(By.tagName('body')).click();
    browser.actions().mouseMove(navEle.get(2)).perform();
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('fillTab')), 'fill_tab_item_hover_3rdItem_' + theme);   
    browser.actions().mouseMove(navEle.get(3)).perform();
    load_delay(400, 'sleep')
    browser.compareScreen(element(By.id('fillTab')), 'fill_tab_item_hover_4thItem_' + theme);
}

function backgroundTabFocusInteraction(theme: String) {
    let navEle: ElementArrayFinder = element.all(By.css('.e-background .e-tab-header .e-toolbar-items .e-toolbar-item .e-tab-wrap'));
    if (browser.browserName === 'MicrosoftEdge') { load_delay(300, 'sleep') }
    browser.compareScreen(element(By.id('backgroundTab')), 'background_tab_1stitem_active_' + theme);
    browser.actions().mouseDown(navEle.get(0)).perform();
    navEle.get(0).sendKeys(Key.RIGHT);
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('backgroundTab')), 'background_tab_item_focus_2ndItem' + theme);
    navEle.get(1).sendKeys(Key.ENTER);
    if (browser.browserName != 'MicrosoftEdge') { load_delay(400, 'sleep') }
    else { load_delay(700, 'sleep') }
    browser.compareScreen(element(By.id('backgroundTab')), 'background_tab_2nditem_active_' + theme);
}

function backgroundTabHoverActiveInteraction(theme: String) {
    let navEle: ElementArrayFinder = element.all(By.css('.e-background .e-tab-header .e-toolbar-items .e-toolbar-item .e-tab-wrap'));
    browser.actions().mouseMove(navEle.get(2)).perform();
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('backgroundTab')), 'background_tab_item_hover_3rdItem_' + theme);   
    browser.actions().mouseMove(navEle.get(3)).perform();
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('backgroundTab')), 'background_tab_item_hover_4thItem_' + theme);
}

function accentTabFocusInteraction(theme: String) {
    let navEle: ElementArrayFinder = element.all(By.css('.e-accent .e-tab-header .e-toolbar-items .e-toolbar-item .e-tab-wrap'));
    browser.compareScreen(element(By.id('accentTab')), 'accent_tab_1stitem_active_' + theme);
    browser.actions().mouseDown(navEle.get(0)).perform();
    navEle.get(0).sendKeys(Key.RIGHT);
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('accentTab')), 'accent_tab_item_focus_2ndItem' + theme);
    navEle.get(1).sendKeys(Key.ENTER);
    if (browser.browserName != 'MicrosoftEdge') { load_delay(400, 'sleep') }
    else { load_delay(600, 'sleep') }
    browser.compareScreen(element(By.id('accentTab')), 'accent_tab_2ndtitem_active_' + theme);
}

function accentTabHoverActiveInteraction(theme: String) {
    let navEle: ElementArrayFinder = element.all(By.css('.e-accent .e-tab-header .e-toolbar-items .e-toolbar-item .e-tab-wrap'));
    browser.actions().mouseMove(navEle.get(2)).perform();
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('accentTab')), 'accent_tab_item_hover_3rdItem_' + theme);   
    browser.actions().mouseMove(navEle.get(3)).perform();
    load_delay(300, 'sleep')
    browser.compareScreen(element(By.id('accentTab')), 'accent_tab_item_hover_4thItem_' + theme);
}

describe('Default-Tab Theme Wise UI Testing', function () {
    it('UI Interactions Tab Focus Testing-Material', function () {
        browser.load('/demos/tab/default-header-styles.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        if (browser.browserName === 'MicrosoftEdge') {
             load_delay(200, 'sleep') }
            defaultTabInteraction('Material');
            fillTabInteraction('Material');
        browser.load('/demos/tab/default-header-styles-02.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        if (browser.browserName === 'MicrosoftEdge') {
            load_delay(200, 'sleep') }
            backgroundTabInteraction('Material');
            accentTabInteraction('Material');
    },1200000);
    it('UI Interactions Focus Tab Testing-Fabric', function () {
        browser.load('/demos/tab/default-header-styles.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fabric').click();")
            if (browser.browserName === 'MicrosoftEdge') {
                load_delay(300, 'sleep') }
            defaultTabInteraction('Fabric');
            fillTabInteraction('Fabric');
        browser.load('/demos/tab/default-header-styles-02.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fabric').click();")
            if (browser.browserName === 'MicrosoftEdge') {
                load_delay(300, 'sleep') }
            backgroundTabInteraction('Fabric');    
    },1200000);
    it('UI Interactions Focus Tab Testing-Bootstrap', function () {
        browser.load('/demos/tab/default-header-styles.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_boot').click();")
            if (browser.browserName === 'MicrosoftEdge') {
                load_delay(300, 'sleep') }
            defaultTabInteraction('Bootstrap');
            fillTabInteraction('Bootstrap');
    },1200000);
 });

 describe('Default tab with icons', function () {
    it('default tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('icons')), 'default_tab_icons_material_theme');
    },1200000);
    it('default tab with icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('icons')), 'default_tab_icons_fabric_theme');
    },1200000);
    it('default tab with icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('icons')), 'default_tab_icons_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('icons')), 'default_tab_icons_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with icons in and material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('icons')), 'default_tab_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with icons and material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('icons')), 'default_tab_icons_orientation_material_theme');
    },1200000);

    it('enable close button in default tab with icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('icons')), 'default_tab_icons_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('icons')), 'default_tab_icons_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('icons')), 'default_tab_icons_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('icons')), 'default_tab_icons_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('icons')), 'default_tab_icons_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('icons')), 'default_tab_icons_orientation_bootstrap_theme');
    },1200000);
});

describe('Default tab with default icons', function () {
    it('default tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('iconsDefault')), 'default_tab_default_icons_material_theme');
    },1200000);
    it('default tab with default icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('iconsDefault')), 'default_tab_default_icons_fabric_theme');
    },1200000);
    it('default tab with default icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('iconsDefault')), 'default_tab_default_icons_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'default_tab_default_icons_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'default_tab_default_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'default_tab_default_icons_orientation_material_theme');
    },1200000);

    it('enable close button in default tab with default icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'default_tab_default_icons_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with default icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'default_tab_default_icons_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with default icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'default_tab_default_icons_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with default icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'default_tab_default_icons_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with default icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'default_tab_default_icons_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with default icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'default_tab_default_icons_orientation_bootstrap_theme');
    },1200000);
});

describe('Fill tab with icons', function () {
    it('fill tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('icons')), 'fill_tab_icons_material_theme');
    },1200000);
    it('fill tab with icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('icons')), 'fill_tab_icons_fabric_theme');
    },1200000);
    it('fill tab with icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('icons')), 'fill_tab_icons_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('icons')), 'fill_tab_icons_close_btn_material_theme');
    },1200000);
    it('enable RTL in fill tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('icons')), 'fill_tab_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('icons')), 'fill_tab_icons_orientation_material_theme');
    },1200000);

    it('enable close button in fill tab with icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('icons')), 'fill_tab_icons_close_btn_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('icons')), 'fill_tab_icons_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('icons')), 'fill_tab_icons_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('icons')), 'fill_tab_icons_close_btn_bootstrap_theme');
    },1200000);
    it('enable RTL in fill tab with icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('icons')), 'fill_tab_icons_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('icons')), 'fill_tab_icons_orientation_bootstrap_theme');
    },1200000);
});

describe('Fill tab with default icons', function () {
    it('fill tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'fill_tab_default_icons_material_theme');
    },1200000);
    it('fill tab with default icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'fill_tab_default_icons_fabric_theme');
    },1200000);
    it('fill tab with default icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'fill_tab_default_icons_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'fill_tab_default_icons_close_btn_material_theme');
    },1200000);
    it('enable RTL in fill tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'fill_tab_default_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'fill_tab_default_icons_orientation_material_theme');
    },1200000);

    it('enable close button in fill tab with default icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'fill_tab_default_icons_close_btn_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with default icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'fill_tab_default_icons_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with default icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'fill_tab_default_icons_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with default icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'fill_tab_default_icons_close_btn_bootstrap_theme');
    },1200000);
    it('enable RTL in fill tab with default icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'fill_tab_default_icons_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with default icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'fill_tab_default_icons_orientation_bootstrap_theme');
    },1200000);
});

describe('Background tab with icons', function () {
    it('background tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.compareScreen(element(By.id('icons')), 'background_tab_icons_material_theme');
    },1200000);
    it('background tab with icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.compareScreen(element(By.id('icons')), 'background_tab_icons_fabric_theme');
    },1200000);
    it('enable close button in background tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('icons')), 'background_tab_icons_close_btn_material_theme');
    },1200000);
    it('enable RTL in background tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('icons')), 'background_tab_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in background tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('icons')), 'background_tab_icons_orientation_material_theme');
    },1200000);

    it('enable close button in background tab with icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('icons')), 'background_tab_icons_close_btn_fabric_theme');
    },1200000);
    //it('enable RTL in background tab with icons in fabric theme', function () {
    //    browser.load('/demos/tab/icons-fabric.html');
    //    load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
    //    browser.executeScript("document.getElementById('btn_bg').click();")
    //    browser.executeScript("document.getElementById('btn_enableRtl').click();")
    //    load_delay(300, 'sleep')
    //    browser.compareScreen(element(By.id('icons')), 'background_tab_icons_rtl_fabric_theme');
    //},1200000);
    it('enable orientation in background tab with icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")            
        browser.compareScreen(element(By.id('icons')), 'background_tab_icons_orientation_fabric_theme');
    },1200000);
});

describe('Background tab with default icons', function () {
    it('background tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'background_tab_default_icons_material_theme');
    },1200000);
    it('background tab with default icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'background_tab_default_icons_fabric_theme');
    },1200000);
    it('enable close button in background tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'background_tab_default_icons_close_btn_material_theme');
    },1200000);
    it('enable RTL in background tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'background_tab_default_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in background tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'background_tab_default_icons_orientation_material_theme');
    },1200000);

    it('enable close button in background tab with default icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'background_tab_default_icons_close_btn_fabric_theme');
    },1200000);
    it('enable RTL in background tab with default icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'background_tab_default_icons_rtl_fabric_theme');
    },1200000);
    it('enable orientation in background tab with default icons in fabric theme', function () {
        browser.load('/demos/tab/icons-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")            
        browser.compareScreen(element(By.id('iconsDefault')), 'background_tab_default_icons_orientation_fabric_theme');
    },1200000);
});

describe('Accent tab with icons', function () {
    it('accent tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.compareScreen(element(By.id('icons')), 'accent_tab_icons_material_theme');
    },1200000);
    it('enable close button in accent tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('icons')), 'accent_tab_icons_close_btn_material_theme');
    },1200000);
    it('enable RTL in accent tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('icons')), 'accent_tab_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in accent tab with icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('icons')), 'accent_tab_icons_orientation_material_theme');
    },1200000);
});

describe('Accent tab with default icons', function () {
    it('accent tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'accent_tab_default_icons_material_theme');
    },1200000);
    it('enable close button in accent tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'accent_tab_default_icons_close_btn_material_theme');
    },1200000);
    it('enable RTL in accent tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'accent_tab_default_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in accent tab with default icons in material theme', function () {
        browser.load('/demos/tab/icons.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('iconsDefault')), 'accent_tab_default_icons_orientation_material_theme');
    },1200000);
});

describe('Default tab with bottom icons', function () {
    it('default tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_bottom_icons_material_theme');
    },1200000);
    it('default tab with bottom icons in fabric theme', function () {
        browser.load('/demos/tab/icons-bottom-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_bottom_icons_fabric_theme');
    },1200000);
    it('default tab with bottom icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bottom-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_bottom_icons_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_bottom_icons_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_bottom_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_bottom_icons_orientation_material_theme');
    },1200000);

    it('enable close button in default tab with bottom icons in fabric theme', function () {
        browser.load('/demos/tab/icons-bottom-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_bottom_icons_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with bottom icons in fabric theme', function () {
        browser.load('/demos/tab/icons-bottom-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_bottom_icons_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with bottom icons in fabric theme', function () {
        browser.load('/demos/tab/icons-bottom-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_bottom_icons_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with bottom icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bottom-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_bottom_icons_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with bottom icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bottom-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_bottom_icons_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with bottom icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bottom-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_bottom_icons_orientation_bootstrap_theme');
    },1200000);
});

describe('Fill tab with bottom icons', function () {
    it('fill tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_bottom_icons_material_theme');
    },1200000);
    it('fill tab with bottom icons in fabric theme', function () {
        browser.load('/demos/tab/icons-bottom-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_bottom_icons_fabric_theme');
    },1200000);
    it('fill tab with bottom icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bottom-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_bottom_icons_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_bottom_icons_close_btn_material_theme');
    },1200000);
    it('enable RTL in fill tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_bottom_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_bottom_icons_orientation_material_theme');
    },1200000);
    
    it('enable close button in fill tab with bottom icons in fabric theme', function () {
        browser.load('/demos/tab/icons-bottom-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_bottom_icons_close_btn_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with bottom icons in fabric theme', function () {
        browser.load('/demos/tab/icons-bottom-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_bottom_icons_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with bottom icons in fabric theme', function () {
        browser.load('/demos/tab/icons-bottom-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_bottom_icons_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with bottom icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bottom-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_bottom_icons_close_btn_bootstrap_theme');
    },1200000);
    it('enable RTL in fill tab with bottom icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bottom-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_bottom_icons_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with bottom icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-bottom-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_bottom_icons_orientation_bootstrap_theme');
    },1200000);
});

describe('Background tab with bottom icons', function () {
    it('background tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_bottom_icons_material_theme');
    },1200000);
    it('background tab with bottom icons in fabric theme', function () {
        browser.load('/demos/tab/icons-bottom-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_bottom_icons_fabric_theme');
    },1200000);
    it('enable close button in background tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_bottom_icons_close_btn_material_theme');
    },1200000);
    it('enable RTL in background tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_bottom_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in background tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_bottom_icons_orientation_material_theme');
    },1200000);

    it('enable close button in background tab with bottom icons in fabric theme', function () {
        browser.load('/demos/tab/icons-bottom-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_bottom_icons_close_btn_fabric_theme');
    },1200000);
    //it('enable RTL in background tab with bottom icons in fabric theme', function () {
    //    browser.load('/demos/tab/icons-bottom-fabric.html');
    //    load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
    //    browser.executeScript("document.getElementById('btn_bg').click();")
    //    browser.executeScript("document.getElementById('btn_enableRtl').click();")
    //    load_delay(300, 'sleep')
    //    browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_bottom_icons_rtl_fabric_theme');
    //},1200000);
    it('enable orientation in background tab with bottom icons in fabric theme', function () {
        browser.load('/demos/tab/icons-bottom-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")            
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_bottom_icons_orientation_fabric_theme');
    },1200000);
});

describe('Accent tab with bottom icons', function () {
    it('accent tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_bottom_icons_material_theme');
    },1200000);
    it('enable close button in accent tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_bottom_icons_close_btn_material_theme');
    },1200000);
    it('enable RTL in accent tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_bottom_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in accent tab with bottom icons in material theme', function () {
        browser.load('/demos/tab/icons-bottom.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_bottom_icons_orientation_material_theme');
    },1200000);
});

describe('Default tab with top icons', function () {
    it('default tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_top_icons_material_theme');
    },1200000);
    it('default tab with top icons in fabric theme', function () {
        browser.load('/demos/tab/icons-top-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_top_icons_fabric_theme');
    },1200000);
    it('default tab with top icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-top-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_top_icons_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_top_icons_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_top_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_top_icons_orientation_material_theme');
    },1200000);

    it('enable close button in default tab with top icons in fabric theme', function () {
        browser.load('/demos/tab/icons-top-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_top_icons_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with top icons in fabric theme', function () {
        browser.load('/demos/tab/icons-top-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_top_icons_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with top icons in fabric theme', function () {
        browser.load('/demos/tab/icons-top-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_top_icons_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with top icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-top-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_top_icons_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with top icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-top-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_top_icons_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with top icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-top-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_top_icons_orientation_bootstrap_theme');
    },1200000);
});

describe('Fill tab with top icons', function () {
    it('fill tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_top_icons_material_theme');
    },1200000);
    it('fill tab with top icons in fabric theme', function () {
        browser.load('/demos/tab/icons-top-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_top_icons_fabric_theme');
    },1200000);
    it('fill tab with top icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-top-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_top_icons_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_top_icons_close_btn_material_theme');
    },1200000);
    it('enable RTL in fill tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_top_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_top_icons_orientation_material_theme');
    },1200000);
    
    it('enable close button in fill tab with top icons in fabric theme', function () {
        browser.load('/demos/tab/icons-top-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_top_icons_close_btn_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with top icons in fabric theme', function () {
        browser.load('/demos/tab/icons-top-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_top_icons_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with top icons in fabric theme', function () {
        browser.load('/demos/tab/icons-top-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_top_icons_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with top icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-top-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_top_icons_close_btn_bootstrap_theme');
    },1200000);
    it('enable RTL in fill tab with top icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-top-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_top_icons_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with top icons in bootstrap theme', function () {
        browser.load('/demos/tab/icons-top-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_top_icons_orientation_bootstrap_theme');
    },1200000);
});

describe('Background tab with top icons', function () {
    it('background tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_top_icons_material_theme');
    },1200000);
    it('background tab with top icons in fabric theme', function () {
        browser.load('/demos/tab/icons-top-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_top_icons_fabric_theme');
    },1200000);
    it('enable close button in background tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_top_icons_close_btn_material_theme');
    },1200000);
    it('enable RTL in background tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_top_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in background tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_top_icons_orientation_material_theme');
    },1200000);
    
    it('enable close button in background tab with top icons in fabric theme', function () {
        browser.load('/demos/tab/icons-top-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_top_icons_close_btn_fabric_theme');
    },1200000);
    //it('enable RTL in background tab with top icons in fabric theme', function () {
    //    browser.load('/demos/tab/icons-top-fabric.html');
    //    load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
    //    browser.executeScript("document.getElementById('btn_bg').click();")
    //    browser.executeScript("document.getElementById('btn_enableRtl').click();")
    //    load_delay(300, 'sleep')
    //    browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_top_icons_rtl_fabric_theme');
    //},1200000);
    it('enable orientation in background tab with top icons in fabric theme', function () {
        browser.load('/demos/tab/icons-top-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")            
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_top_icons_orientation_fabric_theme');
    },1200000);
});

describe('Accent tab with top icons', function () {
    it('accent tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_top_icons_material_theme');
    },1200000);
    it('enable close button in accent tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_top_icons_close_btn_material_theme');
    },1200000);
    it('enable RTL in accent tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_top_icons_rtl_material_theme');
    },1200000);
    it('enable orientation in accent tab with top icons in material theme', function () {
        browser.load('/demos/tab/icons-top.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_top_icons_orientation_material_theme');
    },1200000);
});

describe('Default tab with popup open', function () {
    it('default tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_open_material_theme');
    },1200000);
    it('default tab with popup open in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_open_fabric_theme');
    },1200000);
    it('default tab with popup open in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_open_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_open_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_open_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_open_orientation_material_theme');
    },1200000);
    
    it('enable close button in default tab with popup open in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
	    if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_open_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with popup open in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_open_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with popup open in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_open_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with popup open in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_open_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with popup open in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_open_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with popup open in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_open_orientation_bootstrap_theme');
    },1200000);
});

describe('Fill tab with popup open', function () {
    it('fill tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_open_material_theme');
    },1200000);
    it('fill tab with popup open in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_open_fabric_theme');
    },1200000);
    it('fill tab with popup open in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_open_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_open_close_btn_material_theme');
    },1200000);
    it('enable RTL in fill tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_open_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_open_orientation_material_theme');
    },1200000);
    
    it('enable close button in fill tab with popup open in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_open_close_btn_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with popup open in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_open_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with popup open in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_open_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with popup open in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_open_close_btn_bootstrap_theme');
    },1200000);
    it('enable RTL in fill tab with popup open in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_open_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with popup open in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_open_orientation_bootstrap_theme');
    },1200000);
});

describe('Background tab with popup open', function () {
    it('background tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_open_material_theme');
    },1200000);
    it('background tab with popup open in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_open_fabric_theme');
    },1200000);
    it('enable close button in background tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_open_close_btn_material_theme');
    },1200000);
    it('enable RTL in background tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_open_rtl_material_theme');
    },1200000);
    it('enable orientation in background tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_open_orientation_material_theme');
    },1200000);
    
    it('enable close button in background tab with popup open in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_open_close_btn_fabric_theme');
    },1200000);
    //it('enable RTL in background tab with popup open in fabric theme', function () {
    //    browser.load('/demos/tab/popup-fabric.html');
    //    load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
    //    browser.executeScript("document.getElementById('btn_bg').click();")
    //    browser.executeScript("document.getElementById('btn_enableRtl').click();")
    //    browser.executeScript("document.querySelector('.e-hor-nav').click();")
	//	if (browser.browserName === 'internet explorer') {
    //        browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
    //        browser.executeScript("document.getElementById('_popup').style.display = 'block'");
    //    }
    //    load_delay(300, 'sleep')
    //    browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_open_rtl_fabric_theme');
    //},1200000);
    it('enable orientation in background tab with popup open in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
        if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }		
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_open_orientation_fabric_theme');
    },1200000);
});

describe('Accent tab with popup open', function () {
    it('accent tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'accent_tab_popup_open_material_theme');
    },1200000);
    it('enable close button in accent tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'accent_tab_popup_open_close_btn_material_theme');
    },1200000);
    it('enable RTL in accent tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'accent_tab_popup_open_rtl_material_theme');
    },1200000);
    it('enable orientation in accent tab with popup open in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.executeScript("document.querySelector('.e-hor-nav').click();")
		if (browser.browserName === 'internet explorer') {
            browser.executeScript("document.getElementById('ej2Tab1').style.height = '900px'");
            browser.executeScript("document.getElementById('_popup').style.display = 'block'");
        }
        load_delay(300, 'sleep')
        browser.compareScreen(element(By.id('ej2Tab1')), 'accent_tab_popup_open_orientation_material_theme');
    },1200000);
});

describe('Default tab with popup close', function () {
    it('default tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_close_material_theme');
    },1200000);
    it('default tab with popup close in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_close_fabric_theme');
    },1200000);
    it('default tab with popup close in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_close_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_close_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_close_orientation_material_theme');
    },1200000);
    
    it('enable close button in default tab with popup close in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with popup close in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_close_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with popup close in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_close_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with popup close in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with popup close in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_close_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with popup close in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'default_tab_popup_close_orientation_bootstrap_theme');
    },1200000);
});

describe('Fill tab with popup close', function () {
    it('fill tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_close_material_theme');
    },1200000);
    it('fill tab with popup close in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_close_fabric_theme');
    },1200000);
    it('fill tab with popup close in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_close_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_close_btn_material_theme');
    },1200000);
    it('enable RTL in fill tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_close_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_close_orientation_material_theme');
    },1200000);
   
    it('enable close button in fill tab with popup close in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_close_btn_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with popup close in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_close_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with popup close in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_close_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with popup close in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_close_btn_bootstrap_theme');
    },1200000);
    it('enable RTL in fill tab with popup close in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_close_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with popup close in bootstrap theme', function () {
        browser.load('/demos/tab/popup-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'fill_tab_popup_close_orientation_bootstrap_theme');
    },1200000);
});

describe('Background tab with popup close', function () {
    it('background tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_close_material_theme');
    },1200000);
    it('background tab with popup close in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_close_fabric_theme');
    },1200000);
    it('enable close button in background tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_close_btn_material_theme');
    },1200000);
    it('enable RTL in background tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_close_rtl_material_theme');
    },1200000);
    it('enable orientation in background tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_close_orientation_material_theme');
    },1200000);
    
    it('enable close button in background tab with popup close in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_close_btn_fabric_theme');
    },1200000);
    //it('enable RTL in background tab with popup close in fabric theme', function () {
    //    browser.load('/demos/tab/popup-fabric.html');
    //    load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
    //    browser.executeScript("document.getElementById('btn_bg').click();")
    //    browser.executeScript("document.getElementById('btn_enableRtl').click();")
    //    load_delay(300, 'sleep')
    //    browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_close_rtl_fabric_theme');
    //},1200000);
    it('enable orientation in background tab with popup close in fabric theme', function () {
        browser.load('/demos/tab/popup-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")            
        browser.compareScreen(element(By.id('ej2Tab1')), 'background_tab_popup_close_orientation_fabric_theme');
    },1200000);
});

describe('Accent tab with popup close', function () {
    it('accent tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'accent_tab_popup_close_material_theme');
    },1200000);
    it('enable close button in accent tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'accent_tab_popup_close_btn_material_theme');
    },1200000);
    it('enable RTL in accent tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'accent_tab_popup_close_rtl_material_theme');
    },1200000);
    it('enable orientation in accent tab with popup close in material theme', function () {
        browser.load('/demos/tab/popup.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab1')), 'accent_tab_popup_close_orientation_material_theme');
    },1200000);
});

describe('Default tab with default scroll mode', function () {
    it('default tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_default_scroll_material_theme');
    },1200000);
    it('default tab with default scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_default_scroll_fabric_theme');
    },1200000);
    it('default tab with default scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_default_scroll_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_default_scroll_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_default_scroll_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_default_scroll_orientation_material_theme');
    },1200000);
    
    it('enable close button in default tab with default scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_default_scroll_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with default scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_default_scroll_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with default scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_default_scroll_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with default scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_default_scroll_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with default scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_default_scroll_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with default scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_default_scroll_orientation_bootstrap_theme');
    },1200000);
});

describe('Fill tab with default scroll mode', function () {
    it('fill tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_default_scroll_material_theme');
    },1200000);
    it('fill tab with default scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_default_scroll_fabric_theme');
    },1200000);
    it('fill tab with default scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_default_scroll_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_default_scroll_close_btn_material_theme');
    },1200000);
    it('enable RTL in fill tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_default_scroll_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_default_scroll_orientation_material_theme');
    },1200000);
   
    it('enable close button in fill tab with default scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_default_scroll_close_btn_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with default scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_default_scroll_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with default scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_default_scroll_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with default scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_default_scroll_close_btn_bootstrap_theme');
    },1200000);
    it('enable RTL in fill tab with default scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_default_scroll_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with default scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_fill').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_default_scroll_orientation_bootstrap_theme');
    },1200000);
});

describe('Background tab with default scroll mode', function () {
    it('background tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_default_scroll_material_theme');
    },1200000);
    it('background tab with default scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_default_scroll_fabric_theme');
    },1200000);
    it('enable close button in background tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_default_scroll_close_btn_material_theme');
    },1200000);
    it('enable RTL in background tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_default_scroll_rtl_material_theme');
    },1200000);
    it('enable orientation in background tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_default_scroll_orientation_material_theme');
    },1200000);
    
    it('enable close button in background tab with default scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_default_scroll_close_btn_fabric_theme');
    },1200000);
    //it('enable RTL in background tab with default scroll in fabric theme', function () {
    //    browser.load('/demos/tab/scrollable-fabric.html');
    //    load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
    //    browser.executeScript("document.getElementById('btn_bg').click();")
    //    browser.executeScript("document.getElementById('btn_enableRtl').click();")
    //    load_delay(300, 'sleep')
    //    browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_default_scroll_rtl_fabric_theme');
    //},1200000);
    it('enable orientation in background tab with default scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_bg').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")            
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_default_scroll_orientation_fabric_theme');
    },1200000);
});

describe('Accent tab with default scroll mode', function () {
    it('accent tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_default_scroll_material_theme');
    },1200000);
    it('enable close button in accent tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_closeButton').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_default_scroll_close_btn_material_theme');
    },1200000);
    it('enable RTL in accent tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_enableRtl').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_default_scroll_rtl_material_theme');
    },1200000);
    it('enable orientation in accent tab with default scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.executeScript("document.getElementById('btn_accent').click();")
        browser.executeScript("document.getElementById('btn_orientation').click();")
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_default_scroll_orientation_material_theme');
    },1200000);
});

describe('Default tab with active scroll mode', function () {
    it('default tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_active_scroll_material_theme');
    },1200000);
    it('default tab with active scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_active_scroll_fabric_theme');
    },1200000);
    it('default tab with active scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_active_scroll_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_closeButton').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_active_scroll_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_enableRtl').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_active_scroll_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_orientation').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_active_scroll_orientation_material_theme');
    },1200000);
    
    it('enable close button in default tab with active scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_active_scroll_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with active scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_active_scroll_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with active scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_active_scroll_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with active scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_active_scroll_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with active scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_active_scroll_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with active scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_active_scroll_orientation_bootstrap_theme');
    },1200000);
});

describe('Fill tab with active scroll mode', function () {
    it('fill tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_active_scroll_material_theme');
    },1200000);
    it('fill tab with active scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_active_scroll_fabric_theme');
    },1200000);
    it('fill tab with active scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_active_scroll_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_active_scroll_close_btn_material_theme');
    },1200000);
    it('enable RTL in fill tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_active_scroll_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_active_scroll_orientation_material_theme');
    },1200000);
    
    it('enable close button in fill tab with active scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_active_scroll_close_btn_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with active scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_active_scroll_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with active scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_active_scroll_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with active scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_active_scroll_close_btn_bootstrap_theme');
    },1200000);
    it('enable RTL in fill tab with active scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_active_scroll_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with active scroll in bootstrap theme', function () {
        browser.load('/demos/tab/scrollable-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_active_scroll_orientation_bootstrap_theme');
    },1200000);
});

describe('Background tab with active scroll mode', function () {
    it('background tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_active_scroll_material_theme');
    },1200000);
    it('background tab with active scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_active_scroll_fabric_theme');
    },1200000);
    it('enable close button in background tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_active_scroll_close_btn_material_theme');
    },1200000);
    it('enable RTL in background tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_active_scroll_rtl_material_theme');
    },1200000);
    it('enable orientation in background tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_active_scroll_orientation_material_theme');
    },1200000);
    
    it('enable close button in background tab with active scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(rightArrow); browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_active_scroll_close_btn_fabric_theme');
    },1200000);
    //it('enable RTL in background tab with active scroll in fabric theme', function () {
    //    browser.load('/demos/tab/scrollable-fabric.html');
    //    load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
    //    let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
    //    let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
    //    let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
    //    browser.executeScript(tab_ctn1)
    //    browser.executeScript(tab_ctn2)
    //    browser.executeScript(rightArrow);browser.executeScript(rightArrow);
    //    browser.executeScript(rightArrow);browser.executeScript(rightArrow);
    //    browser.executeScript(rightArrow); browser.executeScript(rightArrow);
    //    browser.executeScript(rightArrow);
    //    load_delay(300, 'sleep')
    //    browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_active_scroll_rtl_fabric_theme');
    //},1200000);
    it('enable orientation in background tab with active scroll in fabric theme', function () {
        browser.load('/demos/tab/scrollable-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_active_scroll_orientation_fabric_theme');
    },1200000);
});

describe('Accent tab with active scroll mode', function () {
    it('accent tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_active_scroll_material_theme');
    },1200000);
    it('enable close button in accent tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_active_scroll_close_btn_material_theme');
    },1200000);
    it('enable RTL in accent tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_active_scroll_rtl_material_theme');
    },1200000);
    it('enable orientation in accent tab with active scroll in material theme', function () {
        browser.load('/demos/tab/scrollable.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        let rightArrow: string = "document.querySelector('.e-nav-right-arrow').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.executeScript(rightArrow);browser.executeScript(rightArrow);
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_active_scroll_orientation_material_theme');
    },1200000);
});

describe('Default tab - public method testing', function () {
    it('disable tab public method in default tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnDisableTab').click();" ;
        browser.executeScript(tab_ctn)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_tab_method_material_theme');
    },1200000);
    it('disable tab public method in default tab with fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisableTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_tab_method_fabric_theme');
    },1200000);
    it('disable tab public method in default tab with bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisableTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_tab_method_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with disable tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_tab_method_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with disable tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_tab_method_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with disable tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_tab_method_orientation_material_theme');
    },1200000);
    
    it('enable close button in default tab with disable tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_tab_method_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with disable tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_tab_method_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with disable tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_tab_method_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with disable tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_tab_method_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with disable tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_tab_method_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with disable tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_tab_method_orientation_bootstrap_theme');
    },1200000);

    it('add tab public method in default tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnAddTab').click();" ;
        browser.executeScript(tab_ctn)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_add_tab_method_material_theme');
    },1200000);
    it('add tab public method in default tab with fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_add_tab_method_fabric_theme');
    },1200000);
    it('add tab public method in default tab with bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_add_tab_method_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with add tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_add_tab_method_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with add tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_add_tab_method_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with add tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_add_tab_method_orientation_material_theme');
    },1200000);

    it('enable close button in default tab with add tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_add_tab_method_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with add tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_add_tab_method_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with add tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_add_tab_method_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with add tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_add_tab_method_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with add tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_add_tab_method_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with add tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_add_tab_method_orientation_bootstrap_theme');
    },1200000);

    it('remove tab public method in default tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnRemoveTab').click();" ;
        browser.executeScript(tab_ctn)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_remove_tab_method_material_theme');
    },1200000);
    it('remove tab public method in default tab with fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_remove_tab_method_fabric_theme');
    },1200000);
    it('remove tab public method in default tab with bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_remove_tab_method_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with remove tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_remove_tab_method_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with remove tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_remove_tab_method_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with remove tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_remove_tab_method_orientation_material_theme');
    },1200000);
    
    it('enable close button in default tab with remove tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_remove_tab_method_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with remove tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_remove_tab_method_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with remove tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_remove_tab_method_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with remove tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_remove_tab_method_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with remove tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_remove_tab_method_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with remove tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_remove_tab_method_orientation_bootstrap_theme');
    },1200000);

    it('disable display method in default tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnDisable').click();" ;
        browser.executeScript(tab_ctn)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_method_material_theme');
    },1200000);
    it('disable display method in default tab with fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_method_fabric_theme');
    },1200000);
    it('disable display method in default tab with bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_method_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with disable display method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_method_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with disable display method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_method_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with disable display method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_method_orientation_material_theme');
    },1200000);
    
    it('enable close button in default tab with disable display method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_method_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with disable display method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_method_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with disable display method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_method_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with disable display method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_method_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with disable display method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_method_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with disable display method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'default_tab_disable_method_orientation_bootstrap_theme');
    },1200000);
}); 

describe('Fill tab - public method testing', function () {
    it('disable tab public method in fill tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisableTab').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_tab_method_material_theme');
    },1200000);
    it('disable tab public method in fill tab with fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisableTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_tab_method_fabric_theme');
    },1200000);
    it('disable tab public method in fill tab with bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisableTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_tab_method_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with disable tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_tab_method_close_button_material_theme');
    },1200000);
    it('enable RTL in fill tab with disable tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_tab_method_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with disable tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_tab_method_orientation_material_theme');
    },1200000);
    
    it('enable close button in fill tab with disable tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_tab_method_close_button_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with disable tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_tab_method_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with disable tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_tab_method_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with disable tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_tab_method_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in fill tab with disable tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_tab_method_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with disable tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisableTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_tab_method_orientation_bootstrap_theme');
    },1200000);

    it('add tab public method in fill tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_add_tab_method_material_theme');
    },1200000);
    it('add tab public method in fill tab with fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnAddTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_add_tab_method_fabric_theme');
    },1200000);
    it('add tab public method in fill tab with bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnAddTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_add_tab_method_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with add tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_add_tab_method_close_button_material_theme');
    },1200000);
    it('enable RTL in fill tab with add tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_add_tab_method_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with add tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_add_tab_method_orientation_material_theme');
    },1200000);
    
    it('enable close button in fill tab with add tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_add_tab_method_close_button_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with add tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_add_tab_method_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with add tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_add_tab_method_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with add tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_add_tab_method_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in fill tab with add tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_add_tab_method_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with add tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_add_tab_method_orientation_bootstrap_theme');
    },1200000);

    it('remove tab public method in fill tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_remove_tab_method_material_theme');
    },1200000);
    it('remove tab public method in fill tab with fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnRemoveTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_remove_tab_method_fabric_theme');
    },1200000);
    it('remove tab public method in fill tab with bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnRemoveTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_remove_tab_method_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with remove tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_remove_tab_method_close_button_material_theme');
    },1200000);
    it('enable RTL in fill tab with remove tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_remove_tab_method_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with remove tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_remove_tab_method_orientation_material_theme');
    },1200000);
    
    it('enable close button in fill tab with remove tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_remove_tab_method_close_button_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with remove tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_remove_tab_method_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with remove tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_remove_tab_method_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with remove tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_remove_tab_method_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in fill tab with remove tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_remove_tab_method_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with remove tab public method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_remove_tab_method_orientation_bootstrap_theme');
    },1200000);

    it('disable display method in fill tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_method_material_theme');
    },1200000);
    it('disable display method in fill tab with fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisable').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_method_fabric_theme');
    },1200000);
    it('disable display method in fill tab with bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisable').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_method_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with disable display method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_method_close_button_material_theme');
    },1200000);
    it('enable RTL in fill tab with disable display method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_method_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with disable display method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_method_orientation_material_theme');
    },1200000);
    
    it('enable close button in fill tab with disable display method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_method_close_button_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with disable display method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_method_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with disable display method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_method_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with disable display method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_method_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in fill tab with disable display method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_method_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with disable display method in bootstrap theme', function () {
        browser.load('/demos/tab/methods-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'fill_tab_disable_method_orientation_bootstrap_theme');
    },1200000);
}); 

describe('Background tab - public method testing', function () {
    it('add tab public method in background tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_add_tab_method_material_theme');
    },1200000);
    it('add tab public method in background tab with fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btnAddTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_add_tab_method_fabric_theme');
    },1200000);
    it('enable close button in background tab with add tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_add_tab_method_close_button_material_theme');
    },1200000);
    it('enable RTL in background tab with add tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_add_tab_method_rtl_material_theme');
    },1200000);
    it('enable orientation in background tab with add tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_add_tab_method_orientation_material_theme');
    },1200000);
    
    it('enable close button in background tab with add tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'baackground_tab_add_tab_method_close_button_fabric_theme');
    },1200000);
    //it('enable RTL in background tab with add tab public method in fabric theme', function () {
    //    browser.load('/demos/tab/methods-fabric.html');
    //    load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
    //    let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
    //    let tab_ctn2: string = "document.getElementById('btnAddTab').click();" ;
    //    let tab_ctn3: string = "document.getElementById('btn_enableRtl').click();" ;
    //    browser.executeScript(tab_ctn1)
    //    browser.executeScript(tab_ctn2)
    //    browser.executeScript(tab_ctn3)
    //    load_delay(300, 'sleep')
    //    browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_add_tab_method_rtl_fabric_theme');
    //},1200000);
    it('enable orientation in background tab with add tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_add_tab_method_orientation_fabric_theme');
    },1200000);

    it('remove tab public method in background tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_remove_tab_method_material_theme');
    },1200000);
    it('remove tab public method in background tab with fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btnRemoveTab').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_remove_tab_method_fabric_theme');
    },1200000);
    it('enable close button in background tab with remove tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_remove_tab_method_close_button_material_theme');
    },1200000);
    it('enable RTL in background tab with remove tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_remove_tab_method_rtl_material_theme');
    },1200000);
    it('enable orientation in background tab with remove tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_remove_tab_method_orientation_material_theme');
    },1200000);
    it('enable close button in background tab with remove tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_remove_tab_method_close_button_fabric_theme');
    },1200000);
    //it('enable RTL in background tab with remove tab public method in fabric theme', function () {
    //    browser.load('/demos/tab/methods-fabric.html');
    //    load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
    //    let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
    //    let tab_ctn2: string = "document.getElementById('btnRemoveTab').click();" ;
    //    let tab_ctn3: string = "document.getElementById('btn_enableRtl').click();" ;
    //    browser.executeScript(tab_ctn1)
    //    browser.executeScript(tab_ctn2)
    //    browser.executeScript(tab_ctn3)
    //    load_delay(300, 'sleep')
    //    browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_remove_tab_method_rtl_fabric_theme');
    //},1200000);
    it('enable orientation in background tab with remove tab public method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_remove_tab_method_orientation_fabric_theme');
    },1200000);

    it('disable display method in background tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_disable_method_material_theme');
    },1200000);
    it('disable display method in background tab with fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisable').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_disable_method_fabric_theme');
    },1200000);
    it('enable close button in background tab with disable display method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_disable_method_close_button_material_theme');
    },1200000);
    it('enable RTL in background tab with disable display method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_disable_method_rtl_material_theme');
    },1200000);
    it('enable orientation in background tab with disable display method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_disable_method_orientation_material_theme');
    },1200000);
    
    it('enable close button in background tab with disable display method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_disable_method_close_button_fabric_theme');
    },1200000);
    //it('enable RTL in background tab with disable display method in fabric theme', function () {
    //    browser.load('/demos/tab/methods-fabric.html');
    //    load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
    //    let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
    //    let tab_ctn2: string = "document.getElementById('btnDisable').click();" ;
    //    let tab_ctn3: string = "document.getElementById('btn_enableRtl').click();" ;
    //    browser.executeScript(tab_ctn1)
    //    browser.executeScript(tab_ctn2)
    //    browser.executeScript(tab_ctn3)
    //    load_delay(300, 'sleep')
    //    browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_disable_method_rtl_fabric_theme');
    //},1200000);
    it('enable orientation in background tab with disable display method in fabric theme', function () {
        browser.load('/demos/tab/methods-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn3: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.executeScript(tab_ctn3)
        browser.compareScreen(element(By.id('ej2Tab')), 'background_tab_disable_method_orientation_fabric_theme');
    },1200000);
}); 

describe('Accent tab - public method testing', function () {
    it('add tab public method in accent tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_add_tab_method_material_theme');
    },1200000);
    it('enable close button in accent tab with add tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_add_tab_method_close_button_material_theme');
    },1200000);
    it('enable RTL in accent tab with add tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_add_tab_method_rtl_material_theme');
    },1200000);
    it('enable orientation in accent tab with add tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btnAddTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_add_tab_method_orientation_material_theme');
    },1200000);

    it('remove tab public method in accent tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_remove_tab_method_material_theme');
    },1200000);
    it('enable close button in accent tab with remove tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_remove_tab_method_close_button_material_theme');
    },1200000);
    it('enable RTL in accent tab with remove tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_remove_tab_method_rtl_material_theme');
    },1200000);
    it('enable orientation in accent tab with remove tab public method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btnRemoveTab').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_remove_tab_method_orientation_material_theme');
    },1200000);

    it('disable display method in accent tab with material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_disable_method_material_theme');
    },1200000);
    it('enable close button in accent tab with disable display method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_disable_method_close_button_material_theme');
    },1200000);
    it('enable RTL in accent tab with disable display method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_disable_method_rtl_material_theme');
    },1200000);
    it('enable orientation in accent tab with disable display method in material theme', function () {
        browser.load('/demos/tab/methods.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btnDisable').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('ej2Tab')), 'accent_tab_disable_method_orientation_material_theme');
    },1200000);
});

describe('Default tab with template', function () {
    it('default tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('templateTab')), 'default_tab_template_material_theme');
    },1200000);
    it('default tab with template in fabric theme', function () {
        browser.load('/demos/tab/template-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('templateTab')), 'default_tab_template_fabric_theme');
    },1200000);
    it('default tab with template in bootstrap theme', function () {
        browser.load('/demos/tab/template-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        browser.compareScreen(element(By.id('templateTab')), 'default_tab_template_bootstrap_theme');
    },1200000);
    it('enable close button in default tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.compareScreen(element(By.id('templateTab')), 'default_tab_template_close_button_material_theme');
    },1200000);
    it('enable RTL in default tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.compareScreen(element(By.id('templateTab')), 'default_tab_template_rtl_material_theme');
    },1200000);
    it('enable orientation in default tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.compareScreen(element(By.id('templateTab')), 'default_tab_template_orientation_material_theme');
    },1200000);
    
    it('enable close button in default tab with template in fabric theme', function () {
        browser.load('/demos/tab/template-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'default_tab_template_close_button_fabric_theme');
    },1200000);
    it('enable RTL in default tab with template in fabric theme', function () {
        browser.load('/demos/tab/template-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'default_tab_template_rtl_fabric_theme');
    },1200000);
    it('enable orientation in default tab with template in fabric theme', function () {
        browser.load('/demos/tab/template-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'default_tab_template_orientation_fabric_theme');
    },1200000);

    it('enable close button in default tab with template in bootstrap theme', function () {
        browser.load('/demos/tab/template-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'default_tab_template_close_button_bootstrap_theme');
    },1200000);
    it('enable RTL in default tab with template in bootstrap theme', function () {
        browser.load('/demos/tab/template-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'default_tab_template_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in default tab with template in bootstrap theme', function () {
        browser.load('/demos/tab/template-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'default_tab_template_orientation_bootstrap_theme');
    },1200000);
});

describe('Fill tab with template', function () {
    it('fill tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        browser.executeScript(tab_ctn)
        browser.compareScreen(element(By.id('templateTab')), 'fill_tab_template_material_theme');
    },1200000);
    it('fill tab with template in fabric theme', function () {
        browser.load('/demos/tab/template-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'fill_tab_template_fabric_theme');
    },1200000);
    it('fill tab with template in bootstrap theme', function () {
        browser.load('/demos/tab/template-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'fill_tab_template_bootstrap_theme');
    },1200000);
    it('enable close button in fill tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'fill_tab_template_close_btn_material_theme');
    },1200000);
    it('enable RTL in fill tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'fill_tab_template_rtl_material_theme');
    },1200000);
    it('enable orientation in fill tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'fill_tab_template_orientation_material_theme');
    },1200000);

    it('enable close button in fill tab with template in fabric theme', function () {
        browser.load('/demos/tab/template-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('templateTab')), 'fill_tab_template_close_btn_fabric_theme');
    },1200000);
    it('enable RTL in fill tab with template in fabric theme', function () {
        browser.load('/demos/tab/template-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('templateTab')), 'fill_tab_template_rtl_fabric_theme');
    },1200000);
    it('enable orientation in fill tab with template in fabric theme', function () {
        browser.load('/demos/tab/template-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('templateTab')), 'fill_tab_template_orientation_fabric_theme');
    },1200000);

    it('enable close button in fill tab with template in bootstrap theme', function () {
        browser.load('/demos/tab/template-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('templateTab')), 'fill_tab_template_close_btn_boot_theme');
    },1200000);
    it('enable RTL in fill tab with template in bootstrap theme', function () {
        browser.load('/demos/tab/template-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('templateTab')), 'fill_tab_template_rtl_bootstrap_theme');
    },1200000);
    it('enable orientation in fill tab with template in bootstrap theme', function () {
        browser.load('/demos/tab/template-bootstrap.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_fill').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('templateTab')), 'fill_tab_template_orientation_bootstrap_theme');
    },1200000);
});

describe('Background tab with template', function () {
    it('background tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        browser.executeScript(tab_ctn)
        browser.compareScreen(element(By.id('templateTab')), 'background_tab_template_material_theme');
    },1200000);
    it('background tab with template in fabric theme', function () {
        browser.load('/demos/tab/template-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'background_tab_template_fabric_theme');
    },1200000);
    it('enable close button in background tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'background_tab_template_close_btn_material_theme');
    },1200000);
    it('enable RTL in background tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'background_tab_template_rtl_material_theme');
    },1200000);
    it('enable orientation in background tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'background_tab_template_orientation_material_theme');
    },1200000);
    
    it('enable close button in background tab with template in fabric theme', function () {
        browser.load('/demos/tab/template-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('templateTab')), 'background_tab_template_close_btn_fabric_theme');
    },1200000);
    //it('enable RTL in background tab with template in fabric theme', function () {
    //    browser.load('/demos/tab/template-fabric.html');
    //    load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
    //    let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
    //    let tab_ctn2: string = "document.getElementById('btn_enableRtl').click();" ;
    //    browser.executeScript(tab_ctn1)
    //    browser.executeScript(tab_ctn2)
    //    load_delay(300, 'sleep')
    //    browser.compareScreen(element(By.id('templateTab')), 'background_tab_template_rtl_fabric_theme');
    //},1200000);
    it('enable orientation in background tab with template in fabric theme', function () {
        browser.load('/demos/tab/template-fabric.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn1: string = "document.getElementById('btn_bg').click();" ;
        let tab_ctn2: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn1)
        browser.executeScript(tab_ctn2)
        browser.compareScreen(element(By.id('templateTab')), 'background_tab_template_orientation_fabric_theme');
    },1200000);
});

describe('Accent tab with template', function () {
    it('accent tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        browser.executeScript(tab_ctn)
        browser.compareScreen(element(By.id('templateTab')), 'accent_tab_template_material_theme');
    },1200000);
    it('enable close button in accent tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_closeButton').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'accent_tab_template_close_btn_material_theme');
    },1200000);
    it('enable RTL in accent tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_enableRtl').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'accent_tab_template_rtl_material_theme');
    },1200000);
    it('enable orientation in accent tab with template in material theme', function () {
        browser.load('/demos/tab/template.html');
        load_delay(2000, 'presence',element(By.css('.e-tab.e-keyboard.e-control')));
        let tab_ctn: string = "document.getElementById('btn_accent').click();" ;
        let tab_ctn1: string = "document.getElementById('btn_orientation').click();" ;
        browser.executeScript(tab_ctn)
        browser.executeScript(tab_ctn1)
        browser.compareScreen(element(By.id('templateTab')), 'accent_tab_template_orientation_material_theme');
    },1200000);
});
