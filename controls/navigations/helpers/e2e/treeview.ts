import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

export class TreeViewHelper extends TestHelper {
    // tslint:disable
    public id: string;
    public wrapperFn: Function;

    constructor(id:string, wrapperFn:Function) {
        super();
        this.id = id;
        if(wrapperFn!==undefined){
            this.wrapperFn = wrapperFn
        }
        return this;
    }
    selector(arg: any) {
        return (this.wrapperFn ? this.wrapperFn(arg) : arg);
    }
    getElement() {
        return this.selector('#' + this.id);
    }
     /*
    *Used to get the Collapsed Element of the treeview.
    */
    getCollapsedStateElement() {
        return this.selector( '.e-list-item.e-level-1.e-node-collapsed');
    }
     /*
    *Used to get the Expanded Element of the treeview.
    */
    getExpandedStateElement() {
        return this.selector('.e-list-item.e-level-1');
    }
    private getTreeViewInstance() {
        return this.getElement().then((ele: any) => {
            return ele[0].ej2_instances[0];
        });
    }
    public setTreeViewProperty(propertyName: string, args: any = null) {
        return this.getTreeViewInstance().then((ej2_instance: any) => {
            return (ej2_instance[propertyName] = args);
        });
    }
    public callTreeviewMethods(methodName: string, args: any = null) {
        return this.getTreeViewInstance().then((ej2_instance: any ) => {
            return ej2_instance[methodName].call(ej2_instance, args);
        });
    }
    getSelectedNodes(id: number | string){
        return this.setTreeViewProperty('selectedNodes', id);
    }
      /**
     * Used to get the disableNode of the treeview component.
     */
    getDisableNode(id: string | number) {
        return this.callTreeviewMethods('disableNodes', id);
    }

      /**
     * Used to get the Active element of the treeview component.
     */
    getActiveElement(id: string | number) {
        this.getSelectedNodes(id);
        return this.selector( '.e-list-item.e-level-1.e-active.e-node-focus');
    }
      /**
     * Used to get the disabledNodes of the treeview.
     * @example
     * const dataSource = [{
     *   id: '1', text: 'parent',
     *   child: [
     *       { id: '1-1', text: 'child' }
     *   ]
     * }];
     * this.disabledNodes(['1'])
     */
    getDisabledNodes(id: string | number) {
        this.getDisableNode(id);
        return this.selector('.e-list-item.e-level-1.e-disable');
    }
      /**
     * Used to get the Editable Nodes of the treeview.
     * @example
     * const dataSource = [{
     *   id: '1', text: 'parent',
     *   child: [
     *       { id: '1-1', text: 'child' }
     *   ]
     * }];
     * tree.beginEdit(['1'])
     */
    getNodeEdit(id : string | boolean) {
        return this.callTreeviewMethods('beginEdit', id);
    }
      /**
     * Used to get the Editable Node of the treeview component.
     */
    getEditableNode(id: string | boolean) {
         this.getNodeEdit(id);
         return this.selector('.e-text-content.e-icon-wrapper .e-input-group.e-control-wrapper');
    }
}

