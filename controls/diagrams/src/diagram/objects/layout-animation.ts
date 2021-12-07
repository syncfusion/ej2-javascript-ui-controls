import { Diagram } from '../diagram';
import { Node } from '../objects/node';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Layout, ILayout } from '../layout/layout-base';
import { ConnectorModel } from '../objects/connector-model';
import { NodeModel } from '../objects/node-model';
import { Container } from '../core/containers/container';
import { DiagramEvent, RealAction, DiagramConstraints } from '../enum/enum';
import { IExpandStateChangeEventArgs } from '../objects/interface/IElement';
import { cloneObject as clone } from '../utility/base-util';
import { cloneBlazorObject } from '../utility/diagram-util';

/**
 * Layout Animation function to enable or disable layout animation
 */
export class LayoutAnimation {

    private protectChange: boolean = false;

    /**
     * Layout expand function for animation of expand and collapse \
     *
     * @returns {  void }   Layout expand function for animation of expand and collapse .\
     * @param {boolean} animation - provide the angle value.
     * @param {ILayout} objects - provide the angle value.
     * @param {Node} node - provide the angle value.
     * @param {Diagram} diagram - provide the angle value.
     * @private
     */
    public expand(animation: boolean, objects: ILayout, node: Node, diagram: Diagram): void {
        const setIntervalObject: Object = {};
        const i: number = 0;
        let j: number = 0;
        diagram.realActions = diagram.realActions | RealAction.AnimationClick;
        setIntervalObject[i] = setInterval(
            () => {
                j++;
                return this.layoutAnimation(objects, setIntervalObject, j === 6, diagram, node);
            },
            20);
        if (node.isExpanded) {
            let opacity: number = .2;
            const protect: string = 'isProtectedOnChange';
            this.protectChange = diagram[protect];
            diagram.protectPropertyChange(false);
            //let objects: ILayout = diagram.doLayout();
            const setIntervalObjects: Object = {};
            const x: number = 0;
            if (animation) {
                this.updateOpacity(node, opacity, diagram);
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const current: LayoutAnimation = this;
                setIntervalObjects[x] = setInterval(
                    () => {
                        diagram.allowServerDataBinding = false;
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        opacity <= 1 ? this.updateOpacity(node, opacity, diagram) : clearInterval(setIntervalObjects[0]);
                        opacity += .2;
                        diagram.allowServerDataBinding = true;
                    },
                    20);
            }
        }
    }



    /**
     * Setinterval and Clear interval for layout animation \
     *
     * @returns {  void }   Setinterval and Clear interval for layout animation .\
     * @param {ILayout} objValue - provide the angle value.
     * @param {Object} layoutTimer - provide the angle value.
     * @param {ILayout} stop - provide the angle value.
     * @param {Diagram} diagram - provide the angle value.
     * @param {NodeModel} node - provide the angle value.
     * @private
     */
    public layoutAnimation(objValue: ILayout, layoutTimer: Object, stop: boolean, diagram: Diagram, node?: NodeModel): void {
        if (!stop) {
            for (let k: number = 0; k < objValue.objects.length; k++) {
                const node: NodeModel = diagram.nameTable[objValue.objects[k].id];
                node.offsetX += objValue.objects[k].differenceX / 5;
                node.offsetY += objValue.objects[k].differenceY / 5;
            }
        }
        if (stop) {
            clearInterval(layoutTimer[0]);
            diagram.realActions = diagram.realActions & ~RealAction.AnimationClick;
            diagram.refreshCanvasLayers();
            diagram.protectPropertyChange(true);
            diagram.triggerEvent(DiagramEvent.animationComplete, undefined);
            diagram.organizationalChartModule.isAnimation = false;
            diagram.layout.fixedNode = '';
            diagram.protectPropertyChange(this.protectChange);
            const arg: IExpandStateChangeEventArgs = {
                element: cloneBlazorObject(clone(node)), state: (node.isExpanded) ? true : false
            };
            diagram.triggerEvent(DiagramEvent.expandStateChange, arg);
            if (diagram.lineRoutingModule && diagram.constraints & DiagramConstraints.LineRouting) {
                diagram.resetSegments();
            }
        }
    }



    /**
     *update the node opacity for the node and connector once the layout animation starts \
     *
     * @returns {  void }    update the node opacity for the node and connector once the layout animation starts .\
     * @param {Node} source - provide the source value.
     * @param {number} value - provide the value.
     * @param {Diagram} diagram - provide the diagram value.
     * @private
     */
    public updateOpacity(source: Node, value: number, diagram: Diagram): void {
        for (let i: number = 0; i < source.outEdges.length; i++) {
            const connector: ConnectorModel = diagram.nameTable[source.outEdges[i]];
            const target: Node = diagram.nameTable[connector.targetID];
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
     *To destroy the ruler
     *
     * @returns {void} To destroy the ruler
     */

    public destroy(): void {
        /**
         * Destroys the LayoutAnimate module
         */
    }

    /**
     * Core method to return the component name.
     *
     * @returns {string}  Core method to return the component name.
     * @private
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'LayoutAnimate';
    }

}
