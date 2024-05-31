"use client";

import { useState, useEffect, useRef } from "react"


const Todolist = () => {

  const [textTitle, SetTextTitle] = useState('');
  const [textDes, SetTextDes] = useState('');
  const [entries, Setentries] = useState([]);

  const textareaRefTitle = useRef(null)
  const textareaRefDes = useRef(null)

  useEffect(() => {
    textareaheight(textareaRefTitle);
  }, [textTitle])

  useEffect(() => {
    textareaheight(textareaRefDes);
  }, [textDes])

  const textareaheight = (ref) => {
    const textarea = ref.current;

    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  function handlechangetitle(e) {
    SetTextTitle(e.target.value)
  }
  function handlechangedes(e) {
    SetTextDes(e.target.value)
  }
  function newlist() {
    if (textTitle && textDes) {
      Setentries([...entries, { textTitle, textDes }])
      SetTextTitle('')
      SetTextDes('')
    }
  }
  function resetform() {
    SetTextTitle('');
    SetTextDes('');
  }

  return (
    <div className="h-auto">
      <h1 className="ml-[50px] font-bold text-3xl">
        TodoList
      </h1>
      <div className="ml-[50px] h-auto w-[85%] border border-gray-300  rounded-xl mt-3 p-5">
        <textarea
          type="text"
          id="title"
          placeholder="Title"
          className="border-none focus:outline-none w-full text-lg resize-none overflow-hidden"
          value={textTitle}
          ref={textareaRefTitle}
          onChange={handlechangetitle}
          onInput={() => textareaheight(textareaRefTitle)}
          rows={1} />
        <textarea
          type="text"
          id="description"
          placeholder="Description"
          className="border-none focus:outline-none w-full text-sm resize-none overflow-hidden"
          value={textDes}
          ref={textareaRefDes}
          onChange={handlechangedes}
          onInput={() => textareaheight(textareaRefDes)}
          rows={1}
        />
        <div className="w-full mt-5">
          <button className="p-2 bg-green1 w-[60px] h-[35px] text-center text-sm rounded-lg text-white mr-2 " onClick={newlist}>Add</button>
          <button className="p-2 bg-gray-100 w-[60px] h-[35px] text-center text-sm rounded-lg text-black mr-2" onClick={resetform}>Reset</button>
        </div>
      </div>

      <div className=" w-[85%] h-auto mt-5 ml-[50px] mb-[20px] p-5">
      {entries.map((entry,index)=>(
            <div key={index}>
                <div className="text-lg ">
                  {entry.textTitle}
                </div>
                <div className="text-sm">
                  {entry.textDes}
                </div>
                <hr className="border-gray-300 mt-2 mb-2" />
            </div>
          ))}
      </div>
    </div>
  )
}


export default Todolist