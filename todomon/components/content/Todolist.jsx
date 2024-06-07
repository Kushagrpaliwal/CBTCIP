"use client";

import { useState, useEffect, useRef} from "react";
import Image from 'next/image';
import { db, auth } from '@/constants/firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";


const Todolist = () => {
  const [textTitle, setTextTitle] = useState('');
  const [textDes, setTextDes] = useState('');
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const textareaRefTitle = useRef(null);
  const textareaRefDes = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchEntries(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEntries(user.uid);
    }
  }, [user]);

  const textareaHeight = (ref) => {
    const textarea = ref.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    textareaHeight(textareaRefTitle);
  }, [textTitle]);

  useEffect(() => {
    textareaHeight(textareaRefDes);
  }, [textDes]);

  const fetchEntries = async (uid) => {
    const q = query(collection(db, "todolist", uid, "entries"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEntries(data);
  };


  const handleChangeTitle = (e) => {
    setTextTitle(e.target.value);
  };

  const handleChangeDes = (e) => {
    setTextDes(e.target.value);
  };

  const newList = async () => {
    if (textTitle && textDes && user) {
      const newEntry = { textTitle, textDes };
      try {
        const docRef = await addDoc(collection(db, "todolist", user.uid, "entries"), newEntry);
        setEntries([...entries, { id: docRef.id, ...newEntry }]);
        setTextTitle('');
        setTextDes('');
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }
  };

  const resetForm = () => {
    setTextTitle('');
    setTextDes('');
  };

  const deleteItems = async (id) => {
    try {
      const deleteEntry = entries.find(entry => entry.id === id);
      await deleteDoc(doc(db, "todolist", user.uid, "entries", id));
      await addDoc(collection(db,"completed",user.uid ,"entries"),deleteEntry)
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  return (
    <div className="h-auto">
      <h1 className="ml-[50px] font-bold text-3xl">
        TodoList
      </h1>
      <div className="ml-[50px] h-auto w-[85%] border border-gray-300 rounded-xl mt-3 p-5">
        <textarea
          type="text"
          id="title"
          placeholder="Title"
          className="border-none focus:outline-none w-full text-lg resize-none overflow-hidden"
          value={textTitle}
          ref={textareaRefTitle}
          onChange={handleChangeTitle}
          onInput={() => textareaHeight(textareaRefTitle)}
          rows={1}
        />
        <textarea
          type="text"
          id="description"
          placeholder="Description"
          className="border-none focus:outline-none w-full text-sm resize-none overflow-hidden"
          value={textDes}
          ref={textareaRefDes}
          onChange={handleChangeDes}
          onInput={() => textareaHeight(textareaRefDes)}
          rows={1}
        />
        <div className="w-full mt-5">
          <button className="p-2 bg-green1 w-[60px] h-[35px] text-center text-sm rounded-lg text-white mr-2" onClick={newList}>Add</button>
          <button className="p-2 bg-gray-100 w-[60px] h-[35px] text-center text-sm rounded-lg text-black mr-2" onClick={resetForm}>Reset</button>
        </div>
      </div>

      <div className="w-[85%] h-auto mt-5 ml-[50px] mb-[20px] p-5">
        {entries.map((entry) => (
          <div key={entry.id}>
            <div className="flex flex-row">
              <div className="w-full">
                <div className="text-lg">
                  {entry.textTitle}
                </div>
                <div className="text-sm text-gray-500">
                  {entry.textDes}
                </div>
              </div>
              <div>
                <button onClick={() => deleteItems(entry.id)}>
                  <Image src="/del.svg" alt="delete" width={20} height={20} />
                </button>
              </div>
            </div>
            <hr className="border-gray-300 mt-2 mb-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todolist;
