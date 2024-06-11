# Gulp prompt

If you are interested in getting involved please send us an e-mail or open an issue.
There are a couple of open issues and small clean up projects that we could use some help with.

<a href="https://codeclimate.com/github/shannonlal/gulp-prompt/maintainability"><img src="https://api.codeclimate.com/v1/badges/b9e10756dc89eb1d7c19/maintainability" /></a>

Add interaction to gulp tasks.

## .confirm([options])

Options:

 - **message** - Message to be displayed
 - **default** - Default response if none is provided

This method will allow the pipe to continue if the user input is true, otherwise, it will be terminated.

Default usage:
```javascript

gulp.src('test.js')
	.pipe(prompt.confirm())
	.pipe(gulp.dest('dest'));

```

If a string is provided to the options, it will be set as the message:
```javascript

gulp.src('test.js')
	.pipe(prompt.confirm('Are you ready for Gulp?'))
	.pipe(gulp.dest('dest'));

```

Example when using options:
```javascript

gulp.src('test.js')
	.pipe(prompt.confirm({
		message: 'Continue?',
		default: true
	}))
	.pipe(gulp.dest('dest'));

```

## .prompt(questions, callback)

This is a clean pass-through function for gulp to utilize the full [Inquirer.js Library](https://github.com/SBoudrias/Inquirer.js), please refer to them for documentation on corresponding parameters.

Please note that all types are avaiable, not just the examples below.

Example Input:
```javascript

gulp.src('test.js')
	.pipe(prompt.prompt({
		type: 'input',
		name: 'task',
		message: 'Which task would you like to run?'
	}, function(res){
		//value is in res.task (the name option gives the key)
	}));

```

Example Checkbox:
```javascript

gulp.src('test.js')
	.pipe(prompt.prompt({
		type: 'checkbox',
		name: 'bump',
		message: 'What type of bump would you like to do?',
		choices: ['patch', 'minor', 'major']
	}, function(res){
		//value is in res.bump (as an array)
	}));

```

Example Password:
```javascript

gulp.src('test.js')
	.pipe(prompt.prompt({
		type: 'password',
		name: 'pass',
		message: 'Please enter your password'
	}, function(res){
		//value is in res.pass
	}));

```

Example Multiple:
```javascript

gulp.src('test.js')
	.pipe(prompt.prompt([{
		type: 'input',
		name: 'first',
		message: 'First question?'
	},
	{
		type: 'input',
		name: 'second',
		message: 'Second question?'
	}], function(res){
		//value is in res.first and res.second
	}));

```

Example Validation:
```javascript

gulp.src('test.js')
	.pipe(prompt.prompt({
		type: 'password',
		name: 'pass',
		message: 'Please enter your password',
		validate: function(pass){

			if(pass !== '123456'){
				return false;
			}

			return true;
		}
	}, function(res){
		//value is in res.pass
	}));

```

Example List Selection:
[Note: see sample file]( examples/list-selection-gulpfile.js)
```javascript

    gulp.src( './package.json' )
        .pipe( prompt.prompt({
            type:'list',
            name:'env',
            message:'Please enter selection?',
            choices: ['a','b','c','d','e','f', 'g', 'h'],
            pageSize:'3'
        }, (res) => {
            console.log('Result', res);
        }) );

```

Example Templating:
This was a fix to the issue #8 (https://github.com/Freyskeyd/gulp-prompt/issues/8)
[Note: see sample file]( examples/template-replacement-gulpfile.js)
```javascript

    return gulp.src( './package.json' )
        .pipe( prompt.confirm({
            type:'input',
            name:'env',
            message:'Hello <%= user %>, please enter selection?',
            templateOptions:{ 'user': 'fred' }
        }, (res) => {
            console.log('Result', res);
        }) );
```

Example Chaining Prompts:
This was a fix to the issue #35 (https://github.com/Freyskeyd/gulp-prompt/issues/35)
This was a fix to the issue #34 (https://github.com/Freyskeyd/gulp-prompt/issues/34)
[Note: see sample file]( examples/chain-confirm-gulpfile.js)
```javascript

	var index =0;

	var chainFunction = function ( options, resp ){
		console.log( 'Here is the selection ', resp);
		if( index <= 3){
			options.message = `Hello this is iteration ${index}`;
			index++;
			return options;
		}else{
			return;
		}
	};

	gulp.task( 'chainConfirm',  () => {
		return gulp.src( '../package.json' )
			.pipe( prompt.confirm({
				type:'input',
				name:'env',
				message:'Hello First interation, please enter selection?',
				chainFunction:chainFunction
			}, (res) => {
				console.log('Result', res);
			}) );
	});
```

This was a fix to the issue #60 (https://github.com/Freyskeyd/gulp-prompt/issues/60)
[Note: see sample file]( examples/chain-prompt-gulpfile.js)
```javascript

	var index =0;

	var chainFunction = function ( options, resp ){
		console.log( 'Here is the selection ', resp);
		if( index <= 3){
			options.message = `Hello this is iteration ${index}`;
			index++;
			return options;
		}else{
			return;
		}
	};

	gulp.task( 'chainConfirm',  () => {
		return gulp.src( '../package.json' )
			.pipe( prompt.prompt({
				type:'input',
				name:'env',
				message:'Hello First interation, please enter selection?',
				chainFunction:chainFunction
			}, (res) => {
				console.log('Result', res);
			}) );
	});
```

