import axiosAPI from "./axios";

export const quizApi = {
    // --- LOBBY & MANAGEMENT ---
    // URL: api/quizzes/create/
    create: (data) => axiosAPI.post("quizzes/create/", data),
    
    // URL: api/quizzes/join/
    join: (data) => axiosAPI.post("quizzes/join/", data),
    
    // URL: api/quizzes/dashboard/
    getDashboard: () => axiosAPI.get("quizzes/dashboard/"),
    
    // URL: api/quizzes/enrolled/
    getEnrolled: () => axiosAPI.get("quizzes/enrolled/"),

    // --- GAMEPLAY (Host) ---
    // URL: api/quizzes/start/
    startQuiz: (sessionId) => axiosAPI.post("quizzes/start/", { session_id: sessionId }),
    
    // URL: api/quizzes/end/
    endQuiz: (sessionId) => axiosAPI.post("quizzes/end/", { session_id: sessionId }),
    
    // URL: api/quizzes/leaderboard/<id>/
    getLeaderboard: (sessionId) => axiosAPI.get(`quizzes/leaderboard/${sessionId}/`),

    // --- GAMEPLAY (Student) ---
    // URL: api/quizzes/paper/<id>/
    getPaper: (sessionId) => axiosAPI.get(`quizzes/paper/${sessionId}/`),
    
    // URL: api/quizzes/submit/
    submitAnswer: (data) => axiosAPI.post("quizzes/submit/", data),
    
    // URL: api/quizzes/status/<id>/
    getStatus: (sessionId) => axiosAPI.get(`quizzes/status/${sessionId}/`),

    // URL: api/quizzes/complete/
    completeQuiz: (sessionId) => axiosAPI.post("quizzes/complete/", { session_id: sessionId }),
};