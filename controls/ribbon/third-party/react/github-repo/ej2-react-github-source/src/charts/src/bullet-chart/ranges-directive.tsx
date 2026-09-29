import { ComplexBase } from '@syncfusion/ej2-react-base';
import { RangeModel } from '@syncfusion/ej2-charts';


/**
 * `BulletRangeDirective` directive represent a ranges of the react BulletChart. 
 * ```
 * <BulletChartComponent>
 * <BulletRangeCollectionDirective>
 * <BulletRangeDirective></BulletRangeDirective>
 * </BulletRangeCollectionDirective>
 * </BulletChartComponent>
 * ```
 */
export class BulletRangeDirective extends ComplexBase<RangeModel & { children?: React.ReactNode }, RangeModel> {
    public static moduleName: string = 'bulletRange';
}

export class BulletRangeCollectionDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'ranges';
    public static moduleName: string = 'bulletRangeCollection';
}
