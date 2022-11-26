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

  const id = url.searchParams.get('id');

  if (id === null) {
    throw new Error('Could not find exam id');
  }

  return id;
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

  const json = await res.json();

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
  const res = parse(document.body.outerHTML);
  const questionIds = new Array(res.length).fill(0).map((_, i) => `${i + 1}`);

  await startExam(examId);
  const questions = await getQuestions(examId, questionIds);

  const data = { res, questions };

  // eslint-disable-next-line no-alert
  prompt('Here you go :)', JSON.stringify(data));
};

start()
  .catch(e => console.error('Exam parse failed:', e));
