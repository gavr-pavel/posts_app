(function() {
  var throttle;

  angular.module('posts_app', ['ngRoute']).run([
    '$rootScope', '$window', '$document', function($rootScope, $window, $document) {
      var docBody, docRoot, scrollTop;
      docRoot = $document[0].documentElement;
      docBody = $document[0].body;
      scrollTop = function(y) {
        if (y != null) {
          return docRoot = docBody = y;
        } else {
          return docRoot.scrollTop || docBody.scrollTop;
        }
      };
      return $window.addEventListener('scroll', throttle((function(_this) {
        return function(evt) {
          if (docBody.scrollHeight < scrollTop() + docBody.clientHeight + 150) {
            return $rootScope.$apply(function() {
              return $rootScope.$emit('scrollEndApproach');
            });
          }
        };
      })(this), 100));
    }
  ]);

  throttle = function(fn, delay) {
    var timer;
    if (delay === 0) {
      return fn;
    }
    timer = false;
    return function() {
      if (timer) {
        return;
      }
      timer = true;
      if (delay !== -1) {
        setTimeout((function() {
          return timer = false;
        }), delay);
      }
      return fn.apply(null, arguments);
    };
  };

}).call(this);

(function() {
  angular.module('posts_app').controller('NavCtrl', [
    '$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
      this.postFilter = $rootScope.postFilter = {
        title: ''
      };
      $scope.$location = $location;
      return this;
    }
  ]);

}).call(this);

(function() {
  angular.module('posts_app').controller('PostDetailsCtrl', [
    '$scope', 'posts', '$routeParams', '$location', function($scope, posts, $routeParams, $location) {
      $scope.$watch((function() {
        return posts.get($routeParams.postId);
      }), (function(_this) {
        return function(updatedPost) {
          return _this.post = angular.copy(updatedPost);
        };
      })(this));
      this.removePost = (function(_this) {
        return function() {
          if (confirm("Вы уверены, что хотите удалить запись?")) {
            posts.remove($routeParams.postId);
            return $location.path('/posts');
          }
        };
      })(this);
      return this;
    }
  ]);

}).call(this);

(function() {
  angular.module('posts_app').controller('PostEditCtrl', [
    '$scope', 'posts', '$routeParams', '$location', function($scope, posts, $routeParams, $location) {
      this.post = angular.copy(posts.get($routeParams.postId));
      this.submit = (function(_this) {
        return function() {
          if ($scope.post_edit.$valid) {
            posts.update(_this.post);
            return $location.path("/posts/" + _this.post.id);
          }
        };
      })(this);
      return this;
    }
  ]);

}).call(this);

(function() {
  angular.module('posts_app').controller('PostListCtrl', [
    '$scope', 'posts', '$rootScope', function($scope, posts, $rootScope) {
      this.posts = posts;
      this.postsQuantity = 5;
      this.removePost = (function(_this) {
        return function(post) {
          if (confirm("Вы уверены, что хотите удалить запись «" + post.title + "»?")) {
            return posts.remove(post.id);
          }
        };
      })(this);
      $rootScope.$on('scrollEndApproach', (function(_this) {
        return function() {
          if (_this.postsQuantity < posts.list.length) {
            return _this.postsQuantity += 5;
          }
        };
      })(this));
      return this;
    }
  ]);

}).call(this);

(function() {
  angular.module('posts_app').controller('PostNewCtrl', [
    '$scope', '$location', 'posts', function($scope, $location, posts) {
      this.submit = (function(_this) {
        return function() {
          if ($scope.post_new.$valid) {
            posts.create(_this.post);
            return $location.path('/posts');
          }
        };
      })(this);
      return this;
    }
  ]);

}).call(this);

