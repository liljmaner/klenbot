class Prices
{

    constructor(mongoclient)
    { 
          this.db = mongoclient.db("klenroshya_bot");
          this.collection = this.db.collection("prices");
    }
    create = (object,callback) => 
    { 
           this.collection.insertOne(object)
           .then(() => callback("sucess","sucessfuly"))
           .catch((err) => callback(err,"error"));
    }
    get_by_name = (name,callback) => 
    {
         this.collection.findOne({"name": name})
         .then((row) => callback(row,"sucessfuly"))
         .catch((err) => callback(err,"error"));
    }
    change_by_name = (name,object,callback) => 
    {
        this.collection.replaceOne({"name":name},object)
        .then(() => callback("sucess","sucessfuly"))
        .catch((err) => callback(err,"error"));
    }
}
module.exports = 
{
    Prices
}