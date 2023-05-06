const db = require('../data/database');

const mongodb = require('mongodb');

class Schedule {
  constructor(
    clockIn,
    clockOut,
    workingDays = [],
    holidayId,
    holidayFrom,
    holidayTo
  ) {
    (this.clockIn = clockIn),
      (this.clockOut = clockOut),
      (this.workingDays = workingDays),
      (this.holidays = {
        holidayId: holidayId,
        holidayFrom: holidayFrom,
        holidayTo: holidayTo,
      });
  }

  static async getSchedule() {
    let schedule;
    return (schedule = await db.getDb().collection('schedule').findOne({}));
  }

  async saveHoliday() {
    this.holidays.holidayFrom = new Date(
      this.holidays.holidayFrom
    ).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    this.holidays.holidayTo = new Date(
      this.holidays.holidayTo
    ).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    await db
      .getDb()
      .collection('schedule')
      .updateOne({}, { $addToSet: { holidays: this.holidays } });
  }

  static async deleteHolidays(holidayId) {
    await db
      .getDb()
      .collection('schedule')
      .updateOne({}, { $pull: { holidays: { holidayId: holidayId } } });
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
