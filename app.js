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

/* AUTH */

window.register = async () => {
  await createUserWithEmailAndPassword(
    auth,
    emailInput.value,
    passwordInput.value
  );
};

window.login = async () => {
  await signInWithEmailAndPassword(
    auth,
    emailInput.value,
    passwordInput.value
  );
};

onAuthStateChanged(auth, user => {
  if (user) {
    auth.style.display = "none";
    dashboard.style.display = "block";
    loadReplies();
  }
});

/* SEND VALENTINE */

window.sendValentine = async () => {
  const ref = await addDoc(collection(db, "valentines"), {
    boy: auth.currentUser.email,
    girl: girlName.value,
    message: loveMessage.value,
    reply: "Pending 💭"
  });

  const link = `${location.origin}?id=${ref.id}`;
  shareLink.value = link;

  waShare.href =
    "https://wa.me/?text=" +
    encodeURIComponent("💖 Someone sent you a Valentine 💖\n" + link);
};

/* REPLY */

async function handleReply(choice) {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  await updateDoc(doc(db, "valentines", id), { reply: choice });
  alert("Reply sent 💖");
}

window.sayYes = async () => {
  confetti({
    particleCount: 160,
    spread: 100,
    origin: { y: 0.6 }
  });

  await handleReply("YES ❤️");
};

window.sayNo = () => handleReply("NO 💔");

/* DASHBOARD */

async function loadReplies() {
  replies.innerHTML = "";

  const q = query(
    collection(db, "valentines"),
    where("boy", "==", auth.currentUser.email)
  );

  const snap = await getDocs(q);

  snap.forEach(d => {
    const v = d.data();
    replies.innerHTML += `
      <div class="reply-card">
        <b>${v.girl}</b><br>
        ${v.message}<br>
        <span>${v.reply}</span>
      </div>
    `;
  });
}
