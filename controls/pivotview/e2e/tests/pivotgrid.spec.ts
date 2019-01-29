import { browser, element, By, ElementFinder, ElementHelper } from "@syncfusion/ej2-base/e2e/index";

describe('pivotgrid spec', function () {
    it('screen shot for default', function () {
        // load the sample in driver browser
        browser.load('/demos/pivotview/default-functionality/default.html');
        // take and compare screen shots.
        browser.compareScreen(element(By.id('PivotView')), 'default_sample');
    });
    it('screen shot for export', function () {
        browser.load('/demos/pivotview/export/exporting.html');
        browser.compareScreen(element(By.id('ContainerWrapper')), 'export_sample');
    });
    it('screen shot for fieldlist', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist.html');
        browser.compareScreen(element(By.css('.container')), 'fieldlist_sample');
    });
    it('screen shot for fieldlist-mobile', function () {
        browser.load('/demos/pivotview/fieldlist-mobile/fieldlist-mobile.html');
        browser.compareScreen(element(By.id('FieldList')), 'fieldlist_mobile');
    });
    it('screen shot for fieldlist-rtl', function () {
        browser.load('/demos/pivotview/fieldlist-rtl/fieldlist-rtl.html');
        browser.compareScreen(element(By.id('FieldList_Wrapper')), 'fieldlist-rtl_sample');
    });
    it('screen shot for groupingbar', function () {
        browser.load('/demos/pivotview/groupingbar/groupingbar.html');
        browser.compareScreen(element(By.id('PivotView')), 'groupingbar_sample');
    });
    it('screen shot for pivotgrid-rtl', function () {
        browser.load('/demos/pivotview/pivotgrid-rtl/rtl.html');
        browser.compareScreen(element(By.id('PivotView')), 'pivotgrid-rtl_sample');
    });
    it('screen shot for remotedata', function () {
        browser.load('/demos/pivotview/remotedata/remote.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.id('ContainerWrapper')), 'remote_sample');
    });
    it('screen shot for virtualscrolling', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.css('.container')), 'virtualscrolling_sample');
    });
    it('remotedata odata', function () {
        browser.load('/demos/pivotview/remotedata/remote.html');
        browser.sleep(2000);
        element.all(By.css('#odata')).get(0).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('ContainerWrapper')), 'remote_odata');
    });
    it('remotedata json', function () {
        browser.load('/demos/pivotview/remotedata/remote.html');
        browser.sleep(2000);
        element.all(By.css('#odata')).get(0).click();
        browser.sleep(2000);
        element.all(By.css('#json')).get(0).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.id('ContainerWrapper')), 'remote_json');
    });
});

describe('Grouping bar', function () {
    describe('normal layout', function () {
        it('uncheck show sort icon', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            let elem = element(By.id('sort'));
            elem.click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('ContainerWrapper')), 'groupingbar_1');
        });
        it('uncheck show filter icon', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(1).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('ContainerWrapper')), 'groupingbar_2');
        });
        it('uncheck show dropdown icon', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(2).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('ContainerWrapper')), 'groupingbar_3');
        });
        it('uncheck show remove icon', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(3).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('ContainerWrapper')), 'groupingbar_4');
        });
        it('click remove icon', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('ContainerWrapper')), 'groupingbar_5');
        });
        it('remove filter from filter field', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            element.all(By.className('e-pv-filtered')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_EditorTreeView')), 'groupingbar_6');
        });
        it('Check all option in filter dialog', function () {
            element.all(By.className('e-frame')).get(4).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_EditorTreeView')), 'groupingbar_7');
        });
        it('click ok buttton in filter dialog', function () {
            browser.sleep(2000);
            element.all(By.className('e-ok-btn')).get(0).click();
        });
        it('check in pivot grid', function () {
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_8');
        });
        it('remove filter from column field', function () {
            element.all(By.className('e-pv-filtered')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_EditorTreeView')), 'groupingbar_9');
        });
        it('Check all option in filter dialog', function () {
            element.all(By.className('e-frame')).get(4).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_EditorTreeView')), 'groupingbar_10');
        });
        it('Click ok button in filter dialog', function () {
            browser.sleep(2000);
            element.all(By.className('e-ok-btn')).get(0).click();
        });
        it('check in pivot grid', function () {
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_11');
        });
        it('apply filter in row field', function () {
            element.all(By.className('e-pv-filtered')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_EditorTreeView')), 'groupingbar_12');
        });
        it('select any item from the filter dialog', function () {
            element.all(By.className('e-frame')).get(11).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_EditorTreeView')), 'groupingbar_13');
        });
        it('click ok button in filter dialog', function () {
            browser.sleep(2000);
            element.all(By.className('e-ok-btn')).get(0).click();
        });
        it('check in pivot grid', function () {
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_14');
        });
        it('Click sort icon in row field', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            element.all(By.className('e-pv-filtered')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(4).click();
            browser.sleep(2000);
            element.all(By.className('e-ok-btn')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-pv-filtered')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(4).click();
            browser.sleep(2000);
            element.all(By.className('e-ok-btn')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-pv-filtered')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(11).click();
            browser.sleep(2000);
            element.all(By.className('e-ok-btn')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-sort')).get(1).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_15');
        });
        it('Click sort icon in column field', function () {
            browser.sleep(2000);
            element.all(By.className('e-sort')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_16');
        });
        it('remove column field', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(4).click();
            browser.sleep(2000);
        });
        it('remove industry of row field', function () {
            element.all(By.className('e-remove')).get(4).click();
            browser.sleep(2000);
        });
        it('click dropdown icon in value field', function () {
            element.all(By.className('e-dropdown-icon')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_17');
        });
        it('seclect Aggregation type of count', function () {
            element.all(By.className('e-menu-item')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_18');
        });
        it('click dropdown icon in value field', function () {
            element.all(By.className('e-dropdown-icon')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_19');
        });
        it('seclect Aggregation type of average', function () {
            element.all(By.className('e-menu-item')).get(1).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_20');
        });
        it('click dropdown icon in value field', function () {
            element.all(By.className('e-dropdown-icon')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_21');
        });
        it('seclect Aggregation type of Minimum', function () {
            element.all(By.className('e-menu-item')).get(2).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_22');
        });
        it('click dropdown icon in value field', function () {
            element.all(By.className('e-dropdown-icon')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_23');
        });
        it('seclect Aggregation type of Maximum', function () {
            element.all(By.className('e-menu-item')).get(3).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_24');
        });
        it('click dropdown icon in value field', function () {
            element.all(By.className('e-dropdown-icon')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_25');
        });
        it('seclect Aggregation type of sum', function () {
            element.all(By.className('e-menu-item')).get(4).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_26');
        });
        it('click drilldown icon in row field', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            element.all(By.className('e-expand')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_27');
        });
        it('Add field from the fieldlist', function (done) {
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(10).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_PivotFieldList_Wrapper')), 'groupingbar_28');
        });
        it('check pivotgrid without row fields', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(5).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(5).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_29');
        });
        it('check pivotgrid without column fields', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(4).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_30');
        });
        it('check pivotgrid without all fields', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_31');
        });

        it('drag the field from row to column', function (done) {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            let btn: ElementFinder = element.all(By.css('.e-pivot-button')).get(6);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.id('PivotView')), 'groupingbar_32', done);
            })
        });
        it('click drilldown icon in column field', function () {
            browser.sleep(2000)
            element.all(By.className('e-expand')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_33');
        });

        it('drag the field from row to value field', function (done) {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            let btn: ElementFinder = element.all(By.css('.e-pivot-button')).get(6);
            let area: ElementFinder = element(By.css('.e-values'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.id('PivotView')), 'groupingbar_34', done);
            })
        });
        it('check filter dialog search option', function (done) {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(3).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(4).click();
            browser.sleep(2000);
            element.all(By.className('e-pv-filtered')).get(0).click();
            browser.sleep(2000);
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("Carey");
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(4).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_EditorTreeView')), 'groupingbar_35', done);
        });
        it('Check pivot grid', function () {
            element.all(By.className('e-ok-btn')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_36');
        });
        it('Open calculated field dialog', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar.html');
            browser.sleep(2000);
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000);
            element(By.css('.e-calculated-field')).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_PivotFieldListcalculateddialog')), 'groupingbar_37');
            browser.sleep(2000);
            element.all(By.css('.e-pivot-calc-input')).get(0).sendKeys("Count of product");
            browser.sleep(2000);
            element.all(By.css('.e-pivot-formula')).get(0).sendKeys("Count(product)");
        });
        it('Enter field name and formula', function () {
            browser.sleep(3000);
            browser.compareScreen(element(By.id('PivotView_PivotFieldListcalculateddialog')), 'groupingbar_38');
            browser.sleep(3000);
            element.all(By.className('e-btn')).get(17).click();
            browser.sleep(3000);
            element.all(By.className('e-btn')).get(17).click();
        });
        it('Check in pivotgrid', function () {
            browser.sleep(3000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar_39');
        });
    });
    describe('Grouping bar in mobile', function () {
        it('uncheck show sort icon', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            let elem = element(By.id('sort'));
            elem.click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('ContainerWrapper')), 'groupingbar-mobile_1');
        });
        it('uncheck show filter icon', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(1).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('ContainerWrapper')), 'groupingbar-mobile_2');
        });
        it('uncheck show dropdown icon', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(2).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('ContainerWrapper')), 'groupingbar-mobile_3');
        });
        it('uncheck show remove icon', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(3).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('ContainerWrapper')), 'groupingbar-mobile_4');
        });
        it('click remove icon', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('ContainerWrapper')), 'groupingbar-mobile_5');
        });
        it('remove filter from filter field', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            element.all(By.className('e-pv-filtered')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_EditorTreeView')), 'groupingbar-mobile_6');
        });
        it('Check all option in filter dialog', function () {
            element.all(By.className('e-frame')).get(4).click();
            browser.sleep(3000);
            browser.compareScreen(element(By.id('PivotView_EditorTreeView')), 'groupingbar-mobile_7');
        });
        it('click ok buttton in filter dialog', function () {
            browser.sleep(3000);
            element.all(By.className('e-ok-btn')).get(0).click();
        });
        it('check in pivot grid', function () {
            browser.sleep(3000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_8');
            browser.sleep(3000);
        });

        it('Click sort icon in row field', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            element.all(By.className('e-pv-filtered')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(4).click();
            browser.sleep(2000);
            element.all(By.className('e-ok-btn')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-pv-filtered')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(4).click();
            browser.sleep(2000);
            element.all(By.className('e-ok-btn')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-pv-filtered')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(11).click();
            browser.sleep(2000);
            element.all(By.className('e-ok-btn')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-sort')).get(1).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_9');
        });
        it('Click sort icon in column field', function () {
            browser.sleep(2000);
            element.all(By.className('e-sort')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_10');
        });
        it('remove column field', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(4).click();
            browser.sleep(2000);
        });
        it('remove industry of row field', function () {
            element.all(By.className('e-remove')).get(4).click();
            browser.sleep(2000);
        });
        it('click dropdown icon in value field', function () {
            element.all(By.className('e-dropdown-icon')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_11');
        });
        it('seclect Aggregation type of count', function () {
            browser.sleep(3000);
            element.all(By.css('.e-menu-item')).get(4).click();
            browser.sleep(3000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_12');
        });
        it('click dropdown icon in value field', function () {
            browser.sleep(2000);
            element.all(By.className('e-dropdown-icon')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_13');
        });
        it('seclect Aggregation type of average', function () {
            browser.sleep(3000);
            element.all(By.css('.e-menu-item')).get(5).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_14');
        });
        it('click dropdown icon in value field', function () {
            browser.sleep(3000);
            element.all(By.className('e-dropdown-icon')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_15');
        });
        it('seclect Aggregation type of Minimum', function () {
            browser.sleep(3000);
            element.all(By.css('.e-menu-item')).get(6).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_16');
        });
        it('click dropdown icon in value field', function () {
            browser.sleep(3000);
            element.all(By.css('.e-dropdown-icon')).get(0).click();
            browser.sleep(3000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_17');
        });
        it('seclect Aggregation type of Maximum', function () {
            browser.sleep(3000);
            element.all(By.css('.e-menu-item')).get(7).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_18');
        });
        it('click dropdown icon in value field', function () {
            browser.sleep(3000);
            element.all(By.className('e-dropdown-icon')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_19');
        });
        it('seclect Aggregation type of sum', function () {
            browser.sleep(3000);
            element.all(By.css('.e-menu-item')).get(8).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_20');
        });
        it('Add field from the fieldlist', function (done) {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(3000);
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000);
            element.all(By.className('e-frame')).get(10).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_PivotFieldList_Wrapper')), 'groupingbar-mobile_21');
        });
        it('check pivotgrid without row fields', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(5).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(5).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_22');
        });
        it('check pivotgrid without column fields', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(4).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_23');
        });
        it('check pivotgrid without all fields', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            element.all(By.className('e-remove')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_24');
        });
        it('check filter dialog search option', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            element.all(By.css('.e-remove')).get(3).click();
            browser.sleep(2000);
            element.all(By.css('.e-remove')).get(4).click();
            browser.sleep(2000);
            element.all(By.css('.e-pv-filtered')).get(0).click();
            browser.sleep(3000);
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("Carey");
            browser.sleep(3000);
            element.all(By.css('.e-frame')).get(4).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_EditorTreeView')), 'groupingbar-mobile_25');
            browser.sleep(2000);
            element.all(By.css('.e-ok-btn')).get(0).click();
        });
        it('Check pivot grid', function () {
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_26');
        });
        it('Open calculated field dialog', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar-mobile.html');
            browser.sleep(2000);
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000);
            element(By.css('.e-calculated-field')).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.id('PivotView_PivotFieldListcalculateddialog')), 'groupingbar-mobile_27');
            browser.sleep(2000);
            element.all(By.css('.e-pivot-calc-input')).get(0).sendKeys("Count of product");
            element.all(By.css('.e-pivot-formula')).get(0).sendKeys("Count(product)");
        });
        it('Enter field name and formula', function () {
            browser.sleep(3000);
            browser.compareScreen(element(By.id('PivotView_PivotFieldListcalculateddialog')), 'groupingbar-mobile_28');
            browser.sleep(3000);
            element.all(By.className('e-btn')).get(17).click();
            browser.sleep(3000);
            element.all(By.className('e-btn')).get(17).click();
        });
        it('Check in pivotgrid', function () {
            browser.sleep(3000);
            browser.compareScreen(element(By.id('PivotView')), 'groupingbar-mobile_29');
        });
    });
});

