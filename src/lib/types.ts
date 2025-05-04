export type QuestionType = 'text' | 'multipleChoice' | 'singleChoice' | 'rating' | 'email';

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: string[]; // For multiple/single choice questions
  scale?: number; // For rating questions (1-5, 1-10)
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    fontColor: string;
  };
}

export interface Response {
  id: string;
  surveyId: string;
  answers: {
    questionId: string;
    value: string | string[] | number;
  }[];
  createdAt: Date;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    duration?: number; // in seconds
  };
}

// Mock data for development
export const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Customer Feedback',
    description: 'Help us improve our service by providing your feedback',
    questions: [
      {
        id: '101',
        type: 'text',
        title: 'What is your name?',
        required: true,
      },
      {
        id: '102',
        type: 'email',
        title: 'What is your email address?',
        required: true,
      },
      {
        id: '103',
        type: 'singleChoice',
        title: 'How did you hear about us?',
        required: false,
        options: ['Social Media', 'Friend', 'Advertisement', 'Other'],
      },
      {
        id: '104',
        type: 'rating',
        title: 'How would you rate our service?',
        description: '1 = Poor, 5 = Excellent',
        required: true,
        scale: 5,
      },
      {
        id: '105',
        type: 'text',
        title: 'Any additional comments?',
        required: false,
      },
    ],
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15'),
    published: true,
    theme: {
      primaryColor: '#6366f1',
      backgroundColor: '#ffffff',
      fontColor: '#1f2937',
    },
  },
  {
    id: '2',
    title: 'Event Registration',
    description: 'Register for our upcoming event',
    questions: [
      {
        id: '201',
        type: 'text',
        title: 'Full Name',
        required: true,
      },
      {
        id: '202',
        type: 'email',
        title: 'Email Address',
        required: true,
      },
      {
        id: '203',
        type: 'multipleChoice',
        title: 'Which sessions are you interested in attending?',
        required: true,
        options: ['Morning Workshop', 'Afternoon Panel', 'Evening Networking'],
      },
    ],
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2023-06-12'),
    published: false,
    theme: {
      primaryColor: '#8b5cf6',
      backgroundColor: '#f3f4f6',
      fontColor: '#111827',
    },
  },
];

export const mockResponses: Response[] = [
  {
    id: '1001',
    surveyId: '1',
    answers: [
      { questionId: '101', value: 'John Doe' },
      { questionId: '102', value: 'john@example.com' },
      { questionId: '103', value: 'Friend' },
      { questionId: '104', value: 4 },
      { questionId: '105', value: 'Great service overall!' },
    ],
    createdAt: new Date('2023-05-16'),
    metadata: {
      duration: 120,
    },
  },
  {
    id: '1002',
    surveyId: '1',
    answers: [
      { questionId: '101', value: 'Jane Smith' },
      { questionId: '102', value: 'jane@example.com' },
      { questionId: '103', value: 'Social Media' },
      { questionId: '104', value: 5 },
      { questionId: '105', value: 'Excellent experience, will recommend!' },
    ],
    createdAt: new Date('2023-05-17'),
    metadata: {
      duration: 95,
    },
  },
];