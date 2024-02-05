const spinner = document.querySelector("#spinner");
function goToStandards(e) {
  console.log(e.childNodes[1].childNodes[1].childNodes[0].textContent);
  fetch('/routToStandards', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ board: e.childNodes[1].childNodes[1].childNodes[0].textContent}),
  })
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Failed to fetch');
    }
  })
  .then(data => {
    console.log('Response from server:', data);
    // If you want to navigate to the new page
    window.location.href = '/standards';
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

fetch('/getBoards')
    .then(response => response.json())
    .then(data => {
      spinner.classList.add("spim")
      let listed_boards_list = []
      // Log the array in the console
      console.log('Listed Boards:', data);
      // Sample array of board names
      for(i=0;i<data.length;i++){
        listed_boards_list.push(data[i].board_name)
      }
const boardNames = data
// Get the container element
const container = document.getElementById("boardsList");
var s = 0
// Loop through the array of board names

for(let i = 0; i<boardNames.length/2; i++){
  // Create card elements
  const alldivCard = document.createElement("div");
  alldivCard.classList.add("alldivs");
  for(let j = 0; j<2; j++){
    if(s == boardNames.length){
      break
    }
  const card = document.createElement("div");
  card.classList.add("card1");
  if(data[s].isLocked == true){
  card.classList.add("isLocked");
  }
  card.setAttribute("onclick", "goToStandards(this)")

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
  paragraph.textContent = data[s].board_name;
  
  alldivCard.appendChild(card);
  card.appendChild(imgCard);
  card.appendChild(opts2);
  opts2.appendChild(head);
  opts2.appendChild(times);
  times.appendChild(paragraph);
  s++
  }
  // Append elements to their respective parents
  container.appendChild(alldivCard);
}

// Check if only one card is left, create a single card for it
if (boardNames.length === 1) {
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
  paragraph.textContent = boardNames[0];

  // Append elements to the remaining card
  container.appendChild(remainingCard);
  remainingCard.appendChild(imgCard);
  remainingCard.appendChild(opts2);
  opts2.appendChild(head);
  opts2.appendChild(times);
  times.appendChild(paragraph);
}
      // You can perform further actions with the data here
    })
    .catch(error => console.error('Error fetching boards:', error));

// var dataa = [
//     {
//       title: "Work",
//       timeframes: {
//         daily: {
//           current: 5,
//           previous: 7
//         },
//         weekly: {
//           current: 32,
//           previous: 36
//         },
//         monthly: {
//           current: 103,
//           previous: 128
//         }
//       }
//     },
//     {
//       title: "Exercise",
//       timeframes: {
//         daily: {
//           current: 1,
//           previous: 1
//         },
//         weekly: {
//           current: 4,
//           previous: 5
//         },
//         monthly: {
//           current: 11,
//           previous: 18
//         }
//       }
//     },
//     {
//       title: "Play",
//       timeframes: {
//         daily: {
//           current: 1,
//           previous: 2
//         },
//         weekly: {
//           current: 10,
//           previous: 8
//         },
//         monthly: {
//           current: 23,
//           previous: 29
//         }
//       }
//     },{
//         title: "Social",
//         timeframes: {
//           daily: {
//             current: 1,
//             previous: 3
//           },
//           weekly: {
//             current: 5,
//             previous: 10
//           },
//           monthly: {
//             current: 21,
//             previous: 23
//           }
//         }
//       },
//     {
//       title: "Study",
//       timeframes: {
//         daily: {
//           current: 0,
//           previous: 1
//         },
//         weekly: {
//           current: 4,
//           previous: 7
//         },
//         monthly: {
//           current: 13,
//           previous: 19
//         }
//       }
//     },
    
//     {
//       title: "Self Care",
//       timeframes: {
//         daily: {
//           current: 0,
//           previous: 1
//         },
//         weekly: {
//           current: 2,
//           previous: 2
//         },
//         monthly: {
//           current: 7,
//           previous: 11
//         }
//       }
//     }
//   ]
// for(i=0;i<dataa.length;i++){




//     // console.log(dataa[i].title)
//     // console.log(dataa[i].timeframes.daily.current)
//     // console.log(dataa[i].timeframes.daily.previous)
//     // console.log(dataa[i].timeframes.weekly.current)
//     // console.log(dataa[i].timeframes.weekly.previous)
//     // console.log(dataa[i].timeframes.monthly.current)
//     // console.log(dataa[i].timeframes.monthly.previous)
// }

// var dailybtn = document.querySelector("#daily")
// dailybtn.addEventListener("click",days)
// var weeklybtn = document.querySelector("#weekly")
// weeklybtn.addEventListener("click",weekly)
// var monthlybtn = document.querySelector("#monthly")
// monthlybtn.addEventListener("click",monthly)

// function days(){
//     dailybtn.classList.add("active")
//     monthlybtn.classList.remove("active")
//     weeklybtn.classList.remove("active")

//     for(i=0;i<dataa.length;i++){
//         var current = document.getElementsByClassName("current")[i]
//         var prev = document.getElementsByClassName("prev")[i]
//         var dates = document.getElementsByClassName("dates")[i]

//         current.innerHTML = dataa[i].timeframes.daily.current+"hrs"
//         dates.innerHTML = "day"
//         prev.innerHTML = dataa[i].timeframes.daily.previous+"hrs"
        
//     }
// }
// function weekly(){
//     dailybtn.classList.remove("active")
//     monthlybtn.classList.remove("active")
//     weeklybtn.classList.add("active")

//     for(i=0;i<dataa.length;i++){
//         var current = document.getElementsByClassName("current")[i]
//         var prev = document.getElementsByClassName("prev")[i]
//         var dates = document.getElementsByClassName("dates")[i]

//         current.innerHTML = dataa[i].timeframes.weekly.current+"hrs"
//         dates.innerHTML = "week"
//         prev.innerHTML = dataa[i].timeframes.weekly.previous+"hrs"
        
//     }
// }
// function monthly(){
//     weeklybtn.classList.remove("active")
//     dailybtn.classList.remove("active")
//     monthlybtn.classList.add("active")

//     for(i=0;i<dataa.length;i++){
//         var current = document.getElementsByClassName("current")[i]
//         var prev = document.getElementsByClassName("prev")[i]
//         var dates = document.getElementsByClassName("dates")[i]

//         current.innerHTML = dataa[i].timeframes.monthly.current+"hrs"
//         dates.innerHTML = "month"
//         prev.innerHTML = dataa[i].timeframes.monthly.previous+"hrs"
        
//     }
// }
// // monthly()
// // days()