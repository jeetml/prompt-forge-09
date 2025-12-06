import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Search,
  Command,
  Coins,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { models, workspaces, Model } from '@/lib/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  selectedModel: Model;
  onModelChange: (model: Model) => void;
  tokenCost: number;
}

export function Header({ selectedModel, onModelChange, tokenCost }: HeaderProps) {
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-18 px-6 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl">
      {/* Left: Logo + Workspace */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg tracking-tight">PromptOps</span>
        </div>

        {/* Workspace Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth focus-ring">
              <span className="text-sm">{selectedWorkspace.icon}</span>
              <span className="text-sm font-medium">{selectedWorkspace.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 glass-panel-solid">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => setSelectedWorkspace(ws)}
                className="gap-2 cursor-pointer"
              >
                <span>{ws.icon}</span>
                <span>{ws.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center: Search */}
      <motion.div
        className="flex-1 max-w-md mx-8"
        animate={{ scale: searchFocused ? 1.02 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <div
          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/30 border transition-smooth ${
            searchFocused ? 'border-primary/50 bg-secondary/50' : 'border-transparent'
          }`}
        >
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search prompts, versions..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <div className="flex items-center gap-1">
            <kbd className="kbd"><Command className="w-2.5 h-2.5" /></kbd>
            <kbd className="kbd">K</kbd>
          </div>
        </div>
      </motion.div>

      {/* Right: Model, Cost, Avatar */}
      <div className="flex items-center gap-4">
        {/* Model Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary/50 transition-smooth focus-ring">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium">{selectedModel.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-panel-solid">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Select Model</DropdownMenuLabel>
            {models.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => onModelChange(model)}
                className="flex flex-col items-start gap-0.5 cursor-pointer"
              >
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">
                  ${model.costPer1kInput}/1k in · ${model.costPer1kOutput}/1k out
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Token Cost Chip */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-sm font-medium">
          <Coins className="w-3.5 h-3.5" />
          <span>${tokenCost.toFixed(4)}</span>
        </div>

        {/* User Avatar Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-cyan-400/80 flex items-center justify-center text-sm font-semibold text-primary-foreground focus-ring">
              SC
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 glass-panel-solid">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>Sarah Chen</span>
                <span className="text-xs text-muted-foreground font-normal">sarah@acme.com</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings className="w-4 h-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <HelpCircle className="w-4 h-4" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
              <LogOut className="w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
