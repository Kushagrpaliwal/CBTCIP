import React, { useContext, useEffect, useState } from 'react';
import { DeletedTasksContext } from './Todolist'; // Import the context
import { db, auth } from '@/constants/firebaseConfig';
import { collection, deleteDoc,doc,getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Completed = ({ setDeletedEntries }) => {
  const deletedEntries = useContext(DeletedTasksContext); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchDeletedEntries(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchDeletedEntries = async (uid) => {
    const querySnapshot = await getDeletedEntries(uid);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setDeletedEntries(data);
  };

  const getDeletedEntries = async (uid) => {
    const deletedTasksRef = collection(db, "deletedTask", uid, "entries");
    return await getDocs(deletedTasksRef);
  };

  const deletePermanently = async (id) => {
    try {
      await deleteDoc(doc(db, "deletedTask", user.uid, "entries", id));
      setDeletedEntries(prev => prev.filter(entry => entry.id !== id));  
    } catch(error) {
      alert(error);
      console.log(error);
    }
  };

  return (
    <div className='h-auto'>
      <h1 className="ml-[50px] font-bold text-3xl">Completed Tasks</h1>
      <div className="ml-[50px] w-[85%] h-auto mt-5 mb-[20px] p-5">
        {deletedEntries.map((entry) => (
          <div key={entry.id}>
            <div className="flex flex-row">
              <div className="w-full">
                <div className="text-lg">
                  {entry.textTitle}
                </div>
                <div className="text-sm">
                  {entry.textDes}
                </div>
              </div>
              <div>
                <button onClick={() => deletePermanently(entry.id)} className='text-xs rounded-lg p-2 bg-green1 drop-shadow-md hover:drop-shadow-xl text-white w-24'>
                  Delete Permanently
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

export default Completed;
