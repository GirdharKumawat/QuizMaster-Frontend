const demoQuestions = [
  {
    id: 1,
    topic: "Tech",
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language",
    ],
    answer: "HyperText Markup Language",
  },
  {
    id: 2,
    topic: "Science",
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    id: 3,
    topic: "Tech",
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Processing Unit",
      "Central Performance Unit",
      "Control Processing Unit",
    ],
    answer: "Central Processing Unit",
  },
  {
    id: 4,
    topic: "Geography",
    question: "Which ocean is the largest on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: "Pacific",
  },
  {
    id: 5,
    topic: "Geography",
    question: "What is the capital of Japan?",
    options: ["Kyoto", "Tokyo", "Osaka", "Nagoya"],
    answer: "Tokyo",
  },
  {
    id: 6,
    topic: "Science",
    question: "What gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    answer: "Carbon Dioxide",
  },
  {
    id: 7,
    topic: "Tech",
    question: "Which language runs in the browser?",
    options: ["Python", "Java", "C++", "JavaScript"],
    answer: "JavaScript",
  },
  {
    id: 8,
    topic: "GK",
    question: "Which number is a prime number?",
    options: ["9", "12", "17", "21"],
    answer: "17",
  },
  {
    id: 9,
    topic: "GK",
    question: "Which day comes after Friday?",
    options: ["Thursday", "Saturday", "Sunday", "Monday"],
    answer: "Saturday",
  },
  {
    id: 10,
    topic: "Science",
    question: "Water boils at what temperature (C)?",
    options: ["50", "75", "100", "120"],
    answer: "100",
  },
];

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const getDemoTopics = () => {
  const topics = new Set(demoQuestions.map((q) => q.topic));
  return ["All", ...Array.from(topics)];
};

export const getDemoTopicCount = (topic) => {
  if (!topic || topic === "All") return demoQuestions.length;
  return demoQuestions.filter((q) => q.topic === topic).length;
};

export const getRandomDemoQuestions = (topic, count = 5) => {
  const pool =
    !topic || topic === "All"
      ? demoQuestions
      : demoQuestions.filter((q) => q.topic === topic);
  return shuffle(pool).slice(0, count);
};

export default demoQuestions;
