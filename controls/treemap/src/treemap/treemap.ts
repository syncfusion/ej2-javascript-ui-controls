/**
 * Tree Map Component
 */

import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, extend, Ajax } from '@syncfusion/ej2-base';
import { Complex, Collection, ModuleDeclaration } from '@syncfusion/ej2-base';
import { Event, EmitType, Internationalization } from '@syncfusion/ej2-base';
import { SvgRenderer, isNullOrUndefined, createElement, EventHandler, Browser, remove } from '@syncfusion/ej2-base';
import { BorderModel, TitleSettingsModel, MarginModel, LevelSettingsModel, FontModel, } from './model/base-model';
import { LeafItemSettingsModel, TooltipSettingsModel, LegendSettingsModel, InitialDrillSettingsModel } from './model/base-model';
import { HighlightSettingsModel, SelectionSettingsModel } from './model/base-model';
import { Border, Margin, TitleSettings, LegendSettings, InitialDrillSettings } from './model/base';
import { SelectionSettings, TooltipSettings, LevelSettings, LeafItemSettings, HighlightSettings, } from './model/base';
import { TreeMapModel } from './treemap-model';
import { LayoutMode, TreeMapTheme } from './utils/enum';
import { ILoadEventArgs, ILoadedEventArgs, IPrintEventArgs, IItemRenderingEventArgs, IResizeEventArgs } from '../treemap/model/interface';
import { IItemClickEventArgs, IItemMoveEventArgs, IClickEventArgs, IMouseMoveEventArgs } from '../treemap/model/interface';
import { IDrillStartEventArgs, IItemSelectedEventArgs, ITreeMapTooltipRenderEventArgs } from '../treemap/model/interface';
import { IItemHighlightEventArgs, IDrillEndEventArgs } from '../treemap/model/interface';
import { Size, stringToNumber, RectOption, Rect, textTrim, measureText, findChildren, removeClassNames } from '../treemap/utils/helper';
import { findPosition, Location, TextOption, renderTextElement, isContainsData, TreeMapAjax } from '../treemap/utils/helper';
import { load, loaded, itemSelected, drillStart, drillEnd } from '../treemap/model/constants';
import { itemClick, itemMove, click, mouseMove, resize } from '../treemap/model/constants';
import { LayoutPanel } from './layout/render-panel';
import { TreeMapTooltip } from './user-interaction/tooltip';
import { ExportUtils } from '../treemap/utils/export';
import { ExportType } from '../treemap/utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { TreeMapHighlight, TreeMapSelection } from './user-interaction/highlight-selection';
import { TreeMapLegend } from './layout/legend';
import { DataManager, Query } from '@syncfusion/ej2-data';
/**
 * Represents the TreeMap control.
 * ```html
 * <div id="container"/>
 * <script>
 *   var treemap = new TreeMap();
 *   treemap.appendTo("#container");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class TreeMap extends Component<HTMLElement> implements INotifyPropertyChanged {
    //Module Declaration for treemap.
    /**
     * `tooltipModule` is used to render the treemap tooltip.
     */
    public treeMapTooltipModule: TreeMapTooltip;
    /**
     * `highlightModule` is used for highlight the items.
     */
    public treeMapHighlightModule: TreeMapHighlight;
    /**
     * `selectionModule` is used for select the items.
     */
    public treeMapSelectionModule: TreeMapSelection;
    /**
     * `legendModule` is used for render the legend items.
     */
    public treeMapLegendModule: TreeMapLegend;
    /**
     * Specifies the width by given pixel or percentage.
     * @default null
     */
    @Property(null)
    public width: string;
    /**
     * Specifies the height by given pixel or percentage.
     * @default null
     */
    @Property(null)
    public height: string;
    /**
     * Specifies the border of tree map.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Specifies the margin to move the render area.
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;
    /**
     * Specifies the background.
     */
    @Property(null)
    public background: string;
    /**
     * Specifies the theme.
     */
    @Property('Material')
    public theme: TreeMapTheme;
    /**
     * Specifies the title for tree map.
     */
    @Complex<TitleSettingsModel>({}, TitleSettings)
    public titleSettings: TitleSettingsModel;
    /**
     * Specifies the rendering of layout type.
     */
    @Property('Squarified')
    public layoutType: LayoutMode;
    /**
     * Specifies the dataSource.
     * @default null
     */
    @Property(null)
    public dataSource: DataManager | TreeMapAjax | Object[];
    /**
     * Specifies the query for filter the data.
     * @default null
     */
    @Property(null)
    public query: Query;
    /**
     * Specifies the weight value path
     */
    @Property(null)
    public weightValuePath: string;
    /**
     * Specifies the colorValuePath
     */
    @Property('')
    public rangeColorValuePath: string;
    /**
     * Specifies the colorValuePath
     */
    @Property('')
    public equalColorValuePath: string;
    /**
     * Specifies the palette colors.
     */
    @Property([])
    public palette: string[];
    /**
     * To enable or disable the drillDown.
     */
    @Property(false)
    public enableDrillDown: boolean;
    /**
     * Specifies the initial drillDown.
     */
    @Complex<InitialDrillSettingsModel>({}, InitialDrillSettings)
    public initialDrillDown: InitialDrillSettingsModel;
    /**
     * Specifies to access all leaf items in levels.
     */
    @Complex<LeafItemSettingsModel>({}, LeafItemSettings)
    public leafItemSettings: LeafItemSettingsModel;
    /**
     * Specifies the item levels.
     */
    @Collection<LevelSettingsModel>([], LevelSettings)
    public levels: LevelSettingsModel[];
    /**
     * To specifies the highlight settings.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
    /**
     * To specifies the selection settings.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Specifies the tooltip settings.
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;
    /**
     * Specifies the legend settings.
     */
    @Complex<LegendSettingsModel>({}, LegendSettings)
    public legendSettings: LegendSettingsModel;
    /**
     * To enable the separator
     * @default false
     */
    @Property(false)
    public useGroupingSeparator: boolean;
    /**
     * Description for maps.
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * TabIndex value for treemap.
     * @default 1
     */
    @Property(1)
    public tabIndex: number;
    /**
     * To apply internationalization for treemap
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * Triggers before treemap rendered.
     * @event
     */
    @Event()
    public load: EmitType<ILoadEventArgs>;
    /**
     * Triggers before the prints gets started.
     * @event
     */
    @Event()
    public beforePrint: EmitType<IPrintEventArgs>;
    /**
     * Triggers after treemap rendered.
     * @event
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;
    /**
     * Triggers before item rendering.
     * @event
     */
    @Event()
    public itemRendering: EmitType<IItemRenderingEventArgs>;
    /**
     * Triggers the drillDown start.
     * @event
     */
    @Event()
    public drillStart: EmitType<IDrillStartEventArgs>;
    /**
     * Triggers the drillDown end.
     * @event
     */
    @Event()
    public drillEnd: EmitType<IDrillEndEventArgs>;
    /**
     * Triggers the item selected.
     * @event
     */
    @Event()
    public itemSelected: EmitType<IItemSelectedEventArgs>;
    /**
     * Triggers the item highlight.
     * @event
     */
    @Event()
    public itemHighlight: EmitType<IItemHighlightEventArgs>;
    /**
     * Triggers the tooltip rendering.
     * @event
     */
    @Event()
    public tooltipRendering: EmitType<ITreeMapTooltipRenderEventArgs>;
    /**
     * Triggers the item click.
     * @event
     */
    @Event()
    public itemClick: EmitType<IItemClickEventArgs>;
    /**
     * Triggers the item move.
     * @event
     */
    @Event()
    public itemMove: EmitType<IItemMoveEventArgs>;
    /**
     * Triggers the click event.
     * @event
     */
    @Event()
    public click: EmitType<IItemClickEventArgs>;
    /**
     * Triggers the mouse move event.
     * @event
     */
    @Event()
    public mouseMove: EmitType<IMouseMoveEventArgs>;
    /**
     * Triggers the resize event.
     * @event
     */
    @Event()
    public resize: EmitType<IResizeEventArgs>;

    /**
     * svg renderer object.
     * @private
     */
    public renderer: SvgRenderer;
    /**
     * treemap svg element object
     * @private
     */
    public svgObject: Element;
    /**
     *  Stores the exact size of treemap.
     * @private
     */
    public availableSize: Size;
    /**
     * Internal use of internationalization instance.
     * @private
     */
    public intl: Internationalization;
    /**
     * @private
     * Stores the area bounds.
     */
    public areaRect: Rect;
    /** @private */
    public levelsOfData: Object[];
    /** @private */
    public layout: LayoutPanel;
    /** @private */
    public orientation: string = 'Horizontal';
    /** @private */
    public drilledItems: Object[] = [];
    /** @private */
    public isHierarchicalData: boolean = false;
    /** @private */
    private resizeTo: number;
    /** @private */
    private hierarchyData: Object[];

    /**s
     * Constructor for TreeMap component.
     */

    constructor(options?: TreeMapModel, element?: string | HTMLElement) {
        super(options, element);
    }

    protected preRender(): void {

        this.trigger(load, { treemap: this });

        this.initPrivateVariable();

        this.unWireEVents();

        this.createSvg();

        this.wireEVents();

        this.setCulture();

    }

    protected render(): void {

        this.themeEffect();

        this.createSecondaryElement();

        this.addTabIndex();

        this.renderBorder();

        this.renderTitle(this.titleSettings, 'title', null, null);

        this.processDataManager();

    }

    /* tslint:disable:no-string-literal */
    /* tslint:disable:no-eval */
    private processDataManager(): void {
        let dataModule: DataManager; let queryModule: Query; let ajaxModule: Ajax;
        let localAjax: TreeMapAjax;
        if (this.dataSource instanceof DataManager) {
            dataModule = this.dataSource;
            queryModule = this.query instanceof Query ? this.query : new Query();
            let dataManager: Promise<Object> = dataModule.executeQuery(queryModule);
            dataManager.then((e: Object) => {
                this.dataSource = e['result'];
                this.renderTreeMapElements();
            });
        } else if (this.dataSource instanceof TreeMapAjax) {
            localAjax = this.dataSource as TreeMapAjax;
            ajaxModule = new Ajax(localAjax.dataOptions, localAjax.type, localAjax.async, localAjax.contentType);
            ajaxModule.onSuccess = (args: string) => {
                this.dataSource = JSON.parse('[' + args + ']')[0];
                this.renderTreeMapElements();
            };
            ajaxModule.send(localAjax.sendData);
        } else {
            this.renderTreeMapElements();
        }
    }

    private renderTreeMapElements(): void {

        this.processingData();

        if (this.treeMapLegendModule && this.legendSettings.visible) {

            this.treeMapLegendModule.renderLegend();

        }

        this.layout.processLayoutPanel();

        this.element.appendChild(this.svgObject);

        this.elementChange();

        this.trigger(loaded, { treemap: this });

    }

    protected createSvg(): void {
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
        let containerWidth: number = this.element.clientWidth;
        let containerHeight: number = this.element.clientHeight;
        this.availableSize = new Size(
            stringToNumber(this.width, containerWidth) || containerWidth || 600,
            stringToNumber(this.height, containerHeight) || containerHeight || 450
        );
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + '_svg',
            width: this.availableSize.width,
            height: this.availableSize.height
        });
    }


    /**
     * To initilize the private varibales of treemap.
     */
    private initPrivateVariable(): void {

        this.renderer = new SvgRenderer(this.element.id);

        this.layout = new LayoutPanel(this);

    }

    /**
     * To change font styles of map based on themes
     */
    private themeEffect(): void {
        switch (this.theme) {
            case 'Material':
            case 'Bootstrap':
            case 'Fabric':
                this.setTextStyle('#424242');
                break;
            case 'Highcontrast':
                this.setTextStyle('#FFFFFF');
                break;
        }
    }

    private setTextStyle(color: string): void {
        this.titleSettings.textStyle.color = this.titleSettings.textStyle.color || color;
        this.titleSettings.subtitleSettings.textStyle.color = this.titleSettings.subtitleSettings.textStyle.color || color;
        this.legendSettings.textStyle.color = this.legendSettings.textStyle.color || color;
        this.legendSettings.titleStyle.color = this.legendSettings.titleStyle.color || color;
    }

    private createSecondaryElement(): void {
        let secondaryEle: Element = document.getElementById(this.element.id + '_Secondary_Element');
        if (secondaryEle && secondaryEle.childElementCount > 0) {
            secondaryEle.remove();
        }
        if (isNullOrUndefined(document.getElementById(this.element.id + '_Secondary_Element'))) {
            let secondaryElement: Element = createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: absolute;z-index:1;'
            });
            this.element.appendChild(secondaryElement);
        }
    }

    private elementChange(): void {
        if (this.treeMapLegendModule && this.legendSettings.visible && this.treeMapLegendModule.legendGroup && this.layout.layoutGroup) {
            this.svgObject.insertBefore(this.layout.layoutGroup, this.treeMapLegendModule.legendGroup);
        }
    }

    /**
     * @private
     * Render the treemap border
     */
    private renderBorder(): void {
        let width: number = this.border.width;
        let color: string = this.theme === 'Highcontrast' ? '#000000' : '#FFFFFF';
        this.background = this.background ? this.background : color;
        let borderElement: Element = document.getElementById(this.element.id + '_TreeMap_Border');
        if (isNullOrUndefined(borderElement)) {
            let borderRect: RectOption = new RectOption(
                this.element.id + '_TreeMap_Border', this.background, this.border, 1,
                new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(this.renderer.drawRectangle(borderRect) as SVGRectElement);
        } else {
            borderElement.setAttribute('fill', this.background);
        }
    }

    private renderTitle(title: TitleSettingsModel, type: string, bounds: Rect, groupEle: Element): void {
        let style: FontModel = title.textStyle;
        let height: number; let titlePadding: number = 10;
        let width: number = (this.availableSize.width - this.margin.right - this.margin.left);
        if (title.text) {
            if (isNullOrUndefined(groupEle)) {
                groupEle = this.renderer.createGroup({ id: this.element.id + '_Title_Group' });
            }
            let trimmedTitle: string = textTrim(width, title.text, style);
            let elementSize: Size = measureText(trimmedTitle, style);
            let rect: Rect = (isNullOrUndefined(bounds)) ? new Rect(
                this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height) : bounds;
            let location: Location = findPosition(rect, title.alignment, elementSize, type);
            let options: TextOption = new TextOption(
                this.element.id + '_TreeMap_' + type, location.x, location.y, 'start', trimmedTitle
            );
            let titleBounds: Rect = new Rect(location.x, location.y, elementSize.width, elementSize.height);
            let element: Element = renderTextElement(options, style, style.color, groupEle);
            element.setAttribute('aria-label', title.description || title.text);
            element.setAttribute('tabindex', (this.tabIndex + (type === 'title' ? 1 : 2)).toString());
            if ((type === 'title' && !title.subtitleSettings.text) || (type === 'subtitle')) {
                height = (this.availableSize.height - titleBounds.y - titlePadding - this.margin.bottom);
                this.areaRect = new Rect(this.margin.left, titleBounds.y + titlePadding, width, height);
            }
            if (type !== 'subtitle' && title.subtitleSettings.text) {
                this.renderTitle(title.subtitleSettings, 'subtitle', titleBounds, groupEle);
            } else {
                this.svgObject.appendChild(groupEle);
            }
        } else {
            height = (this.availableSize.height - this.margin.top - this.margin.bottom);
            this.areaRect = new Rect(this.margin.left, this.margin.top, width, height);
        }
    }



    protected processingData(): void {
        let path: string;
        this.dataSource = this.dataSource as Object[];
        if (!isNullOrUndefined(this.dataSource) && this.dataSource.length > 0 && this.weightValuePath) {
            this.levelsOfData = [];
            this.dataSource.map((data: Object) => {
                data[this.weightValuePath] = (data[this.weightValuePath]) ? (data[this.weightValuePath] as string).toString() :
                    data[this.weightValuePath];
            });
            this.leafItemSettings.labelPath = this.leafItemSettings.labelPath || this.weightValuePath;
            this.checkIsHierarchicalData();
            if (this.levels.length === 0) {
                let data: Object = new Object();
                data['level'] = 0;
                path = this.leafItemSettings.labelPath;
                data[path] = [];
                for (let i: number = 0; i < this.dataSource.length; i++) {
                    let child: Object[] = findChildren(this.dataSource[i])['values'];
                    if (this.isHierarchicalData && child && child.length > 0) {
                        child.forEach((currentData: Object, dataIndex: number) => {
                            if (currentData[path]) {
                                (<Object[]>data[path]).push({
                                    groupIndex: 0, name: currentData[path], levelOrderName: (currentData[path] as string).toString(),
                                    data: currentData, weight: currentData[this.weightValuePath]
                                });
                            }
                        });
                    } else {
                        if (this.dataSource[i][path]) {
                            (<Object[]>data[path]).push({
                                groupIndex: 0, name: this.dataSource[i][path], levelOrderName: (
                                    this.dataSource[i][path] as string).toString(), data: this.dataSource[i],
                                weight: this.dataSource[i][this.weightValuePath]
                            });
                        }
                    }
                }
                this.levelsOfData.push(data);
            } else {
                if (this.isHierarchicalData) {
                    this.hierarchyData = [];
                    this.hierarchyData = extend([], this.dataSource, this.hierarchyData, true) as Object[];
                    for (let i: number = 0; i < this.hierarchyData.length; i++) {
                        this.processHierarchicalData(this.hierarchyData[i], i);
                    }
                    this.levelsOfData = this.hierarchyData;
                } else {
                    this.processFlatJsonData();
                    if (this.levelsOfData.length > 1) {
                        this.reOrderLevelData(this.levelsOfData.length - 1);
                    }
                }
                path = this.levels[0].groupPath;
            }
            if (!this.isHierarchicalData) {
                this.findTotalWeight(this.levelsOfData[0][path], 'Parent');
            }
        }
    }

    private checkIsHierarchicalData(): void {
        let child: Object[]; this.dataSource = this.dataSource as Object[];
        for (let i: number = 0; i < this.dataSource.length; i++) {
            child = findChildren(this.dataSource[i])['values'];
            if (child && child.length) {
                this.isHierarchicalData = true;
                break;
            } else if (i === this.dataSource.length - 1) {
                this.isHierarchicalData = false;
            }
        }
    }

    private processHierarchicalData(data: Object, dataCount: number): void {
        let childData: Object[]; let levelData: Object[] = [];
        let newData: Object = new Object();
        let levelIndex: number;
        let path: string = this.leafItemSettings.labelPath ? this.leafItemSettings.labelPath : this.weightValuePath;
        let currentData: Object = new Object();
        let level: LevelSettingsModel; let key: string;
        newData = findChildren(data);
        childData = newData ? newData['values'] : null;
        if (childData && childData.length > 0) {
            key = newData['key'];
            for (let i: number = 0; i < this.levels.length; i++) {
                if (key === this.levels[i].groupPath) {
                    level = this.levels[i];
                    levelIndex = i;
                }
            }
            for (let j: number = 0; j < childData.length; j++) {
                childData[j]['name'] = childData[j][path];
                childData[j]['levelOrderName'] = (levelIndex === 0 ? childData[j]['name'] :
                    data['levelOrderName'] + '_' + childData[j]['name']) + '';
                childData[j]['groupIndex'] = isNullOrUndefined(levelIndex) ? this.levels.length : levelIndex;
                if (levelIndex !== 0) {
                    childData[j]['parent'] = data;
                }
                childData[j]['groupName'] = key;
                childData[j]['data'] = childData[j];
                childData[j]['isDrilled'] = false;
                childData[j]['weight'] = childData[j][this.weightValuePath];
            }
            childData.forEach((currentData: Object) => {
                this.processHierarchicalData(currentData, dataCount);
            });
        }
        if (dataCount === this.hierarchyData.length - 1) {
            let mainData: Object[] = this.hierarchyData[0][this.levels[0].groupPath];
            for (let k: number = 0; k < this.hierarchyData.length; k++) {
                childData = findChildren(this.hierarchyData[k])['values'];
                if (k !== 0 && childData) {
                    childData.forEach((currentData: Object) => { mainData.push(currentData); });
                    this.hierarchyData.splice(k, 1);
                    k -= 1;
                }
            }
            mainData = this.hierarchyData[0][this.levels[0].groupPath];
            for (let l: number = 0; l < mainData.length; l++) {
                newData[this.levels[0].groupPath] = mainData;
                mainData[l]['parent'] = newData;
            }
        }
    }
    /**
     * Handles the print method for chart control.
     */
    public print(id?: string[] | string | Element): void {
        let exportChart: ExportUtils = new ExportUtils(this);
        exportChart.print(id);
    }
    /**
     * Handles the export method for chart control.
     * @param type 
     * @param fileName 
     */
    public export(type: ExportType, fileName: string, orientation?: PdfPageOrientation): void {
        let exportMap: ExportUtils = new ExportUtils(this);
        exportMap.export(type, fileName, orientation);
    }
    /* tslint:disable:no-string-literal */
    private processFlatJsonData(): void {
        this.dataSource = this.dataSource as Object[];
        let groupPath: string; let childGroupPath: string;
        let orderNames: string[] = []; let process: boolean = false;
        for (let i: number = 0; i < this.levels.length + 1; i++) {
            groupPath = this.levels[i] ? this.levels[i].groupPath : this.leafItemSettings.labelPath;
            let level: Object = new Object();
            level['level'] = i;
            level[groupPath] = [];
            this.levelsOfData.push(level);
            for (let j: number = 0; j < this.dataSource.length; j++) {
                let currentData: Object = {}; let childName: string = '';
                if (this.dataSource[j][groupPath]) {
                    let name: string = this.dataSource[j][groupPath];
                    if (i !== 0) {
                        for (let k: number = 0; k <= i; k++) {
                            let childGroupPath: string = this.levels[k] ? this.levels[k].groupPath : groupPath;
                            childName += (this.dataSource[j][childGroupPath]) + ((k === i) ? '' : '_');
                        }
                    }
                    if (!(orderNames.length > 0 ? orderNames.indexOf(childName ?
                        childName : name) !== -1 : false)) {
                        currentData['name'] = name;
                        currentData['levelOrderName'] = ((childName) ? childName : name) + '';
                        currentData['groupIndex'] = i;
                        currentData['isDrilled'] = false;
                        currentData['groupName'] = groupPath;
                        currentData['data'] = this.dataSource[j];
                        (<Object[]>this.levelsOfData[this.levelsOfData.length - 1][groupPath]).push(currentData);
                        orderNames.push((childName) ? childName : name);
                    }
                }
            }
        }
    }

    public reOrderLevelData(start: number): void {
        let currentName: string;
        let currentPath: string = this.levels[start] ? this.levels[start].groupPath : this.leafItemSettings.labelPath;
        let prevPath: string = this.levels[start - 1].groupPath;
        let currentData: Object[] = this.levelsOfData[start][currentPath] as Object[];
        let previousData: Object[] = this.levelsOfData[start - 1][prevPath] as Object[];
        for (let i: number = 0; i < currentData.length; i++) {
            currentName = currentData[i]['levelOrderName'] as string;
            for (let j: number = 0; j < previousData.length; j++) {
                previousData[j][currentPath] = isNullOrUndefined(previousData[j][currentPath]) ? [] : previousData[j][currentPath];
                if (currentName.indexOf((previousData[j]['levelOrderName'] as string)) !== -1) {
                    if (isNullOrUndefined(currentData[i]['parent'])) {
                        currentData[i]['parent'] = previousData[j];
                    }
                    (<Object[]>previousData[j][currentPath]).push(currentData[i]);
                    break;
                }
            }
        }
        this.findTotalWeight(this.levelsOfData[this.levelsOfData.length - 1][currentPath], 'Child');
        this.levelsOfData.splice(start, 1);
        if ((start - 1) > 0) {
            this.reOrderLevelData(start - 1);
        }
    }

    public findTotalWeight(processData: Object[], type: string): void {
        let totalWeight: number; let childData: Object[];
        let levelName: string; let start: number = 0; let split: string[];
        let groupName: string; let groupObj: Object = new Object();
        for (let i: number = 0; i < processData.length; i++) {
            totalWeight = 0;
            groupName = processData[i]['groupName'];
            split = (processData[i]['levelOrderName'] as string).split('_');
            (<Object[]>this.dataSource).forEach((data: Object) => {
                if (isContainsData(split, processData[i]['levelOrderName'], data, this)) {
                    totalWeight += parseFloat(data[this.weightValuePath]);
                }
            });
            if (type === 'Parent') {
                groupObj[groupName] = processData;
                processData[i]['parent'] = groupObj;
            }
            processData[i]['weight'] = totalWeight;
        }
    }

    /**
     * To unbind event handlers for treemap.
     */
    private unWireEVents(): void {
        EventHandler.remove(this.element, 'click', this.clickOnTreeMap);
        // EventHandler.remove(this.element, 'dblclick', this.doubleClick);
        EventHandler.remove(this.element, Browser.touchStartEvent, this.mouseDownOnTreeMap);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMoveOnTreeMap);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEndOnTreeMap);
        EventHandler.remove(this.element, 'pointerleave mouseleave', this.mouseLeaveOnTreeMap);
        window.removeEventListener('resize', this.resizeOnTreeMap);
    }

    /**
     * To bind event handlers for treemap.
     */
    private wireEVents(): void {
        EventHandler.add(this.element, 'click', this.clickOnTreeMap, this);
        //EventHandler.add(this.element, 'dblclick', this.doubleClick, this);
        EventHandler.add(this.element, Browser.touchStartEvent, this.mouseDownOnTreeMap, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMoveOnTreeMap, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEndOnTreeMap, this);
        EventHandler.add(this.element, 'pointerleave mouseleave', this.mouseLeaveOnTreeMap, this);
        window.addEventListener('resize', this.resizeOnTreeMap.bind(this));
    }

    /**
     * Method to set culture for maps
     */
    private setCulture(): void {
        this.intl = new Internationalization();
    }

    /**
     * To add tab index for treemap element
     */
    private addTabIndex(): void {
        this.element.setAttribute('aria-label', this.description || 'TreeMap Element');
        this.element.setAttribute('tabindex', this.tabIndex.toString());
    }

    /**
     * To handle the window resize event on treemap.
     */
    public resizeOnTreeMap(e: Event): void {
        let args: IResizeEventArgs = {
            name: resize,
            cancel: false,
            previousSize: this.availableSize,
            currentSize: new Size(0, 0),
            treemap: this
        };

        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-treemap')) {
            this.resizeTo = setTimeout(
                (): void => {
                    this.unWireEVents();
                    this.createSvg();
                    this.refreshing = true;
                    this.wireEVents();
                    args.currentSize = this.availableSize;
                    this.trigger(resize, args);
                    this.render();
                },
                500);
        }
    }

    public clickOnTreeMap(e: PointerEvent): void {
        let targetEle: Element = <Element>e.target;
        let targetId: string = targetEle.id;
        let eventArgs: IItemClickEventArgs;
        let itemIndex: number;
        let clickArgs: IClickEventArgs = { cancel: false, name: click, treemap: this, mouseEvent: e };
        this.trigger(click, clickArgs);
        if (targetId.indexOf('_Item_Index') > -1) {
            e.preventDefault();
            itemIndex = parseFloat(targetId.split('_')[6]);
            eventArgs = { cancel: false, name: itemClick, treemap: this, item: this.layout.renderItems[itemIndex], mouseEvent: e };
            this.trigger(itemClick, eventArgs);
        }
    }

    /* tslint:disable-next-line:max-func-body-length */
    public mouseDownOnTreeMap(e: PointerEvent): void {
        let targetEle: Element = <Element>e.target;
        let startEvent: IDrillStartEventArgs; let endEvent: IDrillEndEventArgs;
        let targetId: string = targetEle.id; let totalRect: Rect;
        let index: number; let newDrillItem: Object = new Object();
        let item: Object; let process: boolean = true;
        let layoutID: string = this.element.id + '_TreeMap_' + this.layoutType + '_Layout';
        if (targetId.indexOf('_Item_Index') > -1 && this.enableDrillDown) {
            e.preventDefault();
            index = parseFloat(targetId.split('_')[6]);
            item = this.layout.renderItems[index];
            if (this.levels.length !== 0 && !item['isLeafItem'] && findChildren(item)['values'] &&
                findChildren(item)['values'].length > 0) {
                if (this.drilledItems.length > 0) {
                    for (let i: number = 0; i < this.drilledItems.length; i++) {
                        if (item['levelOrderName'] === this.drilledItems[i]['name']) {
                            if (item['groupIndex'] === 0 && item['parent'][item['groupName']] instanceof Array) {
                                item['isDrilled'] = !(item['isDrilled']);
                                if (!item['isDrilled']) {
                                    newDrillItem = item['parent'];
                                } else {
                                    newDrillItem[item['groupName']] = [item];
                                }
                            } else {
                                item['isDrilled'] = false;
                                item['parent']['isDrilled'] = true;
                                item = item['parent'];
                                newDrillItem[item['groupName']] = [item];
                            }
                            this.drilledItems.splice(i, 1);
                            i -= 1;
                            break;
                        } else if (i === this.drilledItems.length - 1) {
                            item['isDrilled'] = true;
                            newDrillItem[item['groupName']] = [item];
                        }
                    }
                } else {
                    item['isDrilled'] = true;
                    newDrillItem[item['groupName']] = [item];
                }
                startEvent = { cancel: false, name: drillStart, treemap: this, item: newDrillItem, element: targetEle };
                this.trigger(drillStart, startEvent);
                if (!startEvent.cancel) {
                    if (document.getElementById(layoutID)) {
                        document.getElementById(layoutID).remove();
                    }
                    totalRect = extend({}, this.areaRect, totalRect, true) as Rect;
                    this.layout.calculateLayoutItems(newDrillItem, totalRect);
                    this.layout.renderLayoutItems(newDrillItem);
                }
                endEvent = { cancel: false, name: drillEnd, treemap: this, renderItems: this.layout.renderItems };
                this.trigger(drillEnd, endEvent);
                if (process) {
                    this.drilledItems.push({ name: item['levelOrderName'], data: item });
                }
            }
        }
        this.notify(Browser.touchStartEvent, e);
    }

    public mouseMoveOnTreeMap(e: PointerEvent): void {
        let targetEle: Element = <Element>e.target;
        let targetId: string = targetEle.id;
        let eventArgs: IItemMoveEventArgs;
        let item: Object;
        let moveArgs: IMouseMoveEventArgs = { cancel: false, name: mouseMove, treemap: this, mouseEvent: e };
        this.trigger(mouseMove, moveArgs);
        let childItems: object[];
        if (targetId.indexOf('_Item_Index') > -1) {
            item = this.layout.renderItems[parseFloat(targetId.split('_')[6])];
            childItems = findChildren(item)['values'] as Object[];
            this.element.style.cursor = (!item['isLeafItem'] && childItems && childItems.length > 0 && this.enableDrillDown) ?
                'pointer' : 'auto';
            eventArgs = { cancel: false, name: itemMove, treemap: this, item: item, mouseEvent: e };
            this.trigger(itemMove, eventArgs);
        }
        this.notify(Browser.touchMoveEvent, e);
    }

    public mouseEndOnTreeMap(e: PointerEvent): void {
        this.notify(Browser.touchEndEvent, e);
    }

    public mouseLeaveOnTreeMap(e: PointerEvent): void {
        if (this.treeMapTooltipModule) {
            this.treeMapTooltipModule.removeTooltip();
        }
        if (this.treeMapLegendModule) {
            this.treeMapLegendModule.removeInteractivePointer();
        }
        removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', this);
    }

    /**
     * To provide the array of modules needed for maps rendering
     * @return {ModuleDeclaration[]}
     * @private 
     */
    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.tooltipSettings.visible) {
            modules.push({
                member: 'treeMapTooltip',
                args: [this]
            });
        }
        if (this.highlightSettings.enable) {
            modules.push({
                member: 'treeMapHighlight',
                args: [this]
            });
        }
        if (this.selectionSettings.enable) {
            modules.push({
                member: 'treeMapSelection',
                args: [this]
            });
        }
        if (this.legendSettings.visible) {
            modules.push({
                member: 'treeMapLegend',
                args: [this]
            });
        }
        return modules;
    }


    public onPropertyChanged(newProp: TreeMapModel, oldProp: TreeMapModel): void {
        let render: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'background':
                    this.renderBorder();
                    break;
                case 'height':
                case 'width':
                    render = true;
                    break;
            }
        }
        if (render) {
            this.createSvg();
            this.render();
        }
    }

    /**
     * Get component name
     */
    public getModuleName(): string {
        return 'treemap';
    }

    /**
     * To destroy the treemap control.
     */
    public destroy(): void {
        this.unWireEVents();
        super.destroy();
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    public getPersistData(): string {
        return '';
    }
}