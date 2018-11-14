import { Component, Property, Complex, CollectionFactory, ChildProperty, Event } from '@syncfusion/ej2-base';
import { Browser, EventHandler, Draggable, INotifyPropertyChanged, Collection, ModuleDeclaration } from '@syncfusion/ej2-base';
import { remove, classList, EmitType } from '@syncfusion/ej2-base';
import { Accordion, AccordionItemModel, ExpandMode, ExpandEventArgs } from '@syncfusion/ej2-navigations';
import { NodeModel, ConnectorModel, Node, Connector, Shape, Size, Transform } from '../diagram/index';
import { DiagramRenderer, Container, StackPanel, Margin, BpmnDiagrams } from '../diagram/index';
import { DiagramElement, TextElement, MarginModel, Canvas, BpmnShape, PointModel, IElement } from '../diagram/index';
import { SymbolPaletteModel, SymbolPreviewModel, PaletteModel } from './symbol-palette-model';
import { TextWrap, TextOverflow, IPaletteSelectionChangeArgs } from '../diagram/index';
import { SvgRenderer } from '../diagram/rendering/svg-renderer';
import { parentsUntil, createSvgElement, createHtmlElement, createMeasureElements } from '../diagram/utility/dom-util';
import { scaleElement, arrangeChild, groupHasType } from '../diagram/utility/diagram-util';
import { getFunction } from '../diagram/utility/base-util';
import { getOuterBounds } from '../diagram/utility/connector';
import { Point } from '../diagram/primitives/point';
import { CanvasRenderer } from '../diagram/rendering/canvas-renderer';
import { Rect } from '../diagram/primitives/rect';

let getObjectType: Function = (obj: Object): Object => {
    let conn: Connector = obj as Connector;
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
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Sets the height of the symbol group
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Sets whether the palette items to be expanded or not
     * @default true
     */
    @Property(true)
    public expanded: boolean;

    /**
     * Defines the content of the symbol group
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Defines the title of the symbol group
     * @default ''
     */
    @Property('')
    public title: string;

    /**
     * Defines the collection of predefined symbols
     * @aspType object
     */
    @CollectionFactory(getObjectType)
    public symbols: (NodeModel | ConnectorModel)[];

    /** @private */
    public isInteraction: boolean;

}

/**
 * customize the preview size and position of the individual palette items.
 */
export class SymbolPreview extends ChildProperty<SymbolPreview> {

    /**
     * Sets the preview width of the symbols
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets the preview height of the symbols
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Defines the distance to be left between the cursor and symbol
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
     * @default 'S'
     */
    @Property('S')
    public accessKey: string;

    /**
     * Defines the width of the symbol palette
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Defines the height of the symbol palette
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;

    /**
     * Defines the collection of symbol groups
     * @default []
     */
    @Collection<PaletteModel>([], Palette)
    public palettes: PaletteModel[];

    /**
     * Defines the size, appearance and description of a symbol
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
     */
    @Property()
    public getSymbolInfo: Function | string;

    /**
     * Defines the symbols to be added in search palette
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public filterSymbols: Function | string;

    /**
     * Defines the content of a symbol
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public getSymbolTemplate: Function | string;

    /**
     * Defines the width of the symbol
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public symbolWidth: number;

    /**
     * Defines the height of the symbol
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public symbolHeight: number;

    /**
     * Defines the space to be left around a symbol
     * @default {left:10,right:10,top:10,bottom:10}
     */
    @Complex<MarginModel>({ left: 10, right: 10, top: 10, bottom: 10 }, Margin)
    public symbolMargin: MarginModel;

    /**
     * Defines whether the symbols can be dragged from palette or not
     * @default true
     */
    @Property(true)
    public allowDrag: boolean;

    /**
     * Defines the size and position of the symbol preview
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Complex<SymbolPreviewModel>({}, SymbolPreview)
    public symbolPreview: SymbolPreviewModel;

    /**
     * Enables/Disables search option in symbol palette
     * @default false
     */
    @Property(false)
    public enableSearch: boolean;

    /**
     * Enables/Disables animation when the palette header is expanded/collapsed
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Defines how many palettes can be at expanded mode at a time
     * @default 'Multiple'
     */
    @Property('Multiple')
    public expandMode: ExpandMode;

    /**
     * Triggers after the selection changes in the symbol palette
     * @event
     */
    @Event()
    public paletteSelectionChange: EmitType<IPaletteSelectionChangeArgs>;
    /**
     * `bpmnModule` is used to add built-in BPMN Shapes to diagrams
     * @private
     */
    public bpmnModule: BpmnDiagrams;

