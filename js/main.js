(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // Fecha y año
  var now = new Date();
  $('#year').textContent = now.getFullYear();

  // Atajos de teclado: 1-6 para ir a cada sección, "/" para la consola
  var sections = ['perfil', 'experiencia', 'formacion', 'habilidades', 'proyectos', 'contacto'];
  var input = $('#term-in');
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === '/') {
      e.preventDefault();
      input.focus();
      input.scrollIntoView({ block: 'center' });
      return;
    }
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= sections.length) {
      document.getElementById(sections[n - 1]).scrollIntoView();
      history.replaceState(null, '', '#' + sections[n - 1]);
    }
  });

  // ---- Consola interactiva ----
  var out = $('#term-out');
  var term = $('#term');
  var history_ = [];
  var hpos = 0;

  function line(text, cls) {
    var p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    out.appendChild(p);
  }

  function pre(text) {
    var el = document.createElement('pre');
    el.textContent = text;
    out.appendChild(el);
  }

  // Copia el contenido de una sección de la página dentro de la consola
  function section(id) {
    var wrap = document.createElement('div');
    wrap.className = 'out';
    $$('#' + id + ' .out').forEach(function (node) {
      var copy = node.cloneNode(true);
      copy.removeAttribute('id');
      $$('[id]', copy).forEach(function (el) { el.removeAttribute('id'); });
      wrap.appendChild(copy);
    });
    out.appendChild(wrap);
  }

  function open(url) {
    window.open(url, '_blank', 'noopener');
    line('abriendo ' + url + ' …', 'dim');
  }

  var files = {
    'perfil.txt': 'perfil',
    'habilidades.csv': 'habilidades',
    'experiencia.log': 'experiencia',
    'formacion.txt': 'formacion',
    'proyectos.md': 'proyectos',
    'contacto.txt': 'contacto'
  };

  var commands = {
    help: function () {
      pre([
        'comandos disponibles:',
        '  whoami       perfil profesional',
        '  skills       habilidades técnicas',
        '  exp          experiencia laboral',
        '  edu          formación académica',
        '  proyectos    proyectos y publicaciones',
        '  contacto     datos de contacto',
        '  ls, cat      listar y leer archivos del CV',
        '  cv           descargar el CV en PDF',
        '  linkedin     abrir perfil de LinkedIn',
        '  github       abrir perfil de GitHub',
        '  mail         escribir un correo',
        '  date         fecha y hora',
        '  clear        limpiar la pantalla',
        '',
        'atajos: ↑/↓ historial · Tab autocompletar · 1-6 navegar la página'
      ].join('\n'));
    },
    whoami: function () { section('perfil'); },
    skills: function () { section('habilidades'); },
    exp: function () { section('experiencia'); },
    edu: function () { section('formacion'); },
    proyectos: function () { section('proyectos'); },
    contacto: function () { section('contacto'); },
    ls: function () { pre(Object.keys(files).join('  ') + '  svalenzuela_CV_2026.pdf'); },
    cat: function (args) {
      if (!args.length) { line('cat: falta el nombre del archivo (probá "ls")', 'err'); return; }
      args.forEach(function (name) {
        if (files[name]) section(files[name]);
        else if (name === 'svalenzuela_CV_2026.pdf') line('cat: es un archivo binario; usá "cv" para descargarlo', 'err');
        else line('cat: ' + name + ': No existe el archivo o el directorio', 'err');
      });
    },
    cv: function () { open('files/svalenzuela_CV_2026.pdf'); },
    linkedin: function () { open('https://uy.linkedin.com/in/sebastian-valenzuela-mart%C3%ADnez-1323291a'); },
    github: function () { open('https://github.com/morkx'); },
    mail: function () { window.location.href = 'mailto:sebadarva@gmail.com'; line('abriendo el cliente de correo …', 'dim'); },
    date: function () { line(new Date().toString()); },
    pwd: function () { line('/home/sebastian'); },
    echo: function (args) { line(args.join(' ')); },
    uname: function () { line('SVALENZUELA-BBS 1.0 GNU/Linux'); },
    sudo: function () { line('sebastian no está en el archivo sudoers. Este incidente será reportado.', 'err'); },
    clear: function () { out.innerHTML = ''; }
  };
  // Alias
  commands.experiencia = commands.exp;
  commands.formacion = commands.edu;
  commands.habilidades = commands.skills;
  commands.perfil = commands.whoami;
  commands.ayuda = commands.help;
  sections.forEach(function (id, i) {
    commands[String(i + 1)] = commands[{ perfil: 'whoami', habilidades: 'skills', experiencia: 'exp', formacion: 'edu', proyectos: 'proyectos', contacto: 'contacto' }[id]];
  });

  function run(raw) {
    var text = raw.trim();
    var echo = document.createElement('p');
    echo.className = 'prompt';
    echo.innerHTML = '<span class="ps1">sebastian@mvd:~$</span>';
    echo.appendChild(document.createTextNode(text));
    out.appendChild(echo);
    if (!text) return;
    history_.push(text);
    hpos = history_.length;
    var parts = text.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    if (commands.hasOwnProperty(cmd)) commands[cmd](parts.slice(1));
    else line('bash: ' + parts[0] + ': no se encontró la orden. Escribí "help".', 'err');
  }

  $('#term-form').addEventListener('submit', function (e) {
    e.preventDefault();
    run(input.value);
    input.value = '';
    input.scrollIntoView({ block: 'nearest' });
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' && hpos > 0) {
      e.preventDefault();
      input.value = history_[--hpos];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      hpos = Math.min(hpos + 1, history_.length);
      input.value = history_[hpos] || '';
    } else if (e.key === 'Tab' && input.value) {
      var parts = input.value.split(' ');
      var last = parts[parts.length - 1];
      var pool = parts.length === 1 ? Object.keys(commands) : Object.keys(files);
      var match = pool.filter(function (k) { return k.indexOf(last) === 0; });
      if (match.length === 1) {
        e.preventDefault();
        parts[parts.length - 1] = match[0];
        input.value = parts.join(' ') + (parts.length === 1 ? ' ' : '');
      } else if (match.length > 1) {
        e.preventDefault();
        line(match.join('  '), 'dim');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      commands.clear();
    }
  });

  // Hacer clic en la consola enfoca la línea de comandos
  term.addEventListener('click', function () {
    if (!window.getSelection().toString()) input.focus();
  });

  line('Bienvenido a SVALENZUELA·BBS. Escribí "help" para ver los comandos.', 'dim');
}());
