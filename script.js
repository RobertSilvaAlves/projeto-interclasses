// Sistema de Pontuação das Olimpíadas Interclasses Unimaua
class ScoreSystem {
    constructor() {
        this.scores = this.loadScores();
        this.players = this.loadPlayers();
        this.games = this.loadGames();
        this.currentSport = 'geral';
        this.currentYear = 'todos';
        this.currentView = 'salas';
        this.setupEventListeners();
        this.updateTable();
        this.startAutoRefresh();
        console.log('[ScoreSystem] inicializado. games:', this.games.length, 'players:', Object.keys(this.players).length);
    }

    setupEventListeners() {
        // Event listeners para tabs de esportes
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const sport = btn.dataset.sport;
                this.switchSport(sport);
            });
        });

        // Event listeners para filtros de ano
        document.querySelectorAll('.year-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const year = btn.dataset.year;
                this.switchYear(year);
            });
        });

        // Event listeners para seletor de visualização
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);
            });
        });

        // Menu hambúrguer para filtros de ano (mobile)
        const yearFiltersTitle = document.querySelector('.year-filters h3');
        if (yearFiltersTitle) {
            yearFiltersTitle.addEventListener('click', () => {
                this.toggleYearMenu();
            });
        }

        // Fechar menu ao clicar fora (mobile)
        document.addEventListener('click', (e) => {
            const yearFilters = document.querySelector('.year-filters');
            if (yearFilters && !yearFilters.contains(e.target)) {
                this.closeYearMenu();
            }
        });

        // Event listener para atualizações de storage
        window.addEventListener('storage', (e) => {
            console.log('[ScoreSystem] storage event recebido:', e.key, e.newValue ? e.newValue.substring(0,100) : null);
            // Recarrega quando scores/players/games/lastUpdate/ studentScores mudarem
            if (e.key === 'scores' || e.key === 'players' || e.key === 'games' || e.key === 'lastUpdate' || e.key === 'studentScores' || e.key === '__students_update_ts') {
                this.scores = this.loadScores();
                this.players = this.loadPlayers();
                this.games = this.loadGames();
                this.updateTable();
                this.updateLastUpdate();
            }
        });

        // Guard para evitar recursão nas atualizações de storage
        let isHandlingStorage = false;

        // Listener específico para storage que pode vir da mesma aba (fallback)
        try {
            const originalSetItem = localStorage.setItem.bind(localStorage);
            localStorage.setItem = (k, v) => {
                // Chama a implementação original primeiro
                originalSetItem(k, v);

                // Evita recursão: se já estivermos processando um evento de storage, retorna
                if (isHandlingStorage) {
                    console.log('[ScoreSystem] Evitando recursão para:', k);
                    return;
                }

                try {
                    isHandlingStorage = true;
                    if (k === 'studentScores' || k === 'scores' || k === 'players' || k === 'games' || k === 'lastUpdate') {
                        // Se a chave lastUpdate foi atualizada diretamente, não recarrega
                        if (k === 'lastUpdate') {
                            const lastUpdateElement = document.getElementById('lastUpdate');
                            if (lastUpdateElement) {
                                lastUpdateElement.textContent = v;
                            }
                        } else {
                            this.scores = this.loadScores();
                            this.players = this.loadPlayers();
                            this.games = this.loadGames();
                            console.log('[ScoreSystem] setItem interceptado para', k);
                            this.updateTable();
                            this.updateLastUpdate();
                        }
                    }
                } catch (e) {
                    console.warn('Erro ao reagir a setItem interceptado', e);
                } finally {
                    isHandlingStorage = false;
                }
            };
        } catch (e) {
            console.warn('Não foi possível sobrescrever localStorage.setItem:', e);
        }

        // Event listener para quando a janela ganha foco
        window.addEventListener('focus', () => {
            this.scores = this.loadScores();
            this.players = this.loadPlayers();
            this.games = this.loadGames();
            this.updateTable();
            this.updateLastUpdate();
        });
    }

    toggleYearMenu() {
        const yearFilters = document.querySelector('.year-filters');
        if (yearFilters) {
            yearFilters.classList.toggle('active');
        }
    }

    closeYearMenu() {
        const yearFilters = document.querySelector('.year-filters');
        if (yearFilters) {
            yearFilters.classList.remove('active');
        }
    }

    switchSport(sport) {
        this.currentSport = sport;
        
        // Atualizar botões ativos
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-sport="${sport}"]`).classList.add('active');
        
        this.updateTable();
    }

    switchYear(year) {
        this.currentYear = year;
        
        // Atualizar botões ativos
        document.querySelectorAll('.year-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-year="${year}"]`).classList.add('active');
        
        this.updateTable();
    }

    switchView(view) {
        this.currentView = view;
        
        // Atualizar botões ativos
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        this.updateTable();
    }

    loadScores() {
        const scores = localStorage.getItem('scores');
        return scores ? JSON.parse(scores) : {
            futebol: {},
            dama: {},
            'kings-league': {},
            'pique-bandeira': {},
            volei: {},
            basquete: {},
            futvolei: {},
            handbol: {},
            'prova-nacional': {},
            'organizacao': {},
            'destaque-turma': {}
        };
    }

    loadPlayers() {
        const players = localStorage.getItem('players');
        return players ? JSON.parse(players) : {};
    }

    loadGames() {
        const games = localStorage.getItem('games');
        const parsed = games ? JSON.parse(games) : [];
        console.log('[ScoreSystem] loadGames() carregou', parsed.length, 'jogos:', 
            parsed.map(g => `${g.gameType}/${g.sport}: ${g.player1Id} ${g.player1Score} x ${g.player2Score} ${g.player2Id}`));
        return parsed;
    }

    saveScores() {
        localStorage.setItem('scores', JSON.stringify(this.scores));
        this.updateLastUpdate();
    }

    savePlayers() {
        localStorage.setItem('players', JSON.stringify(this.players));
        this.updateLastUpdate();
    }

    saveGames() {
        localStorage.setItem('games', JSON.stringify(this.games));
        this.updateLastUpdate();
    }

    // Flag para evitar recursão infinita no updateLastUpdate
    _isUpdatingLastUpdate = false;

    updateLastUpdate() {
        // Se já estiver atualizando, retorna para evitar recursão
        if (this._isUpdatingLastUpdate) {
            console.log('[ScoreSystem] updateLastUpdate: evitando recursão');
            return;
        }

        try {
            this._isUpdatingLastUpdate = true;
            const now = new Date();
            const lastUpdate = now.toLocaleString('pt-BR');
            localStorage.setItem('lastUpdate', lastUpdate);
            
            const lastUpdateElement = document.getElementById('lastUpdate');
            if (lastUpdateElement) {
                lastUpdateElement.textContent = lastUpdate;
            }
        } finally {
            this._isUpdatingLastUpdate = false;
        }
    }

    calculatePlayerStats(playerId) {
        const playerGames = this.games.filter(game => 
            game.player1Id === playerId || game.player2Id === playerId
        );
        console.log('[ScoreSystem] calculatePlayerStats para', playerId, 'encontrou', playerGames.length, 'jogos');

        let wins = 0, draws = 0, losses = 0, points = 0;

        // Normalizar nomes de esportes para bater com os filtros da UI
        const sportMapping = {
            'futebol': 'futsal',
            'futsal': 'futsal',
            'dama': 'dama',
            'kings-league': 'kings-league',
            'pique-bandeira': 'pique-bandeira',
            'volei': 'volei',
            'basquete': 'basquete',
            'futvolei': 'futvolei',
            'handbol': 'handbol',
            'queimada': 'queimada'
        };

        playerGames.forEach(game => {
            // Normalizar sport do jogo
            const normalizedSport = sportMapping[game.sport] || game.sport;
            // Se estamos filtrando por esporte e não é o esporte atual, pula
            if (this.currentSport !== 'geral' && normalizedSport !== this.currentSport) {
                console.log('[ScoreSystem] Jogo', game.id, 'ignorado: esporte', normalizedSport, 'diferente do atual', this.currentSport);
                return;
            }

            let matchPoints = 0;
            let matchWon = false;
            let matchDraw = false;

            if (game.player1Id === playerId) {
                if (game.player1Score > game.player2Score) {
                    wins++;
                    matchWon = true;
                } else if (game.player1Score === game.player2Score) {
                    draws++;
                    matchDraw = true;
                } else {
                    losses++;
                }
                // Usar pontuação atribuída no registro
                matchPoints = game.player1BonusPoints || 0;
            } else if (game.player2Id === playerId) {
                if (game.player2Score > game.player1Score) {
                    wins++;
                    matchWon = true;
                } else if (game.player2Score === game.player2Score) {
                    draws++;
                    matchDraw = true;
                } else {
                    losses++;
                }
                // Usar pontuação atribuída no registro
                matchPoints = game.player2BonusPoints || 0;
            }

            console.log('[ScoreSystem] Jogo', game.id, 'computado:', normalizedSport, 
                '- Pontos:', matchPoints,
                matchWon ? '(vitória)' : matchDraw ? '(empate)' : '(derrota)',
                game.player1Id === playerId ? `P1 (${game.player1Score} x ${game.player2Score})` : `P2 (${game.player2Score} x ${game.player1Score})`);
            points += matchPoints;
        });

        console.log('[ScoreSystem] Total para player', playerId, ':', points, 'pts,', wins, 'V', draws, 'E', losses, 'D');
        return { wins, draws, losses, points, games: playerGames.length };
    }

    // Calcular estatísticas de alunos individuais
    calculateStudentStats(studentId) {
        const studentGames = this.games.filter(game => 
            (game.player1Id === `student_${studentId}` || game.player2Id === `student_${studentId}`) &&
            game.gameType === 'student'
        );
        console.log('[ScoreSystem] calculateStudentStats para student_' + studentId, 'encontrou', studentGames.length, 'jogos');

        let wins = 0, draws = 0, losses = 0, points = 0;

        // Usar mesmo mapeamento de esportes que calculatePlayerStats
        const sportMapping = {
            'futebol': 'futsal',
            'futsal': 'futsal',
            'dama': 'dama',
            'kings-league': 'kings-league',
            'pique-bandeira': 'pique-bandeira',
            'volei': 'volei',
            'basquete': 'basquete',
            'futvolei': 'futvolei',
            'handbol': 'handbol',
            'queimada': 'queimada'
        };

        studentGames.forEach(game => {
            // Normalizar sport do jogo
            const normalizedSport = sportMapping[game.sport] || game.sport;
            // Se estamos filtrando por esporte e não é o esporte atual, pula
            if (this.currentSport !== 'geral' && normalizedSport !== this.currentSport) {
                console.log('[ScoreSystem] Jogo estudante', game.id, 'ignorado: esporte', normalizedSport, 'diferente do atual', this.currentSport);
                return;
            }

            let matchPoints = 0;
            let matchWon = false;
            let matchDraw = false;

            if (game.player1Id === `student_${studentId}`) {
                if (game.player1Score > game.player2Score) {
                    wins++;
                    matchWon = true;
                } else if (game.player1Score === game.player2Score) {
                    draws++;
                    matchDraw = true;
                } else {
                    losses++;
                }
                // Usar pontuação atribuída no registro
                matchPoints = game.player1BonusPoints || 0;
            } else if (game.player2Id === `student_${studentId}`) {
                if (game.player2Score > game.player1Score) {
                    wins++;
                    matchWon = true;
                } else if (game.player2Score === game.player1Score) {
                    draws++;
                    matchDraw = true;
                } else {
                    losses++;
                }
                // Usar pontuação atribuída no registro
                matchPoints = game.player2BonusPoints || 0;
            }

            console.log('[ScoreSystem] Jogo estudante', game.id, 'computado:', normalizedSport, 
                '- Pontos:', matchPoints,
                matchWon ? '(vitória)' : matchDraw ? '(empate)' : '(derrota)',
                game.player1Id === `student_${studentId}` ? `P1 (${game.player1Score} x ${game.player2Score})` : `P2 (${game.player2Score} x ${game.player1Score})`);
            points += matchPoints;
        });

        console.log('[ScoreSystem] Total para estudante', studentId, ':', points, 'pts,', wins, 'V', draws, 'E', losses, 'D');
        return { wins, draws, losses, points, games: studentGames.length };
    }

    calculateClassStats(className) {
        const classPlayers = Object.values(this.players).filter(player => player.class === className);
        let totalWins = 0, totalDraws = 0, totalLosses = 0, totalPoints = 0, totalGames = 0;

        // Somar apenas vitórias/empates/derrotas/jogos a partir dos players (estatísticas)
        // NÃO somar os pontos dos jogos aqui para evitar duplicação com o objeto `scores`.
        classPlayers.forEach(player => {
            const stats = this.calculatePlayerStats(player.id);
            totalWins += stats.wins;
            totalDraws += stats.draws;
            totalLosses += stats.losses;
            totalGames += stats.games;
        });

        // A pontuação da turma vem exclusivamente do objeto `scores` (através de addScore/addScoreToClass)
        if (this.currentSport !== 'geral') {
            totalPoints = this.scores[this.currentSport]?.[className]?.points || 0;
        } else {
            Object.keys(this.scores).forEach(esporte => {
                totalPoints += this.scores[esporte]?.[className]?.points || 0;
            });
        }

        return { wins: totalWins, draws: totalDraws, losses: totalLosses, points: totalPoints, games: totalGames };
    }

    loadStudentScores() {
        const scores = localStorage.getItem('studentScores');
        return scores ? JSON.parse(scores) : {};
    }

    calculateClassStudentPoints(className, studentScores) {
        // Mapear nomes de turmas do JSON para códigos usados no sistema
        const classMapping = {
            '1A': '1° ano A',
            '1B': '1° ano B',
            '2A': '2° ano A',
            '2B': '2° ano B',
            '3A': '3° ano A',
            '3B': '3º ano B',
            '4A': '4° ano A',
            '5A': '5º Ano A',
            '6A': '6º Ano A',
            '7A': '7º Ano A',
            '8A': '8º Ano A',
            '9A': '9º Ano A',
            '1MA': '1º Ano Médio A',
            '1MB': '1º Ano Médio B',
            '2MA': '2º Ano Médio A',
            '2MB': '2º Ano Médio B',
            '3MA': '3º Ano Médio A',
            '3MB': '3º Ano Médio B'
        };

        const jsonClassName = classMapping[className] || className;
        let totalPoints = 0;

        // Somar pontos de todos os alunos da turma
        Object.keys(studentScores).forEach(studentKey => {
            if (studentKey.startsWith('student_')) {
                const studentId = studentKey.replace('student_', '');
                // Aqui você poderia verificar se o aluno pertence à turma específica
                // Por simplicidade, vamos somar todos os pontos dos alunos
                totalPoints += studentScores[studentKey].points || 0;
            }
        });

        return totalPoints;
    }

    updateTable() {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) return;

        // Carregar turmas reais do JSON de alunos
        let alunosPorTurma = {};
        try {
            alunosPorTurma = JSON.parse(localStorage.getItem('studentsData')) || {};
        } catch (e) {
            alunosPorTurma = {};
        }
        // Extrai turmas do 1º ano ao 9º ano e do ensino médio
        const turmasValidas = Object.keys(alunosPorTurma).filter(turma => {
            const matchRegular = turma.match(/^(\d+)[°º]?\s*ano\s*([A-B]?)/i);
            const matchMedio = turma.match(/^(\d+)[°º]?\s*ano\s*médio\s*([A-B]?)/i);
            if (!matchRegular && !matchMedio) return false;
            const ano = parseInt(matchRegular?.[1] || matchMedio?.[1]);
            return (ano >= 1 && ano <= 9) || (matchMedio && ano >= 1 && ano <= 3);
        });

    // Carregar studentScores uma vez
    const studentScores = this.loadStudentScores();
    console.log('[ScoreSystem] updateTable() - turmas:', turmasValidas.length, 'players:', Object.keys(this.players).length, 'games:', this.games.length, 'studentScoresKeys:', Object.keys(studentScores).length);

        let data = [];
        if (this.currentView === 'salas') {
            turmasValidas.forEach(turma => {
                // Extrai ano e sala
                const matchRegular = turma.match(/^(\d+)[°º]?\s*ano\s*([A-B]?)/i);
                const matchMedio = turma.match(/^(\d+)[°º]?\s*ano\s*médio\s*([A-B]?)/i);
                let ano;
                if (matchMedio) {
                    ano = matchMedio[1] + 'M'; // Adiciona M para diferenciar anos do ensino médio
                } else if (matchRegular) {
                    ano = matchRegular[1];
                } else {
                    ano = '';
                }
                const sala = (matchMedio || matchRegular)?.[2] || '';
                // Filtra por ano se necessário
                if (this.currentYear !== 'todos' && ano !== this.currentYear) return;
                // Pontuação do esporte (valores adicionados manualmente via admin.addScore)
                let pontos = 0;
                if (this.currentSport !== 'geral') {
                    pontos = this.scores[this.currentSport]?.[turma]?.points || 0;
                } else {
                    Object.keys(this.scores).forEach(esporte => {
                        pontos += this.scores[esporte]?.[turma]?.points || 0;
                    });
                }

                // Observação: a pontuação da turma vem exclusivamente do objeto `scores` (através de addScore/addScoreToClass).
                // Não somamos aqui pontos vindos de jogos nem pontos individuais dos alunos para evitar duplicação
                // e seguir a regra: "placar não é pontuação" e "pontuação dos alunos no time não conta para ranking geral".
                // Só mostra se houver alunos ou pontos
                if ((alunosPorTurma[turma] && alunosPorTurma[turma].length > 0) || pontos > 0) {
                    data.push({
                        name: turma,
                        points: pontos,
                        wins: '-',
                        draws: '-',
                        losses: '-',
                        games: '-',
                        type: 'class'
                    });
                }
            });
        } else {
            // Ranking dos jogadores/alunos individuais
            // Carregar alunos do JSON
            let alunosPorTurma = {};
            try {
                alunosPorTurma = JSON.parse(localStorage.getItem('studentsData')) || {};
            } catch (e) {
                alunosPorTurma = {};
            }
            // Extrai turmas do 1º ano ao 9º ano e do ensino médio
            const turmasValidas = Object.keys(alunosPorTurma).filter(turma => {
                const matchRegular = turma.match(/^(\d+)[°º]?\s*ano\s*([A-B]?)/i);
                const matchMedio = turma.match(/^(\d+)[°º]?\s*ano\s*médio\s*([A-B]?)/i);
                if (!matchRegular && !matchMedio) return false;
                const ano = parseInt(matchRegular?.[1] || matchMedio?.[1]);
                return (ano >= 1 && ano <= 9) || (matchMedio && ano >= 1 && ano <= 3);
            });
            // Para cada turma válida, lista alunos
            turmasValidas.forEach(turma => {
                const matchRegular = turma.match(/^(\d+)[°º]?\s*ano\s*([A-B]?)/i);
                const matchMedio = turma.match(/^(\d+)[°º]?\s*ano\s*médio\s*([A-B]?)/i);
                let ano;
                if (matchMedio) {
                    ano = matchMedio[1] + 'M'; // Adiciona M para diferenciar anos do ensino médio
                } else if (matchRegular) {
                    ano = matchRegular[1];
                } else {
                    ano = '';
                }
                if (this.currentYear !== 'todos' && ano !== this.currentYear) return;
                const alunos = alunosPorTurma[turma] || [];
                alunos.forEach(aluno => {
                    // Pontuação do esporte
                    let pontos = 0;
                    const alunoScore = studentScores[`student_${aluno.id}`];
                    if (alunoScore) {
                        if (this.currentSport !== 'geral' && alunoScore.sports && alunoScore.sports[this.currentSport]) {
                            pontos = alunoScore.sports[this.currentSport] || 0;
                        } else if (this.currentSport === 'geral') {
                            if (alunoScore.sports) {
                                Object.values(alunoScore.sports).forEach(p => pontos += p || 0);
                            } else if (alunoScore.points) {
                                pontos += alunoScore.points || 0;
                            }
                        }
                    }
                    // Adiciona pontos vindos de jogos (aluno vs aluno)
                    const statsAluno = this.calculateStudentStats(aluno.id);
                    pontos += statsAluno.points || 0;
                    // Só mostra se houver pontos ou registro
                    if (pontos > 0) {
                        data.push({
                            name: `👤 ${aluno.nome} - ${turma}`,
                            points: pontos,
                            wins: '-',
                            draws: '-',
                            losses: '-',
                            games: '-',
                            type: 'player'
                        });
                    }
                });
            });
            // Ranking dos jogadores cadastrados manualmente
            Object.values(this.players).forEach(player => {
                const match = player.class.match(/^(\d+)[°º]?\s*ano\s*([A-B]?)/i);
                const ano = match ? match[1] : '';
                if (this.currentYear !== 'todos' && ano !== this.currentYear) return;
                // Pontos vindos de atribuições manuais (scores) + pontos vindos dos jogos registrados
                let pontos = 0;
                if (this.currentSport !== 'geral') {
                    pontos = this.scores[this.currentSport]?.[player.class]?.points || 0;
                } else {
                    Object.keys(this.scores).forEach(esporte => {
                        pontos += this.scores[esporte]?.[player.class]?.points || 0;
                    });
                }
                const stats = this.calculatePlayerStats(player.id);
                pontos += stats.points || 0;
                const typeIcon = player.type === 'player' ? '👤' : '🏆';
                const numberText = player.type === 'player' && player.number ? ` (${player.number})` : '';
                data.push({
                    name: `${typeIcon} ${player.name}${numberText} - ${player.class}`,
                    points: pontos,
                    wins: '-',
                    draws: '-',
                    losses: '-',
                    games: '-',
                    type: 'player'
                });
            });
        }
        // Ordenar por pontos (maior para menor)
        data.sort((a, b) => b.points - a.points);
        // Gerar HTML da tabela
        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 30px; color: #666; font-style: italic;">
                        Nenhuma pontuação registrada ainda
                    </td>
                </tr>
            `;
            return;
        }
        tableBody.innerHTML = data.map((item, index) => {
            let positionIcon = '';
            if (index === 0) {
                positionIcon = '🥇 1º';
            } else if (index === 1) {
                positionIcon = '🥈 2º';
            } else if (index === 2) {
                positionIcon = '🥉 3º';
            } else {
                positionIcon = `${index + 1}º`;
            }
            return `
                <tr>
                    <td>${positionIcon}</td>
                    <td><strong>${item.name}</strong></td>
                    <td><strong>${item.points.toLocaleString('pt-BR')}</strong></td>
                    <td>${item.wins}</td>
                    <td>${item.draws}</td>
                    <td>${item.losses}</td>
                    <td>${item.games}</td>
                </tr>
            `;
        }).join('');
    }

    startAutoRefresh() {
        setInterval(() => {
            this.updateTable();
        }, 30000); // Atualiza a cada 30 segundos
    }
}

// Função global para adicionar pontuação (sistema antigo)
window.addScoreFromAdmin = function(sport, className, points) {
    if (window.scoreSystem) {
        if (!window.scoreSystem.scores[sport]) {
            window.scoreSystem.scores[sport] = {};
        }
        if (!window.scoreSystem.scores[sport][className]) {
            window.scoreSystem.scores[sport][className] = { points: 0 };
        }
        window.scoreSystem.scores[sport][className].points += points;
        window.scoreSystem.saveScores();
        window.scoreSystem.updateTable();
    }
};

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    window.scoreSystem = new ScoreSystem();
});
