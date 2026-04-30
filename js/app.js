function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function containsAny(value, answers) {
  return answers.some(answer => value.includes(answer));
}

function showResultBox(id, percent, score, total) {
  const box = document.getElementById(id);
  if (!box) return;

  box.style.display = "block";

  let className = "result-box low";
  let title = "Бастапқы деңгей";
  let text = "Деректерді қайта қарап, DataBot көмекшісінің сұрақтарын қолданып көр.";

  if (percent >= 85) {
    className = "result-box good";
    title = "Жоғары деңгей";
    text = "Өте жақсы! Сен деректерді түсініп, салыстырып, нақты қорытынды жасай алдың.";
  } else if (percent >= 60) {
    className = "result-box mid";
    title = "Орта деңгей";
    text = "Жақсы! Негізгі дағдылар қалыптасқан, бірақ қорытындыны дәлелдеуді күшейту керек.";
  }

  box.className = className;
  box.innerHTML = `
    <h3>${title}</h3>
    <p>Нәтиже: <b>${percent}%</b></p>
    <p>Дұрыс орындалғаны: <b>${score}/${total}</b></p>
    <p>${text}</p>
    <a class="btn secondary" href="progress.html">Прогрессті көру</a>
  `;
}

function checkDiagnostic() {
  let score = 0;
  const total = 5;

  const d1 = normalize(document.getElementById("d1").value);
  const d2 = normalize(document.getElementById("d2").value);
  const d3 = normalize(document.getElementById("d3").value);
  const d4 = normalize(document.getElementById("d4").value);
  const d5 = normalize(document.getElementById("d5").value);

  if (containsAny(d1, ["математика"])) score++;
  if (containsAny(d2, ["көркем еңбек", "коркем еңбек"])) score++;
  if (containsAny(d3, ["5"])) score++;
  if (containsAny(d4, ["математика"])) score++;
  if (d5.length >= 25) score++;

  const percent = Math.round((score / total) * 100);

  localStorage.setItem("diagnosticResult", percent);
  localStorage.setItem("diagnosticScore", score);
  localStorage.setItem("diagnosticTotal", total);

  const understand = Math.round(((containsAny(d1, ["математика"]) ? 1 : 0) + (containsAny(d2, ["көркем еңбек", "коркем еңбек"]) ? 1 : 0)) / 2 * 100);
  const compare = containsAny(d3, ["5"]) ? 100 : 0;
  const analyze = containsAny(d4, ["математика"]) ? 100 : 0;
  const conclusion = d5.length >= 25 ? 100 : 0;

  localStorage.setItem("skillUnderstandDiagnostic", understand);
  localStorage.setItem("skillCompareDiagnostic", compare);
  localStorage.setItem("skillAnalyzeDiagnostic", analyze);
  localStorage.setItem("skillConclusionDiagnostic", conclusion);

  showResultBox("diagnosticResult", percent, score, total);
}

function checkMiniPractice() {
  let score = 0;
  const m1 = normalize(document.getElementById("mini1").value);
  const m2 = normalize(document.getElementById("mini2").value);

  if (m1.includes("математика")) score++;
  if (m2.includes("4")) score++;

  const percent = Math.round((score / 2) * 100);
  showResultBox("miniResult", percent, score, 2);
}

