/* ═══════════════════════════════════════════════════════════════════════
   GENRE LIBRARY (2026-11-18, GENRE-LIBRARY-PLAN.md)
   See and fix the genres of your artists, albums and songs.
     • The genres come from one fixed list (genres.js: MusicBrainz's official
       genre list plus a few the site adds), so every pick matches the names
       MusicBrainz uses and nothing is ever misspelled. The list loads only
       when this page or the genre picker first opens.
     • Picks are saved only in the app (this browser + the account, see
       _genreEdits in app.js) — never written back to the Google Sheet / CSV
       — and they come first wherever genres count: Awards, Smart Playlists,
       the Daily tab, the nominee picker.
     • A genre missing from the list is suggested on the Board. Moderators
       add it (Firestore genreExtras) and it is in everyone's list at once.
   Parts of this file, top to bottom:
     1. words in the four site languages
     2. the genre list: loading, the moderators' extras, search
     3. the library's items (artists / albums / songs) from allPlays
     4. the genre picker window
     5. the Genre Library page
     6. genres in the song / album / artist side panel
     7. moderators: add a suggested genre, remove an added one
   Loaded after app.js, panel.js and board.js; reads their globals at run time.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. Words ──────────────────────────────────────────────────────────
     Kept here, like library-search.js, so the four big translation files
     only carry the two words other files need (nav_genrelib, ea_genres).
     {x} placeholders are filled by tx(). English fills any gap. */
  const TXT = {
    en: {
      title: 'Genre Library',
      intro: 'The genres of your artists, albums and songs, and where each one comes from. Fix any that look wrong: your picks count everywhere genres do — Awards, Smart Playlists and the Daily tab.',
      tab_artists: 'Artists', tab_albums: 'Albums', tab_songs: 'Songs',
      st_cover: 'Have a genre', st_yours: 'Picked by you', st_missing: 'No genre yet', st_of: 'of {n}',
      search_ph: 'Search names or genres…', f_all: 'All', f_missing: 'No genre', f_yours: 'Picked by you',
      sort_plays: 'Most played', sort_az: 'A–Z', sort_label: 'Sort',
      top_genres: 'Top genres here', clear_genre: 'Show every genre',
      none_yet: 'No genre yet', looking: 'Looking up…',
      src_you: 'Yours', src_sheet: 'Sheet', src_mb: 'MusicBrainz', src_web: 'Online tags',
      src_you_tip: 'You picked these', src_sheet_tip: 'From your Google Sheet / CSV', src_mb_tip: 'Voted genres from MusicBrainz',
      src_web_tip: 'Tags from Gemini or Last.fm', via_album: 'from its album', via_artist: 'from the artist',
      edit: 'Edit genres', add: 'Add genres', more: 'Show {n} more',
      empty_q: 'Nothing here matches “{q}”.', empty_f: 'Nothing here yet.', nodata: 'Your library is still loading…',
      play_one: '1 play', play_other: '{n} plays',
      signed_out: 'Your picks are saved on this device. Sign in to keep them in your account and on your other devices.',
      signin: 'Sign in',
      order_note: 'Your picks come first. A song or album with genres of its own keeps them when you change its artist.',
      pk_title: 'Genres for {name}', pk_kind_artist: 'Artist', pk_kind_album: 'Album', pk_kind_song: 'Song',
      pk_sel_empty: 'No genres picked. Search below or tap a suggestion.',
      pk_count: '{n} of {max}', pk_main: 'Main', pk_make_main: 'Make {name} the main genre', pk_remove: 'Remove {name}',
      pk_ph: 'Search {n} genres…', pk_suggested: 'On it now', pk_artist_has: 'The artist has',
      pk_popular: 'Popular', pk_browse: 'Browse by family', pk_back: 'All families', pk_fam_n: '{n} genres',
      pk_full: 'That’s the most ({max}). Remove one to add another.',
      pk_none_q: 'No genre called “{q}”.', pk_maybe: 'Closest matches',
      pk_sugg_title: 'Can’t find it?',
      pk_sugg_text: 'Suggest “{q}” on the Board. Once a moderator adds it, it’s in everyone’s list.',
      pk_sugg_btn: 'Suggest on the Board',
      pk_save: 'Save', pk_save_none: 'Save as no genre', pk_cancel: 'Cancel', pk_reset: 'Use automatic genres',
      pk_saved: 'Genres saved', pk_saved_none: 'Saved as no genre', pk_reset_done: 'Back to the automatic genres',
      pk_auto_note: 'These are the genres it has now. Change them and save to make them yours.',
      pk_yours_note: 'You picked these.',
      pk_loading: 'Loading the genre list…', pk_load_fail: 'The genre list didn’t load. Check your connection and try again.',
      pk_added: 'Added', pk_hint_keys: '↑ ↓ to move · Enter to add',
      sugg_post_title: 'Genre suggestion: {name}',
      sugg_post_body: 'Please add “{name}” to the genre list.\n\nI wanted it for: {item}',
      ad_title: 'Genres added from suggestions', ad_intro: 'Only moderators see this. Genres added here are in everyone’s list straight away.',
      ad_add: 'Add a genre', ad_from_post: 'Add to genre list', ad_name: 'Name, as people will see it',
      ad_fam: 'Family', ad_alias: 'Other spellings people might search (optional)', ad_alias_ph: 'e.g. baile phonk, funk phonk',
      ad_saved_as: 'Saved as “{id}”', ad_dupe: 'Already in the list as “{name}”.', ad_short: 'Type at least 2 letters.',
      ad_save: 'Add genre', ad_added: '“{name}” is now in everyone’s list', ad_removed: '“{name}” removed',
      ad_remove: 'Remove', ad_fail: 'That didn’t save. Check that the new Firestore rules are pasted in.',
      ad_none: 'None added yet.', ad_remove_title: 'Remove “{name}”?',
      ad_remove_text: 'Picks people already made keep it, but nobody can pick it again.',
      dp_genres: 'Genres', dp_edit: 'Edit', dp_add: 'Add genres',
      free_tip: 'Not in the genre list. Tap Edit to swap it for one that is.',
      fam_brazil: 'Brazilian', fam_latin: 'Latin', fam_asia: 'Asian', fam_africa: 'African', fam_christian: 'Christian & Gospel',
      fam_metal: 'Metal', fam_punk: 'Punk & Emo', fam_hiphop: 'Hip Hop & Rap', fam_rnb: 'R&B, Soul & Funk', fam_jazz: 'Jazz',
      fam_blues: 'Blues', fam_country: 'Country', fam_reggae: 'Reggae & Caribbean', fam_electronic: 'Electronic & Dance',
      fam_rock: 'Rock & Alternative', fam_pop: 'Pop', fam_classical: 'Classical', fam_screen: 'Soundtrack & Stage',
      fam_folk: 'Folk & Acoustic', fam_world: 'World & More',
      lib_title: "Your whole library",
      qf_title: "Quick Fix",
      qf_sub: "Your most played artists with no genre, one card at a time. Fixing an artist also fixes its albums and songs that have no genres of their own.",
      qf_rev_title: "Check the guesses",
      qf_rev_sub: "Your top artists whose genres were only guessed online. Save the ones that are right to make them yours.",
      qf_card: "Card {i} of {n}",
      qf_save_n: "Save {n}",
      qf_skip: "Skip",
      qf_search: "Search all genres",
      qf_none: "Not music? Save as no genre",
      qf_none_tip: "For podcasts, audiobooks and the like: it stays out of every genre count",
      qf_pick_hint: "Tap the genres that fit",
      qf_why_tags: "Matched from its own tags",
      qf_why_collab: "Artists it’s credited with have these",
      qf_why_artist: "The artist has these",
      qf_why_top: "Nothing to go on, so here are your top genres. Tap the ones that fit, or search.",
      qf_why_review: "Guessed online. Keep it, change it or add more.",
      qf_done_t: "All done!",
      qf_done: "Every artist you play has a genre.",
      qf_wait: "Looking up genres for your top artists. New cards show up here as answers come in.",
      qf_rev_done_t: "All checked",
      qf_rev_done: "No guessed-only genres left among your top 100 artists.",
      qf_back_fix: "Back to Quick Fix",
      qf_unskip: "Show the {n} you skipped",
      qf_progress: "Your progress",
      qf_ring: "of your plays have a genre",
      qf_streak: "{n} in a row",
      qf_streak0: "Save one to start a streak",
      qf_streak_none: "Nothing left to fix",
      qf_badge_got: "Reached: {n}% of your plays have a genre",
      qf_badge_todo: "Unlocks when {n}% of your plays have a genre",
      qf_badge_new: "Badge unlocked: {n}% of your plays have a genre!",
      qf_keys: "1–6 pick · Enter save · → skip",
      gp_back: "Genre Library",
      gp_open: "Open the {name} page",
      gp_plays: "Plays",
      gp_share: "Of your listening",
      gp_first: "First heard",
      gp_artists: "Artists",
      gp_songs: "Songs",
      gp_rank: "your #{n} genre",
      rar_common: "Common",
      rar_rare: "Rare",
      rar_deep: "Deep cut",
      rar_common_tip: "One of the genres most people listen to",
      rar_rare_tip: "A branch of a well-known genre",
      rar_deep_tip: "Off the beaten track: not related to any of the big genres",
      gp_none: "You haven't played any {name} yet. Try something next to it below.",
      gp_mix: "Play a mix",
      gp_sp: "Make Smart Playlist",
      gp_share_card: "Share card",
      gp_fix: "Fix genres here",
      gp_mix_on: "Playing a {name} mix: {n} songs in the queue",
      gp_sp_name: "{name} mix",
      gp_top_artists: "Your top artists",
      gp_top_songs: "Your top songs",
      gp_top_albums: "Your top albums",
      gp_months: "The last 12 months",
      gp_peak: "Your biggest month: {m}, {n} plays",
      gp_next: "Next to it",
      gp_new: "new",
      gp_second: "{name} is never the main genre of a song you play, but {n} songs have it as another genre ({p}).",
      snd_title: "Your sound",
      snd_head: "You’re {pct} {fam}",
      snd_tail_second: ", with a {pct} {fam} streak.",
      snd_tail_spread: ", spread over {n} families.",
      snd_other: "Everything else",
      snd_bar: "Your genre families by share of plays",
      snd_heard: "genres heard",
      snd_riser: "fastest riser",
      snd_rarest: "rarest one",
      snd_span_all: "All time",
      snd_span_365: "Last 12 months",
      snd_span_30: "Last 30 days",
      snd_span_label: "Time span",
      snd_all_fams: "All families",
      snd_hint: "Tap a family to open it, then a genre for its page.",
      snd_map: "Bubble map of your genres",
      sh_title: "Your genre shelf",
      sh_sub: "{n} genres collected.",
      sh_sub_rare: "{r} rare and {d} deep cuts among them.",
      sh_sub_locked: "Greyed cards are genres next door you haven’t played yet.",
      sh_locked: "Not played yet",
      sh_all: "Show all {n}",
      sh_less: "Show fewer",
      card_title: "{name} card",
      card_save: "Save image",
      card_share: "Share",
      card_rank: "My #{n} genre",
      card_cta: "What’s your #1 genre? Find out on dankcharts.fm",
      td_title: "Tidy up",
      td_sub: "Things that look off, each fixed in one go.",
      td_free_t: "{n} songs and albums only have tags that aren’t genres",
      td_free_t1: "1 song or album only has tags that aren’t genres",
      td_free: "Tags like “female vocalists” or “2015” from your sheet ({s} songs, {a} albums). Their artists have real genres they can use.",
      td_free_btn: "Fix all {n}",
      td_free_confirm: "Each one gets its artist’s genres as your pick. Your sheet isn’t changed, and you can change any of them later.",
      td_free_ok: "Fix them",
      td_free_done: "Done: {n} now use their artist’s genres",
      td_none_t: "{n} artists have no genre yet",
      td_none_t1: "1 artist has no genre yet",
      td_none: "Go through them one card at a time.",
      td_none_btn: "Open Quick Fix",
      td_guess_t: "{n} of your top artists only have guessed genres",
      td_guess_t1: "1 of your top artists only has guessed genres",
      td_guess: "They came from online tags, not from votes. Check them one by one.",
      td_guess_btn: "Check {n}",
      td_mixed_t: "{name}’s songs say {n} different things",
      td_mixed: "Your sheet gives their songs {list}. Pick what the artist is; songs keep their own.",
      td_mixed_btn: "Choose for {name}"
    },
    es: {
      title: 'Biblioteca de géneros',
      intro: 'Los géneros de tus artistas, álbumes y canciones, y de dónde sale cada uno. Corrige los que no cuadren: lo que elijas cuenta en todas partes donde cuentan los géneros — Premios, Listas inteligentes y la pestaña Diario.',
      tab_artists: 'Artistas', tab_albums: 'Álbumes', tab_songs: 'Canciones',
      st_cover: 'Con género', st_yours: 'Elegidos por ti', st_missing: 'Sin género aún', st_of: 'de {n}',
      search_ph: 'Busca nombres o géneros…', f_all: 'Todos', f_missing: 'Sin género', f_yours: 'Elegidos por ti',
      sort_plays: 'Más escuchados', sort_az: 'A–Z', sort_label: 'Ordenar',
      top_genres: 'Géneros principales aquí', clear_genre: 'Ver todos los géneros',
      none_yet: 'Sin género aún', looking: 'Buscando…',
      src_you: 'Tuyos', src_sheet: 'Hoja', src_mb: 'MusicBrainz', src_web: 'Etiquetas en línea',
      src_you_tip: 'Los elegiste tú', src_sheet_tip: 'De tu Google Sheet / CSV', src_mb_tip: 'Géneros votados en MusicBrainz',
      src_web_tip: 'Etiquetas de Gemini o Last.fm', via_album: 'de su álbum', via_artist: 'del artista',
      edit: 'Editar géneros', add: 'Añadir géneros', more: 'Ver {n} más',
      empty_q: 'Nada aquí coincide con «{q}».', empty_f: 'Aún no hay nada aquí.', nodata: 'Tu biblioteca aún se está cargando…',
      play_one: '1 reproducción', play_other: '{n} reproducciones',
      signed_out: 'Lo que elijas se guarda en este dispositivo. Inicia sesión para guardarlo en tu cuenta y en tus otros dispositivos.',
      signin: 'Iniciar sesión',
      order_note: 'Lo que elijas va primero. Una canción o un álbum con géneros propios los conserva aunque cambies los de su artista.',
      pk_title: 'Géneros de {name}', pk_kind_artist: 'Artista', pk_kind_album: 'Álbum', pk_kind_song: 'Canción',
      pk_sel_empty: 'No hay géneros elegidos. Busca abajo o toca una sugerencia.',
      pk_count: '{n} de {max}', pk_main: 'Principal', pk_make_main: 'Hacer de {name} el género principal', pk_remove: 'Quitar {name}',
      pk_ph: 'Busca entre {n} géneros…', pk_suggested: 'Los que tiene ahora', pk_artist_has: 'El artista tiene',
      pk_popular: 'Populares', pk_browse: 'Explorar por familia', pk_back: 'Todas las familias', pk_fam_n: '{n} géneros',
      pk_full: 'Ese es el máximo ({max}). Quita uno para añadir otro.',
      pk_none_q: 'No hay ningún género llamado «{q}».', pk_maybe: 'Lo más parecido',
      pk_sugg_title: '¿No lo encuentras?',
      pk_sugg_text: 'Sugiere «{q}» en el Foro. Cuando un moderador lo añada, estará en la lista de todos.',
      pk_sugg_btn: 'Sugerir en el Foro',
      pk_save: 'Guardar', pk_save_none: 'Guardar sin género', pk_cancel: 'Cancelar', pk_reset: 'Usar géneros automáticos',
      pk_saved: 'Géneros guardados', pk_saved_none: 'Guardado sin género', pk_reset_done: 'De vuelta a los géneros automáticos',
      pk_auto_note: 'Estos son los géneros que tiene ahora. Cámbialos y guarda para que sean tuyos.',
      pk_yours_note: 'Los elegiste tú.',
      pk_loading: 'Cargando la lista de géneros…', pk_load_fail: 'La lista de géneros no se cargó. Revisa tu conexión e inténtalo de nuevo.',
      pk_added: 'Añadido', pk_hint_keys: '↑ ↓ para moverte · Enter para añadir',
      sugg_post_title: 'Sugerencia de género: {name}',
      sugg_post_body: 'Por favor, añadid «{name}» a la lista de géneros.\n\nLo quería para: {item}',
      ad_title: 'Géneros añadidos por sugerencias', ad_intro: 'Solo lo ven los moderadores. Los géneros que añadas aquí están en la lista de todos al instante.',
      ad_add: 'Añadir un género', ad_from_post: 'Añadir a la lista de géneros', ad_name: 'Nombre, tal como se verá',
      ad_fam: 'Familia', ad_alias: 'Otras formas de buscarlo (opcional)', ad_alias_ph: 'p. ej. baile phonk, funk phonk',
      ad_saved_as: 'Se guarda como «{id}»', ad_dupe: 'Ya está en la lista como «{name}».', ad_short: 'Escribe al menos 2 letras.',
      ad_save: 'Añadir género', ad_added: '«{name}» ya está en la lista de todos', ad_removed: '«{name}» quitado',
      ad_remove: 'Quitar', ad_fail: 'No se guardó. Comprueba que las nuevas reglas de Firestore estén pegadas.',
      ad_none: 'Aún no se ha añadido ninguno.', ad_remove_title: '¿Quitar «{name}»?',
      ad_remove_text: 'Quien ya lo eligió lo conserva, pero nadie podrá volver a elegirlo.',
      dp_genres: 'Géneros', dp_edit: 'Editar', dp_add: 'Añadir géneros',
      free_tip: 'No está en la lista de géneros. Toca Editar para cambiarlo por uno que sí esté.',
      fam_brazil: 'Brasileña', fam_latin: 'Latina', fam_asia: 'Asiática', fam_africa: 'Africana', fam_christian: 'Cristiana y gospel',
      fam_metal: 'Metal', fam_punk: 'Punk y emo', fam_hiphop: 'Hip hop y rap', fam_rnb: 'R&B, soul y funk', fam_jazz: 'Jazz',
      fam_blues: 'Blues', fam_country: 'Country', fam_reggae: 'Reggae y caribeña', fam_electronic: 'Electrónica y dance',
      fam_rock: 'Rock y alternativo', fam_pop: 'Pop', fam_classical: 'Clásica', fam_screen: 'Bandas sonoras y escena',
      fam_folk: 'Folk y acústica', fam_world: 'Del mundo y más',
      lib_title: "Toda tu biblioteca",
      qf_title: "Arreglo rápido",
      qf_sub: "Tus artistas más escuchados sin género, una tarjeta cada vez. Arreglar un artista arregla también sus álbumes y canciones que no tengan géneros propios.",
      qf_rev_title: "Revisa las suposiciones",
      qf_rev_sub: "Tus artistas principales cuyos géneros solo se adivinaron en línea. Guarda los que estén bien para que sean tuyos.",
      qf_card: "Tarjeta {i} de {n}",
      qf_save_n: "Guardar {n}",
      qf_skip: "Saltar",
      qf_search: "Buscar entre todos",
      qf_none: "¿No es música? Guardar sin género",
      qf_none_tip: "Para pódcasts, audiolibros y similares: queda fuera de todos los recuentos de géneros",
      qf_pick_hint: "Toca los géneros que encajen",
      qf_why_tags: "Sacados de sus propias etiquetas",
      qf_why_collab: "Los artistas con los que aparece tienen estos",
      qf_why_artist: "El artista tiene estos",
      qf_why_top: "No hay pistas, así que aquí van tus géneros principales. Toca los que encajen o busca.",
      qf_why_review: "Adivinado en línea. Déjalo, cámbialo o añade más.",
      qf_done_t: "¡Todo listo!",
      qf_done: "Todos los artistas que escuchas tienen género.",
      qf_wait: "Buscando géneros para tus artistas principales. Las tarjetas nuevas aparecen aquí a medida que llegan.",
      qf_rev_done_t: "Todo revisado",
      qf_rev_done: "Ya no quedan géneros solo adivinados entre tus 100 artistas principales.",
      qf_back_fix: "Volver a Arreglo rápido",
      qf_unskip: "Ver los {n} que saltaste",
      qf_progress: "Tu progreso",
      qf_ring: "de tus reproducciones tienen género",
      qf_streak: "{n} seguidos",
      qf_streak0: "Guarda uno para empezar una racha",
      qf_streak_none: "No queda nada por arreglar",
      qf_badge_got: "Conseguido: el {n}% de tus reproducciones tiene género",
      qf_badge_todo: "Se desbloquea cuando el {n}% de tus reproducciones tenga género",
      qf_badge_new: "¡Insignia desbloqueada: el {n}% de tus reproducciones tiene género!",
      qf_keys: "1–6 elegir · Enter guardar · → saltar",
      gp_back: "Biblioteca de géneros",
      gp_open: "Abrir la página de {name}",
      gp_plays: "Reproducciones",
      gp_share: "De lo que escuchas",
      gp_first: "Primera vez",
      gp_artists: "Artistas",
      gp_songs: "Canciones",
      gp_rank: "tu género n.º {n}",
      rar_common: "Común",
      rar_rare: "Raro",
      rar_deep: "Joya oculta",
      rar_common_tip: "Uno de los géneros que más gente escucha",
      rar_rare_tip: "Una rama de un género conocido",
      rar_deep_tip: "Fuera de lo común: no tiene que ver con ninguno de los grandes géneros",
      gp_none: "Aún no has escuchado nada de {name}. Prueba algo parecido aquí abajo.",
      gp_mix: "Escuchar una mezcla",
      gp_sp: "Crear lista inteligente",
      gp_share_card: "Tarjeta para compartir",
      gp_fix: "Corregir géneros aquí",
      gp_mix_on: "Sonando una mezcla de {name}: {n} canciones en la cola",
      gp_sp_name: "Mezcla de {name}",
      gp_top_artists: "Tus artistas principales",
      gp_top_songs: "Tus canciones principales",
      gp_top_albums: "Tus álbumes principales",
      gp_months: "Los últimos 12 meses",
      gp_peak: "Tu mejor mes: {m}, {n} reproducciones",
      gp_next: "Parecidos",
      gp_new: "nuevo",
      gp_second: "{name} nunca es el género principal de una canción que escuchas, pero {n} canciones lo tienen como otro género ({p}).",
      snd_title: "Tu sonido",
      snd_head: "Tu música es un {pct} {fam}",
      snd_tail_second: ", y un {pct} {fam}.",
      snd_tail_spread: ", repartida entre {n} familias.",
      snd_other: "Todo lo demás",
      snd_bar: "Tus familias de géneros según sus reproducciones",
      snd_heard: "géneros escuchados",
      snd_riser: "el que más sube",
      snd_rarest: "el más raro",
      snd_span_all: "Siempre",
      snd_span_365: "Últimos 12 meses",
      snd_span_30: "Últimos 30 días",
      snd_span_label: "Periodo",
      snd_all_fams: "Todas las familias",
      snd_hint: "Toca una familia para abrirla y luego un género para ver su página.",
      snd_map: "Mapa de burbujas de tus géneros",
      sh_title: "Tu colección de géneros",
      sh_sub: "{n} géneros coleccionados.",
      sh_sub_rare: "Entre ellos, {r} raros y {d} joyas ocultas.",
      sh_sub_locked: "Las tarjetas grises son géneros parecidos que aún no has escuchado.",
      sh_locked: "Aún sin escuchar",
      sh_all: "Ver los {n}",
      sh_less: "Ver menos",
      card_title: "Tarjeta de {name}",
      card_save: "Guardar imagen",
      card_share: "Compartir",
      card_rank: "Mi género n.º {n}",
      card_cta: "¿Cuál es tu género n.º 1? Descúbrelo en dankcharts.fm",
      td_title: "Ordenar",
      td_sub: "Cosas que no cuadran, cada una se arregla de una vez.",
      td_free_t: "{n} canciones y álbumes solo tienen etiquetas que no son géneros",
      td_free_t1: "1 canción o álbum solo tiene etiquetas que no son géneros",
      td_free: "Etiquetas como «female vocalists» o «2015» de tu hoja ({s} canciones, {a} álbumes). Sus artistas tienen géneros de verdad que pueden usar.",
      td_free_btn: "Arreglar los {n}",
      td_free_confirm: "Cada uno recibe los géneros de su artista como elección tuya. Tu hoja no cambia y puedes cambiar cualquiera después.",
      td_free_ok: "Arreglarlos",
      td_free_done: "Hecho: {n} usan ahora los géneros de su artista",
      td_none_t: "{n} artistas aún no tienen género",
      td_none_t1: "1 artista aún no tiene género",
      td_none: "Revísalos uno a uno, tarjeta a tarjeta.",
      td_none_btn: "Abrir Arreglo rápido",
      td_guess_t: "{n} de tus artistas principales solo tienen géneros adivinados",
      td_guess_t1: "1 de tus artistas principales solo tiene géneros adivinados",
      td_guess: "Salen de etiquetas en línea, no de votos. Revísalos uno a uno.",
      td_guess_btn: "Revisar {n}",
      td_mixed_t: "Las canciones de {name} dicen {n} cosas distintas",
      td_mixed: "Tu hoja les da {list}. Elige qué es el artista; las canciones conservan lo suyo.",
      td_mixed_btn: "Elegir para {name}"
    },
    'pt-BR': {
      title: 'Biblioteca de gêneros',
      intro: 'Os gêneros dos seus artistas, álbuns e músicas, e de onde vem cada um. Corrija os que estiverem errados: o que você escolher vale em todo lugar onde os gêneros contam — Prêmios, Playlists inteligentes e a aba Diário.',
      tab_artists: 'Artistas', tab_albums: 'Álbuns', tab_songs: 'Músicas',
      st_cover: 'Com gênero', st_yours: 'Escolhidos por você', st_missing: 'Sem gênero ainda', st_of: 'de {n}',
      search_ph: 'Busque nomes ou gêneros…', f_all: 'Todos', f_missing: 'Sem gênero', f_yours: 'Escolhidos por você',
      sort_plays: 'Mais ouvidos', sort_az: 'A–Z', sort_label: 'Ordenar',
      top_genres: 'Principais gêneros aqui', clear_genre: 'Mostrar todos os gêneros',
      none_yet: 'Sem gênero ainda', looking: 'Buscando…',
      src_you: 'Seus', src_sheet: 'Planilha', src_mb: 'MusicBrainz', src_web: 'Tags online',
      src_you_tip: 'Você escolheu', src_sheet_tip: 'Da sua Google Sheet / CSV', src_mb_tip: 'Gêneros votados no MusicBrainz',
      src_web_tip: 'Tags do Gemini ou do Last.fm', via_album: 'do álbum', via_artist: 'do artista',
      edit: 'Editar gêneros', add: 'Adicionar gêneros', more: 'Mostrar mais {n}',
      empty_q: 'Nada aqui corresponde a “{q}”.', empty_f: 'Nada aqui ainda.', nodata: 'Sua biblioteca ainda está carregando…',
      play_one: '1 play', play_other: '{n} plays',
      signed_out: 'O que você escolher fica salvo neste aparelho. Entre para guardar na sua conta e nos seus outros aparelhos.',
      signin: 'Entrar',
      order_note: 'O que você escolher vem primeiro. Uma música ou um álbum com gêneros próprios continua com eles quando você muda os do artista.',
      pk_title: 'Gêneros de {name}', pk_kind_artist: 'Artista', pk_kind_album: 'Álbum', pk_kind_song: 'Música',
      pk_sel_empty: 'Nenhum gênero escolhido. Busque abaixo ou toque numa sugestão.',
      pk_count: '{n} de {max}', pk_main: 'Principal', pk_make_main: 'Tornar {name} o gênero principal', pk_remove: 'Remover {name}',
      pk_ph: 'Busque entre {n} gêneros…', pk_suggested: 'Os que tem agora', pk_artist_has: 'O artista tem',
      pk_popular: 'Populares', pk_browse: 'Explorar por família', pk_back: 'Todas as famílias', pk_fam_n: '{n} gêneros',
      pk_full: 'Esse é o máximo ({max}). Remova um para adicionar outro.',
      pk_none_q: 'Nenhum gênero chamado “{q}”.', pk_maybe: 'Mais parecidos',
      pk_sugg_title: 'Não encontrou?',
      pk_sugg_text: 'Sugira “{q}” no Fórum. Quando um moderador adicionar, ele entra na lista de todo mundo.',
      pk_sugg_btn: 'Sugerir no Fórum',
      pk_save: 'Salvar', pk_save_none: 'Salvar sem gênero', pk_cancel: 'Cancelar', pk_reset: 'Usar gêneros automáticos',
      pk_saved: 'Gêneros salvos', pk_saved_none: 'Salvo sem gênero', pk_reset_done: 'De volta aos gêneros automáticos',
      pk_auto_note: 'Estes são os gêneros que ele tem agora. Mude e salve para que sejam seus.',
      pk_yours_note: 'Você escolheu estes.',
      pk_loading: 'Carregando a lista de gêneros…', pk_load_fail: 'A lista de gêneros não carregou. Confira sua conexão e tente de novo.',
      pk_added: 'Adicionado', pk_hint_keys: '↑ ↓ para mover · Enter para adicionar',
      sugg_post_title: 'Sugestão de gênero: {name}',
      sugg_post_body: 'Por favor, adicionem “{name}” à lista de gêneros.\n\nEu queria para: {item}',
      ad_title: 'Gêneros adicionados por sugestão', ad_intro: 'Só os moderadores veem isto. Os gêneros adicionados aqui entram na lista de todo mundo na hora.',
      ad_add: 'Adicionar um gênero', ad_from_post: 'Adicionar à lista de gêneros', ad_name: 'Nome, como as pessoas vão ver',
      ad_fam: 'Família', ad_alias: 'Outras grafias que as pessoas podem buscar (opcional)', ad_alias_ph: 'ex.: baile phonk, funk phonk',
      ad_saved_as: 'Salvo como “{id}”', ad_dupe: 'Já está na lista como “{name}”.', ad_short: 'Digite pelo menos 2 letras.',
      ad_save: 'Adicionar gênero', ad_added: '“{name}” já está na lista de todo mundo', ad_removed: '“{name}” removido',
      ad_remove: 'Remover', ad_fail: 'Não salvou. Confira se as novas regras do Firestore foram coladas.',
      ad_none: 'Nenhum adicionado ainda.', ad_remove_title: 'Remover “{name}”?',
      ad_remove_text: 'Quem já escolheu continua com ele, mas ninguém mais poderá escolhê-lo.',
      dp_genres: 'Gêneros', dp_edit: 'Editar', dp_add: 'Adicionar gêneros',
      free_tip: 'Não está na lista de gêneros. Toque em Editar para trocar por um que esteja.',
      fam_brazil: 'Brasileira', fam_latin: 'Latina', fam_asia: 'Asiática', fam_africa: 'Africana', fam_christian: 'Cristã e gospel',
      fam_metal: 'Metal', fam_punk: 'Punk e emo', fam_hiphop: 'Hip hop e rap', fam_rnb: 'R&B, soul e funk', fam_jazz: 'Jazz',
      fam_blues: 'Blues', fam_country: 'Country', fam_reggae: 'Reggae e caribenha', fam_electronic: 'Eletrônica e dance',
      fam_rock: 'Rock e alternativo', fam_pop: 'Pop', fam_classical: 'Clássica', fam_screen: 'Trilhas sonoras e palco',
      fam_folk: 'Folk e acústica', fam_world: 'Do mundo e mais',
      lib_title: "Sua biblioteca inteira",
      qf_title: "Ajuste rápido",
      qf_sub: "Seus artistas mais ouvidos sem gênero, um cartão por vez. Ajustar um artista ajusta também os álbuns e as músicas dele que não têm gêneros próprios.",
      qf_rev_title: "Confira os palpites",
      qf_rev_sub: "Seus principais artistas cujos gêneros só foram adivinhados online. Salve os que estiverem certos para que sejam seus.",
      qf_card: "Cartão {i} de {n}",
      qf_save_n: "Salvar {n}",
      qf_skip: "Pular",
      qf_search: "Buscar em todos",
      qf_none: "Não é música? Salvar sem gênero",
      qf_none_tip: "Para podcasts, audiolivros e afins: fica fora de todas as contas de gêneros",
      qf_pick_hint: "Toque nos gêneros que combinam",
      qf_why_tags: "Tirados das próprias tags",
      qf_why_collab: "Os artistas com quem aparece têm estes",
      qf_why_artist: "O artista tem estes",
      qf_why_top: "Sem pistas, então aqui vão seus principais gêneros. Toque nos que combinam ou busque.",
      qf_why_review: "Adivinhado online. Mantenha, troque ou adicione mais.",
      qf_done_t: "Tudo pronto!",
      qf_done: "Todo artista que você ouve tem gênero.",
      qf_wait: "Buscando gêneros para seus principais artistas. Novos cartões aparecem aqui conforme as respostas chegam.",
      qf_rev_done_t: "Tudo conferido",
      qf_rev_done: "Não sobrou nenhum gênero só adivinhado entre seus 100 principais artistas.",
      qf_back_fix: "Voltar ao Ajuste rápido",
      qf_unskip: "Mostrar os {n} que você pulou",
      qf_progress: "Seu progresso",
      qf_ring: "dos seus plays têm gênero",
      qf_streak: "{n} seguidos",
      qf_streak0: "Salve um para começar uma sequência",
      qf_streak_none: "Nada mais para ajustar",
      qf_badge_got: "Conquistado: {n}% dos seus plays têm gênero",
      qf_badge_todo: "Desbloqueia quando {n}% dos seus plays tiverem gênero",
      qf_badge_new: "Medalha desbloqueada: {n}% dos seus plays têm gênero!",
      qf_keys: "1–6 escolher · Enter salvar · → pular",
      gp_back: "Biblioteca de gêneros",
      gp_open: "Abrir a página de {name}",
      gp_plays: "Plays",
      gp_share: "Do que você ouve",
      gp_first: "Primeira vez",
      gp_artists: "Artistas",
      gp_songs: "Músicas",
      gp_rank: "seu gênero nº {n}",
      rar_common: "Comum",
      rar_rare: "Raro",
      rar_deep: "Pérola escondida",
      rar_common_tip: "Um dos gêneros que mais gente ouve",
      rar_rare_tip: "Um ramo de um gênero conhecido",
      rar_deep_tip: "Fora do comum: não tem a ver com nenhum dos grandes gêneros",
      gp_none: "Você ainda não ouviu nada de {name}. Experimente algo parecido aqui embaixo.",
      gp_mix: "Tocar um mix",
      gp_sp: "Criar playlist inteligente",
      gp_share_card: "Cartão para compartilhar",
      gp_fix: "Corrigir gêneros aqui",
      gp_mix_on: "Tocando um mix de {name}: {n} músicas na fila",
      gp_sp_name: "Mix de {name}",
      gp_top_artists: "Seus principais artistas",
      gp_top_songs: "Suas principais músicas",
      gp_top_albums: "Seus principais álbuns",
      gp_months: "Os últimos 12 meses",
      gp_peak: "Seu maior mês: {m}, {n} plays",
      gp_next: "Parecidos",
      gp_new: "novo",
      gp_second: "{name} nunca é o gênero principal de uma música que você ouve, mas {n} músicas têm ele como outro gênero ({p}).",
      snd_title: "Seu som",
      snd_head: "Seu som é {pct} {fam}",
      snd_tail_second: ", e {pct} {fam}.",
      snd_tail_spread: ", espalhado por {n} famílias.",
      snd_other: "Todo o resto",
      snd_bar: "Suas famílias de gêneros pela parte dos plays",
      snd_heard: "gêneros ouvidos",
      snd_riser: "o que mais cresce",
      snd_rarest: "o mais raro",
      snd_span_all: "Desde sempre",
      snd_span_365: "Últimos 12 meses",
      snd_span_30: "Últimos 30 dias",
      snd_span_label: "Período",
      snd_all_fams: "Todas as famílias",
      snd_hint: "Toque numa família para abrir e depois num gênero para ver a página dele.",
      snd_map: "Mapa de bolhas dos seus gêneros",
      sh_title: "Sua coleção de gêneros",
      sh_sub: "{n} gêneros colecionados.",
      sh_sub_rare: "Entre eles, {r} raros e {d} pérolas escondidas.",
      sh_sub_locked: "Os cartões cinza são gêneros parecidos que você ainda não ouviu.",
      sh_locked: "Ainda não ouvido",
      sh_all: "Mostrar os {n}",
      sh_less: "Mostrar menos",
      card_title: "Cartão de {name}",
      card_save: "Salvar imagem",
      card_share: "Compartilhar",
      card_rank: "Meu gênero nº {n}",
      card_cta: "Qual é o seu gênero nº 1? Descubra no dankcharts.fm",
      td_title: "Arrumar",
      td_sub: "Coisas que parecem erradas, cada uma resolvida de uma vez.",
      td_free_t: "{n} músicas e álbuns só têm tags que não são gêneros",
      td_free_t1: "1 música ou álbum só tem tags que não são gêneros",
      td_free: "Tags como “female vocalists” ou “2015” da sua planilha ({s} músicas, {a} álbuns). Os artistas deles têm gêneros de verdade que eles podem usar.",
      td_free_btn: "Corrigir os {n}",
      td_free_confirm: "Cada um recebe os gêneros do seu artista como escolha sua. Sua planilha não muda, e você pode mudar qualquer um depois.",
      td_free_ok: "Corrigir",
      td_free_done: "Pronto: {n} agora usam os gêneros do artista",
      td_none_t: "{n} artistas ainda não têm gênero",
      td_none_t1: "1 artista ainda não tem gênero",
      td_none: "Veja um por um, cartão por cartão.",
      td_none_btn: "Abrir Ajuste rápido",
      td_guess_t: "{n} dos seus principais artistas só têm gêneros adivinhados",
      td_guess_t1: "1 dos seus principais artistas só tem gêneros adivinhados",
      td_guess: "Vieram de tags online, não de votos. Confira um por um.",
      td_guess_btn: "Conferir {n}",
      td_mixed_t: "As músicas de {name} dizem {n} coisas diferentes",
      td_mixed: "Sua planilha dá a elas {list}. Escolha o que o artista é; as músicas mantêm o delas.",
      td_mixed_btn: "Escolher para {name}"
    },
    'pt-PT': {
      title: 'Biblioteca de géneros',
      intro: 'Os géneros dos teus artistas, álbuns e músicas, e de onde vem cada um. Corrige os que estiverem errados: o que escolheres conta em todo o lado onde os géneros contam — Prémios, Playlists inteligentes e o separador Diário.',
      tab_artists: 'Artistas', tab_albums: 'Álbuns', tab_songs: 'Músicas',
      st_cover: 'Com género', st_yours: 'Escolhidos por ti', st_missing: 'Sem género ainda', st_of: 'de {n}',
      search_ph: 'Pesquisa nomes ou géneros…', f_all: 'Todos', f_missing: 'Sem género', f_yours: 'Escolhidos por ti',
      sort_plays: 'Mais ouvidos', sort_az: 'A–Z', sort_label: 'Ordenar',
      top_genres: 'Principais géneros aqui', clear_genre: 'Mostrar todos os géneros',
      none_yet: 'Sem género ainda', looking: 'A procurar…',
      src_you: 'Teus', src_sheet: 'Folha', src_mb: 'MusicBrainz', src_web: 'Etiquetas online',
      src_you_tip: 'Foste tu que escolheste', src_sheet_tip: 'Da tua Google Sheet / CSV', src_mb_tip: 'Géneros votados no MusicBrainz',
      src_web_tip: 'Etiquetas do Gemini ou do Last.fm', via_album: 'do álbum', via_artist: 'do artista',
      edit: 'Editar géneros', add: 'Adicionar géneros', more: 'Mostrar mais {n}',
      empty_q: 'Nada aqui corresponde a “{q}”.', empty_f: 'Ainda não há nada aqui.', nodata: 'A tua biblioteca ainda está a carregar…',
      play_one: '1 reprodução', play_other: '{n} reproduções',
      signed_out: 'O que escolheres fica guardado neste dispositivo. Inicia sessão para o guardar na tua conta e nos teus outros dispositivos.',
      signin: 'Iniciar sessão',
      order_note: 'O que escolheres vem primeiro. Uma música ou um álbum com géneros próprios mantém-nos quando mudas os do artista.',
      pk_title: 'Géneros de {name}', pk_kind_artist: 'Artista', pk_kind_album: 'Álbum', pk_kind_song: 'Música',
      pk_sel_empty: 'Nenhum género escolhido. Pesquisa abaixo ou toca numa sugestão.',
      pk_count: '{n} de {max}', pk_main: 'Principal', pk_make_main: 'Tornar {name} o género principal', pk_remove: 'Remover {name}',
      pk_ph: 'Pesquisa entre {n} géneros…', pk_suggested: 'Os que tem agora', pk_artist_has: 'O artista tem',
      pk_popular: 'Populares', pk_browse: 'Explorar por família', pk_back: 'Todas as famílias', pk_fam_n: '{n} géneros',
      pk_full: 'Esse é o máximo ({max}). Remove um para adicionar outro.',
      pk_none_q: 'Nenhum género chamado “{q}”.', pk_maybe: 'Mais parecidos',
      pk_sugg_title: 'Não encontras?',
      pk_sugg_text: 'Sugere “{q}” no Fórum. Quando um moderador o adicionar, fica na lista de toda a gente.',
      pk_sugg_btn: 'Sugerir no Fórum',
      pk_save: 'Guardar', pk_save_none: 'Guardar sem género', pk_cancel: 'Cancelar', pk_reset: 'Usar géneros automáticos',
      pk_saved: 'Géneros guardados', pk_saved_none: 'Guardado sem género', pk_reset_done: 'De volta aos géneros automáticos',
      pk_auto_note: 'Estes são os géneros que tem agora. Muda-os e guarda para que sejam teus.',
      pk_yours_note: 'Foste tu que escolheste estes.',
      pk_loading: 'A carregar a lista de géneros…', pk_load_fail: 'A lista de géneros não carregou. Verifica a ligação e tenta outra vez.',
      pk_added: 'Adicionado', pk_hint_keys: '↑ ↓ para mover · Enter para adicionar',
      sugg_post_title: 'Sugestão de género: {name}',
      sugg_post_body: 'Por favor, adicionem “{name}” à lista de géneros.\n\nQueria-o para: {item}',
      ad_title: 'Géneros adicionados por sugestão', ad_intro: 'Só os moderadores veem isto. Os géneros adicionados aqui ficam na lista de toda a gente de imediato.',
      ad_add: 'Adicionar um género', ad_from_post: 'Adicionar à lista de géneros', ad_name: 'Nome, como as pessoas o vão ver',
      ad_fam: 'Família', ad_alias: 'Outras grafias que as pessoas podem pesquisar (opcional)', ad_alias_ph: 'p. ex. baile phonk, funk phonk',
      ad_saved_as: 'Guardado como “{id}”', ad_dupe: 'Já está na lista como “{name}”.', ad_short: 'Escreve pelo menos 2 letras.',
      ad_save: 'Adicionar género', ad_added: '“{name}” já está na lista de toda a gente', ad_removed: '“{name}” removido',
      ad_remove: 'Remover', ad_fail: 'Não ficou guardado. Verifica se as novas regras do Firestore foram coladas.',
      ad_none: 'Ainda nenhum adicionado.', ad_remove_title: 'Remover “{name}”?',
      ad_remove_text: 'Quem já o escolheu mantém-no, mas ninguém mais o poderá escolher.',
      dp_genres: 'Géneros', dp_edit: 'Editar', dp_add: 'Adicionar géneros',
      free_tip: 'Não está na lista de géneros. Toca em Editar para o trocar por um que esteja.',
      fam_brazil: 'Brasileira', fam_latin: 'Latina', fam_asia: 'Asiática', fam_africa: 'Africana', fam_christian: 'Cristã e gospel',
      fam_metal: 'Metal', fam_punk: 'Punk e emo', fam_hiphop: 'Hip hop e rap', fam_rnb: 'R&B, soul e funk', fam_jazz: 'Jazz',
      fam_blues: 'Blues', fam_country: 'Country', fam_reggae: 'Reggae e caribenha', fam_electronic: 'Eletrónica e dance',
      fam_rock: 'Rock e alternativo', fam_pop: 'Pop', fam_classical: 'Clássica', fam_screen: 'Bandas sonoras e palco',
      fam_folk: 'Folk e acústica', fam_world: 'Do mundo e mais',
      lib_title: "A tua biblioteca inteira",
      qf_title: "Correção rápida",
      qf_sub: "Os teus artistas mais ouvidos sem género, um cartão de cada vez. Corrigir um artista corrige também os álbuns e as músicas dele que não têm géneros próprios.",
      qf_rev_title: "Confirma os palpites",
      qf_rev_sub: "Os teus principais artistas cujos géneros só foram adivinhados online. Guarda os que estiverem certos para que sejam teus.",
      qf_card: "Cartão {i} de {n}",
      qf_save_n: "Guardar {n}",
      qf_skip: "Saltar",
      qf_search: "Pesquisar em todos",
      qf_none: "Não é música? Guardar sem género",
      qf_none_tip: "Para podcasts, audiolivros e afins: fica fora de todas as contagens de géneros",
      qf_pick_hint: "Toca nos géneros que encaixam",
      qf_why_tags: "Tirados das próprias etiquetas",
      qf_why_collab: "Os artistas com quem aparece têm estes",
      qf_why_artist: "O artista tem estes",
      qf_why_top: "Sem pistas, por isso aqui vão os teus principais géneros. Toca nos que encaixam ou pesquisa.",
      qf_why_review: "Adivinhado online. Mantém, muda ou adiciona mais.",
      qf_done_t: "Tudo pronto!",
      qf_done: "Todos os artistas que ouves têm género.",
      qf_wait: "A procurar géneros para os teus principais artistas. Os cartões novos aparecem aqui à medida que as respostas chegam.",
      qf_rev_done_t: "Tudo confirmado",
      qf_rev_done: "Já não há géneros só adivinhados entre os teus 100 principais artistas.",
      qf_back_fix: "Voltar à Correção rápida",
      qf_unskip: "Mostrar os {n} que saltaste",
      qf_progress: "O teu progresso",
      qf_ring: "das tuas reproduções têm género",
      qf_streak: "{n} seguidos",
      qf_streak0: "Guarda um para começar uma sequência",
      qf_streak_none: "Já não há nada para corrigir",
      qf_badge_got: "Conseguido: {n}% das tuas reproduções têm género",
      qf_badge_todo: "Desbloqueia quando {n}% das tuas reproduções tiverem género",
      qf_badge_new: "Medalha desbloqueada: {n}% das tuas reproduções têm género!",
      qf_keys: "1–6 escolher · Enter guardar · → saltar",
      gp_back: "Biblioteca de géneros",
      gp_open: "Abrir a página de {name}",
      gp_plays: "Reproduções",
      gp_share: "Do que ouves",
      gp_first: "Primeira vez",
      gp_artists: "Artistas",
      gp_songs: "Músicas",
      gp_rank: "o teu género n.º {n}",
      rar_common: "Comum",
      rar_rare: "Raro",
      rar_deep: "Pérola escondida",
      rar_common_tip: "Um dos géneros que mais gente ouve",
      rar_rare_tip: "Um ramo de um género conhecido",
      rar_deep_tip: "Fora do comum: não tem a ver com nenhum dos grandes géneros",
      gp_none: "Ainda não ouviste nada de {name}. Experimenta algo parecido aqui em baixo.",
      gp_mix: "Tocar uma mistura",
      gp_sp: "Criar playlist inteligente",
      gp_share_card: "Cartão para partilhar",
      gp_fix: "Corrigir géneros aqui",
      gp_mix_on: "A tocar uma mistura de {name}: {n} músicas na fila",
      gp_sp_name: "Mistura de {name}",
      gp_top_artists: "Os teus principais artistas",
      gp_top_songs: "As tuas principais músicas",
      gp_top_albums: "Os teus principais álbuns",
      gp_months: "Os últimos 12 meses",
      gp_peak: "O teu maior mês: {m}, {n} reproduções",
      gp_next: "Parecidos",
      gp_new: "novo",
      gp_second: "{name} nunca é o género principal de uma música que ouves, mas {n} músicas têm-no como outro género ({p}).",
      snd_title: "O teu som",
      snd_head: "O teu som é {pct} {fam}",
      snd_tail_second: ", e {pct} {fam}.",
      snd_tail_spread: ", espalhado por {n} famílias.",
      snd_other: "Todo o resto",
      snd_bar: "As tuas famílias de géneros pela parte das reproduções",
      snd_heard: "géneros ouvidos",
      snd_riser: "o que mais cresce",
      snd_rarest: "o mais raro",
      snd_span_all: "Desde sempre",
      snd_span_365: "Últimos 12 meses",
      snd_span_30: "Últimos 30 dias",
      snd_span_label: "Período",
      snd_all_fams: "Todas as famílias",
      snd_hint: "Toca numa família para a abrir e depois num género para ver a página dele.",
      snd_map: "Mapa de bolhas dos teus géneros",
      sh_title: "A tua coleção de géneros",
      sh_sub: "{n} géneros colecionados.",
      sh_sub_rare: "Entre eles, {r} raros e {d} pérolas escondidas.",
      sh_sub_locked: "Os cartões cinzentos são géneros parecidos que ainda não ouviste.",
      sh_locked: "Ainda não ouvido",
      sh_all: "Mostrar os {n}",
      sh_less: "Mostrar menos",
      card_title: "Cartão de {name}",
      card_save: "Guardar imagem",
      card_share: "Partilhar",
      card_rank: "O meu género n.º {n}",
      card_cta: "Qual é o teu género n.º 1? Descobre no dankcharts.fm",
      td_title: "Arrumar",
      td_sub: "Coisas que parecem erradas, cada uma resolvida de uma vez.",
      td_free_t: "{n} músicas e álbuns só têm etiquetas que não são géneros",
      td_free_t1: "1 música ou álbum só tem etiquetas que não são géneros",
      td_free: "Etiquetas como “female vocalists” ou “2015” da tua folha ({s} músicas, {a} álbuns). Os artistas deles têm géneros a sério que podem usar.",
      td_free_btn: "Corrigir os {n}",
      td_free_confirm: "Cada um recebe os géneros do seu artista como escolha tua. A tua folha não muda, e podes mudar qualquer um depois.",
      td_free_ok: "Corrigir",
      td_free_done: "Feito: {n} usam agora os géneros do artista",
      td_none_t: "{n} artistas ainda não têm género",
      td_none_t1: "1 artista ainda não tem género",
      td_none: "Vê-os um a um, cartão a cartão.",
      td_none_btn: "Abrir Correção rápida",
      td_guess_t: "{n} dos teus principais artistas só têm géneros adivinhados",
      td_guess_t1: "1 dos teus principais artistas só tem géneros adivinhados",
      td_guess: "Vieram de etiquetas online, não de votos. Confirma-os um a um.",
      td_guess_btn: "Confirmar {n}",
      td_mixed_t: "As músicas de {name} dizem {n} coisas diferentes",
      td_mixed: "A tua folha dá-lhes {list}. Escolhe o que o artista é; as músicas mantêm o delas.",
      td_mixed_btn: "Escolher para {name}"
    }
  };
  function tx(k, vars) {
    const lang = (typeof currentLang !== 'undefined' && TXT[currentLang]) ? currentLang : 'en';
    let s = (TXT[lang] && TXT[lang][k]) || TXT.en[k] || k;
    if (vars) for (const v in vars) s = s.split('{' + v + '}').join(vars[v]);
    return s;
  }
  const num = n => Number(n || 0).toLocaleString();
  // A count sentence: key + '1' when there is one and that wording exists
  const txn = (k, n, vars) => tx(n === 1 && TXT.en[k + '1'] ? k + '1' : k, Object.assign({ n: num(n) }, vars || {}));
  const plays = n => tx(n === 1 ? 'play_one' : 'play_other', { n: num(n) });
  // HTML-safe, including ' (app.js's esc() leaves that one alone)
  const H = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const ico = n => (typeof dcIco === 'function' ? dcIco(n) : '');
  const toast = msg => { if (typeof dcPlToast === 'function') dcPlToast(msg); };
  const MAX = typeof GENRE_EDIT_MAX !== 'undefined' ? GENRE_EDIT_MAX : 5;

  // Each family's hue, for the small dot on its genres (mixed with the
  // theme in CSS, so it stays readable on light and dark)
  const FAM_HUE = {
    brazil: '#22c55e', latin: '#f97316', asia: '#ec4899', africa: '#eab308', christian: '#a78bfa', metal: '#94a3b8',
    punk: '#f43f5e', hiphop: '#f59e0b', rnb: '#d946ef', jazz: '#0ea5e9', blues: '#3b82f6', country: '#d97706',
    reggae: '#16a34a', electronic: '#06b6d4', rock: '#ef4444', pop: '#f472b6', classical: '#c4b5fd', screen: '#818cf8',
    folk: '#84cc16', world: '#14b8a6'
  };

  /* ── 2. The genre list ─────────────────────────────────────────────────
     G.list: [{ id, name, fam, al, w, n, c, pop, x }]
       id   lower-case name, what gets saved     name  shown
       fam  family id                            al    extra search words
       n    the name normalised for search       c     n without spaces
       w    every search word (name + extras)    pop   in the "popular" set
       x    added by a moderator (genreExtras) */
  const G = { ready: null, list: [], byId: new Map(), byC: new Map(), fams: [], popular: [], famCount: {} };
  // Lower case, accents off, & = and, punctuation to spaces
  const norm = s => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ').replace(/\bn\b/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
  const compact = s => norm(s).replace(/ /g, '');

  function addEntry(id, name, fam, al, x) {
    id = String(id).toLowerCase();
    if (G.byId.has(id)) return;
    const n = norm(name || id);
    const e = { id, name: name || id, fam: fam || 'world', al: al || '', n, c: n.replace(/ /g, ''), w: (n + ' ' + norm(al)).split(' ').filter(Boolean), pop: false, x: !!x };
    G.list.push(e);
    G.byId.set(id, e);
    if (!G.byC.has(e.c)) G.byC.set(e.c, e);
  }
  function build() {
    const D = window.DC_GENRES;
    G.list = []; G.byId = new Map(); G.byC = new Map();
    G.fams = D.fams.slice();
    for (const r of D.list) addEntry(r[0], r[1], D.fams[r[2]], r[3] || '', false);
    // A one-word extra spelling ("rnb", "dnb", "rap") also maps a tag to its genre
    for (const e of G.list) for (const a of norm(e.al).split(' ')) if (a.length > 2 && !G.byC.has(a)) G.byC.set(a, e);
    G.popular = D.popular.filter(id => G.byId.has(id));
    for (const id of G.popular) G.byId.get(id).pop = true;
    countFams();
  }
  function countFams() {
    G.famCount = {};
    for (const e of G.list) G.famCount[e.fam] = (G.famCount[e.fam] || 0) + 1;
  }

  /* The moderators' extras: kept in this browser for 6 hours, then asked
     again in the background, so the picker never waits on Firestore */
  const XKEY = 'dc_genre_extras', X_TTL = 6 * 3600 * 1000;
  let _extras = [];
  function cachedExtras() {
    try { const v = JSON.parse(localStorage.getItem(XKEY) || 'null'); return v && Array.isArray(v.list) ? v : null; } catch (e) { return null; }
  }
  function applyExtras(list) {
    // Drop the old extras first (one may have been removed or renamed)
    if (_extras.length) {
      G.list = G.list.filter(e => !e.x);
      G.byId = new Map(G.list.map(e => [e.id, e]));
      G.byC = new Map();
      for (const e of G.list) if (!G.byC.has(e.c)) G.byC.set(e.c, e);
    }
    _extras = (list || []).filter(x => x && x.id && x.name);
    for (const x of _extras) addEntry(x.id, x.name, G.fams.includes(x.fam) ? x.fam : 'world', x.aliases || '', true);
    G.list.sort((a, b) => a.id.localeCompare(b.id));
    countFams();
  }
  function refreshExtras(force) {
    if (typeof dcLoadGenreExtras !== 'function') return Promise.resolve();
    const c = cachedExtras();
    if (!force && c && Date.now() - (c.at || 0) < X_TTL) return Promise.resolve();
    return dcLoadGenreExtras().then(list => {
      if (!Array.isArray(list)) return;
      try { localStorage.setItem(XKEY, JSON.stringify({ at: Date.now(), list })); } catch (e) {}
      applyExtras(list);
      if (_pick) renderPick();
      if (_pageOn) renderPage();
    });
  }

  function loadList() {
    if (G.ready) return G.ready;
    G.ready = new Promise((res, rej) => {
      if (window.DC_GENRES) { res(); return; }
      const s = document.createElement('script');
      // The ?v= lives in a meta tag in index.html, next to the other files' numbers
      const m = document.querySelector('meta[name="dc-genres-src"]');
      s.src = m ? m.content : 'genres.js';
      s.onload = () => res();
      s.onerror = () => rej(new Error('genres.js did not load'));
      document.head.appendChild(s);
    }).then(() => {
      build();
      const c = cachedExtras();
      if (c) applyExtras(c.list);
      refreshExtras();
    }).catch(err => { G.ready = null; throw err; });
    return G.ready;
  }

  // The shown name of a genre id, or of any tag (sheet, Last.fm) not in the list
  function nameOf(id) {
    const e = G.byId.get(String(id).toLowerCase());
    if (e) return e.name;
    return String(id).replace(/(^|[\s\-\/])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
  }
  // A tag as typed anywhere ("Hip-Hop", "rnb", "Drum & Bass") → its list entry
  function entryOfTag(tag) {
    const s = String(tag || '').toLowerCase();
    return G.byId.get(s) || G.byC.get(compact(s)) || null;
  }

  // Edit distance, capped: enough for "reggeaton" → "reggaeton"
  function near(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return false;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      let best = i;
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return false;
      prev = cur;
    }
    return prev[b.length] <= max;
  }

  /* Best first: the name itself, then names starting with it, then names
     where every word typed starts a word, then extra spellings, then names
     merely containing it. Popular genres and genres already in your library
     rank higher within each step. When nothing matches at all, near misses
     (one or two letters off) are offered instead — fuzzy: true. */
  function search(q, opts) {
    opts = opts || {};
    const limit = opts.limit || 50, boost = opts.boost || null;
    const qn = norm(q), qc = qn.replace(/ /g, '');
    if (!qn) return { list: [], fuzzy: false };
    const qt = qn.split(' ');
    const out = [];
    for (const e of G.list) {
      let s = 0;
      if (e.n === qn || e.c === qc) s = 1000;
      else if (e.n.startsWith(qn) || e.c.startsWith(qc)) s = 800;
      else {
        const nw = e.n.split(' ');
        if (qt.every(t => nw.some(w => w.startsWith(t)))) s = 600;
        else if (qt.every(t => e.w.some(w => w.startsWith(t)))) s = 450;
        else if (e.n.includes(qn) || (qc.length >= 3 && e.c.includes(qc))) s = 350;
      }
      if (!s) continue;
      if (e.pop) s += 60;
      if (boost && boost.has(e.id)) s += 40;
      s -= Math.min(30, e.n.length / 2);   // shorter = the plainer genre
      out.push([s, e]);
    }
    if (out.length) {
      out.sort((a, b) => b[0] - a[0] || a[1].n.localeCompare(b[1].n));
      return { list: out.slice(0, limit).map(o => o[1]), fuzzy: false };
    }
    // Typos: every word typed is close to some word of the genre
    if (qc.length < 3) return { list: [], fuzzy: true };
    const fz = [];
    for (const e of G.list) {
      const ok = qt.every(t => t.length < 3 || e.w.some(w => near(t, w.slice(0, Math.max(t.length, Math.min(w.length, t.length + 1))), t.length > 6 ? 2 : 1)))
        || near(qc, e.c, qc.length > 6 ? 2 : 1);
      if (ok) fz.push([(e.pop ? 60 : 0) - e.n.length, e]);
    }
    fz.sort((a, b) => b[0] - a[0]);
    return { list: fz.slice(0, 8).map(o => o[1]), fuzzy: true };
  }

  /* ── 3. The library's items ────────────────────────────────────────────
     One pass over allPlays, rebuilt when the plays change. Keys match the
     genre lookup's own (_pk / _ak / _sk in app.js): an artist is the
     primary credit, an album is album + primary artist, a song is title +
     artist. p is the newest play, used to ask genreInfo(). */
  let _items = null, _itemsTag = '';
  function items() {
    const P = (typeof allPlays !== 'undefined' && allPlays) || [];
    const tag = P.length + '|' + (P[0] ? +P[0].date : '');
    if (_items && tag === _itemsTag) return _items;
    const artists = new Map(), albums = new Map(), songs = new Map();
    for (const p of P) {
      const pk = _pk(p);
      if (!pk) continue;
      let r = artists.get(pk);
      if (r) r.n++; else artists.set(pk, { kind: 'artist', key: pk, name: _pa(p), sub: '', n: 1, p });
      if (p.album && p.album !== '—') {
        const ak = _ak(p);
        r = albums.get(ak);
        if (r) r.n++; else albums.set(ak, { kind: 'album', key: ak, name: p.album, sub: _pa(p), n: 1, p });
      }
      const sk = _sk(p);
      r = songs.get(sk);
      if (r) r.n++; else songs.set(sk, { kind: 'song', key: sk, name: p.title, sub: p.artist, n: 1, p });
    }
    const prep = m => [...m.values()].sort((a, b) => b.n - a.n);
    _items = { artist: prep(artists), album: prep(albums), song: prep(songs) };
    _itemsTag = tag;
    return _items;
  }
  const kindOfTab = tab => tab === 'albums' ? 'album' : tab === 'songs' ? 'song' : 'artist';

  /* ── 4. The genre picker ───────────────────────────────────────────────
     dcGenreLib.open(kind, p): p is a play-shaped object ({ title, artist,
     artists, album }). The selection starts from the user's own pick, or
     else from the genres it has now (only those in the list), so a small fix
     is one tap. Save stores the ids in order (the first is the main genre);
     saving with none picked marks it "no genre"; "Use automatic genres"
     drops the pick. */
  let _pick = null;   // { kind, p, label, sub, sel: [ids], start: [ids], had, q, fam, act, auto: [ids], artistTags }
  let _pickEl = null;

  function mountPick() {
    if (_pickEl) return _pickEl;
    const el = document.createElement('div');
    el.className = 'modal-overlay gl-pick-overlay';
    el.id = 'glPickModal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'glPickTitle');
    el.innerHTML = `
      <div class="dc-modal dc-frame gl-pick">
        <div class="dc-frame-head gl-pick-head">
          <span class="gl-pick-art" id="glPickArt" aria-hidden="true"></span>
          <div class="dc-frame-titles">
            <h3 class="dc-frame-title" id="glPickTitle"></h3>
            <p class="dc-frame-sub" id="glPickSub"></p>
          </div>
          <button type="button" class="dc-btn dc-btn-plain dc-btn-icon dc-modal-close" data-gl="close">✕</button>
        </div>
        <div class="gl-pick-top">
          <div class="gl-sel" id="glSel" aria-live="polite"></div>
          <label class="gl-search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
            <input type="search" id="glQ" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="glRes" aria-autocomplete="list">
            <kbd class="gl-search-kbd" aria-hidden="true">↵</kbd>
          </label>
        </div>
        <div class="dc-frame-body gl-pick-body"><div class="gl-res" id="glRes" role="listbox"></div></div>
        <div class="dc-frame-foot gl-pick-foot">
          <div class="dc-frame-foot-start"><button type="button" class="dc-btn dc-btn-plain dc-btn-sm gl-reset" data-gl="reset"></button></div>
          <button type="button" class="dc-btn dc-btn-plain" data-gl="close" data-gl-t="pk_cancel"></button>
          <button type="button" class="dc-btn dc-btn-main gl-save" data-gl="save"></button>
        </div>
      </div>`;
    document.body.appendChild(el);
    el.addEventListener('click', onPickClick);
    el.addEventListener('mousedown', e => { if (e.target === el) closePick(); });
    const q = el.querySelector('#glQ');
    q.addEventListener('input', () => { _pick.q = q.value; _pick.act = 0; renderRes(); });
    q.addEventListener('keydown', onPickKey);
    _pickEl = el;
    return el;
  }

  function open(kind, p) {
    if (!p) return;
    const el = mountPick();
    const label = kind === 'artist' ? _pa(p) : kind === 'album' ? p.album : p.title;
    const sub = kind === 'artist' ? tx('pk_kind_artist') : tx('pk_kind_' + kind) + ' · ' + (kind === 'album' ? _pa(p) : p.artist);
    _pick = { kind, p, label, sub, sel: [], start: [], had: false, q: '', fam: '', act: 0, auto: [], artistTags: [], ready: false };
    el.querySelector('#glPickTitle').textContent = tx('pk_title', { name: label });
    el.querySelector('#glPickSub').textContent = sub;
    el.querySelector('[data-gl="close"]').setAttribute('aria-label', typeof t === 'function' ? t('set_close') : 'Close');
    el.querySelectorAll('[data-gl-t]').forEach(b => { b.textContent = tx(b.dataset.glT); });
    const q = el.querySelector('#glQ');
    q.value = '';
    pickArt(kind, p, el.querySelector('#glPickArt'), label);
    el.classList.add('open');
    renderPick();   // the loading state
    loadList().then(() => {
      if (!_pick || _pick.p !== p) return;
      const own = typeof genreEditGet === 'function' ? genreEditGet(kind, p) : undefined;
      const info = typeof genreInfo === 'function' ? genreInfo(kind, p) : { g: [] };
      // What it has now, mapped onto the list (a tag with no match is left out)
      const mapped = [];
      for (const tg of info.g || []) { const e = entryOfTag(tg); if (e && !mapped.includes(e.id)) mapped.push(e.id); }
      // "On it now" only when it differs from the pick (yours are the pick itself)
      _pick.auto = own ? [] : mapped.slice(0, 8);
      _pick.had = !!own;
      _pick.sel = (own ? own.slice() : mapped.slice(0, MAX));
      _pick.start = _pick.sel.slice();
      // A song or album also offers its artist's genres
      if (kind !== 'artist' && typeof genreInfo === 'function') {
        const ai = genreInfo('artist', p);
        for (const tg of ai.g || []) { const e = entryOfTag(tg); if (e && !_pick.artistTags.includes(e.id)) _pick.artistTags.push(e.id); }
      }
      _pick.ready = true;
      q.placeholder = tx('pk_ph', { n: num(G.list.length) });
      q.setAttribute('aria-label', q.placeholder);
      renderPick();
      setTimeout(() => { if (!matchMedia('(hover: none)').matches) q.focus(); }, 60);
    }).catch(() => {
      if (!_pick) return;
      _pick.fail = true;
      renderPick();
    });
  }

  function closePick() {
    if (_pickEl) _pickEl.classList.remove('open');
    _pick = null;
  }

  // The item's picture in the header, from the app's own artwork lookup
  function pickArt(kind, p, el, label) {
    el.classList.toggle('is-round', kind === 'artist');
    el.style.backgroundImage = '';
    el.textContent = typeof initials === 'function' ? initials(label || '') : '';
    artFor(kind, p).then(url => {
      if (!url || !el.isConnected) return;
      el.style.backgroundImage = `url("${String(typeof sizedArtUrl === 'function' ? sizedArtUrl(url, 120) : url).replace(/"/g, '%22')}")`;
      el.textContent = '';
    });
  }
  const _artCache = new Map();
  function artFor(kind, p) {
    if (typeof getArtAuto !== 'function') return Promise.resolve(null);
    const k = kind + '|' + (kind === 'artist' ? _pk(p) : kind === 'album' ? _ak(p) : _sk(p));
    if (_artCache.has(k)) return _artCache.get(k);
    const job = kind === 'artist' ? () => getArtAuto('artist', _pa(p))
      : kind === 'album' ? () => getArtAuto('album', p.album, _pa(p), p.album)
      : () => getArtAuto('song', p.title, p.artist, p.album);
    const pr = (typeof queueImg === 'function' ? new Promise(res => { let u = null; queueImg(() => job().then(x => { u = x; })).then(() => res(u)); }) : job())
      .catch(() => null);
    _artCache.set(k, pr);
    return pr;
  }

  function dirty() { return _pick && JSON.stringify(_pick.sel) !== JSON.stringify(_pick.start); }

  function renderPick() {
    if (!_pick || !_pickEl) return;
    renderSel();
    renderRes();
    const save = _pickEl.querySelector('.gl-save');
    save.textContent = (_pick.sel.length || !dirty()) ? tx('pk_save') : tx('pk_save_none');
    // Nothing to save until something changed (an empty pick saved by
    // accident would mark it "no genre")
    save.disabled = !_pick.ready || !dirty();
    const reset = _pickEl.querySelector('.gl-reset');
    reset.textContent = tx('pk_reset');
    reset.hidden = !_pick.had;
  }

  function renderSel() {
    const box = _pickEl.querySelector('#glSel');
    if (!_pick.ready) { box.innerHTML = ''; return; }
    const chips = _pick.sel.map((id, i) => {
      const e = G.byId.get(id), name = e ? e.name : nameOf(id), fam = e ? e.fam : 'world';
      return `<span class="gl-chip gl-chip-sel${i === 0 ? ' is-main' : ''}" style="--gf:${FAM_HUE[fam] || FAM_HUE.world}">` +
        `<button type="button" class="gl-chip-name" data-gl="main" data-id="${H(id)}" title="${H(i === 0 ? tx('pk_main') : tx('pk_make_main', { name }))}"${i === 0 ? ' aria-pressed="true"' : ''}>` +
        (i === 0 ? `<span class="gl-main-star" aria-hidden="true">★</span>` : `<span class="gl-dot" aria-hidden="true"></span>`) + `${H(name)}</button>` +
        `<button type="button" class="gl-chip-x" data-gl="rm" data-id="${H(id)}" aria-label="${H(tx('pk_remove', { name }))}">${ico('x')}</button></span>`;
    }).join('');
    const note = _pick.had ? tx('pk_yours_note') : (_pick.sel.length ? tx('pk_auto_note') : '');
    box.innerHTML = `<div class="gl-sel-row">${chips || `<span class="gl-sel-empty">${H(tx('pk_sel_empty'))}</span>`}</div>` +
      `<div class="gl-sel-meta"><span class="gl-sel-note">${H(dirty() ? '' : note)}</span>` +
      `<span class="gl-sel-count${_pick.sel.length >= MAX ? ' is-full' : ''}">${H(tx('pk_count', { n: _pick.sel.length, max: MAX }))}</span></div>`;
  }

  // One genre as a result row (with a query) or a tap-to-add chip (without)
  function resRow(e, i) {
    const on = _pick.sel.includes(e.id), full = !on && _pick.sel.length >= MAX;
    return `<button type="button" role="option" class="gl-opt${on ? ' is-on' : ''}${i === _pick.act ? ' is-act' : ''}" data-gl="tog" data-id="${H(e.id)}" data-i="${i}" aria-selected="${on}"${full ? ' aria-disabled="true"' : ''} style="--gf:${FAM_HUE[e.fam] || FAM_HUE.world}">` +
      `<span class="gl-dot" aria-hidden="true"></span><span class="gl-opt-name">${hl(e.name, _pick.q)}</span>` +
      `<span class="gl-opt-fam">${H(tx('fam_' + e.fam))}</span>` +
      `<span class="gl-opt-mark" aria-hidden="true">${on ? ico('check') : ico('plus')}</span></button>`;
  }
  function chipOpt(id) {
    const e = G.byId.get(id);
    if (!e) return '';
    const on = _pick.sel.includes(id), full = !on && _pick.sel.length >= MAX;
    return `<button type="button" class="gl-chip gl-chip-opt${on ? ' is-on' : ''}" data-gl="tog" data-id="${H(id)}" aria-pressed="${on}"${full ? ' aria-disabled="true"' : ''} style="--gf:${FAM_HUE[e.fam] || FAM_HUE.world}">` +
      `<span class="gl-chip-ic" aria-hidden="true">${on ? ico('check') : ico('plus')}</span>${H(e.name)}</button>`;
  }
  // The typed words in bold inside a name
  function hl(name, q) {
    const words = norm(q).split(' ').filter(Boolean);
    if (!words.length) return H(name);
    // Compare on a plain copy of the name (accents off), cut the real one
    const plain = String(name).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
    if (plain.length !== name.length) return H(name);
    const mark = new Array(name.length).fill(false);
    for (const w of words) {
      let from = 0, at;
      while ((at = plain.indexOf(w, from)) >= 0) {
        if (at === 0 || /[^a-z0-9]/.test(plain[at - 1])) { for (let k = at; k < at + w.length; k++) mark[k] = true; break; }
        from = at + 1;
      }
    }
    let out = '', on = false;
    for (let k = 0; k < name.length; k++) {
      if (mark[k] !== on) { out += mark[k] ? '<b>' : '</b>'; on = mark[k]; }
      out += H(name[k]);
    }
    return out + (on ? '</b>' : '');
  }

  let _resList = [];   // the result rows on screen, for ↑ ↓ Enter
  function renderRes() {
    const box = _pickEl.querySelector('#glRes');
    _resList = [];
    if (_pick.fail) { box.innerHTML = `<div class="gl-res-msg">${H(tx('pk_load_fail'))}</div>`; return; }
    if (!_pick.ready) { box.innerHTML = `<div class="gl-res-msg gl-res-loading"><span class="gl-spin" aria-hidden="true"></span>${H(tx('pk_loading'))}</div>`; return; }
    const full = _pick.sel.length >= MAX ? `<div class="gl-full" role="status">${H(tx('pk_full', { max: MAX }))}</div>` : '';
    const q = (_pick.q || '').trim();
    if (q) {
      const boost = new Set([..._pick.auto, ..._pick.artistTags]);
      const r = search(q, { boost, limit: 60 });
      _resList = r.list;
      let h = full;
      if (!r.fuzzy) h += `<div class="gl-opts">${r.list.map(resRow).join('')}</div>`;
      else {
        h += `<div class="gl-res-msg">${H(tx('pk_none_q', { q }))}</div>`;
        if (r.list.length) h += `<div class="gl-res-label">${H(tx('pk_maybe'))}</div><div class="gl-opts">${r.list.map(resRow).join('')}</div>`;
      }
      // Always offered when the exact name isn't in the list
      const exact = r.list.some(e => e.n === norm(q));
      if (!exact) {
        h += `<div class="gl-sugg"><span class="gl-sugg-ic" aria-hidden="true">🏷️</span><div class="gl-sugg-txt"><strong>${H(tx('pk_sugg_title'))}</strong>` +
          `<span>${H(tx('pk_sugg_text', { q }))}</span></div>` +
          `<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-gl="suggest">${H(tx('pk_sugg_btn'))}</button></div>`;
      }
      h += `<div class="gl-keys" aria-hidden="true">${H(tx('pk_hint_keys'))}</div>`;
      box.innerHTML = h;
      return;
    }
    if (_pick.fam) {
      const list = G.list.filter(e => e.fam === _pick.fam).sort((a, b) => (b.pop - a.pop) || a.n.localeCompare(b.n));
      _resList = list;
      box.innerHTML = full + `<div class="gl-fam-head"><button type="button" class="dc-btn dc-btn-plain dc-btn-sm" data-gl="fam" data-fam="">${ico('back')}${H(tx('pk_back'))}</button>` +
        `<span class="gl-fam-title" style="--gf:${FAM_HUE[_pick.fam]}"><span class="gl-dot"></span>${H(tx('fam_' + _pick.fam))}</span>` +
        `<span class="gl-fam-n">${H(tx('pk_fam_n', { n: num(list.length) }))}</span></div>` +
        `<div class="gl-opts">${list.map(resRow).join('')}</div>`;
      return;
    }
    // Nothing typed: what it has now, the artist's, the popular ones, then families
    let h = full;
    const now = _pick.auto.filter(id => G.byId.has(id));
    if (now.length) h += `<div class="gl-res-label">${H(tx('pk_suggested'))}</div><div class="gl-chips">${now.map(chipOpt).join('')}</div>`;
    const art = _pick.artistTags.filter(id => G.byId.has(id) && !now.includes(id));
    if (art.length) h += `<div class="gl-res-label">${H(tx('pk_artist_has'))}</div><div class="gl-chips">${art.slice(0, 8).map(chipOpt).join('')}</div>`;
    h += `<div class="gl-res-label">${H(tx('pk_popular'))}</div><div class="gl-chips">${G.popular.filter(id => !now.includes(id) && !art.includes(id)).slice(0, 36).map(chipOpt).join('')}</div>`;
    const fams = G.fams.filter(f => G.famCount[f]);
    h += `<div class="gl-res-label">${H(tx('pk_browse'))}</div><div class="gl-fams">` + fams.map(f =>
      `<button type="button" class="gl-fam" data-gl="fam" data-fam="${f}" style="--gf:${FAM_HUE[f] || FAM_HUE.world}"><span class="gl-dot" aria-hidden="true"></span>` +
      `<span class="gl-fam-name">${H(tx('fam_' + f))}</span><span class="gl-fam-count">${num(G.famCount[f])}</span></button>`).join('') + `</div>`;
    box.innerHTML = h;
  }

  function toggle(id) {
    const i = _pick.sel.indexOf(id);
    if (i >= 0) _pick.sel.splice(i, 1);
    else if (_pick.sel.length < MAX) _pick.sel.push(id);
    else return false;
    renderPick();
    return true;
  }

  function onPickClick(ev) {
    const b = ev.target.closest('[data-gl]');
    if (!b || !_pick) return;
    const act = b.dataset.gl, id = b.dataset.id;
    if (act === 'close') { closePick(); return; }
    if (act === 'tog') {
      if (b.getAttribute('aria-disabled') === 'true') { flashFull(); return; }
      const keep = _pickEl.querySelector('#glRes').scrollTop;
      toggle(id);
      _pickEl.querySelector('#glRes').scrollTop = keep;
      return;
    }
    if (act === 'rm') { toggle(id); return; }
    if (act === 'main') {
      const i = _pick.sel.indexOf(id);
      if (i > 0) { _pick.sel.splice(i, 1); _pick.sel.unshift(id); renderPick(); }
      return;
    }
    if (act === 'fam') { _pick.fam = b.dataset.fam || ''; _pick.act = -1; renderRes(); _pickEl.querySelector('#glRes').scrollTop = 0; return; }
    if (act === 'suggest') { suggest(_pick.q.trim()); return; }
    if (act === 'reset') {
      genreEditSet(_pick.kind, _pick.p, null);
      toast(tx('pk_reset_done'));
      closePick();
      return;
    }
    if (act === 'save') {
      if (!_pick.ready) return;
      const none = !_pick.sel.length;
      genreEditSet(_pick.kind, _pick.p, _pick.sel.slice());
      toast(tx(none ? 'pk_saved_none' : 'pk_saved'));
      closePick();
    }
  }
  function flashFull() {
    const f = _pickEl && _pickEl.querySelector('.gl-sel-count');
    if (!f) return;
    f.classList.remove('is-shake'); void f.offsetWidth; f.classList.add('is-shake');
  }

  function onPickKey(ev) {
    if (!_pick) return;
    const n = _resList.length;
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      if (!n) return;
      ev.preventDefault();
      _pick.act = ((_pick.act < 0 ? -1 : _pick.act) + (ev.key === 'ArrowDown' ? 1 : -1) + n) % n;
      _pickEl.querySelectorAll('.gl-opt').forEach(o => o.classList.toggle('is-act', +o.dataset.i === _pick.act));
      const a = _pickEl.querySelector('.gl-opt.is-act');
      if (a) a.scrollIntoView({ block: 'nearest' });
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      const e = _resList[_pick.act < 0 ? 0 : _pick.act];
      if (e) {
        if (!toggle(e.id)) flashFull();
        else if (_pick.q) { _pick.q = ''; ev.target.value = ''; _pick.act = 0; renderRes(); }
      }
    } else if (ev.key === 'Backspace' && !ev.target.value && _pick.sel.length) {
      _pick.sel.pop();
      renderPick();
    }
  }

  // Open a Board post asking for the genre, filled in
  function suggest(name) {
    if (!name) return;
    const pretty = name.replace(/\s+/g, ' ').trim();
    const item = _pick ? (_pick.label + (_pick.kind === 'artist' ? '' : ' — ' + (_pick.kind === 'album' ? _pa(_pick.p) : _pick.p.artist))) : '';
    const title = '🏷️ ' + tx('sugg_post_title', { name: pretty });
    const body = tx('sugg_post_body', { name: pretty, item });
    if (!window.dcBoard || typeof dcBoard.composeGenre !== 'function') return;
    if (dcBoard.composeGenre(title.slice(0, 120), body) !== false) closePick();
  }

  /* ── 5. The Genre Library page ─────────────────────────────────────── */
  const PKEY = 'dc_genrelib_prefs';
  const S = { tab: 'artists', q: '', filter: 'all', genre: '', sort: 'plays', shown: 60 };
  try { Object.assign(S, JSON.parse(localStorage.getItem(PKEY) || '{}'), { q: '', genre: '', shown: 60 }); } catch (e) {}
  const savePrefs = () => { try { localStorage.setItem(PKEY, JSON.stringify({ tab: S.tab, filter: S.filter, sort: S.sort, span: S.span })); } catch (e) {} };
  const PAGE = 60;
  let _pageOn = false, _admin = false, _artObs = null;
  // Artists asked of the genre lookup this visit, and those it has answered
  // (an answer can be "nothing found": then the row says No genre yet
  // instead of Looking up… for ever)
  const _lookedUp = new Set(), _lookDone = new Set();
  const waiting = (info, p) => info.src === 'wait' && !_lookDone.has(String(_pa(p)).toLowerCase());

  // Every item of the open tab with its genres; cached until genres or plays change
  let _rows = null, _rowsTag = '';
  let _gen = 0;   // bumped on every genre change / lookup landing
  function rowsOf(kind) {
    const tag = kind + '|' + _itemsTag + '|' + _gen;
    if (_rows && _rowsTag === tag) return _rows;
    const list = items()[kind];
    _rows = list.map(r => {
      const info = genreInfo(kind, r.p);
      return { r, info, names: (info.g || []).map(nameOf) };
    });
    _rowsTag = kind + '|' + _itemsTag + '|' + _gen;
    return _rows;
  }

  function renderPage() {
    const root = document.getElementById('genrelibView');
    if (!root || !_pageOn) return;
    const P = (typeof allPlays !== 'undefined' && allPlays) || [];
    if (!P.length) {
      root.innerHTML = head() + `<div class="gl-empty-page"><span class="gl-spin" aria-hidden="true"></span>${H(tx('nodata'))}</div>`;
      return;
    }
    // A genre's own page (step 2) instead of the library
    if (GP.id) {
      root.innerHTML = head() + (G.list.length ? genrePageHtml(GP.id) : `<div class="gl-empty-page"><span class="gl-spin" aria-hidden="true"></span>${H(tx('pk_loading'))}</div>`);
      gpPaint(root);
      return;
    }
    // Keep focus and caret in the search box while typing
    const qEl = document.getElementById('glLibQ');
    const hadFocus = qEl && document.activeElement === qEl, caret = qEl ? qEl.selectionStart : 0;
    const kind = kindOfTab(S.tab);
    const rows = rowsOf(kind);
    const all = items();

    // Numbers for the three tiles (this tab)
    // "Has a genre" means at least one tag from the list: an item tagged only
    // "female vocalists" still needs fixing, so it counts as missing
    const real = x => !G.list.length ? x.info.g.length > 0 : x.info.g.some(tg => entryOfTag(tg));
    let have = 0, yours = 0;
    for (const x of rows) { if (real(x)) have++; if (x.info.src === 'you') yours++; }
    const total = rows.length, pct = total ? Math.round(have * 100 / total) : 0;

    // Filters
    const qn = norm(S.q);
    let list = rows;
    if (S.filter === 'missing') list = list.filter(x => !real(x));
    else if (S.filter === 'yours') list = list.filter(x => x.info.src === 'you');
    if (S.genre) list = list.filter(x => x.info.g.some(tg => { const e = entryOfTag(tg); return (e ? e.id : String(tg).toLowerCase()) === S.genre; }));
    if (qn) list = list.filter(x => norm(x.r.name + ' ' + x.r.sub + ' ' + x.names.join(' ')).includes(qn));
    if (S.sort === 'az') list = list.slice().sort((a, b) => a.r.name.localeCompare(b.r.name));

    // Top genres among what's on this tab (before the genre filter), by plays
    const tally = new Map();
    // Each item's first tag that is a real genre (free sheet tags like
    // "female vocalists" are left out once the list is in)
    for (const x of rows) {
      let id = null;
      for (const tg of x.info.g) {
        const e = entryOfTag(tg);
        if (e) { id = e.id; break; }
        if (!G.list.length) { id = String(tg).toLowerCase(); break; }
      }
      if (id) tally.set(id, (tally.get(id) || 0) + x.r.n);
    }
    const top = [...tally].sort((a, b) => b[1] - a[1]).slice(0, 12);

    const tabs = ['artists', 'albums', 'songs'].map(tb => {
      const n = all[kindOfTab(tb)].length;
      return `<button type="button" role="tab" class="dc-tab${S.tab === tb ? ' active' : ''}" aria-selected="${S.tab === tb}" data-gll="tab" data-v="${tb}">${H(tx('tab_' + tb))}<span class="gl-tab-n">${num(n)}</span></button>`;
    }).join('');

    const signedIn = typeof dcIsSignedIn === 'function' && dcIsSignedIn();
    let h = head();
    // The fun parts first (GENRE-FUN-PLAN.md); they need the genre list
    if (G.list.length) h += funHtml();
    // Then the whole library: today's list, with its numbers in the heading
    // (the three tiles it used to open with became the Quick Fix ring)
    h += `<section class="gl-sec gl-lib" id="glLib" aria-labelledby="glLibH">
      <div class="gl-sec-head"><div><h3 class="gl-sec-title" id="glLibH">${H(tx('lib_title'))}</h3>
        <p class="gl-sec-sub">${H(tx('intro'))}</p></div></div>
      <div class="gl-lib-stats">
        <button type="button" class="gl-stat${S.filter === 'all' ? ' is-on' : ''}" data-gll="filter" data-v="all"><strong>${pct}%</strong><span>${H(tx('st_cover'))} · ${H(num(have))} ${H(tx('st_of', { n: num(total) }))}</span></button>
        <button type="button" class="gl-stat${S.filter === 'yours' ? ' is-on' : ''}" data-gll="filter" data-v="${S.filter === 'yours' ? 'all' : 'yours'}"><strong>${num(yours)}</strong><span>${H(tx('st_yours'))}</span></button>
        <button type="button" class="gl-stat${S.filter === 'missing' ? ' is-on' : ''}" data-gll="filter" data-v="${S.filter === 'missing' ? 'all' : 'missing'}"><strong>${num(total - have)}</strong><span>${H(tx('st_missing'))}</span></button>
      </div>
      ${signedIn ? '' : `<div class="gl-signin"><span>${ico('cloud')}${H(tx('signed_out'))}</span><button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-gll="signin">${H(tx('signin'))}</button></div>`}`;
    h += `<div class="dc-tabs gl-tabs" role="tablist" aria-label="${H(tx('title'))}">${tabs}</div>`;
    h += `<div class="gl-bar">
      <label class="gl-lib-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
        <input type="search" id="glLibQ" value="${H(S.q)}" placeholder="${H(tx('search_ph'))}" aria-label="${H(tx('search_ph'))}" autocomplete="off" spellcheck="false"></label>
      <div class="dc-seg gl-seg" role="group">${['all', 'missing', 'yours'].map(f =>
        `<button type="button" class="gl-seg-btn${S.filter === f ? ' is-on' : ''}" aria-pressed="${S.filter === f}" data-gll="filter" data-v="${f}">${H(tx('f_' + f))}</button>`).join('')}</div>
      <label class="gl-sort"><select class="dc-input" data-gll="sort" aria-label="${H(tx('sort_label'))}">
        <option value="plays"${S.sort === 'plays' ? ' selected' : ''}>${H(tx('sort_plays'))}</option>
        <option value="az"${S.sort === 'az' ? ' selected' : ''}>${H(tx('sort_az'))}</option></select></label>
    </div>`;
    if (top.length) {
      h += `<div class="gl-top"><span class="gl-top-l">${H(tx('top_genres'))}</span><div class="gl-top-chips">` + top.map(([id]) => {
        const e = G.byId.get(id), fam = e ? e.fam : 'world';
        return `<button type="button" class="gl-chip gl-chip-top${S.genre === id ? ' is-on' : ''}" aria-pressed="${S.genre === id}" data-gll="genre" data-v="${H(S.genre === id ? '' : id)}" style="--gf:${FAM_HUE[fam] || FAM_HUE.world}"><span class="gl-dot" aria-hidden="true"></span>${H(nameOf(id))}</button>`;
      }).join('') + (S.genre && !top.some(([id]) => id === S.genre)
        ? `<button type="button" class="gl-chip gl-chip-top is-on" aria-pressed="true" data-gll="genre" data-v=""><span class="gl-dot" aria-hidden="true"></span>${H(nameOf(S.genre))}</button>` : '') +
        (S.genre ? `<button type="button" class="gl-clear gl-open-g" data-gll="gp-go" data-id="${H(S.genre)}">${H(tx('gp_open', { name: nameOf(S.genre) }))}${ico('next')}</button>` : '') +
        (S.genre ? `<button type="button" class="gl-clear" data-gll="genre" data-v="">${ico('x')}${H(tx('clear_genre'))}</button>` : '') + `</div></div>`;
    }

    const shown = list.slice(0, S.shown);
    if (!shown.length) {
      h += `<div class="gl-none">${H(qn ? tx('empty_q', { q: S.q }) : tx('empty_f'))}</div>`;
    } else {
      h += `<ol class="gl-list">` + shown.map((x, i) => rowHtml(x, i)).join('') + `</ol>`;
      if (list.length > shown.length) h += `<div class="gl-more-wrap"><button type="button" class="dc-btn dc-btn-normal gl-more" data-gll="more">${H(tx('more', { n: num(Math.min(PAGE, list.length - shown.length)) }))}</button></div>`;
    }
    h += `<p class="gl-order-note">${ico('stack')}${H(tx('order_note'))}</p></section>`;
    if (_admin) h += adminHtml();
    root.innerHTML = h;
    _shownRows = shown;
    if (hadFocus) { const n = document.getElementById('glLibQ'); if (n) { n.focus(); try { n.setSelectionRange(caret, caret); } catch (e) {} } }
    watchArt(root);
    lookUpShown(shown);
    funPaint(root);
  }

  /* The fun sections, top to bottom (GENRE-FUN-PLAN.md). Each step adds its
     own part here; funPaint() runs after the page is drawn (pictures, the
     map, the chart). */
  function funHtml() {
    checkBadges();
    let h = '';
    h += soundHtml();
    h += qfHtml();
    h += tidyHtml();
    h += shelfHtml();
    return h;
  }
  function funPaint(root) {
    qfPaint(root);
  }
  let _shownRows = [];

  function head() {
    return `<div class="section-header gl-page-head"><h2 class="section-header-h2">` +
      `${typeof dcGlowIco === 'function' ? dcGlowIco('genres') : ''}<span>${H(tx('title'))}</span></h2><div class="section-rule"></div></div>`;
  }

  // A genre chip for a row or the side panel. A tag that isn't in the list
  // (a free-typed sheet tag like "female vocalists", a Last.fm tag like
  // "2015") is drawn dashed, without a family dot, so it reads as one to fix.
  // asBtn: a genre that is in the list becomes a button to its page (side panel)
  function tagChip(tg, j, cls, asBtn) {
    const e = entryOfTag(tg), free = !e && G.list.length > 0, fam = e ? e.fam : 'world';
    const btn = asBtn && e, tag = btn ? 'button' : 'span';
    return `<${tag}${btn ? ' type="button"' : ''} class="gl-chip ${cls}${j === 0 ? ' is-main' : ''}${free ? ' is-free' : ''}" style="--gf:${FAM_HUE[fam] || FAM_HUE.world}"` +
      (free ? ` title="${H(tx('free_tip'))}"` : '') + (btn ? ` data-gid="${H(e.id)}" title="${H(tx('gp_open', { name: e.name }))}"` : '') + `>` +
      `<span class="gl-dot" aria-hidden="true"></span>${H(e ? e.name : nameOf(tg))}</${tag}>`;
  }

  function rowHtml(x, i) {
    const r = x.r, info = x.info, kind = r.kind;
    const src = info.src, g = info.g || [];
    const chips = g.slice(0, 5).map((tg, j) => tagChip(tg, j, 'gl-chip-row')).join('');
    const badge = g.length
      ? `<span class="gl-src gl-src-${src}" title="${H(tx('src_' + src + '_tip'))}">${H(tx('src_' + src))}${info.from ? `<span class="gl-src-via"> · ${H(tx('via_' + info.from))}</span>` : ''}</span>` : '';
    const empty = !g.length ? `<span class="gl-row-none">${waiting(info, r.p) ? `<span class="gl-spin gl-spin-sm" aria-hidden="true"></span>${H(tx('looking'))}` : H(tx('none_yet'))}</span>` : '';
    return `<li class="gl-row${src === 'you' ? ' is-yours' : ''}${!g.length ? ' is-empty' : ''}" data-i="${i}">` +
      `<button type="button" class="gl-row-btn" data-gll="open" data-i="${i}" aria-label="${H((g.length ? tx('edit') : tx('add')) + ': ' + r.name)}">` +
      `<span class="gl-art${kind === 'artist' ? ' is-round' : ''}" data-art="${i}" aria-hidden="true">${H(typeof initials === 'function' ? initials(r.name) : '')}</span>` +
      `<span class="gl-row-main"><span class="gl-row-name">${H(r.name)}</span>` +
      `<span class="gl-row-sub">${r.sub ? H(r.sub) + ' · ' : ''}${H(plays(r.n))}</span></span>` +
      `<span class="gl-row-genres">${chips}${empty}${badge}</span>` +
      `<span class="gl-row-edit${g.length ? '' : ' is-add'}" aria-hidden="true">${ico(g.length ? 'edit' : 'plus')}<span>${H(g.length ? tx('dp_edit') : tx('dp_add'))}</span></span>` +
      `</button></li>`;
  }

  // Pictures load as rows scroll into view, one lookup at a time (queueImg)
  function watchArt(root) {
    if (_artObs) _artObs.disconnect();
    const paint = (el, url) => {
      if (!url || !el.isConnected) return;
      el.style.backgroundImage = `url("${String(typeof sizedArtUrl === 'function' ? sizedArtUrl(url, 96) : url).replace(/"/g, '%22')}")`;
      el.classList.add('has-img');
      el.textContent = '';
    };
    const go = el => { const x = _shownRows[+el.dataset.art]; if (x) artFor(x.r.kind, x.r.p).then(u => paint(el, u)); };
    const els = root.querySelectorAll('.gl-art[data-art]');
    if (!('IntersectionObserver' in window)) { els.forEach(go); return; }
    _artObs = new IntersectionObserver(ents => {
      for (const en of ents) if (en.isIntersecting) { _artObs.unobserve(en.target); go(en.target); }
    }, { rootMargin: '300px 0px' });
    els.forEach(el => _artObs.observe(el));
  }

  // Rows still waiting on a lookup ask the shared genre lookup (app.js)
  let _lookTimer = null;
  function lookUpShown(shown) {
    if (typeof genreLookupArtists !== 'function') return;
    const want = [];
    for (const x of shown) {
      if (x.info.src !== 'wait') continue;
      const a = _pa(x.r.p);
      if (a && !_lookedUp.has(a.toLowerCase())) { _lookedUp.add(a.toLowerCase()); want.push(a); }
    }
    if (!want.length) return;
    genreLookupArtists(want).then(() => {
      for (const a of want) _lookDone.add(a.toLowerCase());
      clearTimeout(_lookTimer);
      _lookTimer = setTimeout(() => { _gen++; renderPage(); }, 200);
    });
    // MusicBrainz answers in the background, a second at a time: look again
    // a little later so its genres show without a reload
    setTimeout(() => { if (_pageOn) { _gen++; renderPage(); } }, 15000);
  }

  function onPageClick(ev) {
    const b = ev.target.closest('[data-gll]');
    if (!b) return;
    const a = b.dataset.gll, v = b.dataset.v;
    if (qfClick(a, b) || gpClick(a, b) || sndClick(a, b) || tidyClick(a)) return;
    if (a === 'sh-all') { SH.all = !SH.all; renderPage(); if (!SH.all) scrollToSec('glShelf'); return; }
    if (a === 'tab') { S.tab = v; S.shown = PAGE; S.genre = ''; savePrefs(); renderPage(); return; }
    if (a === 'filter') { S.filter = v; S.shown = PAGE; savePrefs(); renderPage(); return; }
    if (a === 'genre') { S.genre = v || ''; S.shown = PAGE; renderPage(); return; }
    if (a === 'more') { S.shown += PAGE; renderPage(); return; }
    if (a === 'signin') { if (typeof dcSignIn === 'function') dcSignIn(); return; }
    if (a === 'open') { const x = _shownRows[+b.dataset.i]; if (x) open(x.r.kind, x.r.p); return; }
    if (a === 'ad-add') { adminOpen(''); return; }
    if (a === 'ad-rm') { adminRemove(b.dataset.doc, b.dataset.name); return; }
  }
  let _qTimer = null;
  function onPageInput(ev) {
    if (ev.target.id === 'glLibQ') {
      S.q = ev.target.value;
      S.shown = PAGE;
      clearTimeout(_qTimer);
      _qTimer = setTimeout(renderPage, 120);
    }
  }
  function onPageChange(ev) {
    if (ev.target.dataset && ev.target.dataset.gll === 'sort') { S.sort = ev.target.value; savePrefs(); renderPage(); }
  }

  // Called by app.js's nav handler when the page opens / closes
  function show() {
    const root = document.getElementById('genrelibView');
    if (!root) return;
    _pageOn = true;
    if (!root._glWired) {
      root.addEventListener('click', onPageClick);
      root.addEventListener('input', onPageInput);
      root.addEventListener('change', onPageChange);
      root.addEventListener('keydown', sndKey);
      root._glWired = true;
    }
    renderPage();
    // The list makes the genre names (and the moderators' extras) known
    loadList().then(() => { _gen++; renderPage(); askTopArtists(); }).catch(() => {});
    if (window.dcBoard && typeof dcBoard.checkAdmin === 'function' && typeof dcIsSignedIn === 'function' && dcIsSignedIn()) {
      dcBoard.checkAdmin().then(ok => { if (ok !== _admin) { _admin = ok; renderPage(); } }).catch(() => {});
    }
  }
  function hide() { _pageOn = false; GP.id = ''; if (_artObs) { _artObs.disconnect(); _artObs = null; } }

  /* ── 6. Genres in the side panel ───────────────────────────────────────
     Under the name in the song / album / artist panel: the genres it has
     (with where they come from) and an Edit button. panel.js wraps the
     three open functions; this wraps them once more and adds the strip
     after they have run. */
  let _dp = null;   // { kind, p, overlay }
  function dpStrip(kind, p, overlay) {
    const titles = overlay && overlay.querySelector('.dp-titles');
    if (!titles) return;
    let el = titles.querySelector('.gl-dp');
    if (!el) { el = document.createElement('div'); el.className = 'gl-dp'; titles.appendChild(el); }
    _dp = { kind, p, overlay };
    const paint = () => {
      const info = genreInfo(kind, p);
      const g = info.g || [];
      el.innerHTML = `<span class="gl-dp-l">${H(tx('dp_genres'))}</span>` +
        (g.length ? g.slice(0, 4).map((tg, j) => tagChip(tg, j, 'gl-chip-dp', true)).join('') : `<span class="gl-dp-none">${H(tx(waiting(info, p) ? 'looking' : 'none_yet'))}</span>`) +
        `<button type="button" class="gl-dp-edit" title="${H(tx(g.length ? 'edit' : 'add'))}">${ico(g.length ? 'edit' : 'plus')}<span>${H(tx(g.length ? 'dp_edit' : 'dp_add'))}</span></button>`;
      el.querySelector('.gl-dp-edit').onclick = ev => { ev.stopPropagation(); open(kind, p); };
      // A genre chip opens that genre's page in the library (step 2)
      el.querySelectorAll('[data-gid]').forEach(b => { b.onclick = ev => { ev.stopPropagation(); openGenre(b.dataset.gid); }; });
    };
    paint();
    el._glPaint = paint;
    // Names only show once the list is in; an artist not looked up yet is asked now
    loadList().then(paint).catch(() => {});
    if (genreInfo(kind, p).src === 'wait' && typeof genreLookupArtists === 'function') {
      genreLookupArtists([_pa(p)]).then(() => { _lookDone.add(String(_pa(p)).toLowerCase()); paint(); });
    }
  }
  function wrapPanel(fnName, kind, toP) {
    const orig = window[fnName];
    if (typeof orig !== 'function' || orig._glWrapped) return;
    const w = function (arg) {
      const r = orig.apply(this, arguments);
      try {
        const p = toP(arg);
        const ov = document.getElementById(kind === 'artist' ? 'artistModal' : kind === 'album' ? 'albumModal' : 'songModal');
        if (p && ov) dpStrip(kind, p, ov);
      } catch (e) { /* never break the panel over its genre strip */ }
      return r;
    };
    w._glWrapped = true;
    // keep panel.js's own marker, so it never wraps twice
    if (orig._dpWrapped) w._dpWrapped = true;
    window[fnName] = w;
  }
  function songPlay(key) {
    const P = (typeof allPlays !== 'undefined' && allPlays) || [];
    for (const p of P) if (songKey(p) === key) return p;
    const parts = String(key).split('|||');
    return { title: parts[0], artist: parts[1] || '', album: '' };
  }
  function initPanel() {
    wrapPanel('openArtistModal', 'artist', name => ({ title: '', artist: name, artists: [name], album: '' }));
    wrapPanel('openAlbumModal', 'album', key => { const a = String(key).split('|||'); return { title: '', artist: a[1] || '', artists: [a[1] || ''], album: a[0] }; });
    wrapPanel('openSongModal', 'song', key => songPlay(key));
  }

  /* ── 7. Moderators ─────────────────────────────────────────────────────
     From a 🏷️ suggestion post on the Board (board.js shows the button), or
     from "Add a genre" at the foot of the library page: a small window with
     the name, its family and other spellings. Saved to genreExtras. */
  let _adPost = null;
  function adminHtml() {
    const rows = _extras.slice().sort((a, b) => String(a.name).localeCompare(b.name)).map(x =>
      `<li class="gl-ad-row" style="--gf:${FAM_HUE[x.fam] || FAM_HUE.world}"><span class="gl-dot" aria-hidden="true"></span><span class="gl-ad-name">${H(x.name)}</span>` +
      `<span class="gl-opt-fam">${H(tx('fam_' + (x.fam || 'world')))}</span>${x.aliases ? `<span class="gl-ad-al">${H(x.aliases)}</span>` : ''}` +
      `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm dc-btn-danger" data-gll="ad-rm" data-doc="${H(x.doc || '')}" data-name="${H(x.name)}">${ico('trash')}${H(tx('ad_remove'))}</button></li>`).join('');
    return `<section class="gl-admin"><div class="gl-admin-head"><div><h3>${ico('shield')}${H(tx('ad_title'))}</h3><p>${H(tx('ad_intro'))}</p></div>` +
      `<button type="button" class="dc-btn dc-btn-main dc-btn-sm" data-gll="ad-add">${ico('plus')}${H(tx('ad_add'))}</button></div>` +
      (rows ? `<ul class="gl-ad-list">${rows}</ul>` : `<p class="gl-ad-none">${H(tx('ad_none'))}</p>`) + `</section>`;
  }
  let _adEl = null;
  function adminOpen(name, postId) {
    _adPost = postId || null;
    loadList().then(() => {
      if (!_adEl) {
        _adEl = document.createElement('div');
        _adEl.className = 'modal-overlay gl-ad-overlay';
        _adEl.id = 'glAdModal';
        _adEl.setAttribute('role', 'dialog');
        _adEl.setAttribute('aria-modal', 'true');
        _adEl.setAttribute('aria-labelledby', 'glAdTitle');
        document.body.appendChild(_adEl);
        _adEl.addEventListener('mousedown', e => { if (e.target === _adEl) adminClose(); });
        _adEl.addEventListener('input', adminCheck);
        _adEl.addEventListener('click', e => {
          const b = e.target.closest('[data-glad]');
          if (!b) return;
          if (b.dataset.glad === 'close') adminClose();
          if (b.dataset.glad === 'save') adminSave();
        });
      }
      _adEl.innerHTML = `<div class="dc-modal dc-frame gl-ad-box">
        <div class="dc-frame-head"><span class="dc-frame-icon" data-ico="tag"></span>
          <div class="dc-frame-titles"><h3 class="dc-frame-title" id="glAdTitle">${H(tx('ad_add'))}</h3><p class="dc-frame-sub">${H(tx('ad_intro'))}</p></div>
          <button type="button" class="dc-btn dc-btn-plain dc-btn-icon dc-modal-close" data-glad="close" aria-label="${H(typeof t === 'function' ? t('set_close') : 'Close')}">✕</button></div>
        <div class="dc-frame-body gl-ad-body">
          <label class="dc-field gl-field"><span>${H(tx('ad_name'))}</span><input type="text" class="dc-input" id="glAdName" maxlength="60" value="${H(name || '')}" autocomplete="off"></label>
          <div class="gl-ad-check" id="glAdCheck" role="status"></div>
          <label class="dc-field gl-field"><span>${H(tx('ad_fam'))}</span><select class="dc-input" id="glAdFam">${G.fams.map(f => `<option value="${f}"${f === 'world' ? ' selected' : ''}>${H(tx('fam_' + f))}</option>`).join('')}</select></label>
          <label class="dc-field gl-field"><span>${H(tx('ad_alias'))}</span><input type="text" class="dc-input" id="glAdAl" maxlength="300" placeholder="${H(tx('ad_alias_ph'))}" autocomplete="off"></label>
        </div>
        <div class="dc-frame-foot"><div class="dc-frame-foot-start"></div>
          <button type="button" class="dc-btn dc-btn-plain" data-glad="close">${H(tx('pk_cancel'))}</button>
          <button type="button" class="dc-btn dc-btn-main" data-glad="save" id="glAdSave">${H(tx('ad_save'))}</button></div></div>`;
      if (typeof dcFillIcons === 'function') dcFillIcons(_adEl);
      _adEl.classList.add('open');
      adminCheck();
      setTimeout(() => { const n = document.getElementById('glAdName'); if (n) { n.focus(); n.select(); } }, 60);
    });
  }
  function adminClose() { if (_adEl) _adEl.classList.remove('open'); _adPost = null; }
  // Live check under the name: the id it saves as, or the genre it duplicates
  function adminCheck() {
    const n = document.getElementById('glAdName'), out = document.getElementById('glAdCheck'), save = document.getElementById('glAdSave');
    if (!n || !out) return true;
    const name = n.value.replace(/\s+/g, ' ').trim(), id = name.toLowerCase();
    let msg = '', ok = true;
    if (name.length < 2) { msg = tx('ad_short'); ok = false; }
    else {
      const dupe = G.byId.get(id) || G.byC.get(compact(id));
      if (dupe) { msg = tx('ad_dupe', { name: dupe.name }); ok = false; }
      else msg = tx('ad_saved_as', { id });
    }
    out.textContent = msg;
    out.classList.toggle('is-bad', !ok);
    if (save) save.disabled = !ok;
    return ok;
  }
  function adminSave() {
    if (!adminCheck() || typeof dcSaveGenreExtra !== 'function') return;
    const name = document.getElementById('glAdName').value.replace(/\s+/g, ' ').trim();
    const id = name.toLowerCase();
    const fam = document.getElementById('glAdFam').value;
    const aliases = document.getElementById('glAdAl').value.replace(/[,;]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    const doc = id.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 80) || ('g' + Date.now());
    const btn = document.getElementById('glAdSave');
    if (btn) btn.disabled = true;
    const post = _adPost;
    dcSaveGenreExtra(doc, { id, name, fam, aliases }).then(() => {
      toast(tx('ad_added', { name }));
      if (post && window.dcBoard && typeof dcBoard.markDone === 'function') dcBoard.markDone(post);
      adminClose();
      return refreshExtras(true);
    }).catch(() => {
      toast(tx('ad_fail'));
      if (btn) btn.disabled = false;
    });
  }
  function adminRemove(doc, name) {
    if (!doc || typeof dcDeleteGenreExtra !== 'function') return;
    const go = () => dcDeleteGenreExtra(doc).then(() => { toast(tx('ad_removed', { name })); return refreshExtras(true); }).catch(() => toast(tx('ad_fail')));
    if (typeof window.dcConfirmBox === 'function') window.dcConfirmBox(tx('ad_remove_title', { name }), tx('ad_remove_text'), tx('ad_remove'), go);
  }
  // board.js: the 🏷️ post's button. The name is what follows the ": "
  function addFromPost(postId) {
    const title = window.dcBoard && typeof dcBoard.postTitle === 'function' ? dcBoard.postTitle(postId) : '';
    const name = title.replace(/^🏷️?\s*/, '').replace(/^[^:：]*[:：]\s*/, '').trim();
    adminOpen(name, postId);
  }

  /* ── 8. Genre stats (GENRE-FUN-PLAN.md step 1) ─────────────────────────
     One cached pass that every fun part of the page reads. Counts use each
     song's MAIN genre (the first of its genres that is in the list), so the
     families add up to 100% and no play counts twice. Read through
     genreInfo('song', p), which walks your picks → sheet → MusicBrainz →
     Gemini / Last.fm, so it works the same for every data source.
       S2.byId   genre id → { id, fam, n, n30, n365, nPrev, first, songs: [song
                 items], artists: Map pk → { name, n, p }, albums: Map ak → … }
       S2.fam    family → { n, n30, n365 }
       S2.rank   genre ids, most played first
       S2.tagged / S2.total   plays with a real genre / all plays
       S2.months [{ ym, fam: { fam → plays } }] for the last 12 months
     Rebuilt when the plays, the genres (_gen) or the list change. */
  let _st = null, _stTag = '';
  const DAY = 864e5;
  // An item's first tag that is in the genre list, as an id (null = none)
  function mainOf(info) {
    for (const tg of (info && info.g) || []) { const e = entryOfTag(tg); if (e) return e.id; }
    return null;
  }
  const realInfo = info => !!mainOf(info);
  const ymOf = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  function stats() {
    const P = (typeof allPlays !== 'undefined' && allPlays) || [];
    const all = items();
    const tag = _itemsTag + '|' + _gen + '|' + G.list.length;
    if (_st && _stTag === tag) return _st;
    const byId = new Map(), fam = {}, songMain = new Map();
    const blank = (id) => {
      const e = G.byId.get(id);
      const g = { id, fam: e ? e.fam : 'world', n: 0, n30: 0, n365: 0, nRecent: 0, nPrev: 0, first: 0, m: new Array(12).fill(0), songs: [], artists: new Map(), albums: new Map() };
      byId.set(id, g);
      return g;
    };
    // Songs first: their main genre, and who / what they belong to
    // sec: genres that are only a song's 2nd–5th genre, with their plays, so
    // a genre page can say "on 12 songs as a second genre" instead of "new"
    const sec = new Map();
    for (const r of all.song) {
      const info = G.list.length ? genreInfo('song', r.p) : null;
      const id = info ? mainOf(info) : null;
      songMain.set(r.key, id);
      if (!id) continue;
      for (const tg of info.g) {
        const e = entryOfTag(tg);
        if (e && e.id !== id) { const x = sec.get(e.id) || { n: 0, songs: 0 }; x.n += r.n; x.songs++; sec.set(e.id, x); }
      }
      const g = byId.get(id) || blank(id);
      g.songs.push(r);
      const pk = _pk(r.p);
      const a = g.artists.get(pk);
      if (a) a.n += r.n; else g.artists.set(pk, { name: _pa(r.p), n: r.n, p: r.p });
      if (r.p.album && r.p.album !== '—') {
        const ak = _ak(r.p), al = g.albums.get(ak);
        if (al) al.n += r.n; else g.albums.set(ak, { name: r.p.album, artist: _pa(r.p), n: r.n, p: r.p });
      }
    }
    // Then every play once: totals, recent counts, first play, months
    const now = Date.now(), t30 = now - 30 * DAY, t365 = now - 365 * DAY, t90 = now - 90 * DAY, t180 = now - 180 * DAY;
    const nowD = typeof tzNow === 'function' ? tzNow() : new Date();
    const yms = [];
    for (let i = 11; i >= 0; i--) yms.push(ymOf(new Date(nowD.getFullYear(), nowD.getMonth() - i, 1)));
    const ymSet = new Set(yms), months = new Map(yms.map(ym => [ym, {}])), ymIdx = new Map(yms.map((ym, i) => [ym, i]));
    let tagged = 0;
    for (const p of P) {
      const id = songMain.get(_sk(p));
      if (!id) continue;
      tagged++;
      const g = byId.get(id), t = +p.date, f = g.fam;
      g.n++;
      const fa = fam[f] || (fam[f] = { n: 0, n30: 0, n365: 0 });
      fa.n++;
      if (t >= t365) {
        g.n365++; fa.n365++;
        if (t >= t30) { g.n30++; fa.n30++; }
        if (t >= t90) g.nRecent++; else if (t >= t180) g.nPrev++;
        const ym = ymOf(typeof tzDateOf === 'function' ? tzDateOf(p) : p.date);
        if (ymSet.has(ym)) { const m = months.get(ym); m[f] = (m[f] || 0) + 1; g.m[ymIdx.get(ym)]++; }
      }
      if (!g.first || t < g.first) g.first = t;
    }
    for (const g of byId.values()) g.songs.sort((a, b) => b.n - a.n);
    const rank = [...byId.values()].filter(g => g.n > 0).sort((a, b) => b.n - a.n).map(g => g.id);
    _st = { byId, fam, rank, sec, tagged, total: P.length, yms, months: yms.map(ym => ({ ym, fam: months.get(ym) })) };
    _stTag = tag;
    return _st;
  }
  // Share of plays with a real genre, 0–100 (whole numbers, never 100 until it is)
  function coverage() {
    const s = stats();
    if (!s.total) return 0;
    const v = s.tagged * 100 / s.total;
    return v >= 100 ? 100 : Math.min(99, Math.floor(v));
  }
  // Genres ranked by plays in a span: 'all' | '365' | '30'
  function spanN(g, span) { return span === '30' ? g.n30 : span === '365' ? g.n365 : g.n; }

  // Last.fm libraries: ask the shared lookup for the top artists once a visit,
  // so the counts aren't built on half-known genres. Answers redraw the page.
  let _topAsked = false;
  function askTopArtists() {
    if (_topAsked || typeof genreLookupArtists !== 'function') return;
    _topAsked = true;
    const want = [];
    for (const r of items().artist.slice(0, 150)) {
      if (genreInfo('artist', r.p).src === 'wait') { want.push(r.name); _lookedUp.add(r.name.toLowerCase()); }
    }
    if (!want.length) return;
    genreLookupArtists(want).then(() => {
      for (const a of want) _lookDone.add(a.toLowerCase());
      if (_pageOn) { _gen++; renderPage(); }
    });
    setTimeout(() => { if (_pageOn) { _gen++; renderPage(); } }, 20000);
  }

  /* ── 9. Quick Fix (step 1) ─────────────────────────────────────────────
     One card at a time: the most played artists with no genre from the list
     (fixing an artist fixes its albums and songs, which borrow from it), then
     any album or song that still has none. Artists not looked up yet are left
     out until the lookup answers, and anything you saved as "no genre" stays
     out. The "review" deck (Tidy up, step 5) shows top artists whose genres
     were only guessed online, with the guess ticked. */
  const QF = { mode: 'fix', sel: null, key: '', streak: 0, skipped: new Set() };
  const qfKey = x => x.kind + ':' + x.key;
  function deck() {
    const all = items(), out = [];
    if (!G.list.length) return out;
    if (QF.mode === 'review') {
      for (const r of all.artist.slice(0, 100)) {
        const info = genreInfo('artist', r.p);
        if (info.src === 'web' && realInfo(info) && !QF.skipped.has(qfKey(r))) out.push({ r, info });
      }
      return out;
    }
    const artistOk = new Map();
    for (const r of all.artist.slice(0, 3000)) {
      const info = genreInfo('artist', r.p);
      const ok = realInfo(info) || info.src === 'wait' || (info.src === 'you' && !info.g.length);
      artistOk.set(r.key, ok);
      if (!ok && !QF.skipped.has(qfKey(r))) out.push({ r, info });
    }
    // Albums / songs whose artist is fine but they still have no real genre
    // (a sheet row tagged only "female vocalists", say)
    for (const kind of ['album', 'song']) {
      for (const r of all[kind].slice(0, 3000)) {
        if (artistOk.get(_pk(r.p)) === false) continue;
        const info = genreInfo(kind, r.p);
        if (realInfo(info) || info.src === 'wait' || (info.src === 'you' && !info.g.length)) continue;
        if (!QF.skipped.has(qfKey(r))) out.push({ r, info });
      }
    }
    return out;
  }
  // Artists credited together → the genres of the others (for guesses)
  let _collab = null, _collabTag = '';
  function collabGenres(pk) {
    const tag = _itemsTag + '|' + _gen;
    if (!_collab || _collabTag !== tag) {
      _collab = new Map();
      const mainOfArtist = new Map();
      const am = name => {
        const k = name.toLowerCase();
        if (!mainOfArtist.has(k)) mainOfArtist.set(k, mainOf(genreInfo('artist', { title: '', artist: name, artists: [name], album: '' })));
        return mainOfArtist.get(k);
      };
      for (const r of items().song) {
        const as = Array.isArray(r.p.artists) ? r.p.artists : [];
        if (as.length < 2) continue;
        for (const a of as) for (const b of as) {
          if (a === b) continue;
          const id = am(b);
          if (!id) continue;
          const k = a.toLowerCase();
          const m = _collab.get(k) || new Map();
          m.set(id, (m.get(id) || 0) + r.n);
          _collab.set(k, m);
        }
      }
      _collabTag = tag;
    }
    const m = _collab.get(pk);
    return m ? [...m].sort((a, b) => b[1] - a[1]).map(x => x[0]) : [];
  }
  // Up to six guesses for a card, best first, and why they're offered
  function guesses(x) {
    const r = x.r, kind = r.kind, out = [], seen = new Set();
    let why = '';
    const add = (id, w) => { if (id && !seen.has(id) && G.byId.has(id) && out.length < 6) { seen.add(id); out.push(id); if (!why) why = w; } };
    if (QF.mode === 'review') for (const tg of x.info.g) { const e = entryOfTag(tg); if (e) add(e.id, 'review'); }
    // Its own tags, matched to the list even when spelled differently
    for (const tg of x.info.g || []) {
      let e = entryOfTag(tg);
      if (!e) { const sr = search(String(tg), { limit: 1 }); if (!sr.fuzzy) e = sr.list[0]; }
      if (e) add(e.id, 'tags');
    }
    if (kind === 'artist') for (const id of collabGenres(r.key).slice(0, 4)) add(id, 'collab');
    else {
      const ai = genreInfo('artist', r.p);
      for (const tg of ai.g || []) { const e = entryOfTag(tg); if (e) add(e.id, 'artist'); }
    }
    for (const id of stats().rank.slice(0, 8)) add(id, 'top');
    return { ids: out, why: why || 'top' };
  }

  // Badges: the highest coverage step reached, remembered on this device
  const BKEY = 'dc_genrelib_badges', BADGES = [50, 75, 90, 100];
  let _badgeBest = 0;
  try { _badgeBest = +localStorage.getItem(BKEY) || 0; } catch (e) {}
  let _badgeNew = 0;
  function checkBadges() {
    const pct = coverage();
    const got = BADGES.filter(b => pct >= b).pop() || 0;
    if (got > _badgeBest) {
      // The first visit just records where the library already is
      const first = !_badgeSeen;
      _badgeBest = got;
      try { localStorage.setItem(BKEY, String(got)); } catch (e) {}
      if (!first) { _badgeNew = got; toast(tx('qf_badge_new', { n: got })); }
    }
    _badgeSeen = true;
  }
  let _badgeSeen = false;
  try { _badgeSeen = localStorage.getItem(BKEY) != null; } catch (e) {}

  function ringSvg(pct, size) {
    const r = 50, c = 2 * Math.PI * r;
    return `<svg class="gl-ring-svg" viewBox="0 0 120 120" width="${size}" height="${size}" aria-hidden="true">` +
      `<circle cx="60" cy="60" r="${r}" class="gl-ring-bg"/>` +
      `<circle cx="60" cy="60" r="${r}" class="gl-ring-fg" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(2)}"/></svg>`;
  }

  function qfHtml() {
    if (!G.list.length) return '';
    const list = deck();
    const pct = coverage();
    // Keep the card you're on when the deck is rebuilt; else the first
    let cur = list.find(x => qfKey(x.r) === QF.key) || list[0] || null;
    if (cur && qfKey(cur.r) !== QF.key) { QF.key = qfKey(cur.r); QF.sel = null; }
    let card;
    if (!cur) {
      QF.key = '';
      const waitingTop = items().artist.slice(0, 150).some(r => genreInfo('artist', r.p).src === 'wait');
      card = `<div class="gl-qf-card is-done"><span class="gl-qf-done-ic" aria-hidden="true">${QF.mode === 'review' ? '✅' : '🎉'}</span>` +
        `<strong class="gl-qf-done-t">${H(tx(QF.mode === 'review' ? 'qf_rev_done_t' : 'qf_done_t'))}</strong>` +
        `<p>${H(tx(waitingTop && QF.mode !== 'review' ? 'qf_wait' : QF.mode === 'review' ? 'qf_rev_done' : 'qf_done'))}</p>` +
        (QF.mode === 'review' ? `<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-gll="qf-mode" data-v="fix">${H(tx('qf_back_fix'))}</button>` : '') +
        (QF.skipped.size ? `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm" data-gll="qf-unskip">${H(tx('qf_unskip', { n: num(QF.skipped.size) }))}</button>` : '') + `</div>`;
    } else {
      const r = cur.r, gs = guesses(cur);
      if (!QF.sel) QF.sel = (gs.why === 'top') ? [] : gs.ids.slice(0, 1);
      QF.sel = QF.sel.filter(id => G.byId.has(id));
      const i = list.indexOf(cur);
      const kindW = tx('pk_kind_' + r.kind);
      const sub = (r.kind === 'artist' ? kindW : kindW + ' · ' + r.sub) + ' · ' + plays(r.n);
      card = `<div class="gl-qf-card" data-qf="${H(QF.key)}">` +
        `<span class="gl-qf-eyebrow">${H(tx('qf_card', { i: num(i + 1), n: num(list.length) }))}</span>` +
        `<span class="gl-qf-art${r.kind === 'artist' ? ' is-round' : ''}" id="glQfArt" aria-hidden="true">${H(typeof initials === 'function' ? initials(r.name) : '')}</span>` +
        `<div class="gl-qf-names"><strong class="gl-qf-name">${H(r.name)}</strong><span class="gl-qf-sub">${H(sub)}</span></div>` +
        `<p class="gl-qf-why">${H(tx('qf_why_' + gs.why))}</p>` +
        `<div class="gl-qf-opts" role="group" aria-label="${H(tx('qf_pick_hint'))}">` + gs.ids.map((id, j) => {
          const e = G.byId.get(id), on = QF.sel.includes(id);
          return `<button type="button" class="gl-chip gl-qf-opt${on ? ' is-on' : ''}" aria-pressed="${on}" data-gll="qf-opt" data-id="${H(id)}" style="--gf:${FAM_HUE[e.fam] || FAM_HUE.world}">` +
            `<kbd class="gl-qf-k" aria-hidden="true">${j + 1}</kbd>${H(e.name)}</button>`;
        }).join('') +
        QF.sel.filter(id => !gs.ids.includes(id)).map(id => { const e = G.byId.get(id);
          return `<button type="button" class="gl-chip gl-qf-opt is-on" aria-pressed="true" data-gll="qf-opt" data-id="${H(id)}" style="--gf:${FAM_HUE[e.fam] || FAM_HUE.world}">${H(e.name)}</button>`; }).join('') +
        `</div>` +
        `<div class="gl-qf-btns">` +
          `<button type="button" class="dc-btn dc-btn-main" data-gll="qf-save"${QF.sel.length ? '' : ' disabled'}>${ico('check')}${H(QF.sel.length > 1 ? tx('qf_save_n', { n: QF.sel.length }) : tx('pk_save'))}</button>` +
          `<button type="button" class="dc-btn dc-btn-normal" data-gll="qf-skip">${H(tx('qf_skip'))}${ico('next')}</button>` +
          `<button type="button" class="dc-btn dc-btn-plain" data-gll="qf-search">${ico('search')}${H(tx('qf_search'))}</button>` +
        `</div>` +
        `<button type="button" class="gl-qf-none" data-gll="qf-none" title="${H(tx('qf_none_tip'))}">${H(tx('qf_none'))}</button>` +
      `</div>`;
    }
    const streak = QF.streak
      ? `<span class="gl-qf-streak is-on">🔥 ${H(tx('qf_streak', { n: num(QF.streak) }))}</span>`
      : `<span class="gl-qf-streak">${H(tx(cur ? 'qf_streak0' : 'qf_streak_none'))}</span>`;
    const badges = BADGES.map(b => {
      const got = _badgeBest >= b || pct >= b;
      return `<span class="gl-badge${got ? ' is-got' : ''}${_badgeNew === b ? ' is-new' : ''}" title="${H(tx(got ? 'qf_badge_got' : 'qf_badge_todo', { n: b }))}">` +
        `<span class="gl-badge-ic" aria-hidden="true">${b === 100 ? '👑' : b === 90 ? '🏆' : b === 75 ? '🥈' : '🥉'}</span><span class="gl-badge-n">${b}%</span></span>`;
    }).join('');
    _badgeNew = 0;
    const modeBtn = QF.mode === 'review'
      ? `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm" data-gll="qf-mode" data-v="fix">${ico('back')}${H(tx('qf_back_fix'))}</button>` : '';
    return `<section class="gl-sec gl-qf" id="glQf" aria-labelledby="glQfH">
      <div class="gl-sec-head"><div><h3 class="gl-sec-title" id="glQfH">${H(tx(QF.mode === 'review' ? 'qf_rev_title' : 'qf_title'))}</h3>
        <p class="gl-sec-sub">${H(tx(QF.mode === 'review' ? 'qf_rev_sub' : 'qf_sub'))}</p></div>${modeBtn}</div>
      <div class="gl-qf-grid">${card}
        <aside class="gl-qf-side" aria-label="${H(tx('qf_progress'))}">
          <div class="gl-ring">${ringSvg(pct, 132)}<div class="gl-ring-lbl"><strong>${pct}%</strong><span>${H(tx('qf_ring'))}</span></div></div>
          ${streak}
          <div class="gl-badges">${badges}</div>
          ${cur ? `<p class="gl-qf-keys" aria-hidden="true">${H(tx('qf_keys'))}</p>` : ''}
        </aside>
      </div>
    </section>`;
  }
  // After the page is drawn: the card's picture
  function qfPaint(root) {
    const el = root.querySelector('#glQfArt');
    if (!el || !QF.key) return;
    const x = deck().find(d => qfKey(d.r) === QF.key);
    if (!x) return;
    artFor(x.r.kind, x.r.p).then(url => {
      if (!url || !el.isConnected) return;
      el.style.backgroundImage = `url("${String(typeof sizedArtUrl === 'function' ? sizedArtUrl(url, 240) : url).replace(/"/g, '%22')}")`;
      el.textContent = '';
      el.classList.add('has-img');
    });
  }
  function qfCurrent() { return deck().find(d => qfKey(d.r) === QF.key) || null; }
  // A short burst of dots in the genre's colour where the card was
  function burst(el, hue) {
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const b = el.getBoundingClientRect();
    const box = document.createElement('div');
    box.className = 'gl-burst';
    box.style.left = (b.left + b.width / 2) + 'px';
    box.style.top = (b.top + b.height / 2) + 'px';
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('span');
      const a = (i / 18) * Math.PI * 2, d = 60 + Math.random() * 70;
      s.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px');
      s.style.setProperty('--dy', (Math.sin(a) * d).toFixed(1) + 'px');
      s.style.background = i % 3 ? hue : 'var(--accent)';
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 900);
  }
  function qfMove(dir, list) {
    const card = document.querySelector('.gl-qf-card[data-qf]');
    const x = qfCurrent();
    if (!x) return;
    if (dir === 'save' && list) {
      const e = G.byId.get(list[0]);
      burst(card, e ? (FAM_HUE[e.fam] || FAM_HUE.world) : 'var(--accent)');
    }
    if (card) card.classList.add(dir === 'skip' ? 'is-out-l' : 'is-out-r');
    setTimeout(() => {
      QF.sel = null;
      if (dir === 'skip') { QF.skipped.add(qfKey(x.r)); QF.streak = 0; QF.key = ''; renderPage(); return; }
      QF.streak++;
      QF.key = '';
      // Saving fires dc-genres-changed, which redraws the page with the next card
      genreEditSet(x.r.kind, x.r.p, list);
      checkBadges();
    }, 220);
  }
  function qfClick(a, b) {
    if (a === 'qf-opt') {
      const id = b.dataset.id, i = QF.sel.indexOf(id);
      if (i >= 0) QF.sel.splice(i, 1); else if (QF.sel.length < MAX) QF.sel.push(id);
      renderPage();
      const n = document.querySelector(`.gl-qf-opt[data-id="${CSS.escape(id)}"]`);
      if (n) n.focus({ preventScroll: true });
      return true;
    }
    if (a === 'qf-save') { if (QF.sel && QF.sel.length) qfMove('save', QF.sel.slice()); return true; }
    if (a === 'qf-skip') { qfMove('skip'); return true; }
    if (a === 'qf-none') { qfMove('save', []); return true; }
    if (a === 'qf-search') { const x = qfCurrent(); if (x) open(x.r.kind, x.r.p); return true; }
    if (a === 'qf-mode') { QF.mode = b.dataset.v === 'review' ? 'review' : 'fix'; QF.key = ''; QF.sel = null; renderPage(); scrollToSec('glQf'); return true; }
    if (a === 'qf-unskip') { QF.skipped.clear(); QF.key = ''; renderPage(); return true; }
    return false;
  }
  function scrollToSec(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }
  // Keys while the card is on screen: 1–6 pick, Enter saves, → skips.
  // Caught before the app's own number-key tab shortcuts.
  function qfKeys(ev) {
    if (!_pageOn || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const card = document.querySelector('.gl-qf-card[data-qf]');
    if (!card) return;
    const t = ev.target;
    if (t && (t.closest('input, textarea, select, [contenteditable="true"]'))) return;
    if (document.querySelector('.modal-overlay.open, .awards-picker-confirm')) return;
    const r = card.getBoundingClientRect();
    if (r.bottom < 60 || r.top > innerHeight - 60) return;
    let done = false;
    if (/^[1-6]$/.test(ev.key)) {
      const opt = card.querySelectorAll('.gl-qf-opt')[+ev.key - 1];
      if (opt) { qfClick('qf-opt', opt); done = true; }
    } else if (ev.key === 'Enter' && !(t && t.closest('button, a'))) {
      if (QF.sel && QF.sel.length) { qfMove('save', QF.sel.slice()); done = true; }
    } else if (ev.key === 'ArrowRight' && !(t && t.closest('[role="tablist"]'))) { qfMove('skip'); done = true; }
    if (done) { ev.preventDefault(); ev.stopImmediatePropagation(); }
  }
  window.addEventListener('keydown', qfKeys, true);

  /* ── 10. Genre pages (step 2) ──────────────────────────────────────────
     Tap a genre (the map, the shelf, a side panel chip, "Open its page" by
     the list's top chips) → its own page inside the library. GP.id is the
     genre on screen ('' = the library itself); GP.back is where the library
     was scrolled to, for Back. */
  const GP = { id: '', back: 0, art: [] };
  // Rarity: Common = in the popular set; Rare = shares a word with a popular
  // genre ("Deep House" ← House); Deep cut = shares none ("Piseiro")
  const STOPW = new Set(['and', 'the', 'music', 'new', 'old', 'style']);
  let _popWords = null, _popTag = -1;
  function rarity(id) {
    const e = G.byId.get(id);
    if (!e) return 'rare';
    if (e.pop) return 'common';
    if (!_popWords || _popTag !== G.list.length) {
      _popWords = new Set(); _popTag = G.list.length;
      for (const pid of G.popular) { const p = G.byId.get(pid); if (p) for (const w of p.n.split(' ')) if (w.length > 2 && !STOPW.has(w)) _popWords.add(w); }
    }
    return e.n.split(' ').some(w => _popWords.has(w)) ? 'rare' : 'deep';
  }
  const lang = () => (typeof currentLang !== 'undefined' && currentLang) || 'en';
  const pct1 = v => (v >= 0.995 ? 100 : v < 0.01 && v > 0 ? '<1' : Math.round(v * 100)) + '%';

  function openGenre(id) {
    id = String(id || '').toLowerCase();
    const e = entryOfTag(id);
    if (e) id = e.id;
    if (!id) return;
    // From a side panel: close it first (it sits over every page)
    ['artistModal', 'albumModal', 'songModal'].forEach(m => { const el = document.getElementById(m); if (el) el.classList.remove('open'); });
    if (!_pageOn) {
      GP.id = id; GP.back = 0;
      if (typeof dcGoTab === 'function') dcGoTab('genrelib');
    } else {
      if (!GP.id) GP.back = window.scrollY;
      GP.id = id;
      renderPage();
    }
    window.scrollTo(0, 0);
  }
  function closeGenre() {
    GP.id = '';
    renderPage();
    window.scrollTo(0, GP.back || 0);
  }

  function genrePageHtml(id) {
    const s = stats(), g = s.byId.get(id), e = G.byId.get(id);
    const name = e ? e.name : nameOf(id), fam = e ? e.fam : 'world', hue = FAM_HUE[fam] || FAM_HUE.world;
    const rk = s.rank.indexOf(id) + 1, rar = rarity(id);
    GP.art = [];
    let h = `<div class="gl-gp" style="--gf:${hue}">`;
    h += `<button type="button" class="dc-btn dc-btn-plain dc-btn-sm gl-gp-back" data-gll="gp-back">${ico('back')}${H(tx('gp_back'))}</button>`;
    const facts = g && g.n ? [
      [num(g.n), tx('gp_plays')],
      [pct1(g.n / (s.tagged || 1)), tx('gp_share')],
      [new Date(g.first).toLocaleDateString(lang(), { month: 'short', year: 'numeric' }), tx('gp_first')],
      [num(g.artists.size), tx('gp_artists')],
      [num(g.songs.length), tx('gp_songs')]
    ] : [];
    h += `<header class="gl-gp-hero">
      <span class="gl-gp-eyebrow"><span class="gl-dot" aria-hidden="true"></span>${H(tx('fam_' + fam))}${rk ? ' · ' + H(tx('gp_rank', { n: num(rk) })) : ''}</span>
      <h2 class="gl-gp-name">${H(name)}</h2>
      <span class="gl-rar gl-rar-${rar}" title="${H(tx('rar_' + rar + '_tip'))}">${H(tx('rar_' + rar))}</span>
      ${facts.length ? `<dl class="gl-gp-facts">${facts.map(([v, l]) => `<div><dt>${H(l)}</dt><dd>${H(v)}</dd></div>`).join('')}</dl>`
        : s.sec.has(id) ? `<p class="gl-gp-none">${H(tx('gp_second', { name, n: num(s.sec.get(id).songs), p: plays(s.sec.get(id).n) }))}</p>`
        : `<p class="gl-gp-none">${H(tx('gp_none', { name }))}</p>`}
      <div class="gl-gp-actions">` +
        (g && g.n ? `<button type="button" class="dc-btn dc-btn-main" data-gll="gp-mix">${ico('play')}${H(tx('gp_mix'))}</button>` +
          `<button type="button" class="dc-btn dc-btn-normal" data-gll="gp-sp">${ico('wand')}${H(tx('gp_sp'))}</button>` +
          `<button type="button" class="dc-btn dc-btn-normal" data-gll="gp-share">${ico('share')}${H(tx('gp_share_card'))}</button>` +
          `<button type="button" class="dc-btn dc-btn-plain" data-gll="gp-fix">${ico('edit')}${H(tx('gp_fix'))}</button>` : '') +
      `</div>
    </header>`;
    if (g && g.n) {
      const artRow = (kind, p, i, label, sub, n, act) => {
        GP.art.push({ kind, p });
        return `<li><button type="button" class="gl-gp-row" data-gll="${act}" data-i="${i}">` +
          `<span class="gl-gp-rk">${i + 1}</span>` +
          `<span class="gl-art${kind === 'artist' ? ' is-round' : ''}" data-gpart="${GP.art.length - 1}" aria-hidden="true">${H(typeof initials === 'function' ? initials(label) : '')}</span>` +
          `<span class="gl-gp-row-t"><span class="gl-gp-row-n">${H(label)}</span>${sub ? `<span class="gl-gp-row-s">${H(sub)}</span>` : ''}</span>` +
          `<span class="gl-gp-row-p">${H(num(n))}</span></button></li>`;
      };
      const artists = [...g.artists.values()].sort((a, b) => b.n - a.n).slice(0, 6);
      const albums = [...g.albums.values()].sort((a, b) => b.n - a.n).slice(0, 6);
      GP.lists = { artists, songs: g.songs.slice(0, 8), albums };
      h += `<div class="gl-gp-body">
        <section class="gl-gp-col"><h3 class="gl-gp-h">${H(tx('gp_top_artists'))}</h3><ol class="gl-gp-list">${artists.map((a, i) => artRow('artist', a.p, i, a.name, '', a.n, 'gp-artist')).join('')}</ol></section>
        <section class="gl-gp-col"><h3 class="gl-gp-h">${H(tx('gp_top_songs'))}</h3><ol class="gl-gp-list">${GP.lists.songs.map((r, i) => artRow('song', r.p, i, r.name, r.sub, r.n, 'gp-song')).join('')}</ol></section>
        ${albums.length ? `<section class="gl-gp-col"><h3 class="gl-gp-h">${H(tx('gp_top_albums'))}</h3><ol class="gl-gp-list">${albums.map((a, i) => artRow('album', a.p, i, a.name, a.artist, a.n, 'gp-album')).join('')}</ol></section>` : ''}
        <section class="gl-gp-col">${monthBars(g, s)}</section>
      </div>`;
    }
    h += nextToHtml(id, fam);
    h += `</div>`;
    return h;
  }
  // Plays per month for the last 12 months, as small bars
  function monthBars(g, s) {
    const max = Math.max(1, ...g.m);
    const peak = g.m.indexOf(Math.max(...g.m));
    const label = ym => { const [y, m] = ym.split('-'); return new Date(+y, +m - 1, 1).toLocaleDateString(lang(), { month: 'short' }); };
    return `<h3 class="gl-gp-h">${H(tx('gp_months'))}</h3>
      <div class="gl-gp-bars" role="img" aria-label="${H(tx('gp_months'))}">` + g.m.map((v, i) =>
        `<div class="gl-gp-bar${i === peak && v ? ' is-peak' : ''}" title="${H(label(s.yms[i]) + ' · ' + plays(v))}"><span style="height:${Math.round(v * 100 / max)}%"></span><em>${H(label(s.yms[i]).slice(0, 3))}</em></div>`).join('') +
      `</div>` + (g.m[peak] ? `<p class="gl-gp-note">${H(tx('gp_peak', { m: new Date(+s.yms[peak].slice(0, 4), +s.yms[peak].slice(5) - 1, 1).toLocaleDateString(lang(), { month: 'long', year: 'numeric' }), n: num(g.m[peak]) }))}</p>` : '');
  }
  // Same-family genres: the ones you play, then a few you don't yet
  function nextToHtml(id, fam) {
    const s = stats();
    // Played = a main genre, then genres you only have as a second one
    const played = s.rank.filter(x => x !== id && G.byId.get(x) && G.byId.get(x).fam === fam)
      .concat([...s.sec].filter(([x]) => x !== id && !s.byId.has(x) && G.byId.get(x) && G.byId.get(x).fam === fam).sort((a, b) => b[1].n - a[1].n).map(x => x[0]))
      .slice(0, 10);
    const fresh = G.list.filter(e => e.fam === fam && e.id !== id && !s.byId.has(e.id) && !s.sec.has(e.id))
      .sort((a, b) => (b.pop - a.pop) || a.n.length - b.n.length).slice(0, 6);
    if (!played.length && !fresh.length) return '';
    const chip = (gid, isNew) => { const e = G.byId.get(gid);
      return `<button type="button" class="gl-chip gl-gp-chip${isNew ? ' is-new' : ''}" data-gll="gp-open" data-id="${H(gid)}" style="--gf:${FAM_HUE[e.fam] || FAM_HUE.world}"><span class="gl-dot" aria-hidden="true"></span>${H(e.name)}${isNew ? `<span class="gl-gp-new">${H(tx('gp_new'))}</span>` : ''}</button>`; };
    return `<section class="gl-gp-next"><h3 class="gl-gp-h">${H(tx('gp_next'))}</h3><div class="gl-gp-chips">` +
      played.map(x => chip(x, false)).join('') + fresh.map(e => chip(e.id, true)).join('') + `</div></section>`;
  }
  function gpPaint(root) {
    root.querySelectorAll('[data-gpart]').forEach(el => {
      const a = GP.art[+el.dataset.gpart];
      if (!a) return;
      artFor(a.kind, a.p).then(url => {
        if (!url || !el.isConnected) return;
        el.style.backgroundImage = `url("${String(typeof sizedArtUrl === 'function' ? sizedArtUrl(url, 96) : url).replace(/"/g, '%22')}")`;
        el.classList.add('has-img');
        el.textContent = '';
      });
    });
  }
  function playMix(id) {
    const g = stats().byId.get(id);
    if (!g || !g.songs.length || typeof openYtPlayer !== 'function') return;
    // A shuffle of the genre's 60 most played songs, 25 of them
    const pool = g.songs.slice(0, 60).map(r => r.p);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const list = pool.slice(0, 25);
    openYtPlayer(list[0].title, list[0].artist, list[0].album || '', null);
    if (typeof _ytQueue !== 'undefined' && Array.isArray(_ytQueue)) {
      for (const p of list.slice(1)) _ytQueue.push({ title: p.title, artist: p.artist, album: p.album || '', btn: null });
      if (typeof _ytUpdateQueueDisplay === 'function') _ytUpdateQueueDisplay();
      if (typeof _ytSaveQueue === 'function') _ytSaveQueue();
    }
    toast(tx('gp_mix_on', { n: num(list.length), name: nameOf(id) }));
  }
  function makeSmart(id) {
    if (typeof spOpenBuilder !== 'function') return;
    const name = nameOf(id);
    spOpenBuilder(null, { name: tx('gp_sp_name', { name }), def: { match: 'all', rules: [{ f: 'genre', op: 'has', v: name }], sort: { f: 'plays' }, limit: 50 } });
  }
  function gpClick(a, b) {
    if (a === 'gp-back') { closeGenre(); return true; }
    if (a === 'gp-open' || a === 'gp-go') { openGenre(b.dataset.id); return true; }
    if (a === 'gp-mix') { playMix(GP.id); return true; }
    if (a === 'gp-sp') { makeSmart(GP.id); return true; }
    if (a === 'gp-share') { if (typeof shareGenre === 'function') shareGenre(GP.id); return true; }
    if (a === 'gp-fix') {
      const id = GP.id;
      GP.id = ''; S.genre = id; S.filter = 'all'; S.q = ''; S.shown = PAGE;
      renderPage();
      scrollToSec('glLib');
      return true;
    }
    const L = GP.lists || {}, i = +b.dataset.i;
    if (a === 'gp-artist' && L.artists && L.artists[i]) { if (typeof openArtistModal === 'function') openArtistModal(L.artists[i].name); return true; }
    if (a === 'gp-song' && L.songs && L.songs[i]) { if (typeof openSongModal === 'function' && typeof songKey === 'function') openSongModal(songKey(L.songs[i].p)); return true; }
    if (a === 'gp-album' && L.albums && L.albums[i]) { if (typeof openAlbumModal === 'function') openAlbumModal(L.albums[i].p.album + '|||' + L.albums[i].artist); return true; }
    return false;
  }

  /* ── 11. Your Sound (step 3) ───────────────────────────────────────────
     The top of the page: a headline about you, the families as one colour
     bar, three facts, and a bubble map (families → genres, sized by plays).
     Tap a family to open it, a genre to open its page. S.span picks the time:
     'all' | '365' | '30'. SND.fam is the family the map is zoomed into. */
  const SND = { fam: '' };
  const SPANS = ['all', '365', '30'];
  if (!SPANS.includes(S.span)) S.span = 'all';
  // Families by plays in the span, with their genres
  function famsIn(span) {
    const s = stats(), by = {};
    for (const id of s.rank) {
      const g = s.byId.get(id), v = spanN(g, span);
      if (!v) continue;
      const f = by[g.fam] || (by[g.fam] = { fam: g.fam, n: 0, genres: [] });
      f.n += v;
      f.genres.push({ id, n: v });
    }
    const list = Object.values(by).sort((a, b) => b.n - a.n);
    for (const f of list) f.genres.sort((a, b) => b.n - a.n);
    return { list, total: list.reduce((a, f) => a + f.n, 0) };
  }
  // The genre that grew most: plays in the last 90 days vs the 90 before
  function riser() {
    let best = null, bestV = 0;
    for (const g of stats().byId.values()) {
      if (g.nRecent < 8) continue;
      const v = (g.nRecent - g.nPrev) / Math.sqrt(g.nPrev + 4);
      if (v > bestV) { bestV = v; best = g.id; }
    }
    return best;
  }
  // The rarest genre you play: a deep cut, else a rare one, most played first
  function rarest(span) {
    const s = stats();
    for (const want of ['deep', 'rare']) {
      const id = s.rank.filter(x => spanN(s.byId.get(x), span) > 0).find(x => rarity(x) === want);
      if (id) return id;
    }
    return null;
  }

  // Circle packing: radii (biggest first) → centres, each new circle put
  // touching two placed ones, as close to the middle as it fits
  function packCircles(rs, pad) {
    const P = [];
    const tangents = (A, B, r) => {
      const ra = A.r + r + pad, rb = B.r + r + pad, dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy);
      if (!d || d > ra + rb || d < Math.abs(ra - rb)) return [];
      const a = (ra * ra - rb * rb + d * d) / (2 * d), h = Math.sqrt(Math.max(0, ra * ra - a * a));
      const mx = A.x + a * dx / d, my = A.y + a * dy / d;
      return [{ x: mx + h * dy / d, y: my - h * dx / d }, { x: mx - h * dy / d, y: my + h * dx / d }];
    };
    for (let i = 0; i < rs.length; i++) {
      const r = rs[i];
      if (i === 0) { P.push({ x: 0, y: 0, r }); continue; }
      if (i === 1) { P.push({ x: P[0].r + r + pad, y: 0, r }); continue; }
      let best = null, bestD = Infinity;
      for (let a = 0; a < P.length; a++) for (let b = a + 1; b < P.length; b++) {
        for (const c of tangents(P[a], P[b], r)) {
          if (P.some(q => Math.hypot(q.x - c.x, q.y - c.y) < q.r + r + pad - 1e-6)) continue;
          const dd = Math.hypot(c.x, c.y);
          if (dd < bestD) { bestD = dd; best = c; }
        }
      }
      if (!best) { const R = Math.max(...P.map(q => Math.hypot(q.x, q.y) + q.r)); best = { x: 0, y: R + r + pad }; }
      P.push({ x: best.x, y: best.y, r });
    }
    // Centre the group and measure the circle around it
    const minX = Math.min(...P.map(q => q.x - q.r)), maxX = Math.max(...P.map(q => q.x + q.r));
    const minY = Math.min(...P.map(q => q.y - q.r)), maxY = Math.max(...P.map(q => q.y + q.r));
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    for (const q of P) { q.x -= cx; q.y -= cy; }
    const R = Math.max(...P.map(q => Math.hypot(q.x, q.y) + q.r));
    return { P, R };
  }
  // A genre bubble's fill: the family hue, lighter for the smaller ones
  const leafFill = (hue, i) => `color-mix(in srgb, ${hue} ${Math.max(62, 100 - i * 6)}%, #fff)`;
  function svgText(x, y, size, txt, cls) {
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${size.toFixed(1)}" class="${cls}" text-anchor="middle">${H(txt)}</text>`;
  }
  function fit(name, r, size) {
    const max = Math.floor((r * 1.7) / (size * 0.56));
    return name.length <= max ? name : (max >= 4 ? name.slice(0, max - 1) + '…' : '');
  }
  function bubbleSvg(span) {
    const { list } = famsIn(span);
    const W = 400;
    if (!list.length) return '';
    if (SND.fam && !list.some(f => f.fam === SND.fam)) SND.fam = '';
    let body = '';
    if (SND.fam) {
      // One family, its genres big and labelled
      const f = list.find(x => x.fam === SND.fam), hue = FAM_HUE[f.fam] || FAM_HUE.world;
      const gs = f.genres.slice(0, 28);
      const { P, R } = packCircles(gs.map(g => Math.sqrt(g.n)), 0.6);
      const k = (W / 2 - 6) / R;
      gs.forEach((g, i) => {
        const q = P[i], x = W / 2 + q.x * k, y = W / 2 + q.y * k, r = q.r * k;
        const size = Math.max(8, Math.min(18, r / 3.2));
        const name = fit(nameOf(g.id), r, size);
        body += `<g class="gl-bub" data-gll="gp-open" data-id="${H(g.id)}" tabindex="0" role="button" aria-label="${H(nameOf(g.id) + ' · ' + plays(g.n))}">` +
          `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" style="fill:${leafFill(hue, i)}"/>` +
          (name ? svgText(x, y + (r > 34 ? -size * 0.15 : size * 0.35), size, name, 'gl-bub-t') : '') +
          (name && r > 34 ? svgText(x, y + size * 1.05, size * 0.72, num(g.n), 'gl-bub-n') : '') +
          `<title>${H(nameOf(g.id) + ' · ' + plays(g.n))}</title></g>`;
      });
    } else {
      // Every family (top 9), each a ring of its top genres
      const fams = list.slice(0, 9).map(f => {
        const gs = f.genres.slice(0, 12);
        const pk = packCircles(gs.map(g => Math.sqrt(g.n)), 0.4);
        return { f, gs, pk };
      });
      const outer = packCircles(fams.map(x => x.pk.R + 1.5), 2);
      const k = (W / 2 - 4) / outer.R;
      fams.forEach((x, fi) => {
        const o = outer.P[fi], hue = FAM_HUE[x.f.fam] || FAM_HUE.world;
        const fx = W / 2 + o.x * k, fy = W / 2 + o.y * k;
        body += `<g class="gl-bub-fam" data-gll="snd-fam" data-v="${x.f.fam}" tabindex="0" role="button" aria-label="${H(tx('fam_' + x.f.fam) + ' · ' + plays(x.f.n))}">` +
          `<circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="${(o.r * k).toFixed(1)}" style="fill:color-mix(in srgb, ${hue} 12%, transparent);stroke:color-mix(in srgb, ${hue} 45%, transparent)"/>` +
          `<title>${H(tx('fam_' + x.f.fam) + ' · ' + plays(x.f.n))}</title>`;
        x.gs.forEach((g, i) => {
          const q = x.pk.P[i], gx = fx + q.x * k, gy = fy + q.y * k, r = q.r * k;
          const size = Math.max(7, Math.min(13, r / 3.1));
          const name = r > 15 ? fit(nameOf(g.id), r, size) : '';
          body += `<circle class="gl-bub-leaf" cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="${r.toFixed(1)}" style="fill:${leafFill(hue, i)}"><title>${H(nameOf(g.id) + ' · ' + plays(g.n))}</title></circle>` +
            (name ? svgText(gx, gy + size * 0.35, size, name, 'gl-bub-t') : '');
        });
        body += `</g>`;
      });
    }
    return `<svg class="gl-bubbles${SND.fam ? ' is-fam' : ''}" viewBox="0 0 ${W} ${W}" role="group" aria-label="${H(tx('snd_map'))}">${body}</svg>`;
  }

  function soundHtml() {
    const span = S.span, F = famsIn(span), s = stats();
    if (!F.list.length) return '';
    const top = F.list[0], second = F.list[1];
    const pc = f => Math.round(f.n * 100 / F.total);
    const em = (txt, fam) => `<em style="--gf:${FAM_HUE[fam] || FAM_HUE.world}">${H(txt)}</em>`;
    // Headline: the words are escaped first, then the coloured parts go in
    const head = H(tx('snd_head')).split('{pct} {fam}').join(em(pc(top) + '% ' + tx('fam_' + top.fam), top.fam));
    let tail = '';
    if (second && pc(second) >= 15) tail = H(tx('snd_tail_second')).split('{pct} {fam}').join(em(pc(second) + '% ' + tx('fam_' + second.fam), second.fam));
    else if (F.list.length >= 5) tail = H(tx('snd_tail_spread', { n: num(F.list.length) }));
    const shown = F.list.filter(f => f.n / F.total >= 0.01);
    const rest = F.total - shown.reduce((a, f) => a + f.n, 0);
    const bar = shown.map(f => `<button type="button" class="gl-dna-seg${SND.fam === f.fam ? ' is-on' : ''}" data-gll="snd-fam" data-v="${f.fam}" style="flex-grow:${f.n};--gf:${FAM_HUE[f.fam] || FAM_HUE.world}" title="${H(tx('fam_' + f.fam) + ' · ' + pc(f) + '%')}" aria-label="${H(tx('fam_' + f.fam) + ' ' + pc(f) + '%')}"></button>`).join('') +
      (rest > 0 ? `<span class="gl-dna-seg is-rest" style="flex-grow:${rest}" title="${H(tx('snd_other'))}"></span>` : '');
    const legend = shown.slice(0, 8).map(f => `<button type="button" class="gl-dna-key" data-gll="snd-fam" data-v="${f.fam}" style="--gf:${FAM_HUE[f.fam] || FAM_HUE.world}"><i aria-hidden="true"></i>${H(tx('fam_' + f.fam))} <b>${pc(f)}%</b></button>`).join('');
    const heard = s.rank.filter(id => spanN(s.byId.get(id), span) > 0).length;
    const rs = riser(), rr = rarest(span);
    const fact = (v, l, id) => id
      ? `<button type="button" class="gl-fact" data-gll="gp-open" data-id="${H(id)}" style="--gf:${FAM_HUE[(G.byId.get(id) || {}).fam] || FAM_HUE.world}"><strong>${H(v)}</strong><span>${H(l)}</span></button>`
      : `<div class="gl-fact"><strong>${H(v)}</strong><span>${H(l)}</span></div>`;
    const spanBtns = SPANS.map(v => `<button type="button" class="gl-seg-btn${span === v ? ' is-on' : ''}" aria-pressed="${span === v}" data-gll="snd-span" data-v="${v}">${H(tx('snd_span_' + v))}</button>`).join('');
    const famName = SND.fam ? tx('fam_' + SND.fam) : '';
    return `<section class="gl-sec gl-snd" id="glSnd" aria-labelledby="glSndH">
      <div class="gl-sec-head"><div><h3 class="gl-sec-title" id="glSndH">${H(tx('snd_title'))}</h3></div>
        <div class="dc-seg gl-seg" role="group" aria-label="${H(tx('snd_span_label'))}">${spanBtns}</div></div>
      <div class="gl-snd-grid">
        <div class="gl-snd-text">
          <p class="gl-snd-head">${head}${tail || '.'}</p>
          <div class="gl-dna" role="group" aria-label="${H(tx('snd_bar'))}">${bar}</div>
          <div class="gl-dna-legend">${legend}</div>
          <div class="gl-facts">
            ${fact(num(heard), tx('snd_heard'))}
            ${rs ? fact(nameOf(rs), tx('snd_riser'), rs) : ''}
            ${rr ? fact(nameOf(rr), tx('snd_rarest'), rr) : ''}
          </div>
        </div>
        <div class="gl-snd-map">
          ${SND.fam ? `<div class="gl-snd-map-head"><button type="button" class="dc-btn dc-btn-plain dc-btn-sm" data-gll="snd-fam" data-v="">${ico('back')}${H(tx('snd_all_fams'))}</button><span class="gl-snd-fam" style="--gf:${FAM_HUE[SND.fam] || FAM_HUE.world}"><span class="gl-dot" aria-hidden="true"></span>${H(famName)}</span></div>`
            : `<p class="gl-snd-hint">${H(tx('snd_hint'))}</p>`}
          ${bubbleSvg(span)}
        </div>
      </div>
    </section>`;
  }
  function sndClick(a, b) {
    if (a === 'snd-span') { S.span = SPANS.includes(b.dataset.v) ? b.dataset.v : 'all'; savePrefs(); renderPage(); return true; }
    if (a === 'snd-fam') { SND.fam = SND.fam === b.dataset.v ? '' : (b.dataset.v || ''); renderPage(); return true; }
    return false;
  }
  // Enter / Space on a bubble (they're SVG groups with role=button)
  function sndKey(ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    const g = ev.target.closest && ev.target.closest('.gl-bubbles [data-gll]');
    if (!g) return;
    ev.preventDefault();
    g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }

  /* ── 12. Next door + the genre shelf (step 4) ──────────────────────────
     nextDoor(): for your top families, genres in the same family you have
     never played (not as a main genre, not as a second one). Ones that share
     a word with a genre you play there come first ("Deep House" next to
     House), then popular ones. Used by the shelf's locked cards and by the
     Next door section (step 7). */
  function nextDoor(perFam, fams) {
    const s = stats(), F = famsIn('all').list.slice(0, fams || 3), out = [];
    for (const f of F) {
      const mine = new Set();
      for (const g of f.genres) { const e = G.byId.get(g.id); if (e) for (const w of e.n.split(' ')) if (w.length > 2 && !STOPW.has(w)) mine.add(w); }
      const cand = G.list.filter(e => e.fam === f.fam && !s.byId.has(e.id) && !s.sec.has(e.id))
        .map(e => ({ e, sc: (e.n.split(' ').some(w => mine.has(w)) ? 2 : 0) + (e.pop ? 1 : 0) - e.n.length / 100 }))
        .sort((a, b) => b.sc - a.sc).slice(0, perFam || 3).map(x => x.e.id);
      out.push({ fam: f.fam, n: f.n, ids: cand });
    }
    return out;
  }
  const SH = { all: false };
  function shelfHtml() {
    const s = stats();
    if (!s.rank.length) return '';
    const deep = s.rank.filter(id => rarity(id) === 'deep').length;
    const rare = s.rank.filter(id => rarity(id) === 'rare').length;
    const shown = SH.all ? s.rank : s.rank.slice(0, 11);
    const card = (id, i) => {
      const g = s.byId.get(id), e = G.byId.get(id), fam = e ? e.fam : 'world', rar = rarity(id);
      return `<button type="button" class="gl-gcard gl-gcard-${rar}" data-gll="gp-open" data-id="${H(id)}" style="--gf:${FAM_HUE[fam] || FAM_HUE.world}">` +
        `<span class="gl-gcard-no">#${String(i + 1).padStart(3, '0')}</span>` +
        `<span class="gl-gcard-fam">${H(tx('fam_' + fam))}</span>` +
        `<span class="gl-gcard-name">${H(nameOf(id))}</span>` +
        `<span class="gl-gcard-foot"><span class="gl-gcard-pl">${H(plays(g.n))}</span><span class="gl-gcard-rar">${rar === 'deep' ? '✦ ' : rar === 'rare' ? '◆ ' : ''}${H(tx('rar_' + rar))}</span></span></button>`;
    };
    // Locked cards: a few genres next door, greyed until you play them
    const locked = SH.all ? [] : nextDoor(2, 2).flatMap(x => x.ids).slice(0, 3);
    const lock = id => { const e = G.byId.get(id);
      return `<button type="button" class="gl-gcard is-locked" data-gll="gp-open" data-id="${H(id)}" style="--gf:${FAM_HUE[e.fam] || FAM_HUE.world}">` +
        `<span class="gl-gcard-no">???</span><span class="gl-gcard-fam">${H(tx('fam_' + e.fam))}</span>` +
        `<span class="gl-gcard-name">${H(e.name)}</span><span class="gl-gcard-foot"><span class="gl-gcard-pl">${H(tx('sh_locked'))}</span></span></button>`; };
    return `<section class="gl-sec gl-shelf" id="glShelf" aria-labelledby="glShelfH">
      <div class="gl-sec-head"><div><h3 class="gl-sec-title" id="glShelfH">${H(tx('sh_title'))}</h3>
        <p class="gl-sec-sub">${H(tx('sh_sub', { n: num(s.rank.length) }))}${rare + deep ? ' ' + H(tx('sh_sub_rare', { r: num(rare), d: num(deep) })) : ''}${locked.length ? ' ' + H(tx('sh_sub_locked')) : ''}</p></div></div>
      <div class="gl-shelf-grid">${shown.map(card).join('')}${locked.map(lock).join('')}</div>
      ${s.rank.length > 11 ? `<div class="gl-more-wrap"><button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-gll="sh-all">${H(SH.all ? tx('sh_less') : tx('sh_all', { n: num(s.rank.length) }))}</button></div>` : ''}
    </section>`;
  }

  /* The share card: drawn straight on a canvas (no html2canvas, so none of
     its traps), 1080×1350. No artwork, so nothing can taint the canvas. */
  let _shEl = null, _shFile = null;
  function wrapLines(ctx, text, maxW, maxLines) {
    const words = String(text).split(' '), lines = [];
    let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (ctx.measureText(t).width <= maxW || !cur) cur = t; else { lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines.slice(0, maxLines);
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function drawCard(id) {
    const s = stats(), g = s.byId.get(id), e = G.byId.get(id);
    const fam = e ? e.fam : 'world', hue = FAM_HUE[fam] || FAM_HUE.world, name = nameOf(id);
    const W = 1080, Hh = 1350, c = document.createElement('canvas');
    c.width = W; c.height = Hh;
    const x = c.getContext('2d');
    const disp = '"Bricolage Grotesque", "IBM Plex Sans", system-ui, sans-serif';
    const sans = '"IBM Plex Sans", system-ui, sans-serif', mono = '"JetBrains Mono", ui-monospace, monospace';
    // Ground: deep navy with the genre's colour glowing from the top left
    x.fillStyle = '#0b1220'; x.fillRect(0, 0, W, Hh);
    let gr = x.createRadialGradient(140, 120, 40, 140, 120, 1100);
    gr.addColorStop(0, hue); gr.addColorStop(0.55, 'rgba(11,18,32,0)');
    x.globalAlpha = 0.75; x.fillStyle = gr; x.fillRect(0, 0, W, Hh); x.globalAlpha = 1;
    // Fine diagonal lines, like a foil card
    x.strokeStyle = 'rgba(255,255,255,0.05)'; x.lineWidth = 2;
    for (let i = -Hh; i < W; i += 36) { x.beginPath(); x.moveTo(i, Hh); x.lineTo(i + Hh * 0.6, 0); x.stroke(); }
    const L = 96;
    x.fillStyle = 'rgba(255,255,255,0.75)'; x.font = `600 30px ${mono}`;
    x.fillText('dankcharts.fm', L, 120);
    const rk = s.rank.indexOf(id) + 1;
    x.fillStyle = '#ffffff'; x.font = `700 32px ${mono}`;
    x.fillText((rk ? tx('card_rank', { n: rk }) + ' · ' : '') + tx('fam_' + fam).toUpperCase(), L, 250);
    // The name, as big as fits on two lines
    let size = 170, lines;
    for (;;) {
      x.font = `800 ${size}px ${disp}`;
      lines = wrapLines(x, name, W - L * 2, 3);
      if ((lines.length <= 2 && !lines.some(l => x.measureText(l).width > W - L * 2)) || size <= 70) break;
      size -= 8;
    }
    x.fillStyle = '#ffffff';
    let y = 250;
    lines.forEach((l, i) => { y = 250 + size * 0.95 + i * size * 0.98; x.fillText(l, L, y); });
    // Rarity pill, just under the name
    y += 50;
    const rar = rarity(id), rt = (rar === 'deep' ? '✦ ' : rar === 'rare' ? '◆ ' : '') + tx('rar_' + rar).toUpperCase();
    x.font = `700 28px ${mono}`;
    const pw = x.measureText(rt).width + 48;
    roundRect(x, L, y, pw, 56, 28); x.fillStyle = rar === 'deep' ? '#fbbf24' : rar === 'rare' ? '#58aaf6' : 'rgba(255,255,255,0.18)'; x.fill();
    x.fillStyle = rar === 'common' ? '#ffffff' : '#0b1220'; x.fillText(rt, L + 24, y + 38);
    // Three numbers
    y += 56 + 110;
    const facts = g ? [[num(g.n), tx('gp_plays')], [pct1(g.n / (s.tagged || 1)), tx('gp_share')], [new Date(g.first).toLocaleDateString(lang(), { month: 'short', year: 'numeric' }), tx('gp_first')]] : [];
    let fx = L;
    for (const [v, l] of facts) {
      x.fillStyle = '#ffffff'; x.font = `700 64px ${mono}`; x.fillText(v, fx, y);
      x.fillStyle = 'rgba(255,255,255,0.6)'; x.font = `700 24px ${sans}`; x.fillText(l.toUpperCase(), fx, y + 42);
      fx += Math.max(x.measureText(l.toUpperCase()).width, (() => { x.font = `700 64px ${mono}`; return x.measureText(v).width; })()) + 70;
    }
    // Top artists: as many of three as fit above the footer line
    y += 130;
    const rows = Math.max(0, Math.min(3, Math.floor((Hh - 170 - (y + 30)) / 104)));
    if (g && rows) {
      const arts = [...g.artists.values()].sort((a, b) => b.n - a.n).slice(0, rows);
      x.fillStyle = 'rgba(255,255,255,0.6)'; x.font = `700 24px ${sans}`; x.fillText(tx('gp_top_artists').toUpperCase(), L, y);
      y += 30;
      arts.forEach((a, i) => {
        const cy = y + 50 + i * 104;
        x.beginPath(); x.arc(L + 38, cy, 38, 0, Math.PI * 2); x.fillStyle = hue; x.fill();
        x.fillStyle = '#0b1220'; x.font = `800 28px ${disp}`; x.textAlign = 'center';
        x.fillText(typeof initials === 'function' ? initials(a.name) : a.name.slice(0, 2), L + 38, cy + 10); x.textAlign = 'left';
        x.fillStyle = '#ffffff'; x.font = `700 40px ${sans}`;
        let nm = a.name; while (x.measureText(nm).width > W - L * 2 - 260 && nm.length > 4) nm = nm.slice(0, -2);
        x.fillText(nm === a.name ? nm : nm + '…', L + 100, cy + 14);
        x.fillStyle = 'rgba(255,255,255,0.65)'; x.font = `600 32px ${mono}`; x.textAlign = 'right';
        x.fillText(num(a.n), W - L, cy + 12); x.textAlign = 'left';
      });
    }
    x.fillStyle = 'rgba(255,255,255,0.7)'; x.font = `600 30px ${sans}`;
    x.fillText(tx('card_cta'), L, Hh - 90);
    return c;
  }
  function shareGenre(id) {
    if (!id) return;
    if (!_shEl) {
      _shEl = document.createElement('div');
      _shEl.className = 'modal-overlay gl-share-overlay';
      _shEl.id = 'glShareModal';
      _shEl.setAttribute('role', 'dialog');
      _shEl.setAttribute('aria-modal', 'true');
      _shEl.setAttribute('aria-labelledby', 'glShareTitle');
      document.body.appendChild(_shEl);
      _shEl.addEventListener('mousedown', ev => { if (ev.target === _shEl) _shEl.classList.remove('open'); });
      _shEl.addEventListener('click', ev => {
        const b = ev.target.closest('[data-glsh]');
        if (!b) return;
        if (b.dataset.glsh === 'close') _shEl.classList.remove('open');
        if (b.dataset.glsh === 'save' && _shFile) {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(_shFile); a.download = _shFile.name;
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        }
        // navigator.share needs the tap itself: the file was made beforehand
        if (b.dataset.glsh === 'share' && _shFile && navigator.share) navigator.share({ files: [_shFile] }).catch(() => {});
      });
    }
    const canShare = !!(navigator.canShare && navigator.share);
    _shEl.innerHTML = `<div class="dc-modal dc-frame gl-share-box">
      <div class="dc-frame-head"><div class="dc-frame-titles"><h3 class="dc-frame-title" id="glShareTitle">${H(tx('card_title', { name: nameOf(id) }))}</h3></div>
        <button type="button" class="dc-btn dc-btn-plain dc-btn-icon dc-modal-close" data-glsh="close" aria-label="${H(typeof t === 'function' ? t('set_close') : 'Close')}">✕</button></div>
      <div class="dc-frame-body gl-share-body"><div class="gl-share-img"><span class="gl-spin" aria-hidden="true"></span></div></div>
      <div class="dc-frame-foot"><div class="dc-frame-foot-start"></div>
        <button type="button" class="dc-btn dc-btn-normal" data-glsh="save" disabled>${ico('download')}${H(tx('card_save'))}</button>
        ${canShare ? `<button type="button" class="dc-btn dc-btn-main" data-glsh="share" disabled>${ico('share')}${H(tx('card_share'))}</button>` : ''}
      </div></div>`;
    _shEl.classList.add('open');
    _shFile = null;
    const fontsReady = document.fonts && document.fonts.load
      ? Promise.all(['800 100px "Bricolage Grotesque"', '700 40px "IBM Plex Sans"', '700 40px "JetBrains Mono"'].map(f => document.fonts.load(f).catch(() => {})))
      : Promise.resolve();
    fontsReady.then(() => {
      const c = drawCard(id);
      c.toBlob(blob => {
        if (!blob || !_shEl.classList.contains('open')) return;
        const fname = 'dankcharts-' + nameOf(id).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-') + '.png';
        _shFile = new File([blob], fname, { type: 'image/png' });
        const img = new Image();
        img.alt = tx('card_title', { name: nameOf(id) });
        img.src = URL.createObjectURL(blob);
        const box = _shEl.querySelector('.gl-share-img');
        box.innerHTML = ''; box.appendChild(img);
        _shEl.querySelectorAll('[data-glsh="save"], [data-glsh="share"]').forEach(b => {
          b.disabled = b.dataset.glsh === 'share' && !(navigator.canShare && navigator.canShare({ files: [_shFile] }));
        });
      }, 'image/png');
    });
  }

  /* ── 13. Tidy up (step 5) ──────────────────────────────────────────────
     What the library can already tell looks off, each with one button that
     fixes many items at once:
       free   songs / albums whose own (sheet) tags aren't genres while
              their artist has real ones → give them the artist's genres
       guess  top artists whose genres were only guessed online → check them
              in the Quick Fix deck (review mode)
       none   artists with no genre at all → Quick Fix
       mixed  an artist whose songs say 3+ different main genres in the
              sheet → choose for the artist (left out once you have) */
  function tidyFinds() {
    const all = items(), out = { free: [], guess: 0, none: 0, mixed: null };
    if (!G.list.length) return out;
    const artistReal = new Map();
    const artistIds = p => {
      const k = _pk(p);
      if (!artistReal.has(k)) {
        const info = genreInfo('artist', p), ids = [];
        for (const tg of info.g) { const e = entryOfTag(tg); if (e && !ids.includes(e.id)) ids.push(e.id); }
        artistReal.set(k, ids);
      }
      return artistReal.get(k);
    };
    for (const kind of ['song', 'album']) {
      for (const r of all[kind]) {
        const info = genreInfo(kind, r.p);
        if (info.src !== 'sheet' || !info.g.length || realInfo(info)) continue;
        const ids = artistIds(r.p);
        if (ids.length) out.free.push([kind, r.p, ids.slice(0, MAX), r.n]);
      }
    }
    for (const r of all.artist.slice(0, 100)) {
      const info = genreInfo('artist', r.p);
      if (info.src === 'web' && realInfo(info)) out.guess++;
    }
    out.none = deck().filter(x => x.r.kind === 'artist').length;
    // Songs that disagree, for the most played artists without a pick
    const per = new Map();
    for (const r of all.song.slice(0, 4000)) {
      if (_genreSongOwn(r.p) === undefined) continue;
      const id = mainOf({ g: _genreSongOwn(r.p) });
      if (!id) continue;
      const k = _pk(r.p);
      const m = per.get(k) || { name: _pa(r.p), p: r.p, n: 0, ids: new Map() };
      m.n += r.n; m.ids.set(id, (m.ids.get(id) || 0) + r.n); per.set(k, m);
    }
    const mixed = [...per.values()].filter(m => m.ids.size >= 3 && !(typeof genreEditGet === 'function' && genreEditGet('artist', m.p)))
      .sort((a, b) => b.n - a.n)[0];
    if (mixed) out.mixed = { name: mixed.name, p: mixed.p, ids: [...mixed.ids].sort((a, b) => b[1] - a[1]).map(x => x[0]) };
    return out;
  }
  // A song's own sheet genres (undefined when the sheet has none for it)
  function _genreSongOwn(p) {
    return typeof _awardsSheetGenres === 'function' ? _awardsSheetGenres().songs.get(_sk(p)) : undefined;
  }
  let _tidy = null;
  function tidyHtml() {
    const f = tidyFinds();
    _tidy = f;
    const rows = [];
    const row = (ic, title, text, btn, act) => `<li class="gl-tidy-row"><span class="gl-tidy-ic" aria-hidden="true">${ic}</span>` +
      `<div class="gl-tidy-txt"><strong>${H(title)}</strong><span>${H(text)}</span></div>` +
      `<button type="button" class="dc-btn dc-btn-normal dc-btn-sm" data-gll="${act}">${H(btn)}</button></li>`;
    if (f.free.length) {
      const songs = f.free.filter(x => x[0] === 'song').length, albums = f.free.length - songs;
      rows.push(row('🏷️', txn('td_free_t', f.free.length), tx('td_free', { s: num(songs), a: num(albums) }), tx('td_free_btn', { n: num(f.free.length) }), 'td-free'));
    }
    if (f.none && QF.mode !== 'review') rows.push(row('🔍', txn('td_none_t', f.none), tx('td_none'), tx('td_none_btn'), 'td-none'));
    if (f.guess) rows.push(row('🤔', txn('td_guess_t', f.guess), tx('td_guess'), tx('td_guess_btn', { n: num(f.guess) }), 'td-guess'));
    if (f.mixed) rows.push(row('🔀', tx('td_mixed_t', { name: f.mixed.name, n: num(f.mixed.ids.length) }),
      tx('td_mixed', { list: f.mixed.ids.slice(0, 4).map(nameOf).join(', ') }), tx('td_mixed_btn', { name: f.mixed.name }), 'td-mixed'));
    if (!rows.length) return '';
    return `<section class="gl-sec gl-tidy" id="glTidy" aria-labelledby="glTidyH">
      <div class="gl-sec-head"><div><h3 class="gl-sec-title" id="glTidyH">${H(tx('td_title'))}</h3>
        <p class="gl-sec-sub">${H(tx('td_sub'))}</p></div></div>
      <ul class="gl-tidy-list">${rows.join('')}</ul>
    </section>`;
  }
  function tidyClick(a) {
    if (a === 'td-free' && _tidy && _tidy.free.length) {
      const list = _tidy.free.map(x => [x[0], x[1], x[2]]);
      const go = () => {
        if (typeof genreEditSetMany === 'function') genreEditSetMany(list);
        else for (const x of list) genreEditSet(x[0], x[1], x[2]);
        toast(tx('td_free_done', { n: num(list.length) }));
        checkBadges();
      };
      if (typeof window.dcConfirmBox === 'function') window.dcConfirmBox(txn('td_free_t', list.length), tx('td_free_confirm'), tx('td_free_ok'), go);
      else go();
      return true;
    }
    if (a === 'td-none') { QF.mode = 'fix'; QF.key = ''; renderPage(); scrollToSec('glQf'); return true; }
    if (a === 'td-guess') { QF.mode = 'review'; QF.key = ''; QF.sel = null; renderPage(); scrollToSec('glQf'); return true; }
    if (a === 'td-mixed' && _tidy && _tidy.mixed) { open('artist', _tidy.mixed.p); return true; }
    return false;
  }

  /* ── Keeping things in step ──────────────────────────────────────────── */
  let _spTimer = null;
  window.addEventListener('dc-genres-changed', () => {
    _gen++;
    if (_pageOn) renderPage();
    // The open side panel's strip
    if (_dp && _dp.overlay && _dp.overlay.classList.contains('open')) {
      const el = _dp.overlay.querySelector('.gl-dp');
      if (el && el._glPaint) el._glPaint();
    }
    // Smart playlists with genre rules refill (smartplaylists.js), once
    // after a run of edits
    clearTimeout(_spTimer);
    _spTimer = setTimeout(() => { if (typeof spRefreshAll === 'function') spRefreshAll(); }, 1500);
  });

  // Esc closes the picker / the add window on top (popups.js presses their ✕)
  window.dcGenreLib = {
    open, close: closePick, show, hide, tx, addFromPost, openGenre,
    // For tests and other files: the list itself
    ready: loadList, search: (q, o) => search(q, o), nameOf, entryOfTag,
    // The ⋮ menu (app.js _eaRunAction): { title, artist, album } from a chart row
    openFor: function (kind, d) {
      const artists = typeof splitArtists === 'function' ? splitArtists(d.artist || '') : [d.artist || ''];
      const p = { title: d.title || '', artist: d.artist || '', artists: artists.length ? artists : [d.artist || ''], album: d.album || '' };
      open(kind, p);
    }
  };
  // The picker window is put on the page at start (empty and closed), so the
  // Charts Guide's "open the genre picker" challenge can watch it (guide.js
  // only watches windows that exist when it starts)
  function init() { initPanel(); mountPick(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
