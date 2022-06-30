/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/* eslint-disable @typescript-eslint/ban-types */
import { Node, BpmnActivity, BpmnTask, BpmnSubProcess, BpmnShape, BpmnSubEvent, DiagramShape } from './../objects/node';
import { DiagramElement } from './../core/elements/diagram-element';
import { Canvas } from './../core/containers/canvas';
import { Container } from './../core/containers/container';
import { PathElement } from './../core/elements/path-element';
import { TextElement } from './../core/elements/text-element';
import { updateStyle } from './../../diagram/utility/diagram-util';
import { randomId, cloneObject } from './../utility/base-util';
import { Diagram } from './../../diagram/diagram';
import { ShapeAnnotationModel } from './../../diagram/objects/annotation-model';
import { PointPortModel } from './../objects/port-model';
import { Connector } from './../objects/connector';
import { BpmnAnnotation } from './../objects/node';
import { BpmnFlowModel, ConnectorModel } from './../objects/connector-model';
import { Transform, DiagramAction } from '../enum/enum';
import { PointModel } from '../primitives/point-model';
import { findAngle, getIntersectionPoints, getPortDirection } from '../utility/connector';
import { Point } from '../primitives/point';
import { NodeConstraints, BpmnActivities, ConnectorConstraints, BpmnShapes } from '../enum/enum';
import { BpmnEventModel, BpmnSubEventModel, BpmnActivityModel, DiagramShapeModel } from './../objects/node-model';
import { BpmnSubProcessModel, BpmnGatewayModel, BpmnTransactionSubProcessModel } from './../objects/node-model';
import { PathModel, BpmnShapeModel, BpmnDataObjectModel, BpmnTaskModel } from './../objects/node-model';
import { NodeModel, BpmnAnnotationModel } from './../objects/node-model';
import { Annotation } from './../objects/annotation';
import { Port } from './../objects/port';
import { HistoryEntry } from './../diagram/history';
import { TextStyleModel } from '../core/appearance-model';
import { ActiveLabel } from '../objects/interface/interfaces';
import { IElement } from '../objects/interface/IElement';
import { Rect } from '../primitives/rect';
import { Size } from '../primitives/size';
import { getDiagramElement } from '../utility/dom-util';
import { Segment } from '../interaction/scroller';
import { isBlazor } from '@syncfusion/ej2-base';
import { removeElement } from '../utility/dom-util';

/**
 * BPMN Diagrams contains the BPMN functionalities
 */
export class BpmnDiagrams {

    //Code conversion for Bpmn Shapes
    //Start Region

    /**   @private  */
    public annotationObjects: {} = {};

    /**   @private  */
    public get textAnnotationConnectors(): ConnectorModel[] {
        const connectors: ConnectorModel[] = [];
        for (const key of Object.keys(this.annotationObjects)) {
            const entry: {} = this.annotationObjects[key];
            for (const annotation of Object.keys(entry)) {
                const key: string = 'connector';
                connectors.push(entry[annotation][key]);
            }
        }
        return connectors;
    }

    /** @private */
    public getTextAnnotationConn(obj: NodeModel | ConnectorModel): ConnectorModel[] {
        const connectors: ConnectorModel[] = [];
        if (obj.shape.type === 'Bpmn' && (obj.shape as BpmnShape).annotations.length !== 0) {
            const entry: {} = this.annotationObjects[obj.id];
            for (const annotation of Object.keys(entry)) {
                const key: string = 'connector';
                connectors.push(entry[annotation][key]);
            }
        }
        return connectors;
    }

