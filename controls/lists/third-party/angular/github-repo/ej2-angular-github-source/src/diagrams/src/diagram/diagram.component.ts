import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Diagram } from '@syncfusion/ej2-diagrams';
import { Template } from '@syncfusion/ej2-angular-base';
import { LayersDirective } from './layers.directive';
import { CustomCursorsDirective } from './customcursor.directive';
import { ConnectorsDirective } from './connectors.directive';
import { NodesDirective } from './nodes.directive';

export const inputs: string[] = ['addInfo','annotationTemplate','backgroundColor','bridgeDirection','commandManager','connectorDefaults','connectors','constraints','contextMenuSettings','customCursor','dataSourceSettings','diagramSettings','drawingObject','enableCollaborativeEditing','enableConnectorSplit','enablePersistence','enableRtl','enableWebMcp','fixedUserHandleTemplate','getConnectorDefaults','getCustomCursor','getCustomProperty','getCustomTool','getDescription','getNodeDefaults','height','historyManager','layers','layout','locale','mode','model','nodeDefaults','nodeTemplate','nodes','pageSettings','rulerSettings','scrollSettings','segmentThumbShape','segmentThumbSize','selectedItems','serializationSettings','setNodeTemplate','snapSettings','tool','tooltip','updateSelection','userHandleTemplate','width'];
export const outputs: string[] = ['animationComplete','beforeWebMcpToolExecute','click','collectionChange','commandExecute','connectionChange','contextMenuBeforeItemRender','contextMenuClick','contextMenuOpen','created','dataLoaded','diagramExporting','diagramImporting','doubleClick','dragEnter','dragLeave','dragOver','drop','elementDraw','expandStateChange','fixedUserHandleClick','historyChange','historyStateChange','keyDown','keyUp','layoutUpdated','load','loaded','mouseEnter','mouseLeave','mouseOver','mouseWheel','onFixedUserHandleMouseDown','onFixedUserHandleMouseEnter','onFixedUserHandleMouseLeave','onFixedUserHandleMouseUp','onImageLoad','onUserHandleMouseDown','onUserHandleMouseEnter','onUserHandleMouseLeave','onUserHandleMouseUp','positionChange','propertyChange','rotateChange','scrollChange','segmentChange','segmentCollectionChange','selectionChange','sizeChange','sourcePointChange','targetPointChange','textEdit','erEntityChanged'];
export const twoWays: string[] = [''];

/**
 * Diagram Component
 * ```html
 * <ej-diagram></ej-diagram>
 * ```
 */
@Component({
    selector: 'ejs-diagram',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childLayers: new ContentChild(LayersDirective),
        childCustomCursor: new ContentChild(CustomCursorsDirective),
        childConnectors: new ContentChild(ConnectorsDirective),
        childNodes: new ContentChild(NodesDirective),
        annotationTemplate: new ContentChild('annotationTemplate'),
        nodeTemplate: new ContentChild('nodeTemplate'),
        fixedUserHandleTemplate: new ContentChild('fixedUserHandleTemplate'),
        userHandleTemplate: new ContentChild('userHandleTemplate')
    }
})
@ComponentMixins([ComponentBase])
export class DiagramComponent extends Diagram implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare animationComplete: any;
	declare beforeWebMcpToolExecute: any;
	declare click: any;
	declare collectionChange: any;
	declare commandExecute: any;
	declare connectionChange: any;
	declare contextMenuBeforeItemRender: any;
	declare contextMenuClick: any;
	declare contextMenuOpen: any;
	declare created: any;
	declare dataLoaded: any;
	declare diagramExporting: any;
	declare diagramImporting: any;
	declare doubleClick: any;
	declare dragEnter: any;
	declare dragLeave: any;
	declare dragOver: any;
	declare drop: any;
	declare elementDraw: any;
	declare expandStateChange: any;
	declare fixedUserHandleClick: any;
	declare historyChange: any;
	declare historyStateChange: any;
	declare keyDown: any;
	declare keyUp: any;
	declare layoutUpdated: any;
	declare load: any;
	declare loaded: any;
	declare mouseEnter: any;
	declare mouseLeave: any;
	declare mouseOver: any;
	declare mouseWheel: any;
	declare onFixedUserHandleMouseDown: any;
	declare onFixedUserHandleMouseEnter: any;
	declare onFixedUserHandleMouseLeave: any;
	declare onFixedUserHandleMouseUp: any;
	declare onImageLoad: any;
	declare onUserHandleMouseDown: any;
	declare onUserHandleMouseEnter: any;
	declare onUserHandleMouseLeave: any;
	declare onUserHandleMouseUp: any;
	declare positionChange: any;
	declare propertyChange: any;
	declare rotateChange: any;
	declare scrollChange: any;
	declare segmentChange: any;
	declare segmentCollectionChange: any;
	declare selectionChange: any;
	declare sizeChange: any;
	declare sourcePointChange: any;
	declare targetPointChange: any;
	declare textEdit: any;
	public declare erEntityChanged: any;
    public declare childLayers: QueryList<LayersDirective>;
    public declare childCustomCursor: QueryList<CustomCursorsDirective>;
    public declare childConnectors: QueryList<ConnectorsDirective>;
    public declare childNodes: QueryList<NodesDirective>;
    public tags: string[] = ['layers', 'customCursor', 'connectors', 'nodes'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('DiagramsHierarchicalTree');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsMindMap');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsRadialTree');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsComplexHierarchicalTree');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsDataBinding');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsSnapping');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsPrintAndExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsBpmnDiagrams');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsSymmetricLayout');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsConnectorBridging');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsUndoRedo');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsDiagramCollaboration');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsLayoutAnimation');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsDiagramContextMenu');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsLineRouting');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsAvoidLineOverlapping');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsConnectorEditing');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsLineDistribution');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsEj1Serialization');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsFlowchartLayout');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('DiagramsImportAndExportVisio');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.context  = new ComponentBase();
    }

    public ngOnInit() {
        this.context.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.context.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.context.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        this.tagObjects[0].instance = this.childLayers;
        
	    if (this.childCustomCursor) {
            this.tagObjects[1].instance = this.childCustomCursor;
        }
        
	    if (this.childConnectors) {
            this.tagObjects[2].instance = this.childConnectors;
        }
        
	    if (this.childNodes) {
            this.tagObjects[3].instance = this.childNodes;
        }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}
Template()(DiagramComponent.prototype, 'annotationTemplate');
Template()(DiagramComponent.prototype, 'nodeTemplate');
Template()(DiagramComponent.prototype, 'fixedUserHandleTemplate');
Template()(DiagramComponent.prototype, 'userHandleTemplate');


