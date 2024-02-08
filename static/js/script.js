try{
  var subject_name = localStorage.getItem('subject_name');
  var message_text=[{"role": "system", "content": `You are a dedicated ${subject_name} Assistant, here to provide the user with comprehensive information and assistance on all things only related to ${subject_name}.`}
  ]
}
catch (error) {
  console.error('Error:', error);
  // document.getElementById('chat').innerText = 'Error fetching completion2.';
}
async function fetchSubjectData() {
  try{
  const response = await fetch('/api/get_subject_data');
  const subjectData = await response.json();
  if (subjectData && subjectData.messages) {
      message_text = subjectData.messages
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
catch (error) {
  console.error('Error:', error);
  // document.getElementById('chat').innerText = 'Error fetching completion2.';
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
function synthesize_speech(e) {
  const messageText = getMessageText(e.parentNode);
  console.log('Message Text:', messageText);
  fetch('http://localhost:5000/synthesize_speech', {
  // fetch('https://curricuai.azurewebsites.net/synthesize_speech', {
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
      console.log(data)
    })
    .catch(error => console.error('Error:', error.message));
}
  function generateImage(e) {
    const loaderDiv = e.previousSibling.previousSibling;
    loaderDiv.style.display = 'block';
    // console.log('Loader Div:', loaderDiv);
    e.style.display = 'none'; // Hide the button
    const parentDiv = e.parentNode;
    const messageText = getMessageText(parentDiv);
    console.log('Message Text:', messageText);
    fetch('https://curricuai.azurewebsites.net/generate-image', {
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
          loaderDiv.style.display = 'none'; // Hide the loader
          const gallery = parentDiv;
          const imageElement = document.createElement('img');
          console.log(data)
          imageElement.src = 'data:image/png;base64,' + data.image_data;
          imageElement.style.width = '70%';
          gallery.appendChild(imageElement);
          e.remove(); // Remove the button
        } else {
          loaderDiv.style.display = 'none'; // Hide the loader
          e.style.display = 'block'; // Show the button again
          const chatContainer = document.getElementById('chat')
          
          // add it in above the chat container
          chatContainer.insertBefore(createAlert(data.error), chatContainer.firstChild);
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


  function nullifyMessagesArray() {
    // const apiUrl = 'http://localhost:5000/api/nullMessageArray';  // Adjust the URL based on your Flask app's route
    const apiUrl = 'https://curricuai.azurewebsites.net/api/nullMessageArray';  // Adjust the URL based on your Flask app's route
    const promptEng = {
      "role": "system",
      "content": `You are a dedicated ${subject_name} Assistant, here to provide the user with comprehensive information and assistance on all things only related to ${subject_name}.`
  }
    // Make the API request
    fetch(apiUrl, {
      method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: [promptEng] }),
    })
    .then(response => response.json())
    .then(data => {
      // Handle the API response data
        alert("Chat session Cleared Successfully")
        window.location.reload();
    })
    .catch(error => {
        console.error('Error fetching from API: ', error);
    });
}


function getCompletion(audioMessage) {
  if(!audioMessage){
    var promptInput = document.getElementById('prompt').value;
  }
  else{
    var promptInput = audioMessage;
  }
    document.getElementById('prompt').value = ''; // Clear the input field
    const messagesContainer = document.getElementById('chat');
    messagesContainer.appendChild(createUserMessage(promptInput));
    const userObj = {
        "role": "user",
        "content": promptInput
    }
    const promptEng = {
        "role": "system",
        "content": `You are a dedicated ${subject_name} Assistant, here to provide the user with comprehensive information and assistance on all things only related to ${subject_name}.`
    }
    message_text.push(userObj)
    // i want to pop first element of list message_text or replace it with my first object
    message_text[0] = promptEng
    console.log(message_text)
    // fetch('http://localhost:5000/get-completion', {
    fetch('https://curricuai.azurewebsites.net/get-completion', {
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
// write createLoader function to create following html
//   <div class="spinner-grow spinner-grow-sm" role="status">
//   <span class="sr-only">Loading...</span>
// </div>

function createLoader(){
    const loader = document.createElement('div');
    loader.className = 'spinner-grow spinner-grow-sm';
    loader.setAttribute('role', 'status');
    const span = document.createElement('span');
    span.className = 'sr-only';
    loader.appendChild(span);
    return loader;
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
        const loadersDiv = document.createElement('div');
        loadersDiv.className = 'loaders spim';
        // add ID
        loadersDiv.id = 'loaders';
        const playButton = document.createElement('button');
        playButton.className = 'play-btn';
        playButton.textContent = 'Play';
        playButton.setAttribute('onclick', 'synthesize_speech(this)'); // You need to define the synthesize_speech function
        // loadersDiv.appendChild(playButton);

        const generateImageButton = document.createElement('button');
        const generateImageButtonbreak = document.createElement('br');
        generateImageButton.className = 'generate-image-btn';
        generateImageButton.textContent = 'Generate Image';
        generateImageButton.setAttribute('onclick', 'generateImage(this)'); // You need to define the generateImage function
        loadersDiv.appendChild(createLoader());
        loadersDiv.appendChild(createLoader());
        loadersDiv.appendChild(createLoader());
        botMessage.appendChild(loadersDiv);
        botMessage.appendChild(generateImageButtonbreak);
        botMessage.appendChild(generateImageButton);
        botMessage.appendChild(playButton);
    }

    return botMessage;
}
    
//  create this html
/* <div class="alert alert-danger" role="alert">
  A simple danger alert—check it out!
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'
  
</div> */
function createAlert(message) {
    // const alertDiv = document.createElement('div');
    // create dismissal button
    // const alertPlaceholder = document.getElementById('chat')
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-danger alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
    // alertPlaceholder.append(wrapper)
    return wrapper;
}