function checkTasks() {
  let score = 0;
  const total = 22;

  const values = {};
  for (let i = 1; i <= 22; i++) {
    const el = document.getElementById("t" + i);
    values["t" + i] = el ? normalize(el.value) : "";
  }

  if (containsAny(values.t1, ["бейсенбі", "бейсенби"])) score++;
  if (containsAny(values.t2, ["сәрсенбі", "сарсенби"])) score++;
  if (containsAny(values.t3, ["19.6", "19,6"])) score++;
  if (values.t4.length >= 25) score++;

  if (containsAny(values.t5, ["ұйқы", "уйқы"])) score++;
  if (containsAny(values.t6, ["2"])) score++;
  if (values.t7.length >= 20) score++;
  if (values.t8.length >= 25) score++;

  if (containsAny(values.t9, ["нұрасыл", "нурасыл"])) score++;
  if (containsAny(values.t10, ["дана"])) score++;
  if (containsAny(values.t11, ["155"])) score++;
  if (containsAny(values.t12, ["31"])) score++;
  if (values.t13.length >= 25) score++;

  if (containsAny(values.t14, ["сызғыш", "сызгыш"])) score++;
  if (containsAny(values.t15, ["өшіргіш", "оширгиш"])) score++;
  if (containsAny(values.t16, ["280"])) score++;
  if (values.t17.length >= 20) score++;

  if (containsAny(values.t18, ["қате", "кате"])) score++;
  if (values.t19.length >= 25 && containsAny(values.t19, ["ұйқы", "уйқы"])) score++;

  if (values.t20.length >= 5) score++;
  if (values.t21.length >= 20) score++;
  if (values.t22.length >= 25) score++;

  const percent = Math.round((score / total) * 100);

  localStorage.setItem("taskResult", percent);
  localStorage.setItem("taskScore", score);
  localStorage.setItem("taskTotal", total);

  const understandScore =
    (containsAny(values.t1, ["бейсенбі", "бейсенби"]) ? 1 : 0) +
    (containsAny(values.t2, ["сәрсенбі", "сарсенби"]) ? 1 : 0) +
    (containsAny(values.t5, ["ұйқы", "уйқы"]) ? 1 : 0) +
    (containsAny(values.t9, ["нұрасыл", "нурасыл"]) ? 1 : 0);

  const compareScore =
    (containsAny(values.t6, ["2"]) ? 1 : 0) +
    (containsAny(values.t10, ["дана"]) ? 1 : 0) +
    (containsAny(values.t14, ["сызғыш", "сызгыш"]) ? 1 : 0) +
    (containsAny(values.t15, ["өшіргіш", "оширгиш"]) ? 1 : 0);

  const analyzeScore =
    (containsAny(values.t3, ["19.6", "19,6"]) ? 1 : 0) +
    (containsAny(values.t11, ["155"]) ? 1 : 0) +
    (containsAny(values.t12, ["31"]) ? 1 : 0) +
    (containsAny(values.t16, ["280"]) ? 1 : 0) +
    (containsAny(values.t18, ["қате", "кате"]) ? 1 : 0);

  const conclusionScore =
    (values.t4.length >= 25 ? 1 : 0) +
    (values.t7.length >= 20 ? 1 : 0) +
    (values.t8.length >= 25 ? 1 : 0) +
    (values.t13.length >= 25 ? 1 : 0) +
    (values.t17.length >= 20 ? 1 : 0) +
    (values.t19.length >= 25 ? 1 : 0) +
    (values.t22.length >= 25 ? 1 : 0);

  localStorage.setItem("skillUnderstandTask", Math.round((understandScore / 4) * 100));
  localStorage.setItem("skillCompareTask", Math.round((compareScore / 4) * 100));
  localStorage.setItem("skillAnalyzeTask", Math.round((analyzeScore / 5) * 100));
  localStorage.setItem("skillConclusionTask", Math.round((conclusionScore / 7) * 100));

  showResultBox("taskResult", percent, score, total);
}

function getNumber(key) {
  return Number(localStorage.getItem(key)) || 0;
}

function average(a, b) {
  if (a === 0 && b === 0) return 0;
  if (a === 0) return b;
  if (b === 0) return a;
  return Math.round((a + b) / 2);
}

function getLevel(percent) {
  if (percent >= 85) return "Жоғары деңгей";
  if (percent >= 70) return "Жақсы деңгей";
  if (percent >= 50) return "Орта деңгей";
  return "Қосымша жұмыс қажет";
}

function getShortLevel(percent) {
  if (percent >= 85) return "Жоғары";
  if (percent >= 70) return "Жақсы";
  if (percent >= 50) return "Орта";
  return "Төмен";
}

function getAdvice(total) {
  if (total >= 85) {
    return "Оқушы деректерді жақсы түсінеді. Күрделірек зерттеу тапсырмаларын беруге болады.";
  }
  if (total >= 70) {
    return "Оқушы негізгі дағдыларды меңгерген. Қорытындыны дәлелдеуді күшейту ұсынылады.";
  }
  if (total >= 50) {
    return "Оқушыға салыстыру және талдау тапсырмаларын көбірек беру қажет.";
  }
  return "Оқушыға кестені оқу, негізгі көрсеткішті табу және қысқа қорытынды жазу бойынша қосымша қолдау керек.";
}

