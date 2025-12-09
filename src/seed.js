// Example backend-like seed data for Home page and Waiting Room UI
// This module exports a sample room object and helpers that mimic
// what the frontend would receive from the backend. Use in development
// or Storybook-style UI previews.

const sampleRoom = {
  _id: "68c3e26a05ad4ad0307a72b0",
  quiz_id: "68c3e26a05ad4ad0307a72af",
  host_id: "68bbdaed474da34a611bfd2a",
  status: "waiting",
  participants: [
    {
      user_id: "68c3e16205ad4ad0307a7287",
      username: "user0",
      score: 0,
      currentQuestionIndex: -1,
      answers: [],
      joinedAt: new Date("2025-09-12T09:05:52.052Z"),
    },
    {
      user_id: "68c3e16305ad4ad0307a7288",
      username: "user1",
      score: 0,
      currentQuestionIndex: -1,
      answers: [],
      joinedAt: new Date("2025-09-12T09:05:53.052Z"),
    },
    {
      user_id: "68c3e16405ad4ad0307a7289",
      username: "user2",
      score: 0,
      currentQuestionIndex: -1,
      answers: [],
      joinedAt: new Date("2025-09-12T09:05:54.052Z"),
    },
    {
      user_id: "68c3e16505ad4ad0307a7290",
      username: "user3",
      score: 0,
      currentQuestionIndex: -1,
      answers: [],
      joinedAt: new Date("2025-09-12T09:05:55.052Z"),
    },
    {
      user_id: "68c3e16605ad4ad0307a7291",
      username: "user4",
      score: 0,
      currentQuestionIndex: -1,
      answers: [],
      joinedAt: new Date("2025-09-12T09:05:56.052Z"),
    },
  ],
  created_at: new Date("2025-09-12T09:05:46.620Z"),
  quizze: {
    _id: "68c3e26a05ad4ad0307a72af",
    title: "Python Basics Quiz",
    description: "A quiz to test your fundamental Python knowledge.",
    topic: "Programming",
    difficulty: "Easy",
    max_participants: 5,
    pointsPerCorrect: 4,
    duration: 60,
    start_time: new Date("2025-09-01T18:00:00.000Z"),
    questions: [
      {
        _id: "q1",
        text: "What is the output of print(2 + 3)?",
        options: ["23", "5", "Error", "None"],
        correctIndex: 1,
      },
      {
        _id: "q2",
        text: "Which keyword is used to create a function in Python?",
        options: ["func", "def", "function", "lambda"],
        correctIndex: 1,
      },
    ],
    created_by: "68bbdaed474da34a611bfd2a",
    created_at: new Date("2025-09-12T09:05:46.587Z"),
  },
};

// Return an array of rooms as the home page might display (list of active rooms)
function getHomeRooms() {
  // In a real app this would be a fetch to the backend; here we return
  // a lightweight array containing the sample room. Consumers can map
  // fields like _id, quizze.title, participants.length, status, etc.
  return [
    {
      _id: sampleRoom._id,
      quizTitle: sampleRoom.quizze.title,
      topic: sampleRoom.quizze.topic,
      difficulty: sampleRoom.quizze.difficulty,
      participantsCount: sampleRoom.participants.length,
      maxParticipants: sampleRoom.quizze.max_participants,
      status: sampleRoom.status,
      host_id: sampleRoom.host_id,
      created_at: sampleRoom.created_at,
    },
  ];
}

// Find a room by its id (used for WaitingRoom page)
function getRoomById(id) {
  if (id === sampleRoom._id || id === sampleRoom.quiz_id) return sampleRoom;
  return null;
}

module.exports = { sampleRoom, getHomeRooms, getRoomById };
