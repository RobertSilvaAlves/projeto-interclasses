// Sistema de Pontuação das Olimpíadas Interclasses Unimaua
class ScoreSystem {
    constructor() {
        this.currentSport = 'geral';
        this.currentYear = 'todos';
        this.scores = this.loadScores();
        this.lastUpdate = this.loadLastUpdate();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTable();
        this.updateLastUpdate();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Tabs de esportes
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSport(e.target.dataset.sport);
            });
        });

        // Filtros por ano escolar
        document.querySelectorAll('.year-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchYear(e.target.dataset.year);
            });
        });

        // Atualização automática quando a página ganha foco
        window.addEventListener('focus', () => {
            this.refreshData();
        });

        // Atualização quando dados são modificados em outra aba
        window.addEventListener('storage', (e) => {
            if (e.key === 'olympicScores' || e.key === 'olympicLastUpdate') {
                this.refreshData();
            }
        });
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

    loadScores() {
        const saved = localStorage.getItem('olympicScores');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Dados iniciais padrão
        return {
            geral: {},
            futebol: {},
            dama: {},
            xadrez: {},
            'pique-bandeira': {},
            volei: {},
            basquete: {}
        };
    }

    loadLastUpdate() {
        const saved = localStorage.getItem('olympicLastUpdate');
        return saved ? saved : new Date().toLocaleString('pt-BR');
    }

    refreshData() {
        this.scores = this.loadScores();
        this.lastUpdate = this.loadLastUpdate();
        this.updateTable();
        this.updateLastUpdate();
    }

    updateTable() {
        const tbody = document.getElementById('tableBody');
        const sportData = this.scores[this.currentSport];
        
        if (!sportData || Object.keys(sportData).length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 40px; color: #7f8c8d;">Nenhuma pontuação registrada ainda</td></tr>';
            return;
        }

        // Filtrar turmas por ano se necessário
        let filteredData = sportData;
        if (this.currentYear !== 'todos') {
            filteredData = {};
            Object.keys(sportData).forEach(className => {
                if (this.currentYear === '1M' && className.startsWith('1M')) {
                    filteredData[className] = sportData[className];
                } else if (this.currentYear === '2M' && className.startsWith('2M')) {
                    filteredData[className] = sportData[className];
                } else if (this.currentYear === '3M' && className.startsWith('3M')) {
                    filteredData[className] = sportData[className];
                } else if (className.startsWith(this.currentYear)) {
                    filteredData[className] = sportData[className];
                }
            });
        }

        if (Object.keys(filteredData).length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 40px; color: #7f8c8d;">Nenhuma turma encontrada para este ano</td></tr>';
            return;
        }

        // Converter para array e ordenar por pontos (posição determinada pelos pontos)
        const sortedClasses = Object.entries(filteredData)
            .map(([className, data]) => ({
                name: className,
                points: data.points || 0
            }))
            .sort((a, b) => {
                // Ordenar por pontos (maior pontuação = melhor posição)
                return b.points - a.points;
            });

        tbody.innerHTML = '';

        sortedClasses.forEach((classData, index) => {
            const row = document.createElement('tr');
            
            // Adicionar classes especiais para top 3 (posição determinada pelos pontos)
            if (index === 0) row.classList.add('gold');
            else if (index === 1) row.classList.add('silver');
            else if (index === 2) row.classList.add('bronze');

            // Definir ícone de medalha para as 3 primeiras posições
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

            row.innerHTML = `
                <td>${positionIcon}</td>
                <td><strong>${classData.name}</strong></td>
                <td><strong>${classData.points.toLocaleString('pt-BR')}</strong></td>
            `;
            
            tbody.appendChild(row);
        });
    }

    updateLastUpdate() {
        document.getElementById('lastUpdate').textContent = this.lastUpdate;
    }

    startAutoRefresh() {
        // Atualizar a cada 30 segundos
        setInterval(() => {
            this.refreshData();
        }, 30000);
    }

    // Método para adicionar pontuação (chamado pela página admin)
    addScore(sport, className, points) {
        if (!this.scores[sport]) {
            this.scores[sport] = {};
        }
        
        if (!this.scores[sport][className]) {
            this.scores[sport][className] = {
                points: 0
            };
        }

        const classData = this.scores[sport][className];
        
        // Adicionar pontos (acumulativo)
        classData.points += points;

        // Atualizar classificação geral
        this.updateGeneralClassification();

        // Salvar no localStorage
        this.saveScores();
        this.updateLastUpdate();
        
        // Atualizar tabela se estiver no esporte correto
        if (this.currentSport === sport || this.currentSport === 'geral') {
            this.updateTable();
        }
    }

    updateGeneralClassification() {
        this.scores.geral = {};
        
        // Calcular pontos totais de todos os esportes
        Object.keys(this.scores).forEach(sport => {
            if (sport === 'geral') return;
            
            Object.keys(this.scores[sport]).forEach(className => {
                if (!this.scores.geral[className]) {
                    this.scores.geral[className] = {
                        points: 0
                    };
                }
                
                const sportData = this.scores[sport][className];
                const generalData = this.scores.geral[className];
                
                // Somar pontos de todos os esportes
                generalData.points += sportData.points || 0;
            });
        });
    }

    saveScores() {
        localStorage.setItem('olympicScores', JSON.stringify(this.scores));
        localStorage.setItem('olympicLastUpdate', new Date().toLocaleString('pt-BR'));
        
        // Disparar evento para outras abas
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'olympicScores',
            newValue: JSON.stringify(this.scores)
        }));
    }
}

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.scoreSystem = new ScoreSystem();
});

// Função global para comunicação com a página admin
window.addScoreFromAdmin = function(sport, className, points) {
    if (window.scoreSystem) {
        window.scoreSystem.addScore(sport, className, points);
    }
};
