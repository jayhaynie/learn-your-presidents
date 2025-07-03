 let missingCorrect = '';

    // Now fetch details for the selected president
  fetch('http://localhost:3000/api/presidents-random')
    .then(response => response.json())
    .then(data => {
    // Fill in the HTML elements with the president's info
    document.getElementById('name').textContent = data.name || '';
    document.getElementById('number').textContent = data.pres_number ? `The ${data.pres_number} President` : '';
    if (data.death === 'N/A') {
      document.getElementById('life').textContent = data.birth && data.death ? `Born in ${data.birth} - And still alive` : '';
    } else {
      document.getElementById('life').textContent = data.birth && data.death ? `Born in ${data.birth} - Died in ${data.death}` : '';
    };
    document.getElementById('years').textContent = data.pres_years ? `President from ${data.pres_years}` : '';
    document.getElementById('terms').textContent = data.terms_number ? `Terms Served: ${data.terms_number}` : '';
    document.getElementById('other1').textContent = data.other1 || '';
    document.getElementById('other2').textContent = data.other2 || '';
    document.getElementById('other3').textContent = data.other3 || '';
    // Update image if you have images named by number or name
    if (data.pres_number) {
      document.getElementById('picture').src = `images/${data.pres_number}.png`;
    }
    const missingOptionsArray = ['name', 'number', 'life', 'years'];
    const randomIndex = Math.floor(Math.random() * missingOptionsArray.length);
    const randomMissing = missingOptionsArray[randomIndex];
    console.log(randomMissing);
    document.getElementById(`${randomMissing}`).textContent = '?';
    
    //saves the correct answer to reference later
    if (randomMissing === 'name') {
      missingCorrect = data.name;
    };
    if (randomMissing === 'number') {
      missingCorrect = `The ${data.pres_number} President`;
    };
    if (randomMissing === 'life') {
      if (data.death === 'N/A') {
        missingCorrect = `Born in ${data.birth} - And still alive`;
      } else {
        missingCorrect = `Born in ${data.birth} - Died in ${data.death}`;
      };
    };
    if (randomMissing === 'years') {
      missingCorrect = `President from ${data.pres_years}`;
    };
    if (randomMissing === 'terms') {
      missingCorrect = `Terms Served: ${data.terms_number}`;
    };

    console.log(missingCorrect);

  })
  .catch(err => {
    console.error('Error: ', err);
    alert('Could not fetch random president!');
  });

 let answerOptions = ['option1, option2, option3, option4'];

 //use the get in server to place correct and incorrect answers into the page

 //make the answers clickable and right/wrong logic and "next" button