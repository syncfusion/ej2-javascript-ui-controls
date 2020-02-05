// /**
//  * Pointer sample
//  */
// import { CircularGauge, IAxisLabelRenderEventArgs, Annotations } from '../../src/index';
// import { CheckBox, ChangeEventArgs as CheckBoxChangeEvents } from '@syncfusion/ej2-buttons';
// import { EmitType, isNullOrUndefined } from '@syncfusion/ej2-base';
// import { gauge6 } from './pointer-gauge';
// CircularGauge.Inject(Annotations);


//     let circulargauge: CircularGauge = new CircularGauge(gauge6());
//     circulargauge.appendTo('#container');
//     this.gauge5Interval1 = setInterval(
//         (): void => {
//             let newVal: number = circulargauge.axes[0].pointers[0].value + (Math.floor(Math.random() * (10 - (-10))) - 10);
//             if (newVal <= 0) {
//                 newVal = 5;
//             }
//             if (document.getElementById('container')) {
//                 circulargauge.axes[0].pointers[0].animation.enable = true;
//                 circulargauge.setPointerValue(0, 0, newVal);
//                 if (!isNullOrUndefined(document.getElementById('pointerannotation'))) {
//                     document.getElementById('pointerannotation').innerHTML = newVal.toString() + ' km/h';
//                 }
//             } else {
//                 clearInterval(this.gauge5Interval1);
//             }
//         },
//         1000
//     );
//     // code for property panel
//     let showText: EmitType<CheckBoxChangeEvents>;
//     let interval: CheckBox = new CheckBox(
//         {
//             change: showText, checked: false
//         },
//         '#showText');
//     let combineRange: EmitType<CheckBoxChangeEvents>;
//     let rangeSet: CheckBox = new CheckBox(
//         {
//             change: combineRange, checked: false
//         },
//         '#combineRange');
//     let range: EmitType<CheckBoxChangeEvents>;
//     let showCheckBox: CheckBox = new CheckBox(
//     {
//         change: range, checked: false
//     },
//     '#range');
//     rangeSet.change = combineRange = (e: CheckBoxChangeEvents) => {
//         let element: HTMLInputElement = document.getElementById('range') as HTMLInputElement;
//         if (e.checked === true) {
//             showCheckBox.disabled = true;
//             circulargauge.axes[0].ranges[0].start = 0;
//             circulargauge.axes[0].ranges[0].end = 120;
//             circulargauge.axes[0].ranges[0].startWidth = 5;
//             circulargauge.axes[0].ranges[0].endWidth = 35;
//             circulargauge.axes[0].ranges[0].color = 'url(#grad1)';
//             circulargauge.axes[0].ranges[1].start = null;
//             circulargauge.axes[0].ranges[1].end = null;
//             circulargauge.axes[0].ranges[1].startWidth = '';
//             circulargauge.axes[0].ranges[1].endWidth = '';
//             circulargauge.axes[0].ranges[1].color = '';
//             circulargauge.axes[0].ranges[2].start = null;
//             circulargauge.axes[0].ranges[2].end = null;
//             circulargauge.axes[0].ranges[2].startWidth = '';
//             circulargauge.axes[0].ranges[2].endWidth = '';
//             circulargauge.axes[0].ranges[2].color = '';
//             circulargauge.axes[0].ranges[3].start = null;
//             circulargauge.axes[0].ranges[3].end = null;
//             circulargauge.axes[0].ranges[3].startWidth = '';
//             circulargauge.axes[0].ranges[3].endWidth = '';
//             circulargauge.axes[0].ranges[3].color = '';
//             circulargauge.axes[0].ranges[4].start = null;
//             circulargauge.axes[0].ranges[4].end = null;
//             circulargauge.axes[0].ranges[4].startWidth = '';
//             circulargauge.axes[0].ranges[4].endWidth = '';
//             circulargauge.axes[0].ranges[4].color = '';
//             circulargauge.axes[0].ranges[5].start = null;
//             circulargauge.axes[0].ranges[5].end = null;
//             circulargauge.axes[0].ranges[5].startWidth = '';
//             circulargauge.axes[0].ranges[5].endWidth = '';
//             circulargauge.axes[0].ranges[5].color = '';
//             circulargauge.axes[0].pointers[0].animation.enable = false;
//             circulargauge.refresh();
//         } else {
//             showCheckBox.disabled = false;
//             circulargauge.axes[0].ranges[0].start = 0;
//             circulargauge.axes[0].ranges[0].end = 20;
//             circulargauge.axes[0].ranges[0].startWidth = 5;
//             circulargauge.axes[0].ranges[0].endWidth = 10;
//             circulargauge.axes[0].ranges[0].color = '#82b944';
//             circulargauge.axes[0].ranges[1].start = 20;
//             circulargauge.axes[0].ranges[1].end = 40;
//             circulargauge.axes[0].ranges[1].startWidth = 10;
//             circulargauge.axes[0].ranges[1].endWidth = 15;
//             circulargauge.axes[0].ranges[1].color = '#a1cb43';
//             circulargauge.axes[0].ranges[2].start = 40;
//             circulargauge.axes[0].ranges[2].end = 60;
//             circulargauge.axes[0].ranges[2].startWidth = 15;
//             circulargauge.axes[0].ranges[2].endWidth = 20;
//             circulargauge.axes[0].ranges[2].color = '#ddec12';
//             circulargauge.axes[0].ranges[3].start = 60;
//             circulargauge.axes[0].ranges[3].end = 80;
//             circulargauge.axes[0].ranges[3].startWidth = 20;
//             circulargauge.axes[0].ranges[3].endWidth = 25;
//             circulargauge.axes[0].ranges[3].color = '#ffbc00';
//             circulargauge.axes[0].ranges[4].start = 80;
//             circulargauge.axes[0].ranges[4].end = 100;
//             circulargauge.axes[0].ranges[4].startWidth = 25;
//             circulargauge.axes[0].ranges[4].endWidth = 30;
//             circulargauge.axes[0].ranges[4].color = '#ff6000';
//             circulargauge.axes[0].ranges[5].start = 100;
//             circulargauge.axes[0].ranges[5].end = 120;
//             circulargauge.axes[0].ranges[5].startWidth = 30;
//             circulargauge.axes[0].ranges[5].endWidth = 35;
//             circulargauge.axes[0].ranges[5].color = 'red';
//             circulargauge.axes[0].pointers[0].animation.enable = false;
//             circulargauge.refresh();
//         }
//     };
//     interval.change = range = (e: CheckBoxChangeEvents) => {
//         if (e.checked === true) {
//             circulargauge.axes[0].majorTicks.interval = 10;
//             circulargauge.axisLabelRender = (args: IAxisLabelRenderEventArgs ) => {
//                 let text: string;
//                 switch (parseInt(args.text)) {
//                     case 10:
//                         text = 'Ideal';
//                         break;
//                     case 30:
//                         text = 'Safe';
//                         break;
//                     case 50:
//                         text = 'Good';
//                         break;
//                     case 70:
//                         text = 'Ok';
//                         break;
//                     case 90:
//                         text = 'Risk';
//                         break;
//                     case 110:
//                         text = 'Danger';
//                         break;

//                     default:
//                         text = '';
//                         break;
//                 }
//                 args.text = text;
//             };
//             circulargauge.axes[0].pointers[0].animation.enable = false;
//             circulargauge.refresh();
//         } else {
//             circulargauge.axes[0].majorTicks.interval = 20;
//             circulargauge.axes[0].minimum = 0;
//             circulargauge.axes[0].maximum = 120;
//             circulargauge.axisLabelRender = (args: IAxisLabelRenderEventArgs ) => {};
//             circulargauge.axes[0].pointers[0].animation.enable = false;
//             circulargauge.refresh();
//         }
//     };

//     showCheckBox.change = range = (e: CheckBoxChangeEvents) => {
//         if (e.checked) {
//             circulargauge.axes[0].rangeGap = 5;
//         } else {
//             circulargauge.axes[0].rangeGap = null;
//         }
//         circulargauge.axes[0].pointers[0].animation.enable = false;
//         circulargauge.refresh();
//     };