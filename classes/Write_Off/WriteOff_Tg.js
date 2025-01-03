class WriteOff_Tg
{
    constructor(mongoclient) 
    {
       const write_off = require("./Write_Off");
       this.Write_Off = new write_off.Write_Off(mongoclient);
       this.helpers = require("../Telegram/Helpers")
       this.moment = require("moment");
       const inventory = require("../Inventory/Inventory");
       this.Inventory = new inventory.Inventory(mongoclient);
    }
    create_writeoff = (user_input,user_id,callback) => 
    { 
        console.log("1");
        const input_array = user_input.split("\n");
        const date = this.moment(input_array[0], 'DD-MM-YYYY').unix();
        let product_array = [];
        input_array.shift();
        console.log(input_array);
        input_array.forEach((element) =>
        {
          console.log(element);
          const get_product = element.split("|");
          product_array.push({
             "name": get_product[0].trim().toLowerCase(),
             "reason": get_product[1].trim(),
          })
          this.Inventory.get_by_date(date,(row,status) => 
          { 
              console.log(row);
              if (row != null && status == 'sucessfuly' )
              {
                const get_filtred = row['products'].filter((element) => element['name'].toLowerCase() != get_product[0].trim().toLowerCase())
                console.log(get_filtred);
                this.Inventory.change_by_date(date, {
                    "date": date,
                    'products': get_filtred
                }, (description,status) => 
                { 
                    if (description == 'sucess' && status == 'sucessfuly')
                    {
                        this.Write_Off.create({
                            "date": date,
                            "products": product_array
                        }, (description,status) => 
                        {
                            if (description == 'sucess' && status == 'sucessfuly')
                                return callback(this.helpers.msg_handler("sucess_createwriteoff"));
                               else
                                 throw new Error("Ошибка при создании")
                        })
                    }
                    else
                     throw new Error("[Ошибка при изменнении]" + description)

                })
              }
              else
               throw new Error("Ошибка при создании")
    
          })
        })
    }
    show_writeoff = (user_input,user_id,callback) => 
    {
        const input_array = user_input.split("-");
        const from = this.moment(input_array[0],'DD-MM-YYYY').unix();
        const to = this.moment(input_array[1],'DD-MM-YYYY').unix();
        this.Write_Off.filter_by_date(from,to,(rows,status) => 
        { 
            if (status == 'sucessfuly')
            {
                let get_msg = this.helpers.msg_handler("get_writeoff");
                let writeoff_str = '';
                rows.forEach((row_element) => 
                {
                   row_element['products'].forEach((product_el) => 
                   {
                    writeoff_str += `\n${this.moment.unix(row_element['date']).format('DD.MM.YYYY')} | ${product_el['name']} | ${product_el['reason']}`;
                })
                })
                get_msg['data'] = writeoff_str
                return callback(get_msg);
            }
            else
             throw new Error("Ошибка при создании")

        })
    }
    get_writeoff_for_change = (user_input,user_id,callback) => 
    {
        global.inputs['get_writeoff_for_change'] = this.moment(user_input, 'DD-MM-YYYY').unix()
        this.Write_Off.get_by_date(global.inputs['get_writeoff_for_change'], (row,status) => 
        { 
              if (row != null && status == 'sucessfuly')
              {
                let get_msg = this.helpers.msg_handler("get_writeoff_for_change");
                get_msg['data'] = row['products'].reduce((accumulator, element, index) => {
                    return accumulator + `\n${index}) ${element['name']} | ${element['reason']}`;
                }, '');
                return callback(get_msg);
             }
              else
               throw new Error("Ошибка при получении")
 
        })
    }
    get_data_writeoff_for_change = (user_input,user_id,callback) =>  
    {
        this.Write_Off.get_by_date(global.inputs['get_writeoff_for_change'], (row,status) => 
        {
            if (row != null && status == 'sucessfuly')
            {
                const input_array = user_input.split("|");
                row['products'][parseInt(input_array[0])] = 
                { 
                    "name": input_array[1].trim().toLowerCase(),
                    "reason": input_array[2].trim(),
                }
                console.log(row)
                this.Write_Off.change_by_date(global.inputs['get_writeoff_for_change'],row,(description,status) => 
                {
                    if (description == 'sucess' && status == 'sucessfuly')
                        return callback(this.helpers.msg_handler("sucess_changewriteoff"));
                       else
                         throw new Error("Ошибка при создании")
                })
            }
            else
                 throw new Error("Ошибка при получении")
        } )
    }

}
module.exports = 
{
    WriteOff_Tg
}