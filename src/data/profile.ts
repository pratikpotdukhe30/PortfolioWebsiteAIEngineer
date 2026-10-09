// All site content lives here. Edit this file to update the portfolio.
// Leave a link as "" to hide its button.

export const profile = {
  name: "Pratik Potdukhe",
  fullName: "Pratik Rameshwar Potdukhe",
  role: "Software Engineer · AI Engineer",
  location: "Milan, Italy",
  email: "pratikatpolimi@gmail.com",
  github: "https://github.com/pratikpotdukhe30",
  linkedin: "https://www.linkedin.com/in/pratik-potdukhe/",
  cv: "", // e.g. "/Pratik_Potdukhe_CV.pdf" (put the file in /public)
  availability: "Open to software and AI engineering internships",
  tagline: "I build Java backend systems and deployed machine learning applications.",
  summary:
    "Software engineer with industry experience building Java and Spring Boot services for Stellantis' after-sales platform at Capgemini. Currently pursuing an M.Sc. in Computer Science and Engineering at Politecnico di Milano, specialising in machine learning, large language models and retrieval-augmented generation.",
  rotating: ["Java & Spring Boot services", "Deep learning models", "RAG pipelines", "Full-stack web apps"],
};

export const experience = [
  {
    org: "Politecnico di Milano",
    title: "M.Sc. Computer Science and Engineering",
    period: "2024 – present",
    points: [
      "Coursework in machine learning, numerical analysis for ML, data mining and computer security",
      "Applied projects in computer vision, federated learning and LLM applications",
    ],
  },
  {
    org: "Capgemini",
    title: "Software Engineer → Senior Analyst",
    period: "Industry experience",
    points: [
      "Developed REST APIs in Java and Spring Boot for the Stellantis AfterSales platform",
      "Worked with Oracle databases and Jenkins-based CI on a Git workflow",
      "Trained in DevOps practices (Docker, Kubernetes); Microsoft Azure AZ-900 certified",
    ],
  },
];

export type Category = "AI / ML" | "Full-stack" | "Backend";

export type Project = {
  id: string;
  title: string;
  context: string;
  status: "Deployed" | "Completed" | "Production" | "In progress";
  categories: Category[];
  summary: string;
  problem: string;
  approach: string[];
  stack: string[];
  pipeline?: string[];
  repo?: string;
  demo?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "potato",
    title: "Potato Disease Classifier",
    context: "Numerical Analysis for ML · Politecnico di Milano",
    status: "Deployed",
    categories: ["AI / ML", "Full-stack"],
    featured: true,
  summary:
      "An end-to-end computer vision system that diagnoses potato leaf diseases from a photo, served to web and Android clients from the cloud.",
    problem:
      "Leaf diseases need to be identified early, and a model is only useful if it reaches people in the field. The goal was to take a CNN from training all the way to a usable product.",
    approach: [
      "Trained a convolutional neural network in TensorFlow/Keras on labelled leaf images",
      "Served predictions through a FastAPI backend and Google Cloud Functions",
      "Built a React web client and a React Native Android app for on-device photo capture",
      "Resolved Android toolchain issues: Java 8, Gradle 6.9, jcenter deprecation and Flipper removal",
    ],
    stack: ["TensorFlow", "Keras", "FastAPI", "Google Cloud", "React", "React Native"],
    pipeline: ["Leaf photo", "CNN", "FastAPI · GCP", "Web & Android"],
    repo: "",
    demo: "",
  },
  {
    id: "federated",
    title: "Federated Sleep-Quality Prediction",
    context: "Team Nyx · Creativity, Science and Innovation",
    status: "Completed",
    categories: ["AI / ML"],
  summary:
      "Sleep-quality prediction from Garmin wearable data using federated learning, so models train without centralising personal health data.",
    problem:
      "Wearable data is personal and sensitive. The challenge was to learn useful sleep-quality predictions while keeping each user's raw data on their own side.",
    approach: [
      "Prepared and analysed Garmin wearable data",
      "Designed a federated training setup where only model updates are shared",
      "Owned the project end to end, from data to model evaluation",
    ],
    stack: ["Python", "Federated Learning", "Wearable data"],
    repo: "",
  },
  {
    id: "inbox",
    title: "Conversation Inbox",
    context: "Technical assignment · Arcus Corp, Milan",
    status: "Completed",
    categories: ["Full-stack"],
  summary:
      "A full-stack messaging inbox with webhook ingestion, automated replies and live updates.",
    problem:
      "Businesses receive messages through external channels and need one place to read, track and answer them.",
    approach: [
      "Webhook receiver in Express that ingests and persists conversations in SQLite",
      "Rule-based auto-reply logic for incoming messages",
      "React interface with live polling and per-conversation unread counts",
    ],
    stack: ["TypeScript", "Express", "React", "SQLite"],
    repo: "",
  },
  {
    id: "stellantis",
    title: "Stellantis AfterSales Platform",
    context: "Capgemini · Client: Stellantis",
    status: "Production",
    categories: ["Backend"],
  summary:
      "Backend services for the after-sales platform of one of the world's largest automakers.",
    problem:
      "A large enterprise platform serving after-sales operations needs reliable, maintainable services and a disciplined delivery process.",
    approach: [
      "Developed and maintained REST APIs in Java and Spring Boot",
      "Worked against Oracle databases",
      "Delivered through Jenkins CI and Git-based workflows",
    ],
    stack: ["Java", "Spring Boot", "REST APIs", "Oracle", "Jenkins", "Git"],
  },
  {
    id: "ytrag",
    title: "YouTube Video Q&A Assistant",
    context: "Independent project · LLM applications",
    status: "In progress",
    categories: ["AI / ML"],
  summary:
      "A retrieval-augmented chatbot that answers questions about any YouTube video, grounded in its transcript.",
    problem:
      "Long videos are hard to search. Users should be able to ask a question and get an answer backed by what was actually said.",
    approach: [
      "Retrieval-augmented generation pipeline over video transcripts",
      "Built with LangChain",
      "Planned browser plugin using the YouTube API",
    ],
    stack: ["Python", "LangChain", "RAG", "YouTube API"],
    pipeline: ["Transcript", "Chunk & embed", "Retrieve", "LLM answer"],
    repo: "",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Java", "Python", "TypeScript", "SQL"] },
  { group: "Backend", items: ["Spring Boot", "REST APIs", "FastAPI", "Express", "Oracle", "SQLite"] },
  { group: "AI / ML", items: ["TensorFlow", "Keras", "CNNs", "Federated Learning", "LangChain", "RAG"] },
  { group: "Frontend", items: ["React", "React Native", "Angular"] },
  { group: "Cloud & DevOps", items: ["Google Cloud", "Azure (AZ-900)", "Docker", "Kubernetes", "Jenkins", "Git"] },
];
