import uniqid from 'uniqid';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

function Post(props) {
  const post = props.post;
  const [deletePressed, setDeletePressed] = useState(false);

  const checkLike = () => {
    return post.likes.includes(localStorage.getItem('user'));
  };

  const handleClick = () => {
    if (!deletePressed) {
      setDeletePressed(true);
      setTimeout(() => setDeletePressed(false), 3000);
    } else {
      handleDelete();
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:5000/api/post/${post._id}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
      props.fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    if (checkLike()) {
      try {
        await fetch(`http://localhost:5000/api/post/like/${post._id}`, {
          method: 'DELETE',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await fetch(`http://localhost:5000/api/post/like/${post._id}`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
    props.fetchPosts();
  };

  return (
    <div key={uniqid()} className="post">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <span>
        Written by: {post.user.firstName} ({post.user.username}) on{' '}
        {props.date.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })}
      </span>
      <div className="likes">
        {post.likes.length === 1
          ? 'Liked by 1 person'
          : `Liked by ${post.likes.length} people`}
      </div>
      <div className="buttons">
        <div className="like" onClick={handleLike}>
          {checkLike() ? (
            <FavoriteOutlinedIcon
              fontSize="small"
              sx={{ color: 'rgb(255, 73, 73)' }}
            />
          ) : (
            <FavoriteBorderOutlinedIcon fontSize="small" />
          )}
        </div>
        <div className="commentButton">
          <NavLink to={`/post?id=${post._id}`}>
            <ModeCommentOutlinedIcon fontSize="small" />
          </NavLink>
        </div>
        {post.user._id === localStorage.getItem('user') ? (
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
          <span className="confirmation"> Click again to confirm</span>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default Post;
