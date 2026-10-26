(function ($) {
  'use strict';

  // Scroll suave al hacer clic en los enlaces del menú
  $('a.page-scroll').on('click', function () {
    var target = $(this.hash);
    if (target.length) {
      $('html, body').animate({ scrollTop: target.offset().top - 40 }, 900);
      return false;
    }
  });

  // Fija la barra de navegación al pasar el encabezado
  $('#nav').affix({
    offset: { top: function () { return $('header').outerHeight(); } }
  });

  // Cierra el menú en móvil después de elegir una sección
  $('.navbar-main-collapse a').on('click', function () {
    $('.navbar-main-collapse.in').collapse('hide');
  });

  // Año actual en el pie de página
  $('#year').text(new Date().getFullYear());
}(jQuery));
