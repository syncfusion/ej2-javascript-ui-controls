/* eslint-disable @typescript-eslint/ban-types */
import { Component, Property, Complex, CollectionFactory, ChildProperty, Event } from '@syncfusion/ej2-base';
import { isBlazor, BlazorDragEventArgs } from '@syncfusion/ej2-base';
import { Browser, EventHandler, Draggable, INotifyPropertyChanged, Collection, ModuleDeclaration } from '@syncfusion/ej2-base';
import { remove, EmitType } from '@syncfusion/ej2-base';
import { Accordion, AccordionItemModel, ExpandMode, ExpandEventArgs } from '@syncfusion/ej2-navigations';
import { NodeModel, ConnectorModel, Node, Connector, Shape, Size } from '../diagram/index';
import { Transform, SwimLane, PathModel, IPaletteExpandArgs } from '../diagram/index';
import { DiagramRenderer, Container, StackPanel, Margin, BpmnDiagrams, ShapeStyleModel, TextStyleModel } from '../diagram/index';
import { DiagramElement, TextElement, MarginModel, Canvas, PointModel, IElement } from '../diagram/index';
import { SymbolPaletteModel, SymbolPreviewModel, PaletteModel, SymbolDragSizeModel } from './symbol-palette-model';
import { TextWrap, TextOverflow, IPaletteSelectionChangeArgs, HeaderModel, SwimLaneModel } from '../diagram/index';
import { SvgRenderer } from '../diagram/rendering/svg-renderer';
import { parentsUntil, createSvgElement, createHtmlElement, createMeasureElements } from '../diagram/utility/dom-util';
import { removeElementsByClass, applyStyleAgainstCsp } from '../diagram/utility/dom-util';
import { scaleElement, arrangeChild, groupHasType, setUMLActivityDefaults, updateDefaultValues } from '../diagram/utility/diagram-util';
import { getFunction, randomId, cloneObject } from '../diagram/utility/base-util';
import { getOuterBounds } from '../diagram/utility/connector';
import { Point } from '../diagram/primitives/point';
import { CanvasRenderer } from '../diagram/rendering/canvas-renderer';
import { Rect } from '../diagram/primitives/rect';
import { SymbolSizeModel, SymbolPaletteInfoModel } from '../diagram/objects/preview-model';
// eslint-disable-next-line
let getObjectType: Function = (obj: Object): Object => {
    const conn: Connector = obj as Connector;
    if (conn.sourcePoint || conn.targetPoint || conn.sourceID || conn.targetID
        || conn.sourcePortID || conn.targetPortID || conn.sourceDecorator || conn.targetDecorator) {
        return Connector;
    }
    if ((obj as Node).shape && ((obj as Node).shape instanceof Shape || (obj as Node).shape.type)) {
        return Node;
    }
    return Node;
};

/**
 * A palette allows to display a group of related symbols and it textually annotates the group with its header.
 */
export class Palette extends ChildProperty<Palette> {
    /**
     * Defines the unique id of a symbol group
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Sets the height of the symbol group
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Sets whether the palette items to be expanded or not
     *
     * @default true
     */
    @Property(true)
    public expanded: boolean;

    /**
     * Defines the content of the symbol group
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Defines the title of the symbol group
     *
     * @default ''
     */
    @Property('')
    public title: string;

    /**
     * Defines the collection of predefined symbols
     *
     * @aspType object
     */
    @CollectionFactory(getObjectType)
    public symbols: (NodeModel | ConnectorModel)[];

    /** @private */
    public isInteraction: boolean;

    // eslint-disable-next-line
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }
}

/**
 * customize the drag size of the individual palette items.
 */
export class SymbolDragSize extends ChildProperty<SymbolDragSize> {

    /**
     * Sets the drag width of the symbols
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets the drag height of the symbols
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

}

/**
 * customize the preview size and position of the individual palette items.
 */
export class SymbolPreview extends ChildProperty<SymbolPreview> {

    /**
     * Sets the preview width of the symbols
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets the preview height of the symbols
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Defines the distance to be left between the cursor and symbol
     *
     * @default {}
     */
    @Complex<PointModel>({}, Point)
    public offset: PointModel;
}

/**
 * Represents the Symbol Palette Component.
 * ```html
 * <div id="symbolpalette"></div>
 * <script>
 *  var palette = new SymbolPalatte({ allowDrag:true });
 *  palette.appendTo("#symbolpalette");
 * </script>
 * ```
 */
/**
 * The symbol palette control allows to predefine the frequently used nodes and connectors
 * and to drag and drop those nodes/connectors to drawing area
 */
export class SymbolPalette extends Component<HTMLElement> implements INotifyPropertyChanged {

    //public properties

    /**
     * Configures the key, when it pressed the symbol palette will be focused
     *
     * @default 'S'
     */
    @Property('S')
    public accessKey: string;

    /**
     * Defines the width of the symbol palette
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Defines the height of the symbol palette
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;

    /**
     * Defines the collection of symbol groups
     *
     * @default []
     */
    @Collection<PaletteModel>([], Palette)
    public palettes: PaletteModel[];

    /**
     * Defines the size, appearance and description of a symbol
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    /**
     * ```html
     * <div id="symbolpalette"></div>
     *  ```
     * ```typescript
     * let palette: SymbolPalette = new SymbolPalette({
     *   expandMode: 'Multiple',
     *   palettes: [
     *       { id: 'flow', expanded: false, symbols: getFlowShapes(), title: 'Flow Shapes' },
     *   ],
     *   width: '100%', height: '100%', symbolHeight: 50, symbolWidth: 50,
     *   symbolPreview: { height: 100, width: 100 },
     *   enableSearch: true,
     *   getNodeDefaults: setPaletteNodeDefaults,
     *   symbolMargin: { left: 12, right: 12, top: 12, bottom: 12 },
     *   getSymbolInfo: (symbol: NodeModel): SymbolInfo => {
     *       return { fit: true };
     *   }
     * });
     * palette.appendTo('#symbolpalette');
     * export function getFlowShapes(): NodeModel[] {
     *   let flowShapes: NodeModel[] = [
     *       { id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' }, style: { strokeWidth: 2 } },
     *       { id: 'Process', shape: { type: 'Flow', shape: 'Process' }, style: { strokeWidth: 2 } },
     *       { id: 'Decision', shape: { type: 'Flow', shape: 'Decision' }, style: { strokeWidth: 2 } }
     *   ];
     *   return flowShapes;
     * }
     * function setPaletteNodeDefaults(node: NodeModel): void {
     * if (node.id === 'Terminator' || node.id === 'Process') {
     *   node.width = 130;
     *   node.height = 65;
     * } else {
     *   node.width = 50;
     *   node.height = 50;
     * }
     * node.style.strokeColor = '#3A3A3A';
     * }
     * ```
     *
     * @deprecated
     */
    @Property()
    public getSymbolInfo: Function | string;

    /**
     * Defines the size, appearance and description of a symbol
     *
     */
    @Property({ fit: true })
    public symbolInfo: SymbolInfo;

    /**
     * Defines the symbols to be added in search palette
     *
     * @aspDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    @Property()
    public filterSymbols: Function | string;

    /**
     * Defines the symbols to be added in search palette
     *
     */
    @Property()
    public ignoreSymbolsOnSearch: string[];

    /**
     * Defines the content of a symbol
     *
     * @aspDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    @Property()
    public getSymbolTemplate: Function | string;

    /**
     * Defines the width of the symbol
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public symbolWidth: number;

    /**
     * Defines the height of the symbol
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public symbolHeight: number;

    /**
     * Defines the space to be left around a symbol
     *
     * @default {left:10,right:10,top:10,bottom:10}
     */
    @Complex<MarginModel>({ left: 10, right: 10, top: 10, bottom: 10 }, Margin)
    public symbolMargin: MarginModel;

    /**
     * Defines whether the symbols can be dragged from palette or not
     *
     * @default true
     */
    @Property(true)
    public allowDrag: boolean;

    /**
     * Defines the size and position of the symbol preview
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Complex<SymbolPreviewModel>({}, SymbolPreview)
    public symbolPreview: SymbolPreviewModel;

    /**
     * Defines the size of a drop symbol
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Complex<SymbolDragSizeModel>({}, SymbolDragSize)
    public symbolDragSize: SymbolDragSizeModel;

    /**
     * Enables/Disables search option in symbol palette
     *
     * @default false
     */
    @Property(false)
    public enableSearch: boolean;

    /**
     * Enables/Disables animation when the palette header is expanded/collapsed
     *
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Defines how many palettes can be at expanded mode at a time
     *
     * @default 'Multiple'
     * @aspDefaultValueIgnore
     * @isEnumeration true
     */
    @Property('Multiple')
    public expandMode: ExpandMode;

    /**
     * Triggers after the selection changes in the symbol palette
     *
     * @event
     */
    @Event()
    public paletteSelectionChange: EmitType<IPaletteSelectionChangeArgs>;

    /**
     * Triggers when the icon is expanded
     *
     * @event
     */
    @Event()
    public paletteExpanding: EmitType<IPaletteExpandArgs>;

    /**
     * `bpmnModule` is used to add built-in BPMN Shapes to diagrams
     *
     * @private
     */
    public bpmnModule: BpmnDiagrams;

    /**
     * Helps to return the default properties of node
     *
     * @deprecated
     */
    @Property()
    public getNodeDefaults: Function | string;


