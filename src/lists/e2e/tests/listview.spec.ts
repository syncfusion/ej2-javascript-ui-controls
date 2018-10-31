import { browser, element, By } from "@syncfusion/ej2-base/e2e/index";
import { Helper } from './Helper/helper.spec';
browser.css = ` .e-listview .e-list-item.e-hover { background-color: inherit; color: inherit; }`;
let helper = new Helper();
describe('ListView', function () {

    it('default rendering', function () {
        helper.loadAndWait('/demos/listview/default/index.html', helper.default_List);
        browser.compareScreen(element(helper.default_List), 'default_list');
    });

    it('grouped list', function () {
        helper.loadAndWait('/demos/listview/grouping/index.html', helper.group_List);
        browser.compareScreen(element(helper.group_List), 'grouped_list');
    });

    it('remote data binding', function () {
        helper.loadAndWait('/demos/listview/remote-data/index.html', helper.list_ClassName);
        helper.waitUntilPresent(helper.list_ClassName);
        browser.compareScreen(element(helper.remote_List), 'remote_data_list');

    });

    it('RTL rendering', function () {
        helper.loadAndWait('/demos/listview/rtl/index.html', helper.rtl_List);
        browser.compareScreen(element(helper.rtl_List), 'rtl_list');
    });

    it('disable listview', function () {
        helper.loadAndWait('/demos/listview/default/index.html', helper.default_List);
        helper.clickByXPath("//*[@id='list_disable']");
        helper.waitUntilPresent(helper.default_List);
        browser.compareScreen(element(helper.default_List), 'disable_list');
    });

});

describe('Nested list - API', function () {

    beforeEach((): void => {
        helper.loadAndWait('/demos/listview/nesting/index.html', helper.list_ClassName);
    });

    it('set listview width', function () {
        helper.clickByXPath("//*[@id='list_width']");
        helper.waitUntilPresent(helper.list_ClassName);
        browser.compareScreen(element(helper.nested_List), 'nested_list_width');
    });

    it('hide listview header', function () {
        helper.clickByXPath("//*[@id='list_header']");
        helper.waitUntilPresent(helper.list_ClassName);
        browser.compareScreen(element(helper.nested_List), 'nested_list_header');
    });

    it('hide listiew item icons', function () {
        helper.clickByXPath("//*[@id='list_icon']");
        helper.waitUntilPresent(helper.list_ClassName);
        browser.compareScreen(element(helper.nested_List), 'nested_list_icon');
    });

});

describe('Nested list - Theme', function () {

    for (var x = 0; x < 3; x++) {
        theme_change(x);
    }
    function theme_change(x: any) {
        let theme_name = ['material', 'fabric', 'bootstrap'];
        it('default rendering', function () {
            helper.loadAndWait('/demos/listview/list-theme/index.html', helper.nested_List);
            helper.clickByXPath("//*[@value='" + x + "']");
            helper.waitUntilPresent(helper.list_ClassName, 4000);
            browser.compareScreen(element(helper.nested_List), 'nested_list_' + theme_name[x]);
        });

        it('set active item', function () {
            helper.waitUntilPresent(helper.list_ClassName);
            helper.clickByXPath("//li[4]");
            helper.waitUntilPresent(helper.nested_List, 4000);
            helper.clickByXPath("//*[@id='list_active']");
            helper.waitUntilPresent(helper.active_ClassName);
            browser.compareScreen(element(helper.nested_List), 'nested_list_active_' + theme_name[x]);
        });
    }

});

describe('CheckBox - Theme', function () {

    for (var x = 0; x < 3; x++) {
        theme_change(x);
    }
    function theme_change(x: any) {
        let theme_name = ['material', 'fabric', 'bootstrap'];
        it('check all items', function () {
            helper.loadAndWait('/demos/listview/listview-checkbox/index.html', helper.checked_List);
            helper.clickByXPath("//*[@value='" + x + "']");
            helper.waitUntilPresent(helper.list_ClassName);
            helper.clickByXPath("//*[@id='list_check']");
            helper.waitUntilPresent(helper.checked_ClassName, 4000);
            browser.compareScreen(element(helper.checked_List), 'list_check_' + theme_name[x]);
        });
        it('uncheck all items', function () {
            helper.waitUntilPresent(helper.list_ClassName);
            helper.clickByXPath("//*[@id='list_uncheck']");
            helper.waitUntilPresent(helper.list_ClassName, 4000);
            browser.compareScreen(element(helper.checked_List), 'list_uncheck_' + theme_name[x]);
        });
        it('uncheck all items in RTL mode', function () {
            helper.clickByXPath("//*[@id='rtl']");
            helper.waitUntilPresent(helper.list_ClassName, 4000);
            browser.compareScreen(element(helper.checked_List), 'list_uncheck_rtl_' + theme_name[x]);
        });
        it('check all items in RTL mode', function () {
            helper.clickByXPath("//*[@id='list_check']");
            helper.waitUntilPresent(helper.list_ClassName, 4000);
            browser.compareScreen(element(helper.checked_List), 'list_check_rtl_' + theme_name[x]);
        });
    }

});

