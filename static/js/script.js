var message_text=[{"role": "system", "content": "You are a helpful assistant,You must use Urdu language and avoid the use of Hindi language."}
]
async function fetchSubjectData() {
  const response = await fetch('/api/get_subject_data');
  const subjectData = await response.json();
  message_text = subjectData.messages
  if (subjectData && subjectData.messages) {
      console.log('Messages:', subjectData.messages);
      for(var i=0;i<subjectData.messages.length;i++){
        const messagesContainer = document.getElementById('chat');
        if(subjectData.messages[i].role=="user"){
            messagesContainer.appendChild(createUserMessage(subjectData.messages[i].content));
        }
        else if(subjectData.messages[i].role=="system"){
            continue
        }
        else{
            messagesContainer.appendChild(createBotMessage(subjectData.messages[i].content, true));
        }
      }
  } else {
      console.log('Data not found');
  }
}

fetchSubjectData();
function appendMessage(sender, message) {
    const chatBox = document.getElementById('chat');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageDiv);
  }
  const messagesContainer = document.getElementById('chat');
  messagesContainer.appendChild(createBotMessage("Hello! How can I help you today?", false));
  function getMessageText(element) {
    const childNodes = Array.from(element.childNodes);
    const filteredTextNodes = childNodes
        .filter(node => node.nodeType === 3) // Text nodes have nodeType 3
        .map(node => node.textContent.trim())
        .filter(text => text.length > 0); // Exclude empty text nodes
    return filteredTextNodes.join(' ');
}
  function generateImage(e) {
    
    const parentDiv = e.parentNode;
    const messageText = getMessageText(parentDiv);
    console.log('Message Text:', messageText);
    fetch('http://127.0.0.1:5000/generate-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: messageText}),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          // Display the generated image in the gallery
          const gallery = parentDiv;
          const imageElement = document.createElement('img');
          console.log(data)
          imageElement.src = 'data:image/png;base64,' + data.image_data;
          imageElement.style.width = '100%';
          gallery.appendChild(imageElement);
          e.remove(); // Remove the button
        } else {
          console.error('Error generating image:', data.error);
        }
      })
      .catch(error => console.error('Error:', error.message));
  }

  function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;

    if (message.trim() !== '') {
      appendMessage('user', message);
      messageInput.value = ''; // Clear the input field
    }
  }




function getCompletion() {
    const promptInput = document.getElementById('prompt').value;
    document.getElementById('prompt').value = ''; // Clear the input field
    const messagesContainer = document.getElementById('chat');
    messagesContainer.appendChild(createUserMessage(promptInput));
    const userObj = {
        "role": "user",
        "content": promptInput
    }
    message_text.push(userObj)
    console.log(message_text)
    fetch('http://localhost:5000/get-completion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message_text }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            messagesContainer.appendChild(createBotMessage(data.result, true));
            const botObj = {
                "role": "assistant",
                "content": data.result
            }
            message_text.push(botObj)
            // document.getElementById('chat').innerText = data.result;
        } else {
            document.getElementById('chat').innerText = 'Error fetching completion1.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('chat').innerText = 'Error fetching completion2.';
    });
}


function createUserMessage(text) {
    const userMessageBold = document.createElement('strong');
    const messageBreak = document.createElement('br');
    userMessageBold.textContent = `You: `;
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.appendChild(userMessageBold);
    // userMessage.appendChild(messageBreak);
    userMessage.innerHTML += `${text}`;
    return userMessage;
}

function createBotMessage(text, showButton = false) {
    const botMessageBold = document.createElement('strong');
    const messageBreak = document.createElement('br');
    botMessageBold.textContent = `Bot Response: `;
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot-message';
    botMessage.appendChild(botMessageBold);
    // botMessage.appendChild(messageBreak);
    botMessage.innerHTML += `${text}`;

    if (showButton) {
        const generateImageButton = document.createElement('button');
        const generateImageButtonbreak = document.createElement('br');
        generateImageButton.className = 'generate-image-btn';
        generateImageButton.textContent = 'Generate Image';
        generateImageButton.setAttribute('onclick', 'generateImage(this)'); // You need to define the generateImage function
        botMessage.appendChild(generateImageButtonbreak);

        botMessage.appendChild(generateImageButton);
    }

    return botMessage;
}
    
 