// ===== Tabs =====
document.querySelectorAll(".tabbtn").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tabbtn").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
  });
});

const GRADES = [
  { label: "A+ (10)", value: 10 },
  { label: "A  (9)", value: 9 },
  { label: "B+ (8)", value: 8 },
  { label: "B  (7)", value: 7 },
  { label: "C+ (6)", value: 6 },
  { label: "C  (5)", value: 5 },
  { label: "D+ (4)", value: 4 },
  { label: "D  (3)", value: 3 },
  { label: "E+ (2)", value: 2 },
  { label: "E  (1)", value: 1 },
  { label: "F+ (0)", value: 0 },
];

function gradeOptions() {
  return GRADES.map((g) => `<option value="${g.value}">${g.label}</option>`).join("");
}

// ===== SGPA rows =====
const sgpaRows = document.getElementById("sgpa-rows");
let sgpaCount = 0;

function addSubjectRow() {
  sgpaCount++;
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${sgpaCount}</td>
    <td><input type="text" placeholder="e.g. Data Structures" class="subj-name"></td>
    <td><input type="number" min="0" max="10" value="4" class="subj-credit"></td>
    <td><select class="subj-grade">${gradeOptions()}</select></td>
    <td><button class="rmbtn"><i class="fa-solid fa-xmark"></i></button></td>
  `;
  tr.querySelector(".rmbtn").addEventListener("click", () => tr.remove());
  sgpaRows.appendChild(tr);
}

document.getElementById("add-subject").addEventListener("click", addSubjectRow);
for (let i = 0; i < 5; i++) addSubjectRow();

// Verdict bands, matching cusgpa.netlify.app's rating system
function getVerdict(gpa) {
  if (gpa <= 0) return { text: "Invalid", cls: "bad" };
  if (gpa <= 5.99) return { text: "Average", cls: "avg" };
  if (gpa <= 6.99) return { text: "Good", cls: "good" };
  if (gpa <= 7.99) return { text: "Very Good", cls: "good" };
  if (gpa <= 8.99) return { text: "Excellent", cls: "great" };
  return { text: "Outstanding", cls: "great" };
}

document.getElementById("calc-sgpa").addEventListener("click", () => {
  const rows = sgpaRows.querySelectorAll("tr");
  let totalCredits = 0, totalPoints = 0;
  rows.forEach((row) => {
    const credit = parseFloat(row.querySelector(".subj-credit").value) || 0;
    const grade = parseFloat(row.querySelector(".subj-grade").value);
    totalCredits += credit;
    totalPoints += credit * grade;
  });
  const sgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  const verdict = getVerdict(sgpa);
  document.getElementById("sgpa-value").textContent = sgpa.toFixed(2);
  document.getElementById("sgpa-verdict").textContent = verdict.text;
  document.getElementById("sgpa-verdict").className = "verdict " + verdict.cls;
  document.getElementById("sgpa-breakdown").textContent =
    `Total Credit: ${totalCredits} · Total Grade Points: ${totalPoints.toFixed(1)}`;
  document.getElementById("sgpa-result").classList.add("show");
});

// ===== CGPA rows =====
const cgpaRows = document.getElementById("cgpa-rows");
let cgpaCount = 0;

function addSemesterRow() {
  cgpaCount++;
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${cgpaCount}</td>
    <td><input type="text" value="Semester ${cgpaCount}" class="sem-name"></td>
    <td><input type="number" min="0" max="10" step="0.01" placeholder="e.g. 8.5" class="sem-sgpa"></td>
    <td><input type="number" min="1" max="30" value="22" class="sem-credit"></td>
    <td><button class="rmbtn"><i class="fa-solid fa-xmark"></i></button></td>
  `;
  tr.querySelector(".rmbtn").addEventListener("click", () => tr.remove());
  cgpaRows.appendChild(tr);
}

document.getElementById("add-semester").addEventListener("click", addSemesterRow);
for (let i = 0; i < 2; i++) addSemesterRow();

document.getElementById("calc-cgpa").addEventListener("click", () => {
  const rows = cgpaRows.querySelectorAll("tr");
  let totalCredits = 0, totalPoints = 0;
  rows.forEach((row) => {
    const sgpa = parseFloat(row.querySelector(".sem-sgpa").value) || 0;
    const credit = parseFloat(row.querySelector(".sem-credit").value) || 0;
    totalCredits += credit;
    totalPoints += sgpa * credit;
  });
  const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  const verdict = getVerdict(cgpa);
  document.getElementById("cgpa-value").textContent = cgpa.toFixed(2);
  document.getElementById("cgpa-verdict").textContent = verdict.text;
  document.getElementById("cgpa-verdict").className = "verdict " + verdict.cls;
  document.getElementById("cgpa-breakdown").textContent =
    `Total Credit across semesters: ${totalCredits} · Total Grade Points: ${totalPoints.toFixed(1)}`;
  document.getElementById("cgpa-result").classList.add("show");
});
