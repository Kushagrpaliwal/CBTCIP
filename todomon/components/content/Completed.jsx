import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { db, auth } from '../../constants/firebaseConfig';

const Completed = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchCompletedTasks(currentUser.uid); // Fetch tasks after user is set
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCompletedTasks = async (userId) => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, `completed/${userId}/entries`));
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCompletedTasks(tasks);
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (!user) return;
    const path = `completed/${user.uid}/entries/${id}`;
    try {
      console.log(`Attempting to delete document at path: ${path}`);
      await deleteDoc(doc(db, path));
      console.log('Document deleted successfully');
      setCompletedTasks(prev => prev.filter(task => task.id !== id)); // Remove from state
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return <div className="ml-[50px]">Loading...</div>;
  }

  return (
    <div className='h-[100%]'>
      <h1 className="ml-[50px] font-bold text-3xl">Completed Tasks</h1>
      <div className="ml-[50px] w-[85%] h-auto mt-5 mb-[20px] p-5  rounded-lg">
        {completedTasks.length > 0 ? (
          <ul>
            {completedTasks.map(task => (
              <li key={task.id} className="">
                <div className='flex flex-row'>
                  <div className='w-full'>
                    <div className="text-lg">{task.textTitle}</div>
                    <div className="text-sm text-gray-500">{task.textDes}</div>
                  </div>
                </div>
                <hr className="border-gray-300 mt-2 mb-2" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No completed tasks.</div>
        )}
      </div>
    </div>
  );
};

export default Completed;
