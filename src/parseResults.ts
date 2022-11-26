export const parse = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const pageHeader = doc.querySelector('h1.page-header');
  const courseName = pageHeader?.firstChild?.textContent?.trim();
  const quizName = pageHeader?.lastChild?.textContent?.trim();

  const questionDivs = doc.querySelectorAll('[id^="question-"]');
  const questionsData = Array.from(questionDivs).map(questionDiv => {
    const containerDiv = questionDiv.children[1];
    const questionTextDiv = containerDiv.children[0];

    const questionText = questionTextDiv.innerHTML.trim();
    const alternativesDiv = containerDiv.children[1];
    const alternatives = Array.from(alternativesDiv.children)
      .slice(1) // Skip first child which is icons
      .map(alternativeDiv => {
        const alternativeTextDiv
              = alternativeDiv.querySelector('.mce-input');
        const alternativeText = alternativeTextDiv?.innerHTML.trim();
        const answerDiv = alternativeDiv.children[1];
        const isCorrect
              = answerDiv.children[0].classList.contains('fa-check');
        return {
          text: alternativeText,
          correct: isCorrect,
        };
      });

    return {
      text: questionText,
      alternatives,
    };
  });

  return { questions: questionsData, courseName, quizName };
};
