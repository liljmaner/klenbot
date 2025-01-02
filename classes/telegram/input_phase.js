class Input_Phase
{
   constructor()
   {
         this.helpers = require("./Helpers");
   }
   reg_account = (user_input,user_id,callback) => this.Users_Tg.reg_account(user_input,user_id,(msg_callback) => callback(msg_callback));
   create_sale = (user_input,user_id,callback) => this.Sales_Tg.create_sale(user_input,user_id,(msg_callback) => callback(msg_callback) );
   insert_sale_static = (user_input,user_id,callback) => this.Sales_Tg.insert_sale_static(user_input,user_id,(msg_callback) => callback(msg_callback) );
   create_tm = (user_input, user_id , callback) => this.Tm_Tg.create_tm(user_input,user_id,(msg_callback) => callback(msg_callback) );
   delete_tm = (user_input,user_id,callback) => this.Tm_Tg.delete_tm(user_input,user_id,(msg_callback) => callback(msg_callback));
   delete_tm_code = (user_input,user_id,callback) => this.Tm_Tg.delete_tm_code(user_input,user_id,(msg_callback) => callback(msg_callback));
   get_tm = (user_input, user_id , callback) => this.Tm_Tg.get_tm(user_input,user_id,(msg_callback) => callback(msg_callback));
   get_change_tm =  (user_input, user_id , callback) => this.Tm_Tg.get_change_tm(user_input,user_id,(msg_callback) => callback(msg_callback));
   get_tm_for_calculate =  (user_input, user_id , callback) => this.Tm_Tg.get_tm_for_calculate(user_input,user_id,(msg_callback) => callback(msg_callback));
   get_what_to_change_tms = (user_input, user_id , callback) => this.Tm_Tg.get_what_to_change_tms(user_input,user_id,(msg_callback) => callback(msg_callback));
   changing_tms = (user_input, user_id , callback) => this.Tm_Tg.changing_tms(user_input,user_id,(msg_callback) => callback(msg_callback));
   get_products_for_plan = (user_input, user_id , callback) => this.Tm_Tg.get_products_for_plan(user_input,user_id,(msg_callback) => callback(msg_callback));
   create_inventory = (user_input, user_id , callback) =>  this.Inventory_Tg.create_inventory(user_input,user_id,(msg_callback) => callback(msg_callback));
   get_inventory = (user_input, user_id , callback) => this.Inventory_Tg.get_inventory(user_input,user_id,(msg_callback) => callback(msg_callback));
   get_inventory_for_change = (user_input, user_id, callback) => this.Inventory_Tg.get_inventory_for_change(user_input,user_id,(msg_callback) => callback(msg_callback));
   get_data_inventory_for_change = (user_input, user_id, callback) => this.Inventory_Tg.get_data_inventory_for_change(user_input,user_id,(msg_callback) => callback(msg_callback));
   create_coming = (user_input, user_id, callback) => this.Coming_Tg.create_coming(user_input,user_id,(msg_callback) => callback(msg_callback));
   get_coming_for_change = (user_input, user_id, callback) => this.Coming_Tg.get_coming_for_change(user_input,user_id,(msg_callback) => callback(msg_callback));
   get_data_coming_for_change  = (user_input, user_id, callback) => this.Coming_Tg.get_data_coming_for_change(user_input,user_id,(msg_callback) => callback(msg_callback));
   create_writeoff = (user_input, user_id, callback) => this.Write_Off.create_writeoff(user_input,user_id,(msg_callback) => callback(msg_callback));
   show_writeoff =  (user_input, user_id, callback) => this.Write_Off.show_writeoff(user_input,user_id,(msg_callback) => callback(msg_callback));
   get_writeoff_for_change = (user_input, user_id, callback) => this.Write_Off.get_writeoff_for_change(user_input,user_id,(msg_callback) => callback(msg_callback));
   get_data_writeoff_for_change = (user_input, user_id, callback) => this.Write_Off.get_data_writeoff_for_change(user_input,user_id,(msg_callback) => callback(msg_callback));
   call_func = (str,user_input,user_id,callback) =>
   {
    const MongoClient = require("mongodb").MongoClient;
    const client = new MongoClient("mongodb://127.0.0.1:27017/");
    client.connect().then(mongoclient=>
    {
         const users_tg = require('../Users/Users_Tg');
         this.Users_Tg = new users_tg.Users_Tg(mongoclient);


         const sales_tg = require("../Sales/Sales_Tg");
         this.Sales_Tg = new sales_tg.Sales_Tg(mongoclient);

         const tm_tg = require("../Technological_Maps/Tm_Tg");
         this.Tm_Tg = new tm_tg.Tm_Tg(mongoclient);

         const inventory_tg = require("../Inventory/Inventory_Tg");
         this.Inventory_Tg = new inventory_tg.Inventory_Tg(mongoclient);

         const write_off = require("../Write_Off/WriteOff_Tg");
         this.Write_Off = new write_off.WriteOff_Tg(mongoclient);

         const coming_tg = require("../Coming/Coming_Tg");
         this.Coming_Tg = new coming_tg.Coming_Tg(mongoclient);
         console.log("this." + str + "(" + "`" + user_input.toString() + "`" + "," + user_id  + ", (func_callback) =>  callback(func_callback))");
         eval("this." + str + "(" + "`" + user_input.toString() + "`" + "," + user_id  + ", (func_callback) =>  callback(func_callback))");
    }) 
    .catch((err) => {
      callback(this.helpers.msg_handler('error_msg'))
      console.log("[catch_err] " + err );
    })
   }
}
module.exports = 
{
    Input_Phase
}