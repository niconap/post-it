import { useState } from 'react';
import uniqid from 'uniqid';

function PostForm(props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      let res = await fetch('/api/post/', {
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
        props.fetchPosts();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="postform">
      <form onSubmit={handleSubmit}>
        <div className="formgroup">
          <span
            className={`counter${
              title.length > 40 || title.length === 1 ? ' redcounter' : ''
            }`}
          >
            {title.length} / 40
          </span>
          <input
            className={`${
              title.length > 40 || title.length === 1 ? 'redinput' : ''
            }`}
            type="text"
            name="title"
            placeholder="Title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="formgroup">
          <span
            className={`counter${
              content.length > 215 || content.length === 1 ? ' redcounter' : ''
            }`}
          >
            {content.length} / 215
          </span>
          <input
            className={`${
              content.length > 215 || content.length === 1 ? 'redinput' : ''
            }`}
            type="text"
            name="content"
            placeholder="Content..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>
        <div className="formgroup">
          <input type="submit" id="postsubmit" value="Post" />
        </div>
      </form>
      <ul>
        {errors.map((error) => {
          return (
            <li className="inputerror" key={uniqid()}>
              {error.msg}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PostForm;
