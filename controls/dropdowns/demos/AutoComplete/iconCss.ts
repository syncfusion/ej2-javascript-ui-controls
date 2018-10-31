/**
 * AutoComplete Sample
 */
import { AutoComplete } from '../../src/auto-complete/index';

let socialMedia: { [key: string]: Object }[] = [
    { class: 'sf-icon-facebook', country: 'Facebook' }, { class: 'sf-icon-twitter', country: 'Twitter ' },
    { class: 'sf-icon-whatsapp', country: 'WhatsApp' }, { class: 'sf-icon-tumblr', country: 'Tumblr' },
    { class: 'sf-icon-google-plus', country: 'Google plus' }, { class: 'sf-icon-skype-01', country: 'Skype' },
    { class: 'sf-icon-vimeo', country: 'Vimeo' }, { class: 'sf-icon-instagram', country: 'Instagram' },
    { class: 'sf-icon-youtube1', country: 'YouTube' }, { class: 'sf-icon-reddit', country: 'Reddit' }
];

let listObj: AutoComplete = new AutoComplete({
    dataSource: socialMedia,
    fields: { value: 'country', iconCss: 'class' },
    width: '250px',
    placeholder: 'Select an icon',
    index: -1,
    popupHeight: '200px',
    popupWidth: '250px',
});
listObj.appendTo('#list');