import { L10n, EventHandler, closest, isNullOrUndefined, getComponent, createElement, detach } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import {
    DropDownButton, MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs,
    ItemModel as DropDownItemModel
} from '@syncfusion/ej2-splitbuttons';
import { Menu, MenuItemModel, ItemModel } from '@syncfusion/ej2-navigations';
import { ChartTheme, ChartType } from '../common/enum';
import { ChartModel } from '../base/chart';
import { defaultChartRibbonLocale } from '../common/constant';
import { RibbonAction } from '../common/interface';

/**
 * Interface for callbacks triggered from Chart Ribbon UI interactions.
 */
export interface IChartRibbonActions {
    onSwitchRowColumn?: () => void;
    onThemeSelect?: (theme: ChartTheme) => void;
    onChartTypeSelect?: (type: string, isChart: boolean, eleId?: string) => void;
    onAddChartElement?: (elementId: string, value?: string) => void;
    onSelectionComplete?: (event: MouseEvent) => void;
}

/**
 * Provides Chart Ribbon UI creation, visual palette menus, and synchronization
 * for both Tab/Toolbar (Spreadsheet) and EJ2 Ribbon (Doc/PPT) consumers.
 */
export class ChartRibbon {
    private chartManager: Object;
    private hostInstance: Object;
    public isRibbon: boolean = false;
    private l10n: L10n;
    private createElementFn: Function;
    private enableRtl: boolean = false;
    private actions: IChartRibbonActions;
    private activeChartId: string = null;

    // References to created controls
    private addChartDdb: DropDownButton;
    private chartThemeDDB: DropDownButton;
    private chartBtnDdb: DropDownButton;
    private chartTypeDdb: DropDownButton;
    private boundMenuIconKeyDown: (e: KeyboardEvent) => void;

    public static readonly THEMES: ChartTheme[] = [
        'Material', 'Fabric', 'Bootstrap', 'HighContrastLight', 'MaterialDark', 'FabricDark', 'HighContrast',
        'BootstrapDark', 'Bootstrap4', 'Bootstrap5Dark', 'Bootstrap5', 'TailwindDark', 'Tailwind', 'Tailwind3', 'Tailwind3Dark',
        'FluentDark', 'Fluent', 'Fluent2', 'Fluent2Dark', 'Material3', 'Material3Dark'
    ];

    /* =========================================================================
     * SECTION 1: CONSTRUCTOR & HOST INSTANCE MANAGEMENT
     * ========================================================================= */

    /**
     * Initializes a new instance of the ChartRibbon class.
     *
     * @param {Object} chartManager - The chart manager instance.
     * @param {Object} [hostInstance] - Host component instance (Spreadsheet or DocumentEditor).
     * @param {boolean} [isRibbon=false] - True for EJ2 Ribbon, false for Spreadsheet Tab/Toolbar. Defaults to false.
     * @param {Function} [createElementFn] - Function to create DOM elements.
     * @param {boolean} [enableRtl] - Enables RTL mode.
     * @param {IChartRibbonActions} [actions] - Action callbacks for ribbon events.
     */
    constructor(
        chartManager: Object,
        hostInstance?: Object,
        isRibbon: boolean = false,
        createElementFn?: Function,
        enableRtl: boolean = false,
        actions?: IChartRibbonActions
    ) {
        this.chartManager = chartManager;
        this.hostInstance = hostInstance;
        this.isRibbon = isRibbon;
        this.createElementFn = createElementFn || createElement;
        this.enableRtl = enableRtl;
        this.actions = actions || {};
        this.initL10n();
        if (this.chartManager && (this.chartManager as { attachRibbon?: (ribbon: Object) => void }).attachRibbon) {
            (this.chartManager as { attachRibbon: (ribbon: Object) => void }).attachRibbon(this);
        }
    }

    /**
     * Initializes the internal L10n instance based on host.getModuleName() and host.locale.
     *
     * @returns {void}
     */
    private initL10n(): void {
        const host: { getModuleName?: () => string; locale?: string } =
            this.hostInstance as { getModuleName?: () => string; locale?: string };
        const moduleName: string = (host && host.getModuleName)
            ? host.getModuleName().toLowerCase()
            : 'chartribbon';
        const locale: string = (host && host.locale) ? host.locale : 'en-US';
        this.l10n = new L10n(moduleName, defaultChartRibbonLocale, locale);
    }

    /**
     * Resolves localized text using method parameter, host L10n, or default chart constants.
     *
     * @param {string} key - The localization key.
     * @param {L10n} [passedL10n] - Optional explicitly passed L10n instance.
     * @returns {string} The resolved localized string.
     */
    public getLocaleText(key: string, passedL10n?: L10n): string {
        const l10nObj: L10n = passedL10n || this.l10n;
        if (l10nObj && l10nObj.getConstant) {
            const val: string = l10nObj.getConstant(key);
            if (val) {
                return val;
            }
        }
        // eslint-disable-next-line security/detect-object-injection
        return defaultChartRibbonLocale[key] || key;
    }

    /**
     * Gets the associated ChartManager instance.
     *
     * @returns {Object} The chart manager instance.
     */
    public getChartManager(): Object {
        return this.chartManager;
    }

    /**
     * Gets the host instance.
     *
     * @returns {Object} The host component instance.
     */
    public getHostInstance(): Object {
        return this.hostInstance;
    }

    /**
     * Sets the ribbon action callbacks.
     *
     * @param {IChartRibbonActions} actions - The action callbacks.
     * @returns {void}
     */
    public setActions(actions: IChartRibbonActions): void {
        this.actions = actions;
    }

    /**
     * Sets the host instance and optionally updates the isRibbon mode.
     *
     * @param {Object} host - The host component instance.
     * @param {boolean} [isRibbon] - Optional new host mode.
     * @returns {void}
     */
    public setHostInstance(host: Object, isRibbon?: boolean): void {
        this.hostInstance = host;
        if (!isNullOrUndefined(isRibbon)) {
            this.isRibbon = isRibbon;
        }
        this.initL10n();
    }

    /* =========================================================================
     * SECTION 2: PUBLIC UNIFIED APIS (INSERT ITEM & CONTEXTUAL DESIGN TAB)
     * ========================================================================= */

    /**
     * Unified API to get the Chart item for Insert Tab/Group.
     * Automatically adapts based on isRibbon (Tab item for Spreadsheet or Template item for EJ2 Ribbon).
     *
     * @param {string} id - Base ID prefix.
     * @param {boolean} isChart - True for inserting chart, false for changing type.
     * @param {L10n} [l10n] - Localization instance.
     * @returns {Object} Toolbar item model for Tab or Template item model for EJ2 Ribbon.
     */
    public getChartItem(id: string, isChart: boolean, l10n?: L10n): Object {
        const chartText: string = this.getLocaleText('Chart', l10n);
        const typeText: string = this.getLocaleText('ChartType', l10n);
        const itemText: string = isChart ? chartText : typeText;
        if (this.isRibbon) {
            const containerId: string = id + (isChart ? '_chart_menu_container' : '_chart_type_menu_container');
            const menuId: string = id + (isChart ? '_chart_menu' : '_chart_type_menu');
            if (typeof document !== 'undefined' && document.body && !document.getElementById(containerId)) {
                const container: HTMLElement = this.createElementFn('div', { id: containerId }) as HTMLElement;
                const ul: HTMLElement = this.createElementFn('ul', { id: menuId }) as HTMLElement;
                container.appendChild(ul);
                document.body.appendChild(container);
                this.createChartMenu(ul, isChart ? 'e-chart-menu' : 'e-chart-type-menu', l10n);
            }
            const ddbElement: Element = this.getChartDDB(id, isChart, l10n);
            return {
                id: id + (isChart ? '_chart' : '_chart_type'),
                type: 'Template',
                displayOptions: 7,
                allowedSizes: 7,
                itemTemplate: ddbElement,
                template: ddbElement,
                dropDownSettings: {
                    iconCss: 'e-icons ' + (isChart ? 'e-chart-icon' : 'e-chart-type-icon'),
                    content: itemText,
                    target: '#' + containerId
                }
            };
        }
        const ddbElement: Element = this.getChartDDB(id, isChart, l10n);
        return {
            template: ddbElement,
            text: itemText,
            tooltipText: itemText,
            id: id + (isChart ? '_chart' : '_chart_type')
        };
    }

    /**
     * Unified API to get the Contextual Chart Design Tab.
     * Automatically adapts based on the configured hostType ('Tab' or 'Ribbon').
     *
     * @param {string} id - Base ID prefix.
     * @param {L10n} l10n - Localization instance.
     * @param {Function} [focusCallback] - Optional focus callback on Add Chart Element close.
     * @returns {Object} RibbonItemModel for Tab or RibbonTabModel for EJ2 Ribbon.
     */
    public getChartDesignTab(id: string, l10n?: L10n, focusCallback?: Function): Object {
        if (this.isRibbon) {
            return this.getContextualTabModel(id, l10n);
        }
        return this.getChartDesignTabItem(id, l10n, focusCallback);
    }

    /**
     * Unified API to show the Chart Design Tab on chart selection.
     *
     * @param {string} [tabId] - Tab identifier or header name.
     * @param {boolean} [select=true] - Whether to select the tab immediately.
     * @returns {void}
     */
    public showChartDesignTab(tabId?: string, select: boolean = true): void {
        if (!this.hostInstance) {
            return;
        }
        const host: {
            element?: HTMLElement;
            showTab?: (tabId: string, isShow: boolean) => void;
            selectTab?: (tabId: string) => void;
            addRibbonTabs?: (args: { items: Object[] }) => void;
            serviceLocator?: { getService: (service: string) => L10n };
        } = this.hostInstance as {
            element?: HTMLElement;
            showTab?: (tabId: string, isShow: boolean) => void;
            selectTab?: (tabId: string) => void;
            addRibbonTabs?: (args: { items: Object[] }) => void;
            serviceLocator?: { getService: (service: string) => L10n };
        };
        if (this.isRibbon) {
            const targetId: string = tabId || (host.element ? host.element.id + '_chart_design_tab' : '_chart_design_tab');
            if (host.showTab) {
                host.showTab(targetId, true);
            }
            if (select && host.selectTab) {
                host.selectTab(targetId);
            }
        } else {
            // Tab / Toolbar host (Spreadsheet)
            if (host.addRibbonTabs) {
                const id: string = host.element ? host.element.id : '';
                const l10n: L10n = host.serviceLocator ? host.serviceLocator.getService('locale') : null;
                const tabItem: Object = this.getChartDesignTabItem(id, l10n);
                host.addRibbonTabs({ items: [tabItem] });
            }
        }
    }

