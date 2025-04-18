import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
  { id: 3, content: "That's awesome! What are you working on?", isSent: false },
  { id: 4, content: "A new chat interface with themes!", isSent: true },
  { id: 5, content: "Sounds interesting! Can't wait to see it!", isSent: false },
  { id: 6, content: "Thanks! Still polishing the UI.", isSent: true },
  { id: 7, content: "Let me know if you need feedback!", isSent: false },
  { id: 8, content: "Of course! Appreciate it.", isSent: true }
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Theme Selection (Left) */}
      <div className="space-y-6 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200 p-4 rounded-lg border border-base-300 flex flex-col">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </div>
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors 
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}`}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-12 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-2 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-sm font-medium truncate w-full text-center">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Chat Preview (Right) */}
      <div className="h-full rounded-xl border border-base-300 bg-base-100 shadow-lg overflow-hidden flex flex-col">
        <div className="p-4 bg-base-200 flex-1 overflow-y-auto">
          <div className="max-w-lg mx-auto">
            {/* Chat UI */}
            <div className="bg-base-100 rounded-xl shadow-sm flex flex-col h-full">
              {/* Header */}
              <div className="px-4 py-3 p-4 border-b-[3px] border-primary/100 text-lg border-base-300 bg-base-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                  J
                </div>
                <div>
                  <h3 className="font-medium text-sm">John Doe</h3>
                  <p className="text-xs text-base-content/70">Online</p>
                </div>
              </div>
              {/* Messages */}
              <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                {PREVIEW_MESSAGES.map((message) => (
                 <div className={`chat ${message.isSent ? "chat-end" : "chat-start"}`}>
                  <div className="chat-header mb-1">
                                <p className="text-xs opacity-50 ml-1">
                                                12:00</p>
                              </div>
                  <div className={`chat-bubble font-semibold ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200 text-primary/100"}`}> 
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Input */}
              <div className="p-4 flex gap-2">
                <input type="text" className="input flex-1 text-sm rounded-3xl border-[3px] border-primary/100" placeholder="Type a message..." value="This is a preview" readOnly />
                <button className="btn btn-primary btn-circle btn-md">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
