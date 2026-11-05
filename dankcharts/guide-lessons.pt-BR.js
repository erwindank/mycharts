/* Charts Guide lessons — Brazilian Portuguese (see guide-lessons.js for the shape).
   Uses the site's own pt-BR labels (translations.pt-BR.js): parada, Semanal,
   Grade, Aspirantes, Fora da Parada… and "você", like the rest of the site.
   Anything missing falls back to English. */
window.GL_TEXT = window.GL_TEXT || {};
window.GL_TEXT['pt-BR'] = {
  ui: {
    eyebrow: 'Guia de Charts',
    hero_title: 'Conheça suas paradas de ponta a ponta.',
    hero_sub: 'Cada aba, cada botão, cada opção, mostrados no app de verdade. Explore as imagens, siga os passos e depois teste você mesmo.',
    hero_stats: '{{lessons}} lições · {{ch}} desafios',
    ring_label: 'dominadas',
    ring_of: '{{done}} de {{total}}',
    tab_lessons: 'Lições',
    tab_ref: 'Consulta',
    continue: 'Continuar',
    start: 'Comece aqui',
    continue_note: 'A seguir: {{what}}',
    tip_title: 'A dica de hoje',
    tip_new: 'Uma nova todo dia',
    tip_try: 'Me mostre',
    tip_open: 'Abrir a lição',
    area: { charts: 'Suas paradas', insights: 'Estatísticas, recordes e prêmios', more: 'Mais abas', setup: 'Configurações' },
    soon: 'Em breve',
    mastered: 'Dominada',
    in_progress: '{{pct}}% feito',
    not_started: 'Não iniciada',
    mins: '{{n}} min',
    back_hub: 'Todas as lições',
    sec_screen: 'Conheça a tela',
    sec_screen_sub: 'Escolha um número para ver o que aquela parte faz. Use ← → para percorrer.',
    sec_howto: 'Como…',
    sec_howto_sub: 'Roteiros curtos, passo a passo. Cada um termina com você testando.',
    sec_options: 'Todas as opções',
    sec_options_sub: 'A lista completa. Toque numa imagem para ver maior.',
    sec_try: 'Teste você mesmo',
    sec_try_sub: 'Faça no app de verdade. O guia percebe, onde quer que você esteja.',
    sec_quiz: 'Revisão rápida',
    sec_quiz_sub: 'Três perguntas. Acerte todas para dominar a lição.',
    device_desktop: 'Computador',
    device_phone: 'Celular',
    whole: 'Tela inteira',
    prev: 'Anterior',
    next: 'Próximo',
    step_of: 'Passo {{n}} de {{total}}',
    steps: '{{n}} passos',
    start_walk: 'Começar',
    done: 'Pronto',
    try_now: 'Testar agora',
    close: 'Fechar',
    show_me: 'Me mostre',
    done_chip: 'Feito',
    default: 'Padrão',
    def_on: 'Ligado',
    def_off: 'Desligado',
    correct: 'Certo!',
    wrong: 'Quase.',
    retry: 'Tente de novo',
    quiz_done: 'As três certas.',
    next_lesson: 'Próxima lição',
    toast_title: 'Desafio concluído',
    toast_progress: '{{done}} de {{total}} em “{{lesson}}”',
    toast_back: 'Voltar para a lição',
    coach_back: 'Voltar para o guia',
    coach_hint: 'Sua vez',
    mastered_title: 'Lição dominada',
    mastered_text: 'Você conhece “{{lesson}}” de ponta a ponta.',
    loading: 'Carregando o guia…',
    ref_note: 'Verificações, seus dados, perguntas frequentes, glossário e atalhos. Eles ganham o novo visual numa próxima atualização.'
  },

  lessons: {
    week: {
      title: 'Sua parada Semanal',
      promise: 'Leia cada número de uma parada, navegue entre semanas e deixe ela do jeito que você gosta.',
      scenes: {
        top: { title: 'Topo da página', spots: {
          periods: ['Períodos', 'Diário, Semanal, Mensal, Anual e Histórico: as mesmas paradas num trecho de tempo diferente. As teclas D, W, M, Y e A levam direto.'],
          prev: ['Semana anterior', 'Volta uma semana. A tecla ← faz o mesmo, e no celular dá para deslizar a parada.'],
          label: ['Em que semana você está', 'O nome da semana e as datas. Clique para abrir um calendário e pular para qualquer semana.'],
          next: ['Próxima semana', 'Avança uma semana. Fica apagado quando você está na semana atual.'],
          streak: ['Sequência de escuta', 'Quantos dias seguidos você ouviu algo, e sua melhor sequência. Clique para ver suas sequências.'],
          banner: ['A semana numa linha', 'Quem dominou a semana e o fato que vale saber sobre ela. Enquanto a semana ainda está rolando, mostra quem está na frente.'],
          tiles: ['Quatro números', 'Plays, músicas diferentes, artistas e álbuns da semana. Clique num deles para ir à parada. Abaixo da linha: seu melhor dia e quanto era novidade para você.'],
          delta: ['Mudança desde a semana passada', '▲ verde: mais que a semana anterior. ▼ vermelho: menos.'],
          compare: ['Comparar', 'Abre barrinhas que colocam esta semana ao lado da anterior, da sua semana normal e do seu recorde.']
        } },
        chart: { title: 'A parada', spots: {
          spotlight: ['Do momento', 'Sua música, artista e álbum mais ouvidos nos 15 dias até o fim desta semana, e seu artista em ascensão: o que você descobriu nos últimos 45 dias e mais ouve.'],
          type: ['Músicas, Artistas, Álbuns', 'Três paradas da mesma semana. Escolha uma; a página lembra a sua escolha.'],
          layouts: ['Seis layouts', 'Tabela, Grade, Compacto, Mosaico, Faixa e Pilha. A mesma parada com outro visual. Músicas, artistas e álbuns guardam cada um o seu.'],
          collapse: ['Recolher a parada', 'Esconde a parada mas mantém o título, para a página ficar mais curta. Aperte + para abrir de novo.'],
          title: ['Tamanho da parada', '“Top 10 Músicas”: quantas entradas esta parada tem. Mude em ⋮ → Tamanho.'],
          animate: ['Animar a parada', 'Repete as plays uma a uma, da parada da semana passada até esta, para você ver as músicas passando umas pelas outras.'],
          menu: ['Opções da parada (⋮)', 'Três abas: Mostrar (mais detalhes em cada linha), Tamanho (quantas entradas) e Ações (ouvir, compartilhar, exportar).'],
          desc: ['O que a parada conta', 'Uma linha curta abaixo do título. Ligue ou desligue em ⋮ → Mostrar → Descrições.'],
          heads: ['Colunas', 'Posição, movimento, título e artista, álbum, semanas na parada e plays.'],
          first: ['Uma linha da parada', 'Clique numa linha para abrir a janela dela com tudo sobre ela. A próxima imagem desmonta uma linha peça por peça.']
        } },
        row: { title: 'Uma linha, peça por peça', spots: {
          rank: ['Posição', 'Onde está esta semana. A linha do #1 é a dourada.'],
          move: ['Sem mudança (=)', 'A mesma posição da semana passada.'],
          prev: ['Posição da semana passada', 'O número pequeno abaixo do movimento: onde estava na semana anterior.'],
          up: ['Subiu (▲)', 'Subiu essas posições desde a semana passada.'],
          down: ['Caiu (▼)', 'Caiu essas posições desde a semana passada.'],
          newe: ['NOVO', 'A primeira semana dela nesta parada.'],
          re: ['RE (reentrada)', 'Voltou à parada depois de ter saído. Mantém o pico e as semanas.'],
          art: ['Capa', 'Aperte ▶ na capa para ouvir um trecho de 30 segundos.'],
          title: ['Título e artista', 'Clique no título para a janela da música, ou no nome do artista para a dele.'],
          peak: ['Tag de pico', 'A posição mais alta que já alcançou nesta parada. Ligue em ⋮ → Mostrar → Tags pico.'],
          cert: ['Certificação', 'Ouro, Platina ou Diamante quando passa de uma marca de plays. Ligue em ⋮ → Mostrar → Selos cert.'],
          album: ['Álbum', 'Clique para a janela do álbum.'],
          weeks: ['Semanas na parada', 'Quantas semanas passou na parada no total, somando todas as passagens. Nunca zera.'],
          plays: ['Plays', 'Plays desta semana. É a única coisa que define a ordem da parada.'],
          pdelta: ['Mudança de plays', 'Quantas a mais ou a menos que na semana passada.'],
          best: ['Pico de plays (▲ BEST)', 'O maior número de plays dela numa semana até agora. Ligue em ⋮ → Mostrar → Pico de plays.'],
          spotify: ['Spotify', 'Procura no Spotify.'],
          more: ['Menu da linha (⋮)', 'Ouvir, adicionar a uma playlist, abrir a janela e mais. Clique com o botão direito numa linha para o mesmo menu.'],
          run: ['Trajetória', 'Abre a trajetória abaixo da linha: cada semana em que esteve na parada, e em que posição.']
        } },
        run: { title: 'Uma linha aberta', spots: {
          run: ['O botão de trajetória', 'Fica aceso enquanto o painel está aberto. Aperte de novo para fechar.'],
          facts: ['Álbum e artistas', 'Clique em qualquer um para abrir a janela dele.'],
          acts: ['Ações rápidas', 'Trecho (30 segundos), o vídeo, adicionar a uma playlist, YouTube, e Detalhes para a janela completa.'],
          range: ['Intervalo', 'Conta a trajetória neste ano até agora, até a semana em que você está, ou desde sempre.'],
          now: ['Esta semana', 'A posição da semana passada, as plays desta semana com a mudança, e a certificação.'],
          story: ['A história numa linha', 'Como estreou, quanto tempo ficou no pico e quanto tempo na parada.'],
          ribbon: ['Totais', 'Pico, semanas nesse pico, semanas na parada e plays. Clique nas semanas no pico para ver quais foram.'],
          boxes: ['Semana a semana', 'Um quadrinho por semana na parada: a posição e a semana. Os dourados são semanas no pico.'],
          goals: ['Próxima marca', 'A próxima coisa que pode alcançar e quantas plays faltam, e depois as seguintes.'],
          more: ['Mais', 'Recordes de sequência, um mapa de calor e todo o histórico de plays, cada um recolhido até você abrir.']
        } },
        replay: { title: 'Animar a parada', spots: {
          when: ['O momento mostrado', 'A parada é contada em 7 dias que avançam, play a play, da semana passada até esta. Estes são os 7 dias contados agora.'],
          count: ['Quanto já foi', 'Em que play o replay está, do total.'],
          days: ['A semana que desliza', 'Os dias da semana passada e os desta. O bloco destacado são os 7 dias contados. Clique num dia para pular para lá.'],
          ends: ['Início e fim', 'Começa na parada anterior e termina nesta.'],
          scrub: ['Barra de tempo', 'Arraste para qualquer momento no meio.'],
          play: ['Play / pausa', 'A barra de espaço faz o mesmo.'],
          step: ['Passo a passo', '−1d e +1d pulam um dia inteiro, ◀ e ▶ uma play, ⏮ e ⏭ para qualquer ponta.'],
          speeds: ['Velocidade', 'Da metade até 20 vezes mais rápido.'],
          log: ['O que acabou de mudar', 'As últimas plays que entraram (+) e saíram (−) dos 7 dias, com o horário.'],
          keys: ['Teclas', 'Espaço, ← →, Shift + ← → e Home / End funcionam enquanto roda.'],
          close: ['Fechar', 'Volta para a parada normal. Esc faz o mesmo.']
        } }
      },
      howto: {
        nav: { title: 'Ir para outra semana', slides: [
          'Aperte ‹ para voltar uma semana. A tecla ← também funciona.',
          'Aperte › para avançar de novo. No celular, deslize a parada para os lados.',
          'Para pular mais longe, clique no nome da semana. Abre um calendário: escolha qualquer dia e a parada vai para a semana desse dia.',
          'Prefere um mês ou um ano? Escolha Mensal ou Anual aqui em cima.'
        ] },
        size: { title: 'Deixar a parada mais longa', slides: [
          'Abra o ⋮ ao lado da parada.',
          'Escolha a aba Tamanho.',
          'Escolha de Top 10 até Top 100.',
          'O título muda junto. Diário, Semanal, Mensal e Anual lembram cada um o seu tamanho.'
        ] },
        layout: { title: 'Mudar o visual da parada', slides: [
          'Estes seis botões trocam o layout. Tabela é o que você tem no começo.',
          'Grade: capas grandes, feita para rolar.',
          'Mosaico: suas primeiras entradas em blocos grandes, o resto menor.',
          'Faixa: um pódio para os três primeiros e todo o resto numa faixa.',
          'Compacto: uma linha fina por entrada, para caber o máximo na tela.',
          'Pilha: cartões um em cima do outro. Só a Pilha tem este botão extra, que divide em duas colunas.'
        ] },
        details: { title: 'Mostrar mais em cada linha', slides: [
          'Abra o ⋮ ao lado da parada.',
          'A aba Mostrar. Tudo nela começa desligado, para a parada ficar limpa.',
          'Marque o que quiser, por exemplo Tags pico.',
          'Aparece em todas as linhas na hora.',
          'Em Seções você escolhe quais listas aparecem abaixo da parada: Aspirantes, Fora da Parada e Novas Entradas.'
        ] },
        type: { title: 'Ver seus artistas ou álbuns', slides: [
          'Músicas, Artistas e Álbuns são três paradas da mesma semana.',
          'Artistas: conta cada play de qualquer música deles.',
          'Álbuns: as plays das músicas de cada álbum, somadas.'
        ] },
        run: { title: 'Acompanhar a trajetória de uma música', slides: [
          'Aperte as barrinhas no fim de uma linha.',
          'A trajetória abre abaixo da linha: um quadrinho para cada semana na parada, com a posição.',
          'Mude o intervalo para contar a trajetória neste ano, até esta semana, ou desde sempre.',
          'Toque um trecho ou o vídeo, ou adicione a uma playlist, direto daqui.',
          'O ⋮ da linha tem todo o resto, incluindo o álbum e o artista. Clicar com o botão direito na linha abre o mesmo menu.'
        ] },
        animate: { title: 'Ver a semana passada virar esta', slides: [
          'Aperte Animar a parada acima da parada.',
          'Começa na parada da semana passada. Depois 7 dias avançam, play a play, e as músicas se mexem conforme plays entram e saem.',
          'Pause quando quiser, ou avance uma play ou um dia inteiro de cada vez.',
          'Ou arraste a barra de tempo para qualquer momento.',
          'Esta lista mostra o que acabou de entrar e o que acabou de sair.',
          'Feche para voltar à parada normal.'
        ] }
      },
      options: {
        layouts: { title: 'Layouts', items: {
          table: ['Tabela', 'Linhas com todas as colunas. O que você tem no começo.'],
          grid: ['Grade', 'Capas grandes numa grade.'],
          compact: ['Compacto', 'Uma linha fina por entrada. Cabe o máximo na tela.'],
          mosaic: ['Mosaico', 'As primeiras entradas em blocos grandes, o resto menor.'],
          filmstrip: ['Faixa', 'Um pódio para os três primeiros e o resto numa faixa que dá para rolar ou deixar rolando sozinha.'],
          stack: ['Pilha', 'Cartões um em cima do outro, com opção de duas colunas.']
        } },
        show: { title: '⋮ → Mostrar', items: {
          cert: ['Selos cert', 'Ouro, Platina e Diamante em músicas e álbuns que passaram de uma marca de plays.'],
          score: ['Minhas notas', 'Sua avaliação, em tudo o que você avaliou.'],
          ppeak: ['Pico de plays', 'Uma tag ▲ BEST quando uma entrada tem o maior número de plays numa semana até agora.'],
          ptags: ['Tags pico', 'A posição mais alta que cada entrada já alcançou.'],
          bulegend: ['Legenda aspirantes', 'A explicação das tags dos Aspirantes.'],
          desc: ['Descrições', 'Uma linha curta abaixo do título de cada parada dizendo o que ela conta.']
        } },
        sections: { title: '⋮ → Mostrar → Seções', items: {
          normal: ['Parada', 'A parada em si. Desligue para ver só as listas abaixo dela.'],
          bu: ['Aspirantes', 'As entradas logo abaixo do corte.'],
          off: ['Fora da Parada', 'O que saiu esta semana.'],
          new: ['Novas Entradas', 'Tudo o que é novo esta semana, numa lista.']
        } },
        size: { title: '⋮ → Tamanho', items: {
          week: ['Tamanhos da Semanal', 'Top 10, 20, 25, 30, 50 ou 100.'],
          other: ['Outras paradas', 'Diário: Top 10 a 50 (começa em 20). Mensal: 25 a 100 (começa em 50). Anual: 50, 100, 200 ou tudo (começa em 100). Histórico: 50, 100, 200 ou tudo (começa em tudo).']
        } },
        actions: { title: '⋮ → Ações', items: {
          playall: ['Ouvir tudo', 'Toca as músicas da parada em ordem no player.'],
          shuffle: ['Aleatório', 'O mesmo, em ordem aleatória.'],
          export: ['Exportar playlist', 'A parada como playlist: copie, salve como texto ou leve para o Spotify e outros.'],
          share: ['Compartilhar como imagem', 'Uma imagem da parada para redes sociais, em vários tamanhos e estilos.'],
          pdf: ['PDF para imprimir', 'A parada pronta para imprimir ou salvar como PDF.']
        } },
        badges: { title: 'Selos de uma linha', items: {
          up: ['▲ Subiu', 'Subiu essas posições.'],
          down: ['▼ Caiu', 'Caiu essas posições.'],
          same: ['= Sem mudança', 'A mesma posição da semana passada.'],
          newe: ['NOVO', 'Primeira semana na parada.'],
          re: ['RE', 'Voltou depois de ter saído.'],
          peak: ['PICO #', 'A posição mais alta.'],
          cert: ['Ouro / Platina / Diamante', 'Passou de uma marca de plays.'],
          best: ['▲ BEST', 'Mais plays numa semana até agora.']
        } }
      },
      challenges: {
        'week.prev': ['Volte uma semana', 'Aperte ‹ ou a tecla ←.'],
        'week.jump': ['Abra o calendário', 'Clique no nome da semana.'],
        'week.type': ['Veja sua parada de Artistas ou Álbuns', 'Use o seletor acima da parada.'],
        'week.layout': ['Teste um layout que não seja Tabela', 'Qualquer um dos seis botões de layout.'],
        'week.size': ['Mude o tamanho da parada', '⋮ → Tamanho.'],
        'week.show': ['Ligue algo em ⋮ → Mostrar', 'Tags pico é uma boa para começar.'],
        'week.animate': ['Anime a parada', 'Aperte Animar a parada.'],
        'week.run': ['Abra a trajetória de uma música', 'As barrinhas no fim de uma linha.']
      },
      quiz: {
        q1: ['Uma linha mostra RE. O que significa?',
          ['É nova esta semana', 'Voltou depois de ter saído', 'Repetiu a posição da semana passada'],
          'RE significa reentrada: esteve na parada, saiu e voltou. Mantém o pico e as semanas.'],
        q2: ['Uma música mostra ▲7 com um #9 pequeno embaixo. Onde ela estava na semana passada?',
          ['#7', '#9', '#16'],
          'O número pequeno é a posição da semana passada. Subiu 7 posições, do #9 para o #2.'],
        q3: ['O que define a posição de uma música na parada Semanal?',
          ['As plays daquela semana', 'As plays de sempre', 'A posição mais alta até agora'],
          'Só contam as plays dentro daquela semana. Nada vem de semanas anteriores.']
      },
      tips: [
        'Aperte ← e → para passar as semanas sem tocar no mouse.',
        'Clique com o botão direito em qualquer linha (ou aperte o ⋮ dela) para ouvir, adicionar a uma playlist e mais.',
        'Músicas, Artistas e Álbuns lembram cada um o seu layout, então os álbuns podem ficar em Mosaico e as músicas em Tabela.',
        'Animar a parada repete a passagem da parada da semana passada para esta, play a play. Teste numa semana com uma briga apertada pelo #1.',
        'Clique em qualquer um dos quatro números para ir direto para aquela parada.'
      ]
    },

    periods: { title: 'Paradas Mensal e Anual', promise: 'Paradas de fim de ano de qualquer ano, e meses que mostram o que realmente ficou.' },
    daily: { title: 'Sua parada Diária', promise: 'Um dia de cada vez: suas músicas do dia, seus hábitos e lembranças do mesmo dia.' },
    alltime: { title: 'Histórico e viagem no tempo', promise: 'Suas músicas mais ouvidas de sempre, e como a parada estava em qualquer dia.' },
    around: { title: 'Em volta da parada e compartilhando', promise: 'Aspirantes, Fora da Parada, Novas Entradas, imagens, PDFs e playlists.' },
    windows: { title: 'Janelas de música, artista e álbum', promise: 'Tudo sobre uma música, um artista ou um álbum, e como achar rápido.' },
    stats: { title: 'Estatísticas', promise: 'Resumo, História, Gráficos, Comparar e Jogos para qualquer período.' },
    records: { title: 'Recordes', promise: 'Seu livro de recordes: números um, estreias, certificações, sequências e mais.' },
    awards: { title: 'Prêmios', promise: 'Sua própria premiação, dos indicados à cerimônia.' },
    soundtrack: { title: 'Sua Trilha Sonora', promise: 'Um mês, um ano ou desde sempre, contado em capítulos.' },
    dank100: { title: 'The Dank 100', promise: 'As paradas semanais de todo mundo somadas numa só.' },
    ratings: { title: 'Avaliações', promise: 'Dê notas a álbuns e músicas, e veja seu lado crítico.' },
    events: { title: 'Eventos', promise: 'Aniversários, datas de álbuns, lançamentos e a Máquina do Tempo.' },
    playlists: { title: 'Playlists', promise: 'Salve paradas como playlists, e deixe que elas se montem sozinhas.' },
    rawdata: { title: 'Dados brutos', promise: 'Cada play: procure, corrija, exporte.' },
    board: { title: 'O Fórum', promise: 'Sugira ideias, relate bugs e vote.' },
    settings: { title: 'Configurações e sua conta', promise: 'Fontes de dados, ajustes das paradas, temas, login e backups.' }
  }
};
