/* ===========================================================================
   CHANGELOG - EUROPEAN PORTUGUESE
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
window.DC_CHANGELOG_I18N['pt-PT'] = {

  /* ========== OUTUBRO 2026 ========== */

  "Artist charts: clickable names and a song ranking per artist":
    ['Tabelas de artistas: nomes com ligação e uma classificação de músicas por artista',
     'Nas tabelas de artistas, o nome do artista é agora uma ligação para a página dele (clicar no resto da linha continua a funcionar). O número de músicas ao lado de cada artista também é clicável: abre uma pequena classificação das músicas desse artista que ouviu nessa semana, mês ou ano, da mais ouvida para a menos ouvida. Clique numa música da lista para abrir a página dela.'],

  "Album names in song charts open the album page":
    ['Os nomes dos álbuns nas tabelas de músicas abrem a página do álbum',
     'Nas tabelas de músicas, o nome do álbum ao lado de cada música é agora uma ligação. Clique para abrir a página desse álbum, tal como já acontece com os nomes das músicas e dos artistas.'],

  "Share an artist's whole discography of scores as an image":
    ['Partilhe as notas de toda a discografia de um artista como imagem',
     'Os artistas com álbuns avaliados têm agora um botão "Partilhar notas" na secção de avaliações. Cria uma imagem de cada álbum que avaliou: uma coluna por álbum com capa e ano, um bloco colorido por faixa e a nota de cada álbum em baixo, como o gráfico de notas de uma série. Escolha quantos álbuns vão em cada página, a ordem (ano de lançamento, primeira audição ou nota) e se a linha de baixo mostra a nota do álbum, a média das faixas ou ambas. Os singles e as edições pouco avaliadas ficam de fora, a não ser que os assinale na lista. Escolha entre dois designs, qualquer paleta e tamanho publicação, retrato ou story, e transfira uma página ou todas.'],

  "You can rate an artist's albums straight from their page":
    ['Pode avaliar os álbuns de um artista diretamente na página dele',
     'Na secção de avaliações de um artista, clicar num álbum avaliado abre agora o editor de avaliação, e uma nova lista "Ainda sem nota" mostra os álbuns que ainda não avaliou, os mais ouvidos primeiro, prontos a avaliar com um clique. A pequena seta em cada linha continua a abrir a página do álbum.'],

  "Song names in your ratings keep their real capitalisation":
    ['Os nomes das músicas nas suas avaliações mantêm as maiúsculas',
     'As músicas avaliadas apareciam todas em minúsculas em alguns sítios, como as mais bem avaliadas na página de um artista, o editor de avaliação e a biblioteca de avaliações no separador Gráficos. Agora aparecem exatamente como estão escritas na sua biblioteca.'],

  "Long song titles on the Grid score image can shrink to initials":
    ['Os títulos longos na imagem em grelha podem passar a iniciais',
     'O design Grelha da imagem da nota do álbum tem uma nova opção, "Encurtar títulos longos para iniciais". Qualquer título demasiado longo para a linha passa a ser a primeira letra de cada palavra, por isso "Nice To Meet You (feat. Lainey Wilson)" aparece como NTMY. Os títulos que já cabem ficam iguais.'],

  "A Grid design for sharing an album's score":
    ['Um design em grelha para partilhar a nota de um álbum',
     'A imagem da nota de um álbum tem um quarto design, Grelha. Cada faixa é um bloco colorido com a nota, pela ordem do álbum, com uma legenda de cores no topo e blocos cinzentos para as faixas que ainda não avaliou. Os títulos podem aparecer ao lado dos blocos ou ser ocultados. No topo escolhe mostrar a nota do álbum, a média das faixas ou ambas. Os álbuns longos encolhem para caber, e a janela sugere o tamanho story quando os blocos ficariam pequenos.'],

  "You can share an album's score as an image":
    ['Pode partilhar a nota de um álbum como imagem',
     'Os álbuns avaliados têm agora um botão "Partilhar nota" ao lado de "Edit rating". Cria uma imagem do seu veredicto: a nota e o que significa, o seu comentário, a melhor e a pior faixa, os aspetos do álbum e a nota de cada faixa. Escolha entre três designs, todas as paletas de cores e tamanho publicação, retrato ou story, e depois copie, partilhe ou transfira.'],

  'YouTube plays no longer claim to be scrobbled when they were not saved':
    ['As reproduções do YouTube já não dizem que fizeram scrobble quando não foram guardadas',
     'Se tocasse uma música no leitor do YouTube sem o scrobbling do Last.fm ou uma folha do Google ligados, o leitor dizia "Scrobbled" mesmo que a reprodução nunca entrasse nos seus tops. Agora avisa que a reprodução não foi guardada, com uma ligação para ligar o Last.fm, e o anel de contagem só aparece quando a reprodução pode mesmo ser guardada.'],

  'Your week start day follows you to every device':
    ['O seu dia de início da semana acompanha-o em todos os dispositivos',
     'Com a sessão iniciada, o dia em que as suas tabelas semanais começam fica guardado na sua conta como as outras definições, por isso todos os dispositivos cortam as semanas da mesma forma. Um dia ou fuso horário alterado noutro dispositivo aplica-se assim que inicia sessão, sem recarregar a página.'],

  'Changing your timezone now updates everything at once':
    ['Mudar o fuso horário agora atualiza tudo de uma vez',
     'Depois de mudar o fuso horário, as listas de Músicas, Artistas e Álbuns novos podiam continuar a usar o anterior até recarregar a página, e com um CSV carregado as tabelas não eram redesenhadas. Agora tudo se atualiza assim que guarda. A Máquina do tempo também segue o fuso escolhido em vez do relógio do dispositivo.'],

  'Week start day moved to Settings':
    ['O dia de início da semana passou para as Definições',
     'O botão Dia inicial saiu do topo da página. Escolha o dia em que as suas tabelas semanais começam em Definições → Tops → Semana das tabelas. Aplica-se de imediato e a sua escolha atual mantém-se.'],

  'The rating editor closes instantly':
    ['O editor de avaliações fecha de imediato',
     'Fechar ou guardar uma avaliação bloqueava a janela durante um segundo ou mais enquanto o chart inteiro era redesenhado por trás. Agora fecha de imediato, a janela do álbum ou da música mostra a nova nota logo e o chart atualiza-se quando voltas a ele. Mexer nos controlos deslizantes ao avaliar um álbum também ficou mais rápido.'],

  'Month names on chart share images follow your language':
    ['Os meses nas imagens dos charts seguem o seu idioma',
     'As imagens de um chart mensal mostravam o mês no idioma do navegador em vez do escolhido no dankcharts. Agora usam o idioma do site.'],

  'New award: Best Song Heard in Concert':
    ['Novo prémio: Melhor Música Ouvida em Concerto',
     'Uma categoria opcional dos Meus Grammys para a música que mais te marcou ao vivo, num concerto a que foste nesse ano. Está em Configurar ano, em Como ouves.'],

  'Clear the nominee picker search in one click':
    ['Limpa a pesquisa do seletor de nomeados com um clique',
     'A caixa de pesquisa do seletor de nomeados tem um × que a esvazia e volta a mostrar a lista completa.'],

  'Settings in your language':
    ['As definições no teu idioma',
     'Toda a janela de Definições está agora traduzida para espanhol e para as duas variantes do português: os três separadores, os passos de configuração do Google Sheets, as mensagens de ligação ao Last.fm, o estado do carregamento de ficheiros e as cópias de segurança. Ao mudar de idioma, atualiza-se logo, mesmo aberta.'],

  'Choose which sections the charts page shows':
    ['Escolhe que secções a página de tabelas mostra',
     'Definições → Tabelas tem um novo grupo Secções da página de tabelas com um interruptor para Máquina do tempo, os cartões de estatísticas do período, Certificados neste período, Próximos lançamentos e Lançamentos recentes. Desliga qualquer um para o esconder da página de tabelas. O separador Eventos mantém os seus próprios lançamentos próximos e recentes. As alterações aplicam-se logo e ficam guardadas em todos os teus dispositivos.'],

  'Hide chart descriptions':
    ['Ocultar as descrições das tabelas',
     'O separador Mostrar do menu ⋮ de cada tabela tem um novo interruptor Descrições. Desliga-o para esconder as explicações curtas sob os títulos dessa tabela, como “Pelo total de reproduções de todas as faixas”. Músicas, artistas e álbuns são ajustados em separado, e a escolha fica guardada em todos os teus dispositivos.'],

  'Printable PDF of any chart':
    ['PDF para imprimir de qualquer tabela',
     'Cada tabela tem agora um botão PDF para imprimir ao lado de Partilhar como imagem. Escolhe só essa tabela ou as três (músicas, artistas e álbuns, cada uma na sua página), e se queres incluir capas e a lista Quase no top. Depois abre a janela de impressão; escolhe Guardar como PDF para descarregar. O PDF mostra cada entrada com movimento, reproduções, semanas e pico, num aspeto limpo a preto e branco que imprime bem, e os nomes em qualquer idioma aparecem corretamente.'],

  'Share button works on phones':
    ['O botão Partilhar funciona no telemóvel',
     'No telemóvel, o botão Partilhar das imagens para partilhar mostrava uma ampulheta e nunca abria nada. Agora a imagem é preparada em segundo plano enquanto vês a pré-visualização, por isso tocar em Partilhar abre logo o menu de partilha do telemóvel: escolhe Instagram para Stories ou WhatsApp para Estado. Se tocares antes de estar pronta, o botão muda para Toca para partilhar quando estiver.'],

  'Share images download much faster':
    ['As imagens para partilhar descarregam muito mais depressa',
     'Descarregar, copiar ou partilhar uma imagem demorava vários segundos, e mais quanto maior a tua biblioteca, porque a página inteira era copiada nos bastidores antes de desenhar a imagem. Agora só o cartão é copiado, por isso as imagens ficam prontas em cerca de meio segundo. As imagens ficam exatamente iguais a antes.'],

  'Favorite award categories':
    ['Categorias de prémios favoritas',
     'Qualquer categoria dos Meus Grammys pode ser marcada como favorita com a estrela: no cartão dela em Configurar ano, no cabeçalho do cartão de nomeados ou no topo do seletor de nomeados. As favoritas mantêm-se de um ano para o outro e sincronizam entre os teus dispositivos. Em Configurar ano, o novo filtro Favoritas mostra só as categorias marcadas, e o botão Só favoritas ativa essas e desativa todas as outras, por isso preparar um ano novo com os teus prémios habituais leva um clique. Os nomeados que já escolheste são mantidos.'],

  '14 new awards: Gospel & Christian and Instrumental groups':
    ['14 prémios novos: grupos Gospel e cristã e Instrumental',
     'Os Meus Grammys têm mais dois grupos em Configurar ano. Gospel e cristã acrescenta Melhor Música e Álbum Gospel, Melhor Música e Álbum Cristão Contemporâneo, Melhor Música de Adoração, Artista Cristão/Gospel do Ano, Melhor Música de Hip-Hop Cristão e Melhor Colaboração Gospel/Cristã. Instrumental acrescenta Melhor Música Instrumental, Melhor Versão Instrumental (versões instrumentais e de karaoke, pelo título), Melhores Beats Lo-Fi/Chill, Melhor Peça para Piano, Melhor Música de Videojogo e Melhor Composição Instrumental, e agora também junta os prémios de álbum de jazz e clássico/instrumental.'],

  '30 new awards: a Pop group and a Videos group':
    ['30 prémios novos: um grupo Pop e um grupo Videoclipes',
     'Os Meus Grammys têm dois grupos novos em Configurar ano. Pop junta os prémios pop que já existiam e acrescenta Artista Pop do Ano, Melhor Novo Artista Pop, Melhor Álbum de Estreia Pop, Melhor EP Pop, Melhor Remix Pop, Melhor Balada Pop, Melhor Interpretação Vocal Pop, Melhor Refrão Pop e prémios de estilo para synth-pop, pop latino, alt-pop, hyperpop e art pop. Videoclipes acrescenta prémios ao estilo dos VMA: Melhor Videoclipe Pop, de Hip-Hop, R&B, Rock, Alternativo, Latino e K-Pop, Melhor Videoclipe de Colaboração, Melhor Videoclipe de Novo Artista, Melhor Realização, Coreografia, Fotografia, Direção Artística, Efeitos Visuais e Montagem, Melhor Atuação ao Vivo e Melhor Filme Musical. Não há dados de vídeo, por isso a corrida é entre as tuas músicas e a escolha é tua. Os prémios de artista por género agora também leem os géneros escritos na tua folha.'],

  'Two holiday awards: Best Holiday Season Song and Album':
    ['Dois prémios da época festiva: Melhor Música e Melhor Álbum da Época Festiva',
     'Os Meus Grammys têm duas categorias novas opcionais. Uma música ou um álbum entra na corrida quando o título menciona o Natal, o Ano Novo e afins, ou quando o ouviste na época festiva, de 11 de dezembro a 14 de janeiro. Títulos festivos contam todas as reproduções do ano; o resto conta só as da época. Um álbum de Natal conta como festivo mesmo quando os títulos das músicas não o dizem.'],

  'Audio samples no longer pick live recordings with plain titles':
    ['As amostras de áudio já não escolhem gravações ao vivo com títulos normais',
     'Nos Meus Grammys, o botão de reproduzir ainda podia tocar uma versão ao vivo quando uma loja a listava com o nome normal da música e só o álbum dizia ao vivo. I Write Sins Not Tragedies dos Panic! at the Disco era um caso: a amostra vinha de um single de uma sessão ao vivo. Agora as amostras também verificam de que álbum vem a gravação, e ignoram álbuns ao vivo, acústicos, de remixes e de demos, a não ser que o nomeado venha de um deles. A pesquisa por álbum agora procura no Apple Music além do Deezer.'],

  'Album records show what their songs earned':
    ['Os recordes de álbum mostram o que as suas canções conquistaram',
     'No resumo dos prémios, os cartões de recorde de álbum têm agora uma linha pequena como “+3 das suas canções” quando canções desse álbum também foram nomeadas ou venceram. Só as nomeações e vitórias do próprio álbum contam para o recorde, tal como nos Grammy reais, por isso um álbum grande com alguns singles de sucesso não fica com os recordes de álbum só pelas canções.'],

  'The Chart Run panel has a cleaner, more modern look':
    ['O painel de Trajetória no Top está mais limpo e moderno',
     'A Trajetória no Top que abre por baixo de uma entrada é agora um cartão arredondado próprio. Os botões de intervalo são um único seletor com a opção escolhida em destaque, e os separadores de sequências funcionam da mesma forma. As semanas na tabela, o total de reproduções, o pico e os outros números ficam em pequenos blocos com o número em cima. Cada semana é uma ficha suave e arredondada: o pico é dourado e as outras semanas no top 3 têm um tom de cor, por isso o melhor troço destaca-se. O tempo fora da tabela aparece como uma pausa pontilhada. Recordes de sequência, Mapa de calor e Histórico completo são cartões arredondados com uma seta que roda ao abrir.'],

  'The chart tables have a cleaner, more modern look':
    ['As tabelas estão mais limpas e modernas',
     'A vista de tabela já não parece uma folha de cálculo. Cada entrada é uma faixa arredondada com algum espaço entre linhas, e as linhas de coluna e o cabeçalho preenchido desapareceram. As três primeiras linhas têm tons de ouro, prata e bronze em cores que também funcionam nos temas claros, e o número 1 tem um efeito de folha dourada. O movimento na coluna Anterior, incluindo sem alteração, aparece como pequenas pílulas coloridas, e as etiquetas de pico são arredondadas. Nas tabelas semanais de Artistas e Álbuns, a etiqueta de recorde de reproduções fica agora por baixo da barra, tal como em Músicas.'],

  'Real-Life Awards now cover the BRIT Awards':
    ['Prémios Reais agora inclui os BRIT Awards',
     'Prémios Reais tem um nono separador, BRIT, para os BRIT Awards: a primeira cerimónia em 1977 e depois todos os anos desde 1982 até hoje. As setas de ano saltam de 1978 a 1981, quando não houve cerimónia. Mostra quais dos teus artistas foram nomeados e o que ganharam, e depois todas as categorias da noite com os vencedores a negrito e os teus artistas assinalados. Cada ano é comparado com o que ouviste nos doze meses antes da cerimónia. Os nomes das categorias já não indicam quem entregou o prémio, em nenhum separador. Se a Wikipédia estiver ocupada por um momento, o separador agora espera e tenta de novo antes de mostrar um erro.'],

  'Real-Life Awards now cover the Juno Awards':
    ['Prémios Reais agora inclui os Juno Awards',
     'Prémios Reais tem um oitavo separador, Juno, para os Juno Awards do Canadá, com todos os anos desde 1971 até hoje. Em 1988 não houve cerimónia, e o separador indica-o. Mostra quais dos teus artistas foram nomeados e o que ganharam, e depois todas as categorias da noite com os vencedores a negrito e os teus artistas assinalados. Os empates mostram todos os vencedores, como o Single do Ano de 1981, que foi para Anne Murray e para os Martha and the Muffins. Cada ano é comparado com o que ouviste nos doze meses antes da cerimónia. Os vencedores e nomeados vêm da Wikipédia.'],

  'Real-Life Awards only credit the artist who was actually nominated':
    ['Prémios Reais só atribui a nomeação ao artista que foi mesmo nomeado',
     'Nos separadores VMAs, AMAs, iHeartRadio, World Music, Billboard e ARIA, um artista com um nome de uma só palavra podia ficar com a nomeação de outro quando o nome dele fazia parte de um nome maior. Por exemplo, um artista chamado Selena ficava com as nomeações de Selena Gomez, e Max com as de Max Martin. Agora cada nomeação é separada nos artistas que nomeia, e só conta se o nome coincidir por inteiro. Os créditos partilhados continuam a contar para todos, por isso Rosé e Bruno Mars ficam ambos com Apt., e nomes como Earth, Wind & Fire e Lil Nas X mantêm-se inteiros.'],

  'Real-Life Awards now cover the ARIA Music Awards':
    ['Prémios Reais agora inclui os ARIA Music Awards',
     'Prémios Reais tem um sétimo separador, ARIA, para os ARIA Music Awards da Austrália, com todos os anos desde 1987 até hoje. Mostra quais dos teus artistas foram nomeados e o que ganharam, e depois todas as categorias da noite com os vencedores a negrito e os teus artistas assinalados. Quem entrou para o Hall da Fama conta como vencedor. Cada ano é comparado com o que ouviste nesse ano civil. Os nomeados deste ano já aparecem, e os vencedores vão aparecer depois da cerimónia. Os vencedores e nomeados vêm da Wikipédia.'],

  'Real-Life Awards now cover the Billboard Music Awards':
    ['Prémios Reais agora inclui os Billboard Music Awards',
     'Prémios Reais tem um sexto separador, Billboard, para os Billboard Music Awards. A Wikipédia tem os vencedores e nomeados de 1990, 1991, 1999, de 2001 a 2006 e de todos os anos de 2011 a 2024, e as setas de ano saltam os anos pelo meio. Os anos seguintes também aparecem, por isso uma nova cerimónia surge assim que a Wikipédia tiver a página dela. Cada ano é comparado com o que ouviste nos doze meses antes da cerimónia. Quando a Wikipédia não diz quem ganhou uma categoria, os nomeados aparecem sem vencedor em vez de um palpite.'],

  'Real-Life Awards now cover the World Music Awards':
    ['Prémios Reais agora inclui os World Music Awards',
     'Prémios Reais tem um quinto separador, World Music, para os World Music Awards. A cerimónia realizou-se de forma irregular até 2014, e a Wikipédia só tem os vencedores de dez desses anos: 1999, 2001, de 2003 a 2008, 2010 e 2014. As setas e o seletor de ano saltam diretamente entre esses anos. A maioria dos anos só tem os vencedores, mas alguns também têm nomeados ou finalistas. Cada ano é comparado com o que ouviste nesse ano civil, ou nos doze meses antes da cerimónia quando a página indica a data. No telemóvel, os cinco separadores passam agora para uma segunda linha para nenhum ficar cortado.'],

  'Real-Life Awards now cover the iHeartRadio Music Awards':
    ['Prémios Reais agora inclui os iHeartRadio Music Awards',
     'Prémios Reais tem um quarto separador, iHeartRadio, ao lado de Grammys, VMAs e AMAs. Escolhe um ano a partir de 2014 para veres quais dos teus artistas foram nomeados e o que ganharam, e depois todas as categorias da noite com os vencedores a negrito e os teus artistas assinalados. Cada ano é comparado com o que ouviste nos doze meses antes dessa cerimónia. Remixes e covers mantêm a nota, como Savage (Remix), por isso um cover é atribuído a quem o cantou e não ao artista original. Os vencedores e nomeados vêm da Wikipédia.'],

  'Real-Life Awards now cover the American Music Awards':
    ['Prémios Reais agora inclui os American Music Awards',
     'Prémios Reais tem um terceiro separador, AMAs, ao lado de Grammys e VMAs. Escolhe um ano a partir de 1974 para veres quais dos teus artistas foram nomeados e o que ganharam, e depois todas as categorias da noite com os vencedores a negrito e os teus artistas assinalados. Os AMAs mudaram de data ao longo dos anos, por isso cada ano é comparado com o que ouviste nos doze meses antes dessa cerimónia. Em 2003 houve duas cerimónias, e aparecem as duas. Não houve cerimónia em 2023 nem em 2024, e o separador indica-o. Os vencedores e nomeados vêm da Wikipédia.'],

  'Real-Life Awards now cover the MTV VMAs':
    ['Prémios Reais agora inclui os MTV VMAs',
     'Prémios Reais tem agora dois separadores: Grammys e VMAs. Escolhe um ano a partir de 1984 e o separador VMAs mostra cada artista que ouviste nessa temporada e que foi nomeado, com o que ganhou, e depois todas as categorias da noite com os vencedores a negrito e os teus artistas assinalados. A temporada vai de julho a junho, tal como os próprios prémios. Os vencedores e nomeados vêm da Wikipédia, e cada ano só carrega uma vez.'],

  'Real life Grammys show up again':
    ['Os Grammys da vida real voltaram a aparecer',
     'Em Prémios, Prémios da Vida Real tinha deixado de mostrar vitórias e nomeações aos Grammy, porque o grammy.com mudou a forma como a pesquisa devolve as páginas de artistas. A pesquisa agora entende o novo formato, por isso o histórico de Grammys de cada artista volta a carregar.'],

  'Audio samples find the right recording more often':
    ['As amostras de áudio encontram a gravação certa mais vezes',
     'Nos Meus Grammys, o botão de reproduzir de um nomeado também procura o próprio álbum e reproduz a partir da lista de faixas, a começar pela faixa-título. Antes, um álbum cujas músicas também estão numa compilação, como To the Summit de Jon Schmidt, podia ficar sem amostra. Uma música cuja pesquisa só encontrava versões ao vivo ou acústicas agora também verifica o próprio álbum para encontrar a versão de estúdio, por isso I Write Sins Not Tragedies dos Panic! at the Disco toca a música verdadeira e não uma versão ao vivo. Uma versão remasterizada agora conta como a original.'],

  'Nominee picker shows the year and genres for every candidate':
    ['O seletor de nomeados mostra o ano e os géneros de cada candidato',
     'Nos Meus Grammys, cada música e álbum do seletor de nomeados mostra agora o ano de lançamento ao lado do artista, e cada candidato mostra até três géneros, não apenas os sugeridos no topo. As categorias de género continuam a mostrar até cinco. Os géneros da tua folha do Google aparecem logo. O resto é procurado online à medida que deslizas, por isso uma linha pode ser preenchida um ou dois segundos depois de aparecer. As respostas ficam guardadas no teu navegador, por isso da próxima vez que abrires o seletor aparecem logo.'],

  'Clearing the nominee picker now asks first':
    ['Limpar o seletor de nomeados pergunta agora antes',
     'Nos Meus Grammys, o botão Limpar do seletor de nomeados abre agora uma pequena janela de aviso sobre o seletor, com os botões Cancelar e Remover todos, antes de remover todos os nomeados da categoria. Cancelar vem selecionado, e Esc ou um clique fora da janela também cancelam. Um clique sem querer, ou um duplo clique, já não apague uma lista que montaste à mão. Se ainda não houver nomeados, não faz nada.'],

  'Nominee picker shows how well each candidate fits the category':
    ['O seletor de nomeados mostra quanto cada candidato encaixa na categoria',
     'Nos Meus Grammys, o seletor de nomeados põe agora uma pequena etiqueta de encaixe ao lado de cada candidato nas categorias de género e em Música do Verão e nas músicas da noite e da manhã, por exemplo 92% fit. Num prémio de género diz com que força a música, o álbum ou o artista está marcado com esse género: um género listado primeiro conta mais do que um listado em quinto, e um parente próximo como metal para Melhor Música Rock conta um pouco menos do que rock. Em Música do Verão é a parte das reproduções da música que caíram entre junho e agosto, e as músicas da noite e da manhã funcionam da mesma forma. Os encaixes fortes aparecem a dourado. Passa o rato sobre uma etiqueta para veres o que mede. As categorias que são um simples sim ou não, como Melhor Colaboração ou Melhor Versão, não a têm.'],

  'Each category card now says what it is about':
    ['Cada categoria diz agora do que se trata',
     'Nos Meus Grammys, cada cartão de categoria mostra uma linha curta por baixo do nome sobre o que cabe nela, para saberes o que procurar ao escolher os nomeados. Os prémios de género descrevem como o género soa, por exemplo Grunge diz guitarras distorcidas dos anos 90 cheias de angústia. As categorias que partem das mesmas músicas também se distinguem agora: Música do Ano é sobre a composição, Gravação do Ano sobre a interpretação e a produção, e Balada Rock e Riff/Solo de Guitarra dizem o que ouvir. As mesmas linhas aparecem na lista de categorias.'],

  'Expand all and Collapse all can skip categories that already have a winner':
    ['Expandir tudo e Recolher tudo podem ignorar as categorias que já têm vencedor',
     'Nos Meus Grammys, os botões Expandir tudo e Recolher tudo têm agora um seletor Todas / Sem vencedor à frente. Em Todas atuam em todas as categorias, como antes. Em Sem vencedor só abrem ou recolhem as categorias que ainda esperam um vencedor e deixam as decididas como estão. A escolha fica guardada neste dispositivo.'],

  'See how many categories still need a winner, and fold or open them all at once':
    ['Vê quantas categorias ainda precisam de vencedor, e recolhe ou abre todas de uma vez',
     'A barra acima das tuas categorias dos Meus Grammys mostra agora quantas ainda esperam um vencedor, por exemplo 3/12 por decidir. O número desce à medida que escolhes vencedores e fica dourado quando todas estão decididas. Ao lado estão os botões Expandir tudo e Recolher tudo, que abrem ou recolhem todos os cartões no ecrã com um clique.'],

  'Hide categories that already have a winner, or fold any card away':
    ['Oculta as categorias que já têm vencedor, ou recolhe qualquer cartão',
     'Os Meus Grammys têm um novo botão Ocultar decididas ao lado do seletor de vista. Ao ativá-lo, todas as categorias que já têm vencedor desaparecem e ficam só as que ainda tens de votar. O botão mostra quantas está a ocultar. Cada cartão de categoria tem também uma pequena seta no canto que o recolhe até mostrar só o nome; outro clique volta a abri-lo. Os cartões recolhidos ficam assim neste dispositivo até os abrires.'],

  'Contact Support now opens a message form':
    ['Contactar suporte agora abre um formulário de mensagem',
     'O chat de suporte deixou de funcionar, por isso Contactar suporte agora abre um formulário curto: introduza o seu e-mail e a sua mensagem, carregue em Enviar e ela chega até nós por e-mail. Respondemos diretamente para o endereço que introduziu. Se tiver sessão iniciada, o seu e-mail já aparece preenchido. Funciona no site principal e no guia de configuração.'],

  'Missing covers no longer use up the YouTube search limit':
    ['As capas em falta já não esgotam o limite de pesquisas do YouTube',
     'Quando uma capa não era encontrada no Deezer, iTunes ou Last.fm, o site procurava-a no YouTube como última tentativa. Todos os utilizadores partilham um pequeno limite diário do YouTube, por isso um único chart grande com muitas músicas raras podia esgotá-lo em minutos, e as pesquisas de imagens do YouTube deixavam de funcionar o resto do dia. Agora as capas só são procuradas automaticamente no Deezer, iTunes e Last.fm. Ainda pode escolher uma imagem do YouTube à mão no seletor de imagens, e o que já estava no YouTube mantém-se.'],

  'My Grammys works again after the Artist stats update':
    ['Os Meus Grammys voltaram a funcionar após a atualização das estatísticas de artistas',
     'Depois da atualização das estatísticas de Artista do Ano, partes dos Meus Grammys deixaram de funcionar: os resumos das categorias e a lista de vencedores podiam não carregar, e a consola enchia-se de erros. Duas partes do código tinham o mesmo nome, por isso uma substituía a outra. Agora têm nomes diferentes e tudo volta a carregar.'],

  'Nominee suggestions show all five genres':
    ['Sugestões de nomeados mostram os cinco géneros',
     'Nas categorias de género dos Meus Grammys, cada nomeado sugerido mostrava só os três primeiros géneros. Agora mostra até cinco, por isso todos os géneros da sua Google Sheet (Género 1 a Género 5) aparecem, tal como as etiquetas do Last.fm ou de um ficheiro CSV. Quando uma linha tem muitos géneros, passam para uma segunda linha em vez de apertar o título, o artista ou as reproduções.'],

  'Nominee suggestions are readable on phones':
    ['Sugestões de nomeados legíveis no telemóvel',
     'No telemóvel, a lista de nomeados sugeridos dos Meus Grammys tentava encaixar o título, o artista, as etiquetas de género, as reproduções e os botões numa só linha, e o título ficava tão estreito que aparecia uma letra por linha. Agora o título tem a sua própria linha ao lado da capa, e o artista, as etiquetas, as reproduções e os botões ficam nas linhas de baixo.'],

  'Artist of the Year stats show highlights, growth, plaques and records':
    ['As estatísticas de Artista do Ano mostram conquistas, crescimento, placas e recordes',
     'Quando abres o cartão de estatísticas de um artista no seletor de Artista do Ano, ele passa a contar toda a história do artista. Primeiro aparecem as conquistas em forma de distintivos, como um ano de revelação, o maior ano de sempre, êxitos e álbuns #1, êxitos no top 10, placas novas, sequências longas e a música mais ouvida. Ano a ano mostra uma barra por cada ano desde que o ouviste pela primeira vez, com a posição dele entre os artistas por baixo de cada barra e quanto cresceu ou desceu em relação ao ano anterior. Certificações mostra cada placa que as músicas e álbuns dele ganharam nesse ano, junto com o total de sempre. Recordes que tem mostra cada recorde dele no teu separador de Recordes, com medalhas para o primeiro, segundo e terceiro lugar.'],

  'Award nominee stats are easier to read':
    ['As estatísticas dos nomeados estão mais fáceis de ler',
     'Quando escolhes os nomeados nos Meus Grammys, a linha por baixo de cada sugestão era uma sequência de abreviaturas como "8 days · 5 wk · 4 mo · peak #1 · 1 wk at #1". Agora são poucas etiquetas curtas em palavras simples, como "#1 durante 1 semana", "4 dias seguidos" e "Ouvida em 8 dias", com a mais importante primeiro. O cartão de estatísticas que abre por baixo de cada linha também é mais fácil de seguir: começa com a posição da música no ano e quantas reproduções teve, depois mostra as reproduções por mês com o número em cada barra, a seguir os teus hábitos de audição e, por fim, como se saiu nas tuas tabelas semanais e mensais.'],

  'Genre awards follow the genres in your Google Sheet':
    ['Os prémios de género seguem os géneros da tua folha do Google',
     'Se a tua folha do Google tem as colunas Genre 1 a Genre 5, os prémios de género dos Meus Grammys passam a usá-las, por isso um género que mudes na folha muda as músicas e álbuns que se qualificam. Antes, os géneros da folha eram ignorados e cada música ficava com as etiquetas do artista no Last.fm, por isso editá-los não tinha efeito. Uma música usa os géneros da linha mais recente que tenha algum, e um álbum entra num género quando pelo menos metade das músicas etiquetadas entra. As músicas sem géneros na folha continuam a usar as etiquetas do artista. A grafia também já não importa: Dance-Pop, dance pop e dancepop contam como o mesmo género. Os nomeados que já escolheste ficam como estão, por isso limpa e volta a escolher os de uma categoria para a atualizar.'],

  /* ========== SETEMBRO 2026 ========== */

  'Genre awards say what the genre sounds like':
    ['Os prémios de género dizem como soa o género',
     'Em Configurar ano, todos os prémios de género tinham a mesma linha, "Pelas etiquetas de género do artista". Agora cada um descreve o seu género, por isso Melhor música shoegaze/dream pop diz "Paredes de guitarra enevoadas e vozes suaves e flutuantes" e Melhor música post-punk/new wave diz "Guitarras sombrias e angulosas, baixo marcante e sintetizadores frios dos anos 80". Os nomeados continuam a ser escolhidos da mesma forma.'],

  'Backups work again with big awards collections':
    ['As cópias de segurança voltam a funcionar com prémios grandes',
     'Quando os seus prémios passavam de um certo tamanho, as cópias de segurança em Definições → Perfil deixavam de ser guardadas sem aviso, porque a cópia inteira já não cabia numa só parte. Agora as cópias grandes são divididas em várias partes e voltam a ser juntadas ao restaurar, por isso voltam a ser guardadas independentemente de quantas categorias tiver. As cópias antigas continuam a ser restauradas como antes.'],

  'Play samples from My Grammys nominee cards':
    ['Ouça amostras a partir dos cartões de nomeados dos Meus Grammys',
     'Configurar ano tem um novo interruptor, Tocar amostras a partir dos cartões de nomeados. Com ele ligado, cada nomeado ganha um botão ♪ que toca uma amostra de 30 segundos, para ouvir os candidatos antes de escolher o vencedor. Clique outra vez para parar. Funciona nas cinco vistas, e clicar no ♪ nunca coroa o nomeado. Começa desligado, aplica-se a todos os anos e sincroniza entre os seus dispositivos.'],

  'Show your scores on My Grammys nominee cards':
    ['Mostre as suas notas nos cartões de nomeados dos Meus Grammys',
     'Configurar ano tem um novo interruptor, Mostrar as minhas notas nos cartões de nomeados. Com ele ligado, cada nomeado que avaliou mostra a sua nota de 0 a 10 ao lado, nas cinco vistas. Músicas e álbuns sem nota não mostram nada, e os artistas usam a média dos álbuns avaliados. Começa desligado, aplica-se a todos os anos e sincroniza entre os seus dispositivos.'],

  'Hide plays on My Grammys nominee cards':
    ['Ocultar reproduções nos cartões de nomeados dos Meus Grammys',
     'Configurar Ano tem um novo interruptor, Ocultar reproduções nos cartões de nomeados. Com ele ligado, os cartões de nomeados deixam de mostrar o número de reproduções, para que a votação seja sobre as tuas escolhas e não sobre os números. O seletor de nomeados continua a mostrá-las e as sugestões funcionam da mesma forma. A definição aplica-se a todos os anos e sincroniza entre os teus dispositivos.'],

  'Most Viral Song is now Favorite Viral Song':
    ['Música mais Viral passa a Música Viral Favorita',
     'O prémio Música mais Viral dos Meus Grammys passa a chamar-se Música Viral Favorita. Os nomeados e vencedores que já escolheste mantêm-se.'],

  'Best Collaboration suggests real team-ups, not duets':
    ['Melhor Colaboração sugere parcerias a sério, não duetos',
     'Gerar Nomeados sugeria para Melhor Colaboração qualquer música com dois ou mais artistas, por isso os duetos apareciam ali e também em Melhor Duo. Agora sugere parcerias em que só um canta porque o outro é DJ ou produtor (David Guetta, Tiësto, benny blanco), e músicas em que um dos artistas é um grupo ou banda. Cada artista é verificado no MusicBrainz, e cada nomeado diz porque entrou ("with a DJ/producer" ou "with a group"). Da primeira vez pode demorar até um minuto, porque o MusicBrainz permite uma consulta por segundo; as respostas ficam guardadas neste navegador, por isso depois demora segundos. Continuas a poder adicionar qualquer música à mão. Também corrigido: um nome de banda com "&", como Simon & Garfunkel, já não é separado em dois artistas.'],

  'Goth Rock song and album awards':
    ['Prémios de Música e Álbum de Rock Gótico',
     'Os Meus Grammys têm duas categorias novas de rock, Melhor Música de Rock Gótico e Melhor Álbum de Rock Gótico, desativadas por predefinição e no grupo Rock de Configurar Ano. Contam artistas marcados como rock gótico, deathrock, darkwave ou metal gótico. As primeiras bandas góticas marcadas como post-punk podem continuar a ser nomeadas em Post-Punk/New Wave.'],

  '16 rock award categories and a Rock group in Configure Year':
    ['16 categorias de rock e um grupo Rock em Configurar Ano',
     'Os Meus Grammys têm 16 categorias novas de rock, todas desativadas por predefinição. Músicas: Pop/Rock, Pop-Punk, Indie Rock, Rock Clássico, Hard Rock, Post-Punk/New Wave, Grunge/Alternativa dos Anos 90 e Shoegaze/Dream Pop. Álbuns: Indie Rock, Metal, Punk/Emo e Rock Progressivo/Psicadélico. Para a cerimónia: Melhor Interpretação Rock, Melhor Balada Rock e Melhor Riff/Solo de Guitarra, escolhidos por ti entre as músicas rock do ano, e Melhor Música Rock de Duo/Grupo, músicas rock de bandas e duos (o MusicBrainz distingue bandas de artistas a solo). Melhor Música Metal/Hard Rock é agora Melhor Música Metal, já que o hard rock tem o seu próprio prémio. Todos os prémios de rock, antigos e novos, estão agora juntos num grupo Rock na lista de Configurar Ano.'],

  'Configure Year: search, filter and browse the award categories':
    ['Configurar Ano: pesquisa, filtra e explora as categorias',
     'A lista de categorias em Configurar Ano ficou mais fácil de percorrer. Escreve na pesquisa para encontrar uma categoria pelo nome ou pelo tema ("rock", "álbum", "cover"). Filtra por categorias de músicas, álbuns ou artistas, ou pelas ativas ou inativas, e usa os chips para ver um grupo de cada vez. As categorias estão agrupadas em Prémios principais, Géneros, Álbuns e formatos, Tipos de música, Como ouves, Por diversão e Prémios de estatísticas, cada grupo com o seu próprio Ativar / Desativar. Cada categoria é agora um cartão com uma linha a explicar em que se baseia e um interruptor. Ativar tudo e Desativar tudo agem sobre o que está visível, por isso pesquisar "rock" e carregar em Ativar as visíveis liga todos os prémios de rock de uma vez.'],

  '22 new award categories, and Most Growth shows the change on the year before':
    ['22 categorias de prémios novas, e Maior Crescimento mostra a mudança face ao ano anterior',
     'Os Meus Grammys têm 22 categorias novas, todas desativadas por predefinição: ativa-as em Configurar Ano. Géneros novos: músicas Indie Pop, Metal/Hard Rock, Punk/Emo, Afrobeats e J-Pop/Anime, e álbuns de Jazz e Clássico/Instrumental. Formatos de álbum: Melhor EP, Melhor Álbum ao Vivo, Melhor Álbum de Estreia (o primeiro álbum de um artista na tua biblioteca, lançado este ano ou no anterior), Melhor Reedição/Remasterização e Melhor Coletânea/Grandes Êxitos. Tipos de música: Melhor Versão (Cover) e Melhor Versão Acústica (identificadas pelo título), Melhor Regresso ao Passado (álbuns lançados há 10 anos ou mais), Melhor Faixa Escondida (faixas de álbum que nunca ouviste como single) e Melhor Música de Separação. Pela forma como ouves: Melhor Música da Noite (das 22h às 4h), Melhor Música da Manhã (das 5h às 11h) e Artista mais Fiel (ouvido todos os meses). Por diversão: Prazer Culpado do Ano, e Música mais Subestimada, que usa a popularidade no Deezer para encontrar músicas que adoraste e que poucos ouvem. Maior Crescimento mostra agora a mudança de cada nomeado face ao ano anterior, em percentagem e em reproduções, nos cartões e na janela de escolher nomeados. Também já não deixa de contar as reproduções do último dia do ano anterior.'],

  'Folk/Acoustic, Singer-Songwriter and Deluxe Album awards':
    ['Prémios Folk/Acústico, Cantautor e Álbum Deluxe',
     'Os Meus Grammys têm cinco categorias novas, todas desativadas por predefinição: ativa-as em Configurar Ano. Melhor Música Folk/Acústica e Melhor Álbum Folk/Acústico abrangem artistas de folk-pop e acústicos, e Melhor Música de Cantautor é mais ampla, para compositores acústicos e de piano que não estão marcados como folk. Melhor Álbum Deluxe e Melhor Capa de Álbum Deluxe são para edições deluxe, expandidas, de aniversário e outras especiais, identificadas pelo título do álbum ("Deluxe", ou um "… Edition" entre parênteses). Uma edição deluxe que não o diz no título pode ser escolhida à mão.'],

  'Most Viral Song award, and Album You Discovered Late is now Best Album Discovered Late':
    ['Prémio de Música mais Viral, e Álbum que Descobriste Tarde passa a Melhor Álbum Descoberto Tarde',
     'Os Meus Grammys têm uma nova categoria, Música mais Viral, desligada por predefinição: liga-a em Configurar Ano e escolhe os teus nomeados entre as músicas que mais ouviste nesse ano. A categoria Álbum que Descobriste Tarde passa a chamar-se Melhor Álbum Descoberto Tarde, com as mesmas regras de antes.'],

  'Reorder the nominees right on the category cards':
    ['Reordena os nomeados diretamente nos cartões de categoria',
     'A ordem dos nomeados num cartão de categoria dos Meus Grammys, que é também a ordem que a cerimónia segue, pode agora ser mudada no próprio cartão em vez de na janela de escolher nomeados. Com o rato, arrasta um nomeado para o lugar de outro, em qualquer vista. No telemóvel ou com o teclado, carrega em Reordenar no fundo do cartão para teres botões de seta em cada nomeado, e em Concluído quando terminares. Enquanto Reordenar estiver ativo, clicar num nomeado não o coroa.'],

  'Year stats for every candidate when picking Song, Album and Artist of the Year':
    ['Estatísticas do ano de cada candidato ao escolher Música, Álbum e Artista do Ano',
     'Ao escolheres nomeados para Música do Ano, Álbum do Ano ou Artista do Ano, cada linha mostra agora como lhe correu o ano: a maior sequência de dias seguidos, em quantos dias, semanas e meses o ouviste, a melhor posição na tabela semanal e as semanas em #1, e o dia com mais reproduções. O botão Stats abre todo o resto: a posição do ano por reproduções e a fatia do teu total, a maior sequência semanal, o melhor dia, semana e mês, a primeira e a última reprodução, quantas músicas e álbuns de um artista ouviste ou quantas faixas de um álbum, os recordes nas tabelas semanais e mensais, e uma barra para cada mês. Também podes ordenar a lista por maior sequência, mais dias ouvido, melhor dia, mais semanas em #1 ou melhor posição. Tudo conta só as reproduções dentro do período de elegibilidade desse ano.'],

  'Change the picture of any nominee in My Grammys':
    ['Muda a imagem de qualquer nomeado nos Meus Grammys',
     'Cada imagem das vistas Destaque, Blocos, Colagem e Carrossel, e cada miniatura da janela de escolher nomeados, tem agora o mesmo seletor de imagem das tabelas: passa o cursor por cima e clica no lápis, ou mantém-na premida no telemóvel. Clicar no lápis nunca coroa nem adiciona o nomeado. A imagem que escolheres é usada para essa música, álbum ou artista em toda a app e fica guardada na tua conta.'],

  'New ways to view the nominees in My Grammys':
    ['Novas formas de ver os nomeados nos Meus Grammys',
     'Os cartões de categoria dos Meus Grammys podem agora ser mostrados de cinco formas, no seletor Vista por cima deles: Boletim, a lista de texto de sempre; Destaque, com o vencedor em grande sobre um desfoque da sua imagem e os outros nomeados em linhas com imagem e reproduções; Blocos, uma grelha de capas e fotos de artistas; Colagem, um mosaico com todos os nomeados e o vencedor em tamanho duplo; e Carrossel, uma linha a toda a largura por categoria com os nomeados como pósteres que se deslizam para o lado. Clicar num nomeado continua a coroá-lo em todas as vistas, e os botões Alterar e Playlist continuam lá. As imagens que escolheste para uma música, artista ou álbum também aparecem aqui, e a vista que escolheres fica guardada nesse dispositivo.'],

  'Pick the picture in song, artist and album profiles, saved to your account':
    ['Escolha a imagem nos perfis de músicas, artistas e álbuns, guardada na sua conta',
     'A imagem no topo do perfil de uma música, artista ou álbum tem agora o mesmo seletor das tabelas: passe o cursor por cima e clique no lápis, ou mantenha premido no telemóvel. Uma imagem que escolher aí também aparece ao lado dessa música, artista ou álbum nas tabelas, e vice-versa. As imagens escolhidas são agora também guardadas na sua conta, pelo que o acompanham nos seus outros dispositivos, e voltar uma para automático também é sincronizado. Uma imagem que carregou a partir do seu dispositivo fica apenas nesse dispositivo.'],

  'Easier-to-read score chips in the light themes':
    ['Etiquetas de nota mais fáceis de ler nos temas claros',
     'Nos temas claros, algumas etiquetas de nota ao lado de músicas e álbuns ainda eram difíceis de ler, sobretudo as douradas de Masterpiece e as verdes de Essential nas linhas coloridas do topo de uma tabela. Agora todas as cores de nota são um pouco mais fortes nos temas claros, pelo que cada uma se lê bem em qualquer linha, e os anéis e barras de nota condizem. As cores mantêm a ordem da melhor para a pior, e os temas escuros continuam iguais.'],

  'Readable rating and medal colours in the light themes':
    ['Cores de avaliações e medalhas legíveis nos temas claros',
     'Nos temas claros, as cores das avaliações eram as dos temas escuros, pelo que Masterpiece, o anel de nota e as etiquetas de nota apareciam em amarelo vivo sobre branco, e as outras cores de nota também eram pálidas. Agora usam as cores mais escuras de cada tema claro. Os números de pico em ouro, prata e bronze nos perfis de músicas, artistas e álbuns, e os números de música mais ouvida de sempre e do ano, também ganharam versões mais escuras e fáceis de ler. Os temas escuros continuam iguais.'],

  'Song and artist profiles say which chart each stat is from':
    ['Os perfis de músicas e artistas indicam de que tabela é cada dado',
     'O cartão de estreia no perfil de uma música indica agora de que tabela se trata, por exemplo Weekly Chart Debut · Week of Sep 20, 26 ou Monthly Chart Debut · Sep 2026. Mostra a estreia na tabela a partir da qual abriu a música, ou na semanal se a abrir a partir da tabela de sempre. Antes misturava as tabelas semanal, mensal e anual e podia mostrar uma estreia mensal como se fosse uma data. As semanas, meses e anos na tabela, as reentradas e o tempo no #1 indicam agora também a sua tabela, nos perfis de músicas e de artistas.'],

  'Click a name in the Songs and Albums charts to open it':
    ['Clique num nome nas tabelas de Músicas e Álbuns para o abrir',
     'Nas tabelas de Músicas e Álbuns, o título da música, o título do álbum e o nome do artista são agora ligações. Clique numa música ou num álbum para abrir o respetivo perfil, ou no artista para abrir o dele. Quando uma música credita mais de um artista, cada nome é uma ligação própria. Various Artists nos álbuns de compilação continua a ser texto simples, pois não tem perfil próprio. Os nomes têm o mesmo aspeto de antes até passar o cursor por cima.'],

  'Easier-to-read gold in the light themes':
    ['Dourado mais fácil de ler nos temas claros',
     'Nos temas claros, o dourado brilhante do seletor de nomeados quase não se via sobre o fundo branco: a linha do ano e da categoria no topo, os números de posição dos teus nomeados e as marcas das linhas escolhidas. Agora usam um dourado mais profundo, fácil de ler, e o vermelho dos botões de remover também ficou mais escuro. Os selos de Venceu nos prémios reais e o botão Partilhar da cerimónia receberam a mesma correção. Os temas escuros ficam iguais.'],

  'A roomier nominee picker':
    ['Um seletor de nomeados mais espaçoso',
     'A janela onde escolhes os nomeados de um prémio tem agora mais espaço. Os nomeados que escolheste ficam num painel próprio de Nomeados no topo, como cartões iguais em duas colunas, cada um com uma imagem maior e o nome e o artista em linhas separadas, por isso os títulos longos já não são cortados ao fim de poucas letras. Uma lista completa de 8 cabe sem deslocar. Preencher top 8, Top 5 e Limpar passaram para esse painel, ao lado de uma contagem de quantos escolheste. Arrasta os cartões para os reordenar, como antes. No telemóvel os cartões ficam numa só coluna.'],

  'Break ties in the automatic awards yourself':
    ['Desempata tu mesmo os prémios automáticos',
     'Quando um prémio automático como Música Mais Ouvida ou Maior Sequência Diária termina empatado, o cartão do prémio mostra agora tudo o que empatou em primeiro lugar por baixo do vencedor. Carrega num para o tornar o vencedor, e muda de ideias as vezes que quiseres. A tua escolha mantém-se quando voltas a gerar os prémios, desde que esse item continue empatado em primeiro. Antes, o prémio ia sem aviso para o item empatado que aparecesse primeiro. Os anos gerados antes desta mudança precisam de voltar a Gerar para os empates aparecerem.'],

  'See and hear every nominee while you pick them':
    ['Vê e ouve cada nomeado enquanto os escolhes',
     'Ao escolher os nomeados de qualquer prémio, cada linha e cada nomeado escolhido mostra agora a arte da música, a capa do álbum ou a foto do artista, para a lista se perceber num relance. As imagens carregam à medida que aparecem ao deslizar. Todas as categorias, exceto Vídeo do Ano, têm também um botão ♪ que toca uma amostra de 30 segundos e um botão do YouTube que abre uma pesquisa num novo separador. Para um artista, a amostra é uma das suas músicas mais conhecidas. Carregar em qualquer um dos botões não nomeia nada; carregar na linha, sim. Vídeo do Ano mantém o seu próprio botão de vídeo.'],

  'Compare album covers at a glance when picking Best Album Cover':
    ['Compara as capas num relance ao escolher a Melhor Capa de Álbum',
     'O seletor de Melhor Capa de Álbum mostra agora uma capa pequena ao lado de cada álbum, para as poderes comparar sem abrir uma a uma. O botão ⤢ de uma linha mostra essa capa no maior tamanho que cabe no seletor. Carregar em ⤢ não nomeia o álbum; carregar na linha, sim. Melhor Conceito de Álbum mantém o botão i com o texto e a lista de faixas.'],

  'See what an album is about when picking Best Album Concept':
    ['Vê do que trata um álbum ao escolher o Melhor Conceito de Álbum',
     'Ao escolher os nomeados para Melhor Conceito de Álbum, cada álbum tem um botão i. Mostra a capa em grande, o pequeno texto do Last.fm sobre o álbum, que costuma explicar a história ou o tema, e a lista de faixas com quantas vezes ouviste cada música nesse ano. As músicas que ouviste e que não estão na lista normal, como faixas bónus, aparecem no fim. Carregar em i não nomeia o álbum; carregar na linha, sim.'],

  'Watch a bit of each video when picking Video of the Year':
    ['Vê um pouco de cada vídeo ao escolher o Vídeo do Ano',
     'Ao escolher os nomeados para Vídeo do Ano, cada música tem um botão ▶. Encontra o videoclipe no YouTube e reprodu-lo numa pequena janela no topo do seletor, para te lembrares de como é o vídeo antes de o nomeares. Carregar em ▶ não nomeia a música; carregar na linha, sim. Carrega em ■ ou ✕ para fechar o vídeo e, se o YouTube encontrou o vídeo errado, uma ligação abre a pesquisa no YouTube.'],

  'The setup guide is now fully in Spanish and Portuguese':
    ['O guia de configuração está agora todo em espanhol e português',
     'No guia de configuração só mudava o menu de idioma; cada passo, dica e resposta de resolução de problemas ficava em inglês. Agora o guia inteiro segue o idioma que escolheres, em espanhol, português do Brasil e português europeu, incluindo os botões e o progresso do passo a passo. Os menus e botões do próprio Google aparecem com os nomes que o Google mostra no teu idioma. Os botões da janela de Definições do dankcharts mantêm os nomes em inglês, porque essa janela ainda está em inglês.'],

  'Albums, Singles, EPs and All now keep their side charts in step':
    ['Álbuns, Singles, EPs e Todos mantêm agora as secções laterais em sintonia',
     'Com singles ou EPs em tabelas próprias, o Fora do Top podia mostrar um lançamento que ainda estava na tabela, porque contava a semana sem as reproduções que um single empresta ao seu álbum. Fora do Top, Quase no Top, Novas Entradas, as etiquetas PEAK, a animação da tabela e as caixas do percurso contam agora tudo da mesma forma que a tabela acima delas. Na vista Todos seguem a tabela combinada, e em Álbuns, Singles ou EPs cada uma segue a sua. As faixas sem álbum também deixam de ocupar lugares escondidos na tabela de álbuns da semana passada.'],

  'Switching phones no longer wipes your nominations':
    ['Mudar de telemóvel já não apaga as tuas nomeações',
     'Um telemóvel que tinha ficado aberto com uma cópia antiga dos teus prémios guardava essa cópia velha por cima dos nomeados que entretanto tinhas escolhido noutro telemóvel. Agora cada gravação verifica primeiro se há alterações mais recentes, mantém-nas e junta as tuas por cima. A página de prémios também se atualiza com os teus outros dispositivos quando voltas à aplicação.'],

  'Backups you can restore from Settings':
    ['Cópias de segurança que podes restaurar nas Definições',
     'As tuas definições, prémios e avaliações são copiados para a tua conta uma vez por dia, e os prémios também sempre que outro dispositivo os altera. Definições → Perfil mostra as últimas 30 cópias, e qualquer uma pode ser restaurada em todos os dispositivos com um clique. Também podes fazer uma cópia à mão, ou descarregar um ficheiro de cópia para guardares, por exemplo no Google Drive.'],

  'Clearer record cards in the awards summary':
    ['Cartões de recordes mais claros no resumo dos prémios',
     'Os cartões de mais nomeações e mais vitórias de sempre leem-se agora como uma corrida: o detentor do recorde em cima, com um número maior, e os perseguidores em linhas numeradas próprias, com uma barra que mostra o quão perto ficaram, em texto maior e mais brilhante. Músicas e álbuns também indicam o artista ao lado de cada perseguidor. A pequena seta por baixo do seletor de ano só aparece agora ao passar o rato.'],

  'Jump straight to any year on the awards page':
    ['Salta diretamente para qualquer ano na página de prémios',
     'Clica no ano para abrir uma grelha de anos e escolher um, em vez de avançar um a um com as setas. Os Meus Grammys vão até ao ano da tua primeira reprodução, e as setas ficam desativadas nas pontas. Os Prémios Reais têm o mesmo seletor, até à primeira cerimónia, em 1959. A lista de nomeações no resumo dos prémios também escreve “nomeações” por extenso em vez de “nom.”.'],

  'Fresher year picker and buttons on the awards page':
    ['Seletor de ano e botões renovados na página de prémios',
     'O ano e as setas ficam agora juntos num único controlo arredondado, com setas limpas, tanto nos Meus Grammys como nos Prémios Reais. Configurar Ano é um botão claro com contorno e ícone de definições, e Gerar Nomeados é um botão sólido na cor do teu tema, com um ícone de brilho e um halo suave.'],

  'Easier-to-read nominations list in the awards summary':
    ['Lista de nomeações mais fácil de ler no resumo dos prémios',
     'Na lista "Mais nomeações" a barra fica agora logo por baixo do nome de cada artista, para que os números já não fiquem isolados do outro lado de um espaço vazio. O número de nomeações está maior e a negrito, e as vitórias aparecem como uma pastilha dourada com troféu.'],

  'Records tab works again for libraries with compilations':
    ['O separador Recordes volta a funcionar em bibliotecas com compilações',
     'Em algumas bibliotecas o separador Recordes ficava vazio e só pedia para carregares os dados. Acontecia quando um single que ouviste conta para uma compilação de Vários Artistas: o cálculo tropeçava nesse álbum e parava antes de mostrar qualquer recorde. As compilações são agora preparadas corretamente em qualquer caso, por isso todas as secções de recordes voltam a ficar preenchidas.'],

  'Send any playlist to Soundiiz as text':
    ['Envia qualquer playlist para o Soundiiz como texto',
     'A janela Adicionar à playlist tem agora a opção Copiar como texto para o Soundiiz, por baixo de Nova playlist. Abre a mesma janela Exportar playlist que as tabelas usam, já preenchida com essas músicas: uma linha Artista - Título por música para copiar (com o álbum, se quiseres), um .txt ou .csv para descarregar, sugestões de nome de playlist para copiar e os passos para a importar no Soundiiz, que depois cria a playlist no Spotify, Apple Music, YouTube Music, Deezer e outros. Funciona em todos os botões ♫ Playlist da aplicação, incluindo o novo das categorias dos Meus Grammys, para que os nomeados de uma categoria vão diretos para o teu serviço de streaming. Copiar um nome sugerido com apóstrofo também já funciona como deve ser.'],

  'Make a playlist of a category’s nominees':
    ['Cria uma playlist com os nomeados de uma categoria',
     'Cada categoria dos Meus Grammys com nomeados tem agora um botão ♫ Playlist ao lado de Alterar. Põe todos os concorrentes numa playlist, nova ou existente, para os ouvires a todos antes de coroar um vencedor. Um nomeado que é uma música entra sozinho. Um álbum acrescenta todas as músicas dele que ouviste no período de elegibilidade desse ano, da mais ouvida para a menos. Um artista acrescenta as suas cinco músicas mais ouvidas no período. As categorias atribuídas automaticamente não têm o botão, já que não há nada para decidir. Funciona da mesma forma com bibliotecas do Last.fm, Google Sheets e CSV.'],

  'Award credit for collaborating artists, now in Settings too':
    ['Crédito de prémios para artistas colaboradores, agora também nas Definições',
     'O interruptor que faz as nomeações e vitórias dos Meus Grammys contarem para todos os artistas de uma gravação está agora também nas Definições, em Tabelas → Comportamento, como Os prémios contam para artistas convidados e colaboradores. Antes só estava em Configurar Ano, onde era fácil de passar despercebido. Os dois interruptores ficam sincronizados e aplicam-se de imediato. Com ele ligado, colaborações escritas com &, x, and ou vs (como Lady Gaga & Bruno Mars) passam também a dar crédito a cada artista. Isto só acontece quando todos os nomes do crédito são também artistas próprios na tua biblioteca, por isso duplas como Simon & Garfunkel continuam a contar como um só nome.'],

  'The ceremony’s final stats show who won the most':
    ['As estatísticas finais da cerimónia mostram quem ganhou mais',
     'No fim da cerimónia os resultados já são conhecidos, por isso as estatísticas finais terminam agora com Mais vitórias do ano, em vez de um ranking de nomeações. Cada artista que venceu tem o seu próprio bloco com fotografia, número de vitórias e nomeações e todos os prémios que levou para casa: um troféu, a capa da música ou do álbum (ou a fotografia do artista, nos prémios de artista), o nome da música ou do álbum e o nome do prémio. Quando os artistas convidados são contados, uma vitória como convidado indica também o artista principal. As ligações partilhadas da cerimónia mostram isto depois de Atualizar ligação. O ranking de nomeações na página dos Meus Grammys também ficou bem alinhado: as barras começavam em pontos diferentes nas linhas com e sem contagem de troféus.'],

  'Final stats at the end of the ceremony, and credit for featured artists':
    ['Estatísticas finais no fim da cerimónia, e crédito para artistas convidados',
     'A chamada final da cerimónia termina agora com Estatísticas finais e recordes: os líderes de sempre em nomeações e vitórias, já com os resultados deste ano, e o ranking final de nomeações do ano com as vitórias de cada artista. Qualquer recorde que tenha mudado de dono durante a cerimónia é marcado como Novo. As ligações partilhadas da cerimónia também o incluem, depois de carregares em Atualizar ligação. Um novo interruptor Contar artistas convidados em Configurar Ano faz uma nomeação ou vitória contar para todos os participantes, e não só para o artista principal. Lê os convidados no nome do artista (feat., ft., featuring, with ou uma lista com vírgulas) e no título da música, como em (feat. A & B). As duplas escritas com & continuam a ser um só nome. Aplica-se às estatísticas e recordes de todos os anos e à contagem de Grammys nas páginas de artista, e sincroniza entre os teus dispositivos. Funciona da mesma forma com bibliotecas do Last.fm, Google Sheets e CSV.'],

  'Stats & records at the top of every My Grammys year':
    ['Estatísticas e recordes no topo de cada ano dos Meus Grammys',
     'Cada ano dos Meus Grammys abre agora com um resumo por cima dos nomeados. Mostra os líderes de sempre em nomeações e em vitórias para artistas, álbuns e músicas, contados até esse ano — por isso, voltar a um ano anterior mostra os recordes tal como estavam na altura, com os dois seguintes por baixo de cada líder. Por baixo vem o ranking do ano com os artistas mais nomeados e as suas vitórias. Cada detentor de recorde e cada artista do ranking tem a sua fotografia ou capa. A cerimónia abre com o mesmo resumo como primeiro diapositivo, antes da primeira categoria. Aí ficam de fora as vitórias deste ano e as categorias automáticas, para não revelar nada antes de se abrir um envelope. As ligações partilhadas da cerimónia também levam o resumo. Um artista recebe crédito pelas suas músicas e álbuns, além das categorias de artista. Funciona da mesma forma com bibliotecas do Last.fm, Google Sheets e CSV.'],

  'Share your awards ceremony with a link':
    ['Partilha a tua cerimónia de prémios com uma ligação',
     'Há um novo botão Partilhar ao lado de Ver cerimónia. Cria uma ligação que qualquer pessoa pode abrir para ver a tua cerimónia — os nomeados com as suas capas, os envelopes selados, a revelação dos vencedores com excertos das músicas e a chamada final — sem conta e sem dados musicais próprios. O teu nome aparece se tiveres definido um nome de apresentação. Só a cerimónia é partilhada: os nomeados, os vencedores e as imagens deles, nada mais da tua biblioteca. A ligação é um retrato do momento, por isso depois de mudares nomeados ou vencedores carrega em Atualizar ligação, e a ligação que já enviaste passa a mostrar a nova versão. Deixar de partilhar retira-a para toda a gente. Criar uma ligação exige iniciar sessão com o Google, para que só tu a possas atualizar ou remover. Funciona da mesma forma com bibliotecas do Last.fm, Google Sheets e CSV.'],

  'Share Your Soundtrack rebuilt on the same five-design system':
    ['Partilhar a Sua Trilha Sonora refeito com o mesmo sistema de cinco designs',
     'O cartão de partilha da Trilha Sonora era o último ainda na receita antiga: um único layout fixo de 360 píxeis, tudo na pequena fonte monoespaçada, um índigo fixo que ignorava o tema que estivesses a usar, nenhuma imagem e — na versão alta — um terço da imagem vazio por baixo da última música. Agora funciona exatamente como as imagens da tabela, do percurso e de uma entrada. Escolhe um design: Recap (um cabeçalho sobre os blocos de estatísticas com os dois top cinco por baixo, lado a lado no formato quadrado), Wrapped (o teu artista n.º 1 como um grande retrato redondo com o número de reproduções, e depois as músicas), Collage (só rostos e capas, por ordem), Minimal (sem imagens, os números seguram tudo) ou Poster (o teu artista n.º 1 desfocado por trás do cartão inteiro). Escolhe uma paleta: Tema da aplicação segue o tema que estiveres a usar, Onyx, Aurora, Ember, Bloom, Moss e Paper ficam fixas, e Capa lê as cores das imagens e constrói o cartão com elas. Escolhe um formato: Publicação 1:1, Retrato 4:5 ou História 9:16. Artistas e músicas trazem agora as suas imagens, vindas do Deezer, iTunes, Last.fm ou YouTube, e as listas esticam para preencher o cartão em vez de pararem a meio. As novas descobertas e o teu dia de pico juntam-se às reproduções, dias ativos e artistas na linha de estatísticas; podes mostrar ou esconder qualquer um, escolher entre três e dez entradas e ajustar um único controlo de tamanho do texto. Está tudo agora numa verdadeira janela de pré-visualização, com os botões Copiar e Partilhar ao lado de Descarregar.'],

  'The Soundtrack image is four times the resolution':
    ['A imagem da Trilha Sonora tem quatro vezes mais resolução',
     'Era desenhada a 360 píxeis e duplicada na exportação, e por isso o texto parecia desfocado mal era aberto num telemóvel. Agora é composta nos 1080 completos e exportada a 2160 por predefinição, com a opção Normal se preferires um ficheiro mais pequeno. As imagens são pedidas no maior tamanho que cada loja disponibiliza, e as fontes têm tempo para carregar antes de a imagem ser gerada.'],

  'Share images rebuilt: twelve designs, eight palettes, three shapes':
    ['Imagens de partilha refeitas: doze designs, oito paletas, três formatos',
     'As imagens de partilha tinham-se tornado um layout rígido por cartão com uma parede de controlos deslizantes ao lado — onze para uma tabela, mais onze para uma entrada — e todas as imagens saíam iguais: uma barra de cabeçalho em gradiente, linhas às riscas, texto minúsculo e muitas caixas. Os três tipos de cartão foram redesenhados de raiz e começam agora por um design que escolhes, em vez de um tamanho que vais afinando. Uma tabela pode ser Editorial (um cabeçalho de revista sobre linhas arejadas com filetes finos), Minimal (só texto, sem imagens, o máximo de espaço), Spotlight (o n.º 1 em grande com a sua capa e o resto por baixo), Grid (só capas, por ordem, dimensionadas para encher o cartão) ou Poster (a capa do n.º 1 desfocada por trás de tudo). Um percurso pode ser Timeline — o percurso desenhado como uma verdadeira linha de posição ao longo do tempo, com o pico marcado a dourado e as falhas deixadas como falhas, para que uma reentrada não pareça uma sequência contínua —, Chips (as antigas caixinhas, reajustadas) ou uma Ficha de estatísticas. Uma única entrada pode ser Cover (a capa a ocupar tudo, com a posição em grande na parte de baixo), Split, Frame ou Ticket. Ao lado do design há uma paleta: Tema da aplicação segue o tema que estiveres a usar, depois Onyx, Aurora, Ember, Bloom, Moss e Paper ficam fixas seja qual for o tema da aplicação, e Capa lê as cores da própria imagem e constrói o cartão à volta delas. Há um novo tamanho Retrato 4:5 ao lado de Publicação e História, já que 4:5 é o formato mais alto que uma publicação no feed mantém. Tudo o resto que podias ajustar continua lá — o que mostrar e esconder, de que loja vêm as imagens, quantas entradas, e um único controlo de Tamanho do texto em vez dos antigos deslizantes — e o painel do percurso ganhou os botões Copiar e Partilhar, como o da tabela.'],

  'Shared images are four times the resolution':
    ['As imagens partilhadas têm quatro vezes mais resolução',
     'Os cartões eram compostos com 540 píxeis de largura e duplicados na exportação, o que punha uma imagem de 1080 px no Instagram e deixava o texto desfocado mal se fazia zoom. Agora são compostos nos 1080 completos e exportados a 2160 por predefinição, com a opção Normal se quiseres um ficheiro mais pequeno. As capas são pedidas no maior tamanho que cada loja disponibiliza, em vez da miniatura de 300 px que a pesquisa devolve, por isso aguentam o tamanho maior, e as fontes têm tempo para carregar antes de a imagem ser gerada, para que nada saia numa fonte de recurso.'],

  'New My Grammys category: Best Album Concept':
    ['Nova categoria nos Meus Grammys: Melhor Conceito de Álbum',
     'Melhor Capa de Álbum já te deixava premiar a capa; não havia nada para o disco por trás dela — o álbum construído como uma única ideia, e não como um conjunto de músicas. Melhor Conceito de Álbum é uma nova categoria de álbum no boletim dos Meus Grammys, desligada por predefinição como as outras opcionais; ativa-a na lista de categorias de um ano e aparece com todos os concorrentes para escolheres e um diapositivo próprio na cerimónia. Qualquer álbum que tenhas ouvido no período de elegibilidade desse ano pode ser nomeado.'],

  'Remixes and stylised artist names find their preview again':
    ['Remisturas e nomes de artista estilizados voltam a encontrar o seu excerto',
     'Confirmar que um excerto era mesmo a gravação certa impediu a cerimónia de tocar a música errada, mas também a deixou calada em faixas que devia encontrar. JOYRIDE. - Revved Up Remix, da Kesha, mostrava “nenhum excerto encontrado” apesar de a remistura estar disponível em streaming: a loja tem-na como “Ke$ha”, e tirar o cifrão deixava um nome que não correspondia a nada. As grafias estilizadas são agora lidas como as letras que representam, por isso Ke$ha, P!nk, A$AP e MØ correspondem aos nomes que tens. A pesquisa também desiste menos facilmente. As duas lojas filtram por cada palavra que recebem, por isso o nome de uma remistura que não conhecem não devolve nada — nem sequer a música a que pertence. Agora a pesquisa retira a versão e depois os créditos de convidados até aparecer alguma coisa, o que encontra a gravação original quando uma remistura em particular não existe mesmo. O nome da gravação é mostrado sempre que não é exatamente o título do próprio nomeado, para que um substituto nunca entre às escondidas, e os créditos são agora comparados como um conjunto de nomes, por isso a edição que lista todos os artistas ganha à que só indica o principal. Todas as remisturas testadas numa categoria de Melhor Remistura — Kesha, The Weeknd, Tate McRae, Taylor Swift, Alex Warren, Selena Gomez — encontram agora a sua própria remistura, em vez do original ou de nada.'],

  'The ceremony plays the right song now, not a remix or a karaoke cover':
    ['A cerimónia toca agora a música certa, e não uma remistura ou um karaoke',
     'O excerto de 30 segundos ficava com o que as lojas de música devolviam primeiro, sem nunca confirmar se era a gravação certa — e o primeiro resultado está muitas vezes errado. Pesquisar The Fate of Ophelia, da Taylor Swift, devolvia primeiro a remistura dos Chainsmokers e em segundo um comentário falado “Track by Track”, com a verdadeira música em terceiro, por isso a cerimónia anunciava o vencedor e depois tocava uma remistura, ou alguém a falar. Versões de bandas de tributo e quartetos de cordas, karaokes e gravações ao vivo também aparecem muito acima, e um nomeado que é ele próprio uma remistura recebia o original. Agora cada resultado é comparado com o nomeado antes de tocar: o artista tem de corresponder, o título tem de corresponder, e uma versão remistura, ao vivo ou acústica só toca se for isso que o nomeado realmente é. Quando nada corresponde com segurança, o leitor fica em silêncio e di-lo, porque o silêncio é melhor do que a música errada no momento em que o envelope é aberto. O leitor também indica a gravação que encontrou, por isso uma má correspondência fica óbvia em vez de apenas confusa, e quando há mais do que uma versão plausível um pequeno botão ao lado toca a melhor correspondência seguinte. O Deezer é agora também uma verdadeira alternativa — a pergunta era-lhe feita, mas a resposta nunca era lida, por isso o que a primeira loja não tinha simplesmente não tocava.'],

  'The ceremony no longer gives away the winner of the automatic awards':
    ['A cerimónia já não revela o vencedor dos prémios automáticos',
     'As categorias automáticas — Música mais ouvida, Maior sequência diária de um álbum, Artista com mais dias ouvido e as restantes — não são votadas: não têm concorrentes, só o nome que as tuas reproduções já decidiram. A cerimónia não sabia disso e mostrava esse único nome como cartão de nomeado por cima do envelope, por isso cada uma dessas categorias mostrava a resposta antes de abrires fosse o que fosse, o que tirava todo o suspense à reta final do espetáculo. Esses diapositivos mostram agora um cartão selado em branco e uma linha a explicar que não há nomeados, e o nome só aparece quando o envelope se abre, com a capa, o troféu e os confettis como em qualquer outra categoria. As categorias que escolhes tu não mudam: continuam a mostrar todos os concorrentes antes, porque ver quem está a concurso é a graça da coisa.'],

  'The My Grammys nominee cards look like ballots now':
    ['Os cartões de nomeados dos Meus Grammys parecem agora boletins de voto',
     'Os cartões de categoria eram caixas simples: uma faixa cinzenta de cabeçalho, uma coluna de círculos e um vencedor marcado apenas por um leve tom dourado numa linha — doze lado a lado pareciam uma folha de cálculo e não um boletim de prémios. Cada cartão tem agora um fino trilho colorido no rebordo de cima, na cor do seu tipo, por isso as categorias de música, álbum e artista distinguem-se num relance, e a mesma cor passa pelo ícone, pelo brilho ao passar o rato e pelo botão do rodapé. Os nomeados são numerados 01, 02, 03 à esquerda, na fonte monoespaçada, como num boletim impresso, e o vencedor sai da lista para uma faixa dourada a toda a largura, com um trilho dourado e um único reflexo metálico quando a grelha é desenhada. Os títulos longos de remisturas já não ocupam três linhas a desalinhar a grelha — são encurtados, com o texto completo ao passar o rato — e os cartões aparecem em onda em vez de todos ao mesmo tempo. Uma categoria decidida fica toda dourada, por isso um boletim completo vê-se do outro lado da página. O seletor de ano por cima recebeu o mesmo tratamento: botões redondos de cada lado de um ano muito maior, e os dois separadores do painel passaram a ser um único interruptor.'],

  'Big Last.fm libraries no longer crash the browser on a phone':
    ['As bibliotecas grandes do Last.fm já não fazem o navegador ir abaixo no telemóvel',
     'Carregar o teu histórico descarregava todos os scrobbles do Last.fm e guardava tudo em memória até chegar a última página — e não só as quatro coisas que este site usa, mas tudo o que o Last.fm envia com cada scrobble: identificadores internos, uma ligação e quatro endereços de capas. Isso é cerca de dez vezes mais do que o necessário, e numa conta com 750 000 scrobbles somava aproximadamente 1,6 GB, muito mais do que um telemóvel permite a um único separador. Algures por volta da página 3500 de 3900 o telemóvel matava o separador e ias parar ao ecrã de erro do próprio navegador, enquanto a mesma conta carregava bem num computador com memória de sobra. Agora só se guardam os quatro campos — cerca de 160 MB para essa mesma biblioteca em vez de 1,6 GB — por isso a transferência cabe num telemóvel.'],

  'An interrupted history download carries on instead of starting over':
    ['Uma transferência de histórico interrompida continua em vez de recomeçar',
     'O teu histórico só era guardado no dispositivo depois de a transferência inteira terminar. Para a maioria das bibliotecas não há problema, mas uma muito grande precisa de milhares de páginas, e qualquer coisa que a interrompesse a meio — bloquear o telemóvel, o navegador descartar o separador em segundo plano, o separador ficar sem memória — deitava tudo fora. Ao voltar, recomeçava na página um, o que para as contas maiores significava que nunca conseguia terminar. Agora o progresso é guardado a cada 250 páginas, e a visita seguinte mostra as tabelas feitas com o que já foi transferido e depois pede ao Last.fm só a parte que falta, retomando exatamente onde parou. Funciona também ao longo de várias visitas: cada uma vai mais atrás no teu histórico do que a anterior.'],

  'What’s New tells you when there is something new':
    ['As Novidades avisam-te quando há algo novo',
     'O registo de alterações tinha uma única porta: uma pequena ligação no fundo da página, que nunca dizia se alguma coisa tinha mudado — por isso não havia razão para alguma vez carregar nela. Agora aparece um botão NOVIDADES no canto superior direito do cabeçalho, ao lado de Tema e Idioma, sempre que chegam entradas desde a última vez que abriste a lista, e desaparece assim que as lês. Quando não há nada de novo, nem aparece. Ao abrir, a lista mostra também quantas entradas são novas, marca cada uma com um trilho verde e traça uma linha onde começam as que já viste, para poderes parar de ler no sítio certo em vez de percorrer setecentas linhas. A ligação no rodapé continua onde estava para quem quiser o histórico completo. O que já leste é lembrado por navegador, por isso ler no portátil não apaga o aviso no telemóvel.'],

  'Upcoming and Recent Releases open in Reel view again':
    ['Próximos e Recentes Lançamentos voltam a abrir na vista Carrossel',
     'As duas secções pesquisam os teus 200 artistas principais um a um, e enquanto isso se redesenhavam como Mosaico depois de cada artista, dissessem o que dissessem os botões Carrossel / Mosaico / Tabela / Lista — por isso abriam na vista errada e os botões não faziam nada até os 200 artistas terem sido pesquisados, o que pode demorar alguns minutos. Agora redesenham-se na vista escolhida, Carrossel por predefinição, e mudar de vista funciona logo, sem esperar que a pesquisa termine. Os redesenhos também ficaram mais espaçados, por isso o carrossel já não recomeça do início sempre que chega um artista.'],

  'The browser tab, the footer and Google all use your name now':
    ['O separador do navegador, o rodapé e o Google usam agora o teu nome',
     'O cabeçalho já mostrava "★ As Tuas Tabelas Musicais Pessoais ★" até preencheres um nome de apresentação nas Definições, e aí passava a ser teu. O rodapé e o título do separador não — mostravam o nome do dono do site a toda a gente, que era também o que o Google apresentava como título do dankcharts.fm nos resultados de pesquisa. Agora ambos seguem o cabeçalho: "As Tuas Tabelas Musicais Pessoais" até definires um nome de apresentação, e o teu próprio nome depois disso, nos quatro idiomas, com o ano “Desde” do rodapé tirado do teu primeiro scrobble em vez de um 2016 fixo. O Google apanha o novo título da próxima vez que percorrer o site, por isso o antigo pode continuar a aparecer nas pesquisas durante algum tempo.'],

  'Last.fm syncs no longer stop short of your full history':
    ['As sincronizações do Last.fm já não ficam aquém do teu histórico completo',
     'Se o Last.fm limitava a sincronização — o que faz quando uma biblioteca grande é transferida depressa, e que os telemóveis com ligações mais lentas sofrem com mais frequência — as páginas recusadas eram saltadas em silêncio, e a sincronização guardava o que tinha chegado como se fosse todo o teu histórico. Cada sincronização seguinte só pedia scrobbles mais recentes do que isso, por isso uma conta podia ficar indefinidamente com uma fração das reproduções reais, sem nada no ecrã a dizê-lo. Agora espera-se pelas páginas recusadas e volta-se a tentar, e o que ainda faltar no fim é transferido de novo na sincronização seguinte, em vez de ficar dado como fechado; uma sincronização incompleta di-lo na linha de estado em vez de anunciar sucesso. As sincronizações continuam a começar igualmente depressa e só abrandam se o Last.fm travar mesmo. À parte isso, se o telemóvel se recusar a guardar a cópia offline — a causa habitual é um iPhone cheio ou restringido — a linha de estado diz-to agora em vez de falhar em silêncio.'],

  'My Grammys has a Best Album Cover category':
    ['Os Meus Grammys têm uma categoria de Melhor Capa de Álbum',
     'Uma nova categoria opcional nos Meus Grammys, para o disco mais bonito do ano e não o que soa melhor. Ativa-a em Configurar Ano e funciona como as outras categorias de álbum — escolhe nomeados entre tudo o que ouviste no período de elegibilidade, coroa um vencedor, e a cerimónia dá-lhe o mesmo envelope que às restantes, com as próprias capas a encher os cartões.'],

  'New Artist of the Year is now Best New Artist':
    ['Novo Artista do Ano passa a chamar-se Melhor Artista Revelação',
     'Mudou de nome para corresponder ao nome que o prémio tem em todo o lado, incluindo no separador Prémios Reais ao lado. Nada mudou no funcionamento, e os nomeados ou vencedores que já escolheste continuam exatamente onde estavam — só o nome no cartão é diferente. Traduzido também para espanhol e português.'],

  'Real-Life Awards has pictures now':
    ['Os Prémios Reais têm agora imagens',
     'Cada artista no separador Prémios Reais tem agora a sua fotografia na lateral do cartão, e cada nomeação mostra a capa da música ou do álbum a que diz respeito — a capa do álbum nas categorias de álbum, a arte do single em tudo o resto. Uma categoria sem uma obra por trás, como Melhor Artista Revelação ou Produtor do Ano, não mostra nada em vez de repetir a fotografia do artista. As imagens vêm do mesmo sítio que as das tabelas, por isso tudo o que fixaste aparece aqui também, com a tua grafia do artista e não com a que o grammy.com usa. No telemóvel a imagem fica quadrada no topo do cartão e cada nomeação põe o título por baixo da categoria, em vez de apertar os dois numa linha.'],

  'The events calendar opens the menu instead of jumping to a Google search':
    ['O calendário de eventos abre o menu em vez de saltar para uma pesquisa no Google',
     'Clicar em qualquer coisa no calendário do separador Eventos levava-te diretamente para uma pesquisa no Google — nas grelhas Mês e Semana e no painel Dia por baixo. Agora tudo abre o mesmo pequeno menu que os cartões do resto do separador têm, escolhido conforme o evento: um aniversário oferece o Spotify do artista, uma playlist, as últimas 10 músicas e a pesquisa do aniversário; um aniversário de lançamento e um lançamento já saído oferecem o mesmo para o disco; e um lançamento que ainda não saiu oferece só Spotify e Google, já que não há nada para ouvir. Passar o rato continua a mostrar o pequeno cartão de pré-visualização com a capa — só sai da frente quando clicas, em vez de ficar por cima do menu.'],

  'Concerts open the menu too, with Ticketmaster at the top of it':
    ['Os concertos também abrem o menu, com a Ticketmaster no topo',
     'Um concerto era uma viagem só de ida para a Ticketmaster, tanto nos cartões da secção Concertos como nas pastilhas verde-azuladas do calendário. Agora abrem o menu, e Bilhetes na Ticketmaster é a primeira opção — por isso a página do concerto continua a um clique, com o Spotify do artista, uma playlist e as últimas 10 músicas ao lado. Veio com a alteração do calendário: o calendário mostra concertos ao lado de aniversários e lançamentos, e só alguns abrirem um menu seria pior do que nenhum.'],

  'Real-Life Awards now shows actual Grammy nominations':
    ['Os Prémios Reais mostram agora as verdadeiras nomeações para os Grammy',
     'O separador Prémios Reais estava vazio em quase todos os anos. Pedia ao MusicBrainz as relações de prémios, e o MusicBrainz quase não as regista — um punhado de artistas tem-nas, mais ninguém, por isso o separador encolhia os ombros e não dizia nada. Agora lê o próprio grammy.com. Escolhe um ano e vês essa cerimónia pelo nome — a 68.ª edição dos Grammy Awards, realizada em 2026 para os lançamentos de 2025 — e depois, para cada um dos teus cinquenta artistas principais do ano premiado, todas as categorias em que foram nomeados, quais venceram e a música ou o álbum em causa, juntamente com o seu historial de sempre. A lista segue a tua própria ordem de audição, por isso o teu artista número um do ano vem à frente. Recuar pelos anos funciona da mesma forma, até à 1.ª edição dos Grammy Awards, em 1959. Os cinquenta artistas são consultados de oito em oito em vez de um por segundo, e cada artista é pesquisado uma única vez, por muitos anos que percorras — ir até cinquenta é onde estão as surpresas, o artista que ouviste duas vezes e que afinal foi nomeado.'],

  'Picking nominees no longer crawls on a phone':
    ['Escolher nomeados já não se arrasta no telemóvel',
     'Adicionar ou retirar um nomeado numa categoria de Prémios podia demorar um segundo ou mais num telemóvel, e pior quanto maior a biblioteca. Cada toque deitava fora a lista inteira e reconstruía-a do zero — a reordenar as músicas, álbuns ou artistas do ano e a gerar de novo sessenta linhas da lista — tudo para mudar uma marca. A nota de avaliação em cada linha era a parte cara: calcular a de um álbum obriga a encontrar a lista de faixas, e encontrá-la significava ler todas as reproduções do teu histórico. Sessenta linhas eram sessenta passagens por tudo, e uma categoria de artista, que faz a média de todos os álbuns desse artista, eram centenas. Agora um toque só muda a linha tocada, e as notas de álbuns e artistas são calculadas uma vez e lembradas até algo mudar mesmo. Numa biblioteca de 60 000 reproduções, o trabalho por trás de um toque passou de cerca de 276 milissegundos para menos de um quinto de um.'],

  'Nominees no longer go missing when you switch apps':
    ['Os nomeados já não desaparecem quando mudas de aplicação',
     'O teu boletim era a única coisa que escreves na aplicação que só era guardada na nuvem, nunca no dispositivo. Por isso, se a gravação ainda não tinha acabado de viajar quando saías do Chrome para outra aplicação — e os telemóveis congelam ou descartam um separador em segundo plano quando lhes apetece — os nomeados simplesmente desapareciam, sem nada no ecrã a dizê-lo. Agora há três coisas que o evitam. Cada gravação escreve primeiro no dispositivo e depois na nuvem, por isso o boletim fica a salvo no instante em que tocas em Guardar. A ligação à nuvem mantém a sua própria fila em disco, por isso uma gravação feita sem rede é enviada mais tarde em vez de ser esquecida. E se uma gravação for mesmo recusada com a sessão iniciada, isso aparece agora no ecrã em vez de falhar em silêncio. Quando a aplicação volta a abrir, fica com a cópia escrita mais recentemente, por isso uma gravação que nunca chegou à nuvem é recuperada do dispositivo e enviada.'],

  'The rated best-of list is gone from the Awards tab':
    ['A lista dos melhores segundo as tuas avaliações saiu do separador Prémios',
     'O separador Prémios abria com um painel ★ Os melhores, segundo as minhas avaliações — duas colunas ordenadas, melhores álbuns e melhores músicas do ano, pela nota que lhes deste e não por quanto os ouviste. Foi retirado, por isso o separador começa agora pelos próprios prémios. As tuas avaliações não foram mexidas: todas as notas que deste continuam lá, e o separador Avaliações continua a mostrar as mesmas listas de fim de ano.'],

  'Clicking a Recent Release shows its options again':
    ['Clicar num Lançamento Recente volta a mostrar as opções',
     'Nas tabelas Semanal, Mensal e Anual, clicar num cartão de Lançamentos Recentes não fazia nada — o pequeno menu com Spotify, uma playlist, o leitor e Google aparecia e desaparecia antes de o conseguires ler. O menu está atento ao deslocamento para sair da frente quando o cartão a que está preso se move, mas estava a ouvir tudo o que se desloca na página, em vez de só o que rodeia o cartão. Os carrosséis de lançamentos deslizam sozinhos, por isso o carrossel de Próximos Lançamentos a passar logo acima bastava para fechar o menu uma quinquagésima de segundo depois de abrir. Agora só fecha quando a própria página se desloca, ou algo dentro do qual o cartão realmente está. O mesmo piscar fechava menus por todo o separador Eventos, onde os carrosséis estão empilhados, por isso esses ficam corrigidos com a mesma alteração.'],

  'Every card on the Events tab opens its menu instead of jumping to Google':
    ['Todos os cartões do separador Eventos abrem o seu menu em vez de saltar para o Google',
     'Aniversários, Aniversários de lançamento, Aniversários recentes e Aniversários de lançamento recentes eram simples ligações: um clique e estavas numa pesquisa do Google, sem poder fazer mais nada. Agora abrem o mesmo pequeno menu dos cartões de lançamento — pesquisar no Spotify, adicionar a uma playlist, as últimas 10 músicas do artista ou do lançamento, e pesquisar no Google. A opção do Google num cartão de aniversário continua a pesquisar o aniversário do artista, como o cartão fazia, já que é a única pesquisa que aos serviços de música não diria nada. Funciona nas quatro formas de mostrar uma secção: Mosaico, Carrossel, Lista e Tabela. O ＋ no canto de um cartão não mudou: continua a ser a forma de guardar diretamente numa playlist com um clique.'],

  'New Music Friday cards open the menu, with Deezer at the top of it':
    ['Os cartões do New Music Friday abrem o menu, com o Deezer no topo',
     'Um cartão do New Music Friday levava-te diretamente ao álbum no Deezer. Agora abre o menu, e Abrir no Deezer é a primeira opção — por isso essa página continua a um clique, e pesquisar no Spotify, guardar numa playlist ou pesquisar no Google são as outras. Nada mudou quanto à origem dos lançamentos: a capa, o título, a data de lançamento e se é álbum, single ou EP continuam a ser lidos do Deezer todas as sextas-feiras.'],

  'The Albums/Singles/EPs chips stay on the chart tabs where they belong':
    ['Os botões Álbuns/Singles/EPs ficam nos separadores das tabelas, que é o lugar deles',
     'Assim que separavas um tipo de lançamento dos álbuns, aparecia uma fila de botões para alternar entre Álbuns, Singles, EPs e Todos. Era para as tabelas Semanal, Mensal, Anual e De Sempre, mas ia atrás de ti para todo o lado: Dados Brutos, Gráficos, Recordes, Eventos, Prémios, Sua Trilha Sonora, Playlists e o Guia de Charts mostravam os botões por cima da página, onde não mudavam nada. Agora só aparecem nos quatro separadores das tabelas, e só enquanto a tabela de álbuns é a que está no ecrã.'],

  'Twenty new award categories, and the Streak Award has gone':
    ['Vinte novas categorias de prémios, e o Prémio de Sequência desaparece',
     'Os Meus Grammys ganharam vinte categorias que podes ativar em Configurar Ano. Catorze escolhem-se da forma habitual, a partir de uma lista de nomeados: Vídeo do Ano, Gravação do Ano, Melhor Canção Country, Melhor Álbum Country, Melhor Álbum Vocal Pop, Melhor Canção Pop a Solo, Melhor Canção Pop de Duo/Grupo, Melhor Gravação Dance/Eletrónica, Melhor Gravação Dance Pop, Melhor Álbum Dance/Eletrónico, Melhor Gravação Remisturada, Melhor Álbum de Reggae, Melhor Álbum de Banda Sonora e Melhor Canção de Banda Sonora. O par do pop divide-se pela forma como a música é creditada — a solo de um lado, duos e grupos do outro — e os dois prémios de banda sonora leem os tipos de lançamento que marcaste, por isso um lançamento marcado como banda sonora é o que torna uma música elegível. Country, reggae e dance pop são géneros novos que o classificador reconhece agora. As outras seis atribuem-se sozinhas, sem nomeados para escolher: Maior sequência diária de uma música, de um álbum e de um artista, cada uma a maior sequência ininterrupta de dias do ano, e Música, Álbum e Artista com mais dias ouvido, cada uma a contar em quantos dias do ano foi ouvido. O antigo Prémio de Sequência foi retirado — os três prémios de sequência que o substituem dizem claramente o que medem, e cobrem também álbuns e artistas. Todas as novas categorias vêm desligadas por predefinição e estão todas traduzidas para espanhol e para as duas variantes do português.'],

  'Automatic release-type detection now actually runs on its own':
    ['A deteção automática do tipo de lançamento funciona agora mesmo sozinha',
     'O interruptor "Detetar tipos de lançamento automaticamente" não detetava nada automaticamente. Ligá-lo mostrava as opções por baixo e mais nada — cada varrimento continuava a ter de ser iniciado à mão no painel de revisão, por isso uma biblioteca podia passar meses com a opção ligada sem um único single ou EP marcado. Agora, ao ligá-lo, varre a tua biblioteca sozinho, a marcar singles, EPs, álbuns ao vivo e bandas sonoras pelo caminho, e as Definições mostram até onde já chegou. Uma segunda coisa desfazia o trabalho em silêncio: um varrimento verifica mil lançamentos de cada vez, mas esquecia tudo o que tinha aprendido mal fechavas o separador, por isso cada visita recomeçava pelos teus álbuns mais ouvidos e nunca chegava à parte da biblioteca onde os singles realmente estão. Agora lembra-se do que já consultou e continua daí, sessão após sessão, até ter passado pela biblioteca toda. Nada do que marcaste à mão é tocado, a deteção nunca desmarca um lançamento, e tudo o que marca aparece em Gerir tipos, onde o podes alterar ou remover.'],

  'Release-type detection now finds live albums, soundtracks, and the rest of your library':
    ['A deteção do tipo de lançamento encontra agora álbuns ao vivo, bandas sonoras e o resto da tua biblioteca',
     'Havia duas coisas que mantinham a análise calada. Perguntava primeiro ao Deezer pelos teus lançamentos mais ouvidos, que é precisamente onde os singles não estão — e gastava o orçamento a reler respostas que já tinha, por isso analisar uma segunda vez percorria as mesmas poucas centenas de álbuns e nunca ia mais fundo. Agora resolve de graça o que já sabe, gasta as consultas em lançamentos que ninguém verificou, diz-te quantos não alcançou e continua daí da próxima vez que analisares. Os álbuns ao vivo e as bandas sonoras não podiam ser detetados de todo, porque o Deezer só conhece álbum, single e EP: agora são lidos pela forma como os títulos estão identificados, por isso um "(Live at ...)" ou um "(Original Motion Picture Soundtrack)" é reconhecido à primeira.'],

  'Deep in a chart, an edit no longer sends you back to #1':
    ['Lá no fundo de uma tabela, uma edição já não te manda de volta ao n.º 1',
     'Marcar um álbum como single ou EP a partir da sua janela reconstrói as tabelas por trás, e cada reconstrução mandava as listas de sempre e anual de volta à primeira página — por isso fechar a janela depois de uma edição de um segundo custava-te o sítio até onde tinhas descido. Agora a página sobrevive a tudo o que deixa intacta a lista a que pertence. Mudar de período, passar para outro ano ou alternar entre as tabelas de álbuns e singles continua a levar-te ao topo, porque essas são de facto outra lista.'],

  'PEAK tags on the singles and EP charts count the right chart':
    ['As etiquetas PEAK nas tabelas de singles e EPs contam a tabela certa',
     'Um single que tinha liderado a tabela de singles durante semanas continuava a mostrar PEAK #2, porque a etiqueta o comparava também com todos os álbuns — uma tabela onde já nem aparece — enquanto o percurso na mesma linha dizia #1. A tabela de álbuns tinha o reflexo disso: um álbum com um pico mais baixo do que o real, porque singles separados tinham sido contados acima dele. Cada pico pertence agora à tabela onde foi alcançado, incluindo as posições de sempre nas janelas de álbum e de artista.'],

  'A single\'s chart run opens the singles chart, not the albums one':
    ['O percurso de um single abre a tabela de singles, não a de álbuns',
     'Clicar numa caixa do percurso de um single ou EP separado mostrava a tabela de álbuns dessa semana por baixo de uma posição que nunca tinha vindo dela — a caixa dizia #1 e a lista mostrava o álbum que estava em #1. Depois de um tipo ser separado, o lado dos álbuns de uma semana são várias tabelas e não uma, e a pré-visualização da caixa mostra agora a tabela em que essa posição foi obtida, com o nome dela no título.'],

  'Singles certify on their own ladder immediately':
    ['Os singles são certificados na sua própria escala desde logo',
     'A escala de certificação dependia de um tipo ter sido separado numa tabela própria, o que misturava duas perguntas diferentes. A separação tem a ver com onde um lançamento aparece nas tabelas; a escala tem a ver com o que o disco é. Cem reproduções de um single de duas faixas são uma conquista diferente de cem reproduções de um álbum de catorze faixas, e isso é verdade onde quer que ele esteja nas tabelas. Os álbuns ao vivo e as bandas sonoras ficam na escala de álbuns, porque são discos completos.'],

  'Count a single\'s plays toward its album':
    ['Conta as reproduções de um single para o seu álbum',
     'Três níveis, desligado por predefinição: nada; a própria página do álbum a contar os seus singles; ou também a linha do álbum na tabela, os seus recordes e a sua certificação a contá-los, enquanto o single mantém a sua própria linha e o seu próprio número.'],

  'Separated types get their own Records':
    ['Os tipos separados têm os seus próprios Recordes',
     'Cada secção de Recordes que lista álbuns oferece agora uma pastilha para cada entidade do lado dos álbuns — só Álbuns se não separaste nada, mais Singles e EPs quando estão à parte. Trouxe também um recorde novo que só existe graças aos tipos de lançamento: Lançada primeiro como single, músicas ouvidas primeiro num single que mais tarde apareceram num álbum, a começar pela espera mais longa.'],

  'The auto-detect switch could not be clicked':
    ['Não era possível clicar no interruptor de deteção automática',
     'A caixa de verificação dentro do interruptor é invisível e não ocupa espaço, por isso o deslizador só é alcançável através da sua etiqueta — e todos os outros interruptores das Definições envolvem a linha numa etiqueta, mas este não. A função estava correta; o controlo era decorativo. Os testes não o apanharam porque chamavam a função diretamente em vez de clicar no controlo.'],

  'Automatic detection of singles and EPs':
    ['Deteção automática de singles e EPs',
     'Marcar umas centenas de singles à mão é a tarefa que teria matado a funcionalidade, por isso a deteção faz o varrimento e tu corriges. Fica desligada até a ligares, e mesmo assim só propõe — nada é escrito até aplicares. Os títulos só são comparados com a convenção delimitada das lojas, por isso The Singles Collection e Single Ladies ficam como estão.'],

  'Singles and EPs in their own charts':
    ['Singles e EPs em tabelas próprias',
     'Um lançamento marcado continua a não mudar nada até o seu tipo ser definido como Separado nas Definições, e Com os álbuns é a predefinição para os dois, por isso uma biblioteca existente fica intacta até pedires o contrário. Separado dá à tabela de álbuns um filtro segmentado entre Álbuns, Singles e EPs.'],

  'Mark a release as a single, EP, live album or soundtrack':
    ['Marca um lançamento como single, EP, álbum ao vivo ou banda sonora',
     'Só a marcação e mais nada: registar que tipo de disco é algo não muda nenhuma tabela, nenhuma certificação e nenhum recorde. Separar um tipo da tabela de álbuns é uma definição opcional, posterior.'],

  'Peak tags on yearly rows':
    ['Etiquetas de pico nas linhas anuais',
     'A tabela anual já recebia os dados do pico e simplesmente nunca os usava, por isso as linhas apareciam sem a etiqueta de pico que as linhas semanais e mensais têm.'],

  'Movement and previous rank on yearly charts':
    ['Movimento e posição anterior nas tabelas anuais',
     'As tabelas anuais mostravam só posição, título, álbum e reproduções — as colunas de movimento e semanas na tabela eram só semanais e mensais, excluídas por três condições diferentes, uma das quais tinha o mês fixo no código precisamente no ramo que devia tratar todos os outros períodos.'],

  'Rate your own library':
    ['Avalia a tua própria biblioteca',
     'Dá a qualquer música uma nota de 0,0 a 10,0 com uma grelha de seis partes — composição, letra, voz, produção, melodia e ritmo — ou uma única nota por instinto. A letra e a voz podem ser marcadas como não aplicáveis, para que os instrumentais não sejam puxados para baixo por zeros; saem da média por completo. O total de um álbum é construído a partir das faixas, juntamente com qualidades próprias do álbum.'],

  /* ========== AGOSTO 2026 ========== */

  'Filter the certified shelf by songs or albums':
    ['Filtra a prateleira de certificados por músicas ou álbuns',
     'A prateleira Certificados neste período misturava os dois tipos sem forma de ver só um. Aparecem três botões com as contagens quando há dos dois tipos, e um período com um só tipo mantém a linha simples, porque não há nada para filtrar.'],

  'Menu tab names quoted in the tour':
    ['Nomes dos separadores do menu entre aspas na visita guiada',
     'Mostrar, Tamanho, Vista e Ações liam-se como palavras normais a meio da frase, por isso não era óbvio que eram os nomes dos separadores do próprio menu.'],

  'The tour opens the real options menu':
    ['A visita guiada abre o verdadeiro menu de opções',
     'O menu era descrito duas vezes, uma dentro de um passo e outra como passo próprio. Foram fundidos num único passo que controla o menu a sério — abre-o e destaca cada separador, cada linha, os tamanhos, as vistas e as ações.'],

  'Clearer wording on the release reels':
    ['Texto mais claro nos carrosséis de lançamentos',
     'O passo refere agora o menu de opções e o seletor de vista que essas secções têm de facto.'],

  'Weeks on chart stated directly':
    ['Semanas na tabela, dito sem rodeios',
     'O texto comparava o número com aquilo que ele não é, em vez de dizer simplesmente o que é.'],

  'Two guide descriptions corrected':
    ['Duas descrições do guia corrigidas',
     'Novas Entradas lista as primeiras descobertas de sempre, não as músicas que se estreiam na tabela, e o botão Mais é uma faixa a toda a largura por baixo dos separadores, e não algo à direita.'],

  'Section titles hidden behind the sticky bar':
    ['Títulos de secção escondidos atrás da barra fixa',
     'O deslocamento da visita guiada reservava espaço para o seu próprio aviso em baixo, mas nada para a barra de data fixa em cima, por isso os títulos das secções altas ficavam por trás dela.'],

  'Plainer navigation copy in the tour':
    ['Texto de navegação mais simples na visita guiada',
     'O passo parecia um parágrafo de manual; passou a linhas curtas com etiqueta para a fila de cima, a fila de baixo e como mostrar a segunda.'],

  'The guide opens with a real greeting':
    ['O guia abre com uma verdadeira saudação',
     'O título parecia um nome colado a um título e a linha por baixo era uma frase a meio.'],

  'Weeks on chart described backwards':
    ['Semanas na tabela, descrito ao contrário',
     'O guia dizia em quatro sítios que a coluna Semanas conta uma sequência consecutiva. É um total acumulado, que vai somando entre passagens separadas e nunca volta a zero — o contador interno que volta a zero é outro, usado apenas para descrever uma sequência que acabou de terminar.'],

  'Plainer wording on the play button step':
    ['Texto mais simples no passo do botão de reprodução',
     'Descrevia como funciona a pesquisa, que não é o que alguém quer saber, e terminava com mais uma frase sobre aquilo que a aplicação não te exige.'],

  'The tour scroll re-asserted after the page settles':
    ['O deslocamento da visita guiada reajusta-se quando a página assenta',
     'O destino está certo quando é calculado, mas a página continua a mexer-se por baixo da animação — entrar num passo recolhe a secção anterior, tirando milhares de píxeis acima do destino enquanto o deslocamento ainda decorre.'],

  'The tour covers the two buttons on a row':
    ['A visita guiada cobre os dois botões de uma linha',
     'Percorria os dados de uma linha mas saltava as duas coisas que podes realmente fazer a partir dela, por isso foi acrescentado um passo para cada uma, colocado de forma a que a visita continue a ler-se da esquerda para a direita.'],

  'Three tour highlights were invisible':
    ['Três destaques da visita guiada eram invisíveis',
     'Posição, Anterior e Semanas marcavam bem a sua célula, mas não aparecia nada, porque os contornos colapsados da tabela deixavam o fundo de uma célula vizinha ser pintado mesmo por cima do anel da célula ao lado. As três ficam entre células preenchidas.'],

  'The tour slowed down':
    ['A visita guiada abrandou',
     'Os tempos tinham sido pensados para ler o aviso, e não para o ler e depois olhar mesmo para aquilo que está a ser apontado — e como as secções agora se expandem à chegada, há mais para absorver. Cada passo dura cerca de dez segundos.'],

  'Tour scrolled tall sections to their middle':
    ['A visita guiada levava as secções altas até ao meio',
     'Foi reportado como a visita já não destacar Quase no Top, Fora do Top e Novas Entradas, enquanto Lançamentos continuava a funcionar — e Lançamentos funcionar era a pista, porque era a secção curta. Centrar uma secção mais alta do que o ecrã deixa o cabeçalho de fora, por cima.'],

  'Two sections would not open for the tour':
    ['Duas secções não abriam para a visita guiada',
     'Mostrar uma secção tirava-lhe as classes de estilo, o que resolve a maioria das secções — mas Quase no Top e Fora do Top guardam o seu estado de abertura à parte e definem a altura diretamente, por isso nenhuma respondia.'],

  'The tour walks a chart row piece by piece':
    ['A visita guiada percorre uma linha da tabela peça a peça',
     'Um parágrafo enumerava o que uma linha contém e não apontava para nada. Passou a sete passos sobre o número um atual: a linha, a posição, a posição do período anterior e o movimento, as etiquetas, as semanas na tabela, as reproduções e o percurso.'],

  'The tour can reveal a hidden section':
    ['A visita guiada pode mostrar uma secção escondida',
     'Um passo a explicar o Quase no Top enquanto o Quase no Top está desligado não tinha nada para apontar e não destacava nada. Agora os passos podem abrir uma secção escondida ou recolhida e devolvê-la logo a seguir tal como a encontraram.'],

  'Plainer wording on the certifications step':
    ['Texto mais simples no passo das certificações',
     'A primeira frase enterrava o que a secção é debaixo de como funciona, precisamente num ponto que se lê à velocidade da visita guiada.'],

  'The tour visited sections out of order':
    ['A visita guiada visitava as secções fora de ordem',
     'A página mostra-as como Top, Quase no Top, Fora do Top, Novas Entradas, e a barra de botões lista-as da mesma forma, mas a visita passava por Novas Entradas em terceiro — a descer para lá de Fora do Top e depois a voltar a subir até ela.'],

  'The tour plays through the whole weekly page':
    ['A visita guiada percorre a página semanal inteira',
     'Um cartão descrevia o separador Semanal e deixava o resto por documentar — as faixas de estatísticas, os cartões do momento, o carrossel de certificações, os sete botões, o menu de secção, as três subtabelas e os carrosséis de lançamentos nunca eram mencionados. Passou a ser uma visita que avança sozinha.'],

  'Chart animation is now opt-in':
    ['A animação da tabela é agora opcional',
     'A definição era lida de tal forma que nunca a ter aberto contava como ligada, por isso a repetição corria para cada utilizador novo em cada desenho da tabela, antes de fazer ideia do que estava a ser animado.'],

  'Tour steps spotlight what they describe':
    ['Os passos da visita guiada destacam o que descrevem',
     'Um passo chamado "A barra de navegação" que nem desloca até à barra nem a marca deixa-te a ler a descrição de algo que tens de encontrar sozinho. Agora os passos trazem o alvo para a vista e rodeiam-no com um anel.'],

  'The tour\'s opening claim was untrue':
    ['A frase de abertura da visita guiada não era verdadeira',
     'Afirmava que a aplicação funciona com a mesma maquinaria de uma tabela musical nacional. Não é assim — essas ponderam streaming, vendas e rádio entre si, enquanto esta conta reproduções. E depois gastava mais duas frases com aquilo que a aplicação não faz.'],

  'A tour step for every tab':
    ['Um passo da visita guiada para cada separador',
     'Juntar Eventos a Prémios e a Trilha Sonora a Playlists fazia quatro separadores parecerem duas notas de rodapé, quando só Prémios gera 33 categorias e Recordes tem onze secções. A visita passou de onze para dezoito passos.'],

  'Welcome gate skipped after Google sign-in':
    ['Ecrã de boas-vindas saltado depois de iniciar sessão com o Google',
     'O ecrã estava ligado a três das quatro formas como a aplicação pode arrancar. A quarta restaura uma configuração guardada e mostra logo a aplicação, por isso quem iniciava sessão com o Google nunca o via.'],

  'A welcome gate, and the guide rebuilt as six chapters':
    ['Um ecrã de boas-vindas, e o guia refeito em seis capítulos',
     'Nada numa tabela acabada de carregar anunciava que havia um guia, por isso só era encontrado por acaso — e, uma vez encontrado, eram doze secções soltas a misturar documentação com as tuas próprias estatísticas. Agora um ecrã na primeira visita oferece a visita guiada ou o guia, e o guia passou a seis capítulos ordenados.'],

  'The ceremony staged properly':
    ['A cerimónia encenada como deve ser',
     'Mostrava uma lista simples com o vencedor já destacado, e o envelope só aparecia nas categorias que ainda não tinham vencedor — por isso não havia nada para revelar. Agora cada categoria tem as capas dos nomeados, uma volta de apresentação e a abertura de um envelope.'],

  'Nominee lists ranked by the category\'s own rule':
    ['Listas de nomeados ordenadas pela regra de cada categoria',
     'Melhor Colaboração significa músicas creditadas a mais do que um artista — mas também músicas cujo crédito mostra um só nome e tu sabes que não é bem assim. O crédito não consegue distinguir as duas, por isso a regra passou a ser um critério de ordenação em vez de um filtro: as correspondências sobem para o topo e nada é escondido.'],

  'Generate Nominees button broke itself':
    ['O botão Gerar Nomeados estragava-se sozinho',
     'O botão repunha a etiqueta como texto simples, mas a etiqueta contém o código do ícone, por isso mostrava o seu próprio código e ficava estragado. Uma categoria que falhava também deixava o botão preso em A gerar.'],

  'Records not rebuilt when nothing changed':
    ['Os Recordes já não são recalculados quando nada mudou',
     'O cálculo corria em cada visita ao separador e não guardava nada, por isso abrir Recordes, espreitar uma tabela e voltar custava outra vez cerca de 1,6 segundos de contagem para uma resposta que não tinha mudado.'],

  'Cheaper ordering in the Records build':
    ['Ordenação mais barata no cálculo dos Recordes',
     'Os Recordes eram o que restava de mais lento, cerca de 1,8 segundos com 150 000 reproduções, e as quatro passagens anteriores não lhes tinham tocado porque fazem o seu próprio percurso cronológico em vez de lerem os índices partilhados.'],

  'Faster loading by measuring rather than guessing':
    ['Carregamento mais rápido a medir em vez de adivinhar',
     'O carregamento foi medido etapa a etapa, e ler o ficheiro afinal não era o problema — dividir 150 000 linhas demora cinco milissegundos. O custo estava numa função de ordenação que convertia duas datas em cada uma de 2,6 milhões de comparações.'],

  'One shared index instead of regrouping per builder':
    ['Um índice partilhado em vez de reagrupar em cada cálculo',
     'A terceira passagem pela mesma causa de fundo: cálculos separados a percorrer cada um o histórico inteiro para chegar a contagens que os outros já tinham feito. Agora os totais são calculados uma vez por período e partilhados.'],

  'Chart runs cached between renders':
    ['Percursos na tabela guardados entre desenhos',
     'Construir o percurso era o mais caro de um desenho — 909 milissegundos de um perfil de quatro segundos — e o resultado era deitado fora no início de cada desenho. Recuar uma semana recalculava todas as posições na tabela desde a tua primeira reprodução, apesar de nada ter mudado.'],

  'Each play\'s derived values computed once':
    ['Os valores derivados de cada reprodução são calculados uma única vez',
     'Analisar uma biblioteca de 100 000 reproduções mostrou que um único desenho fazia 2,5 milhões de conversões de data e mais de um milhão de pesquisas de chaves — cerca de doze passagens completas pelo histórico em cada desenho, porque uns dezassete cálculos de tabelas começam cada um com o seu próprio ciclo sobre tudo. Agora esses valores são calculados uma vez por reprodução.'],

  'Add a song to a playlist instead of playing it':
    ['Adiciona uma música a uma playlist em vez de a ouvir',
     'Tudo o que mostrava músicas oferecia a fila do leitor e mais nada, por isso para guardar uma música era preciso ouvi-la. A Máquina do Tempo, os botões de reprodução de todas as tabelas, os aniversários, os aniversários de lançamento e os lançamentos recentes podem agora enviar faixas diretamente para uma playlist.'],

  'An artist\'s play button searched their name as a song':
    ['O botão de reprodução de um artista pesquisava o nome dele como música',
     'Todas as vistas alternativas tratavam os álbuns à parte com o seletor de faixas e deixavam os artistas cair numa pesquisa direta, por isso o botão procurava o nome do artista como se fosse o título de uma música. Três vistas nem sequer tinham botão de artista.'],

  'Export Playlist opened behind the Streaks window':
    ['Exportar playlist abria por trás da janela de Sequências',
     'Copiar lista de faixas parecia não fazer nada: a janela de exportação é declarada mais cedo na página, por isso ao mesmo nível de empilhamento a janela de sequências era pintada mesmo por cima dela. Uma janela aberta a partir de outra fica agora por cima.'],

  'The Records reel ran twice as fast as it looked':
    ['O carrossel de Recordes andava ao dobro da velocidade que parecia',
     'A velocidade foi acertada para igualar a da Máquina do Tempo por cartão, mas um cartão de recorde é quase duas vezes mais largo, por isso igualar segundos por cartão significava percorrer o dobro da distância no mesmo tempo.'],

  'Every reel can be dragged':
    ['Todos os carrosséis podem ser arrastados',
     'A Máquina do Tempo, o carrossel da Trilha Sonora e todos os carrosséis de Eventos eram animações, e uma animação não pode ser arrastada — o ponteiro e a animação estariam a escrever a mesma coisa. Foram refeitos como verdadeiras áreas de deslocamento, como já funcionava a prateleira de certificados.'],

  'The certified shelf stayed hanging on other tabs':
    ['A prateleira de certificados ficava pendurada noutros separadores',
     'Recusa-se a ser construída fora da semana e do mês, mas vive na coluna da tabela, e os separadores que não são de tabelas escondem essa coluna peça a peça — e nenhum dos oito a mencionava. As placas que a última semana tivesse conquistado ficavam à vista em Recordes, Eventos e Prémios.'],

  'Time Machine could be switched off permanently':
    ['A Máquina do Tempo podia ser desligada para sempre',
     'Desligar os três tipos deixava o carrossel sem nada para mostrar, por isso escondia-se, levando consigo os três botões, porque vivem no seu cabeçalho. Como esse estado é guardado e sincronizado, nem recarregar nem outro dispositivo os traziam de volta.'],

  'Time Machine vanished after visiting Awards':
    ['A Máquina do Tempo desaparecia depois de visitar Prémios',
     'Esses separadores escondem o carrossel de vez, e o código que repõe a interface da tabela nunca o voltava a pôr. A única outra coisa que o podia fazer só o reconstrói quando os dados mudam — o que, no mesmo dia e com as mesmas reproduções, nunca acontece — por isso uma visita tirava-o durante o resto da sessão.'],

  'Awards a period earned':
    ['Os prémios que um período conquistou',
     'Uma certificação é um momento — a reprodução exata que levou um disco acima de um limiar — por isso cai em exatamente uma semana e um mês. As tabelas semanais e mensais abrem agora com as placas cuja reprodução decisiva caiu nesse período.'],

  'Compilations count as one album':
    ['As compilações contam como um só álbum',
     'Um álbum em que cada faixa indica um cantor diferente era partido num álbum por cantor, por isso cada tabela de álbuns, recorde e certificação contava o mesmo disco uma dúzia de vezes com uma fração das reproduções. Marcá-lo como compilação volta a juntá-lo num só, creditado a Vários Artistas.'],

  'Plaques become awards':
    ['As placas passam a prémios',
     'A placa punha a capa dentro de um rótulo de vinil, o que deixava dois problemas que não conseguia resolver dentro dessa forma: a imagem era o disco, por isso não havia imagem, e um múltiplo era uma palavra numa etiqueta, por isso uma parede de Diamantes parecia toda igual até se ler cada etiqueta.'],

  'Certifications kept every award, not just the highest':
    ['As certificações guardam todos os prémios, não só o mais alto',
     'Uma placa só mostrava onde um disco está agora, por isso passar um limiar destruía em silêncio o prémio abaixo: um álbum com triplo Diamante tinha uma placa de Diamante, e o Ouro e a Platina que conquistou pelo caminho tinham deixado de existir.'],

  'Yearly streaks ranked on their leanest year':
    ['As sequências anuais ordenadas pelo ano mais fraco',
     'Uma sequência anual só pode durar tanto quanto a própria biblioteca, por isso qualquer um que continue na tua rotação chega ao mesmo máximo e a classificação enche-se de um só número, desempatado pelas reproduções totais — o que transformava o recorde em Mais reproduções com etiqueta de sequência.'],

  'Records overview splits by period':
    ['O resumo dos Recordes divide-se por período',
     'Uma segunda fila de pastilhas reduz o painel às secções que têm um recorde nesse período, com Todos a mostrar a união de tudo — 26 cartões em vez de 10 — e cada etiqueta a dizer de que recorde se trata.'],

  'Records pills sized as primary navigation':
    ['Pastilhas dos Recordes com tamanho de navegação principal',
     'Tinham uns nove píxeis, por baixo de uma página de títulos grandes — letra miudinha para a navegação principal do separador.'],

  'Drawn icons on the type pills':
    ['Ícones desenhados nas pastilhas de tipo',
     'Uma estrela, um losango e um losango de quatro pontas não diziam nada sobre músicas, artistas ou álbuns — três marcas abstratas cuja única função era serem diferentes umas das outras, e por isso duas secções já tinham passado para emojis.'],

  'Pill icons keep moving while selected':
    ['Os ícones das pastilhas continuam a mexer-se quando selecionados',
     'Nove dos onze faziam uma entrada e paravam de repente, por isso a pastilha selecionada ficava imóvel depois do primeiro meio segundo. O movimento era um floreado de chegada quando precisava de ser um estado.'],

  'Icons and colour families on the Records pills':
    ['Ícones e famílias de cor nas pastilhas dos Recordes',
     'Onze pastilhas só com etiquetas minúsculas não davam ao olhar forma de distinguir as secções. Cada uma tem agora um glifo desenhado a partir de objetos de loja de discos, em vez de marcas genéricas de interface, colorido em cinco famílias.'],

  'Reigns separated from longevity':
    ['Reinados separados de longevidade',
     'Doze semanas seguidas em número um não é o mesmo recorde que doze semanas em número um espalhadas por quatro anos: uma coisa é um reinado, a outra é longevidade. As duas secções dizem agora qual medem, e medem as duas.'],

  'Five more sections rank all three charts':
    ['Mais cinco secções classificam as três tabelas',
     'Tudo nos Recordes que só classificava a tabela semanal classifica agora a semanal, a mensal e a anual, incluindo o teste Perfect All Kill. Sequências foi refeita pelo caminho.'],

  'All #1s split per chart, and its covers load':
    ['Todos os n.º 1 divididos por tabela, e as capas carregam',
     'Um título geral ficava por cima de três subtabelas que eram os verdadeiros recordes, sem nomear nada a que se pudesse apontar. Agora cada uma é um recorde próprio, e o erro das capas que perseguia a secção desde que foi escrita ficou corrigido.'],

  'Overview cards become artwork tiles':
    ['Os cartões do resumo passam a mosaicos com imagem',
     'A grelha eram dez painéis de texto sem graça. Todas as outras partes da aplicação que apresentam um recorde mostram a cara do disco; esta, a primeira coisa que o separador mostra, não mostrava nenhuma.'],

  'All #1s pills failed to hide their tables':
    ['As pastilhas de Todos os n.º 1 não conseguiam esconder as tabelas',
     'Cada bloco de período abria dois elementos mas fechava três, e o navegador usava o que sobrava para fechar o elemento seguinte que estivesse aberto — por isso todas as tabelas a partir daí eram lidas como irmãs do painel que as devia conter, e as pastilhas não as conseguiam esconder.'],

  'Records tables become cards on phones':
    ['As tabelas dos Recordes passam a cartões no telemóvel',
     'Uma tabela de recordes pode ter nove colunas, o que abaixo dos 768 píxeis significava um deslocamento horizontal sem nada a indicar que existia, por isso as colunas da quinta em diante nunca eram encontradas. Agora cada linha é um cartão.'],

  'A certification ledger behind every artist row':
    ['Um registo de certificações por trás de cada linha de artista',
     'Cada linha expande-se com todas as certificações desse artista, uma linha por prémio com as contas por trás: primeira reprodução, o dia em que chegou, quanto tempo demorou a subida, o ritmo, as reproduções desde então e o indicador até ao degrau seguinte.'],

  'Five more sections get type pills':
    ['Mais cinco secções ganham pastilhas de tipo',
     'Todos os n.º 1, Presenças, Estreias e Mais reproduções mostram agora um tipo de cada vez, como as secções que já o faziam, a partilhar um único controlo genérico em vez de uma quarta, quinta e sexta cópia dele.'],

  'Fastest ranked on rounded days':
    ['Os mais rápidos eram ordenados por dias arredondados',
     'A classificação ordenava pelo tempo decorrido arredondado a dias inteiros, o que nos níveis mais baixos quase não é uma ordem — com 50 reproduções, 23 das 25 linhas visíveis tinham o mesmo número de dias, por isso na prática estavam ordenadas pela ordem em que tinham sido calculadas. Cada reprodução tem uma hora real, e agora é essa que se usa.'],

  'Fastest to Milestone for all three types':
    ['Mais rápido até ao marco, para os três tipos',
     'Músicas, artistas e álbuns têm agora cada um a sua própria classificação, em vez de só as músicas, com a mesma forma que a secção Marcos por cima usa.'],

  'Every record an artist holds, in their modal':
    ['Todos os recordes de um artista, na janela dele',
     'O carrossel do Salão da Fama do banner dos Recordes aparece agora na janela do artista, limitado a esse artista. Os dois partilham um único gerador de cartões para não se desencontrarem.'],

  'The tier medal sized to its word':
    ['A medalha de nível do tamanho da sua palavra',
     'A medalha era bem mais pequena do que a palavra do nível ao lado, por isso parecia um pormenor esquecido e não aquilo que está a ser premiado.'],

  'The song certification becomes a struck medal':
    ['A certificação de música passa a medalha cunhada',
     'A nota solta passou a medalha com a nota na face, em tons da cor em vez de centro escuro, porque um centro vazado deixaria ver a fotografia do artista através da medalha.'],

  'A gold note that catches the light':
    ['Uma nota dourada que apanha a luz',
     'O emoji passou a nota desenhada. Um emoji aparece na cor que cada plataforma traz e não pode brilhar; uma nota desenhada fica com o dourado do tema e uma sombra em camadas, que é o que a faz parecer metal e não um autocolante.'],

  'Song certifications marked by a rosette':
    ['As certificações de música marcadas com uma roseta',
     'A nota musical indicava o género e não a conquista, desvalorizando o único recorde aqui que é realmente atribuído. Os álbuns mantêm o disco para que os dois continuem a distinguir-se.'],

  'Certification cards name their own type':
    ['Os cartões de certificação dizem o seu próprio tipo',
     'A parede junta músicas e álbuns debaixo de um único título que não consegue dizer o que é cada cartão, por isso agora cada cartão di-lo ele próprio.'],

  'Certified centres under the tier word':
    ['Certificado centrado por baixo da palavra do nível',
     'A etiqueta lê-se como um glifo mais uma palavra, por isso centrar por baixo do conjunto todo punha o texto por baixo dos dois e à esquerda de onde devia ficar.'],

  'A certification tier reads like a plaque':
    ['Um nível de certificação lê-se como uma placa',
     'Ouro, Platina e Diamante são o recorde num cartão de certificação, não uma contagem, por isso o nível aparece em tamanho de placa, com certificado por baixo em vez de na mesma linha. Todos os outros cartões mantêm o número na linha, onde o valor é mesmo um número.'],

  'Certification cards say certified':
    ['Os cartões de certificação dizem certificado',
     'O nível é o destaque de um cartão de certificação, por isso agora leva a palavra, e a data por baixo passou a uma etiqueta simples para que a mesma palavra não apareça duas vezes. Os pormenores de apoio eram demasiado pequenos e cortados numa linha.'],

  'Long titles wrap too':
    ['Os títulos longos também mudam de linha',
     'Os títulos dos cartões eram cortados da mesma forma, por isso um título longo com parênteses ficava a meio. Agora os títulos vão até três linhas e as descrições até duas, o que cobre todos os recordes do separador.'],

  'Long record descriptions wrap':
    ['As descrições longas dos recordes mudam de linha',
     'Os cartões do carrossel cortavam a linha da secção a meio de uma palavra. Agora passa para uma segunda linha, e o cartão reserva as duas, sejam ou não usadas, para que as alturas fiquem iguais durante o deslocamento.'],

  'The masthead flame keeps its gold':
    ['A chama do cabeçalho mantém o dourado',
     'As listas do percurso mantêm o novo nível máximo azul, enquanto o cabeçalho volta ao dourado — as duas escalas separam-se no topo de propósito.'],

  'The longest streaks burn blue':
    ['As sequências mais longas ardem a azul',
     'Os cinco primeiros níveis sobem do âmbar ao vermelho intenso, mas o sexto voltava a um dourado claro que parecia mais fraco do que o vermelho abaixo. O nível máximo arde agora a azul, que é mais quente do que o vermelho.'],

  'Records opens on the artist who holds the most':
    ['Os Recordes abrem com o artista que tem mais',
     'O resumo começa agora pelo artista que aparece em mais linhas de recordes do que qualquer outro, com a fotografia por trás de um letreiro com todos os recordes que tem, e cada cartão com os números desse recorde.'],

  'Artist total stays visible on mobile':
    ['O total do artista continua visível no telemóvel',
     'O total de reproduções desaparecia da barra ON AIR em ecrãs estreitos.'],

  'ON AIR counts credited collaborations properly':
    ['O ON AIR conta bem as colaborações creditadas',
     'O número do artista comparava o texto do crédito tal como estava, enquanto todas as tabelas de artistas o dividem em nomes individuais, por isso contava a menos em cada colaboração e não batia certo com a tabela de Artistas mesmo ao lado.'],

  'An ON AIR bar for what you are playing now':
    ['Uma barra ON AIR para o que estás a ouvir agora',
     'O Last.fm já marcava a faixa em curso em cada sincronização e o analisador deitava-a fora, porque ainda não é um scrobble. Agora uma barra consulta-a e mostra a capa, o título, o artista, um relógio a correr e quantas vezes já a ouviste.'],

  'Records intro pairs chart size with history':
    ['A introdução dos Recordes junta o tamanho da tabela com o histórico',
     'A faixa tinha dois dados unidos por uma barra vertical — os tamanhos das tabelas e depois quanto histórico as alimenta — que afinal eram sempre as mesmas três colunas. Emparelhadas por período, cada coluna lê-se como uma frase: os recordes semanais saem de um top 10, e há 517 dessas semanas.'],

  'Total plays for the selected chart run range':
    ['Total de reproduções para o intervalo escolhido do percurso',
     'As estatísticas do percurso ganharam um total que segue o seletor de intervalo, por isso alternar entre o ano até agora, até este período e todo o histórico responde a quanto ouviste realmente ao lado da posição que teve.'],

  'Heatmap days rain into place':
    ['Os dias do mapa de calor caem como chuva',
     'Cada quadrado de dia cai agora no calendário ao seu próprio ritmo, em vez de a grelha toda aparecer de uma vez, com uma aleatoriedade grande o suficiente para que quadrados vizinhos se ultrapassem em vez de entrarem numa linha certinha.'],

  'Streak records on every chart entry':
    ['Recordes de sequência em cada entrada da tabela',
     'Os painéis do percurso ganharam uma quarta secção com recordes de sequência para músicas, artistas e álbuns, em quatro separadores — reproduções, dias, meses e anos consecutivos — cada um com uma lista ordenada, uma faixa de estatísticas e uma vista de pormenor com um bloco por unidade. Só contam sequências de duas ou mais.'],

  /* ========== JULHO 2026 ========== */

  'Certification artwork sitting outside its frame':
    ['A imagem da certificação ficava fora da moldura',
     'O contentor posto à volta de cada capa, para o selo do seletor ter onde se ancorar, encolhia até desaparecer no Mural de Certificações, deixando o espaço do disco centrado no canto do cartão em vez de na imagem.'],

  'Records column headers stay as you scroll':
    ['Os cabeçalhos das colunas dos Recordes ficam fixos ao deslocar',
     'As tabelas dos Recordes vão muito além de um ecrã, e à trigésima linha uma grelha de nomes e números já não tinha nada que dissesse que coluna era qual. Agora os cabeçalhos ficam presos no topo enquanto as linhas passam por baixo.'],

  'The artwork picker badge no longer covers the art':
    ['O selo do seletor de imagens já não tapa a imagem',
     'Em ecrãs táteis o selo ficava sempre por cima das imagens pequenas, a esconder precisamente a capa a que pertencia. Aí fica totalmente escondido, e um toque de meio segundo em qualquer imagem abre o seletor.'],

  'Milestones as a timeline':
    ['Marcos como linha temporal',
     'Marcos é uma escada de primeiras vezes, uma linha por nível, cada uma com uma data, por isso passou a ser uma linha temporal vertical com um eixo, um ponto por nível e imagem em cada entrada, dividida em três painéis com um seletor.'],

  'Biggest debuts on a podium, with total plays':
    ['As maiores estreias num pódio, com o total de reproduções',
     'O recorde mostra agora as reproduções de sempre ao lado do número da estreia, por isso uma música que entrou forte e estagnou distingue-se de uma que continuou a crescer, e os três primeiros saem da tabela para cartões de pódio.'],

  'New Charts records browsable by type and period':
    ['Recordes de Novas Tabelas navegáveis por tipo e período',
     'Dez recordes apresentados como vinte tabelas num único deslocamento passaram a duas filas de pastilhas que mostram um conjunto de cada vez, por tipo e por período, com as duas escolhas memorizadas para que a secção reabra onde a deixaste.'],

  'Search across every Records table':
    ['Pesquisa em todas as tabelas dos Recordes',
     'Uma única caixa por cima da navegação das secções filtra as 55 tabelas de uma vez, a marcar as linhas que correspondem, a esconder o resto e a mostrar só as secções que ainda têm alguma correspondência — ignorando de propósito os limites e o estado recolhido de cada tabela enquanto está ativa.'],

  'Records opens on an overview':
    ['Os Recordes abrem com um resumo',
     'Antes deixava-te cair numa tabela sem explicar porquê aquela, o que têm as outras nove ou se alguma já tem alguma coisa. Agora abre com um cartão por secção, com o melhor recorde de cada uma, e um seletor de Músicas, Artistas e Álbuns.'],

  'Records typography given real hierarchy':
    ['A tipografia dos Recordes ganha uma verdadeira hierarquia',
     'Havia sete níveis de etiqueta espalhados num intervalo de 2,2 píxeis, quatro deles em maiúsculas, e todos mais pequenos do que os dados que identificavam. Ler de relance depende da proporção, por isso foram refeitos em quatro tamanhos bem distintos.'],

  'Records sections opened one at a time':
    ['As secções dos Recordes abrem uma de cada vez',
     'O separador abria numa vista que mostrava as dez secções de uma vez — umas 55 tabelas e centenas de pesquisas de imagens num único deslocamento. Essa opção foi retirada, e agora as tabelas podem ser ordenadas por qualquer coluna.'],

  'Song of the Moment no longer forced to lowercase':
    ['A Música do Momento já não fica em minúsculas à força',
     'O cartão mostrava a chave interna de agrupamento, que está em minúsculas para que uma música conte como uma única entrada, seja qual for a forma como foi escrita. Agora mantém-se e mostra-se a grafia original da primeira reprodução do período.'],

  'Pick artwork from a grid of every source':
    ['Escolhe a imagem numa grelha com todas as fontes',
     'Clicar na etiqueta da fonte passava às cegas por quatro fontes, uma de cada vez. Agora um selo em qualquer imagem abre um seletor com candidatas das quatro ao mesmo tempo, e a tua escolha fica fixada nesse item em todos os desenhos futuros, em todas as vistas.'],

  'Unreadable selected buttons on Dark Yellow':
    ['Botões selecionados ilegíveis no Amarelo Escuro',
     'Nove dos dez temas têm uma cor de destaque média ou escura, por isso texto branco sobre um fundo de destaque ficava bem e foi copiado para umas 45 regras. O destaque do amarelo escuro é claro, por isso todas as pastilhas preenchidas nesse tema ficavam com um contraste de 1,5 para 1 — botões da tabela, do percurso e dos lançamentos, praticamente em branco.'],

  'Your Soundtrack stayed on screen under the next tab':
    ['A Sua Trilha Sonora ficava no ecrã por baixo do separador seguinte',
     'Era a única vista que faltava na lista de coisas a desmontar ao mudar.'],

  'The Events icon became a calendar with a ticket':
    ['O ícone de Eventos passou a calendário com um bilhete',
     'Um alfinete de mapa indica um lugar, mas o separador reúne aniversários, datas de lançamento e concertos — tudo com data, nada com lugar. Agora é um calendário com o dia riscado e um bilhete no canto, o que também o distingue dos outros dois calendários da navegação.'],

  'The Last.fm card explains the full setup':
    ['O cartão do Last.fm explica a configuração completa',
     'O campo do nome de utilizador é o atalho só de leitura, por isso o cartão diz agora o que a configuração completa acrescenta — a tua própria chave, e corrigir e enviar scrobbles — e leva à parte certa do guia.'],

  'Navigation tab colours pulled apart':
    ['As cores dos separadores de navegação mais afastadas',
     'A primeira fila passava por quatro tons frios dentro de uns 70 graus, dois deles a só 20 de distância e ambos com ar de lavanda. Os temas claros pioravam a situação ao puxar todos os tons para o destaque. Os tons foram afastados.'],

  'Drawn icons on every navigation tab':
    ['Ícones desenhados em todos os separadores de navegação',
     'Os doze separadores trocaram os emojis por ícones desenhados. Os emojis aparecem na paleta fixa de cada sistema operativo e ignoram o estado do separador; estes ficam com a cor do separador, por isso acompanham o passar do rato e o estado ativo.'],

  'Drawn icons on Sync Now and Settings':
    ['Ícones desenhados em Sincronizar e Definições',
     'Os caracteres soltos de seta e roda dentada passaram a pequenos objetos construídos na mesma linguagem, com a seta de recarregar a rodar como roda uma recarga.'],

  'Drawn icons on the masthead stats':
    ['Ícones desenhados nas estatísticas do cabeçalho',
     'Os cinco números usavam emojis, que só podem crescer como um bloco e ignoram o estado à sua volta. Cada um é agora um pequeno objeto construído que representa o que a sua estatística mede quando passas o rato.'],

  'Two copies of the sync script had drifted apart':
    ['Duas cópias do script de sincronização tinham-se desencontrado',
     'A cópia do guia estava 89 linhas à frente da cópia da janela de definições, à qual faltava uma secção inteira de obtenção de géneros e dois itens de menu que a acionam. Quem copiasse a errada ficava com um script que não fazia o que a outra prometia.'],

  'The sync script builds the missing tab itself':
    ['O script de sincronização cria sozinho o separador que falta',
     'Em vez de falhar com um erro preciso mas invisível e deixar-te a adivinhar o nome do separador e que célula guarda o quê, o script cria agora o separador Settings quando não existe, com as etiquetas e o tamanho certos.'],

  'Own-sheet users told to use a tab they do not have':
    ['A quem usa folha própria pedia-se um separador que não tem',
     'Um passo referia um separador Settings que só existe porque o modelo o traz. Com a tua própria folha esse separador não existe, e a falha é invisível do lado do site — o script dá erro e nenhuma reprodução chega.'],

  'Copying the deployment address was skipped over':
    ['Copiar o endereço da implementação era saltado',
     'Um passo terminava com "depois cola em baixo o URL que te der", a juntar em silêncio três ações distintas numa frase: carregar em Implementar, passar outra vez pelos ecrãs de autorização e encontrar o endereço na caixa de diálogo seguinte. Nada avisava que ia aparecer um URL.'],

  'Steps told people to paste a script already there':
    ['Passos mandavam colar um script que já lá estava',
     'Dois passos mandavam toda a gente abrir o editor de scripts e colar o script, quando o modelo já o traz — o que o próprio guia diz com todas as letras umas linhas mais abaixo. A sequência tem agora três passos.'],

  'The auto-sync block asked for the answer before the question':
    ['O bloco de sincronização automática pedia a resposta antes da pergunta',
     'Começava por exigir um endereço, depois explicava de onde vem esse endereço e a seguir despejava 400 linhas de script a meio da janela. A ordem foi invertida para que tenhas à frente aquilo de que precisas quando precisas.'],

  'Settings speaks the landing page\'s language':
    ['As Definições falam a mesma língua da página inicial',
     'O seletor de fonte eram três caixas sem graça com glifos provisórios, enquanto o ecrã inicial apresenta as mesmas três escolhas com ícones desenhados e autocolantes — a mesma decisão com duas personalidades. Os cartões reutilizam agora os ícones da própria página inicial.'],

  'Configure became Settings, in three tabs':
    ['Configurar passou a Definições, em três separadores',
     'A janela antiga era um deslocamento comprido com nome de apresentação, fuso horário, opções de fonte, campos da folha, script, certificações, eventos e dois interruptores, cada um com um parágrafo por baixo. Agora são três separadores — Fonte de dados, Tabelas e Perfil — com as opções de fonte refeitas como cartões.'],

  'The web app step undersold itself':
    ['O passo da aplicação web vendia-se mal',
     'Dizia que só era preciso para o botão Adicionar reprodução. Na verdade, esse endereço desbloqueia três coisas: adicionar à mão, enviar edições de volta para a tua folha, e guardar e voltar a aplicar regras de correção automática. O passo começa agora pelo que realmente desbloqueia.'],

  'The connect step put in the right order':
    ['O passo de ligação na ordem certa',
     'Mandava-te colar o endereço da folha antes de a partilhar, que é o contrário da ordem em que o tens de fazer. Agora percorre as três tarefas reais por ordem, incluindo o que significa cada opção de partilha e uma falha silenciosa que não tinha qualquer aviso.'],

  'The auto-sync step explains itself':
    ['O passo de sincronização automática explica-se',
     'Um passo apertava três coisas diferentes em quatro linhas, e a parte mais assustadora — o aviso do Google de aplicação não verificada — era uma nota de rodapé em vez daquilo com que estás prestes a dar. Agora são três secções com nome.'],

  'The setup guide became a step-by-step wizard':
    ['O guia de configuração passou a assistente passo a passo',
     'Um passo de cada vez, com uma trilha de pontos clicáveis, controlos de recuar, saltar e avançar, e a tua posição memorizada em cada caminho. O texto completo continua disponível para imprimir e para quem não usa scripts.'],

  'A File Upload guide, and a guide you tick through':
    ['Um guia de Carregar ficheiro, e um guia que vais marcando',
     'O terceiro caminho de configuração foi escrito a partir dos leitores de ficheiros reais e não de memória, a cobrir seis fontes e onde pedir uma exportação em cada uma, e os três caminhos foram refeitos como algo que percorres em vez de uma parede de texto.'],

  'The setup guide speaks the landing page\'s language':
    ['O guia de configuração fala a mesma língua da página inicial',
     'O fundo da página, os brilhos que seguem o cursor, o chão do equalizador, os cartões de vidro e as etiquetas de secção foram todos levados, por isso chegar de um cartão de fonte parece passar para a sala ao lado e não para outro edifício.'],

  'Benefit stickers and a recommended ribbon':
    ['Autocolantes de vantagens e uma fita de recomendado',
     'Cada cartão de importação traz um pequeno autocolante com a única razão para o escolher — controlo total, zero manutenção, arranque mais rápido — e o Google Sheets aparece vestido como a entrada dourada da tabela, com uma fita de recomendado.'],

  'Notes fly over the neighbouring cards':
    ['As notas voam por cima dos cartões vizinhos',
     'A camada da explosão ficava por baixo de todos os cartões, por isso as notas que saíam do seu cartão deslizavam por trás do seguinte. Agora o cartão clicado sobe enquanto as notas estão no ar, por isso saem de trás dele e passam por cima dos outros.'],

  'A burst of notes when you pick a source':
    ['Uma explosão de notas quando escolhes uma fonte',
     'Clicar num cartão de importação lança nove notas de trás dele, cada uma com a cor da identidade desse cartão, a nascer escondidas por trás dele e a aparecer só depois de passarem a borda.'],

  'Hand-drawn animated icons on the landing page':
    ['Ícones animados desenhados à mão na página inicial',
     'A ligação para saltar passou a gira-discos, cujo prato começa a girar e cujo braço desce ao passar o rato, por isso a ação de retomar faz o gesto de recomeçar um disco, e o vinil ganhou um brilho especular.'],

  'Stronger cursor response':
    ['Resposta mais forte ao cursor',
     'Em círculos com várias centenas de píxeis, o movimento original mal se notava. Está cerca de três vezes mais forte e acompanha mais depressa, embora continue amortecido em vez de colar ao cursor.'],

  'Landing glows follow the cursor':
    ['Os brilhos da página inicial seguem o cursor',
     'Os dois brilhos de fundo inclinam-se agora para o ponteiro, em vez de apenas repetirem um movimento fixo.'],

  'Bubbling Under translated':
    ['Quase no Top traduzido',
     'A secção inteira aparecia em inglês fixo: título, legenda, os treze selos com as suas dicas, a legenda de cores e a lista de faixas. Os botões da tabela e Recolher tudo tinham o mesmo problema.'],

  'Last.fm syncs claimed to be connecting to Google Sheets':
    ['As sincronizações do Last.fm diziam estar a ligar ao Google Sheets',
     'O texto de estado referia o Sheets fosse qual fosse a tua fonte, e mudar de idioma fazia um estado em curso voltar a esse texto — juntos, faziam uma sincronização do Last.fm parecer presa numa ligação que nunca estava a acontecer.'],

  'Hero stats frozen after a big first sync':
    ['Estatísticas principais congeladas depois de uma primeira sincronização grande',
     'A atualização silenciosa em segundo plano nunca recalculava as estatísticas principais, por isso o total de reproduções, os dias, o artista principal e a sequência ficavam presos nos números iniciais mesmo depois de o histórico completo acabar de carregar.'],

  'Landing page top unreachable with a card open':
    ['Topo da página inicial inalcançável com um cartão aberto',
     'O ecrã centrava o conteúdo num contentor de deslocamento fixo, e quando um cartão expandido ultrapassava a altura do ecrã, esse centramento tornava o excesso deslocável só numa direção — deixando o logótipo no topo fora de alcance para sempre.'],

  'Landing glow clear of the skyline':
    ['O brilho da página inicial longe do horizonte',
     'O brilho da direita ficava por cima das barras do equalizador e turvava-as.'],

  'Sheets card text translated':
    ['Textos do cartão do Sheets traduzidos',
     'O botão do modelo, o autocolante de configuração e o separador estavam preparados para tradução, mas as traduções propriamente ditas nunca foram adicionadas.'],

  'Google Sheets card redesigned':
    ['Cartão do Google Sheets redesenhado',
     'O cartão do Sheets ganhou um botão de modelo, um autocolante de configuração em 30 segundos e um separador de já-tenho-uma-folha. Tinham sido enviados juntamente com uma correção sem relação, sem revisão, e foram documentados à parte quando se deu por eles.'],

  'Landing glow circles were invisible':
    ['Os círculos de brilho da página inicial eram invisíveis',
     'Um desfoque forte espalhava uma cor já ténue por um círculo grande, e depois a transparência do próprio elemento diluía-a outra vez, sobrando entre 2 e 10 por cento da intensidade pretendida — presente no código, ausente no ecrã.'],

  'Landing buttons unreadable on three light themes':
    ['Botões da página inicial ilegíveis em três temas claros',
     'Uma regra que punha o texto quase branco tinha sido escrita para o cabeçalho escuro desses temas dentro da aplicação, mas o ecrã inicial reutiliza a mesma classe diretamente numa página clara, deixando os botões de tema e idioma quase invisíveis.'],

  'Every landing control excites the room':
    ['Todos os controlos da página inicial animam a sala',
     'A mesma reação foi alargada ao botão de iniciar sessão e aos três cartões de fonte, por isso mexer em qualquer um deles agita o horizonte, e não só o botão principal.'],

  'The skyline reacts to the demo button':
    ['O horizonte reage ao botão de demonstração',
     'Passar o rato pelo botão de demonstração faz o espectro crescer e acelera todas as barras, por isso a pista sente o drop a chegar. Os navegadores que não o conseguem fazer mantêm simplesmente a animação em repouso.'],

  'The landing page as a chart show going on air':
    ['A página inicial como um programa de tabelas a entrar no ar',
     'Vinte e quatro barras de frequência tingidas com a cor de destaque respiram ao longo do rebordo de baixo, cada uma com a sua altura, fase e andamento, para parecer um verdadeiro analisador e não um padrão repetido.'],

  'The demo button as a now playing chip':
    ['O botão de demonstração como um indicador de "a tocar agora"',
     'A pastilha simples ganhou ar de leitor, com três barras de equalizador a dançar, que congelam em alturas escalonadas para quem pediu menos movimento, e um gradiente que passa ao passar o rato.'],

  'Charts appear before a long history finishes downloading':
    ['As tabelas aparecem antes de um histórico longo acabar de ser transferido',
     'Numa primeira ligação com um histórico grande, ficavas a olhar para um esqueleto e um contador de páginas até chegarem todas. Agora as tabelas são desenhadas assim que chegam as 20 páginas mais recentes, cerca de 4000 reproduções, enquanto o resto continua a ser transferido por trás.'],

  'About 1.8 MB of code no longer blocks first paint':
    ['Cerca de 1,8 MB de código já não bloqueiam o primeiro desenho',
     'Três bibliotecas grandes usadas só para exportar imagens e para importar do Spotify e do Deezer foram retiradas da página e são agora transferidas só da primeira vez que são realmente precisas.'],

  'Last.fm sync fetches only what is new':
    ['A sincronização do Last.fm só vai buscar o que é novo',
     'Uma sincronização transferia outra vez todas as páginas do teu histórico. Agora só pede as audições mais recentes do que o que já está guardado, o que normalmente é uma só página. A transferência completa acontece na primeira ligação, depois de limpar a cache ou uma vez por semana.'],

  'Instant load from the last copy':
    ['Carregamento instantâneo a partir da última cópia',
     'O que foi guardado por último aparece agora de imediato, por mais antigo que seja, e atualiza-se em silêncio em segundo plano — sem esqueleto, sem recomeço. Esperar pela rede antes de mostrar alguma coisa era o que havia de mais lento ao abrir a aplicação.'],

  'Album modal sections translated':
    ['Secções da janela de álbum traduzidas',
     'Histórico na tabela, Mapa de calor de audição, Histórico de streaming e os seus expansores eram textos fixos em inglês que nunca eram traduzidos, na janela de álbum, na de música e nos expansores das linhas da tabela.'],

  'Album chart section enlarged and made explorable':
    ['Secção de tabela do álbum ampliada e explorável',
     'A tendência mensal e a tabela de discriminação estavam numa letra pequena demais para ler com conforto. O bloco todo foi ampliado e ganhou altura, e as barras agora respondem: passar o rato mostra uma contagem ancorada e um brilho.'],

  'Spanish album modal wording corrected':
    ['Texto da janela de álbum em espanhol corrigido',
     'A posição é agora escrita como ordinal, para se ler como um lugar e não como a afirmação de ser um álbum de topo, os nomes das certificações usam a forma traduzida em vez do inglês, e várias etiquetas abreviadas em espanhol foram escritas por extenso.'],

  'Featured artist labels translated':
    ['Etiquetas do artista em destaque traduzidas',
     'A etiqueta do banner e todas as etiquetas e notas dos blocos tinham sido escritas como textos fixos em inglês que passavam completamente ao lado do sistema de tradução.'],

  'Featured artist album and song cards expanded':
    ['Cartões de álbum e música do artista em destaque ampliados',
     'O álbum e a música favoritos escolhem agora os mais ouvidos e mostram as suas próprias sequências de reproduções e de dias, calculadas da mesma forma que tem em conta as colaborações. Várias etiquetas estranhas dos blocos foram reescritas.'],

  'Featured artist streaks made consistent':
    ['Sequências do artista em destaque agora coerentes',
     'A sequência de reproduções e a sequência do álbum favorito usavam definições diferentes e nenhuma contava as faixas de colaboração como continuação da sequência de um artista, o que deixava a sequência do álbum ultrapassar a sequência de reproduções dentro da qual está. Agora as duas percorrem a mesma linha temporal com a mesma forma de comparar.'],

  'Artist Milestone artwork falls back too':
    ['As imagens dos Marcos de artista também têm alternativa',
     'As linhas ficavam em branco sempre que a única fonte consultada não encontrava a faixa do marco.'],

  'Listening Streaks recap reworked':
    ['Resumo das Sequências de audição refeito',
     'Um contador ao vivo da sequência atual e uma ligação para a janela de sequências ficam estranhos numa vista retrospetiva, por isso foram substituídos por um número de cobertura de dias ativos, e os cartões de recorde dizem agora claramente o que são.'],

  'Wrong artist photos corrected':
    ['Fotografias de artista erradas corrigidas',
     'Pesquisar o nome de um artista devolve muitas vezes vários perfis sem relação com o mesmo nome, incluindo entradas vazias, e ficava-se com o primeiro, fosse ele qual fosse. Agora as correspondências com o mesmo nome são ordenadas por seguidores e as imagens em branco conhecidas são filtradas.'],

  'Soundtrack artwork falls back properly':
    ['As imagens da Trilha Sonora têm uma verdadeira alternativa',
     'Os cartões do coverflow só tentavam uma fonte e desistiam, ao contrário das tabelas, que passam por várias. A imagem do cartão central também pode ser clicada para mudar de fonte à mão, e a escolha fica memorizada.'],

  'January compared against the previous December':
    ['Janeiro comparado com o dezembro anterior',
     'Janeiro não tinha com que se comparar dentro de um período filtrado por ano, por isso passa a usar o dezembro anterior, a mostrar um zero quando realmente não há dados anteriores, para o layout se manter coerente.'],

  'Chart History Replay redesigned':
    ['Repetição do histórico da tabela redesenhada',
     'Fotografias de artistas, selos de movimento, uma barra de progresso e controlos de reproduzir, pausar e velocidade. As linhas mantêm-se agora entre semanas e deslizam para as novas posições, como na corrida de barras da tabela principal, em vez de piscarem com conteúdo novo a cada passo.'],

  'Awards never appeared on the Soundtrack tab':
    ['Os prémios nunca apareciam no separador Trilha Sonora',
     'A consulta tentava percorrer um objeto simples como se fosse uma lista, o que dá erro, abandonando em silêncio a secção inteira de cada vez. Foi também refeita como cartões de vitrina de troféus, com imagem e número de vitórias.'],

  'Milestone lists paginated':
    ['Listas de marcos paginadas',
     'A lista de artistas nunca teve realmente um limite de altura, porque a regra que cortava só referia a outra lista, por isso um histórico longo despejava quase tudo de uma vez. Agora as duas ficam numa caixa de altura fixa que mostra 25 de cada vez.'],

  'A time zone bug in the streak count':
    ['Um erro de fuso horário na contagem de sequências',
     'O percurso pela tua sequência atual misturava datas lidas como hora universal com datas lidas como hora local, o que podia contar a menos e produzir uma sequência atual mais longa do que a melhor de sempre com que era comparada. Uma sequência em curso que bate o recorde junta-se agora ao cartão de sempre com um selo de Novo recorde, em vez de dois cartões a contradizerem-se.'],

  'More milestone checkpoints':
    ['Mais pontos de marco',
     'Os totais gerais marcam agora cada 25 000 a partir de 10 000, fechando um salto direto de 100 000 para 250 000 que saltava números redondos como 200 000. Os marcos de artista avançam de 500 em 500 em vez de pararem nos 10 000, e dividem os créditos separados por vírgulas como o resto do separador.'],

  'Milestones split into yours and artists\'':
    ['Marcos divididos entre os teus e os dos artistas',
     'A secção lia-se como uma única linha temporal, o que fazia um artista a passar um número de reproduções parecer um dos teus próprios totais de audição. Agora são duas secções claramente identificadas.'],

  'Monthly Activity became inspectable':
    ['A Atividade mensal passou a ser explorável',
     'As barras eram pequenas, com pouco contraste e paradas. Cada mês é agora um alvo de toque que abre a contagem, a parte do total, a variação face ao mês anterior e o artista principal, com um selo dourado no pico, riscas nos meses calmos e uma pastilha de tendência a comparar a segunda metade do período com a primeira.'],

  'Generic silhouette avatars filtered out':
    ['Avatares genéricos de silhueta filtrados',
     'O Deezer devolve um gráfico fixo de "sem fotografia" em vez de um resultado vazio, por isso o filtro que devia apanhar imagens em falta deixava-o passar como se fosse uma fotografia real.'],

  'Coverflow polish and split artist credits':
    ['Acabamento do coverflow e créditos de artista divididos',
     'Cabeçalhos maiores, espaçamento mais justo, e o emoji de medalha trocado por numerais simples sobre um gradiente, porque os emojis aparecem de forma diferente em cada sistema e eram difíceis de ler nesse tamanho. Os créditos separados por vírgulas contam agora para cada artista.'],

  'Coverflow scrolling overshot':
    ['O deslocamento do coverflow passava do ponto',
     'Cada passo da roda movia cerca de 1,7 cartões, saltando logo a entrada vizinha. Agora cada evento fica limitado a um cartão. As imagens e o texto foram ampliados em toda a secção.'],

  'Top Artists and Songs as coverflow':
    ['Artistas e músicas principais em coverflow',
     'As duas listas de top cinco passaram a carrosséis a toda a largura com os cinquenta primeiros, controlados por arrastamento, roda, teclado e toque.'],

  'At-risk saving covers artist and album streaks':
    ['Guardar as sequências em risco inclui as de artistas e álbuns',
     'Guardar playlist e Copiar lista de faixas só incluíam sequências de músicas, por isso as sequências de artistas e álbuns em risco nesse dia ficavam de fora em silêncio. Agora vão buscar a faixa ouvida mais recentemente de qualquer um que ainda não esteja representado, a verificar os álbuns antes dos artistas para nada se repetir.'],

  'Loyalty Score as a chart stamp':
    ['A Pontuação de fidelidade como um carimbo da tabela',
     'O anel sem graça e os cartões genéricos passaram a um carimbo dos correios inclinado, um veredicto com traço de marcador, uma contagem de artistas que regressam e cartões de artista em forma de talão de bilhete com bordas picotadas.'],

  'Larger, clearer stat tiles':
    ['Blocos de estatísticas maiores e mais claros',
     'Os ícones passaram para a mesma linha das etiquetas e todos os tamanhos aumentaram para facilitar a leitura.'],

  'The number one artist as a banner':
    ['O artista número um como banner',
     'Um cartão de destaque maior, com um banner de fotografia esbatido por trás do texto e uma colagem de estatísticas só desse artista: dias ouvido, o seu maior dia, sequências de dias e de reproduções, álbuns e músicas ouvidos, sequência do álbum favorito e música mais ouvida.'],

  'The Reel':
    ['O Carrossel',
     'Clicar em qualquer uma das estatísticas principais troca um carrossel por baixo da faixa que mostra o que está por trás desse número, a reutilizar os cartões da Máquina do Tempo e o seu menu de ações.'],

  'Your Soundtrack rebuilt as a story':
    ['A Sua Trilha Sonora refeita como uma história',
     'Um redesenho completo: uma abertura em blocos de cor, blocos de estatísticas, uma linha temporal de marcos, cartões de sequência com chamas e um anel de fidelidade circular. Novas descobertas passou a ser um aquário flutuante de retratos de artistas que sobem, flutuam e se renovam sem fim, com peso para que os teus mais ouvidos reapareçam mais vezes, e que pára quando passas o rato.'],

  'Section display toggles were not syncing':
    ['Os interruptores de visualização das secções não sincronizavam',
     'A lista de definições a sincronizar referia uma chave antiga que já nada usava, em vez da atual, por isso os interruptores do menu de três pontos eram guardados localmente mas nunca chegavam à tua conta, e voltavam ao início num navegador novo.'],

  'The same menu on Recent Releases':
    ['O mesmo menu em Lançamentos Recentes',
     'Estes já saíram, por isso o menu oferece também o leitor — mas só quando o álbum tem realmente histórico de reproduções; caso contrário, volta às opções de pesquisa.'],

  'Sub-chart toggles showing on the wrong tabs':
    ['Botões das subtabelas a aparecer nos separadores errados',
     'Os botões Top, Quase no Top, Fora do Top e Novas Entradas continuavam visíveis em Eventos, Recordes, Prémios e Dados Brutos, porque só as secções eram escondidas, e não a barra de botões ao lado delas.'],

  'The same menu on Upcoming Releases':
    ['O mesmo menu em Próximos Lançamentos',
     'Alargado às secções de próximos lançamentos nos quatro modos de vista. Aqui não há opção de leitor, porque esses discos ainda não saíram.'],

  'Time Machine cards offer a choice':
    ['Os cartões da Máquina do Tempo oferecem escolhas',
     'Clicar num cartão fazia uma única ação fixa. Agora abre um pequeno menu: pesquisar no Spotify, pesquisar no Google ou usar o leitor da aplicação. Artistas e álbuns oferecem também as suas últimas dez músicas, para pôr em fila uma a uma ou todas de uma vez.'],

  'Larger navigation text':
    ['Texto de navegação maior',
     'As etiquetas dos separadores eram pequenas demais para ler com conforto.'],

  'Album streaks nest inside artist runs':
    ['As sequências de álbum ficam dentro das sequências do artista',
     'Ouvir uma discografia álbum a álbum gerava uma sequência de álbum que recomeçava a cada disco, escondendo por baixo a sequência mais longa do artista. Agora a sequência do artista é tratada como a verdadeira sequência e é ela que manda no banner, com o álbum atual como uma etiqueta interior em vez de competir com ela.'],

  'Chart titles cut off on dark themes':
    ['Títulos de tabela cortados nos temas escuros',
     'Um fundo de pastilha e um espaçamento que todos os temas claros já tinham retirado continuavam nos temas escuros, e esse espaçamento extra bastava para empurrar o título para lá do ponto em que é cortado num telemóvel.'],

  'New Entries headers made scannable':
    ['Cabeçalhos de Novas Entradas fáceis de ler de relance',
     'O cabeçalho era uma frase longa a fazer de título, por isso distinguir as três secções obrigava a lê-la toda. Agora cada uma tem um nome curto, com o pormenor por baixo como subtítulo.'],

  'Lifetime weeks and final streak separated':
    ['Semanas totais e sequência final separadas',
     'O número de semanas de uma saída é um total de sempre, que pode abranger várias passagens separadas, e tinha sido substituído apenas pela sequência que terminou, perdendo esse contexto. Voltou, e uma etiqueta distinta mostra agora à parte a sequência consecutiva final, quando houve uma.'],

  'Peak rank on dropouts':
    ['Posição máxima nas saídas',
     'Uma saída que já esteve melhor do que a posição de onde acabou de cair mostra o seu pico, exibido apenas quando o pico supera mesmo essa última posição, para nunca repetir o óbvio.'],

  'Dropouts linked to where they landed':
    ['Saídas ligadas ao sítio onde foram parar',
     'Cada saída é cruzada com a zona Quase no Top desta semana e mostra lá a sua nova posição, com os mesmos selos que essa secção usa, por isso uma música que sai da tabela e aparece logo abaixo lê-se como um único acontecimento e não como dois sem ligação.'],

  'Off the Chart improved':
    ['Fora do Top melhorado',
     'Uma mensagem de celebração quando nada saiu, em vez de a secção desaparecer em silêncio; o número de semanas esclarecido para não se confundir com a sequência do Quase no Top; e as saídas de posições altas marcadas como as perdas mais sérias que são.'],

  'Streak banner edges misaligned on mobile':
    ['Rebordos do banner de sequência desalinhados no telemóvel',
     'O banner ficava recuado enquanto as barras de cima e de baixo iam de ponta a ponta, por isso os rebordos não alinhavam. Esconder um espaçador no telemóvel tinha também juntado a etiqueta e o número de um lado, em vez de ocuparem a barra toda.'],

  'Navigation hint quietened':
    ['Dica de navegação mais discreta',
     'A pastilha flutuante com fundo e contorno passou a texto simples e esbatido, encostado à barra de cima em vez de flutuar num espaço vazio.'],

  'This Week\'s stats given a hierarchy':
    ['As estatísticas desta semana ganham hierarquia',
     'Doze blocos idênticos com contorno passaram a três níveis: totais principais, destaques e cartões com imagem para os números do momento, cada categoria com a sua própria cor de destaque.'],

  'Navigation inside the Charts Guide':
    ['Navegação dentro do Guia de Charts',
     'Vinte secções empilhadas sem forma de chegar diretamente a nenhuma. Foi adicionada uma fila fixa de ligações de atalho, as ligações podem agora apontar para uma secção específica, e as secções só de consulta ficam recolhidas por predefinição para que a página continue fácil de percorrer.'],

  'Stack ranks invisible on light themes':
    ['Posições da vista Pilha invisíveis nos temas claros',
     'Os números de posição estavam fixos num branco translúcido que só era alterado para os três primeiros, por isso do quarto lugar para baixo desapareciam num fundo claro.'],

  'Proper icons on the chart toggles':
    ['Ícones a sério nos botões da tabela',
     'Os botões de tipo e os cabeçalhos das secções trocaram glifos unicode e emojis por ícones desenhados.'],

  'Album certifications as vinyl cards':
    ['Certificações de álbum como cartões de vinil',
     'A grelha simples de selos da janela de álbum foi substituída pela mesma moldura por níveis e pelo disco a girar do Mural de Certificações, com as capas reais carregadas.'],

  'Open a detail page from any view':
    ['Abre uma página de pormenor a partir de qualquer vista',
     'Só a vista de tabela deixava entrar num artista, álbum ou música. Agora todas as vistas deixam, e a dica de cada linha passou para o subtítulo da secção, onde é dita uma vez em vez de em todas as linhas. A vista Pilha ganhou também os títulos das músicas, que saltava.'],

  'Show one chart type at a time':
    ['Mostra um tipo de tabela de cada vez',
     'Um seletor por cima das secções da tabela mostra só Músicas, Artistas ou Álbuns, juntamente com o Quase no Top, o Fora do Top e as Novas Entradas desse tipo. A escolha fica memorizada e mantém-se ao mudar de período.'],

  'Mobile navigation rebuilt as an icon grid':
    ['Navegação no telemóvel refeita como grelha de ícones',
     'O layout de computador apertava as etiquetas traduzidas em filas irregulares no telemóvel, e o deslocamento horizontal pensado como alternativa cortava em silêncio Playlists e Guia de Charts por inteiro, porque o tratamento do excesso da segunda fila — necessário para a animação de recolher — engolia o deslocamento. Os separadores foram também reordenados para o telemóvel.'],

  'Play buttons on Off the Chart entries':
    ['Botões de reprodução nas entradas do Fora do Top',
     'As músicas tocam diretamente e os artistas e álbuns abrem o seletor de faixas, como nas outras secções, e o interruptor de mostrar e esconder de cada secção passa também a abrangê-los.'],

  'Off the Chart split by type':
    ['Fora do Top dividido por tipo',
     'O painel único combinado com três colunas passou a três secções independentes, cada uma logo por baixo do bloco Quase no Top do seu tipo, por isso músicas, artistas e álbuns leem-se cada um como uma história contínua.'],

  'Three more surface colours frozen on the dark theme':
    ['Mais três cores de superfície congeladas no tema escuro',
     'A mesma falha da cor de texto anterior: três valores de superfície eram definidos uma única vez dentro do tema escuro predefinido, e não em cada tema, por isso todos os temas claros voltavam em silêncio a um fundo azul-marinho escuro onde eram usados, incluindo os cartões de categoria de Prémios. Várias cores fixas de Prémios foram também corrigidas.'],

  'Best Day tile recoloured':
    ['Bloco Melhor dia com nova cor',
     'Usa agora o mesmo destaque que Total de reproduções em vez de âmbar, a fazer par com os dois números ao lado.'],

  'Spanish previous-rank header shortened':
    ['Cabeçalho de posição anterior em espanhol encurtado',
     'Transbordava e mudava de linha onde os outros cabeçalhos de coluna não mudavam.'],

  'A text colour frozen on the default theme':
    ['Uma cor de texto congelada no tema predefinido',
     'Uma cor de texto só era definida dentro do tema escuro predefinido, por isso o seu valor ficava preso no quase branco desse tema e todos os outros temas o herdavam em vez do seu. Nos temas claros, isso tornava coisas como os nomes das playlists quase invisíveis.'],

  'Gold certification icon changed to a coin':
    ['O ícone da certificação de Ouro passa a moeda',
     'A estrela chocava com as estrelas já usadas para picos na tabela e rankings anuais, por isso os selos de ouro liam-se como mais um marcador de pico. Mudado em todos os sítios onde aparece um selo de ouro.'],

  'Options menu wrapping off the header':
    ['Menu de opções a sair do cabeçalho',
     'Quando o título de uma tabela era longo, o botão do menu passava para a linha seguinte e arrastava a lista pendente para o rebordo errado. Agora o título é cortado.'],

  'Chart run button given its own column':
    ['O botão do percurso ganha coluna própria',
     'Partilhava a célula da posição, por isso a coluna de posição às vezes mostrava um ícone em vez de um número. Agora tem coluna própria em todas as tabelas e janelas de histórico, e usa um ícone de linha em vez de um emoji colorido.'],

  'Previous rank moved next to Rank':
    ['Posição anterior junto à Posição',
     'A posição anterior fica agora logo a seguir à posição, em vez de mais adiante na linha, onde a comparação é realmente útil, com um subtítulo empilhado a identificá-la.'],

  'Backend security updates':
    ['Atualizações de segurança do servidor',
     'Foram fechadas dez vulnerabilidades reportadas em dependências do servidor, incluindo contrabando de pedidos, um contorno de restrição entre origens, uma sobreposição através de ligação simbólica e uma fuga de credenciais.'],

  'Tactile date navigation':
    ['Navegação de datas tátil',
     'Os botões de anterior e seguinte afundam quando se clica e aparecem como verdadeiras setas em vez de setas de texto, com as etiquetas mantidas em todos os idiomas.'],

  'Stylesheet cache bumped again':
    ['Cache da folha de estilos renovada outra vez',
     'A redução da navegação não aparecia porque o navegador estava a servir a folha de estilos em cache sob um endereço que não tinha mudado.'],

  'Second navigation row reads as secondary':
    ['A segunda fila de navegação lê-se como secundária',
     'Texto mais pequeno, espaçamento mais justo e uma ligeira descida de opacidade em repouso, a voltar ao máximo ao passar o rato, para que Recordes, Eventos e Prémios fiquem visivelmente abaixo dos separadores principais de período.'],

  'A sliding indicator on the tabs':
    ['Um indicador deslizante nos separadores',
     'Uma barra por fila desliza até ao separador ativo com um movimento elástico, em vez de um sublinhado que saltava de repente entre botões.'],

  'The play count rolls like an odometer':
    ['A contagem de reproduções roda como um conta-quilómetros',
     'Cada algarismo que muda roda a partir do valor anterior na sincronização, em vez de o número inteiro mudar de uma vez.'],

  'Stat cards paired with their counterparts on mobile':
    ['Cartões de estatísticas ao lado dos seus pares no telemóvel',
     'As três faixas juntam-se numa única grelha no telemóvel, para que cada número principal fique ao lado do seu cartão relacionado — Total de reproduções ao lado de Melhor dia — sem mudar nada no layout de computador.'],

  'Streak close button overlapping the filter bar':
    ['Botão de fechar das sequências por cima da barra de filtros',
     'Os dois estavam presos ao mesmo ponto no topo da área de deslocamento no telemóvel e apareciam um em cima do outro.'],

  'Oversized placeholders on releases without artwork':
    ['Marcadores enormes em lançamentos sem capa',
     'O marcador com iniciais usava sempre o tamanho grande de mosaico, por isso um lançamento sem capa aparecia como uma caixa enorme na vista de tabela em vez de uma miniatura normal.'],

  'Masthead controls get out of the way on mobile':
    ['Os controlos do cabeçalho saem da frente no telemóvel',
     'Os botões de tema, dia e idioma desvanecem-se ao fim de alguns segundos sem deslocamento e regressam quando te deslocas ou abres um painel, para não ficarem por cima do conteúdo em repouso. Foram também postos acima da barra de data fixa, com a qual chocavam.'],

  'Size tab back to a list':
    ['O separador Tamanho volta a ser uma lista',
     'A grelha de duas colunas com pastilhas preenchidas não resultou visualmente; voltou à mesma lista de linhas que o separador Vista usa.'],

  'Stale stylesheet served through the menu rewrite':
    ['Folha de estilos antiga servida depois de reescrever o menu',
     'A versão da folha de estilos não tinha sido atualizada, por isso os navegadores podiam continuar a servir uma cópia antiga em cache — incluindo um erro de layout já corrigido — mesmo depois de tudo o resto ter sido atualizado.'],

  'Chart controls gathered into one menu':
    ['Controlos da tabela reunidos num só menu',
     'As filas dispersas de botões para visualização, tamanho, vista, exportar, partilhar e reproduzir foram juntas num único menu de opções no cabeçalho de cada secção, com os separadores Mostrar, Tamanho, Vista e Ações, que se lembra do último separador que usaste.'],

  'Page through the streak graveyard':
    ['Folheia o cemitério de sequências',
     'As sequências terminadas estavam limitadas às 25 primeiras, sem forma de ver para lá delas. A paginação torna todas as sequências terminadas acessíveis.'],

  'Hiding play buttons missed two sections':
    ['Esconder os botões de reprodução esquecia duas secções',
     'O interruptor de cada secção só abrangia as três secções principais da tabela, por isso Quase no Top e Novas Entradas continuavam a mostrar os botões de reprodução depois de os desligares.'],

  'Calendar numbers matched':
    ['Números do calendário uniformizados',
     'O ano ao lado do nome do mês e os números dos dias nos calendários de eventos e do New Music Friday.'],

  'Awards numbers matched':
    ['Números dos Prémios uniformizados',
     'O seletor de ano, os selos de ano e o contador de etapas da cerimónia.'],

  'Soundtrack milestones and streaks matched':
    ['Marcos e sequências da Trilha Sonora uniformizados',
     'Os restantes títulos com números e as contagens de sequência.'],

  'Your Soundtrack numbers matched':
    ['Números da Sua Trilha Sonora uniformizados',
     'O ano grande, as estatísticas, as contagens do artista e da música principais, os números da atividade mensal e a percentagem de fidelidade passaram todos para a fonte partilhada.'],

  'Guide year numbers matched':
    ['Anos do guia uniformizados',
     'Os anos na secção "neste dia" do guia.'],

  'Guide statistics matched to the rest':
    ['Estatísticas do guia uniformizadas com o resto',
     'Os números de resumo do Guia de Charts ainda estavam na fonte antiga.'],

  'Wordmark and stat numbers settle on one face':
    ['O logótipo e os números das estatísticas ficam numa só fonte',
     'Depois de testar as duas experiências, o logótipo e os números grandes foram unificados na fonte sem serifa da interface que já existia, e o espaçamento entre letras foi reposto agora que os glifos voltaram a ser proporcionais.'],

  'Wordmark in Martian Mono':
    ['O logótipo em Martian Mono',
     'Uma fonte monoespaçada diferente só para o logótipo, com o tamanho máximo reduzido porque os seus glifos mais largos precisam de mais espaço.'],

  'Wordmark on the mono face':
    ['O logótipo na fonte monoespaçada',
     'O logótipo passou para a fonte monoespaçada para que todo o conjunto do cabeçalho se leia como uma única tipografia, com o espaçamento suavizado a condizer.'],

  'Stat numbers in a scoreboard face':
    ['Números das estatísticas numa fonte de marcador',
     'Nem a fonte de títulos nem a monoespaçada assentavam bem nos números grandes, por isso foram desenhadas seis candidatas reais para comparar e escolheu-se uma condensada a negrito, mais próxima de uma contagem decrescente de tabelas.'],

  'Stat numbers in the data font':
    ['Números das estatísticas na fonte de dados',
     'Os números grandes passaram para a mesma fonte já usada nas contagens de reproduções das tabelas.'],

  'Redesign review fixes':
    ['Correções da revisão do redesenho',
     'Havia três valores de empilhamento referidos mas nunca definidos, porque o script que os devia acrescentar parou antes de escrever, deixando dez regras de sobreposições e dicas sem qualquer ordem de empilhamento. Foram definidos e corrigidos para os valores originais.'],

  'Redesign: the standalone pages caught up':
    ['Redesenho: as páginas avulsas atualizam-se',
     'O guia de configuração e as páginas de privacidade e termos passaram para as novas fontes e paletas suavizadas, e foi corrigido um transbordo que já existia na grelha de passos do guia e na tabela de dados de privacidade.'],

  'Redesign: mobile overflow eliminated':
    ['Redesenho: transbordo no telemóvel eliminado',
     'As barras de tamanho das secções transbordavam em ecrãs estreitos e o cabeçalho tinha dois píxeis a mais de largura. A 375 píxeis a página já não tem qualquer transbordo horizontal em nenhuma vista, contra uma base que andava entre 379 e 468 píxeis.'],

  'Redesign: modals, controls and focus':
    ['Redesenho: janelas, controlos e foco',
     'As janelas ganharam um desfoque de vidro, cantos mais arredondados e sombras mais profundas. Todos os valores de empilhamento avulsos foram migrados para uma única escala documentada, mantendo exatamente a ordem, e foi acrescentado um anel de foco visível para quem usa o teclado.'],

  'Redesign: tables and dense data':
    ['Redesenho: tabelas e dados densos',
     'Um realce comum ao passar o rato nas tabelas da tabela principal, dos dados brutos e dos eventos, cores de medalha passadas para variáveis que cumprem o contraste nos temas claros, e as antigas faixas laterais dos três primeiros retiradas, já que a cor da linha já o diz.'],

  'Redesign: sections, depth and card grids':
    ['Redesenho: secções, profundidade e grelhas de cartões',
     'Os cartões das tabelas ganharam contornos translúcidos e sombras em camadas, Novas Entradas e Quase no Top trocaram as faixas laterais por painéis interiores tingidos, e a faixa de estatísticas passou a cartões separados que sobem ao passar o rato, em vez de uma grelha de folha de cálculo de um píxel.'],

  'Redesign: masthead and navigation':
    ['Redesenho: cabeçalho e navegação',
     'O cabeçalho tira agora o gradiente e o brilho do tema, em vez de ter uma versão escrita à mão para cada tema, por isso todos os temas escuros se tingem corretamente e foram apagadas quatro regras redundantes. Os cabeçalhos claros foram suavizados e a navegação modernizada.'],

  'The 2026 redesign: tokens, colour and type':
    ['O redesenho de 2026: variáveis, cor e tipografia',
     'A base de uma renovação visual completa. As dez paletas de temas foram suavizadas e verificadas quanto ao contraste, um único conjunto de valores de design controla agora o espaçamento, os cantos, o movimento e a profundidade, e a aplicação passou para um novo par de tipografias. Foi acrescentada a todos os temas uma cor de grelha em falta, que fazia as linhas dos gráficos aparecerem escuras nos temas claros.'],

  'Chart tables fit a phone without sideways scrolling':
    ['As tabelas cabem no telemóvel sem deslocamento lateral',
     'Os espaçamentos e larguras de coluna estavam pensados para computador, empurrando a coluna Reproduções para fora do rebordo. O espaçamento foi apertado e foram acrescentadas etiquetas de coluna curtas, por isso a tabela inteira cabe entre 320 e 414 píxeis de largura.'],

  'Modals that trapped you on a phone':
    ['Janelas que te prendiam no telemóvel',
     'As janelas de fonte de dados, de pormenor e de sequências podiam ficar mais altas do que o ecrã de um telemóvel, deslocando o botão de fechar para fora de alcance, sem outra saída. Agora os controlos de fechar ficam fixos no telemóvel. Foi também corrigido um transbordo horizontal.'],

  'Ten correctness bugs from a review pass':
    ['Dez erros de funcionamento encontrados numa revisão',
     'Entre eles: o mapa de calor e o histórico da janela de música vinham sempre vazios porque a chave que procuravam estava codificada de uma forma e guardada de outra; e qualquer nome com apóstrofo estragava os controlos associados, porque a codificação deixava os apóstrofos intactos. Nada de um nome como "Guns N\' Roses" respondia.'],

  /* ========== JUNHO 2026 ========== */

  'Bubbling Under badges refined again':
    ['Selos do Quase no Top afinados outra vez',
     'Ressurgente aparecia em músicas que caíam da tabela para a zona e lá ficavam, o que não é um ressurgimento — nunca saíram para voltar. Essas têm agora um novo selo, A Resistir; Yo-Yo passou a chamar-se Vai e Volta, e os ícones foram atualizados.'],

  'A different chart size per section':
    ['Um tamanho de tabela diferente por secção',
     'Cada secção tem o seu próprio seletor de tamanho em vez de uma barra global, memorizado à parte em cada período, por isso Músicas pode ser um top 10 enquanto Artistas é um top 50 e Álbuns um top 25. As definições globais existentes são transportadas no primeiro carregamento.'],

  'Share button moved right':
    ['Botão Partilhar passado para a direita',
     'Nas secções de artistas e álbuns, para ficar igual às outras.'],

  'Album play buttons offered a track list everywhere':
    ['Os botões de reprodução de álbum oferecem a lista de faixas em todo o lado',
     'Fora da vista de tabela, carregar em reproduzir num álbum pesquisava o título do álbum como se fosse uma música. Agora todas as vistas mostram a mesma lista de faixas que a tabela mostrava.'],

  'Better default layouts':
    ['Layouts predefinidos melhores',
     'Os artistas abrem em Mosaico e os álbuns em Grelha de cartões, que lhes assentam melhor do que uma tabela.'],

  'Uniform action buttons':
    ['Botões de ação uniformes',
     'Um único estilo coerente nos botões de ação, que passaram para baixo do subtítulo.'],

  'Section controls reorganised':
    ['Controlos das secções reorganizados',
     'Botões de ação à esquerda, interruptores de visualização à direita.'],

  'A different view mode per section':
    ['Um modo de vista diferente por secção',
     'Músicas, Artistas e Álbuns lembram-se cada um do seu próprio layout, em vez de mudarem os três ao mesmo tempo.'],

  'Display controls per section':
    ['Controlos de visualização por secção',
     'O menu de visualização e o botão de exportar passaram para o cabeçalho de cada secção, e Músicas, Artistas e Álbuns ganharam cada um um conjunto completo e independente de interruptores — esconder os selos de certificação nas músicas já não os esconde nos álbuns.'],

  'More room to breathe':
    ['Mais espaço para respirar',
     'Mais espaçamento dentro dos cartões, mais espaço entre eles e cabeçalhos mais altos.'],

  'Chart sections became cards':
    ['As secções das tabelas passaram a cartões',
     'Cantos arredondados, um contorno, um fundo e espaçamento dão a cada secção a sua própria superfície, em vez de se misturarem umas com as outras.'],

  'Copy Tracklist copies immediately':
    ['Copiar lista de faixas copia logo',
     'O botão mudou de nome e agora copia a lista mal é carregado, continuando a abrir a janela para mostrar o que foi copiado e confirmá-lo.'],

  'Export your at-risk streaks as a tracklist':
    ['Exporta as tuas sequências em risco como lista de faixas',
     'Um quarto botão em Em risco hoje abre a janela de exportação já carregada com essas músicas, num formato que os serviços de transferência aceitam, com sugestões de nome de playlist pensadas para a ocasião.'],

  'Peak boxes made to stand out':
    ['As caixas de pico passam a destacar-se',
     'A caixa que marca a semana do pico ganhou um preenchimento mais forte e um brilho âmbar, com tratamentos dourado e roxo distintos para os picos na tabela combinada e na linha temporal do Quase no Top.'],

  'Chart run boxes unreadable on light themes':
    ['Caixas do percurso ilegíveis nos temas claros',
     'As caixas tinham um contorno branco que desaparecia, tons demasiado fracos para se verem e números de posição em néon. Contornos, intensidade do fundo e cores do texto foram corrigidos nos temas claros.'],

  'Bubbling Under badges invisible on light themes':
    ['Selos do Quase no Top invisíveis nos temas claros',
     'Os treze tipos de selo usavam uma paleta néon que praticamente desaparecia num fundo claro. Cada um tem agora uma versão para tema claro, com texto forte no mesmo tom sobre uma cor suave.'],

  'Navigation polish':
    ['Acabamento da navegação',
     'O botão Mais passou para baixo das duas filas, cantos arredondados e contornos, espaço à volta do banner de sequência e ícones renovados.'],

  'Eleven improvements to the navigation':
    ['Onze melhorias na navegação',
     'Ícones em todos os separadores, um sublinhado a marcar o ativo, uma cor a distinguir a segunda fila, pré-visualizações ao passar o rato, as teclas de 1 a 9 como atalhos, selos a marcar conteúdo novo, ligações partilháveis para cada separador, um brilho de carregamento, uma segunda fila recolhível e uma barra que encolhe ao deslocar.'],

  'The Charts Guide filled out':
    ['O Guia de Charts completo',
     'Vinte secções a cobrir todas as funcionalidades: uma visita guiada, pesquisa, as tuas estatísticas, uma lista de configuração, neste dia, sugestões, pérolas escondidas, atalhos de teclado, uma explicação de cada separador, um glossário, perguntas frequentes, uma linha temporal, um registo de alterações, guias de exportação e um formulário de comentários. A navegação foi dividida em duas filas para arranjar espaço.'],

  'The Charts Guide':
    ['O Guia de Charts',
     'Um separador que explica a aplicação a partir de dentro, acessível pela barra de navegação, juntamente com correções em nove sítios onde os temas claros tinham um contraste ilegível.'],

  'Collapse All reads as a global control':
    ['Recolher tudo lê-se como um controlo geral',
     'Tinha o estilo de uma parte do menu de visualização por baixo. Foi-lhe retirado o fundo de barra de ferramentas e foi separado, para se ler como algo que atua em todas as secções e não como mais uma opção de visualização.'],

  'Light themes redesigned around white cards':
    ['Temas claros redesenhados à volta de cartões brancos',
     'Os cinco temas claros põem agora branco puro por trás das tabelas, cartões e janelas, para que o conteúdo se destaque da página, e a própria página tem um tom mais saturado da cor do tema a emoldurá-lo. Os cabeçalhos azul-marinho e roxo foram escurecidos para continuarem a distinguir-se dos fundos mais fortes.'],

  'Collapse All':
    ['Recolher tudo',
     'Uma barra por cima das secções da tabela recolhe ou expande Músicas, Artistas, Álbuns, Fora do Top, Quase no Top e Novas Entradas com um clique, e mantém-se sincronizada quando as secções são abertas ou fechadas uma a uma.'],

  'Twelve improvements to the queue':
    ['Doze melhorias na fila',
     'As faixas já tocadas deixam de desaparecer — ficam esbatidas por cima da atual, com o que vem a seguir por baixo. Cada item ganhou um botão para subir ao topo, as remoções podem ser anuladas durante quatro segundos, os duplicados podem ser retirados com um toque, e a fila pode ser guardada como playlist.'],

  'The player redesigned as a vertical card':
    ['O leitor redesenhado como um cartão vertical',
     'A faixa horizontal apertada, com catorze botões a quebrar em várias linhas, foi substituída por um verdadeiro cartão: um cabeçalho com a pega de arrastar e os controlos de janela, um grande quadrado com a capa, uma barra de progresso a toda a largura, um botão de reproduzir em destaque ladeado por repetir, saltar e volume, e os onze controlos restantes numa única linha fina por baixo.'],

  'Clear the queue, and resume from Playlists':
    ['Limpa a fila, e retoma a partir das Playlists',
     'Um botão para esvaziar a fila e um botão Retomar na vista de Playlists.'],

  'Bubbling Under weeks in the normal chart run':
    ['Semanas no Quase no Top dentro do percurso normal',
     'O percurso semanal normal ganhou um interruptor que mostra as semanas em que uma entrada ficou perto mas não entrou, ao lado das semanas em que esteve na tabela.'],

  'Background playback guard stopped giving up':
    ['A proteção da reprodução em segundo plano deixou de desistir',
     'As pausas automáticas repetidas venciam a única nova tentativa, e o controlador limpava o seu próprio estado enquanto o separador ainda estava escondido, por isso deixava de tentar depois de retomar uma vez.'],

  'Backend woken before you need it':
    ['O servidor é acordado antes de precisares dele',
     'O servidor adormece quando está inativo e demora uns 30 segundos a acordar, e isso pagava-se precisamente no momento em que carregavas em reproduzir. Agora é chamado ao carregar a página e ao desenhar a tabela, e o ciclo de novas tentativas espera o suficiente para cobrir um arranque a frio.'],

  'Playback stopped pausing itself in the background':
    ['A reprodução deixou de se pausar sozinha em segundo plano',
     'Sair do separador fazia o vídeo ser pausado à força. Agora essas pausas são detetadas e retomadas de imediato. Foram acrescentados botões de anterior e seguinte à notificação do Android.'],

  'Chart and Bubbling Under on one timeline':
    ['Tabela e Quase no Top numa só linha temporal',
     'Um interruptor junta as semanas que uma entrada passou na tabela com as que passou logo abaixo num único percurso cronológico, por isso uma carreira que cruzou a linha várias vezes lê-se como uma só história.'],

  'Preview a Bubbling Under week':
    ['Pré-visualização de uma semana do Quase no Top',
     'Clicar na caixa de uma semana mostra toda a classificação da zona nessa semana, com a entrada destacada, e uma ligação para a tabela.'],

  'Bubbling Under chart runs':
    ['Percursos no Quase no Top',
     'Cada entrada pode expandir um percurso que mostra só o seu tempo na zona: total de semanas, melhor posição, sequência mais longa, passagens separadas, pico de reproduções e uma caixa por semana.'],

  'Lock screen playback on Android':
    ['Reprodução com o ecrã bloqueado no Android',
     'A faixa atual é registada no sistema operativo, por isso a reprodução continua quando o ecrã bloqueia ou mudas de aplicação, e os controlos do ecrã de bloqueio funcionam.'],

  'Search said no results when the server was waking':
    ['A pesquisa dizia que não havia resultados enquanto o servidor acordava',
     'A pesquisa com vários resultados não sabia lidar com um servidor adormecido, por isso dizia que não tinha encontrado nada em vez de esperar.'],

  'Play or save your at-risk streaks':
    ['Ouve ou guarda as tuas sequências em risco',
     'A secção Em risco hoje ganhou Reproduzir tudo, Pôr tudo na fila e Guardar playlist — precisamente a secção onde agir de imediato é o que importa.'],

  'Track lists on artist and album play buttons':
    ['Listas de faixas nos botões de reprodução de artistas e álbuns',
     'Reproduzir um artista ou um álbum é ambíguo, por isso o botão abre agora uma lista com as últimas dez faixas dele que ouviste, cada uma com botões de reproduzir e pôr na fila, mais Reproduzir tudo e Pôr tudo na fila. As linhas de música continuam a tocar diretamente.'],

  'Bubbling Under names its chart size':
    ['O Quase no Top diz o tamanho da tabela',
     'O título diz abaixo de que tabela estão as entradas.'],

  'Play or save a day\'s singles from the calendar':
    ['Ouve ou guarda os singles de um dia a partir do calendário',
     'Ver um único dia de singles no calendário oferece agora Reproduzir tudo, Criar playlist e Exportar.'],

  'The Playlists tab':
    ['O separador Playlists',
     'Um gestor de playlists completo: expande uma playlist, reproduz a partir de qualquer faixa, muda o nome ali mesmo, arrasta para reordenar, retira faixas e apaga playlists. As playlists sincronizam com a tua conta e juntam-se quando inicias sessão noutro sítio, por isso sobrevivem à mudança de navegador e de dispositivo.'],

  'Bubbling Under weeks counted one too many':
    ['O Quase no Top contava uma semana a mais',
     'A semana atual era contada duas vezes, por isso cada entrada parecia uma semana mais velha do que era e uma estreia aparecia como duas semanas.'],

  'Collaborations scrobbled with the right album':
    ['Colaborações registadas com o álbum certo',
     'Os créditos com convidados e separados por vírgulas eram enviados inteiros, por isso as pesquisas falhavam. Agora usa-se o artista principal, e a aplicação procura o álbum no teu próprio histórico antes de perguntar ao Last.fm, o que é mais fiável e poupa um pedido.'],

  'Play buttons on single releases':
    ['Botões de reprodução nos singles',
     'Os cartões de singles em Lançamentos Recentes ganharam um botão de reprodução.'],

  'Play buttons in Bubbling Under':
    ['Botões de reprodução no Quase no Top',
     'As entradas da zona podem ser reproduzidas como qualquer outra linha.'],

  'Missing albums looked up before scrobbling':
    ['Os álbuns em falta são procurados antes do scrobble',
     'Quando uma música não tem álbum no teu histórico, o leitor pergunta agora ao Last.fm mal a reprodução começa, por isso a resposta chega antes de o scrobble dos 30 segundos disparar.'],

  'Player was scrobbling a dash as the album name':
    ['O leitor registava um hífen como nome do álbum',
     'As músicas sem álbum conhecido guardam um hífen como marcador, e a verificação de existência do álbum tratava-o como um valor real, por isso o Last.fm recebia um hífen literal.'],

  'Freefall and Yo-Yo badges':
    ['Selos Queda Livre e Yo-Yo',
     'Queda Livre marca a maior descida de reproduções da semana, e Yo-Yo marca as entradas que entraram e saíram da zona três ou mais vezes.'],

  'Weeks spelled out in Off the Chart':
    ['Semanas por extenso no Fora do Top',
     'Igual à alteração feita no Quase no Top.'],

  'Suggestions while editing a play':
    ['Sugestões ao editar uma reprodução',
     'Os campos de artista, faixa e álbum sugerem agora valores do teu próprio histórico enquanto escreves, que é a diferença entre corrigir um nome e ter de o reescrever exatamente.'],

  'Consecutive streaks in Bubbling Under':
    ['Sequências consecutivas no Quase no Top',
     'Ao lado do total de sempre, cada entrada mostra a sua sequência atual ininterrupta na zona, que aparece a partir de duas semanas e volta a zero quando sai.'],

  'Fallen badge narrowed':
    ['Selo Caído mais restrito',
     'Agora só marca as entradas que caíram na zona diretamente do top três.'],

  'Bubbling Under badges made history-aware':
    ['Os selos do Quase no Top passam a ter em conta o histórico',
     'A Cair aparecia em tudo o que alguma vez esteve na tabela, e não só nas entradas que saíram na semana passada. O selo de possível explosão foi substituído por outros que leem o histórico completo: Novo para a primeira aparição de sempre, Em Alta para semanas consecutivas sem nunca ter entrado na tabela, e Persistente quando isso passa as cinco semanas.'],

  'Weeks spelled out in Bubbling Under':
    ['Semanas por extenso no Quase no Top',
     'O selo de semanas abreviado passou a ser escrito por extenso.'],

  'Bubbling Under on yearly and all-time charts':
    ['Quase no Top nas tabelas anuais e de sempre',
     'Essas vistas são desenhadas por outro caminho, que nunca escondia a secção.'],

  'Bubbling Under leaking into other tabs':
    ['O Quase no Top escapava para outros separadores',
     'Seis separadores terminam antes de chegar a correr o código que esconderia a secção, por isso ela ficava no ecrã onde não fazia sentido.'],

  'Bubbling Under':
    ['Quase no Top',
     'Uma secção que mostra as músicas, artistas e álbuns que ficam mesmo à porta da tabela — os dez seguintes, ou cinquenta num top 100 — para que os que ficam por pouco sejam visíveis em vez de invisíveis. Cada entrada mostra quantas reproduções lhe faltam, e selos de queda, possíveis explosões e semanas passadas na zona.'],

  'Compact view columns rethought':
    ['Colunas da vista Compacta repensadas',
     'Os emojis de medalha foram substituídos por números de posição que mantêm as cores do pódio, e a coluna combinada de movimento foi dividida em semanas na tabela e posição anterior, como na vista de tabela.'],

  'Compact play button and arrow alignment':
    ['Botão de reprodução e setas alinhados na Compacta',
     'O botão de reprodução mudou de cor e as setas de movimento foram centradas.'],

  'Clearer click targets in Stack view':
    ['Zonas de clique mais claras na vista Pilha',
     'As músicas expandem-se no próprio sítio, enquanto clicar no título de um artista ou álbum abre a sua página.'],

  'New and returning edges visible on podium cards':
    ['Rebordos de novo e de regresso visíveis nos cartões do pódio',
     'O brilho de ouro, prata e bronze tapava o rebordo verde-azulado e roxo que marca uma entrada nova ou que regressa. Agora o brilho fica em três lados, para que se vejam os dois.'],

  'Movement colours across every view':
    ['Cores de movimento em todas as vistas',
     'As cores das barras e os rebordos das entradas definidos pelo movimento foram alargados a Tabela, Grelha de cartões, Compacta e Película.'],

  'Stack rank numbers cut off':
    ['Números de posição cortados na Pilha',
     'Os números de posição grandes estavam a ser cortados.'],

  'Fifteen additions to Stack view':
    ['Quinze novidades na vista Pilha',
     'Brilhos a pulsar nos três primeiros, um número de posição grande como marca de água, uma barra de progresso colorida pelo movimento, rebordos coloridos para estreias e regressos, o nome do álbum ao lado do título, as reproduções de sempre na linha de dados e as semanas na tabela.'],

  'Per-category heatmaps made full size':
    ['Mapas de calor por categoria em tamanho completo',
     'Os mapas de calor de artista, música e álbum igualam agora o principal em tamanho e etiquetas, com pormenor ao passar o rato e clique em cada dia ativo.'],

  'Nineteen additions to the streak heatmap':
    ['Dezanove novidades no mapa de calor de sequências',
     'Um seletor de intervalo para o último ano, qualquer ano em particular ou todo o histórico; cinco esquemas de cor; sombreado contínuo em vez de cinco níveis fixos; etiquetas de meses e dias da semana; e anéis a marcar hoje e o teu dia de pico.'],

  'The Hall of Fame as plaques':
    ['O Salão da Fama como placas',
     'Cada entrada mostra agora a posição, o tipo, a duração do recorde a contar para cima, as datas exatas entre as quais foi feito e se ainda está em curso — para ficar claro porque é que cada um lá está, e não só que está.'],

  'Artist and album art swapped in Card Grid':
    ['Imagens de artista e álbum trocadas na Grelha de cartões',
     'Os dois tipos recebiam o mesmo identificador porque era formado pela primeira letra da palavra, e artistas e álbuns começam pela mesma. As imagens iam parar aos cartões errados.'],

  'Sign-in popup blocked':
    ['Janela de início de sessão bloqueada',
     'Um cabeçalho de segurança do alojamento impedia a janela de início de sessão do Google de devolver a resposta.'],

  'Filmstrip Save button produced nothing':
    ['O botão Guardar da Película não produzia nada',
     'As imagens carregadas de outros sites impedem uma página de se transformar em imagem, por isso guardar falhava em silêncio, e de qualquer forma só a parte visível da faixa era capturada. Agora a faixa é copiada fora do ecrã em largura total, com todas as imagens convertidas primeiro.'],

  'Play an at-risk streak straight from the list':
    ['Ouve uma sequência em risco diretamente da lista',
     'Os itens de sequência tocam na aplicação em vez de abrirem o YouTube num novo separador, entram na fila em silêncio se já estiver alguma coisa a tocar, e as entradas de artista e álbum mostram as últimas cinco músicas dele que ouviste.'],

  'The streak window rebuilt':
    ['A janela de sequências refeita',
     'Separadores para Sequências, Mapa de calor e Cemitério, um resumo das sequências ativas, em risco e perdidas, secções recolhíveis que se lembram do seu estado, pesquisa ao vivo, ordenação por duração ou nome, a data de início de cada sequência e um troféu quando uma sequência atual iguala o teu melhor de sempre.'],

  'Filmstrip scrolls continuously':
    ['A Película desloca-se sem parar',
     'O deslocamento automático foi refeito como um ciclo contínuo que pára ao passar o rato, como o carrossel da Máquina do Tempo, em vez de avançar aos saltos e parar no fim.'],

  'Filmstrip detail panel tidied':
    ['Painel de pormenor da Película arrumado',
     'Os selos saíram do cartão para uma única linha no painel expandido, as etiquetas de semanas e reproduções passaram a ser escritas por extenso em vez de abreviadas, e ambas foram ligadas ao sistema de tradução.'],

  'Mouse drags stopped changing the period':
    ['Arrastar com o rato já não muda o período',
     'Selecionar texto com o rato num computador era interpretado como um deslize e mudava de período. Agora os deslizes só são reconhecidos por toque.'],

  'Wider filmstrip cards and restyled jump controls':
    ['Cartões da Película mais largos e controlos de salto renovados',
     'Os cartões voltaram a alargar, e os botões de saltar para uma posição foram redesenhados como os separadores de vista, com etiquetas mais curtas.'],

  'Filmstrip made interactive':
    ['A Película passa a ser interativa',
     'Cartões mais largos com imagens maiores para os três primeiros, títulos que mudam de linha em vez de serem cortados, posição e movimento separados, selos de certificação e pico sobre a imagem, e um botão de reprodução ao passar o rato.'],

  'Top-three glow in Card Grid':
    ['Brilho dos três primeiros na Grelha de cartões',
     'Igual ao tratamento do mosaico.'],

  'Podium tints on the chart rows':
    ['Cores de pódio nas linhas da tabela',
     'Fundos de linha dourado, prateado e bronze na tabela principal e na vista compacta.'],

  'Mosaic scales to the chart size':
    ['O mosaico acompanha o tamanho da tabela',
     'Um top 50 ou top 100 numa altura fixa deixava as entradas de baixo como tirinhas ilegíveis, por isso a grelha cresce agora com a tabela. O conteúdo do cartão expandido ajusta-se ao mosaico onde está.'],

  'Stronger top-three glows':
    ['Brilhos mais fortes nos três primeiros',
     'Com todos os outros mosaicos agora a brilhar na sua própria cor, o pódio precisava de um tratamento mais largo e mais brilhante para continuar a destacar-se.'],

  'Mosaic tiles glow their own colour':
    ['Os mosaicos brilham na sua própria cor',
     'Cada mosaico do quarto lugar para baixo vai buscar a cor mais viva da sua própria imagem e usa-a no rebordo e no brilho. Os três primeiros mantêm ouro, prata e bronze.'],

  'Missing artwork on the expanded mosaic card':
    ['Imagem em falta no cartão expandido do mosaico',
     'As duas faces de um mosaico partilhavam um identificador, por isso só a da frente recebia a imagem.'],

  'Search retries when the server is waking':
    ['A pesquisa volta a tentar enquanto o servidor acorda',
     'O servidor adormece quando está inativo e devolve um erro enquanto arranca, o que era tratado como uma pesquisa falhada. Agora volta-se a tentar nessas respostas.'],

  'Artwork on the expanded mosaic card':
    ['Imagem no cartão expandido do mosaico',
     'Uma miniatura ao lado da posição, do título e do artista.'],

  'Click a mosaic tile to expand it':
    ['Clica num mosaico para o expandir',
     'O mosaico vira-se para uma face com as estatísticas completas, a crescer se for pequeno demais para ler, enquanto os outros escurecem.'],

  'Mosaic frame was killing the glows':
    ['A moldura do mosaico apagava os brilhos',
     'O painel posto à volta da grelha cortava os brilhos e os efeitos ao passar o rato dos mosaicos que devia emoldurar.'],

  'Hover a mosaic tile for its chart run':
    ['Passa o rato por um mosaico para veres o percurso',
     'Sobe um cartão fosco com o título completo, o pico, as semanas na tabela, as reproduções de sempre com a certificação, a barra de reproduções desta semana e um botão para pôr a faixa na fila.'],

  'Mosaic polish and movement badges':
    ['Acabamento do mosaico e selos de movimento',
     'Cantos mais arredondados, um painel por trás da grelha e selos de movimento coloridos em cada mosaico.'],

  'Mosaic labels always visible':
    ['Etiquetas do mosaico sempre visíveis',
     'O título, o artista e o número de reproduções aparecem sempre, em vez de só ao passar o rato, com um número de posição grande como marca de água em cada mosaico.'],

  'Mosaic rebuilt as a treemap':
    ['O mosaico refeito como treemap',
     'Os mosaicos enchem agora o espaço de ponta a ponta, cada um com área proporcional às suas reproduções, por isso a forma da tabela vê-se no próprio layout. Gradientes mantêm o texto legível sem passar o rato, e os três primeiros têm brilhos de ouro, prata e bronze.'],

  'Compact view improved':
    ['Vista Compacta melhorada',
     'Medalhas, selos, um acordeão para o pormenor, um botão de reprodução, imagem ao passar o rato e um cabeçalho que fica no sítio enquanto te deslocas.'],

  'Card Grid view made interactive':
    ['A vista Grelha de cartões passa a ser interativa',
     'Clicar num cartão reprodu-lo, passar o rato mostra um botão de reprodução, e o clique direito oferece Reproduzir agora, Reproduzir a seguir, Adicionar à fila, Reproduzir semelhantes e uma pesquisa. Os selos de pico e certificação passaram para os cartões, e o movimento aparece como um rebordo colorido.'],

  'Lyrics panel would not scroll':
    ['O painel de letras não se deslocava',
     'O controlador da roda do volume intercetava o deslocamento dentro das letras.'],

  'Sleep timer, lyrics, crossfade and more':
    ['Temporizador, letras, transição e mais',
     'Um temporizador para desligar, transição suave entre faixas, um painel de letras, um limiar de scrobble ajustável, capas, playlists com nome, Reproduzir semelhantes, imagem sobre imagem, velocidade de reprodução e um cartão para partilhar.'],

  'Seeking, repeat, shuffle and Play Next':
    ['Avançar, repetir, aleatório e Reproduzir a seguir',
     'Uma barra de progresso que podes arrastar ou mover com as setas, um botão de repetir que alterna entre desligado, uma e todas, aleatório para a fila existente, volume nas teclas para cima e para baixo, uma opção Reproduzir a seguir que passa à frente da fila, e a possibilidade de pôr um histórico inteiro na fila de uma vez.'],

  'Artist names in the queue':
    ['Nomes dos artistas na fila',
     'A fila só listava títulos, o que não chega para distinguir duas versões.'],

  'Scrolling the queue changed the volume':
    ['Deslocar a fila mudava o volume',
     'O controlador da roda para o volume apanhava deslocamentos que eram para a lista da fila.'],

  'The player remembers what you were playing':
    ['O leitor lembra-se do que estavas a ouvir',
     'Reabrir o separador mostra o minileitor com a última faixa pronta a retomar, em vez de um leitor vazio.'],

  'Play All and Shuffle missing':
    ['Reproduzir tudo e Aleatório desaparecidos',
     'Os dois botões tinham desaparecido das tabelas semanais e mensais de músicas.'],

  'Player controls spilling outside the frame':
    ['Controlos do leitor a sair da moldura',
     'Os controlos do minileitor transbordavam o seu próprio cartão.'],

  'Ten more things in the music player':
    ['Mais dez coisas no leitor de música',
     'Um botão de saltar, uma recuperação mais inteligente quando um vídeo não toca, uma pesquisa personalizada com um seletor de resultados, arrastar livremente para qualquer ponto do ecrã, quatro tamanhos até 640 por 360, e uma fila que podes reordenar a arrastar e que sobrevive a um recarregamento.'],

  'Time Machine cards washed out on hover':
    ['Os cartões da Máquina do Tempo desbotavam ao passar o rato',
     'Nos temas claros a cor ao passar o rato ficava mais clara do que o próprio cartão, por isso passar o rato fazia o cartão desvanecer em vez de se destacar. Os temas claros escurecem agora ao passar o rato, como os escuros.'],

  'Unreadable tab labels on light themes':
    ['Etiquetas de separador ilegíveis nos temas claros',
     'Passar o rato por um separador em qualquer um dos cinco temas claros punha o texto branco sobre um fundo claro. A regra era só para os temas escuros e estava a ser herdada em todo o lado.'],

  'Anniversaries stopped loading entirely':
    ['Os aniversários de lançamento deixaram de carregar',
     'O pedido dos pormenores completos do lançamento estava a ser recusado liminarmente pela base de dados musical, por isso os aniversários vinham vazios. O pedido foi corrigido e os resultados vazios já guardados em cache foram apagados.'],

  'Pagination appearing on weekly charts':
    ['Paginação a aparecer nas tabelas semanais',
     'Voltar à vista de tabela apagava a regra que escondia os controlos de paginação, deixando-os aparecer nas tabelas semanais, onde não fazem sentido — pertencem às vistas anual e de sempre.'],

  'Spanish label for singles corrected':
    ['Etiqueta de singles em espanhol corrigida',
     'A palavra em inglês tinha ficado na tradução para espanhol.'],

  'Albums stat renamed to Albums & Singles':
    ['A estatística Álbuns passa a chamar-se Álbuns e singles',
     'O número sempre contou os dois, em todos os idiomas.'],

  'Close button on the edit window':
    ['Botão de fechar na janela de edição',
     'A janela Editar scrobble não tinha nenhuma forma visível de ser fechada.'],

  'Open a chart link in a new tab':
    ['Abre uma ligação de tabela num novo separador',
     'As ligações de período não eram verdadeiras ligações, por isso clicar com o botão direito ou do meio não fazia nada. As doze têm agora endereços reais, e abrir uma diretamente leva-te ao período certo assim que os dados carregam.'],

  'Demo button did nothing':
    ['O botão de demonstração não fazia nada',
     'As funções por trás dele tinham sido acrescentadas a uma cópia do código que o site em produção não carrega.'],

  'A demo button':
    ['Um botão de demonstração',
     'Um botão grande por cima dos cartões de importação que carrega os dados de exemplo e começa logo a fazer tabelas, sem configuração nenhuma.'],

  'Sample data for new visitors':
    ['Dados de exemplo para novos visitantes',
     'A página inicial oferece uma folha de exemplo pública, para que a aplicação possa ser explorada antes de te comprometeres a configurar uma fonte de dados própria.'],

  'Release anniversaries on the right day':
    ['Aniversários de lançamento no dia certo',
     'A data de lançamento de um álbum era tirada da edição mais antiga registada, que muitas vezes é uma exceção digital ou de streaming e não o lançamento de que as pessoas se lembram. Agora a data é a partilhada pelo maior número de edições, recorrendo à mais antiga só quando não há nada melhor.'],

  'Song profiles':
    ['Perfis de música',
     'Clicar numa música nas tabelas De Sempre ou Anual abre um perfil completo: cartões de posição, estatísticas, prémios, placas de certificação, picos na tabela, recordes, cada percurso, sequência e presença com ligações para as semanas em que aconteceram, um gráfico de como a posição se moveu, um padrão de audição, um mapa de calor e o histórico completo de reproduções.'],

  'Bigger icons on the sync bar':
    ['Ícones maiores na barra de sincronização',
     'Os botões de sincronizar, configurar e scrobble tinham ícones pequenos demais para se verem. Cada ícone tem agora o tamanho certo em todos os idiomas, o que obrigou a refazer a forma como esses botões guardam o texto traduzido.'],

  'Time Machine hint translated':
    ['Dica da Máquina do Tempo traduzida',
     'O texto explicativo por cima da Máquina do Tempo, em espanhol e nas duas variantes do português.'],

  /* ========== MAIO 2026 ========== */

  'Five ways to look at a weekly chart':
    ['Cinco formas de ver uma tabela semanal',
     'Os layouts Grelha de cartões, Compacta, Mosaico, Película e Pilha ao lado da tabela normal, escolhidos num seletor dentro de cada secção, com as três secções a mudar ao mesmo tempo.'],

  'A hero card and a number one spotlight':
    ['Um cartão de abertura e um destaque para o número um',
     'Um cartão de abertura em gradiente no topo, um destaque para o artista líder do ano e cartões coloridos nas tabelas principais.'],

  'Your Soundtrack made bolder':
    ['A Sua Trilha Sonora mais ousada',
     'Números maiores, secções que aparecem à medida que te deslocas, barras em gradiente e posições do topo em destaque.'],

  'View modes on weekly and monthly releases':
    ['Modos de vista nos lançamentos semanais e mensais',
     'Os seletores de carrossel, mosaico, tabela e lista foram alargados às secções de próximos e recentes lançamentos das tabelas semanais e mensais.'],

  'Chart animation smoothed, with a speed control':
    ['Animação da tabela mais suave, com controlo de velocidade',
     'As linhas que ainda não tinham nenhuma reprodução apareciam com a posição em branco, o que estragava a tabela visualmente; desapareceram, e as entradas aparecem agora no momento em que chegam ao corte pela primeira vez, a surgir aos poucos enquanto sobem. As linhas que saem são retiradas antes de se medirem as posições, para não deixarem buracos, e um deslizador define a velocidade.'],

  'Animated fire on the streak count':
    ['Fogo animado na contagem da sequência',
     'A contagem do banner de sequência ganhou uma chama animada.'],

  'Streak thumbnails show their own artwork':
    ['As miniaturas da sequência mostram a sua própria imagem',
     'Todos os mosaicos pequenos mostravam a mesma capa da imagem principal da sequência. Agora cada um vai buscar a imagem da sua própria reprodução, respeita a fonte de imagem escolhida para cada item, e o limite de nove mosaicos foi retirado.'],

  'Collaborations no longer break an artist streak':
    ['As colaborações já não quebram a sequência de um artista',
     'A sequência de um artista era quebrada por uma reprodução creditada a ele juntamente com outra pessoa, porque os dois nomes eram comparados como um único texto. Agora os dois lados são divididos em artistas individuais. Ao mesmo tempo foi acrescentado um interruptor para desligar a animação da tabela.'],

  'See which plays were autocorrected':
    ['Vê que reproduções foram corrigidas automaticamente',
     'As linhas corrigidas têm um selo com os valores originais e um rebordo colorido, e um filtro mostra só as entradas que uma regra alterou — para que uma correção se veja, em vez de ser algo que aconteceu em silêncio aos teus dados.'],

  'The streak banner':
    ['O banner de sequência',
     'A tua sequência de audição ativa fica sempre entre a barra de sincronização e os separadores, com efeitos de fogo, capas e uma faixa com as tuas últimas reproduções em pequenos mosaicos.'],

  'Time Machine tiles start the player':
    ['Os mosaicos da Máquina do Tempo ligam o leitor',
     'Clicar num mosaico de música com o leitor desligado mostrava uma mensagem de fila para um leitor que não existia. Agora abre logo o leitor.'],

  'Your Soundtrack':
    ['A Sua Trilha Sonora',
     'Um separador de balanço do ano: um resumo animado de reproduções, dias ativos, artistas, descobertas e sequência; os teus cinco artistas e músicas principais com barras proporcionais; um gráfico de atividade mensal a marcar os teus meses mais alto e mais baixo; uma pontuação de fidelidade face ao ano anterior; os artistas que descobriste; e os marcos que ultrapassaste. Ao mesmo tempo, os mosaicos da Máquina do Tempo passaram a ser clicáveis.'],

  'Artist awards showed zero until you visited Awards':
    ['Os prémios do artista mostravam zero até visitares Prémios',
     'Os dados dos prémios só eram carregados ao abrir o separador Prémios, por isso as nomeações e vitórias de um artista apareciam sempre a zero à primeira. Agora todos os anos são carregados quando a janela abre e a faixa é redesenhada quando chegam.'],

  'Expandable award categories per artist':
    ['Categorias de prémios expansíveis por artista',
     'A faixa de prémios na janela do artista abre-se para listar cada categoria.'],

  'Records and awards inside the artist modal':
    ['Recordes e prémios dentro da janela do artista',
     'Os recordes de tabela de um artista e as suas nomeações e vitórias aparecem agora na sua própria página.'],

  'Peak day and peak streak in the artist modal':
    ['Dia de pico e sequência de pico na janela do artista',
     'Mais dois blocos: o máximo de reproduções num só dia e a sequência mais longa.'],

  'Chart size follows you between devices':
    ['O tamanho da tabela acompanha-te entre dispositivos',
     'O tamanho de tabela que escolheste fica agora guardado na tua conta.'],

  'Artist stats deduplicated and reordered':
    ['Estatísticas do artista sem duplicados e reordenadas',
     'Foram retirados números de pico duplicados, acrescentado um bloco Álbum mais ouvido e reorganizada a ordem.'],

  'The artist modal caught up with the album one':
    ['A janela do artista alcança a do álbum',
     'Mais dez números — primeira e última reprodução, dias de calendário, média de reproduções por música, picos semanal, mensal e anual, música principal, sequência de audição e músicas na tabela semanal — e um gráfico de reproduções por mês cujas barras abrem para mostrar as cinco músicas principais desse mês.'],

  'Upload hint translated':
    ['Dica de carregamento traduzida',
     'A nota com os formatos de ficheiro aceites na janela de carregamento.'],

  'Artist streak tag recoloured':
    ['Etiqueta de sequência de artista com nova cor',
     'A etiqueta de artista era parecida demais com a de álbum para as distinguir.'],

  'Colour-coded streak tags':
    ['Etiquetas de sequência por cores',
     'As etiquetas de artista, música e álbum na janela de sequências têm cores, para que o tipo fique claro num relance.'],

  'Display toggles remembered':
    ['Os interruptores de visualização ficam memorizados',
     'Os interruptores da barra de visualização da tabela mantêm-se agora entre sessões e dispositivos.'],

  'Editing and rules windows translated':
    ['Janelas de edição e de regras traduzidas',
     'Vinte e um textos nas janelas de edição, scrobble manual, regras de correção automática e conflitos, além da barra de ferramentas dos Dados Brutos.'],

  'Export bar at both ends':
    ['Barra de exportação nas duas pontas',
     'Na vista de todas as entradas, os controlos de exportação aparecem por cima e por baixo de cada secção, para não teres de voltar a subir uma lista longa.'],

  'Export a whole chart as text or CSV':
    ['Exporta uma tabela inteira como texto ou CSV',
     'As tabelas Anual e De Sempre podem exportar todas as entradas de músicas, artistas e álbuns, e não só o que cabe no ecrã.'],

  'Copy button on the setup guide did nothing':
    ['O botão de copiar do guia de configuração não fazia nada',
     'A cópia alternativa corria quando o navegador já não a considerava uma resposta ao teu clique, por isso era recusada e a falha era engolida. Agora o botão responde sempre.'],

  'Streaks counted today, and an at-risk warning':
    ['As sequências contam hoje, e um aviso de risco',
     'As sequências ativas eram medidas até ontem, por isso as reproduções feitas hoje não contavam. Agora terminam hoje, e uma nova secção avisa sobre as sequências de ontem que ainda não continuaste — as que ainda podes salvar.'],

  'The landing screen translated':
    ['O ecrã inicial traduzido',
     'O primeiro ecrã que um visitante novo vê estava só em inglês. Foram traduzidos vinte e nove textos para os quatro idiomas, incluindo parágrafos formatados que precisaram de um tratamento novo para poderem ser traduzidos.'],

  'Animations still appearing on long charts':
    ['Animações ainda a aparecer nas tabelas longas',
     'Um observador de animação que ficava de uma vista semanal podia disparar depois da mudança e sobrepor o conteúdo paginado de Anual e De Sempre.'],

  'Streaks modal translated':
    ['Janela de sequências traduzida',
     'A janela de sequências diárias, em todos os idiomas disponíveis.'],

  'Sync error change reverted':
    ['Alteração aos erros de sincronização revertida',
     'A alteração anterior foi desfeita.'],

  'Sync errors stopped being hidden':
    ['Os erros de sincronização deixaram de ser escondidos',
     'Quando uma Google Sheet vinha sem reproduções utilizáveis, o leitor indicava um motivo preciso — colunas em falta, folha vazia, nada válido — e o código que o chamava sobrepunha-lhe um alegre "Sincronizado, 0 reproduções carregadas". Agora aparece o motivo real.'],

  'Streak details':
    ['Pormenores das sequências',
     'O número da sequência passou a ser clicável, a abrir uma discriminação de todas as sequências de artistas, álbuns e músicas que tens em curso, mais uma secção de sequências que terminaram há pouco.'],

  'No animation on Yearly and All-Time':
    ['Sem animação em Anual e De Sempre',
     'Uma janela deslizante sobre um ano ou sobre todo um histórico não faz sentido, por isso esses períodos deixaram de ser animados.'],

  'See-through nominee picker fixed':
    ['Seletor de nomeados transparente corrigido',
     'A janela do seletor aparecia transparente porque vários valores de cor de que dependia nunca tinham sido definidos. A pesquisa por género foi também ajustada para excluir os itens cujo género ainda não é conhecido, em vez de os deixar passar sem verificação.'],

  'Genre filtering while searching, and album merging':
    ['Filtro por género na pesquisa, e álbuns unificados',
     'Pesquisar dentro de uma categoria de género filtra agora por género em vez de devolver tudo, cada linha mostra as suas etiquetas de género, e os álbuns creditados a colaborações juntam-se numa só entrada em vez de se dividirem.'],

  'Genre detection stopped guessing wrong':
    ['A deteção de género deixou de adivinhar mal',
     'Os géneros eram comparados de forma tão solta que artistas pop iam parar a categorias de rock. Agora a comparação é exata, as colaborações procuram o seu artista principal, e as pesquisas falhadas ficam memorizadas para que um serviço bloqueado não seja consultado milhares de vezes.'],

  'Nominees with apostrophes were silently dropped':
    ['Os nomeados com apóstrofo desapareciam em silêncio',
     'Os títulos com apóstrofo cortavam os dados onde eram guardados, por isso guardá-los falhava sem qualquer erro. Qualquer coisa como "Short n\' Sweet" simplesmente desaparecia das tuas escolhas.'],

  'Unknown-year albums judged more carefully':
    ['Álbuns de ano desconhecido avaliados com mais cuidado',
     'Se não foi encontrado ano de lançamento e o álbum nunca tinha sido ouvido antes do ano dos prémios, é quase certamente um lançamento novo, por isso é excluído. Os álbuns com alguma reprodução anterior ficam, porque essa reprodução já prova que o álbum existia.'],

  'Collaboration names handled properly':
    ['Nomes de colaborações bem tratados',
     'A pesquisa foi refeita de forma mais restrita: só o termo de pesquisa usa o artista principal, e a lógica de comparação por trás não foi tocada.'],

  'Collaboration fix reverted':
    ['Correção das colaborações revertida',
     'A alteração anterior foi desfeita depois de causar problemas.'],

  'Collaboration names broke release lookups':
    ['Os nomes de colaborações estragavam a pesquisa de lançamentos',
     'Um campo de artista com vários nomes separados por vírgulas era enviado inteiro como pesquisa, o que não encontrava nada e devolvia um ano desconhecido. Agora só se usa o artista principal.'],

  'Release years shown when picking nominees':
    ['Anos de lançamento visíveis ao escolher nomeados',
     'Cada candidato a Descoberta Tardia mostra o ano em que foi lançado, e o que não tem ano confirmado di-lo claramente, para que o confirmes tu em vez de confiares num palpite silencioso.'],

  'Awards default to last year':
    ['Os prémios abrem por predefinição no ano passado',
     'Abrir o separador mostrava o ano atual, onde os álbuns do ano anterior aparecem corretamente como descobertas tardias — tecnicamente certo, mas confuso, já que os prémios de fim de ano são quase sempre do ano que acabou de terminar. Agora abre no ano passado, e podes continuar a avançar.'],

  'Wrong-year lookups stopped slipping through':
    ['As pesquisas com o ano errado deixaram de passar',
     'Quando não se encontrava nenhum álbum correspondente, a pesquisa ficava com o primeiro resultado, fosse qual fosse, que podia ser um disco antigo sem relação e devolver uma data antiga o suficiente para um lançamento do ano atual passar pelo filtro. Essas alternativas foram retiradas.'],

  'Release year checked for every candidate':
    ['Ano de lançamento verificado para cada candidato',
     'A pesquisa corre agora para todos os candidatos a Descoberta Tardia, em vez de ser saltada para alguns.'],

  'Late Discovery includes slow burns':
    ['A Descoberta Tardia inclui os que demoram a pegar',
     'Os álbuns que tinhas ouvido até vinte vezes antes do ano dos prémios passam também a contar, e não só os que nunca tinhas ouvido. Um punhado de reproduções no início seguido de um ano de obsessão é precisamente a forma para que esta categoria existe.'],

  'Late Discovery excludes that year\'s releases':
    ['A Descoberta Tardia exclui os lançamentos desse ano',
     'Descobrir um álbum lançado no mesmo ano não é uma descoberta tardia. As datas de lançamento são procuradas em três fontes, uma de cada vez, e os álbuns sem data encontrada ficam, em vez de serem excluídos por engano.'],

  'One-Hit Wonder made meaningful':
    ['Sucesso de um só êxito, agora com sentido',
     'Agora corresponde a artistas com exatamente uma música acima das dez reproduções, e mostra-te qual é essa música.'],

  'The Streak award measured the wrong thing':
    ['O prémio de Sequência media a coisa errada',
     'Contava em quantos dias diferentes um item tinha sido ouvido em vez da sequência ininterrupta mais longa, e um erro de formato de data estragava a comparação de qualquer forma. Agora encontra sequências reais de dias consecutivos e chama-lhes isso mesmo.'],

  'Icons on award categories':
    ['Ícones nas categorias de prémios',
     'Cada categoria ganhou um emoji descritivo.'],

  'Animations wait until you scroll to them':
    ['As animações esperam que chegues até elas',
     'Cada secção da tabela mostra a vista do período anterior como marcador e só começa a animar quando aparece no ecrã. Se não te deslocares até nada, nada corre, o que poupa trabalho e bateria.'],

  'The chart animation became a true play-by-play':
    ['A animação da tabela passou a ser reprodução a reprodução',
     'Em vez de saltar entre sete retratos fixos, a animação mantém agora uma contagem corrente e tira e acrescenta reproduções individuais fotograma a fotograma. As entradas novas sobem à vista desde abaixo do corte até ao seu lugar final, incluindo as posições por onde passam brevemente pelo caminho.'],

  'Event view choices follow your account':
    ['As escolhas de vista dos Eventos acompanham a tua conta',
     'Os tipos de evento pelos quais filtras e o modo de vista de cada secção sincronizam agora com a tua conta Google, em vez de serem esquecidos noutro dispositivo.'],

  'The Awards tab':
    ['O separador Prémios',
     'Uma cerimónia construída a partir da tua própria audição: escolhe um ano, define o período de elegibilidade para o intervalo de datas que quiseres e ativa qualquer uma de 33 categorias. Os nomeados são gerados a partir do teu histórico e as tuas escolhas ficam guardadas na tua conta. Um segundo painel tem os prémios reais.'],

  'More mobile layout corrections':
    ['Mais correções de layout no telemóvel',
     'Os seletores de vista dos eventos mudam de linha em qualquer tamanho de ecrã, e a janela de álbum esconde as colunas de data em telemóveis pequenos, onde não cabem.'],

  'Events view buttons unusable on iPhone':
    ['Botões de vista dos Eventos inutilizáveis no iPhone',
     'O Safari do iOS desenhava-os como simples botões brancos do sistema, e a fila onde estavam transbordava o ecrã, por isso nem se podiam carregar. No telemóvel passam agora para uma fila própria.'],

  'New Music Friday':
    ['New Music Friday',
     'Uma secção que reúne os lançamentos de cada sexta-feira — álbuns editoriais e singles e EPs acabados de lançar nas últimas duas semanas — em qualquer um dos cinco modos de vista. São guardadas até dezasseis semanas de sextas-feiras, por isso podes recuar pelas semanas anteriores em vez de veres só a atual.'],

  'Reel became the default, and its images loaded':
    ['O carrossel passou a ser a predefinição, e as imagens carregaram',
     'As fotografias dos artistas nunca carregavam no modo carrossel porque a alternativa de imagem procurava uma forma de cartão que os cartões do carrossel não têm, por isso a transferência nunca era lançada.'],

  'Four ways to view every Events section':
    ['Quatro formas de ver cada secção de Eventos',
     'As sete secções podem ser mostradas como mosaico, tabela ordenável, carrossel infinito que pára ao passar o rato ou lista simples, e cada secção lembra-se do que escolheste.'],

  'The Time Machine':
    ['A Máquina do Tempo',
     'Um carrossel das músicas, artistas e álbuns que ouviste neste mesmo dia em anos anteriores, com interruptores para escolher quais dos três mostrar.'],

  'Album art, Top N and sharing on chart images':
    ['Capas, Top N e partilha nas imagens das tabelas',
     'As imagens partilhadas das tabelas podem agora ter a capa em cada linha, vinda de várias fontes com alternativas e guardada em cache entre utilizações; um deslizador define quantas posições aparecem; e a imagem pode ser copiada para a área de transferência ou entregue ao menu de partilha do dispositivo. As tuas escolhas ficam memorizadas. A vista de dia do calendário ganhou um botão para exportar uma playlist.'],

  'Plays Peak badge translated':
    ['Selo de pico de reproduções traduzido',
     'O selo tinha ficado em inglês em espanhol e português.'],

  'Gender agreement in Spanish and Portuguese':
    ['Concordância de género em espanhol e português',
     'A palavra "descoberto" tem de concordar com o que descreve, e as músicas levam uma forma diferente da de artistas e álbuns. Os dois idiomas foram corrigidos.'],

  'New-music section titles translated':
    ['Títulos das secções de música nova traduzidos',
     'Os títulos das tabelas de músicas, artistas e álbuns novos.'],

  'Spanish Rising Artist reworded':
    ['Artista em ascensão reformulado em espanhol',
     'A etiqueta em espanhol de Artista em ascensão foi substituída por uma expressão mais natural.'],

  'Every stat strip label translated':
    ['Todas as etiquetas da faixa de estatísticas traduzidas',
     'Melhor dia, as contagens de músicas, artistas e álbuns novos, os três blocos do momento, Artista em ascensão, os dois selos de pico e os textos pequenos de reproduções, por dia e percentagem de novos. As abreviaturas de mês na etiqueta de Melhor dia usam agora as formas traduzidas.'],

  'Spanish display toggle corrected':
    ['Interruptor de visualização em espanhol corrigido',
     'Um resto da alteração de texto anterior que tinha escapado.'],

  'Events tab and Configure button translated':
    ['Separador Eventos e botão Configurar traduzidos',
     'Os dois ainda estavam em inglês em todos os idiomas.'],

  'Spanish navigation hint reworded':
    ['Dica de navegação em espanhol reformulada',
     'O texto em espanhol da dica das teclas de seta foi corrigido.'],

  'Navigation hint translated':
    ['Dica de navegação traduzida',
     'A dica de teclado e deslize foi traduzida para os quatro idiomas.'],

  'Spanish streak label and display buttons':
    ['Etiqueta de sequência e botões de visualização em espanhol',
     'A etiqueta de sequência tinha as palavras pela ordem errada em espanhol, e os botões de visualização nunca tinham sido traduzidos.'],

  'Spanish wording corrected throughout':
    ['Texto em espanhol corrigido em todo o lado',
     'Duas palavras mal escolhidas em toda a tradução para espanhol foram substituídas em todos os sítios onde apareciam.'],

  'Clearer album peak labels':
    ['Etiquetas de pico do álbum mais claras',
     'As estatísticas de pico da janela de álbum mudaram de nome para dizer a que tabela se refere cada uma.'],

  'Track details button restyled':
    ['Botão de pormenores das faixas redesenhado',
     'O controlo de pormenores das faixas na janela de álbum passou a ser um botão circular brilhante com um ícone que roda.'],

  'The album modal rebuilt':
    ['A janela de álbum refeita',
     'Os álbuns receberam o tratamento que os artistas tinham: posição de sempre, dias no calendário, média de reproduções por faixa, a próxima certificação e primeira e última reprodução; picos semanal, mensal e anual com um banner se liderou os três; uma linha de tendência mensal e uma discriminação de quantas faixas entraram na tabela em cada período; conquistas e certificações; e percursos, mapa de calor, histórico de streaming e painéis por faixa.'],

  'Event sections visible again, and release lookups fixed':
    ['Secções de Eventos visíveis outra vez, e pesquisa de lançamentos corrigida',
     'Aniversários de lançamento, Próximos e Recentes Lançamentos vinham recolhidos por predefinição; agora abrem, lembram-se do estado de cada secção e repõem-no quando voltas. Foi também corrigida uma consulta de lançamentos mal formada que era recusada liminarmente.'],

  'New Charts Records previews showed the wrong chart':
    ['As pré-visualizações dos Recordes de Novas Tabelas mostravam a tabela errada',
     'Passar o rato por uma data dessa secção mostrava a tabela semanal normal em vez da tabela de música nova desse período.'],

  'New Charts Records read the right charts':
    ['Os Recordes de Novas Tabelas leem as tabelas certas',
     'Os dez recordes eram calculados a partir das primeiras presenças nas tabelas principais, que só veem o top N, em vez das tabelas de música nova que dizem descrever. Agora usam a primeira reprodução de cada item, a condizer com o que essas tabelas realmente mostram.'],

  'Concerts work without your own API key':
    ['Os concertos funcionam sem uma chave de API própria',
     'A secção de concertos exigia que cada utilizador fornecesse uma chave própria.'],

  'Artist modal showed the wrong songs':
    ['A janela do artista mostrava as músicas erradas',
     'Quando não era possível ler o tamanho da tabela de sempre, a lista de músicas na tabela vinha vazia, e uma alternativa mostrava em silêncio as músicas principais do próprio artista — que parecem iguais mas significam algo completamente diferente. A presença na tabela vem agora sempre dos dados reais de sempre, e a alternativa enganadora foi retirada.'],

  'A per-chart breakdown in the artist modal':
    ['Uma discriminação por tabela na janela do artista',
     'Em vez de um único número de músicas na tabela, uma grelha que mostra quantas músicas e álbuns entraram e a melhor posição alcançada em Semanal, Mensal, Anual e De Sempre, mais uma fila de picos e uma posição de sempre mais clara.'],

  'Clearer column name in the artist modal':
    ['Nome de coluna mais claro na janela do artista',
     'A coluna abreviada de reproduções consecutivas foi escrita por extenso.'],

  'All-Time stopped showing stale weekly data':
    ['De Sempre deixou de mostrar dados semanais antigos',
     'Mudar para De Sempre com uma animação da tabela ainda a correr deixava essa animação terminar 380 milissegundos depois e sobrepor ao novo separador a tabela da semana anterior. Agora as animações pendentes são canceladas na mudança, e a janela foi corrigida para usar números de sempre em todo o lado, em vez de semanais.'],

  'The artist modal rebuilt':
    ['A janela do artista refeita',
     'Pico do artista significa agora a melhor posição na tabela semanal e não uma posição de sempre. A conquista de número um de sempre foi substituída por números um semanais e mensais e músicas que se estrearam no topo. Músicas e álbuns dividem-se cada um em quatro secções recolhíveis por período, cada uma com o seu próprio mapa de calor e histórico.'],

  'Event sections hidden on long periods':
    ['Secções de Eventos escondidas em períodos longos',
     'Os eventos próximos e recentes não pertencem aos separadores Anual e De Sempre.'],

  'Upcoming concerts':
    ['Próximos concertos',
     'Uma secção de concertos de artistas que ouves, marcados no calendário. Os dados dos eventos ficam também guardados na tua conta para sobreviverem à mudança de dispositivo, a ver primeiro o armazenamento local e só a ir buscar quando não há nada para reaproveitar.'],

  'Records for the new-music charts':
    ['Recordes para as tabelas de música nova',
     'Dez recordes tirados das tabelas de Músicas, Artistas e Álbuns novos: maiores estreias, os teus períodos de mais descobertas, mais músicas numa mesma tabela nova, contagem de sempre de estreias por artista, sequências mais longas de estreias consecutivas, o mais depressa que uma música nova chegou a número um e o álbum que chegou com mais faixas de uma vez.'],

  'Chart animation smoothed out':
    ['Animação da tabela suavizada',
     'A tabela final surge a partir de uma opacidade parcial em vez do nada, as linhas ficam totalmente visíveis durante a janela deslizante em vez de escurecerem a meio da animação, repetir repete agora a sequência inteira e não só o desvanecimento, e os selos chegam depois de o movimento assentar.'],

  'Moment tiles limited to weekly':
    ['Os blocos do momento só na semanal',
     'Artista e Álbum do momento medem uma janela de três semanas, que não diz nada numa vista mensal ou anual, por isso ficam aí escondidos.'],

  'Artist and Album of the Moment':
    ['Artista e Álbum do momento',
     'Uma terceira faixa com Música, Artista e Álbum do momento mais Artista em ascensão, em que artista e álbum saem dos últimos 21 dias, cada um com a sua imagem e cor.'],

  'Icons and colours on the stat tiles':
    ['Ícones e cores nos blocos de estatísticas',
     'Cada bloco ganhou um ícone e uma cor de categoria, e o número do Melhor dia foi clarificado.'],

  'Release sections stopped always appearing collapsed':
    ['As secções de lançamentos deixaram de aparecer sempre recolhidas',
     'As secções vinham marcadas como recolhidas na página e o código que as mostrava nunca tirava essa marca, por isso apareciam recolhidas sempre, independentemente do que tivesses escolhido. Agora a tua preferência é guardada e reposta.'],

  'Charts evolve day by day instead of jumping':
    ['As tabelas evoluem dia a dia em vez de saltarem',
     'A animação de entrada foi substituída por uma janela deslizante: o período anterior avança em sete passos durante cerca de seis segundos, a tirar as reproduções mais antigas e a juntar as do período atual, por isso vês as posições a mudar mesmo em vez de dois estados. As linhas deslizam para as novas posições e podem ser canceladas a qualquer momento.'],

  'Only the date row stays stuck':
    ['Só a linha de data fica fixa',
     'Os separadores e os controlos de tamanho da tabela deslocam-se agora com a página, deixando só a navegação de datas presa.'],

  'Charts animate in from last period':
    ['As tabelas entram animadas a partir do período anterior',
     'Uma tabela desenha primeiro o período anterior e depois substitui cada linha pela atual, a deslizar as entradas de onde estavam — as que sobem vêm de baixo, as que descem vêm de cima, as novas vêm de fora da tabela. Cada secção ganhou um botão de repetir.'],

  'Graphs and Records showing Events content':
    ['Gráficos e Recordes mostravam o conteúdo de Eventos',
     'Dois separadores desenhavam o conteúdo da vista Eventos em vez do seu.'],

  'Rising Artist, and a redesigned Song of the Moment':
    ['Artista em ascensão, e uma Música do momento redesenhada',
     'Um cartão de Artista em ascensão nas tabelas semanais encontra o artista descoberto mais recentemente nos 45 dias que acabam com a semana, com uma fotografia real. A Música do momento foi redesenhada à volta da capa. As linhas de tendência voltaram a ser retiradas, e a segunda faixa foi escondida nos separadores onde não significa nada.'],

  'Stat cards became interactive':
    ['Os cartões de estatísticas passaram a ser interativos',
     'Clicar num cartão de estatística desloca até à secção da tabela que resume, expandindo-a se estiver recolhida. Total de reproduções mostra uma média por dia, Músicas únicas mostra que proporção era nova, cada um dos quatro cartões principais tem uma linha de tendência de oito períodos, foi acrescentado um bloco Melhor dia, e os números contam para cima ao carregar.'],

  'Movement and peaks on the new-music stats':
    ['Movimento e picos nas estatísticas de música nova',
     'Os números de músicas, artistas e álbuns novos mostram agora se subiram ou desceram face ao período anterior, e têm selos de pico de sempre e de pico na altura, como as estatísticas principais.'],

  'A second row of stats':
    ['Uma segunda fila de estatísticas',
     'Por baixo dos quatro números principais, uma segunda faixa nas tabelas semanais, mensais e anuais: Música do momento, a mais ouvida nos quinze dias que acabam com o período, e contagens de músicas, artistas e álbuns que aparecem pela primeira vez.'],

  'Filter events by kind':
    ['Filtra os eventos por tipo',
     'Aniversários, álbuns, singles, EPs e tudo o resto podem ser mostrados ou escondidos separadamente.'],

  'An events calendar, and events that already happened':
    ['Um calendário de eventos, e eventos que já aconteceram',
     'Eventos ganhou uma vista de calendário e secções de aniversários, aniversários de lançamento e lançamentos que acabaram de passar, e não só os que ainda estão para vir. Foi cortado o conteúdo de outras secções que escapava para o separador.'],

  'Chart run sections collapse':
    ['As secções do percurso recolhem-se',
     'As subsecções do percurso nas tabelas anuais, mensais e semanais podem ser recolhidas, embora comecem abertas.'],

  'Search and sort your full listening history':
    ['Pesquisa e ordena todo o teu histórico de audição',
     'O painel Histórico completo de streaming ganhou pesquisa ao vivo por título, artista e álbum, e colunas ordenáveis. O painel do percurso foi dividido em secções recolhíveis que só carregam quando abertas, e De Sempre ganhou interruptores de visualização e botões de percurso.'],

  'Navigation hint hidden where it does not apply':
    ['Dica de navegação escondida onde não se aplica',
     'Dados Brutos, Gráficos, Recordes e Eventos não mudam de período, por isso a dica já não aparece neles.'],

  'Swipe hint hidden on desktop':
    ['Dica de deslize escondida no computador',
     'Uma folha de estilos em cache ainda mostrava a dica de deslize no computador.'],

  'Swipe arrows dim when there is nowhere to go':
    ['As setas de deslize esbatem-se quando não há para onde ir',
     'A seta de uma direção para onde não podes ir, como avançar a partir da semana atual, fica esbatida.'],

  'The swipe hint animates until used':
    ['A dica de deslize fica animada até ser usada',
     'Brilha e mexe-se até deslizares pela primeira vez, e depois pára.'],

  'A swipe hint on small screens':
    ['Uma dica de deslize em ecrãs pequenos',
     'A dica de teclado não faz sentido num telemóvel, por isso aí é substituída por um indicador de deslize.'],

  'More milestones, and song milestones that actually tracked':
    ['Mais marcos, e marcos de música que são mesmo registados',
     'Foram acrescentados muitos mais limiares de reproduções entre 10 e 50 000, com passos mais finos nas centenas e nos primeiros milhares. A secção de músicas usava uma lista fixa com valores que nunca chegavam a ser registados.'],

  'Clearer label on the average stat':
    ['Etiqueta mais clara na estatística da média',
     'O número da média por dia chama-se agora Reproduções / dia.'],

  'Hero stats readable on the coloured mastheads':
    ['Estatísticas principais legíveis nos cabeçalhos coloridos',
     'Os temas claros vermelho, amarelo e rosa têm um cabeçalho escuro mas cores de texto pensadas para fundo claro, por isso as estatísticas por cima das tabelas eram quase invisíveis. Esses valores são agora sobrepostos dentro da área das estatísticas para condizer com o resto do texto do cabeçalho.'],

  'A permanent arrow-key hint':
    ['Uma dica permanente das teclas de seta',
     'Um pequeno lembrete fixo dos atalhos de seta para a esquerda e para a direita no computador, escondido no telemóvel, onde não se aplicam.'],

  'A one-time hint about keyboard and swipe navigation':
    ['Uma dica única sobre a navegação com teclado e deslize',
     'Uma pastilha por baixo da navegação explica que as setas e os deslizes mudam de período; aparece uma vez e depois fica memorizada. Dias a ouvir passou a ser clicável e leva ao mapa de calor, Artista principal muda agora de separador antes de deslocar, e a contagem da sequência termina com uma explosão.'],

  'Delete a conflicting rule from the warning':
    ['Apaga uma regra em conflito a partir do aviso',
     'Cada regra listada no aviso de conflito ganhou um botão de apagar que a remove de todos os sítios onde está guardada, sem fechar a janela em que estás a trabalhar.'],

  'Conflict warning widened':
    ['Aviso de conflito alargado',
     'O aviso só disparava quando a regra existente tinha outro álbum. Agora dispara para qualquer regra do mesmo artista e faixa, incluindo as que só diferem em maiúsculas e minúsculas.'],

  'A warning before you create a conflicting rule':
    ['Um aviso antes de criares uma regra em conflito',
     'Guardar uma regra para um artista e faixa que já têm uma avisa agora primeiro, lista as regras em choque com uma caixa de verificação cada, e deixa-te aplicá-las ou sobrepô-las uma a uma sem saíres da janela.'],

  'Search your autocorrect rules':
    ['Pesquisa nas tuas regras de correção automática',
     'Uma caixa de pesquisa na janela de regras, que começa a fazer diferença quando a lista fica longa.'],

  'Dismiss the autocorrect notice':
    ['Dispensa o aviso de correção automática',
     'A mensagem que diz quantas entradas foram corrigidas pode agora ser dispensada, voltando a mostrar por baixo o estado de sincronização habitual.'],

  'Keep comma-separated artist names together':
    ['Mantém juntos os nomes de artista com vírgulas',
     'Um interruptor para decidir se um nome com uma vírgula é um artista ou vários, porque as duas coisas são verdade conforme o artista.'],

  'Corrections reached newly added entries':
    ['As correções chegam às entradas acabadas de adicionar',
     'Depois de uma edição em lote, a cópia em cache da aplicação já tinha os valores corrigidos, e um filtro usava isso para decidir que regras ainda faltava enviar — por isso havia regras saltadas e as entradas acabadas de chegar ficavam por corrigir na folha. Agora são sempre enviadas todas as regras, e a folha escreve três colunas específicas em vez de se reescrever toda.'],

  'Privacy Policy split into its own page':
    ['A Política de Privacidade numa página própria',
     'As secções de privacidade saíram dos Termos para uma política independente, deixando os Termos só com os termos. O contraste do texto nas duas páginas foi corrigido.'],

  'Top 25 and Top 30':
    ['Top 25 e Top 30',
     'Mais dois tamanhos de tabela para as tabelas semanais e mensais.'],

  'Days Listened explained accurately':
    ['Dias a ouvir, explicado com rigor',
     'A dica dizia que o número contava os dias em que abriste o Last.fm; conta os dias em que ouviste música.'],

  'Support panel stopped collapsing on itself':
    ['O painel de apoio deixou de se fechar sozinho',
     'A rotina que mantém o botão de abrir escondido continuava a correr depois de o painel abrir, e fechava-o um segundo depois. Agora pára enquanto o painel está aberto.'],

  'Support panel opens properly':
    ['O painel de apoio abre como deve ser',
     'A deteção de quando o painel tinha acabado de abrir não era fiável e foi substituída.'],

  'Support launcher hiding made reliable':
    ['Esconder o botão de apoio passou a ser fiável',
     'O widget podia reaparecer antes de o código que o escondia ter corrido; agora é vigiado e escondido assim que é inserido, com uma alternativa de estilo.'],

  'Support widget only opens when asked':
    ['O widget de apoio só abre quando pedido',
     'O widget de conversa fica escondido ao carregar e só aparece quando carregas em Contactar o apoio, em vez de ser suprimido depois.'],

  'Sync moved first, Add Play scoped, Now button added':
    ['Sincronizar vai primeiro, Adicionar reprodução fica no sítio certo, e chega o botão Agora',
     'Sincronizar passou para o início do cabeçalho, Adicionar reprodução ficou limitado ao separador Dados Brutos, que é onde pertence, e a janela de edição ganhou um botão Agora para marcar a hora atual.'],

  'A plain-English summary at the top of the Terms':
    ['Um resumo em linguagem simples no topo dos Termos',
     'Ninguém lê termos, por isso foi posto um pequeno quadro de resumo no topo, juntamente com uma secção de lei aplicável.'],

  'Terms corrections':
    ['Correções nos Termos',
     'O responsável identificado corretamente, endereços de contacto corrigidos e um aviso sobre funcionalidades premium acrescentado.'],

  'A welcome email on first sign-in':
    ['Um e-mail de boas-vindas no primeiro início de sessão',
     'Iniciar sessão pela primeira vez envia agora um e-mail de boas-vindas.'],

  'Terms of Service and Privacy Policy':
    ['Termos de Serviço e Política de Privacidade',
     'Uma página de política publicada que cobre o que é recolhido, quem o trata e o teu direito a pedir que seja apagado, com ligação no ecrã inicial e no rodapé.'],

  'Sheet corrections made dramatically cheaper':
    ['As correções na folha ficaram muitíssimo mais baratas',
     'Faltava o tratamento das correções em lote, por isso esses pedidos caíam no ramo de acrescentar uma linha. Corrigi-lo trouxe quatro otimizações: as regras são procuradas diretamente em vez de cada linha ser comparada com cada regra, só as linhas alteradas são reescritas em vez da folha inteira, e as linhas alteradas contíguas são agrupadas em escritas únicas.'],

  'Batch corrections in the sheet script':
    ['Correções em lote no script da folha',
     'O script do Google Sheets ganhou a ação que aplica todas as regras de correção de uma só vez.'],

  'Support launcher hidden on every page':
    ['Botão de apoio escondido em todas as páginas',
     'A mesma correção, alargada às páginas onde tinha ficado esquecida.'],

  'Support widget stopped floating over the page':
    ['O widget de apoio deixou de flutuar por cima da página',
     'O botão da conversa de apoio estava sempre no ecrã. Agora só aparece quando escolhes Contactar o apoio.'],

  'Streaks climb through their tiers on load':
    ['As sequências sobem pelos níveis ao carregar',
     'A contagem passa agora por cada nível de intensidade a caminho do teu número real, por isso vês a sequência a ganhar a sua cor.'],

  'Streaks in six intensities':
    ['Sequências em seis intensidades',
     'A apresentação das sequências tem agora seis níveis de cor e animação, por isso uma sequência de três dias e uma de cem já não parecem iguais.'],

  'The hero stats came alive':
    ['As estatísticas principais ganharam vida',
     'Um quinto número para a média de reproduções por dia, números que contam para cima quando a página carrega, o teu recorde pessoal de sequência por baixo da atual, um brilho de fogo em sequências de sete dias ou mais, um ícone por estatística, um Artista principal clicável e uma grelha de dois por dois no telemóvel.'],

  'Play buttons on more rows, and three player sizes':
    ['Botões de reprodução em mais linhas, e três tamanhos de leitor',
     'Foram acrescentados botões de reprodução nas linhas de músicas e dentro da nova tabela de artistas, o minileitor alterna entre três tamanhos em vez de dois, e passar o rato pelo número de músicas de um artista lista as faixas dele com um botão de reprodução em cada uma.'],

  'The player became a floating, queueable mini player':
    ['O leitor passou a minileitor flutuante com fila',
     'O leitor flutua agora onde o puseres e encaixa num canto, muda de tamanho, pára com a barra de espaços e tem uma fila que podes aumentar e ver. O servidor verifica também vários resultados de pesquisa e escolhe um que toque mesmo, em vez de ficar com o primeiro e falhar.'],

  'A real logo':
    ['Um logótipo a sério',
     'O provisório foi substituído pela marca de arcos concêntricos, e um ícone para adicionar o site ao ecrã principal do iOS.'],

  'Eight things that make the app quicker to use':
    ['Oito coisas que tornam a aplicação mais rápida de usar',
     'A navegação fica presa no topo ao deslocar; aparecem marcadores com brilho enquanto as tabelas carregam; clicar na etiqueta do período abre logo o seletor de data; as setas mudam de período e W, M, Y e A saltam entre separadores; passar o rato por um ponto de tema pré-visualiza-o; e os gestos de deslize mudam de período em ecrãs táteis. Foram acrescentados ao mesmo tempo um favicon e pré-visualizações de ligações.'],

  'The heatmap grew a year in review':
    ['O mapa de calor ganhou um balanço do ano',
     'Cinco esquemas de cor com um seletor de amostras, uma barra com as tuas sequências de audição atual e máxima, deteção de secas que destaca os vazios e marca o teu regresso, um cartão de resumo para cada ano com o total, o melhor dia, o artista principal e os artistas novos, e uma secção Padrões de audição que mostra o teu ritmo por dia da semana e hora do dia.'],

  'Heatmap rendering and filters completed':
    ['Desenho e filtros do mapa de calor concluídos',
     'Foram terminados o desenho, a filtragem e as dicas do mapa de calor.'],

  'Single edits find their row immediately':
    ['As edições avulsas encontram a sua linha de imediato',
     'Editar uma reprodução obrigava o script da folha a percorrer todas as linhas para a encontrar. Agora a aplicação lembra-se de que linha veio cada reprodução e envia isso com a edição, por isso o script lê uma linha diretamente, só percorrendo tudo se a indicação estiver desatualizada.'],

  'Autocorrect sync rebuilt around rules, not timestamps':
    ['Sincronização da correção automática refeita com base em regras e não em horas',
     'A sincronização das correções com a folha ainda comparava por hora e continuava a falhar sempre que os fusos horários do navegador e da folha eram diferentes. Agora todas as regras ativas são enviadas num único pedido que lê a folha uma vez e escreve uma vez, sejam quantas forem as regras.'],

  'The listening heatmap':
    ['O mapa de calor de audição',
     'Uma grelha de calendário em Gráficos onde cada dia é um quadrado sombreado conforme o quanto ouviste, para que anos de histórico se leiam num relance. Passar o rato por um dia mostra a data, a contagem e qualquer marco, e pode ser filtrado por um só artista, música ou álbum.'],

  'Ghost rows cleaned before syncing':
    ['Linhas fantasma limpas antes de sincronizar',
     'Os scrobbles incompletos do Last.fm deixam linhas sem música e com data de 1970, e essas linhas estragam a hora a partir da qual começa a sincronização seguinte, por isso uma única linha má podia continuar a estragar sincronizações futuras. Agora são retiradas antes de cada sincronização do Last.fm.'],

  'Tie-breaking on new entries':
    ['Desempate nas entradas novas',
     'O último sítio onde os empates eram mal resolvidos: as tabelas de músicas, artistas e álbuns novos, que comparavam contagens em bruto. Agora registam quando algo foi alcançado pela primeira vez e ordenam da mesma forma que tudo o resto.'],

  'Tie-breaking in chart runs and modals':
    ['Desempate nos percursos e nas janelas',
     'Os percursos reconstroem cada período passado do zero, e faziam-no sem levar para a frente as posições de cada período, por isso os empates históricos eram resolvidos ao acaso. Isto corrigiu o histórico dos percursos, as janelas de artista e álbum e os resumos flutuantes das tabelas.'],

  'Tie-breaking reached the charts themselves':
    ['O desempate chega às próprias tabelas',
     'A correção anterior só tinha corrigido a secção Recordes. As tabelas que realmente vês são construídas por outro caminho, que continuava a ignorar por completo a posição da semana anterior, por isso músicas, artistas e álbuns precisaram que fosse aplicada outra vez.'],

  'Ties now break by last week\'s position':
    ['Os empates decidem-se agora pela posição da semana passada',
     'Quando duas músicas tinham o mesmo número de reproduções, ganhava a que tinha sido tocada primeiro, o que é arbitrário. Agora a música que estava mais acima na tabela anterior fica com o melhor lugar, como uma tabela a sério trata quem já lá está.'],

  'Bulk edits stopped failing across time zones':
    ['As edições em lote deixaram de falhar entre fusos horários',
     'As linhas da folha eram comparadas pelo seu momento no tempo, o que falha quando o navegador e a folha estão em fusos diferentes: a mesma data escrita passa a ser dois instantes diferentes e nada corresponde. Agora a comparação é feita pelo texto do artista, título e álbum, que não depende de onde estás.'],

  'An out-of-date sheet script now says so':
    ['Um script de folha desatualizado agora avisa',
     'Se a tua Google Sheet estava a correr uma cópia antiga do script, não reconhecia o pedido de edição em lote, caía no ramo de acrescentar uma linha, dizia que tinha corrido bem e juntava uma linha vazia com data de 1970. Agora isso é detetado e aparece como um erro claro a pedir-te que voltes a implementar, em vez de uma falha silenciosa disfarçada de sucesso.'],

  'Seconds were being thrown away from every timestamp':
    ['Os segundos eram deitados fora de todas as horas',
     'O leitor de datas percebia horas e minutos mas descartava em silêncio os segundos, arredondando cada reprodução ao início do seu minuto. A folha comparava as linhas pela hora exata, por isso nada correspondia e cada edição em lote dizia ter atualizado zero entradas.'],

  'Epoch dates blocked at every entry point':
    ['Datas de 1970 bloqueadas em todas as entradas',
     'Uma segunda passagem, mais alargada, pelo problema da data de 1970: qualquer reprodução com data anterior ao ano 2000 é agora saltada ao ler um CSV, ao corrigir automaticamente e ao escrever atualizações, por isso uma hora errada não pode chegar às tuas tabelas por nenhum lado.'],

  'Artwork works when running locally':
    ['As imagens funcionam ao correr localmente',
     'O novo intermediário só existe no site em produção, por isso as imagens deixavam de funcionar no desenvolvimento local. Agora deteta esse caso e usa o intermediário de produção.'],

  'Artwork served through our own domain':
    ['Imagens servidas pelo nosso próprio domínio',
     'Os pedidos ao Deezer passavam por um intermediário de terceiros que estava a ser bloqueado. Agora passam pelo próprio dankcharts.fm, com uma hora de cache na periferia para que pesquisas repetidas não voltem a transferir.'],

  'Epoch dates stopped appearing in sheets':
    ['As datas de 1970 deixaram de aparecer nas folhas',
     'As reproduções sem hora eram escritas com data de 1 de janeiro de 1970, o que põe uma reprodução meio século antes do início do teu histórico. Agora essas linhas são recusadas em todos os pontos onde podiam ser criadas.'],

  'Bulk edits show real progress instead of hanging':
    ['As edições em lote mostram o progresso real em vez de bloquearem',
     'Uma edição em lote reescrevia a folha inteira num só pedido, o que demorava entre 100 e 179 segundos e parecia um bloqueio. Agora sobe em blocos de 100 com o progresso ao vivo: quantas já foram, a percentagem e o tempo decorrido. Se for interrompida, o erro diz quantas entradas foram realmente escritas.'],

  'Deezer artwork stopped failing in bursts':
    ['As imagens do Deezer deixaram de falhar em rajadas',
     'Os pedidos de imagens passam por um intermediário, e quando este falhava falhava tudo ao mesmo tempo. Foi acrescentado um segundo intermediário como alternativa, e depois de três falhas seguidas o Deezer é saltado durante cinco minutos em vez de continuar a bater contra uma parede e encher a consola de erros.'],

  'Faster corrections in Sheets':
    ['Correções mais rápidas no Sheets',
     'Uma tentativa de acelerar a forma como o script da folha aplica as correções.'],

  'Sheet script stopped pushing constantly':
    ['O script da folha deixou de enviar constantemente',
     'O Apps Script por trás do Google Sheets enviava as regras de correção automática muito mais vezes do que precisava.'],

  'Edit a Last.fm play from Raw Data':
    ['Edita uma reprodução do Last.fm em Dados Brutos',
     'Um scrobble do Last.fm pode ser editado diretamente em Dados Brutos. A API do Last.fm não tem operação de edição, por isso isto acrescenta um scrobble corrigido em vez de alterar o original, e o antigo continua a ter de ser apagado à mão.'],

  'Autocorrect rules confirmed working':
    ['Regras de correção automática confirmadas a funcionar',
     'A última correção da série, verificada em vez de presumida.'],

  'Autocorrect rules sync across devices':
    ['As regras de correção automática sincronizam entre dispositivos',
     'Duas falhas juntavam-se para perder regras. Um navegador novo escrevia uma lista vazia no armazenamento local ao arrancar, que depois se sobrepunha às regras reais guardadas na nuvem; e as regras só eram enviadas numa primeira migração, por isso as alterações posteriores nunca saíam do dispositivo. Uma regra guardada no portátil chega agora ao telemóvel.'],

  'Autocorrect rules saving to your account':
    ['As regras de correção automática guardadas na tua conta',
     'As regras não estavam a ser guardadas na conta Google com sessão iniciada.'],

  'Backend pointed at the new host':
    ['O servidor aponta para o novo alojamento',
     'A ligação ao servidor foi redirecionada e o alojamento antigo foi desligado por completo.'],

  'Moved to Cloudflare Pages':
    ['Mudança para o Cloudflare Pages',
     'O alojamento saiu da Netlify.'],

  'Playlist export as CSV':
    ['Exportar playlists como CSV',
     'Uma playlist pode ser descarregada como ficheiro CSV, além de ser entregue a um serviço de transferência.'],

  'Albums in playlist export':
    ['Álbuns na exportação de playlists',
     'As listas de exportação de playlists ganharam um interruptor de álbum.'],

  'In-site play and scrobble':
    ['Reproduzir e registar dentro do site',
     'Trabalho de seguimento que completa a reprodução e o registo dentro do site.'],

  'Play music in the app, and scrobble it':
    ['Ouve música na aplicação, e regista-a',
     'Uma barra de leitor no fundo da página reproduz uma música através do YouTube sem saíres das tabelas, e regista-a ao fim de 30 segundos no Last.fm ou na tua folha. Cada linha de música ganhou um botão de reprodução, e os botões podem ser escondidos se preferires não os ver.'],

  'Existing settings survived signing in':
    ['As definições existentes sobrevivem ao início de sessão',
     'Os utilizadores que já tinham configurado a aplicação perdiam essas definições quando iniciavam sessão pela primeira vez.'],

  'Sign in with Google':
    ['Inicia sessão com o Google',
     'Iniciar sessão com uma conta Google funciona, e é isso que permite que as tuas definições te acompanhem entre dispositivos em vez de viverem num só navegador.'],

  'Groundwork for Google sign-in':
    ['Base para o início de sessão com o Google',
     'A configuração necessária para iniciar sessão com uma conta Google e guardar nela as definições.'],

  'Autocorrect rules stored and portable':
    ['Regras de correção automática guardadas e portáteis',
     'As regras ficam guardadas na tua Google Sheet e podem ser exportadas e importadas como ficheiro, por isso um conjunto de correções feito ao longo de meses não fica preso num só navegador.'],

  'Autocorrect and mass update bugs':
    ['Erros na correção automática e na atualização em massa',
     'Vários problemas nas novas regras e na edição em lote foram corrigidos ainda durante os testes.'],

  'Autocorrect rules and mass update':
    ['Regras de correção automática e atualização em massa',
     'Uma regra pode agora dizer que um artista ou título deve ser sempre lido como outro, e uma única correção pode ser aplicada de uma vez a todas as entradas que correspondam. Corrigir um nome escrito de três formas ao longo de dez anos deixou de ser um trabalho manual.'],

  'Raw Data editing made faster':
    ['A edição em Dados Brutos ficou mais rápida',
     'Editar demorava tanto que parecia avariado; desceu para cerca de 30 a 45 segundos.'],

  'Edit your raw listening data':
    ['Edita os teus dados brutos de audição',
     'As reproduções individuais passaram a ser editáveis, viessem do Last.fm, do Google Sheets ou de um ficheiro local. Um nome de artista errado ou um título mal escrito podia ser corrigido na origem em vez de distorcer em silêncio todas as tabelas construídas a partir dele. Foi corrigida ao mesmo tempo a janela de definições que não se expandia como devia.'],

  'Playlist export respects chart order':
    ['A exportação de playlists respeita a ordem da tabela',
     'As playlists exportadas ignoravam as regras de prioridade que decidem a ordem em que as posições devem sair.'],

  'Release images on mobile':
    ['Imagens de lançamentos no telemóvel',
     'Algumas imagens de Lançamentos Recentes e Próximos não carregavam nos telemóveis.'],

  'A temporary logo':
    ['Um logótipo provisório',
     'Um logótipo provisório enquanto o definitivo estava a ser pensado.'],

  'Themes and languages on the landing and setup pages':
    ['Temas e idiomas nas páginas inicial e de configuração',
     'O cartão do Sheets e a página de configuração ficaram mais fáceis de seguir, e os temas de cor e o seletor de idioma foram alargados às páginas inicial e de configuração, para que a aplicação não mude de aspeto assim que inicias sessão.'],

  'A Google Sheets template you can generate':
    ['Um modelo de Google Sheets que podes gerar',
     'Em vez de descrever o formato da folha e esperar que as pessoas a construam bem, a aplicação gera agora um modelo pronto e guia-te pela configuração. O contacto de apoio foi acrescentado ao mesmo tempo.'],

  'Release cards always have an image':
    ['Os cartões de lançamento têm sempre imagem',
     'Próximos e Recentes Lançamentos percorrem uma cadeia de fontes de imagem, por isso um cartão nunca fica com um buraco onde devia estar a capa.'],

  /* ========== ABRIL 2026 ========== */

  'Clearer Last.fm setup, image fallbacks and pagination':
    ['Configuração do Last.fm mais clara, alternativas de imagem e paginação',
     'Instruções a explicar o que é o Last.fm e como o usar, uma alternativa quando uma imagem não carrega, paginação nas tabelas anuais e de sempre, e scrobble manual.'],

  'A landing page, and no more borrowed spreadsheet':
    ['Uma página inicial, e acabou-se a folha emprestada',
     'Uma página inicial a sério, e o fim de mandar os utilizadores novos para a Google Sheet de outra pessoa: agora cada um escolhe o seu próprio método de importação.'],

  'Moved to dankcharts.fm':
    ['Mudança para dankcharts.fm',
     'A migração completa da página antiga para o site oficial, levando consigo o novo sistema de importação.'],

  'Google Sheets imports everything now':
    ['O Google Sheets importa agora tudo',
     'Correção confirmada para as importações do Sheets que chegavam incompletas. A folha passa inteira, o que importa porque um histórico cortado em silêncio produz tabelas que parecem plausíveis e estão erradas.'],

  'Sheets upload, another attempt':
    ['Carregamento do Sheets, mais uma tentativa',
     'Mais uma tentativa com o problema de carregamento do Google Sheets.'],

  'Import workflow reworked and Sheets limits fixed':
    ['Fluxo de importação refeito e limites do Sheets corrigidos',
     'A sequência de importação foi reestruturada e foi levantado o teto do que uma Google Sheet podia contribuir.'],

  'Row limits, duplicates, and Last.fm-only charts':
    ['Limites de linhas, duplicados e tabelas só com Last.fm',
     'A importação batia em limites de linhas, deixava passar reproduções duplicadas quando duas entradas tinham a mesma hora e exigia o Last.fm para construir qualquer tabela. As três coisas foram corrigidas.'],

  'Imports moved into your browser':
    ['As importações passaram para o teu navegador',
     'Sheets, CSV, folhas de cálculo e ficheiros ZIP do Spotify são agora lidos inteiramente dentro do teu próprio navegador e guardados no armazenamento local, sem servidor pelo meio. O Last.fm continua a passar pelo servidor, mas só porque a sua API o exige. Isto eliminou por completo a dependência de uma base de dados e significa que o teu histórico de audição não sai da tua máquina para se tornar uma tabela.'],

  'Further import fixes on the live site':
    ['Mais correções de importação no site em produção',
     'Mais uma passagem por erros de importação que só apareciam no site publicado.'],

  'Google Sheets import on the live site':
    ['Importação do Google Sheets no site em produção',
     'A importação do Sheets funcionava localmente mas não depois de publicada.'],

  'Import without an account':
    ['Importa sem conta',
     'A janela de importação estava fechada dentro da aplicação com sessão iniciada, por isso um visitante precisava de ter uma conta do Last.fm antes de poder experimentar o que quer que fosse. Passou para a página inicial com o seu próprio botão e um campo de nome, por isso é possível importar um histórico sem qualquer conta.'],

  'Cross-origin requests unblocked':
    ['Pedidos entre origens desbloqueados',
     'As regras de segurança do navegador estavam a recusar as próprias chamadas à API da aplicação.'],

  'Corrected API address':
    ['Endereço da API corrigido',
     'A aplicação chamava o endereço errado para o seu servidor.'],

  'Import from Spotify, Deezer, CSV or Sheets':
    ['Importa do Spotify, Deezer, CSV ou Sheets',
     'Um único caminho de importação que aceita o Last.fm, um ficheiro CSV, um ZIP de dados do Spotify, uma folha de cálculo do Deezer ou uma Google Sheet. O teu histórico podia agora vir de qualquer serviço onde já o tivesses.'],

  'Week navigation, a stats strip, and Top 100':
    ['Navegação por semanas, uma faixa de estatísticas e Top 100',
     'Andar entre semanas, uma faixa de números de resumo por cima da tabela, um tema amarelo e a opção Top 100.'],

  'Users saved on login':
    ['Os utilizadores são guardados ao iniciar sessão',
     'O cliente da base de dados foi atualizado e as contas passaram a ser registadas ao iniciar sessão.'],

  'Weekly chart routes':
    ['Rotas da tabela semanal',
     'Rotas do servidor para obter os dados da tabela semanal.'],

  'Hosting publish directory corrected':
    ['Pasta de publicação do alojamento corrigida',
     'A implementação estava a publicar a partir da pasta errada.'],

  'The dankcharts front end':
    ['A interface do dankcharts',
     'Foram acrescentadas a interface reconstruída e a respetiva configuração de alojamento.'],

  'A backend for the Last.fm API':
    ['Um servidor para a API do Last.fm',
     'Foi acrescentado um pequeno servidor para falar com a API do Last.fm em nome da aplicação.'],

  'Plays tag sized for Spanish and Portuguese on mobile':
    ['Etiqueta de reproduções à medida do espanhol e do português no telemóvel',
     'A palavra para reproduções é mais comprida em espanhol e português, e na largura de um telemóvel já não cabia. O tamanho e a posição da etiqueta foram corrigidos para esses idiomas.'],

  'Charts finally fit a phone screen':
    ['As tabelas cabem finalmente no ecrã do telemóvel',
     'Todas as tabelas cabem agora na largura de um telemóvel na vertical. A etiqueta de pico de reproduções passou para uma posição que funciona nesse espaço.'],

  'More of the layout made to fit':
    ['Mais partes do layout ajustadas',
     'O cabeçalho, o menu de separadores, o seletor de calendário, as estatísticas da tabela e as opções de visualização foram ajustados para caber no ecrã de um telemóvel.'],

  'Play counts visible on mobile new-music charts':
    ['Reproduções visíveis nas tabelas de música nova no telemóvel',
     'As novas tabelas de Músicas, Artistas e Álbuns escondiam as reproduções nos telemóveis.'],

  'Mobile shrinkage, first attempt':
    ['Encolhimento no telemóvel, primeira tentativa',
     'Uma tentativa com o layout que encolhia para a largura errada nos telemóveis.'],

  'The Events tab':
    ['O separador Eventos',
     'Um separador para as datas à volta da tua música e não para a música em si: aniversários de artistas e aniversários de lançamento de álbuns e singles, cada um como um mosaico onde podes clicar para saberes mais.'],

  'Search a release from the release itself':
    ['Pesquisa um lançamento a partir do próprio lançamento',
     'As entradas de Próximos e Recentes Lançamentos passaram a ser clicáveis, a abrir uma pesquisa por esse lançamento.'],

  'New-music charts on phones, first attempt':
    ['Tabelas de música nova nos telemóveis, primeira tentativa',
     'As novas tabelas de Músicas, Artistas e Álbuns não apareciam bem no telemóvel.'],

  'Release updates widened to 200 artists':
    ['Novidades de lançamentos alargadas a 200 artistas',
     'Próximos e Recentes Lançamentos olhavam para os teus 50 artistas principais; isso subiu para 200, por isso a secção cobre muito mais do que o topo do teu histórico.'],

  'The Certification Wall':
    ['O Mural de Certificações',
     'Um mural no separador Recordes que mostra todas as certificações que conquistaste, com filtros básicos para te orientares.'],

  'Set your own certification thresholds':
    ['Define os teus próprios limiares de certificação',
     'Ouro, platina e diamante são definidos por número de reproduções, e os números certos dependem de quanto ouves. Esses limiares passaram a ser definidos por ti, em vez de fixos.'],

  'New Songs, Artists and Albums charts':
    ['Tabelas de Músicas, Artistas e Álbuns novos',
     'As tabelas Semanal, Mensal e Anual ganharam tabelas companheiras com o que foi ouvido pela primeira vez nesse período — música a chegar ao teu histórico pela primeira vez, separada do que já conhecias.'],

  'Mobile phase 2: fitting the screen upright':
    ['Telemóvel, fase 2: caber no ecrã na vertical',
     'Mais uma tentativa de pôr o site a caber na largura de um telemóvel na vertical.'],

  'Mobile phase 2: masthead and options width':
    ['Telemóvel, fase 2: largura do cabeçalho e das opções',
     'Correções de largura para o cabeçalho e para a fila de opções da tabela.'],

  'Mobile phase 2: sizing when zoomed out':
    ['Telemóvel, fase 2: tamanhos com zoom afastado',
     'Os elementos da interface ficavam com o tamanho errado quando a página estava com zoom afastado num telemóvel.'],

  'Mobile phase 1: a critical bug':
    ['Telemóvel, fase 1: um erro crítico',
     'A primeira passagem para tornar o site utilizável em navegadores móveis, a corrigir um erro crítico e a acrescentar adaptações sobretudo para o Safari.'],

  'A nudge towards setup for new users':
    ['Um empurrãozinho para a configuração para utilizadores novos',
     'Quem chegava pela primeira vez não tinha forma de saber onde configurar o que quer que fosse. O botão de configurar brilha agora até ser definido um nome, o que basta como dica sem ser uma caixa de diálogo a atrapalhar.'],

  'UTC offsets shown when picking a zone':
    ['Diferença face ao UTC ao escolher o fuso',
     'O seletor de fuso horário mostra agora a diferença de cada fuso face ao UTC. O texto dos menus de tema, idioma e dia foi melhorado.'],

  'Time zones, including daylight saving':
    ['Fusos horários, incluindo a hora de verão',
     'A data de uma reprodução decide em que semana cai, por isso o fuso horário em que é lida muda as próprias tabelas. O teu fuso é agora uma definição, e a hora de verão é tida em conta nos sítios que a usam.'],

  'Automatic updates every 30 minutes':
    ['Atualizações automáticas a cada 30 minutos',
     'A atualização automática foi corrigida para que tanto o Last.fm como o Google Sheets sejam relidos num ciclo fiável de meia hora.'],

  'Six-hour cache and steadier loading':
    ['Cache de seis horas e carregamento mais estável',
     'Os dados ficam em cache durante seis horas, e as rotinas que vão buscar dados ao Last.fm e ao Google Sheets ficaram mais robustas.'],

  'Theme, day and language buttons reflow better':
    ['Os botões de tema, dia e idioma reorganizam-se melhor',
     'Os três grupos de botões de definições adaptam-se agora a ecrãs mais estreitos em vez de transbordarem.'],

  'Your own name and start date in the masthead':
    ['O teu próprio nome e data de início no cabeçalho',
     'O cabeçalho pode ter o teu nome e a data em que começa o teu histórico de audição, em vez de um texto fixo.'],

  'Last.fm retries instead of giving up':
    ['O Last.fm volta a tentar em vez de desistir',
     'Carregar um histórico grande do Last.fm significava muitas páginas de pedidos, e uma única página falhada deixava o histórico incompleto. Agora volta-se a tentar nas páginas falhadas, o que afeta sobretudo contas com muitos dados. Foi também corrigido o texto em espanhol da janela do artista.'],

  'Yellow Dark button text made readable':
    ['Texto dos botões do Amarelo Escuro passou a ser legível',
     'O texto dos botões no tema Amarelo Escuro não tinha contraste suficiente com o fundo.'],

  'Certification bug on multi-album songs, and tag toggles':
    ['Erro de certificação em músicas de vários álbuns, e interruptores de etiquetas',
     'As certificações estavam erradas nas músicas que aparecem com mais de um nome de álbum. A etiqueta de pico de reproduções passou para a esquerda, e as etiquetas de Pico, Certificação e Pico de reproduções ganharam cada uma o seu interruptor.'],

  'Certification badges on every chart':
    ['Selos de certificação em todas as tabelas',
     'Os selos de ouro, platina e diamante aparecem agora nas tabelas Semanal, Mensal e Anual, e não só nas vistas de pormenor.'],

  'Scrobble to Last.fm from inside the app':
    ['Faz scrobble no Last.fm a partir da aplicação',
     'O scrobble manual está disponível no próprio site, por isso uma reprodução pode ser registada sem saíres para o Last.fm.'],

  'Last.fm as a data source':
    ['O Last.fm como fonte de dados',
     'Até aqui a aplicação lia de uma Google Sheet. Ligar diretamente uma conta do Last.fm passou a ser uma opção, e foi esse o momento em que a aplicação deixou de servir só a quem estivesse disposto a manter uma folha de cálculo.'],

  'Period stats gained peaks and comparisons':
    ['As estatísticas do período ganharam picos e comparações',
     'Os números de resumo por cima de uma tabela semanal, mensal ou anual têm agora etiquetas de pico e mostram como o período se compara com o anterior, para que um número tenha com que ser medido.'],

  'All-Kill tags that say how many times':
    ['Etiquetas All-Kill que dizem quantas vezes',
     'As etiquetas de domínio total All-Kill foram substituídas por outras que contam quantas vezes isso aconteceu realmente, incluindo uma contagem por artista, em vez de apenas marcarem que aconteceu. Os tamanhos de letra da música e do álbum principais foram corrigidos.'],

  'Adjustable columns across Records':
    ['Colunas ajustáveis em todos os Recordes',
     'Cada tabela dos Recordes deixa-te mudar quantas colunas usa, por isso um recorde pode ser percorrido em largura ou lido em estreito. A tabela Todos os n.º 1 foi melhorada e o texto dos Recordes corrigido.'],

  'Debuts made less cluttered':
    ['Estreias menos sobrecarregadas',
     'O recorde de Estreias remodelado tinha imagens a mais nas músicas; as imagens foram reduzidas e os mosaicos de artista e álbum ficaram mais pequenos.'],

  'Debuts ranked by plays, not position':
    ['Estreias ordenadas por reproduções, não por posição',
     'O recorde de Estreias foi refeito para ordenar pelo número de reproduções com que uma música chegou, e não pela posição em que entrou, o que mede melhor uma chegada. Ganhou também imagens e ligações para as tabelas.'],

  'Hide the image source picker':
    ['Esconde o seletor de fonte das imagens',
     'O controlo para escolher de onde vêm as imagens sobrecarregava todas as tabelas. Pode agora ser escondido, deixando a lista mais limpa.'],

  'Translation phase 15: Records names and titles':
    ['Tradução, fase 15: nomes e títulos dos Recordes',
     'Os nomes das tabelas de recordes e os títulos das tabelas são agora traduzidos de imediato. A tabela de Presenças foi melhorada ao mesmo tempo.'],

  'Translation phase 14: the Graphs tab':
    ['Tradução, fase 14: o separador Gráficos',
     'Os gráficos foram traduzidos, e a mudança de idioma voltou a ficar mais rápida.'],

  'Translation phase 13: instant switching on the four chart tabs':
    ['Tradução, fase 13: mudança imediata nos quatro separadores de tabelas',
     'Mudar de idioma em Semanal, Mensal, Anual e De Sempre tem agora efeito imediato, sem precisar de recarregar. Os percursos também foram ajustados.'],

  'Translation phase 12: Records and All-Kill':
    ['Tradução, fase 12: Recordes e All-Kill',
     'O separador Recordes e a sua secção All-Kill foram traduzidos, e a própria tabela All-Kill foi bastante melhorada pelo caminho.'],

  'Translation phase 11: modals and chart run buttons':
    ['Tradução, fase 11: janelas e botões de percurso',
     'As janelas de artista e álbum e os botões de percurso foram traduzidos, juntamente com correções nas cores dos temas — sobretudo nos botões do tema amarelo escuro.'],

  'Translation phase 10: the word "chart" itself':
    ['Tradução, fase 10: a própria palavra "chart"',
     'O espanhol e o português não têm uma palavra única que corresponda ao inglês "chart" neste sentido, e a aplicação usava-a de forma incoerente. Todas as ocorrências foram uniformizadas numa única adaptação. O texto da exportação de playlists foi corrigido ao mesmo tempo.'],

  'Translation phase 9: the share modal rebuilt':
    ['Tradução, fase 9: a janela de partilha refeita',
     'A janela Partilhar como imagem foi bastante refeita para que a personalização da imagem se adapte bem a outros idiomas além do inglês, em vez de assumir etiquetas do tamanho das inglesas.'],

  'Translation phase 8: the share button and its menu':
    ['Tradução, fase 8: o botão de partilha e o seu menu',
     'Foram corrigidos problemas de idioma importantes no botão Partilhar como imagem e no seu menu de personalização.'],

  'Translation phase 7: dates everywhere, and share text':
    ['Tradução, fase 7: datas em todo o lado, e textos de partilha',
     'As datas foram corrigidas em todas as tabelas, e as janelas de partilha, juntamente com as imagens que geram, foram traduzidas. Os Recordes e as janelas de pormenor ainda estavam por fazer.'],

  'Translation phase 6: button hover text':
    ['Tradução, fase 6: textos ao passar o rato pelos botões',
     'As descrições que aparecem ao passar o rato por um botão principal foram traduzidas. Muitos botões secundários ainda estavam por fazer.'],

  'Translation phase 5: artist and album modals':
    ['Tradução, fase 5: janelas de artista e álbum',
     'A maior parte do texto dentro das janelas de pormenor de artista e álbum foi traduzida.'],

  'Translation phase 4: peak tags':
    ['Tradução, fase 4: etiquetas de pico',
     'As etiquetas que marcam a posição de pico de uma música foram traduzidas, em vez de ficarem em inglês.'],

  'Translation corrections':
    ['Correções de tradução',
     'Pequenos acertos de texto nas traduções.'],

  'Translation phase 3: faster language switching':
    ['Tradução, fase 3: mudança de idioma mais rápida',
     'Um grande alargamento do que estava traduzido, e mudar de idioma ficou mais rápido e menos esbanjador.'],

  'Translation phase 2: chart headers and dates':
    ['Tradução, fase 2: títulos das tabelas e datas',
     'Os títulos das tabelas foram corrigidos e as primeiras datas foram traduzidas.'],

  'Spanish and Portuguese arrive':
    ['Chegam o espanhol e o português',
     'A primeira fase da tradução: espanhol, português do Brasil e português europeu passaram a ser idiomas selecionáveis. Havia ainda muita coisa por traduzir nesta altura, e as doze fases seguintes são o trabalho de a terminar.'],

  'Collapsed sections stopped leaking between tabs':
    ['As secções recolhidas deixaram de passar entre separadores',
     'Recolher uma secção num separador recolhia a secção correspondente nos outros. Agora cada separador lembra-se do seu estado. O ícone do calendário no tema Azul-Marinho Claro passou também a preto para se ver.'],

  'Unreadable description on entry images':
    ['Descrição ilegível nas imagens de entrada',
     'A descrição de uma imagem de entrada partilhada era desenhada sobre um fundo cinzento pesado que dificultava a leitura.'],

  'Jump from a record straight to the week it happened':
    ['Salta de um recorde diretamente para a semana em que aconteceu',
     'A data num recorde de Todos os n.º 1 é agora uma ligação. Clicar nela abre a tabela semanal dessa semana exata, para veres o recorde no contexto em que foi feito e não como um número solto.'],

  'Small Records update':
    ['Pequena atualização dos Recordes',
     'Mais pequenos acertos no separador Recordes.'],

  'Better All #1s and Repeat Scrobble Runs':
    ['Todos os n.º 1 e Sequências de repetição melhorados',
     'Duas tabelas dos Recordes foram melhoradas: a lista de todas as músicas que chegaram a número um, e o recorde de ouvir a mesma música vezes sem conta seguidas.'],

  'Back to Top works again':
    ['Voltar ao topo volta a funcionar',
     'O botão retirado no dia anterior foi corrigido e reposto.'],

  'Styles and code split out of the page':
    ['Estilos e código separados da página',
     'O CSS e o JavaScript viviam todos dentro do ficheiro HTML. Separá-los em ficheiros próprios permite ao navegador guardá-los em cache entre visitas em vez de voltar a transferir tudo de cada vez.'],

  'Choose which day your week starts on':
    ['Escolhe o dia em que a tua semana começa',
     'As tabelas semanais já não assumem um dia de início fixo. Escolhes o dia em que a tua semana começa, e cada tabela semanal, sequência e percurso é cortado nesse limite.'],

  'Chart run image modal improved':
    ['Janela de imagem do percurso melhorada',
     'Várias melhorias e correções na janela que cria uma imagem partilhável de um percurso.'],

  'Debug output removed':
    ['Saída de depuração retirada',
     'Os registos de diagnóstico que tinham ficado da correção das janelas foram retirados.'],

  'Artist and album modals working again':
    ['As janelas de artista e álbum voltam a funcionar',
     'As duas janelas de pormenor foram corrigidas como deve ser depois de a primeira tentativa não ter chegado.'],

  'First attempt at the broken artist modal':
    ['Primeira tentativa com a janela de artista avariada',
     'A janela de pormenor do artista tinha deixado de funcionar; esta foi a primeira tentativa de a reparar.'],

  'Image modal tidied, broken Back to Top removed':
    ['Janela de imagem arrumada, e Voltar ao topo avariado retirado',
     'Foram corrigidos pequenos erros na janela de partilha, e o botão Voltar ao topo foi retirado porque não funcionava.'],

  'Image customisation buttons repaired':
    ['Botões de personalização de imagem reparados',
     'Os controlos para personalizar uma imagem partilhada tinham deixado de funcionar bem.'],

  'Records views improved':
    ['Vistas dos Recordes melhoradas',
     'Uma primeira ronda de acertos no novo separador Recordes.'],

  'The Records tab':
    ['O separador Recordes',
     'Um separador inteiro para as conquistas nas tabelas, onde cada tipo de conquista tem a sua própria tabela ordenada em vez de ser uma nota de rodapé na página de um artista. É a origem de todos os recordes que existem hoje na aplicação.'],

  'Entry images finished':
    ['Imagens de entrada concluídas',
     'O gerador de imagens de novas entradas foi concluído e afinado.'],

  'Share a new chart entry as an image':
    ['Partilha uma nova entrada na tabela como imagem',
     'Um segundo gerador de imagens, este para anunciar uma única entrada a chegar a uma tabela, e não a tabela inteira.'],

  'Smoother navigation, and a better dark mode on reload':
    ['Navegação mais fluida, e um modo escuro melhor ao recarregar',
     'Um conjunto de pequenas melhorias na forma de andar pela aplicação e no que vês no modo escuro logo depois de recarregar a página.'],

  'Bar race, and downloadable race GIFs':
    ['Corrida de barras, e GIFs da corrida para descarregar',
     'Novos gráficos, entre eles uma corrida de barras animada que mostra os teus artistas principais a ultrapassarem-se ao longo do tempo, e que pode ser descarregada como GIF.'],

  'Sheet sync moved to hourly':
    ['A sincronização da folha passou a ser de hora a hora',
     'O Google Sheets é agora relido uma vez por hora em vez de num ciclo mais curto.'],

  'Chart runs across different periods':
    ['Percursos em períodos diferentes',
     'Os percursos não funcionavam bem quando abertos a partir de uma tabela mensal ou anual em vez de uma semanal.'],

  'Chart run period labels':
    ['Etiquetas de período do percurso',
     'Os percursos semanais e mensais identificavam as caixas com intervalos de tempo errados.'],

  'Chart run images improved':
    ['Imagens de percurso melhoradas',
     'Uma ronda de melhorias no gerador de imagens de percursos.'],

  'Hover hints on buttons':
    ['Dicas ao passar o rato pelos botões',
     'Os botões de toda a aplicação ganharam descrições ao passar o rato, por isso é possível descobrir o que cada um faz sem carregar nele primeiro.'],

  'Chart images you can download and post':
    ['Imagens das tabelas para descarregar e publicar',
     'A exportação de imagens foi concluída: qualquer tabela pode ser transformada numa imagem com tamanho de publicação no feed ou de história, e descarregada.'],

  'The Graphs tab':
    ['O separador Gráficos',
     'Um novo separador com vistas visuais do teu histórico, a começar por duas: reproduções acumuladas ao longo do tempo e volume de reproduções — ambas capazes de comparar vários artistas nos mesmos eixos.'],

  'Recent Releases, and the dankcharts.fm name':
    ['Lançamentos Recentes, e o nome dankcharts.fm',
     'A aplicação ganhou o nome atual e uma secção de Lançamentos Recentes que mostra música nova de artistas que já ouves.'],

  'Visitor country counter':
    ['Contador de países dos visitantes',
     'Foi acrescentado um contador que regista de que países o site é visitado.'],

  'Real artist photos, via Deezer':
    ['Fotografias reais de artistas, através do Deezer',
     'O Deezer passou a ser a fonte principal de imagens, o que fez com que os artistas tivessem finalmente fotografias a sério em vez de um marcador ou de uma capa de álbum no lugar.'],

  'All-Time and Yearly fixes, including search':
    ['Correções em De Sempre e Anual, incluindo a pesquisa',
     'Um lote de correções nas tabelas De Sempre e Anual, incluindo o comportamento das suas barras de pesquisa.'],

  'Top 50, 100 and 200 on the long charts':
    ['Top 50, 100 e 200 nas tabelas longas',
     'As tabelas Anual e De Sempre podem agora ser abertas a 50, 100 ou 200 posições em vez de pararem no topo da lista.'],

  'Peak tags on weekly artist charts':
    ['Etiquetas de pico nas tabelas semanais de artistas',
     'As tabelas semanais de artistas mostravam a etiqueta de pico errada.'],

  'Export playlists through Soundiiz':
    ['Exporta playlists através do Soundiiz',
     'As playlists feitas com os dados das tuas tabelas podem ser entregues ao Soundiiz, que as transfere para o Spotify, Apple Music e outros serviços.'],

  'More themes, and a contrast pass':
    ['Mais temas, e uma revisão do contraste',
     'Novos temas de cor, mais uma revisão dos existentes a corrigir combinações de texto e fundo demasiado próximas para se lerem.'],

  'Shareable chart images begun':
    ['Início das imagens partilháveis das tabelas',
     'Primeiro trabalho para transformar uma tabela numa imagem que se pode publicar. Incompleto nesta altura.'],

  'Chart runs':
    ['Percursos na tabela',
     'Cada música, artista e álbum tem agora um percurso — o histórico completo, semana a semana, de onde ficou, da estreia à saída, e não só a posição atual.'],

  'Chart run layout, and first and last play dates':
    ['Layout do percurso, e datas da primeira e da última reprodução',
     'Foram corrigidos o ícone do percurso e os espaços entre as caixas, e os percursos longos mudam de linha em vez de transbordarem. As Conquistas do artista mostram agora a primeira e a última vez que ouviste cada música e álbum.'],

  'Album modals, double diamond, and tighter chart rows':
    ['Janelas de álbum, duplo diamante e linhas da tabela mais justas',
     'Os álbuns ganharam a sua própria janela de pormenor. Foi acrescentada a certificação de duplo diamante acima de diamante. As etiquetas de semana foram abreviadas e os números de posição redimensionados para que as linhas caibam com mais conforto.'],

  'Calendar filter fixed':
    ['Filtro de calendário corrigido',
     'A vista de calendário usada para filtrar as tabelas por data não devolvia o intervalo certo.'],

  'Peak and first-week figures corrected':
    ['Números de pico e da primeira semana corrigidos',
     'A posição de pico e as reproduções da primeira semana estavam a ser mal calculadas em algumas entradas.'],

  'YouTube as an artwork source':
    ['O YouTube como fonte de imagens',
     'Foi acrescentado o YouTube como opção de imagem quando as outras fontes não têm nada, e foi corrigida a forma como os singles eram contados.'],

  'Collaborations count for every artist involved':
    ['As colaborações contam para todos os artistas envolvidos',
     'As músicas creditadas a mais do que um artista somam agora aos totais de cada artista em vez de só ao primeiro nome. Foram acrescentados diagnósticos que avisam quando se perdem reproduções na importação.'],

  'Raw Data and Artist Accomplishments':
    ['Dados Brutos e Conquistas do artista',
     'Duas vistas novas: Dados Brutos, que lista cada reprodução individual por trás das tabelas, e Conquistas do artista, que reúne o que um único artista conquistou em todo o teu histórico.'],

  'Collaboration counts and artwork corrected':
    ['Contagens de colaborações e imagens corrigidas',
     'Seguimento do trabalho das colaborações — tanto a resolução das imagens como os totais por artista dos créditos partilhados estavam errados.'],

  'The first all-time chart':
    ['A primeira tabela de sempre',
     'A primeira versão funcional da aplicação: uma única tabela de sempre com a tua música mais ouvida, com imagens de artistas, álbuns e músicas, certificações em músicas e álbuns, resumos de desempenho por artista e vistas Top 10 / 20 / 50 / 100.'],

  'First four themes, and a name':
    ['Os quatro primeiros temas, e um nome',
     'A aplicação ganhou um logótipo e um sistema de temas com quatro aspetos — Azul-Marinho Escuro, Azul-Marinho Claro, Roxo Escuro e Roxo Claro. Os temas claros ganharam fundos de página levemente tingidos e cabeçalhos mais escuros, para que o cabeçalho se leia separado da página, e o contraste foi aumentado nos quatro.'],

  'Accented and non-Latin names stopped breaking':
    ['Os nomes com acentos e não latinos deixaram de se estragar',
     'Os dados do Google Sheets eram descodificados com a codificação que o navegador adivinhasse, o que estragava nomes como Los Ángeles Azules, Ricardo Arjona e 강남스타일. Agora a folha é lida explicitamente como UTF-8, por isso os títulos com acentos, em coreano e noutros alfabetos não latinos chegam intactos.'],

  'Spanish-language sheets were silently losing most plays':
    ['As folhas em espanhol perdiam em silêncio a maioria das reproduções',
     'O Google Sheets escreve as datas no idioma da tua conta, e nenhum leitor de datas normal percebe meses em espanhol como ene ou febrero. O resultado era que a maior parte de um histórico em espanhol era descartada sem uma palavra. Agora os meses em espanhol são entendidos, e qualquer formato de data que a aplicação ainda não saiba ler é contado e comunicado em vez de ser descartado em silêncio.'],

  'Dropout charts, and more on every row':
    ['Tabelas de saídas, e mais em cada linha',
     'Foram acrescentadas tabelas das músicas que saíram, e cada linha da tabela ganhou a posição anterior, o número de reproduções e as semanas ou meses na tabela. As etiquetas de pico foram corrigidas ao mesmo tempo.'],

};
