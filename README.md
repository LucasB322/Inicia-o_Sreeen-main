# Senac - Análise de Equivalência Curricular

Projeto React componentizado para análise de equivalência curricular, pronto para integração com backend.

## Estrutura do Projeto

```
src/
├── components/              # Componentes reutilizáveis
│   ├── Header.jsx          # Componente do cabeçalho
│   ├── Sidebar.jsx         # Barra lateral com navegação
│   ├── DocumentAnalysis.jsx # Componente de análise de documentos
│   ├── History.jsx          # Componente de histórico de análises
│   ├── ProfileModal.jsx     # Modal de configurações de perfil
│   └── SettingsModal.jsx    # Modal de configurações do sistema
├── pages/                   # Páginas da aplicação
│   ├── Login.jsx            # Página de login/registro
│   └── MainScreen.jsx      # Tela principal da aplicação
├── services/                 # Serviços de API
│   └── api.js              # Serviços para comunicação com backend
├── config/                   # Configurações
│   └── api.config.js       # Configuração de endpoints da API
├── App.js                   # Componente principal com rotas
├── index.js                 # Ponto de entrada da aplicação
└── index.css                # Estilos globais
```

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure a URL da API:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e defina a URL do seu backend:
```
REACT_APP_API_URL=http://localhost:8000/api
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## Configuração

O projeto está configurado para usar:
- **Tailwind CSS** - Instalado como dependência e configurado via `tailwind.config.js`
- **Font Awesome** - Instalado via npm e importado no `index.css`
- **PostCSS** - Configurado para processar o Tailwind CSS

Todas as dependências são gerenciadas via npm, sem uso de CDNs externos.

## Integração com Backend

### Estrutura da API Esperada

O projeto está preparado para se comunicar com um backend que implemente os seguintes endpoints:

#### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/register` - Registro de novo usuário

#### Análise de Documentos
- `POST /api/analyze` - Enviar documentos para análise
  - Body: FormData com arquivos e dados do formulário
  - Retorna: `{ id: string, status: string }`
  
- `GET /api/analyze/reports/:id` - Obter resultados da análise
  - Retorna: Objeto com resultados formatados
  
- `GET /api/analyze/reports` - Obter histórico de análises
  - Retorna: Array de análises

#### Perfil
- `GET /api/auth/profile` - Obter dados do perfil
- `PUT /api/auth/profile` - Atualizar perfil (aceita `name`, `email`, `password`)

### Formato de Dados

#### Envio de Análise (FormData)
```
student_document: File
curriculum_document: File
optional_document: File (opcional)
student_name: string
student_id: string
current_course: string
target_course: string
```

#### Resposta de Resultados
```json
{
  "equivalent_count": 12,
  "pending_count": 5,
  "total_workload": 480,
  "equivalent_subjects": [
    {
      "name": "Programação Orientada a Objetos",
      "code": "POO-202"
    }
  ],
  "pending_subjects": [
    {
      "name": "Inteligência Artificial",
      "code": "IA-401"
    }
  ],
  "notes": "Análise concluída com sucesso...",
  "summary": "Resumo da análise"
}
```

### Autenticação

O projeto usa Bearer Token para autenticação. O token é armazenado em `localStorage` com a chave `authToken` e é enviado automaticamente em todas as requisições.

## Componentes

### Header (Componente)
Componente reutilizável do cabeçalho com menu de usuário.

**Props:**
- `onLogout`: Função chamada ao clicar em "Sair"
- `onShowProfile`: Função chamada ao clicar em "Meu Perfil"
- `onShowSettings`: Função chamada ao clicar em "Configurações"

### Sidebar (Componente)
Barra lateral com navegação entre seções da aplicação.

**Props:**
- `activeSection`: Seção ativa atual
- `onSectionChange`: Função chamada ao mudar de seção
- `onLogout`: Função chamada ao clicar em "Sair"

### DocumentAnalysis (Componente)
Componente para análise de documentos curriculares com upload de arquivos e exibição de resultados.

**Funcionalidades:**
- Upload de múltiplos arquivos
- Polling automático do status da análise
- Exibição de resultados formatados
- Exportação de resultados

### History (Componente)
Componente que exibe o histórico de análises realizadas, carregado do backend com fallback para localStorage.

### ProfileModal (Componente)
Modal para edição de perfil do usuário, incluindo upload de avatar.

### SettingsModal (Componente)
Modal para configurações do sistema (idioma, TTS, etc.).

### Login (Página)
Página de autenticação com formulários de login e registro, integrada com a API.

## Rotas

- `/` ou `/login` - Página de login
- `/main` - Tela principal da aplicação

## Tecnologias Utilizadas

- React 18
- React Router DOM 6
- Tailwind CSS
- Font Awesome

## Funcionalidades Implementadas

✅ **Autenticação**
- Login e registro de usuários integrados com API
- Validação de formulários
- Tratamento de erros

✅ **Navegação**
- Sidebar com navegação entre seções
- Header com menu de usuário

✅ **Análise de Documentos**
- Upload de múltiplos arquivos (PDF, XML, JSON, imagens)
- Formulário de informações do aluno
- Integração com backend para análise
- Polling automático do status
- Exibição de resultados formatados
- Exportação de resultados

✅ **Histórico**
- Listagem de análises realizadas
- Carregamento do backend com fallback para localStorage
- Atualização automática quando nova análise é concluída

✅ **Perfil e Configurações**
- Modal de edição de perfil
- Upload de avatar
- Configurações de idioma
- Configurações de acessibilidade (TTS)

## Próximos Passos

Para continuar o desenvolvimento, você pode:
1. Implementar refresh token para autenticação
2. Adicionar tratamento de timeout nas requisições
3. Implementar retry automático em caso de falha
4. Adicionar mais opções de exportação (Excel, JSON)
5. Implementar busca e filtros no histórico
6. Adicionar notificações em tempo real
