Essential® JS2 For ASP.NET Blazor

# Configuration

## Add Dependent Scripts in our Blazor Source

1. Add the component dependent package to the `config.json` file in our blazor source under `Package` Category. This could helps to generate the scripts in our component nuget package generation process. Based on this dependent scripts changes individual scripts can be generated.

```
{
     "Base": {
            "scripts": [
                "index",
                "popup",
                "popupsbase",
                "compression",
                "excelexport",
                "fileutils",
                "pdfexport",
                "svgbase",
                "sf-svg-export",
                "syncfusion-blazor-extended"
            ],
            "packageName": "Core"
        },
}
```

In the above code snippet, we have added `Syncfusion.Blazor.Core` package dependent script. `packageName` is an optional one.


## Add Blazor CRG Scripts in our Blazor Source

### Add Dependent Scripts in Blazor Source

1. Add the component dependent package to the `config.json` file in our blazor source under `CRG` Category. Based on this dependent scripts configuration, scripts will be generated from our [Blazor CRG](https://blazor.syncfusion.com/crg/) site. 

```
{
    // component Name 
    "SfTextBox": {  
        // Dependent script   
        "dependencies": [
            "sf-textbox.js" 
        ],
        // component categroy
        "package": "Inputs"  
    },
    "SfGrid": {
      "dependencies": [
        "sf-grid.js",
        "sf-textbox.js",
        "popupsbase.js",
        "popup.js",
        "sf-dropdownlist.js",
        "navigationsbase.js",
        "sf-contextmenu.js",
        "sf-toolbar.js",
        "sf-spinner.js",
        "sf-calendar.js",
        "sf-datepicker.js",
        "sf-numerictextbox.js",
        "sf-dropdownlist.js",
        "sf-dialog.js",
        "sf-pager.js"
      ],
      "package": "Grids"
    },
}
```
> Note: Component Name must be Stats with "Sf". Add Required component dependencies. package name is neccessary to add in this configuration.   

### Add Control name in Blazor Custom Script Generator

1. Checkout the [Blazor Custom Script Generator](https://github.com/essential-studio/blazor-custom-script-generator) `master` branch. 

2. Then Navigate to `node-services/resources.json` file location.

3. Add control name and category name as like below format.

```
{
    "SfTextBox": {     // Control Name Starts with Sf
        "control" : "TextBox", // Control Name
        "category": "Inputs",  // Component category
        "iconclass": "sf-icon-inputs"   // Component Category name starts with "sf-icon" 
    },
}
```

> Once changes updated in [Blazor Custom Script generator](https://github.com/essential-studio/blazor-custom-script-generator) repository. Need to inform those changes in Blazor Core team along with PR. Corresponding team will update those changes in server. Otherwise issue occur in our [Blazor CRG](https://blazor.syncfusion.com/crg/) site.

## Generate Individual nuget Package 

### Generate Individual nuget package for All component

1. Checkout Blazor Source(https://github.com/essential-studio/ej2-blazor-source.git) repository.

2. Install npm package using `npm install` command.

3. Update generated nuget version in `version.txt` file, then run `gulp update-config` command.

4. Then run `gulp generate-nuget` command. All component Package will be generated under `Nuget` Folder.

### Generate Individual nuget package for Specific compoent

1. Checkout Blazor Source(https://github.com/essential-studio/ej2-blazor-source.git) repository.

2. Install npm package using `npm install` command.

3. Update generated nuget version in `version.txt` file, then run `gulp update-config` command.

4. Then run `gulp generate-nuget --option Release|Debug --project Syncfusion.Blazor.Core;Syncfusion.Blazor.Buttons` command. Core and Buttons component Package will be generated under `Nuget` Folder.

> Note: Multiple component name must be separated by `semicolon (;)`.

## ThirdParty - Configuration for Blazor

Add the below configuration to the `config.json` file (from component repo) for generate EventArgs interface to blazor source

```
{
 
 "eventInterfaces": ["ActionEventArgs", "AddEventArgs"]
    
}
```

## Dot Cover

Dot Cover is a tool used to determine the percentage of Source code which is covered by automated tests.

### Repository Structure

- [Syncfusion.Blazor Source](https://github.com/essential-studio/ej2-blazor-source) `{{componentname}}` should be same as like [Syncfusion<sup>&reg;</sup> Blazor testing](https://github.com/essential-studio/blazor-tests-automation) component name.

For example, In our blazor source `datepicker`, `TimePicker` component will be created under `Calendars` category.
    <img width="244" alt="image" src="https://github.com/essential-studio/ej2-blazor-source/assets/58772846/a5160cc4-64b9-4643-9ce8-177c9becb41b">

- Same structure should be maintained in our [Syncfusion<sup>&reg;</sup> Blazor test](https://github.com/essential-studio/blazor-tests-automation) repository.

    <img width="259" alt="image" src="https://github.com/essential-studio/ej2-blazor-source/assets/58772846/3b4a2059-311b-4862-8f50-102847734132">

### How to run & Get the Coverage Report

- Connect [Syncfusion.Blazor Source](https://github.com/essential-studio/ej2-blazor-source) Library in [Syncfusion<sup>&reg;</sup> Blazor testing](https://github.com/essential-studio/blazor-tests-automation) Projct.

- Exclude unwanted folder from [Syncfusion<sup>&reg;</sup> Blazor test](https://github.com/essential-studio/blazor-tests-automation) project.

- Go to [Syncfusion<sup>&reg;</sup> Blazor test](https://github.com/essential-studio/blazor-tests-automation) location and run `npm i`.

- once npm installation process completed, run  `coverage.bat` file to execute the dotcover. This statement only return `report.html` and `report.xml` file.

- we can execute the same process by running the `npm run code-coverage-report-generation`. 

- New Folder `CCReport` will be created in the (syncfusion.Blazor.Test)[https://github.com/essential-studio/blazor-tests-automation/tree/development/Syncfusion.Blazor.Tests] location. 

- Go through the folder and run the `report.html` file to get the coverage report. `Summaryreport.html` file returns only the coverage percentage for our blazor source.

### Report Analysis

- Once run the Blazor code-coverage `npm run code-coverage-report-generation` Command, Reports will be generated Under `Syncfusion.Blazor.Tests/CCReport`

    <img width="331" alt="image" src="https://github.com/essential-studio/ej2-blazor-source/assets/58772846/be05121b-436a-4307-9d12-0b1cfcd3472b">

- We can analyze the covered & uncovered code details in report.html file. `Covered` code will be highlighted in `green` color, `uncovered` code will be highlighted in `red` color.

    <img width="876" alt="image" src="https://github.com/essential-studio/blazor-tests-automation/assets/58772846/8d3b48a6-b1ef-4a99-bd45-6aa56c1c5a01">

    > Note: Corresponding running component and its dependent namespace only shows the percentage Level. Other components namespace shows zero percent in `report.html` file.

    <img width="467" alt="image" src="https://github.com/essential-studio/blazor-tests-automation/assets/58772846/7d32d0b3-acf5-47fc-86c7-1c81e5e9bcda">

- In `summary.html` file, only shows the corresponding running component and dependent component source percentage level. As of now maximum percentage level should be in `70%`. Component `less than 70%` coverage has been marked as `red` color. In future, code coverage will be failed in CI based on `summary.html` file component percentage.

    <img width="960" alt="image" src="https://github.com/essential-studio/blazor-tests-automation/assets/58772846/26bd216b-853a-4cbe-9b97-7dd9a52271ac">

## Step for adding a new component script in blazor source
https://github.com/essential-studio/ej2-blazor-source/wiki/Steps-to-Add-a-New-Component's-script-(TypeScript)-in-Blazor-Source