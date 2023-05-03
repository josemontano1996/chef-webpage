const dateInputElement = document.getElementById('deliveryDate');

const flatpickConfig = {
  /* appendTo: document.getElementById('calendar-container'), */
  disableMobile: 'true',
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
