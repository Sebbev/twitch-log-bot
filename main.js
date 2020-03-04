const tmi = require("tmi.js");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");
const options = require("./options.json");

const client = new tmi.client(options);

// Logs messages to a CSV file
const logMessage = (channel, username, message) => {
  const fileExist = () => {
    if (fs.existsSync(`./CSV/${channel}.csv`)) return true;
    else return false;
  };

  const csvWriter = createCsvWriter({
    path: `./CSV/${channel}.csv`,
    header: [
      {
        id: "date",
        title: "Date"
      },
      {
        id: "time",
        title: "Time"
      },
      {
        id: "timezone",
        title: "Timezone"
      },
      {
        id: "channel",
        title: "Channel"
      },
      {
        id: "username",
        title: "Username"
      },
      {
        id: "message",
        title: "Message"
      }
    ],
    append: fileExist()
  });

  // Wed Mar 04 2020 00:13:59 GMT+0100 (GMT+01:00)
  let timeObj = new Date();
  let date = `${timeObj.getUTCFullYear()}-${timeObj.getUTCMonth()}-${timeObj.getUTCDate()}`;
  let time = `${timeObj.getUTCHours()}.${timeObj.getUTCMinutes()}.${timeObj.getUTCSeconds()}`;
  let timezone = "UTC+00";

  const data = [
    {
      time,
      date,
      timezone,
      channel,
      username,
      message
    }
  ];

  csvWriter
    .writeRecords(data)
    .then(/* () => console.log("The CSV file was written successfully.") */)
    .catch(err => console.log(err));
};

client.connect();

client.on("connected", (address, port) => {
  //client.action("bassse", "Hello, bot is now connected! VoHiYo");
  console.log(`Successfully connected to ${address}:${port}`);
});

client.on("message", (channel, userstate, message, self) => {
  if (self) return;
  else logMessage(channel, userstate.username, message);

  switch (userstate["message-type"]) {
    // /me <message>
    case "action":
      break;
    // Normal chat message
    case "chat":
      break;
    // Normal whisper
    case "whisper":
      break;
    default:
      break;
  }
});