describe('Grouping with Checkbox - Theme', function () {

    for (var x = 0; x < 3; x++) {
        group_theme_change(x);
    }
    function group_theme_change(x: any) {
        let theme = ['material', 'fabric', 'bootstrap'];
        it('check all items', function () {
            helper.loadAndWait('/demos/listview/grouping-checkbox/index.html', helper.group_Checkbox);
            helper.clickByXPath("//*[@value='" + x + "']");
            helper.waitUntilPresent(helper.list_ClassName);
            helper.clickByXPath("//*[@id='group_check']");
            helper.waitUntilPresent(helper.checked_ClassName, 4000);
            browser.compareScreen(element(helper.group_Checkbox), 'grouplist_check_' + theme[x]);
        });
        it('uncheck all items', function () {
            helper.waitUntilPresent(helper.group_Checkbox);
            helper.clickByXPath("//*[@id='group_uncheck']");
            helper.waitUntilPresent(helper.list_ClassName, 4000);
            browser.compareScreen(element(helper.group_Checkbox), 'grouplist_uncheck_' + theme[x]);
        });
        it('uncheck all items in RTL mode', function () {
            helper.clickByXPath("//*[@id='rtl']");
            helper.waitUntilPresent(helper.list_ClassName, 4000);
            browser.compareScreen(element(helper.group_Checkbox), 'grouplist_uncheck_rtl_' + theme[x]);
        });
        it('check all items in RTL mode', function () {
            helper.clickByXPath("//*[@id='group_check']");
            helper.waitUntilPresent(helper.list_ClassName, 4000);
            browser.compareScreen(element(helper.group_Checkbox), 'grouplist_check_rtl_' + theme[x]);
        });
    }

});
describe('Nested List with Checkbox - Theme', function () {

    for (var x = 0; x < 3; x++) {
        nested_theme_change(x);
    }
    function nested_theme_change(x: any) {
        let theme = ['material', 'fabric', 'bootstrap'];
        it('check all items', function () {
            helper.loadAndWait('/demos/listview/nested-checkbox/index.html', helper.nested_Checkbox);
            helper.clickByXPath("//*[@value='" + x + "']");
            helper.waitUntilPresent(helper.list_ClassName, 4000);
            helper.clickByXPath("//*[@id='nested_check']");
            helper.waitUntilPresent(helper.checked_ClassName, 4000);
            browser.compareScreen(element(helper.nested_Checkbox), 'nestedlist_check_' + theme[x]);
        });
        it('uncheck all items', function () {
            helper.waitUntilPresent(helper.nested_Checkbox);
            helper.clickByXPath("//*[@id='nested_uncheck']");
            helper.waitUntilPresent(helper.list_ClassName, 4000);
            browser.compareScreen(element(helper.nested_Checkbox), 'nestedlist_uncheck_' + theme[x]);
        });
        it('uncheck all items in RTL mode', function () {
            helper.clickByXPath("//*[@id='rtl']");
            helper.waitUntilPresent(helper.list_ClassName, 4000);
            browser.compareScreen(element(helper.nested_Checkbox), 'nestedlist_uncheck_rtl_' + theme[x]);
        });
        it('check all items in RTL mode', function () {
            helper.clickByXPath("//*[@id='nested_check']");
            helper.waitUntilPresent(helper.list_ClassName, 4000);
            browser.compareScreen(element(helper.nested_Checkbox), 'nestedlist_check_rtl_' + theme[x]);
        });
    }

});

describe('Header Template', function () {

    it('Image with text', function () {
        helper.loadAndWait('/demos/listview/headerTemplate/index.html', helper.header_template);
        browser.compareScreen(element(helper.header_template), 'header_template_list');
    });

});

describe('Virtualization', function () {

    it('Before scroll', function () {
        helper.loadAndWait('/demos/listview/virtualization/index.html', helper.virtual_list);
        browser.compareScreen(element(helper.virtual_list), 'virtual_list');
    });
    it('After scroll', function () {
        helper.clickByXPath("//*[@id='list_scroll']");
        helper.waitUntilPresent(helper.list_ClassName, 4000);
        browser.compareScreen(element(helper.virtual_list), 'virtual_scroll_list');
    });

});