"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const OPTION_LABELS = ["A", "B", "C", "D"];

const InterviewPrepPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  // Wrong-answer popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({ correctOption: "", explanation: "" });

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/interview-prep", { method: "POST" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data.questions);
      setStarted(true);
      setCurrentIndex(0);
      setScore(0);
      setFinished(false);
      setAnswered(false);
      setSelectedOption(null);
      setWrongAnswers([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (index) => {
    if (answered) return;

    const current = questions[currentIndex];
    setSelectedOption(index);
    setAnswered(true);

    if (index === current.correctIndex) {
      setScore((prev) => prev + 1);
    } else {
      const correctOption = `${OPTION_LABELS[current.correctIndex]}: ${current.options[current.correctIndex]}`;
      // Track wrong answer for results
      setWrongAnswers((prev) => [
        ...prev,
        {
          question: current.question,
          yourAnswer: `${OPTION_LABELS[index]}: ${current.options[index]}`,
          correctAnswer: correctOption,
          explanation: current.explanation,
        },
      ]);
      // Show popup with correct answer
      setPopupData({
        correctOption,
        explanation: current.explanation,
      });
      setShowPopup(true);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  };

  const getOptionStyle = (index) => {
    if (!answered) {
      return "bg-card border-border hover:bg-muted hover:border-primary cursor-pointer";
    }
    const current = questions[currentIndex];
    if (index === current.correctIndex) {
      return "bg-green-500/10 border-green-500 text-green-600 dark:text-green-400";
    }
    if (index === selectedOption && index !== current.correctIndex) {
      return "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400";
    }
    return "bg-card border-border opacity-50";
  };

  const getScoreLabel = () => {
    const pct = (score / questions.length) * 100;
    if (pct >= 80) return { label: "Excellent!", color: "bg-green-500" };
    if (pct >= 60) return { label: "Good job!", color: "bg-blue-500" };
    if (pct >= 40) return { label: "Keep practicing", color: "bg-yellow-500" };
    return { label: "Needs improvement", color: "bg-red-500" };
  };

  // ─── Start screen ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="container mx-auto p-6 mt-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Interview Prep</h1>
        <p className="text-muted-foreground mb-8">
          Test your Knowlege with Industry-specific questions
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Ready to begin?</CardTitle>
            <CardDescription>
              10 questions &bull; One correct answer each &bull; Instant feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="text-sm text-red-500 mb-4">Error: {error}</p>
            )}
            <Button onClick={fetchQuestions} disabled={loading} size="lg">
              {loading ? "Generating questions..." : "Start Quiz"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Results screen ────────────────────────────────────────────────────────
  if (finished) {
    const { label, color } = getScoreLabel();
    return (
      <div className="container mx-auto p-6 mt-8 max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold">Quiz Complete!</h1>

        {/* Score summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-4">
              <p className="text-6xl font-bold mb-2">
                {score}<span className="text-2xl text-muted-foreground">/{questions.length}</span>
              </p>
              <Badge className={`${color} text-white text-sm px-3 py-1`}>{label}</Badge>
            </div>
            <Progress value={(score / questions.length) * 100} className="h-3" />
            <p className="text-muted-foreground text-center text-sm">
              You answered {score} out of {questions.length} questions correctly (
              {Math.round((score / questions.length) * 100)}%)
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchQuestions} disabled={loading}>
                {loading ? "Generating..." : "Try Again"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Areas to improve */}
        {wrongAnswers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Areas to Improve</CardTitle>
              <CardDescription>
                You got {wrongAnswers.length} question{wrongAnswers.length > 1 ? "s" : ""} wrong. Review the concepts below to strengthen your knowledge.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {wrongAnswers.map((item, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <p className="font-medium text-sm">{i + 1}. {item.question}</p>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-start gap-2 p-2 rounded-md bg-red-500/10 border border-red-500/20">
                      <span className="text-red-500 font-semibold shrink-0">✗ Your answer:</span>
                      <span className="text-muted-foreground">{item.yourAnswer}</span>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded-md bg-green-500/10 border border-green-500/20">
                      <span className="text-green-600 dark:text-green-400 font-semibold shrink-0">✓ Correct:</span>
                      <span>{item.correctAnswer}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                    <span className="font-semibold text-foreground">Suggestion: </span>
                    {item.explanation}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {wrongAnswers.length === 0 && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="py-6 text-center">
              <p className="text-green-600 dark:text-green-400 font-semibold text-lg">🎉 Perfect Score!</p>
              <p className="text-muted-foreground text-sm mt-1">You answered every question correctly. Great work!</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ─── Quiz screen ───────────────────────────────────────────────────────────
  const current = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="container mx-auto p-6 mt-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Interview Prep</h1>
        <Badge variant="outline">
          {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      {/* Progress bar */}
      <Progress value={progress} className="mb-6 h-2" />

      {/* Question card */}
      <Card>
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wide font-medium">
            Question {currentIndex + 1}
          </CardDescription>
          <CardTitle className="text-lg leading-snug">{current.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {current.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 ${getOptionStyle(index)}`}
            >
              <span className="font-semibold mr-2">{OPTION_LABELS[index]}.</span>
              {option}
            </button>
          ))}

          {/* Inline explanation for correct answers */}
          {answered && selectedOption === current.correctIndex && (
            <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-700 dark:text-green-400">
              <span className="font-semibold">Correct! </span>
              {current.explanation}
            </div>
          )}

          {answered && (
            <Button onClick={handleNext} className="w-full mt-2">
              {currentIndex + 1 >= questions.length ? "See Results" : "Next Question →"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Score tracker */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Score so far: <span className="font-semibold">{score}</span> correct
      </p>

      {/* Wrong answer popup */}
      <AlertDialog open={showPopup} onOpenChange={setShowPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">Incorrect Answer</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="font-semibold text-green-700 dark:text-green-400 mb-1">
                    Correct Answer:
                  </p>
                  <p className="text-foreground">{popupData.correctOption}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Explanation:</p>
                  <p>{popupData.explanation}</p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowPopup(false)}>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InterviewPrepPage;
