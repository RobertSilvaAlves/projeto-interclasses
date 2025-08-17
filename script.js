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
            if (e.key === 'scores' || e.key === 'players' || e.key === 'games' || e.key === 'lastUpdate') {
                this.scores = this.loadScores();
                this.players = this.loadPlayers();
                this.games = this.loadGames();
                this.updateTable();
                this.updateLastUpdate();
            }
        });

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
            xadrez: {},
            'pique-bandeira': {},
            volei: {},
            basquete: {}
        };
    }

    loadPlayers() {
        const players = localStorage.getItem('players');
        return players ? JSON.parse(players) : {};
    }

    loadGames() {
        const games = localStorage.getItem('games');
        return games ? JSON.parse(games) : [];
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

    updateLastUpdate() {
        const now = new Date();
        const lastUpdate = now.toLocaleString('pt-BR');
        localStorage.setItem('lastUpdate', lastUpdate);
        
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = lastUpdate;
        }
    }

    calculatePlayerStats(playerId) {
        const playerGames = this.games.filter(game => 
            game.player1Id === playerId || game.player2Id === playerId
        );

        let wins = 0, draws = 0, losses = 0, points = 0;

        playerGames.forEach(game => {
            if (game.player1Id === playerId) {
                if (game.player1Score > game.player2Score) {
                    wins++;
                    points += 100;
                } else if (game.player1Score === game.player2Score) {
                    draws++;
                    points += 50;
                } else {
                    losses++;
                }
            } else if (game.player2Id === playerId) {
                if (game.player2Score > game.player1Score) {
                    wins++;
                    points += 100;
                } else if (game.player2Score === game.player1Score) {
                    draws++;
                    points += 50;
                } else {
                    losses++;
                }
            }
        });

        return { wins, draws, losses, points, games: playerGames.length };
    }

    calculateClassStats(className) {
        const classPlayers = Object.values(this.players).filter(player => player.class === className);
        let totalWins = 0, totalDraws = 0, totalLosses = 0, totalPoints = 0, totalGames = 0;

        classPlayers.forEach(player => {
            const stats = this.calculatePlayerStats(player.id);
            totalWins += stats.wins;
            totalDraws += stats.draws;
            totalLosses += stats.losses;
            totalPoints += stats.points;
            totalGames += stats.games;
        });

        return { wins: totalWins, draws: totalDraws, losses: totalLosses, points: totalPoints, games: totalGames };
    }

    updateTable() {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) return;

        let data = [];

        if (this.currentView === 'salas') {
            // Ranking das salas
            const allClasses = new Set();
            
            // Adicionar salas do sistema antigo
            Object.keys(this.scores[this.currentSport] || {}).forEach(className => {
                allClasses.add(className);
            });
            
            // Adicionar salas dos jogadores
            Object.values(this.players).forEach(player => {
                allClasses.add(player.class);
            });

            allClasses.forEach(className => {
                const classStats = this.calculateClassStats(className);
                const oldScore = this.scores[this.currentSport]?.[className]?.points || 0;
                
                data.push({
                    name: className,
                    points: classStats.points + oldScore,
                    wins: classStats.wins,
                    draws: classStats.draws,
                    losses: classStats.losses,
                    games: classStats.games,
                    type: 'class'
                });
            });
        } else {
            // Ranking dos jogadores
            Object.values(this.players).forEach(player => {
                const stats = this.calculatePlayerStats(player.id);
                const typeIcon = player.type === 'player' ? '👤' : '🏆';
                const numberText = player.type === 'player' && player.number ? ` (${player.number})` : '';
                
                data.push({
                    name: `${typeIcon} ${player.name}${numberText} - ${player.class}`,
                    points: stats.points,
                    wins: stats.wins,
                    draws: stats.draws,
                    losses: stats.losses,
                    games: stats.games,
                    type: 'player'
                });
            });
        }

        // Filtrar por ano se necessário
        if (this.currentYear !== 'todos') {
            data = data.filter(item => {
                if (item.type === 'class') {
                    return item.name.startsWith(this.currentYear);
                } else {
                    return item.name.includes(this.currentYear);
                }
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
