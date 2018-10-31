import {browser, element, By , by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 2000);
}
describe('Legend position ', () => {
    let property;
    it('Map Default sample Top', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/legend_shape.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'default_legend');
    });
    it('Map shape layer navigation line 1', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/layer_navigation1.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'layer_navigation1');
    });
    it('Map shape layer navigation line 2', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/layer_navigation2.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'layer_navigation2');
    });
    it('Map shape layer navigation line ', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/layer_navigation.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'layer_navigation');
    });
    it('Map shape navigation line 1', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/sublayer_navigation1.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'sublayer_navigation1');
    });
    it('Map shape navigation line 2', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/sublayer_navigation2.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'sublayer_navigation2');
    });
    it('Map shape border', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/shapeborder.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'shapeborder');
    });
    it('Map shape color', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/shapecolor.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'shapecolor');
    });
    it('Map theme', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/theme.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'theme');
    });
    it('Map margin', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/margin.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'margin');
    });
    it('Map palette', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/palette.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'palette');
    });
    it('Map border', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/border.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'border');
    });
    it('Map background color', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/backgroundcolor.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'backgroundcolor');
    });
    it('Map autofill color', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/autofill.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'autofill');
    });
    it('Map sublayer navigation', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/sublayer_navigation.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'sublayer_navigation');
    });
    it('Map sublayer equal color', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/sublayer_equal.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'sublayer_equal');
    });
    it('Map sublayer Range color', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/sublayer_range.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'sublayer_range');
    });
    it('Map sublayer bubble color', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/sublayer_bubble.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'sublayer_bubble');
    });
    it('Map event print', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/event_print.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'event_print');
    });
    it('Map event', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/event_bubble.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'event_bubble');
    });
    it('Map event', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/event_marker.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'event_marker');
    });
    it('Map event', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/event_layer.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'event_layer');
    });
    it('legend position Bottom', (done: Function) => {
        browser.load('/demos/legend_shape.html');
        property = element(by.id('position'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_bottom");
        done();
    });
    it('legend position Left', (done: Function) => {
        browser.load('/demos/legend_shape.html');
        property = element(by.id('position'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_right");
        done();
    });
    it('legend position Right', (done: Function) => {
        browser.load('/demos/legend_shape.html');
        property = element(by.id('position'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_left");
        done();
    });
    it('legend shape Circle', (done: Function) => {
        browser.load('/demos/legend_shape.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[0].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_circle");
        done();
    });
    it('legend shape Rectangle', (done: Function) => {
        browser.load('/demos/legend_shape.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_rectangle");
        done();
    });
    it('legend shape Triangle', (done: Function) => {
        browser.load('/demos/legend_shape.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_triangle");
        done();
    });
    it('legend shape Diamond', (done: Function) => {
        browser.load('/demos/legend_shape.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_diamond");
        done();
    });
    it('legend shape Cross', (done: Function) => {
        browser.load('/demos/legend_shape.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[4].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_cross");
        done();
    });
    it('legend shape HorizontalLine', (done: Function) => {
        browser.load('/demos/legend_shape.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[6].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_horizontal");
        done();
    });
    it('legend shape VerticalLine', (done: Function) => {
        browser.load('/demos/legend_shape.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[7].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_verticalLine");
        done();
    });
    it('legend shape Pentagon', (done: Function) => {
        browser.load('/demos/legend_shape.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[8].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_pentagon");
        done();
    });
    it('legend shape InvertedTriangle', (done: Function) => {
        browser.load('/demos/legend_shape.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[9].click();
        });
        browser.compareScreen(element(By.id("container")), "legend_inverted");
        done();
    });
    it('treemap theme Material', (done: Function) => {
        browser.load('/demos/theme.html');
        property = element(by.id('theme'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[0].click();
        });
        browser.compareScreen(element(By.id("container")), "maps_theme1");
        done();
    });
    it('treemap theme Far', (done: Function) => {
        browser.load('/demos/theme.html');
        property = element(by.id('theme'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "maps_theme2");
        done();
    });
    it('treemap theme Highcontrast', (done: Function) => {
        browser.load('/demos/theme.html');
        property = element(by.id('theme'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "maps_theme3");
        done();
    });
    it('treemap theme Bootstrap', (done: Function) => {
        browser.load('/demos/theme.html');
        property = element(by.id('theme'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "maps_theme4");
        done();
    });
    it('Map area background', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/maparea.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'maparea');
    });
    it('Map area border', function () {
        // load the sample in driver browser
         browser.get(browser.basePath + '/demos/maparea_border.html');
        // take and compare screen shots.
        browser.driver.sleep(5000);
        browser.compareScreen(element(By.id('container')),'maparea_border');
    });
    it('treemap marker shape Balloon', (done: Function) => {
        browser.load('/demos/markertype.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[0].click();
        });
        browser.compareScreen(element(By.id("container")), "marker_shape0");
        done();
    });
    it('treemap marker shape Rectangle', (done: Function) => {
        browser.load('/demos/markertype.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "marker_shape1");
        done();
    });
    it('treemap marker shape Diamond', (done: Function) => {
        browser.load('/demos/markertype.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "marker_shape2");
        done();
    });
    it('treemap marker shape Cross', (done: Function) => {
        browser.load('/demos/markertype.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "marker_shape3");
        done();
    });
    it('treemap marker shape Star', (done: Function) => {
        browser.load('/demos/markertype.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[4].click();
        });

        browser.compareScreen(element(By.id("container")), "marker_shape4");
        done();
    });
    it('treemap marker shape Diamond', (done: Function) => {
        browser.load('/demos/markertype.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[5].click();
        });
        browser.compareScreen(element(By.id("container")), "marker_shape5");
        done();
    });
    it('treemap marker shape HorizontalLine', (done: Function) => {
        browser.load('/demos/markertype.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[6].click();
        });
        browser.compareScreen(element(By.id("container")), "marker_shape6");
        done();
    });
    it('treemap marker shape VerticalLine', (done: Function) => {
        browser.load('/demos/markertype.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[7].click();
        });
        browser.compareScreen(element(By.id("container")), "marker_shape7");
        done();
    });
    it('treemap marker shape Circle', (done: Function) => {
        browser.load('/demos/markertype.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[8].click();
        });
        browser.compareScreen(element(By.id("container")), "marker_shape8");
        done();
    });
    it('treemap toolbar align', (done: Function) => {
        browser.load('/demos/toolbar.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[0].click();
        });
        browser.compareScreen(element(By.id("container")), "toolbar_align0");
        done();
    });
    it('treemap toolbar align Far', (done: Function) => {
        browser.load('/demos/toolbar.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "toolbar_align1");
        done();
    });
    it('treemap toolbar align Center', (done: Function) => {
        browser.load('/demos/toolbar.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "toolbar_align2");
        done();
    });
    it('treemap toolbar align Near', (done: Function) => {
        browser.load('/demos/toolbar.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "toolbar_align2");
        done();
    });
    it('treemap toolbar Horzontal align Far', (done: Function) => {
        browser.load('/demos/toolbar_verticalalign.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[0].click();
        });
        browser.compareScreen(element(By.id("container")), "toolbar_horizontalalign0");
        done();
    });
    it('treemap toolbar Horzontal align Center', (done: Function) => {
        browser.load('/demos/toolbar_verticalalign.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "toolbar_horizontalalign1");
        done();
    });
    it('treemap toolbar Horzontal align Near', (done: Function) => {
        browser.load('/demos/toolbar_verticalalign.html');
        property = element(by.id('shapes'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "toolbar_horizontalalign2");
        done();
    });
});