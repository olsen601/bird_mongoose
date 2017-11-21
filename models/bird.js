var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var birdSchema = new mongoose.Schema({

  name: { type: String, required: [true, 'Bird name is required.'],
    unique: true,
    uniqueCaseInsensitive: true,
    validate: {
      validator: function(n) {
        return n.length >=2;
      },
      message: '{VALUE} is not valid, bird name must be at least 2 letters'
    }
  },
  description: String,
  height: { type: Number,
    min: [1, 'Should be at least 1 cm'],
    max: [300, 'Should not be more than 300cm']},
  averageEggs: { type: Number, default: 1,
    min: [1, 'Should be at least 1 egg.'],
    max: [50, 'Should not be more than 50 eggs.'] },
  endangered: { type: Boolean, default: false },
  datesSeen:  [{
    type: Date,
    required: true,
    validate: {
      validator: function(d) {
        if (!d) { return false; }
        return d.getTime() <= Date.now();
      },
      message: 'Date must be a valid date. Date must be now or in the past.'
    }
  }],
  nest: {
    location: String,
    material: String
  }
});

var Bird = mongoose.model('Bird', birdSchema);
birdSchema.plugin(uniqueValidator);

module.exports = Bird;
