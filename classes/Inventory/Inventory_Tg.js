class Inventory_Tg
{
   constructor(mongoclient) 
   {
      const inventory = require("./Inventory");
      this.Inventory = new inventory.Inventory(mongoclient);
      this.helpers = require("../Telegram/Helpers")
      this.moment = require("moment");

   }
   create_inventory = (user_input,user_id,callback) => 
   {
    const input_array = user_input.split("\n");
    const get_date = this.moment(input_array[0], 'DD-MM-YYYY').unix(); 
    input_array.shift();
    console.log(input_array);
    const get_inventoryel = input_array.map((element) => {
          const split_element = element.split("|");
          return {
               "name": split_element[0].trim(),
               "weight": parseFloat(split_element[1].trim()),
               "expiration_date": split_element[2].trim(),
          }
    })
    this.Inventory.create({
       "date": get_date, 
       "products": get_inventoryel 
    }, (description,status) => 
    { 
       if (description ==  'sucess' && status == 'sucessfuly')
         return callback(this.helpers.msg_handler('sucess_createinventory'));
       else
        throw new Error("[Ошибка при создании инвентаризации] " + description);
    })
   }
   get_inventory = (user_input, user_id, callback) => { 
    let input_array = user_input.split("-");
    const from = this.moment(input_array[0],'DD-MM-YYYY').unix();
    const to = this.moment(input_array[1],'DD-MM-YYYY').unix();
    this.Inventory.filter_by_date(from,to,(rows, status) => 
    {
      if (status == 'sucessfuly' && rows != null) {
        let get_msg = this.helpers.msg_handler("get_inventory");
        let get_str = get_msg['msg'].slice(0,25) + " Data";
        let inventory_str = '';
        rows.forEach((row_element) => 
          {
             inventory_str += `\n${this.moment.unix(row_element['date']).format("DD.MM.YYYY")}`
             row_element['products'].forEach((inventory_el) => 
             {
              inventory_str += `\n${inventory_el['name']} | ${inventory_el['weight']} | ${inventory_el['expiration_date']}`;
             })
             inventory_str += '\n\n\n';
          })
        get_msg['msg'] = get_str.replace("Data", inventory_str);
        return callback(get_msg);
      }
      else
      {
        throw new Error("Ошибка при получении")
      }
    })
   }
   get_inventory_for_change = (user_input, user_id, callback) => 
   { 
    global.inputs['get_inventory_for_change'] = this.moment(user_input, 'DD-MM-YYYY').unix(); 
     this.Inventory.get_by_date(global.inputs['get_inventory_for_change'],(row,status) => 
     {
       if (status == 'sucessfuly' && row != null)
       {
        let inventory_str = '';
        let get_msg = this.helpers.msg_handler("get_inventory_for_change");
        row['products'].forEach((element,index) => inventory_str += `\n${element['name']}|${element['weight']} | ${element['expiration_date']}`      );
        get_msg['msg'] =  get_msg['msg'].slice(0,288) +  inventory_str  ;
        return callback(get_msg);
       }
       else 
        throw new Error('[Ошибка при получении]:' + row);
     })
   }
   get_data_inventory_for_change = (user_input, user_id, callback) => 
   { 
     this.Inventory.get_by_date(global.inputs['get_inventory_for_change'], (row,status) => 
     {  
       if (status == 'sucessfuly' && row != null)
       {
         const input_array = user_input.split(" ")
         input_array.forEach((input_el) => input_el.trim())
         console.log(input_array);
         if (input_array[1] == '*')
         {
          row['products'] = row['products'].filter((filter_el) => filter_el['name'] != input_array[0])
          console.log(row['products']);
         }
         else
         { 
           const get_index = row['products'].reduce((reduce_acc, reduce_el, reduce_index) => {
             if (reduce_el.name == input_array[0]) {
               reduce_acc.push(reduce_index);
             }
             return reduce_acc;
            }, [])
            if (get_index.length != 0)
              row['products'][get_index[0]] = 
              { 
               "name": input_array[0],
               "weight": input_array[1],
               "expiration_date": input_array[2],
              }
            else
              row['products'].push(
                {
                  "name": input_array[0],
                  "weight": input_array[1],
                  "expiration_date": input_array[2],
                })
         }
         this.Inventory.change_by_date(global.inputs['get_inventory_for_change'],row,(description,status) => 
          { 
             if (description ==  'sucess' && status == 'sucessfuly')
               return callback(this.helpers.msg_handler('sucess_get_data_inventory_for_change'));
             else
              throw new Error("[Ошибка при создании инвентаризации] " + description);
          })
       }
       else
         throw new Error('[Ошибка при получении]:' + row);
     })
   }

}

module.exports = 
{
    Inventory_Tg
}