

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

export const ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'End Semester Exam Schedule Released (Nov-Dec 2024)', date: '2 hours ago', category: 'Important', link: '#' },
  { id: '2', title: 'TechFest "Innovate 2K24" Registration Open', date: '1 day ago', category: 'Event', link: '#' },
  { id: '3', title: 'Library timings changed for preparation leave', date: '3 days ago', category: 'General' },
  { id: '4', title: 'Result declared for 4th Semester Re-evaluation', date: '1 week ago', category: 'Exam', link: '#' },
];

export const PYQS: PYQ[] = [
  { id: '1', departmentId: 'cse', semester: 3, year: 2023, type: PaperType.ENDSEM, title: 'Data Structures End Semester 2023', downloadUrl: '#', size: '1.2 MB', status: 'published' },
  { id: '2', departmentId: 'cse', semester: 3, year: 2023, type: PaperType.MIDSEM, title: 'Data Structures Mid Semester 2023', downloadUrl: '#', size: '800 KB', status: 'published' },
  { id: '3', departmentId: 'ee', semester: 4, year: 2022, type: PaperType.ENDSEM, title: 'Circuit Theory End Semester 2022', downloadUrl: '#', size: '2.1 MB', status: 'published' },
  { id: '4', departmentId: 'cse', semester: 3, year: 2022, type: PaperType.ENDSEM, title: 'Data Structures End Semester 2022', downloadUrl: '#', size: '1.1 MB', status: 'published' },
  { id: '5', departmentId: 'cse', semester: 1, year: 2023, type: PaperType.QUIZ, title: 'Linear Algebra Quiz 1', downloadUrl: '#', size: '200 KB', status: 'published' },
  { id: '6', departmentId: 'it', semester: 5, year: 2021, type: PaperType.ENDSEM, title: 'DBMS End Semester 2021', downloadUrl: '#', size: '1.5 MB', status: 'published' },
  { id: '7', departmentId: 'ece', semester: 6, year: 2023, type: PaperType.ASSIGNMENT, title: 'Quantum Mechanics Assignment 3', downloadUrl: '#', size: '450 KB', status: 'published' },
  { id: '8', departmentId: 'ee', semester: 4, year: 2023, type: PaperType.MIDSEM, title: 'Circuit Theory Mid Semester 2023', downloadUrl: '#', size: '900 KB', status: 'published' },
  { id: '9', departmentId: 'me', semester: 2, year: 2022, type: PaperType.ENDSEM, title: 'Thermodynamics End Semester 2022', downloadUrl: '#', size: '1.8 MB', status: 'published' },
  { id: '10', departmentId: 'ce', semester: 7, year: 2023, type: PaperType.MIDSEM, title: 'Structural Analysis Mid Semester', downloadUrl: '#', size: '1.3 MB', status: 'published' },
];

