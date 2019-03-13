import {
    Diagram, NodeModel, UserHandleModel, MoveTool, MouseEventArgs, cloneObject, IElement, randomId
} from '../../src/diagram/index';
export class CloneAndDragTool extends MoveTool {
    public mouseDown(args: MouseEventArgs): void {
        args.source = diagram.selectedItems.nodes[0] as IElement;
        args.sourceWrapper = diagram.selectedItems.wrapper;
        if (!args.source) {
            args.source = diagram.selectedItems.connectors[0] as IElement;
            args.sourceWrapper = diagram.selectedItems.wrapper;
        }
        super.mouseDown(args);
        let newObject: NodeModel;
        if (diagram.selectedItems.nodes.length > 0) {
            newObject = cloneObject(diagram.selectedItems.nodes[0]);
        } else {
            newObject = cloneObject(diagram.selectedItems.connectors[0]);
        }
        newObject.id += randomId();
        newObject.wrapper.id = newObject.id;
        newObject.offsetX += 10;
        newObject.offsetY += 10;
        diagram.add(newObject)
        args.source = diagram.nameTable[newObject.id]
        args.sourceWrapper = diagram.nameTable[newObject.id].wrapper;
        diagram.select([diagram.nameTable[newObject.id]]);
        this.currentElement = newObject as IElement;
        this.prevPosition = this.currentPosition;
    }
}



/**
 * Basic Shapes
 */
let node1: NodeModel = { id: 'node', offsetX: 50, offsetY: 50, height: 100, width: 100 };


let handle: UserHandleModel[] = [{
    name: 'handle1',
    pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z',
    visible: true, backgroundColor: 'black', offset: 0, side: 'Right', margin: { top: 0, bottom: 0, left: 0, right: 25 },
    pathColor: 'white'
}];
let diagram: Diagram = new Diagram({
    width: 400, height: 300, nodes: [node1],
    selectedItems: { userHandles: handle },
    scrollSettings: { padding: { top: 50, left: 50 } }
});
diagram.appendTo('#diagram');