    /**
     * Helps to return the default properties of node
     *
     */
    @Property()
    public nodeDefaults: NodeModel;


    /**
     * Helps to return the default properties of connector
     *
     * @deprecated
     */
    @Property()
    public getConnectorDefaults: Function | string;

    /**
     * Helps to return the default properties of connectors
     *
     */
    @Property()
    public connectorDefaults: ConnectorModel;

    //private variables

    /** @private */
    public selectedSymbols: NodeModel | ConnectorModel;
    /**   @private  */
    public symbolTable: {} = {};
    /**   @private  */
    public childTable: {} = {};
    private diagramRenderer: DiagramRenderer;
    private svgRenderer: DiagramRenderer;
    private accordionElement: Accordion;
    private highlightedSymbol: HTMLElement;
    private selectedSymbol: NodeModel | ConnectorModel;
    private info: string = 'info';
    private oldObject: string = null;
    private timer: Object;
    private draggable: Draggable;
    private laneTable: {} = {};
    private isExpand: boolean = false;
    private isExpandMode: boolean = false;
    private isMethod: boolean = false;
    private paletteid: number = 88123;
    private checkOnRender: boolean = false;

    //region - protected methods

    /**
     *  Constructor for creating the symbol palette Component
     *
     * @param {SymbolPaletteModel} options The symbol palette model.
     * @param {string | HTMLElement} element The symbol palette element.
     */
    constructor(options?: SymbolPaletteModel, element?: Element) {
        super(options, <HTMLButtonElement | string>element);
        let child: NodeModel;
        let node: NodeModel;
        for (let i: number = 0; this && this.palettes && i < this.palettes.length; i++) {
            for (let j: number = 0; j < this.palettes[i].symbols.length; j++) {
                child = this.palettes[i].symbols[j] as NodeModel;
                node = options.palettes[i].symbols[j] as NodeModel;
                if (child && child.shape.type === 'UmlActivity') {
                    setUMLActivityDefaults(node, child);
                }
                if (this.nodeDefaults || this.connectorDefaults) {
                    updateDefaultValues(child, node, child instanceof Node ? this.nodeDefaults : this.connectorDefaults);
                }
            }
        }
    }


