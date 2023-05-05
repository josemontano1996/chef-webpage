const db = require('../data/database');

const mongodb = require('mongodb');

class Schedule {
  constructor(
    clockIn,
    clockOut,
    workingDays = [],
    holidayId,
    holidayFrom,
    holidayTo,
    documentId
  ) {
    (this.clockIn = clockIn),
      (this.clockOut = clockOut),
      (this.workingDays = workingDays),
      (this.holidays = {
        holidayId: holidayId,
        holidayFrom: holidayFrom,
        holidayTo: holidayTo,
      }),
      (this.documentId = documentId);
  }

  static async getSchedule() {
    let schedule;
    return (schedule = await db.getDb().collection('schedule').findOne({}));
  }

  async saveHoliday() {
    const mongoId = new mongodb.ObjectId(this.documentId);
    await db
      .getDb()
      .collection('schedule')
      .updateOne({ _id: mongoId }, { $addToSet: { holidays: this.holidays } });
  }

  async saveSchedule() {
    await db
      .getDb()
      .collection('schedule')
      .updateOne(
        {},
        {
          $set: {
            clockIn: this.clockIn,
            clockOut: this.clockOut,
            workingDays: this.workingDays,
          },
        },
        { upsert: true }
      );
  }
}

module.exports = Schedule;
