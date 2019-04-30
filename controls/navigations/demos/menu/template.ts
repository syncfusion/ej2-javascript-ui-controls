/**
 * Template sample
 */
import { Browser } from '@syncfusion/ej2-base';
import { Menu, MenuModel } from './../../src/menu/index';
import { MenuEventArgs } from '../../src/common/index';
import { FieldSettingsModel } from '../../src/common/menu-base-model';

let menuDatasource: { [key: string]: Object }[] = [
    { 
        title: 'PRODUCTS',
        option: [
            {
                value: 'prod',
                WebJS: [
                    { value: 'ASP.NET Core' },
                    { value: 'ASP.NET MVC' },
                    { value: 'Angular' },
                    { value: 'React' },
                    { value: 'Vue' },
                    { value: 'JavaScript' }
                ],
                Desktop: [
                    { value: 'Windows Forms' },
                    { value: 'WPF' },
                    { value: 'UWP' }
                ],
                FileFrmts: [
                    { value: 'Excel' },
                    { value: 'PDF' },
                    { value: 'Word' },
                    { value: 'PowerPoint' }
                ]
            }
        ]
    },
    { title: 'CONSULTING' },
    {
        title: 'LEARNING & SUPPORT',
        option: [
            {
                learning: [
                    { value: 'Demos' },
                    { value: 'Blog' },
                    { value: 'Documentation' },
                    { value: 'What’s New' },
                    { value: 'Road Map' },
                    { value: 'Release History' }
                ],
                Resources: [
                    { value: 'E-Books' },
                    { value: 'Knowledge Base' },
                    { value: 'Whitepapers' },
                    { value: 'Case Studies' },
                    { value: '.NET FAQ' }
                ]
            }
        ]
    },
    { title: 'PRICING' },
    { title: 'COMPANY' }
];

let templateStr: string = '${if(title)}<div><b>${title}</b></div>${/if}'+
        '${if(value==="prod")}'+
        '<table><tr><td><button>VIEW DEMO</button><br /><button>WHAT\'S NEW</button><br /><button>FREE TRIAL</button></td>'+
        '${if(WebJS || Desktop)}'+
        '${if(WebJS)}<td><ul><li><b>WEB - Pure JavaScript</b></li>${for(opt of WebJS)}'+
        '<li><a href="#">${opt.value}</a></li>${/for}</ul></td>${/if}'+
        '${if(Desktop)}<td><ul><li><b>DESKTOP</b></li>${for(opt of Desktop)}'+
        '<li><a href="#">${opt.value}</a></li>${/for}</ul></td>${/if}'+
        '${if(FileFrmts)}<td><ul><li><b>FILE FORMATS</b></li>${for(opt of FileFrmts)}'+
        '<li><a href="#">${opt.value}</a></li>${/for}</ul></td>${/if}'+
        '</tr></table>${/if}'+
        '${else}'+
        '${if(learning || Resources)}<table><tr>'+
        '${if(learning)}<td><ul><li><b>LEARNING</b></li>${for(learn of learning)}'+
        '<li><a href="#">${learn.value}</a></li>${/for}</ul></td>${/if}'+
        '${if(Resources)}<td><ul><li><b>RESOURCES</b></li>${for(resrc of Resources)}'+
        '<li><a href="#">${resrc.value}</a></li>${/for}</ul></td>${/if}'+
        '</tr></table>${/if}'+
        '${/if}';

let menuFields: FieldSettingsModel = {
    children: ["option"]
};

let menuOptions: MenuModel = {
    items: menuDatasource,
    fields: menuFields,
    template: templateStr,
    beforeItemRender: (args: MenuEventArgs) => {
        // code here
    }
};

let menuObj: Menu = new Menu(menuOptions, '#menu');

if (Browser.isDevice) {
    document.body.classList.add('e-bigger');
}
else {
    menuObj.animationSettings.effect = 'SlideDown';
}
