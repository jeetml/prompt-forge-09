import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Upload,
  Sparkles,
} from 'lucide-react';
import { Model, Version, versions, testCases as mockTestCases, TestCase } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PlaygroundProps {
  selectedModel: Model;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function Playground({ selectedModel, isExpanded, onToggleExpand }: PlaygroundProps) {
  const [selectedVersion, setSelectedVersion] = useState<string>(versions[0].id);
  const [input, setInput] = useState('Hello, can you help me with a coding question?');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [redactionEnabled, setRedactionEnabled] = useState(false);
  const [showGoldenComparison, setShowGoldenComparison] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>(mockTestCases);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockResponse = `Hello! I'd be happy to help you with your coding question. What specific problem or topic would you like assistance with?

I can help with:
• Debugging code issues
• Explaining programming concepts  
• Reviewing code for best practices
• Suggesting optimizations

Just share the details and I'll do my best to assist you!`;

    setOutput(redactionEnabled ? mockResponse.replace(/\b[A-Z][a-z]+\b/g, '[REDACTED]') : mockResponse);
    setIsRunning(false);
    toast.success('Request completed');
  };

  const handleRunTests = async () => {
    setIsRunningTests(true);

    // Simulate running tests one by one
    for (let i = 0; i < testCases.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setTestCases((prev) =>
        prev.map((tc, idx) =>
          idx === i
            ? { ...tc, status: Math.random() > 0.3 ? 'passed' : 'failed' }
            : tc
        )
      );
    }

    setIsRunningTests(false);
    toast.success('Test run completed');
  };

  const goldenOutput = 'Hello! I\'m doing well, thank you for asking. How can I assist you today?';

  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? 'auto' : 56 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={onToggleExpand}
        className="w-full h-14 px-6 flex items-center justify-between hover:bg-secondary/30 transition-smooth"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-medium">Playground & Testing</span>
          {!isExpanded && (
            <span className="text-xs text-muted-foreground">
              Click to expand
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Input/Output */}
              <div className="space-y-4">
                {/* Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Prompt Version
                    </label>
                    <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                      <SelectTrigger className="bg-secondary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name}
                            {v.isProduction && (
                              <span className="ml-2 text-success text-2xs">(prod)</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Model</label>
                    <div className="px-3 py-2 rounded-lg bg-secondary/30 text-sm">
                      {selectedModel.name}
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Test Input</label>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter test input..."
                    rows={3}
                    className="bg-secondary/30 resize-none font-mono text-sm"
                  />
                </div>

                {/* Run Button */}
                <Button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="w-full gap-2"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run
                    </>
                  )}
                </Button>

                {/* Output */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-muted-foreground">Response</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowGoldenComparison(!showGoldenComparison)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-smooth"
                      >
                        {showGoldenComparison ? 'Hide' : 'Compare'} Golden
                      </button>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">Redact</span>
                        <Switch
                          checked={redactionEnabled}
                          onCheckedChange={setRedactionEnabled}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/20 min-h-[120px] font-mono text-sm whitespace-pre-wrap">
                    {output || (
                      <span className="text-muted-foreground">
                        Output will appear here...
                      </span>
                    )}
                  </div>

                  {/* Golden Comparison */}
                  <AnimatePresence>
                    {showGoldenComparison && output && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 overflow-hidden"
                      >
                        <label className="text-xs text-muted-foreground mb-1 block">
                          Golden Output (Expected)
                        </label>
                        <div className="p-4 rounded-lg bg-success/10 border border-success/20 min-h-[60px] font-mono text-sm">
                          {goldenOutput}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right: Regression Tests */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Regression Tests</h4>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleRunTests}
                      disabled={isRunningTests}
                      className="gap-1.5"
                    >
                      {isRunningTests ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          Run All
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {testCases.map((test, idx) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={cn(
                        'p-4 rounded-xl border transition-smooth',
                        test.status === 'passed' && 'bg-success/5 border-success/20',
                        test.status === 'failed' && 'bg-destructive/5 border-destructive/20',
                        test.status === 'pending' && 'bg-secondary/30 border-border/50'
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium">{test.name}</span>
                        <div className="flex items-center gap-1.5">
                          {test.status === 'passed' && (
                            <>
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span className="text-xs text-success">Passed</span>
                            </>
                          )}
                          {test.status === 'failed' && (
                            <>
                              <XCircle className="w-4 h-4 text-destructive" />
                              <span className="text-xs text-destructive">Failed</span>
                            </>
                          )}
                          {test.status === 'pending' && (
                            <>
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-mono bg-secondary/30 px-1.5 py-0.5 rounded">
                          {test.input.slice(0, 40)}
                          {test.input.length > 40 && '...'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
