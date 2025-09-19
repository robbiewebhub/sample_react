
import React, { useState } from 'react';
import CreatePostForm from './CreatePostForm';

const CreatePost = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePostCreated = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <CreatePostForm 
      onPostCreated={handlePostCreated} 
      onCancel={handleCancel} 
    />
  );
};

export default CreatePost;
