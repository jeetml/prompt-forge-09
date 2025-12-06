import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Plus, DollarSign, ArrowRight } from 'lucide-react';
import { DiffBlock, diffBlocks as mockDiffBlocks, Model, calculateCost } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DiffViewerProps {
  model: Model;
}

export function DiffViewer({ model }: DiffViewerProps) {
  const [diffBlocks] = useState<DiffBlock[]>(mockDiffBlocks);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const totalTokenDelta = diffBlocks.reduce((sum, block) => sum + block.tokenDelta, 0);
  const costDelta = calculateCost(model, Math.abs(totalTokenDelta), 0) * (totalTokenDelta > 0 ? 1 : -1);

  const addComment = (blockId: string) => {
    if (!newComment.trim()) return;
    // In real app, would add to block.comments
    setNewComment('');
    setActiveComment(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="text-sm font-medium">Side-by-Side Diff</h3>
        <div className="flex items-center gap-4">
          {/* Token Delta */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium',
                  totalTokenDelta > 0
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-success/10 text-success'
                )}
              >
                <span>
                  {totalTokenDelta > 0 ? '+' : ''}
                  {totalTokenDelta} tokens
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Net token change across all modifications</TooltipContent>
          </Tooltip>

          {/* Cost Delta */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium',
                  costDelta > 0
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-success/10 text-success'
                )}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>
                  {costDelta > 0 ? '+' : ''}
                  {costDelta.toFixed(4)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Estimated cost change per request</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Diff Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Old Version Header */}
          <div className="text-xs text-muted-foreground font-medium mb-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-destructive/30" />
            main (current)
          </div>
          {/* New Version Header */}
          <div className="text-xs text-muted-foreground font-medium mb-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-success/30" />
            feature/multi-turn
          </div>

          {/* Diff Blocks */}
          {diffBlocks.map((block, index) => (
            <DiffBlockRow
              key={block.id}
              block={block}
              index={index}
              activeComment={activeComment}
              setActiveComment={setActiveComment}
              newComment={newComment}
              setNewComment={setNewComment}
              addComment={addComment}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DiffBlockRow({
  block,
  index,
  activeComment,
  setActiveComment,
  newComment,
  setNewComment,
  addComment,
}: {
  block: DiffBlock;
  index: number;
  activeComment: string | null;
  setActiveComment: (id: string | null) => void;
  newComment: string;
  setNewComment: (value: string) => void;
  addComment: (blockId: string) => void;
}) {
  const showOld = block.type !== 'added';
  const showNew = block.type !== 'removed';

  return (
    <>
      {/* Old Side */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="relative group"
      >
        <div
          className={cn(
            'p-3 rounded-lg font-mono text-sm relative',
            block.type === 'removed' && 'diff-removed',
            block.type === 'changed' && 'bg-warning/10 border-l-2 border-warning/50',
            block.type === 'unchanged' && 'bg-secondary/20',
            block.type === 'added' && 'opacity-30'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>Line {block.lineNumber}</span>
              {block.tokenDelta !== 0 && showOld && block.type === 'removed' && (
                <span className="text-destructive font-medium">
                  -{Math.abs(block.tokenDelta)} tokens
                </span>
              )}
            </div>
          </div>
          <p className={cn(block.type === 'added' && 'text-muted-foreground')}>
            {block.oldContent || '(empty)'}
          </p>
        </div>
      </motion.div>

      {/* New Side */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="relative group"
      >
        <div
          className={cn(
            'p-3 rounded-lg font-mono text-sm relative',
            block.type === 'added' && 'diff-added',
            block.type === 'changed' && 'bg-warning/10 border-l-2 border-warning/50',
            block.type === 'unchanged' && 'bg-secondary/20',
            block.type === 'removed' && 'opacity-30'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>Line {block.lineNumber}</span>
              {block.tokenDelta !== 0 && showNew && block.type !== 'removed' && (
                <span
                  className={cn(
                    'font-medium',
                    block.tokenDelta > 0 ? 'text-destructive' : 'text-success'
                  )}
                >
                  {block.tokenDelta > 0 ? '+' : ''}
                  {block.tokenDelta} tokens
                </span>
              )}
            </div>

            {/* Comment Button */}
            <button
              onClick={() => setActiveComment(activeComment === block.id ? null : block.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary"
              aria-label="Add comment"
            >
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className={cn(block.type === 'removed' && 'text-muted-foreground')}>
            {block.newContent || '(empty)'}
          </p>

          {/* Existing Comments */}
          {block.comments.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border/50 space-y-2">
              {block.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2 text-xs">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-2xs font-medium text-primary">
                    {comment.author.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <span className="font-medium">{comment.author}: </span>
                    <span className="text-muted-foreground">{comment.content}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Input */}
          <AnimatePresence>
            {activeComment === block.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 pt-2 border-t border-border/50 overflow-hidden"
              >
                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 h-8 text-xs"
                    onKeyDown={(e) => e.key === 'Enter' && addComment(block.id)}
                  />
                  <Button size="sm" onClick={() => addComment(block.id)} className="h-8">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
