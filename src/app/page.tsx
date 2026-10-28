
"use client";

import { useState } from "react";
import rules from "./rules.json";

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

const restaurantRules = rules as Rule[];

const initialGreeting =
  "👋 Welcome to Desi Bites!\nI'm your friendly restaurant assistant in Sargodha. Ask me about our menu, special deals, delivery, timings, location, or payment options.";

const quickTopics = [
  { label: "Menu", message: "Show me the menu", icon: "🍽️" },
  { label: "Deals", message: "What deals do you have?", icon: "🔥" },
  { label: "Timings", message: "What are your timings?", icon: "🕒" },
  { label: "Location", message: "Where are you located?", icon: "📍" },
  { label: "Delivery", message: "Do you offer delivery?", icon: "🛵" },
  { label: "Payment", message: "What payment methods do you accept?", icon: "💳" },
];

function getBotReply(message: string): string {
  // Match complete words so "hi" does not match "this".
  const words = new Set(
    message.toLowerCase().match(/[a-z0-9]+/g) ?? []
  );

  for (const rule of restaurantRules) {
    const matched = rule.keywords.some((keyword) => {
      const keywordWords =
        keyword.toLowerCase().match(/[a-z0-9]+/g) ?? [];

      return (
        keywordWords.length > 0 &&
        keywordWords.every((word) => words.has(word))
      );
    });

    if (matched) {
      return rule.reply;
    }
  }

  return "😊 I'm sorry, I didn't quite understand that. You can ask me about our menu, deals, delivery, timings, location, payment, or how to order. Try one of the quick-topic buttons above!";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: initialGreeting,
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  function sendMessage(messageText?: string) {
    const text = (messageText ?? input).trim();

    if (!text || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      const reply = getBotReply(text);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: reply,
        },
      ]);

      setIsTyping(false);
    }, 500);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF8F0] px-3 py-5 text-[#3D2418] sm:px-6 sm:py-8">
      {/* Decorative background shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-5xl flex-col overflow-hidden rounded-[28px] border border-orange-100 bg-white/90 shadow-2xl shadow-orange-900/10 backdrop-blur sm:min-h-[calc(100vh-4rem)]">
        {/* Restaurant header */}
        <header className="relative overflow-hidden bg-gradient-to-r from-[#C2410C] via-[#F97316] to-[#FB923C] px-5 py-6 text-white sm:px-8 sm:py-7">
          <div
            aria-hidden="true"
            className="absolute -right-8 -top-16 h-48 w-48 rounded-full border-[25px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[-55px] right-36 h-32 w-32 rounded-full bg-amber-300/20 blur-xl"
          />

          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-3xl shadow-lg backdrop-blur transition duration-300 hover:rotate-6 hover:scale-105">
              🍛
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Desi Bites
              </h1>
              <p className="mt-1 text-sm font-medium text-orange-50 sm:text-base">
                Good Food. Great Mood.
              </p>
              <p className="mt-1 text-xs text-orange-100">
                Restaurant Assistant · Sargodha
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2.5 text-sm font-medium shadow-sm sm:flex">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-300" />
              Online & Ready
            </div>
          </div>
        </header>

        {/* Intro section */}
        <section className="border-b border-orange-100 bg-gradient-to-br from-[#FFF7ED] via-white to-[#FFEDD5]/60 px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-md shadow-orange-100 ring-1 ring-orange-100">
              👨‍🍳
            </div>

            <div>
              <h2 className="text-lg font-extrabold tracking-tight sm:text-xl">
                What are you craving today?
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#805744]">
                Explore our menu, discover tasty deals, or ask anything
                about Desi Bites. We&apos;re here to help!
              </p>
            </div>
          </div>

          {/* Quick-topic buttons */}
          <div className="mt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-orange-800/70">
              Explore our restaurant
            </p>

            <div className="flex flex-wrap gap-2.5">
              {quickTopics.map((topic, index) => (
                <button
                  key={topic.label}
                  type="button"
                  disabled={isTyping}
                  onClick={() => sendMessage(topic.message)}
                  className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    index === 0
                      ? "border-orange-600 bg-orange-600 text-white shadow-md shadow-orange-200 hover:bg-orange-700"
                      : "border-orange-200 bg-white text-[#7C2D12] hover:border-orange-400 hover:bg-orange-50"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:scale-110"
                  >
                    {topic.icon}
                  </span>
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Chat conversation */}
        <section
          className="flex-1 space-y-6 overflow-y-auto bg-gradient-to-b from-white to-[#FFFCF8] px-4 py-6 sm:px-8 sm:py-8"
          aria-label="Chat conversation"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((message) => {
            const isUser = message.sender === "user";

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2.5 sm:gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-200 text-lg shadow-sm ring-1 ring-orange-100 sm:h-10 sm:w-10"
                  >
                    🍛
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3.5 text-sm leading-6 shadow-sm transition-all duration-300 sm:max-w-[78%] sm:px-5 ${
                    isUser
                      ? "rounded-br-md bg-gradient-to-br from-[#EA580C] to-[#F97316] text-white shadow-orange-200/70"
                      : "rounded-bl-md border border-orange-100 bg-white text-[#493326] shadow-orange-100/50"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                </div>

                {isUser && (
                  <div
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFEDD5] text-lg ring-1 ring-orange-100 sm:h-10 sm:w-10"
                  >
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div
              className="flex items-end gap-3"
              role="status"
              aria-label="Assistant is typing"
            >
              <div
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-lg"
              >
                🍛
              </div>

              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-orange-100 bg-white px-5 py-4 shadow-sm">
                <span className="mr-1 text-sm text-[#805744]">
                  Typing
                </span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-500" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-500 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-500 [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </section>

        {/* Message composer */}
        <footer className="border-t border-orange-100 bg-white px-4 py-4 sm:px-8 sm:py-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 rounded-[22px] border border-orange-100 bg-[#FFF8F0] p-2 shadow-inner shadow-orange-100/60 transition-all duration-300 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 sm:gap-3"
          >
            <span
              aria-hidden="true"
              className="hidden pl-2 text-xl sm:inline"
            >
              💬
            </span>

            <label htmlFor="chat-message" className="sr-only">
              Type your message
            </label>

            <input
              id="chat-message"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about food, prices, or delivery..."
              autoComplete="off"
              disabled={isTyping}
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-[#3D2418] outline-none placeholder:text-[#B39A89] disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#F97316] px-4 py-3 text-sm font-bold text-white shadow-md shadow-orange-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:px-5"
            >
              <span>Send</span>
              <span aria-hidden="true" className="text-base">
                ➤
              </span>
            </button>
          </form>

          <div className="mt-4 flex flex-col items-center justify-center gap-1 text-center sm:flex-row sm:gap-2">
            <span className="text-xs text-[#A18876]">
              Made with ❤️ for food lovers
            </span>
            <span className="hidden text-orange-200 sm:inline">•</span>
            <span className="text-xs text-[#A18876]">
              Desi Bites Demo Chatbot · Next.js & TypeScript
            </span>
          </div>

          <p className="mt-2 text-center text-[10px] leading-4 text-[#A18876]">
            Demo restaurant details, prices, and contact information.
            No real orders or payments are processed.
          </p>
        </footer>
      </div>
    </main>
  );
}
