const TelegramBot = require('node-telegram-bot-api')

const axios = require('axios');

const token = '5353212783:AAFZjoM7_CmjMS6R1yDLm91-VAhmEQLBSdU';

const appID = 'bf68600283df34644557cae9662b0f5d';

const apiWithYourCity  = (city) => (
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${appID}`
  );
  
  
  const displayWeather  = (name, main, weather, wind, clouds) => (
      `The weather in <b>${name}</b>:
      <b>${weather.main}</b> - ${weather.description}
      Temperature: <b>${main.temp} °C</b>
      Pressure: <b>${main.pressure} hPa</b>
      Humidity: <b>${main.humidity} %</b>
      Wind: <b>${wind.speed} meter/sec</b>
      Clouds: <b>${clouds.all} %</b>
  `
  );
  

  const bot = new TelegramBot(token, {
    polling: true
  });
  
 
  function weatherInYourPoint(chatId, city){
    const endpoint = apiWithYourCity (city);
  
    axios.get(endpoint).then((resp) => {
      const {
        name,
        main,
        weather,
        wind,
        clouds
      } = resp.data;
  
      bot.sendMessage(
        chatId,
        displayWeather (name, main, weather[0], wind, clouds), {
          parse_mode: "HTML"
        }
      );
    }, error => {
      console.log("error", error);
      bot.sendMessage(
        chatId,
        `Ooops...I couldn't be able to get weather for <b>${city}</b>`, {
          parse_mode: "HTML"
        }
      );
    });
  }
  

  bot.onText(/\/weather/, (msg, match) => {
    const chatId = msg.chat.id;
    const city = match.input.split(' ')[1];
    
    if (city === undefined) {
      bot.sendMessage(
        chatId,
        `Please provide city name`
      );
      return;
    }
    weatherInYourPoint(chatId, city);
  });

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      `Welcome at <b>weatherAppDs</b>, thank you,${msg.chat.first_name} for using my service
      
        Available commands:
      /weather <b>city</b> - shows weather for selected <b>city</b>
    `, {
        parse_mode: "HTML"
      }
    );
  
    bot.setMyCommands([
      { command: '/start', description: 'Start bot' },
      {command:'/weather',description:'Search your weather'},
    ]);
  
  });