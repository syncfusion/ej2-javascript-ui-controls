import { Diagram } from '../diagram';
import { Node } from '../objects/node';
import { Layout, ILayout } from '../layout/layout-base';
import { ConnectorModel } from '../objects/connector-model';
import { NodeModel } from '../objects/node-model';
import { Container } from '../core/containers/container';
import { DiagramEvent } from '../enum/enum';

/**
 * Layout Animation function to enable or disable layout animation
 */
export class LayoutAnimation {

    private protectChange: boolean = false;
    /**
     * Layout expand function for animation of expand and collapse 
     */
    public expand(animation: boolean, objects: ILayout, node: Node, diagram: Diagram): void {
        let setIntervalObject: Object = {};
        let i: number = 0;
        let j: number = 0;
        setIntervalObject[i] = setInterval(
            () => {
                j++;
                return this.layoutAnimation(objects, setIntervalObject, j === 6, diagram);
            },
            20);
        if (node.isExpanded) {
            let opacity: number = .2;
            let protect: string = 'isProtectedOnChange';
            this.protectChange = diagram[protect];
            diagram.protectPropertyChange(false);
            //let objects: ILayout = diagram.doLayout();
            let setIntervalObjects: Object = {};
            let x: number = 0;
            this.updateOpacity(node, opacity, diagram);
            let current: LayoutAnimation = this;
            setIntervalObjects[x] = setInterval(
                () => {
                    opacity <= 1 ? this.updateOpacity(node, opacity, diagram) : clearInterval(setIntervalObjects[0]);
                    opacity += .2;
                },
                20);

        }
    }


    /**
     * Setinterval and Clear interval for layout animation 
     */
    /** @private */
    public layoutAnimation(objValue: ILayout, layoutTimer: Object, stop: boolean, diagram: Diagram): void {
        if (!stop) {
            for (let k: number = 0; k < objValue.objects.length; k++) {
                let node: NodeModel = diagram.nameTable[objValue.objects[k].id];
                node.offsetX += objValue.objects[k].differenceX / 5;
                node.offsetY += objValue.objects[k].differenceY / 5;
            }
        }
        if (stop) {
            clearInterval(layoutTimer[0]);
            diagram.protectPropertyChange(true);
            diagram.triggerEvent(DiagramEvent.animationComplete, undefined);
            diagram.organizationalChartModule.isAnimation = false;
            diagram.layout.fixedNode = '';
            diagram.protectPropertyChange(this.protectChange);
        }
    }


    /**
     * update the node opacity for the node and connector once the layout animation starts
     */
    public updateOpacity(source: Node, value: number, diagram: Diagram): void {
        for (let i: number = 0; i < source.outEdges.length; i++) {
            let connector: ConnectorModel = diagram.nameTable[source.outEdges[i]];
            let target: Node = diagram.nameTable[connector.targetID];
            connector.style.opacity = value;
            for (let j: number = 0; j < connector.wrapper.children.length; j++) {
                connector.wrapper.children[j].style.opacity = value;
                target.style.opacity = value;
                if (target.wrapper instanceof Container) {
                    diagram.updateNodeProperty(target.wrapper, undefined, value);
                }
            }
            this.updateOpacity(target, value, diagram);
        }

    }

    /**
     * To destroy the  LayoutAnimate module
     * @return {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the LayoutAnimate module
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'LayoutAnimate';
    }





}