

export enum PaperType {
  MIDSEM = 'Midsem',
  ENDSEM = 'Endsem',
  QUIZ = 'Quiz',
  ASSIGNMENT = 'Assignment'
}

export type ApprovalStatus = 'published' | 'pending' | 'rejected';

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'Exam' | 'General' | 'Event' | 'Important';
  link?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  color: string;
  iconName: string;
}

export interface PYQ {
  id: string;
  departmentId: string;
  semester: number;
  year: number;
  type: PaperType;
  title: string;
  downloadUrl: string;
  size: string;
  status: ApprovalStatus;
  submittedBy?: string;
  submittedDate?: string;
}

export interface NoteSection {
  id: string;
  title: string;
  content: string; // In a real app, this might be Markdown or HTML
}

export interface Note {
  id: string;
  title: string;
  departmentId: string;
  semester: number;
  author: string;
  lastUpdated: string;
  sections?: NoteSection[];
  pdfUrl?: string;
  storagePath?: string;
  views: number;
  status: ApprovalStatus;
  submittedBy?: string;
  submittedDate?: string;
}

export type FilterState = {
  department: string | 'all';
  semester: number | 'all';
  year: number | 'all';
  type: PaperType | 'all';
  search: string;
  subject: string | 'all';
};

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date; // ISO date string YYYY-MM-DD
  type: 'exam' | 'study' | 'assignment' | 'other';
}
