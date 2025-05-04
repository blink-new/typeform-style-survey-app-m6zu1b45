import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { QuestionCard } from '../components/survey/QuestionCard';
import { Survey, Question, mockSurveys } from '../lib/types';
import { Plus, Save, Eye, ChevronLeft, Palette } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function CreateSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('questions');
  
  const defaultSurvey: Survey = {
    id: uuidv4(),
    title: 'Untitled Survey',
    description: '',
    questions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    published: false,
    theme: {
      primaryColor: '#6366f1',
      backgroundColor: '#ffffff',
      fontColor: '#1f2937',
    },
  };

  const [survey, setSurvey] = useState<Survey>(defaultSurvey);

  useEffect(() => {
    if (id) {
      const existingSurvey = mockSurveys.find(s => s.id === id);
      if (existingSurvey) {
        setSurvey(existingSurvey);
      } else {
        toast.error('Survey not found');
        navigate('/');
      }
    }
  }, [id, navigate]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'text',
      title: '',
      required: false,
    };

    setSurvey({
      ...survey,
      questions: [...survey.questions, newQuestion],
      updatedAt: new Date(),
    });
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[index] = updatedQuestion;
    
    setSurvey({
      ...survey,
      questions: updatedQuestions,
      updatedAt: new Date(),
    });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions.splice(index, 1);
    
    setSurvey({
      ...survey,
      questions: updatedQuestions,
      updatedAt: new Date(),
    });
  };

  const saveSurvey = () => {
    // In a real app, this would save to a database
    toast.success('Survey saved successfully');
    
    // For now, just navigate back to dashboard
    navigate('/');
  };

  const previewSurvey = () => {
    // In a real app with persistence, we would save first then navigate
    // For now, just show a toast message
    toast('Preview functionality coming soon');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4 gap-1 text-muted-foreground"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex-1">
            <Input
              value={survey.title}
              onChange={(e) => setSurvey({ ...survey, title: e.target.value, updatedAt: new Date() })}
              placeholder="Survey Title"
              className="text-3xl font-bold border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Textarea
              value={survey.description || ''}
              onChange={(e) => setSurvey({ ...survey, description: e.target.value, updatedAt: new Date() })}
              placeholder="Add a description (optional)"
              className="mt-2 resize-none border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1" onClick={previewSurvey}>
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
            <Button className="gap-1" onClick={saveSurvey}>
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>

      <TabsContent value="questions" className="mt-0">
        <div className="space-y-4">
          {survey.questions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">No questions yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Start building your survey by adding your first question
                </p>
                <Button onClick={addQuestion}>Add Question</Button>
              </CardContent>
            </Card>
          ) : (
            <div>
              {survey.questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onChange={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                  onDelete={() => removeQuestion(index)}
                />
              ))}
              <Button 
                variant="outline" 
                className="w-full py-6 border-dashed gap-2"
                onClick={addQuestion}
              >
                <Plus className="h-4 w-4" />
                <span>Add Question</span>
              </Button>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="theme" className="mt-0">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3 mx-auto w-fit">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Theme Customization</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Theme customization will be available in the next version
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="mt-0">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3 mx-auto w-fit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-medium">Survey Settings</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Advanced settings will be available in the next version
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}