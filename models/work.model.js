const mongodb = require('mongodb');

const db = require('../data/database');

class Work {
  constructor(
    startingTime,
    finishingTime,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday
  ) {
    this.workSchedule = {
      startingTime: startingTime,
      finishingTime: finishingTime,
    };
    this.workdays = {
      monday: monday,
      tuesday: tuesday,
      wedneday: wednesday,
      thursday: thursday,
      friday: friday,
      saturday: saturday,
      sunday: sunday,
    };
  }
}

module.exports = Work;
