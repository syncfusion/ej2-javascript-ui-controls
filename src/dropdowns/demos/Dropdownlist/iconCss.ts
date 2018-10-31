/**
 * dropdownlist Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';

    let socialMedia: { [key: string]: Object }[] = [
        { class: 'sf-icon-facebook', country: 'Facebook' }, { class: 'sf-icon-twitter', country: 'Twitter ' },
        { class: 'sf-icon-whatsapp', country: 'WhatsApp' }, { class: 'sf-icon-tumblr', country: 'Tumblr' },
        { class: 'sf-icon-google-plus', country: 'Google plus' }, { class: 'sf-icon-skype-01', country: 'Skype' },
        { class: 'sf-icon-vimeo', country: 'Vimeo' }, { class: 'sf-icon-instagram', country: 'Instagram' },
        { class: 'sf-icon-youtube1', country: 'YouTube' }, { class: 'sf-icon-reddit', country: 'Reddit' }
    ];

    let listObj: DropDownList = new DropDownList({
        dataSource: socialMedia,
        fields: { text: 'country', iconCss: 'class' },
        width: '250px',
        popupHeight: '200px',
        popupWidth: '250px',
    });
    listObj.appendTo('#list');