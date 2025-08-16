# 🏆 Sistema de Pontuação - Interclasses Unimaua

Um sistema completo e gratuito para gerenciar pontuações de olimpíadas escolares interclasses, com interface moderna e funcionalidades avançadas.

## ✨ Características

- **🎨 Design Vibrante**: Cores inspiradas no tema das olimpíadas (laranja, amarelo, verde, azul, vermelho)
- **🏛️ Logo Personalizado**: Logo inspirado na identidade visual das Interclasses Unimaua
- **🖼️ Imagem de Fundo**: Header com imagem temática das olimpíadas
- **📱 Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e celular
- **🔐 Sistema de Segurança**: Área administrativa protegida por senha
- **⚡ Armazenamento Local**: Dados salvos no navegador (gratuito, sem servidor)
- **🔄 Atualização em Tempo Real**: Comunicação entre páginas automática
- **📊 Múltiplos Esportes**: Suporte para futebol, dama, xadrez, pique bandeira, vôlei e basquete
- **📚 Filtros por Ano Escolar**: Organização por ano desde 1º ano do fundamental até 3º ano do médio
- **📈 Classificação por Esporte**: Ranking individual para cada modalidade
- **🏆 Classificação Geral**: Soma de todos os pontos de todos os esportes

## 🚀 Como Usar

### 1. Primeira Execução
1. Abra o arquivo `index.html` em qualquer navegador moderno
2. O sistema criará automaticamente a estrutura de dados inicial
3. Clique em "🔐 Área Administrativa" para configurar

### 2. Configuração Inicial
1. **Senha Padrão**: `admin123`
2. **Alterar Senha**: Recomendado alterar a senha padrão na primeira vez
3. **Configurar Turmas**: O sistema já vem com turmas do 1º ao 9º ano + 1º ao 3º ano médio (A, B, C, D, E, F)

### 3. Adicionando Pontuações
1. Acesse a área administrativa (página separada)
2. Selecione o esporte
3. Escolha a turma (organizada por ano escolar)
4. **Digite os pontos** a serem adicionados (obrigatório)
5. Clique em "➕ Adicionar Pontuação"

### 4. Visualizando Resultados
- **Filtros por Esporte**: Visualize classificação individual de cada modalidade
- **Filtros por Ano**: Organize turmas por ano escolar (1º ao 9º ano + ensino médio)
- **Classificação Geral**: Ranking consolidado de todos os esportes
- **Posições Automáticas**: 1º, 2º, 3º lugar determinados pelos pontos
- **Atualização Automática**: Dados se atualizam em tempo real

## 🎯 Sistema de Pontuação

### **SISTEMA ATUALIZADO:**
- **Pontuação Acumulativa**: Pontos se somam a cada competição
- **Ranking por Esporte**: Cada modalidade tem sua própria classificação
- **Filtros por Ano**: Visualize turmas organizadas por ano escolar
- **Classificação Geral**: Soma de todos os pontos de todos os esportes
- **Posições Automáticas**: Quem tem mais pontos fica em 1º lugar

### **Estrutura de Turmas por Ano:**
```
ENSINO FUNDAMENTAL:
1º Ano: 1A, 1B, 1C, 1D, 1E, 1F
2º Ano: 2A, 2B, 2C, 2D, 2E, 2F
3º Ano: 3A, 3B, 3C, 3D, 3E, 3F
4º Ano: 4A, 4B, 4C, 4D, 4E, 4F
5º Ano: 5A, 5B, 5C, 5D, 5E, 5F
6º Ano: 6A, 6B, 6C, 6D, 6E, 6F
7º Ano: 7A, 7B, 7C, 7D, 7E, 7F
8º Ano: 8A, 8B, 8C, 8D, 8E, 8F
9º Ano: 9A, 9B, 9C, 9D, 9E, 9F

ENSINO MÉDIO:
1º Ano Médio: 1MA, 1MB, 1MC, 1MD, 1ME, 1MF
2º Ano Médio: 2MA, 2MB, 2MC, 2MD, 2ME, 2MF
3º Ano Médio: 3MA, 3MB, 3MC, 3MD, 3ME, 3MF
```

### **Exemplos de Uso:**
- **Futebol - 1º Ano**: 1A = 1000 pontos, 1B = 900 pontos, 1C = 800 pontos
  - 1º Lugar: 1A (1000 pts) 🥇
  - 2º Lugar: 1B (900 pts) 🥈
  - 3º Lugar: 1C (800 pts) 🥉

- **Dama - 2º Ano Médio**: 2MA = 500 pontos, 2MB = 450 pontos, 2MC = 400 pontos
  - 1º Lugar: 2MA (500 pts) 🥇
  - 2º Lugar: 2MB (450 pts) 🥈
  - 3º Lugar: 2MC (400 pts) 🥉

- **Classificação Geral**: Soma de todos os esportes
  - 1A: 1000 + 300 + 200 = 1500 pontos (1º Lugar) 🥇
  - 2MA: 900 + 450 + 150 = 1500 pontos (2º Lugar) 🥈
  - 3MB: 800 + 400 + 100 = 1300 pontos (3º Lugar) 🥉

## 🔧 Funcionalidades Administrativas

