import { ComplexBase } from '@syncfusion/ej2-react-base';
import { MultiLevelCategoriesModel } from '@syncfusion/ej2-charts';


/**
 * `CategoryDirective` directive represent a trendline of the react chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent>
 * <AxesDirective>
 * <AxisDirective>
 * <MultiLevelLabelsDirective>
 * <MultiLevelLabelDirective>
 * <CategoriesDirective>
 * <CategoryDirective>
 * </CategoryDirective>
 * </CategoriesDirective>
 * </MultiLevelLabelDirective>
 * </MultiLevelLabelsDirective>
 * </AxisDirective>
 * </AxesDirective>
 * </ChartComponent>
 * ```
 */
export class CategoryDirective extends ComplexBase<MultiLevelCategoriesModel & { children?: React.ReactNode }, MultiLevelCategoriesModel> {
    public static moduleName: string = 'category';
}

export class CategoriesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'categories';
    public static moduleName: string = 'categories';
}
