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
    area: { charts: 'Tus rankings', insights: 'Estadísticas, récords y premios', more: 'Más pestañas', setup: 'Ajustes' },
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
    ref_note: 'Comprobaciones, tus datos, preguntas frecuentes, glosario y atajos. Tendrán el nuevo diseño en una próxima actualización.'
  },

  lessons: {
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

    periods: { title: 'Rankings Mensual y Anual', promise: 'Rankings de fin de año de cualquier año, y meses que muestran lo que de verdad se quedó.' },
    daily: { title: 'Tu ranking Diario', promise: 'Un día cada vez: tus canciones del día, tus costumbres y recuerdos del mismo día.' },
    alltime: { title: 'Histórico y viajes en el tiempo', promise: 'Tus canciones más escuchadas de siempre, y cómo estaba el ranking cualquier día.' },
    around: { title: 'Alrededor del ranking y compartirlo', promise: 'Aspirantes, Fuera del Ranking, Nuevas Entradas, imágenes, PDF y playlists.' },
    windows: { title: 'Ventanas de canción, artista y álbum', promise: 'Todo sobre una canción, un artista o un álbum, y cómo encontrarlo rápido.' },
    stats: { title: 'Estadísticas', promise: 'Resumen, Historia, Gráficas, Comparar y Juegos para cualquier rango de fechas.' },
    records: { title: 'Récords', promise: 'Tu libro de récords: números uno, debuts, certificaciones, rachas y más.' },
    awards: { title: 'Premios', promise: 'Tu propia gala de premios, de los nominados a la ceremonia.' },
    soundtrack: { title: 'Tu Banda Sonora', promise: 'Un mes, un año o desde siempre, contado en capítulos.' },
    dank100: { title: 'The Dank 100', promise: 'Los rankings semanales de todos, sumados en uno.' },
    ratings: { title: 'Valoraciones', promise: 'Puntúa álbumes y canciones, y descubre tu lado crítico.' },
    events: { title: 'Eventos', promise: 'Cumpleaños, aniversarios, lanzamientos y la Máquina del Tiempo.' },
    playlists: { title: 'Listas de reproducción', promise: 'Guarda rankings como listas, y deja que se hagan solas.' },
    rawdata: { title: 'Base de datos', promise: 'Cada escucha: búscala, corrígela, expórtala.' },
    board: { title: 'El Foro', promise: 'Propón ideas, informa de fallos y vota.' },
    settings: { title: 'Ajustes y tu cuenta', promise: 'Fuentes de datos, ajustes de rankings, temas, inicio de sesión y copias de seguridad.' }
  }
};
