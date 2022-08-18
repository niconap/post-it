import { useState } from 'react';
import uniqid from 'uniqid';

function CommentForm(props) {
  const [commentContent, setCommentContent] = useState('');
  const [errors, setErrors] = useState([]);

  let handleSubmit = async (e) => {
    setErrors([]);
    e.preventDefault();
    try {
      let res = await fetch(
        `http://localhost:5000/api/post/${props.postId}/comment`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
          body: JSON.stringify({
            content: commentContent,
          }),
        }
      );
      let resJson = await res.json();
      if (resJson.errors) {
        setErrors(resJson.errors);
      } else {
        props.getPost();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="commentinput">
      <form name="comment" onSubmit={handleSubmit}>
        <span
          className={`counter${
            commentContent.length > 250 ? ' redcounter' : ''
          }`}
        >
          {commentContent.length} / 250
        </span>
        <input
          className={`${commentContent.length > 250 ? 'redinput' : ''}`}
          type="text"
          placeholder="Type a comment..."
          value={commentContent}
          onChange={(e) => {
            setCommentContent(e.target.value);
          }}
        />
        <input type="submit" value="Post" className="submit" />
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

export default CommentForm;
