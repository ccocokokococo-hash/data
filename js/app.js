
function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}
function saveStudents(data) {
  localStorage.setItem("students", JSON.stringify(data));
}
function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replaceAll("ә", "а")
    .replaceAll("і", "и")
    .replaceAll("ң", "н")
    .replaceAll("ғ", "г")
    .replaceAll("ү", "у")
    .replaceAll("ұ", "у")
    .replaceAll("қ", "к")
    .replaceAll("ө", "о")
    .replaceAll("һ", "х");
}
function containsAnswer(userValue, correctList) {
  const user = normalize(userValue);
  return correctList.some(answer => {
    const correct = normalize(answer);
    return user.includes(correct);
  });
}
function getNow() {
  const now = new Date();
  return now.toLocaleString("kk-KZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
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
function getAdvice(percent) {
  if (percent >= 85) {
    return "Оқушы деректерді жақсы түсінеді, салыстырады, талдайды және қорытындыны дәлелдей алады. Оған күрделірек зерттеу тапсырмаларын беруге болады.";
  }
  if (percent >= 70) {
    return "Оқушы негізгі дағдыларды меңгерген. Бірақ қорытындыны нақты дерекпен дәлелдеуді күшейту ұсынылады.";
  }
  if (percent >= 50) {
    return "Оқушыда бастапқы түсіну бар, бірақ салыстыру және талдау тапсырмаларын көбірек орындау қажет.";
  }
  return "Оқушыға кестені оқу, негізгі көрсеткішті табу және қысқа қорытынды жазу бойынша қосымша қолдау қажет.";
}
function getCurrentStudentName() {
  return localStorage.getItem("currentStudent") || "";
}
function setCurrentStudent(name) {
  localStorage.setItem("currentStudent", name);
}
function findStudentByName(name) {
  const students = getStudents();
  return students.find(s => normalize(s.name) === normalize(name));
}
function calculateTotal(diagnostic, task) {
  const d = Number(diagnostic) || 0;
  const t = Number(task) || 0;
  if (d === 0 && t === 0) return 0;
  if (d === 0) return t;
  if (t === 0) return d;
  return Math.round((d + t) / 2);
}
function averageNumbers(values) {
  const valid = values.filter(v => typeof v === "number" && !isNaN(v));
  if (valid.length === 0) return 0;
  const sum = valid.reduce((a, b) => a + b, 0);
  return Math.round(sum / valid.length);
}
// =====================================================
// 2. НӘТИЖЕ БЛОГЫН КӨРСЕТУ
// =====================================================
function showResultBox(id, percent, score, total, titleText) {
  const box = document.getElementById(id);
  if (!box) return;
  let className = "result-box low";
  let title = titleText || "Нәтиже";
  let level = getLevel(percent);
  let text = getAdvice(percent);
  if (percent >= 85) {
    className = "result-box good";
  } else if (percent >= 60) {
    className = "result-box mid";
  }
  box.style.display = "block";
  box.className = className;
  box.innerHTML = `
    <h3>${title}</h3>
    <p><b>Деңгей:</b> ${level}</p>
    <p><b>Нәтиже:</b> ${percent}%</p>
    <p><b>Дұрыс орындалғаны:</b> ${score}/${total}</p>
    <p>${text}</p>
    <a class="btn secondary" href="progress.html">Прогрессті көру</a>
  `;
}
// =====================================================
// 3. ОҚУШЫНЫ ТІРКЕУ ЖӘНЕ ЖАҢАРТУ
// =====================================================
function registerStudent(name, studentClass) {
  let students = getStudents();
  const existingIndex = students.findIndex(
    s => normalize(s.name) === normalize(name)
  );
  if (existingIndex === -1) {
    students.push({
      id: Date.now(),
      name: name,
      class: studentClass || "4-сынып",
      diagnostic: 0,
      task: 0,
      total: 0,
      level: "Төмен",
      finished: false,
      registeredAt: getNow(),
      diagnosticTime: "",
      taskTime: "",
      diagnosticAnswers: {},
      answers: {},
      skills: {
        understand: 0,
        compare: 0,
        analyze: 0,
        conclusion: 0
      },
      mistakes: 0,
      weakSkill: "Әлі анықталмады"
    });
  } else {
    students[existingIndex].class = studentClass || students[existingIndex].class;
  }
  saveStudents(students);
  setCurrentStudent(name);
}
function updateStudent(name, updateData) {
  let students = getStudents();
  const index = students.findIndex(
    s => normalize(s.name) === normalize(name)
  );
  if (index === -1) return;
  students[index] = {
    ...students[index],
    ...updateData
  };
  saveStudents(students);
}
function getCurrentStudent() {
  const name = getCurrentStudentName();
  if (!name) return null;
  return findStudentByName(name);
}
// =====================================================
// 4. ДИАГНОСТИКА ЖАУАПТАРЫ
// =====================================================
const diagnosticQuestions = {
  d1: {
    question: "Ең көп таңдалған пән қайсы?",
    correct: ["математика"],
    skill: "understand"
  },
  d2: {
    question: "Ең аз таңдалған пән қайсы?",
    correct: ["көркем еңбек", "коркем еңбек"],
    skill: "understand"
  },
  d3: {
    question: "Математика мен дүниетану пәндерінің айырмашылығы қанша оқушы?",
    correct: ["5"],
    skill: "compare"
  },
  d4: {
    question: "Диаграммада ең ұзын баған қай пәнге тиесілі?",
    correct: ["математика"],
    skill: "analyze"
  },
  d5: {
    question: "Осы деректерден қандай қорытынды жасауға болады?",
    correct: [],
    skill: "conclusion",
    minLength: 25
  },
  d6: {
    question: "Қазақ тілі мен көркем еңбек пәндерінің айырмашылығы қанша оқушы?",
    correct: ["4"],
    skill: "compare"
  },
  d7: {
    question: "Егер ағылшын тілін тағы 2 оқушы таңдаса, жалпы неше оқушы болады?",
    correct: ["6"],
    skill: "analyze"
  },
  d8: {
    question: "Қай пәндерді оқушылар көбірек таңдаған: нақты дерекпен дәлелде.",
    correct: [],
    skill: "conclusion",
    minLength: 30
  }
};
// =====================================================
// 5. ДИАГНОСТИКАНЫ ТЕКСЕРУ
// =====================================================
function checkDiagnostic() {
  const name = document.getElementById("studentName")?.value.trim();
  const studentClass = document.getElementById("studentClass")?.value.trim();
  if (!name || name.length < 2) {
    alert("Оқушының аты-жөнін жазыңыз.");
    return;
  }
  registerStudent(name, studentClass);
  let score = 0;
  const total = Object.keys(diagnosticQuestions).length;
  let diagnosticAnswers = {};
  let skillScore = {
    understand: { correct: 0, total: 0 },
    compare: { correct: 0, total: 0 },
    analyze: { correct: 0, total: 0 },
    conclusion: { correct: 0, total: 0 }
  };
  Object.entries(diagnosticQuestions).forEach(([key, item]) => {
    const userValue = document.getElementById(key)?.value || "";
    let isCorrect = false;
    if (item.minLength) {
      isCorrect = userValue.trim().length >= item.minLength;
    } else {
      isCorrect = containsAnswer(userValue, item.correct);
    }
    if (isCorrect) score++;
    skillScore[item.skill].total++;
    if (isCorrect) skillScore[item.skill].correct++;
    diagnosticAnswers[key] = {
      question: item.question,
      user: userValue,
      correct: item.correct.length ? item.correct.join(" / ") : "Дәлелді, толық жауап",
      status: isCorrect,
      skill: item.skill
    };
  });
  const diagnosticPercent = Math.round((score / total) * 100);
  const diagnosticSkills = {
    understand: Math.round((skillScore.understand.correct / skillScore.understand.total) * 100),
    compare: Math.round((skillScore.compare.correct / skillScore.compare.total) * 100),
    analyze: Math.round((skillScore.analyze.correct / skillScore.analyze.total) * 100),
    conclusion: Math.round((skillScore.conclusion.correct / skillScore.conclusion.total) * 100)
  };
  const oldStudent = findStudentByName(name);
  const combinedSkills = {
    understand: averageNumbers([diagnosticSkills.understand, oldStudent?.skills?.understand || 0]),
    compare: averageNumbers([diagnosticSkills.compare, oldStudent?.skills?.compare || 0]),
    analyze: averageNumbers([diagnosticSkills.analyze, oldStudent?.skills?.analyze || 0]),
    conclusion: averageNumbers([diagnosticSkills.conclusion, oldStudent?.skills?.conclusion || 0])
  };
  const totalResult = calculateTotal(diagnosticPercent, oldStudent?.task || 0);
  updateStudent(name, {
    diagnostic: diagnosticPercent,
    total: totalResult,
    level: getShortLevel(totalResult),
    diagnosticTime: getNow(),
    diagnosticAnswers: diagnosticAnswers,
    skills: combinedSkills,
    weakSkill: findWeakSkill(combinedSkills)
  });
  showResultBox(
    "diagnosticResult",
    diagnosticPercent,
    score,
    total,
    "Диагностика нәтижесі"
  );
}
// =====================================================
// 6. ПРАКТИКАЛЫҚ ТАПСЫРМАЛАР ЖАУАПТАРЫ
// =====================================================
const taskQuestions = {
  t1: {
    question: "Ең жылы күн қай күн?",
    correct: ["бейсенбі", "бейсенби"],
    skill: "understand"
  },
  t2: {
    question: "Ең салқын күн қай күн?",
    correct: ["сәрсенбі", "сарсенби"],
    skill: "understand"
  },
  t3: {
    question: "Орташа температураны тап.",
    correct: ["19.6", "19,6"],
    skill: "analyze"
  },
  t4: {
    question: "Апта бойынша қандай қорытынды жасауға болады?",
    correct: [],
    skill: "conclusion",
    minLength: 25
  },
  t5: {
    question: "Ең көп уақыт неге жұмсалады?",
    correct: ["ұйқы", "уйкы", "уйқы"],
    skill: "understand"
  },
  t6: {
    question: "Гаджет уақыты үй тапсырмасынан қанша сағат көп?",
    correct: ["2"],
    skill: "compare"
  },
  t7: {
    question: "Спорт уақыты жеткілікті ме? Неге?",
    correct: [],
    skill: "conclusion",
    minLength: 20
  },
  t8: {
    question: "Күн тәртібін жақсарту бойынша ұсыныс жаз.",
    correct: [],
    skill: "conclusion",
    minLength: 25
  },
  t9: {
    question: "Ең көп кітап оқыған оқушы кім?",
    correct: ["нұрасыл", "нурасыл"],
    skill: "understand"
  },
   t10: {
    question: "Ең аз кітап оқыған оқушы кім?",
    correct: ["дана"],
    skill: "understand"
  },
  t11: {
    question: "Жалпы неше бет оқылды?",
    correct: ["155"],
    skill: "analyze"
  },
  t12: {
    question: "Орташа көрсеткіш қанша бет?",
    correct: ["31"],
    skill: "analyze"
  },
  t13: {
    question: "Бұл деректен қандай қорытынды жасауға болады?",
    correct: [],
    skill: "conclusion",
    minLength: 25
  },
  t14: {
    question: "Ең қымбат зат қайсы?",
    correct: ["сызғыш", "сызгыш"],
    skill: "compare"
  },
  t15: {
    question: "Ең арзан зат қайсы?",
    correct: ["өшіргіш", "оширгиш"],
    skill: "compare"
  },
  t16: {
    question: "Дәптер, қалам және өшіргіш бірге қанша тұрады?",
    correct: ["280"],
    skill: "analyze"
  },
  t17: {
    question: "500 теңгеге қандай заттар алуға болады?",
    correct: [],
    skill: "conclusion",
    minLength: 20
  },
  t18: {
    question: "Бұл қорытынды дұрыс па?",
    correct: ["қате", "кате"],
    skill: "analyze"
  },
  t19: {
    question: "Дұрыс қорытындыны жаз.",
    correct: [],
    skill: "conclusion",
    minLength: 25
  },
  t20: {
    question: "Зерттеу тақырыбың қандай?",
    correct: [],
    skill: "conclusion",
    minLength: 5
  },
  t21: {
    question: "Жинаған деректеріңді жаз.",
    correct: [],
    skill: "conclusion",
    minLength: 20
  },
  t22: {
    question: "Осы дерек бойынша қандай қорытынды жасадың?",
    correct: [],
    skill: "conclusion",
    minLength: 25
  }
};

// =====================================================
// 7. ПРАКТИКАЛЫҚ ТАПСЫРМАЛАРДЫ ТЕКСЕРУ
// =====================================================
function checkTasks() {
  const currentStudent = getCurrentStudent();

  if (!currentStudent) {
    alert("Алдымен диагностикадан өтіп, оқушының аты-жөнін енгізіңіз.");
    return;
  }

  let score = 0;
  const total = Object.keys(taskQuestions).length;

  let answers = {};
  let skillScore = {
    understand: { correct: 0, total: 0 },
    compare: { correct: 0, total: 0 },
    analyze: { correct: 0, total: 0 },
    conclusion: { correct: 0, total: 0 }
  };

  Object.entries(taskQuestions).forEach(([key, item]) => {
    const userValue = document.getElementById(key)?.value || "";
    let isCorrect = false;

    if (item.minLength) {
      isCorrect = userValue.trim().length >= item.minLength;
    } else {
      isCorrect = containsAnswer(userValue, item.correct);
    }

    if (isCorrect) score++;

    skillScore[item.skill].total++;
    if (isCorrect) skillScore[item.skill].correct++;

    answers[key] = {
      question: item.question,
      user: userValue,
      correct: item.correct.length ? item.correct.join(" / ") : "Толық, дәлелді жауап",
      status: isCorrect,
      skill: item.skill
    };
  });

  const taskPercent = Math.round((score / total) * 100);

  const taskSkills = {
    understand: Math.round((skillScore.understand.correct / skillScore.understand.total) * 100),
    compare: Math.round((skillScore.compare.correct / skillScore.compare.total) * 100),
    analyze: Math.round((skillScore.analyze.correct / skillScore.analyze.total) * 100),
    conclusion: Math.round((skillScore.conclusion.correct / skillScore.conclusion.total) * 100)
  };

  const combinedSkills = {
    understand: averageNumbers([currentStudent.skills?.understand || 0, taskSkills.understand]),
    compare: averageNumbers([currentStudent.skills?.compare || 0, taskSkills.compare]),
    analyze: averageNumbers([currentStudent.skills?.analyze || 0, taskSkills.analyze]),
    conclusion: averageNumbers([currentStudent.skills?.conclusion || 0, taskSkills.conclusion])
  };

  const totalResult = calculateTotal(currentStudent.diagnostic, taskPercent);
  const mistakeCount = Object.values(answers).filter(item => !item.status).length;

  updateStudent(currentStudent.name, {
    task: taskPercent,
    total: totalResult,
    level: getShortLevel(totalResult),
    finished: true,
    taskTime: getNow(),
    answers: answers,
    skills: combinedSkills,
    mistakes: mistakeCount,
    weakSkill: findWeakSkill(combinedSkills)
  });

  showResultBox(
    "taskResult",
    taskPercent,
    score,
    total,
    "Практикалық тапсырма нәтижесі"
  );
}

// =====================================================
// 8. ЕҢ ӘЛСІЗ ДАҒДЫНЫ АНЫҚТАУ
// =====================================================
function findWeakSkill(skills) {
  if (!skills) return "Әлі анықталмады";

  const labels = {
    understand: "Деректерді түсіну",
    compare: "Салыстыру",
    analyze: "Талдау",
    conclusion: "Қорытынды жасау"
  };

  const entries = Object.entries(skills);
  if (entries.length === 0) return "Әлі анықталмады";

  const weakest = entries.sort((a, b) => a[1] - b[1])[0];
  return labels[weakest[0]] || "Әлі анықталмады";
}

// =====================================================
// 9. ПРОГРЕСС БЕТІН ЖҮКТЕУ
// =====================================================
function loadProgress() {
  const student = getCurrentStudent();

  if (!student) {
    const totalText = document.getElementById("totalText");
    if (totalText) totalText.innerText = "0%";
    return;
  }

  const diagnostic = Number(student.diagnostic) || 0;
  const task = Number(student.task) || 0;
  const total = calculateTotal(diagnostic, task);

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  };

  const setBar = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.style.width = value + "%";
  };

  setText("studentInfo", `${student.name} | ${student.class || "4-сынып"}`);
  setText("diagnosticText", diagnostic + "%");
  setText("taskText", task + "%");
  setText("totalText", total + "%");
  setText("levelText", getLevel(total));
  setText("adviceText", getAdvice(total));

  setBar("diagnosticBar", diagnostic);
  setBar("taskBar", task);
  setBar("totalBar", total);

  setText("skillUnderstandPercent", (student.skills?.understand || 0) + "%");
  setText("skillComparePercent", (student.skills?.compare || 0) + "%");
  setText("skillAnalyzePercent", (student.skills?.analyze || 0) + "%");
  setText("skillConclusionPercent", (student.skills?.conclusion || 0) + "%");

  setText("skillUnderstandLevel", getLevel(student.skills?.understand || 0));
  setText("skillCompareLevel", getLevel(student.skills?.compare || 0));
  setText("skillAnalyzeLevel", getLevel(student.skills?.analyze || 0));
  setText("skillConclusionLevel", getLevel(student.skills?.conclusion || 0));

  const ctx = document.getElementById("skillsChart");
  if (ctx && window.Chart) {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Түсіну", "Салыстыру", "Талдау", "Қорытынды"],
        datasets: [{
          label: "Дағды деңгейі (%)",
          data: [
            student.skills?.understand || 0,
            student.skills?.compare || 0,
            student.skills?.analyze || 0,
            student.skills?.conclusion || 0
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

// =====================================================
// 10. МҰҒАЛІМ ПАНЕЛІН ЖҮКТЕУ
// =====================================================
function loadTeacherPanel() {
  const students = getStudents();
  const current = getCurrentStudent() || students[0];

  renderClassStats(students);
  renderStudentsTable(students);
  renderRanking(students);

  if (current) {
    setCurrentStudent(current.name);
    renderSelectedStudent(current);
    renderTeacherChart(current);
  }
}

// =====================================================
// 11. СЫНЫП СТАТИСТИКАСЫ
// =====================================================
function renderClassStats(students) {
  const totalStudents = students.length;
  const finishedStudents = students.filter(s => s.finished).length;

  const average = totalStudents
    ? Math.round(students.reduce((sum, s) => sum + (Number(s.total) || 0), 0) / totalStudents)
    : 0;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  };

  setText("classCount", totalStudents);
  setText("finishedCount", finishedStudents);
  setText("classAverage", average + "%");
  setText("hardestQuestion", hardestQuestion());
}

// =====================================================
// 12. ОҚУШЫЛАР КЕСТЕСІ
// =====================================================
function renderStudentsTable(students) {
  const table = document.getElementById("studentsTable");
  if (!table) return;

  table.innerHTML = "";

  if (students.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="10">Әзірге оқушы тіркелмеген.</td>
      </tr>
    `;
    return;
  }

  students.forEach((student, index) => {
    const total = calculateTotal(student.diagnostic, student.task);
    const status = student.finished ? "✔ Дайын" : "⌛ Орындауда";

    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.class || "4-сынып"}</td>
        <td>${student.diagnostic || 0}%</td>
        <td>${student.task || 0}%</td>
        <td><b>${total}%</b></td>
        <td>${getShortLevel(total)}</td>
        <td>${status}</td>
        <td>${student.taskTime || student.diagnosticTime || "-"}</td>
        <td>
          <button class="small-btn" onclick="selectStudent('${student.name}')">Таңдау</button>
          <button class="small-btn" onclick="showAnswers('${student.name}')">Көру</button>
        </td>
      </tr>
    `;
  });
}

// =====================================================
// 13. ТАҢДАЛҒАН ОҚУШЫ
// =====================================================
function selectStudent(name) {
  setCurrentStudent(name);
  const student = findStudentByName(name);
  if (!student) return;

  renderSelectedStudent(student);
  renderTeacherChart(student);
  showAnswers(name);
}

function renderSelectedStudent(student) {
  const total = calculateTotal(student.diagnostic, student.task);

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  };

  setText("teacherStudentName", student.name);
  setText("teacherDiagnostic", (student.diagnostic || 0) + "%");
  setText("teacherTask", (student.task || 0) + "%");
  setText("teacherTotal", total + "%");
  setText("teacherLevel", getLevel(total));

  setText("teacherUnderstand", (student.skills?.understand || 0) + "%");
  setText("teacherCompare", (student.skills?.compare || 0) + "%");
  setText("teacherAnalyze", (student.skills?.analyze || 0) + "%");
  setText("teacherConclusion", (student.skills?.conclusion || 0) + "%");

  setText("teacherUnderstandNote", getLevel(student.skills?.understand || 0));
  setText("teacherCompareNote", getLevel(student.skills?.compare || 0));
  setText("teacherAnalyzeNote", getLevel(student.skills?.analyze || 0));
  setText("teacherConclusionNote", getLevel(student.skills?.conclusion || 0));

  setText("teacherAdvice", getAdvice(total));
}

// =====================================================
// 14. МҰҒАЛІМ ДИАГРАММАСЫ
// =====================================================
let teacherChartInstance = null;

function renderTeacherChart(student) {
  const ctx = document.getElementById("teacherChart");
  if (!ctx || !window.Chart) return;

  if (teacherChartInstance) {
    teacherChartInstance.destroy();
  }

  teacherChartInstance = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Түсіну", "Салыстыру", "Талдау", "Қорытынды"],
      datasets: [{
        label: student.name,
        data: [
          student.skills?.understand || 0,
          student.skills?.compare || 0,
          student.skills?.analyze || 0,
          student.skills?.conclusion || 0
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

// =====================================================
// 15. ЖАУАПТАРДЫ КӨРСЕТУ
// =====================================================
function showAnswers(name) {
  const student = findStudentByName(name);
  const box = document.getElementById("answersBox");
  if (!box) return;

  if (!student) {
    box.innerHTML = "Оқушы табылмады.";
    return;
  }

  const diagnostic = student.diagnosticAnswers || {};
  const tasks = student.answers || {};

  let html = `
    <h3>${student.name} — толық жауаптар</h3>
    <p><b>Сынып:</b> ${student.class || "4-сынып"}</p>
    <p><b>Әлсіз дағды:</b> ${student.weakSkill || "Әлі анықталмады"}</p>
    <p><b>Қате саны:</b> ${student.mistakes || 0}</p>
  `;

  html += `<h4>Диагностика жауаптары</h4>`;
  html += renderAnswerGroup(diagnostic);

  html += `<h4>Практикалық тапсырма жауаптары</h4>`;
  html += renderAnswerGroup(tasks);

  box.innerHTML = html;
}

function renderAnswerGroup(group) {
  const entries = Object.entries(group || {});
  if (entries.length === 0) {
    return `<p>Жауаптар әлі сақталмаған.</p>`;
  }

  let html = "";

  entries.forEach(([key, item]) => {
    const color = item.status ? "#22c55e" : "#ef4444";
    const icon = item.status ? "✔" : "✘";

    html += `
      <div class="answer-card" style="border-left: 6px solid ${color};">
        <b>${key.toUpperCase()}. ${item.question}</b>
        <p><b>Оқушы жауабы:</b> ${item.user || "-"}</p>
        <p><b>Дұрыс жауап/талап:</b> ${item.correct}</p>
        <p style="color:${color}; font-weight:800;">${icon} ${item.status ? "Дұрыс" : "Қате"}</p>
      </div>
    `;
  });

  return html;
}

// =====================================================
// 16. РЕЙТИНГ
// =====================================================
function renderRanking(students) {
  const table = document.getElementById("rankingTable");
  if (!table) return;

  const sorted = [...students].sort((a, b) => {
    return calculateTotal(b.diagnostic, b.task) - calculateTotal(a.diagnostic, a.task);
  });

  table.innerHTML = "";

  if (sorted.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="4">Рейтинг әлі жоқ.</td>
      </tr>
    `;
    return;
  }

  sorted.forEach((student, index) => {
    const total = calculateTotal(student.diagnostic, student.task);

    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.class || "4-сынып"}</td>
        <td><b>${total}%</b></td>
      </tr>
    `;
  });
}

// =====================================================
// 17. ЕҢ ҚИЫН СҰРАҚТЫ АНЫҚТАУ
// =====================================================
function hardestQuestion() {
  const students = getStudents();
  let mistakes = {};

  students.forEach(student => {
    const groups = [student.diagnosticAnswers, student.answers];

    groups.forEach(group => {
      if (!group) return;

      Object.entries(group).forEach(([key, item]) => {
        if (!item.status) {
          mistakes[key] = (mistakes[key] || 0) + 1;
        }
      });
    });
  });

  const sorted = Object.entries(mistakes).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) return "Қате жоқ";

  const [key, count] = sorted[0];

  const allQuestions = {
    ...diagnosticQuestions,
    ...taskQuestions
  };

  return `${key.toUpperCase()} — ${allQuestions[key]?.question || "сұрақ"} (${count} қате)`;
}

// =====================================================
// 18. БАРЛЫҚ НӘТИЖЕНІ ТАЗАРТУ
// =====================================================
function clearAllResults() {
  const confirmDelete = confirm("Барлық оқушы нәтижелерін өшіруге сенімдісіз бе?");

  if (!confirmDelete) return;

  localStorage.removeItem("students");
  localStorage.removeItem("currentStudent");

  alert("Барлық нәтижелер тазартылды.");
  location.reload();
}
