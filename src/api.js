import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export const fetchPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createPost = async (title) => {
  const response = await axios.post(API_URL, { title, body: '', userId: 1 });
  return response.data;
};

export const updatePost = async (id, title) => {
  const response = await axios.put(`${API_URL}/${id}`, { title, body: '', userId: 1 });
  return response.data;
};

export const deletePost = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

// src/App.js
import React, { useState, useEffect } from 'react';
import { fetchPosts, createPost, updatePost, deletePost } from './api';
import { FaTrash, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  
  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newPost = await createPost(title);
    setPosts([...posts, newPost]);
    setTitle('');
  };

  const handleEditStart = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
  };

  const handleEditSave = async (id) => {
    if (!editTitle.trim()) return;
    const updatedPost = await updatePost(id, editTitle);
    setPosts(posts.map(p => (p.id === id ? updatedPost : p)));
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="App">
      <h1>Posts</h1>
      <form onSubmit={handleCreate}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New Post" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {editingId === post.id ? (
              <>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <FaCheck onClick={() => handleEditSave(post.id)} />
                <FaTimes onClick={() => setEditingId(null)} />
              </>
            ) : (
              <>
                <span>{post.title}</span>
                <FaPencilAlt onClick={() => handleEditStart(post)} />
                <FaTrash onClick={() => handleDelete(post.id)} />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;