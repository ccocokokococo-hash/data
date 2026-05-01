function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function containsAny(value, answers) {
  return answers.some(answer => value.includes(answer));
}

function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

function saveStudentResult(name, studentClass, data) {
  let students = getStudents();

  const existingIndex = students.findIndex(
    student => student.name.toLowerCase() === name.toLowerCase()
  );

  const oldStudent = existingIndex >= 0 ? students[existingIndex] : {};

  const updatedStudent = {
    ...oldStudent,
    name: name,
    class: studentClass || oldStudent.class || "4-сынып",
    diagnostic: data.diagnostic ?? oldStudent.diagnostic ?? 0,
    task: data.task ?? oldStudent.task ?? 0,
    understand: data.understand ?? oldStudent.understand ?? 0,
    compare: data.compare ?? oldStudent.compare ?? 0,
    analyze: data.analyze ?? oldStudent.analyze ?? 0,
    conclusion: data.conclusion ?? oldStudent.conclusion ?? 0
  };

  if (existingIndex >= 0) {
    students[existingIndex] = updatedStudent;
  } else {
    students.push(updatedStudent);
  }

  saveStudents(students);
  localStorage.setItem("currentStudent", name);
}

function showResultBox(id, percent, score, total) {
  const box = document.getElementById(id);
  if (!box) return;

  let className = "result-box low";
  let title = "Бастапқы деңгей";
  let text = "Деректерді қайта қарап, AI-көмекшінің бағыттаушы сұрақтарын қолданып көр.";

  if (percent >= 85) {
    className = "result-box good";
    title = "Жоғары деңгей";
    text = "Өте жақсы! Сен деректерді түсініп, салыстырып, нақты қорытынды жасай алдың.";
  } else if (percent >= 60) {
    className = "result-box mid";
    title = "Орта деңгей";
    text = "Жақсы! Негізгі дағдылар қалыптасқан, бірақ қорытындыны дерекпен дәлелдеуді күшейту керек.";
  }

  box.style.display = "block";
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
  const name = document.getElementById("studentName").value.trim();
  const studentClass = document.getElementById("studentClass").value.trim();

  if (name.length < 2) {
    alert("Оқушының аты-жөнін жазыңыз.");
    return;
  }

  let score = 0;
  const total = 8;

  const d1 = normalize(document.getElementById("d1").value);
  const d2 = normalize(document.getElementById("d2").value);
  const d3 = normalize(document.getElementById("d3").value);
  const d4 = normalize(document.getElementById("d4").value);
  const d5 = normalize(document.getElementById("d5").value);
  const d6 = normalize(document.getElementById("d6").value);
  const d7 = normalize(document.getElementById("d7").value);
  const d8 = normalize(document.getElementById("d8").value);

  const d1Correct = containsAny(d1, ["математика"]);
  const d2Correct = containsAny(d2, ["көркем еңбек", "коркем еңбек"]);
  const d3Correct = containsAny(d3, ["5"]);
  const d4Correct = containsAny(d4, ["математика"]);
  const d5Correct = d5.length >= 25;
  const d6Correct = containsAny(d6, ["4"]);
  const d7Correct = containsAny(d7, ["6"]);
  const d8Correct =
    d8.length >= 25 &&
    (
      containsAny(d8, ["математика"]) ||
      containsAny(d8, ["қазақ", "казак"])
    );

  if (d1Correct) score++;
  if (d2Correct) score++;
  if (d3Correct) score++;
  if (d4Correct) score++;
  if (d5Correct) score++;
  if (d6Correct) score++;
  if (d7Correct) score++;
  if (d8Correct) score++;

  const percent = Math.round((score / total) * 100);

  const understand = Math.round(((d1Correct + d2Correct + d4Correct) / 3) * 100);
  const compare = Math.round(((d3Correct + d6Correct + d7Correct) / 3) * 100);
  const analyze = d8Correct ? 100 : 0;
  const conclusion = d5Correct ? 100 : 0;

  saveStudentResult(name, studentClass, {
    diagnostic: percent,
    understand,
    compare,
    analyze,
    conclusion
  });

  showResultBox("diagnosticResult", percent, score, total);
}

