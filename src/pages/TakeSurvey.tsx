import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { mockSurveys, Survey, Question, Response } from '../lib/types';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export function TakeSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState<Date>(new Date());

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
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{
          backgroundColor: survey.theme.backgroundColor,
          color: survey.theme.fontColor,
        }}
      >
        <div className="max-w-md mx-auto">
          <div className="mb-6 rounded-full bg-green-100 p-3 mx-auto w-fit">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="mb-8 text-muted-foreground">
            Your response has been recorded. We appreciate your feedback!
          </p>
          <Button 
            onClick={() => navigate('/')}
            style={{ 
              backgroundColor: survey.theme.primaryColor,
              color: '#ffffff'
            }}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;

  const goToNextQuestion = () => {
    // Validate required questions
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      toast.error('This question is required');
      return;
    }
    
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSingleChoiceChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleMultipleChoiceChange = (questionId: string, value: string, checked: boolean) => {
    const currentValues = (answers[questionId] as string[]) || [];
    
    if (checked) {
      setAnswers({
        ...answers,
        [questionId]: [...currentValues, value]
      });
    } else {
      setAnswers({
        ...answers,
        [questionId]: currentValues.filter(v => v !== value)
      });
    }
  };

  const handleRatingChange = (questionId: string, value: number) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate required questions
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      toast.error('This question is required');
      return;
    }
    
    // Calculate duration
    const endTime = new Date();
    const durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    // Create response object
    const response: Response = {
      id: uuidv4(),
      surveyId: survey.id,
      answers: Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value
      })),
      createdAt: new Date(),
      metadata: {
        duration: durationInSeconds
      }
    };
    
    // In a real app, this would save to a database
    console.log('Submitting response:', response);
    
    // Show success message
    toast.success('Response submitted successfully');
    setSubmitted(true);
  };

  const renderQuestionInput = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <Textarea
            value={(answers[question.id] as string) || ''}
            onChange={(e) => handleTextChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full"
          />
        );
      case 'email':
        return (
          <Input
            type="email"
            value={(answers[question.id] as string) || ''}
            onChange={(e) => handleTextChange(question.id, e.target.value)}
            placeholder="your@email.com"
            className="w-full"
          />
        );
      case 'singleChoice':
        return (
          <RadioGroup
            value={(answers[question.id] as string) || ''}
            onValueChange={(value) => handleSingleChoiceChange(question.id, value)}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'multipleChoice':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option}`}
                  checked={((answers[question.id] as string[]) || []).includes(option)}
                  onCheckedChange={(checked) => 
                    handleMultipleChoiceChange(question.id, option, checked as boolean)
                  }
                />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case 'rating':
        const scale = question.scale || 5;
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: scale }, (_, i) => i + 1).map((rating) => (
              <Button
                key={rating}
                type="button"
                variant={(answers[question.id] as number) === rating ? 'default' : 'outline'}
                className="h-12 w-12 rounded-full"
                onClick={() => handleRatingChange(question.id, rating)}
                style={(answers[question.id] as number) === rating ? {
                  backgroundColor: survey.theme.primaryColor,
                  color: '#ffffff'
                } : {}}
              >
                {rating}
              </Button>
            ))}
          </div>
        );
      default:
        return <div>Unsupported question type</div>;
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

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {/* Question content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full">
          <div className="w-full mb-8">
            <h2 className="text-2xl font-bold mb-2">{currentQuestion.title}</h2>
            {currentQuestion.description && (
              <p className="text-muted-foreground">{currentQuestion.description}</p>
            )}
          </div>

          <div className="w-full mb-8">
            {renderQuestionInput(currentQuestion)}
          </div>

          <div className="flex justify-between w-full">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={isFirstQuestion}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            {isLastQuestion ? (
              <Button
                type="submit"
                className="gap-1"
                style={{ 
                  backgroundColor: survey.theme.primaryColor,
                  color: '#ffffff'
                }}
              >
                <span>Submit</span>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goToNextQuestion}
                className="gap-1"
                style={{ 
                  backgroundColor: survey.theme.primaryColor,
                  color: '#ffffff'
                }}
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}