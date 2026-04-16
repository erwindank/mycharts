// ─── i18n SYSTEM — dankcharts.fm ──────────────────────────────────────────────
// Supported languages: en · es · pt-BR · pt-PT
// AI-generated translations (es / pt-BR / pt-PT) — review & polish as needed

let currentLang = 'en';

// ─── DICTIONARY ────────────────────────────────────────────────────────────────
const TRANSLATIONS = {

  // ── ENGLISH ──────────────────────────────────────────────────────────────────
  en: {
    // Navigation
    nav_weekly: 'Weekly',
    nav_monthly: 'Monthly',
    nav_yearly: 'Yearly',
    nav_alltime: 'All-Time',
    nav_rawdata: 'Raw Data',
    nav_graphs: 'Graphs',
    nav_records: 'Records',

    // Chart size bar
    chartsize_label: 'Chart Size:',
    chartview_label: 'Chart View:',
    entries_display: 'Entries Display:',
    all_entries: 'All Entries',

    // Date navigation
    btn_prev: '◄ Prev',
    btn_next: 'Next ►',

    // Sync bar
    sync_connecting: '⟳ Connecting to Google Sheets...',
    sync_now: '↺ SYNC NOW',
    sync_ok: '✓ Synced · {{time}}  ({{n}} plays loaded)',
    sync_ok_cached: '✓ Synced · {{time}}  ({{n}} plays loaded) · cached {{mins}}m ago',
    sync_failed: '✕ Sync failed — check sheet is public · {{error}}',
    sync_empty: '✕ Sheet appears empty or has only a header row.',
    sync_missing_cols: '✕ Could not find required columns (Song Title, Artist, Date and Time) in sheet.',
    sync_warning: '⚠ Synced with warnings — {{total}} rows skipped ({{date}} bad date, {{blank}} blank). Check console for details.',
    sync_no_valid: '✕ No valid plays found — check date format in your sheet.',

    // Stats strip
    stat_total_plays: 'Total Plays',
    stat_unique_songs: 'Unique Songs',
    stat_artists: 'Artists',
    stat_albums: 'Albums',

    // Table headers
    th_rank: 'RANK',
    th_title_artist: 'Title · Artist',
    th_album: 'Album',
    th_plays: 'Plays',
    th_unique_songs: 'Unique Songs',
    th_total_plays: 'Total Plays',
    th_tracks: 'Tracks',
    th_artist: 'Artist',
    th_album_artist: 'Album · Artist',
    th_prev: 'Previous',
    th_weeks: 'Weeks',
    th_months: 'Months',

    // Period labels
    period_this_week: 'This Week',
    period_loading: 'Loading...',
    period_alltime: 'All-Time',
    period_alltime_sub: 'Every play since your first scrobble',
    period_week_of: 'Week of {{date}}',
    period_year_months: 'January – December {{year}}',

    // Section titles (dynamic — used in JS)
    sec_songs_top: '★ Top {{n}} Songs',
    sec_artists_top: '♦ Top {{n}} Artists',
    sec_albums_top: '◈ Top {{n}} Albums',
    sec_songs_all: '★ Songs — All {{n}} Played',
    sec_artists_all: '♦ Artists — All {{n}} Played',
    sec_albums_all: '◈ Albums — All {{n}} Played',

    // Section subtitles (static HTML)
    sub_songs: 'By play count for the selected period',
    sub_artists: 'By total play count across all songs',
    sub_albums: 'By total play count across all tracks',
    sub_dropouts: 'Songs, artists and albums that left the Top {{n}} this week',
    sub_upcoming: 'Next 90 days · Based on your Top 50 All-Time Artists',
    sub_recent: 'Past 180 days · Based on your Top 50 All-Time Artists',

    // Section / UI labels (static HTML)
    sec_off_chart: '⬇ Off the Chart',
    sec_upcoming_title: '🔜 Upcoming Releases',
    sec_recent_title: '🎉 Recent Releases',
    sec_graphs_title: '📈 Historical Graphs',
    sec_raw_data_title: '⊞ Raw Scrobble Data',
    sec_records_title: '🏆 Records & Hall of Fame',
    collapsed_hint: 'collapsed — click + to expand',

    // Upload zone
    upload_title: 'Load Your Listening History',
    upload_desc: 'Drop your CSV file here, or click to browse',

    // Buttons
    btn_export_playlist: '♫ EXPORT PLAYLIST',
    btn_share_image: '📷 Share as Image',
    btn_share: 'SHARE:',
    btn_refresh: '↺ REFRESH',
    btn_prev_page: '◄ PREV',
    btn_next_page: 'NEXT ►',
    btn_download_image: '↓ Download Image',
    btn_cancel: 'Cancel',
    btn_close: '✕ CLOSE',
    btn_add: '+ Add',
    btn_reset: 'Reset',
    btn_reset_zoom: 'Reset Zoom',
    btn_max_all: 'Max All',
    btn_min_all: 'Min All',
    btn_download_txt: '↓ DOWNLOAD .TXT',
    btn_copy_clipboard: '⎘ COPY TO CLIPBOARD',
    btn_soundiiz: '↗ GO TO SOUNDIIZ',
    btn_download_gif: '⬇ GIF',

    // Labels on/off toggle
    labels_off: 'Labels: Off',
    labels_on: 'Labels: On',

    // Empty states
    empty_no_plays: 'No plays found for this period.',
    empty_no_album_data: 'No album data found.',
    empty_no_album_data_csv: 'No album data found — make sure your CSV includes an Album column.',
    empty_no_data: 'No data yet.',
    empty_no_results: 'No results',
    empty_none_this_week: 'None this week',

    // Plurals (unit words)
    plays_one: 'play',
    plays_other: 'plays',
    songs_one: 'song',
    songs_other: 'songs',
    albums_one: 'album',
    albums_other: 'albums',
    artists_one: 'artist',
    artists_other: 'artists',
    weeks_one: 'wk',
    weeks_other: 'wks',
    months_one: 'month',
    months_other: 'months',
    days_one: 'day',
    days_other: 'days',
    tracks_one: 'track',
    tracks_other: 'tracks',

    // Click-to-view hints
    click_view_profile: 'CLICK TO VIEW PROFILE',
    click_view_album: 'CLICK TO VIEW ALBUM',

    // Badge labels
    badge_new: 'NEW',
    badge_new_songs: 'NEW',
    badge_re: 'RE',
    peak_label: 'PEAK',

    // Search
    search_songs_placeholder: 'Search songs or artists…',
    search_artists_placeholder: 'Search artists…',
    search_albums_placeholder: 'Search albums or artists…',
    search_result: '{{n}} result',
    search_results: '{{n}} results',

    // Pagination
    page_label: 'Page {{page}} of {{total}}',

    // Raw data
    raw_song_label: 'Song Title',
    raw_artist_label: 'Artist',
    raw_album_label: 'Album',
    raw_date_label: 'Date',
    raw_search_songs: 'Search songs…',
    raw_search_artists: 'Search artists…',
    raw_search_albums: 'Search albums…',
    raw_search_date: 'e.g. 2024 or Mar 2024…',
    raw_clear: '✕ Clear',
    raw_th_num: '#',
    raw_th_date_time: 'Date & Time',
    raw_th_song_title: 'Song Title',
    raw_th_artist: 'Artist',
    raw_th_album: 'Album',
    raw_showing: 'Showing {{n}} of {{total}} plays',
    raw_total: '{{n}} total plays',
    raw_no_match: 'No records match your filters.',

    // Graphs
    gran_label: 'Granularity',
    gran_daily: 'Daily',
    gran_monthly: 'Monthly',
    gran_yearly: 'Yearly',
    range_label: 'Range',
    range_to: 'to',
    type_label: 'Type',
    speed_label: 'Speed',
    show_label: 'Show',

    // Graph card titles / subtitles
    graph_cumulative_title: '📈 Cumulative Plays Over Time — Artist Comparison',
    graph_volume_title: '📊 Total Play Volume by Period',
    graph_volume_sub: 'How many songs you played each period across all artists',
    graph_volume_comp_title: '📊 Play Volume by Period — Artist Comparison',
    graph_discoveries_title: '✨ New Discoveries per Period',
    graph_discoveries_sub: 'Songs, artists and albums heard for the first time each period',
    graph_race_title: '🏁 Play Count Race',
    graph_race_sub: 'Cumulative plays over time — watch entries compete for the top spot',

    // Race controls
    race_start: '↩ Start',
    race_play: '▶ Play',
    race_pause: '⏸ Pause',
    race_end: '↪ End',
    race_artists: 'Artists',
    race_songs: 'Songs',
    race_albums: 'Albums',

    // Records navigation
    rec_nav_all: 'All',
    rec_nav_all_ones: 'All #1s',
    rec_nav_pak: 'Perfect All Kill',
    rec_nav_appearances: 'Appearances',
    rec_nav_debuts: 'Debuts',
    rec_nav_peak_plays: 'Most Plays',
    rec_nav_milestones: 'Milestones',
    rec_nav_fastest: 'Fastest',
    rec_nav_certs: 'Certifications',
    rec_nav_streaks: 'Streaks',

    // Records section titles (static HTML)
    rec_all_ones_title: '★ All #1s',
    rec_pak_title: '🎯 Perfect All Kill',
    rec_appearances_title: '📈 Most Chart Appearances',
    rec_debuts_title: '🚀 Biggest Debuts',
    rec_peak_plays_title: '🔥 Most Plays in a Period',
    rec_milestones_title: '🎖 Play Count Milestones',
    rec_fastest_title: '⚡ Fastest to Milestone',
    rec_certs_title: '💿 Certifications Leaderboard',
    rec_streaks_title: '🔁 Streak Records',

    // Records section subtitles (static HTML)
    rec_all_ones_sub: 'Artists, albums & tracks that reached the top spot on your charts — including how many times each held #1',
    rec_pak_sub: 'Weeks an artist simultaneously held #1 on the artist, song & album weekly charts',
    rec_appearances_sub: 'Artists, albums & tracks with the most periods spent inside your weekly chart',
    rec_debuts_sub: 'Entries that debuted at the highest chart positions on the weekly chart',
    rec_peak_plays_sub: 'Peak single-period play counts — most plays by a song, artist or album in one week, month or year',
    rec_milestones_sub: 'First artists & songs to reach 100, 500, 1,000, 2,000, 3,000, 5,000+ plays',
    rec_fastest_sub: 'Which artists & songs hit milestones fastest — fewest days from first listen to reaching 1K, 2K, 5K plays',
    rec_certs_sub: 'Artists with the most Gold, Platinum & Diamond certified songs and albums',
    rec_streaks_sub: 'Longest consecutive listening streaks, repeat plays, and daily play records',

    // Records size bar
    rec_size_label: 'Entries Display:',

    // Records intro (dynamic)
    rec_intro_prefix: 'Records based on chart sizes:',
    rec_weekly_top: 'Weekly Top {{n}}',
    rec_monthly_top: 'Monthly Top {{n}}',
    rec_yearly_all: 'Yearly All Entries',
    rec_yearly_top: 'Yearly Top {{n}}',
    rec_data_summary: '{{weeks}} weeks · {{months}} months · {{years}} years of data',

    // Records table headers (dynamic)
    rec_th_songs: 'Songs',
    rec_th_artists: 'Artists',
    rec_th_albums: 'Albums',
    rec_th_weeks_at_1: 'Weeks at #1',
    rec_th_months_at_1: 'Months at #1',
    rec_th_years_at_1: 'Years at #1',
    rec_th_first_at_1: 'First at #1',
    rec_th_date_at_peak: 'Date at Peak',
    rec_th_weeks_on_chart: 'Weeks on Chart',
    rec_th_debut_rank: 'Debut Rank',
    rec_th_week: 'Week',
    rec_th_month: 'Month',
    rec_th_year: 'Year',
    rec_th_pak_weeks: 'PAK Weeks',
    rec_th_most_recent: 'Most Recent',
    rec_th_days_to_1k: 'Days to 1K',
    rec_th_first_play: 'First Play',
    rec_th_reached_1k: 'Reached 1K',
    rec_th_days: 'Days',
    rec_th_date_reached: 'Date Reached',
    rec_th_plays: 'Plays',
    rec_th_consec_days: 'Consecutive Days',
    rec_th_consec_plays: 'Consecutive Plays',
    rec_th_date: 'Date',
    rec_th_artist: 'Artist',
    rec_th_song_cert: 'Song Certs',
    rec_th_album_cert: 'Album Certs',
    rec_th_time_since: 'Time Since First Play',

    // Records dynamic text
    rec_weekly_label: 'Weekly',
    rec_monthly_label: 'Monthly',
    rec_yearly_label: 'Yearly',
    rec_chart_label: 'Chart',
    rec_most_times_1: 'Most Times at #1 on Chart',
    rec_most_appearances: 'Most Weekly Chart Appearances',
    rec_biggest_debuts_weekly: 'Biggest Debut Positions (Weekly)',
    rec_no_data: 'No data yet.',
    rec_no_certifications: 'No certifications yet — keep listening!',
    rec_no_repeat_runs: 'No repeat scrobble runs detected.',
    rec_no_pak: 'No Perfect All Kill weeks recorded with Weekly Top {{n}}. An artist must simultaneously hold #1 on the artist, song and album charts in the same week.',
    rec_top_songs: '★ Top Songs',
    rec_top_artists: '♦ Top Artists',
    rec_top_albums: '◈ Top Albums',
    rec_fastest_to: '{{type}} Fastest to {{n}} Plays',
    rec_songs_fastest_to: '★ Songs Fastest to {{n}} Plays',
    rec_most_plays_single: 'Most Plays in a Single {{unit}}',
    rec_artists_milestones: '♦ Artists — First to Reach Play Milestones',
    rec_songs_milestones: '★ Songs — First to Reach Play Milestones',
    rec_artists_longest_streak: '♦ Artists — Longest Daily Listening Streak',
    rec_songs_longest_streak: '★ Songs — Longest Daily Listening Streak',
    rec_repeat_runs: '🔁 Repeat Scrobble Runs',
    rec_repeat_runs_sub: 'Most consecutive listens to the same song without playing anything else — ranked from longest to shortest',
    rec_artists_with_certs: 'Artists with Most Certifications',
    rec_certs_thresholds: 'Song: Gold={{sg}} · Platinum={{sp}} · Diamond={{sd}} plays | Album: Gold={{ag}} · Platinum={{ap}} · Diamond={{ad}} plays',
    rec_have_reached: '{{n}} {{type}} have reached {{plays}} plays — ranked by fewest days from first to {{plays}}th play',
    rec_has_reached: '1 {{type}} has reached {{plays}} plays — ranked by fewest days from first to {{plays}}th play',
    rec_pak_summary: '{{weeks}} Perfect All Kill {{weekword}} across {{n}} {{artistword}}',
    rec_pak_all_title: 'All PAK Weeks (Most Recent First)',
    rec_have_hit_1: '{{n}} {{type}} have hit #1',
    rec_milestone_day1: 'Day 1',
    rec_milestone_days_after: '{{n}} days after first play',
    rec_days_less_than_1: '< 1 day',

    // Milestones table
    mil_th_plays: 'Plays',
    mil_th_first_artist: 'First Artist',
    mil_th_first_song: 'First Song',
    mil_th_date_reached: 'Date Reached',
    mil_th_time_since: 'Time Since First Play',
    mil_no_data: 'No milestones reached yet.',

    // Dropouts section
    drop_col_songs: '★ Songs',
    drop_col_artists: '♦ Artists',
    drop_col_albums: '◈ Albums',
    drop_none_this_week: 'None this week',

    // Week start day names
    day_sunday: 'Sunday',
    day_monday: 'Monday',
    day_tuesday: 'Tuesday',
    day_wednesday: 'Wednesday',
    day_thursday: 'Thursday',
    day_friday: 'Friday',
    day_saturday: 'Saturday',

    // Month names (long form)
    month_january: 'January',
    month_february: 'February',
    month_march: 'March',
    month_april: 'April',
    month_may: 'May',
    month_june: 'June',
    month_july: 'July',
    month_august: 'August',
    month_september: 'September',
    month_october: 'October',
    month_november: 'November',
    month_december: 'December',

    // Month names (short form)
    month_jan: 'Jan',
    month_feb: 'Feb',
    month_mar: 'Mar',
    month_apr: 'Apr',
    month_may_short: 'May',
    month_jun: 'Jun',
    month_jul: 'Jul',
    month_aug: 'Aug',
    month_sep: 'Sep',
    month_oct: 'Oct',
    month_nov: 'Nov',
    month_dec: 'Dec',

    // Calendar & Date labels
    calendar_label: 'Calendar',
    calendar_picker: 'Date Picker',

    // Masthead
    masthead_est: "★ Erwin's Personal Music Charts · Est. 2016 ★",
    masthead_tagline: 'Your listening history. Your charts. Your legacy.',
    masthead_streaming: 'Streaming since January 9, 2016',

    // Footer
    footer_line1: "dankcharts.fm · Erwin's Personal Music Charts · Est. 2016",
    footer_line2: 'All data stays in your browser. Nothing is uploaded or stored externally.',

    // Modal
    modal_accomplishments: '★ Chart Accomplishments',
    modal_songs_on_chart: '♦ Songs on Chart',
    modal_albums_on_chart: '◈ Albums on Chart',
    modal_tracks_on_chart: '♦ Tracks on Songs Chart',
    modal_chart_run_title: '📊 Chart Run History',

    // IG Share modal
    ig_share_title: 'Share as Image',
    ig_preview_label: 'Preview',
    ig_format: 'Format',
    ig_post: '📷 Post (1:1)',
    ig_story: '📱 Story (9:16)',
    ig_font_size: 'Font Size',
    ig_rows: 'Rows',
    ig_branding: 'Branding',
    ig_date: 'Date',
    ig_show_hide: 'Show / Hide',
    ig_movement: 'Movement (▲▼ NEW RE)',
    ig_peak_badge: 'Peak Badge (PEAK #1)',
    ig_weeks_on_chart: 'Weeks on Chart',
    ig_play_count: 'Play Count',
    ig_artist_subtitle: 'Artist / Subtitle',
    ig_date_period: 'Date / Period',
    ig_footer_branding: 'Footer Branding',
    ig_cover_art: 'Cover Art / Photo',
    ig_week_date_sub: 'Week Date Subtitle',
    ig_section_summary: '📈 Section Summary Stats',
    ig_artist_sublabel: 'Artist / Sub-label',
    ig_slide_auto: 'Slide to override · leftmost = Auto',
    ig_source: 'Source:',

    // CR modal
    cr_chart_run: '📊 Chart Run',
    cr_rank_history: 'Ranking history & chart appearances over time',
    cr_entry_post: '🎵 Entry Post',
    cr_range: 'Range',
    cr_year_only: 'Year Only',
    cr_up_to_year: 'Up to Year',
    cr_ytd: '{{year}} YTD',
    cr_up_to_this_week: 'Up to This Week',
    cr_up_to_this_month: 'Up to This Month',
    cr_year_only_label: '{{year}} Only',
    cr_up_to_year_label: 'Up to {{year}}',
    cr_all_time: 'All-Time',
    cr_no_history: 'No chart history for this range.',
    cr_no_history_yet: 'No chart history yet.',
    cr_share_btn: '📸 Share',
    cr_yearly_label: '🗓️ Yearly',
    cr_monthly_label: '📊 Monthly',
    cr_weekly_label: '📈 Weekly',
    cr_on_chart: 'on Chart',
    cr_at_1: 'at #1',
    cr_in_top5: 'in Top 5',
    cr_in_top10: 'in Top 10',
    cr_peak_plays_month: 'Peak Plays in a Month',
    cr_peak_days_month: 'Peak Days in a Month',
    cr_months_peak_year: 'Months Peak (Best Year)',
    cr_days_peak_year: 'Days Peak (Best Year)',
    cr_range_note: 'Range for the chart run boxes shown',
    cr_include_runs: 'Include Chart Runs',
    cr_yearly_run: '🗓️ Yearly Chart Run + Stats',
    cr_monthly_run: '📊 Monthly Chart Run + Stats',
    cr_weekly_run: '📈 Weekly Chart Run + Stats',
    cr_fonts: 'Fonts',
    cr_title_font: 'Title',
    cr_labels_font: 'Labels',
    cr_cover_art: 'Cover Art/Photo',
    cr_brand_px: 'Brand px',
    cr_song_artist_px: 'Song/Artist px',
    cr_week_date_px: 'Week Date px',
    cr_section_px: 'Section px',
    cr_boxes_px: 'Boxes px',
    cr_desc_text: 'Description Text',
    cr_auto: 'Auto',
    cr_shuffle: 'Shuffle',
    cr_use_custom: 'Use Custom',
    cr_desc_hint: 'Auto uses data up to the currently viewed date. Shuffle cycles generated variants.',
    cr_desc_placeholder: 'Type your own description...',

    // Entry post
    ep_chart_story: 'Chart Story Description',
    ep_artist_album: 'Artist / Album Info',
    ep_movement_bl: 'Movement (Bottom Left)',
    ep_branding: 'Branding',
    ep_chart_name: 'Chart Name',
    ep_week_date: 'Week Date',
    ep_image: 'Image',
    ep_title: 'Title',
    ep_artist: 'Artist',
    ep_album: 'Album',
    ep_description: 'Description',
    ep_movement: 'Movement',
    ep_position: 'Position #',
    ep_story_y: 'Story Y',
    ep_font_sizes: 'Font Sizes',

    // Export modal
    export_title: '♫ Export Playlist',
    export_suggested_names: 'SUGGESTED PLAYLIST NAMES — click to copy',
    export_track_order: 'TRACK ORDER',
    export_no1_first: '▲ #1 First',
    export_no1_last: '▼ #1 Last',
    export_how_to_title: 'How to import in Soundiiz:',
    export_format_used: 'Format used: Artist - Title (one track per line).',
    export_copied: '✓ COPIED!',
  },

  // ── SPANISH ───────────────────────────────────────────────────────────────────
  es: {
    // Navigation
    nav_weekly: 'Semanal',
    nav_monthly: 'Mensual',
    nav_yearly: 'Anual',
    nav_alltime: 'Histórico',
    nav_rawdata: 'BASE DE DATOS',
    nav_graphs: 'Gráficas',
    nav_records: 'Récords',

    // Chart size bar
    chartsize_label: 'Tamaño del Chart:',
    chartview_label: 'Vista del Chart:',
    entries_display: 'Mostrar Entradas:',
    all_entries: 'Todas las Entradas',

    // Date navigation
    btn_prev: '◄ Anterior',
    btn_next: 'Siguiente ►',

    // Sync bar
    sync_connecting: '⟳ Conectando con Google Sheets...',
    sync_now: '↺ SINCRONIZAR',
    sync_ok: '✓ Sincronizado · {{time}}  ({{n}} reproducciones cargadas)',
    sync_ok_cached: '✓ Sincronizado · {{time}}  ({{n}} reproducciones cargadas) · caché hace {{mins}}m',
    sync_failed: '✕ Error de sincronización — verifica que la hoja sea pública · {{error}}',
    sync_empty: '✕ La hoja parece vacía o solo tiene una fila de encabezado.',
    sync_missing_cols: '✕ No se encontraron las columnas requeridas (Título de canción, Artista, Fecha y hora) en la hoja.',
    sync_warning: '⚠ Sincronizado con advertencias — {{total}} filas omitidas ({{date}} fecha inválida, {{blank}} en blanco). Ver consola para detalles.',
    sync_no_valid: '✕ No se encontraron reproducciones válidas — verifica el formato de fecha en tu hoja.',

    // Stats strip
    stat_total_plays: 'Reproducciones',
    stat_unique_songs: 'Canciones Únicas',
    stat_artists: 'Artistas',
    stat_albums: 'Álbumes',

    // Table headers
    th_rank: 'Puesto',
    th_title_artist: 'Título · Artista',
    th_album: 'Álbum',
    th_plays: 'Reproducciones',
    th_unique_songs: 'Canciones Únicas',
    th_total_plays: 'Total Repros',
    th_tracks: 'Pistas',
    th_artist: 'Artista',
    th_album_artist: 'Álbum · Artista',
    th_prev: 'Puesto Anterior',
    th_weeks: 'Semanas',
    th_months: 'Meses',

    // Period labels
    period_this_week: 'Esta Semana',
    period_loading: 'Cargando...',
    period_alltime: 'Histórico',
    period_alltime_sub: 'Cada reproducción desde tu primer scrobble',
    period_week_of: 'Semana del {{date}}',
    period_year_months: 'Enero – Diciembre {{year}}',

    // Section titles (dynamic)
    sec_songs_top: '★ Top {{n}} Canciones',
    sec_artists_top: '♦ Top {{n}} Artistas',
    sec_albums_top: '◈ Top {{n}} Álbumes',
    sec_songs_all: '★ Canciones — Las {{n}} Reproducidas',
    sec_artists_all: '♦ Artistas — Los {{n}} Reproducidos',
    sec_albums_all: '◈ Álbumes — Los {{n}} Reproducidos',

    // Section subtitles
    sub_songs: 'Por reproducciones en el período seleccionado',
    sub_artists: 'Por total de reproducciones en todas las canciones',
    sub_albums: 'Por total de reproducciones en todas las pistas',
    sub_dropouts: 'Canciones, artistas y álbumes que salieron del Top {{n}} esta semana',
    sub_upcoming: 'Próximos 90 días · Basado en tus Top 50 Artistas de todos los tiempos',
    sub_recent: 'Últimos 180 días · Basado en tus Top 50 Artistas de todos los tiempos',

    // Section labels
    sec_off_chart: '⬇ Fuera del Chart',
    sec_upcoming_title: '🔜 Próximos Lanzamientos',
    sec_recent_title: '🎉 Lanzamientos Recientes',
    sec_graphs_title: '📈 Gráficas Históricas',
    sec_raw_data_title: '⊞ Datos Brutos de Scrobbles',
    sec_records_title: '🏆 Récords y Salón de la Fama',
    collapsed_hint: 'contraído — clic en + para expandir',

    // Upload zone
    upload_title: 'Carga tu Historial de Escucha',
    upload_desc: 'Suelta tu archivo CSV aquí, o haz clic para buscar',

    // Buttons
    btn_export_playlist: '♫ EXPORTAR PLAYLIST',
    btn_share_image: '📷 Compartir como Imagen',
    btn_share: 'COMPARTIR:',
    btn_refresh: '↺ ACTUALIZAR',
    btn_prev_page: '◄ ANT.',
    btn_next_page: 'SIG. ►',
    btn_download_image: '↓ Descargar Imagen',
    btn_cancel: 'Cancelar',
    btn_close: '✕ CERRAR',
    btn_add: '+ Añadir',
    btn_reset: 'Restablecer',
    btn_reset_zoom: 'Restablecer Zoom',
    btn_max_all: 'Máx. Todo',
    btn_min_all: 'Mín. Todo',
    btn_download_txt: '↓ DESCARGAR .TXT',
    btn_copy_clipboard: '⎘ COPIAR AL PORTAPAPELES',
    btn_soundiiz: '↗ IR A SOUNDIIZ',
    btn_download_gif: '⬇ GIF',

    // Labels on/off toggle
    labels_off: 'Etiquetas: No',
    labels_on: 'Etiquetas: Sí',

    // Empty states
    empty_no_plays: 'No se encontraron reproducciones para este período.',
    empty_no_album_data: 'No se encontraron datos de álbumes.',
    empty_no_album_data_csv: 'No se encontraron datos de álbumes — asegúrate de que tu CSV incluya una columna de Álbum.',
    empty_no_data: 'Sin datos aún.',
    empty_no_results: 'Sin resultados',
    empty_none_this_week: 'Ninguna esta semana',

    // Plurals
    plays_one: 'reproducción',
    plays_other: 'reproducciones',
    songs_one: 'canción',
    songs_other: 'canciones',
    albums_one: 'álbum',
    albums_other: 'álbumes',
    artists_one: 'artista',
    artists_other: 'artistas',
    weeks_one: 'sem.',
    weeks_other: 'sems.',
    months_one: 'mes',
    months_other: 'meses',
    days_one: 'día',
    days_other: 'días',
    tracks_one: 'pista',
    tracks_other: 'pistas',

    // Click-to-view hints
    click_view_profile: 'CLIC PARA VER PERFIL',
    click_view_album: 'CLIC PARA VER ÁLBUM',

    // Badge labels
    badge_new: 'NUEVO',
    badge_new_songs: 'NUEVA',
    badge_re: 'RE',
    peak_label: 'LOGRO',

    // Search
    search_songs_placeholder: 'Buscar canciones o artistas…',
    search_artists_placeholder: 'Buscar artistas…',
    search_albums_placeholder: 'Buscar álbumes o artistas…',
    search_result: '{{n}} resultado',
    search_results: '{{n}} resultados',

    // Pagination
    page_label: 'Pág. {{page}} de {{total}}',

    // Raw data
    raw_song_label: 'Título de Canción',
    raw_artist_label: 'Artista',
    raw_album_label: 'Álbum',
    raw_date_label: 'Fecha',
    raw_search_songs: 'Buscar canciones…',
    raw_search_artists: 'Buscar artistas…',
    raw_search_albums: 'Buscar álbumes…',
    raw_search_date: 'ej. 2024 o Mar 2024…',
    raw_clear: '✕ Limpiar',
    raw_th_num: '#',
    raw_th_date_time: 'Fecha y Hora',
    raw_th_song_title: 'Título de Canción',
    raw_th_artist: 'Artista',
    raw_th_album: 'Álbum',
    raw_showing: 'Mostrando {{n}} de {{total}} reproducciones',
    raw_total: '{{n}} reproducciones en total',
    raw_no_match: 'Ningún registro coincide con tus filtros.',

    // Graphs
    gran_label: 'Granularidad',
    gran_daily: 'Diario',
    gran_monthly: 'Mensual',
    gran_yearly: 'Anual',
    range_label: 'Rango',
    range_to: 'hasta',
    type_label: 'Tipo',
    speed_label: 'Velocidad',
    show_label: 'Mostrar',

    // Graph card titles / subtitles
    graph_cumulative_title: '📈 Reproducciones Acumuladas — Comparación de Artistas',
    graph_volume_title: '📊 Volumen Total de Reproducciones por Período',
    graph_volume_sub: 'Cuántas canciones escuchaste cada período en todos los artistas',
    graph_volume_comp_title: '📊 Volumen de Reproducciones por Período — Comparación de Artistas',
    graph_discoveries_title: '✨ Nuevos Descubrimientos por Período',
    graph_discoveries_sub: 'Canciones, artistas y álbumes escuchados por primera vez cada período',
    graph_race_title: '🏁 Carrera de Reproducciones',
    graph_race_sub: 'Reproducciones acumuladas — mira cómo compiten las entradas por el primer lugar',

    // Race controls
    race_start: '↩ Inicio',
    race_play: '▶ Reproducir',
    race_pause: '⏸ Pausar',
    race_end: '↪ Fin',
    race_artists: 'Artistas',
    race_songs: 'Canciones',
    race_albums: 'Álbumes',

    // Records navigation
    rec_nav_all: 'Todos',
    rec_nav_all_ones: 'Todos los #1',
    rec_nav_pak: 'Perfect All Kill',
    rec_nav_appearances: 'Apariciones',
    rec_nav_debuts: 'Debuts',
    rec_nav_peak_plays: 'Más Repros',
    rec_nav_milestones: 'Hitos',
    rec_nav_fastest: 'Más Rápido',
    rec_nav_certs: 'Certificaciones',
    rec_nav_streaks: 'Rachas',

    // Records section titles (HTML)
    rec_all_ones_title: '★ Todos los #1',
    rec_pak_title: '🎯 Perfect All Kill',
    rec_appearances_title: '📈 Más Apariciones en el Chart',
    rec_debuts_title: '🚀 Mejores Debuts',
    rec_peak_plays_title: '🔥 Más Reproducciones en un Período',
    rec_milestones_title: '🎖 Hitos de Reproducciones',
    rec_fastest_title: '⚡ Más Rápido al Hito',
    rec_certs_title: '💿 Tabla de Certificaciones',
    rec_streaks_title: '🔁 Récords de Rachas',

    // Records subtitles
    rec_all_ones_sub: 'Artistas, álbumes y canciones que alcanzaron el #1 en tus charts — incluyendo cuántas veces lo tuvieron',
    rec_pak_sub: 'Semanas en las que un artista tuvo simultáneamente el #1 en artista, canción y álbum',
    rec_appearances_sub: 'Artistas, álbumes y canciones con más períodos dentro de tu chart semanal',
    rec_debuts_sub: 'Entradas que debutaron en las posiciones más altas del chart semanal',
    rec_peak_plays_sub: 'Picos de reproducciones en un único período — más repros de una canción, artista o álbum en una semana, mes o año',
    rec_milestones_sub: 'Primeros artistas y canciones en alcanzar 100, 500, 1.000, 2.000, 3.000, 5.000+ reproducciones',
    rec_fastest_sub: 'Qué artistas y canciones alcanzaron los hitos más rápido — menos días desde la primera escucha hasta 1K, 2K, 5K repros',
    rec_certs_sub: 'Artistas con más canciones y álbumes certificados en Oro, Platino y Diamante',
    rec_streaks_sub: 'Rachas de escucha consecutiva más largas, repeticiones seguidas y récords diarios',

    // Records size bar
    rec_size_label: 'Mostrar Entradas:',

    // Records intro
    rec_intro_prefix: 'Récords basados en tamaños de chart:',
    rec_weekly_top: 'Semanal Top {{n}}',
    rec_monthly_top: 'Mensual Top {{n}}',
    rec_yearly_all: 'Anual Todas las Entradas',
    rec_yearly_top: 'Anual Top {{n}}',
    rec_data_summary: '{{weeks}} semanas · {{months}} meses · {{years}} años de datos',

    // Records table headers
    rec_th_songs: 'Canciones',
    rec_th_artists: 'Artistas',
    rec_th_albums: 'Álbumes',
    rec_th_weeks_at_1: 'Semanas en #1',
    rec_th_months_at_1: 'Meses en #1',
    rec_th_years_at_1: 'Años en #1',
    rec_th_first_at_1: 'Primero en #1',
    rec_th_date_at_peak: 'Fecha en Pico',
    rec_th_weeks_on_chart: 'Semanas en Chart',
    rec_th_debut_rank: 'Pos. de Debut',
    rec_th_week: 'Semana',
    rec_th_month: 'Mes',
    rec_th_year: 'Año',
    rec_th_pak_weeks: 'Semanas PAK',
    rec_th_most_recent: 'Más Reciente',
    rec_th_days_to_1k: 'Días hasta 1K',
    rec_th_first_play: 'Primera Repro.',
    rec_th_reached_1k: 'Alcanzó 1K',
    rec_th_days: 'Días',
    rec_th_date_reached: 'Fecha Alcanzada',
    rec_th_plays: 'Repros.',
    rec_th_consec_days: 'Días Consecutivos',
    rec_th_consec_plays: 'Repros. Consecutivas',
    rec_th_date: 'Fecha',
    rec_th_artist: 'Artista',
    rec_th_song_cert: 'Certs. Canciones',
    rec_th_album_cert: 'Certs. Álbumes',
    rec_th_time_since: 'Tiempo desde 1ª Repro.',

    // Records dynamic text
    rec_weekly_label: 'Semanal',
    rec_monthly_label: 'Mensual',
    rec_yearly_label: 'Anual',
    rec_chart_label: 'Chart',
    rec_most_times_1: 'Más Veces en #1 del Chart',
    rec_most_appearances: 'Más Apariciones en el Chart Semanal',
    rec_biggest_debuts_weekly: 'Mejores Debuts (Semanal)',
    rec_no_data: 'Sin datos aún.',
    rec_no_certifications: 'Sin certificaciones aún — ¡sigue escuchando!',
    rec_no_repeat_runs: 'No se detectaron rachas de scrobble repetido.',
    rec_no_pak: 'No hay semanas de Perfect All Kill con Semanal Top {{n}}. Un artista debe tener simultáneamente el #1 en artista, canción y álbum en la misma semana.',
    rec_top_songs: '★ Top Canciones',
    rec_top_artists: '♦ Top Artistas',
    rec_top_albums: '◈ Top Álbumes',
    rec_fastest_to: '{{type}} Más Rápido{{s}} en Llegar a {{n}} Repros.',
    rec_songs_fastest_to: '★ Canciones Más Rápidas en Llegar a {{n}} Repros.',
    rec_most_plays_single: 'Más Reproducciones en una Sola {{unit}}',
    rec_artists_milestones: '♦ Artistas — Primeros en Alcanzar Hitos',
    rec_songs_milestones: '★ Canciones — Primeras en Alcanzar Hitos',
    rec_artists_longest_streak: '♦ Artistas — Racha Diaria de Escucha Más Larga',
    rec_songs_longest_streak: '★ Canciones — Racha Diaria de Escucha Más Larga',
    rec_repeat_runs: '🔁 Rachas de Scrobble Repetido',
    rec_repeat_runs_sub: 'Más escuchas consecutivas de la misma canción sin reproducir otra — ordenadas de mayor a menor',
    rec_artists_with_certs: 'Artistas con Más Certificaciones',
    rec_certs_thresholds: 'Canción: Oro={{sg}} · Platino={{sp}} · Diamante={{sd}} repros. | Álbum: Oro={{ag}} · Platino={{ap}} · Diamante={{ad}} repros.',
    rec_have_reached: '{{n}} {{type}} han alcanzado {{plays}} repros. — ordenados por menos días desde la primera hasta la {{plays}}ª repro.',
    rec_has_reached: '1 {{type}} ha alcanzado {{plays}} repros. — ordenado por menos días desde la primera hasta la {{plays}}ª repro.',
    rec_pak_summary: '{{weeks}} {{weekword}} de Perfect All Kill en {{n}} {{artistword}}',
    rec_pak_all_title: 'Todas las Semanas PAK (Más Recientes Primero)',
    rec_have_hit_1: '{{n}} {{type}} han llegado al #1',
    rec_milestone_day1: 'Día 1',
    rec_milestone_days_after: '{{n}} días después de la primera repro.',
    rec_days_less_than_1: '< 1 día',

    // Milestones table
    mil_th_plays: 'Repros.',
    mil_th_first_artist: 'Primer Artista',
    mil_th_first_song: 'Primera Canción',
    mil_th_date_reached: 'Fecha Alcanzada',
    mil_th_time_since: 'Tiempo desde 1ª Repro.',
    mil_no_data: 'No se alcanzaron hitos aún.',

    // Dropouts
    drop_col_songs: '★ Canciones',
    drop_col_artists: '♦ Artistas',
    drop_col_albums: '◈ Álbumes',
    drop_none_this_week: 'Ninguna esta semana',

    // Week days
    day_sunday: 'Domingo',
    day_monday: 'Lunes',
    day_tuesday: 'Martes',
    day_wednesday: 'Miércoles',
    day_thursday: 'Jueves',
    day_friday: 'Viernes',
    day_saturday: 'Sábado',

    // Month names (long form)
    month_january: 'Enero',
    month_february: 'Febrero',
    month_march: 'Marzo',
    month_april: 'Abril',
    month_may: 'Mayo',
    month_june: 'Junio',
    month_july: 'Julio',
    month_august: 'Agosto',
    month_september: 'Septiembre',
    month_october: 'Octubre',
    month_november: 'Noviembre',
    month_december: 'Diciembre',

    // Month names (short form)
    month_jan: 'Ene',
    month_feb: 'Feb',
    month_mar: 'Mar',
    month_apr: 'Abr',
    month_may_short: 'May',
    month_jun: 'Jun',
    month_jul: 'Jul',
    month_aug: 'Ago',
    month_sep: 'Sep',
    month_oct: 'Oct',
    month_nov: 'Nov',
    month_dec: 'Dic',

    // Calendar & Date labels
    calendar_label: 'Calendario',
    calendar_picker: 'Selector de Fecha',

    // Masthead
    masthead_est: "★ Charts Personales de Música de Erwin · Est. 2016 ★",
    masthead_tagline: 'Tu historial de escucha. Tus charts. Tu legado.',
    masthead_streaming: 'Escuchando desde el 9 de enero de 2016',

    // Footer
    footer_line1: "dankcharts.fm · Charts Personales de Música de Erwin · Est. 2016",
    footer_line2: 'Todos los datos permanecen en tu navegador. No se sube ni almacena nada externamente.',

    // Modal
    modal_accomplishments: '★ Logros en el Chart',
    modal_songs_on_chart: '♦ Canciones en el Chart',
    modal_albums_on_chart: '◈ Álbumes en el Chart',
    modal_tracks_on_chart: '♦ Pistas en el Chart de Canciones',
    modal_chart_run_title: '📊 Historial del Chart Run',

    // IG Share modal
    ig_share_title: 'Compartir como Imagen',
    ig_preview_label: 'Vista Previa',
    ig_format: 'Formato',
    ig_post: '📷 Post (1:1)',
    ig_story: '📱 Story (9:16)',
    ig_font_size: 'Tamaño de Fuente',
    ig_rows: 'Filas',
    ig_branding: 'Marca',
    ig_date: 'Fecha',
    ig_show_hide: 'Mostrar / Ocultar',
    ig_movement: 'Movimiento (▲▼ NUEVO RE)',
    ig_peak_badge: 'Badge Pico (PICO #1)',
    ig_weeks_on_chart: 'Semanas en Chart',
    ig_play_count: 'Reproducciones',
    ig_artist_subtitle: 'Artista / Subtítulo',
    ig_date_period: 'Fecha / Período',
    ig_footer_branding: 'Pie de Marca',
    ig_cover_art: 'Portada / Foto',
    ig_week_date_sub: 'Subtítulo de Fecha',
    ig_section_summary: '📈 Resumen de Estadísticas',
    ig_artist_sublabel: 'Artista / Sub-etiqueta',
    ig_slide_auto: 'Desliza para ajustar · izquierda = Auto',
    ig_source: 'Fuente:',

    // CR modal
    cr_chart_run: '📊 Chart Run',
    cr_rank_history: 'Historial de posiciones y apariciones en el chart',
    cr_entry_post: '🎵 Post de Entrada',
    cr_range: 'Rango',
    cr_year_only: 'Solo el Año',
    cr_up_to_year: 'Hasta el Año',
    cr_ytd: '{{year}} Acum.',
    cr_up_to_this_week: 'Hasta Esta Semana',
    cr_up_to_this_month: 'Hasta Este Mes',
    cr_year_only_label: 'Solo {{year}}',
    cr_up_to_year_label: 'Hasta {{year}}',
    cr_all_time: 'Histórico',
    cr_no_history: 'Sin historial de chart para este rango.',
    cr_no_history_yet: 'Sin historial de chart todavía.',
    cr_share_btn: '📸 Compartir',
    cr_yearly_label: '🗓️ Anual',
    cr_monthly_label: '📊 Mensual',
    cr_weekly_label: '📈 Semanal',
    cr_on_chart: 'en el Chart',
    cr_at_1: 'en el #1',
    cr_in_top5: 'en el Top 5',
    cr_in_top10: 'en el Top 10',
    cr_peak_plays_month: 'Pico de Plays en un Mes',
    cr_peak_days_month: 'Pico de Días en un Mes',
    cr_months_peak_year: 'Pico de Meses (Mejor Año)',
    cr_days_peak_year: 'Pico de Días (Mejor Año)',
    cr_range_note: 'Rango para las cajas de chart run mostradas',
    cr_include_runs: 'Incluir Chart Runs',
    cr_yearly_run: '🗓️ Chart Run Anual + Estadísticas',
    cr_monthly_run: '📊 Chart Run Mensual + Estadísticas',
    cr_weekly_run: '📈 Chart Run Semanal + Estadísticas',
    cr_fonts: 'Fuentes',
    cr_title_font: 'Título',
    cr_labels_font: 'Etiquetas',
    cr_cover_art: 'Portada/Foto',
    cr_brand_px: 'Marca px',
    cr_song_artist_px: 'Canción/Artista px',
    cr_week_date_px: 'Fecha Semanal px',
    cr_section_px: 'Sección px',
    cr_boxes_px: 'Cajas px',
    cr_desc_text: 'Texto de Descripción',
    cr_auto: 'Auto',
    cr_shuffle: 'Aleatorio',
    cr_use_custom: 'Usar Personalizado',
    cr_desc_hint: 'Auto usa datos hasta la fecha visualizada. Aleatorio genera variantes.',
    cr_desc_placeholder: 'Escribe tu propia descripción...',

    // Entry post
    ep_chart_story: 'Descripción de la Historia del Chart',
    ep_artist_album: 'Info de Artista / Álbum',
    ep_movement_bl: 'Movimiento (Abajo Izquierda)',
    ep_branding: 'Marca',
    ep_chart_name: 'Nombre del Chart',
    ep_week_date: 'Fecha de Semana',
    ep_image: 'Imagen',
    ep_title: 'Título',
    ep_artist: 'Artista',
    ep_album: 'Álbum',
    ep_description: 'Descripción',
    ep_movement: 'Movimiento',
    ep_position: 'Posición #',
    ep_story_y: 'Story Y',
    ep_font_sizes: 'Tamaños de Fuente',

    // Export modal
    export_title: '♫ Exportar Playlist',
    export_suggested_names: 'NOMBRES SUGERIDOS PARA LA PLAYLIST — clic para copiar',
    export_track_order: 'ORDEN DE PISTAS',
    export_no1_first: '▲ #1 Primero',
    export_no1_last: '▼ #1 Último',
    export_how_to_title: 'Cómo importar en Soundiiz:',
    export_format_used: 'Formato usado: Artista - Título (una pista por línea).',
    export_copied: '✓ ¡COPIADO!',
  },

  // ── PORTUGUESE — BRAZIL ───────────────────────────────────────────────────────
  'pt-BR': {
    // Navigation
    nav_weekly: 'Semanal',
    nav_monthly: 'Mensal',
    nav_yearly: 'Anual',
    nav_alltime: 'Histórico',
    nav_rawdata: 'Dados Brutos',
    nav_graphs: 'Gráficos',
    nav_records: 'Recordes',

    // Chart size bar
    chartsize_label: 'Tamanho do Chart:',
    chartview_label: 'Visão do Chart:',
    entries_display: 'Exibir Entradas:',
    all_entries: 'Todas as Entradas',

    // Date navigation
    btn_prev: '◄ Anterior',
    btn_next: 'Próximo ►',

    // Sync bar
    sync_connecting: '⟳ Conectando ao Google Sheets...',
    sync_now: '↺ SINCRONIZAR',
    sync_ok: '✓ Sincronizado · {{time}}  ({{n}} reproduções carregadas)',
    sync_ok_cached: '✓ Sincronizado · {{time}}  ({{n}} reproduções carregadas) · cache há {{mins}}m',
    sync_failed: '✕ Falha na sincronização — verifique se a planilha é pública · {{error}}',
    sync_empty: '✕ A planilha parece vazia ou só tem uma linha de cabeçalho.',
    sync_missing_cols: '✕ Não foi possível encontrar as colunas obrigatórias (Título da música, Artista, Data e Hora) na planilha.',
    sync_warning: '⚠ Sincronizado com avisos — {{total}} linhas ignoradas ({{date}} data inválida, {{blank}} em branco). Veja o console para detalhes.',
    sync_no_valid: '✕ Nenhuma reprodução válida encontrada — verifique o formato de data na sua planilha.',

    // Stats strip
    stat_total_plays: 'Reproduções',
    stat_unique_songs: 'Músicas Únicas',
    stat_artists: 'Artistas',
    stat_albums: 'Álbuns',

    // Table headers
    th_rank: 'Posição',
    th_title_artist: 'Título · Artista',
    th_album: 'Álbum',
    th_plays: 'Reproduções',
    th_unique_songs: 'Músicas Únicas',
    th_total_plays: 'Total Repros.',
    th_tracks: 'Faixas',
    th_artist: 'Artista',
    th_album_artist: 'Álbum · Artista',
    th_prev: 'Anterior',
    th_weeks: 'Semanas',
    th_months: 'Meses',

    // Period labels
    period_this_week: 'Esta Semana',
    period_loading: 'Carregando...',
    period_alltime: 'Histórico',
    period_alltime_sub: 'Cada reprodução desde o seu primeiro scrobble',
    period_week_of: 'Semana de {{date}}',
    period_year_months: 'Janeiro – Dezembro {{year}}',

    // Section titles (dynamic)
    sec_songs_top: '★ Top {{n}} Músicas',
    sec_artists_top: '♦ Top {{n}} Artistas',
    sec_albums_top: '◈ Top {{n}} Álbuns',
    sec_songs_all: '★ Músicas — Todas as {{n}} Reproduzidas',
    sec_artists_all: '♦ Artistas — Todos os {{n}} Reproduzidos',
    sec_albums_all: '◈ Álbuns — Todos os {{n}} Reproduzidos',

    // Section subtitles
    sub_songs: 'Por reproduções no período selecionado',
    sub_artists: 'Por total de reproduções em todas as músicas',
    sub_albums: 'Por total de reproduções em todas as faixas',
    sub_dropouts: 'Músicas, artistas e álbuns que saíram do Top {{n}} esta semana',
    sub_upcoming: 'Próximos 90 dias · Baseado nos seus Top 50 Artistas de Todos os Tempos',
    sub_recent: 'Últimos 180 dias · Baseado nos seus Top 50 Artistas de Todos os Tempos',

    // Section labels
    sec_off_chart: '⬇ Fora do Chart',
    sec_upcoming_title: '🔜 Próximos Lançamentos',
    sec_recent_title: '🎉 Lançamentos Recentes',
    sec_graphs_title: '📈 Gráficos Históricos',
    sec_raw_data_title: '⊞ Dados Brutos de Scrobbles',
    sec_records_title: '🏆 Recordes e Salão da Fama',
    collapsed_hint: 'recolhido — clique em + para expandir',

    // Upload zone
    upload_title: 'Carregue seu Histórico de Escuta',
    upload_desc: 'Solte seu arquivo CSV aqui, ou clique para procurar',

    // Buttons
    btn_export_playlist: '♫ EXPORTAR PLAYLIST',
    btn_share_image: '📷 Compartilhar como Imagem',
    btn_share: 'COMPARTILHAR:',
    btn_refresh: '↺ ATUALIZAR',
    btn_prev_page: '◄ ANT.',
    btn_next_page: 'PRÓX. ►',
    btn_download_image: '↓ Baixar Imagem',
    btn_cancel: 'Cancelar',
    btn_close: '✕ FECHAR',
    btn_add: '+ Adicionar',
    btn_reset: 'Redefinir',
    btn_reset_zoom: 'Redefinir Zoom',
    btn_max_all: 'Máx. Tudo',
    btn_min_all: 'Mín. Tudo',
    btn_download_txt: '↓ BAIXAR .TXT',
    btn_copy_clipboard: '⎘ COPIAR PARA ÁREA DE TRANSFERÊNCIA',
    btn_soundiiz: '↗ IR PARA O SOUNDIIZ',
    btn_download_gif: '⬇ GIF',

    // Labels on/off toggle
    labels_off: 'Rótulos: Não',
    labels_on: 'Rótulos: Sim',

    // Empty states
    empty_no_plays: 'Nenhuma reprodução encontrada para este período.',
    empty_no_album_data: 'Nenhum dado de álbum encontrado.',
    empty_no_album_data_csv: 'Nenhum dado de álbum encontrado — verifique se seu CSV inclui uma coluna de Álbum.',
    empty_no_data: 'Sem dados ainda.',
    empty_no_results: 'Sem resultados',
    empty_none_this_week: 'Nenhuma esta semana',

    // Plurals
    plays_one: 'reprodução',
    plays_other: 'reproduções',
    songs_one: 'música',
    songs_other: 'músicas',
    albums_one: 'álbum',
    albums_other: 'álbuns',
    artists_one: 'artista',
    artists_other: 'artistas',
    weeks_one: 'sem.',
    weeks_other: 'sems.',
    months_one: 'mês',
    months_other: 'meses',
    days_one: 'dia',
    days_other: 'dias',
    tracks_one: 'faixa',
    tracks_other: 'faixas',

    // Click-to-view hints
    click_view_profile: 'CLIQUE PARA VER PERFIL',
    click_view_album: 'CLIQUE PARA VER ÁLBUM',

    // Badge labels
    badge_new: 'NOVO',
    badge_new_songs: 'NOVA',
    badge_re: 'RE',
    peak_label: 'PICO',

    // Search
    search_songs_placeholder: 'Buscar músicas ou artistas…',
    search_artists_placeholder: 'Buscar artistas…',
    search_albums_placeholder: 'Buscar álbuns ou artistas…',
    search_result: '{{n}} resultado',
    search_results: '{{n}} resultados',

    // Pagination
    page_label: 'Pág. {{page}} de {{total}}',

    // Raw data
    raw_song_label: 'Título da Música',
    raw_artist_label: 'Artista',
    raw_album_label: 'Álbum',
    raw_date_label: 'Data',
    raw_search_songs: 'Buscar músicas…',
    raw_search_artists: 'Buscar artistas…',
    raw_search_albums: 'Buscar álbuns…',
    raw_search_date: 'ex. 2024 ou Mar 2024…',
    raw_clear: '✕ Limpar',
    raw_th_num: '#',
    raw_th_date_time: 'Data e Hora',
    raw_th_song_title: 'Título da Música',
    raw_th_artist: 'Artista',
    raw_th_album: 'Álbum',
    raw_showing: 'Exibindo {{n}} de {{total}} reproduções',
    raw_total: '{{n}} reproduções no total',
    raw_no_match: 'Nenhum registro corresponde aos seus filtros.',

    // Graphs
    gran_label: 'Granularidade',
    gran_daily: 'Diário',
    gran_monthly: 'Mensal',
    gran_yearly: 'Anual',
    range_label: 'Intervalo',
    range_to: 'até',
    type_label: 'Tipo',
    speed_label: 'Velocidade',
    show_label: 'Mostrar',

    // Graph card titles / subtitles
    graph_cumulative_title: '📈 Reproduções Acumuladas — Comparação de Artistas',
    graph_volume_title: '📊 Volume Total de Reproduções por Período',
    graph_volume_sub: 'Quantas músicas você ouviu em cada período em todos os artistas',
    graph_volume_comp_title: '📊 Volume de Reproduções por Período — Comparação de Artistas',
    graph_discoveries_title: '✨ Novas Descobertas por Período',
    graph_discoveries_sub: 'Músicas, artistas e álbuns ouvidos pela primeira vez em cada período',
    graph_race_title: '🏁 Corrida de Reproduções',
    graph_race_sub: 'Reproduções acumuladas — veja as entradas competindo pelo topo',

    // Race controls
    race_start: '↩ Início',
    race_play: '▶ Reproduzir',
    race_pause: '⏸ Pausar',
    race_end: '↪ Fim',
    race_artists: 'Artistas',
    race_songs: 'Músicas',
    race_albums: 'Álbuns',

    // Records navigation
    rec_nav_all: 'Todos',
    rec_nav_all_ones: 'Todos os #1',
    rec_nav_pak: 'Perfect All Kill',
    rec_nav_appearances: 'Aparições',
    rec_nav_debuts: 'Estreias',
    rec_nav_peak_plays: 'Mais Repros.',
    rec_nav_milestones: 'Marcos',
    rec_nav_fastest: 'Mais Rápido',
    rec_nav_certs: 'Certificações',
    rec_nav_streaks: 'Sequências',

    // Records section titles (HTML)
    rec_all_ones_title: '★ Todos os #1',
    rec_pak_title: '🎯 Perfect All Kill',
    rec_appearances_title: '📈 Mais Aparições no Chart',
    rec_debuts_title: '🚀 Melhores Estreias',
    rec_peak_plays_title: '🔥 Mais Reproduções em um Período',
    rec_milestones_title: '🎖 Marcos de Reproduções',
    rec_fastest_title: '⚡ Mais Rápido ao Marco',
    rec_certs_title: '💿 Tabela de Certificações',
    rec_streaks_title: '🔁 Recordes de Sequências',

    // Records subtitles
    rec_all_ones_sub: 'Artistas, álbuns e músicas que chegaram ao #1 nos seus charts — incluindo quantas vezes ficaram no topo',
    rec_pak_sub: 'Semanas em que um artista teve simultaneamente o #1 em artista, música e álbum',
    rec_appearances_sub: 'Artistas, álbuns e músicas com mais períodos dentro do seu chart semanal',
    rec_debuts_sub: 'Entradas que estrearam nas posições mais altas do chart semanal',
    rec_peak_plays_sub: 'Picos de reproduções em um único período — mais repros. de uma música, artista ou álbum em uma semana, mês ou ano',
    rec_milestones_sub: 'Primeiros artistas e músicas a atingir 100, 500, 1.000, 2.000, 3.000, 5.000+ reproduções',
    rec_fastest_sub: 'Quais artistas e músicas atingiram os marcos mais rápido — menos dias desde a primeira escuta até 1K, 2K, 5K repros.',
    rec_certs_sub: 'Artistas com mais músicas e álbuns certificados em Ouro, Platina e Diamante',
    rec_streaks_sub: 'Sequências consecutivas de escuta mais longas, repetições e recordes diários',

    // Records size bar
    rec_size_label: 'Exibir Entradas:',

    // Records intro
    rec_intro_prefix: 'Recordes baseados nos tamanhos do chart:',
    rec_weekly_top: 'Semanal Top {{n}}',
    rec_monthly_top: 'Mensal Top {{n}}',
    rec_yearly_all: 'Anual Todas as Entradas',
    rec_yearly_top: 'Anual Top {{n}}',
    rec_data_summary: '{{weeks}} semanas · {{months}} meses · {{years}} anos de dados',

    // Records table headers
    rec_th_songs: 'Músicas',
    rec_th_artists: 'Artistas',
    rec_th_albums: 'Álbuns',
    rec_th_weeks_at_1: 'Semanas no #1',
    rec_th_months_at_1: 'Meses no #1',
    rec_th_years_at_1: 'Anos no #1',
    rec_th_first_at_1: 'Primeiro no #1',
    rec_th_date_at_peak: 'Data no Pico',
    rec_th_weeks_on_chart: 'Semanas no Chart',
    rec_th_debut_rank: 'Pos. de Estreia',
    rec_th_week: 'Semana',
    rec_th_month: 'Mês',
    rec_th_year: 'Ano',
    rec_th_pak_weeks: 'Semanas PAK',
    rec_th_most_recent: 'Mais Recente',
    rec_th_days_to_1k: 'Dias até 1K',
    rec_th_first_play: 'Primeira Repro.',
    rec_th_reached_1k: 'Atingiu 1K',
    rec_th_days: 'Dias',
    rec_th_date_reached: 'Data Atingida',
    rec_th_plays: 'Repros.',
    rec_th_consec_days: 'Dias Consecutivos',
    rec_th_consec_plays: 'Repros. Consecutivas',
    rec_th_date: 'Data',
    rec_th_artist: 'Artista',
    rec_th_song_cert: 'Certs. Músicas',
    rec_th_album_cert: 'Certs. Álbuns',
    rec_th_time_since: 'Tempo desde 1ª Repro.',

    // Records dynamic text
    rec_weekly_label: 'Semanal',
    rec_monthly_label: 'Mensal',
    rec_yearly_label: 'Anual',
    rec_chart_label: 'Chart',
    rec_most_times_1: 'Mais Vezes no #1 do Chart',
    rec_most_appearances: 'Mais Aparições no Chart Semanal',
    rec_biggest_debuts_weekly: 'Melhores Estreias (Semanal)',
    rec_no_data: 'Sem dados ainda.',
    rec_no_certifications: 'Sem certificações ainda — continue ouvindo!',
    rec_no_repeat_runs: 'Nenhuma sequência de scrobble repetido detectada.',
    rec_no_pak: 'Nenhuma semana de Perfect All Kill registrada com Semanal Top {{n}}. Um artista deve ter simultaneamente o #1 em artista, música e álbum na mesma semana.',
    rec_top_songs: '★ Top Músicas',
    rec_top_artists: '♦ Top Artistas',
    rec_top_albums: '◈ Top Álbuns',
    rec_fastest_to: '{{type}} Mais Rápido{{s}} a Atingir {{n}} Repros.',
    rec_songs_fastest_to: '★ Músicas Mais Rápidas a Atingir {{n}} Repros.',
    rec_most_plays_single: 'Mais Reproduções em um Único {{unit}}',
    rec_artists_milestones: '♦ Artistas — Primeiros a Atingir Marcos',
    rec_songs_milestones: '★ Músicas — Primeiras a Atingir Marcos',
    rec_artists_longest_streak: '♦ Artistas — Maior Sequência Diária de Escuta',
    rec_songs_longest_streak: '★ Músicas — Maior Sequência Diária de Escuta',
    rec_repeat_runs: '🔁 Sequências de Scrobble Repetido',
    rec_repeat_runs_sub: 'Mais escutas consecutivas da mesma música sem reproduzir outra — ordenadas da maior para a menor',
    rec_artists_with_certs: 'Artistas com Mais Certificações',
    rec_certs_thresholds: 'Música: Ouro={{sg}} · Platina={{sp}} · Diamante={{sd}} repros. | Álbum: Ouro={{ag}} · Platina={{ap}} · Diamante={{ad}} repros.',
    rec_have_reached: '{{n}} {{type}} atingiram {{plays}} repros. — ordenados pelo menor número de dias do primeiro ao {{plays}}º',
    rec_has_reached: '1 {{type}} atingiu {{plays}} repros. — ordenado pelo menor número de dias do primeiro ao {{plays}}º',
    rec_pak_summary: '{{weeks}} {{weekword}} de Perfect All Kill em {{n}} {{artistword}}',
    rec_pak_all_title: 'Todas as Semanas PAK (Mais Recentes Primeiro)',
    rec_have_hit_1: '{{n}} {{type}} chegaram ao #1',
    rec_milestone_day1: 'Dia 1',
    rec_milestone_days_after: '{{n}} dias após a primeira repro.',
    rec_days_less_than_1: '< 1 dia',

    // Milestones table
    mil_th_plays: 'Repros.',
    mil_th_first_artist: 'Primeiro Artista',
    mil_th_first_song: 'Primeira Música',
    mil_th_date_reached: 'Data Atingida',
    mil_th_time_since: 'Tempo desde 1ª Repro.',
    mil_no_data: 'Nenhum marco atingido ainda.',

    // Dropouts
    drop_col_songs: '★ Músicas',
    drop_col_artists: '♦ Artistas',
    drop_col_albums: '◈ Álbuns',
    drop_none_this_week: 'Nenhuma esta semana',

    // Week days
    day_sunday: 'Domingo',
    day_monday: 'Segunda-feira',
    day_tuesday: 'Terça-feira',
    day_wednesday: 'Quarta-feira',
    day_thursday: 'Quinta-feira',
    day_friday: 'Sexta-feira',
    day_saturday: 'Sábado',

    // Month names (long form)
    month_january: 'Janeiro',
    month_february: 'Fevereiro',
    month_march: 'Março',
    month_april: 'Abril',
    month_may: 'Maio',
    month_june: 'Junho',
    month_july: 'Julho',
    month_august: 'Agosto',
    month_september: 'Setembro',
    month_october: 'Outubro',
    month_november: 'Novembro',
    month_december: 'Dezembro',

    // Month names (short form)
    month_jan: 'Jan',
    month_feb: 'Fev',
    month_mar: 'Mar',
    month_apr: 'Abr',
    month_may_short: 'Mai',
    month_jun: 'Jun',
    month_jul: 'Jul',
    month_aug: 'Ago',
    month_sep: 'Set',
    month_oct: 'Out',
    month_nov: 'Nov',
    month_dec: 'Dez',

    // Calendar & Date labels
    calendar_label: 'Calendário',
    calendar_picker: 'Selecionador de Data',

    // Masthead
    masthead_est: "★ Charts Pessoais de Música do Erwin · Est. 2016 ★",
    masthead_tagline: 'Seu histórico de escuta. Seus charts. Seu legado.',
    masthead_streaming: 'Ouvindo desde 9 de janeiro de 2016',

    // Footer
    footer_line1: "dankcharts.fm · Charts Pessoais de Música do Erwin · Est. 2016",
    footer_line2: 'Todos os dados ficam no seu navegador. Nada é enviado ou armazenado externamente.',

    // Modal
    modal_accomplishments: '★ Conquistas no Chart',
    modal_songs_on_chart: '♦ Músicas no Chart',
    modal_albums_on_chart: '◈ Álbuns no Chart',
    modal_tracks_on_chart: '♦ Faixas no Chart de Músicas',
    modal_chart_run_title: '📊 Histórico do Chart Run',

    // IG Share modal
    ig_share_title: 'Compartilhar como Imagem',
    ig_preview_label: 'Pré-visualização',
    ig_format: 'Formato',
    ig_post: '📷 Post (1:1)',
    ig_story: '📱 Story (9:16)',
    ig_font_size: 'Tamanho da Fonte',
    ig_rows: 'Linhas',
    ig_branding: 'Marca',
    ig_date: 'Data',
    ig_show_hide: 'Mostrar / Ocultar',
    ig_movement: 'Movimento (▲▼ NOVO RE)',
    ig_peak_badge: 'Badge Pico (PICO #1)',
    ig_weeks_on_chart: 'Semanas no Chart',
    ig_play_count: 'Reproduções',
    ig_artist_subtitle: 'Artista / Subtítulo',
    ig_date_period: 'Data / Período',
    ig_footer_branding: 'Rodapé de Marca',
    ig_cover_art: 'Capa / Foto',
    ig_week_date_sub: 'Subtítulo de Data',
    ig_section_summary: '📈 Resumo de Estatísticas',
    ig_artist_sublabel: 'Artista / Sub-rótulo',
    ig_slide_auto: 'Deslize para ajustar · esquerda = Auto',
    ig_source: 'Fonte:',

    // CR modal
    cr_chart_run: '📊 Chart Run',
    cr_rank_history: 'Histórico de posições e aparições no chart',
    cr_entry_post: '🎵 Post de Entrada',
    cr_range: 'Intervalo',
    cr_year_only: 'Apenas o Ano',
    cr_up_to_year: 'Até o Ano',
    cr_ytd: '{{year}} Acum.',
    cr_up_to_this_week: 'Até Esta Semana',
    cr_up_to_this_month: 'Até Este Mês',
    cr_year_only_label: 'Apenas {{year}}',
    cr_up_to_year_label: 'Até {{year}}',
    cr_all_time: 'Histórico',
    cr_no_history: 'Sem histórico de chart para este intervalo.',
    cr_no_history_yet: 'Sem histórico de chart ainda.',
    cr_share_btn: '📸 Compartilhar',
    cr_yearly_label: '🗓️ Anual',
    cr_monthly_label: '📊 Mensal',
    cr_weekly_label: '📈 Semanal',
    cr_on_chart: 'no Chart',
    cr_at_1: 'no #1',
    cr_in_top5: 'no Top 5',
    cr_in_top10: 'no Top 10',
    cr_peak_plays_month: 'Pico de Plays em um Mês',
    cr_peak_days_month: 'Pico de Dias em um Mês',
    cr_months_peak_year: 'Pico de Meses (Melhor Ano)',
    cr_days_peak_year: 'Pico de Dias (Melhor Ano)',
    cr_range_note: 'Intervalo para as caixas de chart run exibidas',
    cr_include_runs: 'Incluir Chart Runs',
    cr_yearly_run: '🗓️ Chart Run Anual + Estatísticas',
    cr_monthly_run: '📊 Chart Run Mensal + Estatísticas',
    cr_weekly_run: '📈 Chart Run Semanal + Estatísticas',
    cr_fonts: 'Fontes',
    cr_title_font: 'Título',
    cr_labels_font: 'Rótulos',
    cr_cover_art: 'Capa/Foto',
    cr_brand_px: 'Marca px',
    cr_song_artist_px: 'Música/Artista px',
    cr_week_date_px: 'Data Semanal px',
    cr_section_px: 'Seção px',
    cr_boxes_px: 'Caixas px',
    cr_desc_text: 'Texto de Descrição',
    cr_auto: 'Auto',
    cr_shuffle: 'Aleatório',
    cr_use_custom: 'Usar Personalizado',
    cr_desc_hint: 'Auto usa dados até a data visualizada. Aleatório gera variantes.',
    cr_desc_placeholder: 'Digite sua própria descrição...',

    // Entry post
    ep_chart_story: 'Descrição da História do Chart',
    ep_artist_album: 'Info de Artista / Álbum',
    ep_movement_bl: 'Movimento (Inferior Esquerdo)',
    ep_branding: 'Marca',
    ep_chart_name: 'Nome do Chart',
    ep_week_date: 'Data da Semana',
    ep_image: 'Imagem',
    ep_title: 'Título',
    ep_artist: 'Artista',
    ep_album: 'Álbum',
    ep_description: 'Descrição',
    ep_movement: 'Movimento',
    ep_position: 'Posição #',
    ep_story_y: 'Story Y',
    ep_font_sizes: 'Tamanhos de Fonte',

    // Export modal
    export_title: '♫ Exportar Playlist',
    export_suggested_names: 'NOMES SUGERIDOS PARA A PLAYLIST — clique para copiar',
    export_track_order: 'ORDEM DAS FAIXAS',
    export_no1_first: '▲ #1 Primeiro',
    export_no1_last: '▼ #1 Último',
    export_how_to_title: 'Como importar no Soundiiz:',
    export_format_used: 'Formato usado: Artista - Título (uma faixa por linha).',
    export_copied: '✓ COPIADO!',
  },

  // ── PORTUGUESE — EUROPEAN ─────────────────────────────────────────────────────
  'pt-PT': {
    // Navigation (same as pt-BR)
    nav_weekly: 'Semanal',
    nav_monthly: 'Mensal',
    nav_yearly: 'Anual',
    nav_alltime: 'De Sempre',
    nav_rawdata: 'Dados Brutos',
    nav_graphs: 'Gráficos',
    nav_records: 'Recordes',

    // Chart size bar
    chartsize_label: 'Tamanho do Chart:',
    chartview_label: 'Vista do Chart:',
    entries_display: 'Mostrar Entradas:',
    all_entries: 'Todas as Entradas',

    // Date navigation
    btn_prev: '◄ Anterior',
    btn_next: 'Seguinte ►',

    // Sync bar
    sync_connecting: '⟳ A ligar ao Google Sheets...',
    sync_now: '↺ SINCRONIZAR',
    sync_ok: '✓ Sincronizado · {{time}}  ({{n}} reproduções carregadas)',
    sync_ok_cached: '✓ Sincronizado · {{time}}  ({{n}} reproduções carregadas) · cache há {{mins}}m',
    sync_failed: '✕ Falha na sincronização — verifique se a folha é pública · {{error}}',
    sync_empty: '✕ A folha parece vazia ou só tem uma linha de cabeçalho.',
    sync_missing_cols: '✕ Não foi possível encontrar as colunas obrigatórias (Título da música, Artista, Data e Hora) na folha.',
    sync_warning: '⚠ Sincronizado com avisos — {{total}} linhas ignoradas ({{date}} data inválida, {{blank}} em branco). Consulte a consola para detalhes.',
    sync_no_valid: '✕ Nenhuma reprodução válida encontrada — verifique o formato de data na sua folha.',

    // Stats strip
    stat_total_plays: 'Reproduções',
    stat_unique_songs: 'Músicas Únicas',
    stat_artists: 'Artistas',
    stat_albums: 'Álbuns',

    // Table headers
    th_rank: 'Posição',
    th_title_artist: 'Título · Artista',
    th_album: 'Álbum',
    th_plays: 'Reproduções',
    th_unique_songs: 'Músicas Únicas',
    th_total_plays: 'Total Repros.',
    th_tracks: 'Faixas',
    th_artist: 'Artista',
    th_album_artist: 'Álbum · Artista',
    th_prev: 'Anterior',
    th_weeks: 'Semanas',
    th_months: 'Meses',

    // Period labels
    period_this_week: 'Esta Semana',
    period_loading: 'A carregar...',
    period_alltime: 'De Sempre',
    period_alltime_sub: 'Cada reprodução desde o seu primeiro scrobble',
    period_week_of: 'Semana de {{date}}',
    period_year_months: 'Janeiro – Dezembro {{year}}',

    // Section titles (dynamic)
    sec_songs_top: '★ Top {{n}} Músicas',
    sec_artists_top: '♦ Top {{n}} Artistas',
    sec_albums_top: '◈ Top {{n}} Álbuns',
    sec_songs_all: '★ Músicas — Todas as {{n}} Reproduzidas',
    sec_artists_all: '♦ Artistas — Todos os {{n}} Reproduzidos',
    sec_albums_all: '◈ Álbuns — Todos os {{n}} Reproduzidos',

    // Section subtitles
    sub_songs: 'Por reproduções no período selecionado',
    sub_artists: 'Por total de reproduções em todas as músicas',
    sub_albums: 'Por total de reproduções em todas as faixas',
    sub_dropouts: 'Músicas, artistas e álbuns que saíram do Top {{n}} esta semana',
    sub_upcoming: 'Próximos 90 dias · Com base nos seus Top 50 Artistas de Sempre',
    sub_recent: 'Últimos 180 dias · Com base nos seus Top 50 Artistas de Sempre',

    // Section labels
    sec_off_chart: '⬇ Fora do Chart',
    sec_upcoming_title: '🔜 Próximos Lançamentos',
    sec_recent_title: '🎉 Lançamentos Recentes',
    sec_graphs_title: '📈 Gráficos Históricos',
    sec_raw_data_title: '⊞ Dados Brutos de Scrobbles',
    sec_records_title: '🏆 Recordes e Salão da Fama',
    collapsed_hint: 'recolhido — clique em + para expandir',

    // Upload zone
    upload_title: 'Carregue o seu Histórico de Escuta',
    upload_desc: 'Largue o seu ficheiro CSV aqui, ou clique para procurar',

    // Buttons
    btn_export_playlist: '♫ EXPORTAR PLAYLIST',
    btn_share_image: '📷 Partilhar como Imagem',
    btn_share: 'PARTILHAR:',
    btn_refresh: '↺ ATUALIZAR',
    btn_prev_page: '◄ ANT.',
    btn_next_page: 'SEG. ►',
    btn_download_image: '↓ Descarregar Imagem',
    btn_cancel: 'Cancelar',
    btn_close: '✕ FECHAR',
    btn_add: '+ Adicionar',
    btn_reset: 'Repor',
    btn_reset_zoom: 'Repor Zoom',
    btn_max_all: 'Máx. Tudo',
    btn_min_all: 'Mín. Tudo',
    btn_download_txt: '↓ DESCARREGAR .TXT',
    btn_copy_clipboard: '⎘ COPIAR PARA ÁREA DE TRANSFERÊNCIA',
    btn_soundiiz: '↗ IR PARA O SOUNDIIZ',
    btn_download_gif: '⬇ GIF',

    // Labels on/off toggle
    labels_off: 'Rótulos: Não',
    labels_on: 'Rótulos: Sim',

    // Empty states
    empty_no_plays: 'Nenhuma reprodução encontrada para este período.',
    empty_no_album_data: 'Nenhum dado de álbum encontrado.',
    empty_no_album_data_csv: 'Nenhum dado de álbum encontrado — verifique se o seu CSV inclui uma coluna de Álbum.',
    empty_no_data: 'Sem dados ainda.',
    empty_no_results: 'Sem resultados',
    empty_none_this_week: 'Nenhuma esta semana',

    // Plurals
    plays_one: 'reprodução',
    plays_other: 'reproduções',
    songs_one: 'música',
    songs_other: 'músicas',
    albums_one: 'álbum',
    albums_other: 'álbuns',
    artists_one: 'artista',
    artists_other: 'artistas',
    weeks_one: 'sem.',
    weeks_other: 'sems.',
    months_one: 'mês',
    months_other: 'meses',
    days_one: 'dia',
    days_other: 'dias',
    tracks_one: 'faixa',
    tracks_other: 'faixas',

    // Click-to-view hints
    click_view_profile: 'CLIQUE PARA VER PERFIL',
    click_view_album: 'CLIQUE PARA VER ÁLBUM',

    // Badge labels
    badge_new: 'NOVO',
    badge_new_songs: 'NOVA',
    badge_re: 'RE',
    peak_label: 'PICO',

    // Search
    search_songs_placeholder: 'Pesquisar músicas ou artistas…',
    search_artists_placeholder: 'Pesquisar artistas…',
    search_albums_placeholder: 'Pesquisar álbuns ou artistas…',
    search_result: '{{n}} resultado',
    search_results: '{{n}} resultados',

    // Pagination
    page_label: 'Pág. {{page}} de {{total}}',

    // Raw data
    raw_song_label: 'Título da Música',
    raw_artist_label: 'Artista',
    raw_album_label: 'Álbum',
    raw_date_label: 'Data',
    raw_search_songs: 'Pesquisar músicas…',
    raw_search_artists: 'Pesquisar artistas…',
    raw_search_albums: 'Pesquisar álbuns…',
    raw_search_date: 'ex. 2024 ou Mar 2024…',
    raw_clear: '✕ Limpar',
    raw_th_num: '#',
    raw_th_date_time: 'Data e Hora',
    raw_th_song_title: 'Título da Música',
    raw_th_artist: 'Artista',
    raw_th_album: 'Álbum',
    raw_showing: 'A mostrar {{n}} de {{total}} reproduções',
    raw_total: '{{n}} reproduções no total',
    raw_no_match: 'Nenhum registo corresponde aos seus filtros.',

    // Graphs
    gran_label: 'Granularidade',
    gran_daily: 'Diário',
    gran_monthly: 'Mensal',
    gran_yearly: 'Anual',
    range_label: 'Intervalo',
    range_to: 'até',
    type_label: 'Tipo',
    speed_label: 'Velocidade',
    show_label: 'Mostrar',

    // Graph card titles / subtitles
    graph_cumulative_title: '📈 Reproduções Acumuladas — Comparação de Artistas',
    graph_volume_title: '📊 Volume Total de Reproduções por Período',
    graph_volume_sub: 'Quantas músicas ouviu em cada período em todos os artistas',
    graph_volume_comp_title: '📊 Volume de Reproduções por Período — Comparação de Artistas',
    graph_discoveries_title: '✨ Novas Descobertas por Período',
    graph_discoveries_sub: 'Músicas, artistas e álbuns ouvidos pela primeira vez em cada período',
    graph_race_title: '🏁 Corrida de Reproduções',
    graph_race_sub: 'Reproduções acumuladas — veja as entradas a competir pelo topo',

    // Race controls
    race_start: '↩ Início',
    race_play: '▶ Reproduzir',
    race_pause: '⏸ Pausar',
    race_end: '↪ Fim',
    race_artists: 'Artistas',
    race_songs: 'Músicas',
    race_albums: 'Álbuns',

    // Records navigation
    rec_nav_all: 'Todos',
    rec_nav_all_ones: 'Todos os #1',
    rec_nav_pak: 'Perfect All Kill',
    rec_nav_appearances: 'Aparições',
    rec_nav_debuts: 'Estreias',
    rec_nav_peak_plays: 'Mais Repros.',
    rec_nav_milestones: 'Marcos',
    rec_nav_fastest: 'Mais Rápido',
    rec_nav_certs: 'Certificações',
    rec_nav_streaks: 'Sequências',

    // Records section titles (HTML)
    rec_all_ones_title: '★ Todos os #1',
    rec_pak_title: '🎯 Perfect All Kill',
    rec_appearances_title: '📈 Mais Aparições no Chart',
    rec_debuts_title: '🚀 Melhores Estreias',
    rec_peak_plays_title: '🔥 Mais Reproduções num Período',
    rec_milestones_title: '🎖 Marcos de Reproduções',
    rec_fastest_title: '⚡ Mais Rápido ao Marco',
    rec_certs_title: '💿 Tabela de Certificações',
    rec_streaks_title: '🔁 Recordes de Sequências',

    // Records subtitles
    rec_all_ones_sub: 'Artistas, álbuns e músicas que chegaram ao #1 nos seus charts — incluindo quantas vezes ficaram no topo',
    rec_pak_sub: 'Semanas em que um artista teve simultaneamente o #1 em artista, música e álbum',
    rec_appearances_sub: 'Artistas, álbuns e músicas com mais períodos dentro do seu chart semanal',
    rec_debuts_sub: 'Entradas que estrearam nas posições mais altas do chart semanal',
    rec_peak_plays_sub: 'Picos de reproduções num único período — mais repros. de uma música, artista ou álbum numa semana, mês ou ano',
    rec_milestones_sub: 'Primeiros artistas e músicas a atingir 100, 500, 1.000, 2.000, 3.000, 5.000+ reproduções',
    rec_fastest_sub: 'Quais artistas e músicas atingiram os marcos mais rápido — menos dias desde a primeira escuta até 1K, 2K, 5K repros.',
    rec_certs_sub: 'Artistas com mais músicas e álbuns certificados em Ouro, Platina e Diamante',
    rec_streaks_sub: 'Sequências consecutivas de escuta mais longas, repetições e recordes diários',

    // Records size bar
    rec_size_label: 'Mostrar Entradas:',

    // Records intro
    rec_intro_prefix: 'Recordes baseados nos tamanhos do chart:',
    rec_weekly_top: 'Semanal Top {{n}}',
    rec_monthly_top: 'Mensal Top {{n}}',
    rec_yearly_all: 'Anual Todas as Entradas',
    rec_yearly_top: 'Anual Top {{n}}',
    rec_data_summary: '{{weeks}} semanas · {{months}} meses · {{years}} anos de dados',

    // Records table headers
    rec_th_songs: 'Músicas',
    rec_th_artists: 'Artistas',
    rec_th_albums: 'Álbuns',
    rec_th_weeks_at_1: 'Semanas no #1',
    rec_th_months_at_1: 'Meses no #1',
    rec_th_years_at_1: 'Anos no #1',
    rec_th_first_at_1: 'Primeiro no #1',
    rec_th_date_at_peak: 'Data no Pico',
    rec_th_weeks_on_chart: 'Semanas no Chart',
    rec_th_debut_rank: 'Pos. de Estreia',
    rec_th_week: 'Semana',
    rec_th_month: 'Mês',
    rec_th_year: 'Ano',
    rec_th_pak_weeks: 'Semanas PAK',
    rec_th_most_recent: 'Mais Recente',
    rec_th_days_to_1k: 'Dias até 1K',
    rec_th_first_play: 'Primeira Repro.',
    rec_th_reached_1k: 'Atingiu 1K',
    rec_th_days: 'Dias',
    rec_th_date_reached: 'Data Atingida',
    rec_th_plays: 'Repros.',
    rec_th_consec_days: 'Dias Consecutivos',
    rec_th_consec_plays: 'Repros. Consecutivas',
    rec_th_date: 'Data',
    rec_th_artist: 'Artista',
    rec_th_song_cert: 'Certs. Músicas',
    rec_th_album_cert: 'Certs. Álbuns',
    rec_th_time_since: 'Tempo desde 1ª Repro.',

    // Records dynamic text
    rec_weekly_label: 'Semanal',
    rec_monthly_label: 'Mensal',
    rec_yearly_label: 'Anual',
    rec_chart_label: 'Chart',
    rec_most_times_1: 'Mais Vezes no #1 do Chart',
    rec_most_appearances: 'Mais Aparições no Chart Semanal',
    rec_biggest_debuts_weekly: 'Melhores Estreias (Semanal)',
    rec_no_data: 'Sem dados ainda.',
    rec_no_certifications: 'Sem certificações ainda — continue a ouvir!',
    rec_no_repeat_runs: 'Nenhuma sequência de scrobble repetido detetada.',
    rec_no_pak: 'Nenhuma semana de Perfect All Kill registada com Semanal Top {{n}}. Um artista deve ter simultaneamente o #1 em artista, música e álbum na mesma semana.',
    rec_top_songs: '★ Top Músicas',
    rec_top_artists: '♦ Top Artistas',
    rec_top_albums: '◈ Top Álbuns',
    rec_fastest_to: '{{type}} Mais Rápido{{s}} a Atingir {{n}} Repros.',
    rec_songs_fastest_to: '★ Músicas Mais Rápidas a Atingir {{n}} Repros.',
    rec_most_plays_single: 'Mais Reproduções num Único {{unit}}',
    rec_artists_milestones: '♦ Artistas — Primeiros a Atingir Marcos',
    rec_songs_milestones: '★ Músicas — Primeiras a Atingir Marcos',
    rec_artists_longest_streak: '♦ Artistas — Maior Sequência Diária de Escuta',
    rec_songs_longest_streak: '★ Músicas — Maior Sequência Diária de Escuta',
    rec_repeat_runs: '🔁 Sequências de Scrobble Repetido',
    rec_repeat_runs_sub: 'Mais escutas consecutivas da mesma música sem reproduzir outra — ordenadas da maior para a menor',
    rec_artists_with_certs: 'Artistas com Mais Certificações',
    rec_certs_thresholds: 'Música: Ouro={{sg}} · Platina={{sp}} · Diamante={{sd}} repros. | Álbum: Ouro={{ag}} · Platina={{ap}} · Diamante={{ad}} repros.',
    rec_have_reached: '{{n}} {{type}} atingiram {{plays}} repros. — ordenados pelo menor número de dias do primeiro ao {{plays}}º',
    rec_has_reached: '1 {{type}} atingiu {{plays}} repros. — ordenado pelo menor número de dias do primeiro ao {{plays}}º',
    rec_pak_summary: '{{weeks}} {{weekword}} de Perfect All Kill em {{n}} {{artistword}}',
    rec_pak_all_title: 'Todas as Semanas PAK (Mais Recentes Primeiro)',
    rec_have_hit_1: '{{n}} {{type}} chegaram ao #1',
    rec_milestone_day1: 'Dia 1',
    rec_milestone_days_after: '{{n}} dias após a primeira repro.',
    rec_days_less_than_1: '< 1 dia',

    // Milestones table
    mil_th_plays: 'Repros.',
    mil_th_first_artist: 'Primeiro Artista',
    mil_th_first_song: 'Primeira Música',
    mil_th_date_reached: 'Data Atingida',
    mil_th_time_since: 'Tempo desde 1ª Repro.',
    mil_no_data: 'Nenhum marco atingido ainda.',

    // Dropouts
    drop_col_songs: '★ Músicas',
    drop_col_artists: '♦ Artistas',
    drop_col_albums: '◈ Álbuns',
    drop_none_this_week: 'Nenhuma esta semana',

    // Week days
    day_sunday: 'Domingo',
    day_monday: 'Segunda-feira',
    day_tuesday: 'Terça-feira',
    day_wednesday: 'Quarta-feira',
    day_thursday: 'Quinta-feira',
    day_friday: 'Sexta-feira',
    day_saturday: 'Sábado',

    // Month names (long form)
    month_january: 'Janeiro',
    month_february: 'Fevereiro',
    month_march: 'Março',
    month_april: 'Abril',
    month_may: 'Maio',
    month_june: 'Junho',
    month_july: 'Julho',
    month_august: 'Agosto',
    month_september: 'Setembro',
    month_october: 'Outubro',
    month_november: 'Novembro',
    month_december: 'Dezembro',

    // Month names (short form)
    month_jan: 'Jan',
    month_feb: 'Fev',
    month_mar: 'Mar',
    month_apr: 'Abr',
    month_may_short: 'Mai',
    month_jun: 'Jun',
    month_jul: 'Jul',
    month_aug: 'Ago',
    month_sep: 'Set',
    month_oct: 'Out',
    month_nov: 'Nov',
    month_dec: 'Dez',

    // Calendar & Date labels
    calendar_label: 'Calendário',
    calendar_picker: 'Selecionador de Data',

    // Masthead
    masthead_est: "★ Charts Pessoais de Música do Erwin · Est. 2016 ★",
    masthead_tagline: 'O seu histórico de escuta. Os seus charts. O seu legado.',
    masthead_streaming: 'A ouvir desde 9 de janeiro de 2016',

    // Footer
    footer_line1: "dankcharts.fm · Charts Pessoais de Música do Erwin · Est. 2016",
    footer_line2: 'Todos os dados ficam no seu navegador. Nada é enviado ou armazenado externamente.',

    // Modal
    modal_accomplishments: '★ Conquistas no Chart',
    modal_songs_on_chart: '♦ Músicas no Chart',
    modal_albums_on_chart: '◈ Álbuns no Chart',
    modal_tracks_on_chart: '♦ Faixas no Chart de Músicas',
    modal_chart_run_title: '📊 Histórico do Chart Run',

    // IG Share modal (same as pt-BR mostly)
    ig_share_title: 'Partilhar como Imagem',
    ig_preview_label: 'Pré-visualização',
    ig_format: 'Formato',
    ig_post: '📷 Post (1:1)',
    ig_story: '📱 Story (9:16)',
    ig_font_size: 'Tamanho da Fonte',
    ig_rows: 'Linhas',
    ig_branding: 'Marca',
    ig_date: 'Data',
    ig_show_hide: 'Mostrar / Ocultar',
    ig_movement: 'Movimento (▲▼ NOVO RE)',
    ig_peak_badge: 'Badge Pico (PICO #1)',
    ig_weeks_on_chart: 'Semanas no Chart',
    ig_play_count: 'Reproduções',
    ig_artist_subtitle: 'Artista / Subtítulo',
    ig_date_period: 'Data / Período',
    ig_footer_branding: 'Rodapé de Marca',
    ig_cover_art: 'Capa / Foto',
    ig_week_date_sub: 'Subtítulo de Data',
    ig_section_summary: '📈 Resumo de Estatísticas',
    ig_artist_sublabel: 'Artista / Sub-rótulo',
    ig_slide_auto: 'Deslize para ajustar · esquerda = Auto',
    ig_source: 'Fonte:',

    // CR modal
    cr_chart_run: '📊 Chart Run',
    cr_rank_history: 'Histórico de posições e aparições no chart',
    cr_entry_post: '🎵 Post de Entrada',
    cr_range: 'Intervalo',
    cr_year_only: 'Apenas o Ano',
    cr_up_to_year: 'Até ao Ano',
    cr_ytd: '{{year}} Acum.',
    cr_up_to_this_week: 'Até Esta Semana',
    cr_up_to_this_month: 'Até Este Mês',
    cr_year_only_label: 'Apenas {{year}}',
    cr_up_to_year_label: 'Até {{year}}',
    cr_all_time: 'De Sempre',
    cr_no_history: 'Sem histórico de chart para este intervalo.',
    cr_no_history_yet: 'Sem histórico de chart ainda.',
    cr_share_btn: '📸 Partilhar',
    cr_yearly_label: '🗓️ Anual',
    cr_monthly_label: '📊 Mensal',
    cr_weekly_label: '📈 Semanal',
    cr_on_chart: 'no Chart',
    cr_at_1: 'no #1',
    cr_in_top5: 'no Top 5',
    cr_in_top10: 'no Top 10',
    cr_peak_plays_month: 'Pico de Reproduções num Mês',
    cr_peak_days_month: 'Pico de Dias num Mês',
    cr_months_peak_year: 'Pico de Meses (Melhor Ano)',
    cr_days_peak_year: 'Pico de Dias (Melhor Ano)',
    cr_range_note: 'Intervalo para as caixas de chart run apresentadas',
    cr_include_runs: 'Incluir Chart Runs',
    cr_yearly_run: '🗓️ Chart Run Anual + Estatísticas',
    cr_monthly_run: '📊 Chart Run Mensal + Estatísticas',
    cr_weekly_run: '📈 Chart Run Semanal + Estatísticas',
    cr_fonts: 'Tipos de Letra',
    cr_title_font: 'Título',
    cr_labels_font: 'Rótulos',
    cr_cover_art: 'Capa/Foto',
    cr_brand_px: 'Marca px',
    cr_song_artist_px: 'Música/Artista px',
    cr_week_date_px: 'Data Semanal px',
    cr_section_px: 'Secção px',
    cr_boxes_px: 'Caixas px',
    cr_desc_text: 'Texto de Descrição',
    cr_auto: 'Auto',
    cr_shuffle: 'Aleatório',
    cr_use_custom: 'Usar Personalizado',
    cr_desc_hint: 'Auto usa dados até à data visualizada. Aleatório gera variantes.',
    cr_desc_placeholder: 'Escreva a sua própria descrição...',

    // Entry post
    ep_chart_story: 'Descrição da História do Chart',
    ep_artist_album: 'Info de Artista / Álbum',
    ep_movement_bl: 'Movimento (Inferior Esquerdo)',
    ep_branding: 'Marca',
    ep_chart_name: 'Nome do Chart',
    ep_week_date: 'Data da Semana',
    ep_image: 'Imagem',
    ep_title: 'Título',
    ep_artist: 'Artista',
    ep_album: 'Álbum',
    ep_description: 'Descrição',
    ep_movement: 'Movimento',
    ep_position: 'Posição #',
    ep_story_y: 'Story Y',
    ep_font_sizes: 'Tamanhos de Letra',

    // Export modal
    export_title: '♫ Exportar Playlist',
    export_suggested_names: 'NOMES SUGERIDOS PARA A PLAYLIST — clique para copiar',
    export_track_order: 'ORDEM DAS FAIXAS',
    export_no1_first: '▲ #1 Primeiro',
    export_no1_last: '▼ #1 Último',
    export_how_to_title: 'Como importar no Soundiiz:',
    export_format_used: 'Formato usado: Artista - Título (uma faixa por linha).',
    export_copied: '✓ COPIADO!',
  },
};

