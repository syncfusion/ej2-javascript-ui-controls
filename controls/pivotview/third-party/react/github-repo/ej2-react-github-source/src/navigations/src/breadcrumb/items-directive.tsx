import { ComplexBase } from '@syncfusion/ej2-react-base';
import { BreadcrumbItemModel } from '@syncfusion/ej2-navigations';


/**
 * `BreadcrumbItemDirective` represent a item of the React Breadcrumb. 
 * It must be contained in a Breadcrumb component(`BreadcrumbComponent`). 
 * ```tsx
 * <BreadcrumbComponent> 
 *   <BreadcrumbItemsDirective>
 *    <BreadcrumbItemDirective text='Home' url='/'></BreadcrumbItemDirective>
 *    <BreadcrumbItemDirective text='Index' url='./index'></BreadcrumbItemDirective>
 *   </BreadcrumbItemsDirective>
 * </BreadcrumbComponent>
 * ```
 */
export class BreadcrumbItemDirective extends ComplexBase<BreadcrumbItemModel & { children?: React.ReactNode }, BreadcrumbItemModel> {
    public static moduleName: string = 'breadcrumbItem';
}

export class BreadcrumbItemsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'items';
    public static moduleName: string = 'breadcrumbItems';
}
