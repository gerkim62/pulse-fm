const currentPage = window.location.pathname
  .split("/")
  .pop()
  .replace(/\.html.*/, "");

import { initializeApp, firebase } from "firebase/app";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAT5pZt0ZbbpoZJ-76d3LQo9BH8ERt5rrI",
  authDomain: "radio-ffca1.firebaseapp.com",
  projectId: "radio-ffca1",
  storageBucket: "radio-ffca1.appspot.com",
  messagingSenderId: "659525009749",
  appId: "1:659525009749:web:a2ba24feb2a2e6b6e8efdc",
  measurementId: "G-VEMW9SD8X8",
};

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

//console.log(currentPage);

const announcementsContainer = document.getElementById(
  "announcements-container"
);

console.log(announcementsContainer);

if (currentPage === "upcoming-shows") {
  console.log("upcoming-shows");

  (async () => {
    const announcements = await getAnnouncements();
    console.log(announcements);
    announcements.forEach((announcement) => {
      const { date, time } = getDateAndTime(announcement.timestamp.seconds);

      const announcementElement = `<div class="alert alert-info" role="alert">
        <h4 class="alert-heading">${announcement.title}</h4>
        <p class="mb-0">${announcement.body} </p><p class="small text-muted mt-3">
        Posted on <span class="font-weight-bold" style="font-size: 0.8rem;">${date}</span> at 
        <span class="font-weight-bold" style="font-size: 0.8rem;">${time}</span>.
      </p>
      
      </div>`;
      announcementsContainer.innerHTML += announcementElement;
      console.log(announcement);
    });
  })();
}

if (currentPage === "presenter") {
  console.log("presenter");
}

if (currentPage === "prev-shows") {
  console.log("prev-shows");
}

async function getAnnouncements() {
  const db = getFirestore();
  const announcementsRef = collection(db, "announcements");
  const announcementsQuery = query(
    announcementsRef,
    orderBy("timestamp", "desc")
  );
  const announcementsSnapshot = await getDocs(announcementsQuery);
  const announcements = [];
  announcementsSnapshot.forEach((doc) => {
    announcements.push(doc.data());
  });
  return announcements;
}

function getDateAndTime(seconds) {
  const dateObj = new Date(seconds * 1000); // Convert seconds to milliseconds
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}
