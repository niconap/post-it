import { useState } from 'react';
import uniqid from 'uniqid';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch('http://localhost:5000/api/post/', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      let resJson = await res.json();
      if (resJson.errors) {
        setErrors(resJson.errors);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="postform">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <input
          type="text"
          name="content"
          placeholder="Content..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <input type="submit" value="Post" />
      </form>
      <ul>
        {errors.map((error) => {
          return <li key={uniqid()}>{error.msg}</li>;
        })}
      </ul>
    </div>
  );
}

export default PostForm;
