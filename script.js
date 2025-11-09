// User dropdown functionality
const userMenuButton = document.getElementById('user-menu-button');
const userDropdown = document.getElementById('user-dropdown');

userMenuButton.addEventListener('click', () => {
    userDropdown.classList.toggle('hidden');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.add('hidden');
    }
});

// Profile and settings modals
function showProfileSettings() {
    document.getElementById('profile-modal').classList.remove('hidden');
    userDropdown.classList.add('hidden');
}

function hideProfileSettings() {
    document.getElementById('profile-modal').classList.add('hidden');
}

function showSettings() {
    document.getElementById('settings-modal').classList.remove('hidden');
    userDropdown.classList.add('hidden');
}

function hideSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
}

// Avatar upload functionality
const avatarUpload = document.getElementById('avatar-upload');
avatarUpload.addEventListener('change', function(e) {
    handleAvatarUpload(e.target.files[0]);
});

function handleAvatarUpload(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('profile-avatar').src = event.target.result;
            document.getElementById('profile-avatar').classList.remove('hidden');
            document.getElementById('profile-avatar-placeholder').classList.add('hidden');
            
            // Update all avatars
            document.getElementById('user-avatar').src = event.target.result;
            document.getElementById('user-avatar').classList.remove('hidden');
            document.getElementById('avatar-placeholder').classList.add('hidden');
            
            document.getElementById('sidebar-avatar').src = event.target.result;
            document.getElementById('sidebar-avatar').classList.remove('hidden');
            document.getElementById('sidebar-avatar-placeholder').classList.add('hidden');
            
            localStorage.setItem('avatar', event.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function handleSidebarAvatarChange(input) {
    if (input.files && input.files[0]) {
        handleAvatarUpload(input.files[0]);
    }
}

function saveProfileSettings() {
    // In a real app, this would save to backend
    const fullName = document.getElementById('profile-fullname').value;
    if (fullName) {
        document.querySelector('.sidebar-item.active .user-name').textContent = fullName;
        document.getElementById('profile-name').textContent = fullName;
    }
    hideProfileSettings();
    alert('Configurações do perfil salvas com sucesso!');
}

function saveSettings() {
    // In a real app, this would save to backend
    hideSettings();
    alert('Configurações do sistema salvas com sucesso!');
    
    // Apply language
    const language = document.getElementById('language-preference').value;
    changeLanguage(language);
    
    // Apply TTS settings
    localStorage.setItem('ttsEnabled', ttsEnabled);
}

// Screen navigation functions
function showAuthScreen() {
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('register-screen').classList.add('hidden');
}

function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('register-screen').classList.add('hidden');
}

function showRegisterScreen() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('register-screen').classList.remove('hidden');
}

function showMainScreen() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
}

// File upload handling
const fileUploadArea = document.getElementById('file-upload-area');
const fileInput = document.getElementById('file-upload');
const selectedFilesDiv = document.getElementById('selected-files');
const filesList = document.getElementById('files-list');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileUploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    fileUploadArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    fileUploadArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    fileUploadArea.classList.add('active');
}

function unhighlight() {
    fileUploadArea.classList.remove('active');
}

fileUploadArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

fileInput.addEventListener('change', function() {
    handleFiles(this.files);
});

function handleFiles(files) {
    if (files.length > 0) {
        filesList.innerHTML = '';
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.match('application/pdf') || 
                file.type.match('application/xml') || 
                file.type.match('application/json') ||
                file.type.match('image/.*') ||
                file.name.endsWith('.pdf') || 
                file.name.endsWith('.xml') || 
                file.name.endsWith('.json') ||
                file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                
                const fileItem = document.createElement('div');
                fileItem.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
                
                fileItem.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <i class="fas ${getFileIcon(file)} text-blue-500"></i>
                        <div>
                            <p class="text-sm font-medium text-gray-900 truncate max-w-xs">${file.name}</p>
                            <p class="text-xs text-gray-500">${formatFileSize(file.size)}</p>
                        </div>
                    </div>
                    <button class="text-red-500 hover:text-red-700" onclick="removeFile(this)">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                filesList.appendChild(fileItem);
            }
        }
        
        if (filesList.children.length > 0) {
            selectedFilesDiv.classList.remove('hidden');
            
            // Simulate file analysis (in a real app, this would call your Python backend)
            setTimeout(() => {
                addBotMessage("Recebi seus arquivos. Estou analisando o conteúdo para verificar possíveis equivalências curriculares...");
                
                // Simulate analysis completion after 3 seconds with attachments
                setTimeout(() => {
                    addBotMessage("Análise concluída! Encontrei algumas equivalências que podem ser úteis. Veja os resultados:", [
                        {
                            type: "pdf",
                            name: "Relatório de Equivalências.pdf",
                            url: "http://static.photos/education/640x360/4"
                        },
                        {
                            type: "image", 
                            name: "Mapa de Equivalências.png",
                            url: "http://static.photos/education/640x360/5"
                        }
                    ]);
                    
                    // Show sample results
                    document.querySelectorAll('.result-item').forEach(el => {
                        el.classList.remove('hidden');
                    });
                }, 3000);
            }, 1000);
        }
    }
}

