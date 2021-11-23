// get all question
const getAllQuestions = async () => {
  try {
    const response = await fetch("./data/q.json");
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
// generate random Number
const generateRandomIndece = (data) => Math.floor(Math.random() * data.length);
// store the responses in array of indeces
const selectQuestionsRandomly = async (numQst) => {
  let selecetdQuestions = [];
  const data = await getAllQuestions();
  let randomIndeces = undefined,
    i = 0;
  do {
    randomIndeces = generateRandomIndece(data);
    if (
      selecetdQuestions.filter((item) => item.id === data[randomIndeces].id)
        .length === 0
    ) {
      selecetdQuestions.push(data[randomIndeces]);
      i++;
    }
  } while (i < numQst);
  return selecetdQuestions;
};
const onStart = async () => {
  const questions = await selectQuestionsRandomly(4);
  console.log(questions);
};
onStart();
// dom
const buttonStart=document.querySelector("#start");
buttonStart.addEventListener("click",onStart)
