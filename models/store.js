// This file handles the backend for the poll mongoose schema
var mongoose = require('mongoose');
//var autoIncrement = require('mongoose-auto-increment');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://' + process.env.HOST + '/' + process.env.NAME, {
    useMongoClient: true
});
var db = mongoose.connection;
//autoIncrement.initialize(db);
// User Schema
var StoreSchema = mongoose.Schema({
  User: [String],
  ID: {
    type: String
  }
  
}, {
    strict: false
});

StoreSchema.index({
    question: 'text'
});

/*
var Poll = module.exports = mongoose.model('Poll', PollSchema);
PollSchema.plugin(autoIncrement.plugin, {model: 'Poll', startAt: 0});
module.exports.createPoll = function(newPoll, callback) {

      newPoll.save(callback);

}
var polls = db.collection('polls');
var counter = db.collection('identitycounters');
module.exports.replace = function(newPoll, callback) {

var str = (newPoll.question).replace(/(['"])/g, "\\$1");
   /*polls.find( {$text: {
            $search: str
        }}).forEach(function(item) {
     console.log("Item: ");
      console.log(item);
    }); */
  //  $search: '\"' + newPoll.question + '\"'
    polls.replaceOne({
        $text: {
            $search: '\"' + newPoll.question + '\"'
        }
    }, newPoll);
  
}



    var Position = db.collection('Position');
module.exports.delete = function(poll, callback) {
    // Get the id of the question
    var position;
    polls.find({
        question: poll.question
    }).forEach(function(item) {
        position = item.Position;
        decrement(position);
    });

   Position.update({}, {
        $inc: {
            Position: -1,
        }
    });

  
   
    polls.deleteOne({
        question: poll.question
    });
  
    counter.update({}, {
        $inc: {
            "count": -1
        }
    }, function(err, results) {
        if (err) {
            throw err
        }
        if (!results.length) {
              console.log("Not found");
        }
    });
    // Get every document with an ID larger than it and decrement it { qty: { $gt: 4 } } 
    function decrement(id) {
       
        polls.update({
            Position: {
                $gt: id
            }
        }, {

            $inc: {
                Position: -1
            }

        }, { multi: true })
    }

}

module.exports.checkExistance = function(poll, res, callback) {

    polls.find({
        question: poll.question
    }, {
        $exists: true
    }).toArray(function(err, doc) //find if a value exists
        {
            if (doc && doc.length) //if it does
            {
                return callback(null, doc); // print out what it sends back
            } else // if it does not 
            {
                return callback(null, "Not in docs");
            }
        });
}