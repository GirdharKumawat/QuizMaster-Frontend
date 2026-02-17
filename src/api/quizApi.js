import axiosAPI from "./axios";

export const quizApi = {
  create: (data) => axiosAPI.post("quizzes/", data),
  get: (sessionId) => axiosAPI.get(`quizzes/${sessionId}/`),

  join: (joinCode) => axiosAPI.post(`quizzes/join/${joinCode.toUpperCase()}/`),
  listQuizzes: () => axiosAPI.get("quizzes/"),

  startQuiz: (sessionId) => axiosAPI.post(`quizzes/${sessionId}/start/`),
  endQuiz: (sessionId) => axiosAPI.post(`quizzes/${sessionId}/end/`),
  
  startQuizForParticipant: (sessionId) => axiosAPI.post(`quizzes/${sessionId}/begin/`),
  getQuestions: (sessionId) => axiosAPI.get(`quizzes/${sessionId}/questions/`),
  
  submitAnswer: (sessionId, questionIndex, selectedOption) =>
    axiosAPI.post(`quizzes/${sessionId}/submit/`, {
      question_index: questionIndex,
      selected_option: selectedOption,
    }),
  completeQuiz: (sessionId) => axiosAPI.post(`quizzes/${sessionId}/complete/`),
  
  // Get quiz review after completion
  getReview: (sessionId) => axiosAPI.get(`quizzes/${sessionId}/review/`),
  // AI Question Generator
  generateQuestionsAI: async ({ topic, difficulty, count, focus }) => {
    const res = await axiosAPI.post("quizzes/generate-questions/", {
      topic,
      difficulty,
      count: String(count),
      ...(focus && { focus }),
    });
    return res.data;
  },
}; 
