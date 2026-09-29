import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RibbonGroupModel } from '@syncfusion/ej2-ribbon';



export class RibbonGroupDirective extends ComplexBase<RibbonGroupModel & { children?: React.ReactNode }, RibbonGroupModel> {
    public static moduleName: string = 'ribbonGroup';
}

export class RibbonGroupsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'groups';
    public static moduleName: string = 'ribbonGroups';
}
