const db = require('../data/database');

class Schedule {
  constructor(clockIn, clockOut, workingDays = [], holidays = []) {
    (this.clockIn = clockIn),
      (this.clockOut = clockOut),
      (this.workingDays = workingDays),
      (this.holidays = holidays);
  }

  static async getSchedule() {
    let schedule;
    return (schedule = await db.getDb().collection('schedule').findOne({}));
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
