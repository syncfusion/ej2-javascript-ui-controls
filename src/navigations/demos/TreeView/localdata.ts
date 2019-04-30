import { TreeView } from '../../src/treeview/treeview';

// Hierarchical data source for TreeView component
let continents: { [key: string]: Object; }[] = [
    {
        code: 'NA', name: 'North America', expanded: true, countries: [
            { code: 'USA', name: 'United States of America', selected: true },
            { code: 'CUB', name: 'Cuba' },
            { code: 'MEX', name: 'Mexico' }
        ]
    },
    {
        code: 'AF', name: 'Africa', countries: [
            { code: 'NGA', name: 'Nigeria' },
            { code: 'EGY', name: 'Egypt' },
            { code: 'ZAF', name: 'South Africa' }
        ]
    },
    {
        code: 'AS', name: 'Asia', countries: [
            { code: 'CHN', name: 'China' },
            { code: 'IND', name: 'India' },
            { code: 'JPN', name: 'Japan' }
        ]
    },
    {
        code: 'EU', name: 'Europe', countries: [
            { code: 'DNK', name: 'Denmark' },
            { code: 'FIN', name: 'Finland' },
            { code: 'AUT', name: 'Austria' }
        ]
    },
    {
        code: 'SA', name: 'South America', countries: [
            { code: 'BRA', name: 'Brazil' },
            { code: 'COL', name: 'Colombia' },
            { code: 'ARG', name: 'Argentina' }
        ]
    },
    {
        code: 'OC', name: 'Oceania', countries: [
            { code: 'AUS', name: 'Australia' },
            { code: 'NZL', name: 'New Zealand' },
            { code: 'WSM', name: 'Samoa' }
        ]
    },
    {
        code: 'AN', name: 'Antarctica', countries: [
            { code: 'BVT', name: 'Bouvet Island' },
            { code: 'ATF', name: 'French Southern Lands' }
        ]
    },
];

// Render the TreeView with hierarchical data source
let treeObj: TreeView = new TreeView({
    fields: { dataSource: continents, id: 'code', text: 'name', child: 'countries' }
});
treeObj.appendTo('#tree');

// Self-referential list data source for TreeView component
let localData: { [key: string]: Object }[] = [
    { id: 1, name: 'Discover Music', hasChild: true, expanded: true },
    { id: 2, pid: 1, name: 'Hot Singles', selected: true },
    { id: 3, pid: 1, name: 'Rising Artists' },
    { id: 4, pid: 1, name: 'Live Music' },
    { id: 7, name: 'Sales and Events', hasChild: true },
    { id: 8, pid: 7, name: '100 Albums - $5 Each' },
    { id: 9, pid: 7, name: 'Hip-Hop and R&B Sale' },
    { id: 10, pid: 7, name: 'CD Deals' },
    { id: 11, name: 'Categories', hasChild: true },
    { id: 12, pid: 11, name: 'Songs' },
    { id: 13, pid: 11, name: 'Bestselling Albums' },
    { id: 14, pid: 11, name: 'New Releases' },
    { id: 15, pid: 11, name: 'Bestselling Songs' },
    { id: 16, name: 'MP3 Albums', hasChild: true },
    { id: 17, pid: 16, name: 'Rock' },
    { id: 18, pid: 16, name: 'Gospel' },
    { id: 19, pid: 16, name: 'Latin Music' },
    { id: 20, pid: 16, name: 'Jazz' },
    { id: 21, name: 'More in Music', hasChild: true },
    { id: 22, pid: 21, name: 'Music Trade-In' },
    { id: 23, pid: 21, name: 'Redeem a Gift Card' },
    { id: 24, pid: 21, name: 'Band T-Shirts' },
    { id: 25, name: 'Fiction Book Lists', hasChild: true },
    { id: 26, pid: 25, name: 'To Kill a Mockingbird' },
    { id: 27, pid: 25, name: 'Pride and Prejudice' },
    { id: 28, pid: 25, name: 'Harry Potter' },
    { id: 29, pid: 25, name: 'The Hobbit' },
];

// Render the TreeView with list data source
let listTreeObj: TreeView = new TreeView({
    fields: { dataSource: localData, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' }
});
listTreeObj.appendTo('#listtree');