(function() {
  angular.module('posts_app').service('posts', [
    '$rootScope', '$window', 'postsDummy', function($rootScope, $window, postsDummy) {
      var getNewIndex, init, save;
      this.get = (function(_this) {
        return function(id) {
          var post, _i, _len, _ref;
          _ref = _this.list;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            post = _ref[_i];
            if (post.id === id) {
              return post;
            }
          }
        };
      })(this);
      this.create = (function(_this) {
        return function(_arg) {
          var newPost, text, title;
          title = _arg.title, text = _arg.text;
          newPost = {
            id: getNewIndex(),
            title: title,
            text: text
          };
          _this.list.unshift(newPost);
          return save();
        };
      })(this);
      this.update = (function(_this) {
        return function(_arg) {
          var id, post, text, title, _i, _len, _ref;
          id = _arg.id, title = _arg.title, text = _arg.text;
          _ref = _this.list;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            post = _ref[_i];
            if (post.id === id) {
              post.title = title;
              post.text = text;
              return save();
            }
          }
        };
      })(this);
      this.remove = (function(_this) {
        return function(id) {
          var i, post, _i, _len, _ref;
          _ref = _this.list;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            post = _ref[i];
            if (post.id === id) {
              _this.list.splice(i, 1);
              return save();
            }
          }
        };
      })(this);
      getNewIndex = function() {
        var newIndex;
        newIndex = localStorage.getItem('posts_new_index');
        localStorage.setItem('posts_new_index', +newIndex + 1);
        return newIndex;
      };
      save = (function(_this) {
        return function() {
          localStorage.setItem('posts', angular.toJson(_this.list));
          return _this;
        };
      })(this);
      init = (function(_this) {
        return function() {
          if (localStorage.getItem('posts_initialized')) {
            return _this.list = angular.fromJson(localStorage.getItem('posts'));
          } else {
            _this.list = postsDummy();
            save();
            localStorage.setItem('posts_new_index', _this.list.length);
            return localStorage.setItem('posts_initialized', true);
          }
        };
      })(this);
      init();
      $window.addEventListener('storage', (function(_this) {
        return function(evt) {
          if (evt.key !== 'posts') {
            return;
          }
          return $rootScope.$apply(function() {
            return _this.list = angular.fromJson(localStorage.getItem('posts')) || [];
          });
        };
      })(this));
      return this;
    }
  ]);

}).call(this);

(function() {
  angular.module('posts_app').config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/posts', {
        controller: 'PostListCtrl',
        controllerAs: 'vm',
        templateUrl: 'post_list.html'
      }).when('/posts/new', {
        controller: 'PostNewCtrl',
        controllerAs: 'vm',
        templateUrl: 'post_new.html'
      }).when('/posts/:postId', {
        controller: 'PostDetailsCtrl',
        controllerAs: 'vm',
        templateUrl: 'post_details.html'
      }).when('/posts/:postId/edit', {
        controller: 'PostEditCtrl',
        controllerAs: 'vm',
        templateUrl: 'post_edit.html'
      }).when('/', {
        redirectTo: '/posts'
      }).otherwise({
        templateUrl: 'not_found.html'
      });
    }
  ]);

}).call(this);

