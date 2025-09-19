
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface PostMediaPreviewProps {
  postType: 'text' | 'image' | 'video' | 'live';
  previewUrl: string | null;
  onRemove: () => void;
}

const PostMediaPreview: React.FC<PostMediaPreviewProps> = ({ 
  postType, 
  previewUrl, 
  onRemove 
}) => {
  if (!previewUrl) return null;
  
  return (
    <div className="relative mt-3 rounded-lg overflow-hidden border border-gray-200">
      {postType === 'image' && (
        <img src={previewUrl} alt="Selected" className="w-full h-auto max-h-60 object-contain bg-black" />
      )}
      
      {postType === 'video' && (
        <video src={previewUrl} className="w-full h-auto max-h-60" controls />
      )}
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PostMediaPreview;
