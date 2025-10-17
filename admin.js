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
        try {
            await this.loadStudentsData();
            console.log('✅ Dados dos alunos carregados com sucesso');
            this.showNotification('✅ Dados dos alunos carregados com sucesso!', 'success');
        } catch (error) {
            console.error('❌ Erro ao carregar dados dos alunos:', error);
            this.showNotification('❌ Erro ao carregar dados dos alunos. Tente recarregar a página.', 'error');
        }
    }

    setupEventListeners() {
        // Event listener para tecla Enter no campo de senha
        document.getElementById('passwordInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkPassword();
            }
        });

        // Event listener para tecla Enter no campo de nova senha
        document.getElementById('newPassword')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.changePassword();
            }
        });

        // Event listener para o select de tipo de pontuação
        document.getElementById('pontuacaoTipo')?.addEventListener('change', () => {
            this.togglePontuacaoFields();
        });

        // Event listener para o select de turma na pontuação individual
        document.getElementById('individualClassSelect')?.addEventListener('change', () => {
            this.loadStudentsForPontuacao();
        });

        // Event listener para o select de turma no cadastro de time
        document.getElementById('teamClassSelect')?.addEventListener('change', () => {
            this.loadTeamStudents();
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
        document.getElementById('pontuacaoTipo').value = '';
        document.getElementById('individualClassSelect').value = '';
        document.getElementById('studentSelect').value = '';
        
        // Esconder todos os campos específicos
        document.getElementById('teamRegistrationFields').style.display = 'none';
        document.getElementById('studentRegistrationFields').style.display = 'none';
        document.getElementById('teamFields').style.display = 'none';
        document.getElementById('studentFields').style.display = 'none';
        document.getElementById('studentsList').style.display = 'none';
        document.getElementById('pontuacaoTurmaFields').style.display = 'none';
        document.getElementById('pontuacaoIndividualFields').style.display = 'none';
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
        if (this.studentsData) {
            // Se já temos os dados carregados, retorna
            return this.studentsData;
        }

        try {
            // Primeiro tenta carregar do localStorage (cache)
            const cachedData = localStorage.getItem('studentsData');
            if (cachedData) {
                this.studentsData = JSON.parse(cachedData);
                console.log('Dados dos alunos carregados do cache:', this.studentsData);
                return this.studentsData;
            }

            // Se não tem cache, carrega do arquivo
            const response = await fetch('assets/alunos_por_turma.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data || Object.keys(data).length === 0) {
                throw new Error('Arquivo JSON vazio ou inválido');
            }

            // Valida a estrutura dos dados
            for (const [turma, alunos] of Object.entries(data)) {
                if (!Array.isArray(alunos)) {
                    throw new Error(`Dados inválidos para turma ${turma}`);
                }
                for (const aluno of alunos) {
                    if (!aluno.id || !aluno.nome) {
                        throw new Error(`Aluno inválido na turma ${turma}`);
                    }
                }
            }

            this.studentsData = data;
            // Salva no cache
            localStorage.setItem('studentsData', JSON.stringify(data));
            
            console.log('Dados dos alunos carregados do arquivo:', data);
            console.log('Turmas disponíveis:', Object.keys(data));
            return this.studentsData;

        } catch (error) {
            console.error('Erro ao carregar dados dos alunos:', error);
            this.showNotification('❌ Erro ao carregar dados dos alunos! ' + error.message, 'error');
            this.showNotification('💡 Verifique se o arquivo assets/alunos_por_turma.json existe e está acessível.', 'info');
            throw error;
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
        // Emitir evento genérico para notificar outras abas/janelas
        try {
            const payload = JSON.stringify({ type: 'games_updated', ts: Date.now() });
            localStorage.setItem('__app_event', payload);
            localStorage.removeItem('__app_event');
            console.log('[Admin] Evento __app_event (games_updated) emitido');
        } catch (e) {
            console.warn('[Admin] Falha ao emitir __app_event', e);
        }
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
    loadTeamStudents() {
        const className = document.getElementById('teamClassSelect').value;
        const studentsContainer = document.getElementById('teamStudentsSelect');

        if (!className) {
            studentsContainer.innerHTML = '<p><small>Selecione a turma primeiro para ver os alunos disponíveis</small></p>';
            return;
        }

        if (!this.studentsData || !this.studentsData[className]) {
            studentsContainer.innerHTML = '<p><small>⚠️ Nenhum aluno encontrado nesta turma</small></p>';
            return;
        }

        const students = this.studentsData[className];
        studentsContainer.innerHTML = `
            <div class="team-students-list">
                ${students.map(student => `
                    <div class="team-student-item">
                        <input type="checkbox" id="student_${student.id}" data-student-id="${student.id}" data-student-name="${student.nome}">
                        <label for="student_${student.id}">👤 ${student.nome}</label>
                    </div>
                `).join('')}
            </div>
            <small class="selecione_alunos_time_texto">✅ Selecione os alunos que fazem parte do time</small>
        `;
    }

    addTeam() {
        const sport = document.getElementById('teamSportSelect').value;
        const className = document.getElementById('teamClassSelect').value;
        const name = document.getElementById('teamName').value.trim();

        if (!sport || !className || !name) {
            this.showNotification('❌ Preencha todos os campos obrigatórios!', 'error');
            return;
        }

        // Pegar alunos selecionados
        const selectedStudents = Array.from(document.querySelectorAll('#teamStudentsSelect input[type="checkbox"]:checked'))
            .map(checkbox => ({
                id: checkbox.dataset.studentId,
                name: checkbox.dataset.studentName
            }));

        if (selectedStudents.length === 0) {
            this.showNotification('❌ Selecione pelo menos um aluno para o time!', 'error');
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
            sport: sport,
            students: selectedStudents
        };

        this.savePlayers(players);
        this.updatePlayerSelects();
        this.clearTeamForm();
        
        const studentNames = selectedStudents.map(s => s.name).join(', ');
        this.showNotification(`✅ Time ${name} cadastrado com sucesso com os alunos: ${studentNames}`, 'success');
        this.addToHistory(`🏆 Time cadastrado: ${name} - ${className} (${selectedStudents.length} alunos)`);

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
        this.studentsData[className].push({ id: newId, nome: name });

        // Salvar dados atualizados
        localStorage.setItem('studentsData', JSON.stringify(this.studentsData));
        this.saveStudentsData();

        this.clearStudentForm();
        this.showNotification(`✅ Aluno "${name}" cadastrado com sucesso na turma ${className}!`, 'success');
        this.addToHistory(`👤 Aluno cadastrado: ${name} - ${className}`);

        // Atualizar selects dinâmicos e listas de alunos
        this.createDynamicClassSelects();
        // Atualizar selects de alunos em pontuação individual, registro de jogo, etc
        this.loadStudentsForPontuacao();
        this.loadStudentsForPlayer1();
        this.loadStudentsForPlayer2();

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
            // Carregar alunos se uma turma já estiver selecionada
            const selectedClass = document.getElementById('teamClassSelect').value;
            if (selectedClass) {
                this.loadTeamStudents();
            }
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
        // Salva scores dos alunos e garante notificação para outras abas/janelas
        localStorage.setItem('studentScores', JSON.stringify(scores));
        this.updateLastUpdate();

        // Forçar evento de storage para outras abas: escreve uma chave temporária e remove
        try {
            localStorage.setItem('__students_update_ts', Date.now().toString());
            localStorage.removeItem('__students_update_ts');
            // Emitir evento genérico também
            const payload = JSON.stringify({ type: 'studentScores_updated', ts: Date.now() });
            localStorage.setItem('__app_event', payload);
            localStorage.removeItem('__app_event');
        } catch (e) {
            console.warn('Não foi possível disparar evento de storage temporário:', e);
        }
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

        let player1Id, player2Id, player1Name, player2Name, player1Class, player2Class;

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
            player1Class = player1.class;
            player2Class = player2.class;

            // Somar pontos à turma do time
            if (player1BonusPoints > 0) {
                this.addScoreToClass(sport, player1Class, player1BonusPoints);
            }
            if (player2BonusPoints > 0) {
                this.addScoreToClass(sport, player2Class, player2BonusPoints);
            }

            // Se o time tem alunos cadastrados, distribuir os pontos entre eles
            if (player1.students && player1.students.length > 0 && player1BonusPoints > 0) {
                const pointsPerStudent = Math.floor(player1BonusPoints / player1.students.length);
                player1.students.forEach(student => {
                    const studentKey = `student_${student.id}`;
                    const studentScores = this.loadStudentScores();
                    if (!studentScores[studentKey]) {
                        studentScores[studentKey] = { points: 0, turma: player1Class };
                    }
                    studentScores[studentKey].points += pointsPerStudent;
                    this.saveStudentScores(studentScores);
                });
            }

            if (player2.students && player2.students.length > 0 && player2BonusPoints > 0) {
                const pointsPerStudent = Math.floor(player2BonusPoints / player2.students.length);
                player2.students.forEach(student => {
                    const studentKey = `student_${student.id}`;
                    const studentScores = this.loadStudentScores();
                    if (!studentScores[studentKey]) {
                        studentScores[studentKey] = { points: 0, turma: player2Class };
                    }
                    studentScores[studentKey].points += pointsPerStudent;
                    this.saveStudentScores(studentScores);
                });
            }
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

            // Buscar nomes dos alunos e classes
            player1Class = document.getElementById('student1ClassSelect').value;
            player2Class = document.getElementById('student2ClassSelect').value;
            
            if (!this.studentsData || !this.studentsData[player1Class] || !this.studentsData[player2Class]) {
                this.showNotification('❌ Dados dos alunos não encontrados!', 'error');
                return;
            }

            const student1 = this.studentsData[player1Class].find(s => s.id == student1Id);
            const student2 = this.studentsData[player2Class].find(s => s.id == student2Id);
            
            if (!student1 || !student2) {
                this.showNotification('❌ Aluno não encontrado!', 'error');
                return;
            }

            player1Name = student1.nome;
            player2Name = student2.nome;

            // Somar pontos à turma dos alunos
            if (player1BonusPoints > 0) {
                this.addScoreToClass(sport, player1Class, player1BonusPoints);
            }
            if (player2BonusPoints > 0) {
                this.addScoreToClass(sport, player2Class, player2BonusPoints);
            }
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

    // Sistema de Pontuação (Atualizado)
    togglePontuacaoFields() {
        const tipo = document.getElementById('pontuacaoTipo').value;
        const turmaFields = document.getElementById('pontuacaoTurmaFields');
        const individualFields = document.getElementById('pontuacaoIndividualFields');

        // Esconder todos os campos primeiro
        turmaFields.style.display = 'none';
        individualFields.style.display = 'none';

        if (tipo === '') return;

        if (!this.studentsData) {
            // Se os dados ainda não foram carregados, carrega primeiro
            this.loadStudentsData().then(() => {
                this.setupPontuacaoFields(tipo, turmaFields, individualFields);
            });
        } else {
            this.setupPontuacaoFields(tipo, turmaFields, individualFields);
        }
    }

    setupPontuacaoFields(tipo, turmaFields, individualFields) {
        if (tipo === 'turma') {
            turmaFields.style.display = 'block';
            individualFields.style.display = 'none';
        } else if (tipo === 'individual') {
            turmaFields.style.display = 'none';
            individualFields.style.display = 'block';
            
            // Copiar opções de turmas para o select individual
            const classSelect = document.getElementById('classSelect');
            const individualClassSelect = document.getElementById('individualClassSelect');
            
            if (classSelect && individualClassSelect) {
                individualClassSelect.innerHTML = '<option value="">Selecione a turma</option>';
                
                // Copiar cada optgroup e suas opções, ajustando os valores para corresponder ao formato do JSON
                Array.from(classSelect.getElementsByTagName('optgroup')).forEach(group => {
                    const newGroup = document.createElement('optgroup');
                    newGroup.label = group.label;
                    Array.from(group.getElementsByTagName('option')).forEach(option => {
                        const newOption = document.createElement('option');
                        const normalizedClass = this.normalizeClassName(option.value); // Usa o valor normalizado
                        newOption.value = option.value; // Mantém o valor original para compatibilidade
                        newOption.setAttribute('data-normalized', normalizedClass); // Armazena o valor normalizado
                        newOption.text = option.text;
                        newGroup.appendChild(newOption);
                    });
                    individualClassSelect.appendChild(newGroup);
                });
            }
        }
    }

    async loadStudentsForPontuacao() {
        const individualClassSelect = document.getElementById('individualClassSelect');
        const selectedClass = individualClassSelect.value;
        const studentSelect = document.getElementById('studentSelect');

        if (!selectedClass) {
            studentSelect.innerHTML = '<option value="">Selecione o aluno</option>';
            return;
        }

        // Se os dados dos alunos ainda não foram carregados, carrega primeiro
        if (!this.studentsData) {
            await this.loadStudentsData();
        }

        // Buscar o valor normalizado no elemento selecionado
        const selectedOption = individualClassSelect.querySelector(`option[value="${selectedClass}"]`);
        const normalizedClass = selectedOption?.getAttribute('data-normalized') || this.normalizeClassName(selectedClass);

        console.log('Turma selecionada:', selectedClass);
        console.log('Turma normalizada:', normalizedClass);
        console.log('Turmas disponíveis:', Object.keys(this.studentsData));
        
        // Tentar diferentes formatos da turma
        const possibleFormats = [
            normalizedClass,
            `${selectedClass.charAt(0)}° ano ${selectedClass.charAt(1)}`,
            `${selectedClass.charAt(0)}º ano ${selectedClass.charAt(1)}`,
            selectedClass
        ];

        let foundClass = null;
        for (const format of possibleFormats) {
            if (this.studentsData[format]) {
                foundClass = format;
                break;
            }
        }

        if (!this.studentsData || !foundClass) {
            this.showNotification(`❌ Dados dos alunos não encontrados para a turma ${selectedClass}!`, 'error');
            studentSelect.innerHTML = '<option value="">Turma não encontrada</option>';
            console.error('Turma não encontrada nos dados. Formatos tentados:', possibleFormats);
            return;
        }

        const students = this.studentsData[foundClass];
        console.log(`Alunos encontrados para ${foundClass}:`, students);

        const studentOptions = students.map(student => 
            `<option value="${student.id}">${student.nome}</option>`
        ).join('');

        studentSelect.innerHTML = '<option value="">Selecione o aluno</option>' + studentOptions;
        this.showNotification(`✅ ${students.length} alunos carregados para ${selectedClass}`, 'success');
    }

    normalizeClassName(className) {
        // Converter formato "3B" para "3º ano B"
        if (!className) return '';

        // Se já estiver no formato completo, retorna como está
        if (className.includes('ano')) return className;

        let normalized = className;

        // Tratar turmas do ensino médio (ex: 1MB -> 1º Ano Médio B)
        if (className.includes('M')) {
            const number = className.charAt(0);
            const letter = className.charAt(2);
            return [
                `${number}º Ano Médio ${letter}`,
                `${number}° Ano Médio ${letter}`,
                `${number}º ano Médio ${letter}`,
                `${number}° ano Médio ${letter}`
            ][0]; // Retorna o primeiro formato
        }

        // Tratar turmas regulares (ex: 3B -> 3º ano B)
        const number = className.charAt(0);
        const letter = className.charAt(1);
        return [
            `${number}° ano ${letter}`,
            `${number}º ano ${letter}`,
            `${number}° Ano ${letter}`,
            `${number}º Ano ${letter}`
        ][0]; // Retorna o primeiro formato
    }

    async loadStudentsFromJSON() {
        try {
            // Primeiro tenta carregar do cache
            const cachedData = localStorage.getItem('studentsData');
            if (cachedData) {
                return JSON.parse(cachedData);
            }

            // Se não tem cache, carrega do arquivo
            const response = await fetch('assets/alunos_por_turma.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Salva no cache
            localStorage.setItem('studentsData', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error('Erro ao carregar dados dos alunos:', error);
            this.showNotification('❌ Erro ao carregar dados dos alunos!', 'error');
            return {};
        }
    }

    async loadStudentsForPontuacao() {
        const pontuacaoTipo = document.getElementById('pontuacaoTipo').value;
        const studentSelect = document.getElementById('studentSelect');

        studentSelect.innerHTML = '<option value="">Selecione o aluno</option>';

        const selectedClass = document.getElementById('individualClassSelect').value;
        
        if (!selectedClass) {
            this.showNotification('❌ Selecione uma turma primeiro!', 'error');
            return;
        }

        try {
            const studentsData = await this.loadStudentsFromJSON();
            if (studentsData[selectedClass]) {
                studentsData[selectedClass].forEach(student => {
                    const option = document.createElement('option');
                    option.value = student.id;
                    option.textContent = student.nome;
                    studentSelect.appendChild(option);
                });
                this.showNotification('✅ Lista de alunos carregada!', 'success');
            } else {
                this.showNotification('❌ Nenhum aluno encontrado nesta turma.', 'error');
            }
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
            this.showNotification('❌ Erro ao carregar lista de alunos.', 'error');
        }
    }

    addScore() {
        const tipo = document.getElementById('pontuacaoTipo').value;
        const sport = document.getElementById('sportSelect').value;
        const points = parseInt(document.getElementById('pointsInput').value) || 0;

        if (!tipo || !sport) {
            this.showNotification('❌ Selecione o tipo de atribuição e o tipo de pontuação!', 'error');
            return;
        }

        if (points <= 0) {
            this.showNotification('❌ Adicione pelo menos alguns pontos!', 'error');
            return;
        }

        if (tipo === 'turma') {
            const className = document.getElementById('classSelect').value;
            if (!className) {
                this.showNotification('❌ Selecione a turma!', 'error');
                return;
            }

            // Adicionar pontuação por turma
            this.addScoreToClass(sport, className, points);
            this.showNotification(`✅ ${points} pontos adicionados para turma ${className} em ${sport}!`, 'success');
            this.addToHistory(`📊 ${points} pontos adicionados para turma: ${className} - ${sport}`);
        } else if (tipo === 'individual') {
            const studentId = document.getElementById('studentSelect').value;
            const studentName = document.getElementById('studentSelect').options[document.getElementById('studentSelect').selectedIndex].text;
            const className = document.getElementById('individualClassSelect').value;
            
            if (!studentId) {
                this.showNotification('❌ Selecione um aluno!', 'error');
                return;
            }

            if (!className) {
                this.showNotification('❌ Turma do aluno não identificada!', 'error');
                return;
            }

            // Adicionar pontuação individual
            const scores = this.loadStudentScores();
            const studentKey = `student_${studentId}`;
            
            if (!scores[studentKey]) {
                scores[studentKey] = { points: 0, turma: className };
            }
            
            scores[studentKey].points += points;
            scores[studentKey].sport = sport; // Registrar o tipo de pontuação
            this.saveStudentScores(scores);

            // Somar os pontos também à turma
            this.addScoreToClass(sport, className, points);

            this.showNotification(`✅ ${points} pontos adicionados para ${studentName} e turma ${className} em ${sport}!`, 'success');
            this.addToHistory(`👤 ${points} pontos adicionados para aluno: ${studentName} (${className}) - ${sport}`);
        }

        this.clearForm();
        
        // Atualizar página principal se estiver aberta
        if (window.opener && window.opener.scoreSystem) {
            window.opener.scoreSystem.updateTable();
        }
        // Também atualiza lastUpdate para sinalizar mudança
        try {
            localStorage.setItem('lastUpdate', new Date().toLocaleString('pt-BR'));
        } catch (e) {
            console.warn('Falha ao atualizar lastUpdate', e);
        }
    }

    addScoreToClass(sport, className, points) {
        // Adiciona pontos à turma e emite notificação
        if (window.opener && window.opener.addScoreFromAdmin) {
            window.opener.addScoreFromAdmin(sport, className, points);
        } else {
            this.addScoreToStorage(sport, className, points);
        }
        console.log(`[Admin] Adicionados ${points} pontos para turma ${className} em ${sport}`);
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

    // Função para gerar selects de turma dinâmicos
    createDynamicClassSelects() {
        // Aguarda os dados dos alunos serem carregados
        this.loadStudentsData().then(() => {
            const turmas = Object.keys(this.studentsData);
            // Agrupa por ano
            const anosAgrupados = {};
            turmas.forEach(turma => {
                // Exemplo: "1° ano A" => ano: "1° ano", sala: "A"
                const match = turma.match(/^(\d+)[°º]?\s*ano\s*([A-B]?)/i);
                if (match) {
                    const ano = match[1];
                    const sala = match[2] || 'A';
                    if (!anosAgrupados[ano]) anosAgrupados[ano] = [];
                    anosAgrupados[ano].push({ turma, sala });
                }
            });

            // Função para criar o select
            function createSelect(id, required = true) {
                const select = document.createElement('select');
                select.id = id;
                if (required) select.required = true;
                select.innerHTML = '<option value="">Selecione a turma</option>';
                Object.keys(anosAgrupados).forEach(ano => {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = `${ano}º Ano`;
                    anosAgrupados[ano].forEach(obj => {
                        const option = document.createElement('option');
                        option.value = obj.turma;
                        option.text = `${ano}º Ano ${obj.sala}`;
                        optgroup.appendChild(option);
                    });
                    select.appendChild(optgroup);
                });
                return select;
            }

            // Substitui containers pelos selects dinâmicos
            const teamClassContainer = document.getElementById('teamClassSelectContainer');
            if (teamClassContainer) {
                teamClassContainer.innerHTML = '';
                const teamSelect = createSelect('teamClassSelect');
                teamClassContainer.appendChild(teamSelect);
                // Adiciona o event listener após criar o select
                teamSelect.addEventListener('change', () => {
                    this.loadTeamStudents();
                });
            }
            const studentClassContainer = document.getElementById('studentClassSelectContainer');
            if (studentClassContainer) {
                studentClassContainer.innerHTML = '';
                const studentSelect = createSelect('studentClassSelect');
                studentClassContainer.appendChild(studentSelect);
            }
            const pontuacaoClassContainer = document.getElementById('pontuacaoClassSelectContainer');
            if (pontuacaoClassContainer) {
                pontuacaoClassContainer.innerHTML = '';
                const classSelect = createSelect('classSelect');
                pontuacaoClassContainer.appendChild(classSelect);
            }
        });
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

window.togglePontuacaoFields = function() {
    window.adminSystem.togglePontuacaoFields();
};

window.loadStudentsForPontuacao = function() {
    window.adminSystem.loadStudentsForPontuacao();
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
    window.adminSystem.createDynamicClassSelects();
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
