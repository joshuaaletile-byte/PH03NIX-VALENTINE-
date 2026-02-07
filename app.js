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

/* ================= AUTH ================= */

window.register = async () => {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert(err.message);
  }
};

window.login = async () => {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert(err.message);
  }
};

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    loadReplies();
  }
});

/* ================= SEND VALENTINE ================= */

window.sendValentine = async () => {
  const girl = document.getElementById("girlName").value;
  const message = document.getElementById("loveMessage").value;

  if (!girl || !message) {
    alert("Please fill all fields 💖");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "valentines"), {
      boy: auth.currentUser.email,
      girl: girl,
      message: message,
      reply: "Pending 💭"
    });

    const link = `${location.origin}?id=${docRef.id}`;

    const shareLink = document.getElementById("shareLink");
    shareLink.value = link;

    // ✅ FIXED WHATSAPP SHARE
    const wa = document.getElementById("waShare");
    wa.href =
      "https://wa.me/?text=" +
      encodeURIComponent("💖 Someone sent you a Valentine 💖\n" + link);

    alert("Valentine sent 💌");

  } catch (err) {
    alert(err.message);
  }
};

/* ================= GIRL REPLY ================= */

async function handleReply(choice) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  try {
    await updateDoc(doc(db, "valentines", id), {
      reply: choice
    });

    alert("Reply sent 💖 Thank you!");
  } catch (err) {
    alert(err.message);
  }
}

window.sayYes = () => handleReply("YES ❤️");
window.sayNo = () => handleReply("NO 💔");

/* ================= DASHBOARD ================= */

async function loadReplies() {
  const replies = document.getElementById("replies");
  replies.innerHTML = "";

  const q = query(
    collection(db, "valentines"),
    where("boy", "==", auth.currentUser.email)
  );

  const snap = await getDocs(q);

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
