// All site content lives here. Edit this file to update the site.
// Leave a link as "" to hide it.

export const profile = {
  name: "Pratik Potdukhe",
  fullName: "Pratik Rameshwar Potdukhe",
  email: "pratikatpolimi@gmail.com",
  github: "https://github.com/pratikpotdukhe30",
  linkedin: "https://www.linkedin.com/in/pratik-potdukhe/",
  cv: "", // e.g. "/Pratik_Potdukhe_CV.pdf" (put the file in /public)
  photo: "", // e.g. "/pratik.jpg" (put the file in /public)
  updated: "October 2026",
};

export const experience = [
  {
    where: "Politecnico di Milano",
    what: "M.Sc. Computer Science and Engineering",
    when: "2024 –",
    note: "Machine learning, numerical analysis for ML, data mining, computer security.",
  },
  {
    where: "Capgemini",
    what: "Software Engineer, then Senior Analyst",
    when: "Before 2024",
    note: "Java and Spring Boot services for the Stellantis AfterSales platform.",
  },
];

export type Project = {
  id: string;
  title: string;
  where: string;
  line: string;
  stack: string;
  repo?: string;
  demo?: string;
  body: string[];
};

export const projects: Project[] = [
  {
    id: "potato-disease",
    title: "Potato disease classifier",
    where: "Course project, Numerical Analysis for Machine Learning",
    line: "A CNN that diagnoses potato leaf disease from a photo, with a web app and an Android app on top.",
    stack: "TensorFlow, Keras, FastAPI, Google Cloud Functions, React, React Native",
    repo: "",
    body: [
      "The course asked for a machine learning model. I took mine further than a notebook and built it into something you can use from a browser or an Android phone.",
      "The model is a convolutional neural network trained in TensorFlow and Keras on labelled images of potato leaves. It takes a photo of a leaf and predicts which disease, if any, the plant has.",
      "The model is served through a FastAPI backend and deployed on Google Cloud Functions. Two clients call it: a React web app and a React Native Android app.",
      "Getting the Android app to build was its own problem. jcenter had been deprecated and Flipper was breaking the build, so I set the project up on Java 8 and Gradle 6.9, dealt with the jcenter dependencies and removed Flipper before it would compile.",
    ],
  },
  {
    id: "federated-sleep",
    title: "Federated sleep-quality prediction",
    where: "Team Nyx, Creativity, Science and Innovation course",
    line: "Predicting sleep quality from Garmin data without collecting anyone's raw data in one place.",
    stack: "Python, federated learning, Garmin wearable data",
    repo: "",
    body: [
      "Sleep data from a wearable is about as personal as data gets, so the project used an approach that never collects it in one place.",
      "We used federated learning. Each participant's data stays on their side, a model is trained locally, and only the model updates are combined into a shared model.",
      "I worked on the project from start to finish: preparing the Garmin data, setting up the federated training, and evaluating the resulting model.",
    ],
  },
  {
    id: "conversation-inbox",
    title: "Conversation inbox",
    where: "Take-home assignment for Arcus Corp, Milan",
    line: "A small full-stack app that receives messages through a webhook and lets you read and answer them.",
    stack: "TypeScript, Express, React, SQLite",
    repo: "",
    body: [
      "This was a take-home assignment. The brief was an inbox for messages arriving from an external channel.",
      "An Express server exposes a webhook endpoint. Incoming messages are stored in SQLite and grouped into conversations. Simple rules send an automatic reply to new messages.",
      "The React front end polls the server for updates, so new messages appear without a refresh, and each conversation shows how many messages are unread.",
    ],
  },
  {
    id: "stellantis-aftersales",
    title: "Stellantis AfterSales platform",
    where: "Capgemini, client work",
    line: "Backend services for the after-sales platform of a global carmaker.",
    stack: "Java, Spring Boot, REST APIs, Oracle, Jenkins, Git",
    body: [
      "At Capgemini I worked on the AfterSales platform that Stellantis uses for its after-sales operations. I joined as a Software Engineer and later moved to Senior Analyst.",
      "My work was on the backend: REST APIs in Java and Spring Boot on top of Oracle databases, built and delivered through Jenkins with a Git workflow.",
      "This is client work, so there is no code or screenshot to share.",
    ],
  },
];

export const now =
  "I'm currently learning how retrieval-augmented generation works by building a chatbot that answers questions about any YouTube video from its transcript.";

export const skills = [
  ["Languages", "Java, Python, TypeScript, SQL"],
  ["Backend", "Spring Boot, FastAPI, Express, REST, Oracle, SQLite"],
  ["Machine learning", "TensorFlow, Keras, CNNs, federated learning, LangChain"],
  ["Front end", "React, React Native, Angular"],
  ["Infrastructure", "Google Cloud, Azure (AZ-900), Docker, Kubernetes, Jenkins"],
];
