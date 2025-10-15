// Sistema Administrativo das Olimpíadas Interclasses Unimaua
class AdminSystem {
    constructor() {
        this.password = this.loadPassword();
        this.history = this.loadHistory();
        this.studentsData = null;
        this.setupEventListeners();
        this.loadPlayerSelects();
        this.initializeStudentsData();
    }

    async initializeStudentsData() {
        await this.loadStudentsData();
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
        document.getElementById('registrationTypeSelect').value = '';
        document.getElementById('teamSportSelect').value = '';
        document.getElementById('teamClassSelect').value = '';
        document.getElementById('teamName').value = '';
        document.getElementById('studentClassSelect').value = '';
        document.getElementById('studentName').value = '';
        document.getElementById('gameTypeSelect').value = '';
        document.getElementById('gameSportSelect').value = '';
        document.getElementById('player1Select').value = '';
        document.getElementById('player2Select').value = '';
        document.getElementById('student1ClassSelect').value = '';
        document.getElementById('student1Select').value = '';
        document.getElementById('student2ClassSelect').value = '';
        document.getElementById('student2Select').value = '';
        document.getElementById('player1Score').value = '0';
        document.getElementById('player2Score').value = '0';
        document.getElementById('player1BonusPoints').value = '0';
        document.getElementById('player2BonusPoints').value = '0';
        document.getElementById('studentClassSelect').value = '';
        document.getElementById('studentPoints').value = '0';
        
        // Esconder todos os campos específicos
        document.getElementById('teamRegistrationFields').style.display = 'none';
        document.getElementById('studentRegistrationFields').style.display = 'none';
        document.getElementById('teamFields').style.display = 'none';
        document.getElementById('studentFields').style.display = 'none';
        document.getElementById('studentsList').style.display = 'none';
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

    async loadStudentsData() {
        try {
            // Carregar dados dos alunos do arquivo JSON
            const response = await fetch('assets/alunos_por_turma.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.studentsData = data;
            console.log('Dados dos alunos carregados:', data);
            this.showNotification('✅ Dados dos alunos carregados com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao carregar dados dos alunos:', error);
            this.showNotification('❌ Erro ao carregar dados dos alunos! Verifique se o arquivo existe.', 'error');
            // Tentar carregar dados de fallback ou mostrar instruções
            this.showNotification('💡 Certifique-se de que o arquivo assets/alunos_por_turma.json existe e está acessível.', 'info');
        }
    }

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

    // Cadastrar times ou alunos
    addRegistration() {
        const registrationType = document.getElementById('registrationTypeSelect').value;

        if (!registrationType) {
            this.showNotification('❌ Selecione o tipo de cadastro!', 'error');
            return;
        }

        if (registrationType === 'team') {
            this.addTeam();
        } else if (registrationType === 'student') {
            this.addStudent();
        }
    }

    // Cadastrar apenas times
    addTeam() {
        const sport = document.getElementById('teamSportSelect').value;
        const className = document.getElementById('teamClassSelect').value;
        const name = document.getElementById('teamName').value.trim();

        if (!sport || !className || !name) {
            this.showNotification('❌ Preencha todos os campos obrigatórios!', 'error');
            return;
        }

        const players = this.loadPlayers();
        
        // Verificar se o nome já existe
        const existingTeam = Object.values(players).find(player => 
            player.name.toLowerCase() === name.toLowerCase() && 
            player.class === className &&
            player.type === 'team'
        );
        if (existingTeam) {
            this.showNotification(`❌ Já existe um time com o nome "${name}" nesta sala!`, 'error');
            return;
        }

        // Criar ID único
        const teamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Adicionar time
        players[teamId] = {
            id: teamId,
            name: name,
            class: className,
            type: 'team',
            sport: sport
        };

        this.savePlayers(players);
        this.updatePlayerSelects();
        this.clearTeamForm();
        
        this.showNotification(`✅ Time ${name} cadastrado com sucesso!`, 'success');
        this.addToHistory(`🏆 Time cadastrado: ${name} - ${className}`);

        // Atualizar página principal se estiver aberta
        if (window.opener && window.opener.scoreSystem) {
            window.opener.scoreSystem.players = players;
            window.opener.scoreSystem.updateTable();
        }
    }

    clearTeamForm() {
        document.getElementById('teamSportSelect').value = '';
        document.getElementById('teamClassSelect').value = '';
        document.getElementById('teamName').value = '';
    }

    // Cadastrar aluno
    addStudent() {
        const className = document.getElementById('studentClassSelect').value;
        const name = document.getElementById('studentName').value.trim();

        if (!className || !name) {
            this.showNotification('❌ Preencha todos os campos obrigatórios!', 'error');
            return;
        }

        if (!this.studentsData) {
            this.showNotification('❌ Dados dos alunos não foram carregados!', 'error');
            return;
        }

        // Verificar se o aluno já existe na turma
        if (this.studentsData[className]) {
            const existingStudent = this.studentsData[className].find(student => 
                student.nome.toLowerCase() === name.toLowerCase()
            );
            
            if (existingStudent) {
                this.showNotification(`❌ Aluno "${name}" já está cadastrado na turma ${className}!`, 'error');
                return;
            }
        }

        // Gerar novo ID para o aluno
        const maxId = Math.max(...Object.values(this.studentsData).flat().map(s => s.id), 0);
        const newId = maxId + 1;

        // Adicionar aluno ao JSON
        if (!this.studentsData[className]) {
            this.studentsData[className] = [];
        }

        this.studentsData[className].push({
            id: newId,
            nome: name
        });

        // Salvar dados atualizados
        this.saveStudentsData();

        this.clearStudentForm();
        this.showNotification(`✅ Aluno "${name}" cadastrado com sucesso na turma ${className}!`, 'success');
        this.addToHistory(`👤 Aluno cadastrado: ${name} - ${className}`);

        // Atualizar página principal se estiver aberta
        if (window.opener && window.opener.scoreSystem) {
            window.opener.scoreSystem.updateTable();
        }
    }

    clearStudentForm() {
        document.getElementById('studentClassSelect').value = '';
        document.getElementById('studentName').value = '';
    }

    saveStudentsData() {
        // Salvar dados dos alunos atualizados
        fetch('assets/alunos_por_turma.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.studentsData)
        }).catch(error => {
            console.error('Erro ao salvar dados dos alunos:', error);
            // Como alternativa, salvar no localStorage para persistência local
            localStorage.setItem('studentsData', JSON.stringify(this.studentsData));
        });
    }

    // Função para alternar campos de cadastro
    toggleRegistrationFields() {
        const registrationType = document.getElementById('registrationTypeSelect').value;
        const teamFields = document.getElementById('teamRegistrationFields');
        const studentFields = document.getElementById('studentRegistrationFields');

        // Esconder todos os campos primeiro
        teamFields.style.display = 'none';
        studentFields.style.display = 'none';

        if (registrationType === 'team') {
            teamFields.style.display = 'block';
        } else if (registrationType === 'student') {
            studentFields.style.display = 'block';
        }
    }

    // Gerenciar alunos pré-cadastrados
    loadStudentsFromClass() {
        const selectedClass = document.getElementById('studentClassSelect').value;
        const studentsList = document.getElementById('studentsList');
        const studentsContainer = document.getElementById('studentsContainer');

        console.log('Turma selecionada:', selectedClass);
        console.log('Dados dos alunos disponíveis:', this.studentsData);

        if (!selectedClass) {
            studentsList.style.display = 'none';
            return;
        }

        if (!this.studentsData) {
            this.showNotification('❌ Dados dos alunos ainda não foram carregados! Aguarde um momento.', 'error');
            return;
        }

        if (!this.studentsData[selectedClass]) {
            console.log('Turmas disponíveis:', Object.keys(this.studentsData));
            this.showNotification(`❌ Turma "${selectedClass}" não encontrada nos dados! Turmas disponíveis: ${Object.keys(this.studentsData).join(', ')}`, 'error');
            return;
        }

        const students = this.studentsData[selectedClass];
        console.log(`Alunos encontrados para ${selectedClass}:`, students);
        
        studentsContainer.innerHTML = '';

        students.forEach(student => {
            const studentDiv = document.createElement('div');
            studentDiv.className = 'student-item';
            studentDiv.innerHTML = `
                <div class="student-info">
                    <span class="student-name">${student.nome}</span>
                    <span class="student-id">ID: ${student.id}</span>
                </div>
                <button class="btn-select-student" onclick="selectStudent(${student.id}, '${student.nome}')">
                    Selecionar
                </button>
            `;
            studentsContainer.appendChild(studentDiv);
        });

        studentsList.style.display = 'block';
        this.showNotification(`✅ ${students.length} alunos carregados para ${selectedClass}`, 'success');
    }

    addStudentPoints() {
        const selectedStudentId = document.getElementById('selectedStudentId')?.value;
        const points = parseInt(document.getElementById('studentPoints').value);

        if (!selectedStudentId) {
            this.showNotification('❌ Selecione um aluno primeiro!', 'error');
            return;
        }

        if (!points || points < 0) {
            this.showNotification('❌ Digite uma pontuação válida!', 'error');
            return;
        }

        // Adicionar pontos ao aluno específico
        const studentScores = this.loadStudentScores();
        const studentKey = `student_${selectedStudentId}`;
        
        if (!studentScores[studentKey]) {
            studentScores[studentKey] = { points: 0 };
        }
        
        studentScores[studentKey].points += points;
        this.saveStudentScores(studentScores);

        const studentName = document.getElementById('selectedStudentName')?.value || 'Aluno';
        this.showNotification(`✅ ${points} pontos adicionados para ${studentName}!`, 'success');
        this.addToHistory(`👤 ${points} pontos adicionados para aluno: ${studentName}`);

        // Limpar formulário
        document.getElementById('studentPoints').value = '0';
        document.getElementById('selectedStudentId').value = '';
        document.getElementById('selectedStudentName').value = '';
        
        // Atualizar página principal se estiver aberta
        if (window.opener && window.opener.scoreSystem) {
            window.opener.scoreSystem.updateTable();
        }
    }

    loadStudentScores() {
        const scores = localStorage.getItem('studentScores');
        return scores ? JSON.parse(scores) : {};
    }

    saveStudentScores(scores) {
        localStorage.setItem('studentScores', JSON.stringify(scores));
        this.updateLastUpdate();
    }

    // Função para alternar campos de jogo
    toggleGameFields() {
        const gameType = document.getElementById('gameTypeSelect').value;
        const teamFields = document.getElementById('teamFields');
        const studentFields = document.getElementById('studentFields');

        // Esconder todos os campos primeiro
        teamFields.style.display = 'none';
        studentFields.style.display = 'none';

        if (gameType === 'team') {
            teamFields.style.display = 'block';
            this.updatePlayerSelects();
        } else if (gameType === 'student') {
            studentFields.style.display = 'block';
        }
    }

    // Carregar alunos para o jogador 1
    loadStudentsForPlayer1() {
        const selectedClass = document.getElementById('student1ClassSelect').value;
        const studentSelect = document.getElementById('student1Select');

        if (!selectedClass) {
            studentSelect.innerHTML = '<option value="">Selecione o aluno</option>';
            return;
        }

        if (!this.studentsData || !this.studentsData[selectedClass]) {
            studentSelect.innerHTML = '<option value="">Turma não encontrada</option>';
            return;
        }

        const students = this.studentsData[selectedClass];
        const studentOptions = students.map(student => 
            `<option value="${student.id}">${student.nome}</option>`
        ).join('');

        studentSelect.innerHTML = '<option value="">Selecione o aluno</option>' + studentOptions;
    }

    // Carregar alunos para o jogador 2
    loadStudentsForPlayer2() {
        const selectedClass = document.getElementById('student2ClassSelect').value;
        const studentSelect = document.getElementById('student2Select');

        if (!selectedClass) {
            studentSelect.innerHTML = '<option value="">Selecione o aluno</option>';
            return;
        }

        if (!this.studentsData || !this.studentsData[selectedClass]) {
            studentSelect.innerHTML = '<option value="">Turma não encontrada</option>';
            return;
        }

        const students = this.studentsData[selectedClass];
        const studentOptions = students.map(student => 
            `<option value="${student.id}">${student.nome}</option>`
        ).join('');

        studentSelect.innerHTML = '<option value="">Selecione o aluno</option>' + studentOptions;
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
        const gameType = document.getElementById('gameTypeSelect').value;
        const sport = document.getElementById('gameSportSelect').value;
        const player1Score = parseInt(document.getElementById('player1Score').value);
        const player2Score = parseInt(document.getElementById('player2Score').value);
        const player1BonusPoints = parseInt(document.getElementById('player1BonusPoints').value) || 0;
        const player2BonusPoints = parseInt(document.getElementById('player2BonusPoints').value) || 0;

        if (!gameType || !sport) {
            this.showNotification('❌ Selecione o tipo de jogo e o esporte!', 'error');
            return;
        }

        let player1Id, player2Id, player1Name, player2Name;

        if (gameType === 'team') {
            player1Id = document.getElementById('player1Select').value;
            player2Id = document.getElementById('player2Select').value;
            
            if (!player1Id || !player2Id) {
                this.showNotification('❌ Selecione os dois times!', 'error');
                return;
            }

            const players = this.loadPlayers();
            const player1 = players[player1Id];
            const player2 = players[player2Id];
            
            if (!player1 || !player2) {
                this.showNotification('❌ Time não encontrado!', 'error');
                return;
            }

            player1Name = player1.name;
            player2Name = player2.name;
        } else if (gameType === 'student') {
            const student1Id = document.getElementById('student1Select').value;
            const student2Id = document.getElementById('student2Select').value;
            
            if (!student1Id || !student2Id) {
                this.showNotification('❌ Selecione os dois alunos!', 'error');
                return;
            }

            // Para alunos, vamos usar IDs únicos baseados no ID do aluno
            player1Id = `student_${student1Id}`;
            player2Id = `student_${student2Id}`;

            // Buscar nomes dos alunos
            const student1Class = document.getElementById('student1ClassSelect').value;
            const student2Class = document.getElementById('student2ClassSelect').value;
            
            if (!this.studentsData || !this.studentsData[student1Class] || !this.studentsData[student2Class]) {
                this.showNotification('❌ Dados dos alunos não encontrados!', 'error');
                return;
            }

            const student1 = this.studentsData[student1Class].find(s => s.id == student1Id);
            const student2 = this.studentsData[student2Class].find(s => s.id == student2Id);
            
            if (!student1 || !student2) {
                this.showNotification('❌ Aluno não encontrado!', 'error');
                return;
            }

            player1Name = student1.nome;
            player2Name = student2.nome;
        }

        if (player1Id === player2Id) {
            this.showNotification('❌ Os jogadores devem ser diferentes!', 'error');
            return;
        }

        if (player1Score < 0 || player2Score < 0) {
            this.showNotification('❌ Os placares não podem ser negativos!', 'error');
            return;
        }

        const games = this.loadGames();
        
        // Criar ID único para o jogo
        const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Adicionar jogo
        games.push({
            id: gameId,
            gameType: gameType,
            sport: sport,
            player1Id: player1Id,
            player2Id: player2Id,
            player1Score: player1Score,
            player2Score: player2Score,
            player1BonusPoints: player1BonusPoints,
            player2BonusPoints: player2BonusPoints,
            timestamp: new Date().toISOString()
        });

        this.saveGames(games);
        this.clearGameForm();
        
        // Determinar resultado
        let result;
        if (player1Score > player2Score) {
            result = `${player1Name} venceu ${player1Score} x ${player2Score}`;
        } else if (player2Score > player1Score) {
            result = `${player2Name} venceu ${player2Score} x ${player1Score}`;
        } else {
            result = `Empate ${player1Score} x ${player2Score}`;
        }

        this.showNotification(`✅ Jogo registrado: ${result}`, 'success');
        this.addToHistory(`⚽ Jogo registrado: ${player1Name} ${player1Score} x ${player2Score} ${player2Name} (${sport})`);

        // Atualizar página principal se estiver aberta
        if (window.opener && window.opener.scoreSystem) {
            window.opener.scoreSystem.games = games;
            window.opener.scoreSystem.updateTable();
        }
    }

    clearGameForm() {
        document.getElementById('gameTypeSelect').value = '';
        document.getElementById('gameSportSelect').value = '';
        document.getElementById('player1Select').value = '';
        document.getElementById('player2Select').value = '';
        document.getElementById('student1ClassSelect').value = '';
        document.getElementById('student1Select').value = '';
        document.getElementById('student2ClassSelect').value = '';
        document.getElementById('student2Select').value = '';
        document.getElementById('player1Score').value = '0';
        document.getElementById('player2Score').value = '0';
        document.getElementById('player1BonusPoints').value = '0';
        document.getElementById('player2BonusPoints').value = '0';
        
        // Esconder todos os campos específicos
        document.getElementById('teamFields').style.display = 'none';
        document.getElementById('studentFields').style.display = 'none';
    }

    // ===== SISTEMA ANTIGO (MANTIDO PARA COMPATIBILIDADE) =====

    addScore() {
        const sport = document.getElementById('sportSelect').value;
        const className = document.getElementById('classSelect').value;
        const points = parseInt(document.getElementById('pointsInput').value) || 0;

        if (!sport || !className) {
            this.showNotification('❌ Selecione o tipo de pontuação e a turma!', 'error');
            return;
        }

        if (points <= 0) {
            this.showNotification('❌ Adicione pelo menos alguns pontos!', 'error');
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

window.addRegistration = function() {
    window.adminSystem.addRegistration();
};

window.addTeam = function() {
    window.adminSystem.addTeam();
};

window.addStudent = function() {
    window.adminSystem.addStudent();
};

window.toggleRegistrationFields = function() {
    window.adminSystem.toggleRegistrationFields();
};

window.loadStudentsFromClass = function() {
    window.adminSystem.loadStudentsFromClass();
};

window.addStudentPoints = function() {
    window.adminSystem.addStudentPoints();
};

window.selectStudent = function(studentId, studentName) {
    // Criar campos ocultos para armazenar o aluno selecionado
    let selectedStudentIdField = document.getElementById('selectedStudentId');
    let selectedStudentNameField = document.getElementById('selectedStudentName');
    
    if (!selectedStudentIdField) {
        selectedStudentIdField = document.createElement('input');
        selectedStudentIdField.type = 'hidden';
        selectedStudentIdField.id = 'selectedStudentId';
        document.body.appendChild(selectedStudentIdField);
    }
    
    if (!selectedStudentNameField) {
        selectedStudentNameField = document.createElement('input');
        selectedStudentNameField.type = 'hidden';
        selectedStudentNameField.id = 'selectedStudentName';
        document.body.appendChild(selectedStudentNameField);
    }
    
    selectedStudentIdField.value = studentId;
    selectedStudentNameField.value = studentName;
    
    // Destacar o aluno selecionado
    document.querySelectorAll('.student-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    event.target.closest('.student-item').classList.add('selected');
    
    window.adminSystem.showNotification(`✅ Aluno ${studentName} selecionado!`, 'success');
};

window.registerGame = function() {
    window.adminSystem.registerGame();
};

window.toggleGameFields = function() {
    window.adminSystem.toggleGameFields();
};

window.loadStudentsForPlayer1 = function() {
    window.adminSystem.loadStudentsForPlayer1();
};

window.loadStudentsForPlayer2 = function() {
    window.adminSystem.loadStudentsForPlayer2();
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
