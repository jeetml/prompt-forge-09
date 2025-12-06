// Mock data for the Prompt Versioning & Ops app

export interface Version {
  id: string;
  name: string;
  type: 'branch' | 'tag';
  isProduction: boolean;
  author: string;
  timestamp: string;
  tokenCount: number;
  commits: Commit[];
}

export interface Commit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  tokenDelta: number;
}

export interface DiffBlock {
  id: string;
  type: 'added' | 'removed' | 'changed' | 'unchanged';
  oldContent?: string;
  newContent?: string;
  tokenDelta: number;
  lineNumber: number;
  comments: DiffComment[];
}

export interface DiffComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Reviewer {
  id: string;
  name: string;
  avatar: string;
  approved: boolean;
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  status: 'passed' | 'failed' | 'pending';
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  costPer1kInput: number;
  costPer1kOutput: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  tokenCount: number;
}

export const models: Model[] = [
  { id: 'gpt-4', name: 'GPT-4 Turbo', provider: 'OpenAI', costPer1kInput: 0.01, costPer1kOutput: 0.03 },
  { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', provider: 'OpenAI', costPer1kInput: 0.0005, costPer1kOutput: 0.0015 },
  { id: 'claude-3', name: 'Claude 3 Opus', provider: 'Anthropic', costPer1kInput: 0.015, costPer1kOutput: 0.075 },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', costPer1kInput: 0.003, costPer1kOutput: 0.015 },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', costPer1kInput: 0.00025, costPer1kOutput: 0.0005 },
];

export const workspaces = [
  { id: 'ws-1', name: 'Production', icon: '🚀' },
  { id: 'ws-2', name: 'Development', icon: '🔧' },
  { id: 'ws-3', name: 'Staging', icon: '🧪' },
];

export const versions: Version[] = [
  {
    id: 'main',
    name: 'main',
    type: 'branch',
    isProduction: true,
    author: 'Sarah Chen',
    timestamp: '2024-01-15T10:30:00Z',
    tokenCount: 1247,
    commits: [
      { id: 'c1', message: 'Add context window optimization', author: 'Sarah Chen', timestamp: '2024-01-15T10:30:00Z', tokenDelta: -45 },
      { id: 'c2', message: 'Improve response formatting', author: 'Alex Kim', timestamp: '2024-01-14T15:20:00Z', tokenDelta: 12 },
    ],
  },
  {
    id: 'feature/multi-turn',
    name: 'feature/multi-turn',
    type: 'branch',
    isProduction: false,
    author: 'Alex Kim',
    timestamp: '2024-01-14T09:15:00Z',
    tokenCount: 1389,
    commits: [
      { id: 'c3', message: 'Add conversation memory handling', author: 'Alex Kim', timestamp: '2024-01-14T09:15:00Z', tokenDelta: 142 },
    ],
  },
  {
    id: 'v2.1.0',
    name: 'v2.1.0',
    type: 'tag',
    isProduction: false,
    author: 'Sarah Chen',
    timestamp: '2024-01-10T14:00:00Z',
    tokenCount: 1280,
    commits: [],
  },
  {
    id: 'experiment/cot',
    name: 'experiment/cot',
    type: 'branch',
    isProduction: false,
    author: 'Jordan Lee',
    timestamp: '2024-01-12T11:45:00Z',
    tokenCount: 1456,
    commits: [
      { id: 'c4', message: 'Add chain-of-thought prompting', author: 'Jordan Lee', timestamp: '2024-01-12T11:45:00Z', tokenDelta: 209 },
    ],
  },
];

export const diffBlocks: DiffBlock[] = [
  {
    id: 'd1',
    type: 'unchanged',
    oldContent: 'You are a helpful AI assistant.',
    newContent: 'You are a helpful AI assistant.',
    tokenDelta: 0,
    lineNumber: 1,
    comments: [],
  },
  {
    id: 'd2',
    type: 'removed',
    oldContent: 'Always respond in a formal tone.',
    tokenDelta: -8,
    lineNumber: 2,
    comments: [],
  },
  {
    id: 'd3',
    type: 'added',
    newContent: 'Respond in a friendly, conversational tone while maintaining professionalism.',
    tokenDelta: 12,
    lineNumber: 3,
    comments: [
      { id: 'cm1', author: 'Sarah Chen', content: 'This aligns better with our brand voice', timestamp: '2024-01-15T11:00:00Z' },
    ],
  },
  {
    id: 'd4',
    type: 'changed',
    oldContent: 'Limit responses to 100 words.',
    newContent: 'Keep responses concise but comprehensive. Aim for clarity over brevity.',
    tokenDelta: 8,
    lineNumber: 4,
    comments: [],
  },
  {
    id: 'd5',
    type: 'unchanged',
    oldContent: 'If unsure, ask clarifying questions.',
    newContent: 'If unsure, ask clarifying questions.',
    tokenDelta: 0,
    lineNumber: 5,
    comments: [],
  },
];

