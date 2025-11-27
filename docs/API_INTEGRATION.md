# Documentação de Integração com Backend

Este documento descreve como o frontend se comunica com o backend e quais endpoints são esperados.

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## Autenticação

### Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "usuario@senac.br",
  "password": "senha123"
}
```

**Response (Sucesso):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Funcionário Senac",
    "email": "usuario@senac.br"
  }
}
```

**Response (Erro):**
```json
{
  "message": "Credenciais inválidas"
}
```

### Registro

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@senac.br",
  "password": "senha123"
}
```

**Response:** Similar ao login

## Análise de Documentos

### Enviar Análise

**Endpoint:** `POST /api/analysis/submit`

**Request:** FormData
```
student_document: File (PDF, JPG, PNG)
curriculum_document: File (PDF, XML, JSON)
optional_document: File (opcional)
student_name: string
student_id: string
current_course: string
target_course: string
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "analysis_id": "uuid-da-analise",
  "id": "uuid-da-analise",
  "status": "pending",
  "message": "Análise iniciada com sucesso"
}
```

### Verificar Status

**Endpoint:** `GET /api/analysis/status/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "processing",
  "progress": 45,
  "message": "Processando documentos..."
}
```

**Status possíveis:**
- `pending` - Aguardando processamento
- `processing` - Em processamento
- `completed` - Concluída
- `failed` - Falhou

### Obter Resultados

**Endpoint:** `GET /api/analysis/results/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "equivalent_count": 12,
  "pending_count": 5,
  "total_workload": 480,
  "equivalent_subjects": [
    {
      "name": "Programação Orientada a Objetos",
      "code": "POO-202",
      "workload": 60,
      "equivalent_to": {
        "name": "Desenvolvimento OO",
        "code": "DEV-301"
      }
    }
  ],
  "pending_subjects": [
    {
      "name": "Inteligência Artificial",
      "code": "IA-401",
      "workload": 80,
      "reason": "Disciplina não encontrada no currículo anterior"
    }
  ],
  "notes": "Análise concluída com sucesso. Foram encontradas 12 disciplinas equivalentes.",
  "summary": "Resumo detalhado da análise..."
}
```

### Histórico de Análises

**Endpoint:** `GET /api/analyze/reports`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "uuid-1",
    "student_name": "João Silva",
    "student_id": "12345",
    "current_course": "Análise e Desenvolvimento",
    "target_course": "Sistemas de Informação",
    "date": "2024-01-15T10:30:00Z",
    "equivalent": 12,
    "pending": 5,
    "workload": 480,
    "status": "completed"
  }
]
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** Arquivo binário (PDF, Excel, JSON)

**Formatos suportados:**
- `pdf` - Documento PDF
- `excel` - Planilha Excel
- `json` - Arquivo JSON

## Perfil

### Obter Perfil

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "name": "Funcionário Senac",
  "email": "usuario@senac.br",
  "avatar_url": "https://api.example.com/avatars/1.jpg"
}
```

### Atualizar Perfil

**Endpoint:** `PUT /api/profile`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Novo Nome",
  "email": "novo@senac.br"
}
```

**Response:** Perfil atualizado

### Upload de Avatar

**Endpoint:** `POST /api/profile/avatar`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:** FormData
```
avatar: File (imagem)
```

**Response:**
```json
{
  "avatar_url": "https://api.example.com/avatars/1.jpg"
}
```

## Tratamento de Erros

Todos os endpoints devem retornar erros no seguinte formato:

```json
{
  "message": "Mensagem de erro descritiva",
  "error": "Código do erro (opcional)",
  "details": {} // Detalhes adicionais (opcional)
}
```

**Códigos HTTP:**
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autenticado
- `403` - Sem permissão
- `404` - Não encontrado
- `500` - Erro interno do servidor

## Polling de Status

O frontend faz polling automático do status da análise a cada 2 segundos até que o status seja `completed` ou `failed`.

**Fluxo:**
1. Usuário envia documentos
2. Backend retorna `analysis_id`
3. Frontend inicia polling em `/api/analysis/status/:id`
4. Quando status = `completed`, frontend busca resultados em `/api/analysis/results/:id`
5. Frontend exibe resultados e salva no histórico

## Exemplo de Implementação Backend (Python/Flask)

```python
@app.route('/api/analysis/submit', methods=['POST'])
@require_auth
def submit_analysis():
    form_data = request.form
    files = request.files
    
    # Processar arquivos
    student_doc = files.get('student_document')
    curriculum_doc = files.get('curriculum_document')
    
    # Criar análise
    analysis_id = create_analysis(
        student_name=form_data.get('student_name'),
        student_id=form_data.get('student_id'),
        current_course=form_data.get('current_course'),
        target_course=form_data.get('target_course'),
        documents=[student_doc, curriculum_doc]
    )
    
    # Processar em background
    process_analysis.delay(analysis_id)
    
    return jsonify({
        'analysis_id': analysis_id,
        'status': 'pending'
    }), 201

@app.route('/api/analysis/status/<analysis_id>', methods=['GET'])
@require_auth
def get_analysis_status(analysis_id):
    analysis = get_analysis(analysis_id)
    
    return jsonify({
        'status': analysis.status,
        'progress': analysis.progress
    })
```