function calculateSkills() {
  const diagnostic = getNumber("diagnosticResult");
  const task = getNumber("taskResult");
  const total = average(diagnostic, task);

  const understand = average(getNumber("skillUnderstandDiagnostic"), getNumber("skillUnderstandTask"));
  const compare = average(getNumber("skillCompareDiagnostic"), getNumber("skillCompareTask"));
  const analyze = average(getNumber("skillAnalyzeDiagnostic"), getNumber("skillAnalyzeTask"));
  const conclusion = average(getNumber("skillConclusionDiagnostic"), getNumber("skillConclusionTask"));

  return { diagnostic, task, total, understand, compare, analyze, conclusion };
}

function loadProgress() {
  const data = calculateSkills();

  document.getElementById("diagnosticBar").style.width = data.diagnostic + "%";
  document.getElementById("taskBar").style.width = data.task + "%";

  document.getElementById("diagnosticText").innerText = data.diagnostic + "%";
  document.getElementById("taskText").innerText = data.task + "%";
  document.getElementById("totalText").innerText = data.total + "%";
  document.getElementById("levelText").innerText = getLevel(data.total);
  document.getElementById("adviceText").innerText = getAdvice(data.total);

  document.getElementById("skillUnderstandPercent").innerText = data.understand + "%";
  document.getElementById("skillComparePercent").innerText = data.compare + "%";
  document.getElementById("skillAnalyzePercent").innerText = data.analyze + "%";
  document.getElementById("skillConclusionPercent").innerText = data.conclusion + "%";

  document.getElementById("skillUnderstandLevel").innerText = getLevel(data.understand);
  document.getElementById("skillCompareLevel").innerText = getLevel(data.compare);
  document.getElementById("skillAnalyzeLevel").innerText = getLevel(data.analyze);
  document.getElementById("skillConclusionLevel").innerText = getLevel(data.conclusion);

  const ctx = document.getElementById("skillsChart");
  if (ctx && window.Chart) {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Түсіну", "Салыстыру", "Талдау", "Қорытынды"],
        datasets: [{
          label: "Дағды деңгейі (%)",
          data: [data.understand, data.compare, data.analyze, data.conclusion],
          backgroundColor: ["#2563eb", "#22c55e", "#7c3aed", "#f59e0b"],
          borderRadius: 12
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
}

function loadTeacherPanel() {
  const data = calculateSkills();

  document.getElementById("teacherDiagnostic").innerText = data.diagnostic + "%";
  document.getElementById("teacherTask").innerText = data.task + "%";
  document.getElementById("teacherTotal").innerText = data.total + "%";
  document.getElementById("teacherLevel").innerText = getShortLevel(data.total);

  document.getElementById("teacherUnderstand").innerText = data.understand + "%";
  document.getElementById("teacherCompare").innerText = data.compare + "%";
  document.getElementById("teacherAnalyze").innerText = data.analyze + "%";
  document.getElementById("teacherConclusion").innerText = data.conclusion + "%";

  document.getElementById("teacherUnderstandNote").innerText = getLevel(data.understand);
  document.getElementById("teacherCompareNote").innerText = getLevel(data.compare);
  document.getElementById("teacherAnalyzeNote").innerText = getLevel(data.analyze);
  document.getElementById("teacherConclusionNote").innerText = getLevel(data.conclusion);

  document.getElementById("teacherAdvice").innerText = getAdvice(data.total);

  const ctx = document.getElementById("teacherChart");
  if (ctx && window.Chart) {
    new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Түсіну", "Салыстыру", "Талдау", "Қорытынды"],
        datasets: [{
          label: "Оқушы дағдылары",
          data: [data.understand, data.compare, data.analyze, data.conclusion],
          backgroundColor: "rgba(37, 99, 235, 0.18)",
          borderColor: "#2563eb",
          pointBackgroundColor: "#2563eb"
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
}

function clearAllResults() {
  localStorage.removeItem("diagnosticResult");
  localStorage.removeItem("diagnosticScore");
  localStorage.removeItem("diagnosticTotal");
  localStorage.removeItem("taskResult");
  localStorage.removeItem("taskScore");
  localStorage.removeItem("taskTotal");

  localStorage.removeItem("skillUnderstandDiagnostic");
  localStorage.removeItem("skillCompareDiagnostic");
  localStorage.removeItem("skillAnalyzeDiagnostic");
  localStorage.removeItem("skillConclusionDiagnostic");

  localStorage.removeItem("skillUnderstandTask");
  localStorage.removeItem("skillCompareTask");
  localStorage.removeItem("skillAnalyzeTask");
  localStorage.removeItem("skillConclusionTask");

  alert("Нәтижелер тазартылды.");
  location.reload();
}
