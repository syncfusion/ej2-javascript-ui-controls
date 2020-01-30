import {browser, element, By , by, Key } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
let smart, intersect, legendPos, mode, type;
describe('Checking with SampleBrowser for DataLabel', function () {    
    it('Checking with Multilayer Format Tooltip', (done: Function) => {
        browser.load('/demos/multilayer.html');
        browser.actions().mouseMove(element(By.id('container_LayerIndex_2_MarkerIndex_0_dataIndex_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'Multilyer_TooltipFormat');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Multilayer_ZoomIn');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Multilayer_Reset');
        done();
    });
    it('checking with Tooltip Sample', (done: Function) => {
        browser.load('/demos/tooltip.html');
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_shapeIndex_72_dataIndex_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'Tooltip_TooltipTemplate');
        done();
    });
    it('Checking with datalabel both smart and intersect as None', (done: Function) => {
        browser.load('/demos/datalabel.html');
        browser.compareScreen(element(by.id('datalabel')), 'SmartandIntersect_None');
        done();
    });
    it('Checking with label for smart as none and intersect as Trim', (done: Function) => {
        browser.load('/demos/datalabel.html');
        intersect = element(By.id('intersectaction'));
        intersect.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        browser.compareScreen(element(by.id('datalabel')), 'Smart_None_Intersect_Trim');
        done();
    });
    it('Checking with label for smart as none and intersect as Hide', (done: Function) => {
        browser.load('/demos/datalabel.html');
        intersect = element(By.id('intersectaction'));
        intersect.all(by.tagName('option')).then((options: any) => {
            options[2].click;
        });
        browser.compareScreen(element(by.id('datalabel')), 'Smart_None_Intersect_Hide');
        done();
    });
    it('Checking with label for smart as Trim and intersect as None', (done: Function) => {
        browser.load('/demos/datalabel.html');
        smart = element(By.id('smartlabelmode'));
        smart.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        browser.compareScreen(element(by.id('datalabel')), 'Smart_Trim_Intersect_None');
        done();
    });
    it('checking with labels for smart and intersect as trim', (done: Function) => {
        browser.load('/demos/datalabel.html');
        smart.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        intersect.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        browser.compareScreen(element(by.id('datalabel')), 'SmartandIntersect_Trim');
        done();
    });
    it('Checking with label for smart as Trim and intersect as Hide', (done: Function) => {
        browser.load('/demos/datalabel.html');
        smart.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        intersect = element(By.id('intersectaction'));
        intersect.all(by.tagName('option')).then((options: any) => {
            options[2].click;
        });
        browser.compareScreen(element(by.id('datalabel')), 'Smart_Trim_Intersect_Hide');
        done();
    });
    it('Checking with label for smart as Hide and intersect as None', (done: Function) => {
        browser.load('/demos/datalabel.html');
        smart = element(By.id('smartlabelmode'));
        smart.all(by.tagName('option')).then((options: any) => {
            options[2].click;
        });
        browser.compareScreen(element(by.id('datalabel')), 'Smart_Hide_Intersect_None');
        done();
    });
    it('checking with labels for smart as Hide and intersect as trim', (done: Function) => {
        browser.load('/demos/datalabel.html');
        smart.all(by.tagName('option')).then((options: any) => {
            options[2].click;
        });
        intersect.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        browser.compareScreen(element(by.id('datalabel')), 'Smart_Hide_Intersect_Trim');
        done();
    });
    it('Checking with label for smart and intersect as Hide', (done: Function) => {
        browser.load('/demos/datalabel.html');
        smart.all(by.tagName('option')).then((options: any) => {
            options[2].click;
        });
        intersect = element(By.id('intersectaction'));
        intersect.all(by.tagName('option')).then((options: any) => {
            options[2].click;
        });
        browser.compareScreen(element(by.id('datalabel')), 'SmartandIntersect_Hide');
        done();
    });
});


describe('Checking with legend Sample', function () {
    it('Checking with Legend Mode Default and Position in Top', (done: Function) => {
        browser.load('/demos/SamplesInBrowser/Legend.html');
        browser.compareScreen(element(By.id('container')), 'LegendPos_Default_Top');
        browser.actions().click(element(By.id('toggleLegend'))).perform();
        browser.actions().click(element(By.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Top_Toggle1');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Top_Toggle2');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_2'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Top_Toggle3');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Top_Toggle4');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_4'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Top_Toggle5');
        done();
    });
    it('Checking with Legend Mode Default and Position in Bottom', (done: Function) => {
        browser.load('/demos/SamplesInBrowser/Legend.html');
        legendPos = element(By.id('legendPosition'));
        legendPos.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        browser.compareScreen(element(By.id('container')), 'LegendPos_Default_Bottom');
        browser.actions().click(element(By.id('toggleLegend'))).perform();
        browser.actions().click(element(By.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Bottom_Toggle1');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Bottom_Toggle2');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_2'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Bottom_Toggle3');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Bottom_Toggle4');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_4'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Bottom_Toggle5');
        done();
    });
    it('Checking with Legend Mode Default and Position in Left', (done: Function) => {
        browser.load('/demos/SamplesInBrowser/Legend.html');
        legendPos = element(By.id('legendPosition'));
        legendPos.all(by.tagName('option')).then((options: any) => {
            options[2].click;
        });
        browser.compareScreen(element(By.id('container')), 'LegendPos_Default_Left');
        browser.actions().click(element(By.id('toggleLegend'))).perform();
        browser.actions().click(element(By.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Left_Toggle1');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Left_Toggle2');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_2'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Left_Toggle3');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Left_Toggle4');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_4'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Left_Toggle5');
        done();
    });
    it('Checking with Legend Mode Default and Position in Right', (done: Function) => {
        browser.load('/demos/SamplesInBrowser/Legend.html');
        legendPos = element(By.id('legendPosition'));
        legendPos.all(by.tagName('option')).then((options: any) => {
            options[3].click;
        });
        browser.compareScreen(element(By.id('container')), 'LegendPos_Default_Right');
        browser.actions().click(element(By.id('toggleLegend'))).perform();
        browser.actions().click(element(By.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Right_Toggle1');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Right_Toggle2');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_2'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Right_Toggle3');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Right_Toggle4');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_4'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Default_Right_Toggle5');
        done();
    });
     it('Checking with Legend Mode Interactive and Position in Top', (done: Function) => {
        browser.load('/demos/SamplesInBrowser/Legend.html');
        mode = element(By.id('legendMode'));
        mode.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        browser.compareScreen(element(By.id('container')), 'LegendPos_Interactive_Top');
        browser.actions().click(element(By.id('toggleLegend'))).perform();
        browser.actions().click(element(By.id('container_Legend_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Top_Toggle1');
        browser.actions().click(element(By.id('container_Legend_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Top_Toggle2');
        browser.actions().click(element(By.id('container_Legend_Index_2'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Top_Toggle3');
        browser.actions().click(element(By.id('container_Legend_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Top_Toggle4');
        browser.actions().click(element(By.id('container_Legend_Index_4'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Top_Toggle5');
        done();
    });
    it('Checking with Legend Mode Interactive and Position in Bottom', (done: Function) => {
        browser.load('/demos/SamplesInBrowser/Legend.html');
        legendPos = element(By.id('legendPosition'));
        mode.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        legendPos.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        browser.compareScreen(element(By.id('container')), 'LegendPos_Interactive_Bottom');
        browser.actions().click(element(By.id('toggleLegend'))).perform();
        browser.actions().click(element(By.id('container_Legend_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Bottom_Toggle1');
        browser.actions().click(element(By.id('container_Legend_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Bottom_Toggle2');
        browser.actions().click(element(By.id('container_Legend_Index_2'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Bottom_Toggle3');
        browser.actions().click(element(By.id('container_Legend_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Bottom_Toggle4');
        browser.actions().click(element(By.id('container_Legend_Index_4'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Bottom_Toggle5');
        done();
    });
    it('Checking with Legend Mode Interactive and Position in Left', (done: Function) => {
        browser.load('/demos/SamplesInBrowser/Legend.html');
        legendPos = element(By.id('legendPosition'));
        mode.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        legendPos.all(by.tagName('option')).then((options: any) => {
            options[2].click;
        });
        browser.compareScreen(element(By.id('container')), 'LegendPos_Interactive_Left');
        browser.actions().click(element(By.id('toggleLegend'))).perform();
        browser.actions().click(element(By.id('container_Legend_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Left_Toggle1');
        browser.actions().click(element(By.id('container_Legend_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Left_Toggle2');
        browser.actions().click(element(By.id('container_Legend_Index_2'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Left_Toggle3');
        browser.actions().click(element(By.id('container_Legend_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Left_Toggle4');
        browser.actions().click(element(By.id('container_Legend_Index_4'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Left_Toggle5');
        done();
    });
    it('Checking with Legend Mode Interactive and Position in Right', (done: Function) => {
        browser.load('/demos/SamplesInBrowser/Legend.html');
        legendPos = element(By.id('legendPosition'));
        mode.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        legendPos.all(by.tagName('option')).then((options: any) => {
            options[3].click;
        });
        browser.compareScreen(element(By.id('container')), 'LegendPos_Interactive_Right');
        browser.actions().click(element(By.id('toggleLegend'))).perform();
        browser.actions().click(element(By.id('container_Legend_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Right_Toggle1');
        browser.actions().click(element(By.id('container_Legend_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Right_Toggle2');
        browser.actions().click(element(By.id('container_Legend_Index_2'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Right_Toggle3');
        browser.actions().click(element(By.id('container_Legend_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Right_Toggle4');
        browser.actions().click(element(By.id('container_Legend_Index_4'))).perform();
        browser.compareScreen(element(By.id('container')), 'Legend_Interactive_Right_Toggle5');
        done();
    });
 });
describe('Checking Sample Browser for Map Providers', function () {
    it('Checking with OSM', (done: Function) => {
        browser.load('/demos/SamplesInBrowser/OSM.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'OSM_MarkerTemplate');
        done();
    });
    it('Checking with OSM Tooltip Template', (done: Function) => {
        browser.load('/demos/SamplesInBrowser/OSM.html');
        browser.sleep(2000);
        browser.actions().mouseMove(element(By.id('container'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMOSM_MarkerTemplate_TooltipTemplate');
        done();
    });
    it('Checking with OSM Sublayer', (done: Function) => {
        browser.load('/demos/SamplesInBrowser/OSMSublayer.html');
        browser.sleep(2000);
        browser.compareScreen(element(by.id('container')), 'OSM_Sublayer');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSM_Sublayer_Zoom');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomOut_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMSublayer_Zoomout');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMSublayer_Reset');
        done();
    });
    it('Checking with OSM Navigation Line and MarkerTemplate with tooltip', (done: Function) => {
        browser.load('/demos/SamplesInBrowser/OSMNavigation.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'OSM_Navigation_MarkerTemplate');
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_MarkerIndex_3_dataIndex_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSM_Navigation_MarkerTemplate_Tooltip1');
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_MarkerIndex_1_dataIndex_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSM_Navigation_MarkerTemplate_Tooltip2');
        done();
    });
});



// describe('Checking with Dynamic Marker Sample', function () {
//   it('Checking with adding marker Image dynamically', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSMDynamic_Marker');
//         done();
//     });
//     it('Checking with adding Marker Image with line', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Image_Line');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('3'+ Key.ENTER);
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_line_width');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Image_Zoomin');
//         done();
//     });
//     it('Checking with adding Marker Image with connected line', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('connect'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Image_LineWidth');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('5'+ Key.ENTER);
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Image_LineWidth');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Image_Zoomin');
//         browser.actions().click(element(By.id('togglebtn'))).perform();
//         browser.compareScreen(element(By.id('container')), 'DynamicaMarker_Clear');
//         done();
//     });
//     it('Checking with adding marker Circle dynamically', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[1].click;
//         });
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSMDynamic_Marker_Circle');
//         done();
//     });
//     it('Checking with adding Marker Circle with line', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[1].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Circle_Line');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('3'+ Key.ENTER);
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Circle_line_width');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Circle_Zoomin');
//         done();
//     });
//     it('Checking with adding Marker Circle with connected line', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         type.all(by.tagName('option')).then((options: any) => {
//             options[1].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('connect'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Circle_ConnectLine');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('5'+ Key.ENTER);
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Circle_ConnectLineWidth');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Circle_Zoomin');
//         browser.actions().click(element(By.id('togglebtn'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSMDynamicaMarker_Circle_Clear');
//         done();
//     });
//     it('Checking with adding marker Diamond dynamically', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[2].click;
//         });
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSMDynamic_Marker_Diamond');
//         done();
//     });
//     it('Checking with adding Marker Diamond with line', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[2].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Diamond_Line');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('3'+ Key.ENTER);
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Diamond_line_width');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Diamond_Zoomin');
//         done();
//     });
//     it('Checking with adding Marker Diamond with connected line', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         type.all(by.tagName('option')).then((options: any) => {
//             options[2].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('connect'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Diamond_ConnectLine');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('5'+ Key.ENTER);
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Diamond_ConnectLineWidth');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Diamond_Zoomin');
//         browser.actions().click(element(By.id('togglebtn'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSMDynamicaMarker_Diamond_Clear');
//         done();
//     });
//     it('Checking with adding marker Star dynamically', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[3].click;
//         });
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSMDynamic_Marker_Star');
//         done();
//     });
//     it('Checking with adding Marker Star with line', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[3].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Star_Line');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('3'+ Key.ENTER);
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Star_line_width');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Star_Zoomin');
//         done();
//     });
//     it('Checking with adding Marker Star with connected line', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         type.all(by.tagName('option')).then((options: any) => {
//             options[3].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('connect'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Star_ConnectLine');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('5'+ Key.ENTER);
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Star_ConnectLineWidth');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Star_Zoomin');
//         browser.actions().click(element(By.id('togglebtn'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OsmDynamicaMarker_Star_Clear');
//         done();
//     });
//     it('Checking with adding marker Triangle dynamically', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[4].click;
//         });
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSMDynamic_Marker_Triangle');
//         done();
//     });
//     it('Checking with adding Marker Triangle with line', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[3].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Triangle_Line');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('3'+ Key.ENTER);
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Triangle_line_width');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Triangle_Zoomin');
//         done();
//     });
//     it('Checking with adding Marker Triangle with connected line', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/DynamicMarker.html');
//         browser.sleep(3000);
//         type.all(by.tagName('option')).then((options: any) => {
//             options[3].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('connect'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Triangle_ConnectLine');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('5'+ Key.ENTER);
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.actions().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Triangle_ConnectLineWidth');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OSM_Marker_Triangle_Zoomin');
//         browser.actions().click(element(By.id('togglebtn'))).perform();
//         browser.compareScreen(element(By.id('container')), 'OsmDynamicaMarker_Triangle_Clear');
//         done();
//     });
// });