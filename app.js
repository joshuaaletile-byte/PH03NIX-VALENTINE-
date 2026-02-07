import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------------- AUTH ---------------- */

window.register = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  await createUserWithEmailAndPassword(auth, email, password);
};

window.login = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  await signInWithEmailAndPassword(auth, email, password);
};

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    loadReplies();
  }
});

/* ---------------- SEND VALENTINE ---------------- */

window.sendValentine = async () => {
  const girl = girlName.value;
  const message = loveMessage.value;

  const docRef = await addDoc(collection(db, "valentines"), {
    boy: auth.currentUser.email,
    girl,
    message,
    reply: "pending"
  });

  const link = `${location.origin}?id=${docRef.id}`;
  shareLink.value = link;
};

/* ---------------- GIRL REPLY ---------------- */

async function handleReply(choice) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  await updateDoc(doc(db, "valentines", id), {
    reply: choice
  });

  alert("Reply sent 💖");
}

window.sayYes = () => handleReply("YES ❤️");
window.sayNo = () => handleReply("NO 💔");

/* ---------------- DASHBOARD ---------------- */

async function loadReplies() {
  const q = query(
    collection(db, "valentines"),
    where("boy", "==", auth.currentUser.email)
  );

  const snap = await getDocs(q);
  replies.innerHTML = "";

  snap.forEach(docu => {
    const d = docu.data();
    replies.innerHTML += `
      <div class="reply-card">
        <b>${d.girl}</b><br>
        ${d.message}<br>
        <span>${d.reply}</span>
      </div>
    `;
  });
}
