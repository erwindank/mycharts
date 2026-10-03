/* ===========================================================================
   CHANGELOG - BRAZILIAN PORTUGUESE
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
window.DC_CHANGELOG_I18N['pt-BR'] = {

  /* ========== OUTUBRO 2026 ========== */

  'Share images download much faster':
    ['As imagens para compartilhar baixam muito mais rápido',
     'Baixar, copiar ou compartilhar uma imagem levava vários segundos, e mais quanto maior a sua biblioteca, porque a página inteira era copiada por trás antes de desenhar a imagem. Agora só o cartão é copiado, então as imagens ficam prontas em cerca de meio segundo. As imagens ficam exatamente iguais a antes.'],

  'Favorite award categories':
    ['Categorias de prêmios favoritas',
     'Qualquer categoria de Meus Grammys pode ser marcada como favorita com a estrela: no cartão dela em Configurar ano, no cabeçalho do cartão de indicados ou no topo do seletor de indicados. As favoritas continuam as mesmas de um ano para o outro e sincronizam entre seus dispositivos. Em Configurar ano, o novo filtro Favoritas mostra só as categorias marcadas, e o botão Só favoritas ativa essas e desativa todas as outras, então montar um ano novo com seus prêmios de sempre leva um clique. Os indicados que você já escolheu são mantidos.'],

  '14 new awards: Gospel & Christian and Instrumental groups':
    ['14 prêmios novos: grupos Gospel e cristã e Instrumental',
     'Meus Grammys ganhou mais dois grupos em Configurar ano. Gospel e cristã soma Melhor Música e Álbum Gospel, Melhor Música e Álbum Cristão Contemporâneo, Melhor Música de Adoração, Artista Cristão/Gospel do Ano, Melhor Música de Hip-Hop Cristão e Melhor Colaboração Gospel/Cristã. Instrumental soma Melhor Música Instrumental, Melhor Versão Instrumental (versões instrumentais e de karaokê, pelo título), Melhores Beats Lo-Fi/Chill, Melhor Peça para Piano, Melhor Música de Videogame e Melhor Composição Instrumental, e agora também reúne os prêmios de álbum de jazz e clássico/instrumental.'],

  '30 new awards: a Pop group and a Videos group':
    ['30 prêmios novos: um grupo Pop e um grupo Clipes',
     'Meus Grammys ganhou dois grupos novos em Configurar ano. Pop reúne os prêmios pop que já existiam e soma Artista Pop do Ano, Melhor Novo Artista Pop, Melhor Álbum de Estreia Pop, Melhor EP Pop, Melhor Remix Pop, Melhor Balada Pop, Melhor Performance Vocal Pop, Melhor Refrão Pop e prêmios de estilo para synth-pop, pop latino, alt-pop, hyperpop e art pop. Clipes soma prêmios no estilo do VMA: Melhor Clipe Pop, de Hip-Hop, R&B, Rock, Alternativo, Latino e K-Pop, Melhor Clipe de Colaboração, Melhor Clipe de Artista Revelação, Melhor Direção, Coreografia, Fotografia, Direção de Arte, Efeitos Visuais e Edição, Melhor Performance ao Vivo e Melhor Filme Musical. Não há dados de vídeo, então a disputa é entre suas músicas e a escolha é sua. Os prêmios de artista por gênero agora também leem os gêneros escritos na sua planilha.'],

  'Two holiday awards: Best Holiday Season Song and Album':
    ['Dois prêmios de fim de ano: Melhor Música e Melhor Álbum de Fim de Ano',
     'Meus Grammys ganhou duas categorias novas opcionais. Uma música ou um álbum entra na disputa quando o título menciona Natal, Ano Novo e afins, ou quando você ouviu na temporada de fim de ano, de 11 de dezembro a 14 de janeiro. Títulos de fim de ano contam todas as reproduções do ano; o resto conta só as da temporada. Um álbum de Natal conta como de fim de ano mesmo quando os títulos das músicas não dizem isso.'],

  'Audio samples no longer pick live recordings with plain titles':
    ['As amostras de áudio não escolhem mais gravações ao vivo com títulos normais',
     'Em Meus Grammys, o botão de tocar ainda podia tocar uma versão ao vivo quando uma loja a listava com o nome normal da música e só o álbum dizia ao vivo. I Write Sins Not Tragedies do Panic! at the Disco era um caso: a amostra vinha de um single de uma sessão ao vivo. Agora as amostras também conferem de qual álbum vem a gravação, e pulam álbuns ao vivo, acústicos, de remixes e de demos, a menos que o indicado venha de um deles. A busca por álbum agora procura no Apple Music além do Deezer.'],

  'Album records show what their songs earned':
    ['Os recordes de álbum mostram o que as músicas dele conquistaram',
     'No resumo dos prêmios, os cartões de recorde de álbum agora trazem uma linha pequena como “+3 das suas músicas” quando músicas desse álbum também foram indicadas ou venceram. Só as indicações e vitórias do próprio álbum contam para o recorde, do mesmo jeito que no Grammy de verdade, então um álbum grande com alguns singles de sucesso não leva os recordes de álbum só pelas músicas.'],

  'The Chart Run panel has a cleaner, more modern look':
    ['O painel de Trajetória na Parada ficou mais limpo e moderno',
     'A Trajetória na Parada que abre embaixo de uma entrada agora é um cartão arredondado próprio. Os botões de período viraram um único seletor com a opção escolhida em destaque, e as abas de sequências funcionam do mesmo jeito. As semanas na parada, o total de plays, o pico e os outros números ficam em pequenos blocos com o número em cima. Cada semana é uma ficha suave e arredondada: o pico é dourado e as outras semanas no top 3 ganham um tom de cor, então o melhor trecho se destaca. O tempo fora da parada aparece como uma pausa pontilhada. Recordes de sequência, Mapa de calor e Histórico completo são cartões arredondados com uma seta que gira ao abrir.'],

  'The chart tables have a cleaner, more modern look':
    ['As tabelas das paradas ficaram mais limpas e modernas',
     'A visualização em tabela não parece mais uma planilha. Cada entrada é uma faixa arredondada com um pouco de espaço entre as linhas, e as linhas de coluna e o cabeçalho preenchido sumiram. As três primeiras linhas têm tons de ouro, prata e bronze em cores que também funcionam nos temas claros, e o número 1 tem um efeito de folha dourada. O movimento na coluna Anterior, incluindo sem mudança, aparece como pequenas pílulas coloridas, e as etiquetas de pico são arredondadas. Nas paradas semanais de Artistas e Álbuns, a etiqueta de recorde de plays agora fica embaixo da barra, igual em Músicas.'],

  'Real-Life Awards now cover the BRIT Awards':
    ['Prêmios Reais agora inclui o BRIT Awards',
     'Prêmios Reais ganhou uma nona aba, BRIT, para o BRIT Awards: a primeira cerimônia em 1977 e depois todos os anos de 1982 até hoje. As setas de ano pulam de 1978 a 1981, quando não houve cerimônia. Ela mostra quais dos seus artistas foram indicados e o que ganharam, e depois todas as categorias da noite com os vencedores em negrito e seus artistas marcados. Cada ano é comparado com o que você ouviu nos doze meses antes da cerimônia. Os nomes das categorias não mostram mais quem entregou o prêmio, em nenhuma aba. Se a Wikipedia estiver ocupada por um instante, a aba agora espera e tenta de novo antes de mostrar um erro.'],

  'Real-Life Awards now cover the Juno Awards':
    ['Prêmios Reais agora inclui o Juno Awards',
     'Prêmios Reais ganhou uma oitava aba, Juno, para o Juno Awards do Canadá, com todos os anos de 1971 até hoje. Em 1988 não houve cerimônia, e a aba avisa isso. Ela mostra quais dos seus artistas foram indicados e o que ganharam, e depois todas as categorias da noite com os vencedores em negrito e seus artistas marcados. Empates mostram todos os vencedores, como o Single do Ano de 1981, que foi para Anne Murray e para Martha and the Muffins. Cada ano é comparado com o que você ouviu nos doze meses antes da cerimônia. Vencedores e indicados vêm da Wikipedia.'],

  'Real-Life Awards only credit the artist who was actually nominated':
    ['Prêmios Reais só credita a indicação ao artista que foi indicado de verdade',
     'Nas abas VMAs, AMAs, iHeartRadio, World Music, Billboard e ARIA, um artista com nome de uma palavra só podia receber a indicação de outro quando o nome dele fazia parte de um nome maior. Por exemplo, um artista chamado Selena recebia as indicações de Selena Gomez, e Max as de Max Martin. Agora cada indicação é separada nos artistas que ela cita, e só vale se o nome bater por inteiro. Créditos compartilhados continuam valendo para todos, então Rosé e Bruno Mars recebem os dois Apt., e nomes como Earth, Wind & Fire e Lil Nas X continuam inteiros.'],

  'Real-Life Awards now cover the ARIA Music Awards':
    ['Prêmios Reais agora inclui o ARIA Music Awards',
     'Prêmios Reais ganhou uma sétima aba, ARIA, para o ARIA Music Awards da Austrália, com todos os anos de 1987 até hoje. Ela mostra quais dos seus artistas foram indicados e o que ganharam, e depois todas as categorias da noite com os vencedores em negrito e seus artistas marcados. Quem entrou para o Hall da Fama conta como vencedor. Cada ano é comparado com o que você ouviu naquele ano. Os indicados deste ano já aparecem, e os vencedores vão aparecer depois da cerimônia. Vencedores e indicados vêm da Wikipedia.'],

  'Real-Life Awards now cover the Billboard Music Awards':
    ['Prêmios Reais agora inclui o Billboard Music Awards',
     'Prêmios Reais ganhou uma sexta aba, Billboard, para o Billboard Music Awards. A Wikipedia tem os vencedores e indicados de 1990, 1991, 1999, de 2001 a 2006 e de todos os anos de 2011 a 2024, e as setas de ano pulam os anos no meio. Os anos seguintes também aparecem, então uma nova cerimônia surge assim que a Wikipedia tiver a página dela. Cada ano é comparado com o que você ouviu nos doze meses antes da cerimônia. Quando a Wikipedia não diz quem ganhou uma categoria, os indicados aparecem sem vencedor em vez de um palpite.'],

  'Real-Life Awards now cover the World Music Awards':
    ['Prêmios Reais agora inclui o World Music Awards',
     'Prêmios Reais ganhou uma quinta aba, World Music, para o World Music Awards. A cerimônia aconteceu de forma irregular até 2014, e a Wikipedia só tem os vencedores de dez desses anos: 1999, 2001, de 2003 a 2008, 2010 e 2014. As setas e o seletor de ano pulam direto entre esses anos. A maioria dos anos só tem os vencedores, mas alguns também têm indicados ou finalistas. Cada ano é comparado com o que você ouviu naquele ano, ou nos doze meses antes da cerimônia quando a página traz a data. No celular, as cinco abas agora passam para uma segunda linha para nenhuma ficar cortada.'],

  'Real-Life Awards now cover the iHeartRadio Music Awards':
    ['Prêmios Reais agora inclui o iHeartRadio Music Awards',
     'Prêmios Reais ganhou uma quarta aba, iHeartRadio, ao lado de Grammys, VMAs e AMAs. Escolha um ano a partir de 2014 para ver quais dos seus artistas foram indicados e o que ganharam, e depois todas as categorias da noite com os vencedores em negrito e seus artistas marcados. Cada ano é comparado com o que você ouviu nos doze meses antes daquela cerimônia. Remixes e covers mantêm a observação, como Savage (Remix), então um cover é creditado a quem cantou e não ao artista original. Vencedores e indicados vêm da Wikipedia.'],

  'Real-Life Awards now cover the American Music Awards':
    ['Prêmios Reais agora inclui o American Music Awards',
     'Prêmios Reais ganhou uma terceira aba, AMAs, ao lado de Grammys e VMAs. Escolha um ano a partir de 1974 para ver quais dos seus artistas foram indicados e o que ganharam, e depois todas as categorias da noite com os vencedores em negrito e seus artistas marcados. O AMAs mudou de data ao longo dos anos, então cada ano é comparado com o que você ouviu nos doze meses antes daquela cerimônia. Em 2003 houve duas cerimônias, e as duas aparecem. Não houve cerimônia em 2023 nem em 2024, e a aba avisa isso. Vencedores e indicados vêm da Wikipedia.'],

  'Real-Life Awards now cover the MTV VMAs':
    ['Prêmios Reais agora inclui os MTV VMAs',
     'Prêmios Reais agora tem duas abas: Grammys e VMAs. Escolha um ano a partir de 1984 e a aba VMAs mostra cada artista que você ouviu naquela temporada e foi indicado, com o que ganhou, e depois todas as categorias da noite com os vencedores em negrito e seus artistas marcados. A temporada vai de julho a junho, como os próprios prêmios. Vencedores e indicados vêm da Wikipedia, e cada ano só carrega uma vez.'],

  'Real life Grammys show up again':
    ['Os Grammys da vida real voltaram a aparecer',
     'Em Prêmios, Prêmios da Vida Real tinha parado de mostrar vitórias e indicações ao Grammy, porque o grammy.com mudou o jeito como a busca devolve as páginas de artistas. A busca agora entende o novo formato, então o histórico de Grammys de cada artista volta a carregar.'],

  'Audio samples find the right recording more often':
    ['As amostras de áudio acham a gravação certa com mais frequência',
     'Em Meus Grammys, o botão de tocar de um indicado agora também procura o próprio álbum e toca a partir da lista de faixas, começando pela faixa-título. Antes, um álbum cujas músicas também estão numa coletânea, como To the Summit de Jon Schmidt, podia ficar sem amostra. Uma música cuja busca só achava versões ao vivo ou acústicas agora também confere o próprio álbum para achar a versão de estúdio, então I Write Sins Not Tragedies do Panic! at the Disco toca a música de verdade, não uma versão ao vivo. Uma versão remasterizada agora conta como a original.'],

  'Nominee picker shows the year and genres for every candidate':
    ['O seletor de indicados mostra o ano e os gêneros de cada candidato',
     'Em Meus Grammys, cada música e álbum do seletor de indicados agora mostra o ano de lançamento ao lado do artista, e cada candidato mostra até três gêneros, não só os sugeridos no topo. As categorias de gênero continuam mostrando até cinco. Os gêneros da sua planilha do Google aparecem na hora. O resto é buscado online enquanto você rola, então uma linha pode ser preenchida um ou dois segundos depois de aparecer. As respostas ficam salvas no seu navegador, então da próxima vez que você abrir o seletor elas aparecem na hora.'],

  'Clearing the nominee picker now asks first':
    ['Limpar o seletor de indicados agora pergunta antes',
     'Em Meus Grammys, o botão Limpar do seletor de indicados agora abre uma pequena janela de aviso sobre o seletor, com os botões Cancelar e Remover todos, antes de remover todos os indicados da categoria. Cancelar vem selecionado, e Esc ou um clique fora da janela também cancelam. Um clique sem querer, ou um clique duplo, não apaga mais uma lista que você montou à mão. Se ainda não houver indicados, ele não faz nada.'],

  'Nominee picker shows how well each candidate fits the category':
    ['O seletor de indicados mostra o quanto cada candidato combina com a categoria',
     'Em Meus Grammys, o seletor de indicados agora coloca uma pequena etiqueta de encaixe ao lado de cada candidato nas categorias de gênero e em Música do Verão e nas músicas da noite e da manhã, por exemplo 92% fit. Num prêmio de gênero ela diz com que força a música, o álbum ou o artista está marcado com aquele gênero: um gênero listado primeiro conta mais que um listado em quinto, e um parente próximo como metal para Melhor Música de Rock conta um pouco menos que rock. Em Música do Verão é a parte das reproduções da música que caíram entre junho e agosto, e as músicas da noite e da manhã funcionam do mesmo jeito. Encaixes fortes aparecem em dourado. Passe o mouse sobre uma etiqueta para ver o que ela mede. Categorias que são um simples sim ou não, como Melhor Colaboração ou Melhor Cover, não ganham uma.'],

  'Each category card now says what it is about':
    ['Cada categoria agora diz do que se trata',
     'Em Meus Grammys, cada cartão de categoria mostra uma linha curta abaixo do nome sobre o que cabe nela, para você saber o que procurar ao escolher os indicados. Os prêmios de gênero descrevem como o gênero soa, por exemplo Grunge diz guitarras distorcidas dos anos 90 cheias de angústia. As categorias que puxam das mesmas músicas agora também se diferenciam: Música do Ano é sobre a composição, Gravação do Ano sobre a interpretação e a produção, e Balada de Rock e Riff/Solo de Guitarra dizem o que ouvir. As mesmas linhas aparecem na lista de categorias.'],

  'Expand all and Collapse all can skip categories that already have a winner':
    ['Expandir tudo e Recolher tudo podem pular as categorias que já têm vencedor',
     'Em Meus Grammys, os botões Expandir tudo e Recolher tudo agora têm um seletor Todas / Sem vencedor na frente. Em Todas eles agem em todas as categorias, como antes. Em Sem vencedor só abrem ou recolhem as categorias que ainda esperam um vencedor, e deixam as decididas como estão. A escolha fica salva neste dispositivo.'],

  'See how many categories still need a winner, and fold or open them all at once':
    ['Veja quantas categorias ainda precisam de vencedor, e recolha ou abra todas de uma vez',
     'A barra acima das suas categorias de Meus Grammys agora mostra quantas ainda esperam um vencedor, por exemplo 3/12 para decidir. O número diminui conforme você escolhe vencedores e fica dourado quando todas estão decididas. Ao lado ficam os botões Expandir tudo e Recolher tudo, que abrem ou recolhem todos os cartões na tela com um clique.'],

  'Hide categories that already have a winner, or fold any card away':
    ['Oculte as categorias que já têm vencedor, ou recolha qualquer cartão',
     'Meus Grammys ganhou um novo botão Ocultar decididas ao lado do seletor de visualização. Ative-o e todas as categorias que já têm vencedor somem, deixando só as que você ainda precisa votar. O botão mostra quantas está ocultando. Cada cartão de categoria também tem uma pequena seta no canto que o recolhe até mostrar só o nome; outro clique abre de novo. Os cartões recolhidos continuam assim neste dispositivo até você abri-los.'],

  'Contact Support now opens a message form':
    ['Contactar suporte agora abre um formulário de mensagem',
     'O chat de suporte parou de funcionar, então Contactar suporte agora abre um formulário curto: digite seu e-mail e sua mensagem, toque em Enviar e ela chega até nós por e-mail. Respondemos direto para o endereço que você digitou. Se você estiver conectado, seu e-mail já vem preenchido. Funciona no site principal e no guia de configuração.'],

  'Missing covers no longer use up the YouTube search limit':
    ['Capas que faltam não esgotam mais o limite de buscas do YouTube',
     'Quando uma capa não era encontrada no Deezer, iTunes ou Last.fm, o site a buscava no YouTube como última tentativa. Todos os usuários compartilham um pequeno limite diário do YouTube, então um único chart grande com muitas músicas raras podia esgotá-lo em minutos, e as buscas de imagens do YouTube paravam de funcionar pelo resto do dia. Agora as capas são buscadas automaticamente só no Deezer, iTunes e Last.fm. Você ainda pode escolher uma imagem do YouTube à mão no seletor de imagens, e o que já estava no YouTube continua assim.'],

  'My Grammys works again after the Artist stats update':
    ['Meus Grammys voltou a funcionar após a atualização das estatísticas de artistas',
     'Depois da atualização das estatísticas de Artista do Ano, partes de Meus Grammys pararam de funcionar: os resumos das categorias e a lista de vencedores podiam não carregar, e o console se enchia de erros. Duas partes do código tinham o mesmo nome, então uma substituía a outra. Agora elas têm nomes diferentes e tudo volta a carregar.'],

  'Nominee suggestions show all five genres':
    ['Sugestões de indicados mostram os cinco gêneros',
     'Nas categorias de gênero do Meus Grammys, cada indicado sugerido mostrava só os três primeiros gêneros. Agora mostra até cinco, então todos os gêneros da sua Google Sheet (Gênero 1 a Gênero 5) aparecem, assim como as tags do Last.fm ou de um arquivo CSV. Quando uma linha tem muitos gêneros, eles vão para uma segunda linha em vez de apertar o título, o artista ou as reproduções.'],

  'Nominee suggestions are readable on phones':
    ['Sugestões de indicados ficam legíveis no celular',
     'No celular, a lista de indicados sugeridos do Meus Grammys tentava encaixar o título, o artista, as tags de gênero, as reproduções e os botões em uma só linha, e o título ficava tão estreito que aparecia uma letra por linha. Agora o título tem sua própria linha ao lado da capa, e o artista, as tags, as reproduções e os botões ficam nas linhas de baixo.'],

  'Artist of the Year stats show highlights, growth, plaques and records':
    ['As estatísticas de Artista do Ano mostram conquistas, crescimento, placas e recordes',
     'Quando você abre o cartão de estatísticas de um artista no seletor de Artista do Ano, ele agora conta toda a história do artista. Primeiro vêm as conquistas em forma de selos, como um ano de revelação, o maior ano de todos, hits e álbuns #1, hits no top 10, placas novas, sequências longas e a música mais ouvida. Ano a ano mostra uma barra para cada ano desde que você ouviu o artista pela primeira vez, com a posição dele entre os artistas embaixo de cada barra e quanto cresceu ou caiu em relação ao ano anterior. Certificações mostra cada placa que as músicas e álbuns dele ganharam naquele ano, junto com o total de todos os tempos. Recordes que ele tem mostra cada recorde dele na sua aba de Recordes, com medalhas para o primeiro, segundo e terceiro lugar.'],

  'Award nominee stats are easier to read':
    ['As estatísticas dos indicados ficaram mais fáceis de ler',
     'Quando você escolhe os indicados em Meus Grammys, a linha embaixo de cada sugestão era uma sequência de abreviações como "8 days · 5 wk · 4 mo · peak #1 · 1 wk at #1". Agora são poucas etiquetas curtas em palavras simples, como "#1 por 1 semana", "4 dias seguidos" e "Ouvida em 8 dias", com a mais importante primeiro. O cartão de estatísticas que abre embaixo de cada linha também ficou mais fácil de acompanhar: começa com a posição da música no ano e quantas reproduções ela teve, depois mostra as reproduções por mês com o número em cada barra, em seguida seus hábitos de escuta e, por fim, como ela foi nas suas paradas semanais e mensais.'],

  'Genre awards follow the genres in your Google Sheet':
    ['Os prêmios de gênero seguem os gêneros da sua planilha do Google',
     'Se a sua planilha do Google tem as colunas Genre 1 a Genre 5, os prêmios de gênero de Meus Grammys agora usam essas colunas, então um gênero que você muda na planilha muda quais músicas e álbuns se qualificam. Antes, os gêneros da planilha eram ignorados e cada música pegava as tags do artista no Last.fm, então editá-los não fazia efeito. Uma música usa os gêneros da linha mais recente que tiver algum, e um álbum entra num gênero quando pelo menos metade das músicas marcadas entra. Músicas sem gênero na planilha continuam usando as tags do artista. A grafia também não importa mais: Dance-Pop, dance pop e dancepop contam como o mesmo gênero. Os indicados que você já escolheu continuam como estão, então limpe e escolha de novo os de uma categoria para atualizá-la.'],

  /* ========== SETEMBRO 2026 ========== */

  'Genre awards say what the genre sounds like':
    ['Os prêmios de gênero dizem como o gênero soa',
     'Em Configurar ano, todos os prêmios de gênero tinham a mesma linha, "Pelas tags de gênero do artista". Agora cada um descreve o seu gênero, então Melhor música shoegaze/dream pop diz "Paredes de guitarra enevoadas e vozes suaves e flutuantes" e Melhor música post-punk/new wave diz "Guitarras sombrias e angulosas, baixo marcante e synths frios dos anos 80". Os indicados continuam sendo escolhidos do mesmo jeito.'],

  'Backups work again with big awards collections':
    ['Os backups voltam a funcionar com premiações grandes',
     'Quando suas premiações passavam de certo tamanho, os backups em Configurações → Perfil paravam de ser salvos sem aviso, porque o backup inteiro não cabia mais em uma só parte. Agora os backups grandes são divididos em várias partes e remontados na restauração, então voltam a ser salvos não importa quantas categorias você tenha. Os backups antigos continuam sendo restaurados como antes.'],

  'Play samples from My Grammys nominee cards':
    ['Toque prévias pelos cartões de indicados do Meus Grammys',
     'Configurar ano tem um novo botão, Tocar prévias pelos cartões de indicados. Com ele ligado, cada indicado ganha um botão ♪ que toca uma prévia de 30 segundos, para você ouvir os candidatos antes de escolher o vencedor. Clique de novo para parar. Funciona nas cinco visualizações, e clicar no ♪ nunca coroa o indicado. Começa desligado, vale para todos os anos e sincroniza entre seus dispositivos.'],

  'Show your scores on My Grammys nominee cards':
    ['Mostre suas notas nos cartões de indicados do Meus Grammys',
     'Configurar ano tem um novo botão, Mostrar minhas notas nos cartões de indicados. Com ele ligado, cada indicado que você avaliou mostra sua nota de 0 a 10 ao lado, nas cinco visualizações. Músicas e álbuns sem nota não mostram nada, e artistas usam a média dos álbuns avaliados. Começa desligado, vale para todos os anos e sincroniza entre seus dispositivos.'],

  'Hide plays on My Grammys nominee cards':
    ['Ocultar reproduções nos cartões de indicados de Meus Grammys',
     'Configurar Ano tem um novo botão, Ocultar reproduções nos cartões de indicados. Com ele ligado, os cartões de indicados param de mostrar o número de reproduções, para que a votação seja sobre as suas escolhas e não sobre os números. O seletor de indicados continua mostrando as reproduções e as sugestões funcionam igual. A configuração vale para todos os anos e sincroniza entre seus dispositivos.'],

  'Most Viral Song is now Favorite Viral Song':
    ['Música mais Viral agora é Música Viral Favorita',
     'O prêmio Música mais Viral de Meus Grammys agora se chama Música Viral Favorita. Os indicados e vencedores que você já escolheu continuam salvos.'],

  'Best Collaboration suggests real team-ups, not duets':
    ['Melhor Colaboração sugere parcerias de verdade, não duetos',
     'Gerar Indicados sugeria para Melhor Colaboração qualquer música com dois ou mais artistas, então os duetos apareciam ali e também em Melhor Dupla. Agora sugere parcerias em que só um canta porque o outro é DJ ou produtor (David Guetta, Tiësto, benny blanco), e músicas em que um dos artistas é um grupo ou banda. Cada artista é conferido no MusicBrainz, e cada indicado diz por que entrou ("with a DJ/producer" ou "with a group"). Na primeira vez pode levar até um minuto, porque o MusicBrainz permite uma consulta por segundo; as respostas ficam salvas neste navegador, então depois leva segundos. Você ainda pode adicionar qualquer música à mão. Também corrigido: um nome de banda com "&", como Simon & Garfunkel, não é mais separado em dois artistas.'],

  'Goth Rock song and album awards':
    ['Prêmios de Música e Álbum de Rock Gótico',
     'Meus Grammys tem duas categorias novas de rock, Melhor Música de Rock Gótico e Melhor Álbum de Rock Gótico, desativadas por padrão e no grupo Rock de Configurar Ano. Elas contam artistas marcados como rock gótico, deathrock, darkwave ou metal gótico. As primeiras bandas góticas marcadas como post-punk ainda podem ser indicadas em Post-Punk/New Wave também.'],

  '16 rock award categories and a Rock group in Configure Year':
    ['16 categorias de rock e um grupo Rock em Configurar Ano',
     'Meus Grammys tem 16 categorias novas de rock, todas desativadas por padrão. Músicas: Pop/Rock, Pop-Punk, Indie Rock, Rock Clássico, Hard Rock, Post-Punk/New Wave, Grunge/Alternativa dos Anos 90 e Shoegaze/Dream Pop. Álbuns: Indie Rock, Metal, Punk/Emo e Rock Progressivo/Psicodélico. Para a cerimônia: Melhor Performance de Rock, Melhor Balada de Rock e Melhor Riff/Solo de Guitarra, escolhidos por você entre as músicas de rock do ano, e Melhor Música de Rock de Dupla/Grupo, músicas de rock de bandas e duplas (o MusicBrainz diferencia bandas de artistas solo). Melhor Música Metal/Hard Rock agora é Melhor Música Metal, já que o hard rock tem seu próprio prêmio. Todos os prêmios de rock, antigos e novos, agora ficam juntos num grupo Rock na lista de Configurar Ano.'],

  'Configure Year: search, filter and browse the award categories':
    ['Configurar Ano: busque, filtre e navegue pelas categorias',
     'A lista de categorias em Configurar Ano ficou mais fácil de percorrer. Digite na busca para achar uma categoria pelo nome ou pelo assunto ("rock", "álbum", "cover"). Filtre por categorias de músicas, álbuns ou artistas, ou pelas ativas ou inativas, e use os chips para ver um grupo de cada vez. As categorias estão agrupadas em Prêmios principais, Gêneros, Álbuns e formatos, Tipos de música, Como você ouve, Por diversão e Prêmios de estatísticas, cada grupo com seu próprio Ativar / Desativar. Cada categoria agora é um cartão com uma linha explicando em que se baseia e um interruptor. Ativar tudo e Desativar tudo agem sobre o que está visível, então buscar "rock" e tocar em Ativar as visíveis liga todos os prêmios de rock de uma vez.'],

  '22 new award categories, and Most Growth shows the change on the year before':
    ['22 categorias de prêmios novas, e Maior Crescimento mostra a mudança em relação ao ano anterior',
     'Meus Grammys tem 22 categorias novas, todas desativadas por padrão: ative-as em Configurar Ano. Gêneros novos: músicas Indie Pop, Metal/Hard Rock, Punk/Emo, Afrobeats e J-Pop/Anime, e álbuns de Jazz e Clássico/Instrumental. Formatos de álbum: Melhor EP, Melhor Álbum ao Vivo, Melhor Álbum de Estreia (o primeiro álbum de um artista na sua biblioteca, lançado este ano ou no anterior), Melhor Reedição/Remasterização e Melhor Coletânea/Grandes Sucessos. Tipos de música: Melhor Cover e Melhor Versão Acústica (identificadas pelo título), Melhor Throwback (álbuns lançados há 10 anos ou mais), Melhor Faixa Escondida (faixas de álbum que você nunca ouviu como single) e Melhor Música de Término. Pelo jeito que você ouve: Melhor Música da Noite (das 22h às 4h), Melhor Música da Manhã (das 5h às 11h) e Artista mais Fiel (ouvido todo mês). Por diversão: Prazer Culpado do Ano, e Música mais Subestimada, que usa a popularidade no Deezer para achar músicas que você amou e que poucos ouvem. Maior Crescimento agora mostra a mudança de cada indicado em relação ao ano anterior, em porcentagem e em reproduções, nos cartões e na janela de escolher indicados. Também não deixa mais de contar as reproduções do último dia do ano anterior.'],

  'Folk/Acoustic, Singer-Songwriter and Deluxe Album awards':
    ['Prêmios Folk/Acústico, Cantor-Compositor e Álbum Deluxe',
     'Meus Grammys tem cinco categorias novas, todas desativadas por padrão: ative-as em Configurar Ano. Melhor Música Folk/Acústica e Melhor Álbum Folk/Acústico cobrem artistas de folk-pop e acústicos, e Melhor Música de Cantor-Compositor é mais ampla, para compositores acústicos e de piano que não estão marcados como folk. Melhor Álbum Deluxe e Melhor Capa de Álbum Deluxe são para edições deluxe, expandidas, de aniversário e outras especiais, identificadas pelo título do álbum ("Deluxe", ou um "… Edition" entre parênteses). Uma edição deluxe que não diz isso no título ainda pode ser escolhida à mão.'],

  'Most Viral Song award, and Album You Discovered Late is now Best Album Discovered Late':
    ['Prêmio de Música mais Viral, e Álbum que Você Descobriu Tarde agora é Melhor Álbum Descoberto Tarde',
     'Meus Grammys tem uma nova categoria, Música mais Viral, desligada por padrão: ligue em Configurar Ano e escolha seus indicados entre as músicas que você mais ouviu naquele ano. A categoria Álbum que Você Descobriu Tarde agora se chama Melhor Álbum Descoberto Tarde, com as mesmas regras de antes.'],

  'Reorder the nominees right on the category cards':
    ['Reordene os indicados direto nos cartões de categoria',
     'A ordem dos indicados em um cartão de categoria de Meus Grammys, que também é a ordem que a cerimônia segue, agora pode ser mudada no próprio cartão em vez de na janela de escolher indicados. Com o mouse, arraste um indicado para o lugar de outro, em qualquer visualização. No celular ou pelo teclado, toque em Reordenar no pé do cartão para ter botões de seta em cada indicado, e em Pronto quando terminar. Enquanto Reordenar estiver ligado, clicar em um indicado não coroa ele.'],

  'Year stats for every candidate when picking Song, Album and Artist of the Year':
    ['Estatísticas do ano de cada candidato ao escolher Música, Álbum e Artista do Ano',
     'Ao escolher indicados para Música do Ano, Álbum do Ano ou Artista do Ano, cada linha agora mostra como foi o ano dele: a maior sequência de dias seguidos, em quantos dias, semanas e meses você ouviu, a melhor posição na parada semanal e as semanas em #1, e o dia com mais reproduções. O botão Stats abre todo o resto: a posição do ano por reproduções e a fatia do seu total, a maior sequência semanal, o melhor dia, semana e mês, a primeira e a última reprodução, quantas músicas e álbuns de um artista você ouviu ou quantas faixas de um álbum, os recordes nas paradas semanais e mensais, e uma barra para cada mês. Você também pode ordenar a lista por maior sequência, mais dias ouvido, melhor dia, mais semanas em #1 ou melhor posição. Tudo conta só as reproduções dentro do período de elegibilidade daquele ano.'],

  'Change the picture of any nominee in My Grammys':
    ['Troque a imagem de qualquer indicado em Meus Grammys',
     'Cada imagem das visualizações Destaque, Blocos, Colagem e Carrossel, e cada miniatura da janela de escolher indicados, agora tem o mesmo seletor de imagem das paradas: passe o cursor por cima e clique no lápis, ou mantenha pressionada no celular. Clicar no lápis nunca coroa nem adiciona o indicado. A imagem que você escolher é usada para essa música, álbum ou artista no app inteiro e fica salva na sua conta.'],

  'New ways to view the nominees in My Grammys':
    ['Novas formas de ver os indicados em Meus Grammys',
     'Os cartões de categoria de Meus Grammys agora podem ser mostrados de cinco jeitos, pelo seletor Visualização logo acima: Cédula, a lista de texto de sempre; Destaque, com o vencedor em tamanho grande sobre um desfoque da imagem dele e os outros indicados em linhas com imagem e reproduções; Blocos, uma grade de capas e fotos de artistas; Colagem, um mosaico com todos os indicados e o vencedor em tamanho dobrado; e Carrossel, uma linha de largura total por categoria com os indicados como pôsteres que rolam para o lado. Clicar em um indicado continua coroando ele em todas as visualizações, e os botões Alterar e Playlist continuam lá. As imagens que você escolheu para uma música, artista ou álbum também aparecem aqui, e a visualização escolhida fica salva naquele dispositivo.'],

  'Pick the picture in song, artist and album profiles, saved to your account':
    ['Escolha a imagem nos perfis de músicas, artistas e álbuns, salva na sua conta',
     'A imagem no topo do perfil de uma música, artista ou álbum agora tem o mesmo seletor das paradas: passe o cursor sobre ela e clique no lápis, ou mantenha pressionado no celular. Uma imagem que você escolher ali também aparece ao lado dessa música, artista ou álbum nas paradas, e vice-versa. As imagens escolhidas agora também são salvas na sua conta, então acompanham você nos seus outros dispositivos, e voltar uma para automático também é sincronizado. Uma imagem que você enviou do seu dispositivo fica só nele.'],

  'Easier-to-read score chips in the light themes':
    ['Etiquetas de nota mais fáceis de ler nos temas claros',
     'Nos temas claros, algumas etiquetas de nota ao lado de músicas e álbuns ainda eram difíceis de ler, principalmente as douradas de Masterpiece e as verdes de Essential nas linhas coloridas do topo de uma parada. Agora todas as cores de nota ficaram um pouco mais fortes nos temas claros, então cada uma é fácil de ler em qualquer linha, e os anéis e barras de nota combinam. As cores mantêm a ordem da melhor para a pior, e os temas escuros continuam iguais.'],

  'Readable rating and medal colours in the light themes':
    ['Cores de avaliações e medalhas legíveis nos temas claros',
     'Nos temas claros, as cores das avaliações eram as dos temas escuros, então Masterpiece, o anel de nota e as etiquetas de nota apareciam em amarelo brilhante sobre branco, e as outras cores de nota também eram pálidas. Agora elas usam as cores mais escuras de cada tema claro. Os números de pico em ouro, prata e bronze nos perfis de músicas, artistas e álbuns, e os números de música mais ouvida de todos os tempos e do ano, também ganharam versões mais escuras e fáceis de ler. Os temas escuros continuam iguais.'],

  'Song and artist profiles say which chart each stat is from':
    ['Os perfis de músicas e artistas dizem de qual parada é cada dado',
     'O cartão de estreia no perfil de uma música agora diz de qual parada se trata, por exemplo Weekly Chart Debut · Week of Sep 20, 26 ou Monthly Chart Debut · Sep 2026. Ele mostra a estreia na parada de onde você abriu a música, ou na semanal se você a abrir pela parada de todos os tempos. Antes ele misturava as paradas semanal, mensal e anual e podia mostrar uma estreia mensal como se fosse uma data. Semanas, meses e anos na parada, reentradas e tempo no #1 agora também dizem a sua parada, nos perfis de músicas e de artistas.'],

  'Click a name in the Songs and Albums charts to open it':
    ['Clique em um nome nas paradas de Músicas e Álbuns para abri-lo',
     'Nas paradas de Músicas e Álbuns, o título da música, o título do álbum e o nome do artista agora são links. Clique em uma música ou álbum para abrir o perfil dele, ou no artista para abrir o dele. Quando uma música credita mais de um artista, cada nome é um link próprio. Various Artists nos álbuns de coletânea continua como texto normal, já que não tem perfil próprio. Os nomes têm a mesma aparência de antes até você passar o cursor sobre eles.'],

  'Easier-to-read gold in the light themes':
    ['Dourado mais fácil de ler nos temas claros',
     'Nos temas claros, o dourado brilhante do seletor de indicados quase não aparecia sobre o fundo branco: a linha do ano e da categoria no topo, os números de posição dos seus indicados e as marcas das linhas escolhidas. Agora eles usam um dourado mais profundo, fácil de ler, e o vermelho dos botões de remover também ficou mais escuro. Os selos de Venceu nos prêmios reais e o botão Compartilhar da cerimônia receberam a mesma correção. Os temas escuros continuam iguais.'],

  'A roomier nominee picker':
    ['Um seletor de indicados mais espaçoso',
     'A janela onde você escolhe os indicados de um prêmio ficou mais espaçosa. Seus indicados escolhidos agora ficam em um painel próprio de Indicados no topo, como cartões iguais em duas colunas, cada um com uma imagem maior e o nome e o artista em linhas separadas, então títulos longos não são mais cortados depois de poucas letras. Uma lista completa de 8 cabe sem rolar. Preencher top 8, Top 5 e Limpar foram para esse painel, ao lado de um contador de quantos você escolheu. Arraste os cartões para reordená-los, como antes. No celular os cartões ficam em uma coluna.'],

  'Break ties in the automatic awards yourself':
    ['Desempate você mesmo os prêmios automáticos',
     'Quando um prêmio automático como Música Mais Ouvida ou Maior Sequência Diária termina empatado, o cartão do prêmio agora mostra tudo o que empatou em primeiro lugar abaixo do vencedor. Clique em um para torná-lo o vencedor, e mude de ideia quantas vezes quiser. Sua escolha é mantida quando você gera os prêmios de novo, desde que esse item continue empatado em primeiro. Antes, o prêmio ia sem aviso para o item empatado que aparecesse primeiro. Anos gerados antes desta mudança precisam de um novo Gerar para os empates aparecerem.'],

  'See and hear every nominee while you pick them':
    ['Veja e ouça cada indicado enquanto você escolhe',
     'Ao escolher os indicados de qualquer prêmio, cada linha e cada indicado escolhido agora mostra a arte da música, a capa do álbum ou a foto do artista, para a lista ser entendida de relance. As imagens carregam conforme aparecem na rolagem. Todas as categorias, exceto Vídeo do Ano, também ganham um botão ♪ que toca uma amostra de 30 segundos e um botão do YouTube que abre uma busca em uma nova aba. Para um artista, a amostra é uma das suas músicas mais conhecidas. Clicar em qualquer um dos botões não indica nada; clicar na linha, sim. Vídeo do Ano mantém o próprio botão de vídeo.'],

  'Compare album covers at a glance when picking Best Album Cover':
    ['Compare as capas de relance ao escolher a Melhor Capa de Álbum',
     'O seletor de Melhor Capa de Álbum agora mostra uma capa pequena ao lado de cada álbum, para você compará-las sem abrir uma por uma. O botão ⤢ de uma linha mostra essa capa no maior tamanho que cabe no seletor. Clicar em ⤢ não indica o álbum; clicar na linha, sim. Melhor Conceito de Álbum mantém o botão i com o texto e a lista de faixas.'],

  'See what an album is about when picking Best Album Concept':
    ['Veja do que se trata um álbum ao escolher o Melhor Conceito de Álbum',
     'Ao escolher os indicados de Melhor Conceito de Álbum, cada álbum tem um botão i. Ele mostra a capa em tamanho grande, o breve texto do Last.fm sobre o álbum, que costuma explicar a história ou o tema, e a lista de faixas com quantas vezes você ouviu cada música naquele ano. Músicas que você ouviu e não estão na lista padrão, como faixas bônus, aparecem no final. Clicar em i não indica o álbum; clicar na linha, sim.'],

  'Watch a bit of each video when picking Video of the Year':
    ['Assista a um pouco de cada vídeo ao escolher o Vídeo do Ano',
     'Ao escolher os indicados de Vídeo do Ano, cada música tem um botão ▶. Ele encontra o clipe no YouTube e toca numa janelinha no topo do seletor, para você lembrar como é o vídeo antes de indicá-lo. Clicar em ▶ não indica a música; clicar na linha, sim. Aperte ■ ou ✕ para fechar o vídeo, e se o YouTube achou o vídeo errado, um link abre a busca no YouTube.'],

  'The setup guide is now fully in Spanish and Portuguese':
    ['O guia de configuração agora está todo em espanhol e português',
     'No guia de configuração, só o menu de idioma mudava; cada passo, dica e resposta de solução de problemas continuava em inglês. Agora o guia inteiro segue o idioma que você escolher, em espanhol, português do Brasil e português europeu, incluindo os botões e o progresso do passo a passo. Os menus e botões do próprio Google aparecem com os nomes que o Google mostra no seu idioma. Os botões da janela de Configurações do dankcharts mantêm os nomes em inglês, porque essa janela ainda está em inglês.'],

  'Albums, Singles, EPs and All now keep their side charts in step':
    ['Álbuns, Singles, EPs e Todos agora mantêm as seções laterais em sintonia',
     'Com singles ou EPs em paradas próprias, Fora da Parada podia listar um lançamento que ainda estava na parada, porque contava a semana sem as reproduções que um single empresta ao seu álbum. Fora da Parada, Quase no Top, Novas Entradas, as etiquetas PEAK, a animação da parada e as caixas do histórico agora contam tudo do mesmo jeito que a parada acima delas. Na visão Todos elas seguem a parada combinada, e em Álbuns, Singles ou EPs cada uma segue a sua. Faixas sem álbum também deixam de ocupar posições ocultas na parada de álbuns da semana passada.'],

  'Switching phones no longer wipes your nominations':
    ['Trocar de celular não apaga mais suas indicações',
     'Um celular que tinha ficado aberto com uma cópia antiga dos seus prêmios salvava essa cópia velha por cima dos indicados que você tinha escolhido depois em outro celular. Agora cada salvamento verifica antes se há mudanças mais recentes, mantém essas mudanças e acrescenta as suas por cima. A página de prêmios também se atualiza com seus outros dispositivos quando você volta ao app.'],

  'Backups you can restore from Settings':
    ['Backups que você pode restaurar nas Configurações',
     'Suas configurações, prêmios e avaliações são copiados para a sua conta uma vez por dia, e os prêmios também sempre que outro dispositivo os altera. Configurações → Perfil lista os últimos 30 backups, e qualquer um deles pode ser restaurado em todos os dispositivos com um clique. Você também pode fazer um backup manualmente ou baixar um arquivo de backup para guardar, por exemplo no Google Drive.'],

  'Clearer record cards in the awards summary':
    ['Cartões de recordes mais claros no resumo dos prêmios',
     'Os cartões de mais indicações e mais vitórias de todos os tempos agora parecem uma corrida: o dono do recorde no topo com um número maior, e os perseguidores em linhas numeradas próprias, com uma barra mostrando o quanto chegaram perto, em texto maior e mais brilhante. Músicas e álbuns também mostram o artista ao lado de cada perseguidor. A setinha embaixo do seletor de ano agora só aparece ao passar o mouse.'],

  'Jump straight to any year on the awards page':
    ['Vá direto para qualquer ano na página de prêmios',
     'Clique no ano para abrir uma grade de anos e escolher um, em vez de avançar um a um com as setas. Meus Grammys vai até o ano da sua primeira reprodução, e as setas ficam desativadas nas pontas. Prêmios Reais ganha o mesmo seletor, até a primeira cerimônia, em 1959. A lista de indicações no resumo dos prêmios também escreve “indicações” por extenso em vez de “ind.”.'],

  'Fresher year picker and buttons on the awards page':
    ['Seletor de ano e botões renovados na página de prêmios',
     'O ano e as setas agora ficam juntos em um único controle arredondado, com setas limpas, tanto em Meus Grammys quanto em Prêmios Reais. Configurar Ano virou um botão claro com contorno e ícone de configurações, e Gerar Indicados é um botão sólido na cor do seu tema, com ícone de brilho e um leve halo.'],

  'Easier-to-read nominations list in the awards summary':
    ['Lista de indicações mais fácil de ler no resumo dos prêmios',
     'Na lista "Mais indicações", a barra agora fica logo abaixo do nome de cada artista, então os números não ficam mais isolados do outro lado de um espaço vazio. O número de indicações está maior e em negrito, e as vitórias aparecem como uma pílula dourada com troféu.'],

  'Records tab works again for libraries with compilations':
    ['A aba Recordes volta a funcionar em bibliotecas com coletâneas',
     'Em algumas bibliotecas, a aba Recordes ficava vazia e só pedia para carregar seus dados. Isso acontecia quando um single que você ouviu conta para uma coletânea de Vários Artistas: o cálculo tropeçava nesse álbum e parava antes de mostrar qualquer recorde. As coletâneas agora são preparadas corretamente em qualquer caso, então todas as seções de recordes voltam a ser preenchidas.'],

  'Send any playlist to Soundiiz as text':
    ['Envie qualquer playlist para o Soundiiz como texto',
     'A janela Adicionar à playlist agora tem a opção Copiar como texto para o Soundiiz, abaixo de Nova playlist. Ela abre a mesma janela Exportar playlist que as paradas usam, já preenchida com essas músicas: uma linha Artista - Título por música para copiar (com o álbum, se quiser), um .txt ou .csv para baixar, sugestões de nome de playlist para copiar e os passos para importar no Soundiiz, que então monta a playlist no Spotify, Apple Music, YouTube Music, Deezer e outros. Funciona em todos os botões ♫ Playlist do app, inclusive o novo das categorias de Meus Grammys, para que os indicados de uma categoria vão direto para o seu serviço de streaming. Copiar um nome sugerido com apóstrofo também funciona direito agora.'],

  'Make a playlist of a category’s nominees':
    ['Crie uma playlist com os indicados de uma categoria',
     'Toda categoria de Meus Grammys com indicados agora tem um botão ♫ Playlist ao lado de Alterar. Ele coloca todos os concorrentes numa playlist, nova ou existente, para você ouvir todos antes de coroar um vencedor. Um indicado que é música entra sozinho. Um álbum adiciona todas as músicas dele que você ouviu no período de elegibilidade daquele ano, da mais ouvida para a menos. Um artista adiciona suas cinco músicas mais ouvidas no período. Categorias concedidas automaticamente não têm o botão, já que não há nada para decidir. Funciona igual para bibliotecas do Last.fm, Google Sheets e CSV.'],

  'Award credit for collaborating artists, now in Settings too':
    ['Crédito de prêmios para artistas colaboradores, agora também nas Configurações',
     'A chave que faz as indicações e vitórias de Meus Grammys contarem para todos os artistas de uma gravação agora também está nas Configurações, em Paradas → Comportamento, como Prêmios contam para artistas convidados e colaboradores. Antes ela só ficava em Configurar Ano, onde era fácil de passar despercebida. As duas chaves ficam sincronizadas e valem na hora. Com ela ligada, colaborações escritas com &, x, and ou vs (como Lady Gaga & Bruno Mars) agora também dão crédito a cada artista. Isso só acontece quando todos os nomes do crédito também são artistas próprios na sua biblioteca, então duplas como Simon & Garfunkel continuam contando como um só nome.'],

  'The ceremony’s final stats show who won the most':
    ['As estatísticas finais da cerimônia mostram quem ganhou mais',
     'No fim da cerimônia os resultados já saíram, então as estatísticas finais agora terminam com Mais vitórias do ano, em vez de um ranking de indicações. Cada artista que venceu ganha um bloco próprio com foto, número de vitórias e indicações e todos os prêmios que levou para casa: um troféu, a capa da música ou do álbum (ou a foto do artista, nos prêmios de artista), o nome da música ou do álbum e o nome do prêmio. Quando artistas convidados são contados, uma vitória como convidado também mostra o artista principal. Links compartilhados da cerimônia mostram isso depois de Atualizar link. O ranking de indicações na página de Meus Grammys também ficou alinhado: as barras começavam em pontos diferentes nas linhas com e sem contagem de troféus.'],

  'Final stats at the end of the ceremony, and credit for featured artists':
    ['Estatísticas finais no fim da cerimônia, e crédito para artistas convidados',
     'A chamada final da cerimônia agora termina com Estatísticas finais e recordes: os líderes de todos os tempos em indicações e vitórias, já contando os resultados deste ano, e o ranking final de indicações do ano com as vitórias de cada artista. Todo recorde que mudou de dono durante a cerimônia é marcado como Novo. Links compartilhados da cerimônia também incluem isso, depois de você apertar Atualizar link. Uma nova chave Contar artistas convidados em Configurar Ano faz uma indicação ou vitória contar para todos os participantes, não só para o artista principal. Ela lê os convidados no nome do artista (feat., ft., featuring, with ou uma lista com vírgulas) e no título da música, como em (feat. A & B). Duplas escritas com & continuam sendo um só nome. Vale para as estatísticas e recordes de todos os anos e para a contagem de Grammys nas páginas de artista, e sincroniza entre seus dispositivos. Funciona igual para bibliotecas do Last.fm, Google Sheets e CSV.'],

  'Stats & records at the top of every My Grammys year':
    ['Estatísticas e recordes no topo de cada ano de Meus Grammys',
     'Cada ano de Meus Grammys agora abre com um resumo acima dos indicados. Ele mostra os líderes de todos os tempos em indicações e em vitórias para artistas, álbuns e músicas, contados até aquele ano — então voltar a um ano anterior mostra os recordes como estavam na época, com os dois seguintes abaixo de cada líder. Abaixo vem o ranking do ano com os artistas mais indicados e suas vitórias. Cada dono de recorde e cada artista do ranking tem sua foto ou capa. A cerimônia abre com o mesmo resumo como primeiro slide, antes da primeira categoria. Ali ficam de fora as vitórias deste ano e as categorias automáticas, para não entregar nada antes de um envelope ser aberto. Links compartilhados da cerimônia também trazem o resumo. Um artista recebe crédito pelas suas músicas e álbuns, além das categorias de artista. Funciona igual para bibliotecas do Last.fm, Google Sheets e CSV.'],

  'Share your awards ceremony with a link':
    ['Compartilhe sua cerimônia de prêmios com um link',
     'Um novo botão Compartilhar fica ao lado de Ver cerimônia. Ele cria um link que qualquer pessoa pode abrir para assistir à sua cerimônia — os indicados com suas capas, os envelopes lacrados, a revelação dos vencedores com trechos das músicas e a chamada final — sem conta e sem dados musicais próprios. Seu nome aparece se você tiver definido um nome de exibição. Só a cerimônia é compartilhada: os indicados, os vencedores e as imagens deles, nada mais da sua biblioteca. O link é um retrato do momento, então depois de mudar indicados ou vencedores aperte Atualizar link, e o link que você já enviou mostra a nova versão. Parar de compartilhar tira o link do ar para todos. Criar um link exige entrar com o Google, para que só você possa atualizá-lo ou removê-lo. Funciona igual para bibliotecas do Last.fm, Google Sheets e CSV.'],

  'Share Your Soundtrack rebuilt on the same five-design system':
    ['Compartilhar Sua Trilha Sonora refeito com o mesmo sistema de cinco designs',
     'O cartão de compartilhamento da Trilha Sonora era o último ainda na receita antiga: um único layout fixo de 360 pixels, tudo na fonte monoespaçada pequena, um índigo fixo que ignorava o tema que você estivesse usando, nenhuma imagem e — na versão alta — um terço da figura vazio abaixo da última música. Agora ele funciona exatamente como as imagens da parada, do histórico e de uma entrada. Escolha um design: Recap (um cabeçalho sobre os blocos de estatísticas com os dois top cinco embaixo, lado a lado no formato quadrado), Wrapped (seu artista nº 1 como um grande retrato redondo com o número de reproduções, e depois as músicas), Collage (só rostos e capas, em ordem), Minimal (sem imagens, os números seguram tudo) ou Poster (seu artista nº 1 desfocado atrás do cartão inteiro). Escolha uma paleta: Tema do app segue o tema que você estiver usando, Onyx, Aurora, Ember, Bloom, Moss e Paper ficam fixas, e Capa lê as cores das imagens e monta o cartão com elas. Escolha um formato: Post 1:1, Retrato 4:5 ou Story 9:16. Artistas e músicas agora trazem suas imagens, vindas do Deezer, iTunes, Last.fm ou YouTube, e as listas se esticam para preencher o cartão em vez de pararem no meio. Novas descobertas e seu dia de pico se juntam a reproduções, dias ativos e artistas na linha de estatísticas; você pode mostrar ou esconder qualquer item, escolher entre três e dez entradas e ajustar um único controle de tamanho do texto. Tudo fica agora numa janela de pré-visualização de verdade, com os botões Copiar e Compartilhar ao lado de Baixar.'],

  'The Soundtrack image is four times the resolution':
    ['A imagem da Trilha Sonora tem quatro vezes mais resolução',
     'Ela era desenhada em 360 pixels e dobrada na exportação, e por isso o texto parecia borrado assim que era aberto num celular. Agora ela é montada nos 1080 completos e exportada em 2160 por padrão, com a opção Padrão se você preferir um arquivo menor. As imagens são pedidas no maior tamanho que cada loja oferece, e as fontes ganham tempo para carregar antes da imagem ser gerada.'],

  'Share images rebuilt: twelve designs, eight palettes, three shapes':
    ['Imagens de compartilhamento refeitas: doze designs, oito paletas, três formatos',
     'As imagens de compartilhamento tinham virado um layout rígido por cartão com uma parede de controles deslizantes ao lado — onze para uma parada, mais onze para uma entrada — e toda imagem saía com a mesma cara: uma barra de cabeçalho em degradê, linhas listradas, texto minúsculo e um monte de caixas. Os três tipos de cartão foram redesenhados do zero e agora começam por um design que você escolhe, em vez de um tamanho que você ajusta. Uma parada pode ser Editorial (um cabeçalho de revista sobre linhas arejadas com fios finos), Minimal (só texto, sem imagens, o máximo de respiro), Spotlight (o nº 1 ampliado com sua capa e o resto embaixo), Grid (só capas, em ordem, dimensionadas para preencher o cartão) ou Poster (a capa do nº 1 desfocada atrás de tudo). Um histórico pode ser Timeline — o histórico desenhado como uma linha real de posição ao longo do tempo, com o pico marcado em dourado e os intervalos deixados como intervalos, para que uma reentrada não pareça uma sequência contínua —, Chips (as caixinhas antigas, reajustadas) ou uma Ficha de estatísticas. Uma única entrada pode ser Cover (a capa ocupando tudo, com a posição em grande na parte de baixo), Split, Frame ou Ticket. Ao lado do design fica uma paleta: Tema do app segue o tema que você estiver usando, depois Onyx, Aurora, Ember, Bloom, Moss e Paper ficam fixas seja qual for o tema do app, e Capa lê as cores da própria imagem e monta o cartão em volta delas. Há um novo tamanho Retrato 4:5 ao lado de Post e Story, já que 4:5 é o formato mais alto que um post no feed mantém. Tudo o que você podia ajustar antes continua lá — o que mostrar e esconder, de qual loja vêm as imagens, quantas entradas, e um único controle de Tamanho do texto no lugar dos deslizantes antigos — e o painel do histórico ganhou os botões Copiar e Compartilhar, como o da parada.'],

  'Shared images are four times the resolution':
    ['Imagens compartilhadas têm quatro vezes mais resolução',
     'Os cartões eram montados com 540 pixels de largura e dobrados na exportação, o que colocava uma imagem de 1080 px no Instagram e deixava o texto borrado assim que alguém dava zoom. Agora eles são montados nos 1080 completos e exportados em 2160 por padrão, com a opção Padrão se você quiser um arquivo menor. As capas são pedidas no maior tamanho que cada loja oferece, em vez da miniatura de 300 px que a busca devolve, então as imagens aguentam o tamanho maior, e as fontes ganham tempo para carregar antes da imagem ser gerada, para nada sair numa fonte substituta.'],

  'New My Grammys category: Best Album Concept':
    ['Nova categoria em Meus Grammys: Melhor Conceito de Álbum',
     'Melhor Capa de Álbum já permitia premiar a capa; não havia nada para o disco por trás dela — o álbum construído como uma única ideia, e não como um conjunto de músicas. Melhor Conceito de Álbum é uma nova categoria de álbum na cédula de Meus Grammys, desligada por padrão como as outras opcionais; ative-a na lista de categorias de um ano e ela aparece com todos os concorrentes para escolher e um slide próprio na cerimônia. Qualquer álbum que você ouviu no período de elegibilidade daquele ano pode ser indicado.'],

  'Remixes and stylised artist names find their preview again':
    ['Remixes e nomes de artista estilizados voltam a encontrar seu trecho',
     'Conferir se um trecho era mesmo a gravação certa impediu a cerimônia de tocar a música errada, mas também a deixou muda em faixas que ela deveria encontrar. JOYRIDE. - Revved Up Remix, da Kesha, mostrava “nenhum trecho encontrado” mesmo com o remix disponível no streaming: a loja o cataloga como “Ke$ha”, e tirar o cifrão deixava um nome que não batia com nada. Grafias estilizadas agora são lidas como as letras que representam, então Ke$ha, P!nk, A$AP e MØ batem com os nomes que você tem. A busca também desiste menos. As duas lojas filtram por cada palavra recebida, então o nome de um remix que elas não conhecem não devolve nada — nem a música a que ele pertence. Agora a busca tira a versão e depois os créditos de convidados até aparecer algo, o que encontra a gravação original quando um remix específico realmente não existe lá. O nome da gravação é mostrado sempre que não for exatamente o título do próprio indicado, para que um substituto nunca entre escondido, e os créditos agora são comparados como um conjunto de nomes, então a edição que lista todos os artistas vence a que cita só o principal. Todos os remixes testados numa categoria de Melhor Remix — Kesha, The Weeknd, Tate McRae, Taylor Swift, Alex Warren, Selena Gomez — agora encontram o próprio remix, em vez do original ou de nada.'],

  'The ceremony plays the right song now, not a remix or a karaoke cover':
    ['A cerimônia agora toca a música certa, e não um remix ou um karaokê',
     'O trecho de 30 segundos pegava o que as lojas de música devolviam primeiro, sem nunca conferir se era a gravação certa — e o primeiro resultado muitas vezes está errado. Buscar The Fate of Ophelia, da Taylor Swift, trazia primeiro o remix dos Chainsmokers e em segundo um comentário falado “Track by Track”, com a música de verdade em terceiro, então a cerimônia anunciava o vencedor e tocava um remix, ou alguém falando. Covers de bandas tributo e quartetos de cordas, versões karaokê e gravações ao vivo também aparecem bem no alto, e um indicado que é ele mesmo um remix recebia o original. Agora cada resultado é conferido contra o indicado antes de tocar: o artista precisa bater, o título precisa bater, e uma versão remix, ao vivo ou acústica só toca se for isso que o indicado realmente é. Quando nada bate com segurança, o player fica em silêncio e avisa, porque silêncio é melhor do que a música errada na hora em que o envelope é aberto. O player também mostra o nome da gravação que encontrou, então uma correspondência ruim fica óbvia em vez de só confusa, e quando existe mais de uma versão plausível um botãozinho ao lado toca a próxima melhor opção. O Deezer agora também é um plano B de verdade — a pergunta era feita a ele, mas a resposta nunca era lida, então o que a primeira loja não tinha simplesmente não tocava.'],

  'The ceremony no longer gives away the winner of the automatic awards':
    ['A cerimônia não entrega mais o vencedor dos prêmios automáticos',
     'As categorias automáticas — Música mais ouvida, Maior sequência diária de um álbum, Artista com mais dias ouvido e as demais — não são votadas: não têm concorrentes, só o nome que suas reproduções já decidiram. A cerimônia não sabia disso e mostrava esse único nome como cartão de indicado acima do envelope, então cada uma dessas categorias revelava a resposta antes de você abrir qualquer coisa, o que tirava todo o suspense da reta final do show. Esses slides agora mostram um cartão lacrado em branco e uma linha explicando que não há indicados, e o nome só aparece quando o envelope é aberto, com a capa, o troféu e os confetes como em qualquer outra categoria. As categorias que você mesmo escolhe não mudam: continuam mostrando todos os concorrentes antes, porque ver quem está concorrendo é a graça.'],

  'The My Grammys nominee cards look like ballots now':
    ['Os cartões de indicados de Meus Grammys agora parecem cédulas',
     'Os cartões de categoria eram caixas simples: uma faixa cinza de cabeçalho, uma coluna de círculos e um vencedor marcado só por um leve tom dourado numa linha — doze deles lado a lado pareciam uma planilha, não uma cédula de premiação. Cada cartão agora tem um trilho fino colorido na borda de cima, na cor do seu tipo, então categorias de música, álbum e artista se distinguem de relance, e a mesma cor aparece no ícone, no brilho ao passar o mouse e no botão do rodapé. Os indicados são numerados 01, 02, 03 à esquerda, na fonte monoespaçada, como numa cédula impressa, e o vencedor sai da lista para uma faixa dourada de largura total, com trilho dourado e um único reflexo metálico quando a grade é desenhada. Títulos longos de remix não quebram mais em três linhas desalinhando a grade — são encurtados, com o texto completo ao passar o mouse — e os cartões surgem em onda em vez de todos de uma vez. Uma categoria decidida fica toda dourada, então uma cédula completa é visível do outro lado da página. O seletor de ano acima recebeu o mesmo tratamento: botões redondos dos dois lados de um ano bem maior, e as duas abas do painel viraram uma única chave.'],

  'Big Last.fm libraries no longer crash the browser on a phone':
    ['Bibliotecas grandes do Last.fm não travam mais o navegador no celular',
     'Carregar seu histórico baixava cada scrobble do Last.fm e guardava tudo na memória até a última página chegar — e não só as quatro coisas que este site usa, mas tudo o que o Last.fm manda com cada scrobble: identificadores internos, um link e quatro endereços de capa. Isso é cerca de dez vezes mais do que o necessário, e numa conta com 750.000 scrobbles somava uns 1,6 GB, muito mais do que um celular permite para uma única aba. Em algum ponto perto da página 3.500 de 3.900 o celular matava a aba e você caía na tela de erro do próprio navegador, enquanto a mesma conta carregava bem num computador com memória de sobra. Agora só os quatro campos são guardados — cerca de 160 MB para essa mesma biblioteca, em vez de 1,6 GB — então o download cabe num celular.'],

  'An interrupted history download carries on instead of starting over':
    ['Um download de histórico interrompido continua em vez de recomeçar',
     'Seu histórico só era salvo no dispositivo depois que o download inteiro terminava. Para a maioria das bibliotecas tudo bem, mas uma muito grande leva milhares de páginas, e qualquer coisa que o interrompesse no meio — bloquear o celular, o navegador descartar a aba em segundo plano, a aba ficar sem memória — jogava tudo fora. Ao voltar, começava de novo pela página um, o que para as maiores contas significava que nunca terminaria. Agora o progresso é salvo a cada 250 páginas, e a próxima visita mostra as paradas montadas com o que já foi baixado e depois pede ao Last.fm só a parte que falta, retomando exatamente de onde parou. Funciona também ao longo de várias visitas: cada uma vai mais fundo no seu histórico do que a anterior.'],

  'What’s New tells you when there is something new':
    ['Novidades avisa quando há algo novo',
     'O registro de mudanças tinha uma única porta: um linkzinho no fim da página, que nunca dizia se algo tinha mudado — então não havia motivo para clicar nele. Agora um botão NOVIDADES aparece no canto superior direito do cabeçalho, ao lado de Tema e Idioma, sempre que chegarem entradas desde a última vez que você abriu a lista, e some assim que você as lê. Quando não há nada novo, ele nem aparece. Ao abrir, a lista também mostra quantas entradas são novas, marca cada uma com um trilho verde e traça uma linha onde começam as que você já viu, para você parar de ler no lugar certo em vez de rolar setecentas linhas. O link do rodapé continua onde estava para quem quiser o histórico completo. O que você já leu é lembrado por navegador, então ler no notebook não apaga o aviso no celular.'],

  'Upcoming and Recent Releases open in Reel view again':
    ['Próximos e Recentes Lançamentos voltam a abrir na visão Carrossel',
     'As duas seções buscam seus 200 principais artistas um por um, e enquanto isso se redesenhavam como Blocos depois de cada artista, não importava o que os botões Carrossel / Blocos / Tabela / Lista dissessem — então abriam na visão errada e os botões não faziam nada até os 200 artistas terem sido consultados, o que pode levar alguns minutos. Agora elas se redesenham na visão selecionada, Carrossel por padrão, e trocar de visão funciona na hora, sem esperar a busca terminar. Os redesenhos também foram espaçados, então o carrossel não recomeça do início toda vez que um artista chega.'],

  'The browser tab, the footer and Google all use your name now':
    ['A aba do navegador, o rodapé e o Google agora usam o seu nome',
     'O cabeçalho já mostrava "★ Suas Paradas Musicais Pessoais ★" até você preencher um nome de exibição nas Configurações, e aí passava a ser seu. O rodapé e o título da aba não — mostravam o nome do dono do site para todo mundo, que também era o que o Google exibia como título do dankcharts.fm nos resultados de busca. Agora os dois seguem o cabeçalho: "Suas Paradas Musicais Pessoais" até você definir um nome de exibição, e o seu próprio nome depois disso, nos quatro idiomas, com o ano “Desde” do rodapé tirado do seu primeiro scrobble em vez de um 2016 fixo. O Google pega o novo título da próxima vez que rastrear o site, então o antigo pode continuar aparecendo na busca por um tempo.'],

  'Last.fm syncs no longer stop short of your full history':
    ['Sincronizações do Last.fm não param mais antes do seu histórico completo',
     'Se o Last.fm limitava a sincronização — o que ele faz quando uma biblioteca grande é baixada rápido, e que celulares com conexões mais lentas sofrem com mais frequência — as páginas recusadas eram puladas em silêncio, e a sincronização salvava o que tinha chegado como se fosse todo o seu histórico. Cada sincronização seguinte só pedia scrobbles mais novos que isso, então uma conta podia ficar indefinidamente com uma fração das reproduções reais, sem nada na tela avisando. Agora as páginas recusadas são aguardadas e tentadas de novo, e o que ainda faltar no fim é baixado de novo na próxima sincronização, em vez de ficar travado; uma sincronização incompleta avisa na linha de status em vez de anunciar sucesso. As sincronizações continuam começando rápido e só desaceleram se o Last.fm realmente frear. À parte disso, se o celular se recusar a guardar a cópia offline — o motivo comum é um iPhone cheio ou restrito — a linha de status agora avisa em vez de falhar em silêncio.'],

  'My Grammys has a Best Album Cover category':
    ['Meus Grammys ganha a categoria Melhor Capa de Álbum',
     'Uma nova categoria opcional em Meus Grammys, para o disco mais bonito do ano, e não o que soa melhor. Ative-a em Configurar Ano e ela funciona como as outras categorias de álbum — escolha indicados entre tudo o que você ouviu no período de elegibilidade, coroe um vencedor, e a cerimônia dá a ela o mesmo envelope que às outras, com as próprias capas preenchendo os cartões.'],

  'New Artist of the Year is now Best New Artist':
    ['Novo Artista do Ano agora é Melhor Artista Revelação',
     'Renomeado para bater com o nome que o prêmio tem em todo lugar, incluindo a aba Prêmios Reais ao lado. Nada mudou no funcionamento, e os indicados ou vencedores que você já escolheu continuam exatamente onde estavam — só o nome no cartão é diferente. Traduzido também para espanhol e português.'],

  'Real-Life Awards has pictures now':
    ['Prêmios Reais agora tem imagens',
     'Cada artista na aba Prêmios Reais agora traz sua foto na lateral do cartão, e cada indicação mostra a capa da música ou do álbum a que se refere — a capa do álbum nas categorias de álbum, a arte do single em todo o resto. Uma categoria sem uma obra por trás, como Melhor Artista Revelação ou Produtor do Ano, não mostra nada em vez de repetir a foto do artista. As imagens vêm do mesmo lugar que as das paradas, então tudo o que você fixou aparece aqui também, com a sua grafia do artista e não com a que o grammy.com usa. No celular a imagem fica quadrada no topo do cartão, e cada indicação põe o título abaixo da categoria em vez de espremer os dois numa linha.'],

  'The events calendar opens the menu instead of jumping to a Google search':
    ['O calendário de eventos abre o menu em vez de pular para uma busca no Google',
     'Clicar em qualquer coisa no calendário da aba Eventos levava direto para uma busca no Google — nas grades de Mês e Semana e no painel Dia logo abaixo. Agora tudo abre o mesmo menuzinho que os cartões do resto da aba têm, escolhido de acordo com o evento: um aniversário oferece o Spotify do artista, uma playlist, as últimas 10 músicas e a busca pelo aniversário; um aniversário de lançamento e um lançamento que já saiu oferecem o mesmo para o disco; e um lançamento que ainda não saiu oferece só Spotify e Google, já que não há nada para tocar. Passar o mouse ainda mostra o cartãozinho de prévia com a capa — ele só sai da frente quando você clica, em vez de ficar por cima do menu.'],

  'Concerts open the menu too, with Ticketmaster at the top of it':
    ['Shows também abrem o menu, com o Ticketmaster no topo',
     'Um show era uma ida sem volta ao Ticketmaster, tanto nos cartões da seção Shows quanto nas pílulas verde-azuladas do calendário. Agora eles abrem o menu, e Ingressos no Ticketmaster é a primeira opção — então a página do show continua a um clique, com o Spotify do artista, uma playlist e as últimas 10 músicas ao lado. Isso veio junto com a mudança no calendário: o calendário mostra shows ao lado de aniversários e lançamentos, e só alguns deles abrirem um menu seria pior do que nenhum.'],

  'Real-Life Awards now shows actual Grammy nominations':
    ['Prêmios Reais agora mostra as indicações reais ao Grammy',
     'A aba Prêmios Reais ficava vazia em quase todos os anos. Ela pedia ao MusicBrainz as relações de prêmios, e o MusicBrainz quase não as registra — um punhado de artistas tem, ninguém mais, então a aba dava de ombros e não mostrava nada. Agora ela lê o próprio grammy.com. Escolha um ano e você vê a cerimônia pelo nome — o 68º Grammy Awards, realizado em 2026 para os lançamentos de 2025 — e depois, para cada um dos seus cinquenta principais artistas do ano homenageado, todas as categorias em que foram indicados, quais venceram e a música ou o álbum em questão, junto com o histórico de todos os tempos. A lista segue a sua própria ordem de audição, então seu artista número um do ano vem primeiro. Voltar pelos anos funciona do mesmo jeito, até o 1º Grammy Awards, em 1959. Os cinquenta artistas são consultados de oito em oito em vez de um por segundo, e cada artista é buscado uma única vez, não importa quantos anos você percorra — ir até cinquenta é onde estão as surpresas, o artista que você ouviu duas vezes e que, no fim, foi indicado.'],

  'Picking nominees no longer crawls on a phone':
    ['Escolher indicados não se arrasta mais no celular',
     'Adicionar ou tirar um indicado numa categoria de Prêmios podia levar um segundo ou mais num celular, e pior quanto maior a biblioteca. Cada toque jogava a lista inteira fora e a reconstruía do zero — reordenando as músicas, álbuns ou artistas do ano e gerando de novo sessenta linhas da lista — tudo para mover uma marquinha. A nota de avaliação em cada linha era a parte cara: calcular a de um álbum exige encontrar a lista de faixas, e encontrar a lista de faixas significava ler todas as reproduções do seu histórico. Sessenta linhas eram sessenta passadas por tudo, e uma categoria de artista, que tira a média de todos os álbuns dele, eram centenas. Agora um toque só troca a linha tocada, e as notas de álbuns e artistas são calculadas uma vez e lembradas até algo realmente mudar. Numa biblioteca de 60.000 reproduções, o trabalho por trás de um toque caiu de cerca de 276 milissegundos para menos de um quinto de um.'],

  'Nominees no longer go missing when you switch apps':
    ['Indicados não somem mais quando você troca de app',
     'Sua cédula era a única coisa que você escreve no app que só era guardada na nuvem, nunca no dispositivo. Então, se o salvamento ainda não tinha terminado a viagem quando você saía do Chrome para outro app — e os celulares congelam ou descartam uma aba em segundo plano quando bem entendem — os indicados simplesmente sumiam, sem nada na tela dizendo isso. Agora três coisas impedem isso. Todo salvamento grava primeiro no dispositivo e depois na nuvem, então a cédula está segura no instante em que você toca em Salvar. A conexão com a nuvem mantém sua própria fila no disco, então um salvamento feito sem sinal é enviado depois em vez de esquecido. E se um salvamento for realmente recusado com você conectado, isso agora aparece na tela em vez de falhar em silêncio. Quando o app abre de novo, ele usa a cópia gravada por último, então um salvamento que nunca chegou à nuvem é recuperado do dispositivo e enviado.'],

  'The rated best-of list is gone from the Awards tab':
    ['A lista dos melhores pelas suas avaliações saiu da aba Prêmios',
     'A aba Prêmios abria com um painel ★ Os melhores, pelas minhas avaliações — duas colunas ordenadas, melhores álbuns e melhores músicas do ano, pela nota que você deu e não por quanto você os ouviu. Ele foi removido, então a aba agora começa pelos próprios prêmios. Suas avaliações não foram mexidas: todas as notas que você deu continuam lá, e a aba Avaliações continua mostrando as mesmas listas de fim de ano.'],

  'Clicking a Recent Release shows its options again':
    ['Clicar num Lançamento Recente volta a mostrar as opções',
     'Nas paradas Semanal, Mensal e Anual, clicar num cartão em Lançamentos Recentes não fazia nada — o menuzinho com Spotify, uma playlist, o player e Google piscava e sumia antes de dar para ler. O menu observa a rolagem para sair da frente quando o cartão a que está preso se move, mas estava ouvindo tudo o que rola na página, e não só o que envolve o cartão. Os carrosséis de lançamentos deslizam sozinhos, então o carrossel de Próximos Lançamentos passando logo acima bastava para fechar o menu uns cinquenta avos de segundo depois de abrir. Agora ele só fecha quando a própria página rola, ou algo dentro do qual o cartão realmente está. A mesma piscada fechava menus por toda a aba Eventos, onde os carrosséis ficam empilhados, então esses foram corrigidos pela mesma mudança.'],

  'Every card on the Events tab opens its menu instead of jumping to Google':
    ['Todo cartão da aba Eventos abre seu menu em vez de pular para o Google',
     'Aniversários, Aniversários de lançamento, Aniversários recentes e Aniversários de lançamento recentes eram links simples: um clique e você estava numa busca do Google, sem poder fazer mais nada. Agora eles abrem o mesmo menuzinho dos cartões de lançamento — buscar no Spotify, adicionar a uma playlist, as últimas 10 músicas do artista ou do lançamento, e buscar no Google. A opção do Google num cartão de aniversário continua buscando o aniversário do artista, como o cartão fazia, já que é a única busca que os serviços de música não entenderiam. Funciona nas quatro formas de exibir uma seção: Blocos, Carrossel, Lista e Tabela. O ＋ no canto do cartão não mudou: continua sendo o jeito de salvar direto numa playlist com um clique.'],

  'New Music Friday cards open the menu, with Deezer at the top of it':
    ['Cartões do New Music Friday abrem o menu, com o Deezer no topo',
     'Um cartão do New Music Friday levava direto ao álbum no Deezer. Agora ele abre o menu, e Abrir no Deezer é a primeira opção — então essa página continua a um clique, e buscar no Spotify, salvar numa playlist ou buscar no Google são as outras. Nada mudou sobre de onde vêm os lançamentos: a capa, o título, a data de lançamento e se é álbum, single ou EP continuam sendo lidos do Deezer toda sexta-feira.'],

  'The Albums/Singles/EPs chips stay on the chart tabs where they belong':
    ['Os botões Álbuns/Singles/EPs ficam nas abas de paradas, que é o lugar deles',
     'Assim que você separava um tipo de lançamento dos álbuns, aparecia uma fileira de botões para alternar entre Álbuns, Singles, EPs e Todos. Ela era para as paradas Semanal, Mensal, Anual e Histórico, mas seguia você para todo lado: Dados Brutos, Gráficos, Recordes, Eventos, Prêmios, Sua Trilha Sonora, Playlists e o Guia de Charts mostravam os botões acima da página, onde não mudavam nada. Agora eles só aparecem nas quatro abas de paradas, e só enquanto a parada de álbuns é a que está na tela.'],

  'Twenty new award categories, and the Streak Award has gone':
    ['Vinte novas categorias de prêmios, e o Prêmio de Sequência se foi',
     'Meus Grammys ganhou vinte categorias que você pode ativar em Configurar Ano. Catorze são escolhidas do jeito de sempre, a partir de uma lista de indicados: Vídeo do Ano, Gravação do Ano, Melhor Música Country, Melhor Álbum Country, Melhor Álbum Vocal Pop, Melhor Música Pop Solo, Melhor Música Pop de Duo/Grupo, Melhor Gravação Dance/Eletrônica, Melhor Gravação Dance Pop, Melhor Álbum Dance/Eletrônico, Melhor Gravação Remixada, Melhor Álbum de Reggae, Melhor Álbum de Trilha Sonora e Melhor Música de Trilha Sonora. O par do pop se divide pelo crédito da música — solo de um lado, duplas e grupos do outro — e os dois prêmios de trilha sonora leem os tipos de lançamento que você marcou, então um lançamento marcado como trilha sonora é o que torna uma música elegível. Country, reggae e dance pop são gêneros novos que o classificador agora reconhece. As outras seis se concedem sozinhas, sem indicados para escolher: Maior sequência diária de uma música, de um álbum e de um artista, cada uma a maior sequência ininterrupta de dias no ano, e Música, Álbum e Artista com mais dias ouvido, cada uma contando em quantos dias do ano foi ouvido. O antigo Prêmio de Sequência foi removido — os três prêmios de sequência que o substituem dizem claramente o que medem, e cobrem também álbuns e artistas. Todas as novas categorias vêm desligadas por padrão e todas estão traduzidas para espanhol e para as duas variantes do português.'],

  'Automatic release-type detection now actually runs on its own':
    ['A detecção automática de tipo de lançamento agora roda sozinha de verdade',
     'A chave "Detectar tipos de lançamento automaticamente" não detectava nada automaticamente. Ligá-la mostrava as opções abaixo e mais nada — toda varredura ainda precisava ser iniciada à mão no painel de revisão, então uma biblioteca podia passar meses com a opção ligada sem um único single ou EP marcado. Agora, ao ligar, ela varre sua biblioteca sozinha, marcando singles, EPs, álbuns ao vivo e trilhas sonoras pelo caminho, e as Configurações mostram até onde ela chegou. Uma segunda coisa desfazia o trabalho em silêncio: uma varredura verifica mil lançamentos por vez, mas esquecia tudo o que tinha aprendido assim que você fechava a aba, então cada visita recomeçava pelos seus álbuns mais ouvidos e nunca chegava à parte da biblioteca onde os singles realmente estão. Agora ela lembra o que já consultou e continua dali, sessão após sessão, até a biblioteca inteira ter passado. Nada que você marcou à mão é mexido, a detecção nunca desmarca um lançamento, e tudo o que ela marca aparece em Gerenciar tipos, onde você pode mudar ou remover.'],

  'Release-type detection now finds live albums, soundtracks, and the rest of your library':
    ['A detecção de tipo de lançamento agora encontra álbuns ao vivo, trilhas sonoras e o resto da sua biblioteca',
     'Duas coisas deixavam a varredura calada. Ela perguntava ao Deezer primeiro sobre seus lançamentos mais ouvidos, que é exatamente onde os singles não estão — e gastava o orçamento relendo respostas que já tinha, então varrer uma segunda vez percorria os mesmos poucos centenas de álbuns e nunca ia mais fundo. Agora ela resolve de graça o que já sabe, gasta as consultas com lançamentos que ninguém verificou, diz quantos não alcançou e continua dali na próxima varredura. Álbuns ao vivo e trilhas sonoras não podiam ser detectados de jeito nenhum, porque o Deezer só conhece álbum, single e EP: agora eles são lidos pela forma como os títulos são rotulados, então um "(Live at ...)" ou um "(Original Motion Picture Soundtrack)" é reconhecido na hora.'],

  'Deep in a chart, an edit no longer sends you back to #1':
    ['Lá no fundo de uma parada, uma edição não manda mais você de volta ao nº 1',
     'Marcar um álbum como single ou EP pela janela dele reconstrói as paradas por trás, e toda reconstrução mandava as listas histórica e anual de volta para a primeira página — então fechar a janela depois de uma edição de um segundo custava o lugar até onde você tinha descido. Agora a página sobrevive a tudo o que deixa intacta a lista a que pertence. Mudar de período, ir para outro ano ou alternar entre as paradas de álbuns e singles ainda leva você ao topo, porque essas são de fato outra lista.'],

  'PEAK tags on the singles and EP charts count the right chart':
    ['As etiquetas PEAK nas paradas de singles e EPs contam a parada certa',
     'Um single que tinha liderado a parada de singles por semanas ainda exibia PEAK #2, porque a etiqueta o comparava também com todos os álbuns — uma parada onde ele nem aparece mais — enquanto o histórico na mesma linha dizia #1. A parada de álbuns tinha o espelho disso: um álbum com pico mais baixo do que realmente teve, porque singles separados tinham sido contados acima dele. Todo pico agora pertence à parada em que foi alcançado, incluindo as posições históricas nas janelas de álbum e de artista.'],

  'A single\'s chart run opens the singles chart, not the albums one':
    ['O histórico de um single abre a parada de singles, não a de álbuns',
     'Clicar numa caixa do histórico de um single ou EP separado mostrava a parada de álbuns daquela semana embaixo de uma posição que nunca tinha vindo dela — a caixa dizia #1 e a lista mostrava o álbum que estava em #1. Depois que um tipo é separado, o lado dos álbuns de uma semana são várias paradas, e não uma, e a prévia da caixa agora mostra a parada em que aquela posição foi obtida, com o nome dela no título.'],

  'Singles certify on their own ladder immediately':
    ['Singles são certificados na própria escala desde já',
     'A escala de certificação dependia de um tipo ter sido separado numa parada própria, o que misturava duas perguntas diferentes. A separação diz respeito a onde um lançamento aparece nas paradas; a escala diz respeito ao que o disco é. Cem reproduções de um single de duas faixas são uma conquista diferente de cem reproduções de um álbum de catorze faixas, e isso vale onde quer que ele esteja nas paradas. Álbuns ao vivo e trilhas sonoras ficam na escala de álbuns, porque são discos completos.'],

  'Count a single\'s plays toward its album':
    ['Conte as reproduções de um single para o álbum dele',
     'Três níveis, desligado por padrão: nada; a própria página do álbum contando os singles; ou também a linha do álbum na parada, seus recordes e sua certificação contando-os, enquanto o single mantém a própria linha e o próprio número.'],

  'Separated types get their own Records':
    ['Tipos separados ganham seus próprios Recordes',
     'Toda seção de Recordes que lista álbuns agora oferece uma pílula para cada entidade do lado dos álbuns — só Álbuns se você não separou nada, mais Singles e EPs quando eles estão à parte. Isso também trouxe um recorde novo que só existe por causa dos tipos de lançamento: Lançada primeiro como single, músicas ouvidas primeiro num single que depois apareceram num álbum, começando pela espera mais longa.'],

  'The auto-detect switch could not be clicked':
    ['Não dava para clicar na chave de detecção automática',
     'A caixa de seleção dentro da chave é invisível e não ocupa espaço, então o controle deslizante só é alcançável pelo rótulo — e todas as outras chaves das Configurações envolvem a linha num rótulo, mas esta não. A função estava correta; o controle era decorativo. Os testes não pegaram porque chamavam a função diretamente, em vez de clicar no controle.'],

  'Automatic detection of singles and EPs':
    ['Detecção automática de singles e EPs',
     'Marcar algumas centenas de singles à mão é a tarefa que teria matado o recurso, então a detecção faz a varredura e você corrige. Ela fica desligada até você ligar, e mesmo assim só propõe — nada é gravado até você aplicar. Os títulos só são comparados com a convenção delimitada das lojas, então The Singles Collection e Single Ladies ficam como estão.'],

  'Singles and EPs in their own charts':
    ['Singles e EPs em paradas próprias',
     'Um lançamento marcado continua não mudando nada até o tipo dele ser definido como Separado nas Configurações, e Com os álbuns é o padrão para os dois, então uma biblioteca existente fica intacta até você pedir o contrário. Separado dá à parada de álbuns um filtro segmentado entre Álbuns, Singles e EPs.'],

  'Mark a release as a single, EP, live album or soundtrack':
    ['Marque um lançamento como single, EP, álbum ao vivo ou trilha sonora',
     'Só a marcação e mais nada: registrar que tipo de disco algo é não muda nenhuma parada, nenhuma certificação e nenhum recorde. Separar um tipo da parada de álbuns é uma configuração opcional, que veio depois.'],

  'Peak tags on yearly rows':
    ['Etiquetas de pico nas linhas anuais',
     'A parada anual já recebia os dados de pico e simplesmente nunca os usava, então as linhas apareciam sem a etiqueta de pico que as linhas semanais e mensais têm.'],

  'Movement and previous rank on yearly charts':
    ['Movimento e posição anterior nas paradas anuais',
     'As paradas anuais mostravam só posição, título, álbum e reproduções — as colunas de movimento e semanas na parada eram só semanais e mensais, bloqueadas por três condições diferentes, uma das quais tinha o mês fixo no código justamente no trecho que deveria tratar todos os outros períodos.'],

  'Rate your own library':
    ['Avalie sua própria biblioteca',
     'Dê a qualquer música uma nota de 0,0 a 10,0 com uma rubrica de seis partes — composição, letra, vocal, produção, melodia e ritmo — ou uma única nota de intuição. Letra e vocal podem ser marcados como não aplicáveis, para que músicas instrumentais não sejam puxadas para baixo por zeros; eles saem da média por completo. A nota total de um álbum é montada a partir das faixas, junto com qualidades próprias do álbum.'],

  /* ========== AGOSTO 2026 ========== */

  'Filter the certified shelf by songs or albums':
    ['Filtre a estante de certificados por músicas ou álbuns',
     'A estante Certificados no período misturava os dois tipos sem jeito de ver só um. Três botões com as contagens aparecem quando há dos dois tipos, e um período com um tipo só mantém a linha simples, porque não há o que filtrar.'],

  'Menu tab names quoted in the tour':
    ['Nomes das abas do menu entre aspas no tour',
     'Mostrar, Tamanho, Visão e Ações pareciam palavras comuns no meio da frase, então não ficava claro que eram os nomes das abas do próprio menu.'],

  'The tour opens the real options menu':
    ['O tour abre o menu de opções de verdade',
     'O menu era descrito duas vezes, uma dentro de um passo e outra como passo próprio. Os dois viraram um único passo que controla o menu real — abrindo-o e destacando cada aba, cada linha, os tamanhos, os layouts e as ações.'],

  'Clearer wording on the release reels':
    ['Texto mais claro nos carrosséis de lançamentos',
     'O passo agora cita o menu de opções e o seletor de visão que essas seções realmente têm.'],

  'Weeks on chart stated directly':
    ['Semanas na parada, explicado sem rodeios',
     'O texto comparava o número com o que ele não é, em vez de simplesmente dizer o que ele é.'],

  'Two guide descriptions corrected':
    ['Duas descrições do guia corrigidas',
     'Novas Entradas lista as primeiras descobertas de todos os tempos, não as músicas que estreiam na parada, e o botão Mais é uma faixa de largura total abaixo das abas, e não algo à direita.'],

  'Section titles hidden behind the sticky bar':
    ['Títulos de seção escondidos atrás da barra fixa',
     'A rolagem do tour reservava espaço para o próprio aviso embaixo, mas nada para a barra de data fixa no topo, então os títulos das seções altas ficavam atrás dela.'],

  'Plainer navigation copy in the tour':
    ['Texto de navegação mais simples no tour',
     'O passo parecia um parágrafo de manual; virou linhas curtas com rótulo para a fileira de cima, a de baixo e como mostrar a segunda.'],

  'The guide opens with a real greeting':
    ['O guia abre com uma saudação de verdade',
     'O título parecia um nome colado num título, e a linha abaixo era uma frase pela metade.'],

  'Weeks on chart described backwards':
    ['Semanas na parada, descrito ao contrário',
     'O guia dizia em quatro lugares que a coluna Semanas conta uma sequência consecutiva. Na verdade é um total acumulado que vai somando entre passagens separadas e nunca zera — o contador interno que zera é outro, usado só para descrever uma sequência que acabou de terminar.'],

  'Plainer wording on the play button step':
    ['Texto mais simples no passo do botão de reprodução',
     'Ele descrevia como a busca funciona, que não é o que ninguém quer saber, e terminava com mais uma frase sobre o que o app não exige de você.'],

  'The tour scroll re-asserted after the page settles':
    ['A rolagem do tour se reajusta depois que a página se acomoda',
     'O destino está certo quando é calculado, mas a página continua se mexendo por baixo da animação — entrar num passo recolhe a seção anterior, removendo milhares de pixels acima do destino enquanto a rolagem ainda está acontecendo.'],

  'The tour covers the two buttons on a row':
    ['O tour cobre os dois botões de uma linha',
     'Ele percorria os dados de uma linha mas pulava as duas coisas que você realmente pode fazer nela, então foi acrescentado um passo para cada uma, posicionado para que o tour continue sendo lido da esquerda para a direita.'],

  'Three tour highlights were invisible':
    ['Três destaques do tour eram invisíveis',
     'Posição, Anterior e Semanas marcavam a célula certa, mas nada aparecia, porque as bordas colapsadas da tabela deixavam o fundo de uma célula vizinha ser pintado bem em cima do anel da célula ao lado. As três ficam entre células preenchidas.'],

  'The tour slowed down':
    ['O tour ficou mais devagar',
     'Os tempos tinham sido pensados para ler o aviso, e não para ler e depois realmente olhar para o que está sendo apontado — e como as seções agora se expandem na chegada, há mais para absorver. Cada passo dura cerca de dez segundos.'],

  'Tour scrolled tall sections to their middle':
    ['O tour rolava as seções altas até o meio',
     'Foi relatado como o tour não destacar mais Quase no Top, Fora da Parada e Novas Entradas, enquanto Lançamentos ainda funcionava — e Lançamentos funcionar era a pista, porque era a seção curta. Centralizar uma seção mais alta que a tela joga o cabeçalho para fora pelo topo.'],

  'Two sections would not open for the tour':
    ['Duas seções não abriam para o tour',
     'Revelar uma seção tirava as classes de estilo dela, o que resolve a maioria das seções — mas Quase no Top e Fora da Parada controlam o estado de aberto separadamente e definem a altura diretamente, então nenhuma das duas respondia.'],

  'The tour walks a chart row piece by piece':
    ['O tour percorre uma linha da parada peça por peça',
     'Um parágrafo listava o que uma linha contém e não apontava nada. Ele virou sete passos sobre o número um atual: a linha, a posição, a posição do período anterior e o movimento, as etiquetas, as semanas na parada, as reproduções e o histórico.'],

  'The tour can reveal a hidden section':
    ['O tour pode revelar uma seção oculta',
     'Um passo explicando Quase no Top enquanto Quase no Top está desligado não tinha nada para apontar e não destacava nada. Agora os passos podem abrir uma seção oculta ou recolhida e devolvê-la logo em seguida do jeito que a encontraram.'],

  'Plainer wording on the certifications step':
    ['Texto mais simples no passo das certificações',
     'A primeira frase enterrava o que a seção é embaixo de como ela funciona, justo num ponto lido na velocidade do tour.'],

  'The tour visited sections out of order':
    ['O tour visitava as seções fora de ordem',
     'A página mostra as seções como Parada, Quase no Top, Fora da Parada, Novas Entradas, e a barra de botões lista do mesmo jeito, mas o tour visitava Novas Entradas em terceiro — descendo além de Fora da Parada e depois voltando para cima até ela.'],

  'The tour plays through the whole weekly page':
    ['O tour percorre a página semanal inteira',
     'Um cartão descrevia a aba Semanal e deixava o resto sem documentação — as faixas de estatísticas, os cartões do momento, o carrossel de certificações, os sete botões, o menu de seção, as três subparadas e os carrosséis de lançamentos nunca eram citados. Virou um tour que avança sozinho.'],

  'Chart animation is now opt-in':
    ['A animação da parada agora é opcional',
     'A configuração era lida de um jeito que tratava nunca ter sido aberta como ligada, então a reprise rodava para todo usuário novo a cada desenho da parada, antes que a pessoa fizesse ideia do que estava sendo animado.'],

  'Tour steps spotlight what they describe':
    ['Os passos do tour destacam o que descrevem',
     'Um passo chamado "A barra de navegação" que nem rola até a barra nem a marca deixa você lendo a descrição de algo que precisa encontrar sozinho. Agora os passos rolam o alvo para a tela e o circulam.'],

  'The tour\'s opening claim was untrue':
    ['A frase de abertura do tour não era verdadeira',
     'Ela dizia que o app funciona com a mesma engrenagem de uma parada musical nacional. Não é assim — essas ponderam streaming, vendas e rádio entre si, enquanto esta conta reproduções. E ainda gastava mais duas frases com o que o app não faz.'],

  'A tour step for every tab':
    ['Um passo do tour para cada aba',
     'Juntar Eventos a Prêmios e Trilha Sonora a Playlists fazia quatro abas parecerem duas notas de rodapé, quando só Prêmios gera 33 categorias e Recordes tem onze seções. O tour passou de onze para dezoito passos.'],

  'Welcome gate skipped after Google sign-in':
    ['Tela de boas-vindas pulada depois de entrar com o Google',
     'A tela estava ligada a três das quatro formas como o app pode começar. A quarta restaura uma configuração salva e mostra o próprio app, então quem entrava com o Google nunca a via.'],

  'A welcome gate, and the guide rebuilt as six chapters':
    ['Uma tela de boas-vindas, e o guia refeito em seis capítulos',
     'Nada numa parada recém-carregada anunciava que existia um guia, então ele só era encontrado por acaso — e, uma vez encontrado, eram doze seções soltas misturando documentação com suas próprias estatísticas. Agora uma tela na primeira visita oferece o tour ou o guia, e o guia virou seis capítulos em ordem.'],

  'The ceremony staged properly':
    ['A cerimônia encenada como deve ser',
     'Ela mostrava uma lista simples com o vencedor já destacado, e o envelope só aparecia nas categorias que ainda não tinham vencedor — então não havia nada a revelar. Agora cada categoria tem as capas dos indicados, uma volta de apresentação e a abertura de um envelope.'],

  'Nominee lists ranked by the category\'s own rule':
    ['Listas de indicados ordenadas pela regra de cada categoria',
     'Melhor Colaboração significa músicas creditadas a mais de um artista — mas também músicas cujo crédito mostra um nome só e você sabe que não é bem assim. O crédito não consegue diferenciar essas duas, então a regra virou um critério de ordenação em vez de um filtro: as correspondências vão para o topo e nada é escondido.'],

  'Generate Nominees button broke itself':
    ['O botão Gerar Indicados se quebrava sozinho',
     'O botão restaurava o rótulo como texto puro, mas o rótulo contém o código do ícone, então ele exibia o próprio código e continuava quebrado. Uma categoria que falhava também deixava o botão travado em Gerando.'],

  'Records not rebuilt when nothing changed':
    ['Recordes não são mais recalculados quando nada mudou',
     'O cálculo rodava a cada visita à aba e não guardava nada, então abrir Recordes, dar uma olhada numa parada e voltar custava de novo cerca de 1,6 segundo de contagem para uma resposta que não tinha mudado.'],

  'Cheaper ordering in the Records build':
    ['Ordenação mais barata no cálculo dos Recordes',
     'Recordes era a coisa mais lenta que restava, cerca de 1,8 segundo com 150.000 reproduções, e as quatro rodadas anteriores não tinham mexido nele porque ele faz o próprio percurso cronológico em vez de ler os índices compartilhados.'],

  'Faster loading by measuring rather than guessing':
    ['Carregamento mais rápido medindo em vez de chutando',
     'O carregamento foi medido etapa por etapa, e ler o arquivo não era o problema — dividir 150.000 linhas leva cinco milissegundos. O custo estava numa função de ordenação que convertia duas datas em cada uma de 2,6 milhões de comparações.'],

  'One shared index instead of regrouping per builder':
    ['Um índice compartilhado em vez de reagrupar a cada cálculo',
     'A terceira rodada sobre a mesma causa de fundo: cálculos separados percorrendo cada um o histórico inteiro para chegar a contagens que os outros já tinham feito. Agora os totais são calculados uma vez por período e compartilhados.'],

  'Chart runs cached between renders':
    ['Históricos da parada guardados entre desenhos',
     'Montar o histórico era a coisa mais cara de um desenho — 909 milissegundos de um perfil de quatro segundos — e o resultado era jogado fora no início de cada desenho. Voltar uma semana recalculava todas as posições na parada desde a sua primeira reprodução, apesar de nada ter mudado.'],

  'Each play\'s derived values computed once':
    ['Os valores derivados de cada reprodução são calculados uma vez só',
     'Analisar uma biblioteca de 100.000 reproduções mostrou que um único desenho fazia 2,5 milhões de conversões de data e mais de um milhão de buscas de chave — umas doze passadas completas pelo histórico a cada desenho, porque cerca de dezessete cálculos de parada começam cada um com seu próprio loop sobre tudo. Agora esses valores são calculados uma vez por reprodução.'],

  'Add a song to a playlist instead of playing it':
    ['Adicione uma música a uma playlist em vez de tocá-la',
     'Tudo o que mostrava músicas oferecia a fila do player e mais nada, então para guardar uma música era preciso tocá-la. A Máquina do Tempo, os botões de reprodução de todas as paradas, aniversários, aniversários de lançamento e lançamentos recentes agora podem mandar faixas direto para uma playlist.'],

  'An artist\'s play button searched their name as a song':
    ['O botão de reprodução de um artista buscava o nome dele como música',
     'Todas as visões alternativas tratavam os álbuns à parte com o seletor de faixas e deixavam os artistas caírem numa busca direta, então o botão procurava o nome do artista como se fosse título de música. Três visões nem tinham botão de artista.'],

  'Export Playlist opened behind the Streaks window':
    ['Exportar playlist abria atrás da janela de Sequências',
     'Copiar lista de faixas parecia não fazer nada: a janela de exportação é declarada antes na página, então no mesmo nível de empilhamento a janela de sequências era pintada bem em cima dela. Uma janela aberta de dentro de outra agora fica por cima.'],

  'The Records reel ran twice as fast as it looked':
    ['O carrossel de Recordes andava duas vezes mais rápido do que parecia',
     'A velocidade foi ajustada para igualar a da Máquina do Tempo por cartão, mas um cartão de recorde é quase duas vezes mais largo, então igualar segundos por cartão significava percorrer o dobro da distância no mesmo tempo.'],

  'Every reel can be dragged':
    ['Todo carrossel pode ser arrastado',
     'A Máquina do Tempo, o carrossel da Trilha Sonora e todos os carrosséis de Eventos eram animações, e uma animação não pode ser arrastada — o ponteiro e a animação estariam escrevendo a mesma coisa. Eles foram refeitos como roladores de verdade, do jeito que a estante de certificados já funcionava.'],

  'The certified shelf stayed hanging on other tabs':
    ['A estante de certificados ficava pendurada em outras abas',
     'Ela se recusa a ser montada fora de semana e mês, mas mora na coluna da parada, e as abas que não são de parada escondem essa coluna peça por peça — e nenhuma das oito a citava. As placas que a última semana tinha conquistado ficavam à mostra em Recordes, Eventos e Prêmios.'],

  'Time Machine could be switched off permanently':
    ['A Máquina do Tempo podia ser desligada para sempre',
     'Desligar os três tipos deixava o carrossel sem nada para mostrar, então ele se escondia, levando junto os três botões, porque eles ficam no cabeçalho dele. Como esse estado é salvo e sincronizado, nem recarregar nem outro dispositivo os traziam de volta.'],

  'Time Machine vanished after visiting Awards':
    ['A Máquina do Tempo sumia depois de visitar Prêmios',
     'Essas abas escondem o carrossel de vez, e o código que restaura a interface da parada nunca o colocava de volta. A única outra coisa que podia fazer isso só o reconstrói quando os dados mudam — o que, no mesmo dia e com as mesmas reproduções, nunca acontece — então uma visita o removia pelo resto da sessão.'],

  'Awards a period earned':
    ['Os prêmios que um período conquistou',
     'Uma certificação é um momento — a reprodução exata que levou um disco além de um limite — então ela cai em exatamente uma semana e um mês. As paradas semanais e mensais agora abrem com as placas cuja reprodução decisiva caiu naquele período.'],

  'Compilations count as one album':
    ['Coletâneas contam como um álbum só',
     'Um álbum em que cada faixa cita um cantor diferente era quebrado em um álbum por cantor, então toda parada de álbuns, recorde e certificação contava o mesmo disco uma dúzia de vezes com uma fração das reproduções. Marcá-lo como coletânea junta tudo de novo em um só, creditado a Vários Artistas.'],

  'Plaques become awards':
    ['Placas viram prêmios',
     'A placa colocava a capa dentro de um rótulo de vinil, o que deixava dois problemas que ela não conseguia resolver dentro desse formato: a arte era o disco, então não havia arte, e um múltiplo era uma palavra numa etiqueta, então uma parede de Diamantes parecia toda igual até você ler cada etiqueta.'],

  'Certifications kept every award, not just the highest':
    ['Certificações guardam todos os prêmios, não só o mais alto',
     'Uma placa mostrava só onde um disco está agora, então passar de um limite destruía em silêncio o prêmio abaixo: um álbum com Diamante triplo tinha uma placa de Diamante, e o Ouro e a Platina conquistados no caminho tinham deixado de existir.'],

  'Yearly streaks ranked on their leanest year':
    ['Sequências anuais ordenadas pelo ano mais fraco',
     'Uma sequência anual só pode durar o tanto que a própria biblioteca dura, então qualquer um que continua na sua rotação chega ao mesmo máximo, e a classificação fica cheia de um mesmo número, desempatado pelas reproduções totais — o que transformava o recorde em Mais reproduções com etiqueta de sequência.'],

  'Records overview splits by period':
    ['O resumo de Recordes se divide por período',
     'Uma segunda fileira de pílulas reduz o painel às seções que têm um recorde naquele período, com Todos mostrando a união de tudo — 26 cartões em vez de 10 — e cada etiqueta dizendo de qual recorde se trata.'],

  'Records pills sized as primary navigation':
    ['Pílulas de Recordes no tamanho de navegação principal',
     'Elas tinham uns nove pixels, embaixo de uma página de títulos grandes — letra miúda para a navegação principal da aba.'],

  'Drawn icons on the type pills':
    ['Ícones desenhados nas pílulas de tipo',
     'Uma estrela, um losango e um losango de quatro pontas não diziam nada sobre músicas, artistas ou álbuns — três marcas abstratas cuja única função era serem diferentes entre si, e por isso duas seções já tinham partido para emojis.'],

  'Pill icons keep moving while selected':
    ['Os ícones das pílulas continuam se mexendo quando selecionados',
     'Nove dos onze faziam uma entrada e paravam de repente, então a pílula selecionada ficava parada depois do primeiro meio segundo. O movimento era um floreio de chegada quando precisava ser um estado.'],

  'Icons and colour families on the Records pills':
    ['Ícones e famílias de cor nas pílulas de Recordes',
     'Onze pílulas com nada além de rótulos minúsculos não davam ao olho como distinguir as seções. Cada uma agora tem um glifo desenhado a partir de objetos de loja de discos, em vez de marcas genéricas de interface, colorido em cinco famílias.'],

  'Reigns separated from longevity':
    ['Reinados separados de longevidade',
     'Doze semanas seguidas em primeiro lugar não é o mesmo recorde que doze semanas em primeiro espalhadas por quatro anos: uma coisa é reinado, a outra é longevidade. As duas seções agora dizem qual medem, e medem as duas.'],

  'Five more sections rank all three charts':
    ['Mais cinco seções classificam as três paradas',
     'Tudo em Recordes que só classificava a parada semanal agora classifica a semanal, a mensal e a anual, incluindo o teste Perfect All Kill. Sequências foi refeita no processo.'],

  'All #1s split per chart, and its covers load':
    ['Todos os nº 1 divididos por parada, e as capas carregam',
     'Um título guarda-chuva ficava sobre três subtabelas que eram os recordes de verdade, sem nomear nada que desse para apontar. Agora cada uma é um recorde próprio, e o bug das capas que perseguia a seção desde que foi criada foi corrigido.'],

  'Overview cards become artwork tiles':
    ['Os cartões do resumo viram blocos com imagem',
     'A grade era de dez painéis de texto sem graça. Todas as outras partes do app que apresentam um recorde mostram a cara do disco; esta, a primeira coisa que a aba mostra, não mostrava nenhuma.'],

  'All #1s pills failed to hide their tables':
    ['As pílulas de Todos os nº 1 não conseguiam esconder as tabelas',
     'Cada bloco de período abria dois elementos mas fechava três, e o navegador usava o que sobrava para fechar o próximo que estivesse aberto — então todas as tabelas a partir dali eram lidas como irmãs do painel que deveria contê-las, e as pílulas não conseguiam escondê-las.'],

  'Records tables become cards on phones':
    ['Tabelas de Recordes viram cartões no celular',
     'Uma tabela de recordes pode ter nove colunas, o que abaixo de 768 pixels significava uma rolagem horizontal sem nada indicando que ela existia, então as colunas da quinta em diante simplesmente nunca eram encontradas. Agora cada linha é um cartão.'],

  'A certification ledger behind every artist row':
    ['Um registro de certificações por trás de cada linha de artista',
     'Cada linha se expande com todas as certificações daquele artista, uma linha por prêmio, com as contas por trás: primeira reprodução, o dia em que chegou, quanto tempo a subida levou, o ritmo, as reproduções desde então e o medidor até o próximo degrau.'],

  'Five more sections get type pills':
    ['Mais cinco seções ganham pílulas de tipo',
     'Todos os nº 1, Aparições, Estreias e Mais reproduções agora mostram um tipo de cada vez, como as seções que já faziam isso, compartilhando um controle genérico único em vez de uma quarta, quinta e sexta cópia dele.'],

  'Fastest ranked on rounded days':
    ['Os mais rápidos eram ordenados por dias arredondados',
     'A classificação ordenava pelo tempo decorrido arredondado para dias inteiros, o que nos níveis mais baixos quase não é uma ordem — com 50 reproduções, 23 das 25 linhas visíveis tinham o mesmo número de dias, então na prática elas eram ordenadas pela ordem em que tinham sido calculadas. Toda reprodução tem um horário real, e agora ele é usado.'],

  'Fastest to Milestone for all three types':
    ['Mais rápido até o marco, para os três tipos',
     'Músicas, artistas e álbuns ganham cada um a própria classificação, em vez de só músicas, no mesmo formato que a seção Marcos logo acima usa.'],

  'Every record an artist holds, in their modal':
    ['Todos os recordes de um artista, na janela dele',
     'O carrossel do Salão da Fama do banner de Recordes agora aparece na janela do artista, limitado a ele. Os dois compartilham um único gerador de cartões para não se desencontrarem.'],

  'The tier medal sized to its word':
    ['A medalha de nível no tamanho da palavra',
     'A medalha era bem menor que a palavra do nível ao lado, então parecia um detalhe esquecido e não a coisa sendo premiada.'],

  'The song certification becomes a struck medal':
    ['A certificação de música vira uma medalha cunhada',
     'A nota solta virou uma medalha com a nota na face, em tons da cor em vez de centro escuro, porque um centro vazado deixaria a foto do artista aparecer através da medalha.'],

  'A gold note that catches the light':
    ['Uma nota dourada que pega a luz',
     'O emoji virou uma nota desenhada. Um emoji aparece na cor que cada plataforma define e não pode brilhar; uma nota desenhada pega o dourado do tema e uma sombra em camadas, que é o que a faz parecer metal e não um adesivo.'],

  'Song certifications marked by a rosette':
    ['Certificações de música marcadas por uma roseta',
     'A nota musical indicava o gênero e não a conquista, desvalorizando o único recorde aqui que é de fato concedido. Os álbuns mantêm o disco, para que os dois continuem distinguíveis.'],

  'Certification cards name their own type':
    ['Os cartões de certificação dizem o próprio tipo',
     'A parede reúne músicas e álbuns sob um único título que não consegue dizer o que cada cartão é, então agora cada cartão diz o seu.'],

  'Certified centres under the tier word':
    ['Certificado centralizado sob a palavra do nível',
     'A etiqueta é lida como um glifo mais uma palavra, então centralizar embaixo do conjunto todo colocava o rótulo sob os dois e à esquerda de onde deveria ficar.'],

  'A certification tier reads like a plaque':
    ['Um nível de certificação se lê como uma placa',
     'Ouro, Platina e Diamante são o recorde num cartão de certificação, não uma contagem, então o nível aparece em tamanho de placa, com certificado embaixo em vez de na mesma linha. Todos os outros cartões mantêm o número na linha, onde o valor realmente é um número.'],

  'Certification cards say certified':
    ['Os cartões de certificação dizem certificado',
     'O nível é o destaque de um cartão de certificação, então agora ele traz a palavra, e a data embaixo virou um rótulo simples para a mesma palavra não aparecer duas vezes. Os detalhes de apoio estavam pequenos demais e cortados numa linha.'],

  'Long titles wrap too':
    ['Títulos longos também quebram linha',
     'Os títulos dos cartões eram cortados do mesmo jeito, então um título longo com parênteses ficava pela metade. Agora os títulos vão até três linhas e as descrições até duas, o que cobre todos os recordes da aba.'],

  'Long record descriptions wrap':
    ['Descrições longas de recordes quebram linha',
     'Os cartões do carrossel cortavam a linha da seção no meio de uma palavra. Agora ela passa para uma segunda linha, e o cartão reserva as duas, usadas ou não, para as alturas ficarem iguais durante a rolagem.'],

  'The masthead flame keeps its gold':
    ['A chama do cabeçalho mantém o dourado',
     'As listas do histórico mantêm o novo nível máximo azul, enquanto o cabeçalho volta ao dourado — as duas escalas se separam no topo de propósito.'],

  'The longest streaks burn blue':
    ['As sequências mais longas queimam em azul',
     'Os cinco primeiros níveis sobem do âmbar ao vermelho intenso, mas o sexto voltava a um dourado claro que parecia mais fraco que o vermelho abaixo dele. O nível máximo agora queima em azul, que é mais quente que o vermelho.'],

  'Records opens on the artist who holds the most':
    ['Recordes abre com o artista que tem mais',
     'O resumo agora começa pelo artista que aparece em mais linhas de recordes do que qualquer outro, com a foto atrás de um letreiro com todos os recordes dele, e cada cartão com os números daquele recorde.'],

  'Artist total stays visible on mobile':
    ['O total do artista continua visível no celular',
     'O total de reproduções sumia da barra ON AIR em telas estreitas.'],

  'ON AIR counts credited collaborations properly':
    ['ON AIR conta direito as colaborações creditadas',
     'O número do artista comparava o texto do crédito como estava, enquanto todas as paradas de artistas o dividem em nomes individuais, então ele contava a menos em toda colaboração e não batia com a parada de Artistas bem ao lado.'],

  'An ON AIR bar for what you are playing now':
    ['Uma barra ON AIR para o que você está ouvindo agora',
     'O Last.fm já marcava a faixa em andamento em toda sincronização, e o leitor a descartava, porque ela ainda não é um scrobble. Agora uma barra consulta essa faixa e mostra a capa, o título, o artista, um relógio correndo e quantas vezes você já a ouviu.'],

  'Records intro pairs chart size with history':
    ['A introdução de Recordes junta o tamanho da parada com o histórico',
     'A faixa trazia dois dados unidos por uma barra vertical — os tamanhos das paradas e depois quanto histórico as alimenta — que o tempo todo eram as mesmas três colunas. Juntos por período, cada coluna se lê como uma frase: os recordes semanais vêm de um top 10, e existem 517 dessas semanas.'],

  'Total plays for the selected chart run range':
    ['Total de reproduções para o intervalo escolhido do histórico',
     'As estatísticas do histórico ganharam um total que segue o seletor de intervalo, então alternar entre o ano até agora, até este período e todo o histórico responde quanto você realmente ouviu ao lado de como ficou no ranking.'],

  'Heatmap days rain into place':
    ['Os dias do mapa de calor caem como chuva',
     'Cada quadrado de dia agora cai no calendário no seu próprio ritmo, em vez de a grade toda aparecer de uma vez, com uma aleatoriedade grande o bastante para quadrados vizinhos se ultrapassarem em vez de entrarem numa linha certinha.'],

  'Streak records on every chart entry':
    ['Recordes de sequência em cada entrada da parada',
     'Os painéis do histórico ganharam uma quarta seção com recordes de sequência para músicas, artistas e álbuns, em quatro abas — reproduções, dias, meses e anos consecutivos — cada uma com uma lista ordenada, uma faixa de estatísticas e uma visão de detalhe com um bloco por unidade. Só contam sequências de duas ou mais.'],

  /* ========== JULHO 2026 ========== */

  'Certification artwork sitting outside its frame':
    ['A imagem da certificação ficava fora da moldura',
     'O contêiner colocado em volta de cada capa, para o selo do seletor ter onde se ancorar, encolhia até sumir no Mural de Certificações, deixando o espaço do disco centralizado no canto do cartão em vez de na imagem.'],

  'Records column headers stay as you scroll':
    ['Os cabeçalhos das colunas de Recordes ficam fixos na rolagem',
     'As tabelas de Recordes vão muito além de uma tela, e na trigésima linha uma grade de nomes e números já não tinha nada dizendo qual coluna era qual. Agora os cabeçalhos ficam presos no topo enquanto as linhas passam por baixo.'],

  'The artwork picker badge no longer covers the art':
    ['O selo do seletor de imagens não cobre mais a imagem',
     'Em telas de toque o selo ficava sempre em cima das imagens pequenas, escondendo justamente a capa a que pertencia. Lá ele fica totalmente oculto, e um toque de meio segundo em qualquer imagem abre o seletor.'],

  'Milestones as a timeline':
    ['Marcos como linha do tempo',
     'Marcos é uma escada de primeiras vezes, uma linha por nível, cada uma com uma data, então virou uma linha do tempo vertical com um eixo, um ponto por nível e imagem em cada entrada, dividida em três painéis com um seletor.'],

  'Biggest debuts on a podium, with total plays':
    ['As maiores estreias num pódio, com o total de reproduções',
     'O recorde agora mostra as reproduções de todos os tempos ao lado do número da estreia, então uma música que começou forte e parou fica visivelmente diferente de uma que continuou crescendo, e os três primeiros saem da tabela para cartões de pódio.'],

  'New Charts records browsable by type and period':
    ['Recordes de Novas Paradas navegáveis por tipo e período',
     'Dez recordes exibidos como vinte tabelas numa única rolagem viraram duas fileiras de pílulas que mostram um conjunto por vez, por tipo e por período, com as duas escolhas lembradas para a seção reabrir onde você parou.'],

  'Search across every Records table':
    ['Busque em todas as tabelas de Recordes',
     'Uma única caixa acima da navegação de seções filtra as 55 tabelas de uma vez, marcando as linhas que batem, escondendo o resto e mostrando só as seções que ainda têm alguma correspondência — ignorando de propósito os limites e o estado recolhido de cada tabela enquanto está ativa.'],

  'Records opens on an overview':
    ['Recordes abre com um resumo',
     'Antes ela jogava você numa tabela sem explicar por que aquela, o que as outras nove têm ou se alguma delas já tem algo. Agora abre com um cartão por seção, trazendo o melhor recorde de cada uma, com um seletor de Músicas, Artistas e Álbuns.'],

  'Records typography given real hierarchy':
    ['A tipografia de Recordes ganha hierarquia de verdade',
     'Havia sete níveis de rótulo espalhados numa faixa de 2,2 pixels, quatro deles em maiúsculas, e todos menores que os dados que rotulavam. Ler de relance depende de proporção, então eles foram refeitos em quatro tamanhos bem distintos.'],

  'Records sections opened one at a time':
    ['As seções de Recordes abrem uma de cada vez',
     'A aba abria numa visão que mostrava as dez seções de uma vez — umas 55 tabelas e centenas de buscas de imagem numa única rolagem. Essa opção foi removida, e agora as tabelas podem ser ordenadas por qualquer coluna.'],

  'Song of the Moment no longer forced to lowercase':
    ['A Música do Momento não fica mais em minúsculas à força',
     'O cartão mostrava a chave interna de agrupamento, que fica em minúsculas para uma música contar como uma única entrada, não importa como foi digitada. Agora a grafia original da primeira reprodução do período é mantida e exibida.'],

  'Pick artwork from a grid of every source':
    ['Escolha a imagem numa grade com todas as fontes',
     'Clicar no rótulo da fonte passava às cegas por quatro fontes, uma de cada vez. Agora um selo em qualquer imagem abre um seletor com candidatas das quatro de uma só vez, e sua escolha fica fixada naquele item para todos os desenhos futuros, em todas as visões.'],

  'Unreadable selected buttons on Dark Yellow':
    ['Botões selecionados ilegíveis no Amarelo Escuro',
     'Nove dos dez temas têm uma cor de destaque média ou escura, então texto branco sobre um fundo de destaque ficava bom e foi copiado em umas 45 regras. O destaque do amarelo escuro é claro, então toda pílula preenchida nesse tema ficava com contraste de 1,5 para 1 — botões da parada, do histórico e dos lançamentos, praticamente em branco.'],

  'Your Soundtrack stayed on screen under the next tab':
    ['Sua Trilha Sonora ficava na tela embaixo da próxima aba',
     'Era a única visão que faltava na lista de coisas a desmontar na troca.'],

  'The Events icon became a calendar with a ticket':
    ['O ícone de Eventos virou um calendário com um ingresso',
     'Um alfinete de mapa indica lugar, mas a aba reúne aniversários, datas de lançamento e shows — tudo com data, nada com lugar. Agora é um calendário com o dia riscado e um ingresso no canto, o que também o separa dos outros dois calendários da navegação.'],

  'The Last.fm card explains the full setup':
    ['O cartão do Last.fm explica a configuração completa',
     'O campo de nome de usuário é o atalho somente leitura, então o cartão agora diz o que a configuração completa acrescenta — sua própria chave, e corrigir e enviar scrobbles — e leva à parte certa do guia.'],

  'Navigation tab colours pulled apart':
    ['Cores das abas de navegação mais separadas',
     'A primeira fileira passava por quatro tons frios dentro de uns 70 graus, dois deles a só 20 de distância e ambos parecendo lavanda. Os temas claros pioravam isso puxando todos os tons para o destaque. Os tons foram separados.'],

  'Drawn icons on every navigation tab':
    ['Ícones desenhados em todas as abas de navegação',
     'As doze abas trocaram emojis por ícones desenhados. Emojis aparecem na paleta fixa de cada sistema operacional e ignoram o estado da aba; estes pegam a cor da aba, então acompanham o hover e o estado ativo.'],

  'Drawn icons on Sync Now and Settings':
    ['Ícones desenhados em Sincronizar e Configurações',
     'Os caracteres soltos de seta e engrenagem viraram pequenos objetos construídos na mesma linguagem, com a seta de recarregar girando do jeito que uma recarga gira.'],

  'Drawn icons on the masthead stats':
    ['Ícones desenhados nas estatísticas do cabeçalho',
     'Os cinco números usavam emojis, que só conseguem crescer como um bloco e ignoram o estado ao redor. Cada um agora é um pequeno objeto construído que encena o que sua estatística mede quando você passa o mouse.'],

  'Two copies of the sync script had drifted apart':
    ['Duas cópias do script de sincronização tinham se desencontrado',
     'A cópia do guia estava 89 linhas à frente da cópia da janela de configurações, à qual faltava uma seção inteira de busca de gêneros e dois itens de menu que a acionam. Quem copiava a errada ficava com um script que não fazia o que a outra prometia.'],

  'The sync script builds the missing tab itself':
    ['O script de sincronização cria sozinho a aba que falta',
     'Em vez de falhar com um erro preciso mas invisível e deixar você adivinhar o nome da aba e qual célula guarda o quê, o script agora cria a aba Settings quando ela não existe, com os rótulos e o tamanho certos.'],

  'Own-sheet users told to use a tab they do not have':
    ['Quem usa planilha própria era mandado usar uma aba que não tem',
     'Um passo citava uma aba Settings que só existe porque o modelo vem com ela. Com a sua própria planilha essa aba não existe, e a falha é invisível do lado do site — o script dá erro e nenhuma reprodução chega.'],

  'Copying the deployment address was skipped over':
    ['Copiar o endereço da implantação era pulado',
     'Um passo terminava com "depois cole abaixo a URL que ele te der", juntando em silêncio três ações separadas numa frase: clicar em Implantar, passar de novo pelas telas de autorização e achar o endereço na caixa de diálogo que vem depois. Nada avisava que uma URL ia aparecer.'],

  'Steps told people to paste a script already there':
    ['Passos mandavam colar um script que já estava lá',
     'Dois passos mandavam todo mundo abrir o editor de scripts e colar o script, quando o modelo já vem com ele — o que o próprio guia diz com todas as letras algumas linhas depois. A sequência agora tem três passos.'],

  'The auto-sync block asked for the answer before the question':
    ['O bloco de sincronização automática pedia a resposta antes da pergunta',
     'Ele começava exigindo um endereço, depois explicava de onde esse endereço vem e aí despejava 400 linhas de script no meio da janela. A ordem foi invertida para que o que você precisa esteja na sua frente na hora em que precisa.'],

  'Settings speaks the landing page\'s language':
    ['As Configurações falam a mesma língua da página inicial',
     'O seletor de fonte eram três caixas sem graça com glifos provisórios, enquanto a tela inicial apresenta as mesmas três opções com ícones desenhados e adesivos — a mesma decisão com duas personalidades. Os cartões agora reutilizam os ícones da própria página inicial.'],

  'Configure became Settings, in three tabs':
    ['Configurar virou Configurações, em três abas',
     'A janela antiga era uma rolagem comprida com nome de exibição, fuso horário, opções de fonte, campos da planilha, script, certificações, eventos e duas chaves, cada um com um parágrafo embaixo. Agora são três abas — Fonte de dados, Paradas e Perfil — com as opções de fonte refeitas como cartões.'],

  'The web app step undersold itself':
    ['O passo do app da web se vendia mal',
     'Ele dizia ser necessário só para o botão Adicionar reprodução. Na verdade esse endereço libera três coisas: adicionar à mão, enviar edições de volta para a sua planilha, e salvar e reaplicar regras de correção automática. O passo agora começa pelo que ele realmente libera.'],

  'The connect step put in the right order':
    ['O passo de conexão na ordem certa',
     'Ele mandava colar o endereço da planilha antes de mandar compartilhá-la, que é o contrário da ordem em que você precisa fazer. Agora ele percorre as três tarefas reais em sequência, incluindo o que cada opção de compartilhamento significa e uma falha silenciosa que não tinha aviso nenhum.'],

  'The auto-sync step explains itself':
    ['O passo de sincronização automática se explica',
     'Um passo espremia três coisas diferentes em quatro linhas, e a parte mais assustadora — o aviso do Google de app não verificado — era uma nota de rodapé, e não a coisa em que você está prestes a esbarrar. Agora são três seções com nome.'],

  'The setup guide became a step-by-step wizard':
    ['O guia de configuração virou um assistente passo a passo',
     'Um passo por vez, com uma trilha de pontos clicáveis, controles de voltar, pular e avançar, e a sua posição lembrada em cada caminho. O texto completo continua disponível para imprimir e para quem não usa scripts.'],

  'A File Upload guide, and a guide you tick through':
    ['Um guia de Envio de arquivo, e um guia que você vai marcando',
     'O terceiro caminho de configuração foi escrito a partir dos leitores de arquivo reais, e não de memória, cobrindo seis fontes e onde pedir uma exportação em cada uma, e os três caminhos foram refeitos como algo que você percorre em vez de uma parede de texto.'],

  'The setup guide speaks the landing page\'s language':
    ['O guia de configuração fala a mesma língua da página inicial',
     'O fundo da página, os brilhos que seguem o cursor, o piso do equalizador, os cartões de vidro e os rótulos de seção foram levados junto, então chegar de um cartão de fonte parece ir para a sala ao lado, e não para outro prédio.'],

  'Benefit stickers and a recommended ribbon':
    ['Adesivos de vantagens e uma faixa de recomendado',
     'Cada cartão de importação traz um adesivo curto com o único motivo para escolhê-lo — controle total, zero manutenção, início mais rápido — e o Google Sheets vem vestido como a entrada dourada da parada, com uma faixa de recomendado.'],

  'Notes fly over the neighbouring cards':
    ['As notas voam por cima dos cartões vizinhos',
     'A camada da explosão ficava embaixo de todos os cartões, então as notas que saíam do próprio cartão deslizavam por trás do próximo. Agora o cartão clicado sobe enquanto as notas estão no ar, então elas saem de trás dele e passam por cima dos outros.'],

  'A burst of notes when you pick a source':
    ['Uma explosão de notas ao escolher uma fonte',
     'Clicar num cartão de importação lança nove notas de trás dele, cada uma com a cor da identidade daquele cartão, nascendo escondidas atrás dele e só aparecendo quando passam da borda.'],

  'Hand-drawn animated icons on the landing page':
    ['Ícones animados desenhados à mão na página inicial',
     'O link de pular virou um toca-discos cujo prato começa a girar e cujo braço desce quando você passa o mouse, então a ação de retomar faz o gesto de recomeçar um disco, e o vinil ganhou um brilho especular.'],

  'Stronger cursor response':
    ['Resposta mais forte ao cursor',
     'Em círculos de várias centenas de pixels, o movimento original mal era percebido. Ele está cerca de três vezes mais forte e acompanha mais rápido, mas continua amortecido em vez de grudar no cursor.'],

  'Landing glows follow the cursor':
    ['Os brilhos da página inicial seguem o cursor',
     'Os dois brilhos de fundo agora se inclinam na direção do ponteiro, em vez de só repetirem um movimento fixo.'],

  'Bubbling Under translated':
    ['Quase no Top traduzido',
     'A seção inteira aparecia em inglês fixo: título, legenda, os treze selos com suas dicas, a legenda de cores e a lista de faixas. Os botões da parada e Recolher tudo tinham o mesmo problema.'],

  'Last.fm syncs claimed to be connecting to Google Sheets':
    ['Sincronizações do Last.fm diziam estar conectando ao Google Sheets',
     'O texto de status citava o Sheets qualquer que fosse a sua fonte, e trocar de idioma fazia um status em andamento voltar para esse texto — juntos, faziam uma sincronização do Last.fm parecer travada numa conexão que nunca estava acontecendo.'],

  'Hero stats frozen after a big first sync':
    ['Estatísticas principais congeladas depois de uma primeira sincronização grande',
     'A atualização silenciosa em segundo plano nunca recalculava as estatísticas principais, então o total de reproduções, os dias, o artista principal e a sequência ficavam presos nos números iniciais mesmo depois de todo o histórico terminar de carregar.'],

  'Landing page top unreachable with a card open':
    ['Topo da página inicial inalcançável com um cartão aberto',
     'A tela centralizava o conteúdo num contêiner de rolagem fixo, e quando um cartão expandido passava da altura da tela, essa centralização deixava o excesso rolável em uma direção só — deixando o logo no topo fora de alcance para sempre.'],

  'Landing glow clear of the skyline':
    ['Brilho da página inicial longe do horizonte',
     'O brilho da direita ficava em cima das barras do equalizador e as deixava turvas.'],

  'Sheets card text translated':
    ['Textos do cartão do Sheets traduzidos',
     'O botão de modelo, o adesivo de configuração e o divisor estavam preparados para tradução, mas as traduções em si nunca foram adicionadas.'],

  'Google Sheets card redesigned':
    ['Cartão do Google Sheets redesenhado',
     'O cartão do Sheets ganhou um botão de modelo, um adesivo de configuração em 30 segundos e um divisor de já-tenho-uma-planilha. Eles tinham sido enviados junto com uma correção sem relação, sem revisão, e foram documentados à parte quando notados.'],

  'Landing glow circles were invisible':
    ['Os círculos de brilho da página inicial eram invisíveis',
     'Um desfoque pesado espalhava uma cor já fraca por um círculo grande, e depois a transparência do próprio elemento a diluía de novo, sobrando de 2 a 10 por cento da intensidade pretendida — presente no código, ausente na tela.'],

  'Landing buttons unreadable on three light themes':
    ['Botões da página inicial ilegíveis em três temas claros',
     'Uma regra que deixava o texto quase branco tinha sido escrita para o cabeçalho escuro desses temas dentro do app, mas a tela inicial reutiliza a mesma classe direto numa página clara, deixando os botões de tema e idioma quase invisíveis.'],

  'Every landing control excites the room':
    ['Todo controle da página inicial agita a pista',
     'A mesma reação foi estendida ao botão de entrar e aos três cartões de fonte, então mexer em qualquer um deles agita o horizonte, e não só o botão principal.'],

  'The skyline reacts to the demo button':
    ['O horizonte reage ao botão de demonstração',
     'Passar o mouse no botão de demonstração aumenta o espectro e acelera todas as barras, então a pista sente o drop chegando. Navegadores que não conseguem fazer isso simplesmente mantêm a animação em repouso.'],

  'The landing page as a chart show going on air':
    ['A página inicial como um programa de paradas entrando no ar',
     'Vinte e quatro barras de frequência tingidas com a cor de destaque respiram ao longo da borda de baixo, cada uma com sua altura, fase e andamento, para parecer um analisador de verdade e não um padrão repetido.'],

  'The demo button as a now playing chip':
    ['O botão de demonstração como um indicador de "tocando agora"',
     'A pílula simples ganhou cara de player, com três barras de equalizador dançando, que congelam em alturas escalonadas para quem pediu menos movimento, e um degradê que passa ao passar o mouse.'],

  'Charts appear before a long history finishes downloading':
    ['As paradas aparecem antes de um histórico longo terminar de baixar',
     'Numa primeira conexão com um histórico grande, você ficava olhando um esqueleto e um contador de páginas até chegarem todas. Agora as paradas são desenhadas assim que chegam as 20 páginas mais recentes, cerca de 4.000 reproduções, enquanto o resto continua baixando por trás.'],

  'About 1.8 MB of code no longer blocks first paint':
    ['Cerca de 1,8 MB de código não travam mais o primeiro desenho',
     'Três bibliotecas grandes usadas só para exportar imagens e para importar do Spotify e do Deezer foram tiradas da página e agora só são baixadas na primeira vez em que realmente são necessárias.'],

  'Last.fm sync fetches only what is new':
    ['A sincronização do Last.fm só busca o que é novo',
     'Uma sincronização baixava de novo todas as páginas do seu histórico. Agora ela só pede as reproduções mais novas do que o que já está guardado, o que normalmente é uma página só. O download completo acontece na primeira conexão, depois de limpar o cache ou uma vez por semana.'],

  'Instant load from the last copy':
    ['Carregamento instantâneo a partir da última cópia',
     'O que foi guardado por último agora aparece na hora, por mais antigo que seja, e se atualiza em silêncio em segundo plano — sem esqueleto, sem recomeço. Esperar a rede antes de mostrar qualquer coisa era a coisa mais lenta ao abrir o app.'],

  'Album modal sections translated':
    ['Seções da janela de álbum traduzidas',
     'Histórico na parada, Mapa de calor de audição, Histórico de streaming e seus expansores eram textos fixos em inglês que nunca eram traduzidos, na janela de álbum, na de música e nos expansores das linhas da parada.'],

  'Album chart section enlarged and made explorable':
    ['Seção de parada do álbum ampliada e explorável',
     'A tendência mensal e a tabela de detalhamento estavam em letra pequena demais para ler com conforto. O bloco todo foi ampliado e ganhou mais altura, e as barras agora respondem: passar o mouse mostra uma contagem ancorada e um brilho.'],

  'Spanish album modal wording corrected':
    ['Texto da janela de álbum em espanhol corrigido',
     'A posição agora é escrita como ordinal, para ser lida como colocação e não como a afirmação de ser um álbum top, os nomes das certificações usam a forma traduzida em vez do inglês, e vários rótulos abreviados em espanhol foram escritos por extenso.'],

  'Featured artist labels translated':
    ['Rótulos do artista em destaque traduzidos',
     'O rótulo do banner e todos os rótulos e notas dos blocos tinham sido escritos como textos fixos em inglês que passavam totalmente por fora do sistema de tradução.'],

  'Featured artist album and song cards expanded':
    ['Cartões de álbum e música do artista em destaque ampliados',
     'Álbum favorito e música favorita agora escolhem os mais ouvidos e mostram as próprias sequências de reproduções e de dias, calculadas do mesmo jeito que leva em conta as colaborações. Vários rótulos estranhos dos blocos foram reescritos.'],

  'Featured artist streaks made consistent':
    ['Sequências do artista em destaque agora coerentes',
     'A sequência de reproduções e a sequência do álbum favorito usavam definições diferentes, e nenhuma contava faixas de colaboração como continuação da sequência de um artista, o que deixava a sequência do álbum passar da sequência de reproduções dentro da qual ela está. Agora as duas percorrem a mesma linha do tempo com a mesma forma de comparar.'],

  'Artist Milestone artwork falls back too':
    ['Imagens de Marcos de artista também têm alternativa',
     'As linhas ficavam em branco sempre que a única fonte consultada não encontrava a faixa do marco.'],

  'Listening Streaks recap reworked':
    ['Resumo de Sequências de audição refeito',
     'Um contador ao vivo da sequência atual e um link para a janela de sequências ficam estranhos numa visão retrospectiva, então foram trocados por um número de cobertura de dias ativos, e os cartões de recorde agora dizem claramente o que são.'],

  'Wrong artist photos corrected':
    ['Fotos de artista erradas corrigidas',
     'Buscar o nome de um artista muitas vezes devolve vários perfis sem relação com o mesmo nome, incluindo entradas vazias, e o primeiro era usado, fosse qual fosse. Agora as correspondências com o mesmo nome são ordenadas por seguidores e as imagens em branco conhecidas são filtradas.'],

  'Soundtrack artwork falls back properly':
    ['Imagens da Trilha Sonora com alternativa de verdade',
     'Os cartões do coverflow tentavam uma fonte só e desistiam, ao contrário das tabelas da parada, que passam por várias. A imagem do cartão central também pode ser clicada para trocar de fonte à mão, e a escolha é lembrada.'],

  'January compared against the previous December':
    ['Janeiro comparado com o dezembro anterior',
     'Janeiro não tinha com o que se comparar dentro de um período filtrado por ano, então agora usa o dezembro anterior, mostrando um zero quando realmente não há dados anteriores, para o layout continuar consistente.'],

  'Chart History Replay redesigned':
    ['Reprise do histórico da parada redesenhada',
     'Fotos de artistas, selos de movimento, uma barra de progresso e controles de tocar, pausar e velocidade. As linhas agora continuam entre as semanas e deslizam para as novas posições, como na corrida de barras da parada principal, em vez de piscarem com conteúdo novo a cada passo.'],

  'Awards never appeared on the Soundtrack tab':
    ['Os prêmios nunca apareciam na aba Trilha Sonora',
     'A consulta tentava percorrer um objeto simples como se fosse uma lista, o que dá erro, abandonando em silêncio a seção inteira toda vez. Ela também foi refeita como cartões de estante de troféus, com imagem e número de vitórias.'],

  'Milestone lists paginated':
    ['Listas de marcos paginadas',
     'A lista de artistas nunca teve de fato um limite de altura, porque a regra que cortava citava só a outra lista, então um histórico longo despejava quase tudo de uma vez. Agora as duas ficam numa caixa de altura fixa que mostra 25 por vez.'],

  'A time zone bug in the streak count':
    ['Um bug de fuso horário na contagem de sequências',
     'O percurso pela sua sequência atual misturava datas lidas como horário universal com datas lidas como horário local, o que podia contar a menos e produzir uma sequência atual mais longa que a melhor de todos os tempos com a qual era comparada. Uma sequência ao vivo que bate o recorde agora se junta ao cartão de todos os tempos com um selo de Novo recorde, em vez de dois cartões se contradizendo.'],

  'More milestone checkpoints':
    ['Mais pontos de marco',
     'Os totais gerais agora marcam a cada 25.000 depois de 10.000, fechando um salto direto de 100.000 para 250.000 que pulava números redondos como 200.000. Os marcos de artista avançam a cada 500 em vez de pararem em 10.000, e dividem créditos separados por vírgula como o resto da aba.'],

  'Milestones split into yours and artists\'':
    ['Marcos divididos entre os seus e os dos artistas',
     'A seção parecia uma única linha do tempo, o que fazia um artista passando de um número de reproduções parecer um dos seus próprios totais de audição. Agora são duas seções claramente identificadas.'],

  'Monthly Activity became inspectable':
    ['A Atividade mensal ficou explorável',
     'As barras eram pequenas, com pouco contraste e paradas. Cada mês agora é um alvo de toque que abre a contagem, a fatia do total, a variação em relação ao mês anterior e o artista principal, com um selo dourado no pico, listras nos meses calmos e uma pílula de tendência comparando a segunda metade do período com a primeira.'],

  'Generic silhouette avatars filtered out':
    ['Avatares genéricos de silhueta filtrados',
     'O Deezer devolve um gráfico fixo de "sem foto" em vez de um resultado vazio, então o filtro que devia pegar imagens ausentes o deixava passar como se fosse uma foto de verdade.'],

  'Coverflow polish and split artist credits':
    ['Acabamento do coverflow e créditos de artista divididos',
     'Cabeçalhos maiores, espaçamento mais justo, e o emoji de medalha trocado por numerais simples sobre um degradê, porque emojis aparecem de forma diferente em cada sistema e eram difíceis de ler nesse tamanho. Créditos separados por vírgula agora contam para cada artista.'],

  'Coverflow scrolling overshot':
    ['A rolagem do coverflow passava do ponto',
     'Cada clique da roda movia cerca de 1,7 cartão, pulando direto a entrada vizinha. Agora cada evento é limitado a um cartão. Imagens e texto foram ampliados em toda a seção.'],

  'Top Artists and Songs as coverflow':
    ['Principais artistas e músicas como coverflow',
     'As duas listas de top cinco viraram carrosséis de largura total com os cinquenta primeiros, controlados por arrastar, roda, teclado e toque.'],

  'At-risk saving covers artist and album streaks':
    ['Salvar sequências em risco inclui as de artistas e álbuns',
     'Salvar playlist e Copiar lista de faixas só incluíam sequências de músicas, então as sequências de artistas e álbuns em risco naquele dia ficavam de fora em silêncio. Agora elas puxam a faixa ouvida mais recentemente de qualquer um que ainda não esteja representado, verificando álbuns antes de artistas para nada se repetir.'],

  'Loyalty Score as a chart stamp':
    ['A Pontuação de fidelidade como um carimbo da parada',
     'O anel sem graça e os cartões genéricos viraram um carimbo postal inclinado, um veredito com traço de marca-texto, uma contagem de artistas que voltam e cartões de artista em forma de canhoto de ingresso com bordas picotadas.'],

  'Larger, clearer stat tiles':
    ['Blocos de estatísticas maiores e mais claros',
     'Os ícones foram para a mesma linha dos rótulos e todos os tamanhos aumentaram para facilitar a leitura.'],

  'The number one artist as a banner':
    ['O artista número um como banner',
     'Um cartão de destaque maior, com um banner de foto esmaecido atrás do texto e uma colagem de estatísticas só daquele artista: dias ouvido, seu maior dia, sequências de dias e de reproduções, álbuns e músicas ouvidos, sequência do álbum favorito e música mais ouvida.'],

  'The Reel':
    ['O Carrossel',
     'Clicar em qualquer estatística principal troca um carrossel abaixo da faixa que mostra o que está por trás daquele número, reaproveitando os cartões da Máquina do Tempo e o menu de ações dela.'],

  'Your Soundtrack rebuilt as a story':
    ['Sua Trilha Sonora refeita como uma história',
     'Um redesenho completo: uma abertura em blocos de cor, blocos de estatísticas, uma linha do tempo de marcos, cartões de sequência com chamas e um anel de fidelidade circular. Novas descobertas virou um aquário flutuante de retratos de artistas que sobem, flutuam e se renovam sem fim, com peso para os seus mais ouvidos reaparecerem com mais frequência, e que pausa quando você passa o mouse.'],

  'Section display toggles were not syncing':
    ['As chaves de exibição das seções não sincronizavam',
     'A lista de configurações a sincronizar citava uma chave antiga que nada usava mais, em vez da atual, então as chaves do menu de três pontinhos eram salvas localmente mas nunca chegavam à sua conta, e voltavam ao padrão num navegador novo.'],

  'The same menu on Recent Releases':
    ['O mesmo menu em Lançamentos Recentes',
     'Esses já saíram, então o menu também oferece o player — mas só quando o álbum realmente tem histórico de reproduções; caso contrário, volta às opções de busca.'],

  'Sub-chart toggles showing on the wrong tabs':
    ['Botões das subparadas aparecendo nas abas erradas',
     'Os botões Parada, Quase no Top, Fora da Parada e Novas Entradas continuavam visíveis em Eventos, Recordes, Prêmios e Dados Brutos, porque só as seções eram escondidas, e não a barra de botões ao lado.'],

  'The same menu on Upcoming Releases':
    ['O mesmo menu em Próximos Lançamentos',
     'Estendido às seções de próximos lançamentos nos quatro modos de visão. Aqui não há opção de player, porque esses discos ainda não saíram.'],

  'Time Machine cards offer a choice':
    ['Os cartões da Máquina do Tempo oferecem opções',
     'Clicar num cartão fazia uma única ação fixa. Agora abre um menuzinho: buscar no Spotify, buscar no Google ou usar o player do app. Artistas e álbuns também oferecem suas últimas dez músicas, para pôr na fila uma por uma ou todas de uma vez.'],

  'Larger navigation text':
    ['Texto de navegação maior',
     'Os rótulos das abas eram pequenos demais para ler com conforto.'],

  'Album streaks nest inside artist runs':
    ['Sequências de álbum ficam dentro das sequências do artista',
     'Ouvir uma discografia álbum por álbum gerava uma sequência de álbum que zerava a cada disco, escondendo a sequência maior do artista por baixo. Agora a sequência do artista é tratada como a sequência real e comanda o banner, com o álbum atual como uma etiqueta interna, em vez de competir com ela.'],

  'Chart titles cut off on dark themes':
    ['Títulos de parada cortados nos temas escuros',
     'Um fundo de pílula e um espaçamento que todos os temas claros já tinham removido continuavam nos temas escuros, e esse espaçamento extra bastava para empurrar o título além do ponto em que ele é cortado no celular.'],

  'New Entries headers made scannable':
    ['Cabeçalhos de Novas Entradas fáceis de ler de relance',
     'O cabeçalho era uma frase longa fazendo papel de título, então diferenciar as três seções exigia ler tudo. Agora cada uma tem um nome curto, com o detalhe embaixo como subtítulo.'],

  'Lifetime weeks and final streak separated':
    ['Semanas totais e sequência final separadas',
     'O número de semanas de uma saída é um total de toda a vida, que pode abranger várias passagens separadas, e tinha sido trocado só pela sequência que terminou, perdendo esse contexto. Ele voltou, e um rótulo distinto agora mostra à parte a sequência consecutiva final, quando houve uma.'],

  'Peak rank on dropouts':
    ['Posição máxima nas saídas',
     'Uma saída que já esteve melhor do que a posição de onde acabou de cair mostra o seu pico, exibido só quando o pico realmente supera essa última posição, para nunca repetir o óbvio.'],

  'Dropouts linked to where they landed':
    ['Saídas ligadas a onde foram parar',
     'Cada saída é cruzada com a zona Quase no Top desta semana e mostra a nova posição ali, com os mesmos selos que essa seção usa, então uma música que sai da parada e aparece logo abaixo é lida como um único acontecimento, e não dois sem relação.'],

  'Off the Chart improved':
    ['Fora da Parada melhorado',
     'Uma mensagem de comemoração quando nada saiu, em vez de a seção sumir em silêncio; o número de semanas esclarecido para não ser confundido com a sequência do Quase no Top; e as saídas de posições altas marcadas como as perdas mais sérias que são.'],

  'Streak banner edges misaligned on mobile':
    ['Bordas do banner de sequência desalinhadas no celular',
     'O banner ficava recuado enquanto as barras de cima e de baixo iam de ponta a ponta, então as bordas não se alinhavam. Esconder um espaçador no celular também tinha juntado o rótulo e o número num lado, em vez de ocuparem a barra toda.'],

  'Navigation hint quietened':
    ['Dica de navegação mais discreta',
     'A pílula flutuante com fundo e borda virou um texto simples e apagado, colado à barra de cima em vez de flutuar num vão.'],

  'This Week\'s stats given a hierarchy':
    ['As estatísticas desta semana ganham hierarquia',
     'Doze blocos idênticos com borda viraram três níveis: totais principais, destaques e cartões com imagem para os números do momento, cada categoria com sua própria cor de destaque.'],

  'Navigation inside the Charts Guide':
    ['Navegação dentro do Guia de Charts',
     'Vinte seções empilhadas sem jeito de chegar direto a nenhuma. Foi adicionada uma fileira fixa de links de atalho, os links agora podem apontar para uma seção específica, e as seções só de consulta ficam recolhidas por padrão para a página continuar fácil de percorrer.'],

  'Stack ranks invisible on light themes':
    ['Posições da visão Pilha invisíveis nos temas claros',
     'Os números de posição estavam fixos num branco translúcido que só era trocado para os três primeiros, então do quarto lugar para baixo tudo sumia num fundo claro.'],

  'Proper icons on the chart toggles':
    ['Ícones de verdade nos botões da parada',
     'Os botões de tipo e os cabeçalhos de seção trocaram glifos unicode e emojis por ícones desenhados.'],

  'Album certifications as vinyl cards':
    ['Certificações de álbum como cartões de vinil',
     'A grade simples de selos da janela de álbum foi trocada pela mesma moldura por níveis e pelo disco girando do Mural de Certificações, com as capas reais carregadas.'],

  'Open a detail page from any view':
    ['Abra uma página de detalhes a partir de qualquer visão',
     'Só a visão de tabela deixava clicar para abrir um artista, álbum ou música. Agora todos os layouts deixam, e a dica de cada linha foi para o subtítulo da seção, onde é dita uma vez em vez de em toda linha. A visão Pilha também ganhou os títulos das músicas, que ela pulava.'],

  'Show one chart type at a time':
    ['Mostre um tipo de parada por vez',
     'Um seletor acima das seções da parada mostra só Músicas, Artistas ou Álbuns, junto com o Quase no Top, o Fora da Parada e as Novas Entradas daquele tipo. A escolha é lembrada e continua valendo ao trocar de período.'],

  'Mobile navigation rebuilt as an icon grid':
    ['Navegação no celular refeita como grade de ícones',
     'O layout de desktop espremia os rótulos traduzidos em fileiras desiguais no celular, e a rolagem horizontal pensada como plano B cortava em silêncio Playlists e Guia de Charts por inteiro, porque o tratamento de excesso da segunda fileira — necessário para a animação de recolher — engolia a rolagem. As abas também foram reordenadas para o celular.'],

  'Play buttons on Off the Chart entries':
    ['Botões de reprodução nas entradas do Fora da Parada',
     'Músicas tocam direto e artistas e álbuns abrem o seletor de faixas, como nas outras seções, e a chave de mostrar e esconder de cada seção agora também os cobre.'],

  'Off the Chart split by type':
    ['Fora da Parada dividido por tipo',
     'O painel único combinado com três colunas virou três seções independentes, cada uma logo abaixo do bloco Quase no Top do seu tipo, então músicas, artistas e álbuns são lidos cada um como uma história contínua.'],

  'Three more surface colours frozen on the dark theme':
    ['Mais três cores de superfície congeladas no tema escuro',
     'A mesma falha da cor de texto anterior: três valores de superfície eram definidos uma vez só dentro do tema escuro padrão, e não em cada tema, então todo tema claro voltava em silêncio para um fundo azul-marinho escuro onde eles eram usados, incluindo os cartões de categoria de Prêmios. Várias cores fixas de Prêmios também foram corrigidas.'],

  'Best Day tile recoloured':
    ['Bloco Melhor dia com nova cor',
     'Agora ele usa a mesma cor de destaque de Total de reproduções em vez de âmbar, formando par com os dois números ao lado.'],

  'Spanish previous-rank header shortened':
    ['Cabeçalho de posição anterior em espanhol encurtado',
     'Ele transbordava e quebrava linha onde os outros cabeçalhos de coluna não quebravam.'],

  'A text colour frozen on the default theme':
    ['Uma cor de texto congelada no tema padrão',
     'Uma cor de texto só era definida dentro do tema escuro padrão, então o valor ficava preso no quase branco desse tema e todos os outros temas o herdavam em vez do próprio. Nos temas claros, isso deixava coisas como nomes de playlists quase invisíveis.'],

  'Gold certification icon changed to a coin':
    ['Ícone da certificação de Ouro vira uma moeda',
     'A estrela conflitava com as estrelas já usadas para picos na parada e rankings anuais, então os selos de ouro pareciam mais um marcador de pico. Trocado em todo lugar onde aparece um selo de ouro.'],

  'Options menu wrapping off the header':
    ['Menu de opções saindo do cabeçalho',
     'Quando o título de uma parada era longo, o botão do menu pulava para a linha seguinte e levava a lista suspensa para a borda errada. Agora o título é cortado.'],

  'Chart run button given its own column':
    ['O botão do histórico ganha coluna própria',
     'Ele dividia a célula da posição, então a coluna de posição às vezes mostrava um ícone em vez de um número. Agora tem coluna própria em todas as tabelas de parada e janelas de histórico, e usa um ícone de linha em vez de um emoji colorido.'],

  'Previous rank moved next to Rank':
    ['Posição anterior ao lado da Posição',
     'A posição anterior agora fica logo depois da posição, em vez de mais adiante na linha, onde a comparação realmente é útil, com um subtítulo empilhado para identificá-la.'],

  'Backend security updates':
    ['Atualizações de segurança do servidor',
     'Dez vulnerabilidades relatadas em dependências do servidor foram fechadas, incluindo contrabando de requisições, um desvio de restrição entre origens, uma sobrescrita via link simbólico e um vazamento de credenciais.'],

  'Tactile date navigation':
    ['Navegação de datas tátil',
     'Os botões de anterior e próximo afundam ao serem clicados e aparecem como setas de verdade em vez de setas de texto, com os rótulos mantidos em todos os idiomas.'],

  'Stylesheet cache bumped again':
    ['Cache da folha de estilos renovado de novo',
     'A redução da navegação não aparecia porque o navegador servia a folha de estilos em cache sob um endereço que não tinha mudado.'],

  'Second navigation row reads as secondary':
    ['A segunda fileira de navegação parece secundária',
     'Texto menor, espaçamento mais justo e uma leve queda de opacidade em repouso, voltando ao total com o mouse em cima, para Recordes, Eventos e Prêmios ficarem visivelmente abaixo das abas principais de período.'],

  'A sliding indicator on the tabs':
    ['Um indicador deslizante nas abas',
     'Uma barra por fileira desliza até a aba ativa com um movimento elástico, no lugar de um sublinhado que pulava de repente entre os botões.'],

  'The play count rolls like an odometer':
    ['A contagem de reproduções gira como um hodômetro',
     'Cada dígito que muda gira a partir do valor anterior na sincronização, em vez de o número inteiro trocar de uma vez.'],

  'Stat cards paired with their counterparts on mobile':
    ['Cartões de estatística ao lado dos seus pares no celular',
     'As três faixas agora viram uma única grade no celular, para cada número principal ficar ao lado do cartão relacionado — Total de reproduções ao lado de Melhor dia — sem mudar nada no layout de desktop.'],

  'Streak close button overlapping the filter bar':
    ['Botão de fechar das sequências sobre a barra de filtros',
     'Os dois estavam presos no mesmo ponto no topo da área de rolagem no celular e apareciam um em cima do outro.'],

  'Oversized placeholders on releases without artwork':
    ['Marcadores enormes em lançamentos sem capa',
     'O marcador com iniciais sempre usava o tamanho grande de bloco, então um lançamento sem capa aparecia como uma caixa enorme na visão de tabela, em vez de uma miniatura normal.'],

  'Masthead controls get out of the way on mobile':
    ['Os controles do cabeçalho saem da frente no celular',
     'Os botões de tema, dia e idioma somem depois de alguns segundos sem rolagem e voltam quando você rola ou abre um painel, para não ficarem em cima do conteúdo em repouso. Eles também foram colocados acima da barra de data fixa, com a qual colidiam.'],

  'Size tab back to a list':
    ['A aba Tamanho volta a ser uma lista',
     'A grade de duas colunas com pílulas preenchidas não funcionou visualmente; voltou à mesma lista de linhas que a aba Visão usa.'],

  'Stale stylesheet served through the menu rewrite':
    ['Folha de estilos velha servida depois da reescrita do menu',
     'A versão da folha de estilos não tinha sido atualizada, então os navegadores podiam continuar servindo uma cópia antiga em cache — incluindo um erro de layout já corrigido — mesmo depois de todo o resto ter sido atualizado.'],

  'Chart controls gathered into one menu':
    ['Controles da parada reunidos num só menu',
     'As fileiras espalhadas de botões para exibição, tamanho, visão, exportar, compartilhar e reproduzir foram juntadas num único menu de opções no cabeçalho de cada seção, com as abas Mostrar, Tamanho, Visão e Ações, que lembra a última aba usada.'],

  'Page through the streak graveyard':
    ['Folheie o cemitério de sequências',
     'As sequências encerradas eram limitadas às 25 primeiras, sem jeito de ver além delas. A paginação deixa todas as sequências encerradas acessíveis.'],

  'Hiding play buttons missed two sections':
    ['Esconder os botões de reprodução esquecia duas seções',
     'A chave de cada seção só cobria as três seções principais da parada, então Quase no Top e Novas Entradas continuavam mostrando os botões de reprodução depois que você os desligava.'],

  'Calendar numbers matched':
    ['Números do calendário padronizados',
     'O ano ao lado do nome do mês e os números dos dias nos calendários de eventos e do New Music Friday.'],

  'Awards numbers matched':
    ['Números de Prêmios padronizados',
     'O seletor de ano, os selos de ano e o contador de etapas da cerimônia.'],

  'Soundtrack milestones and streaks matched':
    ['Marcos e sequências da Trilha Sonora padronizados',
     'Os títulos restantes com números e as contagens de sequência.'],

  'Your Soundtrack numbers matched':
    ['Números da Sua Trilha Sonora padronizados',
     'O ano grande, as estatísticas, as contagens do artista e da música principais, os números da atividade mensal e a porcentagem de fidelidade passaram todos para a fonte compartilhada.'],

  'Guide year numbers matched':
    ['Anos do guia padronizados',
     'Os anos na seção "neste dia" do guia.'],

  'Guide statistics matched to the rest':
    ['Estatísticas do guia padronizadas com o resto',
     'Os números de resumo do Guia de Charts ainda estavam na fonte antiga.'],

  'Wordmark and stat numbers settle on one face':
    ['Logotipo e números de estatísticas ficam numa fonte só',
     'Depois de testar os dois experimentos, o logotipo e os números grandes foram unificados na fonte sem serifa da interface que já existia, e o espaçamento entre letras voltou agora que os glifos são proporcionais de novo.'],

  'Wordmark in Martian Mono':
    ['Logotipo em Martian Mono',
     'Uma fonte monoespaçada diferente só para o logotipo, com o tamanho máximo reduzido porque seus glifos mais largos precisam de mais espaço.'],

  'Wordmark on the mono face':
    ['Logotipo na fonte monoespaçada',
     'O logotipo passou para a fonte monoespaçada para todo o conjunto do cabeçalho ser lido como uma única tipografia, com o espaçamento suavizado para combinar.'],

  'Stat numbers in a scoreboard face':
    ['Números de estatística numa fonte de placar',
     'Nem a fonte de títulos nem a monoespaçada combinavam com os números grandes, então seis candidatas reais foram desenhadas para comparar e foi escolhida uma condensada em negrito, mais próxima de uma contagem regressiva de paradas.'],

  'Stat numbers in the data font':
    ['Números de estatística na fonte de dados',
     'Os números grandes passaram para a mesma fonte já usada nas contagens de reproduções das tabelas.'],

  'Redesign review fixes':
    ['Correções da revisão do redesenho',
     'Três valores de empilhamento eram referenciados mas nunca foram definidos, porque o script que deveria adicioná-los parou antes de gravar, deixando dez regras de sobreposições e dicas sem ordem de empilhamento nenhuma. Eles foram definidos e corrigidos para os valores originais.'],

  'Redesign: the standalone pages caught up':
    ['Redesenho: as páginas avulsas se atualizam',
     'O guia de configuração e as páginas de privacidade e termos passaram para as novas fontes e paletas suavizadas, e um transbordamento que já existia na grade de passos do guia e na tabela de dados de privacidade foi corrigido.'],

  'Redesign: mobile overflow eliminated':
    ['Redesenho: transbordamento no celular eliminado',
     'As barras de tamanho de seção transbordavam telas estreitas e o cabeçalho tinha dois pixels a mais de largura. Em 375 pixels a página agora não tem nenhum transbordamento horizontal em nenhuma visão, contra uma base que ia de 379 a 468 pixels.'],

  'Redesign: modals, controls and focus':
    ['Redesenho: janelas, controles e foco',
     'As janelas ganharam um desfoque de vidro, cantos mais arredondados e sombras mais profundas. Todos os valores de empilhamento avulsos foram migrados para uma única escala documentada, mantendo exatamente a ordem, e foi adicionado um anel de foco visível para quem usa o teclado.'],

  'Redesign: tables and dense data':
    ['Redesenho: tabelas e dados densos',
     'Um realce comum ao passar o mouse nas tabelas da parada, de dados brutos e de eventos, cores de medalha passadas para variáveis que atendem ao contraste nos temas claros, e as antigas faixas laterais dos três primeiros removidas, já que a cor da linha já diz isso.'],

  'Redesign: sections, depth and card grids':
    ['Redesenho: seções, profundidade e grades de cartões',
     'Os cartões da parada ganharam bordas translúcidas e sombras em camadas, Novas Entradas e Quase no Top trocaram as faixas laterais por painéis internos coloridos, e a faixa de estatísticas virou cartões separados que sobem ao passar o mouse, em vez de uma grade de planilha de um pixel.'],

  'Redesign: masthead and navigation':
    ['Redesenho: cabeçalho e navegação',
     'O cabeçalho agora tira o degradê e o brilho do tema, em vez de ter uma versão escrita à mão para cada tema, então todo tema escuro se colore corretamente e quatro regras redundantes foram apagadas. Os cabeçalhos claros foram suavizados e a navegação foi modernizada.'],

  'The 2026 redesign: tokens, colour and type':
    ['O redesenho de 2026: variáveis, cor e tipografia',
     'A base de uma renovação visual completa. As dez paletas de temas foram suavizadas e tiveram o contraste verificado, um único conjunto de valores de design passa a controlar espaçamento, arredondamento, movimento e profundidade, e o app mudou para um novo par de fontes. Uma cor de grade que faltava, e que fazia as linhas dos gráficos aparecerem escuras nos temas claros, foi adicionada a todos os temas.'],

  'Chart tables fit a phone without sideways scrolling':
    ['As tabelas da parada cabem no celular sem rolagem lateral',
     'Espaçamentos e larguras de coluna eram pensados para desktop, empurrando a coluna Reproduções para fora da borda. O espaçamento foi apertado e rótulos curtos de coluna foram adicionados, então a tabela inteira cabe entre 320 e 414 pixels de largura.'],

  'Modals that trapped you on a phone':
    ['Janelas que prendiam você no celular',
     'As janelas de fonte de dados, de detalhes e de sequências podiam ficar mais altas que a tela do celular, rolando o botão de fechar para fora de alcance, sem outra saída. Agora os controles de fechar ficam fixos no celular. Um transbordamento horizontal foi corrigido ao mesmo tempo.'],

  'Ten correctness bugs from a review pass':
    ['Dez bugs de funcionamento encontrados numa revisão',
     'Entre eles: o mapa de calor e o histórico da janela de música sempre voltavam vazios porque a chave que procuravam era codificada de um jeito e guardada de outro; e qualquer nome com apóstrofo quebrava os controles ligados a ele, porque a codificação deixava os apóstrofos intactos. Nada de um nome como "Guns N\' Roses" respondia.'],

  /* ========== JUNHO 2026 ========== */

  'Bubbling Under badges refined again':
    ['Selos do Quase no Top refinados de novo',
     'Ressurgente aparecia em músicas que caíam da parada para a zona e ficavam ali, o que não é um ressurgimento — elas nunca saíram para voltar. Essas agora ganham um novo selo, Resistindo; Yo-Yo passou a se chamar Vai e Volta, e os ícones foram atualizados.'],

  'A different chart size per section':
    ['Um tamanho de parada diferente por seção',
     'Cada seção tem o próprio seletor de tamanho, em vez de uma barra global, lembrado separadamente em cada período, então Músicas pode ser um top 10 enquanto Artistas é um top 50 e Álbuns um top 25. As configurações globais existentes são levadas junto no primeiro carregamento.'],

  'Share button moved right':
    ['Botão Compartilhar movido para a direita',
     'Nas seções de artistas e álbuns, para combinar com as outras.'],

  'Album play buttons offered a track list everywhere':
    ['Botões de reprodução de álbum oferecem a lista de faixas em todo lugar',
     'Fora da visão de tabela, apertar play num álbum buscava o título do álbum como se fosse uma música. Agora todas as visões mostram a mesma lista de faixas que a tabela mostrava.'],

  'Better default layouts':
    ['Layouts padrão melhores',
     'Artistas abrem em Mosaico e Álbuns em Grade de cartões, que combinam mais com eles do que uma tabela.'],

  'Uniform action buttons':
    ['Botões de ação padronizados',
     'Um estilo único e consistente nos botões de ação, que foram para baixo do subtítulo.'],

  'Section controls reorganised':
    ['Controles de seção reorganizados',
     'Botões de ação à esquerda, chaves de exibição à direita.'],

  'A different view mode per section':
    ['Um modo de visão diferente por seção',
     'Músicas, Artistas e Álbuns lembram cada um o próprio layout, em vez de os três mudarem juntos.'],

  'Display controls per section':
    ['Controles de exibição por seção',
     'O menu de exibição e o botão de exportar foram para o cabeçalho de cada seção, e Músicas, Artistas e Álbuns ganharam cada um um conjunto completo e independente de chaves — esconder os selos de certificação nas músicas não os esconde mais nos álbuns.'],

  'More room to breathe':
    ['Mais espaço para respirar',
     'Mais espaçamento dentro dos cartões, mais espaço entre eles e cabeçalhos mais altos.'],

  'Chart sections became cards':
    ['As seções da parada viraram cartões',
     'Cantos arredondados, uma borda, um fundo e espaçamento dão a cada seção a própria superfície, em vez de tudo se misturar.'],

  'Copy Tracklist copies immediately':
    ['Copiar lista de faixas copia na hora',
     'O botão foi renomeado e agora copia a lista assim que é apertado, e continua abrindo a janela para mostrar o que foi copiado e confirmar.'],

  'Export your at-risk streaks as a tracklist':
    ['Exporte suas sequências em risco como lista de faixas',
     'Um quarto botão em Em risco hoje abre a janela de exportação já carregada com essas músicas, num formato que os serviços de transferência aceitam, com sugestões de nome de playlist pensadas para a ocasião.'],

  'Peak boxes made to stand out':
    ['As caixas de pico ganham destaque',
     'A caixa que marca a semana de pico ganhou um preenchimento mais forte e um brilho âmbar, com tratamentos dourado e roxo diferentes para os picos na parada combinada e na linha do tempo do Quase no Top.'],

  'Chart run boxes unreadable on light themes':
    ['Caixas do histórico ilegíveis nos temas claros',
     'As caixas tinham uma borda branca que sumia, cores fracas demais para ver e números de posição em neon. Bordas, intensidade do fundo e cores do texto foram corrigidas nos temas claros.'],

  'Bubbling Under badges invisible on light themes':
    ['Selos do Quase no Top invisíveis nos temas claros',
     'Os treze tipos de selo usavam uma paleta neon que praticamente sumia num fundo claro. Cada um agora tem uma versão para tema claro, com texto forte no mesmo tom sobre uma cor suave.'],

  'Navigation polish':
    ['Acabamento da navegação',
     'O botão Mais foi para baixo das duas fileiras, cantos arredondados e bordas, espaço em volta do banner de sequência e ícones renovados.'],

  'Eleven improvements to the navigation':
    ['Onze melhorias na navegação',
     'Ícones em todas as abas, um sublinhado marcando a ativa, uma cor que diferencia a segunda fileira, prévias ao passar o mouse, as teclas de 1 a 9 como atalhos, selos marcando conteúdo novo, links compartilháveis para cada aba, um brilho de carregamento, uma segunda fileira recolhível e uma barra que encolhe na rolagem.'],

  'The Charts Guide filled out':
    ['O Guia de Charts completo',
     'Vinte seções cobrindo todos os recursos: um tour guiado, busca, suas estatísticas, uma lista de configuração, neste dia, sugestões, joias escondidas, atalhos de teclado, um detalhamento de cada aba, um glossário, perguntas frequentes, uma linha do tempo, um registro de mudanças, guias de exportação e um formulário de feedback. A navegação foi dividida em duas fileiras para caber tudo.'],

  'The Charts Guide':
    ['O Guia de Charts',
     'Uma aba que explica o app de dentro dele, acessível pela barra de navegação, junto com correções em nove lugares onde os temas claros tinham contraste ilegível.'],

  'Collapse All reads as a global control':
    ['Recolher tudo parece um controle geral',
     'Ele tinha o estilo de uma parte do menu de exibição logo abaixo. O fundo de barra de ferramentas foi tirado e ele foi separado, para ser lido como algo que age sobre todas as seções, e não como mais uma opção de exibição.'],

  'Light themes redesigned around white cards':
    ['Temas claros redesenhados em torno de cartões brancos',
     'Os cinco temas claros agora colocam branco puro atrás das tabelas, cartões e janelas, para o conteúdo se destacar da página, e a página em si ganha um tom mais saturado da cor do tema para emoldurar. Os cabeçalhos azul-marinho e roxo foram escurecidos para continuar se destacando dos fundos mais fortes.'],

  'Collapse All':
    ['Recolher tudo',
     'Uma barra acima das seções da parada recolhe ou expande Músicas, Artistas, Álbuns, Fora da Parada, Quase no Top e Novas Entradas com um clique, e fica sincronizada quando as seções são abertas ou fechadas uma a uma.'],

  'Twelve improvements to the queue':
    ['Doze melhorias na fila',
     'Faixas já tocadas não somem mais — ficam esmaecidas acima da atual, com o que vem a seguir embaixo. Cada item ganhou um botão para ir ao topo, remoções podem ser desfeitas por quatro segundos, duplicadas podem ser removidas com um toque, e a fila pode ser salva como playlist.'],

  'The player redesigned as a vertical card':
    ['O player redesenhado como um cartão vertical',
     'A faixa horizontal apertada, com catorze botões quebrando em várias linhas, foi trocada por um cartão de verdade: um cabeçalho com a alça de arrastar e os controles de janela, um quadrado grande com a capa, uma barra de progresso de largura total, um botão de play em destaque ladeado por repetir, pular e volume, e os onze controles restantes numa única linha fina embaixo.'],

  'Clear the queue, and resume from Playlists':
    ['Limpe a fila, e retome pelas Playlists',
     'Um botão para esvaziar a fila e um botão Retomar na visão de Playlists.'],

  'Bubbling Under weeks in the normal chart run':
    ['Semanas no Quase no Top dentro do histórico normal',
     'O histórico semanal comum ganhou uma chave que mostra as semanas em que uma entrada chegou perto mas ficou de fora, junto com as semanas em que ela esteve na parada.'],

  'Background playback guard stopped giving up':
    ['A proteção da reprodução em segundo plano parou de desistir',
     'Pausas automáticas repetidas venciam a única nova tentativa, e o controlador limpava o próprio estado enquanto a aba ainda estava oculta, então parava de tentar depois de retomar uma vez.'],

  'Backend woken before you need it':
    ['O servidor é acordado antes de você precisar',
     'O servidor dorme quando está ocioso e leva uns 30 segundos para acordar, e isso era pago justo na hora em que você apertava play. Agora ele é chamado ao carregar a página e ao desenhar a parada, e o laço de novas tentativas espera o suficiente para cobrir uma partida a frio.'],

  'Playback stopped pausing itself in the background':
    ['A reprodução parou de se pausar sozinha em segundo plano',
     'Sair da aba fazia o vídeo ser pausado à força. Agora essas pausas são detectadas e retomadas na hora. Botões de anterior e próximo foram adicionados à notificação do Android.'],

  'Chart and Bubbling Under on one timeline':
    ['Parada e Quase no Top numa só linha do tempo',
     'Uma chave junta as semanas que uma entrada passou na parada com as que passou logo abaixo numa única sequência cronológica, então uma carreira que cruzou a linha várias vezes é lida como uma única história.'],

  'Preview a Bubbling Under week':
    ['Prévia de uma semana do Quase no Top',
     'Clicar na caixa de uma semana mostra toda a classificação da zona naquela semana, com a entrada destacada, e um link para a parada.'],

  'Bubbling Under chart runs':
    ['Históricos no Quase no Top',
     'Cada entrada pode expandir um histórico mostrando só o tempo dela na zona: total de semanas, melhor posição, maior sequência, passagens separadas, pico de reproduções e uma caixa por semana.'],

  'Lock screen playback on Android':
    ['Reprodução com a tela bloqueada no Android',
     'A faixa atual é registrada no sistema operacional, então a reprodução continua quando a tela bloqueia ou você troca de app, e os controles da tela de bloqueio funcionam.'],

  'Search said no results when the server was waking':
    ['A busca dizia que não havia resultados enquanto o servidor acordava',
     'A busca com vários resultados não sabia lidar com um servidor dormindo, então dizia não ter encontrado nada em vez de esperar.'],

  'Play or save your at-risk streaks':
    ['Toque ou salve suas sequências em risco',
     'A seção Em risco hoje ganhou Tocar tudo, Enfileirar tudo e Salvar playlist — justamente a seção onde agir na hora é o que importa.'],

  'Track lists on artist and album play buttons':
    ['Listas de faixas nos botões de reprodução de artistas e álbuns',
     'Tocar um artista ou um álbum é ambíguo, então o botão agora abre uma lista com as últimas dez faixas dele que você ouviu, cada uma com botões de tocar e enfileirar, mais Tocar tudo e Enfileirar tudo. As linhas de música continuam tocando direto.'],

  'Bubbling Under names its chart size':
    ['O Quase no Top diz o tamanho da parada',
     'O título diz abaixo de qual parada as entradas estão.'],

  'Play or save a day\'s singles from the calendar':
    ['Toque ou salve os singles de um dia pelo calendário',
     'Ver um único dia de singles no calendário agora oferece Tocar tudo, Criar playlist e Exportar.'],

  'The Playlists tab':
    ['A aba Playlists',
     'Um gerenciador de playlists completo: expanda uma playlist, toque a partir de qualquer faixa, renomeie ali mesmo, arraste para reordenar, remova faixas e apague playlists. As playlists sincronizam com a sua conta e se juntam quando você entra em outro lugar, então sobrevivem à troca de navegador e de dispositivo.'],

  'Bubbling Under weeks counted one too many':
    ['O Quase no Top contava uma semana a mais',
     'A semana atual era contada duas vezes, então toda entrada parecia uma semana mais velha do que era, e uma estreia aparecia como duas semanas.'],

  'Collaborations scrobbled with the right album':
    ['Colaborações registradas com o álbum certo',
     'Créditos com convidados e separados por vírgula eram enviados inteiros, então as buscas falhavam. Agora é usado o artista principal, e o app procura o álbum no seu próprio histórico antes de perguntar ao Last.fm, o que é mais confiável e economiza uma requisição.'],

  'Play buttons on single releases':
    ['Botões de reprodução nos singles',
     'Os cartões de singles em Lançamentos Recentes ganharam um botão de reprodução.'],

  'Play buttons in Bubbling Under':
    ['Botões de reprodução no Quase no Top',
     'As entradas da zona podem ser tocadas como qualquer outra linha.'],

  'Missing albums looked up before scrobbling':
    ['Álbuns que faltam são buscados antes do scrobble',
     'Quando uma música não tem álbum no seu histórico, o player agora pergunta ao Last.fm assim que a reprodução começa, então a resposta chega antes do scrobble dos 30 segundos.'],

  'Player was scrobbling a dash as the album name':
    ['O player registrava um traço como nome do álbum',
     'Músicas sem álbum conhecido guardam um traço como marcador, e a verificação de se havia álbum tratava isso como um valor real, então o Last.fm recebia um traço literal.'],

  'Freefall and Yo-Yo badges':
    ['Selos Queda Livre e Yo-Yo',
     'Queda Livre marca a maior queda de reproduções da semana, e Yo-Yo marca entradas que entraram e saíram da zona três vezes ou mais.'],

  'Weeks spelled out in Off the Chart':
    ['Semanas por extenso no Fora da Parada',
     'Igual à mudança feita no Quase no Top.'],

  'Suggestions while editing a play':
    ['Sugestões ao editar uma reprodução',
     'Os campos de artista, faixa e álbum agora sugerem valores do seu próprio histórico enquanto você digita, o que faz a diferença entre corrigir um nome e ter que redigitá-lo exatamente.'],

  'Consecutive streaks in Bubbling Under':
    ['Sequências consecutivas no Quase no Top',
     'Ao lado do total de todos os tempos, cada entrada mostra a sequência atual ininterrupta na zona, que aparece a partir de duas semanas e zera quando ela sai.'],

  'Fallen badge narrowed':
    ['Selo Caído mais restrito',
     'Agora ele só marca entradas que caíram na zona direto do top três.'],

  'Bubbling Under badges made history-aware':
    ['Selos do Quase no Top agora levam o histórico em conta',
     'Caindo aparecia em tudo o que já tinha estado na parada, e não só nas entradas que saíram na semana passada. O selo de possível estouro foi trocado por outros que leem o histórico completo: Novo para a primeira aparição de todas, Em Alta para semanas consecutivas sem nunca ter entrado na parada, e Persistente quando isso passa de cinco semanas.'],

  'Weeks spelled out in Bubbling Under':
    ['Semanas por extenso no Quase no Top',
     'O selo de semanas abreviado passou a ser escrito por extenso.'],

  'Bubbling Under on yearly and all-time charts':
    ['Quase no Top nas paradas anuais e históricas',
     'Essas visões são desenhadas por outro caminho, que nunca escondia a seção.'],

  'Bubbling Under leaking into other tabs':
    ['O Quase no Top vazava para outras abas',
     'Seis abas terminam antes que o código que esconderia a seção chegue a rodar, então ela ficava na tela onde não fazia sentido.'],

  'Bubbling Under':
    ['Quase no Top',
     'Uma seção mostrando as músicas, artistas e álbuns que ficam logo fora da parada — os dez seguintes, ou cinquenta num top 100 — para que os quase-lá fiquem visíveis em vez de invisíveis. Cada entrada mostra quantas reproduções faltam, e selos de queda, possíveis estouros e semanas passadas na zona.'],

  'Compact view columns rethought':
    ['Colunas da visão Compacta repensadas',
     'Os emojis de medalha foram trocados por números de posição que mantêm as cores do pódio, e a coluna combinada de movimento foi dividida em semanas na parada e posição anterior, como na visão de tabela.'],

  'Compact play button and arrow alignment':
    ['Botão de reprodução e setas alinhados na Compacta',
     'O botão de reprodução mudou de cor e as setas de movimento foram centralizadas.'],

  'Clearer click targets in Stack view':
    ['Áreas de clique mais claras na visão Pilha',
     'Músicas se expandem no lugar, enquanto clicar no título de um artista ou álbum abre a página dele.'],

  'New and returning edges visible on podium cards':
    ['Bordas de novo e de retorno visíveis nos cartões do pódio',
     'O brilho dourado, prateado e bronze cobria a borda verde-azulada e roxa que marca uma entrada nova ou que voltou. Agora o brilho fica em três lados, para as duas aparecerem.'],

  'Movement colours across every view':
    ['Cores de movimento em todas as visões',
     'As cores das barras e as bordas das entradas definidas pelo movimento foram estendidas a Tabela, Grade de cartões, Compacta e Filme.'],

  'Stack rank numbers cut off':
    ['Números de posição cortados na Pilha',
     'Os números grandes de posição estavam sendo cortados.'],

  'Fifteen additions to Stack view':
    ['Quinze novidades na visão Pilha',
     'Brilhos pulsantes nos três primeiros, um número de posição grande como marca-d\'água, uma barra de progresso colorida pelo movimento, bordas coloridas para estreias e retornos, o nome do álbum ao lado do título, as reproduções de todos os tempos na linha de dados e as semanas na parada.'],

  'Per-category heatmaps made full size':
    ['Mapas de calor por categoria em tamanho completo',
     'Os mapas de calor de artista, música e álbum agora igualam o principal em tamanho e rótulos, com detalhes ao passar o mouse e clique em cada dia ativo.'],

  'Nineteen additions to the streak heatmap':
    ['Dezenove novidades no mapa de calor de sequências',
     'Um seletor de intervalo para o último ano, qualquer ano específico ou todo o histórico; cinco esquemas de cor; sombreamento contínuo em vez de cinco níveis fixos; rótulos de meses e dias da semana; e anéis marcando hoje e o seu dia de pico.'],

  'The Hall of Fame as plaques':
    ['O Salão da Fama como placas',
     'Cada entrada agora mostra a posição, o tipo, a duração do recorde contando para cima, as datas exatas entre as quais ele foi feito e se ainda está em andamento — para ficar claro por que cada um está ali, e não só que está.'],

  'Artist and album art swapped in Card Grid':
    ['Imagens de artista e álbum trocadas na Grade de cartões',
     'Os dois tipos recebiam o mesmo identificador porque ele era formado pela primeira letra da palavra, e artistas e álbuns começam com a mesma. As imagens iam parar nos cartões errados.'],

  'Sign-in popup blocked':
    ['Janela de login bloqueada',
     'Um cabeçalho de segurança da hospedagem impedia a janela de login do Google de devolver a resposta.'],

  'Filmstrip Save button produced nothing':
    ['O botão Salvar do Filme não gerava nada',
     'Imagens carregadas de outros sites impedem uma página de se transformar em imagem, então salvar falhava em silêncio, e de qualquer forma só a parte visível da faixa era capturada. Agora a faixa é copiada fora da tela na largura total, com todas as imagens convertidas antes.'],

  'Play an at-risk streak straight from the list':
    ['Toque uma sequência em risco direto da lista',
     'Os itens de sequência tocam no app em vez de abrir o YouTube numa nova aba, entrando na fila em silêncio se algo já estiver tocando, e as entradas de artista e álbum mostram as últimas cinco músicas dele que você ouviu.'],

  'The streak window rebuilt':
    ['A janela de sequências refeita',
     'Abas para Sequências, Mapa de calor e Cemitério, um resumo de sequências ativas, em risco e perdidas, seções recolhíveis que lembram o estado, busca ao vivo, ordenação por duração ou nome, a data de início de cada sequência e um troféu quando uma sequência atual iguala o seu melhor de todos os tempos.'],

  'Filmstrip scrolls continuously':
    ['O Filme rola sem parar',
     'A rolagem automática foi refeita como um loop contínuo que pausa ao passar o mouse, como o carrossel da Máquina do Tempo, em vez de andar aos saltos e parar no fim.'],

  'Filmstrip detail panel tidied':
    ['Painel de detalhes do Filme arrumado',
     'Os selos saíram do cartão e foram para uma única linha no painel expandido, os rótulos de semanas e reproduções foram escritos por extenso em vez de abreviados, e os dois foram ligados ao sistema de tradução.'],

  'Mouse drags stopped changing the period':
    ['Arrastar com o mouse não muda mais o período',
     'Selecionar texto com o mouse num computador era interpretado como um deslize e mudava de período. Agora os deslizes só são reconhecidos pelo toque.'],

  'Wider filmstrip cards and restyled jump controls':
    ['Cartões do Filme mais largos e controles de salto renovados',
     'Os cartões ficaram mais largos de novo, e os botões de pular para uma posição foram redesenhados como as abas de visão, com rótulos mais curtos.'],

  'Filmstrip made interactive':
    ['O Filme ficou interativo',
     'Cartões mais largos com imagens maiores para os três primeiros, títulos que quebram linha em vez de serem cortados, posição e movimento separados, selos de certificação e pico sobre a imagem e um botão de reprodução ao passar o mouse.'],

  'Top-three glow in Card Grid':
    ['Brilho dos três primeiros na Grade de cartões',
     'Igual ao tratamento do mosaico.'],

  'Podium tints on the chart rows':
    ['Cores de pódio nas linhas da parada',
     'Fundos de linha dourado, prateado e bronze na tabela principal e na visão compacta.'],

  'Mosaic scales to the chart size':
    ['O mosaico acompanha o tamanho da parada',
     'Um top 50 ou top 100 numa altura fixa deixava as entradas de baixo como tirinhas ilegíveis, então agora a grade cresce com a parada. O conteúdo do cartão expandido se ajusta ao bloco em que está.'],

  'Stronger top-three glows':
    ['Brilhos mais fortes nos três primeiros',
     'Com todos os outros blocos agora brilhando na própria cor, o pódio precisava de um tratamento mais largo e mais brilhante para continuar se destacando.'],

  'Mosaic tiles glow their own colour':
    ['Os blocos do mosaico brilham na própria cor',
     'Cada bloco do quarto lugar para baixo pega a cor mais viva da própria imagem e a usa na borda e no brilho. Os três primeiros mantêm ouro, prata e bronze.'],

  'Missing artwork on the expanded mosaic card':
    ['Imagem faltando no cartão expandido do mosaico',
     'As duas faces de um bloco compartilhavam um identificador, então só a da frente recebia a imagem.'],

  'Search retries when the server is waking':
    ['A busca tenta de novo enquanto o servidor acorda',
     'O servidor dorme quando está ocioso e devolve um erro enquanto inicia, o que era tratado como busca falha. Agora essas respostas são tentadas de novo.'],

  'Artwork on the expanded mosaic card':
    ['Imagem no cartão expandido do mosaico',
     'Uma miniatura ao lado da posição, do título e do artista.'],

  'Click a mosaic tile to expand it':
    ['Clique num bloco do mosaico para expandi-lo',
     'O bloco vira para uma face com as estatísticas completas, aumentando de tamanho se for pequeno demais para ler, enquanto os outros escurecem.'],

  'Mosaic frame was killing the glows':
    ['A moldura do mosaico apagava os brilhos',
     'O painel colocado em volta da grade cortava os brilhos e efeitos de hover dos blocos que ele deveria emoldurar.'],

  'Hover a mosaic tile for its chart run':
    ['Passe o mouse num bloco do mosaico para ver o histórico',
     'Um cartão fosco sobe mostrando o título completo, o pico, as semanas na parada, as reproduções de todos os tempos com a certificação, a barra de reproduções desta semana e um botão para enfileirar a faixa.'],

  'Mosaic polish and movement badges':
    ['Acabamento do mosaico e selos de movimento',
     'Cantos mais arredondados, um painel atrás da grade e selos de movimento coloridos em cada bloco.'],

  'Mosaic labels always visible':
    ['Rótulos do mosaico sempre visíveis',
     'Título, artista e número de reproduções aparecem sempre, em vez de só ao passar o mouse, com um número de posição grande como marca-d\'água em cada bloco.'],

  'Mosaic rebuilt as a treemap':
    ['O mosaico refeito como treemap',
     'Os blocos agora preenchem o espaço de ponta a ponta, cada um com área proporcional às reproduções, então o formato da parada aparece no próprio layout. Degradês mantêm o texto legível sem passar o mouse, e os três primeiros têm brilhos de ouro, prata e bronze.'],

  'Compact view improved':
    ['Visão Compacta melhorada',
     'Medalhas, selos, um acordeão para os detalhes, um botão de reprodução, imagem ao passar o mouse e um cabeçalho que fica parado enquanto você rola.'],

  'Card Grid view made interactive':
    ['A visão Grade de cartões ficou interativa',
     'Clicar num cartão toca a música, passar o mouse mostra um botão de reprodução, e o clique direito oferece Tocar agora, Tocar em seguida, Adicionar à fila, Tocar parecidas e uma busca. Os selos de pico e certificação foram para os cartões, e o movimento aparece como uma borda colorida.'],

  'Lyrics panel would not scroll':
    ['O painel de letras não rolava',
     'O controlador da roda do volume interceptava a rolagem dentro das letras.'],

  'Sleep timer, lyrics, crossfade and more':
    ['Timer de desligamento, letras, crossfade e mais',
     'Um timer de desligamento, crossfade entre faixas, um painel de letras, um limite de scrobble ajustável, capas, playlists com nome, Tocar parecidas, picture-in-picture, velocidade de reprodução e um cartão para compartilhar.'],

  'Seeking, repeat, shuffle and Play Next':
    ['Avanço, repetir, aleatório e Tocar em seguida',
     'Uma barra de progresso que você pode arrastar ou mover com as setas, um botão de repetir que alterna entre desligado, uma e todas, aleatório para a fila existente, volume nas teclas para cima e para baixo, uma opção Tocar em seguida que fura a fila, e a possibilidade de enfileirar um histórico inteiro de uma vez.'],

  'Artist names in the queue':
    ['Nomes dos artistas na fila',
     'A fila listava só títulos, o que não basta para diferenciar duas versões.'],

  'Scrolling the queue changed the volume':
    ['Rolar a fila mudava o volume',
     'O controlador da roda do volume pegava rolagens que eram para a lista da fila.'],

  'The player remembers what you were playing':
    ['O player lembra o que você estava ouvindo',
     'Reabrir a aba mostra o miniplayer com a última faixa pronta para retomar, em vez de um player vazio.'],

  'Play All and Shuffle missing':
    ['Tocar tudo e Aleatório sumiram',
     'Os dois botões tinham sumido das paradas semanais e mensais de músicas.'],

  'Player controls spilling outside the frame':
    ['Controles do player saindo da moldura',
     'Os controles do miniplayer transbordavam o próprio cartão.'],

  'Ten more things in the music player':
    ['Mais dez coisas no player de música',
     'Um botão de pular, uma recuperação mais esperta quando um vídeo não toca, uma busca personalizada com um seletor de resultados, arrastar livremente para qualquer lugar da tela, quatro tamanhos até 640 por 360, e uma fila que dá para reordenar arrastando e que sobrevive a um recarregamento.'],

  'Time Machine cards washed out on hover':
    ['Cartões da Máquina do Tempo desbotavam ao passar o mouse',
     'Nos temas claros, a cor de hover ficava mais clara do que o próprio cartão, então passar o mouse fazia o cartão apagar em vez de se destacar. Os temas claros agora escurecem ao passar o mouse, como os escuros.'],

  'Unreadable tab labels on light themes':
    ['Rótulos de aba ilegíveis nos temas claros',
     'Passar o mouse numa aba em qualquer um dos cinco temas claros deixava o texto branco sobre um fundo claro. A regra era só para os temas escuros e estava sendo herdada em todo lugar.'],

  'Anniversaries stopped loading entirely':
    ['Os aniversários de lançamento pararam de carregar',
     'O pedido pelos detalhes completos do lançamento estava sendo recusado de cara pela base de dados musical, então os aniversários voltavam vazios. O pedido foi corrigido e os resultados vazios que já estavam em cache foram apagados.'],

  'Pagination appearing on weekly charts':
    ['Paginação aparecendo nas paradas semanais',
     'Voltar para a visão de tabela apagava a regra que escondia os controles de paginação, e eles apareciam nas paradas semanais, onde não fazem sentido — são das visões anual e histórica.'],

  'Spanish label for singles corrected':
    ['Rótulo de singles em espanhol corrigido',
     'A palavra em inglês tinha ficado na tradução para o espanhol.'],

  'Albums stat renamed to Albums & Singles':
    ['A estatística Álbuns passa a se chamar Álbuns e singles',
     'O número sempre contou os dois, em todos os idiomas.'],

  'Close button on the edit window':
    ['Botão de fechar na janela de edição',
     'A janela Editar scrobble não tinha nenhum jeito visível de ser fechada.'],

  'Open a chart link in a new tab':
    ['Abra um link de parada numa nova aba',
     'Os links de período não eram links de verdade, então clicar com o botão direito ou do meio não fazia nada. Os doze agora têm endereços reais, e abrir um diretamente leva ao período certo assim que os dados carregam.'],

  'Demo button did nothing':
    ['O botão de demonstração não fazia nada',
     'As funções por trás dele tinham sido adicionadas a uma cópia do código que o site no ar não carrega.'],

  'A demo button':
    ['Um botão de demonstração',
     'Um botão grande acima dos cartões de importação que carrega os dados de exemplo e começa a montar as paradas na hora, sem configuração nenhuma.'],

  'Sample data for new visitors':
    ['Dados de exemplo para novos visitantes',
     'A página inicial oferece uma planilha de exemplo pública, para o app poder ser explorado antes de você se comprometer a configurar uma fonte de dados própria.'],

  'Release anniversaries on the right day':
    ['Aniversários de lançamento no dia certo',
     'A data de lançamento de um álbum era tirada da edição mais antiga registrada, que muitas vezes é uma exceção digital ou de streaming, e não o lançamento de que as pessoas se lembram. Agora a data é a compartilhada pelo maior número de edições, recorrendo à mais antiga só quando não há nada melhor.'],

  'Song profiles':
    ['Perfis de música',
     'Clicar numa música nas paradas Histórico ou Anual abre um perfil completo: cartões de posição, estatísticas, prêmios, placas de certificação, picos na parada, recordes, cada histórico, sequência e aparição com links para as semanas em que aconteceram, um gráfico de como a posição se moveu, um padrão de audição, um mapa de calor e o histórico completo de reproduções.'],

  'Bigger icons on the sync bar':
    ['Ícones maiores na barra de sincronização',
     'Os botões de sincronizar, configurar e scrobble tinham ícones pequenos demais para enxergar. Agora cada ícone tem o tamanho certo em todos os idiomas, o que exigiu refazer como esses botões guardam o texto traduzido.'],

  'Time Machine hint translated':
    ['Dica da Máquina do Tempo traduzida',
     'O texto explicativo acima da Máquina do Tempo, em espanhol e nas duas variantes do português.'],

  /* ========== MAIO 2026 ========== */

  'Five ways to look at a weekly chart':
    ['Cinco jeitos de ver uma parada semanal',
     'Os layouts Grade de cartões, Compacta, Mosaico, Filme e Pilha ao lado da tabela padrão, escolhidos num seletor dentro de cada seção, com as três seções mudando juntas.'],

  'A hero card and a number one spotlight':
    ['Um cartão de abertura e um destaque para o número um',
     'Um cartão de abertura com degradê no topo, um destaque para o artista líder do ano e cartões coloridos nas paradas principais.'],

  'Your Soundtrack made bolder':
    ['Sua Trilha Sonora mais ousada',
     'Números maiores, seções que aparecem conforme você rola, barras em degradê e posições do topo em destaque.'],

  'View modes on weekly and monthly releases':
    ['Modos de visão nos lançamentos semanais e mensais',
     'Os seletores de carrossel, blocos, tabela e lista foram estendidos às seções de próximos e recentes lançamentos das paradas semanais e mensais.'],

  'Chart animation smoothed, with a speed control':
    ['Animação da parada mais suave, com controle de velocidade',
     'Linhas que ainda não tinham nenhuma reprodução apareciam com a posição em branco, o que quebrava a parada visualmente; elas sumiram, e as entradas agora aparecem no momento em que chegam ao corte pela primeira vez, surgindo aos poucos enquanto sobem. Linhas que saem são removidas antes de as posições serem medidas, para não deixar buracos, e um controle deslizante define a velocidade.'],

  'Animated fire on the streak count':
    ['Fogo animado na contagem de sequência',
     'A contagem do banner de sequência ganhou uma chama animada.'],

  'Streak thumbnails show their own artwork':
    ['Miniaturas de sequência mostram a própria imagem',
     'Todos os blocos pequenos mostravam a mesma capa da imagem principal da sequência. Agora cada um busca a imagem da própria reprodução, respeita a fonte de imagem escolhida para cada item, e o limite de nove blocos foi removido.'],

  'Collaborations no longer break an artist streak':
    ['Colaborações não quebram mais a sequência de um artista',
     'A sequência de um artista era quebrada por uma reprodução creditada a ele junto com outra pessoa, porque os dois nomes eram comparados como um único texto. Agora os dois lados são divididos em artistas individuais. Ao mesmo tempo, foi adicionada uma chave para desligar a animação da parada.'],

  'See which plays were autocorrected':
    ['Veja quais reproduções foram corrigidas automaticamente',
     'As linhas corrigidas trazem um selo com os valores originais e uma borda colorida, e um filtro mostra só as entradas que uma regra alterou — para uma correção ficar visível, e não ser algo que aconteceu em silêncio com os seus dados.'],

  'The streak banner':
    ['O banner de sequência',
     'Sua sequência de audição ativa fica sempre entre a barra de sincronização e as abas, com efeitos de fogo, capas e uma faixa com suas últimas reproduções em pequenos blocos.'],

  'Time Machine tiles start the player':
    ['Os blocos da Máquina do Tempo abrem o player',
     'Clicar num bloco de música com o player desligado mostrava uma mensagem de fila para um player que não existia. Agora ele abre o player na hora.'],

  'Your Soundtrack':
    ['Sua Trilha Sonora',
     'Uma aba de retrospectiva do ano: um resumo animado de reproduções, dias ativos, artistas, descobertas e sequência; seus cinco principais artistas e músicas com barras proporcionais; um gráfico de atividade mensal marcando seus meses mais alto e mais baixo; uma pontuação de fidelidade comparada ao ano anterior; os artistas que você descobriu; e os marcos que você ultrapassou. Ao mesmo tempo, os blocos da Máquina do Tempo ficaram clicáveis.'],

  'Artist awards showed zero until you visited Awards':
    ['Os prêmios do artista mostravam zero até você visitar Prêmios',
     'Os dados de prêmios só eram carregados ao abrir a aba Prêmios, então as indicações e vitórias de um artista sempre apareciam zeradas na primeira olhada. Agora todos os anos são carregados quando a janela abre, e a faixa é redesenhada quando eles chegam.'],

  'Expandable award categories per artist':
    ['Categorias de prêmios expansíveis por artista',
     'A faixa de prêmios na janela do artista se abre para listar cada categoria.'],

  'Records and awards inside the artist modal':
    ['Recordes e prêmios dentro da janela do artista',
     'Os recordes de parada de um artista e suas indicações e vitórias agora aparecem na própria página dele.'],

  'Peak day and peak streak in the artist modal':
    ['Dia de pico e sequência de pico na janela do artista',
     'Mais dois blocos: o máximo de reproduções num único dia e a maior sequência.'],

  'Chart size follows you between devices':
    ['O tamanho da parada acompanha você entre dispositivos',
     'O tamanho de parada escolhido agora fica guardado na sua conta.'],

  'Artist stats deduplicated and reordered':
    ['Estatísticas do artista sem repetição e reordenadas',
     'Números de pico duplicados foram removidos, um bloco Álbum mais ouvido foi adicionado e a ordem foi reorganizada.'],

  'The artist modal caught up with the album one':
    ['A janela do artista alcança a do álbum',
     'Mais dez números — primeira e última reprodução, dias de calendário, média de reproduções por música, picos semanal, mensal e anual, música principal, sequência de audição e músicas na parada semanal — e um gráfico de reproduções por mês cujas barras abrem para mostrar as cinco principais músicas daquele mês.'],

  'Upload hint translated':
    ['Dica de envio traduzida',
     'A nota com os formatos de arquivo aceitos na janela de envio.'],

  'Artist streak tag recoloured':
    ['Etiqueta de sequência de artista com nova cor',
     'A etiqueta de artista era parecida demais com a de álbum para diferenciar.'],

  'Colour-coded streak tags':
    ['Etiquetas de sequência por cores',
     'As etiquetas de artista, música e álbum na janela de sequências têm cores, para o tipo ficar claro de relance.'],

  'Display toggles remembered':
    ['As chaves de exibição são lembradas',
     'As chaves da barra de exibição da parada agora se mantêm entre sessões e dispositivos.'],

  'Editing and rules windows translated':
    ['Janelas de edição e de regras traduzidas',
     'Vinte e um textos nas janelas de edição, scrobble manual, regras de correção automática e conflitos, além da barra de ferramentas de Dados Brutos.'],

  'Export bar at both ends':
    ['Barra de exportação nas duas pontas',
     'Na visão de todas as entradas, os controles de exportação aparecem acima e abaixo de cada seção, para não ser preciso rolar uma lista longa de volta.'],

  'Export a whole chart as text or CSV':
    ['Exporte uma parada inteira como texto ou CSV',
     'As paradas Anual e Histórico podem exportar todas as entradas de músicas, artistas e álbuns, e não só o que cabe na tela.'],

  'Copy button on the setup guide did nothing':
    ['O botão de copiar do guia de configuração não fazia nada',
     'A cópia alternativa rodava quando o navegador já não a considerava uma resposta ao seu clique, então era recusada e a falha era engolida. Agora o botão sempre responde.'],

  'Streaks counted today, and an at-risk warning':
    ['Sequências contam hoje, e um aviso de risco',
     'As sequências ativas eram medidas até ontem, então reproduções feitas hoje não contavam. Agora elas terminam hoje, e uma nova seção avisa sobre sequências de ontem que você ainda não continuou — as que ainda dá para salvar.'],

  'The landing screen translated':
    ['A tela inicial traduzida',
     'A primeira tela que um visitante novo vê estava só em inglês. Vinte e nove textos foram traduzidos para os quatro idiomas, incluindo parágrafos formatados que precisaram de um tratamento novo para poderem ser traduzidos.'],

  'Animations still appearing on long charts':
    ['Animações ainda aparecendo nas paradas longas',
     'Um observador de animação que sobrava de uma visão semanal podia disparar depois da troca e sobrescrever o conteúdo paginado de Anual e Histórico.'],

  'Streaks modal translated':
    ['Janela de sequências traduzida',
     'A janela de sequências diárias, em todos os idiomas disponíveis.'],

  'Sync error change reverted':
    ['Mudança nos erros de sincronização desfeita',
     'A mudança anterior foi revertida.'],

  'Sync errors stopped being hidden':
    ['Erros de sincronização pararam de ser escondidos',
     'Quando uma Google Sheet voltava sem reproduções utilizáveis, o leitor indicava um motivo preciso — colunas faltando, planilha vazia, nada válido — e o código que o chamava sobrescrevia com um alegre "Sincronizado, 0 reproduções carregadas". Agora o motivo real aparece.'],

  'Streak details':
    ['Detalhes das sequências',
     'O número da sequência ficou clicável, abrindo um detalhamento de todas as sequências de artistas, álbuns e músicas que você tem em andamento, mais uma seção de sequências que terminaram há pouco.'],

  'No animation on Yearly and All-Time':
    ['Sem animação em Anual e Histórico',
     'Uma janela deslizante sobre um ano ou sobre todo um histórico não faz sentido, então esses períodos não são mais animados.'],

  'See-through nominee picker fixed':
    ['Seletor de indicados transparente corrigido',
     'A janela do seletor aparecia transparente porque vários valores de cor de que ela dependia nunca tinham sido definidos. A busca por gênero também foi ajustada para excluir itens cujo gênero ainda não é conhecido, em vez de deixá-los passar sem verificação.'],

  'Genre filtering while searching, and album merging':
    ['Filtro por gênero na busca, e álbuns unificados',
     'Buscar dentro de uma categoria de gênero agora filtra por gênero em vez de devolver tudo, cada linha mostra suas etiquetas de gênero, e álbuns creditados a colaborações se juntam numa única entrada em vez de se dividirem.'],

  'Genre detection stopped guessing wrong':
    ['A detecção de gênero parou de errar',
     'Os gêneros eram comparados de forma tão frouxa que artistas pop iam parar em categorias de rock. Agora a comparação é exata, colaborações buscam o artista principal, e buscas que falharam são lembradas para um serviço bloqueado não ser consultado milhares de vezes.'],

  'Nominees with apostrophes were silently dropped':
    ['Indicados com apóstrofo sumiam em silêncio',
     'Títulos com apóstrofo cortavam os dados em que eram guardados, então salvá-los falhava sem erro nenhum. Qualquer coisa como "Short n\' Sweet" simplesmente sumia das suas escolhas.'],

  'Unknown-year albums judged more carefully':
    ['Álbuns de ano desconhecido avaliados com mais cuidado',
     'Se nenhum ano de lançamento foi encontrado e o álbum nunca tinha sido ouvido antes do ano dos prêmios, ele quase certamente é um lançamento novo, então é excluído. Álbuns com alguma reprodução anterior ficam, porque essa reprodução já prova que o álbum existia.'],

  'Collaboration names handled properly':
    ['Nomes de colaborações tratados direito',
     'A busca foi refeita de forma mais restrita: só o termo de busca usa o artista principal, e a lógica de comparação por trás não foi mexida.'],

  'Collaboration fix reverted':
    ['Correção de colaborações desfeita',
     'A mudança anterior foi revertida depois de causar problemas.'],

  'Collaboration names broke release lookups':
    ['Nomes de colaborações quebravam a busca de lançamentos',
     'Um campo de artista com vários nomes separados por vírgula era enviado inteiro como busca, o que não encontrava nada e devolvia um ano desconhecido. Agora só o artista principal é usado.'],

  'Release years shown when picking nominees':
    ['Anos de lançamento visíveis ao escolher indicados',
     'Cada candidato a Descoberta Tardia mostra o ano em que foi lançado, e o que não tem um ano confirmado diz isso claramente, para você mesmo conferir em vez de confiar num palpite silencioso.'],

  'Awards default to last year':
    ['Os prêmios abrem no ano passado por padrão',
     'Abrir a aba mostrava o ano atual, onde os álbuns do ano anterior aparecem corretamente como descobertas tardias — tecnicamente certo, mas confuso, já que prêmios de fim de ano quase sempre são do ano que acabou de terminar. Agora ela abre no ano passado, e você ainda pode avançar.'],

  'Wrong-year lookups stopped slipping through':
    ['Buscas com o ano errado pararam de passar',
     'Quando nenhum álbum correspondente era encontrado, a busca pegava o primeiro resultado, fosse qual fosse, que podia ser um disco antigo sem relação e devolver uma data antiga o bastante para um lançamento do ano atual passar pelo filtro. Essas alternativas foram removidas.'],

  'Release year checked for every candidate':
    ['Ano de lançamento verificado para cada candidato',
     'A busca agora roda para todos os candidatos a Descoberta Tardia, em vez de ser pulada para alguns.'],

  'Late Discovery includes slow burns':
    ['Descoberta Tardia inclui os que demoram a pegar',
     'Álbuns que você tinha ouvido até vinte vezes antes do ano dos prêmios agora também contam, e não só os que você nunca tinha ouvido. Um punhado de reproduções no começo seguido de um ano de obsessão é exatamente o formato para o qual esta categoria existe.'],

  'Late Discovery excludes that year\'s releases':
    ['Descoberta Tardia exclui os lançamentos daquele ano',
     'Descobrir um álbum lançado no mesmo ano não é uma descoberta tardia. As datas de lançamento são buscadas em três fontes, uma depois da outra, e álbuns sem data encontrada ficam, em vez de serem excluídos por engano.'],

  'One-Hit Wonder made meaningful':
    ['Sucesso de um hit só, agora com sentido',
     'Agora ele pega artistas com exatamente uma música acima de dez reproduções, e mostra qual é essa música.'],

  'The Streak award measured the wrong thing':
    ['O prêmio de Sequência media a coisa errada',
     'Ele contava em quantos dias diferentes um item tinha sido ouvido, em vez da maior sequência ininterrupta, e um erro de formato de data quebrava a comparação de qualquer jeito. Agora ele encontra sequências reais de dias consecutivos e as chama assim.'],

  'Icons on award categories':
    ['Ícones nas categorias de prêmios',
     'Cada categoria ganhou um emoji descritivo.'],

  'Animations wait until you scroll to them':
    ['As animações esperam você chegar até elas',
     'Cada seção da parada mostra a visão do período anterior como marcador e só começa a animar quando aparece na tela. Se você não rolar até nada, nada roda, o que economiza trabalho e bateria.'],

  'The chart animation became a true play-by-play':
    ['A animação da parada virou reprodução por reprodução',
     'Em vez de pular entre sete retratos fixos, a animação agora mantém uma contagem corrente e tira e acrescenta reproduções individuais quadro a quadro. Entradas novas sobem à vista de baixo do corte até a posição final, incluindo as posições que tocam rapidamente pelo caminho.'],

  'Event view choices follow your account':
    ['As escolhas de visão de Eventos acompanham sua conta',
     'Os tipos de evento pelos quais você filtra e o modo de visão de cada seção agora sincronizam com a sua conta Google, em vez de serem esquecidos em outro dispositivo.'],

  'The Awards tab':
    ['A aba Prêmios',
     'Uma cerimônia montada com a sua própria audição: escolha um ano, defina o período de elegibilidade para qualquer intervalo de datas e ative qualquer uma de 33 categorias. Os indicados são gerados a partir do seu histórico e suas escolhas ficam guardadas na sua conta. Um segundo painel traz os prêmios reais.'],

  'More mobile layout corrections':
    ['Mais correções de layout no celular',
     'Os seletores de visão de eventos quebram linha em qualquer tamanho de tela, e a janela de álbum esconde as colunas de data em celulares pequenos, onde elas não cabem.'],

  'Events view buttons unusable on iPhone':
    ['Botões de visão de Eventos inutilizáveis no iPhone',
     'O Safari do iOS os desenhava como botões brancos simples do sistema, e a fileira onde ficavam transbordava a tela, então não dava para apertá-los. No celular eles agora vão para uma fileira própria.'],

  'New Music Friday':
    ['New Music Friday',
     'Uma seção reunindo os lançamentos de cada sexta-feira — álbuns editoriais e singles e EPs recém-lançados das últimas duas semanas — em qualquer um dos cinco modos de visão. Até dezesseis semanas de sextas são guardadas, então você pode voltar pelas semanas anteriores em vez de ver só a atual.'],

  'Reel became the default, and its images loaded':
    ['O carrossel virou padrão, e as imagens carregaram',
     'As fotos dos artistas nunca carregavam no modo carrossel porque a alternativa de imagem procurava um formato de cartão que os cartões do carrossel não têm, então o download nunca era disparado.'],

  'Four ways to view every Events section':
    ['Quatro jeitos de ver cada seção de Eventos',
     'As sete seções podem ser mostradas como blocos, tabela ordenável, carrossel infinito que pausa ao passar o mouse ou lista simples, e cada seção lembra o que você escolheu.'],

  'The Time Machine':
    ['A Máquina do Tempo',
     'Um carrossel das músicas, artistas e álbuns que você ouviu neste mesmo dia em anos anteriores, com chaves para escolher quais dos três mostrar.'],

  'Album art, Top N and sharing on chart images':
    ['Capas, Top N e compartilhamento nas imagens da parada',
     'As imagens compartilhadas da parada agora podem trazer a capa em cada linha, vinda de várias fontes com alternativas e guardada em cache entre usos; um controle deslizante define quantas posições aparecem; e a imagem pode ser copiada para a área de transferência ou passada ao menu de compartilhamento do dispositivo. Suas escolhas são lembradas. A visão de dia do calendário ganhou um botão de exportar playlist.'],

  'Plays Peak badge translated':
    ['Selo de pico de reproduções traduzido',
     'O selo tinha ficado em inglês no espanhol e no português.'],

  'Gender agreement in Spanish and Portuguese':
    ['Concordância de gênero em espanhol e português',
     'A palavra "descoberto" precisa concordar com o que descreve, e músicas levam uma forma diferente da de artistas e álbuns. Os dois idiomas foram corrigidos.'],

  'New-music section titles translated':
    ['Títulos das seções de música nova traduzidos',
     'Os títulos das paradas de músicas, artistas e álbuns novos.'],

  'Spanish Rising Artist reworded':
    ['Artista em ascensão reformulado em espanhol',
     'O rótulo em espanhol de Artista em ascensão foi trocado por uma expressão mais natural.'],

  'Every stat strip label translated':
    ['Todos os rótulos da faixa de estatísticas traduzidos',
     'Melhor dia, as contagens de músicas, artistas e álbuns novos, os três blocos do momento, Artista em ascensão, os dois selos de pico e os textos pequenos de reproduções, por dia e porcentagem de novos. As abreviações de mês no rótulo de Melhor dia agora usam as formas traduzidas.'],

  'Spanish display toggle corrected':
    ['Chave de exibição em espanhol corrigida',
     'Um resto da mudança de texto anterior que tinha passado batido.'],

  'Events tab and Configure button translated':
    ['Aba Eventos e botão Configurar traduzidos',
     'Os dois ainda estavam em inglês em todos os idiomas.'],

  'Spanish navigation hint reworded':
    ['Dica de navegação em espanhol reformulada',
     'O texto em espanhol da dica das teclas de seta foi corrigido.'],

  'Navigation hint translated':
    ['Dica de navegação traduzida',
     'A dica de teclado e deslize foi traduzida para os quatro idiomas.'],

  'Spanish streak label and display buttons':
    ['Rótulo de sequência e botões de exibição em espanhol',
     'O rótulo de sequência estava com as palavras na ordem errada em espanhol, e os botões de exibição nunca tinham sido traduzidos.'],

  'Spanish wording corrected throughout':
    ['Texto em espanhol corrigido em toda parte',
     'Duas palavras mal escolhidas em toda a tradução para o espanhol foram trocadas em todos os lugares em que apareciam.'],

  'Clearer album peak labels':
    ['Rótulos de pico do álbum mais claros',
     'As estatísticas de pico da janela de álbum foram renomeadas para dizer a qual parada cada uma se refere.'],

  'Track details button restyled':
    ['Botão de detalhes das faixas redesenhado',
     'O controle de detalhes das faixas na janela de álbum virou um botão circular brilhante com um ícone que gira.'],

  'The album modal rebuilt':
    ['A janela de álbum refeita',
     'Os álbuns ganharam o tratamento que os artistas tinham: posição histórica, dias no calendário, média de reproduções por faixa, a próxima certificação e primeira e última reprodução; picos semanal, mensal e anual com um banner se ele liderou os três; uma linha de tendência mensal e um detalhamento de quantas faixas entraram na parada em cada período; conquistas e certificações; e históricos, mapa de calor, histórico de streaming e painéis por faixa.'],

  'Event sections visible again, and release lookups fixed':
    ['Seções de Eventos visíveis de novo, e busca de lançamentos corrigida',
     'Aniversários de lançamento, Próximos e Recentes Lançamentos vinham recolhidos por padrão; agora abrem, lembram o estado por seção e o restauram quando você volta. Uma consulta de lançamentos malformada que era recusada de cara também foi corrigida.'],

  'New Charts Records previews showed the wrong chart':
    ['As prévias de Recordes de Novas Paradas mostravam a parada errada',
     'Passar o mouse numa data dessa seção mostrava a parada semanal comum em vez da parada de música nova daquele período.'],

  'New Charts Records read the right charts':
    ['Recordes de Novas Paradas leem as paradas certas',
     'Os dez recordes eram montados a partir das primeiras aparições nas paradas principais, que só veem o top N, em vez das paradas de música nova que eles dizem descrever. Agora usam a primeira reprodução de cada item, batendo com o que essas paradas realmente mostram.'],

  'Concerts work without your own API key':
    ['Shows funcionam sem uma chave de API própria',
     'A seção de shows exigia que cada usuário fornecesse uma chave própria.'],

  'Artist modal showed the wrong songs':
    ['A janela do artista mostrava as músicas erradas',
     'Quando o tamanho da parada histórica não podia ser lido, a lista de músicas na parada voltava vazia, e uma alternativa mostrava em silêncio as principais músicas do próprio artista — que parecem iguais, mas significam algo completamente diferente. A presença na parada agora sempre vem dos dados históricos reais, e a alternativa enganosa foi removida.'],

  'A per-chart breakdown in the artist modal':
    ['Um detalhamento por parada na janela do artista',
     'Em vez de um único número de músicas na parada, uma grade mostrando quantas músicas e álbuns entraram e a melhor posição alcançada em Semanal, Mensal, Anual e Histórico, mais uma fileira de picos e uma posição histórica mais clara.'],

  'Clearer column name in the artist modal':
    ['Nome de coluna mais claro na janela do artista',
     'A coluna abreviada de reproduções consecutivas foi escrita por extenso.'],

  'All-Time stopped showing stale weekly data':
    ['Histórico parou de mostrar dados semanais velhos',
     'Mudar para Histórico com uma animação da parada ainda rodando deixava essa animação terminar 380 milissegundos depois e sobrescrever a nova aba com a parada da semana anterior. Agora animações pendentes são canceladas na troca, e a janela foi corrigida para usar números históricos em tudo, em vez de semanais.'],

  'The artist modal rebuilt':
    ['A janela do artista refeita',
     'Pico do artista agora significa a melhor posição na parada semanal, e não uma posição histórica. A conquista de número um histórico foi trocada por números um semanais e mensais e músicas que estrearam no topo. Músicas e álbuns são divididos cada um em quatro seções recolhíveis por período, cada uma com seu próprio mapa de calor e histórico.'],

  'Event sections hidden on long periods':
    ['Seções de Eventos escondidas em períodos longos',
     'Eventos próximos e recentes não têm lugar nas abas Anual e Histórico.'],

  'Upcoming concerts':
    ['Próximos shows',
     'Uma seção de shows de artistas que você ouve, marcados no calendário. Os dados de eventos também ficam guardados na sua conta para sobreviverem à troca de dispositivo, olhando primeiro o armazenamento local e só buscando quando não há nada para reaproveitar.'],

  'Records for the new-music charts':
    ['Recordes para as paradas de música nova',
     'Dez recordes tirados das paradas de Músicas, Artistas e Álbuns novos: maiores estreias, seus períodos de mais descobertas, mais músicas numa mesma parada nova, contagem histórica de estreias por artista, maiores sequências de estreias consecutivas, o mais rápido que uma música nova chegou ao número um e o álbum que chegou com mais faixas de uma vez.'],

  'Chart animation smoothed out':
    ['Animação da parada suavizada',
     'A parada final surge a partir de uma opacidade parcial em vez do nada, as linhas ficam totalmente visíveis durante a janela deslizante em vez de escurecerem no meio da animação, a repetição agora repete a sequência inteira e não só o esmaecimento, e os selos chegam depois que o movimento assenta.'],

  'Moment tiles limited to weekly':
    ['Blocos do momento só na semanal',
     'Artista e Álbum do momento medem uma janela de três semanas, o que não diz nada numa visão mensal ou anual, então eles ficam escondidos lá.'],

  'Artist and Album of the Moment':
    ['Artista e Álbum do momento',
     'Uma terceira faixa com Música, Artista e Álbum do momento mais Artista em ascensão, em que artista e álbum saem dos últimos 21 dias, cada um com sua imagem e cor.'],

  'Icons and colours on the stat tiles':
    ['Ícones e cores nos blocos de estatísticas',
     'Cada bloco ganhou um ícone e uma cor de categoria, e o número de Melhor dia foi esclarecido.'],

  'Release sections stopped always appearing collapsed':
    ['Seções de lançamentos pararam de aparecer sempre recolhidas',
     'As seções vinham marcadas como recolhidas na página, e o código que as mostrava nunca tirava essa marca, então elas apareciam recolhidas toda vez, não importava o que você tivesse escolhido. Agora sua preferência é salva e restaurada.'],

  'Charts evolve day by day instead of jumping':
    ['As paradas evoluem dia a dia em vez de pular',
     'A animação de entrada foi trocada por uma janela deslizante: o período anterior avança em sete passos durante cerca de seis segundos, tirando as reproduções mais antigas e acrescentando as do período atual, então você vê as posições mudando de verdade em vez de dois estados. As linhas deslizam para as novas posições e podem ser canceladas a qualquer momento.'],

  'Only the date row stays stuck':
    ['Só a linha de data fica fixa',
     'As abas e os controles de tamanho da parada agora rolam junto com a página, e só a navegação de datas fica presa.'],

  'Charts animate in from last period':
    ['As paradas entram animadas a partir do período anterior',
     'A parada desenha primeiro o período anterior e depois troca cada linha pela atual, deslizando as entradas de onde estavam — as que sobem vêm de baixo, as que caem vêm de cima, as novas vêm de fora da parada. Cada seção ganhou um botão de repetir.'],

  'Graphs and Records showing Events content':
    ['Gráficos e Recordes mostravam o conteúdo de Eventos',
     'Duas abas desenhavam o conteúdo da visão Eventos em vez do próprio.'],

  'Rising Artist, and a redesigned Song of the Moment':
    ['Artista em ascensão, e uma Música do momento redesenhada',
     'Um cartão de Artista em ascensão nas paradas semanais encontra o artista descoberto mais recentemente nos 45 dias que terminam com a semana, com uma foto de verdade. A Música do momento foi redesenhada em torno da capa. As linhas de tendência foram removidas de novo, e a segunda faixa foi escondida nas abas onde não significa nada.'],

  'Stat cards became interactive':
    ['Os cartões de estatística ficaram interativos',
     'Clicar num cartão de estatística rola até a seção da parada que ele resume, expandindo-a se estiver recolhida. Total de reproduções mostra uma média por dia, Músicas únicas mostra que proporção era nova, cada um dos quatro cartões principais tem uma linha de tendência de oito períodos, foi adicionado um bloco Melhor dia, e os números contam para cima ao carregar.'],

  'Movement and peaks on the new-music stats':
    ['Movimento e picos nas estatísticas de música nova',
     'Os números de músicas, artistas e álbuns novos agora mostram se subiram ou caíram em relação ao período anterior, e têm selos de pico histórico e de pico na época, como as estatísticas principais.'],

  'A second row of stats':
    ['Uma segunda fileira de estatísticas',
     'Abaixo dos quatro números principais, uma segunda faixa nas paradas semanais, mensais e anuais: Música do momento, a mais ouvida nos quinze dias que terminam com o período, e contagens de músicas, artistas e álbuns aparecendo pela primeira vez.'],

  'Filter events by kind':
    ['Filtre os eventos por tipo',
     'Aniversários, álbuns, singles, EPs e todo o resto podem ser mostrados ou escondidos separadamente.'],

  'An events calendar, and events that already happened':
    ['Um calendário de eventos, e eventos que já aconteceram',
     'Eventos ganhou uma visão de calendário e seções de aniversários, aniversários de lançamento e lançamentos que acabaram de passar, e não só os que ainda vêm. O conteúdo de outras seções que vazava para a aba foi cortado.'],

  'Chart run sections collapse':
    ['As seções do histórico se recolhem',
     'As subseções do histórico nas paradas anuais, mensais e semanais podem ser recolhidas, embora comecem abertas.'],

  'Search and sort your full listening history':
    ['Busque e ordene todo o seu histórico de audição',
     'O painel Histórico completo de streaming ganhou busca ao vivo por título, artista e álbum, e colunas ordenáveis. O painel do histórico foi dividido em seções recolhíveis que só carregam quando abertas, e Histórico ganhou chaves de exibição e botões de histórico.'],

  'Navigation hint hidden where it does not apply':
    ['Dica de navegação escondida onde não se aplica',
     'Dados Brutos, Gráficos, Recordes e Eventos não mudam de período, então a dica não aparece mais neles.'],

  'Swipe hint hidden on desktop':
    ['Dica de deslize escondida no computador',
     'Uma folha de estilos em cache ainda mostrava a dica de deslize no computador.'],

  'Swipe arrows dim when there is nowhere to go':
    ['As setas de deslize esmaecem quando não há para onde ir',
     'A seta de uma direção para a qual você não pode ir, como avançar a partir da semana atual, fica esmaecida.'],

  'The swipe hint animates until used':
    ['A dica de deslize fica animada até ser usada',
     'Ela brilha e se mexe até você deslizar pela primeira vez, e então para.'],

  'A swipe hint on small screens':
    ['Uma dica de deslize em telas pequenas',
     'A dica de teclado não faz sentido num celular, então lá ela é trocada por um indicador de deslize.'],

  'More milestones, and song milestones that actually tracked':
    ['Mais marcos, e marcos de música que realmente são registrados',
     'Muitos outros limites de reproduções foram adicionados entre 10 e 50.000, com passos menores nas centenas e nos primeiros milhares. A seção de músicas usava uma lista fixa com valores que nunca eram registrados.'],

  'Clearer label on the average stat':
    ['Rótulo mais claro na estatística de média',
     'O número de média por dia agora se chama Reproduções / dia.'],

  'Hero stats readable on the coloured mastheads':
    ['Estatísticas principais legíveis nos cabeçalhos coloridos',
     'Os temas claros vermelho, amarelo e rosa têm um cabeçalho escuro mas cores de texto pensadas para fundo claro, então as estatísticas acima das paradas ficavam quase invisíveis. Esses valores agora são sobrescritos dentro da área de estatísticas para combinar com o resto do texto do cabeçalho.'],

  'A permanent arrow-key hint':
    ['Uma dica permanente das teclas de seta',
     'Um pequeno lembrete fixo dos atalhos de seta para a esquerda e para a direita no computador, escondido no celular, onde eles não se aplicam.'],

  'A one-time hint about keyboard and swipe navigation':
    ['Uma dica única sobre navegar com teclado e deslize',
     'Uma pílula abaixo da navegação explica que as setas e os deslizes mudam de período; ela aparece uma vez e depois é lembrada. Dias ouvindo ficou clicável e leva ao mapa de calor, Artista principal agora troca de aba antes de rolar, e a contagem da sequência termina com uma explosão.'],

  'Delete a conflicting rule from the warning':
    ['Apague uma regra em conflito pelo aviso',
     'Cada regra listada no aviso de conflito ganhou um botão de apagar que a remove de todos os lugares onde está guardada, sem fechar a janela em que você está trabalhando.'],

  'Conflict warning widened':
    ['Aviso de conflito ampliado',
     'O aviso só disparava quando a regra existente tinha outro álbum. Agora ele dispara para qualquer regra do mesmo artista e faixa, inclusive as que só diferem em maiúsculas e minúsculas.'],

  'A warning before you create a conflicting rule':
    ['Um aviso antes de criar uma regra em conflito',
     'Salvar uma regra para um artista e faixa que já têm uma agora avisa antes, lista as regras em choque com uma caixa de seleção cada, e deixa você aplicá-las ou sobrescrevê-las uma a uma sem sair da janela.'],

  'Search your autocorrect rules':
    ['Busque nas suas regras de correção automática',
     'Uma caixa de busca na janela de regras, que começa a fazer diferença quando a lista fica longa.'],

  'Dismiss the autocorrect notice':
    ['Dispense o aviso de correção automática',
     'A mensagem que diz quantas entradas foram corrigidas agora pode ser dispensada, voltando a mostrar o status de sincronização de sempre por baixo.'],

  'Keep comma-separated artist names together':
    ['Mantenha juntos os nomes de artista com vírgula',
     'Uma chave para decidir se um nome com vírgula é um artista ou vários, porque as duas coisas são verdade dependendo do artista.'],

  'Corrections reached newly added entries':
    ['Correções chegam às entradas recém-adicionadas',
     'Depois de uma edição em lote, a cópia em cache do app já tinha os valores corrigidos, e um filtro usava isso para decidir quais regras ainda precisavam ser enviadas — então regras eram puladas e as entradas recém-chegadas ficavam sem correção na planilha. Agora todas as regras são sempre enviadas, e a planilha grava três colunas específicas em vez de se reescrever inteira.'],

  'Privacy Policy split into its own page':
    ['Política de Privacidade numa página própria',
     'As seções de privacidade saíram dos Termos para uma política independente, deixando os Termos só com os termos. O contraste do texto nas duas páginas foi corrigido.'],

  'Top 25 and Top 30':
    ['Top 25 e Top 30',
     'Mais dois tamanhos de parada para as paradas semanais e mensais.'],

  'Days Listened explained accurately':
    ['Dias ouvindo, explicado com precisão',
     'A dica dizia que o número contava os dias em que você abriu o Last.fm; ele conta os dias em que você ouviu música.'],

  'Support panel stopped collapsing on itself':
    ['O painel de suporte parou de se fechar sozinho',
     'A rotina que mantém o botão de abrir escondido continuava rodando depois que o painel abria, e o fechava um segundo depois. Agora ela pausa enquanto o painel está aberto.'],

  'Support panel opens properly':
    ['O painel de suporte abre direito',
     'A detecção de quando o painel tinha terminado de abrir não era confiável e foi substituída.'],

  'Support launcher hiding made reliable':
    ['Esconder o botão de suporte ficou confiável',
     'O widget podia reaparecer antes de o código que o escondia rodar; agora ele é vigiado e escondido assim que é inserido, com uma alternativa de estilo.'],

  'Support widget only opens when asked':
    ['O widget de suporte só abre quando pedido',
     'O widget de chat fica escondido ao carregar e só aparece quando você clica em Falar com o suporte, em vez de ser suprimido depois.'],

  'Sync moved first, Add Play scoped, Now button added':
    ['Sincronizar vai primeiro, Adicionar reprodução fica no lugar certo, e chega o botão Agora',
     'Sincronizar foi para o início do cabeçalho, Adicionar reprodução ficou restrito à aba Dados Brutos, que é o lugar dele, e a janela de edição ganhou um botão Agora para marcar o horário atual.'],

  'A plain-English summary at the top of the Terms':
    ['Um resumo em linguagem simples no topo dos Termos',
     'Ninguém lê termos, então foi colocado um quadro curto de resumo no topo deles, junto com uma seção de legislação aplicável.'],

  'Terms corrections':
    ['Correções nos Termos',
     'O responsável nomeado corretamente, endereços de contato corrigidos e um aviso sobre recursos premium adicionado.'],

  'A welcome email on first sign-in':
    ['Um e-mail de boas-vindas no primeiro login',
     'Entrar pela primeira vez agora envia um e-mail de boas-vindas.'],

  'Terms of Service and Privacy Policy':
    ['Termos de Serviço e Política de Privacidade',
     'Uma página de política publicada, cobrindo o que é coletado, quem processa e o seu direito de pedir a exclusão, com link na tela inicial e no rodapé.'],

  'Sheet corrections made dramatically cheaper':
    ['Correções na planilha ficaram muito mais baratas',
     'Faltava o tratamento das correções em lote, então esses pedidos caíam no trecho de adicionar uma linha. Corrigir isso trouxe quatro otimizações: as regras são buscadas diretamente em vez de cada linha ser comparada com cada regra, só as linhas alteradas são gravadas de volta em vez da planilha inteira, e linhas alteradas vizinhas são agrupadas em gravações únicas.'],

  'Batch corrections in the sheet script':
    ['Correções em lote no script da planilha',
     'O script do Google Sheets ganhou a ação que aplica todas as regras de correção de uma vez.'],

  'Support launcher hidden on every page':
    ['Botão de suporte escondido em todas as páginas',
     'A mesma correção, estendida às páginas onde tinha ficado de fora.'],

  'Support widget stopped floating over the page':
    ['O widget de suporte parou de flutuar sobre a página',
     'O botão do chat de suporte ficava sempre na tela. Agora ele só aparece quando você escolhe Falar com o suporte.'],

  'Streaks climb through their tiers on load':
    ['As sequências sobem pelos níveis ao carregar',
     'A contagem agora passa por cada nível de intensidade a caminho do seu número real, então você vê a sequência conquistar a própria cor.'],

  'Streaks in six intensities':
    ['Sequências em seis intensidades',
     'A exibição de sequências agora tem seis níveis de cor e animação, então uma sequência de três dias e uma de cem não parecem mais iguais.'],

  'The hero stats came alive':
    ['As estatísticas principais ganharam vida',
     'Um quinto número para a média de reproduções por dia, números que contam para cima quando a página carrega, seu recorde pessoal de sequência abaixo da atual, um brilho de fogo em sequências de sete dias ou mais, um ícone por estatística, um Artista principal clicável e uma grade de dois por dois no celular.'],

  'Play buttons on more rows, and three player sizes':
    ['Botões de reprodução em mais linhas, e três tamanhos de player',
     'Botões de reprodução foram adicionados nas linhas de música e dentro da nova parada de artistas, o miniplayer alterna entre três tamanhos em vez de dois, e passar o mouse no número de músicas de um artista lista as faixas dele com um botão de reprodução em cada uma.'],

  'The player became a floating, queueable mini player':
    ['O player virou um miniplayer flutuante com fila',
     'O player agora flutua onde você o coloca e se encaixa num canto, muda de tamanho, pausa com a barra de espaço e tem uma fila que você pode aumentar e ver. O servidor também confere vários resultados de busca e escolhe um que realmente toque, em vez de pegar o primeiro e falhar.'],

  'A real logo':
    ['Um logotipo de verdade',
     'O provisório foi trocado pela marca de arcos concêntricos, e um ícone para adicionar o site à tela inicial do iOS.'],

  'Eight things that make the app quicker to use':
    ['Oito coisas que deixam o app mais rápido de usar',
     'A navegação fica presa no topo ao rolar; aparecem marcadores com brilho enquanto as paradas carregam; clicar no rótulo do período abre direto o seletor de data; as setas mudam de período e W, M, Y e A pulam entre abas; passar o mouse num ponto de tema mostra uma prévia dele; e gestos de deslize mudam de período em telas de toque. Um favicon e prévias de link foram adicionados ao mesmo tempo.'],

  'The heatmap grew a year in review':
    ['O mapa de calor ganhou uma retrospectiva do ano',
     'Cinco esquemas de cor com um seletor de amostras, uma barra mostrando suas sequências de audição atual e máxima, detecção de secas que destaca os vazios e marca sua volta, um cartão de resumo para cada ano com total, melhor dia, artista principal e artistas novos, e uma seção Padrões de audição mostrando seu ritmo por dia da semana e hora do dia.'],

  'Heatmap rendering and filters completed':
    ['Desenho e filtros do mapa de calor concluídos',
     'O desenho, os filtros e as dicas do mapa de calor foram terminados.'],

  'Single edits find their row immediately':
    ['Edições avulsas encontram a linha na hora',
     'Editar uma reprodução fazia o script da planilha varrer todas as linhas para encontrá-la. Agora o app lembra de qual linha cada reprodução veio e manda isso junto com a edição, então o script lê uma linha direto, só varrendo tudo se a pista estiver desatualizada.'],

  'Autocorrect sync rebuilt around rules, not timestamps':
    ['Sincronização da correção automática refeita com base em regras, não em horários',
     'A sincronização das correções com a planilha ainda comparava por horário e continuava falhando sempre que os fusos do navegador e da planilha eram diferentes. Agora todas as regras ativas são enviadas num único pedido que lê a planilha uma vez e grava uma vez, não importa quantas regras existam.'],

  'The listening heatmap':
    ['O mapa de calor de audição',
     'Uma grade de calendário em Gráficos onde cada dia é um quadrado sombreado de acordo com quanto você ouviu, para anos de histórico serem lidos de relance. Passar o mouse num dia mostra a data, a contagem e qualquer marco, e dá para filtrar por um único artista, música ou álbum.'],

  'Ghost rows cleaned before syncing':
    ['Linhas fantasma limpas antes de sincronizar',
     'Scrobbles incompletos do Last.fm deixam linhas sem música e com data de 1970, e essas linhas estragam o horário a partir do qual a próxima sincronização começa, então uma única linha ruim podia continuar quebrando sincronizações futuras. Agora elas são removidas antes de cada sincronização do Last.fm.'],

  'Tie-breaking on new entries':
    ['Desempate nas entradas novas',
     'O último lugar onde os empates eram resolvidos errado: as paradas de músicas, artistas e álbuns novos, que comparavam contagens brutas. Agora elas registram quando algo foi alcançado pela primeira vez e ordenam do mesmo jeito que todo o resto.'],

  'Tie-breaking in chart runs and modals':
    ['Desempate nos históricos e nas janelas',
     'Os históricos reconstroem cada período passado do zero, e faziam isso sem levar adiante as posições de cada período, então os empates históricos eram resolvidos ao acaso. Isso corrigiu o histórico na parada, as janelas de artista e álbum e os resumos flutuantes da parada.'],

  'Tie-breaking reached the charts themselves':
    ['O desempate chega às próprias paradas',
     'A correção anterior só tinha consertado a seção Recordes. As paradas que você realmente vê são montadas por outro caminho, que ainda ignorava completamente a posição da semana anterior, então músicas, artistas e álbuns precisaram dela de novo.'],

  'Ties now break by last week\'s position':
    ['Empates agora são decididos pela posição da semana passada',
     'Quando duas músicas tinham o mesmo número de reproduções, ganhava a que foi tocada primeiro, o que é arbitrário. Agora a música que estava mais alto na parada anterior fica com a melhor posição, do jeito que uma parada de verdade trata quem já está no lugar.'],

  'Bulk edits stopped failing across time zones':
    ['Edições em lote pararam de falhar entre fusos horários',
     'As linhas da planilha eram comparadas pelo momento no tempo, o que falha quando o navegador e a planilha estão em fusos diferentes: a mesma data escrita vira dois instantes diferentes e nada bate. Agora a comparação é feita pelo texto de artista, título e álbum, que não depende de onde você está.'],

  'An out-of-date sheet script now says so':
    ['Um script de planilha desatualizado agora avisa',
     'Se a sua Google Sheet rodava uma cópia antiga do script, ela não reconhecia o pedido de edição em lote, caía no trecho de adicionar uma linha, dizia que tinha dado certo e acrescentava uma linha vazia com data de 1970. Agora isso é detectado e aparece como um erro claro pedindo para você reimplantar, em vez de uma falha silenciosa disfarçada de sucesso.'],

  'Seconds were being thrown away from every timestamp':
    ['Os segundos eram jogados fora de todos os horários',
     'O leitor de datas entendia horas e minutos, mas descartava os segundos em silêncio, arredondando cada reprodução para o início do minuto. A planilha comparava linhas pelo horário exato, então nada batia e toda edição em lote dizia ter atualizado zero entradas.'],

  'Epoch dates blocked at every entry point':
    ['Datas de 1970 bloqueadas em todas as entradas',
     'Uma segunda rodada, mais ampla, no problema da data de 1970: qualquer reprodução com data anterior ao ano 2000 agora é pulada ao ler um CSV, ao corrigir automaticamente e ao gravar atualizações, então um horário ruim não chega às suas paradas por nenhum caminho.'],

  'Artwork works when running locally':
    ['As imagens funcionam ao rodar localmente',
     'O novo intermediário só existe no site no ar, então as imagens quebravam no desenvolvimento local. Agora ele detecta esse caso e usa o intermediário de produção.'],

  'Artwork served through our own domain':
    ['Imagens servidas pelo nosso próprio domínio',
     'Os pedidos ao Deezer passavam por um intermediário de terceiros que estava sendo bloqueado. Agora eles passam pelo próprio dankcharts.fm, com uma hora de cache na borda para buscas repetidas não baixarem de novo.'],

  'Epoch dates stopped appearing in sheets':
    ['Datas de 1970 pararam de aparecer nas planilhas',
     'Reproduções sem horário eram gravadas com data de 1º de janeiro de 1970, o que coloca uma reprodução meio século antes do início do seu histórico. Agora essas linhas são recusadas em todos os pontos onde podiam ser criadas.'],

  'Bulk edits show real progress instead of hanging':
    ['Edições em lote mostram o progresso real em vez de travar',
     'Uma edição em lote reescrevia a planilha inteira num único pedido, o que levava de 100 a 179 segundos e parecia um travamento. Agora ela sobe em blocos de 100 com progresso ao vivo: quantas já foram, a porcentagem e o tempo decorrido. Se for interrompida, o erro diz quantas entradas foram realmente gravadas.'],

  'Deezer artwork stopped failing in bursts':
    ['Imagens do Deezer pararam de falhar em sequência',
     'Os pedidos de imagem passam por um intermediário, e quando ele falhava, tudo falhava junto. Um segundo intermediário foi adicionado como alternativa, e depois de três falhas seguidas o Deezer é pulado por cinco minutos, em vez de continuar batendo na parede e enchendo o console de erros.'],

  'Faster corrections in Sheets':
    ['Correções mais rápidas no Sheets',
     'Uma tentativa de acelerar a forma como o script da planilha aplica as correções.'],

  'Sheet script stopped pushing constantly':
    ['O script da planilha parou de enviar sem parar',
     'O Apps Script por trás do Google Sheets enviava as regras de correção automática com muito mais frequência do que precisava.'],

  'Edit a Last.fm play from Raw Data':
    ['Edite uma reprodução do Last.fm em Dados Brutos',
     'Um scrobble do Last.fm pode ser editado direto em Dados Brutos. A API do Last.fm não tem operação de edição, então isso adiciona um scrobble corrigido em vez de alterar o original, e o antigo ainda precisa ser apagado à mão.'],

  'Autocorrect rules confirmed working':
    ['Regras de correção automática confirmadas funcionando',
     'A última correção da série, verificada em vez de presumida.'],

  'Autocorrect rules sync across devices':
    ['Regras de correção automática sincronizam entre dispositivos',
     'Duas falhas se somavam para perder regras. Um navegador novo gravava uma lista vazia no armazenamento local ao iniciar, que depois sobrescrevia as regras reais guardadas na nuvem; e as regras só eram enviadas numa primeira migração, então mudanças posteriores nunca saíam do dispositivo. Uma regra salva no notebook agora chega ao celular.'],

  'Autocorrect rules saving to your account':
    ['Regras de correção automática salvas na sua conta',
     'As regras não estavam sendo guardadas na conta Google conectada.'],

  'Backend pointed at the new host':
    ['Servidor apontado para a nova hospedagem',
     'O link do servidor foi redirecionado e a hospedagem antiga foi desligada por completo.'],

  'Moved to Cloudflare Pages':
    ['Mudança para o Cloudflare Pages',
     'A hospedagem saiu da Netlify.'],

  'Playlist export as CSV':
    ['Exportar playlist como CSV',
     'Uma playlist pode ser baixada como arquivo CSV, além de ser entregue a um serviço de transferência.'],

  'Albums in playlist export':
    ['Álbuns na exportação de playlist',
     'As listas de exportação de playlist ganharam uma chave de álbum.'],

  'In-site play and scrobble':
    ['Tocar e registrar dentro do site',
     'Trabalho de acompanhamento que completa o tocar e registrar dentro do site.'],

  'Play music in the app, and scrobble it':
    ['Ouça música no app, e registre',
     'Uma barra de player no rodapé da página toca uma música pelo YouTube sem sair das paradas, e registra depois de 30 segundos no Last.fm ou na sua planilha. Toda linha de música ganhou um botão de reprodução, e os botões podem ser escondidos se você preferir não vê-los.'],

  'Existing settings survived signing in':
    ['As configurações existentes sobrevivem ao login',
     'Usuários que já tinham configurado o app perdiam essas configurações ao entrar pela primeira vez.'],

  'Sign in with Google':
    ['Entre com o Google',
     'Entrar com uma conta Google funciona, e é isso que deixa suas configurações acompanharem você entre dispositivos, em vez de ficarem num só navegador.'],

  'Groundwork for Google sign-in':
    ['Base para o login com Google',
     'A configuração necessária para entrar com uma conta Google e guardar as configurações nela.'],

  'Autocorrect rules stored and portable':
    ['Regras de correção automática guardadas e portáteis',
     'As regras ficam guardadas na sua Google Sheet e podem ser exportadas e importadas como arquivo, então um conjunto de correções montado ao longo de meses não fica preso num só navegador.'],

  'Autocorrect and mass update bugs':
    ['Bugs na correção automática e na atualização em massa',
     'Vários problemas nas novas regras e na edição em lote foram corrigidos ainda em fase de testes.'],

  'Autocorrect rules and mass update':
    ['Regras de correção automática e atualização em massa',
     'Uma regra agora pode dizer que um artista ou título deve sempre ser lido como outro, e uma única correção pode ser aplicada de uma vez a todas as entradas que batem. Corrigir um nome escrito de três jeitos ao longo de dez anos deixou de ser um trabalho manual.'],

  'Raw Data editing made faster':
    ['Edição em Dados Brutos mais rápida',
     'Editar demorava tanto que parecia quebrado; caiu para algo entre 30 e 45 segundos.'],

  'Edit your raw listening data':
    ['Edite seus dados brutos de audição',
     'Reproduções individuais passaram a ser editáveis, viessem do Last.fm, do Google Sheets ou de um arquivo local. Um nome de artista errado ou um título digitado errado podia ser corrigido na origem, em vez de distorcer em silêncio todas as paradas montadas com ele. A janela de configurações que não se expandia direito foi corrigida junto.'],

  'Playlist export respects chart order':
    ['A exportação de playlist respeita a ordem da parada',
     'As playlists exportadas ignoravam as regras de prioridade que decidem a ordem em que as posições devem sair.'],

  'Release images on mobile':
    ['Imagens de lançamentos no celular',
     'Algumas imagens em Lançamentos Recentes e Próximos não carregavam no celular.'],

  'A temporary logo':
    ['Um logotipo provisório',
     'Um logotipo provisório enquanto o definitivo era pensado.'],

  'Themes and languages on the landing and setup pages':
    ['Temas e idiomas nas páginas inicial e de configuração',
     'O cartão do Sheets e a página de configuração ficaram mais fáceis de seguir, e os temas de cor e o seletor de idioma foram estendidos às páginas inicial e de configuração, para o app não mudar de visual assim que você entra.'],

  'A Google Sheets template you can generate':
    ['Um modelo de Google Sheets que você pode gerar',
     'Em vez de descrever o formato da planilha e torcer para as pessoas montarem direito, o app agora gera um modelo pronto e guia você pela configuração. O contato de suporte foi adicionado ao mesmo tempo.'],

  'Release cards always have an image':
    ['Os cartões de lançamento sempre têm imagem',
     'Próximos e Recentes Lançamentos passam por uma cadeia de fontes de imagem, então um cartão nunca fica com um buraco onde deveria estar a capa.'],

  /* ========== ABRIL 2026 ========== */

  'Clearer Last.fm setup, image fallbacks and pagination':
    ['Configuração do Last.fm mais clara, alternativas de imagem e paginação',
     'Instruções explicando o que é o Last.fm e como usá-lo, uma alternativa quando uma imagem não carrega, paginação nas paradas anuais e históricas, e scrobble manual.'],

  'A landing page, and no more borrowed spreadsheet':
    ['Uma página inicial, e chega de planilha emprestada',
     'Uma página inicial de verdade, e o fim de mandar usuários novos para a Google Sheet de outra pessoa: agora cada um escolhe o próprio método de importação.'],

  'Moved to dankcharts.fm':
    ['Mudança para dankcharts.fm',
     'A migração completa da página antiga para o site oficial, levando junto o novo sistema de importação.'],

  'Google Sheets imports everything now':
    ['O Google Sheets agora importa tudo',
     'Correção confirmada para as importações do Sheets que chegavam incompletas. A planilha inteira passa, o que importa porque um histórico cortado em silêncio gera paradas que parecem plausíveis e estão erradas.'],

  'Sheets upload, another attempt':
    ['Envio do Sheets, mais uma tentativa',
     'Mais uma tentativa com o problema de envio do Google Sheets.'],

  'Import workflow reworked and Sheets limits fixed':
    ['Fluxo de importação refeito e limites do Sheets corrigidos',
     'A sequência de importação foi reestruturada e o teto de quanto uma Google Sheet podia contribuir foi removido.'],

  'Row limits, duplicates, and Last.fm-only charts':
    ['Limites de linhas, duplicatas e paradas só com Last.fm',
     'A importação batia em limites de linhas, deixava passar reproduções duplicadas quando duas entradas tinham o mesmo horário e exigia o Last.fm para montar qualquer parada. As três coisas foram corrigidas.'],

  'Imports moved into your browser':
    ['As importações passaram para o seu navegador',
     'Sheets, CSV, planilhas e arquivos ZIP do Spotify agora são lidos inteiramente dentro do seu próprio navegador e guardados no armazenamento local, sem servidor no meio. O Last.fm ainda passa pelo servidor, mas só porque a API dele exige. Isso eliminou de vez a dependência de um banco de dados e significa que o seu histórico de audição não sai da sua máquina para virar uma parada.'],

  'Further import fixes on the live site':
    ['Mais correções de importação no site no ar',
     'Mais uma rodada em erros de importação que só apareciam no site publicado.'],

  'Google Sheets import on the live site':
    ['Importação do Google Sheets no site no ar',
     'A importação do Sheets funcionava localmente, mas não depois de publicada.'],

  'Import without an account':
    ['Importe sem conta',
     'A janela de importação ficava presa dentro do app com login, então um visitante precisava ter uma conta do Last.fm antes de poder testar qualquer coisa. Ela foi levada para a página inicial com o próprio botão e um campo de nome, então dá para importar um histórico sem conta nenhuma.'],

  'Cross-origin requests unblocked':
    ['Requisições entre origens desbloqueadas',
     'As regras de segurança do navegador estavam recusando as próprias chamadas de API do app.'],

  'Corrected API address':
    ['Endereço da API corrigido',
     'O app chamava o endereço errado para o seu servidor.'],

  'Import from Spotify, Deezer, CSV or Sheets':
    ['Importe do Spotify, Deezer, CSV ou Sheets',
     'Um único caminho de importação que aceita Last.fm, um arquivo CSV, um ZIP de dados do Spotify, uma planilha do Deezer ou uma Google Sheet. Seu histórico agora podia vir de qualquer serviço onde você já o tivesse.'],

  'Week navigation, a stats strip, and Top 100':
    ['Navegação por semanas, uma faixa de estatísticas e Top 100',
     'Navegar entre semanas, uma faixa de números de resumo acima da parada, um tema amarelo e a opção Top 100.'],

  'Users saved on login':
    ['Usuários salvos no login',
     'O cliente do banco de dados foi atualizado e as contas passaram a ser registradas no login.'],

  'Weekly chart routes':
    ['Rotas da parada semanal',
     'Rotas do servidor para buscar os dados da parada semanal.'],

  'Hosting publish directory corrected':
    ['Pasta de publicação da hospedagem corrigida',
     'A implantação estava publicando a partir da pasta errada.'],

  'The dankcharts front end':
    ['A interface do dankcharts',
     'A interface reconstruída e a configuração de hospedagem dela foram adicionadas.'],

  'A backend for the Last.fm API':
    ['Um servidor para a API do Last.fm',
     'Um pequeno servidor foi adicionado para conversar com a API do Last.fm em nome do app.'],

  'Plays tag sized for Spanish and Portuguese on mobile':
    ['Etiqueta de reproduções ajustada para espanhol e português no celular',
     'A palavra para reproduções é mais longa em espanhol e português, e na largura de um celular ela não cabia mais. O tamanho e a posição da etiqueta foram corrigidos para esses idiomas.'],

  'Charts finally fit a phone screen':
    ['As paradas finalmente cabem na tela do celular',
     'Todas as paradas agora cabem na largura de um celular em pé. A etiqueta de pico de reproduções foi movida para uma posição que funciona nesse espaço.'],

  'More of the layout made to fit':
    ['Mais partes do layout ajustadas',
     'Cabeçalho, menu de abas, seletor de calendário, estatísticas da parada e opções de exibição foram ajustados para caber na tela do celular.'],

  'Play counts visible on mobile new-music charts':
    ['Reproduções visíveis nas paradas de música nova no celular',
     'As novas paradas de Músicas, Artistas e Álbuns escondiam as reproduções no celular.'],

  'Mobile shrinkage, first attempt':
    ['Encolhimento no celular, primeira tentativa',
     'Uma tentativa com o layout que encolhia para a largura errada nos celulares.'],

  'The Events tab':
    ['A aba Eventos',
     'Uma aba para as datas em volta da sua música, e não para a música em si: aniversários de artistas e aniversários de lançamento de álbuns e singles, cada um como um bloco em que você pode clicar para ler mais.'],

  'Search a release from the release itself':
    ['Busque um lançamento a partir do próprio lançamento',
     'As entradas de Próximos e Recentes Lançamentos ficaram clicáveis, abrindo uma busca por aquele lançamento.'],

  'New-music charts on phones, first attempt':
    ['Paradas de música nova no celular, primeira tentativa',
     'As novas paradas de Músicas, Artistas e Álbuns não apareciam direito no celular.'],

  'Release updates widened to 200 artists':
    ['Novidades de lançamentos ampliadas para 200 artistas',
     'Próximos e Recentes Lançamentos olhavam seus 50 principais artistas; isso subiu para 200, então a seção cobre muito mais do que o topo do seu histórico.'],

  'The Certification Wall':
    ['O Mural de Certificações',
     'Um mural na aba Recordes mostrando todas as certificações que você conquistou, com filtros básicos para se orientar.'],

  'Set your own certification thresholds':
    ['Defina seus próprios limites de certificação',
     'Ouro, platina e diamante são definidos por número de reproduções, e os números certos dependem de quanto você ouve. Esses limites passaram a ser definidos por você, em vez de fixos.'],

  'New Songs, Artists and Albums charts':
    ['Paradas de Músicas, Artistas e Álbuns novos',
     'As paradas Semanal, Mensal e Anual ganharam paradas acompanhantes com o que foi ouvido pela primeira vez naquele período — música chegando ao seu histórico pela primeira vez, separada do que você já conhecia.'],

  'Mobile phase 2: fitting the screen upright':
    ['Celular, fase 2: caber na tela em pé',
     'Mais uma tentativa de fazer o site caber na largura de um celular na vertical.'],

  'Mobile phase 2: masthead and options width':
    ['Celular, fase 2: largura do cabeçalho e das opções',
     'Correções de largura para o cabeçalho e a fileira de opções da parada.'],

  'Mobile phase 2: sizing when zoomed out':
    ['Celular, fase 2: tamanhos com zoom afastado',
     'Os elementos da interface ficavam com o tamanho errado quando a página estava com zoom afastado no celular.'],

  'Mobile phase 1: a critical bug':
    ['Celular, fase 1: um bug crítico',
     'A primeira rodada para tornar o site usável em navegadores de celular, corrigindo um bug crítico e adicionando adaptações principalmente para o Safari.'],

  'A nudge towards setup for new users':
    ['Um empurrãozinho para a configuração para usuários novos',
     'Quem chegava pela primeira vez não tinha como saber onde configurar nada. O botão de configurar agora brilha até um nome ser definido, o que é dica suficiente sem ser uma caixa de diálogo atrapalhando.'],

  'UTC offsets shown when picking a zone':
    ['Diferença em relação ao UTC ao escolher o fuso',
     'O seletor de fuso horário agora mostra a diferença de cada fuso em relação ao UTC. O texto dos menus de tema, idioma e dia foi melhorado.'],

  'Time zones, including daylight saving':
    ['Fusos horários, incluindo horário de verão',
     'A data de uma reprodução decide em que semana ela cai, então o fuso horário em que é lida muda as próprias paradas. Seu fuso agora é uma configuração, e o horário de verão é levado em conta nos lugares que o adotam.'],

  'Automatic updates every 30 minutes':
    ['Atualizações automáticas a cada 30 minutos',
     'A atualização automática foi corrigida para que tanto o Last.fm quanto o Google Sheets sejam relidos num ciclo confiável de meia hora.'],

  'Six-hour cache and steadier loading':
    ['Cache de seis horas e carregamento mais estável',
     'Os dados ficam em cache por seis horas, e as rotinas que buscam no Last.fm e no Google Sheets ficaram mais robustas.'],

  'Theme, day and language buttons reflow better':
    ['Botões de tema, dia e idioma se reorganizam melhor',
     'Os três grupos de botões de configuração agora se adaptam a telas mais estreitas em vez de transbordar.'],

  'Your own name and start date in the masthead':
    ['Seu nome e sua data de início no cabeçalho',
     'O cabeçalho pode trazer o seu nome e a data em que começa o seu histórico de audição, em vez de um texto fixo.'],

  'Last.fm retries instead of giving up':
    ['O Last.fm tenta de novo em vez de desistir',
     'Carregar um histórico grande do Last.fm exigia muitas páginas de requisições, e uma única página com falha deixava o histórico incompleto. Agora as páginas com falha são tentadas de novo, o que afeta principalmente contas com muitos dados. O texto em espanhol da janela do artista também foi corrigido.'],

  'Yellow Dark button text made readable':
    ['Texto dos botões do Amarelo Escuro ficou legível',
     'O texto dos botões no tema Amarelo Escuro não tinha contraste suficiente com o fundo.'],

  'Certification bug on multi-album songs, and tag toggles':
    ['Bug de certificação em músicas de vários álbuns, e chaves de etiquetas',
     'As certificações saíam erradas para músicas que aparecem sob mais de um nome de álbum. A etiqueta de pico de reproduções foi para a esquerda, e as etiquetas de Pico, Certificação e Pico de reproduções ganharam cada uma a própria chave de liga/desliga.'],

  'Certification badges on every chart':
    ['Selos de certificação em todas as paradas',
     'Os selos de ouro, platina e diamante agora aparecem nas paradas Semanal, Mensal e Anual, e não só nas visões de detalhes.'],

  'Scrobble to Last.fm from inside the app':
    ['Faça scrobble no Last.fm de dentro do app',
     'O scrobble manual está disponível no próprio site, então uma reprodução pode ser registrada sem sair para o Last.fm.'],

  'Last.fm as a data source':
    ['Last.fm como fonte de dados',
     'Até então o app lia de uma Google Sheet. Conectar uma conta do Last.fm diretamente virou uma opção, e foi esse o momento em que o app deixou de ser usável só por quem estivesse disposto a manter uma planilha.'],

  'Period stats gained peaks and comparisons':
    ['As estatísticas do período ganharam picos e comparações',
     'Os números de resumo acima de uma parada semanal, mensal ou anual agora trazem etiquetas de pico e mostram como o período se compara ao anterior, para um número ter com o que ser medido.'],

  'All-Kill tags that say how many times':
    ['Etiquetas All-Kill que dizem quantas vezes',
     'As etiquetas de domínio total All-Kill foram trocadas por outras que contam quantas vezes isso realmente aconteceu, incluindo uma contagem por artista, em vez de só marcar que aconteceu. Os tamanhos de fonte da música e do álbum principais foram corrigidos.'],

  'Adjustable columns across Records':
    ['Colunas ajustáveis em todo Recordes',
     'Toda parada de Recordes deixa você mudar quantas colunas ela usa, então um recorde pode ser percorrido na largura ou lido estreito. A parada Todos os nº 1 foi melhorada e o texto de Recordes corrigido.'],

  'Debuts made less cluttered':
    ['Estreias menos poluídas',
     'O recorde de Estreias remodelado tinha imagens demais nas músicas; as imagens foram reduzidas e os blocos de artista e álbum ficaram menores.'],

  'Debuts ranked by plays, not position':
    ['Estreias ordenadas por reproduções, não por posição',
     'O recorde de Estreias foi refeito para ordenar pelo número de reproduções com que uma música chegou, e não pela posição em que entrou, o que mede melhor uma chegada. Ele também ganhou imagens e links para as paradas.'],

  'Hide the image source picker':
    ['Esconda o seletor de fonte de imagens',
     'O controle para escolher de onde vêm as imagens poluía todas as paradas. Agora ele pode ser escondido, deixando a lista mais limpa.'],

  'Translation phase 15: Records names and titles':
    ['Tradução, fase 15: nomes e títulos de Recordes',
     'Os nomes das paradas de recordes e os títulos das tabelas agora são traduzidos na hora. A parada de Aparições foi melhorada ao mesmo tempo.'],

  'Translation phase 14: the Graphs tab':
    ['Tradução, fase 14: a aba Gráficos',
     'Os gráficos foram traduzidos, e a troca de idioma ficou mais rápida de novo.'],

  'Translation phase 13: instant switching on the four chart tabs':
    ['Tradução, fase 13: troca instantânea nas quatro abas de paradas',
     'Mudar de idioma em Semanal, Mensal, Anual e Histórico agora vale na hora, sem precisar recarregar. Os históricos também foram ajustados.'],

  'Translation phase 12: Records and All-Kill':
    ['Tradução, fase 12: Recordes e All-Kill',
     'A aba Recordes e a seção All-Kill foram traduzidas, e a própria parada All-Kill foi bastante melhorada no processo.'],

  'Translation phase 11: modals and chart run buttons':
    ['Tradução, fase 11: janelas e botões de histórico',
     'As janelas de artista e álbum e os botões de histórico foram traduzidos, junto com correções nas cores dos temas — principalmente nos botões do tema amarelo escuro.'],

  'Translation phase 10: the word "chart" itself':
    ['Tradução, fase 10: a própria palavra "chart"',
     'O espanhol e o português não têm uma palavra única que corresponda ao inglês "chart" nesse sentido, e o app a usava de forma inconsistente. Todas as ocorrências foram padronizadas numa única adaptação. O texto da exportação de playlists foi corrigido ao mesmo tempo.'],

  'Translation phase 9: the share modal rebuilt':
    ['Tradução, fase 9: a janela de compartilhar refeita',
     'A janela Compartilhar como imagem foi bastante refeita para que a personalização da imagem se adapte direito a idiomas além do inglês, em vez de supor rótulos do tamanho do inglês.'],

  'Translation phase 8: the share button and its menu':
    ['Tradução, fase 8: o botão de compartilhar e o menu dele',
     'Problemas de idioma importantes no botão Compartilhar como imagem e no menu de personalização foram corrigidos.'],

  'Translation phase 7: dates everywhere, and share text':
    ['Tradução, fase 7: datas em todo lugar, e textos de compartilhamento',
     'As datas foram corrigidas em todas as paradas, e as janelas de compartilhamento, junto com as imagens que geram, foram traduzidas. Recordes e as janelas de detalhes ainda estavam pendentes.'],

  'Translation phase 6: button hover text':
    ['Tradução, fase 6: textos ao passar o mouse nos botões',
     'As descrições que aparecem ao passar o mouse num botão principal foram traduzidas. Muitos botões secundários ainda estavam pendentes.'],

  'Translation phase 5: artist and album modals':
    ['Tradução, fase 5: janelas de artista e álbum',
     'A maior parte do texto dentro das janelas de detalhes de artista e álbum foi traduzida.'],

  'Translation phase 4: peak tags':
    ['Tradução, fase 4: etiquetas de pico',
     'As etiquetas que marcam a posição de pico de uma música foram traduzidas, em vez de ficarem em inglês.'],

  'Translation corrections':
    ['Correções de tradução',
     'Pequenos ajustes de texto nas traduções.'],

  'Translation phase 3: faster language switching':
    ['Tradução, fase 3: troca de idioma mais rápida',
     'Uma grande ampliação do que foi traduzido, e trocar de idioma ficou mais rápido e menos desperdiçador.'],

  'Translation phase 2: chart headers and dates':
    ['Tradução, fase 2: títulos da parada e datas',
     'Os títulos das paradas foram corrigidos e as primeiras datas foram traduzidas.'],

  'Spanish and Portuguese arrive':
    ['Chegam o espanhol e o português',
     'A primeira fase da tradução: espanhol, português do Brasil e português europeu passaram a ser idiomas selecionáveis. Muita coisa ainda estava sem tradução nesse ponto, e as doze fases seguintes são o trabalho de terminar isso.'],

  'Collapsed sections stopped leaking between tabs':
    ['Seções recolhidas pararam de vazar entre abas',
     'Recolher uma seção numa aba recolhia a seção correspondente nas outras. Agora cada aba lembra o próprio estado. O ícone de calendário no tema Azul-marinho Claro também ficou preto para poder ser visto.'],

  'Unreadable description on entry images':
    ['Descrição ilegível nas imagens de entrada',
     'A descrição numa imagem de entrada compartilhada era desenhada sobre um fundo cinza pesado que dificultava a leitura.'],

  'Jump from a record straight to the week it happened':
    ['Vá de um recorde direto para a semana em que aconteceu',
     'A data num recorde de Todos os nº 1 agora é um link. Clicar nela abre a parada semanal daquela semana exata, para você ver o recorde no contexto em que foi feito, e não como um número solto.'],

  'Small Records update':
    ['Pequena atualização de Recordes',
     'Mais ajustes pequenos na aba Recordes.'],

  'Better All #1s and Repeat Scrobble Runs':
    ['Todos os nº 1 e Sequências de repetição melhores',
     'Duas paradas de Recordes foram melhoradas: a lista de todas as músicas que chegaram ao número um, e o recorde de ouvir a mesma música várias vezes seguidas.'],

  'Back to Top works again':
    ['Voltar ao topo funciona de novo',
     'O botão removido no dia anterior foi corrigido e recolocado.'],

  'Styles and code split out of the page':
    ['Estilos e código separados da página',
     'O CSS e o JavaScript moravam dentro do arquivo HTML. Separá-los em arquivos próprios permite que o navegador os guarde em cache entre visitas, em vez de baixar tudo de novo a cada vez.'],

  'Choose which day your week starts on':
    ['Escolha em que dia a sua semana começa',
     'As paradas semanais não supõem mais um dia de início fixo. Você escolhe o dia em que a sua semana começa, e cada parada semanal, sequência e histórico é cortado nesse limite.'],

  'Chart run image modal improved':
    ['Janela de imagem do histórico melhorada',
     'Várias melhorias e correções na janela que monta uma imagem compartilhável de um histórico.'],

  'Debug output removed':
    ['Saída de depuração removida',
     'Os registros de diagnóstico que tinham sobrado da correção das janelas foram tirados.'],

  'Artist and album modals working again':
    ['As janelas de artista e álbum voltaram a funcionar',
     'As duas janelas de detalhes foram corrigidas direito depois que a primeira tentativa não bastou.'],

  'First attempt at the broken artist modal':
    ['Primeira tentativa com a janela de artista quebrada',
     'A janela de detalhes do artista tinha quebrado; essa foi a primeira tentativa de consertá-la.'],

  'Image modal tidied, broken Back to Top removed':
    ['Janela de imagem arrumada, e Voltar ao topo quebrado removido',
     'Pequenos erros na janela de compartilhamento foram corrigidos, e o botão Voltar ao topo foi tirado porque não funcionava.'],

  'Image customisation buttons repaired':
    ['Botões de personalização de imagem consertados',
     'Os controles para personalizar uma imagem compartilhada tinham parado de funcionar direito.'],

  'Records views improved':
    ['Visões de Recordes melhoradas',
     'Uma primeira rodada de ajustes na nova aba Recordes.'],

  'The Records tab':
    ['A aba Recordes',
     'Uma aba inteira para conquistas nas paradas, onde cada tipo de conquista ganha a própria parada ordenada em vez de ser uma nota de rodapé na página de um artista. É a origem de todos os recordes que existem no app hoje.'],

  'Entry images finished':
    ['Imagens de entrada concluídas',
     'O gerador de imagens de novas entradas foi concluído e refinado.'],

  'Share a new chart entry as an image':
    ['Compartilhe uma nova entrada da parada como imagem',
     'Um segundo gerador de imagens, este para anunciar uma única entrada chegando à parada, e não a parada inteira.'],

  'Smoother navigation, and a better dark mode on reload':
    ['Navegação mais fluida, e um modo escuro melhor ao recarregar',
     'Um conjunto de pequenas melhorias na navegação pelo app e no que você vê no modo escuro logo depois de recarregar a página.'],

  'Bar race, and downloadable race GIFs':
    ['Corrida de barras, e GIFs da corrida para baixar',
     'Novos gráficos, entre eles uma corrida de barras animada mostrando seus principais artistas se ultrapassando ao longo do tempo, que pode ser baixada como GIF.'],

  'Sheet sync moved to hourly':
    ['Sincronização da planilha passou a ser de hora em hora',
     'O Google Sheets agora é relido uma vez por hora, em vez de num ciclo mais curto.'],

  'Chart runs across different periods':
    ['Históricos em períodos diferentes',
     'Os históricos não funcionavam direito quando abertos a partir de uma parada mensal ou anual em vez de uma semanal.'],

  'Chart run period labels':
    ['Rótulos de período do histórico',
     'Os históricos semanais e mensais rotulavam as caixas com trechos de tempo errados.'],

  'Chart run images improved':
    ['Imagens de histórico melhoradas',
     'Uma rodada de melhorias no gerador de imagens de histórico.'],

  'Hover hints on buttons':
    ['Dicas ao passar o mouse nos botões',
     'Os botões de todo o app ganharam descrições ao passar o mouse, então dá para descobrir o que cada um faz sem apertar primeiro.'],

  'Chart images you can download and post':
    ['Imagens da parada para baixar e postar',
     'A exportação de imagens foi concluída: qualquer parada pode virar uma imagem no tamanho de um post do feed ou de um story, e ser baixada.'],

  'The Graphs tab':
    ['A aba Gráficos',
     'Uma nova aba com visões gráficas do seu histórico, começando com duas: reproduções acumuladas ao longo do tempo e volume de reproduções — ambas capazes de comparar vários artistas nos mesmos eixos.'],

  'Recent Releases, and the dankcharts.fm name':
    ['Lançamentos Recentes, e o nome dankcharts.fm',
     'O app ganhou o nome atual e uma seção de Lançamentos Recentes, que traz música nova de artistas que você já ouve.'],

  'Visitor country counter':
    ['Contador de países dos visitantes',
     'Foi adicionado um contador registrando de quais países o site é visitado.'],

  'Real artist photos, via Deezer':
    ['Fotos reais de artistas, pelo Deezer',
     'O Deezer virou a fonte principal de imagens, o que fez os artistas finalmente terem fotos de verdade em vez de um marcador ou uma capa de álbum no lugar.'],

  'All-Time and Yearly fixes, including search':
    ['Correções em Histórico e Anual, incluindo a busca',
     'Um lote de correções nas paradas Histórico e Anual, incluindo o comportamento das barras de busca.'],

  'Top 50, 100 and 200 on the long charts':
    ['Top 50, 100 e 200 nas paradas longas',
     'As paradas Anual e Histórico agora podem ser abertas para 50, 100 ou 200 posições, em vez de pararem no topo da lista.'],

  'Peak tags on weekly artist charts':
    ['Etiquetas de pico nas paradas semanais de artistas',
     'As paradas semanais de artistas mostravam a etiqueta de pico errada.'],

  'Export playlists through Soundiiz':
    ['Exporte playlists pelo Soundiiz',
     'Playlists montadas com os dados das suas paradas podem ser passadas ao Soundiiz, que as transfere para o Spotify, Apple Music e outros serviços.'],

  'More themes, and a contrast pass':
    ['Mais temas, e uma revisão de contraste',
     'Novos temas de cor, mais uma revisão dos existentes corrigindo combinações de texto e fundo próximas demais para ler.'],

  'Shareable chart images begun':
    ['Início das imagens compartilháveis da parada',
     'Primeiro trabalho para transformar uma parada numa imagem que dá para postar. Incompleto nesse ponto.'],

  'Chart runs':
    ['Históricos na parada',
     'Toda música, artista e álbum agora tem um histórico — o registro completo, semana a semana, de onde ficou, da estreia à saída, e não só a posição atual.'],

  'Chart run layout, and first and last play dates':
    ['Layout do histórico, e datas da primeira e da última reprodução',
     'O ícone do histórico e os espaços entre as caixas foram corrigidos, e históricos longos quebram linha em vez de transbordar. Conquistas do artista agora mostra a primeira e a última vez que você ouviu cada música e álbum.'],

  'Album modals, double diamond, and tighter chart rows':
    ['Janelas de álbum, diamante duplo e linhas da parada mais justas',
     'Os álbuns ganharam a própria janela de detalhes. Foi adicionada a certificação de diamante duplo acima de diamante. Os rótulos de semana foram abreviados e os números de posição redimensionados para as linhas caberem com mais folga.'],

  'Calendar filter fixed':
    ['Filtro de calendário corrigido',
     'A visão de calendário usada para filtrar as paradas por data não devolvia o intervalo certo.'],

  'Peak and first-week figures corrected':
    ['Números de pico e de primeira semana corrigidos',
     'A posição de pico e as reproduções da primeira semana eram calculadas errado em algumas entradas.'],

  'YouTube as an artwork source':
    ['YouTube como fonte de imagens',
     'O YouTube foi adicionado como opção de imagem quando as outras fontes não têm nada, e a forma de contar os singles foi corrigida.'],

  'Collaborations count for every artist involved':
    ['Colaborações contam para todos os artistas envolvidos',
     'Músicas creditadas a mais de um artista agora somam aos totais de cada artista, e não só ao primeiro nome. Foram adicionados diagnósticos que avisam quando reproduções se perdem na importação.'],

  'Raw Data and Artist Accomplishments':
    ['Dados Brutos e Conquistas do artista',
     'Duas visões novas: Dados Brutos, que lista cada reprodução individual por trás das paradas, e Conquistas do artista, que reúne o que um único artista conquistou em todo o seu histórico.'],

  'Collaboration counts and artwork corrected':
    ['Contagens de colaborações e imagens corrigidas',
     'Continuação do trabalho com colaborações — tanto a resolução das imagens quanto os totais por artista dos créditos compartilhados estavam errados.'],

  'The first all-time chart':
    ['A primeira parada histórica',
     'A primeira versão funcional do app: uma única parada histórica com as suas músicas mais ouvidas, com imagens de artistas, álbuns e músicas, certificações em músicas e álbuns, resumos de desempenho por artista e visões Top 10 / 20 / 50 / 100.'],

  'First four themes, and a name':
    ['Os quatro primeiros temas, e um nome',
     'O app ganhou um logotipo e um sistema de temas com quatro visuais — Azul-marinho Escuro, Azul-marinho Claro, Roxo Escuro e Roxo Claro. Os temas claros ganharam fundos de página levemente coloridos e cabeçalhos mais escuros, para o cabeçalho se destacar da página, e o contraste foi aumentado nos quatro.'],

  'Accented and non-Latin names stopped breaking':
    ['Nomes com acento e não latinos pararam de quebrar',
     'Os dados do Google Sheets eram decodificados com a codificação que o navegador adivinhasse, o que estragava nomes como Los Ángeles Azules, Ricardo Arjona e 강남스타일. Agora a planilha é lida explicitamente como UTF-8, então títulos com acento, em coreano e em outros alfabetos não latinos chegam intactos.'],

  'Spanish-language sheets were silently losing most plays':
    ['Planilhas em espanhol perdiam em silêncio a maioria das reproduções',
     'O Google Sheets escreve as datas no idioma da sua conta, e nenhum leitor de datas padrão entende meses em espanhol como ene ou febrero. O resultado era que a maior parte de um histórico em espanhol era descartada sem aviso. Agora os meses em espanhol são entendidos, e qualquer formato de data que o app ainda não consiga ler é contado e informado, em vez de descartado em silêncio.'],

  'Dropout charts, and more on every row':
    ['Paradas de saídas, e mais em cada linha',
     'Foram adicionadas paradas das músicas que saíram, e toda linha da parada ganhou a posição anterior, o número de reproduções e as semanas ou meses na parada. As etiquetas de pico foram corrigidas ao mesmo tempo.'],

};