function checkTasks() {
  const currentName = localStorage.getItem("currentStudent");

  if (!currentName) {
    alert("Алдымен диагностикадан өтіп, оқушы аты-жөнін енгізіңіз.");
    return;
  }

  let students = getStudents();
  const student = students.find(
    item => item.name.toLowerCase() === currentName.toLowerCase()
  );

  if (!student) {
    alert("Оқушы табылмады. Алдымен диагностикадан өтіңіз.");
    return;
  }

  let score = 0;
  const total = 22;

  const values = {};
  for (let i = 1; i <= 22; i++) {
    const el = document.getElementById("t" + i);
    values["t" + i] = el ? normalize(el.value) : "";
  }

  const correct = {
    t1: containsAny(values.t1, ["бейсенбі", "бейсенби"]),
    t2: containsAny(values.t2, ["сәрсенбі", "сарсенби"]),
    t3: containsAny(values.t3, ["19.6", "19,6"]),
    t4: values.t4.length >= 25,

    t5: containsAny(values.t5, ["ұйқы", "уйқы"]),
    t6: containsAny(values.t6, ["2"]),
    t7: values.t7.length >= 20,
    t8: values.t8.length >= 25,

    t9: containsAny(values.t9, ["нұрасыл", "нурасыл"]),
    t10: containsAny(values.t10, ["дана"]),
    t11: containsAny(values.t11, ["155"]),
    t12: containsAny(values.t12, ["31"]),
    t13: values.t13.length >= 25,

    t14: containsAny(values.t14, ["сызғыш", "сызгыш"]),
    t15: containsAny(values.t15, ["өшіргіш", "оширгиш"]),
    t16: containsAny(values.t16, ["280"]),
    t17: values.t17.length >= 20,

    t18: containsAny(values.t18, ["қате", "кате"]),
    t19: values.t19.length >= 25 && containsAny(values.t19, ["ұйқы", "уйқы"]),

    t20: values.t20.length >= 5,
    t21: values.t21.length >= 20,
    t22: values.t22.length >= 25
  };

  Object.values(correct).forEach(value => {
    if (value) score++;
  });

  const percent = Math.round((score / total) * 100);

  const understandTask = Math.round(
    ((correct.t1 + correct.t2 + correct.t5 + correct.t9) / 4) * 100
  );

  const compareTask = Math.round(
    ((correct.t6 + correct.t10 + correct.t14 + correct.t15) / 4) * 100
  );

  const analyzeTask = Math.round(
    ((correct.t3 + correct.t11 + correct.t12 + correct.t16 + correct.t18) / 5) * 100
  );

  const conclusionTask = Math.round(
    ((correct.t4 + correct.t7 + correct.t8 + correct.t13 + correct.t17 + correct.t19 + correct.t22) / 7) * 100
  );

  student.task = percent;
  student.understand = Math.round(((student.understand || 0) + understandTask) / 2);
  student.compare = Math.round(((student.compare || 0) + compareTask) / 2);
  student.analyze = Math.round(((student.analyze || 0) + analyzeTask) / 2);
  student.conclusion = Math.round(((student.conclusion || 0) + conclusionTask) / 2);

  saveStudents(students);

  showResultBox("taskResult", percent, score, total);
}

function getCurrentStudent() {
  const currentName = localStorage.getItem("currentStudent");
  const students = getStudents();

  if (!currentName) return null;

  return students.find(
    student => student.name.toLowerCase() === currentName.toLowerCase()
  );
}

function getLevel(percent) {
  if (percent >= 85) return "Жоғары деңгей";
  if (percent >= 70) return "Жақсы деңгей";
  if (percent >= 50) return "Орта деңгей";
  return "Қосымша жұмыс қажет";
}

function getAdvice(percent) {
  if (percent >= 85) {
    return "Оқушы деректерді жақсы түсінеді, салыстырады және қорытындыны дәлелдей алады. Күрделірек зерттеу тапсырмаларын беруге болады.";
  }

  if (percent >= 70) {
    return "Оқушы негізгі дағдыларды меңгерген. Қорытындыны нақты дерекпен дәлелдеуді күшейту ұсынылады.";
  }

  if (percent >= 50) {
    return "Оқушыға салыстыру және талдау тапсырмаларын көбірек беру қажет.";
  }

  return "Оқушыға кестені оқу, негізгі көрсеткішті табу және қысқа қорытынды жазу бойынша қосымша қолдау қажет.";
}

