import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Load posts from local storage once on mount
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(savedPosts);
  }, []);

  // Update local storage only when posts change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }, [posts]);

  const createPost = () => {
    if (!title.trim() || !body.trim()) {
      alert("Title and Body cannot be empty!");
      return;
    }
    
    // Prevent duplicate entries
    if (posts.some(post => post.title === title && post.body === body)) {
      alert("Post already exists!");
      return;
    }

    const newPost = { id: Date.now(), title, body };
    setPosts([newPost, ...posts]);
    setTitle("");
    setBody("");
  };

  const updatePost = (id) => {
    if (!title.trim() || !body.trim()) {
      alert("Title and Body cannot be empty!");
      return;
    }

    setPosts(posts.map(post => post.id === id ? { ...post, title, body } : post));
    setEditingId(null);
    setTitle("");
    setBody("");
  };

  const deletePost = (id) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    setPosts(updatedPosts);

    // If deleting all posts, also clear local storage
    if (updatedPosts.length === 0) {
      localStorage.removeItem("posts");
    }
  };

  return (
    <div className="container">
      <h1>CRUD with Local Storage</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button className="create-button" onClick={editingId ? () => updatePost(editingId) : createPost}>
          {editingId ? "Update Post" : "Create Post"}
        </button>
      </div>
      <ul>
        {posts.map(post => (
          <li key={post.id} className="post">
            <div>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </div>
            <div>
              <button className="icon-button edit" onClick={() => {
                setEditingId(post.id);
                setTitle(post.title);
                setBody(post.body);
              }}>
                ✏️
              </button>
              <button className="icon-button delete" onClick={() => deletePost(post.id)}>
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

