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
