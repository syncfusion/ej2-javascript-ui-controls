import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ItemModel } from '@syncfusion/ej2-navigations';

export interface ItemDirTypecast {
    template?: string | Function | any;
}
/**
 * `ItemDirective` directive represent a item of the React Toolbar. 
 * It must be contained in a Toolbar component(`ToolbarComponent`). 
 * ```tsx
 * <ToolbarComponent> 
 *   <ItemsDirective>
 *    <ItemDirective text='Cut'></ItemDirective>
 *    <ItemDirective text='Copy'></ItemDirective>
 *   <ItemsDirective>
 * </ToolbarComponent>
 * ```
 */
export class ItemDirective extends ComplexBase<ItemModel| ItemDirTypecast & { children?: React.ReactNode }, ItemModel| ItemDirTypecast> {
    public static moduleName: string = 'item';
}

export class ItemsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'items';
    public static moduleName: string = 'items';
}
