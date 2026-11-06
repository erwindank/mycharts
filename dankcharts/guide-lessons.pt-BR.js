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
          newe: ['NOVA', 'A primeira semana dela nesta parada.'],
          re: ['RE (reentrada)', 'Voltou à parada depois de ter saído. Mantém o pico e as semanas.'],
          art: ['Capa', 'Aperte ▶ na capa para ouvir um trecho de 30 segundos.'],
          title: ['Título e artista', 'Clique no título para a janela da música, ou no nome do artista para a dele.'],
          peak: ['Tag de pico', 'A posição mais alta que já alcançou nesta parada. Ligue em ⋮ → Mostrar → Tags pico.'],
          cert: ['Certificação', 'Ouro, Platina ou Diamante quando passa de uma marca de plays. Ligue em ⋮ → Mostrar → Selos cert.'],
          album: ['Álbum', 'Clique para a janela do álbum.'],
          weeks: ['Semanas na parada', 'Quantas semanas passou na parada no total, somando todas as passagens. Nunca zera.'],
          plays: ['Plays', 'Plays desta semana. É a única coisa que define a ordem da parada.'],
          pdelta: ['Mudança de plays', 'Quantas a mais ou a menos que na semana passada.'],
          best: ['Pico de plays (▲ PICO DE PLAYS)', 'O maior número de plays dela numa semana até agora. Ligue em ⋮ → Mostrar → Pico de plays.'],
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
          ppeak: ['Pico de plays', 'Uma tag ▲ PICO DE PLAYS quando uma entrada tem o maior número de plays numa semana até agora.'],
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
          newe: ['NOVA', 'Primeira semana na parada.'],
          re: ['RE', 'Voltou depois de ter saído.'],
          peak: ['PICO #', 'A posição mais alta.'],
          cert: ['Ouro / Platina / Diamante', 'Passou de uma marca de plays.'],
          best: ['▲ PICO DE PLAYS', 'Mais plays numa semana até agora.']
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

    daily: {
      title: 'Sua parada Diária',
      promise: 'Um dia de cada vez: a parada, quando você ouviu, como se sentiu e o que ele te lembra.',
      scenes: {
        top: { title: 'Topo da página', spots: {
          daily: ['{{t:nav_daily}}', 'A parada de hoje e de qualquer dia antes. A tecla D leva direto.'],
          prev: ['Dia anterior', 'Volta um dia. A tecla ← faz o mesmo.'],
          label: ['Qual dia', 'Clique para abrir um calendário e pular para qualquer dia.'],
          next: ['Dia seguinte', 'Avança um dia.'],
          banner: ['O dia numa linha', 'Quem dominou o dia e o que fez ele se destacar. Hoje mostra quem está na frente.'],
          peak: ['Tag de recorde', 'Aparece quando um número é recorde, como seu maior dia do mês ou de sempre.'],
          tiles: ['Quatro números', 'Plays, músicas diferentes, artistas e álbuns do dia, com a mudança em relação ao dia que você compara.'],
          hours: ['Plays por hora', 'Cada hora do dia e quantas plays ela teve.'],
          best: ['Hora mais ativa', 'O quadrinho dourado é a hora em que você mais ouviu.'],
          share: ['Compartilhar', 'Salva estes números como imagem.']
        } },
        tools: { title: 'Ferramentas acima da parada', spots: {
          cmp: ['{{t:dy_compare_label}}', 'Com qual dia as setas e as mudanças são medidas.'],
          cmp1: ['{{t:dy_vs_yesterday}}', 'Em relação ao dia anterior. É o que você tem no começo.'],
          cmp2: ['O mesmo dia da semana', 'Em relação ao mesmo dia da semana anterior: uma terça é medida contra a terça passada.'],
          no1: ['{{t:dy_no1_today}}', 'Sua música #1 do dia, e há quantos dias seguidos ela está em #1.'],
          recap: ['{{t:dy_recap}}', 'O dia como uma história curta, um cartão de cada vez.'],
          share: ['{{t:dy_share_img}}', 'Uma imagem da parada do dia para compartilhar.'],
          play: ['Ouvir as primeiras', 'Toca a parada do dia em ordem.'],
          cal: ['{{t:dy_cal_title}}', 'Um mês de dias, cada um com a capa da sua #1. Clique num para abrir.'],
          save: ['{{t:dy_save_pl}}', 'Guarda a parada do dia como uma das suas playlists.'],
          export: ['{{t:dy_export}}', 'A parada como lista para copiar, salvar como texto ou levar para o Spotify e outros.'],
          title: ['Tamanho da parada', 'Quantas músicas a parada Diária tem. Mude em ⋮ → Tamanho.'],
          heads: ['Colunas', 'Posição, movimento, título e artista, álbum, dias na parada e plays.']
        } },
        panel: { title: 'Seu dia', spots: {
          today: ['O dia', 'As plays do dia em relação ao seu dia normal.'],
          week: ['Últimos 7 dias', 'Uma barra para cada um dos últimos 7 dias, e o total em relação aos 7 anteriores.'],
          first: ['Primeira play', 'A primeira música do dia, e a que horas.'],
          last: ['Última play', 'A última música do dia, e a que horas.'],
          topart: ['{{t:dy_top_artist}}', 'Quem você mais ouviu naquele dia.'],
          repeat: ['{{t:ns_x_on_repeat}}', 'Músicas que você ouviu em quase todos os últimos 7 dias. Elas vão passando sozinhas.'],
          moods: ['Humor', 'Escolha como foi o dia.'],
          note: ['Uma linha sobre o seu dia', 'Onde você estava, o que aconteceu. Até 500 caracteres.'],
          status: ['Onde fica guardado', 'Neste navegador. Faça login e ele vai com você para todos os aparelhos.']
        } },
        time: { title: 'Hora do dia e padrões', spots: {
          busiest: ['{{t:dy_busiest}}', 'A hora com mais plays.'],
          sessions: ['Sessões de escuta', 'Quantos períodos separados de escuta o dia teve.'],
          longest: ['{{t:dy_longest_lbl}}', 'Seu maior período sem uma pausa longa, e quando foi.'],
          tl: ['Capas por hora', 'A música mais ouvida de cada hora.'],
          hours: ['Barras por hora', 'Quantas plays cada hora teve. Clique numa barra para ver aquela hora.'],
          busy: ['A barra mais alta', 'Destacada para você achar rápido.'],
          hourcard: ['A hora escolhida', 'As plays dela e a música mais ouvida.'],
          parts: ['Partes do dia', '{{t:dy_part_night}}, {{t:dy_part_morning}}, {{t:dy_part_afternoon}} e {{t:dy_part_evening}}: as plays, a fatia do dia e a música principal. A mais ativa leva a marca {{t:dy_part_peak}}.'],
          replayed: ['{{t:dy_pat_most}}', 'A música que você mais ouviu naquele dia.'],
          b2b: ['{{t:dy_pat_b2b}}', 'Quantas vezes seguidas tocou uma música, e um artista.'],
          full: ['{{t:dy_pat_full}}', 'Álbuns que você ouviu inteiros naquele dia.'],
          variety: ['{{t:dy_pat_variety}}', 'De fiel (sempre as mesmas) a explorador (sempre algo diferente).'],
          genres: ['{{t:dy_genre_title}}', 'Os gêneros que você ouviu naquele dia, como parte das suas plays.']
        } },
        mem: { title: 'Lembranças e marcas', spots: {
          otd: ['{{t:dy_otd}}', 'O que você ouvia nesta data em anos anteriores.'],
          forgot: ['{{t:dy_forgot}}', 'Músicas que você ouvia muito e não toca há tempos.'],
          back: ['{{t:dy_comeback}}', 'Músicas que voltaram a tocar naquele dia depois de muito tempo.'],
          firsth: ['{{t:dy_first}}', 'Músicas e artistas que você ouviu pela primeira vez naquele dia.'],
          list: ['A lista', 'Clique numa linha para abrir a janela dela.'],
          awards: ['{{t:dy_aw_title}}', 'A música, o artista, o álbum, a descoberta e a volta do dia.'],
          mshit: ['{{t:dy_ms_hit}}', 'Marcas de plays alcançadas naquele dia, como a 500ª play de uma música.'],
          msrec: ['{{t:dy_rec_title}}', 'Recordes batidos naquele dia.'],
          msstreak: ['{{t:dy_streaks}}', 'Dias seguidos ouvindo uma música ou um artista, e sequências que acabaram.'],
          msgoal: ['{{t:dy_goals}}', 'Quão longe o dia está dos seus melhores dias.'],
          msnear: ['{{t:dy_close_title}}', 'Marcas a poucas plays de distância.']
        } },
        recap: { title: '{{t:dy_recap}}', spots: {
          bars: ['Progresso', 'Uma barra para cada cartão da história.'],
          big: ['Um cartão', 'Uma coisa do dia por cartão: as plays, a música #1, o artista principal, quando você ouviu, sua variedade e os destaques. O último cartão pode compartilhar o dia ou tocar as músicas.'],
          next: ['Próximo cartão', 'Toque no lado direito ou aperte →.'],
          prev: ['Cartão anterior', 'Toque no lado esquerdo ou aperte ←.'],
          x: ['Fechar', 'Esc faz o mesmo.']
        } },
        cal: { title: '{{t:dy_cal_title}}', spots: {
          title: ['O mês', 'Qual mês você está vendo.'],
          prev: ['Mês anterior', 'Volta um mês. A tecla ← faz o mesmo.'],
          next: ['Próximo mês', 'Avança um mês. A tecla → faz o mesmo.'],
          grid: ['Cada dia', 'Cada dia mostra a capa da sua música #1.'],
          day: ['Um dia', 'Clique para abrir a parada daquele dia.'],
          share: ['Compartilhar', 'Transforma o mês numa imagem para compartilhar.'],
          x: ['Fechar', 'Esc faz o mesmo.']
        } }
      },
      howto: {
        pick: { title: 'Ir para outro dia', slides: [
          'Aperte ‹ para o dia anterior. A tecla ← também funciona.',
          'Ou clique na data para escolher qualquer dia num calendário.',
          '{{t:dy_cal_title}} mostra um mês inteiro de uma vez.',
          'Cada dia tem a capa da sua #1. Clique num para abrir aquele dia.'
        ] },
        compare: { title: 'Escolher com o que o dia é comparado', slides: [
          'No começo, o movimento é medido em relação a ontem.',
          'Escolha o mesmo dia da semana para comparar, por exemplo, esta terça com a terça passada.',
          'As setas, as tags NOVA e RE e as mudanças seguem sua escolha.'
        ] },
        recap: { title: 'Ver seu dia como uma história', slides: [
          'Aperte {{t:dy_recap}}.',
          'O dia vem em cartões, uma coisa de cada vez.',
          'Toque no lado direito para o próximo.',
          'Feche quando quiser.'
        ] },
        diary: { title: 'Fazer um diário dos seus dias', slides: [
          'Escolha como foi o dia.',
          'Adicione uma linha: onde você estava, o que aconteceu.',
          'Salva na hora. Faça login e ele vai com você para todos os aparelhos.'
        ] },
        hours: { title: 'Ver quando você ouviu', slides: [
          'Cada barra é uma hora. Clique numa.',
          'Aqui aparecem as plays daquela hora e a música mais ouvida.',
          'As quatro partes do dia resumem tudo, com a música principal de cada uma.'
        ] },
        memories: { title: 'Olhar para trás a partir de qualquer dia', slides: [
          '{{t:dy_otd}}: o que você ouvia nesta data em anos anteriores.',
          '{{t:dy_forgot}}: antigas favoritas que você não toca há tempos.',
          '{{t:dy_comeback}}: músicas que voltaram naquele dia.',
          '{{t:dy_first}}: tudo o que você ouviu pela primeira vez.',
          'Mais abaixo, {{t:dy_ms_title}} conta o que o dia alcançou e quão perto você está dos seus melhores dias.'
        ] },
        keep: { title: 'Guardar um dia', slides: [
          '{{t:dy_save_pl}} guarda a parada como uma das suas playlists.',
          '{{t:dy_export}} te dá a lista para o Spotify e outros.',
          '{{t:dy_share_img}} faz uma imagem dela.'
        ] }
      },
      options: {
        actions: { title: 'Botões acima da parada', items: {
          recap: ['{{t:dy_recap}}', 'O dia como uma história em cartões.'],
          share: ['{{t:dy_share_img}}', 'Uma imagem da parada do dia.'],
          play: ['Ouvir as primeiras', 'Toca a parada do dia em ordem.'],
          cal: ['{{t:dy_cal_title}}', 'Um mês de dias com as capas das #1.'],
          save: ['{{t:dy_save_pl}}', 'A parada como uma das suas playlists.'],
          export: ['{{t:dy_export}}', 'A parada como lista para outros apps.']
        } },
        compare: { title: '{{t:dy_compare_label}}', items: {
          yday: ['{{t:dy_vs_yesterday}}', 'Em relação ao dia anterior.'],
          wday: ['O mesmo dia da semana', 'Em relação ao mesmo dia da semana anterior.']
        } },
        sections: { title: 'Abaixo da parada', items: {
          panel: ['O dia', 'Plays em relação ao seu dia normal, os últimos 7 dias, primeira e última play, artista principal e no repeat.'],
          diary: ['{{t:dy_diary_title}}', 'Um humor e uma linha sobre o dia.'],
          time: ['{{t:dy_tod_title}}', 'Plays por hora, sessões e as quatro partes do dia.'],
          pats: ['{{t:dy_pat_title}}', 'Mais repetida, seguidas, álbuns inteiros, variedade e gêneros.'],
          mem: ['{{t:dy_mem_title}}', 'Esta data em anos anteriores, antigas favoritas, voltas e primeiras plays.'],
          ms: ['{{t:dy_ms_title}}', 'Os prêmios, marcas, recordes, sequências e metas do dia.']
        } },
        memtabs: { title: '{{t:dy_mem_title}}', items: {
          otd: ['{{t:dy_otd}}', 'Esta data em anos anteriores.'],
          forgot: ['{{t:dy_forgot}}', 'Antigas favoritas que sumiram.'],
          back: ['{{t:dy_comeback}}', 'De volta depois de muito tempo.'],
          firsth: ['{{t:dy_first}}', 'Ouvidas pela primeira vez.'],
          throw: ['{{t:dy_throw}}', 'Favoritos de sempre que você não toca há um tempo. Cada aba só aparece nos dias em que tem algo.']
        } },
        mstabs: { title: '{{t:dy_ms_title}}', items: {
          hit: ['{{t:dy_ms_hit}}', 'Marcas de plays alcançadas.'],
          rec: ['{{t:dy_rec_title}}', 'Recordes batidos naquele dia.'],
          streak: ['{{t:dy_streaks}}', 'Sequências de dias mantidas ou encerradas.'],
          goal: ['{{t:dy_goals}}', 'Quão longe dos seus melhores dias.'],
          near: ['{{t:dy_close_title}}', 'Marcas a poucas plays.']
        } },
        size: { title: '⋮ → Tamanho', items: {
          day: ['Tamanhos da Diária', 'Top 10, 20, 25, 30 ou 50.']
        } }
      },
      challenges: {
        'day.prev': ['Volte um dia', 'Aperte ‹ ou a tecla ←.'],
        'day.cmp': ['Compare com o mesmo dia da semana', 'O seletor ao lado de {{t:dy_compare_label}}.'],
        'day.recap': ['Abra {{t:dy_recap}}', 'O primeiro botão acima da parada.'],
        'day.cal': ['Abra o {{t:dy_cal_title}}', 'Um botão acima da parada.'],
        'day.mood': ['Escolha um humor para um dia', 'Em {{t:dy_diary_title}}.'],
        'day.hour': ['Escolha uma hora', 'Uma barra em {{t:dy_tod_title}}.'],
        'day.tab': ['Abra outra aba de Lembranças ou Marcas', 'Por exemplo {{t:dy_forgot}}.'],
        'day.save': ['Salve um dia como playlist', '{{t:dy_save_pl}} acima da parada.']
      },
      quiz: {
        q1: ['Você compara com o mesmo dia da semana. Com o que hoje é medido?',
          ['Com ontem', 'Com o mesmo dia da semana anterior', 'Com o seu melhor dia'],
          'Compara, por exemplo, esta terça com a terça passada: mais justo quando seus dias da semana são diferentes.'],
        q2: ['Onde você escreve uma linha sobre como foi o dia?',
          ['{{t:dy_diary_title}}', '{{t:dy_mem_title}}', '{{t:dy_recap}}'],
          '{{t:dy_diary_title}} guarda um humor e uma linha para cada dia.'],
        q3: ['O que {{t:dy_otd}} mostra?',
          ['O que você ouvia nesta data em anos anteriores', 'A música mais ouvida de hoje', 'Músicas que você nunca ouviu'],
          'Olha a mesma data em cada ano anterior em que você tem plays.']
      },
      tips: [
        '{{t:dy_recap}} transforma qualquer dia numa história em cartões. Teste no seu dia mais ativo.',
        '{{t:dy_mem_title}} → {{t:dy_otd}} mostra o que você ouvia nesta data em anos anteriores.',
        'O {{t:dy_cal_title}} mostra a capa da #1 de cada dia: um mês inteiro de uma vez.',
        'Escolha um humor e escreva uma linha em {{t:dy_diary_title}}, e a aba Diário vira um diário musical.'
      ]
    },

    periods: {
      title: 'Paradas Mensal e Anual',
      promise: 'Meses que mostram o que realmente ficou, paradas de fim de ano de qualquer ano e o que cada tag de recorde quer dizer.',
      scenes: {
        mtop: { title: 'Um mês', spots: {
          monthly: ['{{t:nav_monthly}}', 'Um mês do calendário de cada vez. A tecla M leva direto.'],
          yearly: ['{{t:nav_yearly}}', 'Um ano do calendário de cada vez. A tecla Y leva direto.'],
          label: ['Qual mês', 'Clique para pular para qualquer mês. ‹ e › andam um mês de cada vez.'],
          banner: ['O mês numa linha', 'Quem dominou, e como ele se compara com seus outros meses.'],
          peak: ['Tag de recorde', '{{t:stat_alltime_peak}}: nenhum mês jamais passou deste número.'],
          tiles: ['Quatro números', 'Plays, músicas diferentes, artistas e álbuns, com a mudança em relação ao mês anterior.'],
          days: ['Plays por dia', 'Cada dia do mês e suas plays.'],
          day: ['Um dia', 'Clique em qualquer dia para abrir na parada Diária.'],
          best: ['Melhor dia', 'O quadrinho dourado é o dia mais ativo do mês.'],
          share: ['Compartilhar', 'Salva estes números como imagem.']
        } },
        mchart: { title: 'A parada mensal', spots: {
          title: ['Tamanho da parada', 'A Mensal começa em Top 50. Mude em ⋮ → Tamanho.'],
          heads: ['Colunas', 'Igual à Semanal, mas conta meses na parada.'],
          months: ['Meses na parada', 'Quantos meses passou na parada no total.'],
          newe: ['NOVA', 'Seu primeiro mês na parada.'],
          up: ['Subiu', 'Subiu essas posições desde o mês passado.'],
          plays: ['Plays', 'Plays do mês inteiro. Uma música precisa de plays constantes, não de uma semana forte.']
        } },
        mnew: { title: 'Novidades do mês', spots: {
          bar: ['{{t:atc_title}}', 'As listas em volta da parada. Na Mensal e na Anual são as novas entradas.'],
          tabs: ['{{t:atc_tab_new}}', 'Tudo o que é novo neste mês, com a contagem.'],
          fold: ['Recolher', 'Esconde o bloco e mantém o título.'],
          chip1: ['{{t:ne_filter_all}}', 'Todas as músicas novas do mês.'],
          chip2: ['{{t:ne_filter_chart}}', 'Só as novas que entraram na parada.'],
          chip3: ['{{t:ne_filter_new_artists}}', 'Só músicas de artistas que você nunca tinha ouvido.'],
          row: ['Uma música nova', 'Clique para abrir a janela dela.'],
          debut: ['Estreia', 'A posição em que entrou na parada.'],
          biggest: ['Estreia recorde', 'Aparece quando uma estreia é a maior de sempre, ou em muito tempo.'],
          caps: ['Semana a semana', 'Uma marca por semana do mês. As acesas são semanas em que você ouviu; quanto mais forte, mais plays.'],
          ndays: ['Semanas ouvida', 'Em quantas semanas do mês ela tocou.']
        } },
        cert: { title: 'Certificados neste mês', spots: {
          title: ['{{t:creel_title}}', 'Músicas e álbuns que chegaram a Ouro, Platina ou Diamante neste mês.'],
          count: ['Quantos', 'Quantos foram certificados neste mês.'],
          filter: ['Filtro', 'Todos, só músicas ou só álbuns.'],
          plaque: ['Uma placa', 'O prêmio, para o que é e o dia em que foi alcançado.'],
          hint: ['Navegar', 'As placas passam sozinhas. Passe o mouse para pausar, arraste para navegar.'],
          collapse: ['Recolher', 'Esconde as placas e mantém o título.']
        } },
        ytop: { title: 'Um ano', spots: {
          yearly: ['{{t:nav_yearly}}', 'Um ano do calendário de cada vez.'],
          label: ['Qual ano', 'Clique para escolher outro ano. ‹ e › andam um ano de cada vez.'],
          banner: ['O ano numa linha', 'Quem dominou seu ano e o tamanho dele.'],
          peak: ['Tag de recorde', '{{t:stat_peak_at_time}}: foi recorde quando aconteceu e já foi superado.'],
          tiles: ['Quatro números', 'As plays, músicas, artistas e álbuns do ano, com a mudança em relação ao ano anterior.'],
          months: ['Plays por mês', 'Cada mês do ano. Clique num para abrir.'],
          best: ['Melhor mês', 'O quadrinho dourado é o mês mais ativo do ano.']
        } },
        ychart: { title: 'A parada anual', spots: {
          title: ['Tamanho da parada', 'A Anual começa em Top 100, e vai até 200 ou todas as músicas que você ouviu.'],
          search: ['Buscar na parada', 'Digite parte de um título ou de um artista para achar na parada.'],
          heads: ['Colunas', 'Conta anos na parada.'],
          years: ['Anos na parada', 'Em quantas paradas de fim de ano ela entrou.'],
          up: ['Subiu', 'Subiu em relação à posição na parada do ano passado.'],
          newe: ['NOVA', 'Sua primeira parada de fim de ano.'],
          menu: ['Opções da parada (⋮)', 'Mostrar, Tamanho e Ações, como na Semanal.']
        } }
      },
      howto: {
        month: { title: 'Ver um mês', slides: [
          'Escolha {{t:nav_monthly}}.',
          '‹ e › andam um mês. Clique no nome para pular mais longe.',
          'Clique em qualquer dia da faixa para abrir na parada Diária.'
        ] },
        year: { title: 'Ver um ano', slides: [
          'Escolha {{t:nav_yearly}}.',
          'Ande um ano com ‹ e ›, ou clique no ano para escolher.',
          'Clique num mês da faixa para abrir.'
        ] },
        peaks: { title: 'Entender as tags de recorde', slides: [
          '{{t:stat_alltime_peak}}: nenhum mês (ou ano) jamais passou deste número.',
          '{{t:stat_peak_at_time}}: foi recorde quando aconteceu e já foi superado.'
        ] },
        newones: { title: 'Achar o que é novo', slides: [
          'Abaixo da parada, {{t:atc_tab_new}} reúne todas as músicas novas do mês.',
          '{{t:ne_filter_chart}} deixa só as que entraram na parada.',
          'Cada uma mostra onde estreou.',
          'E em quais semanas do mês você ouviu.'
        ] },
        cert: { title: 'Ver o que virou Ouro', slides: [
          'Filtre as placas: todas, músicas ou álbuns.',
          'Cada placa diz para o que é e o dia em que foi alcançada.',
          'Passe o mouse para pausar a faixa, ou arraste para navegar.'
        ] },
        find: { title: 'Achar uma música numa parada longa', slides: [
          'Digite na busca acima da parada.',
          'Só ficam as linhas que combinam, com a posição real.'
        ] }
      },
      options: {
        size: { title: '⋮ → Tamanho', items: {
          month: ['Tamanhos da Mensal', 'Top 25, 30, 50 ou 100.'],
          year: ['Tamanhos da Anual', 'Top 50, 100, 200 ou todas as músicas.']
        } },
        peaks: { title: 'Tags de recorde nos números', items: {
          alltime: ['{{t:stat_alltime_peak}}', 'O maior de sempre, ainda não superado.'],
          attime: ['{{t:stat_peak_at_time}}', 'Recorde quando aconteceu, superado depois.']
        } },
        newchips: { title: '{{t:atc_tab_new}}', items: {
          all: ['{{t:ne_filter_all}}', 'Todas as músicas novas.'],
          made: ['{{t:ne_filter_chart}}', 'As novas que entraram na parada.'],
          artists: ['{{t:ne_filter_new_artists}}', 'Músicas de artistas novos para você.']
        } },
        certf: { title: '{{t:creel_title}}', items: {
          filter: ['{{t:certd_all}} / {{t:chart_type_songs}} / {{t:chart_type_albums}}', 'Quais placas mostrar.']
        } }
      },
      challenges: {
        'per.month': ['Abra a parada Mensal', '{{t:nav_monthly}}, ao lado de {{t:nav_weekly}}.'],
        'per.year': ['Abra a parada Anual', '{{t:nav_yearly}}, ao lado de {{t:nav_monthly}}.'],
        'per.day': ['Abra um dia a partir de um mês', 'Clique num dia na faixa de plays por dia.'],
        'per.new': ['Filtre as músicas novas', '{{t:ne_filter_chart}}, abaixo da parada.'],
        'per.cert': ['Filtre as placas certificadas', 'Músicas ou Álbuns.'],
        'per.search': ['Busque numa parada Anual', 'A busca acima da parada.']
      },
      quiz: {
        q1: ['Um número diz {{t:stat_alltime_peak}}. O que isso quer dizer?',
          ['Nenhum mês jamais passou dele', 'É o melhor do ano até agora', 'Está acima do seu mês normal'],
          '{{t:stat_alltime_peak}} é o maior de sempre. {{t:stat_peak_at_time}} foi recorde um dia e já foi superado.'],
        q2: ['Uma música foi #1 numa parada Semanal mas não é #1 do mês. Por quê?',
          ['O mês conta todas as semanas, e plays constantes vencem uma semana forte', 'A Mensal deixa de fora as músicas novas', 'A Mensal só conta fins de semana'],
          'Cada parada conta seu próprio trecho de tempo. Uma semana forte pode perder para uma música que você ouviu o mês todo.'],
        q3: ['Uma música nova mostra “3 de 5 semanas”. O que quer dizer?',
          ['Tocou em 3 das 5 semanas do mês', 'Entrou 3 vezes na parada', 'O pico foi #3'],
          'As marcas mostram em quais semanas do mês você ouviu.']
      },
      tips: [
        'Clique em qualquer dia da faixa de plays por dia de um mês para abrir aquele dia.',
        'Abaixo de uma parada mensal, {{t:ne_filter_chart}} mostra só as músicas novas que entraram.',
        'As paradas anuais têm busca: digite um nome para achar no seu Top 100.'
      ]
    },

    alltime: {
      title: 'Histórico e viagem no tempo',
      promise: 'Suas músicas mais ouvidas de sempre, do que sua parada é feita e como ela era em qualquer dia do passado.',
      scenes: {
        top: { title: 'Topo da página', spots: {
          alltime: ['{{t:nav_alltime}}', 'Todas as suas plays, contadas uma vez. A tecla A leva direto.'],
          label: ['Até quando', 'Clique para escolher uma data e ver a parada como estava naquele dia.'],
          prev: ['Um mês atrás', 'Mostra a parada como era um mês antes. Aperte de novo para continuar voltando.'],
          banner: ['Seu #1 de sempre', 'O artista que você mais ouviu, desde sempre.'],
          tiles: ['Quatro números', 'Todas as suas plays, músicas, artistas e álbuns.'],
          total: ['Dias e plays por dia', 'Quantos dias você ouviu música, e suas plays por dia em média.'],
          years: ['Plays por ano', 'Cada ano e suas plays. Clique num para abrir aquele ano.'],
          best: ['Melhor ano', 'O quadrinho dourado é o seu maior ano.'],
          share: ['Compartilhar', 'Salva estes números como imagem.']
        } },
        chart: { title: 'A parada de sempre', spots: {
          tip: ['Uma dica', 'Dê um tamanho à parada e veja do que ela é feita.'],
          size: ['{{t:ati_hint_btn}}', 'Põe a parada em Top 100 e abre as estatísticas.'],
          hide: ['Esconder a dica', 'Ela não volta.'],
          title: ['A parada inteira', 'O Histórico começa com todas as músicas que você ouviu. ⋮ → Tamanho deixa em 50, 100 ou 200.'],
          search: ['Buscar', 'Ache qualquer música ou artista na parada.'],
          heads: ['Colunas', 'Aqui não há movimento: o Histórico é uma parada só, então não há com o que comparar.'],
          menu: ['Opções da parada (⋮)', 'Mostrar, Tamanho e Ações.']
        } },
        ati: { title: 'Dentro do seu Top 100', spots: {
          head: ['Dentro do seu Top N', 'Do que sua parada é feita. Segue o tamanho que você escolher.'],
          toggle: ['{{t:ati_more}} / {{t:ati_less}}', 'Abre ou recolhe todas as estatísticas.'],
          hero: ['Um fato', 'Algo que vale saber sobre sua parada.'],
          fact: ['{{t:ati_another}}', 'Mostra o próximo fato.'],
          tiles: ['Quatro números', 'Quantos artistas, quanto seus 3 primeiros ocupam, a parte de todas as suas plays e quantas são novas desde o ano passado.'],
          tile: ['Um número', 'Clique para ver o que há por trás.'],
          tabs: ['Cinco visões', '{{t:ati_tab_artists}}, {{t:ati_tab_eras}}, {{t:ati_tab_plays}}, {{t:ati_tab_badges}} e {{t:ati_tab_new}}.'],
          panel: ['A visão', 'Aqui: quem tem mais músicas na parada e os álbuns com mais músicas. Escolha um nome para ver as músicas.']
        } },
        pages: { title: 'O fim de uma parada longa', spots: {
          pages: ['Páginas', 'Uma parada longa vem de 100 em 100.'],
          label: ['Onde você está', 'Quais entradas aparecem, de quantas.'],
          input: ['Ir para uma página', 'Digite o número da página e aperte Enter.'],
          next: ['Próxima página', 'As próximas 100.'],
          last: ['Última página', 'Direto para o fim.'],
          export: ['Exportar', 'A parada como TXT, CSV ou PDF para imprimir.']
        } },
        travel: { title: 'Viagem no tempo', spots: {
          label: ['Até aquele dia', 'A parada agora conta todas as plays até esta data, e nada depois.'],
          prev: ['Mais para trás', 'Mais um mês para trás.'],
          next: ['Para frente', 'Um mês para frente, até voltar a hoje.'],
          banner: ['Seu #1 naquela época', 'Quem liderava sua parada de sempre naquele dia.'],
          tiles: ['Os números naquela época', 'Seus totais como eram naquele dia.']
        } }
      },
      howto: {
        size: { title: 'Ver do que sua parada é feita', slides: [
          'No Histórico, uma dica oferece olhar dentro da sua parada.',
          'Aperte {{t:ati_hint_btn}}.',
          'As estatísticas ficam acima da parada e seguem o tamanho que você escolher.'
        ] },
        facts: { title: 'Explorar as estatísticas', slides: [
          '{{t:ati_another}} mostra o próximo fato sobre sua parada.',
          'Clique num número para ver o que há por trás.',
          'Cinco visões: {{t:ati_tab_artists}}, {{t:ati_tab_eras}}, {{t:ati_tab_plays}}, {{t:ati_tab_badges}} e {{t:ati_tab_new}}.',
          '{{t:ati_less}} recolhe tudo.'
        ] },
        travel: { title: 'Viajar no tempo', slides: [
          'No Histórico, aperte ‹.',
          'A parada agora conta todas as plays até um mês atrás.',
          'Todos os números voltam também.',
          'Aperte › para voltar para frente, ou clique na data para escolher qualquer dia.'
        ] },
        find: { title: 'Achar uma música', slides: [
          'Digite na busca acima da parada.',
          'Ou pule para uma página lá embaixo.'
        ] },
        export: { title: 'Levar sua parada', slides: [
          'Lá embaixo: TXT, CSV ou um PDF para imprimir da parada inteira.'
        ] }
      },
      options: {
        size: { title: '⋮ → Tamanho', items: {
          sizes: ['Tamanhos do Histórico', 'Top 50, 100, 200 ou todas as músicas (o que você tem no começo).']
        } },
        atitabs: { title: 'Dentro do seu Top N', items: {
          artists: ['{{t:ati_tab_artists}}', 'Quem tem mais músicas, os álbuns com mais músicas, quem manda no top 10.'],
          eras: ['{{t:ati_tab_eras}}', 'De que anos e décadas são as músicas.'],
          plays: ['{{t:ati_tab_plays}}', 'Como as plays se espalham pela parada, e a rapidez com que as músicas entraram.'],
          badges: ['{{t:ati_tab_badges}}', 'As certificações na parada e as próximas placas.'],
          newyear: ['{{t:ati_tab_new}}', 'O que entrou na parada no último ano.']
        } },
        export: { title: 'Exportar', items: {
          txt: ['TXT', 'Uma lista simples.'],
          csv: ['CSV', 'Para uma planilha.'],
          pdf: ['PDF', 'Pronto para imprimir.']
        } }
      },
      challenges: {
        'at.size': ['Olhe dentro do seu Top 100', '{{t:ati_hint_btn}}, ou ⋮ → Tamanho.'],
        'at.fact': ['Veja outro fato', '{{t:ati_another}}.'],
        'at.stats': ['Abra todas as estatísticas', '{{t:ati_more}}.'],
        'at.travel': ['Volte um mês no tempo', 'Aperte ‹ no Histórico.'],
        'at.search': ['Busque na sua parada de sempre', 'A busca acima da parada.'],
        'at.export': ['Exporte a parada', 'TXT, CSV ou PDF lá embaixo.']
      },
      quiz: {
        q1: ['O que ‹ faz no Histórico?',
          ['Mostra a parada como estava um mês antes', 'Vai para a parada do ano passado', 'Nada'],
          'O Histórico conta todas as plays até a data mostrada. ‹ leva essa data um mês para trás.'],
        q2: ['Por que não há setas de movimento no Histórico?',
          ['É uma parada só com todas as plays, então não há uma anterior para comparar', 'Estão desligadas', 'Só aparecem no celular'],
          'O movimento compara um período com o anterior. O Histórico não tem “anterior”.'],
        q3: ['Onde você vê quem tem mais músicas no seu Top 100?',
          ['Dentro do seu Top 100 → {{t:ati_tab_artists}}', 'Configurações', 'O Fórum'],
          'Ponha o Histórico em Top 100 e as estatísticas acima da parada mostram isso.']
      },
      tips: [
        'No Histórico, ‹ mostra sua parada como estava um mês atrás. Continue voltando para ver ela crescer.',
        'Dentro do seu Top 100 tem doze fatos. Aperte {{t:ati_another}} para ver todos.',
        'O Histórico tem busca: ache qualquer música que você já ouviu e sua posição de sempre.'
      ]
    },

    around: {
      title: 'Em volta da parada, e compartilhando',
      promise: 'O que ficou quase lá, o que saiu, o que é novo e todas as formas de levar uma parada para fora do app.',
      scenes: {
        bu: { title: '{{t:atc_tab_bu}}', spots: {
          bar: ['{{t:atc_title}}', 'Um bloco abaixo da parada com três abas. Aparece na Diária e na Semanal (a Mensal e a Anual mostram só as novas entradas).'],
          tbu: ['{{t:atc_tab_bu}}', 'As músicas logo abaixo do corte: as posições seguintes ao tamanho da sua parada.'],
          toff: ['{{t:sec_off_chart}}', 'O que estava da última vez e não está mais.'],
          tnew: ['{{t:atc_tab_new}}', 'Tudo o que é novo desta vez, numa lista.'],
          fold: ['Recolher', 'Esconde o bloco e mantém o título.'],
          sub: ['Como é ordenado', 'Por plays, como a própria parada. Esta linha e a seguinte aparecem com ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_desc}}.'],
          meter: ['Distância', 'Quantas plays tem a última posição da parada, então a distância é quantas faltavam para cada uma.'],
          info: ['{{t:bu_legend_btn}}', 'Abre a explicação de cada tag. Aparece quando ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_bu_legend}} está ligado.'],
          rank: ['A posição', 'Onde ela estaria se a parada fosse mais longa.'],
          badge: ['Tags', 'Uma ou duas palavras sobre a história dela, como {{t:bu_badge_resurgence}} ou {{t:bu_badge_debut}}.'],
          weeks: ['Semanas aqui', 'Quantas semanas ela passou nos Aspirantes no total.'],
          away: ['Plays e distância', 'As plays dela, e quantas faltavam para entrar na parada.'],
          row: ['Uma linha', 'Clique para abrir a trajetória e os botões, como na parada.']
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
          streak: ['Sequência de N semanas', '{{t:bu_badge_streak_desc}}']
        } },
        off: { title: '{{t:sec_off_chart}}', spots: {
          toff: ['{{t:sec_off_chart}}', 'Cada entrada que estava na parada da última vez e saiu.'],
          was: ['Estava', 'Onde estava na parada anterior.'],
          exit: ['Como saiu', 'Caiu do top 3, ficou logo abaixo, uma sequência longa acabou, ou simplesmente saiu.'],
          peak: ['O pico', 'O mais alto que chegou.'],
          where: ['Onde está agora', 'Se agora está nos Aspirantes (e quão perto está de voltar), ou quando você ouviu pela última vez.'],
          stats: ['Antes e depois', 'As plays da última vez e desta, e as semanas na parada.'],
          streak: ['A sequência', 'Quantas semanas seguidas ficou antes de sair.'],
          row: ['Uma linha', 'Clique para abrir a trajetória.']
        } },
        new: { title: '{{t:atc_tab_new}}', spots: {
          tnew: ['{{t:atc_tab_new}}', 'Todas as músicas novas desta vez, tendo entrado na parada ou não.'],
          chips: ['Filtros', '{{t:ne_filter_all}}, {{t:ne_filter_chart}} ou {{t:ne_filter_new_artists}}.'],
          debut: ['Estreia', 'A posição em que entrou na parada.'],
          caps: ['Quando você ouviu', 'Uma marca por dia da semana (por semana na Mensal). Quanto mais forte, mais plays.'],
          row: ['Uma linha', 'Clique para abrir a janela dela.']
        } },
        share: { title: '{{t:ig_share_title}}', spots: {
          preview: ['Prévia', 'Exatamente a imagem que você vai ter. Muda conforme você escolhe.'],
          tpl: ['{{t:sh_design}}', 'Cinco estilos: Editorial, Minimal, Spotlight, Grid e Poster.'],
          swatch: ['{{t:sh_palette}}', 'Cores: o tema do app, uma paleta fixa, ou Cover, que pega as cores da capa da sua #1.'],
          format: ['{{t:ig_format}}', '{{t:sh_fmt_post}} para o feed, {{t:sh_fmt_portrait}}, ou {{t:sh_fmt_story}} para stories.'],
          src: ['De onde vêm as capas', 'Deezer, iTunes, Last.fm ou YouTube.'],
          pick: ['Escolher uma imagem', 'Clique numa entrada para escolher outra imagem.'],
          toggles: ['{{t:ig_show_hide}}', 'Movimento, pico, semanas na parada, plays, artista, a data e o rodapé. Desmarque o que não quiser.'],
          entries: ['{{t:sh_entries}}', 'Quantas entradas a imagem tem. {{t:sh_entries_hint}}.'],
          text: ['{{t:sh_text_size}}', 'Texto maior ou menor.'],
          quality: ['{{t:sh_quality}}', '{{t:sh_quality_std}} ou {{t:sh_quality_high}}, com o tamanho em pixels.'],
          copy: ['{{t:sh_copy}}', 'Copia a imagem, pronta para colar numa mensagem ou num post.'],
          download: ['{{t:btn_download_image}}', 'Salva como PNG.']
        } },
        pdf: { title: 'PDF para imprimir', spots: {
          scope: ['Esta parada', 'Só a parada em que você está.'],
          all: ['{{t:pdf_all_charts}}', 'Músicas, artistas e álbuns num PDF só.'],
          cover: ['{{t:pdf_opt_art}}', 'Capas ao lado de cada entrada, ou uma lista simples.'],
          bu: ['{{t:pdf_opt_bu}}', 'Adiciona os Aspirantes no fim.'],
          create: ['{{t:pdf_create}}', 'Abre a janela de impressão. Escolha “Salvar como PDF” como impressora para ter o arquivo.']
        } },
        export: { title: 'Exportar playlist', spots: {
          names: ['{{t:export_step_name}}', 'Nomes prontos para a playlist. Clique num para copiar.'],
          order: ['{{t:export_order_first}} / {{t:export_order_last}}', 'Em que ordem a lista vai.'],
          album: ['{{t:export_include_album}}', 'Adiciona o álbum de cada música.'],
          list: ['As músicas', 'O que vai ser copiado, em ordem.'],
          copy: ['{{t:export_copy_list}}', 'Copia a lista como “Artista - Título”, uma música por linha.'],
          txt: ['.txt', 'Baixa como arquivo de texto.'],
          csv: ['.csv', 'Baixa para uma planilha.'],
          services: ['{{t:export_step_import}}', 'O Soundiiz transforma a lista numa playlist de verdade no Spotify, Apple Music, YouTube Music, Deezer ou Tidal.'],
          open: ['{{t:export_open_soundiiz}}', 'Abre o Soundiiz numa nova aba. Os passos acima dizem onde colar.']
        } }
      },
      howto: {
        bu: { title: 'Ver o que ficou quase lá', slides: [
          'Abaixo da parada, abra {{t:atc_tab_bu}}.',
          'Cada música mostra quantas plays faltavam.',
          'Ligue ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_bu_legend}} e aperte {{t:bu_legend_btn}} para ver a explicação.',
          'Cada tag conta a história de uma música, como {{t:bu_badge_debut}}: a primeira vez dela aqui.'
        ] },
        off: { title: 'Ver o que saiu', slides: [
          'Abra {{t:sec_off_chart}}.',
          'Cada uma diz como saiu.',
          'E se está perto de voltar.'
        ] },
        hide: { title: 'Escolher quais listas aparecem', slides: [
          'Em ⋮ → Mostrar → Seções, ligue ou desligue Aspirantes, Fora da Parada e Novas Entradas.',
          'Ou recolha o bloco com a seta, para ficar só o título.'
        ] },
        share: { title: 'Compartilhar sua parada como imagem', slides: [
          'Em ⋮ → Ações, escolha Compartilhar como imagem.',
          'Escolha um design.',
          'Escolha as cores.',
          'Escolha o formato: post, retrato ou story.',
          'Por exemplo Poster, como story.',
          'Desmarque o que não quiser na imagem.',
          'Depois copie ou baixe.'
        ] },
        pdf: { title: 'Imprimir a parada', slides: [
          'Em ⋮ → Ações, escolha PDF para imprimir.',
          'Só esta parada, ou as três.',
          'Aperte {{t:pdf_create}} e escolha “Salvar como PDF” como impressora.'
        ] },
        export: { title: 'Criar uma playlist no Spotify (ou onde quiser)', slides: [
          'Em ⋮ → Ações, escolha Exportar playlist.',
          'Clique num nome para copiar.',
          'Copie a lista de músicas.',
          'O Soundiiz transforma ela numa playlist no serviço que você usa.',
          'Abra o Soundiiz e cole onde os passos dizem.'
        ] },
        play: { title: 'Ouvir a parada inteira', slides: [
          'Em ⋮ → Ações, {{t:btn_play_all}} toca a parada em ordem.',
          '{{t:btn_shuffle_all}} toca em ordem aleatória.'
        ] }
      },
      options: {
        tabs: { title: '{{t:atc_title}}', items: {
          bu: ['{{t:atc_tab_bu}}', 'Logo abaixo do corte. Diária e Semanal.'],
          off: ['{{t:sec_off_chart}}', 'Saíram desde a última vez. Diária e Semanal.'],
          new: ['{{t:atc_tab_new}}', 'Tudo o que é novo. Todos os períodos menos o Histórico.']
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
          streak: ['Sequência de N semanas', '{{t:bu_badge_streak_desc}}']
        } },
        design: { title: '{{t:ig_share_title}}', items: {
          tpl: ['{{t:sh_design}}', 'Editorial, Minimal, Spotlight, Grid ou Poster.'],
          pal: ['{{t:sh_palette}}', 'O tema do app, seis paletas fixas, ou Cover.'],
          fmt: ['{{t:ig_format}}', '{{t:sh_fmt_post}}, {{t:sh_fmt_portrait}} ou {{t:sh_fmt_story}}.'],
          art: ['{{t:ig_album_art}}', 'Com ou sem capas, e de onde elas vêm.'],
          pick: ['Imagens', 'Escolha outra imagem para qualquer entrada.'],
          show: ['{{t:ig_show_hide}}', 'Movimento, pico, semanas, plays, artista, data e rodapé.'],
          entries: ['{{t:sh_entries}}', '{{t:sh_entries_hint}}.'],
          text: ['{{t:sh_text_size}}', 'De 80% a 130%.'],
          quality: ['{{t:sh_quality}}', '{{t:sh_quality_std}} ou {{t:sh_quality_high}}.']
        } },
        pdf: { title: 'PDF para imprimir', items: {
          scope: ['Esta parada / {{t:pdf_all_charts}}', 'Uma parada ou as três.'],
          cover: ['{{t:pdf_opt_art}}', 'Capas ao lado de cada entrada.'],
          bu: ['{{t:pdf_opt_bu}}', 'Adiciona os Aspirantes no fim.']
        } },
        export: { title: 'Exportar playlist', items: {
          names: ['{{t:export_step_name}}', 'Nomes de playlist prontos.'],
          order: ['{{t:export_order_first}} / {{t:export_order_last}}', 'Em que ordem.'],
          album: ['{{t:export_include_album}}', 'Adiciona o álbum em cada linha.'],
          copy: ['{{t:export_copy_list}}', 'Artista - Título, uma por linha.'],
          files: ['.txt / .csv', 'Baixe a lista como arquivo.'],
          soundiiz: ['{{t:export_open_soundiiz}}', 'Monte a playlist em outro serviço.']
        } }
      },
      challenges: {
        'around.tab': ['Abra outra aba abaixo da parada', '{{t:sec_off_chart}} ou {{t:atc_tab_new}}.'],
        'around.legend': ['Abra {{t:bu_legend_btn}}', 'Antes ligue ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_bu_legend}}.'],
        'around.share': ['Abra Compartilhar como imagem', '⋮ → Ações.'],
        'around.design': ['Teste outro design para a imagem', 'Na janela de compartilhar.'],
        'around.pdf': ['Abra PDF para imprimir', '⋮ → Ações.'],
        'around.export': ['Abra Exportar playlist', '⋮ → Ações.'],
        'around.copy': ['Copie um nome de playlist ou a lista', 'Na janela de exportar.'],
        'around.play': ['Ouça uma parada inteira', '⋮ → Ações → {{t:btn_play_all}}.']
      },
      quiz: {
        q1: ['Uma música nos Aspirantes está a 1 play de distância. O que quer dizer?',
          ['Com mais uma play ela teria entrado na parada', 'Você ouviu ela uma vez', 'Ela é a #1 dos Aspirantes'],
          'A distância é quantas plays faltavam para chegar à última posição da parada.'],
        q2: ['Onde você acha as músicas que estavam na parada da semana passada mas não estão nesta?',
          ['{{t:sec_off_chart}}', '{{t:atc_tab_new}}', 'Histórico'],
          '{{t:sec_off_chart}} reúne cada saída, como saiu e se está perto de voltar.'],
        q3: ['Você quer que a imagem da sua parada ocupe a tela do celular num story. O que você muda?',
          ['{{t:ig_format}} → {{t:sh_fmt_story}}', '{{t:sh_palette}}', '{{t:sh_text_size}}'],
          'O formato define a forma: 1:1 para post, 4:5 retrato, 9:16 para stories.']
      },
      tips: [
        'Nos Aspirantes, {{t:bu_legend_btn}} explica cada tag, de {{t:bu_badge_debut}} a {{t:bu_badge_fallen}}.',
        'A janela de compartilhar tem cinco designs. Poster como story 9:16 fica ótimo no celular.',
        'Exportar playlist mais o Soundiiz transformam qualquer parada numa playlist de verdade no Spotify, Apple Music e mais.'
      ]
    },
    windows: {
      title: 'Janelas de música, artista e álbum',
      promise: 'Tudo sobre uma música, um artista ou um álbum, como achar qualquer um num segundo, e suas sequências.',
      scenes: {
        song: { title: 'A janela de uma música', spots: {
          art: ['Capa', 'A capa dela. Passe o mouse para ver o ✎ e escolher outra imagem (no celular, segure o dedo).'],
          title: ['A música', 'O nome dela.'],
          sub: ['Artista e álbum', 'Clique em qualquer um para abrir a janela dele.'],
          sample: ['{{t:ea_s_sample}}', 'Toca 30 segundos.'],
          playlist: ['{{t:dp_playlist}}', 'Adiciona a uma das suas playlists.'],
          rate: ['{{t:dp_rate}}', 'Dê uma nota de 0 a 10.'],
          more: ['{{t:ea_more}}', 'Todo o resto: o vídeo, o álbum, o artista, a trajetória, trocar a imagem, buscar no YouTube ou Spotify.'],
          links: ['Spotify, YouTube, Last.fm', 'Procura em cada um deles.'],
          share: ['{{t:st_am_share}}', 'Um cartão com imagem desta música para compartilhar.'],
          tabs: ['Abas', '{{t:dp_tab_overview}}, {{t:dp_tab_charts}} e {{t:dp_tab_listening}}.'],
          close: ['Fechar', 'Esc faz o mesmo.'],
          hero: ['Plays totais', 'Todas as plays, a parte dela nas plays do artista, a certificação e a posição de sempre.'],
          span: ['Primeira e última play', 'Quando você ouviu pela primeira e pela última vez, e em quantos dias nesse meio.'],
          trio: ['Três números', 'Dias ouvida, plays por dia nesses dias e plays até a próxima certificação.'],
          favs: ['Onde ela mora', 'O álbum e o artista dela, e a posição em cada um. Clique para abrir.'],
          habits: ['{{t:ao_habits}}', 'A maior sequência de dias, o maior dia, a maior sequência de plays seguidas, a maior pausa e as voltas.'],
          rating: ['Minha nota', 'Sua nota, e um link para avaliar o álbum inteiro.'],
          trophies: ['Conquistas nas paradas', 'Cada selo que ela ganhou: semanas em #1, sequências no top 10, a estreia, a certificação. Toque num para ver o que o rendeu.']
        } },
        songcharts: { title: '{{t:dp_tab_charts}}', spots: {
          rktop: ['Picos', 'A melhor posição nas paradas Diária, Semanal, Mensal e Anual.'],
          rkhero: ['O pico', 'A melhor posição na parada semanal e quando chegou lá.'],
          plot: ['Posição ao longo do tempo', 'A posição semana a semana. Passe pela linha (ou toque nela) para ver cada semana.'],
          detail: ['A semana que você aponta', 'A posição, o movimento e as plays daquela semana.'],
          moments: ['Momentos', 'A estreia, a maior sequência em #1 e outros momentos.'],
          fam: ['Contra o álbum e o artista', 'Como ela foi ao lado das outras músicas do álbum e do artista.'],
          hof: ['Recordes do Hall da Fama', 'Cada recorde que ela tem em Recordes.'],
          run: ['A trajetória', 'A mesma que abaixo de uma linha da parada.']
        } },
        songlisten: { title: '{{t:dp_tab_listening}}', spots: {
          lshero: ['Em rotação', 'Se você ainda ouve, há quanto tempo, e o maior mês dela.'],
          spark: ['Plays por mês', 'Cada mês em que você ouviu. A coroa marca o melhor mês.'],
          found: ['O dia em que você achou', 'O que você ouvia perto da primeira vez que ouviu.'],
          along: ['Ouvida junto com', 'Músicas que você tocou a até 30 minutos dela, as mais frequentes.'],
          clock: ['Quando você ouve', 'A hora do dia em que você mais toca.'],
          seasons: ['Estações', 'Em que estações você ouve.'],
          miles: ['Marcas', 'Quando chegou à primeira play, à 100, à 200…'],
          next: ['A seguir', 'A próxima marca, quanto falta e mais ou menos quando você chega.'],
          heat: ['Cada dia em que você ouviu', 'Um calendário de cada dia em que tocou.'],
          more: ['Mais', 'Recordes de sequência e todo o histórico de plays.']
        } },
        artist: { title: 'A janela de um artista', spots: {
          tabs: ['Seis abas', '{{t:dp_tab_overview}}, {{t:dp_tab_music}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}, {{t:dp_tab_rating}} e {{t:dp_tab_awards}}.'],
          hero: ['Plays totais', 'Todas as plays dele, a parte nas suas e a posição entre seus artistas.'],
          favs: ['Favoritos', 'A música, o álbum e mais que você mais ouve dele.'],
          habits: ['{{t:ao_habits}}', 'Dias ouvido, maior sequência, maior dia e mais.'],
          slam: ['Grand Slam', 'Aparece quando ele foi #1 nas paradas Semanal, Mensal e Anual.'],
          trophies: ['Conquistas nas paradas', 'Cada selo que ele ganhou.'],
          rating: ['Minhas notas', 'Sua nota média para o que você avaliou dele.']
        } },
        music: { title: '{{t:dp_tab_music}}', spots: {
          top: ['Músicas e álbuns', 'Alterne entre as músicas e os álbuns dele.'],
          intro: ['O que aparece', 'Tudo dele que entrou nas suas paradas.'],
          charts: ['Qual parada', 'De sempre, ou só o que entrou na Anual, Mensal, Semanal ou Diária.'],
          sum: ['Totais', 'Quantas, quantas chegaram ao #1 e ao top 10, e as plays.'],
          tools: ['Ordenar', '{{t:am_sort_rank}}, {{t:am_sort_plays}}, {{t:am_sort_recent}}, {{t:am_sort_az}}.'],
          list: ['A lista', 'Cada uma com posição, certificação, primeira e última play. Abra uma para ver os detalhes.']
        } },
        awards: { title: '{{t:dp_tab_awards}}', spots: {
          sw: ['Dois lados', 'Seus próprios prêmios (My Grammies) ou premiações da vida real.'],
          real: ['Vida real', 'As indicações e vitórias dele em premiações reais, e como seus votos se comparam.']
        } },
        album: { title: 'A janela de um álbum', spots: {
          hero: ['Plays totais', 'Todas as plays, a parte nas plays do artista, a certificação e a posição.'],
          favs: ['As músicas', 'As músicas mais ouvidas dele.'],
          habits: ['{{t:ao_habits}}', 'Os mesmos hábitos de uma música, para o álbum inteiro.'],
          rating: ['Minha avaliação', 'Dê nota a cada faixa e tenha a nota geral do álbum.'],
          trophies: ['Conquistas nas paradas', 'Cada selo que o álbum ganhou.'],
          plaques: ['Placas de certificação', 'As placas de Ouro, Platina ou Diamante.']
        } },
        menus: { title: 'O menu ⋮', spots: {
          more: ['⋮ numa linha', 'Cada linha da parada tem um. Clique com o botão direito numa linha para o mesmo menu.'],
          menu: ['O menu', 'Um trecho, o vídeo, adicionar a uma playlist, detalhes, o álbum e o artista, a trajetória, trocar a imagem, buscar no YouTube ou Spotify.'],
          change: ['{{t:img_picker_change}}', 'Abre o seletor de capa desta entrada.']
        } },
        cover: { title: '{{t:img_picker_change}}', spots: {
          now: ['A imagem atual', 'A capa que ela tem agora.'],
          title: ['O que você está mudando', 'A música, o álbum ou o artista desta imagem.'],
          deezer: ['Deezer', 'Imagens achadas no Deezer.'],
          current: ['A que está em uso', 'A imagem destacada é a que aparece agora.'],
          itunes: ['iTunes', 'Imagens achadas no iTunes, muitas vezes várias versões e capas de singles.'],
          tile: ['Escolha uma', 'Clique em qualquer imagem para usar. O seletor fecha e a nova capa aparece na hora.'],
          lastfm: ['Last.fm', 'A imagem que o Last.fm tem.'],
          youtube: ['YouTube', 'Um quadro do vídeo.'],
          url: ['{{t:imgpk_url_label}}', 'Cole o link de qualquer imagem da internet…'],
          set: ['{{t:imgpk_apply}}', '…e aperte aqui para usar.'],
          none: ['{{t:imgpk_none}}', 'Não mostra imagem, só um quadro liso.'],
          auto: ['{{t:imgpk_auto}}', 'Volta para a imagem que o app escolhe sozinho.'],
          close: ['Fechar', 'Deixa a capa como estava.']
        } },
        search: { title: 'Busca', spots: {
          field: ['Digite um nome', 'Qualquer parte do nome de um artista, música ou álbum. Aperte / ou Ctrl+K em qualquer lugar para abrir.'],
          esc: ['Fechar', 'Esc fecha.'],
          group: ['Agrupado', 'Primeiro artistas, depois músicas, depois álbuns.'],
          top: ['Um resultado', 'Escolha um para abrir a janela. ↑ ↓ e Enter também funcionam.'],
          n: ['Plays', 'Quantas vezes você ouviu.'],
          songs: ['Músicas', 'Músicas que combinam com o que você digitou, com os artistas.'],
          foot: ['Teclas', '↑ ↓ para mover, Enter para abrir, Esc para fechar.']
        } },
        hist: { title: 'Histórico de busca', spots: {
          chips: ['Buscas recentes', 'O que você digitou há pouco. Clique numa para buscar de novo.'],
          chip: ['Uma busca', 'Repete a busca.'],
          item: ['Abertos recentemente', 'O que você abriu pela busca.'],
          rm: ['Remover', 'Tira um da lista.'],
          clear: ['Limpar histórico', 'Esvazia as duas listas.']
        } },
        streak: { title: '{{t:streak_modal_title}}', spots: {
          today: ['{{t:sk_tab_today}}', 'As sequências que você mantém ouvindo hoje, e o que perdeu ontem.'],
          fire: ['{{t:sk_tab_fire}}', 'Todas as sequências rolando agora: artistas, álbuns e músicas que você ouviu dias seguidos.'],
          recs: ['{{t:sk_tab_records}}', 'Suas maiores sequências de sempre, seus selos e as sequências que acabaram.'],
          cal: ['{{t:sk_tab_calendar}}', 'Um calendário das suas sequências.'],
          fame: ['Hall da Fama', 'Suas 5 maiores sequências de artistas, álbuns e músicas.'],
          badges: ['Selos', 'Ganhos com sequências: uma bem longa, muitas ao mesmo tempo, muitas diferentes. Toque num selo ganho para virá-lo: a data e a música que o rendeu.']
        } },
        streakcal: { title: '{{t:sk_tab_calendar}}', spots: {
          cal: ['{{t:sk_tab_calendar}}', 'Suas sequências, dia a dia.'],
          filters: ['Filtros', 'Tudo, artistas, músicas ou álbuns, e qual ano.'],
          wrap: ['O calendário', 'Cada dia colorido pelo quanto estava em sequência. Escolha um dia para ver o quê.']
        } }
      },
      howto: {
        open: { title: 'Abrir tudo sobre uma música', slides: [
          'Clique no título de uma música em qualquer lugar: uma parada, um recorde, uma busca.',
          'A janela dela tem três abas.',
          'Pule para o álbum ou o artista daqui.',
          'Feche, ou aperte Esc.'
        ] },
        find: { title: 'Achar qualquer coisa num segundo', slides: [
          'Aperte / ou Ctrl+K em qualquer página e digite.',
          'Escolha um resultado para abrir a janela.',
          'Ou use ↑ ↓ e Enter.',
          'Da próxima vez, o que você abriu está esperando aqui.'
        ] },
        history: { title: 'Ver a história inteira de uma música', slides: [
          'Em {{t:dp_tab_charts}}: a posição semana a semana.',
          'Os grandes momentos, como a estreia e a sequência em #1.',
          'Em {{t:dp_tab_listening}}: o dia em que você achou.',
          'E quando chegou a cada marca.'
        ] },
        artist: { title: 'Explorar um artista', slides: [
          'Um artista tem seis abas.',
          '{{t:dp_tab_music}} lista as músicas e os álbuns, na ordem que você quiser.',
          '{{t:dp_tab_awards}} mostra seus prêmios e os da vida real.'
        ] },
        cover: { title: 'Trocar uma capa', slides: [
          'Passe o mouse sobre uma capa: aparece um ✎ no canto. Clique nele. No celular, segure o dedo na capa.',
          'Ou abra o ⋮ da linha e escolha {{t:img_picker_change}}. As janelas têm o mesmo ✎ na capa grande.',
          'O seletor mostra imagens do Deezer, iTunes, Last.fm e YouTube. A destacada é a que está em uso.',
          'Clique na que você quiser.',
          'Ou cole o link de qualquer imagem e aperte {{t:imgpk_apply}}.',
          '{{t:imgpk_auto}} volta para a escolha do app; {{t:imgpk_none}} não mostra imagem.',
          'A nova capa aparece em todo lugar ao mesmo tempo: cada parada, a janela, as imagens para compartilhar e os prêmios. Com login, ela vai com você para todos os aparelhos.'
        ] },
        menu: { title: 'Usar o menu ⋮', slides: [
          'Cada linha tem um ⋮ (ou clique com o botão direito na linha).',
          'Tem um trecho, o vídeo, playlists, detalhes e mais.',
          'As janelas têm o mesmo menu.'
        ] },
        streak: { title: 'Manter suas sequências', slides: [
          'Sua sequência de escuta fica no topo da página Charts. Clique nela.',
          '{{t:sk_tab_records}}: suas maiores sequências de sempre.',
          'E selos para colecionar.',
          '{{t:sk_tab_calendar}} mostra tudo dia a dia.'
        ] }
      },
      options: {
        tabs: { title: 'Abas das janelas', items: {
          song: ['Uma música', '{{t:dp_tab_overview}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}.'],
          artist: ['Um artista', '{{t:dp_tab_overview}}, {{t:dp_tab_music}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}, {{t:dp_tab_rating}}, {{t:dp_tab_awards}}.'],
          album: ['Um álbum', '{{t:dp_tab_overview}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}, {{t:dp_tab_rating}}.']
        } },
        buttons: { title: 'Botões das janelas', items: {
          sample: ['{{t:ea_s_sample}}', '30 segundos.'],
          playlist: ['{{t:dp_playlist}}', 'Adicionar a uma playlist.'],
          rate: ['{{t:dp_rate}}', 'Músicas e álbuns.'],
          share: ['{{t:st_am_share}}', 'Um cartão com imagem.'],
          more: ['{{t:ea_more}}', 'O menu ⋮.'],
          links: ['Spotify / YouTube / Last.fm', 'Achar em outro lugar.']
        } },
        cover: { title: '{{t:img_picker_change}}', items: {
          open: ['Abrir o seletor', 'O ✎ numa capa, segurar o dedo no celular, ou ⋮ → {{t:img_picker_change}}.'],
          sources: ['Deezer, iTunes, Last.fm, YouTube', 'Imagens achadas em cada um.'],
          link: ['{{t:imgpk_url_label}}', 'Qualquer imagem da internet, pelo link.'],
          none: ['{{t:imgpk_none}}', 'Um quadro liso, sem imagem.'],
          auto: ['{{t:imgpk_auto}}', 'O app escolhe a imagem sozinho.']
        } },
        music: { title: '{{t:dp_tab_music}}', items: {
          sorts: ['Ordenar', '{{t:am_sort_rank}} (o que você tem no começo), {{t:am_sort_plays}}, {{t:am_sort_recent}}, {{t:am_sort_az}}.'],
          charts: ['Qual parada', 'De sempre, Anual, Mensal, Semanal ou Diária.']
        } },
        streaktabs: { title: '{{t:streak_modal_title}}', items: {
          today: ['{{t:sk_tab_today}}', 'Mantenha vivas hoje.'],
          fire: ['{{t:sk_tab_fire}}', 'Rolando agora.'],
          recs: ['{{t:sk_tab_records}}', 'As maiores, selos, encerradas.'],
          cal: ['{{t:sk_tab_calendar}}', 'Dia a dia.']
        } }
      },
      challenges: {
        'win.song': ['Abra a janela de uma música', 'Clique no título de uma música.'],
        'win.artist': ['Abra a janela de um artista', 'Clique no nome de um artista.'],
        'win.album': ['Abra a janela de um álbum', 'Clique no nome de um álbum.'],
        'win.tab': ['Troque de aba numa janela', '{{t:dp_tab_charts}} ou {{t:dp_tab_listening}}.'],
        'win.search': ['Busque na sua biblioteca', 'Aperte / ou a busca na barra superior.'],
        'win.menu': ['Abra um menu ⋮', 'Numa linha, ou com o botão direito.'],
        'win.cover': ['Troque uma capa', 'O ✎ numa capa, ou ⋮ → {{t:img_picker_change}}.'],
        'win.streak': ['Abra suas sequências', 'A sequência de escuta no topo da página Charts.']
      },
      quiz: {
        q1: ['Como você abre a busca pelo teclado?',
          ['Aperte / ou Ctrl+K', 'Aperte S', 'Aperte Enter'],
          '/ ou Ctrl+K abrem a busca de qualquer página.'],
        q2: ['Onde você vê a posição de uma música semana a semana?',
          ['Na aba {{t:dp_tab_charts}} da janela dela', 'Na aba {{t:dp_tab_listening}}', 'Configurações'],
          '{{t:dp_tab_charts}} tem a posição ao longo do tempo; passe pela linha para ver cada semana.'],
        q3: ['O que uma sequência conta?',
          ['Dias seguidos em que você ouviu', 'As plays totais', 'As semanas na parada'],
          'Uma sequência são dias seguidos com pelo menos uma play.']
      },
      tips: [
        'Aperte / em qualquer página para buscar em toda a sua biblioteca.',
        'A aba {{t:dp_tab_listening}} de uma música mostra o dia em que você achou: o que tocava logo antes.',
        'Nas suas sequências, toque num selo ganho para virá-lo e ver quando você o ganhou.',
        'Não gostou de uma capa? Passe o mouse e aperte o ✎ para escolher outra, ou cole o link de qualquer imagem.'
      ]
    },
    stats: {
      title: '{{t:tab_stats}}',
      promise: 'O que você ouviu em qualquer período: um resumo, a história, jogos, comparações lado a lado e gráficos.',
      scenes: {
        top: { title: 'O período e o {{t:sx_tab_overview}}', spots: {
          presets: ['Períodos rápidos', '{{t:range_4w}}, {{t:range_12m}}, {{t:range_3y}} ou {{t:range_all}}. Todas as abas usam o período que você escolher aqui.'],
          dates: ['Suas próprias datas', 'Escolha qualquer data de início e de fim.'],
          tabs: ['Cinco abas', '{{t:sx_tab_overview}}, {{t:sx_tab_story}}, {{t:sx_tab_games}}, {{t:sx_tab_compare}} e {{t:sx_tab_charts}}. A que você deixar aberta é a que verá ao voltar.'],
          line: ['Numa frase', 'O período numa frase: quanto você ouviu, comparado ao período anterior, e quem liderou. Clique no artista para abrir a janela dele.'],
          share: ['{{t:sx_share}}', 'Cria uma imagem deste resumo para salvar ou enviar.'],
          tile: ['Quatro quadros', 'Plays, músicas, artistas e álbuns do período.'],
          delta: ['Comparado ao anterior', 'Subiu ou desceu em relação ao mesmo tempo logo antes, com esse número ao lado.'],
          trend: ['Como foi', 'Uma pequena linha de como foi ao longo do período.'],
          sub: ['Números menores', 'Plays por dia, seu melhor dia, quantas eram novas para você.'],
          go: ['Ver mais', 'Cada quadro tem um link para o gráfico ou a comparação que conta mais.']
        } },
        ov: { title: 'O resto do {{t:sx_tab_overview}}', spots: {
          top5: ['{{t:sx_top5_title}}', 'Os cinco que você mais ouviu no período. Clique em um para abrir a janela.'],
          t5seg: ['Músicas, artistas ou álbuns', 'Troca o que o top 5 mostra.'],
          t5lead: ['Seu #1', 'O líder, os plays, a parte do total e a vantagem sobre o #2. Ouça uma amostra aqui mesmo.'],
          t5rows: ['Do #2 ao #5', 'As barras mostram o quanto cada um está perto do #1.'],
          sotp: ['{{t:sx_sotp_title}}', 'Sua música mais ouvida no período e como foram os plays, dia a dia ou semana a semana.'],
          movers: ['{{t:sx_mov_title}}', 'O que você ouviu muito mais, e muito menos, que no período anterior.'],
          mvseg: ['Músicas, artistas ou álbuns', 'Troca o que as mudanças mostram.'],
          persona: ['{{t:sx_pers_title}}', 'Um nome para como você ouviu neste período, como {{t:sx_pers_explorer}} ou {{t:sx_pers_marathon}}, e por quê.'],
          facts: ['{{t:sx_fact_title}}', 'Detalhes do período: sua maior repetição, sua hora e seu dia com mais plays.'],
          shuffle: ['{{t:sx_fact_shuffle}}', 'Mostra outras curiosidades.'],
          cal: ['{{t:sx_cal_title}}', 'Um pequeno calendário do período, mais escuro quanto mais você ouviu. Clique num dia para abrir a parada diária.'],
          calmore: ['Todos os anos', 'Leva ao mapa de calor completo em {{t:sx_tab_charts}}.'],
          otd: ['{{t:sx_otd_title}}', 'A data de hoje em anos passados, e a música que você mais ouviu nesse dia.'],
          split: ['{{t:sx_split_title}}', 'Descobertas novas contra velhas favoritas, e quanto foi para seus 5 artistas principais.']
        } },
        story: { title: '{{t:sx_tab_story}}', spots: {
          obs: ['{{t:sx_obs_title_m}}', 'O artista que você mais ouviu em cada mês (ou em cada semana, num período curto).'],
          obsone: ['Um mês', 'Clique para abrir a parada desse mês.'],
          eras: ['{{t:sx_eras_title}}', 'Períodos em que um artista foi #1 na sua parada semanal por três semanas ou mais seguidas.'],
          drift: ['{{t:sx_drift_title}}', 'Seus 10 artistas de cada ano, ano a ano. Clique numa linha ou num nome para seguir um artista.'],
          driftkeys: ['Seguir um artista', 'Clique num nome para destacar a linha dele.'],
          loyal: ['{{t:sx_loyal_title}}', 'Quanto foi para seus 10 artistas principais, numa escala de aventureiro a fiel.'],
          comfort: ['{{t:sx_comfort_title}}', 'Músicas que você já conhecia contra músicas que encontrou neste período.'],
          disc: ['{{t:sx_disc_title}}', 'Seus maiores artistas novos do período, e se você ainda ouve.'],
          fun: ['{{t:sx_fun_title}}', 'O período em outras palavras: plays por dia, sua música top, quanto seus plays andariam.'],
          miles: ['{{t:sx_miles_title}}', 'Números redondos que você passou: plays, músicas e artistas diferentes, e quando.']
        } },
        games: { title: '{{t:sx_tab_games}}', spots: {
          head: ['{{t:sx_games_title}}', 'Quizzes feitos com a sua própria biblioteca.'],
          tally: ['Seu placar', 'Quantos jogos você já jogou, e sua sequência de dias no jogo do dia.'],
          daily: ['{{t:sx_daily_k}}', 'Um desafio por dia, o mesmo o dia todo. Só a primeira tentativa conta; jogue todo dia para manter a sequência.'],
          dailygo: ['{{t:sx_daily_play}}', 'Começa o desafio de hoje.'],
          card: ['Um jogo', 'Doze jogos: {{t:sx_game_hl}}, {{t:sx_game_tune}}, {{t:sx_game_year}}, {{t:sx_game_one}} e mais.'],
          tag: ['{{t:sx_games_new}}', 'Os jogos que você ainda não jogou têm uma etiqueta.'],
          go: ['{{t:sx_game_play}}', 'Abre o jogo em tela cheia.']
        } },
        game: { title: 'Jogando uma partida', spots: {
          title: ['O jogo', 'O nome dele.'],
          score: ['Sua pontuação', 'Sua sequência ou pontuação agora, e seu recorde.'],
          close: ['Fechar', 'Volta aos jogos. Esc faz o mesmo.'],
          q: ['A pergunta', 'O que você tem que adivinhar.'],
          known: ['O que você sabe', 'Um lado mostra a resposta.'],
          guess: ['O que você adivinha', 'O outro está escondido.'],
          btns: ['Sua resposta', 'Escolha uma. Acertando, a partida continua; no fim, você pode compartilhar o resultado.']
        } },
        cmp: { title: '{{t:sx_tab_compare}}', spots: {
          gran: ['{{t:gran_daily}} / {{t:gran_monthly}} / {{t:gran_yearly}}', 'Como as linhas são divididas: por dia, por mês ou por ano. Aparece em {{t:sx_tab_compare}} e {{t:sx_tab_charts}}.'],
          top: ['Seu top', 'Preenche a seleção com seus favoritos do período.'],
          saved: ['{{t:sx_saved_title}}', 'Salve uma seleção para trazê-la de volta depois.'],
          types: ['O que comparar', '{{t:sx_cmp_type_artists}}, {{t:sx_cmp_type_songs}}, {{t:sx_cmp_type_albums}} ou {{t:sx_cmp_type_years}}.'],
          modes: ['Como ver', '{{t:sx_cmp_mode_cum}}, {{t:sx_cmp_mode_per}}, {{t:sx_cmp_mode_run}} ou {{t:sx_cmp_mode_race}}.'],
          chip: ['Uma escolha', 'Posição, plays e porcentagem. A barra embaixo é a cor dela no gráfico.'],
          x: ['Remover', 'Tira da lista.'],
          add: ['Adicionar', 'Digite um nome e escolha na lista. Até 10.'],
          legend: ['A legenda', '{{t:sx_cmp_legend_tip}}.'],
          chart: ['O gráfico', 'Passe o mouse (ou toque) para ler cada período.'],
          verdict: ['Quem ganha', 'Mais plays, mais semanas em #1, o mais em alta agora, o que está há mais tempo com você.']
        } },
        cmpmore: { title: 'Mais em {{t:sx_tab_compare}}', spots: {
          h2h: ['{{t:sx_h2h_title}}', 'Quem lidera e por quanto, e a parte de cada um.'],
          share: ['{{t:sx_share}}', 'Uma imagem da comparação.'],
          table: ['A tabela', 'Plays, porcentagem, primeiro play, semanas em #1, melhor mês, maior sequência. Clique numa coluna para ordenar; o melhor de cada uma aparece na cor dele.'],
          own: ['{{t:sx_own_title}}', 'Um bloco por mês na cor de quem foi mais ouvido, e quando a liderança mudou.'],
          gaps: ['{{t:sx_gap_title}}', 'A disputa mais apertada, a maior vantagem, a subida mais rápida e quem liderou por mais tempo.'],
          ts: ['{{t:sx_ts_title}}', 'As três músicas mais ouvidas de cada um.'],
          hab: ['{{t:sx_hab_title}}', 'Quando cada um é ouvido: por hora e por dia da semana.']
        } },
        run: { title: '{{t:sx_cmp_mode_run}}', spots: {
          run: ['{{t:sx_cmp_mode_run}}', 'As posições deles na sua parada, semana a semana.'],
          crun: ['Qual parada', '{{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} ou {{t:nav_yearly}}.'],
          chart: ['Posição no tempo', 'Mais alto é melhor. As falhas são semanas fora da parada.']
        } },
        race: { title: '{{t:sx_cmp_mode_race}}', spots: {
          race: ['{{t:sx_cmp_mode_race}}', 'Suas escolhas como barras correndo para o topo, período a período.'],
          canvas: ['A corrida', 'Ela abre no resultado. Aperte play para ver desde o começo.'],
          start: ['Para o começo', 'Volta ao primeiro período.'],
          play: ['Play', 'Toca ou pausa a corrida.'],
          step: ['Um passo', 'Um período para a frente (o botão à esquerda do play volta).'],
          seek: ['Qualquer data', 'Arraste para qualquer momento.'],
          speeds: ['Velocidade', 'De 0.5× a 4×.'],
          gif: ['{{t:btn_download_gif}}', 'Salva a corrida como imagem animada.'],
          range: ['As datas da corrida', 'A corrida tem o próprio período, desde o seu primeiro play. Mude aqui; {{t:btn_reset}} volta ao original.']
        } },
        vol: { title: '{{t:sx_vol_title}}', spots: {
          gran: ['Por dia, mês ou ano', 'Como as barras são divididas.'],
          mode: ['{{t:sx_vol_mode_plays}} / {{t:sx_vol_mode_new}}', 'Todos os seus plays com a parte nova em cima, ou só o que era novo para você.'],
          labels: ['Números nas barras', 'Mostra o número de cada barra.'],
          zoom: ['Tirar o zoom', 'Arraste sobre o gráfico para aproximar; este botão afasta de novo.'],
          figs: ['Os números', 'Totais do período. Também servem de legenda: azul é {{t:sx_vol_known}}, verde é {{t:sx_vol_new}}.'],
          busiest: ['{{t:sx_v_month}}', 'Clique para ver esse mês por dentro.'],
          canvas: ['As barras', 'Clique em qualquer barra para ver esse período por dentro.']
        } },
        drill: { title: 'Dentro de um período', spots: {
          when: ['O período', 'Qual é, e como foi comparado ao anterior.'],
          step: ['Antes / depois', 'Vai para o período anterior ou o seguinte.'],
          figs: ['Os números', 'Plays, quanto foi novo, músicas e artistas.'],
          hero: ['A mais ouvida', 'A música top, com uma amostra.'],
          spark: ['{{t:sx_cal_title}}', 'Cada dia do período, com o de mais plays em destaque.'],
          tabs: ['Três listas', '{{t:sx_dr_tab_top}}, {{t:sx_dr_tab_new}} e {{t:sx_dr_tab_art}}.'],
          rows: ['A lista', 'Clique numa para abrir a janela.'],
          open: ['{{t:sx_drill_open}}', 'Abre a parada desse período.']
        } },
        clock: { title: '{{t:sx_clock_title}} e {{t:sx_week_title}}', spots: {
          clock: ['{{t:sx_clock_title}}', 'Cada fatia é uma hora; mais longa, mais plays. Passe o mouse (ou toque) para ver o que você ouvia nessa hora.'],
          parts: ['Partes do dia', 'Manhã, tarde, noite e madrugada, e a parte de cada uma.'],
          cnote: ['Numa frase', 'Suas horas com mais e com menos plays.'],
          wfigs: ['Dias úteis contra o fim de semana', 'Plays por dia em cada um, e seu dia com mais plays.'],
          week: ['{{t:sx_week_title}}', 'Média de plays de cada dia. Clique num dia para ver mais.'],
          wnote: ['Numa frase', 'Seus dias com mais e com menos plays.']
        } },
        heat: { title: '{{t:hm_title}}', spots: {
          types: ['{{t:hm_type_all}} / {{t:hm_type_artist}} / {{t:hm_type_song}} / {{t:hm_type_album}}', 'Todos os seus plays, ou só um artista, uma música ou um álbum: adicione pelo nome.'],
          colors: ['Cores', 'Escolha um esquema de cores para o mapa.'],
          year: ['O ano', 'Vai para o ano anterior ou o seguinte.'],
          best: ['Melhor sequência', 'Sua maior sequência de dias com música.'],
          figs: ['O ano em números', 'Plays, melhor dia, artista top e artistas novos.'],
          grid: ['Cada dia', 'Um quadrado por dia, mais forte quanto mais você ouviu. Passe o mouse (ou toque) para ver o que você ouvia.'],
          strip: ['{{t:hm_every_year}}', 'Cada ano em miniatura. Clique em um para abrir.'],
          patterns: ['{{t:hm_patterns}}', 'Quando você ouve ao longo da semana.'],
          scope: ['{{t:hm_pat_year}} / {{t:hm_pat_all}}', 'Padrões do ano aberto ou de todo o tempo.'],
          rhythm: ['Ritmo da semana', 'Plays por dia em cada dia da semana.'],
          hours: ['Hora do dia', 'Cada hora de cada dia da semana. A com mais plays fica destacada.']
        } }
      },
      howto: {
        range: { title: 'Escolher um período', slides: [
          'Escolha um período rápido: as últimas 4 semanas, 12 meses, 3 anos, ou tudo.',
          'Ou coloque sua própria data de início e de fim.',
          'Todas as abas usam o mesmo período. Troque de aba quando quiser.',
          'Em {{t:sx_tab_compare}} e {{t:sx_tab_charts}}, escolha também por dia, mês ou ano.'
        ] },
        overview: { title: 'Ler seu {{t:sx_tab_overview}}', slides: [
          'Comece pela frase: o período numa linha.',
          'As setas comparam com o mesmo período logo antes.',
          'Cada quadro leva ao gráfico que conta mais.',
          'Seu top 5: troque entre músicas, artistas e álbuns.',
          'Veja o que você ouviu mais, e menos, que antes.',
          'Clique em qualquer dia do calendário para abrir a parada desse dia.'
        ] },
        story: { title: 'Ver sua história', slides: [
          'Abra {{t:sx_tab_story}}.',
          'Seu artista top de cada mês. Clique em um para abrir a parada desse mês.',
          'Suas eras: quando um artista dominou sua parada semanal.',
          'Como seu top 10 mudou ano a ano.',
          'E os artistas novos que você encontrou, e se ainda ouve.'
        ] },
        game: { title: 'Jogar uma partida', slides: [
          'Comece pelo {{t:sx_daily_k}}: um desafio, o mesmo o dia todo.',
          'Ou escolha qualquer um dos doze jogos.',
          'Dê seu palpite.',
          'Sua pontuação e seu recorde, em cima.',
          'Feche quando quiser.',
          'Seu placar conta os jogos jogados e sua sequência de dias.'
        ] },
        compare: { title: 'Comparar artistas, músicas ou anos', slides: [
          'Escolha o que comparar.',
          'Digite um nome e adicione. Até 10.',
          'Cada escolha ganha um cartão e uma cor. O ✕ remove.',
          'Escolha como ver: total acumulado, por período, trajetória ou corrida.',
          'Clique num nome da legenda para esconder ou mostrar a linha.',
          'Role para baixo: frente a frente, quem esteve no topo, as diferenças, as músicas top e os hábitos.',
          'Salve a seleção para voltar a ela.'
        ] },
        race: { title: 'Ver uma corrida', slides: [
          'Em {{t:sx_tab_compare}}, escolha {{t:sx_cmp_mode_race}}.',
          'Aperte play.',
          'Arraste para qualquer momento.',
          'Mais devagar ou mais rápido.',
          'Salve como imagem animada para compartilhar.'
        ] },
        drill: { title: 'Ver um mês por dentro', slides: [
          'Em {{t:sx_tab_charts}}, clique em qualquer barra.',
          'Ou clique no período com mais plays.',
          'Abre embaixo do gráfico. As setas vão para o período anterior ou o seguinte.',
          'Troque entre músicas top, descobertas e artistas top.',
          'Abra a parada desse período.'
        ] },
        heat: { title: 'Explorar o mapa de calor', slides: [
          'Cada dia do ano, mais forte quanto mais você ouviu. Passe o mouse num dia.',
          'Percorra os anos.',
          'Mostre só um artista, uma música ou um álbum.',
          'Escolha um esquema de cores.',
          'E veja as horas da semana em que você mais ouve.'
        ] }
      },
      options: {
        range: { title: 'Período', items: {
          presets: ['{{t:range_4w}} / {{t:range_12m}} / {{t:range_3y}} / {{t:range_all}}', 'Um período rápido até hoje.'],
          dates: ['Datas', 'Qualquer início e fim.'],
          gran: ['{{t:gran_daily}} / {{t:gran_monthly}} / {{t:gran_yearly}}', 'Como os gráficos são divididos. Só em {{t:sx_tab_compare}} e {{t:sx_tab_charts}}.']
        } },
        tabs: { title: 'Abas', items: {
          overview: ['{{t:sx_tab_overview}}', 'O período numa frase, quatro quadros e oito cartões.'],
          story: ['{{t:sx_tab_story}}', 'Do que o período tratou.'],
          games: ['{{t:sx_tab_games}}', 'Doze jogos e um jogo do dia.'],
          compare: ['{{t:sx_tab_compare}}', 'Até 10 lado a lado, ou numa corrida.'],
          charts: ['{{t:sx_tab_charts}}', 'Volume, o relógio, sua semana e o mapa de calor.']
        } },
        overview: { title: '{{t:sx_tab_overview}}', items: {
          share: ['{{t:sx_share}}', 'Uma imagem do resumo.'],
          t5seg: ['{{t:sx_top5_title}}', 'Músicas, artistas ou álbuns.'],
          mvseg: ['{{t:sx_mov_title}}', 'Músicas, artistas ou álbuns.'],
          shuffle: ['{{t:sx_fact_shuffle}}', 'Outras curiosidades.']
        } },
        compare: { title: '{{t:sx_tab_compare}}', items: {
          types: ['O quê', '{{t:sx_cmp_type_artists}}, {{t:sx_cmp_type_songs}}, {{t:sx_cmp_type_albums}}, {{t:sx_cmp_type_years}}.'],
          modes: ['Como', '{{t:sx_cmp_mode_cum}}, {{t:sx_cmp_mode_per}}, {{t:sx_cmp_mode_run}}, {{t:sx_cmp_mode_race}}.'],
          crun: ['{{t:sx_cmp_mode_run}}', 'Qual parada: {{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}}, {{t:nav_yearly}}.'],
          top: ['Top 3 / {{t:sx_cmp_fill10}}', 'Preenche a seleção com seus favoritos.'],
          saved: ['{{t:sx_saved_title}}', 'Seleções salvas.'],
          legend: ['Legenda', 'Esconde ou mostra uma linha.'],
          h2hshare: ['{{t:sx_share}}', 'Uma imagem da comparação.']
        } },
        race: { title: '{{t:sx_cmp_mode_race}}', items: {
          speeds: ['Velocidade', '0.5×, 1×, 2×, 4×.'],
          gif: ['{{t:btn_download_gif}}', 'Salva a corrida.'],
          range: ['Período', 'As datas próprias da corrida.']
        } },
        graphs: { title: '{{t:sx_tab_charts}}', items: {
          mode: ['{{t:sx_vol_mode_plays}} / {{t:sx_vol_mode_new}}', 'Todos os plays, ou só o que é novo.'],
          labels: ['Números nas barras', 'Ligado ou desligado.'],
          zoom: ['Tirar o zoom', 'Volta ao período inteiro.'],
          drtabs: ['Dentro de um período', '{{t:sx_dr_tab_top}}, {{t:sx_dr_tab_new}}, {{t:sx_dr_tab_art}}.'],
          hmtypes: ['Mapa de calor', '{{t:hm_type_all}}, {{t:hm_type_artist}}, {{t:hm_type_song}}, {{t:hm_type_album}}.'],
          colors: ['Cores do mapa', 'Seis esquemas de cores.'],
          scope: ['{{t:hm_patterns}}', '{{t:hm_pat_year}} ou {{t:hm_pat_all}}.']
        } }
      },
      challenges: {
        'stats.range': ['Mude o período', 'Um período rápido ou suas próprias datas.'],
        'stats.story': ['Abra {{t:sx_tab_story}}', 'A segunda aba.'],
        'stats.go': ['Siga o link de um quadro', 'Embaixo de qualquer um dos quatro quadros do {{t:sx_tab_overview}}.'],
        'stats.game': ['Jogue uma partida', 'Qualquer jogo em {{t:sx_tab_games}}, ou o {{t:sx_daily_k}}.'],
        'stats.add': ['Adicione algo em {{t:sx_tab_compare}}', 'Digite um nome na caixa de adicionar.'],
        'stats.race': ['Veja uma corrida', '{{t:sx_tab_compare}} → {{t:sx_cmp_mode_race}}.'],
        'stats.drill': ['Veja um período por dentro', 'Clique numa barra em {{t:sx_tab_charts}}.'],
        'stats.heat': ['Mude o mapa de calor', 'Outro ano, cor ou vista.']
      },
      quiz: {
        q1: ['Um quadro diz ▲ 20%. Comparado a quê?',
          ['O mesmo tempo logo antes', 'O ano passado', 'Sua média de sempre'],
          'Cada quadro compara o período com o mesmo período logo antes.'],
        q2: ['Onde você vê seus artistas top numa corrida?',
          ['{{t:sx_tab_story}}', '{{t:sx_tab_compare}} → {{t:sx_cmp_mode_race}}', '{{t:sx_tab_games}}'],
          '{{t:sx_cmp_mode_race}} é uma das quatro formas como {{t:sx_tab_compare}} mostra suas escolhas.'],
        q3: ['O que o {{t:sx_daily_k}} tem de especial?',
          ['É um tipo novo de jogo', 'Dá pontos em dobro', 'Todos recebem o mesmo desafio o dia todo, e só a primeira tentativa conta'],
          'Um desafio por dia, o mesmo o dia todo. Jogue todo dia para manter sua sequência.']
      },
      tips: [
        'Os quadros de {{t:tab_stats}} comparam o período com o mesmo tempo logo antes. Experimente {{t:range_4w}} para ver a tendência do mês.',
        'Em {{t:sx_tab_compare}}, {{t:sx_cmp_mode_race}} transforma seus artistas top numa corrida que você pode salvar como GIF.',
        'Todo dia tem um novo {{t:sx_daily_k}} em {{t:sx_tab_games}}. Mantenha sua sequência.',
        'Clique em qualquer barra em {{t:sx_tab_charts}} para ver as músicas top e as descobertas daquele mês.',
        'O mapa de calor tem seis esquemas de cores, e pode mostrar um só artista, música ou álbum.'
      ]
    },
    records: {
      title: '{{t:nav_records}}',
      promise: 'Seu livro de recordes: números um, estreias, mais plays, sequências, certificações e mais, para músicas, artistas e álbuns.',
      scenes: {
        top: { title: '{{t:sec_records_title}}', spots: {
          intro: ['O que conta', 'O tamanho de cada parada de onde vêm os recordes, e quantos dias, semanas, meses e anos você tem.'],
          search: ['Buscar em todos os recordes', 'Digite um artista, uma música ou um álbum para ver todos os recordes dele, em todas as seções.'],
          nav: ['Seções', '{{t:rec_nav_overview}}, depois {{t:rec_grp_chart}} e {{t:rec_grp_plays}}. Aparece uma seção por vez.'],
          grp: ['Dois grupos', '{{t:rec_grp_chart}} vêm das suas paradas; {{t:rec_grp_plays}} vêm dos seus plays.'],
          count: ['Quantas', 'Quantas listas de recordes a seção tem.'],
          picker: ['{{t:rec_picker_label}}', 'No celular, as seções ficam neste menu.'],
          hero: ['{{t:rec_hero_label}}', 'O artista com mais recordes, e quantos são.'],
          reel: ['Os recordes dele', 'Uma faixa com os recordes. Ela anda sozinha; arraste para ver.'],
          card: ['Um recorde', 'O que é, o número e quando. O selo é a posição dele naquela lista.']
        } },
        ov: { title: '{{t:rec_nav_overview}}', spots: {
          intro: ['O melhor de cada', 'Quem tem o recorde de cada seção, numa página só.'],
          types: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Troca todos os cartões de uma vez.'],
          grp: ['Dois grupos', '{{t:rec_grp_chart}} e {{t:rec_grp_plays}}, como no menu.'],
          cell: ['Um cartão', 'Quem tem o recorde e o número. Clique para abrir aquela seção.'],
          value: ['O recorde', 'O número a bater.'],
          sw: ['Qual parada', 'Troca um cartão entre {{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} e {{t:nav_yearly}}.']
        } },
        ones: { title: '{{t:rec_nav_all_ones}}: como é cada seção', spots: {
          story: ['Numa frase', 'O recorde e quem o tem. Muda com os botões abaixo.'],
          ent: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quem ver os recordes.'],
          per: ['Qual parada', '{{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} ou {{t:nav_yearly}}.'],
          run: ['{{t:rec_run_total}} / {{t:rec_run_consec}}', 'Todas as semanas em #1 somadas, ou a maior sequência sem pausa.'],
          sort: ['{{t:rec1_sort}}', '{{t:rec1_sort_rank}}, {{t:rec1_sort_recent}}, {{t:rec1_sort_oldest}} ou {{t:rec1_sort_name}}.'],
          champ: ['O primeiro', 'O #1 da lista, em destaque: o número e quando.'],
          boxes: ['A trajetória', 'Cada vez que foi #1. Os espaços pontilhados são o tempo entre elas.'],
          sample: ['Amostra', 'Ouça 30 segundos.'],
          details: ['Detalhes', 'Abre a janela dele.'],
          runner: ['#2 e #3', 'Os dois logo atrás. Clique no ▸ para a janela deles.']
        } },
        list: { title: 'A lista', spots: {
          heads: ['Colunas', 'Clique num título para ordenar por ele.'],
          all: ['{{t:rec_expand_all}}', 'Abre ou fecha todas as trajetórias de uma vez.'],
          name: ['A entrada', 'Clique no nome para abrir a janela.'],
          tl: ['Quando', 'Uma linha da sua história: cada marca é uma vez em #1.'],
          date: ['Datas', 'Clique numa data para abrir aquela parada.'],
          toggle: ['A trajetória', 'Abre ou fecha a trajetória embaixo da linha.'],
          runrow: ['A trajetória', 'Cada semana em #1, com os espaços. Clique num quadro para ver aquela parada.']
        } },
        sort: { title: '{{t:rec1_sort}}', spots: {
          btn: ['{{t:rec1_sort}}', 'Abre o menu.'],
          rank: ['{{t:rec1_sort_rank}}', 'O maior recorde primeiro.'],
          recent: ['{{t:rec1_sort_recent}}', 'O mais recente primeiro.'],
          oldest: ['{{t:rec1_sort_oldest}}', 'Desde o começo da sua história.'],
          name: ['{{t:rec1_sort_name}}', 'Em ordem alfabética.']
        } },
        foot: { title: '{{t:rec_size_label}}', spots: {
          note: ['Quantas aparecem', 'Quantas entradas da lista você vê.'],
          show: ['{{t:rec_size_label}}', 'O tamanho de cada lista.'],
          sizes: ['Tamanhos', '25, 50, 100 ou todas (até 1.000).']
        } },
        search: { title: 'Busca', spots: {
          field: ['Buscar', 'Um artista, uma música ou um álbum.'],
          clear: ['Limpar', 'Volta à página normal.'],
          status: ['Resultados', 'Quantos recordes batem, e em quantas seções.'],
          nav: ['Todas as seções de uma vez', 'Durante a busca, todas as seções aparecem, só com as linhas que batem.']
        } },
        pak: { title: '{{t:rec_nav_pak}}', spots: {
          story: ['Quem tem', 'Quem tem mais, e quantos existem no total.'],
          about: ['O que é', 'Um artista em #1 nas paradas de artistas, músicas e álbuns ao mesmo tempo.'],
          info: ['{{t:rec_pak_info_btn}}', 'Abre a explicação completa.'],
          infotext: ['A explicação', 'O que é preciso, em poucas linhas.'],
          per: ['Qual parada', '{{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} ou {{t:nav_yearly}}.'],
          champ: ['Quem tem', 'Com a primeira música e o primeiro álbum a conseguir.'],
          details: ['Detalhes', 'Abre a janela dele.']
        } },
        nc: { title: '{{t:rec_nav_new_charts}}', spots: {
          about: ['O que é', 'Recordes de {{t:rec_nav_new_charts}}: só músicas, artistas e álbuns que você descobriu há pouco.'],
          tabs: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quem ver os recordes.'],
          title: ['Uma lista', 'Cada lista tem seu título.'],
          fold: ['Recolher', 'Recolhe uma lista; aperte de novo para abrir.'],
          champ: ['O primeiro', 'O #1 daquela lista.']
        } },
        mil: { title: '{{t:rec_nav_milestones}}', spots: {
          tabs: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quem ver as marcas.'],
          sub: ['Como funciona', 'Quem chegou primeiro a cada número redondo.'],
          tier: ['Uma marca', 'O número de plays.'],
          art: ['Quem chegou primeiro', 'E quando.'],
          more: ['Mais', 'Abre as marcas recolhidas no meio.']
        } },
        fast: { title: '{{t:rec_nav_fastest}}', spots: {
          tabs: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quem ver os recordes.'],
          pick: ['{{t:fast_pick_pre}} … {{t:fast_pick_post}}', 'Escolha o número de plays da corrida.'],
          sub: ['Quantos chegaram', 'Quantos alcançaram esse número.'],
          champ: ['O mais rápido', 'Quanto tempo levou desde o primeiro play.']
        } },
        streaks: { title: '{{t:rec_nav_streaks}}', spots: {
          ent: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quem ver as sequências.'],
          per: ['Dias, semanas, meses, anos', 'Ouvido todo dia seguido, toda semana seguida, e assim por diante.'],
          b2b: ['{{t:rec_per_runs}}', 'As vezes que tocou seguida, sem nada no meio.'],
          sub: ['Como conta', 'O que a lista mede.'],
          champ: ['A maior', 'De quando até quando.']
        } },
        certs: { title: '{{t:rec_nav_certs}}', spots: {
          story: ['O líder', 'O artista com mais certificações.'],
          tiers: ['O que é preciso', 'Os plays necessários para Ouro, Platina e Diamante, em músicas e em álbuns.'],
          card: ['Uma placa', 'Os três primeiros artistas, cada um numa placa.'],
          total: ['Certificações', 'Quantas eles têm no total.'],
          bar: ['A mistura', 'Diamante, Platina e Ouro, numa barra.'],
          tally: ['Músicas e álbuns', 'As certificações por nível.'],
          open: ['{{t:certd_open_ledger}}', 'Abre o registro completo embaixo das placas.']
        } },
        ledger: { title: '{{t:certd_title}}', spots: {
          tally: ['No total', 'Todas as certificações.'],
          facts: ['Dados principais', 'Músicas e álbuns, a primeira e a última, a mais rápida e o melhor ritmo.'],
          types: ['{{t:certd_all}} / {{t:certd_songs}} / {{t:certd_albums}}', 'Filtra por músicas ou álbuns.'],
          tiers: ['Níveis', 'Filtra por Diamante, Platina ou Ouro.'],
          sort: ['{{t:certd_sort}}', 'Muda a ordem.'],
          medal: ['O nível', 'Qual certificação, e com quantos plays.'],
          row: ['Uma certificação', 'A música ou o álbum, os plays por dia e os plays de agora.'],
          journey: ['Como chegou lá', 'Do primeiro play à certificação: quanto tempo levou, e o próximo nível.']
        } }
      },
      howto: {
        find: { title: 'Achar uma seção', slides: [
          'As seções ficam no menu à esquerda.',
          'No celular, abra o menu {{t:rec_picker_label}}.',
          'O número diz quantas listas ela tem.',
          'Cada seção começa com o recorde numa frase.'
        ] },
        overview: { title: 'Ler a {{t:rec_nav_overview}}', slides: [
          'Em cima: o artista com mais recordes.',
          'Uma faixa com os recordes dele. Arraste.',
          'Embaixo, o melhor de cada seção. Troque todos para artistas ou álbuns.',
          'Clique num cartão para abrir a seção.',
          'Ou troque um cartão para outra parada.'
        ] },
        types: { title: 'Músicas, artistas ou álbuns', slides: [
          'Quase todas as seções trocam entre músicas, artistas e álbuns.',
          'E entre suas paradas diária, semanal, mensal e anual.',
          '{{t:rec_nav_milestones}} e {{t:rec_nav_fastest}} têm seu próprio seletor.',
          '{{t:rec_nav_fastest}} também deixa você escolher o número de plays.'
        ] },
        read: { title: 'Ler um recorde', slides: [
          'Quem tem o recorde, em destaque, com o número.',
          'Cada vez que foi #1, com os espaços.',
          'O #2 e o #3 ao lado.',
          'O resto da lista: uma linha do tempo para cada um.',
          'Abra a trajetória de uma linha.',
          'Ou abra todas.'
        ] },
        count: { title: 'Total ou seguidas', slides: [
          '{{t:rec_run_total}} soma todas as semanas em #1; {{t:rec_run_consec}} conta só a maior sequência sem pausa.',
          'A frase muda junto.',
          'Ordene por posição, mais recente, mais antigo ou nome.',
          'Ou clique no título de uma coluna.'
        ] },
        search: { title: 'Buscar nos seus recordes', slides: [
          'Digite um artista, uma música ou um álbum.',
          'Quantos recordes batem.',
          'Todas as seções aparecem, só com as linhas que batem.',
          'Limpe para voltar.'
        ] },
        certs: { title: 'Abrir um registro de certificações', slides: [
          'Os plays que uma música ou um álbum precisa para cada nível.',
          'Os três primeiros artistas em placas.',
          'Abra todas as certificações de um artista.',
          'Os dados principais.',
          'Filtre por músicas, álbuns ou nível.',
          'Cada certificação, com quanto tempo levou.'
        ] },
        more: { title: 'Ver mais de uma lista', slides: [
          'Quantas entradas da lista você vê.',
          'Mostre 25, 50, 100 ou todas.'
        ] }
      },
      options: {
        sections: { title: 'Seções', items: {
          ones: ['{{t:rec_nav_all_ones}}', 'Tudo o que chegou a #1, e por quanto tempo.'],
          pak: ['{{t:rec_nav_pak}}', '#1 nas paradas de artistas, músicas e álbuns ao mesmo tempo.'],
          app: ['{{t:rec_nav_appearances}}', 'Mais semanas (dias, meses, anos) numa parada.'],
          debuts: ['{{t:rec_nav_debuts}}', 'As maiores estreias.'],
          nc: ['{{t:rec_nav_new_charts}}', 'Recordes de {{t:rec_nav_new_charts}}.'],
          plays: ['{{t:rec_nav_peak_plays}}', 'Mais plays num dia, numa semana, num mês ou num ano.'],
          mil: ['{{t:rec_nav_milestones}}', 'O primeiro a cada número redondo de plays.'],
          fast: ['{{t:rec_nav_fastest}}', 'O mais rápido a chegar a um número de plays.'],
          streaks: ['{{t:rec_nav_streaks}}', 'As maiores sequências de dias, semanas, meses, anos, e seguidas.'],
          certs: ['{{t:rec_nav_certs}}', 'Ouro, Platina e Diamante, artista por artista.']
        } },
        switches: { title: 'Em toda seção', items: {
          ent: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quem.'],
          per: ['{{t:nav_daily}} / {{t:nav_weekly}} / {{t:nav_monthly}} / {{t:nav_yearly}}', 'Qual parada.'],
          run: ['{{t:rec_run_total}} / {{t:rec_run_consec}}', 'Somado ou sem pausa. {{t:rec_nav_all_ones}} e {{t:rec_nav_appearances}}.'],
          sort: ['{{t:rec1_sort}}', '{{t:rec1_sort_rank}}, {{t:rec1_sort_recent}}, {{t:rec1_sort_oldest}}, {{t:rec1_sort_name}}.'],
          show: ['{{t:rec_size_label}}', '25, 50, 100 ou todas.'],
          all: ['{{t:rec_expand_all}}', 'Todas as trajetórias de uma vez.']
        } },
        overview: { title: '{{t:rec_nav_overview}}', items: {
          types: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Todos os cartões de uma vez.'],
          sw: ['Parada de um cartão', 'Um cartão por vez.']
        } },
        special: { title: 'Só em algumas seções', items: {
          pakinfo: ['{{t:rec_pak_info_btn}}', '{{t:rec_nav_pak}} explicado.'],
          b2b: ['{{t:rec_per_runs}}', '{{t:rec_nav_streaks}}: plays seguidos.'],
          fastpick: ['{{t:fast_pick_pre}} … {{t:fast_pick_post}}', '{{t:rec_nav_fastest}}: o número de plays.'],
          milmore: ['Mais marcas', '{{t:rec_nav_milestones}}: as recolhidas no meio.'],
          ncfold: ['Recolher', '{{t:rec_nav_new_charts}}: recolhe uma lista.']
        } },
        certs: { title: '{{t:rec_nav_certs}}', items: {
          open: ['{{t:certd_open_ledger}}', 'O registro completo.'],
          types: ['{{t:certd_all}} / {{t:certd_songs}} / {{t:certd_albums}}', 'Filtra o registro.'],
          tiers: ['Níveis', 'Diamante, Platina, Ouro.'],
          sort: ['{{t:certd_sort}}', 'A ordem do registro.']
        } }
      },
      challenges: {
        'rec.view': ['Abra outra seção', 'No menu (no celular, o menu {{t:rec_picker_label}}).'],
        'rec.ent': ['Troque para artistas ou álbuns', 'O seletor acima de qualquer lista.'],
        'rec.per': ['Troque para outra parada', '{{t:nav_daily}}, {{t:nav_monthly}} ou {{t:nav_yearly}}, numa seção ou num cartão da {{t:rec_nav_overview}}.'],
        'rec.consec': ['Conte {{t:rec_run_consec}}', 'Em {{t:rec_nav_all_ones}}.'],
        'rec.run': ['Abra a trajetória de um recorde', 'A seta no fim de uma linha.'],
        'rec.search': ['Busque nos seus recordes', 'A caixa no topo.'],
        'rec.ledger': ['Abra um registro de certificações', '{{t:rec_nav_certs}} → {{t:certd_open_ledger}}.'],
        'rec.show': ['Mostre uma lista maior', '{{t:rec_size_label}}, embaixo da lista.']
      },
      quiz: {
        q1: ['O que {{t:rec_run_consec}} conta?',
          ['Todas as semanas em #1 somadas', 'Só a maior sequência sem pausa', 'Semanas no top 10'],
          '{{t:rec_run_total}} soma todas as semanas; {{t:rec_run_consec}} conta só o trecho mais longo sem pausa.'],
        q2: ['Você busca um artista. O que acontece?',
          ['Todas as seções aparecem, só com os recordes dele', 'Só a {{t:rec_nav_overview}} muda', 'A janela dele abre'],
          'A busca filtra todas as seções de uma vez, e diz quantos recordes bateram.'],
        q3: ['O que é um {{t:rec_nav_pak}}?',
          ['Mais plays num dia', 'Uma estreia em #1', 'Um artista em #1 nas paradas de artistas, músicas e álbuns ao mesmo tempo'],
          'As três paradas lideradas pelo mesmo artista no mesmo período.']
      },
      tips: [
        'A busca de {{t:nav_records}} mostra todos os recordes de um artista, música ou álbum, em todas as seções.',
        'Em {{t:rec_nav_all_ones}}, troque para {{t:rec_run_consec}} para ver as maiores sequências sem pausa em #1.',
        'Em {{t:rec_nav_certs}}, abra o registro de um artista para ver a rapidez de cada Ouro, Platina e Diamante.',
        'Um {{t:rec_nav_pak}} é um artista em #1 nas três paradas ao mesmo tempo. Quantos você tem?',
        'Cada cartão da {{t:rec_nav_overview}} troca sozinho entre as paradas diária, semanal, mensal e anual.'
      ]
    },
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
