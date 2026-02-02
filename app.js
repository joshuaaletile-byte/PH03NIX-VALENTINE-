import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// SIGN UP
window.signup = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => location.href = "dashboard.html")
    .catch(err => alert(err.message));
};

// LOGIN
window.login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => location.href = "dashboard.html")
    .catch(err => alert(err.message));
};

// CREATE VALENTINE
window.createValentine = async () => {
  if (!auth.currentUser) return;
  await addDoc(collection(db, "valentines"), {
    uid: auth.currentUser.uid,
    girl: girlName.value,
    message: message.value,
    response: "Pending"
  });
  girlName.value = "";
  message.value = "";
  loadValentines();
};

// LOAD DASHBOARD
async function loadValentines() {
  if (!auth.currentUser || !document.getElementById("valentines")) return;

  const q = query(
    collection(db, "valentines"),
    where("uid", "==", auth.currentUser.uid)
  );

  const snap = await getDocs(q);
  valentines.innerHTML = "";

  snap.forEach(docu => {
    const d = docu.data();
    const link = `${location.origin}${location.pathname.replace("dashboard.html","")}valentine.html?id=${docu.id}`;
    valentines.innerHTML += `
      <p>
        <b>${d.girl}</b><br>
        ${d.response}<br>
        <a href="https://wa.me/?text=${encodeURIComponent("Hey 💖 I have something special for you:\n" + link)}" target="_blank">
          Share on WhatsApp
        </a>
      </p>
    `;
  });
}

// GIRL RESPONSE
window.respond = async (answer) => {
  const id = new URLSearchParams(location.search).get("id");
  await updateDoc(doc(db, "valentines", id), {
    response: answer
  });
  alert("Response sent ❤️");
};

// THEME
window.toggleTheme = () => {
  document.body.classList.toggle("dark");
};

// AUTO LOAD
onAuthStateChanged(auth, user => {
  if (user) loadValentines();
});

// LOAD VALENTINE PAGE
(async () => {
  const id = new URLSearchParams(location.search).get("id");
  if (!id || !document.getElementById("title")) return;

  const snap = await getDocs(collection(db, "valentines"));
  snap.forEach(docu => {
    if (docu.id === id) {
      title.innerText = `Dear ${docu.data().girl} 💌`;
      text.innerText = docu.data().message;
    }
  });
})();
