// Builds dankcharts/genres.js (the Genre Library's fixed genre list) from
// MusicBrainz's official genre list, plus EXTRAS below for genres people use
// that MusicBrainz doesn't list. Families, display names, extra search words
// and the popular set are all set here — edit this file, not genres.js.
// Run from the repo root: node tools/make-genres.mjs dankcharts/genres.js
// then bump genres.js?v= in the dc-genres-src meta tag in index.html.
import { writeFileSync } from 'node:fs';

const out = process.argv[2];
const res = await fetch('https://musicbrainz.org/ws/2/genre/all?fmt=txt', { headers: { 'User-Agent': 'GenreListBuilder/1.0' } });
const names = (await res.text()).split('\n').map(s => s.trim()).filter(Boolean);
const have = new Set(names);

// Families for browsing, checked in this order (first match wins)
const FAMS = [
  ['brazil',  /\b(samba|bossa|mpb|sertanejo|forr[oó]|pagode|ax[eé]|frevo|bai[aã]o|choro|funk carioca|funk melody|funk ostentação|funk paulista|brega|tecnobrega|arrocha|piseiro|pisadinha|xote|maracatu|tropicália|tropicalia|manguebeat|lambada|carimbó|brazilian|baile funk|funk mandelão|funk brasileiro|samba-enredo|vaneira)\b/],
  ['latin',   /\b(latin|reggaeton|reggaetón|salsa|bachata|cumbia|merengue|mambo|bolero|ranchera|mariachi|corrido|corridos|norteño|norteno|banda|regional mexican|tejano|son|tango|vallenato|dembow|perreo|guaracha|cha-cha-chá|cha cha|rumba|bomba|plena|nueva canción|trova|nueva trova|timba|guajira|huayno|joropo|chicha|duranguense|grupera|música mexicana|sierreño|zouk|kompa|punta|tropical|boogaloo|mexican|cuban|colombian|argentin|chilean|peruvian|venezuelan|puerto|spanish|flamenco|rumba catalana|copla|sevillanas|jota|fado)\b/],
  ['asia',    /\b(k-pop|j-pop|c-pop|mandopop|cantopop|j-rock|k-rock|visual kei|enka|kayōkyoku|city pop|anime|anison|vocaloid|j-|k-|t-pop|v-pop|p-pop|opm|thai|chinese|japanese|korean|indonesian|dangdut|keroncong|gamelan|bollywood|filmi|bhangra|qawwali|ghazal|hindustani|carnatic|indian|tamil|punjabi|desi|pakistani|bengali|vietnamese|philippine|trot|kawaii|shibuya-kei|idol|mongolian|tuvan|throat singing|thumri|bhajan|kirtan|sufi|baul|lavani|gagaku|min'yō|ondo|guoyue)/],
  ['africa',  /\b(afro|afrobeat|afrobeats|amapiano|highlife|juju|jùjú|fuji|apala|soukous|kwaito|gqom|mbalax|bongo flava|kizomba|kuduro|semba|zouglou|coupé-décalé|ndombolo|rumba congolaise|makossa|bikutsi|chimurenga|mbaqanga|isicathamiya|marrabenta|taarab|benga|gnawa|raï|rai|chaabi|desert blues|tishoumaren|wassoulou|ethio|african|alté|naija|azonto|hiplife|gengetone|singeli|kwela|maskandi|marabi|sakara|mapouka|zamrock|bubu)\b/],
  ['christian', /\b(christian|gospel|worship|ccm|hymn|hymns|spiritual|spirituals|praise|sacred|liturgical|chant|gregorian|religious|devotional|nasheed|qawwali)\b/],
  ['metal',   /\bmetal|metalcore|deathcore|grindcore|djent|doom|sludge|thrash|black metal|death metal|crust|goregrind|mathcore|nwobhm\b/],
  ['punk',    /\b(punk|hardcore|emo|screamo|oi!|post-hardcore|riot grrrl|skate punk|crust|ska punk|anarcho|d-beat|powerviolence|grunge|easycore)\b/],
  ['hiphop',  /\b(hip hop|hip-hop|rap|trap|drill|grime|boom bap|crunk|bounce|horrorcore|phonk|cloud rap|plugg|pluggnb|jerk|hyphy|chopped and screwed|turntablism|g-funk|gangsta|mumble|emo rap|rage|memphis|nerdcore|bongo flava|uk drill|jersey club)\b/],
  ['rnb',     /\b(r&b|soul|funk|motown|doo-wop|doo wop|quiet storm|new jack swing|neo soul|disco|boogie|philly|go-go|p-funk|rhythm and blues|gospel|northern soul|southern soul|blue-eyed soul)\b/],
  ['jazz',    /\b(jazz|bebop|bop|swing|big band|dixieland|ragtime|boogie-woogie|fusion|bossa|scat|stride|third stream|cool jazz|hard bop|free improvisation)\b/],
  ['blues',   /\bblues\b/],
  ['country', /\b(country|bluegrass|americana|honky tonk|honky-tonk|western|outlaw|cowboy|nashville|alt-country|red dirt|texas|zydeco|cajun|old-time|newgrass|yodel)/],
  ['reggae',  /\b(reggae|dancehall|ska|dub|rocksteady|ragga|lovers rock|calypso|soca|mento|roots|riddim|bouyon|chutney)\b/],
  ['electronic', /(electro|techno|house|trance|edm|dubstep|drum and bass|jungle|breakbeat|breaks|garage|idm|ambient|synth|downtempo|trip hop|chillout|chillwave|vaporwave|hardstyle|hardcore techno|gabber|footwork|juke|bass|glitch|industrial|ebm|eurodance|eurobeat|big room|dance|rave|psytrance|goa|dub techno|electronica|chiptune|8-bit|bitpop|witch house|future|wave|lo-fi|lofi|beats|club|uk funky|2-step|step|bleep|dnb|trap \(edm\)|moombahton|nu-disco|italo|hi-nrg|freestyle|electroclash|plunderphonics|noise|drone|musique concrète|tape|modular|grime|bassline|hyperpop|digicore|glitchcore|deconstructed|wonky|halftime|neurofunk|liquid funk|darkstep|techstep|minimal|microhouse|tech house|deep house|progressive house|electro house|complextro|fidget|nightcore|happy hardcore|speedcore|frenchcore|terrorcore|breakcore|darkwave|coldwave|minimal wave|new beat|acid|ballroom|kuduro|baile|tecno|cumbia digital)/],
  ['rock',    /\b(rock|indie|alternative|shoegaze|grunge|post-rock|math rock|britpop|garage|psychedelic|psych|new wave|post-punk|surf|rockabilly|jangle|krautrock|stoner|space rock|noise pop|dream pop|slowcore|sadcore|emo|madchester|baggy|beat|freakbeat|mod|glam|prog|progressive|art rock|no wave|gothic|goth|deathrock|power pop|yacht|soft rock|aor|heartland|arena|southern)/],
  ['pop',     /\b(pop|bubblegum|teen|boy band|girl group|schlager|chanson|cabaret|easy listening|lounge|exotica|adult contemporary|ballad|crooner|traditional pop|sunshine|baroque pop|chamber pop|bedroom pop|europop|eurovision|ye-ye|yé-yé|levenslied|dansband|canzone|musique)/],
  ['classical', /\b(classical|baroque|romantic|opera|operetta|symphon|concerto|sonata|chamber music|choral|choir|orchestral|minimalism|serialism|impressionism|neoclassic|renaissance|medieval|early music|art song|lied|zarzuela|oratorio|cantata|requiem|madrigal|string quartet|piano|modern classical|contemporary classical|avant-garde|aleatory|spectral|post-minimalism|microtonal|twelve-tone|polyphony|motet|mass|plainchant|organum|ars nova|ars antiqua|galant|rococo|expressionism|atonal|sound art|electroacoustic|acousmatic)/],
  ['screen',  /\b(soundtrack|score|film|video game|game|musical|show tunes|broadway|theatre|theater|anime|cartoon|children|kids|lullaby|nursery|christmas|holiday|jingle|library music|production music|trailer|stage|comedy|spoken word|audiobook|poetry|asmr|meditation|new age|field recording|sound effects|ringtone|marching|military|brass band|barbershop|a cappella|novelty|parody)/],
  ['folk',    /\b(folk|singer-songwriter|acoustic|celtic|irish|scottish|bluegrass|sea shanty|shanty|balkan|klezmer|polka|fado|flamenco|traditional|tradicional|world|nordic|sami|joik|gypsy|romani|manouche|cajun|appalachian|anti-folk|freak folk|chamber folk|neofolk|filk|madrigal|ballad|troubadour|minstrel|skiffle|kolo|sevdah|rebetiko|laïko|turkish|arabesk|arabic|persian|kurdish|armenian|georgian|greek|hawaiian|polynesian|aboriginal|native american|inuit|andean|tuareg|yiddish|hebrew|israeli|mizrahi|dabke|mahraganat|khaleeji|shaabi|maqam|ottoman|mugham|fasıl|halay|horon|chalga|manele|turbo-folk|disco polo|estrada|bard|chanson réaliste|russian|ukrainian|polish|czech|hungarian|romanian|bulgarian|serbian|croatian|bosnian|albanian|macedonian|slovenian|baltic|finnish|swedish|norwegian|danish|icelandic|faroese|breton|basque|galician|occitan|sardinian|corsican|neapolitan|italian|alpine|swiss|austrian|german|bavarian|dutch|flemish|wallonian|cornish|welsh|manx|english|scandinavian)/],
];
const FAM_IDS = FAMS.map(f => f[0]).concat(['world']);
// Accents stripped too, so "axé" and "jùjú" meet the plain-letter word lists
const plain = n => n.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
const famOf = n => { for (let i = 0; i < FAMS.length; i++) if (FAMS[i][1].test(n) || FAMS[i][1].test(plain(n))) return i; return FAMS.length; };
const famIdx = id => FAM_IDS.indexOf(id);

// Genres people use all the time that MusicBrainz doesn't list as genres
// (it treats soundtrack as a release type, for one). The app's own award
// genre lists (_GENRE_ALIASES in app.js) use several of these names.
const EXTRAS = [
  ['alternative', 'rock'], ['indie', 'rock'], ['acoustic', 'folk'], ['world music', 'world'],
  ['christian', 'christian'], ['christian pop', 'christian'], ['worship', 'christian'],
  ['soundtrack', 'screen'], ['film score', 'screen'], ['video game music', 'screen'],
  ['musical theatre', 'screen'], ['anime music', 'asia'], ['christmas music', 'screen'],
  ['chillhop', 'hiphop'], ['afropop', 'africa'], ['urbano latino', 'latin'],
  ['rock en español', 'latin'], ['banda', 'latin'], ['sad pop', 'pop'], ['alternative pop', 'pop'],
];

// Display names: words capitalised, short words and known spellings kept
const UPPER = new Set(['fm','am','dc','nyc','uk','us','usa','edm','idm','ebm','mpb','ccm','nwobhm','nwoahm','aor','dnb','dj','mc','opm','vgm','ost','r&b','ebm','asmr','lgbt','nyhc','ny','la','dc','gfunk','ii','iii','mbaqanga','sadcore'.toUpperCase()].filter(s => s === s.toLowerCase()));
const LOWER = new Set(['and','of','the','n','de','da','do','dos','das','e','y','la','el','del','en','à','a','di','du','des','le','les','con','in','on','for','to']);
const SPECIAL = { 'r&b': 'R&B', 'k-pop': 'K-pop', 'j-pop': 'J-pop', 'c-pop': 'C-pop', 'j-rock': 'J-rock', 'k-rock': 'K-rock', 't-pop': 'T-pop', 'v-pop': 'V-pop', 'p-pop': 'P-pop', 'j-rap': 'J-rap', 'k-rap': 'K-rap', 'g-funk': 'G-funk', 'p-funk': 'P-funk', 'lo-fi': 'Lo-fi', 'hi-nrg': 'Hi-NRG', 'go-go': 'Go-go', 'doo-wop': 'Doo-wop', 'yé-yé': 'Yé-yé', 'oi!': 'Oi!', 'synth-pop': 'Synth-pop', 'hip hop': 'Hip Hop', 'trip hop': 'Trip Hop', 'la': 'LA' };
function display(n) {
  if (SPECIAL[n]) return SPECIAL[n];
  return n.split(' ').map((w, i) => {
    if (UPPER.has(w)) return w.toUpperCase();
    if (i > 0 && LOWER.has(w)) return w;
    if (SPECIAL[w]) return SPECIAL[w];
    // "post-punk" → "Post-punk"; "lo-fi hip hop" keeps the hyphen part lower
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

// Extra search words: other spellings, short forms, Spanish / Portuguese names
const ALIASES = {
  'hip hop': 'hip-hop hiphop rap',
  'pop rap': 'rap pop',
  'r&b': 'rnb r and b rhythm and blues',
  'contemporary r&b': 'contemporary rnb modern r&b',
  'alternative r&b': 'alt r&b alt rnb pbr&b',
  'drum and bass': 'dnb d&b drum n bass drum & bass',
  'electronic': 'electronica electrónica eletrônica electronic music',
  
  'edm': 'electronic dance music',
  'k-pop': 'kpop korean pop',
  'j-pop': 'jpop japanese pop',
  'c-pop': 'cpop chinese pop',
  'funk carioca': 'baile funk funk brasileiro brazilian funk funk br funk mandelao',
  'mpb': 'musica popular brasileira brazilian popular music',
  'sertanejo': 'sertanejo universitario',
  'forró': 'forro',
  'regional mexicano': 'regional mexican musica mexicana',
  'corrido tumbado': 'corridos tumbados',
  'corrido': 'corridos',
  'reggaeton': 'reggaetón regueton urbano',
  'latin pop': 'pop latino pop en espanol',
  'trap latino': 'trap latino',
  'dance-pop': 'dance pop dancepop',
  'synth-pop': 'synthpop synth pop',
  'lo-fi': 'lofi',
  'lo-fi hip hop': 'lofi hip hop chillhop lofi beats study beats',
  'singer-songwriter': 'singer songwriter cantautor',
  'rock and roll': "rock & roll rock n roll rock'n'roll",
  
  'christian': 'cristiana crista christian music',
  'worship': 'adoracion adoração louvor praise and worship',
  'gospel': 'evangelica evangélica',
  'classical': 'clasica clássica',
  'soundtrack': 'banda sonora trilha sonora ost movie music',
  'film score': 'film soundtrack movie score score',
  'anime music': 'anime anison anime soundtrack',
  'christmas music': 'christmas holiday navidad natal xmas',
  'alternative': 'alt',
  'world music': 'world musica del mundo',
  'praise & worship': 'praise and worship worship',
  'film score': 'film soundtrack movie score',
  'video game music': 'vgm game music game soundtrack ost videogame',
  'country': 'country music',
  'heavy metal': 'metal',
  'alternative rock': 'alt rock alt-rock',
  'alternative pop': 'alt pop alt-pop',
  'indie pop': 'indie-pop',
  'indie rock': 'indie-rock',
  'post-punk': 'post punk',
  'pop punk': 'pop-punk',
  'uk garage': 'ukg',
  'dubstep': 'brostep',
  'trap': 'trap music',
  'afrobeats': 'afrobeat naija afropop',
  'drill': 'drill music',
  'phonk': 'drift phonk',
  'emo': 'emo music',
  'house': 'house music',
  'bossa nova': 'bossa',
  
  'eurodance': 'euro dance',
  'new wave': 'new-wave',
  'musical theatre': 'musical theater broadway show tunes musicals',
  
  'pagode': 'pagode romântico',
  'bachata': 'bachata urbana',
  'cumbia': 'cumbia villera',
  'trova': 'trova cubana',
  'hyperpop': 'hyper pop',
};

// Shown first in the picker, before anything is typed
const POPULAR = ['pop','hip hop','r&b','rock','alternative rock','indie pop','indie rock','electronic','dance-pop','house','techno',
  'drum and bass','dubstep','trance','edm','ambient','trap','drill','pop rap','contemporary r&b','alternative r&b','soul','neo soul','funk',
  'disco','synth-pop','electropop','dream pop','bedroom pop','hyperpop','art pop','pop rock','pop punk','emo','punk rock','hard rock',
  'heavy metal','metalcore','classic rock','grunge','shoegaze','post-punk','folk','indie folk','singer-songwriter','country','country pop',
  'americana','jazz','blues','classical','soundtrack','reggae','dancehall','reggaeton','latin pop','trap latino','bachata','salsa','cumbia',
  'regional mexicano','corrido tumbado','afrobeats','amapiano','k-pop','j-pop','sertanejo','funk carioca','pagode','mpb','gospel','worship',
  'christian','lo-fi hip hop','phonk','uk garage','grime','gospel'];

for (const g of EXTRAS) have.add(g[0]);
const pop = [...new Set(POPULAR)].filter(g => { if (!have.has(g)) { console.warn('popular not in list:', g); return false; } return true; });
for (const k of Object.keys(ALIASES)) if (!have.has(k)) console.warn('alias key not in list:', k);

const mb = new Set(names);
for (const [g] of EXTRAS) if (mb.has(g)) console.warn('extra already in MusicBrainz:', g);
const all = names.map(n => [n, famOf(n)]).concat(EXTRAS.filter(([g]) => !mb.has(g)).map(([g, f]) => [g, famIdx(f)]));
all.sort((a, b) => a[0].localeCompare(b[0]));
for (const g of EXTRAS) have.add(g[0]);
const list = all.map(([n, f]) => {
  const row = [n, display(n), f];
  if (ALIASES[n]) row.push(ALIASES[n]);
  return row;
});
const counts = {};
for (const r of list) counts[FAM_IDS[r[2]]] = (counts[FAM_IDS[r[2]]] || 0) + 1;
console.log('genres:', list.length, counts);

const js = `/* dankcharts.fm — the genre list for the Genre Library (genrelib.js).
   Made from MusicBrainz's official genre list (musicbrainz.org/genres,
   ${list.length} genres on ${new Date().toISOString().slice(0, 10)}), so the genres MusicBrainz looks up
   match these names exactly. Rebuilt by a script, not by hand: to add a
   genre without a site update, an admin adds it to Firestore genreExtras.
   Loaded only when the Genre Library or the genre picker first opens.
   Each row: [id (lower-case, what gets saved), display name, family index,
   extra search words (optional)]. */
window.DC_GENRES = {
  v: '${new Date().toISOString().slice(0, 10)}',
  // Families for browsing; the last one catches everything else
  fams: ${JSON.stringify(FAM_IDS)},
  // Shown first, before anything is typed
  popular: ${JSON.stringify(pop)},
  list: [
${list.map(r => '    ' + JSON.stringify(r)).join(',\n')}
  ]
};
`;
writeFileSync(out, js);
console.log('wrote', out, js.length, 'bytes');



