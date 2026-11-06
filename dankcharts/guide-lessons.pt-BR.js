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