function getFileIcon(file) {
    if (file.type.match('application/pdf') || file.name.endsWith('.pdf')) {
        return 'fa-file-pdf';
    } else if (file.type.match('application/xml') || file.name.endsWith('.xml')) {
        return 'fa-file-code';
    } else if (file.type.match('application/json') || file.name.endsWith('.json')) {
        return 'fa-file-alt';
    } else if (file.type.match('image/.*') || file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return 'fa-file-image';
    }
    return 'fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(button) {
    const fileItem = button.closest('div');
    fileItem.remove();
    
    if (filesList.children.length === 0) {
        selectedFilesDiv.classList.add('hidden');
    }
}

// Accessibility - Text to Speech
let ttsEnabled = localStorage.getItem('ttsEnabled') === 'true';
const synth = window.speechSynthesis;

function toggleTTS() {
    ttsEnabled = !ttsEnabled;
    localStorage.setItem('ttsEnabled', ttsEnabled.toString());
    const btn = document.getElementById('toggle-tts-btn');
    if (ttsEnabled) {
        btn.classList.add('bg-blue-600');
        btn.classList.remove('bg-gray-200');
        // Move toggle to right
        btn.querySelector('span').classList.add('translate-x-5');
        // Read welcome message
        const welcomeMsg = document.querySelector('.chat-bubble-bot p');
        if (welcomeMsg) {
            const utterance = new SpeechSynthesisUtterance(welcomeMsg.textContent);
            utterance.lang = 'pt-BR';
            synth.speak(utterance);
        }
    } else {
        btn.classList.remove('bg-blue-600');
        btn.classList.add('bg-gray-200');
        // Move toggle to left
        btn.querySelector('span').classList.remove('translate-x-5');
        synth.cancel();
    }
}

