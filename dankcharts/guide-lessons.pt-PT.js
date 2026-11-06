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

    around: {
      title: 'À volta do top, e partilhá-lo',
      promise: 'O que ficou quase lá, o que saiu, o que é novo e todas as formas de levar um top para fora da app.',
      scenes: {
        bu: { title: '{{t:atc_tab_bu}}', spots: {
          bar: ['{{t:atc_title}}', 'Um bloco por baixo do top com três separadores. Aparece no Diário e no Semanal (o Mensal e o Anual mostram só as novas entradas).'],
          tbu: ['{{t:atc_tab_bu}}', 'As músicas logo abaixo do corte: as posições seguintes ao tamanho do teu top.'],
          toff: ['{{t:sec_off_chart}}', 'O que estava da última vez e já não está.'],
          tnew: ['{{t:atc_tab_new}}', 'Tudo o que é novo desta vez, numa lista.'],
          fold: ['Recolher', 'Esconde o bloco e mantém o título.'],
          sub: ['Como é ordenado', 'Por plays, como o próprio top. Esta linha e a seguinte aparecem com ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_desc}}.'],
          meter: ['Distância', 'Quantos plays tem a última posição do top, por isso a distância é quantos faltavam a cada uma.'],
          info: ['{{t:bu_legend_btn}}', 'Abre a explicação de cada tag. Aparece quando ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_bu_legend}} está ligado.'],
          rank: ['A posição', 'Onde estaria se o top fosse mais longo.'],
          badge: ['Tags', 'Uma ou duas palavras sobre a história dela, como {{t:bu_badge_resurgence}} ou {{t:bu_badge_debut}}.'],
          weeks: ['Semanas aqui', 'Quantas semanas passou nos Aspirantes no total.'],
          away: ['Plays e distância', 'Os plays dela, e quantos faltavam para entrar no top.'],
          row: ['Uma linha', 'Clica para abrir o percurso e os botões, como no top.']
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
          toff: ['{{t:sec_off_chart}}', 'Cada entrada que estava no top da última vez e saiu.'],
          was: ['Estava', 'Onde estava no top anterior.'],
          exit: ['Como saiu', 'Caiu do top 3, ficou logo abaixo, uma sequência longa acabou, ou simplesmente saiu.'],
          peak: ['O pico', 'O mais alto que chegou.'],
          where: ['Onde está agora', 'Se agora está nos Aspirantes (e quão perto está de voltar), ou quando a ouviste pela última vez.'],
          stats: ['Antes e depois', 'Os plays da última vez e desta, e as semanas no top.'],
          streak: ['A sequência', 'Quantas semanas seguidas esteve antes de sair.'],
          row: ['Uma linha', 'Clica para abrir o percurso.']
        } },
        new: { title: '{{t:atc_tab_new}}', spots: {
          tnew: ['{{t:atc_tab_new}}', 'Todas as músicas novas desta vez, tenham entrado no top ou não.'],
          chips: ['Filtros', '{{t:ne_filter_all}}, {{t:ne_filter_chart}} ou {{t:ne_filter_new_artists}}.'],
          debut: ['Estreia', 'A posição em que entrou no top.'],
          caps: ['Quando a ouviste', 'Uma marca por dia da semana (por semana no Mensal). Quanto mais forte, mais plays.'],
          row: ['Uma linha', 'Clica para abrir a janela dela.']
        } },
        share: { title: '{{t:ig_share_title}}', spots: {
          preview: ['Pré-visualização', 'Exatamente a imagem que vais ter. Muda à medida que escolhes.'],
          tpl: ['{{t:sh_design}}', 'Cinco estilos: Editorial, Minimal, Spotlight, Grid e Poster.'],
          swatch: ['{{t:sh_palette}}', 'Cores: o tema da app, uma paleta fixa, ou Cover, que vai buscar as cores à capa da tua #1.'],
          format: ['{{t:ig_format}}', '{{t:sh_fmt_post}} para o feed, {{t:sh_fmt_portrait}}, ou {{t:sh_fmt_story}} para histórias.'],
          src: ['De onde vêm as capas', 'Deezer, iTunes, Last.fm ou YouTube.'],
          pick: ['Escolher uma imagem', 'Clica numa entrada para escolheres outra imagem.'],
          toggles: ['{{t:ig_show_hide}}', 'Movimento, pico, semanas no top, plays, artista, a data e o rodapé. Desmarca o que não quiseres.'],
          entries: ['{{t:sh_entries}}', 'Quantas entradas tem a imagem. {{t:sh_entries_hint}}.'],
          text: ['{{t:sh_text_size}}', 'Texto maior ou mais pequeno.'],
          quality: ['{{t:sh_quality}}', '{{t:sh_quality_std}} ou {{t:sh_quality_high}}, com o tamanho em píxeis.'],
          copy: ['{{t:sh_copy}}', 'Copia a imagem, pronta a colar numa mensagem ou publicação.'],
          download: ['{{t:btn_download_image}}', 'Guarda-a como PNG.']
        } },
        pdf: { title: 'PDF para imprimir', spots: {
          scope: ['Este top', 'Só o top em que estás.'],
          all: ['{{t:pdf_all_charts}}', 'Músicas, artistas e álbuns num só PDF.'],
          cover: ['{{t:pdf_opt_art}}', 'Capas ao lado de cada entrada, ou uma lista simples.'],
          bu: ['{{t:pdf_opt_bu}}', 'Acrescenta os Aspirantes no fim.'],
          create: ['{{t:pdf_create}}', 'Abre a janela de impressão. Escolhe “Guardar como PDF” como impressora para teres o ficheiro.']
        } },
        export: { title: 'Exportar playlist', spots: {
          names: ['{{t:export_step_name}}', 'Nomes prontos para a playlist. Clica num para o copiares.'],
          order: ['{{t:export_order_first}} / {{t:export_order_last}}', 'Por que ordem vai a lista.'],
          album: ['{{t:export_include_album}}', 'Acrescenta o álbum de cada música.'],
          list: ['As músicas', 'O que vai ser copiado, por ordem.'],
          copy: ['{{t:export_copy_list}}', 'Copia a lista como “Artista - Título”, uma música por linha.'],
          txt: ['.txt', 'Transfere-a como ficheiro de texto.'],
          csv: ['.csv', 'Transfere-a para uma folha de cálculo.'],
          services: ['{{t:export_step_import}}', 'O Soundiiz transforma a lista numa playlist a sério no Spotify, Apple Music, YouTube Music, Deezer ou Tidal.'],
          open: ['{{t:export_open_soundiiz}}', 'Abre o Soundiiz noutro separador. Os passos acima dizem onde colar.']
        } }
      },
      howto: {
        bu: { title: 'Ver o que ficou quase lá', slides: [
          'Por baixo do top, abre {{t:atc_tab_bu}}.',
          'Cada música mostra quantos plays faltavam.',
          'Liga ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_bu_legend}} e carrega em {{t:bu_legend_btn}} para veres a explicação.',
          'Cada tag conta a história de uma música, como {{t:bu_badge_debut}}: a primeira vez dela aqui.'
        ] },
        off: { title: 'Ver o que saiu', slides: [
          'Abre {{t:sec_off_chart}}.',
          'Cada uma diz como saiu.',
          'E se está perto de voltar.'
        ] },
        hide: { title: 'Escolher que listas aparecem', slides: [
          'Em ⋮ → Mostrar → Secções, liga ou desliga Aspirantes, Fora do Top e Novas Entradas.',
          'Ou recolhe o bloco com a seta, para ficar só o título.'
        ] },
        share: { title: 'Partilhar o teu top como imagem', slides: [
          'Em ⋮ → Ações, escolhe Partilhar como imagem.',
          'Escolhe um design.',
          'Escolhe as cores.',
          'Escolhe o formato: publicação, retrato ou história.',
          'Por exemplo Poster, como história.',
          'Desmarca o que não quiseres na imagem.',
          'Depois copia-a ou transfere-a.'
        ] },
        pdf: { title: 'Imprimir o top', slides: [
          'Em ⋮ → Ações, escolhe PDF para imprimir.',
          'Só este top, ou os três.',
          'Carrega em {{t:pdf_create}} e escolhe “Guardar como PDF” como impressora.'
        ] },
        export: { title: 'Criar uma playlist no Spotify (ou onde quiseres)', slides: [
          'Em ⋮ → Ações, escolhe Exportar playlist.',
          'Clica num nome para o copiares.',
          'Copia a lista de músicas.',
          'O Soundiiz transforma-a numa playlist no serviço que usas.',
          'Abre o Soundiiz e cola onde os passos dizem.'
        ] },
        play: { title: 'Ouvir o top inteiro', slides: [
          'Em ⋮ → Ações, {{t:btn_play_all}} toca o top por ordem.',
          '{{t:btn_shuffle_all}} toca-o por ordem aleatória.'
        ] }
      },
      options: {
        tabs: { title: '{{t:atc_title}}', items: {
          bu: ['{{t:atc_tab_bu}}', 'Logo abaixo do corte. Diário e Semanal.'],
          off: ['{{t:sec_off_chart}}', 'Saíram desde a última vez. Diário e Semanal.'],
          new: ['{{t:atc_tab_new}}', 'Tudo o que é novo. Todos os períodos menos o De Sempre.']
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
          pal: ['{{t:sh_palette}}', 'O tema da app, seis paletas fixas, ou Cover.'],
          fmt: ['{{t:ig_format}}', '{{t:sh_fmt_post}}, {{t:sh_fmt_portrait}} ou {{t:sh_fmt_story}}.'],
          art: ['{{t:ig_album_art}}', 'Com ou sem capas, e de onde vêm.'],
          pick: ['Imagens', 'Escolhe outra imagem para qualquer entrada.'],
          show: ['{{t:ig_show_hide}}', 'Movimento, pico, semanas, plays, artista, data e rodapé.'],
          entries: ['{{t:sh_entries}}', '{{t:sh_entries_hint}}.'],
          text: ['{{t:sh_text_size}}', 'De 80% a 130%.'],
          quality: ['{{t:sh_quality}}', '{{t:sh_quality_std}} ou {{t:sh_quality_high}}.']
        } },
        pdf: { title: 'PDF para imprimir', items: {
          scope: ['Este top / {{t:pdf_all_charts}}', 'Um top ou os três.'],
          cover: ['{{t:pdf_opt_art}}', 'Capas ao lado de cada entrada.'],
          bu: ['{{t:pdf_opt_bu}}', 'Acrescenta os Aspirantes no fim.']
        } },
        export: { title: 'Exportar playlist', items: {
          names: ['{{t:export_step_name}}', 'Nomes de playlist prontos.'],
          order: ['{{t:export_order_first}} / {{t:export_order_last}}', 'Por que ordem.'],
          album: ['{{t:export_include_album}}', 'Acrescenta o álbum a cada linha.'],
          copy: ['{{t:export_copy_list}}', 'Artista - Título, uma por linha.'],
          files: ['.txt / .csv', 'Transfere a lista como ficheiro.'],
          soundiiz: ['{{t:export_open_soundiiz}}', 'Cria a playlist noutro serviço.']
        } }
      },
      challenges: {
        'around.tab': ['Abre outro separador por baixo do top', '{{t:sec_off_chart}} ou {{t:atc_tab_new}}.'],
        'around.legend': ['Abre {{t:bu_legend_btn}}', 'Antes liga ⋮ → {{t:kebab_tab_show}} → {{t:btn_display_bu_legend}}.'],
        'around.share': ['Abre Partilhar como imagem', '⋮ → Ações.'],
        'around.design': ['Experimenta outro design para a imagem', 'Na janela de partilhar.'],
        'around.pdf': ['Abre PDF para imprimir', '⋮ → Ações.'],
        'around.export': ['Abre Exportar playlist', '⋮ → Ações.'],
        'around.copy': ['Copia um nome de playlist ou a lista', 'Na janela de exportar.'],
        'around.play': ['Ouve um top inteiro', '⋮ → Ações → {{t:btn_play_all}}.']
      },
      quiz: {
        q1: ['Uma música nos Aspirantes está a 1 play de distância. O que quer dizer?',
          ['Com mais um play teria entrado no top', 'Ouviste-a uma vez', 'É a #1 dos Aspirantes'],
          'A distância é quantos plays faltavam para chegar à última posição do top.'],
        q2: ['Onde encontras as músicas que estavam no top da semana passada mas não estão neste?',
          ['{{t:sec_off_chart}}', '{{t:atc_tab_new}}', 'De Sempre'],
          '{{t:sec_off_chart}} reúne cada saída, como saiu e se está perto de voltar.'],
        q3: ['Queres que a imagem do teu top ocupe o ecrã do telemóvel numa história. O que mudas?',
          ['{{t:ig_format}} → {{t:sh_fmt_story}}', '{{t:sh_palette}}', '{{t:sh_text_size}}'],
          'O formato define a forma: 1:1 para publicação, 4:5 retrato, 9:16 para histórias.']
      },
      tips: [
        'Nos Aspirantes, {{t:bu_legend_btn}} explica cada tag, de {{t:bu_badge_debut}} a {{t:bu_badge_fallen}}.',
        'A janela de partilhar tem cinco designs. Poster como história 9:16 fica ótimo no telemóvel.',
        'Exportar playlist mais o Soundiiz transformam qualquer top numa playlist a sério no Spotify, Apple Music e mais.'
      ]
    },
    windows: {
      title: 'Janelas de música, artista e álbum',
      promise: 'Tudo sobre uma música, um artista ou um álbum, como encontrar qualquer um num segundo, e as tuas sequências.',
      scenes: {
        song: { title: 'A janela de uma música', spots: {
          art: ['Capa', 'A capa dela. Passa o rato por cima para veres o ✎ e escolheres outra imagem (no telemóvel, mantém premido).'],
          title: ['A música', 'O nome dela.'],
          sub: ['Artista e álbum', 'Clica em qualquer um para abrir a janela dele.'],
          sample: ['{{t:ea_s_sample}}', 'Toca 30 segundos.'],
          playlist: ['{{t:dp_playlist}}', 'Acrescenta-a a uma das tuas playlists.'],
          rate: ['{{t:dp_rate}}', 'Dá-lhe uma nota de 0 a 10.'],
          more: ['{{t:ea_more}}', 'Tudo o resto: o vídeo, o álbum, o artista, o percurso, trocar a imagem, procurar no YouTube ou no Spotify.'],
          links: ['Spotify, YouTube, Last.fm', 'Procura-a em cada um deles.'],
          share: ['{{t:st_am_share}}', 'Um cartão com imagem desta música para partilhar.'],
          tabs: ['Separadores', '{{t:dp_tab_overview}}, {{t:dp_tab_charts}} e {{t:dp_tab_listening}}.'],
          close: ['Fechar', 'Esc faz o mesmo.'],
          hero: ['Plays totais', 'Todos os plays, a parte dela nos plays do artista, a certificação e a posição de sempre.'],
          span: ['Primeiro e último play', 'Quando a ouviste pela primeira e pela última vez, e em quantos dias pelo meio.'],
          trio: ['Três números', 'Dias ouvida, plays por dia nesses dias e plays até à próxima certificação.'],
          favs: ['Onde mora', 'O álbum e o artista dela, e a posição em cada um. Clica para os abrires.'],
          habits: ['{{t:ao_habits}}', 'A maior sequência de dias, o maior dia, a maior sequência de plays seguidos, a maior pausa e os regressos.'],
          rating: ['A minha nota', 'A tua nota, e uma ligação para avaliares o álbum inteiro.'],
          trophies: ['Conquistas nos tops', 'Cada selo que ganhou: semanas em #1, sequências no top 10, a estreia, a certificação. Toca num para veres o que o valeu.']
        } },
        songcharts: { title: '{{t:dp_tab_charts}}', spots: {
          rktop: ['Picos', 'A melhor posição nos tops Diário, Semanal, Mensal e Anual.'],
          rkhero: ['O pico', 'A melhor posição no top semanal e quando lá chegou.'],
          plot: ['Posição ao longo do tempo', 'A posição semana a semana. Passa pela linha (ou toca nela) para veres cada semana.'],
          detail: ['A semana que apontas', 'A posição, o movimento e os plays dessa semana.'],
          moments: ['Momentos', 'A estreia, a maior sequência em #1 e outros momentos.'],
          fam: ['Face ao álbum e ao artista', 'Como se saiu ao lado das outras músicas do álbum e do artista.'],
          hof: ['Recordes do Hall da Fama', 'Cada recorde que tem em Recordes.'],
          run: ['O percurso', 'O mesmo que por baixo de uma linha do top.']
        } },
        songlisten: { title: '{{t:dp_tab_listening}}', spots: {
          lshero: ['Em rotação', 'Se ainda a ouves, há quanto tempo, e o maior mês dela.'],
          spark: ['Plays por mês', 'Cada mês em que a ouviste. A coroa marca o melhor mês.'],
          found: ['O dia em que a encontraste', 'O que ouvias perto da primeira vez que a ouviste.'],
          along: ['Ouvida junto com', 'Músicas que tocaste até 30 minutos dela, as mais frequentes.'],
          clock: ['Quando a ouves', 'A hora do dia em que mais a tocas.'],
          seasons: ['Estações', 'Em que estações a ouves.'],
          miles: ['Marcas', 'Quando chegou ao primeiro play, ao 100, ao 200…'],
          next: ['A seguir', 'A próxima marca, quanto falta e mais ou menos quando lá chegas.'],
          heat: ['Cada dia em que a ouviste', 'Um calendário de cada dia em que tocou.'],
          more: ['Mais', 'Recordes de sequência e todo o histórico de plays.']
        } },
        artist: { title: 'A janela de um artista', spots: {
          tabs: ['Seis separadores', '{{t:dp_tab_overview}}, {{t:dp_tab_music}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}, {{t:dp_tab_rating}} e {{t:dp_tab_awards}}.'],
          hero: ['Plays totais', 'Todos os plays dele, a parte nos teus e a posição entre os teus artistas.'],
          favs: ['Favoritos', 'A música, o álbum e mais que mais ouves dele.'],
          habits: ['{{t:ao_habits}}', 'Dias ouvido, maior sequência, maior dia e mais.'],
          slam: ['Grand Slam', 'Aparece quando foi #1 nos tops Semanal, Mensal e Anual.'],
          trophies: ['Conquistas nos tops', 'Cada selo que ganhou.'],
          rating: ['As minhas notas', 'A tua nota média para o que avaliaste dele.']
        } },
        music: { title: '{{t:dp_tab_music}}', spots: {
          top: ['Músicas e álbuns', 'Alterna entre as músicas e os álbuns dele.'],
          intro: ['O que aparece', 'Tudo dele que entrou nos teus tops.'],
          charts: ['Que top', 'De sempre, ou só o que entrou no Anual, Mensal, Semanal ou Diário.'],
          sum: ['Totais', 'Quantas, quantas chegaram ao #1 e ao top 10, e os plays.'],
          tools: ['Ordenar', '{{t:am_sort_rank}}, {{t:am_sort_plays}}, {{t:am_sort_recent}}, {{t:am_sort_az}}.'],
          list: ['A lista', 'Cada uma com posição, certificação, primeiro e último play. Abre uma para veres os detalhes.']
        } },
        awards: { title: '{{t:dp_tab_awards}}', spots: {
          sw: ['Dois lados', 'Os teus próprios prémios (My Grammies) ou galas de prémios reais.'],
          real: ['Vida real', 'As nomeações e vitórias dele em galas reais, e como os teus votos se comparam.']
        } },
        album: { title: 'A janela de um álbum', spots: {
          hero: ['Plays totais', 'Todos os plays, a parte nos plays do artista, a certificação e a posição.'],
          favs: ['As músicas', 'As músicas mais ouvidas dele.'],
          habits: ['{{t:ao_habits}}', 'Os mesmos hábitos de uma música, para o álbum inteiro.'],
          rating: ['A minha avaliação', 'Dá nota a cada faixa e fica com a nota global do álbum.'],
          trophies: ['Conquistas nos tops', 'Cada selo que o álbum ganhou.'],
          plaques: ['Placas de certificação', 'As placas de Ouro, Platina ou Diamante.']
        } },
        menus: { title: 'O menu ⋮', spots: {
          more: ['⋮ numa linha', 'Cada linha do top tem um. Clica com o botão direito numa linha para o mesmo menu.'],
          menu: ['O menu', 'Um excerto, o vídeo, acrescentar a uma playlist, detalhes, o álbum e o artista, o percurso, trocar a imagem, procurar no YouTube ou no Spotify.'],
          change: ['{{t:img_picker_change}}', 'Abre o seletor de capa desta entrada.']
        } },
        cover: { title: '{{t:img_picker_change}}', spots: {
          now: ['A imagem atual', 'A capa que tem neste momento.'],
          title: ['O que estás a mudar', 'A música, o álbum ou o artista desta imagem.'],
          deezer: ['Deezer', 'Imagens encontradas no Deezer.'],
          current: ['A que está em uso', 'A imagem destacada é a que aparece agora.'],
          itunes: ['iTunes', 'Imagens encontradas no iTunes, muitas vezes várias versões e capas de singles.'],
          tile: ['Escolhe uma', 'Clica em qualquer imagem para a usares. O seletor fecha e a nova capa aparece logo.'],
          lastfm: ['Last.fm', 'A imagem que o Last.fm tem.'],
          youtube: ['YouTube', 'Uma imagem do vídeo.'],
          url: ['{{t:imgpk_url_label}}', 'Cola a ligação de qualquer imagem da internet…'],
          set: ['{{t:imgpk_apply}}', '…e carrega aqui para a usares.'],
          none: ['{{t:imgpk_none}}', 'Não mostra imagem, só um quadrado liso.'],
          auto: ['{{t:imgpk_auto}}', 'Volta à imagem que a app escolhe sozinha.'],
          close: ['Fechar', 'Deixa a capa como estava.']
        } },
        search: { title: 'Pesquisa', spots: {
          field: ['Escreve um nome', 'Qualquer parte do nome de um artista, música ou álbum. Carrega em / ou Ctrl+K em qualquer lado para a abrires.'],
          esc: ['Fechar', 'Esc fecha-a.'],
          group: ['Agrupado', 'Primeiro artistas, depois músicas, depois álbuns.'],
          top: ['Um resultado', 'Escolhe um para abrires a janela. ↑ ↓ e Enter também funcionam.'],
          n: ['Plays', 'Quantas vezes o ouviste.'],
          songs: ['Músicas', 'Músicas que coincidem com o que escreveste, com os artistas.'],
          foot: ['Teclas', '↑ ↓ para mover, Enter para abrir, Esc para fechar.']
        } },
        hist: { title: 'Histórico de pesquisa', spots: {
          chips: ['Pesquisas recentes', 'O que escreveste há pouco. Clica numa para pesquisares outra vez.'],
          chip: ['Uma pesquisa', 'Repete-a.'],
          item: ['Abertos recentemente', 'O que abriste a partir da pesquisa.'],
          rm: ['Remover', 'Tira um da lista.'],
          clear: ['Limpar histórico', 'Esvazia as duas listas.']
        } },
        streak: { title: '{{t:streak_modal_title}}', spots: {
          today: ['{{t:sk_tab_today}}', 'As sequências que manténs se ouvires hoje, e o que perdeste ontem.'],
          fire: ['{{t:sk_tab_fire}}', 'Todas as sequências a decorrer: artistas, álbuns e músicas que ouviste dias seguidos.'],
          recs: ['{{t:sk_tab_records}}', 'As tuas maiores sequências de sempre, os teus selos e as sequências que acabaram.'],
          cal: ['{{t:sk_tab_calendar}}', 'Um calendário das tuas sequências.'],
          fame: ['Hall da Fama', 'As tuas 5 maiores sequências de artistas, álbuns e músicas.'],
          badges: ['Selos', 'Ganham-se com sequências: uma muito longa, muitas ao mesmo tempo, muitas diferentes. Toca num selo ganho para o virares: a data e a música que o valeu.']
        } },
        streakcal: { title: '{{t:sk_tab_calendar}}', spots: {
          cal: ['{{t:sk_tab_calendar}}', 'As tuas sequências, dia a dia.'],
          filters: ['Filtros', 'Tudo, artistas, músicas ou álbuns, e que ano.'],
          wrap: ['O calendário', 'Cada dia colorido conforme o que estava em sequência. Escolhe um dia para veres o quê.']
        } }
      },
      howto: {
        open: { title: 'Abrir tudo sobre uma música', slides: [
          'Clica no título de uma música em qualquer lado: um top, um recorde, uma pesquisa.',
          'A janela dela tem três separadores.',
          'Salta daqui para o álbum ou para o artista.',
          'Fecha-a, ou carrega em Esc.'
        ] },
        find: { title: 'Encontrar qualquer coisa num segundo', slides: [
          'Carrega em / ou Ctrl+K em qualquer página e escreve.',
          'Escolhe um resultado para abrires a janela.',
          'Ou usa ↑ ↓ e Enter.',
          'Da próxima vez, o que abriste está aqui à tua espera.'
        ] },
        history: { title: 'Ver a história toda de uma música', slides: [
          'Em {{t:dp_tab_charts}}: a posição semana a semana.',
          'Os grandes momentos, como a estreia e a sequência em #1.',
          'Em {{t:dp_tab_listening}}: o dia em que a encontraste.',
          'E quando chegou a cada marca.'
        ] },
        artist: { title: 'Explorar um artista', slides: [
          'Um artista tem seis separadores.',
          '{{t:dp_tab_music}} lista as músicas e os álbuns, pela ordem que quiseres.',
          '{{t:dp_tab_awards}} mostra os teus prémios e os da vida real.'
        ] },
        cover: { title: 'Mudar uma capa', slides: [
          'Passa o rato por cima de uma capa: aparece um ✎ no canto. Clica nele. No telemóvel, mantém a capa premida.',
          'Ou abre o ⋮ da linha e escolhe {{t:img_picker_change}}. As janelas têm o mesmo ✎ na capa grande.',
          'O seletor mostra imagens do Deezer, iTunes, Last.fm e YouTube. A destacada é a que está em uso.',
          'Clica na que quiseres.',
          'Ou cola a ligação de qualquer imagem e carrega em {{t:imgpk_apply}}.',
          '{{t:imgpk_auto}} volta à escolha da app; {{t:imgpk_none}} não mostra imagem.',
          'A nova capa aparece em todo o lado ao mesmo tempo: cada top, a janela, as imagens para partilhar e os prémios. Com sessão iniciada, vai contigo para todos os dispositivos.'
        ] },
        menu: { title: 'Usar o menu ⋮', slides: [
          'Cada linha tem um ⋮ (ou clica com o botão direito na linha).',
          'Tem um excerto, o vídeo, playlists, detalhes e mais.',
          'As janelas têm o mesmo menu.'
        ] },
        streak: { title: 'Manter as tuas sequências', slides: [
          'A tua sequência de escuta fica no topo da página Charts. Clica nela.',
          '{{t:sk_tab_records}}: as tuas maiores sequências de sempre.',
          'E selos para colecionar.',
          '{{t:sk_tab_calendar}} mostra-as dia a dia.'
        ] }
      },
      options: {
        tabs: { title: 'Separadores das janelas', items: {
          song: ['Uma música', '{{t:dp_tab_overview}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}.'],
          artist: ['Um artista', '{{t:dp_tab_overview}}, {{t:dp_tab_music}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}, {{t:dp_tab_rating}}, {{t:dp_tab_awards}}.'],
          album: ['Um álbum', '{{t:dp_tab_overview}}, {{t:dp_tab_charts}}, {{t:dp_tab_listening}}, {{t:dp_tab_rating}}.']
        } },
        buttons: { title: 'Botões das janelas', items: {
          sample: ['{{t:ea_s_sample}}', '30 segundos.'],
          playlist: ['{{t:dp_playlist}}', 'Acrescentar a uma playlist.'],
          rate: ['{{t:dp_rate}}', 'Músicas e álbuns.'],
          share: ['{{t:st_am_share}}', 'Um cartão com imagem.'],
          more: ['{{t:ea_more}}', 'O menu ⋮.'],
          links: ['Spotify / YouTube / Last.fm', 'Encontrá-la noutro lado.']
        } },
        cover: { title: '{{t:img_picker_change}}', items: {
          open: ['Abrir o seletor', 'O ✎ numa capa, manter premido no telemóvel, ou ⋮ → {{t:img_picker_change}}.'],
          sources: ['Deezer, iTunes, Last.fm, YouTube', 'Imagens encontradas em cada um.'],
          link: ['{{t:imgpk_url_label}}', 'Qualquer imagem da internet, pela ligação.'],
          none: ['{{t:imgpk_none}}', 'Um quadrado liso, sem imagem.'],
          auto: ['{{t:imgpk_auto}}', 'A app escolhe a imagem sozinha.']
        } },
        music: { title: '{{t:dp_tab_music}}', items: {
          sorts: ['Ordenar', '{{t:am_sort_rank}} (o que tens ao começar), {{t:am_sort_plays}}, {{t:am_sort_recent}}, {{t:am_sort_az}}.'],
          charts: ['Que top', 'De sempre, Anual, Mensal, Semanal ou Diário.']
        } },
        streaktabs: { title: '{{t:streak_modal_title}}', items: {
          today: ['{{t:sk_tab_today}}', 'Mantém-nas vivas hoje.'],
          fire: ['{{t:sk_tab_fire}}', 'A decorrer agora.'],
          recs: ['{{t:sk_tab_records}}', 'As maiores, selos, terminadas.'],
          cal: ['{{t:sk_tab_calendar}}', 'Dia a dia.']
        } }
      },
      challenges: {
        'win.song': ['Abre a janela de uma música', 'Clica no título de uma música.'],
        'win.artist': ['Abre a janela de um artista', 'Clica no nome de um artista.'],
        'win.album': ['Abre a janela de um álbum', 'Clica no nome de um álbum.'],
        'win.tab': ['Muda de separador numa janela', '{{t:dp_tab_charts}} ou {{t:dp_tab_listening}}.'],
        'win.search': ['Pesquisa na tua biblioteca', 'Carrega em / ou na pesquisa da barra superior.'],
        'win.menu': ['Abre um menu ⋮', 'Numa linha, ou com o botão direito.'],
        'win.cover': ['Muda uma capa', 'O ✎ numa capa, ou ⋮ → {{t:img_picker_change}}.'],
        'win.streak': ['Abre as tuas sequências', 'A sequência de escuta no topo da página Charts.']
      },
      quiz: {
        q1: ['Como abres a pesquisa pelo teclado?',
          ['Carrega em / ou Ctrl+K', 'Carrega em S', 'Carrega em Enter'],
          '/ ou Ctrl+K abrem-na a partir de qualquer página.'],
        q2: ['Onde vês a posição de uma música semana a semana?',
          ['No separador {{t:dp_tab_charts}} da janela dela', 'No separador {{t:dp_tab_listening}}', 'Definições'],
          '{{t:dp_tab_charts}} tem a posição ao longo do tempo; passa pela linha para veres cada semana.'],
        q3: ['O que conta uma sequência?',
          ['Dias seguidos em que a ouviste', 'Os plays totais', 'As semanas no top'],
          'Uma sequência são dias seguidos com pelo menos um play.']
      },
      tips: [
        'Carrega em / em qualquer página para pesquisares em toda a tua biblioteca.',
        'O separador {{t:dp_tab_listening}} de uma música mostra o dia em que a encontraste: o que tocava logo antes.',
        'Nas tuas sequências, toca num selo ganho para o virares e veres quando o ganhaste.',
        'Não gostas de uma capa? Passa o rato por cima e carrega no ✎ para escolheres outra, ou cola a ligação de qualquer imagem.'
      ]
    },
    stats: {
      title: '{{t:tab_stats}}',
      promise: 'O que ouviste em qualquer período: um resumo, a sua história, jogos, comparações lado a lado e gráficos.',
      scenes: {
        top: { title: 'O período e o {{t:sx_tab_overview}}', spots: {
          presets: ['Períodos rápidos', '{{t:range_4w}}, {{t:range_12m}}, {{t:range_3y}} ou {{t:range_all}}. Todos os separadores usam o período que escolheres aqui.'],
          dates: ['As tuas datas', 'Escolhe qualquer data de início e de fim.'],
          tabs: ['Cinco separadores', '{{t:sx_tab_overview}}, {{t:sx_tab_story}}, {{t:sx_tab_games}}, {{t:sx_tab_compare}} e {{t:sx_tab_charts}}. O que deixares aberto é o que vês quando voltas.'],
          line: ['Numa frase', 'O período numa frase: quanto ouviste, face ao período anterior, e quem liderou. Clica no artista para abrir a janela dele.'],
          share: ['{{t:sx_share}}', 'Cria uma imagem deste resumo para guardar ou enviar.'],
          tile: ['Quatro quadros', 'Plays, músicas, artistas e álbuns do período.'],
          delta: ['Face ao anterior', 'Subiu ou desceu face ao mesmo tempo logo antes, com esse número ao lado.'],
          trend: ['Como correu', 'Uma pequena linha de como correu ao longo do período.'],
          sub: ['Números pequenos', 'Plays por dia, o teu melhor dia, quantas eram novas para ti.'],
          go: ['Ver mais', 'Cada quadro tem uma ligação para o gráfico ou a comparação que conta mais.']
        } },
        ov: { title: 'O resto do {{t:sx_tab_overview}}', spots: {
          top5: ['{{t:sx_top5_title}}', 'Os cinco que mais ouviste no período. Clica num para abrir a janela.'],
          t5seg: ['Músicas, artistas ou álbuns', 'Muda o que o top 5 mostra.'],
          t5lead: ['O teu #1', 'O líder, os plays, a parte do total e a vantagem sobre o #2. Ouve uma amostra aqui mesmo.'],
          t5rows: ['Do #2 ao #5', 'As barras mostram quão perto cada um está do #1.'],
          sotp: ['{{t:sx_sotp_title}}', 'A tua música mais ouvida no período e como correram os plays, dia a dia ou semana a semana.'],
          movers: ['{{t:sx_mov_title}}', 'O que ouviste muito mais, e muito menos, do que no período anterior.'],
          mvseg: ['Músicas, artistas ou álbuns', 'Muda o que as mudanças mostram.'],
          persona: ['{{t:sx_pers_title}}', 'Um nome para a forma como ouviste neste período, como {{t:sx_pers_explorer}} ou {{t:sx_pers_marathon}}, e porquê.'],
          facts: ['{{t:sx_fact_title}}', 'Pormenores do período: a tua maior repetição, a tua hora e o teu dia com mais plays.'],
          shuffle: ['{{t:sx_fact_shuffle}}', 'Mostra outras curiosidades.'],
          cal: ['{{t:sx_cal_title}}', 'Um pequeno calendário do período, mais escuro quanto mais ouviste. Clica num dia para abrir o top diário.'],
          calmore: ['Todos os anos', 'Leva ao mapa de calor completo em {{t:sx_tab_charts}}.'],
          otd: ['{{t:sx_otd_title}}', 'A data de hoje em anos passados, e a música que mais ouviste nesse dia.'],
          split: ['{{t:sx_split_title}}', 'Descobertas novas contra velhas favoritas, e quanto foi para os teus 5 artistas principais.']
        } },
        story: { title: '{{t:sx_tab_story}}', spots: {
          obs: ['{{t:sx_obs_title_m}}', 'O artista que mais ouviste em cada mês (ou em cada semana, num período curto).'],
          obsone: ['Um mês', 'Clica para abrir o top desse mês.'],
          eras: ['{{t:sx_eras_title}}', 'Períodos em que um artista foi #1 no teu top semanal três semanas ou mais seguidas.'],
          drift: ['{{t:sx_drift_title}}', 'Os teus 10 artistas de cada ano, ano a ano. Clica numa linha ou num nome para seguir um artista.'],
          driftkeys: ['Seguir um artista', 'Clica num nome para destacar a linha dele.'],
          loyal: ['{{t:sx_loyal_title}}', 'Quanto foi para os teus 10 artistas principais, numa escala de aventureiro a fiel.'],
          comfort: ['{{t:sx_comfort_title}}', 'Músicas que já conhecias contra músicas que encontraste neste período.'],
          disc: ['{{t:sx_disc_title}}', 'Os teus maiores artistas novos do período, e se ainda os ouves.'],
          fun: ['{{t:sx_fun_title}}', 'O período noutras palavras: plays por dia, a tua música top, quanto andariam os teus plays.'],
          miles: ['{{t:sx_miles_title}}', 'Números redondos que passaste: plays, músicas e artistas diferentes, e quando.']
        } },
        games: { title: '{{t:sx_tab_games}}', spots: {
          head: ['{{t:sx_games_title}}', 'Quizzes feitos com a tua própria biblioteca.'],
          tally: ['O teu marcador', 'Quantos jogos já jogaste, e a tua sequência de dias no jogo do dia.'],
          daily: ['{{t:sx_daily_k}}', 'Um desafio por dia, o mesmo todo o dia. Só conta a primeira tentativa; joga todos os dias para manter a sequência.'],
          dailygo: ['{{t:sx_daily_play}}', 'Começa o desafio de hoje.'],
          card: ['Um jogo', 'Doze jogos: {{t:sx_game_hl}}, {{t:sx_game_tune}}, {{t:sx_game_year}}, {{t:sx_game_one}} e mais.'],
          tag: ['{{t:sx_games_new}}', 'Os jogos que ainda não jogaste têm uma etiqueta.'],
          go: ['{{t:sx_game_play}}', 'Abre o jogo em ecrã inteiro.']
        } },
        game: { title: 'A jogar uma partida', spots: {
          title: ['O jogo', 'O nome dele.'],
          score: ['A tua pontuação', 'A tua sequência ou pontuação agora, e o teu recorde.'],
          close: ['Fechar', 'Volta aos jogos. Esc faz o mesmo.'],
          q: ['A pergunta', 'O que tens de adivinhar.'],
          known: ['O que sabes', 'Um lado mostra a resposta.'],
          guess: ['O que adivinhas', 'O outro está escondido.'],
          btns: ['A tua resposta', 'Escolhe uma. Se acertares, a partida continua; no fim podes partilhar o resultado.']
        } },
        cmp: { title: '{{t:sx_tab_compare}}', spots: {
          gran: ['{{t:gran_daily}} / {{t:gran_monthly}} / {{t:gran_yearly}}', 'Como as linhas se dividem: por dia, por mês ou por ano. Aparece em {{t:sx_tab_compare}} e {{t:sx_tab_charts}}.'],
          top: ['O teu top', 'Preenche a seleção com os teus favoritos do período.'],
          saved: ['{{t:sx_saved_title}}', 'Guarda uma seleção para a recuperar mais tarde.'],
          types: ['O que comparar', '{{t:sx_cmp_type_artists}}, {{t:sx_cmp_type_songs}}, {{t:sx_cmp_type_albums}} ou {{t:sx_cmp_type_years}}.'],
          modes: ['Como ver', '{{t:sx_cmp_mode_cum}}, {{t:sx_cmp_mode_per}}, {{t:sx_cmp_mode_run}} ou {{t:sx_cmp_mode_race}}.'],
          chip: ['Uma escolha', 'Posição, plays e percentagem. A barra por baixo é a cor dela no gráfico.'],
          x: ['Remover', 'Tira-a da lista.'],
          add: ['Adicionar', 'Escreve um nome e escolhe-o da lista. Até 10.'],
          legend: ['A legenda', '{{t:sx_cmp_legend_tip}}.'],
          chart: ['O gráfico', 'Passa o rato (ou toca) para ler cada período.'],
          verdict: ['Quem ganha', 'Mais plays, mais semanas em #1, o mais em alta agora, o que está contigo há mais tempo.']
        } },
        cmpmore: { title: 'Mais em {{t:sx_tab_compare}}', spots: {
          h2h: ['{{t:sx_h2h_title}}', 'Quem lidera e por quanto, e a parte de cada um.'],
          share: ['{{t:sx_share}}', 'Uma imagem da comparação.'],
          table: ['A tabela', 'Plays, percentagem, primeiro play, semanas em #1, melhor mês, maior sequência. Clica numa coluna para ordenar; o melhor de cada uma aparece na sua cor.'],
          own: ['{{t:sx_own_title}}', 'Um bloco por mês na cor de quem foi mais ouvido, e quando a liderança mudou.'],
          gaps: ['{{t:sx_gap_title}}', 'A disputa mais renhida, a maior vantagem, a subida mais rápida e quem liderou mais tempo.'],
          ts: ['{{t:sx_ts_title}}', 'As três músicas mais ouvidas de cada um.'],
          hab: ['{{t:sx_hab_title}}', 'Quando cada um é ouvido: por hora e por dia da semana.']
        } },
        run: { title: '{{t:sx_cmp_mode_run}}', spots: {
          run: ['{{t:sx_cmp_mode_run}}', 'As posições deles no teu top, semana a semana.'],
          crun: ['Que top', '{{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} ou {{t:nav_yearly}}.'],
          chart: ['Posição ao longo do tempo', 'Mais acima é melhor. As falhas são semanas fora do top.']
        } },
        race: { title: '{{t:sx_cmp_mode_race}}', spots: {
          race: ['{{t:sx_cmp_mode_race}}', 'As tuas escolhas como barras a correr para o topo, período a período.'],
          canvas: ['A corrida', 'Abre no resultado. Carrega em play para a ver desde o início.'],
          start: ['Para o início', 'Volta ao primeiro período.'],
          play: ['Play', 'Reproduz ou pausa a corrida.'],
          step: ['Um passo', 'Um período para a frente (o botão à esquerda do play volta atrás).'],
          seek: ['Qualquer data', 'Arrasta para qualquer momento.'],
          speeds: ['Velocidade', 'De 0.5× a 4×.'],
          gif: ['{{t:btn_download_gif}}', 'Guarda a corrida como imagem animada.'],
          range: ['As datas da corrida', 'A corrida tem o seu próprio período, desde o teu primeiro play. Muda-o aqui; {{t:btn_reset}} volta ao original.']
        } },
        vol: { title: '{{t:sx_vol_title}}', spots: {
          gran: ['Por dia, mês ou ano', 'Como as barras se dividem.'],
          mode: ['{{t:sx_vol_mode_plays}} / {{t:sx_vol_mode_new}}', 'Todos os teus plays com a parte nova por cima, ou só o que era novo para ti.'],
          labels: ['Números nas barras', 'Mostra o número de cada barra.'],
          zoom: ['Tirar o zoom', 'Arrasta sobre o gráfico para aproximar; este botão volta a afastar.'],
          figs: ['Os números', 'Totais do período. Também servem de legenda: azul é {{t:sx_vol_known}}, verde é {{t:sx_vol_new}}.'],
          busiest: ['{{t:sx_v_month}}', 'Clica para veres esse mês por dentro.'],
          canvas: ['As barras', 'Clica em qualquer barra para veres esse período por dentro.']
        } },
        drill: { title: 'Dentro de um período', spots: {
          when: ['O período', 'Qual é, e como correu face ao anterior.'],
          step: ['Antes / depois', 'Passa ao período anterior ou ao seguinte.'],
          figs: ['Os números', 'Plays, quanto foi novo, músicas e artistas.'],
          hero: ['A mais ouvida', 'A música top, com uma amostra.'],
          spark: ['{{t:sx_cal_title}}', 'Cada dia do período, com o de mais plays em destaque.'],
          tabs: ['Três listas', '{{t:sx_dr_tab_top}}, {{t:sx_dr_tab_new}} e {{t:sx_dr_tab_art}}.'],
          rows: ['A lista', 'Clica numa para abrir a janela.'],
          open: ['{{t:sx_drill_open}}', 'Abre o top desse período.']
        } },
        clock: { title: '{{t:sx_clock_title}} e {{t:sx_week_title}}', spots: {
          clock: ['{{t:sx_clock_title}}', 'Cada fatia é uma hora; mais comprida, mais plays. Passa o rato (ou toca) para veres o que ouvias a essa hora.'],
          parts: ['Partes do dia', 'Manhã, tarde, noite e madrugada, e a parte de cada uma.'],
          cnote: ['Numa frase', 'As tuas horas com mais e com menos plays.'],
          wfigs: ['Dias úteis contra o fim de semana', 'Plays por dia em cada um, e o teu dia com mais plays.'],
          week: ['{{t:sx_week_title}}', 'Média de plays de cada dia. Clica num dia para veres mais.'],
          wnote: ['Numa frase', 'Os teus dias com mais e com menos plays.']
        } },
        heat: { title: '{{t:hm_title}}', spots: {
          types: ['{{t:hm_type_all}} / {{t:hm_type_artist}} / {{t:hm_type_song}} / {{t:hm_type_album}}', 'Todos os teus plays, ou só um artista, uma música ou um álbum: adiciona-o pelo nome.'],
          colors: ['Cores', 'Escolhe um esquema de cores para o mapa.'],
          year: ['O ano', 'Passa ao ano anterior ou ao seguinte.'],
          best: ['Melhor sequência', 'A tua maior sequência de dias com música.'],
          figs: ['O ano em números', 'Plays, melhor dia, artista top e artistas novos.'],
          grid: ['Cada dia', 'Um quadrado por dia, mais forte quanto mais ouviste. Passa o rato (ou toca) para veres o que ouvias.'],
          strip: ['{{t:hm_every_year}}', 'Cada ano em miniatura. Clica num para o abrir.'],
          patterns: ['{{t:hm_patterns}}', 'Quando ouves ao longo da semana.'],
          scope: ['{{t:hm_pat_year}} / {{t:hm_pat_all}}', 'Padrões do ano aberto ou de sempre.'],
          rhythm: ['Ritmo da semana', 'Plays por dia em cada dia da semana.'],
          hours: ['Hora do dia', 'Cada hora de cada dia da semana. A com mais plays fica destacada.']
        } }
      },
      howto: {
        range: { title: 'Escolher um período', slides: [
          'Escolhe um período rápido: as últimas 4 semanas, 12 meses, 3 anos, ou tudo.',
          'Ou põe a tua própria data de início e de fim.',
          'Todos os separadores usam o mesmo período. Muda de separador quando quiseres.',
          'Em {{t:sx_tab_compare}} e {{t:sx_tab_charts}}, escolhe também por dia, mês ou ano.'
        ] },
        overview: { title: 'Ler o teu {{t:sx_tab_overview}}', slides: [
          'Começa pela frase: o período numa linha.',
          'As setas comparam com o mesmo período logo antes.',
          'Cada quadro leva ao gráfico que conta mais.',
          'O teu top 5: muda entre músicas, artistas e álbuns.',
          'Vê o que ouviste mais, e menos, do que antes.',
          'Clica em qualquer dia do calendário para abrir o top desse dia.'
        ] },
        story: { title: 'Ver a tua história', slides: [
          'Abre {{t:sx_tab_story}}.',
          'O teu artista top de cada mês. Clica num para abrir o top desse mês.',
          'As tuas eras: quando um artista dominou o teu top semanal.',
          'Como o teu top 10 mudou ano a ano.',
          'E os artistas novos que encontraste, e se ainda os ouves.'
        ] },
        game: { title: 'Jogar uma partida', slides: [
          'Começa pelo {{t:sx_daily_k}}: um desafio, o mesmo todo o dia.',
          'Ou escolhe qualquer um dos doze jogos.',
          'Dá o teu palpite.',
          'A tua pontuação e o teu recorde, em cima.',
          'Fecha quando quiseres.',
          'O teu marcador conta os jogos jogados e a tua sequência de dias.'
        ] },
        compare: { title: 'Comparar artistas, músicas ou anos', slides: [
          'Escolhe o que comparar.',
          'Escreve um nome e adiciona-o. Até 10.',
          'Cada escolha tem um cartão e uma cor. O ✕ remove-a.',
          'Escolhe como os ver: total acumulado, por período, percurso ou corrida.',
          'Clica num nome da legenda para esconder ou mostrar a linha.',
          'Desce: frente a frente, quem esteve no topo, as diferenças, as músicas top e os hábitos.',
          'Guarda a seleção para voltares a ela.'
        ] },
        race: { title: 'Ver uma corrida', slides: [
          'Em {{t:sx_tab_compare}}, escolhe {{t:sx_cmp_mode_race}}.',
          'Carrega em play.',
          'Arrasta para qualquer momento.',
          'Mais devagar ou mais depressa.',
          'Guarda-a como imagem animada para partilhar.'
        ] },
        drill: { title: 'Ver um mês por dentro', slides: [
          'Em {{t:sx_tab_charts}}, clica em qualquer barra.',
          'Ou clica no período com mais plays.',
          'Abre por baixo do gráfico. As setas passam ao período anterior ou ao seguinte.',
          'Muda entre músicas top, descobertas e artistas top.',
          'Abre o top desse período.'
        ] },
        heat: { title: 'Explorar o mapa de calor', slides: [
          'Cada dia do ano, mais forte quanto mais ouviste. Passa o rato por um dia.',
          'Percorre os anos.',
          'Mostra só um artista, uma música ou um álbum.',
          'Escolhe um esquema de cores.',
          'E vê as horas da semana em que mais ouves.'
        ] }
      },
      options: {
        range: { title: 'Período', items: {
          presets: ['{{t:range_4w}} / {{t:range_12m}} / {{t:range_3y}} / {{t:range_all}}', 'Um período rápido até hoje.'],
          dates: ['Datas', 'Qualquer início e fim.'],
          gran: ['{{t:gran_daily}} / {{t:gran_monthly}} / {{t:gran_yearly}}', 'Como os gráficos se dividem. Só em {{t:sx_tab_compare}} e {{t:sx_tab_charts}}.']
        } },
        tabs: { title: 'Separadores', items: {
          overview: ['{{t:sx_tab_overview}}', 'O período numa frase, quatro quadros e oito cartões.'],
          story: ['{{t:sx_tab_story}}', 'Do que tratou o período.'],
          games: ['{{t:sx_tab_games}}', 'Doze jogos e um jogo do dia.'],
          compare: ['{{t:sx_tab_compare}}', 'Até 10 lado a lado, ou numa corrida.'],
          charts: ['{{t:sx_tab_charts}}', 'Volume, o relógio, a tua semana e o mapa de calor.']
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
          crun: ['{{t:sx_cmp_mode_run}}', 'Que top: {{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}}, {{t:nav_yearly}}.'],
          top: ['Top 3 / {{t:sx_cmp_fill10}}', 'Preenche a seleção com os teus favoritos.'],
          saved: ['{{t:sx_saved_title}}', 'Seleções guardadas.'],
          legend: ['Legenda', 'Esconde ou mostra uma linha.'],
          h2hshare: ['{{t:sx_share}}', 'Uma imagem da comparação.']
        } },
        race: { title: '{{t:sx_cmp_mode_race}}', items: {
          speeds: ['Velocidade', '0.5×, 1×, 2×, 4×.'],
          gif: ['{{t:btn_download_gif}}', 'Guarda a corrida.'],
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
        'stats.range': ['Muda o período', 'Um período rápido ou as tuas próprias datas.'],
        'stats.story': ['Abre {{t:sx_tab_story}}', 'O segundo separador.'],
        'stats.go': ['Segue a ligação de um quadro', 'Por baixo de qualquer um dos quatro quadros do {{t:sx_tab_overview}}.'],
        'stats.game': ['Joga uma partida', 'Qualquer jogo em {{t:sx_tab_games}}, ou o {{t:sx_daily_k}}.'],
        'stats.add': ['Adiciona algo em {{t:sx_tab_compare}}', 'Escreve um nome na caixa de adicionar.'],
        'stats.race': ['Vê uma corrida', '{{t:sx_tab_compare}} → {{t:sx_cmp_mode_race}}.'],
        'stats.drill': ['Vê um período por dentro', 'Clica numa barra em {{t:sx_tab_charts}}.'],
        'stats.heat': ['Muda o mapa de calor', 'Outro ano, cor ou vista.']
      },
      quiz: {
        q1: ['Um quadro diz ▲ 20%. Face a quê?',
          ['O mesmo tempo logo antes', 'O ano passado', 'A tua média de sempre'],
          'Cada quadro compara o período com o mesmo período logo antes.'],
        q2: ['Onde vês os teus artistas top numa corrida?',
          ['{{t:sx_tab_story}}', '{{t:sx_tab_compare}} → {{t:sx_cmp_mode_race}}', '{{t:sx_tab_games}}'],
          '{{t:sx_cmp_mode_race}} é uma das quatro formas como {{t:sx_tab_compare}} mostra as tuas escolhas.'],
        q3: ['O que tem de especial o {{t:sx_daily_k}}?',
          ['É um tipo novo de jogo', 'Dá pontos a dobrar', 'Todos recebem o mesmo desafio todo o dia, e só conta a primeira tentativa'],
          'Um desafio por dia, o mesmo todo o dia. Joga todos os dias para manteres a sequência.']
      },
      tips: [
        'Os quadros de {{t:tab_stats}} comparam o período com o mesmo tempo logo antes. Experimenta {{t:range_4w}} para veres a tendência do mês.',
        'Em {{t:sx_tab_compare}}, {{t:sx_cmp_mode_race}} transforma os teus artistas top numa corrida que podes guardar como GIF.',
        'Todos os dias há um novo {{t:sx_daily_k}} em {{t:sx_tab_games}}. Mantém a tua sequência.',
        'Clica em qualquer barra em {{t:sx_tab_charts}} para veres as músicas top e as descobertas desse mês.',
        'O mapa de calor tem seis esquemas de cores, e pode mostrar um só artista, música ou álbum.'
      ]
    },
    records: {
      title: '{{t:nav_records}}',
      promise: 'O teu livro de recordes: números um, estreias, mais plays, sequências, certificações e mais, para músicas, artistas e álbuns.',
      scenes: {
        top: { title: '{{t:sec_records_title}}', spots: {
          intro: ['O que conta', 'O tamanho de cada top de onde vêm os recordes, e quantos dias, semanas, meses e anos tens.'],
          search: ['Pesquisar em todos os recordes', 'Escreve um artista, uma música ou um álbum para veres todos os recordes dele, em todas as secções.'],
          nav: ['Secções', '{{t:rec_nav_overview}}, depois {{t:rec_grp_chart}} e {{t:rec_grp_plays}}. Vês uma secção de cada vez.'],
          grp: ['Dois grupos', '{{t:rec_grp_chart}} vêm dos teus tops; {{t:rec_grp_plays}} vêm dos teus plays.'],
          count: ['Quantas', 'Quantas listas de recordes a secção tem.'],
          picker: ['{{t:rec_picker_label}}', 'No telemóvel, as secções estão neste menu.'],
          hero: ['{{t:rec_hero_label}}', 'O artista com mais recordes, e quantos são.'],
          reel: ['Os recordes dele', 'Uma faixa com os recordes. Anda sozinha; arrasta-a para veres.'],
          card: ['Um recorde', 'O que é, o número e quando. O selo é a posição dele nessa lista.']
        } },
        ov: { title: '{{t:rec_nav_overview}}', spots: {
          intro: ['O melhor de cada', 'Quem tem o recorde de cada secção, numa só página.'],
          types: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Muda todos os cartões de uma vez.'],
          grp: ['Dois grupos', '{{t:rec_grp_chart}} e {{t:rec_grp_plays}}, como no menu.'],
          cell: ['Um cartão', 'Quem tem o recorde e o número. Clica para abrir essa secção.'],
          value: ['O recorde', 'O número a bater.'],
          sw: ['Que top', 'Muda um cartão entre {{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} e {{t:nav_yearly}}.']
        } },
        ones: { title: '{{t:rec_nav_all_ones}}: como é cada secção', spots: {
          story: ['Numa frase', 'O recorde e quem o tem. Muda com os botões abaixo.'],
          ent: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quem ver os recordes.'],
          per: ['Que top', '{{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} ou {{t:nav_yearly}}.'],
          run: ['{{t:rec_run_total}} / {{t:rec_run_consec}}', 'Todas as semanas em #1 somadas, ou a maior sequência sem pausas.'],
          sort: ['{{t:rec1_sort}}', '{{t:rec1_sort_rank}}, {{t:rec1_sort_recent}}, {{t:rec1_sort_oldest}} ou {{t:rec1_sort_name}}.'],
          champ: ['O primeiro', 'O #1 da lista, em destaque: o número e quando.'],
          boxes: ['O percurso', 'Cada vez que foi #1. Os espaços pontilhados são o tempo entre elas.'],
          sample: ['Amostra', 'Ouve 30 segundos.'],
          details: ['Detalhes', 'Abre a janela dele.'],
          runner: ['#2 e #3', 'Os dois logo atrás. Clica no ▸ para a janela deles.']
        } },
        list: { title: 'A lista', spots: {
          heads: ['Colunas', 'Clica num título para ordenar por ele.'],
          all: ['{{t:rec_expand_all}}', 'Abre ou fecha todos os percursos de uma vez.'],
          name: ['A entrada', 'Clica no nome para abrir a janela.'],
          tl: ['Quando', 'Uma linha da tua história: cada marca é uma vez em #1.'],
          date: ['Datas', 'Clica numa data para abrir esse top.'],
          toggle: ['O percurso', 'Abre ou fecha o percurso por baixo da linha.'],
          runrow: ['O percurso', 'Cada semana em #1, com os espaços. Clica num quadrado para veres esse top.']
        } },
        sort: { title: '{{t:rec1_sort}}', spots: {
          btn: ['{{t:rec1_sort}}', 'Abre o menu.'],
          rank: ['{{t:rec1_sort_rank}}', 'O maior recorde primeiro.'],
          recent: ['{{t:rec1_sort_recent}}', 'O mais recente primeiro.'],
          oldest: ['{{t:rec1_sort_oldest}}', 'Desde o início da tua história.'],
          name: ['{{t:rec1_sort_name}}', 'Por ordem alfabética.']
        } },
        foot: { title: '{{t:rec_size_label}}', spots: {
          note: ['Quantas aparecem', 'Quantas entradas da lista vês.'],
          show: ['{{t:rec_size_label}}', 'O tamanho de cada lista.'],
          sizes: ['Tamanhos', '25, 50, 100 ou todas (até 1000).']
        } },
        search: { title: 'Pesquisa', spots: {
          field: ['Pesquisar', 'Um artista, uma música ou um álbum.'],
          clear: ['Limpar', 'Volta à página normal.'],
          status: ['Resultados', 'Quantos recordes correspondem, e em quantas secções.'],
          nav: ['Todas as secções de uma vez', 'Enquanto pesquisas, vês todas as secções, só com as linhas que correspondem.']
        } },
        pak: { title: '{{t:rec_nav_pak}}', spots: {
          story: ['Quem o tem', 'Quem tem mais, e quantos há no total.'],
          about: ['O que é', 'Um artista em #1 nos tops de artistas, músicas e álbuns ao mesmo tempo.'],
          info: ['{{t:rec_pak_info_btn}}', 'Abre a explicação completa.'],
          infotext: ['A explicação', 'O que é preciso, em poucas linhas.'],
          per: ['Que top', '{{t:nav_daily}}, {{t:nav_weekly}}, {{t:nav_monthly}} ou {{t:nav_yearly}}.'],
          champ: ['Quem o tem', 'Com a primeira música e o primeiro álbum a consegui-lo.'],
          details: ['Detalhes', 'Abre a janela dele.']
        } },
        nc: { title: '{{t:rec_nav_new_charts}}', spots: {
          about: ['O que é', 'Recordes de {{t:rec_nav_new_charts}}: só músicas, artistas e álbuns que descobriste há pouco.'],
          tabs: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quem ver os recordes.'],
          title: ['Uma lista', 'Cada lista tem o seu título.'],
          fold: ['Recolher', 'Recolhe uma lista; carrega outra vez para a abrir.'],
          champ: ['O primeiro', 'O #1 dessa lista.']
        } },
        mil: { title: '{{t:rec_nav_milestones}}', spots: {
          tabs: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quem ver as marcas.'],
          sub: ['Como funciona', 'Quem chegou primeiro a cada número redondo.'],
          tier: ['Uma marca', 'O número de plays.'],
          art: ['Quem chegou primeiro', 'E quando.'],
          more: ['Mais', 'Abre as marcas recolhidas pelo meio.']
        } },
        fast: { title: '{{t:rec_nav_fastest}}', spots: {
          tabs: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quem ver os recordes.'],
          pick: ['{{t:fast_pick_pre}} … {{t:fast_pick_post}}', 'Escolhe o número de plays da corrida.'],
          sub: ['Quantos chegaram', 'Quantos alcançaram esse número.'],
          champ: ['O mais rápido', 'Quanto tempo demorou desde o primeiro play.']
        } },
        streaks: { title: '{{t:rec_nav_streaks}}', spots: {
          ent: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quem ver as sequências.'],
          per: ['Dias, semanas, meses, anos', 'Ouvido todos os dias seguidos, todas as semanas seguidas, e assim por diante.'],
          b2b: ['{{t:rec_per_runs}}', 'As vezes que tocou de seguida, sem nada pelo meio.'],
          sub: ['Como conta', 'O que a lista mede.'],
          champ: ['A maior', 'De quando até quando.']
        } },
        certs: { title: '{{t:rec_nav_certs}}', spots: {
          story: ['O líder', 'O artista com mais certificações.'],
          tiers: ['O que é preciso', 'Os plays necessários para Ouro, Platina e Diamante, em músicas e em álbuns.'],
          card: ['Uma placa', 'Os três primeiros artistas, cada um numa placa.'],
          total: ['Certificações', 'Quantas têm no total.'],
          bar: ['A mistura', 'Diamante, Platina e Ouro, numa barra.'],
          tally: ['Músicas e álbuns', 'As certificações por nível.'],
          open: ['{{t:certd_open_ledger}}', 'Abre o registo completo por baixo das placas.']
        } },
        ledger: { title: '{{t:certd_title}}', spots: {
          tally: ['No total', 'Todas as certificações.'],
          facts: ['Dados principais', 'Músicas e álbuns, a primeira e a última, a mais rápida e o melhor ritmo.'],
          types: ['{{t:certd_all}} / {{t:certd_songs}} / {{t:certd_albums}}', 'Filtra por músicas ou álbuns.'],
          tiers: ['Níveis', 'Filtra por Diamante, Platina ou Ouro.'],
          sort: ['{{t:certd_sort}}', 'Muda a ordem.'],
          medal: ['O nível', 'Que certificação, e com quantos plays.'],
          row: ['Uma certificação', 'A música ou o álbum, os plays por dia e os plays de agora.'],
          journey: ['Como lá chegou', 'Do primeiro play à certificação: quanto tempo demorou, e o próximo nível.']
        } }
      },
      howto: {
        find: { title: 'Encontrar uma secção', slides: [
          'As secções estão no menu à esquerda.',
          'No telemóvel, abre o menu {{t:rec_picker_label}}.',
          'O número diz quantas listas tem.',
          'Cada secção começa com o seu recorde numa frase.'
        ] },
        overview: { title: 'Ler a {{t:rec_nav_overview}}', slides: [
          'Em cima: o artista com mais recordes.',
          'Uma faixa com os recordes dele. Arrasta-a.',
          'Em baixo, o melhor de cada secção. Muda-os todos para artistas ou álbuns.',
          'Clica num cartão para abrir a secção.',
          'Ou muda um cartão para outro top.'
        ] },
        types: { title: 'Músicas, artistas ou álbuns', slides: [
          'Quase todas as secções mudam entre músicas, artistas e álbuns.',
          'E entre os teus tops diário, semanal, mensal e anual.',
          '{{t:rec_nav_milestones}} e {{t:rec_nav_fastest}} têm o seu próprio seletor.',
          '{{t:rec_nav_fastest}} também te deixa escolher o número de plays.'
        ] },
        read: { title: 'Ler um recorde', slides: [
          'Quem tem o recorde, em destaque, com o número.',
          'Cada vez que foi #1, com os espaços.',
          'O #2 e o #3 ao lado.',
          'O resto da lista: uma linha do tempo para cada um.',
          'Abre o percurso de uma linha.',
          'Ou abre-os todos.'
        ] },
        count: { title: 'Total ou seguidas', slides: [
          '{{t:rec_run_total}} soma todas as semanas em #1; {{t:rec_run_consec}} conta só a maior sequência sem pausas.',
          'A frase muda com isso.',
          'Ordena por posição, mais recente, mais antigo ou nome.',
          'Ou clica no título de uma coluna.'
        ] },
        search: { title: 'Pesquisar nos teus recordes', slides: [
          'Escreve um artista, uma música ou um álbum.',
          'Quantos recordes correspondem.',
          'Vês todas as secções, só com as linhas que correspondem.',
          'Limpa para voltar.'
        ] },
        certs: { title: 'Abrir um registo de certificações', slides: [
          'Os plays de que uma música ou um álbum precisa para cada nível.',
          'Os três primeiros artistas em placas.',
          'Abre todas as certificações de um artista.',
          'Os dados principais.',
          'Filtra por músicas, álbuns ou nível.',
          'Cada certificação, com quanto tempo demorou.'
        ] },
        more: { title: 'Ver mais de uma lista', slides: [
          'Quantas entradas da lista vês.',
          'Mostra 25, 50, 100 ou todas.'
        ] }
      },
      options: {
        sections: { title: 'Secções', items: {
          ones: ['{{t:rec_nav_all_ones}}', 'Tudo o que chegou a #1, e durante quanto tempo.'],
          pak: ['{{t:rec_nav_pak}}', '#1 nos tops de artistas, músicas e álbuns ao mesmo tempo.'],
          app: ['{{t:rec_nav_appearances}}', 'Mais semanas (dias, meses, anos) num top.'],
          debuts: ['{{t:rec_nav_debuts}}', 'As maiores estreias.'],
          nc: ['{{t:rec_nav_new_charts}}', 'Recordes de {{t:rec_nav_new_charts}}.'],
          plays: ['{{t:rec_nav_peak_plays}}', 'Mais plays num dia, numa semana, num mês ou num ano.'],
          mil: ['{{t:rec_nav_milestones}}', 'O primeiro a cada número redondo de plays.'],
          fast: ['{{t:rec_nav_fastest}}', 'O mais rápido a chegar a um número de plays.'],
          streaks: ['{{t:rec_nav_streaks}}', 'As maiores sequências de dias, semanas, meses, anos, e de seguida.'],
          certs: ['{{t:rec_nav_certs}}', 'Ouro, Platina e Diamante, artista a artista.']
        } },
        switches: { title: 'Em todas as secções', items: {
          ent: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De quem.'],
          per: ['{{t:nav_daily}} / {{t:nav_weekly}} / {{t:nav_monthly}} / {{t:nav_yearly}}', 'Que top.'],
          run: ['{{t:rec_run_total}} / {{t:rec_run_consec}}', 'Somado ou sem pausas. {{t:rec_nav_all_ones}} e {{t:rec_nav_appearances}}.'],
          sort: ['{{t:rec1_sort}}', '{{t:rec1_sort_rank}}, {{t:rec1_sort_recent}}, {{t:rec1_sort_oldest}}, {{t:rec1_sort_name}}.'],
          show: ['{{t:rec_size_label}}', '25, 50, 100 ou todas.'],
          all: ['{{t:rec_expand_all}}', 'Todos os percursos de uma vez.']
        } },
        overview: { title: '{{t:rec_nav_overview}}', items: {
          types: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'Todos os cartões de uma vez.'],
          sw: ['Top de um cartão', 'Um cartão de cada vez.']
        } },
        special: { title: 'Só em algumas secções', items: {
          pakinfo: ['{{t:rec_pak_info_btn}}', '{{t:rec_nav_pak}} explicado.'],
          b2b: ['{{t:rec_per_runs}}', '{{t:rec_nav_streaks}}: plays de seguida.'],
          fastpick: ['{{t:fast_pick_pre}} … {{t:fast_pick_post}}', '{{t:rec_nav_fastest}}: o número de plays.'],
          milmore: ['Mais marcas', '{{t:rec_nav_milestones}}: as recolhidas pelo meio.'],
          ncfold: ['Recolher', '{{t:rec_nav_new_charts}}: recolhe uma lista.']
        } },
        certs: { title: '{{t:rec_nav_certs}}', items: {
          open: ['{{t:certd_open_ledger}}', 'O registo completo.'],
          types: ['{{t:certd_all}} / {{t:certd_songs}} / {{t:certd_albums}}', 'Filtra o registo.'],
          tiers: ['Níveis', 'Diamante, Platina, Ouro.'],
          sort: ['{{t:certd_sort}}', 'A ordem do registo.']
        } }
      },
      challenges: {
        'rec.view': ['Abre outra secção', 'No menu (no telemóvel, o menu {{t:rec_picker_label}}).'],
        'rec.ent': ['Muda para artistas ou álbuns', 'O seletor por cima de qualquer lista.'],
        'rec.per': ['Muda para outro top', '{{t:nav_daily}}, {{t:nav_monthly}} ou {{t:nav_yearly}}, numa secção ou num cartão da {{t:rec_nav_overview}}.'],
        'rec.consec': ['Conta {{t:rec_run_consec}}', 'Em {{t:rec_nav_all_ones}}.'],
        'rec.run': ['Abre o percurso de um recorde', 'A seta no fim de uma linha.'],
        'rec.search': ['Pesquisa nos teus recordes', 'A caixa no topo.'],
        'rec.ledger': ['Abre um registo de certificações', '{{t:rec_nav_certs}} → {{t:certd_open_ledger}}.'],
        'rec.show': ['Mostra uma lista maior', '{{t:rec_size_label}}, por baixo da lista.']
      },
      quiz: {
        q1: ['O que conta {{t:rec_run_consec}}?',
          ['Todas as semanas em #1 somadas', 'Só a maior sequência sem pausas', 'Semanas no top 10'],
          '{{t:rec_run_total}} soma todas as semanas; {{t:rec_run_consec}} conta só o troço mais longo sem pausas.'],
        q2: ['Pesquisas um artista. O que acontece?',
          ['Vês todas as secções, só com os recordes dele', 'Só a {{t:rec_nav_overview}} muda', 'Abre-se a janela dele'],
          'A pesquisa filtra todas as secções de uma vez, e diz quantos recordes corresponderam.'],
        q3: ['O que é um {{t:rec_nav_pak}}?',
          ['Mais plays num dia', 'Uma estreia em #1', 'Um artista em #1 nos tops de artistas, músicas e álbuns ao mesmo tempo'],
          'Os três tops liderados pelo mesmo artista no mesmo período.']
      },
      tips: [
        'A pesquisa de {{t:nav_records}} mostra todos os recordes de um artista, música ou álbum, em todas as secções.',
        'Em {{t:rec_nav_all_ones}}, muda para {{t:rec_run_consec}} para veres as maiores sequências sem pausas em #1.',
        'Em {{t:rec_nav_certs}}, abre o registo de um artista para veres a rapidez de cada Ouro, Platina e Diamante.',
        'Um {{t:rec_nav_pak}} é um artista em #1 nos três tops ao mesmo tempo. Quantos tens?',
        'Cada cartão da {{t:rec_nav_overview}} muda sozinho entre os tops diário, semanal, mensal e anual.'
      ]
    },
    awards: {
      title: '{{t:nav_awards}}',
      promise: 'A tua própria gala de prémios para qualquer ano: escolhe as categorias, os nomeados e os vencedores, e assiste à cerimónia. E como se saíram os teus artistas nos prémios a sério.',
      scenes: {
        top: { title: '{{t:awards_tab_mygrammys}}', spots: {
          sub: ['{{t:awards_tab_mygrammys}} / {{t:awards_tab_reallife}}', 'Os teus próprios prémios, ou galas da vida real.'],
          year: ['O ano', 'Cada ano tem o seu próprio boletim. Clica no ano para saltar para outro.'],
          config: ['{{t:awards_configure}}', 'Que categorias há este ano, as datas que contam e alguns ajustes.'],
          gen: ['{{t:awards_generate}}', 'Preenche todas as categorias com nomeados dos teus plays de uma vez.'],
          cer: ['{{t:awards_ceremony_btn}}', 'Passa a gala em ecrã inteiro. Também está no fim da página.'],
          share: ['{{t:awards_share_btn}}', 'Uma ligação com que qualquer pessoa pode ver a tua cerimónia.'],
          sum: ['{{t:awx_title}}', 'O ano num relance: mais nomeações, mais vitórias e mais. Abre para veres tudo.'],
          tools: ['Ferramentas do boletim', 'Quantas faltam decidir, esconder as decididas, abrir ou recolher os cartões.'],
          views: ['{{t:awards_view_label}}', '{{t:awards_view_ballot}}, {{t:awards_view_spotlight}}, {{t:awards_view_tiles}}, {{t:awards_view_collage}} ou {{t:awards_view_reel}}.']
        } },
        empty: { title: 'Um ano novo', spots: {
          year: ['O ano', 'Um ano que ainda não preparaste.'],
          gen: ['{{t:awards_generate}}', 'A forma mais rápida de começar: nomeados para todas as categorias de uma vez.'],
          card: ['Uma categoria', 'O tipo (música, álbum ou artista), o nome e o que premeia.'],
          onoff: ['Ligar / desligar', 'Tira a categoria da gala deste ano, ou volta a pô-la.'],
          fav: ['Favorita', 'Marca com estrela as categorias que queres sempre.'],
          pick: ['{{t:awards_pick_nominees_btn}}', 'Escolhe tu os nomeados de uma categoria.']
        } },
        cards: { title: 'O boletim', spots: {
          left: ['{{t:awards_pending}}', 'Quantas categorias ainda precisam de vencedor.'],
          hide: ['{{t:awards_hide_decided}}', 'Esconde as categorias que já têm vencedor.'],
          fold: ['Abrir / recolher', '{{t:awards_expand_all}} ou {{t:awards_collapse_all}}: em todos os cartões, ou só nos de {{t:awards_fold_scope_pending}}.'],
          views: ['{{t:awards_view_label}}', 'Cinco formas de ver o boletim.'],
          hint: ['{{t:awards_pick_hint}}', 'Clica num nomeado para o tornar vencedor. Outro clique desfaz.'],
          head: ['Uma categoria', 'O tipo, o número de nomeados, o nome e o que premeia.'],
          onoff: ['Ligar / desligar', 'Tira a categoria da gala.'],
          fav: ['Favorita', 'Marca a categoria com estrela.'],
          fold1: ['Recolher', 'Recolhe este cartão.'],
          winner: ['O vencedor', 'A dourado, com troféu.'],
          nom: ['Um nomeado', 'Clica para o coroar.'],
          change: ['{{t:awards_change_btn}}', 'Abre o seletor de nomeados desta categoria.'],
          playlist: ['{{t:awx_playlist}}', 'Guarda os nomeados como playlist.'],
          reorder: ['{{t:awards_reorder}}', 'Move os nomeados para cima e para baixo.']
        } },
        config: { title: '{{t:awards_configure}}', spots: {
          elig: ['{{t:awards_elig_window}}', 'As datas que contam para os prémios deste ano.'],
          gemini: ['Chave do Gemini', 'Opcional: uma chave grátis {{t:awx_cfg_gemini_hint}}.'],
          credit: ['{{t:awx_cfg_credit}}', 'Uma nomeação conta também para os artistas convidados, não só para o principal.'],
          hideplays: ['{{t:awx_cfg_hide_plays}}', 'O boletim é sobre as tuas escolhas, não sobre os números.'],
          rating: ['{{t:awx_cfg_scores}}', 'A tua nota de 0 a 10 ao lado de cada nomeado que avaliaste.'],
          samples: ['{{t:awx_cfg_samples}}', 'Um botão ♪ que toca 30 segundos de cada nomeado.'],
          count: ['Quantas estão ligadas', 'Categorias ativas este ano, de todas as que existem.'],
          bulk: ['{{t:awards_enable_all}} / {{t:awards_disable_all}}', 'Todas as categorias de uma vez, ou só as favoritas.'],
          favs: ['Só favoritas', 'Liga só as categorias com estrela.'],
          search: ['Pesquisar', 'Encontra uma categoria pelo nome.'],
          type: ['Música, álbum, artista', 'Mostra só um tipo.'],
          status: ['Ligadas ou não', 'Mostra só as categorias ligadas, ou as desligadas.'],
          groups: ['Grupos', 'Salta para um grupo: prémios principais, rock, pop, vídeos e mais.'],
          group: ['Um grupo', 'Liga ou desliga o grupo inteiro.'],
          cat: ['Uma categoria', 'Clica para a ligar ou desligar.'],
          catfav: ['Estrela', 'Torna-a favorita.']
        } },
        picker: { title: 'Escolher nomeados', spots: {
          title: ['A categoria', 'Para que ano e categoria estás a escolher.'],
          fav: ['Favorita', 'Marca a categoria com estrela.'],
          close: ['Fechar', 'Pergunta primeiro se tiveres alterações.'],
          ballot: ['{{t:awx_pk_nominees}}', 'O que já escolheste. {{t:awx_pk_drag}}.'],
          tally: ['Quantos', 'Até 8.'],
          quick: ['Escolha rápida', 'Preenche os 8 primeiros, os 5 primeiros, ou {{t:awx_pk_clear}}.'],
          nom: ['Uma escolha', 'A posição, uma amostra, o vídeo e ✕ para a tirar.'],
          clip: ['Amostra', 'Ouve 30 segundos.'],
          x: ['Remover', 'Tira-a da lista.'],
          search: ['Pesquisar', 'Qualquer música desse ano.'],
          sort: ['Ordenar', 'Como a lista de baixo está ordenada.'],
          group: ['{{t:awx_pk_suggested}}', 'As que melhor encaixam vêm primeiro.'],
          row: ['Uma sugestão', 'Os géneros, quanto encaixa na categoria e os plays. Clica para a adicionar ou tirar.'],
          save: ['{{t:awards_save_nominees}}', 'Põe-nos no boletim.']
        } },
        sum: { title: '{{t:awx_title}}', spots: {
          head: ['O ano num relance', 'Quantas nomeações, categorias e artistas, e quem lidera.'],
          toggle: ['Abrir / fechar', 'Mais nomeações e vitórias de sempre, e os líderes deste ano.']
        } },
        intro: { title: 'A cerimónia', spots: {
          badge: ['A gala', 'De que ano são os prémios.'],
          dots: ['Progresso', 'Um ponto por categoria.'],
          cats: ['{{t:awards_ceremony_cats}}', 'A lista de categorias: salta para qualquer uma.'],
          sound: ['Som', 'Música e efeitos, ligados ou não.'],
          close: ['Fechar', 'Sai da gala. Esc faz o mesmo.'],
          title: ['{{t:awx_title}}', 'A gala começa com os mais nomeados do ano.'],
          slide: ['{{t:awx_cer_before}}', 'Mais nomeações de sempre e deste ano.'],
          progress: ['Onde estás', 'Antes da gala, depois 1 de 6 e assim por diante.'],
          next: ['{{t:awx_cer_start}}', 'Para o primeiro prémio.']
        } },
        cat: { title: 'Um prémio', spots: {
          title: ['A categoria', 'O nome, em destaque.'],
          noms: ['Os nomeados', 'Todos os nomeados, com a capa.'],
          nom: ['Um nomeado', 'O título e o artista.'],
          env: ['O envelope', 'O vencedor está lá dentro.'],
          meet: ['{{t:awx_cer_meet}}', 'Antes, alguns segundos de cada nomeado.'],
          open: ['{{t:awards_open_envelope}}', 'Revela o vencedor.'],
          prev: ['Anterior', 'O prémio anterior. ← faz o mesmo.'],
          progress: ['Contagem', 'Que prémio de quantos.'],
          next: ['Seguinte', 'O prémio seguinte. → faz o mesmo.']
        } },
        win: { title: 'O vencedor', spots: {
          label: ['Vencedor', 'O envelope foi aberto.'],
          name: ['O vencedor', 'E o artista.'],
          art: ['A capa', 'Com o troféu.'],
          play: ['A música', 'Toca uma amostra; pausa-a ou repete-a aqui.'],
          next: ['Seguinte', 'Para o prémio seguinte.']
        } },
        fin: { title: '{{t:awx_cer_winners}}', spots: {
          grid: ['{{t:awx_cer_winners}}', 'Todos os vencedores da noite.'],
          card: ['Um vencedor', 'A categoria, o título e o artista.'],
          stats: ['Depois da gala', 'As estatísticas e recordes finais, com as vitórias deste ano somadas.']
        } },
        side: { title: '{{t:awards_ceremony_cats}}', spots: {
          cats: ['{{t:awards_ceremony_cats}}', 'Abre e fecha a lista.'],
          side: ['Todas as categorias', 'Clica numa para saltares para ela.']
        } },
        share: { title: '{{t:cer_share_title}}', spots: {
          title: ['{{t:cer_share_title}}', 'Partilha a tua cerimónia com uma ligação.'],
          body: ['Como funciona', 'Quem tiver a ligação pode vê-la, sem conta.'],
          foot: ['{{t:cer_share_signin}}', 'Para criar a ligação tens de iniciar sessão. Depois, copia-a daqui.']
        } },
        real: { title: '{{t:awards_tab_reallife}}', spots: {
          sub: ['{{t:awards_tab_reallife}}', 'Galas reais, comparadas com o que ouves.'],
          shows: ['As galas', 'Grammys, VMAs, AMAs, iHeartRadio, World Music, Billboard, ARIA, Juno e BRIT.'],
          year: ['O ano', 'Percorre os anos da gala.'],
          head: ['A gala', 'O nome e quantas categorias.'],
          sub2: ['Que plays contam', 'Os teus plays durante a temporada dessa gala.'],
          tally: ['Os teus artistas', 'Quantas nomeações e vitórias tiveram os teus artistas.'],
          card: ['Um artista', 'Todas as nomeações e vitórias dele.'],
          plays: ['Plays nessa temporada', 'Quanto o ouviste na altura.'],
          won: ['{{t:awx_rl_won}}', 'Uma vitória.'],
          nomd: ['{{t:awx_rl_nominated}}', 'Uma nomeação.'],
          work: ['Porquê', 'A música, o álbum ou o vídeo.']
        } }
      },
      howto: {
        setup: { title: 'Preparar um ano', slides: [
          'Escolhe o ano.',
          'Abre {{t:awards_configure}}.',
          'As datas que contam.',
          'Salta para um grupo de categorias.',
          'Clica numa categoria para a ligar ou desligar.',
          'E alguns ajustes, como amostras em cada nomeado.'
        ] },
        gen: { title: 'Nomeados num clique', slides: [
          'Carrega em {{t:awards_generate}}.',
          'Cada categoria recebe até 8 nomeados dos teus plays.',
          'Depois muda os que quiseres.'
        ] },
        pick: { title: 'Escolher tu os nomeados', slides: [
          'Carrega em {{t:awards_change_btn}} (ou {{t:awards_pick_nominees_btn}}) numa categoria.',
          'Primeiro as sugestões, as que melhor encaixam em cima. Clica para adicionar.',
          'Ou pesquisa qualquer música desse ano.',
          'Preenche os 8 primeiros de uma vez.',
          'Arrasta as tuas escolhas para as ordenar.',
          'Guarda.'
        ] },
        win: { title: 'Coroar os vencedores', slides: [
          'Clica num nomeado.',
          'Fica dourado: é o teu vencedor.',
          'Vê quantas faltam.',
          'Esconde as que já decidiste.'
        ] },
        view: { title: 'Ver o boletim de cinco formas', slides: [
          'Muda a vista aqui.',
          '{{t:awards_view_spotlight}}: o vencedor em destaque, com plays.',
          '{{t:awards_view_tiles}}: capas em grelha.',
          '{{t:awards_view_collage}}: uma capa grande e o resto à volta.',
          '{{t:awards_view_reel}}: uma faixa que desliza para o lado.'
        ] },
        cer: { title: 'Ver a cerimónia', slides: [
          'Carrega em {{t:awards_ceremony_btn}}.',
          'Começa com os líderes do ano.',
          '{{t:awx_cer_start}}.',
          'Ouve os nomeados.',
          'Abre o envelope.',
          'E o vencedor é…',
          'Para o prémio seguinte.',
          'Termina com todos os vencedores da noite.'
        ] },
        share: { title: 'Partilhar a tua cerimónia', slides: [
          'Salta para qualquer categoria a partir da lista.',
          'Liga ou desliga o som.',
          'Carrega em {{t:awards_share_btn}} na página dos Prémios.',
          'Inicia sessão e copia a ligação para a enviares.'
        ] },
        real: { title: 'Ver os prémios a sério', slides: [
          'Abre {{t:awards_tab_reallife}}.',
          'Escolhe uma gala.',
          'E um ano.',
          'Como se saíram os teus artistas.',
          'Cada nomeação e vitória, artista a artista.'
        ] }
      },
      options: {
        bar: { title: 'No topo', items: {
          year: ['O ano', 'Cada ano tem o seu próprio boletim.'],
          config: ['{{t:awards_configure}}', 'Categorias, datas e ajustes.'],
          gen: ['{{t:awards_generate}}', 'Nomeados para todas as categorias.'],
          cer: ['{{t:awards_ceremony_btn}}', 'A gala em ecrã inteiro.'],
          share: ['{{t:awards_share_btn}}', 'Uma ligação para a tua cerimónia.']
        } },
        views: { title: '{{t:awards_view_label}}', items: {
          ballot: ['{{t:awards_view_ballot}}', 'Uma lista por categoria.'],
          spotlight: ['{{t:awards_view_spotlight}}', 'O vencedor em destaque, com plays.'],
          tiles: ['{{t:awards_view_tiles}}', 'Capas em grelha.'],
          collage: ['{{t:awards_view_collage}}', 'Uma capa grande e o resto à volta.'],
          reel: ['{{t:awards_view_reel}}', 'Uma faixa lateral.']
        } },
        tools: { title: 'O boletim', items: {
          hide: ['{{t:awards_hide_decided}}', 'Só o que falta decidir.'],
          fold: ['{{t:awards_fold_scope_all}} / {{t:awards_fold_scope_pending}}', 'Que cartões abrem ou recolhem juntos.'],
          onoff: ['Ligar / desligar', 'Por categoria.'],
          fav: ['Favorita', 'Marca uma categoria.'],
          playlist: ['{{t:awx_playlist}}', 'Os nomeados como playlist.'],
          reorder: ['{{t:awards_reorder}}', 'Muda a ordem dos nomeados.']
        } },
        config: { title: '{{t:awards_configure}}', items: {
          elig: ['{{t:awards_elig_window}}', 'As datas que contam.'],
          gemini: ['Chave do Gemini', 'Opcional, {{t:awx_cfg_gemini_hint}}.'],
          credit: ['{{t:awx_cfg_credit}}', 'Os convidados partilham o crédito.'],
          hideplays: ['{{t:awx_cfg_hide_plays}}', 'Sem plays no boletim.'],
          rating: ['{{t:awx_cfg_scores}}', 'As tuas notas ao lado dos nomeados.'],
          samples: ['{{t:awx_cfg_samples}}', 'Um ♪ em cada nomeado.'],
          bulk: ['{{t:awards_enable_all}} / {{t:awards_disable_all}}', 'Todas as categorias de uma vez.'],
          favs: ['Só favoritas', 'Só as tuas categorias com estrela.']
        } },
        picker: { title: 'Seletor de nomeados', items: {
          quick: ['Os 8 primeiros / Top 5 / {{t:awx_pk_clear}}', 'Preenche ou esvazia a lista.'],
          sort: ['Ordenar', 'A ordem das sugestões.'],
          clip: ['♪', 'Uma amostra de cada.']
        } },
        cer: { title: 'Cerimónia', items: {
          cats: ['{{t:awards_ceremony_cats}}', 'Salta para qualquer prémio.'],
          sound: ['Som', 'Ligado ou desligado.'],
          meet: ['{{t:awx_cer_meet}}', 'Ouve cada nomeado.'],
          open: ['{{t:awards_open_envelope}}', 'Revela o vencedor.']
        } },
        real: { title: '{{t:awards_tab_reallife}}', items: {
          shows: ['Galas', 'Grammys, VMAs, AMAs, iHeartRadio, World Music, Billboard, ARIA, Juno, BRIT.']
        } }
      },
      challenges: {
        'aw.config': ['Abre {{t:awards_configure}}', 'No topo de {{t:awards_tab_mygrammys}}.'],
        'aw.gen': ['Gera nomeados', '{{t:awards_generate}}.'],
        'aw.pick': ['Abre o seletor de nomeados', '{{t:awards_change_btn}} em qualquer categoria.'],
        'aw.win': ['Coroa um vencedor', 'Clica num nomeado.'],
        'aw.view': ['Experimenta outra vista', '{{t:awards_view_spotlight}}, {{t:awards_view_tiles}}, {{t:awards_view_collage}} ou {{t:awards_view_reel}}.'],
        'aw.cer': ['Começa a cerimónia', '{{t:awards_ceremony_btn}}.'],
        'aw.reveal': ['Abre um envelope', 'Na cerimónia.'],
        'aw.real': ['Abre {{t:awards_tab_reallife}}', 'O segundo separador.']
      },
      quiz: {
        q1: ['Como escolhes um vencedor?',
          ['Carrega em {{t:awards_ceremony_btn}}', 'Arrasta-o para o topo', 'Clica no nomeado no boletim'],
          'Um clique num nomeado coroa-o; outro clique desfaz.'],
        q2: ['O que faz {{t:awards_generate}}?',
          ['Preenche cada categoria com nomeados dos teus plays', 'Escolhe os vencedores por ti', 'Começa a cerimónia'],
          'Escolhe nomeados; os vencedores escolhes sempre tu.'],
        q3: ['Quem pode ver uma cerimónia que partilhas?',
          ['Só tu', 'Qualquer pessoa com a ligação, sem conta', 'Só quem tem sessão iniciada'],
          'Tu inicias sessão para criar a ligação; quem a abrir pode ver.']
      },
      tips: [
        'Experimenta a vista {{t:awards_view_collage}} em {{t:awards_tab_mygrammys}}: cada categoria como um mural de capas.',
        'Na cerimónia, {{t:awx_cer_meet}} toca alguns segundos de cada nomeado antes de abrires o envelope.',
        '{{t:awards_tab_reallife}} mostra como se saíram os teus artistas nos Grammys, nos VMAs, nos BRIT e mais.',
        'No seletor de nomeados, «Os 8 primeiros» preenche a lista com os que melhor encaixam num clique.',
        'Marca as tuas categorias favoritas com estrela e liga só essas para um ano rápido.'
      ]
    },
    soundtrack: {
      title: '{{t:nav_soundtrack}}',
      promise: 'Um ano, um mês ou tudo o que ouviste contado como uma história em doze capítulos, para percorrer, ver como um espetáculo e partilhar.',
      scenes: {
        top: { title: 'Capítulo 1: o período', spots: {
          period: ['{{t:st_period_year}} / {{t:st_period_month}} / {{t:st_period_alltime}}', 'Que história contar.'],
          nav: ['Qual', 'Passa ao ano ou mês anterior ou seguinte, ou clica no nome para escolheres um.'],
          story: ['{{t:st_story_play_all}}', 'Cada capítulo em ecrã inteiro, um a seguir ao outro, como um espetáculo.'],
          replay: ['{{t:st_replay_title}}', 'Salta para a repetição dos teus artistas top, semana a semana.'],
          share: ['{{t:st_share_btn}}', 'Cria uma imagem da tua banda sonora.'],
          hero: ['O período', 'O nome, sobre um mural das capas que ouviste.'],
          mosaic: ['As capas', 'Os álbuns do período.'],
          stats: ['Cinco números', '{{t:st_stat_plays}}, {{t:st_stat_days}}, {{t:st_stat_artists}}, {{t:st_stat_new_discoveries}} e {{t:st_stat_peak_day}}.'],
          stat: ['Escolhe um número', 'A faixa de baixo muda com ele: cada play, cada dia, cada artista, as tuas descobertas ou o teu dia de pico.'],
          reel: ['A faixa', 'Arrasta para a percorreres. Clica num cartão para Spotify, uma playlist, o leitor ou uma pesquisa.'],
          pl: ['{{t:pl_section_btn}}', 'Guarda o que a faixa mostra como playlist.']
        } },
        artist: { title: '{{t:st_featured_label}}', spots: {
          name: ['O teu artista #1', 'O artista que mais ouviste.'],
          count: ['Quanto', 'Os plays e a parte do total.'],
          big: ['Um número grande', 'A tua maior sequência de músicas dele de seguida.'],
          favs: ['Favoritos', 'O álbum e a música dele que mais ouviste, com as tuas sequências.'],
          stats: ['Mais números', 'Dia mais ouvido, sequência de dias, dias, músicas e álbuns, hora de pico.']
        } },
        tops: { title: '{{t:st_ch_top_name}}', spots: {
          head: ['A tua música', 'A música do período, e o teu artista.'],
          songs: ['{{t:st_top_songs}}', 'Uma fila de capas para passares.'],
          center: ['A da frente', 'A posição e os plays. Clica para abrires a janela.'],
          prev: ['Voltar', 'A anterior.'],
          next: ['Seguinte', 'A seguinte. Arrastar ou deslizar também funciona.'],
          count: ['Posição e plays', 'Da que está à frente.'],
          artists: ['{{t:st_top_artists}}', 'O mesmo, para artistas.'],
          albums: ['{{t:st_top_albums}}', 'E para álbuns.']
        } },
        no1: { title: '{{t:d100_no1_title}}', spots: {
          head: ['Quantos', 'Números um diferentes no teu top semanal, e o que ficou mais tempo no topo.'],
          seg: ['{{t:sx_cmp_type_songs}} / {{t:sx_cmp_type_artists}} / {{t:sx_cmp_type_albums}}', 'De que top são os #1.'],
          sum: ['No total', 'Quantas vezes o #1 mudou.'],
          strip: ['A linha do tempo', 'Cada reinado como um bloco; os mais longos, mais largos.'],
          row: ['Um #1', 'Quando lá chegou e quanto tempo ficou.'],
          more: ['Ver todos', 'A lista completa.']
        } },
        activity: { title: '{{t:st_activity_title}}', spots: {
          head: ['O teu mês mais barulhento', 'O mês com mais plays.'],
          chart: ['Mês a mês', 'Os plays de cada mês e a mudança face ao anterior.'],
          bar: ['Um mês', 'Clica para veres os plays e o artista top desse mês.']
        } },
        loyalty: { title: '{{t:st_loyalty_title}}', spots: {
          head: ['Quem voltou', 'Quantos dos teus 10 artistas do ano passado continuam no teu top.'],
          ring: ['A pontuação', 'Com um nome: de {{t:st_loyalty_explorer}} a {{t:st_loyalty_die_hard}}.'],
          row: ['{{t:st_loyalty_artists_title}}', 'Os artistas que ficaram, com as músicas top.'],
          next: ['Mais', 'Desliza a fila.']
        } },
        new: { title: '{{t:st_discoveries_title}}', spots: {
          head: ['Quantos', 'Artistas que ouviste pela primeira vez, e o que mais ouviste.'],
          bubbles: ['As bolhas', 'Os teus artistas novos flutuam. Os maiores ouviste mais.'],
          bubble: ['Um artista', 'Clica para abrires a história dele.']
        } },
        pop: { title: 'Uma nova descoberta', spots: {
          nav: ['Anterior / seguinte', 'Percorre todas as tuas descobertas.'],
          name: ['O artista', 'E quando o encontraste.'],
          meta: ['Encontrado', 'O dia em que o encontraste e a posição no período.'],
          play: ['{{t:st_am_play}}', 'Ouve-o.'],
          links: ['Spotify, YouTube, Last.fm', 'Encontra-o noutro sítio.'],
          share: ['{{t:st_am_share}}', 'Uma imagem desta descoberta.'],
          stats: ['Números', 'Plays, dias, sequência e álbuns.'],
          goal: ['{{t:st_am_goal_title}}', 'Quanto falta para a tua próxima posição top.'],
          close: ['Fechar', 'Esc faz o mesmo.']
        } },
        mil: { title: '{{t:st_ch_ms_name}}', spots: {
          head: ['A grande marca', 'O maior total que passaste, e com que música.'],
          overall: ['{{t:st_milestones_title}}', 'Cada número redondo de plays, e a música que o marcou.'],
          artist: ['{{t:st_artist_milestones_title}}', 'Números redondos de cada artista.'],
          toggle: ['Mais', 'Mostra os 25 seguintes.']
        } },
        streaks: { title: '{{t:st_streaks_title}}', spots: {
          head: ['A tua maior', 'A tua maior sequência de dias com música.'],
          cards: ['Três cartões', 'Dias com música, a tua melhor sequência e a tua maior pausa. Toca num para veres detalhes.'],
          detail: ['Detalhes', 'Do cartão em que tocaste.'],
          cal: ['Cada dia', 'Um calendário do período, colorido por sequência.'],
          chips: ['Em resumo', 'Quantas semanas tiveram música.'],
          entity: ['Um artista, álbum, música', 'Mais dias seguidos com o mesmo.']
        } },
        grammys: { title: '{{t:st_aw_title}}', spots: {
          head: ['Vencedores', 'Os teus artistas top que ganharam os teus prémios ou prémios reais.'],
          grid: ['Os vencedores', 'Um cartão por artista.'],
          card: ['Um artista', 'As vitórias. Clica para as veres.']
        } },
        end: { title: 'Os dois últimos capítulos', spots: {
          replay: ['{{t:st_replay_btn}}', 'Os teus 5 artistas top numa corrida, semana a semana.'],
          share: ['{{t:st_card_open}}', 'Cria uma imagem da tua banda sonora.']
        } },
        replay: { title: '{{t:st_replay_title}}', spots: {
          canvas: ['A corrida', 'Os 5 artistas top da semana e os seus plays.'],
          speed: ['Velocidade', 'Mais devagar ou mais depressa.'],
          prev: ['Semana anterior', 'Um passo atrás.'],
          pause: ['Play / pausa', 'Para ou continua.'],
          next: ['Semana seguinte', 'Um passo em frente.'],
          stop: ['{{t:st_replay_stop}}', 'Termina a repetição.']
        } },
        story: { title: '{{t:st_story_play_all}}', spots: {
          bars: ['Progresso', 'Uma linha por capítulo.'],
          close: ['Fechar', 'Volta à página. Esc também.'],
          prev: ['Anterior', '← faz o mesmo.'],
          next: ['Seguinte', '→ ou um toque à direita fazem o mesmo.']
        } },
        card: { title: '{{t:st_card_title}}', spots: {
          preview: ['Pré-visualização', 'Como a imagem vai ficar.'],
          tpl: ['Design', 'Recap, Wrapped, Collage, Minimal ou Poster.'],
          pal: ['Paleta', 'As cores da app, seis paletas fixas ou a capa.'],
          fmt: ['{{t:ig_format}}', '{{t:sh_fmt_post}}, {{t:sh_fmt_portrait}} ou {{t:sh_fmt_story}}.'],
          art: ['Mostrar / esconder', 'Capas, números, dia de pico, artistas top, músicas top, rodapé.'],
          src: ['Origem das imagens', 'De onde vêm as capas.'],
          topn: ['Entradas', 'Quantos artistas e músicas top.'],
          copy: ['Copiar', 'Copia a imagem para a colares onde quiseres.'],
          dl: ['Transferir', 'Guarda a imagem.']
        } }
      },
      howto: {
        period: { title: 'Escolher um ano, um mês ou tudo', slides: [
          'Escolhe {{t:st_period_year}}, {{t:st_period_month}} ou {{t:st_period_alltime}}.',
          '{{t:st_period_month}}: a história de um mês.',
          '{{t:st_period_alltime}}: toda a tua história.',
          'Passa a outro ano ou mês.'
        ] },
        story: { title: '{{t:st_story_play_all}}', slides: [
          'Carrega no botão de reproduzir no topo.',
          'Cada capítulo, um de cada vez.',
          'Seguinte, ou toca no lado direito do ecrã.',
          'Fecha quando quiseres.'
        ] },
        read: { title: 'Ler o primeiro capítulo', slides: [
          'O período, sobre as capas.',
          'Escolhe um dos cinco números.',
          'A faixa mostra o que esse número conta.',
          'Guarda a faixa como playlist.',
          'Depois, o teu artista #1.'
        ] },
        tops: { title: 'Os teus tops e os teus números um', slides: [
          'As tuas músicas top, bem à frente.',
          'Passa por elas.',
          'Números um: músicas, artistas ou álbuns.',
          'Cada #1 e quanto tempo ficou.',
          'Mês a mês: clica num mês.'
        ] },
        discover: { title: 'Conhecer os teus artistas novos', slides: [
          'Os teus artistas novos flutuam.',
          'Clica num.',
          'A história dele: quando o encontraste e quanto o ouves.',
          'Quão perto está do teu top.',
          'Percorre os outros.'
        ] },
        replay: { title: 'Rever o teu ano', slides: [
          'Carrega em {{t:st_replay_title}} no topo…',
          '…ou em {{t:st_replay_btn}} perto do fim.',
          'Os teus 5 top, semana a semana.',
          'Pausa, ou avança uma semana de cada vez.',
          'Muda a velocidade.'
        ] },
        share: { title: 'Partilhar a tua banda sonora', slides: [
          'Carrega em {{t:st_share_btn}} (ou em {{t:st_card_open}} no fim).',
          'Escolhe um design.',
          'E uma paleta.',
          'E um formato.',
          'Transfere-a ou copia-a.'
        ] }
      },
      options: {
        period: { title: 'Período', items: {
          year: ['{{t:st_period_year}} / {{t:st_period_month}} / {{t:st_period_alltime}}', 'Que história.'],
          nav: ['Anterior / seguinte', 'Outro ano ou mês.']
        } },
        chapters: { title: 'Os capítulos', items: {
          year: ['1. {{t:nav_soundtrack}}', 'O período, cinco números e a faixa.'],
          artist: ['2. {{t:st_featured_label}}', 'O teu artista #1.'],
          tops: ['3. {{t:st_ch_top_name}}', 'As tuas músicas, artistas e álbuns top.'],
          no1: ['4. {{t:d100_no1_title}}', 'Cada #1 (só ano e mês).'],
          activity: ['5. {{t:st_activity_title}}', 'Mês a mês (ou dia a dia).'],
          loyalty: ['6. {{t:st_loyalty_title}}', 'Quem voltou.'],
          new: ['7. {{t:st_discoveries_title}}', 'Artistas novos.'],
          mil: ['8. {{t:st_ch_ms_name}}', 'Números redondos passados.'],
          streaks: ['9. {{t:st_streaks_title}}', 'Dias seguidos.'],
          awards: ['10. {{t:st_aw_title}}', 'Os teus vencedores.'],
          replay: ['11. {{t:st_replay_title}}', 'O ano como corrida (só ano).'],
          share: ['12. {{t:st_card_title}}', 'Uma imagem para partilhar.']
        } },
        tools: { title: 'Pelo caminho', items: {
          stat: ['Os cinco números', 'Cada um muda a faixa.'],
          pl: ['{{t:pl_section_btn}}', 'A faixa como playlist.'],
          no1: ['{{t:d100_no1_title}}', 'Músicas, artistas ou álbuns.'],
          more: ['Ver mais', 'Listas de marcas maiores.'],
          speed: ['Velocidade da repetição', 'Mais devagar ou mais depressa.']
        } },
        card: { title: '{{t:st_card_title}}', items: {
          tpl: ['Design', 'Cinco designs.'],
          pal: ['Paleta', 'Oito conjuntos de cores.'],
          fmt: ['{{t:ig_format}}', '1:1, 4:5 ou 9:16.'],
          art: ['Capas', 'Ligado ou desligado, e a origem.'],
          topn: ['Entradas', 'Quantas na lista.'],
          copy: ['Copiar / Transferir', 'Leva a imagem.']
        } }
      },
      challenges: {
        'st.period': ['Muda para {{t:st_period_month}} ou {{t:st_period_alltime}}', 'No canto superior esquerdo.'],
        'st.nav': ['Vai a outro ano ou mês', 'As setas ao lado do nome.'],
        'st.story': ['Reproduz a tua história', 'O botão de reproduzir no topo.'],
        'st.stat': ['Escolhe outro dos cinco números', 'No capítulo 1.'],
        'st.no1': ['Vê os #1 de artistas ou álbuns', 'Em {{t:d100_no1_title}}.'],
        'st.bubble': ['Abre uma nova descoberta', 'Clica numa bolha em {{t:st_discoveries_title}}.'],
        'st.replay': ['Reproduz o histórico', '{{t:st_replay_title}}.'],
        'st.card': ['Abre a janela de partilhar', '{{t:st_share_btn}}.']
      },
      quiz: {
        q1: ['O que muda quando clicas num dos cinco números?',
          ['O período', 'A faixa por baixo deles', 'O teu tema'],
          'Cada número enche a faixa com o que conta: cada play, cada dia, cada artista e assim por diante.'],
        q2: ['Como vês todos os capítulos como um espetáculo?',
          ['A deslizar depressa', 'A abrir {{t:st_card_title}}', 'Com o botão de reproduzir no topo'],
          '{{t:st_story_play_all}} mostra os capítulos em ecrã inteiro, um a seguir ao outro.'],
        q3: ['Onde vês como é um artista que acabaste de encontrar?',
          ['A clicar na bolha dele em {{t:st_discoveries_title}}', 'Em {{t:st_streaks_title}}', 'Na faixa'],
          'Cada bolha abre a história desse artista: como o encontraste, os plays e a tua próxima meta.']
      },
      tips: [
        '{{t:st_story_play_all}} transforma o teu ano num espetáculo em ecrã inteiro, capítulo a capítulo.',
        'Em {{t:st_discoveries_title}}, clica numa bolha para veres como encontraste esse artista: a música, o dia e o que ouvias logo antes.',
        'Clica em {{t:st_stat_peak_day}} no capítulo 1 e a faixa mostra cada música do teu dia mais ouvido.',
        '{{t:st_replay_title}} põe os teus 5 artistas top a correr pelo ano, semana a semana.',
        'A imagem para partilhar tem cinco designs. Experimenta Wrapped como story 9:16.'
      ]
    },
    dank100: {
      title: '{{t:d100_title}}',
      promise: 'Um top semanal partilhado, feito com os tops de toda a gente: lê-o, segue o percurso de uma música e envia a tua semana.',
      scenes: {
        top: { title: 'O top', spots: {
          title: ['{{t:d100_title}}', 'Os tops semanais de toda a gente somados num só top de 100.'],
          signin: ['Iniciar sessão', 'Só é preciso para enviares a tua semana. Qualquer pessoa pode ver o top.'],
          week: ['Que semana', 'Escolhe na lista qualquer top até agora.'],
          prev: ['{{t:d100_prev_week}}', 'Um top para trás.'],
          next: ['{{t:d100_next_week}}', 'Um top para a frente.'],
          from: ['Ouvintes', 'De quantas pessoas vieram as semanas deste top.'],
          seg: ['{{t:d100_type_songs}} / {{t:d100_type_artists}} / {{t:d100_type_albums}}', 'Três tops todas as semanas.'],
          export: ['{{t:d100_export}}', 'O top como playlist para copiares para a tua app de música.'],
          share: ['{{t:d100_share}}', 'Guarda uma imagem do top 10 (no telemóvel, partilha-a).'],
          cols: ['As colunas', '{{t:d100_col_pts}}, {{t:d100_col_l}}, {{t:d100_col_lw}}, {{t:d100_col_pk}} e {{t:d100_col_wk}}.'],
          row: ['Uma linha', 'Clica para abrires o percurso dela no top.'],
          pos: ['Posição', 'A posição esta semana.'],
          move: ['Movimento', 'Subiu ou desceu desde a semana passada, ou uma etiqueta se é nova ou voltou.'],
          pts: ['{{t:d100_col_pts}}', 'Os pontos de todos somados: 100 pelo #1 de um ouvinte, até 1 pelo #100 dele.'],
          l: ['{{t:d100_col_l}}', 'Quantas pessoas a tinham no top.'],
          lw: ['{{t:d100_col_lw}}', 'A posição na semana passada (– se não estava).'],
          pk: ['{{t:d100_col_pk}}', 'A melhor posição de sempre.'],
          wk: ['{{t:d100_col_wk}}', 'Semanas no top no total.'],
          acts: ['Ouvir', 'Uma amostra, Spotify ou YouTube.']
        } },
        run: { title: 'Um percurso no top', spots: {
          row: ['A linha aberta', 'Clica outra vez para a fechares.'],
          plot: ['A linha', 'A posição semana a semana, com o #1 em cima. Um buraco é uma semana fora do top.'],
          story: ['Numa frase', 'Onde começou, a melhor posição e há quanto tempo lá está.'],
          ribbon: ['Totais', 'O pico, semanas em #1 e semanas no top 3, 5, 10 ou 40.'],
          chip: ['Um total', 'Toca para destacares só essas semanas em baixo.'],
          boxes: ['Cada semana', 'Uma caixa por semana no top, com a posição.'],
          box: ['Uma semana', 'Clica para veres o top dessa semana.']
        } },
        week: { title: 'O top de uma semana', spots: {
          head: ['A semana', 'Que semana e que top.'],
          item: ['O top 30', 'A que tinhas aberta aparece destacada.'],
          link: ['A semana inteira', 'Abre o top completo dessa semana na página.'],
          close: ['Fechar', 'Volta ao percurso.']
        } },
        no1: { title: '{{t:d100_no1_title}}', spots: {
          head: ['{{t:d100_no1_title}}', 'Cada #1 do top que escolheste em cima.'],
          sum: ['No total', 'Quantos reinados e quantos #1 diferentes.'],
          strip: ['A linha do tempo', 'Cada reinado é um bloco: quanto mais durou, mais largo.'],
          row: ['Um #1', 'A semana em que lá chegou e quanto tempo ficou. Clica para veres essa semana.'],
          back: ['{{t:d100_no1_back}}', 'Já tinha sido #1 antes.'],
          more: ['Ver todos', 'A lista completa.']
        } },
        recs: { title: '{{t:d100_rec_title}}', spots: {
          grid: ['Os recordes', 'Quinze recordes de todos os tops até agora.'],
          rec: ['Um recorde', '{{t:d100_rec_at1}}, {{t:d100_rec_debut}}, {{t:d100_rec_jump}} e mais.'],
          k: ['Que recorde', 'O que conta.'],
          v: ['O número', 'O que é preciso bater.'],
          who: ['De quem é', 'A música, o artista ou o álbum.']
        } },
        entry: { title: '{{t:d100_entry_title}}', spots: {
          soon: ['{{t:d100_soon_title}}', 'Que semana é contada agora e o dia em que sai.'],
          entries: ['As tuas semanas', 'A semana passada (enquanto ainda a podes enviar) e esta semana.'],
          last: ['{{t:d100_week_last}}', 'A semana que está prestes a ser contada.'],
          note: ['Última oportunidade', 'O dia em que fecha.'],
          preview: ['{{t:d100_preview}}', 'O que enviarias: o teu próprio top dessa semana.'],
          send: ['{{t:d100_send}}', 'Junta a tua semana. Carrega outra vez para a atualizares, ou retira-a.'],
          year: ['{{t:d100_year_title}}', 'Os teus tops de todas as semanas desde 2 de janeiro, de uma vez (até 30 de novembro).'],
          yearbtn: ['{{t:d100_year_btn}}', 'Envia-os.'],
          auto: ['Automático', 'Liga-o em {{t:set_title}} e a tua semana é enviada sozinha todos os domingos.'],
          how: ['{{t:d100_how_title}}', 'Pontos, semanas e privacidade em quatro linhas.']
        } }
      },
      howto: {
        read: { title: 'Lê o top', slides: [
          'A posição esta semana.',
          'Subiu ou desceu desde a semana passada.',
          '{{t:d100_col_pts}}: 100 pelo #1 de um ouvinte, 1 pelo #100 dele, tudo somado.',
          'Quantos ouvintes a tinham.',
          'A melhor posição, e depois as semanas no top.',
          'Clica numa linha para abrires o percurso.'
        ] },
        run: { title: 'Segue um percurso', slides: [
          'A posição semana a semana.',
          'Toca num total para destacares essas semanas.',
          'Clica numa semana…',
          '…para veres o top dessa semana.',
          'Ou abre a semana inteira.'
        ] },
        weeks: { title: 'Volta atrás no tempo', slides: [
          'Escolhe uma semana na lista…',
          '…ou anda uma semana de cada vez.',
          'Ou clica num #1 para ires à semana dele.',
          'Muda para {{t:d100_type_artists}} ou {{t:d100_type_albums}}…',
          '…para veres os outros dois tops.'
        ] },
        join: { title: 'Envia a tua semana', slides: [
          'Inicia sessão com o Google, com a tua própria biblioteca ligada (a demo não pode enviar).',
          'A semana passada mostra o teu top.',
          'Carrega em {{t:d100_send}}.',
          'És novo por cá? Envia o teu ano inteiro de uma vez.',
          'Ou deixa que seja enviada sozinha todos os domingos.',
          'O top sai à segunda-feira.'
        ] },
        share: { title: 'Leva-o contigo', slides: [
          '{{t:d100_export}}: o top como playlist.',
          '{{t:d100_share}}: uma imagem do top 10.',
          'Os dois funcionam também nos outros dois tops.'
        ] }
      },
      options: {
        chart: { title: 'O top', items: {
          type: ['{{t:d100_type_songs}} / {{t:d100_type_artists}} / {{t:d100_type_albums}}', 'Que top.'],
          week: ['Semana', 'O top mais recente, ou qualquer um anterior.'],
          cols: ['Colunas', '{{t:d100_col_pts}}, {{t:d100_col_l}}, {{t:d100_col_lw}}, {{t:d100_col_pk}}, {{t:d100_col_wk}}.'],
          acts: ['Ouvir', 'Amostra, Spotify, YouTube.']
        } },
        tools: { title: 'Pelo caminho', items: {
          run: ['Um percurso', 'Clica numa linha; depois numa caixa para essa semana.'],
          more: ['Ver tudo', 'Cada #1 e as 100 posições.'],
          export: ['{{t:d100_export}}', 'As músicas tal como estão; duas músicas por artista ou álbum.'],
          share: ['{{t:d100_share}}', 'Uma imagem do top 10.']
        } },
        entry: { title: 'O teu envio', items: {
          send: ['{{t:d100_send}}', 'Até ao domingo a seguir à semana (UTC).'],
          back: ['{{t:d100_take_back}}', 'Retira o teu envio enquanto a semana estiver aberta.'],
          year: ['{{t:d100_year_btn}}', 'Todas as semanas desde 2 de janeiro, até 30 de novembro.'],
          auto: ['{{t:d100_auto}}', 'Em {{t:set_title}}.']
        } }
      },
      challenges: {
        'd1.week': ['Vê outra semana', 'As setas ou a lista por cima do top.'],
        'd1.type': ['Muda para {{t:d100_type_artists}} ou {{t:d100_type_albums}}', 'Ao lado da semana.'],
        'd1.run': ['Abre um percurso', 'Clica em qualquer linha.'],
        'd1.box': ['Abre uma semana a partir de um percurso', 'Clica numa caixa por baixo de uma linha aberta.'],
        'd1.no1': ['Abre um #1', 'Em {{t:d100_no1_title}}, por baixo do top.'],
        'd1.export': ['{{t:d100_export}}', 'Por cima do top.'],
        'd1.share': ['{{t:d100_share}}', 'Por cima do top.']
      },
      quiz: {
        q1: ['Como é que uma música ganha pontos?',
          ['Um ponto por play', 'Pela posição no top de cada ouvinte', 'Por quantos ouvintes tem'],
          'O #1 de um ouvinte dá-lhe 100 pontos, o #2 dá 99… assim cada ouvinte conta o mesmo, por muito que ouça.'],
        q2: ['Quando sai o top de uma semana?',
          ['À sexta-feira', 'À segunda-feira, depois de os envios fecharem no domingo', 'No fim do mês'],
          'As semanas vão de sexta a quinta (UTC), os envios ficam abertos até domingo e o top sai à segunda-feira.'],
        q3: ['O que é que os outros veem do que enviaste?',
          ['O teu top inteiro', 'O teu top 10', 'Nada: só o top somado é público'],
          'Só o top somado é público. Ninguém vê o que enviaste.']
      },
      tips: [
        'Clica em qualquer caixa do percurso de uma música para veres o top inteiro dessa semana.',
        'Em {{t:d100_no1_title}} cada reinado é um bloco: os mais largos duraram mais.',
        '{{t:d100_export}} transforma o top numa playlist, com duas músicas por artista ou álbum.',
        '{{t:d100_title}} tem três tops todas as semanas: músicas, artistas e álbuns.'
      ]
    },
    ratings: {
      title: '{{t:nav_ratings}}',
      promise: 'Dá notas a álbuns e músicas como um crítico, e vê os teus veredictos, as tuas notas mais altas e mais baixas e o que ainda falta avaliar.',
      scenes: {
        page: { title: 'A tua página de crítico', spots: {
          intro: ['{{t:nav_ratings}}', 'Tudo o que avaliaste, num só sítio.'],
          ring: ['A tua média', 'O teu álbum médio (ou música, até avaliares um álbum).'],
          verdict: ['O veredicto', 'Uma palavra para a nota, de {{t:rtb_poor}} a {{t:rtb_masterpiece}}.'],
          meters: ['Quanto', 'Álbuns, singles e EPs e músicas avaliados, de tudo o que ouviste.'],
          acts: ['O teu hábito', 'Os dias em que avaliaste, a tua maior sequência de dias e a última vez.'],
          next: ['{{t:ar_next}}', 'O álbum que mais ouves sem nota.'],
          cta: ['{{t:rtg_rate_cta}}', 'Abre a janela de avaliação.'],
          hi: ['Altos e baixos', 'O teu álbum, single e música com a nota mais alta e mais baixa. Os empates passam à vez.'],
          dots: ['Mais com essa nota', 'Toca num ponto para veres os outros.'],
          recs: ['{{t:rp_recs}}', 'O que as tuas notas dizem do que ouves.'],
          rec: ['Um recorde', '{{t:rp_rec_overplayed}}, {{t:rp_rec_underplayed}}, {{t:rp_rec_consistent}}, {{t:rp_rec_best_artist}}.'],
          top: ['{{t:rp_top_artists}}', 'Pelo álbum médio. Clica num para veres todas as notas dele.'],
          recent: ['{{t:rp_recent}}', 'O que avaliaste por último. Clica para mudares.']
        } },
        list: { title: 'Tudo o que avaliaste', spots: {
          tabs: ['As listas', '{{t:ig_type_albums}}, {{t:ar_singles}}, {{t:ig_type_songs}} ou {{t:ar_todo}}.'],
          spread: ['{{t:ar_spread}}', 'Quantos há em cada veredicto.'],
          bar: ['Um veredicto', '{{t:ar_spread_hint}}.'],
          search: ['{{t:ar_search}}', 'Encontra um pelo nome.'],
          sort: ['Ordem', '{{t:ar_sort_high}}, {{t:ar_sort_low}}, {{t:ar_sort_tracks}} ou {{t:am_sort_az}}.'],
          row: ['Uma nota', 'Clica para a mudares.'],
          score: ['A nota', 'De 0 a 10.'],
          prog: ['Faixas avaliadas', 'Quantas faixas dele têm nota.'],
          band: ['O veredicto', 'A palavra para a nota.'],
          go: ['Abrir', 'Abre a janela do álbum.']
        } },
        todo: { title: '{{t:ar_todo}}', spots: {
          tabs: ['{{t:ar_todo}}', 'O que ouves e nunca avaliaste.'],
          row: ['Os mais ouvidos primeiro', 'Os que conheces melhor.'],
          cta: ['{{t:rtg_rate_cta}}', 'Avalia já.']
        } },
        album: { title: 'Avaliar um álbum', spots: {
          kind: ['{{t:rte_kind_album}}', 'O que estás a avaliar.'],
          title: ['O álbum', 'E o artista.'],
          ring: ['A nota', 'Muda quando mexes em qualquer controlo.'],
          formula: ['Como se soma', 'A média das faixas × 75% mais os aspetos do álbum × 25%.'],
          tabs: ['{{t:rte_aspects}} / {{t:rte_tracks}}', 'As duas metades da nota.'],
          row: ['Um aspeto', '{{t:rtc_coh}}, {{t:rtc_con}}, {{t:rtc_art}}, {{t:rtc_inn}}, {{t:rtc_imp}} e {{t:rtc_lon}}.'],
          slider: ['Controlo', 'Arrasta de 0 a 10, de 0,1 em 0,1.'],
          num: ['Ou escreve', 'Escreve o número.'],
          weight: ['Faixas vs aspetos', 'Quanto contam as faixas. Vale para todos os álbuns.'],
          note: ['{{t:rte_note}}', 'Umas palavras, se quiseres.'],
          clear: ['{{t:rte_clear_album}}', 'Apaga as notas dos aspetos (as das faixas ficam).'],
          done: ['{{t:rte_done}}', 'As alterações são guardadas logo.'],
          close: ['Fechar', 'O mesmo que {{t:rte_done}}.']
        } },
        tracks: { title: '{{t:rte_tracks}}', spots: {
          tab: ['{{t:rte_tracks}}', 'Cada faixa do álbum que ouviste, com os plays.'],
          formula: ['A nota', 'Muda a cada faixa.'],
          row: ['Uma faixa', 'Avalia-a aqui mesmo: um número.'],
          slider: ['Controlo', 'De 0 a 10.'],
          num: ['Ou escreve', 'Um número.'],
          rubric: ['Critérios completos', 'Abre a janela de avaliação da música.'],
          full: ['Com todos os critérios', 'Uma faixa avaliada em detalhe. Abre-a para a mudares.']
        } },
        song: { title: 'Avaliar uma música', spots: {
          back: ['{{t:rte_back_album}}', 'Quando vieste de um álbum.'],
          ring: ['A nota', 'A média dos critérios.'],
          mode: ['{{t:rte_detailed}} / {{t:rte_quick}}', 'Seis critérios, ou uma nota por instinto.'],
          row: ['Um critério', '{{t:rtc_comp}}, {{t:rtc_lyr}}, {{t:rtc_voc}}, {{t:rtc_prod}}, {{t:rtc_mel}} e {{t:rtc_rhy}}.'],
          na: ['{{t:rte_na}}', '{{t:rtc_lyr}} e {{t:rtc_voc}} podem ficar de fora, numa instrumental.'],
          note: ['{{t:rte_note}}', 'Opcional.'],
          clear: ['{{t:rte_clear_song}}', 'Apaga a nota da música.']
        } },
        quick: { title: '{{t:rte_quick}}', spots: {
          mode: ['{{t:rte_quick}}', '{{t:rte_hint_quick}}'],
          quick: ['Uma nota', 'Arrasta ou escreve.'],
          ring: ['A nota', 'A mesma onde quer que a música apareça.']
        } },
        albwin: { title: 'Na janela do álbum', spots: {
          rate: ['{{t:dp_rate}}', 'Abre a janela de avaliação. As músicas também o têm.'],
          tab: ['{{t:dp_tab_rating}}', 'A avaliação do álbum: a nota, as partes, as melhores e piores faixas.'],
          ring: ['A nota', 'Com o veredicto.']
        } },
        artwin: { title: 'Na janela do artista', spots: {
          tab: ['{{t:dp_tab_rating}}', 'Todas as notas que deste a este artista, como na página {{t:nav_ratings}}.'],
          ring: ['A média dele', 'Dos álbuns avaliados.']
        } }
      },
      howto: {
        rate: { title: 'Avalia um álbum', slides: [
          'Começa por {{t:ar_next}}, ou por qualquer álbum.',
          'Avalia os aspetos.',
          'Depois as faixas: um número cada.',
          'Escolhe quanto contam as faixas.',
          'A nota vai-se somando.',
          'Pronto. Já está tudo guardado.'
        ] },
        song: { title: 'Avalia uma música em detalhe', slides: [
          'Abre os critérios completos de uma faixa…',
          '…e escolhe {{t:rte_detailed}} ou {{t:rte_quick}}.',
          'Avalia cada critério.',
          'Deixa {{t:rtc_lyr}} ou {{t:rtc_voc}} de fora quando não se aplicam.',
          '{{t:rte_quick}}: um número e pronto.'
        ] },
        browse: { title: 'Percorre as tuas notas', slides: [
          'Escolhe uma lista.',
          'Toca num veredicto para veres só esses.',
          'Muda a ordem.',
          'Clica numa linha para mudares a nota.',
          '{{t:ar_todo}}: o que ainda falta avaliar.'
        ] },
        where: { title: 'As notas pela app', slides: [
          'Todas as janelas de álbum e de música têm um botão {{t:dp_rate}}.',
          'O separador {{t:dp_tab_rating}} mostra a avaliação.',
          'Clica num artista aqui…',
          '…para veres todas as notas dele no separador {{t:dp_tab_rating}}.'
        ] }
      },
      options: {
        album: { title: 'Nota de um álbum', items: {
          aspects: ['{{t:rte_aspects}}', 'Seis notas do álbum inteiro.'],
          tracks: ['{{t:rte_tracks}}', 'Uma nota por faixa.'],
          weight: ['Faixas vs aspetos', 'Quanto contam as faixas, em todos os álbuns.'],
          note: ['{{t:rte_note}}', 'As tuas palavras.']
        } },
        song: { title: 'Nota de uma música', items: {
          mode: ['{{t:rte_detailed}} / {{t:rte_quick}}', 'Seis critérios ou um número.'],
          na: ['{{t:rte_na}}', 'Deixa {{t:rtc_lyr}} ou {{t:rtc_voc}} fora da média.'],
          quick: ['{{t:rte_quick}}', 'Uma nota por instinto.']
        } },
        page: { title: 'A página', items: {
          lists: ['Listas', '{{t:ig_type_albums}}, {{t:ar_singles}}, {{t:ig_type_songs}}, {{t:ar_todo}}.'],
          sort: ['Ordem', '{{t:ar_sort_high}}, {{t:ar_sort_low}}, {{t:ar_sort_tracks}}, {{t:am_sort_az}}.'],
          band: ['{{t:ar_spread}}', 'Toca num veredicto para filtrares.'],
          search: ['{{t:ar_search}}', 'Pelo nome.']
        } }
      },
      challenges: {
        'rt.rate': ['Abre a janela de avaliação', '{{t:rtg_rate_cta}} em qualquer álbum.'],
        'rt.tracks': ['Abre o separador {{t:rte_tracks}}', 'Na janela de avaliação de um álbum.'],
        'rt.mode': ['Muda uma música entre {{t:rte_detailed}} e {{t:rte_quick}}', 'Na janela de avaliação de uma música.'],
        'rt.view': ['Abre outra lista', '{{t:ar_singles}}, {{t:ig_type_songs}} ou {{t:ar_todo}}.'],
        'rt.band': ['Mostra só um veredicto', 'Toca numa barra em {{t:ar_spread}}.'],
        'rt.sort': ['Muda a ordem', 'Ao lado de {{t:ar_search}}.'],
        'rt.artist': ['Abre um artista bem avaliado', 'Em {{t:rp_top_artists}}.']
      },
      quiz: {
        q1: ['Como se forma a nota de um álbum?',
          ['Só pelas faixas', 'Pelas faixas e pelos aspetos do álbum juntos (75% e 25% se não mudares)', 'Por quanto o ouves'],
          'A média das faixas e os aspetos do álbum misturam-se. Se só uma metade tem nota, essa metade é a nota.'],
        q2: ['Uma música não tem letra. O que fazes?',
          ['Dás 0 a {{t:rtc_lyr}}', 'Marcas {{t:rtc_lyr}} como {{t:rte_na}}', 'Saltas a música'],
          '{{t:rte_na}} deixa-a fora da média, por isso uma instrumental não sai prejudicada.'],
        q3: ['Onde está o que ouves muito mas nunca avaliaste?',
          ['{{t:ar_todo}}', '{{t:rp_recent}}', '{{t:rp_top_artists}}'],
          '{{t:ar_todo}} mostra o que mais ouves sem nota, os mais ouvidos primeiro.']
      },
      tips: [
        'Avalia um álbum inteiro de uma vez no separador {{t:rte_tracks}}: um número por faixa.',
        'Uma instrumental? Marca {{t:rtc_lyr}} e {{t:rtc_voc}} como {{t:rte_na}} para não contarem.',
        '{{t:rp_rec_underplayed}}: o álbum a que dás boa nota mas quase nunca ouves.',
        'Toca num veredicto em {{t:ar_spread}} para veres só esses álbuns.'
      ]
    },
    events: {
      title: '{{t:sec_events_title}}',
      promise: 'Aniversários, datas de álbuns, lançamentos e concertos dos artistas que ouves, e o que ouvias neste mesmo dia há anos.',
      scenes: {
        today: { title: '{{t:ev_tab_today}}', spots: {
          title: ['{{t:sec_events_title}}', 'Dos teus 50 artistas top (muda quantos em {{t:set_title}}).'],
          info: ['{{t:ev_info_title}}', 'Quanto foi encontrado, e quando.'],
          refresh: ['{{t:ev_refresh_title}}', 'Volta a procurar tudo.'],
          tabs: ['Quatro separadores', '{{t:ev_tab_today}}, {{t:ev_tab_coming}}, {{t:ev_tab_recent}} e {{t:ev_tab_calendar}}.'],
          types: ['Tipos', 'Toca num para o esconderes ou voltares a mostrar.'],
          bday: ['{{t:ev_type_birthdays}}', 'Os aniversários dos artistas.'],
          shows: ['{{t:ev_type_shows}}', 'Concertos ao vivo (do Ticketmaster).'],
          play: ['{{t:ev_play_all}}', 'Põe no leitor o que o separador mostra.'],
          pl: ['{{t:pl_section_btn}}', 'Guarda numa playlist o que o separador mostra.'],
          day: ['Hoje', 'Os aniversários, lançamentos e concertos de hoje.'],
          card: ['Um evento', 'Clica para Spotify, uma playlist, o leitor ou uma pesquisa.'],
          anniv: ['{{t:ev_today_anniversaries}}', 'Lançamentos que fazem anos hoje, os que mais ouviste primeiro.'],
          tm: ['{{t:time_machine_title}}', 'O que ouvias neste dia em anos anteriores.'],
          tmtypes: ['{{t:time_machine_songs}} / {{t:time_machine_artists}} / {{t:time_machine_albums}}', 'Liga ou desliga cada um.'],
          tmpl: ['{{t:pl_section_btn}}', 'Guarda a {{t:time_machine_title}} como playlist.'],
          tmcard: ['Uma memória', 'Com o ano em que a ouviste. Arrasta a fila para a percorreres.']
        } },
        menu: { title: 'O que um cartão abre', spots: {
          menu: ['Opções', 'Pesquisar no Spotify, juntar a uma playlist ou ao leitor, ou pesquisar no Google.'],
          card: ['O cartão', 'Todos os cartões deste separador funcionam da mesma forma.'],
          tm: ['Tipos', 'O que a {{t:time_machine_title}} mostra.']
        } },
        coming: { title: '{{t:ev_tab_coming}}', spots: {
          tab: ['{{t:ev_tab_coming}}', 'O que aí vem.'],
          views: ['{{t:ev_view_reel}} / {{t:ev_view_tiles}} / {{t:ev_view_table}} / {{t:ev_view_list}}', 'Quatro formas de ver.'],
          week: ['{{t:ev_group_week}}', 'Os próximos sete dias.'],
          soon: ['{{t:ev_group_soon}}', 'Até daqui a um mês.'],
          later: ['{{t:ev_group_later}}', 'Mais à frente: lançamentos anunciados e datas de digressão.'],
          card: ['Um evento', 'A data, o artista e o que é.'],
          when: ['Quando', 'Quantos dias faltam.'],
          more: ['Ver todos', 'As datas de álbuns ficam só nas que mais ouviste. Isto mostra-as todas.'],
          note: ['Concertos', 'Quantos concertos foram encontrados e onde estão os bilhetes.']
        } },
        table: { title: '{{t:ev_view_table}}', spots: {
          views: ['{{t:ev_view_table}}', 'Os mesmos eventos numa tabela.'],
          table: ['A tabela', 'Uma linha por evento.'],
          th: ['Colunas', '{{t:ev_th_event}}, {{t:ev_th_artist}}, {{t:ev_th_date}} e {{t:ev_th_type}}.']
        } },
        recent: { title: '{{t:ev_tab_recent}}', spots: {
          tab: ['{{t:ev_tab_recent}}', 'O que acabou de acontecer.'],
          past: ['{{t:ev_group_past_week}}', 'Os últimos sete dias.'],
          weeks: ['{{t:ev_group_past_weeks}}', 'Até há um mês.'],
          earlier: ['{{t:ev_group_earlier}}', 'Lançamentos dos últimos seis meses.'],
          more: ['Ver todos', 'Todas as datas de álbuns.'],
          nmf: ['New Music Friday', 'Os lançamentos desta semana no Deezer, para toda a gente, não só os teus artistas.'],
          fridays: ['{{t:ev_nmf_past}}', 'Sextas-feiras anteriores que este navegador guardou.']
        } },
        cal: { title: '{{t:ev_tab_calendar}}', spots: {
          tab: ['{{t:ev_tab_calendar}}', 'Cada evento num calendário.'],
          prev: ['{{t:ev_cal_prev}}', 'O mês anterior.'],
          title: ['O mês', 'O que estás a ver.'],
          next: ['{{t:ev_cal_next}}', 'O mês seguinte.'],
          views: ['{{t:ev_cal_month}} / {{t:ev_cal_week}} / {{t:ev_cal_day}}', 'Quanto ver de uma vez.'],
          today: ['Hoje', 'Com uma moldura.'],
          num: ['Um dia', 'Clica no número para abrires esse dia.'],
          ev: ['Um evento', 'Clica para veres opções.'],
          more: ['Mais', 'O resto dos eventos desse dia.']
        } },
        week: { title: '{{t:ev_cal_week}}', spots: {
          views: ['{{t:ev_cal_week}}', 'Sete dias lado a lado.'],
          title: ['A semana', 'Anda de semana em semana com as setas.'],
          today: ['Hoje', 'Todos os eventos do dia, em lista.']
        } },
        day: { title: '{{t:ev_cal_day}}', spots: {
          views: ['{{t:ev_cal_day}}', 'Um dia.'],
          title: ['O dia', 'Anda de dia em dia com as setas.'],
          card: ['Um evento', 'Em cartões, como em {{t:ev_tab_today}}.'],
          anniv: ['{{t:ev_cal_anniversaries}}', 'As datas de álbuns desse dia.']
        } },
        info: { title: '{{t:ev_info_title}}', spots: {
          info: ['ⓘ', 'Abre ou fecha esta linha.'],
          status: ['Em resumo', 'Aniversários, datas de álbuns, eventos próximos e recentes encontrados, de quantos artistas e quando.'],
          refresh: ['{{t:ev_refresh_title}}', 'Volta a procurar tudo agora (atualiza sozinho uma vez por dia).']
        } }
      },
      howto: {
        today: { title: 'O que há hoje', slides: [
          'Os aniversários, lançamentos e concertos de hoje.',
          'Clica num cartão…',
          '…para Spotify, uma playlist, o leitor ou uma pesquisa.',
          'Lançamentos que fazem anos hoje.',
          'E o que ouvias neste dia há anos.'
        ] },
        coming: { title: 'Vê o que aí vem', slides: [
          'Abre {{t:ev_tab_coming}}.',
          'Primeiro esta semana.',
          'Mostra todas as datas de álbuns.',
          'Muda a vista…',
          '…para {{t:ev_view_table}}, por exemplo.'
        ] },
        cal: { title: 'Usa o calendário', slides: [
          'Abre {{t:ev_tab_calendar}}.',
          '{{t:ev_cal_month}}, {{t:ev_cal_week}} ou {{t:ev_cal_day}}.',
          'Clica no número de um dia para o abrires.',
          'O dia inteiro, em cartões.',
          '{{t:ev_cal_week}}: sete dias lado a lado.'
        ] },
        filter: { title: 'Só o que queres', slides: [
          'Toca num tipo para o esconderes.',
          '{{t:ev_type_shows}} para as datas ao vivo.',
          'Ouve o que sobrou…',
          '…ou guarda-o como playlist.'
        ] },
        recent: { title: 'Põe-te em dia', slides: [
          'Abre {{t:ev_tab_recent}}.',
          'Primeiro a última semana.',
          'New Music Friday: os lançamentos desta semana.',
          'E sextas-feiras anteriores.'
        ] }
      },
      options: {
        page: { title: 'O separador todo', items: {
          types: ['Tipos', '{{t:ev_type_birthdays}}, {{t:ev_type_albums}}, {{t:ev_type_singles}}, {{t:ev_type_eps}}, {{t:ev_type_other}}, {{t:ev_type_shows}}.'],
          view: ['Vista', '{{t:ev_view_reel}}, {{t:ev_view_tiles}}, {{t:ev_view_table}} ou {{t:ev_view_list}} ({{t:ev_tab_coming}} e {{t:ev_tab_recent}}).'],
          play: ['{{t:ev_play_all}}', 'O separador no leitor.'],
          pl: ['{{t:pl_section_btn}}', 'O separador como playlist.'],
          refresh: ['{{t:ev_refresh_title}}', 'Procurar de novo.'],
          limit: ['Artistas top', 'Quantos dos teus artistas top seguir. Em {{t:set_title}}.']
        } },
        cal: { title: '{{t:ev_tab_calendar}}', items: {
          views: ['{{t:ev_cal_month}} / {{t:ev_cal_week}} / {{t:ev_cal_day}}', 'Quanto de uma vez.'],
          nav: ['‹ ›', 'Antes e depois.']
        } },
        tm: { title: '{{t:time_machine_title}}', items: {
          types: ['{{t:time_machine_songs}} / {{t:time_machine_artists}} / {{t:time_machine_albums}}', 'O que mostra.'],
          pl: ['{{t:pl_section_btn}}', 'Como playlist.']
        } }
      },
      challenges: {
        'ev.tab': ['Abre outro separador', '{{t:ev_tab_coming}}, {{t:ev_tab_recent}} ou {{t:ev_tab_calendar}}.'],
        'ev.type': ['Esconde ou mostra um tipo', 'Os botões por baixo dos separadores.'],
        'ev.view': ['Muda a vista', 'Em {{t:ev_tab_coming}} ou {{t:ev_tab_recent}}.'],
        'ev.cal': ['Muda o calendário para {{t:ev_cal_week}} ou {{t:ev_cal_day}}', 'Em {{t:ev_tab_calendar}}.'],
        'ev.day': ['Abre um dia', 'Clica no número de um dia do calendário.'],
        'ev.tm': ['Muda o que a {{t:time_machine_title}} mostra', 'Em {{t:ev_tab_today}}.'],
        'ev.card': ['Clica num cartão', 'Qualquer evento ou cartão da {{t:time_machine_title}}.'],
        'ev.info': ['Abre o ⓘ', 'Ao lado do título.']
      },
      quiz: {
        q1: ['O que é a {{t:time_machine_title}}?',
          ['O que ouvias neste dia em anos anteriores', 'Os lançamentos da próxima semana', 'Uma forma de rebobinar o top'],
          'Mostra as músicas, artistas e álbuns que ouvias neste mesmo dia há anos.'],
        q2: ['Como abres um dia no calendário?',
          ['Duplo clique no mês', 'Clicar no número do dia', 'Abrir {{t:ev_tab_today}}'],
          'O número abre esse dia, com todos os eventos em cartões.'],
        q3: ['De quem são os lançamentos do New Music Friday?',
          ['Só dos teus artistas top', 'De toda a gente: os lançamentos desta semana no Deezer', 'Só de álbuns que avaliaste'],
          'O New Music Friday não é filtrado pelos teus artistas, por isso serve para descobrires novos.']
      },
      tips: [
        'A {{t:time_machine_title}} mostra o que ouvias neste mesmo dia há anos.',
        'Clica no número de um dia no calendário para veres tudo desse dia.',
        'Preferes uma lista? {{t:ev_tab_coming}} e {{t:ev_tab_recent}} têm quatro vistas.',
        'Não ligas a aniversários? Toca em {{t:ev_type_birthdays}} para os esconderes em todo o lado.'
      ]
    },
    playlists: { title: 'Playlists', promise: 'Guarda tops como playlists, e deixa-as fazerem-se sozinhas.' },
    rawdata: { title: 'Dados brutos', promise: 'Cada play: procura, corrige, exporta.' },
    board: { title: 'O Fórum', promise: 'Sugere ideias, reporta erros e vota.' },
    settings: { title: 'Definições e a tua conta', promise: 'Fontes de dados, definições dos tops, temas, sessão e cópias de segurança.' }
  }
};
