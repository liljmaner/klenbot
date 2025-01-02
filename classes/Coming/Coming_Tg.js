class Coming_Tg
{
   constructor(mongoclient) 
   {
      const coming = require("./Coming");
      this.Coming = new coming.Coming(mongoclient);
      this.helpers = require("../Telegram/Helpers")
      this.moment = require("moment");
      const inventory = require("../Inventory/Inventory");
      this.Inventory = new inventory.Inventory(mongoclient);
      const prices = require("../Prices/Prices");
      this.Prices = new prices.Prices(mongoclient);
   }
   create_coming = (user_input, user_id, callback) => 
   {
    let products_array = [];
    const input_array = user_input.split("\n");
    const date = this.moment(input_array[0], 'DD-MM-YYYY').unix();;
    input_array.shift();
    input_array.forEach((element) => 
    { 
       
       const get_product =  element.split("|");
       products_array.push({
         "name": get_product[0].trim(),
         "weight": parseFloat(get_product[1].trim()),
         "price": parseFloat(get_product[2].trim()),
         "expiration_date": get_product[3].trim()
       })
    })
    this.Coming.create({
      "date": date,
      "products": products_array
    }, (description,status) =>
    {
      if (description == 'sucess' && status == 'sucessfuly')
      {
        const insert_into_prices = (get_productel,callback) => 
        {
          this.Prices.get_by_name(get_productel['name'], (row,status) => 
            {
                if (status == 'sucessfuly')
                {
                  if (row == null)
                  { 
                    this.Prices.create({
                     "name" :get_productel['name'],
                     "price": get_productel['price']
                    },(description,status) => 
                    {
                      if (description !=  'sucess' && status != 'sucessfuly')
                       throw new Error("[Ошибка при добавлении в прайсы] " + description);
                      else
                        callback("sucessfuly");
                    })
                  }
                  else
                  {
                    this.Prices.change_by_name(get_productel['name'], {
                      "name" :get_productel['name'],
                      "price": get_productel['price']
                     },(description,status) => 
                     {
                       if (description !=  'sucess' && status != 'sucessfuly')
                        throw new Error("[Ошибка при добавлении в пра йсы] " + description);
                       else
                        callback("sucessfuly");
                     })
                  }
                }
                else
                 throw new Error("Ошибка при получение имени для прайсов")
            })

        }

        this.Inventory.get_by_date(date,(row,status) => 
          {
            if (status ==  'sucessfuly')
            {
               console.log(row);
               if (row == null)
               {
                 products_array.forEach((element) => 
                  {
                    insert_into_prices(element, (status) =>
                    {
                       if (status == 'sucessfuly')
                        delete element['price'];
                    })
                  })
                 console.log(" == null")
                 this.Inventory.create({
                  "date": date,  
                  "inventory": products_array
                 },(description,status) =>
                 {
                  if (description == 'sucess' && status == 'sucessfuly')
                  return callback(this.helpers.msg_handler("sucess_createcoming"));
                  else
                   throw new Error("Ошибка при создании")
                 })
               }
               else
               {
                 products_array.forEach((products_el) => 
                 {
                  insert_into_prices(element, (status) =>
                  {
                    if (status == 'sucessfuly')
                    {
                      row['products'].forEach((row_productel,index) => 
                        {
                          let is_added = false;
                          if (products_el['name'] == row_productel['name'])
                          {
                            console.log("sucess");
                            row_productel['weight'] += products_el['weight'];
                            console.log(row_productel);
                            is_added = true;
                          }
                          if (is_added == false && index + 1 == row['products'].length)
                             row['products'].push({
                               "name": products_el['name'],
                               "weight": products_el['weight'],
                               "expiration_date": products_el['expiration_date']
                             })
                        })
                    }
                  })
                 })
                 this.Inventory.change_by_date(date,row,(description,status) =>
                 {
                  if (description == 'sucess' && status == 'sucessfuly')
                    return callback(this.helpers.msg_handler("sucess_createcoming"));
                  else
                   throw new Error("Ошибка при создании")
                 })
               }

            }
            else
              throw new Error("Ошибка при создании")
          })
      }
      else
        throw new Error("Ошибка при создании")
    })
   }
   get_coming_for_change = (user_input, user_id , callback) => 
   {
    const date_to_unix = this.moment(user_input, 'DD-MM-YYYY').unix()
    this.Coming.get_by_date(date_to_unix,(row,status) => 
    {
          if (status == 'sucessfuly' && row != null)
          {
           global.inputs['get_coming_for_change'] = date_to_unix;
           let coming_str = '';
           let get_msg = this.helpers.msg_handler("get_coming_for_change");
           row['products'].forEach((element,index) => coming_str += `\n${index}) ${element['name']}|${element['weight']}|${element['price']}|${element['expiration_date']}`);
           get_msg['msg'] = get_msg['msg'].replace("Data",coming_str);
           return callback(get_msg);
          }
          else 
           throw new Error('[Ошибка при получении]:' + row);
    })
   }
   get_data_coming_for_change = (user_input, user_id , callback) => 
   {
    this.Coming.get_by_date(global.inputs['get_coming_for_change'], (row,status) => 
    {  
          if (status == 'sucessfuly' && row != null)
          {
            const input_array = user_input.split("|").map((el) => el.trim());
            row['products'][split_input[0]] = 
            { 
               name: input_array[1],
               weight: parseFloat(input_array[2]),
               price: parseFloat(input_array[3]),
               expiration_date: input_array[4]      
            }
            this.Coming.change_by_date(row['date'],{
              "date": row['date'],
              "products": row['products']
            }, (description,status) => 
            {
               if (description ==  'sucess' && status == 'sucessfuly')
                   return callback(this.helpers.msg_handler('sucess_get_data_inventory_for_change'));
                 else
                  throw new Error("[Ошибка при изменении] " + description);
            })
          }
          else
            throw new Error('[Ошибка при получении]:' + row);
    })
   }
}

module.exports = 
{
    Coming_Tg
}