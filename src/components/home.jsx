import React from 'react'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const[message,setMessage]=useState()
    const navigate = useNavigate()

     useEffect(() => {
       axios.get('http://localhost:5000/home')
      .then(res=> {
         if(res.data.valid){
             setMessage(res.data.message)
         }
         else{
             navigate('/')
         }
       })
       .catch(err =>console.log(err))
     })
    
    const [todo, setTodo] = useState("")
    const [todos, setTodos] = useState([])
    const [showFinished, setshowFinished] = useState(true)
    useEffect(() => {
      fetchTodos();
    }, []);
  
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/todos');
        setTodos(response.data);
      } catch (error) {
        console.error("There was an error fetching the todos!", error);
      }
    };
  
    const saveToDb = async (newTodos) => {
      setTodos(newTodos);
      await axios.post('http://localhost:5000/todos', newTodos[newTodos.length - 1]);
    };
  
    const toggleFinished = (e) => {
      setshowFinished(!showFinished)
    }
  
  
    const handleEdit = (e, id) => {
      const t = todos.find(i => i.id === id);
      setTodo(t.todo);
      const newTodos = todos.filter(item => item.id !== id);
      setTodos(newTodos);
      axios.put(`http://localhost:5000/todos/${id}`, { todo });
    };
  
    const handleDelete = async (e, id) => {
      const newTodos = todos.filter(item => item.id !== id);
      setTodos(newTodos);
      await axios.delete(`http://localhost:5000/todos/${id}`);
    };
  
  
    const handleAdd = async () => {
      const newTodo = { id: uuidv4(), todo, isCompleted: false };
      const newTodos = [...todos, newTodo];
      await saveToDb(newTodos);
      setTodo("");
    };
  
    const handleChange = (e) => {
      setTodo(e.target.value)
    }
  
    const handleCheckbox = async (e) => {
      const id = e.target.name;
      const index = todos.findIndex(item => item.id === id);
      const newTodos = [...todos];
      newTodos[index].isCompleted = !newTodos[index].isCompleted;
      setTodos(newTodos);
      await axios.put(`http://localhost:5000/todos/${id}`, newTodos[index]);
    };

  return (
    <>

    
          <div className="opacity-100 md:container mx-3 md:mx-auto my-5 rounded-xl p-5 bg-violet-400 min-h-[80vh] md:w-1/2">
            <h1 className='font-bold text-center text-xl'>Manage Your ToDos at one place!!</h1>
            <div className="addTodo my-5 flex flex-col gap-4">
              <h2 className='text-lg font-bold'>Add a Todo :</h2>
              <input onChange={handleChange} value={todo} type="text" className='w-full p-1 rounded-lg px-2' />
              <button onClick={handleAdd} disabled={todo.length <= 3} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 disabled:bg-violet-950 text-sm font-bold text-white rounded-md cursor-pointer '>Save</button>
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
                    <button onClick={(e) => { handleEdit(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md m-1'><FaEdit /></button>
                    <button onClick={(e) => { handleDelete(e, item.id) }} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md m-1'><MdDeleteForever /></button>
                  </div>
                </div>
              })}
            </div>

          </div>
   
  </>
  )
}

export default Home
