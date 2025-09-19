
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  FileImage,
  Video,
  BarChart4,
  Users,
  Calendar
} from 'lucide-react';

interface PostActionButtonsProps {
  onMediaSelect: () => void;
  onGoLive: () => void;
  onCreatePoll: () => void;
  onSchedulePost: () => void;
}

const PostActionButtons: React.FC<PostActionButtonsProps> = ({
  onMediaSelect,
  onGoLive,
  onCreatePoll,
  onSchedulePost
}) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-fusion-primary hover:bg-fusion-primary/10"
        onClick={onMediaSelect}
        title="Media"
      >
        <FileImage className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-fusion-primary hover:bg-fusion-primary/10"
        onClick={onGoLive}
        title="Go Live"
      >
        <Video className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-fusion-primary hover:bg-fusion-primary/10"
        onClick={onCreatePoll}
        title="Encuesta"
      >
        <BarChart4 className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-fusion-primary hover:bg-fusion-primary/10"
        title="Followers Only"
      >
        <Users className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-fusion-primary hover:bg-fusion-primary/10"
        onClick={onSchedulePost}
        title="Programar publicación"
      >
        <Calendar className="h-5 w-5" />
      </Button>
    </>
  );
};

export default PostActionButtons;