(function() {
  angular.module('posts_app').factory('postsDummy', function() {
    return function() {
      return [
        {
          "id": "16",
          "title": "Гравитационный психоанализ глазами современников",
          "text": "Система координат жизненно осознаёт мифологический алеаторически выстроенный бесконечный канон с полизеркальной векторно-голосовой структурой. Гендер вызывает музыкальный степенной ряд. Субъект порождает и обеспечивает резкий рефрен, что свидетельствует о проникновении днепровских льдов в бассейн Дона. Сновидение эродировано. Расходящийся ряд, общеизвестно, иллюстрирует четвертичный гедонизм, здесь описывается централизующий процесс или создание нового центра личности.\n\nВарва изящно творит лайн-ап, поэтому никого не удивляет, что в финале порок наказан. При описанных условиях график функции стягивает математический маятник, даже если рамки подвеса буду ориентированы под прямым углом. Анима зависима. Фаза просветляет лайн-ап.\n\nИнтеракционизм, так или иначе, подрывает деструктивный метод последовательных приближений, что в конце концов приведет к полному разрушению хребта под действием собственного веса. Анима многопланово выбирает гений. Сила раскручивает субъективный реголит, что свидетельствует о проникновении днепровских льдов в бассейн Дона. Репрезентативная система, в том числе, выводит положительный метаязык, не учитывая мнения авторитетов."
        }, {
          "id": "15",
          "title": "Близкий лавовый поток: основные моменты",
          "text": "Геодезическая линия начинает перекрестный полифонический роман, таким образом, часовой пробег каждой точки поверхности на экваторе равен 1666км. Надстройка выстраивает замысел. Галактика, как бы это ни казалось парадоксальным, понимает под собой эмпирический поперечник, включая и гряды Чернова, Чернышева и др.\n\nТочность тангажа варьирует напряженный стимул. Объект нивелирует гомеостаз, что отчасти объясняет такое количество кавер-версий. Лагуна, по определению, точно смещает алеаторически выстроенный бесконечный канон с полизеркальной векторно-голосовой структурой, что позволяет проследить соответствующий денудационный уровень. После того как тема сформулирована, уход гироскопа поступает в дуализм. Элонгация нивелирует биотит.\n\nМногие кометы имеют два хвоста, однако дистинкция вращает мелодический центр сил. Репрезентативная система, как бы это ни казалось парадоксальным, заставляет иначе взглянуть на то, что такое психоанализ. Можно предположить, что аффинное преобразование осмысляет групповой дрейф континентов. Сет, после осторожного анализа, вызывает естественный уход гироскопа. Декретное время продолжает первоначальный детерминант."
        }, {
          "id": "14",
          "title": "Почему маловероятен контраст?",
          "text": "Достаточное условие сходимости искажает примитивный эгоцентризм, первым образцом которого принято считать книгу А.Бертрана \"Гаспар из тьмы\". Женщина-космонавт на следующий год, когда было лунное затмение и сгорел древний храм Афины в Афинах (при эфоре Питии и афинском архонте Каллии), трансформирует культурный звукоряд. Если пренебречь малыми величинами, то видно, что гироскопическая рамка вероятна. Строфоид однородно диссонирует экватор.\n\nОщущение мира, после осторожного анализа, ненаблюдаемо. Первое полустишие, так или иначе, притягивает вибрирующий код. Сновидение аккумулирует психоз. Глубина очага землетрясения образует метр.\n\nДо недавнего времени считалось, что midi-контроллер оценивает звукорядный анапест. Атомное время контролирует лимб, тем не менее как только ортодоксальность окончательно возобладает, даже эта маленькая лазейка будет закрыта. Сомнение мгновенно поднимает социальный предмет деятельности. Ввиду непрерывности функции f ( x ), огpомная пылевая кома наблюдаема. Хорус вполне вероятен."
        }, {
          "id": "13",
          "title": "Почему вероятна магнитуда землетрясения?",
          "text": "Теорема, по определению, отталкивает винил. Обычная литература, перенесенная в Сеть, не является \"сетературой\" в смысле отдельного жанра, однако лирика прекрасно дает меловой эксцентриситет. Мышление, а там действительно могли быть видны звезды, о чем свидетельствует Фукидид нивелирует дискурс. Кластерное вибрато прекращает гедонизм.\n\nЭстетическое воздействие семантически иллюстрирует смысл жизни. Наибольший Общий Делитель (НОД) допускает непреложный возврат к стереотипам одинаково по всем направлениям. Прямое восхождение последовательно искажает механический кризис, при этом буквы А, В, I, О символизируют соответственно общеутвердительное, общеотрицательное, частноутвердительное и частноотрицательное суждения. Брекчия, с зачастую загипсованными породами, фактурна.\n\nСудя по находям древнейших моренных отложений на Онежско-Ладожском перешейке, цунами однократно. Управление полётом самолёта вызывает урбанистический период. Позитивизм, как можно показать с помощью не совсем тривиальных вычислений, интенсивно оспособляет волчок. Устойчивость по Ляпунову уязвима."
        }, {
          "id": "12",
          "title": "Почему полидисперсен хорус?",
          "text": "Конечно, нельзя не принять во внимание тот факт, что движение спутника представляет собой метод последовательных приближений. Постулат, конечно, поступает в жидкий автоматизм. Движение спутника потенциально. Шоу-бизнес естественно имеет гармонический интервал. Асимптота, в первом приближении, раскручивает интеграл от функции комплексной переменной.\n\nДайка выбирает психоз, тем не менее как только ортодоксальность окончательно возобладает, даже эта маленькая лазейка будет закрыта. С феноменологической точки зрения, уравнение малых колебаний взаимно. Симметрия ротора, согласно традиционным представлениям, просветляет зеркальный рефрен, дальнейшие выкладки оставим студентам в качестве несложной домашней работы. Алеаединица даёт более простую систему дифференциальных уравнений, если исключить аутотренинг.\n\nМифопоэтическое пространство представляет собой акцент. Точность крена осознаёт мелодический приток. Одиннадцатисложник вызывает хлоридно-гидрокарбонатный ревер. Ощущение мира представляет собой интеграл от функции комплексной переменной. Бихевиоризм сложен."
        }, {
          "id": "11",
          "title": "Силурийский кряж в XXI веке",
          "text": "Дискурс иррационален. Сновидение транспонирует параметр. Фосфоритообразование соответствует реформаторский пафос. Предсознательное схоже. Экзарация вызывает диабаз.\n\nАутизм начинает тригонометрический винил. Как было показано выше, сходящийся ряд иррационален. Параллакс, основываясь большей частью на сейсмических данных, многопланово меняет основной оз, что лишний раз подтверждает правоту З.Фрейда. Чувство притягивает гомеостаз. Прямолинейное равноускоренное движение основания аннигилирует хроматический звукосниматель. Постоянная величина, как бы это ни казалось парадоксальным, индивидуально фоссилизирует тригонометрический флажолет.\n\nОбъект слабопроницаем. Отношение к современности синхронно несет в себе сложный знак. Доминантсептаккорд, формируя аномальные геохимические ряды, составляет эриксоновский гипноз. Туманность Андромеды монотонно прекращает гений. Открытое множество абсурдно представляет собой вращательный одиннадцатисложник, как это случилось в 1994 году с кометой Шумейкеpов-Леви 9. Ошибка, по определению анизотропно выбирает холодный цинизм."
        }, {
          "id": "10",
          "title": "Равновероятный закон внешнего мира глазами современников",
          "text": "Друмлин, в первом приближении, дает коллективный гомеостаз. Отвечая на вопрос о взаимоотношении идеального ли и материального ци, Дай Чжень заявлял, что открытое множество категорически слагает колебательный катарсис. Мантия доступна.\n\nИнтеграл по поверхности непосредственно диссонирует момент силы трения, но не рифмами. Бихевиоризм дает музыкальный делювий. Позитивизм, в первом приближении, неустойчив.\n\nДисперсия, в первом приближении, порождена временем. Первая производная дает угол тангажа. Алеаединица полифигурно участвует в погрешности определения курса меньше, чем палеокриогенный контрапункт контрастных фактур. Веданта, на первый взгляд, нетривиальна. Самость представляет собой Млечный Путь. В заключении добавлю, гиперцитата мгновенно преобразует неопровержимый рефрен."
        }, {
          "id": "9",
          "title": "Данный афелий — актуальная национальная задача",
          "text": "Наибольший Общий Делитель (НОД), по определению, интегрирует ассоцианизм. Полисемия, в первом приближении, прочно преобразует астероидный критерий сходимости Коши. Самоактуализация наблюдаема. Очевидно, что субъективное восприятие транспонирует вращательный контрпример. Последнее векторное равенство, как справедливо считает И.Гальперин, представляет собой мнимотакт.\n\nУгловое расстояние специфицирует момент сил. Кульминация, конечно, различна. Уравнение в частных производных, несмотря на не менее значительную разницу в плотности теплового потока, создает скрытый смысл, переходя в другую систему координат. Образ социально стабилизирует собственный кинетический момент.\n\nПоследнее векторное равенство, так или иначе, интегрирует аутизм. Психосоматика достаточно хорошо дает страх. Прямолинейное равноускоренное движение основания точно аннигилирует первичный интеграл по поверхности, откуда следует доказываемое равенство. Отсутствие трения осмысляет прецизионный степенной ряд. Правда, некоторые специалисты отмечают, что предсознательное спорадически дает дедуктивный метод, где на поверхность выведены кристаллические структуры фундамента. Популяционный индекс неумеренно рефлектирует контраст."
        }, {
          "id": "8",
          "title": "Лирический критерий интегрируемости: гипотеза и теории",
          "text": "Уравнение времени недоступно нейтрализует центр сил, при котором центр масс стабилизируемого тела занимает верхнее положение. В отличие от давно известных астрономам планет земной группы, ускорение вызывает автономный психоанализ. Гелиоцентрическое расстояние нетривиально.\n\nЗакон однородно просветляет стимул. Форшлаг, очевидно, усиливает резкий психоанализ, открывая новые горизонты. Полиряд преобразует стеклянный грунт.\n\nКак было показано выше, абстрактное высказывание стягивает депрессивный здравый смысл. Согласно теории устойчивости движения детерминант уравновешивает космический сброс. Арпеджированная фактура иллюстрирует субъективный форшок. Комплекс просветляет случайный подвес."
        }, {
          "id": "7",
          "title": "Отрицательный реформаторский пафос: гипотеза и теории",
          "text": "Гирокомпас иллюстрирует флюгель-горн. Адажио, по определению, методологически переворачивает словесный филогенез, туда же попадает и еще недавно вызывавший безусловную симпатию гетевский Вертер. Исправлению подверглись лишь явные орфографические и пунктуационные погрешности, например, уравнение времени решительно преобразует катарсис. Абсолютно сходящийся ряд полидисперсен. Локаята релевантно соответствует устойчивый гедонизм. Радиант извержен.\n\nБиотит творит гетит, это и есть одномоментная вертикаль в сверхмногоголосной полифонической ткани. Момент выбирает мифологический полиряд. Элонгация не зависит от скорости вращения внутреннего кольца подвеса, что не кажется странным, если вспомнить о том, что мы не исключили из рассмотрения алеаторически выстроенный бесконечный канон с полизеркальной векторно-голосовой структурой. Скоpость кометы в пеpигелии интегрирует звукосниматель. Созерцание последовательно творит аргумент перигелия.\n\nАссоцианизм, исключая очевидный случай, искажает из ряда вон выходящий код. Ведущий экзогенный геологический процесс - движение спутника раскладывает на элементы социальный детерминант. Распространиение вулканов выбирает октавер. Представляется логичным, что линеаризация полифигурно сдвигает систематический уход. Криволинейный интеграл, в том числе, представляет собой кризис жанра, составляя уравнения Эйлера для этой системы координат."
        }, {
          "id": "6",
          "title": "Почему неоднозначна свобода?",
          "text": "Комплексное число, сублимиpуя с повеpхности ядpа кометы, вызывает Наибольший Общий Делитель (НОД). Расстояния планет от Солнца возрастают приблизительно в геометрической прогрессии (правило Тициуса — Боде): г = 0,4 + 0,3 · 2n (а.е.), где определитель системы линейных уравнений даёт большую проекцию на оси, чем Наибольший Общий Делитель (НОД), на этих моментах останавливаются Л.А.Мазель и В.А.Цуккерман в своем \"Анализе музыкальных произведений\". Ассоцианизм начинает метафоричный систематический уход.\n\nЭтот концепт элиминирует концепт «нормального», однако ригидность слагает трансцендентальный апогей. Апогей отнюдь не очевиден. Комплекс просветляет фьюжн, что несомненно приведет нас к истине. Точка перегиба отражает калиево-натриевый полевой шпат. Дуализм постоянно аккумулирует потребительский криволинейный интеграл. Бессознательное однократно.\n\nЭфемерида просветляет анапест. М.М.Бахтин понимал тот факт, что лидерство представляет собой определенный корунд. Трансгрессия мгновенно дает конус выноса, учитывая опасность, которую представляли собой писания Дюринга для не окрепшего еще немецкого рабочего движения."
        }, {
          "id": "5",
          "title": "Почему поразительно линейное программирование?",
          "text": "Угловая скорость, следуя пионерской работе Эдвина Хаббла, вразнобой концентрирует интеллект, а время ожидания ответа составило бы 80 миллиардов лет. Жанр, как бы это ни казалось парадоксальным, неодинаков. Заимствование непрерывно. Панладовая система, несмотря на то, что все эти характерологические черты отсылают не к единому образу нарратора, редуцирует линейно зависимый неоцен. Аномия выстраивает стресс, что лишний раз подтверждает правоту З.Фрейда.\n\nКульт джайнизма включает в себя поклонение Махавире и другим тиртханкарам, поэтому гелиоцентрическое расстояние дискредитирует детерминант. Конформизм творит далекий лирический субъект. Декретное время нейтрализует возрастной секстант, тем не менее как только ортодоксальность окончательно возобладает, даже эта маленькая лазейка будет закрыта. Эстетическое воздействие, конечно, однородно иллюстрирует интеллигибельный корунд.\n\nОрбита, в отличие от некоторых других случаев, фактурна. Лава аннигилирует момент сил. Транстекстуальность вызывает реципиент."
        }, {
          "id": "4",
          "title": "Почему амбивалентно внутридискретное арпеджио?",
          "text": "Филиация выслеживает останцовый надвиг, tertium nоn datur. Восход неограничен сверху. Начало координат волнообразно. Алеаторика, по определению, жизненно меняет ньютонометр. Эта разница, вероятно, помогает объяснить, почему гелиоцентрическое расстояние точно притягивает структурный расходящийся ряд. Лагуна отталкивает палимпсест.\n\nЮжный Треугольник, следовательно, пространственно стабилизирует действительный сет. Эриксоновский гипноз дает здравый смысл. Аффинное преобразование, согласно традиционным представлениям, начинает алмаз.\n\nСравнивая подводные лавовые потоки с потоками, изученными на Гавайях, исследователи показали, что годовой параллакс трансформирует рок-н-ролл 50-х. Математическая статистика осознаёт конкретный скрытый смысл. Проекция абсолютной угловой скорости на оси системы координат xyz, конечно, сдвигает анормальный контраст. Инсайт прост."
        }, {
          "id": "3",
          "title": "Центральный популяционный индекс: предпосылки и развитие",
          "text": "Когда речь идет о галактиках, кульминация однородно вызывает сарос. Тропический год отражает Южный Треугольник. Математический горизонт выбирает лимб. Звезда жизненно гасит случайный терминатор. Движение последовательно. Параметр, в первом приближении, ничтожно выбирает экваториальный астероид.\n\nСоединение ищет экваториальный Юпитер, таким образом, часовой пробег каждой точки поверхности на экваторе равен 1666км. Южный Треугольник, и это следует подчеркнуть, ищет pадиотелескоп Максвелла, тем не менее, уже 4,5 млрд лет расстояние нашей планеты от Солнца практически не меняется. Бесспорно, Лисичка прекрасно выбирает далекий метеорит (датировка приведена по Петавиусу, Цеху, Хайсу).\n\nЛетучая Рыба вращает далекий Юпитер. Фаза представляет собой параметр. Звезда, сублимиpуя с повеpхности ядpа кометы, жизненно меняет астероидный параллакс. Hатpиевые атомы предварительно были замечены близко с центром других комет, но соединение вызывает эллиптический параметр, как это случилось в 1994 году с кометой Шумейкеpов-Леви 9."
        }, {
          "id": "2",
          "title": "Вращательный дип-скай объект: методология и особенности",
          "text": "Реферат по астрономии\nТема: «Вращательный дип-скай объект: методология и особенности»\nПpотопланетное облако, это удалось установить по характеру спектра, ничтожно вращает центральный азимут. Юпитер сложен. Планета притягивает случайный поперечник. Эфемерида выбирает секстант, и в этом вопросе достигнута такая точность расчетов, что, начиная с того дня, как мы видим, указанного Эннием и записанного в \"Больших анналах\", было вычислено время предшествовавших затмений солнца, начиная с того, которое в квинктильские ноны произошло в царствование Ромула. Большой круг небесной сферы недоступно решает далекий лимб. Огpомная пылевая кома выслеживает метеорный дождь, таким образом, атмосферы этих планет плавно переходят в жидкую мантию.\n\nОсь, это удалось установить по характеру спектра, оценивает вращательный параметр. Космогоническая гипотеза Шмидта позволяет достаточно просто объяснить эту нестыковку, однако межзвездная матеpия колеблет секстант. Эпоха, и это следует подчеркнуть, параллельна.\n\nКерн меняет экваториальный спектральный класс. Каллисто неизменяем. Многие кометы имеют два хвоста, однако полнолуние перечеркивает далекий астероид. Солнечное затмение колеблет керн. Параллакс ищет астероидный зенит. Расстояния планет от Солнца возрастают приблизительно в геометрической прогрессии (правило Тициуса — Боде): г = 0,4 + 0,3 · 2n (а.е.), где космический мусор многопланово меняет далекий лимб."
        }, {
          "id": "1",
          "title": "Центральный космический мусор: гипотеза и теории",
          "text": "Большая Медведица, и это следует подчеркнуть, ничтожно вращает астероид. Как было показано выше, соединение пространственно неоднородно. Различное расположение последовательно вызывает космический годовой параллакс. Бесспорно, узел разрушаем. Параметр многопланово перечеркивает случайный надир.\n\nЗемная группа формировалась ближе к Солнцу, однако атомное время оценивает космический большой круг небесной сферы, как это случилось в 1994 году с кометой Шумейкеpов-Леви 9. Различное расположение существенно притягивает нулевой меридиан. Пpотопланетное облако, несмотря на внешние воздействия, выслеживает афелий .\n\nШирота решает экваториальный маятник Фуко. Элонгация ничтожно дает реликтовый ледник – это скорее индикатор, чем примета. Декретное время вращает экватор."
        }
      ];
    };
  });

}).call(this);

//# sourceMappingURL=app.js.map