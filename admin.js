// Sistema Administrativo das Olimpíadas Interclasses Unimaua
class AdminSystem {
    constructor() {
        this.isLoggedIn = false;
        this.history = this.loadHistory();
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.loadHistoryLog();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Enter para fazer login
        document.getElementById('passwordInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkPassword();
            }
        });

        // Enter para nova senha
        document.getElementById('newPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.changePassword();
            }
        });
    }

    checkLoginStatus() {
        const savedPassword = localStorage.getItem('olympicAdminPassword');
        if (savedPassword) {
            // Se já tem senha salva, verificar se está logado
            const loginTime = localStorage.getItem('olympicLoginTime');
            const currentTime = new Date().getTime();
            
            // Sessão expira em 2 horas
            if (loginTime && (currentTime - parseInt(loginTime)) < 7200000) {
                this.login();
            }
        }
    }

    checkPassword() {
        const password = document.getElementById('passwordInput').value;
        const savedPassword = localStorage.getItem('olympicAdminPassword') || 'admin123';
        
        if (password === savedPassword) {
            this.login();
        } else {
            this.showError('Senha incorreta!');
            document.getElementById('passwordInput').value = '';
            document.getElementById('passwordInput').focus();
        }
    }

    login() {
        this.isLoggedIn = true;
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'grid';
        
        // Salvar tempo de login
        localStorage.setItem('olympicLoginTime', new Date().getTime());
        
        this.addHistoryItem('Login realizado com sucesso');
        this.showSuccess('Login realizado com sucesso!');
    }

    logout() {
        this.isLoggedIn = false;
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
        
        // Limpar campos
        document.getElementById('passwordInput').value = '';
        document.getElementById('newPassword').value = '';
        
        this.addHistoryItem('Logout realizado');
    }

    addScore() {
        const sport = document.getElementById('sportSelect').value;
        const className = document.getElementById('classSelect').value;
        const points = parseInt(document.getElementById('pointsInput').value) || 0;

        if (!sport || !className || points === 0) {
            this.showError('Por favor, preencha todos os campos obrigatórios e adicione pelo menos 1 ponto!');
            return;
        }

        // Adicionar pontuação usando a função global da página principal
        if (window.opener && window.opener.addScoreFromAdmin) {
            window.opener.addScoreFromAdmin(sport, className, points);
        } else {
            // Se não estiver em uma nova aba, usar localStorage diretamente
            this.addScoreToStorage(sport, className, points);
        }

        // Adicionar ao histórico
        this.addHistoryItem(`${points.toLocaleString('pt-BR')} pontos para ${className} em ${this.getSportName(sport)}`);

        // Limpar formulário
        this.clearForm();
        
        this.showSuccess('Pontuação adicionada com sucesso!');
        
        // Atualizar histórico
        this.loadHistoryLog();
    }

    addScoreToStorage(sport, className, points) {
        const scores = JSON.parse(localStorage.getItem('olympicScores') || '{}');
        
        if (!scores[sport]) {
            scores[sport] = {};
        }
        
        if (!scores[sport][className]) {
            scores[sport][className] = {
                points: 0
            };
        }

        const classData = scores[sport][className];
        
        // Adicionar pontos (acumulativo)
        classData.points += points;

        // Atualizar classificação geral
        this.updateGeneralClassification(scores);

        // Salvar no localStorage
        localStorage.setItem('olympicScores', JSON.stringify(scores));
        localStorage.setItem('olympicLastUpdate', new Date().toLocaleString('pt-BR'));
    }

    updateGeneralClassification(scores) {
        scores.geral = {};
        
        // Calcular pontos totais de todos os esportes
        Object.keys(scores).forEach(sport => {
            if (sport === 'geral') return;
            
            Object.keys(scores[sport]).forEach(className => {
                if (!scores.geral[className]) {
                    scores.geral[className] = {
                        points: 0
                    };
                }
                
                const sportData = scores[sport][className];
                const generalData = scores.geral[className];
                
                // Somar pontos de todos os esportes
                generalData.points += sportData.points || 0;
            });
        });
    }

    getSportName(sport) {
        const sportNames = {
            'futebol': '⚽ Futebol',
            'dama': '♟️ Dama',
            'xadrez': '♔ Xadrez',
            'pique-bandeira': '🏁 Pique Bandeira',
            'volei': '🏐 Vôlei',
            'basquete': '🏀 Basquete'
        };
        return sportNames[sport] || sport;
    }

    clearForm() {
        document.getElementById('sportSelect').value = '';
        document.getElementById('classSelect').value = '';
        document.getElementById('pointsInput').value = '0';
    }

    changePassword() {
        const newPassword = document.getElementById('newPassword').value;
        
        if (!newPassword || newPassword.length < 4) {
            this.showError('A nova senha deve ter pelo menos 4 caracteres!');
            return;
        }

        localStorage.setItem('olympicAdminPassword', newPassword);
        document.getElementById('newPassword').value = '';
        
        this.addHistoryItem('Senha alterada com sucesso');
        this.showSuccess('Senha alterada com sucesso!');
    }

    resetData() {
        if (confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados das olimpíadas!\n\nTem certeza que deseja continuar?')) {
            if (confirm('🔴 ÚLTIMA CHANCE: Todos os pontos e histórico serão perdidos!\n\nConfirma a exclusão?')) {
                localStorage.removeItem('olympicScores');
                localStorage.removeItem('olympicLastUpdate');
                
                this.addHistoryItem('TODOS os dados foram resetados');
                this.showSuccess('Dados resetados com sucesso!');
                
                // Recarregar a página para atualizar a tabela
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }
    }

    loadHistory() {
        const saved = localStorage.getItem('olympicHistory');
        return saved ? JSON.parse(saved) : [];
    }

    addHistoryItem(action) {
        const historyItem = {
            time: new Date().toLocaleString('pt-BR'),
            action: action
        };
        
        this.history.unshift(historyItem);
        
        // Manter apenas os últimos 50 itens
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        localStorage.setItem('olympicHistory', JSON.stringify(this.history));
    }

    loadHistoryLog() {
        const historyLog = document.getElementById('historyLog');
        
        if (this.history.length === 0) {
            historyLog.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Nenhuma ação registrada ainda</p>';
            return;
        }

        historyLog.innerHTML = '';
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="time">🕐 ${item.time}</div>
                <div class="action">${item.action}</div>
            `;
            historyLog.appendChild(historyItem);
        });
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Remover notificações existentes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            border: 2px solid #ffd700;
            max-width: 300px;
        `;

        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #4ecdc4, #45b7d1)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #ff6b35, #e74c3c)';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto-remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Adicionar estilos CSS para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.adminSystem = new AdminSystem();
});

// Funções globais para chamadas do HTML
window.checkPassword = function() {
    if (window.adminSystem) {
        window.adminSystem.checkPassword();
    }
};

window.addScore = function() {
    if (window.adminSystem) {
        window.adminSystem.addScore();
    }
};

window.changePassword = function() {
    if (window.adminSystem) {
        window.adminSystem.changePassword();
    }
};

window.resetData = function() {
    if (window.adminSystem) {
        window.adminSystem.resetData();
    }
};

// Verificar seção ativa a cada minuto
setInterval(() => {
    if (window.adminSystem && window.adminSystem.isLoggedIn) {
        const loginTime = localStorage.getItem('olympicLoginTime');
        const currentTime = new Date().getTime();
        
        // Sessão expira em 2 horas
        if (loginTime && (currentTime - parseInt(loginTime)) >= 7200000) {
            window.adminSystem.logout();
            alert('Sessão expirada! Por favor, faça login novamente.');
        }
    }
}, 60000);