describe('fieldlist spec', function () {
    describe('fieldlist fixed spec', function () {

        //field check/uncheck
        it('check id', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-field-list-tree .e-frame')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_check_id');
        });
        it('uncheck gender', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-field-list-tree .e-frame')).get(8).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_uncheck_gender');
        });
        it('clear rows', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-field-list-tree .e-frame')).get(16).click();
            element.all(By.css('.e-field-list-tree .e-frame')).get(18).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_clear_rows');
        });
        it('single value', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-field-list-tree .e-frame')).get(15).click();
            element.all(By.css('.e-field-list-tree .e-frame')).get(17).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_single_value');
        });
        it('clear value', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-field-list-tree .e-frame')).get(15).click();
            element.all(By.css('.e-field-list-tree .e-frame')).get(17).click();
            element.all(By.css('.e-field-list-tree .e-frame')).get(3).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_clear_value');
        });

        //button drag and drop
        it('product->column', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_dd_product_column', done);
            })
        });
        it('gender->filter', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(2);
            let area: ElementFinder = element(By.css('.e-filters'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_dd_gender_filter', done);
            })
        });
        it('balance->column', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(4);
            let area: ElementFinder = element.all(By.css('.e-btn')).get(3);
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_dd_balance_column', done);
            })
        });
        it('balance->pivotview', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(4);
            let area: ElementFinder = element(By.css('.e-pivotview'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_dd_balance_pivotview', done);
            })
        });
        it('price->row', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(5);
            let area: ElementFinder = element(By.css('.e-rows'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_dd_price_row', done);
            })
        });
        it('values->row', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(3);
            let area: ElementFinder = element(By.css('.e-rows'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_dd_values_row', done);
            })
        });
        it('values->filter', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(3);
            let area: ElementFinder = element(By.css('.e-filters'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_dd_values_filter', done);
            })
        });
        it('values->values', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(3);
            let area: ElementFinder = element(By.css('.e-values'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_dd_values_values', done);
            })
        });
        it('values->pivotview', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(3);
            let area: ElementFinder = element(By.css('.e-pivotview'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_dd_values_pivotview', done);
            })
        });

        //button sort
        it('sort product', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_sort_product');
        });
        it('sort state', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_sort_state');
        });
        it('sort gender', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-pivot-button .e-sort')).get(2).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_sort_gender');
        });
        it('product->column', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_sort_dd_product_column', done);
            })
        });
        it('gender->filter', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(2);
            let area: ElementFinder = element(By.css('.e-filters'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlistsort_dd_gender_filter', done);
            })
        });
        it('sort product', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_rev_sort_product');
        });
        it('sort state', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_rev_sort_state');
        });
        it('sort gender', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-pivot-button .e-sort')).get(2).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(2).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_rev_sort_gender');
        });
        it('single value', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            element.all(By.css('.e-field-list-tree .e-frame')).get(15).click();
            element.all(By.css('.e-field-list-tree .e-frame')).get(17).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_sort_single_value');
        });

        //button filtering
        it('filter dlg product', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(2000)
            element.all(By.css('.e-btn-filter')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlg_product');
        });
        it('filter dlg state', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(2000)
            element.all(By.className('e-btn-filter')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlg_state');
        });
        it('filter dlg gender', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(2000)
            element.all(By.className('e-btn-filter')).get(2).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlg_gender');
        });
        it('filter product check bike', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-btn-filter')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_filter_product_bike');
        });
        it('filter product check bike btn click', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-btn-filter')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_filter_product_bike_btn');
        });
        it('filter gender check all', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-btn-filter')).get(2).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_filter_gender_check_all');
        });
        it('filter sort state->column', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-btn-filter')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("Delhi");
            browser.sleep(2000);
            element.all(By.css('.e-dialog .e-btn')).get(0).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(1);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_filter_sort_dd_state_column', done);
            })
        });
        it('filter dlg gender cancel', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.className('e-btn-filter')).get(2).click();
            browser.sleep(2000)
            element.all(By.css('.e-member-editor-dialog .e-cancel-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlg_gender_cancel');
        });
        it('filter sort check state->column', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            element.all(By.css('.e-btn-filter')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("Delhi");
            element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            element.all(By.css('.e-field-list-tree .e-frame')).get(18).click();
            element.all(By.css('.e-field-list-tree .e-frame')).get(18).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_filter_sort_check_state_column');
        });

        //     //Aggregation
        it('dropdown balance', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dropdown_balance');
        });
        it('dropdown quantity', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dropdown_quantity');
        });
        it('dropdown balance count', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dropdown_balance_count');
        });
        it('dropdown balance avg', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dropdown_balance_avg');
        });
        it('dropdown balance min', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(2).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dropdown_balance_min');
        });
        it('dropdown balance max', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dropdown_balance_max');
        });
        it('dropdown balance sum', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(4).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dropdown_balance_sum');
        });
        it('dropdown product->column', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist__dropdown_dd_product_column', done);
            })
        });
        it('dropdown price->pivotview', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(5);
            let area: ElementFinder = element(By.css('.e-pivotview'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_dropdown_dd_price_pivotview', done);
            })
        });
        it('dropdown sort state', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dropdown_sort_state');
        });
        it('dropdown filter product check bike btn click', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-btn-filter')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dropdown_filter_product_bike_btn');
        });
        it('dropdown check uncheck balance', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-field-list-tree .e-frame')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-field-list-tree .e-frame')).get(3).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dropdown_check_uncheck_balance');
        });
        //drill operations
        it('expand california', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-field-list-tree .e-frame')).get(7).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                element.all(By.css('.e-rowsheader .e-expand')).get(0).click();
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_expand_california', done);
            })
        });
        it('expand female', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-field-list-tree .e-frame')).get(7).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                element.all(By.css('.e-columnsheader .e-expand')).get(0).click();
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_expand_female', done);
            })
        });
        it('expand female collapse california', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-field-list-tree .e-frame')).get(7).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                element.all(By.css('.e-rowsheader .e-expand')).get(0).click();
                browser.sleep(2000)
                element.all(By.css('.e-columnsheader .e-expand')).get(0).click();
                browser.sleep(2000)
                element.all(By.css('.e-rowsheader .e-collapse')).get(0).click();
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_expand_female_collapse_california', done);
            })
        });
        it('expand delhi rajkot', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-field-list-tree .e-frame')).get(7).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                element.all(By.css('.e-rowsheader .e-expand')).get(1).click();
                browser.sleep(2000)
                element.all(By.css('.e-rowsheader .e-expand')).get(3).click();
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_expand_delhi_rajkot', done);
            })
        });
        it('expand delhi product->rows', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-field-list-tree .e-frame')).get(7).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                element.all(By.css('.e-rowsheader .e-expand')).get(1).click();
                browser.sleep(2000)
                btn = element.all(By.css('.e-pivot-button .e-drag')).get(3);
                area = element(By.css('.e-rows'));
                browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                    browser.sleep(2000)
                    browser.compareScreen(element(By.css('.container')), 'fieldlist_expand_delhi_product_rows', done);
                });
            })
        });
        it('expand delhi sort state', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-field-list-tree .e-frame')).get(7).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                element.all(By.css('.e-rowsheader .e-expand')).get(1).click();
                browser.sleep(2000)
                element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_expand_delhi_sort_state', done);
            })
        });
        it('expand delhi filter state', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(1000)
            element.all(By.css('.e-field-list-tree .e-frame')).get(7).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                element.all(By.css('.e-rowsheader .e-expand')).get(1).click();
                browser.sleep(2000)
                element.all(By.className('e-btn-filter')).get(1).click();
                browser.sleep(2000)
                element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
                element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'fieldlist_expand_delhi_filter_state', done);
            })
        });
    });


    describe('fieldlist popup spec', function () {

        //field check/uncheck
        it('check id', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-field-list .e-frame')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_check_id');
        });
        it('uncheck gender', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-field-list .e-frame')).get(8).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_uncheck_gender');
        });
        it('clear rows', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-field-list .e-frame')).get(16).click();
            element.all(By.css('.e-field-list .e-frame')).get(18).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_clear_rows');
        });
        it('single value', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-field-list .e-frame')).get(15).click();
            element.all(By.css('.e-field-list .e-frame')).get(17).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_single_value');
        });
        it('clear value', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-field-list .e-frame')).get(15).click();
            element.all(By.css('.e-field-list .e-frame')).get(17).click();
            element.all(By.css('.e-field-list .e-frame')).get(3).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_clear_value');
        });

        //button drag and drop
        it('product->column', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                browser.compareScreen(element(By.css('.container')), 'popup_dd_product_column', done);
            })
        });
        it('gender->filter', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(2);
            let area: ElementFinder = element(By.css('.e-filters'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                browser.compareScreen(element(By.css('.container')), 'popup_dd_gender_filter', done);
            })
        });
        it('balance->column', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(4);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                browser.compareScreen(element(By.css('.container')), 'popup_dd_balance_column', done);
            })
        });
        it('balance->pivotview', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(4);
            let area: ElementFinder = element(By.css('.e-pivotview'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                browser.compareScreen(element(By.css('.container')), 'popup_dd_balance_pivotview', done);
            })
        });
        it('price->row', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(5);
            let area: ElementFinder = element(By.css('.e-rows'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                browser.compareScreen(element(By.css('.container')), 'popup_dd_price_row', done);
            })
        });
        it('values->row', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(3);
            let area: ElementFinder = element(By.css('.e-rows'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                browser.compareScreen(element(By.css('.container')), 'popup_dd_values_row', done);
            })
        });
        it('values->filter', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(3);
            let area: ElementFinder = element(By.css('.e-filters'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                browser.compareScreen(element(By.css('.container')), 'popup_dd_values_filter', done);
            })
        });
        it('values->values', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(3);
            let area: ElementFinder = element(By.css('.e-values'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                browser.compareScreen(element(By.css('.container')), 'popup_dd_values_values', done);
            })
        });
        it('values->pivotview', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(3);
            let area: ElementFinder = element(By.css('.e-pivotview'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                browser.compareScreen(element(By.css('.container')), 'popup_dd_values_pivotview', done);
            })
        });

        //button sort
        it('sort product', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_sort_product');
        });
        it('sort state', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_sort_state');
        });
        it('sort gender', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(2).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_sort_gender');
        });
        it('product->column', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'popup_sort_dd_product_column', done);
            })
        });
        it('gender->filter', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(2);
            let area: ElementFinder = element(By.css('.e-filters'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'popup_sort_dd_gender_filter', done);
            })
        });
        it('sort product', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_rev_sort_product');
        });
        it('sort state', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_rev_sort_state');
        });
        it('sort gender', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(2).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(2).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_rev_sort_gender');
        });
        it('single value', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            element.all(By.css('.e-field-list .e-frame')).get(15).click();
            element.all(By.css('.e-field-list .e-frame')).get(17).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_sort_single_value');
        });

        //button filtering
        it('filter dlg product', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            element.all(By.css('.e-btn-filter')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dlg_product');
        });
        it('filter dlg state', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            element.all(By.className('e-btn-filter')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dlg_state');
        });
        it('filter dlg gender', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            element.all(By.className('e-btn-filter')).get(2).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dlg_gender');
        });
        it('filter product check bike', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-btn-filter')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_filter_product_bike');
        });
        it('filter product check bike btn click', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-btn-filter')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_filter_product_bike_btn');
        });
        it('filter gender check all', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-btn-filter')).get(2).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_filter_gender_check_all');
        });
        it('filter sort state->column', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-btn-filter')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("Delhi");
            browser.sleep(2000);
            element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(1);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'popup_filter_sort_dd_state_column', done);
            })
        });
        it('filter dlg gender cancel', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.className('e-btn-filter')).get(2).click();
            element.all(By.css('.e-member-editor-dialog .e-cancel-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dlg_gender_cancel');
        });
        it('filter sort check state->column', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-btn-filter')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("Delhi");
            element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
            browser.sleep(2000)
            element.all(By.className('e-sort')).get(1).click();
            element.all(By.css('.e-field-list .e-frame')).get(18).click();
            element.all(By.css('.e-field-list .e-frame')).get(18).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_filter_sort_check_state_column');
        });
        //aggregation
        it('dropdown balance', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dropdown_balance');
        });
        it('dropdown quantity', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dropdown_quantity');
        });
        it('dropdown balance count', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dropdown_balance_count');
        });
        it('dropdown balance avg', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dropdown_balance_avg');
        });
        it('dropdown balance min', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(2).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dropdown_balance_min');
        });
        it('dropdown balance max', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dropdown_balance_max');
        });
        it('dropdown balance sum', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(4).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dropdown_balance_sum');
        });
        it('dropdown product->column', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'popup_dropdown_dd_product_column', done);
            })
        });
        it('dropdown price->pivotview', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(5);
            let area: ElementFinder = element(By.css('.e-pivotview'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000)
                browser.compareScreen(element(By.css('.container')), 'popup_dropdown_dd_price_pivotview', done);
            })
        });
        it('dropdown sort state', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dropdown_sort_state');
        });
        it('dropdown filter product check bike btn click', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-btn-filter')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dropdown_filter_product_bike_btn');
        });
        it('dropdown check uncheck balance', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_popup.html');
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-field-list .e-frame')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-field-list .e-frame')).get(3).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_dropdown_check_uncheck_balance');
        });

        //virtual scrolling
        it('scroll right', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=1000";
            browser.executeScript(script);
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right');
        });
        it('scroll bottom', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom');
        });
        it('scroll left', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=1000";
            browser.executeScript(script);
            browser.sleep(2000)
            script = "document.querySelector('.e-movablecontent').scrollLeft=500";
            browser.executeScript(script);
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_left');
        });
        it('scroll top', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            script = "document.querySelector('.e-movablecontent').scrollTop=250";
            browser.executeScript(script);
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_top');
        });
        it('scroll right collapse 7', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=1000";
            browser.executeScript(script);
            browser.sleep(2000)
            element.all(By.css('.e-rowsheader .e-collapse')).get(7).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_collapse_7');
        });
        it('scroll bottom collapse 7', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element.all(By.css('.e-rowsheader .e-collapse')).get(7).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom_collapse_7');
        });
        it('scroll bottom collapse adriana', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element.all(By.css('.e-columnsheader .e-collapse')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom_collapse_adriana');
        });
        it('scroll right collapse 5', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=1000";
            browser.executeScript(script);
            browser.sleep(2000)
            element.all(By.css('.e-rowsheader .e-collapse')).get(5).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_collapse_5');
        });
        it('scroll right collapse alba', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=1000";
            browser.executeScript(script);
            browser.sleep(2000)
            element.all(By.css('.e-columnsheader .e-collapse')).get(3).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_collapse_alba');
        });
        it('scroll right uncheck balance', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-field-list .e-frame')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_uncheck_balance');
        });
        it('scroll right uncheck gender', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-field-list .e-frame')).get(8).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_uncheck_gender');
        });
        it('scroll bottom uncheck balance', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-field-list .e-frame')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom_uncheck_balance');
        });
        it('scroll bottom uncheck gender', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-field-list .e-frame')).get(8).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom_uncheck_gender');
        });
        it('scroll right gender->column', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(1);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                element.all(By.css('.e-cancel-btn')).get(0).click();
                browser.sleep(1000)
                browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_dd_gender_column', done);
            })
        });
        it('scroll right values->row', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(4);
            let area: ElementFinder = element(By.css('.e-rows'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                element.all(By.css('.e-cancel-btn')).get(0).click();
                browser.sleep(1000)
                browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_dd_values_row', done);
            })
        });
        it('scroll bottom gender->column', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(1);
            let area: ElementFinder = element(By.css('.e-columns'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                element.all(By.css('.e-cancel-btn')).get(0).click();
                browser.sleep(1000)
                browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom_dd_gender_column', done);
            })
        });
        it('scroll bottom values->row', function (done) {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(2000)
            let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(4);
            let area: ElementFinder = element(By.css('.e-rows'));
            browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
                browser.sleep(2000);
                element.all(By.css('.e-cancel-btn')).get(0).click();
                browser.sleep(1000)
                browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom_dd_values_row', done);
            })
        });
        it('scroll right filter gender check male btn click', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-btn-filter')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_filter_gender_male_btn');
        });
        it('scroll right filter isactive check true btn click', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-btn-filter')).get(3).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_filter_isactive_true_btn');
        });
        it('scroll bottom filter gender check male btn click', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-btn-filter')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom_filter_gender_male_btn');
        });
        it('scroll bottom filter isactive check true btn click', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-btn-filter')).get(3).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom_filter_isactive_true_btn');
        });
        it('scroll right sort index', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_sort_index');
        });
        it('scroll right sort name', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(2).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_sort_name');
        });
        it('scroll bottom sort index', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom_sort_index');
        });
        it('scroll bottom sort name', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            element.all(By.css('.e-pivot-button .e-sort')).get(2).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom_sort_name');
        });
        it('scroll right dropdown balance min', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(2).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_dropdown_balance_min');
        });
        it('scroll right dropdown balance max', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_right_dropdown_balance_max');
        });
        it('scroll bottom dropdown balance min', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(2).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom_dropdown_balance_min');
        });
        it('scroll bottom dropdown balance max', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_virtualization.html');
            browser.sleep(2000)
            let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
            browser.executeScript(script);
            browser.sleep(2000)
            element(By.css('.e-toggle-field-list')).click();
            browser.sleep(1000)
            element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(1000)
            browser.compareScreen(element(By.css('.container')), 'popup_virtualscroll_bottom_dropdown_balance_max');
        });
    });

    describe('fieldlist mobile spec', function () {

        //field remove/add
        it('navigate to rows', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(2).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_navigate_rows');
        });
        it('remove product', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(2).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-remove')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_remove_product');
        });
        it('remove price', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-remove')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_remove_price');
        });
        it('remove all values', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(3).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-remove')).get(0).click();
            element.all(By.css('.e-pivot-button .e-remove')).get(0).click();
            element.all(By.css('.e-pivot-button .e-remove')).get(0).click();
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_remove_all_values');
        });
        it('nav right', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-nav-right-arrow')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_nav_right');
        });
        it('nav left', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-nav-right-arrow')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-nav-left-arrow')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_nav_left');
        });
        it('add id in rows', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(2).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-add-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-member-editor-wrapper .e-frame')).get(0).click();
            element.all(By.css('.e-ok-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_add_id_rows');
        });
        it('dialog in columns', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(1).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-add-icon')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_dialog_columns');
        });
        it('dialog in filters', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-add-icon')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_dialog_filters');
        });
        it('remove product from rows', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(2).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-add-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-member-editor-wrapper .e-input')).get(0).sendKeys("product");
            element.all(By.css('.e-member-editor-wrapper .e-frame')).get(16).click();
            element.all(By.css('.e-ok-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_remove_product_rows');
        });
        it('cancel button', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(2).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-add-icon')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-member-editor-wrapper .e-frame')).get(16).click();
            element.all(By.css('.e-cancel-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_cancel_btn');
        });

        //sort/filter
        it('sort gender', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(1).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_sort_gender');
        });
        it('sort product state', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(2).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_sort_product_state');
        });
        it('sort product add id', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(2).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-add-icon')).get(0).click();
            element.all(By.css('.e-member-editor-wrapper .e-frame')).get(0).click();
            element.all(By.css('.e-ok-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_sort_product_add_id');
        });
        it('sort product remove state', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(2).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-remove')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_sort_product_remove_state');
        });
        it('sort gender nav', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(1).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(2).click();
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(1).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_sort_gender_nav');
        });
        it('uncheck female', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(1).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-btn-filter')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-member-editor-wrapper .e-frame')).get(2).click();
            element.all(By.css('.e-pivotfieldlist .e-ok-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_uncheck_female');
        });
        it('uncheck female cancel', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(1).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-btn-filter')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-member-editor-wrapper .e-frame')).get(2).click();
            element.all(By.css('.e-pivotfieldlist .e-cancel-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_uncheck_female_cancel');
        });
        it('uncheck all', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_mobile.html');
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(1).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivot-button .e-btn-filter')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-member-editor-wrapper .e-frame')).get(0).click();
            browser.sleep(2000)
            element.all(By.css('.e-pivotfieldlist .e-ok-btn')).get(0).click();
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'mobile_uncheck_all');
        });
    });
});

