class Technological_Maps
{
    constructor(mongoclient)
    { 
          this.mongodb = require('mongodb');
          this.db = mongoclient.db("klenroshya_bot");
          this.collection = this.db.collection("techonological_maps");
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
    get_by_id  = (id, callback) => 
    { 
        this.collection.findOne({"_id": new this.mongodb.ObjectId(id)})
        .then((row) => callback(row,"sucessfuly"))
        .catch((err) => callback(err,"error"));
    }
    get_by_name = (name,callback) => 
    {
        this.collection.findOne({"name": name})
        .then((row) => callback(row,"sucessfuly"))
        .catch((err) => callback(err,"error"));
    }
    change_by_id = (id , object , callback) => 
    { 
          this.collection.replaceOne({"_id": new this.mongodb.ObjectId(id)}, object)
          .then(() => callback("sucess","sucessfuly"))
          .catch((err) => callback(err,"error"));
    }
    change_by_name = (name , object , callback) => 
    { 
              this.collection.replaceOne({"name": name}, object)
              .then(() => callback("sucess","sucessfuly"))
              .catch((err) => callback(err,"error"));
    }
    delete_by_name = (name,callback) => 
    { 
        this.collection.deleteOne({"name": name})
        .then(() => callback("sucess","sucessfuly"))
        .catch((err) => callback(err,"error"));
    }

}
module.exports = 
{
    Technological_Maps
}