import { MouseEventArgs } from '../interaction/event-handlers';
import { TextElement } from '../core/elements/text-element';
import { Node } from '../objects/node';
import { Diagram } from '../diagram';
import { getIndex, cloneObject } from './base-util';
import { Connector } from '../objects/connector';
import { isBlazor } from '@syncfusion/ej2-base';


/**
 * Defines the behavior of commands
 */

/* eslint-disable */
 export class DeepDiffMapper {
    public valueCreated = 'created';
    public valueUpdated = "updated";
    public valueDeleted = "deleted";
    public valueUnchanged = "unchanged";
    /** @private */
    public newNodeObject: Object[] = [];
    /** @private */
    public newConnectorObject: Object[] = [];

    /**   @private  */
    public diagramObject: object = {};
    
    /** @private */
    public updateObjectCollection(layers: object[], diagram?: Diagram): void {
        for (let i: number = 0; i < layers.length; i++) {
            if (layers[i]['objects']) {
                layers[i]['objects'] = (diagram.layers[i].objects);
            } else {
                layers[i]['objects'] = [];
                layers[i]['objects'] = diagram.layers[i].objects;
            }
        }
    }
 
    /**   @private  */
    public getOldObject(id: String, isNode: boolean,diagram:Diagram): Node | Connector {
        let oldObject: Node[] | Connector[] = isNode ? diagram.oldNodeObjects : diagram.oldConnectorObjects;
        for (let i: number = 0; i < oldObject.length; i++) {
            if (oldObject[i].id === id) {
                return oldObject[i];
            }
        }
        return undefined;
    }
    /** @private */
    public changeSegments(diff: Object, newObject: Object): Object {
        for (let prop of Object.keys(diff)) {
            if (prop === 'segments') {
                let seg: object = this.removeNullValues(newObject[prop]);
                diff[prop] = seg;
            }
        }
        return diff;
    }

    private removeNullValues(segments: Object[]) {
        let newSegments: Object[] = []; let seg: object = {};
        for (var i = 0; i < segments.length; i++) {
            seg = this.removeNullObjectValues(segments[i]);
            newSegments.push(seg);
        }
        return newSegments;
    };
    /** @private */
    public removeNullObjectValues(segment: Object) {
        let newSegObject: Object = {};
        for (let prop of Object.keys(segment)) {
            if (segment[prop] !== undefined) {
                newSegObject[prop] = (segment[prop] instanceof Object) ? this.removeNullObjectValues(segment[prop]) : segment[prop];
            }
        }
        return newSegObject;
    };
    /** @private */
    public getDifferenceValues(selectedObject: Node | Connector, args: MouseEventArgs, labelDrag?: boolean,diagram?:Diagram): void {
        let diffValue: object;
        let diff: Object;
        let result: object;
        let isNode: boolean = selectedObject instanceof Node;
        let oldObject: Node | Connector;
        if (selectedObject) {
            oldObject = isNode ? this.getOldObject(selectedObject.id, true,diagram) : this.getOldObject(selectedObject.id, false,diagram);
            if (oldObject) {
                let newObject: Object = cloneObject(selectedObject);
                result = this.map(newObject, oldObject);
                diffValue = this.frameObject({}, result);
                diff = this.removeEmptyValues(diffValue);
                diff = this.changeSegments(diff, newObject);
                if ((diff as any).children) {
                    (diff as any).children = (cloneObject(selectedObject) as any).children
                }
                if((diff as any).ports && (diff as any).ports.length){
                    for(var i =0; i<(diff as any).ports.length;i++){
                        if((newObject as Node).ports[i].outEdges){
                            (diff as any).ports[i].outEdges = (newObject as Node).ports[i].outEdges
                        } 
                        if((newObject as Node).ports[i].inEdges){
                            (diff as any).ports[i].inEdges = (newObject as Node).ports[i].inEdges
                        }                  
                    }               
               }
                return this.getDiagramObjects(diff, selectedObject.id, isNode, args, labelDrag,diagram);
            }
        }
    }
    /** @private */
    public getLayerObject(oldDiagram: object, temp?: boolean, diagram?: Diagram): object | any {
        if (isBlazor()) {
            let diffLayers: object = {};
            diffLayers['layers'] = [];
            let newDiagram: object = {};
            newDiagram['layers'] = [];
            for (let i: number = 0; i < diagram.layers.length; i++) {
                newDiagram['layers'].push(cloneObject(diagram.layers[i]));
            }
            let result: object;
            for (let i: number = 0; i < newDiagram['layers'].length; i++) {
                if (!temp) {
                    result = this.map(cloneObject(newDiagram['layers'][i]), oldDiagram['layers'][i]);
                } else {
                    result = this.map(oldDiagram['layers'][i], cloneObject(newDiagram['layers'][i]));
                }
                let diffValue: Object = this.frameObject({}, result);
                let diff: Object = this.removeEmptyValues(diffValue);
                diffLayers['layers'][i] = diff;
            }
            this.updateObjectCollection(diffLayers['layers'], diagram);
            return diffLayers;
        }
    }
      
    /** @private */
    public getDiagramObjects(diffValue: any, object: string, isNode: boolean, args: MouseEventArgs, labelDrag?: boolean, diagram?: Diagram): any {
        let index: number = 0;
        index = getIndex(diagram, object);
        diffValue.sfIndex = index;
        if (isNode) {
            this.newNodeObject.push(diffValue);
        } else {
            this.newConnectorObject.push(diffValue);
        }
        if (args && (((args.sourceWrapper instanceof TextElement) && labelDrag) || args.portId)) {
            let tempObject: object;
            let objectValue: any;
            if (isNode) {
                objectValue = args.portId ? (this.newNodeObject[0] as Node).ports : (this.newNodeObject[0] as Node).annotations;
            } else {
                objectValue = (this.newConnectorObject[0] as Connector).annotations || [];
            }
            for (let i: number = 0; i < objectValue.length; i++) {
                if (Object.keys(objectValue[i]).length > 0) {
                    let selectedObject = diagram.nameTable[object];
                    tempObject = objectValue[i];
                    if (args.portId) {
                        (this.newNodeObject[0] as any).ports = [tempObject];
                    } else {
                        for (let j: number = 0; j < selectedObject.annotations.length; j++) {
                            if (args.sourceWrapper.id === selectedObject.id + "_" + selectedObject.annotations[j].id) {
                                (tempObject as any).sfIndex = j;
                            }
                        }
                        if (isNode) {
                            (this.newNodeObject[0] as Node).annotations = [tempObject];
                        } else {
                            (this.newConnectorObject[0] as Connector).annotations = [tempObject];
                        }

                    }
                }
            }
        }
        this.diagramObject = { nodes: this.newNodeObject, connectors: this.newConnectorObject };
         //return returnValue;
    }

     private removeArrayValues(obj: Object[]): object[] {
        let newObj: object[] = [];
        let value: string = JSON.stringify(obj);
        if (!(value === JSON.stringify({ 'data': [] }))) {
            for (let i: number = 0; i < obj.length; i++) {
                if (obj[i] instanceof Object) {
                    let newValue: object = this.removeEmptyValues(obj[i]);
                    newObj.push(newValue);
                } else {
                    newObj.push(obj[i]);
                }
            }
        }
        return newObj;
    }

    /** @private */
    public removeEmptyValues(frame: object): object {
        let newObj: Object = {};
        for (let prop of Object.keys(frame)) {
            if (prop !== 'wrapper' && (prop !== 'data' || (prop === 'data' && !(frame[prop] instanceof Array)))) {
                let obj: any = frame[prop];
                let value: string = JSON.stringify(obj);
                if (obj instanceof Array) {
                    let newValue: object[] = this.removeArrayValues(obj);
                    if (JSON.stringify(newValue) !== '[]') {
                        newObj[prop] = newValue;
                    }
                } else {
                    if (obj instanceof Object) {
                        if (!(value === JSON.stringify({ 'data': [] }))) {
                            let newValue: object = this.removeEmptyValues(obj);
                            if (JSON.stringify(newValue) !== '{}') {
                                newObj[prop] = newValue;
                            }
                        }
                    } else {
                        if (!(value === JSON.stringify(['data']) || value === JSON.stringify('data')
                            || value === JSON.stringify({ 'data': [] }))) {
                            if (prop !== 'version' && prop !== 'ejsAction') {
                                newObj[prop] = frame[prop];
                            }
                        }
                    }
                }
            }
        }
        return newObj;
    }

    
    public map(obj1: any, obj2?: any, arrayName?: any) {
        if (this.isFunction(obj1) || this.isFunction(obj2)) {
            throw 'Invalid argument. Function given, object expected.';
        }
        if (this.isValue(obj1) || this.isValue(obj2)) {
            return {
                type: this.compareValues(obj1, obj2),
                data: obj1 === undefined ? obj2 : obj1
            };
        }
        let diff = {};
        if (this.isArray(obj1)) {
            for (let i = 0; i < obj1.length; i++) {
                if (!diff[arrayName]) {
                    diff[arrayName] = [];
                }
                let ss = this.map(obj1[i], obj2[i]);
                diff[arrayName].push(ss);
            }
        }
        else {
            for (let key in obj1) {
                if (this.isFunction(obj1[key])) {
                    continue;
                }
                let value2 = undefined;
                if (obj2[key] !== undefined) {
                    value2 = obj2[key];
                }
                let kk = this.map(obj1[key], value2, this.isArray(value2) ? key : undefined);
                if (this.isArray(value2)) {
                    diff[key] = kk[key];
                }
                else {
                    diff[key] = kk;
                }
            }
        }
        if (this.isArray(obj2)) {
            for (var i = obj2.length - 1; i >= 0; i--) {
                if (!diff[arrayName]) {
                    diff[arrayName] = [];
                }
                if (this.isFunction(obj2[i]) || diff[arrayName][i] !== undefined) {
                    if (diff[arrayName][i].type && diff[arrayName][i].type !== this.valueUpdated) {
                        delete diff[arrayName];
                    }
                    continue;
                }
                let ss = this.map(undefined, obj2[i]);
                diff[arrayName][i] = ss;
            }
        }
        else {
            for (let key in obj2) {
                if (this.isFunction(obj2[key]) || diff[key] !== undefined) {
                    if (diff[key].type && ((diff[key].type !== this.valueUpdated) && (diff[key].type !== this.valueDeleted))) {
                        delete diff[key];
                    }
                    continue;
                }
                let kk = this.map(undefined, obj2[key]);
                diff[key] = kk;
            }
        }
        return diff;
    }
    
    public compareValues(value1: any, value2: any) {
        if (value1 === value2) {
            return this.valueUnchanged;
        }
        if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
            return this.valueUnchanged;
        }
        if (value1 === undefined) {
            return this.valueCreated;
        }
        if (value2 === undefined) {
            return this.valueDeleted;
        }
        return this.valueUpdated;
    }

    public isFunction(x: any) {
        return Object.prototype.toString.call(x) === '[object Function]';
    }
    public isArray(x: any) {
        return Object.prototype.toString.call(x) === '[object Array]';
    }
    public isDate(x: any) {
        return Object.prototype.toString.call(x) === '[object Date]';
    }
    public isObject(x: any) {
        return Object.prototype.toString.call(x) === '[object Object]';
    }
    public isValue(x: any) {
        return !this.isObject(x) && !this.isArray(x);
    }
    public frameObject(final: any, obj: any):any {
        for (let key in obj) {
            if (this.isArray(obj[key])) {
                if (!final[key]) {
                    final[key] = [];
                }
                for (let i = 0; i < obj[key].length; i++) {
                    let kk = this.frameObject({}, obj[key][i]);
                    final[key].push(kk);
                }
            }
            else {
                if ((key != 'type') || (key == 'type' && (obj[key] !== this.valueUpdated && obj[key] !== this.valueUnchanged && obj[key] !== this.valueDeleted && obj[key] !== this.valueCreated))) {
                    if (this.isFunction(obj[key])) {
                        continue;
                    }
                    if (this.isValue(obj[key])) {
                        return obj['data'];
                    }
                    else {
                        let kk = this.frameObject({}, obj[key]);
                        if (this.isValue(kk) || Object.keys(kk).length > 0) {
                            final[key] = kk;
                        }
                    }
                }
            }
        }
        return final;
    }
    /* eslint-enable */
}
