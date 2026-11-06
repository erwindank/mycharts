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
