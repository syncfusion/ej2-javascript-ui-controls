/**
 * AutoComplete Custom Filtering Sample
 */
import { Component } from '@angular/core';
import * as Fuse from 'fuse.js';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';

@Component({
    selector: 'control-content',
    templateUrl: 'custom-filtering.component.html',
    styleUrls: ['custom-filtering.component.css'],
})
export class CustomFilteringAutoCompleteComponent {
    // define the JSON of books data
    public booksData: { [key: string]: Object; }[] = [
        { BookName: 'Support Vector Machines Succinctly', BookID: 'BOOK1' }, { BookName: 'Scala Succinctly', BookID: 'BOOK2' },
        { BookName: 'Application Security in .NET Succinctly', BookID: 'BOOK3' },
        { BookName: 'ASP.NET WebHooks Succinctly', BookID: 'BOOK4' },
        { BookName: 'Xamarin.Forms Succinctly', BookID: 'BOOK5' }, { BookName: 'Asynchronous Programming Succinctly', BookID: 'BOOK6' },
        { BookName: 'Java Succinctly Part 2', BookID: 'BOOK7' }, { BookName: 'Java Succinctly Part 1', BookID: 'BOOK8' },
        { BookName: 'PHP Succinctly', BookID: 'BOOK9' }, { BookName: 'Bing Maps V8 Succinctly', BookID: 'BOOK10' },
        { BookName: 'WPF Debugging and Performance Succinctly', BookID: 'BOOK11' },
        { BookName: 'Go Web Development Succinctly', BookID: 'BOOK12' },
        { BookName: 'Go Succinctly', BookID: 'BOOK13' }, { BookName: 'More UWP Succinctly', BookID: 'BOOK14' },
        { BookName: 'UWP Succinctly', BookID: 'BOOK15' }, { BookName: 'LINQPad Succinctly', BookID: 'BOOK16' },
        { BookName: 'MongoDB 3 Succinctly', BookID: 'BOOK17' }, { BookName: 'R Programming Succinctly', BookID: 'BOOK18' },
        { BookName: 'Azure Cosmos DB and DocumentDB Succinctly', BookID: 'BOOK19' },
        { BookName: 'Unity Game Development Succinctly', BookID: 'BOOK20' },
        { BookName: 'Aurelia Succinctly', BookID: 'BOOK21' }, { BookName: 'Microsoft Bot Framework Succinctly', BookID: 'BOOK22' },
        { BookName: 'ASP.NET Core Succinctly', BookID: 'BOOK23' }, { BookName: 'Twilio with C# Succinctly', BookID: 'BOOK24' },
        { BookName: 'Angular 2 Succinctly', BookID: 'BOOK25' }, { BookName: 'Visual Studio 2017 Succinctly', BookID: 'BOOK26' },
        { BookName: 'Camtasia Succinctly', BookID: 'BOOK27' }, { BookName: 'SQL Queries Succinctly', BookID: 'BOOK28' },
        { BookName: 'Keystone.js Succinctly', BookID: 'BOOK29' }, { BookName: 'Groovy Succinctly', BookID: 'BOOK30' },
        { BookName: 'SQL Server for C# Developers Succinctly', BookID: 'BOOK31' },
        { BookName: 'Ubuntu Server Succinctly', BookID: 'BOOK32' },
        { BookName: 'Statistics Fundamentals Succinctly', BookID: 'BOOK33' }, { BookName: '.NET Core Succinctly', BookID: 'BOOK34' },
        { BookName: 'SOLID Principles Succinctly', BookID: 'BOOK35' }, { BookName: 'Node.js Succinctly', BookID: 'BOOK36' },
        { BookName: 'Customer Success for C# Developers Succinctly', BookID: 'BOOK37' },
        { BookName: 'Data Capture and Extraction with C# Succinctly', BookID: 'BOOK38' },
        { BookName: 'Hadoop Succinctly', BookID: 'BOOK39' }, { BookName: 'SciPy Programming Succinctly', BookID: 'BOOK40' },
        { BookName: 'Hive Succinctly', BookID: 'BOOK41' }, { BookName: 'React.js Succinctly', BookID: 'BOOK42' },
        { BookName: 'ECMAScript 6 Succinctly', BookID: 'BOOK43' }, { BookName: 'GitHub Succinctly', BookID: 'BOOK44' },
        { BookName: 'Gulp Succinctly', BookID: 'BOOK45' }, { BookName: 'Visual Studio Code Succinctly', BookID: 'BOOK46' },
        { BookName: 'Object-Oriented Programming in C# Succinctly', BookID: 'BOOK47' },
        { BookName: 'C# Code Contracts Succinctly', BookID: 'BOOK48' },
        { BookName: 'Leaflet.js Succinctly', BookID: 'BOOK49' }, { BookName: 'Delphi Succinctly', BookID: 'BOOK50' },
        { BookName: 'SQL on Azure Succinctly', BookID: 'BOOK51' }, { BookName: 'Web Servers Succinctly', BookID: 'BOOK52' },
        { BookName: 'ASP.NET Multitenant Applications Succinctly', BookID: 'BOOK53' },
        { BookName: 'ASP.NET MVC Succinctly', BookID: 'BOOK54' },
        { BookName: 'Windows Azure Websites Succinctly', BookID: 'BOOK55' },
        { BookName: 'Localization for .NET Succinctly', BookID: 'BOOK56' },
        { BookName: 'ASP.NET Web API Succinctly', BookID: 'BOOK57' },
        { BookName: 'ASP.NET MVC 4 Mobile Websites Succinctly', BookID: 'BOOK58' },
        { BookName: 'jQuery Succinctly', BookID: 'BOOK59' }, { BookName: 'JavaScript Succinctly', BookID: 'BOOK60' },
    ];
    // maps the appropriate column to fields property
    public fields: Object = { value: 'BookName' };
    // set placeholder to AutoComplete input element
    public watermark: string = 'e.g. Node.js Succinctly';
    //Bind the filter event
    public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
        let options: Object = {
            keys: ['BookName'],
            includeMatches: true,
            findAllMatches: true
        };
        // create object from Fuse constructor
        let fuse: Fuse<any> = new Fuse(this.booksData, options);
        // store the search result data based on typed characters
        let result: any = fuse.search(e.text);
        let data: { [key: string]: Object; }[] = [];
        for (let i: number = 0; i < result.length; i++) {
            data.push(result[i].item as any);
        }
        // pass the filter data source to updateData method.
        e.updateData(data, null);
        let popupElement: HTMLElement = document.getElementById('books_popup');
        let lists: Element[] = <NodeListOf<Element> & Element[]>popupElement.querySelectorAll('.e-list-item');
        // For highlight the typed characters, pass the result data and list items to highlightSearch method.
        this.highlightSearch(lists, result);
    }

    public highlightSearch(listItems: Element[], result: any): void {
        if (result.length > 0) {
            for (let i: number = 0; i < listItems.length; i++) {
                let innerHTML: string = listItems[i].innerHTML;
                for (let j: number = result[i].matches[0].indices.length - 1; j >= 0; j--) {
                    let indexes: number[] = <number[]>result[i].matches[0].indices[j];
                    innerHTML = innerHTML.substring(0, indexes[0]) + '<span class="e-highlight">' +
                        innerHTML.substring(indexes[0], (indexes[1] + 1)) + '</span>' + innerHTML.substring(indexes[1] + 1);
                    listItems[i].innerHTML = innerHTML;
                }
            }
        }
    }
}
