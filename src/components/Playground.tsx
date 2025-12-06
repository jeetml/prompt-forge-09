import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Upload,
  Sparkles,
  Zap,
  Terminal,
  FlaskConical,
  RotateCcw,
  Copy,
  Check,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PlaygroundProps {
  selectedModel: Model;
  isOpen: boolean;
  onClose: () => void;
}

export function Playground({ selectedModel, isOpen, onClose }: PlaygroundProps) {
  const [selectedVersion, setSelectedVersion] = useState<string>(versions[0].id);
  const [input, setInput] = useState('Hello, can you help me with a coding question?');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [redactionEnabled, setRedactionEnabled] = useState(false);
  const [showGoldenComparison, setShowGoldenComparison] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>(mockTestCases);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('playground');

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');

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

    for (let i = 0; i < testCases.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
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

  const handleResetTests = () => {
    setTestCases(mockTestCases.map(tc => ({ ...tc, status: 'pending' as const })));
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goldenOutput = 'Hello! I\'m doing well, thank you for asking. How can I assist you today?';
  
  const passedCount = testCases.filter(tc => tc.status === 'passed').length;
  const failedCount = testCases.filter(tc => tc.status === 'failed').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0 bg-card/95 backdrop-blur-xl border-border/50 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">Playground & Testing</DialogTitle>
                <p className="text-sm text-muted-foreground">Run prompts and validate with test cases</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4">
            <TabsList className="bg-secondary/30 p-1">
              <TabsTrigger value="playground" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Terminal className="w-4 h-4" />
                Playground
              </TabsTrigger>
              <TabsTrigger value="tests" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Zap className="w-4 h-4" />
                Regression Tests
                {(passedCount > 0 || failedCount > 0) && (
                  <span className="ml-1 text-xs">
                    <span className="text-success">{passedCount}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-destructive">{failedCount}</span>
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Playground Tab */}
          <TabsContent value="playground" className="flex-1 overflow-auto m-0 p-6 pt-4">
            <div className="space-y-5">
              {/* Controls */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                    Prompt Version
                  </label>
                  <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                    <SelectTrigger className="bg-secondary/30 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          <div className="flex items-center gap-2">
                            <span>{v.name}</span>
                            {v.isProduction && (
                              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-success/20 text-success font-medium">
                                PROD
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Model</label>
                  <div className="px-3 py-2.5 rounded-lg bg-secondary/30 border border-border/50 text-sm flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    {selectedModel.name}
                  </div>
                </div>
              </div>

              {/* Input */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Test Input</label>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter test input..."
                  rows={4}
                  className="bg-secondary/30 border-border/50 resize-none font-mono text-sm"
                />
              </div>

              {/* Run Button */}
              <Button
                onClick={handleRun}
                disabled={isRunning || !input.trim()}
                className="w-full gap-2 h-11"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Prompt
                  </>
                )}
              </Button>

              {/* Output */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-muted-foreground font-medium">Response</label>
                  <div className="flex items-center gap-4">
                    {output && (
                      <button
                        onClick={handleCopyOutput}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                    <button
                      onClick={() => setShowGoldenComparison(!showGoldenComparison)}
                      className={cn(
                        'flex items-center gap-1.5 text-xs transition-smooth',
                        showGoldenComparison ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {showGoldenComparison ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      Golden
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
                <div className="p-4 rounded-xl bg-secondary/20 border border-border/30 min-h-[140px] font-mono text-sm whitespace-pre-wrap">
                  {output || (
                    <span className="text-muted-foreground italic">
                      Output will appear here after running...
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
                      className="mt-3 overflow-hidden"
                    >
                      <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                        Golden Output (Expected)
                      </label>
                      <div className="p-4 rounded-xl bg-success/5 border border-success/20 min-h-[60px] font-mono text-sm">
                        {goldenOutput}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="flex-1 overflow-auto m-0 p-6 pt-4">
            <div className="space-y-4">
              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Cases
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleResetTests} className="gap-1.5 text-muted-foreground">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </Button>
                </div>
                <Button
                  onClick={handleRunTests}
                  disabled={isRunningTests}
                  className="gap-1.5"
                >
                  {isRunningTests ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run All Tests
                    </>
                  )}
                </Button>
              </div>

              {/* Test Summary */}
              {(passedCount > 0 || failedCount > 0) && (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/20 border border-border/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">{passedCount} passed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-destructive" />
                    <span className="text-sm">{failedCount} failed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {testCases.length - passedCount - failedCount} pending
                    </span>
                  </div>
                </div>
              )}

              {/* Test Cases */}
              <div className="space-y-2">
                {testCases.map((test, idx) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      'p-4 rounded-xl border transition-all duration-200',
                      test.status === 'passed' && 'bg-success/5 border-success/30',
                      test.status === 'failed' && 'bg-destructive/5 border-destructive/30',
                      test.status === 'pending' && 'bg-secondary/20 border-border/30 hover:border-border/50'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium">{test.name}</span>
                      <div className="flex items-center gap-1.5">
                        {test.status === 'passed' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-success" />
                            <span className="text-xs text-success font-medium">Passed</span>
                          </>
                        )}
                        {test.status === 'failed' && (
                          <>
                            <XCircle className="w-4 h-4 text-destructive" />
                            <span className="text-xs text-destructive font-medium">Failed</span>
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
                    <div className="text-xs text-muted-foreground font-mono bg-secondary/30 px-2 py-1.5 rounded-lg">
                      {test.input.slice(0, 60)}
                      {test.input.length > 60 && '...'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
