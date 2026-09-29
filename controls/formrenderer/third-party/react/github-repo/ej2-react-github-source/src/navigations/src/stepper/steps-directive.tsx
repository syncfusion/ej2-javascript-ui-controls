import { ComplexBase } from '@syncfusion/ej2-react-base';
import { StepModel } from '@syncfusion/ej2-navigations';


/**
 * `StepDirective` represents a step of the React Stepper. 
 * It must be contained in a Stepper component(`StepperComponent`). 
 * ```tsx
 * <StepperComponent>
 *  <StepsDirective>
 *   <StepDirective iconCss= { 'e-icons e-folder' } text= { 'Step 1' } />
 *   <StepDirective iconCss= { 'e-icons e-folder' } text= { 'Step 2' } />
 *  </StepsDirective>
 * </StepperComponent>
 * ```
 */
export class StepDirective extends ComplexBase<StepModel & { children?: React.ReactNode }, StepModel> {
    public static moduleName: string = 'step';
}

export class StepsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'steps';
    public static moduleName: string = 'steps';
}