describe('Advanced filteirng', function () {
    // Filtering specs using grouping bar

    describe('Advanced filteirng with grouping bar spec', function () {
        it('Pivot Grid with advanced filtering', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.compareScreen(element(By.className('container')), 'pivotgrid_with_advanced_filtering');
        });
        it('Open advanced filtering dialog', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('container')), 'advanced_filtering');
        });
        it('navigate Filter option to label', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            element.all(By.className('e-toolbar-item')).get(1).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'navigate_label_filtering');
        });
        it('navigate Filter option to value', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            element.all(By.className('e-toolbar-item')).get(2).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'navigate_value_filtering');
        });
        it('Test Member search inputs unknown key', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element.all(By.className('e-pv-filter')).get(1).click();
            browser.sleep(1000);
            element(By.className('e-maskedtextbox')).sendKeys('z');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'member_filter_with_unknown_input');
        });
        it('Test Member search inputs with valid key', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element.all(By.className('e-pv-filter')).get(1).click();
            browser.sleep(500);
            element(By.className('e-maskedtextbox')).sendKeys('e');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'member_filter_with_known_input');
        });
        it('Apply member filter', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element.all(By.className('e-pv-filter')).get(1).click();
            browser.sleep(500);
            let filterElement: ElementFinder = element(By.id('PivotView_EditorTreeView'));
            filterElement.all(By.className('e-frame')).get(1).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'un_check_member');
        });
        it('Update apply member filter', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element.all(By.className('e-pv-filter')).get(1).click();
            browser.sleep(500);
            let filterElement: ElementFinder = element(By.id('PivotView_EditorTreeView'));
            filterElement.all(By.className('e-frame')).get(1).click();
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'apply_member_filtering');
        });
        it('Apply all member filter', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element.all(By.className('e-pv-filter')).get(1).click();
            browser.sleep(500);
            let filterElement: ElementFinder = element(By.id('PivotView_EditorTreeView'));
            filterElement.all(By.className('e-frame')).get(0).click();
            filterElement.all(By.className('e-frame')).get(0).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'check_all_member');
        });
        it('Update apply all member filter', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element.all(By.className('e-pv-filter')).get(1).click();
            browser.sleep(500);
            let filterElement: ElementFinder = element(By.id('PivotView_EditorTreeView'));
            filterElement.all(By.className('e-frame')).get(0).click();
            filterElement.all(By.className('e-frame')).get(0).click();
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'apply_all_member_filtering');
        });
        it('Member filter in filter axis', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-pv-filter')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('container')), 'filter_axis_member_filter_dialog');
        });
        it('Apply member filter on filter axis', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-pv-filter')).click();
            browser.sleep(500);
            let filterElement: ElementFinder = element(By.id('PivotView_EditorTreeView'));
            filterElement.all(By.className('e-frame')).get(1).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'un_check_filter_axis_member');
        });
        it('Update apply member filter', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-pv-filter')).click();
            browser.sleep(500);
            let filterElement: ElementFinder = element(By.id('PivotView_EditorTreeView'));
            filterElement.all(By.className('e-frame')).get(1).click();
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'apply_filter_axis_member_filtering');
        });
        it('Apply Clear filter for member filtering', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            element(By.className('e-clear-filter-button')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'clear_member_filter_with pivotgrid');
        });
        it('Pivot Grid with Label filtering', function () {
            browser.load('/demos/pivotview/filtering/label-filter.html');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'pivotgrid_with_label_filtering');
        });
        it('Open Label filter dialog', function () {
            browser.load('/demos/pivotview/filtering/label-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('container')), 'label_filter_dialog');
        });
        it('Test Label filter', function () {
            browser.load('/demos/pivotview/filtering/label-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            let path: string = "document.querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'label_filter_between');
        });
        it('Test filter inputs', function () {
            browser.load('/demos/pivotview/filtering/label-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            let path: string = "document.querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.id('PivotView_label_input_option_1')).clear();
            element(By.id('PivotView_label_input_option_1')).sendKeys('b');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'label_filter_input1_update');
        });
        it('Update Label filter', function () {
            browser.load('/demos/pivotview/filtering/label-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            let path: string = "document.querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.id('PivotView_label_input_option_1')).clear();
            element(By.id('PivotView_label_input_option_1')).sendKeys('b');
            browser.sleep(400);
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'updated_label_filtering_with pivotgrid');
        });
        it('Apply Clear filter for label filtering', function () {
            browser.load('/demos/pivotview/filtering/label-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            element(By.className('e-clear-filter-button')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'clear_label_filter_with pivotgrid');
        });
        it('Pivot Grid with Date filtering', function () {
            browser.load('/demos/pivotview/filtering/date-filter.html');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'pivotgrid_with_date_filtering');
        });
        it('Open Date filter dialog', function () {
            browser.load('/demos/pivotview/filtering/date-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.className('container')), 'date_filter_dialog');
        });
        it('Test Date filter', function () {
            browser.load('/demos/pivotview/filtering/date-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(2000);
            let path: string = "document.querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'date_filter_between');
        });
        it('Update date filter', function () {
            browser.load('/demos/pivotview/filtering/date-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(2000);
            let path: string = "document.querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.className('e-ok-btn')).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.className('e-pivotview')), 'updated_date_filtering_with pivotgrid');
        });
        it('Apply Clear filter for date filtering', function () {
            browser.load('/demos/pivotview/filtering/date-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            element(By.className('e-clear-filter-button')).click();
            browser.sleep(3000);
            browser.compareScreen(element(By.className('e-pivotview')), 'clear_date_filter_with pivotgrid');
        });
        it('Pivot Grid with number filtering', function () {
            browser.load('/demos/pivotview/filtering/number-filter.html');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'pivotgrid_with_number_filtering');
        });
        it('Open Number filter dialog', function () {
            browser.load('/demos/pivotview/filtering/number-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('container')), 'number_filter_dialog');
        });
        it('Test Number filter', function () {
            browser.load('/demos/pivotview/filtering/number-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            let path: string = "document.querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'NotBetween'";
            browser.executeScript(path);
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'number_filter_not_between');
        });
        it('Test filter inputs', function () {
            browser.load('/demos/pivotview/filtering/number-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            let path: string = "document.querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'NotBetween'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.id('PivotView_number_input_option_2')).clear();
            element(By.id('PivotView_number_input_option_2')).sendKeys('36');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'number_filter_input2_update');
        });
        it('Update number filter', function () {
            browser.load('/demos/pivotview/filtering/number-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            let path: string = "document.querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'NotBetween'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.id('PivotView_number_input_option_2')).clear();
            element(By.id('PivotView_number_input_option_2')).sendKeys('36');
            browser.sleep(400);
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'updated_number_filtering_with pivotgrid');
        });
        it('Apply Clear filter for number filtering', function () {
            browser.load('/demos/pivotview/filtering/number-filter.html');
            browser.sleep(500);
            element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            element(By.className('e-clear-filter-button')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'clear_number_filter_with pivotgrid');
        });
        it('Pivot Grid with Value filtering', function () {
            browser.load('/demos/pivotview/filtering/value-filter.html');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'pivotgrid_with_value_filtering');
        });
        it('Open Value filter dialog', function () {
            browser.load('/demos/pivotview/filtering/value-filter.html');
            browser.sleep(500);
            element.all(By.className('e-pv-filtered')).get(1).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('container')), 'value_filter_dialog');
        });
        it('Test Value filter', function () {
            browser.load('/demos/pivotview/filtering/value-filter.html');
            browser.sleep(500);
            element.all(By.className('e-pv-filtered')).get(1).click();
            browser.sleep(500);
            let path: string = "document.querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'value_filter_between');
        });
        it('Test filter inputs', function () {
            browser.load('/demos/pivotview/filtering/value-filter.html');
            browser.sleep(500);
            element.all(By.className('e-pv-filtered')).get(1).click();
            browser.sleep(500);
            let path: string = "document.querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.id('PivotView_value_input_option_2')).clear();
            element(By.id('PivotView_value_input_option_2')).sendKeys('3300');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'value_filter_input2_update');
        });
        it('Update Value filter', function () {
            browser.load('/demos/pivotview/filtering/value-filter.html');
            browser.sleep(500);
            element.all(By.className('e-pv-filtered')).get(1).click();
            browser.sleep(500);
            let path: string = "document.querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.id('PivotView_value_input_option_2')).clear();
            element(By.id('PivotView_value_input_option_2')).sendKeys('3300');
            browser.sleep(400);
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'updated_value_filtering_with pivotgrid');
        });
        it('Apply Clear filter for value filtering', function () {
            browser.load('/demos/pivotview/filtering/value-filter.html');
            browser.sleep(500);
            element.all(By.className('e-pv-filtered')).get(1).click();
            browser.sleep(500);
            element(By.className('e-clear-filter-button')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'clear_value_filter_with pivotgrid');
        });
    });

    // Filtering spec for field list

    describe('Advanced filteirng with field list spec', function () {
        it('Pivot Grid with advanced filtering', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_pivotgrid_with_advanced_filtering');
        });
        it('Open advanced filtering dialog', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('container')), 'fl_advanced_filtering');
        });
        it('navigate Filter option to label', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            element.all(By.className('e-toolbar-item')).get(1).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_navigate_label_filtering');
        });
        it('navigate Filter option to value', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            element.all(By.className('e-toolbar-item')).get(2).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_navigate_value_filtering');
        });
        it('Test Member search inputs unknown key', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.all(By.className('e-pv-filter')).get(1).click();
            browser.sleep(1000);
            element(By.className('e-maskedtextbox')).sendKeys('z');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_member_filter_with_unknown_input');
        });
        it('Test Member search inputs with valid key', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.all(By.className('e-pv-filter')).get(1).click();
            browser.sleep(500);
            element(By.className('e-maskedtextbox')).sendKeys('e');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_member_filter_with_known_input');
        });
        it('Apply member filter', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.all(By.className('e-pv-filter')).get(1).click();
            browser.sleep(500);
            let filterElement: ElementFinder = element(By.id('PivotView_PivotFieldList_EditorTreeView'));
            filterElement.all(By.className('e-frame')).get(1).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_un_check_member');
        });
        it('Update apply member filter', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.all(By.className('e-pv-filter')).get(1).click();
            browser.sleep(500);
            let filterElement: ElementFinder = element(By.id('PivotView_PivotFieldList_EditorTreeView'));
            filterElement.all(By.className('e-frame')).get(1).click();
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            fieldListElement.element(By.className('e-cancel-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_apply_member_filtering');
        });
        it('Apply all member filter', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.all(By.className('e-pv-filter')).get(1).click();
            browser.sleep(500);
            let filterElement: ElementFinder = element(By.id('PivotView_PivotFieldList_EditorTreeView'));
            filterElement.all(By.className('e-frame')).get(0).click();
            filterElement.all(By.className('e-frame')).get(0).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_check_all_member');
        });
        it('Update apply all member filter', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.all(By.className('e-pv-filter')).get(1).click();
            browser.sleep(500);
            let filterElement: ElementFinder = element(By.id('PivotView_PivotFieldList_EditorTreeView'));
            filterElement.all(By.className('e-frame')).get(0).click();
            filterElement.all(By.className('e-frame')).get(0).click();
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            fieldListElement.element(By.className('e-cancel-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_apply_all_member_filtering');
        });
        it('Member filter in filter axis', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filter')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('container')), 'fl_filter_axis_member_filter_dialog');
        });
        it('Apply member filter on filter axis', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filter')).click();
            browser.sleep(500);
            let filterElement: ElementFinder = element(By.id('PivotView_PivotFieldList_EditorTreeView'));
            filterElement.all(By.className('e-frame')).get(1).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_un_check_filter_axis_member');
        });
        it('Update apply member filter', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filter')).click();
            browser.sleep(500);
            let filterElement: ElementFinder = element(By.id('PivotView_PivotFieldList_EditorTreeView'));
            filterElement.all(By.className('e-frame')).get(1).click();
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            fieldListElement.element(By.className('e-cancel-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_apply_filter_axis_member_filtering');
        });
        it('Apply Clear filter for member filtering', function () {
            browser.load('/demos/pivotview/filtering/advanced-filtering.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            element(By.className('e-clear-filter-button')).click();
            browser.sleep(1000);
            fieldListElement.element(By.className('e-cancel-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_clear_member_filter_with pivotgrid');
        });
        it('Pivot Grid with Label filtering', function () {
            browser.load('/demos/pivotview/filtering/label-filter.html');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_pivotgrid_with_label_filtering');
        });
        it('Open Label filter dialog', function () {
            browser.load('/demos/pivotview/filtering/label-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('container')), 'fl_label_filter_dialog');
        });
        it('Test Label filter', function () {
            browser.load('/demos/pivotview/filtering/label-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            /* tslint:disable-next-line:max-line-length */
            let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_label_filter_between');
        });
        it('Test filter inputs', function () {
            browser.load('/demos/pivotview/filtering/label-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.id('PivotView_PivotFieldList_label_input_option_1')).clear();
            element(By.id('PivotView_PivotFieldList_label_input_option_1')).sendKeys('b');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_label_filter_input1_update');
        });
        it('Update Label filter', function () {
            browser.load('/demos/pivotview/filtering/label-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            /* tslint:disable-next-line:max-line-length */
            let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.id('PivotView_PivotFieldList_label_input_option_1')).clear();
            element(By.id('PivotView_PivotFieldList_label_input_option_1')).sendKeys('b');
            browser.sleep(400);
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            fieldListElement.element(By.className('e-cancel-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_updated_label_filtering_with pivotgrid');
        });
        it('Apply Clear filter for label filtering', function () {
            browser.load('/demos/pivotview/filtering/label-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            element(By.className('e-clear-filter-button')).click();
            browser.sleep(1000);
            fieldListElement.element(By.className('e-cancel-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_clear_label_filter_with pivotgrid');
        });
        it('Pivot Grid with Date filtering', function () {
            browser.load('/demos/pivotview/filtering/date-filter.html');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_pivotgrid_with_date_filtering');
        });
        it('Open Date filter dialog', function () {
            browser.load('/demos/pivotview/filtering/date-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.className('container')), 'fl_date_filter_dialog');
        });
        it('Test Date filter', function () {
            browser.load('/demos/pivotview/filtering/date-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(2000);
            /* tslint:disable-next-line:max-line-length */
            let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_date_filter_between');
        });
        it('Update date filter', function () {
            browser.load('/demos/pivotview/filtering/date-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(2000);
            /* tslint:disable-next-line:max-line-length */
            let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            fieldListElement.element(By.className('e-cancel-btn')).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_updated_date_filtering_with pivotgrid');
        });
        it('Apply Clear filter for date filtering', function () {
            browser.load('/demos/pivotview/filtering/date-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            element(By.className('e-clear-filter-button')).click();
            browser.sleep(1000);
            fieldListElement.element(By.className('e-cancel-btn')).click();
            browser.sleep(3000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_clear_date_filter_with pivotgrid');
        });
        it('Pivot Grid with number filtering', function () {
            browser.load('/demos/pivotview/filtering/number-filter.html');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_pivotgrid_with_number_filtering');
        });
        it('Open Number filter dialog', function () {
            browser.load('/demos/pivotview/filtering/number-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('container')), 'fl_number_filter_dialog');
        });
        it('Test Number filter', function () {
            browser.load('/demos/pivotview/filtering/number-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            /* tslint:disable-next-line:max-line-length */
            let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'NotBetween'";
            browser.executeScript(path);
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_number_filter_not_between');
        });
        it('Test filter inputs', function () {
            browser.load('/demos/pivotview/filtering/number-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            /* tslint:disable-next-line:max-line-length */
            let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'NotBetween'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.id('PivotView_PivotFieldList_number_input_option_2')).clear();
            element(By.id('PivotView_PivotFieldList_number_input_option_2')).sendKeys('36');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_number_filter_input2_update');
        });
        it('Update number filter', function () {
            browser.load('/demos/pivotview/filtering/number-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            /* tslint:disable-next-line:max-line-length */
            let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'NotBetween'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.id('PivotView_PivotFieldList_number_input_option_2')).clear();
            element(By.id('PivotView_PivotFieldList_number_input_option_2')).sendKeys('36');
            browser.sleep(400);
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            fieldListElement.element(By.className('e-cancel-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_updated_number_filtering_with pivotgrid');
        });
        it('Apply Clear filter for number filtering', function () {
            browser.load('/demos/pivotview/filtering/number-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.element(By.className('e-pv-filtered')).click();
            browser.sleep(500);
            element(By.className('e-clear-filter-button')).click();
            browser.sleep(1000);
            fieldListElement.element(By.className('e-cancel-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_clear_number_filter_with pivotgrid');
        });
        it('Pivot Grid with Value filtering', function () {
            browser.load('/demos/pivotview/filtering/value-filter.html');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_pivotgrid_with_value_filtering');
        });
        it('Open Value filter dialog', function () {
            browser.load('/demos/pivotview/filtering/value-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.all(By.className('e-pv-filtered')).get(1).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('container')), 'fl_value_filter_dialog');
        });
        it('Test Value filter', function () {
            browser.load('/demos/pivotview/filtering/value-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.all(By.className('e-pv-filtered')).get(1).click();
            browser.sleep(500);
            /* tslint:disable-next-line:max-line-length */
            let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_value_filter_between');
        });
        it('Test filter inputs', function () {
            browser.load('/demos/pivotview/filtering/value-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.all(By.className('e-pv-filtered')).get(1).click();
            browser.sleep(500);
            /* tslint:disable-next-line:max-line-length */
            let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.id('PivotView_PivotFieldList_value_input_option_2')).clear();
            element(By.id('PivotView_PivotFieldList_value_input_option_2')).sendKeys('3300');
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-member-editor-dialog')), 'fl_value_filter_input2_update');
        });
        it('Update Value filter', function () {
            browser.load('/demos/pivotview/filtering/value-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.all(By.className('e-pv-filtered')).get(1).click();
            browser.sleep(500);
            /* tslint:disable-next-line:max-line-length */
            let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'Between'";
            browser.executeScript(path);
            browser.sleep(500);
            element(By.id('PivotView_PivotFieldList_value_input_option_2')).clear();
            element(By.id('PivotView_PivotFieldList_value_input_option_2')).sendKeys('3300');
            browser.sleep(400);
            element(By.className('e-ok-btn')).click();
            browser.sleep(1000);
            fieldListElement.element(By.className('e-cancel-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_updated_value_filtering_with pivotgrid');
        });
        it('Apply Clear filter for value filtering', function () {
            browser.load('/demos/pivotview/filtering/value-filter.html');
            browser.sleep(500);
            element(By.className('e-toggle-field-list')).click();
            browser.sleep(500);
            let fieldListElement: ElementFinder = element(By.id('PivotView_PivotFieldList_Wrapper'));
            fieldListElement.all(By.className('e-pv-filtered')).get(1).click();
            browser.sleep(500);
            element(By.className('e-clear-filter-button')).click();
            browser.sleep(1000);
            fieldListElement.element(By.className('e-cancel-btn')).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.className('e-pivotview')), 'fl_clear_value_filter_with pivotgrid');
        });
    });
});

describe('Conditional formatting', function () {
    describe('Conditional formatting', function () {
        it('Conditional formatting - Code behind formatting', function () {
            browser.load('/demos/pivotview/conditionalformatting/conditionalformatting.html');
            browser.compareScreen(element(By.id('PivotView')), 'conditional-formatting_1');
        });
        it('Conditional formatting - Open dialog', function () {
            element(By.id('format')).click();
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotViewconditionalformatting')), 'conditional-formatting_2');
        });
        it('Conditional formatting - Remove format', function () {
            element(By.id('PivotViewremoveButton1')).click();
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotViewconditionalformatting')), 'conditional-formatting_3');
        });
        it('Conditional formatting - Remove format', function () {
            element(By.id('PivotViewremoveButton0')).click();
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotViewconditionalformatting')), 'conditional-formatting_4');
            element.all(By.className('e-format-apply-button')).click();
        });
        it('Conditional formatting - Remove format', function () {
            browser.compareScreen(element(By.id('PivotView')), 'conditional-formatting_5');
        });
        it('Conditional formatting - Open empty dialog', function () {
            element(By.id('format')).click();
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotViewconditionalformatting')), 'conditional-formatting_6');
        });
        it('Conditional formatting - click add condition button', function () {
            element.all(By.className('e-format-condition-button')).click();
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotViewconditionalformatting')), 'conditional-formatting_7');
        });
        it('Conditional formatting - click add condition button', function () {
            element.all(By.className('e-format-condition-button')).click();
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotViewconditionalformatting')), 'conditional-formatting_8');
            element.all(By.className('e-format-apply-button')).click();
        });
        it('Conditional formatting - Remove format', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotView')), 'conditional-formatting_9');
        });
    });
    describe('Conditional formatting-Mobile', function () {
        it('Conditional formatting - Code behind formatting', function () {
            browser.load('/demos/pivotview/conditionalformatting-mobile/conditionalformatting-mobile.html');
            browser.compareScreen(element(By.id('PivotView')), 'conditional-formatting-Mobile_1');
        });
        it('Conditional formatting - Open dialog', function () {
            element(By.id('format')).click();
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotViewconditionalformatting')), 'conditional-formatting-Mobile_2');
        });
        it('Conditional formatting - Remove format', function () {
            element(By.id('PivotViewremoveButton1')).click();
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotViewconditionalformatting')), 'conditional-formatting-Mobile_3');
        });
        it('Conditional formatting - Remove format', function () {
            element(By.id('PivotViewremoveButton0')).click();
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotViewconditionalformatting')), 'conditional-formatting-Mobile_4');
            element.all(By.className('e-format-apply-button')).click();
        });
        it('Conditional formatting - Remove format', function () {
            browser.compareScreen(element(By.id('PivotView')), 'conditional-formatting-Mobile_5');
        });
        it('Conditional formatting - Open empty dialog', function () {
            element(By.id('format')).click();
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotViewconditionalformatting')), 'conditional-formatting-Mobile_6');
        });
        it('Conditional formatting - click add condition button', function () {
            element.all(By.className('e-format-condition-button')).click();
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotViewconditionalformatting')), 'conditional-formatting-Mobile_7');
        });
        it('Conditional formatting - click add condition button', function () {
            element.all(By.className('e-format-condition-button')).click();
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotViewconditionalformatting')), 'conditional-formatting-Mobile_8');
            element.all(By.className('e-format-apply-button')).click();
        });
        it('Conditional formatting - Remove format', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.id('PivotView')), 'conditional-formatting-Mobile_9');
        });
    });
});

describe('Value Sorting', function () {
    it('Value Sorting - Code behind', function () {
        browser.load('/demos/pivotview/valuesorting/valuesorting.html');
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_1');
        element.all(By.className('e-columnsheader')).get(0).click();
        browser.sleep(500);
    });
    it('Value Sorting - First Click', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_2');
        element.all(By.className('e-columnsheader')).get(0).click();
        browser.sleep(500);
    });
    it('Value Sorting - Second Click', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_3');
        element.all(By.className('e-collapse')).get(0).click();
        browser.sleep(500);
    });
    it('Value Sorting - Collapse', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_4');
        element.all(By.className('e-expand')).get(0).click();
        browser.sleep(500);
    });
    it('Value Sorting - Expand', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_5');
        element.all(By.className('e-toggle-field-list')).get(0).click();
        browser.sleep(500);
        element.all(By.className('e-frame')).get(16).click();
        browser.sleep(500);
        element.all(By.className('e-cancel-btn')).get(0).click();
        browser.sleep(500);
        element.all(By.className('e-columnsheader')).get(0).click();
    });
    it('Value Sorting - Single measure', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_6');
        element.all(By.className('e-columnsheader')).get(0).click();
        browser.sleep(500);
    });
    it('Value Sorting - Single measure', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_7');
        element.all(By.className('e-collapse')).get(0).click();
        browser.sleep(500);
    });
    it('Value Sorting - Single measure-Collapse', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_8');
        element.all(By.className('e-expand')).get(0).click();
    });
    it('Value Sorting - Single measure-Expand', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_9');
        browser.sleep(500);
        element.all(By.className('e-toggle-field-list')).get(0).click();
        browser.sleep(500);
        element.all(By.className('e-frame')).get(3).click();
        element.all(By.className('e-cancel-btn')).get(0).click();
        browser.sleep(500);
    });
    it('Value Sorting - Without measure', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_10');
        browser.sleep(500);
        element.all(By.className('e-toggle-field-list')).get(0).click();
        browser.sleep(500);
        element.all(By.className('e-frame')).get(10).click();
        browser.sleep(500);
        element.all(By.className('e-frame')).get(15).click();
        browser.sleep(500);
        element.all(By.className('e-frame')).get(3).click();
        browser.sleep(500);
        element.all(By.className('e-cancel-btn')).get(0).click();
        browser.sleep(500);
    });
    it('Value Sorting - Single measure- without column', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_11');
        browser.sleep(500);
        element.all(By.className('e-columnsheader')).get(0).click();
        browser.sleep(500);
    });
    it('Value Sorting - Single measure-click', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_12');
        browser.sleep(500);
        element.all(By.className('e-columnsheader')).get(0).click();
        browser.sleep(500);
    });
    it('Value Sorting - Single measure-click1', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_13');
        browser.sleep(500);
        element.all(By.className('e-collapse')).get(1).click();
        element.all(By.className('e-collapse')).get(2).click();
        browser.sleep(1000);
    });
    it('Value Sorting - Single measure-collapse', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_14');
        browser.sleep(500);
        element.all(By.className('e-expand')).get(1).click();
        browser.sleep(1000);
    });
    it('Value Sorting - Single measure-expand', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_15');
        browser.sleep(500);
        browser.executeScript("document.getElementById('PivotView').ej2_instances[0].dataSource.valueAxis = 'row'");
        browser.sleep(500);
        browser.executeScript("document.getElementById('PivotView').ej2_instances[0].dataSource.columns = [{name: 'gender'}]");
        browser.sleep(500);
        element.all(By.className('e-rowsheader')).get(1).click();
        browser.sleep(1000);
    });
    it('Value Sorting - measure in row', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_16');
        browser.sleep(500);
        element.all(By.className('e-rowsheader')).get(1).click();
        browser.sleep(1000);
    });
    it('Value Sorting - measure in row', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_17');
        browser.sleep(500);
        browser.executeScript
            ("document.getElementById('PivotView').ej2_instances[0].dataSource.values = [{name: 'quantity'}, {name: 'balance'}]");
        browser.sleep(500);
        element.all(By.className('e-rowsheader')).get(3).click();
        browser.sleep(1000);
    });
    it('Value Sorting - measure in row', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_18');
        browser.sleep(500);
        element.all(By.className('e-rowsheader')).get(3).click();
        browser.sleep(1000);
    });
    it('Value Sorting - measure in row', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_19');
        browser.sleep(500);
        element.all(By.className('e-collapse')).get(0).click();
        browser.sleep(1000);
    });
    it('Value Sorting - measure in row', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_20');
        browser.sleep(500);
        element.all(By.className('e-expand')).get(0).click();
        browser.sleep(1000);
    });
    it('Value Sorting - measure in row', function () {
        browser.compareScreen(element(By.id('PivotView')), 'valuesorting_21');
    });
});

