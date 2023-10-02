import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  push,
  update,
  ref,
  set,
  onValue,
  child,
} from "firebase/database";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import Message from "./components/Message";

function App() {
  const [database, setDatabase] = useState(null);
  const [comments, setComments] = useState({});
  const [input, setInput] = useState("");
  const [voted, setVoted] = useState({});
  const [user, setUser] = useState({});
  const [timestamp, setTimestmp] = useState(null);

  useEffect(() => {
    const env = import.meta.env;
    console.log(env.DATABASE_URL);
    const firebaseConfig = {
      apiKey: env.VITE_API_KEY,
      authDomain: env.VITE_AUTH_DOMAIN,
      projectId: env.VITE_PROJECT_ID,
      storageBucket: env.VITE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_MESSAGING_SENDER_ID,
      appId: env.VITE_APP_ID,
      measurementId: env.VITE_MEASUREMENT_ID,
      databaseURL: env.VITE_DATABASE_URL,
    };

    // realtime database stuff
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    setDatabase(db);

    const commentRef = ref(db, "comments/");
    onValue(commentRef, (snapshot) => {
      const data = snapshot.val();
      setComments(data);
    });

    // authentication stuff
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user_ = result.user;

        const userRef = ref(db, "users/" + urlSafeBase64Encode(user_.email));
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            setVoted(data);
          } else {
            setVoted({});
          }
        });
        setUser(user_);

        const timestampRef = ref(
          db,
          "timestamp/" + urlSafeBase64Encode(user_.email)
        );
        onValue(timestampRef, (snapshot) => {
          const data = snapshot.val();
          setTimestmp(data);
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
        alert("Please refresh to try again");
      });
  }, []);

  const addComment = (author, text) => {
    if (Math.floor(Date.now() / 1000) - timestamp < 60) return;
    const commentRef = ref(database, "comments");
    const newCommentRef = push(commentRef);
    set(newCommentRef, {
      author,
      text,
      ups: 0,
      downs: 0,
    });
    const timestampRef = ref(database, "timestamp");
    const newTimestampRef = child(
      timestampRef,
      urlSafeBase64Encode(user.email)
    );
    set(newTimestampRef, Math.floor(Date.now() / 1000));
  };

  const updateVoted = (id, val) => {
    console.log(urlSafeBase64Encode(user.email));
    if (user.email !== undefined) {
      const userRef = ref(database, "users/" + urlSafeBase64Encode(user.email));
      const newUserRef = child(userRef, id);
      set(newUserRef, val);
    }
  };

  const upCount = (id) => {
    console.log(voted);
    if (voted[id] === 1) return;
    if (user.email === undefined) return;
    const prev = comments[id].ups;
    const ref_ = ref(database, "comments/" + id);
    if (voted[id] === undefined) {
      updateVoted(id, 1);
      update(ref_, { ups: prev + 1 });
      return;
    }
    updateVoted(id, voted[id] + 1);
    update(ref_, { ups: prev + 1 });
  };

  const downCount = (id) => {
    console.log(voted);
    if (voted[id] === -1) return;
    if (user.email === undefined) return;
    const prev = comments[id].downs;
    const ref_ = ref(database, "comments/" + id);
    if (voted[id] === undefined) {
      updateVoted(id, -1);
      update(ref_, { downs: prev + 1 });
      return;
    }
    updateVoted(id, voted[id] - 1);
    update(ref_, { downs: prev + 1 });
  };

  const urlSafeBase64Encode = (str) => {
    const base64 = btoa(str);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  };

  const urlSafeBase64Decode = (encodedStr) => {
    const padding = "=".repeat((4 - (encodedStr.length % 4)) % 4);
    const base64 = (encodedStr + padding).replace(/-/g, "+").replace(/_/g, "/");
    return atob(base64);
  };

  const handleKeyPress = (key) => {
    if (key.code === "Enter") {
      addComment(user.displayName, input);
      setInput("");
    }
  };

  return (
    <div className="mx-3 flex flex-col h-screen justify-between">
      <div className="overflow-y-auto">
        {Object.keys(comments === null ? {} : comments).map((c, index) => (
          <Message
            key={index}
            id={c}
            author={comments[c].author}
            text={comments[c].text}
            ups={comments[c].ups}
            downs={comments[c].downs}
            upCount={upCount}
            downCount={downCount}
          />
        ))}
      </div>
      <div className="flex mb-3">
        <input
          onKeyDown={handleKeyPress}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="border-2 border-black rounded-md p-2 w-full"
        />
        <button
          onClick={() => {
            addComment(user.displayName, input);
            setInput("");
          }}
          className="border-2 border-gray-800 rounded-md px-3 ml-2"
        >
          send
        </button>
      </div>
    </div>
  );
}

export default App;
