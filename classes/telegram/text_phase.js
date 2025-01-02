class Text_Phase
{
   constructor()
   { 
       this.helpers = require("./Helpers");
       const MongoClient = require("mongodb").MongoClient;
       const client = new MongoClient("mongodb://127.0.0.1:27017/");
       client.connect().then(mongoclient=>
       {
         const users = require("../Users/Users");
         this.Users = new users.Users(mongoclient); 
       });
   }
   start_page =  (user_id, callback) => 
   { 
     this.Users.get_by_userid(user_id, (row,status) => 
      {
               if (status == 'sucessfuly')
               {
                 if (row != null && typeof(row) != 'undefined')
                 {
                    this.helpers.set_to_zero();
                    return callback(this.helpers.msg_handler('main_msg'));
                 }
                 return callback(this.helpers.msg_handler("welcome_msg"));
               } 
               else
                return callback(this.helpers.msg_handler('error_msg'));
      }) 
  }
  call_func = (str,user_input, user_id,callback) => 
  { 
     if (str == 'input_phase')
     {
         for (const keys_phase in global.phase) 
         {
            if (global.phase[keys_phase] == 1)
            {
               const input_phase = require("./Input_Phase");
               const Input_Phase = new input_phase.Input_Phase();
               Input_Phase.call_func(keys_phase,user_input,user_id,(input_callback) => callback(input_callback) );
               global.phase[keys_phase] = 0; 
            }
         }   
     }
     else
     {
      eval("this." + str + "()");

     }
  }
}
module.exports  = 
{ 
    Text_Phase
}