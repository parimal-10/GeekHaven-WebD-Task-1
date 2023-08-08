// Locally save the data - Dead code

// let boxes = document.getElementsByClassName('box').length;


// function save() {
//   updateBoxes();
//   for (let i = 1; i <= boxes; i++) {
//     var checkbox = document.getElementById(String(i));
//     localStorage.setItem("checkbox" + String(i), checkbox.checked);
//   }
// }

// for (let i = 1; i <= boxes; i++) {
//   if (localStorage.length > 0) {
//     var checked = JSON.parse(localStorage.getItem("checkbox" + String(i)));
//     document.getElementById(String(i)).checked = checked;
//   }
// }
// window.addEventListener('beforeunload', save);

//Dead code ends here






//Navigate Questions
let currentQuestionIndex = 0;

function navigateQuestion(direction) {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  if (direction === -1) {
    currentQuestionIndex = (currentQuestionIndex - 1 + checkboxes.length) % checkboxes.length;
  } else if (direction === 1) {
    currentQuestionIndex = (currentQuestionIndex + 1) % checkboxes.length;
  }

  checkboxes[currentQuestionIndex].focus(); // Set focus to the current checkbox
}




//For Progress Bar
let answeredQuestionsCount = 0;
let totalQuestions = 0;

function countTotalCheckboxes() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  totalQuestions = checkboxes.length;
  console.log(checkboxes);
}

function updateProgressPercentage() {
  const completionRate = (answeredQuestionsCount / totalQuestions) * 100;
  const progressPercentage = document.getElementById('progressPercentage');
  progressPercentage.innerText = completionRate.toFixed(2) + '%';
}

function updateProgressBar() {
  const completionRate = (answeredQuestionsCount / totalQuestions) * 100;
  const progressBar = document.getElementById('progressBar');
  progressBar.style.width = completionRate + '%';
  updateProgressPercentage();
}

function handleCheckboxChange() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  answeredQuestionsCount = 0;
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      answeredQuestionsCount++;
    }

    if (checkbox === document.activeElement) {
      currentQuestionIndex = index; // Update the current question index
    }

  });

  updateProgressBar();
  saveMarkedQuestions();
}




//Toggle Button
function toggleAccordion(header) {
  const content = header.nextElementSibling;
  header.classList.toggle('active');

  if (content.style.display === 'block') {
    content.style.display = 'none';
  } else {
    content.style.display = 'block';
  }
}




//Search Feature
function searchQuestions() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((header) => {
    const title = header.querySelector('h2').innerText.toLowerCase();
    const content = header.nextElementSibling;
    const chapterTitles = content.querySelectorAll('.chapter h3');

    let foundMatch = false;

    // Check if the title matches the search input
    if (title.includes(searchInput)) {
      header.style.display = 'block';
      foundMatch = true;
    } else {
      header.style.display = 'none';
    }

    // Check if any chapter titles within the content match the search input
    chapterTitles.forEach((chapterTitle) => {
      const chapterText = chapterTitle.innerText.toLowerCase();
      if (chapterText.includes(searchInput)) {
        content.style.display = 'block';
        foundMatch = true;
      } else if (!foundMatch) {
        content.style.display = 'none';
      }
    });
  });
}






//Bookmark Feature








//Create Accordian Heading
function createAccordionHeader(title) {
  const accordionHeader = document.createElement('div');
  accordionHeader.className = 'accordion-header';
  accordionHeader.innerHTML = `<h2>${title}</h2>`;
  accordionHeader.addEventListener('click', function () {
    toggleAccordion(this);
  });

  return accordionHeader;
}


//Create Accordian Content
function createAccordionContent(content) {
  const accordionContent = document.createElement('div');
  accordionContent.className = 'accordion-content';

  content.forEach((item) => {
    const chapterTitle = item.title;
    const chapter = document.createElement('div');
    chapter.className = 'chapter';
    chapter.innerHTML = `<h3>${chapterTitle}</h3>`;
    chapter.addEventListener('click', function () {
      toggleAccordion(this);
    });
    accordionContent.appendChild(chapter);

    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';

    const ytlink = item.yt_link;
    if (ytlink) {
      const ytLinkElement = document.createElement('p');
      ytLinkElement.innerHTML += `<a href="${ytlink}" target="_blank">Youtube Link</a>`;
      questionContainer.appendChild(ytLinkElement);
    };

    for (let i = 1; item[`p${i}_link`]; i++) {
      const link = item[`p${i}_link`];
      if (link) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'box';
        checkbox.id = `${i}`;
        checkbox.addEventListener('change', handleCheckboxChange);

        const linkElement = document.createElement('p');
        linkElement.appendChild(checkbox);
        linkElement.innerHTML += `<a href="${link}" target="_blank">Problem Link ${i}</a>`;

        questionContainer.appendChild(linkElement);
      }
    }

    accordionContent.appendChild(questionContainer);
  });

  return accordionContent;
}






async function fetchTitles() {
  try {
    const response = await fetch('https://test-data-gules.vercel.app/data.json');
    const data = await response.json();
    // console.warn(data); 

    const accordion = document.getElementById('accordion');

    data.data.forEach((item) => {
      const title = item.title;
      const accordionHeader = createAccordionHeader(title);
      const accordionContent = createAccordionContent(item.ques);

      accordion.appendChild(accordionHeader);
      accordion.appendChild(accordionContent);
    });


    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', handleCheckboxChange);
    });

    countTotalCheckboxes();

    setTimeout(updateProgressBar, 500);

    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp':
          navigateQuestion(-1); // Move to the previous question
          break;
        case 'ArrowDown':
          navigateQuestion(1); // Move to the next question
          break;
      }
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}




//Dark-mode
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
}
document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);




fetchTitles();



//Search Feature
document.getElementById('searchInput').addEventListener('input', searchQuestions);
document.getElementById('searchButton').addEventListener('click', searchQuestions);


