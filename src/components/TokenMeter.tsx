import { motion } from 'framer-motion';
import { Coins, ArrowRight } from 'lucide-react';
import { Model, calculateCost } from '@/lib/mockData';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TokenMeterProps {
  promptTokens: number;
  inputTokens: number;
  outputTokens: number;
  model: Model;
}

export function TokenMeter({
  promptTokens,
  inputTokens,
  outputTokens,
  model,
}: TokenMeterProps) {
  const totalInputTokens = promptTokens + inputTokens;
  const estimatedCost = calculateCost(model, totalInputTokens, outputTokens);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary/30 border border-border/50"
          whileHover={{ scale: 1.02 }}
        >
          {/* Token Counts */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground">Prompt</span>
              <motion.span
                key={promptTokens}
                initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
                animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                className="font-mono font-medium"
              >
                {promptTokens.toLocaleString()}
              </motion.span>
            </div>
            <span className="text-muted-foreground">+</span>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground">Input</span>
              <span className="font-mono font-medium">{inputTokens.toLocaleString()}</span>
            </div>
            <ArrowRight className="w-3 h-3 text-muted-foreground mx-1" />
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground">Output</span>
              <span className="font-mono font-medium">{outputTokens.toLocaleString()}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-border" />

          {/* Cost Estimate */}
          <div className="flex items-center gap-1.5 text-warning">
            <Coins className="w-3.5 h-3.5" />
            <span className="font-mono text-sm font-medium">
              ${estimatedCost.toFixed(4)}
            </span>
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <div className="space-y-2 text-xs">
          <p className="font-medium">Token Breakdown</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-muted-foreground">System Prompt:</span>
            <span>{promptTokens} tokens</span>
            <span className="text-muted-foreground">Sample Input:</span>
            <span>{inputTokens} tokens</span>
            <span className="text-muted-foreground">Est. Output:</span>
            <span>{outputTokens} tokens</span>
          </div>
          <div className="pt-2 border-t border-border">
            <span className="text-muted-foreground">Model: </span>
            <span>{model.name}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
