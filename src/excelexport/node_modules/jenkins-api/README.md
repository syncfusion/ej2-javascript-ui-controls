nodejs-jenkins-api
=================
<p align="center">
  <a href="https://npmjs.org/package/jenkins-api">
    <img src="https://img.shields.io/npm/v/jenkins-api.svg" alt="NPM Version">
  </a>
  <a href="https://npmjs.org/package/jenkins-api">
    <img src="https://img.shields.io/npm/dm/jenkins-api.svg" alt="NPM downloads">
  </a>
  <a href="http://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/npm/l/nodejs-jenkins-api.svg" alt="License">
  </a>
  <a href="https://github.com/jansepar/node-jenkins-api/issues">
    <img src="https://img.shields.io/github/issues/jansepar/node-jenkins-api.svg" alt="Github Issues">
  </a>
</p>

## Install

<pre>
npm install jenkins-api
</pre>

## Usage

### Setup

```javascript
var jenkinsapi = require('jenkins-api');

// no auth
var jenkins = jenkinsapi.init("http://jenkins.yoursite.com");

// username/password
var jenkins = jenkinsapi.init("http://username:password@jenkins.yoursite.com");

// API Token
var jenkins = jenkinsapi.init('https://username:token@jenkins.company.com');

```

If you need additional request parameters you can add them as explained in 'optional' section.


### Builds

