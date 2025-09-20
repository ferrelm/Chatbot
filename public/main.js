(() => {
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const clearBtn = document.getElementById('clear-btn');

    function displayMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        const messageParagraph = document.createElement('p');
        messageParagraph.innerText = message;
        messageElement.appendChild(messageParagraph);
        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    async function getChatbotResponse(userMessage) {
        const res = await fetch('/getChatbotResponse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userMessage }),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Request failed: ${res.status}`);
        }
        return res.json();
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        displayMessage('user', message);
        userInput.value = '';
        userInput.focus();
        sendBtn.disabled = true;
        try {
            const data = await getChatbotResponse(message);
            displayMessage('chatbot', data.chatbotResponse);
        } catch (err) {
            console.error(err);
            displayMessage('chatbot', 'Sorry, there was a problem getting a response.');
        } finally {
            sendBtn.disabled = false;
        }
    }

    function clearChat() {
        chatLog.innerHTML = '';
        userInput.value = '';
        userInput.focus();
    }

    // Wire events
    sendBtn.addEventListener('click', sendMessage);
    clearBtn.addEventListener('click', clearChat);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
})();