class Write_Off 
{
    constructor(mongoclient)
    { 
          this.db = mongoclient.db("klenroshya_bot");
          this.collection = this.db.collection("write_off");
    }
    create = (object,callback) => 
    { 
           this.collection.insertOne(object)
           .then(() => callback("sucess","sucessfuly"))
           .catch((err) => callback(err,"error"));
    }
    get = (callback) => 
    {
          this.collection.find().toArray()
          .then((row) => callback(row,"sucessfuly"))
          .catch((err) => callback(err,"error"));
    }
    get_by_date = (date,callback) => 
    {
         this.collection.findOne({"date": date})
         .then((row) => callback(row,"sucessfuly"))
         .catch((err) => callback(err,"error"));
    }
    change_by_date = (date,object,callback) => 
    {
        this.collection.replaceOne({"date":date},object)
        .then(() => callback("sucess","sucessfuly"))
        .catch((err) => callback(err,"error"));
    }
    filter_by_date = (from,to,callback) => 
    { 
       this.collection.find({ date: { $gte: from, $lte: to } }).toArray()
       .then((row) => callback(row,"sucessfuly"))
       .catch((err) => callback(err,"error"));
    }
}
module.exports = 
{
  Write_Off
}