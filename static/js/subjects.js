// console.log(boardData.val);
fetch('/showSubjects', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ board: board_name, grade_name: grade_name}),
    })
    .then(response => response.json())
    .then(data => {
        // Log the array in the console
        console.log('Listed Subjects:', data);
        // Sample array of board names
        const subject_list = data['data']
        // Get the container element
        const container = document.getElementById("boardsList");
        var s = 0
        // Loop through the array of board names
        for(let i = 0; i<subject_list.length/2; i++){
          // Create card elements
          const alldivCard = document.createElement("div");
          alldivCard.classList.add("alldivs");
          for(let j = 0; j<2; j++){
            if(subject_list[s] == undefined){
              break
            }
            var cardContainer = document.createElement('div');
            cardContainer.className = 'card1';
            cardContainer.setAttribute("onclick", "goToChat(this)")
            // Create image card
            var imgCard = document.createElement('div');
            imgCard.className = 'imgcard imgcard1';
            cardContainer.appendChild(imgCard);

            // Create options container
            var optsContainer = document.createElement('div');
            optsContainer.className = 'opts2';

            // Create head container
            var headContainer = document.createElement('div');
            headContainer.className = 'head container';

            // Create board name paragraph
            var boardNameParagraph = document.createElement('p');
            boardNameParagraph.className = 'infoclr';
            boardNameParagraph.textContent = board_name;
            // Create ellipsis icon link
            var ellipsisLink = document.createElement('a');
            ellipsisLink.href = '#';
            
            // Create ellipsis icon image
            var ellipsisIcon = document.createElement('img');
            ellipsisIcon.src = '/static/icons/icon-ellipsis.svg';
            ellipsisIcon.className = 'dotdotdot';
            ellipsisIcon.alt = '';
            ellipsisLink.appendChild(ellipsisIcon);
            
            // Append board name and ellipsis icon to head container
            headContainer.appendChild(boardNameParagraph);
            boardNameParagraph.appendChild(ellipsisLink);

            // Append head container to options container
            optsContainer.appendChild(headContainer);

            // Create times container
            var timesContainer = document.createElement('div');
            timesContainer.className = 'times';

            // Create grade paragraph
            var gradeParagraph = document.createElement('p');
            gradeParagraph.className = 'infoclr current';
            gradeParagraph.textContent = subject_list[s];

            // Append grade paragraph to times container
            timesContainer.appendChild(gradeParagraph);

            // Append times container to options container
            optsContainer.appendChild(timesContainer);

            // Append options container to main card container
            cardContainer.appendChild(optsContainer);

            // Append the main card container to the body or another desired parent element
            alldivCard.appendChild(cardContainer);
          s++
          }
          // Append elements to their respective parents
          container.appendChild(alldivCard);
        }

        // Check if only one card is left, create a single card for it
        if (subject_list.length === 1) {
          const remainingCard = document.createElement("div");
          remainingCard.classList.add("card1");
            
          const imgCard = document.createElement("div");
          imgCard.classList.add("imgcard", "imgcard2"); // Add other classes as needed
        
          const opts2 = document.createElement("div");
          opts2.classList.add("opts2");
        
          const head = document.createElement("div");
          head.classList.add("head", "container"); // Add other classes as needed
        
          const times = document.createElement("div");
          times.classList.add("times");
        
          const paragraph = document.createElement("p");
          paragraph.classList.add("infoclr", "current");
          paragraph.textContent = subject_list[0];
        
          // Append elements to the remaining card
          container.appendChild(remainingCard);
          remainingCard.appendChild(imgCard);
          remainingCard.appendChild(opts2);
          opts2.appendChild(head);
          opts2.appendChild(times);
          times.appendChild(paragraph);
        }
    }
    )

    // function to redirect to chat.html
    function goToChat(e) {
      const subject_name = e.childNodes[1].childNodes[1].childNodes[0].textContent;
      console.log(subject_name)
      let cleanedSentence = subject_name.trim().replace(/\s+/g, ' ');
      fetch('/getSubjectName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject_name: cleanedSentence}),
        })
        .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error('Failed to fetch');
            }
          })
        .then(data => {
          console.log(data)
          window.location.href = '/chat';
        })
        .catch((error) => {
            console.error('Error:', error);
            });

    }
// const subject_list = boardData.subjects

// const container = document.getElementById("boardsList");
// var s = 0
// // Loop through the array of board names
// for(let i = 0; i<subject_list.length/2; i++){
//   // Create card elements
//   const alldivCard = document.createElement("div");
//   alldivCard.classList.add("alldivs");
//   for(let j = 0; j<2; j++){
//     if(subject_list[s] == undefined){
//       break
//     }
//   const card = document.createElement("div");
//   card.classList.add("card1");

//   card.setAttribute("onclick", "goToStandards(this)")

//   const imgCard = document.createElement("div");
//   imgCard.classList.add("imgcard", "imgcard2"); // Add other classes as needed

//   const opts2 = document.createElement("div");
//   opts2.classList.add("opts2");

//   const head = document.createElement("div");
//   head.classList.add("head", "container"); // Add other classes as needed

//   const times = document.createElement("div");
//   times.classList.add("times");

//   const paragraph = document.createElement("p");
//   paragraph.classList.add("infoclr", "current");
//   paragraph.textContent = subject_list[s];
  
//   alldivCard.appendChild(card);
//   card.appendChild(imgCard);
//   card.appendChild(opts2);
//   opts2.appendChild(head);
//   opts2.appendChild(times);
//   times.appendChild(paragraph);
//   s++
//   }
//   // Append elements to their respective parents
//   container.appendChild(alldivCard);
// }

// // Check if only one card is left, create a single card for it
// if (subject_list.length === 1) {
//   const remainingCard = document.createElement("div");
//   remainingCard.classList.add("card1");

//   const imgCard = document.createElement("div");
//   imgCard.classList.add("imgcard", "imgcard2"); // Add other classes as needed

//   const opts2 = document.createElement("div");
//   opts2.classList.add("opts2");

//   const head = document.createElement("div");
//   head.classList.add("head", "container"); // Add other classes as needed

//   const times = document.createElement("div");
//   times.classList.add("times");

//   const paragraph = document.createElement("p");
//   paragraph.classList.add("infoclr", "current");
//   paragraph.textContent = subject_list[0];

//   // Append elements to the remaining card
//   container.appendChild(remainingCard);
//   remainingCard.appendChild(imgCard);
//   remainingCard.appendChild(opts2);
//   opts2.appendChild(head);
//   opts2.appendChild(times);
//   times.appendChild(paragraph);
// }
