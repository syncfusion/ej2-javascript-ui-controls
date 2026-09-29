import { Component, ViewChild } from '@angular/core';

/**
 * App Module
 */
@Component({
    selector: 'temp-component',
    template: `<ej2-list #comp [dataSource]='data'>
               <ng-template #template let-data>
                    <div class='text-template'> {{ data.name }}</div>
               </ng-template>
               <ng-template #tooltipTemplate let-data>
                    <div class='text-template'> {{ data.name }}</div>
               </ng-template>
               <e-items>
                    <e-item [dataSource]='item1Data'>
                        <ng-template #template let-data>
                            <div class='item-template'> {{ data.name }}</div>
                        </ng-template>
                    </e-item>
                    <e-item text='Item2'>
                    <e-subitems>
                    <e-subitem [dataSource]='item1Data'>
                        <ng-template #template let-data>
                            <div class='subitem-template'> {{ data.name }}</div>
                        </ng-template>
                    </e-subitem>
                    </e-subitems>
                    </e-item>
                    <e-item text='Item3'>
                    </e-item>
               </e-items>
    </ej2-list>
    <ng-template #commonTemplate let-data>
    <div class='text-template'> {{ data.name }}</div>
</ng-template>
     <ej2-list id="ndList" [dataSource]='data'></ej2-list>
    `
})
export class TemplateApp {
    public item1Data: Object = { text: 'name' };
    public data: Object = [{ name: 'template1' }, { name: 'template2' }];
    public tmpl: string = '<div>dataCheck</div>';
    @ViewChild('commonTemplate')
    public commonTemplate: any;

    @ViewChild('comp')
    public compInstance: any;
}
