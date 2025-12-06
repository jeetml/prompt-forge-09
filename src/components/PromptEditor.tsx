import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  GitBranch,
  GitPullRequest,
  Thermometer,
  FileCode,
  Puzzle,
  ChevronDown,
  Plus,
  Zap,
} from 'lucide-react';
import { Model, promptTemplates, estimateTokens } from '@/lib/mockData';
import { TokenMeter } from './TokenMeter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PromptEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedModel: Model;
  onSave: () => void;
  onBranch: () => void;
  onPR: () => void;
}

type EditorMode = 'raw' | 'visual';

interface PromptBlock {
  id: string;
  type: 'system' | 'format' | 'safety' | 'custom';
  title: string;
  content: string;
}

export function PromptEditor({
  content,
  onContentChange,
  selectedModel,
  onSave,
  onBranch,
  onPR,
}: PromptEditorProps) {
  const [mode, setMode] = useState<EditorMode>('raw');
  const [temperature, setTemperature] = useState(0.7);
  const [showTemplates, setShowTemplates] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const tokenCount = estimateTokens(content);
  const lines = content.split('\n');

  // Mock token counts per line (in production, use actual tokenizer)
  const getLineTokens = (line: string) => estimateTokens(line);

  const insertTemplate = (template: typeof promptTemplates[0]) => {
    onContentChange(content + '\n\n' + template.content);
    setShowTemplates(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          {/* Mode Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-secondary/50">
            <button
              onClick={() => setMode('raw')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth',
                mode === 'raw'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <FileCode className="w-4 h-4" />
              Raw
            </button>
            <button
              onClick={() => setMode('visual')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth',
                mode === 'visual'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Puzzle className="w-4 h-4" />
              Visual
            </button>
          </div>

          {/* Temperature Slider */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30">
            <Thermometer className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={[temperature]}
              onValueChange={([v]) => setTemperature(v)}
              min={0}
              max={2}
              step={0.1}
              className="w-24"
            />
            <span className="text-xs text-muted-foreground w-8">{temperature.toFixed(1)}</span>
          </div>

          {/* Token Meter */}
          <TokenMeter
            promptTokens={tokenCount}
            inputTokens={150}
            outputTokens={300}
            model={selectedModel}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onSave} className="gap-1.5">
                <Save className="w-4 h-4" />
                Save
                <kbd className="kbd ml-1">⌘S</kbd>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save changes (requires commit message)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onBranch} className="gap-1.5">
                <GitBranch className="w-4 h-4" />
                Branch
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create a new branch from current</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" size="sm" onClick={onPR} className="gap-1.5">
                <GitPullRequest className="w-4 h-4" />
                Create PR
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open a pull request for review</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor */}
        <div className="flex-1 relative">
          {mode === 'raw' ? (
            <div className="absolute inset-0 overflow-auto p-4">
              {/* Line Numbers + Content */}
              <div className="font-mono text-sm flex">
                {/* Line Numbers */}
                <div className="select-none text-right pr-4 text-muted-foreground/50 border-r border-border/30 mr-4">
                  {lines.map((_, i) => (
                    <div key={i} className="h-6 leading-6">
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Content with Token Hotspots */}
                <div className="flex-1">
                  {lines.map((line, i) => {
                    const lineTokens = getLineTokens(line);
                    const isHot = lineTokens > 15;

                    return (
                      <div
                        key={i}
                        className={cn(
                          'h-6 leading-6 px-2 rounded transition-all duration-150',
                          hoveredLine === i && 'bg-secondary/50',
                          isHot && hoveredLine === i && 'bg-warning/10'
                        )}
                        onMouseEnter={() => setHoveredLine(i)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <span className={cn(isHot && 'token-hotspot')}>
                          {line || '\u00A0'}
                        </span>
                        <AnimatePresence>
                          {hoveredLine === i && lineTokens > 0 && (
                            <motion.span
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className={cn(
                                'ml-4 text-xs px-1.5 py-0.5 rounded',
                                isHot
                                  ? 'bg-warning/20 text-warning'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {lineTokens} tokens
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actual Textarea (invisible, for editing) */}
              <textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none font-mono text-sm p-4"
                spellCheck={false}
              />
            </div>
          ) : (
            <VisualBuilder content={content} onContentChange={onContentChange} />
          )}
        </div>

        {/* Templates Panel */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-border/50 overflow-hidden"
            >
              <div className="p-4 h-full overflow-auto">
                <h3 className="text-sm font-medium mb-3">Templates & Snippets</h3>
                <div className="space-y-2">
                  {promptTemplates.map((template) => (
                    <motion.button
                      key={template.id}
                      onClick={() => insertTemplate(template)}
                      className="w-full p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 text-left transition-smooth group"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{template.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {template.tokenCount} tokens
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.content}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-3 h-3" />
                        Insert
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Templates Toggle */}
      <button
        onClick={() => setShowTemplates(!showTemplates)}
        className="absolute right-4 bottom-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-sm font-medium transition-smooth shadow-lg"
      >
        <Zap className="w-4 h-4 text-primary" />
        Templates
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform',
            showTemplates && 'rotate-180'
          )}
        />
      </button>
    </div>
  );
}

// Visual Builder Component
function VisualBuilder({
  content,
  onContentChange,
}: {
  content: string;
  onContentChange: (content: string) => void;
}) {
  // Parse content into blocks (simplified)
  const sections = content.split(/\n## /).filter(Boolean);

  return (
    <div className="p-6 space-y-4 overflow-auto">
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop blocks to restructure your prompt
      </p>
      {sections.map((section, i) => {
        const [title, ...lines] = section.split('\n');
        const blockContent = lines.join('\n').trim();

        return (
          <motion.div
            key={i}
            className="glass-panel p-4 cursor-move"
            whileHover={{ scale: 1.005 }}
            whileDrag={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
            drag
            dragConstraints={{ top: 0, bottom: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-primary">
                {i === 0 ? title : `## ${title}`}
              </h4>
              <span className="text-xs text-muted-foreground">
                {estimateTokens(blockContent)} tokens
              </span>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {blockContent}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