function readAloud(elementId, isInput = false) {
    if (!synth) return;
    
    synth.cancel(); // Cancel any ongoing speech
    
    let text;
    if (isInput) {
        text = document.getElementById(elementId).value;
        if (!text) text = "Campo de digitação. Por favor, digite sua mensagem.";
    } else {
        text = document.getElementById(elementId).innerText;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1;
    utterance.pitch = 1;
    synth.speak(utterance);
}

// Initialize TTS button state
if (ttsEnabled) {
    const btn = document.getElementById('toggle-tts-btn');
    btn.classList.add('bg-blue-600');
    btn.classList.remove('bg-gray-200');
    btn.querySelector('span').classList.add('translate-x-5');
}

// Chat functionality
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addUserMessage(message);
        chatInput.value = '';
        
        // Simulate bot response with attachments (in a real app, this would call your Python/IA backend)
        setTimeout(() => {
            const responses = [
                {
                    text: "Analisando sua pergunta sobre equivalência curricular...",
                    attachments: []
                },
                {
                    text: "Vou verificar no banco de dados de disciplinas...",
                    attachments: []
                },
                {
                    text: "Com base na grade curricular anterior, encontrei algumas equivalências...",
                    attachments: [
                        {
                            type: "pdf",
                            name: "Relatório de Equivalências.pdf",
                            url: "http://static.photos/education/640x360/1"
                        }
                    ]
                },
                {
                    text: "Aqui está um exemplo de grade curricular em XML para referência:",
                    attachments: [
                        {
                            type: "xml",
                            name: "Grade_Curricular_Exemplo.xml",
                            url: "http://static.photos/technology/640x360/2"
                        }
                    ]
                },
                {
                    text: "Veja esta imagem ilustrativa do fluxo curricular:",
                    attachments: [
                        {
                            type: "image",
                            name: "Fluxo_Curricular.png",
                            url: "http://static.photos/education/640x360/3"
                        }
                    ]
                }
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addBotMessage(randomResponse.text, randomResponse.attachments);
            
            // Scroll to bottom of chat
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 1000);
    }
}

function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start justify-end space-x-3';
    const messageId = 'user-message-' + Date.now();
    messageDiv.innerHTML = `
        <div class="chat-bubble-user px-4 py-3 max-w-xs md:max-w-md lg:max-w-lg">
            <p class="text-sm" id="${messageId}">${message}</p>
        </div>
        <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <i class="fas fa-user text-white"></i>
            </div>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Read message aloud if TTS is enabled
    if (ttsEnabled) {
        readAloud(messageId);
    }
}

function addBotMessage(message, attachments = []) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start space-x-3';
    const messageId = 'bot-message-' + Date.now();
    
    let attachmentsHTML = '';
    if (attachments.length > 0) {
        attachmentsHTML = '<div class="mt-3 space-y-2">';
        attachments.forEach(attachment => {
            if (attachment.type === 'image') {
                attachmentsHTML += `
                    <div class="border border-gray-200 rounded-lg overflow-hidden">
                        <img src="${attachment.url}" alt="Attachment" class="w-full h-auto max-h-64 object-contain">
                        <div class="p-2 bg-gray-50 text-xs text-gray-500 truncate">${attachment.name}</div>
                    </div>
                `;
            } else if (attachment.type === 'pdf') {
                attachmentsHTML += `
                    <div class="flex items-center p-2 border border-gray-200 rounded-lg bg-gray-50">
                        <i class="fas fa-file-pdf text-red-500 mr-2"></i>
                        <a href="${attachment.url}" target="_blank" class="text-sm text-blue-600 hover:underline">${attachment.name}</a>
                    </div>
                `;
            } else if (attachment.type === 'xml') {
                attachmentsHTML += `
                    <div class="flex items-center p-2 border border-gray-200 rounded-lg bg-gray-50">
                        <i class="fas fa-file-code text-blue-500 mr-2"></i>
                        <a href="${attachment.url}" target="_blank" class="text-sm text-blue-600 hover:underline">${attachment.name}</a>
                    </div>
                `;
            }
        });
        attachmentsHTML += '</div>';
    }

    messageDiv.innerHTML = `
        <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="fas fa-robot text-blue-600"></i>
            </div>
        </div>
        <div class="chat-bubble-bot px-4 py-3 max-w-xs md:max-w-md lg:max-w-lg">
            <p class="text-sm" id="${messageId}">${message}</p>
            ${attachmentsHTML}
            <div class="mt-2 flex justify-end">
                <button class="text-blue-600 hover:text-blue-800 text-sm flex items-center" onclick="readAloud('${messageId}')">
                    <i class="fas fa-volume-up mr-1"></i> Ouvir
                </button>
            </div>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Read message aloud if TTS is enabled
    if (ttsEnabled) {
        readAloud(messageId);
    }
}

// Section switching
function showChatSection() {
    document.getElementById('history-section').classList.add('hidden');
    document.getElementById('file-upload-area').classList.remove('hidden');
    document.getElementById('selected-files').classList.add('hidden');
    document.getElementById('chat-container').classList.remove('hidden');
    document.getElementById('document-analysis-section').classList.add('hidden');
    updateActiveSidebarItem('chat');
}

function showHistorySection() {
    document.getElementById('history-section').classList.remove('hidden');
    document.getElementById('file-upload-area').classList.add('hidden');
    document.getElementById('selected-files').classList.add('hidden');
    document.getElementById('chat-container').classList.add('hidden');
    document.getElementById('document-analysis-section').classList.add('hidden');
    updateActiveSidebarItem('history');
    loadChatHistory();
}

function showDocumentAnalysisSection() {
    document.getElementById('history-section').classList.add('hidden');
    document.getElementById('file-upload-area').classList.add('hidden');
    document.getElementById('selected-files').classList.add('hidden');
    document.getElementById('chat-container').classList.add('hidden');
    document.getElementById('document-analysis-section').classList.remove('hidden');
    updateActiveSidebarItem('documentAnalysis');
}

// Chat history functionality
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
let currentChatId = null;

function saveChatToHistory(chatId, title) {
    const existingChat = chatHistory.find(chat => chat.id === chatId);
    
    if (!existingChat) {
        chatHistory.unshift({
            id: chatId,
            title: title || `Chat ${chatHistory.length + 1}`,
            date: new Date().toISOString(),
            messages: []
        });
    } else {
        existingChat.date = new Date().toISOString();
    }
    
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    loadChatHistory();
}

