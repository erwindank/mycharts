/* Charts Guide lessons — European Portuguese (see guide-lessons.js for the shape).
   Uses the site's own pt-PT labels (translations.pt-PT.js): top, Semanal,
   Grelha, Aspirantes, Fora do Top… and the "tu" form, like the rest of the
   site's pt-PT text. Anything missing falls back to English. */
window.GL_TEXT = window.GL_TEXT || {};
window.GL_TEXT['pt-PT'] = {
  ui: {
    eyebrow: 'Guia de Charts',
    hero_title: 'Conhece os teus tops de uma ponta à outra.',
    hero_sub: 'Cada separador, cada botão, cada opção, mostrados na app a sério. Explora as imagens, segue os passos e depois experimenta tu.',
    hero_stats: '{{lessons}} lições · {{ch}} desafios',
    ring_label: 'dominadas',
    ring_of: '{{done}} de {{total}}',
    tab_lessons: 'Lições',
    tab_ref: 'Consulta',
    continue: 'Continuar',
    start: 'Começa aqui',
    continue_note: 'A seguir: {{what}}',
    tip_title: 'A dica de hoje',
    tip_new: 'Uma nova todos os dias',
    tip_try: 'Mostra-me',
    tip_open: 'Abrir a lição',
    area: { charts: 'Os teus tops', insights: 'Estatísticas, recordes e prémios', more: 'Mais separadores', setup: 'Definições' },
    soon: 'Em breve',
    mastered: 'Dominada',
    in_progress: '{{pct}}% feito',
    not_started: 'Por começar',
    mins: '{{n}} min',
    back_hub: 'Todas as lições',
    sec_screen: 'Conhece o ecrã',
    sec_screen_sub: 'Escolhe um número para veres o que essa parte faz. Usa ← → para percorrer.',
    sec_howto: 'Como…',
    sec_howto_sub: 'Percursos curtos, passo a passo. Cada um acaba contigo a experimentar.',
    sec_options: 'Todas as opções',
    sec_options_sub: 'A lista completa. Toca numa imagem para a veres maior.',
    sec_try: 'Experimenta tu',
    sec_try_sub: 'Faz na app a sério. O guia dá por isso, estejas onde estiveres.',
    sec_quiz: 'Revisão rápida',
    sec_quiz_sub: 'Três perguntas. Acerta todas para dominares a lição.',
    device_desktop: 'Computador',
    device_phone: 'Telemóvel',
    whole: 'Ecrã inteiro',
    prev: 'Anterior',
    next: 'Seguinte',
    step_of: 'Passo {{n}} de {{total}}',
    steps: '{{n}} passos',
    start_walk: 'Começar',
    done: 'Feito',
    try_now: 'Experimentar agora',
    close: 'Fechar',
    show_me: 'Mostra-me',
    done_chip: 'Feito',
    default: 'Predefinição',
    def_on: 'Ligado',
    def_off: 'Desligado',
    correct: 'Certo!',
    wrong: 'Quase.',
    retry: 'Tenta outra vez',
    quiz_done: 'As três certas.',
    next_lesson: 'Lição seguinte',
    toast_title: 'Desafio concluído',
    toast_progress: '{{done}} de {{total}} em “{{lesson}}”',
    toast_back: 'Voltar à lição',
    coach_back: 'Voltar ao guia',
    coach_hint: 'É a tua vez',
    mastered_title: 'Lição dominada',
    mastered_text: 'Já conheces “{{lesson}}” de uma ponta à outra.',
    loading: 'A carregar o guia…',
    ref_note: 'Verificações, os teus dados, perguntas frequentes, glossário e atalhos. Vão ganhar o novo visual numa próxima atualização.'
  },

  lessons: {
    week: {
      title: 'O teu top Semanal',
      promise: 'Lê cada número de um top, anda entre semanas e deixa-o com o aspeto de que mais gostas.',
      scenes: {
        top: { title: 'Topo da página', spots: {
          periods: ['Períodos', 'Diário, Semanal, Mensal, Anual e De Sempre: os mesmos tops num intervalo de tempo diferente. As teclas D, W, M, Y e A levam-te lá diretamente.'],
          prev: ['Semana anterior', 'Recua uma semana. A tecla ← faz o mesmo, e no telemóvel podes deslizar o top.'],
          label: ['Em que semana estás', 'O nome da semana e as datas. Clica para abrir um calendário e saltar para qualquer semana.'],
          next: ['Semana seguinte', 'Avança uma semana. Fica apagado quando estás na semana atual.'],
          streak: ['Sequência de escuta', 'Quantos dias seguidos ouviste alguma coisa, e a tua melhor sequência. Clica para veres as tuas sequências.'],
          banner: ['A semana numa linha', 'Quem dominou a semana e o facto que vale a pena saber. Enquanto a semana ainda decorre, diz quem vai à frente.'],
          tiles: ['Quatro números', 'Plays, músicas diferentes, artistas e álbuns da semana. Clica num deles para ires a esse top. Abaixo da linha: o teu melhor dia e quanto era novo para ti.'],
          delta: ['Mudança desde a semana passada', '▲ verde: mais do que na semana anterior. ▼ vermelho: menos.'],
          compare: ['Comparar', 'Abre umas barras que põem esta semana ao lado da anterior, da tua semana habitual e do teu recorde.']
        } },
        chart: { title: 'O top', spots: {
          spotlight: ['Do momento', 'A tua música, artista e álbum mais ouvidos nos 15 dias até ao fim desta semana, e o teu artista em ascensão: o que descobriste nos últimos 45 dias e mais ouves.'],
          type: ['Músicas, Artistas, Álbuns', 'Três tops da mesma semana. Escolhe um; a página lembra-se da tua escolha.'],
          layouts: ['Seis layouts', 'Tabela, Grelha, Compacto, Mosaico, Faixa e Pilha. O mesmo top com outro aspeto. Músicas, artistas e álbuns guardam cada um o seu.'],
          collapse: ['Recolher o top', 'Esconde o top mas mantém o título, para a página ficar mais curta. Carrega em + para o abrir outra vez.'],
          title: ['Tamanho do top', '“Top 10 Músicas”: quantas entradas tem este top. Muda-o em ⋮ → Tamanho.'],
          animate: ['Animar o top', 'Repete os plays um a um, do top da semana passada até este, para veres as músicas a ultrapassarem-se umas às outras.'],
          menu: ['Opções do top (⋮)', 'Três separadores: Mostrar (mais detalhes em cada linha), Tamanho (quantas entradas) e Ações (ouvir, partilhar, exportar).'],
          desc: ['O que o top conta', 'Uma linha curta por baixo do título. Liga-a ou desliga-a em ⋮ → Mostrar → Descrições.'],
          heads: ['Colunas', 'Posição, movimento, título e artista, álbum, semanas no top e plays.'],
          first: ['Uma linha do top', 'Clica numa linha para abrir a janela dela com tudo sobre ela. A próxima imagem desmonta uma linha peça a peça.']
        } },
        row: { title: 'Uma linha, peça a peça', spots: {
          rank: ['Posição', 'Onde está esta semana. A linha do #1 é a dourada.'],
          move: ['Sem mudança (=)', 'A mesma posição da semana passada.'],
          prev: ['Posição da semana passada', 'O número pequeno por baixo do movimento: onde estava na semana anterior.'],
          up: ['Subiu (▲)', 'Subiu essas posições desde a semana passada.'],
          down: ['Desceu (▼)', 'Desceu essas posições desde a semana passada.'],
          newe: ['NOVO', 'A primeira semana neste top.'],
          re: ['RE (reentrada)', 'Voltou ao top depois de ter saído. Mantém o pico e as semanas.'],
          art: ['Capa', 'Carrega em ▶ na capa para ouvires um excerto de 30 segundos.'],
          title: ['Título e artista', 'Clica no título para a janela da música, ou no nome do artista para a dele.'],
          peak: ['Tag de pico', 'A posição mais alta que já alcançou neste top. Liga-a em ⋮ → Mostrar → Tags pico.'],
          cert: ['Certificação', 'Ouro, Platina ou Diamante quando passa uma marca de plays. Liga-a em ⋮ → Mostrar → Selos cert.'],
          album: ['Álbum', 'Clica para a janela do álbum.'],
          weeks: ['Semanas no top', 'Quantas semanas passou no top no total, somando todas as passagens. Nunca volta a zero.'],
          plays: ['Plays', 'Plays desta semana. É a única coisa que define a ordem do top.'],
          pdelta: ['Mudança de plays', 'Quantos mais ou menos do que na semana passada.'],
          best: ['Pico de plays (▲ BEST)', 'O maior número de plays numa semana até agora. Liga-o em ⋮ → Mostrar → Pico de plays.'],
          spotify: ['Spotify', 'Procura no Spotify.'],
          more: ['Menu da linha (⋮)', 'Ouvir, adicionar a uma playlist, abrir a janela e mais. Clica com o botão direito numa linha para o mesmo menu.'],
          run: ['Percurso', 'Abre o percurso por baixo da linha: cada semana em que esteve no top, e em que posição.']
        } },
        run: { title: 'Uma linha aberta', spots: {
          run: ['O botão do percurso', 'Fica aceso enquanto o painel está aberto. Carrega outra vez para o fechar.'],
          facts: ['Álbum e artistas', 'Clica em qualquer um para abrir a janela dele.'],
          acts: ['Ações rápidas', 'Excerto (30 segundos), o vídeo, adicionar a uma playlist, YouTube, e Detalhes para a janela completa.'],
          range: ['Intervalo', 'Conta o percurso neste ano até agora, até à semana em que estás, ou desde sempre.'],
          now: ['Esta semana', 'A posição da semana passada, os plays desta semana com a mudança, e a certificação.'],
          story: ['A história numa linha', 'Como se estreou, quanto tempo ficou no pico e quanto tempo no top.'],
          ribbon: ['Totais', 'Pico, semanas nesse pico, semanas no top e plays. Clica nas semanas no pico para veres quais foram.'],
          boxes: ['Semana a semana', 'Um quadrado por cada semana no top: a posição e a semana. Os dourados são semanas no pico.'],
          goals: ['Próxima marca', 'A próxima coisa que pode alcançar e quantos plays faltam, e depois as seguintes.'],
          more: ['Mais', 'Recordes de sequência, um mapa de calor e todo o histórico de plays, cada um recolhido até o abrires.']
        } },
        replay: { title: 'Animar o top', spots: {
          when: ['O momento mostrado', 'O top é contado em 7 dias que avançam, play a play, da semana passada até esta. Estes são os 7 dias contados agora.'],
          count: ['Quanto já vai', 'Em que play o replay vai, do total.'],
          days: ['A semana que desliza', 'Os dias da semana passada e os desta. O bloco destacado são os 7 dias contados. Clica num dia para saltar para lá.'],
          ends: ['Início e fim', 'Começa no top anterior e acaba neste.'],
          scrub: ['Barra de tempo', 'Arrasta para qualquer momento pelo meio.'],
          play: ['Play / pausa', 'A barra de espaços faz o mesmo.'],
          step: ['Passo a passo', '−1d e +1d saltam um dia inteiro, ◀ e ▶ um play, ⏮ e ⏭ para qualquer das pontas.'],
          speeds: ['Velocidade', 'Desde metade até 20 vezes mais depressa.'],
          log: ['O que acabou de mudar', 'Os últimos plays que entraram (+) e saíram (−) dos 7 dias, com a hora.'],
          keys: ['Teclas', 'Espaço, ← →, Shift + ← → e Home / End funcionam enquanto corre.'],
          close: ['Fechar', 'Volta ao top normal. Esc faz o mesmo.']
        } }
      },
      howto: {
        nav: { title: 'Ir para outra semana', slides: [
          'Carrega em ‹ para recuar uma semana. A tecla ← também funciona.',
          'Carrega em › para voltar a avançar. No telemóvel, desliza o top para os lados.',
          'Para saltar mais longe, clica no nome da semana. Abre-se um calendário: escolhe qualquer dia e o top vai para a semana desse dia.',
          'Preferes um mês ou um ano? Escolhe Mensal ou Anual aqui em cima.'
        ] },
        size: { title: 'Tornar o top mais longo', slides: [
          'Abre o ⋮ ao lado do top.',
          'Escolhe o separador Tamanho.',
          'Escolhe de Top 10 até Top 100.',
          'O título muda com ele. Diário, Semanal, Mensal e Anual lembram-se cada um do seu tamanho.'
        ] },
        layout: { title: 'Mudar o aspeto do top', slides: [
          'Estes seis botões mudam o layout. Tabela é o que tens ao começar.',
          'Grelha: capas grandes, feita para ir descendo.',
          'Mosaico: as primeiras entradas em blocos grandes, o resto mais pequeno.',
          'Faixa: um pódio para os três primeiros e tudo o resto numa faixa.',
          'Compacto: uma linha fina por entrada, para caber o máximo no ecrã.',
          'Pilha: cartões uns em cima dos outros. Só a Pilha tem este botão extra, que a divide em duas colunas.'
        ] },
        details: { title: 'Mostrar mais em cada linha', slides: [
          'Abre o ⋮ ao lado do top.',
          'O separador Mostrar. Tudo começa desligado, para o top ficar limpo.',
          'Marca o que quiseres, por exemplo Tags pico.',
          'Aparece logo em todas as linhas.',
          'Em Secções escolhes que listas aparecem por baixo do top: Aspirantes, Fora do Top e Novas Entradas.'
        ] },
        type: { title: 'Ver os teus artistas ou álbuns', slides: [
          'Músicas, Artistas e Álbuns são três tops da mesma semana.',
          'Artistas: conta cada play de qualquer música deles.',
          'Álbuns: os plays das músicas de cada álbum, somados.'
        ] },
        run: { title: 'Seguir o percurso de uma música', slides: [
          'Carrega nas barrinhas ao fim de uma linha.',
          'O percurso abre por baixo da linha: um quadrado por cada semana no top, com a posição.',
          'Muda o intervalo para contar o percurso neste ano, até esta semana, ou desde sempre.',
          'Põe um excerto ou o vídeo, ou adiciona a uma playlist, logo daqui.',
          'O ⋮ da linha tem tudo o resto, incluindo o álbum e o artista. Clicar com o botão direito na linha abre o mesmo menu.'
        ] },
        animate: { title: 'Ver a semana passada a transformar-se nesta', slides: [
          'Carrega em Animar o top, por cima do top.',
          'Começa no top da semana passada. Depois 7 dias avançam, play a play, e as músicas mexem-se conforme entram e saem plays.',
          'Faz pausa quando quiseres, ou avança um play ou um dia inteiro de cada vez.',
          'Ou arrasta a barra de tempo para qualquer momento.',
          'Esta lista mostra o que acabou de entrar e o que acabou de sair.',
          'Fecha-o para voltares ao top normal.'
        ] }
      },
      options: {
        layouts: { title: 'Layouts', items: {
          table: ['Tabela', 'Linhas com todas as colunas. O que tens ao começar.'],
          grid: ['Grelha', 'Capas grandes numa grelha.'],
          compact: ['Compacto', 'Uma linha fina por entrada. É o que cabe mais no ecrã.'],
          mosaic: ['Mosaico', 'As primeiras entradas em blocos grandes, o resto mais pequeno.'],
          filmstrip: ['Faixa', 'Um pódio para os três primeiros e o resto numa faixa que podes deslizar ou pôr a andar sozinha.'],
          stack: ['Pilha', 'Cartões uns em cima dos outros, com opção de duas colunas.']
        } },
        show: { title: '⋮ → Mostrar', items: {
          cert: ['Selos cert', 'Ouro, Platina e Diamante em músicas e álbuns que passaram uma marca de plays.'],
          score: ['As minhas notas', 'A tua avaliação, em tudo o que avaliaste.'],
          ppeak: ['Pico de plays', 'Uma tag ▲ BEST quando uma entrada tem o maior número de plays numa semana até agora.'],
          ptags: ['Tags pico', 'A posição mais alta que cada entrada já alcançou.'],
          bulegend: ['Legenda aspirantes', 'A explicação das tags dos Aspirantes.'],
          desc: ['Descrições', 'Uma linha curta por baixo do título de cada top a dizer o que conta.']
        } },
        sections: { title: '⋮ → Mostrar → Secções', items: {
          normal: ['Top', 'O top em si. Desliga-o para veres só as listas por baixo.'],
          bu: ['Aspirantes', 'As entradas logo abaixo do corte.'],
          off: ['Fora do Top', 'O que saiu esta semana.'],
          new: ['Novas Entradas', 'Tudo o que é novo esta semana, numa lista.']
        } },
        size: { title: '⋮ → Tamanho', items: {
          week: ['Tamanhos do Semanal', 'Top 10, 20, 25, 30, 50 ou 100.'],
          other: ['Outros tops', 'Diário: Top 10 a 50 (começa em 20). Mensal: 25 a 100 (começa em 50). Anual: 50, 100, 200 ou tudo (começa em 100). De Sempre: 50, 100, 200 ou tudo (começa em tudo).']
        } },
        actions: { title: '⋮ → Ações', items: {
          playall: ['Ouvir tudo', 'Toca as músicas do top por ordem no leitor.'],
          shuffle: ['Aleatório', 'O mesmo, por ordem aleatória.'],
          export: ['Exportar playlist', 'O top como playlist: copia, guarda como texto ou leva para o Spotify e outros.'],
          share: ['Partilhar como imagem', 'Uma imagem do top para as redes sociais, em vários tamanhos e estilos.'],
          pdf: ['PDF para imprimir', 'O top preparado para imprimir ou guardar como PDF.']
        } },
        badges: { title: 'Selos de uma linha', items: {
          up: ['▲ Subiu', 'Subiu essas posições.'],
          down: ['▼ Desceu', 'Desceu essas posições.'],
          same: ['= Sem mudança', 'A mesma posição da semana passada.'],
          newe: ['NOVO', 'Primeira semana no top.'],
          re: ['RE', 'Voltou depois de ter saído.'],
          peak: ['PICO #', 'A posição mais alta.'],
          cert: ['Ouro / Platina / Diamante', 'Passou uma marca de plays.'],
          best: ['▲ BEST', 'Mais plays numa semana até agora.']
        } }
      },
      challenges: {
        'week.prev': ['Recua uma semana', 'Carrega em ‹ ou na tecla ←.'],
        'week.jump': ['Abre o calendário', 'Clica no nome da semana.'],
        'week.type': ['Vê o teu top de Artistas ou Álbuns', 'Usa o seletor por cima do top.'],
        'week.layout': ['Experimenta um layout que não seja Tabela', 'Qualquer um dos seis botões de layout.'],
        'week.size': ['Muda o tamanho do top', '⋮ → Tamanho.'],
        'week.show': ['Liga alguma coisa em ⋮ → Mostrar', 'Tags pico é uma boa para começar.'],
        'week.animate': ['Anima o top', 'Carrega em Animar o top.'],
        'week.run': ['Abre o percurso de uma música', 'As barrinhas ao fim de uma linha.']
      },
      quiz: {
        q1: ['Uma linha mostra RE. O que quer dizer?',
          ['É nova esta semana', 'Voltou depois de ter saído', 'Repetiu a posição da semana passada'],
          'RE quer dizer reentrada: esteve no top, saiu e voltou. Mantém o pico e as semanas.'],
        q2: ['Uma música mostra ▲7 com um #9 pequeno por baixo. Onde estava na semana passada?',
          ['#7', '#9', '#16'],
          'O número pequeno é a posição da semana passada. Subiu 7 posições, do #9 para o #2.'],
        q3: ['O que decide a posição de uma música no top Semanal?',
          ['Os plays dessa semana', 'Os plays de sempre', 'A posição mais alta até agora'],
          'Só contam os plays dentro dessa semana. Nada passa de semanas anteriores.']
      },
      tips: [
        'Carrega em ← e → para passar as semanas sem tocar no rato.',
        'Clica com o botão direito em qualquer linha (ou carrega no ⋮ dela) para ouvir, adicionar a uma playlist e mais.',
        'Músicas, Artistas e Álbuns lembram-se cada um do seu layout, por isso os álbuns podem estar em Mosaico e as músicas em Tabela.',
        'Animar o top repete a passagem do top da semana passada para este, play a play. Experimenta numa semana com uma luta renhida pelo #1.',
        'Clica em qualquer um dos quatro números para ires diretamente a esse top.'
      ]
    },

    periods: { title: 'Tops Mensal e Anual', promise: 'Tops de fim de ano de qualquer ano, e meses que mostram o que ficou mesmo.' },
    daily: { title: 'O teu top Diário', promise: 'Um dia de cada vez: as tuas músicas do dia, os teus hábitos e memórias do mesmo dia.' },
    alltime: { title: 'De Sempre e viagens no tempo', promise: 'As tuas músicas mais ouvidas de sempre, e como estava o top em qualquer dia.' },
    around: { title: 'À volta do top e partilhá-lo', promise: 'Aspirantes, Fora do Top, Novas Entradas, imagens, PDFs e playlists.' },
    windows: { title: 'Janelas de música, artista e álbum', promise: 'Tudo sobre uma música, um artista ou um álbum, e como o encontrar depressa.' },
    stats: { title: 'Estatísticas', promise: 'Resumo, História, Gráficos, Comparar e Jogos para qualquer período.' },
    records: { title: 'Recordes', promise: 'O teu livro de recordes: números um, estreias, certificações, sequências e mais.' },
    awards: { title: 'Prémios', promise: 'A tua própria gala de prémios, dos nomeados à cerimónia.' },
    soundtrack: { title: 'Sua Trilha Sonora', promise: 'Um mês, um ano ou desde sempre, contado em capítulos.' },
    dank100: { title: 'The Dank 100', promise: 'Os tops semanais de toda a gente somados num só.' },
    ratings: { title: 'Avaliações', promise: 'Dá notas a álbuns e músicas, e descobre o teu lado crítico.' },
    events: { title: 'Eventos', promise: 'Aniversários, datas de álbuns, lançamentos e a Máquina do Tempo.' },
    playlists: { title: 'Playlists', promise: 'Guarda tops como playlists, e deixa-as fazerem-se sozinhas.' },
    rawdata: { title: 'Dados brutos', promise: 'Cada play: procura, corrige, exporta.' },
    board: { title: 'O Fórum', promise: 'Sugere ideias, reporta erros e vota.' },
    settings: { title: 'Definições e a tua conta', promise: 'Fontes de dados, definições dos tops, temas, sessão e cópias de segurança.' }
  }
};
