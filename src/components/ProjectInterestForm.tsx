
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectInterestFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  projectOwnerEmail?: string;
}

const ProjectInterestForm: React.FC<ProjectInterestFormProps> = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  projectOwnerEmail
}) => {
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !contactNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // Send interest notification email
      const { error } = await supabase.functions.invoke('send-interest-notification', {
        body: {
          projectId,
          projectTitle,
          projectOwnerEmail,
          interestedUserEmail: email,
          interestedUserContact: contactNumber,
          interestedUserId: user?.id
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Your interest has been sent to the project owner!');
      setEmail('');
      setContactNumber('');
      onClose();
    } catch (error: any) {
      console.error('Error sending interest:', error);
      toast.error('Failed to send interest notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Express Interest in "{projectTitle}"</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Your information will be shared with the project owner so they can contact you about this opportunity.
          </p>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Interest'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectInterestForm;
