/**
 * spec
 */
import { browser, element, By, by, Key , ElementFinder} from "@syncfusion/ej2-base/e2e/index";

describe('Add marker on Button click', () => {
    let initialzoom : ElementFinder = element(By.id('zoominitial'));
    let customer1 : ElementFinder = element(By.id('addMarker'));
    let customer2 : ElementFinder = element(By.id('addMarker1'));

    it('Add marker on button click', (done: Function)  => {
        browser.load('/demos/CRIssues/AddMarkerOnButtonClick.html');
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_onbuttonclick');
        initialzoom.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_zoomintial');
        done();
     });

    it('customer1 Add marker on button click', (done: Function)  => {
        initialzoom.click();
        customer1.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust1');
        initialzoom.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust1_zoominitial');
        customer2.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust1_zoominitial_cust2');
        customer1.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust1_zoominitial_cust2and1');
        customer2.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust1_zoominitial_cust2and2');
        initialzoom.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust1_cust2and2');
        customer1.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust1_cust2and1');
        customer2.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust1_cust2and2');
        done();
     });

    it('customer2 Add marker on button click', (done: Function)  => {
        browser.load('/demos/CRIssues/AddMarkerOnButtonClick.html');
        customer2.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust2');
        customer1.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust2_cust1');
        initialzoom.click();
        customer2.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust2_zoomintial');
        customer1.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust2_zoomintial_cust1');
        customer2.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_cust2_zoomintial_cust2');
        done();
     });


    it('Add marker on button click1', (done: Function)  => {
        browser.load('/demos/CRIssues/AddMarkerOnButtonClick.html');
        browser.actions().doubleClick(element(By.id('mapszooming_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_Zoomin');
        initialzoom.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_Zoomin_zoominitial');
        browser.findElement(By.id('mapszooming_Zooming_ToolBar_Reset_Rect')).click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_Zoomin_zoominitial_reset');
        initialzoom.click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Addmarker_Zoomin_zoominitial_reset1');
        done();
     });
});

describe('Datasublayer', () => {
    it('datasublayer', (done: Function)  => {
        browser.load('/demos/CRIssues/datalabelsublayer.html');
        browser.compareScreen(element(By.id('container')), 'CI/datasublayer');
        browser.actions().doubleClick(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'CI/datasublayer_zoomin');
        browser.findElement(By.id('container_Zooming_ToolBar_Reset_Rect')).click();
        browser.compareScreen(element(By.id('container')), 'CI/datasublayer_reset');
        done();
    });
});


describe('marker', () => {
    it('marker', (done: Function)  => {
        browser.load('/demos/CRIssues/marker.html');
        browser.actions().click(element(By.id('click1'))).perform();
        //browser.findElement(By.id('click1')).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'CI/marker');
        browser.actions().click(element(By.id('click2'))).perform();
        //browser.findElement('click2').click();
        browser.compareScreen(element(By.id('container')), 'CI/marker_refresh');
        browser.actions().doubleClick(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'CI/marker_zoomin');
        browser.findElement(By.id('container_Zooming_ToolBar_ZoomOut_Rect')).click();
        browser.compareScreen(element(By.id('container')), 'CI/marker_zoomout');
        browser.findElement(By.id('container_Zooming_ToolBar_Reset_Rect')).click();
        browser.compareScreen(element(By.id('container')), 'CI/marker_reset');
        done();
    });
    it('marker1', (done: Function)  => {
        browser.load('/demos/CRIssues/marker.html');
        browser.findElement(By.id('click1')).click();
        browser.actions().doubleClick(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.findElement('click2').click();
        browser.compareScreen(element(By.id('container')), 'CI/marker_zoomin1_refresh');
        browser.findElement(By.id('container_Zooming_ToolBar_ZoomOut_Rect')).click();
        browser.compareScreen(element(By.id('container')), 'CI/marker_zoomout1_refresh');
        browser.findElement(By.id('container_Zooming_ToolBar_Reset_Rect')).click();
        browser.compareScreen(element(By.id('container')), 'CI/marker_reset1_refresh');
        done();
    });
});


describe('marker data null', () => {
    it('marker data null', (done: Function)  => {
        browser.load('/demos/CRIssues/markerDataNull.html');
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Bing_markerdatanull')
        browser.findElement(By.id('zoominitial')).click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Bing_markerdatanull_zoominitial');
        browser.actions().doubleClick(element(By.id('mapszooming_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Bing_markerdatanull_zoomin');
        browser.findElement(By.id('zoominitial')).click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Bing_markerdatanull_zoomin_zoominitial');
        browser.actions().doubleClick(element(By.id('zoominitial'))).perform();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/Bing_markerdatanull_zoominitial1');
        done();
    });
});


describe('Panning and center', () => {
    it('panning and center', (done: Function)  => {
        browser.load('/demos/CRIssues/PanningAndCenter.html');
        browser.compareScreen(element(By.id('mapszooming')), 'CI/panningcenter');
        browser.actions().doubleClick(element(By.id('mapszooming_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/panningcenter_zoomin');
        browser.findElement(By.id('mapszooming_Zooming_ToolBar_ZoomOut_Rect')).click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/panningcenter_zoomout');
        browser.findElement(By.id('mapszooming_Zooming_ToolBar_Reset_Rect')).click();
        browser.compareScreen(element(By.id('mapszooming')), 'CI/panningcenter_reset');
        done();
    });
});


describe('tooltip', () => {
    it('tooltip', (done: Function)  => {
        browser.load('/demos/CRIssues/tooltip.html');
        browser.compareScreen(element(By.id('container')), 'CI/Tooltip');
        browser.actions().mouseMove(element(By.id('container_LayerIndex_0_shapeIndex_7_dataIndex_0'))).perform().then(function() {
        browser.compareScreen(element(By.id('container')), 'CI/Tooltip_visible');
    });
      browser.actions().mouseMove(element(By.id('container_LayerIndex_0_shapeIndex_137_dataIndex_4'))).perform().then(function() {
          browser.compareScreen(element(By.id('container')), 'CI/Tooltip_visible1');
      });
      done();
    });
});


describe('zoomclick shapedata', () => {
    it('zoomclick shape data', (done: Function)  => {
        browser.load('/demos/CRIssues/ZoomClickShapeData.html');
        browser.compareScreen(element(By.id('container')), 'CI/Zoomclickshapedata');
        browser.findElement(By.id('click2')).click();
        browser.compareScreen(element(By.id('container')), 'CI/Zoomclickshapedata_refresh');
        browser.actions().doubleClick(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'CI/Zoomclickshapedata_refresh_zoomin');
        browser.findElement(By.id('click2')).click();
        browser.compareScreen(element(By.id('container')), 'CI/Zoomclickshapedata_refresh2');
        done();
    });

    it('zoomclick shapedata1', (done: Function)  => {
        browser.load('/demos/CRIssues/ZoomClickShapeData.html');
        browser.actions().doubleClick(element(By.id('container_Zooming_ToolBar_ZoomIn_Rect'))).perform();
        browser.compareScreen(element(By.id('container')), 'CI/Zoomclickshapedata_zoomin');
        browser.findElement(By.id('click2')).click();
        browser.compareScreen(element(By.id('container')), 'CI/Zoomclickshapedata_refresh3');
        done();
    });
});
