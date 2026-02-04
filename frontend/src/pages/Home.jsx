import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';

const Home = () => {
    const { user, logout } = useAuth();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTodo, setNewTodo] = useState({ title: '', description: '' });
    const [editingTodo, setEditingTodo] = useState(null);

    // Fetch todos
    const fetchTodos = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/todos', {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch todos');
            const data = await res.json();
            setTodos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    // Create todo
    const createTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.title.trim()) return;

        try {
            const res = await fetch('http://localhost:3000/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newTodo),
            });
            if (!res.ok) throw new Error('Failed to create todo');
            const todo = await res.json();
            setTodos([todo, ...todos]);
            setNewTodo({ title: '', description: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    // Update todo
    const updateTodo = async (id, updates) => {
        try {
            const res = await fetch(`http://localhost:3000/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error('Failed to update todo');
            const updatedTodo = await res.json();
            setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
            setEditingTodo(null);
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete todo
    const deleteTodo = async (id) => {
        if (!confirm('Are you sure you want to delete this todo?')) return;

        try {
            const res = await fetch(`http://localhost:3000/api/todos/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to delete todo');
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    // Toggle completion
    const toggleCompleted = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/todos/${id}/toggle`, {
                method: 'PATCH',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to toggle todo');
            const updatedTodo = await res.json();
            setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user?.username}</span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Add Todo Form */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
                    <form onSubmit={createTodo} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Todo title..."
                                value={newTodo.title}
                                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Description (optional)..."
                                value={newTodo.description}
                                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows="3"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Add Todo
                        </button>
                    </form>
                </div>

                {/* Todos List */}
                <div className="space-y-4">
                    {todos.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                            No todos yet. Add one above!
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <div key={todo._id} className="bg-white rounded-lg shadow-sm p-6">
                                {editingTodo === todo._id ? (
                                    <EditTodoForm
                                        todo={todo}
                                        onSave={(updates) => updateTodo(todo._id, updates)}
                                        onCancel={() => setEditingTodo(null)}
                                    />
                                ) : (
                                    <TodoItem
                                        todo={todo}
                                        onToggle={() => toggleCompleted(todo._id)}
                                        onEdit={() => setEditingTodo(todo._id)}
                                        onDelete={() => deleteTodo(todo._id)}
                                    />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Todo Item Component
const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => (
    <div className="flex items-start gap-4">
        <input
            type="checkbox"
            checked={todo.completed}
            onChange={onToggle}
            className="mt-1 w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
        />
        <div className="flex-1">
            <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {todo.title}
            </h3>
            {todo.description && (
                <p className={`mt-1 text-gray-600 ${todo.completed ? 'line-through' : ''}`}>
                    {todo.description}
                </p>
            )}
            <p className="mt-2 text-sm text-gray-400">
                Created: {new Date(todo.createdAt).toLocaleDateString()}
            </p>
        </div>
        <div className="flex gap-2">
            <button
                onClick={onEdit}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
                Edit
            </button>
            <button
                onClick={onDelete}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
                Delete
            </button>
        </div>
    </div>
);

// Edit Todo Form Component
const EditTodoForm = ({ todo, onSave, onCancel }) => {
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ title, description });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                />
            </div>
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default Home;