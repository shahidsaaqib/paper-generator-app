// �9�7 Firebase references
const auth = firebase.auth();
const database = firebase.database();

// �9�4 Elements
const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");
const uploadSection = document.getElementById("upload-section");
const loginSection = document.getElementById("login-section");
const logoutSection = document.getElementById("logout-section");
const csvFileInput = document.getElementById("csv-file");
const uploadBtn = document.getElementById("upload-btn");
const generateBtn = document.getElementById("generate-btn");
const chapterSelect = document.getElementById("chapter-select");
const paperOutput = document.getElementById("paper-output");

// �7�3 �1�4�1�2�1�0�1�9 �1�8�1�9�1�5 �1�9�1�0�1�0 �1�3�1�2 �1�2�1�2 upload �1�2�1�9�1�8�1�9 �1�1�1�4�1�9�1�2�1�0 �1�7�1�9�1�0�1�9�1�8�1�4�1�6
auth.onAuthStateChanged((user) => {
  if (user) {
    loginSection.style.display = "none";
    logoutSection.style.display = "block";
    uploadSection.style.display = "block";
  } else {
    loginSection.style.display = "block";
    logoutSection.style.display = "none";
    uploadSection.style.display = "none";
  }
});

// �9�6 �1�8�1�9�1�5 �1�9�1�0�1�0 �1�9�1�9�1�4�1�6
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm["email"].value;
  const password = loginForm["password"].value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("�1�8�1�9�1�5 �1�9�1�0�1�0 �1�9�1�9�1�9�1�4�1�9�1�0!");
      loginForm.reset();
    })
    .catch((error) => {
      alert("�1�8�1�9�1�5 �1�9�1�0�1�0 �1�0�1�9�1�9�1�9�1�9: " + error.message);
    });
});

// �0�6 �1�8�1�9�1�5 �1�4�1�6�1�1
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    alert("�1�4�1�6 �1�8�1�9�1�5 �1�4�1�6�1�1 �1�3�1�2 �1�5�1�8�1�0 �1�3�1�4�1�6�1�2");
  });
});

// �9�2 CSV �1�9�1�6�1�8�1�2�1�6 �� JSON �� Firebase
uploadBtn.addEventListener("click", () => {
  const file = csvFileInput.files[0];
  if (!file) {
    alert("�1�0�1�9�1�9�1�3 �1�9�1�9�1�9 CSV �1�5�1�9�1�8�1�8 �1�9�1�0�1�2�1�6�1�0 �1�9�1�9�1�4�1�6");
    return;
  }

  Papa.parse(file, {
    header: true,
    complete: function(results) {
      const questions = results.data;

      // �9�4 �1�3�1�9 �1�1�1�2�1�9�1�8 �1�9�1�2 Firebase �1�9�1�4�1�6 upload �1�9�1�9�1�4�1�6
      questions.forEach((q, index) => {
        if (q.question && q.type && q.chapter) {
          const newRef = database.ref("questions").push();
          newRef.set({
            class: q.class || "",
            subject: q.subject || "",
            chapter: q.chapter,
            type: q.type,
            question: q.question,
            option1: q.option1 || "",
            option2: q.option2 || "",
            option3: q.option3 || "",
            option4: q.option4 || ""
          });
        }
      });

      alert("�1�2�1�9�1�9�1�9 �1�1�1�2�1�9�1�8�1�9�1�2 Firebase �1�9�1�4�1�6 �1�9�1�5�1�5�1�2�1�6 �1�3�1�2 �1�5�1�8�1�0!");
    }
  });
});

// �9�0 �1�6�1�4�1�6�1�9 �1�4�1�0�1�9�1�4�1�1 �1�9�1�9�1�4�1�6
generateBtn.addEventListener("click", () => {
  const selectedChapter = chapterSelect.value;
  const selectedType = document.querySelector('input[name="type"]:checked').value;

  // �9�6 Realtime Database �� Filter questions
  database.ref("questions").orderByChild("chapter").equalTo(selectedChapter).once("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      paperOutput.innerHTML = "<p>�1�9�1�1 �1�0�1�9�1�0 �1�1�1�0 �1�9�1�2�1�7�1�8�1�6 �1�9�1�2�1�8�1�4 �1�1�1�2�1�9�1�8 �1�7�1�1�1�2�1�4�1�9�1�0 �1�0�1�3�1�4�1�6�1�2</p>";
      return;
    }

    let output = "<h3>�1�9�1�0�1�2�1�6�1�0 �1�1�1�2�1�9�1�8�1�9�1�2</h3><ol>";
    Object.values(data).forEach((q) => {
      if (q.type === selectedType) {
        output += `<li>${q.question}`;
        if (q.type === "mcq") {
          output += `<ul>
            <li>${q.option1}</li>
            <li>${q.option2}</li>
            <li>${q.option3}</li>
            <li>${q.option4}</li>
          </ul>`;
        }
        output += "</li>";
      }
    });
    output += "</ol>";
    paperOutput.innerHTML = output;
  }, (error) => {
    paperOutput.innerHTML = "<p>�1�6�1�4�1�1�1�9 �1�5�1�9�1�3�1�8 �1�9�1�9�1�0�1�0 �1�9�1�4�1�6 �1�9�1�1�1�8�1�8�1�3 �1�6�1�4�1�2 �1�4�1�4�1�9!</p>";
    console.error(error);
  });
});

// �9�4 �1�4�1�5 �1�8�1�9�1�8�1�0 �1�4�1�4�1�9 �1�9�1�9�1�4�1�6
function checkOnlineStatus() {
  if (!navigator.onLine) {
    alert("�1�4�1�6 �1�4�1�5 �1�8�1�9�1�8�1�0 �1�3�1�4�1�6�1�2 Firebase �1�1�1�0 �1�6�1�4�1�1�1�9 �1�5�1�9�1�3�1�8 �1�0�1�3�1�4�1�6 �1�3�1�2 �1�1�1�9�1�2�1�9");
  }
}

window.addEventListener("load", checkOnlineStatus);
window.addEventListener("online", () => alert("�1�4�1�6 �1�7�1�2�1�0�1�9�1�9�1�3 �1�4�1�0 �1�8�1�9�1�8�1�0 �1�3�1�2 �1�5�1�8�1�0 �1�3�1�4�1�6"));
window.addEventListener("offline", () => alert("�1�4�1�6 �1�4�1�5 �1�8�1�9�1�8�1�0 �1�3�1�2 �1�5�1�8�1�0 �1�3�1�4�1�6"));








