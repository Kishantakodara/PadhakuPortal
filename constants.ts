
import { PaperType, PYQ, Department, Note, Announcement } from './types';

export const DEPARTMENTS: Department[] = [
  { id: 'cse', name: 'Computer Engineering', code: '07', color: 'bg-blue-100 text-blue-700', iconName: 'Code' },
  { id: 'it', name: 'Information Technology', code: '16', color: 'bg-indigo-100 text-indigo-700', iconName: 'Monitor' },
  { id: 'ece', name: 'Electronics & Comm.', code: '11', color: 'bg-pink-100 text-pink-700', iconName: 'Cpu' },
  { id: 'ee', name: 'Electrical Engineering', code: '09', color: 'bg-yellow-100 text-yellow-700', iconName: 'Zap' },
  { id: 'me', name: 'Mechanical Engineering', code: '19', color: 'bg-orange-100 text-orange-700', iconName: 'Settings' },
  { id: 'chemical', name: 'Chemical Engineering', code: '05', color: 'bg-green-100 text-green-700', iconName: 'FlaskConical' },
  { id: 'ce', name: 'Civil Engineering', code: '06', color: 'bg-emerald-100 text-emerald-700', iconName: 'HardHat' },
  { id: 'ict', name: 'Info & Comm Tech', code: '32', color: 'bg-purple-100 text-purple-700', iconName: 'Network' },
  { id: 'eie', name: 'Electronics & Inst.', code: '47', color: 'bg-red-100 text-red-700', iconName: 'Activity' },
  { id: 'power', name: 'Power Electronics', code: '24', color: 'bg-amber-100 text-amber-700', iconName: 'BatteryCharging' },
  { id: 'ice', name: 'Inst. & Control', code: '17', color: 'bg-teal-100 text-teal-700', iconName: 'Gauge' },
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const ANNOUNCEMENTS: Announcement[] = [];

export const PYQS: PYQ[] = [];

export const NOTES: Note[] = [];

export const PENDING_SUBMISSIONS: (PYQ | Note)[] = [];

export const YEARS = [2023, 2022, 2021, 2020, 2019];
