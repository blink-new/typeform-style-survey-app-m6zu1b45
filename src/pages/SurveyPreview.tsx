import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { mockSurveys, Survey } from '../lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function SurveyPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundSurvey = mockSurveys.find(s => s.id === id);
      if (foundSurvey) {
        setSurvey(foundSurvey);
      } else {
        toast.error('Survey not found');
        navigate('/');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!survey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Survey not found</h1>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    );
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;

  const goToNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: survey.theme.backgroundColor,
        color: survey.theme.fontColor,
      }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <Button 
          variant="ghost" 
          className="gap-1"
          onClick={() => navigate(`/edit/${survey.id}`)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Editor</span>
        </Button>
        <div className="text-sm">
          Preview Mode
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {survey.questions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">No questions yet</h2>
            <p className="mb-4 text-muted-foreground">
              Add some questions to your survey to preview it
            </p>
            <Button onClick={() => navigate(`/edit/${survey.id}`)}>
              Back to Editor
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-1">
              <div 
                className="h-1 transition-all duration-300 ease-in-out"
                style={{ 
                  width: `${((currentQuestionIndex + 1) / survey.questions.length) * 100}%`,
                  backgroundColor: survey.theme.primaryColor 
                }}
              ></div>
            </div>

            {/* Question content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full">
              <div className="w-full mb-8">
                <h2 className="text-2xl font-bold mb-2">{currentQuestion.title}</h2>
                {currentQuestion.description && (
                  <p className="text-muted-foreground">{currentQuestion.description}</p>
                )}
              </div>

              <div className="w-full mb-8">
                {/* This would be replaced with actual input components based on question type */}
                <div className="p-4 border rounded-md bg-white/50 text-center text-muted-foreground">
                  Input field for {currentQuestion.type} question type would appear here
                </div>
              </div>

              <div className="flex justify-between w-full">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={isFirstQuestion}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                
                <Button
                  onClick={goToNextQuestion}
                  disabled={isLastQuestion}
                  className="gap-1"
                  style={{ 
                    backgroundColor: survey.theme.primaryColor,
                    color: '#ffffff'
                  }}
                >
                  <span>{isLastQuestion ? 'Submit' : 'Next'}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}