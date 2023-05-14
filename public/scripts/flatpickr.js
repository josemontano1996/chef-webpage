const dateInputElement = document.getElementById('deliveryDate');
const scriptElement = document.querySelector(
  'script[src="/scripts/flatpickr.js"]'
);

const scheduleData = JSON.parse(scriptElement.dataset.scheduledata);

let configArray = [];

function createConfigArray() {
  //creating the free workdays of the week
  for (let i = 0; i < scheduleData.workingDays.length; i++) {
    if (scheduleData.workingDays[i]) {
      const disableFunction = function (date) {
        // return true to disable
        return date.getDay() === 0 || date.getDay() === i;
      };
      configArray.push(disableFunction);
    }
  }

  //creating the holidays
  for (const holiday of scheduleData.holidays) {
    const holidayObject = {
      from: new Date(holiday.holidayFrom).toISOString().slice(0, 10),
      to: new Date(holiday.holidayTo).toISOString().slice(0, 10),
    };
    configArray.push(holidayObject);
  }
}

createConfigArray();


const flatpickConfig = {
  appendTo: document.getElementById('calendar-container'),
  disableMobile: 'true', //TODO check this for production, see if is neccesary to for disableMobile
  enableTime: true,
  altInput: true,
  time_24hr: true,
  altFormat: 'M j. Y, (H:i) ',
  locale: {
    firstDayOfWeek: 1,
  },
  minDate: 'today',
  minTime: scheduleData.clockIn.toString(),
  maxTime: scheduleData.clockOut.toString(),
  disable: configArray,
};

flatpickr(dateInputElement, flatpickConfig);
