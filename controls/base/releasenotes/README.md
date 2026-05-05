# Release Notes Guidelines

This section contains guidelines on naming files, sections and other document elements.

> **If there is no changes in product, you don't need to mention that in Release Notes.**

## Encoding Format

All Release Notes files should be saved in **Encoding in UTF-8 (Without BOM)** format. You can use Notepad++ to verify the encoding.

![Encoding.png](https://bitbucket.org/repo/j57Gz9/images/2199960455-Encoding.png)

## Release Notes Folder Hierarchy

* Platform [Folder]
* ----ReleaseNotes [Folder]
* --------v13.3.x.x [Folder]
* ------------Control1.md
* ------------Control2.md
* ------------Control3.md
* --------v13.4.x.x [Folder]
* ------------Control1.md
* ------------Control2.md
* ------------Control3.md

### How to write Release Notes?

* Each release markdown files should reside under corresponding version folder in their platform.
* Each product release notes should be created in separate file name.
* File name should be same as the product name. 

> **NOTE**: Please do not add any Front Matter information in Release Notes files.

## Markdown File Structure

Each markdown file should have following items.

* Control Name
* Features
* Bug fixes
* Braking Changes
* Known Issues

> Do not add any front matter(triple dashed line) in this markdown.

### Control Name

Control Name should be with prefix `##`. This will be rendered as `H2` in html file. 

#### Syntax

```
## <Control-Name>
```

#### Example

```
## ejAccrodion
```

### Features

* Each features should be written in unordered list. 
* Feature header should have id in the following format `<control-name>-features`. All characters in **id should be written in lower case.**

#### Syntax

```
### Features
{:#<control-name>-features}

* \#1 - Feature Info
* \#2 - Feature Info
* \#3 - Feature Info
```

#### Example

```
### Features
{:#ejaccordion-features}

* \#140303 - Accordion provides option to add new items dynamically by using the `addItem` method
* \#140303 - Accordion provides option to add new items dynamically by using the `addItem` method
* \#140303, \#140304 - Accordion provides option to add new items dynamically by using the `addItem` method
```

> **NOTE:** 
> * In markdown `#` used to represent headers. 
> * By default it will be converted as HTML headers. 
> * To display the `#` in html, please use escape sequences [See above example].

### Bug Fixes

* Each bug fix should be written in unordered list. 
* Bug fixes header should have id in the following format `<control-name>-bug-fixes`. All characters in **id should be written in lower case.**

#### Syntax

```
### Bug fixes
{:#<control-name-in-lower-case>-bug-fixes}

* \#1 - Bug Fix
* \#2 - Bug Fix
* \#3 - Bug Fix
```

#### Example

```
### Bug Fixes
{:#ejaccordion-bug-fixes}

* \#140303 - Accordion provides option to add new items dynamically by using the `addItem` method
* \#140303 - Accordion provides option to add new items dynamically by using the `addItem` method
* \#140303, \#140304 - Accordion provides option to add new items dynamically by using the `addItem` method
```

> **NOTE:** 
> * In markdown `#` used to represent headers. 
> * By default it will be converted as HTML headers. 
> * To display the `#` in html, please use escape sequences [See above example].

### Breaking Changes

* Each breaking changes should be written in unordered list.
* Breaking changes header should have id in the following format `<control-name>-breaking-changes`. All characters in **id should be written in lower case.**

```
### Breaking Changes
{:#<control-name>-breaking-changes}

* * Breaking Change 1
* * Breaking Change 2
* * Breaking Change 3
```

#### Example

```
### Breaking Changes
{:#ejaccordion-breaking-changes}

* Now, Circular series end angle will not be adjusted based on the start angle, so the output will be like semi-circle instead of full circle. In order to render the complete circular series with customized start angle, you have to add the start angle value to end angle property now. This break will occur only if you have specified startAngle already 
```

> **NOTE:** 
> * In markdown `#` used to represent headers. 
> * By default it will be converted as HTML headers. 
> * To display the `#` in html, please use escape sequences [See above example].

## Incidents and Forums in Release notes

We can represent the Incident ID with I and F for forums in release notes MD files 

#### Example 


```
## ChromelessWindow

### Bug Fixes
{:#chromelesswindow-bug-fixes}

* \#I336220 - When using `ShowDialog` on a `RibbonWindow`, a `NullReferenceException` will no longer occur.
* \#F166385 - The gap between the bottom of the window and the `TaskBar` is now properly maintained.

```

This is published in the page : https://help.syncfusion.com/wpf/release-notes/v19.3.0.43?type=all#chromelesswindow


## Commit

Same workflow for User Guide applicable to this repository. All the changes needs to be committed in `development` branch.

## Preview Changes

All the changes will be included with User Guide automation and published in Staging Documentation machine.

<http://115.249.201.211:9090>