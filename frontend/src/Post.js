import { useState } from 'react';
import uniqid from 'uniqid';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';

function Post(props) {
  const post = props.post;

  const checkLike = () => {
    return post.likes.includes(localStorage.getItem('user'));
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
    props.fetchPosts('http://localhost:5000/api/post/general', 'general');
    props.fetchPosts('http://localhost:5000/api/post/friends', 'friends');
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
        <div className="comment">
          <ModeCommentOutlinedIcon fontSize="small" />
        </div>
      </div>
    </div>
  );
}

export default Post;
