
document.addEventListener('DOMContentLoaded', function () {

  var form = document.forms.bookingForm;
  if (!form) return;

  var today = new Date().toISOString().split('T')[0];
  form.elements.checkin.min = today;
  form.elements.checkout.min = today;


  form.addEventListener('submit', function (event) {

    event.preventDefault();

    var formData = new FormData(form);
    var data = Object.fromEntries(formData.entries());


    console.log('Данные формы бронирования:', data);


    var errors = validate(data, today);

    if (errors.length > 0) {
    
      Swal.fire({
        icon: 'error',
        title: 'Проверьте данные',
        html: '<ul style="text-align:left;margin:0;padding-left:1.2rem">' +
              errors.map(function (e) { return '<li>' + e + '</li>'; }).join('') +
              '</ul>',
        confirmButtonText: 'Исправить',
        confirmButtonColor: '#c49a5c'
      });
      return;
    }


    var nights = countNights(data.checkin, data.checkout);
    Swal.fire({
      icon: 'success',
      title: 'Бронирование оформлено!',
      html: data.firstname + ', ждём вас в Hotel lux.<br>' +
            data.category + ', ' + nights + ' ' + nightsWord(nights) +
            ', гостей: ' + data.guests + '.<br>' +
            'Подтверждение отправим на ' + data.email,
      confirmButtonText: 'Отлично',
      confirmButtonColor: '#c49a5c'
    });
    form.reset();
  });
});


function validate(data, today) {
  var errors = [];

  if (!data.checkin) {
    errors.push('Укажите дату заезда');
  } else if (data.checkin < today) {
    errors.push('Дата заезда не может быть в прошлом');
  }

  if (!data.checkout) {
    errors.push('Укажите дату выезда');
  } else if (data.checkin && data.checkout <= data.checkin) {
    errors.push('Дата выезда должна быть позже даты заезда');
  }

  if (!data.category) errors.push('Выберите категорию номера');
  if (!data.guests) errors.push('Выберите количество гостей');

  if (data.firstname.trim().length < 2) errors.push('Имя должно содержать минимум 2 символа');
  if (data.lastname.trim().length < 2) errors.push('Фамилия должна содержать минимум 2 символа');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.push('Введите корректный email, например name@mail.ru');
  }

  var digits = data.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 12) {
    errors.push('Телефон должен содержать от 10 до 12 цифр');
  }

  return errors;
}


function countNights(checkin, checkout) {
  var ms = new Date(checkout) - new Date(checkin);
  return Math.round(ms / 86400000);
}


function nightsWord(n) {
  var last = n % 10, lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return 'ночей';
  if (last === 1) return 'ночь';
  if (last >= 2 && last <= 4) return 'ночи';
  return 'ночей';
}
