class QuestionThread {
  constructor() {
    this.questions = [];
    this.current = null;
  }

  question(question, captureOptions) {
    this.current = {
      question: question,
      captureOptions: captureOptions,
      responses: []
    };
    this.questions.push(this.current);
  }

  into(key) {
    this.current.captureOptions = {key};
  }

  action(r) {
    this.current.responses.push(r);
  }
}

module.exports = QuestionThread;