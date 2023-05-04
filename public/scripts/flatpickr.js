const dateInputElement = document.getElementById('deliveryDate');

//create a ajax get request for getting the configuration information from the db

const flatpickConfig = {
  /* appendTo: document.getElementById('calendar-container'), */
  /* disableMobile: 'true', */ //TODO check this for production, see if is neccesary to for disableMobile
  enableTime: true,
  altInput: true,
  altFormat: 'F j, (h:S K) ',
  locale: {
    firstDayOfWeek: 1,
  },
  minDate: 'today',
  minTime: '10:00',
  maxTime: '18:00',
  disable: [
    function (date) {
      // Disable Mondays
      return date.getDay() === 1;
    },
    function (date) {
      // Disable Sundays
      return date.getDay() === 0;
    },
  ],
};

flatpickr(dateInputElement, flatpickConfig);
