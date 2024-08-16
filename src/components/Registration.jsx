import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const Registration = () => {

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:5000/register', { name, email, password })
            .then(res => {
                
                    navigate('/login')

                
            })
            .catch(err => console.log(err))
    }


    return (
        <>


            <div className=" flex justify-center items-center h-screen">
                <form
                    className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm "
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
                        Register
                    </h2>

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-600 font-semibold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder='Enter Username'
                            // value={formData.username}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600 font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder='Enter Email'
                            // value={formData.email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-600 font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder='Enter Password'
                            // value={formData.password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Register
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-gray-600">Already have an account?</p>
                        <button
                            type="button"
                            className="text-blue-500 hover:underline mt-2"
                            onClick={() => {
                                // Handle redirect to login page
                                navigate('/login')
                                console.log('Redirect to login page');
                            }}
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>

        </>
    )
}

export default Registration
