import React, { useEffect } from 'react';
import { BookOpen, FileText, CheckCircle2, Calendar, ShieldCheck } from 'lucide-react';

export const PanicDisguise = ({ onDismiss }) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Classes - Google Classroom';

    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === '[') {
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.title = originalTitle;
      window.removeEventListener('keydown', handleKey);
    };
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9fa] text-[#3c4043] font-sans flex flex-col overflow-y-auto">
      {/* Google Classroom Navbar Mockup */}
      <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 flex flex-col justify-around">
            <span className="w-5 h-0.5 bg-gray-600"></span>
            <span className="w-5 h-0.5 bg-gray-600"></span>
            <span className="w-5 h-0.5 bg-gray-600"></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium text-gray-700">Google Classroom</span>
            <span className="text-gray-400">›</span>
            <span className="text-base font-normal text-gray-600">AP Literature & Composition (Period 3)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onDismiss}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
            title="Return to Nexus Arcade (Shortcut: Esc)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resume Arcade (Esc)</span>
          </button>

          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
            S
          </div>
        </div>
      </header>

      {/* Classroom Content Body */}
      <main className="max-w-4xl w-full mx-auto p-6 space-y-6">
        {/* Course Banner */}
        <div className="h-44 rounded-xl bg-gradient-to-r from-teal-800 to-emerald-900 text-white p-6 flex flex-col justify-end shadow-xs">
          <h1 className="text-2xl font-bold tracking-tight">AP Literature & Critical Reading</h1>
          <p className="text-sm text-teal-200 mt-1">Section 04 · Room 218 · Mr. Henderson</p>
        </div>

        {/* Assignments & Announcements Feed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming Sidebar */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-3 h-fit">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-700" />
              <span>Upcoming Due Dates</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <div className="font-semibold text-gray-900">Hamlet Act IV Essay Outline</div>
                <div className="text-gray-500 mt-0.5">Due Tomorrow, 11:59 PM</div>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <div className="font-semibold text-gray-900">Vocabulary Quiz #8</div>
                <div className="text-gray-500 mt-0.5">Due Friday, 8:00 AM</div>
              </div>
            </div>
          </div>

          {/* Stream Feed */}
          <div className="md:col-span-2 space-y-4">
            <div className="p-4 bg-white border border-gray-200 rounded-xl flex items-start gap-4">
              <div className="p-2.5 rounded-full bg-teal-100 text-teal-800 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">Mr. Henderson posted a new assignment: Unit 3 Thesis Statements</span>
                  <span>Yesterday</span>
                </div>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Please review the attached rubric on thesis development in analytical writing. Ensure you cite at least two primary source quotations.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-teal-700 font-medium">
                  <BookOpen className="w-4 h-4" />
                  <span>View Assignment Guidelines.pdf (142 KB)</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-xl flex items-start gap-4">
              <div className="p-2.5 rounded-full bg-blue-100 text-blue-800 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">Peer Review: Analytical Commentary</span>
                  <span>Oct 18</span>
                </div>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Status: Graded (96/100). Excellent breakdown of rhetorical devices and tragic flaws.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
