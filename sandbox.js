const buttonStart = document.querySelector("#start");
const Traitement = document.querySelector("#trait");
const buttons = document.querySelector("#buttons");
const leaderboard = document.querySelector("#lead");
const form = document.querySelector("#form-name");
const result = document.querySelector("#result");
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
  // score
  buttonStart.removeEventListener("click", onStart);
  const qstsContainer = document.querySelector(".qsts-container");
  let rsps_user = [];
  const score = document.querySelector(".score");
  const questions = await selectQuestionsRandomly(4);
  //   toggle when click start
  buttons.style.display = "none";
  Traitement.style.display = "block";
  score.innerText = 0;
  //   show first element
  questions.forEach((item, index) => {
    let responses = ``;
    item.response.forEach((item, index) => {
      responses += ` <li class="">
          <div class="circle">
            <div class="selected"></div>
          </div>
          <div class="res">${item.value}</div>
        </li>`;
    });
    qstsContainer.innerHTML += `
    <div class="qa ${index === 0 ? "active" : ""}"
     data-id="${item.id}">
      <h2>${item.question} </h2>
      <ul>
      ${responses}
      </ul>
      </div>
      `;
    const res = document.querySelectorAll(".res");
    // console.log(res);
    let scoreTotal = 0;

    res.forEach((item, index) => {
      item.onclick = (e) => {
        const parent = e.target.parentElement.parentElement.parentElement;
        const id = parent.getAttribute("data-id");
        const item = questions.filter((item) => item.id == Number(id))[0];
        rsps_user.push({
          id,
          value: e.target.innerText,
        });
        if (
          item.response.filter(
            (resp) => resp.isTrue && resp.value === e.target.innerText
          ).length > 0
        ) {
          scoreTotal += Number(item.point);
          score.innerText = scoreTotal;
        }
        parent.classList.toggle("active");
        if (parent.nextElementSibling) {
          parent.nextElementSibling.classList.add("active");
        } else {
          Traitement.style.display = "none";
          form.style.display = "block";
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            qstsContainer.innerHTML = "";
            form.style.display = "none";
            result.style.display = "block";
            result.innerHTML = `
              ${e.target.name.value}  Your score is ${scoreTotal} point  <button class="prev">retour</button>`;
            const buttonPrev = document.querySelector(".prev");
            buttonPrev.addEventListener("click", onPrev);
            if (!localStorage.getItem("leaderboard")) {
              localStorage.setItem(
                "leaderboard",
                JSON.stringify([
                  {
                    name: e.target.name.value,
                    scoreTotal,
                  },
                ])
              );
            } else {
              const newData = [
                ...JSON.parse(localStorage.getItem("leaderboard")),
                { name: e.target.name.value, scoreTotal },
              ];
              console.log(newData);
              localStorage.setItem(
                "leaderboard",
                JSON.stringify(
                  newData.sort((a, b) => b.scoreTotal - a.scoreTotal)
                )
              );
            }
          });
          //   end of form
        }
      };
    });
  });
};
//dom
const onPrev = (e) => {
  buttons.style.display = "block";
  Traitement.style.display = "none";
  form.style.display = "none";
  result.style.display = "none";
  leaderboard.style.display = "none";
  buttonStart.addEventListener("click", onStart);
};
buttonStart.addEventListener("click", onStart);
