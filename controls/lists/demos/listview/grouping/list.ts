/**
 * ListView Grouping Sample
 */
import { ListView } from '../../../src/list-view/index';

let dataSource: { [key: string]: Object }[] = [
    {
        'text': 'Audi A4',
        'id': '9bdb',
        'category': 'Audi'
    },
    {
        'text': 'Audi A5',
        'id': '4589',
        'category': 'Audi'
    },
    {
        'text': 'Audi A6',
        'id': 'e807',
        'category': 'Audi'
    },
    {
        'text': 'Audi A7',
        'id': 'a0cc',
        'category': 'Audi'
    },
    {
        'text': 'Audi A8',
        'id': '5e26',
        'category': 'Audi'
    },
    {
        'text': 'BMW 501',
        'id': 'f849',
        'category': 'BMW'
    },
    {
        'text': 'BMW 502',
        'id': '7aff',
        'category': 'BMW'
    },
    {
        'text': 'BMW 503',
        'id': 'b1da',
        'category': 'BMW'
    },
    {
        'text': 'BMW 507',
        'id': 'de2f',
        'category': 'BMW'
    },
    {
        'text': 'BMW 3200',
        'id': 'b2b1',
        'category': 'BMW'
    }
];

let listObj: ListView = new ListView({
    dataSource: dataSource,
    fields: { groupBy: 'category' }
});
listObj.appendTo('#grouped-list');
