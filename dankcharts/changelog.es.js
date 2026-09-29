/* ===========================================================================
   CHANGELOG - SPANISH
   ===========================================================================
   Translations of every entry in changelog.js, keyed by the English title.
   Fetched only when the What's New overlay is opened in this language (see
   dcClEnsureLang() in app.js). An entry missing here shows in English.

   Each value is [title, detail]. Keep the key byte-for-byte identical to the
   English title in changelog.js - curly apostrophes and all - or the entry
   silently falls back to English. After editing, bump DC_CL_I18N_V in
   changelog.js so browsers fetch the new copy.
   =========================================================================== */

window.DC_CHANGELOG_I18N = window.DC_CHANGELOG_I18N || {};
window.DC_CHANGELOG_I18N['es'] = {

  /* ========== SEPTIEMBRE 2026 ========== */

  'Easier-to-read gold in the light themes':
    ['Dorado más fácil de leer en los temas claros',
     'En los temas claros, el dorado brillante del selector de nominados casi no se veía sobre el fondo blanco: la línea del año y la categoría arriba, los números de posición de tus nominados y las marcas de las filas elegidas. Ahora usan un dorado más profundo que se lee fácilmente, y el rojo de los botones para quitar también es más oscuro. Las insignias de Ganó en los premios reales y el botón Compartir de la ceremonia recibieron el mismo arreglo. Los temas oscuros se ven igual que antes.'],

  'A roomier nominee picker':
    ['Un selector de nominados más espacioso',
     'La ventana donde eliges los nominados de un premio tiene más espacio. Tus nominados elegidos ahora están en su propio panel de Nominados arriba, como tarjetas iguales en dos columnas, cada una con una imagen más grande y el nombre y el artista en líneas separadas, así que los títulos largos ya no se cortan a las pocas letras. Una lista completa de 8 cabe sin desplazarse. Rellenar top 8, Top 5 y Borrar se movieron a ese panel, junto a un contador de cuántos llevas elegidos. Arrastra las tarjetas para reordenarlas, como antes. En el teléfono las tarjetas se apilan en una columna.'],

  'Break ties in the automatic awards yourself':
    ['Desempata tú mismo los premios automáticos',
     'Cuando un premio automático como Canción Más Escuchada o Racha Diaria Más Larga termina en empate, la tarjeta del premio ahora muestra todo lo empatado en primer lugar debajo del ganador. Haz clic en uno para convertirlo en el ganador, y cambia de opinión cuantas veces quieras. Tu elección se mantiene al volver a generar los premios, siempre que ese elemento siga empatado en primer lugar. Antes, el premio se lo llevaba sin avisar el elemento empatado que apareciera primero. Los años generados antes de este cambio necesitan volver a Generar para que se vean sus empates.'],

  'See and hear every nominee while you pick them':
    ['Ve y escucha a cada nominado mientras los eliges',
     'Al elegir nominados para cualquier premio, cada fila y cada nominado elegido muestra ahora la carátula de la canción, la portada del álbum o la foto del artista, para que la lista se entienda de un vistazo. Las imágenes se cargan a medida que aparecen al desplazarte. Todas las categorías excepto Vídeo del Año tienen además un botón ♪ que reproduce una muestra de 30 segundos y un botón de YouTube que abre una búsqueda en una pestaña nueva. Para un artista, la muestra es una de sus canciones más conocidas. Pulsar cualquiera de los dos botones no nomina nada; pulsar la fila sí. Vídeo del Año conserva su propio botón de vídeo.'],

  'Compare album covers at a glance when picking Best Album Cover':
    ['Compara las portadas de un vistazo al elegir la Mejor Portada de Álbum',
     'El selector de Mejor Portada de Álbum ahora muestra una portada pequeña junto a cada álbum, para que puedas compararlas sin abrir cada una. El botón ⤢ de una fila muestra esa portada lo más grande que cabe en el selector. Pulsar ⤢ no nomina el álbum; pulsar la fila sí. Mejor Concepto de Álbum conserva su botón i con la reseña y la lista de canciones.'],

  'See what an album is about when picking Best Album Concept':
    ['Descubre de qué va un álbum al elegir el Mejor Concepto de Álbum',
     'Al elegir nominados para Mejor Concepto de Álbum, cada álbum tiene un botón i. Muestra la portada en grande, la breve reseña del álbum en Last.fm, que suele explicar su historia o su tema, y la lista de canciones con cuántas veces escuchaste cada una ese año. Las canciones que escuchaste y no están en la lista estándar, como los temas extra, aparecen al final. Pulsar i no nomina el álbum; pulsar la fila sí.'],

  'Watch a bit of each video when picking Video of the Year':
    ['Mira un poco de cada vídeo al elegir el Vídeo del Año',
     'Al elegir nominados para Vídeo del Año, cada canción tiene un botón ▶. Busca el videoclip en YouTube y lo reproduce en una ventanita en la parte de arriba del selector, para que recuerdes cómo es el vídeo antes de nominarlo. Pulsar ▶ no nomina la canción; pulsar la fila sí. Pulsa ■ o ✕ para cerrar el vídeo, y si YouTube encontró el que no era, un enlace abre la búsqueda en YouTube.'],

  'The setup guide is now fully in Spanish and Portuguese':
    ['La guía de configuración ya está entera en español y portugués',
     'En la guía de configuración antes solo cambiaba el menú de idioma; cada paso, consejo y respuesta de solución de problemas se quedaba en inglés. Ahora toda la guía sigue el idioma que elijas, en español, portugués de Brasil y portugués europeo, incluidos los botones y el progreso del paso a paso. Los menús y botones de Google se nombran tal como Google los muestra en tu idioma. Los botones de la ventana de Ajustes de dankcharts conservan su nombre en inglés, porque esa ventana sigue en inglés.'],

  'Albums, Singles, EPs and All now keep their side charts in step':
    ['Álbumes, Sencillos, EP y Todo ya llevan sus secciones laterales al mismo paso',
     'Con los sencillos o los EP en sus propios charts, Fuera del Ranking podía mostrar un lanzamiento que seguía en el chart, porque contaba la semana sin las reproducciones que un sencillo le presta a su álbum. Fuera del Ranking, Casi en el Top, Nuevas Entradas, las etiquetas PEAK, la animación del chart y las casillas del recorrido ya cuentan igual que el chart de arriba. En la vista Todo siguen al chart combinado, y en Álbumes, Sencillos o EP cada una sigue el suyo. Las canciones sin álbum tampoco ocupan ya puestos ocultos en el chart de álbumes de la semana pasada.'],

  'Switching phones no longer wipes your nominations':
    ['Cambiar de teléfono ya no borra tus nominaciones',
     'Un teléfono que se había quedado abierto con una copia antigua de tus premios guardaba esa copia vieja encima de los nominados que habías elegido después en otro teléfono. Ahora cada guardado busca primero cambios más recientes, los conserva y añade los tuyos encima. La página de premios también se pone al día con tus otros dispositivos cuando vuelves a la app.'],

  'Backups you can restore from Settings':
    ['Copias de seguridad que puedes restaurar desde Ajustes',
     'Tus ajustes, premios y valoraciones se copian en tu cuenta una vez al día, y los premios también cada vez que otro dispositivo los cambia. Ajustes → Perfil muestra las últimas 30 copias, y cualquiera se puede restaurar en todos tus dispositivos con un clic. También puedes hacer una copia a mano, o descargar un archivo de copia para guardarlo tú, por ejemplo en Google Drive.'],

  'Clearer record cards in the awards summary':
    ['Tarjetas de récords más claras en el resumen de premios',
     'Las tarjetas de más nominaciones y más victorias de todos los tiempos ahora se leen como una carrera: el poseedor del récord arriba con una cifra más grande, y debajo los perseguidores en sus propias filas numeradas, con una barra que muestra lo cerca que se quedaron, en un texto más grande y más brillante. En canciones y álbumes también aparece el artista junto a cada perseguidor. La flechita bajo el selector de año ahora solo aparece al pasar el ratón.'],

  'Jump straight to any year on the awards page':
    ['Salta directamente a cualquier año en la página de premios',
     'Haz clic en el año para abrir una cuadrícula de años y elegir uno, en lugar de avanzar de uno en uno con las flechas. Mis Grammys llega hasta el año de tu primera reproducción, y las flechas se atenúan en los extremos. Premios Reales tiene el mismo selector, hasta la primera ceremonia en 1959. La lista de nominaciones del resumen de premios también escribe “nominaciones” completo en vez de “nom.”.'],

  'Fresher year picker and buttons on the awards page':
    ['Selector de año y botones renovados en la página de premios',
     'El año y sus flechas ahora van juntos en un solo control redondeado con chevrones limpios, tanto en Mis Grammys como en Premios Reales. Configurar Año es un botón claro con contorno y un icono de ajustes, y Generar Nominados es un botón sólido del color de tu tema, con un icono de destello y un brillo suave.'],

  'Easier-to-read nominations list in the awards summary':
    ['Lista de nominaciones más fácil de leer en el resumen de premios',
     'En la lista “Más nominaciones” la barra ahora va justo debajo del nombre de cada artista, así que los números ya no quedan aislados al otro lado de un hueco vacío. El número de nominaciones es más grande y en negrita, y las victorias se muestran como una píldora dorada con un trofeo.'],

  'Records tab works again for libraries with compilations':
    ['La pestaña Récords vuelve a funcionar en bibliotecas con recopilatorios',
     'En algunas bibliotecas la pestaña Récords se quedaba vacía y solo pedía cargar tus datos. Pasaba cuando un sencillo que escuchaste cuenta para un recopilatorio de Varios Artistas: el cálculo tropezaba con ese álbum y se detenía antes de mostrar ningún récord. Los recopilatorios ahora se preparan bien en ambos casos, así que todas las secciones de récords vuelven a llenarse.'],

  'Send any playlist to Soundiiz as text':
    ['Envía cualquier lista a Soundiiz como texto',
     'La ventana Añadir a lista ahora tiene una opción Copiar como texto para Soundiiz debajo de Nueva lista. Abre la misma ventana Exportar lista que usan los charts, rellena con esas canciones: una línea Artista - Título por canción para copiar (con el álbum si quieres), un .txt o .csv para descargar, nombres de lista sugeridos para copiar y los pasos para importarla en Soundiiz, que luego crea la lista en Spotify, Apple Music, YouTube Music, Deezer y más. Funciona desde todos los botones ♫ Lista de la app, incluido el nuevo de las categorías de Mis Grammys, para que los nominados de una categoría vayan directos a tu servicio de streaming. Copiar un nombre sugerido que lleva apóstrofo ahora también funciona bien.'],

  'Make a playlist of a category’s nominees':
    ['Crea una lista con los nominados de una categoría',
     'Cada categoría de Mis Grammys con nominados tiene ahora un botón ♫ Lista junto a Cambiar. Mete a todos los candidatos en una lista, nueva o existente, para que puedas escucharlos antes de coronar a un ganador. Un nominado que es una canción se añade a sí mismo. Un álbum añade todas las canciones suyas que escuchaste en el periodo de elegibilidad de ese año, de la más escuchada a la menos. Un artista añade sus cinco canciones más escuchadas del periodo. Las categorías que se otorgan solas no tienen el botón, porque no hay nada que decidir. Funciona igual con bibliotecas de Last.fm, Google Sheets y CSV.'],

  'Award credit for collaborating artists, now in Settings too':
    ['Crédito de premios para artistas colaboradores, ahora también en Ajustes',
     'El interruptor que hace que las nominaciones y victorias de Mis Grammys cuenten para todos los que aparecen en una grabación ahora también está en Ajustes, en Charts → Comportamiento, como Los premios cuentan para artistas invitados y colaboradores. Antes solo estaba en Configurar Año, donde era fácil pasarlo por alto. Los dos interruptores van sincronizados y se aplican al instante. Con él activado, las colaboraciones escritas con &, x, and o vs (como Lady Gaga & Bruno Mars) ahora también dan crédito a cada artista. Solo ocurre cuando todos los nombres del crédito son también artistas propios de tu biblioteca, así que dúos como Simon & Garfunkel siguen contando como un solo acto.'],

  'The ceremony’s final stats show who won the most':
    ['Las estadísticas finales de la ceremonia muestran quién ganó más',
     'Al final de la ceremonia los resultados ya se conocen, así que las estadísticas finales ahora terminan con Más victorias del año en lugar de un ranking de nominaciones. Cada artista que ganó tiene su propio bloque con su foto, su número de victorias y nominaciones y todos los premios que se llevó: un trofeo, la portada de la canción o del álbum (o la foto del artista en los premios de artista), el nombre de la canción o del álbum y el nombre del premio. Cuando se cuentan los artistas invitados, una victoria como invitado también nombra al artista principal. Los enlaces compartidos de la ceremonia lo muestran después de pulsar Actualizar enlace. El ranking de nominaciones de la página de Mis Grammys también se alinea bien ahora: las barras empezaban en un punto distinto en las filas con y sin trofeos.'],

  'Final stats at the end of the ceremony, and credit for featured artists':
    ['Estadísticas finales al terminar la ceremonia, y crédito para los artistas invitados',
     'El repaso final de la ceremonia ahora termina con Estadísticas finales y récords: los líderes de todos los tiempos en nominaciones y victorias con los resultados de este año incluidos, y el ranking final de nominaciones del año con las victorias de cada artista. Cualquier récord que cambió de manos durante la ceremonia se marca como Nuevo. Los enlaces compartidos de la ceremonia también lo incluyen después de pulsar Actualizar enlace. Un nuevo interruptor Contar artistas invitados en Configurar Año hace que una nominación o victoria cuente para todos los que aparecen en ella, no solo para el artista principal. Lee los invitados del nombre del artista (feat., ft., featuring, with o una lista con comas) y del título de la canción, como en (feat. A & B). Los dúos escritos con & siguen siendo un solo acto. Se aplica a las estadísticas y récords de todos los años y al recuento de Grammys de las páginas de artista, y se sincroniza entre tus dispositivos. Funciona igual con bibliotecas de Last.fm, Google Sheets y CSV.'],

  'Stats & records at the top of every My Grammys year':
    ['Estadísticas y récords al principio de cada año de Mis Grammys',
     'Cada año de Mis Grammys ahora empieza con un resumen encima de los nominados. Muestra los líderes de todos los tiempos en nominaciones y en victorias para artistas, álbumes y canciones, contados hasta ese año, así que volver a un año anterior muestra los récords tal como estaban entonces, con los dos siguientes debajo de cada líder. Debajo está el ranking del año con los artistas con más nominaciones, con sus victorias. Cada poseedor de récord y cada artista del ranking lleva su foto o portada. La ceremonia se abre con el mismo resumen como primera diapositiva, antes de la primera categoría. Ahí omite las victorias de este año y las categorías que se otorgan solas, para no desvelar nada antes de abrir un sobre. Los enlaces compartidos de la ceremonia también llevan el resumen. A un artista se le cuentan sus canciones y álbumes además de las categorías de artista. Funciona igual con bibliotecas de Last.fm, Google Sheets y CSV.'],

  'Share your awards ceremony with a link':
    ['Comparte tu ceremonia de premios con un enlace',
     'Hay un nuevo botón Compartir junto a Ver ceremonia. Crea un enlace que cualquiera puede abrir para ver tu ceremonia — los nominados con sus portadas, los sobres cerrados, la revelación de ganadores con fragmentos de las canciones y el repaso final — sin cuenta y sin datos musicales propios. Tu nombre aparece si has puesto un nombre visible. Solo se comparte la ceremonia: los nominados, los ganadores y sus imágenes, nada más de tu biblioteca. El enlace es una instantánea, así que después de cambiar nominados o ganadores pulsa Actualizar enlace, y el enlace que ya enviaste muestra la nueva versión. Dejar de compartir lo retira para todos. Crear un enlace requiere iniciar sesión con Google, para que solo tú puedas actualizarlo o quitarlo. Funciona igual con bibliotecas de Last.fm, Google Sheets y CSV.'],

  'Share Your Soundtrack rebuilt on the same five-design system':
    ['Compartir Tu Soundtrack, rehecho con el mismo sistema de cinco diseños',
     'La tarjeta para compartir el Soundtrack era la última que seguía con la receta antigua: un único diseño fijo de 360 píxeles, todo en la pequeña fuente monoespaciada, un índigo fijo que ignoraba el tema que estuvieras usando, ninguna imagen y — en la versión alta — un tercio de la imagen vacío bajo la última canción. Ahora funciona exactamente igual que las imágenes del chart, del recorrido y de una entrada. Elige un diseño: Recap (una cabecera sobre los bloques de estadísticas con los dos top cinco debajo, uno al lado del otro en formato cuadrado), Wrapped (tu artista n.º 1 como un gran retrato redondo con su número de reproducciones, y luego las canciones), Collage (solo caras y portadas, en orden), Minimal (sin imágenes, los números mandan) o Poster (tu artista n.º 1 desenfocado detrás de toda la tarjeta). Elige una paleta: Tema de la app sigue el tema que tengas puesto, Onyx, Aurora, Ember, Bloom, Moss y Paper se quedan fijas, y Portada lee los colores de las imágenes y construye la tarjeta con ellos. Elige una forma: Post 1:1, Retrato 4:5 o Historia 9:16. Artistas y canciones ahora llevan sus imágenes, obtenidas de Deezer, iTunes, Last.fm o YouTube, y las listas se estiran para llenar la tarjeta en vez de quedarse a medias. Los nuevos descubrimientos y tu día récord se suman a reproducciones, días activos y artistas en la fila de estadísticas; puedes mostrar u ocultar cualquiera, elegir entre tres y diez entradas y ajustar un único control de tamaño de texto. Todo está ahora en una ventana de vista previa como es debido, con los botones Copiar y Compartir junto a Descargar.'],

  'The Soundtrack image is four times the resolution':
    ['La imagen del Soundtrack tiene cuatro veces más resolución',
     'Antes se dibujaba a 360 píxeles y se duplicaba al exportarla, y por eso el texto se veía borroso en cuanto se abría en un teléfono. Ahora se maqueta a 1080 completos y se exporta a 2160 por defecto, con una opción Estándar si prefieres un archivo más pequeño. Las imágenes se piden al mayor tamaño que ofrece cada tienda, y se da tiempo a que carguen las fuentes antes de sacar la imagen.'],

  'Share images rebuilt: twelve designs, eight palettes, three shapes':
    ['Imágenes para compartir rehechas: doce diseños, ocho paletas, tres formatos',
     'Las imágenes para compartir se habían convertido en un diseño rígido por tarjeta con un muro de controles deslizantes pegado al lado — once para un chart, otros once para una entrada — y todas salían iguales: una barra de cabecera con degradado, filas a rayas, texto diminuto y muchas cajas. Los tres tipos de tarjeta se han rediseñado desde cero y ahora empiezas eligiendo un diseño en lugar de ajustar un tamaño. Un chart puede ser Editorial (una cabecera de revista sobre filas aireadas con líneas finas), Minimal (solo texto, sin imágenes, el máximo aire), Spotlight (el n.º 1 en grande con su portada y el resto debajo), Grid (solo portadas, en orden, dimensionadas para llenar la tarjeta) o Poster (la portada del n.º 1 desenfocada detrás de todo). Un recorrido puede ser Timeline — el recorrido dibujado como una línea real de posición a lo largo del tiempo, con el pico marcado en dorado y los huecos como huecos, para que un reingreso no parezca una racha continua —, Chips (las casillas de antes, reajustadas) o una Ficha de estadísticas. Una sola entrada puede ser Cover (la portada a sangre con la posición en grande en la parte inferior), Split, Frame o Ticket. Junto al diseño hay una paleta: Tema de la app sigue el tema que tengas, luego Onyx, Aurora, Ember, Bloom, Moss y Paper se quedan fijas sea cual sea el tema de la app, y Portada lee los colores de la propia imagen y construye la tarjeta a su alrededor. Hay un nuevo tamaño Retrato 4:5 junto a Post e Historia, porque 4:5 es el formato más alto que conserva una publicación del feed. Todo lo demás que se podía ajustar sigue ahí — qué mostrar y qué ocultar, de qué tienda vienen las imágenes, cuántas entradas, y un único control de Tamaño de texto en lugar de los deslizantes de antes — y el panel del recorrido ha ganado los botones Copiar y Compartir, igual que el del chart.'],

  'Shared images are four times the resolution':
    ['Las imágenes compartidas tienen cuatro veces más resolución',
     'Las tarjetas se maquetaban a 540 píxeles de ancho y se duplicaban al exportarlas, lo que ponía una imagen de 1080 px en Instagram y dejaba el texto borroso en cuanto se ampliaba algo. Ahora se maquetan a 1080 completos y se exportan a 2160 por defecto, con una opción Estándar si quieres un archivo más pequeño. Las portadas se piden al mayor tamaño que ofrece cada tienda en lugar de la miniatura de 300 px que devuelve la búsqueda, así que aguantan el tamaño mayor, y se da tiempo a que carguen las fuentes antes de sacar la imagen para que nada salga con una tipografía de reserva.'],

  'New My Grammys category: Best Album Concept':
    ['Nueva categoría en Mis Grammys: Mejor Concepto de Álbum',
     'Mejor Portada de Álbum ya te permitía premiar la carátula; no había nada para el disco que hay detrás — el álbum construido como una sola idea y no como un conjunto de canciones. Mejor Concepto de Álbum es una nueva categoría de álbum en la papeleta de Mis Grammys, desactivada por defecto como las demás opcionales, así que actívala en la lista de categorías de un año y aparecerá con todos los candidatos para elegir y su propia diapositiva en la ceremonia. Cualquier álbum que escuchaste en el periodo de elegibilidad de ese año puede ser nominado.'],

  'Remixes and stylised artist names find their preview again':
    ['Los remixes y los nombres de artista estilizados vuelven a encontrar su fragmento',
     'Comprobar que un fragmento era de verdad la grabación correcta evitó que la ceremonia reprodujera la canción equivocada, pero también la dejó en silencio con temas que sí debía encontrar. JOYRIDE. - Revved Up Remix de Kesha mostraba “no se encontró fragmento” aunque el remix está disponible en streaming: la tienda lo tiene como “Ke$ha”, y al quitar el signo de dólar quedaba un nombre que no coincidía con nada. Las grafías estilizadas ahora se leen como las letras que representan, así que Ke$ha, P!nk, A$AP y MØ coinciden con los nombres que tienes. La búsqueda también se rinde menos fácilmente. Las dos tiendas filtran por cada palabra que reciben, así que el nombre de un remix que no conocen no devuelve nada en absoluto, ni siquiera la canción a la que pertenece — ahora la búsqueda quita la versión y luego los créditos de invitados hasta que aparece algo, lo que encuentra la grabación original cuando un remix concreto de verdad no está. El nombre de la grabación se muestra siempre que no sea exactamente el título del propio nominado, para que nunca se cuele un sustituto en silencio, y los créditos ahora se comparan como un conjunto de nombres, así que gana la edición que lista a todos los artistas sobre la que solo nombra al principal. Todos los remixes probados en una categoría de Mejor Remix — Kesha, The Weeknd, Tate McRae, Taylor Swift, Alex Warren, Selena Gomez — ahora encuentran su propio remix en lugar del original o de nada.'],

  'The ceremony plays the right song now, not a remix or a karaoke cover':
    ['La ceremonia ahora reproduce la canción correcta, no un remix ni un karaoke',
     'El fragmento de 30 segundos tomaba lo primero que devolvían las tiendas de música, sin comprobar nunca que fuera la grabación correcta — y el primer resultado es muy a menudo el equivocado. Buscar The Fate of Ophelia de Taylor Swift devolvía primero el remix de The Chainsmokers y segundo un comentario hablado “Track by Track”, con la canción de verdad en tercer lugar, así que la ceremonia anunciaba al ganador y luego ponía un remix, o a alguien hablando. Las versiones de bandas tributo y cuartetos de cuerda, los karaokes y las tomas en directo también aparecen muy arriba, y un nominado que es en sí un remix recibía el original. Ahora cada resultado se comprueba contra el nominado antes de sonar: el artista tiene que coincidir, el título tiene que coincidir, y una versión remix, en directo o acústica solo suena si eso es lo que el nominado es realmente. Cuando nada coincide con seguridad, el reproductor se queda callado y lo dice, porque el silencio es mejor que la canción equivocada en el momento de abrir el sobre. El reproductor también nombra la grabación que encontró, así que una mala coincidencia es evidente en lugar de simplemente confusa, y cuando hay más de una versión plausible un pequeño botón al lado reproduce la siguiente mejor coincidencia. Deezer es ahora también un respaldo de verdad — se le hacía la pregunta pero nunca se leía su respuesta, así que lo que no tenía la primera tienda simplemente no sonaba.'],

  'The ceremony no longer gives away the winner of the automatic awards':
    ['La ceremonia ya no desvela al ganador de los premios automáticos',
     'Las categorías automáticas — Canción más escuchada, Racha diaria más larga de un álbum, Artista con más días escuchado y las demás — no se votan: no tienen candidatos, solo el nombre que ya decidieron tus reproducciones. La ceremonia no lo sabía y mostraba ese único nombre como tarjeta de nominado encima del sobre, así que cada una de esas categorías enseñaba su respuesta antes de abrir nada, lo que quitaba todo el suspense al tramo final del espectáculo. Esas diapositivas ahora muestran una tarjeta sellada en blanco y una línea que explica que no hay nominados, y el nombre solo aparece cuando se abre el sobre, con la portada, el trofeo y el confeti como en cualquier otra categoría. Las categorías que eliges tú no cambian: siguen mostrando a todos los candidatos antes, porque ver quién compite es lo interesante.'],

  'The My Grammys nominee cards look like ballots now':
    ['Las tarjetas de nominados de Mis Grammys ahora parecen papeletas',
     'Las tarjetas de categoría eran cajas simples: una franja gris de cabecera, una columna de círculos y un ganador marcado solo por un tenue tono dorado en una línea — doce de ellas juntas parecían una hoja de cálculo más que una papeleta de premios. Cada tarjeta lleva ahora un fino riel de color en su borde superior en el color de su tipo, así que las categorías de canción, álbum y artista se distinguen de un vistazo, y el mismo color recorre el icono, el brillo al pasar el ratón y el botón del pie. Los nominados van numerados 01, 02, 03 por la izquierda en la fuente monoespaciada, como una papeleta impresa, y el ganador sale de la lista a una banda dorada a todo lo ancho, con un riel dorado y un único destello metálico cuando se dibuja la cuadrícula. Los títulos largos de remixes ya no ocupan tres líneas descuadrando la cuadrícula — se acortan y el texto completo aparece al pasar el ratón — y las tarjetas aparecen en ola en lugar de todas a la vez. Una categoría ya decidida se vuelve dorada entera, así que una papeleta terminada se ve desde el otro lado de la página. El selector de año de arriba recibió el mismo tratamiento: botones redondos a cada lado de un año mucho más grande, y las dos pestañas del panel se convirtieron en un solo interruptor.'],

  'Big Last.fm libraries no longer crash the browser on a phone':
    ['Las bibliotecas grandes de Last.fm ya no bloquean el navegador en el teléfono',
     'Cargar tu historial descargaba cada scrobble de Last.fm y lo guardaba todo en memoria hasta que llegaba la última página — y no solo las cuatro cosas que usa este sitio, sino todo lo que Last.fm envía con cada scrobble: identificadores internos, un enlace y cuatro direcciones de portadas. Eso es unas diez veces más de lo necesario, y en una cuenta con 750.000 scrobbles sumaba aproximadamente 1,6 GB, mucho más de lo que un teléfono permite a una sola pestaña. En algún punto entre la página 3.500 y la 3.900 el teléfono cerraba la pestaña y acababas en la pantalla de error del propio navegador, mientras que la misma cuenta cargaba bien en un ordenador con memoria de sobra. Ahora solo se guardan los cuatro campos — unos 160 MB para esa misma biblioteca en lugar de 1,6 GB — así que la descarga cabe en un teléfono.'],

  'An interrupted history download carries on instead of starting over':
    ['Una descarga del historial interrumpida continúa en lugar de empezar de cero',
     'Tu historial solo se guardaba en el dispositivo cuando terminaba toda la descarga. Para la mayoría de bibliotecas no pasa nada, pero una muy grande necesita miles de páginas, y cualquier cosa que la detuviera a medias — bloquear el teléfono, que el navegador descartara la pestaña en segundo plano, que la pestaña se quedara sin memoria — lo tiraba todo. Al volver se empezaba otra vez por la página uno, lo que para las cuentas más grandes significaba que nunca podía terminar. Ahora el progreso se guarda cada 250 páginas, y la siguiente visita muestra los charts con lo que ya se había descargado y luego pide a Last.fm solo la parte que falta, retomando exactamente donde se paró. También funciona a lo largo de varias visitas: cada una llega más atrás en tu historial que la anterior.'],

  'What’s New tells you when there is something new':
    ['Novedades te avisa cuando hay algo nuevo',
     'El registro de cambios tenía una sola entrada: un pequeño enlace al final de la página, que nunca decía si algo había cambiado de verdad — así que no había motivo para pulsarlo nunca. Ahora aparece un botón NOVEDADES arriba a la derecha de la cabecera, junto a Tema e Idioma, siempre que hayan llegado entradas desde la última vez que abriste la lista, y desaparece en cuanto las lees. Cuando no hay nada nuevo no está en pantalla. Al abrirlo también se muestra cuántas entradas son nuevas, se marca cada una con un riel verde y se dibuja una línea en la lista donde empiezan las que ya viste, para que puedas dejar de leer en el sitio justo en lugar de recorrer setecientas filas. El enlace del pie sigue donde estaba para quien quiera el historial completo. Lo que has leído se recuerda por navegador, así que leerlo en el portátil no quita el aviso en el teléfono.'],

  'Upcoming and Recent Releases open in Reel view again':
    ['Próximos y Recientes Lanzamientos vuelven a abrirse en vista Carrusel',
     'Ambas secciones buscan entre tus 200 artistas principales uno a uno, y mientras tanto se volvían a dibujar como Mosaico después de cada artista, dijeran lo que dijeran los botones Carrusel / Mosaico / Tabla / Lista — así que se abrían en la vista equivocada y los botones no hacían nada hasta que se habían buscado los 200 artistas, lo que puede tardar un par de minutos. Ahora se dibujan en la vista seleccionada, Carrusel por defecto, y cambiar de vista funciona al instante en lugar de esperar a que termine la búsqueda. Los redibujados también están más espaciados, así que el carrusel ya no vuelve a empezar desde el principio cada vez que llega un artista.'],

  'The browser tab, the footer and Google all use your name now':
    ['La pestaña del navegador, el pie de página y Google usan ahora tu nombre',
     'La cabecera ya decía "★ Tus Charts Musicales Personales ★" hasta que ponías un nombre visible en Ajustes, y entonces pasaba a ser tuyo. El pie de página y el título de la pestaña no — llevaban el nombre del dueño del sitio para todo el mundo, que es también lo que Google mostraba como titular de dankcharts.fm en los resultados de búsqueda. Ahora ambos siguen a la cabecera: "Tus Charts Musicales Personales" hasta que pones un nombre visible, y tu propio nombre cuando lo haces, en los cuatro idiomas, con el año “Desde” del pie tomado de tu primer scrobble en lugar de un 2016 fijo. Google recoge el nuevo título la próxima vez que rastree el sitio, así que el antiguo puede seguir un tiempo en las búsquedas.'],

  'Last.fm syncs no longer stop short of your full history':
    ['Las sincronizaciones de Last.fm ya no se quedan cortas de tu historial completo',
     'Si Last.fm limitaba la sincronización — cosa que hace cuando se descarga rápido una biblioteca grande, y que los teléfonos con conexiones más lentas sufren más a menudo — las páginas rechazadas se saltaban en silencio, y la sincronización guardaba lo que hubiera llegado como si fuera todo tu historial. Cada sincronización posterior solo pedía scrobbles más nuevos que eso, así que una cuenta podía quedarse indefinidamente con una fracción de sus reproducciones reales, sin nada en pantalla que lo dijera. Ahora las páginas rechazadas se esperan y se reintentan, y lo que siga faltando al final se vuelve a descargar en la siguiente sincronización en lugar de darse por cerrado; una sincronización incompleta lo dice en la línea de estado en vez de anunciar éxito. Las sincronizaciones siguen empezando igual de rápido y solo frenan si Last.fm de verdad pone pegas. Aparte, si el teléfono se niega a guardar la copia sin conexión — la causa habitual es un iPhone lleno o restringido — la línea de estado ahora te lo dice en lugar de fallar en silencio.'],

  'My Grammys has a Best Album Cover category':
    ['Mis Grammys tiene una categoría de Mejor Portada de Álbum',
     'Una nueva categoría opcional en Mis Grammys, para el disco más bonito del año y no el que mejor suena. Actívala en Configurar Año y funciona como las demás categorías de álbum — elige nominados entre todo lo que escuchaste en el periodo de elegibilidad, corona a un ganador, y la ceremonia le da el mismo sobre que al resto, con las propias portadas llenando las tarjetas.'],

  'New Artist of the Year is now Best New Artist':
    ['Artista Nuevo del Año ahora se llama Mejor Artista Nuevo',
     'Se ha renombrado para que coincida con cómo se llama el premio en todas partes, incluida la pestaña Premios Reales de al lado. Nada cambia en su funcionamiento, y los nominados o ganadores que ya elegiste siguen exactamente donde estaban — solo cambia el nombre de la tarjeta. También traducido al español y al portugués.'],

  'Real-Life Awards has pictures now':
    ['Premios Reales ahora tiene imágenes',
     'Cada artista de la pestaña Premios Reales lleva ahora su foto en el lateral de su tarjeta, y cada nominación muestra la portada de la canción o del álbum por el que fue — la portada del álbum en las categorías de álbum, la del sencillo en todo lo demás. Una categoría sin una obra detrás, como Mejor Artista Nuevo o Productor del Año, no muestra nada en lugar de repetir la foto del artista. Las imágenes vienen del mismo sitio que las de los charts, así que todo lo que hayas fijado aparece aquí también, con tu grafía del artista y no con la que usa grammy.com. En el teléfono la imagen va cuadrada arriba de la tarjeta y cada nominación pone su título debajo de la categoría en lugar de apretar ambos en una línea.'],

  'The events calendar opens the menu instead of jumping to a Google search':
    ['El calendario de eventos abre el menú en lugar de saltar a una búsqueda de Google',
     'Hacer clic en cualquier cosa del calendario de la pestaña Eventos te mandaba directo a una búsqueda de Google — en las cuadrículas Mes y Semana, y en el panel Día de debajo. Ahora todos abren el mismo menú que tienen las tarjetas del resto de la pestaña, adaptado a lo que sea el evento: un cumpleaños ofrece el Spotify del artista, una lista, las últimas 10 canciones y la búsqueda del cumpleaños; un aniversario y un lanzamiento que ya ha salido ofrecen lo mismo para el disco; y un lanzamiento que aún no ha salido ofrece solo Spotify y Google, porque no hay nada que escuchar. Al pasar el ratón sigue apareciendo la pequeña tarjeta de vista previa con la portada — simplemente se aparta cuando haces clic, en lugar de quedarse encima del menú.'],

  'Concerts open the menu too, with Ticketmaster at the top of it':
    ['Los conciertos también abren el menú, con Ticketmaster arriba del todo',
     'Un concierto era un viaje de ida a Ticketmaster, tanto en las tarjetas de la sección Conciertos como en las píldoras verde azulado del calendario. Ahora abren el menú, y Entradas en Ticketmaster es su primera opción — así que la página del concierto sigue a un clic, con el Spotify del artista, una lista y sus últimas 10 canciones al lado. Llegó junto con el cambio del calendario: el calendario muestra los conciertos junto a cumpleaños y lanzamientos, y que solo algunos abrieran un menú habría sido peor que ninguno.'],

  'Real-Life Awards now shows actual Grammy nominations':
    ['Premios Reales ahora muestra las nominaciones reales a los Grammy',
     'La pestaña Premios Reales estaba vacía casi todos los años. Pedía a MusicBrainz las relaciones de premios, y MusicBrainz apenas las registra — un puñado de artistas las tienen y nadie más, así que la pestaña se encogía de hombros y no decía nada. Ahora lee directamente grammy.com. Elige un año y verás esa ceremonia por su nombre — la 68.ª edición de los Grammy, celebrada en 2026 para los lanzamientos de 2025 — y luego, para cada uno de tus cincuenta artistas principales del año premiado, todas las categorías en las que estuvieron nominados, cuáles ganaron y la canción o el álbum por el que fue, junto con su historial de todos los tiempos. La lista va en tu propio orden de escucha, así que tu artista número uno del año la encabeza. Recorrer los años funciona igual, hasta la 1.ª edición de los Grammy en 1959. Los cincuenta artistas se consultan de ocho en ocho en lugar de uno por segundo, y cada artista se busca una sola vez por muchos años que recorras — llegar hasta cincuenta es donde están las sorpresas, el artista que escuchaste dos veces y que resulta que estuvo nominado.'],

  'Picking nominees no longer crawls on a phone':
    ['Elegir nominados ya no va a paso de tortuga en el teléfono',
     'Añadir o quitar un nominado en una categoría de Premios podía tardar un segundo o más en un teléfono, y más cuanto mayor fuera tu biblioteca. Cada toque tiraba la lista entera y la reconstruía desde cero — reordenando las canciones, álbumes o artistas del año y regenerando sesenta filas de la lista — todo para mover una marca. La puntuación de valoración de cada fila era la parte cara: calcular la de un álbum implica encontrar su lista de canciones, y encontrarla suponía recorrer todas las reproducciones de tu historial. Sesenta filas eran sesenta pasadas por todo, y una categoría de artista, que promedia todos los álbumes de ese artista, eran cientos. Ahora un toque solo cambia la fila que tocó, y las puntuaciones de álbumes y artistas se calculan una vez y se recuerdan hasta que algo cambia de verdad. En una biblioteca de 60.000 reproducciones, el trabajo detrás de un toque pasó de unos 276 milisegundos a menos de una quinta parte de uno.'],

  'Nominees no longer go missing when you switch apps':
    ['Los nominados ya no desaparecen al cambiar de app',
     'Tu papeleta era lo único que escribes en la app que solo se guardaba en la nube, nunca en el dispositivo. Así que si el guardado no había terminado de viajar cuando salías de Chrome a otra app — y los teléfonos congelan o descartan una pestaña en segundo plano cuando les apetece — los nominados simplemente desaparecían, sin nada en pantalla que lo dijera. Ahora tres cosas lo evitan. Cada guardado escribe primero en el dispositivo y después en la nube, así que la papeleta está a salvo en el instante en que pulsas Guardar. La conexión con la nube mantiene su propia cola en disco, así que un guardado hecho sin cobertura se envía más tarde en lugar de olvidarse. Y si un guardado se rechaza de verdad con la sesión iniciada, ahora lo dice en pantalla en lugar de fallar en silencio. Cuando la app vuelve a abrirse, toma la copia que se escribió la última, así que un guardado que nunca llegó a la nube se recupera del dispositivo y se envía.'],

  'The rated best-of list is gone from the Awards tab':
    ['La lista de lo mejor según tus valoraciones desaparece de la pestaña Premios',
     'La pestaña Premios se abría con un panel ★ Lo mejor, según mis valoraciones — dos columnas ordenadas, los mejores álbumes y las mejores canciones del año, según las puntuaciones que les diste y no según cuánto los escuchaste. Se ha quitado, así que la pestaña ahora empieza con los propios premios. Tus valoraciones no se tocan: todas las puntuaciones que has dado siguen ahí, y la pestaña Valoraciones sigue mostrando las mismas listas de fin de año.'],

  'Clicking a Recent Release shows its options again':
    ['Hacer clic en un Lanzamiento Reciente vuelve a mostrar sus opciones',
     'En los charts Semanal, Mensual y Anual, hacer clic en una tarjeta de Lanzamientos Recientes no hacía nada — el pequeño menú con Spotify, una lista, el reproductor y Google aparecía y desaparecía antes de poder leerlo. El menú vigila el desplazamiento para apartarse cuando se mueve la tarjeta a la que está anclado, pero escuchaba todo lo que se desplaza en la página en lugar de solo lo que rodea a la tarjeta. Los carruseles de lanzamientos se deslizan solos, así que el carrusel de Próximos Lanzamientos moviéndose justo encima bastaba para cerrar el menú una cincuentésima de segundo después de abrirse. Ahora solo se cierra cuando se desplaza la propia página, o algo dentro de lo que está realmente la tarjeta. El mismo parpadeo cerraba menús por toda la pestaña Eventos, donde los carruseles van apilados, así que esos quedan arreglados con el mismo cambio.'],

  'Every card on the Events tab opens its menu instead of jumping to Google':
    ['Todas las tarjetas de la pestaña Eventos abren su menú en lugar de saltar a Google',
     'Cumpleaños, Aniversarios, Cumpleaños recientes y Aniversarios recientes eran simples enlaces: un clic y estabas en una búsqueda de Google, sin poder hacer nada más. Ahora abren el mismo pequeño menú que tienen las tarjetas de lanzamientos — buscar en Spotify, añadir a una lista, las últimas 10 canciones del artista o del lanzamiento, y buscar en Google. La opción de Google en una tarjeta de cumpleaños sigue buscando el cumpleaños del artista, como hacía la tarjeta, porque es la única búsqueda que a los servicios de música no les diría nada. Funciona en las cuatro formas de mostrar una sección: Mosaico, Carrusel, Lista y Tabla. El ＋ de la esquina de una tarjeta no cambia: sigue siendo la forma de guardar en una lista con un solo clic.'],

  'New Music Friday cards open the menu, with Deezer at the top of it':
    ['Las tarjetas de New Music Friday abren el menú, con Deezer arriba del todo',
     'Una tarjeta de New Music Friday te llevaba directo al álbum en Deezer. Ahora abre el menú, y Abrir en Deezer es su primera opción — así que esa página sigue a un clic, y buscar en Spotify, guardar en una lista o buscar en Google son las demás. No cambia nada sobre de dónde vienen los lanzamientos: la portada, el título, la fecha de salida y si es álbum, sencillo o EP se siguen leyendo de Deezer cada viernes.'],

  'The Albums/Singles/EPs chips stay on the chart tabs where they belong':
    ['Los botones Álbumes/Sencillos/EP se quedan en las pestañas de charts, donde tocan',
     'Una vez que separabas un tipo de lanzamiento de los álbumes, aparecía una fila de botones para cambiar entre Álbumes, Sencillos, EP y Todo. Estaba pensada para los charts Semanal, Mensual, Anual e Histórico, pero te seguía a todas partes: Base de datos, Gráficas, Récords, Eventos, Premios, Tu Soundtrack, Listas de reproducción y la Guía de Charts mostraban los botones encima de la página, donde no cambiaban nada. Ahora solo aparecen en las cuatro pestañas de charts, y solo mientras el chart de álbumes es el que está en pantalla.'],

  'Twenty new award categories, and the Streak Award has gone':
    ['Veinte nuevas categorías de premios, y adiós al Premio a la Racha',
     'Mis Grammys ganó veinte categorías que puedes activar desde Configurar Año. Catorce se eligen como siempre, de una lista de nominados: Vídeo del Año, Grabación del Año, Mejor Canción Country, Mejor Álbum Country, Mejor Álbum Vocal Pop, Mejor Canción Pop Solista, Mejor Canción Pop de Dúo/Grupo, Mejor Grabación Dance/Electrónica, Mejor Grabación Dance Pop, Mejor Álbum Dance/Electrónico, Mejor Grabación Remezclada, Mejor Álbum de Reggae, Mejor Álbum de Banda Sonora y Mejor Canción de Banda Sonora. La pareja de pop se divide según cómo se acredita una canción — solista por un lado, dúos y grupos por otro — y los dos premios de banda sonora leen los tipos de lanzamiento que has marcado, así que un lanzamiento marcado como banda sonora es lo que hace elegible una canción. Country, reggae y dance pop son géneros nuevos que el clasificador ahora reconoce. Las otras seis se otorgan solas, sin nominados que elegir: Racha diaria más larga de una canción, un álbum y un artista, cada una la racha ininterrumpida de días más larga del año, y Canción, Álbum y Artista con más días escuchado, cada una contando cuántos días del año se escuchó. El antiguo Premio a la Racha se ha eliminado — los tres premios de racha que lo sustituyen dicen claramente qué miden, y cubren también álbumes y artistas. Todas las categorías nuevas están desactivadas por defecto y todas están traducidas al español y a las dos variantes del portugués.'],

  'Automatic release-type detection now actually runs on its own':
    ['La detección automática de tipos de lanzamiento ahora sí funciona sola',
     'El interruptor "Detectar tipos de lanzamiento automáticamente" no detectaba nada automáticamente. Activarlo mostraba las opciones de debajo y nada más — cada barrido había que lanzarlo a mano desde el panel de revisión, así que una biblioteca podía pasar meses con el ajuste activado sin un solo sencillo o EP marcado. Ahora, al activarlo, recorre tu biblioteca por sí solo, marcando sencillos, EP, álbumes en vivo y bandas sonoras sobre la marcha, y Ajustes te muestra por dónde va. Había una segunda cosa que deshacía el trabajo en silencio: un barrido revisa mil lanzamientos cada vez, pero olvidaba todo lo aprendido en cuanto cerrabas la pestaña, así que cada visita volvía a empezar por tus álbumes más escuchados y nunca llegaba a la parte de tu biblioteca donde de verdad están los sencillos. Ahora recuerda lo que ya ha consultado y sigue desde ahí, sesión tras sesión, hasta haber pasado por toda la biblioteca. Lo que marcaste a mano nunca se toca, la detección nunca puede desmarcar un lanzamiento, y todo lo que marca aparece en Gestionar tipos, donde puedes cambiarlo o quitarlo.'],

  'Release-type detection now finds live albums, soundtracks, and the rest of your library':
    ['La detección de tipos de lanzamiento ahora encuentra álbumes en vivo, bandas sonoras y el resto de tu biblioteca',
     'Dos cosas mantenían callado el análisis. Preguntaba a Deezer primero por tus lanzamientos más escuchados, que es justo donde no están los sencillos — y gastaba su presupuesto releyendo respuestas que ya tenía, así que analizar por segunda vez recorría los mismos pocos cientos de álbumes y nunca iba más allá. Ahora resuelve gratis lo que ya sabe, dedica las consultas a lanzamientos que nadie ha revisado, te dice cuántos no alcanzó y sigue desde ahí la próxima vez que analices. Los álbumes en vivo y las bandas sonoras no se podían detectar en absoluto, porque Deezer solo conoce álbum, sencillo y EP: ahora se leen de cómo están etiquetados los títulos, así que un "(Live at ...)" o un "(Original Motion Picture Soundtrack)" se reconoce a simple vista.'],

  'Deep in a chart, an edit no longer sends you back to #1':
    ['En lo profundo de un chart, una edición ya no te devuelve al n.º 1',
     'Marcar un álbum como sencillo o EP desde su ventana reconstruye los charts de detrás, y cada reconstrucción devolvía las listas histórica y anual a su primera página — así que cerrar la ventana tras una edición de un segundo te costaba el sitio al que habías bajado. Ahora la página sobrevive a todo lo que deja intacta la lista a la que pertenece. Cambiar de periodo, pasar a otro año o cambiar entre los charts de álbumes y sencillos sigue llevándote arriba, porque esos sí son una lista distinta.'],

  'PEAK tags on the singles and EP charts count the right chart':
    ['Las etiquetas PEAK de los charts de sencillos y EP cuentan el chart correcto',
     'Un sencillo que había liderado el chart de sencillos durante semanas seguía llevando PEAK #2, porque la etiqueta lo medía también contra todos los álbumes — un chart en el que ya no aparece — mientras el recorrido de la misma fila decía #1. El chart de álbumes tenía el caso inverso: un álbum con un pico más bajo del real porque se habían contado por encima sencillos separados. Cada pico pertenece ahora al chart en el que se logró, incluidos los puestos históricos de las ventanas de álbum y de artista.'],

  'A single\'s chart run opens the singles chart, not the albums one':
    ['El recorrido de un sencillo abre el chart de sencillos, no el de álbumes',
     'Hacer clic en una casilla del recorrido de un sencillo o EP separado mostraba el chart de álbumes de esa semana bajo una posición que nunca había salido de él — la casilla decía #1 y la lista mostraba al álbum que estaba en el #1. Una vez que se separa un tipo, la parte de álbumes de una semana son varios charts y no uno, y la vista previa de la casilla muestra ahora el chart en el que se calculó esa posición, titulado con su nombre.'],

  'Singles certify on their own ladder immediately':
    ['Los sencillos se certifican con su propia escala desde el principio',
     'La escala de certificaciones dependía de si un tipo se había separado en su propio chart, lo que mezclaba dos preguntas distintas. La separación trata de dónde aparece un lanzamiento en los charts; la escala trata de qué es el disco. Cien reproducciones de un sencillo de dos canciones son un logro distinto de cien reproducciones de un álbum de catorce, y eso es así esté donde esté en los charts. Los álbumes en vivo y las bandas sonoras se quedan en la escala de álbumes, porque son discos de larga duración.'],

  'Count a single\'s plays toward its album':
    ['Cuenta las reproducciones de un sencillo para su álbum',
     'Tres niveles, desactivado por defecto: nada, que la propia página del álbum cuente sus sencillos, o que también cuenten para la fila del álbum en el chart, sus récords y su certificación, mientras el sencillo conserva su propia fila y su propia cifra.'],

  'Separated types get their own Records':
    ['Los tipos separados tienen sus propios Récords',
     'Cada sección de Récords que lista álbumes ofrece ahora una píldora por cada entidad del lado de los álbumes — solo Álbumes si no has separado nada, más Sencillos y EP cuando van aparte. También trajo un récord nuevo que solo existe gracias a los tipos de lanzamiento: Publicado primero como sencillo, canciones escuchadas primero en un sencillo que después aparecieron en un álbum, empezando por la espera más larga.'],

  'The auto-detect switch could not be clicked':
    ['No se podía hacer clic en el interruptor de detección automática',
     'La casilla dentro del interruptor es invisible y no ocupa espacio, así que el deslizador solo se alcanza a través de su etiqueta — y todos los demás interruptores de Ajustes envuelven su fila en una, pero este no. La función era correcta; el control era decorativo. Las pruebas no lo detectaron porque llamaban a la función directamente en lugar de hacer clic en el control.'],

  'Automatic detection of singles and EPs':
    ['Detección automática de sencillos y EP',
     'Marcar unos cuantos cientos de sencillos a mano es la tarea que habría matado la función, así que la detección hace el barrido y tú lo corriges. Está desactivada hasta que la actives, e incluso entonces solo propone — no se escribe nada hasta que lo aplicas. Los títulos solo se comparan con la convención delimitada de las tiendas, así que The Singles Collection y Single Ladies se quedan como están.'],

  'Singles and EPs in their own charts':
    ['Sencillos y EP en sus propios charts',
     'Un lanzamiento marcado sigue sin cambiar nada hasta que su tipo se pone en Aparte en Ajustes, y Con los álbumes es el valor por defecto para ambos, así que una biblioteca existente no se toca hasta que lo pidas. Aparte da al chart de álbumes un filtro segmentado entre Álbumes, Sencillos y EP.'],

  'Mark a release as a single, EP, live album or soundtrack':
    ['Marca un lanzamiento como sencillo, EP, álbum en vivo o banda sonora',
     'Solo la marca y nada más: anotar qué tipo de disco es algo no cambia ningún chart, ninguna certificación ni ningún récord. Separar un tipo del chart de álbumes es un ajuste opcional posterior.'],

  'Peak tags on yearly rows':
    ['Etiquetas de pico en las filas anuales',
     'El chart anual ya recibía los datos del pico y simplemente nunca los usaba, así que las filas se mostraban sin la insignia de pico que llevan las filas semanales y mensuales.'],

  'Movement and previous rank on yearly charts':
    ['Movimiento y posición anterior en los charts anuales',
     'Los charts anuales mostraban solo posición, título, álbum y reproducciones — las columnas de movimiento y semanas en el chart eran solo semanales y mensuales, excluidas por tres condiciones distintas, una de las cuales tenía el mes escrito a fuego en la rama que debía encargarse de todos los demás periodos.'],

  'Rate your own library':
    ['Valora tu propia biblioteca',
     'Puntúa cualquier canción de 0,0 a 10,0 con una rúbrica de seis partes — composición, letra, voz, producción, melodía y ritmo — o dale una sola nota a ojo. La letra y la voz se pueden marcar como no aplicables para que los instrumentales no se hundan por los ceros; salen de la media por completo. El total de un álbum se construye a partir de sus canciones junto con cualidades propias del álbum.'],

  /* ========== AGOSTO 2026 ========== */

  'Filter the certified shelf by songs or albums':
    ['Filtra la estantería de certificados por canciones o álbumes',
     'La estantería Certificados en este periodo mezclaba los dos tipos sin forma de ver solo uno. Tres botones con los recuentos aparecen cuando hay de ambos tipos, y un periodo con un solo tipo mantiene la línea simple, porque no hay nada que filtrar.'],

  'Menu tab names quoted in the tour':
    ['Los nombres de las pestañas del menú, entre comillas en el recorrido',
     'Mostrar, Tamaño, Vista y Acciones se leían como palabras normales en mitad de la frase, así que no quedaba claro que eran los nombres de las pestañas del propio menú.'],

  'The tour opens the real options menu':
    ['El recorrido abre el menú de opciones real',
     'El menú se describía dos veces, una dentro de un paso y otra como paso propio. Se unieron en un único paso que maneja el menú de verdad — lo abre y resalta cada pestaña, cada fila, los tamaños, las vistas y las acciones.'],

  'Clearer wording on the release reels':
    ['Redacción más clara en los carruseles de lanzamientos',
     'El paso ahora nombra el menú de opciones y el selector de vista que tienen realmente esas secciones.'],

  'Weeks on chart stated directly':
    ['Semanas en el chart, explicado sin rodeos',
     'La redacción contrastaba la cifra con lo que no es en lugar de decir simplemente lo que es.'],

  'Two guide descriptions corrected':
    ['Dos descripciones de la guía corregidas',
     'Nuevas Entradas lista los primeros descubrimientos de la historia, no las canciones que debutan en el chart, y el botón Más es una franja a todo lo ancho bajo las pestañas, no algo a la derecha.'],

  'Section titles hidden behind the sticky bar':
    ['Títulos de sección ocultos tras la barra fija',
     'El desplazamiento del recorrido reservaba espacio para su propio aviso abajo, pero nada para la barra de fecha fija arriba, así que los títulos de las secciones altas quedaban detrás de ella.'],

  'Plainer navigation copy in the tour':
    ['Texto de navegación más sencillo en el recorrido',
     'El paso parecía un párrafo de manual; ahora son líneas cortas con etiqueta para la fila superior, la fila inferior y cómo mostrar la segunda.'],

  'The guide opens with a real greeting':
    ['La guía empieza con un saludo de verdad',
     'El encabezado parecía un nombre pegado a un título y la línea de debajo era una frase a medias.'],

  'Weeks on chart described backwards':
    ['Semanas en el chart, descrito al revés',
     'La guía decía en cuatro sitios que la columna Semanas cuenta una racha consecutiva. Es un total acumulado que se va sumando entre etapas separadas y nunca se reinicia — el contador interno que sí se reinicia es otro, que solo se usa para describir una racha que acaba de terminar.'],

  'Plainer wording on the play button step':
    ['Redacción más sencilla en el paso del botón de reproducción',
     'Explicaba cómo funciona la búsqueda, que no es lo que nadie quiere saber, y terminaba con otra frase sobre lo que la app no te exige.'],

  'The tour scroll re-asserted after the page settles':
    ['El desplazamiento del recorrido se reafirma cuando la página se asienta',
     'El destino es correcto cuando se calcula, pero la página sigue moviéndose debajo de la animación — entrar en un paso pliega la sección anterior y quita miles de píxeles por encima del destino mientras el desplazamiento sigue en marcha.'],

  'The tour covers the two buttons on a row':
    ['El recorrido cubre los dos botones de una fila',
     'Recorría los datos de una fila pero se saltaba las dos cosas que realmente puedes hacer desde ella, así que se añadió un paso para cada una, colocado para que el recorrido se siga leyendo de izquierda a derecha.'],

  'Three tour highlights were invisible':
    ['Tres resaltados del recorrido eran invisibles',
     'Posición, Anterior y Semanas marcaban bien su celda pero no aparecía nada, porque los bordes colapsados de la tabla dejaban que el fondo de una celda vecina se pintara justo encima del anillo de su hermana. Las tres están entre celdas con relleno.'],

  'The tour slowed down':
    ['El recorrido va más despacio',
     'Los tiempos estaban pensados para leer el aviso, no para leerlo y luego mirar de verdad lo que se señala — y como ahora las secciones se despliegan al llegar, hay más que asimilar. Cada paso dura unos diez segundos.'],

  'Tour scrolled tall sections to their middle':
    ['El recorrido llevaba las secciones altas hasta su mitad',
     'Se reportó como que el recorrido ya no resaltaba Casi en el Top, Fuera del Ranking y Nuevas Entradas, mientras que Lanzamientos seguía funcionando — y que Lanzamientos funcionara era la pista, porque era la corta. Centrar una sección más alta que la pantalla deja su cabecera fuera por arriba.'],

  'Two sections would not open for the tour':
    ['Dos secciones no se abrían para el recorrido',
     'Mostrar una sección le quitaba sus clases de estilo, lo que sirve para la mayoría de secciones — pero Casi en el Top y Fuera del Ranking llevan su estado de apertura por separado y fijan su altura directamente, así que ninguna respondía.'],

  'The tour walks a chart row piece by piece':
    ['El recorrido repasa una fila del chart pieza a pieza',
     'Un párrafo enumeraba lo que contiene una fila y no señalaba nada. Se convirtió en siete pasos sobre el número uno actual: la fila, la posición, la posición del periodo anterior y el movimiento, las insignias, las semanas en el chart, las reproducciones y el recorrido.'],

  'The tour can reveal a hidden section':
    ['El recorrido puede mostrar una sección oculta',
     'Un paso que explica Casi en el Top mientras Casi en el Top está desactivado no tenía nada que señalar y no resaltaba nada. Ahora los pasos pueden abrir una sección oculta o plegada y devolverla enseguida tal como la encontraron.'],

  'Plainer wording on the certifications step':
    ['Redacción más sencilla en el paso de certificaciones',
     'La primera frase enterraba qué es la sección bajo cómo funciona, justo en un punto que se lee a velocidad de recorrido.'],

  'The tour visited sections out of order':
    ['El recorrido visitaba las secciones desordenadas',
     'La página las muestra como Chart, Casi en el Top, Fuera del Ranking, Nuevas Entradas, y la barra de botones las lista igual, pero el recorrido visitaba Nuevas Entradas en tercer lugar — bajando más allá de Fuera del Ranking y luego volviendo a subir hasta ella.'],

  'The tour plays through the whole weekly page':
    ['El recorrido repasa toda la página semanal',
     'Una tarjeta describía la pestaña Semanal y dejaba el resto sin documentar — las franjas de estadísticas, las tarjetas del momento, el carrusel de certificaciones, los siete botones, el menú de sección, los tres sub-charts y los carruseles de lanzamientos nunca se mencionaban. Se convirtió en un recorrido que avanza solo.'],

  'Chart animation is now opt-in':
    ['La animación del chart ahora es opcional',
     'El ajuste se leía de forma que no haberlo abierto nunca contaba como activado, así que la repetición se ejecutaba para cada usuario nuevo en cada dibujado del chart, antes de que tuviera idea de qué se estaba animando.'],

  'Tour steps spotlight what they describe':
    ['Los pasos del recorrido resaltan lo que describen',
     'Un paso titulado "La barra de navegación" que ni se desplaza hasta la barra ni la marca te deja leyendo la descripción de algo que tienes que encontrar tú. Ahora los pasos desplazan su objetivo a la vista y lo rodean con un anillo.'],

  'The tour\'s opening claim was untrue':
    ['La afirmación inicial del recorrido era falsa',
     'Decía que la app funciona con la misma maquinaria que una lista musical nacional. No es así — esas ponderan streaming, ventas y radio entre sí, mientras que esta cuenta reproducciones. Y luego dedicaba dos frases más a lo que la app no hace.'],

  'A tour step for every tab':
    ['Un paso del recorrido para cada pestaña',
     'Meter Eventos dentro de Premios y Soundtrack dentro de Listas de reproducción hacía que cuatro pestañas parecieran dos notas al pie, cuando solo Premios genera 33 categorías y Récords tiene once secciones. El recorrido pasó de once pasos a dieciocho.'],

  'Welcome gate skipped after Google sign-in':
    ['La pantalla de bienvenida se saltaba tras iniciar sesión con Google',
     'La pantalla estaba conectada a tres de las cuatro formas en que puede arrancar la app. La cuarta restaura una configuración guardada y muestra la app directamente, así que alguien que iniciaba sesión con Google nunca la veía.'],

  'A welcome gate, and the guide rebuilt as six chapters':
    ['Una pantalla de bienvenida, y la guía rehecha en seis capítulos',
     'Nada en un chart recién cargado anunciaba que existía una guía, así que solo se encontraba por casualidad — y una vez encontrada eran doce secciones planas que mezclaban documentación con tus propias estadísticas. Ahora una pantalla en la primera visita ofrece el recorrido o la guía, y la guía pasó a ser seis capítulos ordenados.'],

  'The ceremony staged properly':
    ['La ceremonia, puesta en escena como es debido',
     'Mostraba una lista simple con el ganador ya resaltado, y el sobre solo aparecía en las categorías que aún no tenían ganador — así que no había nada que revelar. Ahora cada categoría tiene portadas de los nominados, una vuelta de presentación y la apertura de un sobre.'],

  'Nominee lists ranked by the category\'s own rule':
    ['Listas de nominados ordenadas según la regla de cada categoría',
     'Mejor Colaboración significa canciones acreditadas a más de un artista — pero también canciones cuyo crédito muestra un solo nombre y tú sabes que no es así. El crédito no puede distinguirlas, así que la regla pasó a ser un criterio de orden en lugar de un filtro: las coincidencias suben arriba y nunca se oculta nada.'],

  'Generate Nominees button broke itself':
    ['El botón Generar Nominados se rompía solo',
     'El botón restauraba su etiqueta como texto plano, pero la etiqueta contiene el código de su icono, así que mostraba su propio código y se quedaba roto. Una categoría que fallaba también dejaba el botón atascado en Generando.'],

  'Records not rebuilt when nothing changed':
    ['Los Récords ya no se recalculan cuando nada ha cambiado',
     'Se ejecutaba en cada visita a la pestaña y no guardaba nada, así que abrir Récords, echar un vistazo a un chart y volver pagaba de nuevo unos 1,6 segundos de recuento para una respuesta que no había cambiado.'],

  'Cheaper ordering in the Records build':
    ['Ordenación más barata al calcular los Récords',
     'Récords era lo más lento que quedaba, unos 1,8 segundos con 150.000 reproducciones, y las cuatro pasadas anteriores no lo habían tocado porque hace su propio recorrido cronológico en lugar de leer los índices compartidos.'],

  'Faster loading by measuring rather than guessing':
    ['Carga más rápida midiendo en vez de adivinando',
     'Se midió la carga etapa por etapa, y leer el archivo resultó no ser el problema en absoluto — dividir 150.000 líneas lleva cinco milisegundos. El coste estaba en una función de ordenación que convertía dos fechas en cada una de 2,6 millones de comparaciones.'],

  'One shared index instead of regrouping per builder':
    ['Un índice compartido en lugar de reagrupar en cada cálculo',
     'La tercera pasada sobre la misma causa de fondo: distintos cálculos recorriendo cada uno todo el historial para obtener recuentos que los demás ya habían sacado. Ahora los totales se calculan una vez por periodo y se comparten.'],

  'Chart runs cached between renders':
    ['Los recorridos del chart se guardan entre dibujados',
     'Construir el recorrido era lo más caro de un dibujado — 909 milisegundos de un perfil de cuatro segundos — y su resultado se tiraba al principio de cada dibujado. Retroceder una semana volvía a calcular cada posición en el chart desde tu primera reproducción, aunque nada hubiera cambiado.'],

  'Each play\'s derived values computed once':
    ['Los valores derivados de cada reproducción se calculan una sola vez',
     'Perfilar una biblioteca de 100.000 reproducciones mostró que un solo dibujado hacía 2,5 millones de conversiones de fecha y más de un millón de búsquedas de claves — unas doce pasadas completas por el historial en cada dibujado, porque unos diecisiete cálculos de charts empiezan cada uno con su propio bucle sobre todo. Ahora esos valores se calculan una vez por reproducción.'],

  'Add a song to a playlist instead of playing it':
    ['Añade una canción a una lista en lugar de reproducirla',
     'Todo lo que mostraba canciones ofrecía la cola del reproductor y nada más, así que para guardar una canción había que reproducirla. La Máquina del Tiempo, los botones de reproducción de todos los charts, los cumpleaños, los aniversarios y los lanzamientos recientes ahora pueden preparar canciones directamente para una lista.'],

  'An artist\'s play button searched their name as a song':
    ['El botón de reproducción de un artista buscaba su nombre como si fuera una canción',
     'Todas las vistas alternativas trataban los álbumes aparte con el selector de canciones y dejaban que los artistas cayeran en una búsqueda directa, así que el botón buscaba el nombre del artista como si fuera el título de una canción. Tres vistas no tenían ningún botón de artista.'],

  'Export Playlist opened behind the Streaks window':
    ['Exportar lista se abría detrás de la ventana de Rachas',
     'Copiar lista de canciones parecía no hacer nada: la ventana de exportación se declara antes en la página, así que al mismo nivel de apilamiento la ventana de rachas se pintaba justo encima. Una ventana abierta desde dentro de otra ahora queda encima.'],

  'The Records reel ran twice as fast as it looked':
    ['El carrusel de Récords iba el doble de rápido de lo que parecía',
     'Su velocidad se ajustó para igualar a la de la Máquina del Tiempo por tarjeta, pero una tarjeta de récord es casi el doble de ancha, así que igualar segundos por tarjeta suponía recorrer el doble de distancia en el mismo tiempo.'],

  'Every reel can be dragged':
    ['Todos los carruseles se pueden arrastrar',
     'La Máquina del Tiempo, el carrusel del Soundtrack y todos los carruseles de Eventos eran animaciones, y una animación no se puede arrastrar — el puntero y la animación escribirían lo mismo a la vez. Se rehicieron como desplazadores de verdad, como ya funcionaba la estantería de certificados.'],

  'The certified shelf stayed hanging on other tabs':
    ['La estantería de certificados se quedaba colgada en otras pestañas',
     'Se niega a construirse fuera de semana y mes, pero vive en la columna del chart, y las pestañas que no son de chart ocultan esa columna pieza a pieza — y ninguna de las ocho la nombraba. Las placas que hubiera ganado la última semana se quedaban puestas en Récords, Eventos y Premios.'],

  'Time Machine could be switched off permanently':
    ['La Máquina del Tiempo se podía apagar para siempre',
     'Desactivar los tres tipos dejaba al carrusel sin nada que mostrar, así que se ocultaba, llevándose con él los tres botones, porque viven en su cabecera. Como ese estado se guarda y se sincroniza, ni recargar ni otro dispositivo los recuperaba.'],

  'Time Machine vanished after visiting Awards':
    ['La Máquina del Tiempo desaparecía tras visitar Premios',
     'Esas pestañas ocultan el carrusel directamente y el código que restaura la interfaz del chart nunca lo volvía a poner. Lo único que podía hacerlo lo reconstruye solo cuando los datos han cambiado — cosa que, el mismo día y con las mismas reproducciones, nunca pasa — así que una visita lo quitaba durante el resto de la sesión.'],

  'Awards a period earned':
    ['Los premios que ganó un periodo',
     'Una certificación es un momento — la reproducción concreta que llevó un disco por encima de un umbral — así que cae exactamente en una semana y en un mes. Los charts semanales y mensuales ahora se abren con las placas cuya reproducción decisiva cayó en ese periodo.'],

  'Compilations count as one album':
    ['Los recopilatorios cuentan como un solo álbum',
     'Un álbum en el que cada canción nombra a un cantante distinto se partía en un álbum por cantante, así que cada chart de álbumes, récord y certificación contaba el mismo disco una docena de veces con una fracción de sus reproducciones. Marcarlo como recopilatorio lo vuelve a unir en uno, acreditado a Varios Artistas.'],

  'Plaques become awards':
    ['Las placas se convierten en premios',
     'La placa ponía la portada dentro de una etiqueta de vinilo, lo que dejaba dos problemas que no podía resolver dentro de esa forma: la imagen era el disco, así que no había imagen, y un múltiplo era una palabra en una insignia, así que un muro de Diamantes parecía uniforme hasta haber leído cada insignia.'],

  'Certifications kept every award, not just the highest':
    ['Las certificaciones conservan todos los premios, no solo el más alto',
     'Una placa solo mostraba dónde está un disco ahora, así que superar un umbral destruía en silencio el premio de debajo: un álbum en triple Diamante tenía una placa de Diamante, y el Oro y el Platino que ganó por el camino habían dejado de existir.'],

  'Yearly streaks ranked on their leanest year':
    ['Las rachas anuales se ordenan por su año más flojo',
     'Una racha anual solo puede durar lo que la propia biblioteca, así que cualquiera que sigas escuchando llega al mismo máximo y la clasificación se llena de un solo número, ordenado por debajo por reproducciones totales — lo que convertía el récord en Más reproducciones con una etiqueta de racha.'],

  'Records overview splits by period':
    ['El resumen de Récords se divide por periodo',
     'Una segunda fila de píldoras reduce el tablero a las secciones que tienen un récord en ese periodo, y Todos muestra la unión de todo — 26 tarjetas en lugar de 10 — con cada etiqueta indicando de qué récord se trata.'],

  'Records pills sized as primary navigation':
    ['Las píldoras de Récords, a tamaño de navegación principal',
     'Estaban en torno a nueve píxeles bajo una página de títulos grandes — letra pequeña para la navegación principal de la pestaña.'],

  'Drawn icons on the type pills':
    ['Iconos dibujados en las píldoras de tipo',
     'Una estrella, un rombo y un rombo de cuatro puntas no decían nada de canciones, artistas o álbumes — tres marcas abstractas cuya única función era diferenciarse entre sí, por eso dos secciones ya se habían pasado a emojis.'],

  'Pill icons keep moving while selected':
    ['Los iconos de las píldoras siguen moviéndose mientras están seleccionados',
     'Nueve de los once hacían una entrada y luego se paraban en seco, así que la píldora seleccionada estaba quieta salvo el primer medio segundo. El movimiento era un adorno de llegada cuando tenía que ser un estado.'],

  'Icons and colour families on the Records pills':
    ['Iconos y familias de color en las píldoras de Récords',
     'Once píldoras sin más que etiquetas diminutas no daban a la vista forma de distinguir las secciones. Cada una lleva ahora un glifo dibujado inspirado en objetos de tienda de discos en lugar de marcas genéricas de interfaz, coloreado en cinco familias.'],

  'Reigns separated from longevity':
    ['Los reinados, separados de la longevidad',
     'Doce semanas seguidas en el número uno no es el mismo récord que doce semanas en el número uno repartidas en cuatro años: una cosa es un reinado, la otra es longevidad. Ambas secciones dicen ahora cuál miden, y miden las dos.'],

  'Five more sections rank all three charts':
    ['Cinco secciones más clasifican los tres charts',
     'Todo lo de Récords que solo clasificaba el chart semanal ahora clasifica el semanal, el mensual y el anual, incluida la prueba del Perfect All Kill. De paso se rehízo Rachas.'],

  'All #1s split per chart, and its covers load':
    ['Todos los n.º 1 se dividen por chart, y sus portadas cargan',
     'Un título general cubría tres subtablas que eran los récords de verdad, sin nombrar nada concreto. Ahora cada una es un récord propio, y se arregló el fallo de las portadas que arrastraba la sección desde que se escribió.'],

  'Overview cards become artwork tiles':
    ['Las tarjetas del resumen se convierten en mosaicos con imagen',
     'La cuadrícula eran diez paneles de texto planos. Todas las demás partes de la app que presentan un récord muestran la cara del disco; esta, lo primero que se ve al abrir la pestaña, no mostraba ninguna.'],

  'All #1s pills failed to hide their tables':
    ['Las píldoras de Todos los n.º 1 no conseguían ocultar sus tablas',
     'Cada bloque de periodo abría dos elementos pero cerraba tres, y el navegador gastaba el sobrante cerrando lo siguiente que estuviera abierto — así que cada tabla a partir de ese punto se interpretaba como hermana del panel que debía contenerla, y las píldoras no podían ocultarlas.'],

  'Records tables become cards on phones':
    ['Las tablas de Récords se convierten en tarjetas en el teléfono',
     'Una tabla de récords puede tener nueve columnas, lo que por debajo de 768 píxeles suponía un desplazamiento horizontal sin nada que indicara que estaba ahí, así que las columnas de la quinta en adelante nunca se encontraban. Ahora cada fila es una tarjeta.'],

  'A certification ledger behind every artist row':
    ['Un registro de certificaciones detrás de cada fila de artista',
     'Cada fila se despliega con todas las certificaciones que tiene ese artista, una línea por premio con los cálculos detrás: primera reproducción, el día en que llegó, cuánto tardó en subir, el ritmo, las reproducciones desde entonces y el indicador hacia el siguiente escalón.'],

  'Five more sections get type pills':
    ['Cinco secciones más tienen píldoras de tipo',
     'Todos los n.º 1, Apariciones, Debuts y Más reproducciones ahora muestran un tipo cada vez, como las secciones que ya lo hacían, compartiendo un único control genérico en lugar de una cuarta, quinta y sexta copia.'],

  'Fastest ranked on rounded days':
    ['Los más rápidos se ordenaban por días redondeados',
     'La clasificación ordenaba por el tiempo transcurrido redondeado a días enteros, lo que en los niveles bajos apenas es un orden — con 50 reproducciones, 23 de las 25 filas visibles compartían el mismo número de días, así que en realidad se ordenaban por el orden en que se habían calculado. Cada reproducción tiene una hora real, y ahora se usa.'],

  'Fastest to Milestone for all three types':
    ['Más rápido hasta un hito, para los tres tipos',
     'Canciones, artistas y álbumes tienen cada uno su propia clasificación en lugar de solo canciones, con la misma forma que usa la sección Hitos de arriba.'],

  'Every record an artist holds, in their modal':
    ['Todos los récords de un artista, en su ventana',
     'El carrusel del Salón de la Fama del banner de Récords aparece ahora en la ventana del artista, limitado a ese artista. Los dos comparten un único generador de tarjetas para que no se desincronicen.'],

  'The tier medal sized to its word':
    ['La medalla de nivel, al tamaño de su palabra',
     'La medalla era bastante más pequeña que la palabra del nivel a su lado, así que parecía un añadido en lugar de lo que se está premiando.'],

  'The song certification becomes a struck medal':
    ['La certificación de canción se convierte en una medalla acuñada',
     'La nota suelta pasó a ser una medalla con la nota en su cara, en tonos del color en lugar de con el centro oscuro, porque un centro vaciado habría dejado ver la foto del artista a través de la medalla.'],

  'A gold note that catches the light':
    ['Una nota dorada que atrapa la luz',
     'El emoji pasó a ser una nota dibujada. Un emoji se muestra en el color que trae cada plataforma y no puede brillar; una dibujada toma el dorado del tema y una sombra en capas, que es lo que hace que parezca metal y no una pegatina.'],

  'Song certifications marked by a rosette':
    ['Las certificaciones de canción, marcadas con una roseta',
     'La nota musical nombraba el género en lugar del logro, quitándole valor al único récord de aquí que de verdad se otorga. Los álbumes conservan el disco para que ambos sigan distinguiéndose.'],

  'Certification cards name their own type':
    ['Las tarjetas de certificación dicen de qué tipo son',
     'El muro reúne canciones y álbumes bajo un solo título que no puede decir qué es cada tarjeta, así que ahora cada tarjeta lo dice ella misma.'],

  'Certified centres under the tier word':
    ['Certificado, centrado bajo la palabra del nivel',
     'La insignia se lee como un glifo más una palabra, así que centrarla bajo la cadena entera ponía la etiqueta bajo ambos y a la izquierda de donde debía ir.'],

  'A certification tier reads like a plaque':
    ['Un nivel de certificación se lee como una placa',
     'Oro, Platino y Diamante son el récord en una tarjeta de certificación, no una cifra, así que el nivel va a tamaño de placa con certificado debajo en lugar de en la misma línea. Las demás tarjetas conservan su cifra en línea, donde el valor sí es un número.'],

  'Certification cards say certified':
    ['Las tarjetas de certificación dicen certificado',
     'El nivel es el titular de una tarjeta de certificación, así que ahora lleva la palabra, y la fecha de debajo pasó a ser una etiqueta simple para que la misma palabra no aparezca dos veces. Los detalles secundarios eran demasiado pequeños y se cortaban en una línea.'],

  'Long titles wrap too':
    ['Los títulos largos también saltan de línea',
     'Los títulos de las tarjetas se cortaban igual, así que un título largo con paréntesis quedaba truncado. Ahora los títulos ocupan hasta tres líneas y las descripciones hasta dos, lo que cubre todos los récords de la pestaña.'],

  'Long record descriptions wrap':
    ['Las descripciones largas de récords saltan de línea',
     'Las tarjetas del carrusel cortaban su línea de sección en mitad de una palabra. Ahora pasa a una segunda línea, y la tarjeta reserva las dos se usen o no, para que las alturas se mantengan iguales al desplazarse.'],

  'The masthead flame keeps its gold':
    ['La llama de la cabecera conserva su dorado',
     'Las listas del recorrido mantienen el nuevo nivel superior azul, mientras que la cabecera vuelve al dorado — las dos escalas se separan arriba a propósito.'],

  'The longest streaks burn blue':
    ['Las rachas más largas arden en azul',
     'Los cinco primeros niveles suben del ámbar al rojo intenso, pero el sexto volvía a un dorado claro que parecía más débil que el rojo de debajo. El nivel superior ahora arde en azul, que es más caliente que el rojo.'],

  'Records opens on the artist who holds the most':
    ['Récords se abre con el artista que tiene más',
     'El resumen empieza ahora por el artista que aparece en más filas de récords que nadie, con su foto detrás de una marquesina con todos los récords que tiene, y cada tarjeta con las cifras de ese récord.'],

  'Artist total stays visible on mobile':
    ['El total del artista sigue visible en el móvil',
     'El total de reproducciones desaparecía de la barra ON AIR en pantallas estrechas.'],

  'ON AIR counts credited collaborations properly':
    ['ON AIR cuenta bien las colaboraciones acreditadas',
     'La cifra del artista comparaba la cadena de crédito tal cual, mientras que todos los charts de artistas la dividen en nombres individuales, así que se quedaba corta en cada colaboración y no coincidía con el chart de Artistas que tenía justo al lado.'],

  'An ON AIR bar for what you are playing now':
    ['Una barra ON AIR para lo que estás escuchando ahora',
     'Last.fm ya marcaba la canción en curso en cada sincronización y el analizador la descartaba, porque todavía no es un scrobble. Ahora una barra la consulta y muestra la portada, el título, el artista, un reloj en marcha y cuántas veces la has escuchado antes.'],

  'Records intro pairs chart size with history':
    ['La introducción de Récords empareja el tamaño del chart con el historial',
     'La franja llevaba dos datos unidos por una barra vertical — los tamaños de los charts y luego cuánto historial los alimenta — que en realidad eran siempre las mismas tres columnas. Emparejados por periodo, cada columna se lee como una frase: los récords semanales salen de un top 10, y hay 517 de esas semanas.'],

  'Total plays for the selected chart run range':
    ['Reproducciones totales para el rango seleccionado del recorrido',
     'Las estadísticas del recorrido ganaron un total que sigue al selector de rango, así que cambiar entre lo que va de año, hasta este periodo y todo el historial responde cuánto escuchaste de verdad junto a qué posición tuvo.'],

  'Heatmap days rain into place':
    ['Los días del mapa de calor caen como lluvia',
     'Cada cuadrado de día cae ahora en el calendario con su propio ritmo en lugar de aparecer toda la cuadrícula de golpe, con un azar lo bastante amplio para que los cuadrados vecinos se adelanten entre sí en lugar de entrar en una línea limpia.'],

  'Streak records on every chart entry':
    ['Récords de racha en cada entrada del chart',
     'Los paneles del recorrido ganaron una cuarta sección con récords de racha para canciones, artistas y álbumes, en cuatro pestañas — reproducciones, días, meses y años consecutivos — cada una con una lista ordenada, una franja de estadísticas y una vista de detalle con un bloque por unidad. Solo cuentan rachas de dos o más.'],

  /* ========== JULIO 2026 ========== */

  'Certification artwork sitting outside its frame':
    ['La imagen de certificación quedaba fuera de su marco',
     'El contenedor añadido alrededor de cada portada para que la insignia del selector tuviera dónde anclarse se reducía a nada en el Muro de Certificaciones, dejando el hueco del disco centrado en la esquina de la tarjeta en lugar de en la imagen.'],

  'Records column headers stay as you scroll':
    ['Las cabeceras de columna de Récords se quedan fijas al desplazarte',
     'Las tablas de Récords ocupan mucho más que una pantalla, y a la trigésima fila una cuadrícula de nombres y números ya no tenía nada que dijera qué columna era cuál. Ahora las cabeceras se fijan arriba mientras las filas se mueven por debajo.'],

  'The artwork picker badge no longer covers the art':
    ['La insignia del selector de imágenes ya no tapa la imagen',
     'En dispositivos táctiles la insignia se quedaba siempre encima de las imágenes pequeñas, ocultando justo la portada a la que pertenecía. Ahí se oculta por completo, y una pulsación de medio segundo en cualquier imagen abre el selector.'],

  'Milestones as a timeline':
    ['Hitos como línea de tiempo',
     'Hitos es una escala de primeras veces, una fila por nivel, cada una con una fecha, así que pasó a ser una línea de tiempo vertical con un eje, un nodo por nivel e imagen por entrada, dividida en tres paneles tras un selector.'],

  'Biggest debuts on a podium, with total plays':
    ['Los mayores debuts en un podio, con las reproducciones totales',
     'El récord muestra ahora las reproducciones de todos los tiempos junto a la cifra del debut, así que una canción que empezó fuerte y se estancó se distingue de una que siguió creciendo, y los tres primeros salen de la tabla a tarjetas de podio.'],

  'New Charts records browsable by type and period':
    ['Los récords de Nuevos Charts se exploran por tipo y periodo',
     'Diez récords mostrados como veinte tablas en un solo desplazamiento pasaron a ser dos filas de píldoras que muestran un grupo cada vez, por tipo y por periodo, y ambas elecciones se recuerdan para que la sección se reabra donde la dejaste.'],

  'Search across every Records table':
    ['Busca en todas las tablas de Récords',
     'Una sola caja encima de la navegación de secciones filtra las 55 tablas a la vez, marcando las filas que coinciden, ocultando el resto y mostrando solo las secciones que aún tienen alguna coincidencia — ignorando a propósito los límites y los plegados de cada tabla mientras está activa.'],

  'Records opens on an overview':
    ['Récords se abre con un resumen',
     'Antes te dejaba caer en una tabla sin indicar por qué esa, qué tienen las otras nueve ni si alguna tiene ya algo. Ahora se abre con una tarjeta por sección con el mejor récord de esa sección, con un selector de Canciones, Artistas y Álbumes.'],

  'Records typography given real hierarchy':
    ['La tipografía de Récords, con una jerarquía de verdad',
     'Había siete niveles de etiqueta repartidos en un rango de 2,2 píxeles, cuatro en mayúsculas, y todos más pequeños que los datos que etiquetaban. Leer de un vistazo funciona por proporción, así que se rehicieron en cuatro tamaños claramente distintos.'],

  'Records sections opened one at a time':
    ['Las secciones de Récords se abren de una en una',
     'La pestaña se abría en una vista que mostraba las diez secciones a la vez — unas 55 tablas y varios cientos de búsquedas de imágenes en un solo desplazamiento. Esa opción se quitó, y ahora las tablas se pueden ordenar por cualquier columna.'],

  'Song of the Moment no longer forced to lowercase':
    ['La Canción del Momento ya no sale forzada en minúsculas',
     'La tarjeta mostraba la clave interna de agrupación, que va en minúsculas para que una canción cuente como una sola entrada se escriba como se escriba. Ahora se conserva y se muestra el uso original de mayúsculas de la primera reproducción del periodo.'],

  'Pick artwork from a grid of every source':
    ['Elige la imagen en una cuadrícula con todas las fuentes',
     'Hacer clic en la etiqueta de la fuente pasaba a ciegas por cuatro fuentes de una en una. Ahora una insignia en cualquier imagen abre un selector con candidatas de las cuatro a la vez, y tu elección se fija a ese elemento para todos los dibujados futuros en todas las vistas.'],

  'Unreadable selected buttons on Dark Yellow':
    ['Botones seleccionados ilegibles en Amarillo Oscuro',
     'Nueve de los diez temas tienen un color de acento medio u oscuro, así que texto blanco sobre un relleno de acento quedaba bien y se copió en unas 45 reglas. El acento del amarillo oscuro es claro, así que cada píldora rellena de ese tema tenía un contraste de 1,5 a 1 — los botones del chart, los del recorrido y los controles de lanzamientos, prácticamente en blanco.'],

  'Your Soundtrack stayed on screen under the next tab':
    ['Tu Soundtrack se quedaba en pantalla bajo la siguiente pestaña',
     'Era la única vista que faltaba en la lista de cosas que desmontar al cambiar.'],

  'The Events icon became a calendar with a ticket':
    ['El icono de Eventos pasó a ser un calendario con una entrada',
     'Un pin de mapa indica un lugar, pero la pestaña contiene cumpleaños, fechas de lanzamiento y conciertos — todo con fecha, nada con lugar. Ahora es un calendario con el día tachado y una entrada en su esquina, lo que además lo distingue de los otros dos calendarios de la navegación.'],

  'The Last.fm card explains the full setup':
    ['La tarjeta de Last.fm explica la configuración completa',
     'El campo de nombre de usuario es el atajo de solo lectura, así que la tarjeta ahora dice qué añade la configuración completa — tu propia clave, y corregir y enviar scrobbles — y enlaza a la parte correcta de la guía.'],

  'Navigation tab colours pulled apart':
    ['Los colores de las pestañas de navegación, más separados',
     'La primera fila recorría cuatro tonos fríos dentro de unos 70 grados, dos de ellos a solo 20 de distancia y ambos con aspecto de lavanda. Los temas claros lo empeoraban acercando todos los tonos al acento. Se separaron los tonos.'],

  'Drawn icons on every navigation tab':
    ['Iconos dibujados en todas las pestañas de navegación',
     'Las doce pestañas pasaron de emojis a iconos dibujados. Los emojis se muestran con la paleta fija de cada sistema operativo e ignoran el estado de la pestaña; estos toman el color de la pestaña, así que siguen el paso del ratón y el estado activo.'],

  'Drawn icons on Sync Now and Settings':
    ['Iconos dibujados en Sincronizar y Ajustes',
     'Los caracteres sueltos de flecha y engranaje pasaron a ser pequeños objetos construidos en el mismo lenguaje, con la flecha de recarga girando como gira una recarga.'],

  'Drawn icons on the masthead stats':
    ['Iconos dibujados en las estadísticas de la cabecera',
     'Las cinco cifras usaban emojis, que solo pueden escalar como un bloque e ignoran el estado de su entorno. Ahora cada una es un pequeño objeto construido que representa lo que mide su estadística al pasar el ratón.'],

  'Two copies of the sync script had drifted apart':
    ['Dos copias del script de sincronización se habían desincronizado',
     'La copia de la guía iba 89 líneas por delante de la de la ventana de ajustes, a la que le faltaba una sección entera de obtención de géneros y dos elementos de menú que la manejan. Quien copiaba la equivocada obtenía un script que no podía hacer lo que la otra prometía.'],

  'The sync script builds the missing tab itself':
    ['El script de sincronización crea él mismo la pestaña que falta',
     'En lugar de fallar con un error exacto pero invisible y dejarte adivinar el nombre de la pestaña y qué celda contiene qué, el script ahora crea la pestaña Settings cuando no existe, con las etiquetas y el tamaño correctos.'],

  'Own-sheet users told to use a tab they do not have':
    ['A quien usa su propia hoja se le pedía usar una pestaña que no tiene',
     'Un paso mencionaba una pestaña Settings que solo existe porque la plantilla la trae. Con tu propia hoja no existe esa pestaña, y el fallo es invisible desde el sitio — el script falla y nunca llega ninguna reproducción.'],

  'Copying the deployment address was skipped over':
    ['Se pasaba por alto copiar la dirección de implementación',
     'Un paso terminaba con "luego pega abajo la URL que te da", resumiendo en silencio tres acciones distintas en una frase: pulsar Implementar, pasar otra vez por las pantallas de autorización y encontrar la dirección en el diálogo que aparece después. Nada decía que iba a aparecer una URL.'],

  'Steps told people to paste a script already there':
    ['Unos pasos pedían pegar un script que ya estaba ahí',
     'Dos pasos indicaban a todo el mundo abrir el editor de scripts y pegar el script, cuando la plantilla ya lo trae — cosa que la guía dice claramente unas líneas más abajo. Ahora la secuencia tiene tres pasos.'],

  'The auto-sync block asked for the answer before the question':
    ['El bloque de sincronización automática pedía la respuesta antes que la pregunta',
     'Empezaba exigiendo una dirección, luego explicaba de dónde sale esa dirección y después soltaba 400 líneas de script en mitad de la ventana. Se invirtió el orden para que tengas delante lo que necesitas cuando lo necesitas.'],

  'Settings speaks the landing page\'s language':
    ['Ajustes habla el mismo idioma que la página de inicio',
     'El selector de fuente eran tres cajas planas con glifos provisionales, mientras la pantalla de inicio presenta las mismas tres opciones con iconos dibujados y pegatinas — la misma decisión con dos personalidades. Las tarjetas ahora reutilizan los propios iconos de la página de inicio.'],

  'Configure became Settings, in three tabs':
    ['Configurar pasó a ser Ajustes, en tres pestañas',
     'La ventana antigua era un largo desplazamiento con nombre visible, zona horaria, opciones de fuente, campos de hoja, script, certificaciones, eventos y dos interruptores, cada uno con un párrafo debajo. Ahora son tres pestañas — Fuente de datos, Charts y Perfil — con las opciones de fuente rehechas como tarjetas.'],

  'The web app step undersold itself':
    ['El paso de la aplicación web se quedaba corto al explicarse',
     'Decía que solo hacía falta para el botón Añadir reproducción. En realidad esa dirección da acceso a tres cosas: añadir a mano, enviar cambios de vuelta a tu hoja, y guardar y volver a aplicar reglas de autocorrección. Ahora el paso empieza por lo que de verdad desbloquea.'],

  'The connect step put in the right order':
    ['El paso de conexión, en el orden correcto',
     'Te pedía pegar la dirección de la hoja antes de pedirte compartirla, que es justo al revés del orden en que tienes que hacerlo. Ahora recorre las tres tareas reales en orden, incluido qué significa cada ajuste de uso compartido y un fallo silencioso que no tenía ningún aviso.'],

  'The auto-sync step explains itself':
    ['El paso de sincronización automática se explica',
     'Un paso comprimía tres cosas distintas en cuatro líneas, y la parte que más asusta — el aviso de Google de app no verificada — era una nota al pie en lugar de lo que estás a punto de encontrarte. Ahora son tres secciones con nombre.'],

  'The setup guide became a step-by-step wizard':
    ['La guía de configuración se convirtió en un asistente paso a paso',
     'Un paso cada vez, con una barra de puntos en la que se puede hacer clic, controles de atrás, saltar y siguiente, y tu posición recordada en cada ruta. El texto completo sigue disponible para imprimir y para quien no use scripts.'],

  'A File Upload guide, and a guide you tick through':
    ['Una guía de Subir archivo, y una guía que vas marcando',
     'La tercera ruta de configuración se escribió a partir de los analizadores reales y no de memoria, cubriendo seis fuentes y dónde pedir una exportación en cada una, y las tres rutas se rehicieron como algo que vas recorriendo en lugar de un muro de texto.'],

  'The setup guide speaks the landing page\'s language':
    ['La guía de configuración habla el mismo idioma que la página de inicio',
     'El fondo de la página, los brillos que siguen al cursor, el suelo del ecualizador, las tarjetas de cristal y las etiquetas de sección se trasladaron, así que llegar desde una tarjeta de fuente se siente como pasar a la habitación de al lado y no a otro edificio.'],

  'Benefit stickers and a recommended ribbon':
    ['Pegatinas de ventajas y una cinta de recomendado',
     'Cada tarjeta de importación lleva una pequeña pegatina con el único motivo para elegirla — control total, cero mantenimiento, inicio más rápido — y Google Sheets va vestida como la entrada dorada del chart, con una cinta de recomendado.'],

  'Notes fly over the neighbouring cards':
    ['Las notas vuelan por encima de las tarjetas vecinas',
     'La capa de la explosión estaba debajo de todas las tarjetas, así que las notas que salían de su tarjeta se deslizaban por detrás de la siguiente. Ahora la tarjeta pulsada se eleva mientras sus notas están en el aire, así que salen de detrás de ella y cruzan por encima de las demás.'],

  'A burst of notes when you pick a source':
    ['Una explosión de notas al elegir una fuente',
     'Hacer clic en una tarjeta de importación lanza nueve notas desde detrás de ella, cada una con el color propio de esa tarjeta, que nacen ocultas tras la tarjeta y solo aparecen al salir de su borde.'],

  'Hand-drawn animated icons on the landing page':
    ['Iconos animados dibujados a mano en la página de inicio',
     'El enlace para saltar pasó a ser un tocadiscos cuyo plato empieza a girar y cuyo brazo baja al pasar el ratón, así que la acción de retomar hace el gesto de volver a poner un disco, y el vinilo ganó un brillo especular.'],

  'Stronger cursor response':
    ['Respuesta al cursor más marcada',
     'En círculos de varios cientos de píxeles, el movimiento original apenas se notaba. Ahora es unas tres veces más fuerte y sigue más rápido, aunque sigue amortiguado en lugar de saltar al cursor.'],

  'Landing glows follow the cursor':
    ['Los brillos de la página de inicio siguen al cursor',
     'Los dos brillos de fondo ahora se inclinan hacia el puntero en lugar de solo repetir una deriva fija.'],

  'Bubbling Under translated':
    ['Casi en el Top, traducido',
     'Toda la sección salía en inglés fijo: su título, el subtítulo, las trece insignias con sus descripciones, la leyenda y la lista de canciones. Los botones del chart y Plegar todo tenían el mismo problema.'],

  'Last.fm syncs claimed to be connecting to Google Sheets':
    ['Las sincronizaciones de Last.fm decían estar conectando con Google Sheets',
     'El texto de estado nombraba Sheets fuera cual fuera tu fuente real, y cambiar de idioma devolvía un estado en curso a ese texto — y juntos hacían que una sincronización de Last.fm pareciera atascada en una conexión que nunca estaba ocurriendo.'],

  'Hero stats frozen after a big first sync':
    ['Las estadísticas principales se congelaban tras una primera sincronización grande',
     'La actualización silenciosa en segundo plano nunca recalculaba las estadísticas principales, así que el total de reproducciones, los días, el artista principal y la racha se quedaban en las cifras iniciales incluso después de terminar de cargar todo el historial.'],

  'Landing page top unreachable with a card open':
    ['No se podía llegar arriba en la página de inicio con una tarjeta abierta',
     'La pantalla centraba su contenido en un contenedor de desplazamiento fijo, y cuando una tarjeta desplegada superaba la altura de la pantalla, ese centrado hacía que el desbordamiento solo se pudiera desplazar en una dirección — dejando el logo de arriba fuera de alcance para siempre.'],

  'Landing glow clear of the skyline':
    ['El brillo de la página de inicio, fuera del horizonte',
     'El brillo de la derecha quedaba encima de las barras del ecualizador y las enturbiaba.'],

  'Sheets card text translated':
    ['Textos de la tarjeta de Sheets traducidos',
     'El botón de plantilla, la pegatina de configuración y el separador estaban preparados para traducirse, pero nunca se añadieron sus traducciones.'],

  'Google Sheets card redesigned':
    ['Tarjeta de Google Sheets rediseñada',
     'La tarjeta de Sheets ganó un botón de plantilla, una pegatina de configuración en 30 segundos y un separador de ya-tengo-una-hoja. Se habían subido junto con un arreglo sin relación y sin revisión, y se documentaron por separado cuando se detectaron.'],

  'Landing glow circles were invisible':
    ['Los círculos de brillo de la página de inicio eran invisibles',
     'Un desenfoque fuerte repartía un color ya tenue por un círculo grande, y luego la propia transparencia del elemento lo diluía otra vez, dejando entre un 2 y un 10 por ciento de la intensidad prevista — presente en el código, ausente en pantalla.'],

  'Landing buttons unreadable on three light themes':
    ['Botones de la página de inicio ilegibles en tres temas claros',
     'Una regla que ponía el texto casi blanco estaba pensada para la cabecera oscura de esos temas dentro de la app, pero la pantalla de inicio reutiliza la misma clase directamente sobre una página clara, dejando los botones de tema e idioma casi invisibles.'],

  'Every landing control excites the room':
    ['Cada control de la página de inicio anima la sala',
     'La misma reacción se extendió al botón de inicio de sesión y a las tres tarjetas de fuente, así que interactuar con cualquiera de ellos agita el horizonte, no solo el botón principal.'],

  'The skyline reacts to the demo button':
    ['El horizonte reacciona al botón de demo',
     'Pasar el ratón por el botón de demo hincha el espectro y acelera todas las barras, así que la pista nota que llega el drop. Los navegadores que no pueden hacerlo simplemente mantienen la animación en reposo.'],

  'The landing page as a chart show going on air':
    ['La página de inicio como un programa de listas que sale al aire',
     'Veinticuatro barras de frecuencia teñidas con el acento respiran a lo largo del borde inferior, cada una con su propia altura, fase y tempo, para que parezca un analizador real y no un patrón que se repite.'],

  'The demo button as a now playing chip':
    ['El botón de demo como un indicador de "sonando ahora"',
     'La píldora simple pasó a tener aspecto de reproductor, con tres barras de ecualizador bailando, que se congelan a alturas escalonadas para quien haya pedido menos movimiento, y un barrido de degradado al pasar el ratón.'],

  'Charts appear before a long history finishes downloading':
    ['Los charts aparecen antes de que termine de descargarse un historial largo',
     'En una primera conexión con un historial grande, antes mirabas un esqueleto y un contador de páginas hasta que llegaban todas. Ahora los charts se dibujan en cuanto llegan las 20 páginas más recientes, unas 4.000 reproducciones, mientras el resto sigue descargándose detrás.'],

  'About 1.8 MB of code no longer blocks first paint':
    ['Unos 1,8 MB de código ya no bloquean el primer dibujado',
     'Tres bibliotecas grandes que solo se usan para exportar imágenes y para importar de Spotify y Deezer se quitaron de la página por completo y ahora se descargan la primera vez que de verdad hacen falta.'],

  'Last.fm sync fetches only what is new':
    ['La sincronización de Last.fm solo descarga lo nuevo',
     'Una sincronización volvía a descargar todas las páginas de tu historial. Ahora solo pide las escuchas más nuevas que lo ya guardado, que normalmente es una sola página. La descarga completa ocurre en la primera conexión, después de borrar la caché o una vez a la semana.'],

  'Instant load from the last copy':
    ['Carga instantánea desde la última copia',
     'Lo último que se guardó ahora se muestra al instante, por antiguo que sea, y se actualiza en silencio en segundo plano — sin esqueleto, sin reinicio. Esperar a la red antes de mostrar nada era lo más lento de abrir la app.'],

  'Album modal sections translated':
    ['Secciones de la ventana de álbum traducidas',
     'Historial en el chart, Mapa de calor de escucha, Historial de streaming y sus desplegables eran textos fijos en inglés que nunca se traducían, tanto en la ventana de álbum como en la de canción y en los desplegables de las filas del chart.'],

  'Album chart section enlarged and made explorable':
    ['La sección de chart del álbum, más grande y explorable',
     'La tendencia mensual y la tabla de desglose tenían un texto demasiado pequeño para leer con comodidad. Todo el bloque se agrandó y ganó altura, y las barras ahora responden: al pasar el ratón muestran una cifra anclada y un brillo.'],

  'Spanish album modal wording corrected':
    ['Redacción corregida en la ventana de álbum en español',
     'La posición ahora se escribe como ordinal para que se lea como un puesto y no como la afirmación de ser un álbum top, los nombres de las certificaciones usan su forma traducida en lugar del inglés, y varias etiquetas abreviadas en español se escribieron completas.'],

  'Featured artist labels translated':
    ['Etiquetas del artista destacado traducidas',
     'La etiqueta del banner y todas las etiquetas y notas de los bloques se habían escrito como textos fijos en inglés que se saltaban por completo el sistema de traducción.'],

  'Featured artist album and song cards expanded':
    ['Tarjetas de álbum y canción del artista destacado, ampliadas',
     'Álbum y canción favoritos ahora eligen los más escuchados y muestran sus propias rachas de reproducciones y de días, calculadas de la misma forma que tiene en cuenta las colaboraciones. Se reescribieron varias etiquetas de bloques que sonaban raras.'],

  'Featured artist streaks made consistent':
    ['Rachas del artista destacado, ahora coherentes',
     'La racha de reproducciones y la racha del álbum favorito usaban definiciones distintas y ninguna contaba las colaboraciones como continuación de la racha de un artista, lo que permitía que la racha del álbum superara a la racha de reproducciones que la contiene. Ahora las dos recorren la misma línea de tiempo con la misma forma de coincidir.'],

  'Artist Milestone artwork falls back too':
    ['Las imágenes de Hitos de artista también tienen respaldo',
     'Las filas se quedaban vacías cuando la única fuente consultada no encontraba la canción del hito.'],

  'Listening Streaks recap reworked':
    ['Resumen de Rachas de escucha rehecho',
     'Un contador en directo de la racha actual y un enlace a la ventana de rachas quedan raros en una vista retrospectiva, así que se sustituyeron por una cifra de cobertura de días activos, y las tarjetas de récords ahora dicen claramente qué son.'],

  'Wrong artist photos corrected':
    ['Fotos de artista equivocadas corregidas',
     'Buscar un nombre de artista suele devolver varios perfiles sin relación que comparten nombre, incluidas entradas vacías, y se tomaba el primero fuera cual fuera. Ahora las coincidencias con el mismo nombre se ordenan por seguidores y se filtran las imágenes en blanco conocidas.'],

  'Soundtrack artwork falls back properly':
    ['Las imágenes del Soundtrack tienen un respaldo de verdad',
     'Las tarjetas del coverflow solo probaban una fuente y se rendían, a diferencia de las tablas del chart, que prueban varias. La imagen de la tarjeta central también se puede pulsar para cambiar de fuente a mano, y la elección se recuerda.'],

  'January compared against the previous December':
    ['Enero, comparado con el diciembre anterior',
     'Enero no tenía con qué compararse dentro de un periodo filtrado por año, así que ahora usa el diciembre anterior, y muestra un cero plano cuando de verdad no hay datos anteriores para que el diseño siga siendo coherente.'],

  'Chart History Replay redesigned':
    ['Repetición del historial del chart rediseñada',
     'Fotos de artistas, insignias de movimiento, una barra de avance y controles de reproducir, pausa y velocidad. Las filas ahora se mantienen entre semanas y se deslizan a sus nuevas posiciones, como en la carrera de barras del chart principal, en lugar de parpadear con contenido nuevo en cada paso.'],

  'Awards never appeared on the Soundtrack tab':
    ['Los premios nunca aparecían en la pestaña Soundtrack',
     'La consulta intentaba recorrer un objeto simple como si fuera una lista, lo que da error, y abandonaba en silencio la sección entera cada vez. Además se rehízo como tarjetas de vitrina de trofeos con imagen y número de victorias.'],

  'Milestone lists paginated':
    ['Listas de hitos paginadas',
     'La lista de artistas nunca tuvo realmente un límite de altura, porque la regla que recortaba solo nombraba la otra lista, así que un historial largo volcaba casi todo de golpe. Ahora ambas van en una caja de altura fija que muestra 25 cada vez.'],

  'A time zone bug in the streak count':
    ['Un fallo de zona horaria en el recuento de rachas',
     'El recorrido por tu racha actual mezclaba fechas leídas como hora universal con fechas leídas como hora local, lo que podía contar de menos y producir una racha actual más larga que la mejor de todos los tiempos con la que se comparaba. Una racha en curso que bate el récord ahora se integra en la tarjeta de todos los tiempos con una insignia de Nuevo récord, en lugar de dos tarjetas que se contradicen.'],

  'More milestone checkpoints':
    ['Más puntos de control de hitos',
     'Los totales generales ahora marcan cada 25.000 a partir de 10.000, cerrando un salto directo de 100.000 a 250.000 que se saltaba números redondos como 200.000. Los puntos de control de artista avanzan cada 500 en lugar de pararse en 10.000, y dividen los créditos separados por comas como el resto de la pestaña.'],

  'Milestones split into yours and artists\'':
    ['Hitos divididos en los tuyos y los de los artistas',
     'La sección se leía como una sola línea de tiempo, lo que hacía que un artista superando una cifra de reproducciones pareciera uno de tus propios totales de escucha. Ahora son dos secciones claramente etiquetadas.'],

  'Monthly Activity became inspectable':
    ['Actividad mensual, ahora explorable',
     'Las barras eran pequeñas, con poco contraste y estáticas. Cada mes es ahora un objetivo táctil que abre su recuento, su parte del total, el cambio respecto al mes anterior y el artista principal, con una insignia dorada en el pico, rayas en los meses tranquilos y una píldora de impulso que compara la segunda mitad del periodo con la primera.'],

  'Generic silhouette avatars filtered out':
    ['Se filtran los avatares genéricos de silueta',
     'Deezer devuelve un gráfico fijo de "sin foto" en lugar de un resultado vacío, así que el filtro pensado para detectar imágenes que faltan lo dejaba pasar como si fuera una foto real.'],

  'Coverflow polish and split artist credits':
    ['Pulido del coverflow y créditos de artista divididos',
     'Cabeceras más grandes, espaciado más ajustado, y el emoji de medalla sustituido por numerales simples sobre un degradado, porque los emojis se ven distintos en cada sistema y costaba leerlos a ese tamaño. Los créditos separados por comas ahora cuentan para cada artista.'],

  'Coverflow scrolling overshot':
    ['El desplazamiento del coverflow se pasaba',
     'Cada paso de la rueda movía unas 1,7 tarjetas, saltándose directamente la entrada vecina. Ahora cada evento se limita a una tarjeta. Las imágenes y el texto se agrandaron en toda la sección.'],

  'Top Artists and Songs as coverflow':
    ['Artistas y canciones principales como coverflow',
     'Las dos listas de top cinco pasaron a ser carruseles a todo lo ancho con los cincuenta primeros, manejables arrastrando, con la rueda, el teclado o el tacto.'],

  'At-risk saving covers artist and album streaks':
    ['Guardar las rachas en riesgo incluye las de artistas y álbumes',
     'Guardar lista y Copiar lista de canciones solo incluían rachas de canciones, así que las rachas de artistas y álbumes en riesgo ese día se quedaban fuera en silencio. Ahora añaden la canción escuchada más recientemente de cualquiera que no esté ya representado, revisando álbumes antes que artistas para no duplicar nada.'],

  'Loyalty Score as a chart stamp':
    ['La puntuación de fidelidad como un sello del chart',
     'El anillo plano y las tarjetas genéricas pasaron a ser un matasellos inclinado, un veredicto con trazo de rotulador, un recuento de artistas que vuelven y tarjetas de artista con forma de entrada con bordes perforados.'],

  'Larger, clearer stat tiles':
    ['Bloques de estadísticas más grandes y claros',
     'Los iconos pasaron a ir en línea con sus etiquetas y se aumentaron todos los tamaños para que se lean mejor.'],

  'The number one artist as a banner':
    ['El artista número uno como banner',
     'Una tarjeta destacada más grande con un banner de foto difuminado detrás del texto y un collage de estadísticas solo de ese artista: días escuchado, su mejor día, rachas de días y de reproducciones, álbumes y canciones escuchados, racha del álbum favorito y canción más escuchada.'],

  'The Reel':
    ['El Carrusel',
     'Hacer clic en cualquiera de las estadísticas principales cambia un carrusel bajo la franja que muestra lo que hay detrás de ese número, reutilizando las tarjetas de la Máquina del Tiempo y su menú de acciones.'],

  'Your Soundtrack rebuilt as a story':
    ['Tu Soundtrack rehecho como una historia',
     'Un rediseño completo: una portada en bloques de color, bloques de estadísticas, una línea de tiempo de hitos, tarjetas de racha con llamas y un anillo de fidelidad circular. Nuevos descubrimientos pasó a ser un tanque flotante de retratos de artistas que suben, flotan y se reciclan sin fin, ponderado para que tus más escuchados reaparezcan más a menudo, y que se detiene al pasar el ratón.'],

  'Section display toggles were not syncing':
    ['Los interruptores de visualización de secciones no se sincronizaban',
     'La lista de ajustes que sincronizar nombraba una clave antigua que ya nada usaba en lugar de la actual, así que los interruptores del menú de tres puntos se guardaban en local pero nunca llegaban a tu cuenta, y se reiniciaban en un navegador nuevo.'],

  'The same menu on Recent Releases':
    ['El mismo menú en Lanzamientos Recientes',
     'Estos ya han salido, así que el menú ofrece también el reproductor — pero solo cuando el álbum tiene de verdad historial de reproducciones; si no, vuelve a las opciones de búsqueda.'],

  'Sub-chart toggles showing on the wrong tabs':
    ['Los botones de sub-charts aparecían en las pestañas equivocadas',
     'Los botones Chart, Casi en el Top, Fuera del Ranking y Nuevas Entradas seguían visibles en Eventos, Récords, Premios y Base de datos, porque solo se ocultaban las secciones y no la barra de botones de al lado.'],

  'The same menu on Upcoming Releases':
    ['El mismo menú en Próximos Lanzamientos',
     'Se extendió a las secciones de próximos lanzamientos en los cuatro modos de vista. Aquí no hay opción de reproductor, porque esos discos aún no han salido.'],

  'Time Machine cards offer a choice':
    ['Las tarjetas de la Máquina del Tiempo ofrecen opciones',
     'Hacer clic en una tarjeta ejecutaba una sola acción fija. Ahora abre un pequeño menú: buscar en Spotify, buscar en Google o usar el reproductor de la app. Los artistas y álbumes también ofrecen sus últimas diez canciones, para ponerlas en cola de una en una o todas a la vez.'],

  'Larger navigation text':
    ['Texto de navegación más grande',
     'Las etiquetas de las pestañas eran demasiado pequeñas para leerlas con comodidad.'],

  'Album streaks nest inside artist runs':
    ['Las rachas de álbum se anidan dentro de las del artista',
     'Escuchar una discografía álbum por álbum producía una racha de álbum que se reiniciaba con cada disco, ocultando la racha más larga del artista debajo. Ahora la racha del artista se trata como la racha real y es la que manda en el banner, con el álbum actual como una etiqueta interior en lugar de competir con ella.'],

  'Chart titles cut off on dark themes':
    ['Títulos de chart cortados en los temas oscuros',
     'Un fondo de píldora y un relleno sobrantes, que todos los temas claros ya habían quitado, seguían en los temas oscuros, y ese relleno extra bastaba para empujar el título más allá del punto en que se corta en un teléfono.'],

  'New Entries headers made scannable':
    ['Cabeceras de Nuevas Entradas fáciles de leer de un vistazo',
     'La cabecera era una frase larga que hacía de título, así que distinguir las tres secciones obligaba a leerla entera. Ahora cada una tiene un nombre corto con el detalle debajo como subtítulo.'],

  'Lifetime weeks and final streak separated':
    ['Semanas totales y racha final, por separado',
     'La cifra de semanas de una salida es un total de toda la vida que puede abarcar varias etapas separadas, y se había sustituido solo por la racha que terminó, perdiendo ese contexto. Ha vuelto, y una etiqueta distinta indica ahora por separado la racha consecutiva final cuando la hubo.'],

  'Peak rank on dropouts':
    ['Posición máxima en las salidas',
     'Una salida que antes estuvo mejor que la posición de la que acaba de caer lleva su pico, que solo se muestra cuando de verdad supera esa última posición, para no repetir lo obvio.'],

  'Dropouts linked to where they landed':
    ['Las salidas, enlazadas con dónde han caído',
     'Cada salida se cruza con la zona Casi en el Top de esta semana y muestra su nueva posición ahí con las mismas insignias que usa esa sección, así que una canción que sale del chart y aparece justo debajo se lee como un solo suceso y no como dos sin relación.'],

  'Off the Chart improved':
    ['Fuera del Ranking mejorado',
     'Un mensaje de celebración cuando no ha salido nada, en lugar de que la sección desaparezca sin más; la cifra de semanas aclarada para que no se confunda con la racha de Casi en el Top; y las salidas desde una posición alta marcadas como las pérdidas más serias que son.'],

  'Streak banner edges misaligned on mobile':
    ['Bordes del banner de racha desalineados en el móvil',
     'El banner iba con margen mientras las barras de arriba y abajo llegaban de borde a borde, así que sus bordes no cuadraban. Ocultar un espaciador en el móvil también había amontonado la etiqueta y el número a un lado en lugar de ocupar toda la barra.'],

  'Navigation hint quietened':
    ['La pista de navegación, más discreta',
     'La píldora flotante con fondo y borde pasó a ser un texto de pie apagado y sencillo, pegado a la barra de arriba en lugar de flotar en un hueco.'],

  'This Week\'s stats given a hierarchy':
    ['Las estadísticas de Esta semana, con jerarquía',
     'Doce bloques iguales con borde pasaron a ser tres niveles: totales principales, destacados y tarjetas con imagen para las cifras del momento, cada categoría con su propio color de acento.'],

  'Navigation inside the Charts Guide':
    ['Navegación dentro de la Guía de Charts',
     'Veinte secciones apiladas sin forma de llegar directamente a ninguna. Se añadió una fila fija de enlaces de salto, los enlaces ahora pueden apuntar a una sección concreta, y las secciones solo de consulta se pliegan por defecto para que la página se pueda recorrer de un vistazo.'],

  'Stack ranks invisible on light themes':
    ['Posiciones de la vista Pila invisibles en los temas claros',
     'Los números de posición estaban fijados a un blanco translúcido que solo se cambiaba para los tres primeros, así que del cuarto puesto hacia abajo desaparecían sobre un fondo claro.'],

  'Proper icons on the chart toggles':
    ['Iconos de verdad en los botones del chart',
     'Los botones de tipo y las cabeceras de sección pasaron de glifos unicode y emojis a iconos dibujados.'],

  'Album certifications as vinyl cards':
    ['Certificaciones de álbum como tarjetas de vinilo',
     'La cuadrícula plana de insignias de la ventana de álbum se sustituyó por el mismo marco por niveles y el disco giratorio del Muro de Certificaciones, con las portadas reales cargadas.'],

  'Open a detail page from any view':
    ['Abre una página de detalle desde cualquier vista',
     'Solo la vista de tabla dejaba entrar en un artista, álbum o canción. Ahora lo permiten todas, y la pista de cada fila pasó al subtítulo de la sección, donde se dice una vez y no en cada línea. La vista Pila también ganó los títulos de las canciones, que se saltaba.'],

  'Show one chart type at a time':
    ['Muestra un tipo de chart cada vez',
     'Un selector encima de las secciones del chart muestra solo Canciones, Artistas o Álbumes, junto con el Casi en el Top, el Fuera del Ranking y las Nuevas Entradas de ese tipo. La elección se recuerda y se mantiene al moverte entre periodos.'],

  'Mobile navigation rebuilt as an icon grid':
    ['La navegación móvil, rehecha como cuadrícula de iconos',
     'El diseño de escritorio apretaba las etiquetas traducidas en filas irregulares en el teléfono, y el desplazamiento horizontal pensado como respaldo recortaba en silencio Listas de reproducción y Guía de Charts por completo, porque el manejo del desbordamiento de la segunda fila — necesario para su animación de plegado — se tragaba el desplazamiento. Las pestañas también se reordenaron para el teléfono.'],

  'Play buttons on Off the Chart entries':
    ['Botones de reproducción en las entradas de Fuera del Ranking',
     'Las canciones suenan directamente y los artistas y álbumes abren el selector de canciones, como en las otras secciones, y el interruptor de mostrar u ocultar de cada sección ahora también los cubre.'],

  'Off the Chart split by type':
    ['Fuera del Ranking dividido por tipo',
     'El único panel combinado de tres columnas pasó a ser tres secciones independientes, cada una justo debajo del bloque Casi en el Top de su tipo, así que canciones, artistas y álbumes se leen cada uno como una historia continua.'],

  'Three more surface colours frozen on the dark theme':
    ['Tres colores de superficie más, congelados en el tema oscuro',
     'El mismo fallo que el del color de texto anterior: tres valores de superficie se definían una sola vez dentro del tema oscuro por defecto en lugar de en cada tema, así que todos los temas claros volvían en silencio a un relleno azul marino oscuro donde se usaban, incluidas las tarjetas de categoría de Premios. También se corrigieron varios colores fijos de Premios.'],

  'Best Day tile recoloured':
    ['El bloque Mejor día, con nuevo color',
     'Ahora usa el mismo acento que Reproducciones totales en lugar de ámbar, emparejando las dos cifras que tiene al lado.'],

  'Spanish previous-rank header shortened':
    ['Cabecera de posición anterior en español, acortada',
     'Se desbordaba y saltaba de línea donde las demás cabeceras de columna no lo hacían.'],

  'A text colour frozen on the default theme':
    ['Un color de texto congelado en el tema por defecto',
     'Un color de texto solo se definía dentro del tema oscuro por defecto, así que su valor se quedaba en el casi blanco de ese tema y los demás temas lo heredaban en lugar del suyo. En los temas claros eso hacía casi invisibles cosas como los nombres de las listas.'],

  'Gold certification icon changed to a coin':
    ['El icono de certificación de Oro pasa a ser una moneda',
     'La estrella chocaba con las estrellas que ya se usan para los picos del chart y los rankings anuales, así que las insignias de oro se leían como otro marcador de pico. Se cambió en todos los sitios donde aparece una insignia de oro.'],

  'Options menu wrapping off the header':
    ['El menú de opciones saltaba fuera de la cabecera',
     'Cuando el título de un chart era largo, el botón del menú pasaba a la línea siguiente y arrastraba su desplegable al borde equivocado. Ahora se corta el título.'],

  'Chart run button given its own column':
    ['El botón del recorrido tiene su propia columna',
     'Compartía la celda de la posición, así que la columna de posición a veces mostraba un icono en lugar de un número. Ahora tiene columna propia en todas las tablas del chart y ventanas de historial, y usa un icono de línea en lugar de un emoji de color.'],

  'Previous rank moved next to Rank':
    ['La posición anterior, junto a la posición',
     'La posición anterior ahora va justo después de la posición en lugar de más adelante en la fila, donde la comparación es realmente útil, con un subtítulo apilado que la identifica.'],

  'Backend security updates':
    ['Actualizaciones de seguridad del servidor',
     'Se cerraron diez vulnerabilidades reportadas en dependencias del servidor, entre ellas contrabando de peticiones, una evasión de restricciones entre orígenes, una sobrescritura mediante enlaces simbólicos y una fuga de credenciales.'],

  'Tactile date navigation':
    ['Navegación de fechas táctil',
     'Los botones de anterior y siguiente se hunden al pulsarlos y se muestran como chevrones de verdad en lugar de flechas de texto, con sus etiquetas conservadas en todos los idiomas.'],

  'Stylesheet cache bumped again':
    ['Caché de la hoja de estilos renovada otra vez',
     'La reducción de la navegación no aparecía porque el navegador servía la hoja de estilos en caché bajo una dirección que no había cambiado.'],

  'Second navigation row reads as secondary':
    ['La segunda fila de navegación se lee como secundaria',
     'Texto más pequeño, espaciado más ajustado y una bajada de opacidad en reposo que vuelve al máximo al pasar el ratón, para que Récords, Eventos y Premios queden visiblemente por debajo de las pestañas principales de periodo.'],

  'A sliding indicator on the tabs':
    ['Un indicador deslizante en las pestañas',
     'Una barra por fila se desliza hasta la pestaña activa con un movimiento elástico, sustituyendo a un subrayado que saltaba de golpe entre botones.'],

  'The play count rolls like an odometer':
    ['El contador de reproducciones gira como un cuentakilómetros',
     'Cada dígito que cambia gira desde su valor anterior al sincronizar, en lugar de cambiar el número entero de golpe.'],

  'Stat cards paired with their counterparts on mobile':
    ['Tarjetas de estadísticas emparejadas con su pareja en el móvil',
     'Las tres franjas se funden en una sola cuadrícula en el teléfono, para que cada cifra principal quede junto a su tarjeta relacionada — Reproducciones totales junto a Mejor día — sin cambiar en absoluto el diseño de escritorio.'],

  'Streak close button overlapping the filter bar':
    ['El botón de cerrar de rachas se superponía a la barra de filtros',
     'Los dos estaban fijados al mismo punto en la parte superior del área desplazable en el móvil y se dibujaban uno encima del otro.'],

  'Oversized placeholders on releases without artwork':
    ['Marcadores enormes en lanzamientos sin portada',
     'El marcador con iniciales usaba siempre el tamaño grande de mosaico, así que un lanzamiento sin portada mostraba una caja enorme en la vista de tabla en lugar de una miniatura normal.'],

  'Masthead controls get out of the way on mobile':
    ['Los controles de la cabecera se apartan en el móvil',
     'Los botones de tema, día e idioma se desvanecen tras unos segundos sin desplazarte y vuelven al desplazarte o abrir un panel, para no quedarse encima del contenido en reposo. También se subieron por encima de la barra de fecha fija, con la que chocaban.'],

  'Size tab back to a list':
    ['La pestaña Tamaño vuelve a ser una lista',
     'La cuadrícula de dos columnas de píldoras rellenas no funcionaba visualmente; volvió a la misma lista de filas que usa la pestaña Vista.'],

  'Stale stylesheet served through the menu rewrite':
    ['Se servía una hoja de estilos antigua tras rehacer el menú',
     'No se había subido la versión de la hoja de estilos, así que los navegadores podían seguir sirviendo una copia antigua en caché — incluido un fallo de diseño ya arreglado — aunque todo lo demás se hubiera actualizado.'],

  'Chart controls gathered into one menu':
    ['Los controles del chart, reunidos en un solo menú',
     'Las filas dispersas de botones para visualización, tamaño, vista, exportar, compartir y reproducir se unificaron en un único menú de opciones en la cabecera de cada sección, con pestañas Mostrar, Tamaño, Vista y Acciones, que recuerda la última pestaña que usaste.'],

  'Page through the streak graveyard':
    ['Pasa páginas por el cementerio de rachas',
     'Las rachas terminadas se limitaban a las 25 primeras sin forma de ver más allá. La paginación hace accesibles todas las rachas terminadas.'],

  'Hiding play buttons missed two sections':
    ['Ocultar los botones de reproducción se olvidaba de dos secciones',
     'El interruptor de cada sección solo cubría las tres secciones principales del chart, así que Casi en el Top y Nuevas Entradas seguían mostrando sus botones de reproducción después de desactivarlos.'],

  'Calendar numbers matched':
    ['Números del calendario igualados',
     'El año junto al nombre del mes y los números de los días en los calendarios de eventos y de New Music Friday.'],

  'Awards numbers matched':
    ['Números de Premios igualados',
     'El selector de año, las insignias de año y el contador de pasos de la ceremonia.'],

  'Soundtrack milestones and streaks matched':
    ['Hitos y rachas del Soundtrack igualados',
     'Los titulares restantes con números y los recuentos de rachas.'],

  'Your Soundtrack numbers matched':
    ['Números de Tu Soundtrack igualados',
     'El año grande, las estadísticas, los recuentos del artista y la canción principales, las cifras de actividad mensual y el porcentaje de fidelidad pasaron todos a la fuente compartida.'],

  'Guide year numbers matched':
    ['Años de la guía igualados',
     'Los años de la sección "un día como hoy" de la guía.'],

  'Guide statistics matched to the rest':
    ['Estadísticas de la guía igualadas con el resto',
     'Los números de resumen de la Guía de Charts seguían con la fuente antigua.'],

  'Wordmark and stat numbers settle on one face':
    ['El logotipo y los números de estadísticas se quedan con una sola fuente',
     'Tras probar ambos experimentos, el logotipo y los números grandes se unificaron en la fuente sans de la interfaz que ya existía, y se recuperó el espaciado entre letras ahora que los glifos vuelven a ser proporcionales.'],

  'Wordmark in Martian Mono':
    ['El logotipo en Martian Mono',
     'Una fuente monoespaciada distinta solo para el logotipo, con su tamaño máximo reducido porque sus glifos más anchos necesitan más espacio.'],

  'Wordmark on the mono face':
    ['El logotipo en la fuente monoespaciada',
     'El logotipo pasó a la fuente monoespaciada para que todo el bloque de la cabecera se lea como una sola tipografía, con el espaciado suavizado para acompañar.'],

  'Stat numbers in a scoreboard face':
    ['Números de estadísticas en una fuente de marcador',
     'Ni la fuente de títulos ni la monoespaciada iban bien con los números grandes, así que se dibujaron seis candidatas reales para compararlas y se eligió una condensada en negrita, más cercana a una cuenta atrás de listas.'],

  'Stat numbers in the data font':
    ['Números de estadísticas en la fuente de datos',
     'Las cifras grandes pasaron a la misma fuente que ya se usaba para las reproducciones en las tablas.'],

  'Redesign review fixes':
    ['Arreglos de la revisión del rediseño',
     'Se hacía referencia a tres valores de apilamiento que nunca llegaron a definirse, porque el script que debía añadirlos se detuvo antes de escribir, dejando diez reglas de superposiciones y descripciones emergentes sin ningún orden de apilamiento. Se definieron y se corrigieron a sus valores originales.'],

  'Redesign: the standalone pages caught up':
    ['Rediseño: las páginas independientes se ponen al día',
     'La guía de configuración y las páginas de privacidad y términos pasaron a las nuevas fuentes y paletas suavizadas, y se arregló un desbordamiento que ya existía en la cuadrícula de pasos de la guía y en la tabla de datos de privacidad.'],

  'Redesign: mobile overflow eliminated':
    ['Rediseño: eliminado el desbordamiento en el móvil',
     'Las barras de tamaño de sección desbordaban las pantallas estrechas y la cabecera era dos píxeles demasiado ancha. A 375 píxeles la página ya no tiene ningún desbordamiento horizontal en ninguna vista, frente a una base que había estado entre 379 y 468 píxeles.'],

  'Redesign: modals, controls and focus':
    ['Rediseño: ventanas, controles y foco',
     'Las ventanas ganaron un desenfoque de cristal, bordes más redondeados y sombras más profundas. Todos los valores de apilamiento sueltos se pasaron a una sola escala documentada conservando exactamente el orden, y se añadió un anillo de foco visible para quien usa el teclado.'],

  'Redesign: tables and dense data':
    ['Rediseño: tablas y datos densos',
     'Un tono común al pasar el ratón en las tablas del chart, de la base de datos y de eventos, colores de medalla pasados a variables que cumplen el contraste en los temas claros, y se quitaron las antiguas franjas laterales de los tres primeros, porque el tinte de la fila ya lo dice.'],

  'Redesign: sections, depth and card grids':
    ['Rediseño: secciones, profundidad y cuadrículas de tarjetas',
     'Las tarjetas del chart ganaron bordes translúcidos y sombras en capas, Nuevas Entradas y Casi en el Top cambiaron sus franjas laterales por paneles interiores teñidos, y la franja de estadísticas pasó a ser tarjetas separadas que se elevan al pasar el ratón en lugar de una cuadrícula de hoja de cálculo de un píxel.'],

  'Redesign: masthead and navigation':
    ['Rediseño: cabecera y navegación',
     'La cabecera ahora obtiene su degradado y su brillo del tema en lugar de llevar una versión escrita a mano para cada tema, así que todos los temas oscuros se tiñen correctamente y se eliminaron cuatro reglas redundantes. Las cabeceras claras se suavizaron y la navegación se modernizó.'],

  'The 2026 redesign: tokens, colour and type':
    ['El rediseño de 2026: variables, color y tipografía',
     'La base de una renovación visual completa. Las diez paletas de temas se suavizaron y se comprobó su contraste, un único conjunto de valores de diseño controla ahora espaciado, redondeo, movimiento y profundidad, y la app pasó a una nueva pareja de tipografías. Se añadió a todos los temas un color de cuadrícula que faltaba y que hacía que las líneas de las gráficas salieran oscuras en los temas claros.'],

  'Chart tables fit a phone without sideways scrolling':
    ['Las tablas del chart caben en el teléfono sin desplazamiento lateral',
     'Los rellenos y anchos de columna estaban pensados para escritorio y empujaban la columna Reproducciones fuera del borde. Se ajustó el espaciado y se añadieron etiquetas de columna cortas, así que la tabla entera cabe entre 320 y 414 píxeles de ancho.'],

  'Modals that trapped you on a phone':
    ['Ventanas que te dejaban atrapado en el teléfono',
     'Las ventanas de fuente de datos, detalle y rachas podían ser más altas que la pantalla de un teléfono y dejar su botón de cerrar fuera de alcance, sin otra forma de salir. Ahora los controles de cerrar se quedan fijos en el móvil. De paso se arregló un desbordamiento horizontal.'],

  'Ten correctness bugs from a review pass':
    ['Diez errores de funcionamiento encontrados en una revisión',
     'Entre ellos: el mapa de calor y el historial de la ventana de canción siempre salían vacíos porque la clave que buscaban estaba codificada de una forma y guardada de otra; y cualquier nombre con apóstrofo rompía los controles asociados a él, porque la codificación dejaba los apóstrofos intactos. Nada de un nombre como "Guns N\' Roses" respondía.'],

  /* ========== JUNIO 2026 ========== */

  'Bubbling Under badges refined again':
    ['Insignias de Casi en el Top, afinadas otra vez',
     'Resurgente aparecía en canciones que caían del chart a la zona y se quedaban ahí, lo que no es un resurgimiento — nunca se fueron para volver. Esas ahora llevan una nueva insignia, Aguantando; Yo-Yo pasó a llamarse Va y Viene, y se actualizaron los iconos.'],

  'A different chart size per section':
    ['Un tamaño de chart distinto por sección',
     'Cada sección tiene su propio selector de tamaño en lugar de una barra global, recordado por separado en cada periodo, así que Canciones puede ser un top 10 mientras Artistas es un top 50 y Álbumes un top 25. Los ajustes globales existentes se trasladan en la primera carga.'],

  'Share button moved right':
    ['El botón Compartir, a la derecha',
     'En las secciones de artistas y álbumes, para igualarlas con las demás.'],

  'Album play buttons offered a track list everywhere':
    ['Los botones de reproducción de álbum ofrecen la lista de canciones en todas partes',
     'Fuera de la vista de tabla, darle a reproducir en un álbum buscaba el título del álbum como si fuera una canción. Ahora todas las vistas muestran la misma lista de canciones que la tabla.'],

  'Better default layouts':
    ['Mejores diseños por defecto',
     'Los artistas se abren en Mosaico y los álbumes en Cuadrícula de tarjetas, que les sientan mejor que una tabla.'],

  'Uniform action buttons':
    ['Botones de acción uniformes',
     'Un solo estilo coherente en los botones de acción, que pasan a ir debajo del subtítulo.'],

  'Section controls reorganised':
    ['Controles de sección reorganizados',
     'Los botones de acción a la izquierda y los interruptores de visualización a la derecha.'],

  'A different view mode per section':
    ['Un modo de vista distinto por sección',
     'Canciones, Artistas y Álbumes recuerdan cada uno su propio diseño, en lugar de cambiar los tres a la vez.'],

  'Display controls per section':
    ['Controles de visualización por sección',
     'El menú de visualización y el botón de exportar pasaron a la cabecera de cada sección, y Canciones, Artistas y Álbumes tienen cada uno su propio juego completo de interruptores — ocultar las insignias de certificación en canciones ya no las oculta en álbumes.'],

  'More room to breathe':
    ['Más espacio para respirar',
     'Más relleno dentro de las tarjetas, más espacio entre ellas y cabeceras más altas.'],

  'Chart sections became cards':
    ['Las secciones del chart se convierten en tarjetas',
     'Esquinas redondeadas, un borde, un fondo y relleno dan a cada sección su propia superficie en lugar de mezclarse unas con otras.'],

  'Copy Tracklist copies immediately':
    ['Copiar lista de canciones copia al instante',
     'El botón cambió de nombre y ahora copia la lista en cuanto se pulsa, y sigue abriendo la ventana para mostrar lo que se copió y confirmarlo.'],

  'Export your at-risk streaks as a tracklist':
    ['Exporta tus rachas en riesgo como lista de canciones',
     'Un cuarto botón en En riesgo hoy abre la ventana de exportación ya cargada con esas canciones en un formato que aceptan los servicios de transferencia, con sugerencias de nombre de lista pensadas para la ocasión.'],

  'Peak boxes made to stand out':
    ['Las casillas de pico destacan más',
     'La casilla que marca la semana del pico ganó un relleno más intenso y un brillo ámbar, con tratamientos dorado y morado distintos para los picos en el chart combinado y en la línea de tiempo de Casi en el Top.'],

  'Chart run boxes unreadable on light themes':
    ['Casillas del recorrido ilegibles en los temas claros',
     'Las casillas tenían un borde blanco que desaparecía, tintes demasiado tenues para verse y números de posición en neón. Se corrigieron los bordes, la intensidad del fondo y los colores del texto en los temas claros.'],

  'Bubbling Under badges invisible on light themes':
    ['Insignias de Casi en el Top invisibles en los temas claros',
     'Los trece tipos de insignia usaban una paleta neón que casi desaparecía sobre un fondo claro. Ahora cada una tiene una versión para temas claros con texto intenso del mismo tono sobre un tinte suave.'],

  'Navigation polish':
    ['Pulido de la navegación',
     'El botón Más pasó debajo de las dos filas, esquinas redondeadas y bordes, espacio alrededor del banner de racha e iconos renovados.'],

  'Eleven improvements to the navigation':
    ['Once mejoras en la navegación',
     'Iconos en cada pestaña, un subrayado que marca la activa, un tinte que distingue la segunda fila, vistas previas al pasar el ratón, las teclas 1 a 9 como atajos, insignias que marcan contenido nuevo, enlaces para compartir cada pestaña, un brillo de carga, una segunda fila plegable y una barra que se encoge al desplazarte.'],

  'The Charts Guide filled out':
    ['La Guía de Charts, completada',
     'Veinte secciones que cubren cada función: un recorrido guiado, búsqueda, tus estadísticas, una lista de configuración, un día como hoy, sugerencias, joyas ocultas, atajos de teclado, un repaso de cada pestaña, un glosario, preguntas frecuentes, una línea de tiempo, un registro de cambios, guías de exportación y un formulario de opiniones. La navegación se dividió en dos filas para hacer sitio.'],

  'The Charts Guide':
    ['La Guía de Charts',
     'Una pestaña que explica la app desde dentro, accesible desde la barra de navegación, junto con arreglos en nueve sitios donde los temas claros tenían un contraste ilegible.'],

  'Collapse All reads as a global control':
    ['Plegar todo se lee como un control general',
     'Tenía el estilo de una parte del menú de visualización de debajo. Se le quitó el fondo de barra de herramientas y se separó, para que se lea como algo que actúa sobre todas las secciones y no como otra opción de visualización más.'],

  'Light themes redesigned around white cards':
    ['Los temas claros, rediseñados en torno a tarjetas blancas',
     'Los cinco temas claros ahora ponen blanco puro detrás de las tablas del chart, las tarjetas y las ventanas, para que el contenido se despegue de la página, y la propia página lleva un tinte más saturado del color del tema que lo enmarca. Las cabeceras azul marino y morada se oscurecieron para seguir distinguiéndose de sus fondos más intensos.'],

  'Collapse All':
    ['Plegar todo',
     'Una barra encima de las secciones del chart pliega o despliega Canciones, Artistas, Álbumes, Fuera del Ranking, Casi en el Top y Nuevas Entradas con un clic, y se mantiene sincronizada cuando se abren o cierran secciones una a una.'],

  'Twelve improvements to the queue':
    ['Doce mejoras en la cola',
     'Las canciones ya reproducidas no desaparecen — se quedan atenuadas encima de la actual, con lo que viene debajo. Cada elemento ganó un botón para subirlo arriba, las eliminaciones se pueden deshacer durante cuatro segundos, los duplicados se quitan con un solo toque y la cola se puede guardar como lista.'],

  'The player redesigned as a vertical card':
    ['El reproductor, rediseñado como tarjeta vertical',
     'La estrecha franja horizontal con catorce botones repartidos en varias filas se sustituyó por una tarjeta de verdad: una cabecera con el asa para arrastrar y los controles de ventana, un gran cuadrado con la portada, una barra de avance a todo lo ancho, un botón de reproducir destacado flanqueado por repetir, saltar y volumen, y los once controles restantes en una sola fila fina debajo.'],

  'Clear the queue, and resume from Playlists':
    ['Vacía la cola, y reanuda desde Listas de reproducción',
     'Un botón para vaciar la cola y un botón Reanudar en la vista de Listas de reproducción.'],

  'Bubbling Under weeks in the normal chart run':
    ['Semanas en Casi en el Top dentro del recorrido normal',
     'El recorrido semanal normal ganó un interruptor que muestra las semanas en que una entrada se quedó cerca pero no entró, junto a las semanas en que estuvo en el chart.'],

  'Background playback guard stopped giving up':
    ['La protección de reproducción en segundo plano ya no se rinde',
     'Las pausas automáticas repetidas superaban el único reintento, y el controlador borraba su propio estado mientras la pestaña seguía oculta, así que dejaba de intentarlo tras reanudar una vez.'],

  'Backend woken before you need it':
    ['El servidor se despierta antes de que lo necesites',
     'El servidor se duerme cuando está inactivo y tarda unos 30 segundos en despertar, y eso se pagaba justo al pulsar reproducir. Ahora se le avisa al cargar la página y al dibujar el chart, y el bucle de reintentos espera lo suficiente para cubrir un arranque en frío.'],

  'Playback stopped pausing itself in the background':
    ['La reproducción ya no se pausa sola en segundo plano',
     'Salir de la pestaña hacía que el vídeo se pausara a la fuerza. Ahora esas pausas se detectan y se reanudan al momento. Se añadieron botones de anterior y siguiente a la notificación de Android.'],

  'Chart and Bubbling Under on one timeline':
    ['Chart y Casi en el Top en una sola línea de tiempo',
     'Un interruptor une las semanas que una entrada pasó en el chart con las que pasó justo debajo en un solo recorrido cronológico, así que una trayectoria que cruzó la línea una y otra vez se lee como una sola historia.'],

  'Preview a Bubbling Under week':
    ['Vista previa de una semana de Casi en el Top',
     'Hacer clic en la casilla de una semana muestra toda la clasificación de la zona esa semana con la entrada resaltada, y un enlace al chart.'],

  'Bubbling Under chart runs':
    ['Recorridos en Casi en el Top',
     'Cada entrada puede desplegar un recorrido que muestra solo su tiempo en la zona: semanas totales, mejor posición, racha más larga, etapas separadas, reproducciones máximas y una casilla por semana.'],

  'Lock screen playback on Android':
    ['Reproducción con la pantalla bloqueada en Android',
     'La canción actual se registra en el sistema operativo, así que la reproducción continúa al bloquear la pantalla o cambiar de app, y los controles de la pantalla de bloqueo funcionan.'],

  'Search said no results when the server was waking':
    ['La búsqueda decía que no había resultados mientras el servidor despertaba',
     'La búsqueda con varios resultados no sabía manejar un servidor dormido, así que decía que no había encontrado nada en lugar de esperar.'],

  'Play or save your at-risk streaks':
    ['Reproduce o guarda tus rachas en riesgo',
     'La sección En riesgo hoy ganó Reproducir todo, Poner todo en cola y Guardar lista, que es justo la sección donde actuar enseguida es lo único que importa.'],

  'Track lists on artist and album play buttons':
    ['Listas de canciones en los botones de reproducción de artistas y álbumes',
     'Reproducir un artista o un álbum es ambiguo, así que el botón ahora abre una lista con las últimas diez canciones suyas que escuchaste, cada una con botones de reproducir y poner en cola, más Reproducir todo y Poner todo en cola. Las filas de canciones siguen sonando directamente.'],

  'Bubbling Under names its chart size':
    ['Casi en el Top dice el tamaño de su chart',
     'El título dice por debajo de qué chart están las entradas.'],

  'Play or save a day\'s singles from the calendar':
    ['Reproduce o guarda los sencillos de un día desde el calendario',
     'Ver un solo día de sencillos en el calendario ahora ofrece Reproducir todo, Crear lista y Exportar.'],

  'The Playlists tab':
    ['La pestaña Listas de reproducción',
     'Un gestor de listas completo: despliega una lista, reproduce desde cualquier canción, cambia el nombre ahí mismo, arrastra para reordenar, quita canciones y borra listas. Las listas se sincronizan con tu cuenta y se combinan cuando inicias sesión en otro sitio, así que sobreviven al cambiar de navegador y de dispositivo.'],

  'Bubbling Under weeks counted one too many':
    ['Casi en el Top contaba una semana de más',
     'La semana actual se contaba dos veces, así que cada entrada parecía una semana más antigua de lo que era y un debut aparecía como dos semanas.'],

  'Collaborations scrobbled with the right album':
    ['Las colaboraciones se registran con el álbum correcto',
     'Los créditos con invitados y los separados por comas se enviaban enteros, así que las búsquedas fallaban. Ahora se usa el artista principal, y la app busca el álbum en tu propio historial antes de preguntar a Last.fm, lo que es más fiable y ahorra una petición.'],

  'Play buttons on single releases':
    ['Botones de reproducción en los sencillos',
     'Las tarjetas de sencillos en Lanzamientos Recientes ganaron un botón de reproducción.'],

  'Play buttons in Bubbling Under':
    ['Botones de reproducción en Casi en el Top',
     'Las entradas de la zona se pueden reproducir como cualquier otra fila.'],

  'Missing albums looked up before scrobbling':
    ['Los álbumes que faltan se buscan antes del scrobble',
     'Cuando una canción no tiene álbum en tu historial, el reproductor ahora pregunta a Last.fm en cuanto empieza la reproducción, así que la respuesta llega antes de que salte el scrobble a los 30 segundos.'],

  'Player was scrobbling a dash as the album name':
    ['El reproductor registraba un guion como nombre del álbum',
     'Las canciones sin álbum conocido guardan un guion como marcador, y la comprobación de si existía el álbum lo trataba como un valor real, así que Last.fm recibía un guion literal.'],

  'Freefall and Yo-Yo badges':
    ['Insignias Caída Libre y Yo-Yo',
     'Caída Libre marca la mayor bajada de reproducciones de la semana, y Yo-Yo marca las entradas que han entrado y salido de la zona tres o más veces.'],

  'Weeks spelled out in Off the Chart':
    ['Semanas escritas completas en Fuera del Ranking',
     'Igual que el cambio hecho en Casi en el Top.'],

  'Suggestions while editing a play':
    ['Sugerencias al editar una reproducción',
     'Los campos de artista, canción y álbum ahora sugieren valores de tu propio historial mientras escribes, que es la diferencia entre corregir un nombre y tener que volver a escribirlo exacto.'],

  'Consecutive streaks in Bubbling Under':
    ['Rachas consecutivas en Casi en el Top',
     'Junto al total de todos los tiempos, cada entrada muestra su racha actual sin interrupción en la zona, que aparece a partir de dos semanas y se reinicia cuando sale.'],

  'Fallen badge narrowed':
    ['La insignia Caído, más precisa',
     'Ahora solo marca las entradas que cayeron a la zona directamente desde los tres primeros puestos.'],

  'Bubbling Under badges made history-aware':
    ['Las insignias de Casi en el Top ahora tienen en cuenta el historial',
     'Cayendo aparecía en todo lo que alguna vez estuvo en el chart, y no solo en las entradas que cayeron la semana pasada. La insignia de posible despegue se sustituyó por otras que leen todo el historial: Nuevo para una primera aparición, En Alza para semanas consecutivas sin haber entrado nunca en el chart, y Persistente cuando eso pasa de cinco semanas.'],

  'Weeks spelled out in Bubbling Under':
    ['Semanas escritas completas en Casi en el Top',
     'La insignia de semanas abreviada se escribió completa.'],

  'Bubbling Under on yearly and all-time charts':
    ['Casi en el Top en los charts anuales e históricos',
     'Esas vistas se dibujan por otro camino que nunca ocultaba la sección.'],

  'Bubbling Under leaking into other tabs':
    ['Casi en el Top se colaba en otras pestañas',
     'Seis pestañas terminan antes de que llegue a ejecutarse el código que habría ocultado la sección, así que se quedaba en pantalla donde no tenía sentido.'],

  'Bubbling Under':
    ['Casi en el Top',
     'Una sección que muestra las canciones, artistas y álbumes que se quedan justo fuera del chart — los diez siguientes, o cincuenta en un top 100 — para que los que se quedan a las puertas sean visibles y no invisibles. Cada entrada indica cuántas reproducciones le faltan, e insignias de caída, posible despegue y semanas pasadas en la zona.'],

  'Compact view columns rethought':
    ['Columnas de la vista Compacta replanteadas',
     'Los emojis de medalla se sustituyeron por números de posición que conservan sus colores de podio, y la columna combinada de movimiento se dividió en semanas en el chart y posición anterior, igual que en la vista de tabla.'],

  'Compact play button and arrow alignment':
    ['Botón de reproducción y flechas alineados en Compacta',
     'El botón de reproducción cambió de color y las flechas de movimiento se centraron.'],

  'Clearer click targets in Stack view':
    ['Zonas de clic más claras en la vista Pila',
     'Las canciones se despliegan ahí mismo, mientras que hacer clic en el título de un artista o álbum abre su página.'],

  'New and returning edges visible on podium cards':
    ['Los bordes de nuevo y regreso, visibles en las tarjetas de podio',
     'El brillo de oro, plata y bronce tapaba el borde verde azulado y morado que marca una entrada nueva o que regresa. Ahora el brillo se recorta a tres lados para que se vean los dos.'],

  'Movement colours across every view':
    ['Colores de movimiento en todas las vistas',
     'Los colores de barra y los bordes de entrada según el movimiento se extendieron a Tabla, Cuadrícula de tarjetas, Compacta y Tira de película.'],

  'Stack rank numbers cut off':
    ['Números de posición cortados en Pila',
     'Los números grandes de posición se recortaban.'],

  'Fifteen additions to Stack view':
    ['Quince novedades en la vista Pila',
     'Brillos palpitantes en los tres primeros, un número de posición grande como marca de agua, una barra de progreso coloreada según el movimiento, bordes de color para debuts y regresos, el nombre del álbum junto al título, las reproducciones de todos los tiempos en la fila de datos y las semanas en el chart.'],

  'Per-category heatmaps made full size':
    ['Mapas de calor por categoría a tamaño completo',
     'Los mapas de calor de artista, canción y álbum ahora igualan al principal en tamaño y etiquetas, con detalle al pasar el ratón y clic en cada día activo.'],

  'Nineteen additions to the streak heatmap':
    ['Diecinueve novedades en el mapa de calor de rachas',
     'Un selector de rango para el último año, cualquier año concreto o todo el historial; cinco esquemas de color; sombreado continuo en lugar de cinco niveles fijos; etiquetas de meses y días de la semana; y anillos que marcan hoy y tu día récord.'],

  'The Hall of Fame as plaques':
    ['El Salón de la Fama como placas',
     'Cada entrada muestra ahora su posición, su tipo, la duración del récord contando hacia arriba, las fechas exactas entre las que se logró y si sigue en curso — para que quede claro por qué está ahí y no solo que está.'],

  'Artist and album art swapped in Card Grid':
    ['Imágenes de artista y álbum intercambiadas en Cuadrícula de tarjetas',
     'A los dos tipos se les daba el mismo identificador porque se formaba con la primera letra de la palabra, y artistas y álbumes empiezan por la misma. Las imágenes acababan en las tarjetas equivocadas.'],

  'Sign-in popup blocked':
    ['La ventana de inicio de sesión se bloqueaba',
     'Una cabecera de seguridad del alojamiento impedía que la ventana de inicio de sesión de Google devolviera la respuesta.'],

  'Filmstrip Save button produced nothing':
    ['El botón Guardar de Tira de película no producía nada',
     'Las imágenes cargadas desde otros sitios impiden que una página se convierta en imagen, así que guardar fallaba en silencio, y además solo se capturaba la parte visible de la tira. Ahora la tira se copia fuera de pantalla a todo su ancho, convirtiendo antes cada imagen.'],

  'Play an at-risk streak straight from the list':
    ['Reproduce una racha en riesgo directamente desde la lista',
     'Los elementos de racha suenan en la app en lugar de abrir YouTube en una pestaña nueva, se añaden a la cola en silencio si ya suena algo, y las entradas de artista y álbum muestran las últimas cinco canciones suyas que escuchaste.'],

  'The streak window rebuilt':
    ['La ventana de rachas, rehecha',
     'Pestañas para Rachas, Mapa de calor y Cementerio, un resumen de rachas activas, en riesgo y perdidas, secciones plegables que recuerdan su estado, búsqueda en vivo, orden por duración o nombre, la fecha de inicio de cada racha y un trofeo cuando una racha actual iguala tu mejor marca.'],

  'Filmstrip scrolls continuously':
    ['La Tira de película se desplaza sin parar',
     'El desplazamiento automático se rehízo como un bucle continuo que se detiene al pasar el ratón, como el carrusel de la Máquina del Tiempo, en lugar de avanzar a saltos y pararse al final.'],

  'Filmstrip detail panel tidied':
    ['Panel de detalle de Tira de película ordenado',
     'Las insignias salieron de la tarjeta a una sola fila en el panel desplegado, las etiquetas de semanas y reproducciones se escribieron completas en lugar de abreviadas, y ambas se conectaron al sistema de traducción.'],

  'Mouse drags stopped changing the period':
    ['Arrastrar con el ratón ya no cambia el periodo',
     'Seleccionar texto con el ratón en un ordenador se interpretaba como un deslizamiento y te llevaba a otro periodo. Ahora los deslizamientos solo se reconocen con el tacto.'],

  'Wider filmstrip cards and restyled jump controls':
    ['Tarjetas de Tira de película más anchas y controles de salto renovados',
     'Las tarjetas se ensancharon otra vez, y los botones de saltar a una posición se rediseñaron como las pestañas de vista, con etiquetas más cortas.'],

  'Filmstrip made interactive':
    ['La Tira de película se vuelve interactiva',
     'Tarjetas más anchas con imágenes más grandes para los tres primeros, títulos que saltan de línea en lugar de cortarse, posición y movimiento por separado, insignias de certificación y pico sobre la imagen, y un botón de reproducción al pasar el ratón.'],

  'Top-three glow in Card Grid':
    ['Brillo de los tres primeros en Cuadrícula de tarjetas',
     'Igual que el tratamiento del mosaico.'],

  'Podium tints on the chart rows':
    ['Tintes de podio en las filas del chart',
     'Fondos de fila dorado, plateado y bronce en la tabla principal y en la vista compacta.'],

  'Mosaic scales to the chart size':
    ['El mosaico se adapta al tamaño del chart',
     'Un top 50 o top 100 en una altura fija dejaba las entradas de abajo como tiras ilegibles, así que la cuadrícula ahora crece con el chart. El contenido de la tarjeta desplegada se adapta al mosaico en que está.'],

  'Stronger top-three glows':
    ['Brillos más intensos para los tres primeros',
     'Con cada mosaico brillando ahora con su propio color, el podio necesitaba un tratamiento más amplio y brillante para seguir destacando.'],

  'Mosaic tiles glow their own colour':
    ['Los mosaicos brillan con su propio color',
     'Cada mosaico del cuarto puesto hacia abajo toma el color más vivo de su propia imagen y lo usa para su borde y su brillo. Los tres primeros conservan oro, plata y bronce.'],

  'Missing artwork on the expanded mosaic card':
    ['Faltaba la imagen en la tarjeta desplegada del mosaico',
     'Las dos caras de un mosaico compartían un identificador, así que solo la delantera recibía la imagen.'],

  'Search retries when the server is waking':
    ['La búsqueda reintenta mientras el servidor despierta',
     'El servidor se duerme cuando está inactivo y devuelve un error mientras arranca, que se trataba como una búsqueda fallida. Ahora esas respuestas se reintentan.'],

  'Artwork on the expanded mosaic card':
    ['Imagen en la tarjeta desplegada del mosaico',
     'Una miniatura junto a la posición, el título y el artista.'],

  'Click a mosaic tile to expand it':
    ['Haz clic en un mosaico para desplegarlo',
     'El mosaico se da la vuelta y muestra una cara con todas las estadísticas, agrandándose si es demasiado pequeño para leerse, mientras los demás se atenúan.'],

  'Mosaic frame was killing the glows':
    ['El marco del mosaico apagaba los brillos',
     'El panel añadido alrededor de la cuadrícula recortaba los brillos y efectos al pasar el ratón que debía enmarcar.'],

  'Hover a mosaic tile for its chart run':
    ['Pasa el ratón por un mosaico para ver su recorrido',
     'Sube una tarjeta esmerilada con el título completo, el pico, las semanas en el chart, las reproducciones de todos los tiempos con la certificación, la barra de reproducciones de esta semana y un botón para poner la canción en cola.'],

  'Mosaic polish and movement badges':
    ['Pulido del mosaico e insignias de movimiento',
     'Esquinas más redondeadas, un panel detrás de la cuadrícula e insignias de movimiento de color en cada mosaico.'],

  'Mosaic labels always visible':
    ['Etiquetas del mosaico siempre visibles',
     'El título, el artista y las reproducciones se muestran siempre en lugar de aparecer al pasar el ratón, con un número de posición grande como marca de agua en cada mosaico.'],

  'Mosaic rebuilt as a treemap':
    ['El mosaico, rehecho como mapa de árbol',
     'Los mosaicos ahora llenan el espacio de borde a borde, cada uno con un área proporcional a sus reproducciones, así que la forma del chart se ve en el propio diseño. Unos degradados mantienen el texto legible sin pasar el ratón, y los tres primeros llevan brillos de oro, plata y bronce.'],

  'Compact view improved':
    ['Vista Compacta mejorada',
     'Medallas, insignias, un acordeón para el detalle, un botón de reproducción, imagen al pasar el ratón y una cabecera que se queda fija al desplazarte.'],

  'Card Grid view made interactive':
    ['La vista Cuadrícula de tarjetas se vuelve interactiva',
     'Hacer clic en una tarjeta la reproduce, al pasar el ratón aparece un botón de reproducción, y el clic derecho ofrece Reproducir ahora, Reproducir a continuación, Añadir a la cola, Reproducir similares y una búsqueda. Las insignias de pico y certificación pasaron a las tarjetas, y el movimiento se muestra como un borde de color.'],

  'Lyrics panel would not scroll':
    ['El panel de letras no se desplazaba',
     'El controlador de la rueda del volumen interceptaba el desplazamiento dentro de las letras.'],

  'Sleep timer, lyrics, crossfade and more':
    ['Temporizador, letras, fundido y más',
     'Un temporizador de apagado, fundido entre canciones, un panel de letras, un umbral de scrobble ajustable, portadas, listas con nombre, Reproducir similares, imagen en imagen, velocidad de reproducción y una tarjeta para compartir.'],

  'Seeking, repeat, shuffle and Play Next':
    ['Avance, repetir, aleatorio y Reproducir a continuación',
     'Una barra de progreso que puedes arrastrar o mover con las flechas, un botón de repetir que alterna entre desactivado, una y todas, aleatorio para la cola existente, volumen con las teclas arriba y abajo, una opción Reproducir a continuación que se salta la cola, y la posibilidad de poner en cola un historial entero de golpe.'],

  'Artist names in the queue':
    ['Nombres de artista en la cola',
     'La cola solo mostraba títulos, que no bastan para distinguir dos versiones.'],

  'Scrolling the queue changed the volume':
    ['Desplazar la cola cambiaba el volumen',
     'El controlador de la rueda para el volumen capturaba los desplazamientos pensados para la lista de la cola.'],

  'The player remembers what you were playing':
    ['El reproductor recuerda lo que estabas escuchando',
     'Volver a abrir la pestaña muestra el minirreproductor con la última canción lista para reanudar, en lugar de un reproductor vacío.'],

  'Play All and Shuffle missing':
    ['Faltaban Reproducir todo y Aleatorio',
     'Los dos botones habían desaparecido de los charts semanales y mensuales de canciones.'],

  'Player controls spilling outside the frame':
    ['Los controles del reproductor se salían del marco',
     'Los controles del minirreproductor desbordaban su propia tarjeta.'],

  'Ten more things in the music player':
    ['Diez cosas más en el reproductor de música',
     'Un botón de saltar, una recuperación más inteligente cuando un vídeo no se reproduce, una búsqueda personalizada con un selector de resultados, arrastre libre a cualquier parte de la pantalla, cuatro tamaños hasta 640 por 360, y una cola que puedes reordenar arrastrando y que sobrevive a una recarga.'],

  'Time Machine cards washed out on hover':
    ['Las tarjetas de la Máquina del Tiempo se desteñían al pasar el ratón',
     'En los temas claros el color al pasar el ratón resultaba más claro que la propia tarjeta, así que la tarjeta se apagaba en lugar de elevarse. Los temas claros ahora oscurecen al pasar el ratón, igual que los oscuros.'],

  'Unreadable tab labels on light themes':
    ['Etiquetas de pestaña ilegibles en los temas claros',
     'Pasar el ratón por una pestaña en cualquiera de los cinco temas claros ponía su texto en blanco sobre un fondo claro. La regla estaba pensada solo para los temas oscuros y se heredaba en todas partes.'],

  'Anniversaries stopped loading entirely':
    ['Los aniversarios dejaron de cargar por completo',
     'La base de datos musical rechazaba de plano la petición que pedía los detalles completos del lanzamiento, así que los aniversarios volvían vacíos. Se corrigió la petición y se borraron los resultados vacíos que ya estaban en caché.'],

  'Pagination appearing on weekly charts':
    ['La paginación aparecía en los charts semanales',
     'Volver a la vista de tabla borraba la regla que ocultaba los controles de paginación, y aparecían en los charts semanales, donde no tienen sentido — son de las vistas anual e histórica.'],

  'Spanish label for singles corrected':
    ['Etiqueta de sencillos en español corregida',
     'La palabra en inglés se había quedado en la traducción al español.'],

  'Albums stat renamed to Albums & Singles':
    ['La estadística Álbumes pasa a llamarse Álbumes y sencillos',
     'La cifra siempre había contado ambos, en todos los idiomas.'],

  'Close button on the edit window':
    ['Botón de cerrar en la ventana de edición',
     'La ventana Editar scrobble no tenía ninguna forma visible de cerrarse.'],

  'Open a chart link in a new tab':
    ['Abre un enlace de chart en una pestaña nueva',
     'Los enlaces de periodo no eran enlaces de verdad, así que hacer clic derecho o con el botón central no hacía nada. Los doce llevan ahora direcciones reales, y abrir uno directamente te lleva al periodo correcto una vez cargados los datos.'],

  'Demo button did nothing':
    ['El botón de demo no hacía nada',
     'Las funciones que había detrás se habían añadido a una copia del código que el sitio en vivo no carga.'],

  'A demo button':
    ['Un botón de demo',
     'Un botón grande encima de las tarjetas de importación que carga los datos de ejemplo y empieza a hacer charts al instante, sin configurar nada.'],

  'Sample data for new visitors':
    ['Datos de ejemplo para visitantes nuevos',
     'La página de inicio ofrece una hoja de ejemplo pública, para que la app se pueda explorar antes de comprometerse a configurar una fuente de datos propia.'],

  'Release anniversaries on the right day':
    ['Aniversarios de lanzamiento en el día correcto',
     'La fecha de lanzamiento de un álbum se tomaba de la edición más antigua registrada, que a menudo es una rareza digital o de streaming temprana y no el lanzamiento que recuerda la gente. Ahora la fecha es la que comparten más ediciones, y solo se usa la más antigua cuando no hay nada mejor.'],

  'Song profiles':
    ['Perfiles de canción',
     'Hacer clic en una canción de los charts Histórico o Anual abre un perfil completo: tarjetas de posición, estadísticas, premios, placas de certificación, picos en el chart, récords, cada recorrido, racha y aparición con enlaces a las semanas en que ocurrieron, una gráfica de cómo se movió su posición, un patrón de escucha, un mapa de calor y su historial completo de reproducciones.'],

  'Bigger icons on the sync bar':
    ['Iconos más grandes en la barra de sincronización',
     'Los botones de sincronizar, configurar y scrobble tenían iconos demasiado pequeños para verse. Ahora cada icono tiene el tamaño adecuado en todos los idiomas, lo que obligó a rehacer cómo esos botones contienen el texto traducido.'],

  'Time Machine hint translated':
    ['La pista de la Máquina del Tiempo, traducida',
     'El texto explicativo encima de la Máquina del Tiempo, en español y en las dos variantes del portugués.'],

  /* ========== MAYO 2026 ========== */

  'Five ways to look at a weekly chart':
    ['Cinco formas de ver un chart semanal',
     'Los diseños Cuadrícula de tarjetas, Compacta, Mosaico, Tira de película y Pila junto a la tabla estándar, elegidos desde un selector dentro de cada sección, con las tres secciones cambiando a la vez.'],

  'A hero card and a number one spotlight':
    ['Una tarjeta de portada y un foco para el número uno',
     'Una tarjeta de portada con degradado arriba, un foco destacado para el artista líder del año y tarjetas teñidas en los charts principales.'],

  'Your Soundtrack made bolder':
    ['Tu Soundtrack, más atrevido',
     'Cifras más grandes, secciones que aparecen al desplazarte, barras con degradado y posiciones principales resaltadas.'],

  'View modes on weekly and monthly releases':
    ['Modos de vista en los lanzamientos semanales y mensuales',
     'Los selectores de carrusel, mosaico, tabla y lista se extendieron a las secciones de próximos y recientes lanzamientos de los charts semanales y mensuales.'],

  'Chart animation smoothed, with a speed control':
    ['Animación del chart más suave, con control de velocidad',
     'Las filas que aún no habían sumado ninguna reproducción se mostraban con la posición en blanco, lo que rompía el chart visualmente; ya no están, y las entradas aparecen en el momento en que alcanzan el corte por primera vez, apareciendo poco a poco mientras suben. Las filas que se van se quitan antes de medir las posiciones para no dejar huecos, y un deslizador ajusta la velocidad.'],

  'Animated fire on the streak count':
    ['Fuego animado en el contador de racha',
     'El contador del banner de racha ganó una llama animada.'],

  'Streak thumbnails show their own artwork':
    ['Las miniaturas de racha muestran su propia imagen',
     'Todos los mosaicos pequeños mostraban la misma portada que la imagen principal de la racha. Ahora cada uno obtiene la imagen de su propia reproducción, respeta la fuente de imagen que elegiste para cada elemento, y se quitó el límite de nueve mosaicos.'],

  'Collaborations no longer break an artist streak':
    ['Las colaboraciones ya no rompen la racha de un artista',
     'La racha de un artista se rompía por una reproducción acreditada a él junto a otra persona, porque los dos nombres se comparaban como una sola cadena. Ahora ambos lados se dividen en artistas individuales. A la vez se añadió un interruptor para desactivar la animación del chart.'],

  'See which plays were autocorrected':
    ['Mira qué reproducciones se autocorrigieron',
     'Las filas corregidas llevan una insignia con sus valores originales y un borde de color, y un filtro muestra solo las entradas que ha cambiado una regla — para que una corrección se vea en lugar de ser algo que le pasó a tus datos en silencio.'],

  'The streak banner':
    ['El banner de racha',
     'Tu racha de escucha activa se queda fija entre la barra de sincronización y las pestañas, con efectos de fuego, portadas y una franja con tus últimas reproducciones como pequeños mosaicos.'],

  'Time Machine tiles start the player':
    ['Los mosaicos de la Máquina del Tiempo arrancan el reproductor',
     'Hacer clic en un mosaico de canción con el reproductor apagado mostraba un mensaje de cola para un reproductor que no existía. Ahora abre el reproductor directamente.'],

  'Your Soundtrack':
    ['Tu Soundtrack',
     'Una pestaña de resumen del año: un resumen animado de reproducciones, días activos, artistas, descubrimientos y racha; tus cinco artistas y canciones principales con barras proporcionales; un gráfico de actividad mensual que marca tus meses más alto y más bajo; una puntuación de fidelidad frente al año anterior; los artistas que descubriste; y los hitos que superaste. A la vez, los mosaicos de la Máquina del Tiempo pasaron a ser clicables.'],

  'Artist awards showed zero until you visited Awards':
    ['Los premios del artista marcaban cero hasta visitar Premios',
     'Los datos de premios solo se cargaban al abrir la pestaña Premios, así que las nominaciones y victorias de un artista siempre marcaban cero a la primera. Ahora se cargan todos los años al abrir la ventana y la franja se vuelve a dibujar cuando llegan.'],

  'Expandable award categories per artist':
    ['Categorías de premios desplegables por artista',
     'La franja de premios de la ventana del artista se despliega para listar cada categoría.'],

  'Records and awards inside the artist modal':
    ['Récords y premios dentro de la ventana del artista',
     'Los récords en el chart de un artista y sus nominaciones y victorias aparecen ahora en su propia página.'],

  'Peak day and peak streak in the artist modal':
    ['Día récord y racha récord en la ventana del artista',
     'Dos bloques más: las reproducciones máximas en un solo día y la racha más larga.'],

  'Chart size follows you between devices':
    ['El tamaño del chart te sigue entre dispositivos',
     'El tamaño de chart que elijas ahora se guarda en tu cuenta.'],

  'Artist stats deduplicated and reordered':
    ['Estadísticas del artista sin duplicados y reordenadas',
     'Se quitaron cifras de pico duplicadas, se añadió un bloque Álbum más escuchado y se reorganizó el orden.'],

  'The artist modal caught up with the album one':
    ['La ventana del artista se pone al nivel de la del álbum',
     'Diez cifras más — primera y última reproducción, días de calendario, media de reproducciones por canción, picos semanal, mensual y anual, canción principal, racha de escucha y canciones en el chart semanal — y un gráfico de reproducciones por mes cuyas barras se abren para mostrar las cinco canciones principales de ese mes.'],

  'Upload hint translated':
    ['Pista de subida traducida',
     'La nota con los formatos de archivo admitidos en la ventana de subida.'],

  'Artist streak tag recoloured':
    ['Etiqueta de racha de artista, con nuevo color',
     'La etiqueta de artista se parecía demasiado a la de álbum para distinguirlas.'],

  'Colour-coded streak tags':
    ['Etiquetas de racha por colores',
     'Las etiquetas de artista, canción y álbum de la ventana de rachas llevan colores para que el tipo se vea de un vistazo.'],

  'Display toggles remembered':
    ['Los interruptores de visualización se recuerdan',
     'Los interruptores de la barra de visualización del chart ahora se mantienen entre sesiones y dispositivos.'],

  'Editing and rules windows translated':
    ['Ventanas de edición y de reglas traducidas',
     'Veintiún textos en las ventanas de edición, scrobble manual, reglas de autocorrección y conflictos, además de la barra de herramientas de la Base de datos.'],

  'Export bar at both ends':
    ['Barra de exportación en los dos extremos',
     'En la vista de todas las entradas, los controles de exportación aparecen encima y debajo de cada sección, así que no hay que volver a subir por una lista larga.'],

  'Export a whole chart as text or CSV':
    ['Exporta un chart entero como texto o CSV',
     'Los charts Anual e Histórico pueden exportar todas las entradas de canciones, artistas y álbumes, no solo lo que cabe en pantalla.'],

  'Copy button on the setup guide did nothing':
    ['El botón de copiar de la guía de configuración no hacía nada',
     'La copia de respaldo se ejecutaba cuando el navegador ya no la consideraba una respuesta a tu clic, así que se rechazaba y el fallo se tragaba. Ahora el botón siempre responde.'],

  'Streaks counted today, and an at-risk warning':
    ['Las rachas cuentan hoy, y un aviso de riesgo',
     'Las rachas activas se medían hasta ayer, así que las reproducciones de hoy no contaban. Ahora terminan hoy, y una sección nueva avisa de las rachas de ayer que aún no has continuado — las que todavía puedes salvar.'],

  'The landing screen translated':
    ['La pantalla de inicio, traducida',
     'La primera pantalla que ve un visitante nuevo estaba solo en inglés. Se tradujeron veintinueve textos a los cuatro idiomas, incluidos párrafos con formato que necesitaban un tratamiento nuevo para poder traducirse.'],

  'Animations still appearing on long charts':
    ['Las animaciones seguían apareciendo en los charts largos',
     'Un observador de animación que se quedaba de una vista semanal podía dispararse después de cambiar y sobrescribir el contenido paginado de Anual e Histórico.'],

  'Streaks modal translated':
    ['Ventana de rachas traducida',
     'La ventana de rachas diarias, en todos los idiomas disponibles.'],

  'Sync error change reverted':
    ['Cambio de errores de sincronización revertido',
     'Se deshizo el cambio anterior.'],

  'Sync errors stopped being hidden':
    ['Los errores de sincronización dejan de ocultarse',
     'Cuando una Google Sheet no devolvía reproducciones utilizables, el lector daba un motivo preciso — faltan columnas, hoja vacía, nada válido — y el código que lo llamaba lo sobrescribía con un alegre "Sincronizado, 0 reproducciones cargadas". Ahora se muestra el motivo real.'],

  'Streak details':
    ['Detalles de rachas',
     'La cifra de racha pasó a ser clicable y abre un desglose de todas las rachas de artistas, álbumes y canciones que tienes en marcha, más una sección de rachas que terminaron hace poco.'],

  'No animation on Yearly and All-Time':
    ['Sin animación en Anual e Histórico',
     'Una ventana deslizante sobre un año o sobre todo un historial no tiene sentido, así que esos periodos ya no se animan.'],

  'See-through nominee picker fixed':
    ['Arreglado el selector de nominados transparente',
     'La ventana del selector salía transparente porque varios valores de color de los que dependía nunca se habían definido. La búsqueda por género también se ajustó para excluir los elementos cuyo género aún no se conoce en lugar de dejarlos pasar sin comprobar.'],

  'Genre filtering while searching, and album merging':
    ['Filtrado por género al buscar, y álbumes unificados',
     'Buscar dentro de una categoría de género ahora filtra por género en lugar de devolverlo todo, cada fila muestra sus etiquetas de género, y los álbumes acreditados a colaboraciones se agrupan en una sola entrada en lugar de dividirse.'],

  'Genre detection stopped guessing wrong':
    ['La detección de género deja de equivocarse',
     'Los géneros se comparaban con tanta holgura que artistas de pop acababan en categorías de rock. Ahora la comparación es exacta, las colaboraciones buscan a su artista principal, y las búsquedas fallidas se recuerdan para no reintentar miles de veces un servicio bloqueado.'],

  'Nominees with apostrophes were silently dropped':
    ['Los nominados con apóstrofo desaparecían en silencio',
     'Los títulos con apóstrofo cortaban los datos en que se guardaban, así que guardarlos fallaba sin ningún error. Cualquier cosa como "Short n\' Sweet" simplemente desaparecía de tus elecciones.'],

  'Unknown-year albums judged more carefully':
    ['Los álbumes de año desconocido se juzgan con más cuidado',
     'Si no se encontraba el año de lanzamiento y el álbum nunca se había escuchado antes del año de los premios, casi seguro es un lanzamiento nuevo, así que se excluye. Los álbumes con alguna reproducción anterior se mantienen, porque esa reproducción ya demuestra que el álbum existía.'],

  'Collaboration names handled properly':
    ['Nombres de colaboraciones bien tratados',
     'La búsqueda se rehízo de forma más acotada: solo el término de búsqueda usa el artista principal, y la lógica de comparación de detrás no se tocó.'],

  'Collaboration fix reverted':
    ['Arreglo de colaboraciones revertido',
     'Se deshizo el cambio anterior porque causaba problemas.'],

  'Collaboration names broke release lookups':
    ['Los nombres de colaboraciones rompían la búsqueda de lanzamientos',
     'Un campo de artista con varios nombres separados por comas se enviaba entero como búsqueda, que no encontraba nada y devolvía un año desconocido. Ahora solo se usa el artista principal.'],

  'Release years shown when picking nominees':
    ['Años de lanzamiento visibles al elegir nominados',
     'Cada candidato a Descubrimiento Tardío muestra el año en que salió, y lo que no tiene un año confirmado lo dice claramente, para que lo compruebes tú en lugar de fiarte de una suposición silenciosa.'],

  'Awards default to last year':
    ['Los premios se abren por defecto en el año pasado',
     'Abrir la pestaña mostraba el año actual, donde los álbumes del año anterior aparecen correctamente como descubrimientos tardíos — técnicamente correcto pero confuso, porque los premios de fin de año casi siempre son del año que acaba de terminar. Ahora se abre en el año pasado, y puedes seguir avanzando.'],

  'Wrong-year lookups stopped slipping through':
    ['Las búsquedas con el año equivocado ya no se cuelan',
     'Cuando no se encontraba un álbum coincidente, la búsqueda tomaba el primer resultado fuera cual fuera, que podía ser un disco antiguo sin relación y devolver una fecha lo bastante vieja como para colar un lanzamiento del año actual por el filtro. Se quitaron esos respaldos.'],

  'Release year checked for every candidate':
    ['Año de lanzamiento comprobado para cada candidato',
     'La búsqueda ahora se hace para todos los candidatos a Descubrimiento Tardío en lugar de saltarse algunos.'],

  'Late Discovery includes slow burns':
    ['Descubrimiento Tardío incluye los que se cuecen a fuego lento',
     'Los álbumes que habías escuchado hasta veinte veces antes del año de los premios ahora también cuentan, no solo los que no habías escuchado nunca. Un puñado de reproducciones tempranas seguido de un año de obsesión es justo la forma para la que existe esta categoría.'],

  'Late Discovery excludes that year\'s releases':
    ['Descubrimiento Tardío excluye los lanzamientos de ese año',
     'Descubrir un álbum publicado ese mismo año no es un descubrimiento tardío. Las fechas de lanzamiento se buscan en tres fuentes por turnos, y los álbumes sin fecha encontrada se mantienen en lugar de excluirse por error.'],

  'One-Hit Wonder made meaningful':
    ['Maravilla de un solo éxito, con sentido',
     'Ahora encaja con artistas que tienen exactamente una canción por encima de diez reproducciones, y te muestra cuál es.'],

  'The Streak award measured the wrong thing':
    ['El premio a la Racha medía lo que no era',
     'Contaba en cuántos días distintos se escuchó algo en lugar de la racha ininterrumpida más larga, y encima un fallo de formato de fecha rompía la comparación. Ahora encuentra rachas reales de días consecutivos y las llama así.'],

  'Icons on award categories':
    ['Iconos en las categorías de premios',
     'Cada categoría ganó un emoji descriptivo.'],

  'Animations wait until you scroll to them':
    ['Las animaciones esperan a que llegues a ellas',
     'Cada sección del chart muestra la vista del periodo anterior como marcador y solo empieza a animarse al entrar en pantalla. Si no te desplazas por nada, no se ejecuta nada, lo que ahorra trabajo y batería.'],

  'The chart animation became a true play-by-play':
    ['La animación del chart, reproducción a reproducción',
     'En lugar de saltar entre siete instantáneas fijas, la animación ahora lleva un recuento en marcha y quita y añade reproducciones individuales fotograma a fotograma. Las entradas nuevas suben a la vista desde debajo del corte hasta su puesto final, incluidas las posiciones que tocan brevemente por el camino.'],

  'Event view choices follow your account':
    ['Las elecciones de vista de Eventos siguen a tu cuenta',
     'Los tipos de evento por los que filtras y el modo de vista de cada sección ahora se sincronizan con tu cuenta de Google en lugar de olvidarse en otro dispositivo.'],

  'The Awards tab':
    ['La pestaña Premios',
     'Una ceremonia construida con tu propia escucha: elige un año, fija el periodo de elegibilidad en el rango de fechas que quieras y activa cualquiera de 33 categorías. Los nominados se generan a partir de tu historial y tus elecciones se guardan en tu cuenta. Un segundo panel contiene los premios reales.'],

  'More mobile layout corrections':
    ['Más correcciones de diseño en el móvil',
     'Los selectores de vista de eventos saltan de línea en cualquier tamaño de pantalla, y la ventana de álbum oculta sus columnas de fecha en teléfonos pequeños donde no caben.'],

  'Events view buttons unusable on iPhone':
    ['Botones de vista de Eventos inutilizables en iPhone',
     'Safari de iOS los dibujaba como botones de sistema blancos y simples, y la fila en la que estaban desbordaba la pantalla, así que no se podían pulsar. En el móvil ahora pasan a su propia fila.'],

  'New Music Friday':
    ['New Music Friday',
     'Una sección que reúne los lanzamientos de cada viernes — álbumes editoriales y sencillos y EP recién publicados de las últimas dos semanas — en cualquiera de los cinco modos de vista. Se guardan hasta dieciséis semanas de viernes, así que puedes volver atrás por semanas anteriores en lugar de ver solo la actual.'],

  'Reel became the default, and its images loaded':
    ['Carrusel pasa a ser el predeterminado, y sus imágenes cargan',
     'Las fotos de los artistas nunca cargaban en modo carrusel porque el respaldo de imágenes buscaba una forma de tarjeta que las tarjetas del carrusel no tienen, así que nunca se lanzaba la descarga.'],

  'Four ways to view every Events section':
    ['Cuatro formas de ver cada sección de Eventos',
     'Las siete secciones se pueden mostrar como mosaico, como tabla ordenable, como carrusel infinito que se detiene al pasar el ratón o como lista simple, y cada sección recuerda la que elegiste.'],

  'The Time Machine':
    ['La Máquina del Tiempo',
     'Un carrusel con las canciones, artistas y álbumes que escuchaste este mismo día en años anteriores, con interruptores para elegir cuáles de los tres mostrar.'],

  'Album art, Top N and sharing on chart images':
    ['Portadas, Top N y compartir en las imágenes del chart',
     'Las imágenes compartidas del chart ahora pueden llevar la portada en cada fila, tomada de varias fuentes con respaldos y guardada en caché entre usos; un deslizador fija cuántas posiciones aparecen; y la imagen se puede copiar al portapapeles o pasar al menú de compartir del dispositivo. Tus elecciones se recuerdan. La vista de día del calendario ganó un botón para exportar una lista.'],

  'Plays Peak badge translated':
    ['Insignia de pico de reproducciones traducida',
     'La insignia se había quedado en inglés en español y portugués.'],

  'Gender agreement in Spanish and Portuguese':
    ['Concordancia de género en español y portugués',
     'La palabra "descubierto" tiene que concordar con lo que describe, y las canciones llevan una forma distinta de la de artistas y álbumes. Se corrigieron ambos idiomas.'],

  'New-music section titles translated':
    ['Títulos de las secciones de música nueva traducidos',
     'Los títulos de los charts de canciones, artistas y álbumes nuevos.'],

  'Spanish Rising Artist reworded':
    ['Artista en ascenso, reformulado en español',
     'La etiqueta en español de Artista en ascenso se sustituyó por una expresión más natural.'],

  'Every stat strip label translated':
    ['Todas las etiquetas de la franja de estadísticas traducidas',
     'Mejor día, los recuentos de canciones, artistas y álbumes nuevos, los tres bloques del momento, Artista en ascenso, las dos insignias de pico y los textos pequeños de reproducciones, por día y porcentaje de nuevo. Las abreviaturas de mes en la etiqueta de Mejor día ahora usan las formas traducidas.'],

  'Spanish display toggle corrected':
    ['Interruptor de visualización en español corregido',
     'Un resto del cambio de redacción anterior que se había pasado por alto.'],

  'Events tab and Configure button translated':
    ['Pestaña Eventos y botón Configurar traducidos',
     'Los dos seguían en inglés en todos los idiomas.'],

  'Spanish navigation hint reworded':
    ['Pista de navegación en español reformulada',
     'Se corrigió la redacción en español de la pista de las teclas de flecha.'],

  'Navigation hint translated':
    ['Pista de navegación traducida',
     'La pista de teclado y deslizamiento se tradujo a los cuatro idiomas.'],

  'Spanish streak label and display buttons':
    ['Etiqueta de racha y botones de visualización en español',
     'La etiqueta de racha tenía las palabras en el orden equivocado en español, y los botones de visualización nunca se habían traducido.'],

  'Spanish wording corrected throughout':
    ['Redacción en español corregida en todas partes',
     'Dos palabras mal elegidas en toda la traducción al español se sustituyeron en todos los sitios donde aparecían.'],

  'Clearer album peak labels':
    ['Etiquetas de pico del álbum más claras',
     'Las estadísticas de pico de la ventana de álbum se renombraron para indicar a qué chart se refiere cada una.'],

  'Track details button restyled':
    ['Botón de detalles de canciones rediseñado',
     'El control de detalles de canciones de la ventana de álbum pasó a ser un botón circular brillante con un icono que gira.'],

  'The album modal rebuilt':
    ['La ventana de álbum, rehecha',
     'Los álbumes recibieron el mismo tratamiento que los artistas: una posición histórica, días en el calendario, media de reproducciones por canción, la siguiente certificación y primera y última reproducción; picos semanal, mensual y anual con un banner si lideró los tres; una línea de tendencia mensual y un desglose de cuántas canciones entraron en el chart en cada periodo; logros y certificaciones; y recorridos, mapa de calor, historial de streaming y paneles por canción.'],

  'Event sections visible again, and release lookups fixed':
    ['Secciones de Eventos visibles otra vez, y búsqueda de lanzamientos arreglada',
     'Aniversarios, Próximos y Recientes Lanzamientos estaban plegados por defecto; ahora se abren, recuerdan su estado por sección y lo restauran al volver. También se corrigió una consulta de lanzamientos mal formada que se rechazaba de plano.'],

  'New Charts Records previews showed the wrong chart':
    ['Las vistas previas de Récords de Nuevos Charts mostraban el chart equivocado',
     'Pasar el ratón por una fecha de esa sección mostraba el chart semanal normal en lugar del chart de música nueva de ese periodo.'],

  'New Charts Records read the right charts':
    ['Los Récords de Nuevos Charts leen los charts correctos',
     'Los diez récords se calculaban a partir de las primeras apariciones en los charts principales, que solo ven el top N, en lugar de los charts de música nueva que dicen describir. Ahora usan la primera reproducción de cada elemento, igual que lo que muestran de verdad esos charts.'],

  'Concerts work without your own API key':
    ['Los conciertos funcionan sin tu propia clave de API',
     'La sección de conciertos exigía que cada usuario aportara una clave propia.'],

  'Artist modal showed the wrong songs':
    ['La ventana del artista mostraba las canciones equivocadas',
     'Cuando no se podía leer el tamaño del chart histórico, la lista de canciones en el chart volvía vacía, y un respaldo mostraba en silencio las canciones principales del propio artista — que se ven igual pero significan algo totalmente distinto. La pertenencia al chart ahora siempre se deriva de los datos históricos reales, y se quitó el respaldo engañoso.'],

  'A per-chart breakdown in the artist modal':
    ['Un desglose por chart en la ventana del artista',
     'En lugar de una sola cifra de canciones en el chart, una cuadrícula que muestra cuántas canciones y álbumes entraron y la mejor posición alcanzada en Semanal, Mensual, Anual e Histórico, más una fila de picos y una posición histórica más clara.'],

  'Clearer column name in the artist modal':
    ['Nombre de columna más claro en la ventana del artista',
     'La columna abreviada de reproducciones consecutivas se escribió completa.'],

  'All-Time stopped showing stale weekly data':
    ['Histórico deja de mostrar datos semanales viejos',
     'Cambiar a Histórico mientras seguía una animación del chart dejaba que esa animación terminara 380 milisegundos después y sobrescribiera la nueva pestaña con el chart de la semana anterior. Ahora las animaciones pendientes se cancelan al cambiar, y la ventana se corrigió para usar cifras históricas en todas partes en lugar de semanales.'],

  'The artist modal rebuilt':
    ['La ventana del artista, rehecha',
     'Pico del artista ahora significa la mejor posición en el chart semanal en lugar de una posición histórica. El logro de número uno histórico se sustituyó por números uno semanales y mensuales y canciones que debutaron en lo más alto. Canciones y álbumes se dividen cada uno en cuatro secciones plegables por periodo, cada una con su propio mapa de calor e historial.'],

  'Event sections hidden on long periods':
    ['Secciones de Eventos ocultas en periodos largos',
     'Los eventos próximos y recientes no pintan nada en las pestañas Anual e Histórico.'],

  'Upcoming concerts':
    ['Próximos conciertos',
     'Una sección de conciertos de artistas que escuchas, marcados en el calendario. Los datos de eventos también se guardan en tu cuenta para que sobrevivan al cambiar de dispositivo, mirando primero el almacenamiento local y descargando solo cuando no hay nada que reutilizar.'],

  'Records for the new-music charts':
    ['Récords para los charts de música nueva',
     'Diez récords sacados de los charts de Canciones, Artistas y Álbumes nuevos: los mayores debuts, tus periodos de más descubrimientos, más canciones en un mismo chart nuevo, recuento histórico de debuts por artista, rachas más largas de debuts consecutivos, lo más rápido que una canción nueva llegó al número uno, y el álbum que llegó con más canciones a la vez.'],

  'Chart animation smoothed out':
    ['Animación del chart suavizada',
     'El chart final aparece desde una opacidad parcial en lugar de desde la nada, las filas se mantienen del todo visibles durante la ventana deslizante en lugar de atenuarse a mitad de animación, repetir ahora repite toda la secuencia y no solo el fundido, y las insignias llegan cuando el movimiento se asienta.'],

  'Moment tiles limited to weekly':
    ['Los bloques del momento, solo en semanal',
     'Artista y Álbum del momento miden una ventana de tres semanas, que no dice nada dentro de una vista mensual o anual, así que ahí se ocultan.'],

  'Artist and Album of the Moment':
    ['Artista y Álbum del momento',
     'Una tercera franja con Canción, Artista y Álbum del momento más Artista en ascenso, donde artista y álbum salen de los últimos 21 días, cada uno con su propia imagen y color.'],

  'Icons and colours on the stat tiles':
    ['Iconos y colores en los bloques de estadísticas',
     'Cada bloque ganó un icono y un color de categoría, y se aclaró la cifra de Mejor día.'],

  'Release sections stopped always appearing collapsed':
    ['Las secciones de lanzamientos dejan de aparecer siempre plegadas',
     'Las secciones venían marcadas como plegadas en la página y el código que las mostraba nunca quitaba esa marca, así que salían plegadas siempre, eligieras lo que eligieras. Ahora tu preferencia se guarda y se restaura.'],

  'Charts evolve day by day instead of jumping':
    ['Los charts evolucionan día a día en lugar de saltar',
     'La animación de entrada se sustituyó por una ventana deslizante: el periodo anterior avanza en siete pasos durante unos seis segundos, quitando sus reproducciones más antiguas y añadiendo las del periodo actual, así que ves cómo cambian de verdad las posiciones en lugar de ver dos estados. Las filas se deslizan a sus nuevas posiciones y se puede cancelar en cualquier momento.'],

  'Only the date row stays stuck':
    ['Solo la fila de fecha se queda fija',
     'Las pestañas y los controles de tamaño del chart ahora se van con la página al desplazarte, y solo la navegación de fechas queda fijada.'],

  'Charts animate in from last period':
    ['Los charts entran animados desde el periodo anterior',
     'Un chart dibuja primero el periodo anterior y luego sustituye cada fila por la actual, deslizando las entradas desde donde estaban — las que suben desde abajo, las que bajan desde arriba, las nuevas desde fuera del chart. Cada sección ganó un botón de repetir.'],

  'Graphs and Records showing Events content':
    ['Gráficas y Récords mostraban el contenido de Eventos',
     'Dos pestañas dibujaban el contenido de la vista Eventos en lugar del suyo.'],

  'Rising Artist, and a redesigned Song of the Moment':
    ['Artista en ascenso, y una Canción del momento rediseñada',
     'Una tarjeta de Artista en ascenso en los charts semanales busca el artista descubierto más recientemente en los 45 días que terminan con la semana, con una foto real. La Canción del momento se rediseñó en torno a su portada. Se volvieron a quitar las líneas de tendencia, y la segunda franja se ocultó en las pestañas donde no significa nada.'],

  'Stat cards became interactive':
    ['Las tarjetas de estadísticas se vuelven interactivas',
     'Hacer clic en una tarjeta de estadística te lleva a la sección del chart que resume, desplegándola si está plegada. Reproducciones totales muestra una media por día, Canciones únicas muestra qué proporción eran nuevas, cada una de las cuatro tarjetas principales lleva una línea de tendencia de ocho periodos, se añadió un bloque Mejor día, y los números cuentan hacia arriba al cargar.'],

  'Movement and peaks on the new-music stats':
    ['Movimiento y picos en las estadísticas de música nueva',
     'Las cifras de canciones, artistas y álbumes nuevos ahora muestran si subieron o bajaron respecto al periodo anterior, y llevan insignias de pico histórico y de pico en su momento como las estadísticas principales.'],

  'A second row of stats':
    ['Una segunda fila de estadísticas',
     'Debajo de las cuatro cifras principales, una segunda franja en los charts semanales, mensuales y anuales: Canción del momento, la más escuchada en los quince días que terminan con el periodo, y recuentos de canciones, artistas y álbumes que aparecen por primera vez.'],

  'Filter events by kind':
    ['Filtra los eventos por tipo',
     'Cumpleaños, álbumes, sencillos, EP y todo lo demás se pueden mostrar u ocultar por separado.'],

  'An events calendar, and events that already happened':
    ['Un calendario de eventos, y eventos que ya pasaron',
     'Eventos ganó una vista de calendario, y secciones de cumpleaños, aniversarios y lanzamientos que acaban de pasar, no solo los que están por venir. Se cortó el contenido de otras secciones que se colaba en la pestaña.'],

  'Chart run sections collapse':
    ['Las secciones del recorrido se pliegan',
     'Las subsecciones del recorrido en los charts anuales, mensuales y semanales se pueden plegar, aunque empiezan abiertas.'],

  'Search and sort your full listening history':
    ['Busca y ordena todo tu historial de escucha',
     'El panel Historial completo de streaming ganó búsqueda en vivo por título, artista y álbum, y columnas ordenables. El panel del recorrido se dividió en secciones plegables que solo cargan al abrirse, e Histórico ganó interruptores de visualización y botones de recorrido.'],

  'Navigation hint hidden where it does not apply':
    ['La pista de navegación se oculta donde no aplica',
     'Base de datos, Gráficas, Récords y Eventos no se mueven entre periodos, así que la pista ya no aparece en ellas.'],

  'Swipe hint hidden on desktop':
    ['La pista de deslizar, oculta en escritorio',
     'Una hoja de estilos en caché seguía mostrando la pista de deslizar en el ordenador.'],

  'Swipe arrows dim when there is nowhere to go':
    ['Las flechas de deslizar se atenúan cuando no hay adónde ir',
     'La flecha de una dirección a la que no puedes ir, como avanzar desde la semana actual, se atenúa.'],

  'The swipe hint animates until used':
    ['La pista de deslizar se anima hasta que la usas',
     'Brilla y se mueve hasta que deslizas por primera vez, y luego para.'],

  'A swipe hint on small screens':
    ['Una pista de deslizar en pantallas pequeñas',
     'La pista de teclado no tiene sentido en un teléfono, así que ahí se sustituye por un indicador de deslizar.'],

  'More milestones, and song milestones that actually tracked':
    ['Más hitos, y hitos de canción que de verdad se registran',
     'Se añadieron muchos más umbrales de reproducciones entre 10 y 50.000, con pasos más finos en los cientos y los primeros miles. La sección de canciones usaba una lista fija con valores que nunca se llegaban a registrar.'],

  'Clearer label on the average stat':
    ['Etiqueta más clara en la estadística de media',
     'La cifra de media por día ahora se llama Reproducciones / día.'],

  'Hero stats readable on the coloured mastheads':
    ['Estadísticas principales legibles en las cabeceras de color',
     'Los temas claros rojo, amarillo y rosa tienen una cabecera oscura pero colores de texto pensados para fondo claro, así que las estadísticas de encima de los charts eran casi invisibles. Esos valores ahora se sobrescriben dentro de la zona de estadísticas para igualarlos con el resto del texto de la cabecera.'],

  'A permanent arrow-key hint':
    ['Una pista permanente de las teclas de flecha',
     'Un pequeño recordatorio fijo de los atajos de flecha izquierda y derecha en escritorio, oculto en el móvil, donde no aplican.'],

  'A one-time hint about keyboard and swipe navigation':
    ['Una pista única sobre la navegación con teclado y deslizamiento',
     'Una píldora bajo la navegación explica que las flechas y los deslizamientos cambian de periodo; se muestra una vez y luego se recuerda. Días escuchados pasó a ser clicable y lleva al mapa de calor, Artista principal ahora cambia de pestaña antes de desplazarse, y el recuento de racha termina con una explosión.'],

  'Delete a conflicting rule from the warning':
    ['Borra una regla en conflicto desde el aviso',
     'Cada regla listada en el aviso de conflicto ganó un botón de borrar que la elimina en todos los sitios donde está guardada, sin cerrar la ventana en la que estás trabajando.'],

  'Conflict warning widened':
    ['Aviso de conflicto ampliado',
     'El aviso solo saltaba cuando la regla existente tenía un álbum distinto. Ahora salta con cualquier regla sobre el mismo artista y canción, incluidas las que solo se diferencian en mayúsculas.'],

  'A warning before you create a conflicting rule':
    ['Un aviso antes de crear una regla en conflicto',
     'Guardar una regla para un artista y una canción que ya tienen una ahora avisa primero, lista las reglas que chocan con una casilla cada una, y te deja aplicarlas o sobrescribirlas una a una sin salir de la ventana.'],

  'Search your autocorrect rules':
    ['Busca en tus reglas de autocorrección',
     'Una caja de búsqueda en la ventana de reglas, que empieza a importar cuando la lista es larga.'],

  'Dismiss the autocorrect notice':
    ['Descarta el aviso de autocorrección',
     'El mensaje que dice cuántas entradas se corrigieron ahora se puede descartar, y vuelve a aparecer el estado de sincronización habitual debajo.'],

  'Keep comma-separated artist names together':
    ['Mantén juntos los nombres de artista con comas',
     'Un interruptor para decidir si un nombre con una coma es un artista o varios, porque las dos cosas son ciertas según el artista.'],

  'Corrections reached newly added entries':
    ['Las correcciones llegan a las entradas recién añadidas',
     'Tras una edición en bloque, la copia en caché de la app ya tenía los valores corregidos, y un filtro usaba eso para decidir qué reglas faltaba enviar — así que se saltaban reglas y las entradas recién llegadas se quedaban sin corregir en la hoja. Ahora siempre se envían todas las reglas, y la hoja escribe tres columnas concretas en lugar de reescribirse entera.'],

  'Privacy Policy split into its own page':
    ['La Política de privacidad, en su propia página',
     'Las secciones de privacidad salieron de los Términos a una política independiente, dejando los Términos solo para los términos. Se corrigió el contraste del texto en ambas páginas.'],

  'Top 25 and Top 30':
    ['Top 25 y Top 30',
     'Dos tamaños de chart más para los charts semanales y mensuales.'],

  'Days Listened explained accurately':
    ['Días escuchados, explicado con precisión',
     'La descripción decía que la cifra contaba los días que abriste Last.fm; cuenta los días que escuchaste música.'],

  'Support panel stopped collapsing on itself':
    ['El panel de soporte deja de cerrarse solo',
     'La rutina que mantiene oculto el lanzador seguía funcionando una vez abierto el panel, y lo cerraba un segundo después. Ahora se pausa mientras el panel está abierto.'],

  'Support panel opens properly':
    ['El panel de soporte se abre bien',
     'La detección de cuándo el panel había terminado de abrirse no era fiable y se sustituyó.'],

  'Support launcher hiding made reliable':
    ['Ocultar el lanzador de soporte, ahora fiable',
     'El widget podía reaparecer antes de que se ejecutara el código que lo ocultaba; ahora se vigila y se oculta en cuanto se inserta, con un respaldo de estilos.'],

  'Support widget only opens when asked':
    ['El widget de soporte solo se abre cuando se pide',
     'El widget de chat se oculta al cargar y solo aparece al pulsar Contactar con soporte, en lugar de suprimirse a posteriori.'],

  'Sync moved first, Add Play scoped, Now button added':
    ['Sincronizar va primero, Añadir reproducción se acota, y llega el botón Ahora',
     'Sincronizar pasó al principio de la cabecera, Añadir reproducción se limitó a la pestaña Base de datos, que es donde pertenece, y la ventana de edición ganó un botón Ahora para poner la hora actual.'],

  'A plain-English summary at the top of the Terms':
    ['Un resumen en lenguaje llano al principio de los Términos',
     'Nadie lee los términos, así que se puso un breve cuadro de resumen al principio, junto con una sección de legislación aplicable.'],

  'Terms corrections':
    ['Correcciones en los Términos',
     'El responsable nombrado como es debido, direcciones de contacto corregidas y un aviso sobre funciones premium añadido.'],

  'A welcome email on first sign-in':
    ['Un correo de bienvenida al iniciar sesión por primera vez',
     'Iniciar sesión por primera vez ahora envía un correo de bienvenida.'],

  'Terms of Service and Privacy Policy':
    ['Términos del servicio y Política de privacidad',
     'Una página de política publicada que cubre qué se recoge, quién lo procesa y tu derecho a que se borre, enlazada desde la pantalla de inicio y el pie de página.'],

  'Sheet corrections made dramatically cheaper':
    ['Las correcciones en la hoja, muchísimo más baratas',
     'Faltaba el controlador de las correcciones en bloque, así que esas peticiones caían en la rama de añadir una fila. Arreglarlo trajo cuatro optimizaciones: las reglas se buscan directamente en lugar de comparar cada fila con cada regla, solo se reescriben las filas que cambian en lugar de toda la hoja, y las filas cambiadas contiguas se agrupan en escrituras únicas.'],

  'Batch corrections in the sheet script':
    ['Correcciones en bloque en el script de la hoja',
     'El script de Google Sheets ganó la acción que aplica todas las reglas de corrección de una sola pasada.'],

  'Support launcher hidden on every page':
    ['El lanzador de soporte, oculto en todas las páginas',
     'El mismo arreglo, extendido a las páginas donde se había pasado por alto.'],

  'Support widget stopped floating over the page':
    ['El widget de soporte deja de flotar sobre la página',
     'El botón del chat de soporte estaba siempre en pantalla. Ahora solo aparece cuando eliges Contactar con soporte.'],

  'Streaks climb through their tiers on load':
    ['Las rachas suben por sus niveles al cargar',
     'El recuento ahora recorre cada nivel de intensidad de camino a tu número real, así que ves cómo la racha se gana su color.'],

  'Streaks in six intensities':
    ['Rachas en seis intensidades',
     'La visualización de rachas tiene ahora seis niveles de color y animación, así que una racha de tres días y una de cien ya no se ven igual.'],

  'The hero stats came alive':
    ['Las estadísticas principales cobran vida',
     'Una quinta cifra para la media de reproducciones por día, números que cuentan hacia arriba al cargar la página, tu mejor racha personal bajo la actual, un brillo de fuego en rachas de siete días o más, un icono por estadística, un Artista principal clicable y una cuadrícula de dos por dos en el teléfono.'],

  'Play buttons on more rows, and three player sizes':
    ['Botones de reproducción en más filas, y tres tamaños de reproductor',
     'Se añadieron botones de reproducción en las filas de canciones y dentro del nuevo chart de artistas, el minirreproductor alterna entre tres tamaños en lugar de dos, y al pasar el ratón por el número de canciones de un artista se listan sus canciones con un botón de reproducción en cada una.'],

  'The player became a floating, queueable mini player':
    ['El reproductor se convierte en un minirreproductor flotante con cola',
     'El reproductor ahora flota donde lo pongas y se ajusta a una esquina, cambia de tamaño, se pausa con la barra espaciadora y tiene una cola que puedes ampliar y ver. El servidor además revisa varios resultados de búsqueda y elige uno que de verdad se pueda reproducir, en lugar de tomar el primero y fallar.'],

  'A real logo':
    ['Un logo de verdad',
     'El provisional se sustituyó por la marca de arcos concéntricos, y un icono para añadir el sitio a la pantalla de inicio de iOS.'],

  'Eight things that make the app quicker to use':
    ['Ocho cosas que hacen la app más rápida de usar',
     'La navegación se queda fija arriba al desplazarte; aparecen marcadores con brillo mientras cargan los charts; hacer clic en la etiqueta del periodo abre directamente el selector de fecha; las flechas cambian de periodo y W, M, Y y A saltan entre pestañas; pasar el ratón por un punto de tema lo previsualiza; y los gestos de deslizar cambian de periodo en pantallas táctiles. A la vez se añadieron un favicon y vistas previas de enlaces.'],

  'The heatmap grew a year in review':
    ['El mapa de calor ganó un resumen del año',
     'Cinco esquemas de color con un selector de muestras, una barra con tus rachas de escucha actual y máxima, detección de sequías que resalta los huecos y marca tu vuelta, una tarjeta de resumen para cada año con su total, mejor día, artista principal y artistas nuevos, y una sección Patrones de escucha que muestra tu ritmo por día de la semana y hora del día.'],

  'Heatmap rendering and filters completed':
    ['Dibujado y filtros del mapa de calor, completados',
     'Se terminaron el dibujado, el filtrado y las descripciones emergentes del mapa de calor.'],

  'Single edits find their row immediately':
    ['Las ediciones sueltas encuentran su fila al instante',
     'Editar una reproducción obligaba al script de la hoja a recorrer todas las filas para encontrarla. Ahora la app recuerda de qué fila vino cada reproducción y la envía con la edición, así que el script lee una fila directamente, y solo recorre la hoja si la pista está desfasada.'],

  'Autocorrect sync rebuilt around rules, not timestamps':
    ['La sincronización de autocorrección, rehecha en torno a reglas y no a marcas de tiempo',
     'La sincronización de correcciones con la hoja seguía comparando por marca de tiempo y seguía fallando cada vez que las zonas horarias del navegador y de la hoja no coincidían. Ahora todas las reglas activas se envían en una sola petición que lee la hoja una vez y escribe una vez, haya las reglas que haya.'],

  'The listening heatmap':
    ['El mapa de calor de escucha',
     'Una cuadrícula de calendario en Gráficas donde cada día es un cuadrado sombreado según cuánto escuchaste, para que años de historial se lean de un vistazo. Pasar el ratón por un día da la fecha, el recuento y cualquier hito, y se puede filtrar por un solo artista, canción o álbum.'],

  'Ghost rows cleaned before syncing':
    ['Filas fantasma limpiadas antes de sincronizar',
     'Los scrobbles incompletos de Last.fm dejan filas sin canción y con fecha de 1970, y esas filas estropean la marca de tiempo desde la que empieza la siguiente sincronización, así que una sola fila mala podía seguir rompiendo sincronizaciones futuras. Ahora se eliminan antes de cada sincronización de Last.fm.'],

  'Tie-breaking on new entries':
    ['Desempate en las entradas nuevas',
     'El último sitio donde los empates se resolvían mal: los charts de canciones, artistas y álbumes nuevos, que comparaban recuentos brutos. Ahora registran cuándo se logró algo por primera vez y ordenan igual que todo lo demás.'],

  'Tie-breaking in chart runs and modals':
    ['Desempate en los recorridos y las ventanas',
     'Los recorridos reconstruyen cada periodo pasado desde cero, y lo hacían sin arrastrar las posiciones de cada periodo, así que los empates históricos se resolvían al azar. Esto corrigió el historial de recorridos, las ventanas de artista y álbum y los resúmenes flotantes del chart.'],

  'Tie-breaking reached the charts themselves':
    ['El desempate llega a los propios charts',
     'El arreglo anterior solo corregía la sección Récords. Los charts que realmente miras se construyen por otro camino que seguía ignorando por completo la posición de la semana anterior, así que canciones, artistas y álbumes necesitaban que se aplicara otra vez.'],

  'Ties now break by last week\'s position':
    ['Los empates se resuelven ahora por la posición de la semana pasada',
     'Cuando dos canciones tenían el mismo número de reproducciones, ganaba la que se escuchó antes, lo que es arbitrario. Ahora la canción que estaba más arriba en el chart anterior se queda con el mejor puesto, como trata una lista real a quien ya ocupa el puesto.'],

  'Bulk edits stopped failing across time zones':
    ['Las ediciones en bloque dejan de fallar entre zonas horarias',
     'Las filas de la hoja se comparaban por su momento en el tiempo, lo que falla cuando tu navegador y tu hoja están en zonas distintas: la misma fecha escrita se convierte en dos instantes diferentes y nada coincide. Ahora la comparación se hace por el texto de artista, título y álbum, que no depende de dónde estés.'],

  'An out-of-date sheet script now says so':
    ['Un script de hoja desactualizado ahora lo dice',
     'Si tu Google Sheet usaba una copia antigua del script, no reconocía la petición de edición en bloque, caía en su rama de añadir una fila, decía que todo había ido bien y añadía una fila vacía con fecha de 1970. Ahora se detecta y se muestra un error claro que te pide volver a implementar, en lugar de un fallo silencioso disfrazado de éxito.'],

  'Seconds were being thrown away from every timestamp':
    ['Se tiraban los segundos de cada marca de tiempo',
     'El lector de fechas entendía horas y minutos pero descartaba en silencio los segundos, redondeando cada reproducción al inicio de su minuto. La hoja comparaba filas por marca de tiempo exacta, así que nada coincidía nunca y cada edición en bloque decía haber actualizado cero entradas.'],

  'Epoch dates blocked at every entry point':
    ['Fechas de 1970 bloqueadas en todos los puntos de entrada',
     'Una segunda pasada, más amplia, sobre el problema de la fecha de 1970: cualquier reproducción con fecha anterior al año 2000 se salta ahora al leer un CSV, al autocorregir y al escribir actualizaciones, así que una marca de tiempo mala no puede llegar a tus charts por ningún lado.'],

  'Artwork works when running locally':
    ['Las imágenes funcionan al ejecutar en local',
     'El nuevo intermediario solo existe en el sitio en vivo, así que las imágenes fallaban en el desarrollo local. Ahora detecta ese caso y usa el intermediario de producción.'],

  'Artwork served through our own domain':
    ['Las imágenes se sirven a través de nuestro propio dominio',
     'Las peticiones a Deezer pasaban por un intermediario de terceros que se estaba bloqueando. Ahora pasan por el propio dankcharts.fm, con una hora de caché en el borde para que las búsquedas repetidas no vuelvan a descargar.'],

  'Epoch dates stopped appearing in sheets':
    ['Las fechas de 1970 dejan de aparecer en las hojas',
     'Las reproducciones sin marca de tiempo se escribían con fecha del 1 de enero de 1970, lo que pone una reproducción medio siglo antes de que empiece tu historial. Ahora esas filas se rechazan en todos los puntos donde podían crearse.'],

  'Bulk edits show real progress instead of hanging':
    ['Las ediciones en bloque muestran el progreso real en lugar de colgarse',
     'Una edición en bloque reescribía la hoja entera en una sola petición, lo que tardaba entre 100 y 179 segundos y parecía un bloqueo. Ahora se sube en tandas de 100 con el progreso en vivo: cuántas van, el porcentaje y el tiempo transcurrido. Si se interrumpe, el error dice cuántas entradas se escribieron realmente.'],

  'Deezer artwork stopped failing in bursts':
    ['Las imágenes de Deezer dejan de fallar en racimos',
     'Las peticiones de imágenes pasan por un intermediario, y cuando fallaba, fallaba todo a la vez. Se añadió un segundo intermediario de respaldo, y tras tres fallos seguidos Deezer se salta durante cinco minutos en lugar de seguir chocando contra un muro y llenar la consola de errores.'],

  'Faster corrections in Sheets':
    ['Correcciones más rápidas en Sheets',
     'Un intento de acelerar cómo aplica las correcciones el script de la hoja.'],

  'Sheet script stopped pushing constantly':
    ['El script de la hoja deja de enviar sin parar',
     'El Apps Script detrás de Google Sheets enviaba las reglas de autocorrección mucho más a menudo de lo necesario.'],

  'Edit a Last.fm play from Raw Data':
    ['Edita una reproducción de Last.fm desde la Base de datos',
     'Un scrobble de Last.fm se puede editar directamente desde la Base de datos. La API de Last.fm no tiene operación de edición, así que esto añade un scrobble corregido en lugar de cambiar el original, y el antiguo sigue teniendo que borrarse a mano.'],

  'Autocorrect rules confirmed working':
    ['Reglas de autocorrección, confirmado que funcionan',
     'El último arreglo de la serie, comprobado en lugar de supuesto.'],

  'Autocorrect rules sync across devices':
    ['Las reglas de autocorrección se sincronizan entre dispositivos',
     'Dos fallos se combinaban para perder reglas. Un navegador nuevo escribía una lista vacía en el almacenamiento local al arrancar, que luego sobrescribía las reglas reales guardadas en la nube; y las reglas solo se subían en una primera migración, así que los cambios posteriores nunca salían del dispositivo. Una regla guardada en el portátil ahora llega al teléfono.'],

  'Autocorrect rules saving to your account':
    ['Las reglas de autocorrección se guardan en tu cuenta',
     'Las reglas no se estaban guardando en la cuenta de Google con la que habías iniciado sesión.'],

  'Backend pointed at the new host':
    ['El servidor apunta al nuevo alojamiento',
     'Se cambió el enlace del servidor y se desconectó por completo el alojamiento antiguo.'],

  'Moved to Cloudflare Pages':
    ['Mudanza a Cloudflare Pages',
     'El alojamiento dejó Netlify.'],

  'Playlist export as CSV':
    ['Exportar listas como CSV',
     'Una lista se puede descargar como archivo CSV además de enviarse a un servicio de transferencia.'],

  'Albums in playlist export':
    ['Álbumes en la exportación de listas',
     'Las listas de exportación ganaron un interruptor de álbum.'],

  'In-site play and scrobble':
    ['Reproducir y hacer scrobble dentro del sitio',
     'Trabajo de seguimiento que completa la reproducción y el scrobble dentro del sitio.'],

  'Play music in the app, and scrobble it':
    ['Escucha música en la app, y regístrala',
     'Una barra de reproductor al pie de la página reproduce una canción mediante YouTube sin salir de los charts, y la registra a los 30 segundos en Last.fm o en tu hoja. Cada fila de canción ganó un botón de reproducción, y los botones se pueden ocultar si prefieres no verlos.'],

  'Existing settings survived signing in':
    ['Los ajustes existentes sobreviven al inicio de sesión',
     'Los usuarios que ya habían configurado la app perdían esos ajustes al iniciar sesión por primera vez.'],

  'Sign in with Google':
    ['Inicia sesión con Google',
     'Iniciar sesión con una cuenta de Google funciona, que es lo que permite que tus ajustes te sigan entre dispositivos en lugar de vivir en un solo navegador.'],

  'Groundwork for Google sign-in':
    ['Base para el inicio de sesión con Google',
     'La configuración necesaria para iniciar sesión con una cuenta de Google y guardar los ajustes en ella.'],

  'Autocorrect rules stored and portable':
    ['Reglas de autocorrección guardadas y portátiles',
     'Las reglas se guardan en tu Google Sheet, y se pueden exportar e importar como archivo, así que un conjunto de correcciones hecho a lo largo de meses no se queda atrapado en un navegador.'],

  'Autocorrect and mass update bugs':
    ['Errores en autocorrección y actualización masiva',
     'Se arreglaron varios problemas en las nuevas reglas y la edición en bloque mientras aún estaban en pruebas.'],

  'Autocorrect rules and mass update':
    ['Reglas de autocorrección y actualización masiva',
     'Una regla ahora puede decir que un artista o título siempre debe leerse como otro, y una sola corrección se puede aplicar a todas las entradas que coincidan a la vez. Arreglar un nombre escrito de tres formas a lo largo de diez años dejó de ser un trabajo manual.'],

  'Raw Data editing made faster':
    ['La edición en la Base de datos, más rápida',
     'Editar tardaba tanto que parecía roto; se bajó a unos 30 a 45 segundos.'],

  'Edit your raw listening data':
    ['Edita tus datos de escucha en bruto',
     'Las reproducciones individuales pasaron a ser editables, vinieran de Last.fm, de Google Sheets o de un archivo local. Un nombre de artista equivocado o un título mal escrito se podía corregir en el origen en lugar de distorsionar en silencio cada chart construido con él. De paso se arregló que la ventana de ajustes no se desplegaba bien.'],

  'Playlist export respects chart order':
    ['La exportación de listas respeta el orden del chart',
     'Las listas exportadas ignoraban las reglas de prioridad que deciden en qué orden deben salir las posiciones.'],

  'Release images on mobile':
    ['Imágenes de lanzamientos en el móvil',
     'Algunas imágenes de Lanzamientos Recientes y Próximos no cargaban en el teléfono.'],

  'A temporary logo':
    ['Un logo provisional',
     'Un logo de relleno mientras se decidía el definitivo.'],

  'Themes and languages on the landing and setup pages':
    ['Temas e idiomas en las páginas de inicio y de configuración',
     'La tarjeta de Sheets y la página de configuración se hicieron más fáciles de seguir, y los temas de color y el selector de idioma se extendieron a las páginas de inicio y de configuración para que la app no cambie de aspecto en cuanto inicias sesión.'],

  'A Google Sheets template you can generate':
    ['Una plantilla de Google Sheets que puedes generar',
     'En lugar de describir el formato de la hoja y esperar que la gente la construya bien, la app ahora genera una plantilla lista y te guía por la configuración. A la vez se añadió el contacto de soporte.'],

  'Release cards always have an image':
    ['Las tarjetas de lanzamiento siempre tienen imagen',
     'Próximos y Recientes Lanzamientos recorren una cadena de fuentes de imagen, así que una tarjeta nunca se queda con un hueco donde debería ir la portada.'],

  /* ========== ABRIL 2026 ========== */

  'Clearer Last.fm setup, image fallbacks and pagination':
    ['Configuración de Last.fm más clara, respaldo de imágenes y paginación',
     'Instrucciones que explican qué es Last.fm y cómo usarlo, un respaldo cuando una imagen no carga, paginación en los charts anuales e históricos, y scrobble manual.'],

  'A landing page, and no more borrowed spreadsheet':
    ['Una página de inicio, y se acabó la hoja prestada',
     'Una página de inicio como es debido, y se acabó mandar a los usuarios nuevos a la Google Sheet de otra persona: ahora cada uno elige su propio método de importación.'],

  'Moved to dankcharts.fm':
    ['Mudanza a dankcharts.fm',
     'La migración completa de la página antigua al sitio oficial, llevándose consigo el nuevo sistema de importación.'],

  'Google Sheets imports everything now':
    ['Google Sheets ya lo importa todo',
     'Arreglo confirmado para las importaciones de Sheets que llegaban incompletas. Llega la hoja entera, lo cual importa porque un historial cortado en silencio produce charts que parecen creíbles y están mal.'],

  'Sheets upload, another attempt':
    ['Subida de Sheets, otro intento',
     'Un intento más con el problema de subida de Google Sheets.'],

  'Import workflow reworked and Sheets limits fixed':
    ['Flujo de importación rehecho y límites de Sheets arreglados',
     'Se reestructuró la secuencia de importación y se levantó el tope de lo que podía aportar una Google Sheet.'],

  'Row limits, duplicates, and Last.fm-only charts':
    ['Límites de filas, duplicados y charts solo con Last.fm',
     'La importación chocaba con límites de filas, dejaba pasar reproducciones duplicadas cuando dos entradas compartían marca de tiempo y exigía Last.fm para construir cualquier chart. Se arreglaron las tres cosas.'],

  'Imports moved into your browser':
    ['Las importaciones pasan a tu navegador',
     'Sheets, CSV, hojas de cálculo y archivos ZIP de Spotify ahora se leen por completo dentro de tu propio navegador y se guardan en el almacenamiento local, sin ningún servidor de por medio. Last.fm sigue pasando por el servidor, pero solo porque su API lo exige. Esto eliminó por completo la dependencia de una base de datos y significa que tu historial de escucha no sale de tu equipo para convertirse en un chart.'],

  'Further import fixes on the live site':
    ['Más arreglos de importación en el sitio en vivo',
     'Otra pasada a errores de importación que solo aparecían en el sitio publicado.'],

  'Google Sheets import on the live site':
    ['Importación de Google Sheets en el sitio en vivo',
     'La importación de Sheets funcionaba en local pero no una vez publicada.'],

  'Import without an account':
    ['Importa sin cuenta',
     'La ventana de importación estaba encerrada dentro de la app con sesión iniciada, así que un visitante necesitaba una cuenta de Last.fm antes de poder probar nada. Se sacó a la página de inicio con su propio botón y un campo de nombre, así que se puede importar un historial sin ninguna cuenta.'],

  'Cross-origin requests unblocked':
    ['Peticiones entre orígenes desbloqueadas',
     'Las reglas de seguridad del navegador rechazaban las propias llamadas a la API de la app.'],

  'Corrected API address':
    ['Dirección de la API corregida',
     'La app llamaba a una dirección equivocada para su servidor.'],

  'Import from Spotify, Deezer, CSV or Sheets':
    ['Importa desde Spotify, Deezer, CSV o Sheets',
     'Una sola vía de importación que acepta Last.fm, un archivo CSV, un ZIP de datos de Spotify, una hoja de cálculo de Deezer o una Google Sheet. Tu historial podía venir ya de cualquier servicio en el que lo tuvieras.'],

  'Week navigation, a stats strip, and Top 100':
    ['Navegación por semanas, una franja de estadísticas y Top 100',
     'Moverse entre semanas, una franja de cifras resumen encima del chart, un tema amarillo y la opción Top 100.'],

  'Users saved on login':
    ['Los usuarios se guardan al iniciar sesión',
     'Se actualizó el cliente de la base de datos y las cuentas empezaron a registrarse al iniciar sesión.'],

  'Weekly chart routes':
    ['Rutas del chart semanal',
     'Rutas del servidor para obtener los datos del chart semanal.'],

  'Hosting publish directory corrected':
    ['Carpeta de publicación del alojamiento corregida',
     'La implementación publicaba desde la carpeta equivocada.'],

  'The dankcharts front end':
    ['La interfaz de dankcharts',
     'Se añadieron la interfaz reconstruida y su configuración de alojamiento.'],

  'A backend for the Last.fm API':
    ['Un servidor para la API de Last.fm',
     'Se añadió un pequeño servidor que habla con la API de Last.fm en nombre de la app.'],

  'Plays tag sized for Spanish and Portuguese on mobile':
    ['La etiqueta de reproducciones, a medida del español y el portugués en el móvil',
     'La palabra para reproducciones es más larga en español y portugués, y a ancho de teléfono ya no cabía. Se corrigieron el tamaño y la posición de la etiqueta para esos idiomas.'],

  'Charts finally fit a phone screen':
    ['Los charts por fin caben en la pantalla del teléfono',
     'Todos los charts caben ahora en el ancho de un teléfono en vertical. La etiqueta de pico de reproducciones se movió a una posición que funciona en ese espacio.'],

  'More of the layout made to fit':
    ['Más partes del diseño ajustadas',
     'La cabecera, el menú de pestañas, el selector de calendario, las estadísticas del chart y las opciones de visualización se ajustaron para caber en la pantalla de un teléfono.'],

  'Play counts visible on mobile new-music charts':
    ['Reproducciones visibles en los charts de música nueva en el móvil',
     'Los nuevos charts de Canciones, Artistas y Álbumes ocultaban sus reproducciones en el teléfono.'],

  'Mobile shrinkage, first attempt':
    ['Encogimiento en el móvil, primer intento',
     'Un intento con el diseño que se reducía al ancho equivocado en los teléfonos.'],

  'The Events tab':
    ['La pestaña Eventos',
     'Una pestaña para las fechas alrededor de tu música más que para la música en sí: cumpleaños de artistas y aniversarios de álbumes y sencillos, cada uno como un mosaico en el que puedes hacer clic para leer más.'],

  'Search a release from the release itself':
    ['Busca un lanzamiento desde el propio lanzamiento',
     'Las entradas de Próximos y Recientes Lanzamientos pasaron a ser clicables y abren una búsqueda de ese lanzamiento.'],

  'New-music charts on phones, first attempt':
    ['Charts de música nueva en el teléfono, primer intento',
     'Los nuevos charts de Canciones, Artistas y Álbumes no se mostraban bien en el móvil.'],

  'Release updates widened to 200 artists':
    ['Novedades de lanzamientos ampliadas a 200 artistas',
     'Próximos y Recientes Lanzamientos miraban tus 50 artistas principales; se subió a 200, así que la sección cubre mucho más que la cima de tu historial.'],

  'The Certification Wall':
    ['El Muro de Certificaciones',
     'Un muro en la pestaña Récords que muestra todas las certificaciones que has conseguido, con filtros básicos para orientarte.'],

  'Set your own certification thresholds':
    ['Fija tus propios umbrales de certificación',
     'Oro, platino y diamante se definen por reproducciones, y las cifras adecuadas dependen de cuánto escuches. Esos umbrales pasaron a ser tuyos en lugar de estar fijos.'],

  'New Songs, Artists and Albums charts':
    ['Charts de Canciones, Artistas y Álbumes nuevos',
     'Los charts Semanal, Mensual y Anual ganaron charts acompañantes con lo que se escuchó por primera vez en ese periodo — música que llega a tu historial por primera vez, separada de lo que ya conocías.'],

  'Mobile phase 2: fitting the screen upright':
    ['Móvil, fase 2: encajar en la pantalla en vertical',
     'Un intento más de que el sitio cupiera en el ancho de un teléfono en vertical.'],

  'Mobile phase 2: masthead and options width':
    ['Móvil, fase 2: ancho de la cabecera y de las opciones',
     'Correcciones de ancho para la cabecera y la fila de opciones del chart.'],

  'Mobile phase 2: sizing when zoomed out':
    ['Móvil, fase 2: tamaños al alejar el zoom',
     'Los elementos de la interfaz tenían un tamaño incorrecto cuando se alejaba el zoom de la página en un teléfono.'],

  'Mobile phase 1: a critical bug':
    ['Móvil, fase 1: un error crítico',
     'La primera pasada para que el sitio fuera usable en navegadores móviles, arreglando un error crítico y añadiendo adaptaciones sobre todo para Safari.'],

  'A nudge towards setup for new users':
    ['Un empujoncito hacia la configuración para usuarios nuevos',
     'Quien llegaba por primera vez no tenía forma de saber dónde configurar nada. El botón de configurar ahora brilla hasta que se pone un nombre, lo que basta como pista sin ser un diálogo que estorba.'],

  'UTC offsets shown when picking a zone':
    ['Diferencias con UTC visibles al elegir zona',
     'El selector de zona horaria ahora muestra la diferencia de cada zona con UTC. Se mejoró la redacción de los menús de tema, idioma y día.'],

  'Time zones, including daylight saving':
    ['Zonas horarias, con horario de verano incluido',
     'La fecha de una reproducción decide en qué semana cae, así que la zona horaria en que se lee cambia los propios charts. Tu zona es ahora un ajuste, y el horario de verano se tiene en cuenta en los lugares que lo usan.'],

  'Automatic updates every 30 minutes':
    ['Actualizaciones automáticas cada 30 minutos',
     'Se corrigió la actualización automática para que Last.fm y Google Sheets se vuelvan a leer en un ciclo fiable de media hora.'],

  'Six-hour cache and steadier loading':
    ['Caché de seis horas y carga más estable',
     'Los datos se guardan en caché seis horas, y las rutinas que descargan de Last.fm y Google Sheets se hicieron más robustas.'],

  'Theme, day and language buttons reflow better':
    ['Los botones de tema, día e idioma se recolocan mejor',
     'Los tres grupos de botones de ajustes ahora se adaptan a pantallas más estrechas en lugar de desbordarse.'],

  'Your own name and start date in the masthead':
    ['Tu propio nombre y fecha de inicio en la cabecera',
     'La cabecera puede llevar tu nombre y la fecha en que empieza tu historial de escucha, en lugar de un texto fijo.'],

  'Last.fm retries instead of giving up':
    ['Last.fm reintenta en lugar de rendirse',
     'Cargar un historial grande de Last.fm suponía muchas páginas de peticiones, y una sola página fallida dejaba el historial incompleto. Ahora las páginas fallidas se reintentan, lo que afecta sobre todo a cuentas con muchos datos. También se corrigió la redacción en español de la ventana del artista.'],

  'Yellow Dark button text made readable':
    ['Texto de los botones de Amarillo Oscuro, legible',
     'El texto de los botones del tema Amarillo Oscuro no tenía suficiente contraste con su fondo.'],

  'Certification bug on multi-album songs, and tag toggles':
    ['Error de certificación en canciones de varios álbumes, e interruptores de etiquetas',
     'Las certificaciones salían mal en canciones que aparecen bajo más de un nombre de álbum. La etiqueta de pico de reproducciones se movió a la izquierda, y las etiquetas de Pico, Certificación y Pico de reproducciones tienen cada una su propio interruptor.'],

  'Certification badges on every chart':
    ['Insignias de certificación en todos los charts',
     'Las insignias de oro, platino y diamante aparecen ahora en los charts Semanal, Mensual y Anual, no solo en las vistas de detalle.'],

  'Scrobble to Last.fm from inside the app':
    ['Haz scrobble en Last.fm desde dentro de la app',
     'El scrobble manual está disponible en el propio sitio, así que una reproducción se puede registrar sin irse a Last.fm.'],

  'Last.fm as a data source':
    ['Last.fm como fuente de datos',
     'Hasta ahora la app leía de una Google Sheet. Conectar directamente una cuenta de Last.fm pasó a ser una opción, que es el momento en que la app dejó de ser usable solo por quien estuviera dispuesto a mantener una hoja de cálculo.'],

  'Period stats gained peaks and comparisons':
    ['Las estadísticas del periodo ganan picos y comparaciones',
     'Las cifras resumen encima de un chart semanal, mensual o anual ahora llevan etiquetas de pico y muestran cómo se compara el periodo con el anterior, para que un número tenga algo con qué medirse.'],

  'All-Kill tags that say how many times':
    ['Etiquetas All-Kill que dicen cuántas veces',
     'Las etiquetas de dominio total All-Kill se sustituyeron por otras que cuentan cuántas veces ha pasado de verdad, incluido un recuento por artista, en lugar de solo marcar que pasó. Se corrigieron los tamaños de letra de la canción y el álbum principales.'],

  'Adjustable columns across Records':
    ['Columnas ajustables en todo Récords',
     'Cada chart de Récords te deja cambiar cuántas columnas usa, así que un récord se puede recorrer a lo ancho o leer en estrecho. Se mejoró el chart Todos los n.º 1 y se corrigió la redacción de Récords.'],

  'Debuts made less cluttered':
    ['Debuts, menos recargado',
     'El récord de Debuts rehecho tenía demasiadas imágenes en las canciones; se redujeron y los mosaicos de artista y álbum se hicieron más pequeños.'],

  'Debuts ranked by plays, not position':
    ['Debuts ordenados por reproducciones, no por posición',
     'El récord de Debuts se rehízo para ordenar por cuántas reproducciones traía una canción al llegar en lugar de por la posición en que entró, que mide mejor una llegada. También ganó imágenes y enlaces a los charts.'],

  'Hide the image source picker':
    ['Oculta el selector de fuente de imágenes',
     'El control para elegir de dónde vienen las imágenes recargaba todos los charts. Ahora se puede ocultar y la lista queda más limpia.'],

  'Translation phase 15: Records names and titles':
    ['Traducción, fase 15: nombres y títulos de Récords',
     'Los nombres de los charts de récords y los títulos de las tablas ahora se traducen al instante. De paso se mejoró el chart de Apariciones.'],

  'Translation phase 14: the Graphs tab':
    ['Traducción, fase 14: la pestaña Gráficas',
     'Se tradujeron las gráficas, y el cambio de idioma volvió a ser más rápido.'],

  'Translation phase 13: instant switching on the four chart tabs':
    ['Traducción, fase 13: cambio instantáneo en las cuatro pestañas de charts',
     'Cambiar de idioma en Semanal, Mensual, Anual e Histórico ahora surte efecto al instante en lugar de necesitar recargar. También se ajustaron los recorridos.'],

  'Translation phase 12: Records and All-Kill':
    ['Traducción, fase 12: Récords y All-Kill',
     'Se tradujeron la pestaña Récords y su sección All-Kill, y de paso se mejoró bastante el propio chart All-Kill.'],

  'Translation phase 11: modals and chart run buttons':
    ['Traducción, fase 11: ventanas y botones de recorrido',
     'Se tradujeron las ventanas de artista y álbum y los botones de recorrido, junto con arreglos en los colores de los temas — sobre todo los botones del tema amarillo oscuro.'],

  'Translation phase 10: the word "chart" itself':
    ['Traducción, fase 10: la propia palabra "chart"',
     'El español y el portugués no tienen una sola palabra que corresponda al inglés "chart" en este sentido, y la app la usaba de forma incoherente. Todas las apariciones se unificaron en una sola adaptación. De paso se corrigió la redacción de la exportación de listas.'],

  'Translation phase 9: the share modal rebuilt':
    ['Traducción, fase 9: la ventana de compartir, rehecha',
     'La ventana Compartir como imagen se rehízo a fondo para que la personalización de la imagen se adapte bien a idiomas distintos del inglés, en lugar de dar por hecho etiquetas del largo del inglés.'],

  'Translation phase 8: the share button and its menu':
    ['Traducción, fase 8: el botón de compartir y su menú',
     'Se arreglaron problemas de idioma importantes en el botón Compartir como imagen y su menú de personalización.'],

  'Translation phase 7: dates everywhere, and share text':
    ['Traducción, fase 7: fechas en todas partes, y textos de compartir',
     'Se corrigieron las fechas en todos los charts, y se tradujeron las ventanas de compartir junto con las imágenes que generan. Récords y las ventanas de detalle seguían pendientes.'],

  'Translation phase 6: button hover text':
    ['Traducción, fase 6: textos al pasar el ratón por los botones',
     'Se tradujeron las descripciones que aparecen al pasar el ratón por un botón principal. Muchos botones secundarios seguían pendientes.'],

  'Translation phase 5: artist and album modals':
    ['Traducción, fase 5: ventanas de artista y álbum',
     'Se tradujo la mayor parte del texto de las ventanas de detalle de artista y álbum.'],

  'Translation phase 4: peak tags':
    ['Traducción, fase 4: etiquetas de pico',
     'Las etiquetas que marcan la posición máxima de una canción se tradujeron en lugar de dejarse en inglés.'],

  'Translation corrections':
    ['Correcciones de traducción',
     'Pequeños arreglos de redacción en los textos traducidos.'],

  'Translation phase 3: faster language switching':
    ['Traducción, fase 3: cambio de idioma más rápido',
     'Una gran ampliación de lo traducido, y cambiar de idioma pasó a ser más rápido y menos derrochador.'],

  'Translation phase 2: chart headers and dates':
    ['Traducción, fase 2: cabeceras del chart y fechas',
     'Se corrigieron los títulos del chart y se tradujeron las primeras fechas.'],

  'Spanish and Portuguese arrive':
    ['Llegan el español y el portugués',
     'La primera fase de la traducción: el español, el portugués de Brasil y el portugués europeo pasaron a ser idiomas seleccionables. En ese momento quedaba mucho sin traducir, y las doce fases siguientes son el trabajo de terminarlo.'],

  'Collapsed sections stopped leaking between tabs':
    ['Las secciones plegadas dejan de contagiarse entre pestañas',
     'Plegar una sección en una pestaña plegaba la sección equivalente en las demás. Ahora cada pestaña recuerda su propio estado. El icono del calendario del tema Azul Marino Claro también se puso en negro para que se viera.'],

  'Unreadable description on entry images':
    ['Descripción ilegible en las imágenes de entrada',
     'La descripción de una imagen de entrada compartida se dibujaba sobre un fondo gris pesado que hacía difícil leer el texto.'],

  'Jump from a record straight to the week it happened':
    ['Salta de un récord directamente a la semana en que ocurrió',
     'La fecha de un récord de Todos los n.º 1 es ahora un enlace. Al hacer clic se abre el chart semanal de esa semana exacta, para que veas el récord en el contexto en que se logró y no como un número aislado.'],

  'Small Records update':
    ['Pequeña actualización de Récords',
     'Más ajustes menores en la pestaña Récords.'],

  'Better All #1s and Repeat Scrobble Runs':
    ['Mejores Todos los n.º 1 y Rachas de repetición',
     'Se mejoraron dos charts de Récords: la lista de todas las canciones que llegaron al número uno, y el récord de escuchar la misma canción una y otra vez seguidas.'],

  'Back to Top works again':
    ['Volver arriba funciona otra vez',
     'El botón que se quitó el día anterior se arregló y se volvió a poner.'],

  'Styles and code split out of the page':
    ['Estilos y código separados de la página',
     'El CSS y el JavaScript vivían dentro del archivo HTML. Separarlos en sus propios archivos permite que el navegador los guarde en caché entre visitas en lugar de volver a descargarlo todo cada vez.'],

  'Choose which day your week starts on':
    ['Elige en qué día empieza tu semana',
     'Los charts semanales ya no dan por hecho un día de inicio fijo. Tú eliges el día en que empieza tu semana, y cada chart semanal, racha y recorrido se corta en ese límite.'],

  'Chart run image modal improved':
    ['Ventana de imagen del recorrido mejorada',
     'Varias mejoras y correcciones en la ventana que crea una imagen para compartir de un recorrido.'],

  'Debug output removed':
    ['Salida de depuración eliminada',
     'Se quitaron los registros de diagnóstico que habían quedado de arreglar las ventanas.'],

  'Artist and album modals working again':
    ['Las ventanas de artista y álbum vuelven a funcionar',
     'Las dos ventanas de detalle se arreglaron como es debido después de que el primer intento se quedara corto.'],

  'First attempt at the broken artist modal':
    ['Primer intento con la ventana de artista rota',
     'La ventana de detalle del artista se había roto; este fue el primer intento de repararla.'],

  'Image modal tidied, broken Back to Top removed':
    ['Ventana de imagen ordenada, y quitado el Volver arriba roto',
     'Se corrigieron pequeños errores en la ventana de compartir, y se quitó el botón Volver arriba porque no funcionaba.'],

  'Image customisation buttons repaired':
    ['Botones de personalización de imagen reparados',
     'Los controles para personalizar una imagen compartida habían dejado de funcionar bien.'],

  'Records views improved':
    ['Vistas de Récords mejoradas',
     'Una primera ronda de ajustes en la nueva pestaña Récords.'],

  'The Records tab':
    ['La pestaña Récords',
     'Una pestaña entera para los logros en el chart, donde cada tipo de logro tiene su propio chart ordenado en lugar de ser una nota al pie en la página de un artista. Es el origen de todos los récords que hay hoy en la app.'],

  'Entry images finished':
    ['Imágenes de entrada terminadas',
     'Se completó y pulió el generador de imágenes de nuevas entradas.'],

  'Share a new chart entry as an image':
    ['Comparte una nueva entrada del chart como imagen',
     'Un segundo generador de imágenes, esta vez para anunciar que una sola entrada llega al chart, en lugar del chart entero.'],

  'Smoother navigation, and a better dark mode on reload':
    ['Navegación más fluida, y un modo oscuro mejor al recargar',
     'Un conjunto de pequeñas mejoras al moverse por la app, y a lo que ves en modo oscuro justo después de recargar la página.'],

  'Bar race, and downloadable race GIFs':
    ['Carrera de barras, y GIF de la carrera descargables',
     'Nuevas gráficas, entre ellas una carrera de barras animada que muestra a tus artistas principales adelantándose con el tiempo, y que se puede descargar como GIF.'],

  'Sheet sync moved to hourly':
    ['Sincronización de la hoja cada hora',
     'Google Sheets ahora se vuelve a leer una vez por hora en lugar de en un ciclo más corto.'],

  'Chart runs across different periods':
    ['Recorridos en distintos periodos',
     'Los recorridos no funcionaban bien al abrirse desde un chart mensual o anual en lugar de uno semanal.'],

  'Chart run period labels':
    ['Etiquetas de periodo del recorrido',
     'Los recorridos semanales y mensuales ponían en sus casillas tramos de tiempo equivocados.'],

  'Chart run images improved':
    ['Imágenes de recorrido mejoradas',
     'Una ronda de mejoras en el generador de imágenes de recorridos.'],

  'Hover hints on buttons':
    ['Pistas al pasar el ratón por los botones',
     'Los botones de toda la app ganaron descripciones al pasar el ratón, así que se puede descubrir qué hace cada uno sin pulsarlo antes.'],

  'Chart images you can download and post':
    ['Imágenes del chart que puedes descargar y publicar',
     'Se terminó la exportación de imágenes: cualquier chart se puede convertir en una imagen con tamaño de publicación del feed o de historia, y descargar.'],

  'The Graphs tab':
    ['La pestaña Gráficas',
     'Una pestaña nueva con vistas visuales de tu historial, que empieza con dos: reproducciones acumuladas a lo largo del tiempo y volumen de reproducciones — ambas capaces de comparar varios artistas en los mismos ejes.'],

  'Recent Releases, and the dankcharts.fm name':
    ['Lanzamientos Recientes, y el nombre dankcharts.fm',
     'La app adoptó su nombre actual y ganó una sección de Lanzamientos Recientes que saca a la luz música nueva de artistas que ya escuchas.'],

  'Visitor country counter':
    ['Contador de países de visitantes',
     'Se añadió un contador que registra desde qué países se visita el sitio.'],

  'Real artist photos, via Deezer':
    ['Fotos reales de artistas, gracias a Deezer',
     'Deezer pasó a ser la fuente principal de imágenes, lo que significó que los artistas por fin tuvieran fotos de verdad en lugar de un marcador o una portada de álbum en su lugar.'],

  'All-Time and Yearly fixes, including search':
    ['Arreglos en Histórico y Anual, incluida la búsqueda',
     'Un lote de correcciones en los charts Histórico y Anual, incluido el comportamiento de sus barras de búsqueda.'],

  'Top 50, 100 and 200 on the long charts':
    ['Top 50, 100 y 200 en los charts largos',
     'Los charts Anual e Histórico ahora se pueden ampliar a 50, 100 o 200 posiciones en lugar de quedarse en lo más alto de la lista.'],

  'Peak tags on weekly artist charts':
    ['Etiquetas de pico en los charts semanales de artistas',
     'Los charts semanales de artistas mostraban la etiqueta de pico equivocada.'],

  'Export playlists through Soundiiz':
    ['Exporta listas a través de Soundiiz',
     'Las listas creadas con los datos de tus charts se pueden pasar a Soundiiz, que las lleva a Spotify, Apple Music y otros servicios.'],

  'More themes, and a contrast pass':
    ['Más temas, y un repaso del contraste',
     'Nuevos temas de color, más un repaso de los existentes arreglando combinaciones de texto y fondo demasiado parecidas para leerse.'],

  'Shareable chart images begun':
    ['Empiezan las imágenes del chart para compartir',
     'Primer trabajo para convertir un chart en una imagen publicable. Incompleto en ese momento.'],

  'Chart runs':
    ['Recorridos en el chart',
     'Cada canción, artista y álbum tiene ahora un recorrido — el historial completo semana a semana de su posición, del debut a la salida, en lugar de solo su posición actual.'],

  'Chart run layout, and first and last play dates':
    ['Diseño del recorrido, y fechas de primera y última reproducción',
     'Se arreglaron el icono del recorrido y los huecos entre casillas, y los recorridos largos pasan a la línea siguiente en lugar de desbordarse. Logros del artista ahora muestra la primera y la última vez que escuchaste cada canción y álbum.'],

  'Album modals, double diamond, and tighter chart rows':
    ['Ventanas de álbum, doble diamante y filas del chart más compactas',
     'Los álbumes tienen su propia ventana de detalle. Se añadió la certificación de doble diamante por encima de diamante. Las etiquetas de semana se abreviaron y los números de posición se redimensionaron para que las filas quepan más cómodas.'],

  'Calendar filter fixed':
    ['Filtro de calendario arreglado',
     'La vista de calendario usada para filtrar los charts por fecha no devolvía el rango correcto.'],

  'Peak and first-week figures corrected':
    ['Cifras de pico y de primera semana corregidas',
     'La posición máxima y las reproducciones de la primera semana se calculaban mal en algunas entradas.'],

  'YouTube as an artwork source':
    ['YouTube como fuente de imágenes',
     'Se añadió YouTube como opción para las imágenes cuando las demás fuentes no tienen nada, y se corrigió cómo se contaban los sencillos.'],

  'Collaborations count for every artist involved':
    ['Las colaboraciones cuentan para todos los artistas implicados',
     'Las canciones acreditadas a más de un artista ahora suman a los totales de cada artista en lugar de solo al primer nombre. Se añadieron diagnósticos que avisan cuando se pierden reproducciones al importar.'],

  'Raw Data and Artist Accomplishments':
    ['Base de datos y Logros del artista',
     'Dos vistas nuevas: la Base de datos, que lista cada reproducción individual detrás de los charts, y Logros del artista, que reúne lo que ha conseguido un solo artista en todo tu historial.'],

  'Collaboration counts and artwork corrected':
    ['Recuentos de colaboraciones e imágenes corregidos',
     'Continuación del trabajo de colaboraciones — tanto la resolución de imágenes como los totales por artista de los créditos compartidos estaban mal.'],

  'The first all-time chart':
    ['El primer chart histórico',
     'La primera versión funcional de la app: un solo chart histórico con tu música más escuchada, con imágenes de artistas, álbumes y canciones, certificaciones en canciones y álbumes, resúmenes de rendimiento por artista y vistas Top 10 / 20 / 50 / 100.'],

  'First four themes, and a name':
    ['Los cuatro primeros temas, y un nombre',
     'La app recibió un logotipo y un sistema de temas con cuatro estilos — Azul Marino Oscuro, Azul Marino Claro, Morado Oscuro y Morado Claro. Los temas claros ganaron fondos de página suavemente teñidos y cabeceras más oscuras para que la cabecera se lea separada de la página, y se subió el contraste en los cuatro.'],

  'Accented and non-Latin names stopped breaking':
    ['Los nombres con acentos o no latinos dejan de romperse',
     'Los datos de Google Sheets se decodificaban con la codificación que adivinara el navegador, lo que destrozaba nombres como Los Ángeles Azules, Ricardo Arjona y 강남스타일. Ahora la hoja se lee explícitamente como UTF-8, así que los títulos con acentos, en coreano y en otros alfabetos no latinos llegan intactos.'],

  'Spanish-language sheets were silently losing most plays':
    ['Las hojas en español perdían en silencio la mayoría de reproducciones',
     'Google Sheets escribe las fechas en el idioma de tu cuenta, y ningún lector de fechas estándar entiende meses en español como ene o febrero. El resultado era que la mayor parte de un historial en español se descartaba sin decir nada. Ahora se entienden los meses en español, y cualquier formato de fecha que la app todavía no sepa leer se cuenta y se avisa en lugar de descartarse en silencio.'],

  'Dropout charts, and more on every row':
    ['Charts de salidas, y más en cada fila',
     'Se añadieron charts para las canciones que salieron, y cada fila del chart ganó su posición anterior, su número de reproducciones y sus semanas o meses en el chart. De paso se corrigieron las etiquetas de pico.'],

};
