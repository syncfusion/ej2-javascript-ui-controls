[![coverage](http://ej2.syncfusion.com/badges/ej2-treegrid/coverage.svg)](http://ej2.syncfusion.com/badges/ej2-treegrid)

# New Component Configuration
## Template Location:
The component configuration template can be checkout from the below bitbucket location.

[https://gitlab.syncfusion.com/essential-studio/ej2-component-template](https://gitlab.syncfusion.com/essential-studio/ej2-component-template "")

## Required Node Versions:
**node:** >= 5

**npm:** >= 3

## package.json
1. Should replace the name from `@syncfusion/component` to `@syncfusion/{package-name}`.
2. Should replace description from `Essential JS 2 Component` to `Essential JS 2 {Component-Name} Components/Library`.

The Essential JS 2 components must have the below folder structure in its new repository.

![](http://www.syncfusion.com/downloads/support/directtrac/general/template-img12026308336)

## .vscode
It configures the VS code application’s edit settings. The default tslint configuration and other edit settings are already included itself.
## spec
It should have all testing scripts and its specification documents for code coverage and jasmine test cases.
## src
All typescript source files related to the component should place inside the **src** location.
### index.ts
This is the main file in the current repository. It needs to be export all modules from the **src** folder. Each sub folder under src should have independent index.ts file. 
## styles
The component’s style sheet should placed inside the styles location. The default style sheet files are already included in the template.

If the current repository contains a group of components, then each component should have it's own folder under styles location. 

Example:

```css

 ---> ej2-button-components
     ---> styles
         ---> button
             ---> button themes here
         ---> radio button
             ---> radio button themes here
         ---> checkbox
             ---> checkbox themes here

```

### Icon Base:

All embed font icon declarations are placed inside the **styles/common/_icons.scss** of [**ej2-base-library**](https://bitbucket.org/syncfusion/ej2-base-library/src) repository. 

The show case icon sample (demo.html) also placed inside the **styles/resources** folder of [**ej2-base-library**](https://bitbucket.org/syncfusion/ej2-base-library/src).

![](http://files2.syncfusion.com/dtsupport/directtrac/general/template_img2-927093325.png)

All CSS styles have to be wrapped into a mixin **export-module** with unique module name.

The required icon details can be gathered from demo.html of [**ej2-base-library**](https://bitbucket.org/syncfusion/ej2-base-library/src). Each icon class must have **ej-** prefix in **_icons.scss**. 

All icon elements must have class name **e-icons** in the DOM.

```css

@include export-module('component-icons') {
   .e-file-delete-01:before { 
     content: "\e700"; 
  }
}

```

### _layout.scss:

It contains the layout design of component. The common SCSS variables should not define inside the layout style sheet.

|       Correct Usage        |         Wrong Usage                 |
| -------------------------- | ------------------------------------|
| .ej-head { border:  0px; } | .ej-head { border:  $border-size; } |


### _theme.scss:

It contains the theme implementation of component. It can be use the common variables and local values in the styles.

### _definition.scss:

The component's default defintion and variables can be declared in this file. We need to use this variables in the component’s theme files. 
This file refernece will be automated, so we don't need to import this file in `_all.scss`.

### _{themeName}-definition.scss:

We can override the default component variables by this theme wise definition file. This file also automated to import in main theme file,
so don't import this file in `_all.scss`.

### theme files (SCSS):

The default theme file (bootstrap.scss) will automatically generate while running `gulp styles` task. The style dependencies can be added by using `styleDependency` option of `config.json` file. These dependencies will automatically import in the generated theme files.

**Single component repository:**

```json

// If component have style dependency packages
"styleDependency": ["ej2-pack1", "ej2-pack2"]

// If component don't have styles
"styleDependency": "none"

```

**Multiple component repository:**

```json

"styleDependency": [{ "grid": [ "ej2-button", "ej2-dropdown"] }, { "treegrid": ["ej2-button", "ej2-lists"] }, { "button": [] }]

```

If the component doesn't have any dependencies, then add an empty array in `styleDependency`. The key must have the same name as folder name in styles.

`ej2-base` is common to all theme files, so it will automatically imported at top of generating files, so don't add `ej2-base` in the `styleDependency`.

`gulp styles-all` task will generate all defined themes in the styles folder.


**Automated Theme File Structure:** 

The automated theme files will have the below contents.

`bootstrap.scss:`

```css

    /*!  dependent component's styles */
    @import 'ej2-base/styles/bootstrap.scss';

    /*! current component's default defintions */
    @import 'definition.scss';

    /*! current component's theme wise override defintions */
    @import 'bootstrap-definition.scss';

    /*! current component's styles */
    @import 'all.scss';

```

## .gitignore
Specify the file or folders, which will be ignored while committing in git.
## .npmignore
Specify the files or folder, which will be ignored when publish the changes in npm.
## .npmrc
It contains the remote server IP registry, which has been used for sinopia to get npm packages from remote server. Do not change anything from this file. 
## Jenkinsfile
Jenkinsfile is nothing but a pipeline file which contains the build steps need to be run in the Jenkins server.
## ReadMe.md
Description of current repository is placed in this md file. The file name must have `ReadMe.md` case sensitive.
## config.json
It can override the gulp task’s default source path from [**ej2-build-tasks**](https://bitbucket.org/syncfusion/ej2-build-tasks/) config settings.

If current repository contains a group of components, then it should have declared in components option.

Example:

```json

{
  "components": ["button", "radiobutton", "checkbox"]
}

```

The `customWords` option in config.json is used to ignore some specific words on api spell checking process.

The `sampleList` is used to get the samples need to be tested on sample browser for each merge request.


## gulpfile.js
The gulp tasks from [**ej2-build-tasks**](https://gitlab.syncfusion.com/essential-studio/ej2-build-tasks) can be run from local repository using this gulpfile.js. Do not change anything from this file. 
## karma.conf.js
The karma configuration setup is configured in this file. All src, spec and dependent components src files must be declared inside the files option. 
## test-main.js
This configuration is used to run the karma code coverage . If the component has dependent components, then it must be included using packages option. 
## Reference:
[https://gitlab.syncfusion.com/essential-studio/ej2-button-components/tree/master](https://gitlab.syncfusion.com/essential-studio/ej2-button-components/tree/master "")