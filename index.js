const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// Email address to receive list of tasks
const TO_EMAIL = 'its4nuwan@gmail.com';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/tasks.readonly',
    'https://www.googleapis.com/auth/gmail.send'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile(__dirname+'/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Tasks API.
    authorize(JSON.parse(content), listTaskLists);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uri} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uri);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the user's first 10 task lists.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listTaskLists(auth) {
  const service = google.tasks({version: 'v1', auth});
  service.tasklists.list({
    maxResults: 10,
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const taskLists = res.data.items;
    if (taskLists) {
      listTasks(auth, taskLists);
    } else {
      console.log('No task lists found.');
    }
  });
}

/**
 * Lists the user's first 50 tasks of the all tasks lists.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param tasks lists from google tastlists/get api
 */
function listTasks(auth, taskLists) {
  const service = google.tasks({version: 'v1', auth});

  taskLists.forEach( (taskList)=>{
    service.tasks.list({
      tasklist: taskList.id,
      maxResults: 50,
    }, (err, res) => {
      if (err) return console.error('The API returned an error: ' + err);
      const tasks = res.data.items;
      sendMessage(auth, tasks);
    });
  });
}


/*
 * create email body to be sent
 * @param to email address
 * @param from email address
 * @subject Subject line for the email
 * @tasks Array of google task items
 */
function makeBody(to, from, subject, tasks) {

  var htmlBody = '<h3>My Todos</h3><ul>';
  tasks.forEach( (task)=>{
    htmlBody += `<li>${task.title}</li>`;
  })

  var str = ["Content-Type: text/html; charset=\"UTF-8\"\n",
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      "to: ", to, "\n",
      "from: ", from, "\n",
      "subject: ", subject, "\n\n",
      htmlBody
  ].join('');
  var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
      return encodedMail;
}

/*
 * Send email message with given tasks
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param Array of google tasks
 */
function sendMessage(auth, tasks) {
  const service = google.gmail({version: 'v1', auth});
  var raw = makeBody(TO_EMAIL, '', 'You got some work to do man!', tasks);
  service.users.messages.send({
      auth: auth,
      userId: 'me',
      resource: {
          raw: raw
      }
  }, function(err, response) {
      if(err)console.log(err);
  });
}