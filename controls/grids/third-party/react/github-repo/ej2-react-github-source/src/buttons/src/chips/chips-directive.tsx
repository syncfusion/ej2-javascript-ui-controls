import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ChipModel } from '@syncfusion/ej2-buttons';

export interface ChipDirTypecast {
    template?: string | Function | any;
}
/**
 * `ChipDirective` directive represent a chip of the React ChipList.
 * ```html
 * <ChipListComponent> 
 *   <ChipsDirective>
 *    <ChipDirective text='chip1'></ChipDirective>
 *    <ChipDirective text='chip2'></ChipDirective>
 *   </ChipsDirective>
 * </ChipListComponent>
 * ```
 */
export class ChipDirective extends ComplexBase<ChipModel| ChipDirTypecast & { children?: React.ReactNode }, ChipModel| ChipDirTypecast> {
    public static moduleName: string = 'chip';
}

export class ChipsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'chips';
    public static moduleName: string = 'chips';
}
