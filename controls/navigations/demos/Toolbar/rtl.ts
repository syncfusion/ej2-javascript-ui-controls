/**
 *  Toolbar RTL Sample
 */
import { Toolbar, OverflowMode} from '../../src/toolbar/index';

    let toolbarObj: Toolbar = new Toolbar({
      width: 900,
        items: [
            {
              prefixIcon: 'e-cut-icon', tooltipText: 'يقطع' , overflow: 'Show' },
            {
              prefixIcon: 'e-copy-icon', tooltipText: 'نسخ' , overflow: 'Show' },
            {
              prefixIcon: 'e-paste-icon', tooltipText: 'معجون' , overflow: 'Show' },
            {
              type: 'Separator' },
            {
              prefixIcon: 'e-bold-icon', tooltipText: 'بالخط العريض' , overflow: 'Show' },
            {
              prefixIcon: 'e-underline-icon', tooltipText: 'أكد' , overflow: 'Show' },
            {
              prefixIcon: 'e-italic-icon', tooltipText: 'مائل' , overflow: 'Show' },
            {
              type: 'Separator' },
            {
              text: 'الرصاص', prefixIcon: 'e-bullets-icon', tooltipText: 'الرصاص' },
            {
              text: 'الترقيم', prefixIcon: 'e-numbering-icon', tooltipText: 'الترقيم' },
            {
              type: 'Separator' },
            {
                text: 'رادار', prefixIcon: 'e-radar-icon', tooltipText: 'مخطط الرادار'},
            {
                text: 'خط', prefixIcon: 'e-line-icon', tooltipText: 'خط الرسم البياني' , showTextOn: 'Overflow' },
            {
                type: 'Separator' },
            {
                prefixIcon: 'e-alignleft-icon', tooltipText: 'محاذاة اليسار',
                 overflow: 'Show', text: 'اليسار' },
            {
                prefixIcon: 'e-alignjustify-icon', tooltipText: 'محاذاة، ضبط',
                 overflow: 'Show', text: 'تبرير' },
            {
                prefixIcon: 'e-alignright-icon', tooltipText: 'محاذاة اليمين',
                 text: 'حق' },
            {
               prefixIcon: 'e-aligncenter-icon', tooltipText: 'محاذاة سنتر',
                text: 'مركز' },
            {
                type: 'Separator' },
            {
              prefixIcon: 'e-undo-icon', tooltipText: 'فك', text: 'فك' },
            {
              prefixIcon: 'e-redo-icon', tooltipText: 'فعل ثانية', text: 'فعل ثانية' },
            {
              type: 'Separator' },
            {
              prefixIcon: 'e-table-icon', text: 'الطاولة', tooltipText: 'الطاولة' , showTextOn: 'Overflow' },
            {
                prefixIcon: 'e-picture-icon', overflow: 'Hide', text: 'صورة',
                tooltipText: 'صورة' , showTextOn: 'Overflow' },
            {
                text: 'التصميم', prefixIcon: 'e-design-icon', overflow: 'Hide',
                tooltipText: 'التصميم', showTextOn: 'Overflow'
        }]
    });
    toolbarObj.enableRtl = true;
    toolbarObj.appendTo('#ej2Toolbar_Rtl');
    document.getElementById('modeSwitch').onchange = (e : Event) => {
        let ddl: String = (e.target as HTMLInputElement).checked ? 'Popup' : 'Scrollable'
        toolbarObj.overflowMode = ddl as OverflowMode;
        toolbarObj.dataBind();
   };