export const reviewers: Reviewer[] = [
  { id: 'r1', name: 'Sarah Chen', avatar: 'SC', approved: true },
  { id: 'r2', name: 'Alex Kim', avatar: 'AK', approved: true },
  { id: 'r3', name: 'Jordan Lee', avatar: 'JL', approved: false },
  { id: 'r4', name: 'Taylor Swift', avatar: 'TS', approved: false },
];

export const testCases: TestCase[] = [
  {
    id: 't1',
    name: 'Basic greeting',
    input: 'Hello, how are you?',
    expectedOutput: 'Hello! I\'m doing well, thank you for asking. How can I assist you today?',
    status: 'passed',
  },
  {
    id: 't2',
    name: 'Technical question',
    input: 'Explain quantum computing',
    expectedOutput: 'Quantum computing leverages quantum mechanical phenomena...',
    status: 'passed',
  },
  {
    id: 't3',
    name: 'Edge case - empty input',
    input: '',
    expectedOutput: 'I noticed your message was empty. Could you please share what you\'d like help with?',
    status: 'failed',
  },
  {
    id: 't4',
    name: 'Multi-turn context',
    input: 'What did I just ask about?',
    expectedOutput: 'You were asking about quantum computing...',
    status: 'pending',
  },
];

export const promptTemplates: PromptTemplate[] = [
  {
    id: 'pt1',
    name: 'System Context',
    content: 'You are an AI assistant for {{company_name}}. Your role is to help users with {{use_case}}.',
    category: 'System',
    tokenCount: 24,
  },
  {
    id: 'pt2',
    name: 'Output Format',
    content: 'Format your response as:\n1. Summary (2-3 sentences)\n2. Key Points\n3. Next Steps',
    category: 'Formatting',
    tokenCount: 32,
  },
  {
    id: 'pt3',
    name: 'Safety Rails',
    content: 'Do not provide medical, legal, or financial advice. Redirect users to professionals for such queries.',
    category: 'Safety',
    tokenCount: 28,
  },
  {
    id: 'pt4',
    name: 'Persona - Friendly',
    content: 'Maintain a warm, friendly tone. Use conversational language and occasional emoji when appropriate.',
    category: 'Persona',
    tokenCount: 22,
  },
];

export const dashboardStats = {
  totalRuns: 12847,
  avgTokens: 847,
  avgLatency: 1.24,
  totalCost: 156.42,
  successRate: 98.7,
  feedbackPositive: 4521,
  feedbackNegative: 234,
};

// Mock prompt content
export const mockPromptContent = `You are a helpful AI assistant for Acme Corp.

## Core Behavior
- Respond in a friendly, conversational tone while maintaining professionalism
- Keep responses concise but comprehensive
- If unsure, ask clarifying questions before proceeding

## Output Format
When providing information:
1. Start with a brief summary
2. Provide detailed explanation if needed
3. End with actionable next steps

## Safety Guidelines
- Never provide medical, legal, or financial advice
- Redirect users to appropriate professionals when needed
- Maintain user privacy and data security

## Context Handling
- Remember conversation history within the session
- Reference previous exchanges when relevant
- Acknowledge when context is unclear`;

// Utility function to estimate token count (simple heuristic)
export const estimateTokens = (text: string): number => {
  if (!text) return 0;
  // Rough estimation: ~1.3 tokens per word for English
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words * 1.3);
};

// Calculate cost based on model and token counts
export const calculateCost = (
  model: Model,
  inputTokens: number,
  outputTokens: number
): number => {
  const inputCost = (inputTokens / 1000) * model.costPer1kInput;
  const outputCost = (outputTokens / 1000) * model.costPer1kOutput;
  return inputCost + outputCost;
};