describe('CalculatedField', function () {
    describe('CalculatedField', function () {
        it('CalculatedField - Code behind', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist.html');
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField_1');
            element(By.id('FieldList_CalculatedField')).click();
        });
        it('CalculatedField - Dialog', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.id('FieldListcalculateddialog')), 'CalculatedField_2');
            element(By.id('FieldListddlelement')).sendKeys('Product Count');
            element(By.id('FieldListdroppable')).sendKeys('"Count(product)"');
            element.all(By.className('e-primary')).get(0).click();
        });
        it('CalculatedField - Add Field', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField_3');
            element.all(By.className('e-frame')).get(15).click();
        });
        it('CalculatedField - Un check Field', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField_4');
            element.all(By.className('e-frame')).get(15).click();
        });
        it('CalculatedField - Check Field', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField_5');
            element(By.id('FieldList_CalculatedField')).click();
            browser.sleep(500);
            element.all(By.className('e-edit')).get(0).click();
        });
        it('CalculatedField - Edit', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.id('FieldListcalculateddialog')), 'CalculatedField_6');
            element(By.id('FieldListdroppable')).sendKeys('+100');
            element.all(By.className('e-primary')).get(0).click();
        });
        it('CalculatedField - After edit', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField_7');
            element(By.id('FieldList_CalculatedField')).click();
            browser.sleep(500);
            element.all(By.className('e-primary')).get(0).click();
        });
        it('CalculatedField - Without field name', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField_8');
            element(By.id('FieldListddlelement')).sendKeys('balance');
            element.all(By.className('e-primary')).get(0).click();
        });
        it('CalculatedField - Same field name', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField_9');
            element.all(By.className('e-ok-btn')).get(0).click();
            browser.sleep(500);
            element(By.id('FieldListddlelement')).sendKeys(' Avg');
            element.all(By.className('e-primary')).get(0).click();
        });
        it('CalculatedField - Without formula', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField_10');
            element.all(By.className('e-ok-btn')).get(0).click();
            browser.sleep(500);
            element(By.id('FieldListdroppable')).sendKeys('"Avg(balance)"');
        });
    });

    describe('CalculatedField-Mobile', function () {
        it('CalculatedField-Mobile - Code behind', function () {
            browser.load('/demos/pivotview/fieldlist-mobile/fieldlist-mobile.html');
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField-mobile_1');
            element.all(By.className('e-toolbar-item')).get(4).click();
        });
        it('CalculatedField - Tab', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField-mobile_2');
            element.all(By.className('e-pivot-ok-button')).get(0).click();
        });
        it('CalculatedField - without field name', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField-mobile_3');
            element(By.id('FieldListddlelement')).sendKeys('balance');
            element.all(By.className('e-pivot-ok-button')).get(0).click();
        });
        it('CalculatedField - same field name', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.e-pivot-error-dialog')), 'CalculatedField-mobile_4');
            element.all(By.className('e-ok-btn')).get(0).click();
            browser.sleep(500);
            element(By.id('FieldListddlelement')).sendKeys(' Avg');
            element.all(By.className('e-pivot-ok-button')).get(0).click();
        });
        it('CalculatedField - without formula', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.e-pivot-error-dialog')), 'CalculatedField-mobile_5');
            element.all(By.className('e-ok-btn')).get(0).click();
            browser.sleep(500);
            element(By.id('FieldListdroppable')).sendKeys('"Avg(balance)"');
            element.all(By.className('e-pivot-ok-button')).get(0).click();
        });
        it('CalculatedField - Add field', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField-mobile_6');
            element.all(By.className('e-toolbar-item')).get(3).click();
        });
        it('CalculatedField - Values Tab', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField-mobile_7');
            element.all(By.className('e-toolbar-item')).get(4).click();
            browser.sleep(500);
            element.all(By.className('e-calculated-field-btn')).get(0).click();
        });
        it('CalculatedField - Add field to formula', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField-mobile_8');
            element.all(By.className('e-pivot-calc-check')).get(2).click();
            browser.sleep(500);
            element(By.css('.e-pivot-add-button')).click();
        });
        it('CalculatedField - After add', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField-mobile_9');
            element(By.id('FieldListddlelement')).sendKeys('Count of pno');
            element.all(By.className('e-pivot-ok-button')).get(0).click();
            browser.sleep(500);
            element.all(By.className('e-toolbar-item')).get(3).click();
        });
        it('CalculatedField - Values Tab', function () {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'CalculatedField-mobile_10');
        });
    });
});

