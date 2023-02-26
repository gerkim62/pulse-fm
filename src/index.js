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
  console.log("prev-shows 2");
  const showsUl = document.getElementById("shows-ul");
  console.log(showsUl);
  (async () => {
    const shows = await getShows();
    console.log(shows);
    shows.forEach((show) => {
      const { date, time } = getDateAndTime(show.timestamp.seconds);

      const showElement = `<li class="card d-flex flex-column mb-3">
      <div class="card-body flex-md-row d-flex flex-column justify-content-between">
        <div class="text-center d-md-flex flex-md-row align-items-center">
          <h5 class="card-title mb-md-0 mb-3 mr-2 text-center text-md-left">
           ${show.title}
          </h5>
          <p class="card-text mb-0">Presenter: <b>${show.presenter}</b></p>
          <p class="small text-muted mt-3">
        Posted on <span class="font-weight-bold" style="font-size: 0.8rem;">${date}</span> at 
        <span class="font-weight-bold" style="font-size: 0.8rem;">${time}</span>.
        </div>
        <div class="d-flex justify-content-around align-items-center mt-3 ml-3">
          <a href="${show.audioUrl}" class="btn btn-primary mr-2">
            <i class="fas fa-play" style="font-family: Poppins, &quot;Font Awesome 5 Free&quot;;"></i> Play
          </a>
          <a hidden href="#" class="btn btn-secondary btn-outline-primary">
            <i class="fas fa-download" style="font-family: Poppins, &quot;Font Awesome 5 Free&quot;;"></i> Download
          </a>
        </div>
      </div>
    </li>`;
      showsUl.innerHTML += showElement;
      console.log(show);
    });
  })();
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

async function getShows() {
  console.log("getShows");
  const db = getFirestore();
  const showsRef = collection(db, "shows");
  const showsQuery = query(showsRef, orderBy("timestamp", "desc"));
  const showsSnapshot = await getDocs(showsQuery);
  const shows = [];
  showsSnapshot.forEach((doc) => {
    shows.push(doc.data());
  });
  return shows;
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
