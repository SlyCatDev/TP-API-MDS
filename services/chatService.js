import { determineCoupureGeneric } from 'api_sylvain';

// garde l'historique des messages
let messageHistory = [];
 
// Liste des gros mots à filtrer
const grossieretes = ['merde', 'putain', 'connard', 'pute', 'fuck', 'bite', 'couille', 'enculé', 'salope'];
 
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
            socket.username = username;
            socket.emit('message history', messageHistory);
            io.emit('user connected', `${username} vient de se connecter au chat`);
            console.log(`${username} s'est connecté`);
        });
 
        socket.on('message', (msg) => {
            if (!msg || !msg.text) return; // Protection contre les messages invalides
            const now = new Date();
            let texteMessage = filtrerMessage(msg.text);
 
            // Vérifier si c'est une commande DAB
            if (texteMessage.startsWith('#dab ')) {
                const match = texteMessage.match(/#dab (\d+)€?/);
                if (match) {
                    const montant = Number(match[1]);
                    if (!isNaN(montant) && montant > 0) {
                        const result = determineCoupureGeneric({ montant, devise: '€' });
                        console.log(`Calcul des coupures pour ${montant}€`);
                        console.log(`Résultat :`, result);
                        io.emit('message', {
                            username: 'DAB-Bot',
                            text: `Coupures pour ${montant}€ : ${result}`,
                            time: now.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })
                        });
                        return;
                    }
                }
            }
 
            const messageData = {
                username: msg.username,
                text: texteMessage,
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
            if (socket.username) {
                io.emit('user disconnected', `${socket.username} a quitté le chat`);
                console.log(`${socket.username} s'est déconnecté`);
            }
        });
    });
}