#### build
```javascript
jenkins.build('job-in-jenkins', (optional){token: 'jenkins-token', ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### build_with_params
```javascript
jenkins.build_with_params('job-in-jenkins', (optional){depth: 1, <param>:<value>, token: 'jenkins-token',...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### stop build
```javascript
jenkins.stop_build('job-in-jenkins', 'build-number', (optional){token: 'jenkins-token', ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### console output
```javascript
jenkins.console_output('job-in-jenkins', 'buildname', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### build info
```javascript
jenkins.build_info('job-in-jenkins', 'build-number', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### last build info
```javascript
jenkins.last_build_info('job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### last completed build info
```javascript
jenkins.last_completed_build_info('job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### all builds
```javascript
jenkins.all_builds('job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### test result/report
```javascript
jenkins.test_result('job-in-jenkins', 'build-number', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### last build report - OBSOLET use `last_build_info`
```javascript
// jenkins.last_build_report('job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
//   if (err){ return console.log(err); }
//   console.log(data)
// });
```

#### delete build data for job
```javascript
jenkins.delete_build('job-in-jenkins', 'build-number', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```


### Jobs

#### all jobs
```javascript
jenkins.all_jobs((optional){token: 'jenkins-token', ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### get config xml
```javascript
jenkins.get_config_xml('job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

### update existing job configuration
```javascript
jenkins.update_config('job-to-update'
                ,function(config) {
                    // function which takes the config.xml, and returns
                    // the new config xml for the new job
                    return config.replace('development','feature-branch');
                }
                ,(optional){token: 'jenkins-token', ...}
                ,function(err, data) {
                      // if no error, job was copied
                      if (err){ return console.log(err); }
                      console.log(data)
                });
```

#### update job
```javascript
jenkins.update_job('job-to-update', xmlConfigString, (optional){token: 'jenkins-token', ...}, function(err, data) {
  // if no error, job was copied
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### job info
```javascript
jenkins.job_info('job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### create job
```javascript
jenkins.create_job('job-in-jenkins', xmlConfigString, (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### copy job
```javascript
jenkins.copy_job('job-to-copy'
                ,'new-job-title'
                ,function(config) {
                    // function which takes the config.xml, and returns
                    // the new config xml for the new job
                    return config.replace('development','feature-branch');
                }
                ,(optional){token: 'jenkins-token', ...}
                ,function(err, data) {
                      // if no error, job was copied
                      if (err){ return console.log(err); }
                      console.log(data)
                });
```

#### delete job
```javascript
jenkins.delete_job('job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### enable job
```javascript
jenkins.enable_job('job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### disable job
```javascript
jenkins.disable_job('job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### last success
```javascript
jenkins.last_success('job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### last result
```javascript
jenkins.last_result('job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```


### Queue

#### get all queued items
```javascript
jenkins.queue((optional){token: 'jenkins-token', ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### get one queued item
```javascript
jenkins.queue_item('queue-item-number', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### cancel queued item
```javascript
jenkins.cancel_item('queue-item-number', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### get all jenkins computers (aka workers)
```javascript
jenkins.computers((optional){token: 'jenkins-token', ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```


### Views

#### get all views
```javascript
jenkins.all_views((optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
      if (err){ return console.log(err); }
        console.log(data)
});
```

#### create view
```javascript
jenkins.create_view('new-view-name', (optional)viewMode = 'hudson.model.ListView', (optional){token: 'jenkins-token', ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### view info
```javascript
jenkins.create_view('view-name', (optional){token: 'jenkins-token', ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### update view
```javascript
var viewConfig = {
            name: "view-in-jenkins",
            "description": "This is the view-in-jenkins View",
            "statusFilter": "",
            "job-in-jenkins": true,
            "useincluderegex": true,
            "includeRegex": "prefix.*",
            "columns": [{"stapler-class": "hudson.views.StatusColumn", "$class": "hudson.views.StatusColumn"}, {"stapler-class": "hudson.views.WeatherColumn", "$class": "hudson.views.WeatherColumn"}, {"stapler-class": "hudson.views.JobColumn", "$class": "hudson.views.JobColumn"}, {"stapler-class": "hudson.views.LastSuccessColumn", "$class": "hudson.views.LastSuccessColumn"}, {"stapler-class": "hudson.views.LastFailureColumn", "$class": "hudson.views.LastFailureColumn"}, {"stapler-class": "hudson.views.LastDurationColumn", "$class": "hudson.views.LastDurationColumn"}, {"stapler-class": "hudson.views.BuildButtonColumn", "$class": "hudson.views.BuildButtonColumn"}]
        };

jenkins.update_view('view-in-jenkins', viewConfig, (optional){token: 'jenkins-token', ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### delete view
```javascript
jenkins.delete_view('view-in-jenkins', (optional){token: 'jenkins-token', ...}, function(err, data) {
  if (err){ return console.log(err); }
  console.log(data)
});
```

#### add job to view
```javascript
jenkins.add_job_to_view('view-in-jenkins', 'job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
      if (err){ return console.log(err); }
        console.log(data)
});
```

#### remove job from view
```javascript
jenkins.remove_job_from_view('view-in-jenkins', 'job-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
      if (err){ return console.log(err); }
        console.log(data)
});
```

#### get all jobs in view
```javascript
jenkins.all_jobs_in_view('view-in-jenkins', (optional) {depth: 1, <param>:<value>, ...}, function(err, data) {
      if (err){ return console.log(err); }
        console.log(data)
});
```


### Plugins

#### get all installed plugins
```javascript
jenkins.all_installed_plugins((optional){token: 'jenkins-token', ...}, function(err, data){
    if (err){ return console.log(err); }
    console.log(data)
})
```

#### install a plugin
```javascript
// var plugin = 'copyartifact@1.3.8';
var plugin = 'copyartifact@current';
jenkins.install_plugin(plugin, (optional){token: 'jenkins-token', ...}, function(err, data){
    if (err){ return console.log(err, data); }
    console.log(data)
});
```
NOTE: It will report successful even if the plugin is already installed.
NOTE: Prevent Cross Site Request Forgery exploits need be disabled in Configure Global Security.



## Default configuration

You can set the default configuration which will be use in all HTTP requests by calling init with the additional options parameter:

```javascript
// default request options
var jenkins = jenkinsapi.init("http://jenkins.yoursite.com", {strictSSL: false});
```

Futhermore, you can set your remote job token for authentication:

```javascript
// default request options
var jenkins = jenkinsapi.init("http://jenkins.yoursite.com", {strictSSL: false}, '<job_token_here>');
```

Since node-jenkins-api uses [request/request](https://github.com/request/request) as HTTP client, please refer to the documentation for available options.


## Notes

Modeled after the [Python Jenkins API](https://github.com/txels/autojenkins)

