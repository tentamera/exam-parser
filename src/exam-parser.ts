import { stringify } from 'query-string';
import { parse } from './parseResults';

const createUrl = (path: string, search?: string) => {
  const url = new URL(window.location.href);
  url.search = search ?? '';
  url.pathname = path;
  return url.href;
};

const getExamId = () => {
  const url = new URL(window.location.href);

  const searchParamId = url.searchParams.get('id');

  if (searchParamId !== null) {
    return searchParamId;
  }

  const match = /\/exam\/results\/(\d+)/.exec(url.pathname);

  if (!match) {
    alert('Exam not found. Go to Ortrac, select a quiz, click "Start Quiz" and then "Finish Quiz"');
    throw new Error('Could not find exam id');
  }

  return match[1];
};

const getQuestions = async (examId: string, questions: string[]) => {
  const body = stringify({
    examId,
    numbers: questions,
    ts: Date.now(),
  }, {
    arrayFormat: 'bracket',
  });

  const res = await fetch(createUrl('/exam/getQuestions'), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body,
    method: 'POST',
    mode: 'cors',
  });

  const json = await res.json() as {
    questions: Array<{
      bookmarked: boolean;
      data: {
        attachments: Array<{
          caption: string;
          fileId: string;
          filename: string;
        }>;
        body: string;
        options: string[];
      };
      number: number;
      type: number;
    }>;
  };

  return json;
};

const startExam = async (examId: string) => {
  const body = stringify({
    examId,
    ts: Date.now(),
  });

  await fetch(createUrl('/exam/StartQuiz'), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body,
    method: 'POST',
    mode: 'cors',
  });
};

const start = async () => {
  const examId = getExamId();
  const { questions: resultQuestions, courseName, quizName } = parse(document.body.outerHTML);
  const questionIds = new Array(resultQuestions.length).fill(0).map((_, i) => `${i + 1}`);

  await startExam(examId);
  const quizData = await getQuestions(examId, questionIds);

  const questions = resultQuestions.map((resultQuestion, i) => {
    const quizQuestion = quizData.questions[i];

    return {
      text: resultQuestion.text,
      alternatives: resultQuestion.alternatives,
      explanation: resultQuestion.explanation,

      ...(quizQuestion && {
        ...(quizQuestion.data.attachments.length > 0 && {
          images: quizQuestion.data.attachments.map((attachment: { fileId: string }) => ({
            url: `https://ortrac.com/file/getfile/${attachment.fileId}`,
          })),
        }),
        ...(quizQuestion.bookmarked && {
          marked: true,
        }),
      }),
    };
  });

  const exportData = {
    version: '1.0',
    folders: [
      {
        name: courseName,
        collections: [
          {
            name: quizName,
            questions,
          },
        ],
      },
    ],
  };

  prompt('You\'re welcome! Copy the data and import.', JSON.stringify(exportData));
};

start()
  .catch(e => console.error('Exam parse failed:', e));
