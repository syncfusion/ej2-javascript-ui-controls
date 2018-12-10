/**
 * ListView Virtualization Sample
 */
import { Component, Inject, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { Browser } from '@syncfusion/ej2-base';
import { ListView } from '@syncfusion/ej2-lists';

@Component({
    selector: 'app-virtualization-list',
    templateUrl: './virtualization.component.html',
    styleUrls: ['./virtualization.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class VirtualizationListComponent implements OnInit {
    @ViewChild('listviewInstance')
    public listviewInstance: ListView;
    public commonData: { [key: string]: string | object }[] = [];
    public dataSource: { [key: string]: { [key: string]: string | object }[] } = {};
    public startTime: Date;
    public endTime: Date;
    public liElement: HTMLElement;
    public cssClass = 'e-list-template';

    public template: string = '<div class="e-list-wrapper e-list-avatar">' +
        '<span class="e-avatar e-avatar-circle ${icon} ${$imgUrl ? \'hideUI\' : \'showUI\' }">' +
        '${icon}</span> <img class="e-avatar e-avatar-circle ${$imgUrl ? \'showUI\' : \'hideUI\' }" ' +
        'src="${$imgUrl ?  $imgUrl : \' \' }" />' +
        '<span class="e-list-content">${name}</span></div>';

    public ddlDatasource: Object[] = [
        { value: '1', text: '1k' },
        { value: '5', text: '5k' },
        { value: '10', text: '10k' },
        { value: '25', text: '25k' }
    ];
    public ddlFields: Object = { text: 'text', value: 'value' };

    public fields: Object = { text: 'name' };

    public ngOnInit() {
        this.commonData = [
            { name: 'Nancy', icon: 'N', id: '0', },
            { name: 'Andrew', icon: 'A', id: '1' },
            { name: 'Janet', icon: 'J', id: '2' },
            { name: 'Margaret', imgUrl: '/assets/listview/virtualization/margaret.png', id: '3' },
            { name: 'Steven', icon: 'S', id: '4' },
            { name: 'Laura', imgUrl: '/assets/listview/virtualization/laura.png', id: '5' },
            { name: 'Robert', icon: 'R', id: '6' },
            { name: 'Michael', icon: 'M', id: '7' },
            { name: 'Albert', imgUrl: '/assets/listview/virtualization/albert.png', id: '8' },
            { name: 'Nolan', icon: 'N', id: '9' }
        ];

        this.liElement = document.getElementById('ui-list');

        if (Browser.isDevice) {
            this.liElement.classList.add('ui-mobile');
        }

        [[1010, 'data1'], [5010, 'data5'], [10010, 'data10'], [25010, 'data25']].forEach((ds: string[] | number[]) => {
            const data: { [key: string]: string | object }[] = this.commonData.slice();
            let index: number;
            let spyIndex: number;
            for (let i = 10; i <= ds[0]; i++) {
                while (index === spyIndex) {
                    index = parseInt((Math.random() * 10).toString(), 10);
                }
                data.push({ name: data[index].name, icon: data[index].icon, imgUrl: data[index].imgUrl, id: i.toString() });
                spyIndex = index;
            }
            this.dataSource[ds[1]] = data;
        });
    }

    public onActionComplete() {
        this.endTime = new Date();
        document.getElementById('time').innerText = (this.endTime.getTime() - this.startTime.getTime()) + ' ms';
    }

    public onActionBegin() {
        this.startTime = new Date();
    }

    public onChange(e) {
        this.startTime = new Date();
        this.listviewInstance.dataSource = this.dataSource['data' +
            (this.ddlDatasource[e.target.options.selectedIndex] as any).value];
        this.listviewInstance.dataBind();
        this.endTime = new Date();
        document.getElementById('time').innerText = (this.endTime.getTime() - this.startTime.getTime()) + ' ms';
    }
}