function loadProgress() {
  const student = getCurrentStudent();

  if (!student) {
    const totalText = document.getElementById("totalText");
    if (totalText) totalText.innerText = "0%";
    return;
  }

  const diagnostic = student.diagnostic || 0;
  const task = student.task || 0;
  const total = Math.round((diagnostic + task) / 2);

  const studentInfo = document.getElementById("studentInfo");
  if (studentInfo) {
    studentInfo.innerText = `${student.name} | ${student.class || "4-сынып"}`;
  }

  document.getElementById("diagnosticText").innerText = diagnostic + "%";
  document.getElementById("taskText").innerText = task + "%";
  document.getElementById("totalText").innerText = total + "%";

  document.getElementById("diagnosticBar").style.width = diagnostic + "%";
  document.getElementById("taskBar").style.width = task + "%";

  const totalBar = document.getElementById("totalBar");
  if (totalBar) totalBar.style.width = total + "%";

  const levelText = document.getElementById("levelText");
  if (levelText) levelText.innerText = getLevel(total);

  const adviceText = document.getElementById("adviceText");
  if (adviceText) adviceText.innerText = getAdvice(total);

  const fields = {
    skillUnderstandPercent: student.understand || 0,
    skillComparePercent: student.compare || 0,
    skillAnalyzePercent: student.analyze || 0,
    skillConclusionPercent: student.conclusion || 0
  };

  Object.entries(fields).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value + "%";
  });

  const levels = {
    skillUnderstandLevel: student.understand || 0,
    skillCompareLevel: student.compare || 0,
    skillAnalyzeLevel: student.analyze || 0,
    skillConclusionLevel: student.conclusion || 0
  };

  Object.entries(levels).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.innerText = getLevel(value);
  });

  const ctx = document.getElementById("skillsChart");
  if (ctx && window.Chart) {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Түсіну", "Салыстыру", "Талдау", "Қорытынды"],
        datasets: [{
          label: "Дағды деңгейі (%)",
          data: [
            student.understand || 0,
            student.compare || 0,
            student.analyze || 0,
            student.conclusion || 0
          ],
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
  const students = getStudents();

  const table = document.getElementById("studentsTable");

  if (table) {
    table.innerHTML = "";

    students.forEach(student => {
      const diagnostic = student.diagnostic || 0;
      const task = student.task || 0;
      const total = Math.round((diagnostic + task) / 2);

      const row = `
        <tr>
          <td>${student.name}</td>
          <td>${student.class || "4-сынып"}</td>
          <td>${diagnostic}%</td>
          <td>${task}%</td>
          <td><b>${total}%</b></td>
          <td>${getLevel(total)}</td>
        </tr>
      `;

      table.innerHTML += row;
    });
  }

  const current = getCurrentStudent();

  if (!current) return;

  const diagnostic = current.diagnostic || 0;
  const task = current.task || 0;
  const total = Math.round((diagnostic + task) / 2);

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  };

  setText("teacherStudentName", current.name);
  setText("teacherDiagnostic", diagnostic + "%");
  setText("teacherTask", task + "%");
  setText("teacherTotal", total + "%");
  setText("teacherLevel", getLevel(total));
  setText("teacherAdvice", getAdvice(total));

  setText("teacherUnderstand", (current.understand || 0) + "%");
  setText("teacherCompare", (current.compare || 0) + "%");
  setText("teacherAnalyze", (current.analyze || 0) + "%");
  setText("teacherConclusion", (current.conclusion || 0) + "%");

  setText("teacherUnderstandNote", getLevel(current.understand || 0));
  setText("teacherCompareNote", getLevel(current.compare || 0));
  setText("teacherAnalyzeNote", getLevel(current.analyze || 0));
  setText("teacherConclusionNote", getLevel(current.conclusion || 0));

  const ctx = document.getElementById("teacherChart");
  if (ctx && window.Chart) {
    new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Түсіну", "Салыстыру", "Талдау", "Қорытынды"],
        datasets: [{
          label: current.name,
          data: [
            current.understand || 0,
            current.compare || 0,
            current.analyze || 0,
            current.conclusion || 0
          ],
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
  localStorage.removeItem("students");
  localStorage.removeItem("currentStudent");
  alert("Барлық нәтижелер тазартылды.");
  location.reload();
}
