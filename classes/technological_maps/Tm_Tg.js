class Tm_Tg
{
    constructor(mongoclient)
    {
        const techonological_maps = require("./Technological_Maps");
        this.Techonological_Maps = new techonological_maps.Technological_Maps(mongoclient);
        this.helpers = require("../Telegram/Helpers")
        const prices = require("../Prices/Prices");
        this.Prices = new prices.Prices(mongoclient); 
    }
    create_tm = (user_input, user_id , callback) => 
    {  
          const input_array = user_input.split("|");
          input_array[1] = input_array[1].split("\n");
          input_array[1].shift();
          let ingredients_array = [];
          input_array[1].forEach((element) => 
          {
  
            const get_inginfo = element.split(" ");
            ingredients_array.push({
              "name": get_inginfo[0].toLowerCase(),
              "brutto": get_inginfo[1],
              "netto": get_inginfo[2],
            })
          })
          this.Techonological_Maps.create({
            "name": input_array[0].trim().toLowerCase(),
            "ingredients": ingredients_array,
            "descriptions": input_array[2].replaceAll("\n","")
          }, (description,status) => 
          { 
           if (description == 'sucess' && status == 'sucessfuly')
             return callback(this.helpers.msg_handler("sucess_createtm"));
            else
              throw new Error("Ошибка при создании")
          })
     
    }
    delete_tm = (user_input,user_id,callback) => 
    {
         global.inputs['delete_tm'] = user_input;
         return callback(this.helpers.msg_handler("delete_tm_code"))
    }
    delete_tm_code = (user_input,user_id,callback) => 
    { 
           const get_code = require('../../main.json')['secret_code'];
           if (get_code == user_input)
           {
              this.Techonological_Maps.delete_by_name(global.inputs['delete_tm'].toLowerCase(), (description,status) => 
              {
               if (description == 'sucess' && status == 'sucessfuly')
                 return callback(this.helpers.msg_handler("sucess_deletetm"));
                else
                  throw new Error("Ошибка при создании")
              })
           }
           else
             throw new Error("Ошибка при удалении")
     
    }
    get_tm = (user_input, user_id , callback) => 
    {
             console.log(user_input);
             this.Techonological_Maps.get_by_name(user_input,(row,status) => 
             {
                if (status == 'sucessfuly')
                {
                 let ing_str = ''
                 row['ingredients'].forEach(ing_el => ing_str += `\n${ing_el['name']} | ${ing_el['brutto']} | ${ing_el['netto']}`  )
                 let get_msg = this.helpers.msg_handler('get_tm');
                 get_msg['msg'] = `${row['name']}|\n${ing_str}\n\n${row['descriptions']}`
                 return  callback(get_msg);
                }
                else
                 throw new Error("Ошибка при получении")
             })
    }
    get_change_tm = (user_input, user_id , callback) => 
    { 
        global.inputs['tm_to_change'] = user_input;
        return callback(this.helpers.msg_handler('what_to_change_tms'))
    }
    get_what_to_change_tms = (user_input, user_id , callback) => 
    {
        global.inputs['what_to_change_tms'] = user_input.toString();
        return callback(this.helpers.msg_handler('changing_tms'))
    }
    changing_tms = (user_input, user_id , callback) => 
    {
        if (global.inputs['what_to_change_tms'] == '1' || global.inputs['what_to_change_tms'] == '2')
        {
            this.Techonological_Maps.get_by_name(global.inputs['tm_to_change'],(row,status) => 
            {  
                if (status == 'sucessfuly' && row != null)
                {
                            if (global.inputs['what_to_change_tms'] == '1')
                            {
                              const input_array = user_input.split("\n")
                              let ingredients_array = [];
                              input_array.forEach((element) => 
                              { 
                                const get_inginfo = element.split(" ");
                                ingredients_array.push({
                                  "name": get_inginfo[0].toLowerCase(),
                                  "brutto": get_inginfo[1],
                                  "netto": get_inginfo[2],
                                })
                                row['ingredients'] = ingredients_array;
                              })
                            }
                            else
                              row['descriptions'] = user_input
                            this.Techonological_Maps.change_by_name(global.inputs['tm_to_change'], row , (description,status) => 
                            { 
                                  if (description == 'sucess' && status == 'sucessfuly')
                                    return callback(this.helpers.msg_handler('sucess_changingtms'));
                                  else 
                                    throw new Error("Ошибка при получении")
                            })  
                }
                else
                 throw new Error("Ошибка при получении")
               
            })
        } 
        else
                 throw new Error("Ошибка при получении")
    
    }
    get_tm_for_calculate = (user_input, user_id , callback) => 
    {
      const get_str = (str_callback) => 
      {
        this.Techonological_Maps.get_by_name(user_input, (tm_row,status) => 
          {
              if (tm_row != null && status ==  'sucessfuly')
              {
                let tm_str = '';
                tm_row['ingredients'].forEach((ingredient,index) => 
                 { 
                    console.log(ingredient);
                    
                    this.Prices.get_by_name(ingredient['name'].toLowerCase(), (prices_row,status) => 
                    {
                       if (status == 'sucessfuly')
                       {
                         if (prices_row == null)
                         {
                           console.log("null");
                           tm_str += `${ingredient['name']} | ${ingredient['brutto']} | ${ingredient['netto']} | x кг/руб\n`
                         }
                         else
                         {
                          tm_str += `${ingredient['name']} | ${ingredient['brutto']} | ${ingredient['netto']} |    ${parseFloat(prices_row['price']) *  (parseFloat(ingredient['brutto']) / 1000)} рублей\n`
    
                         }
                         if (index + 1 == tm_row['ingredients'].length)
                         {
                             return str_callback(`${tm_row['name']}|\n${tm_str}|${tm_row['descriptions']}`);
                         }  
                       }
                       else
                        throw new Error("Ошибка при Ошибка при получении Price")
    
                    })
                 }) 
              }
              else
               throw new Error("Ошибка при получении")
    
          })
      }
      get_str((tm_str) => 
      {
        let get_msg = this.helpers.msg_handler('get_tm'); 
        get_msg['msg'] = tm_str;
        console.log("tm_str:" ,  tm_str);
        return callback(get_msg);
      })

    }
    get_products_for_plan = (user_input,user_id,callback) => 
    { 
      const get_str = (str_callback) =>
      {
        let set_str = ''
        const input_array = user_input.split("\n");
        input_array.forEach((input_element,index) => 
        { 
          const get_info = input_element.split("|");
          this.Techonological_Maps.get_by_name(get_info[0].trim(), (row,status) => 
          {
            if (row != null && status == 'sucessfuly')
              {
                row['ingredients'].forEach((ingredients_el) => 
                {
                  set_str += `${ingredients_el['name']} | ${parseFloat(ingredients_el['brutto']) * get_info[1]}\n`         
                })
                if (index + 1 == input_array.length)
                {
                  return str_callback(set_str);
                }
              } 
              else
               throw new Error("Ошибка при получении")
          })
        })
      }
      get_str((str) => 
      { 
        let get_msg = this.helpers.msg_handler('get_tm_for_calculate');
        get_msg['msg'] = str
        return callback(get_msg);
      })
    }
}
module.exports = 
{
    Tm_Tg
}