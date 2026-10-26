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

  // Gráficos de habilidades: se animan una sola vez, al quedar visibles
  var $charts = $('.chart');
  function startCharts() {
    $charts.easyPieChart({
      onStep: function (from, to, percent) {
        $(this.el).find('.percent').text(Math.round(percent));
      }
    });
  }
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        startCharts();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(document.getElementById('skills'));
  } else {
    startCharts();
  }

  // Filtro de proyectos
  $(window).on('load', function () {
    var $container = $('.portfolio-items');
    var options = {
      animationOptions: { duration: 750, easing: 'linear', queue: false }
    };
    $container.isotope($.extend({ filter: '*' }, options));
    $('.cat a').on('click', function () {
      $('.cat .active').removeClass('active');
      $(this).addClass('active');
      $container.isotope($.extend({ filter: $(this).attr('data-filter') }, options));
      return false;
    });
  });

  // Año actual en el pie de página
  $('#year').text(new Date().getFullYear());
}(jQuery));
