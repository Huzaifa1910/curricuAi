function getSubjects(e) {
    const boardValue = e.childNodes[3].childNodes[1].childNodes[1].textContent;
    const grade_name = e.childNodes[3].childNodes[3].childNodes[1].textContent;
    console.log(grade_name.length)
    let cleanedSentence = boardValue.trim().replace(/\s+/g, ' ');

    fetch('/getSubjects', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ board: cleanedSentence,grade_name:grade_name}),
    })
    .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Failed to fetch');
        }
      })
    .then(data => {
      if (data.error) {
        console.error('Error:', data.error);
      } else {
        window.location.href = '/subjects';
        // Use data.subjects as needed
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