describe('nodata spec', function () {
    it('screen shot for sample nodata', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_nodata.html');
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_sample');
    });
    it('swap rows', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_nodata.html');
        browser.sleep(2000)
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
        let area: ElementFinder = element(By.css('.e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'nodata_swap_row', done);
        })
    });
    it('uncheck country', function () {
        element.all(By.css('.e-field-list-tree .e-frame')).get(1).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_uncheck_country');
    });
    it('check country', function () {
        element.all(By.css('.e-field-list-tree .e-frame')).get(1).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_check_country');
    });
    it('country->pivotview', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_nodata.html');
        browser.sleep(2000)
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
        let area: ElementFinder = element(By.css('.e-pivotview'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'nodata_country_pivotview', done);
        })
    });
    it('check country', function () {
        element.all(By.css('.e-field-list-tree .e-frame')).get(1).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_dd_check_country');
    });
    it('uncheck state', function () {
        element.all(By.css('.e-field-list-tree .e-frame')).get(5).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_uncheck_state');
    });
    it('check state', function () {
        element.all(By.css('.e-field-list-tree .e-frame')).get(5).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_check_state');
    });
    it('uncheck date', function () {
        element.all(By.css('.e-field-list-tree .e-frame')).get(2).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_uncheck_date');
    });
    it('check date', function () {
        element.all(By.css('.e-field-list-tree .e-frame')).get(2).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_check_date');
    });
    it('swap columns', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_nodata.html');
        browser.sleep(2000)
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(2);
        let area: ElementFinder = element(By.css('.e-columns'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'nodata_swap_columns', done);
        })
    });
    it('state->filters', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_nodata.html');
        browser.sleep(2000)
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(1);
        let area: ElementFinder = element(By.css('.e-filters'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'nodata_state_filter_event', done);
        })
    });
    it('state->rows', function (done) {
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
        let area: ElementFinder = element(By.css('.e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'nodata_state_row', done);
        })
    });
    it('sort country', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_nodata.html');
        browser.sleep(2000)
        element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_sort_country');
    });
    it('sort state', function () {
        element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_sort_state');
    });
    it('sort product', function () {
        element.all(By.css('.e-pivot-button .e-sort')).get(2).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_sort_product');
    });
    it('sort date', function () {
        element.all(By.css('.e-pivot-button .e-sort')).get(3).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_sort_date');
    });
    it('include england', function () {
        element.all(By.css('.e-btn-filter')).get(1).click();
        browser.sleep(1000)
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(10).click();
        element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_include_england');
    });
    it('exclude england', function () {
        element.all(By.css('.e-btn-filter')).get(1).click();
        browser.sleep(1000)
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(10).click();
        element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_exclude_england');
    });
    it('include us,uk', function () {
        element.all(By.css('.e-btn-filter')).get(0).click();
        browser.sleep(1000)
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(2).click();
        element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_include_us_uk');
    });
    it('exclude us,uk', function () {
        element.all(By.css('.e-btn-filter')).get(0).click();
        browser.sleep(1000)
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(2).click();
        element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_exclude_us_uk');
    });
    it('rev sort country', function () {
        element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_rev_sort_country');
    });
    it('rev sort state', function () {
        element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_rev_sort_state');
    });
    it('rev sort product', function () {
        element.all(By.css('.e-pivot-button .e-sort')).get(2).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_rev_sort_product');
    });
    it('rev sort date', function () {
        element.all(By.css('.e-pivot-button .e-sort')).get(3).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_rev_sort_date');
    });
    it('uncheck amount', function () {
        element.all(By.css('.e-field-list-tree .e-frame')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_uncheck_amount');
    });
    it('collapse canada', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_nodata.html');
        browser.sleep(2000)
        element.all(By.css('.e-rowsheader .e-collapse')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_collapse_canada');
    });
    it('collapse bike', function () {
        element.all(By.css('.e-columnsheader .e-collapse')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_collapse_bike');
    });
    it('collapse car', function () {
        element.all(By.css('.e-columnsheader .e-collapse')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_collapse_car');
    });
    it('collapse van', function () {
        element.all(By.css('.e-columnsheader .e-collapse')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_collapse_van');
    });
    it('drill swap rows', function (done) {
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
        let area: ElementFinder = element(By.css('.e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'nodata_drill_swap_row', done);
        })
    });
    it('virtual scroll nodata', function () {
        browser.load('/demos/pivotview/virtual scrolling/virtualscrolling_nodata.html');
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_virtual');
    });
    it('virtual sort state', function () {
        element(By.css('.e-toggle-field-list')).click();
        browser.sleep(2000)
        element.all(By.css('.e-pivot-button .e-sort')).get(1).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_virtual_sort_state');
    });
    it('virtual sort country', function () {
        element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_virtual_sort_country');
    });
    it('virtual include england', function () {
        element.all(By.css('.e-btn-filter')).get(1).click();
        browser.sleep(2000)
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(15).click();
        element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
        browser.compareScreen(element(By.css('.container')), 'nodata_virtual_include_england');
    });
    it('virtual exclude england', function () {
        element.all(By.css('.e-btn-filter')).get(1).click();
        browser.sleep(2000)
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(15).click();
        element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
        browser.compareScreen(element(By.css('.container')), 'nodata_virtual_exclude_england');
    });
    it('virtual scroll right', function () {
        element.all(By.css('.e-cancel-btn')).get(0).click();
        browser.sleep(2000)
        let script: string = "document.querySelector('.e-movablecontent').scrollLeft=500";
        browser.executeScript(script);
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_virtual_scroll_right');
    });
    it('virtual scroll left', function () {
        let script: string = "document.querySelector('.e-movablecontent').scrollLeft=0";
        browser.executeScript(script);
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_virtual_scroll_left');
    });
    it('label filter dialog', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_nodata.html');
        browser.sleep(2000)
        element.all(By.css('.e-btn-filter')).get(1).click();
        browser.sleep(2000)
        element.all(By.css('#e-item_1')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_label_dialog');
    });
    it('set begin with', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_nodata.html');
        browser.sleep(2000)
        element.all(By.css('.e-btn-filter')).get(1).click();
        browser.sleep(2000)
        element.all(By.css('#e-item_1')).get(0).click();
        browser.sleep(2000)
        let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'BeginWith'";
        browser.executeScript(path);
        browser.sleep(1000)
        element(By.id('FieldList_label_input_option_1')).clear();
        element(By.id('FieldList_label_input_option_1')).sendKeys('e');
        browser.sleep(1000)
        browser.compareScreen(element(By.css('.container')), 'nodata_label_begin_e');
    });
    it('set begin with e click', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_nodata.html');
        browser.sleep(2000)
        element.all(By.css('.e-btn-filter')).get(1).click();
        browser.sleep(2000)
        element.all(By.css('#e-item_1')).get(0).click();
        browser.sleep(2000)
        let path: string = "document.querySelector('.e-pivotfieldlist-wrapper').querySelectorAll('.e-dropdownlist')[1].ej2_instances[0].value = 'BeginWith'";
        browser.executeScript(path);
        browser.sleep(1000)
        element(By.id('FieldList_label_input_option_1')).clear();
        element(By.id('FieldList_label_input_option_1')).sendKeys('e');
        browser.sleep(1000)
        element(By.className('e-ok-btn')).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_label_begin_e_click');
    });

    it('value filter dialog', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_nodata.html');
        browser.sleep(2000)
        element.all(By.css('.e-btn-filter')).get(1).click();
        browser.sleep(2000)
        element.all(By.css('#e-item_2')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_value_dialog');
    });
    it('virtual scroll bottom', function () {
        let script: string = "document.querySelector('.e-movablecontent').scrollTop=500";
        browser.executeScript(script);
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_virtual_scroll_bottom');
    });
    it('virtual scroll top', function () {
        let script: string = "document.querySelector('.e-movablecontent').scrollTop=0";
        browser.executeScript(script);
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_virtual_scroll_top');
    });
    it('dropdown amount count', function () {
        element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-contextmenu .e-menu-item')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_amount_count');
    });
    it('dropdown amount avg', function () {
        element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-contextmenu .e-menu-item')).get(1).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_amount_avg');
    });
    it('dropdown amount min', function () {
        element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-contextmenu .e-menu-item')).get(2).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_amount_min');
    });
    it('dropdown amount max', function () {
        element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-contextmenu .e-menu-item')).get(3).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_amount_max');
    });
    it('dropdown amount sum', function () {
        element.all(By.css('.e-pivot-button .e-dropdown-icon')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-contextmenu .e-menu-item')).get(4).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'nodata_amount_sum');
    });
    it('country->column', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_dropevent.html');
        browser.sleep(1000)
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-draggable')).get(5);
        let area: ElementFinder = element(By.css('.e-columns'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'gbar_event_dd_country_column', done);
        })
    });
    it('product->rows', function (done) {
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-draggable')).get(2);
        let area: ElementFinder = element(By.css('.e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'gbar_event_dd_product_rows', done);
        })
    });
    it('swap rows', function (done) {
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-draggable')).get(5);
        let area: ElementFinder = element(By.css('.e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'gbar_event_dd_swap_rows', done);
        })
    });
    it('state->column', function (done) {
        element(By.css('.e-toggle-field-list')).click();
        browser.sleep(2000)
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(8);
        let area: ElementFinder = element.all(By.css('.e-columns')).get(1);
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000);
            browser.compareScreen(element(By.css('.container')), 'popup_event_dd_state_column', done);
        })
    });
});

// Advanced aggregation types

