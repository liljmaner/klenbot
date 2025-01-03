class Sales_Tg
{
   constructor(mongoclient) 
   {
      const sales = require("./Sales");
      this.Sales = new sales.Sales(mongoclient);
      this.helpers = require("../Telegram/Helpers")
      this.moment = require("moment");
      const inventory = require("../Inventory/Inventory");
      this.Inventroy = new inventory.Inventory(mongoclient);
      const techonological_maps = require("../Technological_Maps/Technological_Maps");
      this.Techonological_Maps = new techonological_maps.Technological_Maps(mongoclient);
    }
   create_sale = (user_input,user_id,callback) => 
   {
 
      let products_array = [];
      const input_array = user_input.split("\n");
      const date = this.moment(input_array[0], 'DD-MM-YYYY').unix();
      input_array.shift();
      input_array.forEach((element) => 
      { 
         const get_product =  element.split("|");
         products_array.push({
           "name": get_product[0].trim(),
           "count": parseFloat(get_product[1].trim()),
         })
         this.Techonological_Maps.get_by_name(get_product[0].trim(), (techo_row,techo_status) => 
         {
            if (techo_status == 'sucessfuly' && techo_row != null)
            {
                this.Inventroy.get_by_date(date, (inventory_row,inventory_status) => 
                { 
                    techo_row['ingredients'].forEach((ingredients) => 
                    {
                       inventory_row['products'].forEach((products) => 
                      {
                         if (ingredients['name'] == products['name'])
                         {
                           products['brutto'] -= parseFloat(ingredients['weight']);
                         }
                      })
                    })
                    this.Inventroy.change_by_date(date, inventory_row, (change_description,change_status) => 
                    {
                      if (change_description != 'sucess' && change_status != 'sucessfuly')
                        throw new Error("Ошибка при изменении")
                    })
                })
            }
            else
              throw new Error("Ошибка при создании")

         })
      })
      this.Sales.create({
        "date": date,
        "products": products_array
      }, (description,status) =>
      {
        if (description == 'sucess' && status == 'sucessfuly')
         return callback(this.helpers.msg_handler("sucess_createsale"));
        else
          throw new Error("Ошибка при создании")
      })
    }
    insert_sale_static = (user_input,user_id,callback) => 
    {
         let input_array = user_input.split("-");
         const from = this.moment(input_array[0],'DD-MM-YYYY').unix();
         const to = this.moment(input_array[1],'DD-MM-YYYY').unix();
         let get_msg = this.helpers.msg_handler("get_sales");
         let get_str = get_msg['msg'].slice(0,25) + " Data";
         this.Sales.filter_by_date(from,to,(rows,status) => 
         { 
          if (status == 'sucessfuly' && rows != null) {
            let sales_str = '';
            rows.forEach((element) => { 
                    element['products'].forEach((products_el) => { 
                      sales_str +=`\n${element['date']}\n${products_el['name']} |${products_el['count']}\n`;;
                    });
            });
            get_msg['msg'] = get_str.replace("Data", sales_str);
            return callback(get_msg);
        } else {
            throw new Error('[Ошибка при получении]:' + rows);
        }
     
         } )
     }
}

module.exports = 
{
    Sales_Tg
}