    /**
     * Refreshes the panel when the symbol palette properties are updated\
     *
     * @returns {  void}    Refreshes the panel when the symbol palette properties are updated .\
     * @param {SymbolPaletteModel} newProp - Defines the new values of the changed properties.
     * @param {SymbolPaletteModel} oldProp - Defines the old values of the changed properties.
     */
    // eslint-disable-next-line
    public onPropertyChanged(newProp: SymbolPaletteModel, oldProp: SymbolPaletteModel): void {
        let refresh: boolean = false;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                    this.element.style.width = this.width.toString(); break;
                case 'height':
                    this.element.style.height = this.height.toString(); break;
                case 'symbolPreview':
                    break;
                case 'symbolWidth':
                case 'symbolHeight':
                case 'getSymbolInfo':
                    if ((this as any).isReact) {
                        refresh = false;
                    } else {
                        refresh = true;
                    }
                    break;
                case 'enableSearch':
                    if (newProp.enableSearch && !isBlazor()) {
                        this.createTextbox();
                    } else {
                        const divElement: HTMLElement = document.getElementById(this.element.id + '_search');
                        if (divElement) { divElement.parentNode.removeChild(divElement); }
                    }
                    break;
                case 'palettes':
                    for (const i of Object.keys(newProp.palettes)) {
                        const index: number = Number(i);
                        if (!isBlazor() && !this.accordionElement.items[index]) {
                            this.accordionElement.items[index] = {
                                header: newProp.palettes[index].title || '',
                                expanded: newProp.palettes[index].expanded,
                                iconCss: newProp.palettes[index].iconCss || ''
                            };
                        }
                        if (newProp.palettes[index].height) {
                            const paletteDiv: HTMLElement = document.getElementById((this.palettes[index] as Palette).id + '_content');
                            paletteDiv.style.height = newProp.palettes[index].height + 'px';
                        }
                        if (newProp.palettes[index].iconCss !== undefined) {
                            if (!isBlazor()) {
                                this.accordionElement.items[index].iconCss = newProp.palettes[index].iconCss || '';
                                refresh = true;
                            }
                        }
                        if (newProp.palettes[index].expanded !== undefined && !isBlazor()) {
                            if (!(this.palettes[index] as Palette).isInteraction) {
                                this.accordionElement.items[index].expanded = newProp.palettes[index].expanded;
                                this.isExpand = true;
                            } else {
                                (this.palettes[index] as Palette).isInteraction = false;
                            }
                            if (!this.isExpandMode && !this.isMethod && !this.isExpand) {
                                this.isExpand = true;
                            }
                        }
                        if (isBlazor() && newProp.palettes[index].symbols !== null) { refresh = true; }
                        if (isBlazor() && newProp.palettes[index].symbols === null) {
                            this.updateBlazorProperties(newProp);
                        }
                    }
                    break;
                case 'enableAnimation':
                    if (!isBlazor()) {
                        if (!this.enableAnimation) {
                            this.accordionElement.animation = { expand: { duration: 0 }, collapse: { duration: 0 } };
                        } else {
                            this.accordionElement.animation = { expand: { duration: 400 }, collapse: { duration: 400 } };
                        }
                    }
                    break;
                case 'expandMode':
                    if (!isBlazor()) {
                        this.accordionElement.expandMode = this.expandMode;
                        refresh = true; this.isExpandMode = true;
                    }
                    break;
                case 'allowDrag':
                    this.allowDrag = newProp.allowDrag;
                    if (!this.allowDrag) {

                        this.draggable.helper = (): Function => {
                            return null;
                        };
                    } else {
                        this.initDraggable();
                        this.draggable.helper = this.helper;
                    }
                    break;
            }
        }
        if (refresh) { this.refreshPalettes(); }
        if (this.isExpand && !refresh) {
            this.refresh(); this.isExpand = false;
            for (let p: number = 0; p < this.palettes.length; p++) {
                const paletteElement: string = this.palettes[p].id;
                if (window[paletteElement]) {
                    if (window[paletteElement].length > 1) {
                        window[paletteElement][1].parentNode.removeChild(window[paletteElement][1]);
                        window[paletteElement][1] = null;
                    }
                }
            }
        }
        this.isMethod = false;
    }

    /**
     * updateBlazorProperties method\
     *
     * @returns {void}    updateBlazorProperties method .\
     * @param {SymbolPaletteModel} newProp - provide the scale value.
     *
     * @private
     */
    public updateBlazorProperties(newProp: SymbolPaletteModel): void {
        const blazorInterop: string = 'sfBlazor';
        const blazor: string = 'Blazor';
        if (window && window[blazor]) {

            const palObj: object = { palette: newProp.palettes };

            const obj: object = { 'methodName': 'UpdateBlazorProperties', 'paletteobj': palObj };
            window[blazorInterop].updateBlazorProperties(obj, this);
        }
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string}  Get the properties to be maintained in the persisted state.
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['loaded'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Initializes the values of private members.
     *
     * @returns {void}  Initializes the values of private members.
     * @private
     */
    protected preRender(): void {
        if (this.element.id === '') {
            const collection: number = document.getElementsByClassName('e-symbolpalette').length;
            this.element.id = 'symbolpalette_' + this.paletteid + '_' + collection;
        }
        this.element.style.overflow = 'auto';
        this.element.style.height = this.height.toString();
        this.element.style.width = this.width.toString();
        if (this.enableSearch && !isBlazor()) {
            this.createTextbox();
        }
        //create accordion element
        if (!isBlazor()) {
            const accordionDiv: HTMLElement = createHtmlElement('div', { id: this.element.id + '_container' });
            this.accordionElement = new Accordion({
                expandMode: this.expandMode
            });
            if (!this.enableAnimation) {
                this.accordionElement.animation = { expand: { duration: 0 }, collapse: { duration: 0 } };
            }
            this.accordionElement.created = () => {
                this.checkOnRender = true;
            };
            this.accordionElement.expanded = (args: ExpandEventArgs) => {
                const index: number = this.accordionElement.items.indexOf(args.item);
                const isAllowDatabind: boolean = this.allowServerDataBinding;
                this.allowServerDataBinding = false;
                this.palettes[index].expanded = args.isExpanded;
                (this.palettes[index] as Palette).isInteraction = true;
                this.allowServerDataBinding = isAllowDatabind;
            };
            this.accordionElement.expanding = (args: ExpandEventArgs) => {
                if (this.checkOnRender) {
                    // eslint-disable-next-line
                    const diagramArgs: IPaletteExpandArgs = {
                        element: args.element, content: args.content, index: args.index, cancel: false,
                        isExpanded: args.isExpanded, palette: this.palettes[args.index]
                    };
                    const event: string = 'paletteExpanding';
                    this.trigger(event, diagramArgs);
                    args.cancel = diagramArgs.cancel;
                }
            };
            this.element.appendChild(accordionDiv);
        }
        const measureWindowElement: string = 'measureElement';
        if (window[measureWindowElement]) {
            window[measureWindowElement] = null;
        }
        createMeasureElements();
        this.unWireEvents();
        this.wireEvents();
    }

    /**
     * Renders the rulers.
     *
     * @returns {void}  Renders the rulers.
     * @private
     */
    public render(): void {
        this.diagramRenderer = new DiagramRenderer(this.element.id, new SvgRenderer(), false);
        this.svgRenderer = new DiagramRenderer(this.element.id, new SvgRenderer(), true);
        this.updatePalettes();
        if (!isBlazor()) {
            this.accordionElement.appendTo('#' + this.element.id + '_container');
        }
        this.renderComplete();
        if (isBlazor()) {
            this.element.classList.remove('e-symbolpalette-hidden');
        }
    }

    /**
     * Core method to return the component name.
     *
     * @returns {string}  Core method to return the component name.
     * @private
     */
    public getModuleName(): string {
        return 'SymbolPalette';
    }


    /**
     * To provide the array of modules needed for control rendering.
     *
     * @returns {ModuleDeclaration[]}  To provide the array of modules needed for control rendering .
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {

        const modules: ModuleDeclaration[] = [];

        modules.push({
            member: 'Bpmn',
            args: []
        });
        return modules;
    }

    /**
     *To destroy the ruler
     *
     * @returns {void} To destroy the ruler
     */
    public destroy(): void {
        if (this.allowDrag) {
            this.draggable.destroy();
            this.unWireEvents();
            this.notify('destroy', {});
            super.destroy();
            let content: HTMLElement = document.getElementById(this.element.id + '_container');
            if (content) {
                this.element.removeChild(content);
                const measureElemnt: string = 'measureElement';
                if (window[measureElemnt]) {
                    window[measureElemnt].usageCount -= 1;
                    const measureElementCount: string = 'measureElementCount';
                    window[measureElementCount]--;
                    if (window[measureElementCount] === 0) {
                        window[measureElemnt].parentNode.removeChild(window[measureElemnt]);
                        window[measureElemnt] = null;
                    }
                }
            }
            content = document.getElementById(this.element.id + '_search');
            if (content) {
                content.parentNode.removeChild(content);
            }
            this.element.classList.remove('e-symbolpalette');
        }
    }

    /**
     * Add particular palettes to symbol palette at runtime.\
     *
     * @returns {  void}    Refreshes the ruler when the Ruler properties are updated .\
     * @param { PaletteModel[]} palettes -Defines the collection of palettes to be added.
     */
    public addPalettes(palettes: PaletteModel[]): void {
        let palette: Palette;
        for (let i: number = 0; i < palettes.length; i++) {
            const isEnableServerDatabind: boolean = this.allowServerDataBinding;
            this.isProtectedOnChange = true;
            this.allowServerDataBinding = false;
            palette = new Palette(this, 'palettes', palettes[i], true);
            (this.palettes as Palette[]).push(palette);
            this.initSymbols(palette);
            this.allowServerDataBinding = isEnableServerDatabind;
            this.isProtectedOnChange = false;
            this.renderPalette(palette);
        }
        this.bulkChanges = {};
        if (!isBlazor()) {
            this.accordionElement.refresh();
        }
    }
    /**
     * removePalette method\
     *
     * @returns {void}    removePalette method .\
     * @param {string} paletteId - provide the scale value.
     *
     * @private
     */
    public removePalette(paletteId: string): void {
        for (let i: number = 0; i < this.palettes.length; i++) {
            if (this.palettes[i].id === paletteId) {
                this.palettes.splice(i, 1);
                if (!isBlazor()) {
                    this.accordionElement.items.splice(i, 1);
                }
                break;
            }
        }
    }

    /**
     * Remove particular palettes to symbol palette at runtime \
     *
     * @returns {void}   Remove particular palettes to symbol palette at runtime .\
     * @param {string[]} palettes - provide the scale value.
     */
    public removePalettes(palettes: string[]): void {
        const isEnableServerDatabind: boolean = this.allowServerDataBinding;
        this.allowServerDataBinding = false;
        for (let i: number = 0; i < palettes.length; i++) {
            this.removePalette(palettes[i]);
        }
        if (!isBlazor()) {
            this.accordionElement.refresh();
        }
        else {
            this.updatePalettes();
        }
        this.allowServerDataBinding = isEnableServerDatabind;
    }
    //end region - protected methods

    //region - private methods to render symbols

    /**
     * Method to initialize the items in the symbols \
     *
     * @returns {void}    Method to initialize the items in the symbols .\
     * @param {PaletteModel} symbolGroup - provide the scale value.
     *
     */
    private initSymbols(symbolGroup: PaletteModel): void {
        const group: NodeModel[] = [];
        let laneHeight: number = 0; let laneWidth: number = 0;
        for (const symbol of symbolGroup.symbols) {
            if (symbol.shape.type === 'SwimLane') {
                const swimLaneObj: NodeModel = symbol as NodeModel;
                const swimLaneShape: SwimLane = symbol.shape as SwimLane;
                const isHorizontal: boolean = (swimLaneShape.orientation === 'Horizontal') ? true : false;
                if (swimLaneShape.isLane) {
                    laneHeight = isHorizontal ? this.symbolHeight - this.symbolHeight / 2 : this.symbolHeight - this.symbolHeight / 4;
                    laneWidth = isHorizontal ? this.symbolWidth - this.symbolWidth / 4 : this.symbolWidth - this.symbolWidth / 2;
                    this.laneTable[symbol.id] = { height: laneHeight, width: laneWidth };
                    const header: HeaderModel = swimLaneShape.lanes[0].header;
                    const laneStyle: ShapeStyleModel = swimLaneShape.lanes[0].style;
                    const headerStyle: TextStyleModel = header.style;
                    const headerObj: NodeModel = {
                        id: 'header' + randomId(), shape: { type: 'Basic', shape: 'Rectangle' },
                        width: isHorizontal ? header.width : swimLaneObj.width,
                        height: isHorizontal ? swimLaneObj.height : header.height,
                        style: headerStyle,
                        annotations: [{ content: header.annotation.content }]
                    };
                    headerObj.offsetX = headerObj.width / 2;
                    headerObj.offsetY = headerObj.height / 2;
                    this.addPaletteItem(symbolGroup.id, headerObj);
                    const laneObj: NodeModel = {
                        id: 'lane' + randomId(), shape: { type: 'Basic', shape: 'Rectangle' },
                        width: isHorizontal ? (swimLaneObj.width - header.width) : swimLaneObj.width,
                        height: isHorizontal ? swimLaneObj.height : (swimLaneObj.height - header.height),
                        style: laneStyle
                    };
                    laneObj.offsetX = isHorizontal ? (headerObj.width + (laneObj.width / 2)) : laneObj.width / 2;
                    laneObj.offsetY = isHorizontal ? laneObj.height / 2 : (headerObj.height + (laneObj.height / 2));
                    this.addPaletteItem(symbolGroup.id, laneObj);
                    swimLaneObj.children = [headerObj.id, laneObj.id];
                } else if (swimLaneShape.isPhase) {
                    laneHeight = swimLaneObj.height ? swimLaneObj.height : this.symbolHeight;
                    laneWidth = swimLaneObj.width ? swimLaneObj.width : this.symbolWidth;
                    symbol.shape.type = 'Path';
                    if (isHorizontal) {
                        (symbol.shape as PathModel).data = 'M0,0 L' + laneWidth + ',' + '0';
                    } else {
                        (symbol.shape as PathModel).data = 'M0,0 L0,' + laneWidth;
                    }
                }
            }
            if (symbol instanceof Node) {

                const getNodeDefaults: Function = getFunction(this.getNodeDefaults);
                if (getNodeDefaults) {
                    getNodeDefaults(symbol, this);
                }
            } else if (symbol instanceof Connector) {

                const getConnectorDefaults: Function = getFunction(this.getConnectorDefaults);
                if (getConnectorDefaults) {
                    getConnectorDefaults(symbol, this);
                }
            }
            this.symbolTable[symbol.id] = symbol;
            if (symbol instanceof Node && symbol.children) {
                group.push(symbol);
            }
        }
        for (let i: number = 0; i < group.length; i++) {
            let node: Node | Connector;
            for (let j: number = 0; j < group[i].children.length; j++) {
                node = (this.symbolTable[group[i].children[j]]);
                if (node) {
                    this.childTable[node.id] = node;
                    node.parentId = group[i].id;
                }
            }
        }
        for (const symbol of symbolGroup.symbols) {
            if (!(symbol instanceof Node && symbol.children)) {
                this.prepareSymbol(symbol);
            }
        }
        for (const symbol of group) {
            this.prepareSymbol(symbol);
        }
    }


    private renderPalette(symbolGroup: PaletteModel): void {
        let style: string = (isBlazor()) ? 'overflow:auto;' : 'display:none;overflow:auto;';
        if (symbolGroup.height) {
            style += 'height:' + symbolGroup.height + 'px';
        }
        const paletteParentDiv: HTMLElement = document.getElementById(symbolGroup.id);
        let paletteDiv: HTMLElement;
        if (isBlazor() && paletteParentDiv != null) {
            paletteDiv = createHtmlElement('div', { 'id': symbolGroup.id + '_content', style: style, class: 'e-remove-palette' });
            paletteParentDiv.appendChild(paletteDiv);
        } else {
            paletteDiv = createHtmlElement('div', { 'id': symbolGroup.id, style: style, class: 'e-remove-palette' });
            this.element.appendChild(paletteDiv);
        }
        if (!isBlazor()) {
            const item: AccordionItemModel = {
                header: symbolGroup.title, expanded: symbolGroup.expanded,
                content: '#' + symbolGroup.id, iconCss: symbolGroup.iconCss
            };
            this.accordionElement.items.push(item);
        }
        this.renderSymbols(symbolGroup, paletteDiv);
    }

    /**
     * Used to add the palette item as nodes or connectors in palettes \
     *
     * @returns {void}    Used to add the palette item as nodes or connectors in palettes .\
     * @param {string} paletteName - provide the scale value.
     * @param {NodeModel | ConnectorModel} paletteSymbol - provide the scale value.
     * @param {boolean} isChild - provide the scale value.
     */
    public addPaletteItem(paletteName: string, paletteSymbol: NodeModel | ConnectorModel, isChild?: boolean): void {
        paletteSymbol = cloneObject(paletteSymbol) as NodeModel | ConnectorModel;
        //let refresh: boolean;
        for (let i: number = 0; i < this.palettes.length; i++) {
            const symbolPaletteGroup: PaletteModel = this.palettes[i];
            if (symbolPaletteGroup.id.indexOf(paletteName) !== -1) {
                // eslint-disable-next-line
                const param: any = [undefined, symbolPaletteGroup, 'symbols', {}, true];
                // eslint-disable-next-line
                const obj: any = new (Function.prototype.bind.apply(getObjectType(paletteSymbol), param));
                for (let i: number = 0; i < Object.keys(paletteSymbol).length; i++) {
                    const isEnableServerDatabind: boolean = this.allowServerDataBinding;
                    this.allowServerDataBinding = false;
                    obj[Object.keys(paletteSymbol)[i]] = paletteSymbol[Object.keys(paletteSymbol)[i]];
                    this.allowServerDataBinding = isEnableServerDatabind;
                }
                updateDefaultValues(obj, paletteSymbol, obj instanceof Node ? this.nodeDefaults : this.connectorDefaults);
                symbolPaletteGroup.symbols.push(obj);
                const isEnableServerDatabind: boolean = this.allowServerDataBinding;
                this.allowServerDataBinding = false;
                this.prepareSymbol(obj);
                this.allowServerDataBinding = isEnableServerDatabind;
                this.symbolTable[obj.id] = obj;
                if (isChild) {
                    this.childTable[obj.id] = obj;
                } else {
                    let paletteDiv: HTMLElement;
                    if (isBlazor()) {
                        paletteDiv = document.getElementById(symbolPaletteGroup.id + '_content');
                    } else {
                        paletteDiv = document.getElementById(symbolPaletteGroup.id);
                    }
                    if (paletteDiv) {
                        paletteDiv.appendChild(this.getSymbolContainer(obj, paletteDiv));
                    }
                }
                break;
            }
        }
    }


    /**
     * Used to remove the palette item as nodes or connectors in palettes \
     *
     * @returns {void}    Used to remove the palette item as nodes or connectors in palettes .\
     * @param {string} paletteName - provide the scale value.
     * @param {string} symbolId - provide the scale value.
     */
    public removePaletteItem(paletteName: string, symbolId: string): void {
        let refresh: boolean;
        for (let i: number = 0; i < this.palettes.length; i++) {
            const symbolPaletteGroup: PaletteModel = this.palettes[i];
            if (symbolPaletteGroup.id.indexOf(paletteName) !== -1) {
                for (const symbol of symbolPaletteGroup.symbols) {
                    if (symbol.id.indexOf(symbolId) !== -1) {
                        const index: number = symbolPaletteGroup.symbols.indexOf(symbol);
                        symbolPaletteGroup.symbols.splice(index, 1);
                        if ((symbol as Node).children) {
                            const parentNode: string[] = (symbol as Node).children;
                            for (let i: number = 0; i < parentNode.length; i++) {
                                delete this.symbolTable[(parentNode[i])];
                            }
                        }
                        delete this.symbolTable[symbol.id];
                        const element: HTMLElement = document.getElementById(symbol.id + '_container');
                        element.parentNode.removeChild(element);
                        refresh = true;
                        break;
                    }
                }
            }
            if (refresh) {
                break;
            }
        }
    }


    private prepareSymbol(symbol: NodeModel | ConnectorModel): void {
        let width: number; let sw: number; let height: number; let sh: number;
        const stackPanel: StackPanel = new StackPanel();
        const obj: NodeModel = symbol as NodeModel;
        let content: DiagramElement; const symbolContainer: Canvas = new Canvas();
        const container: Container = (symbol instanceof Node) ? (symbol as Node).initContainer() : null;
        if (container && !container.children) { container.children = []; }
        //preparing objects

        const getSymbolTemplate: Function = getFunction(this.getSymbolTemplate);
        if (getSymbolTemplate) { content = getSymbolTemplate(symbol); }
        if (!content) {
            if (obj.children) {
                content = this.getContainer(obj as Node, container);
            } else {
                content = (symbol as Node).init(this);
                if (symbol instanceof Node && symbol.parentId) { container.children.push(content); }
            }
        }
        if (!(symbol as Node | Connector).parentId) {
            let symbolInfo: SymbolInfo = { width: this.symbolWidth, height: this.symbolHeight };
            const getSymbolInfo: Function = getFunction(this.getSymbolInfo);
            if (getSymbolInfo) {
                symbolInfo = getSymbolInfo(symbol);
            } else if (isBlazor()) {
                symbolInfo = this.getBlazorSymbolInfo(symbol, symbolInfo);
            }
            symbolInfo = symbolInfo || this.symbolInfo || {};
            if (symbol.shape && (symbol.shape as SwimLaneModel).isPhase) {
                symbolInfo.width = symbolInfo.width || this.symbolWidth;
                symbolInfo.height = symbolInfo.height || this.symbolHeight;
            }
            //defining custom templates
            content.relativeMode = 'Object';
            content.horizontalAlignment = content.verticalAlignment = 'Center';
            symbolContainer.style.strokeColor = symbolContainer.style.fill = 'none';
            symbolContainer.children = [content];
            content.measure(new Size());
            content.arrange(content.desiredSize);
            width = symbolInfo.width = symbolInfo.width ||
                (obj.width !== undefined ? content.actualSize.width : undefined) || this.symbolWidth;
            height = symbolInfo.height = symbolInfo.height ||
                (obj.height !== undefined ? content.actualSize.height : undefined) || this.symbolHeight;
            if (width !== undefined && height !== undefined) {
                let actualWidth: number = width; let actualHeight: number = height;
                //let isLane: boolean = (symbol.shape as SwimLane).isLane ? true : false;
                const isPhase: boolean = (symbol.shape as SwimLane).isPhase ? true : false;
                if (this.symbolWidth !== undefined) {
                    actualWidth = this.symbolWidth - this.symbolMargin.left - this.symbolMargin.right;
                } else {
                    width += obj.style.strokeWidth;
                }
                if (this.symbolHeight !== undefined) {
                    actualHeight = this.symbolHeight - this.symbolMargin.top - this.symbolMargin.bottom;
                } else {
                    height += obj.style.strokeWidth;
                }
                if (symbolInfo.description && symbolInfo.description.text !== '') {
                    actualHeight -= 20; // default height of the text have been reduced from the container.
                }
                sw = actualWidth / ((!isPhase && content.width) || width); sh = actualHeight / ((!isPhase && content.height) || height);
                if (symbolInfo.fit) {
                    sw = actualWidth / symbolInfo.width; sh = actualHeight / symbolInfo.height;
                }
                width = actualWidth; height = actualHeight; sw = sh = Math.min(sw, sh);
                symbolContainer.width = width; symbolContainer.height = height;
                content.width = symbolInfo.width; content.height = symbolInfo.height;
                this.scaleSymbol(symbol, symbolContainer, sw, sh, width, height);
            } else {
                let outerBounds: Rect;
                if (symbol instanceof Connector) { outerBounds = getOuterBounds(symbol); }
                content.width = (symbol as Node).width || (outerBounds) ? outerBounds.width : content.actualSize.width;
                content.height = (symbol as Node).height || (outerBounds) ? outerBounds.height : content.actualSize.height;
            }
            symbol.wrapper = stackPanel;
            stackPanel.children = [symbolContainer];
            content.pivot = stackPanel.pivot = { x: 0, y: 0 };
            stackPanel.id = content.id + '_symbol';
            stackPanel.style.fill = stackPanel.style.strokeColor = 'transparent';
            if (symbol instanceof Node) {
                stackPanel.offsetX = symbol.style.strokeWidth / 2;
                stackPanel.offsetY = symbol.style.strokeWidth / 2;
            } else {
                stackPanel.offsetX = 0.5;
                stackPanel.offsetY = 0.5;
            }
            //symbol description-textElement
            this.getSymbolDescription(symbolInfo, width, stackPanel);
            stackPanel.measure(new Size());
            stackPanel.arrange(stackPanel.desiredSize);
            symbolInfo.width = symbolInfo.width || content.actualSize.width;
            symbolInfo.height = symbolInfo.height || content.actualSize.height;
            symbol[this.info] = symbolInfo;
        }
        if ((symbol as Node | Connector).parentId) {
            container.measure(new Size(obj.width, obj.height));
            container.arrange(container.desiredSize);
        }
    }
    private getBlazorSymbolInfo(symbol: NodeModel | ConnectorModel, symbolInfo: SymbolInfo): SymbolInfo {
        const node: NodeModel | ConnectorModel = symbol as NodeModel | ConnectorModel;
        const shapeSymbolInfo: SymbolPaletteInfoModel = node.symbolInfo;
        if (shapeSymbolInfo) {
            symbolInfo.description = shapeSymbolInfo.description || this.symbolInfo.description;
            symbolInfo.fit = shapeSymbolInfo.fit || this.symbolInfo.fit;
            symbolInfo.height = shapeSymbolInfo.height || this.symbolInfo.height;
            symbolInfo.width = shapeSymbolInfo.width || this.symbolInfo.width;
            symbolInfo.tooltip = shapeSymbolInfo.tooltip || this.symbolInfo.tooltip;
            symbolInfo.template = shapeSymbolInfo.template || this.symbolInfo.template;
        }
        return symbolInfo;
    }
    private getContainer(obj: Node, container: Container): Container {
        container.measureChildren = false;
        let bounds: Rect;
        const child: string[] = obj.children;
        container.children = [];
        for (let i: number = 0; i < child.length; i++) {
            if (this.symbolTable[child[i]]) {
                container.children.push(this.symbolTable[child[i]].wrapper);
            }
        }
        container.measure(new Size(obj.width, obj.height));
        container.arrange(container.desiredSize);
        if (container.bounds.x !== 0 || container.bounds.y !== 0) {
            bounds = container.bounds;
            arrangeChild(obj, bounds.x, bounds.y, this.symbolTable, false, this);
            container = this.getContainer(obj, container);
        }
        return container;
    }



    private getSymbolDescription(symbolInfo: SymbolInfo, width: number, parent: StackPanel | Container): void {
        if (symbolInfo && symbolInfo.description && symbolInfo.description.text) {
            const textElement: TextElement = new TextElement();
            //symbol description-textElement
            symbolInfo.description.overflow = symbolInfo.description.overflow || 'Ellipsis';
            symbolInfo.description.wrap = symbolInfo.description.wrap || 'WrapWithOverflow';
            textElement.id = parent.id + '_text';
            textElement.content = symbolInfo.description.text;
            textElement.width = width;
            textElement.height = 20;
            textElement.style.strokeColor = 'transparent';
            textElement.style.fill = 'transparent';
            textElement.style.strokeWidth = 0;
            textElement.style.textWrapping = symbolInfo.description.wrap;
            textElement.style.textOverflow = symbolInfo.description.overflow;
            textElement.margin = { left: 0, right: 0, top: 0, bottom: 5 };
            parent.children.push(textElement);
        }
    }


    private renderSymbols(symbolGroup: PaletteModel, parentDiv: HTMLElement): void {
        for (const symbol of symbolGroup.symbols) {
            if (!(symbol as Node | Connector).parentId) {
                this.getSymbolContainer(symbol, parentDiv);
            }
        }
    }


    private getSymbolPreview(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        symbol: NodeModel | ConnectorModel, evt: PointerEvent | TouchEvent, parentDiv: HTMLElement): HTMLElement {
        this.allowServerDataBinding = false;
        let canvas: HTMLCanvasElement | SVGElement;
        let sw: number; let sh: number;
        let symbolPreviewWidth: number = symbol.wrapper.children[0].desiredSize.width + symbol.style.strokeWidth;
        let symbolPreviewHeight: number = symbol.wrapper.children[0].desiredSize.height + symbol.style.strokeWidth;
        const content: DiagramElement = (symbol.wrapper.children[0] as Container).children[0];
        const symbolPreview: SymbolSizeModel = (symbol as Node).previewSize;
        if ((symbol && (symbolPreview.width || symbolPreview.height)) ||
            this.symbolPreview.width !== undefined || this.symbolPreview.height !== undefined) {
            symbolPreviewWidth = (symbolPreview.width || this.symbolPreview.width || symbolPreviewWidth) - symbol.style.strokeWidth;
            symbolPreviewHeight = (symbolPreview.height || this.symbolPreview.height || symbolPreviewHeight) - symbol.style.strokeWidth;
            // EJ2-56887 - Connector do not get rendered properly in symbol palette.
            // Added below code to check if connector width is less than strokewidth means then set symbol width for connector.
            if (symbol instanceof Connector) {
                if (content.actualSize.width <= symbol.style.strokeWidth) {
                    content.actualSize.width = this.symbolWidth;
                }
                if (content.actualSize.height <= symbol.style.strokeWidth) {
                    content.actualSize.height = this.symbolHeight;
                }
            }
            sw = symbolPreviewWidth / content.actualSize.width;
            sh = symbolPreviewHeight / content.actualSize.height;
            sw = sh = Math.min(sw, sh);
            const symbolWidth: number = content.actualSize.width * sw;
            const symbolHeight: number = content.actualSize.height * sh;
            symbol.wrapper.children[0].width = symbolPreviewWidth;
            symbol.wrapper.children[0].height = symbolPreviewHeight;
            this.measureAndArrangeSymbol(content, symbol instanceof Node);
            this.scaleSymbol(
                symbol, symbol.wrapper.children[0] as Container, sw, sh, symbolWidth, symbolHeight, true);
            symbolPreviewWidth = symbolWidth;
            symbolPreviewHeight = symbolHeight;
        }
        const prevPosition: PointModel = { x: content.offsetX, y: content.offsetY };
        content.offsetX = content.offsetY = symbol.style.strokeWidth / 2;
        content.pivot = { x: 0, y: 0 };
        this.measureAndArrangeSymbol(content, symbol instanceof Node);
        const previewContainer: HTMLElement = createHtmlElement(
            'div', { 'draggable': 'true', 'class': 'e-dragclone', 'style': 'pointer-events:none' });
        let div: HTMLElement;
        document.body.appendChild(previewContainer);
        let style: string = 'margin:5px;';
        if (symbol.shape.type === 'Native') {
            canvas = createSvgElement(
                'svg', {
                id: symbol.id + '_preview',
                width: Math.ceil(symbolPreviewWidth) + 1,
                height: Math.ceil(symbolPreviewHeight) + 1
            });
            const gElement: SVGElement = createSvgElement('g', { id: symbol.id + '_g' });
            canvas.appendChild(gElement);
            previewContainer.appendChild(canvas);
            this.svgRenderer.renderElement(content, gElement, undefined, undefined, canvas as SVGSVGElement);
        } else if (symbol.shape.type === 'HTML') {
            div = this.getHtmlSymbol(symbol, canvas, previewContainer, symbolPreviewHeight, symbolPreviewWidth, true);
        } else {
            if ((symbol as NodeModel).children &&
                (symbol as NodeModel).children.length > 0 && groupHasType(symbol as Node, 'HTML', this.childTable)) {
                div = this.getGroupParent(
                    symbol, canvas, previewContainer, symbol.wrapper.actualSize.height,
                    symbol.wrapper.actualSize.width, true);
            } else {
                canvas = CanvasRenderer.createCanvas(
                    symbol.id + '_preview',
                    (Math.ceil(symbolPreviewWidth) + symbol.style.strokeWidth + 1) * 2,
                    (Math.ceil(symbolPreviewHeight) + symbol.style.strokeWidth + 1) * 2);
                previewContainer.appendChild(canvas);
                // BLAZ-3223: translate applied only for Basic and Flow now and need to add for remaining shapes in future
                if (symbol.shape.type === 'Basic' || symbol.shape.type === 'Flow') {
                    style += 'transform: scale(0.5) translate(-' + canvas.width / 2 + 'px, -' + canvas.height / 2 + 'px);';
                } else {
                    style += 'transform:scale(0.5);';
                }
                canvas.setAttribute('transform-origin', '0 0');
                let index: number = 2;
                if (symbol instanceof Connector) { index = 1.9; }
                canvas.getContext('2d').setTransform(index, 0, 0, index, 0, 0);
                this.diagramRenderer.renderElement(content, canvas, undefined);
            }
        }
        applyStyleAgainstCsp(
            ((div && (symbol.shape.type === 'HTML' || (symbol as NodeModel).children
                && (symbol as NodeModel).children.length > 0)) ? div : canvas),
            style);
        content.offsetX = prevPosition.x;
        content.offsetY = prevPosition.y;
        this.allowServerDataBinding = true;
        return previewContainer;
    }

    private measureAndArrangeSymbol(content: DiagramElement, isNode: boolean): void {
        if ((content as Container).children && !isNode) {
            (content as Container).children[0].transform = Transform.Self;
        }
        content.measure(new Size());
        content.arrange(content.desiredSize);
        if ((content as Container).children) {
            (content as Container).children[0].transform = Transform.Parent;
        }
    }

    private updateSymbolSize(symbol: NodeModel | ConnectorModel, width?: number, height?: number): void {
        const element: DiagramElement = (symbol.wrapper.children[0] as Container).children[0];
        const strokeWidth: number = symbol.style.strokeWidth;
        element.width = (width || element.width) - (strokeWidth + 1);
        element.height = (height || element.height) - (strokeWidth + 1);
        symbol.wrapper.measure(new Size());
        symbol.wrapper.arrange(symbol.wrapper.desiredSize);
    }


    private getSymbolContainer(symbol: NodeModel | ConnectorModel, parentDiv: HTMLElement, preview?: boolean): HTMLElement {
        const symbolInfo: SymbolInfo = this.symbolTable[symbol.id][this.info];
        const size: Size = this.getSymbolSize(symbol, symbolInfo);
        const width: number = size.width + 1;
        const height: number = size.height + 1;
        const container: HTMLElement = createHtmlElement(
            'div', {
            id: symbol.id + '_container',
            style: 'width:' + width + 'px;height:' + height + 'px;float:left;overflow:hidden',
            title: symbolInfo.tooltip ? symbolInfo.tooltip : symbol.id
        });
        parentDiv.appendChild(container);
        let canvas: HTMLCanvasElement | SVGElement;
        let gElement: SVGElement;
        let div: HTMLElement;
        if (symbol.shape.type === 'Native') {
            canvas = createSvgElement(
                'svg', {
                id: symbol.id,
                width: Math.ceil(symbol.wrapper.actualSize.width) + 1,
                height: Math.ceil(symbol.wrapper.actualSize.height) + 1
            });
            gElement = createSvgElement('g', { id: symbol.id + '_g' });
            canvas.appendChild(gElement);
            container.appendChild(canvas);
            this.updateSymbolSize(symbol);
            this.svgRenderer.renderElement(symbol.wrapper, gElement, undefined, undefined, canvas as SVGSVGElement);
        } else if (symbol.shape.type === 'HTML') {
            div = this.getHtmlSymbol(
                symbol, canvas, container, symbol.wrapper.actualSize.height, symbol.wrapper.actualSize.width, false);
        } else {
            if ((symbol as NodeModel).children &&
                (symbol as NodeModel).children.length > 0 && groupHasType(symbol as Node, 'HTML', this.childTable)) {
                div = this.getGroupParent(
                    symbol, canvas,
                    container, symbol.wrapper.actualSize.height, symbol.wrapper.actualSize.width, false);
            } else {
                canvas = CanvasRenderer.createCanvas(
                    symbol.id, Math.ceil((symbol.wrapper.actualSize.width + symbol.style.strokeWidth) * 2) + 1,
                    Math.ceil((symbol.wrapper.actualSize.height + symbol.style.strokeWidth) * 2) + 1);
                container.appendChild(canvas);
                let index: number = 2;
                if (symbol instanceof Connector) { index = 1.9; }
                canvas.getContext('2d').setTransform(index, 0, 0, index, 0, 0);
                this.diagramRenderer.renderElement(
                    symbol.wrapper, gElement || canvas, undefined, undefined, undefined, undefined, true, undefined, true);
            }
        }
        if (!preview) {
            const actualWidth: number = symbol.wrapper.actualSize.width + symbol.style.strokeWidth;
            const actualHeight: number = symbol.wrapper.actualSize.height + symbol.style.strokeWidth;
            let style: string = 'pointer-events:none;transform-origin:0 0;overflow:hidden;';
            if ((symbol.shape as SwimLaneModel).isPhase) {
                if ((symbol.shape as SwimLaneModel).orientation === 'Horizontal') {
                    style += 'margin-left:' +
                        Math.max(this.symbolMargin.left, ((width - actualWidth) / 2))
                        + 'px;margin-top:' + size.height / 2
                        + 'px;';
                } else {
                    style += 'margin-left:' +
                        size.width / 2
                        + 'px;margin-top:' + Math.max(this.symbolMargin.top, ((height - actualHeight) / 2))
                        + 'px;';
                }
            } else {
                style += 'margin-left:' +
                    Math.max(this.symbolMargin.left, ((width - actualWidth) / 2))
                    + 'px;margin-top:' + Math.max(this.symbolMargin.top, ((height - actualHeight) / 2))
                    + 'px;';
            }
            if (canvas instanceof HTMLCanvasElement) {
                style += 'transform:scale(.5,.5);';
            }
            applyStyleAgainstCsp(
                ((div && (symbol.shape.type === 'HTML' || (symbol as NodeModel).children &&
                    (symbol as NodeModel).children.length > 0)) ? div : canvas),
                style);
            container.classList.add('e-symbol-draggable');
            return container;
        }
        return canvas as HTMLElement;
    }

    private getGroupParent(
        item: NodeModel | ConnectorModel, canvas: HTMLCanvasElement | SVGElement,
        container: HTMLElement, height: number, width: number, isPreview: boolean): HTMLElement {
        const div: HTMLElement = createHtmlElement(
            'div', { 'id': item.id + (isPreview ? '_html_div_preview' : '_html_div') });
        const htmlLayer: HTMLElement = createHtmlElement(
            'div', {
            'id': item.id + (isPreview ? '_htmlLayer_preview' : '_htmlLayer'),
            'style': 'width:' + Math.ceil(width + 1) + 'px;' +
                'height:' + Math.ceil(height + 1) + 'px;position:absolute',
            'class': 'e-html-layer'
        });
        const htmlLayerDiv: HTMLElement = createHtmlElement(
            'div', {
            'id': item.id + (isPreview ? '_htmlLayer_div_preview' : '_htmlLayer_div'),
            'style': 'width:' + Math.ceil(width + 1) + 'px;' +
                'height:' + Math.ceil(height + 1) + 'px;position:absolute'
        });
        htmlLayer.appendChild(htmlLayerDiv);
        div.appendChild(htmlLayer);
        canvas = CanvasRenderer.createCanvas(
            (isPreview ? (item.id + '_preview') : item.id), Math.ceil(width) + 1, Math.ceil(height) + 1);
        div.appendChild(canvas);
        container.appendChild(div);
        this.diagramRenderer.renderElement((item.wrapper.children[0] as Container).children[0], canvas, htmlLayer);
        return div;
    }

    private getHtmlSymbol(
        symbol: NodeModel | ConnectorModel, canvas: HTMLCanvasElement | SVGElement,
        container: HTMLElement, height: number, width: number, isPreview: boolean
    ): HTMLElement {
        const div: HTMLElement = createHtmlElement(
            'div', {
            'id': symbol.id + (isPreview ? '_html_div_preview' : '_html_div')
        }
        );
        const htmlLayer: HTMLElement = createHtmlElement(
            'div', {
            'id': symbol.id + (isPreview ? '_htmlLayer_preview' : '_htmlLayer'),
            'style': 'width:' + Math.ceil(width + 1) + 'px;' +
                'height:' + Math.ceil(height + 1) + 'px;position:absolute',
            'class': 'e-html-layer'
        });
        const htmlLayerDiv: HTMLElement = createHtmlElement(
            'div', {
            'id': symbol.id + (isPreview ? '_htmlLayer_div_preview' : '_htmlLayer_div'),
            'style': 'width:' + Math.ceil(width + 1) + 'px;' +
                'height:' + Math.ceil(height + 1) + 'px;position:absolute'
        });
        htmlLayer.appendChild(htmlLayerDiv);
        div.appendChild(htmlLayer);
        canvas = CanvasRenderer.createCanvas(
            symbol.id, Math.ceil((symbol.wrapper.actualSize.width + symbol.style.strokeWidth) * 2) + 1,
            Math.ceil((symbol.wrapper.actualSize.height + symbol.style.strokeWidth) * 2) + 1);
        container.appendChild(canvas);
        canvas.getContext('2d').setTransform(2, 0, 0, 2, 0, 0);
        div.appendChild(canvas);
        container.appendChild(div);
        this.diagramRenderer.renderElement((symbol.wrapper.children[0] as Container).children[0], canvas, htmlLayer);
        return div;

    }

    // eslint-disable-next-line
    private getSymbolSize(symbol: NodeModel | ConnectorModel, symbolInfo: SymbolInfo): Size {
        let width: number = symbol.wrapper.actualSize.width;
        let height: number = symbol.wrapper.actualSize.height;
        if (!this.symbolWidth && !this.symbolHeight) {
            width += this.symbolMargin.left + this.symbolMargin.right + symbol.style.strokeWidth;
            height += this.symbolMargin.top + this.symbolMargin.bottom + symbol.style.strokeWidth;
        } else {
            width = this.symbolWidth;
            height = Math.max(this.symbolHeight, height);
        }
        return new Size(width, height);
    }

    //end region - rendering symbols

    //region event handlers

    private getMousePosition(e: PointerEvent | TouchEvent): PointModel {
        let offsetY: number;
        let offsetX: number;
        let touchArg: TouchEvent;
        if (e.type.indexOf('touch') !== -1) {
            touchArg = <TouchEvent & PointerEvent>e;
            const pageY: number = touchArg.changedTouches[0].clientY;
            const pageX: number = touchArg.changedTouches[0].clientX;
            offsetY = pageY - this.element.offsetTop;
            offsetX = pageX - this.element.offsetLeft;
        } else {
            offsetY = (e as PointerEvent).clientY - this.element.offsetTop;
            offsetX = (e as PointerEvent).clientX - this.element.offsetLeft;
        }
        return { x: offsetX, y: offsetY };
    }

    // eslint-disable-next-line
    private mouseMove(e: PointerEvent | TouchEvent, touches: TouchList): void {
        if (this.highlightedSymbol && (!this.selectedSymbol
            || this.selectedSymbol.id + '_container' !== this.highlightedSymbol.id)) {
            this.highlightedSymbol.classList.remove('e-symbol-hover');
            this.highlightedSymbol.style.backgroundColor = '';
            this.highlightedSymbol = null;
        }
        const id: string = (<HTMLElement>e.target).id.split('_container')[0];
        if (this.symbolTable[id]) {
            const container: HTMLElement = document.getElementById(id + '_container');
            container.classList.add('e-symbol-hover');
            this.highlightedSymbol = container;
        }
        e.preventDefault();
    }
    // eslint-enable

    private mouseUp(evt: PointerEvent): void {
        this.isMethod = true;
        if (evt && evt.target) {

            if (evt.srcElement.id === 'iconSearch') {
                const element: HTMLElement = document.getElementById('iconSearch');
                if (element.classList.contains('e-clear-searchtext')) {
                    element.className = 'e-input-group-icon e-search e-icons';
                    (document.getElementById('textEnter') as HTMLInputElement).value = '';
                    if (isBlazor()) {
                        document.getElementById(this.element.id + '_search_content').classList.add('e-symbolpalette-search-hidden');
                    }
                    this.searchPalette('');
                }
            } else {
                const id: string = (<HTMLElement>evt.target).id.split('_container')[0];
                if (id && this.selectedSymbol) {
                    const args: IPaletteSelectionChangeArgs = { oldValue: this.oldObject, newValue: id };
                    const event: string = 'paletteSelectionChange';
                    this.trigger(event, args);
                    this.oldObject = id;
                    evt.preventDefault();
                } else if (this.oldObject !== '') {
                    this.oldObject = '';
                }
            }
        }
    }

    private keyUp(evt: KeyboardEvent): void {
        if (this.enableSearch) {
            // eslint-disable-next-line
            const palette: SymbolPalette = this;
            const element: HTMLElement = document.getElementById('iconSearch');
            element.className = 'e-input-group-icon e-clear-searchtext e-icons';
            if (isBlazor() && evt.target instanceof HTMLInputElement) {
                if (evt.target.value === '') {
                    document.getElementById(this.element.id + '_search_content').classList.add('e-symbolpalette-search-hidden');
                } else {
                    document.getElementById(this.element.id + '_search_content').classList.remove('e-symbolpalette-search-hidden');
                }
            }
            if (evt && (evt.key === 'Enter' || evt.keyCode === 13)) {
                if (evt.target instanceof HTMLInputElement) {
                    this.searchPalette(evt.target.value);
                }
            } else {
                if (this.timer) {
                    clearTimeout(this.timer as number);
                }
                this.timer = setTimeout(
                    (): void => {
                        if (evt.target instanceof HTMLInputElement) {
                            palette.searchPalette(evt.target.value);
                            this.timer = null;
                        }
                    },
                    500);
            }
        }
    }

    private mouseDown(evt: PointerEvent): void {
        const id: string = (<HTMLElement>evt.target).id.split('_container')[0];
        if (this.selectedSymbol) {
            const oldSymbol: HTMLElement = document.getElementById(this.selectedSymbol.id + '_container');
            if (id !== this.selectedSymbol.id && oldSymbol) {
                oldSymbol.classList.remove('e-symbol-selected');
            }
            const container: HTMLElement = document.getElementById(this.selectedSymbol.id + '_container');
            if (container) {
                container.style.backgroundColor = '';
            }
            this.selectedSymbol = null;
        }
        if (this.symbolTable[id]) {
            const container: HTMLElement = document.getElementById(id + '_container');
            container.classList.add('e-symbol-selected');
            this.selectedSymbol = this.symbolTable[id];
            evt.preventDefault();
        }
    }

    private keyDown(evt: KeyboardEvent): void {
        // eslint-disable-next-line
        const palette: SymbolPalette = this;
        const helperElement: string = 'helperElement';
        const intDestroy: string = 'intDestroy';
        if (evt && (evt.key === 'Escape')) {
            const element: HTMLElement = palette.draggable[helperElement];
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
                palette.draggable[intDestroy]();
            }
        }
    }

    //end region - event handlers

    // region - draggable

    private initDraggable(): void {
        if (this.allowDrag) {
            //let drag: Draggable;
            this.draggable = new Draggable(this.element, {
                dragTarget: '.e-symbol-draggable',
                helper: this.helper,
                dragStart: this.dragStart,
                preventDefault: false,
                dragStop: this.dragStop,
                drag: (args: Object) => {
                    const target: string = 'target';
                    const parent: Element = parentsUntil(args[target], 'e-droppable');
                    if (parent && parent.classList.contains('e-diagram')) {
                        const e2eInstance: string = 'ej2_instances';
                        parent[e2eInstance][0].droppable.over(args);
                    }
                },
                cursorAt: { left: this.symbolPreview.offset.x, top: this.symbolPreview.offset.y }
            });
        }
    }

    // eslint-disable


    private helper: Function = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
        let clonedElement: HTMLElement;
        const id: string = (this.selectedSymbol && this.selectedSymbol.id) || (e.sender.target as Element).id.split('_container')[0];
        const symbol: IElement = this.symbolTable[id];
        if (symbol && this.selectedSymbol) {
            this.selectedSymbols = this.selectedSymbol.id === (symbol as NodeModel | ConnectorModel).id ? symbol : this.selectedSymbol;
            //const position: PointModel = this.getMousePosition(e.sender);
            clonedElement = this.getSymbolPreview(this.selectedSymbols, e.sender, this.element);
            clonedElement.setAttribute('paletteId', this.element.id);
        }
        return clonedElement;
    }
    // eslint-enable

    private dragStart(e: (MouseEvent & BlazorDragEventArgs)): void {
        const element: HTMLElement = this.helper[0];
        if (element) {
            element.setAttribute('paletteId', this.element.id);
        }
        if (isBlazor()) {
            e.bindEvents(e.dragElement);
        }
    }

    private dragStop(e: { target: HTMLElement, event: PointerEvent | TouchEvent, helper: Element }): void {
        if (!parentsUntil(e.target, 'e-diagram')) {
            remove(e.helper);
        }
    }

    //end region - draggable

    //region - helper methods

    private scaleSymbol(
        symbol: NodeModel | ConnectorModel, symbolContainer: Container, sw: number, sh: number,
        width: number, height: number, preview?: boolean): void {
        if (symbol instanceof Connector) {
            const wrapper: Container = symbol.wrapper;
            symbol.wrapper = symbolContainer.children[0] as Container;
            const point: PointModel = symbol.scale(sw, sh, width, height, symbolContainer.children[0]);
            const difX: number = width / 2 - (symbolContainer.children[0] as Container).children[0].offsetX + point.x / 2;
            const difY: number = height / 2 - (symbolContainer.children[0] as Container).children[0].offsetY + point.y / 2;
            for (const child of (symbolContainer.children[0] as Container).children) {
                child.offsetX += difX;
                child.offsetY += difY;
                child.staticSize = false;
            }
            symbol.wrapper = wrapper;
        } else if (symbol.shape.type === 'Bpmn' && this.bpmnModule) {
            const wrapper: Container = symbol.wrapper;
            symbol.wrapper = symbolContainer;
            symbolContainer.children[0].width = width;
            symbolContainer.children[0].height = height;
            this.bpmnModule.updateBPMN(
                { width: width, height: height } as Node,
                symbol as Node, symbol as Node, null);
            symbol.wrapper = wrapper;
        } else {
            if ((symbol as Node).children) {
                const parentNode: string[] = (symbol as Node).children;
                let w: number = 0; let h: number = 0;
                if (!preview) {
                    let node: Node;
                    let container: DiagramElement;
                    for (let i: number = 0; i < parentNode.length; i++) {
                        container = (symbolContainer.children[0] as Container).children[i];
                        if (container) {
                            if (((container as Container).children[0] as Container).children) {
                                this.measureChild(container);
                            }
                            node = this.symbolTable[container.id];
                            container.width = node.width;
                            container.height = node.height;
                            container.measure(new Size());
                            container.arrange((container as Container).children[0].desiredSize);
                        }
                    }
                }
                w = width / symbolContainer.children[0].desiredSize.width;
                h = height / symbolContainer.children[0].desiredSize.height;
                symbolContainer.children[0].measure(new Size());
                symbolContainer.children[0].arrange(symbolContainer.children[0].desiredSize);
                if (!preview) {
                    let children: DiagramElement;
                    for (let i: number = 0; i < parentNode.length; i++) {
                        children = (symbolContainer.children[0] as Container).children[i];
                        if (children) {
                            if (((children as Container).children[0] as Container).children) {
                                this.scaleChildren(children, w, h, symbol);
                            }
                            this.scaleGroup(children, w, h, symbol);
                        }

                    }
                }
                if (preview) {
                    ///let node: Node;
                    let scaleWidth: number;
                    let scaleHeight: number;
                    let children: DiagramElement;
                    for (let i: number = 0; i < parentNode.length; i++) {
                        //const node: Node = this.symbolTable[parentNode[i]];
                        scaleWidth = width / symbol.wrapper.children[0].desiredSize.width;
                        scaleHeight = height / symbol.wrapper.children[0].desiredSize.height;
                        children = (symbolContainer.children[0] as Container).children[i];
                        if (children) {
                            if (((children as Container).children[0] as Container).children) {
                                this.scaleChildren(children, scaleWidth, scaleHeight, symbol, true);
                            }
                            this.scaleGroup(children, scaleWidth, scaleHeight, symbol, true);
                        }
                    }
                    symbol.wrapper.children[0].measure(new Size());
                    symbol.wrapper.children[0].arrange(symbol.wrapper.children[0].desiredSize);
                }
            } else {
                scaleElement(symbolContainer.children[0], sw, sh, symbolContainer);
            }
        }
    }

    private scaleChildren(container: DiagramElement, w: number, h: number, symbol: NodeModel | ConnectorModel, preview?: boolean): void {
        let child: DiagramElement;
        for (let i: number = 0; i < (container as Container).children.length; i++) {
            child = (container as Container).children[i];
            if (!((child as Container).children[0] as Container).children) {
                this.scaleGroup(child, w, h, symbol, preview);
            } else {
                this.scaleChildren(child, w, h, symbol, preview);
            }
        }
    }

    private measureChild(container: DiagramElement): void {
        let childContainer: DiagramElement;
        let node: NodeModel;
        for (let i: number = 0; i < (container as Container).children.length; i++) {
            childContainer = (container as Container).children[i];
            if (!((childContainer as Container).children[0] as Container).children) {
                node = this.symbolTable[childContainer.id];
                childContainer.width = node.width;
                childContainer.height = node.height;
                childContainer.measure(new Size());
                childContainer.arrange((childContainer as Container).children[0].desiredSize);
            } else {
                this.measureChild(childContainer);
            }
        }
    }

    private scaleGroup(child: DiagramElement, w: number, h: number, symbol: NodeModel | ConnectorModel, preview?: boolean): void {
        child.width = child.width * w;
        child.height = (child.height * h);
        child.offsetX = preview ? (child.offsetX * w) - symbol.style.strokeWidth : (child.offsetX * w) + symbol.style.strokeWidth / 2;
        child.offsetY = preview ? (child.offsetY * h) - symbol.style.strokeWidth : (child.offsetY * h) + symbol.style.strokeWidth / 2;
        child.measure(new Size());
        child.arrange((child as Container).children[0].desiredSize);
    }

    private refreshPalettes(): void {
        if (!isBlazor()) {
            this.accordionElement.items = [];
        }
        removeElementsByClass('e-remove-palette', this.element.id);
        this.updatePalettes();
        if (!isBlazor()) {
            this.accordionElement.dataBind();
        }
    }

    private updatePalettes(): void {
        for (let i: number = 0; i < this.palettes.length; i++) {
            const symGroup: PaletteModel = this.palettes[i];
            this.initSymbols(symGroup);
            this.renderPalette(symGroup);
        }
    }

    private createTextbox(): void {
        const searchDiv: HTMLElement = createHtmlElement('div', { id: this.element.id + '_search' });
        applyStyleAgainstCsp(searchDiv, 'backgroundColor:white;height:30px');
        //  searchDiv.setAttribute('style', 'backgroundColor:white;height:30px');
        searchDiv.className = 'e-input-group';
        this.element.appendChild(searchDiv);
        const textBox: HTMLInputElement = createHtmlElement('input', {}) as HTMLInputElement;
        textBox.placeholder = 'Search Shapes';
        textBox.id = 'textEnter';
        applyStyleAgainstCsp(textBox, 'width:100%;height:auto');
        //textBox.setAttribute('style', 'width:100%;height:auto');
        textBox.className = 'e-input';
        searchDiv.appendChild(textBox);
        const span: HTMLElement = createHtmlElement('span', { id: 'iconSearch', className: 'e-input-group-icon e-search e-icons' });
        searchDiv.appendChild(span);
    }

    private getFilterSymbol(symbol: (NodeModel | ConnectorModel)[]): NodeModel[] | ConnectorModel[] {
        const items: NodeModel[] = [];
        for (let i: number = 0; i < symbol.length; i++) {
            for (let j: number = 0; j < this.ignoreSymbolsOnSearch.length; j++) {
                if (this.ignoreSymbolsOnSearch[j] !== symbol[i].id) {
                    items.push(symbol[0] as NodeModel);
                }
            }
        }
        return items;
    }

    private searchPalette(value: string): void {
        let symbolGroup: (NodeModel | ConnectorModel)[] = [];
        let element: HTMLElement = document.getElementById('SearchPalette');
        let paletteDiv: HTMLElement;
        //remove the existing child in palette
        if (element) {
            for (let k: number = element.children.length - 1; k >= 0; k--) {
                element.removeChild(element.children[k]);
            }
        }
        //add the searched item in array collection
        for (let i: number = 0; i < this.palettes.length; i++) {
            const symbolPaletteGroup: PaletteModel = this.palettes[i];
            for (let j: number = 0; j < symbolPaletteGroup.symbols.length; j++) {
                const item: (NodeModel | ConnectorModel) = symbolPaletteGroup.symbols[j];
                if (value !== '' && item.id.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    symbolGroup.push(item);
                }
            }
        }
        const filterSymbols: Function = getFunction(this.filterSymbols);
        if (filterSymbols) {
            symbolGroup = filterSymbols(symbolGroup) || [];
        }
        if (this.ignoreSymbolsOnSearch && this.ignoreSymbolsOnSearch.length > 0) {
            symbolGroup = this.getFilterSymbol(symbolGroup);
        }

        //create a palette collection
        if (!element && !isBlazor()) {
            paletteDiv = this.createSearchPalette(paletteDiv);
            element = paletteDiv;
        }
        //add the symbols into search palette
        if (symbolGroup.length > 0) {
            for (const symbol of symbolGroup) {
                if ((symbol as Node | Connector).parentId === "") {
                    this.getSymbolContainer(symbol, element);
                }
            }
        } else if (value !== '') {
            const emptyDiv: HTMLElement = createHtmlElement('div', { 'id': 'EmptyDiv', 'style': 'text-align:center;font-style:italic' });
            emptyDiv.innerHTML = 'No Items To Display';
            element.appendChild(emptyDiv);
        } else {
            const element: HTMLElement = document.getElementById('iconSearch');
            element.className = 'e-input-group-icon e-search e-icons';
            if (!isBlazor()) {
                this.accordionElement.removeItem(0);
                const searchPalette: HTMLElement = document.getElementById('SearchPalette');
                if (searchPalette) {
                    searchPalette.remove();
                }
            }
        }
    }

    private createSearchPalette(paletteDiv: HTMLElement): HTMLElement {
        paletteDiv = createHtmlElement('div', { 'id': 'SearchPalette', 'style': 'display:none;overflow:auto;' });
        this.element.appendChild(paletteDiv);
        const paletteCollection: AccordionItemModel = {
            header: 'Search Results', expanded: true,
            content: '#SearchPalette'
        };
        this.accordionElement.addItem(paletteCollection, 0);
        return paletteDiv;
    }


    private wireEvents(): void {
        const startEvent: string = Browser.touchStartEvent;
        const stopEvent: string = Browser.touchEndEvent;
        const moveEvent: string = Browser.touchMoveEvent;
        //let cancelEvent: string = 'mouseleave';
        const keyEvent: string = 'keyup';
        const keyDownEvent: string = 'keydown';

        EventHandler.add(this.element, startEvent, this.mouseDown, this);
        EventHandler.add(this.element, moveEvent, this.mouseMove, this);
        EventHandler.add(this.element, stopEvent, this.mouseUp, this);
        EventHandler.add(this.element, keyEvent, this.keyUp, this);
        EventHandler.add(document, keyDownEvent, this.keyDown, this);
        // initialize the draggable component
        this.initDraggable();
    }



    private unWireEvents(): void {
        const startEvent: string = Browser.touchStartEvent;
        const stopEvent: string = Browser.touchEndEvent;
        const moveEvent: string = Browser.touchMoveEvent;
        //const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        const keyEvent: string = 'keyup';
        const keyDownEvent: string = 'keydown';
        EventHandler.remove(this.element, startEvent, this.mouseDown);
        EventHandler.remove(this.element, moveEvent, this.mouseMove);
        EventHandler.remove(this.element, stopEvent, this.mouseUp);
        EventHandler.remove(this.element, keyEvent, this.keyUp);
        EventHandler.remove(document, keyDownEvent, this.keyDown);
    }

    //end region - helper methods
}

