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
          newe: ['NOVA', 'A primeira semana neste top.'],
          re: ['RE (reentrada)', 'Voltou ao top depois de ter saído. Mantém o pico e as semanas.'],
          art: ['Capa', 'Carrega em ▶ na capa para ouvires um excerto de 30 segundos.'],
          title: ['Título e artista', 'Clica no título para a janela da música, ou no nome do artista para a dele.'],
          peak: ['Tag de pico', 'A posição mais alta que já alcançou neste top. Liga-a em ⋮ → Mostrar → Tags pico.'],
          cert: ['Certificação', 'Ouro, Platina ou Diamante quando passa uma marca de plays. Liga-a em ⋮ → Mostrar → Selos cert.'],
          album: ['Álbum', 'Clica para a janela do álbum.'],
          weeks: ['Semanas no top', 'Quantas semanas passou no top no total, somando todas as passagens. Nunca volta a zero.'],
          plays: ['Plays', 'Plays desta semana. É a única coisa que define a ordem do top.'],
          pdelta: ['Mudança de plays', 'Quantos mais ou menos do que na semana passada.'],
          best: ['Pico de plays (▲ PICO DE PLAYS)', 'O maior número de plays numa semana até agora. Liga-o em ⋮ → Mostrar → Pico de plays.'],
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
          ppeak: ['Pico de plays', 'Uma tag ▲ PICO DE PLAYS quando uma entrada tem o maior número de plays numa semana até agora.'],
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
          newe: ['NOVA', 'Primeira semana no top.'],
          re: ['RE', 'Voltou depois de ter saído.'],
          peak: ['PICO #', 'A posição mais alta.'],
          cert: ['Ouro / Platina / Diamante', 'Passou uma marca de plays.'],
          best: ['▲ PICO DE PLAYS', 'Mais plays numa semana até agora.']
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

    daily: {
      title: 'O teu top Diário',
      promise: 'Um dia de cada vez: o top, quando ouviste, como te sentiste e o que te faz lembrar.',
      scenes: {
        top: { title: 'Topo da página', spots: {
          daily: ['{{t:nav_daily}}', 'O top de hoje e de qualquer dia anterior. A tecla D leva-te lá.'],
          prev: ['Dia anterior', 'Recua um dia. A tecla ← faz o mesmo.'],
          label: ['Que dia', 'Clica para abrir um calendário e saltar para qualquer dia.'],
          next: ['Dia seguinte', 'Avança um dia.'],
          banner: ['O dia numa linha', 'Quem dominou o dia e o que o fez destacar-se. Hoje diz quem vai à frente.'],
          peak: ['Tag de recorde', 'Aparece quando um número é um recorde, como o teu maior dia do mês ou de sempre.'],
          tiles: ['Quatro números', 'Plays, músicas diferentes, artistas e álbuns do dia, com a mudança face ao dia com que comparas.'],
          hours: ['Plays por hora', 'Cada hora do dia e quantos plays teve.'],
          best: ['Hora mais ativa', 'O quadrado dourado é a hora em que mais ouviste.'],
          share: ['Partilhar', 'Guarda estes números como imagem.']
        } },
        tools: { title: 'Ferramentas por cima do top', spots: {
          cmp: ['{{t:dy_compare_label}}', 'Com que dia se medem as setas e as mudanças.'],
          cmp1: ['{{t:dy_vs_yesterday}}', 'Face ao dia anterior. É o que tens ao começar.'],
          cmp2: ['O mesmo dia da semana', 'Face ao mesmo dia da semana anterior: uma terça-feira é medida com a terça-feira passada.'],
          no1: ['{{t:dy_no1_today}}', 'A tua música #1 do dia, e há quantos dias seguidos está em #1.'],
          recap: ['{{t:dy_recap}}', 'O dia como uma história curta, um cartão de cada vez.'],
          share: ['{{t:dy_share_img}}', 'Uma imagem do top do dia para partilhar.'],
          play: ['Ouvir as primeiras', 'Toca o top do dia por ordem.'],
          cal: ['{{t:dy_cal_title}}', 'Um mês de dias, cada um com a capa da sua #1. Clica num para o abrir.'],
          save: ['{{t:dy_save_pl}}', 'Guarda o top do dia como uma das tuas playlists.'],
          export: ['{{t:dy_export}}', 'O top como lista para copiar, guardar como texto ou levar para o Spotify e outros.'],
          title: ['Tamanho do top', 'Quantas músicas tem o top Diário. Muda-o em ⋮ → Tamanho.'],
          heads: ['Colunas', 'Posição, movimento, título e artista, álbum, dias no top e plays.']
        } },
        panel: { title: 'O teu dia', spots: {
          today: ['O dia', 'Os plays do dia face ao teu dia habitual.'],
          week: ['Últimos 7 dias', 'Uma barra por cada um dos últimos 7 dias, e o total face aos 7 anteriores.'],
          first: ['Primeiro play', 'A primeira música do dia, e a que horas.'],
          last: ['Último play', 'A última música do dia, e a que horas.'],
          topart: ['{{t:dy_top_artist}}', 'Quem mais ouviste nesse dia.'],
          repeat: ['{{t:ns_x_on_repeat}}', 'Músicas que ouviste em quase todos os últimos 7 dias. Vão passando sozinhas.'],
          moods: ['Humor', 'Escolhe como foi o dia.'],
          note: ['Uma linha sobre o teu dia', 'Onde estavas, o que aconteceu. Até 500 caracteres.'],
          status: ['Onde fica guardado', 'Neste navegador. Inicia sessão e vai contigo para todos os dispositivos.']
        } },
        time: { title: 'Hora do dia e padrões', spots: {
          busiest: ['{{t:dy_busiest}}', 'A hora com mais plays.'],
          sessions: ['Sessões de escuta', 'Quantos períodos separados de escuta teve o dia.'],
          longest: ['{{t:dy_longest_lbl}}', 'O teu período mais longo sem uma pausa grande, e quando foi.'],
          tl: ['Capas por hora', 'A música mais ouvida de cada hora.'],
          hours: ['Barras por hora', 'Quantos plays teve cada hora. Clica numa barra para veres essa hora.'],
          busy: ['A barra mais alta', 'Destacada para a encontrares depressa.'],
          hourcard: ['A hora escolhida', 'Os plays dessa hora e a música mais ouvida.'],
          parts: ['Partes do dia', '{{t:dy_part_night}}, {{t:dy_part_morning}}, {{t:dy_part_afternoon}} e {{t:dy_part_evening}}: os plays, a fatia do dia e a música principal. A mais ativa leva a marca {{t:dy_part_peak}}.'],
          replayed: ['{{t:dy_pat_most}}', 'A música que mais ouviste nesse dia.'],
          b2b: ['{{t:dy_pat_b2b}}', 'Quantas vezes seguidas tocou uma música, e um artista.'],
          full: ['{{t:dy_pat_full}}', 'Álbuns que ouviste inteiros nesse dia.'],
          variety: ['{{t:dy_pat_variety}}', 'De fiel (sempre as mesmas) a explorador (sempre algo diferente).'],
          genres: ['{{t:dy_genre_title}}', 'Os géneros que ouviste nesse dia, como parte dos teus plays.']
        } },
        mem: { title: 'Memórias e marcas', spots: {
          otd: ['{{t:dy_otd}}', 'O que ouvias nesta data em anos anteriores.'],
          forgot: ['{{t:dy_forgot}}', 'Músicas que ouvias muito e já não tocas há algum tempo.'],
          back: ['{{t:dy_comeback}}', 'Músicas que voltaste a pôr nesse dia depois de muito tempo.'],
          firsth: ['{{t:dy_first}}', 'Músicas e artistas que ouviste pela primeira vez nesse dia.'],
          list: ['A lista', 'Clica numa linha para abrir a janela dela.'],
          awards: ['{{t:dy_aw_title}}', 'A música, o artista, o álbum, a descoberta e o regresso do dia.'],
          mshit: ['{{t:dy_ms_hit}}', 'Marcas de plays alcançadas nesse dia, como o 500.º play de uma música.'],
          msrec: ['{{t:dy_rec_title}}', 'Recordes batidos nesse dia.'],
          msstreak: ['{{t:dy_streaks}}', 'Dias seguidos a ouvir uma música ou um artista, e sequências que acabaram.'],
          msgoal: ['{{t:dy_goals}}', 'Quão longe está o dia dos teus melhores dias.'],
          msnear: ['{{t:dy_close_title}}', 'Marcas a poucos plays de distância.']
        } },
        recap: { title: '{{t:dy_recap}}', spots: {
          bars: ['Progresso', 'Uma barra por cada cartão da história.'],
          big: ['Um cartão', 'Uma coisa do dia por cartão: os plays, a música #1, o artista principal, quando ouviste, a tua variedade e os destaques. O último cartão pode partilhar o dia ou tocar as músicas.'],
          next: ['Cartão seguinte', 'Toca no lado direito ou carrega em →.'],
          prev: ['Cartão anterior', 'Toca no lado esquerdo ou carrega em ←.'],
          x: ['Fechar', 'Esc faz o mesmo.']
        } },
        cal: { title: '{{t:dy_cal_title}}', spots: {
          title: ['O mês', 'Que mês estás a ver.'],
          prev: ['Mês anterior', 'Recua um mês. A tecla ← faz o mesmo.'],
          next: ['Mês seguinte', 'Avança um mês. A tecla → faz o mesmo.'],
          grid: ['Cada dia', 'Cada dia mostra a capa da sua música #1.'],
          day: ['Um dia', 'Clica para abrir o top desse dia.'],
          share: ['Partilhar', 'Transforma o mês numa imagem para partilhar.'],
          x: ['Fechar', 'Esc faz o mesmo.']
        } }
      },
      howto: {
        pick: { title: 'Ir para outro dia', slides: [
          'Carrega em ‹ para o dia anterior. A tecla ← também funciona.',
          'Ou clica na data para escolheres qualquer dia num calendário.',
          '{{t:dy_cal_title}} mostra um mês inteiro de uma vez.',
          'Cada dia tem a capa da sua #1. Clica num para abrires esse dia.'
        ] },
        compare: { title: 'Escolher com que se compara o dia', slides: [
          'Ao começar, o movimento é medido face a ontem.',
          'Escolhe o mesmo dia da semana para comparar, por exemplo, esta terça-feira com a terça-feira passada.',
          'As setas, as tags NOVA e RE e as mudanças seguem a tua escolha.'
        ] },
        recap: { title: 'Ver o teu dia como uma história', slides: [
          'Carrega em {{t:dy_recap}}.',
          'O dia chega em cartões, uma coisa de cada vez.',
          'Toca no lado direito para o seguinte.',
          'Fecha quando quiseres.'
        ] },
        diary: { title: 'Fazer um diário dos teus dias', slides: [
          'Escolhe como foi o dia.',
          'Acrescenta uma linha: onde estavas, o que aconteceu.',
          'Fica guardado logo. Inicia sessão e vai contigo para todos os dispositivos.'
        ] },
        hours: { title: 'Ver quando ouviste', slides: [
          'Cada barra é uma hora. Clica numa.',
          'Aqui aparecem os plays dessa hora e a música mais ouvida.',
          'As quatro partes do dia resumem tudo, com a música principal de cada uma.'
        ] },
        memories: { title: 'Olhar para trás a partir de qualquer dia', slides: [
          '{{t:dy_otd}}: o que ouvias nesta data em anos anteriores.',
          '{{t:dy_forgot}}: antigas favoritas que já não tocas há algum tempo.',
          '{{t:dy_comeback}}: músicas que voltaram nesse dia.',
          '{{t:dy_first}}: tudo o que ouviste pela primeira vez.',
          'Mais abaixo, {{t:dy_ms_title}} conta o que o dia alcançou e quão perto estás dos teus melhores dias.'
        ] },
        keep: { title: 'Guardar um dia', slides: [
          '{{t:dy_save_pl}} guarda o top como uma das tuas playlists.',
          '{{t:dy_export}} dá-te a lista para o Spotify e outros.',
          '{{t:dy_share_img}} faz uma imagem dele.'
        ] }
      },
      options: {
        actions: { title: 'Botões por cima do top', items: {
          recap: ['{{t:dy_recap}}', 'O dia como uma história em cartões.'],
          share: ['{{t:dy_share_img}}', 'Uma imagem do top do dia.'],
          play: ['Ouvir as primeiras', 'Toca o top do dia por ordem.'],
          cal: ['{{t:dy_cal_title}}', 'Um mês de dias com as capas das #1.'],
          save: ['{{t:dy_save_pl}}', 'O top como uma das tuas playlists.'],
          export: ['{{t:dy_export}}', 'O top como lista para outras apps.']
        } },
        compare: { title: '{{t:dy_compare_label}}', items: {
          yday: ['{{t:dy_vs_yesterday}}', 'Face ao dia anterior.'],
          wday: ['O mesmo dia da semana', 'Face ao mesmo dia da semana anterior.']
        } },
        sections: { title: 'Por baixo do top', items: {
          panel: ['O dia', 'Plays face ao teu dia habitual, os últimos 7 dias, primeiro e último play, artista principal e em repetição.'],
          diary: ['{{t:dy_diary_title}}', 'Um humor e uma linha sobre o dia.'],
          time: ['{{t:dy_tod_title}}', 'Plays por hora, sessões e as quatro partes do dia.'],
          pats: ['{{t:dy_pat_title}}', 'A mais repetida, seguidas, álbuns inteiros, variedade e géneros.'],
          mem: ['{{t:dy_mem_title}}', 'Esta data em anos anteriores, antigas favoritas, regressos e primeiros plays.'],
          ms: ['{{t:dy_ms_title}}', 'Os prémios, marcas, recordes, sequências e metas do dia.']
        } },
        memtabs: { title: '{{t:dy_mem_title}}', items: {
          otd: ['{{t:dy_otd}}', 'Esta data em anos anteriores.'],
          forgot: ['{{t:dy_forgot}}', 'Antigas favoritas que desapareceram.'],
          back: ['{{t:dy_comeback}}', 'De volta depois de muito tempo.'],
          firsth: ['{{t:dy_first}}', 'Ouvidas pela primeira vez.'],
          throw: ['{{t:dy_throw}}', 'Favoritos de sempre que já não tocas há algum tempo. Cada separador só aparece nos dias em que tem alguma coisa.']
        } },
        mstabs: { title: '{{t:dy_ms_title}}', items: {
          hit: ['{{t:dy_ms_hit}}', 'Marcas de plays alcançadas.'],
          rec: ['{{t:dy_rec_title}}', 'Recordes batidos nesse dia.'],
          streak: ['{{t:dy_streaks}}', 'Sequências de dias mantidas ou terminadas.'],
          goal: ['{{t:dy_goals}}', 'Quão longe dos teus melhores dias.'],
          near: ['{{t:dy_close_title}}', 'Marcas a poucos plays.']
        } },
        size: { title: '⋮ → Tamanho', items: {
          day: ['Tamanhos do Diário', 'Top 10, 20, 25, 30 ou 50.']
        } }
      },
      challenges: {
        'day.prev': ['Recua um dia', 'Carrega em ‹ ou na tecla ←.'],
        'day.cmp': ['Compara com o mesmo dia da semana', 'O seletor ao lado de {{t:dy_compare_label}}.'],
        'day.recap': ['Abre {{t:dy_recap}}', 'O primeiro botão por cima do top.'],
        'day.cal': ['Abre o {{t:dy_cal_title}}', 'Um botão por cima do top.'],
        'day.mood': ['Escolhe um humor para um dia', 'Em {{t:dy_diary_title}}.'],
        'day.hour': ['Escolhe uma hora', 'Uma barra em {{t:dy_tod_title}}.'],
        'day.tab': ['Abre outro separador de Memórias ou Marcas', 'Por exemplo {{t:dy_forgot}}.'],
        'day.save': ['Guarda um dia como playlist', '{{t:dy_save_pl}} por cima do top.']
      },
      quiz: {
        q1: ['Comparas com o mesmo dia da semana. Com o que é medido hoje?',
          ['Com ontem', 'Com o mesmo dia da semana anterior', 'Com o teu melhor dia'],
          'Compara, por exemplo, esta terça-feira com a terça-feira passada: mais justo quando os teus dias da semana são diferentes.'],
        q2: ['Onde escreves uma linha sobre como correu o dia?',
          ['{{t:dy_diary_title}}', '{{t:dy_mem_title}}', '{{t:dy_recap}}'],
          '{{t:dy_diary_title}} guarda um humor e uma linha para cada dia.'],
        q3: ['O que mostra {{t:dy_otd}}?',
          ['O que ouvias nesta data em anos anteriores', 'A música mais ouvida de hoje', 'Músicas que nunca ouviste'],
          'Olha para a mesma data em cada ano anterior em que tens plays.']
      },
      tips: [
        '{{t:dy_recap}} transforma qualquer dia numa história em cartões. Experimenta no teu dia mais ativo.',
        '{{t:dy_mem_title}} → {{t:dy_otd}} mostra o que ouvias nesta data em anos anteriores.',
        'O {{t:dy_cal_title}} mostra a capa da #1 de cada dia: um mês inteiro de uma vez.',
        'Escolhe um humor e escreve uma linha em {{t:dy_diary_title}}, e o separador Diário passa a ser um diário musical.'
      ]
    },

    periods: {
      title: 'Tops Mensal e Anual',
      promise: 'Meses que mostram o que ficou mesmo, tops de fim de ano de qualquer ano e o que quer dizer cada tag de recorde.',
      scenes: {
        mtop: { title: 'Um mês', spots: {
          monthly: ['{{t:nav_monthly}}', 'Um mês do calendário de cada vez. A tecla M leva-te lá.'],
          yearly: ['{{t:nav_yearly}}', 'Um ano do calendário de cada vez. A tecla Y leva-te lá.'],
          label: ['Que mês', 'Clica para saltar para qualquer mês. ‹ e › andam um mês de cada vez.'],
          banner: ['O mês numa linha', 'Quem o dominou, e como se compara com os teus outros meses.'],
          peak: ['Tag de recorde', '{{t:stat_alltime_peak}}: nenhum mês passou alguma vez deste número.'],
          tiles: ['Quatro números', 'Plays, músicas diferentes, artistas e álbuns, com a mudança face ao mês anterior.'],
          days: ['Plays por dia', 'Cada dia do mês e os seus plays.'],
          day: ['Um dia', 'Clica em qualquer dia para o abrires no top Diário.'],
          best: ['Melhor dia', 'O quadrado dourado é o dia mais ativo do mês.'],
          share: ['Partilhar', 'Guarda estes números como imagem.']
        } },
        mchart: { title: 'O top mensal', spots: {
          title: ['Tamanho do top', 'O Mensal começa em Top 50. Muda-o em ⋮ → Tamanho.'],
          heads: ['Colunas', 'Igual ao Semanal, mas conta meses no top.'],
          months: ['Meses no top', 'Quantos meses passou no top no total.'],
          newe: ['NOVA', 'O primeiro mês no top.'],
          up: ['Subiu', 'Subiu essas posições desde o mês passado.'],
          plays: ['Plays', 'Plays do mês inteiro. Uma música precisa de plays constantes, não de uma semana forte.']
        } },
        mnew: { title: 'Novidades do mês', spots: {
          bar: ['{{t:atc_title}}', 'As listas à volta do top. No Mensal e no Anual são as novas entradas.'],
          tabs: ['{{t:atc_tab_new}}', 'Tudo o que é novo este mês, com a contagem.'],
          fold: ['Recolher', 'Esconde o bloco e mantém o título.'],
          chip1: ['{{t:ne_filter_all}}', 'Todas as músicas novas do mês.'],
          chip2: ['{{t:ne_filter_chart}}', 'Só as novas que entraram no top.'],
          chip3: ['{{t:ne_filter_new_artists}}', 'Só músicas de artistas que nunca tinhas ouvido.'],
          row: ['Uma música nova', 'Clica para abrir a janela dela.'],
          debut: ['Estreia', 'A posição em que entrou no top.'],
          biggest: ['Estreia recorde', 'Aparece quando uma estreia é a maior de sempre, ou em muito tempo.'],
          caps: ['Semana a semana', 'Uma marca por semana do mês. As acesas são semanas em que a ouviste; quanto mais forte, mais plays.'],
          ndays: ['Semanas ouvida', 'Em quantas semanas do mês tocou.']
        } },
        cert: { title: 'Certificados este mês', spots: {
          title: ['{{t:creel_title}}', 'Músicas e álbuns que chegaram a Ouro, Platina ou Diamante durante este mês.'],
          count: ['Quantos', 'Quantos foram certificados este mês.'],
          filter: ['Filtro', 'Todos, só músicas ou só álbuns.'],
          plaque: ['Uma placa', 'O prémio, para que é e o dia em que foi alcançado.'],
          hint: ['Explorar', 'As placas passam sozinhas. Passa o rato por cima para as parar, arrasta para explorar.'],
          collapse: ['Recolher', 'Esconde as placas e mantém o título.']
        } },
        ytop: { title: 'Um ano', spots: {
          yearly: ['{{t:nav_yearly}}', 'Um ano do calendário de cada vez.'],
          label: ['Que ano', 'Clica para escolheres outro ano. ‹ e › andam um ano de cada vez.'],
          banner: ['O ano numa linha', 'Quem dominou o teu ano e o tamanho dele.'],
          peak: ['Tag de recorde', '{{t:stat_peak_at_time}}: foi um recorde quando aconteceu e já foi superado.'],
          tiles: ['Quatro números', 'Os plays, músicas, artistas e álbuns do ano, com a mudança face ao ano anterior.'],
          months: ['Plays por mês', 'Cada mês do ano. Clica num para o abrires.'],
          best: ['Melhor mês', 'O quadrado dourado é o mês mais ativo do ano.']
        } },
        ychart: { title: 'O top anual', spots: {
          title: ['Tamanho do top', 'O Anual começa em Top 100, e vai até 200 ou todas as músicas que ouviste.'],
          search: ['Procurar no top', 'Escreve parte de um título ou de um artista para o encontrares no top.'],
          heads: ['Colunas', 'Conta anos no top.'],
          years: ['Anos no top', 'Em quantos tops de fim de ano entrou.'],
          up: ['Subiu', 'Subiu face à posição no top do ano passado.'],
          newe: ['NOVA', 'O primeiro top de fim de ano.'],
          menu: ['Opções do top (⋮)', 'Mostrar, Tamanho e Ações, como no Semanal.']
        } }
      },
      howto: {
        month: { title: 'Ver um mês', slides: [
          'Escolhe {{t:nav_monthly}}.',
          '‹ e › andam um mês. Clica no nome para saltares mais longe.',
          'Clica em qualquer dia da faixa para o abrires no top Diário.'
        ] },
        year: { title: 'Ver um ano', slides: [
          'Escolhe {{t:nav_yearly}}.',
          'Anda um ano com ‹ e ›, ou clica no ano para escolheres um.',
          'Clica num mês da faixa para o abrires.'
        ] },
        peaks: { title: 'Perceber as tags de recorde', slides: [
          '{{t:stat_alltime_peak}}: nenhum mês (ou ano) passou alguma vez deste número.',
          '{{t:stat_peak_at_time}}: foi um recorde quando aconteceu e já foi superado.'
        ] },
        newones: { title: 'Encontrar o que é novo', slides: [
          'Por baixo do top, {{t:atc_tab_new}} reúne todas as músicas novas do mês.',
          '{{t:ne_filter_chart}} deixa só as que entraram no top.',
          'Cada uma mostra onde se estreou.',
          'E em que semanas do mês a ouviste.'
        ] },
        cert: { title: 'Ver o que chegou a Ouro', slides: [
          'Filtra as placas: todas, músicas ou álbuns.',
          'Cada placa diz para que é e o dia em que foi alcançada.',
          'Passa o rato para parar a faixa, ou arrasta-a para explorar.'
        ] },
        find: { title: 'Encontrar uma música num top longo', slides: [
          'Escreve na caixa de pesquisa por cima do top.',
          'Ficam só as linhas que coincidem, com a posição real.'
        ] }
      },
      options: {
        size: { title: '⋮ → Tamanho', items: {
          month: ['Tamanhos do Mensal', 'Top 25, 30, 50 ou 100.'],
          year: ['Tamanhos do Anual', 'Top 50, 100, 200 ou todas as músicas.']
        } },
        peaks: { title: 'Tags de recorde nos números', items: {
          alltime: ['{{t:stat_alltime_peak}}', 'O maior de sempre, ainda por superar.'],
          attime: ['{{t:stat_peak_at_time}}', 'Um recorde quando aconteceu, superado depois.']
        } },
        newchips: { title: '{{t:atc_tab_new}}', items: {
          all: ['{{t:ne_filter_all}}', 'Todas as músicas novas.'],
          made: ['{{t:ne_filter_chart}}', 'As novas que entraram no top.'],
          artists: ['{{t:ne_filter_new_artists}}', 'Músicas de artistas novos para ti.']
        } },
        certf: { title: '{{t:creel_title}}', items: {
          filter: ['{{t:certd_all}} / {{t:chart_type_songs}} / {{t:chart_type_albums}}', 'Que placas mostrar.']
        } }
      },
      challenges: {
        'per.month': ['Abre o top Mensal', '{{t:nav_monthly}}, ao lado de {{t:nav_weekly}}.'],
        'per.year': ['Abre o top Anual', '{{t:nav_yearly}}, ao lado de {{t:nav_monthly}}.'],
        'per.day': ['Abre um dia a partir de um mês', 'Clica num dia na faixa de plays por dia.'],
        'per.new': ['Filtra as músicas novas', '{{t:ne_filter_chart}}, por baixo do top.'],
        'per.cert': ['Filtra as placas certificadas', 'Músicas ou Álbuns.'],
        'per.search': ['Procura num top Anual', 'A caixa por cima do top.']
      },
      quiz: {
        q1: ['Um número diz {{t:stat_alltime_peak}}. O que quer dizer?',
          ['Nenhum mês passou alguma vez dele', 'É o melhor do ano até agora', 'Está acima do teu mês habitual'],
          '{{t:stat_alltime_peak}} é o maior de sempre. {{t:stat_peak_at_time}} foi um recorde e já foi superado.'],
        q2: ['Uma música foi #1 num top Semanal mas não é #1 do mês. Porquê?',
          ['O mês conta todas as semanas, e plays constantes ganham a uma semana forte', 'O Mensal deixa de fora as músicas novas', 'O Mensal só conta fins de semana'],
          'Cada top conta o seu próprio intervalo de tempo. Uma semana forte pode perder para uma música que ouviste o mês todo.'],
        q3: ['Uma música nova mostra “3 de 5 semanas”. O que quer dizer?',
          ['Tocou em 3 das 5 semanas do mês', 'Entrou 3 vezes no top', 'O pico foi #3'],
          'As marcas mostram em que semanas do mês a ouviste.']
      },
      tips: [
        'Clica em qualquer dia da faixa de plays por dia de um mês para abrires esse dia.',
        'Por baixo de um top mensal, {{t:ne_filter_chart}} mostra só as músicas novas que entraram.',
        'Os tops anuais têm caixa de pesquisa: escreve um nome para o encontrares no teu Top 100.'
      ]
    },

    alltime: {
      title: 'De Sempre e viagens no tempo',
      promise: 'As tuas músicas mais ouvidas de sempre, de que é feito o teu top e como estava em qualquer dia do passado.',
      scenes: {
        top: { title: 'Topo da página', spots: {
          alltime: ['{{t:nav_alltime}}', 'Todos os teus plays, contados uma vez. A tecla A leva-te lá.'],
          label: ['Até quando', 'Clica para escolheres uma data e veres o top como estava nesse dia.'],
          prev: ['Um mês atrás', 'Mostra o top como era um mês antes. Carrega outra vez para continuares a recuar.'],
          banner: ['O teu #1 de sempre', 'O artista que mais ouviste, desde sempre.'],
          tiles: ['Quatro números', 'Todos os teus plays, músicas, artistas e álbuns.'],
          total: ['Dias e plays por dia', 'Quantos dias ouviste música, e os teus plays por dia em média.'],
          years: ['Plays por ano', 'Cada ano e os seus plays. Clica num para abrires esse ano.'],
          best: ['Melhor ano', 'O quadrado dourado é o teu maior ano.'],
          share: ['Partilhar', 'Guarda estes números como imagem.']
        } },
        chart: { title: 'O top de sempre', spots: {
          tip: ['Uma dica', 'Dá um tamanho ao top e vê de que é feito.'],
          size: ['{{t:ati_hint_btn}}', 'Põe o top em Top 100 e abre as estatísticas.'],
          hide: ['Esconder a dica', 'Não volta a aparecer.'],
          title: ['O top inteiro', 'O De Sempre começa com todas as músicas que ouviste. ⋮ → Tamanho deixa-o em 50, 100 ou 200.'],
          search: ['Procurar', 'Encontra qualquer música ou artista no top.'],
          heads: ['Colunas', 'Aqui não há movimento: o De Sempre é um só top, por isso não há com que comparar.'],
          menu: ['Opções do top (⋮)', 'Mostrar, Tamanho e Ações.']
        } },
        ati: { title: 'Dentro do teu Top 100', spots: {
          head: ['Dentro do teu Top N', 'De que é feito o teu top. Segue o tamanho que escolheres.'],
          toggle: ['{{t:ati_more}} / {{t:ati_less}}', 'Abre ou recolhe todas as estatísticas.'],
          hero: ['Um facto', 'Algo que vale a pena saber sobre o teu top.'],
          fact: ['{{t:ati_another}}', 'Mostra o facto seguinte.'],
          tiles: ['Quatro números', 'Quantos artistas, quanto ocupam os teus 3 primeiros, a parte de todos os teus plays e quantas são novas desde o ano passado.'],
          tile: ['Um número', 'Clica para veres o que está por trás.'],
          tabs: ['Cinco vistas', '{{t:ati_tab_artists}}, {{t:ati_tab_eras}}, {{t:ati_tab_plays}}, {{t:ati_tab_badges}} e {{t:ati_tab_new}}.'],
          panel: ['A vista', 'Aqui: quem tem mais músicas no top e os álbuns com mais músicas. Escolhe um nome para veres as músicas.']
        } },
        pages: { title: 'O fim de um top longo', spots: {
          pages: ['Páginas', 'Um top longo vem de 100 em 100.'],
          label: ['Onde estás', 'Que entradas estão à vista, de quantas.'],
          input: ['Ir para uma página', 'Escreve o número da página e carrega em Enter.'],
          next: ['Página seguinte', 'As 100 seguintes.'],
          last: ['Última página', 'Diretamente para o fim.'],
          export: ['Exportar', 'O top como TXT, CSV ou PDF para imprimir.']
        } },
        travel: { title: 'Viagem no tempo', spots: {
          label: ['Até esse dia', 'O top conta agora todos os plays até esta data, e nada depois.'],
          prev: ['Mais para trás', 'Mais um mês para trás.'],
          next: ['Para a frente', 'Um mês para a frente, até voltares a hoje.'],
          banner: ['O teu #1 nessa altura', 'Quem liderava o teu top de sempre nesse dia.'],
          tiles: ['Os números nessa altura', 'Os teus totais como eram nesse dia.']
        } }
      },
      howto: {
        size: { title: 'Ver de que é feito o teu top', slides: [
          'No De Sempre, uma dica oferece-se para olhar para dentro do teu top.',
          'Carrega em {{t:ati_hint_btn}}.',
          'As estatísticas ficam por cima do top e seguem o tamanho que escolheres.'
        ] },
        facts: { title: 'Explorar as estatísticas', slides: [
          '{{t:ati_another}} mostra o facto seguinte sobre o teu top.',
          'Clica num número para veres o que está por trás.',
          'Cinco vistas: {{t:ati_tab_artists}}, {{t:ati_tab_eras}}, {{t:ati_tab_plays}}, {{t:ati_tab_badges}} e {{t:ati_tab_new}}.',
          '{{t:ati_less}} recolhe tudo.'
        ] },
        travel: { title: 'Viajar no tempo', slides: [
          'No De Sempre, carrega em ‹.',
          'O top conta agora todos os plays até há um mês.',
          'Todos os números recuam também.',
          'Carrega em › para voltares para a frente, ou clica na data para escolheres qualquer dia.'
        ] },
        find: { title: 'Encontrar uma música', slides: [
          'Escreve na caixa de pesquisa por cima do top.',
          'Ou salta para uma página lá em baixo.'
        ] },
        export: { title: 'Levar o teu top contigo', slides: [
          'Lá em baixo: TXT, CSV ou um PDF para imprimir do top inteiro.'
        ] }
      },
      options: {
        size: { title: '⋮ → Tamanho', items: {
          sizes: ['Tamanhos do De Sempre', 'Top 50, 100, 200 ou todas as músicas (o que tens ao começar).']
        } },
        atitabs: { title: 'Dentro do teu Top N', items: {
          artists: ['{{t:ati_tab_artists}}', 'Quem tem mais músicas, os álbuns com mais músicas, quem manda no top 10.'],
          eras: ['{{t:ati_tab_eras}}', 'De que anos e décadas são as músicas.'],
          plays: ['{{t:ati_tab_plays}}', 'Como os plays se espalham pelo top, e a rapidez com que as músicas entraram.'],
          badges: ['{{t:ati_tab_badges}}', 'As certificações no top e as próximas placas.'],
          newyear: ['{{t:ati_tab_new}}', 'O que entrou no top no último ano.']
        } },
        export: { title: 'Exportar', items: {
          txt: ['TXT', 'Uma lista simples.'],
          csv: ['CSV', 'Para uma folha de cálculo.'],
          pdf: ['PDF', 'Preparado para imprimir.']
        } }
      },
      challenges: {
        'at.size': ['Olha para dentro do teu Top 100', '{{t:ati_hint_btn}}, ou ⋮ → Tamanho.'],
        'at.fact': ['Vê outro facto', '{{t:ati_another}}.'],
        'at.stats': ['Abre todas as estatísticas', '{{t:ati_more}}.'],
        'at.travel': ['Recua um mês no tempo', 'Carrega em ‹ no De Sempre.'],
        'at.search': ['Procura no teu top de sempre', 'A caixa por cima do top.'],
        'at.export': ['Exporta o top', 'TXT, CSV ou PDF lá em baixo.']
      },
      quiz: {
        q1: ['O que faz ‹ no De Sempre?',
          ['Mostra o top como estava um mês antes', 'Vai para o top do ano passado', 'Nada'],
          'O De Sempre conta todos os plays até à data mostrada. ‹ recua essa data um mês.'],
        q2: ['Porque não há setas de movimento no De Sempre?',
          ['É um só top com todos os plays, por isso não há um anterior para comparar', 'Estão desligadas', 'Só aparecem no telemóvel'],
          'O movimento compara um período com o anterior. O De Sempre não tem “anterior”.'],
        q3: ['Onde vês quem tem mais músicas no teu Top 100?',
          ['Dentro do teu Top 100 → {{t:ati_tab_artists}}', 'Definições', 'O Fórum'],
          'Põe o De Sempre em Top 100 e as estatísticas por cima do top mostram isso.']
      },
      tips: [
        'No De Sempre, ‹ mostra o teu top como estava há um mês. Continua a recuar para o veres crescer.',
        'Dentro do teu Top 100 tem doze factos. Carrega em {{t:ati_another}} para os veres todos.',
        'O De Sempre tem caixa de pesquisa: encontra qualquer música que já ouviste e a sua posição de sempre.'
      ]
    },

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
