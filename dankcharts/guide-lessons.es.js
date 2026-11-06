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