    /**
     * Helps to return the default properties of node
     */
    @Property()
    public getNodeDefaults: Function | string;

    /**
     * Helps to return the default properties of connector 
     */
    @Property()
    public getConnectorDefaults: Function | string;

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
    private timer: Object;
    private draggable: Draggable;

    //region - protected methods 

    /**
     * Constructor for creating the component
     * @hidden
     */
    constructor(options?: SymbolPaletteModel, element?: Element) {
        super(options, <HTMLButtonElement | string>element);
    }

    /**
     * Refreshes the panel when the symbol palette properties are updated
     * @param newProp Defines the new values of the changed properties
     * @param oldProp Defines the old values of the changed properties
     */
    public onPropertyChanged(newProp: SymbolPaletteModel, oldProp: SymbolPaletteModel): void {
        let refresh: boolean = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                    this.element.style.width = this.width.toString();
                    break;
                case 'height':
                    this.element.style.height = this.height.toString();
                    break;
                case 'symbolPreview':
                    break;
                case 'symbolWidth':
                case 'symbolHeight':
                case 'getSymbolInfo':
                    refresh = true;
                    break;
                case 'enableSearch':
                    if (newProp.enableSearch) {
                        this.createTextbox();
                    } else {
                        let divElement: HTMLElement = document.getElementById(this.element.id + '_search');
                        if (divElement) {
                            divElement.parentNode.removeChild(divElement);
                        }
                    }
                    break;
                case 'palettes':
                    for (let i of Object.keys(newProp.palettes)) {
                        let index: number = Number(i);

                        if (!this.accordionElement.items[index]) {
                            this.accordionElement.items[index] = {
                                header: newProp.palettes[index].title || '',
                                expanded: newProp.palettes[index].expanded,
                                iconCss: newProp.palettes[index].iconCss || ''
                            };
                        }
                        if (newProp.palettes[index].iconCss !== undefined) {
                            this.accordionElement.items[index].iconCss = newProp.palettes[index].iconCss || '';
                            refresh = true;
                        }
                        if (newProp.palettes[index].expanded !== undefined) {
                            if (!(this.palettes[index] as Palette).isInteraction) {
                                this.accordionElement.items[index].expanded = newProp.palettes[index].expanded;
                                refresh = true;
                            } else {
                                (this.palettes[index] as Palette).isInteraction = false;
                            }
                        }
                    }
                    break;
                case 'enableAnimation':
                    if (!this.enableAnimation) {
                        this.accordionElement.animation = { expand: { duration: 0 }, collapse: { duration: 0 } };
                    } else {
                        this.accordionElement.animation = { expand: { duration: 400 }, collapse: { duration: 400 } };
                    }
                    break;

                case 'expandMode':
                    this.accordionElement.expandMode = this.expandMode;
                    refresh = true;
                    break;
            }
        }
        if (refresh) {
            this.refreshPalettes();
        }
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['loaded'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Initialize nodes, connectors and renderer
     */
    protected preRender(): void {
        this.element.style.overflow = 'auto';
        this.element.style.height = this.height.toString();
        this.element.style.width = this.width.toString();
        if (this.enableSearch) {
            this.createTextbox();
        }
        //create accordion element
        let accordionDiv: HTMLElement = createHtmlElement('div', { id: this.element.id + '_container' });
        this.accordionElement = new Accordion({
            expandMode: this.expandMode
        });
        if (!this.enableAnimation) {
            this.accordionElement.animation = { expand: { duration: 0 }, collapse: { duration: 0 } };
        }
        this.accordionElement.expanded = (args: ExpandEventArgs) => {
            let index: number = this.accordionElement.items.indexOf(args.item);
            this.palettes[index].expanded = args.isExpanded;
            (this.palettes[index] as Palette).isInteraction = true;
        };
        this.element.appendChild(accordionDiv);
        createMeasureElements();
        this.unWireEvents();
        this.wireEvents();
    }

    /**
     * Renders nodes and connectors in the symbol palette
     */
    public render(): void {
        this.diagramRenderer = new DiagramRenderer(this.element.id, new SvgRenderer(), false);
        this.svgRenderer = new DiagramRenderer(this.element.id, new SvgRenderer(), true);
        this.updatePalettes();
        this.accordionElement.appendTo('#' + this.element.id + '_container');
    }

    /**
     * To get Module name
     *  @private
     */
    public getModuleName(): string {
        return 'SymbolPalette';
    }

    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private 
     */
    public requiredModules(): ModuleDeclaration[] {

        let modules: ModuleDeclaration[] = [];

        modules.push({
            member: 'Bpmn',
            args: []
        });
        return modules;
    }

    /**
     * To destroy the symbol palette
     * @return {void}
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
                let measureElemnt: string = 'measureElement';
                if (window[measureElemnt]) {
                    window[measureElemnt].usageCount -= 1;
                    if (window[measureElemnt].usageCount === 0) {
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

    //end region - protected methods

    //region - private methods to render symbols

    /**
     * Method to initialize the items in the symbols
     */
    private initSymbols(symbolGroup: PaletteModel): void {
        let group: NodeModel[] = [];
        for (let symbol of symbolGroup.symbols) {
            if (symbol instanceof Node) {
                let getNodeDefaults: Function = getFunction(this.getNodeDefaults);
                if (getNodeDefaults) {
                    getNodeDefaults(symbol, this);
                }
            } else if (symbol instanceof Connector) {
                let getConnectorDefaults: Function = getFunction(this.getConnectorDefaults);
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
        for (let symbol of symbolGroup.symbols) {
            if (!(symbol instanceof Node && symbol.children)) {
                this.prepareSymbol(symbol);
            }
        }
        for (let symbol of group) {
            this.prepareSymbol(symbol);
        }
    }

    /**
     * Method to create the palette
     */
    private renderPalette(symbolGroup: PaletteModel): void {
        let style: string = 'display:none;overflow:auto;';
        if (symbolGroup.height) {
            style += 'height:' + symbolGroup.height + 'px';
        }
        let paletteDiv: HTMLElement = createHtmlElement('div', { 'id': symbolGroup.id, style: style });
        this.element.appendChild(paletteDiv);

        let item: AccordionItemModel = {
            header: symbolGroup.title, expanded: symbolGroup.expanded,
            content: '#' + symbolGroup.id, iconCss: symbolGroup.iconCss
        };
        this.accordionElement.items.push(item);
        this.renderSymbols(symbolGroup, paletteDiv);
    }
    /**
     * Used to add the palette item as nodes or connectors in palettes
     */
    public addPaletteItem(paletteName: string, paletteSymbol: NodeModel | ConnectorModel): void {
        let refresh: boolean;
        for (let i: number = 0; i < this.palettes.length; i++) {
            let symbolPaletteGroup: PaletteModel = this.palettes[i];
            if (symbolPaletteGroup.id.indexOf(paletteName) !== -1) {
                // tslint:disable-next-line:no-any 
                let param: any = [undefined, symbolPaletteGroup, 'symbols', {}, true];
                // tslint:disable-next-line:no-any 
                let obj: any = new (Function.prototype.bind.apply(getObjectType(paletteSymbol), param));
                for (let i: number = 0; i < Object.keys(paletteSymbol).length; i++) {
                    obj[Object.keys(paletteSymbol)[i]] = paletteSymbol[Object.keys(paletteSymbol)[i]];
                }
                symbolPaletteGroup.symbols.push(obj);
                if (!(obj as Node).children) {
                    this.prepareSymbol(obj);
                }
                this.symbolTable[obj.id] = obj;
                let paletteDiv: HTMLElement = document.getElementById(symbolPaletteGroup.id);
                paletteDiv.appendChild(this.getSymbolContainer(obj, paletteDiv));
                break;
            }
        }
    }

    /**
     * Used to remove the palette item as nodes or connectors in palettes
     */
    public removePaletteItem(paletteName: string, symbolId: string): void {
        let refresh: boolean;
        for (let i: number = 0; i < this.palettes.length; i++) {
            let symbolPaletteGroup: PaletteModel = this.palettes[i];
            if (symbolPaletteGroup.id.indexOf(paletteName) !== -1) {
                for (let symbol of symbolPaletteGroup.symbols) {
                    if (symbol.id.indexOf(symbolId) !== -1) {
                        let index: number = symbolPaletteGroup.symbols.indexOf(symbol);
                        symbolPaletteGroup.symbols.splice(index, 1);
                        if ((symbol as Node).children) {
                            let parentNode: string[] = (symbol as Node).children;
                            for (let i: number = 0; i < parentNode.length; i++) {
                                delete this.symbolTable[(parentNode[i])];
                            }
                        }
                        delete this.symbolTable[symbol.id];
                        let element: HTMLElement = document.getElementById(symbol.id + '_container');
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

    /**
     * Method to create the symbols in canvas
     */
    private prepareSymbol(symbol: NodeModel | ConnectorModel): void {
        let width: number; let sw: number;
        let height: number; let sh: number;
        let stackPanel: StackPanel = new StackPanel();
        let obj: NodeModel = symbol as NodeModel;
        let content: DiagramElement; let symbolContainer: Canvas = new Canvas();
        let container: Container = (symbol instanceof Node) ? (symbol as Node).initContainer() : null;
        if (container && !container.children) {
            container.children = [];
        }
        //preparing objects
        let getSymbolTemplate: Function = getFunction(this.getSymbolTemplate);
        if (getSymbolTemplate) {
            content = getSymbolTemplate(symbol);
        }
        if (!content) {
            if (obj.children) {
                content = this.getContainer(obj as Node, container);
            } else {
                content = (symbol as Node).init(this);
                if (symbol instanceof Node && symbol.parentId) {
                    container.children.push(content);
                }
            }
        }
        if (!(symbol as Node | Connector).parentId) {
            let symbolInfo: SymbolInfo = { width: this.symbolWidth, height: this.symbolHeight };
            let getSymbolInfo: Function = getFunction(this.getSymbolInfo);
            if (getSymbolInfo) {
                symbolInfo = getSymbolInfo(symbol);
            }
            symbolInfo = symbolInfo || {};
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
                let actualWidth: number = width;
                let actualHeight: number = height;
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
                sw = actualWidth / (content.width || width);
                sh = actualHeight / (content.height || height);
                if (symbolInfo.fit) {
                    sw = actualWidth / symbolInfo.width;
                    sh = actualHeight / symbolInfo.height;
                }
                width = actualWidth;
                height = actualHeight;
                sw = sh = Math.min(sw, sh);
                symbolContainer.width = width;
                symbolContainer.height = height;
                content.width = symbolInfo.width;
                content.height = symbolInfo.height;
                this.scaleSymbol(symbol, symbolContainer, sw, sh, width, height);
            } else {
                let outerBounds: Rect;
                if (symbol instanceof Connector) {
                    outerBounds = getOuterBounds(symbol);
                }
                content.width = (symbol as Node).width || (outerBounds) ? outerBounds.width : content.actualSize.width;
                content.height = (symbol as Node).height || (outerBounds) ? outerBounds.height : content.actualSize.height;
            }
            symbol.wrapper = stackPanel;
            stackPanel.children = [symbolContainer];
            content.pivot = stackPanel.pivot = { x: 0, y: 0 };
            stackPanel.id = content.id + '_symbol';
            stackPanel.style.fill = stackPanel.style.strokeColor = 'transparent';
            stackPanel.offsetX = symbol.style.strokeWidth / 2;
            stackPanel.offsetY = symbol.style.strokeWidth / 2;
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

    private getContainer(obj: Node, container: Container): Container {
        container.measureChildren = false;
        let bounds: Rect;
        let child: string[] = obj.children;
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


    /**
     * Method to get the symbol text description
     * @return {void}
     * @private
     */
    private getSymbolDescription(symbolInfo: SymbolInfo, width: number, parent: StackPanel | Container): void {
        if (symbolInfo && symbolInfo.description && symbolInfo.description.text) {
            let textElement: TextElement = new TextElement();
            //symbol description-textElement
            symbolInfo.description.overflow = symbolInfo.description.overflow || 'Ellipsis';
            symbolInfo.description.wrap = symbolInfo.description.wrap || 'WrapWithOverflow';
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

    /**
     * Method to renders the symbols
     * @return {void}
     * @private
     */
    private renderSymbols(symbolGroup: PaletteModel, parentDiv: HTMLElement): void {
        for (let symbol of symbolGroup.symbols) {
            if (!(symbol as Node | Connector).parentId) {
                this.getSymbolContainer(symbol, parentDiv);
            }
        }
    }

    /**
     * Method to clone the symbol for previewing the symbols
     * @return {void}
     * @private
     */
    private getSymbolPreview(
        symbol: NodeModel | ConnectorModel, evt: PointerEvent | TouchEvent, parentDiv: HTMLElement): HTMLElement {
        let canvas: HTMLCanvasElement | SVGElement;
        let sw: number; let sh: number;
        let symbolPreviewWidth: number = symbol.wrapper.children[0].desiredSize.width + symbol.style.strokeWidth;
        let symbolPreviewHeight: number = symbol.wrapper.children[0].desiredSize.height + symbol.style.strokeWidth;
        let content: DiagramElement = (symbol.wrapper.children[0] as Container).children[0];

        if (this.symbolPreview.width !== undefined || this.symbolPreview.height !== undefined) {
            symbolPreviewWidth = (this.symbolPreview.width || symbolPreviewWidth) - symbol.style.strokeWidth;
            symbolPreviewHeight = (this.symbolPreview.height || symbolPreviewHeight) - symbol.style.strokeWidth;
            sw = symbolPreviewWidth / content.actualSize.width;
            sh = symbolPreviewHeight / content.actualSize.height;
            sw = sh = Math.min(sw, sh);
            let symbolWidth: number = content.actualSize.width * sw;
            let symbolHeight: number = content.actualSize.height * sh;
            symbol.wrapper.children[0].width = symbolPreviewWidth;
            symbol.wrapper.children[0].height = symbolPreviewHeight;
            this.measureAndArrangeSymbol(content, symbol instanceof Node);
            this.scaleSymbol(
                symbol, symbol.wrapper.children[0] as Container, sw, sh, symbolWidth, symbolHeight, true);
            symbolPreviewWidth = symbolWidth;
            symbolPreviewHeight = symbolHeight;
        }
        let prevPosition: PointModel = { x: content.offsetX, y: content.offsetY };
        content.offsetX = content.offsetY = symbol.style.strokeWidth / 2;
        content.pivot = { x: 0, y: 0 };
        this.measureAndArrangeSymbol(content, symbol instanceof Node);
        let previewContainer: HTMLElement = createHtmlElement(
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
            let gElement: SVGElement = createSvgElement('g', { id: symbol.id + '_g' });
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
                style += 'transform:scale(0.5);';
                canvas.setAttribute('transform-origin', '0 0');
                let index: number = 2;
                if (symbol instanceof Connector) { index = 1.9; }
                canvas.getContext('2d').setTransform(index, 0, 0, index, 0, 0);
                this.diagramRenderer.renderElement(content, canvas, undefined);
            }
        }
        ((div && (symbol.shape.type === 'HTML' || (symbol as NodeModel).children
            && (symbol as NodeModel).children.length > 0)) ? div : canvas).setAttribute('style', style);
        content.offsetX = prevPosition.x;
        content.offsetY = prevPosition.y;
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
        let element: DiagramElement = (symbol.wrapper.children[0] as Container).children[0];
        let strokeWidth: number = symbol.style.strokeWidth;
        element.width = (width || element.width) - (strokeWidth + 1);
        element.height = (height || element.height) - (strokeWidth + 1);
        symbol.wrapper.measure(new Size());
        symbol.wrapper.arrange(symbol.wrapper.desiredSize);
    }

    /**
     * Method to create canvas and render the symbol
     * @return {void}
     * @private
     */
    private getSymbolContainer(symbol: NodeModel | ConnectorModel, parentDiv: HTMLElement, preview?: boolean): HTMLElement {
        let symbolInfo: SymbolInfo = this.symbolTable[symbol.id][this.info];
        let size: Size = this.getSymbolSize(symbol, symbolInfo);
        let width: number = size.width + 1;
        let height: number = size.height + 1;
        let container: HTMLElement = createHtmlElement(
            'div', {
                id: symbol.id + '_container',
                style: 'width:' + width + 'px;height:' + height + 'px;float:left;overflow:hidden',
                title: symbolInfo.description ? symbolInfo.description.text : symbol.id
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
                this.diagramRenderer.renderElement(symbol.wrapper, gElement || canvas, undefined, undefined, undefined, undefined, true);
            }
        }
        if (!preview) {
            let actualWidth: number = symbol.wrapper.actualSize.width + symbol.style.strokeWidth;
            let actualHeight: number = symbol.wrapper.actualSize.height + symbol.style.strokeWidth;
            let style: string = 'margin-left:' +
                Math.max(this.symbolMargin.left, ((width - actualWidth) / 2))
                + 'px;margin-top:' + Math.max(this.symbolMargin.top, ((height - actualHeight) / 2))
                + 'px;pointer-events:none;transform-origin:0 0;overflow:hidden;';
            if (canvas instanceof HTMLCanvasElement) {
                style += 'transform:scale(.5,.5);';
            }
            ((div && (symbol.shape.type === 'HTML' || (symbol as NodeModel).children &&
                (symbol as NodeModel).children.length > 0)) ? div : canvas).setAttribute('style', style);
            container.classList.add('e-symbol-draggable');
            return container;
        }
        return canvas as HTMLElement;
    }

    private getGroupParent(
        item: NodeModel | ConnectorModel, canvas: HTMLCanvasElement | SVGElement,
        container: HTMLElement, height: number, width: number, isPreview: boolean): HTMLElement {
        let div: HTMLElement = createHtmlElement(
            'div', { 'id': item.id + (isPreview ? '_html_div_preview' : '_html_div') });
        let htmlLayer: HTMLElement = createHtmlElement(
            'div', {
                'id': item.id + (isPreview ? '_htmlLayer_preview' : '_htmlLayer'),
                'style': 'width:' + Math.ceil(width + 1) + 'px;' +
                'height:' + Math.ceil(height + 1) + 'px;position:absolute',
                'class': 'e-html-layer'
            });
        let htmlLayerDiv: HTMLElement = createHtmlElement(
            'div', {
                'id': item.id + (isPreview ? '_htmlLayer_div_preview' : '_htmlLayer_div'),
                'style': 'width:' + Math.ceil(width + 1) + 'px;' +
                'height:' + Math.ceil(height + 1) + 'px;position:absolute',
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
        let div: HTMLElement = createHtmlElement(
            'div', {
                'id': symbol.id + (isPreview ? '_html_div_preview' : '_html_div')
            }
        );
        let htmlLayer: HTMLElement = createHtmlElement(
            'div', {
                'id': symbol.id + (isPreview ? '_htmlLayer_preview' : '_htmlLayer'),
                'style': 'width:' + Math.ceil(width + 1) + 'px;' +
                'height:' + Math.ceil(height + 1) + 'px;position:absolute',
                'class': 'e-html-layer'
            });
        let htmlLayerDiv: HTMLElement = createHtmlElement(
            'div', {
                'id': symbol.id + (isPreview ? '_htmlLayer_div_preview' : '_htmlLayer_div'),
                'style': 'width:' + Math.ceil(width + 1) + 'px;' +
                'height:' + Math.ceil(height + 1) + 'px;position:absolute',
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
            let pageY: number = touchArg.changedTouches[0].clientY;
            let pageX: number = touchArg.changedTouches[0].clientX;
            offsetY = pageY - this.element.offsetTop;
            offsetX = pageX - this.element.offsetLeft;
        } else {
            offsetY = (e as PointerEvent).clientY - this.element.offsetTop;
            offsetX = (e as PointerEvent).clientX - this.element.offsetLeft;
        }
        return { x: offsetX, y: offsetY };
    }

    private mouseMove(e: PointerEvent | TouchEvent, touches: TouchList): void {
        if (this.highlightedSymbol && (!this.selectedSymbol
            || this.selectedSymbol.id + '_container' !== this.highlightedSymbol.id)) {
            this.highlightedSymbol.classList.remove('e-symbol-hover');
            this.highlightedSymbol.style.backgroundColor = '';
            this.highlightedSymbol = null;
        }
        let id: string = (<HTMLElement>e.target).id.split('_container')[0];
        if (this.symbolTable[id]) {
            let container: HTMLElement = document.getElementById(id + '_container');
            container.classList.add('e-symbol-hover');
            this.highlightedSymbol = container;
        }
        e.preventDefault();
    }

    private mouseUp(evt: PointerEvent): void {
        if (evt && evt.target) {
            if (evt.srcElement.id === 'iconSearch') {
                let element: HTMLElement = document.getElementById('iconSearch');
                if (element.classList.contains('e-clear-searchtext')) {
                    element.className = 'e-input-group-icon e-search e-icons';
                    (document.getElementById('textEnter') as HTMLInputElement).value = '';
                    this.searchPalette('');
                }
            } else {
                let id: string = (<HTMLElement>evt.target).id.split('_container')[0];
                if (id && this.selectedSymbol) {
                    let args: IPaletteSelectionChangeArgs = { oldValue: this.selectedSymbol.id, newValue: id };
                    let event: string = 'paletteSelectionChange';
                    this.trigger(event, args);
                    evt.preventDefault();
                }
            }
        }
    }

    private keyUp(evt: KeyboardEvent): void {
        if (this.enableSearch) {
            let palette: SymbolPalette = this;
            let element: HTMLElement = document.getElementById('iconSearch');
            element.className = 'e-input-group-icon e-clear-searchtext e-icons';
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
        let id: string = (<HTMLElement>evt.target).id.split('_container')[0];
        if (this.selectedSymbol) {
            let oldSymbol: HTMLElement = document.getElementById(this.selectedSymbol.id + '_container');
            if (id !== this.selectedSymbol.id && oldSymbol) {
                oldSymbol.classList.remove('e-symbol-selected');
            }
            let container: HTMLElement = document.getElementById(this.selectedSymbol.id + '_container');
            if (container) {
                container.style.backgroundColor = '';
            }
            this.selectedSymbol = null;
        }
        if (this.symbolTable[id]) {
            let container: HTMLElement = document.getElementById(id + '_container');
            container.classList.add('e-symbol-selected');
            this.selectedSymbol = this.symbolTable[id];
            evt.preventDefault();
        }
    }

    //end region - event handlers

    // region - draggable

    private initDraggable(): void {
        if (this.allowDrag) {
            let drag: Draggable;
            this.draggable = new Draggable(this.element, {
                dragTarget: '.e-symbol-draggable',
                helper: this.helper,
                dragStart: this.dragStart,
                dragStop: this.dragStop,
                drag: (args: Object) => {
                    let target: string = 'target';
                    let parent: Element = parentsUntil(args[target], 'e-droppable');
                    if (parent && parent.classList.contains('e-diagram')) {
                        let e2eInstance: string = 'ej2_instances';
                        parent[e2eInstance][0].droppable.over(args);
                    }
                },
                cursorAt: { left: this.symbolPreview.offset.x, top: this.symbolPreview.offset.y }
            });
        }
    }

    /**
     * helper method for draggable
     * @return {void}
     * @private
     */
    private helper: Function = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
        let clonedElement: HTMLElement;
        let id: string = (e.sender.target as Element).id.split('_container')[0];
        let symbol: IElement = this.symbolTable[id];
        if (symbol && this.selectedSymbol) {
            this.selectedSymbols = this.selectedSymbol.id === (symbol as NodeModel | ConnectorModel).id ? symbol : this.selectedSymbol;
            let position: PointModel = this.getMousePosition(e.sender);
            clonedElement = this.getSymbolPreview(this.selectedSymbols, e.sender, this.element);
            clonedElement.setAttribute('paletteId', this.element.id);
        }
        return clonedElement;
    }

    private dragStart(e: MouseEvent): void {
        let element: HTMLElement = this.helper[0];
        if (element) {
            element.setAttribute('paletteId', this.element.id);
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
            let wrapper: Container = symbol.wrapper;
            symbol.wrapper = symbolContainer.children[0] as Container;
            let point: PointModel = symbol.scale(sw, sh, width, height, symbolContainer.children[0]);
            let difX: number = width / 2 - (symbolContainer.children[0] as Container).children[0].offsetX + point.x / 2;
            let difY: number = height / 2 - (symbolContainer.children[0] as Container).children[0].offsetY + point.y / 2;
            for (let child of (symbolContainer.children[0] as Container).children) {
                child.offsetX += difX;
                child.offsetY += difY;
                child.staticSize = false;
            }
            symbol.wrapper = wrapper;
        } else if (symbol.shape instanceof BpmnShape && this.bpmnModule) {
            let wrapper: Container = symbol.wrapper;
            symbol.wrapper = symbolContainer;
            symbolContainer.children[0].width = width;
            symbolContainer.children[0].height = height;
            this.bpmnModule.updateBPMN(
                { width: width, height: height } as Node,
                symbol as Node, symbol as Node, null);
            symbol.wrapper = wrapper;
        } else {
            if ((symbol as Node).children) {
                let parentNode: string[] = (symbol as Node).children;
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
                    let node: Node;
                    let scaleWidth: number;
                    let scaleHeight: number;
                    let children: DiagramElement;
                    for (let i: number = 0; i < parentNode.length; i++) {
                        node = this.symbolTable[parentNode[i]];
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
        this.accordionElement.items = [];
        this.updatePalettes();
        this.accordionElement.dataBind();
    }

    private updatePalettes(): void {
        for (let i: number = 0; i < this.palettes.length; i++) {
            let symGroup: PaletteModel = this.palettes[i];
            this.initSymbols(symGroup);
            this.renderPalette(symGroup);
        }
    }

    private createTextbox(): void {
        let searchDiv: HTMLElement = createHtmlElement('div', { id: this.element.id + '_search' });
        searchDiv.setAttribute('style', 'backgroundColor:white;height:30px');
        searchDiv.className = 'e-input-group';
        this.element.appendChild(searchDiv);
        let textBox: HTMLInputElement = createHtmlElement('input', {}) as HTMLInputElement;
        textBox.placeholder = 'Search Shapes';
        textBox.id = 'textEnter';
        textBox.setAttribute('style', 'width:100%;height:auto');
        textBox.className = 'e-input';
        searchDiv.appendChild(textBox);
        let span: HTMLElement = createHtmlElement('span', { id: 'iconSearch', className: 'e-input-group-icon e-search e-icons' });
        searchDiv.appendChild(span);
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
            let symbolPaletteGroup: PaletteModel = this.palettes[i];
            for (let j: number = 0; j < symbolPaletteGroup.symbols.length; j++) {
                let item: (NodeModel | ConnectorModel) = symbolPaletteGroup.symbols[j];
                if (value !== '' && item.id.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    symbolGroup.push(item);
                }
            }
        }
        let filterSymbols: Function = getFunction(this.filterSymbols);
        if (filterSymbols) {
            symbolGroup = filterSymbols(symbolGroup) || [];
        }

        //create a palette collection
        if (!element) {
            paletteDiv = this.createSearchPalette(paletteDiv);
            element = paletteDiv;
        }
        //add the symbols into search palette
        if (symbolGroup.length > 0) {
            for (let symbol of symbolGroup) {
                this.getSymbolContainer(symbol, element);
            }
        } else if (value !== '') {
            let emptyDiv: HTMLElement = createHtmlElement('div', { 'id': 'EmptyDiv', 'style': 'text-align:center;font-style:italic' });
            emptyDiv.innerHTML = 'No Items To Display';
            element.appendChild(emptyDiv);
        } else {
            let element: HTMLElement = document.getElementById('iconSearch');
            element.className = 'e-input-group-icon e-search e-icons';
            this.accordionElement.removeItem(0);
        }
    }

    private createSearchPalette(paletteDiv: HTMLElement): HTMLElement {
        paletteDiv = createHtmlElement('div', { 'id': 'SearchPalette', 'style': 'display:none;overflow:auto;' });
        this.element.appendChild(paletteDiv);
        let paletteCollection: AccordionItemModel = {
            header: 'Search Results', expanded: true,
            content: '#SearchPalette',
        };
        this.accordionElement.addItem(paletteCollection, 0);
        return paletteDiv;
    }

    /**
     * Method to bind events for the symbol palette
     */
    private wireEvents(): void {
        let startEvent: string = Browser.touchStartEvent;
        let stopEvent: string = Browser.touchEndEvent;
        let moveEvent: string = Browser.touchMoveEvent;
        let cancelEvent: string = 'mouseleave';
        let keyEvent: string = 'keyup';

        EventHandler.add(this.element, startEvent, this.mouseDown, this);
        EventHandler.add(this.element, moveEvent, this.mouseMove, this);
        EventHandler.add(this.element, stopEvent, this.mouseUp, this);
        EventHandler.add(this.element, keyEvent, this.keyUp, this);
        // initialize the draggable component
        this.initDraggable();
    }

    /**
     * Method to unbind events for the symbol palette
     */
    private unWireEvents(): void {
        let startEvent: string = Browser.touchStartEvent;
        let stopEvent: string = Browser.touchEndEvent;
        let moveEvent: string = Browser.touchMoveEvent;
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        let keyEvent: string = 'keyup';
        EventHandler.remove(this.element, startEvent, this.mouseDown);
        EventHandler.remove(this.element, moveEvent, this.mouseMove);
        EventHandler.remove(this.element, stopEvent, this.mouseUp);
        EventHandler.remove(this.element, keyEvent, this.keyUp);
    }

    //end region - helper methods
}

/**
 * Defines the size and description of a symbol
 */
export interface SymbolInfo {

    /**
     * Defines the width of the symbol to be drawn over the palette
     * @aspDefaultValueIgnore
     * @default undefined
     */
    width?: number;

    /**
     * Defines the height of the symbol to be drawn over the palette
     * @aspDefaultValueIgnore
     * @default undefined
     */
    height?: number;

    /**
     * Defines whether the symbol has to be fit inside the size, that is defined by the symbol palette
     * @default true
     */
    fit?: boolean;

    /**
     * Define the template of the symbol that is to be drawn over the palette
     * @default null
     */
    template?: DiagramElement;

    /**
     * Define the text to be displayed and how that is to be handled.
     * @default null
     */
    description?: SymbolDescription;
}

/**
 * Defines the textual description of a symbol
 */
export interface SymbolDescription {

    /**
     * Defines the symbol description
     * @aspDefaultValueIgnore
     * @default undefined
     */
    text?: string;

    /**
     * Defines how to handle the text when its size exceeds the given symbol size
     * * Wrap - Wraps the text to next line, when it exceeds its bounds
     * * Ellipsis - It truncates the overflown text and represents the clipping with an ellipsis
     * * Clip - It clips the overflow text
     * @default ellipsis
     */
    overflow?: TextOverflow;

    /**
     * Defines how to wrap the text
     * * WrapWithOverflow - Wraps the text so that no word is broken
     * * Wrap - Wraps the text and breaks the word, if necessary
     * * NoWrap - Text will no be wrapped
     * @default Wrap
     */
    wrap?: TextWrap;
}
