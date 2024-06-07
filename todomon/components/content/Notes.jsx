import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { db, auth } from '@/constants/firebaseConfig';
import { collection, addDoc, getDocs, doc, query, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Notes = () => {
  const [textTitle, setTextTitle] = useState('');
  const textareaRefTitle = useRef(null);
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [expandedNoteId, setExpandedNoteId] = useState(null); // State to keep track of expanded note

  useEffect(() => {
    textareaHeight(textareaRefTitle);
  }, [textTitle]);

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

  const handleChangeTitle = (e) => {
    setTextTitle(e.target.value);
  };

  const textareaHeight = (ref) => {
    const textarea = ref.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const newList = async () => {
    if (textTitle && user) {
      const newEntry = { textTitle };
      try {
        const docRef = await addDoc(collection(db, "notes", user.uid, "entries"), newEntry);
        setEntries([...entries, { id: docRef.id, ...newEntry }]);
        setTextTitle('');
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }
  };

  const fetchEntries = async (uid) => {
    const q = query(collection(db, "notes", uid, "entries"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEntries(data);
  };

  const resetForm = () => {
    setTextTitle('');
  };

  const deleteItems = async (id) => {
    try {
      await deleteDoc(doc(db, "notes", user.uid, "entries", id));
      setEntries(prev => prev.filter(entry => entry.id !== id));
      setExpandedNoteId(null); // Close expanded note after deletion
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedNoteId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className='ml-[50px] h-[100%]'>
      <h1 className=" font-bold text-3xl">Notes</h1>
      <div className=" w-[50%] h-auto mt-5 mb-[20px] p-5 bg-white border-gray-300 drop-shadow-lg rounded-xl ">
        <div className="">
          <textarea
            type="text"
            id="title"
            placeholder="Make a note..."
            className="border-none focus:outline-none w-full text-lg resize-none overflow-hidden"
            value={textTitle}
            ref={textareaRefTitle}
            onChange={handleChangeTitle}
            onInput={() => textareaHeight(textareaRefTitle)}
            rows={1}
          />
        </div>
        <div className="w-full mt-5">
          <button className="p-2 bg-green1 w-[60px] h-[35px] text-center text-sm rounded-lg text-white mr-2" onClick={newList}>Add</button>
          <button className="p-2 bg-gray-100 w-[60px] h-[35px] text-center text-sm rounded-lg text-black mr-2" onClick={resetForm}>Reset</button>
        </div>
      </div>
      <div className="flex flex-wrap mt-8 ">
        {entries.map((entry) => (
          <div key={entry.id} className={`w-[25%] m-2 p-4 rounded-lg border border-gray-300 ${expandedNoteId === entry.id ? 'h-auto' : 'h-[50px] overflow-hidden'}`} onClick={() => toggleExpand(entry.id)}>
            <p>{entry.textTitle}</p>
            {expandedNoteId === entry.id && ( // Render delete button only if note is expanded
              <button onClick={(e) => { e.stopPropagation(); deleteItems(entry.id); }} className="p-2 bg-green1 text-xs text-white rounded-lg mt-2">
                  Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notes;
