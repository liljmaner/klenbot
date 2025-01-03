const TelegramBot = require('node-telegram-bot-api');
const MainJson = require("./main.json");
const bot = new TelegramBot(MainJson.API_KEY_BOT, {
    polling: true
});

global.phase = { };
global.inputs = { }; 
const textphase = require("./classes/Telegram/Text_Phase");
const TextPhase = new textphase.Text_Phase();

const callbackphase = require("./classes/Telegram/Callback_Phase");
const CallbackPhase = new callbackphase.Callback_Phase();

bot.on('text', (msg) => 
{ 
  try
  { 
    if (msg.text == '/start')
    {
        TextPhase.start_page(msg.from.id,(msg_obj) => {
            bot.sendMessage(msg.chat.id,msg_obj['msg'],msg_obj['msg_options'])
        });
    }
    else
    {
       TextPhase.call_func("input_phase",msg.text,msg.from.id,(get_msg) => 
       {
        if (get_msg['data'] != null && typeof(get_msg['data']) != 'undefined')
          get_msg['msg'] = get_msg['data'] + '\n' + get_msg['msg']; 
        bot.sendMessage(msg.chat.id,get_msg['msg'],get_msg['msg_options'])
       });
    }
  }
  catch(err)
  {
    console.log(err);
  }
})
bot.on('callback_query', (ctx) => 
{ 
  CallbackPhase.call_func(ctx.data,(get_msg) => 
  {
  
    bot.sendMessage(ctx.message.chat.id,get_msg['msg'],get_msg['msg_options'])
  });
})
bot.on('polling_error', (error) => {
  console.log(`[polling_error] ${error.code}: ${error.message}`);
});
console.log("bot on run");