import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, KeyRound, Loader2, Send, Sparkles, UserRound } from "lucide-react";
import clsx from "clsx";
import { STARTER_QUESTIONS } from "../../constants";
import type { ChatAssistantProps, ChatMessage } from "../../types";
import { askGemini, hasGeminiKey } from "../../services/gemini";
import { answerFromLocalAnalytics } from "../../utils/analytics";
import { MarkdownMessage } from "./MarkdownMessage";

const getPromptLabel = (question: string) => {
  if (question.includes("highest total collection")) {
    return "Top collection city";
  }

  if (question.includes("rejected in Mumbai")) {
    return "Mumbai rejections";
  }

  if (question.includes("Delhi properties are approved")) {
    return "Delhi approval rate";
  }

  if (question.includes("most pending")) {
    return "Most pending city";
  }

  if (question.includes("Pune and Jaipur")) {
    return "Pune vs Jaipur";
  }

  return question;
};

export function ChatAssistant({ dataContext, records }: ChatAssistantProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask me about registrations, approval rates, rejected records, pending cases or tax collection across UPYOG tenants.",
    },
  ]);

  const disabledReason = useMemo(
    () =>
      hasGeminiKey
        ? ""
        : "Gemini key missing. Local analytics answers still work for the sample questions.",
    [],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, isLoading]);

  const submitQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const localAnswer = answerFromLocalAnalytics(trimmed, records);
      const answer = localAnswer || (await askGemini(trimmed, dataContext));
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "The AI assistant could not answer right now.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitQuestion(input);
  };

  return (
    <aside className="flex h-[620px] min-h-0 min-w-0 flex-col overflow-hidden rounded-sm border border-white/10 bg-[var(--surface)] shadow-xl shadow-black/15 xl:h-[887px]">
      <div className="shrink-0 border-b border-white/10 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--saffron)]">
              Gemini Assistant
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-[var(--ivory)]">
              Ask the civic data desk
            </h2>
          </div>
          <span className="grid h-10 w-10 place-items-center border border-[var(--teal)]/30 bg-[var(--teal)]/10 text-[var(--teal)]">
            <Sparkles size={19} />
          </span>
        </div>

        {disabledReason ? (
          <div className="mt-4 flex gap-2 border border-[var(--saffron)]/25 bg-[var(--saffron)]/10 p-3 text-sm text-[var(--ivory)]/78">
            <KeyRound className="mt-0.5 shrink-0 text-[var(--saffron)]" size={16} />
            <p>{disabledReason}</p>
          </div>
        ) : null}
      </div>

      <div className="min-w-0 shrink-0 border-b border-white/10 px-4 py-3">
        <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/40">
          Quick prompts
        </p>
        <div className="grid min-w-0 grid-cols-2 gap-2">
          {STARTER_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              className="min-w-0 truncate border border-white/10 bg-white/[0.035] px-3 py-2 text-left text-xs font-medium text-white/62 transition hover:border-[var(--teal)]/45 hover:bg-[var(--teal)]/10 hover:text-[var(--ivory)]"
              title={question}
              onClick={() => void submitQuestion(question)}
            >
              {getPromptLabel(question)}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 basis-0 space-y-4 overflow-y-auto overscroll-contain p-4 pr-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={clsx(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {message.role === "assistant" ? (
              <span className="grid h-8 w-8 shrink-0 place-items-center border border-white/10 bg-white/[0.06] text-[var(--teal)]">
                <Bot size={16} />
              </span>
            ) : null}
            <div
              className={clsx(
                "max-w-[86%] border px-3 py-2 text-sm leading-relaxed",
                message.role === "user"
                  ? "border-[var(--saffron)]/35 bg-[var(--saffron)]/12 text-[var(--ivory)]"
                  : "border-white/10 bg-white/[0.05] text-white/72",
              )}
            >
              {message.role === "assistant" ? (
                <MarkdownMessage content={message.content} />
              ) : (
                message.content
              )}
            </div>
            {message.role === "user" ? (
              <span className="grid h-8 w-8 shrink-0 place-items-center border border-white/10 bg-white/[0.06] text-[var(--saffron)]">
                <UserRound size={16} />
              </span>
            ) : null}
          </div>
        ))}

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-white/55">
            <Loader2 className="animate-spin" size={16} />
            Consulting the dataset summary...
          </div>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      <form className="flex shrink-0 gap-2 border-t border-white/10 p-4" onSubmit={handleSubmit}>
        <input
          className="min-w-0 flex-1 rounded-sm border border-white/12 bg-[var(--panel)] px-3 text-sm text-[var(--ivory)] outline-none placeholder:text-white/35 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about collection, approvals, city comparison..."
        />
        <button
          className="grid h-11 w-11 place-items-center rounded-sm bg-[var(--saffron)] text-[var(--ink)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Send question"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </form>
    </aside>
  );
}
