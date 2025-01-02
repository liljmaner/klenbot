class Sales
{
   constructor(mongoclient)
   { 
         this.db = mongoclient.db("klenroshya_bot");
         this.collection = this.db.collection("sales");
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
   filter_by_date = (from,to,callback) => 
   { 
         this.collection.find({ date: { $gte: from, $lte: to } }).toArray()
         .then((row) => callback(row,"sucessfuly"))
         .catch((err) => callback(err,"error"));
   }
}
module.exports = 
{ 
    Sales
}