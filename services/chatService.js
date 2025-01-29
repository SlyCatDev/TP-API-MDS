import { determineCoupureGeneric } from 'api_sylvain';

// Liste des gros mots à filtrer
const grossieretes = ['merde', 'putain', 'connard', 'pute', 'fuck', 'bite', 'couille', 'enculé', 'salope'];

// Ajout de la déclaration de messageHistory
let messageHistory = [];

// Fonction pour filtrer les gros mots
function filtrerMessage(message) {
    const MAX_LENGTH = 500;
    if (message.length > MAX_LENGTH) {
        message = message.substring(0, MAX_LENGTH) + '...';
    }

    let filtreMessage = message.toLowerCase();
    grossieretes.forEach(mot => {
        const regex = new RegExp(`\\b${mot}\\b`, 'gi');
        filtreMessage = filtreMessage.replace(regex, '***');
    });
    return filtreMessage;
}

export function initializeChat(io) {
    io.on('connection', (socket) => {
        let username = '';
    
        socket.on('user connected', (username) => {
            socket.emit('message history', messageHistory);
            io.emit('user connected', `${username} vient de se connecter au chat`);
            console.log(`${username} s'est connecté`);
        });

        socket.on('message', (msg) => {
            const now = new Date();
            const messageData = {
                username: msg.username,
                text: filtrerMessage(msg.text),
                time: now.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            };
            
            messageHistory.push(messageData);
            if (messageHistory.length > 50) {
                messageHistory.shift();
            }
            
            io.emit('message', messageData);
            console.log(`Message de ${msg.username}: ${messageData.text}`);
        });

        socket.on('disconnect', () => {
            if (username) {
                io.emit('user disconnected', `${username} a quitté le chat`);
                console.log(`${username} s'est déconnecté`);
            }
        });
});
}