class Callback_Phase
{
   constructor()
   {
        this.helpers = require("./Helpers");
   }
   sales = (callback) => callback(this.helpers.msg_handler('sales'));
   reg_phase = (callback) => callback(this.helpers.msg_handler('reg_msg'));
   create_sales = (callback) => callback(this.helpers.msg_handler('create_sales'));
   main_msg = (callback) =>
   {
      this.helpers.set_to_zero();
      callback(this.helpers.msg_handler('main_msg'));
   }
   statics_sales = (callback) => callback(this.helpers.msg_handler('statics_sales'));
   technological_maps = (callback) => callback(this.helpers.msg_handler('technological_maps'));
   create_tms = (callback) => callback(this.helpers.msg_handler('create_tms'));
   inventory = (callback) => callback(this.helpers.msg_handler('inventory'));
   create_inventory = (callback) => callback(this.helpers.msg_handler('create_inventory'));
   show_inventory = (callback) => callback(this.helpers.msg_handler('show_inventory'));
   change_inventroy = (callback) => callback(this.helpers.msg_handler('change_inventroy'));
   coming = (callback) => callback(this.helpers.msg_handler('coming'));
   create_coming = (callback) => callback(this.helpers.msg_handler('create_coming'));
   change_coming = (callback) => callback(this.helpers.msg_handler('change_coming'));
   write_off = (callback) => callback(this.helpers.msg_handler('write_off'));
   create_writeoff = (callback) => callback(this.helpers.msg_handler('create_writeoff'));
   show_writeoff = (callback) => callback(this.helpers.msg_handler('show_writeoff'));
   change_writeoff = (callback) => callback(this.helpers.msg_handler('change_writeoff'));
   return_to_main  = (callback) => 
   {
     this.helpers.set_to_zero();
     callback(this.helpers.msg_handler('main_msg'));
   }
   plan_products_tms = (callback) => callback(this.helpers.msg_handler('plan_products_tms'));
   show_tms = (callback) => { 
    const MongoClient = require("mongodb").MongoClient;
    const client = new MongoClient("mongodb://127.0.0.1:27017/");
    client.connect().then(mongoclient=>{
      const techonological_maps = require("../Technological_Maps/Technological_Maps");
      this.Techonological_Maps = new techonological_maps.Technological_Maps(mongoclient);
      this.Techonological_Maps.get((row,status) => 
      { 
         if (status == 'sucessfuly')
         {
            let tm_str = ''; 
            row.forEach((element) =>
            {
                 tm_str += '\n' + element['name']
            });
            console.log(tm_str);
            let get_msg = this.helpers.msg_handler('show_tms');
            let get_str = get_msg['msg'].slice(0,64) + "Data";
            get_msg['msg'] =  get_str.replaceAll("Data",tm_str);
            return callback(get_msg)
         }
         else
          throw new Error("Ошибка при создании")

      })
    })
    .catch((err) => {
      callback(this.helpers.msg_handler('error_msg'))
      console.log("[catch_err] " + err );
    })
   };
   change_tms = (callback) => 
   { 
     this.show_tms((get_msg) => 
     { 
        global.phase['get_tm'] = 0;
        global.phase['get_change_tm'] = 1;
        return callback(get_msg);
     } )
   }
   calculator_tms = (callback) =>   this.show_tms((get_msg) => 
      { 
         global.phase['get_tm'] = 0;
         global.phase['get_tm_for_calculate'] = 1;
         return callback(get_msg);
      });
   delete_tms = (callback) => callback(this.helpers.msg_handler('delete_tms'));
   call_func = (str,callback) => eval("this." + str + "( (callback_msg) => callback(callback_msg) )");
}
module.exports = 
{ 
    Callback_Phase
}