    /**
     * Unified API to get dynamic chart ribbon configuration and models.
     * Returns structured options model for EJ2 Ribbon or Tab host.
     *
     * @param {string} id - Base ID prefix.
     * @param {L10n} [l10n] - Localization instance.
     * @returns {Object} Structured model containing insert item, contextual tab, and options.
     */
    public getChartRibbonOptions(id: string, l10n?: L10n): {
        insertItem: Object;
        insertGroup: Object;
        contextualTab: Object;
        designItems: Object[];
        isRibbon: boolean;
        chartTypes: string[];
        themes: ChartTheme[];
    } {
        return {
            insertItem: this.getChartItem(id, true, l10n),
            insertGroup: this.getChartRibbonGroup(id, l10n),
            contextualTab: this.getChartDesignTab(id, l10n),
            designItems: this.getChartDesignItems(id, l10n),
            isRibbon: this.isRibbon,
            chartTypes: [
                'clusteredColumn', 'stackedColumn', 'stackedColumn100',
                'clusteredBar', 'stackedBar', 'stackedBar100',
                'area', 'stackedArea', 'stackedArea100',
                'line', 'lineMarker', 'stackedLine', 'stackedLineMarker', 'stackedLine100', 'stackedLine100Marker',
                'pie', 'doughnut',
                'scatter'
            ],
            themes: ChartRibbon.THEMES
        };
    }

    /**
     * Unified API to hide the Chart Design Tab on chart deselect.
     *
     * @param {string} [tabId] - Tab identifier or header name.
     * @returns {void}
     */
    public hideChartDesignTab(tabId?: string): void {
        if (!this.hostInstance) {
            return;
        }
        const host: {
            element?: HTMLElement;
            hideTab?: (tabId: string, isHide: boolean) => void;
            hideRibbonTabs?: (headers: string[], isHide: boolean) => void;
            serviceLocator?: { getService: (service: string) => L10n };
        } = this.hostInstance as {
            element?: HTMLElement;
            hideTab?: (tabId: string, isHide: boolean) => void;
            hideRibbonTabs?: (headers: string[], isHide: boolean) => void;
            serviceLocator?: { getService: (service: string) => L10n };
        };
        if (this.isRibbon) {
            const targetId: string = tabId || (host.element ? host.element.id + '_chart_design_tab' : '_chart_design_tab');
            if (host.hideTab) {
                host.hideTab(targetId, true);
            }
        } else {
            if (host.hideRibbonTabs) {
                const l10n: L10n = host.serviceLocator ? host.serviceLocator.getService('locale') : null;
                const constVal: string = this.getLocaleText('ChartDesign', l10n);
                const headerText: string = constVal !== '' ? constVal : 'Chart Design';
                host.hideRibbonTabs([headerText], true);
            }
            this.removeDesignTabElements();
        }
    }

    /**
     * Unified API to update ribbon options based on selected chart type
     * (e.g., disables Switch Row/Column for circular charts like Pie and Doughnut).
     *
     * @param {ChartType | string | ChartModel} chartTypeOrModel - Selected chart type or model.
     * @param {HTMLElement} [hostElement] - Optional root container element.
     * @returns {void}
     */
    public updateChartRibbon(chartTypeOrModel: ChartType | string | ChartModel, hostElement?: HTMLElement): void {
        this.updateRibbonOptions(chartTypeOrModel, hostElement);
    }

    /**
     * Unified API to refresh the active chart theme selection across both Tab and Ribbon hosts.
     *
     * @param {ChartTheme} theme - The newly selected theme.
     * @param {L10n} [l10n] - Localization instance.
     * @param {HTMLElement} [rootContainer] - Optional root container element.
     * @returns {void}
     */
    public refreshTheme(theme: ChartTheme, l10n?: L10n, rootContainer?: HTMLElement): void {
        this.refreshThemeSelection(theme, l10n, rootContainer);
    }

    /* =========================================================================
     * SECTION 3: INSERT TAB BUILDERS (CHART BUTTON, GROUP & VISUAL PALETTE MENU)
     * ========================================================================= */

