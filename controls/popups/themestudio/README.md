# Theme Studio Application

We have created the Asp.net core application to generate our available themes for our components and added our available components. We can use this application to customize and generate the themes for our components.

We have migrated or theme studio application to Core application and modified the structure. So, hereafter we have planned to maintain the all component’s themes file in this repository. Then ux team will using this repository to add the new themes for our components.

## Prerequisites

1.	Install the serve package as global

```cmd
npm i -g serve
```

## Steps to add new theme

Please find the below steps to add the new themes in theme studio application.

1.	Clone ej2-theme-studio repository from GitLab using the below link.

    https://gitlab.syncfusion.com/essential-studio/ej2-theme-studio/tree/development
2.	Install the required node_modules using **npm install** command.
3.	For adding new theme in theme studio, need to process the below steps.

### To run the individual samples

1.	Run the **gulp prepare-new-theme** gulp task to generate new theme with our latest existing themes.

For example, if we need to generate new theme, run the above mentioned gulp task and give the theme name in command prompt. Then it will generate the new theme file with our latest theme changes in this location **(./styles/**/*-definition.scss)**.

In config.json file, we need to add the latest theme name like below.

```json
latest: "bootstrap5"
```

![prepare new theme](images/prepare-new.png)

![fluent](images/fluent.png)

2.	**gulp compile-themes**, gulp task will get all scss files from dist folder and then generated with respective css files for our themes.

3.	Then we can use this generated css files in our demos and check the styles for our components. To check the samples run the **gulp test-samples** gulp task to run the local samples.

![test-samples](images/test-samples.png)

![serve](images/serve.png)

4. Open the web browser and run the localhost: 5000, then the component lists will be showed as like below.

![components](images/components-list.png)

5. Then you can click any one of the component link, you can see the output of the components as below.

![button](images/button.png)

> If you want to change the color or any styles, you can change from styles folder. Then run the **gulp test-samples**, the changes will be refreshed.

### To run the theme studio application

While using Visual studio for running this application, follow the below steps to run the theme studio.

1. **gulp combine-themes** – combine-themes gulp task to generate the scss files for our components with required files and it placed it into this location **(./src/wwwroot/ej2-resource/styles/*/*.scss)**.

2. After that, **gulp scss-files** gulp task will be called, In this task all components theme files are combined in single theme file in this location **(./dist/input/*.scss)**.

3.	Then **dynamic-theme** gulp task to add the text file in template folder for theme compilation.

4. Then run the application in visual studio or run the **dotnet run** command in command prompt.

## Run the Samples with Overall styles

To check the over all styles in our components, add the changes in styles folder in respective component’s definition files.

Then run the **gulp test-samples**, the changes will be applied in our components, and you can see the changes in chrome web browser.

## Moving styles repo to theme studio and Styles maintenance for controls

We are going to move the styles to theme studio application and hereafter, we will maintain all styles from theme studio itself. While moving styles to theme studio application, all components’ styles are placed in same place. So, UX team will get styles easily and if any changes required, they will proceed using this repository.

https://gitlab.syncfusion.com/essential-studio/ej2-theme-studio/tree/development/styles

We have also segregated the themestudio repository as in below image.

![Themestudio-repo](images/theme-studio-repo.png)

**Src** – Source folder contains the Themestudio application.
**Styles** -  Styles folder contains all the component styles which are segregated based on the repositories.
**test-sample** – Holds the sample of all components.

So, we have planned to remove the styles folder from components repository, and we have added the automation for this process.

•	Since we have moved styles to theme studio repo, the current styles folders will be in read only in components repository for short period(will remove once everything completed). So the components repository will maintain only source.
•	If you want to add any changes in styles, you can use the theme studio repository.
•	We have processed the automation to run the individual samples and whole theme studio application in this repository.

We have segregated the components in the themestudio repository as Repository based folders which are named using the package name given in the component repository. Below are the repository name and folder name to  be maintained for the component in the Themestudio.

|**Folder name in theme studio** | **Component repository** |
|--------------------------------|--------------------------|
|barcode-generator | ej2-barcode-generator |
|base | ej2-base-library |
|buttons| ej2-button-components |
|calendars | ej2-calendar-components |
|diagrams | ej2-diagram-components |
|documenteditor | ej2-documenteditor-components |
|drawings | ej2-drawings |
|dropdowns | ej2-dropdown-components |
|filemanager | ej2-filemanager-component |
|gantt | ej2-gantt-component |
|grid | ej2-grid-component |
|inplace-editor | ej2-inplace-editor-components |
|inputs| ej2-input-components |
|Kanban | ej2-kanban-component |
|layouts | ej2-layout-components |
|lists | ej2-list-components |
|navigations | ej2-navigation-components |
|notifications | ej2-notification-components |
|pdfviewer | ej2-pdfviewer-library |
|pivotview | ej2-pivot-components |
|popups | ej2-popup-components |
|querybuilder | ej2-querybuilder-component |
|richtexteditor | ej2-richtexteditor-component |
|schedule | ej2-schedule-component |
|splitbuttons | ej2-splitbuttons-components |
|spreadsheet | ej2-spreadsheet-component  |
|treegrid | ej2-treegrid-component |

![folder names](images/folder-names.png)

> There will be no changes in the package generation and ci process. Once a commit is made in the themestudio application component ci will be automatically triggered for the component in Jenkins.

## Style Maintenance for controls

Hereafter, we will maintain only the component’s source in repository. **Styles** folders are not maintained in the components repository.

> If you want to add any changes in styles, you can check it local with your component’s repository. For generating the styles, the styles folder will be cloned from theme studio application for your components. So, you can add the changes and ensured it in your local. After that, you can commit the changes in theme studio repository. Once you pushed the changes, automatically CI will trigger and published the changes in your packages.

If you want to add any styles / adding any bug fixes for the control we need to make the changes in the **Themestudio** repository only, if you want to change a control style directly make changes in the styles folder, for example if you want to change in button component you need to change the **scss** file in the **styles/buttons/button/**.

![button styles](images/button-styles.png)

If any changes made in theme studio application, automatically the component’s CI will be triggered and published the styles in components packages.

If you want to check the style changes in local, you can run the below command to generate the styles.

```cmd
gulp ci-compile
```

## Test samples in the theme studio application

We have added all control samples in the themestudio repository under the **test-samples** this step will provide an easier way to view control samples in a single place. UX team will check new theme demo for controls in the demo section only.

### Sample modification and adding new sample in the test-samples

We are maintaining the all the control samples separated as individual control wise folders in  **test-samples**.

•	If you want to modify already created  sample just edit the control sample without changing the structure of the sample edit only <body> section.
•	For adding new sample create a folder named in control and add a index.html  file use the below template and add the component in the body section. 

```html
<html>
{{head}}
</head>

<body>

  <!-- Control html code  -->
  <script>
    // Control rendering code
  </script>
</body>

</html>
```

![html file](images/index-html.png)