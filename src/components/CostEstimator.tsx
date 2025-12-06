import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, X } from 'lucide-react';
import { models, Model, calculateCost } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CostEstimatorProps {
  currentModel: Model;
  promptTokens: number;
}

export function CostEstimator({ currentModel, promptTokens }: CostEstimatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(currentModel);
  const [requestsPerDay, setRequestsPerDay] = useState(1000);
  const [avgInputTokens, setAvgInputTokens] = useState(150);
  const [avgOutputTokens, setAvgOutputTokens] = useState(300);

  const totalInputTokens = promptTokens + avgInputTokens;
  const costPerRequest = calculateCost(selectedModel, totalInputTokens, avgOutputTokens);
  const dailyCost = costPerRequest * requestsPerDay;
  const monthlyCost = dailyCost * 30;
  const yearlyCost = dailyCost * 365;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Calculator className="w-4 h-4" />
          Cost Estimator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md glass-panel-solid">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-warning" />
            Batch Cost Estimator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Model Selection */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Model</label>
            <Select
              value={selectedModel.id}
              onValueChange={(id) => setSelectedModel(models.find((m) => m.id === id)!)}
            >
              <SelectTrigger className="bg-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Requests per Day */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-muted-foreground">Requests/Day</label>
              <span className="text-sm font-mono">{requestsPerDay.toLocaleString()}</span>
            </div>
            <Slider
              value={[requestsPerDay]}
              onValueChange={([v]) => setRequestsPerDay(v)}
              min={100}
              max={100000}
              step={100}
            />
          </div>

          {/* Avg Input Tokens */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-muted-foreground">Avg Input Tokens</label>
              <span className="text-sm font-mono">{avgInputTokens}</span>
            </div>
            <Slider
              value={[avgInputTokens]}
              onValueChange={([v]) => setAvgInputTokens(v)}
              min={50}
              max={2000}
              step={10}
            />
          </div>

          {/* Avg Output Tokens */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-muted-foreground">Avg Output Tokens</label>
              <span className="text-sm font-mono">{avgOutputTokens}</span>
            </div>
            <Slider
              value={[avgOutputTokens]}
              onValueChange={([v]) => setAvgOutputTokens(v)}
              min={50}
              max={4000}
              step={10}
            />
          </div>

          {/* Cost Breakdown */}
          <div className="pt-4 border-t border-border/50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cost per Request</span>
              <span className="font-mono">${costPerRequest.toFixed(6)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Daily Estimate</span>
              <span className="font-mono">${dailyCost.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly Estimate</span>
              <motion.span
                key={monthlyCost}
                initial={{ scale: 1.1, color: 'hsl(var(--warning))' }}
                animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                className="text-xl font-semibold font-mono"
              >
                ${monthlyCost.toFixed(2)}
              </motion.span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Yearly Estimate</span>
              <span className="font-mono text-warning">${yearlyCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Info Note */}
          <p className="text-xs text-muted-foreground">
            Estimates based on {selectedModel.name} pricing: ${selectedModel.costPer1kInput}/1k input, ${selectedModel.costPer1kOutput}/1k output tokens. 
            Prompt tokens ({promptTokens}) are included in input calculations.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
