import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Feed() {

  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8000/post')
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/post/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  }

  return (
    <section className="feed-section">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <img src={post.image} alt={post.caption} />
          <div className="post-card-body">
            <p>{post.caption}</p>
            <button className="delete-btn" onClick={() => handleDelete(post._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </section>
  )
}

export default Feed
