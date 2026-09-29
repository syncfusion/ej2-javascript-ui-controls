import { ComplexBase } from '@syncfusion/ej2-react-base';
import { MultiLevelLabelsModel } from '@syncfusion/ej2-charts';


/**
 * `MultiLevelLabelDirective` directive represent a multilevellabel of the react chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent>
 * <AxesDirective>
 * <AxisDirective>
 * <MultiLevelLabelsDirective>
 * <MultiLevelLabelDirective></MultiLevelLabelDirective>
 * </MultiLevelLabelsDirective>
 * </AxisDirective>
 * </AxesDirective>
 * </ChartComponent>
 * ```
 */
export class MultiLevelLabelDirective extends ComplexBase<MultiLevelLabelsModel & { children?: React.ReactNode }, MultiLevelLabelsModel> {
    public static moduleName: string = 'multiLevelLabel';
}

export class MultiLevelLabelsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'multiLevelLabels';
    public static moduleName: string = 'multiLevelLabels';
}
