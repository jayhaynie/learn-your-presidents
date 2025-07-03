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

 //use the get in server to place correct and incorrect answers into the page
    const columnMap = {
      name: 'name',
      number: 'pres_number',
      years: 'pres_years',
      life: 'life'
    };
    const column = columnMap[randomMissing];

    // If we have a valid column, fetch 3 random options that aren't the correct answer
    if (column) {
      let column = columnMap[randomMissing];
      if (randomMissing === 'life') {
        column = 'life';
      };
      fetch(`http://localhost:3000/api/presidents-options/${column}/${encodeURIComponent(missingCorrect)}`)
        .then(response => response.json())
        .then(options => {
          let distractors = options;

          // Format distractors based on the type of missing info
          if (randomMissing === 'number') {
            distractors = distractors.map(num => `The ${num} President`);
          }
          if (randomMissing === 'life') {
            distractors = distractors.map(birthOrDeath => {
              // You may need to fetch both birth and death for distractors to do this right
              // This is a placeholder; adjust as needed for your data structure
              if (birthOrDeath.death === 'N/A') {
                return `Born in ${birthOrDeath.birth} - And still alive`;
              } else {
                return `Born in ${birthOrDeath.birth} - Died in ${birthOrDeath.death}`;
              }
            });
          }
          if (randomMissing === 'years') {
            distractors = distractors.map(years => `President from ${years}`);
          }
          if (randomMissing === 'terms') {
            distractors = distractors.map(terms => `Terms Served: ${terms}`);
          }

          // Pick 3 random options
          distractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);

          // Combine with the correct answer and shuffle
          const answerOptions = [missingCorrect, ...distractors].sort(() => 0.5 - Math.random());
          console.log('Answer options:', answerOptions);
          
          //show answer options in the HTML
          document.getElementById('option1').textContent = answerOptions[0];
          document.getElementById('option2').textContent = answerOptions[1];
          document.getElementById('option3').textContent = answerOptions[2];
          document.getElementById('option4').textContent = answerOptions[3];

          //clickable answers/right wrong logic
          document.getElementById('option1').addEventListener('click', function() {
            if (this.textContent === missingCorrect) {
              document.getElementById('option1').style.color = 'green';
            } else {
              document.getElementById('option1').style.color = 'red';
            };
          })
          document.getElementById('option2').addEventListener('click', function() {
            if (this.textContent === missingCorrect) {
              document.getElementById('option2').style.color = 'green';
            } else {
              document.getElementById('option2').style.color = 'red';
            };
          })
          document.getElementById('option3').addEventListener('click', function() {
            if (this.textContent === missingCorrect) {
              document.getElementById('option3').style.color = 'green';
            } else {
              document.getElementById('option3').style.color = 'red';
            };
          })
          document.getElementById('option4').addEventListener('click', function() {
            if (this.textContent === missingCorrect) {
              document.getElementById('option4').style.color = 'green';
            } else {
              document.getElementById('option4').style.color = 'red';
            };
          })

        })
    }

  })
  .catch(err => {
    console.error('Error: ', err);
    alert('Could not fetch random president!');
  });

// Next (page refresh) button
document.getElementById('refresh').addEventListener('click', function() {
  window.location.reload();
});