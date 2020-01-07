/**
 * Tree Map Components
 */

import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, extend, Ajax, isBlazor } from '@syncfusion/ej2-base';
import { Complex, Collection, ModuleDeclaration, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { Event, EmitType, Internationalization } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { isNullOrUndefined, createElement, EventHandler, Browser, remove } from '@syncfusion/ej2-base';
import { BorderModel, TitleSettingsModel, MarginModel, LevelSettingsModel, FontModel, } from './model/base-model';
import { LeafItemSettingsModel, TooltipSettingsModel, LegendSettingsModel, InitialDrillSettingsModel } from './model/base-model';
import { HighlightSettingsModel, SelectionSettingsModel } from './model/base-model';
import { Border, Margin, TitleSettings, LegendSettings, InitialDrillSettings } from './model/base';
import { SelectionSettings, TooltipSettings, LevelSettings, LeafItemSettings, HighlightSettings, } from './model/base';
import { TreeMapModel } from './treemap-model';
import { LayoutMode, TreeMapTheme, RenderingMode } from './utils/enum';
import { ILoadEventArgs, ILoadedEventArgs, IPrintEventArgs } from '../treemap/model/interface';
import { ILegendItemRenderingEventArgs, ILegendRenderingEventArgs, IItemDataEventArgs } from '../treemap/model/interface';
import { IItemRenderingEventArgs, IResizeEventArgs, IDoubleClickEventArgs, IRightClickEventArgs } from '../treemap/model/interface';
import { IItemClickEventArgs, IItemMoveEventArgs, IClickEventArgs, IMouseMoveEventArgs } from '../treemap/model/interface';
import { IDrillStartEventArgs, IItemSelectedEventArgs, ITreeMapTooltipRenderEventArgs } from '../treemap/model/interface';
import { IItemHighlightEventArgs, IDrillEndEventArgs, IThemeStyle } from '../treemap/model/interface';
import { Size, stringToNumber, RectOption, Rect, textTrim, measureText, findChildren } from '../treemap/utils/helper';
import { removeClassNames, removeShape } from '../treemap/utils/helper';
import { findPosition, Location, TextOption, renderTextElement, isContainsData, TreeMapAjax } from '../treemap/utils/helper';
import { load, loaded, itemSelected, drillStart, drillEnd } from '../treemap/model/constants';
import { itemClick, itemMove, click, mouseMove, resize, doubleClick, rightClick } from '../treemap/model/constants';
import { LayoutPanel } from './layout/render-panel';
import { TreeMapTooltip } from './user-interaction/tooltip';
import { ExportUtils } from '../treemap/utils/export';
import { ExportType } from '../treemap/utils/enum';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { TreeMapHighlight, TreeMapSelection } from './user-interaction/highlight-selection';
import { TreeMapLegend } from './layout/legend';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { getThemeStyle } from './model/theme';
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
     * @isGenericType true
     * @isObservable true
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
     * Specifies the colorValuePath from dataSource
     */
    @Property(null)
    public colorValuePath: string;
    /**
     * Specifies the palette colors.
     */
    @Property([])
    public palette: string[];
    /**
     * Specifies the rendering of layout of the treemap items.
     * @default TopLeftBottomRight
     */
    @Property('TopLeftBottomRight')
    public renderDirection: RenderingMode;
    /**
     * To enable or disable the drillDown.
     */
    @Property(false)
    public enableDrillDown: boolean;
    /**
     * To render the text from right to left.
     */
    @Property(false)
    public enableBreadcrumb: boolean;
    /**
     * To add the breadCrumb connector.
     */
    @Property(' - ')
    public breadcrumbConnector: string;
    /**
     * To control the drillDown view.
     */
    @Property(false)
    public drillDownView: boolean;
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
     * @blazorProperty 'OnPrint'
     */
    @Event()
    public beforePrint: EmitType<IPrintEventArgs>;
    /**
     * Triggers after treemap rendered.
     * @event
     * @blazorProperty 'Loaded'
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;
    /**
     * Triggers before item rendering.
     * @event
     * @blazorProperty 'ItemRendering'
     */
    @Event()
    public itemRendering: EmitType<IItemRenderingEventArgs>;
    /**
     * Triggers the drillDown start.
     * @event
     * @blazorProperty 'OnDrillStart'
     */
    @Event()
    public drillStart: EmitType<IDrillStartEventArgs>;
    /**
     * Triggers the drillDown end.
     * @event
     * @blazorProperty 'DrillCompleted'
     */
    @Event()
    public drillEnd: EmitType<IDrillEndEventArgs>;
    /**
     * Triggers the item selected.
     * @event
     * @blazorProperty 'ItemSelected'
     */
    @Event()
    public itemSelected: EmitType<IItemSelectedEventArgs>;
    /**
     * Triggers the item highlight.
     * @event
     * @blazorProperty 'ItemHighlighted'
     */
    @Event()
    public itemHighlight: EmitType<IItemHighlightEventArgs>;
    /**
     * Triggers the tooltip rendering.
     * @event
     * @blazorProperty 'TooltipRendering'
     * @blazorType ITreeMapTooltipArgs
     */
    @Event()
    public tooltipRendering: EmitType<ITreeMapTooltipRenderEventArgs>;
    /**
     * Triggers the item click.
     * @event
     * @blazorProperty 'OnItemClick'
     */
    @Event()
    public itemClick: EmitType<IItemClickEventArgs>;
    /**
     * Triggers the item move.
     * @event
     * @blazorProperty 'OnItemMove'
     */
    @Event()
    public itemMove: EmitType<IItemMoveEventArgs>;
    /**
     * Triggers the click event.
     * @event
     * @blazorProperty 'OnClick'
     */
    @Event()
    public click: EmitType<IItemClickEventArgs>;
    /**
     * Triggers on double clicking the maps.
     * @event
     * @blazorProperty 'OnDoubleClick'
     */
    @Event()
    public doubleClick: EmitType<IDoubleClickEventArgs>;
    /**
     * Triggers on right clicking the maps.
     * @event
     * @blazorProperty 'OnRightClick'
     */
    @Event()
    public rightClick: EmitType<IMouseMoveEventArgs>;
    /**
     * Triggers the mouse move event.
     * @event
     * @blazorProperty 'OnMouseMove'
     */
    @Event()
    public mouseMove: EmitType<IMouseMoveEventArgs>;
    /**
     * Triggers the resize event.
     * @event
     * @blazorProperty 'Resizing'
     */
    @Event()
    public resize: EmitType<IResizeEventArgs>;
    /**
     * Triggers the legend item rendering.
     * @event
     * @blazorProperty 'LegendItemRendering'
     */
    @Event()
    public legendItemRendering: EmitType<ILegendItemRenderingEventArgs>;
    /**
     * Triggers the legend rendering event.
     * @event
     * @deprecated
     * @blazorProperty 'LegendRendering'
     */
    @Event()
    public legendRendering: EmitType<ILegendRenderingEventArgs>;

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
    /**
     * @private
     */
    public themeStyle: IThemeStyle;
    /**
     * @private
     * Stores the legend bounds.
     */
    public totalRect: Rect;
    /** @private */
    public layout: LayoutPanel;
    /** @private */
    public orientation: string = 'Horizontal';
    /** @private */
    public drilledItems: Object[] = [];
    /** @private */
    public drilledLegendItems: Object;
    /** @private */
    public currentLevel: number;
    /** @private */
    public isHierarchicalData: boolean = false;
    /** @private */
    private resizeTo: number;
    /** @private */
    private mouseDown: boolean;
    /** @private */
    private drillMouseMove: boolean;
    /** @private */
    public doubleTapTimer: Object;
    /** @private */
    public isBlazor: boolean;

    /**s
     * Constructor for TreeMap component.
     */

    constructor(options?: TreeMapModel, element?: string | HTMLElement) {
        super(options, element);
    }

    protected preRender(): void {
        this.isBlazor = isBlazor();

        this.trigger(load, { treemap: this.isBlazor ? null : this }, () => {
            this.initPrivateVariable();
            this.unWireEVents();
            this.createSvg();
            this.wireEVents();
            this.setCulture();
        });

    }

    protected render(): void {
        LevelsData.levelsData = null;
        LevelsData.defaultLevelsData = null;
        LevelsData.hierarchyData = null;
        this.createSecondaryElement();
        this.addTabIndex();
        this.themeStyle = getThemeStyle(this.theme);
        this.renderBorder();
        this.renderTitle(this.titleSettings, 'title', null, null);
        if (!isNullOrUndefined(LevelsData.levelsData)) {
            LevelsData.defaultLevelsData = LevelsData.levelsData;
        }
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

        this.trigger(loaded, { treemap: this.isBlazor ? null : this });

        this.renderComplete();
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
        if (this.leafItemSettings.labelTemplate) {
            resetBlazorTemplate(this.element.id + '_LabelTemplate', 'LabelTemplate');
        }
        for (let i: number = 0; i < this.levels.length; i++) {
            if (this.levels[i].headerTemplate) {
                resetBlazorTemplate(this.element.id + '_HeaderTemplate', 'HeaderTemplate');
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
        if (this.element.id === '') {
            let collection: number = document.getElementsByClassName('e-treemap').length;
            this.element.id = 'treemap_control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);

        this.layout = new LayoutPanel(this);

    }

    private createSecondaryElement(): void {
        let secondaryEle: Element = document.getElementById(this.element.id + '_Secondary_Element');
        if (secondaryEle && secondaryEle.childElementCount > 0) {
            secondaryEle.parentNode.removeChild(secondaryEle);
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
        let borderElement: Element = this.svgObject.querySelector('#' + this.element.id + '_TreeMap_Border');
        if ((this.border.width > 0 || (this.background || this.themeStyle.backgroundColor)) && isNullOrUndefined(borderElement)) {
            let borderRect: RectOption = new RectOption(
                this.element.id + '_TreeMap_Border', this.background || this.themeStyle.backgroundColor, this.border, 1,
                new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(this.renderer.drawRectangle(borderRect) as SVGRectElement);
        } else if (borderElement) {
            borderElement.setAttribute('fill', this.background || this.themeStyle.backgroundColor);
        }
    }

    private renderTitle(title: TitleSettingsModel, type: string, bounds: Rect, groupEle: Element): void {
        let style: FontModel = title.textStyle;
        let height: number; let titlePadding: number = 10;
        let width: number = (this.availableSize.width - this.margin.right - this.margin.left);
        title.textStyle.fontFamily = this.themeStyle.fontFamily || title.textStyle.fontFamily;
        title.textStyle.size = this.themeStyle.fontSize || title.textStyle.size;
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
            let element: Element = renderTextElement(
                options, style, style.color || (type === 'title' ? this.themeStyle.titleFontColor : this.themeStyle.subTitleFontColor),
                groupEle
            );
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
            LevelsData.levelsData = [];
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
                LevelsData.levelsData.push(data);
            } else {
                if (this.isHierarchicalData) {
                    LevelsData.hierarchyData = [];
                    LevelsData.hierarchyData = extend([], this.dataSource, LevelsData.hierarchyData, true) as Object[];
                    for (let i: number = 0; i < LevelsData.hierarchyData.length; i++) {
                        this.processHierarchicalData(LevelsData.hierarchyData[i], i);
                    }
                    LevelsData.levelsData = LevelsData.hierarchyData;
                } else {
                    this.processFlatJsonData();
                    if (LevelsData.levelsData.length > 1) {
                        this.reOrderLevelData(LevelsData.levelsData.length - 1);
                    }
                }
                path = this.levels[0].groupPath;
            }
            if (!this.isHierarchicalData) {
                this.findTotalWeight(LevelsData.levelsData[0][path], 'Parent');
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
                    data['levelOrderName'] + '#' + childData[j]['name']) + '';
                let childItemLevel: string = childData[j]['levelOrderName']; let childLevel: number;
                if (childItemLevel.search('#') > 0) {
                    childLevel = childItemLevel.split('#').length - 1;
                }
                childData[j]['groupIndex'] = isNullOrUndefined(levelIndex) ? childLevel === this.levels.length
                    ? this.levels.length : childLevel : levelIndex;
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
        if (dataCount === LevelsData.hierarchyData.length - 1) {
            let mainData: Object[] = LevelsData.hierarchyData[0][this.levels[0].groupPath];
            for (let k: number = 0; k < LevelsData.hierarchyData.length; k++) {
                childData = findChildren(LevelsData.hierarchyData[k])['values'];
                if (k !== 0 && childData) {
                    childData.forEach((currentData: Object) => { mainData.push(currentData); });
                    LevelsData.hierarchyData.splice(k, 1);
                    k -= 1;
                }
            }
            mainData = LevelsData.hierarchyData[0][this.levels[0].groupPath];
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
            LevelsData.levelsData.push(level);
            for (let j: number = 0; j < this.dataSource.length; j++) {
                let currentData: Object = {}; let childName: string = '';
                if (this.dataSource[j][groupPath]) {
                    let name: string = this.dataSource[j][groupPath];
                    if (i !== 0) {
                        for (let k: number = 0; k <= i; k++) {
                            let childGroupPath: string = this.levels[k] ? this.levels[k].groupPath : groupPath;
                            childName += (this.dataSource[j][childGroupPath]) + ((k === i) ? '' : '#');
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
                        (<Object[]>LevelsData.levelsData[LevelsData.levelsData.length - 1][groupPath]).push(currentData);
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
        let currentData: Object[] = LevelsData.levelsData[start][currentPath] as Object[];
        let previousData: Object[] = LevelsData.levelsData[start - 1][prevPath] as Object[];
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
        this.findTotalWeight(LevelsData.levelsData[LevelsData.levelsData.length - 1][currentPath], 'Child');
        LevelsData.levelsData.splice(start, 1);
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
            split = (processData[i]['levelOrderName'] as string).split('#');
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
        EventHandler.remove(this.element, 'dblclick', this.doubleClickOnTreeMap);
        EventHandler.remove(this.element, 'contextmenu', this.rightClickOnTreeMap);
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
        EventHandler.add(this.element, 'dblclick', this.doubleClickOnTreeMap, this);
        EventHandler.add(this.element, 'contextmenu', this.rightClickOnTreeMap, this);
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
            treemap: this.isBlazor ? null : this
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
                    this.trigger(resize, args, () => {
                        this.render();
                    });
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
        let clickBlazorArgs: IClickEventArgs = { cancel: false, name: click, mouseEvent: e };
        this.trigger(click, this.isBlazor ? clickBlazorArgs : clickArgs);
        if (targetId.indexOf('_Item_Index') > -1) {
            e.preventDefault();
            itemIndex = parseFloat(targetId.split('_')[6]);
            eventArgs = {
                cancel: false, name: itemClick, treemap: this, item: this.layout.renderItems[itemIndex], mouseEvent: e,
                groupIndex: this.layout.renderItems[itemIndex]['groupIndex'], groupName: this.layout.renderItems[itemIndex]['name']
            };
            if (this.isBlazor) {
                let data: IItemDataEventArgs = {
                    groupIndex: eventArgs.item['groupIndex'],
                    groupName: eventArgs.item['groupName'],
                    isDrilled: eventArgs.item['isDrilled'],
                    isLeafItem: eventArgs.item['isLeafItem'],
                    itemArea: eventArgs.item['itemArea'],
                    levelOrderName: eventArgs.item['levelOrderName'],
                    name: eventArgs.item['name'],
                    options: eventArgs.item['options'],
                    rect: eventArgs.item['rect']
                };
                eventArgs.item = data;
                const {treemap, ...blazorEventArgs} : IItemClickEventArgs = eventArgs;
                eventArgs = blazorEventArgs;
            }
            this.trigger(itemClick, eventArgs);
        }
        let end: number = new Date().getMilliseconds();
        let doubleTapTimer1: number;
        if (!isNullOrUndefined(this.doubleClick)) {
            if (!isNullOrUndefined(doubleTapTimer1) && end - doubleTapTimer1 < 500) {
                this.doubleClickOnTreeMap(e);
            }
            doubleTapTimer1 = end;
        }

    }

    public doubleClickOnTreeMap(e: PointerEvent): void {
        let doubleClickArgs: IDoubleClickEventArgs = { cancel: false, name: doubleClick, treemap: this, mouseEvent: e };
        let doubleClickBlazorArgs: IDoubleClickEventArgs = { cancel: false, name: doubleClick, mouseEvent: e };
        this.trigger(doubleClick, this.isBlazor ? doubleClickBlazorArgs : doubleClickArgs);
        //this.notify('dblclick', e);
    }

    public rightClickOnTreeMap(e: PointerEvent): void {
        let rightClickArgs: IRightClickEventArgs = { cancel: false, name: rightClick, treemap: this, mouseEvent: e };
        let rightClickBlazorArgs: IRightClickEventArgs = { cancel: false, name: rightClick, mouseEvent: e };
        this.trigger(rightClick, this.isBlazor ? rightClickBlazorArgs : rightClickArgs);
    }


    /* tslint:disable-next-line:max-func-body-length */
    public mouseDownOnTreeMap(e: PointerEvent): void {
        if ((<Element>e.target).id.indexOf('_Item_Index') > -1) {
            this.mouseDown = true;
        }
        this.notify(Browser.touchStartEvent, e);
    }

    public mouseMoveOnTreeMap(e: PointerEvent): void {
        let targetEle: Element = <Element>e.target;
        let targetId: string = targetEle.id;
        let eventArgs: IItemMoveEventArgs;
        let item: Object;
        let moveArgs: IMouseMoveEventArgs = { cancel: false, name: mouseMove, treemap: this, mouseEvent: e };
        let moveBlazorArgs: IMouseMoveEventArgs = { cancel: false, name: mouseMove, mouseEvent: e };
        this.trigger(mouseMove, this.isBlazor ? moveBlazorArgs : moveArgs);
        let childItems: object[];
        if (targetId.indexOf('_Item_Index') > -1) {
            item = this.layout.renderItems[parseFloat(targetId.split('_')[6])];
            childItems = findChildren(item)['values'] as Object[];
            this.element.style.cursor = (!item['isLeafItem'] && childItems && childItems.length > 0 && this.enableDrillDown) ?
                'pointer' : 'auto';
            eventArgs = { cancel: false, name: itemMove, treemap: this, item: item, mouseEvent: e };
            if (this.isBlazor) {
                let data: IItemDataEventArgs = {
                    isLeafItem: eventArgs.item['isLeafItem'],
                    groupIndex: eventArgs.item['groupIndex'],
                    groupName: eventArgs.item['groupName'],
                    isDrilled: eventArgs.item['isDrilled'],
                    itemArea: eventArgs.item['itemArea'],
                    levelOrderName: eventArgs.item['levelOrderName'],
                    name: eventArgs.item['name'],
                    rect: eventArgs.item['rect'],
                    options: eventArgs.item['options']
                };
                eventArgs.item = data;
                const {treemap, ...blazorEventArgs} : IItemMoveEventArgs = eventArgs;
                eventArgs = blazorEventArgs;
            }
            this.trigger(itemMove, eventArgs);
        }
        this.notify(Browser.touchMoveEvent, e);
    }

    public calculateSelectedTextLevels(labelText: String, item: Object): Object {
        //to find the levels by clicking the particular text both for drillDownView as true / false.
        let drillLevel: number; let k: string; let text: String;
        let levelLabels: string = item['levelOrderName'];
        let levelText: string[] = levelLabels.split('#');
        for (k of Object.keys(levelText)) {
            if (levelText[k] === labelText) {
                drillLevel = parseInt(k, 10);
                text = labelText;
            }
        }
        return { drillLevel: drillLevel, currentLevelLabel: text, levelText: levelText };
    }

    public calculatePreviousLevelChildItems(labelText: String, drillLevelValues: Object, item: Object, directLevel: boolean): boolean {
        //By clicking any child items drilldown to the particular level.
        //At the time store all the previous drilled level items in drilledItems
        // This condition satisfies while drilldown View is set as false and the text contains '[+]'
        let text: string; let p: number = 0; let levelItems: string; let text1: string;
        let drillTextLevel: number = this.layout.renderItems[0]['levelOrderName'].split('#').length;
        for (let h: number = 0; h < drillTextLevel; h++) {
            text1 = h === 0 ? drillLevelValues['levelText'][h] : text1 + '#' + drillLevelValues['levelText'][h];
        }
        p = drillTextLevel > 1 ? drillTextLevel : p;
        for (levelItems of Object['values'](this.layout.renderItems)) {
            let drillLevelText: string = levelItems['levelOrderName'].split('#');
            if (drillLevelText[0] === drillLevelValues['levelText'][0]) {
                text = p === 0 ? isNullOrUndefined(text1) ? text1 : drillLevelValues['levelText'][p] :
                    directLevel ? text1 : text1 + '#' + drillLevelValues['levelText'][p];
                if (text === levelItems['levelOrderName']) {
                    this.drilledItems.push({ name: levelItems['levelOrderName'], data: levelItems });
                    p++;
                    directLevel = true;
                    if (p <= item['groupIndex']) {
                        text = text + '#' + drillLevelValues['levelText'][p];
                        text1 = text;
                    }
                }
            }
        }
        return directLevel;
    }

    public compareSelectedLabelWithDrillDownItems(drillLevelValues: Object, item: Object, i: number): Object {
        let drillLevelChild: Object; let newDrillItem: Object = new Object();
        let b: number = drillLevelValues['drillLevel'] + 1;
        if (b === this.drilledItems[i]['data']['groupIndex']) {
            drillLevelChild = this.drilledItems[i]['data']['parent'];
            drillLevelChild['isDrilled'] = true;
            newDrillItem[drillLevelChild[this.drilledItems[i]['data']['groupName']]]
                = [drillLevelChild];
            // to remove all the items after matched drilled items
            this.drilledItems.splice(i, this.drilledItems.length);
        } else if (drillLevelValues['drillLevel'] === (this.drilledItems.length - 1)
            || drillLevelValues['drillLevel'] === item['groupIndex']) {
            newDrillItem[item['groupName']] = [item];
        }
        return newDrillItem;
    }

    /* tslint:disable-next-line:max-func-body-length */
    public mouseEndOnTreeMap(e: PointerEvent): void {
        let targetEle: Element = <Element>e.target; let targetId: string = targetEle.id; let totalRect: Rect;
        let startEvent: IDrillStartEventArgs; let endEvent: IDrillEndEventArgs; let directLevel: boolean = false;
        let index: number; let newDrillItem: Object = new Object(); let item: Object; let process: boolean = true;
        let layoutID: string = this.element.id + '_TreeMap_' + this.layoutType + '_Layout'; let drillLevel: number;
        let templateID: string = this.element.id + '_Label_Template_Group'; let drillLevelValues: object;
        let endBlazorEvent: IDrillEndEventArgs;
        if (targetId.indexOf('_Item_Index') > -1 && this.enableDrillDown && !this.drillMouseMove) {
            e.preventDefault();
            index = parseFloat(targetId.split('_')[6]); item = this.layout.renderItems[index]; let labelText: string = targetEle.innerHTML;
            if (this.enableBreadcrumb) {
                drillLevelValues = this.calculateSelectedTextLevels(labelText, item);
                drillLevel = drillLevelValues['drillLevel'];
                if (!this.drillDownView && labelText.search('[+]') !== -1) {
                    directLevel = this.calculatePreviousLevelChildItems(labelText, drillLevelValues, item, directLevel);
                }
            }
            if (this.levels.length !== 0 && !item['isLeafItem'] && findChildren(item)['values'] &&
                findChildren(item)['values'].length > 0) {
                if (this.drilledItems.length > 0) {
                    item = directLevel ? this.drilledItems[this.drilledItems.length - 1]['data'] : item;
                    for (let i: number = 0; i < this.drilledItems.length; i++) {
                        if (!isNullOrUndefined(drillLevel)) {  //Compare the selected text level with drilled items
                            let drillLength: number = this.drilledItems.length;
                            newDrillItem = this.compareSelectedLabelWithDrillDownItems(drillLevelValues, item, i);
                            if (drillLength !== this.drilledItems.length) {
                                i -= 1; break;
                            }
                        } //when clicking the levels drill back to the previous level process takes place
                        if (item['levelOrderName'] === this.drilledItems[i]['name'] && !directLevel && isNullOrUndefined(drillLevel)) {
                            if (item['groupIndex'] === 0 && item['parent'][item['groupName']] instanceof Array) {
                                item['isDrilled'] = !(item['isDrilled']);
                                if (!item['isDrilled']) {
                                    newDrillItem = item['parent'];
                                } else {
                                    newDrillItem[item['groupName']] = [item];
                                }
                            } else {
                                item['isDrilled'] = false; item['parent']['isDrilled'] = true; item = item['parent'];
                                newDrillItem[item['groupName']] = [item];
                            }
                            this.drilledItems.splice(i, 1);
                            i -= 1; break;
                        } else if (i === this.drilledItems.length - 1 && isNullOrUndefined(drillLevel)) {
                            item['isDrilled'] = true; // click the items move to next level.
                            newDrillItem[item['groupName']] = [item];
                        }
                    }
                } else {
                    item['isDrilled'] = true;
                    newDrillItem[item['groupName']] = [item];
                }
                startEvent = {
                    cancel: false, name: drillStart, treemap: this, item: newDrillItem, element: targetEle,
                    groupIndex: this.enableBreadcrumb && this.drilledItems.length !== 0 && !isNullOrUndefined(drillLevel) ?
                        this.drilledItems[this.drilledItems.length - 1]['data']['groupIndex'] : item['groupIndex'],
                    groupName: this.enableBreadcrumb && this.drilledItems.length !== 0 && !isNullOrUndefined(drillLevel) ?
                        this.drilledItems[this.drilledItems.length - 1]['data']['name'] : item['name'],
                    rightClick: e.which === 3 ? true : false, childItems: null
                };
                if (this.isBlazor) {
                    const {treemap, ...blazorEventArgs} : IDrillStartEventArgs = startEvent;
                    startEvent = blazorEventArgs;
                }
                this.trigger(drillStart, startEvent, (observedArgs: IDrillStartEventArgs) => {
                    this.currentLevel = item['isDrilled'] && isNullOrUndefined(drillLevel) ? item['groupIndex'] :
                        (!isNullOrUndefined(drillLevel) && this.enableBreadcrumb && item['isDrilled']) ? drillLevel : null;
                    if (!observedArgs.cancel) {
                        if (document.getElementById(layoutID)) {
                            let layerElementId: HTMLElement = document.getElementById(layoutID);
                            layerElementId.parentNode.removeChild(layerElementId);
                        }
                        totalRect = extend({}, this.areaRect, totalRect, true) as Rect;
                        if (this.legendSettings.visible && !isNullOrUndefined(this.treeMapLegendModule)) {
                            if (!isNullOrUndefined(newDrillItem)) {
                                this.treeMapLegendModule.legendGroup.textContent = ''; this.treeMapLegendModule.legendGroup = null;
                                this.treeMapLegendModule.widthIncrement = 0; this.treeMapLegendModule.heightIncrement = 0;
                                if (this.enableBreadcrumb && !isNullOrUndefined(drillLevel)) {
                                    this.drilledLegendItems = {
                                        name: this.drilledItems[this.drilledItems.length - 1]['data']['levelOrderName'],
                                        data: this.drilledItems[this.drilledItems.length - 1]['data']
                                    };
                                } else {
                                    this.drilledLegendItems = { name: item['levelOrderName'], data: item };
                                }
                                this.treeMapLegendModule.renderLegend();
                            }
                            totalRect = !isNullOrUndefined(this.totalRect) ? this.totalRect : totalRect;
                        }
                        if (document.getElementById(templateID)) {
                            let drillElementId: HTMLElement = document.getElementById(templateID);
                            drillElementId.parentNode.removeChild(drillElementId);
                        }
                        if (!isNullOrUndefined(observedArgs.childItems) && !observedArgs.cancel) {
                            this.layout.onDemandProcess(observedArgs.childItems);
                        } else {
                            this.layout.calculateLayoutItems(newDrillItem, totalRect);
                            this.layout.renderLayoutItems(newDrillItem);
                        }
                    }
                });
                endEvent = { cancel: false, name: drillEnd, treemap: this, renderItems: this.layout.renderItems };
                endBlazorEvent = { cancel: false, name: drillEnd, renderItems: this.layout.renderItems };
                this.trigger(drillEnd, this.isBlazor ? endBlazorEvent : endEvent);
                if (process) {
                    if (!directLevel && isNullOrUndefined(drillLevel)) {
                        this.drilledItems.push({ name: item['levelOrderName'], data: item });
                    }
                }
            }
        }
        this.mouseDown = false;
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
        if (this.treeMapHighlightModule) {
            removeShape(this.treeMapHighlightModule.shapeHighlightCollection, 'highlight');
            this.treeMapHighlightModule.highLightId = '';
        }
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

    /**
     * Called internally if any of the property value changed.
     * @private
     */
    public onPropertyChanged(newProp: TreeMapModel, oldProp: TreeMapModel): void {
        let render: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'background':
                    this.renderBorder();
                    break;
                case 'height':
                case 'width':
                case 'layoutType':
                case 'levels':
                case 'drillDownView':
                case 'renderDirection':
                case 'leafItemSettings':
                case 'legendSettings':
                case 'dataSource':
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

 /**
  * @private
  */
export class LevelsData {
    public static levelsData : object[];
    public static defaultLevelsData : object[];
    public static hierarchyData : object[];
}