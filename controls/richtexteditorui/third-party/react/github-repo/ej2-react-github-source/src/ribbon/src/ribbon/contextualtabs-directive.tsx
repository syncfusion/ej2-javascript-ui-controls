import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RibbonContextualTabSettingsModel } from '@syncfusion/ej2-ribbon';


/**
 * `RibbonContextualTabDirective` represent a contextual tab of the React Ribbon. 
 * It must be contained in a Ribbon component(`RibbonComponent`). 
 * ```ts
 * <RibbonComponent>
 *   <RibbonContextualTabsDirective>
 *     <RibbonContextualTabDirective></RibbonContextualTabDirective>
 *     <RibbonContextualTabDirective></RibbonContextualTabDirective>
 *   <RibbonContextualTabsDirective>
 * </RibbonComponent>
 * ```
 */
export class RibbonContextualTabDirective extends ComplexBase<RibbonContextualTabSettingsModel & { children?: React.ReactNode }, RibbonContextualTabSettingsModel> {
    public static moduleName: string = 'ribbonContextualTab';
}

export class RibbonContextualTabsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'contextualTabs';
    public static moduleName: string = 'ribbonContextualTabs';
}
