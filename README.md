# Gtask notifier

Generate email notification for google tasks/todos

## Features
- Generate email notification about your pending tasks(todos)
- Configure required notification frequency and time(Daily at 8.30AM)
- Configure email address which to receive notification

# Configure

### Install dependencies
```
yarn
```

### Set Google API credentials

Create a file `credentials.json` (or rename credentials.json.dist) with Google API credentials

Read more about [google api credentials](https://console.cloud.google.com/apis/credentials)
Read more about [how to turn on Google task API](https://developers.google.com/tasks/quickstart/apps-script)

### Test run

```
node /path/to/gtask-notifier/index.js YOUREMAIL@DOMAIN.COM
```

### Setup CRON Job for frequent email notification

```
crontab -e

```
Insert below line to execute the script daily at 8:30AM
```
30 8 * * * node /path/to/gtask-notifier/index.js YOUREMAIL@DOMAIN.COM
```