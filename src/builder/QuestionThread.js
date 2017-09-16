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
    this.current.captureOptions = { key };
  }

  action(response) {
    this.current.responses.push(response);
  }
}

module.exports = QuestionThread;