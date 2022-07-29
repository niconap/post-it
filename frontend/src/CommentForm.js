import { useState } from 'react';

function CommentForm(props) {
  const [commentContent, setCommentContent] = useState('');

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/post/${props.postId}/comment`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({
          content: commentContent,
        }),
      });
      props.getPost();
    } catch (err) {
      <div id="commentinput">
        <form name="comment" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type a comment..."
            value={commentContent}
            onChange={(e) => {
              setCommentContent(e.target.value);
            }}
          />
          <input type="submit" value="Post" />
        </form>
      </div>;
      console.log(err);
    }
  };

  return (
    <div id="commentinput">
      <form name="comment" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a comment..."
          value={commentContent}
          onChange={(e) => {
            setCommentContent(e.target.value);
          }}
        />
        <input type="submit" value="Post" />
      </form>
    </div>
  );
}

export default CommentForm;
