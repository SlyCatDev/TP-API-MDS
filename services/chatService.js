// Tableau pour stocker l'historique des messages
const messageHistory = [];

// Liste des gros mots à filtrer
const grossieretes = ['merde', 'putain', 'connard', 'pute', 'fuck', 'bite', 'couille', 'enculé', 'salope'];

// Fonction pour filtrer les gros mots
function filtrerMessage(message) {
    let messageFiltré = message.toLowerCase();
    grossieretes.forEach(mot => {
        const regex = new RegExp(mot, 'gi');
        messageFiltré = messageFiltré.replace(regex, '***');
    });
    return messageFiltré;
}

export function initializeChat(io) {
    io.on('connection', (socket) => {
        let username = '';

        socket.on('user connected', (pseudo) => {
            username = pseudo;
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

/* function sendMsg(options) {
    const options = 

    const msg = {
        time: new Date().toJSON(),
        message : 

}


}
*/
