# jasmine-json-test-reporter

[Jasmine Custom Reporter Documentation](http://jasmine.github.io/2.1/custom_reporter.html)

## What is it?

This project is a custom [Jasmine](http://jasmine.github.io/) reporter that will output spec results, organized by suite, to a file location you specify, as JSON.

## Why?

I had a project using Jasmine/Protractor that required that I have a parsable version of the test results. The custom Jasmine reporters I could find only gave options to output to the common formats (JUnit, NUnit, TeamCity, HTML). Since I need to parse this data within JavaScript, it made sense to have a JSON representation of my test results.

Protractor does technically provide an option to export results as JSON using the `resultJsonOutputFile` option, but the data provided is limited. Additionally, I had a need to run Protractor multiple times and dynamically assign the test results output filename each time, which cannot currently be done with Protractor (config can't be modified at run-time).

## How to use

### Install
`npm install jasmine-json-test-reporter --save-dev`

### Jasmine Usage
```javascript
var JSONReporter = require('jasmine-json-test-reporter');
jasmine.getEnv().addReporter(new JSONReporter({
	file: 'jasmine-test-results.json',
	beautify: true,
	indentationLevel: 4 // used if beautify === true
}));
```

### Protractor/Jasmine Usage
```javascript
// in Protractor conf
var JSONReporter = require('jasmine-json-test-reporter');

...

framework: 'jasmine2',
onPrepare: function() {
	jasmine.getEnv().addReporter(new JSONReporter({
		file: 'jasmine-test-results.json',
		beautify: true,
		indentationLevel: 4 // used if beautify === true
	}));
}
```

## Example Output w/ Default Options

```json
{
    "suite1": {
        "id": "suite1",
        "description": "example suite",
        "fullName": "example suite",
        "failedExpectations": [],
        "status": "finished",
        "specs": [
            {
                "id": "spec0",
                "description": "should test something",
                "fullName": "example suite should test something",
                "failedExpectations": [],
                "passedExpectations": [
                    {
                        "matcherName": "toBe",
                        "message": "Passed.",
                        "stack": "",
                        "passed": true
                    },
                    {
                        "matcherName": "toBe",
                        "message": "Passed.",
                        "stack": "",
                        "passed": true
                    }
                ],
                "status": "passed"
            }
        ]
    }
}
```