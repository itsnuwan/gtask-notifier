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

### Test run and setup initial google auth token

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

## License

Copyright (c) 2019 year, Nuwan Attanayake <its4nuwan@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
