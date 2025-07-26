// 🔥 Firebase references
const auth = firebase.auth();
const database = firebase.database();

// 🌐 Elements
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

// ✅ یوزر لاگ اِن ہو تو upload والا سیکشن دکھائیں
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

// 🔐 لاگ اِن کریں
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm["email"].value;
  const password = loginForm["password"].value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("لاگ اِن کامیاب!");
      loginForm.reset();
    })
    .catch((error) => {
      alert("لاگ اِن ناکام: " + error.message);
    });
});

// 🚪 لاگ آؤٹ
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    alert("آپ لاگ آؤٹ ہو گئے ہیں۔");
  });
});

// 📤 CSV اپلوڈ → JSON → Firebase
uploadBtn.addEventListener("click", () => {
  const file = csvFileInput.files[0];
  if (!file) {
    alert("براہ کرم CSV فائل منتخب کریں");
    return;
  }

  Papa.parse(file, {
    header: true,
    complete: function(results) {
      const questions = results.data;

      // 🔄 ہر سوال کو Firebase میں upload کریں
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

      alert("تمام سوالات Firebase میں محفوظ ہو گئے!");
    }
  });
});

// 📄 پیپر جنریٹ کریں
generateBtn.addEventListener("click", () => {
  const selectedChapter = chapterSelect.value;
  const selectedType = document.querySelector('input[name="type"]:checked').value;

  // 🔐 Realtime Database → Filter questions
  database.ref("questions").orderByChild("chapter").equalTo(selectedChapter).once("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      paperOutput.innerHTML = "<p>اس باب سے متعلق کوئی سوال دستیاب نہیں۔</p>";
      return;
    }

    let output = "<h3>منتخب سوالات</h3><ol>";
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
    paperOutput.innerHTML = "<p>ڈیٹا حاصل کرنے میں مسئلہ پیش آیا!</p>";
    console.error(error);
  });
});

// 🌐 آف لائن چیک کریں
function checkOnlineStatus() {
  if (!navigator.onLine) {
    alert("آپ آف لائن ہیں، Firebase سے ڈیٹا حاصل نہیں ہو سکتا");
  }
}

window.addEventListener("load", checkOnlineStatus);
window.addEventListener("online", () => alert("آپ دوبارہ آن لائن ہو گئے ہیں"));
window.addEventListener("offline", () => alert("آپ آف لائن ہو گئے ہیں"));








