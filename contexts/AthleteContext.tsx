import React, { createContext, ReactNode, useContext, useState } from 'react';

// Types
export interface AthleteProfile {
  firstName: string;
  lastName: string;
  gender: string;
  state: string;
  district: string;
  sport: string;
  category: string;
  dateOfBirth?: string;
}

export interface Athlete {
  _id: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: AthleteProfile;
}

export interface Submission {
  _id: string;
  athleteId: string;
  athlete: Athlete;
  testType: string;
  score: number;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
  notes?: string;
}

interface AthleteContextType {
  athletes: Athlete[];
  submissions: Submission[];
  setAthletes: (athletes: Athlete[]) => void;
  setSubmissions: (submissions: Submission[]) => void;
  verifyAthlete: (athleteId: string) => void;
  rejectAthlete: (athleteId: string, reason: string) => void;
  approveSubmission: (submissionId: string) => void;
  rejectSubmission: (submissionId: string, reason?: string) => void;
  getPendingVerifications: () => Athlete[];
  getPendingSubmissions: () => Submission[];
}

const AthleteContext = createContext<AthleteContextType | undefined>(undefined);

export const useAthleteContext = () => {
  const context = useContext(AthleteContext);
  if (!context) {
    throw new Error('useAthleteContext must be used within an AthleteProvider');
  }
  return context;
};

interface AthleteProviderProps {
  children: ReactNode;
}

export const AthleteProvider: React.FC<AthleteProviderProps> = ({ children }) => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const verifyAthlete = (athleteId: string) => {
    setAthletes(prevAthletes => 
      prevAthletes.map(athlete => 
        athlete._id === athleteId 
          ? { ...athlete, isVerified: true, updatedAt: new Date().toISOString() }
          : athlete
      )
    );
  };

  const rejectAthlete = (athleteId: string, reason: string) => {
    // For now, we'll just remove the athlete from the list
    // In a real app, you might want to mark them as rejected instead
    setAthletes(prevAthletes => 
      prevAthletes.filter(athlete => athlete._id !== athleteId)
    );
    console.log(`Athlete ${athleteId} rejected: ${reason}`);
  };

  const approveSubmission = (submissionId: string) => {
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(submission =>
        submission._id === submissionId
          ? { ...submission, status: 'approved' as const }
          : submission
      )
    );
  };

  const rejectSubmission = (submissionId: string, reason?: string) => {
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(submission =>
        submission._id === submissionId
          ? { ...submission, status: 'rejected' as const, notes: reason }
          : submission
      )
    );
  };

  const getPendingVerifications = () => {
    return athletes.filter(athlete => !athlete.isVerified);
  };

  const getPendingSubmissions = () => {
    return submissions.filter(submission => submission.status === 'pending');
  };

  const value: AthleteContextType = {
    athletes,
    submissions,
    setAthletes,
    setSubmissions,
    verifyAthlete,
    rejectAthlete,
    approveSubmission,
    rejectSubmission,
    getPendingVerifications,
    getPendingSubmissions,
  };

  return (
    <AthleteContext.Provider value={value}>
      {children}
    </AthleteContext.Provider>
  );
};