    /**   @private  */
    public getSize(node: NodeModel, content: DiagramElement): Size {
        const size: Size = new Size(node.width, node.height);
        if (size.width === undefined || size.height === undefined) {
            if (!(content instanceof PathElement)) {
                size.width = size.width || 50;
                size.height = size.height || 50;
            }
            if (content.actualSize.width && content.actualSize.height) {
                return content.actualSize;
            } else {
                content.measure(new Size());
                size.width = size.width || content.desiredSize.width;
                size.height = size.height || content.desiredSize.height;
            }
            if (node.maxWidth !== undefined) {
                size.width = Math.min(size.width, node.maxWidth);
            }
            if (node.maxHeight !== undefined) {
                size.height = Math.min(size.height, node.maxHeight);
            }
            if (node.minWidth !== undefined) {
                size.width = Math.max(size.width, node.minWidth);
            }
            if (node.minHeight !== undefined) {
                size.height = Math.max(size.height, node.minHeight);
            }
        }
        return size;
    }
    /** @private */
    public initBPMNContent(content: DiagramElement, node: Node, diagram: Diagram): DiagramElement {
        const shape: BpmnShape | DiagramShape = (isBlazor() ? node.shape as DiagramShape : node.shape as BpmnShape);
        const bpmnShape: BpmnShapes = (isBlazor() ? (node.shape as DiagramShape).bpmnShape : (node.shape as BpmnShape).shape);
        if (bpmnShape === 'Event') {
            content = this.getBPMNEventShape(node, shape.event);
        }
        if (bpmnShape === 'Gateway') {
            content = this.getBPMNGatewayShape(node);
        }
        if (bpmnShape === 'DataObject') {
            content = this.getBPMNDataObjectShape(node);
        }
        if (bpmnShape === 'Message' || bpmnShape === 'DataSource') {
            content = this.getBPMNShapes(node);
        }
        // if (shape.shape === 'Group') {
        //     content = this.getBPMNGroup(node, diagram);
        //     content.style.strokeDashArray = '2 2 6 2';
        //     content.horizontalAlignment = 'Center';
        //     content.verticalAlignment = 'Center';
        // }
        if (bpmnShape === 'Activity') {
            content = this.getBPMNActivityShape(node);
        }
        if (bpmnShape === 'TextAnnotation') {
            content = this.renderBPMNTextAnnotation(diagram, node, content);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const annotations: {} = {};
        if (shape.annotations.length > 0) {
            for (let i: number = 0; i < shape.annotations.length && shape.annotations[i].text; i++) {
                (content as Canvas).children.push(this.getBPMNTextAnnotation(
                    node, diagram, shape.annotations[i], content));
            }
            content.style.strokeDashArray = '2 2 6 2';
        }
        return content;
    }
    /** @private */
    public getBPMNShapes(node: Node): PathElement {
        const bpmnShape: PathElement = new PathElement();
        //set style
        this.setStyle(bpmnShape, node);
        if ((node.constraints & NodeConstraints.Shadow) !== 0) {
            bpmnShape.shadow = node.shadow;
        }
        const bpmnShapeData: string = getBpmnShapePathData((isBlazor() ? (node.shape as DiagramShape).bpmnShape :
            (node.shape as BpmnShape).shape));
        bpmnShape.data = bpmnShapeData;
        bpmnShape.id = node.id + '_' + (isBlazor() ? (node.shape as DiagramShape).bpmnShape :
            (node.shape as BpmnShape).shape);
        if (node.width !== undefined && node.height !== undefined) {
            bpmnShape.width = node.width;
            bpmnShape.height = node.height;
        }
        return bpmnShape;
    }
    /** @private */
    // public getBPMNGroup(node: Node, diagram: Diagram): Container {
    //     let group: Container = new Container();
    //     group.id = node.id + '_group';
    //     //group.style.strokeDashArray = '2 2 6 2';
    //     if (!group.children) { group.children = []; }
    //     let grp: BpmnGroup = ((node.shape as BpmnShape).group as BpmnGroup);
    //     if ((node.shape as BpmnShape).group as BpmnGroup) {
    //         for (let i: number = 0; i < grp.children.length; i++) {
    //             let b: Node | Connector = diagram.nameTable[grp.children[i]];
    //             group.children.push(b.wrapper);
    //         }
    //     }
    //     return group;
    // }
    /** @private */
    public getBPMNGatewayShape(node: Node): Canvas {
        const gatewayshape: Canvas = new Canvas();
        //childNode0
        const gatewayNode: PathElement = new PathElement();
        gatewayNode.id = node.id + '_0_gateway';
        gatewayNode.offsetX = node.offsetX; gatewayNode.offsetY = node.offsetY;
        gatewayNode.data = 'M 40 20 L 20 40 L 0 20 L 20 0 L 40 20 Z';
        this.setStyle(gatewayNode, node);
        //childNode1
        const gatewayTypeNode: PathElement = new PathElement();
        gatewayTypeNode.id = node.id + '_1_gatewayType';
        //set style - opacity
        gatewayTypeNode.style.opacity = node.style.opacity;
        gatewayTypeNode.style.strokeColor = node.style.strokeColor;
        gatewayTypeNode.horizontalAlignment = 'Center';
        gatewayTypeNode.verticalAlignment = 'Center';
        gatewayTypeNode.relativeMode = 'Object';
        const shapeType: BpmnGatewayModel = (node.shape as BpmnShape).gateway;
        //let gatewayTypeNodeShapeData: string;
        const gatewayTypeNodeShapeData: string = getBpmnGatewayShapePathData(shapeType.type);
        if (shapeType.type === 'EventBased' || shapeType.type === 'ExclusiveEventBased' || shapeType.type === 'ParallelEventBased') {
            gatewayTypeNode.style.fill = 'white';
        } else { gatewayTypeNode.style.fill = 'black'; }
        gatewayTypeNode.data = gatewayTypeNodeShapeData;
        // append child and set style
        gatewayshape.style.fill = 'transparent';
        gatewayshape.style.strokeColor = 'transparent'; gatewayshape.style.strokeWidth = 0;
        gatewayshape.children = [gatewayNode, gatewayTypeNode];
        const size: Size = this.getSize(node, gatewayNode);
        this.setSizeForBPMNGateway((node.shape as BpmnShape).gateway, gatewayshape, size.width, size.height);
        return gatewayshape;
    }
    /** @private */
    public getBPMNDataObjectShape(node: Node): Canvas {
        const dataObjectshape: Canvas = new Canvas();
        const shape: BpmnDataObjectModel = (node.shape as BpmnShape).dataObject;
        //childNode0
        const dataobjNode: PathElement = new PathElement();
        dataobjNode.id = node.id + '_0_dataobj';
        dataobjNode.data = 'M29.904,5 L7.853,5 L7.853,45 L42.147,45 L42.147,17.242,L29.932,5,L29.932,17.242,L42.147,17.242';
        const size: Size = this.getSize(node, dataobjNode);
        dataobjNode.width = size.width; dataobjNode.height = size.height;
        this.setStyle(dataobjNode, node);
        //childNode1
        const dataobjTypeNode: PathElement = new PathElement();
        dataobjTypeNode.id = node.id + '_1_type';
        dataobjTypeNode.width = 25; dataobjTypeNode.height = 20;
        dataobjTypeNode.margin.left = 5; dataobjTypeNode.margin.top = 5;
        dataobjTypeNode.data = 'M 3 9.4 l 6 0 v 2.4 l 3.6 -4 L 9 4 v 2.5 H 3 V 9.4 Z';
        //set style - opacity
        dataobjTypeNode.style.opacity = node.style.opacity;
        //childNode2
        const dataobjCollectionNode: PathElement = new PathElement();
        dataobjCollectionNode.id = node.id + '_2_collection';
        dataobjCollectionNode.width = 7.5; dataobjCollectionNode.height = 15;
        dataobjCollectionNode.style.fill = 'black'; dataobjCollectionNode.visible = true;
        dataobjCollectionNode.horizontalAlignment = 'Center';
        dataobjCollectionNode.verticalAlignment = 'Bottom';
        dataobjCollectionNode.relativeMode = 'Object';
        //set style - opacity
        dataobjCollectionNode.style.opacity = node.style.opacity;
        dataobjCollectionNode.data = 'M 0 0 L 0.1 0 L 0.1 2 L 0 2 Z M 0.4 0 L 0.6 0 L 0.6 2 L0.4 2 Z M 0.9 0 L 1 0 L 1 2 L 0.9 2 Z';

        switch (shape.type) {
        case 'None':
            dataobjTypeNode.visible = false;
            break;
        case 'Input':
            dataobjTypeNode.style.fill = 'white';
            break;
        case 'Output':
            dataobjTypeNode.style.fill = 'black';
            break;
        }
        if (shape.collection === false) {
            dataobjCollectionNode.visible = false;
        }
        //append child and set style
        dataObjectshape.style.fill = 'transparent';
        dataObjectshape.style.strokeColor = 'transparent'; dataObjectshape.style.strokeWidth = 0;
        dataObjectshape.children = [dataobjNode, dataobjTypeNode, dataobjCollectionNode];
        return dataObjectshape;
    }
    /** @private */
    public getBPMNTaskShape(node: Node): Canvas {
        const shape: BpmnActivityModel = (node.shape as BpmnShape).activity;
        const task: BpmnTaskModel = shape.task;
        const taskShapes: Canvas = new Canvas();
        //childNode0
        const taskNode: DiagramElement = new DiagramElement();
        taskNode.cornerRadius = 10;
        const size: Size = this.getSize(node, taskNode);
        taskNode.id = node.id + '_0_task';
        taskNode.width = size.width;
        taskNode.height = size.height;
        this.setStyle(taskNode, node);
        // if task as call
        if ((task.call !== undefined) && task.call === true) {
            taskNode.style.strokeWidth = 4;
        }

        taskShapes.width = size.width;
        taskShapes.height = size.height;
        const childCount: number = this.getTaskChildCount(node);
        let x: number;
        const childSpace: number = childCount * 12;
        const area: number = size.width / 2 - childSpace;
        if (childCount === 1) { x = area + 8; } else {
            x = area + (childCount - 1) * 8;
        }

        //childNode1
        const taskTypeNode: PathElement = new PathElement();
        if (task.type === 'Receive' || task.type === 'Send') {
            taskTypeNode.width = 18; taskTypeNode.height = 16;
        } else {
            taskTypeNode.width = 20; taskTypeNode.height = 20;
        }
        taskTypeNode.id = node.id + '_1_tasktType';
        taskTypeNode.margin.left = 5; taskTypeNode.margin.top = 5;
        const taskTypeNodeData: string = getBpmnTaskShapePathData(task.type);
        taskTypeNode.data = taskTypeNodeData;
        taskTypeNode.style.fill = 'transparent';
        taskTypeNode.style.opacity = node.style.opacity;
        // append child and set style
        taskShapes.style.fill = 'transparent';
        taskShapes.style.strokeColor = 'transparent'; taskShapes.style.strokeWidth = 0;
        taskShapes.children = [taskNode, taskTypeNode];

        //childnode for service
        if (task.type === 'Service') {
            const taskTypeNodeService: PathElement = new PathElement();
            taskTypeNodeService.id = node.id + '_1_taskTypeService';
            taskTypeNodeService.data = taskTypeNodeData;
            taskTypeNodeService.margin.left = taskTypeNode.margin.left + 9;
            taskTypeNodeService.margin.top = taskTypeNode.margin.top + 9;
            taskTypeNodeService.style.fill = 'white';
            taskTypeNodeService.style.opacity = node.style.opacity;
            taskShapes.children.push(taskTypeNodeService);
        }

        // if task as loop
        const loopType: string = task.loop;
        const taskLoopNode: PathElement = new PathElement(); //let childNode2data: string;
        const childNode2data: string = getBpmnLoopShapePathData(loopType);
        taskLoopNode.data = childNode2data; taskLoopNode.style.fill = 'black';
        if (loopType !== 'None') { taskLoopNode.visible = true; } else { taskLoopNode.visible = false; }
        if (childCount === 1) { x = area + 9; }
        taskLoopNode.margin.left = x; if (taskLoopNode.visible === true) { x += 12 + 8; }
        taskLoopNode.width = 12; taskLoopNode.height = 12;
        taskLoopNode.margin.bottom = 5; taskLoopNode.id = node.id + '_2_loop';
        taskLoopNode.horizontalAlignment = 'Left'; taskLoopNode.verticalAlignment = 'Bottom';
        taskLoopNode.setOffsetWithRespectToBounds(0, 1, 'Fraction'); taskLoopNode.relativeMode = 'Point';
        taskLoopNode.style.fill = 'transparent';
        taskTypeNode.style.opacity = node.style.opacity;
        taskShapes.children.push(taskLoopNode);
        //if task as compensation
        let taskCompNode: PathElement = new PathElement();
        taskCompNode = this.getBPMNCompensationShape(node, taskCompNode);
        if (task.compensation === true) {
            taskCompNode.visible = true;
        } else { taskCompNode.visible = false; }
        if (childCount === 1) { x = area + 9; }
        taskCompNode.margin.left = x - 3;
        x += 12 + 6;
        taskShapes.children.push(taskCompNode);
        return taskShapes;
    }
    /** @private */
    public getBPMNEventShape(node: Node, subEvent: BpmnSubEventModel, sub?: boolean, id?: string): Canvas {
        const eventshape: Canvas = new Canvas();
        let event: string; let trigger: string;
        let width: number; let height: number;
        id = id || node.id;
        const pathdata: string = 'M164.1884,84.6909000000001C156.2414,84.6909000000001,149.7764,78.2259000000001,149.7764,70.2769000000001' +
            'C149.7764,62.3279000000001,156.2414,55.8629000000001,164.1884,55.8629000000001C172.1354,55.8629000000001,178.6024,' +
            '62.3279000000001,178.6024,70.2769000000001C178.6024,78.2259000000001,172.1354,84.6909000000001,164.1884,84.6909000000001';
        const shapeEvent: BpmnEventModel = (node.shape as BpmnShape).event;
        if ((!isBlazor() && (node.shape as BpmnShape).shape === 'Event') ||
            (isBlazor() && (node.shape as DiagramShape).bpmnShape === 'Event')) {
            event = shapeEvent.event;
            trigger = shapeEvent.trigger;
        }
        width = subEvent.width;
        height = subEvent.height;
        if (sub) {
            width = width || 20;
            height = height || 20;
        } else if (subEvent.width === undefined || subEvent.height === undefined) {
            const pathElement: PathElement = new PathElement();
            pathElement.data = pathdata;
            const size: Size = this.getSize(node, pathElement);
            width = size.width; height = size.height;
        }
        const shapeActivity: BpmnActivityModel = (node.shape as BpmnShape).activity;
        if ((!isBlazor() && (node.shape as BpmnShape).shape === 'Activity') ||
            (isBlazor() && (node.shape as DiagramShape).bpmnShape === 'Activity')) {
            const subProcess: Object = shapeActivity.subProcess;
            event = subEvent.event;
            trigger = subEvent.trigger;
        }

        //childNode0
        const innerEvtNode: PathElement = new PathElement();
        innerEvtNode.data = pathdata; innerEvtNode.id = id + '_0_event';
        innerEvtNode.width = width; innerEvtNode.height = height;
        innerEvtNode.horizontalAlignment = 'Center';
        innerEvtNode.verticalAlignment = 'Center';
        innerEvtNode.relativeMode = 'Object';
        this.setStyle(innerEvtNode, node);
        //childNode1
        const outerEvtNode: PathElement = new PathElement();
        outerEvtNode.data = pathdata; outerEvtNode.id = id + '_1_event';
        outerEvtNode.style.gradient = node.style.gradient;
        outerEvtNode.horizontalAlignment = 'Center';
        outerEvtNode.verticalAlignment = 'Center';
        outerEvtNode.relativeMode = 'Object';
        // set style opacity & strokeColor
        outerEvtNode.style.strokeColor = node.style.strokeColor;
        outerEvtNode.style.opacity = node.style.opacity;
        //childNode2
        const triggerNode: PathElement = new PathElement();
        const triggerNodeData: string = getBpmnTriggerShapePathData(trigger);
        triggerNode.data = triggerNodeData; triggerNode.id = id + '_2_trigger';
        triggerNode.horizontalAlignment = 'Center';
        triggerNode.verticalAlignment = 'Center';
        triggerNode.relativeMode = 'Object';
        // set style opacity & strokeColor
        triggerNode.style.strokeColor = node.style.strokeColor;
        triggerNode.style.opacity = node.style.opacity;

        switch (event) {
        case 'Start':
            outerEvtNode.visible = false;
            break;
        case 'NonInterruptingStart':
            innerEvtNode.style.strokeDashArray = '2 3';
            outerEvtNode.visible = false;
            break;
        case 'Intermediate':
            innerEvtNode.style.fill = node.style.fill;
            innerEvtNode.style.gradient = null;
            break;
        case 'NonInterruptingIntermediate':
            innerEvtNode.style.fill = node.style.fill;
            innerEvtNode.style.gradient = null;
            innerEvtNode.style.strokeDashArray = '2 3';
            outerEvtNode.style.strokeDashArray = '2 3';
            break;
        case 'ThrowingIntermediate':
        case 'End':
            innerEvtNode.style.fill = event !== 'End' ? node.style.fill : node.style.fill !== 'white' ? node.style.fill: 'black';
            innerEvtNode.style.gradient = null;
            triggerNode.style.fill = 'black';
            triggerNode.style.strokeColor = 'white';
            break;
        }
        //append child and set style
        eventshape.style.fill = 'transparent';
        eventshape.style.strokeColor = 'transparent'; eventshape.style.strokeWidth = 0;
        eventshape.children = [innerEvtNode, outerEvtNode, triggerNode];
        this.setSizeForBPMNEvents(shapeEvent, eventshape, width, height);
        return eventshape;
    }
    private setEventVisibility(node: Node, canvas: DiagramElement[]): void {
        const event: string = (node.shape as BpmnShape).event.event;
        const innerEvtNode: DiagramElement = canvas[0];
        const outerEvtNode: DiagramElement = canvas[1];
        const triggerNode: DiagramElement = canvas[2];
        switch (event) {
        case 'Start':
            outerEvtNode.visible = false;
            break;
        case 'NonInterruptingStart':
            innerEvtNode.style.strokeDashArray = '2 3';
            outerEvtNode.visible = false;
            break;
        }
    }
    private setSubProcessVisibility(node: Node): void {
        const subProcess: BpmnSubProcessModel = (node.shape as BpmnShape).activity.subProcess;
        const eventLength: number = subProcess.events.length;
        const index: number = ((node.shape as BpmnShape).activity.subProcess.type === 'Transaction') ? 2 : 0;

        const elementWrapper: Canvas = (node.wrapper.children[0] as Canvas).children[0] as Canvas;
        if (subProcess.adhoc === false) {
            elementWrapper.children[3 + index + eventLength].visible = false;
        }
        if (subProcess.compensation === false) {
            elementWrapper.children[4 + index + eventLength].visible = false;
        }
        if (eventLength > 0) {
            for (let i: number = 0; i < eventLength; i++) {
                this.setEventVisibility(node, (elementWrapper.children[2 + i] as Container).children);
            }
        }
    }
    /** @private */
    public getBPMNSubProcessShape(node: Node): Canvas {
        const subProcessShapes: Canvas = new Canvas();
        let loopType: string;
        let events: Object[]; let event: BpmnSubEventModel; let subprocessAdhoc: PathElement = new PathElement();
        const subProcessEventsShapes: Canvas = new Canvas(); let subProcessLoopShapes: PathElement = new PathElement();
        const shape: BpmnActivityModel = (node.shape as BpmnShape).activity;
        const subProcess: BpmnSubProcessModel = shape.subProcess;
        const subChildCount: number = this.getSubprocessChildCount(node); let x: number;

        const subprocessNode: DiagramElement = new DiagramElement();
        subprocessNode.id = node.id + '_0_Subprocess';
        subprocessNode.style.fill = 'transparent';
        subprocessNode.cornerRadius = 10;

        const size: Size = this.getSize(node, subprocessNode);
        subprocessNode.width = size.width; subprocessNode.height = size.height;
        subProcessShapes.children = [subprocessNode];
        if (shape.subProcess.type === 'Transaction') {
            this.getBPMNSubProcessTransaction(node, node.shape as BpmnShape, subProcessShapes);
        }
        const iconSpace: number = 4;
        const subChildSpace: number = 12;
        const childSpace: number = subChildCount * subChildSpace;
        const area: number = size.width / 2;
        if (subChildCount === 1) { x = area - (subChildSpace * 0.5); } else {
            x = area - (childSpace / 2) - ((subChildCount - 1) * iconSpace) / 2;
        }
        //set style
        this.setStyle(subprocessNode, node);
        if ((node.constraints & NodeConstraints.Shadow) !== 0) {
            subProcessShapes.shadow = node.shadow;
        }
        const collapsedShape: PathElement = new PathElement();
        collapsedShape.id = node.id + '_0_collapsed'; collapsedShape.width = 12; collapsedShape.height = 12;
        collapsedShape.style.fill = 'black'; collapsedShape.style.strokeColor = node.style.strokeColor; collapsedShape.margin.bottom = 5;
        collapsedShape.horizontalAlignment = 'Left'; collapsedShape.verticalAlignment = 'Bottom';
        collapsedShape.setOffsetWithRespectToBounds(0, 1, 'Fraction'); collapsedShape.relativeMode = 'Point';
        collapsedShape.data = getBpmnShapePathData('collapsedShape');
        collapsedShape.margin.left = x;
        if (subProcess.collapsed === true && !subProcess.processes) {
            collapsedShape.visible = true;
        } else { collapsedShape.visible = false; }
        if (collapsedShape.visible === true) { x += 12 + 6; }
        subProcessShapes.children.push(collapsedShape);
        if (subProcess.type === 'Event') {
            subprocessNode.style.strokeWidth = 1; subprocessNode.style.strokeDashArray = '2 2';
            events = subProcess.events;
            for (let i: number = 0; i < events.length; i++) {
                event = events[i];
                this.getBPMNSubEvent(event as BpmnSubEvent, node, subProcessShapes);
            }
        }
        // set loop for subprocess
        subProcessLoopShapes = this.getBPMNSubProcessLoopShape(node); if (subChildCount === 1) { x = area + 8; }
        subProcessLoopShapes.margin.left = x;
        if (subProcessLoopShapes.visible === true) { x += subChildSpace + iconSpace; }
        subProcessShapes.children.push(subProcessLoopShapes);
        // set boundary for subprocess
        subprocessNode.id = node.id + '_boundary';
        if (subProcess.boundary === 'Default') {
            subprocessNode.style.strokeWidth = 1;
            subprocessNode.style.strokeDashArray = '1 0';
        }
        if (subProcess.boundary === 'Call') {
            subprocessNode.style.strokeWidth = 4;
            subprocessNode.style.strokeDashArray = '1 0';
        }
        if (subProcess.boundary === 'Event') {
            subprocessNode.style.strokeWidth = 1;
            subprocessNode.style.strokeDashArray = '2 2';
        }
        //set adhoc for subprocess
        subprocessAdhoc = this.getBPMNAdhocShape(node, subprocessAdhoc, subProcess); if (subChildCount === 1) { x = area + 8; }
        subprocessAdhoc.margin.left = x; if (subprocessAdhoc.visible === true) { x += subChildSpace + iconSpace; }
        subProcessShapes.children.push(subprocessAdhoc);
        //set compensation for subprocess
        let subprocessComp: PathElement = new PathElement();
        if (subProcess.compensation === true) { subprocessComp.visible = true; } else { subprocessComp.visible = false; }
        subprocessComp = this.getBPMNCompensationShape(node, subprocessComp); if (subChildCount === 1) { x = area + 8; }
        subprocessComp.margin.left = x; if (subprocessComp.visible === true) { x += subChildSpace + iconSpace; }
        subProcessShapes.children.push(subprocessComp);
        //set style for subprocess
        subProcessShapes.style.strokeColor = 'transparent'; subProcessShapes.style.strokeWidth = 0;
        subProcessShapes.style.fill = 'transparent';
        return subProcessShapes;
    }

    private getBPMNSubEvent(event: BpmnSubEvent, node: Node, container: Container, id?: string): void {
        container.children = container.children || [];
        //let eventContainer: Canvas;
        const eventContainer: Canvas = this.getBPMNEventShape(node, event, true, id);
        this.getBPMNSubprocessEvent(node, eventContainer, event);
        eventContainer.id = id || (node.id + '_subprocessEvents');
        eventContainer.width = event.width || 20; eventContainer.height = event.height || 20;
        // set offset for subevents
        eventContainer.setOffsetWithRespectToBounds(event.offset.x, event.offset.y, 'Fraction');
        eventContainer.relativeMode = 'Point';
        //set margin for subevents
        eventContainer.margin = event.margin;
        //set alignment for subevents
        eventContainer.horizontalAlignment = event.horizontalAlignment;
        eventContainer.verticalAlignment = event.verticalAlignment;
        // set style for subevent
        eventContainer.style.fill = 'transparent'; eventContainer.style.strokeColor = 'transparent';
        eventContainer.style.strokeWidth = 0;
        container.children.push(eventContainer);
    }

    private getBPMNSubProcessTransaction(node: Node, shape: BpmnShape, container: Container): void {
        const shapeWidth: number = container.children[0].width;
        const shapeHeight: number = container.children[0].height;

        const innerRect: DiagramElement = new DiagramElement();
        innerRect.margin = { left: 3, right: 0, top: 3, bottom: 0 };
        innerRect.id = node.id + '_0_Subprocess_innnerRect';
        innerRect.cornerRadius = 10; innerRect.width = shapeWidth - 6;
        innerRect.height = shapeHeight - 6; container.children.push(innerRect);

        const transactionEvents: Canvas = new Canvas();
        transactionEvents.id = node.id + '_transaction_events';
        transactionEvents.style.gradient = node.style.gradient;
        const transaction: BpmnTransactionSubProcessModel = shape.activity.subProcess.transaction;

        this.getBPMNSubEvent(
            transaction.success as BpmnSubEvent, node, transactionEvents, node.id + '_success');

        this.getBPMNSubEvent(
            transaction.cancel as BpmnSubEvent, node, transactionEvents, node.id + '_cancel');

        this.getBPMNSubEvent(
            transaction.failure as BpmnSubEvent, node, transactionEvents, node.id + '_failure');

        this.updateDiagramContainerVisibility(transactionEvents.children[0], transaction.success.visible);

        this.updateDiagramContainerVisibility(transactionEvents.children[1], transaction.cancel.visible);

        this.updateDiagramContainerVisibility(transactionEvents.children[2], transaction.failure.visible);

        transactionEvents.float = true;
        transactionEvents.width = shapeWidth;
        transactionEvents.height = shapeHeight;
        transactionEvents.style.fill = transactionEvents.style.strokeColor = 'transparent';
        container.children.push(transactionEvents);
    }
    /** @private */
    public getBPMNSubProcessLoopShape(node: Node): PathElement {
        const shape: BpmnActivityModel = (node.shape as BpmnShape).activity;
        let loopType: string;
        const subprocessLoop: PathElement = new PathElement(); let subprocessLoopData: string;
        const subProcess: BpmnSubProcessModel = shape.subProcess;
        // eslint-disable-next-line prefer-const
        loopType = subProcess.loop;
        // eslint-disable-next-line prefer-const
        subprocessLoopData = getBpmnLoopShapePathData(loopType);
        if (loopType !== 'None') { subprocessLoop.visible = true; } else { subprocessLoop.visible = false; }
        subprocessLoop.id = node.id + '_loop';
        subprocessLoop.data = subprocessLoopData; subprocessLoop.style.fill = 'black';
        subprocessLoop.width = 12; subprocessLoop.height = 12;
        subprocessLoop.horizontalAlignment = 'Left'; subprocessLoop.verticalAlignment = 'Bottom';
        subprocessLoop.setOffsetWithRespectToBounds(0, 1, 'Fraction'); subprocessLoop.relativeMode = 'Point';
        subprocessLoop.margin.bottom = 5;
        subprocessLoop.style.fill = 'transparent';
        subprocessLoop.style.strokeColor = node.style.strokeColor;
        return subprocessLoop;
    }
    /** @private */
    public drag(obj: Node, tx: number, ty: number, diagram: Diagram): void {
        const node: NodeModel = diagram.nameTable[(obj).processId];
        if (obj.margin.top + ty >= 0) {
            diagram.nodePropertyChange(obj as Node, {} as Node, { margin: { top: obj.margin.top + ty } } as Node);
        }
        if (obj.margin.left + tx >= 0) {
            diagram.nodePropertyChange(obj as Node, {} as Node, { margin: { left: obj.margin.left + tx } } as Node);
        }
        //const diffX: number = 0;
        //const diffY: number = 0;
        const bound: Rect = this.getChildrenBound(node, obj.id, diagram);
        this.updateSubProcessess(bound, obj, diagram);
        node.wrapper.measure(new Size(undefined, undefined));
        node.wrapper.arrange(node.wrapper.desiredSize);
        diagram.refreshCanvasLayers();
        diagram.updateSelector();
        this.updateDocks(obj as Node, diagram);
    }
    /** @private */
    public dropBPMNchild(target: Node, source: Node, diagram: Diagram): void {
        if (source && source.shape.type === 'Bpmn' && target.shape.type === 'Bpmn'
            && ((!isBlazor() && (source.shape as BpmnShape).shape !== 'TextAnnotation') ||
                (isBlazor() && (source.shape as DiagramShape).bpmnShape !== 'TextAnnotation'))) {
            const subProcess: BpmnSubProcessModel = (diagram.nameTable[target.id].shape as BpmnShape).activity.subProcess;
            if (diagram.currentSymbol && target.shape.type === 'Bpmn' && !subProcess.collapsed) {
                source.processId = target.id;
                return;
            }
            subProcess.processes = subProcess.processes || [];
            if (subProcess.processes && subProcess.processes.indexOf(source.id) === -1 && !subProcess.collapsed) {
                subProcess.processes.push(source.id);
                const redoElement: NodeModel = cloneObject(source);
                const sources: Container = diagram.nameTable[source.id].wrapper;
                const targetWrapper: Container = diagram.nameTable[target.id].wrapper;
                sources.margin.top = (sources.offsetY - (sources.actualSize.height / 2))
                    - (target.offsetY - (target.actualSize.height / 2));
                sources.margin.left = (sources.offsetX - (sources.actualSize.width / 2))
                    - (target.offsetX - (target.actualSize.width / 2));
                sources.margin.top = (sources.margin.top < 0) ? 0 : sources.margin.top;
                sources.margin.left = (sources.margin.left < 0) ? 0 : sources.margin.left;
                diagram.nameTable[source.id].processId = target.id;
                targetWrapper.children.push(diagram.nameTable[source.id].wrapper);
                const bound: Rect = this.getChildrenBound(target, source.id, diagram);
                this.updateSubProcessess(bound, source, diagram);
                targetWrapper.measure(new Size(undefined, undefined));
                targetWrapper.arrange(targetWrapper.desiredSize);
                diagram.refreshCanvasLayers();
                diagram.updateSelector();
                let edges: string[] = [];
                edges = edges.concat((source as Node).outEdges, (source as Node).inEdges);
                for (let i: number = edges.length - 1; i >= 0; i--) {
                    if (diagram.bpmnModule.textAnnotationConnectors.indexOf(diagram.nameTable[edges[i]]) === -1) {
                        diagram.remove(diagram.nameTable[edges[i]]);
                    }
                }
                const obj: NodeModel = cloneObject(source);
                const entry: HistoryEntry = {
                    type: 'PositionChanged', undoObject: { nodes: [redoElement] },
                    redoObject: { nodes: [obj] }, category: 'Internal'
                };
                diagram.addHistoryEntry(entry);
                if (diagram.mode === 'SVG') {
                    if (source.zIndex < target.zIndex) {
                        diagram.updateProcesses(source as Node);
                        this.updateSubprocessNodeIndex(source, diagram, target);
                    }
                }
                this.updateDocks(source as Node, diagram);
            }
        }
    }
    private updateIndex(diagram: Diagram, source: Node): void {
        //let processNode: Node;
        const processNode: Node = source;
        const nodeindex: string = diagram.getIndex(processNode, processNode.id);
        diagram.nodes.splice(Number(nodeindex), 1);
        processNode.zIndex = diagram.nodes[diagram.nodes.length - 1].zIndex + 1;
        diagram.nodes.push(processNode);
    }
    private updateSubprocessNodeIndex(source: Node, diagram: Diagram, target: Node): void {
        if ((source.shape as BpmnShapeModel).activity.subProcess.processes
            && (source.shape as BpmnShapeModel).activity.subProcess.processes.length > 0) {
            for (let i: number = 0; i < (source.shape as BpmnShapeModel).activity.subProcess.processes.length; i++) {
                this.updateIndex(diagram, source);
                const processes: string = (source.shape as BpmnShapeModel).activity.subProcess.processes[i];
                if (diagram.nameTable[processes].shape.activity.subProcess.processes.length > 0) {

                    this.updateSubprocessNodeIndex(diagram.nameTable[processes], diagram, target);
                } else {
                    const node: Node = diagram.nameTable[(source.shape as BpmnShapeModel).activity.subProcess.processes[i]];
                    this.updateIndex(diagram, node);
                }
            }
        } else {
            this.updateIndex(diagram, source);
        }
    }
    /** @private */
    public updateDocks(obj: Node, diagram: Diagram): void {
        if (obj.shape.type === 'Bpmn' && (obj.shape as BpmnShape).activity.subProcess.processes &&
            !(obj.shape as BpmnShape).activity.subProcess.collapsed) {
            const processTable: string[] = (obj.shape as BpmnShape).activity.subProcess.processes;
            for (const i of processTable) {
                const actualObject: Node = diagram.nameTable[i];
                if (actualObject) {
                    diagram.updateConnectorEdges(actualObject);
                    actualObject.wrapper.measure(new Size(actualObject.wrapper.width, actualObject.wrapper.height));
                    actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
                    if ((actualObject.shape as BpmnShape).activity.subProcess.processes
                        && (actualObject.shape as BpmnShape).activity.subProcess.processes.length) {
                        this.updateDocks(actualObject, diagram);
                    }
                }
            }
        }
    }
    /** @private */
    public removeBpmnProcesses(currentObj: Node, diagram: Diagram): void {
        const element: NodeModel = diagram.nameTable[currentObj.processId];
        if (currentObj.shape.type === 'Bpmn' && (currentObj.shape as BpmnShape).activity.subProcess.processes &&
            (currentObj.shape as BpmnShape).activity.subProcess.processes.length > 0) {
            const processes: string[] = (currentObj.shape as BpmnShape).activity.subProcess.processes;
            for (let j: number = processes.length - 1; j >= 0; j--) {
                diagram.remove(diagram.nameTable[processes[j]]);
            }
        }
        if (element) {
            diagram.removeDependentConnector(currentObj);
            const processes: string[] = (element.shape as BpmnShape).activity.subProcess.processes;
            this.removeChildFromBPMN(element.wrapper, currentObj.id);
            const processIndex: number = processes.indexOf(currentObj.id);
            processes.splice(processIndex, 1);

        }
    }
    /** @private */
    public removeChildFromBPMN(wrapper: Container, name: string): void {
        for (const i of wrapper.children) {
            if (i.id === name) {
                wrapper.children.splice(wrapper.children.indexOf(i), 1);
            } else if ((i as Container).children) {
                this.removeChildFromBPMN((i as Container), name);
            }
        }
    }
    /** @private */
    public removeProcess(id: string, diagram: Diagram): void {
        const node: Node = diagram.nameTable[id];
        if (node) {
            const parent: NodeModel = diagram.nameTable[node.processId];
            if (parent && parent.shape.type === 'Bpmn') {
                const processes: string[] = (parent.shape as BpmnShape).activity.subProcess.processes;
                diagram.removeDependentConnector(node as Node);
                this.removeChildFromBPMN(parent.wrapper, id);
                const processIndex: number = processes.indexOf(id);
                processes.splice(processIndex, 1);
                node.processId = '';
                diagram.refreshDiagramLayer();
                diagram.updateSelector();
            }
        }
    }
    /** @private */
    public addProcess(process: NodeModel, parentId: string, diagram: Diagram): void {
        //let id: string;
        process.id = process.id || randomId();
        const id: string = process.id;
        const node: Node = diagram.nameTable[id];
        if (!node) {
            diagram.add(process);
        }
        (process as Node).processId = parentId;
        const parentNode: NodeModel = diagram.nameTable[parentId];
        const subProcess: BpmnSubProcessModel = (parentNode.shape as BpmnShape).activity.subProcess;
        if (node && parentNode && parentNode.shape.type === 'Bpmn' && node.shape.type === 'Bpmn' &&
            subProcess.processes) {
            node.processId = parentId;
            const processes: string[] = (parentNode.shape as BpmnShape).activity.subProcess.processes;
            if (processes.indexOf(id) < 0) {
                processes.push(id);
            }
            parentNode.wrapper.children.push(node.wrapper);
            parentNode.wrapper.measure(new Size());
            parentNode.wrapper.arrange(parentNode.wrapper.desiredSize);
            diagram.bpmnModule.updateDocks((parentNode as Node), diagram);
            diagram.refreshDiagramLayer();
            if (diagram.mode === 'SVG' && (node.shape && (node.shape as BpmnShape).activity
                && !(node.shape as BpmnShape).activity.subProcess.processes)) {
                const child: HTMLElement = getDiagramElement(parentId + '_groupElement');
                child.appendChild(getDiagramElement(process.id + '_groupElement'));
            }
        }
    }

    /** @private */
    public getChildrenBound(node: NodeModel, excludeChild: string, diagram: Diagram): Rect {
        const processes: string[] = (node.shape as BpmnShape).activity.subProcess.processes;
        let bound: Rect;
        if (processes && processes.length) {
            for (const i of processes) {
                if (excludeChild !== i) {
                    if (!bound) {
                        bound = diagram.nameTable[i].wrapper.bounds;
                    } else {
                        bound = diagram.nameTable[i].wrapper.bounds.uniteRect(bound);
                    }
                }
            }
        }
        return bound || diagram.nameTable[excludeChild].wrapper.bounds;
    }
    /** @private */
    public updateSubProcessess(bound: Rect, obj: NodeModel, diagram: Diagram): void {
        let diffX: number; let diffY: number;
        const node: NodeModel = diagram.nameTable[(obj as Node).processId];
        let right: boolean; let bottom: boolean;
        const pivot: PointModel = { x: 0.5, y: 0.5 };
        if ((node.wrapper.bounds.left + obj.margin.left + obj.width) > (node.wrapper.bounds.right)) {
            right = true;
        }
        if ((node.wrapper.bounds.top + obj.margin.top + obj.height) > (node.wrapper.bounds.bottom)) {
            bottom = true;
        }
        if (right) {
            pivot.x = 0;
        }
        if (bottom) { pivot.y = 0; }
        const actualSize: Size = node.wrapper.actualSize;
        if (right) {
            diffX = (obj.wrapper.margin.left + obj.wrapper.bounds.width) / actualSize.width;
        }
        if (bottom) {
            diffY = (obj.wrapper.margin.top + obj.wrapper.bounds.height) / actualSize.height;
        }
        if (diffX > 0 || diffY > 0) {
            diagram.commandHandler.scale(diagram.nameTable[(obj as Node).processId], diffX || 1, diffY || 1, pivot);
        }
    }
    /** @private */
    public getBPMNCompensationShape(node: Node, compensationNode: PathElement): PathElement {
        compensationNode.id = node.id + '_0_compensation';
        compensationNode.width = 12; compensationNode.height = 12;
        compensationNode.margin.bottom = 5; compensationNode.style.fill = 'transparent';
        compensationNode.style.strokeColor = node.style.strokeColor;
        compensationNode.horizontalAlignment = 'Left';
        compensationNode.verticalAlignment = 'Bottom';
        compensationNode.relativeMode = 'Object';
        compensationNode.data = 'M 22.462 18.754 l -6.79 3.92 l 6.79 3.92 V 22.89 l 6.415 3.705 v -7.841 l -6.415 3.705 V 18.754 Z' +
            ' M 28.331 19.701 v 5.947 l -5.149 -2.973 L 28.331 19.701 Z M 21.916 25.647 l -5.15 -2.973 l 5.15 -2.973 V 25.647 Z' +
            ' M 22.275 12.674 c -5.513 0 -9.999 4.486 -9.999 9.999 c 0 5.514 4.486 10.001 9.999 10.001' +
            ' c 5.514 0 9.999 -4.486 9.999 -10.001 C 32.274 17.16 27.789 12.674 22.275 12.674 Z M 22.275 32.127 ' +
            ' c -5.212 0 -9.453 -4.241 -9.453 -9.454 c 0 -5.212 4.241 -9.453 9.453 -9.453 c 5.212 0 9.453 4.241 9.453 9.453' +
            ' C 31.728 27.887 27.487 32.127 22.275 32.127 Z';

        return compensationNode;
    }
    /** @private */
    public getBPMNActivityShape(node: Node): Canvas {
        const eventshape: Canvas = new Canvas(); let content: DiagramElement;

        const shape: Object = (node.shape as BpmnShapeModel).activity;
        const task: BpmnActivities = (shape as BpmnActivityModel).activity;
        const subProcess: Object = (shape as BpmnActivityModel).subProcess;
        const activityType: Object = (shape as BpmnActivityModel).activity;

        if (task === 'Task') {
            content = this.getBPMNTaskShape(node);
        }
        if (task === 'SubProcess' && subProcess) {
            content = this.getBPMNSubProcessShape(node);
        }
        content.id = task + node.id;
        eventshape.children = [content];
        eventshape.style.fill = 'transparent';
        eventshape.style.strokeColor = 'transparent'; eventshape.style.strokeWidth = 0;
        return eventshape;
    }
    /** @private */
    public getBPMNSubprocessEvent(node: Node, subProcessEventsShapes: Canvas, events: BpmnSubEventModel): void {
        let annotations: DiagramElement; let ports: DiagramElement;
        if (events.annotations.length !== 0) {
            for (let i: number = 0; i < events.annotations.length; i++) {
                const annot: Object = events.annotations[i];
                annotations = node.initAnnotationWrapper(annot as Annotation);
                annotations.width = events.width; annotations.height = events.height;
                subProcessEventsShapes.children.push(annotations);
            }
        }
        if (events.ports.length !== 0) {
            for (let i: number = 0; i < events.ports.length; i++) {
                const port: Object = events.ports[i];
                ports = node.initPortWrapper(port as Port);
                subProcessEventsShapes.children.push(ports);
            }
        }
    }
    /** @private */
    public getBPMNAdhocShape(node: Node, adhocNode: PathElement, subProcess?: BpmnSubProcessModel): PathElement {
        adhocNode.id = node.id + '_0_adhoc';
        adhocNode.width = 12; adhocNode.height = 8;
        adhocNode.style.fill = 'black';
        adhocNode.style.strokeColor = node.style.strokeColor;
        adhocNode.margin.bottom = 5;
        adhocNode.horizontalAlignment = 'Left';
        adhocNode.verticalAlignment = 'Bottom';
        adhocNode.relativeMode = 'Object';
        adhocNode.data = 'M 49.832 76.811 v -2.906 c 0 0 0.466 -1.469 1.931 -1.5 c 1.465 -0.031 2.331 1.219 2.897 1.688 ' +
            's 1.06 0.75 1.526 0.75 c 0.466 0 1.548 -0.521 1.682 -1.208 s 0.083 3.083 0.083 3.083 s -0.76 0.969 -1.859 0.969 ' +
            'c -1.066 0 -1.865 -0.625 -2.464 -1.438 s -1.359 -0.998 -2.064 -0.906 C 50.598 75.467 49.832 76.811 49.832 76.811 Z';
        if (subProcess && subProcess.adhoc === true) {
            adhocNode.visible = true;
        } else { adhocNode.visible = false; }
        return adhocNode;
    }

    /** @private */
    private getBPMNTextAnnotation(
        node: Node, diagram: Diagram, annotation: BpmnAnnotationModel, content: DiagramElement): Canvas {
        annotation.id = annotation.id || randomId();
        (annotation as BpmnAnnotation).nodeId = node.id;
        const annotationContainer: Canvas = new Canvas();
        const annotationPath: PathElement = new PathElement();
        const textElement: TextElement = new TextElement();

        const margin: number = 10;
        annotationPath.id = node.id + '_' + annotation.id + '_path';
        annotationPath.width = annotation.width;
        annotationPath.height = annotation.height;
        annotationPath.relativeMode = 'Object';

        textElement.id = node.id + '_' + annotation.id + '_text';
        textElement.content = annotation.text;
        const style: TextStyleModel = node.style;
        textElement.style = {
            fontSize: style.fontSize, italic: style.italic, gradient: null, opacity: style.opacity,
            bold: style.bold, textWrapping: style.textWrapping, color: style.color, fill: 'white',
            fontFamily: style.fontFamily, whiteSpace: style.whiteSpace, textOverflow: 'Wrap',
            strokeColor: 'none', strokeWidth: 0,
            strokeDashArray: style.strokeDashArray, textAlign: style.textAlign, textDecoration: style.textDecoration
        };
        textElement.horizontalAlignment = 'Center';
        textElement.verticalAlignment = 'Center';
        textElement.relativeMode = 'Object';
        textElement.margin = { left: 5, right: 5, top: 5, bottom: 5 };
        annotationContainer.offsetX = node.offsetX + annotation.length *
            Math.cos(annotation.angle * (Math.PI / 180));
        annotationContainer.offsetY = node.offsetY + annotation.length *
            Math.sin(annotation.angle * (Math.PI / 180));
        annotationContainer.float = true;
        annotationContainer.transform = Transform.Self;
        annotationContainer.id = node.id + '_textannotation_' + annotation.id;
        annotationContainer.style.strokeColor = 'transparent';
        annotationContainer.margin = { left: margin, right: margin, top: margin, bottom: margin };
        annotationContainer.relativeMode = 'Object';
        annotationContainer.rotateAngle = 0;
        annotationContainer.children = [annotationPath, textElement];

        const annotationNode: Node = new Node(
            node.shape, 'annotations',
            { id: annotationContainer.id, shape: { type: 'Bpmn', shape: 'TextAnnotation' } }, true);
        annotationNode.ports = [
            {
                id: annotationPath.id + '_port', shape: 'Square',
                offset: { x: 0, y: 0.5 }
            }];
        annotationNode.offsetX = annotationContainer.offsetX;
        annotationNode.offsetY = annotationContainer.offsetY;
        (annotationNode as BpmnAnnotationModel).text = annotation.text;
        (annotationNode as BpmnAnnotationModel).angle = annotation.angle;
        (annotationNode as BpmnAnnotationModel).length = annotation.length;

        annotationNode.width = annotation.width;
        annotationNode.height = annotation.height;
        annotationNode.wrapper = annotationContainer;

        annotationContainer.children.push(annotationNode.initPortWrapper(annotationNode.ports[0] as Port));
        let bounds: Rect = new Rect(0, 0, 0, 0);
        const width: number = node.width || node.minWidth || 0;
        const height: number = node.height || node.minHeight || 0;
        if (width !== undefined && height !== undefined) {
            bounds = new Rect(node.offsetX - width / 2, node.offsetY - height / 2, width, height);
        }
        this.setAnnotationPath(
            bounds, annotationContainer, { x: annotationNode.offsetX, y: annotationNode.offsetY }, annotationNode,
            annotation.length, annotation.angle);

        const connector: ConnectorModel = {
            id: node.id + '_' + annotation.id + '_connector',
            constraints: ConnectorConstraints.Default & ~(ConnectorConstraints.DragTargetEnd | ConnectorConstraints.Drag),
            sourceID: node.id, targetID: annotationContainer.id,
            targetDecorator: { shape: 'None' }
        };

        const annotationConnector: Connector = new Connector(node.shape, 'annotations', connector, true);
        annotationConnector.targetPortID = annotationNode.ports[0].id;
        annotationConnector.init(diagram);
        annotationConnector.wrapper.float = false;
        annotationConnector.wrapper.transform = Transform.Self;
        (content as Canvas).children.push(annotationConnector.wrapper);
        annotationConnector.zIndex = 10000;
        let entry: {} = this.annotationObjects[node.id];
        if (!entry) {
            entry = {};
        }
        if (!entry[annotation.id]) {
            entry[annotation.id] = {};
        }
        const nodeKey: string = 'node';
        const connKey: string = 'connector';
        entry[annotation.id][nodeKey] = annotationNode;
        entry[annotation.id][connKey] = annotationConnector;
        this.annotationObjects[node.id] = entry;
        diagram.initObject(annotationNode, undefined, false);
        annotationNode.zIndex = 10000;
        return annotationContainer;
    }
    /** @private */
    private renderBPMNTextAnnotation(
        diagram: Diagram, annotation: BpmnAnnotationModel, content: DiagramElement): Canvas {
        annotation.id = annotation.id || randomId();
        const annotationsContainer: Canvas = new Canvas();
        const annotationPath: PathElement = new PathElement();
        const textObject: TextElement = new TextElement();

        const margin: number = 10;

        annotationPath.id = '_' + annotation.id + '_path';
        annotationPath.width = annotation.width;
        annotationPath.height = annotation.height;
        annotationPath.relativeMode = 'Object';
        textObject.id = annotation.id + '_text';
        textObject.content = ((annotation as Node).shape as BpmnShape).annotation.text;
        const textStyle: TextStyleModel = (annotation as Node).style;
        textObject.style = {
            fontSize: textStyle.fontSize, italic: textStyle.italic, gradient: null, opacity: textStyle.opacity,
            bold: textStyle.bold, textWrapping: textStyle.textWrapping, color: textStyle.color, fill: 'white',
            fontFamily: textStyle.fontFamily, whiteSpace: textStyle.whiteSpace, textOverflow: 'Wrap',
            strokeColor: 'none', strokeWidth: 0,
            strokeDashArray: textStyle.strokeDashArray, textAlign: textStyle.textAlign, textDecoration: textStyle.textDecoration
        };
        textObject.horizontalAlignment = 'Left';
        textObject.verticalAlignment = 'Center';
        textObject.relativeMode = 'Object';
        textObject.margin = { left: 5, right: 5, top: 5, bottom: 5 };

        annotationsContainer.offsetX = (annotation as Node).offsetX + ((annotation as Node).shape as BpmnShape).annotation.length *
            Math.cos(((annotation as Node).shape as BpmnShape).annotation.angle * (Math.PI / 180));
        annotationsContainer.offsetY = (annotation as Node).offsetY + ((annotation as Node).shape as BpmnShape).annotation.length *
            Math.sin(((annotation as Node).shape as BpmnShape).annotation.angle * (Math.PI / 180));
        annotationsContainer.float = true;
        //    annotationContainer.transform = Transform.Self;
        annotationsContainer.id = (annotation as Node).id + '_textannotation_' + annotation.id;
        annotationsContainer.style.strokeColor = 'transparent';
        annotationsContainer.margin = { left: margin, right: margin, top: margin, bottom: margin };
        annotationsContainer.relativeMode = 'Object';
        annotationsContainer.rotateAngle = 0;
        annotationsContainer.children = [annotationPath, textObject];

        const annotationObject: Node = new Node(
            (annotation as Node).shape, 'annotations',
            { id: annotationsContainer.id, shape: { type: 'Bpmn', shape: 'TextAnnotation' } }, true);
        annotationObject.ports = [
            {
                id: annotationPath.id + '_port', shape: 'Square',
                offset: { x: 0, y: 0.5 }
            }];
        annotationObject.offsetX = annotationsContainer.offsetX;
        annotationObject.offsetY = annotationsContainer.offsetY;
        if ((annotationObject as Node).shape && ((annotationObject as Node).shape as BpmnShape).annotation) {
            (annotationObject as BpmnAnnotationModel).text = ((annotation as Node).shape as BpmnShape).annotation.text;
            (annotationObject as BpmnAnnotationModel).angle = ((annotation as Node).shape as BpmnShape).annotation.angle;
            (annotationObject as BpmnAnnotationModel).length = ((annotation as Node).shape as BpmnShape).annotation.length;
        }
        annotationObject.width = annotation.width;
        annotationObject.height = annotation.height;
        annotationObject.wrapper = annotationsContainer;

        annotationsContainer.children.push(annotationObject.initPortWrapper(annotationObject.ports[0] as Port));
        let bounds: Rect = new Rect(0, 0, 0, 0);
        const width: number = (annotation as Node).width || 0;
        const height: number = (annotation as Node).height || 0;
        if (width !== undefined && height !== undefined) {
            bounds = new Rect((annotation as Node).offsetX - width / 2, (annotation as Node).offsetY - height / 2, width, height);
        }
        this.setAnnotationPath(
            bounds, annotationsContainer, { x: annotationObject.offsetX, y: annotationObject.offsetY }, annotationObject,
            annotation.length, annotation.angle);
        return annotationsContainer;
    }

    /** @private */
    public getTextAnnotationWrapper(node: NodeModel, id: string): TextElement {
        if (node && node.shape.type === 'Bpmn') {
            const shape: BpmnShapes = (isBlazor() ? (node.shape as DiagramShape).bpmnShape : (node.shape as BpmnShape).shape);
            if (shape === 'TextAnnotation') {
                return node.wrapper.children[1] as TextElement;
            } else if (this.annotationObjects[node.id] && this.annotationObjects[node.id][id]) {
                const annotationNode: NodeModel = this.annotationObjects[node.id][id].node;
                return this.getTextAnnotationWrapper(annotationNode, id);
            }
        }
        return null;
    }

    /** @private */
    public addAnnotation(node: NodeModel, annotation: BpmnAnnotationModel, diagram: Diagram): ConnectorModel {
        const bpmnShapeContent: Canvas = node.wrapper.children[0] as Canvas;
        const shape: BpmnShape = node.shape as BpmnShape;
        (annotation as BpmnAnnotation).nodeId = node.id;
        const annotationObj: BpmnAnnotation = new BpmnAnnotation(shape, 'annotations', annotation, true);
        shape.annotations.push(annotationObj);
        bpmnShapeContent.children.push(
            this.getBPMNTextAnnotation(node as Node, diagram, annotation, bpmnShapeContent));
        node.wrapper.measure(new Size());
        node.wrapper.arrange(node.wrapper.desiredSize);
        return this.annotationObjects[node.id][annotation.id].connector;
    }

    private clearAnnotations(obj: NodeModel, diagram: Diagram): void {
        const bpmnShape: BpmnShape = obj.shape as BpmnShape;
        if (bpmnShape.annotations.length) {
            for (let i: number = bpmnShape.annotations.length - 1; i >= 0; i--) {
                const annotation: BpmnAnnotationModel = bpmnShape.annotations[i];
                this.removeAnnotationObjects(obj, annotation, diagram);
            }
        }
        delete this.annotationObjects[obj.id];
    }

    /** @private */
    public checkAndRemoveAnnotations(node: NodeModel, diagram: Diagram): boolean {
        //remove connector path
        //remove annotation node wrapper
        //remove from a quad
        if (node.shape.type === 'Bpmn') {
            if ((!isBlazor() && (node.shape as BpmnShape).shape === 'TextAnnotation') ||
                (isBlazor() && (node.shape as DiagramShape).bpmnShape === 'TextAnnotation')) {
                const id: string[] = node.id.split('_');
                const annotationId: string = id[id.length - 1];
                const nodeId: string = id[id.length - 3] || id[0];
                const parentNode: NodeModel = diagram.nameTable[nodeId];
                const bpmnShape: BpmnShape = parentNode.shape as BpmnShape;
                for (const annotation of bpmnShape.annotations) {
                    if (annotation.id === annotationId) {
                        const index: number = bpmnShape.annotations.indexOf(annotation);
                        if (index !== -1) {
                            diagram.removeDependentConnector(node as Node);
                            this.removeAnnotationObjects(parentNode, annotation, diagram);
                            return true;
                        }
                    }
                }
            } else if ((node.shape as BpmnShape).annotations && (node.shape as BpmnShape).annotations.length) {
                this.clearAnnotations(node, diagram);
            }
        }
        return false;
    }

    private removeAnnotationObjects(parentNode: NodeModel, annotation: BpmnAnnotationModel, diagram: Diagram): void {
        const bpmnShape: BpmnShape = parentNode.shape as BpmnShape;
        let index: number = bpmnShape.annotations.indexOf(annotation);
        if (index !== -1) {
            if (!(diagram.diagramActions & DiagramAction.UndoRedo) && !(diagram.diagramActions & DiagramAction.Group)) {
                const entry: HistoryEntry = {
                    type: 'CollectionChanged', changeType: 'Remove', undoObject: cloneObject(annotation),
                    redoObject: cloneObject(annotation), category: 'Internal'
                };
                diagram.addHistoryEntry(entry);
            }
            bpmnShape.annotations.splice(index, 1);
            const entry: {} = this.annotationObjects[parentNode.id];
            if (entry && entry[annotation.id]) {
                const annotationNode: NodeModel = entry[annotation.id].node;
                const annotationConnector: NodeModel = entry[annotation.id].connector;
                diagram.removeElements(annotationNode);
                diagram.removeElements(annotationConnector);
                const nodeContent: DiagramElement = parentNode.wrapper.children[0];
                index = (nodeContent as Container).children.indexOf(annotationNode.wrapper);
                (nodeContent as Container).children.splice(index, 1);
                index = (nodeContent as Container).children.indexOf(annotationConnector.wrapper);
                (nodeContent as Container).children.splice(index, 1);
                diagram.removeFromAQuad(annotationNode as IElement);
                diagram.removeFromAQuad(annotationConnector as IElement);
                delete diagram.nameTable[annotationNode.id];
                delete diagram.nameTable[annotationConnector.id];
                delete entry[annotation.id];
            }
        }
    }

    private setAnnotationPath(
        parentBounds: Rect, wrapper: DiagramElement, position: PointModel, node: NodeModel, length?: number,
        angle?: number): void {
        const rotateAngle: number = this.getAnnotationPathAngle(position, parentBounds);
        let data: string = '';
        const pathElement: PathElement = (wrapper as Canvas).children[0] as PathElement;
        const portElement: DiagramElement = (wrapper as Canvas).children[2];
        const textElement: DiagramElement = (wrapper as Canvas).children[1];
        pathElement.horizontalAlignment = 'Stretch';
        pathElement.verticalAlignment = 'Stretch';
        textElement.margin.left = textElement.margin.right = 5;
        textElement.margin.top = textElement.margin.bottom = 5;
        let point: PointModel;
        let segment: Segment;
        if (rotateAngle === 0) {
            data = 'M10,20 L0,20 L0,0 L10,0';
            pathElement.width = 10;
            pathElement.horizontalAlignment = 'Left';
            portElement.setOffsetWithRespectToBounds(0, 0.5, 'Fraction');
            textElement.margin.top = textElement.margin.bottom = 10;
            point = parentBounds.middleRight;
            segment = {
                x1: parentBounds.right, y1: parentBounds.top,
                x2: parentBounds.right, y2: parentBounds.bottom
            };
        } else if (rotateAngle === 180) {
            data = 'M0,0 L10,0 L10,20 L0,20';
            pathElement.width = 10;
            pathElement.horizontalAlignment = 'Right';
            portElement.setOffsetWithRespectToBounds(1, 0.5, 'Fraction');
            textElement.margin.top = textElement.margin.bottom = 10;
            point = parentBounds.middleLeft;
            segment = {
                x1: parentBounds.left, y1: parentBounds.top,
                x2: parentBounds.left, y2: parentBounds.bottom
            };
        } else if (rotateAngle === 90) {
            data = 'M20,10 L20,0 L0,0 L0,10';
            pathElement.height = 10;
            pathElement.verticalAlignment = 'Top';
            portElement.setOffsetWithRespectToBounds(0.5, 0, 'Fraction');
            textElement.margin.left = textElement.margin.right = 10;
            point = parentBounds.bottomCenter;
            segment = {
                x1: parentBounds.right, y1: parentBounds.bottom,
                x2: parentBounds.left, y2: parentBounds.bottom
            };
        } else {
            data = 'M0,0 L0,10 L20,10 L20,0';
            pathElement.height = 10;
            pathElement.verticalAlignment = 'Bottom';
            portElement.setOffsetWithRespectToBounds(0.5, 1, 'Fraction');
            textElement.margin.left = textElement.margin.right = 10;
            point = parentBounds.topCenter;
            segment = {
                x1: parentBounds.right, y1: parentBounds.top,
                x2: parentBounds.left, y2: parentBounds.top
            };
        }
        const center: PointModel = parentBounds.center;
        const endPoint: PointModel = Point.transform(position, angle, Math.max(parentBounds.width, parentBounds.height));
        point = getIntersectionPoints(segment, [center, endPoint], false, center);

        pathElement.data = data;
        if (length !== undefined && angle !== undefined) {
            point = Point.transform(point, angle, length);
            wrapper.offsetX = node.offsetX = point.x;
            wrapper.offsetY = node.offsetY = point.y;
        }
    }

    /**   @private  */
    public isBpmnTextAnnotation(activeLabel: ActiveLabel, diagram: Diagram): NodeModel {
        if (this.annotationObjects) {
            const parentNodeId: string = activeLabel.parentId;
            const annotationId: string = activeLabel.id;
            const parentNode: NodeModel = diagram.nameTable[parentNodeId];
            if (parentNode && parentNode.shape.type === 'Bpmn' && this.annotationObjects[parentNodeId] &&
                this.annotationObjects[parentNodeId][annotationId]) {
                return parentNode;
            }
            return null;
        }
        return null;
    }

    /** @private */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public updateTextAnnotationContent(parentNode: NodeModel, activeLabel: ActiveLabel, text: string, diagram: Diagram): void {
        const parentNodeId: string = activeLabel.parentId;
        const annotationId: string = activeLabel.id;
        if (this.annotationObjects[parentNodeId] && this.annotationObjects[parentNodeId][annotationId]) {
            for (const annotation of (parentNode.shape as BpmnShape).annotations) {
                if (annotation.id === annotationId) {
                    annotation.text = text;
                    const wrapper: TextElement = this.annotationObjects[parentNodeId][annotationId].node.wrapper.children[1];
                    wrapper.content = text;
                    wrapper.visible = true;
                    parentNode.wrapper.measure(new Size());
                    parentNode.wrapper.arrange(parentNode.wrapper.desiredSize);
                }
            }
        }
    }

    /**   @private  */
    public updateQuad(actualObject: Node, diagram: Diagram): void {
        const annotation: BpmnAnnotationModel = (actualObject.shape as BpmnShape).annotations;
        let annotationNode: NodeModel;
        if (annotation && annotation.length > 0) {
            for (let i: number = 0; i < annotation.length; i++) {
                annotationNode = this.annotationObjects[actualObject.id][annotation[i].id].node;
                diagram.updateQuad(annotationNode as IElement);
            }
        }
    }


    /** @private */
    public updateTextAnnotationProp(actualObject: Node, oldObject: Node, diagram: Diagram): void {
        if (actualObject.shape.type === 'Bpmn') {
            const annotation: BpmnAnnotationModel = (actualObject.shape as BpmnShape).annotations;
            if (annotation && annotation.length > 0) {
                for (let i: number = 0; i < (actualObject.wrapper.children[0] as Canvas).children.length; i++) {
                    for (let j: number = 0; j < annotation.length; j++) {
                        const annotationId: string[] = (actualObject.wrapper.children[0] as Canvas).children[i].id.split('_');
                        const id: string = annotationId[annotationId.length - 1];
                        if (id === annotation[j].id) {
                            const annotationNode: NodeModel = this.annotationObjects[actualObject.id][annotation[j].id].node;
                            const connector: ConnectorModel = this.annotationObjects[actualObject.id][annotation[j].id].connector;
                            const direction: string = getPortDirection(
                                connector.targetPoint, actualObject.wrapper.bounds, actualObject.wrapper.bounds, false);
                            let position: PointModel = connector.sourcePoint;
                            position = {
                                x: connector.sourcePoint.x + actualObject.offsetX - (oldObject.offsetX),
                                y: connector.sourcePoint.y + actualObject.offsetY - (oldObject.offsetY)
                            };
                            position = Point.transform(
                                position,
                                (annotation[j] as BpmnAnnotationModel).angle,
                                (annotation[j] as BpmnAnnotationModel).length);
                            (actualObject.wrapper.children[0] as Canvas).children[i].offsetX =
                                annotationNode.offsetX = position.x;
                            (actualObject.wrapper.children[0] as Canvas).children[i].offsetY =
                                annotationNode.offsetY = position.y;
                            diagram.updateQuad(annotationNode as IElement);
                        }
                    }
                }
            }
        }
    }
    // /** @private */
    // public findInteractableObject(obj: ConnectorModel, diagram: Diagram): NodeModel | ConnectorModel {
    //     if (obj.targetID) {
    //         let targetNode: NodeModel = diagram.nameTable[obj.targetID];
    //         if (targetNode.shape.type === 'Bpmn' && (targetNode.shape as BpmnShape).shape === 'TextAnnotation') {
    //             return targetNode;
    //         }
    //     }
    //     return obj;
    // }


    /** @private */
    private getSubprocessChildCount(node: Node): number {
        let count: number = 0;
        const shape: BpmnActivityModel = (node.shape as BpmnShape).activity;
        //let loopType: string;
        const subProcess: BpmnSubProcessModel = shape.subProcess;
        const loopType: string = (subProcess as BpmnSubProcess).loop;
        if (loopType !== undefined && loopType !== 'None') {
            count++;
        }
        if (((subProcess as BpmnSubProcess).compensation !== undefined) &&
            (subProcess as BpmnSubProcess).compensation === true) {
            count++;
        }
        if (((subProcess as BpmnSubProcess).collapsed !== undefined) &&
            (subProcess as BpmnSubProcess).collapsed === true) {
            count++;
        }
        if (((subProcess as BpmnSubProcess).adhoc !== undefined) &&
            (subProcess as BpmnSubProcess).adhoc === true) {
            count++;
        }
        return count;
    }
    /** @private */
    private getTaskChildCount(node: Node): number {
        let count: number = 0;
        const shape: BpmnActivityModel = (node.shape as BpmnShape).activity;
        const task: BpmnTaskModel = (shape as BpmnActivity).task; let loopType: string;
        if (((task as BpmnTask).compensation !== undefined) &&
            (task as BpmnTask).compensation === true) {
            count++;
        }
        if (((task as BpmnTask).loop !== undefined) &&
            (task as BpmnTask).loop !== 'None') {
            count++;
        }

        return count;
    }
    /** @private */
    private setStyle(child: DiagramElement, node: Node): void {
        //set style
        child.style.fill = node.style.fill; child.style.strokeColor = node.style.strokeColor;
        child.style.strokeWidth = node.style.strokeWidth;
        child.style.strokeDashArray = node.style.strokeDashArray;
        child.style.opacity = node.style.opacity; child.style.gradient = node.style.gradient;

        if ((node.constraints & NodeConstraints.Shadow) !== 0) {
            child.shadow = node.shadow;
        }
    }

    //End code conversion region

    //Update BPMN Shapes on NodePropertyChange
    //Start region
    /** @private */
    public updateBPMN(changedProp: Node, oldObject: Node, actualObject: Node, diagram: Diagram): void {
        const newShape: BpmnShapeModel = changedProp.shape as BpmnShapeModel || {};
        const elementWrapper: DiagramElement = actualObject.wrapper.children[0];
        const actualShape: BpmnShapes = (actualObject.shape as BpmnShapeModel).shape ||
        ((actualObject.shape as DiagramShape).bpmnShape);
        const sizeChanged: boolean = changedProp.width !== undefined || changedProp.height !== undefined;
        if (((isBlazor() && (newShape as DiagramShapeModel).bpmnShape === 'Gateway') || newShape.shape === 'Gateway') &&
            newShape.gateway) {
                this.removeBPMNElementFromDOM(actualObject,diagram);
            actualObject.wrapper.children[0] = this.getBPMNGatewayShape(actualObject);
        } else if (((isBlazor() && (newShape as DiagramShapeModel).bpmnShape === 'DataObject') || newShape.shape === 'DataObject') &&
            newShape.dataObject) {
                this.removeBPMNElementFromDOM(actualObject,diagram);
            actualObject.wrapper.children[0] = this.getBPMNDataObjectShape(actualObject);
        } else if (((isBlazor() && (newShape as DiagramShapeModel).bpmnShape === 'Activity') || newShape.shape === 'Activity') &&
            newShape.activity) {
                this.removeBPMNElementFromDOM(actualObject,diagram);
            actualObject.wrapper.children[0] = this.getBPMNActivityShape(actualObject);
        } 
             /**
             * EJ2-EJ2-60644 - Bpmn event fill color does not applied while changing event in runtime.
             */
        else if (((isBlazor() && (newShape as DiagramShapeModel).bpmnShape === 'Event' ||
        (actualObject.shape as DiagramShapeModel).bpmnShape === 'Event' || (actualObject.shape as BpmnShape).shape === 'Event') || newShape.shape === 'Event') &&
            newShape.event) {
                this.removeBPMNElementFromDOM(actualObject,diagram);
            const shapeEvent: Object = newShape.event;
            actualObject.wrapper.children[0] = this.getBPMNEventShape(actualObject, shapeEvent);
        } else if (((isBlazor() && (newShape as DiagramShapeModel).bpmnShape === 'Message') || newShape.shape === 'Message') ||
            ((isBlazor() && (newShape as DiagramShapeModel).bpmnShape === 'DataSource') || newShape.shape === 'DataSource')) {
                this.removeBPMNElementFromDOM(actualObject,diagram);
                actualObject.wrapper.children[0] = this.getBPMNShapes(actualObject);
            //}
            // else if (newShape.shape === 'Group') {
            //     actualObject.wrapper.children[0] = this.getBPMNGroup(actualObject, diagram);
        } else if (newShape.gateway !== undefined || (actualShape === 'Gateway' && sizeChanged)) {
            this.updateBPMNGateway(actualObject, changedProp);
        } else if (newShape.dataObject !== undefined || (actualShape === 'DataObject' && sizeChanged)) {
            this.updateBPMNDataObject(actualObject, changedProp, oldObject);
        } else if (newShape.activity !== undefined || (actualShape === 'Activity' && sizeChanged)) {
            this.updateBPMNActivity(actualObject, changedProp, oldObject, diagram);

        } else if (newShape.event !== undefined || (actualShape === 'Event' && sizeChanged)) {
            this.updateBPMNEvent(actualObject, changedProp, oldObject);
        }
        actualObject.wrapper.children[0].id = actualObject.wrapper.children[0].id || elementWrapper.id;
        if (changedProp.style) {
            updateStyle(
                changedProp.style,
                elementWrapper instanceof Container ? ((!isBlazor() && (actualObject.shape as BpmnShape).shape === 'Activity' ||
                    (isBlazor() && (actualObject.shape as DiagramShape).bpmnShape === 'Activity'))) ?
                    (elementWrapper.children[0] as Container).children[0] :
                    elementWrapper.children[0] : elementWrapper);

            if (changedProp.style && changedProp.style.strokeColor) {
                if ((elementWrapper as Container).children.length > 0) {
                    if (((!isBlazor() && (actualObject.shape as BpmnShape).shape === 'Activity') ||
                        (isBlazor() && (actualObject.shape as DiagramShape).bpmnShape === 'Activity')) &&
                        (actualObject.shape as BpmnShape).activity.activity === 'SubProcess') {
                        const child: DiagramElement = (elementWrapper as Container).children[0];
                        this.updateBPMNStyle(child, changedProp.style.strokeColor);
                    } else if (((!isBlazor() && (actualObject.shape as BpmnShape).shape === 'Gateway')
                        || (isBlazor() && (actualObject.shape as DiagramShape).bpmnShape === 'Gateway')) ||
                        ((!isBlazor() && (actualObject.shape as BpmnShape).shape === 'Event')
                            || (isBlazor() && (actualObject.shape as DiagramShape).bpmnShape === 'Event'))) {
                        this.updateBPMNStyle(elementWrapper, changedProp.style.strokeColor);
                    }
                }
            }
        }
    }

    /** 
    * EJ2-60574 -BPMN shape do not get changed at runtime properly 
    */
    private removeBPMNElementFromDOM(actualObject:Node,diagram:Diagram):void{
        for (const elementId of diagram.views) {
            removeElement(actualObject.id + '_groupElement', elementId);
        }   
    }

    /** @private */
    public updateBPMNStyle(elementWrapper: DiagramElement, changedProp: string): void {
        for (let i: number = 0; i < (elementWrapper as Container).children.length; i++) {
            const child: DiagramElement = (elementWrapper as Container).children[i];
            updateStyle({ strokeColor: changedProp }, child);
        }
    }

    /** @private */
    public updateBPMNGateway(node: Node, changedProp: Node): void {
        const bpmnShape: BpmnShapeModel = node.shape as BpmnShapeModel;
        const elementWrapper: Canvas = node.wrapper.children[0] as Canvas;
        if (bpmnShape) {
            updateStyle(node.style, elementWrapper.children[0]);
            const pathData: string = getBpmnGatewayShapePathData(bpmnShape.gateway.type);
            const dataobjTypeNode =this.updateGatewaySubType(elementWrapper, node , pathData);
            removeElement(elementWrapper.children[1].id);
            elementWrapper.children.splice(1,1);
            elementWrapper.children.push(dataobjTypeNode);
        }
        if (changedProp.width !== undefined || changedProp.height !== undefined) {
            this.setSizeForBPMNGateway(
                (node.shape as BpmnShapeModel).gateway, elementWrapper, changedProp.width || node.width, changedProp.height || node.height);
        }
    }
       /**
     * Used to update Bpmn gateway child in runtime 
     * EJ2-60581
     * @param elementWrapper 
     * @param node 
     * @param pathData 
     * @returns 
     */
        updateGatewaySubType(elementWrapper: Canvas,node: Node,pathData: string)
        {
            const dataobjTypeNode: PathElement = new PathElement();
            dataobjTypeNode.id = node.id + '_1_gatewayType';
            dataobjTypeNode.width = elementWrapper.children[1].width; dataobjTypeNode.height =elementWrapper.children[1].height;
            dataobjTypeNode.margin.left = elementWrapper.children[1].margin.left; dataobjTypeNode.margin.top =elementWrapper.children[1].margin.top;
            dataobjTypeNode.data = pathData;
            dataobjTypeNode.offsetX = elementWrapper.children[1].offsetX;
            dataobjTypeNode.offsetY = elementWrapper.children[1].offsetY;
            dataobjTypeNode.style = elementWrapper.children[1].style;
            dataobjTypeNode.horizontalAlignment = elementWrapper.children[1].horizontalAlignment;
            dataobjTypeNode.verticalAlignment = elementWrapper.children[1].verticalAlignment;
            dataobjTypeNode.relativeMode = elementWrapper.children[1].relativeMode;
            dataobjTypeNode.transform = elementWrapper.children[1].transform;
            return dataobjTypeNode;
        }
    /** @private */
    public updateBPMNDataObject(node: Node, newObject: Node, oldObject: Node): void {
        const bpmnShape: BpmnShapeModel = newObject.shape as BpmnShapeModel;
        const elementWrapper: Canvas = node.wrapper.children[0] as Canvas;
        if (bpmnShape) {
            const elementWrapperChild1: DiagramElement = elementWrapper.children[1];
            const elementWrapperChild2: DiagramElement = elementWrapper.children[2];
            if (newObject.style !== undefined) {
                updateStyle(newObject.style, (elementWrapper as Canvas).children[0]);
                elementWrapperChild1.style.opacity = node.style.opacity;
                elementWrapperChild2.style.opacity = node.style.opacity;
            }
            if (bpmnShape.dataObject) {
                switch (bpmnShape.dataObject.type) {
                case 'None':
                    elementWrapperChild1.visible = false;
                    break;
                case 'Input':
                    elementWrapperChild1.style.fill = 'white';
                    break;
                case 'Output':
                    elementWrapperChild1.style.fill = 'black';
                    break;
                }
                if ((oldObject.shape as BpmnShape).dataObject.type === 'None') {
                    elementWrapperChild1.visible = true;
                }
                if ((newObject.shape as BpmnShape).dataObject.collection !== undefined) {
                    elementWrapperChild2.visible = bpmnShape.dataObject.collection;
                }
            }
        }
        if (newObject.width !== undefined || newObject.height !== undefined) {
            this.setSizeForBPMNDataObjects(
                (node.shape as BpmnShapeModel).dataObject, elementWrapper,
                newObject.width || node.width, newObject.height || node.height);
        }
    }
    /** @private */
    public getEvent(
        node: Node, oldObject: Node, event: string, child0: DiagramElement, child1: DiagramElement, child2: DiagramElement): void {
        switch (event) {
        case 'Start':
            child1.visible = false;
            child0.style.strokeDashArray = '';
            child2.style.fill = 'white';
            child2.style.strokeColor = 'black';
            child0.style.fill = 'white';
            break;
        case 'NonInterruptingStart':
            child0.style.strokeDashArray = '2 3';
            child2.style.fill = 'white';
            child0.style.fill = 'white';
            child2.style.strokeColor = 'black';
            child1.visible = false;
            break;
        case 'Intermediate':
            child0.style.strokeDashArray = '';
            child0.style.fill = 'white';
            child1.style.strokeDashArray = '';
            child0.style.gradient = null;
            child2.style.fill = 'white';
            child2.style.strokeColor = 'black';
            this.updateEventVisibility(oldObject, child1);
            break;
        case 'NonInterruptingIntermediate':
            child0.style.fill = 'white';
            child0.style.gradient = null;
            child2.style.fill = 'white';
            child2.style.strokeColor = 'black';
            child0.style.strokeDashArray = '2 3';
            child1.style.strokeDashArray = '2 3';
            this.updateEventVisibility(oldObject, child1);
            break;
        case 'ThrowingIntermediate':
        case 'End':
            child0.style.fill = event !== 'End' ? 'white' : 'black';
            child0.style.strokeDashArray = '';
            child1.style.strokeDashArray = '';
            child0.style.gradient = null;
            child2.style.fill = 'black';
            this.updateEventVisibility(oldObject, child1);
            child2.style.strokeColor = node.style.fill;
            break;
        }
    }
    /** @private */
    private updateEventVisibility(oldObject: Node, child1: DiagramElement): void {
        if ((oldObject.shape as BpmnShape).activity && (oldObject.shape as BpmnShape).activity.subProcess &&
            (oldObject.shape as BpmnShape).activity.subProcess.events &&
            (oldObject.shape as BpmnShape).activity.subProcess.events[0] !== undefined &&
            (oldObject.shape as BpmnShape).activity.subProcess.events[0].event !== undefined) {
            if ((oldObject.shape as BpmnShape).activity.subProcess.events[0].event === 'NonInterruptingStart' ||
                (oldObject.shape as BpmnShape).activity.subProcess.events[0].event === 'Start') {
                child1.visible = true;
            }
        } else if ((oldObject.shape as BpmnShape).event !== undefined) {
            if ((oldObject.shape as BpmnShape).event.event === 'NonInterruptingStart' ||
                (oldObject.shape as BpmnShape).event.event === 'Start') {
                child1.visible = true;
            }
        }
    }
    /** @private */
    public updateBPMNEvent(node: Node, newObject: Node, oldObject: Node): void {
        const bpmnShape: BpmnShapeModel = newObject.shape as BpmnShapeModel;
        let trigger: string;
        const elementWrapper: Canvas = node.wrapper.children[0] as Canvas;
        if (bpmnShape) {
            const elementWrapperChild0: DiagramElement = elementWrapper.children[0];
            const elementWrapperChild1: DiagramElement = elementWrapper.children[1];
            const elementWrapperChild2: DiagramElement = elementWrapper.children[2];
            //let event: string;
            if (newObject.style !== undefined) {
                updateStyle(node.style, elementWrapper.children[0]);
                if (newObject.style.opacity !== undefined || newObject.style.strokeColor !== undefined) {
                    elementWrapperChild1.style.opacity = node.style.opacity;
                    elementWrapperChild1.style.strokeColor = node.style.strokeColor;
                }
            }
            const event: string = bpmnShape.event.event;
            trigger = bpmnShape.event.trigger;
            if (event !== undefined) {
                this.getEvent(node, oldObject, event, elementWrapperChild0, elementWrapperChild1, elementWrapperChild2);
            }
            if (trigger !== undefined) {
                this.updateBPMNEventTrigger(node, newObject);
            }
        }
        if (newObject.width !== undefined || newObject.height !== undefined || trigger !== undefined) {
            this.setSizeForBPMNEvents(
                (node.shape as BpmnShapeModel).event, elementWrapper,
                newObject.width || node.width, newObject.height || node.height);
        }
    }
    /** @private */
    public updateBPMNEventTrigger(node: Node, newObject: Node): void {
        const bpmnShape: BpmnShapeModel = node.shape as BpmnShapeModel;
        const elementWrapper: DiagramElement = (node.wrapper.children[0] as Canvas).children[2];
        (elementWrapper as PathElement).canMeasurePath = true;
        if (newObject.style &&
            (newObject.style.strokeColor !== undefined || newObject.style.opacity !== undefined)) {
            updateStyle(node.style, elementWrapper);
        }
        const bpmnshapeTriggerdata: string = getBpmnTriggerShapePathData(
            bpmnShape.event.trigger);
        (elementWrapper as PathModel).data = bpmnshapeTriggerdata;
    }
    /** @private */
    public updateBPMNActivity(node: Node, newObject: Node, oldObject: Node, diagram: Diagram): void {
        const bpmnShape: BpmnShapeModel = newObject.shape as BpmnShapeModel;
        const elementWrapper: Canvas = node.wrapper.children[0] as Canvas;
        const size: Size = this.getSize(node, (elementWrapper.children[0] as Container).children[0] as PathElement);
        if (bpmnShape) {
            const oldProp: BpmnActivities = (oldObject.shape as BpmnShape).activity.activity;
            const actualObjectProp: BpmnActivities = (node.shape as BpmnShape).activity.activity;
            if ((oldProp === 'SubProcess' || oldProp === 'Task') && (actualObjectProp === 'SubProcess' || actualObjectProp === 'Task')) {
                diagram.removeElements(node);
                node.wrapper.children[0] = this.getBPMNActivityShape(node);
            } else {
                if (actualObjectProp === 'Task' && bpmnShape.activity.task !== undefined) {
                    this.updateBPMNActivityTask(node, newObject);
                    const subChildCount: number = this.getTaskChildCount(node); let x: number;
                    const childSpace: number = subChildCount * 12;

                    const area: number = size.width / 2 - childSpace;
                    if (subChildCount === 1) { x = area + 8; } else {
                        x = area + (subChildCount - 1) * 8;
                    }
                    if (bpmnShape.activity.task.loop !== undefined) {
                        this.updateBPMNActivityTaskLoop(node, newObject, x, subChildCount, area, 2);
                    }
                }
                if (actualObjectProp === 'SubProcess' && bpmnShape.activity.subProcess !== undefined) {
                    this.updateBPMNActivitySubProcess(node, newObject, oldObject, diagram);
                }
            }
            this.setSizeForBPMNActivity(
                (node.shape as BpmnShapeModel).activity, elementWrapper,
                newObject.width || size.width, newObject.height || size.height, node);
        }
        if (newObject.width !== undefined || newObject.height !== undefined) {
            this.setSizeForBPMNActivity(
                (node.shape as BpmnShapeModel).activity, elementWrapper,
                newObject.width || size.width, newObject.height || size.height, node);
        }
    }
    /** @private */
    public updateBPMNActivityTask(node: Node, newObject: Node): void {
        const bpmnShape: BpmnShapeModel = newObject.shape as BpmnShapeModel;
        const elementWrapper: Canvas = ((node.wrapper.children[0] as Canvas).children[0] as Canvas);
        const task: BpmnTaskModel = bpmnShape.activity.task;
        for (let i: number = 0; i < elementWrapper.children.length; i++) {
            if (elementWrapper.children[i].id === node.id + '_1_taskTypeService') {
                elementWrapper.children.splice(i, 1);
                const element: HTMLElement = document.getElementById(node.id + '_1_taskTypeService');
                element.parentNode.removeChild(element);
            }
        }
        if (task.type === 'Receive' || task.type === 'Send') {
            elementWrapper.children[1].height = 14;
        } else {
            elementWrapper.children[1].height = 20;
        }
        if (task.type !== undefined) {
            const bpmnshapeTaskdata: string = getBpmnTaskShapePathData(task.type);
            (elementWrapper.children[1] as PathModel).data = bpmnshapeTaskdata;
                for (let i: number = 0; i < elementWrapper.children.length; i++) {
                    if (elementWrapper.children[i].id === node.id + '_1_tasktType') {
                        elementWrapper.children.splice(i, 1);
                        const element: HTMLElement = document.getElementById(node.id + '_1_tasktType');
                        element.parentNode.removeChild(element);
                    }
                }
                const taskTypeNode: PathElement = new PathElement();
                taskTypeNode.id = node.id + '_1_tasktType';
                taskTypeNode.margin.left = 5; taskTypeNode.margin.top = 5;
                taskTypeNode.data = bpmnshapeTaskdata;
                taskTypeNode.style.fill = 'transparent';
                taskTypeNode.style.opacity = node.style.opacity;
                /**
                 * Used to update the Bpmn activity task type at runtime
                 * EJ2-60586 
                */
                if(task.type === 'Receive' || task.type === 'Send')
                  {
                      taskTypeNode.width = 18;
                      taskTypeNode.height = 16;
                      elementWrapper.children.splice(1, 0, taskTypeNode);
                  }
                else if(task.type !== 'Service')
                  {
                      taskTypeNode.width = 20; taskTypeNode.height = 20;
                      elementWrapper.children.splice(1, 0, taskTypeNode);
                  }
                else{
                taskTypeNode.width = 20; taskTypeNode.height = 20;
                elementWrapper.children.splice(1, 0, taskTypeNode);
                const taskTypeNodeService: PathElement = new PathElement();
                taskTypeNodeService.id = node.id + '_1_taskTypeService';
                taskTypeNodeService.data = bpmnshapeTaskdata;
                taskTypeNodeService.margin.left = elementWrapper.children[1].margin.left + 9;
                taskTypeNodeService.margin.top = elementWrapper.children[1].margin.top + 9;
                taskTypeNodeService.style.fill = 'white';
                taskTypeNodeService.style.opacity = node.style.opacity;
                elementWrapper.children.splice(2, 0, taskTypeNodeService);
                  }
            }
        if (bpmnShape.activity.task.call !== undefined) {
            if (bpmnShape.activity.task.call !== false) { elementWrapper.children[0].style.strokeWidth = 4; } else {
                elementWrapper.children[0].style.strokeWidth = 1;
            }
        }
        if (bpmnShape.activity.task.compensation !== undefined) {
            if (bpmnShape.activity.task.compensation === true) { elementWrapper.children[3].visible = true; } else {
                elementWrapper.children[3].visible = false;
            }
        }
    }
    /** @private */
    public updateBPMNActivityTaskLoop(
        node: Node, newObject: Node, x: number, subChildCount: number,
        area: number, start: number): void {
        const bpmnShape: BpmnShapeModel = newObject.shape as BpmnShapeModel;
        const elementWrapper: Canvas = ((node.wrapper.children[0] as Canvas).children[0] as Canvas);
        const activity: BpmnActivityModel = bpmnShape.activity;
        let loop: string;
        let index: number = 0;
        let bpmnshapeLoopdata: string;
        if (activity.subProcess !== undefined) {
            const subProcess: BpmnSubProcessModel = activity.subProcess;
            index = (activity.subProcess.type === 'Transaction') ? 2 : 0;
            loop = subProcess.loop;
            bpmnshapeLoopdata = getBpmnLoopShapePathData(loop);
            (elementWrapper.children[2 + index] as PathModel).data = bpmnshapeLoopdata;
            elementWrapper.children[2 + index].visible = (loop === 'None') ? false : true;
        } else if (activity.task !== undefined && activity.task.loop !== undefined) {
            bpmnshapeLoopdata = getBpmnLoopShapePathData(activity.task.loop);
            (elementWrapper.children[2] as PathModel).data = bpmnshapeLoopdata;
            elementWrapper.children[2].visible = (activity.task.loop === 'None') ? false : true;
        }
        this.updateChildMargin(elementWrapper, subChildCount, area, x, start + index);
    }
    /** @private */
    private updateChildMargin(elementWrapper: Container, subChildCount: number, area: number, x: number, start: number): void {
        if (subChildCount === 1) {
            for (let i: number = start; i < elementWrapper.children.length; i++) {
                if (i !== 2 && elementWrapper.children[i].visible === true) {
                    elementWrapper.children[i].margin.left = x;
                    x = area + 8;
                }
            }
        } else {
            x = area + (subChildCount - 1) * 8;
            for (let i: number = start; i < elementWrapper.children.length; i++) {
                if (i !== 2 && elementWrapper.children[i].visible === true) {
                    elementWrapper.children[i].margin.left = x; x += 12 + 8;
                }
            }
        }
    }
    /** @private */
    public updateBPMNActivitySubProcess(node: Node, newObject: Node, oldObject: Node, diagram: Diagram): void {
        const bpmnShape: BpmnShapeModel = newObject.shape as BpmnShapeModel;
        const elementWrapper: Container = node.wrapper.children[0] as Canvas;
        const size: Size = this.getSize(node, (elementWrapper.children[0] as Container).children[0] as PathElement);
        const subProcess: BpmnSubProcessModel = bpmnShape.activity.subProcess;
        const subChildCount: number = this.getSubprocessChildCount(node); let x: number;
        const childSpace: number = subChildCount * 12;
        const area: number = size.width / 2 - childSpace;
        if (subChildCount === 1) { x = area + 8; } else {
            x = area + (subChildCount - 1) * 8;
        }
        updateStyle(node.style, ((elementWrapper as Canvas).children[0] as Canvas).children[0]);
        if (subProcess.events !== undefined) {
            this.updateBPMNSubProcessEvent(node, newObject, oldObject, diagram);
        }
        if (subProcess.adhoc !== undefined) {
            this.updateBPMNSubProcessAdhoc(node, oldObject, subProcess, x, subChildCount, area);
        }
        if (subProcess.boundary !== undefined) {
            this.updateBPMNSubProcessBoundary(node, subProcess);
        }
        if (subProcess.collapsed !== undefined) {
            this.updateBPMNSubProcessCollapsed(node, oldObject, subProcess, x, subChildCount, area, diagram);
        }
        if (subProcess.compensation !== undefined) {
            this.updateBPMNSubProcessCompensation(node, oldObject, subProcess, x, subChildCount, area);
        }
        if (subProcess.loop !== undefined) {
            this.updateBPMNSubProcessLoop(node, oldObject, subProcess, x, subChildCount, area);
        }
        if (subProcess.transaction !== undefined) {
            this.updateBPMNSubProcessTransaction(node, newObject, oldObject, diagram);
        }
    }
    /** @private */
    public updateBPMNSubProcessEvent(node: Node, newObject: Node, oldObject: Node, diagram: Diagram): void {
        const bpmnShape: BpmnShapeModel = newObject.shape as BpmnShapeModel;
        const elementWrapper: DiagramElement = node.wrapper.children[0];
        const nodeContent: Canvas = (elementWrapper as Canvas).children[0] as Canvas; let index: number; const j: number = 0;
        const elementWrapperChildLen: number = ((elementWrapper as Canvas).children[0] as Canvas).children.length;
        const subProcess: BpmnSubProcessModel = bpmnShape.activity.subProcess;
        let events: BpmnSubEventModel;
        const start: number = 2;
        for (const key of Object.keys(subProcess.events)) {
            const eventIndex: number = Number(key);
            const eventWrapper: Canvas = nodeContent.children[eventIndex + start] as Canvas;
            const actualEvent: BpmnSubEventModel = (node.shape as BpmnShape).activity.subProcess.events[eventIndex];
            this.updateBPMNSubEvent(
                node, subProcess.events[eventIndex], actualEvent, eventWrapper, newObject, oldObject, diagram);
        }
    }

    private updateBPMNSubEvent(
        node: NodeModel, newEvent: BpmnSubEventModel, actualEvent: BpmnSubEventModel,
        eventWrapper: Canvas, newObject: NodeModel, oldObject: NodeModel,
        diagram: Diagram): void {
        const elementWrapper: Container = node.wrapper.children[0] as Canvas;
        const bpmnShape: BpmnShape = newObject.shape as BpmnShape;
        const child0: DiagramElement = eventWrapper.children[0];
        const child1: DiagramElement = eventWrapper.children[1];
        const child2: DiagramElement = eventWrapper.children[2];

        let eventType: string; let trigger: string;
        if (newObject.style) {
            if (newObject.style.strokeColor !== undefined || newObject.style.opacity !== undefined) {
                ((elementWrapper as Canvas).children[0] as Canvas).children[1].style.strokeColor = newObject.style.strokeColor;
                ((elementWrapper as Canvas).children[0] as Canvas).children[1].style.opacity = newObject.style.opacity;
            }
        }
        if (bpmnShape.activity.subProcess !== undefined) {
            eventType = newEvent.event; trigger = newEvent.trigger;
        }
        if (eventType !== undefined) {
            this.getEvent(newObject as Node, oldObject as Node, eventType, child0, child1, child2);
        }
        if (trigger !== undefined) {
            if (newObject.style) {
                updateStyle(newObject.style, (elementWrapper as Canvas).children[0]);
            }
            const bpmnshapeTriggerdata: string = getBpmnTriggerShapePathData(trigger);
            (eventWrapper.children[2] as PathModel).data = bpmnshapeTriggerdata;
        }
        if (newEvent.height !== undefined || newEvent.width !== undefined) {
            this.getEventSize(newEvent, eventWrapper);
        }
        if (newEvent.id !== undefined) {
            eventWrapper.id = newEvent.id;
        }
        if (newEvent.margin !== undefined) {
            eventWrapper.margin = newEvent.margin;
        }
        if (newEvent.horizontalAlignment !== undefined) {
            eventWrapper.horizontalAlignment = newEvent.horizontalAlignment;
        }
        if (newEvent.verticalAlignment !== undefined) {
            eventWrapper.verticalAlignment = newEvent.verticalAlignment;
        }
        if (newEvent.offset !== undefined) {
            eventWrapper.setOffsetWithRespectToBounds(actualEvent.offset.x, actualEvent.offset.y, 'Fraction');
            eventWrapper.relativeMode = 'Point';
        }
        if (newEvent.annotations !== undefined) {
            let annotations: ShapeAnnotationModel;
            const annotation: Container = ((elementWrapper as Canvas).children[0] as Canvas).children[2] as Container;
            if (eventWrapper.children[3] && eventWrapper.children.length > 3) {
                annotations = eventWrapper.children[3];
                diagram.updateAnnotation(newEvent.annotations[0], annotations, annotation);
            }
        }
        if (newEvent.ports !== undefined) {
            let ports: PointPortModel;
            const port: Container = ((elementWrapper as Canvas).children[0] as Canvas).children[2] as Container;
            if (eventWrapper.children[4] && eventWrapper.children.length > 4) {
                ports = eventWrapper.children[4];
                diagram.updatePort(newEvent.ports[0], ports, port);
            }
        }

        if (newEvent.visible !== undefined) {
            this.updateDiagramContainerVisibility(eventWrapper, newEvent.visible);
        }
    }

    private updateBPMNSubProcessTransaction(node: NodeModel, newObject: NodeModel, oldObject: NodeModel, diagram: Diagram): void {
        const transaction: BpmnTransactionSubProcessModel = (newObject.shape as BpmnShape).activity.subProcess.transaction;
        const eventContainer: Canvas =
            (((node.wrapper as Canvas).children[0] as Canvas).children[0] as Canvas).children[2] as Canvas;

        let actualEvent: BpmnSubEventModel;
        if (transaction.success !== undefined) {
            actualEvent = (node.shape as BpmnShape).activity.subProcess.transaction.success;
            this.updateBPMNSubEvent(
                node, transaction.success, actualEvent, eventContainer.children[0] as Canvas, newObject, oldObject, diagram);
        }

        if (transaction.cancel !== undefined) {
            actualEvent = (node.shape as BpmnShape).activity.subProcess.transaction.cancel;
            this.updateBPMNSubEvent(
                node, transaction.cancel, actualEvent, eventContainer.children[1] as Canvas, newObject, oldObject, diagram);
        }

        if (transaction.failure !== undefined) {
            actualEvent = (node.shape as BpmnShape).activity.subProcess.transaction.failure;
            this.updateBPMNSubEvent(
                node, transaction.failure, actualEvent, eventContainer.children[2] as Canvas, newObject, oldObject, diagram);
        }

        for (const edge of (node as Node).outEdges) {
            const connector: Connector = diagram.nameTable[edge];
            switch (connector.sourcePortID) {
            case 'success':
                if (transaction.success && transaction.success.visible !== undefined) {
                    diagram.connectorPropertyChange(
                        connector, {} as Connector, { sourcePortID: 'success' } as Connector);
                }
                break;
            case 'cancel':
                if (transaction.cancel && transaction.cancel.visible !== undefined) {
                    diagram.connectorPropertyChange(
                        connector, {} as Connector, { sourcePortID: 'cancel' } as Connector);
                }
                break;
            case 'failure':
                if (transaction.failure && transaction.failure.visible !== undefined) {
                    diagram.connectorPropertyChange(
                        connector, {} as Connector, { sourcePortID: 'failure' } as Connector);
                }
                break;
            }
        }

    }

    /** @private */
    public getEventSize(events: BpmnSubEventModel, wrapperChild: Canvas): void {
        if (events.height !== undefined) {
            wrapperChild.height = events.height;
            (wrapperChild.children[0] as PathElement).height = events.height;
            (wrapperChild.children[1] as PathElement).height = events.height * 0.85;
            (wrapperChild.children[2] as PathElement).height = events.height * 0.54;
        }
        if (events.width !== undefined) {
            wrapperChild.width = events.width;
            (wrapperChild.children[0] as PathElement).width = events.width;
            (wrapperChild.children[1] as PathElement).width = events.width * 0.85;
            (wrapperChild.children[2] as PathElement).width = events.width * 0.54;
        }
    }
    /** @private */
    public updateBPMNSubProcessAdhoc(
        node: Node, oldObject: Node, subProcess: BpmnSubProcessModel,
        x: number, subChildCount: number, area: number): void {
        const shape: BpmnShapeModel = node.shape as BpmnShapeModel;
        const elementWrapper: Canvas = (node.wrapper.children[0] as Canvas).children[0] as Canvas;
        const index: number = ((node.shape as BpmnShape).activity.subProcess.type === 'Transaction') ? 2 : 0;

        if (subProcess.adhoc === false) {
            elementWrapper.children[3 + index].visible = false;
        } else {
            elementWrapper.children[3 + index].visible = true;
        }
        this.updateChildMargin(elementWrapper, subChildCount, area, x, 3 + index);
    }
    /** @private */
    public updateBPMNSubProcessBoundary(node: Node, subProcess: BpmnSubProcessModel): void {
        const shape: BpmnShapeModel = node.shape as BpmnShapeModel;
        const elementWrapper: DiagramElement = (((node.wrapper.children[0] as Canvas).children[0] as Canvas).children[0]);
        if (subProcess.boundary === 'Default') {
            elementWrapper.style.strokeWidth = 1;
            elementWrapper.style.strokeDashArray = '1 0';
        }
        if (subProcess.boundary === 'Call') {
            elementWrapper.style.strokeWidth = 4;
            elementWrapper.style.strokeDashArray = '1 0';
        }
        if (subProcess.boundary === 'Event') {
            elementWrapper.style.strokeWidth = 1;
            elementWrapper.style.strokeDashArray = '2 2';
        }
    }
    /** @private */
    public updateElementVisibility(node: Node, visible: boolean, diagram: Diagram): void {
        if ((node.shape as BpmnShape).activity.subProcess.processes
            && (node.shape as BpmnShape).activity.subProcess.processes.length > 0) {
            const processes: string[] = (node.shape as BpmnShape).activity.subProcess.processes;
            for (let j: number = processes.length - 1; j >= 0; j--) {
                const currentNode: Node = diagram.nameTable[processes[j]];
                currentNode.visible = visible;
                diagram.updateElementVisibility(currentNode.wrapper, currentNode, visible);
                if (visible) {
                    if ((!isBlazor() && (currentNode.shape as BpmnShape).shape === 'Event') ||
                        (isBlazor() && (currentNode.shape as DiagramShape).bpmnShape === 'Event')) {
                        this.setEventVisibility(currentNode, (currentNode.wrapper.children[0] as Container).children);
                    }
                    if (((currentNode.shape as BpmnShape).activity as BpmnShapeModel).activity === 'SubProcess') {
                        this.setSubProcessVisibility(currentNode);
                    }
                }
                const connectors: string[] = currentNode.inEdges.concat(currentNode.outEdges);
                for (let i: number = connectors.length - 1; i >= 0; i--) {
                    const connector: Connector = diagram.nameTable[connectors[i]];
                    connector.visible = visible;
                    diagram.updateElementVisibility(connector.wrapper, connector, visible);
                }
            }
        }
        if (visible) {
            if ((!isBlazor() && (node.shape as BpmnShape).shape === 'Event') ||
                (isBlazor() && (node.shape as DiagramShape).bpmnShape === 'Event')) {
                this.setEventVisibility(node, (node.wrapper.children[0] as Container).children);
            }
            if (((node.shape as BpmnShape).activity as BpmnShapeModel).activity === 'SubProcess') {
                this.setSubProcessVisibility(node);
            }
            if (((node.shape as BpmnShape).activity as BpmnShapeModel).activity === 'Task' &&
                ((!isBlazor() && (node.shape as BpmnShape).shape === 'Activity') ||
                    (isBlazor() && (node.shape as DiagramShape).bpmnShape === 'Activity'))
                && (node.shape as BpmnShape).activity.subProcess.loop === 'None') {
                ((node.wrapper.children[0] as Container).children[0] as Container).children[3].visible = false;
            }
        }
    }
    /** @private */
    public updateBPMNSubProcessCollapsed(
        node: Node, oldObject: Node, subProcess: BpmnSubProcessModel,
        x: number, subChildCount: number, area: number, diagram: Diagram): void {
        const eventLength: number = (node.shape as BpmnShape).activity.subProcess.events.length;
        const elementWrapper: Canvas = (node.wrapper.children[0] as Canvas).children[0] as Canvas;
        const index: number = ((node.shape as BpmnShape).activity.subProcess.type === 'Transaction') ? 3 : 1;
        if (subProcess.collapsed === false) {
            this.updateElementVisibility(node, true, diagram);
            elementWrapper.children[index + eventLength].visible = false;
        } else {
            this.updateElementVisibility(node, false, diagram);

            elementWrapper.children[index + eventLength].visible = true;
        }
        this.updateChildMargin(elementWrapper, subChildCount, area, x, 3 + eventLength);
    }
    /** @private */
    public updateBPMNSubProcessCompensation(
        node: Node, oldObject: Node, subProcess: BpmnSubProcessModel,
        x: number, subChildCount: number, area: number): void {
        const elementWrapper: Canvas = (node.wrapper.children[0] as Canvas).children[0] as Canvas;
        const index: number = ((node.shape as BpmnShape).activity.subProcess.type === 'Transaction') ? 2 : 0;
        if (subProcess.compensation === false) {
            elementWrapper.children[4 + index].visible = false;
        } else {
            elementWrapper.children[4 + index].visible = true;
        }
        this.updateChildMargin(elementWrapper, subChildCount, area, x, 4 + index);
    }
    /** @private */
    public updateBPMNSubProcessLoop(
        node: Node, oldObject: Node, subProcess: BpmnSubProcessModel,
        x: number, subChildCount: number, area: number): void {
        this.updateBPMNActivityTaskLoop(node, node, x, subChildCount, area, 1);
    }

    /** @private */
    public updateBPMNConnector(actualObject: Connector, oldObject: Connector, connection: Connector, diagram: Diagram): Connector {
        const flowType: BpmnFlowModel = connection.shape as BpmnFlowModel;
        if (flowType.sequence !== undefined) {
            actualObject = this.getSequence(actualObject, oldObject, connection, diagram);
        }
        if (flowType.association !== undefined) {
            actualObject = this.getAssociation(actualObject, oldObject, connection, diagram);
        }
        if (flowType.message !== undefined) {
            actualObject = this.getMessage(actualObject, oldObject, connection, diagram);
        }
        return actualObject;
    }
    /** @private */
    public getSequence(actualObject: Connector, oldObject: Connector, connection: Connector, diagram: Diagram): Connector {
        if (((connection.shape as BpmnFlowModel).sequence) === 'Normal') {
            diagram.connectorPropertyChange(actualObject, oldObject, ({
                type: 'Straight',
                targetDecorator: { shape: 'Arrow', style: { fill: 'black' } }
            } as Connector));
            actualObject.wrapper.children[3].visible = false;
        }
        if (((connection.shape as BpmnFlowModel).sequence) === 'Default') {
            diagram.connectorPropertyChange(actualObject, oldObject, ({
                type: 'Straight',
                targetDecorator: { shape: 'Arrow', style: { fill: 'black' } },
                sourceDecorator: { shape: 'None' }
            } as Connector));
            let segment: PathElement = new PathElement(); const pathseq: PathElement = new PathElement(); let pathseqData: Object;
            segment = actualObject.getSegmentElement(actualObject, segment);
            const anglePoints: PointModel[] = actualObject.intermediatePoints as PointModel[];
            for (let j: number = 0; j < anglePoints.length - 1; j++) {
                // eslint-disable-next-line no-global-assign
                length = length + actualObject.distance(anglePoints[j], anglePoints[j + 1]);
                pathseqData = actualObject.findPath(anglePoints[j], anglePoints[j + 1]);
            }
            (actualObject.wrapper.children[3] as PathModel).data = pathseqData[0];
            actualObject.wrapper.children[3].id = actualObject.id + '_' + ((connection.shape as BpmnFlowModel).sequence);
            actualObject.wrapper.children[3].offsetX = pathseqData[1].x;
            actualObject.wrapper.children[3].offsetY = pathseqData[1].y;
            actualObject.wrapper.children[3].rotateAngle = 45;
            actualObject.wrapper.children[3].transform = Transform.Self;
        }
        if (((connection.shape as BpmnFlowModel).sequence) === 'Conditional') {
            diagram.connectorPropertyChange(actualObject, oldObject, ({
                type: 'Straight',
                targetDecorator: { shape: 'Arrow', style: { fill: 'black' } },
                sourceDecorator: { shape: 'Diamond', width: 20, height: 10, style: { fill: 'white' } }
            } as Connector));
            actualObject.wrapper.children[3].visible = false;
        }
        return actualObject;
    }
    /** @private */
    public getAssociation(actualObject: Connector, oldObject: Connector, connection: Connector, diagram: Diagram): Connector {
        if (((connection.shape as BpmnFlowModel).association) === 'Default') {
            diagram.connectorPropertyChange(actualObject, oldObject, ({
                type: 'Straight', style: { strokeDashArray: 'None' },
                targetDecorator: { shape: 'Arrow', style: { fill: 'black' } },
                sourceDecorator: { shape: 'None' }
            } as Connector));
        }
        if (((connection.shape as BpmnFlowModel).association) === 'Directional') {
            diagram.connectorPropertyChange(actualObject, oldObject, ({
                type: 'Straight', style: { strokeDashArray: '2 2' },
                targetDecorator: { shape: 'Arrow', style: { fill: 'black' } },
                sourceDecorator: { shape: 'None' }
            } as Connector));
        }
        if (((connection.shape as BpmnFlowModel).association) === 'BiDirectional') {
            diagram.connectorPropertyChange(actualObject, oldObject, ({
                type: 'Straight', style: { strokeDashArray: '2 2' },
                targetDecorator: { shape: 'Arrow', style: { fill: 'black' } },
                sourceDecorator: { shape: 'Arrow', width: 5, height: 10, style: { fill: 'white' } }
            } as Connector));
        }
        return actualObject;
    }
    /** @private */
    public getMessage(actualObject: Connector, oldObject: Connector, connection: Connector, diagram: Diagram): Connector {
        const segmentOffset: number = 0.5; let angle: number; let pt: PointModel;
        if (((oldObject.shape as BpmnFlowModel).message) === 'Default') {
            if (((connection.shape as BpmnFlowModel).message) !== undefined) {
                if ((((connection.shape as BpmnFlowModel).message) === 'InitiatingMessage') ||
                    (((connection.shape as BpmnFlowModel).message) === 'NonInitiatingMessage')) {
                    let segment: PathElement = new PathElement();
                    segment = actualObject.getSegmentElement(actualObject, segment);
                    const anglePoints: PointModel[] = actualObject.intermediatePoints as PointModel[];
                    for (let j: number = 0; j < anglePoints.length - 1; j++) {
                        /* eslint-disable */
                        length = length + actualObject.distance(anglePoints[j], anglePoints[j + 1]);
                        /* eslint-enable */
                        const offLength: number = length * segmentOffset;
                        if (length >= offLength) {
                            angle = findAngle(anglePoints[j], anglePoints[j + 1]);
                            pt = Point.transform(anglePoints[j], angle, offLength);
                        }
                    }
                }
                actualObject.wrapper.children[3].id = actualObject.id + '_' + ((connection.shape as BpmnFlowModel).message);
                actualObject.wrapper.children[3].width = 25;
                actualObject.wrapper.children[3].height = 15;
                (actualObject.wrapper.children[3] as PathModel).data = 'M0,0 L19.8,12.8 L40,0 L0, 0 L0, 25.5 L40, 25.5 L 40, 0';
                actualObject.wrapper.children[3].horizontalAlignment = 'Center';
                actualObject.wrapper.children[3].verticalAlignment = 'Center';
                actualObject.wrapper.children[3].transform = Transform.Self;
                actualObject.wrapper.children[3].style.fill = ((connection.shape as BpmnFlowModel).message) === 'NonInitiatingMessage' ?
                    'lightgrey' : 'white';
                actualObject.wrapper.children[3].offsetX = pt.x;
                actualObject.wrapper.children[3].offsetY = pt.y;
            }
        } else if (((oldObject.shape as BpmnFlowModel).message) !== 'NonInitiatingMessage' ||
            ((oldObject.shape as BpmnFlowModel).message) !== 'InitiatingMessage') {
            if (((connection.shape as BpmnFlowModel).message) !== 'Default') {
                actualObject.wrapper.children[3].style.fill = ((connection.shape as BpmnFlowModel).message) === 'NonInitiatingMessage' ?
                    'lightgrey' : 'white';
            } else {
                actualObject.wrapper.children[3].visible = false;
            }
        }
        return actualObject;
    }

    //End update Region

    //size updation

    private setSizeForBPMNEvents(event: BpmnEventModel, wrapper: Canvas, width: number, height: number): void {

        wrapper.children[0].width = width;
        wrapper.children[0].height = height;

        //child node 1 - event node
        const eventNode: DiagramElement = wrapper.children[1];
        eventNode.width = width * 0.85;
        eventNode.height = height * 0.85;
        const triggerNode: DiagramElement = wrapper.children[2];
        if (event.trigger === 'Message') {
            triggerNode.width = width * 0.54;
            triggerNode.height = height * 0.4;
        } else {
            triggerNode.width = width * 0.5;
            triggerNode.height = height * 0.5;
        }
    }
    /** @private */

    public updateAnnotationDrag(node: NodeModel, diagram: Diagram, tx: number, ty: number): boolean {
        const checkAnnotation: string[] = node.id.split('_');
        if (checkAnnotation[1] === 'textannotation') {
            let parentNode: NodeModel;
            for (let j: number = 0; j < (node as Node).inEdges.length; j++) {
                const connector: Connector = diagram.nameTable[(node as Node).inEdges[j]];
                if (connector) {
                    parentNode = diagram.nameTable[connector.sourceID];
                }
                const start: PointModel = { x: node.offsetX + tx, y: node.offsetY + ty };
                const end: PointModel = connector.sourcePoint;
                const length: number = Point.findLength(start, end);
                const angle: number = Point.findAngle(end, start);
                if ((parentNode.shape as BpmnShape).annotations) {
                    for (let x: number = 0; x < ((parentNode.shape as BpmnShape).annotations).length; x++) {
                        if (((parentNode.shape as BpmnShape).annotations)[x].id === checkAnnotation[checkAnnotation.length - 1]) {
                            ((parentNode.shape as BpmnShape).annotations[x]).length = length;
                            ((parentNode.shape as BpmnShape).annotations[x]).angle = angle;
                            this.setAnnotationPath(
                                parentNode.wrapper.bounds, node.wrapper, start, node);
                            return false;
                        }
                    }
                }
            }
        }
        if ((node as Node).processId) {
            this.drag(node as Node, tx, ty, diagram);
            return true;
        }
        return false;
    }

    private getAnnotationPathAngle(point: PointModel, bounds: Rect): number {
        const direction: string = getPortDirection(point, bounds, bounds, false);
        let rotateAngle: number = 0;
        switch (direction) {
        case 'Right':
            rotateAngle = 0;
            break;
        case 'Left':
            rotateAngle = 180;
            break;
        case 'Bottom':
            rotateAngle = 90;
            break;
        case 'Top':
            rotateAngle = 270;
            break;
        }
        return rotateAngle;
    }

    private setSizeForBPMNGateway(
        event: BpmnGatewayModel, wrapper: Canvas, width: number, height: number): void {

        wrapper.children[0].width = width;
        wrapper.children[0].height = height;

        wrapper.children[1].width = width * 0.45;
        wrapper.children[1].height = height * 0.45;
    }

    private setSizeForBPMNDataObjects(
        event: BpmnDataObjectModel, wrapper: Canvas, width: number, height: number): void {

        wrapper.children[0].width = width;
        wrapper.children[0].height = height;
    }


    private setSizeForBPMNActivity(
        activity: BpmnActivityModel, wrapper: Canvas, width: number, height: number, node: Node): void {
        //child node 1 - event node

        wrapper.children[0].width = width;
        wrapper.children[0].height = height;

        (wrapper.children[0] as Canvas).children[0].width = width;
        (wrapper.children[0] as Canvas).children[0].height = height;

        if (activity.subProcess.type === 'Transaction') {
            (wrapper.children[0] as Canvas).children[1].width = Math.max(width - 6, 1);
            (wrapper.children[0] as Canvas).children[1].height = Math.max(height - 6, 1);
            (wrapper.children[0] as Canvas).children[2].width = width;
            (wrapper.children[0] as Canvas).children[2].height = height;
        }
        const taskNode: DiagramElement = new DiagramElement();
        let x: number;
        const size: Size = this.getSize(node, taskNode);
        let childCount: number;
        const iconSpace: number = 4;
        if (activity.activity === 'Task') {
            childCount = this.getTaskChildCount(node);
        } else {
            childCount = this.getSubprocessChildCount(node);
        }
        const childSpace: number = childCount * 12;
        const area: number = (width || size.width) / 2;
        if (childCount === 1) { x = area - 6; } else {
            x = area - (childSpace / 2) - ((childCount - 1) * iconSpace) / 2;
        }
        for (let i: number = 0; i < (wrapper.children[0] as Canvas).children.length; i++) {
            if ((wrapper.children[0] as Canvas).children[i].visible &&
                ((wrapper.children[0] as Canvas).children[i].id.indexOf('_loop') > -1 ||
                    (wrapper.children[0] as Canvas).children[i].id.indexOf('_0_compensation') > -1 ||
                    (wrapper.children[0] as Canvas).children[i].id.indexOf('_0_adhoc') > -1 ||
                    (wrapper.children[0] as Canvas).children[i].id.indexOf('_0_collapsed') > -1)) {
                (wrapper.children[0] as Canvas).children[i].margin.left = x;
                x += (wrapper.children[0] as Canvas).children[i].actualSize.width + iconSpace;
            }
        }
    }

    private updateDiagramContainerVisibility(element: DiagramElement, visible: boolean): void {
        if (element instanceof Container) {
            for (let i: number = 0; i < element.children.length; i++) {
                this.updateDiagramContainerVisibility(element.children[i], visible);
            }
        }
        element.visible = visible;
    }
    //End size region

    /**
     * Constructor for the BpmnDiagrams module
     *
     * @private
     */

    constructor() {
        //constructs the BpmnDiagrams module
    }

    /**
     *To destroy the ruler
     *
     * @returns {void} To destroy the ruler
     */

    public destroy(): void {
        /**
         * Destroys the BpmnDiagrams module
         */
    }


    /**
     * Get module name.
     *
     * @returns {string}   Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'Bpmn';
    }
}
/**
 * getBpmnShapePathData method \
 *
 * @returns { string } getBpmnShapePathData method .\
 * @param {string} shape - provide the shape value.
 *
 * @private
 */
export function getBpmnShapePathData(shape: string): string {
    return bpmnShapes[shape.toString()];
}
/**
 * getBpmnTriggerShapePathData method \
 *
 * @returns { string } getBpmnTriggerShapePathData method .\
 * @param {string} shape - provide the shape value.
 *
 * @private
 */
export function getBpmnTriggerShapePathData(shape: string): string {
    return bpmnTriggerShapes[shape.toString()];
}
/**
 * getBpmnGatewayShapePathData method \
 *
 * @returns { string } getBpmnGatewayShapePathData method .\
 * @param {string} shape - provide the shape value.
 *
 * @private
 */
export function getBpmnGatewayShapePathData(shape: string): string {
    return bpmnGatewayShapes[shape.toString()];
}
/**
 * getBpmnTaskShapePathData method \
 *
 * @returns { string } getBpmnTaskShapePathData method .\
 * @param {string} shape - provide the shape value.
 *
 * @private
 */
export function getBpmnTaskShapePathData(shape: string): string {
    return bpmnTaskShapes[shape.toString()];
}

/**
 * getBpmnLoopShapePathData method \
 *
 * @returns { string } getBpmnLoopShapePathData method .\
 * @param {string} shape - provide the shape value.
 *
 * @private
 */
export function getBpmnLoopShapePathData(shape: string): string {
    return bpmnLoopShapes[shape.toString()];
}

const bpmnShapes: {} = {

    'Event': 'M80.5,12.5 C80.5,19.127417 62.59139,24.5 40.5,24.5 C18.40861,24.5 0.5,19.127417 0.5,12.5' +
        'C0.5,5.872583 18.40861,0.5 40.5,0.5 C62.59139,0.5 80.5,5.872583 80.5,12.5 z',

    'Message': 'M0,0L19.8,12.8L40,0L0,0L0,25.5L40,25.5L40,0z',

    'DataSource': 'M 0 10.6 c 0 5.9 16.8 10.6 37.5 10.6 S 75 16.4 75 10.6 v 0 v 68.9 v -0.1 C 75 85.3 58.2 90 37.5 90 ' +
        'S 0 85.3 0 79.4 l 0 0.1 V 56 V 40.6 L 0 10.6 C 0 4.7 16.8 0 37.5 0 S 75 4.7 75 10.6 S 58.2 21.2 37.5 21.2' +
        'S 0 16.5 0 10.6 l 0 6.7 v -0.2 c 0 5.9 16.8 10.6 37.5 10.6 S 75 22.9 75 17.1 v 6.8 v -0.1 ' +
        'c 0 5.9 -16.8 10.6 -37.5 10.6 S 0 29.6 0 23.8',

    'SubProcess': 'M100,100 h200 a20,20 0 0 1 20,20 v200 a20,20 0 0 1 -20,20 h-200 ' +
        'a20,20 0 0 1 -20,-20 v-200 a20,20 0 0 1 20,-20 z',

    'collapsedShape': 'M 8.13789 15 H 0 V 0 H 8.13789 V 15 Z M 0.625991 13.75 H 7.51189 V 1.25 H 0.625991 V 13.75 Z ' +
        'M 2.18095 7.03125 L 5.95631 7.03125 L 5.95631 7.46875 L 2.18095 7.46875 Z M 3.8342 3.73 ' +
        'L 4.30369 3.73 L 4.30369 11.2687 L 3.8342 11.2687 Z'
};

const bpmnTriggerShapes: {} = {

    // 'None': '',
    'Message': 'M0,0 L19.8,12.8 L40,0 L0, 0 L0, 25.5 L40, 25.5 L 40, 0',

    'Timer': 'M40,20c0,8.654-5.496,16.024-13.189,18.81' +
        'C24.685,39.58,22.392,40,20,40C8.954,40,0,31.046,0,20S8.954,0,20,0S40,8.954,40,20z M20,0 L20,2.583 L20,5.283 M10.027,2.681' +
        'L11.659,5.507 L12.669,7.257 M2.731,9.989 L6.014,11.885 L7.307,12.631 M0.067,19.967 L2.667,19.967 L5.35,19.967' +
        'M2.748,29.939 L5.731,28.217 L7.323,27.298 M10.056,37.236 L11.292,35.095 L12.698,32.66 M20.033,39.9 L20.033,36.417 L20.033,34.617' +
        'M30.006,37.219 L28.893,35.292 L27.364,32.643 M37.302,29.911 L34.608,28.355 L32.727,27.269' +
        'M39.967,19.933 L37.417,19.933 L34.683,19.933 M37.286,9.961 L34.583,11.521 L32.71,12.602 M29.977,2.664 L28.653,4.957 L27.336,' +
        '7.24 M22.104,8.5 L19.688,20 L24.75,20 L31.604,20 L24.75,20 L19.688,20z',

    'Error': 'M 23.77 18.527 l -7.107 27.396 l 8.507 -17.247 L 36.94 40.073 l 6.394 -25.997 l -8.497 15.754 L 23.77 18.527 Z',

    'Escalation': 'M 30.001 8.098 L 11.842 43.543 l 18.159 -18.882 l 18.162 18.882 L 30.001 8.098 Z ',

    'Cancel': 'M 3.5 16 L 0 12.6 L 4.6 8 L 0 3.5 L 3.4 0 L 8 4.6 l 4.5 -4.5 L 16 3.5 L 11.5 8 l 4.5 4.5 l -3.4 3.5 L 8 11.4 L 3.5 16 Z',

    'Compensation': 'M 25.7086 0 L 0 25 L 25.7086 50 V 26.3752 L 50 50 V 0 L 25.7086 23.6248 V 0 Z ',

    'Conditional': 'M 0 0 H 16 V 16 H 0 z M 1.14 3.2 H 14.85 M 1.14 6.4 H 14.85 M 1.14 9.6 H 14.85 M 1.14 12.8 H 14.85',

    'Link': 'M 32.014 19.258 v 5.992 H 9.373 v 9.504 h 22.641 v 5.988 L 50.622 30 L 32.014 19.258 Z',

    'Signal': 'M 50 50 H 0 L 25.0025 0 L 50 50 Z',

    'Terminate': 'M 25 50 C 11.21 50 0 38.79 0 25 C 0 11.21 11.21 0 25 0 C 38.78 0 50 11.21 50 25 C 50 38.79 38.78 50 25 50',

    'Multiple': 'M 17.784 48.889 H 42.21 l 7.548 -23.23 L 29.997 11.303 L 10.236 25.658 L 17.784 48.889 Z',

    'Parallel': 'M 27.276 49.986 h 5.58 v -17.15 h 17.146 V 27.17 h -17.15 l 0.004 -17.15 h -5.58 l -0.004 17.15 ' +
        'H 9.994 v 5.666 h 17.278 L 27.276 49.986 Z'
};

const bpmnGatewayShapes: {} = {
    'None': '',
    //exclusive
    'Exclusive': 'M 11.196 29.009 l 6.36 -9.712 l -5.764 -8.899 h 4.393 l 3.732 5.979 l 3.656 -5.979 h 4.354 l -5.789 9.039' +
        'l 6.36 9.572 h -4.532 l -4.126 -6.437 l -4.139 6.437 H 11.196 Z',

    //inclusive
    'Inclusive': 'M 20.323 31.333 c -6.625 0 -12.015 -5.39 -12.015 -12.015 s 5.39 -12.015 12.015 -12.015 ' +
        's 12.016 5.39 12.016 12.015 S 26.948 31.333 20.323 31.333 Z M 20.323 9.303 c -5.522 0 -10.015 4.493 -10.015 10.015 ' +
        's 4.492 10.015 10.015 10.015 s 10.016 -4.493 10.016 -10.015 S 25.846 9.303 20.323 9.303 Z',

    //parallel
    'Parallel': 'M 18.394 29.542 v -8.833 H 9.626 v -3.691 h 8.768 V 8.251 h 3.734 v 8.767 h 8.768 v 3.691 h -8.768 v 8.833 H 18.394 Z',

    //complex
    'Complex': 'M29.198,19.063L23.089,19.063L27.794,14.358L26.38,12.944L21.223,18.101L21.223,10.443L19.223,10.443L19.223,17.976' +
        'L14.022,12.776L12.608,14.19L17.48,19.063L10.365,19.063L10.365,21.063L18.261,21.063L12.392,26.932L13.806,28.346' +
        'L19.223,22.929L19.223,30.225L21.223,30.225L21.223,22.805L25.925,27.507L27.339,26.093L22.309,21.063L29.198,21.063z',

    //eventbased
    'EventBased': 'M 20.322 29.874 c -5.444 0 -9.873 -4.43 -9.873 -9.874 s 4.429 -9.874 9.873 -9.874 s 9.874 4.429 9.874 9.874 ' +
        'S 25.767 29.874 20.322 29.874 Z M 20.322 32.891 c -7.107 0 -12.89 -5.783 -12.89 -12.891 c 0 -7.107 5.782 -12.89 12.89 -12.89 ' +
        'c 7.108 0 12.891 5.783 12.891 12.89 C 33.213 27.108 27.431 32.891 20.322 32.891 Z M 24.191 25.386 ' +
        'h -7.984 l -2.469 -7.595 l 6.461 -4.693 l 6.461 4.693 L 24.191 25.386 Z',

    //exclusive event based
    'ExclusiveEventBased': 'M 30 15 C 30 23.28 23.28 30 15 30 S 0 23.28 0 15 S 6.72 0 15 0 S 30 6.72 30 15 z M 15 5 ' +
        'L 5 12.5 L 8 22.5 H 22 L 25 12.5 z',

    //parallel event based
    'ParallelEventBased': 'M 35 17.5 C 35 27.16 27.16 35 17.5 35 S 0 27.16 0 17.5 S 7.84 0 17.5 0 S 35 7.84 35 17.5 z M 14.58 5.83 ' +
        'V 14.58 H 5.83 V 20.42 H 14.58 V 29.17 H 20.42 V 20.42 H 29.17 V 14.58 H 20.42 V 5.83 z'
};

const bpmnTaskShapes: {} = {
    'None': '',
    'Service': 'M 32.699 20.187 v -4.005 h -3.32 c -0.125 -0.43 -0.292 -0.83 -0.488 -1.21 l 2.373 -2.375 ' +
        'l -2.833 -2.83 l -2.333 2.333 c -0.44 -0.253 -0.9 -0.448 -1.387 -0.595 v -3.32 h -4.003 v 3.32 c -0.46 0.137 -0.89' +
        '0.322 -1.3 0.537 l -2.285 -2.275 l -2.833 2.83 l 2.285 2.278 c -0.235 0.42 -0.41 0.847 -0.547 1.307 h -3.33 v 4.005 h 3.33 ' +
        'c 0.148 0.488 0.343 0.955 0.588 1.395 l -2.325 2.325 l 2.822 2.832 l 2.373 -2.382 c 0.392 0.205 0.792 0.37 1.212 0.497 v 3.33 ' +
        'h 4.003 v -3.33 c 0.46 -0.138 0.89 -0.323 1.3 -0.547 l 2.43 2.432 l 2.822 -2.832 l -2.42 -2.422 c 0.222 -0.41 0.4 -0.85 0.535' +
        '-1.297 H 32.699 Z M 22.699 21.987 c -2.1 0 -3.803 -1.703 -3.803 -3.803 c 0 -2.1 1.703 -3.803 3.803 -3.803 c 2.1 0 3.803 ' +
        '1.703 3.803 3.803 C 26.502 20.285 24.8 21.987 22.699 21.987 Z',

    'Receive': 'M 12.217 12.134 v 13.334 h 20 V 12.134 H 12.217 Z M 30.44 13.007 l -8.223 5.35 l -8.223 -5.35 H 30.44 Z M 13.09' +
        ' 24.594 V 13.459 l 9.127 5.94 l 9.127 -5.94 v 11.135 H 13.09 Z',

    'Send': 'M 45.7256 3.16055 L 25 23.4017 L 4.27442 3.16055 H 45.7256 Z M 47.8963 46.8413 H 2.10375 V 4.80813' +
        ' L 25 27.1709 L 47.8963 4.80813 V 46.8413 Z',

    'InstantiatingReceive': 'M 16.306 17.39 v 8.79 h 13.198 v -8.79 H 16.306 Z M 28.375 17.946 l -5.47 3.558 l -5.47 -3.558 ' +
        'H 28.375 Z M 28.948 25.625 H 16.861 v -7.389 l 6.043 3.931 l 6.043 -3.931 V 25.625 Z M 22.905 11.785' +
        'c -5.514 0 -9.999 4.486 -9.999 10 c 0 5.514 4.485 10 9.999 10 s 9.999 -4.486 9.999 -10 ' +
        'C 32.904 16.272 28.419 11.785 22.905 11.785 Z M 22.905 31.239 c -5.212 0 -9.453 -4.241 -9.453 -9.454' +
        'c 0 -5.212 4.241 -9.453 9.453 -9.453 s 9.452 4.241 9.452 9.453 C 32.357 26.998 28.117 31.239 22.905 31.239 Z',

    'Manual': 'M 13.183 15.325 h 2.911 c 0.105 0 0.207 -0.043 0.281 -0.117 c 0.078 -0.074 0.117 -0.176 0.117 -0.281' +
        'c 0 -0.753 0.718 -1.362 1.596 -1.362 h 2.579 c -0.117 0.227 -0.191 0.48 -0.195 0.757 c 0 0.433 0.168 0.851 0.46 1.144 ' +
        'c 0.008 0.004 0.015 0.011 0.019 0.015 c -0.289 0.285 -0.475 0.691 -0.479 1.148 c 0 0.433 0.168 0.846 0.46 1.139 ' +
        'c 0.011 0.012 0.023 0.02 0.035 0.032 c -0.301 0.281 -0.491 0.694 -0.495 1.155 c 0 0.432 0.168 0.847 0.46 1.143' +
        'c 0.265 0.266 0.612 0.414 0.975 0.414 h 0.839 c 0.027 0.004 0.051 0.012 0.074 0.012 h 8.443 ' +
        'c 0.352 0 0.636 0.344 0.636 0.761 c 0 0.414 -0.285 0.753 -0.636 0.753 h -6.687 c -0.019 0 -0.035 -0.008 -0.051 -0.008' +
        'h -2.27 c -0.121 -0.835 -0.667 -1.187 -1.795 -1.187 h -2.158 c -0.223 0 -0.402 0.18 -0.402 0.403' +
        'c 0 0.219 0.179 0.398 0.402 0.398 h 2.158 c 0.972 0 1.019 0.203 1.019 0.784 c 0 0.219 0.179 0.399 0.402 0.399 ' +
        'c 0.008 0 0.016 -0.004 0.027 -0.004 c 0.028 0.004 0.055 0.016 0.082 0.016 h 2.56 c 0.34 0.015 0.616 0.343 0.616 0.752' +
        'c 0 0.418 -0.285 0.757 -0.636 0.761 h -0.004 h -6.442 c -0.878 0 -1.595 -0.639 -1.595 -1.427 v -0.683 ' +
        'c 0 -0.109 -0.043 -0.211 -0.114 -0.285 c -0.078 -0.074 -0.179 -0.117 -0.285 -0.117 h -0.004 l -2.989 0.027 ' +
        'c -0.223 0 -0.398 0.184 -0.398 0.402 c 0 0.219 0.179 0.395 0.398 0.395 h 0.004 l 2.591 -0.02 v 0.282 ' +
        'c 0 1.229 1.073 2.223 2.391 2.223 h 3.895 c 0.004 0 0.007 0.004 0.011 0.004 h 2.536 c 0.792 0 1.436 -0.698 1.436 -1.561 ' +
        'c 0 -0.273 -0.07 -0.53 -0.188 -0.752 h 5.49 c 0.792 0 1.436 -0.695 1.436 -1.553 c 0 -0.858 -0.644 -1.557 -1.436 -1.557' +
        'h -3.566 c 0.121 -0.226 0.199 -0.487 0.199 -0.768 c 0 -0.468 -0.195 -0.882 -0.495 -1.167' +
        'c 0.301 -0.285 0.495 -0.698 0.495 -1.163 c 0 -0.456 -0.191 -0.866 -0.483 -1.152 c 0.293 -0.285 0.483 -0.694 0.483 -1.151' +
        'c 0 -0.858 -0.647 -1.557 -1.439 -1.557 h -8.373 c -1.167 0 -2.142 0.757 -2.352 1.76 l -2.548 -0.004 ' +
        'c -0.219 0 -0.399 0.18 -0.399 0.403 C 12.784 15.145 12.964 15.325 13.183 15.325 L 13.183 15.325 Z M 21.907 19.707 ' +
        'c -0.191 0 -0.328 -0.094 -0.41 -0.176 c -0.144 -0.145 -0.226 -0.355 -0.226 -0.577 c 0.003 -0.418 0.289 -0.753 0.643 -0.753 ' +
        'h 4.468 c 0.008 0 0.015 -0.004 0.027 -0.008 h 0.051 c 0.351 0 0.636 0.344 0.636 0.761 c 0 0.414 -0.286 0.753 -0.636 0.753 ' +
        'H 21.907 Z M 27.097 16.629 c 0 0.414 -0.286 0.753 -0.64 0.753 h -4.464 c -0.004 0 -0.004 0 -0.004 0 h -0.082' +
        'c -0.191 0 -0.328 -0.098 -0.414 -0.18 c -0.14 -0.145 -0.222 -0.352 -0.222 -0.573 c 0 -0.413 0.285 -0.749 0.631 -0.753' +
        'h 3.434 c 0 0 0 0 0.004 0 h 1.116 c 0.008 0 0.012 -0.004 0.02 -0.004 C 26.819 15.887 27.097 16.215 27.097 16.629' +
        'L 27.097 16.629 Z M 27.097 14.322 c 0 0.41 -0.278 0.737 -0.62 0.749 c -0.008 0 -0.012 0 -0.016 0 h -3.637 ' +
        'c -0.008 0 -0.015 0.004 -0.023 0.004 h -0.886 c -0.004 0 -0.008 0 -0.012 0 c -0.187 0 -0.324 -0.094 -0.406 -0.176' +
        'c -0.144 -0.144 -0.226 -0.355 -0.226 -0.577 c 0.003 -0.414 0.293 -0.753 0.643 -0.753 h 4.468 ' +
        'c 0.008 0 0.015 -0.004 0.027 -0.004 h 0.051 C 26.811 13.565 27.097 13.905 27.097 14.322 L 27.097 14.322 Z M 27.097 14.322',


    'BusinessRule': 'M 32.844 13.245 h -0.089 v 0 H 13.764 v -0.015 h -1.009 v 16.989 h 0.095 v 0.011 h 19.716 v -0.011 h 0.278 ' +
        'V 13.245 Z M 31.844 14.229 v 4.185 h -18.08 v -4.185 H 31.844 Z M 18.168 25.306 v 3.938 h -4.404 v -3.938 H 18.168 Z ' +
        'M 13.764 24.322 v -4.923 h 4.404 v 4.923 H 13.764 Z M 19.177 25.306 h 12.667 v 3.938 H 19.177 V 25.306 Z M 19.177 24.322' +
        'v -4.923 h 12.667 v 4.923 H 19.177 Z',

    'User': 'M 21.762 21.935 c 2.584 0 4.687 -2.561 4.687 -5.703 c 0 -3.147 -2.103 -5.703 -4.687 -5.703 c -1.279 0 -2.475 0.61' +
        '-3.363 1.721 c -0.855 1.071 -1.327 2.484 -1.324 3.983 C 17.075 19.374 19.178 21.935 21.762 21.935 L 21.762 21.935 Z' +
        'M 21.762 11.779 c 1.894 0 3.436 1.995 3.436 4.452 c 0 2.453 -1.541 4.452 -3.436 4.452 c -1.895 0 -3.44 -1.999 -3.44 -4.452' +
        'C 18.323 13.774 19.864 11.779 21.762 11.779 L 21.762 11.779 Z M 25.699 21.309 c -0.348 0 -0.626 0.277 -0.626 0.626 ' +
        'c 0 0.344 0.277 0.622 0.626 0.622 c 2.136 0 3.875 1.74 3.875 3.879 c 0 0.272 -0.227 0.498 -0.501 0.498 H 14.447 c -0.274 0 ' +
        '-0.497 -0.223 -0.497 -0.498 c 0 -2.139 1.736 -3.879 3.872 -3.879 c 0.344 0 0.625 -0.277 0.625 -0.622 c 0 -0.348 -0.28 -0.626' +
        '-0.625 -0.626 c -2.826 0 -5.124 2.297 -5.124 5.126 c 0 0.965 0.784 1.749 1.748 1.749 h 14.626 c 0.964 0 1.748 -0.784' +
        '1.748 -1.749 C 30.822 23.606 28.524 21.309 25.699 21.309 L 25.699 21.309 Z M 22.217 9.832 c 0.448 -0.263 0.924 -0.396 ' +
        '1.419 -0.396 c 1.895 0 3.436 1.995 3.436 4.452 c 0 0.439 -0.048 0.873 -0.143 1.284 c -0.08 0.336 0.128 0.672 0.464 0.751 ' +
        'c 0.048 0.012 0.098 0.019 0.143 0.019 c 0.284 0 0.541 -0.195 0.608 -0.483 c 0.119 -0.506 0.18 -1.034 0.18 -1.571' +
        'c 0 -3.147 -2.102 -5.703 -4.687 -5.703 c -0.711 0 -1.419 0.198 -2.054 0.573 c -0.296 0.174 -0.397 0.559 -0.219 0.855' +
        'C 21.536 9.911 21.921 10.009 22.217 9.832 L 22.217 9.832 Z M 27.697 18.81 c -0.345 0 -0.626 0.277 -0.626 0.622 ' +
        'c 0 0.348 0.281 0.626 0.626 0.626 c 2.137 0 3.75 1.782 3.75 3.918 c 0 0.07 -0.013 0.141 -0.043 0.205 c -0.14 0.314 0.003' +
        '0.684 0.318 0.823 c 0.082 0.037 0.167 0.055 0.253 0.055 c 0.241 0 0.466 -0.141 0.57 -0.373 c 0.101 -0.226 0.153 -0.464 0.153' +
        '-0.714 C 32.699 21.15 30.523 18.81 27.697 18.81 L 27.697 18.81 Z M 27.697 18.81',

    'Script': 'M 22.453 15.04 c 0 0 -1.194 -3.741 2.548 -3.774 c 0 0 2.497 0.126 1.766 4.321 c -0.008 0.043 -0.015 0.086 -0.024 0.13' +
        'c -0.806 4.323 -2.516 8.42 -3.193 10.581 h 3.904 c 0 0 0.983 4.581 -2.549 4.968 H 13.292 c 0 0 -3.097 -1.42 -1.517 -5.323 l ' +
        '3 -10.839 H 11.84 c 0 0 -1.129 -2.902 1.709 -3.806 l 11.425 -0.032 l -0.73 0.355 l -1.193 1.726 L 22.453 15.04 Z M 22.409 ' +
        '12.597 c 0 0 -0.242 0.483 -0.278 0.98 h -9.098 c 0 0 -0.06 -0.871 0.714 -1.041 L 22.409 12.597 Z M 26.341 27.734' +
        'c 0 0 -0.13 2.678 -2.226 1.871 c 0 0 -0.823 -0.565 -0.758 -1.855 L 26.341 27.734 Z M 22.905 15.008 c 0 0 0.653 -0.258 0.709' +
        '-1.501 c 0 0 0.145 -1.144 1.483 -0.693 c 0 0 0.808 0.355 0.259 2.404 c 0 0 -2.226 8.5 -3.032 10.339 c 0 0 -1.064 2.646 ' +
        '0.096 4.226 h -8.581 c 0 0 -1.806 -0.452 -0.741 -3.613 c 0 0 2.935 -9.549 3.193 -11.162 L 22.905 15.008 Z'
};

const bpmnLoopShapes: {} = {
    'None': '',
    'Standard': 'M 52.002 73.379 c -2.494 -2.536 -6.55 -2.534 -9.043 0 c -1.208 1.228 -1.874 2.861 -1.874 4.598 ' +
        'c 0 1.225 0.337 2.395 0.957 3.411 l -1.167 1.186 l 2.071 0.458 l 2.071 0.458 l -0.45 -2.106 l -0.45 -2.106 l -1.292 1.314' +
        'c -1.119 -2.065 -0.842 -4.709 0.877 -6.458 c 2.084 -2.119 5.475 -2.117 7.557 0 c 2.083 2.119 2.083 5.565 0 7.685' +
        'c -0.976 0.992 -2.272 1.557 -3.65 1.59 l 0.025 1.068 c 1.65 -0.041 3.2 -0.716 4.368 -1.903 ' +
        'c 1.208 -1.228 1.874 -2.861 1.874 -4.597 C 53.875 76.24 53.209 74.607 52.002 73.379 Z',

    'ParallelMultiInstance': 'M 51.5,69.5 L52.5,69.5 L52.5,84.5 L51.5 84.5 Z M 46.5,69.5 L47.5,69.5 L47.5,84.5 L46.5 84.5 Z' +
        ' M 41.5,69.5 L42.5,69.5 L42.5,84.5 L41.5 84.5 Z  ',

    'SequenceMultiInstance': 'M 40.375,71.5 L 55.375,71.5 L 55.375,72.5 L 40.375,72.5 Z M 40.375,76.5 L 55.375,76.5 ' +
        'L 55.375,77.5 L 40.375,77.5 Z M 40.375,76.5 L 55.375,76.5 L 55.375,77.5 L 40.375,77.5 Z M 40.375,81.5 L 55.375,81.5' +
        'L 55.375,82.5 L 40.375,82.5 Z'
};
