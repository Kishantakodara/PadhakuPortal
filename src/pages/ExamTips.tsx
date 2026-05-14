
import React, { useState } from 'react';
import { Sparkles, Brain, Clock, Target, Zap, BookOpen, ChevronDown, ChevronUp, Trophy, AlertTriangle, CheckCircle, Coffee, ListChecks, Star } from 'lucide-react';

interface Tip {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const tips: Tip[] = [
  {
    id: 'active-recall',
    title: 'Use Active Recall, Not Passive Re-reading',
    content: 'Instead of re-reading your notes, close the book and try to recall everything you just studied. Write it down or say it out loud. This forces your brain to retrieve information, which dramatically strengthens memory. Studies show active recall is 2–3× more effective than passive reading.',
    icon: <Brain className="h-6 w-6" />,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/40',
  },
  {
    id: 'spaced-repetition',
    title: 'Master Spaced Repetition',
    content: 'Don\'t cram — space your study sessions. Review material on Day 1, Day 3, Day 7, Day 14, and Day 30. Each time you revisit a topic just before you\'re about to forget it, the memory gets stronger. Use tools like Anki or simply mark chapters in your notes to revisit on schedule.',
    icon: <Clock className="h-6 w-6" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/40',
  },
  {
    id: 'pomodoro',
    title: 'The Pomodoro Technique for Focus',
    content: 'Study for 25 minutes, take a 5-minute break. After 4 cycles, take a longer 20–30 minute break. This prevents burnout and keeps your concentration sharp. During the break, avoid your phone — look outside, stretch, or drink water. Your brain consolidates memory during these rests.',
    icon: <Coffee className="h-6 w-6" />,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/40',
  },
  {
    id: 'past-papers',
    title: 'Solve PYQs Before Anything Else',
    content: 'Previous Year Questions (PYQs) are gold. Exam patterns repeat more than you think. Solve at least the last 5 years of papers under timed conditions. Identify repeated topics — those are high-priority. You\'ll notice certain derivations, theorems, and numerical types appear almost every year.',
    icon: <Target className="h-6 w-6" />,
    color: 'text-brand-orange',
    bgColor: 'bg-orange-100 dark:bg-orange-900/40',
  },
  {
    id: 'teach-it',
    title: 'Teach the Concept to Someone Else',
    content: 'The Feynman Technique: pick a topic, explain it as if teaching a 10-year-old. If you stumble, you\'ve found a gap. Go back, understand it deeper, and explain again. This method is used by Nobel Prize winners and is the fastest path to deep understanding, not just surface-level memorization.',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/40',
  },
  {
    id: 'formula-sheet',
    title: 'Build Your Own Formula Sheet',
    content: 'Don\'t use pre-made formula sheets — create your own. The act of writing down each formula by hand and organizing them is itself a study session. Review your sheet the night before the exam and 30 minutes before entering the hall. This activates your working memory right when you need it.',
    icon: <ListChecks className="h-6 w-6" />,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/40',
  },
  {
    id: 'morning-advantage',
    title: 'Study Hard Topics in the Morning',
    content: 'Your prefrontal cortex (the part responsible for logic and analysis) is most active in the morning. Schedule your toughest subjects — Math, circuits, thermodynamics — for the first 2–3 hours of your day. Save light revision and reading for the evening. This simple scheduling change can dramatically improve retention.',
    icon: <Zap className="h-6 w-6" />,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/40',
  },
  {
    id: 'exam-strategy',
    title: 'Smart Exam Hall Strategy',
    content: 'Scan the full paper in the first 3 minutes. Attempt the questions you know best first — this builds confidence and secures marks. Skip questions you\'re stuck on; come back later. For long-answer questions, write a clear structure (intro, body, conclusion) even if content is incomplete. Neat, organized answers score better.',
    icon: <Trophy className="h-6 w-6" />,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/40',
  },
];

const mistakes = [
  { text: 'Highlighting everything (it gives a false sense of understanding)', icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
  { text: 'Studying without a plan — random reading wastes time', icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
  { text: 'Pulling all-nighters before the exam — sleep is when memory consolidates', icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
  { text: 'Skipping numerical practice and only reading theory', icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
  { text: 'Comparing your preparation to others on the night before', icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
  { text: 'Ignoring syllabus — studying topics not asked in exams', icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
];

const habits = [
  { text: 'Sleep 7–8 hours every night — your brain files memories during sleep', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  { text: 'Exercise for 20–30 min daily — it boosts BDNF, the brain\'s growth hormone', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  { text: 'Stay hydrated — even 2% dehydration degrades cognitive performance by 10–20%', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  { text: 'Use the first 5 minutes to review previous session notes before starting new material', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  { text: 'Set a weekly goal and break it into daily targets on Sunday night', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  { text: 'Keep your phone in another room while studying — notifications break deep focus', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
];

const faqs: FAQ[] = [
  {
    question: 'How many days before exams should I start studying?',
    answer: 'Ideally 3–4 weeks before for thorough preparation. If you only have 1 week, focus exclusively on PYQs and high-weightage topics. The last 48 hours should be reserved only for revision — no new topics.',
  },
  {
    question: 'Should I study group or alone?',
    answer: 'Both have their place. Study alone for initial learning and memorization (1–2 hours). Then discuss concepts with a group to identify gaps. Teaching your peers is one of the highest-value activities you can do before exams.',
  },
  {
    question: 'What to do if I panic during the exam?',
    answer: 'Stop and take 5 slow, deep breaths. This activates your parasympathetic nervous system and reduces cortisol. Reread the question carefully — panic often causes misreading. Write whatever you know, even partial answers, as they often carry partial marks.',
  },
  {
    question: 'How do I tackle subjects I genuinely hate?',
    answer: 'Find one interesting application of the subject in the real world and connect theory to it. Break it into the smallest possible chunks. Study it first each day when your energy is highest. Use mnemonics and diagrams — visual memory often works better for boring content.',
  },
  {
    question: 'Is it okay to skip a topic completely?',
    answer: 'Strategic skipping is acceptable, but only after analyzing PYQs. If a topic has not appeared in the last 5 years and is conceptually heavy, it may be worth skipping if time is limited. However, never skip topics that carry guaranteed marks every year.',
  },
];

const ExamTips: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-navy-950 animate-slide-up pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-yellow-600 dark:via-orange-700 dark:to-red-700">
        <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-white blur-[80px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            Curated by Top Students
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
            Exam Tips That<br />
            <span className="text-yellow-100">Actually Work</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Evidence-based strategies, smart study habits, and exam hall tactics used by toppers across every semester.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Tips Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1 rounded-full bg-brand-orange" />
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">Core Study Strategies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${tip.bgColor} ${tip.color} group-hover:scale-110 transition-transform`}>
                  {tip.icon}
                </div>
                <h3 className={`text-lg font-bold text-navy-900 dark:text-white mb-3 group-hover:${tip.color} transition-colors`}>
                  {tip.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {tip.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Do / Don't */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Mistakes */}
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-bold text-navy-900 dark:text-white">Common Mistakes to Avoid</h3>
            </div>
            <ul className="space-y-3">
              {mistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <span className="mt-0.5 flex-shrink-0">{m.icon}</span>
                  {m.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Habits */}
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-bold text-navy-900 dark:text-white">Habits of Top Students</h3>
            </div>
            <ul className="space-y-3">
              {habits.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <span className="mt-0.5 flex-shrink-0">{h.icon}</span>
                  {h.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Last Night Checklist */}
        <div className="mb-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-navy-800 dark:to-navy-900 rounded-3xl border border-indigo-100 dark:border-navy-700 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Star className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-navy-900 dark:text-white">Night Before the Exam — Checklist</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Revise your handwritten formula sheet once',
              'Go through all PYQ solutions you marked as important',
              'Prepare your exam kit: pens, ID card, admit card',
              'Set TWO alarms — 30 min before expected wake time',
              'Eat a light but nutritious dinner',
              'Avoid social media after 9 PM — it disrupts sleep',
              'Do 10 minutes of light meditation or breathing exercises',
              'Sleep by 10:30–11:00 PM for 7+ hours of sleep',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white dark:bg-navy-900/50 rounded-xl p-3 border border-white dark:border-navy-700">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-300 dark:border-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1 rounded-full bg-brand-orange" />
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-navy-900 dark:text-white hover:text-brand-orange transition-colors"
                >
                  <span>{faq.question}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-5 w-5 flex-shrink-0 text-brand-orange" />
                    : <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-navy-800 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Motivational CTA */}
        <div className="text-center bg-gradient-to-r from-navy-900 to-blue-900 dark:from-navy-800 dark:to-navy-950 rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">You've Got This!</h2>
            <p className="text-blue-100 max-w-lg mx-auto mb-6 leading-relaxed">
              Preparation is never perfect, but consistent effort always beats last-minute cramming. Start today, one topic at a time.
            </p>
            <a
              href="https://chat.whatsapp.com/JKjcvjun6roIkbat7O59uJ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-hover transition-all shadow-lg shadow-orange-500/20"
            >
              <Sparkles className="h-5 w-5" />
              Join Study Community
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamTips;
