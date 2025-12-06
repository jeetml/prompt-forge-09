import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { PromptEditor } from '@/components/PromptEditor';
import { VersionPanel } from '@/components/VersionPanel';
import { DiffViewer } from '@/components/DiffViewer';
import { PRModal } from '@/components/PRModal';
import { Playground } from '@/components/Playground';
import { DashboardCards } from '@/components/DashboardCards';
import { CostEstimator } from '@/components/CostEstimator';
import {
  models,
  versions,
  mockPromptContent,
  estimateTokens,
  calculateCost,
  Model,
  Version,
} from '@/lib/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ViewMode = 'editor' | 'diff' | 'dashboard';

export default function Index() {
  const [activeNavItem, setActiveNavItem] = useState('prompts');
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [promptContent, setPromptContent] = useState(mockPromptContent);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(versions[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [isPRModalOpen, setIsPRModalOpen] = useState(false);
  const [isPlaygroundExpanded, setIsPlaygroundExpanded] = useState(false);

  const tokenCount = estimateTokens(promptContent);
  const tokenCost = calculateCost(selectedModel, tokenCount, 300);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'k':
            e.preventDefault();
            // Focus search (would be implemented)
            toast.info('Search focused (Cmd/Ctrl + K)');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSave = useCallback(() => {
    toast.success('Changes saved! Please add a commit message.');
  }, []);

  const handleBranch = useCallback(() => {
    toast.success('New branch created: feature/new-changes');
  }, []);

  const handlePromote = useCallback((version: Version) => {
    toast.success(`${version.name} promoted to production`);
  }, []);

  const handleRollback = useCallback((version: Version) => {
    toast.success(`Rolled back to ${version.name}`);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        tokenCost={tokenCost}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeItem={activeNavItem} onItemChange={setActiveNavItem} />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* View Mode Toggle & Cost Estimator */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border/50">
            <div className="flex items-center gap-2 p-1 rounded-lg bg-secondary/30">
              {(['editor', 'diff', 'dashboard'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'px-4 py-1.5 rounded-md text-sm font-medium transition-smooth capitalize',
                    viewMode === mode
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
            <CostEstimator currentModel={selectedModel} promptTokens={tokenCount} />
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            <AnimatePresence mode="wait">
              {viewMode === 'editor' && (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex overflow-hidden"
                >
                  {/* Editor Column */}
                  <div className="flex-1 flex flex-col border-r border-border/50 overflow-hidden">
                    <PromptEditor
                      content={promptContent}
                      onContentChange={setPromptContent}
                      selectedModel={selectedModel}
                      onSave={handleSave}
                      onBranch={handleBranch}
                      onPR={() => setIsPRModalOpen(true)}
                    />
                  </div>

                  {/* Version Panel */}
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 320, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-l border-border/50 overflow-hidden flex-shrink-0"
                  >
                    <VersionPanel
                      selectedVersion={selectedVersion}
                      onVersionSelect={setSelectedVersion}
                      onPromote={handlePromote}
                      onRollback={handleRollback}
                    />
                  </motion.div>
                </motion.div>
              )}

              {viewMode === 'diff' && (
                <motion.div
                  key="diff"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-hidden"
                >
                  <DiffViewer model={selectedModel} />
                </motion.div>
              )}

              {viewMode === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-auto"
                >
                  <DashboardCards />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Playground Panel */}
          <Playground
            selectedModel={selectedModel}
            isExpanded={isPlaygroundExpanded}
            onToggleExpand={() => setIsPlaygroundExpanded(!isPlaygroundExpanded)}
          />
        </main>
      </div>

      {/* PR Modal */}
      <PRModal
        isOpen={isPRModalOpen}
        onClose={() => setIsPRModalOpen(false)}
        sourceBranch={selectedVersion?.name || 'feature/multi-turn'}
      />
    </div>
  );
}