    /**
     * Builds the Ribbon Group Model for EJ2 Ribbon Insert Tab.
     *
     * @param {string} id - The base ID prefix.
     * @param {L10n} [l10n] - The localization instance.
     * @returns {Object} The ribbon group model.
     */
    public getChartRibbonGroup(id: string, l10n?: L10n): Object {
        const chartText: string = this.getLocaleText('Chart', l10n);
        const chartItem: { id?: string; type?: string; itemTemplate?: Element } =
            this.getChartItem(id, true, l10n) as { id?: string; type?: string; itemTemplate?: Element };
        return {
            id: id + '_chart_group',
            header: chartText,
            groupIconCss: 'e-icons e-chart-icon',
            enableGroupOverflow: true,
            collections: [
                {
                    items: [
                        {
                            id: id + '_chart_item',
                            type: 'Template',
                            itemTemplate: chartItem.itemTemplate || (chartItem as { template?: Element }).template,
                            displayOptions: 7,
                            allowedSizes: 7
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Builds the Chart Type DropDownButton element with 2D/3D visual palette.
     *
     * @param {string} id - Base ID prefix.
     * @param {boolean} isChart - True for inserting chart, false for changing type.
     * @param {L10n} [l10n] - Localization instance.
     * @returns {Element} The created button element.
     */
    public getChartDDB(id: string, isChart: boolean, l10n?: L10n): Element {
        let chartBtn: HTMLElement;
        const chartText: string = this.getLocaleText('Chart', l10n);
        const typeText: string = this.getLocaleText('ChartType', l10n);
        if (isChart) {
            chartBtn = this.createElementFn('button', { id: id + '_chart-btn', attrs: { 'type': 'button' } });
            const chartBtnSpan: HTMLElement = this.createElementFn('span', { id: id + '_chart' });
            chartBtnSpan.innerText = chartText;
            chartBtn.appendChild(chartBtnSpan);
            this.createChartDdb(chartBtn, true, l10n);
        } else {
            chartBtn = this.createElementFn('button', { id: id + '_chart-type-btn', attrs: { 'type': 'button' } });
            const chartBtnSpan: HTMLElement = this.createElementFn('span', { id: id + '_chart_type' });
            chartBtnSpan.innerText = typeText;
            chartBtn.appendChild(chartBtnSpan);
            this.createChartDdb(chartBtn, false, l10n);
        }
        return chartBtn;
    }

    /**
     * Creates and attaches the DropDownButton containing the full visual chart palette.
     *
     * @param {HTMLElement} chartBtn - The button element to attach the DropDownButton to.
     * @param {boolean} isChart - True for inserting chart, false for changing chart type.
     * @param {L10n} l10n - The localization instance.
     * @returns {DropDownButton} The created DropDownButton instance.
     */
    public createChartDdb(chartBtn: HTMLElement, isChart: boolean, l10n: L10n): DropDownButton {
        const menuClass: string = isChart ? 'e-chart-menu' : 'e-chart-type-menu';
        const host: { element?: HTMLElement } = this.hostInstance as { element?: HTMLElement };
        const idPrefix: string = (host && host.element)
            ? host.element.id
            : (chartBtn.id.includes('_') ? chartBtn.id.substring(0, chartBtn.id.lastIndexOf('_')) : chartBtn.id);
        const ul: HTMLElement = this.createElementFn(
            'ul', { id: `${idPrefix}${isChart ? '_chart_menu' : '_chart_type_menu'}` });
        let chartMenu: Menu;
        const chartDdb: DropDownButton = new DropDownButton({
            iconCss: `e-icons ${isChart ? 'e-chart-icon' : 'e-chart-type-icon'}`,
            cssClass: isChart ? 'e-chart-ddb' : 'e-chart-type-ddb',
            target: ul,
            createPopupOnClick: true,
            enableRtl: this.enableRtl,
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                chartMenu = this.createChartMenu(ul, menuClass, l10n, chartDdb);
                this.tBarDdbBeforeOpen(args.element, chartMenu.items, this.getLocaleText('Chart', l10n));
                EventHandler.add(ul, 'keydown', this.closeDropdownPopup, [this, chartDdb]);
            },
            open: (args: OpenCloseMenuEventArgs): void => {
                this.openHandler(args.element, ul);
            },
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.event && closest(args.event.target as Element, '.' + menuClass)) {
                    args.cancel = true;
                } else {
                    EventHandler.remove(ul, 'keydown', this.closeDropdownPopup);
                    if (chartMenu) { chartMenu.destroy(); }
                }
            }
        });
        chartDdb.createElement = this.createElementFn as (tag: string, prop?: Object) => HTMLElement;
        chartDdb.appendTo(chartBtn);
        if (isChart) {
            this.chartBtnDdb = chartDdb;
        } else {
            this.chartTypeDdb = chartDdb;
        }
        return chartDdb;
    }

    /**
     * Creates the nested visual Menu with Column, Bar, Area, Pie/Doughnut, Line, Scatter icon groups.
     *
     * @param {HTMLElement} ul - The unordered list element to host the menu.
     * @param {string} cssClass - The CSS class to apply to the menu.
     * @param {L10n} [l10n] - The localization instance.
     * @param {DropDownButton} chartDdb - The parent DropDownButton instance.
     * @returns {Menu} The created Menu component instance.
     */
    public createChartMenu(ul: HTMLElement, cssClass: string, l10n?: L10n, chartDdb?: DropDownButton): Menu {
        const getConst: (key: string) => string = (key: string): string => this.getLocaleText(key, l10n);
        const column: HTMLElement = this.createElementFn('div', { id: 'column_main', className: 'e-column-main' });
        const column1Text: HTMLElement = this.createElementFn('div', { id: 'column1_text', className: 'e-column1-text' });
        column1Text.innerText = getConst('Column');
        const column1Cont: HTMLElement = this.createElementFn('div', { id: 'column1_cont', className: 'e-column1-cont' });
        column.appendChild(column1Text);
        column.appendChild(column1Cont);
        let cultureText: string = getConst('ClusteredColumn');
        const clusteredColumn: HTMLElement = this.createElementFn('span', {
            id: 'clusteredColumn', className: 'e-clusteredcolumn e-column-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        cultureText = getConst('StackedColumn');
        const stackedColumn: HTMLElement = this.createElementFn('span', {
            id: 'stackedColumn', className: 'e-stackedcolumn e-column-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        cultureText = getConst('StackedColumn100');
        const stackedColumn100: HTMLElement = this.createElementFn('span', {
            id: 'stackedColumn100', className: 'e-stackedcolumn100 e-column-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        column1Cont.appendChild(clusteredColumn);
        column1Cont.appendChild(stackedColumn);
        column1Cont.appendChild(stackedColumn100);
        const bar: HTMLElement = this.createElementFn('div', { id: 'bar_main', className: 'e-bar-main' });
        const bar1Text: HTMLElement = this.createElementFn('div', { id: 'bar1_text', className: 'e-bar1-text' });
        bar1Text.innerText = getConst('Bar');
        const bar1Cont: HTMLElement = this.createElementFn('div', { id: 'bar1_cont', className: 'e-bar1-cont' });
        bar.appendChild(bar1Text);
        bar.appendChild(bar1Cont);
        cultureText = getConst('ClusteredBar');
        const clusteredBar: HTMLElement = this.createElementFn('span', {
            id: 'clusteredBar', className: 'e-clusteredbar e-bar-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        cultureText = getConst('StackedBar');
        const stackedBar: HTMLElement = this.createElementFn('span', {
            id: 'stackedBar', className: 'e-stackedbar e-bar-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        cultureText = getConst('StackedBar100');
        const stackedBar100: HTMLElement = this.createElementFn('span', {
            id: 'stackedBar100', className: 'e-stackedbar100 e-bar-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        bar1Cont.appendChild(clusteredBar);
        bar1Cont.appendChild(stackedBar);
        bar1Cont.appendChild(stackedBar100);
        const area: HTMLElement = this.createElementFn('div', { id: 'area_main', className: 'e-area-main' });
        const areaText: HTMLElement = this.createElementFn('div', { id: 'area_text', className: 'e-area-text' });
        areaText.innerText = getConst('Area');
        const areaCont: HTMLElement = this.createElementFn('div', { id: 'area_cont', className: 'e-area-cont' });
        area.appendChild(areaText);
        area.appendChild(areaCont);
        cultureText = getConst('Area');
        const defArea: HTMLElement = this.createElementFn('span', {
            id: 'area', className: 'e-area e-area-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        cultureText = getConst('StackedArea');
        const stackedArea: HTMLElement = this.createElementFn('span', {
            id: 'stackedArea', className: 'e-stackedarea e-area-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        cultureText = getConst('StackedArea100');
        const stackedArea100: HTMLElement = this.createElementFn('span', {
            id: 'stackedArea100', className: 'e-stackedarea100 e-area-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        areaCont.appendChild(defArea);
        areaCont.appendChild(stackedArea);
        areaCont.appendChild(stackedArea100);
        const line: HTMLElement = this.createElementFn('div', { id: 'line_main', className: 'e-line-main' });
        const lineText: HTMLElement = this.createElementFn('div', { id: 'line_text', className: 'e-line-text' });
        lineText.innerText = getConst('Line');
        const lineCont: HTMLElement = this.createElementFn('div', { id: 'line_cont', className: 'e-line-cont' });
        const lineContMarker: HTMLElement = this.createElementFn('div', { id: 'line_cont_marker', className: 'e-line-cont' });
        line.appendChild(lineText);
        line.appendChild(lineCont);
        line.appendChild(lineContMarker);
        cultureText = getConst('Line');
        const defLine: HTMLElement = this.createElementFn('span', {
            id: 'line', className: 'e-line e-line-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        cultureText = getConst('StackedLine');
        const stackedLine: HTMLElement = this.createElementFn('span', {
            id: 'stackedLine', className: 'e-stackedline e-line-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        cultureText = getConst('StackedLine100');
        const stackedLine100: HTMLElement = this.createElementFn('span', {
            id: 'stackedLine100', className: 'e-stackedline100 e-line-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        cultureText = getConst('LineMarker');
        const defLineMarker: HTMLElement = this.createElementFn('span', {
            id: 'lineMarker', className: 'e-line-marker e-line-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        cultureText = getConst('StackedLineMarker');
        const stackedLineMarker: HTMLElement = this.createElementFn('span', {
            id: 'stackedLineMarker', className: 'e-stackedline-marker e-line-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        cultureText = getConst('StackedLine100Marker');
        const stackedLine100Marker: HTMLElement = this.createElementFn('span', {
            id: 'stackedLine100Marker', className: 'e-stackedline100-marker e-line-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        lineCont.appendChild(defLine);
        lineCont.appendChild(stackedLine);
        lineCont.appendChild(stackedLine100);
        lineContMarker.appendChild(defLineMarker);
        lineContMarker.appendChild(stackedLineMarker);
        lineContMarker.appendChild(stackedLine100Marker);
        const pie: HTMLElement = this.createElementFn('div', { id: 'pie_main', className: 'e-pie-main' });
        const pieText: HTMLElement = this.createElementFn('div', { id: 'pie_text', className: 'e-pie-text' });
        pieText.innerText = getConst('Pie');
        const pieCont: HTMLElement = this.createElementFn('div', { id: 'pie_cont', className: 'e-pie-cont' });
        pie.appendChild(pieText);
        pie.appendChild(pieCont);
        cultureText = getConst('Pie');
        const defPie: HTMLElement = this.createElementFn('span', {
            id: 'pie', className: 'e-pie e-pie-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        cultureText = getConst('Doughnut');
        const doughnut: HTMLElement = this.createElementFn('span', {
            id: 'doughnut', className: 'e-doughnut e-pie-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        pieCont.appendChild(defPie);
        pieCont.appendChild(doughnut);
        const scatter: HTMLElement = this.createElementFn('div', { id: 'scatter_main', className: 'e-scatter-main' });
        const scatterText: HTMLElement = this.createElementFn('div', { id: 'scatter_text', className: 'e-scatter-text' });
        cultureText = getConst('Scatter');
        scatterText.innerText = cultureText;
        const scatterCont: HTMLElement = this.createElementFn('div', { id: 'scatter_cont', className: 'e-scatter-cont' });
        scatter.appendChild(scatterText);
        scatter.appendChild(scatterCont);
        const defscatter: HTMLElement = this.createElementFn('span', {
            id: 'scatter', className: 'e-scatter e-scatter-icon e-menu-icon e-icons',
            attrs: { title: cultureText, 'aria-label': cultureText, tabindex: '-1' }
        });
        scatterCont.appendChild(defscatter);
        const chartMenu: Menu = new Menu({
            cssClass: cssClass,
            enableRtl: this.enableRtl,
            items: [
                { iconCss: 'e-icons e-column', text: getConst('Column'), items: [{ id: 'column_chart' }] },
                { iconCss: 'e-icons e-bar', text: getConst('Bar'), items: [{ id: 'bar_chart' }] },
                { iconCss: 'e-icons e-area', text: getConst('Area'), items: [{ id: 'area_chart' }] },
                { iconCss: 'e-icons e-pie-doughnut', text: getConst('PieAndDoughnut'), items: [{ id: 'pie_doughnut_chart' }] },
                { iconCss: 'e-icons e-line', text: getConst('Line'), items: [{ id: 'line_chart' }] },
                { iconCss: 'e-icons e-scatter', text: getConst('Scatter'), items: [{ id: 'scatter_chart' }] }
            ],
            orientation: 'Vertical',
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                let wrapperCls: string = '';
                const parentItem: MenuItemModel = (args as { parentItem?: MenuItemModel }).parentItem;
                if (!parentItem) {
                    return;
                }
                if (parentItem.text === getConst('Column')) {
                    args.element.firstChild.appendChild(column);
                    wrapperCls = 'e-column-chart';
                } else if (parentItem.text === getConst('Bar')) {
                    args.element.firstChild.appendChild(bar);
                    wrapperCls = 'e-bar-chart';
                } else if (parentItem.text === getConst('Area')) {
                    args.element.firstChild.appendChild(area);
                    wrapperCls = 'e-area-chart';
                } else if (parentItem.text === getConst('Line')) {
                    args.element.firstChild.appendChild(line);
                    wrapperCls = 'e-line-chart';
                } else if (parentItem.text === getConst('PieAndDoughnut')) {
                    args.element.firstChild.appendChild(pie);
                    wrapperCls = 'e-pie-doughnut-chart';
                } else if (parentItem.text === getConst('Scatter')) {
                    args.element.firstChild.appendChild(scatter);
                    wrapperCls = 'e-scatter-chart';
                }
                if (wrapperCls) {
                    args.element.parentElement.classList.add(wrapperCls);
                    this.boundMenuIconKeyDown = this.menuIconKeyDown.bind(this, `${wrapperCls} .e-menu-icon`, 0);
                    EventHandler.add(args.element, 'keydown', this.boundMenuIconKeyDown);
                }
            },
            select: (args: MenuEventArgs): void => {
                const isChart: boolean = !isNullOrUndefined(closest(args.element, '.e-chart-menu'));
                const eleId: string = args.element.id;
                if (('column_chart' + 'bar_chart' + 'area_chart' + 'pie_doughnut_chart' +
                    'line_chart' + 'radar_chart' + 'scatter_chart').includes(eleId)) {
                    if (args.item && (!(args.item as MenuItemModel).items || !(args.item as MenuItemModel).items.length) && chartDdb) {
                        chartDdb.toggle();
                    }
                    const target: HTMLElement = args.event.target as HTMLElement;
                    const iconEl: HTMLElement = target.classList.contains('e-menu-icon')
                        ? target : target.querySelector('.e-menu-icon') as HTMLElement;
                    const targetId: string = iconEl ? iconEl.id : (target.id || (eleId === 'scatter_chart' ? 'scatter' : ''));
                    if (this.actions.onChartTypeSelect) {
                        this.actions.onChartTypeSelect(targetId, isChart, eleId);
                    } else if (this.chartManager && !isChart) {
                        const mgr: { onRibbonAction?: (actionId: string, val?: string | number | boolean) => boolean } =
                            this.chartManager as {
                                onRibbonAction?: (actionId: string, val?: string | number | boolean) => boolean;
                            };
                        if (mgr.onRibbonAction) {
                            mgr.onRibbonAction('chartType', targetId);
                        }
                    }
                }
            },
            beforeItemRender: (args: MenuEventArgs): void => {
                if (!args.item.text) {
                    args.element.removeAttribute('tabindex');
                }
            },
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.event && (args.event as KeyboardEvent).keyCode === 37) {
                    args.cancel = true;
                } else if (this.boundMenuIconKeyDown && args.element) {
                    EventHandler.remove(args.element, 'keydown', this.boundMenuIconKeyDown);
                }
            }
        });
        if (this.createElementFn) {
            chartMenu.createElement = this.createElementFn as (tag: string, prop?: Object) => HTMLElement;
        }
        if (!ul.parentElement) {
            document.body.appendChild(ul);
        }
        chartMenu.appendTo(ul);
        ul.classList.add('e-ul');
        return chartMenu;
    }

    /* =========================================================================
     * SECTION 4: CONTEXTUAL DESIGN TAB COMPONENT BUILDERS
     * ========================================================================= */

    /**
     * Builds the Chart Design Tab item model for Spreadsheet Ribbon (Tab + Toolbar).
     *
     * @param {string} id - Base ID prefix.
     * @param {L10n} l10n - Localization instance.
     * @param {Function} [focusCallback] - Optional focus callback on Add Chart Element close.
     * @returns {Object} RibbonItemModel for Tab.
     */
    public getChartDesignTabItem(id: string, l10n?: L10n, focusCallback?: Function): Object {
        const headerText: string = this.getLocaleText('ChartDesign', l10n);
        return {
            header: { text: headerText },
            content: this.getChartDesignItems(id, l10n, focusCallback)
        };
    }

    /**
     * Unified API to retrieve the 4 core Chart Design items/groups.
     * Automatically adapts based on this.isRibbon:
     * - When isRibbon: true -> returns the 4 RibbonGroupModel objects (Chart Elements, Data, Chart Styles, Type).
     * - When isRibbon: false -> returns the toolbar items with separators for Spreadsheet.
     *
     * @param {string} [id] - The base ID prefix.
     * @param {L10n} [l10n] - The localization instance.
     * @param {Function} [focusCallback] - Optional focus callback on Add Chart Element close.
     * @returns {Object[]} The list of chart design items or groups.
     */
    public getChartDesignItems(id?: string, l10n?: L10n, focusCallback?: Function): Object[] {
        const idPrefix: string = id || '';
        if (this.isRibbon) {
            const contextualTab: { groups?: Object[] } = this.getContextualTabModel(idPrefix, l10n) as { groups?: Object[] };
            return contextualTab && contextualTab.groups ? contextualTab.groups : [];
        }
        const host: { element?: HTMLElement } = this.hostInstance as { element?: HTMLElement };
        const addChartText: string = this.getLocaleText('AddChartElement', l10n);
        const switchText: string = this.getLocaleText('SwitchRowColumn', l10n);
        const themeText: string = this.getLocaleText('ChartTheme', l10n);
        const typeText: string = this.getLocaleText('ChartType', l10n);
        return [
            {
                template: this.getAddChartEleDBB(idPrefix, l10n, focusCallback),
                tooltipText: addChartText,
                id: idPrefix + 'add_chart_ element_chart'
            },
            { type: 'Separator' },
            {
                prefixIcon: 'e-switch-row-column-icon',
                text: switchText,
                tooltipText: switchText,
                id: idPrefix + 'switch_row_column_chart',
                click: (): void => {
                    if (this.actions.onSwitchRowColumn) {
                        this.actions.onSwitchRowColumn();
                    } else if (this.chartManager) {
                        const mgr: { onRibbonAction?: (actionId: RibbonAction) => boolean } = this.chartManager as {
                            onRibbonAction?: (actionId: RibbonAction) => boolean;
                        };
                        if (mgr.onRibbonAction) {
                            mgr.onRibbonAction('switchRowColumn');
                        }
                    }
                }
            },
            { type: 'Separator' },
            {
                template: this.getChartThemeDDB(idPrefix, l10n, host ? host.element : undefined),
                tooltipText: themeText,
                id: idPrefix + '_chart_theme'
            },
            { type: 'Separator' },
            {
                template: this.getChartDDB(idPrefix, false, l10n),
                tooltipText: typeText,
                id: idPrefix + '_chart_type'
            }
        ];
    }

    /**
     * Static helper to retrieve toolbar item descriptors for Chart Design.
     *
     * @param {string} [id] - The base ID prefix.
     * @param {L10n} [l10n] - The localization instance.
     * @returns {Object[]} The list of chart design items.
     */
    public static getChartDesignItems(id?: string, l10n?: L10n): Object[] {
        const getConst: (key: string, fallback: string) => string = (key: string, fallback: string): string => {
            if (l10n && l10n.getConstant) {
                const val: string = l10n.getConstant(key);
                if (val) {
                    return val;
                }
            }
            // eslint-disable-next-line security/detect-object-injection
            return defaultChartRibbonLocale[key] || fallback;
        };
        const addChartText: string = getConst('AddChartElement', 'Add Chart Element');
        const switchText: string = getConst('SwitchRowColumn', 'Switch Row Column');
        const themeText: string = getConst('ChartTheme', 'Chart Theme');
        const typeText: string = getConst('ChartType', 'Chart Type');
        return [
            { id: (id || '') + 'add_chart_ element_chart', tooltipText: addChartText },
            { id: (id || '') + 'switch_row_column_chart', tooltipText: switchText },
            { id: (id || '') + '_chart_theme', tooltipText: themeText },
            { id: (id || '') + '_chart_type', tooltipText: typeText }
        ];
    }

    /**
     * Builds the Contextual Tab Model for EJ2 Ribbon consumers (such as Document Editor).
     *
     * @param {string} id - The base ID prefix.
     * @param {L10n} l10n - Localization service instance.
     * @returns {Object} The RibbonTabModel structure.
     */
    public getContextualTabModel(id: string, l10n?: L10n): Object {
        const getConst: (key: string, fallback: string) => string = (key: string, fallback: string): string => {
            return this.getLocaleText(key, l10n) || fallback;
        };
        // Auto-provision popup containers for Add Chart Element and Change Chart Type if not already in DOM
        if (typeof document !== 'undefined' && document.body) {
            const ensureContainer: (containerId: string, menuId: string, setupFn: (ul: HTMLElement) => void) => void =
                (containerId: string, menuId: string, setupFn: (ul: HTMLElement) => void): void => {
                    if (!document.getElementById(containerId)) {
                        const container: HTMLElement = this.createElementFn('div', { id: containerId }) as HTMLElement;
                        const ul: HTMLElement = this.createElementFn('ul', { id: menuId }) as HTMLElement;
                        container.appendChild(ul);
                        document.body.appendChild(container);
                        setupFn(ul);
                    }
                };
            ensureContainer(id + '_add_chart_menu_container', id + '_add_chart_menu', (ul: HTMLElement): void => {
                this.createAddChartMenu(ul, l10n);
            });
            ensureContainer(id + '_chart_type_menu_container', id + '_chart_type_menu', (ul: HTMLElement): void => {
                this.createChartMenu(ul, 'e-chart-type-menu', l10n);
            });
        }
        return {
            id: id + '_chart_design_tab',
            header: getConst('ChartDesign', 'Chart Design'),
            groups: [
                {
                    id: id + '_chart_elements_group',
                    header: getConst('ChartElements', 'Chart Elements'),
                    groupIconCss: 'e-icons e-addchart-icon',
                    collections: [
                        {
                            items: [
                                {
                                    type: 'DropDown',
                                    allowedSizes: 7,
                                    id: id + '_add_chart_element_item',
                                    displayOptions: 7,
                                    dropDownSettings: {
                                        iconCss: 'e-icons e-addchart-icon',
                                        content: getConst('AddChartElement', 'Add Chart Element'),
                                        target: '#' + id + '_add_chart_menu_container'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    id: id + '_chart_data_group',
                    header: getConst('Data', 'Data'),
                    groupIconCss: 'e-icons e-switch-row-column-icon',
                    collections: [
                        {
                            items: [
                                {
                                    type: 'Button',
                                    allowedSizes: 7,
                                    id: id + '_switch_row_column_item',
                                    displayOptions: 7,
                                    buttonSettings: {
                                        iconCss: 'e-icons e-switch-row-column-icon',
                                        content: getConst('SwitchRowColumn', 'Switch Row/Column'),
                                        clicked: (): void => {
                                            if (this.actions.onSwitchRowColumn) {
                                                this.actions.onSwitchRowColumn();
                                            } else if (this.chartManager) {
                                                const mgr: { onRibbonAction?: (a: RibbonAction, v?: string) => boolean } =
                                                    this.chartManager as { onRibbonAction?: (a: RibbonAction, v?: string) => boolean };
                                                if (mgr.onRibbonAction) {
                                                    mgr.onRibbonAction('switchRowColumn');
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    id: id + '_chart_styles_group',
                    header: getConst('ChartTheme', 'Chart Styles'),
                    groupIconCss: 'e-icons e-charttheme-icon',
                    collections: [
                        {
                            items: [
                                {
                                    type: 'DropDown',
                                    allowedSizes: 7,
                                    id: id + '_chart_theme_item',
                                    displayOptions: 7,
                                    dropDownSettings: {
                                        iconCss: 'e-icons e-charttheme-icon',
                                        content: getConst('ChartTheme', 'Chart Theme'),
                                        items: this.getChartThemeDdbItems('Material', l10n),
                                        beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                                            this.tBarDdbBeforeOpen(args.element, args.items, getConst('ChartTheme', 'Chart Theme'));
                                        },
                                        select: (args: MenuEventArgs): void => {
                                            if (!args || !args.item) { return; }
                                            if (this.actions.onThemeSelect) {
                                                this.actions.onThemeSelect(args.item.id as ChartTheme);
                                            } else if (this.chartManager) {
                                                const mgr: { onRibbonAction?: (a: RibbonAction, v?: string) => boolean } =
                                                    this.chartManager as { onRibbonAction?: (a: RibbonAction, v?: string) => boolean };
                                                if (mgr.onRibbonAction) {
                                                    mgr.onRibbonAction('theme', args.item.id);
                                                }
                                            }
                                        }
                                    },
                                    buttonSettings: {
                                        iconCss: 'e-icons e-charttheme-icon',
                                        content: getConst('ChartTheme', 'Chart Theme'),
                                        select: (args: MenuEventArgs): void => {
                                            if (!args || !args.item) { return; }
                                            if (this.actions.onThemeSelect) {
                                                this.actions.onThemeSelect(args.item.id as ChartTheme);
                                            } else if (this.chartManager) {
                                                const mgr: { onRibbonAction?: (a: RibbonAction, v?: string) => boolean } =
                                                    this.chartManager as { onRibbonAction?: (a: RibbonAction, v?: string) => boolean };
                                                if (mgr.onRibbonAction) {
                                                    mgr.onRibbonAction('theme', args.item.id);
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    id: id + '_chart_type_group',
                    header: getConst('Type', 'Type'),
                    groupIconCss: 'e-icons e-chart-type-icon',
                    collections: [
                        {
                            items: [
                                {
                                    type: 'DropDown',
                                    allowedSizes: 7,
                                    id: id + '_change_chart_type_item',
                                    displayOptions: 7,
                                    dropDownSettings: {
                                        iconCss: 'e-icons e-chart-type-icon',
                                        content: getConst('ChartType', 'Change Chart Type'),
                                        target: '#' + id + '_chart_type_menu_container'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Builds the Add Chart Element DropDownButton and its hierarchical popup menu.
     *
     * @param {string} id - The base ID prefix.
     * @param {L10n} l10n - The localization instance.
     * @param {Function} [focusCallback] - Optional callback to invoke when closing dropdown.
     * @returns {Element} The created DropDownButton element.
     */
    public getAddChartEleDBB(id: string, l10n: L10n, focusCallback?: Function): Element {
        const ul: HTMLElement = this.createElementFn('ul', { id: id + '_add_chart_menu' });
        let addChartMenu: Menu;
        this.addChartDdb = new DropDownButton({
            iconCss: 'e-icons e-addchart-icon',
            cssClass: 'e-addchart-ddb',
            target: ul,
            createPopupOnClick: true,
            enableRtl: this.enableRtl,
            close: (): void => {
                if (focusCallback) { focusCallback(); }
            },
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                addChartMenu = this.createAddChartMenu(ul, l10n);
                const chartLabel: string = this.getLocaleText('Chart', l10n);
                this.tBarDdbBeforeOpen(args.element, addChartMenu.items, chartLabel);
                EventHandler.add(ul, 'keydown', this.closeDropdownPopup, [this, this.addChartDdb]);
            },
            open: (args: OpenCloseMenuEventArgs): void => {
                this.openHandler(args.element, ul);
            },
            beforeClose: (args: BeforeOpenCloseMenuEventArgs): void => {
                if (args.event && closest(args.event.target as Element, '.e-addchart-menu')) {
                    args.cancel = true;
                } else {
                    EventHandler.remove(ul, 'keydown', this.closeDropdownPopup);
                    if (addChartMenu) { addChartMenu.destroy(); }
                }
            }
        });
        this.addChartDdb.createElement = this.createElementFn as (tag: string, prop?: Object) => HTMLElement;
        const addChartBtn: HTMLElement = this.createElementFn('button', { id: id + '_addchart', attrs: { 'type': 'button' } });
        const chartBtnText: HTMLElement = this.createElementFn('span', { id: id + '_chart' });
        const btnText: string = this.getLocaleText('AddChartElement', l10n);
        chartBtnText.innerText = btnText;
        addChartBtn.appendChild(chartBtnText);
        this.addChartDdb.appendTo(addChartBtn);
        return this.addChartDdb.element;
    }

    /**
     * Creates the nested Menu inside AddChartElement dropdown matching Spreadsheet verbatim.
     *
     * @param {HTMLElement} ul - The unordered list element to host the menu.
     * @param {L10n} l10n - The localization instance.
     * @param {HTMLElement} [rootContainer] - Optional root container to query active chart overlay.
     * @returns {Menu} The created Menu component instance.
     */
    public createAddChartMenu(ul: HTMLElement, l10n?: L10n, rootContainer?: HTMLElement): Menu {
        const getConst: (key: string) => string = (key: string): string => this.getLocaleText(key, l10n);
        let items: MenuItemModel[] = [];
        const root: HTMLElement = rootContainer || document.body;
        const overlayElem: HTMLElement = root.querySelector('.e-datavisualization-chart.e-ss-overlay-active') as HTMLElement;
        let isAccumulation: boolean = false;
        if (overlayElem) {
            const chartObj: HTMLElement = overlayElem.querySelector('.e-chart');
            if (!chartObj) {
                isAccumulation = true;
            }
        } else if (this.chartManager) {
            const activeId: string = (this.chartManager as { getActiveChart?: () => string }).getActiveChart
                ? (this.chartManager as { getActiveChart: () => string }).getActiveChart() : null;
            if (activeId) {
                const model: ChartModel = (this.chartManager as { getChartModel?: (id: string) => ChartModel }).getChartModel
                    ? (this.chartManager as { getChartModel: (id: string) => ChartModel }).getChartModel(activeId) : null;
                if (model && (model.type === 'Pie' || model.type === 'Doughnut')) {
                    isAccumulation = true;
                }
            }
        }
        items = this.getAddChartMenuItems(isAccumulation, l10n);
        const addChartMenu: Menu = new Menu({
            cssClass: 'e-addchart-menu',
            title: getConst('AddChartElement'),
            orientation: 'Vertical',
            enableRtl: this.enableRtl,
            select: (args: MenuEventArgs): void => {
                const eleId: string = args.element.id;
                if (isAccumulation && (eleId.startsWith('PH') || eleId.startsWith('PV') || eleId.startsWith('GL'))) {
                    return;
                }
                const opensTitleDialog: boolean = eleId === 'ChartTitleAbove' || eleId === 'AboveChart' ||
                    eleId === 'PHAxisTitle' || eleId === 'PVAxisTitle';
                if (opensTitleDialog) {
                    this.showTitleDialog(eleId);
                } else if (this.actions.onAddChartElement) {
                    this.actions.onAddChartElement(eleId);
                } else if (this.chartManager) {
                    const mgr: { onRibbonAction?: (actionId: RibbonAction) => boolean } = this.chartManager as {
                        onRibbonAction?: (actionId: RibbonAction) => boolean;
                    };
                    if (mgr.onRibbonAction) {
                        mgr.onRibbonAction(eleId as RibbonAction);
                    }
                }
                if (args.item && (!(args.item as MenuItemModel).items || !(args.item as MenuItemModel).items.length) && this.addChartDdb) {
                    this.addChartDdb.toggle();
                }
            },
            items: items,
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                const parentItem: MenuItemModel = (args as { parentItem?: MenuItemModel }).parentItem;
                if (!parentItem) {
                    const activeId: string = this.chartManager && (this.chartManager as { getActiveChart?: () => string }).getActiveChart
                        ? (this.chartManager as { getActiveChart: () => string }).getActiveChart() : null;
                    let activeType: string = '';
                    const mgrObj: { getChartModel?: (id: string) => ChartModel } = this.chartManager as {
                        getChartModel?: (id: string) => ChartModel;
                    };
                    if (activeId && this.chartManager && mgrObj.getChartModel) {
                        const model: ChartModel = mgrObj.getChartModel(activeId);
                        if (model && model.type) {
                            activeType = model.type;
                        }
                    }
                    const isAccNow: boolean = activeType === 'Pie' || activeType === 'Doughnut';
                    if (addChartMenu) {
                        addChartMenu.items = this.getAddChartMenuItems(isAccNow, l10n);
                    }
                }
                if (parentItem && parentItem.id && parentItem.id.includes('data-labels')) {
                    const overlay: HTMLElement = (rootContainer || document.body).querySelector('.e-ss-overlay-active');
                    if (overlay) {
                        const chart: HTMLElement = overlay.querySelector('.e-chart');
                        if (chart) {
                            const chartObj: { series?: { type: string }[] } = getComponent(chart, 'chart');
                            const isLineChart: boolean = !isNullOrUndefined(chartObj) &&
                                !isNullOrUndefined(chartObj.series) &&
                                chartObj.series[0] &&
                                chartObj.series[0].type &&
                                chartObj.series[0].type.includes('Line');
                            if (isLineChart) {
                                const updateTextNode: Function = (listIcon: HTMLElement, key: string): void => {
                                    if (listIcon) {
                                        const dlList: HTMLElement = listIcon.parentElement;
                                        dlList.innerHTML = '';
                                        dlList.appendChild(listIcon);
                                        dlList.appendChild(document.createTextNode(this.getLocaleText(key, l10n)));
                                    }
                                };
                                updateTextNode(args.element.querySelector('.e-dl-insideend'), 'Above');
                                updateTextNode(args.element.querySelector('.e-dl-insidebase'), 'Below');
                                const outsideIcon: HTMLElement = args.element.querySelector('.e-dl-outsideend');
                                if (outsideIcon) {
                                    outsideIcon.parentElement.style.display = 'none';
                                }
                            }
                        }
                    }
                }
            }
        });
        if (this.createElementFn) {
            addChartMenu.createElement = this.createElementFn as (tag: string, prop?: Object) => HTMLElement;
        }
        if (!ul.parentElement) {
            document.body.appendChild(ul);
        }
        addChartMenu.appendTo(ul);
        ul.classList.add('e-ul');
        return addChartMenu;
    }

    /**
     * Gets the Add Chart Element menu items based on whether the active chart is Cartesian or Accumulation.
     *
     * @param {boolean} isAccumulation - Whether the chart is Pie or Doughnut.
     * @param {L10n} [l10n] - Localization instance.
     * @returns {MenuItemModel[]} Menu items array.
     */
    public getAddChartMenuItems(isAccumulation: boolean, l10n?: L10n): MenuItemModel[] {
        const getConst: (key: string) => string = (key: string): string => this.getLocaleText(key, l10n);
        if (isAccumulation) {
            return [
                {
                    iconCss: 'e-icons e-chart-title', text: getConst('ChartTitle'),
                    items: [
                        { iconCss: 'e-icons e-ct-none', id: 'ChartTitleNone', text: getConst('None') },
                        { iconCss: 'e-icons e-ct-abovechart', id: 'ChartTitleAbove', text: getConst('AboveChart') }
                    ]
                },
                {
                    iconCss: 'e-icons e-data-labels', id: 'data-labels', text: getConst('DataLabels'),
                    items: [
                        { iconCss: 'e-icons e-dl-none', id: 'DLNone', text: getConst('None') },
                        { iconCss: 'e-icons e-dl-center', id: 'DLCenter', text: getConst('Center') },
                        { iconCss: 'e-icons e-dl-insideend', id: 'DLInsideend', text: getConst('InsideEnd') },
                        { iconCss: 'e-icons e-dl-insidebase', id: 'DLInsidebase', text: getConst('InsideBase') },
                        { iconCss: 'e-icons e-dl-outsideend', id: 'DLOutsideend', text: getConst('OutsideEnd') }
                    ]
                },
                {
                    iconCss: 'e-icons e-legends', text: getConst('Legends'),
                    items: [
                        { iconCss: 'e-icons e-legends-none', id: 'LegendNone', text: getConst('None') },
                        { iconCss: 'e-icons e-legends-right', id: 'LegendsRight', text: getConst('Right') },
                        { iconCss: 'e-icons e-legends-left', id: 'LegendsLeft', text: getConst('Left') },
                        { iconCss: 'e-icons e-legends-bottom', id: 'LegendsBottom', text: getConst('Bottom') },
                        { iconCss: 'e-icons e-legends-top', id: 'LegendsTop', text: getConst('Top') }
                    ]
                }
            ];
        }
        return [
            {
                iconCss: 'e-icons e-axes', text: getConst('Axes'),
                items: [
                    { iconCss: 'e-icons e-ph-axes', id: 'PHAxes', text: getConst('PrimaryHorizontal') },
                    { iconCss: 'e-icons e-pv-axes', id: 'PVAxes', text: getConst('PrimaryVertical') }
                ]
            },
            {
                iconCss: 'e-icons e-axis-title', text: getConst('AxisTitle'),
                items: [
                    { iconCss: 'e-icons e-ph-axistitle', id: 'PHAxisTitle', text: getConst('PrimaryHorizontal') },
                    { iconCss: 'e-icons e-pv-axistitle', id: 'PVAxisTitle', text: getConst('PrimaryVertical') }
                ]
            },
            {
                iconCss: 'e-icons e-chart-title', text: getConst('ChartTitle'),
                items: [
                    { iconCss: 'e-icons e-ct-none', id: 'ChartTitleNone', text: getConst('None') },
                    { iconCss: 'e-icons e-ct-abovechart', id: 'ChartTitleAbove', text: getConst('AboveChart') }
                ]
            },
            {
                iconCss: 'e-icons e-data-labels', id: 'data-labels', text: getConst('DataLabels'),
                items: [
                    { iconCss: 'e-icons e-dl-none', id: 'DLNone', text: getConst('None') },
                    { iconCss: 'e-icons e-dl-center', id: 'DLCenter', text: getConst('Center') },
                    { iconCss: 'e-icons e-dl-insideend', id: 'DLInsideend', text: getConst('InsideEnd') },
                    { iconCss: 'e-icons e-dl-insidebase', id: 'DLInsidebase', text: getConst('InsideBase') },
                    { iconCss: 'e-icons e-dl-outsideend', id: 'DLOutsideend', text: getConst('OutsideEnd') }
                ]
            },
            {
                iconCss: 'e-icons e-gridlines', text: getConst('Gridlines'),
                items: [
                    { iconCss: 'e-icons e-gl-major-horizontal', id: 'GLMajorHorizontal', text: getConst('PrimaryMajorHorizontal') },
                    { iconCss: 'e-icons e-gl-major-vertical', id: 'GLMajorVertical', text: getConst('PrimaryMajorVertical') },
                    { iconCss: 'e-icons e-gl-minor-horizontal', id: 'GLMinorHorizontal', text: getConst('PrimaryMinorHorizontal') },
                    { iconCss: 'e-icons e-gl-minor-vertical', id: 'GLMinorVertical', text: getConst('PrimaryMinorVertical') }
                ]
            },
            {
                iconCss: 'e-icons e-legends', text: getConst('Legends'),
                items: [
                    { iconCss: 'e-icons e-legends-none', id: 'LegendNone', text: getConst('None') },
                    { iconCss: 'e-icons e-legends-right', id: 'LegendsRight', text: getConst('Right') },
                    { iconCss: 'e-icons e-legends-left', id: 'LegendsLeft', text: getConst('Left') },
                    { iconCss: 'e-icons e-legends-bottom', id: 'LegendsBottom', text: getConst('Bottom') },
                    { iconCss: 'e-icons e-legends-top', id: 'LegendsTop', text: getConst('Top') }
                ]
            }
        ];
    }

    /**
     * Builds the Chart Theme DropDownButton matching Spreadsheet line-for-line.
     *
     * @param {string} id - The base ID prefix.
     * @param {L10n} l10n - The localization instance.
     * @param {HTMLElement} [rootContainer] - Optional root container to search for active chart.
     * @returns {Element} The created button element.
     */
    public getChartThemeDDB(id: string, l10n: L10n, rootContainer?: HTMLElement): Element {
        const chartThemeBtn: HTMLElement = this.createElementFn(
            'button', { id: id + '_chart_theme', attrs: { 'type': 'button' }, className: 'e-ss-ddb' });
        chartThemeBtn.appendChild(this.createElementFn('span', { className: 'e-tbar-btn-text' }));
        let theme: ChartTheme = 'Material';
        const overlay: HTMLElement = (rootContainer || document.body).querySelector('.e-ss-overlay-active');
        if (overlay) {
            const chart: HTMLElement = overlay.querySelector('.e-chart');
            if (chart) {
                const chartObj: { theme?: ChartTheme } = getComponent(chart, 'chart') as { theme?: ChartTheme };
                if (chartObj && chartObj.theme) {
                    theme = chartObj.theme;
                }
            } else {
                const accChart: HTMLElement = overlay.querySelector('.e-accumulationchart');
                if (accChart) {
                    const accObj: { theme?: ChartTheme } = getComponent(accChart, 'accumulationchart') as { theme?: ChartTheme };
                    if (accObj && accObj.theme) {
                        theme = accObj.theme;
                    }
                }
            }
        }
        const initialText: string = this.getLocaleText(theme, l10n);
        this.chartThemeDDB = new DropDownButton({
            items: this.getChartThemeDdbItems(theme, l10n),
            content: initialText,
            createPopupOnClick: true,
            enableRtl: this.enableRtl,
            select: (args: MenuEventArgs): void => {
                if (this.actions.onSelectionComplete) {
                    this.actions.onSelectionComplete(<MouseEvent>{ type: 'mousedown' });
                }
                if (!args.element || !args.element.querySelector('.e-selected-icon')) {
                    this.chartThemeDDB.content = args.item.text;
                    this.chartThemeDDB.refresh();
                    if (this.actions.onThemeSelect) {
                        this.actions.onThemeSelect(args.item.id as ChartTheme);
                    } else if (this.chartManager) {
                        const mgr: { onRibbonAction?: (actionId: RibbonAction, val?: string | number | boolean) => boolean } =
                            this.chartManager as {
                                onRibbonAction?: (actionId: RibbonAction, val?: string | number | boolean) => boolean;
                            };
                        if (mgr.onRibbonAction) {
                            mgr.onRibbonAction('theme', args.item.id);
                        }
                    }
                    this.chartThemeDDB.setProperties({ items: this.getChartThemeDdbItems(args.item.id as ChartTheme, l10n) }, true);
                }
            },
            cssClass: 'e-flat e-charttheme-ddb',
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => {
                const targetLabel: string = this.getLocaleText('Chart', l10n);
                this.tBarDdbBeforeOpen(args.element, args.items, targetLabel);
            }
        });
        this.chartThemeDDB.createElement = this.createElementFn as (tag: string, prop?: Object) => HTMLElement;
        this.chartThemeDDB.appendTo(chartThemeBtn);
        return chartThemeBtn;
    }

    /**
     * Generates theme dropdown items with active selected icon.
     *
     * @param {string} theme - Active theme name.
     * @param {L10n} [l10n] - The localization instance.
     * @returns {DropDownItemModel[]} Array of dropdown item models.
     */
    public getChartThemeDdbItems(theme: string, l10n?: L10n): DropDownItemModel[] {
        const items: DropDownItemModel[] = [];
        ChartRibbon.THEMES.forEach((id: string): void => {
            const itemText: string = this.getLocaleText(id, l10n);
            items.push({ id: id, text: itemText, iconCss: id === theme ? 'e-icons e-selected-icon' : '' });
        });
        return items;
    }

    /* =========================================================================
     * SECTION 5: STATE SYNCHRONIZATION & EVENT HANDLING
     * ========================================================================= */

    /**
     * Updates options inside the ribbon (disables Switch Row/Column or Axes for circular charts).
     *
     * @param {ChartType | string | ChartModel} chartTypeOrModel - Active chart type or chart model.
     * @param {HTMLElement} [hostElement] - Optional root container element.
     * @returns {void}
     */
    public updateRibbonOptions(chartTypeOrModel: ChartType | string | ChartModel, hostElement?: HTMLElement): void {
        const host: { element?: HTMLElement } = this.hostInstance as { element?: HTMLElement };
        const root: HTMLElement = hostElement || (host && host.element ? host.element : document.body);
        if (!root) { return; }
        let chartType: string = '';
        if (typeof chartTypeOrModel === 'string') {
            chartType = chartTypeOrModel;
        } else if (chartTypeOrModel && (chartTypeOrModel as ChartModel).type) {
            chartType = (chartTypeOrModel as ChartModel).type;
        }
        const isCircular: boolean = chartType === 'Pie' || chartType === 'Doughnut';
        const prefix: string = host && host.element ? host.element.id : '';
        // Dynamically update Add Chart Element menu items when active chart type changes
        const addChartUl: HTMLElement = (prefix ? root.querySelector('#' + prefix + '_add_chart_menu') as HTMLElement : null) ||
            (document.getElementById(prefix + '_add_chart_menu')) ||
            (document.querySelector('[id$="_add_chart_menu"]') as HTMLElement) ||
            (document.querySelector('.e-addchart-menu ul') as HTMLElement) ||
            (document.querySelector('.e-addchart-menu') as HTMLElement);
        if (addChartUl) {
            let existingMenu: Menu = getComponent(addChartUl, 'menu') as Menu;
            if (!existingMenu) {
                const innerUl: HTMLElement = addChartUl.querySelector('ul.e-menu-parent, ul');
                if (innerUl) {
                    existingMenu = getComponent(innerUl, 'menu') as Menu;
                }
            }
            if (existingMenu) {
                const isAcc: boolean = isCircular;
                existingMenu.items = this.getAddChartMenuItems(isAcc, this.l10n);
            }
        }
    }

    /**
     * Refreshes the selected theme inside the Chart Theme dropdown button.
     *
     * @param {ChartTheme} theme - The new theme to mark as selected.
     * @param {L10n} l10n - Localization service instance.
     * @param {HTMLElement} [rootContainer] - Optional root DOM container.
     * @returns {void}
     */
    public refreshThemeSelection(theme: ChartTheme, l10n?: L10n, rootContainer?: HTMLElement): void {
        const host: { element?: HTMLElement } = this.hostInstance as { element?: HTMLElement };
        const root: HTMLElement = rootContainer || (host && host.element ? host.element : document.body);
        if (!root) { return; }
        const prefix: string = host && host.element ? host.element.id : '';
        const themeBtnId: string = prefix ? prefix + '_chart_theme' : 'spreadsheet_chart_theme';
        const chartThemeEle: HTMLElement = (prefix ? root.querySelector('#' + prefix + '_chart_theme') : null) as HTMLElement ||
            root.querySelector('#spreadsheet_chart_theme') as HTMLElement ||
            root.querySelector('[id*="_chart_theme"]') as HTMLElement ||
            document.getElementById(themeBtnId);
        if (chartThemeEle) {
            const chartThemeDdb: DropDownButton = getComponent(chartThemeEle, 'dropdown-btn') as DropDownButton;
            if (chartThemeDdb) {
                const localizedTheme: string = this.getLocaleText(theme, l10n);
                for (let i: number = 0; i < chartThemeDdb.items.length; i++) {
                    if (chartThemeDdb.items[i as number].iconCss !== '') {
                        chartThemeDdb.items[i as number].iconCss = '';
                    }
                    if (chartThemeDdb.items[i as number].id === theme || chartThemeDdb.items[i as number].text === localizedTheme) {
                        chartThemeDdb.items[i as number].iconCss = 'e-icons e-selected-icon';
                    }
                }
                if (chartThemeDdb.element && chartThemeDdb.element.firstChild) {
                    chartThemeDdb.element.firstChild.textContent = localizedTheme;
                }
                if (chartThemeDdb.setProperties) {
                    chartThemeDdb.setProperties({ items: chartThemeDdb.items }, true);
                }
                if (chartThemeDdb.element && chartThemeDdb.element.setAttribute) {
                    chartThemeDdb.element.setAttribute('aria-label', localizedTheme);
                }
            }
        }
    }

    /**
     * Backward-compatible alias for refreshThemeSelection.
     *
     * @param {ChartTheme} theme - The new theme to mark as selected.
     * @param {L10n} l10n - Localization service instance.
     * @param {HTMLElement} [hostElement] - Optional root container element.
     * @returns {void}
     */
    public refreshChartTheme(theme: ChartTheme, l10n?: L10n, hostElement?: HTMLElement): void {
        this.refreshThemeSelection(theme, l10n, hostElement);
    }

    /**
     * Helper for positioning dropdown popups.
     *
     * @param {HTMLElement} popupEle - The popup DOM element.
     * @param {HTMLElement} ul - The inner UL list element.
     * @returns {void}
     */
    private openHandler(popupEle: HTMLElement, ul: HTMLElement): void {
        popupEle.style.left = `${parseFloat(popupEle.style.left) + 2}px`;
        const offset: ClientRect = popupEle.getBoundingClientRect();
        if (offset.left < 0) {
            popupEle.style.left = '0px';
        }
        if (ul) {
            const wrapper: HTMLElement = popupEle.parentElement as HTMLElement;
            if (wrapper) {
                const wrapperRect: ClientRect = wrapper.getBoundingClientRect();
                const wrapperBottom: number = wrapperRect.bottom;
                const viewportHeight: number = window.innerHeight;
                if (wrapperBottom > viewportHeight) {
                    const visibleDropdownHeight: number = wrapperRect.height - (wrapperBottom - viewportHeight);
                    if (visibleDropdownHeight > 70) {
                        ul.style.height = `${visibleDropdownHeight}px`;
                        ul.style.overflowY = 'auto';
                    }
                }
            }
            if (ul.focus) {
                ul.focus();
            }
        }
    }

    /**
     * Positioning and adjustment before dropdown popup opens.
     *
     * @param {HTMLElement} element - The dropdown element.
     * @param {ItemModel[]} items - The items in the dropdown.
     * @param {string} [targetLabel] - Optional target label.
     * @param {number} [separatorCount] - Count of separators.
     * @returns {void}
     */
    private tBarDdbBeforeOpen(
        element: HTMLElement, items: (MenuItemModel | DropDownItemModel | ItemModel)[],
        targetLabel?: string, separatorCount: number = 0
    ): void {
        const host: { viewport?: { height?: number } } = this.hostInstance as { viewport?: { height?: number } };
        const viewportHeight: number = (host && host.viewport && host.viewport.height) ? host.viewport.height : (window.innerHeight || 600);
        let firstElemHeight: number = 26;
        if (element.firstElementChild) {
            const computedH: number = parseInt(getComputedStyle(element.firstElementChild).height, 10);
            if (!isNaN(computedH) && computedH > 0) {
                firstElemHeight = computedH;
            }
        }
        let actualHeight: number = (firstElemHeight * ((items ? items.length : 0) - separatorCount)) +
            (parseInt(getComputedStyle(element).paddingTop, 10) * 2 || 0);
        if (separatorCount) {
            const separator: Element = element.querySelector('.e-separator');
            if (separator) {
                const separatorStyle: CSSStyleDeclaration = getComputedStyle(separator);
                const borderBottom: number = parseInt(separatorStyle.borderBottomWidth, 10);
                const marginTop: number = parseInt(separatorStyle.marginTop, 10);
                actualHeight += (separatorCount * (borderBottom + (marginTop * 2)));
            }
        }
        const maxPopupHeight: number = Math.min(320, viewportHeight);
        if (actualHeight > maxPopupHeight) {
            element.style.height = `${maxPopupHeight}px`;
            element.style.overflowY = 'auto';
        } else {
            if (element.style.height) {
                element.style.height = '';
                element.style.overflowY = '';
            }
        }
        if (parseFloat(element.style.left) < 0) {
            element.style.left = '0px';
        }
        if (targetLabel) {
            element.setAttribute('aria-label', targetLabel);
        }
    }

    /**
     * Keydown navigation handler for palette menu icons.
     *
     * @param {string} iconCls - The icon CSS selector class.
     * @param {number} [rowWiseCount] - Optional row wise count.
     * @param {KeyboardEvent} [e] - The keyboard event.
     * @returns {void}
     */
    private menuIconKeyDown(iconCls: string, rowWiseCount?: number, e?: KeyboardEvent): void {
        let index: number;
        let icons: HTMLElement[] = [];
        if (!e) {
            index = 0;
            icons = [].slice.call(document.querySelectorAll(`.${iconCls}`));
        } else if (e.keyCode === 40 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 37) {
            e.preventDefault();
            icons = [].slice.call(document.querySelectorAll(`.${iconCls}`));
            index = icons.indexOf(e.target as HTMLElement);
            if (index === -1) {
                index = 0;
            } else if (e.keyCode === 39) {
                index++;
                if (index === icons.length) {
                    index = 0;
                }
            } else if (e.keyCode === 37) {
                index--;
                if (index === -1) {
                    index = icons.length - 1;
                }
            }
        }
        if (icons[index as number] && icons[index as number].focus) {
            icons[index as number].focus();
        }
    }

    /**
     * Keydown handler to close active dropdown popups on Alt+Up or Escape.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @returns {void}
     */
    private closeDropdownPopup(e: KeyboardEvent): void {
        if ((e.altKey && e.keyCode === 38) || e.keyCode === 27) {
            const target: DropDownButton = this[1 as number];
            if (target && target.element) {
                target.toggle();
                if (target.element.focus) {
                    target.element.focus();
                }
            }
        }
    }

    /* =========================================================================
     * SECTION 6: LIFECYCLE CLEANUP & DESTRUCTION
     * ========================================================================= */

    /**
     * Sets the active chart ID for ribbon actions.
     *
     * @param {string} chartId - Active chart identifier.
     * @returns {void}
     */
    public setActiveChart(chartId: string): void {
        this.activeChartId = chartId;
    }

    /**
     * Gets the active chart ID currently associated with the ribbon.
     *
     * @returns {string} The active chart identifier.
     */
    public getActiveChart(): string {
        return this.activeChartId;
    }

    /**
     * Unified API to show or hide the Contextual Chart Design Tab based on selection.
     * Automatically reflects the chart's current theme and type.
     *
     * @param {boolean} enable - Whether to enable/show the tab.
     * @param {ChartTheme} [theme] - Active chart theme to select.
     * @param {string} [type] - Active chart type to reflect.
     * @param {string} [chartId] - Active chart identifier.
     * @returns {void}
     */
    public enableChartTab(enable: boolean, theme?: ChartTheme, type?: string, chartId?: string): void {
        this.activeChartId = enable ? (chartId || this.activeChartId) : null;
        const host: {
            showRibbonTabs?: (tabs: string[], isContextual?: boolean) => void;
            hideRibbonTabs?: (tabs: string[], isContextual?: boolean) => void;
            element?: HTMLElement;
            ribbon?: { tabObj?: { select?: (idx: number) => void }, items?: { length: number } };
        } = this.hostInstance as {
            showRibbonTabs?: (tabs: string[], isContextual?: boolean) => void;
            hideRibbonTabs?: (tabs: string[], isContextual?: boolean) => void;
            element?: HTMLElement;
            ribbon?: { tabObj?: { select?: (idx: number) => void }, items?: { length: number } };
        };
        const tabName: string = this.getLocaleText('ChartDesign', this.l10n);
        if (enable) {
            if (host && host.showRibbonTabs) {
                host.showRibbonTabs([tabName], true);
            }
            if (theme) {
                this.refreshThemeSelection(theme, this.l10n, host ? host.element : undefined);
            }
            if (type) {
                this.updateRibbonOptions(type, host ? host.element : undefined);
            }
        } else {
            if (host && host.hideRibbonTabs) {
                host.hideRibbonTabs([tabName], true);
            }
        }
    }

    /**
     * Removes contextual Chart Design Tab elements from DOM.
     *
     * @returns {void}
     */
    public removeDesignTabElements(): void {
        const classNames: string[] = ['e-addchart-ddb', 'e-chart-type-ddb', 'e-charttheme-ddb'];
        classNames.forEach((cls: string): void => {
            const elements: HTMLCollectionOf<Element> = document.getElementsByClassName(cls);
            while (elements.length > 0) {
                elements[0].remove();
            }
        });
    }

    /**
     * Destroys all Chart Ribbon created menus, dropdown buttons, popups, and frees references.
     * Matches the destruction pattern of Spreadsheet integrations/ribbon.ts exactly.
     *
     * @param {string} [rootId] - Base host id prefix.
     * @returns {void}
     */
    public destroy(rootId?: string): void {
        const host: { element?: HTMLElement } = this.hostInstance as { element?: HTMLElement };
        const id: string = rootId || (host && host.element ? host.element.id : 'spreadsheet');
        if (this.addChartDdb) {
            this.addChartDdb.destroy();
            this.addChartDdb = null;
        }
        if (this.chartThemeDDB) {
            this.chartThemeDDB.destroy();
            this.chartThemeDDB = null;
        }
        if (this.chartBtnDdb) {
            this.chartBtnDdb.destroy();
            this.chartBtnDdb = null;
        }
        if (this.chartTypeDdb) {
            this.chartTypeDdb.destroy();
            this.chartTypeDdb = null;
        }
        const destroyComponent: Function = (targetId: string, moduleName: string): void => {
            const ele: HTMLElement = typeof targetId === 'string' ? document.getElementById(targetId) : targetId;
            if (ele) {
                if (moduleName !== 'menu' || ele.childElementCount) {
                    const compObj: { destroy?: () => void } = getComponent(ele, moduleName) as { destroy?: () => void };
                    if (compObj && compObj.destroy) {
                        compObj.destroy();
                        if (moduleName === 'dropdown-btn') {
                            const popup: HTMLElement = document.getElementById(`${ele.id}-popup`);
                            if (popup) {
                                detach(popup);
                            }
                        }
                    }
                }
                if (moduleName === 'menu') {
                    detach(ele);
                }
            }
        };
        // Destroy menus and dropdown buttons matching spreadsheet ribbon destroy exactly
        destroyComponent(id + '_chart_menu', 'menu');
        destroyComponent(id + '_chart_type_menu', 'menu');
        destroyComponent(id + '_chart-btn', 'dropdown-btn');
        destroyComponent(id + '_chart-type-btn', 'dropdown-btn');
        destroyComponent(id + '_chart-type-btn', 'menu');
        destroyComponent(id + '_chart_theme', 'menu');
        destroyComponent(id + '_chart_theme', 'dropdown-btn');
        destroyComponent(id + '_addchart', 'dropdown-btn');
        // Detach popup elements
        ['_chart-type-btn', '_chart-btn', '_addchart', '_chart_theme'].forEach((selector: string): void => {
            const popup: HTMLElement = document.getElementById(`${id}${selector}-popup`);
            if (popup) {
                detach(popup);
            }
        });
        this.removeDesignTabElements();
        ['_chart_menu_container', '_chart_type_menu_container', '_add_chart_menu_container'].forEach((suffix: string): void => {
            const containerEle: HTMLElement = document.getElementById(id + suffix);
            if (containerEle && containerEle.parentElement) {
                detach(containerEle);
            }
        });
        if (this.chartManager && (this.chartManager as { detachRibbon?: () => void }).detachRibbon) {
            (this.chartManager as { detachRibbon?: () => void }).detachRibbon();
        }
        this.actions = null;
        this.hostInstance = null;
        this.chartManager = null;
        this.createElementFn = null;
        this.boundMenuIconKeyDown = null;
        this.l10n = null;
        this.activeChartId = null;
    }

    /**
     * Displays an EJ2 Dialog asking the user to enter Chart Title, Horizontal Axis Title, or Vertical Axis Title,
     * matching Spreadsheet chart title dialog validation, EJ2 Dialog component usage, and styling.
     *
     * @param {string} actionId - Target action ('ChartTitleAbove', 'AboveChart', 'PHAxisTitle', 'PVAxisTitle').
     * @returns {void}
     */
    public showTitleDialog(actionId: string): void {
        if (document.querySelector('.e-title-dlg')) {
            return;
        }
        const host: { element?: HTMLElement } = this.hostInstance as { element?: HTMLElement };
        const target: HTMLElement = (host && host.element) ? host.element : document.body;
        const dialogDiv: HTMLElement = this.createElementFn('div', { id: 'chart_title_dialog' });
        target.appendChild(dialogDiv);
        let headerText: string = this.getLocaleText('ChartTitle');
        if (actionId === 'PHAxisTitle') {
            headerText = this.getLocaleText('HorizontalAxisTitle');
        } else if (actionId === 'PVAxisTitle') {
            headerText = this.getLocaleText('VerticalAxisTitle');
        }
        const dlgContent: HTMLElement = this.createElementFn('div', { className: 'e-title-dlg-content' });
        const value1Text: HTMLElement = this.createElementFn('span', { className: 'e-header e-top-header' });
        value1Text.innerText = this.getLocaleText('EnterTitle');
        const value1Inp: HTMLInputElement = this.createElementFn('input', {
            className: 'e-input',
            id: 'titleInput',
            attrs: { type: 'text' }
        }) as HTMLInputElement;
        let isBarChart: boolean = false;
        let activeId: string = null;
        if (this.chartManager) {
            activeId = (this.chartManager as { getActiveChart?: () => string }).getActiveChart
                ? (this.chartManager as { getActiveChart: () => string }).getActiveChart() : null;
            if (activeId) {
                const model: ChartModel = (this.chartManager as { getChartModel?: (id: string) => ChartModel }).getChartModel
                    ? (this.chartManager as { getChartModel: (id: string) => ChartModel }).getChartModel(activeId) : null;
                if (model) {
                    isBarChart = (model.type || '').includes('Bar');
                    if (actionId === 'PHAxisTitle') {
                        value1Inp.value = (isBarChart ? (model.primaryYAxis && model.primaryYAxis.title) : (model.primaryXAxis && model.primaryXAxis.title)) || '';
                    } else if (actionId === 'PVAxisTitle') {
                        value1Inp.value = (isBarChart ? (model.primaryXAxis && model.primaryXAxis.title) : (model.primaryYAxis && model.primaryYAxis.title)) || '';
                    } else if (model.title) {
                        value1Inp.value = model.title;
                    }
                }
            }
        }
        dlgContent.appendChild(value1Text);
        dlgContent.appendChild(value1Inp);
        const cachedChartId: string = activeId;
        const dialogObj: Dialog = new Dialog({
            width: 375,
            showCloseIcon: true,
            isModal: true,
            closeOnEscape: true,
            cssClass: 'e-title-dlg',
            header: headerText,
            content: dlgContent,
            target: target,
            open: (): void => {
                if (value1Inp) {
                    value1Inp.focus();
                    value1Inp.select();
                }
            },
            buttons: [
                {
                    buttonModel: {
                        content: this.getLocaleText('Ok'),
                        isPrimary: true,
                        cssClass: 'e-btn e-clearall-btn e-flat'
                    },
                    click: (): void => {
                        const inputEle: HTMLInputElement = dialogDiv ? dialogDiv.querySelector('#titleInput') as HTMLInputElement : null;
                        const enteredText: string = inputEle ? inputEle.value : (value1Inp ? value1Inp.value : '');
                        const container: HTMLElement = dialogDiv ? dialogDiv.parentElement : null;
                        dialogObj.destroy();
                        if (dialogDiv) {
                            dialogDiv.remove();
                        }
                        if (container && container.classList.contains('e-title-dlg')) {
                            container.remove();
                        }
                        if (cachedChartId && this.chartManager) {
                            const mgrActive: { setActiveChart?: (id: string) => void } =
                                this.chartManager as { setActiveChart?: (id: string) => void };
                            if (mgrActive.setActiveChart) {
                                mgrActive.setActiveChart(cachedChartId);
                            }
                        }
                        if (this.actions && this.actions.onAddChartElement) {
                            this.actions.onAddChartElement(actionId, enteredText);
                        } else if (this.chartManager) {
                            const mgr: { onRibbonAction?: (actionId: RibbonAction, val?: string) => boolean } =
                                this.chartManager as { onRibbonAction?: (actionId: RibbonAction, val?: string) => boolean };
                            if (mgr.onRibbonAction) {
                                mgr.onRibbonAction(actionId as RibbonAction, enteredText);
                            }
                        }
                    }
                },
                {
                    buttonModel: {
                        content: this.getLocaleText('Cancel'),
                        cssClass: 'e-btn e-flat'
                    },
                    click: (): void => {
                        const container: HTMLElement = dialogDiv ? dialogDiv.parentElement : null;
                        dialogObj.destroy();
                        if (dialogDiv) {
                            dialogDiv.remove();
                        }
                        if (container && container.classList.contains('e-title-dlg')) {
                            container.remove();
                        }
                    }
                }
            ],
            close: (): void => {
                const container: HTMLElement = dialogDiv ? dialogDiv.parentElement : null;
                dialogObj.destroy();
                if (dialogDiv) {
                    dialogDiv.remove();
                }
                if (container && container.classList.contains('e-title-dlg')) {
                    container.remove();
                }
            }
        });
        dialogObj.appendTo(dialogDiv);
    }
}
