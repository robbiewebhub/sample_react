
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, PaperclipIcon, Send, X, Share2 } from 'lucide-react';
import { MessageFormData } from '@/types/messaging.types';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type MessageComposerProps = {
  onSendMessage: (messageData: MessageFormData) => Promise<void>;
  disabled?: boolean;
};

const MessageComposer = ({ onSendMessage, disabled = false }: MessageComposerProps) => {
  const [text, setText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showPostSelector, setShowPostSelector] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const { user } = useAuth();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setMediaPreviewUrl(url);
      } else {
        setMediaPreviewUrl(null);
      }
    }
  };
  
  const removeMedia = () => {
    setMediaFile(null);
    if (mediaPreviewUrl) {
      URL.revokeObjectURL(mediaPreviewUrl);
      setMediaPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start a timer
      let time = 0;
      timerRef.current = window.setInterval(() => {
        time += 1;
        setRecordingTime(time);
        
        // Auto-stop after 60 seconds
        if (time >= 60) {
          stopRecording();
        }
      }, 1000);
    } catch (error) {
      console.error('Error starting voice recording:', error);
      alert('Could not access microphone. Please check your browser permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioBlob(null);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setRecordingTime(0);
    }
  };
  
  const removeVoiceNote = () => {
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const fetchUserPosts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, content, media_url, created_at, post_type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      setUserPosts(data || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const openPostSelector = () => {
    fetchUserPosts();
    setShowPostSelector(true);
  };

  const selectPost = (postId: string) => {
    setSelectedPostId(postId);
    setShowPostSelector(false);
  };

  const removeSelectedPost = () => {
    setSelectedPostId(null);
  };
  
  const handleSendMessage = async () => {
    if (disabled || (!text && !mediaFile && !audioBlob && !selectedPostId)) return;
    
    let voiceNoteFile: File | undefined;
    
    if (audioBlob) {
      voiceNoteFile = new File(
        [audioBlob], 
        `voice_note_${Date.now()}.wav`, 
        { type: 'audio/wav' }
      );
    }
    
    await onSendMessage({
      content: text,
      media_file: mediaFile || undefined,
      voice_note: voiceNoteFile,
      shared_post_id: selectedPostId || undefined
    });
    
    // Reset the form
    setText('');
    removeMedia();
    removeVoiceNote();
    removeSelectedPost();
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="px-4 py-3 border-t">
      {/* Media preview */}
      {mediaFile && (
        <div className="relative mb-2 inline-block">
          {mediaPreviewUrl ? (
            <img 
              src={mediaPreviewUrl} 
              alt="Media preview" 
              className="max-h-24 rounded-md"
            />
          ) : (
            <div className="bg-gray-100 p-2 rounded-md text-sm">
              {mediaFile.name}
            </div>
          )}
          <Button 
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={removeMedia}
          >
            <X size={14} />
          </Button>
        </div>
      )}
      
      {/* Voice note recording or preview */}
      {(isRecording || audioBlob) && (
        <div className="relative mb-2 inline-block">
          <div className={cn(
            "bg-gray-100 p-2 rounded-md text-sm flex items-center space-x-2",
            isRecording && "border border-red-500"
          )}>
            <Mic size={16} className={isRecording ? "text-red-500" : ""} />
            <span>{isRecording ? 'Recording...' : 'Voice note'}</span>
            <span>{formatTime(recordingTime)}</span>
            
            {isRecording && (
              <div className="flex space-x-2 ml-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2"
                  onClick={stopRecording}
                >
                  Stop
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="h-7 px-2"
                  onClick={cancelRecording}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          
          {audioBlob && !isRecording && (
            <Button 
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={removeVoiceNote}
            >
              <X size={14} />
            </Button>
          )}
        </div>
      )}

      {/* Shared post preview */}
      {selectedPostId && (
        <div className="relative mb-2 inline-block">
          <div className="bg-gray-100 p-2 rounded-md text-sm flex items-center space-x-2">
            <Share2 size={16} />
            <span>Shared post</span>
          </div>
          <Button 
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={removeSelectedPost}
          >
            <X size={14} />
          </Button>
        </div>
      )}
      
      {/* Message input and actions */}
      <div className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
        />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleFileButtonClick}
          disabled={disabled || isRecording}
          className="text-gray-500 hover:text-gray-700"
        >
          <PaperclipIcon size={20} />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              className="text-gray-500 hover:text-gray-700"
            >
              <Share2 size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Share a post</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {userPosts.length === 0 ? (
                  <p className="text-sm text-gray-500">No posts found</p>
                ) : (
                  userPosts.map(post => (
                    <div 
                      key={post.id} 
                      className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => selectPost(post.id)}
                    >
                      <p className="text-sm truncate">{post.content || `${post.post_type} post`}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {!isRecording && !audioBlob && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={startRecording}
            disabled={disabled}
            className="text-gray-500 hover:text-gray-700"
          >
            <Mic size={20} />
          </Button>
        )}
        
        <Input
          placeholder="Type a message..."
          value={text}
          onChange={handleTextChange}
          disabled={disabled || isRecording}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        
        <Button
          type="button"
          variant="default"
          size="icon"
          onClick={handleSendMessage}
          disabled={disabled || (!text && !mediaFile && !audioBlob && !selectedPostId)}
          className="bg-fusion-primary hover:bg-fusion-primary/90"
        >
          <Send size={18} />
        </Button>
      </div>

      {/* Post selector dialog */}
      <Dialog open={showPostSelector} onOpenChange={setShowPostSelector}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a post to share</DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-3">
            {userPosts.length === 0 ? (
              <p className="text-center text-gray-500">No posts found</p>
            ) : (
              userPosts.map(post => (
                <div 
                  key={post.id} 
                  className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => selectPost(post.id)}
                >
                  <p className="mb-1 truncate">{post.content || `${post.post_type} post`}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageComposer;