describe('Check on Advanced Aggregation types', function () {
    it('Pivot Grid with initial render(Sum) with value in column', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'aggregate_pivotgrid_with_column');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'aggregate_pivotgrid_with_column_1');
    });
    it('Pivot Grid with initial render(Sum) with value in column', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'aggregate_pivotgrid_with_row');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'aggregate_pivotgrid_with_row_1');
    });
    it('Pivot Grid with value in column (Product)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'Product'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_product');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_product_1');
    });
    it('Pivot Grid with value in row (Product)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'Product'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_product');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_product_1');
    });
    it('Pivot Grid with value in column (DistinctCount)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'DistinctCount'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_distinct_count');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_distinct_count_1');
    });
    it('Pivot Grid with value in row (DistinctCount)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'DistinctCount'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_distinct_count');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_distinct_count_1');
    });
    it('Pivot Grid with value in column (Index)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'Index'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_index');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_index_1');
    });
    it('Pivot Grid with value in row (Index)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'Index'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_index');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_index_1');
    });
    it('Pivot Grid with value in column (% Of Grand Total)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfGrandTotal'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_grand_total');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_grand_total_1');
    });
    it('Pivot Grid with value in row (% Of Grand Total)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfGrandTotal'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_grand_total');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_grand_total_1');
    });
    it('Pivot Grid with value in column (% Of Column Total)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfColumnTotal'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_column_total');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_column_total_1');
    });
    it('Pivot Grid with value in row (% Of Column Total)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfColumnTotal'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_column_total');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_column_total_1');
    });
    it('Pivot Grid with value in column (% Of Row Total)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfRowTotal'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_row_total');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_row_total_1');
    });
    it('Pivot Grid with value in row (% Of Row Total)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfRowTotal'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_row_total');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_row_total_1');
    });
    it('Pivot Grid with value in column (Running Totals)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'RunningTotals'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_running_totals');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_running_totals_1');
    });
    it('Pivot Grid with value in row (Running Totals)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'RunningTotals'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_running_totals');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_running_totals_1');
    });
    it('Pivot Grid with value in column (Population StDev)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PopulationStDev'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_population_stdev');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_population_stdev_1');
    });
    it('Pivot Grid with value in row (Population StDev)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PopulationStDev'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_population_stdev');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_population_stdev_1');
    });
    it('Pivot Grid with value in column (Sample StDev)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'SampleStDev'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_samples_stdev');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_samples_stdev_1');
    });
    it('Pivot Grid with value in row (Sample StDev)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'SampleStDev'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_samples_stdev');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_samples_stdev_1');
    });
    it('Pivot Grid with value in column (Population Var)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PopulationVar'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_population_var');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_population_var_1');
    });
    it('Pivot Grid with value in row (PopulationVar)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PopulationVar'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_population_var');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_population_var_1');
    });
    it('Pivot Grid with value in column (Sample Var)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'SampleVar'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_samples_var');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_samples_var_1');
    });
    it('Pivot Grid with value in row (Sample Var)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'SampleVar'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_samples_var');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_samples_var_1');
    });
    it('Pivot Grid with value in column (Difference From)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'DifferenceFrom'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_difference_from');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_difference_from_1');
    });
    it('Pivot Grid with value in row (Difference From)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'DifferenceFrom'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_difference_from');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_difference_from_1');
    });
    it('Pivot Grid with value in column (% Of Difference From)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfDifferenceFrom'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_difference_from');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_difference_from_1');
    });
    it('Pivot Grid with value in row (% Of Difference From)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfDifferenceFrom'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_difference_from');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_difference_from_1');
    });
    it('Pivot Grid with value in column (% Of Parent Total)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfParentTotal'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_parent_total');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_parent_total_1');
    });
    it('Pivot Grid with value in row (% Of Parent Total)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfParentTotal'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_parent_total');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_parent_total_1');
    });
    it('Pivot Grid with value in column (% Of Parent Column Total)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfParentColumnTotal'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_parent_column_total');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_parent_column_total_1');
    });
    it('Pivot Grid with value in row (% Of Parent Column Total)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfParentColumnTotal'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_parent_column_total');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_parent_column_total_1');
    });
    it('Pivot Grid with value in column (% Of Parent Row Total)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfParentRowTotal'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_parent_row_total');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_column_%_of_parent_row_total_1');
    });
    it('Pivot Grid with value in row (% Of Parent Row Total)', function () {
        browser.load('/demos/pivotview/advanced-aggregation/advanced-aggregation-row.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'PercentageOfParentRowTotal'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_parent_row_total');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'advanced_aggregate_type_with_row_%_of_parent_row_total_1');
    });
});

// Hyperlink spec

describe('HyperLink', function () {
    it('Pivot Grid initial rendering without hyperlinks', function () {
        browser.load('/demos/pivotview/hyperlink/hyperlink.html');
        browser.compareScreen(element(By.id('PivotView')), 'hyper_link_pivot_grid_intial_rendering');
    });
    it('Check on show all cells hyperlink', function () {
        browser.load('/demos/pivotview/hyperlink/hyperlink.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'allcells'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_all_cells');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_all_cells_1');
    });
    it('Check on show row header cell hyperlink only', function () {
        browser.load('/demos/pivotview/hyperlink/hyperlink.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'rowheader'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_row_headers');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_row_headers_1');
    });
    it('Check on show column header cell hyperlink only', function () {
        browser.load('/demos/pivotview/hyperlink/hyperlink.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'columnheader'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_column_headers');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_column_headers_1');
    });
    it('Check on show value cells hyperlink only', function () {
        browser.load('/demos/pivotview/hyperlink/hyperlink.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'valuecells'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_value_cells');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_value_cells_1');
    });
    it('Check on show summary cells hyperlink only', function () {
        browser.load('/demos/pivotview/hyperlink/hyperlink.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'summarycells'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_summary_cells');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_summary_cells_1');
    });
    it('Check on show hyperlink on conditional-based(measure)', function () {
        browser.load('/demos/pivotview/hyperlink/hyperlink.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'measurebasedconditioanl'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_condition_based_measure');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_condition_based_measure_1');
    });
    it('Check on show hyperlink on conditional-based(label)', function () {
        browser.load('/demos/pivotview/hyperlink/hyperlink.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'labelbasedconditioanl'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_condition_based_label');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_condition_based_label_1');
    });
    it('Check on show hyperlink on specific row with label text', function () {
        browser.load('/demos/pivotview/hyperlink/hyperlink.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'specificrow'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_specific_row');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_specific_row_1');
    });
    it('Check on show hyperlink on specific column with label text', function () {
        browser.load('/demos/pivotview/hyperlink/hyperlink.html');
        browser.sleep(500);
        let path: string = "document.querySelector('.e-dropdownlist').ej2_instances[0].value = 'specificcolumn'";
        browser.executeScript(path);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_specific_column');
        let scrollPath: string = "document.querySelector('#PivotView_grid div.e-movablecontent').scrollLeft = 1000";
        browser.executeScript(scrollPath);
        browser.sleep(500);
        browser.compareScreen(element(By.className('e-pivotview')), 'hyper_link_with_specific_column_1');
    });
    it('Check on event trigger with hyperlink cell click', function () {
        element(By.className('e-hyperlinkcell')).click();
        browser.sleep(500);
        browser.compareScreen(element(By.className('container')), 'hyper_link_event_triggered');
    });
});

describe('data limit in editor', function () {
    describe('field list', function () {
        it('sample check', function () {
            browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_sample');
        });
        it('index filter open', function () {
            element.all(By.css('.e-btn-filter')).get(4).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_index_filter_dlg');
        });
        it('uncheck all', function () {
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_uncheck_all');
        });
        it('search 1', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("1");
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_search_1');
        });
        it('search 10', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("0");
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_search_10');
        });
        it('clear search', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).clear();
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("0");
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_clear_search');
        });
        it('check 0', function () {
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_check_0');
        });
        it('search 1', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).clear();
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("1");
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_search_1_a');
        });
        it('clear search', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).clear();
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("0");
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_clear_search_a');
        });
        it('check 0', function () {
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_check_0_a');
        });
        it('check 0 btn', function () {
            element.all(By.css('.e-dialog .e-btn')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_check_0_btn');
        });
        it('index filter open', function () {
            element.all(By.css('.e-btn-filter')).get(4).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_index_filter_dlg_a');
        });
        it('search 0', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("0");
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_search_0');
        });
        it('check 0', function () {
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_check_0_b');
        });
        it('search 0', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).clear();
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("0");
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_search_0_a');
        });
        it('uncheck all', function () {
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_uncheck_all_a');
        });
        it('clear search', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).clear();
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_clear_search_b');
        });
        it('product filter open', function () {
            element.all(By.css('.e-dialog .e-btn')).get(0).click();
            browser.sleep(2000);
            element.all(By.css('.e-btn-filter')).get(5).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'fieldlist_dlimit_product_filter_dlg');
        });
    });
    describe('grouping bar', function () {
        it('sample check', function () {
            browser.load('/demos/pivotview/groupingbar/groupingbar_datalimit.html');
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_sample');
        });
        it('index filter open', function () {
            element.all(By.css('.e-btn-filter')).get(1).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_index_filter_dlg');
        });
        it('uncheck all', function () {
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_uncheck_all');
        });
        it('search 1', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("1");
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_search_1');
        });
        it('search 10', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("0");
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_search_10');
        });
        it('clear search', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).clear();
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("0");
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_clear_search');
        });
        it('check 0', function () {
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_check_0');
        });
        it('search 1', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).clear();
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("1");
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_search_1_a');
        });
        it('clear search', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).clear();
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("0");
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_clear_search_a');
        });
        it('check 0', function () {
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_check_0_a');
        });
        it('check 0 btn', function () {
            element.all(By.css('.e-dialog .e-ok-btn')).get(0).click();
            browser.sleep(2000);
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_check_0_btn');
        });
        it('index filter open', function () {
            element.all(By.css('.e-btn-filter')).get(1).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_index_filter_dlg_a');
        });
        it('search 0', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("0");
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_search_0');
        });
        it('check 0', function () {
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_check_0_b');
        });
        it('search 0', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).clear();
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).sendKeys("0");
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_search_0_a');
        });
        it('uncheck all', function () {
            element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_uncheck_all_a');
        });
        it('clear search', function () {
            element.all(By.css('.e-member-editor-dialog .e-input')).get(0).clear();
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_clear_search_b');
        });
        it('product filter open', function () {
            element.all(By.css('.e-dialog .e-ok-btn')).get(0).click();
            browser.sleep(2000);
            element.all(By.css('.e-btn-filter')).get(2).click();
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'gb_dlimit_product_filter_dlg');
        });
    });
});

describe('Drill Through', function () {
    it('dt_bike_female_balance', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        browser.actions().doubleClick(element.all(By.css('.e-pivotview td[aria-colindex="1"]')).get(0)).perform().then(() => {
            browser.sleep(2000);
            browser.compareScreen(element(By.css('.container')), 'dt_bike_female_balance', done);
        });
    });
    it('dt_bike_female_price', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        browser.actions().doubleClick(element.all(By.css('.e-pivotview td[aria-colindex="2"]')).get(0)).perform().then(() => {
            browser.sleep(2000);
            browser.compareScreen(element(By.css('.container')), 'dt_bike_female_price', done);
        });
    });
    it('dt_bike_quantity', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        let script: string = "document.querySelector('.e-movablecontent').scrollLeft=858";
        browser.executeScript(script);
        browser.sleep(500);
        browser.actions().doubleClick(element.all(By.css('.e-pivotview td[aria-colindex="9"]')).get(0)).perform().then(() => {
            browser.sleep(2000);
            browser.compareScreen(element(By.css('.container')), 'dt_bike_quantity', done);
        });
    });
    it('dt_female_balance', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        browser.actions().doubleClick(element.all(By.css('.e-pivotview td[aria-colindex="1"]')).get(6)).perform().then(() => {
            browser.sleep(2000);
            browser.compareScreen(element(By.css('.container')), 'dt_female_balance', done);
        });
    });
    it('dt_quantity', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        let script: string = "document.querySelector('.e-movablecontent').scrollLeft=858";
        browser.executeScript(script);
        browser.sleep(500);
        browser.actions().doubleClick(element.all(By.css('.e-pivotview td[aria-colindex="9"]')).get(6)).perform().then(() => {
            browser.sleep(2000);
            browser.compareScreen(element(By.css('.container')), 'dt_quantity', done);
        });
    });
    it('dt_drill_bike', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        browser.actions().click(element.all(By.css('.e-rowsheader .e-expand')).get(0)).perform().then(() => {
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'dt_drill_bike', done);
        });
    });
    it('dt_california_female_balance', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        element.all(By.css('.e-rowsheader .e-expand')).get(0).click();
        browser.sleep(1000);
        browser.actions().doubleClick(element.all(By.css('.e-pivotview td[aria-colindex="1"]')).get(1)).perform().then(() => {
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'dt_california_female_balance', done);
        });
    });
    it('dt_car_female_balance', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        element.all(By.css('.e-rowsheader .e-expand')).get(0).click();
        browser.sleep(1000);
        browser.actions().doubleClick(element.all(By.css('.e-pivotview td[aria-colindex="1"]')).get(7)).perform().then(() => {
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'dt_car_female_balance', done);
        });
    });
    it('dt_dd_values_row', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        element.all(By.css('.e-rowsheader .e-expand')).get(0).click();
        browser.sleep(1000);
        let btn: ElementFinder = element.all(By.css('.e-pivotfieldlist .e-pivot-button .e-drag')).get(4);
        let area: ElementFinder = element(By.css('.e-pivotfieldlist  .e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'dt_dd_values_row', done);
        });
    });
    it('dt_row_bike_female_balance', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        element.all(By.css('.e-rowsheader .e-expand')).get(0).click();
        browser.sleep(1000);
        let btn: ElementFinder = element.all(By.css('.e-pivotfieldlist .e-pivot-button .e-drag')).get(4);
        let area: ElementFinder = element(By.css('.e-pivotfieldlist  .e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000);
            browser.actions().mouseMove(element.all(By.css('.e-pivotview td[aria-colindex="1"]')).get(1)).mouseMove({ x: 0, y: 0 }).doubleClick().perform().then(() => {
                browser.sleep(1000);
                browser.compareScreen(element(By.css('.container')), 'dt_row_bike_female_balance', done);
            });
        });
    });
    it('dt_row_bike_male_balance', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        element.all(By.css('.e-rowsheader .e-expand')).get(0).click();
        browser.sleep(1000);
        let btn: ElementFinder = element.all(By.css('.e-pivotfieldlist .e-pivot-button .e-drag')).get(4);
        let area: ElementFinder = element(By.css('.e-pivotfieldlist  .e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000);
            browser.actions().mouseMove(element.all(By.css('.e-pivotview td[aria-colindex="2"]')).get(1)).mouseMove({ x: 0, y: 0 }).doubleClick().perform().then(() => {
                browser.sleep(2000);
                browser.compareScreen(element(By.css('.container')), 'dt_row_bike_male_balance', done);
            });
        });

    });
    it('dt_row_bike_male_price', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        element.all(By.css('.e-rowsheader .e-expand')).get(0).click();
        browser.sleep(1000);
        let btn: ElementFinder = element.all(By.css('.e-pivotfieldlist .e-pivot-button .e-drag')).get(4);
        let area: ElementFinder = element(By.css('.e-pivotfieldlist  .e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000);
            browser.actions().mouseMove(element.all(By.css('.e-pivotview td[aria-colindex="2"]')).get(2)).mouseMove({ x: 0, y: 0 }).doubleClick().perform().then(() => {
                browser.sleep(1000);
                browser.compareScreen(element(By.css('.container')), 'dt_row_bike_male_price', done);
            });
        });
    });
    it('dt_row_bike_price', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        element.all(By.css('.e-rowsheader .e-expand')).get(0).click();
        browser.sleep(1000);
        let btn: ElementFinder = element.all(By.css('.e-pivotfieldlist .e-pivot-button .e-drag')).get(4);
        let area: ElementFinder = element(By.css('.e-pivotfieldlist  .e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000);
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=858";
            browser.executeScript(script);
            browser.sleep(500);
            browser.actions().mouseMove(element.all(By.css('.e-pivotview td[aria-colindex="3"]')).get(2)).mouseMove({ x: 0, y: 0 }).doubleClick().perform().then(() => {
                browser.sleep(2000);
                browser.compareScreen(element(By.css('.container')), 'dt_row_bike_price', done);
            });
        });
    });
    it('dt_row_bike_female', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        element.all(By.css('.e-rowsheader .e-expand')).get(0).click();
        browser.sleep(1000);
        let btn: ElementFinder = element.all(By.css('.e-pivotfieldlist .e-pivot-button .e-drag')).get(4);
        let area: ElementFinder = element(By.css('.e-pivotfieldlist  .e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(1000);
            browser.actions().doubleClick(element.all(By.css('.e-pivotview td[aria-colindex="1"]')).get(0)).perform().then(() => {
                browser.sleep(1000);
                browser.compareScreen(element(By.css('.container')), 'dt_row_bike_female', done);
            });
        });
    });
    it('dt_dd_values_state_columns', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        let btn: ElementFinder = element.all(By.css('.e-pivotfieldlist .e-pivot-button .e-drag')).get(2);
        let area: ElementFinder = element(By.css('.e-pivotfieldlist  .e-columns'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000);
            browser.compareScreen(element(By.css('.container')), 'dt_dd_values_state_columns', done);
        });
    });
    it('dt_col_bke_california_balance', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        let btn: ElementFinder = element.all(By.css('.e-pivotfieldlist .e-pivot-button .e-drag')).get(2);
        let area: ElementFinder = element(By.css('.e-pivotfieldlist  .e-columns'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000);
            element.all(By.css('.e-headercell .e-expand')).get(0).click();
            browser.sleep(1000);
            browser.actions().mouseMove(element.all(By.css('.e-pivotview td[aria-colindex="1"]')).get(0)).mouseMove({ x: 0, y: 0 }).doubleClick().perform().then(() => {
                browser.sleep(1000);
                browser.compareScreen(element(By.css('.container')), 'dt_col_bke_california_balance', done);
            });
        });
    });
    it('dt_col_bike_female_price', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        let btn: ElementFinder = element.all(By.css('.e-pivotfieldlist .e-pivot-button .e-drag')).get(2);
        let area: ElementFinder = element(By.css('.e-pivotfieldlist  .e-columns'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000);
            element.all(By.css('.e-headercell .e-expand')).get(0).click();
            browser.sleep(1000);
            let script: string = "document.querySelector('.e-movablecontent').scrollLeft=2474";
            browser.executeScript(script);
            browser.sleep(500);
            browser.actions().mouseMove(element.all(By.css('.e-pivotview td[aria-colindex="20"]')).get(0)).mouseMove({ x: 0, y: 0 }).doubleClick().perform().then(() => {
                browser.sleep(1000);
                browser.compareScreen(element(By.css('.container')), 'dt_col_bike_female_price', done);
            });
        });
    });
    it('dt_bike_female_balance_pno_add', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        browser.actions().doubleClick(element.all(By.css('.e-pivotview td[aria-colindex="1"]')).get(0)).perform().then(() => {
            browser.sleep(2000);
            element.all(By.css('.e-drillthrough-dialog .e-tbar-btn')).get(0).click();
            browser.sleep(500);
            element.all(By.css('.e-ccdlg .e-frame')).get(0).click();
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'dt_bike_female_balance_pno_add');
            element.all(By.css('.e-ccdlg .e-cc_okbtn')).get(0).click();
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'dt_bike_female_balance_pno_add_click', done);
        });
    });
    it('dt_bike_female_balance_state_remove', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_datalimit.html');
        browser.sleep(1000);
        browser.actions().doubleClick(element.all(By.css('.e-pivotview td[aria-colindex="1"]')).get(0)).perform().then(() => {
            browser.sleep(2000);
            element.all(By.css('.e-drillthrough-dialog .e-tbar-btn')).get(0).click();
            browser.sleep(500);
            element.all(By.css('.e-ccdlg .e-frame')).get(1).click();
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'dt_bike_female_balance_state_remove');
            element.all(By.css('.e-ccdlg .e-cc_okbtn')).get(0).click();
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'dt_bike_female_balance_state_remove_click', done);
        });
    });
});

