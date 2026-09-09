import React, { useState } from 'react'
import axios from 'axios'

function CreatePost() {
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', caption);

      await axios.post('http://localhost:8000/create-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Post created successfully!');
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post: " + (error.response?.data?.message || error.message));
    }
  }

  return (
    <section className='create-post-section'>
      <h1>Create post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="image"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <input
          type="text"
          name="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter caption..."
          required
        />
        <button type="submit">Submit</button>
      </form>
    </section>
  )
}

export default CreatePost