function loadChatHistory() {
    const chatHistoryList = document.getElementById('chat-history-list');
    chatHistoryList.innerHTML = '';
    
    chatHistory.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer';
        chatItem.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-comment text-blue-500"></i>
                <div>
                    <p class="text-sm font-medium text-gray-900">${chat.title}</p>
                    <p class="text-xs text-gray-500">${new Date(chat.date).toLocaleString()}</p>
                </div>
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
        `;
        
        chatItem.addEventListener('click', () => loadChat(chat.id));
        chatHistoryList.appendChild(chatItem);
    });
}

function startNewChat() {
    currentChatId = 'chat-' + Date.now();
    document.getElementById('chat-container').innerHTML = '';
    showChatSection();
    
    // Add welcome message
    addBotMessage("Olá! Sou o assistente de análise curricular do Senac. Como posso ajudar você hoje?");
    
    // Save to history
    saveChatToHistory(currentChatId, `Novo Chat ${chatHistory.length + 1}`);
}

function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    
    currentChatId = chatId;
    document.getElementById('chat-container').innerHTML = '';
    
    // In a real app, you would load the messages from the chat object
    addBotMessage("Chat carregado. Continuando nossa conversa anterior...");
    
    showChatSection();
}

// Initialize with a new chat
function initializeChat() {
    if (chatHistory.length === 0) {
        startNewChat();
    } else {
        currentChatId = chatHistory[0].id;
        loadChat(currentChatId);
    }
}

function updateActiveSidebarItem(activeItem) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
        item.classList.remove('dark:bg-gray-700');
        const icon = item.querySelector('i');
        icon.classList.remove('text-blue-600');
        icon.classList.add('text-gray-500');
    });
    
    const activeElement = document.querySelector(`[onclick="show${activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}Section();"]`);
    if (activeElement) {
        activeElement.classList.add('active');
        activeElement.classList.add('dark:bg-gray-700');
        const icon = activeElement.querySelector('i');
        icon.classList.remove('text-gray-500');
        icon.classList.add('text-blue-600');
    }
}

// Save user name to localStorage
function saveProfileSettings() {
    const fullName = document.getElementById('profile-fullname').value;
    if (fullName) {
        localStorage.setItem('userName', fullName);
        document.querySelector('.sidebar-item.active .user-name').textContent = fullName;
        document.getElementById('profile-name').textContent = fullName;
    }
    hideProfileSettings();
    alert('Configurações do perfil salvas com sucesso!');
}

// Load user name from localStorage
function loadUserData() {
    // Load TTS preference
    if (localStorage.getItem('ttsEnabled') === 'true') {
        ttsEnabled = true;
        document.getElementById('toggle-tts-btn').classList.add('bg-blue-100', 'text-blue-600');
    }
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('profile-fullname').value = userName;
        document.querySelector('.sidebar-item.active .user-name').textContent = userName;
        document.getElementById('profile-name').textContent = userName;
    }
    
    // Load avatar if exists
    const avatar = localStorage.getItem('avatar');
    if (avatar) {
        document.getElementById('profile-avatar').src = avatar;
        document.getElementById('profile-avatar').classList.remove('hidden');
        document.getElementById('profile-avatar-placeholder').classList.add('hidden');
        
        document.getElementById('user-avatar').src = avatar;
        document.getElementById('user-avatar').classList.remove('hidden');
        document.getElementById('avatar-placeholder').classList.add('hidden');
        
        document.getElementById('sidebar-avatar').src = avatar;
        document.getElementById('sidebar-avatar').classList.remove('hidden');
        document.getElementById('sidebar-avatar-placeholder').classList.add('hidden');
    }
    
    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark');
    }
}

// Language change function
function changeLanguage(lang) {
    // In a real app, this would load translations
    console.log('Language changed to:', lang);
    localStorage.setItem('language', lang);
}

// Initialize with login screen and load user data
showAuthScreen();
loadUserData();
initializeChat();

// Add document analysis event listeners
document.getElementById('student-pdf').addEventListener('change', function(e) {
    handleFileSelection(e, 'student-file-info', 'student-file-name');
});

document.getElementById('curriculum-pdf').addEventListener('change', function(e) {
    handleFileSelection(e, 'curriculum-file-info', 'curriculum-file-name');
});

document.getElementById('optional-pdf').addEventListener('change', function(e) {
    handleFileSelection(e, 'optional-file-info', 'optional-file-name');
});

function handleFileSelection(event, infoDivId, fileNameId) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById(infoDivId).classList.remove('hidden');
        document.getElementById(fileNameId).textContent = file.name;
    }
}