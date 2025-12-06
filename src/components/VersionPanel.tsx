import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Tag,
  ChevronDown,
  ChevronRight,
  ArrowUpCircle,
  RotateCcw,
  Lock,
  Users,
  Check,
} from 'lucide-react';
import { Version, versions as mockVersions } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VersionPanelProps {
  selectedVersion: Version | null;
  onVersionSelect: (version: Version) => void;
  onPromote: (version: Version) => void;
  onRollback: (version: Version) => void;
}

export function VersionPanel({
  selectedVersion,
  onVersionSelect,
  onPromote,
  onRollback,
}: VersionPanelProps) {
  const [expandedBranches, setExpandedBranches] = useState<string[]>(['main']);
  const [commitMessage, setCommitMessage] = useState('');
  const [lockingEnabled, setLockingEnabled] = useState(false);
  const [requiredApprovals, setRequiredApprovals] = useState(2);
  const [changelog, setChangelog] = useState<string[]>([
    'v2.1.0 - Added multi-turn conversation support',
    'v2.0.0 - Major rewrite with improved token efficiency',
    'v1.5.0 - Added safety guardrails',
  ]);

  const branches = mockVersions.filter((v) => v.type === 'branch');
  const tags = mockVersions.filter((v) => v.type === 'tag');

  const toggleBranch = (id: string) => {
    setExpandedBranches((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const handleCommit = () => {
    if (!commitMessage.trim()) {
      toast.error('Commit message is required');
      return;
    }
    setChangelog((prev) => [`${new Date().toLocaleDateString()} - ${commitMessage}`, ...prev]);
    setCommitMessage('');
    toast.success('Changes committed successfully');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Branches Section */}
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Branches
        </h3>
        <div className="space-y-1">
          {branches.map((branch) => (
            <div key={branch.id}>
              <motion.button
                onClick={() => {
                  onVersionSelect(branch);
                  toggleBranch(branch.id);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-smooth',
                  selectedVersion?.id === branch.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-secondary/50'
                )}
                whileHover={{ x: 2 }}
              >
                {expandedBranches.includes(branch.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="flex-1 text-left truncate">{branch.name}</span>
                {branch.isProduction && (
                  <span className="px-1.5 py-0.5 rounded text-2xs bg-success/20 text-success font-medium">
                    PROD
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {branch.tokenCount} tokens
                </span>
              </motion.button>

              {/* Commits */}
              <AnimatePresence>
                {expandedBranches.includes(branch.id) && branch.commits.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-6 mt-1 space-y-1 overflow-hidden"
                  >
                    {branch.commits.map((commit) => (
                      <div
                        key={commit.id}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                        <span className="flex-1 truncate">{commit.message}</span>
                        <span
                          className={cn(
                            'font-mono',
                            commit.tokenDelta > 0 ? 'text-destructive' : 'text-success'
                          )}
                        >
                          {commit.tokenDelta > 0 ? '+' : ''}
                          {commit.tokenDelta}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Tags
        </h3>
        <div className="space-y-1">
          {tags.map((tag) => (
            <motion.button
              key={tag.id}
              onClick={() => onVersionSelect(tag)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-smooth',
                selectedVersion?.id === tag.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-secondary/50'
              )}
              whileHover={{ x: 2 }}
            >
              <Tag className="w-4 h-4" />
              <span className="flex-1 text-left">{tag.name}</span>
              <span className="text-xs text-muted-foreground">
                {tag.tokenCount} tokens
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Actions */}
      {selectedVersion && (
        <div className="p-4 border-b border-border/50 space-y-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => onPromote(selectedVersion)}
              disabled={selectedVersion.isProduction}
            >
              <ArrowUpCircle className="w-4 h-4" />
              Promote
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => onRollback(selectedVersion)}
            >
              <RotateCcw className="w-4 h-4" />
              Rollback
            </Button>
          </div>
        </div>
      )}

      {/* Commit Message */}
      <div className="p-4 border-b border-border/50">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Commit Message <span className="text-destructive">*</span>
        </label>
        <div className="flex gap-2">
          <Input
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Describe your changes..."
            className="flex-1"
          />
          <Button size="sm" onClick={handleCommit}>
            <Check className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Locking & Approvals */}
      <div className="p-4 border-b border-border/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Require Locking</span>
          </div>
          <Switch checked={lockingEnabled} onCheckedChange={setLockingEnabled} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Required Approvals</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRequiredApprovals(Math.max(1, requiredApprovals - 1))}
              className="w-6 h-6 rounded bg-secondary/50 text-sm hover:bg-secondary transition-smooth"
            >
              -
            </button>
            <span className="text-sm font-medium w-4 text-center">{requiredApprovals}</span>
            <button
              onClick={() => setRequiredApprovals(Math.min(5, requiredApprovals + 1))}
              className="w-6 h-6 rounded bg-secondary/50 text-sm hover:bg-secondary transition-smooth"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Changelog */}
      <div className="flex-1 p-4 overflow-auto">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Changelog</h3>
        <div className="space-y-2">
          {changelog.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="text-xs text-muted-foreground p-2 rounded bg-secondary/20"
            >
              {entry}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