### 📊 Gerenciamento de Pontuações
- Adicionar pontos diretamente para cada turma
- Sistema acumulativo de pontuação
- **72 turmas organizadas por ano escolar** (12 anos × 6 turmas)
- Cálculo automático da classificação geral
- **Posições determinadas pelos pontos acumulados**

### ⚙️ Configurações
- **Alterar Senha**: Mude a senha de acesso
- **Reset de Dados**: Apague todos os dados (com confirmação dupla)
- **Histórico**: Registro de todas as ações realizadas

### 📋 Histórico de Alterações
- Todas as ações são registradas com data e hora
- Últimos 50 registros mantidos
- Acompanhe todas as modificações

## 💾 Armazenamento de Dados

### LocalStorage
- Dados salvos no navegador do usuário
- **Vantagem**: Totalmente gratuito, sem necessidade de servidor
- **Desvantagem**: Dados ficam apenas no dispositivo usado

### Backup Recomendado
- Exporte dados regularmente (se necessário)
- Use o mesmo navegador para manter dados sincronizados
- Considere usar o mesmo dispositivo para administração

## 🌐 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Dispositivos
- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablet (iPad, Android)
- ✅ Smartphone (iPhone, Android)

## 🎨 Personalização

### Cores e Estilo
- Cores baseadas no tema das olimpíadas interclasses
- **Logo personalizado** inspirado na identidade visual
- **Imagem de fundo** no header principal
- Design moderno com gradientes e animações
- Interface intuitiva e atrativa

### Esportes
- Fácil adição de novos esportes
- Edite o arquivo `script.js` para incluir mais modalidades
- Sistema flexível para diferentes tipos de competição

## 🚨 Segurança

### Área Administrativa
- **Página separada** (`admin.html`) para maior segurança
- Protegida por senha
- Sessão expira em 2 horas
- Histórico de todas as ações
- Confirmação para ações críticas

### Dados
- Armazenamento local seguro
- Sem envio para servidores externos
- Controle total sobre as informações

## 📱 Uso em Diferentes Contextos

### Escola
- Projetor para exibição pública
- Computador para administração
- Tablet para acompanhamento móvel

### Eventos
- Tela grande para visualização
- Múltiplos dispositivos para administração
- Atualização em tempo real

## 🔄 Manutenção

### Limpeza de Dados
- Sistema automático de limpeza de histórico
- Manutenção de apenas 50 registros mais recentes
- Reset completo disponível quando necessário

### Atualizações
- Sistema se atualiza automaticamente
- Comunicação entre abas em tempo real
- Sincronização automática de dados

## 💡 Dicas de Uso

### Para Administradores
1. **Use a mesma senha** em todos os dispositivos
2. **Faça backup** dos dados importantes
3. **Mantenha o histórico** para auditoria
4. **Teste o sistema** antes dos eventos
5. **Adicione pontos** de acordo com o desempenho real
6. **Use filtros** para verificar classificação por esporte e ano
7. **Organize por ano** para facilitar a administração
8. **Distinguir ensino fundamental e médio** nos filtros

### Para Usuários
1. **Use as tabs** para navegar entre esportes
2. **Use filtros por ano** para visualizar turmas específicas
3. **Acompanhe a tabela** em tempo real
4. **Posições mudam** automaticamente com os pontos
5. **Classificação geral** mostra o ranking consolidado

## 🆘 Suporte

### Problemas Comuns
- **Dados não aparecem**: Recarregue a página
- **Senha não funciona**: Verifique se está usando a senha correta
- **Tabela vazia**: Adicione pontuações na área administrativa
- **Posições não mudam**: Verifique se os pontos foram adicionados corretamente
- **Filtros não funcionam**: Clique nas tabs de esportes ou anos para alternar
- **Turmas não aparecem**: Verifique se foram criadas pontuações para o ano selecionado

### Soluções
- Limpe o cache do navegador
- Use o mesmo navegador sempre
- Verifique se JavaScript está habilitado
- Abra a área administrativa em nova aba
- Use o filtro "Todos os Anos" para ver todas as turmas

## 📄 Estrutura de Arquivos

```
projeto-interclasses/
├── index.html          # Página principal com tabela e filtros
├── admin.html          # Página administrativa separada
├── styles.css          # Estilos e design (incluindo logo e imagem)
├── script.js           # JavaScript da página principal
├── admin.js            # JavaScript da área administrativa
└── README.md           # Este arquivo
```

## 🎉 Pronto para Usar!

O sistema está completamente funcional e pronto para suas olimpíadas interclasses Unimaua. Basta abrir o `index.html` em um navegador e começar a usar!

**Características Principais:**
- ✅ **Sistema por Pontos**: Posições determinadas automaticamente
- ✅ **Página Administrativa Separada**: Maior segurança e organização
- ✅ **Filtros por Esporte**: Visualização individual de cada modalidade
- ✅ **Filtros por Ano Escolar**: Organização por ano (1º ao 9º ano + ensino médio)
- ✅ **72 Turmas Organizadas**: Sistema completo para todas as séries
- ✅ **Ensino Fundamental e Médio**: Cobertura completa da escola
- ✅ **Classificação Geral**: Ranking consolidado de todos os esportes
- ✅ **Logo Personalizado**: Identidade visual das Interclasses
- ✅ **Imagem de Fundo**: Header temático e atrativo
- ✅ **Interface Moderna**: Design responsivo e profissional

**Boa sorte nas competições! 🏆✨**
