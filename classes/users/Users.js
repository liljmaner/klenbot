class Users
{
   constructor(mongoclient)
   { 
         this.db = mongoclient.db("klenroshya_bot");
         this.collection = this.db.collection("users");
   }
   create = (object,callback) => 
   { 
      this.collection.insertOne(object)
      .then(() => callback("sucess","sucessfuly"))
      .catch((err) => callback(err,"error"));
   }
   get_by_userid = (user_id, callback) => 
   { 
      this.collection.findOne({"user_id": user_id})
      .then((row) => callback(row,"sucessfuly"))
      .catch((err) => callback(err,"error"));
   }

}
module.exports = 
{ 
    Users
}