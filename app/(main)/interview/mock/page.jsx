"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const MockInterviewPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [targetRole, setTargetRole] = useState("Software Engineer");

  const startInterview = async () => {
    setStarted(true);
    setLoading(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], targetRole }),
      });
      const data = await res.json();
      setMessages([{ role: "assistant", content: data.text }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, targetRole }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.text }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 mt-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Mock Interview</h1>
      
      {!started ? (
        <Card>
          <CardHeader>
            <CardTitle>Start Your Practice Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Target Role</label>
              <Input 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)} 
                placeholder="e.g. Frontend Developer"
              />
            </div>
            <Button onClick={startInterview} disabled={loading}>
              {loading ? "Starting..." : "Start Interview"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Interview in Progress: {targetRole}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 min-h-0 pr-4 mb-4">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground ml-auto" 
                        : "bg-muted mr-auto"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {loading && (
                  <div className="bg-muted p-3 rounded-lg max-w-[80%] mr-auto animate-pulse">
                    Typing...
                  </div>
                )}
              </div>
            </ScrollArea>
            <form onSubmit={sendMessage} className="flex gap-2 mt-auto">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Type your answer..."
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !input.trim()}>Send</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MockInterviewPage;