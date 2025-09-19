
import React from 'react';
import ComposePostForm from '@/components/profile/components/ComposePostForm';

interface CreatePostFormProps {
  onPostCreated: () => void;
  onCancel: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated, onCancel }) => {
  return (
    <ComposePostForm onPostCreated={onPostCreated} onCancel={onCancel} />
  );
};

export default CreatePostForm;
