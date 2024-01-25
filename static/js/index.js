var paragraphs = document.getElementsByClassName('animated-paragraph');
var delay = 5000;

function showParagraphs(index) {
    if (index < paragraphs.length) {
        paragraphs[index].style.opacity = 1;
        setTimeout(function() {
            paragraphs[index].style.opacity = 0;
            showParagraphs(index + 1);
        }, delay);
    }
}

showParagraphs(0);


function performLogin(){
    window.location.href = "/login";
}




// var i = 0; 
// var speed = 50;
// function typeWriter() {
//     var txt = 'Ask AI what he can find about your files.';
//   if (i < txt.length) {
//     document.getElementById("aipera").innerHTML += txt.charAt(i);
//     i++;
//     setTimeout(typeWriter, speed);
//   }
// }
// // clearInterval(s)
// setInterval(typeWriter, 5000);
// // // Define an array of sentences to display
// // var sentences = ["Sentence 1", "Sentence 2", "Sentence 3", "Sentence 4"];

// // // Define a variable to keep track of the current sentence index
// // var currentIndex = 0;

// // // Define a function to display the next sentence in the array
// // function showNextSentence() {
// //   // Get a reference to the paragraph tag in the HTML document
// //   var paragraph = document.getElementById("aipera");

// //   // Add the "enter" class to the paragraph to trigger the enter animation
// //   paragraph.classList.add("enter");

// //   // Set the text of the paragraph to the current sentence in the array after a delay of 0.5 seconds
// //   setTimeout(function() {
// //     paragraph.innerText = sentences[currentIndex];

// //     // Remove the "enter" class and add the "exit" class to the paragraph to trigger the exit animation after a delay of 4 seconds
// //     setTimeout(function() {
// //       paragraph.classList.remove("enter");
// //       paragraph.classList.add("exit");
// //     }, 4000);

// //     // Increment the current sentence index, wrapping around to the start of the array if necessary
// //     currentIndex = (currentIndex + 1) % sentences.length;
// //   }, 500);
// // }

// // // Call the showNextSentence() function every 5 seconds
// // setInterval(showNextSentence, 5000);



// // // const mysql = require('mysql');

// // // // Create a connection to the database
// // // const connection = mysql.createConnection({
// // //   host: 'localhost',
// // //   user: 'myuser',
// // //   password: 'mypassword',
// // //   database: 'qlikproject'
// // // });

// // // // Connect to the database
// // // connection.connect(function(error) {
// // //   if (error) {
// // //     console.error('Error connecting to the database: ' + error.stack);
// // //     return;
// // //   }

// // //   console.log('Connected to the database.');
// // // });

// // // // Execute a query
// // // connection.query('SELECT * FROM partners', function(error, results, fields) {
// // //   if (error) {
// // //     console.error('Error executing the query: ' + error.stack);
// // //     return;
// // //   }

// // //   console.log('Query results:', results);
// // // });

// // // // Close the connection
// // // connection.end(function(error) {
// // //   if (error) {
// // //     console.error('Error closing the connection: ' + error.stack);
// // //     return;
// // //   }

// // //   console.log('Connection closed.');
// // // });
