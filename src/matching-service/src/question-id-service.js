import axios from "axios";

const questionServiceBasePath = "http://localhost:3000/api";

export default async function getQuestionId(complexity) {
  try {
    const res = await axios.get(
      `${questionServiceBasePath}/questions/random?complexity=${complexity}`
    );
    return res.data.questionId;
  } catch (error) {
    console.log("Error getting questionId:", error.message);
    return null;
  }
}
