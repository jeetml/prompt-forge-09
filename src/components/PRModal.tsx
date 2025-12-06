import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, GitPullRequest, Check, AlertCircle, MessageCircle } from 'lucide-react';
import { reviewers as mockReviewers, Reviewer, versions } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PRModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceBranch: string;
}

interface InlineComment {
  id: string;
  line: number;
  content: string;
}

export function PRModal({ isOpen, onClose, sourceBranch }: PRModalProps) {
  const [targetBranch, setTargetBranch] = useState('main');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedReviewers, setSelectedReviewers] = useState<Reviewer[]>([]);
  const [inlineComments] = useState<InlineComment[]>([
    { id: 'ic1', line: 3, content: 'Should we add more context here?' },
    { id: 'ic2', line: 7, content: 'Consider adding error handling' },
  ]);

  const approvedCount = selectedReviewers.filter((r) => r.approved).length;
  const requiredApprovals = 2;
  const canMerge = approvedCount >= requiredApprovals;

  const branches = versions.filter((v) => v.type === 'branch' && v.name !== sourceBranch);

  const toggleReviewer = (reviewer: Reviewer) => {
    setSelectedReviewers((prev) =>
      prev.find((r) => r.id === reviewer.id)
        ? prev.filter((r) => r.id !== reviewer.id)
        : [...prev, reviewer]
    );
  };

  const handleMerge = () => {
    if (!canMerge) {
      toast.error(`Need ${requiredApprovals - approvedCount} more approval(s) to merge`);
      return;
    }
    toast.success('Pull request merged successfully!');
    onClose();
  };

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('Please add a PR title');
      return;
    }
    toast.success('Pull request created!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass-panel-solid p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-primary" />
              Create Pull Request
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-auto">
          {/* Branch Selection */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-2 block">From</label>
              <div className="px-3 py-2 rounded-lg bg-secondary/30 text-sm font-mono">
                {sourceBranch}
              </div>
            </div>
            <div className="pt-6">
              <span className="text-muted-foreground">→</span>
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-2 block">To</label>
              <Select value={targetBranch} onValueChange={setTargetBranch}>
                <SelectTrigger className="bg-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.name}>
                      {branch.name}
                      {branch.isProduction && (
                        <span className="ml-2 text-2xs text-success">(prod)</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add multi-turn conversation support"
                className="bg-secondary/30"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the changes in this PR..."
                rows={4}
                className="bg-secondary/30 resize-none"
              />
            </div>
          </div>

          {/* Reviewers */}
          <div>
            <label className="text-sm text-muted-foreground mb-3 block">
              Reviewers
              <span className="ml-2 text-xs">
                ({approvedCount}/{requiredApprovals} required)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {mockReviewers.map((reviewer) => {
                const isSelected = selectedReviewers.find((r) => r.id === reviewer.id);
                return (
                  <motion.button
                    key={reviewer.id}
                    onClick={() => toggleReviewer(reviewer)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border transition-smooth',
                      isSelected
                        ? 'bg-primary/10 border-primary/50'
                        : 'bg-secondary/30 border-transparent hover:border-border'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium',
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                      )}
                    >
                      {reviewer.avatar}
                    </div>
                    <span className="text-sm">{reviewer.name}</span>
                    {isSelected && reviewer.approved && (
                      <Check className="w-4 h-4 text-success" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Inline Comments */}
          {inlineComments.length > 0 && (
            <div>
              <label className="text-sm text-muted-foreground mb-3 block flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Inline Comments ({inlineComments.length})
              </label>
              <div className="space-y-2">
                {inlineComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20"
                  >
                    <span className="text-xs text-muted-foreground font-mono">
                      L{comment.line}
                    </span>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Merge Status */}
          <div
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg',
              canMerge ? 'bg-success/10' : 'bg-warning/10'
            )}
          >
            {canMerge ? (
              <>
                <Check className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm font-medium text-success">Ready to merge</p>
                  <p className="text-xs text-muted-foreground">
                    All required approvals have been obtained
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-sm font-medium text-warning">Pending approvals</p>
                  <p className="text-xs text-muted-foreground">
                    {requiredApprovals - approvedCount} more approval(s) required to merge
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border/50 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleCreate}>
            Create PR
          </Button>
          <Button
            onClick={handleMerge}
            disabled={!canMerge}
            className={cn(!canMerge && 'opacity-50 cursor-not-allowed')}
          >
            <GitPullRequest className="w-4 h-4 mr-2" />
            Merge
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
