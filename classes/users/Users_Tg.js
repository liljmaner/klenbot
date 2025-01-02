
class Users_Tg
{
    constructor(mongoclient) 
    {
        const users = require("./Users");
        this.Users = new users.Users(mongoclient);
        this.helpers = require("../Telegram/Helpers")
    }
    reg_account = (user_input,user_id,callback) => 
    {
          this.Users.create({
            "user_id": user_id,
            "role": user_input,
          },(description,status) => 
          { 
           if (description == 'sucess' && status == 'sucessfuly')
               return callback(this.helpers.msg_handler("main_msg"));
           else
             throw new Error("Ошибка при создании")
          }) 
    }
}
module.exports = 
{
    Users_Tg
}