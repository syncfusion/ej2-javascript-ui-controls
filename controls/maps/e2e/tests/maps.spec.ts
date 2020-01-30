/**
 * new spec
 */

import {browser, element, By , by , Key} from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";


if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
let property,clustershape, tooltip, legend, legendShape, type, zoom, mode ;
describe('Marker Clustering Event Spec and bubble Type', function () { 
    it('Marker Cluster Rendering Event testing shape', (done: Function) => {
        browser.load("/demos/event_markerCluster.html");
        browser.compareScreen(element(By.id("container")), "markerCluterRenderEvent-Shape");
        done();
    });
    it('Marker Cluster Rendering Event testing Fill', (done: Function) => {
        browser.load("/demos/event_markerCluster-1.html");
        browser.compareScreen(element(By.id("container")), "markerCluterRenderEvent-Fill");
        done();
    });
    it('Marker Cluster Rendering Event testing Height and Width', (done: Function) => {
        browser.load("/demos/event_markerCluster-2.html");
        browser.compareScreen(element(By.id("container")), "markerCluterRenderEvent-HeightAndWidth");
        done();
    });
    it('Marker Cluster Rendering Event testing Border', (done: Function) => {
        browser.load("/demos/event_markerCluster-3.html");
        browser.compareScreen(element(By.id("container")), "markerCluterRenderEvent-Border");
        done();
    });
    it('Checking bubble type as Rectangle', (done: Function) => {
        browser.load('/demos/bubble.html');
        property = element(by.id('bubble'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id('container')), 'map_bubble_Rectangle');
        browser.actions().click(element(by.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Bubble_Zoom');
        done();
    });
    it('Checking with toolip Template in Shapes', (done: Function) => {
        browser.load('/demos/tooltip.html');
        browser.sleep(3000);
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_shapeIndex_56_dataIndex_9'))).perform();
        browser.compareScreen(element(By.id('container')), 'MapsTooltip_Template');
        done();
    });
});
  describe('Checking with MarkerCluster Expand in Shape', function () {
    // it('Checking Marker Clustering Expand', (done: Function) => {
    //     browser.load('/demos/markerClusteringExpand.html');
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();    
    //     browser.compareScreen(element(By.id('container')), 'default_markerClusterExp_imageShape');
    //     browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_0_cluster_0"))).perform();
    //     browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_6"))).perform();
    //     browser.compareScreen(element(By.id("container")), 'ZoomDefault_MarkerCluster_TooltipmouseMove');
    //     browser.findElement(By.id('tooltip')).sendKeys("Click");
    //     // tooltip = element(by.id('tooltip'));
    //     // tooltip.all(by.tagName('option')).then((options: any) => {
    //     //     options[1].click();
    //     // });
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_26"))).perform();
    //     browser.compareScreen(element(By.id('container')), 'ZoommarkerClusterExp_clickTooltip');
    //     browser.findElement(By.id('tooltip')).sendKeys("DoubleClick");
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_0_cluster_0"))).perform();
    //     browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_3"))).perform();
    //     browser.compareScreen(element(By.id('container')), 'ZoommarkerClusterExp_doubleClickTooltip');
    //     done();
    // });
    // it('Checking Marker Clustering Expand shape Rectangle', (done: Function) => {
    //     browser.load('/demos/markerClusteringExpand.html');
    //     clustershape = element(by.id('shapes'));
    //     clustershape.all(by.tagName('option')).then((options: any) => {
    //         options[2].click();
    //     });
    //     browser.compareScreen(element(By.id('container')), 'map_markerClusterExp_RectangleShape');
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_0_cluster_0"))).perform();
    //     browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_13"))).perform();
    //     browser.compareScreen(element(By.id('container')), 'markerClusterExp_Rect_TooltipmouseMove');        
    //     tooltip = element(by.id('tooltip'));
    //     tooltip.all(by.tagName('option')).then((options: any) => {
    //         options[1].click();
    //     });
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
    //     browser.compareScreen(element(By.id('container')), 'markerClusterExp_Rectangle_clickTooltip');
    //     tooltip = element(by.id('tooltip'));
    //     tooltip.all(by.tagName('option')).then((options: any) => {
    //         options[2].click();
    //     });
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
    //     browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_39"))).perform();
    //     browser.compareScreen(element(By.id('container')), 'markerClusterExp_Rectangle_doubleClickTooltip');
    //     done();
    // });
    // it('Checking Marker Clustering Expand shape Balloon', (done: Function) => {
    //     browser.load('/demos/markerClusteringExpand.html');
    //     clustershape = element(by.id('shapes'));
    //     clustershape.all(by.tagName('option')).then((options: any) => {
    //         options[1].click();
    //     });
    //     browser.compareScreen(element(By.id('container')), 'map_markerClusterExp_BalloonShape');
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
    //     browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
    //     browser.compareScreen(element(By.id('container')), 'markerClusterExp_Ball_TooltipmouseMove');        
    //     tooltip = element(by.id('tooltip'));
    //     tooltip.all(by.tagName('option')).then((options: any) => {
    //         options[1].click();
    //     });
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_0_cluster_0"))).perform();
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_6"))).perform();
    //     browser.compareScreen(element(By.id('container')), 'markerClusterExp_Balloon_clickTooltip');
    //     tooltip.all(by.tagName('option')).then((options: any) => {
    //         options[2].click();
    //     });
    //     browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
    //     browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
    //     browser.compareScreen(element(By.id('container')), 'markerClusterExp_Balloon_doubleClickTooltip');
    //     done();
    // });
    it('Checking Marker Clustering Expand shape Triangle', (done: Function) => {
        browser.load('/demos/markerClusteringExpand.html');
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id('container')), 'map_markerClusterExp_TriangleShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Triangle_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Triangle_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Triangle_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Diamond', (done: Function) => {
        browser.load('/demos/markerClusteringExpand.html');
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[4].click();
        });
        browser.compareScreen(element(By.id('container')), 'map_markerClusterExp_DiamondShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Diamond_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Triangle_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Diamond_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Cross', (done: Function) => {
        browser.load('/demos/markerClusteringExpand.html');
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[5].click();
        });
        browser.compareScreen(element(By.id('container')), 'map_markerClusterExp_CrossShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Cross_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Cross_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Cross_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Star', (done: Function) => {
        browser.load('/demos/markerClusteringExpand.html');
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[6].click();
        });
        browser.compareScreen(element(By.id('container')), 'map_markerClusterExp_StarShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Star_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Star_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Star_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Horizontal line', (done: Function) => {
        browser.load('/demos/markerClusteringExpand.html');
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[7].click();
        });
        browser.compareScreen(element(By.id('container')), 'map_markerClusterExp_HorLineShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Horiontal_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Horizontal_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Horizontal_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Vertical line', (done: Function) => {
        browser.load('/demos/markerClusteringExpand.html');
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[8].click();
        });
        browser.compareScreen(element(By.id('container')), 'map_markerClusterExp_VerLineShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Vertical_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Vertical_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Vertical_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Circle', (done: Function) => {
        browser.load('/demos/markerClusteringExpand.html');
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[9].click();
        });
        browser.compareScreen(element(By.id('container')), 'map_markerClusterExp_CircleShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Circle_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Circle_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Circle_doubleClickTooltip');
        done();
    });
 });      
 describe('Cluster Expand with TooltipGesture in OSM Maps', function () {
    it('Checking Marker Clustering Expand in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMClusterExpand.html');
        browser.sleep(3000);    
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSM_markerClusterExp_imageShape');

        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.sleep(3000);   
        browser.compareScreen(element(By.id("container")), 'Zoomdefault_markerCluster_OSM');

        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_0_cluster_0"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_11"))).perform();
        browser.compareScreen(element(By.id("container")), 'OSMZoomDefault_MarkerCluster_TooltipmouseMove');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1_datalabel_1"))).perform();
        browser.sleep(2000);
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_43"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMZoommarkerClusterExp_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1_datalabel_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_43"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMZoommarkerClusterExp_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Rectangle in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMClusterExpand.html');
        browser.sleep(3000);    
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id('container')), 'OSM_markerClusterExp_RectangleShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Rect_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Rectangle_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Rectangle_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Balloon in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMClusterExpand.html');
        browser.sleep(3000);    
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id('container')), 'OSM_markerClusterExp_BalloonShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Ball_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.sleep(2000);
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Balloon_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Balloon_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Triangle in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMClusterExpand.html');
        browser.sleep(3000);    
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id('container')), 'OSM_markerClusterExp_TriangleShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Triangle_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Triangle_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Triangle_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Diamond in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMClusterExpand.html');
        browser.sleep(3000);    
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[4].click();
        });
        browser.compareScreen(element(By.id('container')), 'OSM_markerClusterExp_DiamondShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'markerClusterExp_Diamond_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Triangle_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Diamond_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Cross in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMClusterExpand.html');
        browser.sleep(3000);    
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[5].click();
        });
        browser.compareScreen(element(By.id('container')), 'OSM_markerClusterExp_CrossShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Cross_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Cross_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Cross_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Star in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMClusterExpand.html');
        browser.sleep(3000);    
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[6].click();
        });
        browser.compareScreen(element(By.id('container')), 'OSM_markerClusterExp_StarShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Star_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Star_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Star_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Horizontal line in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMClusterExpand.html');
        browser.sleep(3000);    
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[7].click();
        });
        browser.compareScreen(element(By.id('container')), 'OSM_markerClusterExp_HorLineShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Horiontal_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Horizontal_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Horizontal_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Vertical line in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMClusterExpand.html');
        browser.sleep(3000);    
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[8].click();
        });
        browser.compareScreen(element(By.id('container')), 'OSM_markerClusterExp_VerLineShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Vertical_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Vertical_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Vertical_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Circle in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMClusterExpand.html');
        browser.sleep(3000);    
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[9].click();
        });
        browser.compareScreen(element(By.id('container')), 'OSM_markerClusterExp_CircleShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Circle_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[0].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Circle_clickTooltip');
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMmarkerClusterExp_Circle_doubleClickTooltip');
        done();
    });
});
describe('Cluster Expand with TooltipGesture in Bing Maps', function () {
    it('Checking Marker Clustering Expand in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingClusterExpand.html');
        browser.sleep(3000);
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'Bing_markerClusterExp_imageShape');
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.sleep(3000);
        browser.compareScreen(element(By.id("container")), 'Zoomdefault_markerCluster_Bing');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_0_cluster_0"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_6"))).perform();
        browser.compareScreen(element(By.id("container")), 'BingZoomDefault_MarkerCluster_TooltipmouseMove');
        
        browser.findElement(By.id('tooltip')).sendKeys("Click")
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_24"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingZoommarkerClusterExp_clickTooltip');
        
        browser.findElement(By.id('tooltip')).sendKeys("DoubleClick")
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_39"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingZoommarkerClusterExp_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Rectangle in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingClusterExpand.html');
        browser.sleep(2000);
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id('container')), 'Bing_markerClusterExp_RectangleShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Rect_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Rectangle_clickTooltip');
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Rectangle_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Balloon in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingClusterExpand.html');
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id('container')), 'Bing_markerClusterExp_BalloonShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Ball_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Balloon_clickTooltip');
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Balloon_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Triangle in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingClusterExpand.html');
        browser.sleep(2000);
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id('container')), 'Bing_markerClusterExp_TriangleShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Triangle_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Triangle_clickTooltip');
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Triangle_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Diamond in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingClusterExpand.html');
        browser.sleep(2000);
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[4].click();
        });
        browser.compareScreen(element(By.id('container')), 'Bing_markerClusterExp_DiamondShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Diamond_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Triangle_clickTooltip');
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Diamond_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Cross in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingClusterExpand.html');
        browser.sleep(2000);
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[5].click();
        });
        browser.compareScreen(element(By.id('container')), 'Bing_markerClusterExp_CrossShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Cross_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Cross_clickTooltip');
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Cross_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Star in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingClusterExpand.html');
        browser.sleep(2000);
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[6].click();
        });
        browser.compareScreen(element(By.id('container')), 'Bing_markerClusterExp_StarShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Star_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Star_clickTooltip');
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Star_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Horizontal line in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingClusterExpand.html');
        browser.sleep(2000);
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[7].click();
        });
        browser.compareScreen(element(By.id('container')), 'Bing_markerClusterExp_HorLineShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Horiontal_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Horizontal_clickTooltip');
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Horizontal_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Vertical line in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingClusterExpand.html');
        browser.sleep(2000);
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[8].click();
        });
        browser.compareScreen(element(By.id('container')), 'Bing_markerClusterExp_VerLineShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Vertical_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Vertical_clickTooltip');
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Vertical_doubleClickTooltip');
        done();
    });
    it('Checking Marker Clustering Expand shape Circle in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingClusterExpand.html');
        browser.sleep(2000);
        clustershape = element(by.id('shapes'));
        clustershape.all(by.tagName('option')).then((options: any) => {
            options[9].click();
        });
        browser.compareScreen(element(By.id('container')), 'Bing_markerClusterExp_CircleShape');
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Circle_TooltipmouseMove');        
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Circle_clickTooltip');
        tooltip = element(by.id('tooltip'));
        tooltip.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_14_cluster_1"))).perform();
        browser.actions().doubleClick(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_30"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingmarkerClusterExp_Circle_doubleClickTooltip');
        done();
    });
});
describe('Marker ColorValuepath and ShapeValuePath', function () {
    it('Checking with marker shapeValuePath', (done: Function) => {
        browser.load('/demos/marker.html');
        browser.actions().click(element(by.id("shape"))).perform();
        browser.compareScreen(element(By.id('container')), 'Marker_ShapeValuePath');
        done();
    });
    it('Checking with marker ColorValuePath', (done: Function) => {
        browser.load('/demos/marker.html');
        browser.actions().click(element(by.id('color'))).perform();
        browser.compareScreen(element(By.id('container')), 'Marker_ColorValuePath');
        done();
    });
    it('Checking with Tooltip Template', (done: Function) => {
        browser.load('/demos/marker.html');
        browser.actions().mouseMove(element(by.id("container_LayerIndex_0_MarkerIndex_0_dataIndex_23"))).perform();
        browser.compareScreen(element(by.id("container")), 'TooltipTemplate');
        done();
    });
    it('Checking with marker shapeValuePath in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMMarker.html');
        browser.sleep(2000);
        browser.actions().click(element(by.id("shape"))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMMarker_ShapeValuePath');
        done();
    });
    it('Checking with marker ColorValuePath in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMMarker.html');
        browser.sleep(2000);
        browser.actions().click(element(by.id('color'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMMarker_ColorValuePath');
        done();
    });
    it('Checking with TooltipTemplate in OSM', (done: Function) => {
        browser.load('/demos/Testing/OSMMarker.html');
        browser.sleep(2000);
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_MarkerIndex_0_dataIndex_23'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMMarker_TooltipTemplate');
        done();
    });
    it('Checking with marker shapeValuePath in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingMarker.html');
        browser.sleep(2000);
        browser.actions().click(element(by.id("shape"))).perform();
        browser.compareScreen(element(By.id('container')), 'BingMarker_ShapeValuePath');
        done();
    });
    it('Checking with marker ColorValuePath in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingMarker.html');
        browser.sleep(2000);
        browser.actions().click(element(by.id('color'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingMarker_ColorValuePath');
        done();
    });
    it('Checking with marker ColorValuePath in Bing', (done: Function) => {
        browser.load('/demos/Testing/BingMarker.html');
        browser.sleep(2000);
        browser.actions().mouseMove(element(by.id('container_LayerIndex_0_MarkerIndex_0_dataIndex_22'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingMarker_TooltipTemplate');
        done();
    });
});
describe('Checking with EnablePersistence property', function () {
    it("Checking with EnablePersistence in shapes", (done: Function) => {
        browser.load('/demos/Testing/EnablePersistShape.html');
        browser.sleep(2000);
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.load('/demos/Testing/EnablePersistShape.html');
        browser.compareScreen(element(By.id("container")), 'Shape_EnablePersistence');
        done();
    });
    it("Checking with EnablePersistence in OSM", (done: Function) => {
        browser.load('/demos/Testing/EnablePersistOSM.html');
        browser.sleep(2000);
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.load('/demos/Testing/EnablePersistOSM.html');
        browser.compareScreen(element(By.id("container")), 'OSM_EnablePersistence');
        done();
    });
    it("Checking with EnablePersistence in Bing", (done: Function) => {
        browser.load('/demos/Testing/EnablePersistBing.html');
        browser.sleep(2000);
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.refresh();
        browser.sleep(3000);
        browser.compareScreen(element(By.id("container")), 'Bing_EnablePersistence');
        done();
    });
});
describe('Checking with Legend Paging and ToggleLegend', function () {
    it('Checking with legend position Top and Circle Shape ToggleLegendSettings', (done: Function) => {
        browser.load('/demos/Testing/legendPaging.html');
        browser.actions().click(element(by.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Circle_toggleLegend1');
        browser.actions().click(element(by.id('container_Right_Page_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_RightPage2');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Circle_toggleLegend2');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_RightPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Circle_toggleLegend3');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_RightPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Circle_toggleLegend4');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_RightPage41');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Circle_toggleLegend5');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Circle_toggled1');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_LeftPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Circle_toggled2');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_LeftPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_Circle_toggled3');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_LeftPage2');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_Circle_toggled4');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_LeftPage1');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_0"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_Circle_toggled5');
        done();
    });
    it('Checking with legend position Bottom and Circle Shape ToggleLegendSettings', (done: Function) => {
        browser.load('/demos/Testing/legendPaging.html');
        legend = element(by.id("position"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Circle_toggleLegend1');
        browser.actions().click(element(by.id('container_Right_Page_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_RightPage2');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Circle_toggleLegend2');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_RightPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Circle_toggleLegend3');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Circle_RightPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Circle_toggleLegend4');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_circle_RightPage41');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Circle_toggleLegend5');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Circle_toggled1');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_LeftPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Circle_toggled2');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_LeftPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_Circle_toggled3');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_LeftPage2');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_Circle_toggled4');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_LeftPage1');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_0"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_Circle_toggled5');
        done();
    });
    it('Checking with legend position Left and Circle Shape ToggleLegendSettings', (done: Function) => {
        browser.load('/demos/Testing/legendPaging.html');
        legend = element(by.id("position"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Circle_toggleLegend1');
        browser.actions().click(element(by.id('container_Right_Page_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_RightPage2');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Circle_toggleLegend2');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_RightPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Circle_toggleLegend3');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_RightPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Circle_toggleLegend4');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_RightPage41');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Circle_toggleLegend5');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Circle_toggled1');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_LeftPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Circle_toggled2');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_LeftPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_Circle_toggled3');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_LeftPage2');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_Circle_toggled4');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_LeftPage1');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_0"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_Circle_toggled5');
        done();
    });
    it('Checking with legend position Right and Circle Shape ToggleLegendSettings', (done: Function) => {
        browser.load('/demos/Testing/legendPaging.html');
        legend = element(by.id("position"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[3].click();
        });
        browser.actions().click(element(by.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Circle_toggleLegend1');
        browser.actions().click(element(by.id('container_Right_Page_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_RightPage2');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Circle_toggleLegend2');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_RightPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Circle_toggleLegend3');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_RightPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Circle_toggleLegend4');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_RightPage41');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Circle_toggleLegend5');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Circle_toggled1');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_LeftPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Circle_toggled2');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_LeftPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_Circle_toggled3');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_LeftPage2');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_Circle_toggled4');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_LeftPage1');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_0"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_Circle_toggled5');
        done();
    });

    it('Checking with legend position Top and Rectangle Shape ToggleLegendSettings', (done: Function) => {
        browser.load('/demos/Testing/legendPaging.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Rect_toggleLegend1');
        browser.actions().click(element(by.id('container_Right_Page_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_RightPage2');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Rect_toggleLegend2');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_RightPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Rect_toggleLegend3');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_RightPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Rect_toggleLegend4');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_RightPage41');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Rect_toggleLegend5');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Rect_toggled1');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_LeftPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Rect_toggled2');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_LeftPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_Rect_toggled3');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_LeftPage2');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_Rect_toggled4');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_LeftPage1');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_0"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_Rect_toggled5');
        done();
    });
    it('Checking with legend position Bottom and Rectangle Shape ToggleLegendSettings', (done: Function) => {
        browser.load('/demos/Testing/legendPaging.html');
        legend = element(by.id("position"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Rect_toggleLegend1');
        browser.actions().click(element(by.id('container_Right_Page_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_RightPage2');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Rect_toggleLegend2');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_RightPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Rect_toggleLegend3');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Rect_RightPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Rect_toggleLegend4');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_Rect_RightPage41');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Rect_toggleLegend5');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Rect_toggled1');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_LeftPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Rect_toggled2');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_LeftPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_Rect_toggled3');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_LeftPage2');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_Rect_toggled4');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_LeftPage1');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_0"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_Rect_toggled5');
        done();
    });
    it('Checking with legend position Left and Rectangle Shape ToggleLegendSettings', (done: Function) => {
        browser.load('/demos/Testing/legendPaging.html');
        legend = element(by.id("position"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Rect_toggleLegend1');
        browser.actions().click(element(by.id('container_Right_Page_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_RightPage2');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Rect_toggleLegend2');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_RightPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Rect_toggleLegend3');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_RightPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Rect_toggleLegend4');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_RightPage41');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Rect_toggleLegend5');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Rect_toggled1');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_LeftPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Rect_toggled2');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_LeftPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_Rect_toggled3');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_LeftPage2');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_Rect_toggled4');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_LeftPage1');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_0"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_Rect_toggled5');
        done();
    });

    it('Checking with legend position Right and Rectangle Shape ToggleLegendSettings', (done: Function) => {
        browser.load('/demos/Testing/legendPaging.html');
        legend = element(by.id("position"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[3].click();
        });
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.actions().click(element(by.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Rect_toggleLegend1');
        browser.actions().click(element(by.id('container_Right_Page_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_RightPage2');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Rect_toggleLegend2');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_RightPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Rect_toggleLegend3');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_RightPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Rect_toggleLegend4');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_RightPage41');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Rect_toggleLegend5');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Rect_toggled1');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_LeftPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Rect_toggled2');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_LeftPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_Rect_toggled3');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_LeftPage2');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_Rect_toggled4');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_LeftPage1');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_0"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_Rect_toggled5');
        done();
    });
    it('Checking with legend position Top and Triangle Shape ToggleLegendSettings', (done: Function) => {
        browser.load('/demos/Testing/legendPaging.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Tri_toggleLegend1');
        browser.actions().click(element(by.id('container_Right_Page_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_RightPage2');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Tri_toggleLegend2');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_RightPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Tri_toggleLegend3');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_RightPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Tri_toggleLegend4');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_RightPage41');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Tri_toggleLegend5');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Tri_toggled1');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_LeftPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendTop_Tri_toggled2');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_LeftPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_Tri_toggled3');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_LeftPage2');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_Tri_toggled4');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_LeftPage1');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_0"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendTop_Tri_toggled5');
        done();
    });
    it('Checking with legend position Bottom and Triangle Shape ToggleLegendSettings', (done: Function) => {
        browser.load('/demos/Testing/legendPaging.html');
        legend = element(by.id("position"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Tri_toggleLegend1');
        browser.actions().click(element(by.id('container_Right_Page_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_RightPage2');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Tri_toggleLegend2');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_RightPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Tri_toggleLegend3');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Tri_RightPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Tri_toggleLegend4');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_Tri_RightPage41');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Tri_toggleLegend5');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Tri_toggled1');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_LeftPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendBottom_Tri_toggled2');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_LeftPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_Tri_toggled3');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_LeftPage2');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_Tri_toggled4');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_LeftPage1');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_0"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendBottom_Tri_toggled5');
        done();
    });
    it('Checking with legend position Left and Triangle Shape ToggleLegendSettings', (done: Function) => {
        browser.load('/demos/Testing/legendPaging.html');
        legend = element(by.id("position"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Tri_toggleLegend1');
        browser.actions().click(element(by.id('container_Right_Page_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_RightPage2');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Tri_toggleLegend2');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_RightPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Tri_toggleLegend3');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_RightPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Tri_toggleLegend4');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_RightPage41');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Tri_toggleLegend5');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Tri_toggled1');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_LeftPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendLeft_Tri_toggled2');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_LeftPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_Tri_toggled3');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_LeftPage2');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_Tri_toggled4');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_LeftPage1');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_0"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendLeft_Tri_toggled5');
        done();
    });
    it('Checking with legend position Right and Triangle Shape ToggleLegendSettings', (done: Function) => {
        browser.load('/demos/Testing/legendPaging.html');
        legend = element(by.id("position"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[3].click();
        });
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(by.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Tri_toggleLegend1');
        browser.actions().click(element(by.id('container_Right_Page_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_RightPage2');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Tri_toggleLegend2');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_RightPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Tri_toggleLegend3');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_RightPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Tri_toggleLegend4');
        browser.actions().click(element(by.id("container_Right_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_RightPage41');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Tri_toggleLegend5');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_4"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Tri_toggled1');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_LeftPage4');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_3"))).perform();
        browser.compareScreen(element(By.id("container")), 'LegendRight_Tri_toggled2');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_LeftPage3');
        browser.actions().click(element(by.id("container_Legend_Shape_Index_2"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_Tri_toggled3');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_LeftPage2');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_1"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_Tri_toggled4');
        browser.actions().click(element(by.id("container_Left_Page_Rect"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_LeftPage1');        
        browser.actions().click(element(by.id("container_Legend_Shape_Index_0"))).perform();
        browser.compareScreen(element(By.id('container')), 'LegendRight_Tri_toggled5');
        done();
    });
});
describe("Checking with marker Clustering with various types", function () {
    it("Checking with marker clustering in Image Shape", (done: Function) => {
        browser.load('/demos/Testing/markerCluster.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.id("container")), "MarkerCluster_shapeimage");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "MarkerClustering_ShapeImage");
        done();
    });
    it("Checking with marker clustering in Balloon Shape", (done: Function) => {
        browser.load('/demos/Testing/markerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "MarkerCluster_ShapeBalloon");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "MarkerClustering_ShapeBalloon");
        done();
    });
    it("Checking with marker clustering in Rectangle Shape", (done: Function) => {
        browser.load('/demos/Testing/markerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "MarkerCluster_ShapeRect");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "MarkerClustering_ShapeRect");
        done();
    });
    it("Checking with marker clustering in Triangle Shape", (done: Function) => {
        browser.load('/demos/Testing/markerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "MarkerCluster_ShapeTriangle");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "MarkerClustering_ShapeTriangle");
        done();
    });
    it("Checking with marker clustering in Diamond Shape", (done: Function) => {
        browser.load('/demos/Testing/markerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[4].click();
        });
        browser.compareScreen(element(By.id("container")), "MarkerCluster_ShapeDiamond");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "MarkerClustering_ShapeDiamond");
        done();
    });
    it("Checking with marker clustering in Cross Shape", (done: Function) => {
        browser.load('/demos/Testing/markerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[5].click();
        });
        browser.compareScreen(element(By.id("container")), "MarkerCluster_ShapeCross");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "MarkerClustering_ShapeCross");
        done();
    });
    it("Checking with marker clustering in Star Shape", (done: Function) => {
        browser.load('/demos/Testing/markerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[6].click();
        });
        browser.compareScreen(element(By.id("container")), "MarkerCluster_ShapeStar");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "MarkerClustering_ShapeStar");
        done();
    });
    it("Checking with marker clustering in Horizontal line Shape", (done: Function) => {
        browser.load('/demos/Testing/markerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[7].click();
        });
        browser.compareScreen(element(By.id("container")), "MarkerCluster_ShapeHorizontal");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "MarkerClustering_ShapeHorizontal");
        done();
    });
    it("Checking with marker clustering in Vertical line Shape", (done: Function) => {
        browser.load('/demos/Testing/markerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[8].click();
        });
        browser.compareScreen(element(By.id("container")), "MarkerCluster_ShapeVertical");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "MarkerClustering_ShapeVertical");
        done();
    });
    it("Checking with marker clustering in Circle Shape", (done: Function) => {
        browser.load('/demos/Testing/markerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[9].click();
        });
        browser.compareScreen(element(By.id("container")), "MarkerCluster_ShapeCircle");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "MarkerClustering_ShapeCircle");
        done();
    });
    it("Checking with marker clustering in Image Shape in OSM", (done: Function) => {
        browser.load('/demos/Testing/OSMMarkerCluster.html');
        browser.compareScreen(element(By.id("container")), "OSMMarkerCluster_ShapeImage");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "OSMMarkerClustering_ShapeImage");
        done();
    });
    it("Checking with marker clustering in Balloon Shape in OSM", (done: Function) => {
        browser.load('/demos/Testing/OSMMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "OSMMarkerCluster_ShapeBalloon");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "OSMMarkerClustering_ShapeBalloon");
        done();
    });
    it("Checking with marker clustering in Rectangle Shape in OSM", (done: Function) => {
        browser.load('/demos/Testing/OSMMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "OSMMarkerCluster_ShapeRect");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "OSMMarkerClustering_ShapeRect");
        done();
    });
    it("Checking with marker clustering in Triangle Shape in OSM", (done: Function) => {
        browser.load('/demos/Testing/OSMMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "OSMMarkerCluster_ShapeTriangle");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "OSMMarkerClustering_ShapeTriangle");
        done();
    });
    it("Checking with marker clustering in Diamond Shape in OSM", (done: Function) => {
        browser.load('/demos/Testing/OSMMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[4].click();
        });
        browser.compareScreen(element(By.id("container")), "OSMMarkerCluster_ShapeDiamond");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "OSMMarkerClustering_ShapeDiamond");
        done();
    });
    it("Checking with marker clustering in Cross Shape in OSM", (done: Function) => {
        browser.load('/demos/Testing/OSMMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[5].click();
        });
        browser.compareScreen(element(By.id("container")), "OSMMarkerCluster_ShapeCross");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "OSMMarkerClustering_ShapeCross");
        done();
    });
    it("Checking with marker clustering in Star Shape in OSM", (done: Function) => {
        browser.load('/demos/Testing/OSMMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[6].click();
        });
        browser.compareScreen(element(By.id("container")), "OSMMarkerCluster_ShapeStar");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "OSMMarkerClustering_ShapeStar");
        done();
    });
    it("Checking with marker clustering in Horizontal line Shape in OSM", (done: Function) => {
        browser.load('/demos/Testing/OSMMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[7].click();
        });
        browser.compareScreen(element(By.id("container")), "OSMMarkerCluster_ShapeHorizontal");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "OSMMarkerClustering_ShapeHorizontal");
        done();
    });
    it("Checking with marker clustering in Vertical line Shape in OSM", (done: Function) => {
        browser.load('/demos/Testing/OSMMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[8].click();
        });
        browser.compareScreen(element(By.id("container")), "OSMMarkerCluster_ShapeVertical");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "OSMMarkerClustering_ShapeVertical");
        done();
    });
    it("Checking with marker clustering in Circle Shape in OSM", (done: Function) => {
        browser.load('/demos/Testing/markerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[9].click();
        });
        browser.compareScreen(element(By.id("container")), "OMMarkerCluster_ShapeCircle");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "OSMMarkerClustering_ShapeCircle");
        done();
    });
    it("Checking with marker clustering in Image Shape in Bing", (done: Function) => {
        browser.load('/demos/Testing/BingMarkerCluster.html');
        browser.compareScreen(element(By.id("container")), "BingMarkerCluster_ShapeImage");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "BingMarkerClustering_ShapeImage");
        done();
    });
    it("Checking with marker clustering in Balloon Shape in Bing", (done: Function) => {
        browser.load('/demos/Testing/BingMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("container")), "BingMarkerCluster_ShapeBalloon");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "BingMarkerClustering_ShapeBalloon");
        done();
    });
    it("Checking with marker clustering in Rectangle Shape in Bing", (done: Function) => {
        browser.load('/demos/Testing/BingMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("container")), "BingMarkerCluster_ShapeRect");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "BingMarkerClustering_ShapeRect");
        done();
    });
    it("Checking with marker clustering in Triangle Shape in Bing", (done: Function) => {
        browser.load('/demos/Testing/BingMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[3].click();
        });
        browser.compareScreen(element(By.id("container")), "BingMarkerCluster_ShapeTriangle");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "BingMarkerClustering_ShapeTriangle");
        done();
    });
    it("Checking with marker clustering in Diamond Shape in Bing", (done: Function) => {
        browser.load('/demos/Testing/BingMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[4].click();
        });
        browser.compareScreen(element(By.id("container")), "BingMarkerCluster_ShapeDiamond");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "BingMarkerClustering_ShapeDiamond");
        done();
    });
    it("Checking with marker clustering in Cross Shape in Bing", (done: Function) => {
        browser.load('/demos/Testing/BingMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[5].click();
        });
        browser.compareScreen(element(By.id("container")), "BingMarkerCluster_ShapeCross");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "BingMarkerClustering_ShapeCross");
        done();
    });
    it("Checking with marker clustering in Star Shape in Bing", (done: Function) => {
        browser.load('/demos/Testing/BingMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[6].click();
        });
        browser.compareScreen(element(By.id("container")), "BingMarkerCluster_ShapeStar");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "BingMarkerClustering_ShapeStar");
        done();
    });
    it("Checking with marker clustering in Horizontal line Shape in Bing", (done: Function) => {
        browser.load('/demos/Testing/BingMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[7].click();
        });
        browser.compareScreen(element(By.id("container")), "BingMarkerCluster_ShapeHorizontal");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "BingMarkerClustering_ShapeHorizontal");
        done();
    });
    it("Checking with marker clustering in Vertical line Shape in Bing", (done: Function) => {
        browser.load('/demos/Testing/BingMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[8].click();
        });
        browser.compareScreen(element(By.id("container")), "BingMarkerCluster_ShapeVertical");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "BingMarkerClustering_ShapeVertical");
        done();
    });
    it("Checking with marker clustering in Circle Shape in Bing", (done: Function) => {
        browser.load('/demos/Testing/BingMarkerCluster.html');
        legendShape = element(by.id("shapes"));
        legendShape.all(by.tagName('option')).then((options: any) => {
            options[9].click();
        });
        browser.compareScreen(element(By.id("container")), "BingMarkerCluster_ShapeCircle");
        browser.actions().click(element(by.id("container_Zooming_ToolBar_ZoomIn_Rect"))).perform();
        browser.compareScreen(element(By.id("container")), "BingMarkerClustering_ShapeCircle");
        done();
    });
});
describe('Checking with Initial Zooming', function () {
    it('Checking with Initial Zoomin in Image shape in shapes', (done: Function) => {
        browser.load('/demos/Testing/MapsInitialZoom.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Maps_Balloon');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Reset_BalloonInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Without_ZoomBalloon');
        done();

      
    });
    it('Checking with Initial Zoomin in Balloon shape in shapes', (done: Function) => {
        browser.load('/demos/Testing/MapsInitialZoom.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[0].click();
        }); 
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Maps_Image');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Reset_ImageInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Without_ZoomImage');
        done();
    });
    it('Checking with Initial Zoomin in Rectangle shape in shapes', (done: Function) => {
        browser.load('/demos/Testing/MapsInitialZoom.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Maps_Rect');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Reset_RectInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Without_ZoomRect');
        done();
    });
    it('Checking with Initial Zoomin in Triangle shape in shapes', (done: Function) => {
        browser.load('/demos/Testing/MapsInitialZoom.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[3].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Maps_Triangle');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Reset_TriangleInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Without_ZoomTriangle');
        done();
    });
    it('Checking with Initial Zoomin in Diamond shape in shapes', (done: Function) => {
        browser.load('/demos/Testing/MapsInitialZoom.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[4].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Maps_Diamond');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Reset_DiamondInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Without_ZoomDiamond');
        done();
    });
    it('Checking with Initial Zoomin in Cross shape in shapes', (done: Function) => {
        browser.load('/demos/Testing/MapsInitialZoom.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[5].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Maps_Cross');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Reset_CrossInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Without_ZoomCross');
        done();
    });
    it('Checking with Initial Zoomin in Star shape in shapes', (done: Function) => {
        browser.load('/demos/Testing/MapsInitialZoom.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[6].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Maps_Star');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Reset_StarInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Without_ZoomStar');
        done();
    });
    it('Checking with Initial Zoomin in Horizontal Line shape in shapes', (done: Function) => {
        browser.load('/demos/Testing/MapsInitialZoom.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[7].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Maps_Hor');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Reset_HorInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Without_ZoomHor');
        done();
    });
    it('Checking with Initial Zoomin in Vertical Line shape in shapes', (done: Function) => {
        browser.load('/demos/Testing/MapsInitialZoom.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[8].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Maps_Vert');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Reset_VertInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Without_ZoomVert');
        done();
    });
    it('Checking with Initial Zoomin in Circle shape in shapes', (done: Function) => {
        browser.load('/demos/Testing/MapsInitialZoom.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[9].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Maps_Cir');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Reset_CircleInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Without_ZoomCircle');
        done();
    });
    it('Checking with Initial Zoomin in Image shape in OSM', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomOSM.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_OSM_Balloon');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMReset_BalloonInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'OSMInitialZoom_Without_ZoomBalloon');
        done();
    });
    it('Checking with Initial Zoomin in Balloon shape in OSM', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomOSM.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[0].click();
        });     
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_OSM_Image');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMReset_ImageInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'OSMInitialZoom_Without_ZoomImage');
        done();
    });
    it('Checking with Initial Zoomin in Rectangle shape in OSM', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomOSM.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_OSM_Rect');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMReset_RectInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'OSMInitialZoom_Without_ZoomRect');
        done();
    });
    it('Checking with Initial Zoomin in Triangle shape in OSM', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomOSM.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[3].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_OSM_Triangle');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMReset_TriangleInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'OSMInitialZoom_Without_ZoomTriangle');
        done();
    });
    it('Checking with Initial Zoomin in Diamond shape in OSM', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomOSM.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[4].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_OSM_Diamond');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMReset_DiamondInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'OSMInitialZoom_Without_ZoomDiamond');
        done();
    });
    it('Checking with Initial Zoomin in Cross shape in OSM', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomOSM.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[5].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_OSM_Cross');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMReset_CrossInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'OSMInitialZoom_Without_ZoomCross');
        done();
    });
    it('Checking with Initial Zoomin in Star shape in OSM', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomOSM.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[6].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_OSM_Star');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMReset_StarInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'OSMInitialZoom_Without_ZoomStar');
        done();
    });
    it('Checking with Initial Zoomin in Horizontal Line shape in OSM', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomOSM.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[7].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_OSM_Hor');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMReset_HorInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'OSMInitialZoom_Without_ZoomHor');
        done();
    });
    it('Checking with Initial Zoomin in Vertical Line shape in OSM', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomOSM.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[8].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_OSM_Vert');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMReset_VertInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'OSMInitialZoom_Without_ZoomVert');
        done();
    });
    it('Checking with Initial Zoomin in Circle shape in OSM', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomOSM.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[9].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_OSM_Cir');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'OSMReset_CircleInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'OSMInitialZoom_Without_ZoomCircle');
        done();
    });
        it('Checking with Initial Zoomin in Image shape in Bing', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomBing.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[1].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Bing_Balloon');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingReset_BalloonInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'BingInitialZoom_Without_ZoomBalloon');
        done();
    });
    it('Checking with Initial Zoomin in Balloon shape in Bing', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomBing.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[0].click();
        });
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Bing_Image');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingReset_ImageInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'BingInitialZoom_Without_ZoomImage');
        done();
    });
    it('Checking with Initial Zoomin in Rectangle shape in Bing', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomBing.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Bing_Rect');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingReset_RectInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'BingInitialZoom_Without_ZoomRect');
        done();
    });
    it('Checking with Initial Zoomin in Triangle shape in Bing', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomBing.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[3].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Bing_Triangle');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingReset_TriangleInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'BingInitialZoom_Without_ZoomTriangle');
        done();
    });
    it('Checking with Initial Zoomin in Diamond shape in Bing', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomBing.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[4].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Bing_Diamond');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingReset_DiamondInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'BingInitialZoom_Without_ZoomDiamond');
        done();
    });
    it('Checking with Initial Zoomin in Cross shape in Bing', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomBing.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[5].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Bing_Cross');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingReset_CrossInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'BingInitialZoom_Without_ZoomCross');
        done();
    });
    it('Checking with Initial Zoomin in Star shape in Bing', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomBing.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[6].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Bing_Star');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingReset_StarInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'BingInitialZoom_Without_ZoomStar');
        done();
    });
    it('Checking with Initial Zoomin in Horizontal Line shape in Bing', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomBing.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[7].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Bing_Hor');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingReset_HorInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'BingInitialZoom_Without_ZoomHor');
        done();
    });
    it('Checking with Initial Zoomin in Vertical Line shape in Bing', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomBing.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[8].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Bing_Vert');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingReset_VertInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'BingInitialZoom_Without_ZoomVert');
        done();
    });
    it('Checking with Initial Zoomin in Circle shape in Bing', (done: Function) => {
        browser.load('/demos/Testing/InitialZoomBing.html');
        zoom = element(by.id('shapes'));
        zoom.all(by.tagName('option')).then((options: any) => {
            options[9].click();
        });        
        browser.actions().click(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('container')), 'InitialZoom_Bing_Cir');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingReset_CircleInitialZoom');
        browser.actions().click(element(by.id('zoomvisible'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'BingInitialZoom_Without_ZoomCircle');
        done();
    });
});
describe('Checking with Marker Template in Bing', function() {
    it('Checking with Marker Template in Bing', (done: Function) => {
        browser.load('/demos/Testing/Bing.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'BingMap_MarkerTemplate');
        done();
    });
    it('Checking with Tooltip in Marker Template in Bing', (done: Function)=> {
        browser.load('/demos/Testing/Bing.html');
        browser.sleep(2000);
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_MarkerIndex_0_dataIndex_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingMap_MarkerTemplate_Tooltip');
        done();
    });
    it('Checking with Bing Sublayer', (done: Function) => {
        browser.load('/demos/Testing/BingSublayer.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), "BingSublayer");
        browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'Bing_Sublayer_Zoom');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomOut_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingSublayer_Zoomout');
        browser.actions().click(element(By.id('container_Zooming_ToolBar_Reset_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'BingSublayer_Reset');
        done();
    });
    it('Checking with Bing and Navigation Line', (done: Function) => {
        browser.load('/demos/Testing/BingNavigation.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'Bing_Navigation_MarkerTemplate');
        browser.actions().mouseMove(element(by.id('container_LayerIndex_0_MarkerIndex_1_dataIndex_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'Bing_Navigation_MarkerTooltip');
        done();
    });
});
describe('Checking with default Selection', function () {
    it('Checking with default Selection', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'Maps_DefaultSelection');
        done();
    });
    it('Checking with Property Name as Asia in Prorammatic select', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        browser.findElement(By.id('name')).clear();
        browser.findElement(By.id('name')).sendKeys('Africa'+ Key.ENTER);
        browser.actions().click(element(By.id('selection'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgrammaticSelect_Africa');
        done();
    });
    it('Checking with Programmatically Selecting the Asia', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        browser.actions().click(element(by.id('selection'))).perform();
        browser.compareScreen(element(By.id('container')), 'Maps_ProgrammaticSelection');
        browser.actions().click(element(By.id('unselection'))).perform();
        browser.compareScreen(element(By.id('container')), 'Maps_ProgrammaticUnSelection');
         done();
    });
    it('Checking with HighlightingSettings', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_shapeIndex_26_dataIndex_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'Highlight_NorthAmerica');
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_shapeIndex_134_dataIndex_4'))).perform();
        browser.compareScreen(element(By.id('container')), 'Highlight_Asia');
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_shapeIndex_32_dataIndex_2'))).perform();
        browser.compareScreen(element(By.id('container')), 'Highlight_Africa');
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_shapeIndex_4_dataIndex_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'Highlight_SouthAmerica');
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_shapeIndex_146_dataIndex_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'Highlight_Europe');
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_shapeIndex_7_dataIndex_5'))).perform();
        browser.compareScreen(element(By.id('container')), 'Highlight_Australia');
         done();
    });
    it('Checking with Multi Select in shapes', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('multiselect'))).perform();
        browser.actions().click(element(By.id('container_LayerIndex_0_shapeIndex_101_dataIndex_0'))).perform();
        browser.actions().click(element(By.id('container_LayerIndex_0_shapeIndex_4_dataIndex_1'))).perform();
        browser.actions().click(element(By.id('container_LayerIndex_0_shapeIndex_134_dataIndex_4'))).perform();
        browser.actions().click(element(By.id('container_LayerIndex_0_shapeIndex_7_dataIndex_5'))).perform();
        browser.compareScreen(element(By.id('container')), 'MultiSelect_ProgrammicSelection');
         done();
    });
    it('Checking with MultiSelect in markers', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('multiselect'))).perform();
        browser.actions().click(element(By.id('container_LayerIndex_0_MarkerIndex_0_dataIndex_1'))).perform();
        browser.actions().click(element(By.id('container_LayerIndex_0_MarkerIndex_0_dataIndex_3'))).perform();
        browser.actions().click(element(By.id('container_LayerIndex_0_MarkerIndex_0_dataIndex_7'))).perform();
        browser.actions().click(element(By.id('container_LayerIndex_0_MarkerIndex_0_dataIndex_4'))).perform();
        browser.compareScreen(element(By.id('container')), 'MultiSelect_ProgrammicSelection_Markers');
         done();
    });
    it('Checking with Selection in Default Legend in Bottom', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        browser.actions().click(element(By.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Bottom_Legend1');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Bottom_Legend2');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Bottom_Legend3');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_5'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Bottom_Legend4');
         done();
    });
    it('Checking with Selection in Default Legend in Top', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        legend = element(by.id("legendPosition"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[0].click();
        });
        browser.actions().click(element(By.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Top_Legend1');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Top_Legend2');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Top_Legend3');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_5'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Top_Legend4');
         done();
    });
    it('Checking with Selection in Default Legend in Left', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        legend = element(by.id("legendPosition"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(By.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Left_Legend1');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Left_Legend2');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Left_Legend3');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_5'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Left_Legend4');
         done();
    });
    it('Checking with Selection in Default Legend in Right', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        legend = element(by.id("legendPosition"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(By.id('container_Legend_Shape_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Right_Legend1');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Right_Legend2');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Righht_Legend3');
        browser.actions().click(element(By.id('container_Legend_Shape_Index_5'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Default_Right_Legend4');
         done();
    });
    it('Checking with Selection in Interactive Legend in Bottom', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        mode = element(By.id('legendMode'));
        mode.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        browser.actions().click(element(By.id('container_Legend_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Bottom_Legend1');
        browser.actions().click(element(By.id('container_Legend_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Bottom_Legend2');
        browser.actions().click(element(By.id('container_Legend_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Bottom_Legend3');
        browser.actions().click(element(By.id('container_Legend_Index_5'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Bottom_Legend4');
        done();
    });
    it('Checking with Selection in Interactive Legend in Top', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        mode = element(By.id('legendMode'));
        mode.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        legend = element(by.id("legendPosition"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[0].click();
        });
        browser.actions().click(element(By.id('container_Legend_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Top_Legend1');
        browser.actions().click(element(By.id('container_Legend_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Top_Legend2');
        browser.actions().click(element(By.id('container_Legend_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Top_Legend3');
        browser.actions().click(element(By.id('container_Legend_Index_5'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Top_Legend4');
        done();
    });
    it('Checking with Selection in Interactive Legend in Left', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        mode = element(By.id('legendMode'));
        mode.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        legend = element(by.id("legendPosition"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(By.id('container_Legend_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Left_Legend1');
        browser.actions().click(element(By.id('container_Legend_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Left_Legend2');
        browser.actions().click(element(By.id('container_Legend_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Left_Legend3');
        browser.actions().click(element(By.id('container_Legend_Index_5'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Left_Legend4');
        done();
    });
    it('Checking with Selection in Interactive Legend in Right', (done: Function) => {
        browser.load('/demos/default-selection.html');
        browser.sleep(2000);
        mode = element(By.id('legendMode'));
        mode.all(by.tagName('option')).then((options: any) => {
            options[1].click;
        });
        legend = element(by.id("legendPosition"));
        legend.all(by.tagName('option')).then((options: any) => {
            options[2].click();
        });
        browser.actions().click(element(By.id('container_Legend_Index_0'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Right_Legend1');
        browser.actions().click(element(By.id('container_Legend_Index_1'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Right_Legend2');
        browser.actions().click(element(By.id('container_Legend_Index_3'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Right_Legend3');
        browser.actions().click(element(By.id('container_Legend_Index_5'))).perform();
        browser.compareScreen(element(By.id('container')), 'ProgramSelection_Interactive_Right_Legend4');
        done();
    });
});
// describe('Checking with Dynamic Marker Sample in Bing', function () {
//     it('Checking with adding marker Image dynamically in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'BingDynamic_Marker');
//         done();
//     });
//     it('Checking with adding Marker Image with line in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Image_Line');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('3'+ Key.ENTER);
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_line_width');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Image_Zoomin');
//         done();
//     });
//     it('Checking with adding Marker Image with connected line in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('connect'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Image_LineWidth');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('5'+ Key.ENTER);
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Image_LineWidth');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Image_Zoomin');
//         browser.actions().click(element(By.id('togglebtn'))).perform();
//         browser.compareScreen(element(By.id('container')), 'BingDynamicaMarker_Clear');
//         done();
//     });
//     it('Checking with adding marker Circle dynamically in Bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[1].click;
//         });
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'BingDynamic_Marker_Circle');
//         done();
//     });
    
//     it('Checking with adding Marker Circle with line in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[1].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Circle_Line');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('3'+ Key.ENTER);
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Circle_line_width');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Circle_Zoomin');
//         done();
//     });
//     it('Checking with adding Marker Circle with connected line in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         type.all(by.tagName('option')).then((options: any) => {
//             options[1].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('connect'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Circle_ConnectLine');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('5'+ Key.ENTER);
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Circle_ConnectLineWidth');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Circle_Zoomin');
//         browser.actions().click(element(By.id('togglebtn'))).perform();
//         browser.compareScreen(element(By.id('container')), 'BingDynamicaMarker_Circle_Clear');
//         done();
//     });
//     it('Checking with adding marker Diamond dynamically in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[2].click;
//         });
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'BingDynamic_Marker_Diamond');
//         done();
//     });
//     it('Checking with adding Marker Diamond with line in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[2].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Diamond_Line');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('3'+ Key.ENTER);
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Diamond_line_width');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Diamond_Zoomin');
//         done();
//     });
//     it('Checking with adding Marker Diamond with connected line in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         type.all(by.tagName('option')).then((options: any) => {
//             options[2].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('connect'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Diamond_ConnectLine');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('5'+ Key.ENTER);
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Diamond_ConnectLineWidth');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Diamond_Zoomin');
//         browser.actions().click(element(By.id('togglebtn'))).perform();
//         browser.compareScreen(element(By.id('container')), 'BingDynamicaMarker_Diamond_Clear');
//         done();
//     });
//     it('Checking with adding marker Star dynamically in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[3].click;
//         });
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'BingDynamic_Marker_Star');
//         done();
//     });
//     it('Checking with adding Marker Star with line in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[3].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Star_Line');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('3'+ Key.ENTER);
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Star_line_width');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Star_Zoomin');
//         done();
//     });
//     it('Checking with adding Marker Star with connected line in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         type.all(by.tagName('option')).then((options: any) => {
//             options[3].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('connect'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Star_ConnectLine');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('5'+ Key.ENTER);
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Star_ConnectLineWidth');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Star_Zoomin');
//         browser.actions().click(element(By.id('togglebtn'))).perform();
//         browser.compareScreen(element(By.id('container')), 'BingDynamicaMarker_Star_Clear');
//         done();
//     });
//     it('Checking with adding marker Triangle dynamically in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[4].click;
//         });
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'BingDynamic_Marker_Triangle');
//         done();
//     });
//     it('Checking with adding Marker Triangle with line in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         type = element(By.id('type'));
//         type.all(by.tagName('option')).then((options: any) => {
//             options[3].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Triangle_Line');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('3'+ Key.ENTER);
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Triangle_line_width');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'Bing_Marker_Triangle_Zoomin');
//         done();
//     });
//     it('Checking with adding Marker Triangle with connected line in bing', (done: Function) => {
//         browser.load('/demos/SamplesInBrowser/BingDynamicMarker.html');
//         browser.sleep(3000);
//         type.all(by.tagName('option')).then((options: any) => {
//             options[3].click;
//         });
//         browser.actions().click(element(By.id('line'))).perform();
//         browser.actions().click(element(By.id('connect'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'bing_Marker_Triangle_ConnectLine');
//         browser.findElement(By.id('width')).clear();
//         browser.findElement(By.id('width')).sendKeys('5'+ Key.ENTER);
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.action().click(element(By.id('container_Tile_SVG'))).perform();
//         browser.compareScreen(element(By.id('container')), 'bing_Marker_Triangle_ConnectLineWidth');
//         browser.actions().click(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
//         browser.compareScreen(element(By.id('container')), 'bing_Marker_Triangle_Zoomin');
//         browser.actions().click(element(By.id('togglebtn'))).perform();
//         browser.compareScreen(element(By.id('container')), 'bingDynamicaMarker_Triangle_Clear');
//         done();
//     });
// });


