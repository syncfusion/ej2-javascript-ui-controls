import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RibbonTabModel } from '@syncfusion/ej2-ribbon';



export class RibbonTabDirective extends ComplexBase<RibbonTabModel & { children?: React.ReactNode }, RibbonTabModel> {
    public static moduleName: string = 'ribbonTab';
}

export class RibbonTabsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'tabs';
    public static moduleName: string = 'ribbonTabs';
}