/**
 * Defines the size and description of a symbol
 */
export interface SymbolInfo {

    /**
     * Defines the width of the symbol to be drawn over the palette
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    width?: number;

    /**
     * Defines the height of the symbol to be drawn over the palette
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    height?: number;

    /**
     * Defines whether the symbol has to be fit inside the size, that is defined by the symbol palette
     *
     * @default true
     */
    fit?: boolean;

    /**
     * Define the template of the symbol that is to be drawn over the palette
     *
     * @default null
     */
    template?: DiagramElement;

    /**
     * Define the text to be displayed and how that is to be handled.
     *
     * @default null
     */
    description?: SymbolDescription;

    /**
     * Define the text to be displayed when mouse hover on the shape.
     *
     * @default ''
     */
    tooltip?: string;
}

/**
 * Defines the textual description of a symbol
 */
export interface SymbolDescription {

    /**
     * Defines the symbol description
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    text?: string;

    /**
     * Defines how to handle the text when its size exceeds the given symbol size
     * * Wrap - Wraps the text to next line, when it exceeds its bounds
     * * Ellipsis - It truncates the overflown text and represents the clipping with an ellipsis
     * * Clip - It clips the overflow text
     *
     * @default ellipsis
     */
    overflow?: TextOverflow;

    /**
     * Defines how to wrap the text
     * * WrapWithOverflow - Wraps the text so that no word is broken
     * * Wrap - Wraps the text and breaks the word, if necessary
     * * NoWrap - Text will no be wrapped
     *
     * @default Wrap
     */
    wrap?: TextWrap;
}
