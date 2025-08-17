# 🏆 Sistema de Pontuação - Olimpíadas Interclasses Unimaua

**Desenvolvido para as Olimpíadas Interclasses Unimaua 2025** 🏆✨

## 📋 Descrição

Sistema completo de pontuação para olimpíadas escolares interclasses, desenvolvido com HTML5, CSS3 e JavaScript vanilla. Permite cadastro de jogadores, registro de jogos com placar, cálculo automático de pontos e ranking em tempo real.

## ✨ Características Principais

### 🎯 **Sistema Expandido de Pontuação**
- **👥 Cadastro de Jogadores**: Registro individual com nome, número e sala
- **⚽ Registro de Jogos**: Sistema de placar com dois jogadores por partida
- **🎯 Cálculo Automático**: Vitória = 100 pontos, Empate = 50 pontos, Derrota = 0 pontos
- **📊 Rankings Duplos**: Ranking das salas e ranking individual dos jogadores
- **🔄 Compatibilidade**: Sistema antigo mantido para compatibilidade

### 🏫 **Gestão de Turmas**
- **72 Turmas**: 1º ao 9º ano + 1º, 2º e 3º ano do ensino médio
- **6 Classes por Ano**: A, B, C, D, E, F
- **Filtros por Ano**: Visualização organizada por ano escolar

### 🏆 **Esportes Suportados**
- ⚽ Futebol
- ♟️ Dama
- ♔ Xadrez
- 🏁 Pique Bandeira
- 🏐 Vôlei
- 🏀 Basquete

### 📱 **Responsividade Mobile**
- **👆 Área de Toque Otimizada**: Botões com mínimo de 44px para fácil navegação
- **📱 Layout Adaptativo**: Elementos reorganizados para telas pequenas
- **🔤 Fontes Responsivas**: Tamanhos ajustados para legibilidade
- **📊 Tabela Scrollável**: Scroll horizontal suave para visualizar dados
- **🎯 Filtros de Esportes Otimizados**: Organizados em 3 por linha no mobile
- **☰ Menu Hambúrguer**: Filtros de ano escolar em menu colapsável
- **🔄 Orientação Landscape**: Suporte completo para rotação de tela
- **⚡ Performance Touch**: Scroll suave e feedback visual otimizado
- **🔒 Prevenção de Zoom**: Configurações para evitar zoom indesejado no iOS
- **🎬 Animações Suaves**: Transições escalonadas no menu hambúrguer
- **👆 Fechamento Inteligente**: Menu fecha automaticamente ao clicar fora

## 🏗️ Estrutura de Turmas por Ano

### 📚 **Ensino Fundamental**
- **1º Ano**: 1A, 1B, 1C, 1D, 1E, 1F
- **2º Ano**: 2A, 2B, 2C, 2D, 2E, 2F
- **3º Ano**: 3A, 3B, 3C, 3D, 3E, 3F
- **4º Ano**: 4A, 4B, 4C, 4D, 4E, 4F
- **5º Ano**: 5A, 5B, 5C, 5D, 5E, 5F
- **6º Ano**: 6A, 6B, 6C, 6D, 6E, 6F
- **7º Ano**: 7A, 7B, 7C, 7D, 7E, 7F
- **8º Ano**: 8A, 8B, 8C, 8D, 8E, 8F
- **9º Ano**: 9A, 9B, 9C, 9D, 9E, 9F

### 🎓 **Ensino Médio**
- **1º Ano Médio**: 1MA, 1MB, 1MC, 1MD, 1ME, 1MF
- **2º Ano Médio**: 2MA, 2MB, 2MC, 2MD, 2ME, 2MF
- **3º Ano Médio**: 3MA, 3MB, 3MC, 3MD, 3ME, 3MF

## 🎯 **Sistema de Pontuação**

### 📊 **Cálculo Automático**
- **🥇 Vitória**: 100 pontos
- **🤝 Empate**: 50 pontos
- **❌ Derrota**: 0 pontos

### 📈 **Rankings Disponíveis**
- **🏫 Ranking das Salas**: Soma dos pontos de todos os jogadores da sala
- **👥 Ranking dos Jogadores**: Pontuação individual de cada jogador

### 🔄 **Compatibilidade**
- **Sistema Antigo**: Mantido para compatibilidade com pontuações manuais
- **Sistema Novo**: Cálculo automático baseado em jogos registrados
- **Soma Integrada**: Pontuações antigas + novas são somadas automaticamente

## 🛠️ Funcionalidades Administrativas

