/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { GridlinesModel, SnapSettingsModel } from '../../../src/diagram/diagram/grid-lines-model';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
import { BpmnDiagrams, BpmnFlowModel, ComplexHierarchicalTree, ConnectorBridging, ConnectorConstraints, ConnectorModel, DataBinding, DiagramConstraints, DiagramContextMenu, DiagramTools, FlipDirection, FlowchartLayout, HierarchicalTree, LayoutAnimation, LineDistribution, SelectorConstraints, UndoRedo } from '../../../src/diagram/index';
Diagram.Inject(ConnectorBridging,DiagramContextMenu,DataBinding,LineDistribution,LayoutAnimation,UndoRedo,BpmnDiagrams,FlowchartLayout,HierarchicalTree,ComplexHierarchicalTree)
/**
 * Gridlines
 */
describe('Diagram Control', () => {

    describe('Gridlines', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagramd' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1000px', height: '600px'
            });
            diagram.appendTo('#diagramd');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking default gridlines', (done: Function) => {

            done();
        });
        it('Checking horizontalgridlines with custom style', (done: Function) => {
            let horizontalGridlines: GridlinesModel = { lineColor: 'blue', lineDashArray: '2,2' };
            let verticalGridlines: GridlinesModel = { lineColor: 'red', lineDashArray: '2,2' };
            let snapSettings: SnapSettingsModel = { horizontalGridlines: horizontalGridlines };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            done();
        });
        it('Checking verticalGridlines', (done: Function) => {
            let horizontalGridlines: GridlinesModel = { lineColor: 'blue', lineDashArray: '2,2' };
            let verticalGridlines: GridlinesModel = { lineColor: 'red', lineDashArray: '2,2' };
            let snapSettings: SnapSettingsModel = {verticalGridlines: verticalGridlines };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            done();
        });
        it('Checking gridlines with custom style', (done: Function) => {
            let horizontalGridlines: GridlinesModel = { lineColor: 'blue', lineDashArray: '2,2', lineIntervals: [1, 14, 0.5, 14.5] };
            let verticalGridlines: GridlinesModel = { lineColor: 'red', lineDashArray: '2,2', lineIntervals: [1, 14, 0.5, 14.5] };
            let snapSettings: SnapSettingsModel = { horizontalGridlines: horizontalGridlines, verticalGridlines: verticalGridlines };
            diagram.snapSettings = snapSettings;
            diagram.dataBind();
            done();
        });
        });

    describe('Gridlines', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagramgridcount' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1000px', height: '600px',
                rulerSettings: {
                    showRulers: true,
                    horizontalRuler: {
                        segmentWidth: 50,
                        interval: 10
                    },
                    verticalRuler: {
                        segmentWidth: 200,
                        interval: 20
                    }
                }
            });
            diagram.appendTo('#diagramgridcount');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking dynamic gridlines', (done: Function) => {
            let pattern: HTMLElement = document.getElementById('diagramgridcount_pattern');
            expect(Number(pattern.getAttribute("height")) === diagram.rulerSettings.verticalRuler.segmentWidth &&
            Number(pattern.getAttribute("width")) === diagram.rulerSettings.horizontalRuler.segmentWidth &&
                pattern.children.length === (diagram.rulerSettings.horizontalRuler.interval +
                    diagram.rulerSettings.verticalRuler.interval)).toBe(true);
            done();
        });
        it('memory leak', () => { 
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        })
    });

    describe('TS-null-undefined test in diagram properties', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagramNullUndefined' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1000px', height: '600px',
            });
            diagram.appendTo('#diagramNullUndefined');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Width and height properties', (done: Function) => {
            diagram.destroy();
            diagram = new Diagram({width: null, height: null});
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.width === '100%' && diagram.height === '100%').toBe(true);
            diagram.destroy();
             diagram = new Diagram({width: undefined, height: undefined});
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.width === '100%' && diagram.height === '100%').toBe(true);
            diagram.destroy();
            done();
         });
        it('setting null and undefined values to diagram properties-1', (done: Function) => {
            diagram = new Diagram({
                width:1000,height:700,nodes:null,connectors:null,addInfo:null,backgroundColor:null,
                constraints:null,commandManager:null,connectorDefaults:null,contextMenuSettings:null,
                customCursor:null,dataSourceSettings:null,diagramSettings:null,drawingObject:null,
                enableConnectorSplit:null,enablePersistence:null,enableRtl:null,getConnectorDefaults:null,getNodeDefaults:null,
                historyManager:null,layers:null,layout:null,locale:null,mode:null,pageSettings:null,
                rulerSettings:null,snapSettings:null,tool:null,tooltip:null,segmentThumbShape:null,serializationSettings:null,
                selectedItems:null,scrollSettings:null,segmentThumbSize:null
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 0 && diagram.connectors.length === 0).toBe(true);
            expect(diagram.addInfo === null && diagram.backgroundColor === null).toBe(true);
            expect(diagram.constraints === null && diagram.commandManager !== null).toBe(true);
            expect(diagram.connectorDefaults === null && diagram.contextMenuSettings !== null).toBe(true);
            expect(diagram.customCursor !== null && diagram.dataSourceSettings !== null).toBe(true);
            expect(diagram.diagramSettings !== null && diagram.drawingObject === null).toBe(true);
            expect(diagram.enableConnectorSplit === null && diagram.enablePersistence === null).toBe(true);
            expect(diagram.enableRtl === false && diagram.getConnectorDefaults === null).toBe(true);
            expect(diagram.getNodeDefaults === null && diagram.historyManager === null).toBe(true);
            expect(diagram.layers.length === 1 && diagram.layout !== null).toBe(true);
            expect(diagram.locale === 'en-US' && diagram.mode === null).toBe(true);
            expect(diagram.pageSettings !== null && diagram.rulerSettings !== null).toBe(true);
            expect(diagram.snapSettings !== null && diagram.tool === null).toBe(true);
            expect(diagram.tooltip !== null && diagram.segmentThumbShape === null).toBe(true);
            expect(diagram.serializationSettings !== null && diagram.selectedItems !== null).toBe(true);
            expect(diagram.scrollSettings !== null && diagram.segmentThumbSize === null).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width:1000,height:700,nodes:undefined,connectors:undefined,addInfo:undefined,backgroundColor:undefined,
                constraints:undefined,commandManager:undefined,connectorDefaults:undefined,contextMenuSettings:undefined,
                customCursor:undefined,dataSourceSettings:undefined,diagramSettings:undefined,drawingObject:undefined,
                enableConnectorSplit:undefined,enablePersistence:undefined,enableRtl:undefined,getConnectorDefaults:undefined,getNodeDefaults:undefined,
                historyManager:undefined,layers:undefined,layout:undefined,locale:undefined,mode:undefined,pageSettings:undefined,
                rulerSettings:undefined,snapSettings:undefined,tool:undefined,tooltip:undefined,segmentThumbShape:undefined,serializationSettings:undefined,
                selectedItems:undefined,scrollSettings:undefined,segmentThumbSize:undefined
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 0 && diagram.connectors.length === 0).toBe(true);
            expect(diagram.addInfo === undefined && diagram.backgroundColor === 'transparent').toBe(true);
            expect(diagram.constraints === 500 && diagram.commandManager !== undefined).toBe(true);
            expect(diagram.connectorDefaults === undefined && diagram.contextMenuSettings !== undefined).toBe(true);
            expect(diagram.customCursor !== undefined && diagram.dataSourceSettings !== undefined).toBe(true);
            expect(diagram.diagramSettings !== undefined && diagram.drawingObject === undefined).toBe(true);
            expect(diagram.enableConnectorSplit === false && diagram.enablePersistence === false).toBe(true);
            expect(diagram.enableRtl === false && diagram.getConnectorDefaults === undefined).toBe(true);
            expect(diagram.getNodeDefaults === undefined && diagram.historyManager !== undefined).toBe(true);
            expect(diagram.layers.length === 1 && diagram.layout !== undefined).toBe(true);
            expect(diagram.locale === 'en-US' && diagram.mode === 'SVG').toBe(true);
            expect(diagram.pageSettings !== undefined && diagram.rulerSettings !== undefined).toBe(true);
            expect(diagram.snapSettings !== undefined && diagram.tool === 3).toBe(true);
            expect(diagram.tooltip !== undefined && diagram.segmentThumbShape === "Circle").toBe(true);
            expect(diagram.serializationSettings !== undefined && diagram.selectedItems !== undefined).toBe(true);
            expect(diagram.scrollSettings !== undefined && diagram.segmentThumbSize === 10).toBe(true);
            diagram.destroy();
            done();
        });
        it('setting null and undefined values to diagram properties-2', (done: Function) => {
            diagram = new Diagram({
                width:1000,height:700,nodes:[{id:'node1',width:100,shape:{type:'HTML'},height:100,offsetX:300,offsetY:300,annotations:[{id:'n1A1'}],fixedUserHandles:[{id:'h1'}]}],
                connectors:[
                    {id:'connector1',sourcePoint:{x:100,y:100},targetPoint:{x:200,y:200},annotations:[{id:'c1A1'}]},
                    {id:'connector2',sourcePoint:{x:100,y:200},targetPoint:{x:200,y:100},annotations:[{id:'c2A1'}]}
                ],
                bridgeDirection:null,fixedUserHandleTemplate:null,annotationTemplate:null,nodeTemplate:null,userHandleTemplate:null,
                selectedItems:{userHandles:[{name:'U1',offset:0.5}]},
                constraints:DiagramConstraints.Default|DiagramConstraints.Bridging,
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 1 && diagram.connectors.length === 2).toBe(true);
            expect(diagram.bridgeDirection === null && diagram.fixedUserHandleTemplate === null).toBe(true);
            expect(diagram.annotationTemplate === null && diagram.nodeTemplate === null).toBe(true);
            expect(diagram.userHandleTemplate === null && diagram.selectedItems.userHandles.length === 1).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width:1000,height:700,nodes:[{id:'node1',width:100,shape:{type:'HTML'},height:100,offsetX:300,offsetY:300,annotations:[{id:'n1A1'}],fixedUserHandles:[{id:'h1'}]}],
                connectors:[
                    {id:'connector1',sourcePoint:{x:100,y:100},targetPoint:{x:200,y:200},annotations:[{id:'c1A1'}]},
                    {id:'connector2',sourcePoint:{x:100,y:200},targetPoint:{x:200,y:100},annotations:[{id:'c2A1'}]}
                ],
                bridgeDirection:undefined,fixedUserHandleTemplate:undefined,annotationTemplate:undefined,nodeTemplate:undefined,userHandleTemplate:undefined,
                selectedItems:{userHandles:[{name:'U1',offset:0.5}]},
                constraints:DiagramConstraints.Default|DiagramConstraints.Bridging,
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 1 && diagram.connectors.length === 2).toBe(true);
            expect(diagram.bridgeDirection === 'Top' && diagram.fixedUserHandleTemplate === undefined).toBe(true);
            expect(diagram.annotationTemplate === undefined && diagram.nodeTemplate === undefined).toBe(true);
            expect(diagram.userHandleTemplate === undefined && diagram.selectedItems.userHandles.length === 1).toBe(true);
            diagram.destroy();
            done();
        });
        
        it('nodes and connectors properties', (done: Function) => {
            diagram = new Diagram({
                width: '1000px', height: '600px',
                connectors: [{id:null,sourcePoint:null,targetPoint:null,sourceID:null,targetID:null,type:null,sourcePortID:null,targetPortID:null,cornerRadius:null,addInfo:null,constraints:null,sourceDecorator:null,targetDecorator:null,annotations:null,ports:null,connectorSpacing:null,connectionPadding:null,bridgeSpace:null,style:null,bezierSettings:null,hitPadding:null,tooltip:null,fixedUserHandles:null,segments:null,visible:null}],
                nodes: [{id:null,offsetX:null,offsetY:null,pivot:null,addInfo:null,width:null,height:null,shape:null,style:null,ports:null,constraints:null,annotations:null,fixedUserHandles:null,flip:null,flipMode:null,tooltip:null,children:null,excludeFromLayout:null,expandIcon:null,collapseIcon:null,shadow:null,visible:null,verticalAlignment:null,horizontalAlignment:null,margin:null,rotateAngle:null,previewSize:null,dragSize:null}]
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 1 && diagram.connectors.length === 1).toBe(true);
            expect(diagram.nodes[0].id !== null && diagram.nodes[0].offsetX === null).toBe(true);
            expect(diagram.nodes[0].offsetY === null && diagram.nodes[0].width === null).toBe(true);
            expect(diagram.nodes[0].height === null && diagram.nodes[0].shape !== null).toBe(true);
            expect(diagram.nodes[0].style !== null && diagram.nodes[0].ports !== null).toBe(true);
            expect(diagram.nodes[0].constraints === null && diagram.nodes[0].annotations !== null).toBe(true);
            expect(diagram.nodes[0].fixedUserHandles !== null && diagram.nodes[0].flip === null).toBe(true);
            expect(diagram.nodes[0].flipMode === null && diagram.nodes[0].tooltip !== null).toBe(true);
            expect(diagram.nodes[0].children === null && diagram.nodes[0].excludeFromLayout === null).toBe(true);
            expect(diagram.nodes[0].expandIcon !== null && diagram.nodes[0].collapseIcon !== null).toBe(true);
            expect(diagram.nodes[0].shadow !== null && diagram.nodes[0].visible === null).toBe(true);
            expect(diagram.nodes[0].verticalAlignment === null && diagram.nodes[0].horizontalAlignment === null).toBe(true);
            expect(diagram.nodes[0].margin !== null && diagram.nodes[0].rotateAngle === null).toBe(true);
            expect(diagram.nodes[0].previewSize !== null && diagram.nodes[0].dragSize !== null).toBe(true);
            expect(diagram.nodes[0].pivot !== null).toBe(true);
            expect(diagram.nodes[0].zIndex === 0).toBe(true);
            expect(diagram.connectors[0].id !== null && diagram.connectors[0].sourcePoint !== null).toBe(true);
            expect(diagram.connectors[0].targetPoint !== null && diagram.connectors[0].type === null).toBe(true);
            expect(diagram.connectors[0].sourcePortID === null && diagram.connectors[0].targetPortID === null).toBe(true);
            expect(diagram.connectors[0].sourceID === null && diagram.connectors[0].targetID === null).toBe(true);
            expect(diagram.connectors[0].cornerRadius === null && diagram.connectors[0].addInfo === null).toBe(true);
            expect(diagram.connectors[0].constraints === null && diagram.connectors[0].sourceDecorator !== null).toBe(true);
            expect(diagram.connectors[0].targetDecorator !== null && diagram.connectors[0].annotations !== null).toBe(true);
            expect(diagram.connectors[0].ports !== null && diagram.connectors[0].connectorSpacing === null).toBe(true);
            expect(diagram.connectors[0].connectionPadding === null && diagram.connectors[0].bridgeSpace === null).toBe(true);
            expect(diagram.connectors[0].style !== null && diagram.connectors[0].bezierSettings !== null).toBe(true);
            expect(diagram.connectors[0].hitPadding === null && diagram.connectors[0].tooltip !== null).toBe(true);
            expect(diagram.connectors[0].fixedUserHandles !== null && diagram.connectors[0].segments !== null).toBe(true);
            expect(diagram.connectors[0].visible === null).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                connectors: [{id:undefined,sourcePoint:undefined,targetPoint:undefined,sourceID:undefined,targetID:undefined,type:undefined,sourcePortID:undefined,targetPortID:undefined,cornerRadius:undefined,addInfo:undefined,constraints:undefined,sourceDecorator:undefined,targetDecorator:undefined,annotations:undefined,ports:undefined,connectorSpacing:undefined,connectionPadding:undefined,bridgeSpace:undefined,style:undefined,bezierSettings:undefined,hitPadding:undefined,tooltip:undefined,fixedUserHandles:undefined,segments:undefined,visible:undefined}],
                nodes: [{id:undefined,offsetX:undefined,offsetY:undefined,pivot:undefined,addInfo:undefined,width:undefined,height:undefined,shape:undefined,style:undefined,ports:undefined,constraints:undefined,annotations:undefined,fixedUserHandles:undefined,flip:undefined,flipMode:undefined,tooltip:undefined,children:undefined,excludeFromLayout:undefined,expandIcon:undefined,collapseIcon:undefined,shadow:undefined,visible:undefined,verticalAlignment:undefined,horizontalAlignment:undefined,margin:undefined,rotateAngle:undefined,previewSize:undefined,dragSize:undefined}]
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 1 && diagram.connectors.length === 1).toBe(true);
            expect(diagram.nodes[0].id !== undefined && diagram.nodes[0].offsetX === 0).toBe(true);
            expect(diagram.nodes[0].offsetY === 0 && diagram.nodes[0].width === undefined).toBe(true);
            expect(diagram.nodes[0].height === undefined && diagram.nodes[0].shape !== undefined).toBe(true);
            expect(diagram.nodes[0].style !== undefined && diagram.nodes[0].ports !== undefined).toBe(true);
            expect(diagram.nodes[0].constraints === 5240814 && diagram.nodes[0].annotations !== undefined).toBe(true);
            expect(diagram.nodes[0].fixedUserHandles !== undefined && diagram.nodes[0].flip === FlipDirection.None).toBe(true);
            expect(diagram.nodes[0].flipMode === 'All' && diagram.nodes[0].tooltip !== undefined).toBe(true);
            expect(diagram.nodes[0].children === undefined && diagram.nodes[0].excludeFromLayout === false).toBe(true);
            expect(diagram.nodes[0].expandIcon !== undefined && diagram.nodes[0].collapseIcon !== undefined).toBe(true);
            expect(diagram.nodes[0].shadow !== undefined && diagram.nodes[0].visible === true).toBe(true);
            expect(diagram.connectors[0].id !== undefined && diagram.connectors[0].sourcePoint !== undefined).toBe(true);
            expect(diagram.connectors[0].targetPoint !== undefined && diagram.connectors[0].type === 'Straight').toBe(true);
            expect(diagram.connectors[0].sourcePortID === '' && diagram.connectors[0].targetPortID === '').toBe(true);
            expect(diagram.connectors[0].sourceID === '' && diagram.connectors[0].targetID === '').toBe(true);
            expect(diagram.connectors[0].cornerRadius === 0 && diagram.connectors[0].addInfo === undefined).toBe(true);
            expect(diagram.connectors[0].constraints === 2043454 && diagram.connectors[0].sourceDecorator !== undefined).toBe(true);
            expect(diagram.connectors[0].targetDecorator !== undefined && diagram.connectors[0].annotations !== undefined).toBe(true);
            expect(diagram.connectors[0].ports !== undefined && diagram.connectors[0].connectorSpacing === 13).toBe(true);
            expect(diagram.connectors[0].connectionPadding === 0 && diagram.connectors[0].bridgeSpace === 10).toBe(true);
            expect(diagram.connectors[0].style !== undefined && diagram.connectors[0].bezierSettings !== undefined).toBe(true);
            expect(diagram.connectors[0].hitPadding === 10 && diagram.connectors[0].tooltip !== undefined).toBe(true);
            expect(diagram.connectors[0].fixedUserHandles !== undefined && diagram.connectors[0].segments !== undefined).toBe(true);
            expect(diagram.connectors[0].visible === true).toBe(true);
            diagram.destroy();
            done();
        });
        it('diargam model properties', (done: Function) => {
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes:[{id:'node1',width:100,height:100,offsetX:100,offsetY:100,annotations:[{content:'Node1'}]}],
                scrollSettings: { scrollLimit: null, currentZoom: null, canAutoScroll: null, scrollableArea: null, minZoom: null, maxZoom: null, horizontalOffset: null, verticalOffset: null },
                pageSettings: { width: null, height: null, multiplePage: null, showPageBreaks: null, orientation: null, background: { source: null, color: null, align: null, scale: null }, boundaryConstraints: null },
                contextMenuSettings: { show: null, items: null },
                snapSettings: { constraints: null, horizontalGridlines: null, verticalGridlines: null, snapAngle: null, snapObjectDistance: null, snapLineColor: null },
                rulerSettings: { showRulers: null, horizontalRuler: null, verticalRuler: null, dynamicGrid: null },
                serializationSettings: { preventDefaults: null },
                dataSourceSettings: { dataSource: null, id: null, parentId: null, root: null },
                layout: { type: null, horizontalSpacing: null, verticalSpacing: null,orientation:null,margin: null,connectionPointOrigin:null,arrangement:null, fixedNode: null, getLayoutInfo: null, enableAnimation:null, enableRouting:null,flowchartLayoutSettings:null },
                selectedItems: { userHandles: null, constraints: null},
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 1).toBe(true);
            expect(diagram.scrollSettings.scrollLimit === null && diagram.scrollSettings.currentZoom === null).toBe(true);
            expect(diagram.scrollSettings.canAutoScroll === null && diagram.scrollSettings.scrollableArea === null).toBe(true);
            expect(diagram.scrollSettings.minZoom === null && diagram.scrollSettings.maxZoom === null).toBe(true);
            expect(diagram.scrollSettings.horizontalOffset === null && diagram.scrollSettings.verticalOffset === null).toBe(true);
            expect(diagram.pageSettings.width === null && diagram.pageSettings.height === null).toBe(true);
            expect(diagram.pageSettings.multiplePage === null && diagram.pageSettings.showPageBreaks === null).toBe(true);
            expect(diagram.pageSettings.orientation === null && diagram.pageSettings.background.source === null).toBe(true);
            expect(diagram.pageSettings.background.color === null && diagram.pageSettings.background.align === null).toBe(true);
            expect(diagram.pageSettings.background.scale === null && diagram.pageSettings.boundaryConstraints === null).toBe(true);
            expect(diagram.contextMenuSettings.show === null && diagram.contextMenuSettings.items === null).toBe(true);
            expect(diagram.snapSettings.constraints === null && diagram.snapSettings.horizontalGridlines !== null).toBe(true);
            expect(diagram.snapSettings.verticalGridlines !== null && diagram.snapSettings.snapAngle === null).toBe(true);
            expect(diagram.snapSettings.snapObjectDistance === null && diagram.snapSettings.snapLineColor === null).toBe(true);
            expect(diagram.rulerSettings.showRulers === null && diagram.rulerSettings.horizontalRuler !== null).toBe(true);
            expect(diagram.rulerSettings.verticalRuler !== null && diagram.rulerSettings.dynamicGrid === null).toBe(true);
            expect(diagram.serializationSettings.preventDefaults === null).toBe(true);
            expect(diagram.dataSourceSettings.dataSource === null && diagram.dataSourceSettings.id === null).toBe(true);
            expect(diagram.dataSourceSettings.parentId === null && diagram.dataSourceSettings.root === null).toBe(true);
            expect(diagram.layout.type === null && diagram.layout.horizontalSpacing === null).toBe(true);
            expect(diagram.layout.verticalSpacing === null && diagram.layout.margin !== null).toBe(true);
            expect(diagram.layout.fixedNode === null && diagram.layout.getLayoutInfo === null).toBe(true);
            expect(diagram.layout.enableAnimation === null && diagram.layout.enableRouting === null).toBe(true);
            expect(diagram.layout.orientation === null && diagram.layout.flowchartLayoutSettings !== null).toBe(true);
            expect(diagram.layout.connectionPointOrigin === null && diagram.layout.arrangement === null).toBe(true);
            expect(diagram.selectedItems.userHandles !== null && diagram.selectedItems.constraints === null).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes:[{id:'node1',width:100,height:100,offsetX:100,offsetY:100,annotations:[{content:'Node1'}]}],
                scrollSettings: { scrollLimit: undefined, currentZoom: undefined, canAutoScroll: undefined, scrollableArea: undefined, minZoom: undefined, maxZoom: undefined, horizontalOffset: undefined, verticalOffset: undefined },
                pageSettings: { width: undefined, height: undefined, multiplePage: undefined, showPageBreaks: undefined, orientation: undefined, background: { source: undefined, color: undefined, align: undefined, scale: undefined }, boundaryConstraints: undefined },
                contextMenuSettings: { show: undefined, items: undefined },
                snapSettings: { constraints: undefined, horizontalGridlines: undefined, verticalGridlines: undefined, snapAngle: undefined, snapObjectDistance: undefined, snapLineColor: undefined },
                rulerSettings: { showRulers: undefined, horizontalRuler: undefined, verticalRuler: undefined, dynamicGrid: undefined },
                serializationSettings: { preventDefaults: undefined },
                dataSourceSettings: { dataSource: undefined, id: undefined, parentId: undefined, root: undefined },
                layout: { type: undefined, horizontalSpacing: undefined,orientation:undefined, verticalSpacing: undefined, margin: undefined, fixedNode: undefined,connectionPointOrigin:undefined,arrangement:undefined, getLayoutInfo: undefined, enableAnimation:undefined, enableRouting:undefined,flowchartLayoutSettings:undefined },
                selectedItems: { userHandles: undefined, constraints: undefined},
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 1).toBe(true);
            expect(diagram.scrollSettings.scrollLimit === 'Diagram' && diagram.scrollSettings.currentZoom === 1).toBe(true);
            expect(diagram.scrollSettings.canAutoScroll === false && diagram.scrollSettings.scrollableArea === undefined).toBe(true);
            expect(diagram.scrollSettings.minZoom === 0.2 && diagram.scrollSettings.maxZoom === 30).toBe(true);
            expect(diagram.scrollSettings.horizontalOffset === 0 && diagram.scrollSettings.verticalOffset === 0).toBe(true);
            expect(diagram.pageSettings.width === null && diagram.pageSettings.height === null).toBe(true);
            expect(diagram.pageSettings.multiplePage === false && diagram.pageSettings.showPageBreaks === false).toBe(true);
            expect(diagram.pageSettings.orientation === 'Landscape' && diagram.pageSettings.background.source === '').toBe(true);
            expect(diagram.pageSettings.background.color === 'transparent' && diagram.pageSettings.background.align === 'None').toBe(true);
            expect(diagram.pageSettings.background.scale === 'None' && diagram.pageSettings.boundaryConstraints === 'Infinity').toBe(true);
            expect(diagram.contextMenuSettings.show === undefined && diagram.contextMenuSettings.items === undefined).toBe(true);
            expect(diagram.snapSettings.constraints === 31 && diagram.snapSettings.horizontalGridlines !== undefined).toBe(true);
            expect(diagram.snapSettings.verticalGridlines !== undefined && diagram.snapSettings.snapAngle === 5).toBe(true);
            expect(diagram.snapSettings.snapObjectDistance === 5 && diagram.snapSettings.snapLineColor === '#07EDE1').toBe(true);
            expect(diagram.rulerSettings.showRulers === false && diagram.rulerSettings.horizontalRuler !== undefined).toBe(true);
            expect(diagram.rulerSettings.verticalRuler !== undefined && diagram.rulerSettings.dynamicGrid === true).toBe(true);
            expect(diagram.serializationSettings.preventDefaults === false).toBe(true);
            expect(diagram.dataSourceSettings.dataSource === null && diagram.dataSourceSettings.id === '').toBe(true);
            expect(diagram.dataSourceSettings.parentId === '' && diagram.dataSourceSettings.root === '').toBe(true);
            expect(diagram.layout.type === 'None' && diagram.layout.horizontalSpacing === 30).toBe(true);
            expect(diagram.layout.verticalSpacing === 30 && diagram.layout.margin !== undefined).toBe(true);
            expect(diagram.layout.fixedNode === '' && diagram.layout.getLayoutInfo === undefined).toBe(true);
            expect(diagram.layout.enableAnimation === true && diagram.layout.enableRouting === false).toBe(true);
            expect(diagram.layout.orientation === 'TopToBottom' && diagram.layout.flowchartLayoutSettings !== undefined).toBe(true);
            expect(diagram.layout.connectionPointOrigin === 'SamePoint' && diagram.layout.arrangement === 'Nonlinear').toBe(true);
            expect(diagram.selectedItems.userHandles !== undefined && diagram.selectedItems.constraints === 16382).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                nodes: [{ id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }] }
                    , { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, annotations: [{ content: 'Node2' }], shape: { type: 'Flow', shape: 'Decision' } },
                { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node3' }] },
                { id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100, annotations: [{ content: 'Node4' }] }],
                connectors: [{ id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal' },
                { id: 'connector2', sourceID: 'node2', targetID: 'node3', type: 'Orthogonal', annotations: [{ content: 'Yes' }] },
                { id: 'connector3', sourceID: 'node2', targetID: 'node4', type: 'Orthogonal', annotations: [{ content: 'No' }] }],
                layout: { type: 'Flowchart', flowchartLayoutSettings: { yesBranchDirection: null, noBranchDirection: null, yesBranchValues: null, noBranchValues: null } },

          });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.layout.type === 'Flowchart' && diagram.layout.flowchartLayoutSettings !== null).toBe(true);
            expect(diagram.layout.flowchartLayoutSettings.yesBranchDirection === null && diagram.layout.flowchartLayoutSettings.noBranchDirection === null).toBe(true);
            expect(diagram.layout.flowchartLayoutSettings.yesBranchValues === null && diagram.layout.flowchartLayoutSettings.noBranchValues === null).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                nodes: [{ id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }] }
                    , { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, annotations: [{ content: 'Node2' }], shape: { type: 'Flow', shape: 'Decision' } },
                { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node3' }] },
                { id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100, annotations: [{ content: 'Node4' }] }],
                connectors: [{ id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal' },
                { id: 'connector2', sourceID: 'node2', targetID: 'node3', type: 'Orthogonal', annotations: [{ content: 'Yes' }] },
                { id: 'connector3', sourceID: 'node2', targetID: 'node4', type: 'Orthogonal', annotations: [{ content: 'No' }] }],
                layout: { type: 'Flowchart', flowchartLayoutSettings: { yesBranchDirection: undefined, noBranchDirection: undefined, yesBranchValues: undefined, noBranchValues: undefined } },
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.layout.type === 'Flowchart' && diagram.layout.flowchartLayoutSettings !== undefined).toBe(true);
            expect(diagram.layout.flowchartLayoutSettings.yesBranchDirection === 'LeftInFlow' && diagram.layout.flowchartLayoutSettings.noBranchDirection === 'RightInFlow').toBe(true);
            expect(diagram.layout.flowchartLayoutSettings.yesBranchValues.length === 2 && diagram.layout.flowchartLayoutSettings.noBranchValues.length === 2).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes: [{ id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }] }
                    , { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, annotations: [{ content: 'Node2' }], shape: { type: 'Flow', shape: 'Decision' } },
                { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node3' }] },
                { id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100, annotations: [{ content: 'Node4' }] }],
                connectors: [{ id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal' },
                { id: 'connector2', sourceID: 'node2', targetID: 'node3', type: 'Orthogonal', annotations: [{ content: 'Yes' }] },
                { id: 'connector3', sourceID: 'node2', targetID: 'node4', type: 'Orthogonal', annotations: [{ content: 'No' }] }],
                layout: { type: 'OrganizationalChart', orientation: null, horizontalSpacing: null, verticalSpacing: null, margin: null, getLayoutInfo: null,enableAnimation: null, },
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.layout.type === 'OrganizationalChart' && diagram.layout.orientation === null).toBe(true);
            expect(diagram.nodes.length === 4).toBe(true);
            expect(diagram.connectors.length === 3).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes: [{ id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }] }
                    , { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, annotations: [{ content: 'Node2' }], shape: { type: 'Flow', shape: 'Decision' } },
                { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node3' }] },
                { id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100, annotations: [{ content: 'Node4' }] }],
                connectors: [{ id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal' },
                { id: 'connector2', sourceID: 'node2', targetID: 'node3', type: 'Orthogonal', annotations: [{ content: 'Yes' }] },
                { id: 'connector3', sourceID: 'node2', targetID: 'node4', type: 'Orthogonal', annotations: [{ content: 'No' }] }],
                layout: { type: 'OrganizationalChart', orientation: undefined, horizontalSpacing: undefined, verticalSpacing: undefined, margin: undefined, getLayoutInfo: undefined,enableAnimation: undefined, },
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.layout.type === 'OrganizationalChart' && diagram.layout.orientation === 'TopToBottom').toBe(true);
            expect(diagram.layout.horizontalSpacing === 30 && diagram.layout.verticalSpacing === 30).toBe(true);
            expect(diagram.nodes.length === 4).toBe(true);
            expect(diagram.connectors.length === 3).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes: [{ id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }] }
                    , { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, annotations: [{ content: 'Node2' }], shape: { type: 'Flow', shape: 'Decision' } },
                { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node3' }] },
                { id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100, annotations: [{ content: 'Node4' }] }],
                connectors: [{ id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal' },
                { id: 'connector2', sourceID: 'node2', targetID: 'node3', type: 'Orthogonal', annotations: [{ content: 'Yes' }] },
                { id: 'connector3', sourceID: 'node2', targetID: 'node4', type: 'Orthogonal', annotations: [{ content: 'No' }] }],
                layout: { type: 'ComplexHierarchicalTree', orientation: null, horizontalSpacing: null, verticalSpacing: null, margin: null, getLayoutInfo: null,enableAnimation: null, },
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.layout.type === 'ComplexHierarchicalTree' && diagram.layout.orientation === null).toBe(true);
            expect(diagram.nodes.length === 4).toBe(true);
            expect(diagram.connectors.length === 3).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes: [{ id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }] }
                    , { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, annotations: [{ content: 'Node2' }], shape: { type: 'Flow', shape: 'Decision' } },
                { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node3' }] },
                { id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100, annotations: [{ content: 'Node4' }] }],
                connectors: [{ id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal' },
                { id: 'connector2', sourceID: 'node2', targetID: 'node3', type: 'Orthogonal', annotations: [{ content: 'Yes' }] },
                { id: 'connector3', sourceID: 'node2', targetID: 'node4', type: 'Orthogonal', annotations: [{ content: 'No' }] }],
                layout: { type: 'ComplexHierarchicalTree', orientation: undefined, horizontalSpacing: undefined, verticalSpacing: undefined, margin: undefined, getLayoutInfo: undefined,enableAnimation: undefined, },
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.layout.type === 'ComplexHierarchicalTree' && diagram.layout.orientation === 'TopToBottom').toBe(true);
            expect(diagram.layout.horizontalSpacing === 30 && diagram.layout.verticalSpacing === 30).toBe(true);
            expect(diagram.nodes.length === 4).toBe(true);
            expect(diagram.connectors.length === 3).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes: [{ id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }] }
                    , { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, annotations: [{ content: 'Node2' }], shape: { type: 'Flow', shape: 'Decision' } },
                { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node3' }] },
                { id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100, annotations: [{ content: 'Node4' }] }],
                connectors: [{ id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal' },
                { id: 'connector2', sourceID: 'node2', targetID: 'node3', type: 'Orthogonal', annotations: [{ content: 'Yes' }] },
                { id: 'connector3', sourceID: 'node2', targetID: 'node4', type: 'Orthogonal', annotations: [{ content: 'No' }] }],
                layout: { type: 'MindMap', orientation: null, horizontalSpacing: null, verticalSpacing: null, margin: null, getLayoutInfo: null,enableAnimation: null,getBranch:null },
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.layout.type === 'MindMap' && diagram.layout.orientation === null).toBe(true);
            expect(diagram.nodes.length === 4).toBe(true);
            expect(diagram.connectors.length === 3).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes: [{ id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }] }
                    , { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, annotations: [{ content: 'Node2' }], shape: { type: 'Flow', shape: 'Decision' } },
                { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node3' }] },
                { id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100, annotations: [{ content: 'Node4' }] }],
                connectors: [{ id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal' },
                { id: 'connector2', sourceID: 'node2', targetID: 'node3', type: 'Orthogonal', annotations: [{ content: 'Yes' }] },
                { id: 'connector3', sourceID: 'node2', targetID: 'node4', type: 'Orthogonal', annotations: [{ content: 'No' }] }],
                layout: { type: 'MindMap', orientation: undefined, horizontalSpacing: undefined, verticalSpacing: undefined, margin: undefined, getLayoutInfo: undefined,enableAnimation: undefined,getBranch:undefined },
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.layout.type === 'MindMap' && diagram.layout.horizontalSpacing === 30).toBe(true);
            expect(diagram.layout.verticalSpacing === 30).toBe(true);
            expect(diagram.nodes.length === 4).toBe(true);
            expect(diagram.connectors.length === 3).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes: [{ id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }] }
                    , { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, annotations: [{ content: 'Node2' }], shape: { type: 'Flow', shape: 'Decision' } },
                { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node3' }] },
                { id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100, annotations: [{ content: 'Node4' }] }],
                connectors: [{ id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal' },
                { id: 'connector2', sourceID: 'node2', targetID: 'node3', type: 'Orthogonal', annotations: [{ content: 'Yes' }] },
                { id: 'connector3', sourceID: 'node2', targetID: 'node4', type: 'Orthogonal', annotations: [{ content: 'No' }] }],
                layout: { type: 'HierarchicalTree', orientation: null, horizontalSpacing: null, verticalSpacing: null, margin: null, getLayoutInfo: null,enableAnimation: null },
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.layout.type === 'HierarchicalTree' && diagram.layout.orientation === null).toBe(true);
            expect(diagram.nodes.length === 4).toBe(true);
            expect(diagram.connectors.length === 3).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes: [{ id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1' }] }
                    , { id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100, annotations: [{ content: 'Node2' }], shape: { type: 'Flow', shape: 'Decision' } },
                { id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Node3' }] },
                { id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100, annotations: [{ content: 'Node4' }] }],
                connectors: [{ id: 'connector1', sourceID: 'node1', targetID: 'node2', type: 'Orthogonal' },
                { id: 'connector2', sourceID: 'node2', targetID: 'node3', type: 'Orthogonal', annotations: [{ content: 'Yes' }] },
                { id: 'connector3', sourceID: 'node2', targetID: 'node4', type: 'Orthogonal', annotations: [{ content: 'No' }] }],
                layout: { type: 'HierarchicalTree', orientation: undefined, horizontalSpacing: undefined, verticalSpacing: undefined, margin: undefined, getLayoutInfo: undefined,enableAnimation: undefined },
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.layout.type === 'HierarchicalTree' && diagram.layout.orientation === 'TopToBottom').toBe(true);
            expect(diagram.layout.horizontalSpacing === 30 && diagram.layout.verticalSpacing === 30).toBe(true);
            expect(diagram.nodes.length === 4).toBe(true);
            expect(diagram.connectors.length === 3).toBe(true);
            diagram.destroy();
            done();
        });
        it('diagram style-port-annotation properties', (done: Function) => {
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes:[{id:'n1',offsetX:200,offsetY:200,height:50,width:100,style:{fill:null,strokeColor:null,strokeWidth:null,strokeDashArray:null,opacity:null,},
                    ports:[{id:null,offset:null,visibility:null,constraints:null,shape:null,width:null,height:null}],
                annotations:[{content:null}]}],
                connectors:[{id:'c1',sourcePoint:{x:100,y:100},targetPoint:{x:200,y:200},type:'Orthogonal',annotations:[{content:null}]}],
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 1).toBe(true);
            expect(diagram.nodes[0].style.fill === null && diagram.nodes[0].style.strokeColor === null).toBe(true);
            expect(diagram.nodes[0].style.strokeWidth === null && diagram.nodes[0].style.strokeDashArray === null).toBe(true);
            expect(diagram.nodes[0].style.opacity === null).toBe(true);
            expect(diagram.nodes[0].ports[0].id !== null && diagram.nodes[0].ports[0].offset !== null).toBe(true);
            expect(diagram.nodes[0].ports[0].visibility === null && diagram.nodes[0].ports[0].constraints === null).toBe(true);
            expect(diagram.nodes[0].ports[0].shape === 'Square' && diagram.nodes[0].ports[0].width === null).toBe(true);
            expect(diagram.nodes[0].ports[0].height === null).toBe(true);
            expect(diagram.nodes[0].annotations[0].content === '').toBe(true);
            expect(diagram.connectors.length === 1).toBe(true);
            expect(diagram.connectors[0].annotations[0].content === '').toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes:[{id:'n1',offsetX:200,offsetY:200,height:50,width:100,style:{fill:undefined,strokeColor:undefined,strokeWidth:undefined,strokeDashArray:undefined,opacity:undefined,},
                    ports:[{id:undefined,offset:undefined,visibility:undefined,constraints:undefined,shape:undefined,width:undefined,height:undefined}],
                annotations:[{content:undefined}]}],
                connectors:[{id:'c1',sourcePoint:{x:100,y:100},targetPoint:{x:200,y:200},type:'Orthogonal',annotations:[{content:undefined}]}],
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 1).toBe(true);
            expect(diagram.nodes[0].style.fill === undefined && diagram.nodes[0].style.strokeColor === 'black').toBe(true);
            expect(diagram.nodes[0].style.strokeWidth === 1 && diagram.nodes[0].style.strokeDashArray === '').toBe(true);
            expect(diagram.nodes[0].style.opacity === 1).toBe(true);
            expect(diagram.nodes[0].ports[0].id !== undefined && diagram.nodes[0].ports[0].offset !== undefined).toBe(true);
            expect(diagram.nodes[0].ports[0].visibility !== undefined && diagram.nodes[0].ports[0].constraints !== undefined).toBe(true);
            expect(diagram.nodes[0].ports[0].shape === 'Square' && diagram.nodes[0].ports[0].width === 12).toBe(true);
            expect(diagram.nodes[0].ports[0].height === 12).toBe(true);
            expect(diagram.nodes[0].annotations[0].content === '').toBe(true);
            expect(diagram.connectors.length === 1).toBe(true);
            expect(diagram.connectors[0].annotations[0].content === '').toBe(true);
            diagram.destroy();
            done();
        });
        it('diagram swimlane properties', (done: Function) => {
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes:[{
                    id:null,
                    shape:{type:'SwimLane',orientation:null,header:null,
                        lanes:[
                            {
                                id:null,header:null,children:null,canMove:null,style:{fill:null,strokeColor:null,strokeWidth:null,strokeDashArray:null,opacity:null},
                            },
                            {
                                id:'lane2',header:{annotation:{content:null,constraints:null}},children:null,canMove:null,style:{fill:null,strokeColor:null,strokeWidth:null,strokeDashArray:null,opacity:null,},
                            }
                        ],
                        phases:[
                            {id:null,offset:null,addInfo:null,header:null,style:{fill:null,strokeColor:null,strokeWidth:null,opacity:null,strokeDashArray:null}},
                            {id:'phase2'}
                        ]
                    },
                    offsetX:300,offsetY:300,height:400,width:500
                    },
                    {
                        id:'swim2',
                        shape:{
                            header:{annotation:{content:null,constraints:null,style:{fill:null,fontFamily:null,fontSize:null}}},
                            lanes:null,phases:null,orientation:null,
                        },
                        offsetX:null,offsetY:null,height:null,width:null
                    }
                ]
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 10).toBe(true);
            expect((diagram.nodes[0].shape as any).orientation === null).toBe(true);
            expect((diagram.nodes[0].shape as any).header !== null).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes:[{
                    id:undefined,
                    shape:{type:'SwimLane',orientation:undefined,header:undefined,
                        lanes:[
                            {
                                id:undefined,header:undefined,children:undefined,canMove:undefined,style:{fill:undefined,strokeColor:undefined,strokeWidth:undefined,strokeDashArray:undefined,opacity:undefined},
                            },
                            {
                                id:'lane2',header:{annotation:{content:undefined,constraints:undefined}},children:undefined,canMove:undefined,style:{fill:undefined,strokeColor:undefined,strokeWidth:undefined,strokeDashArray:undefined,opacity:undefined,},
                            }
                        ],
                        phases:[
                            {id:undefined,offset:undefined,addInfo:undefined,header:undefined,style:{fill:undefined,strokeColor:undefined,strokeWidth:undefined,opacity:undefined,strokeDashArray:undefined}},
                            {id:'phase2'}
                        ]
                    },
                    offsetX:300,offsetY:300,height:400,width:500
                    },
                    {
                        id:'swim2',
                        shape:{
                            header:{annotation:{content:undefined,constraints:undefined,style:{fill:undefined,fontFamily:undefined,fontSize:undefined}}},
                            lanes:undefined,phases:undefined,orientation:undefined,
                        },
                        offsetX:undefined,offsetY:undefined,height:undefined,width:undefined
                    }
                ]
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 10).toBe(true);
            expect((diagram.nodes[0].shape as any).orientation === 'Horizontal').toBe(true);
            expect((diagram.nodes[0].shape as any).header !== null).toBe(true);
            diagram.destroy();
            done();
        });
        it('diagram bpmn proprties', (done: Function) => {
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes:[
                    {id:'bpmn1',shape:{type:'Bpmn',shape:null,event:null},offsetX:100,offsetY:100},
                    {id:'bpmn2',shape:{type:'Bpmn',shape:'DataObject',dataObject:null},offsetX:300,offsetY:100},
                    {id:'bpmn3',shape:{type:'Bpmn',shape:'Gateway',gateway:null},offsetX:500,offsetY:100},
                    {id:'bpmn4',shape:{type:'Bpmn',shape:'Activity',activity:null},offsetX:700,offsetY:100},
                    {id:'bpmn5',shape:{type:'Bpmn',shape:'Activity',activity:{subProcess:null}},offsetX:100,offsetY:300},
                    {id:'bpmn6',shape:{type:'Bpmn',shape:'Activity',activity:{subProcess:{collapsed:null}}},offsetX:300,offsetY:300},
                    {id:'bpmn7',shape:{type:'Bpmn',shape:'Activity',activity:{task:null}},offsetX:500,offsetY:300},
                    {id:'bpmn8',shape:{type:'Bpmn',shape:'Activity',activity:{task:{type:null}}},offsetX:700,offsetY:300},
                ],
                connectors:[
                    {id:'bpmnC1',sourceID:'bpmn1',targetID:'bpmn2',shape:null},
                    {id:'bpmnC2',sourceID:'bpmn2',targetID:'bpmn3',shape:{type:null}},
                    {id:'bpmnC3',sourceID:'bpmn3',targetID:'bpmn4',shape:{type:'Bpmn'}},
                    {id:'bpmnC4',sourceID:'bpmn4',targetID:'bpmn5',shape:{type:'Bpmn',flow:null}},
                    {id:'bpmnC5',sourceID:'bpmn5',targetID:'bpmn6',shape:{type:'Bpmn',flow:'Message',message:null}},
                    {id:'bpmnC6',sourceID:'bpmn6',targetID:'bpmn7',shape:{type:'Bpmn',flow:'Sequence',sequence:null}},
                    {id:'bpmnC7',sourceID:'bpmn7',targetID:'bpmn8',shape:{type:'Bpmn',flow:'Association',association:null}},
                ]
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 8).toBe(true);
            expect(diagram.connectors.length === 7).toBe(true);
            diagram.destroy();
            diagram = new Diagram({
                width: '1000px', height: '600px',
                nodes:[
                    {id:'bpmn1',shape:{type:'Bpmn',shape:undefined,event:undefined},offsetX:100,offsetY:100},
                    {id:'bpmn2',shape:{type:'Bpmn',shape:'DataObject',dataObject:undefined},offsetX:300,offsetY:100},
                    {id:'bpmn3',shape:{type:'Bpmn',shape:'Gateway',gateway:undefined},offsetX:500,offsetY:100},
                    {id:'bpmn4',shape:{type:'Bpmn',shape:'Activity',activity:undefined},offsetX:700,offsetY:100},
                    {id:'bpmn5',shape:{type:'Bpmn',shape:'Activity',activity:{subProcess:undefined}},offsetX:100,offsetY:300},
                    {id:'bpmn6',shape:{type:'Bpmn',shape:'Activity',activity:{subProcess:{collapsed:undefined}}},offsetX:300,offsetY:300},
                    {id:'bpmn7',shape:{type:'Bpmn',shape:'Activity',activity:{task:undefined}},offsetX:500,offsetY:300},
                    {id:'bpmn8',shape:{type:'Bpmn',shape:'Activity',activity:{task:{type:undefined}}},offsetX:700,offsetY:300},
                ],
                connectors:[
                    {id:'bpmnC1',sourceID:'bpmn1',targetID:'bpmn2',shape:undefined},
                    {id:'bpmnC2',sourceID:'bpmn2',targetID:'bpmn3',shape:{type:undefined}},
                    {id:'bpmnC3',sourceID:'bpmn3',targetID:'bpmn4',shape:{type:'Bpmn'}},
                    {id:'bpmnC4',sourceID:'bpmn4',targetID:'bpmn5',shape:{type:'Bpmn',flow:undefined}},
                    {id:'bpmnC5',sourceID:'bpmn5',targetID:'bpmn6',shape:{type:'Bpmn',flow:'Message',message:undefined}},
                    {id:'bpmnC6',sourceID:'bpmn6',targetID:'bpmn7',shape:{type:'Bpmn',flow:'Sequence',sequence:undefined}},
                    {id:'bpmnC7',sourceID:'bpmn7',targetID:'bpmn8',shape:{type:'Bpmn',flow:'Association',association:undefined}},
                ]
            });
            diagram.appendTo('#diagramNullUndefined');
            expect(diagram.nodes.length === 8).toBe(true);
            expect(diagram.connectors.length === 7).toBe(true);
            let con: ConnectorModel = diagram.nameTable['bpmnC5'];
            expect((con.shape as BpmnFlowModel).message === 'Default').toBe(true);
            diagram.destroy();
            done();
        });
    });

});