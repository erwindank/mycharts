/* Charts Guide lessons — Spanish (see guide-lessons.js for the shape).
   Uses the site's own Spanish labels (translations.es.js): ranking, Semanal,
   Cuadrícula, Aspirantes, Fuera del Ranking… so the guide and the buttons
   always call a thing the same. Anything missing falls back to English. */
window.GL_TEXT = window.GL_TEXT || {};
window.GL_TEXT.es = {
  ui: {
    eyebrow: 'Guía de Charts',
    hero_title: 'Conoce tus rankings a fondo.',
    hero_sub: 'Cada pestaña, cada botón, cada opción, mostrados en la app real. Explora las imágenes, sigue los pasos y luego pruébalo tú.',
    hero_stats: '{{lessons}} lecciones · {{ch}} retos',
    ring_label: 'dominadas',
    ring_of: '{{done}} de {{total}}',
    tab_lessons: 'Lecciones',
    tab_ref: 'Consulta',
    continue: 'Continuar',
    start: 'Empieza aquí',
    continue_note: 'Siguiente: {{what}}',
    tip_title: 'El consejo de hoy',
    tip_new: 'Uno nuevo cada día',
    tip_try: 'Enséñamelo',
    tip_open: 'Abrir la lección',
    area: { start: 'Empieza aquí', charts: 'Tus rankings', insights: 'Estadísticas, récords y premios', more: 'Más pestañas', setup: 'Ajustes' },
    soon: 'Muy pronto',
    mastered: 'Dominada',
    in_progress: '{{pct}}% hecho',
    not_started: 'Sin empezar',
    mins: '{{n}} min',
    back_hub: 'Todas las lecciones',
    sec_screen: 'Conoce la pantalla',
    sec_screen_sub: 'Elige un número para ver qué hace esa parte. Usa ← → para recorrerlas.',
    sec_howto: 'Cómo…',
    sec_howto_sub: 'Recorridos cortos, paso a paso. Cada uno termina contigo probándolo.',
    sec_options: 'Todas las opciones',
    sec_options_sub: 'La lista completa. Toca una imagen para verla más grande.',
    sec_try: 'Pruébalo tú',
    sec_try_sub: 'Hazlos en la app real. La guía se entera, estés donde estés.',
    sec_quiz: 'Repaso rápido',
    sec_quiz_sub: 'Tres preguntas. Acierta todas para dominar la lección.',
    device_desktop: 'Ordenador',
    device_phone: 'Móvil',
    whole: 'Pantalla entera',
    prev: 'Anterior',
    next: 'Siguiente',
    step_of: 'Paso {{n}} de {{total}}',
    steps: '{{n}} pasos',
    start_walk: 'Empezar',
    done: 'Hecho',
    try_now: 'Pruébalo ahora',
    close: 'Cerrar',
    show_me: 'Enséñamelo',
    done_chip: 'Hecho',
    default: 'Por defecto',
    def_on: 'Activado',
    def_off: 'Desactivado',
    correct: '¡Correcto!',
    wrong: 'Casi.',
    retry: 'Inténtalo otra vez',
    quiz_done: 'Las tres bien.',
    next_lesson: 'Siguiente lección',
    toast_title: 'Reto completado',
    toast_progress: '{{done}} de {{total}} en «{{lesson}}»',
    toast_back: 'Volver a la lección',
    coach_back: 'Volver a la guía',
    coach_hint: 'Te toca',
    mastered_title: 'Lección dominada',
    mastered_text: 'Ya conoces «{{lesson}}» a fondo.',
    loading: 'Cargando la guía…',
    search_ph: 'Busca en la guía: un botón, una palabra, una pregunta…',
    search_none: 'No se encontró nada. Prueba otra palabra.',
    sr_lesson: 'Lección', sr_spot: 'En pantalla', sr_howto: 'Cómo', sr_option: 'Opción', sr_challenge: 'Reto',
    sr_faq: 'Pregunta', sr_gloss: 'Glosario', sr_key: 'Atajo', sr_ref: 'Cómo funcionan',
    ref_lesson: 'La lección',
    tour_lesson: 'Lección: {{lesson}}'
  },

  lessons: {
    start: {
      title: 'Primeros pasos',
      promise: 'Revisa tu configuración, aprende a moverte y haz lo primero que vale la pena hacer. Todo lo demás parte de aquí.',
      scenes: {
        bar: { title: 'La barra superior', spots: {
          search: ['{{t:tb_search}}', 'Cualquier canción, artista o álbum de tu biblioteca.'],
          settings: ['{{t:set_title}}', 'De dónde vienen tus reproducciones y cómo funcionan tus rankings.'],
          theme: ['{{t:set_theme}}', 'Doce temas de color.'],
          lang: ['{{t:set_language}}', 'Cuatro idiomas.'],
          signin: ['{{t:tb_sign_in}}', 'Opcional: lo mantiene todo igual en cada dispositivo.']
        } },
        chart: { title: 'Tu ranking', spots: {
          periods: ['Periodos', 'Rankings diarios, semanales, mensuales, anuales y de siempre.'],
          prev: ['Atrás', 'El periodo anterior.'],
          label: ['Cuál', 'Haz clic para ir a cualquier fecha.'],
          next: ['Adelante', 'El periodo siguiente.'],
          tiles: ['De un vistazo', 'Las cifras del periodo.']
        } },
        row: { title: 'Una fila del ranking', spots: {
          rank: ['Puesto', 'Su posición.'],
          move: ['Movimiento', 'Sube, baja, nueva o vuelve desde la última vez.'],
          title: ['La canción', 'Haz clic para verlo todo sobre ella.'],
          peak: ['Pico', 'Su mejor puesto.'],
          weeks: ['Semanas', 'Cuánto tiempo lleva en el ranking.'],
          plays: ['Reproducciones', 'En este periodo.'],
          more: ['⋮', 'Escuchar, añadir a una lista, compartir y más.']
        } }
      },
      howto: {
        first: { title: 'Tus primeros cinco minutos', slides: [
          'Conecta lo que escuchas: Google Sheets, Last.fm o un archivo.',
          'Guarda y se cargan tus reproducciones.',
          'Tu ranking semanal está listo. Prueba los otros periodos.',
          'Lee una fila: su puesto, su movimiento, su pico.',
          'El menú ⋮: escuchar, una lista, compartir.'
        ] },
        around: { title: 'Aprende a moverte', slides: [
          'La búsqueda encuentra cualquier cosa de tu biblioteca.',
          'Cambia de periodo arriba.',
          'Canciones, artistas o álbumes.',
          '{{t:set_title}} tiene el resto.'
        ] }
      },
      options: {
        where: { title: 'Dónde está cada cosa', items: {
          settings: ['{{t:set_title}}', 'Tu fuente, la semana del ranking, la zona horaria, el aspecto y las copias.'],
          search: ['{{t:tb_search}}', 'Pulsa / en cualquier parte.'],
          periods: ['Periodos', 'Cada ranking tiene su propia lección en esta guía.']
        } }
      },
      challenges: {
        'start.data': ['Carga tus reproducciones', 'Conecta una fuente en {{t:set_title}}. Se marca sola cuando llegan.'],
        'start.chart': ['Abre tu ranking semanal', '{{t:tab_charts}} en la barra superior.'],
        'start.tour': ['Haz el recorrido', 'Cuatro minutos por todas las pestañas.'],
        'start.explore': ['Abre otra pestaña', 'Estadísticas, Récords, Premios… la que sea.'],
        'start.size': ['Cambia el tamaño de un ranking', 'El ⋮ encima del ranking → Tamaño.'],
        'start.card': ['Haz una imagen para compartir', 'El ⋮ encima del ranking → Compartir.'],
        'start.playlist': ['Añade algo a una lista', 'El ⋮ de una fila → {{t:ea_add_playlist}}.']
      },
      quiz: {
        q1: ['¿Dónde conectas Last.fm, una hoja de Google o un archivo?',
          ['En el ranking semanal', 'En {{t:set_title}}', 'En la guía'],
          '{{t:set_title}} (el engranaje de la barra superior) se abre en {{t:set_tab_source}}.'],
        q2: ['¿Qué te da el menú ⋮ de una fila?',
          ['Escuchar, añadir a una lista, compartir y más', 'Solo borrar', 'Los ajustes'],
          'Todas las filas tienen uno, y las ventanas también.'],
        q3: ['Escuchaste mucho una canción el marzo pasado. ¿Cómo encuentras esa semana?',
          ['Bajando mucho', 'Ya no está', 'Haz clic en la fecha y elige la semana'],
          'La fecha abre un selector; las flechas avanzan de periodo en periodo.']
      },
      tips: [
        'Pulsa / en cualquier parte para buscar en toda tu biblioteca.',
        'Haz clic en la fecha encima de cualquier ranking para ir directo a una semana, un mes o un año.',
        'Cada fila tiene un menú ⋮: escuchar, añadir a una lista, compartir.'
      ]
    },
    week: {
      title: 'Tu ranking Semanal',
      promise: 'Lee cada número de un ranking, muévete entre semanas y déjalo con el aspecto que más te guste.',
      scenes: {
        top: { title: 'Arriba de la página', spots: {
          periods: ['Periodos', 'Diario, Semanal, Mensual, Anual e Histórico: los mismos rankings sobre otro tramo de tiempo. Las teclas D, W, M, Y y A te llevan directo.'],
          prev: ['Semana anterior', 'Retrocede una semana. La tecla ← hace lo mismo, y en el móvil puedes deslizar el ranking.'],
          label: ['En qué semana estás', 'El nombre de la semana y sus fechas. Haz clic para abrir un calendario y saltar a cualquier semana.'],
          next: ['Semana siguiente', 'Avanza una semana. Sale apagado cuando estás en la semana actual.'],
          streak: ['Racha de escucha', 'Cuántos días seguidos has escuchado algo, y tu mejor racha. Haz clic para ver tus rachas.'],
          banner: ['La semana en una línea', 'Quién se llevó la semana y el dato que vale la pena saber. Mientras la semana sigue en curso, dice quién va primero.'],
          tiles: ['Cuatro números', 'Reproducciones, canciones distintas, artistas y álbumes de la semana. Haz clic en uno para ir a su ranking. Debajo de la línea: tu mejor día y cuánto era nuevo para ti.'],
          delta: ['Cambio frente a la semana pasada', '▲ verde: más que la semana anterior. ▼ rojo: menos.'],
          compare: ['Comparar', 'Abre unas barras que ponen esta semana junto a la anterior, tu semana habitual y tu récord.']
        } },
        chart: { title: 'El ranking', spots: {
          spotlight: ['Del momento', 'Tu canción, artista y álbum más escuchados en los 15 días hasta el final de esta semana, y tu artista en ascenso: el que descubriste en los últimos 45 días y más escuchas.'],
          type: ['Canciones, Artistas, Álbumes', 'Tres rankings de la misma semana. Elige uno; la página recuerda tu elección.'],
          layouts: ['Seis diseños', 'Tabla, Cuadrícula, Compacto, Mosaico, Tira y Pila. El mismo ranking con otro aspecto. Canciones, artistas y álbumes guardan cada uno el suyo.'],
          collapse: ['Plegar el ranking', 'Oculta el ranking pero deja su título, para que la página sea más corta. Pulsa + para abrirlo otra vez.'],
          title: ['Tamaño del ranking', '«Top 10 Canciones»: cuántas entradas tiene este ranking. Cámbialo en ⋮ → Tamaño.'],
          animate: ['Animar ranking', 'Repite las escuchas una a una, del ranking de la semana pasada a este, para que veas cómo las canciones se adelantan unas a otras.'],
          menu: ['Opciones del ranking (⋮)', 'Tres pestañas: Mostrar (más detalles en cada fila), Tamaño (cuántas entradas) y Acciones (escuchar, compartir, exportar).'],
          desc: ['Qué cuenta el ranking', 'Una línea corta bajo el título. Actívala o desactívala en ⋮ → Mostrar → Descripciones.'],
          heads: ['Columnas', 'Puesto, cambio, título y artista, álbum, semanas en el ranking y escuchas.'],
          first: ['Una fila del ranking', 'Haz clic en una fila para abrir su ventana con todo sobre ella. La siguiente imagen desmonta una fila parte por parte.']
        } },
        row: { title: 'Una fila, parte por parte', spots: {
          rank: ['Puesto', 'Dónde está esta semana. La fila del #1 es la dorada.'],
          move: ['Sin cambio (=)', 'El mismo puesto que la semana pasada.'],
          prev: ['Puesto de la semana pasada', 'El número pequeño bajo el cambio: dónde estaba la semana anterior.'],
          up: ['Sube (▲)', 'Sube esos puestos respecto a la semana pasada.'],
          down: ['Baja (▼)', 'Baja esos puestos respecto a la semana pasada.'],
          newe: ['NUEVA', 'Su primera semana en este ranking.'],
          re: ['RE (reentrada)', 'Vuelve al ranking después de haber salido. Conserva su mejor puesto y sus semanas.'],
          art: ['Portada', 'Pulsa ▶ en la portada para oír un fragmento de 30 segundos.'],
          title: ['Título y artista', 'Haz clic en el título para la ventana de la canción, o en el nombre del artista para la suya.'],
          peak: ['Etiqueta de logro', 'El puesto más alto que ha alcanzado en este ranking. Actívala en ⋮ → Mostrar → Etiq. logro.'],
          cert: ['Certificación', 'Oro, Platino o Diamante cuando pasa una cifra de escuchas. Actívala en ⋮ → Mostrar → Insignias cert.'],
          album: ['Álbum', 'Haz clic para la ventana del álbum.'],
          weeks: ['Semanas en el ranking', 'Cuántas semanas ha pasado en el ranking en total, sumando todas sus etapas. Nunca se reinicia.'],
          plays: ['Escuchas', 'Escuchas de esta semana. Es lo único por lo que se ordena el ranking.'],
          pdelta: ['Cambio de escuchas', 'Cuántas más o menos que la semana pasada.'],
          best: ['Pico de escuchas (▲ MÁX)', 'Su mayor número de escuchas en una semana hasta ahora. Actívalo en ⋮ → Mostrar → Pico reprods.'],
          spotify: ['Spotify', 'La busca en Spotify.'],
          more: ['Menú de la fila (⋮)', 'Escúchala, añádela a una lista, abre su ventana y más. Con clic derecho en una fila sale el mismo menú.'],
          run: ['Trayectoria', 'Abre su trayectoria bajo la fila: cada semana que estuvo en el ranking, y en qué puesto.']
        } },
        run: { title: 'Una fila abierta', spots: {
          run: ['El botón de trayectoria', 'Se ilumina mientras el panel está abierto. Púlsalo otra vez para cerrarlo.'],
          facts: ['Álbum y artistas', 'Haz clic en cualquiera para abrir su ventana.'],
          acts: ['Acciones rápidas', 'Fragmento (30 segundos), el vídeo, añadir a una lista, YouTube, y Detalles para su ventana completa.'],
          range: ['Rango', 'Cuenta su trayectoria en lo que va de año, hasta la semana en la que estás, o desde siempre.'],
          now: ['Esta semana', 'Su puesto de la semana pasada, las escuchas de esta semana con el cambio, y su certificación.'],
          story: ['Su historia en una línea', 'Cómo debutó, cuánto tiempo pasó en su mejor puesto y cuánto en el ranking.'],
          ribbon: ['Totales', 'Mejor puesto, semanas en ese puesto, semanas en el ranking y escuchas. Haz clic en las semanas en el mejor puesto para ver cuáles fueron.'],
          boxes: ['Semana a semana', 'Una casilla por cada semana en el ranking: su puesto y la semana. Las doradas son semanas en su mejor puesto.'],
          goals: ['Próximo hito', 'Lo siguiente que puede alcanzar y cuántas escuchas le faltan, y luego los siguientes.'],
          more: ['Más', 'Récords de racha, un mapa de calor y todo su historial de escuchas, cada uno plegado hasta que lo abras.']
        } },
        replay: { title: 'Animar ranking', spots: {
          when: ['El momento que ves', 'El ranking se cuenta sobre 7 días que avanzan, escucha a escucha, de la semana pasada a esta. Estos son los 7 días que cuentan ahora.'],
          count: ['Cuánto lleva', 'Por qué escucha va, del total.'],
          days: ['La semana que se desliza', 'Los días de la semana pasada y los de esta. El bloque marcado son los 7 días que se cuentan. Haz clic en un día para saltar ahí.'],
          ends: ['Principio y final', 'Empieza en el ranking anterior y acaba en este.'],
          scrub: ['Barra de tiempo', 'Arrástrala a cualquier momento intermedio.'],
          play: ['Reproducir / pausa', 'La barra espaciadora hace lo mismo.'],
          step: ['Avanzar paso a paso', '−1d y +1d saltan un día entero, ◀ y ▶ una escucha, ⏮ y ⏭ a cualquiera de los extremos.'],
          speeds: ['Velocidad', 'Desde la mitad hasta 20 veces más rápido.'],
          log: ['Lo que acaba de cambiar', 'Las últimas escuchas que entran (+) y salen (−) de los 7 días, con su hora.'],
          keys: ['Teclas', 'Espacio, ← →, Mayús + ← → e Inicio / Fin funcionan mientras se reproduce.'],
          close: ['Cerrar', 'Vuelve al ranking normal. Esc hace lo mismo.']
        } }
      },
      howto: {
        nav: { title: 'Ir a otra semana', slides: [
          'Pulsa ‹ para retroceder una semana. La tecla ← también sirve.',
          'Pulsa › para volver a avanzar. En el móvil, desliza el ranking a izquierda o derecha.',
          'Para saltar más lejos, haz clic en el nombre de la semana. Se abre un calendario: elige cualquier día y el ranking va a la semana de ese día.',
          '¿Prefieres un mes o un año? Elige Mensual o Anual aquí arriba.'
        ] },
        size: { title: 'Hacer el ranking más largo', slides: [
          'Abre ⋮ junto al ranking.',
          'Elige la pestaña Tamaño.',
          'Escoge desde Top 10 hasta Top 100.',
          'El título cambia con él. Diario, Semanal, Mensual y Anual recuerdan cada uno su propio tamaño.'
        ] },
        layout: { title: 'Cambiar el aspecto del ranking', slides: [
          'Estos seis botones cambian el diseño. Tabla es el que tienes al empezar.',
          'Cuadrícula: portadas grandes, para ir bajando.',
          'Mosaico: tus primeras entradas en mosaicos grandes y el resto más pequeñas.',
          'Tira: un podio para los tres primeros y todo lo demás en una tira.',
          'Compacto: una línea fina por entrada, para que quepa lo máximo en pantalla.',
          'Pila: tarjetas una encima de otra. Solo Pila tiene este botón extra, que la divide en dos columnas.'
        ] },
        details: { title: 'Ver más en cada fila', slides: [
          'Abre ⋮ junto al ranking.',
          'La pestaña Mostrar. Todo empieza desactivado, para que el ranking se vea tranquilo.',
          'Marca lo que quieras, por ejemplo Etiq. logro.',
          'Aparece en cada fila al momento.',
          'En Secciones eliges qué listas salen bajo el ranking: Aspirantes, Fuera del Ranking y Nuevas Entradas.'
        ] },
        type: { title: 'Ver tus artistas o álbumes', slides: [
          'Canciones, Artistas y Álbumes son tres rankings de la misma semana.',
          'Artistas: cuenta cada escucha de cualquiera de sus canciones.',
          'Álbumes: las escuchas de las canciones de cada álbum, sumadas.'
        ] },
        run: { title: 'Seguir la trayectoria de una canción', slides: [
          'Pulsa las barritas al final de una fila.',
          'Su trayectoria se abre bajo la fila: una casilla por cada semana que pasó en el ranking, con su puesto.',
          'Cambia el rango para contar su trayectoria en este año, hasta esta semana o desde siempre.',
          'Pon un fragmento o el vídeo, o añádela a una lista, desde aquí mismo.',
          'El ⋮ de la fila tiene todo lo demás, incluidos su álbum y su artista. Con clic derecho en la fila sale el mismo menú.'
        ] },
        animate: { title: 'Ver cómo la semana pasada se convierte en esta', slides: [
          'Pulsa Animar ranking encima del ranking.',
          'Empieza en el ranking de la semana pasada. Luego 7 días avanzan, escucha a escucha, y las canciones se mueven según entran y salen escuchas.',
          'Párala cuando quieras, o avanza una escucha o un día entero cada vez.',
          'O arrastra la barra de tiempo a cualquier momento.',
          'Esta lista muestra lo que acaba de entrar y lo que acaba de salir.',
          'Ciérrala para volver al ranking normal.'
        ] }
      },
      options: {
        layouts: { title: 'Diseños', items: {
          table: ['Tabla', 'Filas con todas las columnas. La que tienes al empezar.'],
          grid: ['Cuadrícula', 'Portadas grandes en cuadrícula.'],
          compact: ['Compacto', 'Una línea fina por entrada. Es la que más cabe en pantalla.'],
          mosaic: ['Mosaico', 'Las primeras entradas en mosaicos grandes, el resto más pequeñas.'],
          filmstrip: ['Tira', 'Un podio para los tres primeros y el resto en una tira que puedes deslizar o poner en desplazamiento automático.'],
          stack: ['Pila', 'Tarjetas una encima de otra, con opción de dos columnas.']
        } },
        show: { title: '⋮ → Mostrar', items: {
          cert: ['Insignias cert', 'Oro, Platino y Diamante en canciones y álbumes que pasaron una cifra de escuchas.'],
          score: ['Mis notas', 'Tu valoración, en todo lo que hayas valorado.'],
          ppeak: ['Pico reprods', 'Una etiqueta ▲ MÁX cuando una entrada tiene su máximo de escuchas en una semana.'],
          ptags: ['Etiq. logro', 'El puesto más alto que ha alcanzado cada entrada.'],
          bulegend: ['Leyenda aspirantes', 'La explicación de las etiquetas de Aspirantes.'],
          desc: ['Descripciones', 'Una línea corta bajo el título de cada ranking que dice qué cuenta.']
        } },
        sections: { title: '⋮ → Mostrar → Secciones', items: {
          normal: ['Ranking', 'El ranking en sí. Desactívalo para ver solo las listas de debajo.'],
          bu: ['Aspirantes', 'Las entradas que se quedaron justo por debajo del corte.'],
          off: ['Fuera del Ranking', 'Lo que salió esta semana.'],
          new: ['Nuevas Entradas', 'Todo lo nuevo de esta semana, en una lista.']
        } },
        size: { title: '⋮ → Tamaño', items: {
          week: ['Tamaños del Semanal', 'Top 10, 20, 25, 30, 50 o 100.'],
          other: ['Otros rankings', 'Diario: Top 10 a 50 (empieza en 20). Mensual: 25 a 100 (empieza en 50). Anual: 50, 100, 200 o todo (empieza en 100). Histórico: 50, 100, 200 o todo (empieza en todo).']
        } },
        actions: { title: '⋮ → Acciones', items: {
          playall: ['Escuchar todo', 'Pone las canciones del ranking en orden en el reproductor.'],
          shuffle: ['Aleatorio', 'Lo mismo, en orden aleatorio.'],
          export: ['Exportar playlist', 'El ranking como lista: cópiala, guárdala como texto o llévala a Spotify y otros.'],
          share: ['Compartir como imagen', 'Una imagen del ranking para redes sociales, en varios tamaños y estilos.'],
          pdf: ['PDF imprimible', 'El ranking preparado para imprimir o guardar como PDF.']
        } },
        badges: { title: 'Insignias de una fila', items: {
          up: ['▲ Sube', 'Sube esos puestos.'],
          down: ['▼ Baja', 'Baja esos puestos.'],
          same: ['= Sin cambio', 'El mismo puesto que la semana pasada.'],
          newe: ['NUEVA', 'Primera semana en el ranking.'],
          re: ['RE', 'Vuelve después de haber salido.'],
          peak: ['LOGRO #', 'Su mejor puesto.'],
          cert: ['Oro / Platino / Diamante', 'Pasó una cifra de escuchas.'],
          best: ['▲ MÁX', 'Más escuchas en una semana hasta ahora.']
        } }
      },
      challenges: {
        'week.prev': ['Retrocede una semana', 'Pulsa ‹ o la tecla ←.'],
        'week.jump': ['Abre el calendario', 'Haz clic en el nombre de la semana.'],
        'week.type': ['Mira tu ranking de Artistas o Álbumes', 'Usa el selector encima del ranking.'],
        'week.layout': ['Prueba un diseño que no sea Tabla', 'Cualquiera de los seis botones de diseño.'],
        'week.size': ['Cambia el tamaño del ranking', '⋮ → Tamaño.'],
        'week.show': ['Activa algo en ⋮ → Mostrar', 'Etiq. logro es buena para empezar.'],
        'week.animate': ['Anima el ranking', 'Pulsa Animar ranking.'],
        'week.run': ['Abre la trayectoria de una canción', 'Las barritas al final de una fila.']
      },
      quiz: {
        q1: ['Una fila muestra RE. ¿Qué significa?',
          ['Es nueva esta semana', 'Volvió después de haber salido', 'Repitió el puesto de la semana pasada'],
          'RE significa reentrada: estuvo en el ranking, salió y ha vuelto. Conserva su mejor puesto y sus semanas.'],
        q2: ['Una canción muestra ▲7 con un #9 pequeño debajo. ¿Dónde estaba la semana pasada?',
          ['#7', '#9', '#16'],
          'El número pequeño es su puesto de la semana pasada. Subió 7 puestos, del #9 al #2.'],
        q3: ['¿Qué decide el puesto de una canción en el ranking Semanal?',
          ['Sus escuchas de esa semana', 'Sus escuchas de siempre', 'Su mejor puesto hasta ahora'],
          'Solo cuentan las escuchas dentro de esa semana. Nada se arrastra de semanas anteriores.']
      },
      tips: [
        'Pulsa ← y → para pasar de semana sin tocar el ratón.',
        'Haz clic derecho en cualquier fila (o pulsa su ⋮) para escuchar, añadir a una lista y más.',
        'Canciones, Artistas y Álbumes recuerdan cada uno su diseño, así que los álbumes pueden ir en Mosaico y las canciones en Tabla.',
        'Animar ranking repite el paso del ranking de la semana pasada a este, escucha a escucha. Pruébalo en una semana con una lucha reñida por el #1.',
        'Haz clic en cualquiera de los cuatro números para ir directo a ese ranking.'
      ]
    },

    daily: {
      title: 'Tu ranking Diario',
      promise: 'Un día cada vez: su ranking, cuándo escuchaste, cómo te sentiste y qué te recuerda.',
      scenes: {
        top: { title: 'Arriba de la página', spots: {
          daily: ['{{t:nav_daily}}', 'El ranking de hoy y de cualquier día anterior. La tecla D te trae aquí.'],
          prev: ['Día anterior', 'Retrocede un día. La tecla ← hace lo mismo.'],
          label: ['Qué día', 'Haz clic para abrir un calendario y saltar a cualquier día.'],
          next: ['Día siguiente', 'Avanza un día.'],
          banner: ['El día en una línea', 'Quién se llevó el día y qué lo hizo especial. Hoy dice quién va primero.'],
          peak: ['Etiqueta de récord', 'Aparece cuando un número es un récord, como tu día más grande del mes o de siempre.'],
          tiles: ['Cuatro números', 'Reproducciones, canciones distintas, artistas y álbumes del día, con el cambio frente al día con el que comparas.'],
          hours: ['Escuchas por hora', 'Cada hora del día y cuántas escuchas tuvo.'],
          best: ['Hora más activa', 'La casilla dorada es la hora en que más escuchaste.'],
          share: ['Compartir', 'Guarda estos números como imagen.']
        } },
        tools: { title: 'Herramientas sobre el ranking', spots: {
          cmp: ['{{t:dy_compare_label}}', 'Con qué día se miden las flechas y los cambios.'],
          cmp1: ['{{t:dy_vs_yesterday}}', 'Frente al día anterior. La opción con la que empiezas.'],
          cmp2: ['El mismo día de la semana', 'Frente al mismo día de la semana anterior: un martes se mide con el martes pasado.'],
          no1: ['{{t:dy_no1_today}}', 'Tu canción #1 del día, y cuántos días seguidos lleva en el #1.'],
          recap: ['{{t:dy_recap}}', 'El día como una historia corta, una tarjeta cada vez.'],
          share: ['{{t:dy_share_img}}', 'Una imagen del ranking del día para compartir.'],
          play: ['Escuchar las primeras', 'Pone el ranking del día en orden.'],
          cal: ['{{t:dy_cal_title}}', 'Un mes de días, cada uno con la portada de su #1. Haz clic en uno para abrirlo.'],
          save: ['{{t:dy_save_pl}}', 'Guarda el ranking del día como una de tus listas.'],
          export: ['{{t:dy_export}}', 'El ranking como lista para copiar, guardar como texto o llevar a Spotify y otros.'],
          title: ['Tamaño del ranking', 'Cuántas canciones tiene el ranking Diario. Cámbialo en ⋮ → Tamaño.'],
          heads: ['Columnas', 'Puesto, cambio, título y artista, álbum, días en el ranking y escuchas.']
        } },
        panel: { title: 'Tu día', spots: {
          today: ['El día', 'Las escuchas del día frente a tu día habitual.'],
          week: ['Últimos 7 días', 'Una barra por cada uno de los últimos 7 días, y el total frente a los 7 anteriores.'],
          first: ['Primera escucha', 'La primera canción del día, y a qué hora.'],
          last: ['Última escucha', 'La última canción del día, y a qué hora.'],
          topart: ['{{t:dy_top_artist}}', 'A quién escuchaste más ese día.'],
          repeat: ['{{t:ns_x_on_repeat}}', 'Canciones que has escuchado casi todos los últimos 7 días. Van pasando solas.'],
          moods: ['Estado de ánimo', 'Elige cómo te sentiste ese día.'],
          note: ['Una línea sobre tu día', 'Dónde estabas, qué pasó. Hasta 500 caracteres.'],
          status: ['Dónde se guarda', 'En este navegador. Inicia sesión y te sigue a todos tus dispositivos.']
        } },
        time: { title: 'Momento del día y patrones', spots: {
          busiest: ['{{t:dy_busiest}}', 'La hora con más escuchas.'],
          sessions: ['Sesiones de escucha', 'Cuántos ratos de escucha separados tuvo el día.'],
          longest: ['{{t:dy_longest_lbl}}', 'Tu rato más largo sin una pausa larga, y cuándo fue.'],
          tl: ['Portadas por hora', 'La canción más escuchada de cada hora.'],
          hours: ['Barras por hora', 'Cuántas escuchas tuvo cada hora. Haz clic en una barra para ver esa hora.'],
          busy: ['La barra más alta', 'Resaltada para que la encuentres rápido.'],
          hourcard: ['La hora que elegiste', 'Sus escuchas y su canción más escuchada.'],
          parts: ['Partes del día', '{{t:dy_part_night}}, {{t:dy_part_morning}}, {{t:dy_part_afternoon}} y {{t:dy_part_evening}}: sus escuchas, su parte del día y su canción principal. La más activa lleva la marca {{t:dy_part_peak}}.'],
          replayed: ['{{t:dy_pat_most}}', 'La canción que más escuchaste ese día.'],
          b2b: ['{{t:dy_pat_b2b}}', 'Las veces seguidas que sonó una canción, y un artista.'],
          full: ['{{t:dy_pat_full}}', 'Álbumes de los que escuchaste todas las canciones ese día.'],
          variety: ['{{t:dy_pat_variety}}', 'De fiel (siempre las mismas) a explorador (siempre algo distinto).'],
          genres: ['{{t:dy_genre_title}}', 'Los géneros que escuchaste ese día, como parte de tus escuchas.']
        } },
        mem: { title: 'Recuerdos e hitos', spots: {
          otd: ['{{t:dy_otd}}', 'Lo que escuchabas en esta fecha en años anteriores.'],
          forgot: ['{{t:dy_forgot}}', 'Canciones que escuchabas mucho y llevas tiempo sin poner.'],
          back: ['{{t:dy_comeback}}', 'Canciones que volviste a poner ese día después de mucho tiempo.'],
          firsth: ['{{t:dy_first}}', 'Canciones y artistas que oíste por primera vez ese día.'],
          list: ['La lista', 'Haz clic en una fila para abrir su ventana.'],
          awards: ['{{t:dy_aw_title}}', 'La canción, el artista, el álbum, el descubrimiento y la vuelta del día.'],
          mshit: ['{{t:dy_ms_hit}}', 'Cifras de escuchas alcanzadas ese día, como la escucha 500 de una canción.'],
          msrec: ['{{t:dy_rec_title}}', 'Récords batidos ese día.'],
          msstreak: ['{{t:dy_streaks}}', 'Días seguidos escuchando una canción o un artista, y rachas que terminaron.'],
          msgoal: ['{{t:dy_goals}}', 'Lo lejos que está el día de tus mejores días.'],
          msnear: ['{{t:dy_close_title}}', 'Hitos a pocas escuchas.']
        } },
        recap: { title: '{{t:dy_recap}}', spots: {
          bars: ['Progreso', 'Una barra por cada tarjeta de la historia.'],
          big: ['Una tarjeta', 'Una cosa del día por tarjeta: las escuchas, la canción #1, el artista principal, cuándo escuchaste, tu variedad y lo más destacado. La última tarjeta puede compartir el día o poner sus canciones.'],
          next: ['Tarjeta siguiente', 'Toca el lado derecho o pulsa →.'],
          prev: ['Tarjeta anterior', 'Toca el lado izquierdo o pulsa ←.'],
          x: ['Cerrar', 'Esc hace lo mismo.']
        } },
        cal: { title: '{{t:dy_cal_title}}', spots: {
          title: ['El mes', 'Qué mes estás viendo.'],
          prev: ['Mes anterior', 'Retrocede un mes. La tecla ← hace lo mismo.'],
          next: ['Mes siguiente', 'Avanza un mes. La tecla → hace lo mismo.'],
          grid: ['Cada día', 'Cada día muestra la portada de su canción #1.'],
          day: ['Un día', 'Haz clic para abrir el ranking de ese día.'],
          share: ['Compartir', 'Convierte el mes en una imagen para compartir.'],
          x: ['Cerrar', 'Esc hace lo mismo.']
        } }
      },
      howto: {
        pick: { title: 'Ir a otro día', slides: [
          'Pulsa ‹ para el día anterior. La tecla ← también sirve.',
          'O haz clic en la fecha para elegir cualquier día en un calendario.',
          '{{t:dy_cal_title}} muestra un mes entero de un vistazo.',
          'Cada día tiene la portada de su #1. Haz clic en uno para abrir ese día.'
        ] },
        compare: { title: 'Elegir con qué se compara el día', slides: [
          'El cambio se mide, al empezar, frente a ayer.',
          'Elige el mismo día de la semana para comparar, por ejemplo, este martes con el martes pasado.',
          'Las flechas, las etiquetas NUEVA y RE y los cambios siguen tu elección.'
        ] },
        recap: { title: 'Ver tu día como una historia', slides: [
          'Pulsa {{t:dy_recap}}.',
          'El día llega en tarjetas, una cosa cada vez.',
          'Toca el lado derecho para la siguiente.',
          'Ciérrala cuando quieras.'
        ] },
        diary: { title: 'Llevar un diario de tus días', slides: [
          'Elige cómo te sentiste ese día.',
          'Añade una línea: dónde estabas, qué pasó.',
          'Se guarda al momento. Inicia sesión y te sigue a todos tus dispositivos.'
        ] },
        hours: { title: 'Ver cuándo escuchaste', slides: [
          'Cada barra es una hora. Haz clic en una.',
          'Aquí salen las escuchas de esa hora y su canción más escuchada.',
          'Las cuatro partes del día lo resumen, con la canción principal de cada una.'
        ] },
        memories: { title: 'Mirar atrás desde cualquier día', slides: [
          '{{t:dy_otd}}: lo que escuchabas en esta fecha en años anteriores.',
          '{{t:dy_forgot}}: viejas favoritas que llevas tiempo sin poner.',
          '{{t:dy_comeback}}: canciones que volvieron ese día.',
          '{{t:dy_first}}: todo lo que oíste por primera vez.',
          'Más abajo, {{t:dy_ms_title}} cuenta lo que alcanzó el día y lo cerca que estás de tus mejores días.'
        ] },
        keep: { title: 'Guardar un día', slides: [
          '{{t:dy_save_pl}} guarda el ranking como una de tus listas.',
          '{{t:dy_export}} te da la lista para Spotify y otros.',
          '{{t:dy_share_img}} hace una imagen del ranking.'
        ] }
      },
      options: {
        actions: { title: 'Botones sobre el ranking', items: {
          recap: ['{{t:dy_recap}}', 'El día como una historia de tarjetas.'],
          share: ['{{t:dy_share_img}}', 'Una imagen del ranking del día.'],
          play: ['Escuchar las primeras', 'Pone el ranking del día en orden.'],
          cal: ['{{t:dy_cal_title}}', 'Un mes de días con las portadas de sus #1.'],
          save: ['{{t:dy_save_pl}}', 'El ranking como una de tus listas.'],
          export: ['{{t:dy_export}}', 'El ranking como lista para otras apps.']
        } },
        compare: { title: '{{t:dy_compare_label}}', items: {
          yday: ['{{t:dy_vs_yesterday}}', 'Frente al día anterior.'],
          wday: ['El mismo día de la semana', 'Frente al mismo día de la semana anterior.']
        } },
        sections: { title: 'Bajo el ranking', items: {
          panel: ['El día', 'Escuchas frente a tu día habitual, los últimos 7 días, primera y última escucha, artista principal y en bucle.'],
          diary: ['{{t:dy_diary_title}}', 'Un estado de ánimo y una línea sobre el día.'],
          time: ['{{t:dy_tod_title}}', 'Escuchas por hora, sesiones y las cuatro partes del día.'],
          pats: ['{{t:dy_pat_title}}', 'La más repetida, seguidas, álbumes completos, variedad y géneros.'],
          mem: ['{{t:dy_mem_title}}', 'Esta fecha en años anteriores, viejas favoritas, vueltas y primeras escuchas.'],
          ms: ['{{t:dy_ms_title}}', 'Los premios, hitos, récords, rachas y metas del día.']
        } },
        memtabs: { title: '{{t:dy_mem_title}}', items: {
          otd: ['{{t:dy_otd}}', 'Esta fecha en años anteriores.'],
          forgot: ['{{t:dy_forgot}}', 'Viejas favoritas que se apagaron.'],
          back: ['{{t:dy_comeback}}', 'De vuelta tras mucho tiempo.'],
          firsth: ['{{t:dy_first}}', 'Oídas por primera vez.'],
          throw: ['{{t:dy_throw}}', 'Favoritos de siempre que llevas tiempo sin poner. Cada pestaña solo sale los días que tiene algo.']
        } },
        mstabs: { title: '{{t:dy_ms_title}}', items: {
          hit: ['{{t:dy_ms_hit}}', 'Cifras de escuchas alcanzadas.'],
          rec: ['{{t:dy_rec_title}}', 'Récords batidos ese día.'],
          streak: ['{{t:dy_streaks}}', 'Rachas de días mantenidas o terminadas.'],
          goal: ['{{t:dy_goals}}', 'Lo lejos de tus mejores días.'],
          near: ['{{t:dy_close_title}}', 'Hitos a pocas escuchas.']
        } },
        size: { title: '⋮ → Tamaño', items: {
          day: ['Tamaños del Diario', 'Top 10, 20, 25, 30 o 50.']
        } }
      },
      challenges: {
        'day.prev': ['Retrocede un día', 'Pulsa ‹ o la tecla ←.'],
        'day.cmp': ['Compara con el mismo día de la semana', 'El selector junto a {{t:dy_compare_label}}.'],
        'day.recap': ['Abre {{t:dy_recap}}', 'El primer botón sobre el ranking.'],
        'day.cal': ['Abre el {{t:dy_cal_title}}', 'Un botón sobre el ranking.'],
        'day.mood': ['Elige un estado de ánimo para un día', 'En {{t:dy_diary_title}}.'],
        'day.hour': ['Elige una hora', 'Una barra en {{t:dy_tod_title}}.'],
        'day.tab': ['Abre otra pestaña de Recuerdos o Hitos', 'Por ejemplo {{t:dy_forgot}}.'],
        'day.save': ['Guarda un día como lista', '{{t:dy_save_pl}} sobre el ranking.']
      },
      quiz: {
        q1: ['Comparas con el mismo día de la semana. ¿Con qué se mide hoy?',
          ['Con ayer', 'Con el mismo día de la semana anterior', 'Con tu mejor día'],
          'Compara, por ejemplo, este martes con el martes pasado: más justo cuando tus días de la semana son distintos.'],
        q2: ['¿Dónde escribes una línea sobre cómo fue el día?',
          ['{{t:dy_diary_title}}', '{{t:dy_mem_title}}', '{{t:dy_recap}}'],
          '{{t:dy_diary_title}} guarda un estado de ánimo y una línea para cada día.'],
        q3: ['¿Qué muestra {{t:dy_otd}}?',
          ['Lo que escuchabas en esta fecha en años anteriores', 'La canción más escuchada de hoy', 'Canciones que nunca has oído'],
          'Mira la misma fecha en cada año anterior del que tienes escuchas.']
      },
      tips: [
        '{{t:dy_recap}} convierte cualquier día en una historia de tarjetas. Pruébalo con tu día más activo.',
        '{{t:dy_mem_title}} → {{t:dy_otd}} muestra lo que escuchabas en esta fecha en años anteriores.',
        'El {{t:dy_cal_title}} muestra la portada del #1 de cada día: un mes entero de un vistazo.',
        'Elige un estado de ánimo y añade una línea en {{t:dy_diary_title}}, y la pestaña Diario se convierte en un diario musical.'
      ]
    },

    periods: {
      title: 'Rankings Mensual y Anual',
      promise: 'Meses que muestran lo que de verdad se quedó, rankings de fin de año de cualquier año y qué significa cada etiqueta de récord.',
      scenes: {
        mtop: { title: 'Un mes', spots: {
          monthly: ['{{t:nav_monthly}}', 'Un mes natural cada vez. La tecla M te trae aquí.'],
          yearly: ['{{t:nav_yearly}}', 'Un año natural cada vez. La tecla Y te trae aquí.'],
          label: ['Qué mes', 'Haz clic para saltar a cualquier mes. ‹ y › avanzan de mes en mes.'],
          banner: ['El mes en una línea', 'Quién se lo llevó, y cómo se compara con tus otros meses.'],
          peak: ['Etiqueta de récord', '{{t:stat_alltime_peak}}: ningún mes ha superado nunca este número.'],
          tiles: ['Cuatro números', 'Reproducciones, canciones distintas, artistas y álbumes, con el cambio frente al mes anterior.'],
          days: ['Escuchas por día', 'Cada día del mes y sus escuchas.'],
          day: ['Un día', 'Haz clic en cualquier día para abrirlo en el ranking Diario.'],
          best: ['Mejor día', 'La casilla dorada es el día más activo del mes.'],
          share: ['Compartir', 'Guarda estos números como imagen.']
        } },
        mchart: { title: 'El ranking mensual', spots: {
          title: ['Tamaño del ranking', 'Mensual empieza en Top 50. Cámbialo en ⋮ → Tamaño.'],
          heads: ['Columnas', 'Igual que el Semanal, pero cuenta meses en el ranking.'],
          months: ['Meses en el ranking', 'Cuántos meses ha pasado en el ranking en total.'],
          newe: ['NUEVA', 'Su primer mes en el ranking.'],
          up: ['Sube', 'Sube esos puestos respecto al mes pasado.'],
          plays: ['Escuchas', 'Escuchas de todo el mes. Una canción necesita escucharse de forma constante, no solo una semana intensa.']
        } },
        mnew: { title: 'Lo nuevo del mes', spots: {
          bar: ['{{t:atc_title}}', 'Las listas alrededor del ranking. En Mensual y Anual son las nuevas entradas.'],
          tabs: ['{{t:atc_tab_new}}', 'Todo lo nuevo de este mes, con su número.'],
          fold: ['Plegar', 'Oculta el bloque y deja su título.'],
          chip1: ['{{t:ne_filter_all}}', 'Todas las canciones nuevas del mes.'],
          chip2: ['{{t:ne_filter_chart}}', 'Solo las nuevas que entraron en el ranking.'],
          chip3: ['{{t:ne_filter_new_artists}}', 'Solo canciones de artistas que nunca habías escuchado.'],
          row: ['Una canción nueva', 'Haz clic para abrir su ventana.'],
          debut: ['Debut', 'El puesto con el que entró en el ranking.'],
          biggest: ['Debut récord', 'Aparece cuando un debut es el más grande de siempre, o en mucho tiempo.'],
          caps: ['Semana a semana', 'Una marca por semana del mes. Las encendidas son semanas en que la escuchaste; cuanto más brillante, más escuchas.'],
          ndays: ['Semanas escuchada', 'En cuántas semanas del mes se escuchó.']
        } },
        cert: { title: 'Certificados este mes', spots: {
          title: ['{{t:creel_title}}', 'Canciones y álbumes que llegaron a Oro, Platino o Diamante durante este mes.'],
          count: ['Cuántos', 'El número de certificados este mes.'],
          filter: ['Filtro', 'Todos, solo canciones o solo álbumes.'],
          plaque: ['Una placa', 'El premio, para qué es y el día en que se alcanzó.'],
          hint: ['Explorar', 'Las placas pasan solas. Pasa el ratón por encima para pararlas, arrastra para explorarlas.'],
          collapse: ['Plegar', 'Oculta las placas y deja el título.']
        } },
        ytop: { title: 'Un año', spots: {
          yearly: ['{{t:nav_yearly}}', 'Un año natural cada vez.'],
          label: ['Qué año', 'Haz clic para elegir otro año. ‹ y › avanzan de año en año.'],
          banner: ['El año en una línea', 'Quién se llevó tu año y lo grande que fue.'],
          peak: ['Etiqueta de récord', '{{t:stat_peak_at_time}}: fue un récord cuando ocurrió y se ha superado después.'],
          tiles: ['Cuatro números', 'Las reproducciones, canciones, artistas y álbumes del año, con el cambio frente al año anterior.'],
          months: ['Escuchas por mes', 'Cada mes del año. Haz clic en uno para abrirlo.'],
          best: ['Mejor mes', 'La casilla dorada es el mes más activo del año.']
        } },
        ychart: { title: 'El ranking anual', spots: {
          title: ['Tamaño del ranking', 'Anual empieza en Top 100, y llega a 200 o a todas las canciones que escuchaste.'],
          search: ['Buscar en el ranking', 'Escribe parte de un título o de un artista para encontrarlo en el ranking.'],
          heads: ['Columnas', 'Cuenta años en el ranking.'],
          years: ['Años en el ranking', 'En cuántos rankings de fin de año ha entrado.'],
          up: ['Sube', 'Sube respecto a su puesto en el ranking del año pasado.'],
          newe: ['NUEVA', 'Su primer ranking de fin de año.'],
          menu: ['Opciones del ranking (⋮)', 'Mostrar, Tamaño y Acciones, como en el Semanal.']
        } }
      },
      howto: {
        month: { title: 'Ver un mes', slides: [
          'Elige {{t:nav_monthly}}.',
          '‹ y › avanzan un mes. Haz clic en el nombre para saltar más lejos.',
          'Haz clic en cualquier día de la tira para abrirlo en el ranking Diario.'
        ] },
        year: { title: 'Ver un año', slides: [
          'Elige {{t:nav_yearly}}.',
          'Avanza un año con ‹ y ›, o haz clic en el año para elegir uno.',
          'Haz clic en un mes de la tira para abrirlo.'
        ] },
        peaks: { title: 'Leer las etiquetas de récord', slides: [
          '{{t:stat_alltime_peak}}: ningún mes (o año) ha superado nunca este número.',
          '{{t:stat_peak_at_time}}: fue un récord cuando ocurrió y se ha superado después.'
        ] },
        newones: { title: 'Encontrar lo nuevo', slides: [
          'Bajo el ranking, {{t:atc_tab_new}} reúne todas las canciones nuevas del mes.',
          '{{t:ne_filter_chart}} deja solo las que entraron en el ranking.',
          'Cada una muestra dónde debutó.',
          'Y en qué semanas del mes la escuchaste.'
        ] },
        cert: { title: 'Ver qué llegó a Oro', slides: [
          'Filtra las placas: todas, canciones o álbumes.',
          'Cada placa dice para qué es y el día en que se alcanzó.',
          'Pasa el ratón para parar la tira, o arrástrala para explorar.'
        ] },
        find: { title: 'Encontrar una canción en un ranking largo', slides: [
          'Escribe en el buscador sobre el ranking.',
          'Solo quedan las filas que coinciden, con su puesto real.'
        ] }
      },
      options: {
        size: { title: '⋮ → Tamaño', items: {
          month: ['Tamaños del Mensual', 'Top 25, 30, 50 o 100.'],
          year: ['Tamaños del Anual', 'Top 50, 100, 200 o todas las canciones.']
        } },
        peaks: { title: 'Etiquetas de récord en los números', items: {
          alltime: ['{{t:stat_alltime_peak}}', 'Lo más grande de siempre, aún sin superar.'],
          attime: ['{{t:stat_peak_at_time}}', 'Un récord cuando ocurrió, superado después.']
        } },
        newchips: { title: '{{t:atc_tab_new}}', items: {
          all: ['{{t:ne_filter_all}}', 'Todas las canciones nuevas.'],
          made: ['{{t:ne_filter_chart}}', 'Las nuevas que entraron en el ranking.'],
          artists: ['{{t:ne_filter_new_artists}}', 'Canciones de artistas nuevos para ti.']
        } },
        certf: { title: '{{t:creel_title}}', items: {
          filter: ['{{t:certd_all}} / {{t:chart_type_songs}} / {{t:chart_type_albums}}', 'Qué placas mostrar.']
        } }
      },
      challenges: {
        'per.month': ['Abre el ranking Mensual', '{{t:nav_monthly}}, junto a {{t:nav_weekly}}.'],
        'per.year': ['Abre el ranking Anual', '{{t:nav_yearly}}, junto a {{t:nav_monthly}}.'],
        'per.day': ['Abre un día desde un mes', 'Haz clic en un día de la tira de escuchas por día.'],
        'per.new': ['Filtra las canciones nuevas', '{{t:ne_filter_chart}}, bajo el ranking.'],
        'per.cert': ['Filtra las placas certificadas', 'Canciones o Álbumes.'],
        'per.search': ['Busca en un ranking Anual', 'El buscador sobre el ranking.']
      },
      quiz: {
        q1: ['Un número dice {{t:stat_alltime_peak}}. ¿Qué significa?',
          ['Ningún mes lo ha superado nunca', 'Es lo mejor en lo que va de año', 'Está por encima de tu mes habitual'],
          '{{t:stat_alltime_peak}} es lo más grande de siempre. {{t:stat_peak_at_time}} fue un récord y se ha superado después.'],
        q2: ['Una canción fue #1 en un ranking Semanal pero no es #1 del mes. ¿Por qué?',
          ['El mes cuenta todas sus semanas, y escuchar de forma constante gana a una semana intensa', 'El Mensual deja fuera las canciones nuevas', 'El Mensual solo cuenta los fines de semana'],
          'Cada ranking cuenta su propio tramo de tiempo. Una semana intensa puede perder ante una canción que escuchaste todo el mes.'],
        q3: ['Una canción nueva muestra «3 de 5 semanas». ¿Qué significa?',
          ['Se escuchó en 3 de las 5 semanas del mes', 'Entró 3 veces en el ranking', 'Su mejor puesto fue el #3'],
          'Las marcas muestran en qué semanas del mes la escuchaste.']
      },
      tips: [
        'Haz clic en cualquier día de la tira de escuchas por día de un mes para abrir ese día.',
        'Bajo un ranking mensual, {{t:ne_filter_chart}} muestra solo las canciones nuevas que entraron.',
        'Los rankings anuales tienen buscador: escribe un nombre para encontrarlo en tu Top 100.'
      ]
    },

    alltime: {
      title: 'Histórico y viajes en el tiempo',
      promise: 'Tus canciones más escuchadas de siempre, de qué está hecho tu ranking y cómo era cualquier día del pasado.',
      scenes: {
        top: { title: 'Arriba de la página', spots: {
          alltime: ['{{t:nav_alltime}}', 'Todas tus escuchas, contadas una vez. La tecla A te trae aquí.'],
          label: ['Hasta cuándo', 'Haz clic para elegir una fecha y ver el ranking tal como estaba ese día.'],
          prev: ['Un mes atrás', 'Muestra el ranking como era un mes antes. Pulsa otra vez para seguir retrocediendo.'],
          banner: ['Tu #1 de siempre', 'El artista que más has escuchado, desde siempre.'],
          tiles: ['Cuatro números', 'Todas tus reproducciones, canciones, artistas y álbumes.'],
          total: ['Días y escuchas al día', 'Cuántos días has escuchado música, y tus escuchas al día de media.'],
          years: ['Escuchas por año', 'Cada año y sus escuchas. Haz clic en uno para abrir ese año.'],
          best: ['Mejor año', 'La casilla dorada es tu año más grande.'],
          share: ['Compartir', 'Guarda estos números como imagen.']
        } },
        chart: { title: 'El ranking histórico', spots: {
          tip: ['Un consejo', 'Dale un tamaño al ranking y mira de qué está hecho.'],
          size: ['{{t:ati_hint_btn}}', 'Pone el ranking en Top 100 y abre sus estadísticas.'],
          hide: ['Ocultar el consejo', 'No vuelve a salir.'],
          title: ['El ranking entero', 'Histórico empieza con todas las canciones que has escuchado. ⋮ → Tamaño lo deja en 50, 100 o 200.'],
          search: ['Buscar', 'Encuentra cualquier canción o artista en el ranking.'],
          heads: ['Columnas', 'Aquí no hay cambios: Histórico es un solo ranking, así que no hay con qué comparar.'],
          menu: ['Opciones del ranking (⋮)', 'Mostrar, Tamaño y Acciones.']
        } },
        ati: { title: 'Dentro de tu Top 100', spots: {
          head: ['Dentro de tu Top N', 'De qué está hecho tu ranking. Sigue el tamaño que elijas.'],
          toggle: ['{{t:ati_more}} / {{t:ati_less}}', 'Abre o pliega todas las estadísticas.'],
          hero: ['Un dato', 'Algo que vale la pena saber de tu ranking.'],
          fact: ['{{t:ati_another}}', 'Muestra el siguiente dato.'],
          tiles: ['Cuatro números', 'Cuántos artistas, cuánto ocupan tus 3 primeros, su parte de todas tus escuchas y cuántas son nuevas desde el año pasado.'],
          tile: ['Un número', 'Haz clic para ver qué hay detrás.'],
          tabs: ['Cinco vistas', '{{t:ati_tab_artists}}, {{t:ati_tab_eras}}, {{t:ati_tab_plays}}, {{t:ati_tab_badges}} y {{t:ati_tab_new}}.'],
          panel: ['La vista', 'Aquí: quién tiene más canciones en el ranking y los álbumes con más canciones. Elige un nombre para ver sus canciones.']
        } },
        pages: { title: 'El final de un ranking largo', spots: {
          pages: ['Páginas', 'Un ranking largo sale de 100 en 100.'],
          label: ['Dónde estás', 'Qué entradas se ven, de cuántas.'],
          input: ['Ir a una página', 'Escribe un número de página y pulsa Intro.'],
          next: ['Página siguiente', 'Las 100 siguientes.'],
          last: ['Última página', 'Directo al final.'],
          export: ['Exportar', 'El ranking como TXT, CSV o PDF imprimible.']
        } },
        travel: { title: 'Viaje en el tiempo', spots: {
          label: ['Hasta ese día', 'El ranking cuenta ahora todas las escuchas hasta esta fecha, y nada después.'],
          prev: ['Más atrás', 'Otro mes atrás.'],
          next: ['Hacia delante', 'Un mes adelante, hasta volver a hoy.'],
          banner: ['Tu #1 entonces', 'Quién lideraba tu ranking histórico ese día.'],
          tiles: ['Los números entonces', 'Tus totales tal como eran ese día.']
        } }
      },
      howto: {
        size: { title: 'Ver de qué está hecho tu ranking', slides: [
          'En Histórico, un consejo te ofrece mirar dentro de tu ranking.',
          'Pulsa {{t:ati_hint_btn}}.',
          'Las estadísticas salen sobre el ranking y siguen el tamaño que elijas.'
        ] },
        facts: { title: 'Explorar las estadísticas', slides: [
          '{{t:ati_another}} muestra el siguiente dato sobre tu ranking.',
          'Haz clic en un número para ver qué hay detrás.',
          'Cinco vistas: {{t:ati_tab_artists}}, {{t:ati_tab_eras}}, {{t:ati_tab_plays}}, {{t:ati_tab_badges}} y {{t:ati_tab_new}}.',
          '{{t:ati_less}} lo pliega.'
        ] },
        travel: { title: 'Viajar atrás en el tiempo', slides: [
          'En Histórico, pulsa ‹.',
          'El ranking cuenta ahora todas las escuchas hasta hace un mes.',
          'Todos los números vuelven atrás también.',
          'Pulsa › para volver hacia delante, o haz clic en la fecha para elegir cualquier día.'
        ] },
        find: { title: 'Encontrar una canción', slides: [
          'Escribe en el buscador sobre el ranking.',
          'O salta a una página abajo del todo.'
        ] },
        export: { title: 'Llevarte tu ranking', slides: [
          'Abajo: TXT, CSV o un PDF imprimible de todo el ranking.'
        ] }
      },
      options: {
        size: { title: '⋮ → Tamaño', items: {
          sizes: ['Tamaños del Histórico', 'Top 50, 100, 200 o todas las canciones (con el que empiezas).']
        } },
        atitabs: { title: 'Dentro de tu Top N', items: {
          artists: ['{{t:ati_tab_artists}}', 'Quién tiene más canciones, los álbumes con más canciones, quién manda en el top 10.'],
          eras: ['{{t:ati_tab_eras}}', 'De qué años y décadas son las canciones.'],
          plays: ['{{t:ati_tab_plays}}', 'Cómo se reparten las escuchas en el ranking, y lo rápido que entraron las canciones.'],
          badges: ['{{t:ati_tab_badges}}', 'Las certificaciones del ranking y las próximas placas.'],
          newyear: ['{{t:ati_tab_new}}', 'Lo que entró en el ranking en el último año.']
        } },
        export: { title: 'Exportar', items: {
          txt: ['TXT', 'Una lista simple.'],
          csv: ['CSV', 'Para una hoja de cálculo.'],
          pdf: ['PDF', 'Preparado para imprimir.']
        } }
      },
      challenges: {
        'at.size': ['Mira dentro de tu Top 100', '{{t:ati_hint_btn}}, o ⋮ → Tamaño.'],
        'at.fact': ['Mira otro dato', '{{t:ati_another}}.'],
        'at.stats': ['Abre todas las estadísticas', '{{t:ati_more}}.'],
        'at.travel': ['Viaja un mes atrás', 'Pulsa ‹ en Histórico.'],
        'at.search': ['Busca en tu ranking histórico', 'El buscador sobre el ranking.'],
        'at.export': ['Exporta el ranking', 'TXT, CSV o PDF abajo del todo.']
      },
      quiz: {
        q1: ['¿Qué hace ‹ en Histórico?',
          ['Muestra el ranking como estaba un mes antes', 'Va al ranking del año pasado', 'Nada'],
          'Histórico cuenta todas las escuchas hasta la fecha que se ve. ‹ mueve esa fecha un mes atrás.'],
        q2: ['¿Por qué no hay flechas de cambio en Histórico?',
          ['Es un solo ranking de todas las escuchas, así que no hay uno anterior con el que comparar', 'Están desactivadas', 'Solo salen en el móvil'],
          'El cambio compara un periodo con el anterior. Histórico no tiene «anterior».'],
        q3: ['¿Dónde ves quién tiene más canciones en tu Top 100?',
          ['Dentro de tu Top 100 → {{t:ati_tab_artists}}', 'Ajustes', 'El Foro'],
          'Pon Histórico en Top 100 y las estadísticas sobre el ranking lo muestran.']
      },
      tips: [
        'En Histórico, ‹ muestra tu ranking como estaba hace un mes. Sigue retrocediendo para verlo crecer.',
        'Dentro de tu Top 100 tiene doce datos. Pulsa {{t:ati_another}} para recorrerlos.',
        'Histórico tiene buscador: encuentra cualquier canción que hayas escuchado y su puesto de siempre.'
      ]
    },

    around: {
      title: 'Alrededor del ranking, y compartirlo',
      promise: 'Lo que se quedó a las puertas, lo que salió, lo nuevo y todas las formas de sacar un ranking de la app.',
      scenes: {
        bu: { title: '{{t:atc_tab_bu}}', spots: {
          bar: ['{{t:atc_title}}', 'Un bloque bajo el ranking con tres pestañas. Sale en Diario y Semanal (Mensual y Anual solo muestran las nuevas entradas).'],
          tbu: ['{{t:atc_tab_bu}}', 'Las canciones justo por debajo del corte: los puestos siguientes al tamaño de tu ranking.'],
          toff: ['{{t:sec_off_chart}}', 'Lo que estaba la vez anterior y ya no está.'],
          tnew: ['{{t:atc_tab_new}}', 'Todo lo nuevo de esta vez, en una lista.'],
          fold: ['Plegar', 'Oculta el bloque y deja su título.'],
          sub: ['Cómo se ordena', 'Por escuchas, como el propio ranking. Esta línea y la siguiente salen con ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_desc}}.'],
          meter: ['Distancia', 'Cuántas escuchas tiene el último puesto del ranking, así que la distancia es cuántas más le faltaban a cada una.'],
          info: ['{{t:bu_legend_btn}}', 'Abre la explicación de cada etiqueta. Sale cuando ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_bu_legend}} está activado.'],
          rank: ['Su puesto', 'Dónde estaría si el ranking fuera más largo.'],
          badge: ['Etiquetas', 'Una o dos palabras sobre su historia, como {{t:bu_badge_resurgence}} o {{t:bu_badge_debut}}.'],
          weeks: ['Semanas aquí', 'Cuántas semanas ha pasado en Aspirantes en total.'],
          away: ['Escuchas y distancia', 'Sus escuchas, y cuántas más le faltaban para entrar en el ranking.'],
          row: ['Una fila', 'Haz clic para abrir su trayectoria y sus botones, como en el ranking.']
        } },
        legend: { title: '{{t:bu_legend_btn}}', spots: {
          fresh: ['{{t:bu_badge_debut}}', '{{t:bu_badge_debut_title}}'],
          trending: ['{{t:bu_badge_trending}}', '{{t:bu_badge_trending_title}}'],
          persistent: ['{{t:bu_badge_persistent}}', '{{t:bu_badge_persistent_desc}}'],
          fading: ['{{t:bu_badge_fading}}', '{{t:bu_badge_fading_title}}'],
          resurgence: ['{{t:bu_badge_resurgence}}', '{{t:bu_badge_resurgence_desc}}'],
          resurgent: ['{{t:bu_badge_resurgent}}', '{{t:bu_badge_resurgent_desc}}'],
          clinging: ['{{t:bu_badge_clinging}}', '{{t:bu_badge_clinging_title}}'],
          fallen: ['{{t:bu_badge_fallen}}', '{{t:bu_badge_fallen_desc}}'],
          surging: ['{{t:bu_badge_surging}}', '{{t:bu_badge_surging_desc}}'],
          freefall: ['{{t:bu_badge_freefall}}', '{{t:bu_badge_freefall_desc}}'],
          yoyo: ['{{t:bu_badge_yoyo}}', '{{t:bu_badge_yoyo_desc}}'],
          weeks: ['N semanas', '{{t:bu_badge_weeks_desc}}'],
          streak: ['Racha de N semanas', '{{t:bu_badge_streak_desc}}']
        } },
        off: { title: '{{t:sec_off_chart}}', spots: {
          toff: ['{{t:sec_off_chart}}', 'Cada entrada que estaba en el ranking la vez anterior y salió.'],
          was: ['Estaba', 'Dónde estaba en el ranking anterior.'],
          exit: ['Cómo salió', 'Cayó del top 3, se quedó justo debajo, terminó una racha larga o simplemente salió.'],
          peak: ['Su mejor puesto', 'Lo más alto que llegó.'],
          where: ['Dónde está ahora', 'Si ahora está en Aspirantes (y lo cerca que está de volver), o cuándo la escuchaste por última vez.'],
          stats: ['Antes y después', 'Sus escuchas de la vez anterior y de esta, y sus semanas en el ranking.'],
          streak: ['Su racha', 'Cuántas semanas seguidas estuvo antes de salir.'],
          row: ['Una fila', 'Haz clic para abrir su trayectoria.']
        } },
        new: { title: '{{t:atc_tab_new}}', spots: {
          tnew: ['{{t:atc_tab_new}}', 'Todas las canciones nuevas de esta vez, hayan entrado en el ranking o no.'],
          chips: ['Filtros', '{{t:ne_filter_all}}, {{t:ne_filter_chart}} o {{t:ne_filter_new_artists}}.'],
          debut: ['Debut', 'El puesto con el que entró en el ranking.'],
          caps: ['Cuándo la escuchaste', 'Una marca por día de la semana (por semana en el Mensual). Cuanto más brillante, más escuchas.'],
          row: ['Una fila', 'Haz clic para abrir su ventana.']
        } },
        share: { title: '{{t:ig_share_title}}', spots: {
          preview: ['Vista previa', 'Exactamente la imagen que vas a obtener. Cambia según eliges.'],
          tpl: ['{{t:sh_design}}', 'Cinco estilos: Editorial, Minimal, Spotlight, Grid y Poster.'],
          swatch: ['{{t:sh_palette}}', 'Colores: el tema de tu app, una paleta fija, o Cover, que toma los colores de la portada de tu #1.'],
          format: ['{{t:ig_format}}', '{{t:sh_fmt_post}} para el feed, {{t:sh_fmt_portrait}}, o {{t:sh_fmt_story}} para historias.'],
          src: ['De dónde salen las portadas', 'Deezer, iTunes, Last.fm o YouTube.'],
          pick: ['Elegir una imagen', 'Haz clic en una entrada para elegir otra imagen.'],
          toggles: ['{{t:ig_show_hide}}', 'Cambio, logro, semanas en el ranking, escuchas, artista, la fecha y el pie. Desmarca lo que no quieras.'],
          entries: ['{{t:sh_entries}}', 'Cuántas entradas tiene la imagen. {{t:sh_entries_hint}}.'],
          text: ['{{t:sh_text_size}}', 'Texto más grande o más pequeño.'],
          quality: ['{{t:sh_quality}}', '{{t:sh_quality_std}} o {{t:sh_quality_high}}, con el tamaño en píxeles.'],
          copy: ['{{t:sh_copy}}', 'Copia la imagen, lista para pegar en un mensaje o una publicación.'],
          download: ['{{t:btn_download_image}}', 'La guarda como PNG.']
        } },
        pdf: { title: 'PDF imprimible', spots: {
          scope: ['Este ranking', 'Solo el ranking en el que estás.'],
          all: ['{{t:pdf_all_charts}}', 'Canciones, artistas y álbumes en un solo PDF.'],
          cover: ['{{t:pdf_opt_art}}', 'Portadas junto a cada entrada, o una lista simple.'],
          bu: ['{{t:pdf_opt_bu}}', 'Añade Aspirantes al final.'],
          create: ['{{t:pdf_create}}', 'Abre la ventana de impresión. Elige «Guardar como PDF» como impresora para obtener el archivo.']
        } },
        export: { title: 'Exportar playlist', spots: {
          names: ['{{t:export_step_name}}', 'Nombres listos para la playlist. Haz clic en uno para copiarlo.'],
          order: ['{{t:export_order_first}} / {{t:export_order_last}}', 'En qué orden va la lista.'],
          album: ['{{t:export_include_album}}', 'Añade el álbum de cada canción.'],
          list: ['Las canciones', 'Lo que se va a copiar, en orden.'],
          copy: ['{{t:export_copy_list}}', 'Copia la lista como «Artista - Título», una canción por línea.'],
          txt: ['.txt', 'La descarga como archivo de texto.'],
          csv: ['.csv', 'La descarga para una hoja de cálculo.'],
          services: ['{{t:export_step_import}}', 'Soundiiz convierte la lista en una playlist de verdad en Spotify, Apple Music, YouTube Music, Deezer o Tidal.'],
          open: ['{{t:export_open_soundiiz}}', 'Abre Soundiiz en otra pestaña. Los pasos de arriba dicen dónde pegar.']
        } }
      },
      howto: {
        bu: { title: 'Ver lo que se quedó a las puertas', slides: [
          'Bajo el ranking, abre {{t:atc_tab_bu}}.',
          'Cada canción muestra cuántas escuchas más le faltaban.',
          'Activa ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_bu_legend}} y pulsa {{t:bu_legend_btn}} para ver la explicación.',
          'Cada etiqueta cuenta la historia de una canción, como {{t:bu_badge_debut}}: su primera vez aquí.'
        ] },
        off: { title: 'Ver lo que salió', slides: [
          'Abre {{t:sec_off_chart}}.',
          'Cada una dice cómo salió.',
          'Y si está cerca de volver.'
        ] },
        hide: { title: 'Elegir qué listas se ven', slides: [
          'En ⋮ → Mostrar → Secciones, activa o desactiva Aspirantes, Fuera del Ranking y Nuevas Entradas.',
          'O pliega el bloque con la flecha, para que solo quede su título.'
        ] },
        share: { title: 'Compartir tu ranking como imagen', slides: [
          'En ⋮ → Acciones, elige Compartir como imagen.',
          'Elige un diseño.',
          'Elige los colores.',
          'Elige la forma: publicación, vertical o historia.',
          'Por ejemplo Poster, como historia.',
          'Desmarca lo que no quieras en la imagen.',
          'Luego cópiala o descárgala.'
        ] },
        pdf: { title: 'Imprimir el ranking', slides: [
          'En ⋮ → Acciones, elige PDF imprimible.',
          'Solo este ranking, o los tres.',
          'Pulsa {{t:pdf_create}} y elige «Guardar como PDF» como impresora.'
        ] },
        export: { title: 'Crear una playlist en Spotify (o donde quieras)', slides: [
          'En ⋮ → Acciones, elige Exportar playlist.',
          'Haz clic en un nombre para copiarlo.',
          'Copia la lista de canciones.',
          'Soundiiz la convierte en una playlist en el servicio que uses.',
          'Abre Soundiiz y pégala donde dicen los pasos.'
        ] },
        play: { title: 'Escuchar todo el ranking', slides: [
          'En ⋮ → Acciones, {{t:btn_play_all}} pone el ranking en orden.',
          '{{t:btn_shuffle_all}} lo pone en orden aleatorio.'
        ] }
      },
      options: {
        tabs: { title: '{{t:atc_title}}', items: {
          bu: ['{{t:atc_tab_bu}}', 'Justo por debajo del corte. Diario y Semanal.'],
          off: ['{{t:sec_off_chart}}', 'Salieron desde la vez anterior. Diario y Semanal.'],
          new: ['{{t:atc_tab_new}}', 'Todo lo nuevo. Todos los periodos menos Histórico.']
        } },
        tags: { title: '{{t:bu_legend_btn}}', items: {
          fresh: ['{{t:bu_badge_debut}}', '{{t:bu_badge_debut_title}}'],
          trending: ['{{t:bu_badge_trending}}', '{{t:bu_badge_trending_title}}'],
          persistent: ['{{t:bu_badge_persistent}}', '{{t:bu_badge_persistent_desc}}'],
          fading: ['{{t:bu_badge_fading}}', '{{t:bu_badge_fading_title}}'],
          resurgence: ['{{t:bu_badge_resurgence}}', '{{t:bu_badge_resurgence_desc}}'],
          resurgent: ['{{t:bu_badge_resurgent}}', '{{t:bu_badge_resurgent_desc}}'],
          clinging: ['{{t:bu_badge_clinging}}', '{{t:bu_badge_clinging_title}}'],
          fallen: ['{{t:bu_badge_fallen}}', '{{t:bu_badge_fallen_desc}}'],
          surging: ['{{t:bu_badge_surging}}', '{{t:bu_badge_surging_desc}}'],
          freefall: ['{{t:bu_badge_freefall}}', '{{t:bu_badge_freefall_desc}}'],
          yoyo: ['{{t:bu_badge_yoyo}}', '{{t:bu_badge_yoyo_desc}}'],
          weeks: ['N semanas', '{{t:bu_badge_weeks_desc}}'],
          streak: ['Racha de N semanas', '{{t:bu_badge_streak_desc}}']
        } },
        design: { title: '{{t:ig_share_title}}', items: {
          tpl: ['{{t:sh_design}}', 'Editorial, Minimal, Spotlight, Grid o Poster.'],
          pal: ['{{t:sh_palette}}', 'El tema de la app, seis paletas fijas, o Cover.'],
          fmt: ['{{t:ig_format}}', '{{t:sh_fmt_post}}, {{t:sh_fmt_portrait}} o {{t:sh_fmt_story}}.'],
          art: ['{{t:ig_album_art}}', 'Con o sin portadas, y de dónde salen.'],
          pick: ['Imágenes', 'Elige otra imagen para cualquier entrada.'],
          show: ['{{t:ig_show_hide}}', 'Cambio, logro, semanas, escuchas, artista, fecha y pie.'],
          entries: ['{{t:sh_entries}}', '{{t:sh_entries_hint}}.'],
          text: ['{{t:sh_text_size}}', 'Del 80% al 130%.'],
          quality: ['{{t:sh_quality}}', '{{t:sh_quality_std}} o {{t:sh_quality_high}}.']
        } },
        pdf: { title: 'PDF imprimible', items: {
          scope: ['Este ranking / {{t:pdf_all_charts}}', 'Un ranking o los tres.'],
          cover: ['{{t:pdf_opt_art}}', 'Portadas junto a cada entrada.'],
          bu: ['{{t:pdf_opt_bu}}', 'Añade Aspirantes al final.']
        } },
        export: { title: 'Exportar playlist', items: {
          names: ['{{t:export_step_name}}', 'Nombres de playlist listos.'],
          order: ['{{t:export_order_first}} / {{t:export_order_last}}', 'En qué orden.'],
          album: ['{{t:export_include_album}}', 'Añade el álbum a cada línea.'],
          copy: ['{{t:export_copy_list}}', 'Artista - Título, una por línea.'],
          files: ['.txt / .csv', 'Descarga la lista como archivo.'],
          soundiiz: ['{{t:export_open_soundiiz}}', 'Crea la playlist en otro servicio.']
        } }
      },
      challenges: {
        'around.tab': ['Abre otra pestaña bajo el ranking', '{{t:sec_off_chart}} o {{t:atc_tab_new}}.'],
        'around.legend': ['Abre {{t:bu_legend_btn}}', 'Antes activa ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_bu_legend}}.'],
        'around.share': ['Abre Compartir como imagen', '⋮ → Acciones.'],
        'around.design': ['Prueba otro diseño para la imagen', 'En la ventana de compartir.'],
        'around.pdf': ['Abre PDF imprimible', '⋮ → Acciones.'],
        'around.export': ['Abre Exportar playlist', '⋮ → Acciones.'],
        'around.copy': ['Copia un nombre de playlist o la lista', 'En la ventana de exportar.'],
        'around.play': ['Escucha todo un ranking', '⋮ → Acciones → {{t:btn_play_all}}.']
      },
      quiz: {
        q1: ['Una canción en Aspirantes dice que le falta 1 escucha. ¿Qué significa?',
          ['Con una escucha más habría entrado en el ranking', 'La escuchaste una vez', 'Es la #1 de Aspirantes'],
          'La distancia es cuántas escuchas más le faltaban para llegar al último puesto del ranking.'],
        q2: ['¿Dónde encuentras las canciones que estaban en el ranking de la semana pasada pero no en el de esta?',
          ['{{t:sec_off_chart}}', '{{t:atc_tab_new}}', 'Histórico'],
          '{{t:sec_off_chart}} reúne cada salida, cómo salió y si está cerca de volver.'],
        q3: ['Quieres que la imagen de tu ranking llene la pantalla del móvil en una historia. ¿Qué cambias?',
          ['{{t:ig_format}} → {{t:sh_fmt_story}}', '{{t:sh_palette}}', '{{t:sh_text_size}}'],
          'El formato decide la forma: 1:1 para publicación, 4:5 vertical, 9:16 para historias.']
      },
      tips: [
        'En Aspirantes, {{t:bu_legend_btn}} explica cada etiqueta, desde {{t:bu_badge_debut}} hasta {{t:bu_badge_fallen}}.',
        'La ventana de compartir tiene cinco diseños. Poster como historia 9:16 queda genial en el móvil.',
        'Exportar playlist y Soundiiz convierten cualquier ranking en una playlist de verdad en Spotify, Apple Music y más.'
      ]
    },
    windows: {
      title: 'Ventanas de canción, artista y álbum',
      promise: 'Todo sobre una canción, un artista o un álbum, cómo encontrar cualquiera en un segundo, y tus rachas.',
      scenes: {
        song: { title: 'La ventana de una canción', spots: {
          art: ['Portada', 'Su portada. Pasa el ratón por encima para ver el ✎ y elegir otra imagen (en el móvil, mantenla pulsada).'],
          title: ['La canción', 'Su nombre.'],
          sub: ['Artista y álbum', 'Haz clic en cualquiera para abrir su ventana.'],
          sample: ['{{t:ea_s_sample}}', 'Pone 30 segundos.'],
          playlist: ['{{t:dp_playlist}}', 'La añade a una de tus listas.'],
          rate: ['{{t:dp_rate}}', 'Ponle una nota sobre 10.'],
          more: ['{{t:ea_more}}', 'Todo lo demás: el vídeo, el álbum, el artista, su trayectoria, cambiar la imagen, buscar en YouTube o Spotify.'],
          links: ['Spotify, YouTube, Last.fm', 'La busca en cada uno.'],
          share: ['{{t:st_am_share}}', 'Una tarjeta con imagen de esta canción para compartir.'],
          tabs: ['Pestañas', '{{t:dp_tab_overview}}, {{t:dp_tab_charts}} y {{t:dp_tab_listening}}.'],
          close: ['Cerrar', 'Esc hace lo mismo.'],
          hero: ['Escuchas totales', 'Todas sus escuchas, su parte de las del artista, su certificación y su puesto de siempre.'],
          span: ['Primera y última escucha', 'Cuándo la escuchaste por primera y última vez, y en cuántos días entre medias.'],
          trio: ['Tres números', 'Días escuchada, escuchas por día esos días y escuchas hasta la siguiente certificación.'],
          favs: ['Dónde vive', 'Su álbum y su artista, y su puesto en cada uno. Haz clic para abrirlos.'],
          habits: ['{{t:ao_habits}}', 'Su racha más larga de días, su día más grande, su racha de escuchas seguidas, su pausa más larga y sus vueltas.'],
          rating: ['Mi nota', 'Tu nota, y un enlace para valorar todo el álbum.'],
          trophies: ['Logros en los rankings', 'Cada insignia que ganó: semanas en el #1, rachas en el top 10, su debut, su certificación. Toca una para ver qué la ganó.']
        } },
        songcharts: { title: '{{t:dp_tab_charts}}', spots: {
          rktop: ['Mejores puestos', 'Su mejor puesto en los rankings Diario, Semanal, Mensual y Anual.'],
          rkhero: ['Su mejor puesto', 'Su mejor puesto en el ranking semanal y cuándo lo alcanzó.'],
          plot: ['Puesto en el tiempo', 'Su posición semana a semana. Pasa por la línea (o tócala) para ver cada semana.'],
          detail: ['La semana que señalas', 'Su puesto, su cambio y sus escuchas esa semana.'],
          moments: ['Momentos', 'Su debut, su racha más larga en el #1 y otros momentos.'],
          fam: ['Frente a su álbum y su artista', 'Cómo le fue junto a las demás canciones de su álbum y de su artista.'],
          hof: ['Récords del Salón de la Fama', 'Cada récord que tiene en Récords.'],
          run: ['Su trayectoria', 'La misma que bajo una fila del ranking.']
        } },
        songlisten: { title: '{{t:dp_tab_listening}}', spots: {
          lshero: ['En rotación', 'Si la sigues escuchando, cuánto tiempo llevas y su mes más grande.'],
          spark: ['Escuchas por mes', 'Cada mes que la escuchaste. La corona marca su mejor mes.'],
          found: ['El día que la encontraste', 'Lo que escuchabas alrededor de la primera vez que la oíste.'],
          along: ['Escuchada junto a', 'Canciones que pusiste a 30 minutos o menos de ella, las más frecuentes.'],
          clock: ['Cuándo la escuchas', 'La hora del día en que más la pones.'],
          seasons: ['Estaciones', 'En qué estaciones la escuchas.'],
          miles: ['Hitos', 'Cuándo llegó a su primera escucha, a la 100, la 200…'],
          next: ['Lo siguiente', 'Su próximo hito, cuánto falta y más o menos cuándo llegarás.'],
          heat: ['Cada día que la escuchaste', 'Un calendario de cada día en que sonó.'],
          more: ['Más', 'Récords de racha y todo su historial de escuchas.']
        } },
        artist: { title: 'La ventana de un artista', spots: {
          tabs: ['Seis pestañas', '{{t:dp_tab_overview}}, {{t:dp_tab_music}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}, {{t:dp_tab_rating}} y {{t:dp_tab_awards}}.'],
          hero: ['Escuchas totales', 'Todas sus escuchas, su parte de las tuyas y su puesto entre tus artistas.'],
          favs: ['Favoritos', 'Su canción, su álbum y más que más escuchas.'],
          habits: ['{{t:ao_habits}}', 'Días escuchado, racha más larga, día más grande y más.'],
          slam: ['Grand Slam', 'Sale cuando ha sido #1 en los rankings Semanal, Mensual y Anual.'],
          trophies: ['Logros en los rankings', 'Cada insignia que ganó.'],
          rating: ['Mis notas', 'Tu nota media de lo que valoraste suyo.']
        } },
        music: { title: '{{t:dp_tab_music}}', spots: {
          top: ['Canciones y álbumes', 'Cambia entre sus canciones y sus álbumes.'],
          intro: ['Qué sale', 'Todo lo suyo que entró en tus rankings.'],
          charts: ['Qué ranking', 'De siempre, o solo lo que entró en el Anual, Mensual, Semanal o Diario.'],
          sum: ['Totales', 'Cuántas, cuántas llegaron al #1 y al top 10, y sus escuchas.'],
          tools: ['Ordenar', '{{t:am_sort_rank}}, {{t:am_sort_plays}}, {{t:am_sort_recent}}, {{t:am_sort_az}}.'],
          list: ['La lista', 'Cada una con su puesto, certificación, primera y última escucha. Abre una para ver sus detalles.']
        } },
        awards: { title: '{{t:dp_tab_awards}}', spots: {
          sw: ['Dos lados', 'Tus propios premios (My Grammies) o las galas de premios reales.'],
          real: ['Vida real', 'Sus nominaciones y premios en galas reales, y cómo se comparan con tus votos.']
        } },
        album: { title: 'La ventana de un álbum', spots: {
          hero: ['Escuchas totales', 'Todas sus escuchas, su parte de las del artista, su certificación y su puesto.'],
          favs: ['Sus canciones', 'Sus canciones más escuchadas.'],
          habits: ['{{t:ao_habits}}', 'Los mismos hábitos que una canción, para todo el álbum.'],
          rating: ['Mi evaluación', 'Puntúa cada canción y obtén la nota global del álbum.'],
          trophies: ['Logros en los rankings', 'Cada insignia que ganó el álbum.'],
          plaques: ['Placas de certificación', 'Sus placas de Oro, Platino o Diamante.']
        } },
        menus: { title: 'El menú ⋮', spots: {
          more: ['⋮ en una fila', 'Cada fila del ranking tiene uno. Con clic derecho en una fila sale el mismo menú.'],
          menu: ['El menú', 'Un fragmento, el vídeo, añadir a una lista, detalles, su álbum y su artista, su trayectoria, cambiar su imagen, buscar en YouTube o Spotify.'],
          change: ['{{t:img_picker_change}}', 'Abre el selector de portada de esta entrada.']
        } },
        cover: { title: '{{t:img_picker_change}}', spots: {
          now: ['La imagen actual', 'La portada que tiene ahora.'],
          title: ['Qué estás cambiando', 'La canción, el álbum o el artista de esta imagen.'],
          deezer: ['Deezer', 'Imágenes encontradas en Deezer.'],
          current: ['La que se usa', 'La imagen marcada es la que se ve ahora.'],
          itunes: ['iTunes', 'Imágenes encontradas en iTunes, a menudo varias versiones y portadas de sencillos.'],
          tile: ['Elige una', 'Haz clic en cualquier imagen para usarla. El selector se cierra y la nueva portada sale al momento.'],
          lastfm: ['Last.fm', 'La imagen que tiene Last.fm.'],
          youtube: ['YouTube', 'Un fotograma de su vídeo.'],
          url: ['{{t:imgpk_url_label}}', 'Pega el enlace de cualquier imagen de internet…'],
          set: ['{{t:imgpk_apply}}', '…y pulsa aquí para usarla.'],
          none: ['{{t:imgpk_none}}', 'No muestra imagen, solo un recuadro liso.'],
          auto: ['{{t:imgpk_auto}}', 'Vuelve a la imagen que elige la app sola.'],
          close: ['Cerrar', 'Deja la portada como estaba.']
        } },
        search: { title: 'Buscar', spots: {
          field: ['Escribe un nombre', 'Cualquier parte del nombre de un artista, una canción o un álbum. Pulsa / o Ctrl+K en cualquier sitio para abrirlo.'],
          esc: ['Cerrar', 'Esc lo cierra.'],
          group: ['Agrupado', 'Primero artistas, luego canciones, luego álbumes.'],
          top: ['Un resultado', 'Elige uno para abrir su ventana. ↑ ↓ e Intro también sirven.'],
          n: ['Escuchas', 'Cuántas veces lo has escuchado.'],
          songs: ['Canciones', 'Canciones que coinciden con lo que escribiste, con sus artistas.'],
          foot: ['Teclas', '↑ ↓ para moverte, Intro para abrir, Esc para cerrar.']
        } },
        hist: { title: 'Historial de búsqueda', spots: {
          chips: ['Búsquedas recientes', 'Lo que escribiste hace poco. Haz clic en una para buscarla otra vez.'],
          chip: ['Una búsqueda', 'La repite.'],
          item: ['Abiertos hace poco', 'Lo que abriste desde la búsqueda.'],
          rm: ['Quitar', 'Quita uno de la lista.'],
          clear: ['Borrar historial', 'Vacía las dos listas.']
        } },
        streak: { title: '{{t:streak_modal_title}}', spots: {
          today: ['{{t:sk_tab_today}}', 'Las rachas que mantienes si escuchas hoy, y lo que perdiste ayer.'],
          fire: ['{{t:sk_tab_fire}}', 'Todas las rachas en marcha: artistas, álbumes y canciones que has escuchado varios días seguidos.'],
          recs: ['{{t:sk_tab_records}}', 'Tus rachas más largas de siempre, tus insignias y las rachas que terminaron.'],
          cal: ['{{t:sk_tab_calendar}}', 'Un calendario de tus rachas.'],
          fame: ['Salón de la Fama', 'Tus 5 rachas más largas de artistas, álbumes y canciones.'],
          badges: ['Insignias', 'Se ganan con rachas: una muy larga, muchas a la vez, muchas distintas. Toca una ganada para darle la vuelta: la fecha y la música que la ganó.']
        } },
        streakcal: { title: '{{t:sk_tab_calendar}}', spots: {
          cal: ['{{t:sk_tab_calendar}}', 'Tus rachas, día a día.'],
          filters: ['Filtros', 'Todo, artistas, canciones o álbumes, y qué año.'],
          wrap: ['El calendario', 'Cada día coloreado según cuánto estaba en racha. Elige un día para ver qué.']
        } }
      },
      howto: {
        open: { title: 'Abrir todo sobre una canción', slides: [
          'Haz clic en el título de una canción en cualquier sitio: un ranking, un récord, una búsqueda.',
          'Su ventana tiene tres pestañas.',
          'Salta a su álbum o a su artista desde aquí.',
          'Ciérrala, o pulsa Esc.'
        ] },
        find: { title: 'Encontrar cualquier cosa en un segundo', slides: [
          'Pulsa / o Ctrl+K en cualquier página y escribe.',
          'Elige un resultado para abrir su ventana.',
          'O usa ↑ ↓ e Intro.',
          'La próxima vez, lo que abriste te espera aquí.'
        ] },
        history: { title: 'Ver toda la historia de una canción', slides: [
          'En {{t:dp_tab_charts}}: su posición semana a semana.',
          'Sus grandes momentos, como su debut y su racha en el #1.',
          'En {{t:dp_tab_listening}}: el día que la encontraste.',
          'Y cuándo llegó a cada hito.'
        ] },
        artist: { title: 'Explorar un artista', slides: [
          'Un artista tiene seis pestañas.',
          '{{t:dp_tab_music}} reúne sus canciones y álbumes, ordenados como quieras.',
          '{{t:dp_tab_awards}} muestra tus premios y los reales.'
        ] },
        cover: { title: 'Cambiar una portada', slides: [
          'Pasa el ratón por una portada: sale un ✎ en la esquina. Haz clic. En el móvil, mantén pulsada la portada.',
          'O abre ⋮ en la fila y elige {{t:img_picker_change}}. Las ventanas tienen el mismo ✎ en su portada grande.',
          'El selector muestra imágenes de Deezer, iTunes, Last.fm y YouTube. La marcada es la que se usa ahora.',
          'Haz clic en la que quieras.',
          'O pega el enlace de cualquier imagen y pulsa {{t:imgpk_apply}}.',
          '{{t:imgpk_auto}} vuelve a la elección de la app; {{t:imgpk_none}} no muestra imagen.',
          'La nueva portada sale en todas partes a la vez: cada ranking, su ventana, las imágenes para compartir y los premios. Con la sesión iniciada, te sigue a todos tus dispositivos.'
        ] },
        menu: { title: 'Usar el menú ⋮', slides: [
          'Cada fila tiene un ⋮ (o haz clic derecho en la fila).',
          'Tiene un fragmento, el vídeo, listas, detalles y más.',
          'Las ventanas tienen el mismo menú.'
        ] },
        streak: { title: 'Mantener tus rachas', slides: [
          'Tu racha de escucha está arriba en la página de Charts. Haz clic.',
          '{{t:sk_tab_records}}: tus rachas más largas de siempre.',
          'E insignias para coleccionar.',
          '{{t:sk_tab_calendar}} las muestra día a día.'
        ] }
      },
      options: {
        tabs: { title: 'Pestañas de las ventanas', items: {
          song: ['Una canción', '{{t:dp_tab_overview}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}.'],
          artist: ['Un artista', '{{t:dp_tab_overview}}, {{t:dp_tab_music}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}, {{t:dp_tab_rating}}, {{t:dp_tab_awards}}.'],
          album: ['Un álbum', '{{t:dp_tab_overview}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}, {{t:dp_tab_rating}}.']
        } },
        buttons: { title: 'Botones de las ventanas', items: {
          sample: ['{{t:ea_s_sample}}', '30 segundos.'],
          playlist: ['{{t:dp_playlist}}', 'Añadir a una lista.'],
          rate: ['{{t:dp_rate}}', 'Canciones y álbumes.'],
          share: ['{{t:st_am_share}}', 'Una tarjeta con imagen.'],
          more: ['{{t:ea_more}}', 'El menú ⋮.'],
          links: ['Spotify / YouTube / Last.fm', 'Encontrarla en otro sitio.']
        } },
        cover: { title: '{{t:img_picker_change}}', items: {
          open: ['Abrir el selector', 'El ✎ de una portada, mantener pulsado en el móvil, o ⋮ → {{t:img_picker_change}}.'],
          sources: ['Deezer, iTunes, Last.fm, YouTube', 'Imágenes encontradas en cada uno.'],
          link: ['{{t:imgpk_url_label}}', 'Cualquier imagen de internet, por su enlace.'],
          none: ['{{t:imgpk_none}}', 'Un recuadro liso, sin imagen.'],
          auto: ['{{t:imgpk_auto}}', 'La app elige la imagen sola.']
        } },
        music: { title: '{{t:dp_tab_music}}', items: {
          sorts: ['Ordenar', '{{t:am_sort_rank}} (con el que empiezas), {{t:am_sort_plays}}, {{t:am_sort_recent}}, {{t:am_sort_az}}.'],
          charts: ['Qué ranking', 'De siempre, Anual, Mensual, Semanal o Diario.']
        } },
        streaktabs: { title: '{{t:streak_modal_title}}', items: {
          today: ['{{t:sk_tab_today}}', 'Mantenlas vivas hoy.'],
          fire: ['{{t:sk_tab_fire}}', 'En marcha ahora.'],
          recs: ['{{t:sk_tab_records}}', 'Las más largas, insignias, terminadas.'],
          cal: ['{{t:sk_tab_calendar}}', 'Día a día.']
        } }
      },
      challenges: {
        'win.song': ['Abre la ventana de una canción', 'Haz clic en el título de una canción.'],
        'win.artist': ['Abre la ventana de un artista', 'Haz clic en el nombre de un artista.'],
        'win.album': ['Abre la ventana de un álbum', 'Haz clic en el nombre de un álbum.'],
        'win.tab': ['Cambia de pestaña en una ventana', '{{t:dp_tab_charts}} o {{t:dp_tab_listening}}.'],
        'win.search': ['Busca en tu biblioteca', 'Pulsa / o la búsqueda de la barra superior.'],
        'win.menu': ['Abre un menú ⋮', 'En una fila, o con clic derecho.'],
        'win.cover': ['Cambia una portada', 'El ✎ de una portada, o ⋮ → {{t:img_picker_change}}.'],
        'win.streak': ['Abre tus rachas', 'La racha de escucha arriba en la página de Charts.']
      },
      quiz: {
        q1: ['¿Cómo abres la búsqueda con el teclado?',
          ['Pulsa / o Ctrl+K', 'Pulsa S', 'Pulsa Intro'],
          '/ o Ctrl+K la abren desde cualquier página.'],
        q2: ['¿Dónde ves la posición de una canción semana a semana?',
          ['La pestaña {{t:dp_tab_charts}} de su ventana', 'La pestaña {{t:dp_tab_listening}}', 'Ajustes'],
          '{{t:dp_tab_charts}} tiene su puesto en el tiempo; pasa por la línea para ver cada semana.'],
        q3: ['¿Qué cuenta una racha?',
          ['Días seguidos en que la escuchaste', 'Sus escuchas totales', 'Sus semanas en el ranking'],
          'Una racha son días seguidos con al menos una escucha.']
      },
      tips: [
        'Pulsa / en cualquier página para buscar en toda tu biblioteca.',
        'La pestaña {{t:dp_tab_listening}} de una canción muestra el día que la encontraste: lo que escuchabas justo antes.',
        'En tus rachas, toca una insignia ganada para darle la vuelta y ver cuándo la ganaste.',
        '¿No te gusta una portada? Pasa el ratón por encima y pulsa el ✎ para elegir otra, o pega el enlace de cualquier imagen.'
      ]
    },
    stats: {
      title: '{{t:tab_stats}}',
      promise: 'Tus escuchas de cualquier periodo: un resumen, su historia, juegos, comparaciones lado a lado y gráficas.',
      scenes: {
        top: { title: 'El rango y el {{t:sx_tab_overview}}', spots: {
          presets: ['Rangos rápidos', '{{t:range_4w}}, {{t:range_12m}}, {{t:range_3y}} o {{t:range_all}}. Todas las pestañas usan el rango que elijas aquí.'],
          dates: ['Tus propias fechas', 'Elige cualquier fecha de inicio y de fin.'],
          tabs: ['Cinco pestañas', '{{t:sx_tab_overview}}, {{t:sx_tab_story}}, {{t:sx_tab_games}}, {{t:sx_tab_compare}} y {{t:sx_tab_charts}}. La que dejes abierta es la que verás al volver.'],
          line: ['En una frase', 'Tu rango en una frase: cuánto escuchaste, frente al periodo anterior, y quién lideró. Haz clic en el artista para abrir su ventana.'],
          share: ['{{t:sx_share}}', 'Crea una imagen de este resumen para guardarla o enviarla.'],
          tile: ['Cuatro casillas', 'Escuchas, canciones, artistas y álbumes del rango.'],
          delta: ['Frente al anterior', 'Sube o baja frente al mismo tiempo justo antes, con esa cifra al lado.'],
          trend: ['Cómo fue', 'Una pequeña línea de cómo fue a lo largo del rango.'],
          sub: ['Cifras pequeñas', 'Escuchas al día, tu mejor día, cuántas eran nuevas para ti.'],
          go: ['Ver más', 'Cada casilla lleva a la gráfica o la comparación que cuenta más.']
        } },
        ov: { title: 'El resto del {{t:sx_tab_overview}}', spots: {
          top5: ['{{t:sx_top5_title}}', 'Los cinco que más escuchaste en el rango. Haz clic en uno para abrir su ventana.'],
          t5seg: ['Canciones, artistas o álbumes', 'Cambia lo que muestra el top 5.'],
          t5lead: ['Tu #1', 'El líder, sus escuchas, su parte del total y su ventaja sobre el #2. Escucha una muestra aquí mismo.'],
          t5rows: ['Del #2 al #5', 'Las barras muestran lo cerca que está cada uno del #1.'],
          sotp: ['{{t:sx_sotp_title}}', 'Tu canción más escuchada del rango y cómo fueron sus escuchas, día a día o semana a semana.'],
          movers: ['{{t:sx_mov_title}}', 'Lo que escuchaste mucho más, y mucho menos, que en el periodo anterior.'],
          mvseg: ['Canciones, artistas o álbumes', 'Cambia lo que muestran los cambios.'],
          persona: ['{{t:sx_pers_title}}', 'Un nombre para cómo escuchaste en este rango, como {{t:sx_pers_explorer}} o {{t:sx_pers_marathon}}, y por qué.'],
          facts: ['{{t:sx_fact_title}}', 'Detalles del rango: tu repetición más larga, tu hora y tu día con más escuchas.'],
          shuffle: ['{{t:sx_fact_shuffle}}', 'Muestra otros datos curiosos.'],
          cal: ['{{t:sx_cal_title}}', 'Un pequeño calendario del rango, más oscuro cuanto más escuchaste. Haz clic en un día para abrir su ranking diario.'],
          calmore: ['Cada año', 'Salta al mapa de calor completo en {{t:sx_tab_charts}}.'],
          otd: ['{{t:sx_otd_title}}', 'La fecha de hoy en años pasados, y la canción que más escuchaste ese día.'],
          split: ['{{t:sx_split_title}}', 'Hallazgos nuevos frente a viejas favoritas, y cuánto fue a tus 5 artistas principales.']
        } },
        story: { title: '{{t:sx_tab_story}}', spots: {
          obs: ['{{t:sx_obs_title_m}}', 'El artista que más escuchaste cada mes (o cada semana en un rango corto).'],
          obsone: ['Un mes', 'Haz clic para abrir el ranking de ese mes.'],
          eras: ['{{t:sx_eras_title}}', 'Periodos en los que un artista fue #1 en tu ranking semanal tres semanas o más seguidas.'],
          drift: ['{{t:sx_drift_title}}', 'Tus 10 artistas de cada año, año a año. Haz clic en una línea o un nombre para seguir a un artista.'],
          driftkeys: ['Seguir a un artista', 'Haz clic en un nombre para resaltar su línea.'],
          loyal: ['{{t:sx_loyal_title}}', 'Cuánto fue a tus 10 artistas principales, en una escala de aventurero a fiel.'],
          comfort: ['{{t:sx_comfort_title}}', 'Canciones que ya conocías frente a canciones que encontraste en este rango.'],
          disc: ['{{t:sx_disc_title}}', 'Tus mayores artistas nuevos del rango, y si aún los escuchas.'],
          fun: ['{{t:sx_fun_title}}', 'El rango en otras palabras: escuchas al día, tu canción top, cuánto andarían tus escuchas.'],
          miles: ['{{t:sx_miles_title}}', 'Cifras redondas que pasaste: escuchas, canciones y artistas distintos, y cuándo.']
        } },
        games: { title: '{{t:sx_tab_games}}', spots: {
          head: ['{{t:sx_games_title}}', 'Juegos de preguntas hechos con tu propia biblioteca.'],
          tally: ['Tu marcador', 'Cuántos juegos has jugado, y tu racha de días con el juego del día.'],
          daily: ['{{t:sx_daily_k}}', 'Un reto al día, el mismo todo el día. Solo cuenta tu primer intento; juega cada día para mantener la racha.'],
          dailygo: ['{{t:sx_daily_play}}', 'Empieza el reto de hoy.'],
          card: ['Un juego', 'Doce juegos: {{t:sx_game_hl}}, {{t:sx_game_tune}}, {{t:sx_game_year}}, {{t:sx_game_one}} y más.'],
          tag: ['{{t:sx_games_new}}', 'Los juegos que aún no has jugado llevan una etiqueta.'],
          go: ['{{t:sx_game_play}}', 'Abre el juego a pantalla completa.']
        } },
        game: { title: 'Jugar una partida', spots: {
          title: ['El juego', 'Su nombre.'],
          score: ['Tu puntuación', 'Tu racha o puntuación de ahora, y tu mejor marca.'],
          close: ['Cerrar', 'Vuelve a los juegos. Esc hace lo mismo.'],
          q: ['La pregunta', 'Lo que tienes que adivinar.'],
          known: ['Lo que sabes', 'Un lado muestra su respuesta.'],
          guess: ['Lo que adivinas', 'El otro está oculto.'],
          btns: ['Tu respuesta', 'Elige una. Si aciertas, la partida sigue; al final puedes compartir tu resultado.']
        } },
        cmp: { title: '{{t:sx_tab_compare}}', spots: {
          gran: ['{{t:gran_daily}} / {{t:gran_monthly}} / {{t:gran_yearly}}', 'Cómo se dividen las líneas: por día, por mes o por año. Sale en {{t:sx_tab_compare}} y {{t:sx_tab_charts}}.'],
          top: ['Tu top', 'Llena la selección con tus favoritos del rango.'],
          saved: ['{{t:sx_saved_title}}', 'Guarda una selección para recuperarla luego.'],
          types: ['Qué comparar', '{{t:sx_cmp_type_artists}}, {{t:sx_cmp_type_songs}}, {{t:sx_cmp_type_albums}} o {{t:sx_cmp_type_years}}.'],
          modes: ['Cómo verlo', '{{t:sx_cmp_mode_cum}}, {{t:sx_cmp_mode_per}}, {{t:sx_cmp_mode_run}} o {{t:sx_cmp_mode_race}}.'],
          chip: ['Una elección', 'Su puesto, escuchas y porcentaje. La barra de abajo es su color en la gráfica.'],
          x: ['Quitar', 'La quita.'],
          add: ['Añadir', 'Escribe un nombre y elígelo de la lista. Hasta 10.'],
          legend: ['La leyenda', '{{t:sx_cmp_legend_tip}}.'],
          chart: ['La gráfica', 'Pasa el ratón (o toca) para leer cada periodo.'],
          verdict: ['Quién gana', 'Más escuchas, más semanas en el #1, el más en forma ahora, el que lleva más tiempo contigo.']
        } },
        cmpmore: { title: 'Más en {{t:sx_tab_compare}}', spots: {
          h2h: ['{{t:sx_h2h_title}}', 'Quién va delante y por cuánto, y la parte de cada uno.'],
          share: ['{{t:sx_share}}', 'Una imagen de la comparación.'],
          table: ['La tabla', 'Escuchas, porcentaje, primera escucha, semanas en el #1, mejor mes, racha más larga. Haz clic en una columna para ordenar; lo mejor de cada una sale en su color.'],
          own: ['{{t:sx_own_title}}', 'Un bloque por mes con el color de quien más se escuchó, y cuándo cambió el liderato.'],
          gaps: ['{{t:sx_gap_title}}', 'La carrera más ajustada, la mayor ventaja, la subida más rápida y quién lideró más tiempo.'],
          ts: ['{{t:sx_ts_title}}', 'Las tres canciones más escuchadas de cada uno.'],
          hab: ['{{t:sx_hab_title}}', 'Cuándo se escucha cada uno: por hora y por día de la semana.']
        } },
        run: { title: '{{t:sx_cmp_mode_run}}', spots: {
          run: ['{{t:sx_cmp_mode_run}}', 'Sus puestos en tu ranking, semana a semana.'],
          crun: ['Qué ranking', '{{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} o {{t:nav_yearly}}.'],
          chart: ['Puesto en el tiempo', 'Más arriba es mejor. Los huecos son semanas fuera del ranking.']
        } },
        race: { title: '{{t:sx_cmp_mode_race}}', spots: {
          race: ['{{t:sx_cmp_mode_race}}', 'Tus elecciones como barras que corren hacia arriba, periodo a periodo.'],
          canvas: ['La carrera', 'Se abre en el resultado. Pulsa play para verla desde el principio.'],
          start: ['Al principio', 'Vuelve al primer periodo.'],
          play: ['Play', 'Reproduce o pausa la carrera.'],
          step: ['Un paso', 'Un periodo adelante (el botón a la izquierda de play va atrás).'],
          seek: ['Cualquier fecha', 'Arrastra a cualquier momento.'],
          speeds: ['Velocidad', 'De 0.5× a 4×.'],
          gif: ['{{t:btn_download_gif}}', 'Guarda la carrera como imagen animada.'],
          range: ['Las fechas de la carrera', 'La carrera tiene su propio rango, desde tu primera escucha. Cámbialo aquí; {{t:btn_reset}} lo devuelve.']
        } },
        vol: { title: '{{t:sx_vol_title}}', spots: {
          gran: ['Por día, mes o año', 'Cómo se dividen las barras.'],
          mode: ['{{t:sx_vol_mode_plays}} / {{t:sx_vol_mode_new}}', 'Todas tus escuchas con la parte nueva encima, o solo lo que era nuevo para ti.'],
          labels: ['Cifras en las barras', 'Muestra la cifra de cada barra.'],
          zoom: ['Quitar zoom', 'Arrastra sobre la gráfica para acercar; este botón vuelve a alejar.'],
          figs: ['Las cifras', 'Totales del rango. También son la leyenda: azul es {{t:sx_vol_known}}, verde es {{t:sx_vol_new}}.'],
          busiest: ['{{t:sx_v_month}}', 'Haz clic para ver ese mes por dentro.'],
          canvas: ['Las barras', 'Haz clic en cualquier barra para ver ese periodo por dentro.']
        } },
        drill: { title: 'Dentro de un periodo', spots: {
          when: ['El periodo', 'Cuál es, y cómo fue frente al anterior.'],
          step: ['Antes / después', 'Pasa al periodo anterior o al siguiente.'],
          figs: ['Sus cifras', 'Escuchas, cuánto fue nuevo, canciones y artistas.'],
          hero: ['La más escuchada', 'Su canción top, con una muestra.'],
          spark: ['{{t:sx_cal_title}}', 'Cada día del periodo, con el de más escuchas resaltado.'],
          tabs: ['Tres listas', '{{t:sx_dr_tab_top}}, {{t:sx_dr_tab_new}} y {{t:sx_dr_tab_art}}.'],
          rows: ['La lista', 'Haz clic en una para abrir su ventana.'],
          open: ['{{t:sx_drill_open}}', 'Abre el ranking de ese periodo.']
        } },
        clock: { title: '{{t:sx_clock_title}} y {{t:sx_week_title}}', spots: {
          clock: ['{{t:sx_clock_title}}', 'Cada porción es una hora; más larga, más escuchas. Pasa el ratón (o toca) para ver qué escuchabas entonces.'],
          parts: ['Partes del día', 'Mañana, tarde, noche y madrugada, y la parte de cada una.'],
          cnote: ['En una frase', 'Tus horas con más y con menos escuchas.'],
          wfigs: ['Entre semana frente al fin de semana', 'Escuchas al día en cada uno, y tu día con más escuchas.'],
          week: ['{{t:sx_week_title}}', 'Media de escuchas de cada día. Haz clic en un día para ver más.'],
          wnote: ['En una frase', 'Tus días con más y con menos escuchas.']
        } },
        heat: { title: '{{t:hm_title}}', spots: {
          types: ['{{t:hm_type_all}} / {{t:hm_type_artist}} / {{t:hm_type_song}} / {{t:hm_type_album}}', 'Todas tus escuchas, o solo un artista, una canción o un álbum: añádelo por su nombre.'],
          colors: ['Colores', 'Elige una combinación de colores para el mapa.'],
          year: ['El año', 'Pasa al año anterior o al siguiente.'],
          best: ['Mejor racha', 'Tu racha más larga de días con música.'],
          figs: ['El año en cifras', 'Escuchas, mejor día, artista top y artistas nuevos.'],
          grid: ['Cada día', 'Un cuadro por día, más intenso cuanto más escuchaste. Pasa el ratón (o toca) para ver qué escuchabas.'],
          strip: ['{{t:hm_every_year}}', 'Cada año en miniatura. Haz clic en uno para abrirlo.'],
          patterns: ['{{t:hm_patterns}}', 'Cuándo escuchas a lo largo de la semana.'],
          scope: ['{{t:hm_pat_year}} / {{t:hm_pat_all}}', 'Patrones del año abierto o de siempre.'],
          rhythm: ['Ritmo semanal', 'Escuchas al día de cada día de la semana.'],
          hours: ['Hora del día', 'Cada hora de cada día de la semana. La de más escuchas va rodeada.']
        } }
      },
      howto: {
        range: { title: 'Elegir un rango', slides: [
          'Elige un rango rápido: las últimas 4 semanas, 12 meses, 3 años, o todo.',
          'O pon tu propia fecha de inicio y de fin.',
          'Todas las pestañas usan el mismo rango. Cambia de pestaña cuando quieras.',
          'En {{t:sx_tab_compare}} y {{t:sx_tab_charts}}, elige además por día, mes o año.'
        ] },
        overview: { title: 'Leer tu {{t:sx_tab_overview}}', slides: [
          'Empieza por la frase: tu rango en una línea.',
          'Las flechas comparan con el mismo periodo justo antes.',
          'Cada casilla lleva a la gráfica que cuenta más.',
          'Tu top 5: cambia entre canciones, artistas y álbumes.',
          'Mira qué escuchaste más, y menos, que antes.',
          'Haz clic en cualquier día del calendario para abrir el ranking de ese día.'
        ] },
        story: { title: 'Ver tu historia', slides: [
          'Abre {{t:sx_tab_story}}.',
          'Tu artista top de cada mes. Haz clic en uno para abrir el ranking de ese mes.',
          'Tus eras: cuando un artista mandó en tu ranking semanal.',
          'Cómo cambió tu top 10 año a año.',
          'Y los artistas nuevos que encontraste, y si aún los escuchas.'
        ] },
        game: { title: 'Jugar una partida', slides: [
          'Empieza por el {{t:sx_daily_k}}: un reto, el mismo todo el día.',
          'O elige cualquiera de los doce juegos.',
          'Haz tu apuesta.',
          'Tu puntuación y tu mejor marca, arriba.',
          'Ciérralo cuando quieras.',
          'Tu marcador cuenta los juegos jugados y tu racha de días.'
        ] },
        compare: { title: 'Comparar artistas, canciones o años', slides: [
          'Elige qué comparar.',
          'Escribe un nombre y añádelo. Hasta 10.',
          'Cada elección tiene su tarjeta y su color. La ✕ la quita.',
          'Elige cómo verlos: total acumulado, por periodo, trayectoria o carrera.',
          'Haz clic en un nombre de la leyenda para ocultar o mostrar su línea.',
          'Baja: cara a cara, quién estuvo arriba, las diferencias, sus canciones top y sus hábitos.',
          'Guarda la selección para volver a ella.'
        ] },
        race: { title: 'Ver una carrera', slides: [
          'En {{t:sx_tab_compare}}, elige {{t:sx_cmp_mode_race}}.',
          'Pulsa play.',
          'Arrastra a cualquier momento.',
          'Más lenta o más rápida.',
          'Guárdala como imagen animada para compartirla.'
        ] },
        drill: { title: 'Ver un mes por dentro', slides: [
          'En {{t:sx_tab_charts}}, haz clic en cualquier barra.',
          'O haz clic en el periodo con más escuchas.',
          'Se abre debajo de la gráfica. Las flechas pasan al periodo anterior o siguiente.',
          'Cambia entre canciones top, hallazgos nuevos y artistas top.',
          'Abre el ranking de ese periodo.'
        ] },
        heat: { title: 'Explorar el mapa de calor', slides: [
          'Cada día del año, más intenso cuanto más escuchaste. Pasa el ratón por un día.',
          'Recorre los años.',
          'Muestra solo un artista, una canción o un álbum.',
          'Elige una combinación de colores.',
          'Y mira las horas de la semana en que más escuchas.'
        ] }
      },
      options: {
        range: { title: 'Rango', items: {
          presets: ['{{t:range_4w}} / {{t:range_12m}} / {{t:range_3y}} / {{t:range_all}}', 'Un rango rápido hasta hoy.'],
          dates: ['Fechas', 'Cualquier inicio y fin.'],
          gran: ['{{t:gran_daily}} / {{t:gran_monthly}} / {{t:gran_yearly}}', 'Cómo se dividen las gráficas. Solo {{t:sx_tab_compare}} y {{t:sx_tab_charts}}.']
        } },
        tabs: { title: 'Pestañas', items: {
          overview: ['{{t:sx_tab_overview}}', 'El rango en una frase, cuatro casillas y ocho tarjetas.'],
          story: ['{{t:sx_tab_story}}', 'De qué fue el rango.'],
          games: ['{{t:sx_tab_games}}', 'Doce juegos y un juego del día.'],
          compare: ['{{t:sx_tab_compare}}', 'Hasta 10 lado a lado, o en carrera.'],
          charts: ['{{t:sx_tab_charts}}', 'Volumen, el reloj, tu semana y el mapa de calor.']
        } },
        overview: { title: '{{t:sx_tab_overview}}', items: {
          share: ['{{t:sx_share}}', 'Una imagen del resumen.'],
          t5seg: ['{{t:sx_top5_title}}', 'Canciones, artistas o álbumes.'],
          mvseg: ['{{t:sx_mov_title}}', 'Canciones, artistas o álbumes.'],
          shuffle: ['{{t:sx_fact_shuffle}}', 'Otros datos curiosos.']
        } },
        compare: { title: '{{t:sx_tab_compare}}', items: {
          types: ['Qué', '{{t:sx_cmp_type_artists}}, {{t:sx_cmp_type_songs}}, {{t:sx_cmp_type_albums}}, {{t:sx_cmp_type_years}}.'],
          modes: ['Cómo', '{{t:sx_cmp_mode_cum}}, {{t:sx_cmp_mode_per}}, {{t:sx_cmp_mode_run}}, {{t:sx_cmp_mode_race}}.'],
          crun: ['{{t:sx_cmp_mode_run}}', 'Qué ranking: {{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}}, {{t:nav_yearly}}.'],
          top: ['Top 3 / {{t:sx_cmp_fill10}}', 'Llena la selección con tus favoritos.'],
          saved: ['{{t:sx_saved_title}}', 'Selecciones guardadas.'],
          legend: ['Leyenda', 'Oculta o muestra una línea.'],
          h2hshare: ['{{t:sx_share}}', 'Una imagen de la comparación.']
        } },
        race: { title: '{{t:sx_cmp_mode_race}}', items: {
          speeds: ['Velocidad', '0.5×, 1×, 2×, 4×.'],
          gif: ['{{t:btn_download_gif}}', 'Guarda la carrera.'],
          range: ['Rango', 'Las fechas propias de la carrera.']
        } },
        graphs: { title: '{{t:sx_tab_charts}}', items: {
          mode: ['{{t:sx_vol_mode_plays}} / {{t:sx_vol_mode_new}}', 'Todas las escuchas, o solo lo nuevo.'],
          labels: ['Cifras en las barras', 'Sí o no.'],
          zoom: ['Quitar zoom', 'Vuelve al rango entero.'],
          drtabs: ['Dentro de un periodo', '{{t:sx_dr_tab_top}}, {{t:sx_dr_tab_new}}, {{t:sx_dr_tab_art}}.'],
          hmtypes: ['Mapa de calor', '{{t:hm_type_all}}, {{t:hm_type_artist}}, {{t:hm_type_song}}, {{t:hm_type_album}}.'],
          colors: ['Colores del mapa', 'Seis combinaciones de colores.'],
          scope: ['{{t:hm_patterns}}', '{{t:hm_pat_year}} o {{t:hm_pat_all}}.']
        } }
      },
      challenges: {
        'stats.range': ['Cambia el rango', 'Un rango rápido o tus propias fechas.'],
        'stats.story': ['Abre {{t:sx_tab_story}}', 'La segunda pestaña.'],
        'stats.go': ['Sigue el enlace de una casilla', 'Debajo de cualquiera de las cuatro casillas de {{t:sx_tab_overview}}.'],
        'stats.game': ['Juega una partida', 'Cualquier juego de {{t:sx_tab_games}}, o el {{t:sx_daily_k}}.'],
        'stats.add': ['Añade algo a {{t:sx_tab_compare}}', 'Escribe un nombre en la casilla de añadir.'],
        'stats.race': ['Mira una carrera', '{{t:sx_tab_compare}} → {{t:sx_cmp_mode_race}}.'],
        'stats.drill': ['Mira un periodo por dentro', 'Haz clic en una barra de {{t:sx_tab_charts}}.'],
        'stats.heat': ['Cambia el mapa de calor', 'Otro año, color o vista.']
      },
      quiz: {
        q1: ['Una casilla dice ▲ 20%. ¿Frente a qué?',
          ['El mismo tiempo justo antes', 'El año pasado', 'Tu media de siempre'],
          'Cada casilla compara el rango con el mismo periodo justo antes.'],
        q2: ['¿Dónde puedes ver a tus artistas top hacer una carrera?',
          ['{{t:sx_tab_story}}', '{{t:sx_tab_compare}} → {{t:sx_cmp_mode_race}}', '{{t:sx_tab_games}}'],
          '{{t:sx_cmp_mode_race}} es una de las cuatro formas en que {{t:sx_tab_compare}} muestra tus elecciones.'],
        q3: ['¿Qué tiene de especial el {{t:sx_daily_k}}?',
          ['Es un tipo de juego nuevo', 'Da puntos dobles', 'Todos tienen el mismo reto todo el día, y solo cuenta tu primer intento'],
          'Un reto al día, el mismo todo el día. Juega cada día para mantener tu racha.']
      },
      tips: [
        'Las casillas de {{t:tab_stats}} comparan tu rango con el mismo periodo justo antes. Prueba {{t:range_4w}} para ver la tendencia de este mes.',
        'En {{t:sx_tab_compare}}, {{t:sx_cmp_mode_race}} convierte a tus artistas top en una carrera que puedes guardar como GIF.',
        'Cada día te espera un nuevo {{t:sx_daily_k}} en {{t:sx_tab_games}}. Mantén tu racha.',
        'Haz clic en cualquier barra de {{t:sx_tab_charts}} para ver las canciones top y los hallazgos nuevos de ese mes.',
        'El mapa de calor tiene seis combinaciones de colores, y puede mostrar un solo artista, canción o álbum.'
      ]
    },
    records: {
      title: '{{t:nav_records}}',
      promise: 'Tu libro de récords: números uno, debuts, más escuchas, rachas, certificaciones y más, para canciones, artistas y álbumes.',
      scenes: {
        top: { title: '{{t:sec_records_title}}', spots: {
          intro: ['Qué cuenta', 'El tamaño de cada ranking del que salen los récords, y cuántos días, semanas, meses y años tienes.'],
          search: ['Buscar en todos los récords', 'Escribe un artista, una canción o un álbum para ver todos sus récords, en todas las secciones.'],
          nav: ['Secciones', '{{t:rec_nav_overview}}, luego {{t:rec_grp_chart}} y {{t:rec_grp_plays}}. Se ve una sección a la vez.'],
          grp: ['Dos grupos', '{{t:rec_grp_chart}} salen de tus rankings; {{t:rec_grp_plays}} salen de tus escuchas.'],
          count: ['Cuántas', 'Cuántas listas de récords tiene la sección.'],
          picker: ['{{t:rec_picker_label}}', 'En el móvil, las secciones están en este menú.'],
          hero: ['{{t:rec_hero_label}}', 'El artista con más récords, y cuántos tiene.'],
          reel: ['Sus récords', 'Una tira con sus récords. Se mueve sola; arrástrala para verlos.'],
          card: ['Un récord', 'Qué es, la cifra y cuándo. La insignia es su puesto en esa lista.']
        } },
        ov: { title: '{{t:rec_nav_overview}}', spots: {
          intro: ['Lo mejor de cada una', 'Quién tiene el récord de cada sección, en una página.'],
          types: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Cambia todas las tarjetas a la vez.'],
          grp: ['Dos grupos', '{{t:rec_grp_chart}} y {{t:rec_grp_plays}}, como en el menú.'],
          cell: ['Una tarjeta', 'Quién lo tiene y su cifra. Haz clic para abrir esa sección.'],
          value: ['El récord', 'La cifra a batir.'],
          sw: ['Qué ranking', 'Cambia una tarjeta entre {{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} y {{t:nav_yearly}}.']
        } },
        ones: { title: '{{t:rec_nav_all_ones}}: así es cada sección', spots: {
          story: ['En una frase', 'El récord y quién lo tiene. Cambia con los botones de abajo.'],
          ent: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quién ver los récords.'],
          per: ['Qué ranking', '{{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} o {{t:nav_yearly}}.'],
          run: ['{{t:rec_run_total}} / {{t:rec_run_consec}}', 'Todas las semanas en el #1 sumadas, o la racha más larga sin cortes.'],
          sort: ['{{t:rec1_sort}}', '{{t:rec1_sort_rank}}, {{t:rec1_sort_recent}}, {{t:rec1_sort_oldest}} o {{t:rec1_sort_name}}.'],
          champ: ['El primero', 'El #1 de la lista, en grande: su cifra y cuándo.'],
          boxes: ['Su trayectoria', 'Cada vez que fue #1. Los huecos punteados son el tiempo entre medias.'],
          sample: ['Muestra', 'Escucha 30 segundos.'],
          details: ['Detalles', 'Abre su ventana.'],
          runner: ['#2 y #3', 'Los dos que le siguen. Haz clic en ▸ para su ventana.']
        } },
        list: { title: 'La lista', spots: {
          heads: ['Columnas', 'Haz clic en un título para ordenar por él.'],
          all: ['{{t:rec_expand_all}}', 'Abre o cierra todas las trayectorias a la vez.'],
          name: ['La entrada', 'Haz clic en su nombre para abrir su ventana.'],
          tl: ['Cuándo', 'Una línea de tu historia: cada marca es una vez en el #1.'],
          date: ['Fechas', 'Haz clic en una fecha para abrir ese ranking.'],
          toggle: ['Su trayectoria', 'Abre o cierra su trayectoria bajo la fila.'],
          runrow: ['La trayectoria', 'Cada semana en el #1, con los huecos. Haz clic en una casilla para ver ese ranking.']
        } },
        sort: { title: '{{t:rec1_sort}}', spots: {
          btn: ['{{t:rec1_sort}}', 'Abre el menú.'],
          rank: ['{{t:rec1_sort_rank}}', 'El récord más grande primero.'],
          recent: ['{{t:rec1_sort_recent}}', 'Lo último primero.'],
          oldest: ['{{t:rec1_sort_oldest}}', 'Desde el principio de tu historia.'],
          name: ['{{t:rec1_sort_name}}', 'Por orden alfabético.']
        } },
        foot: { title: '{{t:rec_size_label}}', spots: {
          note: ['Cuántas se ven', 'Cuántas entradas de la lista ves.'],
          show: ['{{t:rec_size_label}}', 'Lo larga que es cada lista.'],
          sizes: ['Tamaños', '10, 25, 50 o 100.']
        } },
        search: { title: 'Buscar', spots: {
          field: ['Buscar', 'Un artista, una canción o un álbum.'],
          clear: ['Borrar', 'Vuelve a la página normal.'],
          status: ['Coincidencias', 'Cuántos récords coinciden, y en cuántas secciones.'],
          nav: ['Todas las secciones a la vez', 'Mientras buscas, se ven todas las secciones, solo con las filas que coinciden.']
        } },
        pak: { title: '{{t:rec_nav_pak}}', spots: {
          story: ['Quién lo tiene', 'Quién tiene más, y cuántos hay en total.'],
          about: ['Qué es', 'Un artista en el #1 de los rankings de artistas, canciones y álbumes a la vez.'],
          info: ['{{t:rec_pak_info_btn}}', 'Abre la explicación completa.'],
          infotext: ['La explicación', 'Qué hace falta, en pocas líneas.'],
          per: ['Qué ranking', '{{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} o {{t:nav_yearly}}.'],
          champ: ['Quién lo tiene', 'Con su primera canción y su primer álbum en lograrlo.'],
          details: ['Detalles', 'Abre su ventana.']
        } },
        nc: { title: '{{t:rec_nav_new_charts}}', spots: {
          about: ['Qué es', 'Récords de {{t:rec_nav_new_charts}}: solo canciones, artistas y álbumes que encontraste hace poco.'],
          tabs: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quién ver los récords.'],
          title: ['Una lista', 'Cada lista tiene su título.'],
          fold: ['Plegar', 'Pliega una lista; pulsa otra vez para abrirla.'],
          champ: ['El primero', 'El #1 de esa lista.']
        } },
        mil: { title: '{{t:rec_nav_milestones}}', spots: {
          tabs: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quién ver los hitos.'],
          sub: ['Cómo funciona', 'Quién llegó antes a cada cifra redonda.'],
          tier: ['Un hito', 'El número de escuchas.'],
          art: ['Quién llegó antes', 'Y cuándo.'],
          more: ['Más', 'Abre los hitos plegados entre medias.']
        } },
        fast: { title: '{{t:rec_nav_fastest}}', spots: {
          tabs: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quién ver los récords.'],
          pick: ['{{t:fast_pick_pre}} … {{t:fast_pick_post}}', 'Elige el número de escuchas de la carrera.'],
          sub: ['Cuántos llegaron', 'Cuántos alcanzaron esa cifra.'],
          champ: ['El más rápido', 'Cuánto tardó desde su primera escucha.']
        } },
        streaks: { title: '{{t:rec_nav_streaks}}', spots: {
          ent: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quién ver las rachas.'],
          per: ['Días, semanas, meses, años', 'Escuchado todos los días seguidos, todas las semanas seguidas, etc.'],
          b2b: ['{{t:rec_per_runs}}', 'Las veces que se escuchó seguida, sin nada en medio.'],
          sub: ['Cómo cuenta', 'Qué mide la lista.'],
          champ: ['La más larga', 'Desde cuándo hasta cuándo.']
        } },
        certs: { title: '{{t:rec_nav_certs}}', spots: {
          story: ['El líder', 'El artista con más certificaciones.'],
          tiers: ['Qué hace falta', 'Las escuchas necesarias para Oro, Platino y Diamante, en canciones y en álbumes.'],
          card: ['Una placa', 'Los tres primeros artistas, cada uno en su placa.'],
          total: ['Certificaciones', 'Cuántas tienen en total.'],
          bar: ['La mezcla', 'Diamante, Platino y Oro, en una barra.'],
          tally: ['Canciones y álbumes', 'Sus certificaciones por nivel.'],
          open: ['{{t:certd_open_ledger}}', 'Abre su registro completo bajo las placas.']
        } },
        ledger: { title: '{{t:certd_title}}', spots: {
          tally: ['En total', 'Todas sus certificaciones.'],
          facts: ['Datos clave', 'Canciones y álbumes, la primera y la última, la más rápida y el mejor ritmo.'],
          types: ['{{t:certd_all}} / {{t:certd_songs}} / {{t:certd_albums}}', 'Filtra por canciones o álbumes.'],
          tiers: ['Niveles', 'Filtra por Diamante, Platino u Oro.'],
          sort: ['{{t:certd_sort}}', 'Cambia el orden.'],
          medal: ['El nivel', 'Qué certificación, y con cuántas escuchas.'],
          row: ['Una certificación', 'La canción o el álbum, sus escuchas al día y sus escuchas ahora.'],
          journey: ['Cómo llegó', 'De su primera escucha a la certificación: cuánto tardó, y el siguiente nivel.']
        } }
      },
      howto: {
        find: { title: 'Encontrar una sección', slides: [
          'Las secciones están en el menú de la izquierda.',
          'En el móvil, abre el menú {{t:rec_picker_label}}.',
          'El número dice cuántas listas tiene.',
          'Cada sección empieza con su récord en una frase.'
        ] },
        overview: { title: 'Leer el {{t:rec_nav_overview}}', slides: [
          'Arriba: el artista con más récords.',
          'Una tira con sus récords. Arrástrala.',
          'Debajo, lo mejor de cada sección. Cámbialas todas a artistas o álbumes.',
          'Haz clic en una tarjeta para abrir su sección.',
          'O cambia una tarjeta a otro ranking.'
        ] },
        types: { title: 'Canciones, artistas o álbumes', slides: [
          'Casi todas las secciones cambian entre canciones, artistas y álbumes.',
          'Y entre tus rankings diario, semanal, mensual y anual.',
          '{{t:rec_nav_milestones}} y {{t:rec_nav_fastest}} tienen su propio selector.',
          '{{t:rec_nav_fastest}} también te deja elegir el número de escuchas.'
        ] },
        read: { title: 'Leer un récord', slides: [
          'Quién lo tiene, en grande, con su cifra.',
          'Cada vez que fue #1, con los huecos.',
          'El #2 y el #3 al lado.',
          'El resto de la lista: una línea de tiempo para cada uno.',
          'Abre la trayectoria de una fila.',
          'O ábrelas todas.'
        ] },
        count: { title: 'Total o seguidas', slides: [
          '{{t:rec_run_total}} suma todas las semanas en el #1; {{t:rec_run_consec}} cuenta solo la racha más larga sin cortes.',
          'La frase cambia con ello.',
          'Ordena por puesto, lo más reciente, lo más antiguo o nombre.',
          'O haz clic en el título de una columna.'
        ] },
        search: { title: 'Buscar en tus récords', slides: [
          'Escribe un artista, una canción o un álbum.',
          'Cuántos récords coinciden.',
          'Se ven todas las secciones, solo con las filas que coinciden.',
          'Bórralo para volver.'
        ] },
        certs: { title: 'Abrir un registro de certificaciones', slides: [
          'Las escuchas que necesita una canción o un álbum para cada nivel.',
          'Los tres primeros artistas en placas.',
          'Abre todas las certificaciones de un artista.',
          'Sus datos clave.',
          'Filtra por canciones, álbumes o nivel.',
          'Cada certificación, con cuánto tardó.'
        ] },
        more: { title: 'Ver más de una lista', slides: [
          'Cuántas entradas de la lista ves.',
          'Muestra 25, 50, 100 o todas.'
        ] }
      },
      options: {
        sections: { title: 'Secciones', items: {
          ones: ['{{t:rec_nav_all_ones}}', 'Todo lo que llegó al #1, y cuánto tiempo.'],
          pak: ['{{t:rec_nav_pak}}', '#1 en los rankings de artistas, canciones y álbumes a la vez.'],
          app: ['{{t:rec_nav_appearances}}', 'Más semanas (días, meses, años) en un ranking.'],
          debuts: ['{{t:rec_nav_debuts}}', 'Los mayores debuts.'],
          nc: ['{{t:rec_nav_new_charts}}', 'Récords de {{t:rec_nav_new_charts}}.'],
          plays: ['{{t:rec_nav_peak_plays}}', 'Más escuchas en un día, una semana, un mes o un año.'],
          mil: ['{{t:rec_nav_milestones}}', 'El primero en cada cifra redonda de escuchas.'],
          fast: ['{{t:rec_nav_fastest}}', 'El más rápido en llegar a un número de escuchas.'],
          streaks: ['{{t:rec_nav_streaks}}', 'Las rachas más largas de días, semanas, meses, años, y seguidas.'],
          certs: ['{{t:rec_nav_certs}}', 'Oro, Platino y Diamante, artista por artista.']
        } },
        switches: { title: 'En cada sección', items: {
          ent: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quién.'],
          per: ['{{t:nav_daily}} / {{t:nav_weekly}} / {{t:nav_monthly}} / {{t:nav_yearly}}', 'Qué ranking.'],
          run: ['{{t:rec_run_total}} / {{t:rec_run_consec}}', 'Sumado o sin cortes. {{t:rec_nav_all_ones}} y {{t:rec_nav_appearances}}.'],
          sort: ['{{t:rec1_sort}}', '{{t:rec1_sort_rank}}, {{t:rec1_sort_recent}}, {{t:rec1_sort_oldest}}, {{t:rec1_sort_name}}.'],
          show: ['{{t:rec_size_label}}', '10, 25, 50 o 100.'],
          all: ['{{t:rec_expand_all}}', 'Todas las trayectorias a la vez.']
        } },
        overview: { title: '{{t:rec_nav_overview}}', items: {
          types: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Todas las tarjetas a la vez.'],
          sw: ['Ranking de una tarjeta', 'Una tarjeta cada vez.']
        } },
        special: { title: 'Solo en algunas secciones', items: {
          pakinfo: ['{{t:rec_pak_info_btn}}', '{{t:rec_nav_pak}} explicado.'],
          b2b: ['{{t:rec_per_runs}}', '{{t:rec_nav_streaks}}: escuchas seguidas.'],
          fastpick: ['{{t:fast_pick_pre}} … {{t:fast_pick_post}}', '{{t:rec_nav_fastest}}: el número de escuchas.'],
          milmore: ['Más hitos', '{{t:rec_nav_milestones}}: los plegados entre medias.'],
          ncfold: ['Plegar', '{{t:rec_nav_new_charts}}: pliega una lista.']
        } },
        certs: { title: '{{t:rec_nav_certs}}', items: {
          open: ['{{t:certd_open_ledger}}', 'El registro completo.'],
          types: ['{{t:certd_all}} / {{t:certd_songs}} / {{t:certd_albums}}', 'Filtra el registro.'],
          tiers: ['Niveles', 'Diamante, Platino, Oro.'],
          sort: ['{{t:certd_sort}}', 'El orden del registro.']
        } }
      },
      challenges: {
        'rec.view': ['Abre otra sección', 'En el menú (en el móvil, el menú {{t:rec_picker_label}}).'],
        'rec.ent': ['Cambia a artistas o álbumes', 'El selector sobre cualquier lista.'],
        'rec.per': ['Cambia a otro ranking', '{{t:nav_daily}}, {{t:nav_monthly}} o {{t:nav_yearly}}, en una sección o en una tarjeta del {{t:rec_nav_overview}}.'],
        'rec.consec': ['Cuenta {{t:rec_run_consec}}', 'En {{t:rec_nav_all_ones}}.'],
        'rec.run': ['Abre la trayectoria de un récord', 'La flecha al final de una fila.'],
        'rec.search': ['Busca en tus récords', 'La casilla de arriba.'],
        'rec.ledger': ['Abre un registro de certificaciones', '{{t:rec_nav_certs}} → {{t:certd_open_ledger}}.'],
        'rec.show': ['Muestra una lista más larga', '{{t:rec_size_label}}, debajo de la lista.']
      },
      quiz: {
        q1: ['¿Qué cuenta {{t:rec_run_consec}}?',
          ['Todas las semanas en el #1 sumadas', 'Solo la racha más larga sin cortes', 'Semanas en el top 10'],
          '{{t:rec_run_total}} suma todas las semanas; {{t:rec_run_consec}} solo cuenta el tramo más largo sin cortes.'],
        q2: ['Buscas un artista. ¿Qué pasa?',
          ['Se ven todas las secciones, solo con sus récords', 'Solo cambia el {{t:rec_nav_overview}}', 'Se abre su ventana'],
          'La búsqueda filtra todas las secciones a la vez, y dice cuántos récords coinciden.'],
        q3: ['¿Qué es un {{t:rec_nav_pak}}?',
          ['Más escuchas en un día', 'Un debut en el #1', 'Un artista en el #1 de los rankings de artistas, canciones y álbumes a la vez'],
          'Los tres rankings encabezados por el mismo artista en el mismo periodo.']
      },
      tips: [
        'La búsqueda de {{t:nav_records}} muestra todos los récords de un artista, una canción o un álbum, en todas las secciones.',
        'En {{t:rec_nav_all_ones}}, cambia a {{t:rec_run_consec}} para ver las rachas más largas sin cortes en el #1.',
        'En {{t:rec_nav_certs}}, abre el registro de un artista para ver lo rápido que llegó cada Oro, Platino y Diamante.',
        'Un {{t:rec_nav_pak}} es un artista en el #1 de los tres rankings a la vez. ¿Cuántos tienes?',
        'Cada tarjeta del {{t:rec_nav_overview}} puede cambiar sola entre los rankings diario, semanal, mensual y anual.'
      ]
    },
    awards: {
      title: '{{t:nav_awards}}',
      promise: 'Tu propia gala de premios para cualquier año: elige las categorías, los nominados y los ganadores, y mira la ceremonia. Y cómo les fue a tus artistas en los premios reales.',
      scenes: {
        top: { title: '{{t:awards_tab_mygrammys}}', spots: {
          sub: ['{{t:awards_tab_mygrammys}} / {{t:awards_tab_reallife}}', 'Tus propios premios, o los premios de la vida real.'],
          year: ['El año', 'Cada año tiene su propia papeleta. Haz clic en el año para saltar a otro.'],
          config: ['{{t:awards_configure}}', 'Qué categorías hay este año, las fechas que cuentan y algunos ajustes.'],
          gen: ['{{t:awards_generate}}', 'Llena todas las categorías con nominados de tus escuchas de una vez.'],
          cer: ['{{t:awards_ceremony_btn}}', 'Reproduce la gala a pantalla completa. También está al final de la página.'],
          share: ['{{t:awards_share_btn}}', 'Un enlace con el que cualquiera puede ver tu ceremonia.'],
          sum: ['{{t:awx_title}}', 'El año de un vistazo: más nominaciones, más premios y más. Ábrelo para verlo todo.'],
          tools: ['Herramientas de la papeleta', 'Cuántas quedan por decidir, ocultar las decididas, abrir o plegar las tarjetas.'],
          views: ['{{t:awards_view_label}}', '{{t:awards_view_ballot}}, {{t:awards_view_spotlight}}, {{t:awards_view_tiles}}, {{t:awards_view_collage}} o {{t:awards_view_reel}}.']
        } },
        empty: { title: 'Un año nuevo', spots: {
          year: ['El año', 'Un año que aún no has preparado.'],
          gen: ['{{t:awards_generate}}', 'La forma más rápida de empezar: nominados para todas las categorías a la vez.'],
          card: ['Una categoría', 'Su tipo (canción, álbum o artista), su nombre y lo que premia.'],
          onoff: ['Sí / no', 'Saca la categoría de la gala de este año, o la vuelve a poner.'],
          fav: ['Favorita', 'Marca con estrella las categorías que siempre quieres.'],
          pick: ['{{t:awards_pick_nominees_btn}}', 'Elige tú los nominados de una categoría.']
        } },
        cards: { title: 'La papeleta', spots: {
          left: ['{{t:awards_pending}}', 'Cuántas categorías aún necesitan ganador.'],
          hide: ['{{t:awards_hide_decided}}', 'Oculta las categorías que ya tienen ganador.'],
          fold: ['Abrir / plegar', '{{t:awards_expand_all}} o {{t:awards_collapse_all}}: en todas las tarjetas, o solo en las de {{t:awards_fold_scope_pending}}.'],
          views: ['{{t:awards_view_label}}', 'Cinco maneras de ver la papeleta.'],
          hint: ['{{t:awards_pick_hint}}', 'Haz clic en un nominado para hacerlo ganador. Otro clic lo deshace.'],
          head: ['Una categoría', 'Su tipo, su número de nominados, su nombre y lo que premia.'],
          onoff: ['Sí / no', 'Saca la categoría de la gala.'],
          fav: ['Favorita', 'Marca la categoría con estrella.'],
          fold1: ['Plegar', 'Pliega esta tarjeta.'],
          winner: ['El ganador', 'En dorado, con trofeo.'],
          nom: ['Un nominado', 'Haz clic para coronarlo.'],
          change: ['{{t:awards_change_btn}}', 'Abre el selector de nominados de esta categoría.'],
          playlist: ['{{t:awx_playlist}}', 'Guarda los nominados como lista.'],
          reorder: ['{{t:awards_reorder}}', 'Mueve los nominados arriba y abajo.']
        } },
        config: { title: '{{t:awards_configure}}', spots: {
          elig: ['{{t:awards_elig_window}}', 'Las fechas que cuentan para los premios de este año.'],
          gemini: ['Clave de Gemini', 'Opcional: una clave gratis {{t:awx_cfg_gemini_hint}}.'],
          credit: ['{{t:awx_cfg_credit}}', 'Una nominación cuenta también para los artistas invitados, no solo para el principal.'],
          hideplays: ['{{t:awx_cfg_hide_plays}}', 'La papeleta va de tus elecciones, no de los números.'],
          rating: ['{{t:awx_cfg_scores}}', 'Tu nota de 0 a 10 junto a cada nominado que valoraste.'],
          samples: ['{{t:awx_cfg_samples}}', 'Un botón ♪ que reproduce 30 segundos de cada nominado.'],
          count: ['Cuántas hay', 'Categorías activas este año, de todas las que hay.'],
          bulk: ['{{t:awards_enable_all}} / {{t:awards_disable_all}}', 'Todas las categorías a la vez, o solo tus favoritas.'],
          favs: ['Solo favoritas', 'Activa solo las categorías con estrella.'],
          search: ['Buscar', 'Encuentra una categoría por su nombre.'],
          type: ['Canción, álbum, artista', 'Muestra solo un tipo.'],
          status: ['Activas o no', 'Muestra solo las categorías activas, o las que no.'],
          groups: ['Grupos', 'Salta a un grupo: premios principales, rock, pop, vídeos y más.'],
          group: ['Un grupo', 'Activa o desactiva todo el grupo.'],
          cat: ['Una categoría', 'Haz clic para activarla o desactivarla.'],
          catfav: ['Estrella', 'Hazla favorita.']
        } },
        picker: { title: 'Elegir nominados', spots: {
          title: ['La categoría', 'Para qué año y categoría eliges.'],
          fav: ['Favorita', 'Marca la categoría con estrella.'],
          close: ['Cerrar', 'Pregunta antes si tienes cambios.'],
          ballot: ['{{t:awx_pk_nominees}}', 'Lo que llevas elegido. {{t:awx_pk_drag}}.'],
          tally: ['Cuántos', 'Hasta 8.'],
          quick: ['Elección rápida', 'Llena los 8 primeros, los 5 primeros, o {{t:awx_pk_clear}}.'],
          nom: ['Una elección', 'Su puesto, una muestra, su vídeo y ✕ para quitarla.'],
          clip: ['Muestra', 'Escucha 30 segundos.'],
          x: ['Quitar', 'La quita de la lista.'],
          search: ['Buscar', 'Cualquier canción de ese año.'],
          sort: ['Ordenar', 'Cómo se ordena la lista de abajo.'],
          group: ['{{t:awx_pk_suggested}}', 'Las que mejor encajan, primero.'],
          row: ['Una sugerencia', 'Sus géneros, cuánto encaja en la categoría y sus escuchas. Haz clic para añadirla o quitarla.'],
          save: ['{{t:awards_save_nominees}}', 'Los pone en la papeleta.']
        } },
        sum: { title: '{{t:awx_title}}', spots: {
          head: ['El año de un vistazo', 'Cuántas nominaciones, categorías y artistas, y quién va en cabeza.'],
          toggle: ['Abrir / cerrar', 'Más nominaciones y premios de siempre, y los líderes de este año.']
        } },
        intro: { title: 'La ceremonia', spots: {
          badge: ['La gala', 'De qué año son los premios.'],
          dots: ['Progreso', 'Un punto por categoría.'],
          cats: ['{{t:awards_ceremony_cats}}', 'La lista de categorías: salta a cualquiera.'],
          sound: ['Sonido', 'Música y efectos, sí o no.'],
          close: ['Cerrar', 'Sal de la gala. Esc hace lo mismo.'],
          title: ['{{t:awx_title}}', 'La gala empieza con los más nominados del año.'],
          slide: ['{{t:awx_cer_before}}', 'Más nominaciones de siempre y de este año.'],
          progress: ['Dónde estás', 'Antes de la gala, luego 1 de 6, etc.'],
          next: ['{{t:awx_cer_start}}', 'Al primer premio.']
        } },
        cat: { title: 'Un premio', spots: {
          title: ['La categoría', 'Su nombre, en grande.'],
          noms: ['Los nominados', 'Todos los nominados, con su portada.'],
          nom: ['Un nominado', 'Su título y su artista.'],
          env: ['El sobre', 'El ganador está dentro.'],
          meet: ['{{t:awx_cer_meet}}', 'Antes, unos segundos de cada nominado.'],
          open: ['{{t:awards_open_envelope}}', 'Revela el ganador.'],
          prev: ['Anterior', 'El premio anterior. ← hace lo mismo.'],
          progress: ['Cuenta', 'Qué premio de cuántos.'],
          next: ['Siguiente', 'El siguiente premio. → hace lo mismo.']
        } },
        win: { title: 'El ganador', spots: {
          label: ['Ganador', 'El sobre está abierto.'],
          name: ['El ganador', 'Y su artista.'],
          art: ['Su portada', 'Con el trofeo.'],
          play: ['Su canción', 'Suena una muestra; páusala o repítela aquí.'],
          next: ['Siguiente', 'Al siguiente premio.']
        } },
        fin: { title: '{{t:awx_cer_winners}}', spots: {
          grid: ['{{t:awx_cer_winners}}', 'Todos los ganadores de la noche.'],
          card: ['Un ganador', 'Su categoría, su título y su artista.'],
          stats: ['Después de la gala', 'Las estadísticas y récords finales, con los premios de este año sumados.']
        } },
        side: { title: '{{t:awards_ceremony_cats}}', spots: {
          cats: ['{{t:awards_ceremony_cats}}', 'Abre y cierra la lista.'],
          side: ['Todas las categorías', 'Haz clic en una para saltar a ella.']
        } },
        share: { title: '{{t:cer_share_title}}', spots: {
          title: ['{{t:cer_share_title}}', 'Comparte tu ceremonia con un enlace.'],
          body: ['Cómo funciona', 'Quien tenga el enlace puede verla, sin cuenta.'],
          foot: ['{{t:cer_share_signin}}', 'Para crear el enlace hay que iniciar sesión. Después, cópialo desde aquí.']
        } },
        real: { title: '{{t:awards_tab_reallife}}', spots: {
          sub: ['{{t:awards_tab_reallife}}', 'Premios reales, comparados con lo que escuchas.'],
          shows: ['Las galas', 'Grammys, VMAs, AMAs, iHeartRadio, World Music, Billboard, ARIA, Juno y BRIT.'],
          year: ['El año', 'Recorre los años de la gala.'],
          head: ['La gala', 'Su nombre y cuántas categorías.'],
          sub2: ['Qué escuchas cuentan', 'Tus escuchas durante la temporada de esa gala.'],
          tally: ['Tus artistas', 'Cuántas nominaciones y premios consiguieron tus artistas.'],
          card: ['Un artista', 'Todas sus nominaciones y premios.'],
          plays: ['Escuchas esa temporada', 'Cuánto lo escuchaste entonces.'],
          won: ['{{t:awx_rl_won}}', 'Un premio.'],
          nomd: ['{{t:awx_rl_nominated}}', 'Una nominación.'],
          work: ['Por qué', 'La canción, el álbum o el vídeo.']
        } }
      },
      howto: {
        setup: { title: 'Preparar un año', slides: [
          'Elige el año.',
          'Abre {{t:awards_configure}}.',
          'Las fechas que cuentan.',
          'Salta a un grupo de categorías.',
          'Haz clic en una categoría para activarla o desactivarla.',
          'Y algunos ajustes, como muestras en cada nominado.'
        ] },
        gen: { title: 'Nominados en un clic', slides: [
          'Pulsa {{t:awards_generate}}.',
          'Cada categoría recibe hasta 8 nominados de tus escuchas.',
          'Luego cambia los que quieras.'
        ] },
        pick: { title: 'Elegir tú los nominados', slides: [
          'Pulsa {{t:awards_change_btn}} (o {{t:awards_pick_nominees_btn}}) en una categoría.',
          'Primero las sugerencias, las que mejor encajan arriba. Haz clic para añadir una.',
          'O busca cualquier canción de ese año.',
          'Llena los 8 primeros de una vez.',
          'Arrastra tus elecciones para ordenarlas.',
          'Guarda.'
        ] },
        win: { title: 'Coronar a los ganadores', slides: [
          'Haz clic en un nominado.',
          'Se vuelve dorado: es tu ganador.',
          'Mira cuántas quedan.',
          'Oculta las que ya decidiste.'
        ] },
        view: { title: 'Ver la papeleta de cinco maneras', slides: [
          'Cambia la vista aquí.',
          '{{t:awards_view_spotlight}}: el ganador en grande, con escuchas.',
          '{{t:awards_view_tiles}}: portadas en cuadrícula.',
          '{{t:awards_view_collage}}: una portada grande y el resto alrededor.',
          '{{t:awards_view_reel}}: una tira que se desliza de lado.'
        ] },
        cer: { title: 'Ver la ceremonia', slides: [
          'Pulsa {{t:awards_ceremony_btn}}.',
          'Empieza con los líderes del año.',
          '{{t:awx_cer_start}}.',
          'Escucha a los nominados.',
          'Abre el sobre.',
          'Y el ganador es…',
          'Al siguiente premio.',
          'Termina con todos los ganadores de la noche.'
        ] },
        share: { title: 'Compartir tu ceremonia', slides: [
          'Salta a cualquier categoría desde la lista.',
          'Activa o quita el sonido.',
          'Pulsa {{t:awards_share_btn}} en la página de Premios.',
          'Inicia sesión y copia el enlace para enviarlo.'
        ] },
        real: { title: 'Ver los premios reales', slides: [
          'Abre {{t:awards_tab_reallife}}.',
          'Elige una gala.',
          'Y un año.',
          'Cómo les fue a tus artistas.',
          'Cada nominación y premio, artista por artista.'
        ] }
      },
      options: {
        bar: { title: 'Arriba', items: {
          year: ['El año', 'Cada año tiene su propia papeleta.'],
          config: ['{{t:awards_configure}}', 'Categorías, fechas y ajustes.'],
          gen: ['{{t:awards_generate}}', 'Nominados para todas las categorías.'],
          cer: ['{{t:awards_ceremony_btn}}', 'La gala a pantalla completa.'],
          share: ['{{t:awards_share_btn}}', 'Un enlace a tu ceremonia.']
        } },
        views: { title: '{{t:awards_view_label}}', items: {
          ballot: ['{{t:awards_view_ballot}}', 'Una lista por categoría.'],
          spotlight: ['{{t:awards_view_spotlight}}', 'El ganador en grande, con escuchas.'],
          tiles: ['{{t:awards_view_tiles}}', 'Portadas en cuadrícula.'],
          collage: ['{{t:awards_view_collage}}', 'Una portada grande y el resto alrededor.'],
          reel: ['{{t:awards_view_reel}}', 'Una tira de lado.']
        } },
        tools: { title: 'La papeleta', items: {
          hide: ['{{t:awards_hide_decided}}', 'Solo lo que queda por decidir.'],
          fold: ['{{t:awards_fold_scope_all}} / {{t:awards_fold_scope_pending}}', 'Qué tarjetas se abren o pliegan juntas.'],
          onoff: ['Sí / no', 'Por categoría.'],
          fav: ['Favorita', 'Marca una categoría.'],
          playlist: ['{{t:awx_playlist}}', 'Los nominados como lista.'],
          reorder: ['{{t:awards_reorder}}', 'Cambia el orden de los nominados.']
        } },
        config: { title: '{{t:awards_configure}}', items: {
          elig: ['{{t:awards_elig_window}}', 'Las fechas que cuentan.'],
          gemini: ['Clave de Gemini', 'Opcional, {{t:awx_cfg_gemini_hint}}.'],
          credit: ['{{t:awx_cfg_credit}}', 'Los invitados comparten el mérito.'],
          hideplays: ['{{t:awx_cfg_hide_plays}}', 'Sin escuchas en la papeleta.'],
          rating: ['{{t:awx_cfg_scores}}', 'Tus notas junto a los nominados.'],
          samples: ['{{t:awx_cfg_samples}}', 'Un ♪ en cada nominado.'],
          bulk: ['{{t:awards_enable_all}} / {{t:awards_disable_all}}', 'Todas las categorías a la vez.'],
          favs: ['Solo favoritas', 'Solo tus categorías con estrella.']
        } },
        picker: { title: 'Selector de nominados', items: {
          quick: ['Los 8 primeros / Top 5 / {{t:awx_pk_clear}}', 'Llena o vacía la lista.'],
          sort: ['Ordenar', 'El orden de las sugerencias.'],
          clip: ['♪', 'Una muestra de cada uno.']
        } },
        cer: { title: 'Ceremonia', items: {
          cats: ['{{t:awards_ceremony_cats}}', 'Salta a cualquier premio.'],
          sound: ['Sonido', 'Sí o no.'],
          meet: ['{{t:awx_cer_meet}}', 'Escucha a cada nominado.'],
          open: ['{{t:awards_open_envelope}}', 'Revela el ganador.']
        } },
        real: { title: '{{t:awards_tab_reallife}}', items: {
          shows: ['Galas', 'Grammys, VMAs, AMAs, iHeartRadio, World Music, Billboard, ARIA, Juno, BRIT.']
        } }
      },
      challenges: {
        'aw.config': ['Abre {{t:awards_configure}}', 'Arriba en {{t:awards_tab_mygrammys}}.'],
        'aw.gen': ['Genera nominados', '{{t:awards_generate}}.'],
        'aw.pick': ['Abre el selector de nominados', '{{t:awards_change_btn}} en cualquier categoría.'],
        'aw.win': ['Corona a un ganador', 'Haz clic en un nominado.'],
        'aw.view': ['Prueba otra vista', '{{t:awards_view_spotlight}}, {{t:awards_view_tiles}}, {{t:awards_view_collage}} o {{t:awards_view_reel}}.'],
        'aw.cer': ['Empieza la ceremonia', '{{t:awards_ceremony_btn}}.'],
        'aw.reveal': ['Abre un sobre', 'En la ceremonia.'],
        'aw.real': ['Abre {{t:awards_tab_reallife}}', 'La segunda pestaña.']
      },
      quiz: {
        q1: ['¿Cómo eliges un ganador?',
          ['Pulsa {{t:awards_ceremony_btn}}', 'Arrástralo arriba', 'Haz clic en el nominado en la papeleta'],
          'Un clic en un nominado lo corona; otro clic lo deshace.'],
        q2: ['¿Qué hace {{t:awards_generate}}?',
          ['Llena cada categoría con nominados de tus escuchas', 'Elige los ganadores por ti', 'Empieza la ceremonia'],
          'Elige nominados; los ganadores siempre los eliges tú.'],
        q3: ['¿Quién puede ver una ceremonia que compartes?',
          ['Solo tú', 'Cualquiera con el enlace, sin cuenta', 'Solo usuarios con sesión iniciada'],
          'Tú inicias sesión para crear el enlace; quien lo abra puede verla.']
      },
      tips: [
        'Prueba la vista {{t:awards_view_collage}} en {{t:awards_tab_mygrammys}}: cada categoría como un muro de portadas.',
        'En la ceremonia, {{t:awx_cer_meet}} reproduce unos segundos de cada nominado antes de abrir el sobre.',
        '{{t:awards_tab_reallife}} muestra cómo les fue a tus artistas en los Grammys, los VMAs, los BRIT y más.',
        'En el selector de nominados, «Los 8 primeros» llena la lista con los que mejor encajan en un clic.',
        'Marca con estrella tus categorías favoritas y activa solo esas para un año rápido.'
      ]
    },
    soundtrack: {
      title: '{{t:nav_soundtrack}}',
      promise: 'Un año, un mes o todo lo que has escuchado contado como una historia en doce capítulos, para recorrer, ver como un espectáculo y compartir.',
      scenes: {
        top: { title: 'Capítulo 1: el periodo', spots: {
          period: ['{{t:st_period_year}} / {{t:st_period_month}} / {{t:st_period_alltime}}', 'Qué historia contar.'],
          nav: ['Cuál', 'Pasa al año o mes anterior o siguiente, o haz clic en el nombre para elegir uno.'],
          story: ['{{t:st_story_play_all}}', 'Cada capítulo a pantalla completa, uno tras otro, como un espectáculo.'],
          replay: ['{{t:st_replay_title}}', 'Salta a la repetición de tus artistas top, semana a semana.'],
          share: ['{{t:st_share_btn}}', 'Crea una imagen de tu banda sonora.'],
          hero: ['El periodo', 'Su nombre, sobre un muro de las portadas que escuchaste.'],
          mosaic: ['Las portadas', 'Los álbumes del periodo.'],
          stats: ['Cinco cifras', '{{t:st_stat_plays}}, {{t:st_stat_days}}, {{t:st_stat_artists}}, {{t:st_stat_new_discoveries}} y {{t:st_stat_peak_day}}.'],
          stat: ['Elige una cifra', 'La tira de abajo cambia con ella: cada escucha, cada día, cada artista, tus descubrimientos o tu día de más escuchas.'],
          reel: ['La tira', 'Arrastra para recorrerla. Haz clic en una tarjeta para Spotify, una lista, el reproductor o una búsqueda.'],
          pl: ['{{t:pl_section_btn}}', 'Guarda lo que muestra la tira como lista.']
        } },
        artist: { title: '{{t:st_featured_label}}', spots: {
          name: ['Tu artista #1', 'El artista que más escuchaste.'],
          count: ['Cuánto', 'Sus escuchas y su parte del total.'],
          big: ['Una gran cifra', 'Tu racha más larga de canciones suyas seguidas.'],
          favs: ['Favoritos', 'Su álbum y su canción que más escuchaste, con tus rachas.'],
          stats: ['Más cifras', 'Día con más escuchas, racha de días, días, canciones y álbumes, hora punta.']
        } },
        tops: { title: '{{t:st_ch_top_name}}', spots: {
          head: ['Tu canción', 'La canción del periodo, y tu artista.'],
          songs: ['{{t:st_top_songs}}', 'Una fila de portadas que puedes pasar.'],
          center: ['La de delante', 'Su puesto y sus escuchas. Haz clic para abrir su ventana.'],
          prev: ['Atrás', 'La anterior.'],
          next: ['Siguiente', 'La siguiente. También puedes arrastrar o deslizar.'],
          count: ['Puesto y escuchas', 'De la que está delante.'],
          artists: ['{{t:st_top_artists}}', 'Lo mismo, para artistas.'],
          albums: ['{{t:st_top_albums}}', 'Y para álbumes.']
        } },
        no1: { title: '{{t:d100_no1_title}}', spots: {
          head: ['Cuántos', 'Números uno distintos en tu ranking semanal, y el que más tiempo estuvo arriba.'],
          seg: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De qué ranking son los #1.'],
          sum: ['En total', 'Cuántas veces cambió el #1.'],
          strip: ['La línea de tiempo', 'Cada reinado como un bloque; los más largos, más anchos.'],
          row: ['Un #1', 'Cuándo llegó y cuánto tiempo se quedó.'],
          more: ['Ver todos', 'La lista completa.']
        } },
        activity: { title: '{{t:st_activity_title}}', spots: {
          head: ['Tu mes más ruidoso', 'El mes con más escuchas.'],
          chart: ['Mes a mes', 'Las escuchas de cada mes y su cambio frente al anterior.'],
          bar: ['Un mes', 'Haz clic para ver sus escuchas y su artista top.']
        } },
        loyalty: { title: '{{t:st_loyalty_title}}', spots: {
          head: ['Quién volvió', 'Cuántos de tus 10 artistas del año pasado siguen en tu top.'],
          ring: ['La puntuación', 'Con un nombre: de {{t:st_loyalty_explorer}} a {{t:st_loyalty_die_hard}}.'],
          row: ['{{t:st_loyalty_artists_title}}', 'Los artistas que se quedaron, con sus canciones top.'],
          next: ['Más', 'Desliza la fila.']
        } },
        new: { title: '{{t:st_discoveries_title}}', spots: {
          head: ['Cuántos', 'Artistas que escuchaste por primera vez, y el que más escuchaste.'],
          bubbles: ['Las burbujas', 'Tus artistas nuevos flotan. Los más grandes los escuchaste más.'],
          bubble: ['Un artista', 'Haz clic para abrir su historia.']
        } },
        pop: { title: 'Un nuevo descubrimiento', spots: {
          nav: ['Anterior / siguiente', 'Recorre todos tus descubrimientos.'],
          name: ['El artista', 'Y cuándo lo encontraste.'],
          meta: ['Encontrado', 'El día que lo encontraste y su puesto en el periodo.'],
          play: ['{{t:st_am_play}}', 'Escúchalo.'],
          links: ['Spotify, YouTube, Last.fm', 'Búscalo en otro sitio.'],
          share: ['{{t:st_am_share}}', 'Una imagen de este descubrimiento.'],
          stats: ['Cifras', 'Escuchas, días, racha y álbumes.'],
          goal: ['{{t:st_am_goal_title}}', 'Cuánto le falta para tu siguiente puesto top.'],
          close: ['Cerrar', 'Esc hace lo mismo.']
        } },
        mil: { title: '{{t:st_ch_ms_name}}', spots: {
          head: ['El gran hito', 'El mayor total que pasaste, y con qué canción.'],
          overall: ['{{t:st_milestones_title}}', 'Cada cifra redonda de escuchas, y la canción que la marcó.'],
          artist: ['{{t:st_artist_milestones_title}}', 'Cifras redondas de cada artista.'],
          toggle: ['Más', 'Muestra los 25 siguientes.']
        } },
        streaks: { title: '{{t:st_streaks_title}}', spots: {
          head: ['Tu racha más larga', 'Tu racha más larga de días con música.'],
          cards: ['Tres tarjetas', 'Días con música, tu mejor racha y tu pausa más larga. Toca una para ver detalles.'],
          detail: ['Detalles', 'De la tarjeta que tocaste.'],
          cal: ['Cada día', 'Un calendario del periodo, coloreado por racha.'],
          chips: ['En resumen', 'Cuántas semanas tuvieron música.'],
          entity: ['Un artista, álbum, canción', 'Más días seguidos con el mismo.']
        } },
        grammys: { title: '{{t:st_aw_title}}', spots: {
          head: ['Ganadores', 'Tus artistas top que ganaron tus premios o premios reales.'],
          grid: ['Los ganadores', 'Una tarjeta por artista.'],
          card: ['Un artista', 'Sus premios. Haz clic para verlos.']
        } },
        end: { title: 'Los dos últimos capítulos', spots: {
          replay: ['{{t:st_replay_btn}}', 'Tus 5 artistas top en carrera, semana a semana.'],
          share: ['{{t:st_card_open}}', 'Crea una imagen de tu banda sonora.']
        } },
        replay: { title: '{{t:st_replay_title}}', spots: {
          canvas: ['La carrera', 'Los 5 artistas top de la semana y sus escuchas.'],
          speed: ['Velocidad', 'Más lenta o más rápida.'],
          prev: ['Semana anterior', 'Un paso atrás.'],
          pause: ['Play / pausa', 'Para o sigue.'],
          next: ['Semana siguiente', 'Un paso adelante.'],
          stop: ['{{t:st_replay_stop}}', 'Termina la repetición.']
        } },
        story: { title: '{{t:st_story_play_all}}', spots: {
          bars: ['Progreso', 'Una línea por capítulo.'],
          close: ['Cerrar', 'Vuelve a la página. También con Esc.'],
          prev: ['Anterior', '← hace lo mismo.'],
          next: ['Siguiente', '→ o un toque a la derecha hacen lo mismo.']
        } },
        card: { title: '{{t:st_card_title}}', spots: {
          preview: ['Vista previa', 'Cómo quedará la imagen.'],
          tpl: ['Diseño', 'Recap, Wrapped, Collage, Minimal o Poster.'],
          pal: ['Paleta', 'Los colores de la app, seis paletas fijas o la portada.'],
          fmt: ['{{t:ig_format}}', '{{t:sh_fmt_post}}, {{t:sh_fmt_portrait}} o {{t:sh_fmt_story}}.'],
          art: ['Mostrar / ocultar', 'Portadas, cifras, día punta, artistas top, canciones top, pie.'],
          src: ['Origen de las imágenes', 'De dónde salen las portadas.'],
          topn: ['Entradas', 'Cuántos artistas y canciones top.'],
          copy: ['Copiar', 'Copia la imagen para pegarla donde quieras.'],
          dl: ['Descargar', 'Guarda la imagen.']
        } }
      },
      howto: {
        period: { title: 'Elegir un año, un mes o todo', slides: [
          'Elige {{t:st_period_year}}, {{t:st_period_month}} o {{t:st_period_alltime}}.',
          '{{t:st_period_month}}: la historia de un mes.',
          '{{t:st_period_alltime}}: toda tu historia.',
          'Pasa a otro año o mes.'
        ] },
        story: { title: '{{t:st_story_play_all}}', slides: [
          'Pulsa el botón de reproducir de arriba.',
          'Cada capítulo, uno a uno.',
          'Siguiente, o toca el lado derecho de la pantalla.',
          'Ciérralo cuando quieras.'
        ] },
        read: { title: 'Leer el primer capítulo', slides: [
          'El periodo, sobre sus portadas.',
          'Elige una de las cinco cifras.',
          'La tira muestra lo que cuenta esa cifra.',
          'Guarda la tira como lista.',
          'Después, tu artista #1.'
        ] },
        tops: { title: 'Tus tops y tus números uno', slides: [
          'Tus canciones top, en primer plano.',
          'Pásalas.',
          'Números uno: canciones, artistas o álbumes.',
          'Cada #1 y cuánto tiempo estuvo.',
          'Mes a mes: haz clic en un mes.'
        ] },
        discover: { title: 'Conocer a tus artistas nuevos', slides: [
          'Tus artistas nuevos flotan.',
          'Haz clic en uno.',
          'Su historia: cuándo lo encontraste y cuánto lo escuchas.',
          'Lo cerca que está de tu top.',
          'Recorre los demás.'
        ] },
        replay: { title: 'Repetir tu año', slides: [
          'Pulsa {{t:st_replay_title}} arriba…',
          '…o {{t:st_replay_btn}} cerca del final.',
          'Tus 5 top, semana a semana.',
          'Pausa, o avanza semana a semana.',
          'Cambia la velocidad.'
        ] },
        share: { title: 'Compartir tu banda sonora', slides: [
          'Pulsa {{t:st_share_btn}} (o {{t:st_card_open}} al final).',
          'Elige un diseño.',
          'Y una paleta.',
          'Y un formato.',
          'Descárgala o cópiala.'
        ] }
      },
      options: {
        period: { title: 'Periodo', items: {
          year: ['{{t:st_period_year}} / {{t:st_period_month}} / {{t:st_period_alltime}}', 'Qué historia.'],
          nav: ['Anterior / siguiente', 'Otro año o mes.']
        } },
        chapters: { title: 'Los capítulos', items: {
          year: ['1. {{t:nav_soundtrack}}', 'El periodo, cinco cifras y la tira.'],
          artist: ['2. {{t:st_featured_label}}', 'Tu artista #1.'],
          tops: ['3. {{t:st_ch_top_name}}', 'Tus canciones, artistas y álbumes top.'],
          no1: ['4. {{t:d100_no1_title}}', 'Cada #1 (solo año y mes).'],
          activity: ['5. {{t:st_activity_title}}', 'Mes a mes (o día a día).'],
          loyalty: ['6. {{t:st_loyalty_title}}', 'Quién volvió.'],
          new: ['7. {{t:st_discoveries_title}}', 'Artistas nuevos.'],
          mil: ['8. {{t:st_ch_ms_name}}', 'Cifras redondas superadas.'],
          streaks: ['9. {{t:st_streaks_title}}', 'Días seguidos.'],
          awards: ['10. {{t:st_aw_title}}', 'Tus ganadores.'],
          replay: ['11. {{t:st_replay_title}}', 'El año como una carrera (solo año).'],
          share: ['12. {{t:st_card_title}}', 'Una imagen para compartir.']
        } },
        tools: { title: 'Por el camino', items: {
          stat: ['Las cinco cifras', 'Cada una cambia la tira.'],
          pl: ['{{t:pl_section_btn}}', 'La tira como lista.'],
          no1: ['{{t:d100_no1_title}}', 'Canciones, artistas o álbumes.'],
          more: ['Ver más', 'Listas de hitos más largas.'],
          speed: ['Velocidad de repetición', 'Más lenta o más rápida.']
        } },
        card: { title: '{{t:st_card_title}}', items: {
          tpl: ['Diseño', 'Cinco diseños.'],
          pal: ['Paleta', 'Ocho combinaciones de colores.'],
          fmt: ['Formato', '1:1, 4:5 o 9:16.'],
          art: ['Portadas', 'Sí o no, y su origen.'],
          topn: ['Entradas', 'Cuántas en la lista.'],
          copy: ['Copiar / Descargar', 'Llévate la imagen.']
        } }
      },
      challenges: {
        'st.period': ['Cambia a {{t:st_period_month}} o {{t:st_period_alltime}}', 'Arriba a la izquierda.'],
        'st.nav': ['Ve a otro año o mes', 'Las flechas junto a su nombre.'],
        'st.story': ['Reproduce tu historia', 'El botón de reproducir de arriba.'],
        'st.stat': ['Elige otra de las cinco cifras', 'En el capítulo 1.'],
        'st.no1': ['Mira los #1 de artistas o álbumes', 'En {{t:d100_no1_title}}.'],
        'st.bubble': ['Abre un nuevo descubrimiento', 'Haz clic en una burbuja de {{t:st_discoveries_title}}.'],
        'st.replay': ['Reproduce el historial', '{{t:st_replay_title}}.'],
        'st.card': ['Abre la ventana de compartir', '{{t:st_share_btn}}.']
      },
      quiz: {
        q1: ['¿Qué cambia al hacer clic en una de las cinco cifras?',
          ['El periodo', 'La tira de debajo', 'Tu tema'],
          'Cada cifra llena la tira con lo que cuenta: cada escucha, cada día, cada artista, etc.'],
        q2: ['¿Cómo ves todos los capítulos como un espectáculo?',
          ['Bajando rápido', 'Abriendo {{t:st_card_title}}', 'Con el botón de reproducir de arriba'],
          '{{t:st_story_play_all}} muestra los capítulos a pantalla completa, uno tras otro.'],
        q3: ['¿Dónde ves cómo es un artista que acabas de encontrar?',
          ['Haciendo clic en su burbuja en {{t:st_discoveries_title}}', 'En {{t:st_streaks_title}}', 'En la tira'],
          'Cada burbuja abre la historia de ese artista: cómo lo encontraste, sus escuchas y tu siguiente objetivo.']
      },
      tips: [
        '{{t:st_story_play_all}} convierte tu año en un espectáculo a pantalla completa, capítulo a capítulo.',
        'En {{t:st_discoveries_title}}, haz clic en una burbuja para ver cómo encontraste a ese artista: la canción, el día y lo que escuchabas justo antes.',
        'Haz clic en {{t:st_stat_peak_day}} en el capítulo 1 y la tira muestra cada canción de tu día con más escuchas.',
        '{{t:st_replay_title}} pone a correr a tus 5 artistas top durante el año, semana a semana.',
        'La imagen para compartir tiene cinco diseños. Prueba Wrapped como historia 9:16.'
      ]
    },
    dank100: {
      title: '{{t:d100_title}}',
      promise: 'Un ranking semanal compartido hecho con los rankings de todos: léelo, sigue la trayectoria de una canción y envía tu propia semana.',
      scenes: {
        top: { title: 'El ranking', spots: {
          title: ['{{t:d100_title}}', 'Los rankings semanales de todos, sumados en un solo ranking de 100.'],
          signin: ['Iniciar sesión', 'Solo hace falta para enviar tu semana. Cualquiera puede ver el ranking.'],
          week: ['Qué semana', 'Elige de la lista cualquier ranking hasta ahora.'],
          prev: ['{{t:d100_prev_week}}', 'Un ranking atrás.'],
          next: ['{{t:d100_next_week}}', 'Un ranking adelante.'],
          from: ['Oyentes', 'De cuántas personas salen las semanas de este ranking.'],
          seg: ['{{t:d100_type_songs}} / {{t:d100_type_artists}} / {{t:d100_type_albums}}', 'Tres rankings cada semana.'],
          export: ['{{t:d100_export}}', 'El ranking como playlist para copiar a tu app de música.'],
          share: ['{{t:d100_share}}', 'Guarda una imagen del top 10 (en el móvil, la comparte).'],
          cols: ['Las columnas', '{{t:d100_col_pts}}, {{t:d100_col_l}}, {{t:d100_col_lw}}, {{t:d100_col_pk}} y {{t:d100_col_wk}}.'],
          row: ['Una fila', 'Haz clic para abrir su trayectoria en el ranking.'],
          pos: ['Puesto', 'Su posición esta semana.'],
          move: ['Movimiento', 'Sube o baja desde la semana pasada, o una etiqueta si es nueva o vuelve.'],
          pts: ['{{t:d100_col_pts}}', 'Los puntos de todos sumados: 100 por el #1 de un oyente, hasta 1 por su #100.'],
          l: ['{{t:d100_col_l}}', 'Cuántas personas la tenían en su ranking.'],
          lw: ['{{t:d100_col_lw}}', 'Su puesto la semana pasada (– si no estaba).'],
          pk: ['{{t:d100_col_pk}}', 'Su mejor puesto.'],
          wk: ['{{t:d100_col_wk}}', 'Semanas en el ranking en total.'],
          acts: ['Escuchar', 'Una muestra, Spotify o YouTube.']
        } },
        run: { title: 'Una trayectoria en el ranking', spots: {
          row: ['La fila abierta', 'Haz clic otra vez para cerrarla.'],
          plot: ['La línea', 'Su puesto semana a semana, con el #1 arriba. Un hueco es una semana fuera del ranking.'],
          story: ['En una línea', 'Dónde empezó, su mejor puesto y cuánto lleva.'],
          ribbon: ['Totales', 'Su pico, semanas en el #1 y semanas en el top 3, 5, 10 o 40.'],
          chip: ['Un total', 'Tócalo para iluminar solo esas semanas abajo.'],
          boxes: ['Cada semana', 'Una casilla por semana en el ranking, con su puesto.'],
          box: ['Una semana', 'Haz clic para ver el ranking de esa semana.']
        } },
        week: { title: 'El ranking de una semana', spots: {
          head: ['La semana', 'Qué semana y qué ranking.'],
          item: ['Su top 30', 'La que tenías abierta aparece iluminada.'],
          link: ['La semana entera', 'Abre el ranking completo de esa semana en la página.'],
          close: ['Cerrar', 'Vuelve a la trayectoria.']
        } },
        no1: { title: '{{t:d100_no1_title}}', spots: {
          head: ['{{t:d100_no1_title}}', 'Cada #1 del ranking que elegiste arriba.'],
          sum: ['En total', 'Cuántos reinados y cuántos #1 distintos.'],
          strip: ['La línea de tiempo', 'Cada reinado es un bloque: cuanto más duró, más ancho.'],
          row: ['Un #1', 'La semana en que llegó y cuánto duró. Haz clic para ver esa semana.'],
          back: ['{{t:d100_no1_back}}', 'Ya había sido #1 antes.'],
          more: ['Ver todos', 'La lista completa.']
        } },
        recs: { title: '{{t:d100_rec_title}}', spots: {
          grid: ['Los récords', 'Quince récords de todos los rankings hasta ahora.'],
          rec: ['Un récord', '{{t:d100_rec_at1}}, {{t:d100_rec_debut}}, {{t:d100_rec_jump}} y más.'],
          k: ['Qué récord', 'Lo que cuenta.'],
          v: ['La cifra', 'La que hay que superar.'],
          who: ['Quién lo tiene', 'La canción, el artista o el álbum.']
        } },
        entry: { title: '{{t:d100_entry_title}}', spots: {
          soon: ['{{t:d100_soon_title}}', 'Qué semana se cuenta ahora y qué día sale.'],
          entries: ['Tus semanas', 'La semana pasada (mientras aún se puede enviar) y esta semana.'],
          last: ['{{t:d100_week_last}}', 'La semana que está a punto de contarse.'],
          note: ['Última oportunidad', 'El día en que se cierra.'],
          preview: ['{{t:d100_preview}}', 'Lo que enviarías: tu propio ranking de esa semana.'],
          send: ['{{t:d100_send}}', 'Añade tu semana. Púlsalo otra vez para actualizarla, o retírala.'],
          year: ['{{t:d100_year_title}}', 'Tus rankings de cada semana desde el 2 de enero, todos a la vez (hasta el 30 de noviembre).'],
          yearbtn: ['{{t:d100_year_btn}}', 'Los envía.'],
          auto: ['Automático', 'Actívalo en {{t:set_title}} y tu semana se envía sola cada domingo.'],
          how: ['{{t:d100_how_title}}', 'Puntos, semanas y privacidad en cuatro líneas.']
        } }
      },
      howto: {
        read: { title: 'Lee el ranking', slides: [
          'Su puesto esta semana.',
          'Sube o baja desde la semana pasada.',
          '{{t:d100_col_pts}}: 100 por el #1 de un oyente, 1 por su #100, todo sumado.',
          'Cuántos oyentes la tenían.',
          'Su mejor puesto, y luego sus semanas en el ranking.',
          'Haz clic en una fila para abrir su trayectoria.'
        ] },
        run: { title: 'Sigue una trayectoria', slides: [
          'Su puesto semana a semana.',
          'Toca un total para iluminar esas semanas.',
          'Haz clic en una semana…',
          '…para ver el ranking de esa semana.',
          'O abre la semana entera.'
        ] },
        weeks: { title: 'Viaja atrás en el tiempo', slides: [
          'Elige una semana de la lista…',
          '…o avanza de semana en semana.',
          'O haz clic en un #1 para ir a su semana.',
          'Cambia a {{t:d100_type_artists}} o {{t:d100_type_albums}}…',
          '…para ver los otros dos rankings.'
        ] },
        join: { title: 'Envía tu semana', slides: [
          'Inicia sesión con Google, con tu propia biblioteca conectada (la demo no puede enviar).',
          'La semana pasada muestra tu ranking.',
          'Pulsa {{t:d100_send}}.',
          '¿Eres nuevo? Envía todo tu año de una vez.',
          'O deja que se envíe solo cada domingo.',
          'El ranking sale el lunes.'
        ] },
        share: { title: 'Llévatelo', slides: [
          '{{t:d100_export}}: el ranking como playlist.',
          '{{t:d100_share}}: una imagen del top 10.',
          'Los dos funcionan también con los otros dos rankings.'
        ] }
      },
      options: {
        chart: { title: 'El ranking', items: {
          type: ['{{t:d100_type_songs}} / {{t:d100_type_artists}} / {{t:d100_type_albums}}', 'Qué ranking.'],
          week: ['Semana', 'El ranking más reciente, o cualquiera anterior.'],
          cols: ['Columnas', '{{t:d100_col_pts}}, {{t:d100_col_l}}, {{t:d100_col_lw}}, {{t:d100_col_pk}}, {{t:d100_col_wk}}.'],
          acts: ['Escuchar', 'Muestra, Spotify, YouTube.']
        } },
        tools: { title: 'Por el camino', items: {
          run: ['Una trayectoria', 'Haz clic en una fila; luego en una casilla para esa semana.'],
          more: ['Ver todo', 'Cada #1 y los 100 puestos.'],
          export: ['{{t:d100_export}}', 'Las canciones tal cual; dos canciones por artista o álbum.'],
          share: ['{{t:d100_share}}', 'Una imagen del top 10.']
        } },
        entry: { title: 'Tu envío', items: {
          send: ['{{t:d100_send}}', 'Hasta el domingo siguiente a la semana (UTC).'],
          back: ['{{t:d100_take_back}}', 'Quita tu envío mientras la semana esté abierta.'],
          year: ['{{t:d100_year_btn}}', 'Cada semana desde el 2 de enero, hasta el 30 de noviembre.'],
          auto: ['{{t:d100_auto}}', 'En {{t:set_title}}.']
        } }
      },
      challenges: {
        'd1.week': ['Mira otra semana', 'Las flechas o la lista encima del ranking.'],
        'd1.type': ['Cambia a {{t:d100_type_artists}} o {{t:d100_type_albums}}', 'Junto a la semana.'],
        'd1.run': ['Abre una trayectoria', 'Haz clic en cualquier fila.'],
        'd1.box': ['Abre una semana desde una trayectoria', 'Haz clic en una casilla bajo una fila abierta.'],
        'd1.no1': ['Abre un #1', 'En {{t:d100_no1_title}}, bajo el ranking.'],
        'd1.export': ['{{t:d100_export}}', 'Encima del ranking.'],
        'd1.share': ['{{t:d100_share}}', 'Encima del ranking.']
      },
      quiz: {
        q1: ['¿Cómo consigue sus puntos una canción?',
          ['Un punto por reproducción', 'Por su puesto en el ranking de cada oyente', 'Por cuántos oyentes tiene'],
          'El #1 de un oyente le da 100 puntos, su #2 le da 99… así cada oyente cuenta igual, escuche lo que escuche.'],
        q2: ['¿Cuándo sale el ranking de una semana?',
          ['El viernes', 'El lunes, después de que los envíos cierren el domingo', 'A final de mes'],
          'Las semanas van de viernes a jueves (UTC), los envíos siguen abiertos hasta el domingo y el ranking sale el lunes.'],
        q3: ['¿Qué pueden ver los demás de lo que enviaste?',
          ['Todo tu ranking', 'Tu top 10', 'Nada: solo el ranking combinado es público'],
          'Solo el ranking combinado es público. Nadie puede ver lo que enviaste.']
      },
      tips: [
        'Haz clic en cualquier casilla de la trayectoria de una canción para ver el ranking entero de esa semana.',
        'En {{t:d100_no1_title}} cada reinado es un bloque: los más anchos duraron más.',
        '{{t:d100_export}} convierte el ranking en una playlist, con dos canciones por artista o álbum.',
        '{{t:d100_title}} tiene tres rankings cada semana: canciones, artistas y álbumes.'
      ]
    },
    worldcharts: {
      title: '{{t:wc_title}}',
      promise: 'Las listas reales de Billboard, Spotify y YouTube, con tus propias reproducciones en cada fila: mira qué éxitos conoces, viaja al pasado y descubre los que te perdiste.',
      scenes: {
        top: { title: 'La página', spots: {
          title: ['{{t:wc_title}}', 'Listas reales del mundo, junto a lo que escuchas tú.'],
          menu: ['Las listas', 'Tres de Billboard, dos de Spotify y una de YouTube. Cada botón muestra de dónde viene.'],
          pick: ['La que estás viendo', 'Toma los colores de su fuente.'],
          week: ['Qué semana', 'Solo en las listas de Billboard: elige cualquier día y verás la lista de esa semana.'],
          prev: ['{{t:d100_prev_week}}', 'Una semana atrás.'],
          next: ['{{t:d100_next_week}}', 'Una semana adelante.'],
          yourweek: ['{{t:wc_your_week}}', 'Abre tu propio ranking semanal de esos mismos días.'],
          source: ['Fuente', 'De dónde viene la lista y su fecha. El enlace abre el original.'],
          share: ['{{t:d100_share}}', 'Una imagen del top 10, con tus reproducciones.'],
          sum: ['Cuántas conoces', 'Cuántas de la lista has escuchado.'],
          filter: ['{{t:wc_filter_all}} / {{t:wc_filter_known}} / {{t:wc_filter_new}}', 'Muestra todas las filas, solo las que conoces o solo las nuevas.'],
          range: ['{{t:wc_range_all}} / {{t:wc_range_week}}', 'Qué reproducciones cuentan: todas o solo las de los últimos 7 días.'],
          cols: ['Las columnas', 'Los números de cada fuente: semana pasada, pico y semanas en Billboard, reproducciones en Spotify, vistas en YouTube.'],
          row: ['Una fila', 'Pulsa una canción que conoces para abrir su ventana.'],
          pos: ['Puesto', 'Su posición en la lista.'],
          move: ['Movimiento', 'Sube o baja desde la lista anterior, o una marca de entrada nueva o regreso.'],
          tag: ['Tus reproducciones', 'Cuántas veces la escuchaste, o {{t:wc_new_to_you}}.'],
          acts: ['Escuchar', 'Una muestra, Spotify o YouTube.']
        } },
        past: { title: 'Una semana del pasado', spots: {
          week: ['La semana', 'Todos los Hot 100 desde 1958, todos los Billboard 200 desde 1963 y el Global 200 desde 2020.'],
          prev: ['{{t:d100_prev_week}}', 'Una semana atrás.'],
          next: ['{{t:d100_next_week}}', 'Una semana adelante.'],
          latest: ['{{t:wc_latest}}', 'Vuelve a la lista más reciente.'],
          yourweek: ['{{t:wc_your_week}}', 'Tu ranking semanal de los días que contó Billboard.'],
          source: ['La fecha', 'La fecha de la propia lista.'],
          sum: ['Esa semana', 'Cuántas escuchaste en los días que contó esa lista.'],
          range: ['{{t:wc_range_that_week}}', 'En una semana pasada, el segundo botón cuenta solo los días que contó Billboard.'],
          row: ['Una fila', 'Tal como estaba esa semana.']
        } },
        known: { title: 'Solo las que conoces', spots: {
          sum: ['Cuántas', 'La misma cuenta de arriba.'],
          filter: ['El filtro', 'Elige {{t:wc_filter_known}} o {{t:wc_filter_new}}.'],
          on: ['{{t:wc_filter_known}}', 'Solo las filas que escuchaste.'],
          row: ['Una canción que conoces', 'Púlsala para abrir su ventana, como desde {{t:nav_alltime}}.'],
          tag: ['Tus reproducciones', 'Contadas con el rango que elegiste.']
        } },
        spotify: { title: 'Spotify', spots: {
          pick: ['{{t:wc_chart_spotify_global_daily}}', 'Las canciones más escuchadas del mundo, día a día. También hay una semanal.'],
          source: ['Fuente', 'kworb.net, que recopila los números de Spotify.'],
          cols: ['Las columnas', 'Reproducciones y cuántos días lleva en la lista.'],
          row: ['Una fila', 'Hasta 200 al día.'],
          spotify: ['Spotify', 'Abre esa misma canción en Spotify.'],
          sample: ['Muestra', 'Un fragmento corto, aquí mismo.'],
          newtag: ['{{t:wc_new_to_you}}', 'Todavía no la escuchaste.']
        } },
        youtube: { title: 'YouTube', spots: {
          pick: ['{{t:wc_chart_youtube_trending}}', 'Los videos musicales que son tendencia en el mundo ahora mismo.'],
          cols: ['Las columnas', 'En cuántos países es tendencia y su mejor puesto en uno de ellos.'],
          art: ['El video', 'Su miniatura.'],
          row: ['Un video', 'Lo que el mundo está viendo ahora mismo.'],
          yt: ['YouTube', 'Abre el video.']
        } }
      },
      howto: {
        mine: { title: 'Mira qué éxitos conoces', slides: [
          'Esta línea cuenta las que escuchaste.',
          'Cada fila dice cuántas veces, o {{t:wc_new_to_you}}.',
          'Elige {{t:wc_filter_known}} o {{t:wc_filter_new}}…',
          '…y pulsa una que conoces para abrirla.',
          'O cuenta solo los últimos 7 días.'
        ] },
        past: { title: 'Viaja al pasado', slides: [
          'En una lista de Billboard, elige cualquier día…',
          '…o avanza semana a semana.',
          '{{t:wc_range_that_week}} cuenta solo los días que contó Billboard.',
          '{{t:wc_your_week}} abre tu propio ranking de esos días.',
          '{{t:wc_latest}} te trae de vuelta.'
        ] },
        listen: { title: 'Escucha una', slides: [
          'Pon una muestra corta.',
          'Abre la canción en Spotify.',
          'O mírala en YouTube.',
          'Una canción que conoces abre su ventana.'
        ] },
        share: { title: 'Comparte una lista', slides: [
          'Elige una lista.',
          'Elige qué reproducciones cuentan.',
          '{{t:d100_share}}: una imagen del top 10 con tus reproducciones.'
        ] }
      },
      options: {
        chart: { title: 'La lista', items: {
          chart: ['Lista', 'La última que miraste.'],
          week: ['Semana', 'La más reciente, o cualquier semana anterior de Billboard.'],
          filter: ['{{t:wc_filter_all}} / {{t:wc_filter_known}} / {{t:wc_filter_new}}', 'Qué filas se ven.'],
          range: ['{{t:wc_range_all}} / {{t:wc_range_week}}', 'Qué reproducciones cuentan. Se recuerda.']
        } },
        tools: { title: 'Por el camino', items: {
          acts: ['Escuchar', 'Muestra, Spotify, YouTube.'],
          open: ['Una canción que conoces', 'Abre su ventana.'],
          myweek: ['{{t:wc_your_week}}', 'Tu ranking semanal de esos mismos días.'],
          share: ['{{t:d100_share}}', 'Una imagen del top 10.']
        } }
      },
      challenges: {
        'wc.chart': ['Cambia a otra lista', 'Los botones de arriba.'],
        'wc.week': ['Mira otra semana', 'Las flechas o la fecha en una lista de Billboard.'],
        'wc.filter': ['Muestra solo {{t:wc_filter_known}} o {{t:wc_filter_new}}', 'Encima de la lista.'],
        'wc.range': ['Cambia a {{t:wc_range_week}}', 'Junto al filtro.'],
        'wc.open': ['Abre una canción que conoces', 'Pulsa una fila con reproducciones.'],
        'wc.listen': ['Pon una muestra, o abre Spotify o YouTube', 'Los botones al final de una fila.'],
        'wc.myweek': ['Abre {{t:wc_your_week}}', 'Junto a la semana, en una lista de Billboard.'],
        'wc.share': ['{{t:d100_share}}', 'Junto a la fuente.']
      },
      quiz: {
        q1: ['Una fila dice {{t:wc_new_to_you}}. ¿Qué significa?',
          ['Es nueva en la lista esta semana', 'No la has escuchado', 'No la escuchaste en los últimos 7 días, sea cual sea el rango'],
          'Significa que no tienes reproducciones de ella, contadas con el rango que elegiste ({{t:wc_range_all}} o {{t:wc_range_week}}). Una entrada nueva en la lista tiene su propia marca.'],
        q2: ['¿En qué listas puedes viajar al pasado?',
          ['En todas', 'Solo en Spotify', 'Solo en las de Billboard'],
          'Billboard guarda todas sus semanas (el Hot 100 desde 1958). Spotify y YouTube muestran solo la más reciente.'],
        q3: ['En una semana pasada, ¿qué cuenta {{t:wc_range_that_week}}?',
          ['Tus reproducciones de los días que Billboard contó para esa lista', 'Tus reproducciones de los últimos 7 días', 'Todas tus reproducciones'],
          'Billboard cuenta una semana de reproducciones que termina más o menos una semana antes de la fecha de la lista. {{t:wc_range_that_week}} cuenta las tuyas en esos mismos días.']
      },
      tips: [
        'En una semana pasada de Billboard, {{t:wc_your_week}} abre tu propio ranking de esos días.',
        'Elige {{t:wc_filter_new}} para encontrar los éxitos del mundo que aún no escuchaste.',
        'En una semana pasada, {{t:wc_range_that_week}} muestra qué éxitos escuchabas entonces.',
        '{{t:d100_share}} pone tus reproducciones en la imagen.'
      ]
    },
    ratings: {
      title: '{{t:nav_ratings}}',
      promise: 'Puntúa álbumes y canciones como un crítico, y mira tus veredictos, tus mejores y peores notas y lo que aún te falta puntuar.',
      scenes: {
        page: { title: 'Tu página de crítico', spots: {
          intro: ['{{t:nav_ratings}}', 'Todo lo que has puntuado, en un solo sitio.'],
          ring: ['Tu media', 'Tu álbum medio (o canción, hasta que puntúes un álbum).'],
          verdict: ['El veredicto', 'Una palabra para la nota, de {{t:rtb_poor}} a {{t:rtb_masterpiece}}.'],
          meters: ['Cuánto', 'Álbumes, singles y EPs y canciones puntuados, de todo lo que escuchaste.'],
          acts: ['Tu costumbre', 'Los días en que puntuaste, tu racha más larga de días y la última vez.'],
          next: ['{{t:ar_next}}', 'Tu álbum más escuchado sin nota.'],
          cta: ['{{t:rtg_rate_cta}}', 'Abre la ventana para puntuar.'],
          hi: ['Lo mejor y lo peor', 'Tu álbum, single y canción con la nota más alta y más baja. Los empates pasan por turnos.'],
          dots: ['Más con esa nota', 'Toca un punto para ver los demás.'],
          recs: ['{{t:rp_recs}}', 'Lo que tus notas dicen de lo que escuchas.'],
          rec: ['Un récord', '{{t:rp_rec_overplayed}}, {{t:rp_rec_underplayed}}, {{t:rp_rec_consistent}}, {{t:rp_rec_best_artist}}.'],
          top: ['{{t:rp_top_artists}}', 'Por su álbum medio. Haz clic en uno para ver todas sus notas.'],
          recent: ['{{t:rp_recent}}', 'Lo último que puntuaste. Haz clic para cambiarlo.']
        } },
        list: { title: 'Todo lo que puntuaste', spots: {
          tabs: ['Las listas', '{{t:ig_type_albums}}, {{t:ar_singles}}, {{t:ig_type_songs}} o {{t:ar_todo}}.'],
          spread: ['{{t:ar_spread}}', 'Cuántos hay en cada veredicto.'],
          bar: ['Un veredicto', '{{t:ar_spread_hint}}.'],
          search: ['{{t:ar_search}}', 'Busca uno por su nombre.'],
          sort: ['Orden', '{{t:ar_sort_high}}, {{t:ar_sort_low}}, {{t:ar_sort_tracks}} o {{t:am_sort_az}}.'],
          row: ['Una nota', 'Haz clic para cambiarla.'],
          score: ['La nota', 'Sobre 10.'],
          prog: ['Pistas puntuadas', 'Cuántas de sus pistas tienen nota.'],
          band: ['El veredicto', 'La palabra para la nota.'],
          go: ['Abrir', 'Abre la ventana del álbum.']
        } },
        todo: { title: '{{t:ar_todo}}', spots: {
          tabs: ['{{t:ar_todo}}', 'Lo que escuchas y nunca has puntuado.'],
          row: ['Lo más escuchado primero', 'Lo que mejor conoces.'],
          cta: ['{{t:rtg_rate_cta}}', 'Puntúalo ya.']
        } },
        album: { title: 'Puntuar un álbum', spots: {
          kind: ['{{t:rte_kind_album}}', 'Lo que estás puntuando.'],
          title: ['El álbum', 'Y su artista.'],
          ring: ['La nota', 'Cambia al mover cualquier control.'],
          formula: ['Cómo se suma', 'La media de las pistas × 75% más los aspectos del álbum × 25%.'],
          tabs: ['{{t:rte_aspects}} / {{t:rte_tracks}}', 'Las dos mitades de la nota.'],
          row: ['Un aspecto', '{{t:rtc_coh}}, {{t:rtc_con}}, {{t:rtc_art}}, {{t:rtc_inn}}, {{t:rtc_imp}} y {{t:rtc_lon}}.'],
          slider: ['Control', 'Arrastra de 0 a 10, de 0,1 en 0,1.'],
          num: ['O escríbela', 'Escribe el número.'],
          weight: ['Pistas frente a aspectos', 'Cuánto cuentan las pistas. Vale para todos los álbumes.'],
          note: ['{{t:rte_note}}', 'Unas palabras, si quieres.'],
          clear: ['{{t:rte_clear_album}}', 'Quita las notas de los aspectos (las de las pistas se quedan).'],
          done: ['{{t:rte_done}}', 'Los cambios se guardan sobre la marcha.'],
          close: ['Cerrar', 'Igual que {{t:rte_done}}.']
        } },
        tracks: { title: '{{t:rte_tracks}}', spots: {
          tab: ['{{t:rte_tracks}}', 'Cada pista del álbum que escuchaste, con sus reproducciones.'],
          formula: ['La nota', 'Se mueve con cada pista.'],
          row: ['Una pista', 'Puntúala aquí mismo: un número.'],
          slider: ['Control', 'De 0 a 10.'],
          num: ['O escríbela', 'Un número.'],
          rubric: ['Rúbrica completa', 'Abre la ventana de la canción para puntuarla.'],
          full: ['Con la rúbrica completa', 'Una pista puntuada en detalle. Ábrela para cambiarla.']
        } },
        song: { title: 'Puntuar una canción', spots: {
          back: ['{{t:rte_back_album}}', 'Cuando vienes de un álbum.'],
          ring: ['La nota', 'La media de los criterios.'],
          mode: ['{{t:rte_detailed}} / {{t:rte_quick}}', 'Seis criterios, o una nota a ojo.'],
          row: ['Un criterio', '{{t:rtc_comp}}, {{t:rtc_lyr}}, {{t:rtc_voc}}, {{t:rtc_prod}}, {{t:rtc_mel}} y {{t:rtc_rhy}}.'],
          na: ['{{t:rte_na}}', '{{t:rtc_lyr}} y {{t:rtc_voc}} pueden quedar fuera, para un instrumental.'],
          note: ['{{t:rte_note}}', 'Opcional.'],
          clear: ['{{t:rte_clear_song}}', 'Quita la nota de la canción.']
        } },
        quick: { title: '{{t:rte_quick}}', spots: {
          mode: ['{{t:rte_quick}}', '{{t:rte_hint_quick}}'],
          quick: ['Una nota', 'Arrástrala o escríbela.'],
          ring: ['La nota', 'La misma allí donde aparezca la canción.']
        } },
        albwin: { title: 'En la ventana del álbum', spots: {
          rate: ['{{t:dp_rate}}', 'Abre la ventana para puntuar. Las canciones también lo tienen.'],
          tab: ['{{t:dp_tab_rating}}', 'La evaluación del álbum: la nota, sus partes, sus mejores y peores pistas.'],
          ring: ['La nota', 'Con su veredicto.']
        } },
        artwin: { title: 'En la ventana del artista', spots: {
          tab: ['{{t:dp_tab_rating}}', 'Todas las notas que le diste a este artista, como en la página {{t:nav_ratings}}.'],
          ring: ['Su media', 'De sus álbumes puntuados.']
        } }
      },
      howto: {
        rate: { title: 'Puntúa un álbum', slides: [
          'Empieza por {{t:ar_next}}, o por cualquier álbum.',
          'Puntúa sus aspectos.',
          'Luego sus pistas: un número cada una.',
          'Elige cuánto cuentan las pistas.',
          'La nota se suma sobre la marcha.',
          'Listo. Todo está ya guardado.'
        ] },
        song: { title: 'Puntúa una canción en detalle', slides: [
          'Abre la rúbrica completa de una pista…',
          '…y elige {{t:rte_detailed}} o {{t:rte_quick}}.',
          'Puntúa cada criterio.',
          'Deja fuera {{t:rtc_lyr}} o {{t:rtc_voc}} cuando no aplican.',
          '{{t:rte_quick}}: un número y listo.'
        ] },
        browse: { title: 'Recorre tus notas', slides: [
          'Elige una lista.',
          'Toca un veredicto para ver solo esos.',
          'Cambia el orden.',
          'Haz clic en una fila para cambiar su nota.',
          '{{t:ar_todo}}: lo que aún te falta puntuar.'
        ] },
        where: { title: 'Las notas por la app', slides: [
          'Cada ventana de álbum y de canción tiene un botón {{t:dp_rate}}.',
          'Su pestaña {{t:dp_tab_rating}} muestra la evaluación.',
          'Haz clic en un artista aquí…',
          '…para ver todas sus notas en su pestaña {{t:dp_tab_rating}}.'
        ] }
      },
      options: {
        album: { title: 'Nota de un álbum', items: {
          aspects: ['{{t:rte_aspects}}', 'Seis notas del álbum entero.'],
          tracks: ['{{t:rte_tracks}}', 'Una nota por pista.'],
          weight: ['Pistas frente a aspectos', 'Cuánto cuentan las pistas, en todos los álbumes.'],
          note: ['{{t:rte_note}}', 'Tus palabras.']
        } },
        song: { title: 'Nota de una canción', items: {
          mode: ['{{t:rte_detailed}} / {{t:rte_quick}}', 'Seis criterios o un número.'],
          na: ['{{t:rte_na}}', 'Deja {{t:rtc_lyr}} o {{t:rtc_voc}} fuera de la media.'],
          quick: ['{{t:rte_quick}}', 'Una nota a ojo.']
        } },
        page: { title: 'La página', items: {
          lists: ['Listas', '{{t:ig_type_albums}}, {{t:ar_singles}}, {{t:ig_type_songs}}, {{t:ar_todo}}.'],
          sort: ['Orden', '{{t:ar_sort_high}}, {{t:ar_sort_low}}, {{t:ar_sort_tracks}}, {{t:am_sort_az}}.'],
          band: ['{{t:ar_spread}}', 'Toca un veredicto para filtrar.'],
          search: ['{{t:ar_search}}', 'Por nombre.']
        } }
      },
      challenges: {
        'rt.rate': ['Abre la ventana para puntuar', '{{t:rtg_rate_cta}} en cualquier álbum.'],
        'rt.tracks': ['Abre la pestaña {{t:rte_tracks}}', 'En la ventana para puntuar un álbum.'],
        'rt.mode': ['Cambia una canción entre {{t:rte_detailed}} y {{t:rte_quick}}', 'En la ventana para puntuar una canción.'],
        'rt.view': ['Abre otra lista', '{{t:ar_singles}}, {{t:ig_type_songs}} o {{t:ar_todo}}.'],
        'rt.band': ['Muestra solo un veredicto', 'Toca una barra en {{t:ar_spread}}.'],
        'rt.sort': ['Cambia el orden', 'Junto a {{t:ar_search}}.'],
        'rt.artist': ['Abre un artista mejor valorado', 'En {{t:rp_top_artists}}.']
      },
      quiz: {
        q1: ['¿Cómo se forma la nota de un álbum?',
          ['Solo con sus pistas', 'Con sus pistas y sus aspectos de álbum juntos (75% y 25% si no lo cambias)', 'Con cuánto lo escuchas'],
          'Se mezclan la media de las pistas y los aspectos del álbum. Si solo una mitad tiene nota, esa mitad es la nota.'],
        q2: ['Una canción no tiene letra. ¿Qué haces?',
          ['Darle un 0 a {{t:rtc_lyr}}', 'Marcar {{t:rtc_lyr}} como {{t:rte_na}}', 'Saltarte la canción'],
          '{{t:rte_na}} lo deja fuera de la media, así un instrumental no sale perjudicado.'],
        q3: ['¿Dónde encuentras lo que escuchas mucho pero nunca puntuaste?',
          ['{{t:ar_todo}}', '{{t:rp_recent}}', '{{t:rp_top_artists}}'],
          '{{t:ar_todo}} muestra lo que más escuchas sin nota, lo más escuchado primero.']
      },
      tips: [
        'Puntúa un álbum entero de una vez en su pestaña {{t:rte_tracks}}: un número por pista.',
        '¿Un instrumental? Marca {{t:rtc_lyr}} y {{t:rtc_voc}} como {{t:rte_na}} para que no cuenten.',
        '{{t:rp_rec_underplayed}}: el álbum al que le pones buena nota pero casi nunca escuchas.',
        'Toca un veredicto en {{t:ar_spread}} para ver solo esos álbumes.'
      ]
    },
    events: {
      title: '{{t:sec_events_title}}',
      promise: 'Cumpleaños, aniversarios de álbumes, lanzamientos y conciertos de los artistas que escuchas, y lo que escuchabas este mismo día hace años.',
      scenes: {
        today: { title: '{{t:ev_tab_today}}', spots: {
          title: ['{{t:sec_events_title}}', 'De tus 50 artistas top (cambia cuántos en {{t:set_title}}).'],
          info: ['{{t:ev_info_title}}', 'Cuánto se encontró y cuándo.'],
          refresh: ['{{t:ev_refresh_title}}', 'Vuelve a buscarlo todo.'],
          tabs: ['Cuatro pestañas', '{{t:ev_tab_today}}, {{t:ev_tab_coming}}, {{t:ev_tab_recent}} y {{t:ev_tab_calendar}}.'],
          types: ['Tipos', 'Toca uno para ocultarlo o mostrarlo otra vez.'],
          bday: ['{{t:ev_type_birthdays}}', 'Los cumpleaños de los artistas.'],
          shows: ['{{t:ev_type_shows}}', 'Conciertos (de Ticketmaster).'],
          play: ['{{t:ev_play_all}}', 'Pone lo que muestra la pestaña en el reproductor.'],
          pl: ['{{t:pl_section_btn}}', 'Guarda lo que muestra la pestaña en una playlist.'],
          day: ['Hoy', 'Los cumpleaños, lanzamientos y conciertos de hoy.'],
          card: ['Un evento', 'Haz clic para Spotify, una playlist, el reproductor o una búsqueda.'],
          anniv: ['{{t:ev_today_anniversaries}}', 'Lanzamientos que cumplen años hoy, los que más escuchaste primero.'],
          tm: ['{{t:time_machine_title}}', 'Lo que escuchabas este día en años anteriores.'],
          tmtypes: ['{{t:time_machine_songs}} / {{t:time_machine_artists}} / {{t:time_machine_albums}}', 'Activa o desactiva cada uno.'],
          tmpl: ['{{t:pl_section_btn}}', 'Guarda la {{t:time_machine_title}} como playlist.'],
          tmcard: ['Un recuerdo', 'Con el año en que lo escuchaste. Arrastra la fila para recorrerla.']
        } },
        menu: { title: 'Lo que abre una tarjeta', spots: {
          menu: ['Opciones', 'Buscar en Spotify, añadir a una playlist o al reproductor, o buscar en Google.'],
          card: ['La tarjeta', 'Todas las tarjetas de esta pestaña funcionan igual.'],
          tm: ['Tipos', 'Lo que muestra la {{t:time_machine_title}}.']
        } },
        coming: { title: '{{t:ev_tab_coming}}', spots: {
          tab: ['{{t:ev_tab_coming}}', 'Lo que viene.'],
          views: ['{{t:ev_view_reel}} / {{t:ev_view_tiles}} / {{t:ev_view_table}} / {{t:ev_view_list}}', 'Cuatro formas de verlo.'],
          week: ['{{t:ev_group_week}}', 'Los próximos siete días.'],
          soon: ['{{t:ev_group_soon}}', 'Hasta dentro de un mes.'],
          later: ['{{t:ev_group_later}}', 'Más adelante: lanzamientos anunciados y fechas de gira.'],
          card: ['Un evento', 'Su fecha, su artista y qué es.'],
          when: ['Cuándo', 'Cuántos días faltan.'],
          more: ['Ver todos', 'Los aniversarios se limitan a los que más escuchaste. Esto los muestra todos.'],
          note: ['Conciertos', 'Cuántos conciertos se encontraron y dónde están las entradas.']
        } },
        table: { title: '{{t:ev_view_table}}', spots: {
          views: ['{{t:ev_view_table}}', 'Los mismos eventos en una tabla.'],
          table: ['La tabla', 'Una fila por evento.'],
          th: ['Columnas', '{{t:ev_th_event}}, {{t:ev_th_artist}}, {{t:ev_th_date}} y {{t:ev_th_type}}.']
        } },
        recent: { title: '{{t:ev_tab_recent}}', spots: {
          tab: ['{{t:ev_tab_recent}}', 'Lo que acaba de pasar.'],
          past: ['{{t:ev_group_past_week}}', 'Los últimos siete días.'],
          weeks: ['{{t:ev_group_past_weeks}}', 'Hasta hace un mes.'],
          earlier: ['{{t:ev_group_earlier}}', 'Lanzamientos de los últimos seis meses.'],
          more: ['Ver todos', 'Cada aniversario.'],
          nmf: ['New Music Friday', 'Los lanzamientos de esta semana en Deezer, para todos, no solo tus artistas.'],
          fridays: ['{{t:ev_nmf_past}}', 'Viernes anteriores que este navegador ha guardado.']
        } },
        cal: { title: '{{t:ev_tab_calendar}}', spots: {
          tab: ['{{t:ev_tab_calendar}}', 'Cada evento en un calendario.'],
          prev: ['{{t:ev_cal_prev}}', 'El mes anterior.'],
          title: ['El mes', 'El que estás viendo.'],
          next: ['{{t:ev_cal_next}}', 'El mes siguiente.'],
          views: ['{{t:ev_cal_month}} / {{t:ev_cal_week}} / {{t:ev_cal_day}}', 'Cuánto ver a la vez.'],
          today: ['Hoy', 'Enmarcado.'],
          num: ['Un día', 'Haz clic en el número para abrir ese día.'],
          ev: ['Un evento', 'Haz clic para ver opciones.'],
          more: ['Más', 'El resto de eventos de ese día.']
        } },
        week: { title: '{{t:ev_cal_week}}', spots: {
          views: ['{{t:ev_cal_week}}', 'Siete días uno al lado del otro.'],
          title: ['La semana', 'Avanza de semana en semana con las flechas.'],
          today: ['Hoy', 'Todos los eventos del día, en lista.']
        } },
        day: { title: '{{t:ev_cal_day}}', spots: {
          views: ['{{t:ev_cal_day}}', 'Un día.'],
          title: ['El día', 'Avanza de día en día con las flechas.'],
          card: ['Un evento', 'En tarjetas, como en {{t:ev_tab_today}}.'],
          anniv: ['{{t:ev_cal_anniversaries}}', 'Los aniversarios de ese día.']
        } },
        info: { title: '{{t:ev_info_title}}', spots: {
          info: ['ⓘ', 'Abre o cierra esta línea.'],
          status: ['En resumen', 'Cumpleaños, aniversarios, eventos próximos y recientes encontrados, de cuántos artistas y cuándo.'],
          refresh: ['{{t:ev_refresh_title}}', 'Vuelve a buscarlo todo ahora (se actualiza solo una vez al día).']
        } }
      },
      howto: {
        today: { title: 'Qué pasa hoy', slides: [
          'Los cumpleaños, lanzamientos y conciertos de hoy.',
          'Haz clic en una tarjeta…',
          '…para Spotify, una playlist, el reproductor o una búsqueda.',
          'Lanzamientos que cumplen años hoy.',
          'Y lo que escuchabas este día hace años.'
        ] },
        coming: { title: 'Mira lo que viene', slides: [
          'Abre {{t:ev_tab_coming}}.',
          'Primero esta semana.',
          'Muestra todos los aniversarios.',
          'Cambia la vista…',
          '…a {{t:ev_view_table}}, por ejemplo.'
        ] },
        cal: { title: 'Usa el calendario', slides: [
          'Abre {{t:ev_tab_calendar}}.',
          '{{t:ev_cal_month}}, {{t:ev_cal_week}} o {{t:ev_cal_day}}.',
          'Haz clic en el número de un día para abrirlo.',
          'El día entero, en tarjetas.',
          '{{t:ev_cal_week}}: siete días uno al lado del otro.'
        ] },
        filter: { title: 'Solo lo que quieres', slides: [
          'Toca un tipo para ocultarlo.',
          '{{t:ev_type_shows}} para las fechas en directo.',
          'Reproduce lo que queda…',
          '…o guárdalo como playlist.'
        ] },
        recent: { title: 'Ponte al día', slides: [
          'Abre {{t:ev_tab_recent}}.',
          'Primero la última semana.',
          'New Music Friday: los lanzamientos de esta semana.',
          'Y viernes anteriores.'
        ] }
      },
      options: {
        page: { title: 'Toda la pestaña', items: {
          types: ['Tipos', '{{t:ev_type_birthdays}}, {{t:ev_type_albums}}, {{t:ev_type_singles}}, {{t:ev_type_eps}}, {{t:ev_type_other}}, {{t:ev_type_shows}}.'],
          view: ['Vista', '{{t:ev_view_reel}}, {{t:ev_view_tiles}}, {{t:ev_view_table}} o {{t:ev_view_list}} ({{t:ev_tab_coming}} y {{t:ev_tab_recent}}).'],
          play: ['{{t:ev_play_all}}', 'La pestaña en el reproductor.'],
          pl: ['{{t:pl_section_btn}}', 'La pestaña como playlist.'],
          refresh: ['{{t:ev_refresh_title}}', 'Buscar de nuevo.'],
          limit: ['Artistas top', 'Cuántos de tus artistas top seguir. En {{t:set_title}}.']
        } },
        cal: { title: '{{t:ev_tab_calendar}}', items: {
          views: ['{{t:ev_cal_month}} / {{t:ev_cal_week}} / {{t:ev_cal_day}}', 'Cuánto a la vez.'],
          nav: ['‹ ›', 'Antes y después.']
        } },
        tm: { title: '{{t:time_machine_title}}', items: {
          types: ['{{t:time_machine_songs}} / {{t:time_machine_artists}} / {{t:time_machine_albums}}', 'Lo que muestra.'],
          pl: ['{{t:pl_section_btn}}', 'Como playlist.']
        } }
      },
      challenges: {
        'ev.tab': ['Abre otra pestaña', '{{t:ev_tab_coming}}, {{t:ev_tab_recent}} o {{t:ev_tab_calendar}}.'],
        'ev.type': ['Oculta o muestra un tipo', 'Los botones bajo las pestañas.'],
        'ev.view': ['Cambia la vista', 'En {{t:ev_tab_coming}} o {{t:ev_tab_recent}}.'],
        'ev.cal': ['Cambia el calendario a {{t:ev_cal_week}} o {{t:ev_cal_day}}', 'En {{t:ev_tab_calendar}}.'],
        'ev.day': ['Abre un día', 'Haz clic en el número de un día del calendario.'],
        'ev.tm': ['Cambia lo que muestra la {{t:time_machine_title}}', 'En {{t:ev_tab_today}}.'],
        'ev.card': ['Haz clic en una tarjeta', 'Cualquier evento o tarjeta de la {{t:time_machine_title}}.'],
        'ev.info': ['Abre ⓘ', 'Junto al título.']
      },
      quiz: {
        q1: ['¿Qué es la {{t:time_machine_title}}?',
          ['Lo que escuchabas este día en años anteriores', 'Los lanzamientos de la semana que viene', 'Una forma de rebobinar el ranking'],
          'Muestra las canciones, artistas y álbumes que escuchabas este mismo día hace años.'],
        q2: ['¿Cómo abres un día en el calendario?',
          ['Doble clic en el mes', 'Clic en el número del día', 'Abriendo {{t:ev_tab_today}}'],
          'El número abre ese día, con todos sus eventos en tarjetas.'],
        q3: ['¿De quién son los lanzamientos de New Music Friday?',
          ['Solo de tus artistas top', 'De todos: los lanzamientos de esta semana en Deezer', 'Solo de álbumes que puntuaste'],
          'New Music Friday no se filtra por tus artistas, así que sirve para descubrir otros nuevos.']
      },
      tips: [
        'La {{t:time_machine_title}} muestra lo que escuchabas este mismo día hace años.',
        'Haz clic en el número de un día del calendario para ver todo lo de ese día.',
        '¿Prefieres una lista? {{t:ev_tab_coming}} y {{t:ev_tab_recent}} tienen cuatro vistas.',
        '¿No te interesan los cumpleaños? Toca {{t:ev_type_birthdays}} para ocultarlos en todas partes.'
      ]
    },
    playlists: {
      title: '{{t:nav_playlists}}',
      promise: 'Haz listas con cualquier cosa que veas, deja que tus rankings hagan algunas solos y llévalas a tu app de música.',
      scenes: {
        top: { title: 'Tus listas', spots: {
          title: ['{{t:nav_playlists}}', 'Todas las listas que hiciste, guardadas en este navegador (y en tu cuenta si has iniciado sesión).'],
          total: ['En total', 'Cuántas listas y canciones.'],
          search: ['{{t:pl_x_search_ph}}', 'Por el nombre de la lista o un artista que tenga.'],
          sort: ['{{t:pl_x_sort_recent}} / {{t:pl_x_sort_name}} / {{t:pl_x_sort_size}}', 'El orden de las tarjetas.'],
          new: ['{{t:pl_x_new_title}}', 'Lo que hay ahora en el reproductor, guardado como lista.'],
          name: ['Nombre', 'Escribe un nombre y guarda.'],
          card: ['Una lista', 'Haz clic para abrirla.'],
          cover: ['Portada', 'Cuatro de sus portadas. El botón de reproducir encima la empieza.'],
          meta: ['Sobre ella', 'Sus canciones, cuándo cambió y sus artistas.'],
          ap: ['{{t:ap_setup_title}}', 'Listas que tus rankings hacen solos (con sesión iniciada).'],
          tile: ['Un ranking', '{{t:ap_row_day}}, {{t:ap_row_week}}, {{t:ap_row_month}} o {{t:ap_row_year}}.'],
          sw: ['Activar / desactivar', 'Cada vez que termina uno de sus periodos, sus canciones top se convierten en una lista.'],
          size: ['{{t:ap_size}}', 'Cuántas canciones: 10, 20, 40, 50 o 100.']
        } },
        open: { title: 'Una lista', spots: {
          back: ['{{t:pl_x_back}}', 'Vuelve a las tarjetas.'],
          hero: ['La lista', 'Su nombre, artistas y canciones.'],
          cover: ['Portada', 'Hecha con las portadas de sus canciones.'],
          name: ['Nombre', 'Cómo la llamaste.'],
          meta: ['Sobre ella', 'Canciones, artistas y cuándo cambió por última vez.'],
          play: ['{{t:pl_x_play}}', 'La reproduce desde el principio en el reproductor.'],
          shuffle: ['{{t:pl_x_shuffle}}', 'La reproduce en orden aleatorio.'],
          export: ['{{t:pl_view_export}}', 'La guarda como archivo para tu app de música.'],
          rename: ['{{t:pl_view_rename}}', 'Dale otro nombre.'],
          del: ['{{t:pl_view_delete}}', 'Pregunta antes.'],
          track: ['Una canción', 'Haz clic para reproducir desde aquí.'],
          drag: ['{{t:pl_view_drag}}', 'Agarra una canción por su número para moverla.'],
          acts: ['Escuchar', 'Reproducir, Spotify, YouTube o añadirla a la cola.'],
          remove: ['{{t:pl_view_remove}}', 'La quita de esta lista.']
        } },
        export: { title: '{{t:pl_export_playlist}}', spots: {
          btn: ['{{t:pl_view_export}}', 'Abre las opciones.'],
          menu: ['Opciones', 'Un archivo para tu app de música, de dos formas.'],
          item: ['{{t:pl_export_csv}}', 'Para una herramienta de importación como Soundiiz. O un archivo de texto.']
        } },
        pick: { title: '{{t:pl_pick_title}}', spots: {
          sub: ['Lo que añades', 'Una canción, un álbum, las canciones de un artista, un ranking entero…'],
          new: ['{{t:pl_pick_new}}', 'Empieza una lista nueva con ellas.'],
          text: ['{{t:pl_pick_text}}', '{{t:pl_pick_text_hint}}.'],
          list: ['Tus listas', 'Elige a cuál añadir.'],
          item: ['Una lista', 'El número es cuántas canciones son nuevas para ella; las que ya tiene se saltan.']
        } },
        rel: { title: 'Lanzamientos', spots: {
          anniv: ['{{t:ev_cal_anniversaries}}', 'Álbumes de tus artistas top que cumplen años en los próximos 30 días.'],
          annpl: ['{{t:pl_section_btn}}', 'Todos ellos como lista.'],
          card: ['Un lanzamiento', 'Haz clic para ver opciones.'],
          recent: ['{{t:ev_sec_recent_releases}}', 'Lanzamientos de tus artistas top en los últimos seis meses.'],
          recpl: ['{{t:pl_section_btn}}', 'Todos ellos como lista.']
        } }
      },
      howto: {
        make: { title: 'Haz una lista', slides: [
          'Pulsa {{t:pl_section_btn}} o {{t:ea_add_playlist}} en cualquier cosa: una canción, un álbum, un ranking entero.',
          '{{t:pl_pick_new}}…',
          '…o añade a una que ya tengas.',
          'O guarda lo que está sonando.',
          'Las listas enteras también tienen un botón {{t:pl_section_btn}}.'
        ] },
        use: { title: 'Reprodúcela y ordénala', slides: [
          'Abre una lista.',
          '{{t:pl_x_play}} o {{t:pl_x_shuffle}}.',
          'Arrastra canciones para cambiar el orden.',
          'Quita una.',
          'Cámbiale el nombre.'
        ] },
        take: { title: 'Llévala a tu app de música', slides: [
          'Pulsa {{t:pl_view_export}}.',
          'Descarga un archivo para una herramienta de importación.',
          'O copia la lista como texto.'
        ] },
        auto: { title: 'Listas automáticas', slides: [
          'Inicia sesión y mira debajo de tus listas.',
          'Activa un ranking.',
          'Elige cuántas canciones.',
          'Cuando termina su periodo aparece la lista, y una notificación te avisa.'
        ] }
      },
      options: {
        list: { title: 'Tus listas', items: {
          sort: ['Orden', '{{t:pl_x_sort_recent}}, {{t:pl_x_sort_name}} o {{t:pl_x_sort_size}}.'],
          search: ['Buscar', 'Por nombre o artista.'],
          new: ['{{t:pl_x_new_title}}', 'La cola del reproductor como lista.']
        } },
        one: { title: 'Una lista', items: {
          play: ['{{t:pl_x_play}}', 'Desde el principio.'],
          shuffle: ['{{t:pl_x_shuffle}}', 'En orden aleatorio.'],
          export: ['{{t:pl_view_export}}', 'Un CSV o un archivo de texto.'],
          rename: ['{{t:pl_view_rename}}', 'Otro nombre.'],
          del: ['{{t:pl_view_delete}}', 'Para siempre, después de confirmar.'],
          drag: ['{{t:pl_view_drag}}', 'Cambia el orden.']
        } },
        auto: { title: '{{t:ap_setup_title}}', items: {
          types: ['Rankings', 'Diario, semanal, mensual, anual. Cada uno activado o no.'],
          size: ['{{t:ap_size}}', 'De 10 a 100.']
        } }
      },
      challenges: {
        'pl.open': ['Abre una lista', 'Haz clic en una tarjeta.'],
        'pl.sort': ['Cambia el orden de tus listas', 'Junto a la búsqueda.'],
        'pl.search': ['Busca en tus listas', '{{t:pl_x_search_ph}}.'],
        'pl.play': ['Reproduce una lista', '{{t:pl_x_play}} o {{t:pl_x_shuffle}}.'],
        'pl.add': ['Añade algo a una lista', 'Desde el menú ⋮ de una canción, o cualquier botón {{t:pl_section_btn}}.'],
        'pl.export': ['Abre {{t:pl_view_export}}', 'En una lista abierta.'],
        'pl.auto': ['Activa una lista automática', 'Debajo de tus listas (con sesión iniciada).']
      },
      quiz: {
        q1: ['¿Desde dónde puedes añadir canciones a una lista?',
          ['Solo desde esta pestaña', 'Solo desde el reproductor', 'Casi desde cualquier sitio: una canción, un álbum, un ranking, una lista'],
          'Busca {{t:ea_add_playlist}} o {{t:pl_section_btn}}: en filas, ventanas, rankings y listas.'],
        q2: ['¿Qué tiene una lista automática semanal?',
          ['Las canciones top de la semana, hecha cuando termina', 'Las canciones que añadiste esta semana', 'Los lanzamientos de esta semana'],
          'Cada semana terminada, sus canciones top (tantas como elegiste) se convierten en una lista.'],
        q3: ['¿Cómo llevas una lista a Spotify o Apple Music?',
          ['Se sincroniza sola', 'Expórtala y carga el archivo con una herramienta de importación', 'Por correo'],
          'Exporta un CSV (o cópiala como texto) y cárgalo con una herramienta como Soundiiz.']
      },
      tips: [
        'La ventana de listas muestra cuántas canciones son nuevas para cada lista. Las que ya tiene se saltan.',
        'Activa {{t:ap_row_week}} en {{t:ap_setup_title}} y las canciones top de cada semana se convierten en una lista.',
        'Exporta una lista como CSV y una herramienta de importación puede pasarla a Spotify o Apple Music.',
        'Arrastra una canción por su número para subirla o bajarla en una lista.'
      ]
    },
    // Music player (PLAYER-PLAN.md step 14) — names use the app's own labels ({{t:yt_np_…}})
    smart: {
      title: 'Listas inteligentes',
      promise: 'Listas que se llenan solas con reglas sobre lo que escuchas, y cambian contigo.',
      scenes: {
        top: { title: 'Listas inteligentes en tu biblioteca', spots: {
          new: ['{{t:sp_b_card_title}}', 'Crea tu propia lista inteligente o mezcla varias listas en una.'],
          create: ['{{t:sp_b_card_btn}}', 'Abre el editor de reglas.'],
          mix: ['{{t:sp_mix_btn}}', 'Junta de 2 a 4 listas en una.'],
          card: ['Una lista inteligente', 'Está con tus otras listas y se actualiza sola.'],
          tag: ['{{t:sp_tag}}', 'Esta etiqueta marca las que se llenan solas.'],
          change: ['Qué cambió', 'Canciones nuevas y las que salieron desde la última vez que la abriste.'],
          ready: ['{{t:sp_ready_title}}', 'Las listas ya hechas que no tienes, para añadirlas de nuevo.'],
          readybtn: ['Una lista ya hecha', 'Un clic la añade a tus listas.']
        } },
        open: { title: 'Una lista inteligente', spots: {
          kicker: ['{{t:sp_tag}}', 'Se llena sola con sus reglas.'],
          rules: ['Las reglas', 'Qué elige, en palabras sencillas.'],
          pick: ['{{t:sp_pick_year}}', 'Algunas listas ya hechas tienen su propio ajuste, como el año.'],
          bell: ['{{t:sp_nt_switch}}', 'Una notificación cuando entran varias canciones nuevas (con sesión iniciada).'],
          edit: ['{{t:sp_b_edit}}', 'Cambia las reglas.'],
          copy: ['{{t:sp_copy}}', 'Guarda las canciones de hoy en una lista que no cambia.'],
          share: ['{{t:sp_share}}', 'Publica las reglas para que otros la creen con lo que escuchan.'],
          changes: ['{{t:sp_cg_title}}', 'Qué canciones entraron y cuáles salieron.'],
          newrow: ['{{t:badge_new_songs}}', 'Una canción nueva desde la última vez.']
        } },
        build: { title: '{{t:sp_b_title_new}}', spots: {
          name: ['{{t:sp_b_name}}', 'Cómo llamarla.'],
          start: ['{{t:sp_b_start}}', 'En blanco, o una copia de una lista ya hecha para cambiarla.'],
          match: ['{{t:sp_b_match_all}} / {{t:sp_b_match_any}}', 'Todas las reglas, o solo una.'],
          rule: ['Una regla', 'Qué comprobar, cómo y el valor.'],
          field: ['{{t:sp_b_field}}', 'Reproducciones, fechas, listas, género, cuándo escuchas, puntuaciones, tus otras listas…'],
          chart: ['{{t:sp_b_chart}}', 'Una regla de ranking elige su lista: diaria, semanal, mensual o anual.'],
          cond: ['{{t:sp_b_condition}}', 'Al menos, en el top, en los últimos… días, contiene…'],
          value: ['{{t:sp_b_value}}', 'Un número, una fecha o un nombre. Artista, álbum y género te sugieren los tuyos.'],
          group: ['Un grupo', 'Reglas dentro de las reglas, con su propio “todas / alguna”.'],
          add: ['{{t:sp_b_add_rule}} / {{t:sp_b_add_group}}', 'Más reglas.'],
          sort: ['{{t:sp_b_sort}}', 'El orden de las canciones, o aleatorio.'],
          size: ['{{t:sp_b_limit}}', 'Cuántas canciones, 500 como máximo.'],
          per: ['{{t:sp_b_per_artist}}', 'Para que un artista no lo acapare todo.'],
          mode: ['{{t:sp_b_save_as}}', '{{t:sp_b_mode_live}} o {{t:sp_b_mode_once}}.'],
          count: ['Cuántas cumplen', 'Cambia al cambiar las reglas.'],
          desc: ['En palabras sencillas', 'Las reglas en una frase y las primeras canciones.']
        } },
        mix: { title: '{{t:sp_mix_btn}}', spots: {
          lists: ['{{t:sp_mix_pick}}', 'Primero las inteligentes, también las normales.'],
          on: ['Una lista elegida', 'El número es su turno.'],
          size: ['{{t:sp_mix_size}}', '25, 50 o 100 canciones.'],
          per: ['{{t:sp_b_per_artist}}', 'Para que la mezcla sea variada.'],
          name: ['{{t:sp_b_name}}', 'Para cuando la guardes.'],
          preview: ['La mezcla', 'Una canción de cada lista por turnos, sin repetir.'],
          play: ['{{t:sp_mix_play}}', 'Directo al reproductor.'],
          save: ['{{t:sp_mix_save}}', 'La guarda como lista normal.']
        } },
        share: { title: 'Una lista inteligente en el {{t:nav_board}}', spots: {
          tag: ['{{t:sp_tag}}', 'Las publicaciones con una lista inteligente llevan esta etiqueta.'],
          card: ['La lista compartida', 'Sus reglas, no las canciones de nadie.'],
          desc: ['Las reglas', 'En tu propio idioma.'],
          match: ['Con tu biblioteca', 'Cuántas de tus canciones tendría.'],
          add: ['{{t:sp_share_add}}', 'La crea con lo que tú escuchas.']
        } }
      },
      howto: {
        make: { title: 'Crea una lista inteligente', slides: [
          'Pulsa {{t:sp_b_card_btn}} en la tarjeta {{t:sp_b_card_title}}.',
          'Empieza en blanco o desde una lista ya hecha.',
          'Elige qué comprobar, la condición y el valor.',
          'Añade un grupo para “esto o aquello”.',
          'Mira cuántas canciones cumplen.',
          'Elige {{t:sp_b_mode_live}} y pulsa {{t:sp_b_save}}.'
        ] },
        ready: { title: 'Usa una lista ya hecha', slides: [
          'Llevan la etiqueta {{t:sp_tag}}.',
          'Abre una para ver sus reglas.',
          'Algunas tienen un ajuste, como el año.',
          '¿Borraste una? Añádela de nuevo en {{t:sp_ready_title}}.'
        ] },
        changes: { title: 'Mira qué cambió', slides: [
          'La tarjeta muestra las canciones nuevas y las que salieron.',
          'Ábrela: aparecen arriba.',
          'Activa la campana para recibir una notificación.'
        ] },
        mix: { title: 'Mezcla listas', slides: [
          'Pulsa {{t:sp_mix_btn}}.',
          'Elige de 2 a 4 listas.',
          'Elige un tamaño.',
          '{{t:sp_mix_play}} o {{t:sp_mix_save}}.'
        ] },
        share: { title: 'Compártela en el {{t:nav_board}}', slides: [
          'Pulsa {{t:sp_share}} en una lista inteligente abierta.',
          'Publícala: los demás ven las reglas.',
          'Pulsan {{t:sp_share_add}} y la obtienen con lo que escuchan.'
        ] }
      },
      options: {
        list: { title: 'En el editor', items: {
          sort: ['{{t:sp_b_sort}}', 'Cualquier dato, lo mejor primero o al revés, o aleatorio (un orden nuevo cada día).'],
          size: ['{{t:sp_b_limit}}', 'Hasta 500 canciones.'],
          per: ['{{t:sp_b_per_artist}}', '{{t:sp_mix_any}}, o un número.'],
          mode: ['{{t:sp_b_save_as}}', '{{t:sp_b_mode_live}}, o {{t:sp_b_mode_once}} como lista normal.']
        } },
        one: { title: 'Una lista inteligente', items: {
          bell: ['{{t:sp_nt_switch}}', 'Activada o no en cada lista (con sesión iniciada).'],
          copy: ['{{t:sp_copy}}', 'Las canciones de hoy, tal cual.'],
          share: ['{{t:sp_share}}', 'Las reglas, para que otros las usen.']
        } }
      },
      challenges: {
        'sp.open': ['Abre una lista inteligente', 'Busca la etiqueta {{t:sp_tag}}.'],
        'sp.build': ['Abre el editor de reglas', '{{t:sp_b_card_btn}} en la tarjeta {{t:sp_b_card_title}}, o {{t:sp_b_edit}}.'],
        'sp.mix': ['Abre {{t:sp_mix_btn}}', 'En la tarjeta {{t:sp_b_card_title}}.'],
        'sp.bell': ['Activa la campana de una lista inteligente', 'En una lista inteligente abierta (con sesión iniciada).'],
        'sp.copy': ['Guarda una copia de una lista inteligente', 'El botón de copiar en una lista inteligente abierta.'],
        'sp.share': ['Comparte una lista inteligente en el {{t:nav_board}}', '📣 en una lista inteligente abierta (con sesión iniciada).']
      },
      quiz: {
        q1: ['¿Qué se comparte al compartir una lista inteligente en el {{t:nav_board}}?',
          ['Tus canciones', 'Sus reglas', 'Un enlace a tu perfil'],
          'Solo las reglas: quien la añade obtiene canciones de lo que escucha.'],
        q2: ['Quieres una lista que nunca cambie. ¿Qué eliges?',
          ['{{t:sp_b_mode_once}}, o {{t:sp_copy}}', '{{t:sp_b_mode_live}}', 'La campana'],
          '{{t:sp_b_mode_once}} (o una copia) crea una lista normal con las canciones de hoy.'],
        q3: ['¿Cómo consigues “canciones de Pop o Rock que llegaron al top 10”?',
          ['Dos listas inteligentes', 'Ordenar por género', 'Un grupo con {{t:sp_b_match_any}} para los géneros, más una regla de posición máxima'],
          'Un grupo permite que parte de las reglas sea “esto o aquello” mientras el resto sigue contando.']
      },
      tips: [
        'Un grupo dentro de las reglas te da “esto o aquello”, como Pop o Rock, mientras las demás reglas siguen contando.',
        'Activa la campana de una lista inteligente y entérate cuando entren varias canciones nuevas.',
        '{{t:sp_mix_btn}} junta hasta 4 listas en una, una canción de cada una por turnos.',
        'Una lista inteligente compartida en el {{t:nav_board}} se crea con lo que tú escuchas al pulsar {{t:sp_share_add}}.'
      ]
    },
    player: {
      title: 'Reproductor',
      promise: 'Escucha cualquier canción de tus listas, sigue la letra, encuentra el vídeo correcto y guarda las canciones que te encantan.',
      scenes: {
        card: {
          title: 'El reproductor',
          spots: {
            drag: ['Muévelo', 'Arrastra los puntos para poner el reproductor donde quieras.'],
            stage: ['Modo escenario', 'La pantalla grande: el vídeo grande y la letra al lado. G hace lo mismo.'],
            bar: ['Redúcelo', 'Lo convierte en un reproductor pequeño en la esquina (o abajo) para seguir navegando. M hace lo mismo.'],
            close: ['{{t:yt_np_close}}', 'Para la música. Esc hace lo mismo.'],
            media: ['Portada o vídeo', 'La portada, con un disco que gira mientras suena, o el videoclip.'],
            src: ['De dónde salió el vídeo', '{{t:yt_np_src_official}}, {{t:yt_np_src_search}}, {{t:yt_np_src_saved}} o {{t:yt_np_src_pick}}. “{{t:yt_np_wrong}}” te deja elegir otro.'],
            seg: ['{{t:yt_np_art}} / {{t:yt_np_video}}', 'Cambia entre la portada y el videoclip. V hace lo mismo.'],
            title: ['La canción', 'Su nombre y su artista. El color suave de detrás sale de la portada.'],
            add: ['{{t:yt_np_add}}', 'Pone la canción en cualquiera de tus listas. P hace lo mismo.'],
            love: ['♥ Favorites', 'Añade la canción a tu lista Favorites, o la quita. K hace lo mismo.'],
            story: ['Tu historia en las listas', 'Esta canción en tus propias listas: {{t:yt_np_this_week}}, {{t:yt_np_peak}}, {{t:yt_np_your_plays}} y {{t:yt_np_weeks_on}}. Haz clic en una para abrir la canción.']
          }
        },
        play: {
          title: 'Sonando',
          spots: {
            seek: ['Progreso', 'Arrastra para saltar a cualquier punto de la canción.'],
            mark: ['La marca verde', 'Donde se hace el scrobble ({{t:yt_np_scrobble_at}} en {{t:yt_np_tab_tools}}).'],
            note: ['Cuándo cuenta', '“Cuenta a los 1:25”, luego “{{t:yt_np_scrobbled_lfm}}”, o “{{t:yt_np_not_scrobbling}} · {{t:yt_np_connect}}” si nada guarda tus escuchas.'],
            shuffle: ['{{t:pl_x_shuffle}}', 'Siguiente elige una canción al azar de {{t:yt_np_tab_next}}. X hace lo mismo.'],
            prev: ['{{t:yt_np_prev}}', 'Vuelve al principio de la canción o, en los 3 primeros segundos, a la anterior. B hace lo mismo.'],
            play: ['{{t:yt_np_playpause}}', 'Espacio hace lo mismo.'],
            next: ['{{t:yt_np_next_a}}', 'La siguiente de {{t:yt_np_tab_next}}. N hace lo mismo.'],
            repeat: ['Repetir', 'No, todo o esta canción (el 1). R hace lo mismo.'],
            tabs: ['Cuatro secciones', '{{t:yt_np_tab_next}}, {{t:yt_np_tab_lyrics}}, {{t:yt_np_tab_history}} y {{t:yt_np_tab_tools}}.'],
            queue: ['{{t:yt_np_tab_next}}', 'Las canciones que esperan. Arrastra para reordenar; clic derecho en una para más.'],
            vol: ['{{t:yt_np_volume}}', 'Las flechas arriba y abajo hacen lo mismo; 0 silencia.'],
            speed: ['{{t:yt_np_tool_speed}}', 'Muestra la velocidad. Haz clic para cambiarla.'],
            sleep: ['{{t:yt_np_sleep}}', 'Para la música pasado un rato. Muestra el tiempo que queda.'],
            help: ['?', 'Un recorrido de un minuto por el reproductor. La tecla ? hace lo mismo.']
          }
        },
        tools: {
          title: '{{t:yt_np_tab_tools}}',
          spots: {
            search: ['{{t:yt_np_tool_search}}', 'Busca un vídeo mejor o pega un enlace de YouTube.'],
            similar: ['{{t:yt_np_tool_similar}}', '{{t:yt_np_tool_similar_d}}'],
            sleep: ['{{t:yt_np_sleep}}', '15, 30, 45 o 60 minutos.'],
            speed: ['{{t:yt_np_tool_speed}}', 'De 0,75× a 2×.'],
            xfade: ['{{t:yt_np_xfade}}', 'Funde el final de una canción con la siguiente.'],
            scrobble: ['{{t:yt_np_scrobble_at}}', '30 segundos, la mitad, el 70 % o el final.'],
            lists: ['{{t:yt_np_tool_lists}}', '{{t:yt_np_tool_lists_d}}'],
            share: ['{{t:yt_np_tool_share}}', '{{t:yt_np_tool_share_d}}'],
            pip: ['{{t:yt_np_pip}}', '{{t:yt_np_tool_pip_d}}'],
            youtube: ['{{t:yt_np_tool_youtube}}', 'El vídeo en youtube.com.'],
            wake: ['{{t:yt_np_tool_wake}}', 'En el móvil, la música se para si la pantalla se bloquea. Actívalo para que siga.'],
            keys: ['{{t:yt_np_tool_keys}}', 'Todas las teclas del reproductor.'],
            tour: ['{{t:yt_np_tool_tour}}', 'El paseo de un minuto por el reproductor.']
          }
        },
        lyrics: {
          title: '{{t:yt_np_tab_lyrics}}',
          spots: {
            pill: ['{{t:yt_np_lyr_synced}}', 'Esta letra sigue la canción. Las de “{{t:yt_np_lyr_plain_pill}}” son texto normal.'],
            nudge: ['Sincronía', '¿La letra va antes o después (un vídeo con intro)? Muévela medio segundo cada vez.'],
            now: ['La línea que suena', 'Grande y brillante. La lista sigue la canción sola.'],
            line: ['Cualquier línea', 'Haz clic para saltar a esa parte de la canción.']
          }
        },
        find: {
          title: '{{t:yt_np_wrong}}',
          spots: {
            back: ['{{t:yt_np_all_tools}}', 'Vuelve a las tarjetas de herramientas.'],
            search: ['{{t:yt_np_search}}', 'Busca otra versión por su nombre.'],
            paste: ['Pega un enlace', 'Copia la dirección del vídeo en YouTube y pégala aquí.'],
            use: ['{{t:yt_np_use_link}}', 'El reproductor compara el vídeo con la canción y lo reproduce.']
          }
        },
        small: {
          title: 'El reproductor pequeño',
          spots: {
            who: ['La canción', 'Haz clic para abrir otra vez el reproductor completo. Arrastra la cápsula donde quieras.'],
            love: ['♥', 'Favorites, también desde aquí.'],
            play: ['{{t:yt_np_playpause}}', 'Con {{t:yt_np_prev}} y {{t:yt_np_next_a}} al lado.'],
            open: ['Abrir', 'Vuelve al reproductor completo.'],
            close: ['{{t:yt_np_close}}', 'Para la música.']
          }
        },
        filled: {
          title: '{{t:set_pm_filled}}',
          spots: {
            who: ['La canción', 'Haz clic para abrir el reproductor completo.'],
            seek: ['Progreso', 'Con los tiempos. Arrastra para saltar.'],
            next: ['La siguiente', 'La siguiente de {{t:yt_np_tab_next}}.'],
            queue: ['{{t:yt_np_tab_next}}', 'Abre el reproductor completo en {{t:yt_np_tab_next}}.'],
            vol: ['{{t:yt_np_volume}}', 'Silenciar y volumen.']
          }
        },
        stage: {
          title: 'Modo escenario',
          spots: {
            video: ['El vídeo', 'Tan grande como la ventana. La pantalla completa está a un clic más.'],
            hint: ['Volver', 'G o Esc vuelven a la tarjeta tal como estaba.'],
            full: ['{{t:yt_np_full}}', 'Toda la pantalla, sin el navegador alrededor.'],
            back: ['Reproductor pequeño', 'Vuelve a la tarjeta.'],
            tabs: ['Las secciones', 'El modo escenario abre en {{t:yt_np_tab_lyrics}}; {{t:yt_np_tab_next}}, {{t:yt_np_tab_history}} y {{t:yt_np_tab_tools}} también están aquí.'],
            lyrics: ['Letra grande', 'Fácil de seguir desde el otro lado de la habitación.'],
            controls: ['Controles', 'Abajo.']
          }
        }
      },
      howto: {
        video: {
          title: 'Arregla un vídeo equivocado o que falta',
          slides: ['Debajo de la imagen, pulsa “{{t:yt_np_wrong}}”.', 'Busca otra versión…', '…o copia la dirección del vídeo en YouTube y pégala aquí.', 'Pulsa {{t:yt_np_use_link}}. Si coincide con la canción, el reproductor la recuerda.']
        },
        fav: {
          title: 'Guarda las canciones que te encantan',
          slides: ['Pulsa ♥: la canción va a tu lista Favorites. Púlsalo otra vez para quitarla.', 'Pulsa + para añadirla a cualquier otra lista.']
        },
        sleep: {
          title: 'Dormirse con música',
          slides: ['Pulsa la luna de la fila de abajo.', 'Elige 15, 30, 45 o 60 minutos. El botón cuenta hacia atrás.']
        },
        big: {
          title: 'Míralo en grande',
          slides: ['Pulsa el botón de pantalla de arriba (o G).', 'El vídeo llena la ventana, con la letra al lado.', 'Púlsalo otra vez, o G o Esc, para volver.']
        },
        small: {
          title: 'Sigue navegando mientras suena',
          slides: ['Pulsa ⌄ arriba (o M).', 'El reproductor se convierte en una cápsula pequeña en la esquina. Haz clic en la canción para abrirlo otra vez.', '¿Lo prefieres abajo? Ajustes → Perfil → {{t:set_pm_title}}.']
        }
      },
      options: {
        mini: {
          title: '{{t:set_pm_label}}',
          items: {
            capsule: ['{{t:set_pm_capsule}}', 'Un reproductor pequeño en la esquina. Arrástralo donde quieras.'],
            filled: ['{{t:set_pm_filled}}', 'Abajo, con progreso, tiempos y volumen.'],
            bar: ['{{t:set_pm_bar}}', 'Abajo, solo la canción y los controles.']
          }
        },
        play: {
          title: 'Reproducción',
          items: {
            speed: ['{{t:yt_np_tool_speed}}', 'Más lento o más rápido.'],
            xfade: ['{{t:yt_np_xfade}}', '3 o 6 segundos de fundido entre canciones.'],
            scrobble: ['{{t:yt_np_scrobble_at}}', 'Cuándo cuenta una escucha.'],
            sleep: ['{{t:yt_np_sleep}}', 'Para la música pasado un rato.'],
            shuffle: ['{{t:pl_x_shuffle}}', 'Orden al azar de {{t:yt_np_tab_next}}.'],
            repeat: ['Repetir', 'Todo, o una canción.'],
            wake: ['{{t:yt_np_tool_wake}}', 'En el móvil, la música se para si la pantalla se bloquea. Esto mantiene la pantalla encendida mientras suena.']
          }
        }
      },
      challenges: {
        'np.open': ['Reproduce una canción', 'Cualquier botón de reproducir, o una canción de una lista.'],
        'np.tab': ['Abre {{t:yt_np_tab_lyrics}}, {{t:yt_np_tab_history}} o {{t:yt_np_tab_tools}}', 'Las pestañas debajo de los controles.'],
        'np.love': ['Añade una canción a Favorites', 'El ♥ junto al nombre de la canción.'],
        'np.find': ['Abre {{t:yt_np_tool_search}}', '“{{t:yt_np_wrong}}”, o la primera tarjeta de {{t:yt_np_tab_tools}}.'],
        'np.sleep': ['Pon un temporizador', 'La luna de la fila de abajo.'],
        'np.stage': ['Abre el modo escenario', 'El botón de pantalla de arriba, o G.'],
        'np.bar': ['Reduce el reproductor', 'El ⌄ de arriba, o M.'],
        'np.tour': ['Haz el recorrido del reproductor', 'El ? de la fila de abajo.']
      },
      quiz: {
        q1: ['¿Qué muestra la marca verde de la barra de progreso?', ['La mitad de la canción', 'Dónde se hace el scrobble', 'Dónde empieza el estribillo'], 'Pásala y la escucha cuenta. {{t:yt_np_scrobble_at}} en {{t:yt_np_tab_tools}} la mueve.'],
        q2: ['El vídeo es el equivocado. ¿Qué puedes hacer?', ['Nada, es automático', 'Cerrar el reproductor y empezar otra vez', 'Pulsar “{{t:yt_np_wrong}}” y elegir otro o pegar un enlace de YouTube'], '“{{t:yt_np_wrong}}” abre {{t:yt_np_tool_search}}: busca, o pega el enlace correcto.'],
        q3: ['¿Adónde van las canciones que marcas con ♥?', ['A una lista llamada Favorites', 'A ningún sitio, es solo un me gusta', 'A {{t:yt_np_tab_next}}'], 'Favorites es una lista normal en la pestaña {{t:nav_playlists}}. No se puede borrar.']
      },
      tips: ['La marca verde de la barra de progreso es donde se hace el scrobble.', '¿Vídeo equivocado? Pega el enlace correcto de YouTube y el reproductor lo recuerda.', 'Haz clic en cualquier línea de la letra para saltar a esa parte de la canción.', 'Pulsa G para el modo escenario: el vídeo grande y la letra al lado.', 'En el móvil, la música se para si la pantalla se bloquea. Activa {{t:yt_np_tool_wake}} en {{t:yt_np_tab_tools}} para que siga.']
    },
    rawdata: {
      title: '{{t:nav_rawdata}}',
      promise: 'Cada reproducción de tu biblioteca, una fila cada una: encuentra cualquiera, corrige un nombre mal escrito y haz que la corrección se quede con reglas.',
      scenes: {
        top: { title: 'Cada reproducción', spots: {
          title: ['{{t:sec_raw_data_title}}', 'Toda tu biblioteca, lo más reciente primero.'],
          song: ['Canción', 'Escribe parte de un título.'],
          artist: ['Artista', 'Escribe parte de un nombre.'],
          album: ['Álbum', 'Escribe parte de un álbum.'],
          date: ['Fecha', 'Cualquier parte de la fecha tal como la muestra la tabla: «mar 2024», «2023».'],
          summary: ['Cuántas', 'Todas, o cuántas coinciden.'],
          corr: ['{{t:raw_corrected_only}}', 'Solo las que cambió una regla o una edición.'],
          rules: ['{{t:modal_rules_open_btn}}', 'Todas las reglas que guardaste.'],
          pager: ['Páginas', 'Primera, atrás, un número de página, siguiente, última.'],
          size: ['{{t:raw_rows_per_page}}', '50, 100, 200 o 500.'],
          th: ['Ordenar', 'Haz clic en un encabezado para ordenar; otra vez para darle la vuelta.'],
          row: ['Una reproducción', 'Cuándo, qué, quién y de qué álbum.'],
          edit: ['Editar', 'Corrige esta reproducción.']
        } },
        edit: { title: '{{t:modal_edit_title}}', spots: {
          artist: ['{{t:modal_label_artist}}', 'Con sugerencias de tu biblioteca mientras escribes.'],
          track: ['{{t:modal_label_track}}', 'El título de la canción.'],
          album: ['{{t:modal_label_album}}', 'Puede quedar vacío.'],
          time: ['{{t:modal_label_datetime}}', 'Cuándo se escuchó.'],
          now: ['{{t:modal_now_btn}}', 'La pone en este minuto.'],
          all: ['Todas las iguales', '{{t:modal_edit_apply_all}}.'],
          rule: ['Recordarlo', '{{t:modal_edit_save_rule}}.'],
          save: ['{{t:modal_save_locally}}', 'Lo cambia aquí. Con Last.fm o una hoja de Google, otro botón lo envía allí también.'],
          cancel: ['Cancelar', 'No cambia nada.']
        } },
        corr: { title: '{{t:raw_corrected_only}}', spots: {
          corr: ['{{t:raw_corrected_only}}', 'Activado.'],
          row: ['Una reproducción corregida', 'Una línea fina a la izquierda.'],
          badge: ['~', 'Pasa el ratón por encima para ver cómo era antes.']
        } },
        rules: { title: '{{t:modal_rules_title}}', spots: {
          count: ['Cuántas', 'Tus reglas guardadas.'],
          search: ['Buscar', 'Encuentra una regla por cualquier nombre que tenga.'],
          list: ['Las reglas', 'Cada una: lo que busca y en qué lo convierte.'],
          rule: ['Una regla', 'Se aplica cada vez que se cargan tus reproducciones, de cualquier fuente. Bórrala aquí.'],
          export: ['{{t:modal_rules_export}}', 'Las guarda en un archivo.'],
          import: ['{{t:modal_rules_import}}', 'Carga un archivo de reglas.']
        } }
      },
      howto: {
        find: { title: 'Encuentra cualquier reproducción', slides: [
          'Escribe parte de una canción, un artista o un álbum.',
          'O una fecha: un día, un mes, un año.',
          'Cuántas coinciden.',
          'Ordena por cualquier columna.',
          'Pasa las páginas.'
        ] },
        fix: { title: 'Corrige un nombre mal escrito', slides: [
          'Pulsa Editar en la reproducción.',
          'Corrige el nombre.',
          'Corrige todas las iguales a la vez…',
          '…y guárdalo como regla, para que las próximas importaciones lleguen bien.',
          '{{t:modal_save_locally}}.',
          'Ahora la reproducción tiene un ~.'
        ] },
        rules: { title: 'Cuida tus reglas', slides: [
          'Abre {{t:modal_rules_open_btn}}.',
          'Cada regla y lo que hace.',
          'Busca una.',
          'Guárdalas todas en un archivo…',
          '…y cárgalas en otro dispositivo.'
        ] }
      },
      options: {
        table: { title: 'La tabla', items: {
          filters: ['Canción / artista / álbum', 'Escribe para filtrar.'],
          date: ['Fecha', 'Un día, un mes o un año.'],
          corr: ['{{t:raw_corrected_only}}', 'Solo las cambiadas.'],
          size: ['{{t:raw_rows_per_page}}', '50, 100, 200, 500.'],
          sort: ['Ordenar', 'Cualquier columna, en los dos sentidos.']
        } },
        edit: { title: '{{t:modal_edit_title}}', items: {
          all: ['Todas las iguales', 'Misma canción, artista y álbum.'],
          rule: ['Guardar como regla', 'Para futuras importaciones.'],
          save: ['{{t:modal_save_locally}}', 'O {{t:modal_push_lfm}} / {{t:modal_push_sheet}} si están conectados.']
        } },
        rules: { title: '{{t:modal_rules_title}}', items: {
          export: ['{{t:modal_rules_export}}', 'Una copia de tus reglas.'],
          import: ['{{t:modal_rules_import}}', 'Recupéralas.']
        } }
      },
      challenges: {
        'rd.filter': ['Busca en la tabla', 'Canción, artista, álbum o fecha.'],
        'rd.sort': ['Ordena por una columna', 'Haz clic en un encabezado.'],
        'rd.page': ['Ve a otra página', 'Encima o debajo de la tabla.'],
        'rd.size': ['Cambia {{t:raw_rows_per_page}}', 'Encima de la tabla.'],
        'rd.corr': ['Muestra solo las corregidas', '{{t:raw_corrected_only}}.'],
        'rd.edit': ['Abre una reproducción para editarla', 'El lápiz al final de una fila.'],
        'rd.rules': ['Abre {{t:modal_rules_title}}', 'Encima de la tabla.']
      },
      quiz: {
        q1: ['Una canción está escrita de dos formas en tu biblioteca. ¿Qué lo arregla para siempre?',
          ['Editar una reproducción', 'Editarla con «todas las iguales» y «guardar como regla» marcados', 'Borrar la canción'],
          '«Todas las iguales» arregla las que ya tienes; la regla arregla las nuevas a medida que llegan.'],
        q2: ['¿Cómo encuentras todo lo que escuchaste en marzo de 2024?',
          ['Ordenando por artista', 'Escribiendo «2024» en la casilla de canción', 'Escribiendo «mar 2024» en la casilla de fecha'],
          'La casilla de fecha acepta un día, un mes o un año.'],
        q3: ['¿Qué significa el ~ junto a una fila?',
          ['Una regla o una edición cambió esa reproducción', 'Se escuchó dos veces', 'Es una versión en directo'],
          'Pasa el ratón por encima para ver el nombre que tenía antes.']
      },
      tips: [
        'Escribe un mes, como «mar 2024», en la casilla de fecha de {{t:nav_rawdata}} para ver todo lo que escuchaste entonces.',
        'Marca «guardar como regla» al corregir un nombre, y las próximas importaciones llegarán bien.',
        'Haz una copia de tus reglas de corrección con {{t:modal_rules_export}}.',
        'Activa {{t:raw_corrected_only}} para ver todo lo que ha cambiado una regla.'
      ]
    },
    board: {
      title: '{{t:nav_board}}',
      promise: 'Propón funciones, informa de fallos, haz preguntas y habla de música con otros oyentes, y mira lo que está planeado.',
      scenes: {
        top: { title: 'El foro', spots: {
          title: ['{{t:board_title}}', 'Un foro para todos los que usan dankcharts.'],
          signin: ['Iniciar sesión', 'Cualquiera puede leer; con sesión iniciada puedes publicar, responder y votar.'],
          chips: ['Categorías', '{{t:board_cat_suggestion}}, {{t:board_cat_bug}}, {{t:board_cat_question}} y {{t:board_cat_discussion}}, con cuántas publicaciones tiene cada una.'],
          chip: ['Una categoría', 'Tócala para ver solo esas.'],
          search: ['Buscar', '{{t:board_search}}'],
          status: ['{{t:board_status_label}}', '{{t:board_status_open}}, {{t:board_status_planned}}, {{t:board_status_progress}}, {{t:board_status_done}} o {{t:board_status_declined}}.'],
          sort: ['{{t:board_sort_top}} / {{t:board_sort_new}} / {{t:board_sort_active}}', 'Más votos, más nuevas o última respuesta.'],
          newbtn: ['{{t:board_new}}', 'Escribe una publicación.'],
          pinned: ['{{t:board_pinned}}', 'Siempre arriba.'],
          post: ['Una publicación', 'Haz clic para leerla entera con sus respuestas.'],
          vote: ['{{t:board_vote}}', 'Un voto cada uno. Toca otra vez para retirarlo.'],
          cat: ['Categoría', 'Qué tipo de publicación es.'],
          st: ['{{t:board_status_label}}', 'En qué punto está. Lo pone el equipo.'],
          meta: ['Quién y cuándo', 'El autor, cuándo y cuántas respuestas.']
        } },
        post: { title: 'Una publicación', spots: {
          vote: ['{{t:board_vote}}', 'Los votos ayudan a decidir qué viene después.'],
          title: ['La publicación', 'Su título y categoría.'],
          body: ['Entera', 'Todo lo que escribió el autor.'],
          actions: ['{{t:board_copy_link}}', 'Un enlace directo a esta publicación. Las tuyas también tienen Editar y Borrar.'],
          replies: ['Respuestas', 'Las más antiguas primero.'],
          reply: ['Una respuesta', 'Su autor y cuándo.'],
          form: ['Responder', 'Escribe una (con sesión iniciada).']
        } },
        new: { title: '{{t:board_new}}', spots: {
          cats: ['Categoría', 'Elige una.'],
          title: ['Título', '{{t:board_title_ph}}.'],
          body: ['Detalles', 'Opcional.'],
          foot: ['{{t:board_post}}', '{{t:board_public_note}}']
        } }
      },
      howto: {
        read: { title: 'Mira de qué se habla', slides: [
          'Elige una categoría.',
          'Ordena por votos, más nuevas o última respuesta.',
          'Abre una publicación.',
          'Lee las respuestas.'
        ] },
        post: { title: 'Publica algo', slides: [
          'Inicia sesión con Google.',
          'Pulsa {{t:board_new}}.',
          'Elige una categoría.',
          'Escribe un título (y detalles si quieres).',
          'Pulsa {{t:board_post}}.'
        ] },
        follow: { title: 'Vota y sigue la conversación', slides: [
          'Vota lo que más quieres.',
          'El estado muestra en qué punto está.',
          'Mira solo {{t:board_status_planned}} o {{t:board_status_done}}.',
          'Únete con una respuesta.'
        ] }
      },
      options: {
        list: { title: 'La lista', items: {
          cat: ['Categoría', 'Todas, o un tipo.'],
          status: ['{{t:board_status_label}}', 'Cualquiera, o uno.'],
          sort: ['{{t:board_sort}}', '{{t:board_sort_top}}, {{t:board_sort_new}} o {{t:board_sort_active}}.'],
          search: ['Buscar', 'Títulos, texto y nombres.']
        } },
        post: { title: 'En una publicación', items: {
          vote: ['{{t:board_vote}}', 'Uno por persona.'],
          link: ['{{t:board_copy_link}}', 'Comparte la publicación.'],
          reply: ['{{t:board_reply_btn}}', 'Con sesión iniciada.']
        } }
      },
      challenges: {
        'bd.cat': ['Elige una categoría', 'Los botones encima de la lista.'],
        'bd.sort': ['Ordena el foro de otra forma', '{{t:board_sort_new}} o {{t:board_sort_active}}.'],
        'bd.status': ['Filtra por estado', '{{t:board_status_all}}.'],
        'bd.search': ['Busca en el foro', '{{t:board_search}}'],
        'bd.open': ['Abre una publicación', 'Haz clic en una.'],
        'bd.new': ['Pulsa {{t:board_new}}', 'Arriba a la derecha.']
      },
      quiz: {
        q1: ['¿Qué necesitas para publicar o votar?',
          ['Nada', 'Iniciar sesión con Google', 'Una cuenta de Last.fm'],
          'Cualquiera puede leer el foro; publicar, responder y votar requieren iniciar sesión.'],
        q2: ['¿Qué te dice el estado de una publicación?',
          ['En qué punto está la idea o el fallo: planeada, en curso, hecha…', 'Cuánta gente la leyó', 'Cuándo se publicó'],
          'Lo pone el equipo, así ves lo que viene.'],
        q3: ['¿Qué se muestra con tu publicación?',
          ['Tu correo', 'Tu historial de escucha', 'Tu nombre y tu foto de perfil de Google'],
          'Se muestran tu nombre y tu foto. Tu correo nunca.']
      },
      tips: [
        'Filtra el {{t:nav_board}} por {{t:board_status_planned}} para ver lo que viene.',
        'Ordena el {{t:nav_board}} por {{t:board_sort_active}} para encontrar dónde se está hablando ahora.',
        '¿Tienes una idea? Publícala en el {{t:nav_board}} en {{t:board_cat_suggestion}}.'
      ]
    },
    settings: {
      title: '{{t:set_title}}',
      promise: 'Conecta lo que escuchas, decide cómo funcionan tus rankings, elige un aspecto y un idioma, e inicia sesión para que todo te siga en cada dispositivo.',
      scenes: {
        bar: { title: 'La barra superior', spots: {
          search: ['{{t:tb_search}}', 'Encuentra cualquier canción, artista o álbum de tu biblioteca. La tecla / también la abre.'],
          news: ['{{t:footer_changelog}}', 'Lo que cambió en la web desde tu última visita.'],
          sync: ['{{t:tooltip_sync_now}}', 'Trae tus reproducciones más nuevas de tu fuente.'],
          settings: ['{{t:set_title}}', 'Todo lo de esta lección.'],
          theme: ['{{t:set_theme}}', 'Doce temas de color.'],
          lang: ['{{t:set_language}}', 'English, Español, Português (BR) o Português (PT).'],
          signin: ['{{t:tb_sign_in}}', 'Con Google: tus ajustes, listas, valoraciones, premios y tu progreso en esta guía te siguen a cada dispositivo.']
        } },
        source: { title: '{{t:set_tab_source}}', spots: {
          search: ['{{t:set_search_ph}}', 'Escribe una palabra para ir directo a cualquier ajuste.'],
          tabs: ['Cuatro pestañas', '{{t:set_tab_source}}, {{t:set_tab_charts}}, {{t:set_tab_releases}} y {{t:set_tab_profile}}.'],
          cards: ['De dónde vienen tus reproducciones', 'Elige una de tres.'],
          sheets: ['Google Sheets', '{{t:set_card_sheets_note}}: tu propia hoja, que se llena desde Last.fm cada 90 minutos.'],
          lastfm: ['Last.fm', '{{t:set_card_lastfm_note}}: solo tu nombre de usuario.'],
          file: ['{{t:set_card_file_name}}', '{{t:set_card_file_note}}: un archivo con tus reproducciones, sin cuenta.'],
          url: ['{{t:set_sheet_url}}', 'Pega el enlace de tu hoja. El botón de la plantilla te hace una copia.'],
          tab: ['{{t:set_sheet_tab}}', 'La pestaña que tiene tus reproducciones.'],
          auto: ['{{t:set_adv_summary}}', 'Paso a paso, con imágenes, para una hoja que se llena sola.'],
          account: ['{{t:set_lfm_account}}', '{{t:set_lfm_hint_idle}}'],
          connect: ['Conectar', 'Abre Last.fm para aprobarlo. Solo dice conectado cuando Last.fm lo ha aceptado.'],
          close: ['Cerrar', 'Cuando algo hay que guardarlo, aquí aparece {{t:set_save_load}}.']
        } },
        lastfm: { title: 'Last.fm', spots: {
          card: ['Last.fm', 'La forma más rápida de empezar.'],
          user: ['{{t:set_lfm_user}}', '{{t:set_lfm_hint}}'],
          dirty: ['{{t:set_unsaved}}', 'Aparece mientras un cambio no está guardado.'],
          save: ['{{t:set_save_load}}', 'Lo guarda y carga tus reproducciones.']
        } },
        file: { title: '{{t:set_card_file_name}}', spots: {
          card: ['{{t:set_card_file_name}}', 'Para echar un vistazo una vez, sin cuenta.'],
          drop: ['{{t:set_drop}}', 'Una exportación de Last.fm o un CSV con tus reproducciones.']
        } },
        charts: { title: '{{t:set_tab_charts}}', spots: {
          tab: ['{{t:set_tab_charts}}', 'Cómo funcionan tus rankings.'],
          week: ['{{t:set_week_label}}', '{{t:set_week_hint}}'],
          svc: ['{{t:set_ms_label}}', '{{t:set_ms_hint}}.'],
          sections: ['{{t:set_cp_title}}', 'Activa o desactiva {{t:set_cp_tm}}, {{t:set_cp_stats}} y {{t:set_cp_cert}}.'],
          stats: ['{{t:set_cp_stats}}', '{{t:set_cp_stats_note}}'],
          events: ['{{t:set_events_title}}', 'Cuántos de tus artistas top sigue {{t:nav_events}}.'],
          d100: ['{{t:d100_auto}}', 'Tu semana va sola a {{t:nav_dank100}} (con sesión iniciada).'],
          anim: ['{{t:set_anim}}', 'Los rankings repiten sus movimientos cada vez que se abren.'],
          split: ['{{t:set_nosplit}}', '{{t:set_nosplit_note}}'],
          credit: ['{{t:set_credit}}', 'Una colaboración también cuenta en tus premios.']
        } },
        releases: { title: '{{t:set_tab_releases}}', spots: {
          tab: ['{{t:set_tab_releases}}', 'Singles, EPs y certificaciones.'],
          detect: ['{{t:rtd_setting}}', 'Marca singles, EPs, discos en directo y bandas sonoras por su título y por Deezer.'],
          album: ['{{t:set_cert_title}}', 'Las reproducciones que necesita un álbum para {{t:set_cert_gold}}, {{t:set_cert_plat}} y {{t:set_cert_diamond}}.'],
          song: ['{{t:ig_type_songs}}', 'Y una canción.'],
          single: ['{{t:rtype_single_plural}}', 'Los singles tienen las suyas.'],
          ep: ['{{t:rtype_ep_plural}}', 'Y los EPs.'],
          reset: ['{{t:set_cert_reset}}', 'Vuelve a los números de siempre.'],
          rollup: ['{{t:rollup_label}}', 'Las reproducciones de un single también cuentan para su álbum.']
        } },
        profile: { title: '{{t:set_tab_profile}}', spots: {
          tab: ['{{t:set_tab_profile}}', 'Tú, el aspecto y tus copias de seguridad.'],
          name: ['{{t:set_display_name}}', 'Se muestra en la página y en la pestaña del navegador.'],
          tz: ['{{t:set_timezone}}', '{{t:set_timezone_hint}}'],
          themes: ['{{t:set_theme}}', 'Doce temas, oscuros y claros.'],
          theme: ['Tu tema', 'El que usas ahora.'],
          lang: ['{{t:set_language}}', 'Toda la web, esta guía también.'],
          backups: ['{{t:set_backups}}', 'Con sesión iniciada, se guarda una copia en tu cuenta cada día. Recupera la que quieras.'],
          dl: ['{{t:set_backup_download}}', 'Un archivo que guardas tú. Lleva tus claves de API, así que guárdalo en privado.'],
          restore: ['{{t:set_backup_restore_file}}', 'Recupera un archivo de copia.']
        } },
        search: { title: 'Busca un ajuste', spots: {
          search: ['{{t:set_search_ph}}', 'Escribe lo que buscas.'],
          results: ['Resultados', 'Cada ajuste con esa palabra, y su pestaña.'],
          result: ['Un resultado', 'Haz clic para ir directo.']
        } },
        theme: { title: '{{t:set_theme}}', spots: {
          btn: ['{{t:set_theme}}', 'El punto muestra tu color.'],
          panel: ['Doce temas', 'Seis colores, cada uno oscuro y claro.'],
          on: ['El tuyo', 'El que usas ahora.']
        } },
        lang: { title: '{{t:set_language}}', spots: {
          btn: ['{{t:set_language}}', 'Muestra el código de tu idioma.'],
          panel: ['Cuatro idiomas', 'Toda la web cambia a la vez.'],
          on: ['El tuyo', 'El que usas ahora.']
        } },
        acct: { title: 'Tu cuenta', spots: {
          btn: ['Tu foto', 'Abre el menú de tu cuenta.'],
          dot: ['Novedad', 'Hay algo nuevo en {{t:nt_title}}.'],
          name: ['Tú', 'La cuenta de Google con la que entraste.'],
          nt: ['{{t:nt_title}}', 'Con cuántas son nuevas.'],
          out: ['{{t:tb_sign_out}}', 'Este dispositivo deja de sincronizar. Tus datos siguen en tu cuenta.']
        } },
        nt: { title: '{{t:nt_title}}', spots: {
          tabs: ['Todas / No leídas', 'Todo, o solo lo nuevo.'],
          group: ['Por día', 'Hoy, ayer, antes.'],
          row: ['Una notificación', 'Haz clic para ir allí: una lista nueva, una certificación, una respuesta, la banda sonora de tu mes, un récord.'],
          tile: ['De qué tipo', 'Su color y su icono.'],
          cat: ['Tipo y hora', 'Lista, certificación, foro, banda sonora, récord.'],
          dismiss: ['✕', 'Quita solo esta.'],
          foot: ['{{t:nt_clear}} / {{t:nt_read_all}}', 'Borrar todo pregunta antes.'],
          close: ['Cerrar', 'Esc hace lo mismo.']
        } }
      },
      howto: {
        connect: { title: 'Conecta lo que escuchas', slides: [
          'Abre {{t:set_title}}.',
          'Elige de dónde vienen tus reproducciones.',
          'Google Sheets: pega el enlace de tu hoja.',
          'Last.fm: escribe tu usuario.',
          'O suelta un archivo.',
          'Pulsa {{t:set_save_load}}.'
        ] },
        tune: { title: 'Haz los rankings a tu manera', slides: [
          'El día en que empiezan tus semanas.',
          'Tu zona horaria: cuándo empiezan los días.',
          'Qué secciones muestran las páginas de rankings.',
          'Cuántas reproducciones hacen falta para una certificación.',
          '¿No encuentras algo? Búscalo.'
        ] },
        look: { title: 'Elige un aspecto y un idioma', slides: [
          'El punto de color en la barra superior.',
          'Doce temas, oscuros y claros.',
          'El globo: tu idioma.',
          'Cuatro idiomas.',
          'Los dos están también en {{t:set_tab_profile}}.'
        ] },
        account: { title: 'Inicia sesión y protégelo', slides: [
          'Inicia sesión con Google.',
          'Tu foto abre tu menú.',
          '{{t:nt_title}}: lo que pasó mientras no estabas.',
          'Haz clic en una para ir allí.',
          'Copias de seguridad: una cada día, y un archivo que puedes guardar.'
        ] }
      },
      options: {
        source: { title: '{{t:set_tab_source}}', items: {
          sheets: ['Google Sheets', 'Tu propia hoja, siempre al día.'],
          lastfm: ['Last.fm', 'Tu usuario.'],
          file: ['{{t:set_card_file_name}}', 'Un archivo, una vez.'],
          connect: ['{{t:set_lfm_account}}', 'Añade y edita reproducciones aquí.']
        } },
        charts: { title: '{{t:set_tab_charts}}', items: {
          week: ['{{t:set_week_label}}', 'Cualquier día.'],
          svc: ['{{t:set_ms_label}}', 'Spotify, Apple Music o Deezer.'],
          sections: ['{{t:set_cp_title}}', 'Cada una activada o no.'],
          events: ['{{t:set_events_title}}', 'Tus 10 a 200 artistas top.'],
          d100: ['{{t:d100_auto}}', 'Con sesión iniciada.'],
          anim: ['{{t:set_anim}}', 'Cada vez.'],
          split: ['{{t:set_nosplit}}', 'Para nombres «A, B».'],
          credit: ['{{t:set_credit}}', 'Las colaboraciones cuentan en premios.']
        } },
        releases: { title: '{{t:set_tab_releases}}', items: {
          detect: ['{{t:rtd_setting}}', 'Títulos y Deezer.'],
          apart: ['{{t:rtype_sep_singles}}', '{{t:rtype_sep_with}} o {{t:rtype_sep_apart}}; los EPs igual.'],
          rollup: ['{{t:rollup_label}}', '{{t:rollup_off}}, {{t:rollup_modal}} o {{t:rollup_charts}}.'],
          cert: ['{{t:set_cert_title}}', 'Para álbumes, canciones, singles y EPs.']
        } },
        profile: { title: '{{t:set_tab_profile}}', items: {
          name: ['{{t:set_display_name}}', 'Tu nombre en la página.'],
          tz: ['{{t:set_timezone}}', 'La de este ordenador, hasta que la cambies.'],
          theme: ['{{t:set_theme}}', 'Doce.'],
          lang: ['{{t:set_language}}', 'Cuatro.'],
          backups: ['{{t:set_backups}}', 'A diario en tu cuenta; un archivo cuando quieras.']
        } }
      },
      challenges: {
        'set.open': ['Abre {{t:set_title}}', 'El engranaje de la barra superior.'],
        'set.tab': ['Abre otra pestaña de {{t:set_title}}', '{{t:set_tab_charts}}, {{t:set_tab_releases}} o {{t:set_tab_profile}}.'],
        'set.search': ['Busca en los ajustes', '{{t:set_search_ph}}'],
        'set.theme': ['Prueba un tema', 'El punto de color en la barra superior.'],
        'set.lang': ['Cambia el idioma', 'El globo de la barra superior. (Vuelve igual.)'],
        'set.backup': ['{{t:set_backup_download}}', '{{t:set_title}} → {{t:set_tab_profile}}.'],
        'set.nt': ['Abre {{t:nt_title}}', 'Tu foto en la barra superior (con sesión iniciada).']
      },
      quiz: {
        q1: ['¿Qué fuente de datos no necesita ninguna cuenta?',
          ['Google Sheets', 'Last.fm', '{{t:set_card_file_name}}'],
          'Sube un archivo con tus reproducciones y tus rankings se hacen con él, sin registrarte en ningún sitio.'],
        q2: ['¿Qué hace iniciar sesión con Google?',
          ['Tus ajustes, listas, valoraciones, premios y progreso de la guía te siguen a cada dispositivo', 'Hace públicos tus rankings', 'Hace falta para ver cualquier ranking'],
          'Tus rankings funcionan sin ello; iniciar sesión lo mantiene todo igual en cada dispositivo, con copias diarias.'],
        q3: ['Quieres que tus semanas empiecen el lunes. ¿Dónde se cambia?',
          ['{{t:set_tab_profile}}', '{{t:set_tab_charts}} → {{t:set_week_label}}', 'La barra de fechas'],
          'Es el primer ajuste de la pestaña {{t:set_tab_charts}}, y rehace todas las semanas a la vez.']
      },
      tips: [
        '¿No encuentras un ajuste? Escribe una palabra en {{t:set_search_ph}} y ve directo.',
        'Doce temas: prueba uno claro de día.',
        'Descarga de vez en cuando un archivo de copia desde {{t:set_title}} → {{t:set_tab_profile}}.',
        'Con sesión iniciada, tu foto muestra un punto cuando hay algo nuevo en {{t:nt_title}}.'
      ]
    }
  }
};
