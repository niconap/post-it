import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Comment(props) {
  const [deletePressed, setDeletePressed] = useState(false);

  const handleDelete = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/post/${props.post}/comment/${props.comment._id}`,
        {
          method: 'DELETE',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      props.getPost();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = () => {
    if (!deletePressed) {
      setDeletePressed(true);
      setTimeout(() => setDeletePressed(false), 3000);
    } else {
      handleDelete();
    }
  };

  return (
    <div className="comment">
      <div className="commentcontent">
        <span>
          <NavLink to={`/frontend/profile?id=${props.comment.user}`}>
            {props.comment.username}
          </NavLink>
          :
        </span>
        <span>{props.comment.content}</span>
        <span className="commentdate">
          Posted on{' '}
          {props.comment.date.toLocaleString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </span>
      </div>
      {props.comment.user === localStorage.getItem('user') ? (
        <div className="delete" onClick={handleClick}>
          {deletePressed ? (
            <DeleteForeverOutlinedIcon />
          ) : (
            <DeleteOutlinedIcon />
          )}
        </div>
      ) : (
        ''
      )}
      {deletePressed ? (
        <span className="deleteconfirmation"> Click again to confirm</span>
      ) : (
        ''
      )}
    </div>
  );
}

export default Comment;
