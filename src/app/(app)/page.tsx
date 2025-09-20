
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { empatheticChat } from "@/ai/flows/empathetic-chat";
import { detectCrisis } from "@/ai/flows/crisis-detection";
import type { ChatMessage } from "@/lib/types";
import { SaathiIcon } from "@/components/icons";
import { CrisisAlert } from "@/components/crisis-alert";
import { SendHorizonal, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm Saathi, your personal wellness companion. How are you feeling today? Feel free to share anything that's on your mind. I'm here to listen without judgment.",
      },
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const crisisCheck = await detectCrisis({ text: input });
      if (crisisCheck.isCrisis && crisisCheck.confidence > 0.7) {
        setShowCrisisAlert(true);
      }

      const response = await empatheticChat({ message: input });
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error with AI flow:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm having a little trouble connecting right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <h1 className="hidden text-3xl font-headline md:block mb-4">Chat with Saathi</h1>
      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[calc(100svh-16rem)] md:h-[calc(100svh-18rem)]" viewportRef={scrollAreaRef}>
             <div className="space-y-6 p-4 md:p-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === "user" ? "justify-end" : ""
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <div className="flex h-full w-full items-center justify-center bg-primary/10">
                        <SaathiIcon className="h-5 w-5 text-primary" />
                      </div>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-md rounded-2xl p-3 px-4",
                      message.role === "user"
                        ? "rounded-br-none bg-primary/90 text-primary-foreground"
                        : "rounded-bl-none bg-muted"
                    )}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <div className="flex h-full w-full items-center justify-center bg-primary/10">
                      <SaathiIcon className="h-5 w-5 text-primary" />
                    </div>
                  </Avatar>
                  <div className="flex max-w-md items-center rounded-2xl rounded-bl-none bg-muted p-4">
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4 bg-background/50">
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-4"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              rows={1}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              <SendHorizonal className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
      <CrisisAlert open={showCrisisAlert} onOpenChange={setShowCrisisAlert} />
    </div>
  );
}
