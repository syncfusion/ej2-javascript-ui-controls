import { Stepper } from '../src/stepper/index';
import { StepModel } from '../src/stepper-base/stepper-base-model';
let stepperObj: Stepper;
const iconWithText: StepModel[] = [
    {iconCss: 'e-icons e-folder', text: 'Step 1'},
    {iconCss: 'e-icons e-folder', text: 'Step 2'},
    {iconCss: 'e-icons e-folder', text: 'Step 3', optional: true},
    {iconCss: 'e-icons e-folder', text: 'Step 4'},
    {iconCss: 'e-icons e-folder', text: 'Step 5'}
];
document.getElementById('render').addEventListener('click', renderStepper);
document.getElementById('destroy').addEventListener('click', destoryStepper);
function renderStepper(): void {
    stepperObj = new Stepper({
        steps: iconWithText
    });
    stepperObj.appendTo('#stepper');
}
function destoryStepper(): void {
    if (stepperObj && !stepperObj.isDestroyed) {
        stepperObj.destroy();
    }
}
