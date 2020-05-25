import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import { auth, db, storage } from "../services/firebase";

const formatTime = (timestamp) => {
  const d = new Date(timestamp);
  const time = `${d.getDate()}/${(d.getMonth() + 1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
  return time;
}

const allInputs = { imgUrl: '' }

const Chat = () => {
  const [state, setState] = useState({
    user: auth.currentUser,
    content: '',
    readError: null,
    writeError: null,
    loadingChats: true
  });
  const [chats, setChats] = useState([]);
  const myRef = useRef(null);
  // const [imageAsFile, setImageAsFile] = useState('');
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  useEffect(() => {
    try {
      db.ref("chats").on("value", snapshot => {
        let chats = [];
        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });
        chats.sort((a, b) => a.timestamp - b.timestamp);
        setState({ ...state, loadingChats: false });
        setChats(chats);
        const chatArea = myRef.current;
        chatArea.scrollBy(0, chatArea.scrollHeight);
      });
    } catch (error) {
      setState({ ...state, readError: error.message, loadingChats: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (event) => {
    setState({
      ...state,
      content: event.target.value
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const chatArea = myRef.current;
    try {
      await db.ref("chats").push({
        content: state.content,
        timestamp: Date.now(),
        uid: state.user.uid
      });
      setState({ ...state, content: '', writeError: null });
      if (chatArea) chatArea.scrollBy(0, chatArea.scrollHeight);
    } catch (error) {
      setState({ ...state, writeError: error.message });
    }
  }

  const handleUpload = (event) => {
    const imageAsFile = event.target.files[0];
    const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile);
    uploadTask.on('state_changed',
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
        let uploadValue = snapShot.bytesTransferred / snapShot.totalBytes * 100;
        console.log(uploadValue);
      }, (err) => {
        //catches the errors
        console.log(err);
      }, () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage.ref('images').child(imageAsFile.name).getDownloadURL()
          .then(fireBaseUrl => {
            setImageAsUrl(prevObject => ({ ...prevObject, imgUrl: fireBaseUrl }))
          })
      });
  }

  return (
    <div>
      <Header />
      <div className="chat-area" ref={myRef}>
        {state.loadingChats ? <div className="spinner-border text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div> : ""}
        {chats.map(chat => {
          return <p key={chat.timestamp} className={"chat-bubble " + (state.user.uid === chat.uid ? "current-user" : "")}>
            {chat.content}
            <br />
            <span className="chat-time float-right">{formatTime(chat.timestamp)}</span>
          </p>
        })}
      </div>
      <form onSubmit={handleSubmit} className="mx-3">
        <textarea className="form-control" name="content" onChange={handleChange} value={state.content}></textarea>
        {state.error ? <p className="text-danger">{state.error}</p> : null}
        <button type="submit" className="btn btn-submit px-5 mt-4">Send</button>
      </form>
      <div>
        Test image upload<br />
        <input type="file" id="uploadBtn" onChange={handleUpload} />
        {imageAsUrl.imgUrl ? <img src={imageAsUrl.imgUrl} alt="upload" /> : null}
      </div>
      <div className="py-5 mx-3">
        Login in as: <strong className="text-info">{state.user.email}</strong>
      </div>
    </div>
  );
}

export default Chat;