describe('Editing', function () {
    let event: string = "new MouseEvent('dblclick', { 'view': window, 'bubbles': true, 'cancelable': true })";
    let mouseup: string = "new MouseEvent('mouseup', {'view': window,'bubbles': true,'cancelable': true})";
    let mousedown: string = "new MouseEvent('mousedown', {'view': window,'bubbles': true,'cancelable': true})";
    let click: string = "new MouseEvent('click', {'view': window,'bubbles': true,'cancelable': true})";
    it('editing sample check', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_editing.html');
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_sample', done);
    });

    //Normal Mode
    it('bike_female_balance', function (done) {
        browser.actions().doubleClick(element.all(By.css('.e-pivotview td[aria-colindex="1"]')).get(0)).perform().then(() => {
            browser.sleep(2000);
            browser.compareScreen(element(By.css('.container')), 'edit_normal_bike_female_balance');
            browser.executeScript("document.querySelectorAll('.e-drillthrough-grid td[aria-colindex=" + '"11"' + "]')[0].dispatchEvent(" + event + ")");
            let script: string = "document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(" + mousedown + ")";
            browser.executeScript(script);
            script = "document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(" + mouseup + ")";
            browser.executeScript(script);
            browser.compareScreen(element(By.css('.container')), 'edit_normal_bike_female_balance_decrement');
            script = "document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")";
            browser.executeScript(script);
            browser.compareScreen(element(By.css('.container')), 'edit_normal_bike_female_balance_update');
            script = "document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()";
            browser.executeScript(script);
            browser.sleep(1000);
            browser.compareScreen(element(By.css('.container')), 'edit_normal_bike_female_balance_result', done);
        });
    });
    it('california-quantity-female', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[3].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_normal_california-quantity-female');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid td[aria-colindex=" + '"11"' + "]')[0].dispatchEvent(" + event + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(" + mouseup + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_normal_california-quantity-female_increment');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_normal_california-quantity-female_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_normal_california-quantity-female_result');
    });
    it('remove_tamilnadu_single', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[7].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_normal_remove_tamilnadu_single');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[1].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_normal_remove_tamilnadu_single_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_normal_remove_tamilnadu_single_result');
    });
    it('remove_tamilnadu_full', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[7].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_normal_remove_tamilnadu_full');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[1].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_normal_remove_tamilnadu_full_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_normal_remove_tamilnadu_full_result');
    });
    it('add_tamilnadu', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[7].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_normal_add_tamilnadu');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[0].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_normal_add_tamilnadu_new');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-inline-edit .e-input')[0].value = 'Tamilnadu'");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-inline-edit .e-input')[1].value = 'Flight'");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-inline-edit .e-input')[2].value = 'female'");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(" + mouseup + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[3].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[3].dispatchEvent(" + mouseup + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_normal_add_tamilnadu_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_normal_add_tamilnadu_result');
        browser.executeScript("document.querySelectorAll('#batch')[0].click()");
    });

    // Batch Mode
    it('bike_female_balance', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_editing.html');
        browser.sleep(1000);
        browser.executeScript("document.querySelectorAll('#batch')[0].click()");
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"1"' + "]')[0].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_batch_bike_female_balance');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid td[aria-colindex=" + '"11"' + "]')[0].dispatchEvent(" + event + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(" + mouseup + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_batch_bike_female_balance_decrement');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_batch_bike_female_balance_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_batch_bike_female_balance_result');
    });
    it('california-quantity-female', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[3].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_batch_california-quantity-female');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid td[aria-colindex=" + '"11"' + "]')[0].dispatchEvent(" + event + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(" + mouseup + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_batch_california-quantity-female_increment');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_batch_california-quantity-female_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_batch_california-quantity-female_result');
    });
    it('remove_tamilnadu_single', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[7].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_batch_remove_tamilnadu_single');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[1].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_batch_remove_tamilnadu_single_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_batch_remove_tamilnadu_single_result');
    });
    it('remove_tamilnadu_full', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[7].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_batch_remove_tamilnadu_full');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[1].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_batch_remove_tamilnadu_full_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_batch_remove_tamilnadu_full_result');
    });

    // Dialog mode
    it('bike_female_balance', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_editing.html');
        browser.sleep(1000);
        browser.executeScript("document.querySelectorAll('#dialog')[0].click()");
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"1"' + "]')[0].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_bike_female_balance');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid td[aria-colindex=" + '"11"' + "]')[0].dispatchEvent(" + event + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(" + mouseup + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_bike_female_balance_decrement');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_bike_female_balance_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_bike_female_balance_result');
    });
    it('california-quantity-female', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[3].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_california-quantity-female');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid td[aria-colindex=" + '"11"' + "]')[0].dispatchEvent(" + event + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(" + mouseup + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_california-quantity-female_increment');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_california-quantity-female_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_california-quantity-female_result');
    });
    it('remove_tamilnadu_single', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[7].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_remove_tamilnadu_single');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[1].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_remove_tamilnadu_single_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_remove_tamilnadu_single_result');
    });
    it('remove_tamilnadu_full', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[7].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_remove_tamilnadu_full');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[1].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_remove_tamilnadu_full_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_remove_tamilnadu_full_result');
    });
    it('add_tamilnadu', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[7].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_add_tamilnadu');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[0].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_add_tamilnadu_new');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-insertedrow input.e-field')[0].value = 'Tamilnadu'");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-insertedrow input.e-field')[1].value = 'Flight'");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-insertedrow input.e-field')[2].value = 'female'");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(" + mouseup + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[1].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[1].dispatchEvent(" + mouseup + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_add_tamilnadu_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_dialog_add_tamilnadu_result');
        browser.executeScript("document.querySelectorAll('#batch')[0].click()");
    });

    // Command Columns mode
    it('bike_female_balance', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_editing.html');
        browser.sleep(1000);
        browser.executeScript("document.querySelectorAll('#columns')[0].click()");
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"1"' + "]')[0].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_cc_bike_female_balance');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(" + mouseup + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_cc_bike_female_balance_decrement');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[2].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_cc_bike_female_balance_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_cc_bike_female_balance_result');
    });
    it('california-quantity-female', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[3].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_cc_california-quantity-female');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(" + click + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(" + mouseup + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_cc_california-quantity-female_increment');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[2].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_cc_california-quantity-female_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_cc_california-quantity-female_result');
    });
    it('remove_tamilnadu_single', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[7].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_cc_remove_tamilnadu_single');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-deletebutton')[0].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_cc_remove_tamilnadu_single_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_cc_remove_tamilnadu_single_result');
    });
    it('remove_tamilnadu_full', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[7].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_cc_remove_tamilnadu_full');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-deletebutton')[0].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_cc_remove_tamilnadu_full_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_cc_remove_tamilnadu_full_result');
    });
    it('add_tamilnadu', function () {
        browser.executeScript("document.querySelectorAll('td[aria-colindex=" + '"3"' + "]')[7].dispatchEvent(" + event + ")");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_cc_add_tamilnadu');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[0].dispatchEvent(" + click + ")");
        browser.compareScreen(element(By.css('.container')), 'edit_cc_add_tamilnadu_new');
        browser.sleep(500);
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-inline-edit .e-input')[0].value = 'Tamilnadu'");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-inline-edit .e-input')[1].value = 'Flight'");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-inline-edit .e-input')[2].value = 'female'");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(" + mouseup + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[3].dispatchEvent(" + mousedown + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[3].dispatchEvent(" + mouseup + ")");
        browser.executeScript("document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(" + click + ")");
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'edit_cc_add_tamilnadu_update');
        browser.executeScript("document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].click()");
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'edit_cc_add_tamilnadu_result');
    });
});
describe('defer update', function () {
    it('screen shot for fieldlist', function () {
        browser.load('/demos/pivotview/defer-update/fieldlist.html');
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_1');
    });
    it('sort click', function () {
        element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_2');
    });
    it('cancel click', function () {
        element.all(By.css('.e-defer-cancel-button')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_3');
    });
    it('sort click', function () {
        element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_4');
    });
    it('apply click', function () {
        element.all(By.css('.e-defer-apply-button')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_5');
    });
    it('product->column', function (done) {
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
        let area: ElementFinder = element(By.css('.e-columns'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'DeferUpdate_6', done);
        })
    });
    it('cancel click', function () {
        element.all(By.css('.e-defer-cancel-button')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_7');
    });
    it('product->column', function (done) {
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
        let area: ElementFinder = element(By.css('.e-columns'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'DeferUpdate_8', done);
        })
    });
    it('apply click', function () {
        element.all(By.css('.e-defer-apply-button')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_9');
    });
    it('filter product check bike btn click', function () {
        element.all(By.css('.e-btn-filter')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
        element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_10');
    });
    it('cancel click', function () {
        element.all(By.css('.e-defer-cancel-button')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_11');
    });
    it('filter product check bike btn click', function () {
        element.all(By.css('.e-btn-filter')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
        element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_12');
    });
    it('apply click', function () {
        element.all(By.css('.e-defer-apply-button')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_13');
    });
    it('remove button', function (done) {
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
        let area: ElementFinder = element(By.css('.e-field-table'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'DeferUpdate_14', done);
        })
    });
    it('cancel click', function () {
        element.all(By.css('.e-defer-cancel-button')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_15');
    });
    it('remove button', function (done) {
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
        let area: ElementFinder = element(By.css('.e-field-table'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'DeferUpdate_16', done);
        })
    });
    it('apply click', function () {
        element.all(By.css('.e-defer-apply-button')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_17');
    });
    it('CalculatedField', function () {
        element(By.id('FieldList_CalculatedField')).click();
        browser.sleep(500);
        element(By.id('FieldListddlelement')).sendKeys('Product Count');
        element(By.id('FieldListdroppable')).sendKeys('"Count(product)"');
        element.all(By.className('e-primary')).get(1).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_18');
    });
    it('cancel click', function () {
        element.all(By.css('.e-defer-cancel-button')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_19');
    });
    it('CalculatedField', function () {
        element(By.id('FieldList_CalculatedField')).click();
        browser.sleep(500);
        element(By.id('FieldListddlelement')).sendKeys('Product Count');
        element(By.id('FieldListdroppable')).sendKeys('"Count(product)"');
        element.all(By.className('e-primary')).get(1).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_20');
    });
    it('apply click', function () {
        element.all(By.css('.e-defer-apply-button')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_21');
    });
});

describe('defer update popup', function () {
    it('check id', function () {
        browser.load('/demos/pivotview/defer-update/fieldlist_popup.html');
        browser.sleep(500);
        element(By.css('.e-toggle-field-list')).click();
        element.all(By.css('.e-field-list .e-frame')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_1');
    });
    it('cancel click', function () {
        element.all(By.css('.e-cancel-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_2');
    });
    it('check id', function () {
        element(By.css('.e-toggle-field-list')).click();
        element.all(By.css('.e-field-list .e-frame')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_3');
    });
    it('apply click', function () {
        element.all(By.css('.e-defer-update-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_4');
    });
    it('uncheck gender', function () {
        element(By.css('.e-toggle-field-list')).click();
        element.all(By.css('.e-field-list .e-frame')).get(8).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_5');
    });
    it('cancel click', function () {
        element.all(By.css('.e-cancel-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_6');
    });
    it('uncheck gender', function () {
        element(By.css('.e-toggle-field-list')).click();
        element.all(By.css('.e-field-list .e-frame')).get(8).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_7');
    });
    it('apply click', function () {
        element.all(By.css('.e-defer-update-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_8');
    });
    it('product->column', function (done) {
        element(By.css('.e-toggle-field-list')).click();
        browser.sleep(500);
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
        let area: ElementFinder = element(By.css('.e-columns'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_9', done);
        })
    });
    it('cancel click', function () {
        element.all(By.css('.e-cancel-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_10');
    });
    it('product->column', function (done) {
        element(By.css('.e-toggle-field-list')).click();
        browser.sleep(500);
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
        let area: ElementFinder = element(By.css('.e-columns'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_11', done);
        })
    });
    it('apply click', function () {
        element.all(By.css('.e-defer-update-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_12');
    });
    it('sort state', function () {
        element(By.css('.e-toggle-field-list')).click();
        element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_13');
    });
    it('cancel click', function () {
        element.all(By.css('.e-cancel-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_14');
    });
    it('sort state', function () {
        element(By.css('.e-toggle-field-list')).click();
        element.all(By.css('.e-pivot-button .e-sort')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_15');
    });
    it('apply click', function () {
        element.all(By.css('.e-defer-update-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_16');
    });
    it('filter state', function () {
        element(By.css('.e-toggle-field-list')).click();
        element.all(By.css('.e-btn-filter')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
        element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
        browser.sleep(500)
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_17');
    });
    it('cancel click', function () {
        element.all(By.css('.e-cancel-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_18');
    });
    it('filter state', function () {
        element(By.css('.e-toggle-field-list')).click();
        element.all(By.css('.e-btn-filter')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
        element.all(By.css('.e-member-editor-dialog .e-btn')).get(0).click();
        browser.sleep(500)
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_19');
    });
    it('apply click', function () {
        element.all(By.css('.e-defer-update-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_20');
    });
    it('CalculatedField', function () {
        element(By.css('.e-toggle-field-list')).click();
        element(By.id('PivotView_PivotFieldList_CalculatedField')).click();
        browser.sleep(500);
        element(By.id('PivotView_PivotFieldListddlelement')).sendKeys('Product Count');
        element(By.id('PivotView_PivotFieldListdroppable')).sendKeys('"Count(product)"');
        element.all(By.className('e-primary')).get(2).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_21');
    });
    it('cancel click', function () {
        element.all(By.css('.e-cancel-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_22');
    });
    it('CalculatedField', function () {
        element(By.css('.e-toggle-field-list')).click();
        element(By.id('PivotView_PivotFieldList_CalculatedField')).click();
        browser.sleep(500);
        element(By.id('PivotView_PivotFieldListddlelement')).sendKeys('Product Count');
        element(By.id('PivotView_PivotFieldListdroppable')).sendKeys('"Count(product)"');
        element.all(By.className('e-primary')).get(2).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_23');
    });
    it('apply click', function () {
        element.all(By.css('.e-defer-update-btn')).get(0).click();
        browser.sleep(500);
        browser.compareScreen(element(By.css('.container')), 'DeferUpdate_Popup_24');
    });
});
describe('sub total hiding', function () {
    it('Initial', function () {
        browser.load('/demos/pivotview/summary-customization/sub-total.html');
        browser.sleep(500);
        browser.compareScreen(element(By.css('#PivotView')), 'SubTotal_1');
        element.all(By.css('.e-expand')).get(0).click();
    });
    it('Drill', function (done) {
        browser.compareScreen(element(By.css('#PivotView')), 'SubTotal_2');
        let btn: ElementFinder = element.all(By.css('.e-pivot-button')).get(6);
        let area: ElementFinder = element(By.css('.e-columns'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(By.css('#PivotView')), 'SubTotal_3', done);
        })
    });
    it('Drag and drop', function (done) {
        let btn: ElementFinder = element.all(By.css('.e-pivot-button')).get(5);
        let area: ElementFinder = element(By.css('.e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(500);
            browser.compareScreen(element(By.css('#PivotView')), 'SubTotal_4', done);
            element.all(By.css('.e-expand')).get(0).click();
        })
    });
    it('Drill', function () {
        browser.compareScreen(element(By.css('#PivotView')), 'SubTotal_5');
    });
});
describe('grand total hiding', function () {
    it('Initial', function () {
        browser.load('/demos/pivotview/summary-customization/grand-total.html');
        browser.sleep(500);
        browser.compareScreen(element(By.css('#PivotView')), 'GrandTotal_1');
        element.all(By.css('.e-pivot-button .e-remove')).get(3).click();
    });
    it('Values only', function () {
        browser.compareScreen(element(By.css('#PivotView')), 'GrandTotal_2');
    });
});
describe('pivot grid slicer appearence spec', function () {
    it('navigate to filters', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer_mobile.html');
        browser.sleep(2000)
        element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'mobile_dialog_filters_slicer');
    });
    it('fieldlist mobile filter with all items checked', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer_mobile.html');
        browser.sleep(2000)
        element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(0).click();
        browser.sleep(2000)
        element.all(By.className('e-btn-filter')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-member-editor-wrapper .e-frame')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'mobile_slicer_check_all');
        element.all(By.css('.e-pivotfieldlist .e-ok-btn')).get(0).click();
        browser.sleep(2000)
    });
    it('filter slicer after check all', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer_mobile.html');
        browser.sleep(2000)
        element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(0).click();
        browser.sleep(2000)
        element.all(By.className('e-btn-filter')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-member-editor-wrapper .e-frame')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-pivotfieldlist .e-ok-btn')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'mobile_dialog_filters_slicer_after_checkall');
    });
    it('fieldlist mobile filter with single item checked', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer_mobile.html');
        element.all(By.css('.e-btn-filter')).get(0).click();
        browser.sleep(1000);
        let filterElement: ElementFinder = element(By.id('FieldList_EditorTreeView'));
        filterElement.all(By.className('e-frame')).get(2).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'mobile_dialog_filters_single_item_checked');
        element(By.className('e-ok-btn')).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'mobile_dialog_filters_after_single_item_checked');
        browser.sleep(2000)
    });
    it('uncheck  multiple', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer_mobile.html');
        browser.sleep(2000)
        element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-pivot-button .e-btn-filter')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-member-editor-wrapper .e-frame')).get(1).click();
        browser.sleep(2000)
        element.all(By.css('.e-member-editor-wrapper .e-frame')).get(2).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'mobile_slicer_uncheck_multiple');
        element.all(By.css('.e-pivotfieldlist .e-ok-btn')).get(0).click();
        browser.sleep(2000)
    });
    it('filter slicer after uncheck multiple', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer_mobile.html');
        browser.sleep(2000)
        element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'mobile_dialog_filters_slicer_after_uncheckmultiple');
    });
    //new
    it('filter slicer after uncheck multiple fields', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer_mobile.html');
        browser.sleep(2000)
        element.all(By.css('.e-pivotfieldlist .e-tab-wrap')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-btn-filter')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-member-editor-wrapper .e-frame')).get(1).click();
        browser.sleep(2000)
        element.all(By.css('.e-member-editor-wrapper .e-frame')).get(2).click();
        browser.sleep(2000)
        element.all(By.css('.e-pivotfieldlist .e-ok-btn')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'mobile_dialog_filters_slicer_after_uncheckmultiple_fields');
    });
    it('screen shot for fieldlist slicer', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer.html');
        browser.compareScreen(element(By.css('.container')), 'fieldlist_slicer_sample')
    });
    it('fieldlist filter with all items checked', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer.html');
        //element(By.css('.e-axis-content e-filters')).get(0).click();
        element.all(By.css('.e-btn-filter')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'fieldlist_slicer_check_all');
        element.all(By.css('.e-pivotfieldlist .e-ok-btn')).get(0).click();
        browser.sleep(2000)
    });
    it('fieldlist slicer eyecolor after check all', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer.html');
        element.all(By.css('.e-btn-filter')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        browser.sleep(2000)
        element.all(By.css('.e-pivotfieldlist .e-ok-btn')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'fieldlist_slicer_eyecolor_checkall')
    });
    it('screen shot for groupingbar', function () {
        browser.load('/demos/pivotview/groupingbar/groupingbar.html');
        browser.sleep(2000)
        browser.compareScreen(element(By.id('PivotView')), 'groupingbar_filter_slicer_sample');
    });
    //new
    it('screen shot for groupingbar filter button', function () {
        browser.load('/demos/pivotview/groupingbar/groupingbar.html');
        browser.sleep(2000)
        element.all(By.css('.e-btn-filter')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
        //element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        browser.compareScreen(element(By.css('.e-dlg-container')), 'groupingbar_slicer_filter_sample_checkall');
    });
    it('screen shot for groupingbar filter after checkall', function () {
        browser.load('/demos/pivotview/groupingbar/groupingbar.html');
        browser.sleep(2000)
        element.all(By.css('.e-btn-filter')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(1).click();
        element.all(By.css('.e-ok-btn')).get(0).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.id('PivotView')), 'groupingbar_slicer_filter_after_checkall');
    });
    it('fieldlist poup filter', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer_popup.html');
        browser.sleep(2000)
        element(By.css('.e-toggle-field-list')).click();
        element.all(By.css('.e-field-list .e-frame')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'fieldlist_slicer_popup');
    });
    it('fieldlist poup filter dialog', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer_popup.html');
        browser.sleep(2000)
        element(By.css('.e-toggle-field-list')).click();
        element.all(By.css('.e-field-list .e-frame')).get(0).click();
        element.all(By.css('.e-btn-filter')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'fieldlist_popup_filterslicer_dialog');
    });
    it('fieldlist poup filter dialog after update', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer_popup.html');
        browser.sleep(2000)
        element(By.css('.e-toggle-field-list')).click();
        element.all(By.css('.e-field-list .e-frame')).get(0).click();
        element.all(By.css('.e-btn-filter')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-member-editor-dialog .e-frame')).get(0).click();
        element.all(By.css('.e-ok-btn')).get(0).click();
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'fieldlist_popup_filter_dialog_afterupdate');
    });
    // draganddrop
    it('eyeColor->rows', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer.html');
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
        let area: ElementFinder = element(By.css('.e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000)
            browser.compareScreen(element(By.css('.container')), 'fieldlist_slicer_dd_eyecolor_rows', done);
        })
    });
    it('eyeColor->rows filter update', function (done) {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer.html');
        let btn: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(0);
        let area: ElementFinder = element(By.css('.e-rows'));
        browser.actions().dragAndDrop(btn, area).mouseUp().perform().then(() => {
            browser.sleep(2000);
        })
        element.all(By.css('.e-btn-filter')).get(2).click();
        let filterElement: ElementFinder = element(By.id('FieldList_EditorTreeView'));
        filterElement.all(By.className('e-frame')).get(2).click();
        element(By.className('e-ok-btn')).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'fieldlist_slicer_dd_eyecolor_rows_filter_update', done);
        let btn1: ElementFinder = element.all(By.css('.e-pivot-button .e-drag')).get(2);
        let area1: ElementFinder = element(By.css('.e-filters'));
        browser.actions().dragAndDrop(btn1,area1).mouseUp().perform().then(()=>{
            browser.sleep(2000);
        })
        browser.compareScreen(element(By.css('.container')),'fieldlist_slicer_dd_eyecolor_filtersaxis');
    });
    it('check multiple filter on filter axis', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_slicer.html');
        browser.sleep(500);
        element.all(By.css('.e-btn-filter')).get(0).click();
        browser.sleep(1000);
        let filterElement: ElementFinder = element(By.id('FieldList_EditorTreeView'));
        filterElement.all(By.className('e-frame')).get(2).click();
        browser.sleep(1000);
        element(By.className('e-ok-btn')).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'fieldlist_slicer_check_multiple_filter_members');
    });
    it('screen shot for groupingbar', function () {
        browser.load('/demos/pivotview/groupingbar/groupingbar_slicer.html');
        browser.sleep(2000)
        browser.compareScreen(element(By.id('PivotView')), 'groupingbar_slicer_default_sample');
    });
    it('check multiple fields on grouping bar filter axis', function () {
        browser.load('/demos/pivotview/groupingbar/groupingbar_slicer.html');
        browser.sleep(500);
        element.all(By.css('.e-btn-filter')).get(0).click();
        browser.sleep(1000);
        let filterElement: ElementFinder = element(By.id('PivotView_EditorTreeView'));
        filterElement.all(By.className('e-frame')).get(1).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.e-member-editor-dialog')), 'groupingbar_slicer_check_multiple_filter_members');
    });
    it('check multiple fields on grouping bar', function () {
        browser.load('/demos/pivotview/groupingbar/groupingbar_slicer.html');
        browser.sleep(500);
        element.all(By.css('.e-btn-filter')).get(0).click();
        browser.sleep(1000);
        let filterElement: ElementFinder = element(By.id('PivotView_EditorTreeView'));
        filterElement.all(By.className('e-frame')).get(1).click();
        element(By.className('e-ok-btn')).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'groupingbar_slicer_after_check_multiple_members');
    });
    it('check all fields on grouping bar filter axis', function () {
        browser.load('/demos/pivotview/groupingbar/groupingbar_slicer.html');
        browser.sleep(500);
        element.all(By.css('.e-btn-filter')).get(0).click();
        browser.sleep(1000);
        let filterElement: ElementFinder = element(By.id('PivotView_EditorTreeView'));
        filterElement.all(By.className('e-frame')).get(1).click();
        filterElement.all(By.className('e-frame')).get(2).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.e-member-editor-dialog')), 'groupingbar_slicer_check_all_filter_members');
        element(By.className('e-ok-btn')).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.css('.container')), 'groupingbar_slicer_after_check_all_members');
    });
    it('screen shot for groupingbar', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_groupingbar.html');
        browser.sleep(2000)
        browser.compareScreen(element(By.css('.container')), 'fieldlist_slicer_with_groupingbar');
    });
    it('changing filter status in groupingbar', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_groupingbar.html');
        browser.sleep(2000);
        element.all(By.css('.e-btn-filter')).get(0).click();
        browser.sleep(1000);
        let filterElement: ElementFinder = element(By.id('PivotView_EditorTreeView'));
        filterElement.all(By.className('e-frame')).get(2).click();
        browser.compareScreen(element(By.css('.container')), 'fieldlist_slicer_groupingbar_filterstatus');
        element(By.className('e-ok-btn')).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.css('.container')),'fieldlist_slicer_groupingbar_filterupdate');
    });
    it('changing filter status in fieldlist', function () {
        browser.load('/demos/pivotview/fieldlist/fieldlist_groupingbar.html');
        browser.sleep(2000);
        element.all(By.css('.e-btn-filter')).get(4).click();
        browser.sleep(1000);
        let filterElement: ElementFinder = element(By.id('FieldList_EditorTreeView'));
        filterElement.all(By.className('e-frame')).get(1).click();
        filterElement.all(By.className('e-frame')).get(2).click();
        browser.compareScreen(element(By.css('.container')), 'fieldlist_slicer_FL_filterstatus');
        element(By.className('e-ok-btn')).click();
        browser.sleep(2000);
        browser.compareScreen(element(By.css('.container')),'fieldlist_slicer_FL_filterupdate');
    });
});