### 👥 **Gestão de Jogadores**
- Cadastro com nome, número único (1-999) e sala
- **Novo**: Cadastro de times (sem número de identificação)
- **Novo**: Seletor de tipo (Jogador Individual ou Time)
- Validação de números duplicados (apenas para jogadores)
- Validação de nomes duplicados (para ambos os tipos)
- Lista dinâmica de jogadores e times para seleção

### ⚽ **Registro de Jogos**
- Seleção de esporte e dois jogadores
- Inserção de placar (0-999)
- Validação de dados
- Cálculo automático de pontos

### 📊 **Sistema Antigo (Compatibilidade)**
- Adição manual de pontos por esporte
- Mantido para compatibilidade com dados existentes

### 🔐 **Segurança**
- Senha administrativa configurável
- Histórico de ações
- Reset completo de dados

## 📁 Estrutura de Arquivos

```
projeto-interclasses/
├── index.html              # Página principal pública
├── admin.html              # Área administrativa
├── script.js               # Lógica principal do sistema
├── admin.js                # Lógica administrativa
├── styles.css              # Estilos e responsividade
├── teste-responsividade.html # Página de teste mobile
├── README.md               # Documentação
└── assets/                 # Imagens e recursos
    └── Novo Projeto (1).png # Logo da escola
```

## 🚀 Como Usar

### 📱 **Acesso Público**
1. Abra `index.html` em qualquer navegador
2. Use os filtros para visualizar rankings por esporte e ano
3. Alternar entre ranking das salas e ranking dos jogadores
4. Visualização responsiva para mobile

### 🔐 **Área Administrativa**
1. Acesse `admin.html`
2. Senha padrão: `admin123`
3. **Cadastrar Jogadores**:
   - Selecione a sala
   - Digite nome e número único
   - Clique em "Cadastrar Jogador"
4. **Registrar Jogos**:
   - Selecione esporte e jogadores
   - Digite o placar
   - Clique em "Registrar Jogo"
5. **Sistema Antigo**:
   - Adicione pontos manualmente por esporte

## 📊 **Armazenamento de Dados**

### 💾 **LocalStorage**
- **`scores`**: Pontuações do sistema antigo
- **`players`**: Cadastro de jogadores
- **`games`**: Registro de jogos
- **`adminHistory`**: Histórico administrativo
- **`adminPassword`**: Senha administrativa
- **`lastUpdate`**: Última atualização

### 🔄 **Sincronização**
- Atualização automática entre abas
- Comunicação em tempo real
- Refresh automático a cada 30 segundos

## 📱 **Responsividade Mobile**

### 🎯 **Breakpoints**
- **Desktop**: Acima de 1024px
- **Tablet**: 769px - 1024px
- **Mobile Grande**: 481px - 768px
- **Mobile Médio**: 361px - 480px
- **Mobile Pequeno**: Até 360px

### ✨ **Melhorias Mobile**
- Layout adaptativo para diferentes tamanhos de tela
- Botões com área de toque otimizada (mínimo 44px)
- Fontes ajustadas para prevenir zoom automático no iOS
- Scroll suave e otimizado para touch
- Tabela responsiva com scroll horizontal
- Filtros de esportes organizados em 3 por linha no mobile
- Menu hambúrguer para filtros de ano escolar
- Logo e elementos redimensionados proporcionalmente
- Espaçamentos e margens ajustados
- Suporte a orientação landscape
- Meta tags para PWA e acessibilidade
- Animações suaves no menu hambúrguer
- Fechamento automático do menu ao clicar fora

## 🧪 **Teste de Responsividade**

Acesse `teste-responsividade.html` para:
- Verificar breakpoints implementados
- Testar funcionalidades mobile
- Visualizar informações da tela em tempo real
- Acessar links diretos para as páginas

## 🔧 **Tecnologias Utilizadas**

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilos modernos, gradientes e animações
- **JavaScript (Vanilla)**: Lógica sem dependências externas
- **LocalStorage**: Armazenamento local gratuito
- **Responsive Design**: Design adaptativo para todos os dispositivos

## 📝 **Notas Importantes**

- **Gratuito**: Não requer servidor ou hospedagem paga
- **Offline**: Funciona completamente offline
- **Compatível**: Funciona em todos os navegadores modernos
- **Responsivo**: Otimizado para desktop, tablet e mobile
- **Seguro**: Senha administrativa configurável
- **Flexível**: Suporta sistema antigo e novo simultaneamente

---

**Desenvolvido com ❤️ para as Olimpíadas Interclasses Unimaua 2025**
