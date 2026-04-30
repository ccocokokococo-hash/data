function checkTasks() {
  let score = 0;
  const total = 20;

  const correctAnswers = {
    q1: ["математика"],
    q2: ["көркем еңбек", "коркем еңбек"],
    q3: ["5"],
    q4: ["бейсенбі", "бейсенби"],
    q5: ["сәрсенбі", "сарсенби"],
    q6: ["19.6", "19,6"],
    q7: ["ұйқы", "уйқы"],
    q8: ["2"],
    q10: ["нұрасыл", "нурасыл"],
    q11: ["155"],
    q12: ["31"],
    q13: ["сызғыш", "сызгыш"],
    q14: ["өшіргіш", "оширгиш"],
    q15: ["280"],
    q16: ["қате", "кате"]
  };

  for (let id in correctAnswers) {
    const element = document.getElementById(id);
    if (!element) continue;

    const value = element.value.toLowerCase().trim();

    if (correctAnswers[id].some(answer => value.includes(answer))) {
      score++;
    }
  }

  const q9 = document.getElementById("q9").value.trim();
  const q17 = document.getElementById("q17").value.trim().toLowerCase();
  const q18 = document.getElementById("q18").value.trim();
  const q19 = document.getElementById("q19").value.trim();
  const q20 = document.getElementById("q20").value.trim();

  if (q9.length >= 25) score++;
  if (q17.length >= 25 && q17.includes("математика")) score++;
  if (q18.length >= 5) score++;
  if (q19.length >= 20) score++;
  if (q20.length >= 25) score++;

  const percent = Math.round((score / total) * 100);

  const resultBox = document.getElementById("resultBox");
  resultBox.style.display = "block";

  let level = "";
  let className = "";
  let advice = "";

  if (percent >= 85) {
    level = "Жоғары деңгей";
    className = "result-box good";
    advice = "Сен деректерді жақсы түсініп, салыстырып, нақты қорытынды жасай алдың.";
  } else if (percent >= 60) {
    level = "Орта деңгей";
    className = "result-box mid";
    advice = "Негізгі тапсырмалар орындалды. Қорытындыны дерекпен дәлелдеуді күшейту керек.";
  } else {
    level = "Бастапқы деңгей";
    className = "result-box low";
    advice = "Деректерді қайта қарап, DataBot көмекшісінің бағыттаушы сұрақтарын қолдан.";
  }

  resultBox.className = className;

  resultBox.innerHTML = `
    <h3>${level}</h3>
    <p>Жалпы нәтиже: <b>${percent}%</b></p>
    <p>Дұрыс орындалған тапсырмалар: <b>${score}/${total}</b></p>
    <p>${advice}</p>

    <table>
      <tr>
        <th>Бағалау индикаторы</th>
        <th>Нәтиже</th>
      </tr>
      <tr>
        <td>Деректерді түсіну</td>
        <td>${percent >= 60 ? "Қалыптасқан" : "Қосымша жұмыс қажет"}</td>
      </tr>
      <tr>
        <td>Салыстыру</td>
        <td>${percent >= 60 ? "Қалыптасқан" : "Қосымша жұмыс қажет"}</td>
      </tr>
      <tr>
        <td>Талдау</td>
        <td>${percent >= 70 ? "Жақсы" : "Дамытуды қажет етеді"}</td>
      </tr>
      <tr>
        <td>Қорытынды жасау</td>
        <td>${percent >= 75 ? "Жақсы" : "Дәлелдеуді күшейту керек"}</td>
      </tr>
    </table>
  `;

  localStorage.setItem("DataLabKidsResult", percent);
}
