import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";


function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(true)
  

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if(todoString){

      let todos = JSON.parse(localStorage.getItem("todos"))
      setTodos(todos)
    }
  }, [])
  

  const saveToLs = (params) => {
    localStorage.setItem("todos",JSON.stringify(todos))
  }
  
  const toggleFinished = (e) => {
    setshowFinished(!showFinished)
  }
  

  const handleEdit = (e, id) => {
    let t=todos.filter(i=>i.id === id)
    setTodo(t[0].todo)
    let newTodos = todos.filter(item => {
      return item.id !== id
    });
    setTodos(newTodos)
    saveToLs()
  }
  const handleDelete = (e, id) => {
    let index = todos.findIndex(item => {
      return item.id === id;
    })
    let newTodos = todos.filter(item => {
      return item.id !== id
    });
    setTodos(newTodos)
    saveToLs()
  }

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
    setTodo("")
    console.log(todos)
    saveToLs()
  }
  const handleChange = (e) => {
    setTodo(e.target.value)
    saveToLs()
  }

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id;
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos)
  }


  return (
    <>
      <Navbar />
      <div className="opacity-100 md:container mx-3 md:mx-auto my-5 rounded-xl p-5 bg-violet-400 min-h-[80vh] md:w-1/2">
        <h1 className='font-bold text-center text-xl'>Manage Your ToDos at one place!!</h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-lg font-bold'>Add a Todo :</h2>
          <input onChange={handleChange} value={todo} type="text" className='w-full p-1 rounded-lg px-2' />
          <button onClick={handleAdd} disabled={todo.length<=3} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 disabled:bg-violet-950 text-sm font-bold text-white rounded-md cursor-pointer '>Save</button>
        </div>
        <input className='my-5' onChange={toggleFinished} type="checkbox" checked={showFinished} /> Show Finished
        <div className='h-[1.5px] bg-black opacity-15 my-3'></div>
        <h2 className='text-lg font-bold'>Your ToDos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No ToDos to Display</div>}
          {todos.map(item => {
            return (showFinished || !item.isCompleted) && <div key={item.id} className="todo flex items-center justify-between md:w-1/2 my-3">
              <div className='flex gap-5'>
                <input onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} name={item.id} id="" />
                <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
              </div>
              <div className="buttons flex h-full">
                <button onClick={(e)=>{handleEdit(e, item.id)}} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md m-1'><FaEdit /></button>
                <button onClick={(e) => { handleDelete(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md m-1'><MdDeleteForever /></button>
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default App