export const NOTES: Note[] = [
  {
    id: 'note1',
    title: 'Mastering AVL Trees',
    departmentId: 'cse',
    semester: 3,
    author: 'Rahul S.',
    lastUpdated: '2 days ago',
    views: 1240,
    status: 'published',
    sections: [
      { id: 'intro', title: 'Introduction', content: 'AVL trees are self-balancing Binary Search Trees (BST). In an AVL tree, the heights of the two child subtrees of any node differ by at most one; if at any time they differ by more than one, rebalancing is done to restore this property.' },
      { id: 'rotation', title: 'Rotations', content: 'Rebalancing is done through four types of rotations: Left Rotation (LL), Right Rotation (RR), Left-Right Rotation (LR), and Right-Left Rotation (RL).' },
      { id: 'complexity', title: 'Time Complexity', content: 'Lookup, insertion, and deletion all take O(log n) time in both the average and worst cases, where n is the number of nodes in the tree prior to the operation.' },
    ]
  },
  {
    id: 'note2',
    title: 'Maxwell Equations Simplified',
    departmentId: 'ee',
    semester: 4,
    author: 'Priya K.',
    lastUpdated: '1 week ago',
    views: 850,
    status: 'published',
    sections: [
      { id: 'gauss', title: 'Gauss Law', content: 'The total electric flux out of a closed surface is equal to the charge enclosed divided by the permittivity.' },
      { id: 'faraday', title: 'Faraday Law', content: 'The line integral of the electric field around a closed loop is equal to the negative of the rate of change of the magnetic flux through the area enclosed by the loop.' },
    ]
  },
  {
    id: 'note3',
    title: 'Thermodynamics: The Second Law',
    departmentId: 'me',
    semester: 2,
    author: 'Amit V.',
    lastUpdated: '3 days ago',
    views: 560,
    status: 'published',
    sections: [
      { id: 'entropy', title: 'Entropy', content: 'Entropy is a measure of the disorder of a system. The second law states that the total entropy of an isolated system can never decrease over time.' },
      { id: 'carnot', title: 'Carnot Cycle', content: 'The Carnot cycle is a theoretical ideal thermodynamic cycle proposed by French physicist Sadi Carnot.' }
    ]
  },
  {
    id: 'note4',
    title: 'Fluid Mechanics: Bernoulli\'s Principle',
    departmentId: 'ce',
    semester: 4,
    author: 'Sara M.',
    lastUpdated: '1 month ago',
    views: 2100,
    status: 'published',
    sections: [
      { id: 'equation', title: 'Bernoulli Equation', content: 'For an incompressible, inviscid fluid flow, an increase in the speed of the fluid occurs simultaneously with a decrease in static pressure or a decrease in the fluid\'s potential energy.' }
    ]
  },
  {
    id: 'note5',
    title: 'Digital Logic: K-Maps',
    departmentId: 'ece',
    semester: 3,
    author: 'John D.',
    lastUpdated: '2 weeks ago',
    views: 1500,
    status: 'published',
    sections: [
        { id: 'grouping', title: 'Grouping Rules', content: 'Groups must contain 1, 2, 4, 8, or 16 cells. Groups must be rectangular. Groups must be as large as possible.'}
    ]
  },
  {
    id: 'note6',
    title: 'OS: Process Scheduling Algorithms',
    departmentId: 'it',
    semester: 5,
    author: 'Priya R.',
    lastUpdated: '5 days ago',
    views: 980,
    status: 'published',
    sections: [
        { id: 'fcfs', title: 'First-Come, First-Served', content: 'The process that arrives first is executed first.'},
        { id: 'sjf', title: 'Shortest Job First', content: 'The process with the smallest execution time is selected next.'}
    ]
  },
  {
    id: 'note7',
    title: 'Introduction to React.js',
    departmentId: 'cse',
    semester: 6,
    author: 'Dev Team',
    lastUpdated: '1 day ago',
    views: 3200,
    status: 'published',
    sections: [
        { id: 'components', title: 'Components', content: 'Components are the building blocks of any React application.'}
    ]
  },
  {
    id: 'note8',
    title: 'Concrete Technology',
    departmentId: 'ce',
    semester: 5,
    author: 'Civil Dept',
    lastUpdated: '2 months ago',
    views: 800,
    status: 'published',
    sections: [
        { id: 'mix', title: 'Mix Design', content: 'The process of selecting suitable ingredients of concrete and determining their relative amounts.'}
    ]
  }
];

export const PENDING_SUBMISSIONS: (PYQ | Note)[] = [
    {
        id: 'pending1',
        departmentId: 'cse',
        semester: 4,
        year: 2024,
        type: PaperType.MIDSEM,
        title: 'Computer Architecture Midsem 2024',
        downloadUrl: '#',
        size: '1.5 MB',
        status: 'pending',
        submittedBy: 'StudentUser123',
        submittedDate: '2024-03-15'
    } as PYQ,
    {
        id: 'pending2',
        title: 'Intro to Machine Learning',
        departmentId: 'cse',
        semester: 6,
        author: 'AI Enthusiast',
        lastUpdated: '1 hour ago',
        views: 0,
        status: 'pending',
        submittedBy: 'ML_Student',
        submittedDate: '2024-03-16',
        sections: [{ id: 'intro', title: 'What is ML?', content: 'Machine Learning is...' }]
    } as Note
];

export const YEARS = [2023, 2022, 2021, 2020, 2019];