// ─── HELPER: get translated string with optional variable substitution ─────────
// Usage:  t('key')  or  t('key', { n: 5, date: 'Jan 1' })
function t(key, vars) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const str = (dict[key] !== undefined) ? dict[key]
    : (TRANSLATIONS.en[key] !== undefined ? TRANSLATIONS.en[key] : key);
  if (!vars) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{{${k}}}`));
}

// ─── HELPER: plural unit word ─────────────────────────────────────────────────
// Usage: `${n} ${tUnit('plays', n)}`  →  "3 plays" / "3 reproducciones"
function tUnit(key, n) {
  return t(n === 1 ? key + '_one' : key + '_other');
}

// ─── HELPER: number + unit ────────────────────────────────────────────────────
// Usage: tCount('plays', 3)  →  "3 plays" / "3 reproducciones"
function tCount(key, n) {
  return `${n.toLocaleString()} ${tUnit(key, n)}`;
}

// ─── HELPER: update button label (On/Off state) ──────────────────────────────
// Usage: updateLabelButton(elemId, isOn)  →  updates button text based on state
function updateLabelButton(elemId, isOn) {
  const btn = document.getElementById(elemId);
  if (btn) {
    btn.textContent = isOn ? t('labels_on') : t('labels_off');
    btn.classList.toggle('active', isOn);
  }
}

// ─── APPLY i18n TO STATIC DOM ELEMENTS ───────────────────────────────────────
// Elements with data-i18n="key"              → textContent updated
// Elements with data-i18n-placeholder="key"  → placeholder attribute updated
// Elements with data-i18n-title="key"        → title attribute updated
// Elements with data-i18n-raw-th="key"       → raw table TH (preserves sort-arrow span)
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
  // Raw data table headers keep their inner sort-arrow span — only update the text node
  document.querySelectorAll('[data-i18n-raw-th]').forEach(el => {
    const arrow = el.querySelector('.sort-arrow');
    el.textContent = t(el.dataset.i18nRawTh);
    if (arrow) el.appendChild(arrow);
  });
}

// ─── LANGUAGE SWITCHER ────────────────────────────────────────────────────────
function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) lang = 'en';
  currentLang = lang;
  try { localStorage.setItem('dankcharts-lang', lang); } catch (e) { }
  document.documentElement.lang = lang;

  // Update active button state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update static DOM strings
  applyI18n();

  // Re-populate the week start day dropdown with translated names
  if (typeof repopulateWeekDays === 'function') repopulateWeekDays();

  // Re-update label buttons (Labels: On/Off) with new language
  // These might have been programmatically set, so we need to re-apply translations
  ['gCumulativeLabelsBtn', 'gTotalVolumeLabelsBtn', 'gVolumeLabelsBtn', 'gDiscoveriesLabelsBtn'].forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn && btn.classList.contains('active')) {
      btn.textContent = t('labels_on');
    } else if (btn) {
      btn.textContent = t('labels_off');
    }
  });

  // Re-render the app immediately (always, even if no data loaded)
  if (typeof renderAll === 'function') {
    renderAll();
    if (typeof currentPeriod !== 'undefined' && currentPeriod === 'records') {
      if (typeof buildRecords === 'function') buildRecords();
    }
    if (typeof currentPeriod !== 'undefined' && currentPeriod === 'rawdata') {
      if (typeof applyRawFilters === 'function') applyRawFilters();
    }
  }
}

// ─── INITIALIZE ───────────────────────────────────────────────────────────────
(function () {
  try {
    const saved = localStorage.getItem('dankcharts-lang');
    if (saved && TRANSLATIONS[saved]) currentLang = saved;
  } catch (e) { }
})();

// Apply saved language to static DOM elements once the page is ready
document.addEventListener('DOMContentLoaded', function () {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
  applyI18n();
});
