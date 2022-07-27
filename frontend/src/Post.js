import { useState, useEffect } from 'react';
import uniqid from 'uniqid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';

function Post(props) {
  return (
    <div key={uniqid()} className="post">
      <h3>{props.post.title}</h3>
      <p>{props.post.content}</p>
      <span>
        Written by: {props.post.user.firstName} ({props.post.user.username}) on{' '}
        {props.date.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })}
      </span>
      <div className="likes">
        {props.post.likes.length === 1
          ? 'Liked by 1 person'
          : `Liked by ${props.post.likes.length} people`}
      </div>
      <div className="buttons">
        <div className="like">
          <FavoriteBorderOutlinedIcon fontSize="small" />
        </div>
        <div className="comment">
          <ModeCommentOutlinedIcon fontSize="small" />
        </div>
      </div>
    </div>
  );
}

export default Post;
