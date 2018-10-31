import {browser, element, By , by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}

describe('Map component test spec', function () {
    let property,property_singletap,zoom_continent,property_doubletap;
    it('Map Default sample', function () {
        // load the sample in driver browser
        browser.load('/demos/default.html');
        // take and compare screen shots.
        browser.compareScreen(element(By.id('container')),'default_map_ts');
    });

    it('Projection Sample', function () {
        // load the sample in driver browser
        browser.load('/demos/projection.html');
        // time out for load the map data
        browser.driver.sleep(5000);
        // take and compare screen shots.
        browser.compareScreen(element(By.id('container')),'default_map_project');
    });

    it('Projection-Equirect Sample', function () {
            // load the sample in driver browser
            browser.load('/demos/projection.html');
            property = element(by.id('projectiontype'));
            // to choose the dropdown list value
            property.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
            // take and compare screen shots.
            browser.compareScreen(element(By.id('container')),'project_equirect');
        });
    it('Projection-Miller Sample', function () {
            // load the sample in driver browser
            browser.load('/demos/projection.html');
            property = element(by.id('projectiontype'));
            property.all(by.tagName('option'))
            .then((options: any) => {
                options[2].click();
            });
            // take and compare screen shots.
            browser.compareScreen(element(By.id('container')),'project_miller');
        });
    it('Projection-Eckert3 Sample', function () {
            // load the sample in driver browser
            browser.load('/demos/projection.html');
            property = element(by.id('projectiontype'));
            property.all(by.tagName('option'))
            .then((options: any) => {
                options[3].click();
            });
            // take and compare screen shots.
            browser.compareScreen(element(By.id('container')),'project_Eckert3');
        });
    it('Projection-Eckert5 Sample', function () {
            // load the sample in driver browser
            browser.load('/demos/projection.html');
            property = element(by.id('projectiontype'));
            property.all(by.tagName('option'))
            .then((options: any) => {
                options[4].click();
            });
            // take and compare screen shots.
            browser.compareScreen(element(By.id('container')),'project_Eckert5');
        });
    it('Projection-Eckert6 Sample', function () {
            // load the sample in driver browser
            browser.load('/demos/projection.html');
            property = element(by.id('projectiontype'));
            property.all(by.tagName('option'))
            .then((options: any) => {
                options[5].click();
            });
            // take and compare screen shots.
            browser.compareScreen(element(By.id('container')),'project_Eckert6');
        });
    it('Projection-Winkel3 Sample', function () {
            // load the sample in driver browser
            browser.load('/demos/projection.html');
            property = element(by.id('projectiontype'));
            property.all(by.tagName('option'))
            .then((options: any) => {
                options[6].click();
            });
            // take and compare screen shots.
            browser.compareScreen(element(By.id('container')),'project_Winkel3');
        });
    it('Projection-AitOff Sample', function () {
            // load the sample in driver browser
            browser.load('/demos/projection.html');
            property = element(by.id('projectiontype'));
            property.all(by.tagName('option'))
            .then((options: any) => {
                options[7].click();
            });
            // take and compare screen shots.
            browser.compareScreen(element(By.id('container')),'project_AitOff');
        });
    it('Multilayer Sample', function () {
            // load the sample in driver browser
            browser.load('/demos/multilayer.html');
             // time out for load the map data
            browser.driver.sleep(5000);
            // take and compare screen shots.
            browser.compareScreen(element(By.id('container')),'map_multilayer');
        });
    it('Marker Sample', function () {
        // load the sample in driver browser
        browser.load('/demos/marker.html');
        // time out for load the map data
        browser.driver.sleep(20000);
        // take and compare screen shots.
        browser.compareScreen(element(By.id('container')),'map_marker');     
            });
    it('Marker Template Sample', function () {
         // load the sample in driver browser
         browser.load('/demos/markertemplate.html');
         // time out for load the map data
         browser.driver.sleep(5000); 
         // take and compare screen shots.
         browser.compareScreen(element(By.id('markertemp')),'map_marker_template');         
                });
    it('Bubble Sample', function () {
           // load the sample in driver browser
           browser.load('/demos/bubble.html');
           // time out for load the map data
           browser.driver.sleep(5000);
           // take and compare screen shots.
           browser.compareScreen(element(By.id('container')),'map_bubble');
       });         
    it('Navigation Line Sample', function () {
           // load the sample in driver browser
           browser.load('/demos/lineapeninsular.html');
           // time out for load the map data
           browser.driver.sleep(5000);
           // take and compare screen shots.
           browser.compareScreen(element(By.id('container')),'map_navigationline');
       });               
    it('Legend Sample', function () {
           // load the sample in driver browser
           browser.load('/demos/legend.html');
           // time out for load the map data
           browser.driver.sleep(5000);
           // take and compare screen shots.
           browser.compareScreen(element(By.id('container')),'map_legend');
       });              
    it('Annotation Sample', function () {
         // load the sample in driver browser
         browser.load('/demos/annotation.html');
         // time out for load the map data
        browser.driver.sleep(5000);
         // take and compare screen shots.
         browser.compareScreen(element(By.id('maps')),'map_annotation');
     });                   
    it('Labels Sample', function () {
         // load the sample in driver browser
         browser.load('/demos/datalabel.html');
         // time out for load the map data
         browser.driver.sleep(5000);
         // take and compare screen shots.
         browser.compareScreen(element(By.id('datalabel')),'map_label');
     });
    it('Labels unchecked Sample', function () {
          // load the sample in driver browser
          browser.load('/demos/datalabel.html');
          property =element(by.id('select'));
          browser.actions().click(property).perform();
          // time out for load the map data
          browser.driver.sleep(5000);
          // take and compare screen shots.
          browser.compareScreen(element(By.id('datalabel')),'map_labels_unchecked');
      });
    it('Smart Lable none mode', function () {
          // load the sample in driver browser
          browser.load('/demos/datalabel.html');
          property = element(by.id('smartlabelmode'));
          property.all(by.tagName('option'))
          .then((options: any) => {
              options[1].click();
          });
          // time out for load the map data
          browser.driver.sleep(5000);
          // take and compare screen shots.
          browser.compareScreen(element(By.id('datalabel')),'smartlable_none');
      });
    it('Smart Lable Hide mode', function () {
          // load the sample in driver browser
          browser.load('/demos/datalabel.html');
          property = element(by.id('smartlabelmode'));
          property.all(by.tagName('option'))
          .then((options: any) => {
              options[2].click();
          });
          // time out for load the map data
          browser.driver.sleep(5000);
          // take and compare screen shots.
          browser.compareScreen(element(By.id('datalabel')),'smartlable_hide');
      });
    it('Intersect action Trim mode', function () {
          // load the sample in driver browser
          browser.load('/demos/datalabel.html');
          property = element(by.id('intersectaction'));
          property.all(by.tagName('option'))
          .then((options: any) => {
              options[1].click();
          });
          // time out for load the map data
          browser.driver.sleep(5000);
          // take and compare screen shots.
          browser.compareScreen(element(By.id('datalabel')),'intersect_trim');
      });
    it('Intersect action Hide mode', function () {
          // load the sample in driver browser
          browser.load('/demos/datalabel.html');
          property = element(by.id('intersectaction'));
          property.all(by.tagName('option'))
          .then((options: any) => {
              options[2].click();
          });
          // time out for load the map data
          browser.driver.sleep(5000);
          // take and compare screen shots.
          browser.compareScreen(element(By.id('datalabel')),'intersect_hide');
      });
    it('Tooltip Sample', function () {
         // load the sample in driver browser
         browser.load('/demos/tooltip.html');
          // time out for load the map data
          browser.driver.sleep(5000);
         // take and compare screen shots.
         browser.compareScreen(element(By.id('container')),'map_tooltip');
     });  
    it('Selection-Default Sample', function () {
         // load the sample in driver browser
         browser.load('/demos/selection.html');
          // time out for load the map data
          browser.driver.sleep(5000);
        // take and compare screen shots.
        browser.compareScreen(element(By.id('container')),'map_selection_default');
    });  
    it('Selection and highlight Sample', function () {
             // load the sample in driver browser
    browser.load('/demos/selection.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    // to select the red color region
    property=element(by.id("container_LayerIndex_0_ShapeIndex_14_dataIndex_50"));
    browser.actions().click(property).perform();
    // take and compare screen shots.
    browser.compareScreen(element(By.id('container')),'map_selection_red');
    //to select the blue color region
    property=element(by.id("container_LayerIndex_0_ShapeIndex_10_dataIndex_28"));
    browser.actions().click(property).perform();
    // take and compare screen shots.
    browser.compareScreen(element(By.id('container')),'map_selection_blue');
 });  
    it('Zooming-Default Sample', function () {
        // load the sample in driver browser
        browser.load('/demos/zooming.html');
         // time out for load the map data
         browser.driver.sleep(5000);
        // take and compare screen shots.
        browser.compareScreen(element(By.id('mapszooming')),'map_zooming');
    });  
    it('Zoom-in Sample', function () {
        // load the sample in driver browser
        browser.load('/demos/zooming.html');
         // time out for load the map data
         browser.driver.sleep(5000);
        property =element(by.id('mapszooming_Zooming_ToolBar_ZoomIn_Rect'));
        browser.actions().click(property).perform();
        // take and compare screen shots.
        browser.compareScreen(element(By.id('mapszooming')),'map_zoomin_icon');
        property =element(by.id('mapszooming_Zooming_ToolBar_ZoomOut_Rect'));
        browser.actions().click(property).perform();
        // take and compare screen shots.
        browser.compareScreen(element(By.id('mapszooming')),'map_zoomout_icon');
    });  
    it('Zoom-Reset Sample', function () {
        // load the sample in driver browser
        browser.load('/demos/zooming.html');
         // time out for load the map data
         browser.driver.sleep(5000);
        property =element(by.id('mapszooming_Zooming_ToolBar_ZoomIn_Rect'));
        browser.actions().click(property).perform();
        property =element(by.id('mapszooming_Zooming_ToolBar_Reset_Rect'));
        browser.actions().click(property).perform();
        // take and compare screen shots.
        browser.compareScreen(element(By.id('mapszooming')),'map_zoom_reset_icon');
    });   
    it('Zoom by single-click Sample', function () {
        // load the sample in driver browser
        browser.load('/demos/zooming.html');
        property_singletap =element(by.id('singletap'));
        browser.actions().click(property_singletap).perform();
        property =element(by.id('mapszooming_Zooming_ToolBar_Zoom_Rect'));
        browser.actions().click(property).perform();
        zoom_continent=element(by.id("mapszooming_LayerIndex_0_ShapeIndex_134_dataIndex_1"));
        browser.actions().click(zoom_continent).perform();
        // take and compare screen shots.
        browser.compareScreen(element(By.id('mapszooming')),'map_zoom_singletap');
    });   
it('HeatMap Sample', function () {
    // load the sample in driver browser
    browser.load('/demos/heatmap.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('container')),'heat_map');
}); 
it('HeatMap-selection Sample', function () {
    // load the sample in driver browser
    browser.load('/demos/heatmap.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    property = element(by.id('container_LayerIndex_0_ShapeIndex_61_dataIndex_0'));
    browser.actions().click(property).perform();
    // take and compare screen shots.
    browser.compareScreen(element(By.id('container')),'heat_map_selection');
});   
it('Flights from India to china Sample', function () {
    // load the sample in driver browser
    browser.load('/demos/curvedlines.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('container')),'flights_sample');
}); 
it('Earthquake Sample', function () {
    // load the sample in driver browser
    browser.load('/demos/earthquake.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('maps')),'earthquake');
});         
it('ATM location Sample', function () {
    // load the sample in driver browser
    browser.load('/demos/highlightedregion.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('container')),'map_location');
});    
it('Map with Pie chart', function () {
    // load the sample in driver browser
    browser.load('/demos/pie.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('container')),'map_pie_chart');
});  
it('Seat Selection', function () {
    // load the sample in driver browser
    browser.load('/demos/seatSelection.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('border')),'seat_selection');
});  
it('Seat Selection and clear', function () {
    // load the sample in driver browser
    browser.load('/demos/seatSelection.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    property=element(by.id("maps_LayerIndex_0_ShapeIndex_20_dataIndex_null"));
    browser.actions().click(property).perform();
      // take and compare screen shots.
    browser.compareScreen(element(By.id('border')),'seat_selection_dynamic');
    // to clear selection
    property=element(by.id("clear-btn"));
    browser.actions().click(property).perform();
    // take and compare screen shots.
    browser.compareScreen(element(By.id('border')),'seat_selection_clear');
});  
it('Drilldown Sample', function () {
    // load the sample in driver browser
    browser.load('/demos/drilldown.html');
     // time out for load the map data
    browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('mapdrilldown')),'map_drilldown');
});  
it('Drilldown-asia Sample', function () {
    // load the sample in driver browser
    browser.load('/demos/drilldown.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    property =element(by.id('mapdrilldown_LayerIndex_0_ShapeIndex_29_dataIndex_4'));
    browser.actions().click(property).perform();
     // time out for load the map data
     browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('mapdrilldown')),'map_drilldown_asia');
});  
it('Drilldown-australia Sample', function () {
    // load the sample in driver browser
    browser.load('/demos/drilldown.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    property =element(by.id('mapdrilldown_LayerIndex_0_ShapeIndex_119_dataIndex_5'));
    browser.actions().click(property).perform();
     // time out for load the map data
     browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('mapdrilldown')),'map_drilldown_australia');
});  
it('Drilldown-africa Sample', function () {
    // load the sample in driver browser
    browser.load('/demos/drilldown.html');
      // time out for load the map data
      browser.driver.sleep(5000);
    property =element(by.id('mapdrilldown_LayerIndex_0_ShapeIndex_32_dataIndex_2'));
    browser.actions().click(property).perform();
    // time out for load the map data
    browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('mapdrilldown')),'map_drilldown_africa');
});
it('Drilldown-europe Sample', function () {
    // load the sample in driver browser
    browser.load('/demos/drilldown.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    property =element(by.id('mapdrilldown_LayerIndex_0_ShapeIndex_48_dataIndex_3'));
    browser.actions().click(property).perform();
     // time out for load the map data
     browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('mapdrilldown')),'map_drilldown_europe');
});   
it('Drilldown-north-america Sample', function () {
    // load the sample in driver browser
    browser.load('/demos/drilldown.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    property =element(by.id('mapdrilldown_LayerIndex_0_ShapeIndex_167_dataIndex_0'));
    browser.actions().click(property).perform();
     // time out for load the map data
     browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('mapdrilldown')),'map_drilldown_north_america');
});   
it('Drilldown-south-america Sample', function () {
    // load the sample in driver browser
    browser.load('/demos/drilldown.html');
     // time out for load the map data
     browser.driver.sleep(5000);
    property =element(by.id('mapdrilldown_LayerIndex_0_ShapeIndex_130_dataIndex_1'));
    browser.actions().click(property).perform();
     // time out for load the map data
     browser.driver.sleep(5000);
    // take and compare screen shots.
    browser.compareScreen(element(By.id('mapdrilldown')),'map_drilldown_south_america');
});
});
