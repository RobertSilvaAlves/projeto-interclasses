// Sistema Administrativo das Olimpíadas Interclasses Unimaua
class AdminSystem {
    constructor() {
        this.password = this.loadPassword();
        this.history = this.loadHistory();
        this.setupEventListeners();
        this.loadPlayerSelects();
    }

    setupEventListeners() {
        // Event listener para tecla Enter no campo de senha
        document.getElementById('passwordInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkPassword();
            }
        });

        // Event listener para tecla Enter no campo de nova senha
        document.getElementById('newPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.changePassword();
            }
        });
    }

    loadPassword() {
        return localStorage.getItem('adminPassword') || 'admin123';
    }

    loadHistory() {
        const history = localStorage.getItem('adminHistory');
        return history ? JSON.parse(history) : [];
    }

    saveHistory() {
        localStorage.setItem('adminHistory', JSON.stringify(this.history));
    }

    addToHistory(action) {
        const timestamp = new Date().toLocaleString('pt-BR');
        this.history.unshift({ action, timestamp });
        
        // Manter apenas os últimos 50 registros
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyLog = document.getElementById('historyLog');
        if (!historyLog) return;

        historyLog.innerHTML = this.history.map(item => `
            <div class="history-item">
                <div class="time">${item.timestamp}</div>
                <div class="action">${item.action}</div>
            </div>
        `).join('');
    }

    checkPassword() {
        const input = document.getElementById('passwordInput');
        const password = input.value.trim();

        if (password === this.password) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'grid';
            this.updateHistoryDisplay();
            this.addToHistory('🔐 Login realizado com sucesso');
            input.value = '';
        } else {
            this.showNotification('❌ Senha incorreta!', 'error');
            input.value = '';
            input.focus();
        }
    }

    changePassword() {
        const newPassword = document.getElementById('newPassword').value.trim();
        
        if (newPassword.length < 3) {
            this.showNotification('❌ A nova senha deve ter pelo menos 3 caracteres!', 'error');
            return;
        }

        this.password = newPassword;
        localStorage.setItem('adminPassword', newPassword);
        document.getElementById('newPassword').value = '';
        this.showNotification('✅ Senha alterada com sucesso!', 'success');
        this.addToHistory('🔑 Senha administrativa alterada');
    }

    resetData() {
        if (confirm('⚠️ ATENÇÃO: Isso irá apagar TODOS os dados (pontuações, jogadores, jogos e histórico). Esta ação não pode ser desfeita!\n\nTem certeza que deseja continuar?')) {
            if (confirm('🔴 CONFIRMAÇÃO FINAL: Todos os dados serão perdidos permanentemente!\n\nDigite "CONFIRMAR" para prosseguir:')) {
                localStorage.removeItem('scores');
                localStorage.removeItem('players');
                localStorage.removeItem('games');
                localStorage.removeItem('adminHistory');
                
                this.history = [];
                this.saveHistory();
                this.updateHistoryDisplay();
                
                this.showNotification('🗑️ Todos os dados foram resetados!', 'success');
                this.addToHistory('🗑️ Reset completo de todos os dados');
                
                // Limpar formulários
                this.clearForm();
            }
        }
    }

    clearForm() {
        document.getElementById('sportSelect').value = '';
        document.getElementById('classSelect').value = '';
        document.getElementById('pointsInput').value = '0';
        document.getElementById('playerTypeSelect').value = '';
        document.getElementById('playerClassSelect').value = '';
        document.getElementById('playerName').value = '';
        document.getElementById('playerNumber').value = '';
        document.getElementById('gameSportSelect').value = '';
        document.getElementById('player1Select').value = '';
        document.getElementById('player2Select').value = '';
        document.getElementById('player1Score').value = '0';
        document.getElementById('player2Score').value = '0';
        
        // Esconder campo de número
        document.getElementById('playerNumberGroup').style.display = 'none';
    }

    // Função para alternar campos baseado no tipo selecionado
    togglePlayerFields() {
        const playerType = document.getElementById('playerTypeSelect').value;
        const numberGroup = document.getElementById('playerNumberGroup');
        const numberInput = document.getElementById('playerNumber');
        
        if (playerType === 'player') {
            numberGroup.style.display = 'block';
            numberInput.required = true;
        } else if (playerType === 'team') {
            numberGroup.style.display = 'none';
            numberInput.required = false;
            numberInput.value = '';
        } else {
            numberGroup.style.display = 'none';
            numberInput.required = false;
            numberInput.value = '';
        }
    }

    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // Estilo baseado no tipo
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #4ecdc4, #45b7d1)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #ff6b35, #e74c3c)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #f7931e, #ff6b35)';
        }

        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // ===== NOVAS FUNCIONALIDADES =====

    loadPlayerSelects() {
        this.updatePlayerSelects();
    }

    updatePlayerSelects() {
        const players = this.loadPlayers();
        const playerOptions = Object.values(players).map(player => {
            const typeIcon = player.type === 'player' ? '👤' : '🏆';
            const numberText = player.type === 'player' && player.number ? ` (${player.number})` : '';
            return `<option value="${player.id}">${typeIcon} ${player.name}${numberText} - ${player.class}</option>`;
        }).join('');

        const player1Select = document.getElementById('player1Select');
        const player2Select = document.getElementById('player2Select');

        if (player1Select) {
            player1Select.innerHTML = '<option value="">Selecione o jogador/time</option>' + playerOptions;
        }
        if (player2Select) {
            player2Select.innerHTML = '<option value="">Selecione o jogador/time</option>' + playerOptions;
        }
    }

    loadPlayers() {
        const players = localStorage.getItem('players');
        return players ? JSON.parse(players) : {};
    }

    loadGames() {
        const games = localStorage.getItem('games');
        return games ? JSON.parse(games) : [];
    }

    savePlayers(players) {
        localStorage.setItem('players', JSON.stringify(players));
        this.updateLastUpdate();
    }

    saveGames(games) {
        localStorage.setItem('games', JSON.stringify(games));
        this.updateLastUpdate();
    }

    updateLastUpdate() {
        const now = new Date();
        const lastUpdate = now.toLocaleString('pt-BR');
        localStorage.setItem('lastUpdate', lastUpdate);
    }

    addPlayer() {
        const playerType = document.getElementById('playerTypeSelect').value;
        const className = document.getElementById('playerClassSelect').value;
        const name = document.getElementById('playerName').value.trim();
        const number = parseInt(document.getElementById('playerNumber').value);

        if (!playerType || !className || !name) {
            this.showNotification('❌ Preencha todos os campos obrigatórios!', 'error');
            return;
        }

        // Validações específicas para jogador individual
        if (playerType === 'player') {
            if (!number || number < 1 || number > 999) {
                this.showNotification('❌ Para jogadores individuais, o número deve estar entre 1 e 999!', 'error');
                return;
            }
        }

        const players = this.loadPlayers();
        
        // Verificar se o número já existe (apenas para jogadores individuais)
        if (playerType === 'player') {
            const existingPlayer = Object.values(players).find(player => 
                player.number === number && player.type === 'player'
            );
            if (existingPlayer) {
                this.showNotification(`❌ O número ${number} já está sendo usado por ${existingPlayer.name}!`, 'error');
                return;
            }
        }

        // Verificar se o nome já existe (para ambos os tipos)
        const existingName = Object.values(players).find(player => 
            player.name.toLowerCase() === name.toLowerCase() && 
            player.class === className &&
            player.type === playerType
        );
        if (existingName) {
            this.showNotification(`❌ Já existe um ${playerType === 'player' ? 'jogador' : 'time'} com o nome "${name}" nesta sala!`, 'error');
            return;
        }

        // Criar ID único
        const playerId = `${playerType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Adicionar jogador/time
        players[playerId] = {
            id: playerId,
            name: name,
            class: className,
            type: playerType
        };

        // Adicionar número apenas para jogadores individuais
        if (playerType === 'player') {
            players[playerId].number = number;
        }

        this.savePlayers(players);
        this.updatePlayerSelects();
        this.clearPlayerForm();
        
        const typeText = playerType === 'player' ? 'jogador' : 'time';
        this.showNotification(`✅ ${typeText.charAt(0).toUpperCase() + typeText.slice(1)} ${name} cadastrado com sucesso!`, 'success');
        this.addToHistory(`👥 ${typeText.charAt(0).toUpperCase() + typeText.slice(1)} cadastrado: ${name}${playerType === 'player' ? ` (${number})` : ''} - ${className}`);

        // Atualizar página principal se estiver aberta
        if (window.opener && window.opener.scoreSystem) {
            window.opener.scoreSystem.players = players;
            window.opener.scoreSystem.updateTable();
        }
    }

    clearPlayerForm() {
        document.getElementById('playerTypeSelect').value = '';
        document.getElementById('playerClassSelect').value = '';
        document.getElementById('playerName').value = '';
        document.getElementById('playerNumber').value = '';
        
        // Esconder campo de número
        document.getElementById('playerNumberGroup').style.display = 'none';
    }

    registerGame() {
        const sport = document.getElementById('gameSportSelect').value;
        const player1Id = document.getElementById('player1Select').value;
        const player2Id = document.getElementById('player2Select').value;
        const player1Score = parseInt(document.getElementById('player1Score').value);
        const player2Score = parseInt(document.getElementById('player2Score').value);

        if (!sport || !player1Id || !player2Id) {
            this.showNotification('❌ Selecione o esporte e os dois jogadores!', 'error');
            return;
        }

        if (player1Id === player2Id) {
            this.showNotification('❌ Os jogadores devem ser diferentes!', 'error');
            return;
        }

        if (player1Score < 0 || player2Score < 0) {
            this.showNotification('❌ Os placares não podem ser negativos!', 'error');
            return;
        }

        const players = this.loadPlayers();
        const player1 = players[player1Id];
        const player2 = players[player2Id];

        if (!player1 || !player2) {
            this.showNotification('❌ Jogador não encontrado!', 'error');
            return;
        }

        const games = this.loadGames();
        
        // Criar ID único para o jogo
        const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Adicionar jogo
        games.push({
            id: gameId,
            sport: sport,
            player1Id: player1Id,
            player2Id: player2Id,
            player1Score: player1Score,
            player2Score: player2Score,
            timestamp: new Date().toISOString()
        });

        this.saveGames(games);
        this.clearGameForm();
        
        // Determinar resultado
        let result;
        if (player1Score > player2Score) {
            result = `${player1.name} venceu ${player1Score} x ${player2Score}`;
        } else if (player2Score > player1Score) {
            result = `${player2.name} venceu ${player2Score} x ${player1Score}`;
        } else {
            result = `Empate ${player1Score} x ${player2Score}`;
        }

        this.showNotification(`✅ Jogo registrado: ${result}`, 'success');
        this.addToHistory(`⚽ Jogo registrado: ${player1.name} ${player1Score} x ${player2Score} ${player2.name} (${sport})`);

        // Atualizar página principal se estiver aberta
        if (window.opener && window.opener.scoreSystem) {
            window.opener.scoreSystem.games = games;
            window.opener.scoreSystem.updateTable();
        }
    }

    clearGameForm() {
        document.getElementById('gameSportSelect').value = '';
        document.getElementById('player1Select').value = '';
        document.getElementById('player2Select').value = '';
        document.getElementById('player1Score').value = '0';
        document.getElementById('player2Score').value = '0';
    }

    // ===== SISTEMA ANTIGO (MANTIDO PARA COMPATIBILIDADE) =====

    addScore() {
        const sport = document.getElementById('sportSelect').value;
        const className = document.getElementById('classSelect').value;
        const points = parseInt(document.getElementById('pointsInput').value);

        if (!sport || !className || points < 0) {
            this.showNotification('❌ Preencha todos os campos corretamente!', 'error');
            return;
        }

        // Adicionar pontuação usando o sistema antigo
        if (window.opener && window.opener.addScoreFromAdmin) {
            window.opener.addScoreFromAdmin(sport, className, points);
        } else {
            this.addScoreToStorage(sport, className, points);
        }

        this.clearForm();
        this.showNotification(`✅ ${points} pontos adicionados para ${className} em ${sport}!`, 'success');
        this.addToHistory(`📊 ${points} pontos adicionados: ${className} - ${sport}`);
    }

    addScoreToStorage(sport, className, points) {
        const scores = JSON.parse(localStorage.getItem('scores') || '{}');
        
        if (!scores[sport]) {
            scores[sport] = {};
        }
        
        if (!scores[sport][className]) {
            scores[sport][className] = { points: 0 };
        }
        
        scores[sport][className].points += points;
        localStorage.setItem('scores', JSON.stringify(scores));
        this.updateLastUpdate();
    }
}

// Funções globais para chamadas do HTML
window.checkPassword = function() {
    window.adminSystem.checkPassword();
};

window.changePassword = function() {
    window.adminSystem.changePassword();
};

window.resetData = function() {
    window.adminSystem.resetData();
};

window.addScore = function() {
    window.adminSystem.addScore();
};

window.addPlayer = function() {
    window.adminSystem.addPlayer();
};

window.registerGame = function() {
    window.adminSystem.registerGame();
};

window.togglePlayerFields = function() {
    window.adminSystem.togglePlayerFields();
};

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    window.adminSystem = new AdminSystem();
});

// Adicionar estilos CSS para animações de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
