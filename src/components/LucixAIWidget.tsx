import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Download, ExternalLink, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PLAY_STORE_URL = 'https://play.google.com/store/search?q=lucix+ai&c=apps';
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lucix-chat`;

type Msg = {role: 'user' | 'assistant';content: string;};

export function LucixAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    let assistantSoFar = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!resp.ok || !resp.body) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to connect');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error('Chat error:', e);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button - Prominent with "AI" label */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2 rounded-full shadow-2xl px-5 h-14 transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.5)'
        }}
        aria-label="Open Lucix AI">

        {isOpen ?
        <X className="h-6 w-6 text-white" /> :

        <>
            <Bot className="h-6 w-6 text-white" />
            <span className="text-white font-bold text-sm">AI</span>
          </>
        }
      </button>

      {/* Chat Panel */}
      {isOpen &&
      <div className="fixed bottom-44 right-4 md:bottom-24 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-96 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col" style={{ maxHeight: '70vh' }}>
          {/* Header */}
          <div
          className="p-4 flex items-center justify-between flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Lucix AI</h3>
                <p className="text-white/80 text-xs">Free & Fast ✨</p>
              </div>
            </div>
            <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white/80 hover:text-white text-xs transition-colors">

              <Download className="h-3 w-3" />
              App
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '200px', maxHeight: '400px' }}>
            {messages.length === 0 &&
          <div className="text-center py-8">
                <Bot className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground font-medium">Hi! I'm Lucix AI 👋</p>
                <p className="text-xs text-muted-foreground mt-1">Ask me anything — Free & Unlimited!</p>
              </div>
          }
            {messages.map((msg, i) =>
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
              msg.role === 'user' ?
              'bg-primary text-primary-foreground rounded-br-md' :
              'bg-secondary text-secondary-foreground rounded-bl-md'}`
              }>

                  {msg.content}
                </div>
              </div>
          )}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' &&
          <div className="flex justify-start">
                <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
          }
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex-shrink-0">
            <div className="flex gap-2">
              <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-secondary rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
              disabled={isLoading} />

              <Button
              size="icon"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="rounded-xl h-10 w-10 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>

                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      }
    </>);

}